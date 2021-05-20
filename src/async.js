import { promise as Promise } from "./polyfill.js";
import { is_function, is_object } from "./common.js";

export default function(prototype){

    register(prototype, "add");
    register(prototype, "append");
    register(prototype, "search");
    register(prototype, "update");
    register(prototype, "remove");
}

function register(prototype, key){

    prototype[key + "Async"] = function(){

        const self = this;
        const args = /*[].slice.call*/(arguments);
        const arg = args[args.length - 1];
        let callback;

        if(is_function(arg)){

            callback = arg;
            delete args[args.length - 1];
        }

        const promise = new Promise(function(resolve){

            setTimeout(function(){

                const fn = self[key];
                fn.async = true;
                resolve(fn.apply(self, args));
                fn.async = false;
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
