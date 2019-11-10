import { regex, replace, collapse } from "../../common.js";
import encoder_advanced from "./advanced.js";

// Soundex Normalization

const soundex_b = regex("p"),
    soundex_s = regex("z"),
    soundex_k = regex("[cgq]"),
    soundex_m = regex("n"),
    soundex_t = regex("d"),
    soundex_f = regex("[vw]"),
    regex_vowel = regex("[aeiouy]");

const regex_pairs_extra = [

    soundex_b, "b",
    soundex_s, "s",
    soundex_k, "k",
    soundex_m, "m",
    soundex_t, "t",
    soundex_f, "f",
    regex_vowel, ""
];

export default function(str){

    if(!str){

        return str;
    }

    str = encoder_advanced(str, /* skip post processing? */ true);

    if(str.length > 1){

        str = str.split(" ");

        for(let i = 0; i < str.length; i++){

            const current = str[i];

            if(current.length > 1){

                // keep first char
                str[i] = current[0] + replace(current.substring(1), regex_pairs_extra);
            }
        }

        str = str.join(" ");
        str = collapse(str);
    }

    return str;
}
