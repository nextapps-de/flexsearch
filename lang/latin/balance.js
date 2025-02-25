import Encoder from "../../encoder.js";

export const soundex = new Map([
    ["b", "p"],
    //["p", "p"],

    //["f", "f"],
    ["v", "f"],
    ["w", "f"],

    //["s", "s"],
    ["z", "s"],
    ["x", "s"],

    ["d", "t"],
    //["t", "t"],

    //["m", "m"],
    ["n", "m"],

    //["k", "k"],
    ["c", "k"],
    ["g", "k"],
    ["j", "k"],
    ["q", "k"],

    //["r", "r"],
    //["h", "h"],
    //["l", "l"],

    //["a", "a"],

    //["e", "e"],
    ["i", "e"],
    ["y", "e"],

    //["o", "o"],
    ["u", "o"]
]);

export default {
    normalize: true,
    dedupe: true,
    mapper: soundex
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
// // const pairs = [
// //     regex_whitespace, " ",
// //     regex_strip, ""
// // ];
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
// // const soundex = {
// //
// //     "b": "p",
// //     //"p": "p",
// //
// //     //"f": "f",
// //     "v": "f",
// //     "w": "f",
// //
// //     //"s": "s",
// //     "z": "s",
// //     "x": "s",
// //     "ß": "s",
// //
// //     "d": "t",
// //     //"t": "t",
// //
// //     //"l": "l",
// //
// //     //"m": "m",
// //     "n": "m",
// //
// //     "c": "k",
// //     "g": "k",
// //     "j": "k",
// //     //"k": "k",
// //     "q": "k",
// //
// //     //"r": "r",
// //     //"h": "h",
// //     //"a": "a",
// //
// //     //"e": "e",
// //     "i": "e",
// //     "y": "e",
// //
// //     //"o": "o",
// //     "u": "o"
// // };
//
// /**
//  * @param {string|number} str
//  */
//
// export function encode(str){
//
//     return pipeline.call(
//         this,
//         /* string: */ ("" + str).normalize("NFD").replace(normalize, "").toLowerCase(),
//         /* normalize: */ map_soundex,
//         /* split: */ whitespace,
//         ///* collapse: */ false
//     );
//
//     // return pipeline.call(
//     //     this,
//     //     /* string: */ ("" + str).toLowerCase(),
//     //     /* normalize: */ /*pairs*/ new Map(),
//     //     /* split: */ whitespace,
//     //     ///* collapse: */ false
//     // );
//
//     // str = encode_simple.call(this, str).join(" ");
//     //
//     // // str = this.pipeline(
//     // //
//     // //     /* string: */ normalize("" + str).toLowerCase(),
//     // //     /* normalize: */ false,
//     // //     /* split: */ false,
//     // //     /* collapse: */ false
//     // // );
//     //
//     // const result = [];
//     //
//     // if(str){
//     //
//     //     const words = str.split(regex_strip);
//     //     const length = words.length;
//     //
//     //     for(let x = 0, tmp, count = 0; x < length; x++){
//     //
//     //         if((str = words[x]) /*&& (str.length > 2)*/ && (!this.filter || !this.filter.has(str))){
//     //
//     //             tmp = str[0];
//     //             let code = soundex[tmp] || tmp; //str[0];
//     //             let previous = code; //soundex[code] || code;
//     //
//     //             for(let i = 1; i < str.length; i++){
//     //
//     //                 tmp = str[i];
//     //                 const current = soundex[tmp] || tmp;
//     //
//     //                 if(current && (current !== previous)){
//     //
//     //                     code += current;
//     //                     previous = current;
//     //
//     //                     // if(code.length === 7){
//     //                     //
//     //                     //     break;
//     //                     // }
//     //                 }
//     //             }
//     //
//     //             result[count++] = code; //(code + "0000").substring(0, 4);
//     //         }
//     //     }
//     // }
//     //
//     // return result;
// }
