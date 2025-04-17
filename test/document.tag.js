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

if(!build_light) describe("Documents: Tag-Search", function(){

    const data = [{
        id: 2,
        data: { title: "Title 3", body: "Body 3", cat: "A" }
    },{
        id: 1,
        data: { title: "Title 2", body: "Body 2", cat: "B" }
    },{
        id: 0,
        data: { title: "Title 1", body: "Body 1", cat: "A" }
    }];

    const update = [{
        id: 0,
        data: { title: "Foo 1", body: "Bar 1", cat: "B" }
    },{
        id: 1,
        data: { title: "Foo 2", body: "Bar 2", cat: "A" }
    },{
        id: 2,
        data: { title: "Foo 3", body: "Bar 3", cat: "B" }
    }];

    it("Should have been indexed properly (tag)", function(){

        const document = new Document({
            document: {
                id: "id",
                field: ["data:body", "data:title"],
                tag: "data:cat"
            }
        });

        const document_with_store = new Document({
            document: {
                store: true,
                id: "id",
                field: ["data:body", "data:title"],
                tag: "data:cat"
            }
        });

        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
            document_with_store.add(data[i]);
        }

        expect(document.index.size).to.equal(2);
        expect(document.tag.size).to.equal(1);
        expect(document.reg.size).to.equal(3);
        expect(document_with_store.store.size).to.equal(3);

        expect(document.search({
            query: "title"
        })).to.eql([{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        expect(document.search({
            query: "title",
            tag: { "data:cat": "A" }
        })).to.eql([{
            field: "data:title",
            result: [2, 0]
        }]);

        expect(document.search({
            query: "body",
            tag: { "data:cat": "B" }
        })).to.eql([{
            field: "data:body",
            result: [1]
        }]);

        expect(document.search({
            query: "title",
            tag: [
                { "data:cat": "A" },
                { "data:cat": "B" }
            ]
        })).to.eql([{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        expect(document.search({
            query: "body title",
            suggest: true,
            tag: [
                { "data:cat": "A" },
                { "data:cat": "B" }
            ]
        })).to.eql([{
            field: "data:body",
            result: [2, 1, 0]
        },{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        // todo suggestions should return all results like one below
        expect(document.search({
            query: "body title",
            suggest: true,
            tag: [
                { "data:cat": "C" }, // not exists
                { "data:cat": "B" }
            ]
        })).to.eql([{
            field: "data:body",
            result: [1]
        },{
            field: "data:title",
            result: [1]
        }]);

        // suggestions on
        expect(document.search({
            query: "body title",
            suggest: true,
            tag: [
                { "data:cat": "C" } // not exists
            ]
        })).to.eql([{
            field: "data:body",
            result: [2, 1, 0]
        },{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        // suggestions off
        expect(document.search({
            query: "body title",
            tag: [
                { "data:cat": "C" } // not exists
            ]
        })).to.eql([]);

        // ---------------------------------------

        for(let i = 0; i < update.length; i++){
            document.add(update[i]);
            document_with_store.add(update[i]);
        }

        expect(document.search("foo")).to.eql([{
            field: "data:title",
            result: [0, 1, 2]
        }]);

        expect(document.search({
            query: "foo",
            tag: { "data:cat": "A" }
        })).to.eql([{
            field: "data:title",
            result: [1]
        }]);

        expect(document.search({
            query: "bar",
            tag: { "data:cat": "B" }
        })).to.eql([{
            field: "data:body",
            result: [0, 2]
        }]);

        // ---------------------------------------

        for(let i = 0; i < update.length; i++){
            document.remove(update[i]);
            document_with_store.remove(update[i]);
        }

        expect(document.reg.size).to.equal(0);
        expect(document.index.get("data:title").reg.size).to.equal(0);
        expect(document.index.get("data:body").reg.size).to.equal(0);
        expect(document.index.get("data:title").map.size).to.equal(0);
        expect(document.index.get("data:body").map.size).to.equal(0);
        expect(document_with_store.store.size).to.equal(0);

        expect(document_with_store.search({
            query: "foo",
        })).to.eql([]);

        expect(document_with_store.search({
            query: "bar"
        })).to.eql([]);
    });

    it("Should have been cleared everything properly", function(){

        const document = new Document({
            cache: true,
            context: {
                depth: 1
            },
            document: {
                store: true,
                id: "id",
                field: [
                    { field: "data:body",
                      context: { depth: 1 }
                    },
                    { field: "data:title",
                      context: { depth: 1 }
                    }
                ],
                tag: "data:cat"
            }
        });

        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
            document.searchCache(data[i].data.title)
        }

        expect(document.reg.size).to.equal(3);
        expect(document.tag.get("data:cat").size).to.equal(2);
        expect(document.tag.get("data:cat").get("A").length).to.equal(2);
        expect(document.tag.get("data:cat").get("B").length).to.equal(1);
        expect(document.store.size).to.equal(3);
        expect(document.cache.cache.size).to.equal(3);
        expect(document.index.get("data:title").reg.size).to.equal(3);
        expect(document.index.get("data:title").map.size).to.equal(4); // 4 terms
        expect(document.index.get("data:title").ctx.size).to.equal(1); // 1 keyword
        expect(document.index.get("data:title").ctx.get("title").size).to.equal(3); // 3 context terms
        expect(document.index.get("data:body").reg.size).to.equal(3);
        expect(document.index.get("data:body").map.size).to.equal(4); // 4 terms
        expect(document.index.get("data:body").ctx.size).to.equal(1); // 1 keyword
        expect(document.index.get("data:body").ctx.get("body").size).to.equal(3); // 3 context terms

        document.clear();

        expect(document.reg.size).to.equal(0);
        expect(document.tag.get("data:cat").size).to.equal(0);
        expect(document.store.size).to.equal(0);
        expect(document.cache.cache.size).to.equal(0);
        expect(document.index.get("data:title").reg.size).to.equal(0);
        expect(document.index.get("data:title").map.size).to.equal(0);
        expect(document.index.get("data:title").ctx.size).to.equal(0);
        expect(document.index.get("data:body").reg.size).to.equal(0);
        expect(document.index.get("data:body").map.size).to.equal(0);
        expect(document.index.get("data:body").ctx.size).to.equal(0);
    });
});
