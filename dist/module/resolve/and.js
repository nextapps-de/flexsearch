import Resolver from "../resolver.js";
import { get_max_len } from "../common.js";
import { intersect } from "../intersect.js";
import { SearchResults, EnrichedSearchResults, IntermediateSearchResults, ResolverOptions } from "../type.js";
import { apply_enrich } from "../document/search.js";

/** @this {Resolver} */
Resolver.prototype.and = function () {
    let execute = this.result.length,
        limit,
        offset,
        enrich,
        resolve;


    if (!execute) {
        /** @type {ResolverOptions} */
        const arg = arguments[0];
        if (arg) {
            execute = !!arg.suggest;
            resolve = arg.resolve;
            limit = arg.limit;
            offset = arg.offset;
            enrich = arg.enrich && resolve;
        }
    }

    if (execute) {

        const {
            final,
            promises,
            limit,
            offset,
            enrich,
            resolve,
            suggest
        } = this.handler("and", arguments);

        return return_result.call(this, final, promises, limit, offset, enrich, resolve, suggest);
    }

    return resolve ? this.resolve(limit, offset, enrich) : this;
};

/**
 * Aggregate the intersection of N raw results
 * @param {!Array<IntermediateSearchResults>} final
 * @param {!Array<Promise<IntermediateSearchResults>>} promises
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 * @param {boolean=} resolve
 * @param {boolean=} suggest
 * @this {Resolver}
 * @return {
 *   SearchResults |
 *   EnrichedSearchResults |
 *   IntermediateSearchResults |
 *   Promise<SearchResults | EnrichedSearchResults | IntermediateSearchResults> |
 *   Resolver
 * }
 */

function return_result(final, promises, limit, offset, enrich, resolve, suggest) {

    if (promises.length) {
        const self = this;
        return Promise.all(promises).then(function (result) {

            final = [];
            for (let i = 0, tmp; i < result.length; i++) {
                if ((tmp = result[i]).length) {
                    final[i] = tmp;
                }
            }

            return return_result.call(self, final, [], limit, offset, enrich, resolve, suggest);
        });
    }

    if (!final.length) {
        if (!suggest) {
            this.result = /** @type {SearchResults|IntermediateSearchResults} */final;
        }
    } else {
        //final = [this.result].concat(final);
        this.result.length && final.unshift(this.result);

        if (2 > final.length) {
            this.result = final[0];
        } else {
            const resolution = get_max_len(final);
            if (!resolution) {
                this.result = [];
            } else {
                this.result = intersect(final, resolution, limit, offset, suggest, this.boostval, resolve);

                return resolve ? enrich ? apply_enrich.call(this.index, /** @type {SearchResults} */this.result) : this.result : this;
            }
        }
    }

    return resolve ? this.resolve(limit, offset, enrich) : this;
}