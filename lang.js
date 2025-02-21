import { IndexInterface } from "./type.js";
import { get_keys } from "./common.js";

let timer_encode;
let cache_encode = new Map();

/**
 * @param {!string} str
 * @param {Map<string>=} normalize
 * @param {string|RegExp=} split
 * @param {boolean=} collapse
 * @returns {string|Array<string>}
 * @this IndexInterface
 */

export function pipeline(str, normalize, split, collapse){

    // if(timer_encode){
    //     if(cache_encode.has(str)){
    //         return cache_encode.get(str);
    //     }
    // }
    // else{
    //     timer_encode = setTimeout(function(){
    //         timer_encode = null;
    //         cache_encode.clear();
    //     });
    // }

    if(this.stemmer && (str.length > 2)){
        str = replace(str, this.stemmer);
    }

    if(this.matcher && str){
        str = replace(str, this.matcher);
    }

    // if(_collapse && (str.length > 1)){
    //     str = collapse(str);
    // }

    let words = split || (split === "")
        ? str.split(/** @type {string|RegExp} */ (split))
        : str; //[str];

    // if(normalize){
    //     const arr = [];
    //     for(let i = 0, word; i < words.length; i++){
    //         if((word = words[i])){
    //             if(!this.filter || !this.filter.has(word)){
    //                 word = replace_collapsed(word, normalize);
    //                 word && arr.push(word);
    //             }
    //         }
    //     }
    //     words = arr;
    // }

    if(normalize || collapse || this.filter){
        let final = [];
        for(let i = 0, word; i < words.length; i++){
            if((word = words[i])){
                if(!this.filter || !this.filter.has(word)){
                    words[i] = word = replace_collapsed(word, normalize, collapse);
                }
                else{
                    word = "";
                }
            }
            //word || words.splice(i--, 1);
            word && final.push(word);
        }
        words = final;
    }
    // else if(this.filter){
    //     words = filter(words, this.filter);
    // }

    // return this.filter
    //     ? filter(words, this.filter)
    //     : words;

    //cache_encode.set(str, words);
    return words;
}

// TODO improve normalize + remove non-delimited chars like in "I'm" + split on whitespace+
// str.replace(/([a-z])'([a-z])/, "$1$2")
// str.replace(/(\w)'(\w)/, "$1$2")

// p{Z} = whitespaces
// p{S} = symbols (emotes)
// p{P} = special chars
// p{C} = controls (linebreak, tabulator)

//export const regex_whitespace = /[\p{Z}\p{S}\p{P}\p{C}]+/u;

// https://github.com/nextapps-de/flexsearch/pull/414
//export const regex_whitespace = /[\s\xA0\u2000-\u200B\u2028\u2029\u3000\ufeff!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/

// const regex_normalize = /[\u0300-\u036f]/g;
//
// export function normalize(str){
//
//     // if(str.normalize){
//     //
//     //     str = str.normalize("NFD").replace(regex_normalize, "");
//     // }
//     //
//     // return str;
//
//     return str.normalize("NFD").replace(regex_normalize, "");
// }

/**
 * @param {!string} str
 * @param {boolean|Array<string|RegExp>=} normalize
 * @param {boolean|string|RegExp=} split
 * @param {boolean=} _collapse
 * @returns {string|Array<string>}
 */

// FlexSearch.prototype.pipeline = function(str, normalize, split, _collapse){
//
//     if(str){
//
//         if(normalize && str){
//
//             str = replace(str, /** @type {Array<string|RegExp>} */ (normalize));
//         }
//
//         if(str && this.matcher){
//
//             str = replace(str, this.matcher);
//         }
//
//         if(this.stemmer && str.length > 1){
//
//             str = replace(str, this.stemmer);
//         }
//
//         if(_collapse && str.length > 1){
//
//             str = collapse(str);
//         }
//
//         if(str){
//
//             if(split || (split === "")){
//
//                 const words = str.split(/** @type {string|RegExp} */ (split));
//
//                 return this.filter ? filter(words, this.filter) : words;
//             }
//         }
//     }
//
//     return str;
// };

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


