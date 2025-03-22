global.self = global;
const env = process.argv[3];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;

describe("Encoder", function(){

    it("Should have been properly added a custom encoder", function(){

        const encode = str => str.toLowerCase().split(/\s+/);
        const index = new Index({ encoder: encode });
        expect(index.encoder.encode).to.eql(encode);
    });

    it("Should have been properly added a custom encode (alternative)", function(){

        const encode = str => str.toLowerCase().split(/\s+/);
        const index = new Index({ encode });
        expect(index.encoder.encode).to.eql(encode);
    });
});

describe("Encoder: Latin Charset", function(){

    it("Should have been encoded properly: LatinDefault", function(){

        const index = new Index({ encoder: Charset.LatinDefault });
        expect(index.encoder.encode("Björn-Phillipp Mayer")).to.eql(["björn", "phillipp", "mayer"]);
    });

    if(env !== "light"){

        it("Should have been encoded properly: LatinExact", function(){

            const index = new Index({ encoder: Charset.LatinExact });
            expect(index.encoder.encode("Björn-Phillipp Mayer")).to.eql(["Björn-Phillipp", "Mayer"]);
        });

        it("Should have been encoded properly: LatinSimple", function(){

            const index = new Index({ encoder: Charset.LatinSimple });
            expect(index.encoder.encode("Björn-Phillipp Mayer")).to.eql(index.encoder.encode("bjorn/phillipp mayer"));
        });

        it("Should have been encoded properly: LatinBalance", function(){

            const index = new Index({ encoder: Charset.LatinBalance });
            expect(index.encoder.encode("Björn-Phillipp Mayer")).to.eql(index.encoder.encode("bjorn philip mair"));
        });

        it("Should have been encoded properly: LatinAdvanced", function(){

            const index = new Index({ encoder: Charset.LatinAdvanced });
            expect(index.encoder.encode("Björn-Phillipp Mayer")).to.eql(index.encoder.encode("bjoern filip mair"));
        });

        it("Should have been encoded properly: LatinExtra", function(){

            const index = new Index({ encoder: Charset.LatinExtra });
            expect(index.encoder.encode("Björn-Phillipp Mayer")).to.eql(index.encoder.encode("bjorm filib mayr"));
        });

        it("Should have been encoded properly: LatinSoundex", function(){

            const index = new Index({ encoder: Charset.LatinSoundex });
            expect(index.encoder.encode("Björn-Phillipp Mayer")).to.eql(index.encoder.encode("bjoernsen philippo mayr"));
        });
    }

    it("Should have been encoded properly: Custom Encoder", function(){

        function test_encoder(str){
            return "-[" + str.toUpperCase() + "]-";
        }

        const index = new Index({ encoder: test_encoder });
        expect(index.encoder.encode("Björn-Phillipp Mayer")).to.eql("-[BJÖRN-PHILLIPP MAYER]-");
    });
});

describe("Encoder: CJK Word Break", function(){

    it("Should have been tokenized properly", function(){

        const index = Index({
            encoder: Charset.CjkDefault,
            tokenize: "forward"
        });

        index.add(0, "서울시가 잠이 든 시간에 아무 말, 미뤄, 미뤄");
        expect(index.search("든")).to.include(0);
        expect(index.search("시간에")).to.include(0);

        index.add(1, "一个单词");
        expect(index.search("一个")).to.include(1);
    });
});

describe("Encoder: Cyrillic Word Break", function(){

    it("Should have been tokenized properly", function(){

        const index = Index({
            encoder: Charset.CyrillicDefault,
            tokenize: "forward"
        });

        index.add(0, "Фообар");
        expect(index.search("Фообар")).to.include(0);
        expect(index.search("Фоо")).to.include(0);
    });
});

describe("Encoder: Arabic Word Break", function(){

    it("Should have been tokenized properly", function(){

        let index = Index({
            encoder: Charset.ArabicDefault,
            tokenize: "forward"
        });

        index.add(0, "لكن لا بد أن أوضح لك أن كل");
        expect(index.search("بد أن")).to.include(0);
        expect(index.search("أو")).to.include(0);
        index = Index({
            encoder: Charset.ArabicDefault,
            tokenize: "reverse"
        });

        index.add(0, "لكن لا بد أن أوضح لك أن كل");
        expect(index.search("ضح")).to.include(0);
    });
});

describe("Encoder: Right-to-Left", function(){

    it("Should have been scored properly", function(){

        let index = new Index({
            tokenize: "forward",
            rtl: true
        });

        index.add(0, "54321 4 3 2 0");
        index.add(1, "0 2 3 4 54321");
        index.add(2, "0 2 3 4 12345");

        expect(index.search("5")).to.eql([2]);
        expect(index.search("1")).to.eql([1, 0]);

        index = new Index({
            tokenize: "reverse",
            rtl: true
        });

        index.add(0, "54321 4 3 2 1 0");
        index.add(1, "0 1 2 3 4 54321");
        index.add(2, "0 1 2 3 4 12345");

        expect(index.search("5")).to.eql([2, 1, 0]);
    });
});

