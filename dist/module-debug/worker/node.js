const { parentPort } = require("worker_threads"),
      { Index } = require("../flexsearch.bundle.min.js");

let index;

parentPort.on("message", function (data) {

            /** @type Index */
            const args = data.args,
                  task = data.task,
                  id = data.id;


            switch (task) {

                        case "init":
                                    const options = data.options || {},
                                          encode = options.encode;


                                    options.cache = /* normalize: */ /* collapse: */ /* normalize: */ /* collapse: */ /* normalize: */ /* collapse: */ /* normalize: */ /* collapse: */ /* collapse: */!1;

                                    if (encode && 0 === encode.indexOf("function")) {

                                                options.encode = new Function("return " + encode)();
                                    }

                                    index = new Index(options);
                                    break;

                        default:

                                    const message = index[task].apply(index, args);
                                    parentPort.postMessage("search" === task ? { id: id, msg: message } : { id: id });
            }
});