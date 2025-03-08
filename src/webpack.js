// COMPILER BLOCK -->
import {
    RELEASE,
    SUPPORT_ASYNC,
    SUPPORT_DOCUMENT,
    SUPPORT_CACHE,
    SUPPORT_SERIALIZE,
    SUPPORT_WORKER,
    SUPPORT_ENCODER,
    SUPPORT_CHARSET,
    SUPPORT_PERSISTENT,
    SUPPORT_RESOLVER,
    SUPPORT_STORE
} from "./config.js";
// <-- COMPILER BLOCK
import {
    SearchOptions,
    ContextOptions,
    DocumentDescriptor,
    DocumentSearchOptions,
    FieldOptions,
    IndexOptions,
    DocumentOptions
} from "./type.js";
import Document from "./document.js";
import Index from "./index.js";
import WorkerIndex from "./worker/index.js";
import Resolver from "./resolver.js";
import Encoder from "./encoder.js";
import IdxDB from "./db/indexeddb/index.js";
import { global_charset } from "./charset.js";
import charset_exact from "./lang/latin/exact.js"
import charset_default from "./lang/latin/default.js"
import charset_simple from "./lang/latin/simple.js"
import charset_balance from "./lang/latin/balance.js"
import charset_advanced from "./lang/latin/advanced.js"
import charset_extra from "./lang/latin/extra.js"
import charset_soundex from "./lang/latin/soundex.js"

/** @export */ Index.prototype.add;
/** @export */ Index.prototype.append;
/** @export */ Index.prototype.search;
/** @export */ Index.prototype.update;
/** @export */ Index.prototype.remove;
/** @export */ Index.prototype.contain;
/** @export */ Index.prototype.clear;
/** @export */ Index.prototype.cleanup;

if(SUPPORT_DOCUMENT){
/** @export */ Document.prototype.add;
/** @export */ Document.prototype.append;
/** @export */ Document.prototype.search;
/** @export */ Document.prototype.update;
/** @export */ Document.prototype.remove;
/** @export */ Document.prototype.contain;
/** @export */ Document.prototype.clear;
/** @export */ Document.prototype.cleanup;
}
if(SUPPORT_DOCUMENT && SUPPORT_STORE){
/** @export */ Document.prototype.get;
/** @export */ Document.prototype.set;
}

if(SUPPORT_CACHE){
/** @export */ Index.prototype.searchCache;
}
if(SUPPORT_CACHE && SUPPORT_DOCUMENT){
/** @export */ Document.prototype.searchCache;
}

if(SUPPORT_ASYNC){
/** @export */ Index.prototype.addAsync;
/** @export */ Index.prototype.appendAsync;
/** @export */ Index.prototype.searchAsync;
/** @export */ Index.prototype.updateAsync;
/** @export */ Index.prototype.removeAsync;
}
if(SUPPORT_ASYNC && SUPPORT_DOCUMENT){
/** @export */ Document.prototype.addAsync;
/** @export */ Document.prototype.appendAsync;
/** @export */ Document.prototype.searchAsync;
/** @export */ Document.prototype.updateAsync;
/** @export */ Document.prototype.removeAsync;
}

if(SUPPORT_SERIALIZE){
/** @export */ Index.prototype.export;
/** @export */ Index.prototype.import;
}
if(SUPPORT_SERIALIZE && SUPPORT_DOCUMENT){
/** @export */ Document.prototype.export;
/** @export */ Document.prototype.import;
}

if(SUPPORT_PERSISTENT){
/** @export */ Index.prototype.mount;
/** @export */ Index.prototype.commit;
/** @export */ Index.db;
}
if(SUPPORT_PERSISTENT && SUPPORT_DOCUMENT){
/** @export */ Document.prototype.mount;
/** @export */ Document.prototype.commit;
/** @export */ Document.db;
}

