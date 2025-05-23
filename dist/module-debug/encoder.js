
import { create_object, merge_option } from "./common.js";
import normalize_polyfill from "./charset/polyfill.js";
import { EncoderOptions } from "./type.js";

/*

Custom Encoder
----------------

function englishEncoder(string){
    return string.toLowerCase().split(/[^a-z]+/)
}

function chineseEncoder(string){
    return string.replace(/\s+/, "").split("")
}

function fixedEncoder(string){
    return [string]
}

Built-in Encoder
----------------------------
The main workflow follows an increasing strategy,
starting from a simple .toLowerCase() to full RegExp
Pipeline:
    1. apply this.normalize (charset normalization)
       applied on the whole input string e.g. lowercase,
       everything you put later into (filter, matcher, stemmer, mapper, etc.)
       has to be normalized by definition, because it won't apply to them automatically
    2. apply this.prepare (custom function, string in - string out)
    3  split numerics into triplets
    4. split input into terms (by one of them: split/include/exclude)
    5. pre-encoded term deduplication
    6. apply this.filter (stop-words)
    7. apply this.stemmer (replace term endings)
    8. apply this.mapper (replace chars)
    9. apply this.dedupe (letter deduplication)
   10. apply this.matcher (replace terms)
   11. apply this.replacer (custom regex)
   12. post-encoded term deduplication
   13. apply this.finalize (custom function, array in - array out)
*/

const whitespace = /[^\p{L}\p{N}]+/u,
      numeric_split_length = /(\d{3})/g,
      numeric_split_prev_char = /(\D)(\d{3})/g,
      numeric_split_next_char = /(\d{3})(\D)/g,
      normalize = /[\u0300-\u036f]/g;


/**
 * @param {EncoderOptions=} options
 * @constructor
 */

export default function Encoder(options = {}) {

    if (!this || this.constructor !== Encoder) {

        return new Encoder(...arguments);
    }

    if (arguments.length) {
        for (let i = 0; i < arguments.length; i++) {
            this.assign( /** @type {!EncoderOptions} */arguments[i]);
        }
    } else {
        this.assign( /** @type {!EncoderOptions} */options);
    }
}

/**
 * @param {!EncoderOptions} options
 */
