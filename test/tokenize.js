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

describe("Tokenizer", function(){

    it("Should have been added properly to the index: Strict", function(){

        let index = new Index(/*{ tokenize: "strict" }*/);
        index.add(0, "björn phillipp mayer");

        expect(index.search("björn phillipp")).to.include(0);
        expect(index.search("björn mayer")).to.include(0);

        index = new Index({ tokenize: "strict" });
        index.add(0, "björn phillipp mayer");

        expect(index.search("björn phillipp")).to.include(0);
        expect(index.search("björn mayer")).to.include(0);
    });

    it("Should have been added properly to the index: Forward", function(){

        let index = new Index({ tokenize: "forward" });
        index.add(0, "björn phillipp mayer");

        expect(index.search("bjö phil may")).to.have.lengthOf(1);
        expect(index.search("bjö phil may")).to.include(0);
    });

    it("Should have been added properly to the index: Reverse", function(){

        let index = new Index({ tokenize: "reverse" });
        index.add(0, "björn phillipp mayer");

        expect(index.search("jörn phil er")).to.have.lengthOf(1);
        expect(index.search("jörn lipp er")).to.have.lengthOf(1);
        expect(index.search("jörn lipp er")).to.include(0);
    });

    it("Should have been added properly to the index: Full", function(){

        let index = new Index({ tokenize: "full" });
        index.add(0, "björn phillipp mayer");

        expect(index.search("jör illi may")).to.have.lengthOf(1);
        expect(index.search("jör illi may")).to.include(0);
    });
});
