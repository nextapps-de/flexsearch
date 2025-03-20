import Document from "./document.js";
import Index from "./index.js";

export default function (prototype) {
    register.call(prototype, "add");
    register.call(prototype, "append");
    register.call(prototype, "search");
    register.call(prototype, "update");
    register.call(prototype, "remove");
}

let timer, timestamp;
const current = {},
      limit = {};


function tick(key) {
    timer = 0;
    current[key] = limit[key];
}

/**
 * @param {!string} key
 * @this {Index|Document}
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

        // balance when polling the event loop
        if (!timer) {
            timer = setTimeout(tick, 0, key);
            timestamp = Date.now();
        }
        if (!limit[key]) {
            limit[key] = current[key] = 1000;
        }
        if (! --current[key]) {
            const now = Date.now(),
                  duration = now - timestamp,
                  target = 3 * (this.priority * this.priority);

            current[key] = limit[key] = 0 | limit[key] * target / duration || 1;
            timer = clearTimeout(timer);
            const self = this;
            return new Promise(resolve => {
                setTimeout(function () {
                    resolve(self[key + "Async"].apply(self, args));
                }, 0);
            });
        }

        //this.async = true;
        const res = this[key].apply(this, args),
              promise = res.then ? res : new Promise(resolve => resolve(res));

        //this.async = false;
        if (callback) {
            promise.then(callback);
        }
        return promise;
    };
}