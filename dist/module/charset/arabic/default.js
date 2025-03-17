import { EncoderOptions } from "../../type.js";
const regex = /[\x00-\x7F]+/g,
      split = /\s+/,
      options = {
    rtl: !0,
    normalize: !1,
    dedupe: !0,
    prepare: function (str) {
        return ("" + str).replace(regex, " ");
    }
};

/** @type EncoderOptions */

export default options;

// import { pipeline } from "../../lang.js";
//
// export const rtl = true;
// export const tokenize = "";
// export default {
//     encode: encode,
//     rtl: rtl
// }
//
//
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
//         /* string: */ ("" + str).replace(regex, " "),
//         /* normalize: */ false,
//         /* split: */ split,
//         /* collapse: */ false
//     );
// }