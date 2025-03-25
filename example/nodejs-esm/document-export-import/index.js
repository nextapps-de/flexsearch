import { Document, Charset } from "flexsearch";
import { promises as fs } from "fs";

const dirname = import.meta.dirname;
// loading test data
const data = JSON.parse(await fs.readFile(dirname + "/data.json", "utf8"));

// you will need to keep the index configuration
// they will not export, also every change to the
// configuration requires a full re-index
const config = {
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
};

// create the document index
let document = new Document(config);

// add test data
for(let i = 0; i < data.length; i++){
    document.add(data[i]);
}

// perform a query
let result = document.search({
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

// output results
console.log(result);

// EXPORT
// -----------------------

await fs.mkdir("./export/").catch(e => {});
// call export
await document.export(async function(key, data){
    await fs.writeFile("./export/" + key, data, "utf8");
});

// IMPORT
// -----------------------

// create the same type of index you have used by .export()
// along with the same configuration
document = new Document(config);

// load them in parallel
const files = await fs.readdir("./export/");
await Promise.all(files.map(async file => {
    const data = await fs.readFile("./export/" + file, "utf8");
    // call import
    document.import(file, data);
}));

// perform query
result = document.search({
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

// output results
console.log("-------------------------------------");
console.log(result);
