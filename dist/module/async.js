
import Document from "./document.js";
import Index from "./index.js";
import WorkerIndex from "./worker.js";

export default function (prototype) {
    register.call(prototype, "add");
    register.call(prototype, "append");
    register.call(prototype, "search");
    register.call(prototype, "update");
    register.call(prototype, "remove");

    register.call(prototype, "searchCache");
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
        const args = arguments,
              arg = args[args.length - 1];

        let callback;

        if ("function" == typeof arg) {
            callback = arg;
            delete args[args.length - 1];
        }

        if (!timer) {

            timer = setTimeout(tick, 0);
            timestamp = Date.now();
        } else if (!cycle) {
            const now = Date.now(),
                  duration = now - timestamp,
                  target = 3 * (this.priority * this.priority);

            cycle = duration >= target;
        }

        if (cycle) {
            const self = this;

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