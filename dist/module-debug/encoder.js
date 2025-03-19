
import { merge_option } from "./common.js";
import normalize_polyfill from "./charset/normalize.js";
import { EncoderOptions } from "./type.js";

/*

Custom Encoder
----------------

// Split a passed string into an Array of words:
function englishEncoder(string){
    return string.toLowerCase().split(/[^a-z]+/)
}

// For CJK split a passed string into an Array of chars:
function chineseEncoder(string){
    return string.replace(/\s+/, "").split("")
}

// Alternatively do not split the input:
function fixedEncoder(string){
    return [string]
}

Built-in Encoder
----------------------------
The main workflow follows an increasing strategy,
starting from a simple .toLowerCase() to full RegExp
Pipeline:
    1. apply this.normalize: charset normalization:
       applied on the whole input string e.g. lowercase,
       everything you put later into (filter, matcher, stemmer, mapper, etc.)
       has to be normalized by definition, because it won't apply to them automatically
    2. apply this.prepare (custom preparation, string in - string out)
    3  split numerics into triplets when not surrounded by a letter
    4. apply this.split: split input into terms (includes/excludes)
    5. apply this.filter (pre-filter)
    6. apply this.stemmer (replace term endings)
    7. apply this.filter (post-filter)
    8. apply this.mapper (replace chars)
    9. apply this.dedupe (letter deduplication)
   10. apply this.matcher (replace terms)
   11. apply this.replacer (custom regex)
   12. apply this.finalize
*/

const whitespace = /[^\p{L}\p{N}]+/u,
      numeric_split_length = /(\d{3})/g,
      numeric_split_prev_char = /(\D)(\d{3})/g,
      numeric_split_next_char = /(\d{3})(\D)/g,
      normalize = /[\u0300-\u036f]/g; // /[\p{Z}\p{S}\p{P}\p{C}]+/u;
//const numeric_split = /(\d{3})/g;

//.replace(/(\d{3})/g, "$1 ")
//.replace(/([^\d])([\d])/g, "$1 $2")
//.replace(/([\d])([^\d])/g, "$1 $2")

// '´`’ʼ.,
//const normalize_mapper = SUPPORT_CHARSET && !normalize && normalize_polyfill;

/**
 * @param {EncoderOptions=} options
 * @constructor
 */

