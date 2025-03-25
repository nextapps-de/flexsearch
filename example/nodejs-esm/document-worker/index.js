import { Document } from "flexsearch";
import { promises as fs } from "fs";
const dirname = import.meta.dirname;

(async function(){

    // loading test data
    const data = JSON.parse(await fs.readFile(dirname + "/data.json"));

    // create the document and await for the instance response
    const document = await new Document({
        worker: true,
        document: {
            id: "tconst",
            store: true,
            index: [{
                field: "primaryTitle",
                tokenize: "forward",
                encoder: "LatinBalance"
            },{
                field: "originalTitle",
                tokenize: "forward",
                encoder: "LatinBalance"
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
