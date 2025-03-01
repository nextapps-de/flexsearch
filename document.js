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
    SUPPORT_ASYNC,
    SUPPORT_CACHE,
    SUPPORT_KEYSTORE,
    SUPPORT_PERSISTENT,
    SUPPORT_SERIALIZE,
    SUPPORT_STORE,
    SUPPORT_TAGS,
    SUPPORT_WORKER
} from "./config.js";
// <-- COMPILER BLOCK

import Index, { batchCommit } from "./index.js";
import { DocumentInterface } from "./type.js";
import Cache, { searchCache } from "./cache.js";
import { create_object, is_array, is_string, is_object, parse_option, get_keys } from "./common.js";
import apply_async from "./async.js";
import { intersect, intersect_union } from "./intersect.js";
import { exportDocument, importDocument } from "./serialize.js";
import WorkerIndex from "./worker/index.js";
import { KeystoreMap, KeystoreSet } from "./keystore.js";

const debug = false;

/**
 * @constructor
 * @implements {DocumentInterface}
 * @param {Object=} options
 * @return {Document}
 */

export default function Document(options){

    if(!(this instanceof Document)) {
        return new Document(options);
    }

    const document = options.document || options.doc || options;
    let tmp, keystore;

    this.tree = [];
    this.field = [];
    this.marker = [];
    this.key = ((tmp = document.key || document.id) && parse_tree(tmp, this.marker)) || "id";

    keystore = SUPPORT_KEYSTORE && (options.keystore || 0);
    keystore && (this.keystore = keystore);
    this.fastupdate = !!options.fastupdate;
    this.reg = this.fastupdate
        ? (keystore ? new KeystoreMap(keystore) : new Map())
        : (keystore ? new KeystoreSet(keystore) : new Set());

    if(SUPPORT_STORE){
        // todo support custom filter function
        this.storetree = (tmp = document.store || null) && tmp !== true && [];
        this.store = tmp && (
            keystore
                ? new KeystoreMap(keystore)
                : new Map()
        );
    }

    if(SUPPORT_CACHE){
        this.cache = (tmp = options.cache || null) && new Cache(tmp);
        // todo
        // do not apply cache again for the indexes
        options.cache = false;
    }

    if(SUPPORT_WORKER){
        this.worker = options.worker;
    }

    if(SUPPORT_ASYNC){
        // this switch is used by recall of promise callbacks
        this.async = false;
    }

    /** @export */
    this.index = parse_descriptor.call(this, options, document);

    if(SUPPORT_TAGS){
        this.tag = null;
        // TODO case-insensitive tags
        if((tmp = document.tag)){
            if(typeof tmp === "string"){
                tmp = [tmp];
            }
            if(tmp.length){
                this.tag = new Map();
                this.tagtree = [];
                this.tagfield = [];
                for(let i = 0, field; i < tmp.length; i++){
                    field = tmp[i].field || tmp[i];
                    this.tag.set(field, new Map());
                    this.tagtree[i] = parse_tree(field, this.marker);
                    // the tag fields needs to be hold by indices
                    this.tagfield[i] = field;
                }
            }
        }
        // this.tag = (tmp = document.tag || null) && parse_tree(tmp, this.marker);
    }

    if(SUPPORT_PERSISTENT){
        options.db && this.mount(options.db);
    }
}

if(SUPPORT_PERSISTENT){

    Document.prototype.mount = function(db){

        let fields = this.field;

        if(SUPPORT_TAGS && this.tag){
            // tag indexes are referenced by field
            // move tags to their field indexes respectively
            for(let i = 0, field; i < this.tagfield.length; i++){
                field = this.tagfield[i];
                let index = this.index.get(field);
                if(!index){
                    // create raw index when not exists
                    this.index.set(field, index = new Index({}, this.reg));
                    // TODO VERSION DO NOT PUSH TO FIELDS
                    //this.field.push(field);
                    // copy and push to the field selection
                    if(fields === this.field){
                        fields = fields.slice(0);
                    }
                    // tag indexes also needs to be upgraded to db instances
                    fields.push(field);
                }
                // assign reference
                index.tag = this.tag.get(field);
            }
        }

        const promises = [];
        const config = {
            db: db.db,
            type: db.type,
            fastupdate: db.fastupdate
        };

        // upgrade all indexes to db instances
        for(let i = 0, index, field; i < fields.length; i++){
            config.field = field = fields[i];
            index = this.index.get(field);
            const dbi = new db.constructor(db.id, config);
            // take over the storage id
            dbi.id = db.id;
            promises[i] = dbi.mount(index);
            if(i){
                // the register has to export just one time
                // also it's needed by the index for ID contain check
                index.bypass = true;
            }
            else if(SUPPORT_STORE){
                // the datastore has to export one time
                index.store = this.store;
            }
        }

        this.async = true;
        this.db = true;
        return Promise.all(promises);
    };

    Document.prototype.commit = function(replace, append){
        const promises = [];
        for(const index of this.index.values()){
            promises.push(index.db.commit(index, replace, append));
        }
        const self = this;
        return Promise.all(promises).then(function(){
            self.reg.clear();
        });
        // for(const index of this.index.values()){
        //     await index.db.commit(index, replace, append);
        // }
        // this.reg.clear();
    };
}

