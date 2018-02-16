'use strict';

const Writable = require('stream').Writable;
const EventEmitter = require('eventemitter3');

const Events = {
    JSON: 'json',
    Error: 'jsonError'
}

class Parser extends Writable {
    constructor() {
        super();

        this._buffer = "";
        this._emitter = new EventEmitter();
        this._searchIndex = 0;
    }

    on(event, cb) {
        switch (event) {
            case Events.JSON:
                this._emitter.on(Events.JSON, cb);
                break;
            case Events.Error:
                this._emitter.on(Events.Error, cb);
                break;
            default:
                super.on(event,cb);
        }
    }

    _parse(str) {
        let obj;
        try {
            obj = JSON.parse(str);
        } catch(error) {
            return str;
        }

        this._emitter.emit(Events.JSON, obj);
        return "";
    }

    /**
     * Algorithm A finds the index of repeating JSON objects (i.e. '}{', 
     * '}[', ']{', or '][') and uses JSON.parse to parse the string from
     * the start to the repeating value.  If the starting value of the
     * buffer is not a valid starting JSON object then the whole string is
     * thrown out.  This is for efficiency of not having to loop through
     * the string to find a valid starting character.  It should be nearly
     * impossible for a corrupted string to be sent across.  If there are 
     * no repeating JSON objects and the last character is a valid JSON
     * end character then the string is tested for validity.  If there are
     * not end characters and no repeating characters then the buffer holds
     * until more data is received.
     * 
     * @param {Function} done - Function to call when the current buffer is 
     *                          fully parsed
     * @returns {undefined}
     */
    _algA(done) {
        let endChar;

        if(this._buffer[0] === '[') endChar = ']';
        else if(this._buffer[0] === '{') endChar = '}';
        else {
            this._buffer = "";
            return done();
        }
    
        const indexA = this._buffer.indexOf(`${endChar}[`, this._searchIndex);
        const indexB = this._buffer.indexOf(`${endChar}{`, this._searchIndex);
        let index;
        if(indexA === -1) index = indexB;
        else if(indexB === -1) index = indexA;
        else index = indexA < indexB ? indexA : indexB;
    
        // Packet isn't complete
        if(index === -1 && this._buffer[this._buffer.length - 1] !== endChar) {
            this._searchIndex = this._buffer.length;
            done();
        } else if(index === -1) {
            // Packet might be complete
            this._buffer = this._parse(this._buffer);
            if(this._buffer) this._searchIndex = this._buffer.length;
            done();
        } else {
            this._parse(this._buffer.slice(0, index + 1));
            this._buffer = this._buffer.slice(index + 1);
            this._searchIndex = 0;
            this._algA(done);
        }
    }

    _algB(done) {

    }

    ///////////////////////
    // Transform Methods //
    ///////////////////////

    _write(chunk, encoding, cb) {
        this._buffer += chunk.toString();
        this._algA(cb);
    }

    ///////////////////////////
    // End Transform Methods //
    ///////////////////////////
}

module.exports = Parser;