
import { DocumentSearchOptions, DocumentSearchResults, EnrichedDocumentSearchResults, MergedDocumentSearchResults, MergedDocumentSearchEntry, EnrichedSearchResults, SearchResults, IntermediateSearchResults } from "../type.js";
import { create_object, is_array, is_object, is_string } from "../common.js";
import { intersect_union } from "../intersect.js";
import Document from "../document.js";
import Index from "../index.js";
import Resolver from "../resolver.js";
import tick from "../profiler.js";
import { highlight_fields } from "./highlight.js";

/**
 * @param {!string|DocumentSearchOptions} query
 * @param {number|DocumentSearchOptions=} limit
 * @param {DocumentSearchOptions=} options
 * @param {Array<Array>=} _promises async recursion
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

    if (options && options.cache) {
        options.cache = /* suggest */ /* append: */ /* enrich */!1;
        const res = this.searchCache(query, limit, options);
        options.cache = /* tag? */ /* stringify */ /* stringify */ /* single param */ /* skip update: */ /* append: */ /* skip update: */ /* skip_update: */!0 /*await rows.hasNext()*/ /*await rows.hasNext()*/ /*await rows.hasNext()*/;
        return res;
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
        field = pluck || options.field || (field = options.index) && (field.index ? null : field);
        tag = this.tag && options.tag;
        suggest = options.suggest;
        resolve = !1 !== options.resolve;

        // upgrade pluck when missing
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
        }

        highlight = resolve && this.store && options.highlight;
        enrich = !!highlight || resolve && this.store && options.enrich;
        limit = options.limit || limit;
        offset = options.offset || 0;
        limit || (limit = 100);

        if (tag && (!this.db || !_promises)) {

            if (tag.constructor !== Array) {
                tag = [tag];
            }

            // -----------------------------
            // Tag-Search
            // -----------------------------

            let pairs = [];

            for (let i = 0, field; i < tag.length; i++) {
                field = tag[i];

                // default array notation
                if (field.field && field.tag) {
                    const value = field.tag;
                    if (value.constructor === Array) {
                        for (let k = 0; k < value.length; k++) {
                            pairs.push(field.field, value[k]);
                        }
                    } else {
                        pairs.push(field.field, value);
                    }
                }
                // shorter object notation
                else {
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

            // tag used as pairs from this point
            tag = pairs;

            // when tags is used and no query was set,
            // then just return the tag indexes
            if (!query) {

                let promises = [];
                if (pairs.length) for (let j = 0; j < pairs.length; j += 2) {
                    let ids;
                    if (this.db) {
                        const index = this.index.get(pairs[j]);
                        if (!index) {
                            continue;
                        }

                        promises.push(ids = index.db.tag(pairs[j + 1], limit, offset, enrich));
                    } else {
                        ids = get_tag.call(this, pairs[j], pairs[j + 1], limit, offset, enrich);
                    }
                    result.push({
                        field: pairs[j],
                        tag: pairs[j + 1],
                        result: ids
                    });
                }

                if (promises.length) {
                    return Promise.all(promises).then(function (promises) {
                        for (let j = 0; j < promises.length; j++) {
                            result[j].result = promises[j];
                        }
                        return result;
                    });
                }

                return result;
            }
        }

        // extend to multi field search by default
        if (field && field.constructor !== Array) {
            field = [field];
        }
    }

    field || (field = this.field);

    let db_tag_search,
        promises = (this.worker || this.db /*||
                                           (SUPPORT_ASYNC && this.async)*/
    ) && !_promises && [];


    // multi field search
    // field could be a custom set of selected fields by this query
    // db tag indexes are also included in this field list
    for (let i = 0, res, key, len; i < field.length; i++) {

        key = field[i];

        if (this.db && this.tag) {
            // tree is missing when it is a tag-only index (db)
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
        }

        if (_promises) {
            res = _promises[i];
        } else {
            let opt = field_options || options,
                index = this.index.get(key);


            if (tag) {
                if (this.db) {
                    opt.tag = tag;
                    db_tag_search = index.db.support_tag_search;
                    opt.field = field;
                }
                if (!db_tag_search) {
                    opt.enrich = !1;
                }
            }
            if (promises) {
                promises[i] = index.search /*Async*/(query, limit, opt);
                // restore enrich state
                opt && enrich && (opt.enrich = enrich);
                // just collect and continue
                continue;
            } else {
                res = index.search(query, limit, opt);
                // restore enrich state
                opt && enrich && (opt.enrich = enrich);
            }
        }

        len = res && (resolve ? res.length : res.result.length);

        // todo when no term was matched but tag was retrieved extend suggestion to tags
        // every field has to intersect against all selected tag fields
        if (tag && len) {

            const arr = [];
            let count = 0;

            // tags are only applied in resolve phase when it's a db
            if (this.db && _promises) {
                if (!db_tag_search) {

                    // retrieve tag results assigned to it's field
                    for (let y = field.length; y < _promises.length; y++) {
                        let ids = _promises[y],
                            len = ids && ids.length;


                        if (len) {
                            count++;
                            arr.push(ids);
                        } else if (!suggest) {
                            // no tags found
                            return resolve || !!0 ? result : new Resolver(result);
                        }
                    }
                }
            } else {

                // tag[] are pairs at this line
                for (let y = 0, ids, len; y < tag.length; y += 2) {
                    ids = this.tag.get(tag[y]);

                    if (!ids) {
                        if (suggest) {
                            continue;
                        } else {
                            return resolve || !!0 ? result : new Resolver(result);
                        }
                    }

                    ids = ids && ids.get(tag[y + 1]);
                    len = ids && ids.length;

                    if (len) {
                        count++;
                        arr.push(ids);
                    } else if (!suggest) {
                        // no tags found
                        return resolve || !!0 ? result : new Resolver(result);
                    }
                }
            }

            if (count) {
                res = intersect_union(res, arr, resolve); // intersect(arr, limit, offset)
                len = res.length;
                if (!len && !suggest) {
                    // nothing matched
                    return resolve || !!0 ? res : new Resolver( /** @type {IntermediateSearchResults} */res);
                }
                // move counter back by 1
                count--;
            }
        }

        if (len) {
            result_field[count] = key;
            result.push(res);
            count++;
        } else if (1 === field.length) {
            // fast path: nothing matched
            return resolve || !!0 ? result : new Resolver(result);
        }
    }

    if (promises) {
        if (this.db) {
            // todo when a tag index is never a search index this could be extracted
            // push tag promises to the end
            if (tag && tag.length && !db_tag_search) {
                for (let y = 0; y < tag.length; y += 2) {
                    // it needs to retrieve data from tag pairs
                    const index = this.index.get(tag[y]);
                    if (!index) {
                        if (suggest) {
                            continue;
                        } else {
                            return resolve || !!0 ? result : new Resolver(result);
                        }
                    }

                    promises.push(index.db.tag(tag[y + 1], limit, offset, !1));
                }
            }
        }

        const self = this;

        // TODO unroll this recursion
        return Promise.all(promises).then(function (result) {
            return result.length ? self.search(query, limit, options, /* promises: */result) : result;
        });
    }

    if (!count) {
        return resolve || !!0 ? result : new Resolver(result);
    }
    if (pluck && (!enrich || !this.store)) {
        return (/** @type {SearchResults} */result[0]
        );
    }

    promises = [];

    for (let i = 0, res; i < result_field.length; i++) {

        /** @type {SearchResults|EnrichedSearchResults} */
        res = result[i];


        if (enrich && res.length && "undefined" == typeof res[0].doc) {
            if (!this.db) {
                // if(res.length){
                res = apply_enrich.call(this, res);
                // }
            } else {
                // todo
                // the documents are stored on the first field
                promises.push(res = this.index.get(this.field[0]).db.enrich(res));
            }
        }

        if (pluck) {
            return resolve || !!0 ? highlight ? highlight_fields( /** @type {string} */query, res, this.index, pluck, highlight) : /** @type {SearchResults|EnrichedSearchResults} */res : new Resolver( /** @type {IntermediateSearchResults} */res);
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
            return merge ? merge_fields(result) : highlight ? highlight_fields( /** @type {string} */query, result, self.index, pluck, highlight) : /** @type {DocumentSearchResults} */result;
        });
    }

    return merge ? merge_fields(result) : highlight ? highlight_fields( /** @type {string} */query, result, this.index, pluck, highlight) : /** @type {DocumentSearchResults} */result;
};

