import Index from "./index.js";
import Document from "./document.js";

/**
 * @param {string|Object} query
 * @param {number|Object=} limit
 * @param {Object=} options
 * @this {Index|Document}
 * @returns {Array<number|string>|Promise}
 */

export function searchCache(query, limit, options) {

    query = ("object" == typeof query ? "" + query.query : "" + query).toLowerCase();

    //let encoded = this.encoder.encode(query).join(" ");
    let cache = this.cache.get(query);
    if (!cache) {
        cache = this.search(query, limit, options);
        if (cache.then) {
            const self = this;
            cache.then(function (cache) {
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

export default function CacheClass(limit) {
    /** @private */
    this.limit = !limit || !0 === limit ? 1000 : limit;
    /** @private */
    this.cache = new Map();
    /** @private */
    this.last = "";
}

CacheClass.prototype.set = function (key, value) {
    //if(!this.cache.has(key)){
    this.cache.set(this.last = key, value);
    if (this.cache.size > this.limit) {
        this.cache.delete(this.cache.keys().next().value);
    }
    //}
};

CacheClass.prototype.get = function (key) {
    const cache = this.cache.get(key);
    if (cache && this.last !== key) {
        this.cache.delete(key);
        this.cache.set(this.last = key, cache);
    }
    return cache;
};

CacheClass.prototype.remove = function (id) {
    for (const item of this.cache) {
        const key = item[0],
              value = item[1];

        if (value.includes(id)) {
            this.cache.delete(key);
        }
    }
};

CacheClass.prototype.clear = function () {
    this.cache.clear();
    this.last = "";
};