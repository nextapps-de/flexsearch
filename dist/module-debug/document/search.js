
import { DocumentSearchOptions, DocumentSearchResults, EnrichedDocumentSearchResults, MergedDocumentSearchResults, MergedDocumentSearchEntry, EnrichedSearchResults, SearchResults, IntermediateSearchResults } from "../type.js";
import { create_object, is_array, is_object, is_string, inherit } from "../common.js";
import { intersect, intersect_union } from "../intersect.js";
import Document from "../document.js";
import Index from "../index.js";
import WorkerIndex from "../worker.js";
import Resolver from "../resolver.js";
import tick from "../profiler.js";
import { highlight_fields } from "./highlight.js";

/**
 * @param {!string|DocumentSearchOptions} query
 * @param {number|DocumentSearchOptions=} limit
 * @param {DocumentSearchOptions=} options
 * @param {Array<Array>=} _promises async recursion
 * @this Document
 * @returns {
 *   DocumentSearchResults|
 *   EnrichedDocumentSearchResults|
 *   MergedDocumentSearchResults|
 *   SearchResults|
 *   IntermediateSearchResults|
 *   EnrichedSearchResults|
 *   Resolver |
 *   Promise<
 *     DocumentSearchResults|
 *     EnrichedDocumentSearchResults|
 *     MergedDocumentSearchResults|
 *     SearchResults|
 *     IntermediateSearchResults|
 *     EnrichedSearchResults|
 *     Resolver
 *   >
 * }
 */
