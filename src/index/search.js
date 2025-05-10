// COMPILER BLOCK -->
import {
    SUPPORT_CACHE,
    SUPPORT_COMPRESSION,
    SUPPORT_DOCUMENT,
    SUPPORT_PERSISTENT,
    SUPPORT_RESOLVER,
    SUPPORT_SUGGESTION,
    SUPPORT_TAGS
} from "../config.js";
// <-- COMPILER BLOCK

import { SearchOptions, SearchResults, EnrichedSearchResults, IntermediateSearchResults } from "../type.js";
import { create_object, is_object, sort_by_length_down } from "../common.js";
import Index from "../index.js";
import default_compress from "../compress.js";
import Resolver from "../resolver.js";
import { intersect } from "../intersect.js";
import resolve_default from "../resolve/default.js";

/**
 * @param {string|SearchOptions} query
 * @param {number|SearchOptions=} limit
 * @param {SearchOptions=} options
 * @return {
 *   SearchResults|EnrichedSearchResults|Resolver |
 *   Promise<SearchResults|EnrichedSearchResults|Resolver>
 * }
 */
Index.prototype.search = function(query, limit, options){

    if(!options){
        if(!limit && typeof query === "object"){
            options = /** @type {!SearchOptions} */ (query);
            query = "";
        }
        else if(typeof limit === "object"){
            options = /** @type {!SearchOptions} */ (limit);
            limit = 0;
        }
    }

    if(SUPPORT_CACHE && options && options.cache){
        options.cache = false;
        const res = this.searchCache(query, limit, options);
        options.cache = true;
        return res;
    }

    /** @type {!Array<IntermediateSearchResults>} */
    let result = [];
    let length;
    let context,
        suggest,
        offset = 0,
        resolve,
        tag,
        boost,
        resolution,
        // enrich is internally used just
        // for the persistent indexes
        enrich;

    if(options){
        query = options.query || query;
        limit = options.limit || limit;
        offset = options.offset || 0;
        context = options.context;
        suggest = SUPPORT_SUGGESTION && options.suggest;
        resolve = !SUPPORT_RESOLVER || options.resolve;
        enrich = resolve && options.enrich;
        boost = SUPPORT_DOCUMENT && options.boost;
        resolution = options.resolution;
        tag = SUPPORT_DOCUMENT && SUPPORT_TAGS && SUPPORT_PERSISTENT && this.db && options.tag;
    }

    if(typeof resolve === "undefined"){
        resolve = !SUPPORT_RESOLVER || this.resolve;
    }

    context = this.depth && context !== false;
    // do not force a string as input
    // https://github.com/nextapps-de/flexsearch/issues/432
    /** @type {Array<string>} */
    let query_terms = this.encoder.encode(query, !context);
    length = query_terms.length;
    limit = /** @type {!number} */ (limit || (resolve ? 100 : 0));

    // fast path single term
    if(length === 1){
        return single_term_query.call(this,
            query_terms[0], // term
            "",             // ctx
            limit,
            offset,
            resolve,
            enrich,
            tag
        );
    }

    // fast path single context
    if(length === 2 && context && !suggest){
        return single_term_query.call(this,
            query_terms[1], // term
            query_terms[0], // ctx
            limit,
            offset,
            resolve,
            enrich,
            tag
        );
    }

    // let maxlength = 0;
    // let minlength = 0;
    //
    // if(length > 1){
    //
    //     // term deduplication will break the context chain
    //     // todo add context to dupe check
    //     const dupes = create_object();
    //     const query_new = [];
    //
    //     // if(context){
    //     //     keyword = query_terms[0];
    //     //     dupes[keyword] = 1;
    //     //     query_new.push(keyword);
    //     //     maxlength = minlength = keyword.length;
    //     //     i = 1;
    //     // }
    //
    //     for(let i = 0, term; i < length; i++){
    //
    //         term = query_terms[i];
    //
    //         if(term && !dupes[term]){
    //
    //             // todo add keyword check
    //             // this fast path can't apply to persistent indexes
    //             if(!suggest && !(SUPPORT_PERSISTENT && this.db) && !this.get_array(term/*, keyword*/)){
    //
    //                 // fast path "not found"
    //                 return !SUPPORT_RESOLVER || resolve
    //                     ? result
    //                     : new Resolver(result);
    //             }
    //             else{
    //
    //                 query_new.push(term);
    //                 dupes[term] = 1;
    //             }
    //
    //             const term_length = term.length;
    //             maxlength = Math.max(maxlength, term_length);
    //             minlength = minlength ? Math.min(minlength, term_length) : term_length;
    //         }
    //         // else if(term && (!this.depth || context === false)){
    //         //     query_new.push(term);
    //         // }
    //     }
    //
    //     query_terms = query_new;
    //     length = query_terms.length;
    // }
    //
    // // the term length could be changed after deduplication
    //
    // if(!length){
    //     return !SUPPORT_RESOLVER || resolve
    //         ? result
    //         : new Resolver(result);
    // }
    //
    // // fast path single term
    // if(length === 1){
    //     return single_term_query.call(
    //         this,
    //         query_terms[0], // term
    //         "",       // ctx
    //         limit,
    //         offset,
    //         resolve,
    //         enrich,
    //         tag
    //     );
    // }
    //
    // // fast path single context
    // if(length === 2 && context && !suggest){
    //     return single_term_query.call(
    //         this,
    //         query_terms[0], // term
    //         query_terms[1], // ctx
    //         limit,
    //         offset,
    //         resolve,
    //         enrich,
    //         tag
    //     );
    // }

    let dupes = create_object();
    let index = 0, keyword;

    //if(length > 1){
        if(context){
            // start with context right away
            keyword = query_terms[0];
            index = 1;
        }
        // todo
        // else if(maxlength > 9 && (maxlength / minlength) > 3){
        //     // sorting terms will break the context chain
        //     // bigger terms has less occurrence
        //     // this might also reduce the intersection task
        //     // todo check intersection order
        //     query_terms.sort(sort_by_length_down);
        // }
    //}

    if(!resolution && resolution !== 0){
        resolution = keyword
            ? this.resolution_ctx
            : this.resolution;
    }

    // from this point there are just multi-term queries

    if(SUPPORT_PERSISTENT && this.db){

        if(this.db.search){
            // when the configuration is not supported it returns false
            const result = this.db.search(this, query_terms, limit, offset, suggest, resolve, enrich, tag);
            if(result !== false) return result;
        }

        const self = this;
        return (async function(){

            for(let arr, term; index < length; index++){

                term = query_terms[index];

                if(term && !dupes[term]){

                    dupes[term] = 1;
                    arr = await self.get_array(term, keyword, 0, 0, false, false);
                    arr = add_result(arr, /** @type {Array} */ (result), suggest, resolution);

                    if(arr){
                        result = arr;
                        break;
                    }

                    if(keyword){

                        // the context is a moving window where the keyword is going forward like a cursor
                        // 1. when suggestion enabled just forward keyword if term was found
                        // 2. as long as the result is empty forward the pointer also
                        if(!suggest || !arr || !result.length){
                            keyword = term;
                        }
                    }
                }

                // fallback to non-contextual search when no result was found
                if(suggest && keyword && (index === length - 1)){
                    if(!result.length){
                        resolution = self.resolution;
                        keyword = "";
                        index = -1;
                        dupes = create_object();
                    }
                }
            }

            return return_result(
                result,
                resolution,
                /** @type {!number} */ (limit),
                offset,
                suggest,
                boost,
                resolve
            );
        }());
    }

    for(let arr, term; index < length; index++){

        term = query_terms[index];

        // todo should the dupe check applied on [keyword:term]?
        if(term && !dupes[term]){

            dupes[term] = 1;
            arr = this.get_array(term, keyword, 0, 0, false, false);
            arr = add_result(arr,  /** @type {Array} */ (result), suggest, resolution);

            if(arr){
                result = arr;
                break;
            }

            if(keyword){
                // the context is a moving window where the keyword is going forward like a cursor
                // 1. when suggestion enabled just forward keyword if term was found
                // 2. as long as the result is empty forward the pointer also
                if(!suggest || !arr || !result.length){
                    keyword = term;
                }
            }
        }

        // fallback to non-contextual search when no result was found
        if(suggest && keyword && (index === length - 1)){
            if(!result.length){
                resolution = this.resolution;
                keyword = "";
                index = -1;
                dupes = create_object();
            }
        }
    }

    return return_result(
        result,
        resolution,
        /** @type {!number} */ (limit),
        offset,
        suggest,
        boost,
        resolve
    );
};

