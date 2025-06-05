// COMPILER BLOCK -->
import {
    DEBUG,
    SUPPORT_KEYSTORE,
    SUPPORT_PERSISTENT,
    SUPPORT_STORE,
    SUPPORT_TAGS, SUPPORT_WORKER
} from "../config.js";
// <-- COMPILER BLOCK
import { create_object, is_array, is_object, is_string, parse_simple } from "../common.js";
import { KeystoreArray } from "../keystore.js";
import Document from "../document.js";

/**
 *
 * @param id
 * @param content
 * @param {boolean=} _append
 * @this Document
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

        // this.field does not include db tag indexes
        for(let i = 0, tree; i < this.field.length; i++){

            tree = this.tree[i];

            const index = this.index.get(this.field[i]);
            if(typeof tree === "function"){
                const tmp = tree(content);
                if(tmp){
                    index.add(id, tmp, /* append: */ _append, /* skip update: */ true);
                }
            }
            else{
                const filter = tree._filter;
                if(filter && !filter(content)){
                    continue;
                }
                if(tree.constructor === String){
                    tree = ["" + tree];
                }
                else if(is_string(tree)){
                    tree = [tree];
                }
                add_index(content, tree, this.marker, 0, index, id, tree[0], _append);
            }
        }

        if(SUPPORT_TAGS && this.tag){

            //console.log(this.tag, this.tagtree)

            for(let x = 0; x < this.tagtree.length; x++){

                let tree = this.tagtree[x];
                let field = this.tagfield[x];
                let ref = this.tag.get(field);
                let dupes = create_object();
                let tags;

                if(typeof tree === "function"){
                    tags = tree(content);
                    if(!tags) continue;
                }
                else{
                    const filter = tree._filter;
                    if(filter && !filter(content)){
                        continue;
                    }
                    if(tree.constructor === String){
                        tree = "" + tree;
                    }
                    tags = parse_simple(content, tree);
                }

                if(!ref || !tags){
                    ref || (DEBUG && console.warn("Tag '" + field + "' was not found"));
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

                        if(!_append || ! /** @type {!Array|KeystoreArray} */(arr).includes(id)){

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

        if(SUPPORT_STORE && this.store && (!_append || !this.store.has(id))){

            let payload;

            if(this.storetree){

                payload = create_object();

                for(let i = 0, tree; i < this.storetree.length; i++){
                    tree = this.storetree[i];

                    const filter = tree._filter;
                    if(filter && !filter(content)){
                        continue;
                    }
                    let custom;
                    if(typeof tree === "function"){
                        custom = tree(content);
                        if(!custom) continue;
                        tree = [tree._field];
                    }
                    else if(is_string(tree) || tree.constructor === String){
                        payload[tree] = content[tree];
                        continue;
                    }

                    store_value(content, payload, tree, 0, tree[0], custom);
                }
            }

            this.store.set(id, payload || content);
        }

        if(SUPPORT_WORKER && this.worker){
            this.fastupdate || this.reg.add(id);
        }
    }

    return this;
};

// TODO support generic function created from string when tree depth > 1

/**
 * @param obj
 * @param store
 * @param tree
 * @param pos
 * @param key
 * @param {*=} custom
 */

function store_value(obj, store, tree, pos, key, custom){

    obj = obj[key];

    // reached target field
    if(pos === (tree.length - 1)){

        // store target value
        store[key] = custom || obj;
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

    if((obj = obj[key])){

        // reached the target field
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
    // else{
    //     if(SUPPORT_PERSISTENT && index.db){
    //         index.remove(id);
    //     }
    // }
}
