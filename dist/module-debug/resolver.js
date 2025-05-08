import Index from "./index.js";
import default_resolver from "./resolve/default.js";
import { apply_enrich } from "./document/search.js";
import { ResolverOptions, IntermediateSearchResults } from "./type.js";
import "./resolve/handler.js";
import "./resolve/or.js";
import "./resolve/and.js";
import "./resolve/xor.js";
import "./resolve/not.js";

/**
 * @param {IntermediateSearchResults|ResolverOptions=} result
 * @return {Resolver}
 * @constructor
 */

export default function Resolver(result) {
    if (!this || this.constructor !== Resolver) {
        return new Resolver(result);
    }
    // if(result && result.constructor === Resolver){
    //     // todo test this branch
    //     //console.log("Resolver Loopback")
    //     return /** @type {Resolver} */ (result);
    // }
    if (result && result.index) {
        // result = /** @type {ResolverOptions} */ (result);
        result.resolve = /* suggest */ /* append: */ /* enrich */ /* resolve: */!1;
        this.index = /** @type {Index} */result.index;
        this.boostval = result.boost || 0;
        this.result = result.index.search(result).result;
        return this;
    }
    /** @type {Index|null} */
    this.index = null;
    /** @type {IntermediateSearchResults} */
    this.result = /** @type {IntermediateSearchResults} */result || [];
    /** @type {number} */
    this.boostval = 0;
}

/**
 * @param {number} limit
 */
Resolver.prototype.limit = function (limit) {
    if (this.result.length) {
        /** @type {IntermediateSearchResults} */
        const final = [];
        for (let j = 0, ids; j < this.result.length; j++) {
            if (ids = this.result[j]) {
                if (ids.length <= limit) {
                    final[j] = ids;
                    limit -= ids.length;
                    if (!limit) break;
                } else {
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
Resolver.prototype.offset = function (offset) {
    if (this.result.length) {
        /** @type {IntermediateSearchResults} */
        const final = [];
        for (let j = 0, ids; j < this.result.length; j++) {
            if (ids = this.result[j]) {
                if (ids.length <= offset) {
                    offset -= ids.length;
                } else {
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
Resolver.prototype.boost = function (boost) {
    this.boostval += boost;
    return this;
};

/**
 * @param {number|ResolverOptions=} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 */
Resolver.prototype.resolve = function (limit, offset, enrich) {
    const result = this.result,
          index = this.index;

    this.index = null;
    this.result = null;

    if (result.length) {
        if ("object" == typeof limit) {
            enrich = limit.enrich;
            offset = limit.offset;
            limit = limit.limit;
        }
        // const document = this.index;
        // if(document.index){
        //     result = default_resolver(result, limit || 100, offset, false);
        //     return enrich
        //         ? apply_enrich.call(document, result)
        //         : result;
        // }
        // else{
        return default_resolver.call(index, result, limit || 100, offset, enrich);
        // }
    }

    return result;
};