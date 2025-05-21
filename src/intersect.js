// COMPILER BLOCK -->
import { SUPPORT_RESOLVER } from "./config.js";
// <-- COMPILER BLOCK
import Resolver from "./resolver.js";
import { create_object, concat, sort_by_length_up, get_max_len } from "./common.js";
import { SearchResults, IntermediateSearchResults } from "./type.js";

/*

 from -> result[
    res[score][id],
    res[score][id],
 ]

 to -> [id]

*/

/**
 * @param {!Array<IntermediateSearchResults>} arrays
 * @param {number} resolution
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} suggest
 * @param {number=} boost
 * @param {boolean=} resolve
 * @returns {SearchResults|IntermediateSearchResults}
 */
export function intersect(arrays, resolution, limit, offset, suggest, boost, resolve) {

    const length = arrays.length;

    /** @type {Array<SearchResults|IntermediateSearchResults>} */
    let result = [];
    let check;
    let count;

    // alternatively the results could be sorted by length up
    //arrays.sort(sort_by_length_up);

    check = create_object();

    for(let y = 0, ids, id, res_arr, tmp; y < resolution; y++){

        for(let x = 0; x < length; x++){

            res_arr = arrays[x];

            if(y < res_arr.length && (ids = res_arr[y])){

                for(let z = 0; z < ids.length; z++){

                    id = ids[z];

                    // todo the persistent implementation will count term matches
                    //      and also aggregate the score (group by id)
                    //      min(score): suggestions off (already covered)
                    //      sum(score): suggestions on (actually not covered)

                    if((count = check[id])){
                        check[id]++;
                        // tmp.count++;
                        // tmp.sum += y;
                    }
                    else{
                        count = 0;
                        check[id] = 1;
                        // check[id] = {
                        //     count: 1,
                        //     sum: y
                        // };
                    }

                    tmp = result[count] || (result[count] = []);

                    if(SUPPORT_RESOLVER && !resolve){
                        // boost everything after first result
                        let score = y + (x || !suggest ? 0 : boost || 0);
                        tmp = tmp[score] || (tmp[score] = []);
                    }

                    tmp.push(id);

                    // fast path early result when limit was set
                    if(!SUPPORT_RESOLVER || resolve){
                        if(limit && (count === length - 1)){
                            if(tmp.length - offset === limit){
                                return offset
                                    ? tmp.slice(offset)
                                    : tmp;
                            }
                        }
                    }
                    // todo break early on suggest: true
                }
            }
        }
    }

    // result.sort(function(a, b){
    //     return check[a] - check[b];
    // });

    const result_len = result.length;

    if(result_len){

        if(!suggest){

            if(result_len < length){
                return [];
            }

            result = /** @type {SearchResults|IntermediateSearchResults} */ (
                result[result_len - 1]
            );

            if(limit || offset){
                if(!SUPPORT_RESOLVER || resolve){
                    if((result.length > limit) || offset){
                        result = result.slice(offset, limit + offset);
                    }
                }
                else{
                    // todo this is doing the same as Resolver.resolve({limit}) ?
                    // todo check limit + offset when resolve = false
                    const final = [];
                    for(let i = 0, arr; i < result.length; i++){
                        arr = result[i];
                        if(!arr) continue;
                        if(offset && arr.length > offset){
                            offset -= arr.length;
                            continue;
                        }
                        if((limit && arr.length > limit) || offset){
                            arr = arr.slice(offset, limit + offset);
                            limit -= arr.length;
                            if(offset) offset -= arr.length;
                        }
                        final.push(arr);
                        if(!limit){
                            break;
                        }
                    }
                    result = final
                    // result = final.length > 1
                    //     ? concat(final)
                    //     : final[0];
                }

                // return /** @type {SearchResults|IntermediateSearchResults} */ (
                //     result
                // );
            }
        }
        else{

            result = result.length > 1
                ? union(result, limit, offset, resolve, boost)
                : ((result = result[0]) && limit && result.length > limit) || offset
                    ? result.slice(offset, limit + offset)
                    : result;

        }
    }

    return /** @type {SearchResults|IntermediateSearchResults} */ (
        result
    );
}

