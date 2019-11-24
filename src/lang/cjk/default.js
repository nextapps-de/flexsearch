import FlexSearch from "../../flexsearch.js";

export const rtl = false;
export const tokenize = "strict";
export default {
    encode: encode,
    rtl: rtl,
    tokenize: tokenize
}

const regex = /[\x00-\x7F]+/g;

/**
 * @this FlexSearch
 */

export function encode(str){

    return this.pipeline(

        /* string: */ str.replace(regex, ""),
        /* normalize: */ false,
        /* split: */ "",
        /* collapse: */ false
    );
}
