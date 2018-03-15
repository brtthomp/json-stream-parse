const EventEmitter = require("eventemitter3"),
    Stream = require("stream");

const Events = {
    Error: "jsonError",
    JSON: "json"
};

const EOT = 0x04,
    SOH = 0x01,
    LSB = 0x5b,
    RSB = 0x5d,
    LCB = 0x7b,
    RCB = 0x7d;

const ALG1 = 1;
const ALG2 = 2;
const ALG3 = 3;

const MIN_ASCII = 0x00;
const MAX_ASCII = 0x7F;

const DEF_ALG = ALG1;

class Parser extends Stream.Writable {

    constructor () {
        super();

        this._buffer = Buffer.alloc(0);
        this._emitter = new EventEmitter();
        this._searchIndex = 0;
        this._startIndex = -1;
        this._numBrackets = 0;
        this._startMarker = SOH;
        this._endMarker = EOT;
        this._algorithm = DEF_ALG;
    }

    get algorithm () {
        return this._algorithm;
    }

    get startMarker () {
        return this._startMarker;
    }

    get endMarker () {
        return this._endMarker;
    }

    set algorithm (value) {
        this._algorithm = value;
    }

    set startMarker (value) {
        if (typeof value === "string" && value.length === 1) {
            this._startMarker = value.charCodeAt(0);
        } else if (typeof value === "number" &&
            value >= MIN_ASCII &&
            value <= MAX_ASCII) {

            this._startMarker = value;
        } else {
            throw new Error("Invalid start marker");
        }
    }

    set endMarker (value) {
        if (typeof value === "string") {
            this._endMarker = value.charCodeAt(0);
        } else if (typeof value === "number" &&
            value >= MIN_ASCII &&
            value <= MAX_ASCII) {

            this._endMarker = value;
        } else {
            throw new Error("Invalid start marker");
        }
    }

    on (event, cb) {
        switch (event) {
        case Events.JSON:
            this._emitter.on(Events.JSON, cb);
            break;
        case Events.Error:
            this._emitter.on(Events.Error, cb);
            break;
        default:
            super.on(event, cb);
        }
    }

    _parse (str) {
        let obj = null;
        try {
            obj = JSON.parse(str);
        } catch (error) {
            if (error instanceof SyntaxError) {
                return error;
            }

            throw error;
        }

        this._emitter.emit(Events.JSON, obj);
    }

    /**
     * Parser A looks for repeated JSON objects (i.e. "][", "}{", "}[",
     * or "]{").
     *
     * @param {Function} done - Function to call when the current buffer is
     *                          fully parsed
     * @returns {undefined}
     */
    _algorithm1 (done) {
        let endChar = null;

        this._startChar = this._buffer[0];
        if (this._buffer[0] === LSB) {
            endChar = RSB;
        } else if (this._buffer[0] === LCB) {
            endChar = RCB;
        } else {
            this._buffer = Buffer.alloc(0);
            return done();
        }

        const index = this._getEndIndex(endChar);

        // Packet isn't complete
        if (index === -1 && this._buffer[this._buffer.length - 1] !== endChar) {
            this._searchIndex = this._buffer.length;
            done();
        } else if (index === -1) {
            // Packet might be complete
            if (this._parse(this._buffer.toString("utf8"))) {
                this._searchIndex = this._buffer.length;
            } else {
                this._buffer = Buffer.alloc(0);
                this._searchIndex = 0;
            }
            done();
        } else {
            this._parse(this._buffer.toString("utf8", 0, index + 1));
            this._buffer = this._buffer.slice(index + 1);
            this._searchIndex = 0;
            this._algorithm1(done);
        }
    }

    _getEndIndex (char) {
        const indexA = this._buffer.indexOf(
            `${String.fromCharCode(char)}[`,
            this._searchIndex
        );
        const indexB = this._buffer.indexOf(
            `${String.fromCharCode(char)}{`,
            this._searchIndex
        );
        let index = null;

        if (indexA === -1) {
            index = indexB;
        } else if (indexB === -1) {
            index = indexA;
        } else {
            index = indexA < indexB ?
                indexA :
                indexB;
        }

        return index;
    }

    /**
     * AlgorithmB keeps track of JSON brackets to tell when a full JSON
     * object/array has been recevied.
     *
     * @param {Function} done Function to call when done parsing
     * @returns {undefined}
     */
    _algorithm2 (done) {
        // Get starting bracket
        if (this._numBrackets === 0) {
            for (let i = 0; i < this._buffer.length; i += 1) {
                if (this._buffer[i] === LSB) {
                    this._startB = LSB;
                    this._endB = RSB;
                    this._startIndex = i;
                    this._searchIndex = i + 1;
                    this._numBrackets = 1;
                    break;
                } else if (this._buffer[i] === LCB) {
                    this._startB = LCB;
                    this._endB = RCB;
                    this._startIndex = i;
                    this._searchIndex = i + 1;
                    this._numBrackets = 1;
                    break;
                }
            }
        }

        if (this._startIndex >= 0) {
            for (let i = this._searchIndex; i < this._buffer.length; i += 1) {
                if (this._buffer[i] === this._startB) {
                    this._numBrackets += 1;
                } else if (this._buffer[i] === this._endB) {
                    this._numBrackets -= 1;
                }

                if (this._numBrackets === 0) {
                    this._parse(this._buffer.slice(this._startIndex, i + 1));
                    this._buffer = this._buffer.slice(i + 1);
                    return this._algorithm2(done);
                }
            }
        } else {
            this._buffer = Buffer.alloc(0);
        }

        if (this._buffer.length > 0) {
            this._searchIndex = this._buffer.length;
        }
        done();
    }

    /**
     * AlgorithmE uses start/stop characters to know when a JSON structure has
     * started or ended.  This also uses a Buffer instead of a String input
     *
     * @param {Function} done Function to call when done parsing
     * @returns {undefined}
     */
    _algorithm3 (done) {
        let end = null;

        // If the start index is set then we found it on a previous iteration
        if (this._startIndex < 0) {
            this._startIndex = this._buffer.indexOf(this._startMarker);
        }

        if (this._startIndex >= 0) {
            end = this._buffer.indexOf(this._endMarker, this._searchIndex);
        } else {
            this._buffer = Buffer.alloc(0);
            return done();
        }

        if (end >= 0) {
            this._parse(this._buffer.toString(
                "utf8",
                this._startIndex + 1,
                end
            ));
            this._buffer = this._buffer.slice(end + 1);
            this._startIndex = -1;
            this._searchIndex = 0;
            this._algorithm3(done);
        } else {
            this._buffer = this._buffer.slice(this._startIndex);
            this._searchIndex = this._buffer.length;
            done();
        }
    }

    // ///////////////// //
    // Transform Methods //
    // ///////////////// //

    _write (chunk, encoding, cb) {
        console.log(`Got new data: ${chunk.length} | ${encoding}`);
        console.log(chunk.toString());
        this._buffer = Buffer.concat([
            this._buffer,
            chunk
        ]);

        switch (this._algorithm) {
        case ALG1:
            this._algorithm1(cb);
            break;
        case ALG2:
            this._algorithm2(cb);
            break;
        case ALG3:
            this._algorithm3(cb);
            break;
        default:
            throw new Error("Inavlid parser");
        }
    }

    // ///////////////////// //
    // End Transform Methods //
    // ///////////////////// //

}

module.exports = Parser;
