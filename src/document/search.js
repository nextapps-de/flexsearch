// COMPILER BLOCK -->
import {
    DEBUG,
    PROFILER,
    SUPPORT_PERSISTENT,
    SUPPORT_RESOLVER,
    SUPPORT_STORE,
    SUPPORT_SUGGESTION,
    SUPPORT_TAGS
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
import { create_object, is_array, is_object, is_string, parse_simple } from "../common.js";
import { intersect_union } from "../intersect.js";
import Document from "../document.js";
import Index from "../index.js";
import Resolver from "../resolver.js";
import tick from "../profiler.js";

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

    /** @type {
     *   DocumentSearchResults|
     *   EnrichedDocumentSearchResults|
     *   SearchResults|
     *   IntermediateSearchResults|
     *   EnrichedSearchResults
     * } */
    let result = [];
    let result_field = [];
    let pluck, enrich, merge, suggest;
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
        field = pluck || options.field || ((field = options.index) && (field.index ? null : field));
        tag = SUPPORT_TAGS && this.tag && options.tag;
        suggest = SUPPORT_SUGGESTION && options.suggest;
        resolve = !SUPPORT_RESOLVER || (options.resolve !== false);

        // upgrade pluck when missing
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

        if(DEBUG){
            if(SUPPORT_STORE && this.store && options.enrich && !resolve){
                console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
            }
        }

        enrich = SUPPORT_STORE && this.store && options.enrich && resolve;
        highlight = enrich && options.highlight;
        limit = options.limit || limit;
        offset = options.offset || 0;
        limit || (limit = 100);

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
                    result.push({
                        "field": pairs[j],
                        "tag": pairs[j + 1],
                        "result": ids
                    });
                }

                if(promises.length){
                    return Promise.all(promises).then(function(promises){
                        for(let j = 0; j < promises.length; j++){
                            result[j].result = promises[j];
                        }
                        return result;
                    });
                }

                return result;
            }
        }

        // extend to multi field search by default
        if(field && field.constructor !== Array){
            field = [field];
        }
    }

    field || (field = this.field);
    let promises = !_promises && (this.worker || this.db /*|| this.async*/) && [];
    let db_tag_search;

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
            limit = field_options.limit || limit;
            offset = field_options.offset || offset;
            suggest = SUPPORT_SUGGESTION && (field_options.suggest || suggest);
            enrich = SUPPORT_STORE && this.store && (field_options.enrich || enrich);
        }

        if(_promises){
            res = _promises[i];
        }
        else{
            PROFILER && tick("Document.search:get:" + key);
            let opt = field_options || options;
            let index = this.index.get(key);

            if(tag){
                if(SUPPORT_PERSISTENT && this.db){
                    opt.tag = tag;
                    db_tag_search = index.db.support_tag_search;
                    opt.field = field;
                }
                if(!db_tag_search){
                    opt.enrich = false;
                }
            }
            if(promises){
                promises[i] = index.search/*Async*/(query, limit, opt);
                // restore enrich state
                opt && enrich && (opt.enrich = enrich);
                // just collect and continue
                continue;
            }
            else{
                res = index.search(query, limit, opt);
                // restore enrich state
                opt && enrich && (opt.enrich = enrich);
            }
        }

        len = res && (resolve ? res.length : res.result.length);

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
                            return resolve
                                ? result
                                : new Resolver(result)
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
                            return resolve
                                ? result
                                : new Resolver(result)
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
                        return resolve
                            ? result
                            : new Resolver(result)
                    }
                }
            }

            if(count){
                PROFILER && tick("Document.search:tag:intersect");
                res = intersect_union(res, arr, resolve); // intersect(arr, limit, offset)
                len = res.length;
                if(!len && !suggest){
                    // nothing matched
                    return resolve
                        ? res
                        : new Resolver(/** @type {IntermediateSearchResults} */ (res));
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
            return resolve
                ? result
                : new Resolver(result);
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
                            return resolve
                                ? result
                                : new Resolver(result);
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
            return result.length
                ? self.search(query, limit, options, /* promises: */ result)
                : result;
        });
    }

    if(!count){
        return resolve
            ? result
            : new Resolver(result);
    }
    if(pluck && (!enrich || !this.store)){
        return result[0];
    }

    promises = [];

    for(let i = 0, res; i < result_field.length; i++){

        res = result[i];

        if(enrich && res.length && !res[0].doc){
            if(!SUPPORT_PERSISTENT || !this.db){
                // if(res.length){
                    res = apply_enrich.call(this, res);
                // }
            }
            else{
                PROFILER && tick("Document.search:doc:get");
                // the documents are stored on the first field
                promises.push(res = this.index.get(this.field[0]).db.enrich(res));
            }
        }

        if(pluck){
            return resolve
                ? res
                : new Resolver(res);
        }

        result[i] = {
            "field": result_field[i],
            "result": res
        };
    }

    if(enrich && SUPPORT_PERSISTENT && this.db && promises.length){
        const self = this;
        return Promise.all(promises).then(function(promises){
            for(let j = 0; j < promises.length; j++){
                result[j]["result"] = promises[j];
            }
            return merge
                ? merge_fields(result, /** @type {number} */ (limit), offset)
                : highlight
                    ? highlight_fields(result, query, self.index, self.field, self.tree, highlight, limit, offset)
                    : result;
        });
    }

    return merge
        ? merge_fields(result, limit, offset)
        : highlight
            ? highlight_fields(result, query, this.index, this.field, this.tree, highlight, limit, offset)
            : result;
}

