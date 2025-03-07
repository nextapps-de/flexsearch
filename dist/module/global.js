import { create_object } from "./common.js";

export const global_lang = create_object();
export const global_charset = create_object();

/**
 * @param {!string} name
 * @param {Object} charset
 */

export function registerCharset(name, charset) {
  global_charset[name] = charset;
}

/**
 * @param {!string} name
 * @param {Object} lang
 */

export function registerLanguage(name, lang) {
  global_lang[name] = lang;
}