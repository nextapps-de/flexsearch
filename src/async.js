// COMPILER BLOCK -->
import { SUPPORT_CACHE } from "./config.js";
// <-- COMPILER BLOCK
import Document from "./document.js";
import Index from "./index.js";
import WorkerIndex from "./worker.js";

export default function(prototype){
    register.call(prototype, "add");
    register.call(prototype, "append");
    register.call(prototype, "search");
    register.call(prototype, "update");
    register.call(prototype, "remove");
    if(SUPPORT_CACHE){
        register.call(prototype, "searchCache");
    }
}

let timer;
let timestamp;
let cycle;

function tick(){
    timer = cycle = 0;
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

        // event loop runtime balancer
        if(!timer){
            // when the next event loop occurs earlier than task completion
            // it will reset the state immediately
            timer = setTimeout(tick, 0);
            timestamp = Date.now();
        }
        else if(!cycle){
            const now = Date.now();
            const duration = now - timestamp;
            const target = this.priority * this.priority * 3;
            cycle = duration >= target;
        }

        // cycle all instances from this point
        if(cycle){
            const self = this;
            // move the next microtask onto the next macrotask queue
            return new Promise(resolve => {
                setTimeout(function(){
                    resolve(self[key + "Async"].apply(self, args));
                }, 0);
            });
        }

        const res = this[key].apply(this, args);
        const promise = res.then ? res : new Promise(resolve => resolve(res));

        if(callback){
            promise.then(callback);
        }

        return promise;
    };
}
