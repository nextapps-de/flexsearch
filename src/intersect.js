import { create_object, concat } from "./common.js";

/**
 * @param arrays
 * @param limit
 * @param {boolean|Array=} suggest
 * @returns {Array}
 */

export function intersect(arrays, limit, suggest) {

    const length = arrays.length;
    let result = [];

    // if(!length){
    //
    //     return result;
    // }
    //
    // if(length === 1){
    //
    //     const tmp = arrays[0];
    //
    //     if(tmp.length === 1){
    //
    //         return tmp[0];
    //     }
    //
    //     return concat(tmp);
    // }

    // arrays.sort(function(a, b){
    //
    //     return a.length - b.length;
    // });

    let check = create_object();
    let count = 0;

    if(suggest){

        suggest = [];
    }

    // terms
    for(let x = 0; x < length; x++){

        const word_arr = arrays[x];
        const word_arr_len = word_arr.length;
        const new_check = create_object();

        let found = !x;

        // relevance
        for(let y = 0; y < word_arr_len; y++){

            //const arr = [].concat.apply([], word_arr);
            const arr = word_arr[y];
            const arr_len = arr.length;

            if(arr_len){

                if(suggest){

                    suggest[y] = [];
                }

                // ids
                for(let z = 0, count_suggest = 0, id; z < arr_len; z++){

                    id = arr[z];

                    if(!x){

                        new_check[id] = 1;
                    }
                    else if(check[id]){

                        if(x === (length - 1)){

                            result[count++] = id;

                            if(count === limit){

                                // fast path "end reached"

                                return result;
                            }
                        }
                        else{

                            if(suggest && (count_suggest < limit)){

                                suggest[y][count_suggest++] = id;
                            }

                            new_check[id] = 1;
                        }

                        found = true;
                    }
                }
            }
        }

        if(!found && !suggest){

            return [];
        }

        check = new_check;
    }

    if(suggest){

        for(let i = suggest.length - 1, res, len; i >= 0; i--){

            res = suggest[i];
            len = res && res.length;

            if(len){

                if(count + len >= limit){

                    return result.concat(res.slice(0, limit - count));
                }
                else{

                    result = result.concat(res);
                    count += len;
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