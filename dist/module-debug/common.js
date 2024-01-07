export function parse_option(value, default_value) {

    return "undefined" != typeof value ? value : default_value;
}

/**
 * @param {!number} count
 * @returns {Array<Object>}
 */

export function create_object_array(count) {

    const array = Array(count);

    for (let i = 0; i < count; i++) {

        array[i] = create_object();
    }

    return array;
}

export function create_arrays(count) {

    const array = Array(count);

    for (let i = 0; i < count; i++) {

        array[i] = [];
    }

    return array;
}

/**
 * @param {!Object} obj
 * @returns {Array<string>}
 */

export function get_keys(obj) {

    return Object.keys(obj);
}

export function create_object() {

    return Object.create(null);
}

export function concat(arrays) {

    return [].concat.apply([], arrays);
}

export function sort_by_length_down(a, b) {

    return b.length - a.length;
}

export function is_array(val) {

    return val.constructor === Array;
}

export function is_string(val) {

    return "string" == typeof val;
}

export function is_object(val) {

    return "object" == typeof val;
}

export function is_function(val) {

    return "function" == typeof val;
}