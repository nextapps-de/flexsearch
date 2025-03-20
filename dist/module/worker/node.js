const { parentPort } = require("worker_threads"),
      { Index } = require("flexsearch");
//const { join } = require("path");
// Test Path
//const { Index } = require("../../dist/flexsearch.bundle.min.js");


/** @type Index */
let index, options;
/** @type {IndexOptions} */

parentPort.on("message", async function (data) {
    const task = data.task,
          id = data.id;

    let args = data.args;

    switch (task) {

        case "init":

            options = data.options || {};
            // load extern field configuration
            let filepath = options.config;
            if (filepath) {
                options = Object.assign({}, options, require(filepath));
                delete options.worker;
            }

            index = new Index(options);
            //index.db && await index.db;

            parentPort.postMessage({ id: id });
            break;

        default:

            let message;

            if ("export" === task) {
                if (!options.export || "function" != typeof options.export) {
                    throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"export\".");
                }
                args = [options.export];
            }
            if ("import" === task) {
                if (!options.import || "function" != typeof options.import) {
                    throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"import\".");
                }
                await options.import.call(index, index);
            } else {
                message = index[task].apply(index, args);
                if (message.then) {
                    message = await message;
                }
            }

            parentPort.postMessage("search" === task ? { id: id, msg: message } : { id: id });
    }
});