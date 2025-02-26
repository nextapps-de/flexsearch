// COMPILER BLOCK -->
import {
    SUPPORT_COMPRESSION,
    SUPPORT_PERSISTENT,
    SUPPORT_RESOLVER,
    SUPPORT_SUGGESTION
} from "../config.js";
// <-- COMPILER BLOCK
import { create_object, is_object, sort_by_length_down } from "../common.js";
import Index from "../index.js";
import default_compress from "../compress.js";
import Resolver from "../resolver.js";
import { intersect } from "../intersect.js";
import default_resolver from "../resolve/default.js";

let global_resolve = 1;
export function set_resolve(resolve){
    global_resolve = resolve;
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
        suggest = SUPPORT_SUGGESTION && options.suggest;
        resolve = global_resolve && options.resolve !== false;
        resolve || (global_resolve = 0);
        enrich = resolve && options.enrich;
    }
    else{
        resolve = global_resolve;
    }

    // todo: term deduplication during encoding when context is disabled

    /** @type {Array<string>} */
    query = this.encoder.encode("" + query);
    length = query.length;
    limit || !resolve || (limit = 100);

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
                    return !SUPPORT_RESOLVER || resolve
                        ? result
                        : new Resolver(result);
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
        return !SUPPORT_RESOLVER || resolve
            ? result
            : new Resolver(result);
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
                        return !SUPPORT_RESOLVER || resolve
                            ? single_term_result(result[0], limit, offset)
                            : new Resolver(result[0]);
                    }
                }
            }

            return !SUPPORT_RESOLVER || resolve
                ? intersect(result, limit, offset, suggest)
                : new Resolver(result[0]);
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
                return !SUPPORT_RESOLVER || resolve
                    ? single_term_result(result[0], limit, offset)
                    : new Resolver(result[0]);
            }
        }
    }

    return !SUPPORT_RESOLVER || resolve
        ? intersect(result, limit, offset, suggest)
        : new Resolver(result[0]);
};

function single_term_query(term, keyword, limit, offset, resolve, enrich){

    const result = this.get_array(term, keyword, limit, offset, resolve, enrich);

    if(SUPPORT_PERSISTENT && this.db){
        return result.then(function(result){
            if(resolve) return result;
            return result && result.length
                ? (!SUPPORT_RESOLVER || resolve ? single_term_result(result, limit, offset): new Resolver(result))
                : !SUPPORT_RESOLVER || resolve ? [] : new Resolver([]);
        });
    }

    return result && result.length
        ? (!SUPPORT_RESOLVER || resolve ? single_term_result(result, limit, offset) : new Resolver(result))
        : !SUPPORT_RESOLVER || resolve ? [] : new Resolver([]);

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
