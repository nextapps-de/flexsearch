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

if(!build_light && !build_compact) describe("Keystore", function(){

    it("Should have applied the keystore properly", function(){

        const index = new Index({
            fastupdate: true,
            keystore: build_es5 ? 32 : 64,
            context: true
        });

        for(let i = 0; i < 100; i++){
            index.add(i, "foo bar");
        }

        expect(index.map.size).to.equal(2);
        expect(index.map.get("fo")[0].length).to.equal(100);
        expect(index.ctx.get("fo").get("bar")[0].length).to.equal(100);
        expect(index.reg.size).to.equal(100);

        for(let i = 0; i < 100; i++){
            index.add(i, "foobar");
        }

        expect(index.map.size).to.equal(3);
        index.cleanup();
        expect(index.map.size).to.equal(1);

        expect(index.map.get("fo")).to.be.undefined;
        expect(index.map.get("fobar")[0].length).to.equal(100);
        expect(index.ctx.get("fo")).to.be.undefined;
        expect(index.reg.size).to.equal(100);

        for(let i = 0; i < 50; i++){
            index.remove(i);
        }

        expect(index.map.size).to.equal(1);
        expect(index.map.get("fobar")[0].length).to.equal(50);
        expect(index.reg.size).to.equal(50);

        index.clear();

        expect(index.map.size).to.equal(0);
        expect(index.ctx.size).to.equal(0);
        expect(index.reg.size).to.equal(0);
    });

    // todo increase memory
    it("Should have extended the default limit", function(){

        const index = new Index({
            fastupdate: true,
            //encode: str => str,
            keystore: 16,
            context: true
        });

        // this.slow(30000);
        // this.timeout(60000);

        //const encoded = ["foo", "bar"];
        index.add(0, "foo bar");
        index.add(1, "foo bar");
        index.add(2, "foo bar");

        let foo = index.map.get("fo");
        let bar = index.ctx.get("fo").get("bar");
        foo[0].length = 2**31 - 10;
        bar[0].length = 2**31 - 10;

        for(let i = foo[0].length; i <= 2**31 + 9; i++){
            index.add(i, "foo bar");
        }

        expect(index.map.get("fo")[0].length).to.equal(2**31 + 10);
        expect(index.ctx.get("fo").get("bar")[0].length).to.equal(2**31 + 10);
        //expect(index.reg.size).to.equal(2**31 + 1);
        expect(index.search("fo bar", 3)).to.eql([0, 1, 2]);

        index.clear();

        expect(index.map.size).to.equal(0);
        expect(index.ctx.size).to.equal(0);
        expect(index.reg.size).to.equal(0);
    });
});
