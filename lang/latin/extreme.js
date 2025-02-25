import Encoder from "../../encoder.js";
import { matcher } from "./advanced.js";

const compact = [
    // aeiouy
    /(?!^)[aeoy]/g, ""
];

function sort(a, b){
    return a < b ? -1 : 0;
}

export default {
    normalize: true,
    dedupe: true,
    // prepare: function(str){
    //     return str.split(/\s+/).map(word => word.split("").sort(sort).join("")).join(" ");
    // },
    // compress: function(str){
    //     return str;
    //     return str.split("").sort(sort).join("")
    //               .replace(/([^0-9])\1+/g, "$1");
    // },
    matcher: matcher,
    replacer: compact,
    mapper: new Map([
        ["b", "p"],
        ["w", "f"],
        ["z", "s"],
        ["n", "m"],
        ["g", "k"],
        ["j", "k"],
        ["q", "k"],
    ])
};

// //import { encode as encode_simple } from "./simple.js";
// import { pipeline } from "../../lang.js";
//
// // custom soundex implementation
//
// export const rtl = false;
// export const tokenize = "";
// export default {
//     encode: encode,
//     rtl: rtl,
//     tokenize: tokenize
// }
//
// //const regex_whitespace = /[\W_]+/g;
// const whitespace = /[\p{Z}\p{S}\p{P}\p{C}]+/u;
// const normalize = "".normalize && /[\u0300-\u036f]/g;
// //const regex_strip = /[^a-z0-9]+/;
//
//
// function sort(a, b){
//     return a < b ? -1 : 0;
// }
//
//
// // modified
// const pairs = new Map([
//
//     ["b", "p"],
//     //["p", "p"],
//
//     //["f", "f"],
//     ["v", "f"],
//     ["w", "f"],
//
//     //["s", "s"],
//     ["ß", "s"],
//     ["z", "s"],
//     ["x", "s"],
//
//     ["d", "t"],
//     //["t", "t"],
//
//     //["m", "m"],
//     ["n", "m"],
//     ["ñ", "m"],
//
//     //["k", "k"],
//     ["c", "k"],
//     ["ç", "k"],
//     ["g", "k"],
//     ["j", "k"],
//     ["q", "k"],
//
//     //["r", "r"],
//     //["h", "h"],
//     //["l", "l"],
//
//     //["a", "a"],
//     ["à", "a"],
//     ["á", "a"],
//     ["â", "a"],
//     ["ã", "a"],
//     ["ä", "a"],
//     ["å", "a"],
//
//     //["e", "e"],
//     ["è", "e"],
//     ["é", "e"],
//     ["ê", "e"],
//     ["ë", "e"],
//     ["i", "e"],
//     ["ì", "e"],
//     ["í", "e"],
//     ["î", "e"],
//     ["ï", "e"],
//     ["y", "e"],
//     ["ý", "e"],
//     ["ŷ", "e"],
//     ["ÿ", "e"],
//
//     //["o", "o"],
//     ["ò", "o"],
//     ["ó", "o"],
//     ["ô", "o"],
//     ["õ", "o"],
//     ["ö", "o"],
//     ["ő", "o"],
//     ["u", "o"],
//     ["ù", "o"],
//     ["ú", "o"],
//     ["û", "o"],
//     ["ü", "o"],
//     ["ű", "o"],
// ]);
//
// const map_soundex = new Map([
//     ["b", "p"],
//     //["p", "p"],
//
//     //["f", "f"],
//     ["v", "f"],
//     ["w", "f"],
//
//     //["s", "s"],
//     ["z", "s"],
//     ["x", "s"],
//
//     ["d", "t"],
//     //["t", "t"],
//
//     //["m", "m"],
//     ["n", "m"],
//
//     //["k", "k"],
//     ["c", "k"],
//     ["g", "k"],
//     ["j", "k"],
//     ["q", "k"],
//
//     //["r", "r"],
//     //["h", "h"],
//     //["l", "l"],
//
//     //["a", "a"],
//
//     //["e", "e"],
//     ["i", "e"],
//     ["y", "e"],
//
//     //["o", "o"],
//     ["u", "o"]
// ]);
// /**
//  * @param {string|number} str
//  */
//
// export function encode(str){
//
//     return pipeline.call(
//         this,
//         /* string: */ ("" + str).toLowerCase().split(whitespace).map(item => item.split("").sort(sort).join("")),
//         /* normalize: */ pairs,
//         /* split: */ false,
//         /* collapse: */ false
//     );
// }
