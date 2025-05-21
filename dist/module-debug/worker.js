
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

export default function WorkerIndex(options = /** @type IndexOptions */{}, encoder) {

    if (!this || this.constructor !== WorkerIndex) {
        return new WorkerIndex(options);
    }

    let factory = "undefined" != typeof self ? self._factory : "undefined" != typeof window ? window._factory : null;
    if (factory) {
        factory = factory.toString();
    }

    const is_node_js = "undefined" == typeof window,
          _self = this;

    /**
     * @this {WorkerIndex}
     */
    function init(worker) {

        this.worker = worker;
        this.resolver = create_object();

        if (!this.worker) {
            console.warn("Worker is not available on this platform. Please report on Github: https://github.com/nextapps-de/flexsearch/issues");

            return;
        }

        function onmessage(msg) {
            msg = msg.data || msg;
            const id = msg.id,
                  res = id && _self.resolver[id];

            if (res) {
                res(msg.msg);
                delete _self.resolver[id];
            }
        }

        is_node_js ? this.worker.on("message", onmessage) : this.worker.onmessage = onmessage;

        if (options.config) {

            return new Promise(function (resolve) {
                if (1e9 < pid) pid = 0;
                _self.resolver[++pid] = function () {
                    resolve(_self);
                };
                _self.worker.postMessage({
                    id: pid,
                    task: "init",
                    factory: factory,
                    options: options
                });
            });
        }

        this.priority = options.priority || 4;


        this.encoder = encoder || null;

        this.worker.postMessage({
            task: "init",
            factory: factory,
            options: options
        });

        return this;
    }

    const worker = create(factory, is_node_js, options.worker);
    return worker.then ? worker.then(function (worker) {
        return init.call(_self, worker);
    }) : init.call(this, worker);
}

register("add");
register("append");
register("search");
register("update");
register("remove");
register("clear");
register("export");
register("import");

WorkerIndex.prototype.searchCache = searchCache;

apply_async(WorkerIndex.prototype);


function register(key) {

    WorkerIndex.prototype[key] = function () {
        const self = this,
              args = [].slice.call(arguments),
              arg = args[args.length - 1];

        let callback;

        if ("function" == typeof arg) {
            callback = arg;
            args.pop();
        }

        const promise = new Promise(function (resolve) {
            if ("export" === key && "function" == typeof args[0]) {

                args[0] = null;
            }
            if (1e9 < pid) pid = 0;
            self.resolver[++pid] = resolve;
            self.worker.postMessage({
                task: key,
                id: pid,
                args: args
            });
        });

        if (callback) {
            promise.then(callback);
            return this;
        } else {
            return promise;
        }
    };
}

function create(factory, is_node_js, worker_path) {

    return is_node_js ? "undefined" != typeof module ? (0,eval)('new(require("worker_threads")["Worker"])(__dirname+"/worker/node.js")') : import("worker_threads").then(function(worker){return new worker["Worker"](import.meta.dirname+"/../node/node.mjs")}) : factory ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + handler.toString()], { type: "text/javascript" }))) : new window.Worker("string" == typeof worker_path ? worker_path : (1, eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", "module/worker/worker.js"), { type: "module" });
}