import { concat } from "../common.js";
import { IntermediateSearchResults, SearchResults, EnrichedSearchResults } from "../type.js";
import { apply_enrich } from "../document/search.js";
import Document from "../document.js";
import Index from "../index.js";

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
 * @this {Document|Index}
 */

export default function(result, limit, offset, enrich){

    if(!result.length){
        return result;
    }

    // fast path: when there is just one slot in the result
    if(result.length === 1){
        let final = result[0];
        final = offset || (final.length > limit)
            ? (limit
                ? final.slice(offset, offset + limit)
                : final.slice(offset)
            )
            : final;
        return enrich
            ? apply_enrich.call(this, final)
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
            // apply offset pointer when length differs
            if(offset < len){
                arr = limit
                    ? arr.slice(offset, offset + limit)
                    : arr.slice(offset);
                len = arr.length;
                offset = 0;
            }
        }

        if(len > limit){
            arr = arr.slice(0, limit);
            len = limit;
        }

        if(!final.length){
            // fast path: when limit was reached in first slot
            if(len >= limit){
                return enrich
                    ? apply_enrich.call(this, arr)
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

// /**
//  * @param {SearchResults} ids
//  * @return {EnrichedSearchResults}
//  */
//
// export function enrich_result(ids){
//     // ids could be the original reference to an index value
//     /** @type {EnrichedSearchResults} */
//     const result = new Array(ids.length);
//     for(let i = 0, id; i < ids.length; i++){
//         id = ids[i];
//         result[i] = {
//             "id": id,
//             "doc": this.store.get(id)
//         };
//     }
//     return result;
// }
