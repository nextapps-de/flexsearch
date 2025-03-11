import { Document } from "flexsearch/esm";
import fs from "fs";

const dirname = import.meta.dirname;
// loading test data
const data = JSON.parse(fs.readFileSync(dirname + "/../data.json", "utf8"));

(async function(){

    // create the document
    const document = new Document({
        worker: true,
        document: {
            id: "tconst",
            store: true,
            index: [{
                field: "primaryTitle",
                config: dirname + "/config.primaryTitle.js"
            },{
                field: "originalTitle",
                config: dirname + "/config.originalTitle.js"
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
