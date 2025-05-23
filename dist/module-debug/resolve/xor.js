import Resolver from "../resolver.js";
import { create_object } from "../common.js";
import { SearchResults, EnrichedSearchResults, IntermediateSearchResults, HighlightOptions } from "../type.js";

/** @this {Resolver} */
Resolver.prototype.xor = function () {
    return this.handler("xor", return_result, arguments);
};

/**
 * @param {!Array<IntermediateSearchResults>} final
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 * @param {boolean=} resolve
 * @param {boolean=} suggest
 * @param {string|HighlightOptions=} highlight
 * @this {Resolver}
 * @return {
 *   SearchResults |
 *   EnrichedSearchResults |
 *   IntermediateSearchResults |
 *   Promise<SearchResults | EnrichedSearchResults | IntermediateSearchResults> |
 *   Resolver
 * }
 */

function return_result(final, limit, offset, enrich, resolve, suggest, highlight) {

    let resolved;

    if (!final.length) {
        if (!suggest) this.result = /** @type {SearchResults|IntermediateSearchResults} */final;
    } else {
        this.result.length && final.unshift(this.result);

        if (2 > final.length) {
            this.result = final[0];
        } else {
            this.result = exclusive.call(this, final, limit, offset, resolve, this.boostval);
            resolved = !0;
        }
    }

    if (resolve) {
        this.await = null;
    }

    return resolve ? this.resolve(limit, offset, enrich, highlight, resolved) : this;
}

/**
 * Aggregate the intersection of N raw results
 * @param {!Array<IntermediateSearchResults>} result
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} resolve
 * @param {number=} boost
 * @this {Resolver}
 * @return {SearchResults|IntermediateSearchResults}
 */

function exclusive(result, limit, offset, resolve, boost) {

    /** @type {SearchResults|IntermediateSearchResults} */
    const final = [],
          check = create_object();

    let maxres = 0;

    for (let i = 0, res; i < result.length; i++) {
        res = result[i];
        if (!res) continue;

        if (maxres < res.length) maxres = res.length;

        for (let j = 0, ids; j < res.length; j++) {
            ids = res[j];
            if (!ids) continue;

            for (let k = 0, id; k < ids.length; k++) {
                id = ids[k];
                check[id] = check[id] ? 2 : 1;
            }
        }
    }

    for (let j = 0, ids, count = 0; j < maxres; j++) {

        for (let i = 0, res; i < result.length; i++) {
            res = result[i];
            if (!res) continue;

            ids = res[j];
            if (!ids) continue;

            for (let k = 0, id; k < ids.length; k++) {
                id = ids[k];
                if (1 === check[id]) {
                    if (offset) {
                        offset--;
                        continue;
                    }
                    if (resolve) {
                        final.push(id);
                        if (final.length === limit) {
                            return final;
                        }
                    } else {

                        const index = j + (i ? boost : 0);
                        final[index] || (final[index] = []);
                        final[index].push(id);
                        if (++count === limit) {
                            return final;
                        }
                    }
                }
            }
        }
    }

    return final;
}