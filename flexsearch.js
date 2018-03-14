/**!
 * FlexSearch - Superfast lightweight full text search engine
 * ----------------------------------------------------------
 * @author: Thomas Wilkerling
 * @preserve https://github.com/nextapps-de/flexsearch
 * @version: 0.1.27
 * @license: Apache 2.0 Licence
 */

;(function(){

    provide('FlexSearch', (function factory(register_worker){

        "use strict";

        /**
         * @struct
         * @private
         * @const
         * @final
         */

        var defaults = {

            // bitsize of assigned IDs (data type)
            type: 'integer',

            // type of information
            mode: 'forward',

            // boolean model of multiple words
            boolean: false,

            // use flexible cache (scales automatically)
            cache: false,

            // use flexible cache (scales automatically)
            async: false,

            // use flexible cache (scales automatically)
            worker: false,

            // use on of built-in functions
            // or pass custom encoding algorithm
            encode: false,

            // debug flag
            debug: true
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
        //var regex_syllables = new RegExp("[^aeiouy]*[aeiouy]+", "g");

        /**  @const  {RegExp} */
        var regex_split = regex("[ -\/]");

        /**
         * @param {Object<string, number|string|boolean|Object|function(string):string>=} options
         * @constructor
         * @private
         */

        function FlexSearch(options){

            options || (options = defaults);

            // generate UID

            /** @export */
            this.id = options['id'] || id_counter++;

            // initialize index

            this.init(options);

            // define functional properties

            Object.defineProperty(this, 'index', {

                /**
                 * @this {FlexSearch}
                 */

                get: function(){

                    return this._ids;
                }
            });

            Object.defineProperty(this, 'length', {

                /**
                 * @this {FlexSearch}
                 */

                get: function(){

                    return Object.keys(this._ids).length;
                }
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

            return global_encoder[name](value);
        };

        /**
         * @param {Object<string, number|string|boolean|Object|function(string):string>=} options
         * @export
         */

        FlexSearch.prototype.init = function(options){

            /** @type {Array} */
            this._matcher = [];

            if(options){

                // initialize worker

                if(options['worker']){

                    if(typeof Worker === 'undefined'){

                        options['worker'] = false;
                        options['async'] = true;

                        this._worker = null;
                    }
                    else{

                        var self = this;
                        var threads = parseInt(options['worker'], 10) || 4;

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

                // apply options

                /** @export */
                this.mode = (

                    options['mode'] ||
                    this.mode ||
                    defaults.mode
                );

                /** @export */
                this.boolean = (

                    options['boolean'] === 'or' ||
                    this.boolean ||
                    defaults.boolean
                );

                /** @export */
                this.cache = (

                    options['cache'] ||
                    this.cache ||
                    defaults.cache
                );

                /** @export */
                this.async = (

                    options['async'] ||
                    this.async ||
                    defaults.async
                );

                /** @export */
                this.worker = (

                    options['worker'] ||
                    this.worker ||
                    defaults.worker
                );

                /** @export */
                this.encoder = (

                    (options['encode'] && global_encoder[options['encode']]) ||
                    this.encoder ||
                    //(defaults.encode && global_encoder[defaults.encode]) ||
                    options['encode']
                );

                /** @export */
                this.debug = (

                    options['debug'] ||
                    this.debug ||
                    defaults.debug
                );

                if(options['matcher']) {

                    this.addMatcher(/** @type {Object<string, string>} */ (options['matcher']));
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
                {/* 9 */}
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
            this._cache = this.cache ?

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

                value = this.encoder(value);
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

                    if(this.worker){

                        if(++this._current_task >= this._worker.length) this._current_task = 0;

                        this._worker[this._current_task].postMessage(this._current_task, {

                            'add': true,
                            'id': id,
                            'content': content
                        });

                        this._ids[id] = "" + this._current_task;

                        return this;
                    }

                    if(this.async){

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

                    var dupes = {};
                    var words = (

                        content.constructor === Array ?

                            /** @type {!Array<string>} */ (content)
                        :
                            /** @type {string} */ (content).split(regex_split)
                    );

                    for(var i = 0; i < words.length; i++){

                        /** @type {string} */
                        var value = words[i];

                        if(value){

                            var length = value.length;

                            switch(this.mode){

                                case 'inverse':
                                case 'both':

                                    var tmp = "";

                                    for(var a = length - 1; a >= 1; a--){

                                        tmp = value[a] + tmp;

                                        addIndex(

                                            this._map,
                                            dupes,
                                            tmp,
                                            id,
                                            content
                                        );
                                    }

                                    // Note: no break here, fallthrough to next case

                                case 'forward':

                                    var tmp = "";

                                    for(var a = 0; a < length; a++){

                                        tmp += value[a];

                                        addIndex(

                                            this._map,
                                            dupes,
                                            tmp,
                                            id,
                                            content
                                        );
                                    }

                                    break;

                                case 'full':

                                    var tmp = "";

                                    for(var x = 0; x < length; x++){

                                        for(var y = length; y > x; y--){

                                            tmp = value.substring(x, y);

                                            addIndex(

                                                this._map,
                                                dupes,
                                                tmp,
                                                id,
                                                content
                                            );
                                        }
                                    }

                                    break;

                                case 'strict':
                                default:

                                    addIndex(

                                        this._map,
                                        dupes,
                                        value,
                                        id,
                                        content
                                    );

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

                    if(this.worker){

                        var int = parseInt(this._ids[id], 10);

                        this._worker[int].postMessage(int, {

                            'update': true,
                            'id': id,
                            'content': content
                        });

                        return this;
                    }

                    if(this.async){

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

                if(this.worker){

                    var int = parseInt(this._ids[id], 10);

                    this._worker[int].postMessage(int, {

                        'remove': true,
                        'id': id
                    });

                    delete this._ids[id];

                    return this;
                }

                if(this.async){

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

            if(query && (typeof query === 'object')){

                // re-assign properties

                callback = query['callback'] || /** @type {?Function} */ (limit);
                limit = query['limit'];
                query = query['query'];
            }

            if(typeof limit === 'function'){

                callback = limit;
                limit = 1000;
            }
            else{

                limit || (limit = 1000);
            }

            if(this.worker){

                this._current_callback = callback;
                this._task_completed = 0;
                this._task_result = [];

                for(var i = 0; i < this.worker; i++){

                    this._worker[i].postMessage(i, {

                        'search': true,
                        'limit': limit,
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

                return [];
            }

            /** @type {!string|Array<string>} */
            var _query = query;

            // invalidate cache

            if(!this._status){

                if(this.cache){

                    this._last_empty_query = "";
                    this._cache.reset();
                }

                this._status = true;
            }

            // validate cache

            else if(this.cache){

                var cache = this._cache.get(query);

                if(cache){

                    return cache;
                }
            }

            // validate last query

            else if(this._last_empty_query && (query.indexOf(this._last_empty_query) === 0)){

                return [];
            }

            // encode string

            _query = this.encode(/** @type {string} */ (_query));

            if(!_query.length){

                return [];
            }

            // convert words into single components

            var words = (

                _query.constructor === Array ?

                    /** @type {!Array<string>} */ (_query)
                :
                    /** @type {string} */ (_query).split(regex_split)
            );

            var length = words.length;

            // sort words by length

            if(length > 1){

                words.sort(sort_by_length_down);
            }

            // perform search

            var result = [];
            var found = true;
            var check = [];
            var check_words = {};

            for(var a = 0; a < length; a++){

                var value = words[a];

                if(value){

                    if(check_words[value]){

                        continue;
                    }

                    var map;
                    var map_found = false;
                    var map_check = [];
                    var count = 0;

                    // loop scores top-down

                    for(var z = 9; z >= 0; z--){

                        if((map = this._map[z][value])){

                            if(map.length){

                                map_check[count++] = map;
                                map_found = true;
                            }
                        }
                    }

                    if(!map_found){

                        found = false;
                        break;
                    }
                    else{

                        check[check.length] = (

                            count > 1 ?

                                check.concat.apply([], map_check)
                            :
                                map_check[0]
                        );
                    }

                    check_words[value] = "1";
                }
            }

            if(found){

                length = check.length;

                // sort by length

                if(length > 1){

                    check.sort(sort_by_length_up);
                }

                var count = 0;
                var tmp = check[count++];

                if(tmp){

                    while(tmp.length && (count < length)){

                        var item = check[count++];

                        tmp = intersect(tmp, item, count === length ? /** @type {number} */ (limit) : 0);
                    }

                    if(limit && (tmp.length > limit)){

                        tmp.splice(limit, tmp.length - limit);
                    }

                    result = tmp;
                }
            }

            if(result.length){

                this._last_empty_query = "";
            }
            else{

                this._last_empty_query || (this._last_empty_query = query);
            }

            // store result to cache

            if(this.cache){

                this._cache.set(query, result);
            }

            return result;
        };

        /**
         * @export
         */

        FlexSearch.prototype.info = function(){

            if(this.worker){

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
                'matchers': global_matcher.length
            };
        };

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

            if(this.cache){

                this._cache.reset();
            }

            // release references

            this._scores = null;
            this._pages = null;
            this._map = null;
            this._ids = null;
            this._cache = null;

            return this;
        };

        /**
         * Phonetic Encoders
         * @enum {Function}
         * @private
         * @const
         * @final
         */

        var global_encoder = {

            // case insensitive search

            'icase': function(value){

                return value.toLowerCase();
            },

            // simple phonetic normalization (latin)

            'simple': (function(){

                var regex_strip = regex('[^a-z0-9 ]'),
                    regex_split = regex('[-\/]'),
                    regex_a = regex('[àáâãäå]'),
                    regex_e = regex('[èéêë]'),
                    regex_i = regex('[ìíîï]'),
                    regex_o = regex('[òóôõöő]'),
                    regex_u = regex('[ùúûüű]'),
                    regex_y = regex('[ýŷÿ]'),
                    regex_n = regex('ñ'),
                    regex_c = regex('ç'),
                    regex_s = regex('ß');

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
                    regex_split, ' ',
                    regex_strip, ''
                ];

                return function(str){

                    return (

                        replace(str.toLowerCase(), regex_pairs)
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
                    regex_ou, 'o',
                    regex_uo, 'u'
                ];

                return function(string, _skip_post_processing){

                    if(!string){

                        return string;
                    }

                    // perform simple encoding
                    string = global_encoder['simple'](string);

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
                    soundex_c = regex('[sz]'),
                    soundex_k = regex('[gq]'),
                    soundex_i = regex('[jy]'),
                    soundex_m = regex('n'),
                    soundex_t = regex('d'),
                    soundex_f = regex('[vw]');

                /** @const {RegExp} */
                var regex_vowel = regex('[aeiouy]');

                /** @const {Array} */
                var regex_pairs = [

                    soundex_b, 'b',
                    soundex_c, 'c',
                    soundex_k, 'k',
                    soundex_i, 'i',
                    soundex_m, 'm',
                    soundex_t, 't',
                    soundex_f, 'f',
                    regex_vowel, ''
                ];

                return function(str){

                    if(!str){

                        return str;
                    }

                    // perform advanced encoding
                    str = global_encoder['advanced'](str, /* skip post processing? */ true);

                    if(str.length > 1){

                        str = str.split(" ");

                        for(var i = 0; i < str.length; i++){

                            var current = str[i];

                            if(current.length > 1){

                                // remove all vowels after 2nd char
                                str[i] = current[0] + replace(current.substring(1), regex_pairs)
                            }
                        }

                        str = str.join("");
                        str = collapseRepeatingChars(str);
                    }

                    return str;
                };
            })(),

            /**
             * @param {!string} value
             * @returns {Array<?string>}
             */

            'ngram': function(value){

                var parts = [];

                if(!value){

                    return parts;
                }

                // perform advanced encoding
                value = global_encoder['advanced'](value);

                if(!value){

                    return parts;
                }

                var count_vowels = 0,
                    count_literal = 0,
                    count_parts = -1;

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

                    if((char === ' ') || ((count_vowels >= 2) && (count_literal >= 2)) || (i === length - 1)){

                        if(tmp){

                            var tmp_length = tmp.length;

                            if((tmp_length > 2) || (char === ' ') || (i === length - 1)){

                                var char_code = tmp.charCodeAt(0);

                                if((tmp_length > 1) || (char_code >= 48) || (char_code <= 57)){

                                    parts[++count_parts] = tmp;
                                }
                            }
                            else if(parts[count_parts]){

                                parts[count_parts] += tmp;
                            }

                            tmp = "";
                        }

                        count_vowels = 0;
                        count_literal = 0;
                    }
                }

                return parts;
            }

            // TODO: provide some common encoder plugins
            // soundex
            // cologne
            // metaphone
            // caverphone
            // levinshtein
            // hamming
            // matchrating
        };

        // Xone Async Handler Fallback

        var queue = (function(){

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
        })();

        // Xone Flexi-Cache Handler Fallback

        var cache = (function(){

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
        })();

        return FlexSearch;

        // ---------------------------------------------------------
        // Helpers

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
         */

        function addIndex(map, dupes, tmp, id, content){

            if(!dupes[tmp]){

                dupes[tmp] = "1";

                var arr = map[calcScore(tmp, content)];

                arr = arr[tmp] || (arr[tmp] = []);
                arr[arr.length] = id;
            }
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

                    if((i > 0) && (char !== ' ') && (char === 'h')){

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

                        if(char_prev_is_vowel && char_next_is_vowel){

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
         * @param {!Array|string} a
         * @param {!Array|string} b
         * @returns {number}
         */

        function sort_by_length_down(a, b){

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
         * @param {!Array|string} a
         * @param {!Array|string} b
         * @returns {number}
         */

        function sort_by_length_up(a, b){

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
         * @param {!Array<number|string>} a
         * @param {!Array<number|string>} b
         * @param {number|boolean=} limit
         * @returns {Array}
         */

        function intersect(a, b, limit){

            var length_a = a.length,
                length_b = b.length;

            var result = [];

            if(length_a && length_b){

                var count = 0,
                    tmp;

                // swap order, shortest first

                // if(length_b < length_a){
                //
                //     tmp = b;
                //     b = a;
                //     a = tmp;
                //
                //     tmp = length_b;
                //     length_b = length_a;
                //     length_a = tmp;
                // }

                for(var y = 0; y < length_a; y++){

                    var current_a = a[y];

                    for(var x = 0; x < length_b; x++){

                        if(b[x] === current_a){

                            result[count++] = current_a;

                            if(limit && (count === limit)){

                                return result;
                            }

                            break;
                        }
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

                            if(flexsearch.debug){

                                console.log("Worker Job Started: " + data['id']);
                            }

                            if(data['search']){

                                /** @lends {Worker} */
                                self.postMessage({

                                    'result': flexsearch['search'](data['content'], data['limit']),
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

                                )(data['options']);
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

                        if(options['debug']){

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

        (function register_worker(){

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

                                new Blob(

                                    ['(' + _worker.toString() + ')()'], {

                                        'type': 'text/javascript'
                                    }
                                )
                            )
                        :

                            /* Load Extern Worker (but also requires CORS) */

                            '../' + name + '.js'
                    );

                    name += '-' + _id;

                    worker_stack[name] || (worker_stack[name] = []);

                    worker_stack[name][_core] = new Worker(worker_payload);
                    worker_stack[name][_core]['onmessage'] = _callback;

                    //console.log('Register Worker@' + name);

                    return {

                        'postMessage': function(id, data){

                            worker_stack[name][id]['postMessage'](data);
                        }
                    };
                }
            );
        })()

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
