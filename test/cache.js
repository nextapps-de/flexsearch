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

if(!build_light) describe("Cache", function(){

    it("Should have been cached and sorted by popularity/latest", function(){

        const limit = 0;
        const index = new Index({
            tokenize: "reverse",
            cache: 2,
            limit
        });

        index.add(0, "foo")
             .add(1, "bar")
             .add(2, "foobar");

        expect(index.searchCache("foo")).to.eql([0, 2]);
        expect(index.searchCache("bar")).to.eql([1, 2]);
        expect(index.searchCache("foobar")).to.eql([2]);

        expect(index.cache.cache.size).to.equal(2);
        env || expect(index.cache.last).to.equal("foobar" + limit);
        expect(Array.from(index.cache.cache.values()).pop()).to.eql([2]);

        expect(index.searchCache("foobar")).to.eql([2]);
        expect(index.searchCache("bar")).to.eql([1, 2]);
        expect(index.searchCache("foo")).to.eql([0, 2]);

        expect(index.cache.cache.size).to.equal(2);
        env || expect(index.cache.last).to.equal("foo" + limit);
        expect(Array.from(index.cache.cache.values()).pop()).to.eql([0, 2]);

        expect(index.searchCache("bar")).to.eql([1, 2]);
        expect(Array.from(index.cache.cache.values()).pop()).to.eql([1, 2]);

    });

    it("Should have been synchronized properly", function(){

        const index = new Index({
            tokenize: "reverse",
            cache: 2
        });

        index.add(0, "foo")
             .add(1, "bar")
             .add(2, "foobar");

        expect(index.searchCache("foo")).to.eql([0, 2]);
        expect(index.cache.cache.size).to.equal(1);

        expect(index.searchCache("bar")).to.eql([1, 2]);
        expect(index.cache.cache.size).to.equal(2);

        index.remove(2).update(1, "foo").add(3, "foobar");
        // 2 was removed
        expect(index.cache.cache.size).to.equal(1);
        // 2 was removed, 3 was added, the cache takes the original reference
        // that's why this was automatically added here
        // it does not need to invalidate for this reason
        expect(Array.from(index.cache.cache.values()).pop()).to.eql([0, 1, 3]);

        expect(index.searchCache("foo")).to.eql([0, 1, 3]);
        expect(index.search("foo")).to.eql([0, 1, 3]);
        expect(Array.from(index.cache.cache.values()).pop()).to.eql([0, 1, 3]);

        expect(index.searchCache("bar")).to.eql([3]);
        expect(index.search("bar")).to.eql([3]);
        expect(Array.from(index.cache.cache.values()).pop()).to.eql([3]);
        expect(index.searchCache("foobar")).to.eql([3]);
        expect(index.search("foobar")).to.eql([3]);
        expect(Array.from(index.cache.cache.values()).pop()).to.eql([3]);

        expect(index.searchCache("foo")).to.eql([0, 1, 3]);
        expect(Array.from(index.cache.cache.values()).pop()).to.eql([0, 1, 3]);
    });
});