/**
 * @this Document
 */

function parse_descriptor(options, document){

    const index = new Map();
    let field = document.index || document.field || document;

    if(is_string(field)){
        field = [field];
    }

    for(let i = 0, key, opt; i < field.length; i++){

        key = field[i];

        if(!is_string(key)){
            opt = key;
            key = key.field;
        }

        opt = is_object(opt) ? Object.assign({}, options, opt) : options;

        if(SUPPORT_WORKER && this.worker){
            const worker = new WorkerIndex(opt);
            index.set(key, worker);
            if(!worker.worker){
                // fallback when not supported
                this.worker = false;
            }
        }

        if(!this.worker){
            index.set(key, new Index(opt, this.reg));
        }

        this.tree[i] = parse_tree(key, this.marker);
        this.field[i] = key;
    }

    if(SUPPORT_STORE && this.storetree){

        let store = document.store;
        if(is_string(store)) store = [store];

        for(let i = 0; i < store.length; i++){
            this.storetree[i] = parse_tree(store[i], this.marker);
        }
    }

    return index;
}

function parse_tree(key, marker){

    const tree = key.split(":");
    let count = 0;

    for(let i = 0; i < tree.length; i++){

        key = tree[i];

        if(key.includes("[]")){
            key = key.substring(0, key.length - 2);
            if(key){
                marker[count] = true;
            }
        }
        if(key){
            tree[count++] = key;
        }
    }

    if(count < tree.length){
        tree.length = count;
    }

    return count > 1 ? tree : tree[0];
}

// TODO support generic function created from string when tree depth > 1

function parse_simple(obj, tree){

    if(is_string(tree)){
        obj = obj[tree];
    }
    else for(let i = 0; obj && (i < tree.length); i++){
        obj = obj[tree[i]];
    }

    return obj;
}

// TODO support generic function created from string when tree depth > 1

function store_value(obj, store, tree, pos, key){

    obj = obj[key];

    // reached target field
    if(pos === (tree.length - 1)){

        // store target value
        store[key] = obj;
    }
    else if(obj){

        if(is_array(obj)){

            store = store[key] = new Array(obj.length);

            for(let i = 0; i < obj.length; i++){
                // do not increase pos (an array is not a field)
                store_value(obj, store, tree, pos, i);
            }
        }
        else{

            store = store[key] || (store[key] = create_object());
            key = tree[++pos];
            store_value(obj, store, tree, pos, key);
        }
    }
}

function add_index(obj, tree, marker, pos, index, id, key, _append){

    obj = obj[key];

    if(obj){

        // reached target field
        if(pos === (tree.length - 1)){

            // handle target value
            if(is_array(obj)){

                // append array contents so each entry gets a new scoring context
                if(marker[pos]){
                    for(let i = 0; i < obj.length; i++){
                        index.add(id, obj[i], /* append: */ true, /* skip update: */ true);
                    }
                    return;
                }

                // or join array contents and use one scoring context
                obj = obj.join(" ");
            }

            index.add(id, obj, _append, /* skip_update: */ true);
        }
        else{

            if(is_array(obj)){
                for(let i = 0; i < obj.length; i++){
                    // do not increase index, an array is not a field
                    add_index(obj, tree, marker, pos, index, id, i, _append);
                }
            }
            else{
                key = tree[++pos];
                add_index(obj, tree, marker, pos, index, id, key, _append);
            }
        }
    }
}

/**
 *
 * @param id
 * @param content
 * @param {boolean=} _append
 * @returns {Document|Promise}
 */

