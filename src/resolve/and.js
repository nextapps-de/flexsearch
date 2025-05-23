import Resolver from "../resolver.js";
import { get_max_len } from "../common.js";
import { intersect } from "../intersect.js";
import {
    SearchResults,
    EnrichedSearchResults,
    IntermediateSearchResults,
    HighlightOptions
} from "../type.js";

/**
 * @return {
 *   SearchResults |
 *   EnrichedSearchResults |
 *   IntermediateSearchResults |
 *   Promise<SearchResults | EnrichedSearchResults | IntermediateSearchResults> |
 *   Resolver
 * }
 * @this {Resolver}
 */
Resolver.prototype["and"] = function(){
    return this.handler("and", return_result, arguments);
}

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

    if(!suggest && !this.result.length){
        return resolve
            ? this.result
            : this;
    }

    let resolved;

    if(!final.length){
        if(!suggest){
            this.result = /** @type {SearchResults|IntermediateSearchResults} */ (
                final
            );
        }
    }
    else{
        this.result.length && final.unshift(this.result);

        if(final.length < 2){
            this.result = final[0];
        }
        else{

            let resolution = 0;
            for(let i = 0, res, len; i < final.length; i++){
                if((res = final[i]) && (len = res.length)){
                    if(resolution < len){
                        resolution = len;
                    }
                }
                else if(!suggest){
                    resolution = 0;
                    break;
                }
            }

            if(!resolution){
                this.result = [];
            }
            else{
                this.result = intersect(
                    final,
                    resolution,
                    limit,
                    offset,
                    suggest,
                    this.boostval,
                    resolve
                );
                resolved = true;
            }
        }
    }

    // skip recursive promise execution in .resolve()
    if(resolve){
        this.await = null;
    }

    return resolve
        ? this.resolve(limit, offset, enrich, highlight, resolved)
        : this;
}
