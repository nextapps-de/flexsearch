/**!
 * FlexSearch.js
 * Copyright 2019 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */

import {

    SUPPORT_PRESET,
    SUPPORT_CACHE,
    SUPPORT_ASYNC,
    SUPPORT_SUGGESTION,
    SUPPORT_SERIALIZE

} from "./config.js";

import { IndexInterface } from "./type.js";
import { encode as default_encoder } from "./lang/latin/default.js";
import { create_object, create_object_array, concat, sort_by_length_down, is_array, is_string, is_object, parse_option } from "./common.js";
import { pipeline, init_stemmer_or_matcher, init_filter } from "./lang.js";
import { global_lang, global_charset } from "./global.js";
import apply_async from "./async.js";
import { intersect } from "./intersect.js";
import Cache, { searchCache } from "./cache.js";
import apply_preset from "./preset.js";
import { exportIndex, importIndex } from "./serialize.js";

/**
 * @constructor
 * @implements IndexInterface
 * @param {Object=} options
 * @param {Object=} _register
 * @return {Index}
 */

function Index(options, _register){

    if(!(this instanceof Index)) {

        return new Index(options);
    }

    let charset, lang, tmp;

    if(options){

        if(SUPPORT_PRESET){

            options = apply_preset(options);
        }

        charset = options["charset"];
        lang = options["lang"];

        if(is_string(charset)){

            if(charset.indexOf(":") === -1){

                charset += ":default";
            }

            charset = global_charset[charset];
        }

        if(is_string(lang)){

            lang = global_lang[lang];
        }
    }
    else{

        options = {};
    }

    let resolution, threshold, optimize, context = options["context"] || {};

    this.encode = options["encode"] || (charset && charset.encode) || default_encoder;
    this.register = _register || create_object();

    resolution = options["resolution"] || 9;
    threshold = options["threshold"] || 0;

    if(threshold >= resolution){

        threshold = resolution - 1;
    }

    this.resolution = resolution;
    this.threshold = threshold;
    this.tokenizer = tmp = (charset && charset.tokenize) || options["tokenize"] || "strict";
    this.depth = (tmp === "strict") && context["depth"];
    this.bidirectional = parse_option(context["bidirectional"], true);
    this.optimize = optimize = options["optimize"] === "memory";
    this.fastupdate = parse_option(options["fastupdate"], true);
    this.minlength = options["minlength"] || 1;

    // when not using the memory strategy the score array should not pre-allocated to its full length

    this.map = optimize ? create_object_array(resolution - threshold) : create_object();

    resolution = context["resolution"] || resolution;
    threshold = context["threshold"] || threshold;

    if(threshold >= resolution){

        threshold = resolution - 1;
    }

    this.resolution_ctx = resolution;
    this.threshold_ctx = threshold;
    this.ctx = optimize ? create_object_array(resolution - threshold) : create_object();
    this.rtl = (charset && charset.rtl) || options["rtl"];
    this.matcher = (tmp = options["matcher"] || (lang && lang.matcher)) && init_stemmer_or_matcher(tmp, false);
    this.stemmer = (tmp = options["stemmer"] || (lang && lang.stemmer)) && init_stemmer_or_matcher(tmp, true);
    this.filter = (tmp = options["filter"] || (lang && lang.filter)) && init_filter(tmp);

    if(SUPPORT_CACHE){

        this.cache = (tmp = options["cache"]) && new Cache(tmp);
    }
}

export default Index;

Index.prototype.pipeline = pipeline;

/**
 * @param {!number|string} id
 * @param {!string} content
 */

Index.prototype.append = function(id, content){

    return this.add(id, content, true);
};

/**
 * @param {!number|string} id
 * @param {!string} content
 * @param {boolean=} _append
 */

