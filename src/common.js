import FlexSearch from "./flexsearch.js";

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
 * @param {!number} count
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
 * @param {Array} regexp
 * @returns {string}
 */

export function replace(str, regexp){

    for(let i = 0, len = regexp.length; i < len; i += 2){

        str = str.replace(regexp[i], regexp[i + 1]);

        if(!str){

            break;
        }
    }

    return str;
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

// TODO using fast-swap
export function filter(words, map){

    const length = words.length;
    const filtered = [];

    for(let i = 0, count = 0; i < length; i++){

        const word = words[i];

        if(word && !map[word]){

            filtered[count++] = word;
        }
    }

    return filtered;
}

/**
 * @param {!string} str
 * @param {boolean|Array<string|RegExp>=} normalize
 * @param {boolean|string|RegExp=} split
 * @param {boolean=} _collapse
 * @returns {string|Array<string>}
 */

FlexSearch.prototype.pipeline = function(str, normalize, split, _collapse){

    if(str){

        if(normalize && str){

            str = replace(str, /** @type {Array<string|RegExp>} */ (normalize));
        }

        if(str && this.matcher){

            str = replace(str, this.matcher);
        }

        if(this.stemmer && str.length > 1){

            str = replace(str, this.stemmer);
        }

        if(_collapse && str.length > 1){

            str = collapse(str);
        }

        if(str){

            if(split || (split === "")){

                const words = str.split(/** @type {string|RegExp} */ (split));

                return this.filter ? filter(words, this.filter) : words;
            }
        }
    }

    return str;
};

// export function pipeline(str, normalize, matcher, stemmer, split, _filter, _collapse){
//
//     if(str){
//
//         if(normalize && str){
//
//             str = replace(str, normalize);
//         }
//
//         if(matcher && str){
//
//             str = replace(str, matcher);
//         }
//
//         if(stemmer && str.length > 1){
//
//             str = replace(str, stemmer);
//         }
//
//         if(_collapse && str.length > 1){
//
//             str = collapse(str);
//         }
//
//         if(str){
//
//             if(split !== false){
//
//                 str = str.split(split);
//
//                 if(_filter){
//
//                     str = filter(str, _filter);
//                 }
//             }
//         }
//     }
//
//     return str;
// }

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