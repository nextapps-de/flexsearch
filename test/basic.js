global.self = global;
const env = process.argv[3];
import { expect } from "chai";
// console.log("--------------");
// console.log(env ? "dist/" + env + ".js" : "src/bundle.js")
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;

// global.FlexSearch = { Index, Document, Worker, Charset, Encoder, Resolver };
// global.build = { build_light, build_compact, build_esm };

describe("Initialize", function(){

    const index = new Index();

    it("Should have proper constructor", function(){

        expect(index).to.be.an.instanceOf(Index);
    });

    it("Should have all provided methods", function(){

        expect(index).to.respondTo("search");
        expect(index).to.respondTo("add");
        expect(index).to.respondTo("append");
        expect(index).to.respondTo("update");
        expect(index).to.respondTo("remove");
        expect(index).to.respondTo("clear");

        expect(index).to.hasOwnProperty("map");
        expect(index).to.hasOwnProperty("ctx");
        expect(index).to.hasOwnProperty("reg");

        if(!build_light){
            expect(index).to.respondTo("searchAsync");
            expect(index).to.respondTo("addAsync");
            expect(index).to.respondTo("appendAsync");
            expect(index).to.respondTo("updateAsync");
            expect(index).to.respondTo("removeAsync");
            expect(index).to.respondTo("export");
            expect(index).to.respondTo("import");
            expect(index).to.respondTo("serialize");
        }
    });

    it("Should have the default options", function(){

        expect(index.resolution).to.equal(9);
        expect(index.depth).to.equal(0);
        expect(index.fastupdate).to.equal(false);
    });

    it("Should have the default Encoder", function(){

        const encoder = new Encoder(Charset.LatinDefault);
        expect(index.tokenize).to.equal("strict");
        expect(typeof index.encoder.normalize).to.equal(typeof encoder.normalize);
        index.encoder.normalize = encoder.normalize;
        expect(index.encoder).to.eql(encoder);
        expect(index.encoder.minlength).to.equal(1);
        expect(index.encoder.maxlength).to.equal(0);
        expect(index.encoder.rtl).to.equal(false);
        expect(index.encoder.numeric).to.equal(true);
        expect(index.encoder.dedupe).to.equal(false);
    });
});

describe("Add", function(){

    it("Should have been properly added to the index", function(){

        const index = new Index();

        index.add(0, "foo");
        index.add(2, "bar");
        index.add(1, "FooBar");
        index.add(3, "Some 'short' content.");

        expect(index.reg.keys()).to.have.members([0, 1, 2, 3]);
        expect(index.map.keys()).to.have.members(["foo", "bar", "foobar", "some", "short", "content"]);
        expect(index.ctx.size).to.equal(0);
        expect(index.reg.size).to.equal(4);
    });

    build_light || it("Should have been numeric content properly added to the index (Triplets)", function(){

        const index = new Index();

        index.add(0, "TEST-123456789123456789");
        index.add(1, "T10030");
        index.add(2, "T10030T10030");
        index.add(3, "1443-AB14345-1778");

        expect(index.reg.keys()).to.have.members([0, 1, 2, 3]);
        expect(index.map.keys()).to.have.members([
            "test", "123", "456", "789",
            "t", "100", "30",
            // id 2 was already completely added, split: "t", "100", "30", "t", "100", "30"
            "144", "3", "ab", "143", "45", "177", "8"
        ]);
        expect(index.ctx.size).to.equal(0);
        expect(index.reg.size).to.equal(4);
    });

    it("Should not have been added to the index (Parameter)", function(){

        const index = new Index();

        index.add("foo");
        index.add(3);
        index.add(null, "foobar");
        index.add(void 0, "foobar");
        index.add(3, null);
        index.add(3, false);

        expect(index.reg.size).to.equal(0);
    });

    it("Should not have been added to the index (Empty)", function(){

        const index = new Index();

        index.add(1, "");
        index.add(2, " ");
        index.add(3, "    ");
        index.add(4, "  -  ");
        index.add(5, ` ...
         -           : , 
        <-- `);

        expect(index.reg.size).to.equal(0);
    });
});

