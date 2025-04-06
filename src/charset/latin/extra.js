import { EncoderOptions } from "../../type.js";
import { soundex } from "./balance.js";
import { matcher, replacer } from "./advanced.js";

export const compact = [
    /(?!^)[aeo]/g, "" // before soundex: aeoy, old: aioy
];

/** @type EncoderOptions */
const options = {
    //normalize: true,
    //dedupe: true,
    mapper: soundex,
    replacer: replacer.concat(compact),
    matcher: matcher
};
export default options;