function inherit(target_value, default_value) {
    return "undefined" == typeof target_value ? default_value : target_value;
}

// todo support Resolver
// todo when searching through multiple fields each term should
//      be found at least by one field to get a valid match without
//      using suggestion explicitly

/**
 * @param {DocumentSearchResults} fields
 * @return {MergedDocumentSearchResults}
 */
function merge_fields(fields) {
    /** @type {MergedDocumentSearchResults} */
    const final = [],
          set = create_object();

    for (let i = 0, field, res; i < fields.length; i++) {
        field = fields[i];
        res = field.result;
        for (let j = 0, id, entry, tmp; j < res.length; j++) {
            entry = res[j];
            // upgrade flat results
            if ("object" != typeof entry) {
                entry = { id: entry };
            }
            id = entry.id;
            tmp = set[id];
            if (!tmp) {
                entry.field = set[id] = [field.field];
                final.push( /** @type {MergedDocumentSearchEntry} */entry);
            } else {
                tmp.push(field.field);
            }
        }
    }
    return final;
}

/**
 * @this {Document}
 */

function get_tag(tag, key, limit, offset) {
    let res = this.tag.get(tag);
    if (!res) {
        return [];
    }
    res = res && res.get(key);
    res && res.length - offset;
}

/**
 * @param {SearchResults} ids
 * @return {EnrichedSearchResults|SearchResults}
 * @this {Document|Index|null}
 */

export function apply_enrich(ids) {

    if (!this || !this.store) return ids;

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