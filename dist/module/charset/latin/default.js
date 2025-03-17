import { EncoderOptions } from "../../type.js";

/** @type EncoderOptions */
const options = {
    normalize: function (str) {
        return str.toLowerCase();
    },
    dedupe: !1
};
export default options;

// import { pipeline } from "../../lang.js";
//
// const whitespace = /[\p{Z}\p{S}\p{P}\p{C}]+/u;
//
// export const rtl = false;
// export const tokenize = "";
// export default {
//     encode: encode,
//     rtl: rtl,
//     tokenize: tokenize
// }
//
// /**
//  * @param {string|number} str
//  */
//
// export function encode(str){
//
//     return pipeline.call(
//
//         this,
//         /* string: */ ("" + str).toLowerCase(),
//         /* normalize: */ false,
//         /* split: */ whitespace,
//         /* collapse: */ false
//     );
// }