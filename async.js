import { IndexInterface, DocumentInterface } from "./type.js";
//import { promise as Promise } from "./polyfill.js";
import { is_function, is_object, is_string } from "./common.js";

export default function(prototype){
    register.call(prototype, "add");
    register.call(prototype, "append");
    register.call(prototype, "search");
    register.call(prototype, "update");
    register.call(prototype, "remove");
}

let cycle;
let budget = 0;

function tick(resolve){
    cycle = null;
    budget = 0;
    resolve();
}

function register(key){
    this[key + "Async"] = async function(){

        // prevent stack overflow of adding too much tasks to the same event loop
        // actually limit stack to 1,000,000 tasks every ~4ms
        cycle || (
            cycle = new Promise(resolve => setTimeout(tick, 0, resolve))
        );

        // apply different performance budgets
        if(key === "update" || key === "remove" && this.fastupdate === false){
            budget += 1000 * this.resolution;
            if(this.depth)
                budget += 1000 * this.resolution_ctx;
        }
        else if(key === "search"){
            budget++;
        }
        else{
            budget += 20 * this.resolution;
            if(this.depth)
                budget += 20 * this.resolution_ctx;
        }

        // wait for the event loop cycle
        if(budget >= 1e6){
            await cycle;
        }

        /** @this {IndexInterface|DocumentInterface} */
        //const self = this;
        const args = /*[].slice.call*/(arguments);
        const arg = args[args.length - 1];
        let callback;

        if(typeof arg === "function"){
            callback = arg;
            delete args[args.length - 1];
        }

        //const promise = new Promise(async function(resolve){

        //setTimeout(function(){

        this.async = true;
        const res = await this[key].apply(this, args);
        this.async = false;
        //resolve(res);
        //});
        //});

        if(callback){

            //promise.then(callback);
            callback(res);
            //return this;
        }
        // else{
        //
        //     return promise;
        // }
        return res;
    };
}