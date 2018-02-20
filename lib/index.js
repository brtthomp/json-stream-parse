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

class Parser extends Stream.Writable {

    constructor () {
        super();

        this._buffer = "";
        this._emitter = new EventEmitter();
        this._searchIndex = 0;
        this._numBrackets = 0;
        this._beginIndex = -1;
        this._lastRead = 0;
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
            return;
        }

        this._emitter.emit(Events.JSON, obj);
    }

    /**
     * Parser A looks for repeated JSON objects (i.e. "][", "}{", "}[", or "]{").
     *
     * @param {Function} done - Function to call when the current buffer is
     *                          fully parsed
     * @returns {undefined}
     */
    _parserA (done) {
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

        const index = this._doubleIndexOf(endChar);

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
            this._parserA(done);
        }
    }

    _doubleIndexOf (char) {
        for (let i = this._searchIndex; i < this._buffer.length - 1; i += 1) {
            if (this._buffer[i] === char) {
                if (this._buffer[i + 1] === LSB) {
                    return i;
                } else if (this._buffer[i + 1] === LCB) {
                    return i;
                }
            }
        }

        return -1;
    }

    /**
     * AlgorithmB keeps track of JSON brackets to tell when a full JSON
     * object/array has been recevied.
     *
     * @param {Function} done Function to call when done parsing
     * @returns {undefined}
     */
    _parserB (done) {
        // Get starting bracket
        if (this._numBrackets === 0) {
            for (let i = 0; i < this._buffer.length; i += 1) {
                if (this._buffer[i] === LSB) {
                    this._startB = LSB;
                    this._endB = RSB;
                    this._startIndex = i;
                    this._numBrackets = 1;
                    break;
                } else if (this._buffer[i] === LCB) {
                    this._startB = LCB;
                    this._endB = RCB;
                    this._startIndex = i;
                    this._numBrackets = 1;
                    break;
                }
            }
        }

        for (let i = 1; i < this._buffer.length; i += 1) {
            if (this._buffer[i] === this._startB) {
                this._numBrackets += 1;
            } else if (this._buffer[i] === this._endB) {
                this._numBrackets -= 1;
            }

            if (this._numBrackets === 0) {
                this._parse(this._buffer.slice(this._startIndex, i + 1));
                this._buffer = this._buffer.slice(i + 1);
                return this._parserB(done);
            }
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
    _parserC (done) {
        let begin = null,
            end = null;

        begin = this._buffer.indexOf(SOH);
        if (begin >= 0) {
            end = this._buffer.indexOf(EOT);
        } else {
            this._buffer = Buffer.alloc(0);
            return done();
        }

        if (end >= 0) {
            this._parse(this._buffer.toString("utf8", begin + 1, end));
            this._buffer = this._buffer.slice(end + 1);
            this._parserC(done);
        } else {
            this._buffer = this._buffer.slice(begin);
            done();
        }
    }

    // ///////////////// //
    // Transform Methods //
    // ///////////////// //

    _write (chunk, encoding, cb) {
        this._buffer += chunk.toString();
        this._algA(cb);
    }

    // ///////////////////// //
    // End Transform Methods //
    // ///////////////////// //

}

module.exports = Parser;
