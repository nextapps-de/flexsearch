import FlexSearch from "../../flexsearch.js";

export const rtl = true;
export const tokenize = "";
export default {
    encode: encode,
    rtl: rtl
}

const split = /[\W_]+/;

/**
 * @this FlexSearch
 */

export function encode(str){

    return this.pipeline(

        /* string: */ str,
        /* normalize: */ false,
        /* split: */ split,
        /* collapse: */ false
    );
}
