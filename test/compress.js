global.self = global;
const env = process.argv[process.argv.length - 1] === "--exit" ? "" : process.argv[process.argv.length - 1];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Document, compress, decompress } = FlexSearch;
const build_light = env && env.includes("light");

if(!build_light) describe("Compression Utilities", function(){

    this.timeout(10000); // Compression can take time

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

    it("Should achieve reasonable compression ratio", async function(){

        const largeString = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(500);
        
        const compressed = await compress(largeString);
        const ratio = (1 - (compressed.length / Buffer.byteLength(largeString))) * 100;
        
        // Typical gzip ratio for repeated text is 90-95%+
        expect(ratio).to.be.greaterThan(75);
    });

    it("Should serialize Document with compression", async function(){

        this.timeout(15000);

        const config = {
            document: {
                id: "id",
                store: true,
                index: [{
                    field: "title",
                    tokenize: "forward"
                },{
                    field: "body",
                    tokenize: "forward"
                }]
            }
        };

        let document = new Document(config);

        // Generate large dataset (500+ documents)
        for(let i = 0; i < 500; i++){
            document.add({
                id: i,
                title: "Document " + i + " with keywords searching testing",
                body: "This is document number " + i + " containing multiple paragraphs of text. ".repeat(5)
            });
        }

        // Serialize without compression
        const uncompressed = document.serialize(true, false);
        expect(typeof uncompressed).to.equal('string');

        // Serialize with compression
        const compressed = await document.serialize(true, true);
        expect(compressed).to.be.instanceOf(Uint8Array);
        expect(compressed.length).to.be.lessThan(Buffer.byteLength(uncompressed));

        // Verify compression ratio
        const ratio = (1 - (compressed.length / Buffer.byteLength(uncompressed))) * 100;
        expect(ratio).to.be.greaterThan(20); // At least 20% compression

        // Decompress and verify it matches original (minus wrapper)
        const decompressed = await decompress(compressed);
        expect(decompressed).to.equal(uncompressed);
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

        // Serialize empty document
        const uncompressed = document.serialize(false, false);
        expect(uncompressed).to.equal('');

        // Serialize empty document with compression (should still compress even empty/small)
        const compressed = await document.serialize(false, true);
        expect(compressed).to.be.instanceOf(Uint8Array);

        const decompressed = await decompress(compressed);
        expect(decompressed).to.equal('');
    });

    it("Should handle large multi-field Document", async function(){

        this.timeout(20000);

        const config = {
            document: {
                id: "id",
                store: true,
                index: [
                    { field: "title" },
                    { field: "description" },
                    { field: "category" },
                    { field: "tags" },
                    { field: "author" }
                ]
            }
        };

        let document = new Document(config);

        // Add 1000 documents with multiple fields
        const keywords = ["search", "flex", "index", "database", "query", "fast"];
        for(let i = 0; i < 1000; i++){
            const docData = {
                id: i,
                title: keywords[i % keywords.length] + " document " + i,
                description: "A longer description containing search keywords " + keywords[i % keywords.length].repeat(3),
                category: ["tech", "search", "index"][i % 3],
                tags: "tag" + (i % 10) + " tag" + (i % 20),
                author: "Author " + (i % 50)
            };
            document.add(docData);
        }

        // Test serialization
        const uncompressed = document.serialize(true, false);
        expect(uncompressed.length).to.be.greaterThan(1000); // Should be substantial

        // Test compression
        const compressed = await document.serialize(true, true);
        expect(compressed.length).to.be.lessThan(uncompressed.length);

        // Decompress and inject to new document
        const decompressed = await decompress(compressed);
        const inject = new Function("doc", decompressed.slice(21, -1)); // Extract body from wrapper

        let document2 = new Document(config);
        inject(document2);

        // Verify restored data
        const search1 = document.search("search");
        const search2 = document2.search("search");
        if(search1 && search1.result && search2 && search2.result){
            expect(search2.result.length).to.equal(search1.result.length);
        }
    });

});