Document.prototype.search = function (query, limit, options, _promises) {

    if (!options) {
        if (!limit && is_object(query)) {
            options = /** @type {DocumentSearchOptions} */query;
            query = "";
        } else if (is_object(limit)) {
            options = /** @type {DocumentSearchOptions} */limit;
            limit = 0;
        }
    }

    /** @type {
     *   DocumentSearchResults|
     *   EnrichedDocumentSearchResults|
     *   MergedDocumentSearchResults|
     *   SearchResults|
     *   IntermediateSearchResults|
     *   EnrichedSearchResults
     * } */
    let result = [],
        result_field = [],
        pluck,
        enrich,
        merge,
        suggest,
        boost,
        cache,
        field,
        tag,
        offset,
        count = 0,
        resolve = !0,
        highlight;


    if (options) {

        if (is_array(options)) {
            options = /** @type DocumentSearchOptions */{
                index: options
            };
        }

        query = options.query || query;
        pluck = options.pluck;
        merge = options.merge;
        boost = options.boost;
        field = pluck || options.field || (field = options.index) && (field.index ? null : field);
        tag = this.tag && options.tag;
        suggest = options.suggest;
        resolve = !1 !== options.resolve;
        cache = options.cache;

        if (this.store && options.highlight && !resolve) {
            console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })");
        } else if (this.store && options.enrich && !resolve) {
            console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
        }


        highlight = resolve && this.store && options.highlight;
        enrich = !!highlight || resolve && this.store && options.enrich;
        limit = options.limit || limit;
        offset = options.offset || 0;
        limit || (limit = resolve ? 100 : 0);

        if (tag && (!this.db || !_promises)) {

            if (tag.constructor !== Array) {
                tag = [tag];
            }

            let pairs = [];

            for (let i = 0, field; i < tag.length; i++) {
                field = tag[i];
                if (is_string(field)) {
                    throw new Error("A tag option can't be a string, instead it needs a { field: tag } format.");
                }

                if (field.field && field.tag) {
                    const value = field.tag;
                    if (value.constructor === Array) {
                        for (let k = 0; k < value.length; k++) {
                            pairs.push(field.field, value[k]);
                        }
                    } else {
                        pairs.push(field.field, value);
                    }
                } else {
                    const keys = Object.keys(field);
                    for (let j = 0, key, value; j < keys.length; j++) {
                        key = keys[j];
                        value = field[key];
                        if (value.constructor === Array) {
                            for (let k = 0; k < value.length; k++) {
                                pairs.push(key, value[k]);
                            }
                        } else {
                            pairs.push(key, value);
                        }
                    }
                }
            }

            if (!pairs.length) {
                throw new Error("Your tag definition within the search options is probably wrong. No valid tags found.");
            }

            tag = pairs;

            if (!query) {

                let promises = [];
                if (pairs.length) for (let j = 0; j < pairs.length; j += 2) {
                    let ids;
                    if (this.db) {
                        const index = this.index.get(pairs[j]);
                        if (!index) {
                            console.warn("Tag '" + pairs[j] + ":" + pairs[j + 1] + "' will be skipped because there is no field '" + pairs[j] + "'.");

                            continue;
                        }

                        promises.push(ids = index.db.tag(pairs[j + 1], limit, offset, enrich));
                    } else {
                        ids = get_tag.call(this, pairs[j], pairs[j + 1], limit, offset, enrich);
                    }
                    result.push(resolve ? {
                        field: pairs[j],
                        tag: pairs[j + 1],
                        result: ids
                    } : [ids]);
                }

                if (promises.length) {
                    const self = this;
                    return Promise.all(promises).then(function (promises) {
                        for (let j = 0; j < promises.length; j++) {
                            if (resolve) {
                                result[j].result = promises[j];
                            } else {
                                result[j] = promises[j];
                            }
                        }
                        return resolve ? result : new Resolver(1 < result.length ? intersect( /** @type {!Array<IntermediateSearchResults>} */result, 1, 0, 0, suggest, boost) : result[0], self);
                    });
                }

                return resolve ? result : new Resolver(1 < result.length ? intersect( /** @type {!Array<IntermediateSearchResults>} */result, 1, 0, 0, suggest, boost) : result[0], this);
            }
        }

        if (!resolve && !pluck) {
            field = field || this.field;
            if (field) {
                if (is_string(field)) {
                    pluck = field;
                } else {
                    if (is_array(field) && 1 === field.length) {
                        field = field[0];
                    }
                    pluck = field.field || field.index;
                }
            }
            if (!pluck) {
                throw new Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
            }
        }

        if (field && field.constructor !== Array) {
            field = [field];
        }
    }

    field || (field = this.field);

    let db_tag_search,
        promises = (this.worker || this.db /*||
                                           (SUPPORT_ASYNC && this.async)*/
    ) && !_promises && [];


    for (let i = 0, res, key, len; i < field.length; i++) {

        key = field[i];

        if (this.db && this.tag) {

            if (!this.tree[i]) {
                continue;
            }
        }

        let field_options;

        if (!is_string(key)) {
            field_options = key;
            key = field_options.field;
            query = field_options.query || query;
            limit = inherit(field_options.limit, limit);
            offset = inherit(field_options.offset, offset);
            suggest = inherit(field_options.suggest, suggest);
            highlight = resolve && this.store && inherit(field_options.highlight, highlight);
            enrich = !!highlight || resolve && this.store && inherit(field_options.enrich, enrich);
            cache = inherit(field_options.cache, cache);
        }

        if (_promises) {
            res = _promises[i];
        } else {
            const opt = field_options || options || {},
                  opt_enrich = opt.enrich,
                  index = this.index.get(key);


            if (tag) {
                if (this.db) {
                    opt.tag = tag;
                    db_tag_search = index.db.support_tag_search;
                    opt.field = field;
                }
                if (!db_tag_search && opt_enrich) {
                    opt.enrich = !1;
                }
            }

            res = cache ? index.searchCache(query, limit, opt) : index.search(query, limit, opt);

            if (opt_enrich) {
                opt.enrich = opt_enrich;
            }

            if (promises) {
                promises[i] = res;

                continue;
            }
        }

        res = res.result || res;
        len = res && res.length;

        if (tag && len) {

            const arr = [];
            let count = 0;

            if (this.db && _promises) {
                if (!db_tag_search) {

                    for (let y = field.length; y < _promises.length; y++) {
                        let ids = _promises[y],
                            len = ids && ids.length;


                        if (len) {
                            count++;
                            arr.push(ids);
                        } else if (!suggest) {

                            return resolve ? result : new Resolver(result, this);
                        }
                    }
                }
            } else {

                for (let y = 0, ids, len; y < tag.length; y += 2) {
                    ids = this.tag.get(tag[y]);

                    if (!ids) {
                        console.warn("Tag '" + tag[y] + ":" + tag[y + 1] + "' will be skipped because there is no field '" + tag[y] + "'.");

                        if (suggest) {
                            continue;
                        } else {
                            return resolve ? result : new Resolver(result, this);
                        }
                    }

                    ids = ids && ids.get(tag[y + 1]);
                    len = ids && ids.length;

                    if (len) {
                        count++;
                        arr.push(ids);
                    } else if (!suggest) {

                        return resolve ? result : new Resolver(result, this);
                    }
                }
            }

            if (count) {
                res = intersect_union( /** @type {IntermediateSearchResults} */res, arr, resolve);
                len = res.length;
                if (!len && !suggest) {

                    return resolve ? res : new Resolver( /** @type {IntermediateSearchResults} */res, this);
                }

                count--;
            }
        }

        if (len) {
            result_field[count] = key;
            result.push(res);
            count++;
        } else if (1 === field.length) {

            return resolve ? result : new Resolver(result, this);
        }
    }

    if (promises) {
        if (this.db) {

            if (tag && tag.length && !db_tag_search) {
                for (let y = 0; y < tag.length; y += 2) {

                    const index = this.index.get(tag[y]);
                    if (!index) {
                        console.warn("Tag '" + tag[y] + ":" + tag[y + 1] + "' was not found because there is no field '" + tag[y] + "'.");

                        if (suggest) {
                            continue;
                        } else {
                            return resolve ? result : new Resolver(result, this);
                        }
                    }

                    promises.push(index.db.tag(tag[y + 1], limit, offset, !1));
                }
            }
        }

        const self = this;

        return Promise.all(promises).then(function (result) {

            options && (options.resolve = resolve);
            if (result.length) {
                result = self.search(query, limit, options, result);
            }
            return result;
        });
    }

    if (!count) {
        return resolve ? result : new Resolver(result, this);
    }
    if (pluck && (!enrich || !this.store)) {
        result = /** @type {SearchResults|IntermediateSearchResults} */result[0];
        return resolve ? result : new Resolver(result, this);
    }

    promises = [];

    for (let i = 0, res; i < result_field.length; i++) {

        /** @type {SearchResults|EnrichedSearchResults} */
        res = result[i];


        if (enrich && res.length && "undefined" == typeof res[0].doc) {
            if (!this.db) {

                res = /** @type {EnrichedSearchResults} */apply_enrich.call(this, res);
            } else {

                promises.push(res = this.index.get(this.field[0]).db.enrich(res));
            }
        }

        if (pluck) {
            return resolve ? highlight ? highlight_fields( /** @type {string} */query, res, this.index, pluck, highlight) : /** @type {SearchResults|EnrichedSearchResults} */res : new Resolver( /** @type {IntermediateSearchResults} */res, this);
        }

        result[i] = {
            field: result_field[i],
            result: /** @type {SearchResults|EnrichedSearchResults} */res
        };
    }

    if (enrich && !0 && this.db && promises.length) {
        const self = this;
        return Promise.all(promises).then(function (promises) {
            for (let j = 0; j < promises.length; j++) {
                result[j].result = promises[j];
            }
            if (highlight) {
                result = highlight_fields( /** @type {string} */query, result, self.index, pluck, highlight);
            }
            return merge ? merge_fields(result) : /** @type {DocumentSearchResults} */result;
        });
    }

    if (highlight) {
        result = highlight_fields( /** @type {string} */query, result, this.index, pluck, highlight);
    }
    return merge ? merge_fields(result) : /** @type {DocumentSearchResults} */result;
};

