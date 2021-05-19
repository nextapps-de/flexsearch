import { promise as Promise } from "./polyfill.js";
import { is_function, is_object } from "./common.js";

let counter = 0;

/**
 * @param {number|string|Object} id
 * @param {Object=} options
 * @constructor
 */

function WorkerAdapter(id, options){

    if(is_object(id)){

        options = /** @type {Object} */ (id);
        id = 0;
    }

    if(is_function(options["encode"])){

        options["encode"] = options["encode"].toString();
    }

    const self = this;

    this.id = id || counter++;
    this.resolver = null;
    this.worker = new Worker("worker.js", { type: "module" });
    this.worker.onmessage = function(e){ self.resolver(e["data"]/*["results"]*/) };
    this.worker.postMessage({ task: "create", /*id: this.id,*/ options: options });
}

export default WorkerAdapter;

register("add");
register("append");
register("search");
register("update");
register("remove");

function register(key){

    WorkerAdapter.prototype[key] =
    WorkerAdapter.prototype[key + "Async"] = function(){

        const self = this;
        const args = [].slice.call(arguments);
        const arg = args[args.length - 1];
        let callback;

        if(is_function(arg)){

            callback = arg;
            args.splice(args.length - 1, 1);
        }

        const promise = new Promise(function(resolve){

            self.worker.postMessage({ task: key, /*id: this.id,*/ args: args });

            if(key === "search"){

                self.resolver = resolve;
            }
            else{

                resolve();
            }
        });

        if(callback){

            promise.then(callback);
            return this;
        }
        else{

            return promise;
        }
    };
}
