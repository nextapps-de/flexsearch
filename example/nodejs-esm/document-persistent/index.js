import { Document, Charset } from "flexsearch";
import { promises as fs } from "fs";
const dirname = import.meta.dirname;

import Sqlite from "flexsearch/db/sqlite";
// import Postgres from "flexsearch/db/postgres";
// import MongoDB from "flexsearch/db/mongodb";
// import Redis from "flexsearch/db/redis";
// import Clickhouse from "flexsearch/db/clickhouse";

(async function(){

    // loading test data
    const data = JSON.parse(await fs.readFile(dirname + "/data.json"));

    // create DB instance with namespace
    const db = new Sqlite("my-store");

    // create the document index
    const document = new Document({
        document: {
            id: "tconst",
            store: true,
            index: [{
                field: "primaryTitle",
                tokenize: "forward",
                encoder: Charset.LatinBalance
            },{
                field: "originalTitle",
                tokenize: "forward",
                encoder: Charset.LatinBalance
            }],
            tag: [{
                field: "startYear"
            },{
                field: "genres"
            }]
        }
    });

    await document.mount(db);
    // await document.destroy();
    // await document.mount(db);

    // add test data
    for(let i = 0; i < data.length; i++){
        document.add(data[i]);
    }

    // transfer changes in bulk
    await document.commit();

    // perform a query
    const result = await document.search({
        query: "karmen",
        tag: {
            "startYear": "1894",
            "genres": [
                "Documentary",
                "Short"
            ]
        },
        suggest: true,
        enrich: true,
        merge: true
    });

    console.log(result);

}());
