global.self = global;
const env = process.argv[process.argv.length - 1] === "--exit" ? "" : process.argv[process.argv.length - 1];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver, decompress } = FlexSearch;
const build_light = env && env.includes("light");
const build_compact = env && env.includes("compact");
const build_esm = !env || env.startsWith("module");
const build_es5 = !env || env.includes("es5");
const Charset = _Charset || (await import("../src/charset.js")).default;

if(!build_light) describe("Export / Import", function(){

    it("Should have been exported properly", function(){

        let index = new Index({
            tokenize: "forward"
        });

        index.add(0, "foo bar foobar");
        index.add(1, "bar foo foobar");
        index.add(2, "foobar foo bar");

        expect(index.reg.size).to.equal(3);
        expect(index.map.size).to.equal(8);
        expect(index.search("foobar")).to.eql([2, 0, 1]);

        const payload = new Map();
        index.export(function(key, value){
            payload.set(key, value);
        });

        expect(payload).to.eql(new Map([
            ['1.reg', '[0,1,2]'],
            ['1.map', '[["f",[[0,2],[1]]],["fo",[[0,2],[1]]],["b",[[1],[0],[2]]],["ba",[[1],[0],[2]]],["bar",[[1],[0],[2]]],["fob",[[2],null,[0,1]]],["foba",[[2],null,[0,1]]],["fobar",[[2],null,[0,1]]]]']
        ]));

        index = new Index({
            tokenize: "forward"
        });

        for(const [key, value] of payload){
            index.import(key, value);
        }

        expect(index.reg.size).to.equal(3);
        expect(index.map.size).to.equal(8);
        expect(index.search("foobar")).to.eql([2, 0, 1]);
    });

    it("Should have been exported properly (Context)", function(){

        let index = new Index({
            context: true
        });

        index.add(0, "foo bar foobar");
        index.add(1, "bar foo foobar");
        index.add(2, "foobar foo bar");

        expect(index.reg.size).to.equal(3);
        expect(index.map.size).to.equal(3);
        expect(index.ctx.size).to.equal(2);
        expect(index.search("foobar")).to.eql([2, 0, 1]);

        const payload = new Map();
        index.export(function(key, value){
            payload.set(key, value);
        });

        expect(payload).to.eql(new Map([
            ['1.reg', '[0,1,2]'],
            ['1.map', '[["fo",[[0],[1,2]]],["bar",[[1],[0],[2]]],["fobar",[[2],null,[0,1]]]]'],
            ['1.ctx', '[["fo",[["bar",[[0,1],[2]]]]],["fobar",[["bar",[null,[0]]],["fo",[[2],[1]]]]]]']
        ]));

        index = new Index({
            context: true
        });

        for(const [key, value] of payload){
            index.import(key, value);
        }

        expect(index.reg.size).to.equal(3);
        expect(index.map.size).to.equal(3);
        expect(index.ctx.size).to.equal(2);
        expect(index.search("foobar")).to.eql([2, 0, 1]);
    });

    it("Should have been serialized properly (Fast-Boot)", function(){

        let index = new Index({
            context: true,
            keystore: build_es5 ? 32 : 64
        });

        index.add(0, "foo bar foobar");
        index.add(1, "bar foo foobar");
        index.add(2, "foobar foo bar");

        const fn_string = index.serialize(false);
        const inject = new Function("index", fn_string);

        let index2 = new Index({
            context: true
        });

        inject(index2);

        expect(index2.reg.size).to.equal(3);
        expect(index2.map.size).to.equal(3);
        expect(index2.ctx.size).to.equal(2);
        expect(normalize_map(index2.map)).to.eql(normalize_map(index.map));
        expect(normalize_ctx(index2.ctx)).to.eql(normalize_ctx(index.ctx));
        expect(Array.from(index2.reg.entries())).to.eql(Array.from(index.reg.entries()));
        expect(index2.search("foobar")).to.eql([2, 0, 1]);

        let index3 = new Index({
            context: true
        });

        expect(index3.serialize()).to.equal("function inject(index){}");
    });
});

if(!build_light) describe("Document Export/Import", function(){

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

    const config = {
        document: {
            id: "tconst",
            store: true,
            index: [{
                field: "primaryTitle",
                tokenize: "forward",
                encoder: Charset.LatinBalance
            },{
                field: "originalTitle",
                tokenize: "forward",
                encoder: Charset.LatinBalance
            }],
            tag: [{
                field: "startYear"
            },{
                field: "genres"
            }]
        }
    };

    it("Should have been exported Document-Index properly", function(){

        let document = new Document(config);

        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
        }

        let result = document.search({
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

        const payload = new Map();
        document.export(function(key, data){
            payload.set(key, data);
        });

        document = new Document(config);

        for(const [key, value] of payload){
            document.import(key, value);
        }

        result = document.search({
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
    });

    it("Should have been serialized Document-Index properly (Fast-Boot)", async function(){

        let document = new Document(config);

        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
        }

        // Test basic serialization without compression
        const fn_string = document.serialize(false);
        const inject = new Function("doc", fn_string);

        let document2 = new Document(config);
        inject(document2);

        // Verify internal structures match
        expect(document2.reg.size).to.equal(document.reg.size);
        expect(document2.store.size).to.equal(document.store.size);
        
        // Check each field's index data
        for(const field of document.field){
            const idx1 = document.index.get(field);
            const idx2 = document2.index.get(field);
            expect(idx2.map.size).to.equal(idx1.map.size);
            expect(idx2.ctx.size).to.equal(idx1.ctx.size);
            expect(normalize_map(idx2.map)).to.eql(normalize_map(idx1.map));
            expect(normalize_ctx(idx2.ctx)).to.eql(normalize_ctx(idx1.ctx));
        }

        // Test search results match
        const search1 = document.search("karmen");
        const search2 = document2.search("karmen");
        expect(search2).to.eql(search1);

        // Test with function wrapper
        expect(document.serialize()).to.equal("function inject(doc){" + fn_string + "}");

        // Test serialization with compression
        const compressed = await document.serialize(false, true);
        expect(compressed).to.be.instanceOf(Uint8Array);
        expect(compressed.length).to.be.lessThan(Buffer.byteLength(fn_string));

        // Decompress and verify
        const decompressed = await decompress(compressed);
        expect(decompressed).to.eql(fn_string);

        // Inject decompressed function
        const inject2 = new Function("doc", decompressed);
        let document3 = new Document(config);
        inject2(document3);

        // Verify search results match after decompression
        const search3 = document3.search("karmen");
        expect(search3).to.eql(search1);
    });
});

function normalize_map(map){
    return Array.from(map.entries()).map(item => {
        item[1].forEach((res, i) => (res && res.length) || delete item[1][i]);
        return item;
    });
}

function normalize_ctx(ctx){
    return Array.from(ctx.entries()).map(item => {
        item[1] = normalize_map(item[1]);
        return item;
    });
}