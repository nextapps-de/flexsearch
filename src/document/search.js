// COMPILER BLOCK -->
import {
    DEBUG,
    PROFILER,
    SUPPORT_CACHE,
    SUPPORT_HIGHLIGHTING,
    SUPPORT_PERSISTENT,
    SUPPORT_RESOLVER,
    SUPPORT_STORE,
    SUPPORT_SUGGESTION,
    SUPPORT_TAGS,
    SUPPORT_WORKER
} from "../config.js";
// <-- COMPILER BLOCK
import {
    DocumentSearchOptions,
    DocumentSearchResults,
    EnrichedDocumentSearchResults,
    MergedDocumentSearchResults,
    MergedDocumentSearchEntry,
    EnrichedSearchResults,
    SearchResults,
    IntermediateSearchResults
} from "../type.js";
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
Document.prototype.search = function(query, limit, options, _promises){

    PROFILER && tick("Document.search:" + !!_promises);

    if(!options){
        if(!limit && is_object(query)){
            options = /** @type {DocumentSearchOptions} */ (query);
            query = "";
        }
        else if(is_object(limit)){
            options = /** @type {DocumentSearchOptions} */ (limit);
            limit = 0;
        }
    }

    // if(SUPPORT_CACHE && options && options.cache){
    //     options.cache = false;
    //     const res = this.searchCache(query, limit, options);
    //     options.cache = true;
    //     return res;
    // }

    /** @type {
     *   DocumentSearchResults|
     *   EnrichedDocumentSearchResults|
     *   MergedDocumentSearchResults|
     *   SearchResults|
     *   IntermediateSearchResults|
     *   EnrichedSearchResults
     * } */
    let result = [];
    let result_field = [];
    let pluck, enrich, merge, suggest, boost, cache;
    let field, tag, offset, count = 0, resolve = true, highlight;

    if(options){

        if(is_array(options)){
            options = /** @type DocumentSearchOptions */ ({
                index: options
            });
        }

        query = options.query || query;
        pluck = options.pluck;
        merge = options.merge;
        boost = options.boost;
        field = pluck || options.field || ((field = options.index) && (field.index ? null : field));
        tag = SUPPORT_TAGS && this.tag && options.tag;
        suggest = SUPPORT_SUGGESTION && options.suggest;
        resolve = !SUPPORT_RESOLVER || (options.resolve !== false);
        cache = SUPPORT_CACHE && options.cache;

        if(DEBUG){
            if(SUPPORT_STORE && this.store && options.highlight && !resolve){
                console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })");
            }
            else if(SUPPORT_STORE && this.store && options.enrich && !resolve){
                console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
            }
        }

        highlight = SUPPORT_STORE && SUPPORT_HIGHLIGHTING && resolve && this.store && options.highlight;
        enrich = SUPPORT_STORE && (!!highlight || (resolve && this.store && options.enrich));
        limit = options.limit || limit;
        offset = options.offset || 0;
        limit || (limit = (resolve ? 100 : 0));

        if(tag && (!SUPPORT_PERSISTENT || !this.db || !_promises)){

            // -----------------------------
            // Tag-Search
            // -----------------------------

            PROFILER && tick("Document.search:tag");

            if(tag.constructor !== Array){
                tag = [tag];
            }

            let pairs = [];

            for(let i = 0, field; i < tag.length; i++){
                field = tag[i];
                if(DEBUG && is_string(field)){
                    throw new Error("A tag option can't be a string, instead it needs a { field: tag } format.");
                }
                // default array notation
                if(field.field && field.tag){
                    const value = field.tag;
                    if(value.constructor === Array){
                        for(let k = 0; k < value.length; k++){
                            pairs.push(field.field, value[k]);
                        }
                    }
                    else{
                        pairs.push(field.field, value);
                    }
                }
                // shorter object notation
                else{
                    const keys = Object.keys(field);
                    for(let j = 0, key, value; j < keys.length; j++){
                        key = keys[j];
                        value = field[key];
                        if(value.constructor === Array){
                            for(let k = 0; k < value.length; k++){
                                pairs.push(key, value[k]);
                            }
                        }
                        else{
                            pairs.push(key, value);
                        }
                    }
                }
            }

            if(DEBUG && !pairs.length){
                throw new Error("Your tag definition within the search options is probably wrong. No valid tags found.");
            }

            // tag used as pairs from this point
            tag = pairs;

            // when tags is used and no query was set,
            // then just return the tag indexes
            if(!query){

                let promises = [];
                if(pairs.length) for(let j = 0; j < pairs.length; j+=2){
                    let ids;
                    if(SUPPORT_PERSISTENT && this.db){
                        const index = this.index.get(pairs[j]);
                        if(!index){
                            if(DEBUG){
                                console.warn("Tag '" + pairs[j] + ":" + pairs[j + 1] + "' will be skipped because there is no field '" + pairs[j] + "'.");
                            }
                            continue;
                        }
                        PROFILER && tick("Document.search:tag:get:" + pairs[j + 1]);
                        promises.push(ids = index.db.tag(pairs[j + 1], limit, offset, enrich));
                    }
                    else{
                        PROFILER && tick("Document.search:tag:get:" + pairs[j + 1]);
                        ids = get_tag.call(this, pairs[j], pairs[j + 1], limit, offset, enrich);
                    }
                    result.push(!SUPPORT_RESOLVER || resolve ? {
                        "field": pairs[j],
                        "tag": pairs[j + 1],
                        "result": ids
                    } : [ids]);
                }

                if(promises.length){
                    const self = this;
                    return Promise.all(promises).then(function(promises){
                        for(let j = 0; j < promises.length; j++){
                            if(!SUPPORT_RESOLVER || resolve){
                                result[j]["result"] = promises[j];
                            }
                            else{
                                result[j] = promises[j];
                            }
                        }
                        return !SUPPORT_RESOLVER || resolve
                            ? result
                            : new Resolver(result.length > 1
                                ? intersect(/** @type {!Array<IntermediateSearchResults>} */ (result), 1, 0, 0, suggest, boost)
                                : result[0], self)
                    });
                }

                return !SUPPORT_RESOLVER || resolve
                    ? result
                    : new Resolver(result.length > 1
                        ? intersect(/** @type {!Array<IntermediateSearchResults>} */ (result), 1, 0, 0, suggest, boost)
                        : result[0], this)
            }
        }

        // upgrade pluck for resolver when missing
        if(SUPPORT_RESOLVER && !resolve && !pluck){
            field = field || this.field;
            if(field){
                if(is_string(field)){
                    pluck = field;
                }
                else{
                    if(is_array(field) && field.length === 1){
                        field = field[0];
                    }
                    pluck = field.field || field.index;
                }
            }
            if(DEBUG && !pluck){
                throw new Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
            }
        }

        // extend to multi field search by default
        if(field && field.constructor !== Array){
            field = [field];
        }
    }

    field || (field = this.field);

    let db_tag_search;
    let promises = (
        (SUPPORT_WORKER && this.worker) ||
        (SUPPORT_PERSISTENT && this.db) /*||
        (SUPPORT_ASYNC && this.async)*/
    ) && !_promises && [];

    // multi field search
    // field could be a custom set of selected fields by this query
    // db tag indexes are also included in this field list
    for(let i = 0, res, key, len; i < field.length; i++){

        key = field[i];

        if(SUPPORT_PERSISTENT && SUPPORT_TAGS && this.db && this.tag){
            // tree is missing when it is a tag-only index (db)
            if(!this.tree[i]){
                continue;
            }
        }

        let field_options;

        if(!is_string(key)){
            field_options = key;
            key = field_options.field;
            query = field_options.query || query;
            limit = inherit(field_options.limit, limit);
            offset = inherit(field_options.offset, offset);
            suggest = SUPPORT_SUGGESTION && inherit(field_options.suggest, suggest);
            highlight = SUPPORT_STORE && SUPPORT_HIGHLIGHTING && resolve && this.store && inherit(field_options.highlight, highlight);
            enrich = SUPPORT_STORE && (!!highlight || (resolve && this.store && inherit(field_options.enrich, enrich)));
            cache = SUPPORT_CACHE && inherit(field_options.cache, cache);
        }

        if(_promises){
            res = _promises[i];
        }
        else{
            PROFILER && tick("Document.search:get:" + key);
            const opt = field_options || options || {};
            const opt_enrich = opt.enrich;
            const index = this.index.get(key);

            if(tag){
                if(SUPPORT_PERSISTENT && this.db){
                    opt.tag = tag;
                    db_tag_search = index.db.support_tag_search;
                    opt.field = field;
                }
                if(!db_tag_search && opt_enrich){
                    opt.enrich = false;
                }
            }

            // TODO merge sorted by score
            // TODO add score property to results
            // if(merge){
            //     opt.resolve = false;
            // }

            res = cache
                ? index.searchCache(query, limit, opt)
                : index.search(query, limit, opt);

            // restore state
            // if(merge){
            //     opt.resolve = resolve;
            // }
            if(opt_enrich) {
                opt.enrich = opt_enrich;
            }

            if(promises){
                promises[i] = res;
                // collect and continue
                continue;
            }
        }

        res = res.result || res;
        len = res && res.length;

        // todo when no term was matched but tag was retrieved extend suggestion to tags
        // every field has to intersect against all selected tag fields
        if(tag && len){

            const arr = [];
            let count = 0;

            // tags are only applied in resolve phase when it's a db
            if(SUPPORT_PERSISTENT && this.db && _promises){
                if(!db_tag_search){

                    // retrieve tag results assigned to it's field
                    for(let y = field.length; y < _promises.length; y++){

                        let ids = _promises[y];
                        let len = ids && ids.length;

                        if(len){
                            count++;
                            arr.push(ids);
                        }
                        else if(!suggest){
                            // no tags found
                            return !SUPPORT_RESOLVER || resolve
                                ? result
                                : new Resolver(result, this)
                        }
                    }
                }
            }
            else{

                // tag[] are pairs at this line
                for(let y = 0, ids, len; y < tag.length; y+=2){

                    PROFILER && tick("Document.search:tag:get:" + tag[y + 1]);
                    ids = this.tag.get(tag[y]);

                    if(!ids){
                        if(DEBUG){
                            console.warn("Tag '" + tag[y] + ":" + tag[y + 1] + "' will be skipped because there is no field '" + tag[y] + "'.");
                        }
                        if(suggest){
                            continue;
                        }
                        else{
                            return !SUPPORT_RESOLVER || resolve
                                ? result
                                : new Resolver(result, this)
                        }
                    }

                    ids = ids && ids.get(tag[y + 1]);
                    len = ids && ids.length;

                    if(len){
                        count++;
                        arr.push(ids);
                    }
                    else if(!suggest){
                        // no tags found
                        return !SUPPORT_RESOLVER || resolve
                            ? result
                            : new Resolver(result, this)
                    }
                }
            }

            if(count){
                PROFILER && tick("Document.search:tag:intersect");
                res = intersect_union(/** @type {IntermediateSearchResults} */ (res), arr, resolve); // intersect(arr, limit, offset)
                len = res.length;
                if(!len && !suggest){
                    // nothing matched
                    return !SUPPORT_RESOLVER || resolve
                        ? res
                        : new Resolver(/** @type {IntermediateSearchResults} */ (res), this);
                }
                // move counter back by 1
                count--;
            }
        }

        if(len){
            result_field[count] = key;
            result.push(res);
            count++;
        }
        else if(field.length === 1){
            // fast path: nothing matched
            return !SUPPORT_RESOLVER || resolve
                ? result
                : new Resolver(result, this);
        }
    }

    if(promises){
        if(SUPPORT_PERSISTENT && SUPPORT_TAGS && this.db){
            // todo when a tag index is never a search index this could be extracted
            // push tag promises to the end
            if(tag && tag.length && !db_tag_search){
                for(let y = 0; y < tag.length; y += 2){
                    // it needs to retrieve data from tag pairs
                    const index = this.index.get(tag[y]);
                    if(!index){
                        if(DEBUG){
                            console.warn("Tag '" + tag[y] + ":" + tag[y + 1] + "' was not found because there is no field '" + tag[y] + "'.");
                        }
                        if(suggest){
                            continue;
                        }
                        else{
                            return !SUPPORT_RESOLVER || resolve
                                ? result
                                : new Resolver(result, this);
                        }
                    }
                    PROFILER && tick("Document.search:tag:get:" + tag[y + 1]);
                    promises.push(index.db.tag(tag[y + 1], limit, offset, /* enrich */ false));
                }
            }
        }

        const self = this;
        // TODO unroll this recursion
        return Promise.all(promises).then(function(result){
            // todo restore resolve state
            options && (options.resolve = resolve);
            if(result.length){
                result = self.search(query, limit, options, /* promises: */ result);
                // if(!resolve && pluck && result[0]){
                //     result = result[0].result;
                // }
            }
            return result;
        });
    }

    if(!count){
        return !SUPPORT_RESOLVER || resolve
            ? result
            : new Resolver(result, this);
    }
    if(pluck && (!enrich || !this.store)){
        result = /** @type {SearchResults|IntermediateSearchResults} */ (result[0]);
        return !SUPPORT_RESOLVER || resolve
            ? result
            : new Resolver(result, this);
    }

    promises = [];

    for(let i = 0; i < result_field.length; i++){

        /** @type {SearchResults|EnrichedSearchResults} */
        let res = result[i];

        if(enrich && res.length && typeof res[0]["doc"] === "undefined"){
            if(!SUPPORT_PERSISTENT || !this.db){
                // if(res.length){
                    res = /** @type {EnrichedSearchResults} */ (apply_enrich.call(this, res));
                // }
            }
            else{
                PROFILER && tick("Document.search:doc:get");
                // todo
                // the documents are stored on the first field
                promises.push(res = this.index.get(this.field[0]).db.enrich(res));
            }
        }

        if(pluck){
            return !SUPPORT_RESOLVER || resolve
                ? (highlight
                    ? highlight_fields(/** @type {string} */ (query), res, this.index, pluck, highlight)
                    : /** @type {SearchResults|EnrichedSearchResults} */ (res))
                : new Resolver(/** @type {IntermediateSearchResults} */ (res), this);
        }

        result[i] = {
            "field": result_field[i],
            "result": /** @type {SearchResults|EnrichedSearchResults} */ (res)
        };
    }

    if(enrich && SUPPORT_PERSISTENT && this.db && promises.length){
        const self = this;
        return Promise.all(promises).then(function(promises){
            for(let j = 0; j < promises.length; j++){
                result[j]["result"] = promises[j];
            }
            if(highlight){
                result = highlight_fields(/** @type {string} */ (query), result, self.index, pluck, highlight);
            }
            return merge
                ? merge_fields(result)
                : /** @type {DocumentSearchResults} */ (result);
        });
    }

    if(highlight){
        result = highlight_fields(/** @type {string} */ (query), result, this.index, pluck, highlight);
    }
    return merge
        ? merge_fields(result)
        : /** @type {DocumentSearchResults} */ (result);
}

