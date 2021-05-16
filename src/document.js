/**!
 * FlexSearch.js
 * Copyright 2019 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */

import { SUPPORT_ASYNC, SUPPORT_CACHE } from "./config.js";
import { create_object } from "./common.js";
import Index from "./index.js";
import { addAsync, appendAsync, removeAsync, searchAsync, updateAsync } from "./async.js";
import Cache, { searchCache } from "./cache.js";

/**
 * @param {Object=} options
 * @return {Document}
 * @constructor
 */

function Document(options){

    if(!(this instanceof Document)) {

        return new Document(options);
    }

    let opt;

    options || (options = {});

    this.register = create_object();
    this.store = (opt = options["store"]) && create_object();
    this.storetree = opt && (opt !== true) && [];
    this.markup = [];
    this.key = ((opt = options["key"]) && parse_tree(opt, this.markup)) || "id";
    this.tree = [];
    this.field = [];

    if(SUPPORT_CACHE){

        this.cache = (opt = options["cache"]) && new Cache(opt);
        options["cache"] = false;
    }

    /** @private */
    this.index = parse_descriptor.call(this, options);
}

export default Document;

/**
 * @this Document
 */

function parse_descriptor(options){

    const index = create_object();
    let field = options["doc"]; // options["document"]
    let field_options;

    if(typeof field === "string"){

        field = [field];
    }
    else if(field.constructor !== Array){

        field_options = field;
        field = Object.keys(field);
    }

    for(let i = 0, key, item; i < field.length; i++){

        key = field[i];

        if(field_options){

            item = field_options[key];
            item = typeof item === "object" ? Object.assign({}, options, item) : options;
        }
        else{

            item = options;
        }

        index[key] = new Index(item, this.register);
        this.tree[i] = parse_tree(key, this.markup);
        this.field[i] = key;
    }

    if(this.storetree){

        let store = options["store"];

        if(typeof store === "string"){

            store = [store];
        }

        for(let i = 0; i < store.length; i++){

            this.storetree[i] = parse_tree(store[i], this.markup);
        }
    }

    return index;
}