Index.prototype.add = function(id, content, _append){

    if(this.register[id] && !_append){

        return this.update(id, content);
    }

    if(content && (id || (id === 0))){

        content = this.encode(content);
        const length = content.length;

        if(length){

            const depth = this.depth;
            const resolution = this.resolution - this.threshold;
            const dupes = create_object();
            // check context dupes to skip all contextual redundancy in the whole document
            const dupes_ctx = create_object();

            for(let i = 0; i < length; i++){

                let term = content[this.rtl ? length - 1 - i : i];
                let term_length = term.length;

                // skip dupes will break the context chain
                if(term && (term_length >= this.minlength) && (depth || !dupes[term])){

                    const score = Math.min((this.resolution / length * i) | 0, i);

                    if(score < resolution){

                        let token = "";

                        switch(this.tokenizer){

                            case "full":

                                if(term_length > 3){

                                    for(let x = 0; x < term_length; x++){

                                        const partial_score = x ? Math.min((score / 2 + this.resolution / term_length * x / 2) | 0, score + x) : score;

                                        if(partial_score < resolution){

                                            for(let y = term_length; y > x; y--){

                                                token = term.substring(x, y);

                                                if(token.length >= this.minlength){

                                                    this.push_index(dupes, token, partial_score, id, _append);
                                                }
                                            }
                                        }
                                    }

                                    break;
                                }

                                // fallthrough to next case when term length < 4

                            case "reverse":

                                // skip last round (this token exist already in "forward")

                                if(term_length > 2){

                                    for(let a = term_length - 1; a > 0; a--){

                                        token = term[a] + token;

                                        if(token.length >= this.minlength){

                                            this.push_index(dupes, token, score, id, _append);
                                        }
                                    }

                                    token = "";
                                }

                                // fallthrough to next case to apply forward also

                            case "forward":

                                if(term_length > 1){

                                    for(let a = 0; a < term_length; a++){

                                        token += term[a];

                                        if(token.length >= this.minlength){

                                            this.push_index(dupes, token, score, id, _append);
                                        }
                                    }
                                }

                                break;

                            //case "strict":
                            default:

                                this.push_index(dupes, term, score, id, _append);

                                if(depth){

                                    if((length > 1) && (i < (length - 1))){

                                        const resolution = this.resolution_ctx - this.threshold_ctx;
                                        // check inner dupes to skip repeating words in the current context
                                        const dupes_inner = create_object();
                                        const keyword = term;
                                        let size = Math.min(depth + 1, length - i);

                                        dupes_inner[keyword] = 1;

                                        for(let x = 1; x < size; x++){

                                            term = content[this.rtl ? length - 1 - i - x : i + x];

                                            if(term && (term.length >= this.minlength) && !dupes_inner[term]){

                                                dupes_inner[term] = 1;

                                                const context_score = Math.min(((this.resolution_ctx - size /*+ 1*/) / length * i + x) | 0, i + (x - 1));

                                                if(context_score < resolution){

                                                    const swap = this.bidirectional && (term > keyword);

                                                    this.push_index(dupes_ctx, swap ? keyword : term, context_score, id, _append, swap ? term : keyword);
                                                }
                                            }
                                            else{

                                                size = Math.min(size + 1, length - i);
                                            }
                                        }
                                    }
                                }
                        }
                    }
                }
            }

            this.fastupdate || (this.register[id] = 1);
        }
    }

    return this;
};

/**
 * @private
 * @param dupes
 * @param value
 * @param score
 * @param id
 * @param {boolean=} append
 * @param {string=} keyword
 */

