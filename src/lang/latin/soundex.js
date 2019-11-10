// https://www.rosettacode.org/wiki/Soundex

import { regex, replace } from "../../common.js";

const regex_whitespace = regex("[\\W_]+"),
    regex_strip = regex("[^A-Z0-9 ]");

const pairs = [
    regex_whitespace, " ",
    regex_strip, ""
];

export default function(str){

    if(!str){

        return str;
    }

    str = replace(str.toUpperCase(), pairs);

    if(!str){

        return str;
    }

    const words = str.split(" ");

    for(let x = 0; x < words.length; x++){

        if((str = words[x])){

            let code = str[0];
            let previous = getCode(code);

            for(let i = 1; i < str.length; i++){

                const current = getCode(str[i]);

                if(current !== previous){

                    code += current;
                    previous = current;

                    if(code.length === 4){

                        break;
                    }
                }
            }

            words[x] = (code + "0000").substring(0, 4);
        }
    }

    return words;
}

function getCode(char){

    switch(char){

        case 'B':
        case 'F':
        case 'P':
        case 'V':
            return 1;
        case 'C':
        case 'G':
        case 'J':
        case 'K':
        case 'Q':
        case 'S':
        case 'X':
        case 'Z':
            return 2;
        case 'D':
        case 'T':
            return 3;
        case 'L':
            return 4;
        case 'M':
        case 'N':
            return 5;
        case 'R':
            return 6;
    }

    return "";
}
