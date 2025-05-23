import Resolver from "../resolver.js";
import { union } from "../intersect.js";
import {
    SearchResults,
    EnrichedSearchResults,
    IntermediateSearchResults,
    HighlightOptions
} from "../type.js";

/** @this {Resolver} */
Resolver.prototype["or"] = function(){
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

function return_result(final, limit, offset, enrich, resolve, suggest, highlight){

    if(final.length){
        this.result.length && (final.push(this.result));

        if(final.length < 2){
            this.result = final[0];
        }
        else{
            // the suggest-union (reversed processing, resolve needs to be disabled)
            this.result = union(
                final,
                limit,
                offset,
                // bypass resolve for the union helper
                /* resolve: */ false,
                this.boostval
            );
            // limit + offset was already applied
            offset = 0;
        }
    }

    // skip recursive promise execution in .resolve()
    if(resolve){
        this.await = null;
    }

    return resolve
        ? this.resolve(limit, offset, enrich, highlight)
        : this;
}