Index.prototype.push_index = function(dupes, value, score, id, append, keyword){

    let arr = keyword ? this.ctx : this.map;

    if(!dupes[value] || (keyword && !dupes[value][keyword])){

        if(this.optimize){

            arr = arr[score];
        }

        if(keyword){

            dupes[value] || (dupes[value] = create_object());
            dupes[value][keyword] = 1;

            arr = arr[keyword] || (arr[keyword] = create_object());
        }
        else{

            dupes[value] = 1;
        }

        arr = arr[value] || (arr[value] = []);

        if(!this.optimize){

            arr = arr[score] || (arr[score] = []);
        }

        if(!append || (arr.indexOf(id) === -1)){

            arr[arr.length] = id;

            // add a reference to the register for fast updates

            if(this.fastupdate){

                const tmp =  this.register[id] || (this.register[id] = []);
                tmp[tmp.length] = arr;
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

    if(is_object(query)){

        options = /** @type {Object} */ (query);
        query = options["query"];
    }
    else if(is_object(limit)){

        options = /** @type {Object} */ (limit);
    }

    let result = [];
    let length;
    let threshold = this.threshold, context, suggest, offset = 0;

    if(options){

        limit = options["limit"];
        offset = options["offset"] || 0;
        threshold = parse_option(options["threshold"], threshold);
        context = options["context"];
        suggest = SUPPORT_SUGGESTION && options["suggest"];
    }

    if(query){

        query = /** @type {Array} */ (this.encode(query));
        length = query.length;

        // TODO: solve this in one single loop below

        if(length > 1){

            const dupes = create_object();
            const query_new = [];

            for(let i = 0, count = 0, term; i < length; i++){

                term = query[i];

                if(term && (term.length >= this.minlength) && !dupes[term]){

                    // the fast path just could applied when not in memory-optimized mode

                    if(!this.optimize && !suggest && !this.map[term]){

                        // fast path "not found"

                        return result;
                    }
                    else{

                        query_new[count++] = term;
                        dupes[term] = 1;
                    }
                }
            }

            query = query_new;
            length = query.length;
        }
    }

    if(!length){

        return result;
    }

    limit || (limit = 100);

    const resolution = this.resolution - threshold;
    const resolution_ctx = this.resolution_ctx - threshold;
    let depth = this.depth && (length > 1) && (context !== false);
    let index = 0, keyword;

    if(depth){

        keyword = query[0];
        index = 1;
    }
    else{

        if(length > 1){

            query.sort(sort_by_length_down);
        }
    }

    for(let arr, term; index < length; index++){

        term = query[index];

        if(depth){

            arr = this.add_result(result, suggest, resolution_ctx, limit, length === 2, term, keyword);

            // when suggestion enabled just forward keyword if term was found
            // as long as the result is empty forward the pointer also

            if(!suggest || (arr !== false) || !result.length){

                keyword = term;
            }
        }
        else{

            arr = this.add_result(result, suggest, resolution, limit, length === 1, term);
        }

        if(arr){

            return /** @type {Array<number|string>} */ (arr);
        }

        // apply suggestions on last loop or fallback

        if(suggest && (index === length - 1)){

            let length = result.length;

            if(!length){

                if(depth){

                    // fallback to non-contextual search when no result was found

                    depth = 0;
                    index = -1;

                    continue;
                }

                return result;
            }
            else if(length === 1){

                // fast path optimization

                result = result[0];

                if(result.length === 1){

                    result = result[0];
                }
                else{

                    result = concat(result);
                }

                // TODO apply offset

                return result.length > limit ? result.slice(0, limit) : result;
            }
        }
    }

    return intersect(result, limit, offset, suggest);
};

function get_array(arr, term, keyword, bidirectional){

    if(keyword){

        const swap = bidirectional && (term > keyword);

        arr = arr[swap ? term : keyword];
        arr = arr && arr[swap ? keyword : term];
    }
    else{

        arr = arr[term];
    }

    return arr;
}

/**
 * Returns an array when the result is done (to stop the process immediately),
 * returns false when suggestions is enabled and no result was found,
 * or returns nothing when a set was pushed successfully to the results
 *
 * @private
 * @param {Array} result
 * @param {Array} suggest
 * @param {number} resolution
 * @param {number} limit
 * @param {boolean} just_one_loop
 * @param {string} term
 * @param {string=} keyword
 * @return {Array<Array<string|number>>|boolean|undefined}
 */

Index.prototype.add_result = function(result, suggest, resolution, limit, just_one_loop, term, keyword){

    let word_arr = [];
    let arr = keyword ? this.ctx : this.map;

    if(!this.optimize){

        arr = get_array(arr, term, keyword, this.bidirectional);
    }

    if(arr){

        let count = 0;
        const arr_len = Math.min(arr.length, resolution);

        for(let x = 0, size = 0, tmp; x < arr_len; x++){

            tmp = arr[x];

            if(this.optimize){

                tmp = get_array(tmp, term, keyword, this.bidirectional);
            }

            if(tmp){

                // TODO apply offset

                // keep score (sparse array):
                //word_arr[x] = arr;

                // simplified score order:
                word_arr[count++] = tmp;

                if(just_one_loop){

                    size += tmp.length;

                    if(size >= limit){

                        // fast path optimization

                        break;
                    }
                }
            }
        }

        if(count){

            if(just_one_loop){

                // TODO apply offset

                // fast path optimization

                if(count === 1){

                    word_arr = word_arr[0];
                }
                else{

                    word_arr = concat(word_arr);
                }

                return word_arr.length > limit ? word_arr.slice(0, limit) : word_arr;
            }

            result[result.length] = word_arr;
            return;
        }
    }

    // return an empty array will stop the loop,
    // to prevent stop when using suggestions return a false value

    return !suggest && word_arr;
};

Index.prototype.contain = function(id){

    return !!this.register[id];
};

Index.prototype.update = function(id, content){

    return this.remove(id).add(id, content);
};

/**
 * @param {boolean=} _skip_deletion
 */

Index.prototype.remove = function(id, _skip_deletion){

    const refs = this.register[id];

    if(refs){

        if(this.fastupdate){

            // fast updates performs really fast but did not fully cleanup the key entries

            for(let i = 0, tmp; i < refs.length; i++){

                tmp = refs[i];
                tmp.splice(tmp.indexOf(id), 1);
            }
        }
        else{

            remove_index(this.map, id, this.resolution - this.threshold, this.optimize);

            if(this.depth){

                remove_index(this.ctx, id, this.resolution_ctx - this.threshold_ctx, this.optimize);
            }
        }

        _skip_deletion || delete this.register[id];

        if(SUPPORT_CACHE && this.cache){

            this.cache.del(id);
        }
    }

    return this;
};

/**
 * @param map
 * @param id
 * @param res
 * @param optimize
 * @param {number=} resolution
 * @return {number}
 */

function remove_index(map, id, res, optimize, resolution){

    let count = 0;

    if(is_array(map)){

        // the first array is the score array in both strategies

        if(!resolution){

            resolution = Math.min(map.length, res);

            for(let x = 0, arr; x < resolution; x++){

                arr = map[x];

                if(arr){

                    count = remove_index(arr, id, res, optimize, resolution);

                    if(!optimize && !count){

                        // when not memory optimized the score index should removed

                        delete map[x];
                    }
                }
            }
        }
        else{

            const pos = map.indexOf(id);

            if(pos !== -1){

                // fast path, when length is 1 or lower then the whole field gets deleted

                if(map.length > 1){

                    map.splice(pos, 1);
                    count++;
                }
            }
            else{

                count++;
            }
        }
    }
    else{

        for(let key in map){

            count = remove_index(map[key], id, res, optimize, resolution);

            if(!count){

                delete map[key];
            }
        }
    }

    return count;
}

if(SUPPORT_CACHE){

    Index.prototype.searchCache = searchCache;
}

if(SUPPORT_SERIALIZE){

    Index.prototype.export = exportIndex;
    Index.prototype.import = importIndex;
}

if(SUPPORT_ASYNC){

    apply_async(Index.prototype);
}