/**
 * @param {!Array<IntermediateSearchResults>} result
 * @param {number} resolution
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} suggest
 * @param {number=} boost
 * @param {boolean=} resolve
 * @return {
 *   SearchResults|EnrichedSearchResults|Resolver |
 *   Promise<SearchResults|EnrichedSearchResults|Resolver>
 * }
 */

function return_result(result, resolution, limit, offset, suggest, boost, resolve){

    let length = result.length;
    let final = result;

    if(length > 1){
        final = intersect(
            result,
            resolution,
            limit,
            offset,
            suggest,
            boost,
            resolve
        );
    }
    else if(length === 1){
        return !SUPPORT_RESOLVER || resolve
            ? resolve_default.call(null,
                result[0],
                limit,
                offset
            )
            : new Resolver(result[0], this);
    }

    return !SUPPORT_RESOLVER || resolve
        ? final
        : new Resolver(final, this);
}

/**
 * @param {!string} term
 * @param {string|null} keyword
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} resolve
 * @param {boolean=} enrich
 * @param {string=} tag
 * @this {Index}
 * @return {
 *   SearchResults|EnrichedSearchResults|Resolver |
 *   Promise<SearchResults|EnrichedSearchResults|Resolver>
 * }
 */

function single_term_query(term, keyword, limit, offset, resolve, enrich, tag){

    const result = this.get_array(
        term,
        keyword,
        limit,
        offset,
        resolve,
        enrich,
        tag
    );

    if(SUPPORT_PERSISTENT && this.db){
        return result.then(function(result){
            return !SUPPORT_RESOLVER || resolve
                ? result || []
                : new Resolver(result, this);
        });
    }

    return result && result.length
        ? (!SUPPORT_RESOLVER || resolve
            ? resolve_default.call(this, /** @type {SearchResults|EnrichedSearchResults} */ (result), limit, offset)
            : new Resolver(result, this)
        )
        : !SUPPORT_RESOLVER || resolve
            ? []
            : new Resolver([], this);
}

