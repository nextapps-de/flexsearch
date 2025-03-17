import Index from "./index.js";
import Document from "./document.js";
import { SearchOptions, DocumentSearchOptions } from "./type.js";

/**
 * @param {string|SearchOptions|DocumentSearchOptions} query
 * @param {number|SearchOptions|DocumentSearchOptions=} limit
 * @param {SearchOptions|DocumentSearchOptions=} options
 * @this {Index|Document}
 * @returns {Array<number|string>|Promise}
 */

export function searchCache(query, limit, options){

    query = (typeof query === "object"
        ? "" + query.query
        : "" + query
    ).toLowerCase();

    if(!this.cache){
        this.cache = new CacheClass();
    }

    //let encoded = this.encoder.encode(query).join(" ");
    let cache = this.cache.get(query);
    if(!cache){
        cache = this.search(query, limit, options);
        if(cache.then){
            const self = this;
            cache.then(function(cache){
                self.cache.set(query, cache);
                return cache;
            });
        }
        this.cache.set(query, cache);
    }
    return cache;
}

/**
 * @param {boolean|number=} limit
 * @constructor
 */

export default function CacheClass(limit){
    /** @private */
    this.limit = (!limit || limit === true) ? 1000 : limit;
    /** @private */
    this.cache = new Map();
    /** @private */
    this.last = "";
}

/**
 * @param {string} key
 * @param value
 */

CacheClass.prototype.set = function(key, value){
    //if(!this.cache.has(key)){
        this.cache.set(this.last = key, value);
        if(this.cache.size > this.limit){
            this.cache.delete(this.cache.keys().next().value);
        }
    //}
};

/**
 * @param {string} key
 */

CacheClass.prototype.get = function(key){
    const cache = this.cache.get(key);
    if(cache && this.last !== key){
        this.cache.delete(key);
        this.cache.set(this.last = key, cache);
    }
    return cache;
};

/**
 * @param {string|number} id
 */

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
