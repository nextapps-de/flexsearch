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

    it("Should have been exported Document-Index properly", function(){

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
});

function normalize_map(map){
    return Array.from(map.entries()).map(item => {
        item[1].forEach((res, i) => res.length || delete item[1][i]);
        return item;
    });
}

function normalize_ctx(ctx){
    return Array.from(ctx.entries()).map(item => {
        item[1] = normalize_map(item[1]);
        return item;
    });
}