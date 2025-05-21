import Index from "./index.js";
import { SearchOptions, DocumentSearchOptions } from "./type.js";

/**
 * @param {string|SearchOptions|DocumentSearchOptions} query
 * @param {number|SearchOptions|DocumentSearchOptions=} limit
 * @param {SearchOptions|DocumentSearchOptions=} options
 * @this {Index}
 * @returns {Array<number|string>|Promise}
 */
export function searchCache(query, limit, options) {

    if (!options) {
        if (!limit && "object" == typeof query) {
            options = query;
        } else if ("object" == typeof limit) {
            options = limit;
            limit = 0;
        }
    }

    if (options) {
        query = options.query || query;
        limit = options.limit || limit;
    }

    let key = "" + (limit || 0);

    if (options) {

        const {
            context,
            suggest,
            offset,
            resolve,
            boost,
            resolution
        } = options;

        key += (offset || 0) + !!context + !!suggest + (!1 !== resolve) + (resolution || this.resolution) + (boost || 0);
    }

    query = ("" + query).toLowerCase();

    if (!this.cache) {
        this.cache = new CacheClass();
    }

    let cache = this.cache.get(query + key);
    if (!cache) {
        const opt_cache = options && options.cache;
        opt_cache && (options.cache = !1);
        cache = this.search(query, limit, options);
        opt_cache && (options.cache = opt_cache);

        this.cache.set(query + key, cache);
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

/**
 * @param {string} key
 * @param {Array} value
 */

CacheClass.prototype.set = function (key, value) {
    this.cache.set(this.last = key, value);
    if (this.cache.size > this.limit) {
        this.cache.delete(this.cache.keys().next().value);
    }
};

/**
 * @param {string} key
 */

CacheClass.prototype.get = function (key) {
    const cache = this.cache.get(key);
    if (cache && this.last !== key) {
        this.cache.delete(key);
        this.cache.set(this.last = key, cache);
    }
    return cache;
};

/**
 * @param {string|number} id
 */

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