

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
Index.prototype.search = function (query, limit, options) {

    if (!options) {
        if (!limit && "object" == typeof query) {
            options = /** @type {!SearchOptions} */query;
            query = "";
        } else if ("object" == typeof limit) {
            options = /** @type {!SearchOptions} */limit;
            limit = 0;
        }
    }

    if (options && options.cache) {
        options.cache = !1;
        const res = this.searchCache(query, limit, options);
        options.cache = !0;
        return res;
    }

    /** @type {!Array<IntermediateSearchResults>} */
    let result = [],
        length,
        context,
        suggest,
        offset = 0,
        resolve,
        tag,
        boost,
        resolution,
        enrich;


    if (options) {
        query = options.query || query;
        limit = options.limit || limit;
        offset = options.offset || 0;
        context = options.context;
        suggest = options.suggest;
        resolve = options.resolve;
        enrich = resolve && options.enrich;
        boost = options.boost;
        resolution = options.resolution;
        tag = this.db && options.tag;
    }

    if ("undefined" == typeof resolve) {
        resolve = this.resolve;
    }

    context = this.depth && !1 !== context;

    /** @type {Array<string>} */
    let query_terms = this.encoder.encode(query, !context);
    length = query_terms.length;
    limit = /** @type {!number} */limit || (resolve ? 100 : 0);

    if (1 === length) {
        return single_term_query.call(this, query_terms[0], "", limit, offset, resolve, enrich, tag);
    }

    if (2 === length && context && !suggest) {
        return single_term_query.call(this, query_terms[1], query_terms[0], limit, offset, resolve, enrich, tag);
    }

    let dupes = create_object(),
        index = 0,
        keyword;


    if (context) {

        keyword = query_terms[0];
        index = 1;
    }

    if (!resolution && 0 !== resolution) {
        resolution = keyword ? this.resolution_ctx : this.resolution;
    }

    if (this.db) {

        if (this.db.search) {

            const result = this.db.search(this, query_terms, limit, offset, suggest, resolve, enrich, tag);
            if (!1 !== result) return result;
        }

        const self = this;
        return async function () {

            for (let arr, term; index < length; index++) {

                term = query_terms[index];

                if (term && !dupes[term]) {

                    dupes[term] = 1;
                    arr = await self._get_array(term, keyword, 0, 0, !1, !1);
                    arr = add_result(arr, /** @type {Array} */result, suggest, resolution);

                    if (arr) {
                        result = arr;
                        break;
                    }

                    if (keyword) {

                        if (!suggest || !arr || !result.length) {
                            keyword = term;
                        }
                    }
                }

                if (suggest && keyword && index == length - 1) {
                    if (!result.length) {
                        resolution = self.resolution;
                        keyword = "";
                        index = -1;
                        dupes = create_object();
                    }
                }
            }

            return return_result(result, resolution,
            /** @type {!number} */limit, offset, suggest, boost, resolve);
        }();
    }

    for (let arr, term; index < length; index++) {

        term = query_terms[index];

        if (term && !dupes[term]) {

            dupes[term] = 1;
            arr = this._get_array(term, keyword, 0, 0, !1, !1);
            arr = add_result(arr, /** @type {Array} */result, suggest, resolution);

            if (arr) {
                result = arr;
                break;
            }

            if (keyword) {

                if (!suggest || !arr || !result.length) {
                    keyword = term;
                }
            }
        }

        if (suggest && keyword && index == length - 1) {
            if (!result.length) {
                resolution = this.resolution;
                keyword = "";
                index = -1;
                dupes = create_object();
            }
        }
    }

    return return_result(result, resolution,
    /** @type {!number} */limit, offset, suggest, boost, resolve);
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

function return_result(result, resolution, limit, offset, suggest, boost, resolve) {
    let length = result.length,
        final = result;


    if (1 < length) {
        final = intersect(result, resolution, limit, offset, suggest, boost, resolve);
    } else if (1 === length) {
        return resolve ? resolve_default.call(null, result[0], limit, offset) : new Resolver(result[0], this);
    }

    return resolve ? final : new Resolver(final, this);
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

function single_term_query(term, keyword, limit, offset, resolve, enrich, tag) {

    const result = this._get_array(term, keyword, limit, offset, resolve, enrich, tag);

    if (this.db) {
        return result.then(function (result) {
            return resolve ? result || [] : new Resolver(result, this);
        });
    }

    return result && result.length ? resolve ? resolve_default.call(this, /** @type {SearchResults|EnrichedSearchResults} */result, limit, offset) : new Resolver(result, this) : resolve ? [] : new Resolver([], this);
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

function add_result(arr, result, suggest, resolution) {

    let word_arr = [];

    if (arr && arr.length) {

        if (arr.length <= resolution) {
            result.push(arr);

            return;
        }

        for (let x = 0, tmp; x < resolution; x++) {
            if (tmp = arr[x]) {
                word_arr[x] = tmp;
            }
        }

        if (word_arr.length) {
            result.push(word_arr);

            return;
        }
    }

    if (!suggest) return word_arr;
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
Index.prototype._get_array = function (term, keyword, limit, offset, resolve, enrich, tag) {

    let arr, swap;

    if (keyword) {
        swap = this.bidirectional && term > keyword;
        if (swap) {
            swap = keyword;
            keyword = term;
            term = swap;
        }
    }

    if (this.compress) {
        term = default_compress(term);
        keyword && (keyword = default_compress(keyword));
    }

    if (this.db) {
        return this.db.get(term, keyword, limit, offset, resolve, enrich, tag);
    }

    if (keyword) {

        arr = this.ctx.get(keyword);
        arr = arr && arr.get(term);
    } else {
        arr = this.map.get(term);
    }

    return arr;
};