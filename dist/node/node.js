// COMPILER BLOCK -->
import { DEBUG } from "../config.js";
// <-- COMPILER BLOCK
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
                if(DEBUG){
                    if(!options.export || typeof options.export !== "function"){
                        throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"export\".");
                    }
                }
                args = [options.export];
            }
            if(task === "import"){
                if(DEBUG){
                    if(!options.import || typeof options.import !== "function"){
                        throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"import\".");
                    }
                }
                await options.import.call(index, index);
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
