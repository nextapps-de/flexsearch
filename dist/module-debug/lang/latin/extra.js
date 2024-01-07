import { IndexInterface } from "../../type.js";
import { regex, replace, collapse } from "../../lang.js";
import { encode as encode_advanced } from "./advanced.js";

export const rtl = /* normalize: */ /* collapse: */ /* normalize: */ /* collapse: */ /* normalize: */ /* collapse: */ /* normalize: */ /* collapse: */!1;
export const tokenize = "";
export default {
    encode: encode,
    rtl: !1,
    tokenize: ""

    // Soundex Normalization

};const prefix = "(?!\\b)",
      //soundex_b = regex(prefix + "p"),
// soundex_s = regex(prefix + "z"),
// soundex_k = regex(prefix + "[cgq]"),
// soundex_m = regex(prefix + "n"),
// soundex_t = regex(prefix + "d"),
// soundex_f = regex(prefix + "[vw]"),
//regex_vowel = regex(prefix + "[aeiouy]");
regex_vowel = regex("(?!\\b)[aeo]"),
      pairs = [

// soundex_b, "b",
// soundex_s, "s",
// soundex_k, "k",
// soundex_m, "m",
// soundex_t, "t",
// soundex_f, "f",
// regex("(?![aeiouy])h(?![aeiouy])"), "",
// regex("(?!^[aeiouy])h(?!^[aeiouy])"), "",
regex_vowel, ""];


/**
 * @param {string|number} str
 * @this IndexInterface
 */

export function encode(str) {

    if (str) {

        str = encode_advanced.call(this, str, /* append: */ /* skip update: */ /* skip_update: */ /* skip post-processing: */!0);

        if (1 < str.length) {

            //str = replace(str, pairs);
            str = str.replace(regex_vowel, "");
        }

        if (1 < str.length) {

            str = collapse(str);
        }

        if (str) {

            str = str.split(" ");
        }
    }

    return str || [];
}