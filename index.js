/**!
 * FlexSearch.js
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */

// COMPILER BLOCK -->
import {

    DEBUG,
    SUPPORT_ENCODER,
    SUPPORT_CACHE,
    SUPPORT_ASYNC,
    SUPPORT_SUGGESTION,
    SUPPORT_SERIALIZE,
    SUPPORT_PERSISTENT,
    SUPPORT_COMPRESSION,
    SUPPORT_KEYSTORE

} from "./config.js";
// <-- COMPILER BLOCK

import Encoder from "./encoder.js";
import { IndexInterface } from "./type.js";
import Cache, { searchCache } from "./cache.js";
import { KeystoreMap, KeystoreSet, KeystoreArray } from "./keystore.js";
import { create_object, sort_by_length_down, is_array, is_object } from "./common.js";
import { intersect } from "./intersect.js";
import { exportIndex, importIndex } from "./serialize.js";
import default_encoder from "./lang/latin/default.js";
import default_resolver from "./resolve/default.js";
import default_compress from "./compress.js";
import apply_preset from "./preset.js";
import apply_async from "./async.js";

/**
 * @constructor
 * @implements IndexInterface
 * @param {Object=} options
 * @param {Object=} _register
 * @return {Index}
 */

export default function Index(options, _register){

    if(!(this instanceof Index)) {
        return new Index(options);
    }

    if(options){
        if(SUPPORT_ENCODER){
            options = apply_preset(options);
        }
    }
    else{
        options = {};
    }

    const context = options.context || {};
    const encoder = options.encode || options.encoder || default_encoder;
    this.encoder = encoder.encode
        ? encoder
        : this.encoder = typeof encoder === "object"
            ? new Encoder(encoder)
            : { encode: encoder };

    if(SUPPORT_COMPRESSION){
        this.compress = options.compress || options.compression || false;
    }

    let tmp;
    this.resolution = options.resolution || 9;
    this.tokenize = tmp = options.tokenize || "strict";
    this.depth = (tmp === "strict" && context.depth) || 0;
    this.bidirectional = context.bidirectional !== false;
    this.fastupdate = !!options.fastupdate;

    tmp = SUPPORT_KEYSTORE && (options.keystore || 0);
    tmp && (this.keystore = tmp);

    this.map = tmp ? new KeystoreMap(tmp) : new Map();
    this.ctx = tmp ? new KeystoreMap(tmp) : new Map();
    this.reg = _register || (
        this.fastupdate
            ? (tmp ? new KeystoreMap(tmp) : new Map())
            : (tmp ? new KeystoreSet(tmp) : new Set())
    );
    this.resolution_ctx = context.resolution || 1;
    this.rtl = (encoder.rtl) /*|| (charset && charset.rtl)*/ || options.rtl || false;

    // TODO deprecated by new Encoder
    // this.matcher = (tmp = options["matcher"] || (lang && lang.matcher) || false) && init_stemmer_or_matcher(tmp, false);
    // this.stemmer = (tmp = options["stemmer"] || (lang && lang.stemmer) || false) && init_stemmer_or_matcher(tmp, true);
    // this.filter = (tmp = options["filter"] || (lang && lang.filter) || false) && init_filter(tmp);

    if(SUPPORT_CACHE && (tmp = options.cache)){
        this.cache = new Cache(tmp);
    }

    if(SUPPORT_PERSISTENT){
        if((tmp = options.db)){
            this.db = tmp.mount(this);
        }
        this.commit_auto = options.commit !== false;
        this.commit_task = [];
        this.commit_timer = null;
    }
}

if(SUPPORT_PERSISTENT){
    Index.prototype.mount = function(db){
        if(this.commit_timer){
            clearTimeout(this.commit_timer);
            this.commit_timer = null;
        }
        return this.db = db.mount(this);
    };
    Index.prototype.commit = function(replace, append){
        if(this.commit_timer){
            clearTimeout(this.commit_timer);
            this.commit_timer = null;
        }
        return this.db.commit(this, replace, append);
    };
}

function batchCommit(self, replace, append){
    if(!self.commit_timer){
        self.commit_timer = setTimeout(function(){
            self.commit_timer = null;
            self.db.commit(self, replace, append);
        }, 0);
    }
}

