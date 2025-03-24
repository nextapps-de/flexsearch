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

export default function(DB, DBClass){

    const data = [{
        "tconst": "tt0000001",
        "titleType": "short",
        "primaryTitle": "Carmencita",
        "originalTitle": "Carmencita",
        "isAdult": 0,
        "startYear": "1894",
        "endYear": "",
        "runtimeMinutes": "1",
        "genres": [
            "Documentary",
            "Short"
        ]
    },{
        "tconst": "tt0000002",
        "titleType": "short",
        "primaryTitle": "Le clown et ses chiens",
        "originalTitle": "Le clown et ses chiens",
        "isAdult": 0,
        "startYear": "1892",
        "endYear": "",
        "runtimeMinutes": "5",
        "genres": [
            "Animation",
            "Short"
        ]
    }];

    it("Should have created the instance properly", async function(){

        // create DB instance with namespace
        const db = new DB("test-store", {
            type: "integer"
        });

        expect(db).to.respondTo("mount");
        expect(db).to.respondTo("close");
        expect(db).to.hasOwnProperty("id");
        expect(db).to.hasOwnProperty("field");
        expect(db).to.hasOwnProperty("db");

        // create a simple index which can store id-content-pairs
        let index = new Index({
            tokenize: "strict"
        });

        // mount database to the index
        await index.mount(db);
        expect(index.db).to.equal(db);
        await index.destroy();
        expect(index.db).to.equal(db);
        // mount database to the index
        await db.mount(index);
        expect(index.db).to.equal(db);
        //await index.clear();

        // some test data
        const data = [
            'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute',
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ];

        // add data to the index
        for(let i = 0; i < data.length; i++){
            index.add(i, data[i]);
        }

        expect(index.reg.size).to.equal(7);
        expect(index.map.size).not.to.equal(0);

        await index.commit();

        expect(index.reg.size).to.equal(0);
        expect(index.map.size).to.equal(0);

        let result = await index.search("cats cute");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = await index.search("cute cats");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = await index.search("cute dogs cats");
        expect(result).to.eql([1]);

        // todo Redis Union did not sort by term count matches yet
        if(DBClass !== "Redis"){
            result = await index.search("cute dogs cats", { suggest: true });
            expect(result).to.eql([1, 6, 5, 4, 3, 2, 0]);
        }

        result = await index.search("cute cat");
        expect(result.length).to.equal(0);

        await index.destroy();
        await index.db.close();
    });

    it("Should have created the instance properly (Context Search)", async function(){

        // create DB instance with namespace
        const db = new DB("test-store", {
            type: "integer"
        });

        expect(db).to.respondTo("mount");
        expect(db).to.respondTo("close");
        expect(db).to.hasOwnProperty("id");
        expect(db).to.hasOwnProperty("field");
        expect(db).to.hasOwnProperty("db");

        // create a simple index which can store id-content-pairs
        let index = new Index({
            tokenize: "strict",
            //context: true
        });

        // mount database to the index
        await index.mount(db);
        expect(index.db).to.equal(db);
        //await index.destroy();
        //expect(index.db).to.equal(db);
        // mount database to the index
        //await db.mount(index);
        //expect(index.db).to.equal(db);
        //await index.clear();

        // some test data
        const data = [
            'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute',
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ];

        // add data to the index
        for(let i = 0; i < data.length; i++){
            index.add(i, data[i]);
        }

        expect(index.reg.size).to.equal(7);
        expect(index.map.size).not.to.equal(0);

        await index.commit();

        expect(index.reg.size).to.equal(0);
        expect(index.map.size).to.equal(0);

        let result = await index.search("cats cute");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = await index.search("cute cats");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = await index.search("cute dogs cats");
        expect(result).to.eql([1]);

        // todo Redis Union did not sort by term count matches yet
        if(DBClass !== "Redis"){
            result = await index.search("cute dogs cats", { suggest: true });
            expect(result).to.eql([1, 6, 5, 4, 3, 2, 0]);
        }

        result = await index.search("cute cat");
        expect(result.length).to.equal(0);

        await index.destroy();
        await index.db.close();
    });

    it("Documents", async function(){

        // create DB instance with namespace
        const db = new DB("my-store");

        // create the document index
        const document = new Document({
            encoder: Charset.LatinBalance,
            document: {
                id: "tconst",
                store: true,
                index: [{
                    field: "primaryTitle",
                    tokenize: "forward"
                },{
                    field: "originalTitle",
                    tokenize: "forward"
                }],
                tag: [{
                    field: "startYear"
                },{
                    field: "genres"
                }]
            }
        });

        // mount database to the index
        await document.mount(db);
        expect(document.index.get("primaryTitle").db).to.be.instanceof(db.constructor);
        expect(document.index.get("originalTitle").db).to.be.instanceof(db.constructor);
        expect(document.index.get("startYear").db).to.be.instanceof(db.constructor);
        expect(document.index.get("genres").db).to.be.instanceof(db.constructor);

        //await document.destroy();
        //expect(document.index.get("primaryTitle").db).to.be.instanceof(db.constructor);
        // mount database to the index
        //await db.mount(document);
        //expect(document.index.get("primaryTitle").db).to.be.instanceof(db.constructor);
        //document.clear();

        // add test data
        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
        }

        // transfer changes in bulk
        await document.commit();

        expect(document.index.get("primaryTitle").reg.size).to.equal(0);
        expect(document.index.get("primaryTitle").map.size).to.equal(0);
        expect(document.index.get("originalTitle").reg.size).to.equal(0);
        expect(document.index.get("originalTitle").map.size).to.equal(0);
        expect(document.index.get("startYear").reg.size).to.equal(0);
        expect(document.index.get("startYear").map.size).to.equal(0);
        expect(document.index.get("genres").reg.size).to.equal(0);
        expect(document.index.get("genres").map.size).to.equal(0);
        expect(document.reg.size).to.equal(0);
        expect(document.store.size).to.equal(0);
        expect(document.tag.size).to.equal(2);
        expect(document.tag.get("startYear").size).to.equal(0);
        expect(document.tag.get("genres").size).to.equal(0);

        expect(await document.contain(data[0]["tconst"])).to.equal(true);

        let result = await document.search({
            query: "karmen"
        });

        expect(result).to.eql([
            { field: 'primaryTitle', result: [ data[0]["tconst"] ] },
            { field: 'originalTitle', result: [ data[0]["tconst"] ] }
        ]);

        result = await document.search({
            query: "karmen",
            tag: {
                "startYear": "1894",
                "genres": [
                    "Documentary",
                    "Short"
                ]
            },
        });

        expect(result).to.eql([
            { field: 'primaryTitle', result: [ data[0]["tconst"] ] },
            { field: 'originalTitle', result: [ data[0]["tconst"] ] }
        ]);

        result = await document.search({
            query: "karmen",
            tag: {
                "startYear": "1894",
                "genres": [
                    "Documentary",
                    "Short"
                ]
            },
            enrich: true
        });

        expect(result).to.eql([{
            field: "primaryTitle",
            result: [{
                id: data[0]["tconst"],
                doc: data[0],
            }]
        },{
            field: "originalTitle",
            result: [{
                id: data[0]["tconst"],
                doc: data[0],
            }]
        }]);

        result = await document.search({
            query: "karmen",
            tag: {
                "startYear": "1894",
                "genres": [
                    "Documentary",
                    "Short"
                ]
            },
            suggest: true,
            enrich: true
        });

        expect(result).to.eql([
            { field: 'primaryTitle', result: [{
                id: data[0]["tconst"],
                doc: data[0],
            }] },
            { field: 'originalTitle', result: [{
                id: data[0]["tconst"],
                doc: data[0],
            }] }
        ]);

        result = await document.search({
            query: "karmen or clown or nothing",
            suggest: true,
            enrich: true,
            merge: true
        });

        expect(result).to.deep.contain({
            id: 'tt0000001',
            doc: data[0],
            field: [ 'primaryTitle', 'originalTitle' ]
        });

        expect(result).to.deep.contain({
            id: 'tt0000002',
            doc: data[1],
            field: [ 'primaryTitle', 'originalTitle' ]
        });

        for(const index of document.index.values()){
            index.destroy();
            index.db.close();
        }
    });
}