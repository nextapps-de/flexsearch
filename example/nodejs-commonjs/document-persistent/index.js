const { Document, Charset } = require("flexsearch");
const Sqlite = require("flexsearch/db/sqlite");
// const Postgres = require("flexsearch/db/postgres");
// const MongoDB = require("flexsearch/db/mongodb");
// const Redis = require("flexsearch/db/redis");
// const Clickhouse = require("flexsearch/db/clickhouse");

// loading test data
const data = require(__dirname + "/data.json");

(async function(){

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
                encoder: Charset.LatinSimple
            },{
                field: "originalTitle",
                tokenize: "forward",
                encoder: Charset.LatinSimple
            }],
            tag: [{
                field: "startYear"
            },{
                field: "genres"
            }]
        }
    });

    // mount database to the index
    await document.mount(db);
    // await document.destroy();
    // await document.mount(db);

    // add test data
    for(let i = 0; i < data.length; i++){
        document.add(data[i]);
    }

    // transfer changes (bulk)
    await document.commit();

    // perform a query
    const result = await document.search({
        query: "carmen",
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
