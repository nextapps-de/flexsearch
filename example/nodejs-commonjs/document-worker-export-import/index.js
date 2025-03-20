const { Document } = require("flexsearch");
const { promises: fs } = require("fs");

// loading test data
const data = require(__dirname + "/data.json");

// you will need to keep the index configuration
// they will not export, also every change to the
// configuration requires a full re-index
const config = {
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
};

(async function(){

    // create the document and await (!) for the instance response
    let document = await new Document(config);

    // add test data
    for(let i = 0; i < data.length; i++){
        await document.add(data[i]);
    }

    // perform a query
    let result = await document.search({
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

    // -----------------------
    // EXPORT
    // -----------------------

    // create folders for the export
    // it should be empty before export
    await fs.mkdir("./export/").catch(e => {});

    await document.export(async function(key, data){
        await fs.writeFile("./export/" + key, data, "utf8");
    });

    // -----------------------
    // IMPORT
    // -----------------------

    // create the same type of index you have used by .export()
    // along with the same configuration
    document = await new Document(config);

    // load them in parallel
    const files = await fs.readdir("./export/");
    await Promise.all(files.map(async file => {
        const data = await fs.readFile("./export/" + file, "utf8");
        await document.import(file, data);
    }));

    // perform a query
    result = await document.search({
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

    console.log("-------------------------------------");
    console.log(result);

}());
