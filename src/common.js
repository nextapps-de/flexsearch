//import FlexSearch from "./flexsearch.js";

/**
 * @param {!Object} obj
 * @returns {Array<string>}
 */

export function get_keys(obj){

    return Object.keys(obj);
}

/**
 * @param {!number} count
 * @returns {Array<Object>}
 */

export function create_object_array(count){

    const array = new Array(count);

    for(let i = 0; i < count; i++){

        array[i] = create_object();
    }

    return array;
}

export function create_arrays(count){

    const array = new Array(count);

    for(let i = 0; i < count; i++){

        array[i] = [];
    }

    return array;
}

export function create_object(){

    return Object.create(null);
}

export function concat(arrays){

    return [].concat.apply([], arrays);
}

export function sort_by_length_down(a, b){

    return b.length - a.length;
}