/**
 * @param {Array<string>} words
 * @returns {Set<string>}
 */

export function init_filter(words){

    // const filter = create_object();
    //
    // for(let i = 0, length = words.length; i < length; i++){
    //
    //     filter[words[i]] = 1;
    // }
    //
    // return filter;
    return new Set(words);
}

/**
 * @param {!Object<string, string>} obj
 * @param {boolean} is_stemmer
 * @returns {Array}
 */

export function init_stemmer_or_matcher(obj, is_stemmer){

    const keys = get_keys(obj);
    const length = keys.length;
    const final = [];

    let removal = "", count = 0;

    for(let i = 0, key, tmp; i < length; i++){

        key = keys[i];
        tmp = obj[key];

        if(tmp){

            final[count++] = regex(is_stemmer ? "(?!\\b)" + key + "(\\b|_)" : key);
            final[count++] = tmp;
        }
        else{

            removal += (removal ? "|" : "") + key;
        }
    }

    if(removal){

        final[count++] = regex(is_stemmer ? "(?!\\b)(" + removal + ")(\\b|_)" : "(" + removal + ")");
        final[count] = "";
    }

    return final;
}

/**
 * @param {!string} str
 * @param {Array} regexp
 * @returns {string}
 */

export function replace(str, regexp){

    for(let i = 0, len = regexp.length; i < len; i += 2){
        str = str.replace(regexp[i], regexp[i + 1]);
        if(!str) break;
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

export function replace_collapsed(str, map, collapse = true){

    // if(!collapse && !test.test(str)){
    //     return str;
    // }

    let final = "";

    for(let i = 0, prev = "", char, tmp; i < str.length; i++){
        char = str.charAt(i);
        if(!collapse || char !== prev){
            tmp = map && map.get(char);
            if(!tmp && tmp !== "")
                final += (prev = char);
            else if((!collapse || tmp !== prev) && (prev = tmp))
                final += tmp;
        }
    }

    return final;
}

// TODO using fast-swap
function filter(words, map){

    // const length = words.length;
    // const filtered = [];

    for(let i = 0, word; i < words.length; i++){
        if((word = words[i]) && !map.has(word)){
            //filtered.push(word);
            words.splice(i--, 1);
        }
    }

    return words;
    //return words.filter(word => word && !map.has(word));
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

const cache_compress = new Map();
const radix = 512;
let timer_compress;
let charset = new Array(radix);
for(let i = 0; i < radix; i++) charset[i] = i + 33;
charset = String.fromCharCode.apply(null, charset);

export function compress(str) {

    //return str;

    // if(timer_compress){
    //     if(cache_compress.has(str)){
    //         return cache_compress.get(str);
    //     }
    // }
    // else{
    //     timer_compress = setTimeout(function(){
    //         timer_compress = null;
    //         cache_compress.clear();
    //     });
    // }

    //return str;
    return window.hash(str);
    return crc(str).toString(36);

    let rixit;
    let residual = crc(str);
    let result = "";

    while(true){
        rixit = residual % radix;
        result = charset.charAt(rixit) + result;
        residual = residual / radix | 0;
        if(!residual)
            break;
    }

    cache_compress.set(str, result);
    return result;
}

function crc(data, crc = 0, prime = 0) {
    for(let i = 0, t, z; i < data.length; i++, crc &= 0xFFFF) {
        t = (crc >> 8) ^ data.charCodeAt(i);
        z = t;
        t ^= t >> 1;
        t ^= t >> 2;
        t ^= t >> 4;
        t &= 1;
        t |= z << 1;
        crc = (crc << 8) ^ (t << 15) ^ (t << 1) ^ (t);
    }
    return (prime ? (crc ^ 0) % prime : (crc ^ 0));
}

// 1252 3106 3841 [5559] 6191 7623 [[10239]
function crc2(str, crc = 0, prime = 5559) {
    for(let i = 0; i < str.length; i++) {
        crc += (crc << 2) - crc + str.charCodeAt(i);
    }
    return prime ? (crc >>> 0) % prime : crc >>> 0;
}
