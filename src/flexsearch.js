/**!
 * FlexSearch.js
 * Copyright 2019 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */

"use strict";

import "./serialize.js";
import "./where.js";
import Cache from "./cache.js";
import Worker from "./worker.js";
import presets from "./presets.js";
//import { profile_start, profile_end } from "./profiler.js";
import { encode as default_encoder } from "./lang/latin/default.js"; // , split as default_split
import { addWorker } from "./worker.js";
import {
    is_undefined,
    is_string,
    is_array,
    is_function,
    is_object,
    get_keys,
    create_object,
    create_object_array,
    //replace,
    regex
} from "./common.js";

/**
 * TODO: inlining them
 * @const
 * @enum {boolean|string|number|RegExp|Function}
 */

const defaults = {

    "encode": default_encoder,
    "tokenize": "strict",
    // split: default_split,
    // enrich: true,
    // clone: false,
    // suggest: false,
    "cache": false,
    "async": false,
    "worker": false,
    "rtl": false,
    "doc": false,

    // maximum scoring
    "resolution": 9,

    // minimum scoring
    "threshold": 0,

    // contextual depth
    "depth": 0
};

let id_counter = 0;
export const global_lang = {};
export const global_charset = {};

/**
 * NOTE: Actually not really required when using bare objects via: Object.create(null)
 * @const {Object<string|number, number>}
 */

// const index_blacklist = (function(){
//     const array = Object.getOwnPropertyNames(/** @type {!Array} */ (({}).__proto__));
//     const map = create_object();
//     for(let i = 0; i < array.length; i++) map[array[i]] = 1;
//     return map;
// }());

/**
 * @param {string|Object<string, number|string|boolean|Object|function(string):string>=} options
 * @constructor
 */

export default function FlexSearch(options){

    // if(PROFILER){
    //
    //     profile = profiles[id_counter] || (profiles[id_counter] = {});
    //
    //     /** @export */
    //     this.stats = profile;
    // }

    if(!(this instanceof FlexSearch)) {

        return new FlexSearch(options);
    }

    const id = options && options["id"];

    /** @export */
    this.id = id || (id === 0) ? id : id_counter++;

    this.init(options);

    register_property(this, "index", /** @this {FlexSearch} */ function(){

        // if(SUPPORT_DOCUMENT && this.doc){
        //
        //     return get_keys(this.doc.index[this.doc.keys[0]]._ids);
        // }

        return get_keys(this._ids);
    });

    register_property(this, "length", /** @this {FlexSearch} */ function(){

        return this.index.length;
    });
}

/**
 * @param {Object<string, string>} matcher
 */

// FlexSearch["registerMatcher"] = function(matcher){
//
//     for(const key in matcher){
//
//         if(matcher.hasOwnProperty(key)){
//
//             this.matcher.push(regex(key), matcher[key]);
//         }
//     }
//
//     return FlexSearch;
// };

/**
 * @param {!string} name
 * @param {Object} charset
 */

FlexSearch["registerCharset"] = function(name, charset){

    global_charset[name] = charset;

    return FlexSearch;
};

/**
 * @param {!string} name
 * @param {Object} lang
 */

FlexSearch["registerLanguage"] = function(name, lang){

    global_charset[name] = lang;

    return FlexSearch;
};

/**
 * @param {string} name
 * @param {number|string} value
 * @returns {string}
 */

// FlexSearch["encode"] = function(name, value){
//
//     return global_encoder[name](value);
// };

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
 */

