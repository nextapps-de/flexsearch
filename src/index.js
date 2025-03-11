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
    PROFILER,
    SUPPORT_ENCODER,
    SUPPORT_CACHE,
    SUPPORT_ASYNC,
    SUPPORT_SERIALIZE,
    SUPPORT_PERSISTENT,
    SUPPORT_COMPRESSION,
    SUPPORT_KEYSTORE,
    SUPPORT_RESOLVER,
    SUPPORT_CHARSET

} from "./config.js";
// <-- COMPILER BLOCK

import { IndexOptions, ContextOptions } from "./type.js";
import Encoder from "./encoder.js";
import Cache, { searchCache } from "./cache.js";
import Charset from "./charset.js";
import { KeystoreMap, KeystoreSet } from "./keystore.js";
import { is_array, is_string } from "./common.js";
import { exportIndex, importIndex, serialize } from "./serialize.js";
import default_encoder from "./charset/latin/default.js";
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

export default function Index(options, _register){

    if(!this){
        return new Index(options);
    }

    PROFILER && tick("Index.create");

    options = options
        ? apply_preset(options)
        : {};

    /** @type ContextOptions */
    const context = options.context || {};
    const encoder = options.encode || options.encoder || (
        SUPPORT_ENCODER ? default_encoder : function(str){
            return str.toLowerCase().trim().split(/\s+/);
        }
    );
    /** @type Encoder */
    this.encoder = encoder.encode
        ? encoder
        : typeof encoder === "object"
            ? (SUPPORT_ENCODER
                ? new Encoder(encoder)
                : encoder
            )
            : { encode: encoder };

    if(SUPPORT_COMPRESSION){
        this.compress = options.compress || options.compression || false;
    }

    let tmp;
    this.resolution = options.resolution || 9;
    this.tokenize = tmp = options.tokenize || "strict";
    this.depth = (tmp === "strict" && context.depth) || 0;
    this.bidirectional = context.bidirectional !== false;
    this.fastupdate = !!options.fastupdate;
    this.score = options.score || null;

    tmp = SUPPORT_KEYSTORE && (options.keystore || 0);
    tmp && (this.keystore = tmp);

    this.map = tmp && SUPPORT_KEYSTORE ? new KeystoreMap(tmp) : new Map();
    this.ctx = tmp && SUPPORT_KEYSTORE ? new KeystoreMap(tmp) : new Map();
    this.reg = _register || (
        this.fastupdate
            ? (tmp && SUPPORT_KEYSTORE ? new KeystoreMap(tmp) : new Map())
            : (tmp && SUPPORT_KEYSTORE ? new KeystoreSet(tmp) : new Set())
    );
    this.resolution_ctx = context.resolution || 1;
    this.rtl = (encoder.rtl) || options.rtl || false;

    if(SUPPORT_CACHE){
        this.cache = (tmp = options.cache || null) && new Cache(tmp);
    }

    if(SUPPORT_RESOLVER){
        this.resolve = options.resolve !== false;
    }

    if(SUPPORT_PERSISTENT){
        if((tmp = options.db)){
            this.db = tmp.mount(this);
        }
        this.commit_auto = options.commit !== false;
        this.commit_task = [];
        this.commit_timer = null;
    }
}

if(SUPPORT_PERSISTENT){
    Index.prototype.mount = function(db){
        if(this.commit_timer){
            clearTimeout(this.commit_timer);
            this.commit_timer = null;
        }
        return db.mount(this);
    };
    Index.prototype.commit = function(replace, append){
        if(this.commit_timer){
            clearTimeout(this.commit_timer);
            this.commit_timer = null;
        }
        return this.db.commit(this, replace, append);
    };
    Index.prototype.destroy = function(){
        if(this.commit_timer){
            clearTimeout(this.commit_timer);
            this.commit_timer = null;
        }
        return this.db.destroy();
    }
}

/**
 * @param {!Index} self
 * @param {boolean=} replace
 * @param {boolean=} append
 */

export function autoCommit(self, replace, append){
    if(!self.commit_timer){
        self.commit_timer = setTimeout(function(){
            self.commit_timer = null;
            self.db.commit(self, replace, append);
        }, 0);
    }
}

Index.prototype.clear = function(){

    this.map.clear();
    this.ctx.clear();
    this.reg.clear();

    if(SUPPORT_CACHE){
        this.cache &&
        this.cache.clear();
    }

    if(SUPPORT_PERSISTENT && this.db){
        this.commit_timer && clearTimeout(this.commit_timer);
        this.commit_timer = null;
        this.commit_task = [{ "clear": true }];
    }

    return this;
};

/**
 * @param {!number|string} id
 * @param {!string} content
 */

Index.prototype.append = function(id, content){
    return this.add(id, content, true);
};

Index.prototype.contain = function(id){
    return SUPPORT_PERSISTENT && this.db
        ? this.db.has(id)
        : this.reg.has(id);
};

Index.prototype.update = function(id, content){

    const self = this;
    const res = this.remove(id);
    return res && res.then
        ? res.then(() => self.add(id, content))
        : this.add(id, content);
};

/**
 * @param map
 * @return {number}
 */

function cleanup_index(map){

    let count = 0;

    if(is_array(map)){
        for(let i = 0, arr; i < map.length; i++){
            (arr = map[i]) &&
            (count += arr.length);
        }
    }
    else for(const item of map){
        const key = item[0];
        const value = item[1];
        const tmp = cleanup_index(value);
        tmp ? count += tmp
            : map.delete(key);
    }

    return count;
}

Index.prototype.cleanup = function(){

    if(!this.fastupdate){
        DEBUG && console.info("Cleanup the index isn't required when not using \"fastupdate\".");
        return this;
    }

    cleanup_index(this.map);
    this.depth &&
    cleanup_index(this.ctx);

    return this;
};

if(SUPPORT_CACHE){

    Index.prototype.searchCache = searchCache;
}

if(SUPPORT_SERIALIZE){

    Index.prototype.export = exportIndex;
    Index.prototype.import = importIndex;
    Index.prototype.serialize = serialize;
}

if(SUPPORT_ASYNC){

    apply_async(Index.prototype);
}
