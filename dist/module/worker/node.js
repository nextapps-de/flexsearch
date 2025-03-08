const { parentPort } = require("worker_threads"),
      { join } = require("path"),
      { Index } = require("../flexsearch.bundle.min.js");
// Test Path
//const { Index } = require("../../dist/flexsearch.bundle.min.js");


let index;

parentPort.on("message", function (data) {

            /** @type Index */
            const args = data.args,
                  task = data.task,
                  id = data.id;


            switch (task) {

                        case "init":
                                    let options = data.options || {},
                                        filepath = options.config;

                                    // load extern field configuration

                                    if (filepath && "/" !== filepath[0] && "\\" !== filepath[0]) {
                                                // current working directory
                                                const dir = process.cwd();
                                                filepath = join(dir, filepath);
                                    }
                                    if (filepath) {
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
                                    parentPort.postMessage("search" === task ? { id: id, msg: message } : { id: id });
            }
});