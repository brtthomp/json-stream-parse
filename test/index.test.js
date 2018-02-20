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
    it("Should fail to parse and not emit", function(done) {
        parser.on("json", (json) => {
            done("Should not have parsed");
        });
        parser._parse("asdf");
        done();
    });

    it("Should successfully parse", function(done) {
        parser.on("json", (json) => {
            done();
        });
        parser._parse("asdf");
        done();
    })
});

describe('_parserA', function() {
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

        parser._parserA(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        parser._buffer = Buffer.from(`[asdf`, 'utf8');

        parser._parserA(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`[asdf`, 'utf8'));
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        parser._buffer = Buffer.from(`{}`, 'utf8');

        parser._parserA(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        parser._buffer = Buffer.from(`{}[]`, 'utf8');

        parser._parserA(() => {
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

        parser._parserA(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`[`, 'utf8'));
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        parser._buffer = Buffer.from(`{"test":"te`, 'utf8');

        parser._parserA(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            parser._buffer = Buffer.concat([
                Buffer.from(`{"test":"te`, 'utf8'),
                Buffer.from(`st"}{}`, 'utf8')
            ])
            parser._parserA(() => {
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

describe('_parserB', function() {
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

        parser._parserB(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        parser._buffer = Buffer.from(`[asdf`, 'utf8');

        parser._parserB(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`[asdf`, 'utf8'));
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        parser._buffer = Buffer.from(`{}`, 'utf8');

        parser._parserB(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        parser._buffer = Buffer.from(`{}[]`, 'utf8');

        parser._parserB(() => {
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

        parser._parserB(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`[`, 'utf8'));
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        parser._buffer = Buffer.from(`{"test":"te`, 'utf8');

        parser._parserB(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            parser._buffer = Buffer.concat([
                Buffer.from(`{"test":"te`, 'utf8'),
                Buffer.from(`st"}{}`, 'utf8')
            ])
            parser._parserB(() => {
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

describe('_parserC', function() {
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

        parser._parserC(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        parser._buffer = Buffer.from(`${BEGIN_MARKER}asdf`, 'utf8');

        parser._parserC(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`${BEGIN_MARKER}asdf`, 'utf8'));
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        parser._buffer = Buffer.from(`${BEGIN_MARKER}{}${END_MARKER}`, 'utf8');

        parser._parserC(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        parser._buffer = Buffer.from(`${BEGIN_MARKER}{}${END_MARKER}${BEGIN_MARKER}[]${END_MARKER}`, 'utf8');

        parser._parserC(() => {
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

        parser._parserC(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`${BEGIN_MARKER}[`, 'utf8'));
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        parser._buffer = Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8');

        parser._parserC(() => {
            expect(parser._buffer).to.be.instanceof(Buffer);
            expect(parser._buffer).to.deep.equal(Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            parser._buffer = Buffer.concat([
                Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8'),
                Buffer.from(`st"}${END_MARKER}${BEGIN_MARKER}{}${END_MARKER}`, 'utf8')
            ])
            parser._parserC(() => {
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