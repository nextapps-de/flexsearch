
import Index from "../index.js";
import { IndexOptions } from "../type.js";

/** @type Index */
let index, options;
/** @type {IndexOptions} */

export default (async function (data) {

    data = data.data;

    const task = data.task,
          id = data.id;

    let args = data.args;

    switch (task) {

        case "init":

            options = data.options || {};
            let filepath = options.config;
            if (filepath) {

                options = options;
            }

            const factory = data.factory;

            if (factory) {

                Function("return " + factory)()(self);
                index = new self.FlexSearch.Index(options);

                delete self.FlexSearch;
            } else {

                index = new Index(options);
            }

            postMessage({ id: id });
            break;

        default:

            let message;

            if ("export" === task) {
                if (!options.export || "function" != typeof options.export) {
                    throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"export\".");
                }


                if (!args[1]) args = null;else {
                    args[0] = options.export;
                    args[2] = 0;
                    args[3] = 1;
                }
            }
            if ("import" === task) {
                if (!options.import || "function" != typeof options.import) {
                    throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"import\".");
                }

                if (args[0]) {
                    const data = await options.import.call(index, args[0]);
                    index.import(args[0], data);
                }
            } else {
                message = args && index[task].apply(index, args);
                if (message && message.then) {
                    message = await message;
                }
                if (message && message.await) {
                    message = await message.await;
                }
                if ("search" === task && message.result) {
                    message = message.result;
                }
            }

            postMessage("search" === task ? { id: id, msg: message } : { id: id });
    }
});