describe("Search (Sync)", function(){

    it("Should have been matched properly", function(){

        const index = new Index();

        index.add(0, "foo");
        index.add(1, "bar");
        index.add(2, "FooBar");
        index.add(3, "Some 'short' content.");
        index.add(4, "Foo Bar");

        expect(index.search("foo")).to.have.members([0, 4]);
        expect(index.search("bar")).to.include(1, 4);
        expect(index.search("foobar")).to.include(2);
        expect(index.search("short 'content'")).to.include(3);
        expect(index.search("foo foo")).to.have.members([0, 4]);
        expect(index.search("foo  foo   bar foo bar")).to.have.members([4]);
    });

    it("Should have been applied limit/offset properly", function(){

        const index = new Index();

        for(let i = 0; i < 10; i++){
            index.add(i, "foo");
        }

        expect(index.search("foo", 99)).to.have.members([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(index.search("foo", 3)).to.have.members([0, 1, 2]);
        expect(index.search("foo", { limit: 3 })).to.have.members([0, 1, 2]);
        expect(index.search("foo", { limit: 3, offset: 3 })).to.have.members([3, 4, 5]);
        expect(index.search("foo", { limit: 3, offset: 9 })).to.have.members([9]);
        expect(index.search("foo", { limit: 3, offset: 10 })).to.have.members([]);
        expect(index.search({ query: "foo", limit: 1 })).to.include(0);
    });
});

describe("Search Scoring", function(){

    it("Should have been matched properly", function(){

        const index = new Index();
        [   'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute',
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ].forEach((item, id) => {
            index.add(id, item);
        });

        let result = index.search("cats cute");
        expect(result.length).to.equal(7);
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = index.search("cute cats");
        expect(result.length).to.equal(7);
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = index.search("cute dogs cats");
        expect(result.length).to.equal(1);
        expect(result).to.eql([1]);

        result = index.search("cute cat");
        expect(result.length).to.equal(0);
    });
});

describe("Tokenizer", function(){

    it("Should have been \"forward\" tokenized properly", function(){

        const index = new Index({ tokenize: "forward" });
        [   'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute',
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ].forEach((item, id) => {
            index.add(id, item);
        });

        let result = index.search("cat cute");
        expect(result.length).to.equal(7);
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = index.search("cute cat");
        expect(result.length).to.equal(7);
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);
    });

    it("Should have been \"reverse\" tokenized properly", function(){

        const index = new Index({ tokenize: "reverse", resolution: 12 });
        [   'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute',
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ].forEach((item, id) => {
            index.add(id, item);
        });

        let result = index.search("ats ute");
        expect(result.length).to.equal(7);
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = index.search("ute ats");
        expect(result.length).to.equal(7);
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);
    });

    it("Should have been \"full\" tokenized properly", function(){

        const index = new Index({ tokenize: "full", resolution: 12 });
        [   'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute',
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ].forEach((item, id) => {
            index.add(id, item);
        });

        let result = index.search("at ut");
        expect(result.length).to.equal(7);
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = index.search("ut at");
        expect(result.length).to.equal(7);
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);
    });
});

describe("Search: Suggestion", function(){

    it("Should have been provide suggestions properly", function(){

        const index = new Index({ tokenize: "forward" });
        [   'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute', // <-- dogs
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ].forEach((item, id) => {
            index.add(id, item);
        });

        let result = index.search("cute dog or cute cat or nothing", { suggest: true });
        expect(result.length).to.equal(7);
        expect(result).to.eql([1, 6, 5, 4, 3, 2, 0]);

        result = index.search("nothing or cute cat or cute dog", { suggest: true });
        expect(result.length).to.equal(7);
        expect(result).to.eql([1, 6, 5, 4, 3, 2, 0]);
    });
});

