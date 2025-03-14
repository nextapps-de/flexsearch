/** @define {string} */

/** @define {boolean} */
const SUPPORT_PERSISTENT = true;

/** @define {boolean} */
const SUPPORT_KEYSTORE = true;

/**
 * @param {*} value
 * @param {*} default_value
 * @param {*=} merge_value
 * @return {*}
 */

function parse_option(value, default_value, merge_value){

    const type_merge = typeof merge_value;
    const type_value = typeof value;

    if(type_merge !== "undefined"){
        if(type_value !== "undefined"){

            if(merge_value){
                if(type_value === "function" &&
                   type_merge === type_value){
                    return function(str){
                        return /** @type Function */ (value)(
                            /** @type Function */ (merge_value)(str)
                        );
                    }
                }

                const constructor_value = value.constructor;
                const constructor_merge = merge_value.constructor;

                if(constructor_value === constructor_merge){

                    if(constructor_value === Array){
                        return merge_value.concat(value);
                    }

                    if(constructor_value === Map){
                        const map = new Map(/** @type !Map */ (merge_value));
                        for(const item of /** @type !Map */ (value)){
                            const key = item[0];
                            const val = item[1];
                            map.set(key, val);
                        }
                        return map;
                    }

                    if(constructor_value === Set){
                        const set = new Set(/** @type !Set */ (merge_value));
                        for(const val of /** @type !Set */ (value).values()){
                            set.add(val);
                        }
                        return set;
                    }
                }
            }

            return value;
        }
        else {
            return merge_value;
        }
    }

    return type_value === "undefined"
        ? default_value
        : value;
}

function create_object(){
    return Object.create(null);
}

function concat(arrays){
    return [].concat.apply([], arrays);
}

function sort_by_length_down(a, b){
    return b.length - a.length;
}

function is_array(val){
    return val.constructor === Array;
}

function is_string(val){
    return typeof val === "string";
}

function is_object(val){
    return typeof val === "object";
}

function is_function(val){
    return typeof val === "function";
}

/**
 * @param {Map|Set} val
 * @param {boolean=} stringify
 * @return {Array}
 */

function toArray(val, stringify){
    const result = [];
    for(const key of val.keys()){
        result.push(key);
    }
    return result;
}

// TODO support generic function created from string when tree depth > 1
function parse_simple(obj, tree){

    if(is_string(tree)){
        obj = obj[tree];
    }
    else for(let i = 0; obj && (i < tree.length); i++){
        obj = obj[tree[i]];
    }

    return obj;
}

function get_max_len(arr){
    let len = 0;
    for(let i = 0, res; i < arr.length; i++){
        if((res = arr[i])){
            if(len < res.length){
                len = res.length;
            }
        }
    }
    return len;
}

var normalize_polyfill = [

    // Charset Normalization

    ["ª","a"],
    ["²","2"],
    ["³","3"],
    ["¹","1"],
    ["º","o"],
    ["¼","1⁄4"],
    ["½","1⁄2"],
    ["¾","3⁄4"],
    ["à","a"],
    ["á","a"],
    ["â","a"],
    ["ã","a"],
    ["ä","a"],
    ["å","a"],
    ["ç","c"],
    ["è","e"],
    ["é","e"],
    ["ê","e"],
    ["ë","e"],
    ["ì","i"],
    ["í","i"],
    ["î","i"],
    ["ï","i"],
    ["ñ","n"],
    ["ò","o"],
    ["ó","o"],
    ["ô","o"],
    ["õ","o"],
    ["ö","o"],
    ["ù","u"],
    ["ú","u"],
    ["û","u"],
    ["ü","u"],
    ["ý","y"],
    ["ÿ","y"],
    ["ā","a"],
    ["ă","a"],
    ["ą","a"],
    ["ć","c"],
    ["ĉ","c"],
    ["ċ","c"],
    ["č","c"],
    ["ď","d"],
    ["ē","e"],
    ["ĕ","e"],
    ["ė","e"],
    ["ę","e"],
    ["ě","e"],
    ["ĝ","g"],
    ["ğ","g"],
    ["ġ","g"],
    ["ģ","g"],
    ["ĥ","h"],
    ["ĩ","i"],
    ["ī","i"],
    ["ĭ","i"],
    ["į","i"],
    ["ĳ","ij"],
    ["ĵ","j"],
    ["ķ","k"],
    ["ĺ","l"],
    ["ļ","l"],
    ["ľ","l"],
    ["ŀ","l"],
    ["ń","n"],
    ["ņ","n"],
    ["ň","n"],
    ["ŉ","n"],
    ["ō","o"],
    ["ŏ","o"],
    ["ő","o"],
    ["ŕ","r"],
    ["ŗ","r"],
    ["ř","r"],
    ["ś","s"],
    ["ŝ","s"],
    ["ş","s"],
    ["š","s"],
    ["ţ","t"],
    ["ť","t"],
    ["ũ","u"],
    ["ū","u"],
    ["ŭ","u"],
    ["ů","u"],
    ["ű","u"],
    ["ų","u"],
    ["ŵ","w"],
    ["ŷ","y"],
    ["ź","z"],
    ["ż","z"],
    ["ž","z"],
    ["ſ","s"],
    ["ơ","o"],
    ["ư","u"],
    ["ǆ","dz"],
    ["ǉ","lj"],
    ["ǌ","nj"],
    ["ǎ","a"],
    ["ǐ","i"],
    ["ǒ","o"],
    ["ǔ","u"],
    ["ǖ","u"],
    ["ǘ","u"],
    ["ǚ","u"],
    ["ǜ","u"],
    ["ǟ","a"],
    ["ǡ","a"],
    ["ǣ","ae"],
    ["æ","ae"],
    ["ǽ","ae"],
    ["ǧ","g"],
    ["ǩ","k"],
    ["ǫ","o"],
    ["ǭ","o"],
    ["ǯ","ʒ"],
    ["ǰ","j"],
    ["ǳ","dz"],
    ["ǵ","g"],
    ["ǹ","n"],
    ["ǻ","a"],
    ["ǿ","ø"],
    ["ȁ","a"],
    ["ȃ","a"],
    ["ȅ","e"],
    ["ȇ","e"],
    ["ȉ","i"],
    ["ȋ","i"],
    ["ȍ","o"],
    ["ȏ","o"],
    ["ȑ","r"],
    ["ȓ","r"],
    ["ȕ","u"],
    ["ȗ","u"],
    ["ș","s"],
    ["ț","t"],
    ["ȟ","h"],
    ["ȧ","a"],
    ["ȩ","e"],
    ["ȫ","o"],
    ["ȭ","o"],
    ["ȯ","o"],
    ["ȱ","o"],
    ["ȳ","y"],
    ["ʰ","h"],
    ["ʱ","h"],
    ["ɦ","h"],
    ["ʲ","j"],
    ["ʳ","r"],
    ["ʴ","ɹ"],
    ["ʵ","ɻ"],
    ["ʶ","ʁ"],
    ["ʷ","w"],
    ["ʸ","y"],
    ["ˠ","ɣ"],
    ["ˡ","l"],
    ["ˢ","s"],
    ["ˣ","x"],
    ["ˤ","ʕ"],
    ["ΐ","ι"],
    ["ά","α"],
    ["έ","ε"],
    ["ή","η"],
    ["ί","ι"],
    ["ΰ","υ"],
    ["ϊ","ι"],
    ["ϋ","υ"],
    ["ό","ο"],
    ["ύ","υ"],
    ["ώ","ω"],
    ["ϐ","β"],
    ["ϑ","θ"],
    ["ϒ","Υ"],
    ["ϓ","Υ"],
    ["ϔ","Υ"],
    ["ϕ","φ"],
    ["ϖ","π"],
    ["ϰ","κ"],
    ["ϱ","ρ"],
    ["ϲ","ς"],
    ["ϵ","ε"],
    ["й","и"],
    ["ѐ","е"],
    ["ё","е"],
    ["ѓ","г"],
    ["ї","і"],
    ["ќ","к"],
    ["ѝ","и"],
    ["ў","у"],
    ["ѷ","ѵ"],
    ["ӂ","ж"],
    ["ӑ","а"],
    ["ӓ","а"],
    ["ӗ","е"],
    ["ӛ","ә"],
    ["ӝ","ж"],
    ["ӟ","з"],
    ["ӣ","и"],
    ["ӥ","и"],
    ["ӧ","о"],
    ["ӫ","ө"],
    ["ӭ","э"],
    ["ӯ","у"],
    ["ӱ","у"],
    ["ӳ","у"],
    ["ӵ","ч"]

    // Term Separators

    // ["'", ""], // it's -> its
    // ["´", ""],
    // ["`", ""],
    // ["’", ""],
    // ["ʼ", ""],

    // Numeric-Separators Chars Removal

    // [",", ""],
    // [".", ""]

    // Non-Whitespace Separators

    // already was split by default via p{P}
    // ["-", " "],
    // [":", " "],
    // ["_", " "],
    // ["|", " "],
    // ["/", " "],
    // ["\\", " "]
];

// COMPILER BLOCK -->

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

const whitespace = /[^\p{L}\p{N}]+/u; // /[\p{Z}\p{S}\p{P}\p{C}]+/u;
//const numeric_split = /(\d{3})/g;
const numeric_split_length = /(\d{3})/g;
const numeric_split_prev_char = /(\D)(\d{3})/g;
const numeric_split_next_char = /(\d{3})(\D)/g;
//.replace(/(\d{3})/g, "$1 ")
//.replace(/([^\d])([\d])/g, "$1 $2")
//.replace(/([\d])([^\d])/g, "$1 $2")
const normalize = "".normalize && /[\u0300-\u036f]/g; // '´`’ʼ.,
//const normalize_mapper = SUPPORT_CHARSET && !normalize && normalize_polyfill;

/**
 * @param {EncoderOptions=} options
 * @constructor
 */

function Encoder(options){

    if(!this){
        return new Encoder(...arguments);
    }

    for(let i = 0; i < arguments.length; i++){
        this.assign(arguments[i]);
    }
}
/**
 * @param {!EncoderOptions} options
 */
