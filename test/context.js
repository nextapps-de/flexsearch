global.self = global;
const env = process.argv[3] && process.argv[3].startsWith("--") ? process.argv[4] : process.argv[3];
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

    it("Should have been added properly to the context", function(){

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
        expect(index.search("zero three").length).to.equal(0);
        expect(index.search("three seven").length).to.equal(0);
        expect(index.search("three five seven")).to.include(0);
        expect(index.search("eight six four")).to.include(0);
        expect(index.search("seven five three")).to.include(0);
        expect(index.search("three foobar seven").length).to.equal(0);
        expect(index.search("seven foobar three").length).to.equal(0);
        expect(index.search("eight ten")).to.include(0);
        expect(index.search("ten nine seven eight six five three four two zero one")).to.include(0);

        index.add(1, "1 2 3 1 4 2 5 1");

        expect(index.search("1")).to.include(1);
        expect(index.search("1 5")).to.include(1);
        expect(index.search("2 4 1")).to.include(1);

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
});
