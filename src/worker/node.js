const { parentPort } = require("worker_threads");
//const { join } = require("path");
// Test Path
//const { Index } = require("../../dist/flexsearch.bundle.min.js");
const { Index } = require("flexsearch");

/** @type Index */
let index;
/** @type {IndexOptions} */
let options;

parentPort.on("message", async function(data){

    const task = data["task"];
    const id = data["id"];
    let args = data["args"];

    switch(task){

        case "init":

            options = data["options"] || {};
            // load extern field configuration
            let filepath = options["config"];
            if(filepath){
                options = Object.assign({}, options, require(filepath));
                delete options.worker;
            }

            index = new Index(options);
            //index.db && await index.db;
            parentPort.postMessage({ "id": id });

            break;

        default:

            let message;

            if(task === "export"){
                args = [options.export];
            }
            if(task === "import"){
                await options.import.call(index, index);
                //args = [options.import];
            }
            else{
                message = index[task].apply(index, args);
            }

            parentPort.postMessage(
                task === "search"
                    ? { "id": id, "msg": message }
                    : { "id": id }
            );
    }
});
