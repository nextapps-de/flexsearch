import { Document, Charset, Resolver } from "flexsearch";

// some test data
const data = [{
    "tconst": "tt0000001",
    "titleType": "short",
    "primaryTitle": "Carmencita",
    "originalTitle": "Carmencita",
    "isAdult": 0,
    "startYear": "1894",
    "endYear": "",
    "runtimeMinutes": "1",
    "genres": [
        "Documentary",
        "Short"
    ]
},{
    "tconst": "tt0000002",
    "titleType": "short",
    "primaryTitle": "Le clown et ses chiens",
    "originalTitle": "Le clown et ses chiens",
    "isAdult": 0,
    "startYear": "1892",
    "endYear": "",
    "runtimeMinutes": "5",
    "genres": [
        "Animation",
        "Short"
    ]
}];

// create the document index
const index = new Document({
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
    index.add(data[i]);
}

// perform a complex query + enrich results
let result = new Resolver({
    index: index,
    query: "karmen",
    pluck: "primaryTitle"
}).or({
    query: "clown",
    pluck: "primaryTitle"
}).and({
    query: "not found",
    field: "originalTitle",
    suggest: true
}).not({
    query: "clown",
    pluck: "primaryTitle"
}).resolve({
    enrich: true
});

// display results
console.log(result);
