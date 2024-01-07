import { IndexInterface } from "../../type.js";
import { pipeline } from "../../lang.js";

export const rtl = /* normalize: */ /* collapse: */
/* normalize: */
/* collapse: */!1;
export const tokenize = "strict";
export default {
    encode: encode,
    rtl: !1,
    tokenize: "strict"
};

const regex = /[\x00-\x7F]+/g;

/**
 * @param {string|number} str
 * @this IndexInterface
 */

export function encode(str) {

    return pipeline.call(this,
    /* string: */("" + str).replace(regex, ""), !1,
    /* split: */"", !1);
}