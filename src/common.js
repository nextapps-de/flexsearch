/**
 * @param {*} val
 * @returns {boolean}
 */

export function is_string(val){

    return typeof val === "string";
}

/**
 * @param {*} val
 * @returns {boolean}
 */

export function is_array(val){

    return val.constructor === Array;
}

/**
 * @param {*} val
 * @returns {boolean}
 */

export function is_function(val){

    return typeof val === "function";
}

/**
 * @param {*} val
 * @returns {boolean}
 */

export function is_object(val){

    return typeof val === "object";
}

/**
 * @param {*} val
 * @returns {boolean}
 */

export function is_undefined(val){

    return typeof val === "undefined";
}

/**
 * @param {!Object} obj
 * @returns {Array<string>}
 */

export function get_keys(obj){

    return Object.keys(obj);
}

/**
 * https://jsperf.com/comparison-object-index-type
 * @param {number} count
 * @returns {Object|Array<Object>}
 */

export function create_object_array(count){

    const array = new Array(count);

    for(let i = 0; i < count; i++){

        array[i] = create_object();
    }

    return array;
}

export function create_object(){

    return Object.create(null);
}

/**
 * @param {!string} str
 * @param {RegExp|Array} regexp
 * @returns {string}
 */

export function replace(str, regexp/*, replacement*/){

    //if(is_undefined(replacement)){

    for(let i = 0, len = /** @type {Array} */ (regexp).length; i < len; i += 2){

        str = str.replace(regexp[i], regexp[i + 1]);
    }

    return str;
    // }
    // else{
    //
    //     return str.replace(/** @type {!RegExp} */ (regex), replacement || "");
    // }
}

/**
 * @param {!string} str
 * @returns {RegExp}
 */

export function regex(str){

    return new RegExp(str, "g");
}

/**
 * Regex: replace(/(?:(\w)(?:\1)*)/g, "$1")
 * @param {!string} string
 * @returns {string}
 */

export function collapse(string){

    let final = "", prev = "";

    for(let i = 0, len = string.length, char; i < len; i++){

        if((char = string[i]) !== prev){

            final += (prev = char);
        }
    }

    return final;
}

// const chars = {a:1, e:1, i:1, o:1, u:1, y:1};
//
// function collapse_repeating_chars(string){
//
//     let collapsed_string = "",
//         char_prev = "",
//         char_next = "";
//
//     for(let i = 0; i < string.length; i++){
//
//         const char = string[i];
//
//         if(char !== char_prev){
//
//             if(i && (char === "h")){
//
//                 if((chars[char_prev] && chars[char_next]) || (char_prev === " ")){
//
//                     collapsed_string += char;
//                 }
//             }
//             else{
//
//                 collapsed_string += char;
//             }
//         }
//
//         char_next = (
//
//             (i === (string.length - 1)) ?
//
//                 ""
//             :
//                 string[i + 1]
//         );
//
//         char_prev = char;
//     }
//
//     return collapsed_string;
// }