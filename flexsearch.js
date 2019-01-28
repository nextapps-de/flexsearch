;/**!
 * @preserve FlexSearch v0.3.2
 * Copyright 2019 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Released under the Apache 2.0 Licence
 * https://github.com/nextapps-de/flexsearch
 */

/** @define {string} */  const RELEASE = "";
/** @define {boolean} */ const DEBUG = true;
/** @define {boolean} */ const PROFILER = false;
/** @define {boolean} */ const SUPPORT_WORKER = true;
/** @define {boolean} */ const SUPPORT_ENCODER = true;
/** @define {boolean} */ const SUPPORT_CACHE = true;
/** @define {boolean} */ const SUPPORT_ASYNC = true;
/** @define {boolean} */ const SUPPORT_PRESETS = true;
/** @define {boolean} */ const SUPPORT_SUGGESTIONS = true;

// noinspection ThisExpressionReferencesGlobalObjectJS
(function(){

    provide("FlexSearch", (function factory(register_worker){

        "use strict";

        /**
         * @const
         * @enum {boolean|string|number}
         */

        const defaults = {

            encode: "icase",
            tokenize: "forward",
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
         * @enum {Object}
         * @const
         */

        const presets = {

            "memory": {
                encode: SUPPORT_ENCODER ? "extra" : "icase",
                tokenize: "strict",
                threshold: 7
            },

            "speed": {
                encode: "icase",
                tokenize: "strict",
                threshold: 7,
                depth: 2
            },

            "match": {
                encode: SUPPORT_ENCODER ? "extra" : "icase",
                tokenize: "full"
            },

            "score": {
                encode: SUPPORT_ENCODER ? "extra" : "icase",
                tokenize: "strict",
                threshold: 5,
                depth: 4
            },

            "balance": {
                encode: SUPPORT_ENCODER ? "balance" : "icase",
                tokenize: "strict",
                threshold: 6,
                depth: 3
            },

            "fastest": {
                encode: "icase",
                tokenize: "strict",
                threshold: 9,
                depth: 1
            }
        };

        const profiles = [];
        let profile;

        /**
         * @type {Array}
         */

        const global_matcher = [];

        /**
         * @type {number}
         */

        let id_counter = 0;

        /**
         * @enum {number}
         */

        const enum_task = {

            add: 0,
            update: 1,
            remove: 2
        };

        /**
         * @const  {RegExp}
         */

        const regex_split = regex("[ -\/]");
        const filter = {};
        const stemmer = {};

        /**
         * @const {Object<string|number, number>}
         */

        const index_blacklist = (function(){

            const array = Object.getOwnPropertyNames(/** @type {!Array} */ (({}).__proto__));
            const map = {};

            for(let i = 0; i < array.length; i++){

                map[array[i]] = 1;
            }

            return map;
        })();

        /**
         * @param {string|Object<string, number|string|boolean|Object|function(string):string>=} options
         * @constructor
         */

        function FlexSearch(options){

            if(PROFILER){

                this["stats"] = profile = profiles[id_counter] || (profiles[id_counter] = {});
            }

            if(SUPPORT_PRESETS && is_string(options)){

                options = presets[options];

                if(DEBUG && !options){

                    console.warn("Preset not found: " + options);
                }
            }

            options || (options = defaults);

            // generate UID

            /** @export */
            this.id = options["id"] || id_counter++;

            // initialize index

            this.init(options);

            // define functional properties

            register_property(this, "index", /** @this {FlexSearch} */ function(){

                return this._ids;
            });

            register_property(this, "length", /** @this {FlexSearch} */ function(){

                return get_keys(this._ids).length;
            });
        }

        /**
         * @param {Object<string, number|string|boolean|Object|function(string):string>=} options
         * @export
         */

        FlexSearch.create = function(options){

            return new FlexSearch(options);
        };

        /**
         * @param {Object<string, string>} matcher
         * @export
         */

        FlexSearch.registerMatcher = function(matcher){

            for(let key in matcher){

                if(matcher.hasOwnProperty(key)){

                    global_matcher.push(regex(key), matcher[key]);
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

            global_encoder[name] = encoder.bind(global_encoder);

            return this;
        };

        /**
         * @param {string} lang
         * @param {Object} language_pack
         * @export
         */

        FlexSearch.registerLanguage = function(lang, language_pack){

            /**
             * @type {Array<string>}
             */

            filter[lang] = language_pack["filter"];

            /**
             * @type {Object<string, string>}
             */

            stemmer[lang] = language_pack["stemmer"];

            return this;
        };

        /**
         * @param {string} name
         * @param {string} value
         * @returns {string}
         * @export
         */

        FlexSearch.encode = function(name, value){

            if(index_blacklist[name]){

                return value;
            }
            else{

                return global_encoder[name](value);
            }
        };

        /**
         * @param {Object<string, number|string|boolean|Object|function(string):string>=} options
         * @export
         */

        FlexSearch.prototype.init = function(options){

            /** @type {Array} @private */
            this._matcher = [];

            options || (options = defaults);

            let custom = /** @type {?string} */ (options["profile"]);
            const profile = SUPPORT_PRESETS && custom ? presets[custom] : {};

            if(DEBUG && !profile){

                console.warn("Preset not found: " + custom);
            }

            // initialize worker

            if(SUPPORT_WORKER && (custom = options["worker"])){

                if(Worker){

                    const self = this;
                    const threads = parseInt(custom, 10) || 4;

                    /** @private */
                    self._current_task = -1;
                    /** @private */
                    self._task_completed = 0;
                    /** @private */
                    self._task_result = [];
                    /** @private */
                    self._current_callback = null;
                    //self._ids_count = new Array(threads);
                    /** @private */
                    self._worker = new Array(threads);

                    for(let i = 0; i < threads; i++){

                        //self._ids_count[i] = 0;

                        self._worker[i] = addWorker(self.id, i, options /*|| defaults*/, function(id, query, result, limit){

                            if(self._task_completed === self.worker){

                                return;
                            }

                            self._task_result = self._task_result.concat(result);
                            self._task_completed++;

                            if(limit && (self._task_result.length >= limit)){

                                self._task_completed = self.worker;
                            }

                            if(self._current_callback && (self._task_completed === self.worker)){

                                // store result to cache
                                // TODO: add worker cache, may remove global cache

                                if(self.cache){

                                    self._cache.set(query, self._task_result);
                                }

                                self._current_callback(self._task_result);
                                self._task_result = [];
                            }

                            return self;
                        });
                    }
                }
                else{

                    options["worker"] = false;

                    /** @private */
                    this._worker = null;
                }
            }

            // apply custom options

            /** @private */
            this.tokenize = (

                options["tokenize"] ||
                profile.tokenize ||
                this.tokenize ||
                defaults.tokenize
            );

            if(SUPPORT_ASYNC) /** @private */ this.async = (

                is_undefined(custom = options["async"]) ?

                    this.async ||
                    defaults.async
                :
                    custom
            );

            if(SUPPORT_WORKER) /** @private */ this.worker = (

                is_undefined(custom = options["worker"]) ?

                    this.worker ||
                    defaults.worker
                :
                    custom
            );

            /** @private */
            this.threshold = (

                is_undefined(custom = options["threshold"]) ?

                    profile.threshold ||
                    this.threshold ||
                    defaults.threshold
                :
                    custom
            );

            /** @private */
            this.depth = (

                is_undefined(custom = options["depth"]) ?

                    profile.depth ||
                    this.depth ||
                    defaults.depth
                :
                    custom
            );

            if(SUPPORT_SUGGESTIONS){

                /** @private */
                this.suggest = (

                    is_undefined(custom = options["suggest"]) ?

                        this.suggest ||
                        defaults.suggest
                    :
                        custom
                );
            }

            custom = is_undefined(custom = options["encode"]) ?

                profile.encode
            :
                custom;

            /** @private */
            this.encoder = (

                (custom && global_encoder[custom] && global_encoder[custom].bind(global_encoder)) ||
                (is_function(custom) ? custom : this.encoder || false)
            );

            if((custom = options["matcher"])) {

                this.addMatcher(

                    /** @type {Object<string, string>} */
                    (custom)
                );
            }

            if((custom = options["filter"])) {

                /** @private */
                this.filter = init_filter(filter[custom] || custom, this.encoder);
            }

            if((custom = options["stemmer"])) {

                /** @private */
                this.stemmer = init_stemmer(stemmer[custom] || custom, this.encoder);
            }

            // initialize primary index

            /** @private */
            this._map = create_object_array(10);
            /** @private */
            this._ctx = {};
            /** @private */
            this._ids = {};
            /** @private */
            this._stack = {};
            /** @private */
            this._stack_keys = [];

            /**
             * @type {number|null}
             * @private
             */

            this._timer = 0;

            if(SUPPORT_CACHE) {

                /** @private */
                this._cache_status = true;

                /** @private */
                this.cache = custom = (

                    is_undefined(custom = options["cache"]) ?

                        this.cache ||
                        defaults.cache
                    :
                        custom
                );

                /** @private */
                this._cache = custom ?

                    new Cache(custom)
                :
                    false;
            }

            return this;
        };

        /**
         * @param {string} value
         * @returns {string}
         * @export
         */

        FlexSearch.prototype.encode = function(value){

            if(PROFILER){

                profile_start("encode");
            }

            if(value && global_matcher.length){

                value = replace(value, global_matcher);
            }

            if(value && this._matcher.length){

                value = replace(value, this._matcher);
            }

            if(value && this.encoder){

                value = this.encoder(value);
            }

            // TODO completely filter out words actually can break the context chain
            /*
            if(value && this.filter){

                const words = value.split(" ");
                //const final = "";

                for(const i = 0; i < words.length; i++){

                    const word = words[i];
                    const filter = this.filter[word];

                    if(filter){

                        //const length = word.length - 1;

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

            if(PROFILER){

                profile_end("encode");
            }

            return value;
        };

        /**
         * @param {Object<string, string>} custom
         * @export
         */

        FlexSearch.prototype.addMatcher = function(custom){

            const matcher = this._matcher;

            for(const key in custom){

                if(custom.hasOwnProperty(key)){

                    matcher.push(regex(key), custom[key]);
                }
            }

            return this;
        };

        /**
         * @param {number|string} id
         * @param {string} content
         * @param {boolean=} _skip_update
         * @this {FlexSearch}
         * @export
         */

        FlexSearch.prototype.add = function(id, content, _skip_update){

            if(content && is_string(content) && ((id && !index_blacklist[id]) || (id === 0))){

                // check if index ID already exist

                if(this._ids[id] && !_skip_update){

                    this.update(id, content);
                }
                else{

                    if(SUPPORT_WORKER && this.worker){

                        if(++this._current_task >= this._worker.length){

                            this._current_task = 0;
                        }

                        this._worker[this._current_task].postMessage(this._current_task, {

                            "add": true,
                            "id": id,
                            "content": content
                        });

                        this._ids[id] = "" + this._current_task;

                        // TODO: improve auto-balancing
                        //this._ids_count[this._current_task]++;

                        return this;
                    }

                    // collect tasks for non-blocking processing
                    // TODO: actually auto-enabled in worker

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

                    if(PROFILER){

                        profile_start("add");
                    }

                    content = this.encode(content);

                    if(!content.length){

                        return this;
                    }

                    const tokenizer = this.tokenize;

                    const words = (

                        is_function(tokenizer) ?

                            tokenizer(content)
                        :(
                            SUPPORT_ENCODER && (tokenizer === "ngram") ?

                                /** @type {!Array<string>} */
                                (ngram(/** @type {!string} */(content)))
                            :
                                /** @type {string} */
                                (content).split(regex_split)
                        )
                    );

                    const dupes = { "_ctx": {} };

                    const threshold = this.threshold;
                    const depth = this.depth;
                    const map = this._map;
                    const word_length = words.length;

                    // tokenize

                    for(let i = 0; i < word_length; i++){

                        /** @type {string} */
                        const value = words[i];

                        if(value){

                            const length = value.length;
                            const context_score = (word_length - i) / word_length;

                            let tmp = "";

                            switch(tokenizer){

                                case "reverse":
                                case "both":

                                    for(let a = length - 1; a >= 1; a--){

                                        tmp = value[a] + tmp;

                                        add_index(

                                            map,
                                            dupes,
                                            tmp,
                                            id,
                                            (length - a) / length,
                                            context_score,
                                            threshold
                                        );
                                    }

                                    tmp = "";

                                // Note: no break here, fallthrough to next case

                                case "forward":

                                    for(let a = 0; a < length; a++){

                                        tmp += value[a];

                                        add_index(

                                            map,
                                            dupes,
                                            tmp,
                                            id,
                                            1,
                                            context_score,
                                            threshold
                                        );
                                    }

                                    break;

                                case "full":

                                    for(let x = 0; x < length; x++){

                                        const partial_score = (length - x) / length;

                                        for(let y = length; y > x; y--){

                                            tmp = value.substring(x, y);

                                            add_index(

                                                map,
                                                dupes,
                                                tmp,
                                                id,
                                                partial_score,
                                                context_score,
                                                threshold
                                            );
                                        }
                                    }

                                    break;

                                //case "strict":
                                //case "ngram":
                                default:

                                    const score = add_index(

                                        map,
                                        dupes,
                                        value,
                                        id,
                                        // Note: ngrams has partial scoring (sequence->word) and contextual scoring (word->context)
                                        // TODO compute and pass distance of ngram sequences as the initial score for each word
                                        1,
                                        context_score,
                                        threshold
                                    );

                                    if(depth && (word_length > 1) && (score >= threshold)){

                                        const ctxDupes = dupes["_ctx"][value] || (dupes["_ctx"][value] = {});
                                        const ctxTmp = this._ctx[value] || (this._ctx[value] = create_object_array(10));

                                        let x = i - depth;
                                        let y = i + depth + 1;

                                        if(x < 0) x = 0;
                                        if(y > word_length) y = word_length;

                                        for(; x < y; x++){

                                            if(x !== i) add_index(

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

                    this._ids[id] = 1;

                    if(SUPPORT_CACHE){

                        this._cache_status = false;
                    }

                    if(PROFILER){

                        profile_end("add");
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

            if(this._ids[id] && is_string(content)){

                if(PROFILER){

                    profile_start("update");
                }

                this.remove(id);
                this.add(id, content, /* skip_update: */ true);

                if(PROFILER){

                    profile_end("update");
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

                    const current_task = this._ids[id];

                    this._worker[current_task].postMessage(current_task, {

                        "remove": true,
                        "id": id
                    });

                    //this._ids_count[current_task]--;

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

                if(PROFILER){

                    profile_start("remove");
                }

                for(let z = 0; z < 10; z++){

                    remove_index(this._map[z], id);
                }

                if(this.depth){

                    remove_index(this._ctx, id);
                }

                delete this._ids[id];

                if(SUPPORT_CACHE){

                    this._cache_status = false;
                }

                if(PROFILER){

                    profile_end("remove");
                }
            }

            return this;
        };

        /**
         * @param {!string} query
         * @param {number|Function=} limit
         * @param {Function=} callback
         * @param {boolean=} _recall
         * @returns {Array|Promise|undefined}
         * @export
         */

        FlexSearch.prototype.search = function(query, limit, callback, _recall){

            let _query = query;
            let threshold;
            let result = [];

            if(is_object(query)){

                // re-assign properties

                if(SUPPORT_ASYNC){

                    callback = query["callback"] || /** @type {?Function} */ (limit);

                    if(callback) {

                        _query["callback"] = null;
                    }
                }

                limit = query["limit"];
                threshold = query["threshold"];
                query = query["query"];
            }

            /*
            if(index_blacklist[query]){

                return result;
            }
            */

            threshold || (threshold = this.threshold || 0);

            if(is_function(limit)){

                callback = limit;
                limit = 1000;
            }
            else {

                limit || (limit === 0 ) || (limit = 1000);
            }

            if(SUPPORT_WORKER && this.worker){

                this._current_callback = callback;
                this._task_completed = 0;
                this._task_result = [];

                for(let i = 0; i < this.worker; i++){

                    this._worker[i].postMessage(i, {

                        "search": true,
                        "limit": limit,
                        "threshold": threshold,
                        "content": query
                    });
                }

                return;
            }

            if(callback){

                if(SUPPORT_ASYNC){

                    /** @type {FlexSearch} */
                    let self = this;

                    queue(function(){

                        callback(self.search(_query, limit, null, true));
                        self = null;

                    }, 1, "search-" + this.id);
                }
                else{

                    callback(this.search(_query, limit, null, true));
                }

                return;
            }
            else if(SUPPORT_ASYNC && !_recall && this.async && (typeof importScripts !== "function")){

                /** @type {FlexSearch} */
                let self = this;

                return new Promise(function(resolve){

                    resolve(self.search(_query, limit, null, true));
                    self = null;
                });
            }

            if(PROFILER){

                profile_start("search");
            }

            if(!query || !is_string(query)){

                return result;
            }

            /** @type {!string|Array<string>} */
            (_query = query);

            if(SUPPORT_CACHE && this.cache){

                // invalidate cache

                if(!this._cache_status){

                    this._cache.clear();
                    this._cache_status = true;
                }

                // validate cache

                else {

                    const cache = this._cache.get(query);

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

            const tokenizer = this.tokenize;

            const words = (

                is_function(tokenizer) ?

                    tokenizer(_query)
                :(
                    SUPPORT_ENCODER && (tokenizer === "ngram") ?

                        /** @type {!Array<string>} */
                        (ngram(_query))
                    :
                        /** @type {string} */
                        (_query).split(regex_split)
                )
            );

            const length = words.length;
            let found = true;
            const check = [];
            const check_words = {};

            let ctx_root;
            let use_contextual;

            if(length > 1){

                if(this.depth){

                    use_contextual = true;
                    // TODO: iterate roots
                    ctx_root = words[0];
                    check_words[ctx_root] = 1;
                }
                else{

                    // Note: sort words by length only in non-contextual mode
                    words.sort(sort_by_length_down);
                }
            }

            let ctx_map;

            if(!use_contextual || (ctx_map = this._ctx)[ctx_root]){

                for(let a = (use_contextual ? 1 : 0); a < length; a++){

                    const value = words[a];

                    if(value && !check_words[value]){

                        let map;
                        let map_value;
                        let map_found = false;
                        const map_check = [];
                        let count = 0;

                        for(let z = 9; z >= threshold; z--){

                            map = (

                                use_contextual ?

                                    ctx_map[ctx_root]
                                :
                                    this._map
                            )[z];

                            if((map_value = map[value])){

                                map_check[count++] = map_value;
                                map_found = true;
                            }
                        }

                        if(map_found){

                            // Not handled by intersection:

                            check[check.length] = (

                                count > 1 ?

                                    // https://jsperf.com/merge-arrays-comparison
                                    check.concat.apply([], map_check)
                                :
                                    map_check[0]
                            );

                            // Handled by intersection:

                            //check[check.length] = map_check;
                        }
                        else {

                            if(!SUPPORT_SUGGESTIONS || !this.suggest){

                                found = false;
                                break;
                            }
                        }

                        check_words[value] = 1;
                    }

                    ctx_root = value;
                }
            }
            else{

                found = false;
            }

            if(found){

                // Not handled by intersection:

                result = intersect(check, limit, SUPPORT_SUGGESTIONS && this.suggest);

                // Handled by intersection:

                //result = intersect_3d(check, limit, this.suggest);
            }

            // store result to cache

            if(SUPPORT_CACHE && this.cache){

                this._cache.set(query, result);
            }

            if(PROFILER){

                profile_end("search");
            }

            return result;
        };

        if(DEBUG){

            /**
             * @export
             */

            FlexSearch.prototype.info = function(){

                if(SUPPORT_WORKER && this.worker){

                    for(let i = 0; i < this.worker; i++) this._worker[i].postMessage(i, {

                        "info": true,
                        "id": this.id
                    });

                    return;
                }

                let keys;
                let length;

                let bytes = 0,
                    words = 0,
                    chars = 0;

                for(let z = 0; z < 10; z++){

                    keys = get_keys(this._map[z]);

                    for(let i = 0; i < keys.length; i++){

                        length = this._map[z][keys[i]].length;

                        // Note: 1 char values allocates 1 byte "Map (OneByteInternalizedString)"
                        bytes += length * 1 + keys[i].length * 2 + 4;
                        words += length;
                        chars += keys[i].length * 2;
                    }
                }

                keys = get_keys(this._ids);

                const items = keys.length;

                for(let i = 0; i < items; i++){

                    bytes += keys[i].length * 2 + 2;
                }

                return {

                    "id": this.id,
                    "memory": bytes,
                    "items": items,
                    "sequences": words,
                    "chars": chars,
                    "cache": this.cache && this.cache.ids ? this.cache.ids.length : false,
                    "matcher": global_matcher.length + (this._matcher ? this._matcher.length : 0),
                    "worker": this.worker,
                    "threshold": this.threshold,
                    "depth": this.depth,
                    "contextual": !!this.depth
                };
            };
        }

        /**
         * @export
         */

        FlexSearch.prototype.clear = function(){

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

                this._cache.clear();
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
            this._stack_keys = null;

            return this;
        };

        /** @const */

        const global_encoder_balance = (function(){

            const regex_whitespace = regex("\\s\\s+"),
                  regex_strip = regex("[^a-z0-9 ]"),
                  regex_space = regex("[-\/]"),
                  regex_vowel = regex("[aeiouy]");

            /** @const {Array} */
            const regex_pairs = [

                regex_space, " ",
                regex_strip, "",
                regex_whitespace, " "
                //regex_vowel, ""
            ];

            return function(value){

                return collapse_repeating_chars(

                    replace(value.toLowerCase(), regex_pairs)
                );
            };
        })();

        /** @const */

        const global_encoder_icase = function(value){

            return value.toLowerCase();
        };

        /**
         * Phonetic Encoders
         * @dict {Function}
         * @private
         * @const
         */

        const global_encoder = SUPPORT_ENCODER ? {

            // case insensitive search

            "icase": global_encoder_icase,

            // literal normalization

            "simple": (function(){

                const regex_whitespace = regex("\\s\\s+"),
                      regex_strip = regex("[^a-z0-9 ]"),
                      regex_space = regex("[-\/]"),
                      regex_a = regex("[àáâãäå]"),
                      regex_e = regex("[èéêë]"),
                      regex_i = regex("[ìíîï]"),
                      regex_o = regex("[òóôõöő]"),
                      regex_u = regex("[ùúûüű]"),
                      regex_y = regex("[ýŷÿ]"),
                      regex_n = regex("ñ"),
                      regex_c = regex("ç"),
                      regex_s = regex("ß"),
                      regex_and = regex(" & ");

                /** @const {Array} */
                const regex_pairs = [

                    regex_a, "a",
                    regex_e, "e",
                    regex_i, "i",
                    regex_o, "o",
                    regex_u, "u",
                    regex_y, "y",
                    regex_n, "n",
                    regex_c, "c",
                    regex_s, "s",
                    regex_and, " and ",
                    regex_space, " ",
                    regex_strip, "",
                    regex_whitespace, " "
                ];

                return function(str){

                    str = replace(str.toLowerCase(), regex_pairs);

                    return (

                        str !== " " ? str : ""
                    );
                };
            }()),

            // literal transformation

            "advanced": (function(){

                const regex_space = regex(" "),
                      regex_ae = regex("ae"),
                      regex_ai = regex("ai"),
                      regex_ay = regex("ay"),
                      regex_ey = regex("ey"),
                      regex_oe = regex("oe"),
                      regex_ue = regex("ue"),
                      regex_ie = regex("ie"),
                      regex_sz = regex("sz"),
                      regex_zs = regex("zs"),
                      regex_ck = regex("ck"),
                      regex_cc = regex("cc"),
                      regex_sh = regex("sh"),
                      //regex_th = regex("th"),
                      regex_dt = regex("dt"),
                      regex_ph = regex("ph"),
                      regex_pf = regex("pf"),
                      regex_ou = regex("ou"),
                      regex_uo = regex("uo");

                /** @const {Array} */
                const regex_pairs = [

                      regex_ae, "a",
                      regex_ai, "ei",
                      regex_ay, "ei",
                      regex_ey, "ei",
                      regex_oe, "o",
                      regex_ue, "u",
                      regex_ie, "i",
                      regex_sz, "s",
                      regex_zs, "s",
                      regex_sh, "s",
                      regex_ck, "k",
                      regex_cc, "k",
                      //regex_th, "t",
                      regex_dt, "t",
                      regex_ph, "f",
                      regex_pf, "f",
                      regex_ou, "o",
                      regex_uo, "u"
                ];

                return /** @this {Object} */ function(string, _skip_post_processing){

                    if(!string){

                        return string;
                    }

                    // perform simple encoding
                    string = this["simple"](string);

                    // normalize special pairs
                    if(string.length > 2){

                        string = replace(string, regex_pairs)
                    }

                    if(!_skip_post_processing){

                        // remove white spaces
                        //string = string.replace(regex_space, "");

                        // delete all repeating chars
                        if(string.length > 1){

                            string = collapse_repeating_chars(string);
                        }
                    }

                    return string;
                };

            })(),

            // phonetic transformation

            "extra": (function(){

                const soundex_b = regex("p"),
                      //soundex_c = regex("[sz]"),
                      soundex_s = regex("z"),
                      soundex_k = regex("[cgq]"),
                      //soundex_i = regex("[jy]"),
                      soundex_m = regex("n"),
                      soundex_t = regex("d"),
                      soundex_f = regex("[vw]");

                /** @const {RegExp} */
                const regex_vowel = regex("[aeiouy]");

                /** @const {Array} */
                const regex_pairs = [

                    soundex_b, "b",
                    soundex_s, "s",
                    soundex_k, "k",
                    //soundex_i, "i",
                    soundex_m, "m",
                    soundex_t, "t",
                    soundex_f, "f",
                    regex_vowel, ""
                ];

                return /** @this {Object} */ function(str){

                    if(!str){

                        return str;
                    }

                    // perform advanced encoding
                    str = this["advanced"](str, /* skip post processing? */ true);

                    if(str.length > 1){

                        str = str.split(" ");

                        for(let i = 0; i < str.length; i++){

                            const current = str[i];

                            if(current.length > 1){

                                // remove all vowels after 2nd char
                                str[i] = current[0] + replace(current.substring(1), regex_pairs);
                            }
                        }

                        str = str.join(" ");
                        str = collapse_repeating_chars(str);
                    }

                    return str;
                };
            })(),

            "balance": global_encoder_balance

        } : {

            "icase": global_encoder_icase
            //"balance": global_encoder_balance
        };

        // Async Handler

        const queue = SUPPORT_ASYNC ? (function(){

            const stack = {};

            return function(fn, delay, id){

                const timer = stack[id];

                if(timer){

                    clearTimeout(timer);
                }

                return (

                    stack[id] = setTimeout(fn, delay)
                );
            };

        })() : null;

        // Flexi-Cache

        const Cache = SUPPORT_CACHE ? (function(){

            function Cache(limit){

                this.clear();

                /** @private */
                this.limit = (limit !== true) && limit;
            }

            Cache.prototype.clear = function(){

                /** @private */
                this.cache = {};
                /** @private */
                this.count = {};
                /** @private */
                this.index = {};
                /** @private */
                this.ids = [];
            };

            Cache.prototype.set = function(id, value){

                if(this.limit && is_undefined(this.cache[id])){

                    let length = this.ids.length;

                    if(length === this.limit){

                        length--;

                        const last_id = this.ids[length];

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
             */

            Cache.prototype.get = function(id){

                const cache = this.cache[id];

                if(this.limit && cache){

                    const count = ++this.count[id];
                    const index = this.index;
                    let current_index = index[id];

                    if(current_index > 0){

                        const ids = this.ids;
                        const old_index = current_index;

                        // forward pointer
                        while(this.count[ids[--current_index]] <= count){

                            if(current_index === -1){

                                break;
                            }
                        }

                        // move pointer back
                        current_index++;

                        if(current_index !== old_index){

                            // copy values from predecessors
                            for(let i = old_index; i > current_index; i--) {

                                const key = ids[i - 1];

                                ids[i] = key;
                                index[key] = i;
                            }

                            // push new value on top
                            ids[current_index] = id;
                            index[id] = current_index;
                        }
                    }
                }

                return cache;
            };

            return Cache;

        })() : null;

        if(PROFILER){

            if(typeof window !== "undefined") {

                /** @export */
                window.stats = profiles;
            }
        }

        function profile_start(key){

            (profile[key] || (profile[key] = {

                /** @export */ time: 0,
                /** @export */ count: 0,
                /** @export */ ops: 0,
                /** @export */ nano: 0

            })).ops = (typeof performance === "undefined" ? Date : performance).now();
        }

        function profile_end(key){

            const current = profile[key];

            current.time += (typeof performance === "undefined" ? Date : performance).now() - current.ops;
            current.count++;
            current.ops = 1000 / current.time * current.count;
            current.nano = current.time / current.count * 1000;
        }

        return FlexSearch;

        // ---------------------------------------------------------
        // Helpers

        function register_property(obj, key, fn){

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

            return new RegExp(str, "g");
        }

        /**
         * @param {!string} str
         * @param {RegExp|Array} regex
         * @returns {string}
         */

        function replace(str, regex/*, replacement*/){

            //if(is_undefined(replacement)){

                for(let i = 0; i < /** @type {Array} */ (regex).length; i += 2){

                    str = str.replace(regex[i], regex[i + 1]);
                }

                return str;
            // }
            // else{
            //
            //     return str.replace(/** @type {!RegExp} */ (regex), replacement || "");
            // }
        }

        /**
         * @param {Array} map
         * @param {Object} dupes
         * @param {string} tmp
         * @param {string|number} id
         * @param {number} partial_score
         * @param {number} context_score
         * @param {number} threshold
         */

        function add_index(map, dupes, tmp, id, partial_score, context_score, threshold){

            /*
            if(index_blacklist[tmp]){

                return 0;
            }
            */

            if(dupes[tmp]){

                return dupes[tmp];
            }
            else{

                const score = (

                    partial_score ?

                        ((9 - (threshold || 6)) * context_score) + ((threshold || 6) * partial_score)
                    :
                        context_score
                );

                dupes[tmp] = score;

                if(score >= threshold){

                    let arr = map[((score + 0.5) >> 0)];
                        arr = arr[tmp] || (arr[tmp] = []);

                    arr[arr.length] = id;
                }

                return score;
            }
        }

        /**
         * @param {Object} map
         * @param {string|number} id
         */

        function remove_index(map, id){

            if(map){

                const keys = get_keys(map);

                for(let i = 0, lengthKeys = keys.length; i < lengthKeys; i++){

                    const key = keys[i];
                    const tmp = map[key];

                    if(tmp){

                        for(let a = 0, lengthMap = tmp.length; a < lengthMap; a++){

                            if(tmp[a] === id){

                                if(lengthMap === 1){

                                    delete map[key];
                                }
                                else{

                                    tmp.splice(a, 1);
                                }

                                break;
                            }
                            else if(is_object(tmp[a])){

                                remove_index(tmp[a], id);
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

            const parts = [];

            if(!value){

                return parts;
            }

            let count_vowels = 0,
                count_literal = 0,
                count_parts = 0;

            let tmp = "";
            const length = value.length;

            for(let i = 0; i < length; i++){

                const char = value[i];
                const char_is_vowel = (

                    (char === "a") ||
                    (char === "e") ||
                    (char === "i") ||
                    (char === "o") ||
                    (char === "u") ||
                    (char === "y")
                );

                if(char_is_vowel){

                    count_vowels++;
                }
                else{

                    count_literal++;
                }

                if(char !== " ") {

                    tmp += char;
                }

                //console.log(tmp);

                // dynamic n-gram sequences

                if((char === " ") || (

                    (count_vowels >= (length > 8 ? 2 : 1)) &&
                    (count_literal >= 2)

                ) || (

                    (count_vowels >= 2) &&
                    (count_literal >= (length > 8 ? 2 : 1))

                ) || (i === length - 1)){

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

                        if(char === " "){

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

        function collapse_repeating_chars(string){

            let collapsed_string = "",
                char_prev = "",
                char_next = "";

            for(let i = 0; i < string.length; i++){

                const char = string[i];

                if(char !== char_prev){

                    if(i && (char === "h")){

                        const char_prev_is_vowel = (

                            (char_prev === "a") ||
                            (char_prev === "e") ||
                            (char_prev === "i") ||
                            (char_prev === "o") ||
                            (char_prev === "u") ||
                            (char_prev === "y")
                        );

                        const char_next_is_vowel = (

                            (char_next === "a") ||
                            (char_next === "e") ||
                            (char_next === "i") ||
                            (char_next === "o") ||
                            (char_next === "u") ||
                            (char_next === "y")
                        );

                        if((char_prev_is_vowel && char_next_is_vowel) || (char_prev === " ")){

                            collapsed_string += char;
                        }
                    }
                    else{

                        collapsed_string += char;
                    }
                }

                char_next = (

                    (i === (string.length - 1)) ?

                        ""
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

        function init_filter(words, encoder){

            const final = {};

            if(words){

                for(let i = 0; i < words.length; i++){

                    const word = encoder ? encoder(words[i]) : words[i];

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

        function init_stemmer(stemmer, encoder){

            const final = [];

            if(stemmer){

                for(const key in stemmer){

                    if(stemmer.hasOwnProperty(key)){

                        const tmp = encoder ? encoder(key) : key;

                        final.push(

                            regex("(?=.{" + (tmp.length + 3) + ",})" + tmp + "$"),

                            encoder ?

                                encoder(stemmer[key])
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

        function sort_by_length_down(a, b){

            const diff = a.length - b.length;

            return (

                diff < 0 ?

                    1
                :(
                    diff ?

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

        function sort_by_length_up(a, b){

            const diff = a.length - b.length;

            return (

                diff < 0 ?

                    -1
                :(
                    diff ?

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

            let result = [];
            let suggestions = [];
            const length_z = arrays.length;

            if(length_z > 1){

                // pre-sort arrays by length up

                arrays.sort(sort_by_length_up);

                // fill initial map

                const check = {};
                let arr = arrays[0];
                let length = arr.length;
                let i = 0;

                while(i < length) {

                    check[arr[i++]] = 1;
                }

                // loop through arrays

                let tmp, count = 0;
                let z = 0; // start from 1

                while(++z < length_z){

                    // get each array one by one

                    let found = false;
                    const is_final_loop = (z === (length_z - 1));

                    suggestions = [];
                    arr = arrays[z];
                    length = arr.length;
                    i = 0;

                    while(i < length){

                        tmp = arr[i++];

                        if(check[tmp]){

                            const check_val = check[tmp];

                            if(check_val === z){

                                // fill in during last round

                                if(is_final_loop){

                                    result[count++] = tmp;

                                    if(limit && (count === limit)){

                                        return result;
                                    }
                                }
                                else{

                                    check[tmp] = z + 1;
                                }

                                // apply count status

                                found = true;
                            }
                            else if(suggest){

                                const current_suggestion = (

                                    suggestions[check_val] || (

                                        suggestions[check_val] = []
                                    )
                                );

                                current_suggestion[current_suggestion.length] = tmp;
                            }
                        }
                    }

                    if(!found && !suggest){

                        break;
                    }
                }

                if(suggest){

                    count = result.length;
                    z = suggestions.length;

                    if(z && (!limit || (count < limit))){

                        while(z--){

                            tmp = suggestions[z];

                            if(tmp){

                                for(let i = 0, len = tmp.length; i < len; i++){

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
            else if(length_z){

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
         * @param {Array<Array<number|string>>|Array<number|string>} arrays
         * @param {number=} limit
         * @param {boolean=} suggest
         * @returns {Array}
         */

        /*
        function intersect_3d(arrays, limit, suggest) {

            let result = [];
            const length_z = arrays.length;
            const check = {};

            if(length_z > 1){

                // pre-sort arrays by length up

                arrays.sort(sort_by_length_up);

                const arr_tmp = arrays[0];

                for(let a = 0, len = arr_tmp.length; a < len; a++){

                    // fill initial map

                    const arr = arr_tmp[a];

                    for(let i = 0, length = arr.length; i < length; i++) {

                        check[arr[i]] = 1;
                    }
                }

                // loop through arrays

                let tmp, count = 0;
                let z = 1;

                while(z < length_z){

                    // get each array one by one

                    let found = false;

                    const arr_tmp = arrays[0];

                    for(let a = 0, len = arr_tmp.length; a < len; a++){

                        const arr = arr_tmp[a];

                        for(let i = 0, length = arr.length; i < length; i++){

                            if((check[tmp = arr[i]]) === z){

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
                    }

                    if(!found){

                        break;
                    }

                    z++;
                }
            }
            else if(length_z){

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

            const result = [];

            const length_a = a.length,
                length_b = b.length;

            if(length_a && length_b){

                const x = 0, y = 0, count = 0;

                const current_a = 0,
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
         * @param {*} val
         * @returns {boolean}
         */

        function is_string(val){

            return typeof val === "string";
        }

        /**
         * @param {*} val
         * @returns {boolean}
         */

        function is_array(val){

            return val.constructor === Array;
        }

        /**
         * @param {*} val
         * @returns {boolean}
         */

        function is_function(val){

            return typeof val === "function";
        }

        /**
         * @param {*} val
         * @returns {boolean}
         */

        function is_object(val){

            return typeof val === "object";
        }

        /**
         * @param {*} val
         * @returns {boolean}
         */

        function is_undefined(val){

            return typeof val === "undefined";
        }

        /**
         * @param {!Object} obj
         * @returns {Array<string>}
         */

        function get_keys(obj){

            return Object.keys(obj);
        }

        /**
         * @param {FlexSearch} ref
         */

        function runner(ref){

            const async = ref.async;
            let current;

            if(async){

                ref.async = false;
            }

            if(ref._stack_keys.length){

                const start = time();
                let key;

                // TODO: optimize shift() using a loop and splice()
                while((key = ref._stack_keys.shift()) || (key === 0)){

                    current = ref._stack[key];

                    switch(current[0]){

                        case enum_task.add:

                            ref.add(current[1], current[2]);
                            break;

                        // Note: Update is handled by .remove() + .add()
                        //
                        // case enum_task.update:
                        //
                        //     ref.update(current[1], current[2]);
                        //     break;

                        case enum_task.remove:

                            ref.remove(current[1]);
                            break;
                    }

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

                    ref._timer = 0;

                    runner(ref);

                }, 1, "search-async-" + ref.id)
            );
        }

        /**
         * @returns {number}
         */

        function time(){

            return Date.now();
        }

        /**
         * https://jsperf.com/comparison-object-index-type
         * @param {number} count
         * @returns {Object|Array<Object>}
         */

        function create_object_array(count){

            const array = new Array(count);

            for(let i = 0; i < count; i++){

                array[i] = {};
            }

            return array;
        }

        function addWorker(id, core, options, callback){

            const thread = register_worker(

                // name:
                "flexsearch",

                // id:
                "id" + id,

                // worker:
                function(){

                    let id;

                    /** @type {FlexSearch} */
                    let flexsearch;

                    /** @lends {Worker} */
                    self.onmessage = function(event){

                        const data = event["data"];

                        if(data){

                            if(data["search"]){

                                const results = flexsearch["search"](data["content"],

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
                                    "result": results
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
                            else if(data["clear"]){

                                flexsearch["clear"]();
                            }
                            else if(DEBUG && data["info"]){

                                const info = flexsearch["info"]();

                                info["worker"] = id;

                                console.log(info);

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

                    const data = event["data"];

                    if(data && data["result"]){

                        callback(data["id"], data["content"], data["result"], data["limit"]);
                    }
                },

                // cores:
                core
            );

            const fnStr = factory.toString();

            options["id"] = core;

            thread.postMessage(core, {

                "register": fnStr,
                "options": options,
                "id": core
            });

            return thread;
        }
    })(
        // Worker Handler

        SUPPORT_WORKER ? (function register_worker(){

            const worker_stack =  Object.create(null);
            const inline_supported = (typeof Blob !== "undefined") && (typeof URL !== "undefined") && URL.createObjectURL;

            return (

                /**
                 * @param {!string} _name
                 * @param {!number|string} _id
                 * @param {!Function} _worker
                 * @param {!Function} _callback
                 * @param {number=} _core
                 */

                function(_name, _id, _worker, _callback, _core){

                    let name = _name;
                    const worker_payload = (

                        inline_supported ?

                            // Load Inline Worker

                            URL.createObjectURL(

                                new Blob([

                                    (RELEASE ?

                                        ""
                                    :
                                        "const SUPPORT_WORKER = true;" +
                                        "const DEBUG = " + (DEBUG ? "true" : "false") + ";" +
                                        "const PROFILER = " + (PROFILER ? "true" : "false") + ";" +
                                        "const SUPPORT_ENCODER = " + (SUPPORT_ENCODER ? "true" : "false") + ";" +
                                        "const SUPPORT_CACHE = " + (SUPPORT_CACHE ? "true" : "false") + ";" +
                                        "const SUPPORT_ASYNC = " + (SUPPORT_ASYNC ? "true" : "false") + ";"

                                    ) + "(" + _worker.toString() + ")()"
                                ],{
                                    "type": "text/javascript"
                                })
                            )
                        :
                            // Load Extern Worker (but also requires CORS)

                            name + (RELEASE ? "." + RELEASE : "") + ".js"
                    );

                    name += "-" + _id;

                    worker_stack[name] || (worker_stack[name] = []);
                    worker_stack[name][_core] = new Worker(worker_payload);
                    worker_stack[name][_core]["onmessage"] = _callback;

                    if(DEBUG){

                        console.log("Register Worker: " + name + "@" + _core);
                    }

                    return {

                        "postMessage": function(id, data){

                            worker_stack[name][id]["postMessage"](data);
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

        let prop;

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
        else if(typeof exports === "object"){

            /** @export */
            module.exports = factory;
        }
        // Global (window)
        else{

            root[name] = factory;
        }
    }

}).call(this);
