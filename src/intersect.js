import { create_object, concat } from "./common.js";

/**
 * Implementation based on Array.indexOf()
 * @param arrays
 * @param limit
 * @param offset
 * @param {boolean|Array=} suggest
 * @returns {Array}
 */

export function intersect(arrays, limit, offset, suggest) {

    const length = arrays.length;
    let result = [];
    let check;

    // determine shortest array and collect results
    // from the sparse relevance arrays

    let smallest_size;
    let smallest_arr;
    let smallest_index;

    for(let x = 0; x < length; x++){

        const arr = arrays[x];
        const len = arr.length;

        let size = 0;

        for(let y = 0, tmp; y < len; y++){

            tmp = arr[y];

            if(tmp){

                size += tmp.length;
            }
        }

        if(!smallest_size || (size < smallest_size)){

            smallest_size = size;
            smallest_arr = arr;
            smallest_index = x;
        }
    }

    smallest_arr = smallest_arr.length === 1 ?

        smallest_arr[0]
    :
        concat(smallest_arr);

    if(suggest){

        suggest = [smallest_arr];
        check = create_object();
    }

    let size = 0;
    let steps = 0;

    // TODO: the first word should be processed in the last round?

    // process terms in reversed order often results in better performance
    // the outer loop must be the words array,
    // using the smallest array here disables the "fast fail" optimization

    for(let x = length - 1; x >= 0; x--){

        if(x !== smallest_index){

            steps++;

            const word_arr = arrays[x];
            const word_arr_len = word_arr.length;
            const new_arr = [];

            let count = 0;

            for(let z = 0, id; z < smallest_arr.length; z++){

                id = smallest_arr[z];

                let found;

                // process relevance in forward order (direction is
                // important for the "fill" during the last round)

                for(let y = 0; y < word_arr_len; y++){

                    const arr = word_arr[y];

                    if(arr.length){

                        found = arr.indexOf(id) !== -1;

                        if(found){

                            // check if in last round

                            if(steps === length - 1){

                                if(offset){

                                    offset--;
                                }
                                else{

                                    result[size++] = id;

                                    if(size === limit){

                                        // fast path "end reached"

                                        return result;
                                    }
                                }

                                if(suggest){

                                    check[id] = 1;
                                }
                            }

                            break;
                        }
                    }
                }

                if(found){

                    new_arr[count++] = id;
                }
            }

            if(suggest){

                suggest[steps] = new_arr;
            }
            else if(!count){

                return [];
            }

            smallest_arr = new_arr;
        }
    }

    if(suggest){

        // has to iterate in reverse direction

        for(let x = suggest.length - 1, arr, len; x >= 0; x--){

            arr = suggest[x];
            len = arr && arr.length;

            if(len){

                for(let y = 0, id; y < len; y++){

                    id = arr[y];

                    if(!check[id]){

                        check[id] = 1;

                        if(offset){

                            offset--;
                        }
                        else{

                            result[size++] = id;

                            if(size === limit){

                                // fast path "end reached"

                                return result;
                            }
                        }
                    }
                }
            }
        }
    }

    return result;
}

/**
 * Implementation based on Object[key]
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
//
//     // arrays.sort(function(a, b){
//     //
//     //     return a.length - b.length;
//     // });
//
//     let check;
//     let count = 0;
//
//     if(suggest){
//
//         suggest = [];
//     }
//
//     // terms in reversed order!
//     for(let x = length - 1; x >= 0; x--){
//
//         const word_arr = arrays[x];
//         const word_arr_len = word_arr.length;
//         const new_check = create_object();
//
//         let found = !check;
//
//         // relevance in forward order
//         for(let y = 0, count_suggest = 0; y < word_arr_len; y++){
//
//             //const arr = [].concat.apply([], word_arr);
//             const arr = word_arr[y];
//             const arr_len = arr.length;
//
//             if(arr_len){
//
//                 // ids
//                 for(let z = 0, id; z < arr_len; z++){
//
//                     id = arr[z];
//
//                     if(!check){
//
//                         new_check[id] = 1;
//                     }
//                     else if(check[id]){
//
//                         if(!x){
//
//                             if(offset){
//
//                                 offset--;
//                             }
//                             else{
//
//                                 result[count++] = id;
//
//                                 if(count === limit){
//
//                                     // fast path "end reached"
//
//                                     return result;
//                                 }
//                             }
//                         }
//                         else{
//
//                             if(suggest && (count_suggest < limit)){
//
//                                 const tmp = suggest[y] || (suggest[y] = []);
//                                 tmp[tmp.length] = id;
//                                 count_suggest++;
//                             }
//
//                             new_check[id] = 1;
//                         }
//
//                         found = true;
//                     }
//                 }
//             }
//         }
//
//         if(!found && !suggest){
//
//             return [];
//         }
//
//         check = new_check;
//     }
//
//     if(suggest){
//
//         for(let i = suggest.length - 1, res, len; i >= 0; i--){
//
//             res = suggest[i];
//             len = res && res.length;
//
//             if(len && offset){
//
//                 if(len <= offset){
//
//                     offset -= len;
//                     len = 0;
//                 }
//                 else{
//
//                     len -= offset;
//                 }
//             }
//
//             if(len){
//
//                 if(count + len >= limit){
//
//                     return result.concat(res.slice(offset, limit - count + offset));
//                 }
//                 else{
//
//                     result = result.concat(offset ? res.slice(offset) : res);
//                     count += len;
//                     offset = 0;
//                 }
//             }
//         }
//     }
//
//     return result;
// }

/**
 * @param mandatory
 * @param arrays
 * @returns {Array}
 */

export function intersect_union(mandatory, arrays) {

    const check = create_object();
    const union = create_object();
    const result = [];

    for(let x = 0; x < mandatory.length; x++){

        check[mandatory[x]] = 1;
    }

    for(let x = 0, arr; x <  arrays.length; x++){

        arr = arrays[x];

        for(let y = 0, id; y < arr.length; y++){

            id = arr[y];

            if(check[id]){

                if(!union[id]){

                    union[id] = 1;
                    result[result.length] = id;
                }
            }
        }
    }

    return result;
}