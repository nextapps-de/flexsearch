global.self = global;
const env = process.argv[3] && process.argv[3] === "--exit" ? process.argv[4] : process.argv[3];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;

describe("Scoring", function(){

    it("Should have been sorted by relevance properly", function(){

        let index = new Index({
            tokenize: "strict",
            resolution: 10
        });

        index.add(0, "1 2 3 2 4 1 5 3");
        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "four two zero one three ten five seven eight six nine");

        expect(index.search("1")).to.eql([0]);
        expect(index.search("one")).to.eql([1, 2]);
        expect(index.search("one two")).to.eql([1, 2]);
        expect(index.search("four one")).to.eql([2, 1]);

        index = new Index({
            tokenize: "strict",
            context: {
                depth: 3,
                bidirectional: false
            }
        });

        index.add(0, "1 2 3 2 4 1 5 3");
        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "four two zero one three ten five seven eight six nine");

        expect(index.search("1")).to.eql([0]);
        expect(index.search("one")).to.eql([1, 2]);
        expect(index.search("one two")).to.eql([1]); // 2 => no bi-directional
        expect(index.search("four one")).to.eql([2]); // 1 => no bi-directional

        index = new Index({
            tokenize: "strict",
            context: {
                depth: 3,
                bidirectional: true
            }
        });

        index.add(0, "1 2 3 2 4 1 5 3");
        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "five two zero one three four ten seven eight six nine");

        expect(index.search("1 3 4")).to.eql([0]);
        expect(index.search("1 5 3 4")).to.eql([0]);
        expect(index.search("1 3 4 7")).to.have.lengthOf(0);
        expect(index.search("one")).to.eql([1, 2]);
        expect(index.search("one three")).to.eql([1, 2]);
        expect(index.search("three one")).to.eql([1, 2]);
        expect(index.search("zero five one ten")).to.eql([2]);
        expect(index.search("zero two one three two five")).to.eql([1]);
        expect(index.search("one zero two one zero three")).to.eql([1, 2]);
        // todo context chain
        //expect(index.search("zero two one three two five")).to.eql([1, 2]);
    });
});

describe("Suggestions", function(){

    it("Should have been suggested properly by relevance", function(){

        let index = new Index({ tokenize: "strict" });

        index.add(0, "1 2 3 2 4 1 5 3");
        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "four two zero one three ten five seven eight six nine");

        expect(index.search("1 3 4 7", { suggest: false })).to.have.lengthOf(0);
        expect(index.search("1 3 4 7", { suggest: true })).to.eql([0]);
        expect(index.search("1 3 9 7", { suggest: true })).to.eql([0]);

        expect(index.search("foobar one two", { suggest: true })).to.eql([1, 2]);
        expect(index.search("foobar one four", { suggest: true })).to.eql([2, 1]);
        expect(index.search("one foobar two", { suggest: true })).to.eql([1, 2]);
        expect(index.search("one two foobar", { suggest: true })).to.eql([1, 2]);
        expect(index.search("zero one foobar two foobar", { suggest: true })).to.eql([1, 2]);
    });

    it("Should have been suggested properly by context", function(){

        let index = new Index({
            tokenize: "strict",
            context: {
                depth: 3,
                bidirectional: true
            }
        });

        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "four two zero one three ten five seven eight six nine");

        expect(index.search("foobar one", { suggest: true })).to.eql([1, 2]);
        expect(index.search("foobar two", { suggest: true })).to.eql([2, 1]);
        expect(index.search("foobar foobar foobar one foobar two foobar foobar", { suggest: true })).to.eql([1, 2]);
        expect(index.search("foobar foobar foobar two foobar one foobar foobar", { suggest: true })).to.eql([1, 2]);
        expect(index.search("foobar one two", { suggest: true })).to.eql([1, 2]);
        expect(index.search("one foobar two", { suggest: true })).to.eql([1, 2]);
        expect(index.search("one two foobar", { suggest: true })).to.eql([1, 2]);
        expect(index.search("foobar one foobar two foobar", { suggest: true })).to.eql([1, 2]);
        expect(index.search("zero one foobar two foobar", { suggest: true })).to.eql([1, 2]);
    });
});
