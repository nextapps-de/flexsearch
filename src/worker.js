// COMPILER BLOCK -->
import {
    DEBUG,
    SUPPORT_ASYNC,
    SUPPORT_CACHE,
    SUPPORT_WORKER
} from "./config.js";
// <-- COMPILER BLOCK
import { IndexOptions } from "./type.js";
import { create_object } from "./common.js";
import { searchCache } from "./cache.js";
import handler from "./worker/handler.js";
import apply_async from "./async.js";
import Encoder from "./encoder.js";

let pid = 0;

/**
 * @param {IndexOptions=} options
 * @param {Encoder=} encoder
 * @constructor
 */

export default function WorkerIndex(options = /** @type IndexOptions */ ({}), encoder){

    if(!this || this.constructor !== WorkerIndex) {
        return new WorkerIndex(options);
    }

    // the factory is the outer wrapper from the build
    // it uses "self" as a trap for node.js
    let factory = typeof self !== "undefined"
        ? self["_factory"]
        : typeof window !== "undefined"
            ? window["_factory"]
            : null;
    if(factory){
        factory = factory.toString();
    }

    const is_node_js = typeof window === "undefined" /*&& self["exports"]*/;
    const _self = this;

    /**
     * @this {WorkerIndex}
     */
    function init(worker){

        this.worker = worker;
        this.resolver = create_object();

        if(!this.worker){
            if(DEBUG){
                console.warn("Worker is not available on this platform. Please report on Github: https://github.com/nextapps-de/flexsearch/issues");
            }
            return;
        }

        function onmessage(msg){
            msg = msg["data"] || msg;
            const id = msg["id"];
            const res = id && _self.resolver[id];
            if(res){
                res(msg["msg"]);
                delete _self.resolver[id];
            }
        }

        is_node_js
            ? this.worker["on"]("message", onmessage)
            : this.worker.onmessage = onmessage;

        if(options.config){

            // when extern configuration needs to be loaded,
            // it needs to return a promise to await for
            return new Promise(function(resolve){
                if(pid > 1e9) pid = 0;
                _self.resolver[++pid] = function(){
                    resolve(_self);
                };
                _self.worker.postMessage({
                    "id": pid,
                    "task": "init",
                    "factory": factory,
                    "options": options
                });
            });
        }

        if(SUPPORT_ASYNC){
            this.priority = options.priority || 4;
        }

        // assign encoder for result highlighting
        this.encoder = encoder || null;

        // initialize worker index
        this.worker.postMessage({
            "task": "init",
            "factory": factory,
            "options": options
        });

        return this;
    }

    const worker = create(factory, is_node_js, options.worker);
    return worker.then
        ? worker.then(function(worker){
            return init.call(_self, worker);
        })
        : init.call(this, worker);
}

if(SUPPORT_WORKER){

    register("add");
    register("append");
    register("search");
    register("update");
    register("remove");
    register("clear");
    register("export");
    register("import");

    if(SUPPORT_CACHE){
        WorkerIndex.prototype.searchCache = searchCache;
    }

    if(SUPPORT_ASYNC){
        apply_async(WorkerIndex.prototype);
    }
}

function register(key){

    WorkerIndex.prototype[key] = function(){

        const self = this;
        const args = [].slice.call(arguments);
        const arg = args[args.length - 1];
        let callback;

        if(typeof arg === "function"){
            callback = arg;
            args.pop();
        }

        const promise = new Promise(function(resolve){
            if(key === "export" && typeof args[0] === "function"){
                // remove function handler
                args[0] = null;
            }
            if(pid > 1e9) pid = 0;
            self.resolver[++pid] = resolve;
            self.worker.postMessage({
                "task": key,
                "id": pid,
                "args": args
            });
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

function create(factory, is_node_js, worker_path){

    return is_node_js ?
        // if anyone asks me what JS has delivered the past 10 years,
        // those are the lines I definitively show up first ^^
        typeof module !== "undefined"
            // This eval will be removed when compiling
            // The issue is that this will not build by Closure Compiler
            ? (0,eval)('new(require("worker_threads")["Worker"])(__dirname+"/worker/node.js")')
            // this will need to remove in CommonJS builds,
            // otherwise the module is treated as ESM by Node.js automatic detection
            // the path src/worker/node.mjs is located at dist/node/node.mjs
            // The issue is that this will not build by Babel Compiler
            : import("worker_threads").then(function(worker){return new worker["Worker"](import.meta.dirname+"/worker/node.mjs")})
    :(
        factory ?
            new window.Worker(URL.createObjectURL(
                new Blob(
                    ["onmessage=" + handler.toString()],
                    { "type": "text/javascript" }
                )
            ))
        :
            new window.Worker(
                typeof worker_path === "string"
                    ? worker_path
                    // when loaded from /src/ folder the worker file is located at /worker/worker.js
                    : import.meta.url.replace("/worker.js", "/worker/worker.js")
                                     .replace("flexsearch.bundle.module.min.js", "module/worker/worker.js") /*"worker/worker.js"*/
                , { type: "module" }
            )
    );
}
