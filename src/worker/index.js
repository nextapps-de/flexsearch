import { promise as Promise } from "../polyfill.js";
import { is_function, is_object } from "../common.js";
import handler from "./handler.js";

let counter = 0;

/**
 * @param {number|string|Object} id
 * @param {Object=} options
 * @constructor
 */

function WorkerIndex(id, options){

    let opt;

    if(is_object(id)){

        options = /** @type {Object} */ (id);
        id = 0;
    }
    else{

        if(options){

            if(is_function(opt = options["encode"])){

                options["encode"] = opt.toString();
            }
        }
        else{

            options = {};
        }
    }

    // the factory is the outer wrapper from the build
    // we use "self" as a trap for node.js

    let factory = (self||window)["_factory"];

    if(factory){

        factory = factory.toString();
    }

    const _self = this;

    this.id = id || counter++;
    this.resolver = null;
    this.worker = create(factory);

    if(!this.worker){

        return;
    }

    this.worker.onmessage = function(e){ _self.resolver(e["data"]/*["results"]*/) };
    this.worker.postMessage({ "task": "init", "factory": factory, /*id: this.id,*/ "options": options });
}

export default WorkerIndex;

register("add");
register("append");
register("search");
register("update");
register("remove");

function register(key){

    WorkerIndex.prototype[key] =
    WorkerIndex.prototype[key + "Async"] = function(){

        const self = this;
        const args = [].slice.call(arguments);
        const arg = args[args.length - 1];
        let callback;

        if(is_function(arg)){

            callback = arg;
            args.splice(args.length - 1, 1);
        }

        const promise = new Promise(function(resolve){

            self.worker.postMessage({ "task": key, /*id: this.id,*/ "args": args });

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

function create(factory){

    let worker

    try{

        worker = factory ?

            new Worker(URL.createObjectURL(

                new Blob([

                    "onmessage=" + handler.toString()

                ], { "type": "text/javascript" })
            ))
        :
            new Worker("worker.js", { type: "module" });
    }
    catch(e){}

    return worker;
}