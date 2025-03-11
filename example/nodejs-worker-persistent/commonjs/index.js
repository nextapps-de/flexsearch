const { Document } = require("flexsearch");
const Postgres = require("flexsearch/db/postgres");
const fs = require("fs");

// loading test data
const data = JSON.parse(fs.readFileSync(__dirname + "/../data.json", "utf8"));

(async function(){

    // create DB instance with namespace
    const db = new Postgres("my-store");

    // create the document index
    const document = new Document({
        worker: true,
        document: {
            id: "tconst",
            store: true,
            index: [{
                field: "primaryTitle",
                config: __dirname + "/config.primaryTitle.js"
            },{
                field: "originalTitle",
                config: __dirname + "/config.originalTitle.js"
            }],
            tag: [{
                field: "startYear",
                config: __dirname + "/config.startYear.js"
            },{
                field: "genres",
                config: __dirname + "/config.genres.js"
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
