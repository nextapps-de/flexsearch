;/**!
 * @preserve FlexSearch v0.2.68
 * Copyright 2018 Thomas Wilkerling
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

    provide("FlexSearch", (function factory(registerWorker){

        "use strict";

        /**
         * @struct
         * @private
         * @const
         * @final
         */

        var defaults = {

            encode: "icase",
            mode: "forward",
            suggest: false,
            cache: false,
            async: false,
            worker: false,

            // minimum scoring (0 - 9)
            threshold: 0,

            // contextual depth
            depth: 0
        };

        /**
         * @private
         * @enum {Object}
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
                mode: "strict",
                threshold: 9,
                depth: 1
            }
        };

        /**
         * @type {Array}
         * @private
         */

        var globalMatcher = [];

        /**
         * @type {number}
         * @private
         */

        var idCounter = 0;

        /**
         * @enum {number}
         */

        var enumTask = {

            add: 0,
            update: 1,
            remove: 2
        };

        /**  @const  {RegExp} */
        var regexSplit = regex("[ -\/]");

        var filter = createObject();
        var stemmer = createObject();

        /**  @const {Object} */
        var indexBlacklist = (function(){

            var array = Object.getOwnPropertyNames(/** @type {!Array} */ ({}.__proto__));
            var map = createObject();

            for(var i = 0; i < array.length; i++){

                map[array[i]] = 1;
            }

            return map;

        })();

        /**
         * @param {string|Object<string, number|string|boolean|Object|function(string):string>=} options
         * @constructor
         * @private
         */

        function FlexSearch(options){

            if((typeof options === "string") && !indexBlacklist[options]){

                options = profiles[options];
            }

            options || (options = defaults);

            // generate UID

            /** @export */
            this.id = options["id"] || idCounter++;

            // initialize index

            this.init(options);

            // define functional properties

            registerProperty(this, "index", /** @this {FlexSearch} */ function(){

                return this._ids;
            });

            registerProperty(this, "length", /** @this {FlexSearch} */ function(){

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

        FlexSearch.registerMatcher = function(matcher){

            for(var key in matcher){

                if(matcher.hasOwnProperty(key)){

                    globalMatcher.push(regex(key), matcher[key]);
                }
            }

            return this;
        };

        /**
         * @param {string} name
         * @param {function(string):string} encoder
         * @export
         */

        FlexSearch.registerEncoder = function(name, encoder){

            if(!indexBlacklist[name]){

                globalEncoder[name] = encoder;
            }

            return this;
        };

        /**
         * @param {string} lang
         * @param {Object} languagePack
         * @export
         */

        FlexSearch.registerLanguage = function(lang, languagePack){

            if(!indexBlacklist[lang]){

                /**
                 * @type {Array<string>}
                 */

                filter[lang] = languagePack["filter"];

                /**
                 * @type {Object<string, string>}
                 */

                stemmer[lang] = languagePack["stemmer"];
            }

            return this;
        };

        /**
         * @param {!string} name
         * @param {?string} value
         * @returns {?string}
         * @export
         */

        FlexSearch.encode = function(name, value){

            if(indexBlacklist[name]){

                return value;
            }
            else{

                return globalEncoder[name].call(globalEncoder, value);
            }
        };

        /**
         * @param {Object<string, number|string|boolean|Object|function(string):string>=} options
         * @export
         */

        FlexSearch.prototype.init = function(options){

            /** @type {Array} */
            this._matcher = [];

            //if(options){

                options || (options = defaults);

                var custom = options["profile"];
                var profile = custom && !indexBlacklist[custom] ? profiles[custom] : createObject();

                // initialize worker

                if(SUPPORT_WORKER && (custom = options["worker"])){

                    if(typeof Worker === "undefined"){

                        options["worker"] = false;

                        // if(SUPPORT_ASYNC){
                        //
                        //     options["async"] = true;
                        // }

                        this._worker = null;
                    }
                    else{

                        var self = this;
                        var threads = parseInt(custom, 10) || 4;

                        self._currentTask = -1;
                        self._taskCompleted = 0;
                        self._taskResult = [];
                        self._currentCallback = null;
                        //self._ids_count = new Array(threads);
                        self._worker = new Array(threads);

                        for(var i = 0; i < threads; i++){

                            //self._ids_count[i] = 0;

                            self._worker[i] = add_worker(self.id, i, options /*|| defaults*/, function(id, query, result, limit){

                                if(self._taskCompleted === self.worker){

                                    return;
                                }

                                self._taskResult = self._taskResult.concat(result);
                                self._taskCompleted++;

                                if(limit && (self._taskResult.length >= limit)){

                                    self._taskCompleted = self.worker;
                                }

                                if(self._currentCallback && (self._taskCompleted === self.worker)){

                                    // store result to cache
                                    // TODO: add worker cache, may remove global cache

                                    if(self.cache){

                                        self._cache.set(query, self._taskResult);
                                    }

                                    self._currentCallback(self._taskResult);
                                    self._taskResult = [];
                                }

                                return self;
                            });
                        }
                    }
                }

                // apply custom options

                this.mode = (

                    options["mode"] ||
                    profile.mode ||
                    this.mode ||
                    defaults.mode
                );

                if(SUPPORT_ASYNC) this.async = (

                    options["async"] ||
                    this.async ||
                    defaults.async
                );

                if(SUPPORT_WORKER) this.worker = (

                    options["worker"] ||
                    this.worker ||
                    defaults.worker
                );

                this.threshold = (

                    options["threshold"] ||
                    profile.threshold ||
                    this.threshold ||
                    defaults.threshold
                );

                this.depth = (

                    options["depth"] ||
                    profile.depth ||
                    this.depth ||
                    defaults.depth
                );

                this.suggest = (

                    options["suggest"] ||
                    this.suggest ||
                    defaults.suggest
                );

                custom = options["encode"] || profile.encode;

                this.encoder = (

                    (custom && !indexBlacklist[custom] && globalEncoder[custom]) ||
                    (typeof custom === "function" ? custom : this.encoder || false)
                );

                if(SUPPORT_DEBUG){

                    this.debug = (

                        options["debug"] ||
                        this.debug
                    );
                }

                if(custom = options["matcher"]) {

                    this.addMatcher(

                        /** @type {Object<string, string>} */
                        (custom)
                    );
                }

                if((custom = options["filter"]) && !indexBlacklist[custom]) {

                    this.filter = initFilter(filter[custom] || custom, this.encoder);
                }

                if((custom = options["stemmer"]) && !indexBlacklist[custom]) {

                    this.stemmer = initStemmer(stemmer[custom] || custom, this.encoder);
                }
            //}

            // initialize primary index

            this._map = createObject(null, void 0, 10);
            this._ctx = createObject();
            this._ids = createObject();
            this._stack = createObject();
            this._stackKeys = [];

            /**
             * @type {number|null}
             */

            this._timer = null;

            if(SUPPORT_CACHE) {

                this._cacheStatus = true;

                this.cache = custom = (

                    options["cache"] ||
                    this.cache ||
                    defaults.cache
                );

                this._cache = custom ?

                    (new Cache(custom))
                :
                    false;
            }

            return this;
        };

        /**
         * @param {?string} value
         * @returns {?string}
         * @export
         */

        FlexSearch.prototype.encode = function(value){

            if(value && globalMatcher.length){

                value = replace(value, globalMatcher);
            }

            if(value && this._matcher.length){

                value = replace(value, this._matcher);
            }

            if(value && this.encoder){

                value = this.encoder.call(globalEncoder, value);
            }

            // TODO completely filter out words actually can break the context chain
            /*
            if(value && this.filter){

                var words = value.split(" ");
                //var final = "";

                for(var i = 0; i < words.length; i++){

                    var word = words[i];
                    var filter = this.filter[word];

                    if(filter){

                        //var length = word.length - 1;

                        words[i] = filter;
                        //words[i] = word[0] + (length ? word[1] : "");
                        //words[i] = "~" + word[0];
                        //words.splice(i, 1);
                        //i--;
                        //final += (final ? " " : "") + word;
                    }
                }

                value = words.join(" "); // final;
            }
            */

            if(value && this.stemmer){

                value = replace(value, this.stemmer);
            }

            return value;
        };

        /**
         * @param {Object<string, string>} custom
         * @export
         */

        FlexSearch.prototype.addMatcher = function(custom){

            var matcher = this._matcher;

            for(var key in custom){

                if(custom.hasOwnProperty(key)){

                    matcher.push(regex(key), custom[key]);
                }
            }

            return this;
        };

        /**
         * @param {?number|string} id
         * @param {?string} content
         * @param {boolean=} _skipUpdate
         * @this {FlexSearch}
         * @export
         */

        FlexSearch.prototype.add = function(id, content, _skipUpdate){

            if((typeof content === "string") && content && ((id && !indexBlacklist[id]) || (id === 0))){

                // check if index ID already exist

                if(this._ids[id] && !_skipUpdate){

                    this.update(id, content);
                }
                else{

                    if(SUPPORT_WORKER && this.worker){

                        if(++this._currentTask >= this._worker.length){

                            this._currentTask = 0;
                        }

                        this._worker[this._currentTask].postMessage(this._currentTask, {

                            "add": true,
                            "id": id,
                            "content": content
                        });

                        this._ids[id] = "" + this._currentTask;

                        // TODO: improve auto-balancing
                        //this._ids_count[this._currentTask]++;

                        return this;
                    }

                    // collect tasks for non-blocking processing
                    // TODO: actually auto-enabled in worker

                    if(SUPPORT_ASYNC && this.async){

                        this._stack[id] || (

                            this._stackKeys[this._stackKeys.length] = id
                        );

                        this._stack[id] = [

                            enumTask.add,
                            id,
                            content
                        ];

                        registerTask(this);

                        return this;
                    }

                    content = this.encode(content);

                    if(!content.length){

                        return this;
                    }

                    var tokenizer = this.mode;

                    var words = (

                        typeof tokenizer === "function" ?

                            tokenizer(content)
                        :(
                            tokenizer === "ngram" ?

                                /** @type {!Array<string>} */
                                (ngram(content))
                            :
                                /** @type {string} */
                                (content).split(regexSplit)
                        )
                    );

                    var dupes = {

                        "_ctx": createObject()
                    };

                    var threshold = this.threshold;
                    var depth = this.depth;
                    var map = this._map;
                    var wordLength = words.length;

                    // tokenize

                    for(var i = 0; i < wordLength; i++){

                        /** @type {string} */
                        var value = "" + words[i];

                        if(value){

                            var length = value.length;
                            var contextScore = (wordLength - i) / wordLength;

                            switch(tokenizer){

                                case "reverse":
                                case "both":

                                    var tmp = "";

                                    for(var a = length - 1; a >= 1; a--){

                                        tmp = value[a] + tmp;

                                        addIndex(

                                            map,
                                            dupes,
                                            tmp,
                                            id,
                                            (length - a) / length,
                                            contextScore,
                                            threshold
                                        );
                                    }

                                // Note: no break here, fallthrough to next case

                                case "forward":

                                    var tmp = "";

                                    for(var a = 0; a < length; a++){

                                        tmp += value[a];

                                        addIndex(

                                            map,
                                            dupes,
                                            tmp,
                                            id,
                                            1,
                                            contextScore,
                                            threshold
                                        );
                                    }

                                    break;

                                case "full":

                                    var tmp = "";

                                    for(var x = 0; x < length; x++){

                                        var partialScore = (length - x) / length;

                                        for(var y = length; y > x; y--){

                                            tmp = value.substring(x, y);

                                            addIndex(

                                                map,
                                                dupes,
                                                tmp,
                                                id,
                                                partialScore,
                                                contextScore,
                                                threshold
                                            );
                                        }
                                    }

                                    break;

                                case "strict":
                                case "ngram":
                                default:

                                    var score = addIndex(

                                        map,
                                        dupes,
                                        value,
                                        id,
                                        // Note: ngrams has partial scoring (sequence->word) and contextual scoring (word->context)
                                        // TODO compute and pass distance of ngram sequences as the initial score for each word
                                        1,
                                        contextScore,
                                        threshold
                                    );

                                    if(depth && (wordLength > 1) && (score >= threshold)){

                                        var ctxDupes = dupes["_ctx"][value] || (dupes["_ctx"][value] = createObject());
                                        var ctxTmp = this._ctx[value] || (this._ctx[value] = createObject(null, void 0, 10));

                                        var x = i - depth;
                                        var y = i + depth + 1;

                                        if(x < 0) x = 0;
                                        if(y > wordLength) y = wordLength;

                                        for(; x < y; x++){

                                            if(x !== i) addIndex(

                                                ctxTmp,
                                                ctxDupes,
                                                words[x],
                                                id,
                                                0,
                                                10 - (x < i ? i - x : x - i),
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

                    if(SUPPORT_CACHE){

                        this._cacheStatus = false;
                    }
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

            if(this._ids[id] && content && (typeof content === "string")){

                this.remove(id);
                this.add(id, content, /* skip_update: */ true);
            }

            return this;
        };

        /**
         * @param id
         * @export
         */

        FlexSearch.prototype.remove = function(id){

            if(this._ids[id] && !indexBlacklist[id]){

                if(SUPPORT_WORKER && this.worker){

                    var currentTask = parseInt(this._ids[id], 10);

                    this._worker[currentTask].postMessage(currentTask, {

                        "remove": true,
                        "id": id
                    });

                    //this._ids_count[currentTask]--;

                    delete this._ids[id];

                    return this;
                }

                if(SUPPORT_ASYNC && this.async){

                    this._stack[id] || (

                        this._stackKeys[this._stackKeys.length] = id
                    );

                    this._stack[id] = [

                        enumTask.remove,
                        id
                    ];

                    registerTask(this);

                    return this;
                }

                for(var z = 0; z < 10; z++){

                    removeIndex(this._map[z], id);
                }

                if(this.depth){

                    removeIndex(this._ctx, id);
                }

                delete this._ids[id];

                if(SUPPORT_CACHE){

                    this._cacheStatus = false;
                }
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

            if(query && (typeof query === "object")){

                // re-assign properties

                callback = query["callback"] || /** @type {?Function} */ (limit);
                limit = query["limit"];
                threshold = query["threshold"];
                query = query["query"];
            }

            threshold = (threshold || this.threshold || 0) | 0;

            if(typeof limit === "function"){

                callback = limit;
                limit = 1000;
            }
            else{

                limit || (limit = 1000);
            }

            if(SUPPORT_WORKER && this.worker){

                this._currentCallback = callback;
                this._taskCompleted = 0;
                this._taskResult = [];

                for(var i = 0; i < this.worker; i++){

                    this._worker[i].postMessage(i, {

                        "search": true,
                        "limit": limit,
                        "threshold": threshold,
                        "content": query
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

                }, 1, "search-" + this.id);

                return null;
            }

            if(!query || (typeof query !== "string")){

                return result;
            }

            /** @type {!string|Array<string>} */
            var _query = query;

            if(SUPPORT_CACHE && this.cache){

                // invalidate cache

                if(!this._cacheStatus){

                    this._cache.reset();
                    this._cacheStatus = true;
                }

                // validate cache

                else {

                    var cache = this._cache.get(query);

                    if(cache){

                        return cache;
                    }
                }
            }

            // encode string

            _query = this.encode(/** @type {string} */ (_query));

            if(!_query.length){

                return result;
            }

            // convert words into single components

            var tokenizer = this.mode;

            var words = (

                typeof tokenizer === "function" ?

                    tokenizer(_query)
                :(
                    tokenizer === "ngram" ?

                        /** @type {!Array<string>} */
                        (ngram(_query))
                    :
                        /** @type {string} */
                        (_query).split(regexSplit)
                )
            );

            var length = words.length;
            var found = true;
            var check = [];
            var checkWords = createObject();

            if(length > 1){

                if(this.depth){

                    var useContextual = true;
                    var ctxRoot = words[0];

                    checkWords[ctxRoot] = "1";
                }
                else{

                    // Note: sort words by length only in non-contextual mode

                    words.sort(sortByLengthDown);
                }
            }

            var ctxMap;

            if(!useContextual || (ctxMap = this._ctx)[ctxRoot]){

                for(var a = useContextual ? 1 : 0; a < length; a++){

                    var value = words[a];

                    if(value && !checkWords[value]){

                        var map;
                        var mapFound = false;
                        var mapCheck = [];
                        var count = 0;

                        for(var z = 9; z >= threshold; z--){

                            map = (

                                useContextual ?

                                    ctxMap[ctxRoot]
                                :
                                    this._map

                            )[z][value];

                            if(map){

                                mapCheck[count++] = map;
                                mapFound = true;
                            }
                        }

                        if(!mapFound){

                            if(!this.suggest){

                                found = false;
                                break;
                            }
                        }
                        else {

                            // Not handled by intersection:

                            check[check.length] = (

                                count > 1 ?

                                    // https://jsperf.com/merge-arrays-comparison
                                    check.concat.apply([], mapCheck)
                                :
                                    mapCheck[0]
                            );

                            // Handled by intersection:

                            // check[check.length] = mapCheck;
                        }

                        checkWords[value] = "1";
                    }

                    ctxRoot = value;
                }
            }
            else{

                found = false;
            }

            if(found){

                // Not handled by intersection:

                result = intersect(check, limit, this.suggest);

                // Handled by intersection:

                //result = intersect_3d(check, limit, this.suggest);
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

                        "info": true,
                        "id": this.id
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

                    "id": this.id,
                    "memory": bytes,
                    "items": items,
                    "sequences": words,
                    "chars": chars,
                    //"status": this._cacheStatus,
                    "cache": this._stackKeys.length,
                    "matcher": globalMatcher.length,
                    "worker": this.worker
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
                this._cache = null;
            }

            // release references

            this.filter =
            this.stemmer =
            this._scores =
            this._map =
            this._ctx =
            this._ids =
            this._stack =
            this._stackKeys = null;

            return this;
        };

        /** @const */

        var globalEncoderBalance = (function(){

            var regexWhitespace = regex("\\s\\s+"),
                regexStrip = regex("[^a-z0-9 ]"),
                regexSpace = regex("[-\/]"),
                regexVowel = regex("[aeiouy]");

            /** @const {Array} */
            var regexPairs = [

                regexSpace, " ",
                regexStrip, "",
                regexWhitespace, " "
                //regexVowel, ""
            ];

            return function(value){

                return collapseRepeatingChars(replace(value.toLowerCase(), regexPairs));
            }
        })();

        /** @const */

        var globalEncoderIcase = function(value){

            return value.toLowerCase();
        };

        /**
         * Phonetic Encoders
         * @dict {Function}
         * @private
         * @const
         * @final
         */

        var globalEncoder = Object.create(SUPPORT_BUILTINS ? {

            // case insensitive search

            "icase": globalEncoderIcase,

            // literal normalization

            "simple": (function(){

                var regexWhitespace = regex("\\s\\s+"),
                    regexStrip = regex("[^a-z0-9 ]"),
                    regexSpace = regex("[-\/]"),
                    regexA = regex("[àáâãäå]"),
                    regexE = regex("[èéêë]"),
                    regexI = regex("[ìíîï]"),
                    regexO = regex("[òóôõöő]"),
                    regexU = regex("[ùúûüű]"),
                    regexY = regex("[ýŷÿ]"),
                    regexN = regex("ñ"),
                    regexC = regex("ç"),
                    regexS = regex("ß"),
                    regexAnd = regex(" & ");

                /** @const {Array} */
                var regexPairs = [

                    regexA, "a",
                    regexE, "e",
                    regexI, "i",
                    regexO, "o",
                    regexU, "u",
                    regexY, "y",
                    regexN, "n",
                    regexC, "c",
                    regexS, "s",
                    regexAnd, " and ",
                    regexSpace, " ",
                    regexStrip, "",
                    regexWhitespace, " "
                ];

                return function(str){

                    str = replace(str.toLowerCase(), regexPairs);

                    return (

                        str !== " " ? str : ""
                    );
                };
            }()),

            // literal transformation

            "advanced": (function(){

                var regexSpace = regex(" "),
                    regexAe = regex("ae"),
                    regexAi = regex("ai"),
                    regexAy = regex("ay"),
                    regexEy = regex("ey"),
                    regexOe = regex("oe"),
                    regexUe = regex("ue"),
                    regexIe = regex("ie"),
                    regexSz = regex("sz"),
                    regexZs = regex("zs"),
                    regexCk = regex("ck"),
                    regexCc = regex("cc"),
                    regexSh = regex("sh"),
                    //regexTh = regex("th"),
                    regexDt = regex("dt"),
                    regexPh = regex("ph"),
                    regexPf = regex("pf"),
                    regexOu = regex("ou"),
                    regexUo = regex("uo");

                /** @const {Array} */
                var regexPairs = [

                    regexAe, "a",
                    regexAi, "ei",
                    regexAy, "ei",
                    regexEy, "ei",
                    regexOe, "o",
                    regexUe, "u",
                    regexIe, "i",
                    regexSz, "s",
                    regexZs, "s",
                    regexSh, "s",
                    regexCk, "k",
                    regexCc, "k",
                    //regexTh, "t",
                    regexDt, "t",
                    regexPh, "f",
                    regexPf, "f",
                    regexOu, "o",
                    regexUo, "u"
                ];

                return /** @this {Object} */ function(string, _skipPostProcessing){

                    if(!string){

                        return string;
                    }

                    // perform simple encoding
                    string = this["simple"](string);

                    // normalize special pairs
                    if(string.length > 2){

                        string = replace(string, regexPairs)
                    }

                    if(!_skipPostProcessing){

                        // remove white spaces
                        //string = string.replace(regexSpace, "");

                        // delete all repeating chars
                        if(string.length > 1){

                            string = collapseRepeatingChars(string);
                        }
                    }

                    return string;
                };

            })(),

            // phonetic transformation

            "extra": (function(){

                var soundexB = regex("p"),
                    //soundex_c = regex("[sz]"),
                    soundexS = regex("z"),
                    soundexK = regex("[cgq]"),
                    //soundexI = regex("[jy]"),
                    soundexM = regex("n"),
                    soundexT = regex("d"),
                    soundexF = regex("[vw]");

                /** @const {RegExp} */
                var regexVowel = regex("[aeiouy]");

                /** @const {Array} */
                var regexPairs = [

                    soundexB, "b",
                    soundexS, "s",
                    soundexK, "k",
                    //soundexI, "i",
                    soundexM, "m",
                    soundexT, "t",
                    soundexF, "f",
                    regexVowel, ""
                ];

                return /** @this {Object} */ function(str){

                    if(!str){

                        return str;
                    }

                    // perform advanced encoding
                    str = this["advanced"](str, /* skip post processing? */ true);

                    if(str.length > 1){

                        str = str.split(" ");

                        for(var i = 0; i < str.length; i++){

                            var current = str[i];

                            if(current.length > 1){

                                // remove all vowels after 2nd char
                                str[i] = current[0] + replace(current.substring(1), regexPairs);
                            }
                        }

                        str = str.join(" ");
                        str = collapseRepeatingChars(str);
                    }

                    return str;
                };
            })(),

            "balance": globalEncoderBalance

        } : {

            "icase": globalEncoderIcase,
            "balance": globalEncoderBalance
        });

        // Xone Async Handler Fallback

        var queue = SUPPORT_ASYNC ? (function(){

            var stack = createObject();

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

        // Flexi-Cache

        var Cache = SUPPORT_CACHE ? (function(){

            /** @this {Cache} */
            function Cache(limit){

                this.reset();

                this.limit = (limit !== true) && limit;
            }

            /** @this {Cache} */
            Cache.prototype.reset = function(){

                this.cache = createObject();
                this.count = createObject();
                this.index = createObject();
                this.ids = [];
            };

            /** @this {Cache} */
            Cache.prototype.set = function(id, value){

                if(this.limit && (typeof this.cache[id] === "undefined")){

                    var length = this.ids.length;

                    if(length === this.limit){

                        length--;

                        var last_id = this.ids[length];

                        delete this.cache[last_id];
                        delete this.count[last_id];
                        delete this.index[last_id];
                    }

                    this.index[id] = length;
                    this.ids[length] = id;
                    this.count[id] = -1;
                    this.cache[id] = value;

                    // shift up counter +1

                    this.get(id);
                }
                else{

                    this.cache[id] = value;
                }
            };

            /**
             * Note: It is better to have the complexity when fetching the cache:
             * @this {Cache}
             */

            Cache.prototype.get = function(id){

                var cache = this.cache[id];

                if(this.limit && cache){

                    var count = ++this.count[id];
                    var index = this.index;
                    var currentIndex = index[id];

                    if(currentIndex > 0){

                        var ids = this.ids;
                        var oldIndex = currentIndex;

                        // forward pointer
                        while(this.count[ids[--currentIndex]] <= count){

                            if(currentIndex === -1){

                                break;
                            }
                        }

                        // move pointer back
                        currentIndex++;

                        if(currentIndex !== oldIndex){

                            // copy values from predecessors
                            for(var i = oldIndex; i > currentIndex; i--) {

                                var key = ids[i - 1];

                                ids[i] = key;
                                index[key] = i;
                            }

                            // push new value on top
                            ids[currentIndex] = id;
                            index[id] = currentIndex;
                        }
                    }
                }

                return cache;
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

            return new RegExp("" + str, "g");
        }

        /**
         * @param {!string} str
         * @param {RegExp|Array} regex
         * @param {string=} replacement
         * @returns {string}
         */

        function replace(str, regex, replacement){

            if(typeof replacement === "undefined"){

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
         * @param {number} partialScore
         * @param {number} contextScore
         * @param {number} threshold
         */

        function addIndex(map, dupes, tmp, id, partialScore, contextScore, threshold){

            if(typeof dupes[tmp] === "undefined"){

                var score = (

                    partialScore ?

                        ((9 - (threshold || 6)) * contextScore) + ((threshold || 6) * partialScore)
                        // calcScore(tmp, content)
                    :
                        contextScore
                );

                dupes[tmp] = score;

                if(score >= threshold){

                    var arr = map[((score + 0.5) | 0)];
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

        /*
        function calcScore(part, ref){

            var contextIndex = ref.indexOf(part);
            var partial_index = contextIndex - ref.lastIndexOf(" ", contextIndex);

            return (

                (3 / ref.length * (ref.length - contextIndex)) + (6 / partial_index)
            );
        }
        */

        /**
         * @param {Object} map
         * @param {string|number} id
         */

        function removeIndex(map, id){

            if(map){

                var keys = Object.keys(map);

                for(var i = 0, lengthKeys = keys.length; i < lengthKeys; i++){

                    var key = keys[i];
                    var tmp = map[key];

                    if(tmp){

                        for(var a = 0, lengthMap = tmp.length; a < lengthMap; a++){

                            if(tmp[a] === id){

                                if(lengthMap === 1){

                                    delete map[key];
                                }
                                else{

                                    tmp.splice(a, 1);
                                }

                                break;
                            }
                            else if(typeof tmp[a] === "object"){

                                removeIndex(tmp[a], id);
                            }
                        }
                    }
                }
            }
        }

        /**
         * @param {!string} value
         * @returns {Array<?string>}
         */

        function ngram(value){

            var parts = [];

            if(!value){

                return parts;
            }

            var countVowels = 0,
                countLiteral = 0,
                countParts = 0;

            var tmp = "";
            var length = value.length;

            for(var i = 0; i < length; i++){

                var char = value[i];
                var charIsVowel = (

                    (char === "a") ||
                    (char === "e") ||
                    (char === "i") ||
                    (char === "o") ||
                    (char === "u") ||
                    (char === "y")
                );

                if(charIsVowel){

                    countVowels++;
                }
                else{

                    countLiteral++;
                }

                if(char !== " ") {

                    tmp += char;
                }

                //console.log(tmp);

                // dynamic n-gram sequences

                if((char === " ") || (

                    (countVowels >= (length > 8 ? 2 : 1)) &&
                    (countLiteral >= 2)

                ) || (

                    (countVowels >= 2) &&
                    (countLiteral >= (length > 8 ? 2 : 1))

                ) || (i === length - 1)){

                    if(tmp){

                        if(parts[countParts] && (tmp.length > 2)){

                            countParts++;
                        }

                        if(parts[countParts]){

                            parts[countParts] += tmp;
                        }
                        else{

                            parts[countParts] = tmp;
                        }

                        if(char === " "){

                            countParts++;
                        }

                        tmp = "";
                    }

                    countVowels = 0;
                    countLiteral = 0;
                }
            }

            return parts;
        }

        /**
         * @param {!string} string
         * @returns {string}
         */

        function collapseRepeatingChars(string){

            var collapsedString = "",
                charPrev = "",
                charNext = "";

            for(var i = 0; i < string.length; i++){

                var char = string[i];

                if(char !== charPrev){

                    if(i && (char === "h")){

                        var charPrevIsVowel = (

                            (charPrev === "a") ||
                            (charPrev === "e") ||
                            (charPrev === "i") ||
                            (charPrev === "o") ||
                            (charPrev === "u") ||
                            (charPrev === "y")
                        );

                        var charNextIsVowel = (

                            (charNext === "a") ||
                            (charNext === "e") ||
                            (charNext === "i") ||
                            (charNext === "o") ||
                            (charNext === "u") ||
                            (charNext === "y")
                        );

                        if((charPrevIsVowel && charNextIsVowel) || (charPrev === " ")){

                            collapsedString += char;
                        }
                    }
                    else{

                        collapsedString += char;
                    }
                }

                charNext = (

                    (i === (string.length - 1)) ?

                        ""
                    :
                        string[i + 1]
                );

                charPrev = char;
            }

            return collapsedString;
        }

        /**
         * @param {Array<string>} words
         * @param encoder
         * @returns {Object<string, string>}
         */

        function initFilter(words, encoder){

            var final = createObject();

            if(words){

                for(var i = 0; i < words.length; i++){

                    var word = encoder ? encoder.call(globalEncoder, words[i]) : words[i];

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

                for(var key in stemmer){

                    if(stemmer.hasOwnProperty(key)){

                        var tmp = encoder ? encoder.call(globalEncoder, key) : key;

                        final.push(

                            regex("(?=.{" + (tmp.length + 3) + ",})" + tmp + "$"),

                            encoder ?

                                encoder.call(globalEncoder, stemmer[key])
                            :
                                stemmer[key]
                        );
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
         * @param {boolean=} suggest
         * @returns {Array}
         */

        function intersect(arrays, limit, suggest) {

            var result = [];
            var suggestions = [];
            var lengthZ = arrays.length;

            if(lengthZ > 1){

                // pre-sort arrays by length up

                arrays.sort(sortByLengthUp);

                // fill initial map

                var check = createObject();
                var arr = arrays[0];
                var length = arr.length;
                var i = 0;

                while(i < length) {

                    check[arr[i++]] = 1;
                }

                // loop through arrays

                var tmp, count = 0;
                var z = 1;

                while(z < lengthZ){

                    // get each array one by one

                    var found = false;
                    var isFinalLoop = (z === (lengthZ - 1));

                    suggestions = [];
                    arr = arrays[z];
                    length = arr.length;
                    i = -1;

                    while(i < length){

                        var checkVal = check[tmp = arr[++i]];

                        if(checkVal === z){

                            // fill in during last round

                            if(isFinalLoop){

                                result[count++] = tmp;

                                if(limit && (count === limit)){

                                    return result;
                                }
                            }

                            // apply count status

                            found = true;
                            check[tmp] = z + 1;
                        }
                        else if(suggest){

                            var currentSuggestion = suggestions[checkVal] || (suggestions[checkVal] = []);

                            currentSuggestion[currentSuggestion.length] = tmp;
                        }
                    }

                    if(!found && !suggest){

                        break;
                    }

                    z++;
                }

                if(suggest){

                    limit || (limit = 1000);
                    count = result.length;
                    length = suggestions.length;

                    if((count < limit) && length){

                        for(z = length - 1; z >= 0; z--){

                            tmp = suggestions[z];

                            if(tmp){

                                for(i = 0; i < tmp.length; i++){

                                    result[count++] = tmp[i];

                                    if(limit && (count === limit)){

                                        return result;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if(lengthZ){

                result = arrays[0];

                if(limit && /*result &&*/ (result.length > limit)){

                    // Note: do not modify the original index array!

                    result = result.slice(0, limit);
                }

                // Note: handle references to the original index array
                //return result.slice(0);
            }

            return result;
        }

        /**
         * @param {!Array<Array<number|string>>} arrays
         * @param {number=} limit
         * @returns {Array}
         */

        /*
        function intersect_3d(arrays, limit) {

            var result = [];
            var lengthZ = arrays.length;

            if(lengthZ > 1){

                // pre-sort arrays by length up

                arrays.sort(sortByLengthUp);

                var arr_tmp = arrays[0];

                for(var a = 0; a < arr_tmp.length; a++){

                    // fill initial map

                    var check = {};
                    var arr = arr_tmp[a];
                    var length = arr.length;
                    var i = 0;

                    while(i < length) {

                        check[arr[i++]] = 1;
                    }
                }

                // loop through arrays

                var tmp, count = 0;
                var z = 1;

                while(z < lengthZ){

                    // get each array one by one

                    var found = false;

                    var arr_tmp = arrays[0];

                    for(var a = 0; a < arr_tmp.length; a++){

                        arr = arr_tmp[a];
                        length = arr.length;
                        i = 0;

                        while(i < length){

                            if((check[tmp = arr[i++]]) === z){

                                // fill in during last round

                                if(z === (lengthZ - 1)){

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
                    }

                    if(!found){

                        break;
                    }

                    z++;
                }
            }
            else if(lengthZ){

                arrays = arrays[0];

                result = arrays.length > 1 ? result.concat.apply(result, arrays) : arrays[0];

                if(limit && (result.length > limit)){

                    // Note: do not touch original array!

                    result = result.slice(0, limit);
                }
            }

            return result;
        }
        */

        /**
         * Fastest intersect method for 2 sorted arrays so far
         * @param {!Array<number|string>} a
         * @param {!Array<number|string>} b
         * @param {number=} limit
         * @returns {Array}
         */

        /*
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
        */

        /**
         * @param {FlexSearch} ref
         */

        function runner(ref){

            var async = ref.async;
            var current;

            if(async){

                ref.async = false;
            }

            if(ref._stackKeys.length){

                var start = time();
                var key;

                // TODO: optimize shift() using a loop and splice()
                while((key = ref._stackKeys.shift()) || (key === 0)){

                    current = ref._stack[key];

                    switch(current[0]){

                        case enumTask.add:

                            ref.add(current[1], current[2]);
                            break;

                        // Note: Update is handled by .remove() + .add()
                        //
                        // case enumTask.update:
                        //
                        //     ref.update(current[1], current[2]);
                        //     break;

                        case enumTask.remove:

                            ref.remove(current[1]);
                            break;
                    }

                    delete ref._stack[key];

                    if((time() - start) > 100){

                        break;
                    }
                }

                if(ref._stackKeys.length){

                    registerTask(ref);
                }
            }

            if(async){

                ref.async = async;
            }
        }

        /**
         * @param {FlexSearch} ref
         */

        function registerTask(ref){

            ref._timer || (

                ref._timer = queue(function(){

                    ref._timer = null;

                    runner(ref);

                }, 1, "search-async-" + ref.id)
            );
        }

        /**
         * @returns {number}
         */

        function time(){

            return (

                typeof performance !== "undefined" ?

                    performance.now()
                :
                    (new Date()).getTime()
            );
        }

        /**
         * @param {Object|null=} prototype
         * @param {Object=} properties
         * @param {number=} count
         * @returns {Object|Array<Object>}
         */

        function createObject(prototype, properties, count){

            if(count){

                var array = new Array(count);

                for(var i = 0; i < count; i++){

                    array[i] = createObject(prototype, properties);
                }

                return array;
            }
            else{

                return Object.create(prototype || null, properties);
            }
        }

        function add_worker(id, core, options, callback){

            var thread = registerWorker(

                // name:
                "flexsearch",

                // id:
                "id" + id,

                // worker:
                function(){

                    var id;

                    /** @type {FlexSearch} */
                    var flexsearch;

                    /** @lends {Worker} */
                    self.onmessage = function(event){

                        var data = event["data"];

                        if(data){

                            // if(flexsearch.debug){
                            //
                            //     console.log("Worker Job Started: " + data["id"]);
                            // }

                            if(data["search"]){

                                var results = flexsearch["search"](data["content"],

                                    data["threshold"] ?

                                        {
                                            "limit": data["limit"],
                                            "threshold": data["threshold"]
                                        }
                                    :
                                        data["limit"]
                                );

                                /** @lends {Worker} */
                                self.postMessage({

                                    "id": id,
                                    "content": data["content"],
                                    "limit": data["limit"],
                                    "result":results
                                });
                            }
                            else if(data["add"]){

                                flexsearch["add"](data["id"], data["content"]);
                            }
                            else if(data["update"]){

                                flexsearch["update"](data["id"], data["content"]);
                            }
                            else if(data["remove"]){

                                flexsearch["remove"](data["id"]);
                            }
                            else if(data["reset"]){

                                flexsearch["reset"]();
                            }
                            else if(data["info"]){

                                var info = flexsearch["info"]();

                                info["worker"] = id;

                                if(flexsearch.debug){

                                    console.log(info);
                                }

                                /** @lends {Worker} */
                                //self.postMessage(info);
                            }
                            else if(data["register"]){

                                id = data["id"];

                                data["options"]["cache"] = false;
                                data["options"]["async"] = true;
                                data["options"]["worker"] = false;

                                flexsearch = new Function(

                                    data["register"].substring(

                                        data["register"].indexOf("{") + 1,
                                        data["register"].lastIndexOf("}")
                                    )
                                )();

                                flexsearch = new flexsearch(data["options"]);
                            }
                        }
                    };
                },

                // callback:
                function(event){

                    var data = event["data"];

                    if(data && data["result"]){

                        callback(data["id"], data["content"], data["result"], data["limit"]);
                    }
                    else{

                        if(SUPPORT_DEBUG && options["debug"]){

                            console.log(data);
                        }
                    }
                },

                // cores:
                core
            );

            var fnStr = factory.toString();

            options["id"] = core;

            thread.postMessage(core, {

                "register": fnStr,
                "options": options,
                "id": core
            });

            return thread;
        }
    })(
        // Xone Worker Handler Fallback

        SUPPORT_WORKER ? (function registerWorker(){

            var workerStack =  Object.create(null);
            var inlineSupported = !!((typeof Blob !== "undefined") && (typeof URL !== "undefined") && URL.createObjectURL);

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
                    var workerPayload = (

                        inlineSupported ?

                            /* Load Inline Worker */

                            URL.createObjectURL(

                                new Blob([

                                    "var SUPPORT_WORKER = true;" +
                                    "var SUPPORT_BUILTINS = " + (SUPPORT_BUILTINS ? "true" : "false") + ";" +
                                    "var SUPPORT_DEBUG = " + (SUPPORT_DEBUG ? "true" : "false") + ";" +
                                    "var SUPPORT_CACHE = " + (SUPPORT_CACHE ? "true" : "false") + ";" +
                                    "var SUPPORT_ASYNC = " + (SUPPORT_ASYNC ? "true" : "false") + ";" +
                                    "(" + _worker.toString() + ")()"
                                ],{
                                    "type": "text/javascript"
                                })
                            )
                        :

                            /* Load Extern Worker (but also requires CORS) */

                            "../" + name + ".js"
                    );

                    name += "-" + _id;

                    workerStack[name] || (workerStack[name] = []);

                    workerStack[name][_core] = new Worker(workerPayload);
                    workerStack[name][_core]["onmessage"] = _callback;

                    if(SUPPORT_DEBUG){

                        console.log("Register Worker: " + name + "@" + _core);
                    }

                    return {

                        "postMessage": function(id, data){

                            workerStack[name][id]["postMessage"](data);
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
        if((prop = root["define"]) && prop["amd"]){

            prop([], function(){

                return factory;
            });
        }
        // Closure (Xone)
        else if((prop = root["modules"])){

            prop[name.toLowerCase()] = factory;
        }
        // CommonJS (Node.js)
        else if(typeof module !== "undefined"){

            /** @export */
            module.exports = factory;
        }
        // Global (window)
        else{

            root[name] = factory;
        }
    }

}).call(this);

/*
    Future Benchmarks:

    https://jsperf.com/comparison-var-let-const
    https://jsperf.com/let-vs-var-performance/93
 */