Document.prototype.add = function(id, content, _append){

    if(is_object(id)){

        content = id;
        id = parse_simple(content, this.key);
    }

    if(content && (id || (id === 0))){

        if(!_append && this.reg.has(id)){
            return this.update(id, content);
        }

        for(let i = 0, tree; i < this.field.length; i++){

            tree = this.tree[i];

            // if(SUPPORT_PERSISTENT && SUPPORT_TAGS){
            //     // tree is missing when it is a tag-only index (db)
            //     if(!tree) continue;
            // }

            if(is_string(tree)){
                tree = [tree];
            }

            add_index(content, tree, this.marker, 0, this.index.get(this.field[i]), id, tree[0], _append);
        }

        if(SUPPORT_TAGS && this.tag){

            for(let x = 0; x < this.tagtree.length; x++){

                let tree = this.tagtree[x];
                let field = this.tagfield[x];
                let tags = parse_simple(content, tree);
                let dupes = create_object();
                let ref = this.tag.get(field);

                if(!ref || !tags){
                    ref || console.log("Tag '" + field + "' was not found");
                    continue;
                }

                if(is_string(tags)){
                    tags = [tags];
                }

                for(let i = 0, tag, arr; i < tags.length; i++){

                    tag = tags[i];
                    //console.log(this.tag, tag, key, field)

                    if(!dupes[tag]){
                        dupes[tag] = 1;

                        let tmp;
                        tmp = ref.get(tag);
                        tmp ? arr = tmp : ref.set(tag, arr = []);

                        if(!_append || !arr.includes(id)){

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
                                    ref.set(tag, arr = keystore);
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
            }
        }

        // TODO: how to handle store when appending contents?

        if(SUPPORT_STORE && this.store && (!_append || !this.store.has(id))){

            let payload;

            if(this.storetree){

                payload = create_object();

                for(let i = 0, tree; i < this.storetree.length; i++){
                    tree = this.storetree[i];
                    if(is_string(tree)){
                        payload[tree] = content[tree];
                    }
                    else{
                        store_value(content, payload, tree, 0, tree[0]);
                    }
                }
            }

            this.store.set(id, payload || content);
        }
    }

    return this;
};

Document.prototype.append = function(id, content){
    return this.add(id, content, true);
};

Document.prototype.update = function(id, content){
   return this.remove(id).add(id, content);
};

Document.prototype.remove = function(id){

    if(is_object(id)){
        id = parse_simple(id, this.key);
    }

    if(this.reg.has(id)){

        for(const index of this.index.values()){
            // workers don't share the register
            index.remove(id, /* skip deletion */ !!this.worker);
            if(this.fastupdate){
                // when fastupdate was enabled all ids are removed
                break;
            }
        }

        if(SUPPORT_TAGS && this.tag){
            // when fastupdate was enabled all ids are already removed
            if(!this.fastupdate){
                for(let field of this.tag.values()){
                    for(let item of field){
                        const tag = item[0];
                        const ids = item[1];
                        const pos = ids.indexOf(id);
                        if(pos > -1){
                            ids.length > 1
                                ? ids.splice(pos, 1)
                                : field.delete(tag);
                        }
                    }
                }
            }
        }

        if(SUPPORT_STORE && this.store){
            this.store.delete(id);
        }

        // already remove by index
        //this.reg.delete(id);
    }

    // the cache could be used outside the InMemory store
    if(SUPPORT_CACHE && this.cache){
        this.cache.remove(id);
    }

    return this;
};

/**
 * @param {!string|Object} query
 * @param {number|Object=} limit
 * @param {Object=} options
 * @param {Array<Array>=} _resolve For internal use only.
 * @returns {Promise|Array}
 */

Document.prototype.search = function(query, limit, options, _resolve){

    debug && console.log("checkoint:search", !!_resolve);

    if(!options){
        if(!limit && is_object(query)){
            options = /** @type {Object} */ (query);
            query = "";
        }
        else if(is_object(limit)){
            options = /** @type {Object} */ (limit);
            limit = 0;
        }
    }

    let result = [], result_field = [];
    let pluck, enrich;
    let field, tag, bool, offset, count = 0;

    if(options){

        if(is_array(options)){
            field = options;
            options = null;
        }
        else{

            query = options.query || query;
            pluck = options.pluck;
            field = pluck || options.field || options.index /*|| (is_string(options) && [options])*/;
            tag = SUPPORT_TAGS && this.tag && options.tag;
            enrich = SUPPORT_STORE && this.store && options.enrich;
            //bool = options["bool"] === "and";
            limit = options.limit || limit;
            offset = options.offset || 0;
            limit || (limit = 100);

            if(tag && (!SUPPORT_PERSISTENT || !this.db || !_resolve)){

                debug && console.log("checkoint:search:tag");

                if(tag.constructor !== Array){
                    tag = [tag];
                }

                let pairs = [];

                for(let i = 0, field; i < tag.length; i++){
                    field = tag[i];
                    if(is_string(field)){
                        if(SUPPORT_PERSISTENT && this.db){
                            // TODO
                            // NOT SUPPORTED YET
                        }
                        else{
                            const map = this.tag.get(field);
                            if(map) for(const key of map.keys()){
                                pairs.push(field, key);
                            }
                        }
                    }
                    else if(field.field){
                        pairs.push(field.field, field.value);
                    }
                    else{
                        const keys = Object.keys(field);
                        for(let j = 0, key; j < keys.length; j++){
                            key = keys[j];
                            pairs.push(key, field[key]);
                        }
                    }
                }

                // used later
                tag = pairs;

                // -----------------------------
                // Tag-Search
                // -----------------------------
                // when tags is used and no query was set,
                // then just return the tag indexes

                if(!query){

                    // todo merge into one by option
                    //res = [];
                    let promises = [];
                    if(pairs.length) for(let j = 0; j < pairs.length; j+=2){
                        let ids;
                        if(SUPPORT_PERSISTENT && this.db){
                            const index = this.index.get(pairs[j]);
                            if(!index){
                                console.log("Tag '" + pairs[j] + "' was not found");
                                continue;
                            }
                            debug && console.log("checkoint:search:tag:get", pairs[j + 1]);
                            promises.push(ids = index.db.tag(pairs[j + 1], limit, offset, enrich));
                        }
                        else{
                            debug && console.log("checkoint:search:tag:get", pairs[j + 1]);
                            ids = get_tag.call(this, pairs[j], pairs[j + 1], limit, offset, enrich);
                        }
                        // if(!ids || !ids.length) continue;
                        // if(offset && offset >= ids.length){
                        //     offset -= ids.length;
                        //     continue;
                        // }
                        // res = limit || offset
                        //     ? res.concat(ids.slice(offset, offset + limit))
                        //     : res.concat(ids);
                        result.push({
                            "field": pairs[j],
                            "tag": pairs[j + 1],
                            "result": ids /*ids.length > limit || offset
                                ? ids.slice(offset, offset + limit)
                                : ids*/
                        });
                        //if(limit && res.length === limit) break;
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
            if(is_string(field)){
                field = [field];
            }
        }
    }

    field || (field = this.field);
    //bool = bool && ((field.length > 1) || (tag && (tag.length > 1)));
    let promises = !_resolve && (this.worker || this.async) && [];

    // multi field search
    // field could be a custom set of selected fields by this query
    // tags are not included on fields
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
            key = field_options["field"];
            query = field_options["query"] || query;
            limit = field_options["limit"] || limit;
            enrich = SUPPORT_STORE && this.store && (field_options["enrich"] || enrich);
        }

        if(tag){
            if(field_options){
                field_options.enrich = false;
            }
            if(options){
                options.enrich = false;
            }
        }

        if(promises){
            debug && console.log("checkoint:search:get", key);
            let opt = field_options || options;
            promises[i] = this.index.get(key).searchAsync(query, limit, opt);
            // restore enrich state
            opt && (opt.enrich = enrich);
            // just collect and continue
            continue;
        }
        else if(_resolve){
            res = _resolve[i];
        }
        else{
            debug && console.log("checkoint:search:get", key);
            let opt = field_options || options;
            res = this.index.get(key).search(query, limit, opt);
            // restore enrich state
            opt && (opt.enrich = enrich);
        }

        len = res && res.length;

        // every field has to intersect against all selected tag fields
        if(tag && len){

            const arr = [];
            let count = 0;

            // if(bool){
            //     // prepare for intersection
            //     arr[0] = [res];
            // }

            // todo solve tag intersection on db
            // tags are only applied in resolve phase when it's a db
            if(SUPPORT_PERSISTENT && this.db && _resolve){

                // retrieve tag results assigned to it's field
                for(let y = field.length; y < _resolve.length; y++){

                    let ids = _resolve[y];
                    len = ids && ids.length;

                    if(len){
                        count++;
                        arr.push(/*bool ? [res] :*/ ids);
                    }
                    else{
                        // no tags found
                        return [];
                    }
                }
            }
            else{

                // tag[] are pairs at this line
                for(let y = 0, ids; y < tag.length; y+=2){

                    debug && console.log("checkoint:search:tag:get", tag[y + 1]);
                    ids = this.tag.get(tag[y]);
                    if(!ids){
                        console.log("Tag '" + tag[y] + "' was not found");
                        return [];
                    }
                    ids = ids && ids.get(tag[y + 1]);
                    len = ids && ids.length;

                    if(len){
                        count++;
                        arr.push(/*bool ? [res] :*/ ids);
                    }
                    else{
                        // no tags found
                        return [];
                    }
                }
            }

            if(count){
                debug && console.log("checkoint:search:tag:intersect");
                res = /*bool
                    ? intersect(arr, limit || 100, offset || 0)
                    :*/ intersect_union(res, arr)
                len = res.length;
                if(!len){
                    // nothing matched
                    return [];
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
        // else{
        //     // nothing matched
        //     return [];
        // }
    }

    if(promises){

        if(SUPPORT_PERSISTENT && this.db){
            // todo when a tag index is never a search index this could be extracted
            // push tag promises to the end
            if(tag && tag.length){
                for(let y = 0; y < tag.length; y += 2){
                    // it needs to retrieve data from tag pairs
                    const index = this.index.get(tag[y]);
                    if(!index){
                        console.log("Tag '" + tag[y] + "' was not found");
                        // not found
                        return result;
                    }
                    debug && console.log("checkoint:search:tag:get", tag[y + 1]);
                    promises.push(index.db.tag(tag[y + 1], limit, offset, /* enrich */ false));
                }
            }
        }

        const self = this;

        // anyone knows a better workaround of optionally having async promises?
        // the promise.all() needs to be wrapped into additional promise,
        // otherwise the recursive callback wouldn't run before return

        return new Promise(function(resolve){
            Promise.all(promises).then(function(result){
                resolve(self.search(query, limit, options, result));
            });
        });
    }

    if(!count){
        return [];
    }

    if(pluck && (!enrich || !this.store)){
        return result[0];
    }

    promises = [];

    for(let i = 0, res; i < result_field.length; i++){

        res = result[i];

        if(enrich && res.length && !res[0].doc){
            if(!SUPPORT_PERSISTENT || !this.db){
                if(res.length){
                    res = apply_enrich.call(this, res);
                }
            }
            else{
                debug && console.log("checkoint:search:doc:get");
                promises.push(res = this.index.get(this.field[0]).db.enrich(res));
            }
        }

        if(pluck){
            return res;
        }

        result[i] = {
            "field": result_field[i],
            "result": res
        };
    }

    if(enrich && SUPPORT_PERSISTENT && this.db && promises.length){
        return Promise.all(promises).then(function(promises){
            for(let j = 0; j < promises.length; j++){
                result[j].result = promises[j];
            }
            return result;
        });
    }

    return result;
};

/**
 * @this Document
 */

function get_tag(tag, key, limit, offset, enrich){

    debug && console.log("checkoint:search:tag:get", key);
    let res = this.tag.get(tag);
    if(!res){
        console.log("Tag '" + tag + "' was not found");
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
 * @this Document
 */

function apply_enrich(res){

    const arr = new Array(res.length);

    for(let x = 0, id; x < res.length; x++){
        id = res[x];
        arr[x] = {
            "id": id,
            "doc": this.store.get(id)
        };
    }

    return arr;
}

Document.prototype.clear = function(){

    //const promises = [];

    for(const index of this.index.values()){
        // db index will add clear task
        index.clear();
        // const promise = index.clear();
        // if(promise instanceof Promise){
        //     promises.push(promise);
        // }
    }

    if(SUPPORT_TAGS){
        for(const tags of this.tag.values()){
            tags.clear();
        }
    }

    if(SUPPORT_STORE){
        this.store.clear();
    }

    return this; /*promises.length
        ? Promise.all(promises)
        :*/
};

Document.prototype.contain = function(id){

    if(SUPPORT_PERSISTENT && this.db){
        return this.index.get(this.field[0]).db.has(id);
    }

    return this.reg.has(id);
};

Document.prototype.cleanup = function(){

    for(const index of this.index.values()){
        index.cleanup();
    }

    return this;
};

if(SUPPORT_STORE){

    Document.prototype.get = function(id){

        if(SUPPORT_PERSISTENT && this.db){
            return this.index.get(this.field[0]).db.enrich(id).then(function(result){
                return result[0] && result[0].doc;
            });
        }

        return this.store.get(id);
    };

    Document.prototype.set = function(id, store){

        this.store.set(id, store);
        return this;
    };
}

if(SUPPORT_CACHE){
    // todo mo
    Document.prototype.searchCache = searchCache;
}

if(SUPPORT_SERIALIZE){

    Document.prototype.export = exportDocument;
    Document.prototype.import = importDocument;
}

if(SUPPORT_ASYNC){

    apply_async(Document.prototype);
}
