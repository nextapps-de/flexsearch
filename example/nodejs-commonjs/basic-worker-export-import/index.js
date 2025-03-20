const { Worker: WorkerIndex } = require("flexsearch");

// you will need to keep the index configuration
// they will not export, also every change to the
// configuration requires a full re-index
const config = {
    tokenize: "forward",
    config: __dirname + "/config.js"
};

(async function(){

    // create a simple index which can store id-content-pairs
    // and await (!) for the worker response
    let index = await new WorkerIndex(config);

    // some test data
    const data = [
        'cats abcd efgh ijkl mnop qrst uvwx cute',
        'cats abcd efgh ijkl mnop qrst cute',
        'cats abcd efgh ijkl mnop cute',
        'cats abcd efgh ijkl cute',
        'cats abcd efgh cute',
        'cats abcd cute',
        'cats cute'
    ];

    // add test data
    for(let i = 0; i < data.length; i++){
        await index.addAsync(i, data[i]);
    }

    // perform query
    let result = await index.search({
        query: "cute cat",
    });

    // display results
    result.forEach(i => {
        console.log(data[i]);
    });

    // -----------------------
    // EXPORT
    // -----------------------

    await index.export();

    // -----------------------
    // IMPORT
    // -----------------------

    // create the same type of index you have used by .export()
    // along with the same configuration
    index = await new WorkerIndex(config);

    await index.import();

    // perform query
    result = await index.search({
        query: "cute cat",
    });

    // display results
    console.log("-------------------------------------");
    result.forEach(i => {
        console.log(data[i]);
    });

}());
