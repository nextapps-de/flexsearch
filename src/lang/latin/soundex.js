import Index from "../../index.js";

export const rtl = false;
export const tokenize = "strict";
export default {
    encode: encode,
    rtl: rtl,
    tokenize: tokenize
}

//const regex_whitespace = /[\W_]+/g;
const regex_strip = /[^a-z]+/;

// const pairs = [
//     regex_whitespace, " ",
//     regex_strip, ""
// ];

// modified

const soundex = {

    "b": 1,
    "f": 1,
    "p": 1,
    "v": 1,

    "c": 7,
    "g": 7,
    "j": 7,
    "k": 7,
    "q": 7,

    "s": 2,
    "x": 2,
    "z": 2,

    "d": 3,
    "t": 3,

    "l": 4,

    "m": 5,
    "n": 5,

    "r": 6
};

/**
 * @this Index
 */

export function encode(str){

    str = this.pipeline(

        /* string: */ str.toLowerCase(),
        /* normalize: */ false,
        /* split: */ false,
        /* collapse: */ false
    );

    const result = [];

    if(str){

        const words = str.split(regex_strip);
        const length = words.length;

        for(let x = 0, count = 0; x < length; x++){

            if((str = words[x]) && (str.length > 2) && (!this.filter || !this.filter[str])){

                let code = str[0];
                let previous = getCode(code);

                for(let i = 1; i < str.length; i++){

                    const current = soundex[str[i]];

                    if(current && (current !== previous)){

                        code += current;
                        previous = current;

                        if(code.length === 4){

                            break;
                        }
                    }
                }

                result[count++] = (code + "0000").substring(0, 4);
            }
        }
    }

    return result;
}


// https://www.rosettacode.org/wiki/Soundex

// function getCode(char){
//
//     switch(char){
//
//         case 'b':
//         case 'f':
//         case 'p':
//         case 'v':
//             return 1;
//         case 'c':
//         case 'g':
//         case 'j':
//         case 'k':
//         case 'q':
//         case 's':
//         case 'x':
//         case 'z':
//             return 2;
//         case 'd':
//         case 't':
//             return 3;
//         case 'l':
//             return 4;
//         case 'm':
//         case 'n':
//             return 5;
//         case 'r':
//             return 6;
//     }
//
//     return "";
// }
