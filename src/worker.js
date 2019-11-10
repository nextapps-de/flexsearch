import FlexSearch from "./flexsearch.js";
const worker_stack = {};
const inline_supported = (typeof Blob !== "undefined") && (typeof URL !== "undefined") && URL.createObjectURL;

/**
 * @param {!string} _name
 * @param {!number|string} _id
 * @param {!Function} _worker
 * @param {!Function} _callback
 * @param {number=} _core
 */

export default function init(_name, _id, _worker, _callback, _core){

    let name = _name;
    const worker_payload = (

        inline_supported ?

            // Load Inline Worker

            URL.createObjectURL(

                new Blob([

                    (RELEASE ?

                            ""
                        :
                            "var RELEASE = '" + RELEASE + "';" +
                            "var DEBUG = " + (DEBUG ? "true" : "false") + ";" +
                            "var PROFILER = " + (PROFILER ? "true" : "false") + ";" +
                            "var SUPPORT_PRESET = " + (SUPPORT_PRESET ? "true" : "false") + ";" +
                            "var SUPPORT_SUGGESTION = " + (SUPPORT_SUGGESTION ? "true" : "false") + ";" +
                            "var SUPPORT_ENCODER = " + (SUPPORT_ENCODER ? "true" : "false") + ";" +
                            "var SUPPORT_CACHE = " + (SUPPORT_CACHE ? "true" : "false") + ";" +
                            "var SUPPORT_ASYNC = " + (SUPPORT_ASYNC ? "true" : "false") + ";" +
                            "var SUPPORT_SERIALIZE = " + (SUPPORT_SERIALIZE ? "true" : "false") + ";" +
                            "var SUPPORT_INFO = " + (SUPPORT_INFO ? "true" : "false") + ";" +
                            "var SUPPORT_DOCUMENT = " + (SUPPORT_DOCUMENT ? "true" : "false") + ";" +
                            "var SUPPORT_WHERE = " + (SUPPORT_WHERE ? "true" : "false") + ";" +
                            "var SUPPORT_PAGINATION = " + (SUPPORT_PAGINATION ? "true" : "false") + ";" +
                            "var SUPPORT_OPERATOR = " + (SUPPORT_OPERATOR ? "true" : "false") + ";" +
                            "var SUPPORT_CALLBACK = " + (SUPPORT_CALLBACK ? "true" : "false") + ";" +
                            "var SUPPORT_WORKER = true;"

                    ) + "(" + _worker.toString() + ")()"
                ],{
                    "type": "text/javascript"
                })
            )
            :
            // Load Extern Worker (but also requires CORS)

            name + (RELEASE ? "." + RELEASE : "") + ".js"
    );

    name += "-" + _id;

    worker_stack[name] || (worker_stack[name] = []);
    worker_stack[name][_core] = new Worker(worker_payload);
    worker_stack[name][_core]["onmessage"] = _callback;

    if(DEBUG){

        console.log("Register Worker: " + name + "@" + _core);
    }

    return worker_stack[name][_core];
}

function worker_module(){

    let id;

    /** @type {FlexSearch} */
    let FlexSearchWorker;

    /** @lends {Worker} */
    self.onmessage = function(event){

        const data = event["data"];

        if(data){

            if(data["search"]){

                const results = FlexSearchWorker["search"](data["content"],

                    data["threshold"] ?

                        {
                            "limit": data["limit"],
                            "threshold": data["threshold"],
                            "where": data["where"]
                        }
                    :
                        data["limit"]
                );

                /** @lends {Worker} */
                self.postMessage({

                    "id": id,
                    "content": data["content"],
                    "limit": data["limit"],
                    "result": results
                });
            }
            else if(data["add"]){

                FlexSearchWorker["add"](data["id"], data["content"]);
            }
            else if(data["update"]){

                FlexSearchWorker["update"](data["id"], data["content"]);
            }
            else if(data["remove"]){

                FlexSearchWorker["remove"](data["id"]);
            }
            else if(data["clear"]){

                FlexSearchWorker["clear"]();
            }
            else if(SUPPORT_INFO && data["info"]){

                const info = FlexSearchWorker["info"]();

                info["worker"] = id;

                console.log(info);

                /** @lends {Worker} */
                //self.postMessage(info);
            }
            else if(data["register"]){

                id = data["id"];

                data["options"]["cache"] = false;
                data["options"]["async"] = false;
                data["options"]["worker"] = false;

                FlexSearchWorker = new Function(

                    data["register"].substring(

                        data["register"].indexOf("{") + 1,
                        data["register"].lastIndexOf("}")
                    )
                )();

                FlexSearchWorker = new FlexSearchWorker(data["options"]);
            }
        }
    };
}

export function addWorker(id, core, options, callback){

    const thread = init(

        // name:
        "flexsearch",

        // id:
        "id" + id,

        // worker:
        worker_module,

        // callback:
        function(event){

            const data = event["data"];

            if(data && data["result"]){

                callback(

                    data["id"],
                    data["content"],
                    data["result"],
                    data["limit"],
                    data["where"],
                    data["cursor"],
                    data["suggest"]
                );
            }
        },

        // cores:
        core
    );

    const fnStr = FlexSearch.toString();

    options["id"] = core;

    thread.postMessage({

        "register": fnStr,
        "options": options,
        "id": core
    });

    return thread;
}

if(SUPPORT_WORKER){

    FlexSearch.prototype.worker_handler = function(id, query, result, limit, where, cursor, suggest){

        if(this._task_completed !== this.worker){

            this._task_result = this._task_result.concat(result);
            this._task_completed++;

            // TODO: sort results, return array of relevance [0...9] and apply in main thread

            if(limit && (this._task_result.length >= limit)){

                this._task_completed = this.worker;
            }

            if(this._task_completed === this.worker){

                // this._task_result = intersect(this._task_result, where ? 0 : limit, cursor, suggest);

                if(this.cache){

                    this._cache.set(query, this._task_result);
                }

                if(this._current_callback){

                    this._current_callback(this._task_result);
                }

                //this._task_completed = 0;
                //this._task_result = [];
            }
        }

        return this;
    };
}