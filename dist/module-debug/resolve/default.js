import { concat } from "../common.js";

/*
 from -> res[score][id]
 to   -> [id]
*/

/**
 * Aggregate the union of a single raw result
 * @param {!Array} result
 * @param {!number} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 * @return Array<string|number>
 */

export default function (result, limit, offset, enrich) {

    // fast path: when there is just one slot in the result
    if (1 === result.length) {
        result = result[0];
        result = offset || result.length > limit ? limit ? result.slice(offset, offset + limit) : result.slice(offset) : result;
        return enrich ? enrich_result(result) : result;
    }

    let final = [];

    // this is a workaround without using arr.concat.apply

    // for(let i = 0, arr, len; i < result.length; i++){
    //     if((arr = result[i])){
    //         if((len = arr.length)){
    //             for(let j = offset; j < len; j++){
    //                 final.push(arr[j]);
    //                 if(final.length === limit){
    //                     return enrich
    //                         ? enrich_result(final)
    //                         : final;
    //                 }
    //             }
    //             if((offset -= len) < 0){
    //                 offset = 0;
    //             }
    //         }
    //     }
    // }

    // this is an optimized workaround instead of
    // just doing result = concat(result)

    for (let i = 0, arr, len; i < result.length; i++) {
        if (!(arr = result[i]) || !(len = arr.length)) continue;

        if (offset) {
            // forward offset pointer
            if (offset >= len) {
                offset -= len;
                continue;
            }
            // apply offset pointer when length differs
            if (offset < len) {
                arr = limit ? arr.slice(offset, offset + limit) : arr.slice(offset);
                len = arr.length;
                offset = 0;
            }
        }

        if (!final.length) {
            // fast path: when limit was reached in first slot
            if (len >= limit) {
                if (len > limit) {
                    arr = arr.slice(0, limit);
                }
                return enrich ? enrich_result(arr) : arr;
            }
        } else {
            if (len > limit) {
                arr = arr.slice(0, limit);
                len = arr.length;
            }
        }

        final.push(arr);
        limit -= len;

        // todo remove
        // if(limit < 0){
        //     throw new Error("Impl.Error");
        // }

        // break if limit was reached
        if (!limit) {
            break;
        }
    }

    // todo remove
    if (!final.length) {
        //throw new Error("No results found");
        return final;
    }

    final = 1 < final.length ? concat(final) : final[0];

    return enrich ? enrich_result(final) : final;
}

function enrich_result(ids) {
    for (let i = 0; i < ids.length; i++) {
        ids[i] = {
            score: i,
            id: ids[i]
        };
    }
    return ids;
}