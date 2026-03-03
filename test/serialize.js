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
            ['1.cfg', '{"tokenize":"forward"}'],
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
            ['1.cfg', '{"context":{"depth":1}}'],
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

    it("Should have been serialized Index with self-contained inject (Fast-Boot)", function(){

        let index = new Index({
            tokenize: "forward",
            encoder: Charset.LatinBalance
        });

        index.add(1, "Carmencita");
        index.add(2, "Le clown et ses chiens");

        const body = index.serialize(false, true);
        const index2 = new Function("FlexSearch", body)(FlexSearch);

        expect(index2).to.be.instanceOf(Index);
        expect(index2.tokenize).to.equal(index.tokenize);
        expect(index2.reg.size).to.equal(index.reg.size);
        expect(Array.from(index2.reg)).to.eql(Array.from(index.reg));
        expect(normalize_map(index2.map)).to.eql(normalize_map(index.map));

        // Encoder works: phonetic search results match original (proves LatinBalance restored)
        expect(index2.search("karmen")).to.eql(index.search("karmen"));

        // Encoder works for documents added to the restored index
        index.add(3, "Carmelo");
        index2.add(3, "Carmelo");
        expect(index2.search("karm")).to.eql(index.search("karm"));
    });

    it("Should have been exported Index with cfg", function(){

        let index = new Index({
            tokenize: "forward",
            encoder: Charset.LatinBalance
        });

        index.add(1, "Carmencita");
        index.add(2, "Le clown et ses chiens");

        const payload = new Map();
        index.export(function(key, value){ payload.set(key, value); });

        expect(Array.from(payload.keys())).to.include("1.cfg");

        let index2 = new Index({});
        for(const [key, value] of payload){
            index2.import(key, value);
        }

        expect(index2.tokenize).to.equal(index.tokenize);
        expect(index2.reg.size).to.equal(index.reg.size);
        expect(normalize_map(index2.map)).to.eql(normalize_map(index.map));

        // Encoder works: phonetic search results match original (proves LatinBalance restored)
        expect(index2.search("karmen")).to.eql(index.search("karmen"));

        // Encoder works for documents added to the restored index
        index.add(3, "Carmelo");
        index2.add(3, "Carmelo");
        expect(index2.search("karm")).to.eql(index.search("karm"));
    });

    it("Kitchen sink: Index - encoder, score, context, priority, keystore", function () {

        // Inline encoder strips vowels ("alpha"→"lph", "tau"→"t").
        // Score always returns 0 (best bucket) — a post-restore add to "sigma tau"
        // must put "t" in bucket 0; the default scorer at resolution=4 puts i=1 → bucket 1.
        // normalize_index covers config scalars + score source + map/ctx data in one eql.

        function makeKsIndex() {
            return new Index({
                tokenize: "strict",
                resolution: 4,
                context: { depth: 1, bidirectional: false, resolution: 2 },
                rtl: false,
                priority: 2,
                keystore: 4,
                encoder: function (str) {
                    return str.toLowerCase().replace(/[aeiou]/g, "").split(/\s+/).filter(Boolean);
                },
                score: function (content, term, i) { return 0; }
            });
        }

        const ksRef = makeKsIndex();
        ksRef.add(1, "alpha beta gamma");
        ksRef.add(2, "delta epsilon");

        // Serialize for inject BEFORE mutating ksRef with the post-restore liveness doc
        const body = ksRef.serialize(false, true);
        const ks3 = new Function("FlexSearch", body)(FlexSearch);

        // Export / import
        const payload = new Map();
        ksRef.export(function (key, value) { payload.set(key, value); });
        const ks2 = new Index({});
        for (const [key, value] of payload) { ks2.import(key, value); }

        // Single eql: config scalars + score source + full map/ctx data
        expect(normalize_index(ks2)).to.eql(normalize_index(ksRef));
        expect(normalize_index(ks3)).to.eql(normalize_index(ksRef));
        expect(ks3).to.be.instanceOf(Index);

        // One search tests encoder (strips vowels), context (depth=1 multi-term), tokenizer
        // "alpha beta" → ["lph", "bt"] (vowels stripped), both in same doc (context), strict tokenize
        expect(ks2.search("alpha beta")).to.eql(ksRef.search("alpha beta"));
        expect(ks3.search("alpha beta")).to.eql(ksRef.search("alpha beta"));
        expect(ks2.search("alpha beta")).to.eql([1]);

        // Score liveness: "sigma tau" → "t" token. score()=0 → bucket 0.
        // Default scorer at resolution=4 puts i=1 tokens in bucket > 0.
        ksRef.add(3, "sigma tau");
        ks2.add(3, "sigma tau");
        ks3.add(3, "sigma tau");
        expect(ks2.map.get("t")[0]).to.include(3);
        expect(ks3.map.get("t")[0]).to.include(3);
    });

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

    it("Kitchen sink: Document - deep nesting, per-field custom functions", function () {

        // meta:title: nested field path, LatinBalance encoder, forward tokenize
        // genre: inline vowel-stripping encoder, score always 0 (bucket liveness proof)
        // year: tag field; store: enabled
        // normalize_doc covers key, fields, tree, tagtree, store size + per-field map/ctx/config.

        const ksDocData = [{
            id: 1, meta: { title: "Carmencita" }, genre: "fantasy", year: "1865"
        }, {
            id: 2, meta: { title: "Gulliver" }, genre: "adventure", year: "1864"
        }];

        function makeKsDoc() {
            return new Document({
                document: {
                    id: "id",
                    store: true,
                    index: [{
                        field: "meta:title",
                        tokenize: "forward",
                        encoder: Charset.LatinBalance
                    }, {
                        field: "genre",
                        tokenize: "strict",
                        encoder: function (str) {
                            return str.toLowerCase().replace(/[aeiou]/g, "").split(/\s+/).filter(Boolean);
                        },
                        score: function (content, term, i) { return 0; }
                    }],
                    tag: [{ field: "year" }]
                }
            });
        }

        const ksDocRef = makeKsDoc();
        for (const record of ksDocData) ksDocRef.add(record);

        // Export / import
        const payload = new Map();
        ksDocRef.export(function (key, value) { payload.set(key, value); });
        expect(Array.from(payload.keys())[0]).to.equal("1.cfg");
        const ksDoc2 = new Document({});
        for (const [key, value] of payload) ksDoc2.import(key, value);

        // Self-contained inject AFTER export/import
        const body = ksDocRef.serialize(false, false, true);
        const ksDoc3 = new Function("FlexSearch", body)(FlexSearch);

        // Single eql: key, fields, tree, tagtree, store size, per-field config + map data
        expect(normalize_doc(ksDoc2)).to.eql(normalize_doc(ksDocRef));
        expect(normalize_doc(ksDoc3)).to.eql(normalize_doc(ksDocRef));

        // Tag-filtered search tests: LatinBalance encoder on meta:title, tags live, store live
        // Tests that field-specific config (encoder, tokenize, tags) all survived
        const tagQ = { query: "karmen", tag: { year: "1865" } };
        expect(ksDoc2.search(tagQ)).to.eql(ksDocRef.search(tagQ));
        expect(ksDoc3.search(tagQ)).to.eql(ksDocRef.search(tagQ));
        expect(ksDoc2.search(tagQ).some(r => r.result.includes(1))).to.equal(true);

        // Per-field encoder: genre field uses vowel-stripping encoder
        expect(ksDoc2.search("fntsy")).to.eql(ksDocRef.search("fntsy"));
        expect(ksDoc3.search("fntsy")).to.eql(ksDocRef.search("fntsy"));

        // Score liveness + tree/tagtree live after restore: add new doc to all three
        const newDoc = { id: 3, meta: { title: "Alice in Wonderland" }, genre: "fantasy", year: "1866" };
        ksDocRef.add(newDoc);
        ksDoc2.add(newDoc);
        ksDoc3.add(newDoc);

        expect(ksDoc2.search("alice")).to.eql(ksDocRef.search("alice"));
        expect(ksDoc3.search("alice")).to.eql(ksDocRef.search("alice"));
        // score()=0 for genre → "fntsy" must land in bucket 0 for newDoc
        expect(ksDoc2.index.get("genre").map.get("fntsy")[0]).to.include(3);
        expect(ksDoc3.index.get("genre").map.get("fntsy")[0]).to.include(3);

        const tagQ2 = { query: "alice", tag: { year: "1866" } };
        expect(ksDoc2.search(tagQ2)).to.eql(ksDocRef.search(tagQ2));
        expect(ksDoc3.search(tagQ2)).to.eql(ksDocRef.search(tagQ2));
    });

    it("Should exportIndexBulk/importIndexBulk with compression (Index)", async function(){

        const idx = new Index({ tokenize: "forward", resolution: 3 });
        idx.add(0, "foo bar foobar");
        idx.add(1, "bar foo foobar");
        idx.add(2, "foobar foo bar");

        const compressed = await idx.exportIndexBulk(true);
        expect(compressed).to.be.instanceOf(Uint8Array);

        const idx2 = new Index({});
        await idx2.importIndexBulk(compressed, true);

        expect(normalize_index(idx2)).to.eql(normalize_index(idx));
        expect(idx2.search("foobar")).to.eql(idx.search("foobar"));

        // bulk import still works from map payload
        const payload = new Map();
        idx.export(function(key, value){ payload.set(key, value); });
        const idx3 = new Index({});
        idx3.import(payload);
        expect(normalize_index(idx3)).to.eql(normalize_index(idx));
    });

    it("Should exportDocumentBulk/importDocumentBulk with compression (Document)", async function(){

        const doc = new Document({
            document: {
                id: "id",
                store: true,
                index: [{ field: "title", tokenize: "forward" }],
                tag: [{ field: "year" }]
            }
        });
        doc.add({ id: 1, title: "Carmencita", year: "1865" });
        doc.add({ id: 2, title: "Gulliver", year: "1864" });

        const compressed = await doc.exportDocumentBulk(true);
        expect(compressed).to.be.instanceOf(Uint8Array);

        const doc2 = new Document({});
        await doc2.importDocumentBulk(compressed, true);

        expect(normalize_doc(doc2)).to.eql(normalize_doc(doc));
        const tagQ = { query: "carmen", tag: { year: "1865" } };
        expect(doc2.search(tagQ)).to.eql(doc.search(tagQ));
        expect(doc2.search(tagQ).some(r => r.result.includes(1))).to.equal(true);

        // bulk import still works from map payload
        const payload = new Map();
        doc.export(function(key, value){ payload.set(key, value); });
        const doc3 = new Document({});
        doc3.import(payload);
        expect(normalize_doc(doc3)).to.eql(normalize_doc(doc));
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

function normalize_index(idx) {
    return {
        tokenize: idx.tokenize,
        resolution: idx.resolution,
        depth: idx.depth,
        bidirectional: idx.bidirectional,
        resolution_ctx: idx.resolution_ctx,
        rtl: idx.rtl,
        priority: idx.priority,
        keystore: idx.keystore || 0,
        score: idx.score ? idx.score.toString() : null,
        map: normalize_map(idx.map),
        ctx: normalize_ctx(idx.ctx),
        regSize: idx.reg.size
    };
}

function normalize_doc(doc) {
    const fields = {};
    for (const field of doc.field) {
        fields[field] = normalize_index(doc.index.get(field));
    }
    return {
        key: doc.key,
        field: doc.field.slice(),
        tree: doc.tree.map(t => Array.isArray(t) ? t.slice() : t),
        tagfield: (doc.tagfield || []).slice(),
        tagtree: (doc.tagtree || []).map(t => Array.isArray(t) ? t.slice() : t),
        store: doc.store ? Array.from(doc.store.entries()) : null,
        fields
    };
}