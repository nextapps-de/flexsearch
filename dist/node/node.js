const { parentPort } = require("worker_threads");
const { join } = require("path");
// Test Path
//const { Index } = require("../../dist/flexsearch.bundle.min.js");
const { Index } = require("../flexsearch.bundle.min.js");

let index;

parentPort.on("message", function(data){

    /** @type Index */
    const args = data["args"];
    const task = data["task"];
    const id = data["id"];

    switch(task){

        case "init":

            let options = data["options"] || {};

            // load extern field configuration
            let filepath = options["config"];
            if(filepath && filepath[0] !== "/" && filepath[0] !== "\\"){
                // current working directory
                const dir = process.cwd();
                filepath = join(dir, filepath);
            }
            if(filepath){
                options = require(filepath);
            }

            // deprecated:
            // const encode = options["encode"];
            // if(encode && (encode.indexOf("function") === 0)){
            //     options["encode"] = new Function("return " + encode)();
            // }

            index = new Index(options);
            break;

        default:

            const message = index[task].apply(index, args);
            parentPort.postMessage(task === "search" ? { "id": id, "msg": message } : { "id": id });
    }
});
