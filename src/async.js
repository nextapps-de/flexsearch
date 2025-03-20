import Document from "./document.js";
import Index from "./index.js";
import WorkerIndex from "./worker.js";

export default function(prototype){
    register.call(prototype, "add");
    register.call(prototype, "append");
    register.call(prototype, "search");
    register.call(prototype, "update");
    register.call(prototype, "remove");
}

let timer;
let timestamp;
const current = {};
const limit = {};

function tick(key){
    timer = 0;
    current[key] = limit[key];
}

/**
 * @param {!string} key
 * @this {Index|Document|WorkerIndex}
 */

function register(key){
    this[key + "Async"] = function(){

        const args = /*[].slice.call*/(arguments);
        const arg = args[args.length - 1];
        let callback;

        if(typeof arg === "function"){
            callback = arg;
            delete args[args.length - 1];
        }

        // balance when polling the event loop
        if(!timer){
            timer = setTimeout(tick, 0, key);
            timestamp = Date.now();
        }
        if(!limit[key]){
            limit[key] = current[key] = 1000;
        }
        if(!--current[key]){
            const now = Date.now();
            const duration = now - timestamp;
            const target = this.priority * this.priority * 3;
            current[key] = limit[key] = (limit[key] * target / duration | 0) || 1;
            timer = clearTimeout(timer);
            const self = this;
            return new Promise(resolve => {
                setTimeout(function(){
                    resolve(self[key + "Async"].apply(self, args));
                }, 0)
            })
        }

        //this.async = true;
        const res = this[key].apply(this, args);
        const promise = res.then ? res : new Promise(resolve => resolve(res));
        //this.async = false;
        if(callback){
            promise.then(callback);
        }
        return promise;
    };
}
