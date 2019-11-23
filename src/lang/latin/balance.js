import FlexSearch from "../../flexsearch.js";

export const rtl = false;
export const tokenize = "";
export default {
    encode: encode,
    rtl: rtl
}

const regex_whitespace = /[\W_]+/;
//const regex_strip = /[^a-z0-9 ]/g;

// const pairs = [
//     regex_whitespace, " ",
//     regex_strip, ""
// ];

/**
 * @this FlexSearch
 */

export function encode(str){

    return this.pipeline(

        /* string: */ str.toLowerCase(),
        /* normalize: */ false,
        /* split: */ regex_whitespace,
        /* collapse: */ false
    );
}
