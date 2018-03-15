/* eslint-disable */

const expect = require('chai').expect;

const Parser = require('../lib/index.js');

let parser;

const SOH = 0x01,
    EOT = 0x04;

const BEGIN_MARKER = String.fromCharCode(SOH),
    END_MARKER = String.fromCharCode(EOT);

beforeEach(function() {
    parser = new Parser();
});

describe("_parse", function() {
    it("Should fail to parse", function(done) {
        parser.on("json", (json) => {
            done("Should not have parsed");
        });
        expect(parser._parse("asdf")).to.be.instanceof(SyntaxError);
        done();
    });

    it("Should successfully parse", function(done) {
        parser.on("json", (json) => {
            done();
        });
        expect(parser._parse("{}")).to.be.undefined;
    })
});

describe("setters", function() {
    describe("startMarker", function() {
        it("Should set the start marker with a string", function() {
            parser.startMarker = "a";
            expect(parser.startMarker).to.equal(0x61);
            expect(parser._startMarker).to.equal(0x61);
        });
    
        it("Should fail to set marker with string with more than 1 character", function() {
            let error = null;
            try {
                parseer.startMarker = "asdf";
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceof(Error);
            expect(parser.startMarker).to.equal(SOH);
            expect(parser._startMarker).to.equal(SOH);
        });
    
        it("Should set the start marker with a valid number", function() {
            parser.startMarker = 0x00;
            expect(parser.startMarker).to.equal(0x00);
            expect(parser._startMarker).to.equal(0x00);
            parser.startMarker = 0x23;
            expect(parser.startMarker).to.equal(0x23);
            expect(parser._startMarker).to.equal(0x23);
            parser.startMarker = 0x7F;
            expect(parser.startMarker).to.equal(0x7F);
            expect(parser._startMarker).to.equal(0x7F);
        });
    
        it("Should error on invalid input", function() {
            let error = null;
            try {
                parser.startMarker = {};
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceof(Error);
            expect(parser.startMarker).to.equal(SOH);
            expect(parser._startMarker).to.equal(SOH);
            error = null;
    
            try {
                parser.startMarker = [];
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceof(Error);
            expect(parser.startMarker).to.equal(SOH);
            expect(parser._startMarker).to.equal(SOH);
            error = null;
        });
    
        it("Should error on invalid number range", function() {
            let error = null;
            try {
                parser.startMarker = -1;
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceof(Error);
            expect(parser.startMarker).to.equal(SOH);
            expect(parser._startMarker).to.equal(SOH);
            error = null;
    
            try {
                parser.startMarker = 0x80;
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceof(Error);
            expect(parser.startMarker).to.equal(SOH);
            expect(parser._startMarker).to.equal(SOH);
            error = null;
        });
    });
    
    describe("endMarker", function() {
        it("Should set the start marker with a string", function() {
            parser.endMarker = "a";
            expect(parser.endMarker).to.equal(0x61);
            expect(parser._endMarker).to.equal(0x61);
        });
    
        it("Should fail to set marker with string with more than 1 character", function() {
            let error = null;
            try {
                parseer.endMarker = "asdf";
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceof(Error);
            expect(parser.endMarker).to.equal(EOT);
            expect(parser._endMarker).to.equal(EOT);
        });
    
        it("Should set the start marker with a valid number", function() {
            parser.endMarker = 0x00;
            expect(parser.endMarker).to.equal(0x00);
            expect(parser._endMarker).to.equal(0x00);
            parser.endMarker = 0x23;
            expect(parser.endMarker).to.equal(0x23);
            expect(parser._endMarker).to.equal(0x23);
            parser.endMarker = 0x7F;
            expect(parser.endMarker).to.equal(0x7F);
            expect(parser._endMarker).to.equal(0x7F);
        });
    
        it("Should error on invalid input", function() {
            let error = null;
            try {
                parser.endMarker = {};
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceof(Error);
            expect(parser.endMarker).to.equal(EOT);
            expect(parser._endMarker).to.equal(EOT);
            error = null;
    
            try {
                parser.endMarker = [];
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceof(Error);
            expect(parser.endMarker).to.equal(EOT);
            expect(parser._endMarker).to.equal(EOT);
            error = null;
        });
    
        it("Should error on invalid number range", function() {
            let error = null;
            try {
                parser.endMarker = -1;
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceof(Error);
            expect(parser.endMarker).to.equal(EOT);
            expect(parser._endMarker).to.equal(EOT);
            error = null;
    
            try {
                parser.endMarker = 0x80;
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceof(Error);
            expect(parser.endMarker).to.equal(EOT);
            expect(parser._endMarker).to.equal(EOT);
            error = null;
        });
    });
});

describe('_algorithm1', function() {
    let obj = [];

    beforeEach(function() {
        parser.on('json', (json) => {
            obj.push(json);
        });
    });

    afterEach(function() {
        obj = [];
    });

    it('Should skip test when no valid starting character', function(done) {
        parser._buffer = Buffer.from("asdf", 'utf8');

        parser._algorithm1(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        parser._buffer = Buffer.from(`[asdf`, 'utf8');

        parser._algorithm1(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`[asdf`, 'utf8'));
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        parser._buffer = Buffer.from(`{}`, 'utf8');

        parser._algorithm1(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        parser._buffer = Buffer.from(`{}[]`, 'utf8');

        parser._algorithm1(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(2);
            expect(obj[0]).to.deep.eq({});
            expect(obj[1]).to.deep.eq([]);
            done();
        });
    });

    it("Parse one message and buffer the rest", function(done) {
        parser._buffer = Buffer.from(`{}[`, 'utf8');

        parser._algorithm1(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`[`, 'utf8'));
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse one message split between two packets", function (done) {
        parser._buffer = Buffer.from(`{"test":"te`, 'utf8');

        parser._algorithm1(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            parser._buffer = Buffer.concat([
                Buffer.from(`{"test":"te`, 'utf8'),
                Buffer.from(`st"}`, 'utf8')
            ])
            parser._algorithm1(() => {
                expect(parser._buffer).to.be.instanceof(Buffer);
                expect(parser._buffer.length).length.to.equal(0);
                expect(obj).to.have.lengthOf(1);
                expect(obj[0]).to.deep.eq({test:"test"});
                done();
            });
        });
    });

    it("Should parse two packets, one ending with false end", function (done) {
        parser._buffer = Buffer.from(`{"test":{}`, 'utf8');

        parser._algorithm1(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`{"test":{}`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            parser._buffer = Buffer.concat([
                Buffer.from(`{"test":{}`, 'utf8'),
                Buffer.from(`}`, 'utf8')
            ])
            parser._algorithm1(() => {
                expect(parser._buffer).to.be.instanceof(Buffer);
                expect(parser._buffer.length).length.to.equal(0);
                expect(obj).to.have.lengthOf(1);
                expect(obj[0]).to.deep.eq({test:{}});
                done();
            });
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        parser._buffer = Buffer.from(`{"test":"te`, 'utf8');

        parser._algorithm1(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            parser._buffer = Buffer.concat([
                Buffer.from(`{"test":"te`, 'utf8'),
                Buffer.from(`st"}{}`, 'utf8')
            ])
            parser._algorithm1(() => {
                expect(parser._buffer).to.be.instanceof(Buffer);
                expect(parser._buffer.length).length.to.equal(0);
                expect(obj).to.have.lengthOf(2);
                expect(obj[0]).to.deep.eq({test:"test"});
                expect(obj[1]).to.deep.eq({});
                done();
            });
        });
    });
});

describe('_algorithm2', function() {
    let obj = [];

    beforeEach(function() {
        parser.on('json', (json) => {
            obj.push(json);
        });
    });

    afterEach(function() {
        obj = [];
    });

    it('Should skip test when no valid starting character', function(done) {
        parser._buffer = Buffer.from("asdf", 'utf8');

        parser._algorithm2(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        parser._buffer = Buffer.from(`[asdf`, 'utf8');

        parser._algorithm2(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`[asdf`, 'utf8'));
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        parser._buffer = Buffer.from(`{}`, 'utf8');

        parser._algorithm2(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        parser._buffer = Buffer.from(`{}[]`, 'utf8');

        parser._algorithm2(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(2);
            expect(obj[0]).to.deep.eq({});
            expect(obj[1]).to.deep.eq([]);
            done();
        });
    });

    it("Parse one message and buffer the rest", function(done) {
        parser._buffer = Buffer.from(`{}[`, 'utf8');

        parser._algorithm2(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`[`, 'utf8'));
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse one message split between two packets", function (done) {
        parser._buffer = Buffer.from(`{"test":"te`, 'utf8');

        parser._algorithm2(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            parser._buffer = Buffer.concat([
                Buffer.from(`{"test":"te`, 'utf8'),
                Buffer.from(`st"}`, 'utf8')
            ])
            parser._algorithm2(() => {
                expect(parser._buffer).to.be.instanceof(Buffer);
                expect(parser._buffer.length).length.to.equal(0);
                expect(obj).to.have.lengthOf(1);
                expect(obj[0]).to.deep.eq({test:"test"});
                done();
            });
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        parser._buffer = Buffer.from(`{"test":"te`, 'utf8');

        parser._algorithm2(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            parser._buffer = Buffer.concat([
                Buffer.from(`{"test":"te`, 'utf8'),
                Buffer.from(`st"}{}`, 'utf8')
            ])
            parser._algorithm2(() => {
                expect(parser._buffer).to.be.instanceof(Buffer);
                expect(parser._buffer.length).length.to.equal(0);
                expect(obj).to.have.lengthOf(2);
                expect(obj[0]).to.deep.eq({test:"test"});
                expect(obj[1]).to.deep.eq({});
                done();
            });
        });
    });
});

describe('_algorithm3', function() {
    let obj = [];

    beforeEach(function() {
        parser.on('json', (json) => {
            obj.push(json);
        });
    });

    afterEach(function() {
        obj = [];
    });

    it('Should skip test when no valid starting character', function(done) {
        parser._buffer = Buffer.from("asdf", 'utf8');

        parser._algorithm3(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        parser._buffer = Buffer.from(`${BEGIN_MARKER}asdf`, 'utf8');

        parser._algorithm3(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`${BEGIN_MARKER}asdf`, 'utf8'));
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        parser._buffer = Buffer.from(`${BEGIN_MARKER}{}${END_MARKER}`, 'utf8');

        parser._algorithm3(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        parser._buffer = Buffer.from(`${BEGIN_MARKER}{}${END_MARKER}${BEGIN_MARKER}[]${END_MARKER}`, 'utf8');

        parser._algorithm3(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(2);
            expect(obj[0]).to.deep.eq({});
            expect(obj[1]).to.deep.eq([]);
            done();
        });
    });

    it("Parse one message and buffer the rest", function(done) {
        parser._buffer = Buffer.from(`${BEGIN_MARKER}{}${END_MARKER}${BEGIN_MARKER}[`, 'utf8');

        parser._algorithm3(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`${BEGIN_MARKER}[`, 'utf8'));
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse one message split between two packets", function (done) {
        parser._buffer = Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8');

        parser._algorithm3(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            parser._buffer = Buffer.concat([
                Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8'),
                Buffer.from(`st"}${END_MARKER}`, 'utf8')
            ])
            parser._algorithm3(() => {
                expect(parser._buffer).to.be.instanceof(Buffer);
                expect(parser._buffer.length).length.to.equal(0);
                expect(obj).to.have.lengthOf(1);
                expect(obj[0]).to.deep.eq({test:"test"});
                done();
            });
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        parser._buffer = Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8');

        parser._algorithm3(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            parser._buffer = Buffer.concat([
                Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8'),
                Buffer.from(`st"}${END_MARKER}${BEGIN_MARKER}{}${END_MARKER}`, 'utf8')
            ])
            parser._algorithm3(() => {
                expect(parser._buffer).to.be.instanceof(Buffer);
                expect(parser._buffer.length).length.to.equal(0);
                expect(obj).to.have.lengthOf(2);
                expect(obj[0]).to.deep.eq({test:"test"});
                expect(obj[1]).to.deep.eq({});
                done();
            });
        });
    });
});