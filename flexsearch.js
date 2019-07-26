/**!
 * @preserve FlexSearch v0.6.30
 * Copyright 2019 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Released under the Apache 2.0 Licence
 * https://github.com/nextapps-de/flexsearch
 */

/** @define {string}  */ const RELEASE = "";
/** @define {boolean} */ const DEBUG = true;
/** @define {boolean} */ const PROFILER = false;
/** @define {boolean} */ const SUPPORT_WORKER = true;
/** @define {boolean} */ const SUPPORT_ENCODER = true;
/** @define {boolean} */ const SUPPORT_CACHE = true;
/** @define {boolean} */ const SUPPORT_ASYNC = true;
/** @define {boolean} */ const SUPPORT_PRESET = true;
/** @define {boolean} */ const SUPPORT_SUGGESTION = true;
/** @define {boolean} */ const SUPPORT_SERIALIZE = true;
/** @define {boolean} */ const SUPPORT_INFO = true;
/** @define {boolean} */ const SUPPORT_DOCUMENT = true;
/** @define {boolean} */ const SUPPORT_WHERE = true;
/** @define {boolean} */ const SUPPORT_PAGINATION = true;
/** @define {boolean} */ const SUPPORT_OPERATOR = true;
/** @define {boolean} */ const SUPPORT_CALLBACK = true;

