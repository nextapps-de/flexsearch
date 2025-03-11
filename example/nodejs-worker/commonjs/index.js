const { Document } = require("flexsearch");
const fs = require("fs");

// loading test data
const data = JSON.parse(fs.readFileSync(__dirname + "/../data.json", "utf8"));

(async function(){

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
                field: "startYear"
            },{
                field: "genres"
            }]
        }
    });

    // add test data
    for(let i = 0; i < data.length; i++){
        await document.add(data[i]);
    }

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
