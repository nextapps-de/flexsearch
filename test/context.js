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

describe("Context", function(){

    it("Should have been added properly to the context (bidirectional enabled)", function(){

        let index = new Index({
            tokenize: "strict",
            context: {
                depth: 2
            }
        });

        index.add(0, "zero one two three four five six seven eight nine ten");

        expect(index.reg.size).to.equal(1);
        expect(index.search("zero one")).to.include(0);
        expect(index.search("zero two")).to.include(0);
        // breaks the context chain:
        expect(index.search("zero three").length).to.equal(0);
        expect(index.search("zero three", { suggest: true })).to.include(0);
        // breaks the context chain:
        expect(index.search("three seven").length).to.equal(0);
        expect(index.search("three seven", { suggest: true })).to.include(0);
        expect(index.search("three five seven")).to.include(0);
        // bidirectional:
        expect(index.search("eight six four")).to.include(0);
        expect(index.search("seven five three")).to.include(0);
        expect(index.search("three foobar seven").length).to.equal(0);
        expect(index.search("three foobar seven", { suggest: true })).to.include(0);
        expect(index.search("seven foobar three").length).to.equal(0);
        expect(index.search("seven foobar three", { suggest: true })).to.include(0);
        expect(index.search("eight ten")).to.include(0);
        expect(index.search("ten nine seven eight six five three four two zero one")).to.include(0);

        index.add(1, "1 2 3 1 4 2 5 1");

        expect(index.search("1")).to.include(1);
        expect(index.search("1 5")).to.include(1);
        expect(index.search("2 4 1")).to.include(1);

        // disable bidirectional
        index = new Index({
            tokenize: "strict",
            context: {
                depth: 2,
                bidirectional: false
            }
        });

        index.add(0, "zero one two three four five six seven eight nine ten");
        expect(index.search("ten nine seven eight six five three four two zero one").length).to.equal(0);
    });

    it("Should have been added properly to the context when bidirectional was disabled", function(){

        let index = new Index({
            tokenize: "strict",
            context: {
                depth: 2,
                bidirectional: false
            }
        });

        index.add(1, "1 2 3 4 5 6 7 8 9");
        expect(index.search("3 1").length).to.equal(0);
        expect(index.search("4 3 2").length).to.equal(0);
    });

    it("Should have been added properly when dupes will break the context chain", function(){

        const index = new Index({
            context: {
                depth: 2
            }
        });

        index.add(1, "1 2 3 4 5 6 7 8 1 2 9");

        expect(index.search("1 9")).to.include(1);
        expect(index.search("1 2 9")).to.include(1);
        expect(index.search("9 1 2")).to.include(1);

        // todo shuffled chain:
        //expect(index.search("1 3 9")).to.include(1);
        expect(index.search("3 1 9")).to.include(1);
        expect(index.search("9 1 3")).to.include(1);
        // todo shuffled chain:
        //expect(index.search("9 3 1")).to.include(1);
    });

    it("Should have been added properly when dupes will break the context chain", function(){

        // the default scoring is quite capable
        let index = new Index();
        index.add(1, "1 A B C D E F 2 G H I J K L 3");
        index.add(2, "A B C D E F G H I J 1 2 3 K L");
        let result = index.search("1 2 3");
        expect(result[0]).to.equal(2);
        result = index.search("3 2 1");
        expect(result[0]).to.equal(2);

        // from here it starts
        index = new Index();
        index.add(1, "1 A B C D 2 E F G H I 3 J K L");
        index.add(2, "A B C D E F G H I J 1 2 3 K L");
        result = index.search("1 2 3");
        expect(result[0]).to.equal(1);

        index = new Index({ context: true });
        index.add(1, "1 A B C D 2 E F G H I 3 J K L");
        index.add(2, "A B C D E F G H I J 1 2 3 K L");
        result = index.search("1 2 3");
        expect(result[0]).to.equal(2);

        result = index.search("1 2 3", { context: false });
        expect(result[0]).to.equal(1);
    });

    it("Should have been handled properly the context chain (term deduplication)", function(){

        let index = new Index({ context: true });
        index.add(1, "A A B B C C A A B B C C");

        let result = index.search("A");
        expect(result).to.eql([1]);

        result = index.search("A A");
        expect(result).to.eql([1]);

        result = index.search("A A A");
        expect(result).to.eql([1]);

        result = index.search("A B A");
        expect(result).to.eql([1]);

        result = index.search("A B B");
        expect(result).to.eql([1]);

        result = index.search("B A B");
        expect(result).to.eql([1]);

        result = index.search("B A A");
        expect(result).to.eql([1]);

        result = index.search("C C B B A A");
        expect(result).to.eql([1]);
    });
});
