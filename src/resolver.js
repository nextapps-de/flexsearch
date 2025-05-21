// COMPILER BLOCK -->
import {
    DEBUG,
    SUPPORT_ASYNC,
    SUPPORT_DOCUMENT,
    SUPPORT_STORE
} from "./config.js";
// <-- COMPILER BLOCK
import {
    ResolverOptions,
    IntermediateSearchResults,
    SearchResults,
    EnrichedSearchResults
} from "./type.js";
import Index from "./index.js";
import Document from "./document.js";
import WorkerIndex from "./worker.js";
import default_resolver from "./resolve/default.js";
import "./resolve/handler.js";
import "./resolve/or.js";
import "./resolve/and.js";
import "./resolve/xor.js";
import "./resolve/not.js";
import { apply_enrich } from "./document/search.js";

/**
 * @param {IntermediateSearchResults|ResolverOptions=} result
 * @param {Index|Document|WorkerIndex=} index
 * @return {Resolver}
 * @constructor
 */
export default function Resolver(result, index){
    if(!this || this.constructor !== Resolver){
        return new Resolver(result, index);
    }
    // if(result && result.constructor === Resolver){
    //     return /** @type {Resolver} */ (result);
    // }
    let boost = 0;
    let promises;
    let _await;
    let _return;

    if(result && result.index){
        const options = /** @type {ResolverOptions} */ (result);
        index = options.index;
        boost = options.boost || 0;
        if(options.query){
            const resolve = options.resolve;
            const async = options.async || options.queue;
            options.resolve = false;
            options.index = null;
            result = SUPPORT_ASYNC && async
                ? index.searchAsync(options)
                : index.search(options);
            options.resolve = resolve;
            options.index = index;
            result = result.result || result;
        }
        else{
            result = [];
        }
    }

    // (async function(result){
    //     console.log( result)
    //     console.log(await result)
    // })(result);

    if(result && result.then){
        const self = this;
        result = result.then(function(result){
            self.promises[0] = self.result = result.result || result;
            self.execute();
        });
        promises = [result];
        result = [];
        _await = new Promise(function(resolve){
            _return = resolve;
        });
    }

    /** @type {Index|Document|WorkerIndex|null} */
    this.index = index || null;
    /** @type {IntermediateSearchResults} */
    this.result = /** @type {IntermediateSearchResults} */ (result) || [];
    /** @type {number} */
    this.boostval = boost;
    /** @type {Array<Promise<IntermediateSearchResults>|IntermediateSearchResults|Function>} */
    this.promises = promises || [];
    /** @type {Promise<SearchResults|EnrichedSearchResults>} */
    this.await = _await || null;
    /** @type {Function} */
    this.return = _return || null;

    ///** @type {string} */
    //this.query = "";
}

/**
 * @param {number} limit
 */
Resolver.prototype.limit = function(limit){
    if(this.result.length){
        /** @type {IntermediateSearchResults} */
        const final = [];
        for(let j = 0, ids; j < this.result.length; j++){
            if((ids = this.result[j])){
                if(ids.length <= limit){
                    final[j] = ids;
                    limit -= ids.length;
                    if(!limit) break;
                }
                else{
                    final[j] = ids.slice(0, limit);
                    break;
                }
            }
        }
        this.result = final;
    }
    return this;
};

/**
 * @param {number} offset
 */
Resolver.prototype.offset = function(offset){
    if(this.result.length){
        /** @type {IntermediateSearchResults} */
        const final = [];
        for(let j = 0, ids; j < this.result.length; j++){
            if((ids = this.result[j])){
                if(ids.length <= offset){
                    offset -= ids.length;
                }
                else{
                    final[j] = ids.slice(offset);
                    offset = 0;
                }
            }
        }
        this.result = final;
    }
    return this;
};

/**
 * @param {number} boost
 */
Resolver.prototype.boost = function(boost){
    this.boostval += boost;
    return this;
};

/**
 * @param {boolean=} _skip_callback
 * @this {Resolver}
 */
Resolver.prototype.execute = function(_skip_callback){

    let result = this.result;

    for(let i = 0, promise; i < this.promises.length; i++){
        promise = this.promises[i];
        if(promise){
            if(typeof promise === "function"){
                result = promise();
                this.promises[i] = result = result.result || result;
                i--;
            }
            else if(promise._fn){
                result = promise._fn();
                this.promises[i] = result = result.result || result;
                i--;
            }
            else if(promise.then){
                return this.await;
            }
        }
    }

    const fn = this.return;
    this.result = result;
    this.promises = [];
    this.await = null;
    this.return = null;

    // return final result
    _skip_callback || fn(result);
    return result;
};

/**
 * @param {number|ResolverOptions=} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 * @param {boolean=} _resolved
 */
Resolver.prototype.resolve = function(limit, offset, enrich, _resolved){

    let result = this.await
        ? this.execute(true)
        : this.result;

    if(result.then){
        const self = this;
        return result.then(function(){
            return self.resolve(limit, offset, enrich);
        });
    }

    if(result.length){
        if(typeof limit === "object"){
            enrich = SUPPORT_DOCUMENT && SUPPORT_STORE && limit.enrich;
            offset = limit.offset;
            if(DEBUG){
                // TODO
                if(limit.highlight){
                    console.warn('Highlighting results is not supported within the resolve() method. Instead pass highlight options within the last resolver stage like { query: "...", resolve: true, highlight: ... }.');
                }
            }
            limit = limit.limit;
        }
        result = _resolved
            ? (enrich
                ? apply_enrich.call(
                    /** @type {Document} */ (this.index),
                    /** @type {SearchResults} */ (result)
                )
                : result)
            : default_resolver.call(this.index, result, limit || 100, offset, enrich);
        // TODO
        // if(highlight){
        //     result = highlight_fields(result);
        // }
        // }
    }

    const fn = this.return;
    this.index = null;
    this.result = null;
    this.promises = null;
    this.await = null;
    this.return = null;
    //this.query = "";

    fn && fn(result);
    return result;
};
