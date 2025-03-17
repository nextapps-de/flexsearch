import { EncoderOptions } from "../../type.js";
const regex = /[\x00-\x7F]+/g;

/** @type EncoderOptions */
const options = {
    normalize: false,
    dedupe: true,
    prepare: function(str){
        return ("" + str).replace(regex, " ")
    }
};
export default options;

// import { pipeline } from "../../lang.js";
//
// export const rtl = false;
// export const tokenize = "";
// export default {
//     encode: encode,
//     rtl: rtl
// }
//
// const regex = /[\x00-\x7F]+/g;
// const split = /\s+/;
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
