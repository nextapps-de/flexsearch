import Encoder from "../../encoder.js";
import { soundex } from "./balance.js";

// const soundex = new Map([
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

export const matcher = new Map([["ai", "ei"], ["ae", "a"], ["oe", "o"], ["ue", "u"], ["sh", "s"], ["ch", "c"], ["th", "t"], ["ph", "f"], ["pf", "f"]]);

export const replacer = [/([^aeo])h([aeo$])/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2"];

export default {
    normalize: /* tag? */ /* stringify */ /* stringify */ /* skip update: */ /* append: */ /* skip update: */ /* skip_update: */ /* skip deletion */ // splice:
    !0 /*await rows.hasNext()*/ /*await rows.hasNext()*/ /*await rows.hasNext()*/,
    dedupe: !0,
    mapper: soundex,
    replacer: replacer,
    matcher: matcher
};

// import { regex, replace, collapse } from "../../lang.js";
// import { encode as encode_balance } from "./balance.js";
//
// export const rtl = false;
// export const tokenize = "";
// export default {
//     encode: encode,
//     rtl: rtl,
//     tokenize: tokenize
// }
//
// // Phonetic Normalization
//
// const regex_ae = regex("ae"),
//     //regex_ai = regex("ai"),
//     //regex_ay = regex("ay"),
//     //regex_ey = regex("ey"),
//     regex_oe = regex("oe"),
//     //regex_ue = regex("ue"),
//     //regex_ie = regex("ie"),
//     //regex_sz = regex("sz"),
//     //regex_zs = regex("zs"),
//     //regex_ck = regex("ck"),
//     //regex_cc = regex("cc"),
//     regex_sh = regex("sh"),
//     regex_th = regex("th"),
//     //regex_dt = regex("dt"),
//     regex_ph = regex("ph"),
//     regex_pf = regex("pf");
//     //regex_ou = regex("ou"),
//     //regex_uo = regex("uo");
//
// const pairs = [
//     regex_ae, "a",
//     // regex_ai, "ei",
//     // regex_ay, "ei",
//     // regex_ey, "ei",
//     regex_oe, "o",
//     // regex_ue, "u",
//     // regex_ie, "i",
//     // regex_sz, "s",
//     // regex_zs, "s",
//     regex_sh, "s",
//     // regex_ck, "k",
//     // regex_cc, "k",
//     regex_th, "t",
//     // regex_dt, "t",
//     regex_ph, "f",
//     regex_pf, "f",
//     // regex_ou, "o",
//     // regex_uo, "u"
//
//     // regex("(?![aeiouy])h(?![aeiouy])"), "",
//     // regex("(?!^[aeiouy])h(?!^[aeiouy])"), ""
//     regex("(?![aeo])h(?![aeo])"), "",
//     regex("(?!^[aeo])h(?!^[aeo])"), ""
// ];
//
// /**
//  * @param {string|number} str
//  * @param {boolean=} _skip_postprocessing
//  */
//
// export function encode(str, _skip_postprocessing){
//
//     if(str){
//
//         str = encode_balance.call(this, str).join(" ");
//
//         if(str.length > 2){
//
//             str = replace(str, pairs);
//         }
//
//         if(!_skip_postprocessing){
//
//             if(str.length > 1){
//
//                 str = collapse(str);
//             }
//
//             if(str){
//
//                 str = str.split(" ");
//             }
//         }
//     }
//
//     return str || [];
// }