/**
 * @param {DocumentSearchResults} fields
 * @return {MergedDocumentSearchResults}
 */
function merge_fields(fields) {
    /** @type {MergedDocumentSearchResults} */
    const final = [],
          group_field = create_object(),
          group_highlight = create_object();

    for (let i = 0, field, key, res, id, entry, tmp, highlight; i < fields.length; i++) {
        field = fields[i];
        key = field.field;
        res = field.result;
        for (let j = 0; j < res.length; j++) {
            entry = res[j];

            "object" != typeof entry ? entry = { id: id = entry } : id = entry.id;
            tmp = group_field[id];
            if (!tmp) {
                entry.field = group_field[id] = [key];
                final.push( /** @type {!MergedDocumentSearchEntry} */entry);
            } else {
                tmp.push(key);
            }
            if (highlight = entry.highlight) {
                tmp = group_highlight[id];
                if (!tmp) {
                    group_highlight[id] = tmp = {};
                    entry.highlight = tmp;
                }
                tmp[key] = highlight;
            }
        }
    }
    return final;
}

/**
 * @this {Document}
 */

function get_tag(tag, key, limit, offset, enrich) {

    let res = this.tag.get(tag);
    if (!res) return [];
    res = res.get(key);
    if (!res) return [];
    let len = res.length - offset;

    if (0 < len) {
        if (limit && len > limit || offset) {
            res = res.slice(offset, offset + limit);
        }
        if (enrich) {
            res = apply_enrich.call(this, res);
        }
    }

    return res;
}

/**
 * @param {SearchResults} ids
 * @return {EnrichedSearchResults|SearchResults|Promise<EnrichedSearchResults|SearchResults>}
 * @this {Document|Index|WorkerIndex|null}
 */
export function apply_enrich(ids) {

    if (!this || !this.store) return ids;

    if (this.db) {
        return this.index.get(this.field[0]).db.enrich(ids);
    }

    /** @type {EnrichedSearchResults} */
    const result = Array(ids.length);
    for (let x = 0, id; x < ids.length; x++) {
        id = ids[x];
        result[x] = {
            id: id,
            doc: this.store.get(id)
        };
    }

    return result;
}