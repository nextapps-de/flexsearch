/**
 * @param {*} value
 * @param {*} default_value
 * @param {*=} merge_value
 * @return {*}
 */
export function merge_option(value, default_value, merge_value){

    const type_merge = typeof merge_value;
    const type_value = typeof value;

    if(type_merge !== "undefined"){
        if(type_value !== "undefined"){

            if(merge_value){
                if(type_value === "function" &&
                   type_merge === type_value){
                    return function(str){
                        return /** @type Function */ (value)(
                            /** @type Function */ (merge_value)(str)
                        );
                    }
                }

                const constructor_value = value.constructor;
                const constructor_merge = merge_value.constructor;

                if(constructor_value === constructor_merge){

                    if(constructor_value === Array){
                        return merge_value.concat(value);
                    }

                    if(constructor_value === Map){
                        const map = new Map(/** @type !Map */ (merge_value));
                        for(const item of /** @type !Map */ (value)){
                            const key = item[0];
                            const val = item[1];
                            map.set(key, val);
                        }
                        return map;
                    }

                    if(constructor_value === Set){
                        const set = new Set(/** @type !Set */ (merge_value));
                        for(const val of /** @type !Set */ (value).values()){
                            set.add(val);
                        }
                        return set;
                    }
                }
            }

            return value;
        }
        else{
            return merge_value;
        }
    }

    return type_value === "undefined"
        ? default_value
        : value;
}


export function inherit(target_value, default_value){
    return typeof target_value === "undefined"
        ? default_value
        : target_value;
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

export function sort_by_length_up(a, b){
    return a.length - b.length;
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

/**
 * @param {Map|Set} val
 * @param {boolean=} stringify
 * @return {Array}
 */

export function toArray(val, stringify){
    const result = [];
    for(const key of val.keys()){
        result.push(stringify ?  "" + key : key);
    }
    return result;
}

// TODO support generic function created from string when tree depth > 1
export function parse_simple(obj, tree){

    if(is_string(tree)){
        obj = obj[tree];
    }
    else for(let i = 0; obj && (i < tree.length); i++){
        obj = obj[tree[i]];
    }

    return obj;
}

export function get_max_len(arr){
    let len = 0;
    for(let i = 0, res; i < arr.length; i++){
        if((res = arr[i])){
            if(len < res.length){
                len = res.length;
            }
        }
    }
    return len;
}