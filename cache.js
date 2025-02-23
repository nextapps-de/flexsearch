import { IndexInterface, DocumentInterface } from "./type.js";
import { create_object, is_object } from "./common.js";

/**
 * @param {string|Object} query
 * @param {number|Object=} limit
 * @param {Object=} options
 * @this {IndexInterface}
 * @returns {Array<number|string>}
 */

export function searchCache(query, limit, options){
    //if(!query) return;
    query = "" + (query["query"] || query);
    let encoded = this.encode(query).join("");
    let cache = this.cache.get(encoded);
    if(!cache){
        cache = this.search(query, limit, options);
        this.cache.set(encoded, cache);
    }
    return cache;
}

/**
 * @param {boolean|number=} limit
 * @constructor
 */

export default function CacheClass(limit){
    /** @private */
    this.limit = (limit !== true) && limit;
    /** @private */
    this.cache = new Map();
    /** @private */
    this.last = "";
}

CacheClass.prototype.set = function(key, value){
    if(!this.cache.has(key)){
        this.cache.set(this.last = key, value);
        if(this.limit && this.cache.size > this.limit){
            this.cache.delete(this.cache.keys().next().value);
        }
    }
};

CacheClass.prototype.get = function(key){
    const cache = this.cache.get(key);
    if(cache && this.limit && this.last !== key){
        this.cache.delete(key);
        this.cache.set(this.last = key, cache);
    }
    return cache;
};

CacheClass.prototype.remove = function(id){
    for(const item of this.cache){
        const key = item[0];
        const value = item[1];
        if(value.includes(id)){
            this.cache.delete(key);
        }
    }
};

CacheClass.prototype.clear = function(){
    this.cache.clear();
    this.last = "";
};