// todo support Resolver
// todo when searching through multiple fields each term should
//      be found at least by one field to get a valid match without
//      using suggestion explicitly

/**
 * @param {DocumentSearchResults} fields
 * @return {MergedDocumentSearchResults}
 */
function merge_fields(fields){
    /** @type {MergedDocumentSearchResults} */
    const final = [];
    const group_field = create_object();
    const group_highlight = create_object();
    for(let i = 0, field, key, res, id, entry, tmp, highlight; i < fields.length; i++){
        field = fields[i];
        key = field.field;
        res = field.result;
        for(let j = 0; j < res.length; j++){
            entry = res[j];
            // upgrade flat results
            typeof entry !== "object"
                ? entry = { "id": id = entry }
                : id = entry["id"];
            tmp = group_field[id];
            if(!tmp){
                entry["field"] = group_field[id] = [key];
                final.push(/** @type {!MergedDocumentSearchEntry} */ (entry));
            }
            else{
                tmp.push(key);
            }
            if(SUPPORT_HIGHLIGHTING && SUPPORT_STORE && (highlight = entry["highlight"])){
                tmp = group_highlight[id];
                if(!tmp){
                    group_highlight[id] = tmp = {};
                    entry["highlight"] = tmp;
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

function get_tag(tag, key, limit, offset, enrich){

    PROFILER && tick("Document.search:tag:get:" + key);

    let res = this.tag.get(tag);
    if(!res) return [];
    res = res.get(key);
    if(!res) return [];
    let len = res.length - offset;

    if(len > 0){
        if((limit && len > limit) || offset){
            res = res.slice(offset, offset + limit);
        }
        if(enrich){
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
export function apply_enrich(ids){

    if(!SUPPORT_STORE || !this || !this.store) return ids;

    if(SUPPORT_PERSISTENT && this.db){
        return this.index.get(this.field[0]).db.enrich(ids);
    }

    /** @type {EnrichedSearchResults} */
    const result = new Array(ids.length);
    for(let x = 0, id; x < ids.length; x++){
        id = ids[x];
        result[x] = {
            "id": id,
            "doc": this.store.get(id)
        };
    }

    return result;
}