describe("Update (Sync)", function(){

    it("Should have been updated to the index", function(){

        const index = new Index({ tokenize: "full" });
        index.add(1, "foo");
        index.add(2, "bar");
        index.add(3, "foobar");

        index.update(1, "bar");
        index.update(2, "foobar");
        index.update(3, "foo");

        expect(index.reg.size).to.equal(3);
        expect(index.search("foo")).to.have.members([2, 3]);
        expect(index.search("bar")).to.have.members([1, 2]);
        expect(index.search("bar")).to.not.include(3);
        expect(index.search("foobar")).to.have.members([2]);

        index.update(1, "bar");
        index.update(2, "foobar");
        index.update(3, "foo");

        expect(index.reg.size).to.equal(3);
        expect(index.search("foo")).to.have.members([2, 3]);
        expect(index.search("bar")).to.have.members([1, 2]);
        expect(index.search("bar")).to.not.include(3);
        expect(index.search("foobar")).to.have.members([2]);
    });

    it("Should not have been updated to the index", function(){

        const index = new Index({ tokenize: "full" });
        index.add(1, "bar");
        index.add(2, "foobar");
        index.add(3, "foo");

        index.update("foo");
        // todo
        // index.update(1);
        index.update(null, "foobar");
        index.update(void 0, "foobar");
        // index.update(1, null);
        // index.update(2, false);
        index.update(4, "new");

        expect(index.reg.size).to.equal(4);
        expect(index.search("foo")).to.have.members([2, 3]);
        expect(index.search("bar")).to.have.members([1, 2]);
        expect(index.search("bar")).to.not.include(3);
        expect(index.search("foobar")).to.have.members([2]);
    });
});

describe("Remove (Sync)", function(){

    it("Should have been removed from the index", function(){

        const index = new Index({ tokenize: "full" });
        index.add(1, "bar");
        index.add(2, "foobar");
        index.add(3, "foo");

        index.remove(2);
        index.remove(1);
        index.remove(3);
        index.remove(4);

        expect(index.reg.size).to.equal(0);
        expect(index.search("foo")).to.have.lengthOf(0);
        expect(index.search("bar")).to.have.lengthOf(0);
        expect(index.search("foobar")).to.have.lengthOf(0);
    });
});

