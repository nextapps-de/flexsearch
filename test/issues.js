global.self = global;
const env = process.argv[3] && process.argv[3] === "--exit" ? process.argv[4] : process.argv[3];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver, IndexedDB } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;
const EnglishPreset = await import("../src/lang/en.js");

describe("Github Issues", function(){

    if(!build_light && !build_compact) it("#48", async function(){

        const fs = await new Document({
            encoder: Charset.LatinExtra,
            resolution: 9,
            context: {
                depth: 4
            },
            worker: true,
            cache: true,
            doc: {
                id: "id",
                field: [ "intent", "text" ]
            }
        });

        const doc = [{
            id: 0,
            intent: "intent",
            text: "text"
        },{
            id: 1,
            intent: "intent",
            text: "howdy - how are you doing"
        }];

        for(let i = 0; i < doc.length; i++){
            await fs.add(doc[i]);
        }

        expect(await fs.search("howdy")).to.eql([{
            field: "text",
            result: [1]
        }]);
        expect(await fs.search("howdy -")).to.eql([{
            field: "text",
            result: [1]
        }]);

        // terminate workers
        fs.index.get("intent").worker.terminate();
        fs.index.get("text").worker.terminate();
    });

    if(!build_light) it("#54", function(){

        const index = new Document({
            doc: {
                id: "id",
                field: ["title", "content"]
            }
        });

        const docs = [{
            id: 1,
            title: "Roaming Inquiry",
            content: "Some content"
        }, {
            id: 2,
            title: "New Service",
            content: "This is not roaming-inquiry"
        }];

        for(let i = 0; i < docs.length; i++){
            index.add(docs[i]);
        }

        expect(index.search("roaming")).to.eql([{
            field: "title",
            result: [1]
        },{
            field: "content",
            result: [2]
        }]);
    });

    it("#486", function(){

        const encoder = new Encoder(Charset.LatinDefault, EnglishPreset);
        const index = new Index({
            tokenize: "full",
            encoder
        });

        index.add(1, "user is not working, but users is working");

        const userResult = index.search("user");
        const usersResult = index.search("users");

        expect(userResult).to.eql([1]);
        expect(usersResult).to.eql([1]);
    });
});
