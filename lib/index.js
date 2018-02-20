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
            return str;
        }

        this._emitter.emit(Events.JSON, obj);
        return "";
    }

    /**
     * Algorithm A2 finds the index of repeating JSON objects (i.e. '}{', '}[',
     * ']{', or '][') and uses JSON.parse to parse the string from the start to
     * the repeating value.  If the starting value of the buffer is not a valid
     * starting JSON object then the whole string is thrown out.  This is for
     * efficiency of not having to loop through the string to find a valid
     * starting character.  It should be nearly impossible for a corrupted
     * string to be sent across.  If there are no repeating JSON objects and the
     * last character is a valid JSON end character then the string is tested
     * for validity.  If there are not end characters and no repeating
     * characters then the buffer holds until more data is received.
     *
     * Note, difference is it uses Buffer instead of a string
     *
     * @param {Function} done - Function to call when the current buffer is
     *                          fully parsed
     * @returns {undefined}
     */
    _algA2 (done) {
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
            this._algA2(done);
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
    _algB (done) {
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
                return this._algB(done);
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
    _algE (done) {
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
            this._algE(done);
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