/**
 * @param {Array<SearchResults|IntermediateSearchResults>} arrays
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} resolve
 * @param {number=} boost
 * @returns {SearchResults|IntermediateSearchResults}
 */
export function union(arrays, limit, offset, resolve, boost){

    /** @type {SearchResults|IntermediateSearchResults} */
    const result = [];
    const check = create_object();
    let ids, id, arr_len = arrays.length, ids_len;

    //let maxres = get_max_len(arrays);

    if(SUPPORT_RESOLVER && !resolve){

        for(let i = arr_len - 1, res, count = 0; i >= 0; i--){

            res = arrays[i];

            for(let k = 0; k < res.length; k++){

                ids = res[k];
                ids_len = ids && ids.length;

                if(ids_len) for(let j = 0; j < ids_len; j++){

                    id = ids[j];

                    if(!check[id]){
                        check[id] = 1;
                        if(offset){
                            offset--;
                        }
                        else{
                            // adjust score to reduce resolution of suggestions
                            // todo: instead of applying the resolve task directly it could
                            //       be added to the chain and resolved later, that will keep
                            //       the original score but also can't resolve early when
                            //       nothing was found
                            let score = (k + (i < arr_len - 1 ? boost || 0 : 0)) / (i + 1) | 0;
                            let arr = result[score] || (result[score] = []);
                            arr.push(id);
                            if(++count === limit){
                                return result;
                            }
                        }
                    }
                }
            }
        }
    }
    else for(let i = arr_len - 1; i >= 0; i--){

        ids = arrays[i];
        ids_len = ids && ids.length;

        if(ids_len) for(let j = 0; j < ids_len; j++){

            id = ids[j];

            if(!check[id]){
                check[id] = 1;
                if(offset){
                    offset--;
                }
                else{
                    result.push(id);
                    if(result.length === limit){
                        return result;
                    }
                }
            }
        }
    }

    return result;
}

/**
 * @param {SearchResults|IntermediateSearchResults|Resolver} arrays
 * @param {Array<SearchResults>} mandatory
 * @param {boolean=} resolve
 * @returns {SearchResults}
 */
export function intersect_union(arrays, mandatory, resolve) {

    const check = create_object();
    /** @type {SearchResults|IntermediateSearchResults} */
    const result = [];

    for(let x = 0, ids; x < mandatory.length; x++){
        ids = mandatory[x];
        for(let i = 0; i < ids.length; i++){
            check[ids[i]] = 1;
        }
    }

    if(!SUPPORT_RESOLVER || resolve){
        for(let i = 0, id; i < arrays.length; i++){
            id = arrays[i];
            if(check[id]){
                result.push(id);
                check[id] = 0;
            }
        }
    }
    else{
        for(let i = 0, ids, id; i < arrays.result.length; i++){
            ids = arrays.result[i];
            for(let j = 0; j < ids.length; j++){
                id = ids[j];
                if(check[id]){
                    const arr = result[i] || (result[i] = []);
                    arr.push(id);
                    check[id] = 0;
                }
            }
        }
    }

    return result;
}

// export function intersect_union(mandatory, arrays, resolution) {
//
//     const check = create_object();
//     const union = create_object();
//     const result = [];
//
//     for(let x = 0; x < mandatory.length; x++){
//         check[mandatory[x]] = 1;
//     }
//
//
//     for(let y = 0, ids, id; y < resolution; y++){
//         for(let x = 0; x < arrays.length; x++){
//
//             ids = arrays[x];
//
//             if(y < ids.length){
//
//                 id = ids[y];
//
//                 if(check[id]){
//
//                     if(!union[id]){
//
//                         union[id] = 1;
//                         result.push(id);
//                     }
//                 }
//             }
//         }
//     }
//
//     return result;
// }

