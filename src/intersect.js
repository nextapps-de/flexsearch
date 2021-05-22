import { create_object, concat } from "./common.js";

/**
 * @param arrays
 * @param limit
 * @param offset
 * @param {boolean|Array=} suggest
 * @returns {Array}
 */

export function intersect(arrays, limit, offset, suggest) {

    const length = arrays.length;
    let result = [];

    // arrays.sort(function(a, b){
    //
    //     return a.length - b.length;
    // });

    let check;
    let count = 0;

    if(suggest){

        suggest = [];
    }

    // terms in reversed order!
    for(let x = length - 1; x >= 0; x--){

        const word_arr = arrays[x];
        const word_arr_len = word_arr.length;
        const new_check = create_object();

        let found = !check;

        // but relevance in forward order
        for(let y = 0; y < word_arr_len; y++){

            //const arr = [].concat.apply([], word_arr);
            const arr = word_arr[y];
            const arr_len = arr.length;

            if(arr_len){

                // ids
                for(let z = 0, count_suggest = 0, id; z < arr_len; z++){

                    id = arr[z];

                    if(!check){

                        new_check[id] = 1;
                    }
                    else if(check[id]){

                        if(!x){

                            if(offset){

                                offset--;
                            }
                            else{

                                result[count++] = id;

                                if(count === limit){

                                    // fast path "end reached"

                                    return result;
                                }
                            }
                        }
                        else{

                            if(suggest && (count_suggest < limit)){

                                const tmp = suggest[y] || (suggest[y] = []);

                                tmp[count_suggest++] = id;
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

            if(len && offset){

                if(len <= offset){

                    offset -= len;
                    len = 0;
                }
                else{

                    len -= offset;
                }
            }

            if(len){

                if(count + len >= limit){

                    return result.concat(res.slice(offset, limit - count + offset));
                }
                else{

                    result = result.concat(offset ? res.slice(offset) : res);
                    count += len;
                    offset = 0;
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