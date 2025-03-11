import { parentPort } from "worker_threads";
import { join } from "path";
// Test Path
import { Index } from "../../dist/flexsearch.bundle.module.min.js";
//import { Index } from "../flexsearch.bundle.module.min.js";

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
            // if(filepath && filepath[0] !== "/" && filepath[0] !== "\\"){
            //     // current working directory
            //     const dir = process.cwd();
            //     filepath = "file:///" + join(dir, filepath);
            // }
            if(filepath){
                filepath = "file:///" + filepath;
                options = await import(filepath);
            }

            index = new Index(options);
            break;

        default:

            const message = index[task].apply(index, args);
            parentPort.postMessage(task === "search" ? { "id": id, "msg": message } : { "id": id });
    }
});
