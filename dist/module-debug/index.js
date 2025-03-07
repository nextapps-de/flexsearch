/**!
 * FlexSearch.js
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */

import { IndexOptions } from "./type.js";
import Encoder from "./encoder.js";
import Cache, { searchCache } from "./cache.js";
import { KeystoreMap, KeystoreSet } from "./keystore.js";
import { is_array, is_string } from "./common.js";
import { exportIndex, importIndex } from "./serialize.js";
import { global_lang, global_charset } from "./global.js";
import default_encoder from "./lang/latin/default.js";
import apply_preset from "./preset.js";
import apply_async from "./async.js";
import tick from "./profiler.js";
import "./index/add.js";
import "./index/search.js";
import "./index/remove.js";

/**
 * @constructor
 * @param {IndexOptions|string=} options
 * @param {Map|Set|KeystoreSet|KeystoreMap=} _register
 */

export default function Index(options, _register) {

    if (!(this instanceof Index)) {
        return new Index(options);
    }

    if (options) {

        options = apply_preset(options);
        // charset = options.charset;
        // // lang = options.lang;
        //
        // if(is_string(charset)){
        //
        //     if(!charset.includes(":")){
        //         charset += ":default";
        //     }
        //
        //     charset = global_charset[charset];
        // }

        // if(is_string(lang)){
        //
        //     lang = global_lang[lang];
        // }
    } else {
        options = {};
    }

    // let charset, lang, tmp;

    const context = options.context || {},
          encoder = options.encode || options.encoder || default_encoder;

    this.encoder = encoder.encode ? encoder : "object" == typeof encoder ? new Encoder(encoder) : { encode: encoder };

    this.compress = options.compress || options.compression || /* suggest */ /* append: */ /* enrich */!1;


    let tmp;
    this.resolution = options.resolution || 9;
    this.tokenize = tmp = options.tokenize || "strict";
    this.depth = "strict" === tmp && context.depth || 0;
    this.bidirectional = !1 !== context.bidirectional;
    this.fastupdate = !!options.fastupdate;
    this.score = options.score || null;

    tmp = options.keystore || 0;
    tmp && (this.keystore = tmp);

    this.map = tmp ? new KeystoreMap(tmp) : new Map();
    this.ctx = tmp ? new KeystoreMap(tmp) : new Map();
    this.reg = _register || (this.fastupdate ? tmp ? new KeystoreMap(tmp) : new Map() : tmp ? new KeystoreSet(tmp) : new Set());
    this.resolution_ctx = context.resolution || 1;
    this.rtl = encoder.rtl || options.rtl || !1;

    this.cache = (tmp = options.cache || null) && new Cache(tmp);

    this.resolve = !1 !== options.resolve;

    if (tmp = options.db) {
        this.db = tmp.mount(this);
    }
    this.commit_auto = !1 !== options.commit;
    this.commit_task = [];
    this.commit_timer = null;
}

Index.prototype.mount = function (db) {
    if (this.commit_timer) {
        clearTimeout(this.commit_timer);
        this.commit_timer = null;
    }
    return db.mount(this);
};
Index.prototype.commit = function (replace, append) {
    if (this.commit_timer) {
        clearTimeout(this.commit_timer);
        this.commit_timer = null;
    }
    return this.db.commit(this, replace, append);
};

// if(SUPPORT_RESOLVER){
//     Index.prototype.resolve = function(params){
//         return new Resolver(params);
//     };
// }

/**
 * @param {!Index} self
 * @param {boolean=} replace
 * @param {boolean=} append
 */

export function autoCommit(self, replace, append) {
    if (!self.commit_timer) {
        self.commit_timer = setTimeout(function () {
            self.commit_timer = null;
            self.db.commit(self, replace, append);
        }, 0);
    }
}

Index.prototype.clear = function () {

    //this.map = new Map();
    //this.ctx = new Map();
    //this.reg = this.fastupdate ? new Map() : new Set();
    this.map.clear();
    this.ctx.clear();
    this.reg.clear();

    this.cache && this.cache.clear();


    if (this.db) {
        this.commit_timer && clearTimeout(this.commit_timer);
        this.commit_timer = null;
        this.commit_task = [{ clear: /* tag? */ /* stringify */ /* stringify */ /* skip update: */ /* append: */ /* skip update: */ /* skip_update: */ /* skip deletion */!0 /*await rows.hasNext()*/ /*await rows.hasNext()*/ /*await rows.hasNext()*/ }];
        //return this.db.clear();
    }

    return this;
};

//Index.prototype.pipeline = pipeline;

/**
 * @param {!number|string} id
 * @param {!string} content
 */

Index.prototype.append = function (id, content) {
    return this.add(id, content, !0);
};

Index.prototype.contain = function (id) {

    if (this.db) {
        return this.db.has(id);
    }

    return this.reg.has(id);
};

Index.prototype.update = function (id, content) {

    // todo check the async part
    if (this.async /*|| (SUPPORT_PERSISTENT && this.db)*/) {
            const self = this,
                  res = this.remove(id);

            return res.then ? res.then(() => self.add(id, content)) : this.add(id, content);
        }

    return this.remove(id).add(id, content);
};

/**
 * @param map
 * @return {number}
 */

function cleanup_index(map) {

    let count = 0;

    if (is_array(map)) {
        for (let i = 0, arr; i < map.length; i++) {
            (arr = map[i]) && (count += arr.length);
        }
    } else for (const item of map) {
        const key = item[0],
              value = item[1],
              tmp = cleanup_index(value);

        tmp ? count += tmp : map.delete(key);
    }

    return count;
}

Index.prototype.cleanup = function () {

    if (!this.fastupdate) {
        console.info("Cleanup the index isn't required when not using \"fastupdate\".");
        return this;
    }

    cleanup_index(this.map);
    this.depth && cleanup_index(this.ctx);

    return this;
};

Index.prototype.searchCache = searchCache;


Index.prototype.export = exportIndex;
Index.prototype.import = importIndex;


apply_async(Index.prototype);