import { regex, replace, collapse } from "../../common.js";

const regex_whitespace = regex("[\\W_]+"),
    regex_strip = regex("[^a-z0-9 ]");

const pairs = [
    regex_whitespace, " ",
    regex_strip, ""
];

export default function(str){

    if(!str){

        return str;
    }

    return collapse(replace(str.toLowerCase(), pairs));
}
