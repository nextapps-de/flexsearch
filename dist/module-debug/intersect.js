import { create_object, concat, sort_by_length_up, get_max_len } from "./common.js";

/*

 from -> result[
    res[score][id],
    res[score][id],
 ]

 to -> [id]

 */

/**
 * Implementation based on Object[key] provides better suggestions
 * capabilities and has less performance scaling issues on large indexes.
 *
 * @param arrays
 * @param limit
 * @param offset
 * @param {boolean|Array=} suggest
 * @param {boolean=} resolve
 * @returns {Array}
 */

export function intersect(arrays, limit, offset, suggest) {

    const length = arrays.length;

    // todo remove
    // if(length < 2){
    //     throw new Error("Not optimized intersect");
    // }

    let result = [],
        size = 0,
        check,
        check_suggest,
        check_new,
        res_arr;


    if (suggest) {
        suggest = [];
    }

    // 1. a reversed order prioritize the order of words from a query
    //    because it ends with the first term.
    // 2. process terms in reversed order often has advantage for
    //    the fast path "end reached".

    // alternatively the results could be sorted by length up
    //arrays.sort(sort_by_length_up);

    // todo the outer loop should be the res array instead of term array,
    // this isn't just simple because the intersection calculation needs to reflect this
    //const maxlen = get_max_len(arrays);

    for (let x = length - 1, found; 0 <= x; x--) {
        //for(let x = 0, found; x < length; x++){

        res_arr = arrays[x];
        check_new = create_object();
        found = !check;

        // process relevance in forward order (direction is
        // important for adding IDs during the last round)

        for (let y = 0, ids; y < res_arr.length; y++) {

            ids = res_arr[y];
            if (!ids || !ids.length) continue;

            for (let z = 0, id; z < ids.length; z++) {

                id = ids[z];

                // check exists starting from the 2nd slot
                if (check) {
                    if (check[id]) {

                        // check if in last round
                        if (!x) {
                            //if(x === length - 1){

                            if (offset) {
                                offset--;
                            } else {

                                result[size++] = id;

                                if (size === limit) {
                                    // fast path "end reached"
                                    return result; /*resolve === false
                                                   ? { result, suggest }
                                                   :*/
                                }
                            }
                        }

                        if (x || suggest) {
                            //if((x < length - 1) || suggest){
                            check_new[id] = 1;
                        }

                        found = /* tag? */ /* stringify */ /* stringify */ /* skip update: */ /* append: */ /* skip update: */ /* skip_update: */ /* skip deletion */!0 /*await rows.hasNext()*/ /*await rows.hasNext()*/ /*await rows.hasNext()*/;
                    }

                    if (suggest) {

                        if (!check_suggest[id]) {
                            check_suggest[id] = 1;
                            const arr = suggest[y] || (suggest[y] = []);
                            arr.push(id);
                        }

                        // OLD:
                        //
                        // check_idx = (check_suggest[id] || 0) + 1;
                        // check_suggest[id] = check_idx;
                        //
                        // // do not adding IDs which are already included in the result (saves one loop)
                        // // the first intersection match has the check index 2, so shift by -2
                        //
                        // if(check_idx < length){
                        //
                        //     const tmp = suggest[check_idx - 2] || (suggest[check_idx - 2] = []);
                        //     tmp[tmp.length] = id;
                        // }
                    }
                } else {

                    // pre-fill in first round
                    check_new[id] = 1;
                }
            }
        }

        if (suggest) {

            // re-use the first pre-filled check for suggestions
            check || (check_suggest = check_new);
        } else if (!found) {

            return [];
        }

        check = check_new;
    }

    // return intermediate result
    // if(resolve === false){
    //     return { result, suggest };
    // }

    if (suggest) {

        // needs to iterate in reverse direction
        for (let x = suggest.length - 1, ids, len; 0 <= x; x--) {

            ids = suggest[x];
            len = ids.length;

            for (let y = 0, id; y < len; y++) {

                id = ids[y];

                if (!check[id]) {

                    if (offset) {
                        offset--;
                    } else {

                        result[size++] = id;

                        if (size === limit) {
                            // fast path "end reached"
                            return result;
                        }
                    }

                    check[id] = 1;
                }
            }
        }
    }

    return result;
}

/**
 * @param mandatory
 * @param arrays
 * @returns {Array}
 */

export function intersect_union(mandatory, arrays) {
    const check = create_object(),
          union = create_object(),
          result = [];


    for (let x = 0; x < mandatory.length; x++) {

        check[mandatory[x]] = 1;
    }

    for (let x = 0, arr; x < arrays.length; x++) {

        arr = arrays[x];

        for (let y = 0, id; y < arr.length; y++) {

            id = arr[y];

            if (check[id]) {

                if (!union[id]) {

                    union[id] = 1;
                    result.push(id);
                }
            }
        }
    }

    return result;
}

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