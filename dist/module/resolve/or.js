import Resolver from "../resolver.js";
import { union } from "../intersect.js";
import { SearchResults, EnrichedSearchResults, IntermediateSearchResults, HighlightOptions } from "../type.js";

/** @this {Resolver} */
Resolver.prototype.or = function () {
    return this.handler("or", return_result, arguments);
};

/**
 * Aggregate the intersection of N raw results
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

    if (final.length) {
        this.result.length && final.push(this.result);

        if (2 > final.length) {
            this.result = final[0];
        } else {

            this.result = union(final, limit, offset, !1, this.boostval);

            offset = 0;
        }
    }

    if (resolve) {
        this.await = null;
    }

    return resolve ? this.resolve(limit, offset, enrich, highlight) : this;
}