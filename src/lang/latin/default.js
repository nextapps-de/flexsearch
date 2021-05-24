import { IndexInterface } from "../../type.js";
import { normalize } from "../../lang.js";

export const rtl = false;
export const tokenize = "";
export default {
    encode: encode,
    rtl: rtl,
    tokenize: tokenize
}

const regex_whitespace = /[\W_]+/;

/**
 * @this IndexInterface
 */

export function encode(str){

    return this.pipeline(

        /* string: */ normalize(str).toLowerCase(),
        /* normalize: */ false,
        /* split: */ regex_whitespace,
        /* collapse: */ false
    );
}
