import { EncoderOptions } from "../../type.js";

export const soundex = new Map([
    ["b", "p"],
    //["p", "p"],

    //["f", "f"],
    ["v", "f"],
    ["w", "f"],

    //["s", "s"],
    ["z", "s"],
    ["x", "s"],

    ["d", "t"],
    //["t", "t"],

    //["m", "m"],
    ["n", "m"],

    //["k", "k"],
    ["c", "k"],
    ["g", "k"],
    ["j", "k"],
    ["q", "k"],

    //["r", "r"],
    //["h", "h"],
    //["l", "l"],

    //["a", "a"],

    //["e", "e"],
    ["i", "e"],
    ["y", "e"],

    //["o", "o"],
    ["u", "o"]
]);

/** @type EncoderOptions */
const options = {
    //normalize: true,
    //dedupe: true,
    mapper: soundex
};
export default options;
