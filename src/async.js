import Index from "./index.js";
import Document from "./document.js";
import { promise as Promise } from "./polyfill.js";

/**
 * @param {Function=} callback
 */

export function addAsync(id, content, callback){

    return caller.call(
        /** @type {Document|Index} */ (this),
        /** @type {Document|Index} */ (this).add,
        arguments
    );
}

/**
 * @param {Function=} callback
 */

export function appendAsync(id, content, callback){

    return caller.call(
        /** @type {Document|Index} */ (this),
        /** @type {Document|Index} */ (this).append,
        arguments
    );
}

/**
 * @param {!string} query
 * @param {number|Object|Function=} options
 * @param {Function=} callback
 */

export function searchAsync(query, options, callback){

    return caller.call(
        /** @type {Document|Index} */ (this),
        /** @type {Document|Index} */ (this).search,
        arguments
    );
}

/**
 * @param {Function=} callback
 */

export function updateAsync(id, content, callback){

    return caller.call(
        /** @type {Document|Index} */ (this),
        /** @type {Document|Index} */ (this).update,
        arguments
    );
}

/**
 * @param {Function=} callback
 */

export function removeAsync(id, callback){

    return caller.call(
        /** @type {Document|Index} */ (this),
        /** @type {Document|Index} */ (this).remove,
        arguments
    );
}

function caller(method, args){

    let callback;

    for(let i = 0; i < args.length; i++){

        if(typeof args[i] === "function"){

            callback = args[i];
            delete args[i];
            break;
        }
    }

    const self = /** @type {Document|Index} */ (this);

    const promise = new Promise(function(resolve){

        // Promises are bullshit, they will block the main thread

        setTimeout(function(){

            resolve(method.apply(self, args));
        });
    });

    if(callback){

        promise.then(callback);
        return this;
    }
    else{

        return promise;
    }
}