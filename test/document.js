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

if(!build_light) describe("Document (Multi-Field Search)", function(){

    const data = [{
        id: 2,
        data: { title: "Title 3", body: "Body 3" }
    },{
        id: 1,
        data: { title: "Title 2", body: "Body 2" }
    },{
        id: 0,
        data: { title: "Title 1", body: "Body 1" }
    }];

    const update = [{
        id: 0,
        data: { title: "Foo 1", body: "Bar 1" }
    },{
        id: 1,
        data: { title: "Foo 2", body: "Bar 2" }
    },{
        id: 2,
        data: { title: "Foo 3", body: "Bar 3" }
    }];

    it("Should have been indexed properly", function(){

        const document = new Document({
            document: {
                id: "id",
                field: [
                    "data:title",
                    "data:body"
                ]
            }
        });

        const document_with_store = new Document({
            keystore: 2,
            fastupdate: true,
            document: {
                store: true,
                id: "id",
                field: [
                    "data:title",
                    "data:body"
                ]
            }
        });

        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
            document_with_store.add(data[i]);
        }

        expect(document.index.size).to.equal(2);
        expect(document.reg.size).to.equal(3);
        // Registry Sharing
        expect(document.index.get("data:title").reg).to.equal(document.reg);
        expect(document.index.get("data:title").reg).to.not.equal(document_with_store.reg);

        expect(document.search({
            query: "title"
        })).to.eql([{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        expect(document.search({
            query: "title",
            field: "data:title"
        })).to.eql([{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        expect(document_with_store.search({
            query: "title",
            pluck: "data:title",
            enrich: true
        }).map(res => res.doc)).to.eql(data);

        expect(document.search({
            field: "data:body",
            query: "title"
        })).to.have.lengthOf(0)

        expect(document.search({
            field: "data:title",
            query: "body"
        })).to.have.lengthOf(0);

        expect(document.search({
            field: "data:body",
            query: "body"
        })).to.eql([{
            field: "data:body",
            result: [2, 1, 0]
        }]);

        expect(document.search({
            field: ["data:title"],
            query: "title"
        })).to.eql([{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        expect(document.search({
            field: ["data:title", "data:body"],
            query: "body"
        })).to.eql([{
            field: "data:body",
            result: [2, 1, 0]
        }]);

        expect(document.search({
            field: ["data:body", "data:title"],
            query: "title"
        })).to.eql([{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        expect(document.search({
            field: ["data:title", "data:body"],
            query: "body"
        })).to.eql([{
            field: "data:body",
            result: [2, 1, 0]
        }]);

        expect(document.search({
            field: ["data:body", "data:title"],
            query: "title"
        })).to.eql([{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        expect(document.search("body", {
            field: "data:body"
        })).to.eql([{
            field: "data:body",
            result: [2, 1, 0]
        }]);

        expect(document.search("title", {
            field: ["data:title"]
        })).to.eql([{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        expect(document.search({
            query: "body"
        })).to.eql([{
            field: "data:body",
            result: [2, 1, 0]
        }]);

        expect(document.search("title")).to.eql([{
            field: "data:title",
            result: [2, 1, 0]
        }]);

        expect(document.search([{
            field: "data:title",
            query: "body"
        },{
            field: "data:body",
            query: "body"
        }])).to.eql([{
            field: "data:body",
            result: [2, 1, 0]
        }]);

        // ---------------------------------------

        for(let i = 0; i < update.length; i++){
            document.add(update[i]);
            document_with_store.add(update[i]);
        }

        expect(document.search("foo")).to.eql([{
            field: "data:title",
            result: [0, 1, 2]
        }]);

        expect(document.search("bar")).to.eql([{
            field: "data:body",
            result: [0, 1, 2]
        }]);

        expect(document.search("foo bar", { suggest: true })).to.eql([{
            field: "data:title",
            result: [0, 1, 2]
        },{
            field: "data:body",
            result: [0, 1, 2]
        }]);

        expect(document.search("foo bar", { suggest: true, merge: true })).to.eql([
            { id: 0, field: [ 'data:title', 'data:body' ] },
            { id: 1, field: [ 'data:title', 'data:body' ] },
            { id: 2, field: [ 'data:title', 'data:body' ] }
        ]);

        expect(document_with_store.search({
            query: "foo",
            pluck: "data:title",
            enrich: true
        }).map(res => res.doc)).to.eql(update);

        expect(document_with_store.search({
            query: "bar",
            pluck: "data:body",
            enrich: true
        }).map(res => res.doc)).to.eql(update);

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


    it("Should have been unique results", function(){

        const document = new Document({
            document: {
                id: "id",
                field: ["field1", "field2"]
            }
        });

        const data = [{
            id: 1,
            field1: "phrase",
            field2: "phrase next"
        },{
            id: 2,
            field1: "phrase next",
            field2: "phrase"
        }];

        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
        }

        expect(document.search("phrase")).to.eql([{
            field: "field1",
            result: [1, 2]
        },{
            field: "field2",
            result: [1, 2]
        }]);

        expect(document.search("phrase", { suggest: true })).to.eql([{
            field: "field1",
            result: [1, 2]
        },{
            field: "field2",
            result: [1, 2]
        }]);
    });

    it("Should have been sorted properly by number of field count matches", function(){

        const document = new Document({
            document: {
                id: "id",
                field: ["field1", "field2"]
            }
        });

        const data = [{
            id: 1,
            field1: "phrase",
            field2: "phrase next"
        },{
            id: 2,
            field1: "phrase next",
            field2: "phrase"
        }];

        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
        }

        expect(document.search("phrase", { suggest: true, merge: true })).to.eql([
            { id: 1, field: [ 'field1', 'field2' ] },
            { id: 2, field: [ 'field1', 'field2' ] }
        ]);

        expect(document.search("phrase next", { suggest: true, merge: true })).to.eql([
            { id: 2, field: [ 'field1', 'field2' ] },
            { id: 1, field: [ 'field1', 'field2' ] }
        ]);
    });

    it("Should not have been shared the Encoder", function(){

        const document = new Document({
            document: {
                id: "id",
                field: ["field1", "field2"]
            }
        });

        expect(document.index.get("field1").encoder).not.to.equal(
            document.index.get("field2").encoder
        );
    });

    it("Should have been shared the Encoder", function(){

        const document = new Document({
            encoder: new Encoder(),
            document: {
                id: "id",
                field: ["field1", "field2"]
            }
        });

        expect(document.index.get("field1").encoder).to.equal(
            document.index.get("field2").encoder
        );
    });

    it("Should have been applied limit/offset properly", function(){

        const document = new Document({
            document: {
                store: true,
                id: "id",
                field: [
                    "data:title",
                    "data:body"
                ]
            }
        });

        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
        }

        expect(document.search({
            query: "title",
            pluck: "data:title",
            enrich: true,
            suggest: true,
            limit: 2
        }).map(res => res.doc)).to.eql([data[0], data[1]]);

        expect(document.search({
            query: "body",
            pluck: "data:body",
            enrich: true,
            suggest: true,
            limit: 1,
            offset: 1
        }).map(res => res.doc)).to.eql([data[1]]);

        expect(document.search({
            query: "title",
            suggest: true,
            limit: 1,
            offset: 3
        })).to.eql([]);

        expect(document.search({
            query: "title",
            suggest: true,
            offset: 3
        })).to.eql([]);
    });

    it("Custom Document Store", function(){

        const document = new Document({
            document: {
                store: [
                    "data:title"
                ],
                id: "id",
                field: [
                    "data:title",
                    "data:body"
                ]
            }
        });

        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
        }

        expect(document.search({
            query: "title",
            enrich: true,
            suggest: true,
            merge: true
        }).map(res => res.doc)).to.eql([
            { data: { title: data[0].data.title }},
            { data: { title: data[1].data.title }},
            { data: { title: data[2].data.title }}
        ]);
    });
});
