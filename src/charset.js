import charset_exact from "./charset/exact.js";
import charset_normalize from "./charset/normalize.js";
import charset_latin_balance from "./charset/latin/balance.js";
import charset_latin_advanced from "./charset/latin/advanced.js";
import charset_latin_extra from "./charset/latin/extra.js";
import charset_latin_soundex from "./charset/latin/soundex.js";
import charset_cjk from "./charset/cjk.js";

// universal charset
export const Exact = charset_exact;
export const Default = charset_normalize;
export const Normalize = charset_normalize;
// latin charset
export const LatinBalance = charset_latin_balance;
export const LatinAdvanced = charset_latin_advanced;
export const LatinExtra = charset_latin_extra;
export const LatinSoundex = charset_latin_soundex;
// CJK
export const CJK = charset_cjk;
// deprecated
export const LatinExact = charset_exact;
export const LatinDefault = charset_normalize;
export const LatinSimple = charset_normalize;

export default {
    // universal charset
    Exact: charset_exact,
    Default: charset_normalize,
    Normalize: charset_normalize,
    // latin charset
    LatinBalance: charset_latin_balance,
    LatinAdvanced: charset_latin_advanced,
    LatinExtra: charset_latin_extra,
    LatinSoundex: charset_latin_soundex,
    // CJK
    CJK: charset_cjk,
    // deprecated
    LatinExact: charset_exact,
    LatinDefault: charset_normalize,
    LatinSimple: charset_normalize
};