// if(env !== "light") describe("Operators", function(){
//
//     var data = [{
//         id: 2,
//         title: "Title 3",
//         body: "Body 3",
//         blacklist: "x1"
//     },{
//         id: 1,
//         title: "Title 2",
//         body: "Body 2",
//         blacklist: "x2"
//     },{
//         id: 0,
//         title: "Title 1",
//         body: "Body 1",
//         blacklist: "x3"
//     }];
//
//     var index = new FlexSearch({
//         tokenize: "forward",
//         doc: {
//             id: "id",
//             field: ["title", "body", "blacklist"]
//         }
//     });
//
//     it("Should have been properly applied logic", function(){
//
//         index.add(data);
//
//         expect(index.search([{
//             field: "title",
//             query: "title",
//             bool: "and"
//         },{
//             field: "body",
//             query: "body",
//             bool: "and"
//         },{
//             field: "blacklist",
//             query: "xxx",
//             bool: "not"
//         }])).to.have.members(data);
//
//         expect(index.search([{
//             field: "title",
//             query: "title",
//             bool: "and"
//         },{
//             field: "body",
//             query: "title",
//             bool: "and"
//         },{
//             field: "blacklist",
//             query: "xxx",
//             bool: "not"
//         }])).to.have.length(0);
//
//         expect(index.search([{
//             field: "title",
//             query: "title",
//             bool: "and"
//         },{
//             field: "body",
//             query: "title",
//             bool: "or"
//         },{
//             field: "blacklist",
//             query: "xxx",
//             bool: "not"
//         }])).to.have.members(data);
//
//         expect(index.search([{
//             field: "title",
//             query: "title",
//             bool: "and"
//         },{
//             field: "body",
//             query: "title",
//             bool: "or"
//         }])).to.have.members(data);
//
//         expect(index.search([{
//             field: "title",
//             query: "title",
//             bool: "and"
//         },{
//             field: "body",
//             query: "title",
//             bool: "or"
//         },{
//             field: "blacklist",
//             query: "x1",
//             bool: "not"
//         }])).to.have.members([data[1], data[2]]);
//
//         expect(index.search([{
//             field: "title",
//             query: "body",
//             bool: "or"
//         },{
//             field: "body",
//             query: "title",
//             bool: "or"
//         },{
//             field: "blacklist",
//             query: "x1",
//             bool: "not"
//         }])).to.have.length(0);
//
//         expect(index.search([{
//             field: "blacklist",
//             query: "x1",
//             bool: "not"
//         },{
//             field: "title",
//             query: "title",
//             bool: "or"
//         },{
//             field: "body",
//             query: "body",
//             bool: "or"
//         }])).to.have.members([data[1], data[2]]);
//
//         expect(index.search([{
//             field: "title",
//             query: "body",
//             bool: "or"
//         },{
//             field: "body",
//             query: "body",
//             bool: "and"
//         },{
//             field: "blacklist",
//             query: "x2",
//             bool: "not"
//         }])).to.have.members([data[0], data[2]]);
//
//         expect(index.search([{
//             field: "blacklist",
//             query: "x2",
//             bool: "not"
//         },{
//             field: "title",
//             query: "body",
//             bool: "or"
//         },{
//             field: "body",
//             query: "body",
//             bool: "and"
//         }])).to.have.members([data[0], data[2]]);
//
//         expect(index.search([{
//             field: "title",
//             query: "body",
//             bool: "or"
//         },{
//             field: "blacklist",
//             query: "x2",
//             bool: "not"
//         },{
//             field: "body",
//             query: "body",
//             bool: "and"
//         }])).to.have.members([data[0], data[2]]);
//
//         expect(index.search([{
//             field: "title",
//             query: "title",
//             bool: "and"
//         },{
//             field: "body",
//             query: "body",
//             bool: "and"
//         },{
//             field: "blacklist",
//             query: "x",
//             bool: "not"
//         }])).to.have.length(0);
//
//         expect(index.search([{
//             field: "title",
//             query: "title",
//             bool: "not"
//         },{
//             field: "body",
//             query: "body",
//             bool: "not"
//         },{
//             field: "blacklist",
//             query: "x",
//             bool: "not"
//         }])).to.have.length(0);
//     });
// });
//
// describe("Reserved Words", function(){
//
//     it("Should have been indexed properly", function(){
//
//         var index = new FlexSearch({
//             encode: function(str){ return [str]; },
//             tokenize: "strict",
//             threshold: 0,
//             depth: 3
//         });
//
//         var array = Object.getOwnPropertyNames({}.__proto__);
//         array = array.concat(Object.getOwnPropertyNames(index));
//
//         array.push("prototype");
//         array.push("constructor");
//         array.push("__proto__");
//
//         if(env !== "min"){
//
//             array.push("concat");
//             array.push("hasOwnProperty");
//             array.push("length");
//         }
//
//         for(var i = 0; i < array.length; i++){
//
//             index.add(array[i], array[i]);
//         }
//
//         for(var i = 0; i < array.length; i++){
//
//             // TODO: this word is reserved and can't be indexed
//             if(array[i] === "_ctx"){
//
//                 continue;
//             }
//
//             expect(index.search(array[i])).to.have.members([array[i]]);
//         }
//     });
// });
//
// // ------------------------------------------------------------------------
// // Export / Import
// // ------------------------------------------------------------------------
//
// if(env !== "light") describe("Export / Import", function(){
//
//     var data;
//
//     it("Should have been exported properly", function(){
//
//         var index = new FlexSearch("match");
//
//         index.add(0, "foo");
//         index.add(1, "bar");
//         index.add(2, "foobar");
//
//         data = index.export();
//
//         if(env === ""){
//
//             expect(data).to.equal(JSON.stringify(
//                 [
//                     index._map,
//                     index._ctx,
//                     Object.keys(index._ids)
//                 ]
//             ));
//         }
//     });
//
//     it("Should have been imported properly", function(){
//
//         var index = new FlexSearch("match");
//
//         index.import(data);
//
//         expect(index.length).to.equal(3);
//
//         expect(index.search("foo")).to.have.lengthOf(2);
//         expect(index.search("bar")).to.have.lengthOf(2);
//         expect(index.search("foobar")).to.have.lengthOf(1);
//         expect(index.search("foobar")[0]).to.equal(2);
//     });
//
//     it("Should have been exported properly (documents)", function(){
//
//         var index = new FlexSearch({
//
//             tokenize: "strict",
//             threshold: 1,
//             resolution: 3,
//             depth: 1,
//             doc: {
//                 id: "id",
//                 field: ["title", "content"]
//             }
//         });
//
//         var docs = [{
//             id: 1,
//             title: "Title 2",
//             content: "foobar"
//         },{
//             id: 0,
//             title: "Title 1",
//             content: "foo"
//         },{
//             id: 2,
//             title: "Title 3",
//             content: "bar"
//         }];
//
//         index.add(docs);
//         data = index.export();
//
//         if(env === ""){
//
//             expect(index.doc.index["title"].length).to.equal(3);
//             expect(data).to.equal(JSON.stringify([
//                 [
//                     index.doc.index["title"]._map,
//                     index.doc.index["title"]._ctx,
//                     Object.keys(index.doc.index["title"]._ids)
//                 ],
//                 [
//                     index.doc.index["content"]._map,
//                     index.doc.index["content"]._ctx,
//                     Object.keys(index.doc.index["content"]._ids)
//                 ],
//                 index._doc
//             ]));
//         }
//     });
//
//     it("Should have been imported properly (documents)", function(){
//
//         var index = new FlexSearch({
//
//             tokenize: "strict",
//             threshold: 1,
//             resolution: 3,
//             depth: 1,
//             doc: {
//                 id: "id",
//                 field: ["title", "content"]
//             }
//         });
//
//         index.import(data);
//
//         if(env === ""){
//
//             expect(index.doc.index["title"].length).to.equal(3);
//             expect(index.doc.index["content"].length).to.equal(3);
//         }
//
//         expect(index.search("foo")).to.have.lengthOf(1);
//         expect(index.search("bar")).to.have.lengthOf(1);
//         expect(index.search("foobar")).to.have.lengthOf(1);
//         expect(index.search("foobar")[0].id).to.equal(1);
//     });
// });
//
// // ------------------------------------------------------------------------
// // Presets
// // ------------------------------------------------------------------------
//
// describe("Presets", function(){
//
//     it("Should have been properly initialized", function(){
//
//         expect(FlexSearch("memory").length).to.equal(0);
//         expect(FlexSearch("speed").length).to.equal(0);
//         expect(FlexSearch("match").length).to.equal(0);
//         expect(FlexSearch("score").length).to.equal(0);
//         expect(FlexSearch("balance").length).to.equal(0);
//         expect(FlexSearch("fast").length).to.equal(0);
//     });
//
//     it("Should have been properly extended", function(){
//
//         var index = FlexSearch("fast");
//         index.add(0, "foobar");
//         expect(index.search("bar")).to.have.lengthOf(0);
//
//         index = FlexSearch({preset: "speed", id: "test", tokenize: "reverse"});
//         expect(index.id).to.equal("test");
//         index.add(0, "foobar");
//         expect(index.search("bar")).to.have.lengthOf(1);
//         expect(index.search("bar")).to.have.members([0])
//     });
// });
//
// // ------------------------------------------------------------------------
// // Feature Tests
// // ------------------------------------------------------------------------
//
// describe("Add Matchers", function(){
//
//     it("Should have been added properly", function(){
//
//         flexsearch_forward.init({
//
//             tokenize: "forward",
//             matcher: {
//
//                 "1": "a",
//                 "2": "b",
//                 "3": "c",
//                 "7": "e",
//                 "8": "f",
//                 "[456]": "d"
//             }
//
//         }).add(0, "12345678");
//
//         expect(flexsearch_forward.search("12345678")).to.include(0);
//         expect(flexsearch_forward.search("abcd")).to.include(0);
//         expect(flexsearch_forward.encode("12345678")).to.eql(["abcdddef"]);
//     });
// });
//
// // ------------------------------------------------------------------------
// // Caching
// // ------------------------------------------------------------------------
//
// if(env !== "light"){
//
//     describe("Caching", function(){
//
//         it("Should have been cached properly", function(){
//
//             flexsearch_cache.add(0, "foo")
//                             .add(1, "bar")
//                             .add(2, "foobar");
//             // fetch:
//             expect(flexsearch_cache.search("foo")).to.have.members([0, 2]);
//             expect(flexsearch_cache.search("bar")).to.have.members([1, 2]);
//             expect(flexsearch_cache.search("foobar")).to.include(2);
//
//             // cache:
//             expect(flexsearch_cache.search("foo")).to.have.members([0, 2]);
//             expect(flexsearch_cache.search("bar")).to.have.members([1, 2]);
//             expect(flexsearch_cache.search("foobar")).to.include(2);
//
//             // update:
//             flexsearch_cache.remove(2).update(1, "foo").add(3, "foobar");
//
//             // fetch:
//             expect(flexsearch_cache.search("foo")).to.have.members([0, 1, 3]);
//             expect(flexsearch_cache.search("bar")).to.include(3);
//             expect(flexsearch_cache.search("foobar")).to.include(3);
//
//             // cache:
//             expect(flexsearch_cache.search("foo")).to.have.members([0, 1, 3]);
//             expect(flexsearch_cache.search("bar")).to.include(3);
//             expect(flexsearch_cache.search("foobar")).to.include(3);
//         });
//     });
// }
//
// // ------------------------------------------------------------------------
// // Debug Information
// // ------------------------------------------------------------------------
//
// if(env !== "light" && env !== "min"){
//
//     describe("Debug", function(){
//
//         it("Should have been debug mode activated", function(){
//
//             var info = flexsearch_cache.info();
//
//             expect(info).to.have.keys([
//
//                 "id",
//                 //"chars",
//                 "cache",
//                 "items",
//                 "matcher",
//                 //"memory",
//                 //"sequences",
//                 "resolution",
//                 "worker",
//                 "contextual",
//                 "depth",
//                 "threshold"
//             ]);
//         });
//     });
// }
//
// // ------------------------------------------------------------------------
// // Destroy
// // ------------------------------------------------------------------------
//
// describe("Destroy", function(){
//
//     it("Should have been destroyed properly", function(){
//
//         var index = FlexSearch()
//         .add(0, "foo")
//         .add(1, "bar");
//
//         expect(index.search("foo")).to.include(0);
//         expect(index.search("bar")).to.include(1);
//
//         index.destroy();
//
//         expect(index.search("foo")).to.have.lengthOf(0);
//         expect(index.search("bar")).to.have.lengthOf(0);
//     });
//
//     if(env !== "light") it("Should have been destroyed properly (documents)", function(){
//
//         var data = [{id: 0, title: "foo"}, {id: 1, title: "bar"}];
//
//         var index = FlexSearch({doc: {id: "id", field: "title"}})
//         .add(data)
//         .add(data);
//
//         expect(index.search("foo")).to.have.members([data[0]]);
//         expect(index.search("bar")).to.have.members([data[1]]);
//
//         index.destroy();
//
//         expect(index.search("foo")).to.have.lengthOf(0);
//         expect(index.search("bar")).to.have.lengthOf(0);
//     });
// });
//
// // ------------------------------------------------------------------------
// // Chaining
// // ------------------------------------------------------------------------
//
// describe("Chaining", function(){
//
//     it("Should have been chained properly", function(){
//
//         var index = FlexSearch({tokenize: "forward", matcher: {"â": "a"}})
//         .add(0, "foo")
//         .add(1, "bar");
//
//         expect(index.search("foo")).to.include(0);
//         expect(index.search("bar")).to.include(1);
//         expect(index.encode("bâr")).to.eql(["bar"]);
//
//         index.remove(0).update(1, "foo").add(2, "foobâr");
//
//         expect(index.search("foo")).to.have.members([1, 2]);
//         expect(index.search("bar")).to.have.lengthOf(0);
//         expect(index.search("foobar")).to.include(2);
//
//         index.clear().add(0, "foo").add(1, "bar");
//
//         expect(index.search("foo")).to.include(0);
//         expect(index.search("bar")).to.include(1);
//         expect(index.search("foobar")).to.have.lengthOf(0);
//
//         flexsearch_cache.destroy().init().add(0, "foo").add(1, "bar");
//
//         expect(flexsearch_cache.search("foo")).to.include(0);
//         expect(flexsearch_cache.search("bar")).to.include(1);
//         expect(flexsearch_cache.search("foobar")).to.have.lengthOf(0);
//     });
// });
//}

/* Test Helpers */

function test_encoder(str){

    return "-[" + str.toUpperCase() + "]-";
}