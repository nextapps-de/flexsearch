//import { promise as Promise } from "../polyfill.js";
import { IndexOptions } from "./type.js";
import { create_object, is_function, is_object, is_string } from "./common.js";
import handler from "./worker/handler.js";

let pid = 0;

/**
 * @param {IndexOptions=} options
 * @constructor
 */

export default function WorkerIndex(options) {

    if (!this) {
        return new WorkerIndex(options);
    }

    if (!options) {
        options = {};
    }

    // the factory is the outer wrapper from the build
    // we use "self" as a trap for node.js

    let factory = "undefined" != typeof self && (self || window)._factory;
    if (factory) {
        factory = factory.toString();
    }

    const is_node_js = "undefined" == typeof window /*&& self["exports"]*/,
          _self = this;

    (async function () {

        this.worker = await create(factory, is_node_js, options.worker);
        this.resolver = create_object();

        if (!this.worker) {
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

            delete options.db;

            // when extern configuration needs to be loaded
            // it needs to return a promise to await for
            return new Promise(function (resolve) {
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

        this.worker.postMessage({
            task: "init",
            factory: factory,
            options: options
        });
    }).call(this);
}

register("add");
register("append");
register("search");
register("update");
register("remove");

function register(key) {

    WorkerIndex.prototype[key] = WorkerIndex.prototype[key + "Async"] = function () {
        const self = this,
              args = [].slice.call(arguments),
              arg = args[args.length - 1];

        let callback;

        if (is_function(arg)) {
            callback = arg;
            args.splice(args.length - 1, 1);
        }

        const promise = new Promise(function (resolve) {
            //setTimeout(function(){
            self.resolver[++pid] = resolve;
            self.worker.postMessage({
                task: key,
                id: pid,
                args: args
            });
            //});
        });

        if (callback) {
            promise.then(callback);
            return this;
        } else {

            return promise;
        }
    };
}

async function create(factory, is_node_js, worker_path) {

    let worker = is_node_js ?
    // This eval will be removed when compiling, it isn't there in final build

    "undefined" != typeof module ? (0, eval)('new (require("worker_threads")["Worker"])(__dirname + "/node/node.js")')
    //: (0,eval)('new ((await import("worker_threads"))["Worker"])(import.meta.dirname + "/worker/node.mjs")')
    : (0, eval)('new ((await import("worker_threads"))["Worker"])((1,eval)(\"import.meta.dirname\") + "/node/node.mjs")')

    //eval('new (require("worker_threads")["Worker"])(__dirname + "/node/node.js")')
    : factory ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + handler.toString()], { type: "text/javascript" }))) : new window.Worker(is_string(worker_path) ? worker_path : "worker/worker.js", { type: "module" });

    return worker;
}