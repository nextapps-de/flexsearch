/**
 * Test for Issue #509: Expose search score and IndexedDB export/import
 */

const { expect } = require("chai");
const { Index, IndexedDB } = require("../dist/flexsearch.bundle.min.js");

describe("Issue #509: Score Exposure and IndexedDB Export/Import", function(){

    describe("Score Exposure", function(){

        it("should return scores when score option is enabled", function(){
            const index = new Index();
            
            index.add(1, "hello world");
            index.add(2, "hello flexsearch");
            index.add(3, "world peace");
            index.add(4, "flexsearch is fast");
            
            const results = index.search("hello", { score: true, limit: 10 });
            
            expect(results).to.be.an("array");
            expect(results.length).to.be.greaterThan(0);
            
            // Check if results have score property
            if(results.length > 0 && typeof results[0] === "object"){
                expect(results[0]).to.have.property("id");
                expect(results[0]).to.have.property("score");
                expect(results[0].score).to.be.a("number");
                expect(results[0].score).to.be.greaterThan(0);
            }
        });

        it("should return plain IDs when score option is disabled", function(){
            const index = new Index();
            
            index.add(1, "hello world");
            index.add(2, "hello flexsearch");
            
            const results = index.search("hello", { limit: 10 });
            
            expect(results).to.be.an("array");
            if(results.length > 0){
                // Should be plain IDs, not objects
                expect(typeof results[0] === "number" || typeof results[0] === "string").to.be.true;
            }
        });

        it("should return scores for multi-term queries", function(){
            const index = new Index();
            
            index.add(1, "hello world");
            index.add(2, "hello flexsearch");
            index.add(3, "world peace");
            
            const results = index.search("hello world", { score: true, limit: 10 });
            
            expect(results).to.be.an("array");
            if(results.length > 0 && typeof results[0] === "object"){
                expect(results[0]).to.have.property("id");
                expect(results[0]).to.have.property("score");
            }
        });

        it("should return scores with suggestions enabled", function(){
            const index = new Index();
            
            index.add(1, "hello world");
            index.add(2, "hello flexsearch");
            
            const results = index.search("helo", { score: true, suggest: true, limit: 10 });
            
            expect(results).to.be.an("array");
            if(results.length > 0 && typeof results[0] === "object"){
                expect(results[0]).to.have.property("id");
                expect(results[0]).to.have.property("score");
            }
        });
    });

    describe("IndexedDB Export/Import", function(){

        if(typeof window !== "undefined" && window.indexedDB){

            it("should export IndexedDB index to JSON", async function(){
                const db = new IndexedDB("test-export");
                const index = new Index({ db: db });
                
                await index.mount(db);
                
                index.add(1, "hello world");
                index.add(2, "hello flexsearch");
                await index.commit();
                
                let exportedData = null;
                
                await db.export(function(key, data){
                    expect(key).to.equal("indexeddb.json");
                    expect(data).to.be.a("string");
                    exportedData = JSON.parse(data);
                    expect(exportedData).to.have.property("id");
                    expect(exportedData).to.have.property("data");
                    expect(exportedData.data).to.be.an("object");
                });
                
                expect(exportedData).to.not.be.null;
                
                await db.destroy();
            });

            it("should import IndexedDB index from JSON", async function(){
                // First, create and export an index
                const db1 = new IndexedDB("test-import-source");
                const index1 = new Index({ db: db1 });
                
                await index1.mount(db1);
                index1.add(1, "hello world");
                index1.add(2, "hello flexsearch");
                await index1.commit();
                
                let exportedJson = null;
                await db1.export(function(key, data){
                    exportedJson = data;
                });
                
                await db1.destroy();
                
                // Now import into a new index
                const db2 = new IndexedDB("test-import-target");
                const index2 = new Index({ db: db2 });
                
                await index2.mount(db2);
                await db2.import("indexeddb.json", exportedJson);
                
                // Verify the data was imported
                const results = await index2.search("hello");
                expect(results).to.be.an("array");
                expect(results.length).to.be.greaterThan(0);
                
                await db2.destroy();
            });

            it("should handle export/import roundtrip", async function(){
                const db1 = new IndexedDB("test-roundtrip-1");
                const index1 = new Index({ db: db1 });
                
                await index1.mount(db1);
                index1.add(1, "test data one");
                index1.add(2, "test data two");
                index1.add(3, "another test");
                await index1.commit();
                
                const originalResults = await index1.search("test");
                expect(originalResults.length).to.be.greaterThan(0);
                
                let exportedData = null;
                await db1.export(function(key, data){
                    exportedData = data;
                });
                
                await db1.destroy();
                
                // Import to new database
                const db2 = new IndexedDB("test-roundtrip-2");
                const index2 = new Index({ db: db2 });
                
                await index2.mount(db2);
                await db2.import("indexeddb.json", exportedData);
                
                const importedResults = await index2.search("test");
                expect(importedResults.length).to.equal(originalResults.length);
                
                await db2.destroy();
            });
        } else {
            it.skip("IndexedDB tests require browser environment", function(){});
        }
    });
});
