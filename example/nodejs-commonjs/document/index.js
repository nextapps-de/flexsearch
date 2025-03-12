const { Document, Charset } = require("flexsearch");

// loading test data
const data = require(__dirname + "/data.json");

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

// add test data
for(let i = 0; i < data.length; i++){
    document.add(data[i]);
}

// perform a query
const result = document.search({
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