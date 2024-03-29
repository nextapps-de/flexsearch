import { IndexInterface } from "../../type.js";
import { encode as encode_simple } from "./simple.js";

// custom soundex implementation

export const rtl = /* normalize: */ /* collapse: */
/* normalize: */ /* collapse: */ /* normalize: */ /* collapse: */!1;
export const tokenize = "strict";
export default {
    encode: encode,
    rtl: !1,
    tokenize: "strict"

    //const regex_whitespace = /[\W_]+/g;
};const regex_strip = /[^a-z0-9]+/,
      soundex = {

    b: "p",
    //"p": "p",

    //"f": "f",
    v: "f", w: "f",

    //"s": "s",
    z: "s",
    x: "s",
    ß: "s",

    d: "t",
    //"t": "t",

    //"l": "l",

    //"m": "m",
    n: "m",

    c: "k",
    g: "k",
    j: "k",
    //"k": "k",
    q: "k",

    //"r": "r",
    //"h": "h",
    //"a": "a",

    //"e": "e",
    i: "e",
    y: "e",

    //"o": "o",
    u: "o"
};

// const pairs = [
//     regex_whitespace, " ",
//     regex_strip, ""
// ];

// modified

/**
 * @param {string|number} str
 * @this IndexInterface
 */

export function encode(str) {

    str = encode_simple.call(this, str).join(" ");

    // str = this.pipeline(
    //
    //     /* string: */ normalize("" + str).toLowerCase(),
    //     /* normalize: */ false,
    //     /* split: */ false,
    //     /* collapse: */ false
    // );

    const result = [];

    if (str) {
        const words = str.split(regex_strip),
              length = words.length;


        for (let x = 0, tmp, count = 0; x < length; x++) {

            if ((str = words[x]) && ( /*&& (str.length > 2)*/!this.filter || !this.filter[str])) {

                tmp = str[0];
                let code = soundex[tmp] || tmp,
                    previous = code; //str[0];

                //soundex[code] || code;

                for (let i = 1; i < str.length; i++) {

                    tmp = str[i];
                    const current = soundex[tmp] || tmp;

                    if (current && current !== previous) {

                        code += current;
                        previous = current;

                        // if(code.length === 7){
                        //
                        //     break;
                        // }
                    }
                }

                result[count++] = code; //(code + "0000").substring(0, 4);
            }
        }
    }

    return result;
}