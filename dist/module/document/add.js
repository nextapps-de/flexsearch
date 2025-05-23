
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
Document.prototype.add = function (id, content, _append) {

    if (is_object(id)) {

        content = id;
        id = parse_simple(content, this.key);
    }

    if (content && (id || 0 === id)) {

        if (!_append && this.reg.has(id)) {
            return this.update(id, content);
        }

        for (let i = 0, tree; i < this.field.length; i++) {

            tree = this.tree[i];

            const index = this.index.get(this.field[i]);
            if ("function" == typeof tree) {
                const tmp = tree(content);
                if (tmp) {
                    index.add(id, tmp, !0);
                }
            } else {
                const filter = tree._filter;
                if (filter && !filter(content)) {
                    continue;
                }
                if (tree.constructor === String) {
                    tree = ["" + tree];
                } else if (is_string(tree)) {
                    tree = [tree];
                }
                add_index(content, tree, this.marker, 0, index, id, tree[0], _append);
            }
        }

        if (this.tag) {

            for (let x = 0; x < this.tagtree.length; x++) {
                let tree = this.tagtree[x],
                    field = this.tagfield[x],
                    ref = this.tag.get(field),
                    dupes = create_object(),
                    tags;


                if ("function" == typeof tree) {
                    tags = tree(content);
                    if (!tags) continue;
                } else {
                    const filter = tree._filter;
                    if (filter && !filter(content)) {
                        continue;
                    }
                    if (tree.constructor === String) {
                        tree = "" + tree;
                    }
                    tags = parse_simple(content, tree);
                }

                if (!ref || !tags) {
                    continue;
                }

                if (is_string(tags)) {
                    tags = [tags];
                }

                for (let i = 0, tag, arr; i < tags.length; i++) {

                    tag = tags[i];

                    if (!dupes[tag]) {
                        dupes[tag] = 1;

                        let tmp = ref.get(tag);

                        tmp ? arr = tmp : ref.set(tag, arr = []);

                        if (!_append || ! /** @type {!Array|KeystoreArray} */arr.includes(id)) {
                            if (2147483647 === arr.length) {
                                const keystore = new KeystoreArray(arr);
                                if (this.fastupdate) {
                                    for (let value of this.reg.values()) {
                                        if (value.includes(arr)) {
                                            value[value.indexOf(arr)] = keystore;
                                        }
                                    }
                                }
                                ref.set(tag, arr = keystore);
                            }


                            arr.push(id);

                            if (this.fastupdate) {
                                const tmp = this.reg.get(id);
                                tmp ? tmp.push(arr) : this.reg.set(id, [arr]);
                            }
                        }
                    }
                }
            }
        }

        if (this.store && (!_append || !this.store.has(id))) {

            let payload;

            if (this.storetree) {

                payload = create_object();

                for (let i = 0, tree; i < this.storetree.length; i++) {
                    tree = this.storetree[i];

                    const filter = tree._filter;
                    if (filter && !filter(content)) {
                        continue;
                    }
                    let custom;
                    if ("function" == typeof tree) {
                        custom = tree(content);
                        if (!custom) continue;
                        tree = [tree._field];
                    } else if (is_string(tree) || tree.constructor === String) {
                        payload[tree] = content[tree];
                        continue;
                    }

                    store_value(content, payload, tree, 0, tree[0], custom);
                }
            }

            this.store.set(id, payload || content);
        }

        if (this.worker) {
            this.fastupdate || this.reg.add(id);
        }
    }

    return this;
};

/**
 * @param obj
 * @param store
 * @param tree
 * @param pos
 * @param key
 * @param {*=} custom
 */

function store_value(obj, store, tree, pos, key, custom) {

    obj = obj[key];

    if (pos === tree.length - 1) {

        store[key] = custom || obj;
    } else if (obj) {

        if (is_array(obj)) {

            store = store[key] = Array(obj.length);

            for (let i = 0; i < obj.length; i++) {

                store_value(obj, store, tree, pos, i);
            }
        } else {

            store = store[key] || (store[key] = create_object());
            key = tree[++pos];
            store_value(obj, store, tree, pos, key);
        }
    }
}

function add_index(obj, tree, marker, pos, index, id, key, _append) {

    if (obj = obj[key]) {

        if (pos === tree.length - 1) {

            if (is_array(obj)) {

                if (marker[pos]) {
                    for (let i = 0; i < obj.length; i++) {
                        index.add(id, obj[i], !0);
                    }
                    return;
                }

                obj = obj.join(" ");
            }

            index.add(id, obj, _append, !0);
        } else {

            if (is_array(obj)) {
                for (let i = 0; i < obj.length; i++) {

                    add_index(obj, tree, marker, pos, index, id, i, _append);
                }
            } else {
                key = tree[++pos];
                add_index(obj, tree, marker, pos, index, id, key, _append);
            }
        }
    }
}