Encoder.prototype.assign = function(options){

    /**
     * pre-processing string input
     * @type {Function|boolean}
     */
    this.normalize =  /** @type {Function|boolean} */ (
        parse_option(options.normalize, true, this.normalize)
    );

    // {
    //     letter: true,
    //     number: true,
    //     whitespace: true,
    //     symbol: true,
    //     punctuation: true,
    //     control: true,
    //     char: ""
    // }

    let include = options.include;
    let tmp = include || options.exclude || options.split;

    if(typeof tmp === "object"){
        let numeric = !include;
        let regex = "";
        // split on whitespace by default
        options.include || (
            regex += "\\p{Z}"
        );
        if(tmp.letter){
            regex += "\\p{L}";
        }
        if(tmp.number){
            regex += "\\p{N}";
            numeric = !!include;
        }
        if(tmp.symbol){
            regex += "\\p{S}";
        }
        if(tmp.punctuation){
            regex += "\\p{P}";
        }
        if(tmp.control){
            regex += "\\p{C}";
        }
        if((tmp = tmp.char)){
            regex += typeof tmp === "object" ? tmp.join("") : tmp;
        }

        try{
            // https://github.com/nextapps-de/flexsearch/issues/410
            /**
             * split string input into terms
             * @type {string|RegExp|boolean|null}
             */
            this.split = new RegExp("[" + (include ? "^" : "") + regex + "]+", "u");
        }
        catch(e){
            // fallback to a simple whitespace splitter
            this.split = /\s+/;
        }
        this.numeric = numeric;
    }
    else {
        try{
            // https://github.com/nextapps-de/flexsearch/issues/410
            this.split = /** @type {string|RegExp|boolean} */ (parse_option(tmp, whitespace, this.split));
        }
        catch(e){
            // fallback to a simple whitespace splitter
            this.split = /\s+/;
        }
        this.numeric = parse_option(this.numeric, true);
    }

    /**
     * post-processing terms
     * @type {Function|null}
     */
    this.prepare = /** @type {Function|null} */ (
        parse_option(options.prepare, null, this.prepare)
    );
    /**
     * final processing
     * @type {Function|null}
     */
    this.finalize = /** @type {Function|null} */ (
        parse_option(options.finalize, null, this.finalize)
    );

    // assign the normalization fallback to the mapper
    if(!normalize){
        this.mapper = new Map(
            /** @type {Array<Array<string, string>>} */ (
                normalize_polyfill
            )
        );
    }

    // options

    this.rtl = options.rtl || false;
    this.dedupe = parse_option(options.dedupe, true, this.dedupe);
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
    {
        this.cache = tmp = parse_option(options.cache, true, this.cache);
        if(tmp){
            this.timer = null;
            this.cache_size = typeof tmp === "number" ? tmp : 2e5;
            this.cache_enc = new Map();
            this.cache_term = new Map();
            this.cache_enc_length = 128;
            this.cache_term_length = 128;
        }
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
    if(this.matcher){
        for(const key of this.matcher.keys()){
            this.matcher_str += (this.matcher_str ? "|" : "") + key;
        }
    }
    if(this.stemmer){
        for(const key of this.stemmer.keys()){
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

Encoder.prototype.addMatcher = function(match, replace){
    // regex:
    if(typeof match === "object"){
        return this.addReplacer(match, replace);
    }
    // a single char:
    if(match.length < 2){
        return this.addMapper(match, replace);
    }
    this.matcher || (this.matcher = new Map());
    this.matcher.set(match , replace);
    this.matcher_str += (this.matcher_str ? "|" : "") + match;
    this.matcher_test = null; //new RegExp("(" + this.matcher_str + ")");
    this.cache && this.invalidate();
    return this;
};

Encoder.prototype.addStemmer = function(match, replace){
    this.stemmer || (this.stemmer = new Map());
    this.stemmer.set(match, replace);
    this.stemmer_str += (this.stemmer_str ? "|" : "") + match;
    this.stemmer_test = null; //new RegExp("(" + this.stemmer_str + ")");
    this.cache && this.invalidate();
    return this;
};

Encoder.prototype.addFilter = function(str){
    this.filter || (this.filter = new Set());
    this.filter.add(str);
    this.cache && this.invalidate();
    return this;
};

Encoder.prototype.addMapper = function(char_match, char_replace){
    // regex:
    if(typeof char_match === "object"){
        return this.addReplacer(char_match, char_replace);
    }
    // not a char:
    if(char_match.length > 1){
        return this.addMatcher(char_match, char_replace);
    }
    this.mapper || (this.mapper = new Map());
    this.mapper.set(char_match, char_replace);
    this.cache && this.invalidate();
    return this;
};

Encoder.prototype.addReplacer = function(match, replace){
    if(typeof match === "string") match = new RegExp(match, "g");
    this.replacer || (this.replacer = []);
    this.replacer.push(match, replace || "");
    this.cache && this.invalidate();
    return this;
};

{
    Encoder.prototype.invalidate = function(){
        this.cache_enc.clear();
        this.cache_term.clear();
    };
}

Encoder.prototype.encode = function(str){

    //if(!str) return str;
    // todo remove dupe terms

    if(this.cache && str.length <= this.cache_enc_length){
        if(this.timer){
            if(this.cache_enc.has(str)){
                return this.cache_enc.get(str);
            }
        }
        else {
            this.timer = setTimeout(clear$1, 50, this);
        }
    }

    // 1. apply charset normalization
    if(this.normalize){
        if(typeof this.normalize === "function"){
            str = this.normalize(str);
        }
        else if(normalize){
            str = str.normalize("NFKD").replace(normalize, "").toLowerCase();
        }
        else {
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
    if(this.prepare){
        str = this.prepare(str);
    }

    // 3. split numbers into triplets
    if(this.numeric && str.length > 3){
        str = str.replace(numeric_split_prev_char, "$1 $2")
                 .replace(numeric_split_next_char, "$1 $2")
                 .replace(numeric_split_length, "$1 ");
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
    let final = [];
    let words = this.split || this.split === ""
        ? str.split(/** @type {string|RegExp} */ (this.split))
        : str; //[str];

    for(let i = 0, word, base; i < words.length; i++){
        // filter empty entries
        if(!(word = base = words[i])){
            continue;
        }
        if(word.length < this.minlength){
            continue;
        }
        if(skip) {
            final.push(word);
            continue;
        }

        // 1. pre-filter before cache
        if(this.filter && this.filter.has(word)){
            continue;
        }

        if(this.cache && word.length <= this.cache_term_length){
            if(this.timer){
                const tmp = this.cache_term.get(word);
                //if(this.cache_term.has(word)){
                if(tmp || tmp === ""){
                    //word = this.cache_term.get(word);
                    tmp && final.push(tmp);
                    //word ? words[i] = word : words.splice(i--, 1);
                    continue;
                }
            }
            else {
                this.timer = setTimeout(clear$1, 50, this);
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
        if(this.stemmer && (word.length > 2)){
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
            this.stemmer_test || (
                this.stemmer_test = new RegExp("(?!^)(" + this.stemmer_str + ")$")
            );
            word = word.replace(this.stemmer_test, match => this.stemmer.get(match));
            postfilter = 1;
        }

        // 4. post-filter after matcher and stemmer was applied
        if(word && postfilter && (word.length < this.minlength || (this.filter && this.filter.has(word)))){
            word = "";
        }

        // 5. apply mapper and collapsing
        if(word && (this.mapper || (this.dedupe && word.length > 1))){
            //word = this.replace_dedupe(word);
            //word = replace_deduped(word, this.mapper, true);
            let final = "";
            for(let i = 0, prev = "", char, tmp; i < word.length; i++){
                char = word.charAt(i);
                if(char !== prev || !this.dedupe){
                    tmp = this.mapper && this.mapper.get(char);
                    if(!tmp && tmp !== "")
                        final += (prev = char);
                    else if((tmp !== prev || !this.dedupe) && (prev = tmp))
                        final += tmp;
                }
            }
            word = final;
        }

        // 3. apply matcher
        if(this.matcher && (word.length > 1)){
            this.matcher_test || (
                this.matcher_test = new RegExp("(" + this.matcher_str + ")", "g")
            );
            word = word.replace(this.matcher_test, match => this.matcher.get(match));
            //postfilter = 1;
        }

        // apply custom regex
        if(word && this.replacer){
            for(let i = 0; word && (i < this.replacer.length); i+=2){
                word = word.replace(this.replacer[i], this.replacer[i+1]);
            }
        }

        // slower variants for removing same chars in a row:
        //word = word.replace(/([^0-9])\1+/g, "$1");
        //word = word.replace(/(.)\1+/g, "$1");
        //word = word.replace(/(?<=(.))\1+/g, "");

        // if(word){
        //     words[i] = word;
        // }

        if(this.cache && base.length <= this.cache_term_length){
            this.cache_term.set(base, word);
            if(this.cache_term.size > this.cache_size){
                this.cache_term.clear();
                this.cache_term_length = this.cache_term_length / 1.1 | 0;
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

    if(this.finalize){
        final = this.finalize(final) || final;
    }

    if(this.cache && str.length <= this.cache_enc_length){
        this.cache_enc.set(str, final);
        if(this.cache_enc.size > this.cache_size){
            this.cache_enc.clear();
            this.cache_enc_length = this.cache_enc_length / 1.1 | 0;
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

function clear$1(self){
    self.timer = null;
    self.cache_enc.clear();
    self.cache_term.clear();
}

async function handler(data) {

    data = data["data"];

    /** @type Index */
    const index = self["_index"];
    const args = data["args"];
    const task = data["task"];

    switch(task){

        case "init":

            /** @type IndexOptions */
            let options = data["options"] || {};
            let filepath = options.config;
            if(filepath){
                options = filepath;
                // will be replaced after build with the line below because
                // there is an issue with closure compiler dynamic import
                options = (await import(filepath))["default"];
            }

            const factory = data["factory"];

            if(factory){

                // export the FlexSearch global payload to "self"
                Function("return " + factory)()(self);

                /** @type Index */
                self["_index"] = new self["FlexSearch"]["Index"](options);

                // destroy the exported payload
                delete self["FlexSearch"];
            }
            else {

                self["_index"] = new Index(options);
            }

            postMessage({ "id": data["id"] });
            break;

        default:

            const id = data["id"];
            const message = index[task].apply(index, args);
            postMessage(
                task === "search"
                    ? { "id": id, "msg": message }
                    : { "id": id }
            );
    }
}

let pid = 0;

/**
 * @param {IndexOptions=} options
 * @constructor
 */

function WorkerIndex(options = {}){

    if(!this) {
        return new WorkerIndex(options);
    }

    // the factory is the outer wrapper from the build
    // it uses "self" as a trap for node.js
    let factory = typeof self !== "undefined"
        ? self["_factory"]
        : typeof window !== "undefined"
            ? window["_factory"]
            : null;
    if(factory){
        factory = factory.toString();
    }

    const is_node_js = typeof window === "undefined" /*&& self["exports"]*/;
    const _self = this;

    /**
     * @this {WorkerIndex}
     */
    function init(worker){

        this.worker = worker;
        this.resolver = create_object();

        if(!this.worker){
            return;
        }

        function onmessage(msg){
            msg = msg["data"] || msg;
            const id = msg["id"];
            const res = id && _self.resolver[id];
            if(res){
                res(msg["msg"]);
                delete _self.resolver[id];
            }
        }

        is_node_js
            ? this.worker["on"]("message", onmessage)
            : this.worker.onmessage = onmessage;

        if(options.config){

            // when extern configuration needs to be loaded
            // it needs to return a promise to await for
            return new Promise(function(resolve){

                _self.resolver[++pid] = function(){
                    resolve(_self);
                };

                _self.worker.postMessage({
                    "id": pid,
                    "task": "init",
                    "factory": factory,
                    "options": options
                });
            });
        }

        this.worker.postMessage({
            "task": "init",
            "factory": factory,
            "options": options
        });

        return this;
    }

    const worker = create(factory, is_node_js, options.worker);
    //worker.worker = true;
    return worker.then
        ? worker.then(function(worker){
            return init.call(_self, worker);
        })
        : init.call(this, worker);
}

register$1("add");
register$1("append");
register$1("search");
register$1("update");
register$1("remove");

function register$1(key){

    WorkerIndex.prototype[key] =
    WorkerIndex.prototype[key + "Async"] = async function(){

        const self = this;
        const args = [].slice.call(arguments);
        const arg = args[args.length - 1];
        let callback;

        if(is_function(arg)){
            callback = arg;
            args.splice(args.length - 1, 1);
        }

        const promise = new Promise(function(resolve){
            //setTimeout(function(){
                self.resolver[++pid] = resolve;
                self.worker.postMessage({
                    "task": key,
                    "id": pid,
                    "args": args
                });
            //});
        });

        if(callback){
            promise.then(callback);
            return this;
        }
        else {

            return promise;
        }
    };
}

function create(factory, is_node_js, worker_path){

    let worker;

    worker = is_node_js ?
        // This eval will be removed when compiling, it isn't there in final build

            typeof module !== "undefined"
                ? (0, eval)('new (require("worker_threads")["Worker"])(__dirname + "/node/node.js")')
                //: (0,eval)('new ((await import("worker_threads"))["Worker"])(import.meta.dirname + "/worker/node.mjs")')
                //: (0,eval)('new ((await import("worker_threads"))["Worker"])((1,eval)(\"import.meta.dirname\") + "/node/node.mjs")')
                : (0, eval)('import("worker_threads").then(function(worker){ return new worker["Worker"]((1,eval)(\"import.meta.dirname\") + "/node/node.mjs"); })')
                //: import("worker_threads").then(function(worker){ return new worker["Worker"](import.meta.dirname + "/worker/node.mjs"); })

        //eval('new (require("worker_threads")["Worker"])(__dirname + "/node/node.js")')
    :(
        factory ?
            new window.Worker(URL.createObjectURL(
                new Blob(
                    ["onmessage=" + handler.toString()],
                    { "type": "text/javascript" }
                )
            ))
        :
            new window.Worker(is_string(worker_path) ? worker_path : import.meta.url.replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", "module/worker/worker.js") /*"worker/worker.js"*/, { type: "module" })
    );

    return worker;
}

function apply_async(prototype){
    register.call(prototype, "add");
    register.call(prototype, "append");
    register.call(prototype, "search");
    register.call(prototype, "update");
    register.call(prototype, "remove");
    // prototype.addAsync = prototype.add;
    // prototype.appendAsync = prototype.append;
    // prototype.searchAsync = prototype.search;
    // prototype.updateAsync = prototype.update;
    // prototype.removeAsync = prototype.remove;
}

// let cycle;
// let budget = 0;
//
// function tick(resolve){
//     cycle = null;
//     budget = 0;
//     resolve();
// }

/*

automatisch
 */

/**
 * @param {!string} key
 * @this {Index|Document}
 */

function register(key){
    this[key + "Async"] = function(){

        // // prevent stack overflow of adding too much tasks to the same event loop
        // // actually limit stack to 1,000,000 tasks every ~4ms
        // cycle || (
        //     cycle = new Promise(resolve => setTimeout(tick, 0, resolve))
        // );
        //
        // // apply different performance budgets
        // if(key === "update" || key === "remove" && this.fastupdate === false){
        //     budget += 1000 * this.resolution;
        //     if(this.depth)
        //         budget += 1000 * this.resolution_ctx;
        // }
        // else if(key === "search"){
        //     budget++;
        // }
        // else{
        //     budget += 20 * this.resolution;
        //     if(this.depth)
        //         budget += 20 * this.resolution_ctx;
        // }
        //
        // // wait for the event loop cycle
        // if(budget >= 1e6){
        //     await cycle;
        // }

        const args = /*[].slice.call*/(arguments);
        const arg = args[args.length - 1];
        let callback;

        if(typeof arg === "function"){
            callback = arg;
            delete args[args.length - 1];
        }

        //this.async = true;
        const res = this[key].apply(this, args);
        //this.async = false;
        if(callback){
            res.then
                ? res.then(callback)
                : callback(res);
        }
        return res;
    };
}

// TODO return promises instead of inner await


function async(callback, self, field, key, index_doc, index, data, on_done){

    //setTimeout(function(){

        const res = callback(field ? field + "." + key : key, JSON.stringify(data));

        // await isn't supported by ES5

        if(res && res["then"]){

            res["then"](function(){

                self.export(callback, self, field, index_doc, index + 1, on_done);
            });
        }
        else {

            self.export(callback, self, field, index_doc, index + 1, on_done);
        }
    //});
}

/**
 * @param callback
 * @param self
 * @param field
 * @param index_doc
 * @param index
 * @param on_done
 * @this {Index|Document}
 */

function exportIndex(callback, self, field, index_doc, index, on_done){

    let return_value = true;
    if (typeof on_done === 'undefined') {
        return_value = new Promise((resolve) => {
            on_done = resolve;
        });
    }

    let key, data;

    switch(index || (index = 0)){

        case 0:

            key = "reg";

            // fastupdate isn't supported by export

            if(this.fastupdate){

                data = create_object();

                for(let key of this.reg.keys()){

                    data[key] = 1;
                }
            }
            else {

                data = this.reg;
            }

            break;

        case 1:

            key = "cfg";
            data = {
                "doc": 0,
                "opt": this.optimize ? 1 : 0
            };

            break;

        case 2:

            key = "map";
            data = this.map;
            break;

        case 3:

            key = "ctx";
            data = this.ctx;
            break;

        default:

            if (typeof field === 'undefined' && on_done) {

                on_done();
            }

            return;
    }

    async(callback, self || this, field, key, index_doc, index, data, on_done);

    return return_value;
}

/**
 * @this Index
 */

function importIndex(key, data){

    if(!data){

        return;
    }

    if(is_string(data)){

        data = JSON.parse(data);
    }

    switch(key){

        case "cfg":

            this.optimize = !!data["opt"];
            break;

        case "reg":

            // fastupdate isn't supported by import

            this.fastupdate = false;
            this.reg = data;
            break;

        case "map":

            this.map = data;
            break;

        case "ctx":

            this.ctx = data;
            break;
    }
}

/**
 * @this Document
 */

function exportDocument(callback, self, field, index_doc, index, on_done){

    let return_value;
    if (typeof on_done === 'undefined') {
        return_value = new Promise((resolve) => {
            on_done = resolve;
        });
    }

    index || (index = 0);
    index_doc || (index_doc = 0);

    if(index_doc < this.field.length){

        const field = this.field[index_doc];
        const idx = this.index[field];

        self = this;

        //setTimeout(function(){

            if(!idx.export(callback, self, index ? field/*.replace(":", "-")*/ : "", index_doc, index++, on_done)){

                index_doc++;
                index = 1;

                self.export(callback, self, field, index_doc, index, on_done);
            }
        //});
    }
    else {

        let key, data;

        switch(index){

            case 1:

                key = "tag";
                data = this.tagindex;
                field = null;
                break;

            case 2:

                key = "store";
                data = this.store;
                field = null;
                break;

            // case 3:
            //
            //     key = "reg";
            //     data = this.register;
            //     break;

            default:

                on_done();
                return;
        }

        async(callback, this, field, key, index_doc, index, data, on_done);
    }
    
    return return_value
}

/**
 * @this Document
 */

function importDocument(key, data){

    if(!data){

        return;
    }

    if(is_string(data)){

        data = JSON.parse(data);
    }

    switch(key){

        case "tag":

            this.tagindex = data;
            break;

        case "reg":

            // fastupdate isn't supported by import

            this.fastupdate = false;
            this.reg = data;

            for(let i = 0, index; i < this.field.length; i++){

                index = this.index[this.field[i]];
                index.reg = data;
                index.fastupdate = false;
            }

            break;

        case "store":

            this.store = data;
            break;

        default:

            key = key.split(".");
            const field = key[0];
            key = key[1];

            if(field && key){

                this.index[field].import(key, data);
            }
    }
}

/*
reg: "1,2,3,4,5,6,7,8,9"
map: "gulliver:1,2,3|4,5,6|7,8,9;"
ctx: "gulliver+travel:1,2,3|4,5,6|7,8,9;"
*/

/**
 * @this Index
 * @param {boolean} withFunctionWrapper
 * @return {string}
 */

function serialize(withFunctionWrapper = true){

    if(!this.reg.size) return "";

    let reg = '';
    let type = "";
    for(const key of this.reg.keys()){
        type || (type = typeof key);
        reg += (reg ? ',' : '') + (type === "string" ? '"' + key + '"' : key);
    }
    reg = 'index.reg=new Set([' + reg + ']);';

    let map = '';
    for(const item of this.map.entries()){
        const key = item[0];
        const value = item[1];
        let res = '';
        for(let i = 0, ids; i < value.length; i++){
            ids = value[i] || [''];
            let str = '';
            for(let j = 0; j < ids.length; j++){
                str += (str ? ',' : '') + (type === "string" ? '"' + ids[j] + '"' : ids[j]);
            }
            str = '[' + str + ']';
            res += (res ? ',' : '') + str;
        }
        res = '["' + key + '",[' + res + ']]';
        map += (map ? ',' : '') + res;
    }
    map = "index.map=new Map([" + map + "]);";

    let ctx = '';
    for(const context of this.ctx.entries()){
        const key_ctx = context[0];
        const value_ctx = context[1];

        for(const item of value_ctx.entries()){
            const key = item[0];
            const value = item[1];

            let res = '';
            for(let i = 0, ids; i < value.length; i++){
                ids = value[i] || [''];
                let str = '';
                for(let j = 0; j < ids.length; j++){
                    str += (str ? ',' : '') + (type === "string" ? '"' + ids[j] + '"' : ids[j]);
                }
                str = '[' + str + ']';
                res += (res ? ',' : '') + str;
            }
            res = 'new Map([["' + key + '",[' + res + ']]])';
            res = '["' + key_ctx + '",' + res + ']';
            ctx += (ctx ? ',' : '') +  res;
        }
    }
    ctx = "index.ctx=new Map([" + ctx + "]);";

    return withFunctionWrapper
        ? "function inject(index){" + reg + map + ctx + "}"
        : reg + map + ctx
}

// export function exportSnapshot(flexsearch){
//
//     if(!flexsearch.reg.size) return;
//
//     let reg = '';
//     let type = "";
//     for(const key of flexsearch.reg.keys()){
//         type || (type = typeof key);
//         reg += (reg ? ',' : '') + (type === "string" ? '"' + key + '"' : key);
//     }
//     reg = "f.reg=[" + reg + "];";
//
//     let map = '';
//     for(const item of flexsearch.map.entries()){
//         const key = item[0];
//         const value = item[1];
//         let res = '';
//         for(let i = 0, ids; i < value.length; i++){
//             ids = value[i] || [''];
//             let str = '';
//             for(let j = 0; j < ids.length; j++){
//                 str += (str ? ',' : '') + (type === "string" ? '"' + ids[j] + '"' : ids[j]);
//             }
//             str = "[
//             res += (res ? '|' : '') + str;
//         }
//         map += (map ? ';' : '') + key + ':' + res;
//     }
//
//
//     let ctx = '';
//     for(const context of flexsearch.ctx.entries()){
//         const key_ctx = context[0];
//         const value_ctx = context[1];
//
//         for(const item of value_ctx.entries()){
//             const key = item[0];
//             const value = item[1];
//
//             let res = '';
//             for(let i = 0, ids; i < value.length; i++){
//                 ids = value[i] || [''];
//                 let str = '';
//                 for(let j = 0; j < ids.length; j++){
//                     str += (str ? ',' : '') + (type === "string" ? '"' + ids[j] + '"' : ids[j]);
//                 }
//                 res += (res ? '|' : '') + str;
//             }
//             ctx += (ctx ? ';' : '') + key_ctx + '+' + key + ':' + res;
//         }
//     }
//
//     return reg + '#' + map + '#' + ctx;
// }
//
// export function importSnapshot(flexsearch, input){
//
//     if(!input) return;
//
//     let pos_reg = input.indexOf("#");
//     const reg = input.substring(0, pos_reg).split(",");
//     flexsearch.reg = new Set(reg);
//
//     let pos_map = input.indexOf("#", pos_reg + 1);
//     const map = input.substring(pos_reg + 1, pos_map).split(";").map(res => {
//         const split = res.split(":");
//         split[1] = split[1].split("|").map(ids => ids ? ids.split(",") : null);
//         return split;
//     });
//     flexsearch.map = new Map(map);
//
//     input = input.substring(pos_map + 1);
//     if(input){
//         const ctx = input.split(";").map(res => {
//             const split = res.split(":");
//             const context = split[0].split("+");
//             const map = new Map([
//                 [context[1], split[1].split("|").map(ids => ids ? ids.split(",") : null)]
//             ]);
//             return [context[0], map]
//         });
//         flexsearch.ctx = new Map(ctx);
//     }
// }

// KeystoreObj.prototype.destroy = function(){
//     this.index = null;
//     this.keys = null;
//     this.proxy = null;
// };

function _slice(self, start, end, splice){
    let arr = [];
    for(let i = 0, index; i < self.index.length; i++){
        index = self.index[i];
        if(start >= index.length){
            start -= index.length;
        }
        else {
            const tmp = index[splice ? "splice" : "slice"](start, end);
            const length = tmp.length;
            if(length){
                arr = arr.length
                    ? arr.concat(tmp)
                    : tmp;
                end -= length;
                if(splice) self.length -= length;
                if(!end) break;
            }
            start = 0;
        }
    }
    return arr;
}

/**
 * @param arr
 * @constructor
 */

function KeystoreArray(arr){

    if(!this){
        return new KeystoreArray(arr);
    }

    this.index = arr ? [arr] : [];
    this.length = arr ? arr.length : 0;
    const self = this;

    return /*this.proxy =*/ new Proxy([], {
        get(target, key) {
            if(key === "length"){
                return self.length;
            }
            if(key === "push"){
                return function(value){
                    self.index[self.index.length - 1].push(value);
                    self.length++;
                }
            }
            if(key === "pop"){
                return function(){
                    if(self.length){
                        self.length--;
                        return self.index[self.index.length - 1].pop();
                    }
                }
            }
            if(key === "indexOf"){
                return function(key){
                    let index = 0;
                    for(let i = 0, arr, tmp; i < self.index.length; i++){
                        arr = self.index[i];
                        //if(!arr.includes(key)) continue;
                        tmp = arr.indexOf(key);
                        if(tmp >= 0) return index + tmp;
                        index += arr.length;
                    }
                    return -1;
                }
            }
            if(key === "includes"){
                return function(key){
                    for(let i = 0; i < self.index.length; i++){
                        if(self.index[i].includes(key)){
                            return true;
                        }
                    }
                    return false;
                }
            }
            if(key === "slice"){
                return function(start, end){
                    return _slice(
                        self,
                        start || 0,
                        end || self.length,
                        false
                    );
                }
            }
            if(key === "splice"){
                return function(start, end){
                    return _slice(
                        self,
                        start || 0,
                        end || self.length,
                        // splice:
                        true
                    );
                }
            }
            if(key === "constructor"){
                return Array;
            }
            if(typeof key === "symbol" /*|| isNaN(key)*/){
                // not supported
                return;
            }
            const index = key / (2**31) | 0;
            const arr = self.index[index];
            return arr && arr[key];
        },
        set(target, key, value){
            const index = key / (2**31) | 0;
            const arr = self.index[index] || (self.index[index] = []);
            arr[key] = value;
            self.length++;
            return true;
        }
    });
}

KeystoreArray.prototype.clear = function(){
    this.index.length = 0;
};

KeystoreArray.prototype.destroy = function(){
    this.index = null;
    this.proxy = null;
};

KeystoreArray.prototype.push = function(val){};

/**
 * @param bitlength
 * @constructor
 */

function KeystoreMap(bitlength = 8){

    if(!this){
        return new KeystoreMap(bitlength);
    }

    this.index = create_object();
    this.refs = [];
    this.size = 0;

    if(bitlength > 32){
        this.crc = lcg64;
        this.bit = BigInt(bitlength);
    }
    else {
        this.crc = lcg$1;
        this.bit = bitlength;
    }
}

KeystoreMap.prototype.get = function(key) {
    const address = this.crc(key);
    const map = this.index[address];
    return map && map.get(key);
};

KeystoreMap.prototype.set = function(key, value){
    const address = this.crc(key);
    let map = this.index[address];
    if(map){
        let size = map.size;
        map.set(key, value);
        size -= map.size;
        size && this.size++;
    }
    else {
        this.index[address] = map = new Map([[key, value]]);
        this.refs.push(map);
    }
};

/**
 * @param bitlength
 * @constructor
 */

function KeystoreSet(bitlength = 8){

    if(!this){
        return new KeystoreSet(bitlength);
    }

    // using plain Object with numeric key access
    // just for max performance
    this.index = create_object();
    this.refs = [];

    if(bitlength > 32){
        this.crc = lcg64;
        this.bit = BigInt(bitlength);
    }
    else {
        this.crc = lcg$1;
        this.bit = bitlength;
    }
}

KeystoreSet.prototype.add = function(key){
    const address = this.crc(key);
    let set = this.index[address];
    if(set){
        let size = set.size;
        set.add(key);
        size -= set.size;
        size && this.size++;
    }
    else {
        this.index[address] = set = new Set([key]);
        this.refs.push(set);
    }
};

KeystoreMap.prototype.has =
KeystoreSet.prototype.has = function(key) {
    const address = this.crc(key);
    const map_or_set = this.index[address];
    return map_or_set && map_or_set.has(key);
};

/*
KeystoreMap.prototype.size =
KeystoreSet.prototype.size = function(){
    let size = 0;
    const values = Object.values(this.index);
    for(let i = 0; i < values.length; i++){
        size += values[i].size;
    }
    return size;
};
*/

KeystoreMap.prototype.delete =
KeystoreSet.prototype.delete = function(key){
    const address = this.crc(key);
    const map_or_set = this.index[address];
    // set && (set.size === 1
    //     ? this.index.delete(address)
    //     : set.delete(key));
    map_or_set &&
    map_or_set.delete(key) &&
    this.size--;
};

KeystoreMap.prototype.clear =
KeystoreSet.prototype.clear = function(){
    this.index = create_object();
    this.refs = [];
    this.size = 0;
};

// KeystoreMap.prototype.destroy =
// KeystoreSet.prototype.destroy = function(){
//     this.index = null;
//     this.refs = null;
//     this.proxy = null;
// };

KeystoreMap.prototype.values =
KeystoreSet.prototype.values = function*(){
    // alternatively iterate through this.keys[]
    //const refs = Object.values(this.index);
    for(let i = 0; i < this.refs.length; i++){
        for(let value of this.refs[i].values()){
            yield value;
        }
    }
};

KeystoreMap.prototype.keys =
KeystoreSet.prototype.keys = function*(){
    //const values = Object.values(this.index);
    for(let i = 0; i < this.refs.length; i++){
        for(let key of this.refs[i].keys()){
            yield key;
        }
    }
};

KeystoreMap.prototype.entries =
KeystoreSet.prototype.entries = function*(){
    //const values = Object.values(this.index);
    for(let i = 0; i < this.refs.length; i++){
        for(let entry of this.refs[i].entries()){
            yield entry;
        }
    }
};

/**
 * Linear Congruential Generator (LCG)
 * @param str
 * @this {KeystoreMap|KeystoreSet}
 */

function lcg$1(str) {
    let range = 2 ** this.bit - 1;
    if(typeof str == "number"){
        return str & range;
    }
    let crc = 0, bit = this.bit + 1;
    for(let i = 0; i < str.length; i++) {
        crc = (crc * bit ^ str.charCodeAt(i)) & range;
    }
    // shift Int32 to UInt32 because negative numbers
    // extremely slows down key lookup
    return this.bit === 32
        ? crc + 2 ** 31
        : crc;// & 0xFFFF;
}

/**
 * @param str
 * @this {KeystoreMap|KeystoreSet}
 */

function lcg64(str) {
    let range = BigInt(2) ** /** @type {!BigInt} */ (this.bit) - BigInt(1);
    let type = typeof str;
    if(type === "bigint"){
        return /** @type {!BigInt} */ (str) & range;
    }
    if(type === "number"){
        return BigInt(str) & range;
    }
    let crc = BigInt(0), bit = /** @type {!BigInt} */ (this.bit) + BigInt(1);
    for(let i = 0; i < str.length; i++){
        crc = (crc * bit ^ BigInt(str.charCodeAt(i))) & range;
    }
    return crc;// & 0xFFFFFFFFFFFFFFFF;
}

// COMPILER BLOCK -->

/**
 *
 * @param id
 * @param content
 * @param {boolean=} _append
 * @returns {Document|Promise}
 */

Document.prototype.add = function(id, content, _append){

    if(is_object(id)){

        content = id;
        id = parse_simple(content, this.key);
    }

    if(content && (id || (id === 0))){

        if(!_append && this.reg.has(id)){
            return this.update(id, content);
        }

        // this.field does not include db tag indexes
        for(let i = 0, tree; i < this.field.length; i++){

            tree = this.tree[i];

            const index = this.index.get(this.field[i]);
            if(typeof tree === "function"){
                const tmp = tree(content);
                if(tmp){
                    index.add(id, tmp, /* append: */ false, /* skip update: */ true);
                }
            }
            else {
                const filter = tree._filter;
                if(filter && !filter(content)){
                    continue;
                }
                if(tree.constructor === String){
                    tree = ["" + tree];
                }
                else if(is_string(tree)){
                    tree = [tree];
                }
                add_index(content, tree, this.marker, 0, index, id, tree[0], _append);
            }
        }

        if(this.tag){

            //console.log(this.tag, this.tagtree)

            for(let x = 0; x < this.tagtree.length; x++){

                let tree = this.tagtree[x];
                let field = this.tagfield[x];
                let ref = this.tag.get(field);
                let dupes = create_object();
                let tags;

                if(typeof tree === "function"){
                    tags = tree(content);
                    if(!tags) continue;
                }
                else {
                    const filter = tree._filter;
                    if(filter && !filter(content)){
                        continue;
                    }
                    if(tree.constructor === String){
                        tree = "" + tree;
                    }
                    tags = parse_simple(content, tree);
                }

                if(!ref || !tags){
                    ref || (console.warn("Tag '" + field + "' was not found"));
                    continue;
                }

                if(is_string(tags)){
                    tags = [tags];
                }

                for(let i = 0, tag, arr; i < tags.length; i++){

                    tag = tags[i];
                    //console.log(this.tag, tag, key, field)

                    if(!dupes[tag]){
                        dupes[tag] = 1;

                        let tmp;
                        tmp = ref.get(tag);
                        tmp ? arr = tmp : ref.set(tag, arr = []);

                        if(!_append || ! /** @type {!Array|KeystoreArray} */(arr).includes(id)){

                            // auto-upgrade to keystore array if max size exceeded
                            {
                                if(arr.length === 2**31-1 /*|| !(arr instanceof KeystoreArray)*/){
                                    const keystore = new KeystoreArray(arr);
                                    if(this.fastupdate){
                                        for(let value of this.reg.values()){
                                            if(value.includes(arr)){
                                                value[value.indexOf(arr)] = keystore;
                                            }
                                        }
                                    }
                                    ref.set(tag, arr = keystore);
                                }
                            }

                            arr.push(id);

                            // add a reference to the register for fast updates
                            if(this.fastupdate){
                                const tmp = this.reg.get(id);
                                tmp ? tmp.push(arr)
                                    : this.reg.set(id, [arr]);
                            }
                        }
                    }
                }
            }
        }

        if(this.store && (!_append || !this.store.has(id))){

            let payload;

            if(this.storetree){

                payload = create_object();

                for(let i = 0, tree; i < this.storetree.length; i++){
                    tree = this.storetree[i];

                    const filter = tree._filter;
                    if(filter && !filter(content)){
                        continue;
                    }
                    let custom;
                    if(typeof tree === "function"){
                        custom = tree(content);
                        if(!custom) continue;
                        tree = [tree._field];
                    }
                    else if(is_string(tree) || tree.constructor === String){
                        payload[tree] = content[tree];
                        continue;
                    }

                    store_value(content, payload, tree, 0, tree[0], custom);
                }
            }

            this.store.set(id, payload || content);
        }
    }

    return this;
};

// TODO support generic function created from string when tree depth > 1

/**
 * @param obj
 * @param store
 * @param tree
 * @param pos
 * @param key
 * @param {*=} custom
 */

function store_value(obj, store, tree, pos, key, custom){

    obj = obj[key];

    // reached target field
    if(pos === (tree.length - 1)){

        // store target value
        store[key] = custom || obj;
    }
    else if(obj){

        if(is_array(obj)){

            store = store[key] = new Array(obj.length);

            for(let i = 0; i < obj.length; i++){
                // do not increase pos (an array is not a field)
                store_value(obj, store, tree, pos, i);
            }
        }
        else {

            store = store[key] || (store[key] = create_object());
            key = tree[++pos];
            store_value(obj, store, tree, pos, key);
        }
    }
}

function add_index(obj, tree, marker, pos, index, id, key, _append){

    if((obj = obj[key])){

        // reached target field
        if(pos === (tree.length - 1)){

            // handle target value
            if(is_array(obj)){

                // append array contents so each entry gets a new scoring context
                if(marker[pos]){
                    for(let i = 0; i < obj.length; i++){
                        index.add(id, obj[i], /* append: */ true, /* skip update: */ true);
                    }
                    return;
                }

                // or join array contents and use one scoring context
                obj = obj.join(" ");
            }

            index.add(id, obj, _append, /* skip_update: */ true);
        }
        else {

            if(is_array(obj)){
                for(let i = 0; i < obj.length; i++){
                    // do not increase index, an array is not a field
                    add_index(obj, tree, marker, pos, index, id, i, _append);
                }
            }
            else {
                key = tree[++pos];
                add_index(obj, tree, marker, pos, index, id, key, _append);
            }
        }
    }
    else {
        if(index.db){
            index.remove(id);
        }
    }
}

// COMPILER BLOCK -->

/*

 from -> result[
    res[score][id],
    res[score][id],
 ]

 to -> [id]

*/

/**
 * @param arrays
 * @param {number} resolution
 * @param limit
 * @param offset
 * @param suggest
 * @param {number=} boost
 * @param {boolean=} resolve
 * @returns {Array}
 */

function intersect$1(arrays, resolution, limit, offset, suggest, boost, resolve) {

    const length = arrays.length;

    let result = [];
    let check;
    let count;

    // alternatively the results could be sorted by length up
    //arrays.sort(sort_by_length_up);

    check = create_object();

    for(let y = 0, ids, id, res_arr, tmp; y < resolution; y++){

        for(let x = 0; x < length; x++){

            res_arr = arrays[x];

            if(y < res_arr.length && (ids = res_arr[y])){

                for(let z = 0; z < ids.length; z++){

                    id = ids[z];

                    if((count = check[id])){
                        check[id]++;
                        // tmp.count++;
                        // tmp.sum += y;
                    }
                    else {
                        count = 0;
                        check[id] = 1;
                        // check[id] = {
                        //     count: 1,
                        //     sum: y
                        // };
                    }

                    tmp = result[count] || (result[count] = []);

                    if(!resolve){
                        // boost everything after first result
                        let score = y + (x ? 0 : boost || 0);
                        tmp = tmp[score] || (tmp[score] = []);
                    }

                    tmp.push(id);
                }
            }
        }
    }

    // result.sort(function(a, b){
    //     return check[a] - check[b];
    // });

    const result_len = result.length;

    if(result_len){

        if(!suggest){

            if(result_len < length){
                return [];
            }

            result = result[result_len - 1];

            if(limit || offset){
                if(resolve){
                    if((result.length > limit) || offset){
                        result = result.slice(offset, limit + offset);
                    }
                }
                else {
                    const final = [];
                    for(let i = 0, arr; i < result.length; i++){
                        arr = result[i];
                        if(arr.length > offset){
                            offset -= arr.length;
                            continue;
                        }
                        if((arr.length > limit) || offset){
                            arr = arr.slice(offset, limit + offset);
                            limit -= arr.length;
                            if(offset) offset -= arr.length;
                        }
                        final.push(arr);
                        if(!limit){
                            break;
                        }
                    }
                    return final.length > 1
                        ? concat(final)
                        : final[0];
                }
            }
        }
        else {

            result = result.length > 1
                ? union$1(result, offset, limit, resolve, 0)
                : result[0];
        }
    }

    return result;
}

function union$1(arrays, offset, limit, resolve, boost){

    const result = [];
    const check = create_object();
    let ids, id, arr_len = arrays.length, ids_len, count = 0;

    if(!resolve){

        let maxres = get_max_len(arrays);

        for(let k = 0; k < maxres; k++){

            for(let i = arr_len - 1; i >= 0; i--){

                ids = arrays[i][k];
                ids_len = ids && ids.length;

                if(ids_len) for(let j = 0; j < ids_len; j++){

                    id = ids[j];

                    if(!check[id]){
                        check[id] = 1;
                        if(offset){
                            offset--;
                        }
                        else {
                            let score = k + (i < arr_len - 1 ? boost || 0 : 0);
                            const arr = result[score] || (result[score] = []);
                            arr.push(id);
                            if(++count === limit){
                                return result;
                            }
                        }
                    }
                }
            }
        }
    }
    else {

        for(let i = arr_len - 1; i >= 0; i--){

            ids = arrays[i];
            ids_len = ids.length;

            for(let j = 0; j < ids_len; j++){

                id = ids[j];

                if(!check[id]){
                    check[id] = 1;
                    if(offset){
                        offset--;
                    }
                    else {
                        result.push(id);
                        if(result.length === limit){
                            return result;
                        }
                    }
                }
            }
        }
    }

    return result;
}

/**
 * @param {Array<number|string>} mandatory
 * @param {Array<Array<number|string>>} arrays
 * @returns {Array<number|string>}
 */

function intersect_union(mandatory, arrays) {

    const check = create_object();
    const result = [];

    for(let x = 0, ids; x < arrays.length; x++){
        ids = arrays[x];
        for(let i = 0; i < ids.length; i++){
            check[ids[i]] = 1;
        }
    }

    for(let i = 0, id; i < mandatory.length; i++){
        id = mandatory[i];
        if(check[id] === 1){
            result.push(id);
            check[id] = 2;
        }
    }

    return result;
}

// export function intersect_union(mandatory, arrays, resolution) {
//
//     const check = create_object();
//     const union = create_object();
//     const result = [];
//
//     for(let x = 0; x < mandatory.length; x++){
//         check[mandatory[x]] = 1;
//     }
//
//
//     for(let y = 0, ids, id; y < resolution; y++){
//         for(let x = 0; x < arrays.length; x++){
//
//             ids = arrays[x];
//
//             if(y < ids.length){
//
//                 id = ids[y];
//
//                 if(check[id]){
//
//                     if(!union[id]){
//
//                         union[id] = 1;
//                         result.push(id);
//                     }
//                 }
//             }
//         }
//     }
//
//     return result;
// }

//
// /**
//  * Implementation based on Object[key] provides better suggestions
//  * capabilities and has less performance scaling issues on large indexes.
//  *
//  * @param arrays
//  * @param limit
//  * @param offset
//  * @param {boolean|Array=} suggest
//  * @param {boolean=} resolve
//  * @returns {Array}
//  */
//
// export function intersect(arrays, limit, offset, suggest, resolve) {
//
//     const length = arrays.length;
//
//     // todo remove
//     // if(length < 2){
//     //     throw new Error("Not optimized intersect");
//     // }
//
//     let result = [];
//     let size = 0;
//     let check;
//     let check_suggest;
//     let check_new;
//     let res_arr;
//
//     if(suggest){
//         suggest = [];
//     }
//
//     // 1. a reversed order prioritize the order of words from a query
//     //    because it ends with the first term.
//     // 2. process terms in reversed order often has advantage for
//     //    the fast path "end reached".
//
//     // alternatively the results could be sorted by length up
//     //arrays.sort(sort_by_length_up);
//
//     // todo the outer loop should be the res array instead of term array,
//     // this isn't just simple because the intersection calculation needs to reflect this
//     //const maxlen = get_max_len(arrays);
//
//     for(let x = length - 1, found; x >= 0; x--){
//     //for(let x = 0, found; x < length; x++){
//
//         res_arr = arrays[x];
//         check_new = create_object();
//         found = !check;
//
//         // process relevance in forward order (direction is
//         // important for adding IDs during the last round)
//
//         for(let y = 0, ids; y < res_arr.length; y++){
//
//             ids = res_arr[y];
//             if(!ids || !ids.length) continue;
//
//             for(let z = 0, id; z < ids.length; z++){
//
//                 id = ids[z];
//
//                 // check exists starting from the 2nd slot
//                 if(check){
//                     if(check[id]){
//
//                         // check if in last round
//                         if(!x){
//                         //if(x === length - 1){
//
//                             if(offset){
//                                 offset--;
//                             }
//                             else{
//
//                                 result[size++] = id;
//
//                                 if(size === limit){
//                                     // fast path "end reached"
//                                     return result /*resolve === false
//                                         ? { result, suggest }
//                                         :*/
//                                 }
//                             }
//                         }
//
//                         if(x || suggest){
//                         //if((x < length - 1) || suggest){
//                             check_new[id] = 1;
//                         }
//
//                         found = true;
//                     }
//
//                     if(suggest){
//
//                         if(!check_suggest[id]){
//                             check_suggest[id] = 1;
//                             const arr = suggest[y] || (suggest[y] = []);
//                             arr.push(id);
//                         }
//
//                         // OLD:
//                         //
//                         // check_idx = (check_suggest[id] || 0) + 1;
//                         // check_suggest[id] = check_idx;
//                         //
//                         // // do not adding IDs which are already included in the result (saves one loop)
//                         // // the first intersection match has the check index 2, so shift by -2
//                         //
//                         // if(check_idx < length){
//                         //
//                         //     const tmp = suggest[check_idx - 2] || (suggest[check_idx - 2] = []);
//                         //     tmp[tmp.length] = id;
//                         // }
//                     }
//                 }
//                 else{
//
//                     // pre-fill in first round
//                     check_new[id] = 1;
//                 }
//             }
//         }
//
//         if(suggest){
//
//             // re-use the first pre-filled check for suggestions
//             check || (check_suggest = check_new);
//         }
//         else if(!found){
//
//             return [];
//         }
//
//         check = check_new;
//     }
//
//     // return intermediate result
//     // if(resolve === false){
//     //     return { result, suggest };
//     // }
//
//     if(suggest){
//
//         // needs to iterate in reverse direction
//         for(let x = suggest.length - 1, ids, len; x >= 0; x--){
//
//             ids = suggest[x];
//             len = ids.length;
//
//             for(let y = 0, id; y < len; y++){
//
//                 id = ids[y];
//
//                 if(!check[id]){
//
//                     if(offset){
//                         offset--;
//                     }
//                     else{
//
//                         result[size++] = id;
//
//                         if(size === limit){
//                             // fast path "end reached"
//                             return result;
//                         }
//                     }
//
//                     check[id] = 1;
//                 }
//             }
//         }
//     }
//
//     return result;
// }

/**
 * Implementation based on Array.includes() provides better performance,
 * but it needs at least one word in the query which is less frequent.
 * Also on large indexes it does not scale well performance-wise.
 * This strategy also lacks of suggestion capabilities (matching & sorting).
 *
 * @param arrays
 * @param limit
 * @param offset
 * @param {boolean|Array=} suggest
 * @returns {Array}
 */

// export function intersect(arrays, limit, offset, suggest) {
//
//     const length = arrays.length;
//     let result = [];
//     let check;
//
//     // determine shortest array and collect results
//     // from the sparse relevance arrays
//
//     let smallest_size;
//     let smallest_arr;
//     let smallest_index;
//
//     for(let x = 0; x < length; x++){
//
//         const arr = arrays[x];
//         const len = arr.length;
//
//         let size = 0;
//
//         for(let y = 0, tmp; y < len; y++){
//
//             tmp = arr[y];
//
//             if(tmp){
//
//                 size += tmp.length;
//             }
//         }
//
//         if(!smallest_size || (size < smallest_size)){
//
//             smallest_size = size;
//             smallest_arr = arr;
//             smallest_index = x;
//         }
//     }
//
//     smallest_arr = smallest_arr.length === 1 ?
//
//         smallest_arr[0]
//     :
//         concat(smallest_arr);
//
//     if(suggest){
//
//         suggest = [smallest_arr];
//         check = create_object();
//     }
//
//     let size = 0;
//     let steps = 0;
//
//     // process terms in reversed order often results in better performance.
//     // the outer loop must be the words array, using the
//     // smallest array here disables the "fast fail" optimization.
//
//     for(let x = length - 1; x >= 0; x--){
//
//         if(x !== smallest_index){
//
//             steps++;
//
//             const word_arr = arrays[x];
//             const word_arr_len = word_arr.length;
//             const new_arr = [];
//
//             let count = 0;
//
//             for(let z = 0, id; z < smallest_arr.length; z++){
//
//                 id = smallest_arr[z];
//
//                 let found;
//
//                 // process relevance in forward order (direction is
//                 // important for adding IDs during the last round)
//
//                 for(let y = 0; y < word_arr_len; y++){
//
//                     const arr = word_arr[y];
//
//                     if(arr.length){
//
//                         found = arr.includes(id);
//
//                         if(found){
//
//                             // check if in last round
//
//                             if(steps === length - 1){
//
//                                 if(offset){
//
//                                     offset--;
//                                 }
//                                 else{
//
//                                     result[size++] = id;
//
//                                     if(size === limit){
//
//                                         // fast path "end reached"
//
//                                         return result;
//                                     }
//                                 }
//
//                                 if(suggest){
//
//                                     check[id] = 1;
//                                 }
//                             }
//
//                             break;
//                         }
//                     }
//                 }
//
//                 if(found){
//
//                     new_arr[count++] = id;
//                 }
//             }
//
//             if(suggest){
//
//                 suggest[steps] = new_arr;
//             }
//             else if(!count){
//
//                 return [];
//             }
//
//             smallest_arr = new_arr;
//         }
//     }
//
//     if(suggest){
//
//         // needs to iterate in reverse direction
//
//         for(let x = suggest.length - 1, arr, len; x >= 0; x--){
//
//             arr = suggest[x];
//             len = arr && arr.length;
//
//             if(len){
//
//                 for(let y = 0, id; y < len; y++){
//
//                     id = arr[y];
//
//                     if(!check[id]){
//
//                         check[id] = 1;
//
//                         if(offset){
//
//                             offset--;
//                         }
//                         else{
//
//                             result[size++] = id;
//
//                             if(size === limit){
//
//                                 // fast path "end reached"
//
//                                 return result;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
//
//     return result;
// }

// COMPILER BLOCK -->

/**
 * @param {!string|DocumentSearchOptions} query
 * @param {number|DocumentSearchOptions=} limit
 * @param {DocumentSearchOptions=} options
 * @param {Array<Array>=} _promises For internal use only.
 * @returns {Promise|Array}
 */

Document.prototype.search = function(query, limit, options, _promises){

    if(!options){
        if(!limit && is_object(query)){
            options = /** @type {DocumentSearchOptions} */ (query);
            query = "";
        }
        else if(is_object(limit)){
            options = /** @type {DocumentSearchOptions} */ (limit);
            limit = 0;
        }
    }

    let result = [], result_field = [];
    let pluck, enrich, merge, suggest;
    let field, tag, offset, count = 0, highlight;

    if(options){

        if(is_array(options)){
            options = {
                index: options
            };
        }

        query = options.query || query;
        pluck = options.pluck;
        merge = options.merge;
        field = pluck || options.field || options.index;
        tag = this.tag && options.tag;
        enrich = this.store && options.enrich;
        suggest = options.suggest;
        highlight = options.highlight;
        //resolve = !SUPPORT_RESOLVER || (options.resolve !== false);
        limit = options.limit || limit;
        offset = options.offset || 0;
        limit || (limit = 100);

        if(tag && (!this.db || !_promises)){

            if(tag.constructor !== Array){
                tag = [tag];
            }

            let pairs = [];

            for(let i = 0, field; i < tag.length; i++){
                field = tag[i];
                if(is_string(field)){
                    throw new Error("A tag option can't be a string, instead it needs a { field: tag } format.");
                }
                // default array notation
                if(field.field && field.tag){
                    const value = field.tag;
                    if(value.constructor === Array){
                        for(let k = 0; k < value.length; k++){
                            pairs.push(field.field, value[k]);
                        }
                    }
                    else {
                        pairs.push(field.field, value);
                    }
                }
                // shorter object notation
                else {
                    const keys = Object.keys(field);
                    for(let j = 0, key, value; j < keys.length; j++){
                        key = keys[j];
                        value = field[key];
                        if(value.constructor === Array){
                            for(let k = 0; k < value.length; k++){
                                pairs.push(key, value[k]);
                            }
                        }
                        else {
                            pairs.push(key, value);
                        }
                    }
                }
            }

            if(!pairs.length){
                throw new Error("Your tag definition within the search options is probably wrong. No valid tags found.");
            }

            // tag used as pairs from this point
            tag = pairs;

            // when tags is used and no query was set,
            // then just return the tag indexes
            if(!query){

                let promises = [];
                if(pairs.length) for(let j = 0; j < pairs.length; j+=2){
                    let ids;
                    if(this.db){
                        const index = this.index.get(pairs[j]);
                        if(!index){
                            {
                                console.warn("Tag '" + pairs[j] + ":" + pairs[j + 1] + "' will be skipped because there is no field '" + pairs[j] + "'.");
                            }
                            continue;
                        }
                        promises.push(ids = index.db.tag(pairs[j + 1], limit, offset, enrich));
                    }
                    else {
                        ids = get_tag.call(this, pairs[j], pairs[j + 1], limit, offset, enrich);
                    }
                    result.push({
                        "field": pairs[j],
                        "tag": pairs[j + 1],
                        "result": ids
                    });
                }

                if(promises.length){
                    return Promise.all(promises).then(function(promises){
                        for(let j = 0; j < promises.length; j++){
                            result[j].result = promises[j];
                        }
                        return result;
                    });
                }

                return result;
            }
        }

        // extend to multi field search by default
        if(is_string(field)){
            field = [field];
        }
    }

    field || (field = this.field);
    let promises = !_promises && (this.worker || this.db /*|| this.async*/) && [];
    let db_tag_search;

    // multi field search
    // field could be a custom set of selected fields by this query
    // db tag indexes are also included in this field list
    for(let i = 0, res, key, len; i < field.length; i++){

        key = field[i];

        if(this.db && this.tag){
            // tree is missing when it is a tag-only index (db)
            if(!this.tree[i]){
                continue;
            }
        }

        let field_options;

        if(!is_string(key)){
            field_options = key;
            key = field_options.field;
            query = field_options.query || query;
            limit = field_options.limit || limit;
            offset = field_options.offset || offset;
            suggest = (field_options.suggest || suggest);
            enrich = this.store && (field_options.enrich || enrich);
        }

        if(_promises){
            res = _promises[i];
        }
        else {
            let opt = field_options || options;
            let index = this.index.get(key);

            if(tag){
                if(this.db){
                    opt.tag = tag;
                    db_tag_search = index.db.support_tag_search;
                    opt.field = field;
                }
                if(!db_tag_search){
                    opt.enrich = false;
                }
            }
            if(promises){
                promises[i] = index.search/*Async*/(query, limit, opt);
                // restore enrich state
                opt && enrich && (opt.enrich = enrich);
                // just collect and continue
                continue;
            }
            else {
                res = index.search(query, limit, opt);
                // restore enrich state
                opt && enrich && (opt.enrich = enrich);
            }
        }

        len = res && res.length;

        // todo when no term was matched but tag was retrieved extend suggestion to tags
        // every field has to intersect against all selected tag fields
        if(tag && len){

            const arr = [];
            let count = 0;

            // tags are only applied in resolve phase when it's a db
            if(this.db && _promises){
                if(!db_tag_search){

                    // retrieve tag results assigned to it's field
                    for(let y = field.length; y < _promises.length; y++){

                        let ids = _promises[y];
                        let len = ids && ids.length;

                        if(len){
                            count++;
                            arr.push(ids);
                        }
                        else if(!suggest){
                            // no tags found
                            return result;
                        }
                    }
                }
            }
            else {

                // tag[] are pairs at this line
                for(let y = 0, ids, len; y < tag.length; y+=2){
                    ids = this.tag.get(tag[y]);

                    if(!ids){
                        {
                            console.warn("Tag '" + tag[y] + ":" + tag[y + 1] + "' will be skipped because there is no field '" + tag[y] + "'.");
                        }
                        if(suggest){
                            continue;
                        }
                        else {
                            return result;
                        }
                    }

                    ids = ids && ids.get(tag[y + 1]);
                    len = ids && ids.length;

                    if(len){
                        count++;
                        arr.push(ids);
                    }
                    else if(!suggest){
                        // no tags found
                        return result;
                    }
                }
            }

            if(count){
                res = intersect_union(res, arr); // intersect(arr, limit, offset)
                len = res.length;
                if(!len && !suggest){
                    // nothing matched
                    return result;
                }
                // move counter back by 1
                count--;
            }
        }

        if(len){
            result_field[count] = key;
            result.push(res);
            count++;
        }
        else if(field.length === 1){
            // fast path: nothing matched
            return result;
        }
    }

    if(promises){
        if(this.db){
            // todo when a tag index is never a search index this could be extracted
            // push tag promises to the end
            if(tag && tag.length && !db_tag_search){
                for(let y = 0; y < tag.length; y += 2){
                    // it needs to retrieve data from tag pairs
                    const index = this.index.get(tag[y]);
                    if(!index){
                        {
                            console.warn("Tag '" + tag[y] + ":" + tag[y + 1] + "' was not found because there is no field '" + tag[y] + "'.");
                        }
                        if(suggest){
                            continue;
                        }
                        else {
                            return result;
                        }
                    }
                    promises.push(index.db.tag(tag[y + 1], limit, offset, /* enrich */ false));
                }
            }
        }

        const self = this;

        // TODO unroll this recursion
        return Promise.all(promises).then(function(result){
            return result.length
                ? self.search(query, limit, options, /* promises: */ result)
                : result;
        });
    }

    if(!count){
        return result;
    }
    if(pluck && (!enrich || !this.store)){
        return result[0];
    }

    promises = [];

    for(let i = 0, res; i < result_field.length; i++){

        res = result[i];

        if(enrich && res.length && !res[0].doc){
            if(!this.db){
                if(res.length){
                    res = apply_enrich.call(this, res);
                }
            }
            else {
                // the documents are stored on the first field
                promises.push(res = this.index.get(this.field[0]).db.enrich(res));
            }
        }

        if(pluck){
            return res;
        }

        result[i] = {
            "field": result_field[i],
            "result": res
        };
    }

    if(enrich && SUPPORT_PERSISTENT && this.db && promises.length){
        const self = this;
        return Promise.all(promises).then(function(promises){
            for(let j = 0; j < promises.length; j++){
                result[j]["result"] = promises[j];
            }
            return merge
                ? merge_fields(result, limit)
                : highlight
                    ? highlight_fields(result, query, self.index, self.field, self.tree, highlight)
                    : result;
        });
    }

    return merge
        ? merge_fields(result, limit)
        : highlight
            ? highlight_fields(result, query, this.index, this.field, this.tree, highlight)
            : result;
};

/*

 some matching term


 */

function highlight_fields(result, query, index, field, tree, template, limit, offset){

    // if(typeof template === "string"){
    //     template = new RegExp(template, "g");
    // }

    let encoder;

    for(let i = 0, res, field, enc, path; i < result.length; i++){

        res = result[i].result;
        field = result[i].field;
        enc = index.get(field).encoder;
        path = tree[field.indexOf(field)];

        if(enc !== encoder){
            encoder = enc;
            encoder.encode(query);
        }

        for(let j = 0; j < res.length; j++){
            let str = "";
            let content = parse_simple(res[j].doc, path);

            let split = encoder.encode(content);

            for(let k = 0; k < split.length; k++){
                str += split[k].replace(new RegExp("(" + split[k] + ")", "g"), template.replace("$1", content));
            }

            console.log(result,index,  template);

            res[j].highlight = str;
        }
    }

    return result;
}

// todo support Resolver
// todo when searching through multiple fields each term should
//      be found at least by one field to get a valid match without
//      using suggestion explicitly

function merge_fields(fields, limit, offset){
    const final = [];
    const set = create_object();
    for(let i = 0, field, res; i < fields.length; i++){
        field = fields[i];
        res = field.result;
        for(let j = 0, id, entry, tmp; j < res.length; j++){
            entry = res[j];
            id = entry.id;
            tmp = set[id];
            if(!tmp){
                // offset was already applied on field indexes
                // if(offset){
                //     offset--;
                //     continue;
                // }
                // apply limit from last round, because just fields could
                // be pushed without adding new results
                if(final.length === limit){
                    return final;
                }
                entry.field = set[id] = [field.field];
                final.push(entry);
            }
            else {
                tmp.push(field.field);
            }
        }
    }
    return final;
}

/**
 * @this Document
 */

function get_tag(tag, key, limit, offset, enrich){
    let res = this.tag.get(tag);
    if(!res){
        console.warn("Tag '" + tag + "' was not found");
        return [];
    }
    res = res && res.get(key);
    let len = res && (res.length - offset);

    if(len && (len > 0)){
        if((len > limit) || offset){
            res = res.slice(offset, offset + limit);
        }
        if(enrich){
            res = apply_enrich.call(this, res);
        }
        return res;
    }
}

/**
 * @this Document
 */

function apply_enrich(res){

    const arr = new Array(res.length);

    for(let x = 0, id; x < res.length; x++){
        id = res[x];
        arr[x] = {
            "id": id,
            "doc": this.store.get(id)
        };
    }

    return arr;
}

/**!
 * FlexSearch.js
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */


/**
 * @constructor
 * @param {!DocumentOptions} options
 */

function Document(options){

    if(!this) {
        return new Document(options);
    }

    /** @type DocumentDescriptor */
    const document = options.document || options.doc || options;
    let tmp, keystore;

    this.tree = [];
    this.field = [];
    this.marker = [];
    this.key = ((tmp = document.key || document.id) && parse_tree(tmp, this.marker)) || "id";

    keystore = (options.keystore || 0);
    keystore && (this.keystore = keystore);
    this.fastupdate = !!options.fastupdate;
    this.reg = this.fastupdate
        ? (keystore && SUPPORT_KEYSTORE ? new KeystoreMap(keystore) : new Map())
        : (keystore && SUPPORT_KEYSTORE ? new KeystoreSet(keystore) : new Set());

    {
        // todo support custom filter function
        this.storetree = (tmp = document.store || null) && tmp !== true && [];
        this.store = tmp && (
            keystore && SUPPORT_KEYSTORE
                ? new KeystoreMap(keystore)
                : new Map()
        );
    }

    {
        this.cache = (tmp = options.cache || null) && new CacheClass(tmp);
        // do not apply cache again for the indexes since .searchCache()
        // is just a wrapper over .search()
        options.cache = false;
    }

    {
        this.worker = options.worker;
    }

    // if(SUPPORT_ASYNC){
    //     // this switch is used by recall of promise callbacks
    //     this.async = false;
    // }

    /**
     * @type {Map<Index>}
     * @export
     */
    this.index = parse_descriptor.call(this, options, document);

    {
        this.tag = null;
        // TODO case-insensitive tags?
        if((tmp = document.tag)){
            if(typeof tmp === "string"){
                tmp = [tmp];
            }
            if(tmp.length){
                this.tag = new Map();
                this.tagtree = [];
                this.tagfield = [];
                for(let i = 0, params, field; i < tmp.length; i++){
                    params = tmp[i];
                    field = params.field || params;
                    if(!field){
                        throw new Error("The tag field from the document descriptor is undefined.");
                    }
                    if(params.custom){
                        this.tagtree[i] = params.custom;
                    }
                    else {
                        this.tagtree[i] = parse_tree(field, this.marker);
                        if(params.filter){
                            if(typeof this.tagtree[i] === "string"){
                                // it needs an object to put a property to it
                                this.tagtree[i] = new String(this.tagtree[i]);
                            }
                            this.tagtree[i]._filter = params.filter;
                        }
                    }
                    // the tag fields needs to be hold by indices
                    this.tagfield[i] = field;
                    this.tag.set(field, new Map());
                }
            }
        }
    }

    // resolve worker promises and swap instances
    if(this.worker){
        const promises = [];
        for(const index of this.index.values()){
            index.then && promises.push(index);
        }
        if(promises.length){
            const self = this;
            return Promise.all(promises).then(function(promises){
                let count = 0;
                for(const item of self.index.entries()){
                    const key = item[0];
                    const index = item[1];
                    index.then && self.index.set(key, promises[count++]);
                }
                return self;
            });
        }
    }
    else {
        options.db && this.mount(options.db);
    }
}

{

    Document.prototype.mount = function(db){

        let fields = this.field;

        if(this.tag){
            // tag indexes are referenced by field
            // move tags to their field indexes respectively
            for(let i = 0, field; i < this.tagfield.length; i++){
                field = this.tagfield[i];
                let index;// = this.index.get(field);
                //if(!index){
                    // create raw index when not exists
                    this.index.set(field, index = new Index({}, this.reg));
                    // copy and push to the field selection
                    if(fields === this.field){
                        fields = fields.slice(0);
                    }
                    // tag indexes also needs to be upgraded to db instances
                    fields.push(field);
                //}
                // assign reference
                index.tag = this.tag.get(field);
            }
        }

        const promises = [];
        const config = {
            db: db.db,
            type: db.type,
            fastupdate: db.fastupdate
        };

        // upgrade all indexes to db instances
        for(let i = 0, index, field; i < fields.length; i++){
            config.field = field = fields[i];
            index = this.index.get(field);
            const dbi = new db.constructor(db.id, config);
            // take over the storage id
            dbi.id = db.id;
            promises[i] = dbi.mount(index);
            // add an identification property
            index.document = true;
            if(i){
                // the register has to export just one time
                // also it's needed by the index for ID contain check
                index.bypass = true;
            }
            else {
                // the datastore has to export one time
                index.store = this.store;
            }
        }

        //this.async = true;
        this.db = true;
        return Promise.all(promises);
    };

    Document.prototype.commit = async function(replace, append){
        // parallel:
        const promises = [];
        for(const index of this.index.values()){
            promises.push(index.db.commit(index, replace, append));
        }
        await Promise.all(promises);
        this.reg.clear();
        // queued:
        // for(const index of this.index.values()){
        //     await index.db.commit(index, replace, append);
        // }
        // this.reg.clear();
    };

    Document.prototype.destroy = function(){
        const promises = [];
        for(const idx of this.index.values()){
            promises.push(idx.destroy());
        }
        return Promise.all(promises);
    };
}

/**
 * @this Document
 */

function parse_descriptor(options, document){

    const index = new Map();
    let field = document.index || document.field || document;

    if(is_string(field)){
        field = [field];
    }

    for(let i = 0, key, opt; i < field.length; i++){

        key = field[i];

        if(!is_string(key)){
            opt = key;
            key = key.field;
        }

        opt = /** @type DocumentIndexOptions */ (
            is_object(opt)
                ? Object.assign({}, options, opt)
                : options
        );

        if(this.worker){
            const worker = new WorkerIndex(opt);
            if(worker){
                // worker could be a promise
                // it needs to be resolved and swapped later
                index.set(key, worker);
            }
            else {
                // fallback when not supported
                this.worker = false;
            }
        }

        if(!this.worker){
            index.set(key, new Index(opt, this.reg));
        }

        if(opt.custom){
            this.tree[i] = opt.custom;
        }
        else {
            this.tree[i] = parse_tree(key, this.marker);
            if(opt.filter){
                if(typeof this.tree[i] === "string"){
                    // it needs an object to put a property to it
                    this.tree[i] = new String(this.tree[i]);
                }
                this.tree[i]._filter = opt.filter;
            }
        }

        this.field[i] = key;
    }

    if(this.storetree){

        let stores = document.store;
        if(is_string(stores)) stores = [stores];

        for(let i = 0, store, field; i < stores.length; i++){
            store = /** @type Array<StoreOptions> */ (stores[i]);
            field = store.field || store;
            if(store.custom){
                this.storetree[i] = store.custom;
                store.custom._field = field;
            }
            else {
                this.storetree[i] = parse_tree(field, this.marker);
                if(store.filter){
                    if(typeof this.storetree[i] === "string"){
                        // it needs an object to put a property to it
                        this.storetree[i] = new String(this.storetree[i]);
                    }
                    this.storetree[i]._filter = store.filter;
                }
            }
        }
    }

    return index;
}

function parse_tree(key, marker){

    const tree = key.split(":");
    let count = 0;

    for(let i = 0; i < tree.length; i++){
        key = tree[i];
        // todo apply some indexes e.g. [0], [-1], [0-2]
        if(key[key.length - 1] === "]"){
            key = key.substring(0, key.length - 2);
            if(key){
                marker[count] = true;
            }
        }
        if(key){
            tree[count++] = key;
        }
    }

    if(count < tree.length){
        tree.length = count;
    }

    return count > 1 ? tree : tree[0];
}

Document.prototype.append = function(id, content){
    return this.add(id, content, true);
};

Document.prototype.update = function(id, content){
   return this.remove(id).add(id, content);
};

Document.prototype.remove = function(id){

    if(is_object(id)){
        id = parse_simple(id, this.key);
    }

    for(const index of this.index.values()){
        index.remove(id, /* skip deletion */ true);
    }

    if(this.reg.has(id)){

        if(this.tag){
            // when fastupdate was enabled all ids are already removed
            if(!this.fastupdate){
                for(let field of this.tag.values()){
                    for(let item of field){
                        const tag = item[0];
                        const ids = item[1];
                        const pos = ids.indexOf(id);
                        if(pos > -1){
                            ids.length > 1
                                ? ids.splice(pos, 1)
                                : field.delete(tag);
                        }
                    }
                }
            }
        }

        if(this.store){
            this.store.delete(id);
        }

        this.reg.delete(id);
    }

    // the cache could be used outside the InMemory store
    if(this.cache){
        this.cache.remove(id);
    }

    return this;
};

Document.prototype.clear = function(){

    //const promises = [];

    for(const index of this.index.values()){
        // db index will add clear task
        index.clear();
        // const promise = index.clear();
        // if(promise instanceof Promise){
        //     promises.push(promise);
        // }
    }

    if(this.tag){
        for(const tags of this.tag.values()){
            tags.clear();
        }
    }

    if(this.store){
        this.store.clear();
    }

    return this; /*promises.length
        ? Promise.all(promises)
        :*/
};

Document.prototype.contain = function(id){

    if(this.db){
        return this.index.get(this.field[0]).db.has(id);
    }

    return this.reg.has(id);
};

Document.prototype.cleanup = function(){

    for(const index of this.index.values()){
        index.cleanup();
    }

    return this;
};

{

    Document.prototype.get = function(id){

        if(this.db){
            return this.index.get(this.field[0]).db.enrich(id).then(function(result){
                return result[0] && result[0].doc;
            });
        }

        return this.store.get(id);
    };

    Document.prototype.set = function(id, store){

        this.store.set(id, store);
        return this;
    };
}

{
    // todo mo
    Document.prototype.searchCache = searchCache;
}

{

    Document.prototype.export = exportDocument;
    Document.prototype.import = importDocument;
}

{

    apply_async(Document.prototype);
}

/**
 * @param {string|Object} query
 * @param {number|Object=} limit
 * @param {Object=} options
 * @this {Index|Document}
 * @returns {Array<number|string>|Promise}
 */

function searchCache(query, limit, options){

    query = (typeof query === "object"
        ? "" + query.query
        : "" + query
    ).toLowerCase();

    //let encoded = this.encoder.encode(query).join(" ");
    let cache = this.cache.get(query);
    if(!cache){
        cache = this.search(query, limit, options);
        if(cache.then){
            const self = this;
            cache.then(function(cache){
                self.cache.set(query, cache);
                return cache;
            });
        }
        this.cache.set(query, cache);
    }
    return cache;
}

/**
 * @param {boolean|number=} limit
 * @constructor
 */

function CacheClass(limit){
    /** @private */
    this.limit = (!limit || limit === true) ? 1000 : limit;
    /** @private */
    this.cache = new Map();
    /** @private */
    this.last = "";
}

CacheClass.prototype.set = function(key, value){
    //if(!this.cache.has(key)){
        this.cache.set(this.last = key, value);
        if(this.cache.size > this.limit){
            this.cache.delete(this.cache.keys().next().value);
        }
    //}
};

CacheClass.prototype.get = function(key){
    const cache = this.cache.get(key);
    if(cache && this.last !== key){
        this.cache.delete(key);
        this.cache.set(this.last = key, cache);
    }
    return cache;
};

CacheClass.prototype.remove = function(id){
    for(const item of this.cache){
        const key = item[0];
        const value = item[1];
        if(value.includes(id)){
            this.cache.delete(key);
        }
    }
};

CacheClass.prototype.clear = function(){
    this.cache.clear();
    this.last = "";
};

/** @type EncoderOptions */
const options$9 = {
    normalize: false,
    dedupe: false
};

/** @type EncoderOptions */
const options$8 = {
    normalize: function(str){
        return str.toLowerCase();
    },
    dedupe: false
};

/** @type EncoderOptions */
const options$7 = {
    normalize: true,
    dedupe: true
};

const soundex$1 = new Map([
    ["b", "p"],
    //["p", "p"],

    //["f", "f"],
    ["v", "f"],
    ["w", "f"],

    //["s", "s"],
    ["z", "s"],
    ["x", "s"],

    ["d", "t"],
    //["t", "t"],

    //["m", "m"],
    ["n", "m"],

    //["k", "k"],
    ["c", "k"],
    ["g", "k"],
    ["j", "k"],
    ["q", "k"],

    //["r", "r"],
    //["h", "h"],
    //["l", "l"],

    //["a", "a"],

    //["e", "e"],
    ["i", "e"],
    ["y", "e"],

    //["o", "o"],
    ["u", "o"]
]);

/** @type EncoderOptions */
const options$6 = {
    normalize: true,
    dedupe: true,
    mapper: soundex$1
};

const matcher = new Map([
    //["ai", "ei"], // before soundex
    ["ae", "a"],
    ["oe", "o"],
    //["ue", "u"], // soundex map
    ["sh", "s"], // replacer "h"
    //["ch", "c"], // before soundex
    ["kh", "k"], // after soundex
    ["th", "t"], // replacer "h"
    //["ph", "f"],
    ["pf", "f"]
]);

const replacer = [
    /([^aeo])h(.)/g, "$1$2",
    /([aeo])h([^aeo]|$)/g, "$1$2",
    /([^0-9])\1+/g, "$1"
];

/** @type EncoderOptions */
const options$5 = {
    normalize: true,
    dedupe: true,
    mapper: soundex$1,
    matcher: matcher,
    replacer: replacer
};

const compact = [
    /(?!^)[aeo]/g, "" // before soundex: aeoy, old: aioy
];

/** @type EncoderOptions */
const options$4 = {
    normalize: true,
    dedupe: true,
    mapper: soundex$1,
    replacer: replacer.concat(compact),
    matcher: matcher
};

/** @type EncoderOptions */
const options$3 = {
    normalize: true,
    dedupe: false,
    include: {
        letter: true
    },
    finalize: function(arr){
        for(let i = 0; i < arr.length; i++){
            arr[i] = soundex(arr[i]);
        }
    }
};

const codes = {
    "a": "", "e": "", "i": "", "o": "", "u": "", "y": "",
    "b": 1, "f": 1, "p": 1, "v": 1,
    "c": 2, "g": 2, "j": 2, "k": 2, "q": 2, "s": 2, "x": 2, "z": 2, "ß": 2,
    "d": 3, "t": 3,
    "l": 4,
    "m": 5, "n": 5,
    "r": 6
};

function soundex(stringToEncode){

    let encodedString = stringToEncode.charAt(0);
    let last = codes[encodedString];
    for(let i = 1, char; i < stringToEncode.length; i++){
        char = stringToEncode.charAt(i);
        // Remove all occurrences of "h" and "w"
        if(char !== "h" && char !== "w"){
            // Replace all consonants with digits
            char = codes[char];
            // Remove all occurrences of a,e,i,o,u,y except first letter
            if(char){
                // Replace all adjacent same digits with one digit
                if(char !== last){
                    encodedString += char;
                    last = char;
                    if(encodedString.length === 4){
                        break;
                    }
                }
            }
        }
    }
    // while(encodedString.length < 4){
    //     encodedString += "0";
    // }
    return encodedString;
}

const regex$2 = /[\x00-\x7F]+/g;

/** @type EncoderOptions */
const options$2 = {
    rtl: true,
    normalize: false,
    dedupe: true,
    prepare: function(str){
        return ("" + str).replace(regex$2, " ")
    }
};

const regex$1 = /[\x00-\x7F]+/g;

/** @type EncoderOptions */
const options$1 = {
    normalize: false,
    dedupe: true,
    split: "",
    prepare: function(str){
        return ("" + str).replace(regex$1, "")
    }
};

const regex = /[\x00-\x7F]+/g;

/** @type EncoderOptions */
const options = {
    normalize: false,
    dedupe: true,
    prepare: function(str){
        return ("" + str).replace(regex, " ")
    }
};

// export const global_lang = create_object();
//export const global_charset = create_object();

var Charset = {
    LatinExact: options$9,
    LatinDefault: options$8,
    LatinSimple: options$7,
    LatinBalance: options$6,
    LatinAdvanced: options$5,
    LatinExtra: options$4,
    LatinSoundex: options$3,
    ArabicDefault: options$2,
    CjkDefault: options$1,
    CyrillicDefault: options
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

// COMPILER BLOCK -->

/**
 * @enum {Object}
 * @const
 */

const presets = {

    "memory": {
        resolution: 1
    },

    "performance": {
        resolution: 6,
        fastupdate: true,
        context: {
            depth: 1,
            resolution: 3
        }
    },

    "match": {
        tokenize: "forward"
    },

    "score": {
        resolution: 9,
        context: {
            depth: 2,
            resolution: 9
        }
    }
};

/**
 *
 * @param {!IndexOptions|string} options
 * @return {IndexOptions}
 */

function apply_preset(options){

    const preset = is_string(options)
        ? options
        : options["preset"];

    if(preset){
        if(!presets[preset]){
            console.warn("Preset not found: " + preset);
        }
        options = Object.assign({}, presets[preset], /** @type {Object} */ (options));
    }

    return options;
}

const data = create_object();

/**
 * @param {!string} name
 */

function tick(name){

    /** @type {!Object<string, number>} */
    const profiler = data["profiler"] || (data["profiler"] = {});

    profiler[name] || (profiler[name] = 0);
    profiler[name]++;
}

// COMPILER BLOCK -->
// <-- COMPILER BLOCK

let table;// = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
let timer;
const cache = new Map();

function toRadix(number, radix = 255) {

    if(!table){
        table = new Array(radix);
        // the char code 0 could be a special marker
        for(let i = 0; i < radix; i++) table[i] = i + 1;
        table = String.fromCharCode.apply(null, table);
    }

    let rixit;
    let residual = number;
    let result = "";

    while(true){
        rixit = residual % radix;
        result = table.charAt(rixit) + result;
        residual = residual / radix | 0;
        if(!residual)
            break;
    }

    return result;
}

function default_compress(str){

    {
        if(timer){
            if(cache.has(str)){
                return cache.get(str);
            }
        }
        else {
            timer = setTimeout(clear);
        }
    }

    /* 2 ** ((level + 1.5) * 1.6 | 0) */

    const result = toRadix(
        typeof str == "number"
            ? str
            : lcg(str)
    );

    {
        cache.size > 2e5 && cache.clear();
        cache.set(str, result);
    }

    return result;
}

function lcg(str) {
    let range = 2 ** 32 - 1;
    if(typeof str == "number"){
        return str & range;
    }
    let crc = 0, bit = 32 + 1;
    for(let i = 0; i < str.length; i++) {
        crc = (crc * bit ^ str.charCodeAt(i)) & range;
    }
    // shift up from Int32 to UInt32 range 0xFFFFFFFF
    return crc + 2 ** 31;
}

function clear(){
    timer = null;
    cache.clear();
}

// COMPILER BLOCK -->

// TODO:
// string + number as text
// boolean, null, undefined as ?


/**
 * @param {!number|string} id
 * @param {!string} content
 * @param {boolean=} _append
 * @param {boolean=} _skip_update
 */

Index.prototype.add = function(id, content, _append, _skip_update){

    if(content && (id || (id === 0))){

        // todo check skip_update
        //_skip_update = false;

        if(!_skip_update && !_append){
            if(this.reg.has(id)){
                return this.update(id, content);
            }
        }

        // do not force a string as input
        // https://github.com/nextapps-de/flexsearch/issues/432
        content = this.encoder.encode(content);
        const word_length = content.length;

        if(word_length){

            // check context dupes to skip all contextual redundancy along a document

            const dupes_ctx = create_object();
            const dupes = create_object();
            const depth = this.depth;
            const resolution = this.resolution;

            for(let i = 0; i < word_length; i++){

                let term = content[this.rtl ? word_length - 1 - i : i];
                let term_length = term.length;

                // skip dupes will break the context chain

                if(term_length /*&& (term_length >= this.minlength)*/ && (depth || !dupes[term])){

                    let score = this.score
                        ? this.score(content, term, i, null, 0)
                        : get_score(resolution, word_length, i);
                    let token = "";

                    switch(this.tokenize){

                        case "full":
                            if(term_length > 2){
                                for(let x = 0; x < term_length; x++){
                                    for(let y = term_length; y > x; y--){

                                        //if((y - x) >= this.minlength){
                                        token = term.substring(x, y);
                                        const partial_score = this.score
                                            ? this.score(content, term, i, token, x)
                                            : get_score(resolution, word_length, i, term_length, x);
                                        this.push_index(dupes, token, partial_score, id, _append);
                                        //}
                                    }
                                }
                                break;
                            }
                        // fallthrough to next case when term length < 3
                        case "reverse":
                            // skip last round (this token exist already in "forward")
                            if(term_length > 1){
                                for(let x = term_length - 1; x > 0; x--){
                                    token = term[x] + token;
                                    //if(token.length >= this.minlength){
                                    const partial_score = this.score
                                        ? this.score(content, term, i, token, x)
                                        : get_score(resolution, word_length, i, term_length, x);
                                    this.push_index(dupes, token, partial_score, id, _append);
                                    //}
                                }
                                token = "";
                            }

                        // fallthrough to next case to apply forward also
                        case "forward":
                            if(term_length > 1){
                                for(let x = 0; x < term_length; x++){
                                    token += term[x];
                                    //if(token.length >= this.minlength){
                                    this.push_index(dupes, token, score, id, _append);
                                    //}
                                }
                                break;
                            }

                        // fallthrough to next case when token has a length of 1
                        default:
                            // case "strict":

                            // todo move boost to search
                            // if(this.boost){
                            //     score = Math.min((score / this.boost(content, term, i)) | 0, resolution - 1);
                            // }

                            this.push_index(dupes, term, score, id, _append);

                            // context is just supported by tokenizer "strict"
                            if(depth){

                                if((word_length > 1) && (i < (word_length - 1))){

                                    // check inner dupes to skip repeating words in the current context
                                    const dupes_inner = create_object();
                                    const resolution = this.resolution_ctx;
                                    const keyword = term;
                                    const size = Math.min(depth + 1, word_length - i);

                                    dupes_inner[keyword] = 1;

                                    for(let x = 1; x < size; x++){

                                        term = content[this.rtl ? word_length - 1 - i - x : i + x];

                                        if(term /*&& (term.length >= this.minlength)*/ && !dupes_inner[term]){

                                            dupes_inner[term] = 1;

                                            const context_score = this.score
                                                ? this.score(content, keyword, i, term, x)
                                                : get_score(resolution + ((word_length / 2) > resolution ? 0 : 1), word_length, i, size - 1, x - 1);
                                            const swap = this.bidirectional && (term > keyword);
                                            this.push_index(dupes_ctx, swap ? keyword : term, context_score, id, _append, swap ? term : keyword);
                                        }
                                    }
                                }
                            }
                    }
                }
            }

            this.fastupdate || this.reg.add(id);
        }
        else {
            content = "";
        }
    }

    if(this.db){
        // when the term has no valid content (e.g. empty),
        // then it was not added to the ID registry for removal
        content || this.commit_task.push({ "del": id });
        this.commit_auto && autoCommit(this);
    }

    return this;
};

/**
 * @private
 * @param dupes
 * @param term
 * @param score
 * @param id
 * @param {boolean=} append
 * @param {string=} keyword
 */

Index.prototype.push_index = function(dupes, term, score, id, append, keyword){

    let arr = keyword ? this.ctx : this.map;
    let tmp;

    if(!dupes[term] || (keyword && !(tmp = dupes[term])[keyword])){

        if(keyword){

            dupes = tmp || (dupes[term] = create_object());
            dupes[keyword] = 1;

            if(this.compress){
                keyword = default_compress(keyword);
            }

            tmp = arr.get(keyword);
            tmp ? arr = tmp
                : arr.set(keyword, arr = new Map());
        }
        else {

            dupes[term] = 1;
        }

        if(this.compress){
            term = default_compress(term);
        }

        tmp = arr.get(term);
        tmp ? arr = tmp : arr.set(term, arr = tmp = []);
        // the ID array will be upgraded dynamically
        arr = arr[score] || (arr[score] = []);

        if(!append || !arr.includes(id)){

            // auto-upgrade to keystore array if max size exceeded
            {
                if(arr.length === 2**31-1 /*|| !(arr instanceof KeystoreArray)*/){
                    const keystore = new KeystoreArray(arr);
                    if(this.fastupdate){
                        for(let value of this.reg.values()){
                            if(value.includes(arr)){
                                value[value.indexOf(arr)] = keystore;
                            }
                        }
                    }
                    tmp[score] = arr = keystore;
                }
            }

            arr.push(id);

            // add a reference to the register for fast updates
            if(this.fastupdate){
                const tmp = this.reg.get(id);
                tmp ? tmp.push(arr)
                    : this.reg.set(id, [arr]);
            }
        }
    }
};

/**
 * @param {number} resolution
 * @param {number} length
 * @param {number} i
 * @param {number=} term_length
 * @param {number=} x
 * @returns {number}
 */

function get_score(resolution, length, i, term_length, x){

    // console.log("resolution", resolution);
    // console.log("length", length);
    // console.log("term_length", term_length);
    // console.log("i", i);
    // console.log("x", x);
    // console.log((resolution - 1) / (length + (term_length || 0)) * (i + (x || 0)) + 1);

    // the first resolution slot is reserved for the best match,
    // when a query matches the first word(s).

    // also to stretch score to the whole range of resolution, the
    // calculation is shift by one and cut the floating point.
    // this needs the resolution "1" to be handled additionally.

    // do not stretch the resolution more than the term length will
    // improve performance and memory, also it improves scoring in
    // most cases between a short document and a long document

    return i && (resolution > 1) ? (

        (length + (term_length || 0)) <= resolution ?

            i + (x || 0)
        :
            ((resolution - 1) / (length + (term_length || 0)) * (i + (x || 0)) + 1) | 0
        ):
            0;
}

/*
 from -> res[score][id]
 to   -> [id]
*/

/**
 * Aggregate the union of a single raw result
 * @param {!Array} result
 * @param {!number} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 * @return Array<string|number>
 */

function resolve_default(result, limit, offset, enrich){

    // fast path: when there is just one slot in the result
    if(result.length === 1){
        result = result[0];
        result = offset || (result.length > limit)
            ? (limit
                ? result.slice(offset, offset + limit)
                : result.slice(offset)
            )
            : result;
        return enrich
            ? enrich_result(result)
            : result;
    }

    // this is an optimized workaround instead of
    // just doing result = concat(result)

    let final = [];

    for(let i = 0, arr, len; i < result.length; i++){
        if(!(arr = result[i]) || !(len = arr.length)) continue;

        if(offset){
            // forward offset pointer
            if(offset >= len){
                offset -= len;
                continue;
            }
            // apply offset pointer when length differs
            if(offset < len){
                arr = limit
                    ? arr.slice(offset, offset + limit)
                    : arr.slice(offset);
                len = arr.length;
                offset = 0;
            }
        }

        if(!final.length){
            // fast path: when limit was reached in first slot
            if(len >= limit){
                if(len > limit){
                    arr = arr.slice(0, limit);
                }
                return enrich
                    ? enrich_result(arr)
                    : arr;
            }
            final = [arr];
        }
        else {
            if(len > limit){
                arr = arr.slice(0, limit);
                len = arr.length;
            }
            final.push(arr);
        }

        // reduce limit
        limit -= len;

        // todo remove
        // if(limit < 0){
        //     throw new Error("Impl.Error");
        // }

        // break if limit was reached
        if(!limit){
            break;
        }
    }

    // todo remove
    if(!final.length){
        //throw new Error("No results found");
        return final;
    }

    final = final.length > 1
        ? concat(final)
        : final[0];

    return enrich
        ? enrich_result(final)
        : final;
}

function enrich_result(ids){
    for(let i = 0; i < ids.length; i++){
        ids[i] = {
            score: i,
            id: ids[i]
        };
    }
    return ids;
}

Resolver.prototype.or = function(){

    const self = this;
    let args = arguments;
    let first_argument = args[0];

    if(first_argument.then){
        return first_argument.then(function(){
            return self.or.apply(self, args);
        });
    }

    if(first_argument[0]){
        // fix false passed parameter style
        if(first_argument[0].index){
            return this.or.apply(this, first_argument);
        }
    }

    let final = [];
    let promises = [];
    let limit = 0, offset = 0, enrich, resolve;

    for(let i = 0, query; i < args.length; i++){

        query = /** @type {string|ResolverOptions} */ (
            args[i]
        );

        if(query){

            limit = query.limit || 0;
            offset = query.offset || 0;
            enrich = query.enrich;
            resolve = query.resolve;

            let result;
            if(query.constructor === Resolver){
                result = query.result;
            }
            else if(query.constructor === Array){
                result = query;
            }
            else if(query.index){
                query.resolve = false;
                result = query.index.search(query).result;
            }
            else if(query.and){
                result = this.and(query.and);
            }
            else if(query.xor){
                result = this.xor(query.xor);
            }
            else if(query.not){
                result = this.not(query.not);
            }
            else {
                continue;
            }

            final[i] = result;

            if(result.then){
                promises.push(result); //{ query, result };
            }
        }
    }

    if(promises.length){
        return Promise.all(promises).then(function(){
            //self.result.length && (final = [self.result].concat(final));
            // the suggest-union was re-used from but there it needs reversed order
            self.result.length && (final = final.concat([self.result]));
            self.result = union(final, limit, offset, enrich, resolve, self.boostval);
            return resolve ? self.result : self;
        });
    }

    if(final.length){
        //this.result.length && (final = [this.result].concat(final));
        // the suggest-union was re-used but there it needs reversed order
        this.result.length && (final = final.concat([this.result]));
        this.result = union(final, limit, offset, enrich, resolve, this.boostval);
    }
    return resolve ? this.result : this;
};

/**
 * Aggregate the union of N raw results
 * @param result
 * @param limit
 * @param offset
 * @param enrich
 * @param resolve
 * @param boost
 * @return {Array}
 */

function union(result, limit, offset, enrich, resolve, boost){

    if(!result.length){
        // todo remove
        //console.log("Empty Result")
        return result;
    }

    if(typeof limit === "object"){
        offset = limit.offset || 0;
        enrich = limit.enrich || false;
        limit = limit.limit || 0;
    }

    if(result.length < 2){
        // todo remove
        //console.log("Single Result")
        if(resolve){
            return resolve_default(result[0], limit, offset, enrich);
        }
        else {
            return result[0];
        }
    }

    // the suggest-union
    return union$1(result/*.reverse()*/, offset, limit, resolve, boost);

    // let final = [];
    // let count = 0;
    // let dupe = create_object();
    // let maxres = get_max_len(result);
    //
    // for(let j = 0, ids; j < maxres; j++){
    //     for(let i = 0, res; i < result.length; i++){
    //         res = result[i];
    //         if(!res) continue;
    //         ids = res[j];
    //         if(!ids) continue;
    //
    //         for(let k = 0, id; k < ids.length; k++){
    //             id = ids[k];
    //             if(!dupe[id]){
    //                 dupe[id] = 1;
    //                 if(offset){
    //                     offset--;
    //                     continue;
    //                 }
    //                 if(resolve){
    //                     final.push(id);
    //                 }
    //                 else{
    //                     // shift resolution by boost (inverse)
    //                     const index = j + (boost || 0);
    //                     final[index] || (final[index] = []);
    //                     final[index].push(id);
    //                 }
    //                 if(limit && ++count === limit){
    //                     //this.boost = 0;
    //                     return final;
    //                 }
    //             }
    //         }
    //     }
    // }
    //
    // //this.boost = 0;
    // return final;
}

Resolver.prototype.and = function(){
    if(this.result.length){

        const self = this;
        let args = arguments;
        let first_argument = args[0];

        if(first_argument.then){
            return first_argument.then(function(){
                return self.and.apply(self, args);
            });
        }

        if(first_argument[0]){
            // fix false passed parameter style
            if(first_argument[0].index){
                return this.and.apply(this, first_argument);
            }
        }

        let final = [];
        let promises = [];
        let limit = 0, offset = 0, enrich, resolve, suggest;

        for(let i = 0, query; i < args.length; i++){

            query = /** @type {string|ResolverOptions} */ (
                args[i]
            );

            if(query){

                limit = query.limit || 0;
                offset = query.offset || 0;
                enrich = query.enrich;
                resolve = query.resolve;
                suggest = query.suggest;

                let result;
                if(query.constructor === Resolver){
                    result = query.result;
                }
                else if(query.constructor === Array){
                    result = query;
                }
                else if(query.index){
                    query.resolve = false;
                    result = query.index.search(query).result;
                }
                else if(query.or){
                    result = this.or(query.or);
                }
                else if(query.xor){
                    result = this.xor(query.xor);
                }
                else if(query.not){
                    result = this.not(query.not);
                }
                else {
                    continue;
                }

                final[i] = result;

                if(result.then){
                    promises.push(result); //{ query, result };
                }
            }
        }

        if(!final.length){
            this.result = final;
            return resolve ? this.result : this;
        }

        if(promises.length){
            return Promise.all(promises).then(function(){
                final = [self.result].concat(final);
                self.result = intersect(final, limit, offset, enrich, resolve, self.boostval, suggest);
                return resolve ? self.result : self;
            });
        }

        final = [this.result].concat(final);
        this.result = intersect(final, limit, offset, enrich, resolve, this.boostval, suggest);
        return resolve ? this.result : this;
    }
    return this;
};

/**
 * Aggregate the intersection of N raw results
 * @param result
 * @param limit
 * @param offset
 * @param enrich
 * @param resolve
 * @param boost
 * @param suggest
 * @return {Array}
 */

function intersect(result, limit, offset, enrich, resolve, boost, suggest){

    // if(!result.length){
    //     // todo remove
    //     console.log("Empty Result")
    //     return result;
    // }

    if(result.length < 2){
        return [];
    }

    let final = [];
    let maxres = get_max_len(result);
    if(!maxres) return final;

    //console.log(result)

    return intersect$1(result, maxres, limit, offset, suggest, boost, resolve);

    // for(let j = 0, ids, res = result[0]; j < res.length; j++){
    //     ids = res[j];
    //     for(let k = 0; k < ids.length; k++){
    //         contain[ids[k]] = 1;
    //     }
    // }

    // for(let i = 0, res; i < result.length; i++){
    //     res = result[i];
    //     if(!res || !res.length) return [];
    //     let contain_new = create_object();
    //     let match = 0;
    //     let last_round = i === result.length - 1;
    //
    //     for(let j = 0, ids; j < maxres; j++){
    //         ids = res[j];
    //         if(!ids) continue;
    //
    //         for(let k = 0, id, min; k < ids.length; k++){
    //             id = ids[k];
    //             // fill in first round
    //             if(!i){
    //                 // shift resolution +1
    //                 // shift resolution by boost (inverse)
    //                 contain_new[id] = j + 1 + (i ? boost : 0);
    //                 match = 1;
    //             }
    //             // result in last round
    //             else if(last_round){
    //                 if((min = contain[id])){
    //                     match = 1;
    //                     //if(!contain_new[id]){
    //                     if(offset){
    //                         offset--;
    //                         continue;
    //                     }
    //                     if(resolve){
    //                         final.push(id);
    //                     }
    //                     else{
    //                         // reduce resolution -1
    //                         min--;
    //                         if(j < min) min = j;
    //                         final[min] || (final[min] = []);
    //                         final[min].push(id);
    //                     }
    //                     if(limit && ++count === limit){
    //                         //this.boost = 0;
    //                         return final;
    //                     }
    //                     // shift resolution +1
    //                     //contain_new[id] = min + 1;
    //                     //}
    //                 }
    //             }
    //             // check for intersection
    //             else if((min = contain[id])){
    //                 // shift resolution +1
    //                 if(j + 1 < min) min = j + 1;
    //                 contain_new[id] = min;
    //                 match = 1;
    //             }
    //         }
    //     }
    //
    //     if(!match){
    //         //this.boost = 0;
    //         return [];
    //     }
    //
    //     contain = contain_new;
    // }
    //
    // //this.boost = 0;
    // return final;
}

Resolver.prototype.xor = function(){
    const self = this;
    let args = arguments;
    let first_argument = args[0];

    if(first_argument.then){
        return first_argument.then(function(){
            return self.xor.apply(self, args);
        });
    }

    if(first_argument[0]){
        // fix false passed parameter style
        if(first_argument[0].index){
            return this.xor.apply(this, first_argument);
        }
    }

    let final = [];
    let promises = [];
    let limit = 0, offset = 0, enrich, resolve;

    for(let i = 0, query; i < args.length; i++){

        query = /** @type {string|ResolverOptions} */ (
            args[i]
        );

        if(query){

            limit = query.limit || 0;
            offset = query.offset || 0;
            enrich = query.enrich;
            resolve = query.resolve;

            let result;
            if(query.constructor === Resolver){
                result = query.result;
            }
            else if(query.constructor === Array){
                result = query;
            }
            else if(query.index){
                query.resolve = false;
                result = query.index.search(query).result;
            }
            else if(query.or){
                result = this.or(query.or);
            }
            else if(query.and){
                result = this.and(query.and);
            }
            else if(query.not){
                result = this.not(query.not);
            }
            else {
                continue;
            }

            final[i] = result;

            if(result.then){
                promises.push(result); //{ query, result };
            }
        }
    }

    if(promises.length){
        return Promise.all(promises).then(function(){
            self.result.length && (final = [self.result].concat(final));
            self.result = exclusive(final, limit, offset, enrich, !resolve, self.boostval);
            return resolve ? self.result : self;
        });
    }

    if(final.length){
        this.result.length && (final = [this.result].concat(final));
        this.result = exclusive(final, limit, offset, enrich, !resolve, self.boostval);
    }
    return resolve ? this.result : this;
};

/**
 * @param result
 * @param limit
 * @param offset
 * @param enrich
 * @param resolve
 * @param boost
 * @return {Array}
 */

function exclusive(result, limit, offset, enrich, resolve, boost){

    if(!result.length){
        // todo remove
        //console.log("Empty Result")
        return result;
    }

    if(result.length < 2){
        // todo remove
        //console.log("Single Result")
        if(resolve){
            return resolve_default(result[0], limit, offset, enrich);
        }
        else {
            return result[0];
        }
    }

    const final = [];
    const check = create_object();
    let maxres = 0;

    for(let i = 0, res; i < result.length; i++){
        res = result[i];
        if(!res) continue;

        for(let j = 0, ids; j < res.length; j++){
            ids = res[j];
            if(!ids) continue

            if(maxres < ids.length) maxres = ids.length;

            for(let k = 0, id; k < ids.length; k++){
                id = ids[k];
                check[id]
                    ? check[id]++
                    : check[id] = 1;
            }
        }
    }

    for(let j = 0, ids, count = 0; j < maxres; j++){

        for(let i = 0, res; i < result.length; i++){
            res = result[i];
            if(!res) continue;

            ids = res[j];
            if(!ids) continue;

            for(let k = 0, id; k < ids.length; k++){
                id = ids[k];
                if(check[id] === 1){
                    if(offset){
                        offset--;
                        continue;
                    }
                    if(resolve){
                        final.push(id);
                        if(final.length === limit){
                            return final;
                        }
                    }
                    else {
                        // shift resolution by boost (inverse)
                        const index = j + (i ? boost : 0);
                        final[index] || (final[index] = []);
                        final[index].push(id);
                        if(++count === limit){
                            return final;
                        }
                    }
                }
            }
        }
    }

    //this.boost = 0;
    return final;
}

Resolver.prototype.not = function(){
    const self = this;
    let args = arguments;
    let first_argument = args[0];

    if(first_argument.then){
        return first_argument.then(function(){
            return self.not.apply(self, args);
        });
    }

    if(first_argument[0]){
        // fix false passed parameter style
        if(first_argument[0].index){
            return this.not.apply(this, first_argument);
        }
    }

    let final = [];
    let promises = [];
    let limit = 0, offset = 0, resolve;

    for(let i = 0, query; i < args.length; i++){

        query = /** @type {string|ResolverOptions} */ (
            args[i]
        );

        if(query){

            limit = query.limit || 0;
            offset = query.offset || 0;
            query.enrich;
            resolve = query.resolve;

            let result;
            if(query.constructor === Resolver){
                result = query.result;
            }
            else if(query.constructor === Array){
                result = query;
            }
            else if(query.index){
                query.resolve = false;
                result = query.index.search(query).result;
            }
            else if(query.or){
                result = this.or(query.or);
            }
            else if(query.and){
                result = this.and(query.and);
            }
            else if(query.xor){
                result = this.xor(query.xor);
            }
            else {
                continue;
            }

            final[i] = result;

            if(result.then){
                promises.push(result); //{ query, result };
            }
        }
    }

    if(promises.length){
        return Promise.all(promises).then(function(){
            self.result = exclusion.call(self, final, limit, offset, resolve);
            return resolve ? self.result : self;
        });
    }

    if(final.length){
        this.result = exclusion.call(this, final, limit, offset, resolve);
    }

    return resolve ? this.result : this;
};

/**
 * @param result
 * @param limit
 * @param offset
 * @param resolve
 * @this Resolver
 * @return {Array}
 */

function exclusion(result, limit, offset, resolve){

    if(!result.length){
        return this.result;
    }

    const final = [];
    const exclude = new Set(result.flat().flat());

    for(let j = 0, ids, count = 0; j < this.result.length; j++){
        ids = this.result[j];
        if(!ids) continue;

        for(let k = 0, id; k < ids.length; k++){
            id = ids[k];
            if(!exclude.has(id)){
                if(offset){
                    offset--;
                    continue;
                }
                if(resolve){
                    final.push(id);
                    if(final.length === limit){
                        return final;
                    }
                }
                else {
                    final[j] || (final[j] = []);
                    final[j].push(id);
                    if(++count === limit){
                        return final;
                    }
                }
            }
        }
    }

    return final;
}

/**
 * @param {Array|ResolverOptions=} result
 * @constructor
 */

function Resolver(result){
    if(!this){
        return new Resolver(result);
    }
    if(result && result.index){
        result.resolve = false;
        this.index = result.index;
        this.boostval = result.boost || 0;
        this.result = result.index.search(result).result;
        return this;
    }
    if(result.constructor === Resolver){
        // todo test this branch
        //console.log("Resolver Loopback")
        return result;
    }
    this.index = null;
    this.result = result || [];
    this.boostval = 0;
}

Resolver.prototype.limit = function(limit){
    if(this.result.length){
        const final = [];
        let count = 0;
        for(let j = 0, ids; j < this.result.length; j++){
            ids = this.result[j];
            if(ids.length + count < limit){
                final[j] = ids;
                count += ids.length;
            }
            else {
                final[j] = ids.slice(0, limit - count);
                this.result = final;
                break;
            }
        }
    }
    return this;
};

Resolver.prototype.offset = function(offset){
    if(this.result.length){
        const final = [];
        let count = 0;
        for(let j = 0, ids; j < this.result.length; j++){
            ids = this.result[j];
            if(ids.length + count < offset){
                count += ids.length;
            }
            else {
                final[j] = ids.slice(offset - count);
                count = offset;
            }
        }
        this.result = final;
    }
    return this;
};

Resolver.prototype.boost = function(boost){
    this.boostval += boost;
    return this;
};

/**
 * @param {number|ResolverOptions=} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 */

Resolver.prototype.resolve = function(limit, offset, enrich){
    set_resolve(1);
    const result = this.result;
    this.index = null;
    this.result = null;

    if(result.length){
        if(typeof limit === "object"){
            enrich = limit.enrich;
            offset = limit.offset;
            limit = limit.limit;
        }
        return resolve_default(result, limit || 100, offset, enrich);
    }

    return result;
};

// COMPILER BLOCK -->

let global_resolve = 1;
function set_resolve(resolve){
    global_resolve = resolve;
}

/**
 * @param {string|SearchOptions} query
 * @param {number|SearchOptions=} limit
 * @param {SearchOptions=} options
 * @returns {Array|Resolver|Promise<Array|Resolver>}
 */

Index.prototype.search = function(query, limit, options){

    if(!options){
        if(!limit && is_object(query)){
            options = /** @type {!SearchOptions} */ (query);
            query = "";
        }
        else if(is_object(limit)){
            options = /** @type {!SearchOptions} */ (limit);
            limit = 0;
        }
    }

    let result = [];
    let length;
    let context, suggest, offset = 0, resolve, enrich, tag, boost;

    if(options){
        query = options.query || query;
        limit = options.limit || limit;
        offset = options.offset || 0;
        context = options.context;
        suggest = options.suggest;
        resolve = (global_resolve && options.resolve !== false);
        resolve || (global_resolve = 0);
        enrich = resolve && options.enrich;
        boost = options.boost;
        tag = this.db && options.tag;
    }
    else {
        resolve = this.resolve || global_resolve;
    }

    // todo: term deduplication during encoding when context is disabled

    // do not force a string as input
    // https://github.com/nextapps-de/flexsearch/issues/432
    query = /** @type {Array<string>} */ (this.encoder.encode(query));
    length = query.length;
    limit || !resolve || (limit = 100);

    // fast path single term
    if(length === 1){
        return single_term_query.call(
            this,
            query[0], // term
            "",       // ctx
            limit,
            offset,
            resolve,
            enrich,
            tag
        );
    }

    // TODO: dedupe terms within encoder?
    // TODO: deduplication will break the context chain

    context = this.depth && context !== false;

    // fast path single context
    if(length === 2 && context && !suggest){
        return single_term_query.call(
            this,
            query[0], // term
            query[1], // ctx
            limit,
            offset,
            resolve,
            enrich,
            tag
        );
    }

    let maxlength = 0;
    let minlength = 0;

    if(length > 1){

        // term deduplication will break the context chain
        // todo add context to dupe check
        const dupes = create_object();
        const query_new = [];

        // if(context){
        //     keyword = query[0];
        //     dupes[keyword] = 1;
        //     query_new.push(keyword);
        //     maxlength = minlength = keyword.length;
        //     i = 1;
        // }

        for(let i = 0, term; i < length; i++){

            term = query[i];

            if(term && !dupes[term]){

                // todo add keyword check
                // this fast path can't apply to persistent indexes
                if(!suggest && !(this.db) && !this.get_array(term/*, keyword*/)){

                    // fast path "not found"
                    return resolve
                        ? result
                        : new Resolver(result);
                }
                else {

                    query_new.push(term);
                    dupes[term] = 1;
                }

                const term_length = term.length;
                maxlength = Math.max(maxlength, term_length);
                minlength = minlength ? Math.min(minlength, term_length) : term_length;
            }
            // else if(term && (!this.depth || context === false)){
            //     query_new.push(term);
            // }
        }

        query = query_new;
        length = query.length;
    }

    // the term length could be changed after deduplication

    if(!length){
        return resolve
            ? result
            : new Resolver(result);
    }

    let index = 0, keyword;

    // fast path single term
    if(length === 1){
        return single_term_query.call(
            this,
            query[0], // term
            "",       // ctx
            limit,
            offset,
            resolve,
            enrich,
            tag
        );
    }

    // fast path single context
    if(length === 2 && context && !suggest){
        return single_term_query.call(
            this,
            query[0], // term
            query[1], // ctx
            limit,
            offset,
            resolve,
            enrich,
            tag
        );
    }

    if(length > 1){
        if(context){
            // start with context right away
            keyword = query[0];
            index = 1;
        }
        // todo
        else if(maxlength > 9 && (maxlength / minlength) > 3){
            // sorting terms will break the context chain
            // bigger terms has less occurrence
            // this might also reduce the intersection task
            // todo check intersection order
            query.sort(sort_by_length_down);
        }
    }

    // from this point there are just multi-term queries

    if(this.db){

        if(this.db.search){
            // when the configuration is not supported it returns false
            const result = this.db.search(this, query, limit, offset, suggest, resolve, enrich, tag);
            if(result !== false) return result;
        }

        const self = this;
        return (async function(){

            for(let arr, term; index < length; index++){

                term = query[index];

                if(keyword){

                    arr = await self.get_array(term, keyword, 0, 0, false, false);
                    arr = add_result(
                        arr,
                        result,
                        suggest,
                        self.resolution_ctx,
                        // 0, // /** @type {!number} */ (limit),
                        // 0, // offset,
                        // length === 2
                        // /*, term, keyword*/
                    );

                    // the context is a moving window where the keyword is going forward like a cursor
                    // 1. when suggestion enabled just forward keyword if term was found
                    // 2. as long as the result is empty forward the pointer also
                    if(!suggest || (arr !== false) || !result.length){
                        keyword = term;
                    }
                }
                else {

                    arr = await self.get_array(term, "", 0, 0, false, false);
                    arr = add_result(
                        arr,
                        result,
                        suggest,
                        self.resolution,
                        // 0, // /** @type {!number} */ (limit),
                        // 0, // offset,
                        // length === 1
                        // /*, term*/
                    );
                }

                // limit reached
                if(arr){
                    return arr;
                }

                // apply suggestions on last loop
                if(suggest && (index === length - 1)){
                    let length = result.length;
                    if(!length){
                        // fallback to non-contextual search when no result was found
                        if(keyword){
                            keyword = "";
                            index = -1;
                            continue;
                        }
                        return result;
                    }
                    else if(length === 1){
                        return resolve
                            ? resolve_default(result[0], /** @type {number} */ (limit), offset)
                            : new Resolver(result[0]);
                    }
                }
            }

            return resolve
                ? intersect$1(result, self.resolution, /** @type {number} */ (limit), offset, suggest, boost, resolve)
                : new Resolver(result[0])
        }());
    }

    for(let arr, term; index < length; index++){

        term = query[index];

        if(keyword){

            arr = this.get_array(term, keyword, 0, 0, false, false);
            arr = /*this.*/add_result(
                arr,
                result,
                suggest,
                this.resolution_ctx,
                // 0, // /** @type {!number} */ (limit),
                // 0, // offset,
                // length === 2
                // /*, term, keyword*/
            );

            // 1. when suggestion enabled just forward keyword if term was found
            // 2. as long as the result is empty forward the pointer also
            if(!suggest || (arr !== false) || !result.length){
                keyword = term;
            }
        }
        else {

            arr = this.get_array(term, "", 0, 0, false, false);
            arr = /*this.*/add_result(
                arr,
                result,
                suggest,
                this.resolution,
                // 0, // /** @type {!number} */ (limit),
                // 0, // offset,
                // length === 1
                // /*, term*/
            );
        }

        // limit reached
        if(arr){
            return /** @type {Array} */ (arr);
        }

        // apply suggestions on last loop
        if(suggest && (index === length - 1)){
            const length = result.length;
            if(!length){
                // fallback to non-contextual search when no result was found
                if(keyword){
                    keyword = "";
                    index = -1;
                    continue;
                }
                return result;
            }
            else if(length === 1){
                return resolve
                    ? resolve_default(result[0], limit, offset)
                    : new Resolver(result[0]);
            }
        }
    }

    result = intersect$1(result, this.resolution, limit, offset, suggest, boost, resolve);

    return resolve
        ? result
        : new Resolver(result);
};

/**
 * @param term
 * @param keyword
 * @param limit
 * @param offset
 * @param resolve
 * @param enrich
 * @param tag
 * @this Index
 * @return {Array|Resolver}
 */

function single_term_query(term, keyword, limit, offset, resolve, enrich, tag){

    const result = this.get_array(term, keyword, limit, offset, resolve, enrich, tag);

    if(this.db){
        return result.then(function(result){
            if(resolve) return result;
            return result && result.length
                ? (resolve ? resolve_default(result, limit, offset): new Resolver(result))
                : resolve ? [] : new Resolver([]);
        });
    }

    return result && result.length
        ? (resolve ? resolve_default(result, limit, offset) : new Resolver(result))
        : resolve ? [] : new Resolver([]);
}

/**
 * Returns a 1-dimensional finalized array when the result is done (fast path return),
 * returns false when suggestions is enabled and no result was found,
 * or returns nothing when a set was pushed successfully to the results
 *
 * @private
 * @param {Array} arr
 * @param {Array} result
 * @param {Array} suggest
 * @param {number} resolution
 * @return {Array|boolean|undefined}
 */

function add_result(arr, result, suggest, resolution/*, limit, offset single_term, term, keyword*/){

    let word_arr = [];
    //let arr;// = keyword ? this.ctx : this.map;
    //arr = this.get_array(term, keyword);

    if(arr){

        //const resolution = Math.min(arr.length, keyword ? this.resolution_ctx : this.resolution);
        // apply reduced resolution for queries
        resolution = Math.min(arr.length, resolution);

        for(let x = 0, size = 0, tmp; x < resolution; x++){
            if((tmp = arr[x])){

                // if(offset){
                //     // apply offset right here on single terms
                //     if(tmp && single_term){
                //         if(tmp.length <= offset){
                //             offset -= tmp.length;
                //             tmp = null;
                //         }
                //         else{
                //             tmp = tmp.slice(offset);
                //             offset = 0;
                //         }
                //     }
                // }

                if(tmp){

                    // keep score (sparse array):
                    word_arr[x] = tmp;
                    // simplified score order:
                    //word_arr.push(tmp);

                    // if(single_term){
                    //     size += tmp.length;
                    //     if(size >= limit){
                    //         // fast path:
                    //         // a single term does not need to pre-collect results
                    //         break;
                    //     }
                    // }
                }
            }
        }

        if(word_arr.length){
            // if(single_term){
            //     // fast path optimization
            //     // offset was already applied at this point
            //     // return an array will stop the query process immediately
            //     return resolve_default(word_arr, limit, 0);
            // }

            result.push(word_arr);
            // return nothing will continue the query
            return;
        }
    }

    // 1. return an empty array will stop the loop
    // 2. return a false value to prevent stop when using suggestions
    return !suggest && word_arr;
}

Index.prototype.get_array = function(term, keyword, limit, offset, resolve, enrich, tag){

    let arr, swap;

    if(keyword){
        swap = this.bidirectional && (term > keyword);
    }

    if(this.compress){
        term = default_compress(term);
        keyword && (keyword = default_compress(keyword));
    }

    if(this.db){
        return keyword
            ? this.db.get(
                swap ? keyword : term, // term
                swap ? term : keyword, // ctx
                limit,
                offset,
                resolve,
                enrich,
                tag
            )
            : this.db.get(
                term,
                "", // ctx
                limit,
                offset,
                resolve,
                enrich,
                tag
            );
    }

    if(keyword){
        // the frequency of the starting letter is slightly less
        // on the last half of the alphabet (m-z) in almost every latin language,
        // so we sort downwards (https://en.wikipedia.org/wiki/Letter_frequency)
        arr = this.ctx.get(swap ? term : keyword);
        arr = arr && arr.get(swap ? keyword : term);
    }
    else {
        arr = this.map.get(term);
    }

    return arr;
};

// COMPILER BLOCK -->

/**
 * @param {boolean=} _skip_deletion
 */

Index.prototype.remove = function(id, _skip_deletion){

    const refs = this.reg.size && (
        this.fastupdate
            ? this.reg.get(id)
            : this.reg.has(id)
    );

    if(refs){

        if(this.fastupdate){

            // fast updates did not fully cleanup the key entries

            for(let i = 0, tmp; i < refs.length; i++){
                if((tmp = refs[i])){
                    // todo check
                    //if(tmp.length < 1) throw new Error("invalid length");
                    //if(tmp.indexOf(id) < 0) throw new Error("invalid id");
                    if(tmp.length < 2){
                        tmp.pop();
                    }
                    else {
                        const index = tmp.indexOf(id);
                        index === refs.length - 1
                            ? tmp.pop()
                            : tmp.splice(index, 1);
                    }
                }
            }

            // todo variation which cleans up, requires to push [ctx, key] instead of arr to the index.reg
            // for(let i = 0, arr, term, keyword; i < refs.length; i++){
            //     arr = refs[i];
            //     if(typeof arr === "string"){
            //         arr = this.map.get(term = arr);
            //     }
            //     else{
            //         arr = this.ctx.get(keyword = arr[0]);
            //         arr && (arr = arr.get(arr[1]));
            //     }
            //     let counter = 0, found;
            //     if(arr && arr.length){
            //         for(let j = 0, tmp; j < arr.length; j++){
            //             if((tmp = arr[j])){
            //                 if(!found && tmp.length){
            //                     const index = tmp.indexOf(id);
            //                     if(index >= 0){
            //                         tmp.splice(index, 1);
            //                         // the index [ctx, key]:[res, id] is unique
            //                         found = 1;
            //                     }
            //                 }
            //                 if(tmp.length){
            //                     counter++;
            //                     if(found){
            //                         break;
            //                     }
            //                 }
            //                 else{
            //                     delete arr[j];
            //                 }
            //             }
            //         }
            //     }
            //     if(!counter){
            //         keyword
            //             ? this.ctx.delete(keyword)
            //             : this.map.delete(term);
            //     }
            // }
        }
        else {

            remove_index(this.map, id/*, this.resolution*/);
            this.depth &&
            remove_index(this.ctx, id/*, this.resolution_ctx*/);
        }

        _skip_deletion || this.reg.delete(id);
    }

    if(this.db){
        this.commit_task.push({ "del": id });
        this.commit_auto && autoCommit(this);
        //return this.db.remove(id);
    }

    // the cache could be used outside the InMemory store
    if(this.cache){
        this.cache.remove(id);
    }

    return this;
};

/**
 * @param map
 * @param id
 * @return {number}
 */

function remove_index(map, id){

    // a check counter of filled resolution slots
    // to prevent removing the field
    let count = 0;

    if(is_array(map)){
        for(let x = 0, arr, index; x < map.length; x++){
            if((arr = map[x]) && arr.length){
                index = arr.indexOf(id);
                if(index >= 0){
                    if(arr.length > 1){
                        arr.splice(index, 1);
                        count++;
                    }
                    else {
                        // remove resolution slot
                        delete map[x];
                    }
                    // the index key:[res, id] is unique
                    break;
                }
                else {
                    count++;
                }
            }
        }
    }
    else for(let item of map){
        const key = item[0];
        const value = item[1];
        const tmp = remove_index(value, id);
        tmp ? count += tmp
            : map.delete(key);
    }

    return count;
}

/**!
 * FlexSearch.js
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */


/**
 * @constructor
 * @param {IndexOptions|string=} options Options or preset as string
 * @param {Map|Set|KeystoreSet|KeystoreMap=} _register
 */

function Index(options, _register){

    if(!this){
        return new Index(options);
    }

    tick("Index.create");

    options = options
        ? apply_preset(options)
        : {};

    /** @type ContextOptions */
    const context = options.context || {};
    const encoder = is_string(options.encoder)
        ? Charset[options.encoder]
        : options.encode || options.encoder || (
          options$8 
    );
    /** @type Encoder */
    this.encoder = encoder.encode
        ? encoder
        : typeof encoder === "object"
            ? (new Encoder(encoder)
                
            )
            : { encode: encoder };

    {
        this.compress = options.compress || options.compression || false;
    }

    let tmp;
    this.resolution = options.resolution || 9;
    this.tokenize = tmp = options.tokenize || "strict";
    this.depth = (tmp === "strict" && context.depth) || 0;
    this.bidirectional = context.bidirectional !== false;
    this.fastupdate = !!options.fastupdate;
    this.score = options.score || null;

    tmp = (options.keystore || 0);
    tmp && (this.keystore = tmp);

    this.map = tmp && SUPPORT_KEYSTORE ? new KeystoreMap(tmp) : new Map();
    this.ctx = tmp && SUPPORT_KEYSTORE ? new KeystoreMap(tmp) : new Map();
    this.reg = _register || (
        this.fastupdate
            ? (tmp && SUPPORT_KEYSTORE ? new KeystoreMap(tmp) : new Map())
            : (tmp && SUPPORT_KEYSTORE ? new KeystoreSet(tmp) : new Set())
    );
    this.resolution_ctx = context.resolution || 1;
    this.rtl = (encoder.rtl) || options.rtl || false;

    {
        this.cache = (tmp = options.cache || null) && new CacheClass(tmp);
    }

    {
        this.resolve = options.resolve !== false;
    }

    {
        if((tmp = options.db)){
            this.db = this.mount(tmp);
        }
        this.commit_auto = options.commit !== false;
        this.commit_task = [];
        this.commit_timer = null;
    }
}

{
    Index.prototype.mount = function(db){
        if(this.commit_timer){
            clearTimeout(this.commit_timer);
            this.commit_timer = null;
        }
        return db.mount(this);
    };
    Index.prototype.commit = function(replace, append){
        if(this.commit_timer){
            clearTimeout(this.commit_timer);
            this.commit_timer = null;
        }
        return this.db.commit(this, replace, append);
    };
    Index.prototype.destroy = function(){
        if(this.commit_timer){
            clearTimeout(this.commit_timer);
            this.commit_timer = null;
        }
        return this.db.destroy();
    };
}

/**
 * @param {!Index} self
 * @param {boolean=} replace
 * @param {boolean=} append
 */

function autoCommit(self, replace, append){
    if(!self.commit_timer){
        self.commit_timer = setTimeout(function(){
            self.commit_timer = null;
            self.db.commit(self, replace, append);
        }, 0);
    }
}

Index.prototype.clear = function(){

    this.map.clear();
    this.ctx.clear();
    this.reg.clear();

    {
        this.cache &&
        this.cache.clear();
    }

    if(this.db){
        this.commit_timer && clearTimeout(this.commit_timer);
        this.commit_timer = null;
        this.commit_task = [{ "clear": true }];
    }

    return this;
};

/**
 * @param {!number|string} id
 * @param {!string} content
 */

Index.prototype.append = function(id, content){
    return this.add(id, content, true);
};

Index.prototype.contain = function(id){
    return this.db
        ? this.db.has(id)
        : this.reg.has(id);
};

Index.prototype.update = function(id, content){

    const self = this;
    const res = this.remove(id);
    return res && res.then
        ? res.then(() => self.add(id, content))
        : this.add(id, content);
};

/**
 * @param map
 * @return {number}
 */

function cleanup_index(map){

    let count = 0;

    if(is_array(map)){
        for(let i = 0, arr; i < map.length; i++){
            (arr = map[i]) &&
            (count += arr.length);
        }
    }
    else for(const item of map){
        const key = item[0];
        const value = item[1];
        const tmp = cleanup_index(value);
        tmp ? count += tmp
            : map.delete(key);
    }

    return count;
}

Index.prototype.cleanup = function(){

    if(!this.fastupdate){
        console.info("Cleanup the index isn't required when not using \"fastupdate\".");
        return this;
    }

    cleanup_index(this.map);
    this.depth &&
    cleanup_index(this.ctx);

    return this;
};

{

    Index.prototype.searchCache = searchCache;
}

{

    Index.prototype.export = exportIndex;
    Index.prototype.import = importIndex;
    Index.prototype.serialize = serialize;
}

{

    apply_async(Index.prototype);
}

// COMPILER BLOCK -->

const VERSION = 1;
const IndexedDB = typeof window !== "undefined" && (
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB
);
const fields = ["map", "ctx", "tag", "reg", "cfg"];

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

/**
 * @param {string|PersistentOptions=} name
 * @param {PersistentOptions=} config
 * @constructor
 * @implements StorageInterface
 */

function IdxDB(name, config = {}){
    if(!this){
        return new IdxDB(name, config);
    }
    if(typeof name === "object"){
        name = name.name;
        config = name;
    }
    if(!name){
        console.info("Default storage space was used, because a name was not passed.");
    }
    this.id = "flexsearch" + (name ? ":" + sanitize(name) : "");
    this.field = config.field ? sanitize(config.field) : "";
    this.support_tag_search = false;
    this.db = null;
    this.trx = {};
}
IdxDB.prototype.mount = function(flexsearch){
    //if(flexsearch.constructor === Document){
    if(!flexsearch.encoder){
        return flexsearch.mount(this);
    }
    flexsearch.db = this;
    return this.open();
};

IdxDB.prototype.open = function(){

    let self = this;

    navigator.storage &&
    navigator.storage.persist();

    return this.db || new Promise(function(resolve, reject){

        const req = IndexedDB.open(self.id + (self.field ? ":" + self.field : ""), VERSION);

        req.onupgradeneeded = function(event){

            const db = self.db = this.result;

            // Using Indexes + IDBKeyRange on schema map => [key, res, id] performs
            // too bad and blows up amazingly in size
            // The schema map:key => [res][id] is currently used instead
            // In fact that bypass the idea of a storage solution,
            // IndexedDB is such a poor contribution :(

            fields.forEach(ref => {
                db.objectStoreNames.contains(ref) ||
                db.createObjectStore(ref);//{ autoIncrement: true /*keyPath: "id"*/ }
                //.createIndex("idx", "ids", { multiEntry: true, unique: false });
            });

            // switch(event.oldVersion){ // existing db version
            //     case 0:
            //     // version 0 means that the client had no database
            //     // perform initialization
            //     case 1:
            //     // client had version 1
            //     // update
            // }
        };

        req.onblocked = function(event) {
            // this event shouldn't trigger if we handle onversionchange correctly
            // it means that there's another open connection to the same database
            // and it wasn't closed after db.onversionchange triggered for it
            console.error("blocked", event);
            reject();
        };

        req.onerror = function(event){
            console.error(this.error, event);
            reject();
        };

        req.onsuccess = function(event){
            self.db = this.result; //event.target.result;
            self.db.onversionchange = function(){
                //database is outdated
                self.close();
            };
            resolve(self);
        };
    });
};

IdxDB.prototype.close = function(){
    this.db.close();
    this.db = null;
};

IdxDB.prototype.destroy = function(){
    return IndexedDB.deleteDatabase(this.id + (this.field ? ":" + this.field : ""));
};

// IdxDB.prototype.set = function(ref, key, ctx, data){
//     const transaction = this.db.transaction(ref, "readwrite");
//     const map = transaction.objectStore(ref);
//     const req = map.put(data, ctx ? ctx + ":" + key : key);
//     return transaction;//promisfy(req, callback);
// };

// IdxDB.prototype.delete = function(ref, key, ctx){
//     const transaction = this.db.transaction(ref, "readwrite");
//     const map = transaction.objectStore(ref);
//     const req = map.delete(ctx ? ctx + ":" + key : key);
//     return transaction;//promisfy(req, callback);
// };

IdxDB.prototype.clear = function(){
    const transaction = this.db.transaction(fields, "readwrite");
    for(let i = 0; i < fields.length; i++){
        transaction.objectStore(fields[i]).clear();
    }
    return promisfy(transaction);
};

IdxDB.prototype.get = function(key, ctx, limit = 0, offset = 0, resolve = true, enrich = false){
    const transaction = this.db.transaction(ctx ? "ctx" : "map", "readonly");
    const map = transaction.objectStore(ctx ? "ctx" : "map");
    const req = map.get(ctx ? ctx + ":" + key : key);
    const self = this;
    return promisfy(req).then(function(res){
        let result = [];
        if(!res || !res.length) return result;
        if(resolve){
            if(!limit && !offset && res.length === 1){
                return res[0];
            }
            for(let i = 0, arr; i < res.length; i++){
                if((arr = res[i]) && arr.length){
                    if(offset >= arr.length){
                        offset -= arr.length;
                        continue;
                    }
                    const end = limit
                        ? offset + Math.min(arr.length - offset, limit)
                        : arr.length;
                    for(let j = offset; j < end; j++){
                        result.push(arr[j]);
                    }
                    offset = 0;
                    if(result.length === limit){
                       break;
                    }
                }
            }
            return enrich
                ? self.enrich(result)
                : result;
        }
        else {
            return res;
        }
    });
};

{

    IdxDB.prototype.tag = function(tag, limit = 0, offset = 0, enrich = false){
        const transaction = this.db.transaction("tag", "readonly");
        const map = transaction.objectStore("tag");
        const req = map.get(tag);
        const self = this;
        return promisfy(req).then(function(ids){
            if(!ids || !ids.length || offset >= ids.length) return [];
            if(!limit && !offset) return ids;
            const result = ids.slice(offset, offset + limit);
            return enrich
                ? self.enrich(result)
                : result;
        });
    };
}

{

    IdxDB.prototype.enrich = function(ids){
        if(typeof ids !== "object"){
            ids = [ids];
        }
        const transaction = this.db.transaction("reg", "readonly");
        const map = transaction.objectStore("reg");
        const promises = [];
        for(let i = 0; i < ids.length; i++){
            promises[i] = promisfy(map.get(ids[i]));
        }
        return Promise.all(promises).then(function(docs){
            for(let i = 0; i < docs.length; i++){
                docs[i] = {
                    id: ids[i],
                    doc: docs[i] ? JSON.parse(docs[i]) : null
                };
            }
            return docs;
        });
    };
}

IdxDB.prototype.has = function(id){
    const transaction = this.db.transaction("reg", "readonly");
    const map = transaction.objectStore("reg");
    const req = map.getKey(id);
    return promisfy(req);
};

IdxDB.prototype.search = null;

// IdxDB.prototype.has = function(ref, key, ctx){
//     const transaction = this.db.transaction(ref, "readonly");
//     const map = transaction.objectStore(ref);
//     const req = map.getKey(ctx ? ctx + ":" + key : key);
//     return promisfy(req);
// };

IdxDB.prototype.info = function(){
    // todo
};

/**
 * @param {!string} ref
 * @param {!string} modifier
 * @param {!Function} task
 */

IdxDB.prototype.transaction = function(ref, modifier, task){

    let store = this.trx[ref + ":" + modifier];
    if(store) return task.call(this, store);

    let transaction = this.db.transaction(ref, modifier);
    this.trx[ref + ":" + modifier] = store = transaction.objectStore(ref);

    return new Promise((resolve, reject) => {
        transaction.onerror = (err) => {
            this.trx[ref+ ":" + modifier] = null;
            transaction.abort();
            transaction = store = null;
            reject(err);
            //db.close;
        };
        transaction.oncomplete = (res) => {
            this.trx[ref+ ":" + modifier] = null;
            transaction = store = null;
            resolve(res || true);
            //db.close;
        };
        return task.call(this, store);
    });
};

IdxDB.prototype.commit = async function(flexsearch, _replace, _append){

    // process cleanup tasks
    if(_replace){
        await this.clear();
        // there are just removals in the task queue
        flexsearch.commit_task = [];
    }
    else {
        let tasks = flexsearch.commit_task;
        flexsearch.commit_task = [];
        for(let i = 0, task; i < tasks.length; i++){
            task = tasks[i];
            // there are just removals in the task queue
            if(task.clear){
                await this.clear();
                _replace = true;
                break;
            }
            else {
                tasks[i] = task.del;
            }
        }
        if(!_replace){
            if(!_append){
                tasks = tasks.concat(toArray(flexsearch.reg));
            }
            tasks.length && await this.remove(tasks);
        }
    }

    if(!flexsearch.reg.size){
        return;
    }

    await this.transaction("map", "readwrite", function(store){

        for(const item of flexsearch.map){

            const key = item[0];
            const value = item[1];
            if(!value.length) continue;

            if(_replace){
                store.put(value, key);
                continue;
            }

            store.get(key).onsuccess = function(){
                let result = this.result;
                let changed;
                if(result && result.length){
                    const maxlen = Math.max(result.length, value.length);
                    for(let i = 0, res, val; i < maxlen; i++){
                        val = value[i];
                        if(val && val.length){
                            res = result[i];
                            if(res && res.length){
                                for(let j = 0; j < val.length; j++){
                                    res.push(val[j]);
                                }
                                changed = 1;
                                //result[i] = res.concat(val);
                                //result[i] = new Set([...result[i], ...value[i]]);
                                //result[i] = result[i].union(new Set(value[i]));
                            }
                            else {
                                result[i] = val;
                                changed = 1;
                                //result[i] = new Set(value[i])
                            }
                        }
                    }
                }
                else {
                    result = value;
                    changed = 1;
                    //result = [];
                    //for(let i = 0; i < value.length; i++){
                    //    if(value[i]) result[i] = new Set(value[i]);
                    //}
                }

                changed &&
                store.put(result, key);
            };
        }
    });

    await this.transaction("ctx", "readwrite", function(store){

        for(const ctx of flexsearch.ctx){
            const ctx_key = ctx[0];
            const ctx_value = ctx[1];

            for(const item of ctx_value){
                const key = item[0];
                const value = item[1];
                if(!value.length) continue;

                if(_replace){
                    store.put(value, ctx_key + ":" + key);
                    continue;
                }

                store.get(ctx_key + ":" + key).onsuccess = function(){
                    let result = this.result;
                    let changed;
                    if(result && result.length){
                        const maxlen = Math.max(result.length, value.length);
                        for(let i = 0, res, val; i < maxlen; i++){
                            val = value[i];
                            if(val && val.length){
                                res = result[i];
                                if(res && res.length){
                                    for(let j = 0; j < val.length; j++){
                                        res.push(val[j]);
                                    }
                                    //result[i] = res.concat(val);
                                    changed = 1;
                                }
                                else {
                                    result[i] = val;
                                    changed = 1;
                                }
                            }
                        }
                    }
                    else {
                        result = value;
                        changed = 1;
                    }

                    changed &&
                    store.put(result, ctx_key + ":" + key);
                };
            }
        }
    });

    if(flexsearch.store){
        await this.transaction("reg", "readwrite", function(store){
            for(const item of flexsearch.store){
                const id = item[0];
                const doc = item[1];
                store.put(typeof doc === "object"
                    ? JSON.stringify(doc)
                    : 1
                , id);
            }
        });
    }
    else if(!flexsearch.bypass){
        await this.transaction("reg", "readwrite", function(store){
            for(const id of flexsearch.reg.keys()){
                store.put(1, id);
            }
        });
    }

    if(flexsearch.tag){
        await this.transaction("tag", "readwrite", function(store){
            for(const item of flexsearch.tag){
                const tag = item[0];
                const ids = item[1];
                if(!ids.length) continue;

                store.get(tag).onsuccess = function(){
                    let result = this.result;
                    result = result && result.length
                        ? result.concat(ids)
                        : ids;
                    store.put(result, tag);
                };
            }
        });
    }

    // TODO
    // await this.transaction("cfg", "readwrite", function(store){
    //     store.put({
    //         "charset": flexsearch.charset,
    //         "tokenize": flexsearch.tokenize,
    //         "resolution": flexsearch.resolution,
    //         "fastupdate": flexsearch.fastupdate,
    //         "compress": flexsearch.compress,
    //         "encoder": {
    //             "minlength": flexsearch.encoder.minlength
    //         },
    //         "context": {
    //             "depth": flexsearch.depth,
    //             "bidirectional": flexsearch.bidirectional,
    //             "resolution": flexsearch.resolution_ctx
    //         }
    //     }, "current");
    // });

    flexsearch.map.clear();
    flexsearch.ctx.clear();
    {
        flexsearch.tag &&
        flexsearch.tag.clear();
    }
    {
        flexsearch.store &&
        flexsearch.store.clear();
    }
    flexsearch.document ||
    flexsearch.reg.clear();
};

/**
 * @param {IDBCursorWithValue} cursor
 * @param {Array} ids
 * @param {boolean=} _tag
 */

function handle(cursor, ids, _tag){

    const arr = cursor.value;
    let changed;
    let parse;
    let count = 0;

    for(let x = 0, result; x < arr.length; x++){
        // tags has no resolution layer
        if((result = _tag ? arr : arr[x])){
            for(let i = 0, pos, id; i < ids.length; i++){
                id = ids[i];
                pos = result.indexOf(parse ? parseInt(id, 10) : id);
                if(pos < 0 && !parse && typeof id === "string" && !isNaN(id)){
                    pos = result.indexOf(parseInt(id, 10));
                    pos && (parse = 1);
                }
                if(pos >= 0){
                    changed = 1;
                    if(result.length > 1){
                        result.splice(pos, 1);
                    }
                    else {
                        arr[x] = [];
                        break;
                    }
                }
            }

            count += result.length;
        }
        if(_tag) break;
    }

    if(!count){

        cursor.delete();
        //store.delete(cursor.key);
    }
    else if(changed){

        //await new Promise(resolve => {
        cursor.update(arr);//.onsuccess = resolve;
        //});
    }

    cursor.continue();
}

IdxDB.prototype.remove = function(ids){

    if(typeof ids !== "object"){
        ids = [ids];
    }

    return /** @type {!Promise<undefined>} */(Promise.all([
        this.transaction("map", "readwrite", function(store){
            store.openCursor().onsuccess = function(){
                const cursor = this.result;
                cursor && handle(cursor, ids);
            };
        }),
        this.transaction("ctx", "readwrite", function(store){
            store.openCursor().onsuccess = function(){
                const cursor = this.result;
                cursor && handle(cursor, ids);
            };
        }),
        this.transaction("tag", "readwrite", function(store){
            store.openCursor().onsuccess = function(){
                const cursor = this.result;
                cursor && handle(cursor, ids, /* tag? */ true);
            };
        }),
        // let filtered = [];
        this.transaction("reg", "readwrite", function(store){
            for(let i = 0; i < ids.length; i++){
                store.delete(ids[i]);
            }
            // return new Promise(resolve => {
            //     store.openCursor().onsuccess = function(){
            //         const cursor = this.result;
            //         if(cursor){
            //             const id = cursor.value;
            //             if(ids.includes(id)){
            //                 filtered.push(id);
            //                 cursor.delete();
            //             }
            //             cursor.continue();
            //         }
            //         else{
            //             resolve();
            //         }
            //     };
            // });
        })
        // ids = filtered;
    ]));
};

/**
 * @param {IDBRequest} req
 * @param {Function=} callback
 * @return {!Promise<undefined>}
 */

function promisfy(req, callback){
    return new Promise((resolve, reject) => {
        /** @this IDBRequest */
        req.onsuccess = function(){
            resolve(this.result);
        };
        /** @this IDBRequest */
        req.oncomplete = function(){
            resolve(this.result);
        };
        req.onerror = reject;
        req = null;
    });
}

export { IdxDB as default };
