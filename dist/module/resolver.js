import Index from "./index.js";
import Document from "./document.js";
import default_resolver from "./resolve/default.js";
import { apply_enrich } from "./document/search.js";
import { ResolverOptions, IntermediateSearchResults } from "./type.js";
import "./resolve/handler.js";
import "./resolve/or.js";
import "./resolve/and.js";
import "./resolve/xor.js";
import "./resolve/not.js";
import { highlight_fields } from "./document/highlight.js";

/**
 * @param {IntermediateSearchResults|ResolverOptions=} result
 * @param {Index|Document=} index
 * @return {Resolver}
 * @constructor
 */

export default function Resolver(result, index) {
    if (!this || this.constructor !== Resolver) {
        return new Resolver(result, index);
    }

    if (result && result.index) {

        result.resolve = !1;
        this.index = /** @type {Index|Document} */result.index;
        this.boostval = result.boost || 0;
        this.result = this.index.search(result).result;
        return this;
    }
    /** @type {Index|Document|null} */
    this.index = index || null;
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
 * @param {boolean=} highlight
 */
Resolver.prototype.resolve = function (limit, offset, enrich) {

    const index = this.index;
    let result = this.result;
    this.index = null;
    this.result = null;

    if (result.length) {
        if ("object" == typeof limit) {
            enrich = limit.enrich;
            offset = limit.offset;
            limit.highlight;
            limit = limit.limit;
        }

        result = default_resolver.call(index, result, limit || 100, offset, enrich);
    }

    return result;
};