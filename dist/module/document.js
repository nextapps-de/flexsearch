/**!
 * FlexSearch.js
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */

import { IndexOptions, DocumentOptions, DocumentDescriptor, FieldOptions, StoreOptions, EncoderOptions } from "./type.js";
import StorageInterface from "./db/interface.js";
import Index from "./index.js";
import WorkerIndex from "./worker.js";
import Encoder, { fallback_encoder } from "./encoder.js";
import Cache, { searchCache } from "./cache.js";
import { is_string, is_object, parse_simple } from "./common.js";
import apply_async from "./async.js";
import { exportDocument, importDocument } from "./serialize.js";
import { KeystoreMap, KeystoreSet } from "./keystore.js";
import "./document/add.js";
import "./document/search.js";
import Charset from "./charset.js";

/**
 * @constructor
 * @param {!DocumentOptions} options
 * @return {Document|Promise<Document>}
 * @this {Document}
 */

export default function Document(options) {

    if (!this || this.constructor !== Document) {
        return new Document(options);
    }

    const document = /** @type DocumentDescriptor */options.document || options.doc || options;
    let tmp, keystore;

    this.tree = [];
    this.field = [];
    this.marker = [];
    this.key = (tmp = document.key || document.id) && parse_tree(tmp, this.marker) || "id";

    keystore = options.keystore || 0;
    keystore && (this.keystore = keystore);
    this.fastupdate = !!options.fastupdate;

    /** @type {
     *   Set<string|number>|
     *   Map<Array<string|number>>|
     *   KeystoreSet<string|number>|
     *   KeystoreMap<Array<string|number>>
     * } */
    this.reg = this.fastupdate && !options.worker && !options.db ? keystore && !0 ? new KeystoreMap(keystore) : new Map() : keystore && !0 ? new KeystoreSet(keystore) : new Set();

    this.storetree = (tmp = document.store || null) && tmp && !0 !== tmp && [];
    /** @type {Map|KeystoreMap} */
    this.store = tmp ? keystore && !0 ? new KeystoreMap(keystore) : new Map() : null;

    this.cache = (tmp = options.cache || null) && new Cache(tmp);

    options.cache = !1;

    this.worker = options.worker || !1;

    this.priority = options.priority || 4;

    /**
     * @type {Map<string, Index|WorkerIndex>}
     */
    this.index = parse_descriptor.call(this, options, document);

    this.tag = null;

    if (tmp = document.tag) {
        if ("string" == typeof tmp) {
            tmp = [tmp];
        }
        if (tmp.length) {
            this.tag = new Map();
            this.tagtree = [];
            this.tagfield = [];
            for (let i = 0, params, field; i < tmp.length; i++) {
                params = tmp[i];
                field = params.field || params;
                if (!field) {
                    throw new Error("The tag field from the document descriptor is undefined.");
                }
                if (params.custom) {
                    this.tagtree[i] = params.custom;
                } else {
                    this.tagtree[i] = parse_tree(field, this.marker);
                    if (params.filter) {
                        if ("string" == typeof this.tagtree[i]) {

                            this.tagtree[i] = new String(this.tagtree[i]);
                        }
                        this.tagtree[i]._filter = params.filter;
                    }
                }

                this.tagfield[i] = field;
                this.tag.set(field, new Map());
            }
        }
    }


    if (this.worker) {
        this.fastupdate = !1;
        const promises = [];
        for (const index of this.index.values()) {
            index.then && promises.push(index);
        }
        if (promises.length) {
            const self = this;
            return Promise.all(promises).then(function (result) {
                let count = 0;
                for (const item of self.index.entries()) {
                    const key = /** @type {string} */item[0];
                    let index = /** @type {Index|WorkerIndex | Promise<Index|WorkerIndex>} */item[1];
                    if (index.then) {
                        index = result[count];
                        self.index.set(key, index);
                        count++;
                    }
                }
                return self;
            });
        }
    } else {
        if (options.db) {
            this.fastupdate = !1;

            this.mount(options.db);
        }
    }
}

/**
 * @param {!StorageInterface} db
 * @return {Promise<void>}
 */
Document.prototype.mount = function (db) {

    let fields = this.field;

    if (this.tag) {

        for (let i = 0, field; i < this.tagfield.length; i++) {
            field = this.tagfield[i];
            let index;

            this.index.set(field, index = new Index( /** @type IndexOptions */{}, this.reg));

            if (fields === this.field) {
                fields = fields.slice(0);
            }

            fields.push(field);

            index.tag = this.tag.get(field);
        }
    }

    const promises = [],
          config = {
        db: db.db,
        type: db.type,
        fastupdate: db.fastupdate
    };


    for (let i = 0, index, field; i < fields.length; i++) {
        config.field = field = fields[i];
        index = this.index.get(field);
        const dbi = new db.constructor(db.id, config);

        dbi.id = db.id;
        promises[i] = dbi.mount(index);

        index.document = !0;
        if (i) {

            index.bypass = !0;
        } else {

            index.store = this.store;
        }
    }

    const self = this;
    return this.db = Promise.all(promises).then(function () {
        self.db = !0;
    });
};

Document.prototype.commit = async function () {

    const promises = [];
    for (const index of this.index.values()) {
        promises.push(index.commit());
    }
    await Promise.all(promises);
    this.reg.clear();
};

Document.prototype.destroy = function () {
    const promises = [];
    for (const idx of this.index.values()) {
        promises.push(idx.destroy());
    }
    return Promise.all(promises);
};

