/** @type {Record<string, object>} */
export const global_lang = {};
/** @type {Record<string, object>} */
export const global_charset = {};

/**
 * @param {string} name
 * @param {object} charset
 */
export function registerCharset(name, charset) {
	global_charset[name] = charset;
}

/**
 * @param {string} name
 * @param {object} lang
 */

export function registerLanguage(name, lang) {
	global_lang[name] = lang;
}
