;/**!
 * @preserve FlexSearch v0.2.32
 * Copyright 2017-2018 Thomas Wilkerling
 * Released under the Apache 2.0 Licence
 * https://github.com/nextapps-de/flexsearch
 */

/** @define {boolean} */
var SUPPORT_WORKER = true;

/** @define {boolean} */
var SUPPORT_BUILTINS = true;

/** @define {boolean} */
var SUPPORT_DEBUG = true;

/** @define {boolean} */
var SUPPORT_CACHE = true;

/** @define {boolean} */
var SUPPORT_ASYNC = true;

(function(){

    provide('FlexSearch', (function factory(register_worker){

        "use strict";

        /**
         * @struct
         * @private
         * @const
         * @final
         */

        var defaults = {

            // use on of built-in functions
            // or pass custom encoding algorithm
            encode: 'icase',

            // type of information
            mode: 'forward',

            // use flexible cache (scales automatically)
            cache: false,

            // use flexible cache (scales automatically)
            async: false,

            // use flexible cache (scales automatically)
            worker: false,

            // minimum scoring (0 - 9)
            threshold: 0,

            // contextual depth
            depth: 0
        };

        /**
         * @struct
         * @private
         * @const
         * @final
         */

        var profiles = {

            "memory": {
                encode: "extra",
                mode: "strict",
                threshold: 7
            },

            "speed": {
                encode: "icase",
                mode: "strict",
                threshold: 7,
                depth: 2
            },

            "match": {
                encode: "extra",
                mode: "full"
            },

            "score": {
                encode: "extra",
                mode: "strict",
                threshold: 5,
                depth: 4
            },

            "balance": {
                encode: "balance",
                mode: "ngram",
                threshold: 6,
                depth: 3
            },

            "fastest": {
                encode: "icase",
                threshold: 9,
                depth: 1
            }
        };

        /**
         * @type {Array}
         * @private
         */

        var global_matcher = [];

        /**
         * @type {number}
         * @private
         */

        var id_counter = 0;

        /**
         * @enum {number}
         */

        var enum_task = {

            add: 0,
            update: 1,
            remove: 2
        };

        /**  @const  {RegExp} */
        var regex_split = regex("[ -\/]");

        /**
         * http://www.ranks.nl/stopwords
         * @const {Array<string>}
         */

        var filter = [

            "a",
            "about",
            "above",
            "after",
            "again",
            "against",
            "all",
            "also",
            "am",
            "an",
            "and",
            "any",
            "are",
            "aren't",
            "as",
            "at",
            //"back",
            "be",
            "because",
            "been",
            "before",
            "being",
            "below",
            //"between",
            "both",
            "but",
            "by",
            "can",
            "cannot",
            "can't",
            "come",
            "could",
            "couldn't",
            //"day",
            "did",
            "didn't",
            "do",
            "does",
            "doesn't",
            "doing",
            "dont",
            "down",
            "during",
            "each",
            "even",
            "few",
            "first",
            "for",
            "from",
            "further",
            "get",
            //"give",
            "go",
            //"good",
            "had",
            "hadn't",
            "has",
            "hasn't",
            "have",
            "haven't",
            "having",
            "he",
            "hed",
            //"hell",
            "her",
            "here",
            "here's",
            "hers",
            "herself",
            "hes",
            "him",
            "himself",
            "his",
            "how",
            "how's",
            "i",
            "id",
            "if",
            "ill",
            "im",
            "in",
            "into",
            "is",
            "isn't",
            "it",
            "it's",
            "itself",
            "i've",
            "just",
            "know",
            "let's",
            "like",
            //"look",
            "make",
            "me",
            "more",
            "most",
            "mustn't",
            "my",
            "myself",
            "new",
            "no",
            "nor",
            "not",
            "now",
            "of",
            "off",
            "on",
            "once",
            //"one",
            "only",
            "or",
            "other",
            "ought",
            "our",
            "our's",
            "ourselves",
            "out",
            "over",
            "own",
            //"people",
            "same",
            "say",
            "see",
            "shan't",
            "she",
            "she'd",
            "shell",
            "shes",
            "should",
            "shouldn't",
            "so",
            "some",
            "such",
            //"take",
            "than",
            "that",
            "that's",
            "the",
            "their",
            "theirs",
            "them",
            "themselves",
            "then",
            "there",
            "there's",
            "these",
            "they",
            "they'd",
            "they'll",
            "they're",
            "they've",
            //"think",
            "this",
            "those",
            "through",
            "time",
            "to",
            "too",
            //"two",
            //"under",
            "until",
            "up",
            "us",
            //"use",
            "very",
            "want",
            "was",
            "wasn't",
            "way",
            "we",
            "wed",
            "well",
            "were",
            "weren't",
            "we've",
            "what",
            "what's",
            "when",
            "when's",
            "where",
            "where's",
            "which",
            "while",
            "who",
            "whom",
            "who's",
            "why",
            "why's",
            "will",
            "with",
            "won't",
            //"work",
            "would",
            "wouldn't",
            //"year",
            "you",
            "you'd",
            "you'll",
            "your",
            "you're",
            "your's",
            "yourself",
            "yourselves",
            "you've"
        ];

        /**
         * @const {Object<string, string>}
         */

        var stemmer = {

            "ational": "ate",
            "tional": "tion",
            "enci": "ence",
            "anci": "ance",
            "izer": "ize",
            "bli": "ble",
            "alli": "al",
            "entli": "ent",
            "eli": "e",
            "ousli": "ous",
            "ization": "ize",
            "ation": "ate",
            "ator": "ate",
            "alism": "al",
            "iveness": "ive",
            "fulness": "ful",
            "ousness": "ous",
            "aliti": "al",
            "iviti": "ive",
            "biliti": "ble",
            "logi": "log",
            "icate": "ic",
            "ative": "",
            "alize": "al",
            "iciti": "ic",
            "ical": "ic",
            "ful": "",
            "ness": "",
            "al": "",
            "ance": "",
            "ence": "",
            "er": "",
            "ic": "",
            "able": "",
            "ible": "",
            "ant": "",
            "ement": "",
            "ment": "",
            "ent": "",
            "ou": "",
            "ism": "",
            "ate": "",
            "iti": "",
            "ous": "",
            "ive": "",
            "ize": ""
        };

        /**
         * @param {string|Object<string, number|string|boolean|Object|function(string):string>=} options
         * @constructor
         * @private
         */

        function FlexSearch(options){

            if(typeof options === 'string'){

                options = profiles[options] || defaults;
            }
            else{

                options || (options = defaults);
            }

            // generate UID

            /** @export */
            this.id = options['id'] || id_counter++;

            // initialize index

            this.init(options);

            // define functional properties

            registerProperty(this, 'index', /** @this {FlexSearch} */ function(){

                return this._ids;
            });

            registerProperty(this, 'length', /** @this {FlexSearch} */ function(){

                return Object.keys(this._ids).length;
            });
        }

        /**
         * @param {Object<string, number|string|boolean|Object|function(string):string>=} options
         * @export
         */

        FlexSearch.new = function(options){

            return new this(options);
        };

        /**
         * @param {Object<string, number|string|boolean|Object|function(string):string>=} options
         * @export
         */

        FlexSearch.create = function(options){

            return FlexSearch.new(options);
        };

        /**
         * @param {Object<string, string>} matcher
         * @export
         */

        FlexSearch.addMatcher = function(matcher){

            for(var key in matcher){

                if(matcher.hasOwnProperty(key)){

                    global_matcher[global_matcher.length] = regex(key);
                    global_matcher[global_matcher.length] = matcher[key];
                }
            }

            return this;
        };

        /**
         * @param {string} name
         * @param {function(string):string} encoder
         * @export
         */

        FlexSearch.register = function(name, encoder){

            global_encoder[name] = encoder;

            return this;
        };

        /**
         * @param {!string} name
         * @param {?string} value
         * @returns {?string}
         * @export
         */

        FlexSearch.encode = function(name, value){

            return global_encoder[name].call(global_encoder, value);
        };

        /**
         * @param {Object<string, number|string|boolean|Object|function(string):string>=} options
         * @export
         */

        FlexSearch.prototype.init = function(options){

            /** @type {Array} */
            this._matcher = [];

            if(options){

                var custom;

                // initialize worker

                if(SUPPORT_WORKER && (custom = options['worker'])){

                    if(typeof Worker === 'undefined'){

                        options['worker'] = false;

                        if(SUPPORT_ASYNC){

                            options['async'] = true;
                        }

                        this._worker = null;
                    }
                    else{

                        var self = this;
                        var threads = parseInt(custom, 10) || 4;

                        self._current_task = -1;
                        self._task_completed = 0;
                        self._task_result = [];
                        self._current_callback = null;
                        self._worker = new Array(threads);

                        for(var i = 0; i < threads; i++){

                            self._worker[i] = add_worker(self.id, i, options || defaults, function(id, query, result, limit){

                                if(self._task_completed === self.worker){

                                    return;
                                }

                                self._task_result = self._task_result.concat(result);
                                self._task_completed++;

                                if(limit && (self._task_result.length >= limit)){

                                    self._task_completed = self.worker;
                                }

                                if(self._current_callback && (self._task_completed === self.worker)){

                                    if(self._task_result.length){

                                        self._last_empty_query = "";
                                    }
                                    else{

                                        self._last_empty_query || (self._last_empty_query = query);
                                    }

                                    // store result to cache

                                    if(self.cache){

                                        self._cache.set(query, self._task_result);
                                    }

                                    self._current_callback(self._task_result);
                                    self._task_result = [];
                                }
                            });
                        }
                    }
                }

                // apply profile options

                if((custom = options['profile'])) {

                    this.profile = custom || 'custom';

                    custom = profiles[custom];

                    if(custom) {

                        for(var option in custom){

                            if(custom.hasOwnProperty(option)){

                                if(typeof options[option] === 'undefined'){

                                    options[option] = custom[option];
                                }
                            }
                        }
                    }
                }

                // apply custom options

                this.mode = (

                    options['mode'] ||
                    this.mode ||
                    defaults.mode
                );

                if(SUPPORT_CACHE) this.cache = (

                    options['cache'] ||
                    this.cache ||
                    defaults.cache
                );

                if(SUPPORT_ASYNC) this.async = (

                    options['async'] ||
                    this.async ||
                    defaults.async
                );

                if(SUPPORT_WORKER) this.worker = (

                    options['worker'] ||
                    this.worker ||
                    defaults.worker
                );

                this.threshold = (

                    options['threshold'] ||
                    this.threshold ||
                    defaults.threshold
                );

                this.depth = (

                    options['depth'] ||
                    this.depth ||
                    defaults.depth
                );

                custom = options['encode'];

                this.encoder = (

                    (custom && global_encoder[custom]) ||
                    (typeof custom === 'function' ? custom : this.encoder || false)
                );

                if(SUPPORT_DEBUG){

                    this.debug = (

                        options['debug'] ||
                        this.debug
                    );
                }

                if(custom = options['matcher']) {

                    this.addMatcher(/** @type {Object<string, string>} */ (custom));
                }

                if(SUPPORT_BUILTINS && (custom = options['filter'])) {

                    this.filter = initFilter(

                        (custom === true ?

                            filter
                        :
                            /** @type {Array<string>} */ (custom)

                    ), this.encoder);
                }

                if(SUPPORT_BUILTINS && (custom = options['stemmer'])) {

                    this.stemmer = initStemmer(

                        (custom === true ?

                            stemmer
                        :
                            /** @type {Object<string, string>} */ (custom)

                    ), this.encoder);
                }
            }

            // initialize index

            this._map = [

                {/* 0 */},
                {/* 1 */},
                {/* 2 */},
                {/* 3 */},
                {/* 4 */},
                {/* 5 */},
                {/* 6 */},
                {/* 7 */},
                {/* 8 */},
                {/* 9 */},
                {/* ctx */}
            ];

            this._ids = {};

            /**
             * @type {Object<string|number, Array>}
             */

            this._stack = {};

            /**
             * @type {Array<string|number>}
             */

            this._stack_keys = [];

            /**
             * @type {number|null}
             */

            this._timer = null;
            this._last_empty_query = "";
            this._status = true;

            if(SUPPORT_CACHE) this._cache = this.cache ?

                (new cache(30 * 1000, 50, true))
            :
                false;

            return this;
        };

        /**
         * @param {?string} value
         * @returns {?string}
         * @export
         */

        FlexSearch.prototype.encode = function(value){

            if(value && global_matcher.length){

                value = replace(value, global_matcher);
            }

            if(value && this._matcher.length){

                value = replace(value, this._matcher);
            }

            if(value && this.encoder){

                value = this.encoder.call(global_encoder, value);
            }

            if(value && this.filter){

                var words = value.split(' ');
                var final = "";

                for(var i = 0; i < words.length; i++){

                    var word = words[i];

                    if(this.filter[word]){

                        //var length = word.length - 1;

                        // TODO completely filter out words actually breaks the context chain
                        words[i] = this.filter[word];
                        //words[i] = word[0] + (length ? word[1] : '');
                        //words[i] = '~' + word[0];
                        //words.splice(i, 1);
                        //i--;
                        //final += (final ? ' ' : '') + word;
                    }
                }

                value = words.join(' '); // final;
            }

            if(value && this.stemmer){

                value = replace(value, this.stemmer);
            }

            return value;
        };

        /**
         * @param {Object<string, string>} matcher
         * @export
         */

        FlexSearch.prototype.addMatcher = function(matcher){

            for(var key in matcher){

                if(matcher.hasOwnProperty(key)){

                    this._matcher[this._matcher.length] = regex(key);
                    this._matcher[this._matcher.length] = matcher[key];
                }
            }

            return this;
        };

        /**
         * @param {?number|string} id
         * @param {?string} content
         * @this {FlexSearch}
         * @export
         */

        FlexSearch.prototype.add = function(id, content){

            if((typeof content === 'string') && content && (id || (id === 0))){

                // check if index ID already exist

                if(this._ids[id]){

                    this.update(id, content);
                }
                else{

                    if(SUPPORT_WORKER && this.worker){

                        if(++this._current_task >= this._worker.length) this._current_task = 0;

                        this._worker[this._current_task].postMessage(this._current_task, {

                            'add': true,
                            'id': id,
                            'content': content
                        });

                        this._ids[id] = "" + this._current_task;

                        return this;
                    }

                    if(SUPPORT_ASYNC && this.async){

                        this._stack[id] || (

                            this._stack_keys[this._stack_keys.length] = id
                        );

                        this._stack[id] = [

                            enum_task.add,
                            id,
                            content
                        ];

                        register_task(this);

                        return this;
                    }

                    content = this.encode(content);

                    if(!content.length){

                        return this;
                    }

                    var tokenizer = this.mode;

                    var words = (

                        typeof tokenizer === 'function' ?

                            tokenizer(content)
                        :(
                            tokenizer === 'ngram' ?

                                /** @type {!Array<string>} */ (ngram(content))
                            :
                                /** @type {string} */ (content).split(regex_split)
                        )
                    );

                    var dupes = {

                        '_ctx': {}
                    };

                    var threshold = this.threshold;
                    var depth = this.depth;
                    var map = this._map;
                    var word_length = words.length;

                    // tokenize

                    for(var i = 0; i < word_length; i++){

                        /** @type {string} */
                        var value = words[i];

                        if(value){

                            var length = value.length;

                            switch(tokenizer){

                                case 'reverse':
                                case 'both':

                                    var tmp = "";

                                    for(var a = length - 1; a >= 1; a--){

                                        tmp = value[a] + tmp;

                                        addIndex(

                                            map,
                                            dupes,
                                            tmp,
                                            id,
                                            /** @type {string} */ (content),
                                            threshold
                                        );
                                    }

                                // Note: no break here, fallthrough to next case

                                case 'forward':

                                    var tmp = "";

                                    for(var a = 0; a < length; a++){

                                        tmp += value[a];

                                        addIndex(

                                            map,
                                            dupes,
                                            tmp,
                                            id,
                                            /** @type {string} */ (content),
                                            threshold
                                        );
                                    }

                                    break;

                                case 'full':

                                    var tmp = "";

                                    for(var x = 0; x < length; x++){

                                        for(var y = length; y > x; y--){

                                            tmp = value.substring(x, y);

                                            addIndex(

                                                map,
                                                dupes,
                                                tmp,
                                                id,
                                                /** @type {string} */ (content),
                                                threshold
                                            );
                                        }
                                    }

                                    break;

                                case 'strict':
                                case 'ngram':
                                default:

                                    var score = addIndex(

                                        map,
                                        dupes,
                                        value,
                                        id,
                                        /** @type {string} */ (content),
                                        threshold
                                    );

                                    if(depth && (word_length > 1) && (score >= threshold)){

                                        var ctx_map = map[10];
                                        var ctx_dupes = dupes['_ctx'][value] || (dupes['_ctx'][value] = {});
                                        var ctx_tmp = ctx_map[value] || (ctx_map[value] = [

                                            {/* 0 */},
                                            {/* 1 */},
                                            {/* 2 */},
                                            {/* 3 */},
                                            {/* 4 */},
                                            {/* 5 */},
                                            {/* 6 */},
                                            {/* 7 */},
                                            {/* 8 */},
                                            {/* 9 */}
                                            // TODO test concept of deep trees instead of flat ones
                                            //{/* ctx */}
                                        ]);

                                        var x = i - depth;
                                        var y = i + depth;

                                        if(x < 0) x = 0;
                                        if(y > word_length - 1) y = word_length - 1;

                                        for(; x <= y; x++){

                                            if(x !== i) addIndex(

                                                ctx_tmp,
                                                ctx_dupes,
                                                words[x],
                                                id,
                                                /** @type {string} */ (content),
                                                threshold
                                            );
                                        }
                                    }

                                    break;
                            }
                        }
                    }

                    // update status

                    this._ids[id] = "1";
                    this._status = false;
                }
            }

            return this;
        };

        /**
         * @param id
         * @param content
         * @export
         */

        FlexSearch.prototype.update = function(id, content){

            if((typeof content === 'string') && (id || (id === 0))){

                if(this._ids[id]){

                    if(SUPPORT_WORKER && this.worker){

                        var int = parseInt(this._ids[id], 10);

                        this._worker[int].postMessage(int, {

                            'update': true,
                            'id': id,
                            'content': content
                        });

                        return this;
                    }

                    if(SUPPORT_ASYNC && this.async){

                        this._stack[id] || (

                            this._stack_keys[this._stack_keys.length] = id
                        );

                        this._stack[id] = [

                            enum_task.update,
                            id,
                            content
                        ];

                        register_task(this);

                        return this;
                    }

                    this.remove(id);

                    if(content){

                        this.add(id, content);
                    }
                }
            }

            return this;
        };

        /**
         * @param id
         * @export
         */

        FlexSearch.prototype.remove = function(id){

            if(this._ids[id]){

                if(SUPPORT_WORKER && this.worker){

                    var int = parseInt(this._ids[id], 10);

                    this._worker[int].postMessage(int, {

                        'remove': true,
                        'id': id
                    });

                    delete this._ids[id];

                    return this;
                }

                if(SUPPORT_ASYNC && this.async){

                    this._stack[id] || (

                        this._stack_keys[this._stack_keys.length] = id
                    );

                    this._stack[id] = [

                        enum_task.remove,
                        id
                    ];

                    register_task(this);

                    return this;
                }

                for(var z = 0; z < 10; z++){

                    var keys = Object.keys(this._map[z]);

                    for(var i = 0; i < keys.length; i++){

                        var key = keys[i];
                        var tmp = this._map[z];
                            tmp = tmp && tmp[key];

                        if(tmp && tmp.length){

                            for(var a = 0; a < tmp.length; a++){

                                if(tmp[a] === id){

                                    tmp.splice(a, 1);

                                    break;
                                }
                            }
                        }

                        if(!tmp.length){

                            delete this._map[z][key];
                        }
                    }
                }

                delete this._ids[id];

                this._status = false;
            }

            return this;
        };

        /**
         * @param {!string} query
         * @param {number|Function=} limit
         * @param {Function=} callback
         * @returns {Array}
         * @export
         */

        FlexSearch.prototype.search = function(query, limit, callback){

            var threshold;
            var result = [];

            if(query && (typeof query === 'object')){

                // re-assign properties

                callback = query['callback'] || /** @type {?Function} */ (limit);
                limit = query['limit'];
                threshold = query['threshold'];
                query = query['query'];
            }

            threshold || (threshold = 0);

            if(typeof limit === 'function'){

                callback = limit;
                limit = 1000;
            }
            else{

                limit || (limit = 1000);
            }

            if(SUPPORT_WORKER && this.worker){

                this._current_callback = callback;
                this._task_completed = 0;
                this._task_result = [];

                for(var i = 0; i < this.worker; i++){

                    this._worker[i].postMessage(i, {

                        'search': true,
                        'limit': limit,
                        'threshold': threshold,
                        'content': query
                    });
                }

                return null;
            }

            if(callback){

                /** @type {FlexSearch} */
                var self = this;

                queue(function(){

                    callback(self.search(query, limit));
                    self = null;

                }, 1, 'search-' + this.id);

                return null;
            }

            if(!query || (typeof query !== 'string')){

                return result;
            }

            /** @type {!string|Array<string>} */
            var _query = query;

            // invalidate cache

            if(!this._status){

                if(SUPPORT_CACHE && this.cache){

                    this._last_empty_query = "";
                    this._cache.reset();
                }

                this._status = true;
            }

            // validate cache

            else if(SUPPORT_CACHE && this.cache){

                var cache = this._cache.get(query);

                if(cache){

                    return cache;
                }
            }

            // validate last query

            else if(this._last_empty_query && (query.indexOf(this._last_empty_query) === 0)){

                return result;
            }

            // encode string

            _query = this.encode(/** @type {string} */ (_query));

            if(!_query.length){

                return result;
            }

            // convert words into single components

            var tokenizer = this.mode;

            var words = (

                typeof tokenizer === 'function' ?

                    tokenizer(_query)
                :(
                    tokenizer === 'ngram' ?

                        /** @type {!Array<string>} */ (ngram(_query))
                    :
                        /** @type {string} */ (_query).split(regex_split)
                )
            );

            var length = words.length;
            var found = true;
            var check = [];
            var check_words = {};

            if(length > 1){

                if(this.depth){

                    var use_contextual = true;
                    var ctx_root = words[0];

                    check_words[ctx_root] = "1";
                }
                else{

                    // Note: sort words by length only in non-contextual mode

                    words.sort(sortByLengthDown);
                }
            }

            var ctx_map;

            if(!use_contextual || (ctx_map = this._map[10])[ctx_root]){

                for(var a = use_contextual ? 1 : 0; a < length; a++){

                    var value = words[a];

                    if(value && !check_words[value]){

                        var map;
                        var map_found = false;
                        var map_check = [];
                        var count = 0;

                        for(var z = 9; z >= threshold; z--){

                            map = (

                                use_contextual ?

                                    ctx_map[ctx_root]
                                :
                                    this._map

                            )[z][value];

                            if(map){

                                map_check[count++] = map;
                                map_found = true;
                            }
                        }

                        if(!map_found){

                            found = false;
                            break;
                        }
                        else{

                            // TODO: handle by intersection

                            check[check.length] = (

                                count > 1 ?

                                    check.concat.apply([], map_check)
                                :
                                    map_check[0]
                            );
                        }

                        check_words[value] = "1";
                    }

                    ctx_root = value;
                }
            }
            else{

                found = false;
            }

            if(found /*&& check.length*/){

                result = intersect(check, limit);
            }

            if(result.length){

                this._last_empty_query = "";
            }
            else{

                this._last_empty_query || (this._last_empty_query = query);
            }

            // store result to cache

            if(SUPPORT_CACHE && this.cache){

                this._cache.set(query, result);
            }

            return result;
        };

        if(SUPPORT_DEBUG){

            /**
             * @export
             */

            FlexSearch.prototype.info = function(){

                if(SUPPORT_WORKER && this.worker){

                    for(var i = 0; i < this.worker; i++) this._worker[i].postMessage(i, {

                        'info': true,
                        'id': this.id
                    });

                    return;
                }

                var keys;
                var length;

                var bytes = 0,
                    words = 0,
                    chars = 0;

                for(var z = 0; z < 10; z++){

                    keys = Object.keys(this._map[z]);

                    for(var i = 0; i < keys.length; i++){

                        length = this._map[z][keys[i]].length;

                        // Note: 1 char values allocates 1 byte "Map (OneByteInternalizedString)"
                        bytes += length * 1 + keys[i].length * 2 + 4;
                        words += length;
                        chars += keys[i].length * 2;
                    }
                }

                keys = Object.keys(this._ids);

                var items = keys.length;

                for(var i = 0; i < items; i++){

                    bytes += keys[i].length * 2 + 2;
                }

                return {

                    'id': this.id,
                    'memory': bytes,
                    'items': items,
                    'sequences': words,
                    'chars': chars,
                    'status': this._status,
                    'cache': this._stack_keys.length,
                    'matcher': global_matcher.length,
                    'worker': this.worker
                };
            };
        }

        /**
         * @export
         */

        FlexSearch.prototype.reset = function(){

            // destroy index

            this.destroy();

            // initialize index

            return this.init();
        };

        /**
         * @export
         */

        FlexSearch.prototype.destroy = function(){

            // cleanup cache

            if(SUPPORT_CACHE && this.cache){

                this._cache.reset();
            }

            // release references

            this._scores =
            this._map =
            this._ids =
            this._cache = null;

            return this;
        };

        /** @const */

        var global_encoder_balance = (function(){

            var regex_whitespace = regex('\\s\\s+'),
                regex_strip = regex('[^a-z0-9 ]'),
                regex_space = regex('[-\/]'),
                regex_vowel = regex('[aeiouy]');

            /** @const {Array} */
            var regex_pairs = [

                regex_space, ' ',
                regex_strip, '',
                regex_whitespace, ' ',
                regex_vowel, ''
            ];

            return function(value){

                return collapseRepeatingChars(replace(value.toLowerCase(), regex_pairs));
            }
        })();

        /**
         * Phonetic Encoders
         * @dict {Function}
         * @private
         * @const
         * @final
         */

        var global_encoder = SUPPORT_BUILTINS ? {

            // case insensitive search

            'icase': function(value){

                return value.toLowerCase();
            },

            // simple phonetic normalization (latin)

            'simple': (function(){

                var regex_whitespace = regex('\\s\\s+'),
                    regex_strip = regex('[^a-z0-9 ]'),
                    regex_space = regex('[-\/]'),
                    regex_a = regex('[àáâãäå]'),
                    regex_e = regex('[èéêë]'),
                    regex_i = regex('[ìíîï]'),
                    regex_o = regex('[òóôõöő]'),
                    regex_u = regex('[ùúûüű]'),
                    regex_y = regex('[ýŷÿ]'),
                    regex_n = regex('ñ'),
                    regex_c = regex('ç'),
                    regex_s = regex('ß'),
                    regex_and = regex(' & ');

                /** @const {Array} */
                var regex_pairs = [

                    regex_a, 'a',
                    regex_e, 'e',
                    regex_i, 'i',
                    regex_o, 'o',
                    regex_u, 'u',
                    regex_y, 'y',
                    regex_n, 'n',
                    regex_c, 'c',
                    regex_s, 's',
                    regex_and, ' and ',
                    regex_space, ' ',
                    regex_strip, '',
                    regex_whitespace, ' '
                ];

                return function(str){

                    str = replace(str.toLowerCase(), regex_pairs);

                    return (

                        str !== ' ' ? str : ''
                    );
                };
            }()),

            // advanced phonetic transformation (latin)

            'advanced': (function(){

                var regex_space = regex(' '),
                    regex_ae = regex('ae'),
                    regex_ai = regex('ai'),
                    regex_ay = regex('ay'),
                    regex_ey = regex('ey'),
                    regex_oe = regex('oe'),
                    regex_ue = regex('ue'),
                    regex_ie = regex('ie'),
                    regex_sz = regex('sz'),
                    regex_zs = regex('zs'),
                    regex_ck = regex('ck'),
                    regex_cc = regex('cc'),
                    regex_sh = regex('sh'),
                    //regex_th = regex('th'),
                    regex_dt = regex('dt'),
                    regex_ph = regex('ph'),
                    regex_pf = regex('pf'),
                    regex_ou = regex('ou'),
                    regex_uo = regex('uo');

                /** @const {Array} */
                var regex_pairs = [

                    regex_ae, 'a',
                    regex_ai, 'ei',
                    regex_ay, 'ei',
                    regex_ey, 'ei',
                    regex_oe, 'o',
                    regex_ue, 'u',
                    regex_ie, 'i',
                    regex_sz, 's',
                    regex_zs, 's',
                    regex_sh, 's',
                    regex_ck, 'k',
                    regex_cc, 'k',
                    //regex_th, 't',
                    regex_dt, 't',
                    regex_ph, 'f',
                    regex_pf, 'f',
                    regex_ou, 'o',
                    regex_uo, 'u'
                ];

                return /** @this {global_encoder} */ function(string, _skip_post_processing){

                    if(!string){

                        return string;
                    }

                    // perform simple encoding
                    string = this['simple'](string);

                    // normalize special pairs
                    if(string.length > 2){

                        string = replace(string, regex_pairs)
                    }

                    if(!_skip_post_processing){

                        // remove white spaces
                        //string = string.replace(regex_space, '');

                        // delete all repeating chars
                        if(string.length > 1){

                            string = collapseRepeatingChars(string);
                        }
                    }

                    return string;
                };

            })(),

            'extra': (function(){

                var soundex_b = regex('p'),
                    //soundex_c = regex('[sz]'),
                    soundex_s = regex('z'),
                    soundex_k = regex('[cgq]'),
                    //soundex_i = regex('[jy]'),
                    soundex_m = regex('n'),
                    soundex_t = regex('d'),
                    soundex_f = regex('[vw]');

                /** @const {RegExp} */
                var regex_vowel = regex('[aeiouy]');

                /** @const {Array} */
                var regex_pairs = [

                    soundex_b, 'b',
                    soundex_s, 's',
                    soundex_k, 'k',
                    //soundex_i, 'i',
                    soundex_m, 'm',
                    soundex_t, 't',
                    soundex_f, 'f',
                    regex_vowel, ''
                ];

                return /** @this {global_encoder} */ function(str){

                    if(!str){

                        return str;
                    }

                    // perform advanced encoding
                    str = this['advanced'](str, /* skip post processing? */ true);

                    if(str.length > 1){

                        str = str.split(" ");

                        for(var i = 0; i < str.length; i++){

                            var current = str[i];

                            if(current.length > 1){

                                // remove all vowels after 2nd char
                                str[i] = current[0] + replace(current.substring(1), regex_pairs);
                            }
                        }

                        str = str.join(" ");
                        str = collapseRepeatingChars(str);
                    }

                    return str;
                };
            })(),

            'balance': global_encoder_balance

        } : {

            // case insensitive search

            'icase': function(value){

                return value.toLowerCase();
            },

            'balance': global_encoder_balance
        };

        // Xone Async Handler Fallback

        var queue = SUPPORT_ASYNC ? (function(){

            var stack = {};

            return function(fn, delay, id){

                var timer = stack[id];

                if(timer){

                    clearTimeout(timer);
                }

                return (

                    stack[id] = setTimeout(fn, delay)
                );
            };

        })() : null;

        // Xone Flexi-Cache Handler Fallback

        var cache = SUPPORT_CACHE ? (function(){

            /** @this {Cache} */
            function Cache(){

                this.cache = {};
            }

            /** @this {Cache} */
            Cache.prototype.reset = function(){

                this.cache = {};
            };

            /** @this {Cache} */
            Cache.prototype.set = function(id, value){

                this.cache[id] = value;
            };

            /** @this {Cache} */
            Cache.prototype.get = function(id){

                return this.cache[id];
            };

            return Cache;

        })() : null;

        return FlexSearch;

        // ---------------------------------------------------------
        // Helpers

        function registerProperty(obj, key, fn){

            // define functional properties

            Object.defineProperty(obj, key, {

                get: fn
            });
        }

        /**
         * @param {!string} str
         * @returns {RegExp}
         */

        function regex(str){

            return new RegExp(str, 'g');
        }

        /**
         * @param {!string} str
         * @param {RegExp|Array} regex
         * @param {string=} replacement
         * @returns {string}
         */

        function replace(str, regex, replacement){

            if(typeof replacement === 'undefined'){

                for(var i = 0; i < /** @type {Array} */ (regex).length; i += 2){

                    str = str.replace(regex[i], regex[i + 1]);
                }

                return str;
            }
            else{

                return str.replace(/** @type {!RegExp} */ (regex), replacement);
            }
        }

        /**
         * @param {Array} map
         * @param {Object} dupes
         * @param {string} tmp
         * @param {string|number} id
         * @param {string} content
         * @param {number} threshold
         */

        function addIndex(map, dupes, tmp, id, content, threshold){

            if(typeof dupes[tmp] === 'undefined'){

                var score = calcScore(tmp, content);

                dupes[tmp] = score;

                if(score >= threshold){

                    var arr = map[score];
                        arr = arr[tmp] || (arr[tmp] = []);
                        arr[arr.length] = id;
                }
            }

            return score || dupes[tmp];
        }

        /**
         * @param {!string} part
         * @param {!string} ref
         * @returns {number}
         */

        function calcScore(part, ref){

            var context_index = ref.indexOf(part);
            var partial_index = context_index - ref.lastIndexOf(" ", context_index);

            return (

                ((3 / ref.length * (ref.length - context_index)) + (6 / partial_index) + 0.5) | 0
            );
        }

        /**
         * @param {!string} value
         *  @this {global_encoder}
         * @returns {Array<?string>}
         */

        function ngram(value){

            var parts = [];

            if(!value){

                return parts;
            }

            var count_vowels = 0,
                count_literal = 0,
                count_parts = 0;

            var tmp = "";
            var length = value.length;

            for(var i = 0; i < length; i++){

                var char = value[i];
                var char_is_vowel = (

                    (char === 'a') ||
                    (char === 'e') ||
                    (char === 'i') ||
                    (char === 'o') ||
                    (char === 'u') ||
                    (char === 'y')
                );

                if(char_is_vowel){

                    count_vowels++;
                }
                else{

                    count_literal++;
                }

                if(char !== ' ') {

                    tmp += char;
                }

                // dynamic n-gram sequences

                if((char === ' ') || ((count_vowels > 1) && (count_literal > 1)) || (count_vowels > 2) || (count_literal > 2) || (i === length - 1)){

                    if(tmp){

                        if(parts[count_parts] && (tmp.length > 2)){

                            count_parts++;
                        }

                        if(parts[count_parts]){

                            parts[count_parts] += tmp;
                        }
                        else{

                            parts[count_parts] = tmp;
                        }

                        if(char === ' '){

                            count_parts++;
                        }

                        tmp = "";
                    }

                    count_vowels = 0;
                    count_literal = 0;
                }
            }

            return parts;
        }

        /**
         * @param {!string} string
         * @returns {string}
         */

        function collapseRepeatingChars(string){

            var collapsed_string = '',
                char_prev = '',
                char_next = '';

            for(var i = 0; i < string.length; i++){

                var char = string[i];

                if(char !== char_prev){

                    if(i && (char === 'h')){

                        var char_prev_is_vowel = (

                            (char_prev === 'a') ||
                            (char_prev === 'e') ||
                            (char_prev === 'i') ||
                            (char_prev === 'o') ||
                            (char_prev === 'u') ||
                            (char_prev === 'y')
                        );

                        var char_next_is_vowel = (

                            (char_next === 'a') ||
                            (char_next === 'e') ||
                            (char_next === 'i') ||
                            (char_next === 'o') ||
                            (char_next === 'u') ||
                            (char_next === 'y')
                        );

                        if((char_prev_is_vowel && char_next_is_vowel) || (char_prev === ' ')){

                            collapsed_string += char;
                        }
                    }
                    else{

                        collapsed_string += char;
                    }
                }

                char_next = (

                    (i === (string.length - 1)) ?

                        ''
                    :
                        string[i + 1]
                );

                char_prev = char;
            }

            return collapsed_string;
        }

        /**
         * @param {Array<string>} words
         * @param encoder
         * @returns {Object<string, string>}
         */

        function initFilter(words, encoder){

            var final = {};

            if(stemmer){

                for(var i = 0; i < words.length; i++){

                    var word = encoder ? encoder.call(global_encoder, words[i]) : words[i];

                    final[word] = String.fromCharCode((65000 - words.length) + i);
                }
            }

            return final;
        }

        /**
         * @param {Object<string, string>} stemmer
         * @param encoder
         * @returns {Array}
         */

        function initStemmer(stemmer, encoder){

            var final = [];

            if(stemmer){

                var count = 0;

                for(var key in stemmer){

                    if(stemmer.hasOwnProperty(key)){

                        var tmp = encoder ? encoder.call(global_encoder, key) : key;

                        final[count++] = regex('(?=.{' + (tmp.length + 3) + ',})' + tmp + '$');
                        final[count++] = encoder ? encoder.call(global_encoder, stemmer[key]) : stemmer[key];
                    }
                }
            }

            return final;
        }

        /**
         * @param {string} a
         * @param {string} b
         * @returns {number}
         */

        function sortByLengthDown(a, b){

            var diff = a.length - b.length;

            return (

                diff < 0 ?

                    1
                :(
                    diff > 0 ?

                        -1
                    :
                        0
                )
            );
        }

        /**
         * @param {Array<number|string>} a
         * @param {Array<number|string>} b
         * @returns {number}
         */

        function sortByLengthUp(a, b){

            var diff = a.length - b.length;

            return (

                diff < 0 ?

                    -1
                :(
                    diff > 0 ?

                        1
                    :
                        0
                )
            );
        }

        /**
         * @param {!Array<Array<number|string>>} arrays
         * @param {number=} limit
         * @returns {Array}
         */

        function intersect(arrays, limit) {

            var result = [];
            var length_z = arrays.length;

            if(length_z > 1){

                // pre-sort arrays by length up

                arrays.sort(sortByLengthUp);

                // fill initial map

                var check = {};
                var arr = arrays[0];
                var length = arr.length;
                var i = 0;

                while(i < length) {

                    check[arr[i++]] = 1;
                }

                // loop through arrays

                var tmp, count = 0;
                var z = 1;

                while(z < length_z){

                    // get each array one by one

                    var found = false;

                    arr = arrays[z];
                    length = arr.length;
                    i = 0;

                    while(i < length){

                        if((check[tmp = arr[i++]]) === z){

                            // fill in during last round

                            if(z === (length_z - 1)){

                                result[count++] = tmp;

                                if(limit && (count === limit)){

                                    found = false;
                                    break;
                                }
                            }

                            // apply count status

                            found = true;
                            check[tmp] = z + 1;
                        }
                    }

                    if(!found){

                        break;
                    }

                    z++;
                }
            }
            else if(length_z){

                result = arrays[0];

                if(limit && result && (result.length > limit)){

                    // Note: do not touch original array!

                    result = result.slice(0, limit);
                }
            }

            return result;
        }

        /**
         * Fastest intersect method for 2 sorted arrays so far
         * @param {!Array<number|string>} a
         * @param {!Array<number|string>} b
         * @param {number=} limit
         * @returns {Array}
         */

        function intersect_sorted(a, b, limit){

            var result = [];

            var length_a = a.length,
                length_b = b.length;

            if(length_a && length_b){

                var x = 0, y = 0, count = 0;

                var current_a = 0,
                    current_b = 0;

                while(true){

                    if((current_a || (current_a = a[x])) ===
                       (current_b || (current_b = b[y]))){

                        result[count++] = current_a;

                        current_a = current_b = 0;
                        x++;
                        y++;
                    }
                    else if(current_a < current_b){

                        current_a = 0;
                        x++;
                    }
                    else{

                        current_b = 0;
                        y++;
                    }

                    if((x === length_a) || (y === length_b)){

                        break;
                    }
                }
            }

            return result;
        }

        /**
         * @param {FlexSearch} ref
         */

        function runner(ref){

            var async = ref.async;
            var current;

            if(async){

                ref.async = false;
            }

            if(ref._stack_keys.length){

                var start = time();
                var key;

                while((key = ref._stack_keys.shift()) || (key === 0)){

                    current = ref._stack[key];

                    switch(current[0]){

                        case enum_task.add:

                            ref.add(current[1], current[2]);
                            break;

                        case enum_task.update:

                            ref.update(current[1], current[2]);
                            break;

                        case enum_task.remove:

                            ref.remove(current[1]);
                            break;
                    }

                    ref._stack[key] = null;
                    delete ref._stack[key];

                    if((time() - start) > 100){

                        break;
                    }
                }

                if(ref._stack_keys.length){

                    register_task(ref);
                }
            }

            if(async){

                ref.async = async;
            }
        }

        /**
         * @param {FlexSearch} ref
         */

        function register_task(ref){

            ref._timer || (

                ref._timer = queue(function(){

                    ref._timer = null;

                    runner(ref);

                }, 1, 'search-async-' + ref.id)
            );
        }

        /**
         * @returns {number}
         */

        function time(){

            return (

                typeof performance !== 'undefined' ?

                    performance.now()
                :
                    (new Date()).getTime()
            );
        }

        function add_worker(id, core, options, callback){

            var thread = register_worker(

                // name:
                'flexsearch',

                // id:
                'id' + id,

                // worker:
                function(){

                    var id;

                    /** @type {FlexSearch} */
                    var flexsearch;

                    /** @lends {Worker} */
                    self.onmessage = function(event){

                        var data = event['data'];

                        if(data){

                            // if(flexsearch.debug){
                            //
                            //     console.log("Worker Job Started: " + data['id']);
                            // }

                            if(data['search']){

                                /** @lends {Worker} */
                                self.postMessage({

                                    'result': flexsearch['search'](data['content'], data['threshold'] ? {'limit': data['limit'], 'threshold': data['threshold']} : data['limit']),
                                    'id': id,
                                    'content': data['content'],
                                    'limit': data['limit']
                                });
                            }
                            else if(data['add']){

                                flexsearch['add'](data['id'], data['content']);
                            }
                            else if(data['update']){

                                flexsearch['update'](data['id'], data['content']);
                            }
                            else if(data['remove']){

                                flexsearch['remove'](data['id']);
                            }
                            else if(data['reset']){

                                flexsearch['reset']();
                            }
                            else if(data['info']){

                                var info = flexsearch['info']();

                                info['worker'] = id;

                                if(flexsearch.debug){

                                    console.log(info);
                                }

                                /** @lends {Worker} */
                                //self.postMessage(info);
                            }
                            else if(data['register']){

                                id = data['id'];

                                data['options']['cache'] = false;
                                data['options']['async'] = true;
                                data['options']['worker'] = false;

                                flexsearch = new Function(

                                    data['register'].substring(

                                        data['register'].indexOf('{') + 1,
                                        data['register'].lastIndexOf('}')
                                    )
                                )();

                                flexsearch = new flexsearch(data['options']);
                            }
                        }
                    };
                },

                // callback:
                function(event){

                    var data = event['data'];

                    if(data && data['result']){

                        callback(data['id'], data['content'], data['result'], data['limit']);
                    }
                    else{

                        if(SUPPORT_DEBUG && options['debug']){

                            console.log(data);
                        }
                    }
                },

                // cores:
                core
            );

            var fn_str = factory.toString();

            options['id'] = core;

            thread.postMessage(core, {

                'register': fn_str,
                'options': options,
                'id': core
            });

            return thread;
        }
    })(
        // Xone Worker Handler Fallback

        SUPPORT_WORKER ? (function register_worker(){

            var worker_stack = {};
            var inline_is_supported = !!((typeof Blob !== 'undefined') && (typeof URL !== 'undefined') && URL.createObjectURL);

            return (

                /**
                 * @param {!string} _name
                 * @param {!number|string} _id
                 * @param {!Function} _worker
                 * @param {!Function} _callback
                 * @param {number=} _core
                 */

                function(_name, _id, _worker, _callback, _core){

                    var name = _name;
                    var worker_payload = (

                        inline_is_supported ?

                            /* Load Inline Worker */

                            URL.createObjectURL(

                                new Blob([

                                    'var SUPPORT_WORKER = true;' +
                                    'var SUPPORT_BUILTINS = ' + (SUPPORT_BUILTINS ? 'true' : 'false') + ';' +
                                    'var SUPPORT_DEBUG = ' + (SUPPORT_DEBUG ? 'true' : 'false') + ';' +
                                    'var SUPPORT_CACHE = ' + (SUPPORT_CACHE ? 'true' : 'false') + ';' +
                                    'var SUPPORT_ASYNC = ' + (SUPPORT_ASYNC ? 'true' : 'false') + ';' +
                                    '(' + _worker.toString() + ')()'
                                ],{
                                    'type': 'text/javascript'
                                })
                            )
                        :

                            /* Load Extern Worker (but also requires CORS) */

                            '../' + name + '.js'
                    );

                    name += '-' + _id;

                    worker_stack[name] || (worker_stack[name] = []);

                    worker_stack[name][_core] = new Worker(worker_payload);
                    worker_stack[name][_core]['onmessage'] = _callback;

                    if(SUPPORT_DEBUG){

                        console.log('Register Worker: ' + name + '@' + _core);
                    }

                    return {

                        'postMessage': function(id, data){

                            worker_stack[name][id]['postMessage'](data);
                        }
                    };
                }
            );
        })() : false

    ), this);

    /** --------------------------------------------------------------------------------------
     * UMD Wrapper for Browser and Node.js
     * @param {!string} name
     * @param {!Function|Object} factory
     * @param {!Function|Object=} root
     * @suppress {checkVars}
     * @const
     */

    function provide(name, factory, root){

        var prop;

        // AMD (RequireJS)
        if((prop = root['define']) && prop['amd']){

            prop([], function(){

                return factory;
            });
        }
        // Closure (Xone)
        else if((prop = root['modules'])){

            prop[name.toLowerCase()] = factory;
        }
        // CommonJS (Node.js)
        else if(typeof module !== 'undefined'){

            /** @export */
            module.exports = factory;
        }
        // Global (window)
        else{

            root[name] = factory;
        }
    }

}).call(this);
