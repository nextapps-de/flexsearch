import Index from "../index.js";

export default function (data) {

            data = data.data;

            /** @type Index */
            const index = self._index,
                  args = data.args,
                  task = data.task;


            switch (task) {

                        case "init":
                                    const options = data.options || {},
                                          factory = data.factory,
                                          encode = options.encode;


                                    options.cache = /* normalize: */ /* collapse: */ /* normalize: */

                                    /* collapse: */ /* normalize: */ /* collapse: */ /* normalize: */ /* collapse: */ /* collapse: */!1;

                                    if (encode && 0 === encode.indexOf("function")) {
                                                options.encode = Function("return " + encode)();
                                    }

                                    if (factory) {

                                                // export the FlexSearch global payload to "self"
                                                Function("return " + factory)()(self);

                                                /** @type Index */
                                                self._index = new self.FlexSearch.Index(options);

                                                // destroy the exported payload
                                                delete self.FlexSearch;
                                    } else {

                                                self._index = new Index(options);
                                    }

                                    break;

                        default:
                                    const id = data.id,
                                          message = index[task].apply(index, args);

                                    postMessage("search" === task ? { id: id, msg: message } : { id: id });
            }
}