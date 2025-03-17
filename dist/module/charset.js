import charset_latin_exact from "./charset/latin/exact.js";
import charset_latin_default from "./charset/latin/default.js";
import charset_latin_simple from "./charset/latin/simple.js";
import charset_latin_balance from "./charset/latin/balance.js";
import charset_latin_advanced from "./charset/latin/advanced.js";
import charset_latin_extra from "./charset/latin/extra.js";
import charset_latin_soundex from "./charset/latin/soundex.js";
import charset_arabic_default from "./charset/arabic/default.js";
import charset_cjk_default from "./charset/cjk/default.js";
import charset_cyrillic_default from "./charset/cyrillic/default.js";

export const LatinExact = charset_latin_exact;
export const LatinDefault = charset_latin_default;
export const LatinSimple = charset_latin_simple;
export const LatinBalance = charset_latin_balance;
export const LatinAdvanced = charset_latin_advanced;
export const LatinExtra = charset_latin_extra;
export const LatinSoundex = charset_latin_soundex;
export const ArabicDefault = charset_arabic_default;
export const CjkDefault = charset_cjk_default;
export const CyrillicDefault = charset_cyrillic_default;

// export const global_lang = create_object();
//export const global_charset = create_object();

export default {
  LatinExact: charset_latin_exact,
  LatinDefault: charset_latin_default,
  LatinSimple: charset_latin_simple,
  LatinBalance: charset_latin_balance,
  LatinAdvanced: charset_latin_advanced,
  LatinExtra: charset_latin_extra,
  LatinSoundex: charset_latin_soundex,
  ArabicDefault: charset_arabic_default,
  CjkDefault: charset_cjk_default,
  CyrillicDefault: charset_cyrillic_default
};

// global_charset["latin:exact"] = charset_exact;
// global_charset["latin:default"] = charset_default;
// global_charset["latin:simple"] = charset_simple;
// global_charset["latin:balance"] = charset_balance;
// global_charset["latin:advanced"] = charset_advanced;
// global_charset["latin:extra"] = charset_extra;
// global_charset["latin:soundex"] = charset_soundex;


/**
 * @param {!string} name
 * @param {Object} charset
 */

// export function registerCharset(name, charset){
//     global_charset[name] = charset;
// }

/**
 * @param {!string} name
 * @param {Object} lang
 */

// export function registerLanguage(name, lang){
//     global_lang[name] = lang;
// }