describe("Filter", function(){

    it("Should have been filtered properly", function(){

        let encoder = new Encoder({
            filter: ["in", "the"]
        });
        let index = new Index({
            tokenize: "strict",
            encoder: encoder
        });

        index.add(0, "Today in the morning.");

        expect(index.search("today in the morning.")).to.include(0);
        expect(index.search("today morning")).to.include(0);
        expect(index.search("in the")).to.have.length(0);

        index = new Index({
            tokenize: "strict",
            encoder: encoder,
            context: true
        });

        index.add(0, "Today in the morning.");
        expect(index.search("today morning")).to.include(0);

        encoder = new Encoder();
        encoder.addFilter("in");
        index = new Index({
            tokenize: "strict",
            encoder: encoder
        });
        index.encoder.addFilter("the");

        index.add(0, "Today in the morning.");
        expect(index.search("in the")).to.have.length(0);
    });

    it("Should have been filtered properly (custom function)", function(){

        const encoder = new Encoder({
            filter: ["in", "the"],
            finalize: function(word){
                return word.filter(t => t.length > 3);
            }
        });
        const index = new Index({
            tokenize: "strict",
            encoder: encoder
        });

        index.add(0, "Today in the morning.");

        expect(index.search("today in the morning.")).to.include(0);
        expect(index.search("today morning")).to.include(0);
        expect(index.search("in the")).to.have.length(0);
    });

    it("Should have been filtered properly (minlength)", function(){

        const encoder = new Encoder({
            filter: ["in", "the"],
            minlength: 4
        });
        const index = new Index({
            tokenize: "strict",
            encoder: encoder
        });

        index.add(0, "Today in the morning.");

        expect(index.search("today in the morning.")).to.include(0);
        expect(index.search("today morning")).to.include(0);
        expect(index.search("in the")).to.have.length(0);
    });
});

describe("Stemmer", function(){

    it("Should have been stemmed properly", function(){

        const encoder = new Encoder({
            stemmer: new Map([
                ["ization", "ize"],
                ["tional", "tion"]
            ])
        });
        const index = new Index({
            tokenize: "strict",
            encoder: encoder
        });

        index.add(0, "Just a multinational colonization.");

        expect(index.search("Just a multinational colonization.")).to.include(0);
        expect(index.search("multinational colonization")).to.include(0);
        expect(index.search("tional tion")).to.have.length(0);
    });

//     it("Should have been stemmed properly (custom function)", function(){
//
//         var stems = {
//             "ization": "ize",
//             "tional": "tion"
//         };
//
//         var index = new FlexSearch({
//             tokenize: "strict",
//             stemmer: function(word){
//                 return stems[word] || word;
//             }
//         });
//
//         index.add(0, "Just a multinational colonization.");
//
//         expect(index.length).to.equal(1);
//         expect(index.search("Just a multinational colonization.")).to.include(0);
//         expect(index.search("multinational colonization")).to.include(0);
//         expect(index.search("tional tion")).to.have.length(0);
//     });
// });
//
//
// describe("Custom Language", function(){
//
//     it("Should have been applied properly", function(){
//
//         var index = new FlexSearch({
//             tokenize: "reverse",
//             filter: ["a", "an"],
//             stemmer: {
//                 "ization": "ize",
//                 "tional": "tion"
//             }
//         });
//
//         index.add(0, "Just a multinational colonization.");
//
//         expect(index.length).to.equal(1);
//         expect(index.search("Just a multinational colonization.")).to.include(0);
//         expect(index.search("Just an multinational colonization.")).to.include(0);
//         expect(index.search("multinational colonization")).to.include(0);
//         expect(index.search("tional tion")).to.have.length(0);
//
//         FlexSearch.registerLanguage("custom", {
//             filter: ["a", "an"],
//             stemmer: {
//                 "ization": "ize",
//                 "tional": "tion"
//             }
//         });
//
//         index = new FlexSearch({
//             tokenize: "reverse",
//             lang: "custom"
//         });
//
//         index.add(0, "Just a multinational colonization.");
//
//         expect(index.length).to.equal(1);
//         expect(index.search("Just a multinational colonization.")).to.include(0);
//         expect(index.search("Just an multinational colonization.")).to.include(0);
//         expect(index.search("multinational colonization")).to.include(0);
//         expect(index.search("tional tion")).to.have.length(0);
//     });
});
