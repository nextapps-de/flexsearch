const { parentPort } = require("worker_threads");
const { join } = require("path");
// Test Path
//const { Index } = require("../../dist/flexsearch.bundle.min.js");
const { Index } = require("../flexsearch.bundle.min.js");

let index;

parentPort.on("message", async function(data){

    /** @type Index */
    const args = data["args"];
    const task = data["task"];
    const id = data["id"];

    switch(task){

        case "init":

            let options = data["options"] || {};
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

            const message = index[task].apply(index, args);
            parentPort.postMessage(
                task === "search"
                    ? { "id": id, "msg": message }
                    : { "id": id }
            );
    }
});