//
// /**
//  * Implementation based on Object[key] provides better suggestions
//  * capabilities and has less performance scaling issues on large indexes.
//  *
//  * @param arrays
//  * @param limit
//  * @param offset
//  * @param {boolean|Array=} suggest
//  * @param {boolean=} resolve
//  * @returns {Array}
//  */
//
// export function intersect(arrays, limit, offset, suggest, resolve) {
//
//     const length = arrays.length;
//
//     // todo remove
//     // if(length < 2){
//     //     throw new Error("Not optimized intersect");
//     // }
//
//     let result = [];
//     let size = 0;
//     let check;
//     let check_suggest;
//     let check_new;
//     let res_arr;
//
//     if(suggest){
//         suggest = [];
//     }
//
//     // 1. a reversed order prioritize the order of words from a query
//     //    because it ends with the first term.
//     // 2. process terms in reversed order often has advantage for
//     //    the fast path "end reached".
//
//     // alternatively the results could be sorted by length up
//     //arrays.sort(sort_by_length_up);
//
//     // todo the outer loop should be the res array instead of term array,
//     // this isn't just simple because the intersection calculation needs to reflect this
//     //const maxlen = get_max_len(arrays);
//
//     for(let x = length - 1, found; x >= 0; x--){
//     //for(let x = 0, found; x < length; x++){
//
//         res_arr = arrays[x];
//         check_new = create_object();
//         found = !check;
//
//         // process relevance in forward order (direction is
//         // important for adding IDs during the last round)
//
//         for(let y = 0, ids; y < res_arr.length; y++){
//
//             ids = res_arr[y];
//             if(!ids || !ids.length) continue;
//
//             for(let z = 0, id; z < ids.length; z++){
//
//                 id = ids[z];
//
//                 // check exists starting from the 2nd slot
//                 if(check){
//                     if(check[id]){
//
//                         // check if in last round
//                         if(!x){
//                         //if(x === length - 1){
//
//                             if(offset){
//                                 offset--;
//                             }
//                             else{
//
//                                 result[size++] = id;
//
//                                 if(size === limit){
//                                     // fast path "end reached"
//                                     return result /*resolve === false
//                                         ? { result, suggest }
//                                         :*/
//                                 }
//                             }
//                         }
//
//                         if(x || suggest){
//                         //if((x < length - 1) || suggest){
//                             check_new[id] = 1;
//                         }
//
//                         found = true;
//                     }
//
//                     if(suggest){
//
//                         if(!check_suggest[id]){
//                             check_suggest[id] = 1;
//                             const arr = suggest[y] || (suggest[y] = []);
//                             arr.push(id);
//                         }
//
//                         // OLD:
//                         //
//                         // check_idx = (check_suggest[id] || 0) + 1;
//                         // check_suggest[id] = check_idx;
//                         //
//                         // // do not adding IDs which are already included in the result (saves one loop)
//                         // // the first intersection match has the check index 2, so shift by -2
//                         //
//                         // if(check_idx < length){
//                         //
//                         //     const tmp = suggest[check_idx - 2] || (suggest[check_idx - 2] = []);
//                         //     tmp[tmp.length] = id;
//                         // }
//                     }
//                 }
//                 else{
//
//                     // pre-fill in first round
//                     check_new[id] = 1;
//                 }
//             }
//         }
//
//         if(suggest){
//
//             // re-use the first pre-filled check for suggestions
//             check || (check_suggest = check_new);
//         }
//         else if(!found){
//
//             return [];
//         }
//
//         check = check_new;
//     }
//
//     // return intermediate result
//     // if(resolve === false){
//     //     return { result, suggest };
//     // }
//
//     if(suggest){
//
//         // needs to iterate in reverse direction
//         for(let x = suggest.length - 1, ids, len; x >= 0; x--){
//
//             ids = suggest[x];
//             len = ids.length;
//
//             for(let y = 0, id; y < len; y++){
//
//                 id = ids[y];
//
//                 if(!check[id]){
//
//                     if(offset){
//                         offset--;
//                     }
//                     else{
//
//                         result[size++] = id;
//
//                         if(size === limit){
//                             // fast path "end reached"
//                             return result;
//                         }
//                     }
//
//                     check[id] = 1;
//                 }
//             }
//         }
//     }
//
//     return result;
// }