// noinspection ThisExpressionReferencesGlobalObjectJS
(function(){

    provide("FlexSearch", (function factory(register_worker){

        "use strict";

        /**
         * @const
         * @enum {boolean|string|number|RegExp}
         */

        const defaults = {

            encode: "icase",
            tokenize: "forward",
            split: /\W+/,
            // enrich: true,
            // clone: false,
            // suggest: false,
            cache: false,
            async: false,
            worker: false,
            rtl: false,
            doc: false,

            // maximum scoring
            resolution: 9,

            // minimum scoring
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
                threshold: 0,
                resolution: 1
            },

            "speed": {
                encode: "icase",
                tokenize: "strict",
                threshold: 1,
                resolution: 3,
                depth: 2
            },

            "match": {
                encode: SUPPORT_ENCODER ? "extra" : "icase",
                tokenize: "full",
                threshold: 1,
                resolution: 3
            },

            "score": {
                encode: SUPPORT_ENCODER ? "extra" : "icase",
                tokenize: "strict",
                threshold: 1,
                resolution: 9,
                depth: 4
            },

            "balance": {
                encode: SUPPORT_ENCODER ? "balance" : "icase",
                tokenize: "strict",
                threshold: 0,
                resolution: 3,
                depth: 3
            },

            "fast": {
                encode: "icase",
                tokenize: "strict",
                threshold: 8,
                resolution: 9,
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

        const filter = {};
        const stemmer = {};

        /**
         * NOTE: Actually not really required when using bare objects via: Object.create(null)
         * @const {Object<string|number, number>}
         */

        // const index_blacklist = (function(){
        //
        //     const array = Object.getOwnPropertyNames(/** @type {!Array} */ (({}).__proto__));
        //     const map = create_object();
        //
        //     for(let i = 0; i < array.length; i++){
        //
        //         map[array[i]] = 1;
        //     }
        //
        //     return map;
        // }());

        /**
         * @param {string|Object<string, number|string|boolean|Object|function(string):string>=} options
         * @param {Object<string, number|string|boolean>=} settings
         * @constructor
         */

        function FlexSearch(options, settings){

            if(PROFILER){

                profile = profiles[id_counter] || (profiles[id_counter] = {});

                /** @export */
                this.stats = profile;
            }

            const id = settings ? settings["id"] : options && options["id"];

            /** @export */
            this.id = id || (id === 0) ? id : id_counter++;
            this.init(options, settings);

            // define functional properties

            register_property(this, "index", /** @this {FlexSearch} */ function(){

                if(SUPPORT_DOCUMENT && this.doc){

                    return get_keys(this.doc.index[this.doc.keys[0]]._ids);
                }

                return get_keys(this._ids);
            });

            register_property(this, "length", /** @this {FlexSearch} */ function(){

                return this.index.length;
            });
        }

        /**
         * @param {Object<string, number|string|boolean|Object|function(string):string>=} options
         * @param {Object<string, number|string|boolean>=} settings
         * @export
         */

        FlexSearch.create = function(options, settings){

            return new FlexSearch(options, settings);
        };

        /**
         * @param {Object<string, string>} matcher
         * @export
         */

        FlexSearch.registerMatcher = function(matcher){

            for(const key in matcher){

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
         * @param {number|string} value
         * @returns {string}
         * @export
         */

        FlexSearch.encode = function(name, value){

            return global_encoder[name](value);
        };

        function worker_handler(id, query, result, limit, where, cursor, suggest){

            if(this._task_completed !== this.worker){

                this._task_result = this._task_result.concat(result);
                this._task_completed++;

                // TODO: sort results, return array of relevance [0...9] and apply in main thread

                if(limit && (this._task_result.length >= limit)){

                    this._task_completed = this.worker;
                }

                if(this._task_completed === this.worker){

                    // this._task_result = intersect(this._task_result, where ? 0 : limit, cursor, suggest);

                    if(this.cache){

                        this._cache.set(query, this._task_result);
                    }

                    if(this._current_callback){

                        this._current_callback(this._task_result);
                    }

                    //this._task_completed = 0;
                    //this._task_result = [];
                }
            }

            return this;
        }

        /*
        const tag_options = {

            "encode": false,
            "tokenize": function(doc){
                return [doc];
            }
        };
        */

        /**
         * @param {Object<string, number|string|boolean|Object|function(string):string>|string=} options
         * @param {Object<string, number|string|boolean>=} settings
         * @export
         */

        FlexSearch.prototype.init = function(options, settings){

            /** @type {Array} @private */
            this._matcher = [];

            let custom;

            if(settings){

                custom = /** @type {?string} */ (settings["preset"]);
                options = settings;
            }
            else{

                options || (options = defaults);
                custom = /** @type {?string} */ (options["preset"]);
            }

            let preset = {};

            if(SUPPORT_PRESET){

                if(is_string(options)){

                    preset = presets[options];

                    if(DEBUG && !preset){

                        console.warn("Preset not found: " + options);
                    }

                    options = {};
                }
                else if(custom){

                    preset = presets[custom];

                    if(DEBUG && !preset){

                        console.warn("Preset not found: " + custom);
                    }
                }
            }

            // initialize worker

            if(SUPPORT_WORKER && (custom = options["worker"])){

                if(typeof Worker === "undefined"){

                    options["worker"] = false;

                    /** @private */
                    this._worker = null;
                }
                else{

                    const threads = parseInt(custom, 10) || 4;

                    /** @private */
                    this._current_task = -1;
                    /** @private */
                    this._task_completed = 0;
                    /** @private */
                    this._task_result = [];
                    /** @private */
                    this._current_callback = null;
                    //this._ids_count = new Array(threads);
                    /** @private */
                    this._worker = new Array(threads);

                    for(let i = 0; i < threads; i++){

                        //this._ids_count[i] = 0;

                        this._worker[i] = addWorker(this.id, i, options /*|| defaults*/, worker_handler.bind(this));
                    }
                }
            }

            // apply custom options

            /** @private */
            this.tokenize = (

                options["tokenize"] ||
                preset.tokenize ||
                this.tokenize ||
                defaults.tokenize
            );

            /** @private */
            this.split = (

                is_undefined(custom = options["split"]) ?

                    this.split ||
                    defaults.split
                :(
                    is_string(custom) ?

                        regex(custom)
                    :
                        custom
                )
            );

            /** @private */
            this.rtl = (

                options["rtl"] ||
                this.rtl ||
                defaults.rtl
            );

            if(SUPPORT_ASYNC) /** @private */ this.async = (

                (typeof Promise === "undefined") || is_undefined(custom = options["async"]) ?

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

                    preset.threshold ||
                    this.threshold ||
                    defaults.threshold
                :
                    custom
            );

            /** @private */
            this.resolution = (

                is_undefined(custom = options["resolution"]) ?

                    custom = preset.resolution ||
                    this.resolution ||
                    defaults.resolution
                :
                    custom
            );

            if(custom <= this.threshold){

                this.resolution = this.threshold + 1;
            }

            /** @private */
            this.depth = (

                (this.tokenize !== "strict") || is_undefined(custom = options["depth"]) ?

                    preset.depth ||
                    this.depth ||
                    defaults.depth
                :
                    custom
            );

            // TODO: provide boost

            /** @private */
            /*
            this.boost = (

                (custom = options["boost"]) ? custom : 0
            );
            */

            custom = is_undefined(custom = options["encode"]) ?

                preset.encode ||
                defaults.encode
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

            const lang = options["lang"];

            if((custom = lang || options["filter"])) {

                if(is_string(custom)){

                    custom = filter[custom];
                }

                if(is_array(custom)){

                    custom = init_filter(custom, this.encoder);
                }

                /** @private */
                this.filter = custom;
            }

            if((custom = lang || options["stemmer"])) {

                /** @private */
                this.stemmer = init_stemmer(

                    is_string(custom) ? stemmer[custom] : custom,
                    this.encoder
                );
            }

            let doc;

            if(SUPPORT_DOCUMENT) {

                /** @private */
                this.doc = doc = (

                    (custom = options["doc"]) ?

                        clone_object(custom)
                    :
                        this.doc || defaults.doc
                );
            }

            // initialize primary index

            /** @private */
            this._map = create_object_array(this.resolution - (this.threshold || 0));
            /** @private */
            this._ctx = create_object();
            /** @private */
            this._ids = create_object();

            if(SUPPORT_DOCUMENT && doc){

                this._doc = create_object();

                options["doc"] = null;

                const index = doc.index = {};
                const keys = doc.keys = [];

                let field = doc["field"];
                let tag = doc["tag"];
                let store = doc["store"];

                if(!is_array(doc["id"])){

                    doc["id"] = doc["id"].split(":");
                }

                if(store){

                    let store_custom = create_object();

                    if(is_string(store)){

                        store_custom[store] = 1;
                    }
                    else if(is_array(store)){

                        for(let i = 0; i < store.length; i++){

                            store_custom[store[i]] = 1;
                        }
                    }
                    else if(is_object(store)){

                        store_custom = store;
                    }

                    doc["store"] = store_custom;
                }

                if(SUPPORT_WHERE && tag){

                    this._tag = create_object();

                    let field_custom = create_object();

                    if(field){

                        if(is_string(field)){

                            field_custom[field] = options;
                        }
                        else if(is_array(field)){

                            for(let i = 0; i < field.length; i++){

                                field_custom[field[i]] = options;
                            }
                        }
                        else if(is_object(field)){

                            field_custom = field;
                        }
                    }

                    if(!is_array(tag)){

                        doc["tag"] = tag = [tag];
                    }

                    for(let i = 0; i < tag.length; i++){

                        //TODO: delegate tag indexes to intersection
                        //field_custom[tag[i]] = tag_options;
                        this._tag[tag[i]] = create_object();
                    }

                    this._tags = tag;

                    field = field_custom;
                }

                if(field){

                    let has_custom;

                    if(!is_array(field)){

                        if(is_object(field)){

                            has_custom = field;
                            doc["field"] = field = get_keys(field);
                        }
                        else{

                            doc["field"] = field = [field];
                        }
                    }

                    for(let i = 0; i < field.length; i++){

                        const ref = field[i];

                        if(!is_array(ref)){

                            if(has_custom){

                                options = has_custom[ref];
                            }

                            keys[i] = ref;
                            field[i] = ref.split(":");
                        }

                        // TODO: move fields to main index to provide pagination

                        index[ref] = new FlexSearch(options);
                        //index[ref]._doc = this._doc;

                        // if(SUPPORT_WHERE && tag){
                        //
                        //     index[i]._tag = this._tag;
                        //     index[i]._tags = tag;
                        // }
                    }
                }

                options["doc"] = custom;
            }

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

            if(value){

                if(global_matcher.length){

                    value = replace(value, global_matcher);
                }

                if(this._matcher.length){

                    value = replace(value, this._matcher);
                }

                if(this.encoder){

                    value = this.encoder(value);
                }

                if(this.stemmer){

                    value = replace(value, this.stemmer);
                }
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

        function clone_object(obj){

            const clone = create_object();

            for(const key in obj){

                if(obj.hasOwnProperty(key)){

                    const value = obj[key];

                    if(is_array(value)){

                        clone[key] = value.slice(0);
                    }
                    else if(is_object(value)){

                        clone[key] = clone_object(value);
                    }
                    else{

                        clone[key] = value;
                    }
                }
            }

            return clone;
        }

        function filter_words(words, fn_or_map){

            const length = words.length;
            const has_function = is_function(fn_or_map);
            const filtered = [];

            for(let i = 0, count = 0; i < length; i++){

                const word = words[i];

                if((has_function && fn_or_map(word)) ||
                  (!has_function && !fn_or_map[word])){

                    filtered[count++] = word;
                }
            }

            return filtered;
        }

        /**
         * @param {number|string} id
         * @param {string|Function} content
         * @param {Function=} callback
         * @param {boolean=} _skip_update
         * @param {boolean=} _recall
         * @this {FlexSearch}
         * @export
         */

        FlexSearch.prototype.add = function(id, content, callback, _skip_update, _recall){

            if(SUPPORT_DOCUMENT && this.doc && is_object(id)){

                return this.handle_docs("add", id, /** @type {Function} */ (content));
            }

            if(content && is_string(content) && ((id /*&& !index_blacklist[id]*/) || (id === 0))){

                // TODO: do not mix ids as string "1" and as number 1

                const index = "@" + id;

                if(this._ids[index] && !_skip_update){

                    return this.update(id, content);
                }

                if(SUPPORT_WORKER && this.worker){

                    if(++this._current_task >= this._worker.length){

                        this._current_task = 0;
                    }

                    this._worker[this._current_task].postMessage({

                        "add": true,
                        "id": id,
                        "content": content
                    });

                    this._ids[index] = "" + this._current_task;

                    // TODO: provide worker auto-balancing instead of rotation
                    //this._ids_count[this._current_task]++;

                    if(callback){

                        callback();
                    }

                    return this;
                }

                if(!_recall){

                    if(SUPPORT_ASYNC && this.async && (!SUPPORT_WORKER || (typeof importScripts !== "function"))){

                        let self = this;

                        const promise = new Promise(function(resolve){

                            setTimeout(function(){

                                self.add(id, content, null, _skip_update, true);
                                self = null;
                                resolve();
                            });
                        });

                        if(callback){

                            promise.then(callback);
                        }
                        else{

                            return promise;
                        }

                        return this;
                    }

                    if(callback){

                        this.add(id, content, null, _skip_update, true);
                        callback();

                        return this;
                    }
                }

                if(PROFILER){

                    profile_start("add");
                }

                content = this.encode(/** @type {string} */ (content));

                if(!content.length){

                    return this;
                }

                const tokenizer = this.tokenize;

                let words = (

                    is_function(tokenizer) ?

                        tokenizer(content)
                    :(
                        //SUPPORT_ENCODER && (tokenizer === "ngram") ?

                            /** @type {!Array<string>} */
                            //(ngram(/** @type {!string} */(content)))
                        //:
                            /** @type {string} */
                            (content).split(this.split)
                    )
                );

                if(this.filter){

                    words = filter_words(words, this.filter);
                }

                const dupes = create_object();
                      dupes["_ctx"] = create_object();

                const word_length = words.length;
                const threshold = this.threshold;
                const depth = this.depth;
                const resolution = this.resolution;
                const map = this._map;
                const rtl = this.rtl;

                // tokenize

                for(let i = 0; i < word_length; i++){

                    /** @type {string} */
                    const value = words[i];

                    if(value){

                        const length = value.length;
                        const context_score = (rtl ? i + 1 : word_length - i) / word_length;

                        let token = "";

                        switch(tokenizer){

                            case "reverse":
                            case "both":

                                // NOTE: skip last round (this token exist already in "forward")

                                for(let a = length; --a;){

                                    token = value[a] + token;

                                    add_index(

                                        map,
                                        dupes,
                                        token,
                                        id,
                                        rtl ? 1 : (length - a) / length,
                                        context_score,
                                        threshold,
                                        resolution - 1
                                    );
                                }

                                token = "";

                            // Note: no break here, fallthrough to next case

                            case "forward":

                                for(let a = 0; a < length; a++){

                                    token += value[a];

                                    add_index(

                                        map,
                                        dupes,
                                        token,
                                        id,
                                        rtl ? (a + 1) / length : 1,
                                        context_score,
                                        threshold,
                                        resolution - 1
                                    );
                                }

                                break;

                            case "full":

                                for(let x = 0; x < length; x++){

                                    const partial_score = (rtl ? x + 1 : length - x) / length;

                                    for(let y = length; y > x; y--){

                                        token = value.substring(x, y);

                                        add_index(

                                            map,
                                            dupes,
                                            token,
                                            id,
                                            partial_score,
                                            context_score,
                                            threshold,
                                            resolution - 1
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
                                    threshold,
                                    resolution - 1
                                );

                                if(depth && (word_length > 1) && (score >= threshold)){

                                    const ctxDupes = dupes["_ctx"][value] || (dupes["_ctx"][value] = create_object());
                                    const ctxTmp = this._ctx[value] || (this._ctx[value] = create_object_array(resolution - (threshold || 0)));

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
                                            resolution - (x < i ? i - x : x - i),
                                            threshold,
                                            resolution - 1
                                        );
                                    }
                                }

                                break;
                        }
                    }
                }

                // update status

                this._ids[index] = 1;

                if(SUPPORT_CACHE){

                    this._cache_status = false;
                }

                if(PROFILER){

                    profile_end("add");
                }
            }

            return this;
        };

        if(SUPPORT_DOCUMENT){

            /**
             * @param {!string} job
             * @param doc
             * @param {Function=} callback
             * @returns {*}
             */

            FlexSearch.prototype.handle_docs = function(job, doc, callback){

                if(is_array(doc)){

                    let len = doc.length;

                    if(len--){

                        for(let i = 0; i < len; i++){

                            this.handle_docs(job, doc[i]);
                        }

                        return this.handle_docs(job, doc[len], callback);
                    }
                }
                else{

                    const index = this.doc.index;
                    const keys = this.doc.keys;
                    const tags = this.doc["tag"];
                    const store = this.doc["store"];

                    let tree;
                    let tag;

                    // ---------------------------------------------------------------

                    tree = this.doc["id"];

                    let id = doc;

                    for(let i = 0; i < tree.length; i++){

                        id = id[tree[i]];
                    }

                    // ---------------------------------------------------------------

                    if(job === "remove"){

                        delete this._doc[id];

                        let length = keys.length;

                        if(length--){

                            for(let z = 0; z < length; z++){

                                index[keys[z]].remove(id);
                            }

                            return index[keys[length]].remove(id, callback);
                        }
                    }

                    // ---------------------------------------------------------------

                    if(tags){

                        let tag_key;
                        let tag_value;

                        for(let i = 0; i < tags.length; i++){

                            tag_key = tags[i];
                            tag_value = doc;

                            const tag_split = tag_key.split(":");

                            for(let a = 0; a < tag_split.length; a++){

                                tag_value = tag_value[tag_split[a]];
                            }

                            tag_value = "@" + tag_value;
                        }

                        tag = this._tag[tag_key];
                        tag = tag[tag_value] || (tag[tag_value] = []);
                    }

                    // ---------------------------------------------------------------

                    tree = this.doc["field"];

                    for(let i = 0, len = tree.length; i < len; i++){

                        const branch = tree[i];
                        let content = doc;

                        for(let x = 0; x < branch.length; x++){

                            content = content[branch[x]];
                        }

                        const self = index[keys[i]];

                        let fn;

                        if(job === "add"){

                            fn = self.add;
                        }
                        else{

                            fn = self.update;
                        }

                        if(i === len - 1){

                            fn.call(self, id, content, callback);
                        }
                        else{

                            fn.call(self, id, content);
                        }
                    }

                    // ---------------------------------------------------------------

                    if(store){

                        const store_keys = get_keys(store);
                        let store_doc = create_object();

                        for(let i = 0; i < store_keys.length; i++){

                            let store_key = store_keys[i];

                            if(store[store_key]){

                                const store_split = store_key.split(":");

                                let store_value;
                                let store_doc_value;

                                for(let a = 0; a < store_split.length; a++){

                                    const store_split_key = store_split[a];

                                    store_value = (store_value || doc)[store_split_key];
                                    store_doc_value = (store_doc_value || store_doc)[store_split_key] = store_value;
                                }
                            }
                        }

                        doc = store_doc;
                    }

                    // ---------------------------------------------------------------

                    if(tag){

                        tag[tag.length] = doc; // tag[tag.length] = id;
                    }

                    this._doc[id] = doc;
                }

                return this;
            };
        }

        /**
         * @param {number|string} id
         * @param {string|Function} content
         * @param {Function=} callback
         * @export
         */

        FlexSearch.prototype.update = function(id, content, callback){

            if(SUPPORT_DOCUMENT && this.doc && is_object(id)){

                return this.handle_docs("update", id, /** @type {Function} */ (content));
            }

            const index = "@" + id;

            if(this._ids[index] && is_string(content)){

                if(PROFILER){

                    profile_start("update");
                }

                this.remove(id);
                this.add(id, content, callback, /* skip_update: */ true);

                if(PROFILER){

                    profile_end("update");
                }
            }

            return this;
        };

        /**
         * @param {number|string} id
         * @param {Function=} callback
         * @param {boolean=} _recall
         * @export
         */

        FlexSearch.prototype.remove = function(id, callback, _recall){

            if(SUPPORT_DOCUMENT && this.doc && is_object(id)){

                return this.handle_docs("remove", id, callback);
            }

            const index = "@" + id;

            if(this._ids[index]){

                if(SUPPORT_WORKER && this.worker){

                    const current_task = this._ids[index];

                    this._worker[current_task].postMessage({

                        "remove": true,
                        "id": id
                    });

                    //this._ids_count[current_task]--;

                    delete this._ids[index];

                    if(callback){

                        callback();
                    }

                    return this;
                }

                if(!_recall){

                    if(SUPPORT_ASYNC && this.async && (typeof importScripts !== "function")){

                        let self = this;

                        const promise = new Promise(function(resolve){

                            setTimeout(function(){

                                self.remove(id, null, true);
                                self = null;
                                resolve();
                            });
                        });

                        if(callback){

                            promise.then(callback);
                        }
                        else{

                            return promise;
                        }

                        return this;
                    }

                    if(callback){

                        this.remove(id, null, true);
                        callback();

                        return this;
                    }
                }

                if(PROFILER){

                    profile_start("remove");
                }

                for(let z = 0; z < (this.resolution - (this.threshold || 0)); z++){

                    remove_index(this._map[z], id);
                }

                if(this.depth){

                    remove_index(this._ctx, id);
                }

                delete this._ids[index];

                if(SUPPORT_CACHE){

                    this._cache_status = false;
                }

                if(PROFILER){

                    profile_end("remove");
                }
            }

            return this;
        };

        let field_to_sort;

        function enrich_documents(arr, docs){

            const length = arr.length;
            const result = new Array(length);

            for(let i = 0; i < length; i++){

                result[i] = docs[arr[i]];
            }

            return result;
        }

        function merge_and_sort(query, bool, result, sort, limit, suggest, where, cursor, has_and, has_not){

            result = intersect(

                result,
                where ? 0 : limit,
                SUPPORT_PAGINATION && cursor,
                SUPPORT_SUGGESTION && suggest,
                bool,
                has_and,
                has_not
            );

            let next;

            if(cursor){

                cursor = result.page;
                next = result.next;
                result = result.result;
            }

            if(where){

                result = this.where(where, null, limit, result);
            }
            else{

                result = enrich_documents(result, this._doc);
            }

            // TODO: pre-sort when indexing

            if(sort){

                if(!is_function(sort)){

                    field_to_sort = sort.split(":");

                    if(field_to_sort.length > 1){

                        sort = sort_by_deep_field_up;
                    }
                    else{

                        field_to_sort = field_to_sort[0];
                        sort = sort_by_field_up;
                    }
                }

                result.sort(sort);
            }

            result = create_page(cursor, next, result);

            if(SUPPORT_CACHE && this.cache){

                this._cache.set(query, result);
            }

            return result;
        }

        /**
         * TODO: move fields to main index to provide pagination
         *
         * @param {!string|Object|Array<Object>} query
         * @param {number|Function=} limit
         * @param {Function=} callback
         * @param {boolean=} _recall
         * @returns {FlexSearch|Array|Promise|undefined}
         * @export
         */

        FlexSearch.prototype.search = function(query, limit, callback, _recall){

            if(SUPPORT_DOCUMENT && is_object(limit)){

                if(is_array(limit)){

                    for(let i = 0; i < limit.length; i++){

                        limit[i]["query"] = query;
                    }
                }
                else{

                    limit["query"] = query;
                }

                query = /** @type {Object} */ (limit);
                limit = 1000;
            }
            else if(limit && is_function(limit)){

                callback = /** @type {?Function} */ (limit);
                limit = 1000;
            }
            else{

                limit || (limit === 0 ) || (limit = 1000);
            }

            if(SUPPORT_WORKER && this.worker){

                this._current_callback = callback;
                this._task_completed = 0;
                this._task_result = [];

                for(let i = 0; i < this.worker; i++){

                    this._worker[i].postMessage({

                        "search": true,
                        "limit": limit,
                        "content": query
                    });
                }

                return;
            }

            let result = [];
            let _query = query;
            let threshold;
            let cursor;
            let sort;
            let suggest;

            if(is_object(query) && (!SUPPORT_DOCUMENT || !is_array(query))){

                // re-assign properties

                if(SUPPORT_ASYNC){

                    if(!callback){

                        callback = query["callback"];

                        if(callback){

                            _query["callback"] = null;
                        }
                    }
                }

                sort = SUPPORT_DOCUMENT && query["sort"];
                cursor = SUPPORT_PAGINATION && query["page"];
                limit = query["limit"];
                threshold = query["threshold"];
                suggest = SUPPORT_SUGGESTION && query["suggest"];
                query = query["query"];
            }

            if(SUPPORT_DOCUMENT && this.doc){

                const doc_idx = this.doc.index;
                const where = SUPPORT_WHERE && _query["where"];
                const bool_main = (SUPPORT_OPERATOR && _query["bool"]) || "or";
                let field = _query["field"];
                let bool = bool_main;
                let queries;
                let has_not;
                let has_and;

                if(field){

                    if(!is_array(field)){

                        field = [field];
                    }
                }
                else if(is_array(_query)){

                    queries = _query;
                    field = [];
                    bool = [];

                    // TODO: make some unit tests and check if the fields should be sorted (not > and > or)?

                    for(let i = 0; i < _query.length; i++){

                        const current = _query[i];
                        const current_bool = (SUPPORT_OPERATOR && current["bool"]) || bool_main;

                        field[i] = current["field"];
                        bool[i] = current_bool;

                        if(current_bool === "not"){

                            has_not = true;
                        }
                        else if(current_bool === "and"){

                            has_and = true;
                        }
                    }
                }
                else{

                    field = this.doc.keys;
                }

                const len = field.length;

                for(let i = 0; i < len; i++){

                    if(queries){

                        _query = queries[i];
                    }

                    if(cursor && !is_string(_query)){

                        _query["page"] = null;
                        _query["limit"] = 0;
                    }

                    result[i] = doc_idx[field[i]].search(_query, 0);
                }

                if(callback){

                    return callback(

                        merge_and_sort.call(this,
                            query,
                            bool,
                            result,
                            sort,
                            limit,
                            suggest,
                            where,
                            cursor,
                            has_and,
                            has_not
                        )
                    );
                }
                else if(SUPPORT_ASYNC && this.async){

                    const self = this;

                    return new Promise(function(resolve){

                        Promise.all(/** @type {!Iterable<Promise>} */ (result)).then(function(values){

                            resolve(

                                merge_and_sort.call(self,
                                    query,
                                    bool,
                                    values,
                                    sort,
                                    limit,
                                    suggest,
                                    where,
                                    cursor,
                                    has_and,
                                    has_not
                                )
                            );
                        });
                    });
                }
                else{

                    return merge_and_sort.call(this,
                        query,
                        bool,
                        result,
                        sort,
                        limit,
                        suggest,
                        where,
                        cursor,
                        has_and,
                        has_not
                    );
                }
            }

            threshold || (threshold = this.threshold || 0);

            if(!_recall){

                if(SUPPORT_ASYNC && this.async && (typeof importScripts !== "function")){

                    let self = this;

                    const promise = new Promise(function(resolve){

                        setTimeout(function(){

                            resolve(self.search(_query, limit, null, true));
                            self = null;
                        });
                    });

                    if(callback){

                        promise.then(callback);
                    }
                    else{

                        return promise;
                    }

                    return this;
                }

                if(callback){

                    callback(this.search(_query, limit, null, true));

                    return this;
                }
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

                if(this._cache_status){

                    const cache = this._cache.get(query);

                    if(cache){

                        return cache;
                    }
                }

                // validate cache

                else {

                    this._cache.clear();
                    this._cache_status = true;
                }
            }

            // encode string

            _query = this.encode(/** @type {string} */ (_query));

            if(!_query.length){

                return result;
            }

            // convert words into single components

            const tokenizer = this.tokenize;

            let words = (

                is_function(tokenizer) ?

                    tokenizer(_query)
                :(
                    // TODO: ngram matches inconsistently, research or remove
                    //SUPPORT_ENCODER && (tokenizer === "ngram") ?

                        /** @type {!Array<string>} */
                        //(ngram(_query))
                    //:
                        /** @type {string} */
                        (_query).split(this.split)
                )
            );

            if(this.filter){

                words = filter_words(words, this.filter);
            }

            const length = words.length;
            let found = true;
            const check = [];
            const check_words = create_object();

            let ctx_root;
            let use_contextual;
            let a = 0;

            if(length > 1){

                if(this.depth && (this.tokenize === "strict")){

                    use_contextual = true;
                }
                else{

                    // Note: sort words by length only in non-contextual mode
                    words.sort(sort_by_length_down);
                }
            }

            /*
            if(SUPPORT_WHERE && where){

                const tags = this._tags;

                if(tags){

                    for(let i = 0; i < tags.length; i++){

                        const current_tag = tags[i];
                        const current_where = where[current_tag];

                        if(!is_undefined(current_where)){

                            check[check.length] = this._tag[current_tag]["@" + current_where];

                            delete where[current_tag];
                        }
                    }

                    if(get_keys(where).length === 0){

                        where = false;
                    }
                }
            }
            */

            let ctx_map;

            if(!use_contextual || (ctx_map = this._ctx)){

                const resolution = this.resolution;

                // TODO: boost on custom search is actually not possible, move to adding index instead
                // if(SUPPORT_DOCUMENT && boost){
                //
                //     threshold = (threshold || 1) / boost;
                // }

                for(; a < length; a++){

                    let value = words[a];

                    if(value){

                        if(use_contextual){

                            if(!ctx_root){

                                if(ctx_map[value]){

                                    ctx_root = value;
                                    check_words[value] = 1;
                                }
                                else if(!suggest){

                                    return result;
                                }
                            }

                            if(suggest && (a === length - 1) && !check.length){

                                // fall back to single-term-strategy

                                use_contextual = false;
                                value = ctx_root || value;
                                check_words[value] = 0;
                            }
                            else if(!ctx_root){

                                continue;
                            }
                        }

                        if(!check_words[value]){

                            const map_check = [];
                            let map_found = false;
                            let count = 0;

                            const map = use_contextual ?

                                ctx_map[ctx_root]
                            :
                                this._map;

                            if(map){

                                let map_value;

                                for(let z = 0; z < (resolution - threshold); z++){

                                    if((map_value = (map[z] && map[z][value]))){

                                        map_check[count++] = map_value;
                                        map_found = true;
                                    }
                                }
                            }

                            if(map_found){

                                ctx_root = value;

                                // not handled by intersection:

                                check[check.length] = (

                                    count > 1 ?

                                        map_check.concat.apply([], map_check)
                                    :
                                        map_check[0]
                                );

                                // handled by intersection:
                                // check[check.length] = map_check;
                            }
                            else if(!SUPPORT_SUGGESTION || !suggest){

                                found = false;
                                break;
                            }

                            check_words[value] = 1;
                        }
                    }
                }
            }
            else{

                found = false;
            }

            if(found){

                // Not handled by intersection:
                result = /** @type {Array} */ (intersect(check, limit, cursor, SUPPORT_SUGGESTION && suggest));

                // Handled by intersection:
                //result = intersect_3d(check, limit, suggest);
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

        if(SUPPORT_DOCUMENT && SUPPORT_WHERE){

            /**
             * @export
             */

            FlexSearch.prototype.find = function(key, value){

                return this.where(key, value, 1)[0] || null;
            };

            /**
             * @param key
             * @param value
             * @param limit
             * @param {Array<Object>=} result
             * @returns {Array<Object>}
             * @export
             */

            FlexSearch.prototype.where = function(key, value, limit, result){

                const doc = this._doc;
                const results = [];

                let count = 0;
                let keys;
                let keys_len;
                let has_value;
                let tree;
                let tag_results;

                if(is_object(key)){

                    limit || (limit = value);
                    keys = get_keys(key);
                    keys_len = keys.length;
                    has_value = false;

                    if((keys_len === 1) && (keys[0] === "id")){

                        return [doc[key["id"]]];
                    }

                    const tags = this._tags;

                    if(tags && !result){

                        for(let i = 0; i < tags.length; i++){

                            const current_tag = tags[i];
                            const current_where = key[current_tag];

                            if(!is_undefined(current_where)){

                                tag_results = this._tag[current_tag]["@" + current_where];
                                //result = result.slice(0, limit && (limit < result.length) ? limit : result.length);

                                if(--keys_len === 0){

                                    return tag_results;
                                }

                                keys.splice(keys.indexOf(current_tag), 1);

                                // TODO: delete from original reference?
                                delete key[current_tag];
                                break;
                            }
                        }
                    }

                    tree = new Array(keys_len);

                    for(let i = 0; i < keys_len; i++){

                        tree[i] = keys[i].split(":");
                    }
                }
                else if(is_function(key)){

                    const ids = result || get_keys(doc);
                    const length = ids.length;

                    for(let x = 0; x < length; x++){

                        const obj = doc[ids[x]];

                        if(key(obj)){

                            results[count++] = obj;
                        }
                    }

                    return results;
                }
                else{

                    if(is_undefined(value)){

                        return [doc[key]];
                    }

                    if(key === "id"){

                        return [doc[value]];
                    }

                    keys = [key];
                    keys_len = 1;
                    tree = [key.split(":")];
                    has_value = true;
                }

                const ids = tag_results || result || get_keys(doc); // this._ids;
                const length = ids.length;

                for(let x = 0; x < length; x++){

                    const obj = tag_results ? ids[x] : doc[ids[x]];
                    let found = true;

                    for(let i = 0; i < keys_len; i++){

                        has_value || (value = key[keys[i]]);

                        const tree_cur = tree[i];
                        const tree_len = tree_cur.length;

                        let ref = obj;

                        if(tree_len > 1){

                            for(let z = 0; z < tree_len; z++){

                                ref = ref[tree_cur[z]];
                            }
                        }
                        else{

                            ref = ref[tree_cur[0]];
                        }

                        if(ref !== value){

                            found = false;
                            break;
                        }
                    }

                    if(found){

                        results[count++] = obj;

                        if(limit && (count === limit)){

                            break;
                        }
                    }
                }

                return results;
            };
        }

        if(SUPPORT_INFO){

            /**
             * @export
             */

            FlexSearch.prototype.info = function(){

                if(SUPPORT_WORKER && this.worker){

                    for(let i = 0; i < this.worker; i++) this._worker[i].postMessage({

                        "info": true,
                        "id": this.id
                    });

                    return;
                }

                // TODO: improve info
                /*
                let keys;
                let length;

                let bytes = 0,
                    words = 0,
                    chars = 0;

                for(let z = 0; z < (this.resolution - (this.threshold || 0)); z++){

                    keys = get_keys(this._map[z]);

                    for(let i = 0; i < keys.length; i++){

                        length = this._map[z][keys[i]].length;

                        // TODO: Proof if 1 char values allocates 1 byte "Map (OneByteInternalizedString)"
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
                */

                return {

                    "id": this.id,
                    //"memory": bytes,
                    "items": this["length"], //items,
                    //"sequences": words,
                    //"chars": chars,
                    "cache": this.cache && this.cache.ids ? this.cache.ids.length : false,
                    "matcher": global_matcher.length + (this._matcher ? this._matcher.length : 0),
                    "worker": this.worker,
                    "threshold": this.threshold,
                    "depth": this.depth,
                    "resolution": this.resolution,
                    "contextual": this.depth && (this.tokenize === "strict")
                };
            };
        }

        /**
         * @export
         */

        FlexSearch.prototype.clear = function(){

            return this.destroy().init();
        };

        /**
         * @export
         */

        FlexSearch.prototype.destroy = function(){

            if(SUPPORT_CACHE && this.cache){

                this._cache.clear();
                this._cache = null;
            }

            this._map =
            this._ctx =
            this._ids = null;

            if(SUPPORT_DOCUMENT && this.doc){

                const keys = this.doc.keys;

                for(let i = 0; i < keys.length; i++){

                    this.doc.index[keys[i]].destroy();
                }

                this.doc =
                this._doc = null;
            }

            return this;
        };

        if(SUPPORT_SERIALIZE){

            /**
             * TODO: also export settings?
             * @param {Object<string, boolean>=} config
             * @export
             */

            FlexSearch.prototype.export = function(config){

                const serialize = !config || is_undefined(config["serialize"]) || config["serialize"];

                let payload;

                if(SUPPORT_DOCUMENT && this.doc){

                    const export_doc = !config || is_undefined(config["doc"]) || config["doc"];
                    const export_index = !config || is_undefined(config["index"]) || config["index"];

                    payload = [];

                    let i = 0;

                    if(export_index){

                        const keys = this.doc.keys;

                        for(; i < keys.length; i++){

                            const idx = this.doc.index[keys[i]];

                            payload[i] = [

                                idx._map, idx._ctx, get_keys(idx._ids)
                            ];
                        }
                    }

                    if(export_doc){

                        payload[i] = this._doc;
                    }
                }
                else{

                    payload = [

                        this._map,
                        this._ctx,
                        get_keys(this._ids)
                    ];
                }

                if(serialize){

                    payload = JSON.stringify(payload);
                }

                return payload;
            };

            /**
             * @export
             */

            FlexSearch.prototype.import = function(payload, config){

                const serialize = !config || is_undefined(config["serialize"]) || config["serialize"];

                if(serialize){

                    payload = JSON.parse(payload);
                }

                const ids = create_object();

                if(SUPPORT_DOCUMENT && this.doc){

                    const import_doc = !config || is_undefined(config["doc"]) || config["doc"];
                    const import_index = !config || is_undefined(config["index"]) || config["index"];

                    let i = 0;

                    if(import_index){

                        const keys = this.doc.keys;
                        const length = keys.length;
                        const current = payload[0][2];

                        for(; i < current.length; i++){

                            ids[current[i]] = 1;
                        }

                        for(i = 0; i < length; i++){

                            const idx = this.doc.index[keys[i]];
                            const item = payload[i];

                            if(item){

                                idx._map = item[0];
                                idx._ctx = item[1];
                                idx._ids = ids;
                                // idx._doc = payload[length];
                            }
                        }
                    }

                    if(import_doc){

                        this._doc = is_object(import_doc) ? import_doc : payload[i];
                    }
                }
                else{

                    const current = payload[2];

                    for(let i = 0; i < current.length; i++){

                        ids[current[i]] = 1;
                    }

                    this._map = payload[0];
                    this._ctx = payload[1];
                    this._ids = ids;
                }
            };
        }

        /** @const */

        const global_encoder_balance = (function(){

            const regex_whitespace = regex("\\s+"),
                  regex_strip = regex("[^a-z0-9 ]"),
                  regex_space = regex("[-/]");
                  //regex_vowel = regex("[aeiouy]");

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
        }());

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

                const regex_whitespace = regex("\\s+"),
                      regex_strip = regex("[^a-z0-9 ]"),
                      regex_space = regex("[-/]"),
                      regex_a = regex("[àáâãäå]"),
                      regex_e = regex("[èéêë]"),
                      regex_i = regex("[ìíîï]"),
                      regex_o = regex("[òóôõöő]"),
                      regex_u = regex("[ùúûüű]"),
                      regex_y = regex("[ýŷÿ]"),
                      regex_n = regex("ñ"),
                      regex_c = regex("[çc]"),
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
                    regex_c, "k",
                    regex_s, "s",
                    regex_and, " and ",
                    regex_space, " ",
                    regex_strip, "",
                    regex_whitespace, " "
                ];

                return function(str){

                    str = replace(str.toLowerCase(), regex_pairs);

                    return (

                        str === " " ? "" : str
                    );
                };
            }()),

            // literal transformation

            "advanced": (function(){

                const //regex_space = regex(" "),
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
                      regex_th = regex("th"),
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
                      regex_th, "t",
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

                        string = replace(string, regex_pairs);
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

            }()),

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
            }()),

            "balance": global_encoder_balance

        } : {

            "icase": global_encoder_icase
        };

        const Cache = SUPPORT_CACHE ? (function(){

            function CacheClass(limit){

                this.clear();

                /** @private */
                this.limit = (limit !== true) && limit;
            }

            CacheClass.prototype.clear = function(){

                /** @private */
                this.cache = create_object();
                /** @private */
                this.count = create_object();
                /** @private */
                this.index = create_object();
                /** @private */
                this.ids = [];
            };

            CacheClass.prototype.set = function(key, value){

                if(this.limit && is_undefined(this.cache[key])){

                    let length = this.ids.length;

                    if(length === this.limit){

                        length--;

                        const last_id = this.ids[length];

                        delete this.cache[last_id];
                        delete this.count[last_id];
                        delete this.index[last_id];
                    }

                    this.index[key] = length;
                    this.ids[length] = key;
                    this.count[key] = -1;
                    this.cache[key] = value;

                    // TODO: remove extra call
                    // shift up counter +1

                    this.get(key);
                }
                else{

                    this.cache[key] = value;
                }
            };

            /**
             * Note: It is better to have the complexity when fetching the cache:
             */

            CacheClass.prototype.get = function(key){

                const cache = this.cache[key];

                if(this.limit && cache){

                    const count = ++this.count[key];
                    const index = this.index;
                    let current_index = index[key];

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

                                const tmp = ids[i - 1];

                                ids[i] = tmp;
                                index[tmp] = i;
                            }

                            // push new value on top
                            ids[current_index] = key;
                            index[key] = current_index;
                        }
                    }
                }

                return cache;
            };

            return CacheClass;

        }()) : null;

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
         * @param {RegExp|Array} regexp
         * @returns {string}
         */

        function replace(str, regexp/*, replacement*/){

            //if(is_undefined(replacement)){

                for(let i = 0; i < /** @type {Array} */ (regexp).length; i += 2){

                    str = str.replace(regexp[i], regexp[i + 1]);
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
         * @param {string} value
         * @param {string|number} id
         * @param {number} partial_score
         * @param {number} context_score
         * @param {number} threshold
         * @param {number} resolution
         */

        function add_index(map, dupes, value, id, partial_score, context_score, threshold, resolution){

            /*
            if(index_blacklist[value]){

                return 0;
            }
            */

            if(dupes[value]){

                return dupes[value];
            }

            const score = (

                partial_score ?

                    (resolution - (threshold || (resolution / 1.5))) * context_score + (threshold || (resolution / 1.5)) * partial_score
                    //(9 - (threshold || 4.5)) * context_score + (threshold || 4.5) * partial_score
                    //4.5 * (context_score + partial_score)
                :
                    context_score
            );

            dupes[value] = score;

            if(score >= threshold){

                let arr = map[resolution - ((score + 0.5) >> 0)];
                    arr = arr[value] || (arr[value] = []);

                arr[arr.length] = id;
            }

            return score;
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

            const final = create_object();

            for(let i = 0; i < words.length; i++){

                const word = encoder ? encoder(words[i]) : words[i];

                final[word] = 1; // String.fromCharCode((65000 - words.length) + i); // mask filtered words?
            }

            return final;
        }

        /**
         * @param {Object<string, string>} stem
         * @param encoder
         * @returns {Array}
         */

        function init_stemmer(stem, encoder){

            const final = [];

            for(const key in stem){

                if(stem.hasOwnProperty(key)){

                    const tmp = encoder ? encoder(key) : key;

                    final.push(

                        //regex("(?=.{" + tmp.length + ",})" + tmp + "$"),
                        regex(tmp + "($|\\W)"),

                        encoder ?

                            encoder(stem[key])
                        :
                            stem[key]
                    );
                }
            }

            return final;
        }

        /**
         * @param {Array<number|string>} a
         * @param {Array<number|string>} b
         * @returns {number}
         */

        /*
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
        */

        /**
         * @param {Array<number|string>} a
         * @param {Array<number|string>} b
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

        function sort_by_field_up(a, b){

            a = a[field_to_sort];
            b = b[field_to_sort];

            return (

                a < b ?

                    -1
                :(
                    a > b ?

                        1
                    :
                        0
                )
            );
        }

        function sort_by_deep_field_up(a, b){

            const field_len = field_to_sort.length;

            for(let i = 0; i < field_len; i++){

                a = a[field_to_sort[i]];
                b = b[field_to_sort[i]];
            }

            return (

                a < b ?

                    -1
                :(
                    a > b ?

                        1
                    :
                        0
                )
            );
        }

        function create_page(cursor, page, result){

            return cursor ? {

                "page": cursor,
                "next": page ? "" + page : null,
                "result": result

            } : result;
        }

        /**
         * This is the main hot spot.
         * Any possible performance improvements should be applied here.
         * TODO: Do not return the original array as reference!
         * TODO: Make use of performance benefits of a cursor when no "and" operator was used
         *
         * @param {!Array<Array<number|string>>} arrays*
         * @param {number=} limit
         * @param {string|boolean=} cursor
         * @param {boolean=} suggest
         * @param {Array<string>=} bool
         * @param {boolean=} has_and
         * @param {boolean=} has_not
         * @returns {Array|Object}
         */

        function intersect(arrays, limit, cursor, suggest, bool, has_and, has_not) {

            let page;
            let result = [];
            let pointer;

            if(cursor === true){

                cursor = "0";
                pointer = "";
            }
            else{

                pointer = cursor && cursor.split(":");
            }

            const length_z = arrays.length;

            // use complex handler when length > 1

            if(length_z > 1){

                // TODO: test strategy
                // pre-sort arrays
                //arrays.sort(sort_by_length_down);

                const check = create_object();
                const suggestions = [];

                let check_not;
                let arr;
                let z = 0;
                let i = 0;
                let length;
                let tmp;
                let init = true;
                let first_result;
                let count = 0;
                let bool_main;
                let last_index;

                let pointer_suggest;
                let pointer_count;

                if(pointer){

                    if(pointer.length === 2){

                        pointer_suggest = pointer;
                        pointer = false;
                    }
                    else{

                        pointer = pointer_count = parseInt(pointer[0], 10);
                    }
                }

                if(SUPPORT_DOCUMENT && SUPPORT_OPERATOR){

                    // there are two possible strategies: 1. pre-fill (actually), 2. filter during last round
                    // TODO: compare both strategies

                    if(has_not){

                        check_not = create_object();

                        for(; z < length_z; z++){

                            if(bool[z] === "not"){

                                arr = arrays[z];
                                length = arr.length;

                                for(i = 0; i < length; i++){

                                    check_not["@" + arr[i]] = 1;
                                }
                            }
                            else{

                                // this additional loop provides a proofed last result
                                // TODO: could be handled before intersection, or use sorted fields

                                last_index = z + 1;
                            }
                        }

                        // there was no field with "and" / "or"
                        // TODO: this could also checked before intersection

                        if(is_undefined(last_index)){

                            return create_page(cursor, page, result);
                        }

                        z = 0;
                    }
                    else{

                        bool_main = is_string(bool) && bool;
                    }
                }

                let bool_and;
                let bool_or;

                // loop through arrays

                for(; z < length_z; z++){

                    const is_final_loop = (

                        z === (last_index || length_z) - 1
                    );

                    if(SUPPORT_DOCUMENT && SUPPORT_OPERATOR){

                        if(!bool_main || !z){

                            const bool_current = bool_main || (bool && bool[z]);

                            if(!bool_current || (bool_current === "and")){

                                bool_and = has_and = true;
                                bool_or = false;
                            }
                            else if(bool_current === "or"){

                                bool_or = true;
                                bool_and = false;
                            }
                            else{

                                // already done, go next

                                continue;
                            }
                        }
                    }
                    else{

                        bool_and = has_and = true;
                    }

                    arr = arrays[z];
                    length = arr.length;

                    if(!length){

                        // return empty on specific conditions

                        if(bool_and && !suggest){

                            return create_page(cursor, page, arr);
                        }

                        continue;
                    }

                    if(init){

                        // pre-fill first just right before an additional result

                        if(first_result){

                            const result_length = first_result.length;

                            // fill initial map

                            for(i = 0; i < result_length; i++){

                                const id = first_result[i];
                                const index = "@" + id;

                                // there is no and, add items

                                if(!has_not || !check_not[index]){

                                    check[index] = 1;

                                    if(!has_and){

                                        result[count++] = id;
                                    }
                                }
                            }

                            first_result = null;
                            init = false;
                        }
                        else{

                            // hold first result and wait for additional result

                            first_result = arr;

                            continue;
                        }
                    }

                    let found = false;

                    for(i = 0; i < length; i++){

                        tmp = arr[i];

                        const index = "@" + tmp;
                        const check_val = has_and ? check[index] || 0 : z;

                        if(check_val || suggest){

                            if(has_not && check_not[index]){

                                continue;
                            }

                            if(!has_and && check[index]){

                                continue;
                            }

                            if(check_val === z){

                                // fill in during last round

                                if(is_final_loop){

                                    // sadly the pointer could just applied here at the earliest
                                    // that's why pagination cannot reduce complexity actually
                                    // should only happened when at least one bool "and" was set
                                    // TODO: check bool and provide complexity reduction

                                    if(!pointer_count || (--pointer_count < count)){

                                        result[count++] = tmp;

                                        if(limit && (count === limit)){

                                            return create_page(cursor, count + (pointer || 0), result);
                                        }
                                    }
                                }
                                else{

                                    check[index] = z + 1;
                                }

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

                    // nothing found, break the main loop

                    if(bool_and && !found && !suggest){

                        break;
                    }
                }

                // a first result was hold

                if(first_result){

                    const result_length = first_result.length;

                    if(has_not){

                        if(pointer){

                            i = parseInt(pointer, 10);
                        }
                        else{

                            i = 0;
                        }

                        for(; i < result_length; i++){

                            const id = first_result[i];

                            if(!check_not["@" + id]){

                                result[count++] = id;

                                // TODO: is actually not covered
                                // if(limit && (count === limit)){
                                //
                                //     return create_page(cursor, (i + 1), result);
                                // }
                            }
                        }
                    }
                    else{

                        result = first_result;
                    }
                }

                if(suggest){

                    count = result.length;

                    if(pointer_suggest){

                        z = parseInt(pointer_suggest[0], 10) + 1;
                        i = parseInt(pointer_suggest[1], 10) + 1;
                    }
                    else{

                        z = suggestions.length;
                        i = 0;
                    }

                    for(; z--;){

                        tmp = suggestions[z];

                        if(tmp){

                            for(length = tmp.length; i < length; i++){

                                const id = tmp[i];

                                if(!has_not || !check_not["@" + id]){

                                    result[count++] = id;

                                    if(limit && (count === limit)){

                                        return create_page(cursor, z + ":" + i, result);
                                    }
                                }
                            }

                            i = 0;
                        }
                    }
                }
            }
            else if(length_z){

                if(!bool || (SUPPORT_OPERATOR && (bool[0] !== "not"))){

                    result = arrays[0];

                    if(pointer){

                        pointer = parseInt(pointer[0], 10);
                    }

                    // TODO: handle references to the original index array
                    // return result.slice(0);
                }
            }

            if(limit){

                const length = result.length;

                if(pointer && (pointer > length)){

                    pointer = 0;
                }

                const start = /** @type number */ (pointer) || 0;
                      page = start + limit;

                if(page < length){

                    result = result.slice(start, page);
                }
                else {

                    page = 0;

                    if(start){

                        result = result.slice(start);
                    }
                }
            }

            return create_page(cursor, page, result);
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
         * https://jsperf.com/comparison-object-index-type
         * @param {number} count
         * @returns {Object|Array<Object>}
         */

        function create_object_array(count){

            const array = new Array(count);

            for(let i = 0; i < count; i++){

                array[i] = create_object();
            }

            return array;
        }

        function create_object(){

            return Object.create(null);
        }

        function worker_module(){

            let id;

            /** @type {FlexSearch} */
            let FlexSearchWorker;

            /** @lends {Worker} */
            self.onmessage = function(event){

                const data = event["data"];

                if(data){

                    if(data["search"]){

                        const results = FlexSearchWorker["search"](data["content"],

                            data["threshold"] ?

                                {
                                    "limit": data["limit"],
                                    "threshold": data["threshold"],
                                    "where": data["where"]
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

                        FlexSearchWorker["add"](data["id"], data["content"]);
                    }
                    else if(data["update"]){

                        FlexSearchWorker["update"](data["id"], data["content"]);
                    }
                    else if(data["remove"]){

                        FlexSearchWorker["remove"](data["id"]);
                    }
                    else if(data["clear"]){

                        FlexSearchWorker["clear"]();
                    }
                    else if(SUPPORT_INFO && data["info"]){

                        const info = FlexSearchWorker["info"]();

                        info["worker"] = id;

                        console.log(info);

                        /** @lends {Worker} */
                        //self.postMessage(info);
                    }
                    else if(data["register"]){

                        id = data["id"];

                        data["options"]["cache"] = false;
                        data["options"]["async"] = false;
                        data["options"]["worker"] = false;

                        FlexSearchWorker = new Function(

                            data["register"].substring(

                                data["register"].indexOf("{") + 1,
                                data["register"].lastIndexOf("}")
                            )
                        )();

                        FlexSearchWorker = new FlexSearchWorker(data["options"]);
                    }
                }
            };
        }

        function addWorker(id, core, options, callback){

            const thread = register_worker(

                // name:
                "flexsearch",

                // id:
                "id" + id,

                // worker:
                worker_module,

                // callback:
                function(event){

                    const data = event["data"];

                    if(data && data["result"]){

                        callback(

                            data["id"],
                            data["content"],
                            data["result"],
                            data["limit"],
                            data["where"],
                            data["cursor"],
                            data["suggest"]
                        );
                    }
                },

                // cores:
                core
            );

            const fnStr = factory.toString();

            options["id"] = core;

            thread.postMessage({

                "register": fnStr,
                "options": options,
                "id": core
            });

            return thread;
        }
    }(
        // Worker Handler

        SUPPORT_WORKER ? (function register_worker(){

            const worker_stack = {};
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
                                        "var RELEASE = '" + RELEASE + "';" +
                                        "var DEBUG = " + (DEBUG ? "true" : "false") + ";" +
                                        "var PROFILER = " + (PROFILER ? "true" : "false") + ";" +
                                        "var SUPPORT_PRESET = " + (SUPPORT_PRESET ? "true" : "false") + ";" +
                                        "var SUPPORT_SUGGESTION = " + (SUPPORT_SUGGESTION ? "true" : "false") + ";" +
                                        "var SUPPORT_ENCODER = " + (SUPPORT_ENCODER ? "true" : "false") + ";" +
                                        "var SUPPORT_CACHE = " + (SUPPORT_CACHE ? "true" : "false") + ";" +
                                        "var SUPPORT_ASYNC = " + (SUPPORT_ASYNC ? "true" : "false") + ";" +
                                        "var SUPPORT_SERIALIZE = " + (SUPPORT_SERIALIZE ? "true" : "false") + ";" +
                                        "var SUPPORT_INFO = " + (SUPPORT_INFO ? "true" : "false") + ";" +
                                        "var SUPPORT_DOCUMENT = " + (SUPPORT_DOCUMENT ? "true" : "false") + ";" +
                                        "var SUPPORT_WHERE = " + (SUPPORT_WHERE ? "true" : "false") + ";" +
                                        "var SUPPORT_PAGINATION = " + (SUPPORT_PAGINATION ? "true" : "false") + ";" +
                                        "var SUPPORT_OPERATOR = " + (SUPPORT_OPERATOR ? "true" : "false") + ";" +
                                        "var SUPPORT_CALLBACK = " + (SUPPORT_CALLBACK ? "true" : "false") + ";" +
                                        "var SUPPORT_WORKER = true;"

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

                    return worker_stack[name][_core];
                }
            );
        }()) : false

    )), this);

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
