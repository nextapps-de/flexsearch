
import { parse_option } from "./common.js";
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

Built-in Encoder (Workflow)
----------------------------
Pipeline:
    1. apply this.normalize: charset normalization:
       applied on the whole input string e.g. lowercase,
       will also apply on: filter, matcher, stemmer, mapper
    2. apply this.split: split input into terms (includes/excludes)
    3. apply this.filter (pre-filter)
    4. apply this.matcher (replace terms)
    5. apply this.stemmer (replace term endings)
    6. apply this.filter (post-filter)
    7. apply this.mapper (replace chars)
    8. apply this.replacer (custom regex)
    9. apply this.dedupe (letter deduplication)
   10. apply this.finalize
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

    if (!this) {
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
    this.normalize = /** @type {Function|boolean} */parse_option(options.normalize, /* tag? */ /* stringify */ /* stringify */ /* skip update: */ /* append: */ /* skip update: */
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
        tmp = include || options.exclude || options.split;


    if ("object" == typeof tmp) {
        let numeric = !include,
            regex = "";

        // split on whitespace by default
        options.include || (regex += "\\p{Z}");
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
            // fallback to a simple whitespace splitter
            this.split = /\s+/;
        }
        this.numeric = numeric;
    } else {
        try {
            // https://github.com/nextapps-de/flexsearch/issues/410
            this.split = /** @type {string|RegExp|boolean} */parse_option(tmp, whitespace, this.split);
        } catch (e) {
            // fallback to a simple whitespace splitter
            this.split = /\s+/;
        }
        this.numeric = parse_option(this.numeric, !0);
    }

    /**
     * post-processing terms
     * @type {Function|null}
     */
    this.prepare = /** @type {Function|null} */parse_option(options.prepare, null, this.prepare);
    /**
     * final processing
     * @type {Function|null}
     */
    this.finalize = /** @type {Function|null} */parse_option(options.finalize, null, this.finalize);

    // assign the normalization fallback to the mapper
    if (!normalize) {
        this.mapper = new Map(
        /** @type {Array<Array<string, string>>} */normalize_polyfill);
    }

    // options

    this.rtl = options.rtl || /* suggest */ /* append: */ /* enrich */!1;
    this.dedupe = parse_option(options.dedupe, !0, this.dedupe);
    this.filter = parse_option((tmp = options.filter) && new Set(tmp), null, this.filter);
    this.matcher = parse_option((tmp = options.matcher) && new Map(tmp), null, this.matcher);
    this.mapper = parse_option((tmp = options.mapper) && new Map(tmp), null, this.mapper);
    this.stemmer = parse_option((tmp = options.stemmer) && new Map(tmp), null, this.stemmer);
    this.replacer = parse_option(options.replacer, null, this.replacer);
    this.minlength = parse_option(options.minlength, 1, this.minlength);
    this.maxlength = parse_option(options.maxlength, 0, this.maxlength);

    // minimum required tokenizer by this encoder
    //this.tokenize = options["tokenize"] || "";

    // auto-balanced cache
    this.cache = tmp = parse_option(options.cache, !0, this.cache);
    if (tmp) {
        this.timer = null;
        this.cache_size = "number" == typeof tmp ? tmp : 2e5;
        this.cache_enc = new Map();
        this.cache_prt = new Map();
        this.cache_enc_length = 128;
        this.cache_prt_length = 128;
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
    //     this.compression = parse_option(options.compress || options.compression, 0, this.compression);
    //     if(this.compression && !table){
    //         table = new Array(radix);
    //         for(let i = 0; i < radix; i++) table[i] = i + 33;
    //         table = String.fromCharCode.apply(null, table);
    //     }
    // }

    return this;
};

Encoder.prototype.addMatcher = function (match, replace) {
    if ("object" == typeof match) {
        return this.addReplacer(match, replace);
    }
    // a single char:
    if (2 > match.length) {
        return this.addMapper(match, replace);
    }
    this.matcher || (this.matcher = new Map());
    this.matcher.set(match, replace);
    this.matcher_str += (this.matcher_str ? "|" : "") + match;
    this.matcher_test = null; //new RegExp("(" + this.matcher_str + ")");
    this.cache && this.invalidate();
    return this;
};

Encoder.prototype.addStemmer = function (match, replace) {
    this.stemmer || (this.stemmer = new Map());
    this.stemmer.set(match, replace);
    this.stemmer_str += (this.stemmer_str ? "|" : "") + match;
    this.stemmer_test = null; //new RegExp("(" + this.stemmer_str + ")");
    this.cache && this.invalidate();
    return this;
};

Encoder.prototype.addFilter = function (str) {
    this.filter || (this.filter = new Set());
    this.filter.add(str);
    this.cache && this.invalidate();
    return this;
};

Encoder.prototype.addMapper = function (char_match, char_replace) {
    // regex:
    if ("object" == typeof char_match) {
        return this.addReplacer(char_match, char_replace);
    }
    // not a char:
    if (1 < char_match.length) {
        return this.addMatcher(char_match, char_replace);
    }
    this.mapper || (this.mapper = new Map());
    this.mapper.set(char_match, char_replace);
    this.cache && this.invalidate();
    return this;
};

Encoder.prototype.addReplacer = function (match, replace) {
    if ("string" == typeof match) match = new RegExp(match, "g");
    this.replacer || (this.replacer = []);
    this.replacer.push(match, replace || "");
    this.cache && this.invalidate();
    return this;
};

Encoder.prototype.invalidate = function () {
    this.cache_enc.clear();
    this.cache_prt.clear();
};


Encoder.prototype.encode = function (str) {

    //if(!str) return str;
    // todo remove dupe terms

    if (this.cache && str.length <= this.cache_enc_length) {
        if (this.timer) {
            if (this.cache_enc.has(str)) {
                return this.cache_enc.get(str);
            }
        } else {
            this.timer = setTimeout(clear, 0, this);
        }
    }

    // 1. apply charset normalization
    if (this.normalize) {
        if ("function" == typeof this.normalize) {
            str = this.normalize(str);
        } else if (normalize) {
            str = str.normalize("NFKD").replace(normalize, "").toLowerCase();
        } else {
            str = str.toLowerCase();
            // if(SUPPORT_CHARSET){
            //     this.mapper = this.mapper
            //         // todo replace spread
            //         ? new Map([.../** @type {!Iterable} */(normalize_mapper), ...this.mapper])
            //         : new Map(/** @type {Map<string,string>} */ (normalize_mapper));
            // }
        }
        //if(!str) return str;
    }

    // 2. apply custom encoder (can replace split)
    if (this.prepare) {
        str = this.prepare(str);
    }

    // 3. split numbers into triplets
    if (this.numeric && 3 < str.length) {
        str = str.replace(numeric_split_prev_char, "$1 $2").replace(numeric_split_next_char, "$1 $2").replace(numeric_split_length, "$1 ");
    }

    // if(this.matcher && (str.length > 1)){
    //     this.matcher_test || (
    //         this.matcher_test = new RegExp("(" + this.matcher_str + ")", "g")
    //     );
    //     str = str.replace(this.matcher_test, match => this.matcher.get(match));

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

        // 1. pre-filter before cache
        if (this.filter && this.filter.has(word)) {
            continue;
        }

        if (this.cache && word.length <= this.cache_prt_length) {
            if (this.timer) {
                const tmp = this.cache_prt.get(word);
                //if(this.cache_prt.has(word)){
                if (tmp || "" === tmp) {
                    //word = this.cache_prt.get(word);
                    tmp && final.push(tmp);
                    //word ? words[i] = word : words.splice(i--, 1);
                    continue;
                }
            } else {
                this.timer = setTimeout(clear, 0, this);
            }
        }

        let postfilter;

        // if(this.normalize === true && normalize){
        //     word = word.normalize("NFKD").replace(normalize, "");
        //     postfilter = 1;
        // }

        // if(this.normalize){
        //     if(typeof this.normalize === "function"){
        //         word = this.normalize(word);
        //     }
        //     else if(normalize){
        //         word = word.normalize("NFKD").replace(normalize, "").toLowerCase();
        //     }
        //     else{
        //         word = word.toLowerCase();
        //         this.mapper = this.mapper
        //             ? new Map([...normalize_mapper, ...this.mapper])
        //             : new Map(/** @type {Map<string, string>} */ normalize_mapper);
        //     }
        //     postfilter = 1;
        //     //if(!str) return str;
        // }

        // 2. apply stemmer after matcher
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
            postfilter = 1;
        }

        // 3. apply matcher
        if (this.matcher && 1 < word.length) {
            this.matcher_test || (this.matcher_test = new RegExp("(" + this.matcher_str + ")", "g"));
            word = word.replace(this.matcher_test, match => this.matcher.get(match));
            postfilter = 1;
        }

        // 4. post-filter after matcher and stemmer was applied
        if (word && postfilter && (word.length < this.minlength || this.filter && this.filter.has(word))) {
            word = "";
        }

        // 5. apply mapper and collapsing
        if (word && (this.mapper || this.dedupe && 1 < word.length)) {
            //word = this.replace_dedupe(word);
            //word = replace_deduped(word, this.mapper, true);
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

        // if(word){
        //     words[i] = word;
        // }

        if (this.cache && base.length <= this.cache_prt_length) {
            this.cache_prt.set(base, word);
            if (this.cache_prt.size > this.cache_size) {
                this.cache_prt.clear();
                this.cache_prt_length = 0 | this.cache_prt_length / 1.1;
            }
        }

        //word || words.splice(i--, 1);
        word && final.push(word);
    }

    //words = final;
    // else if(this.filter){
    //     for(let i = 0, word; i < words.length; i++){
    //         if((word = words[i]) && !this.filter.has(word)){
    //             //filtered.push(word);
    //             words.splice(i--, 1);
    //         }
    //     }
    // }

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
//     if(SUPPORT_CACHE && this.cache && str.length <= this.cache_prt_length){
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
//     if(SUPPORT_CACHE && this.cache && str.length <= this.cache_prt_length){
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

function clear(self) {
    self.timer = null;
    self.cache_enc.clear();
    self.cache_prt.clear();
}