function parse_tree(key, markup){

    const tree = key.split(":");
    let count = 0;

    for(let i = 0; i < tree.length; i++){

        key = tree[i];

        if(key.indexOf("[]") >= 0){

            key = key.substring(0, key.length - 2);

            if(key){

                markup[count] = true;
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

function get_id(obj, tree){

    if(typeof tree === "string"){

        obj = obj[tree];
    }
    else{

        for(let i = 0; obj && (i < tree.length); i++){

            obj = obj[tree[i]];
        }
    }

    return obj;
}

function store_value(obj, store, tree, pos, key){

    obj = obj[key];

    // reached target field

    if(pos === (tree.length - 1)){

        // store target value

        store[key] = obj;
    }
    else if(obj){

        if(obj.constructor === Array){

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

function add_index(obj, tree, markup, pos, index, id, key, _append){

    obj = obj[key];

    // reached target field

    if(pos === (tree.length - 1)){

        // handle target value

        if(obj.constructor === Array){

            if(markup[pos]){

                for(let i = 0; i < obj.length; i++){

                    index.add(id, obj[i], true);
                }

                return;
            }

            obj = obj.join(" ");
        }

        index.add(id, obj, _append);
    }
    else if(obj){

        if(obj.constructor === Array){

            for(let i = 0; i < obj.length; i++){

                // do not increase index, an array is not a field
                add_index(obj, tree, markup, pos, index, id, i, _append);
            }
        }
        else{

            key = tree[++pos];

            add_index(obj, tree, markup, pos, index, id, key, _append);
        }
    }
}

/**
 *
 * @param id
 * @param content
 * @param {boolean=} _append
 * @returns {Document}
 */

Document.prototype.add = function(id, content, _append){

    if(typeof id === "object"){

        content = id;
        id = get_id(content, this.key);
    }

    if(content && (id || (id === 0))){

        if(this.register[id]){

            return this.update(id, content);
        }

        for(let i = 0, tree, field; i < this.field.length; i++){

            field = this.field[i];
            tree = this.tree[i];

            if(typeof tree === "string"){

                tree = [tree];
            }

            add_index(content, tree, this.markup, 0, this.index[field], id, tree[0], _append);
        }

        if(this.store){

            let store;

            if(this.storetree){

                store = create_object();

                for(let i = 0, tree; i < this.storetree.length; i++){

                    tree = this.storetree[i];

                    if(typeof tree === "string"){

                        store[tree] = content[tree];
                    }
                    else{

                        store_value(content, store, tree, 0, tree[0]);
                    }
                }
            }

            this.store[id] = store || content;
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

    if(typeof id === "object"){

        id = id[this.key];
    }

    if(this.register[id]){

        for(let i = 0; i < this.field.length; i++){

            this.index[this.field[i]].remove(id, true);
        }

        if(this.store){

            delete this.store[id];
        }

        delete this.register[id];
    }

    return this;
};

Document.prototype.search = function(query, limit, options){

    if(typeof query === "object"){

        options = query;
        query = options["query"];
    }
    else if(typeof limit === "object"){

        options = limit;
    }

    let result = [];
    let pluck, enrich;
    let field, field_options, bool, count = 0;

    if(options){

        pluck = options["pluck"];
        field = pluck || options["field"];
        enrich = options["enrich"];
        bool = options["bool"] === "and";
        limit = options["limit"];
    }

    if(field){

        if(typeof field === "string"){

            field = [field];
        }
        else if(field.constructor !== Array){

            field_options = field;
            field = Object.keys(field);
        }
    }
    else{

        field = this.field;
    }

    bool = bool && (field.length > 1);

    for(let i = 0, res, key, item; i < field.length; i++){

        key = field[i];

        if(field_options){

            item = field_options[key];

            // inherit options?
            //item = typeof item === "object" ? Object.assign({}, options, item) : options;
        }
        else{

            item = options;
        }

        res = this.index[key].search(query, limit, item);

        if(bool){

            if(!res.length){

                // fast path optimization

                return [];
            }

            // add a pseudo relevance index for the intersection
            // used when squash the results on boolean "and"
            //res = [res];
        }

        count += res.length;
        result[i] = res;
    }

    if(!count){

        // fast path optimization

        return [];
    }

    // squash the results on boolean "and"?

    // if(bool){
    //
    //     limit || (limit = 100);
    //
    //     if(enrich && this.store){
    //
    //         return apply_enrich.call(this, intersect(result, limit));
    //     }
    //
    //     return intersect(result, limit);
    // }

    if(pluck && (!enrich || !this.store)){

        // fast path optimization

        return result[0];
    }

    for(let i = 0, res, key; i < field.length; i++){

        key = field[i];
        res = result[i];

        if(enrich && this.store){

            res = apply_enrich.call(this, res);
        }

        if(pluck){

            return res;
        }

        result[i] = {

            "field": key,
            "result": res
        };
    }

    return result;
};

/**
 * @this Document
 */

function apply_enrich(res){

    const arr = new Array(res.length);

    for(let x = 0, id; x < res.length; x++){

        id = res[x];

        arr[x] = {

            "key": id,
            "doc": this.store[id]
        };
    }

    return arr;
}

Document.prototype.get = function(id){

    return this.store[id];
};

Document.prototype.set = function(id, data){

    this.store[id] = data;
    return this;
};

Document.prototype.contain = function(id){

    return !!this.register[id];
};

if(SUPPORT_CACHE){

    Document.prototype.searchCache = searchCache;
}

if(SUPPORT_ASYNC){

    Document.prototype.addAsync = addAsync;
    Document.prototype.appendAsync = appendAsync;
    Document.prototype.searchAsync = searchAsync;
    Document.prototype.updateAsync = updateAsync;
    Document.prototype.removeAsync = removeAsync;
}