/** @export */ IndexOptions.preset;
/** @export */ IndexOptions.context;
/** @export */ IndexOptions.encoder;
/** @export */ IndexOptions.encode;
/** @export */ IndexOptions.resolution;
/** @export */ IndexOptions.tokenize;
/** @export */ IndexOptions.fastupdate;
/** @export */ IndexOptions.score;
/** @export */ IndexOptions.keystore;
/** @export */ IndexOptions.rtl;
/** @export */ IndexOptions.cache;
/** @export */ IndexOptions.resolve;
/** @export */ IndexOptions.db;

/** @export */ DocumentOptions.context;
/** @export */ DocumentOptions.encoder;
/** @export */ DocumentOptions.encode;
/** @export */ DocumentOptions.resolution;
/** @export */ DocumentOptions.tokenize;
/** @export */ DocumentOptions.fastupdate;
/** @export */ DocumentOptions.score;
/** @export */ DocumentOptions.keystore;
/** @export */ DocumentOptions.rtl;
/** @export */ DocumentOptions.cache;
/** @export */ DocumentOptions.db;
/** @export */ DocumentOptions.doc;
/** @export */ DocumentOptions.document;
/** @export */ DocumentOptions.worker;

/** @export */ DocumentDescriptor.field;
/** @export */ DocumentDescriptor.index;
/** @export */ DocumentDescriptor.tag;
/** @export */ DocumentDescriptor.store;

/** @export */ ContextOptions.depth;
/** @export */ ContextOptions.bidirectional;
/** @export */ ContextOptions.resolution;

/** @export */ SearchOptions.query;
/** @export */ SearchOptions.limit;
/** @export */ SearchOptions.offset;
/** @export */ SearchOptions.context;
/** @export */ SearchOptions.suggest;
/** @export */ SearchOptions.resolve;
/** @export */ SearchOptions.enrich;
/** @export */ SearchOptions.tag;

/** @export */ DocumentSearchOptions.query;
/** @export */ DocumentSearchOptions.limit;
/** @export */ DocumentSearchOptions.offset;
/** @export */ DocumentSearchOptions.context;
/** @export */ DocumentSearchOptions.suggest;
/** @export */ DocumentSearchOptions.enrich;
/** @export */ DocumentSearchOptions.tag;
/** @export */ DocumentSearchOptions.field;
/** @export */ DocumentSearchOptions.index;
/** @export */ DocumentSearchOptions.pluck;
/** @export */ DocumentSearchOptions.merge;

if(SUPPORT_CHARSET){
    global_charset["latin:exact"] = charset_exact;
    global_charset["latin:default"] = charset_default;
    global_charset["latin:simple"] = charset_simple;
    global_charset["latin:balance"] = charset_balance;
    global_charset["latin:advanced"] = charset_advanced;
    global_charset["latin:extra"] = charset_extra;
    global_charset["latin:soundex"] = charset_soundex;
}

const FlexSearch = {
    "Index": Index,
    "Charset": global_charset,
    "Encoder": SUPPORT_ENCODER ? Encoder : null,
    "Document": SUPPORT_DOCUMENT ? Document : null,
    "Worker": SUPPORT_WORKER ? WorkerIndex : null,
    "Resolver": SUPPORT_RESOLVER ? Resolver : null,
    "IndexedDB": SUPPORT_PERSISTENT ? IdxDB : null,
    //"registerCharset": registerCharset,
    //"registerLanguage": registerLanguage
};

// Export as library (Bundle)
// --------------------------------

if(RELEASE !== "bundle.module" &&
   RELEASE !== "light.module" &&
   RELEASE !== "compact.module" &&
   RELEASE !== "custom.module"){

    const root = self;
    let prop;

    // AMD (RequireJS)
    if((prop = root["define"]) && prop["amd"]){
        prop([], function(){
            return FlexSearch;
        });
    }
    // CommonJS
    else if(typeof root["exports"] === "object"){
        root["exports"] = FlexSearch;
    }
    // Global (window)
    else{
        /** @export */
        root.FlexSearch = FlexSearch;
    }
}
else{
    /** @export */
    window.FlexSearch = FlexSearch;
}
