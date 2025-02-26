import { concat, create_object } from "../common.js";


/*
 from -> res[score][id]
 to   -> [id]
*/

/**
 * Aggregate the union of a single raw result
 * @param result
 * @param limit
 * @param offset
 * @param enrich
 * @return {*|*[]}
 */

export default function(result, limit = 0, offset = 0, enrich){

    // fast path: when there is just one slot in the result
    if(result.length === 1){
        result = result[0];
        return offset || (result.length > limit)
            ? (limit
                ? result.slice(offset, offset + limit)
                : result.slice(offset)
            )
            : result;
    }

    let final = [];

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

        if(!final.length){
            // fast path: when limit was reached in first slot
            if(len === limit){
                return arr;
            }
            // fast path: when limit was reached in first slot
            if(len > limit){
                return arr.slice(0, limit);
            }
            final = [arr];
        }
        else{
            if(len > limit){
                arr = arr.slice(0, limit);
                len = arr.length;
            }
            final.push(arr);
        }

        // reduce limit
        limit -= len;

        // todo remove
        if(limit < 0){
            throw new Error("Impl.Error");
        }

        // break if limit was reached
        if(!limit){
            break;
        }
    }

    // todo remove
    if(!final.length){
        //throw new Error("No results found");
        return final;
    }

    return final.length > 1
        ? concat(final)
        : final[0];
}