import { expect } from "chai";

describe("Persistent: IndexedDB", function(){

    it("Should resolve IndexedDB from globalThis (e.g. inside a Web Worker, where there is no window)", async function(){

        // Node has no "window" global, which is exactly the condition that
        // broke this adapter inside Web Workers (see #546): "window" is not
        // defined there either, even though "indexedDB" is available via
        // "globalThis"/"self".
        expect(typeof window).to.equal("undefined");

        let openCalledWith = null;

        globalThis.indexedDB = {
            open(name, version){
                openCalledWith = [name, version];
                // return a minimal request-like object; the adapter only
                // assigns handlers to it, it doesn't need to ever resolve
                // for this test
                return {};
            }
        };

        try{
            const { default: IdxDB } = await import("../src/db/indexeddb/index.js?t=" + Date.now());
            const db = new IdxDB("worker-test");

            db.open();

            expect(openCalledWith).to.eql(["flexsearch:worker-test", 1]);
        }
        finally{
            delete globalThis.indexedDB;
        }
    });
});
