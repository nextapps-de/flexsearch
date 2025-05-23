global.self = global;
const env = process.argv[process.argv.length - 1] === "--exit" ? "" : process.argv[process.argv.length - 1];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver } = FlexSearch;
const build_light = env && env.includes("light");
const build_compact = env && env.includes("compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;

import Postgres_src from "../src/db/postgres/index.js";
import Postgres_dist from "../dist/module/db/postgres/index.js";
import tests from "./persistent.js";

if(!build_light && !build_compact){
    describe("Persistent: Postgres", function(){
        tests(env ? Postgres_dist : Postgres_src, "Postgres");
    });
}