/*

 karmen or clown or not found
[Carmen]cita
       Le [clown] et ses chiens

 */

function highlight_fields(result, query, index, field, tree, template, limit, offset){

    // if(typeof template === "string"){
    //     template = new RegExp(template, "g");
    // }
    console.log("template", template)
    let encoder;
    let query_enc;
    let tokenize;

    for(let i = 0, res, res_field, enc, idx, path; i < result.length; i++){

        res = result[i].result;
        res_field = result[i].field;
        idx = index.get(res_field);
        enc = idx.encoder;
        tokenize = idx.tokenize;
        path = tree[field.indexOf(res_field)];

        if(enc !== encoder){
            encoder = enc;
            query_enc = encoder.encode(query);
        }

        for(let j = 0; j < res.length; j++){
            let str = "";
            let content = parse_simple(res[j].doc, path);
            let doc_enc = encoder.encode(content);
            let doc_org = content.split(encoder.split);

            for(let k = 0, doc_enc_cur, doc_org_cur; k < doc_enc.length; k++){
                doc_enc_cur = doc_enc[k];
                doc_org_cur = doc_org[k];
                let found;
                for(let l = 0, query_enc_cur; l < query_enc.length; l++){
                    query_enc_cur = query_enc[l];
                    // todo tokenize could be custom also when "strict" was used
                    if(tokenize === "strict"){
                        if(doc_enc_cur === query_enc_cur){
                            str += (str ? " " : "") + template.replace("$1", doc_org_cur);
                            found = true;
                            break;
                        }
                    }
                    else{
                        const position = doc_enc_cur.indexOf(query_enc_cur);
                        if(position > -1){
                            str += (str ? " " : "") +
                                // prefix
                                doc_org_cur.substring(0, position) +
                                // match
                                template.replace("$1", doc_org_cur.substring(position, query_enc_cur.length)) +
                                // suffix
                                doc_org_cur.substring(position + query_enc_cur.length);
                            found = true;
                            break;
                        }
                    }

                    //str += doc_enc[k].replace(new RegExp("(" + doc_enc[k] + ")", "g"), template.replace("$1", content))
                }

                if(!found){
                    str += (str ? " " : "") + doc_org[k];
                }
            }

            res[j].highlight = str;
        }
    }

    return result;
}

// todo support Resolver
// todo when searching through multiple fields each term should
//      be found at least by one field to get a valid match without
//      using suggestion explicitly

/**
 * @param {DocumentSearchResults} fields
 * @param {number=} limit
 * @param {number=} offset
 * @return {MergedDocumentSearchResults}
 */
function merge_fields(fields, limit, offset){
    /** @type {Array<MergedDocumentSearchEntry>} */
    const final = [];
    const set = create_object();
    for(let i = 0, field, res; i < fields.length; i++){
        field = fields[i];
        res = field.result;
        for(let j = 0, id, entry, tmp; j < res.length; j++){
            entry = res[j];
            // upgrade flat results
            if(typeof entry !== "object"){
                entry = {
                  "id": entry
                };
            }
            id = entry.id;
            tmp = set[id];
            if(!tmp){
                // offset was already applied on field indexes
                // if(offset){
                //     offset--;
                //     continue;
                // }
                // apply limit from last round, because just fields could
                // be pushed without adding new results
                if(final.length === limit){
                    return final;
                }
                entry.field = set[id] = [field.field];
                final.push(/** @type {MergedDocumentSearchEntry} */ (entry));
            }
            else{
                tmp.push(field.field);
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
    if(!res){
        DEBUG && console.warn("Tag '" + tag + "' was not found");
        return [];
    }
    res = res && res.get(key);
    let len = res && (res.length - offset);

    if(len && (len > 0)){
        if((len > limit) || offset){
            res = res.slice(offset, offset + limit);
        }
        if(enrich){
            res = apply_enrich.call(this, res);
        }
        return res;
    }
}

/**
 * @param {SearchResults} ids
 * @return {EnrichedSearchResults|SearchResults}
 * @this {Document|Index|null}
 */

export function apply_enrich(ids){

    if(!this || !this.store) return ids;

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