FlexSearch.prototype.init = function(options){

    /**
     * @type {Array}
     * @private
     */

    let custom;
    let doc;

    if(SUPPORT_PRESET){

        if(is_string(options)){

            if(DEBUG && !presets[options]){

                console.warn("Preset not found: " + options);
            }

            options = presets[options];
        }
        else{

            if((custom = options["preset"])){

                if(DEBUG && !presets[custom]){

                    console.warn("Preset not found: " + custom);
                }

                options = Object.assign({}, presets[custom], /** @type {Object} */ (options));
            }
        }
    }

    if(!this.encode){

        if(options){

            options = Object.assign({}, defaults, /** @type {Object} */ (options));
        }
        else{

            options = defaults;
        }
    }

    if(options){

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

                    this._worker[i] = addWorker(this.id, i, options /*|| defaults*/, this.worker_handler);
                }
            }

            /** @private */
            this.worker = custom;
        }

        if(SUPPORT_ASYNC){
            /** @private */
            this.async = options["async"];
            /** @private */
            this.timer = 0;
        }

        const charset = options["charset"];
        const lang = options["lang"];

        /** @private */
        this.tokenizer = (is_string(charset) ? global_charset[charset].tokenize : charset && charset.tokenize) || options["tokenize"];
        /** @private */
        //this.split = is_string(custom = options["split"] || charset) ? (global_charset[custom] ? global_charset[custom].split : regex(custom)) : global_charset.split || custom;
        /** @private */
        this.rtl = is_string(custom = options["rtl"] || charset) ? global_charset[custom].rtl : charset && charset.rtl || custom;
        /** @private */
        this.threshold = options["threshold"];
        /** @private */
        this.resolution = ((custom = options["resolution"]) <= this.threshold ? this.threshold + 1 : custom);
        /** @private */
        this.depth = ((this.tokenizer === "strict") && options["depth"]) || 0;
        /** @export */
        this.encode = is_string(custom = options["encode"] || charset) ? global_charset[custom.indexOf(":") === -1 ? custom + ":default" : custom].encode : charset && charset.encode || custom; //is_function(custom = options["encode"]) ? custom : (FlexSearch.Encoder[custom] /*&& global_encoder[custom].bind(global_encoder)*/);

        this.matcher = (custom = options["matcher"] || lang) && init_stemmer_or_matcher(

            is_string(custom) ? global_lang[custom].matcher : lang && lang.matcher || custom, false
        );

        this.filter = (custom = options["filter"] || lang) && init_filter(

            is_string(custom) ? global_lang[custom].filter : lang && lang.filter || custom
        );

        this.stemmer = (custom = options["stemmer"] || lang) && init_stemmer_or_matcher(

            is_string(custom) ? global_lang[custom].stemmer : lang && lang.stemmer || custom, true
        );

        // TODO: provide boost
        /** @private */
        //this.boost = (custom = options["boost"]) ? custom : 0;

        if(SUPPORT_DOCUMENT){

            /** @private */
            this.doc = doc = (custom = options["doc"]) && clone_object(custom);

            if(doc){

                options["doc"] = null;
            }
        }
    }

    // initialize primary index

    /** @private */
    this._map = create_object_array(this.resolution - (this.threshold || 0));
    /** @private */
    this._ctx = create_object();
    /** @private */
    this._ids = {};

    if(SUPPORT_DOCUMENT && doc){

        this._doc = create_object();

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

        //options["doc"] = custom;
    }

    if(SUPPORT_CACHE && (custom = options["cache"])) {

        /** @private */
        this._cache_status = true;

        /** @private */
        this._cache = new Cache(custom);
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

/**
 * @param {number|string} id
 * @param {string|Function} content
 * @param {Function=} callback
 * @param {boolean=} _skip_update
 * @param {boolean=} _recall
 * @this {FlexSearch}
 */

FlexSearch.prototype.add = function(id, content, callback, _skip_update, _recall){

    if(SUPPORT_DOCUMENT && this.doc && is_object(id)){

        return this.handle_docs("add", id, /** @type {Function} */ (content));
    }

    if(content && is_string(content) && ((id /*&& !index_blacklist[id]*/) || (id === 0))){

        // TODO: do not mix ids as string "1" and as number 1

        const index = id;

        if(this._ids[index] && !_skip_update){

            return this.update(id, content);
        }

        // if(SUPPORT_WORKER && this.worker){
        //
        //     if(++this._current_task >= this._worker.length){
        //
        //         this._current_task = 0;
        //     }
        //
        //     this._worker[this._current_task].postMessage({
        //
        //         "add": true,
        //         "id": id,
        //         "content": content
        //     });
        //
        //     this._ids[index] = "" + this._current_task;
        //
        //     // TODO: provide worker auto-balancing instead of rotation
        //     //this._ids_count[this._current_task]++;
        //
        //     if(callback){
        //
        //         callback();
        //     }
        //
        //     return this;
        // }

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

        // if(PROFILER){
        //
        //     profile_start("add");
        // }

        content = this.encode(/** @type {string} */ (content));

        if(!content.length){

            return this;
        }

        const words = content; //this.tokenize(content);
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

                switch(this.tokenizer){

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

        // if(PROFILER){
        //
        //     profile_end("add");
        // }
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

                if(job === "add"){

                   self.add(id, content, (i === (len - 1)) && callback);
                }
                else{

                    self.update(id, content, (i === (len - 1)) && callback);
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
 */

FlexSearch.prototype.update = function(id, content, callback){

    if(SUPPORT_DOCUMENT && this.doc && is_object(id)){

        return this.handle_docs("update", id, /** @type {Function} */ (content));
    }

    const index = id;

    if(this._ids[index] && is_string(content)){

        // if(PROFILER){
        //
        //     profile_start("update");
        // }

        this.remove(id);
        this.add(id, content, callback, /* skip_update: */ true);

        // if(PROFILER){
        //
        //     profile_end("update");
        // }
    }

    return this;
};

/**
 * @param {number|string} id
 * @param {Function=} callback
 * @param {boolean=} _recall
 */

FlexSearch.prototype.remove = function(id, callback, _recall){

    if(SUPPORT_DOCUMENT && this.doc && is_object(id)){

        return this.handle_docs("remove", id, callback);
    }

    const index = id;

    if(this._ids[index]){

        // if(SUPPORT_WORKER && this.worker){
        //
        //     const current_task = this._ids[index];
        //
        //     this._worker[current_task].postMessage({
        //
        //         "remove": true,
        //         "id": id
        //     });
        //
        //     //this._ids_count[current_task]--;
        //
        //     delete this._ids[index];
        //
        //     if(callback){
        //
        //         callback();
        //     }
        //
        //     return this;
        // }

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

        // if(PROFILER){
        //
        //     profile_start("remove");
        // }

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

        // if(PROFILER){
        //
        //     profile_end("remove");
        // }
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

FlexSearch.prototype.merge_and_sort = function(query, bool, result, sort, limit, suggest, where, cursor, has_and, has_not){

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

    if(SUPPORT_CACHE && this._cache){

        this._cache.set(query, result);
    }

    return result;
};

/**
 * TODO: move fields to main index to provide pagination
 *
 * @param {!string|Object|Array<Object>} query
 * @param {number|Function=} limit
 * @param {Function=} callback
 * @param {boolean=} _recall
 * @returns {FlexSearch|Array|Promise|undefined}
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

    // if(SUPPORT_WORKER && this.worker){
    //
    //     this._current_callback = callback;
    //     this._task_completed = 0;
    //     this._task_result = [];
    //
    //     for(let i = 0; i < this.worker; i++){
    //
    //         this._worker[i].postMessage({
    //
    //             "search": true,
    //             "limit": limit,
    //             "content": query
    //         });
    //     }
    //
    //     return;
    // }

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

                this.merge_and_sort(
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

                        self.merge_and_sort(
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

            return this.merge_and_sort(
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

    // if(PROFILER){
    //
    //     profile_start("search");
    // }

    if(!query || !is_string(query)){

        return result;
    }

    /** @type {!string|Array<string>} */
    (_query = query);

    if(SUPPORT_CACHE && this._cache){

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

    const words = _query; //this.tokenize(_query);
    const length = words.length;
    let found = true;
    const check = [];
    const check_words = create_object();

    let ctx_root;
    let use_contextual;
    let a = 0;

    if(length > 1){

        if(this.depth /*&& (this.tokenizer === "strict")*/){

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

    if(SUPPORT_CACHE && this._cache){

        this._cache.set(query, result);
    }

    // if(PROFILER){
    //
    //     profile_end("search");
    // }

    return result;
};

if(SUPPORT_INFO){

    FlexSearch.prototype.info = function(){

        // if(SUPPORT_WORKER && this.worker){
        //
        //     for(let i = 0; i < this.worker; i++) this._worker[i].postMessage({
        //
        //         "info": true,
        //         "id": this.id
        //     });
        //
        //     return;
        // }

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
            //"cache": this.cache && this.cache.ids ? this.cache.ids.length : false,
            "matcher": this.matcher.length,
            "worker": this.worker,
            "threshold": this.threshold,
            "depth": this.depth,
            "resolution": this.resolution,
            "contextual": this.depth && (this.tokenizer === "strict")
        };
    };
}

FlexSearch.prototype.clear = function(){

    return this.destroy().init();
};

FlexSearch.prototype.destroy = function(){

    if(SUPPORT_CACHE && this._cache){

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

// ---------------------------------------------------------
// Helpers

function register_property(obj, key, fn){

    // define functional properties

    Object.defineProperty(obj, key, {

        get: fn
    });
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

// FlexSearch.prototype.encode = function(value){
//
//     // if(PROFILER){
//     //
//     //     profile_start("encode");
//     // }
//
//     // if(value && this.normalize){
//     //
//     //     value = this.normalize(value);
//     // }
//     //
//     // if(value && this.matcher){
//     //
//     //     value = replace(value, this.matcher);
//     // }
//     //
//     // if(value && this.stemmer){
//     //
//     //     value = replace(value, this.stemmer);
//     // }
//
//     if(value && this.encoder){
//
//         value = this.encoder(value);
//     }
//
//     // if(value && this.split){
//     //
//     //     value = value.split(this.split);
//     // }
//     //
//     // if(this.filter){
//     //
//     //     value = filter_words(value, this.filter);
//     // }
//
//     // if(PROFILER){
//     //
//     //     profile_end("encode");
//     // }
//
//     return value;
// };

// FlexSearch.prototype.tokenize = function(content){
//
//     let words = (
//
//         this.split ?
//
//             content.split(this.split)
//         :
//             content
//     );
//
//     if(this.filter){
//
//         words = filter_words(words, this.filter);
//     }
//
//     return words;
// };

// TODO using fast-swap
// function filter_words(words, fn_or_map){
//
//     const length = words.length;
//     const filtered = [];
//
//     for(let i = 0, count = 0; i < length; i++){
//
//         const word = words[i];
//
//         if(word){
//
//             if(!fn_or_map[word]){
//
//                 filtered[count++] = word;
//             }
//         }
//     }
//
//     return filtered;
// }

/**
 * @param {Array<string>} words
 * @returns {Object<string, string>}
 */

function init_filter(words){

    const final = create_object();

    for(let i = 0, length = words.length; i < length; i++){

        final[words[i]] = 1;
    }

    return final;
}

/**
 * @param {!Object<string, string>} obj
 * @param {boolean} is_stemmer
 * @returns {Array}
 */

function init_stemmer_or_matcher(obj, is_stemmer){

    const keys = get_keys(obj);
    const length = keys.length;
    const final = [];

    let removal = "", count = 0;

    for(let i = 0, tmp; i < length; i++){

        const key = keys[i];

        if((tmp = obj[key])){

            final[count++] = regex(is_stemmer ? "(?!\\b)" + key + "(\\b|_)" : key);
            final[count++] = tmp;
        }
        else{

            removal += (removal ? "|" : "") + key;
        }
    }

    if(removal){

        final[count++] = regex(is_stemmer ? "(?!\\b)(" + removal + ")(\\b|_)" : "(" + removal + ")");
        final[count] = "";
    }

    return final;
}

/*
function sort_by_length_up(a, b){

    return a.length - b.length;
}
*/

function sort_by_length_down(a, b){

    return b.length - a.length;
}

function sort_by_field_up(a, b){

    return a[field_to_sort] - b[field_to_sort];
}

function sort_by_deep_field_up(a, b){

    const field_len = field_to_sort.length;

    for(let i = 0; i < field_len; i++){

        a = a[field_to_sort[i]];
        b = b[field_to_sort[i]];
    }

    return a - b;
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
