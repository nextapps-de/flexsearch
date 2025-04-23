/**
 * Filter are also known as "stopwords", they completely filter out words from being indexed.
 * Source: http://www.ranks.nl/stopwords
 * Object Definition: Just provide an array of words.
 * @type {Set<string>}
 */

export const filter = new Set([
    "aber",
    "als",
    "am",
    "an",
    "auch",
    "auf",
    "aus",
    "bei",
    "bin",
    "bis",
    "bist",
    "da",
    "dadurch",
    "daher",
    "darum",
    "das",
    "dass",
    "dass",
    "dein",
    "deine",
    "dem",
    "den",
    "der",
    "des",
    "dessen",
    "deshalb",
    "die",
    "dies",
    "dieser",
    "dieses",
    "doch",
    "dort",
    "du",
    "durch",
    "ein",
    "eine",
    "einem",
    "einen",
    "einer",
    "eines",
    "er",
    "es",
    "euer",
    "eure",
    "fuer",
    "hatte",
    "hatten",
    "hattest",
    "hattet",
    "hier",
    "hinter",
    "ich",
    "ihr",
    "ihre",
    "im",
    "in",
    "ist",
    "ja",
    "jede",
    "jedem",
    "jeden",
    "jeder",
    "jedes",
    "jener",
    "jenes",
    "jetzt",
    "ggf",
    "kann",
    "kannst",
    "koennen",
    "koennt",
    "machen",
    "mein",
    "meine",
    "mit",
    "muss",
    "musst",
    "musst",
    "muessen",
    "muesst",
    "nach",
    "nachdem",
    "nein",
    "nicht",
    "noch",
    "nun",
    "oder",
    "seid",
    "sein",
    "seine",
    "sich",
    "sie",
    "sind",
    "soll",
    "sollen",
    "sollst",
    "sollt",
    "sonst",
    "soweit",
    "sowie",
    "und",
    "unser",
    "unsere",
    "unter",
    "usw",
    "uvm",
    "vom",
    "von",
    "vor",
    "wann",
    "warum",
    "was",
    "weiter",
    "weitere",
    "wenn",
    "wer",
    "werde",
    "werden",
    "werdet",
    "weshalb",
    "wie",
    "wieder",
    "wieso",
    "wir",
    "wird",
    "wirst",
    "wo",
    "woher",
    "wohin",
    "zu",
    "zum",
    "zur",
    "ueber"
]);

/**
 * Stemmer removes word endings and is a kind of "partial normalization". A word ending just matched when the word length is bigger than the matched partial.
 * Example: The word "correct" and "correctness" could be the same word, so you can define {"ness": ""} to normalize the ending.
 * Object Definition: the key represents the word ending, the value contains the replacement (or empty string for removal).
 * http://snowball.tartarus.org/algorithms/german/stemmer.html
 * @type {Map<string, string>}
 */

export const stemmer = new Map([
    ["niss", ""],
    ["isch", ""],
    ["lich", ""],
    ["heit", ""],
    ["keit", ""],
    ["ell", ""],
    ["bar", ""],
    ["end", ""],
    ["ung", ""],
    ["est", ""],
    ["ern", ""],
    ["em", ""],
    ["er", ""],
    ["en", ""],
    ["es", ""],
    ["st", ""],
    ["ig", ""],
    ["ik", ""],
    ["e", ""],
    ["s", ""]
]);

/**
 * Matcher replaces all occurrences of a given string regardless of its position and is also a kind of "partial normalization".
 * Object Definition: the key represents the target term, the value contains the search string which should be replaced (could also be an array of multiple terms).
 * @type {Map<string, string>}
 */
const map = new Map([
    ["_", " "],
    ["ä", "ae"],
    ["ö", "oe"],
    ["ü", "ue"],
    ["ß", "ss"],
    ["&", " und "],
    ["€", " EUR "]
]);

/**
 * @type {import('../type.js').EncoderOptions}
 */
const options = {
    prepare: function(str){
        // normalization
        if(/[_äöüß&€]/.test(str))
            str = str.replace(/[_äöüß&€]/g, match => map.get(match));
        // street names
        return str.replace(/str\b/g, "strasse")
                  .replace(/(?!\b)strasse\b/g, " strasse");
    },
    filter: filter,
    stemmer: stemmer
};
export default options;