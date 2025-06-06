/**!
 * FlexSearch.js
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */

import { IndexOptions, ContextOptions, EncoderOptions } from "./type.js";
import Encoder, { fallback_encoder } from "./encoder.js";
import Cache, { searchCache } from "./cache.js";
import Charset from "./charset.js";
import { KeystoreMap, KeystoreSet } from "./keystore.js";
import { is_array, is_string } from "./common.js";
import { exportIndex, importIndex, serialize } from "./serialize.js";
import { remove_index } from "./index/remove.js";

import apply_preset from "./preset.js";
import apply_async from "./async.js";
import tick from "./profiler.js";
import "./index/add.js";
import "./index/search.js";
import "./index/remove.js";

/**
 * @constructor
 * @param {IndexOptions|string=} options Options or preset as string
 * @param {Map|Set|KeystoreSet|KeystoreMap=} _register
 */

export default function Index(options, _register) {

    if (!this || this.constructor !== Index) {
        return new Index(options);
    }

    options = /** @type IndexOptions */options ? apply_preset(options) : {};

    /** @type {*} */
    let tmp = options.context;
    /** @type ContextOptions */
    const context = /** @type ContextOptions */!0 === tmp ? { depth: 1 } : tmp || {},
          encoder = is_string(options.encoder) ? Charset[options.encoder] : options.encode || options.encoder || {};

    /** @type Encoder */
    this.encoder = encoder.encode ? encoder : "object" == typeof encoder ? new Encoder( /** @type {EncoderOptions} */encoder) : { encode: encoder };

    this.compress = options.compress || options.compression || !1;


    this.resolution = options.resolution || 9;
    this.tokenize = tmp = (tmp = options.tokenize) && "default" !== tmp && "exact" !== tmp && tmp || "strict";
    this.depth = "strict" === tmp && context.depth || 0;
    this.bidirectional = !1 !== context.bidirectional;
    this.fastupdate = !!options.fastupdate;
    this.score = options.score || null;

    tmp = options.keystore || 0;
    tmp && (this.keystore = tmp);

    this.map = tmp && !0 ? new KeystoreMap(tmp) : new Map();
    this.ctx = tmp && !0 ? new KeystoreMap(tmp) : new Map();
    /** @type {
     *   Set<string|number>|
     *   Map<Array<string|number>>|
     *   KeystoreSet<string|number>|
     *   KeystoreMap<Array<string|number>>
     * } */
    this.reg = _register || (this.fastupdate ? tmp && !0 ? new KeystoreMap(tmp) : new Map() : tmp && !0 ? new KeystoreSet(tmp) : new Set());
    this.resolution_ctx = context.resolution || 3;
    this.rtl = encoder.rtl || options.rtl || !1;

    this.cache = (tmp = options.cache || null) && new Cache(tmp);

    this.resolve = !1 !== options.resolve;

    if (tmp = options.db) {
        this.db = this.mount(tmp);
    }
    this.commit_auto = !1 !== options.commit;
    this.commit_task = [];
    this.commit_timer = null;

    this.priority = options.priority || 4;
}

Index.prototype.mount = function (db) {
    if (this.commit_timer) {
        clearTimeout(this.commit_timer);
        this.commit_timer = null;
    }
    return db.mount(this);
};
Index.prototype.commit = function () {
    if (this.commit_timer) {
        clearTimeout(this.commit_timer);
        this.commit_timer = null;
    }
    return this.db.commit(this);
};
Index.prototype.destroy = function () {
    if (this.commit_timer) {
        clearTimeout(this.commit_timer);
        this.commit_timer = null;
    }
    return this.db.destroy();
};

/**
 * @param {!Index} self
 */
export function autoCommit(self) {
    if (!self.commit_timer) {
        self.commit_timer = setTimeout(function () {
            self.commit_timer = null;
            self.db.commit(self);
        }, 1);
    }
}

Index.prototype.clear = function () {

    this.map.clear();
    this.ctx.clear();
    this.reg.clear();

    this.cache && this.cache.clear();


    if (this.db) {
        this.commit_timer && clearTimeout(this.commit_timer);
        this.commit_timer = null;
        this.commit_task = [];
        return this.db.clear();
    }

    return this;
};

/**
 * @param {!number|string} id
 * @param {!string} content
 */
Index.prototype.append = function (id, content) {
    return this.add(id, content, !0);
};

/**
 * @param {number|string} id
 * @return {boolean|Promise<boolean>}
 */
Index.prototype.contain = function (id) {
    return this.db ? this.db.has(id) : this.reg.has(id);
};

Index.prototype.update = function (id, content) {
    const self = this,
          res = this.remove(id);

    return res && res.then ? res.then(() => self.add(id, content)) : this.add(id, content);
};

Index.prototype.cleanup = function () {

    if (!this.fastupdate) {
        return this;
    }

    remove_index(this.map);

    this.depth && remove_index(this.ctx);

    return this;
};

Index.prototype.searchCache = searchCache;


Index.prototype.export = exportIndex;
Index.prototype.import = importIndex;
Index.prototype.serialize = serialize;


apply_async(Index.prototype);