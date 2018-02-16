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