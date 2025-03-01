export function parse_option(value, default_value, merge_value){

    if(typeof merge_value !== "undefined"){
        if(typeof value !== "undefined"){

            if(merge_value){
                if(typeof value === "function" &&
                    typeof merge_value === "function"){
                    return function(str){
                        return value(
                            merge_value(str)
                        );
                    }
                }

                if(value.constructor === Array &&
                    merge_value.constructor === Array){
                    return merge_value.concat(value);
                }

                if(value.constructor === Map &&
                    merge_value.constructor === Map){
                    // todo replace spread
                    return new Map([...merge_value, ...value]);
                }

                if(value.constructor === Set &&
                    merge_value.constructor === Set){
                    // todo replace spread
                    return new Set([...merge_value, ...value]);
                }
            }

            return value;
        }
        else{
            return merge_value;
        }
    }

    return typeof value === "undefined"
        ? default_value
        : value;
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

/**
 * @param {!number} count
 * @returns {Array<Object>}
 */

export function create_map_array(count){

    const array = new Array(count);

    for(let i = 0; i < count; i++){

        array[i] = new Map();
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

/**
 * @param {!Object} obj
 * @returns {Array<string>}
 */

export function get_keys(obj){

    return Object.keys(obj);
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

export function is_array(val){

    return val.constructor === Array;
}

export function is_string(val){

    return typeof val === "string";
}

export function is_object(val){

    return typeof val === "object";
}

export function is_function(val){

    return typeof val === "function";
}

export function toArray(val){
    const result = [];
    for(const key of val.keys()){
        result.push(key);
    }
    return result;
}