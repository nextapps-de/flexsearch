const { parentPort } = require("worker_threads");
const { Index } = require("../flexsearch.bundle.js");

let index;

parentPort.on("message", function(data){

    /** @type Index */
    const args = data["args"];
    const task = data["task"];

    switch(task){

        case "init":

            const options = data["options"] || {};
            const encode = options["encode"];

            options["cache"] = false;

            if(encode && (encode.indexOf("function") === 0)){

                options["encode"] = new Function("return " + encode)();
            }

            index = new Index(options);
            break;

        case "search":

            const message = index.search.apply(index, args);
            parentPort.postMessage(message);
            break;

        default:

            index[task].apply(index, args);
    }
});