export default function Encoder() {

    if (!this || this.constructor !== Encoder) {
        // let args = Array.prototype.slice.call(arguments);
        // args.unshift(Encoder);
        // return new (Encoder.bind.apply(Encoder, args));
        return new Encoder(...arguments);
    }

    for (let i = 0; i < arguments.length; i++) {
        this.assign(arguments[i]);
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
    this.normalize = /** @type {Function|boolean} */merge_option(options.normalize, /* tag? */ /* stringify */ /* stringify */ /* single param */ /* skip update: */ /* append: */ /* skip update: */
    /* skip_update: */
    /* skip deletion */!0 /*await rows.hasNext()*/ /*await rows.hasNext()*/ /*await rows.hasNext()*/, this.normalize);

    // {
    //     letter: true,
    //     number: true,
    //     whitespace: true,
    //     symbol: true,
    //     punctuation: true,
    //     control: true,
    //     char: ""
    // }

    let include = options.include,
        tmp = include || options.exclude || options.split,
        numeric;


    if (tmp || "" === tmp) {
        if ("object" == typeof tmp && tmp.constructor !== RegExp) {
            let regex = "";
            numeric = !include;
            // split on whitespace by default
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
                // https://github.com/nextapps-de/flexsearch/issues/410
                /**
                 * split string input into terms
                 * @type {string|RegExp|boolean|null}
                 */
                this.split = new RegExp("[" + (include ? "^" : "") + regex + "]+", "u");
            } catch (e) {
                console.error("Your split configuration:", tmp, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /\s+/.");
                // fallback to a simple whitespace splitter
                this.split = /\s+/;
            }
        } else {
            this.split = /** @type {string|RegExp|boolean} */tmp;
            // determine numeric encoding
            numeric = /* suggest */ /* append: */ /* enrich */!1 === tmp || 2 > "a1a".split(tmp).length;
        }

        this.numeric = merge_option(options.numeric, numeric);
    } else {
        try {
            // https://github.com/nextapps-de/flexsearch/issues/410
            this.split = /** @type {string|RegExp|boolean} */merge_option(this.split, whitespace);
        } catch (e) {
            console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /\s+/.");
            // fallback to a simple whitespace splitter
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

    // assign the normalization fallback to the mapper
    if (!normalize) {
        this.mapper = new Map(
        /** @type {Array<Array<string, string>>} */normalize_polyfill);
    }

    // options

    this.rtl = merge_option(options.rtl, !1, this.rtl);
    this.dedupe = merge_option(options.dedupe, !1, this.dedupe);
    this.filter = merge_option((tmp = options.filter) && new Set(tmp), null, this.filter);
    this.matcher = merge_option((tmp = options.matcher) && new Map(tmp), null, this.matcher);
    this.mapper = merge_option((tmp = options.mapper) && new Map(tmp), null, this.mapper);
    this.stemmer = merge_option((tmp = options.stemmer) && new Map(tmp), null, this.stemmer);
    this.replacer = merge_option(options.replacer, null, this.replacer);
    this.minlength = merge_option(options.minlength, 1, this.minlength);
    this.maxlength = merge_option(options.maxlength, 0, this.maxlength);

    // minimum required tokenizer by this encoder
    //this.tokenize = options["tokenize"] || "";

    // auto-balanced cache
    this.cache = tmp = merge_option(options.cache, !0, this.cache);
    if (tmp) {
        this.timer = null;this.cache_size = "number" == typeof tmp ? tmp : 2e5;
        this.cache_enc = new Map();
        this.cache_term = new Map();
        this.cache_enc_length = 128;
        this.cache_term_length = 128;
    }

    // regex temporary state
    this.matcher_str = "";
    this.matcher_test = null;
    this.stemmer_str = "";
    this.stemmer_test = null;

    // prebuilt
    // if(this.filter && this.split){
    //     for(const key of this.filter){
    //         const tmp = key.replace(this.split, "");
    //         if(key !== tmp){
    //             this.filter.delete(key);
    //             this.filter.add(tmp);
    //         }
    //     }
    // }
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

    // if(SUPPORT_COMPRESSION){
    //     this.compression = merge_option(options.compress || options.compression, 0, this.compression);
    //     if(this.compression && !table){
    //         table = new Array(radix);
    //         for(let i = 0; i < radix; i++) table[i] = i + 33;
    //         table = String.fromCharCode.apply(null, table);
    //     }
    // }

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
    this.filter || (this.filter = new Set());
    this.filter.add(term);
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
    // regex:
    if ("object" == typeof char_match) {
        return this.addReplacer( /**  @type {RegExp} */char_match, char_replace);
    }
    // not a char:
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
    // regex:
    if ("object" == typeof match) {
        return this.addReplacer( /**  @type {RegExp} */match, replace);
    }
    // a single char:
    // only downgrade when dedupe is on or mapper already was filled
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
 * @return {!Array<string>}
 */
Encoder.prototype.encode = function (str) {

    //if(!str) return str;
    // todo remove dupe terms

    if (this.cache && str.length <= this.cache_enc_length) {
        if (this.timer) {
            if (this.cache_enc.has(str)) {
                return this.cache_enc.get(str);
            }
        } else {
            this.timer = setTimeout(clear, 50, this);
        }
    }

    // apply charset normalization
    if (this.normalize) {
        if ("function" == typeof this.normalize) {
            str = this.normalize(str);
        } else if (normalize) {
            str = str.normalize("NFKD").replace(normalize, "").toLowerCase();
        } else {
            str = str.toLowerCase();
        }
    }

    // apply custom encoder (can replace split)
    if (this.prepare) {
        str = this.prepare(str);
    }

    // split numbers into triplets
    if (this.numeric && 3 < str.length) {
        str = str.replace(numeric_split_prev_char, "$1 $2").replace(numeric_split_next_char, "$1 $2").replace(numeric_split_length, "$1 ");
    }

    // if(this.matcher && (str.length > 1)){
    //     this.matcher_test || (
    //         this.matcher_test = new RegExp("(" + this.matcher_str + ")", "g")
    //     );
    //     str = str.replace(this.matcher_test, match => this.matcher.get(match));
    // }
    // if(this.stemmer){
    //     this.stemmer_test || (
    //         this.stemmer_test = new RegExp("(?!\\b)(" + this.stemmer_str + ")(\\b|_)", "g")
    //     );
    //     str = str.replace(this.stemmer_test, match => this.stemmer.get(match));
    // }

    const skip = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
    let final = [],
        words = this.split || "" === this.split ? str.split( /** @type {string|RegExp} */this.split) : str;
    //[str];

    for (let i = 0, word, base; i < words.length; i++) {
        // filter empty entries
        if (!(word = base = words[i])) {
            continue;
        }
        if (word.length < this.minlength) {
            continue;
        }
        if (skip) {
            final.push(word);
            continue;
        }

        // pre-filter before cache
        if (this.filter && this.filter.has(word)) {
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

        // apply stemmer after matcher
        if (this.stemmer && 2 < word.length) {
            // for(const item of this.stemmer){
            //     const key = item[0];
            //     const value = item[1];
            //
            //     if(word.length > key.length && word.endsWith(key)){
            //         word = word.substring(0, word.length - key.length) + value;
            //         break;
            //     }
            //
            //     // const position = word.length - key.length;
            //     // if(position > 0 && word.substring(position) === key){
            //     //     word = word.substring(0, position) + value;
            //     //     break;
            //     // }
            // }
            this.stemmer_test || (this.stemmer_test = new RegExp("(?!^)(" + this.stemmer_str + ")$"));
            word = word.replace(this.stemmer_test, match => this.stemmer.get(match));

            // 4. post-filter after matcher and stemmer was applied
            if (word.length < this.minlength || this.filter && this.filter.has(word)) {
                word = "";
            }
        }

        // apply mapper and collapsing
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

        // from here the input string can shrink,
        // minlength should not apply

        // apply matcher
        if (this.matcher && 1 < word.length) {
            this.matcher_test || (this.matcher_test = new RegExp("(" + this.matcher_str + ")", "g"));
            word = word.replace(this.matcher_test, match => this.matcher.get(match));
        }

        // apply custom regex
        if (word && this.replacer) {
            for (let i = 0; word && i < this.replacer.length; i += 2) {
                word = word.replace(this.replacer[i], this.replacer[i + 1]);
            }
        }

        // slower variants for removing same chars in a row:
        //word = word.replace(/([^0-9])\1+/g, "$1");
        //word = word.replace(/(.)\1+/g, "$1");
        //word = word.replace(/(?<=(.))\1+/g, "");

        if (this.cache && base.length <= this.cache_term_length) {
            this.cache_term.set(base, word);
            if (this.cache_term.size > this.cache_size) {
                this.cache_term.clear();
                this.cache_term_length = 0 | this.cache_term_length / 1.1;
            }
        }

        word && final.push(word);
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

// Encoder.prototype.compress = function(str) {
//
//     //return str;
//     //if(!str) return str;
//
//     if(SUPPORT_CACHE && this.cache && str.length <= this.cache_term_length){
//         if(this.timer){
//             if(this.cache_cmp.has(str)){
//                 return this.cache_cmp.get(str);
//             }
//         }
//         else{
//             this.timer = setTimeout(clear, 0, this);
//         }
//     }
//
//     const result = typeof this.compression === "function"
//         ? this.compression(str)
//         : hash(str); //window.hash(str);
//
//     if(SUPPORT_CACHE && this.cache && str.length <= this.cache_term_length){
//         this.cache_cmp.set(str, result);
//         this.cache_cmp.size > this.cache_size &&
//         this.cache_cmp.clear();
//     }
//
//     return result;
// };

// function hash(str){
//     return str;
// }

/**
 * @param {Encoder} self
 */
function clear(self) {
    self.timer = null;
    self.cache_enc.clear();
    self.cache_term.clear();
}