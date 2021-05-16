import Document from "../../flexsearch.js";

export const rtl = true;
export const tokenize = "";
export default {
    encode: encode,
    rtl: rtl
}

const regex = /[\x00-\x7F]+/g;

/**
 * @this Document
 */

export function encode(str){

    return this.pipeline(

        /* string: */ str.replace(regex, " "),
        /* normalize: */ false,
        /* split: */ " ",
        /* collapse: */ false
    );
}