Index.prototype.clear = function(){

    //this.map = new Map();
    //this.ctx = new Map();
    //this.reg = this.fastupdate ? new Map() : new Set();
    this.map.clear();
    this.ctx.clear();
    this.reg.clear();

    if(SUPPORT_CACHE){
        this.cache &&
        this.cache.clear();
    }

    if(SUPPORT_PERSISTENT && this.db){
        this.commit_timer && clearTimeout(this.commit_timer);
        this.commit_timer = null;
        this.commit_task = [{ "clear": true }];
        //return this.db.clear();
    }

    return this;
};

//Index.prototype.pipeline = pipeline;

/**
 * @param {!number|string} id
 * @param {!string} content
 */

Index.prototype.append = function(id, content){
    return this.add(id, content, true);
};

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

        if(!_skip_update && !_append && this.reg.has(id)){
            return this.update(id, content);
        }

        content = this.encoder.encode("" + content);
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

                    let score = get_score(resolution, word_length, i);
                    let token = "";

                    switch(this.tokenize){

                        case "full":
                            if(term_length > 2){
                                for(let x = 0; x < term_length; x++){
                                    for(let y = term_length; y > x; y--){

                                        //if((y - x) >= this.minlength){
                                            const partial_score = get_score(resolution, word_length, i, term_length, x);
                                            token = term.substring(x, y);
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
                                        const partial_score = get_score(resolution, word_length, i, term_length, x);
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
                            if(this.boost){
                                score = Math.min((score / this.boost(content, term, i)) | 0, resolution - 1);
                            }

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

                                            const context_score = get_score(resolution + ((word_length / 2) > resolution ? 0 : 1), word_length, i, size - 1, x - 1);
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
    }

    if(SUPPORT_PERSISTENT && this.db && this.commit_auto){
        batchCommit(this);
    }

    return this;
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

    if(!dupes[term] || !keyword || !(tmp = dupes[term])[keyword]){

        if(keyword){

            dupes = tmp || (dupes[term] = create_object());
            dupes[keyword] = 1;

            if(SUPPORT_COMPRESSION && this.compress){
                keyword = default_compress(keyword);
            }

            tmp = arr.get(keyword);
            tmp ? arr = tmp
                : arr.set(keyword, arr = new Map());
        }
        else{

            dupes[term] = 1;
        }

        if(SUPPORT_COMPRESSION && this.compress){
            term = default_compress(term);
        }

        tmp = arr.get(term);
        tmp ? arr = tmp : arr.set(term, arr = tmp = []);
        // the ID array will be upgraded dynamically
        arr = arr[score] || (arr[score] = []);

        if(!append || !arr.includes(id)){

            // auto-upgrade to keystore array if max size exceeded
            if(SUPPORT_KEYSTORE){
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
}

/**
 * @param {string|Object} query
 * @param {number|Object=} limit
 * @param {Object=} options
 * @returns {Array<number|string>}
 */

Index.prototype.search = function(query, limit, options){

    if(!options){

        if(!limit && is_object(query)){

            options = /** @type {Object} */ (query);
            //query = options["query"];
        }
        else if(is_object(limit)){

            options = /** @type {Object} */ (limit);
            limit = 0;
        }
    }

    let result = [];
    let length;
    let context, suggest, offset = 0, resolve, enrich;

    if(options){

        query = options.query || query;
        limit = options.limit || limit;
        offset = options.offset || 0;
        context = options.context;
        resolve = options.resolve !== false;
        enrich = options.enrich;
        suggest = SUPPORT_SUGGESTION && options.suggest;
    }

    // todo: term deduplication during encoding when context is disabled

    /** @type {Array<string>} */
    query = this.encoder.encode("" + query);
    length = query.length;
    limit || (limit = 100);

    // TODO: solve this in one single loop below
    // TODO: dedupe terms within encoder?
    // TODO: deduplication will break the context chain

    let maxlength = 0;
    let minlength = 0;

    context = this.depth && context !== false;

    // fast path single term
    if(length === 1){
        return single_term_query.call(this, query[0], "", limit, offset, resolve, enrich);
    }

    // fast path single context
    if(length === 2 && context && !suggest){
        return single_term_query.call(this, query[0], query[1], limit, offset, resolve, enrich);
    }

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
                if(!suggest && !(SUPPORT_PERSISTENT && this.db) && !this.get_array(term/*, keyword*/)){

                    // fast path "not found"
                    return result;
                }
                else{

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
        return result;
    }

    let index = 0, keyword;

    // fast path single term
    if(length === 1){
        return single_term_query.call(this, query[0], "", limit, offset, resolve, enrich);
    }

    // fast path single context
    if(length === 2 && context && !suggest){
        return single_term_query.call(this, query[0], query[1], limit, offset, resolve, enrich);
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

    if(SUPPORT_PERSISTENT && this.db){

        if(this.db.search){
            // when the configuration is not supported it returns false
            const result = this.db.search(this, query, limit, offset, suggest, resolve, enrich);
            if(result !== false) return result;
        }

        const self = this;
        return (async function(){

            for(let arr, term; index < length; index++){

                term = query[index];

                if(keyword){

                    arr = await self.get_array(term, keyword);
                    arr = add_result(arr, result, suggest, self.resolution_ctx, limit, offset, length === 2/*, term, keyword*/);

                    // when suggestion enabled just forward keyword if term was found
                    // as long as the result is empty forward the pointer also

                    if(!suggest || (arr !== false) || !result.length){
                        keyword = term;
                    }
                }
                else{

                    arr = await self.get_array(term);
                    arr = add_result(arr, result, suggest, self.resolution, limit, offset, length === 1/*, term*/);
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
                        return single_term_result(result[0], limit, offset);
                    }
                }
            }

            return intersect(result, limit, offset, suggest);
        }());
    }

    for(let arr, term; index < length; index++){

        term = query[index];

        if(keyword){

            arr = this.get_array(term, keyword);
            arr = /*this.*/add_result(arr, result, suggest, this.resolution_ctx, limit, offset, length === 2/*, term, keyword*/);

            // 1. when suggestion enabled just forward keyword if term was found
            // 2. as long as the result is empty forward the pointer also

            if(!suggest || (arr !== false) || !result.length){
                keyword = term;
            }
        }
        else{

            arr = this.get_array(term);
            arr = /*this.*/add_result(arr, result, suggest, this.resolution, limit, offset, length === 1/*, term*/);
        }

        // limit reached
        if(arr){
            return arr;
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
                return single_term_result(result[0], limit, offset);
            }
        }
    }

    return intersect(result, limit, offset, suggest);
};

function single_term_query(term, keyword, limit, offset, resolve, enrich){

    const result = this.get_array(term, keyword, limit, offset, resolve, enrich);

    if(SUPPORT_PERSISTENT && this.db){
        return result.then(function(result){
            if(resolve) return result;
            return result && result.length
                // todo apply on database
                ? single_term_result(result, limit, offset)
                : [];
        });
    }

    return result && result.length
        ? single_term_result(result, limit, offset)
        : [];

    // if(SUPPORT_COMPRESSION && this.compress){
    //     term = default_compress(term);
    // }
    //
    // if(SUPPORT_PERSISTENT && this.db){
    //
    //     // return new Promise(async function(resolve){
    //     //     const result = await self.store.get("map", term[0]);
    //     //     resolve(result ? single_term_result(result, limit, offset) : []);
    //     // });
    //
    //     const swap = keyword && this.bidirectional && (term > keyword);
    //     return this.db.get(swap ? keyword : term, swap ? term : keyword, limit, offset, resolve, enrich).then(function(result){
    //         //console.log(result);
    //         if(resolve) return result;
    //         // if(result && result.length){
    //         //     result = result.filter(arr => arr && !!arr.length);
    //         // }
    //         return result && result.length
    //             // todo apply on database
    //             ? single_term_result(result, limit, offset)
    //             : [];
    //     });
    // }
    //
    // const result = this.get_array(term, keyword);
    // return result && result.length
    //     ? single_term_result(result, limit, offset)
    //     : [];
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
 * @param {number} limit
 * @param {number} offset
 * @param {boolean} single_term
 * @param {string} term
 * @param {string=} keyword
 * @return {Array<Array<string|number>>|boolean|undefined}
 */

/*Index.prototype.add_result =*/ function add_result(arr, result, suggest, resolution, limit, offset, single_term/*, term, keyword*/){

    let word_arr = [];
    //let arr;// = keyword ? this.ctx : this.map;
    //arr = this.get_array(term, keyword);

    if(arr){

        //const resolution = Math.min(arr.length, keyword ? this.resolution_ctx : this.resolution);
        // apply custom resolution for queries
        resolution = Math.min(arr.length, resolution);

        // relevance:
        for(let x = 0, size = 0, tmp, len; x < resolution; x++){

            if((tmp = arr[x])){

                if(offset){

                    if(tmp && single_term){

                        len = tmp.length;

                        if(len <= offset){

                            offset -= len;
                            tmp = null;
                        }
                        else{

                            tmp = tmp.slice(offset);
                            offset = 0;
                        }
                    }
                }

                if(tmp){

                    // keep score (sparse array):
                    word_arr[x] = tmp;

                    // simplified score order:
                    //word_arr.push(tmp);

                    if(single_term){

                        size += tmp.length;
                        if(size >= limit){

                            // fast path optimization
                            // a single term does not need to pre-collect results
                            break;
                        }
                    }
                }
            }
        }

        if(word_arr.length){

            if(single_term){

                // fast path optimization
                // offset was already applied at this point
                // return an array will stop the query process immediately
                return single_term_result(word_arr, limit, 0);
            }

            result.push(word_arr);

            // return nothing will continue the query
            return;
        }
    }

    // 1. return an empty array will stop the loop
    // 2. return a false value to prevent stop when using suggestions
    return !suggest && word_arr;
}

// TODO EXCHANGE
let single_term_result = default_resolver;

// function single_term_result(result, limit, offset){
//
//     if(result.length === 1){
//
//         result = result[0];
//     }
//     else{
//
//         result = concat(result);
//     }
//
//     return offset || (result.length > limit) ?
//
//         result.slice(offset, offset + limit)
//     :
//         result;
// }

Index.prototype.get_array = function(term, keyword, limit, offset, resolve, enrich){

    let arr, swap;

    if(keyword){
        swap = this.bidirectional && (term > keyword);
    }

    if(SUPPORT_COMPRESSION && this.compress){
        term = default_compress(term);
        keyword && (keyword = default_compress(keyword));
    }

    if(SUPPORT_PERSISTENT && this.db){
        // todo apply limit/offset on single term search
        return keyword
            ? this.db.get(swap ? keyword : term, swap ? term : keyword, limit, offset, resolve, enrich) // keyword last
            : this.db.get(term, "", limit, offset, resolve, enrich);
    }

    if(keyword){

        // the frequency of the starting letter is slightly less
        // on the last half of the alphabet (m-z) in almost every latin language,
        // so we sort downwards (https://en.wikipedia.org/wiki/Letter_frequency)

        arr = this.ctx.get(swap ? term : keyword);
        arr = arr && arr.get(swap ? keyword : term);
    }
    else{

        arr = this.map.get(term);
    }

    return arr;
}

Index.prototype.contain = function(id){

    if(SUPPORT_PERSISTENT && this.db){
        return this.db.has(id);
    }

    return this.reg.has(id);
};

Index.prototype.update = function(id, content){

    // todo check the async part
    if(this.async || (SUPPORT_PERSISTENT && this.db)){
        const self = this;
        const res = this.remove(id);
        return res.then ? res.then(
            () => self.add(id, content)
        ) : this.add(id, content);
    }

    return this.remove(id).add(id, content);
};

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
                    else{
                        const index = tmp.indexOf(id);
                        index === refs.length - 1
                            ? tmp.pop()
                            : tmp.splice(index, 1);
                    }
                }
                else{
                    // todo investigate empty entries
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
        else{

            remove_index(this.map, id, this.resolution);
            this.depth &&
            remove_index(this.ctx, id, this.resolution_ctx);
        }

        _skip_deletion || this.reg.delete(id)
    }
    else{

        // when the ID was in the register above then it wasn't committed yet
        if(SUPPORT_PERSISTENT && this.db){
            this.commit_task.push({ "del": id });
            this.commit_auto && batchCommit(this);
            //return this.db.remove(id);
        }
    }

    // the cache could be used outside the InMemory store
    if(SUPPORT_CACHE && this.cache){
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
                    else{
                        // remove resolution slot
                        delete map[x];
                    }
                    // the index key:[res, id] is unique
                    break;
                }
                else{
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
        DEBUG && console.info("Cleanup the index isn't required when not using \"fastupdate\".");
        return this;
    }

    cleanup_index(this.map);
    this.depth &&
    cleanup_index(this.ctx);

    return this;
};

if(SUPPORT_CACHE){
    // todo move to config
    Index.prototype.searchCache = searchCache;
}

if(SUPPORT_SERIALIZE){

    Index.prototype.export = exportIndex;
    Index.prototype.import = importIndex;
}

if(SUPPORT_ASYNC){

    apply_async(Index.prototype);
}
