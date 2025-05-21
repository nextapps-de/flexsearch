import { concat } from "../common.js";
import { IntermediateSearchResults, SearchResults, EnrichedSearchResults } from "../type.js";
import { apply_enrich } from "../document/search.js";
import Document from "../document.js";
import Index from "../index.js";
import WorkerIndex from "../worker.js";

/*
 from -> res[score][id]
 to   -> [id]
*/

/**
 * Aggregate the union of a single raw result
 * @param {IntermediateSearchResults} result
 * @param {!number} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 * @return {SearchResults|EnrichedSearchResults}
 * @this {Document|Index|WorkerIndex}
 */

export default function(result, limit, offset, enrich){

    if(!result.length){
        return result;
    }

    // fast path: when there is just one slot in the result
    if(result.length === 1){
        let final = result[0];
        final = offset || (final.length > limit)
            ? final.slice(offset, offset + limit)
            : final;
        return enrich
            ? /** @type {EnrichedSearchResults} */ (apply_enrich.call(this, final))
            : final;
    }

    let final = [];

    // this is an optimized workaround instead of
    // just doing result = concat(result)

    for(let i = 0, arr, len; i < result.length; i++){
        if(!(arr = result[i]) || !(len = arr.length)) continue;

        if(offset){
            // forward offset pointer
            if(offset >= len){
                offset -= len;
                continue;
            }
            // apply the remaining offset
            arr = arr.slice(offset, offset + limit);
            len = arr.length;
            offset = 0;
        }

        if(len > limit){
            // apply limit
            arr = arr.slice(0, limit);
            len = limit;
        }

        if(!final.length){
            // fast path: when limit was reached in the first slot
            if(len >= limit){
                return enrich
                    ? /** @type {EnrichedSearchResults} */ (apply_enrich.call(this, arr))
                    : arr;
            }
        }

        final.push(arr);
        limit -= len;

        // break if limit was reached
        if(!limit){
            break;
        }
    }

    final = final.length > 1
        ? concat(final)
        : final[0];

    return enrich
        ? apply_enrich.call(this, final)
        : final;
}