Encoder.prototype.assign = function (options) {

    /**
     * pre-processing string input
     * @type {Function|boolean}
     */
    this.normalize = /** @type {Function|boolean} */merge_option(options.normalize, !0, this.normalize);

    let include = options.include,
        tmp = include || options.exclude || options.split,
        numeric;


    if (tmp || "" === tmp) {
        if ("object" == typeof tmp && tmp.constructor !== RegExp) {
            let regex = "";
            numeric = !include;

            include || (regex += "\\p{Z}");
            if (tmp.letter) {
                regex += "\\p{L}";
            }
            if (tmp.number) {
                regex += "\\p{N}";
                numeric = !!include;
            }
            if (tmp.symbol) {
                regex += "\\p{S}";
            }
            if (tmp.punctuation) {
                regex += "\\p{P}";
            }
            if (tmp.control) {
                regex += "\\p{C}";
            }
            if (tmp = tmp.char) {
                regex += "object" == typeof tmp ? tmp.join("") : tmp;
            }

            try {

                /**
                 * split string input into terms
                 * @type {string|RegExp|boolean|null}
                 */
                this.split = new RegExp("[" + (include ? "^" : "") + regex + "]+", "u");
            } catch (e) {
                console.error("Your split configuration:", tmp, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /\s+/.");


                this.split = /\s+/;
            }
        } else {
            this.split = /** @type {string|RegExp|boolean} */tmp;

            numeric = !1 === tmp || 2 > "a1a".split(tmp).length;
        }

        this.numeric = merge_option(options.numeric, numeric);
    } else {
        try {

            this.split = /** @type {string|RegExp|boolean} */merge_option(this.split, whitespace);
        } catch (e) {
            console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /\s+/.");


            this.split = /\s+/;
        }

        this.numeric = merge_option(options.numeric, merge_option(this.numeric, !0));
    }

    /**
     * post-processing terms
     * @type {Function|null}
     */
    this.prepare = /** @type {Function|null} */merge_option(options.prepare, null, this.prepare);
    /**
     * final processing
     * @type {Function|null}
     */
    this.finalize = /** @type {Function|null} */merge_option(options.finalize, null, this.finalize);

    tmp = options.filter;
    this.filter = "function" == typeof tmp ? tmp : merge_option(tmp && new Set(tmp), null, this.filter);
    this.dedupe = merge_option(options.dedupe, !0, this.dedupe);
    this.matcher = merge_option((tmp = options.matcher) && new Map(tmp), null, this.matcher);
    this.mapper = merge_option((tmp = options.mapper) && new Map(tmp), null, this.mapper);
    this.stemmer = merge_option((tmp = options.stemmer) && new Map(tmp), null, this.stemmer);
    this.replacer = merge_option(options.replacer, null, this.replacer);
    this.minlength = merge_option(options.minlength, 1, this.minlength);
    this.maxlength = merge_option(options.maxlength, 1024, this.maxlength);
    this.rtl = merge_option(options.rtl, !1, this.rtl);

    this.cache = tmp = merge_option(options.cache, !0, this.cache);
    if (tmp) {
        this.timer = null;
        this.cache_size = "number" == typeof tmp ? tmp : 2e5;
        this.cache_enc = new Map();
        this.cache_term = new Map();
        this.cache_enc_length = 128;
        this.cache_term_length = 128;
    }

    this.matcher_str = "";
    this.matcher_test = null;
    this.stemmer_str = "";
    this.stemmer_test = null;

    if (this.matcher) {
        for (const key of this.matcher.keys()) {
            this.matcher_str += (this.matcher_str ? "|" : "") + key;
        }
    }
    if (this.stemmer) {
        for (const key of this.stemmer.keys()) {
            this.stemmer_str += (this.stemmer_str ? "|" : "") + key;
        }
    }

    return this;
};

Encoder.prototype.addStemmer = function (match, replace) {
    this.stemmer || (this.stemmer = new Map());
    this.stemmer.set(match, replace);
    this.stemmer_str += (this.stemmer_str ? "|" : "") + match;
    this.stemmer_test = null;
    this.cache && clear(this);
    return this;
};

Encoder.prototype.addFilter = function (term) {
    if ("function" == typeof term) {

        this.filter = term;
    } else {
        this.filter || (this.filter = new Set());
        this.filter.add(term);
    }
    this.cache && clear(this);
    return this;
};

/**
 * Replace a single char
 * @param {string} char_match
 * @param {string} char_replace
 * @return {Encoder}
 * @suppress {invalidCasts}
 */
Encoder.prototype.addMapper = function (char_match, char_replace) {

    if ("object" == typeof char_match) {
        return this.addReplacer( /**  @type {RegExp} */char_match, char_replace);
    }

    if (1 < char_match.length) {
        return this.addMatcher(char_match, char_replace);
    }
    this.mapper || (this.mapper = new Map());
    this.mapper.set(char_match, char_replace);
    this.cache && clear(this);
    return this;
};

/**
 * Replace a string
 * @param {string} match
 * @param {string} replace
 * @return {Encoder}
 * @suppress {invalidCasts}
 */
Encoder.prototype.addMatcher = function (match, replace) {

    if ("object" == typeof match) {
        return this.addReplacer( /**  @type {RegExp} */match, replace);
    }

    if (2 > match.length && (this.dedupe || this.mapper)) {
        return this.addMapper(match, replace);
    }
    this.matcher || (this.matcher = new Map());
    this.matcher.set(match, replace);
    this.matcher_str += (this.matcher_str ? "|" : "") + match;
    this.matcher_test = null;
    this.cache && clear(this);
    return this;
};

/**
 * @param {RegExp} regex
 * @param {string} replace
 * @return {Encoder}
 * @suppress {invalidCasts}
 */
Encoder.prototype.addReplacer = function (regex, replace) {
    if ("string" == typeof regex) {
        return this.addMatcher( /**  @type {string} */regex, replace);
    }
    this.replacer || (this.replacer = []);
    this.replacer.push(regex, replace);
    this.cache && clear(this);
    return this;
};

/**
 * @param {!string} str
 * @param {boolean=} dedupe_terms Note: term deduplication will break the context chain
 * @return {!Array<string>}
 */
Encoder.prototype.encode = function (str, dedupe_terms) {

    if (this.cache && str.length <= this.cache_enc_length) {
        if (this.timer) {
            if (this.cache_enc.has(str)) {
                return this.cache_enc.get(str);
            }
        } else {
            this.timer = setTimeout(clear, 50, this);
        }
    }

    if (this.normalize) {
        if ("function" == typeof this.normalize) {
            str = this.normalize(str);
        } else if (normalize) {
            str = str.normalize("NFKD").replace(normalize, "").toLowerCase();
        } else {
            str = str.toLowerCase();
        }
    }

    if (this.prepare) {
        str = this.prepare(str);
    }

    if (this.numeric && 3 < str.length) {
        str = str.replace(numeric_split_prev_char, "$1 $2").replace(numeric_split_next_char, "$1 $2").replace(numeric_split_length, "$1 ");
    }

    const skip = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
    let final = [],
        dupes = create_object(),
        last_term,
        last_term_enc,
        words = this.split || "" === this.split ? str.split( /** @type {string|RegExp} */this.split) : [str];


    for (let i = 0, word, base; i < words.length; i++) {

        if (!(word = base = words[i])) {
            continue;
        }

        if (word.length < this.minlength || word.length > this.maxlength) {
            continue;
        }

        if (dedupe_terms) {
            if (dupes[word]) {
                continue;
            }
            dupes[word] = 1;
        } else {
            if (last_term === word) {
                continue;
            }
            last_term = word;
        }

        if (skip) {
            final.push(word);
            continue;
        }

        if (this.filter && ("function" == typeof this.filter ? !this.filter(word) : this.filter.has(word))) {
            continue;
        }

        if (this.cache && word.length <= this.cache_term_length) {
            if (this.timer) {
                const tmp = this.cache_term.get(word);
                if (tmp || "" === tmp) {
                    tmp && final.push(tmp);
                    continue;
                }
            } else {
                this.timer = setTimeout(clear, 50, this);
            }
        }

        if (this.stemmer) {

            this.stemmer_test || (this.stemmer_test = new RegExp("(?!^)(" + this.stemmer_str + ")$"));

            let old;

            while (old !== word && 2 < word.length) {
                old = word;
                word = word.replace(this.stemmer_test, match => this.stemmer.get(match));
            }
        }

        if (word && (this.mapper || this.dedupe && 1 < word.length)) {
            let final = "";
            for (let i = 0, prev = "", char, tmp; i < word.length; i++) {
                char = word.charAt(i);
                if (char !== prev || !this.dedupe) {
                    tmp = this.mapper && this.mapper.get(char);
                    if (!tmp && "" !== tmp) final += prev = char;else if ((tmp !== prev || !this.dedupe) && (prev = tmp)) final += tmp;
                }
            }
            word = final;
        }

        if (this.matcher && 1 < word.length) {
            this.matcher_test || (this.matcher_test = new RegExp("(" + this.matcher_str + ")", "g"));
            word = word.replace(this.matcher_test, match => this.matcher.get(match));
        }

        if (word && this.replacer) {
            for (let i = 0; word && i < this.replacer.length; i += 2) {
                word = word.replace(this.replacer[i], this.replacer[i + 1]);
            }
        }

        if (this.cache && base.length <= this.cache_term_length) {
            this.cache_term.set(base, word);
            if (this.cache_term.size > this.cache_size) {
                this.cache_term.clear();
                this.cache_term_length = 0 | this.cache_term_length / 1.1;
            }
        }

        if (word) {
            if (word !== base) {
                if (dedupe_terms) {
                    if (dupes[word]) {
                        continue;
                    }
                    dupes[word] = 1;
                } else {
                    if (last_term_enc === word) {
                        continue;
                    }
                    last_term_enc = word;
                }
            }
            final.push(word);
        }
    }

    if (this.finalize) {
        final = this.finalize(final) || final;
    }

    if (this.cache && str.length <= this.cache_enc_length) {
        this.cache_enc.set(str, final);
        if (this.cache_enc.size > this.cache_size) {
            this.cache_enc.clear();
            this.cache_enc_length = 0 | this.cache_enc_length / 1.1;
        }
    }

    return final;
};

export function fallback_encoder(str) {
    return str.normalize("NFKD").replace(normalize, "").toLowerCase().trim().split(/\s+/);
}

/**
 * @param {Encoder} self
 */
function clear(self) {
    self.timer = null;
    self.cache_enc.clear();
    self.cache_term.clear();
}