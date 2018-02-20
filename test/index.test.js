const expect = require('chai').expect;

const Algorithms = require('../lib/index.js');

let alg;

beforeEach(function() {
    alg = new Algorithms();
});

describe('Algorithm A', function() {
    let obj = [];

    beforeEach(function() {
        alg.on('json', (json) => {
            obj.push(json);
        });
    });

    afterEach(function() {
        obj = [];
    });

    it('Should throw out string with invalid starting character', function(done) {
        alg._buffer = "asdf";

        alg._algA(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        alg._buffer = "[asdf";

        alg._algA(() => {
            expect(alg._buffer).to.equal("[asdf");
            expect(obj).to.be.empty;
            expect(alg._searchIndex).to.equal(5);
            done();
        });
    });

    it("Should attempt to parse packet that might be done", function(done) {
        alg._buffer = "{{}";

        alg._algA(() => {
            expect(alg._buffer).to.equal("{{}");
            expect(obj).to.be.empty;
            expect(alg._searchIndex).to.equal(3);
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        alg._buffer = "{}";

        alg._algA(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            expect(alg._searchIndex).to.equal(0);
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        alg._buffer = "{}[]";

        alg._algA(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.have.lengthOf(2);
            expect(obj[0]).to.deep.eq({});
            expect(obj[1]).to.deep.eq([]);
            expect(alg._searchIndex).to.equal(0);
            done();
        });
    });

    it("Parse one message and buffer the rest", function(done) {
        alg._buffer = "{}[";

        alg._algA(() => {
            expect(alg._buffer).to.equal("[");
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            expect(alg._searchIndex).to.equal(1);
            done();
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        alg._buffer = `{"test":"te`;

        alg._algA(() => {
            expect(alg._buffer).to.equal('{"test":"te');
            expect(obj).to.have.lengthOf(0);
            expect(alg._searchIndex).to.equal(11);
            
            alg._buffer += `st"}{}`;
            alg._algA(() => {
                expect(alg._buffer).to.equal("");
                expect(obj).to.have.lengthOf(2);
                expect(obj[0]).to.deep.eq({test:"test"});
                expect(obj[1]).to.deep.eq({});
                expect(alg._searchIndex).to.equal(0);
                done();
            });
        });
    });
});

describe('Algorithm A2', function() {
    let obj = [];
    const SOH = 0x01,
        EOT = 0x04;

    const BEGIN_MARKER = String.fromCharCode(SOH),
        END_MARKER = String.fromCharCode(EOT);

    beforeEach(function() {
        alg.on('json', (json) => {
            obj.push(json);
        });
    });

    afterEach(function() {
        obj = [];
    });

    it('Should skip test when no valid starting character', function(done) {
        alg._buffer = Buffer.from("asdf", 'utf8');

        alg._algA2(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer.length).length.to.equal(0);
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        alg._buffer = Buffer.from(`[asdf`, 'utf8');

        alg._algA2(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer).to.deep.equal(Buffer.from(`[asdf`, 'utf8'));
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        alg._buffer = Buffer.from(`{}`, 'utf8');

        alg._algA2(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        alg._buffer = Buffer.from(`{}[]`, 'utf8');

        alg._algA2(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(2);
            expect(obj[0]).to.deep.eq({});
            expect(obj[1]).to.deep.eq([]);
            done();
        });
    });

    it("Parse one message and buffer the rest", function(done) {
        alg._buffer = Buffer.from(`{}[`, 'utf8');

        alg._algA2(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer).to.deep.equal(Buffer.from(`[`, 'utf8'));
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        alg._buffer = Buffer.from(`{"test":"te`, 'utf8');

        alg._algA2(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer).to.deep.equal(Buffer.from(`{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            alg._buffer = Buffer.concat([
                Buffer.from(`{"test":"te`, 'utf8'),
                Buffer.from(`st"}{}`, 'utf8')
            ])
            alg._algA2(() => {
                expect(alg._buffer).to.be.instanceof(Buffer);
                expect(alg._buffer.length).length.to.equal(0);
                expect(obj).to.have.lengthOf(2);
                expect(obj[0]).to.deep.eq({test:"test"});
                expect(obj[1]).to.deep.eq({});
                done();
            });
        });
    });
});

describe('Algorithm B', function() {
    let obj = [];

    beforeEach(function() {
        alg.on('json', (json) => {
            obj.push(json);
        });
    });

    afterEach(function() {
        obj = [];
    });

    it('Should throw out string with invalid starting character', function(done) {
        alg._buffer = "asdf";

        alg._algB(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        alg._buffer = "[asdf";

        alg._algB(() => {
            expect(alg._buffer).to.equal("[asdf");
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        alg._buffer = "{}";

        alg._algB(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            expect(alg._searchIndex).to.equal(0);
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        alg._buffer = "{}[]";

        alg._algB(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.have.lengthOf(2);
            expect(obj[0]).to.deep.eq({});
            expect(obj[1]).to.deep.eq([]);
            done();
        });
    });

    it("Parse one message and buffer the rest", function(done) {
        alg._buffer = "{}[";

        alg._algB(() => {
            expect(alg._buffer).to.equal("[");
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        alg._buffer = `{"test":"te`;

        alg._algB(() => {
            expect(alg._buffer).to.equal('{"test":"te');
            expect(obj).to.have.lengthOf(0);
            
            alg._buffer += `st"}{}`;
            alg._algB(() => {
                expect(alg._buffer).to.equal("");
                expect(obj).to.have.lengthOf(2);
                expect(obj[0]).to.deep.eq({test:"test"});
                expect(obj[1]).to.deep.eq({});
                done();
            });
        });
    });
});

describe('Algorithm C', function() {
    let obj = [];
    const SOH = 0x01,
        EOT = 0x04;

    const BEGIN_MARKER = String.fromCharCode(SOH),
        END_MARKER = String.fromCharCode(EOT);

    beforeEach(function() {
        alg.on('json', (json) => {
            obj.push(json);
        });
    });

    afterEach(function() {
        obj = [];
    });

    it('Should skip test when no valid starting character', function(done) {
        alg._buffer = "asdf";

        alg._algC(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        alg._buffer = `${BEGIN_MARKER}asdf`;

        alg._algC(() => {
            expect(alg._buffer).to.equal(`${BEGIN_MARKER}asdf`);
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        alg._buffer = `${BEGIN_MARKER}{}${END_MARKER}`;

        alg._algC(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        alg._buffer = `${BEGIN_MARKER}{}${END_MARKER}${BEGIN_MARKER}[]${END_MARKER}`;

        alg._algC(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.have.lengthOf(2);
            expect(obj[0]).to.deep.eq({});
            expect(obj[1]).to.deep.eq([]);
            done();
        });
    });

    it("Parse one message and buffer the rest", function(done) {
        alg._buffer = `${BEGIN_MARKER}{}${END_MARKER}${BEGIN_MARKER}[`;

        alg._algC(() => {
            expect(alg._buffer).to.equal(`${BEGIN_MARKER}[`);
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        alg._buffer = `${BEGIN_MARKER}{"test":"te`;

        alg._algC(() => {
            expect(alg._buffer).to.equal(`${BEGIN_MARKER}{"test":"te`);
            expect(obj).to.have.lengthOf(0);
            
            alg._buffer += `st"}${END_MARKER}${BEGIN_MARKER}{}${END_MARKER}`;
            alg._algC(() => {
                expect(alg._buffer).to.equal("");
                expect(obj).to.have.lengthOf(2);
                expect(obj[0]).to.deep.eq({test:"test"});
                expect(obj[1]).to.deep.eq({});
                done();
            });
        });
    });
});

describe('Algorithm D', function() {
    let obj = [];
    const SOH = 0x01,
        EOT = 0x04;

    const BEGIN_MARKER = String.fromCharCode(SOH),
        END_MARKER = String.fromCharCode(EOT);

    beforeEach(function() {
        alg.on('json', (json) => {
            obj.push(json);
        });
    });

    afterEach(function() {
        obj = [];
    });

    it('Should skip test when no valid starting character', function(done) {
        alg._buffer = "asdf";

        alg._algD(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        alg._buffer = `${BEGIN_MARKER}asdf`;

        alg._algD(() => {
            expect(alg._buffer).to.equal(`${BEGIN_MARKER}asdf`);
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        alg._buffer = `${BEGIN_MARKER}{}${END_MARKER}`;

        alg._algD(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        alg._buffer = `${BEGIN_MARKER}{}${END_MARKER}${BEGIN_MARKER}[]${END_MARKER}`;

        alg._algD(() => {
            expect(alg._buffer).to.equal("");
            expect(obj).to.have.lengthOf(2);
            expect(obj[0]).to.deep.eq({});
            expect(obj[1]).to.deep.eq([]);
            done();
        });
    });

    it("Parse one message and buffer the rest", function(done) {
        alg._buffer = `${BEGIN_MARKER}{}${END_MARKER}${BEGIN_MARKER}[`;

        alg._algD(() => {
            expect(alg._buffer).to.equal(`${BEGIN_MARKER}[`);
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        alg._buffer = `${BEGIN_MARKER}{"test":"te`;

        alg._algD(() => {
            expect(alg._buffer).to.equal(`${BEGIN_MARKER}{"test":"te`);
            expect(obj).to.have.lengthOf(0);
            
            alg._buffer += `st"}${END_MARKER}${BEGIN_MARKER}{}${END_MARKER}`;
            alg._algD(() => {
                expect(alg._buffer).to.equal("");
                expect(obj).to.have.lengthOf(2);
                expect(obj[0]).to.deep.eq({test:"test"});
                expect(obj[1]).to.deep.eq({});
                done();
            });
        });
    });
});

describe('Algorithm E', function() {
    let obj = [];
    const SOH = 0x01,
        EOT = 0x04;

    const BEGIN_MARKER = String.fromCharCode(SOH),
        END_MARKER = String.fromCharCode(EOT);

    beforeEach(function() {
        alg.on('json', (json) => {
            obj.push(json);
        });
    });

    afterEach(function() {
        obj = [];
    });

    it('Should skip test when no valid starting character', function(done) {
        alg._buffer = Buffer.from("asdf", 'utf8');

        alg._algE(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer.length).length.to.equal(0);
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should keep buffer if packet is not complete", function(done) {
        alg._buffer = Buffer.from(`${BEGIN_MARKER}asdf`, 'utf8');

        alg._algE(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer).to.deep.equal(Buffer.from(`${BEGIN_MARKER}asdf`, 'utf8'));
            expect(obj).to.be.empty;
            done();
        });
    });

    it("Should parse one JSON packet", function(done) {
        alg._buffer = Buffer.from(`${BEGIN_MARKER}{}${END_MARKER}`, 'utf8');

        alg._algE(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Parse two messages in one packet", function(done) {
        alg._buffer = Buffer.from(`${BEGIN_MARKER}{}${END_MARKER}${BEGIN_MARKER}[]${END_MARKER}`, 'utf8');

        alg._algE(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer.length).length.to.equal(0);
            expect(obj).to.have.lengthOf(2);
            expect(obj[0]).to.deep.eq({});
            expect(obj[1]).to.deep.eq([]);
            done();
        });
    });

    it("Parse one message and buffer the rest", function(done) {
        alg._buffer = Buffer.from(`${BEGIN_MARKER}{}${END_MARKER}${BEGIN_MARKER}[`, 'utf8');

        alg._algE(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer).to.deep.equal(Buffer.from(`${BEGIN_MARKER}[`, 'utf8'));
            expect(obj).to.have.lengthOf(1);
            expect(obj[0]).to.deep.eq({});
            done();
        });
    });

    it("Should parse two messages partially split between two packets", function(done) {
        alg._buffer = Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8');

        alg._algE(() => {
            expect(alg._buffer).to.be.instanceof(Buffer);
            expect(alg._buffer).to.deep.equal(Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8'));
            expect(obj).to.have.lengthOf(0);
            
            alg._buffer = Buffer.concat([
                Buffer.from(`${BEGIN_MARKER}{"test":"te`, 'utf8'),
                Buffer.from(`st"}${END_MARKER}${BEGIN_MARKER}{}${END_MARKER}`, 'utf8')
            ])
            alg._algE(() => {
                expect(alg._buffer).to.be.instanceof(Buffer);
                expect(alg._buffer.length).length.to.equal(0);
                expect(obj).to.have.lengthOf(2);
                expect(obj[0]).to.deep.eq({test:"test"});
                expect(obj[1]).to.deep.eq({});
                done();
            });
        });
    });
});