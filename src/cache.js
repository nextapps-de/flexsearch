import Index from "./index.js";
import Document from "./document.js";
import { SearchOptions, DocumentSearchOptions } from "./type.js";

/**
 * @param {string|SearchOptions|DocumentSearchOptions} query_or_options
 * @param {number|SearchOptions|DocumentSearchOptions=} limit_or_options
 * @param {SearchOptions|DocumentSearchOptions=} options
 * @this {Index|Document}
 * @returns {Array<number|string>|Promise}
 */

export function searchCache(query_or_options, limit_or_options, options){

    const query = (limit_or_options
        ? "" + query_or_options
        : typeof query_or_options === "object"
            ? "" + query_or_options.query
            : query_or_options
    ).toLowerCase();

    if(!this.cache){
        this.cache = new CacheClass();
    }

    let cache = this.cache.get(query);
    if(!cache){
        cache = this.search(query_or_options, limit_or_options, options);

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
 * @param {Array} value
 */

CacheClass.prototype.set = function(key, value){
    this.cache.set(this.last = key, value);
    if(this.cache.size > this.limit){
        this.cache.delete(this.cache.keys().next().value);
    }
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
