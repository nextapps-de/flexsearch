import { EncoderOptions } from "../../type.js";
import { soundex } from "./balance.js";

export const matcher = new Map([["ai", "ei"], ["ae", "a"], ["oe", "o"], ["ue", "u"], ["sh", "s"], ["ch", "c"], ["th", "t"], ["ph", "f"], ["pf", "f"]]);

export const replacer = [/([^aeo])h([aeo$])/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2"];

/** @type EncoderOptions */
const options = {
    normalize: !0,
    dedupe: !0,
    mapper: soundex,
    replacer: replacer,
    matcher: matcher
};
export default options;