/**
 * @this {Document}
 * @return {Map<string, Index|WorkerIndex>}
 */

function parse_descriptor(options, document) {

    /** @type {Map<string, Index|WorkerIndex>} */
    const index = new Map();
    let field = document.index || document.field || document;

    if (is_string(field)) {
        field = [field];
    }

    for (let i = 0, key, opt; i < field.length; i++) {

        key = field[i];

        if (!is_string(key)) {
            opt = key;
            key = key.field;
        }

        opt = /** @type IndexOptions */is_object(opt) ? Object.assign({}, options, opt) : options;

        if (this.worker) {
            let encoder = opt.encoder;

            encoder = encoder && encoder.encode ? encoder : new Encoder("string" == typeof encoder ? Charset[encoder] : encoder || {});

            const worker = new WorkerIndex(opt, /** @type {Encoder} */encoder);
            if (worker) {

                index.set(key, worker);
            } else {

                this.worker = !1;
            }
        }

        if (!this.worker) {
            index.set(key, new Index( /** @type IndexOptions */opt, this.reg));
        }

        if (opt.custom) {
            this.tree[i] = opt.custom;
        } else {
            this.tree[i] = parse_tree(key, this.marker);
            if (opt.filter) {
                if ("string" == typeof this.tree[i]) {

                    this.tree[i] = new String(this.tree[i]);
                }
                this.tree[i]._filter = opt.filter;
            }
        }

        this.field[i] = key;
    }

    if (this.storetree) {

        let stores = document.store;
        if (is_string(stores)) stores = [stores];

        for (let i = 0, store, field; i < stores.length; i++) {
            store = /** @type Array<StoreOptions> */stores[i];
            field = store.field || store;
            if (store.custom) {
                this.storetree[i] = store.custom;
                store.custom._field = field;
            } else {
                this.storetree[i] = parse_tree(field, this.marker);
                if (store.filter) {
                    if ("string" == typeof this.storetree[i]) {

                        this.storetree[i] = new String(this.storetree[i]);
                    }
                    this.storetree[i]._filter = store.filter;
                }
            }
        }
    }

    return index;
}

function parse_tree(key, marker) {

    const tree = key.split(":");
    let count = 0;

    for (let i = 0; i < tree.length; i++) {
        key = tree[i];

        if ("]" === key[key.length - 1]) {
            key = key.substring(0, key.length - 2);
            if (key) {
                marker[count] = !0;
            }
        }
        if (key) {
            tree[count++] = key;
        }
    }

    if (count < tree.length) {
        tree.length = count;
    }

    return 1 < count ? tree : tree[0];
}

/**
 * @param {!number|Object} id
 * @param {!Object} content
 * @return {Document|Promise<Document>}
 */
Document.prototype.append = function (id, content) {
    return this.add(id, content, !0);
};

/**
 * @param {!number|Object} id
 * @param {!Object} content
 * @return {Document|Promise<Document>}
 */
Document.prototype.update = function (id, content) {
    return this.remove(id).add(id, content);
};

/**
 * @param {!number|Object} id
 * @return {Document|Promise<Document>}
 */
Document.prototype.remove = function (id) {

    if (is_object(id)) {
        id = parse_simple(id, this.key);
    }

    for (const index of this.index.values()) {
        index.remove(id, !0);
    }

    if (this.reg.has(id)) {

        if (this.tag) {

            if (!this.fastupdate) {
                for (let field of this.tag.values()) {
                    for (let item of field) {
                        const tag = item[0],
                              ids = item[1],
                              pos = ids.indexOf(id);

                        if (-1 < pos) {
                            1 < ids.length ? ids.splice(pos, 1) : field.delete(tag);
                        }
                    }
                }
            }
        }

        if (this.store) {
            this.store.delete(id);
        }

        this.reg.delete(id);
    }

    if (this.cache) {
        this.cache.remove(id);
    }

    return this;
};

Document.prototype.clear = function () {

    const promises = [];

    for (const index of this.index.values()) {

        const promise = index.clear();

        if (promise.then) {
            promises.push(promise);
        }
    }

    if (this.tag) {
        for (const tags of this.tag.values()) {
            tags.clear();
        }
    }

    if (this.store) {
        this.store.clear();
    }

    if (this.cache) {
        this.cache.clear();
    }

    return promises.length ? Promise.all(promises) : this;
};

/**
 * @param {number|string} id
 * @return {boolean|Promise<boolean>}
 */
Document.prototype.contain = function (id) {

    if (this.db) {
        return this.index.get(this.field[0]).db.has(id);
    }

    return this.reg.has(id);
};

Document.prototype.cleanup = function () {

    for (const index of this.index.values()) {
        index.cleanup();
    }

    return this;
};

/**
 * @param {number|string} id
 * @return {Object}
 */
Document.prototype.get = function (id) {

    if (this.db) {
        return this.index.get(this.field[0]).db.enrich(id).then(function (result) {
            return result[0] && result[0].doc || null;
        });
    }

    return this.store.get(id) || null;
};

/**
 * @param {number|string|Object} id
 * @param {Object} data
 * @return {Document}
 */
Document.prototype.set = function (id, data) {

    if ("object" == typeof id) {
        data = id;
        id = parse_simple(data, this.key);
    }

    this.store.set(id, data);
    return this;
};

Document.prototype.searchCache = searchCache;


Document.prototype.export = exportDocument;
Document.prototype.import = importDocument;


apply_async(Document.prototype);