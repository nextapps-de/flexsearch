import Document from "./document.js";
import Index from "./index.js";
import WorkerIndex from "./worker.js";

export default function (prototype) {
    register.call(prototype, "add");
    register.call(prototype, "append");
    register.call(prototype, "search");
    register.call(prototype, "update");
    register.call(prototype, "remove");
}

let timer, timestamp, cycle;


function tick() {
    timer = cycle = 0;
}

/**
 * @param {!string} key
 * @this {Index|Document|WorkerIndex}
 */

function register(key) {
    this[key + "Async"] = function () {
        const args = /*[].slice.call*/arguments,
              arg = args[args.length - 1];

        let callback;

        if ("function" == typeof arg) {
            callback = arg;
            delete args[args.length - 1];
        }

        // event loop runtime balancer
        if (!timer) {
            // when the next event loop occurs earlier than task completion
            // it will reset the state immediately
            timer = setTimeout(tick, 0);
            timestamp = Date.now();
        } else if (!cycle) {
            const now = Date.now(),
                  duration = now - timestamp,
                  target = 3 * (this.priority * this.priority);

            cycle = duration >= target;
        }

        // cycle all instances from this point
        if (cycle) {
            const self = this;
            // move the next microtask onto the next macrotask queue
            return new Promise(resolve => {
                setTimeout(function () {
                    resolve(self[key + "Async"].apply(self, args));
                }, 0);
            });
        }

        const res = this[key].apply(this, args),
              promise = res.then ? res : new Promise(resolve => resolve(res));


        if (callback) {
            promise.then(callback);
        }

        return promise;
    };
}