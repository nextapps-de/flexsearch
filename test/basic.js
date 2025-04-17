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
        expect(index).to.respondTo("cleanup");
        expect(index).to.respondTo("contain");

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

        const encoder = new Encoder(Charset.Default);
        expect(index.tokenize).to.equal("strict");
        expect(typeof index.encoder.normalize).to.equal(typeof encoder.normalize);
        index.encoder.normalize = encoder.normalize;
        expect(index.encoder).to.eql(encoder);
        expect(index.encoder.minlength).to.equal(1);
        expect(index.encoder.maxlength).to.equal(1024);
        expect(index.encoder.rtl).to.equal(false);
        expect(index.encoder.numeric).to.equal(true);
        expect(index.encoder.dedupe).to.equal(true);
    });
});

describe("Add", function(){

    it("Should have been properly added to the index", function(){

        const index = new Index();

        index.add(0, "foo");
        index.add(2, "bar");
        index.add(1, "FooBar");
        index.add(3, "Some 'short' content.");

        expect(Array.from(index.reg.keys())).to.have.members([0, 1, 2, 3]);
        expect(Array.from(index.map.keys())).to.have.members(["fo", "bar", "fobar", "some", "short", "content"]);
        expect(index.ctx.size).to.equal(0);
        expect(index.reg.size).to.equal(4);
    });

    it("Should have been numeric content properly added to the index (Triplets)", function(){

        let index = new Index();

        index.add(0, "TEST-123456789123456789");
        index.add(1, "T10030");
        index.add(2, "T10030T10030");
        index.add(3, "1443-AB14345-1778");

        expect(Array.from(index.reg.keys())).to.have.members([0, 1, 2, 3]);
        expect(Array.from(index.map.keys())).to.have.members([
            "test", "123", "456", "789",
            "t", "10", "30",
            // id 2 was already completely added, split: "t", "10", "30", "t", "10", "30"
            "14", "3", "ab", "143", "45", "17", "8"
        ]);
        expect(index.ctx.size).to.equal(0);
        expect(index.reg.size).to.equal(4);

        // disabled deduplication
        index.clear();
        index.encoder.dedupe = false;

        index.add(0, "TEST-123456789123456789");
        index.add(1, "T10030");
        index.add(2, "T10030T10030");
        index.add(3, "1443-AB14345-1778");

        expect(Array.from(index.reg.keys())).to.have.members([0, 1, 2, 3]);
        expect(Array.from(index.map.keys())).to.have.members([
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

        result = index.search("cute");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = index.search("cute dogs cats");
        expect(result.length).to.equal(1);
        expect(result).to.eql([1]);

        result = index.search("cute dogs cats", { suggest: true });
        expect(result).to.eql([1, 6, 5, 4, 3, 2, 0]);

        result = index.search("undefined cute undefined dogs undefined cats undefined", { suggest: true });
        expect(result).to.eql([1, 6, 5, 4, 3, 2, 0]);

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

        result = index.search("cute");
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

        result = index.search("cute");
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

        result = index.search("cute");
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

        result = index.search("cute");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);
    });
});

describe("Update (Sync)", function(){

    it("Should have been updated to the index", function(){

        const index = new Index({
            fastupdate: true,
            tokenize: "reverse"
        });
        index.add(1, "foo");
        index.add(2, "bar");
        index.add(3, "foobar");

        index.update(1, "bar");
        index.update(2, "foobar");
        index.update(3, "foo");

        expect(index.reg.size).to.equal(3);
        expect(index.search("foo")).to.eql([2, 3]);
        expect(index.search("bar")).to.eql([1, 2]);
        expect(index.search("bar")).to.not.include(3);
        expect(index.search("foobar")).to.eql([2]);

        index.update(1, "bar");
        index.update(2, "foobar");
        index.update(3, "foo");
        index.update(4, "new");

        index.update(5, "foo");
        index.update(5);
        index.update(6, "foo");
        index.update(6, null);
        index.update(7, "foo");
        index.update(7, false);

        expect(index.reg.size).to.equal(4);
        expect(index.search("foo")).to.eql([2, 3]);
        expect(index.search("bar")).to.eql([1, 2]);
        expect(index.search("bar")).to.not.include(3);
        expect(index.search("foobar")).to.eql([2]);
        expect(index.search("new")).to.eql([4]);
    });

    it("Should not have been updated to the index", function(){

        const index = new Index({ tokenize: "bidirectional" });
        index.add(1, "bar");
        index.add(2, "foobar");
        index.add(3, "foo");

        index.update("foo");
        index.update(null, "foobar");
        index.update(void 0, "foobar");

        expect(index.reg.size).to.equal(3);
        expect(index.search("foo")).to.eql([2, 3]);
        expect(index.search("bar")).to.eql([1, 2]);
        expect(index.search("bar")).to.not.include(3);
        expect(index.search("foobar")).to.eql([2]);
    });
});

describe("Remove (Sync)", function(){

    it("Should have been removed from the index", function(){

        const index = new Index({
            fastupdate: true,
            tokenize: "reverse"
        });
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

describe("Reserved Words", function(){

    it("Should have reserved properties taken into account", function(){

        const index = new Index({
            encode: function(str){ return [str]; },
            tokenize: "strict"
        });

        let array = Object.getOwnPropertyNames({}.__proto__);
        array = array.concat(Object.getOwnPropertyNames(index));
        array = array.concat(Object.getOwnPropertyNames(index.map));
        array.includes("prototype") || array.push("prototype");
        array.includes("constructor") || array.push("constructor");
        array.includes("__proto__") || array.push("__proto__");
        array.includes("concat") || array.push("concat");
        array.includes("hasOwnProperty") || array.push("hasOwnProperty");
        array.includes("length") || array.push("length");
        array.includes("ctx") || array.push("ctx");

        for(let i = 0; i < array.length; i++){
            index.add(i, array[i]);
        }

        for(let i = 0; i < array.length; i++){
            expect(index.search(array[i])).to.eql([i]);
        }
    });
});

describe("Presets", function(){

    it("Should have been properly initialized", function(){

        expect(Index("memory").resolution).to.equal(1);
        expect(Index("performance").resolution).to.equal(3);
        expect(Index("match").resolution).to.equal(9);
        expect(Index("score").resolution).to.equal(9);
        expect(Index("default").resolution).to.equal(9);
    });

    it("Should have been properly extended", function(){

        let index = Index({ preset: "performance" });
        index.add(0, "foobar");
        expect(index.search("bar")).to.have.lengthOf(0);

        index = Index({
            preset: "performance",
            tokenize: "reverse"
        });

        index.add(0, "foobar");
        expect(index.search("bar")).to.eql([0]);

        index = Index("match");
        index.add(0, "foobar");
        expect(index.search("foo")).to.eql([0]);
    });
});
