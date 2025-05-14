import Resolver from "../resolver.js";
import { union } from "../intersect.js";
import { SearchResults, EnrichedSearchResults, IntermediateSearchResults } from "../type.js";

/** @this {Resolver} */
Resolver.prototype.or = function () {

    const {
        final,
        promises,
        limit,
        offset,
        enrich,
        resolve
    } = this.handler("or", arguments);

    return return_result.call(this, final, promises, limit, offset, enrich, resolve);
};

/**
 * Aggregate the intersection of N raw results
 * @param {!Array<IntermediateSearchResults>} final
 * @param {!Array<Promise<IntermediateSearchResults>>} promises
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 * @param {boolean=} resolve
 * @this {Resolver}
 * @return {
 *   SearchResults |
 *   EnrichedSearchResults |
 *   IntermediateSearchResults |
 *   Promise<SearchResults | EnrichedSearchResults | IntermediateSearchResults> |
 *   Resolver
 * }
 */

function return_result(final, promises, limit, offset, enrich, resolve) {

    if (promises.length) {
        const self = this;
        return Promise.all(promises).then(function (result) {

            final = [];
            for (let i = 0, tmp; i < result.length; i++) {
                if ((tmp = result[i]).length) {
                    final[i] = tmp;
                }
            }

            return return_result.call(self, final, [], limit, offset, enrich, resolve);
        });
    }

    if (final.length) {

        this.result.length && final.push(this.result);

        if (2 > final.length) {
            this.result = final[0];
        } else {

            this.result = union(final, limit, offset, !1, this.boostval);

            offset = 0;
        }
    }

    return resolve ? this.resolve(limit, offset, enrich) : this;
}