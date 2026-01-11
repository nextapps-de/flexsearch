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
 * @param {boolean=} score
 * @return {SearchResults|EnrichedSearchResults}
 * @this {Document|Index|WorkerIndex}
 */

export default function(result, limit, offset, enrich, score){

    if(!result.length){
        return result;
    }
    
    // Ensure score is a boolean
    score = score === true;

    // Check if result already contains score objects
    // For single slot, check the first item in the first slot
    // For multiple slots, check the first slot's first item
    let hasScore = false;
    if(result.length > 0 && result[0]){
        if(Array.isArray(result[0]) && result[0].length > 0){
            // Check first item in first slot
            const firstItem = result[0][0];
            hasScore = typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem) && 'id' in firstItem && 'score' in firstItem;
        } else if(typeof result[0] === 'object' && result[0] !== null && !Array.isArray(result[0])){
            // Result[0] itself is an object
            hasScore = 'id' in result[0] && 'score' in result[0];
        }
    }

    // fast path: when there is just one slot in the result
    if(result.length === 1){
        let final = result[0];
        final = offset || (final.length > limit)
            ? final.slice(offset, offset + limit)
            : final;
        
        // If score is requested but not present, add scores based on position
        // For single slot, all items have the same score (highest resolution)
        if(score && !hasScore && final.length > 0){
            // Check if final contains plain IDs (number or string, not objects or arrays)
            const firstItem = final[0];
            // Simple check: if it's a number or string (not an object with id/score properties)
            const isPlainId = (typeof firstItem === 'number' || typeof firstItem === 'string');
            
            if(isPlainId){
                const scoredFinal = [];
                // Use a high score since this is the first (best) resolution slot
                // Get resolution from index if available, otherwise use default
                const baseScore = (this && this.resolution) || 9;
                for(let i = 0; i < final.length; i++){
                    scoredFinal.push({
                        id: final[i],
                        score: baseScore
                    });
                }
                final = scoredFinal;
            }
        }
        
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
                // If score is requested but not present, add scores
                if(score && !hasScore && arr.length > 0 && typeof arr[0] !== 'object'){
                    const scoredArr = [];
                    for(let j = 0; j < arr.length; j++){
                        scoredArr.push({
                            id: arr[j],
                            score: result.length - i - j // Higher score for earlier results
                        });
                    }
                    arr = scoredArr;
                }
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

    // If score is requested but not present, add scores
    if(score && !hasScore && final.length > 0 && typeof final[0] !== 'object'){
        const scoredFinal = [];
        for(let i = 0; i < final.length; i++){
            scoredFinal.push({
                id: final[i],
                score: final.length - i // Higher score for earlier results
            });
        }
        final = scoredFinal;
    }

    return enrich
        ? apply_enrich.call(this, final)
        : final;
}