/**
 * Returns a 1-dimensional finalized array when the result is done (fast path return),
 * returns false when suggestions is enabled and no result was found,
 * or returns nothing when a set was pushed successfully to the results
 *
 * @private
 * @param {IntermediateSearchResults} arr
 * @param {Array<IntermediateSearchResults>} result
 * @param {boolean=} suggest
 * @param {number=} resolution
 * @return {Array|undefined}
 */

function add_result(arr, result, suggest, resolution){

    let word_arr = [];

    if(arr && arr.length){

        // short when resolution does not exceed:
        if(arr.length <= resolution){
            result.push(arr);
            // return nothing will continue the query
            return;
        }

        // apply reduced resolution for queries
        for(let x = 0, tmp; x < resolution; x++){
            if((tmp = arr[x])){
                word_arr[x] = tmp;
            }
        }

        if(word_arr.length){
            result.push(word_arr);
            // return nothing will continue the query
            return;
        }
    }

    // 1. return an empty array will stop the loop
    // 2. return a false value to prevent stop when using suggestions
    if(!suggest) return word_arr;
}

/**
 * @param {!string} term
 * @param {string|null} keyword
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} resolve
 * @param {boolean=} enrich
 * @param {string=} tag
 * @return {
 *   IntermediateSearchResults|EnrichedSearchResults |
 *   Promise<IntermediateSearchResults|EnrichedSearchResults>
 * }
 */
Index.prototype.get_array = function(term, keyword, limit, offset, resolve, enrich, tag){

    let arr, swap;

    if(keyword){
        swap = this.bidirectional && (term > keyword);
        if(swap){
            swap = keyword;
            keyword = term;
            term = swap;
        }
    }

    if(SUPPORT_COMPRESSION && this.compress){
        term = default_compress(term);
        keyword && (keyword = default_compress(keyword));
    }

    if(SUPPORT_PERSISTENT && this.db){
        return this.db.get(
            term,
            keyword,
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
        arr = this.ctx.get(keyword);
        arr = arr && arr.get(term);
    }
    else{
        arr = this.map.get(term);
    }

    return arr;
}
