import { parentPort } from "worker_threads";
import { join } from "path";
// Test Path
//import Index from "../../src/index.js";
//import { Index } from "../../dist/flexsearch.bundle.module.min.js";
import { Index } from "../flexsearch.bundle.module.min.js";

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
                filepath = join("file://", filepath);
                options = Object.assign({}, options, (await import(filepath))["default"]);
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
