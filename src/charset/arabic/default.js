import { EncoderOptions } from "../../type.js";
const regex = /[\x00-\x7F]+/g;
const split = /\s+/;

/** @type EncoderOptions */
const options = {
    rtl: true,
    normalize: false,
    dedupe: true,
    prepare: function(str){
        return ("" + str).replace(regex, " ")
    }
};
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
