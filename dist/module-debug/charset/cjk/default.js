import { EncoderOptions } from "../../type.js";
const regex = /[\x00-\x7F]+/g,
      options = {
    normalize: !1,
    dedupe: !0,
    split: "",
    prepare: function (str) {
        return ("" + str).replace(regex, "");
    }
};

/** @type EncoderOptions */

export default options;

// import { pipeline } from "../../lang.js";
//
// export const rtl = false;
// export const tokenize = "strict";
// export default {
//     encode: encode,
//     rtl: rtl,
//     tokenize: tokenize
// }
//
// const regex = /[\x00-\x7F]+/g;
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
//         /* string: */ ("" + str).replace(regex, ""),
//         /* normalize: */ false,
//         /* split: */ "",
//         /* collapse: */ false
//     );
// }