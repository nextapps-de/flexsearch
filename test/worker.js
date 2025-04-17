global.self = global;
const env = process.argv[3] && process.argv[3] === "--exit" ? process.argv[4] : process.argv[3];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker: WorkerIndex, Charset: _Charset, Encoder, Resolver } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;

if(!build_light && !build_compact) describe("Worker", function(){

    let index;

    afterEach(function() {
        index && index.worker.terminate();
    });

    it("Should have the proper basic functionality", async function(){

        index = await new WorkerIndex({
            encoder: "LatinAdvanced",
            tokenize: "forward"
        });

        const data = [
            'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute',
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ];

        for(let i = 0; i < data.length; i++){
            await index.addAsync(i, data[i]);
        }

        expect(index.reg).to.be.undefined;
        expect(index.map).to.be.undefined;

        let result = await index.search("cat cute");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = await index.search("cute cat");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = await index.search("cute");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = await index.search("cudi tok-kat");
        expect(result).to.eql([1]);
    });

    it("Should update the index contents properly", async function(){

        index = await new WorkerIndex({ tokenize: "full" });

        await index.add(1, "foo");
        await index.add(2, "bar");
        await index.add(3, "foobar");

        await index.update(1, "bar");
        await index.update(2, "foobar");
        await index.update(3, "foo");

        expect(await index.search("foo")).to.have.members([2, 3]);
        expect(await index.search("bar")).to.have.members([1, 2]);
        expect(await index.search("bar")).to.not.include(3);
        expect(await index.search("foobar")).to.have.members([2]);
        expect(await index.search("oba")).to.have.members([2]);

        await index.update(1, "bar");
        await index.update(2, "foobar");
        await index.update(3, "foo");

        expect(await index.search("foo")).to.have.members([2, 3]);
        expect(await index.search("bar")).to.have.members([1, 2]);
        expect(await index.search("bar")).to.not.include(3);
        expect(await index.search("foobar")).to.have.members([2]);
        expect(await index.search("oba")).to.have.members([2]);
    });

    it("Should have been removed from the index", async function(){

        index = await new WorkerIndex({ tokenize: "full" });
        await index.add(1, "bar");
        await index.add(2, "foobar");
        await index.add(3, "foo");

        await index.remove(2);
        await index.remove(1);
        await index.remove(3);
        await index.remove(4);

        expect(await index.search("foo")).to.have.lengthOf(0);
        expect(await index.search("bar")).to.have.lengthOf(0);
        expect(await index.search("foobar")).to.have.lengthOf(0);
    });
});