/**
 * Implementation based on Array.includes() provides better performance,
 * but it needs at least one word in the query which is less frequent.
 * Also on large indexes it does not scale well performance-wise.
 * This strategy also lacks of suggestion capabilities (matching & sorting).
 *
 * @param arrays
 * @param limit
 * @param offset
 * @param {boolean|Array=} suggest
 * @returns {Array}
 */

// export function intersect(arrays, limit, offset, suggest) {
//
//     const length = arrays.length;
//     let result = [];
//     let check;
//
//     // determine shortest array and collect results
//     // from the sparse relevance arrays
//
//     let smallest_size;
//     let smallest_arr;
//     let smallest_index;
//
//     for(let x = 0; x < length; x++){
//
//         const arr = arrays[x];
//         const len = arr.length;
//
//         let size = 0;
//
//         for(let y = 0, tmp; y < len; y++){
//
//             tmp = arr[y];
//
//             if(tmp){
//
//                 size += tmp.length;
//             }
//         }
//
//         if(!smallest_size || (size < smallest_size)){
//
//             smallest_size = size;
//             smallest_arr = arr;
//             smallest_index = x;
//         }
//     }
//
//     smallest_arr = smallest_arr.length === 1 ?
//
//         smallest_arr[0]
//     :
//         concat(smallest_arr);
//
//     if(suggest){
//
//         suggest = [smallest_arr];
//         check = create_object();
//     }
//
//     let size = 0;
//     let steps = 0;
//
//     // process terms in reversed order often results in better performance.
//     // the outer loop must be the words array, using the
//     // smallest array here disables the "fast fail" optimization.
//
//     for(let x = length - 1; x >= 0; x--){
//
//         if(x !== smallest_index){
//
//             steps++;
//
//             const word_arr = arrays[x];
//             const word_arr_len = word_arr.length;
//             const new_arr = [];
//
//             let count = 0;
//
//             for(let z = 0, id; z < smallest_arr.length; z++){
//
//                 id = smallest_arr[z];
//
//                 let found;
//
//                 // process relevance in forward order (direction is
//                 // important for adding IDs during the last round)
//
//                 for(let y = 0; y < word_arr_len; y++){
//
//                     const arr = word_arr[y];
//
//                     if(arr.length){
//
//                         found = arr.includes(id);
//
//                         if(found){
//
//                             // check if in last round
//
//                             if(steps === length - 1){
//
//                                 if(offset){
//
//                                     offset--;
//                                 }
//                                 else{
//
//                                     result[size++] = id;
//
//                                     if(size === limit){
//
//                                         // fast path "end reached"
//
//                                         return result;
//                                     }
//                                 }
//
//                                 if(suggest){
//
//                                     check[id] = 1;
//                                 }
//                             }
//
//                             break;
//                         }
//                     }
//                 }
//
//                 if(found){
//
//                     new_arr[count++] = id;
//                 }
//             }
//
//             if(suggest){
//
//                 suggest[steps] = new_arr;
//             }
//             else if(!count){
//
//                 return [];
//             }
//
//             smallest_arr = new_arr;
//         }
//     }
//
//     if(suggest){
//
//         // needs to iterate in reverse direction
//
//         for(let x = suggest.length - 1, arr, len; x >= 0; x--){
//
//             arr = suggest[x];
//             len = arr && arr.length;
//
//             if(len){
//
//                 for(let y = 0, id; y < len; y++){
//
//                     id = arr[y];
//
//                     if(!check[id]){
//
//                         check[id] = 1;
//
//                         if(offset){
//
//                             offset--;
//                         }
//                         else{
//
//                             result[size++] = id;
//
//                             if(size === limit){
//
//                                 // fast path "end reached"
//
//                                 return result;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
//
//     return result;
// }
