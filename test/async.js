global.self = global;
const env = process.argv[3] && process.argv[3] === "--exit" ? process.argv[4] : process.argv[3];
import { expect } from "chai";
console.log("--RELEASE-------------");
console.log(env ? "dist/" + env + ".js" : "src/bundle.js")
console.log("----------------------");
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;

if(!build_light) describe("Add (Async)", function(){

    it("Should have been added asynchronously to the index", async function(){

        const index = new Index(/*{ priority: 4 }*/);
        let duration = 0;
        let time = Date.now();

        setTimeout(function(){
            duration = Date.now() - time;
        });

        for(let i = 0; i < 1000; i++){
            await index.addAsync(i, "foo");
            if(duration) break;
        }

        expect(duration).to.equal(0);

        for(let i = 0; i < 999999999; i++){
            await index.addAsync(i, "foo");
            if(duration){
                break;
            }
        }

        expect(duration).to.closeTo(50, 5);
    });

    it("Should have been added asynchronously to the index (priority: 1)", async function(){

        const index = new Index({ priority: 1 });
        let duration = 0;
        let time = Date.now();

        setTimeout(function(){
            duration = Date.now() - time;
        });

        for(let i = 0; i < 1000; i++){
            await index.addAsync(i, "foo");
            if(duration) break;
        }

        expect(duration).to.closeTo(0, 4);

        for(let i = 0; i < 999999999; i++){
            await index.addAsync(i, "foo");
            if(duration){
                break;
            }
        }

        expect(duration).to.closeTo(4, 3);
    });

    it("Should have been added asynchronously to the index (priority: 9)", async function(){

        const index = new Index({ priority: 9 });
        let duration = 0;
        let time = Date.now();

        setTimeout(function(){
            duration = Date.now() - time;
        });

        for(let i = 0; i < 1000; i++){
            await index.addAsync(i, "foo");
            if(duration) break;
        }

        expect(duration).to.equal(0);

        for(let i = 0; i < 999999999; i++){
            await index.addAsync(i, "foo");
            if(duration){
                break;
            }
        }
        expect(duration).to.closeTo(250, 25);
    });
});
