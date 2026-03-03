global.self = global;
const env = process.argv[process.argv.length - 1] === "--exit" ? "" : process.argv[process.argv.length - 1];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Document, compress, decompress, Charset } = FlexSearch;
const build_light = env && env.includes("light");

if(!build_light) describe("Compression Utilities", function(){

    this.timeout(10000);

    it("Should compress and decompress strings", async function(){
        const testString = "Hello, this is a test string for compression!".repeat(100);
        const compressed = await compress(testString);
        expect(compressed).to.be.instanceOf(Uint8Array);
        expect(compressed.length).to.be.lessThan(testString.length);
        const decompressed = await decompress(compressed);
        expect(decompressed).to.equal(testString);
    });

    it("Should compress and decompress binary data", async function(){
        const testData = new Uint8Array(Array.from({length: 1000}, (_, i) => i % 256));
        const compressed = await compress(testData);
        expect(compressed).to.be.instanceOf(Uint8Array);
        expect(compressed.length).to.be.lessThan(testData.length);
        const decompressed = await decompress(compressed);
        expect(decompressed.length).to.equal(testData.length);
    });

    it("Should serialize Document with compression", async function(){
        const data = [{
            "tconst": "tt0000001",
            "titleType": "short",
            "primaryTitle": "Carmencita",
            "originalTitle": "Carmencita",
            "isAdult": 0,
            "startYear": "1894",
            "endYear": "",
            "runtimeMinutes": "1",
            "genres": ["Documentary", "Short"]
        },{
            "tconst": "tt0000002",
            "titleType": "short",
            "primaryTitle": "Le clown et ses chiens",
            "originalTitle": "Le clown et ses chiens",
            "isAdult": 0,
            "startYear": "1892",
            "endYear": "",
            "runtimeMinutes": "5",
            "genres": ["Animation", "Short"]
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

        let document = new Document(config);
        for(let i = 0; i < data.length; i++){
            document.add(data[i]);
        }

        // Serialize without compression
        const uncompressed = document.serialize(false, false);
        expect(typeof uncompressed).to.equal('string');

        // Serialize with compression
        const compressed = await document.serialize(false, true);
        expect(compressed).to.be.instanceOf(Uint8Array);
        expect(compressed.length).to.be.lessThan(Buffer.byteLength(uncompressed));

        // Decompress and inject
        const decompressed = await decompress(compressed);
        expect(decompressed).to.equal(uncompressed);

        const inject = new Function("doc", decompressed);
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
        }

        // Test search results match
        const search1 = document.search("karmen");
        const search2 = document2.search("karmen");
        expect(search2).to.eql(search1);
    });

    it("Should handle empty Document serialization", async function(){
        const config = {
            document: {
                id: "id",
                index: [{
                    field: "title"
                }]
            }
        };

        let document = new Document(config);
        const uncompressed = document.serialize(false, false);
        expect(uncompressed).to.equal('');

        const compressed = await document.serialize(false, true);
        expect(compressed).to.be.instanceOf(Uint8Array);

        const decompressed = await decompress(compressed);
        expect(decompressed).to.equal('');
    });

});
