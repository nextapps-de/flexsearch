import { IndexInterface } from "../../type.js";
import { pipeline } from "../../lang.js";

export const rtl = /* append: */ /* skip update: */ /* skip_update: */!0;
export const tokenize = "";
export default {
    encode: encode,
    rtl: !0
};

const regex = /[\x00-\x7F]+/g,
      split = /\s+/;


/**
 * @param {string|number} str
 * @this IndexInterface
 */

export function encode(str) {

    return pipeline.call(this,
    /* string: */("" + str).replace(regex, " "),
    /* normalize: */
    /* collapse: */!1,
    /* split: */split, !1);
}