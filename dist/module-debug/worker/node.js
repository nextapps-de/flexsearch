const { parentPort } = require("worker_threads"),
      { join } = require("path"),
      { Index } = require("../flexsearch.bundle.min.js");
// Test Path
//const { Index } = require("../../dist/flexsearch.bundle.min.js");


let index;

parentPort.on("message", async function (data) {

    /** @type Index */
    const args = data.args,
          task = data.task,
          id = data.id;


    switch (task) {

        case "init":
            let options = data.options || {},
                filepath = options.config;
            // load extern field configuration

            if (filepath) {
                options = Object.assign({}, options, require(filepath));
                delete options.worker;
            }

            index = new Index(options);
            //index.db && await index.db;
            parentPort.postMessage({ id: id });

            break;

        default:

            const message = index[task].apply(index, args);
            parentPort.postMessage("search" === task ? { id: id, msg: message } : { id: id });
    }
});