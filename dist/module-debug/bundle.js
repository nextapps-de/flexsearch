
import { SearchOptions, ContextOptions, DocumentDescriptor, DocumentSearchOptions, FieldOptions, IndexOptions, DocumentOptions, TagOptions, StoreOptions, EncoderOptions, EncoderSplitOptions, PersistentOptions, ResolverOptions, HighlightBoundaryOptions, HighlightEllipsisOptions, HighlightOptions } from "./type.js";
import StorageInterface from "./db/interface.js";
import Document from "./document.js";
import Index from "./index.js";
import WorkerIndex from "./worker.js";
import Resolver from "./resolver.js";
import Encoder from "./encoder.js";
import IdxDB from "./db/indexeddb/index.js";
import Charset from "./charset.js";
import { KeystoreMap, KeystoreArray, KeystoreSet } from "./keystore.js";

/** @export */Index.prototype.add;
/** @export */Index.prototype.append;
/** @export */Index.prototype.search;
/** @export */Index.prototype.update;
/** @export */Index.prototype.remove;
/** @export */Index.prototype.contain;
/** @export */Index.prototype.clear;
/** @export */Index.prototype.cleanup;
/** @export */Index.prototype.searchCache;
/** @export */Index.prototype.addAsync;
/** @export */Index.prototype.appendAsync;
/** @export */Index.prototype.searchAsync;
/** @export */Index.prototype.searchCacheAsync;
/** @export */Index.prototype.updateAsync;
/** @export */Index.prototype.removeAsync;
/** @export */Index.prototype.export;
/** @export */Index.prototype.import;
/** @export */Index.prototype.serialize;
/** @export */Index.prototype.mount;
/** @export */Index.prototype.commit;
/** @export */Index.prototype.destroy;
/** @export */Index.prototype.encoder;

/** @export */Index.prototype.reg;
/** @export */Index.prototype.map;
/** @export */Index.prototype.ctx;

/** @export */Index.prototype.db;
/** @export */Index.prototype.tag;
/** @export */Index.prototype.store;
/** @export */Index.prototype.depth;
/** @export */Index.prototype.bidirectional;
/** @export */Index.prototype.commit_task;
/** @export */Index.prototype.commit_timer;
/** @export */Index.prototype.cache;
/** @export */Index.prototype.bypass;
/** @export */Index.prototype.document;

/** @export */Encoder.prototype.assign;
/** @export */Encoder.prototype.encode;
/** @export */Encoder.prototype.addMatcher;
/** @export */Encoder.prototype.addStemmer;
/** @export */Encoder.prototype.addFilter;
/** @export */Encoder.prototype.addMapper;
/** @export */Encoder.prototype.addReplacer;

/** @export */Document.prototype.add;
/** @export */Document.prototype.append;
/** @export */Document.prototype.search;
/** @export */Document.prototype.update;
/** @export */Document.prototype.remove;
/** @export */Document.prototype.contain;
/** @export */Document.prototype.clear;
/** @export */Document.prototype.cleanup;
/** @export */Document.prototype.addAsync;
/** @export */Document.prototype.appendAsync;
/** @export */Document.prototype.updateAsync;
/** @export */Document.prototype.removeAsync;
/** @export */Document.prototype.searchAsync;
/** @export */Document.prototype.searchCacheAsync;
/** @export */Document.prototype.searchCache;
/** @export */Document.prototype.mount;
/** @export */Document.prototype.commit;
/** @export */Document.prototype.destroy;
/** @export */Document.prototype.export;
/** @export */Document.prototype.import;
/** @export */Document.prototype.get;
/** @export */Document.prototype.set;

/** @export */Document.prototype.field;
/** @export */Document.prototype.index;
/** @export */Document.prototype.reg;
/** @export */Document.prototype.tag;
/** @export */Document.prototype.store;
/** @export */Document.prototype.fastupdate;

/** @export */Resolver.prototype.limit;
/** @export */Resolver.prototype.offset;
/** @export */Resolver.prototype.boost;
/** @export */Resolver.prototype.resolve;
/** @export */Resolver.prototype.or;
/** @export */Resolver.prototype.and;
/** @export */Resolver.prototype.xor;
/** @export */Resolver.prototype.not;
/** @export */Resolver.prototype.result;
/** @export */Resolver.prototype.await;

/** @export */StorageInterface.db;
/** @export */StorageInterface.id;
/** @export */StorageInterface.support_tag_search;
/** @export */StorageInterface.fastupdate;
/** @export */StorageInterface.prototype.mount;
/** @export */StorageInterface.prototype.open;
/** @export */StorageInterface.prototype.close;
/** @export */StorageInterface.prototype.destroy;
/** @export */StorageInterface.prototype.clear;
/** @export */StorageInterface.prototype.get;
/** @export */StorageInterface.prototype.tag;
/** @export */StorageInterface.prototype.enrich;
/** @export */StorageInterface.prototype.has;
/** @export */StorageInterface.prototype.search;
/** @export */StorageInterface.prototype.info;
/** @export */StorageInterface.prototype.commit;
/** @export */StorageInterface.prototype.remove;

/** @export */KeystoreArray.length;
/** @export */KeystoreMap.size;
/** @export */KeystoreSet.size;

/** @export */Charset.Exact;
/** @export */Charset.Default;
/** @export */Charset.Normalize;
/** @export */Charset.LatinBalance;
/** @export */Charset.LatinAdvanced;
/** @export */Charset.LatinExtra;
/** @export */Charset.LatinSoundex;
/** @export */Charset.CJK;
/** @export @deprecated */Charset.LatinExact;
/** @export @deprecated */Charset.LatinDefault;
/** @export @deprecated */Charset.LatinSimple;
/** @export @deprecated */Charset.ArabicDefault;
/** @export @deprecated */Charset.CjkDefault;
/** @export @deprecated */Charset.CyrillicDefault;

/** @export */IndexOptions.preset;
/** @export */IndexOptions.context;
/** @export */IndexOptions.encoder;
/** @export */IndexOptions.encode;
/** @export */IndexOptions.resolution;
/** @export */IndexOptions.tokenize;
/** @export */IndexOptions.fastupdate;
/** @export */IndexOptions.score;
/** @export */IndexOptions.keystore;
/** @export */IndexOptions.rtl;
/** @export */IndexOptions.cache;
/** @export */IndexOptions.resolve;
/** @export */IndexOptions.db;
/** @export */IndexOptions.worker;
/** @export */IndexOptions.config;
/** @export */IndexOptions.priority;
/** @export */IndexOptions.export;
/** @export */IndexOptions.import;

/** @export */FieldOptions.preset;
/** @export */FieldOptions.context;
/** @export */FieldOptions.encoder;
/** @export */FieldOptions.encode;
/** @export */FieldOptions.resolution;
/** @export */FieldOptions.tokenize;
/** @export */FieldOptions.fastupdate;
/** @export */FieldOptions.score;
/** @export */FieldOptions.keystore;
/** @export */FieldOptions.rtl;
/** @export */FieldOptions.cache;
/** @export */FieldOptions.db;
/** @export */FieldOptions.config;
/** @export */FieldOptions.resolve;
/** @export */FieldOptions.field;
/** @export */FieldOptions.filter;
/** @export */FieldOptions.custom;
/** @export */FieldOptions.worker;

/** @export */DocumentOptions.context;
/** @export */DocumentOptions.encoder;
/** @export */DocumentOptions.encode;
/** @export */DocumentOptions.resolution;
/** @export */DocumentOptions.tokenize;
/** @export */DocumentOptions.fastupdate;
/** @export */DocumentOptions.score;
/** @export */DocumentOptions.keystore;
/** @export */DocumentOptions.rtl;
/** @export */DocumentOptions.cache;
/** @export */DocumentOptions.db;
/** @export */DocumentOptions.doc;
/** @export */DocumentOptions.document;
/** @export */DocumentOptions.worker;
/** @export */DocumentOptions.priority;
/** @export */DocumentOptions.export;
/** @export */DocumentOptions.import;

/** @export */ContextOptions.depth;
/** @export */ContextOptions.bidirectional;
/** @export */ContextOptions.resolution;

/** @export */DocumentDescriptor.field;
/** @export */DocumentDescriptor.index;
/** @export */DocumentDescriptor.tag;
/** @export */DocumentDescriptor.store;
/** @export */DocumentDescriptor.id;

/** @export */TagOptions.field;
/** @export */TagOptions.tag;
/** @export */TagOptions.filter;
/** @export */TagOptions.custom;
/** @export */TagOptions.keystore;
/** @export */TagOptions.db;
/** @export */TagOptions.config;

/** @export */StoreOptions.field;
/** @export */StoreOptions.filter;
/** @export */StoreOptions.custom;
/** @export */StoreOptions.config;

/** @export */SearchOptions.query;
/** @export */SearchOptions.limit;
/** @export */SearchOptions.offset;
/** @export */SearchOptions.context;
/** @export */SearchOptions.suggest;
/** @export */SearchOptions.resolve;
/** @export */SearchOptions.cache;
/** @export */SearchOptions.resolution;

/** @export */DocumentSearchOptions.query;
/** @export */DocumentSearchOptions.limit;
/** @export */DocumentSearchOptions.offset;
/** @export */DocumentSearchOptions.context;
/** @export */DocumentSearchOptions.suggest;
/** @export */DocumentSearchOptions.resolve;
/** @export */DocumentSearchOptions.enrich;
/** @export */DocumentSearchOptions.cache;
/** @export */DocumentSearchOptions.resolution;
/** @export */DocumentSearchOptions.tag;
/** @export */DocumentSearchOptions.field;
/** @export */DocumentSearchOptions.index;
/** @export */DocumentSearchOptions.pluck;
/** @export */DocumentSearchOptions.merge;
/** @export */DocumentSearchOptions.highlight;

/** @export */EncoderOptions.rtl;
/** @export */EncoderOptions.dedupe;
/** @export */EncoderOptions.split;
/** @export */EncoderOptions.include;
/** @export */EncoderOptions.exclude;
/** @export */EncoderOptions.prepare;
/** @export */EncoderOptions.finalize;
/** @export */EncoderOptions.filter;
/** @export */EncoderOptions.matcher;
/** @export */EncoderOptions.mapper;
/** @export */EncoderOptions.stemmer;
/** @export */EncoderOptions.replacer;
/** @export */EncoderOptions.minlength;
/** @export */EncoderOptions.maxlength;
/** @export */EncoderOptions.cache;

/** @export */EncoderSplitOptions.letter;
/** @export */EncoderSplitOptions.number;
/** @export */EncoderSplitOptions.symbol;
/** @export */EncoderSplitOptions.punctuation;
/** @export */EncoderSplitOptions.control;
/** @export */EncoderSplitOptions.char;

/** @export */PersistentOptions.name;
/** @export */PersistentOptions.field;
/** @export */PersistentOptions.type;
/** @export */PersistentOptions.db;

/** @export */ResolverOptions.index;
/** @export */ResolverOptions.query;
/** @export */ResolverOptions.limit;
/** @export */ResolverOptions.offset;
/** @export */ResolverOptions.boost;
/** @export */ResolverOptions.enrich;
/** @export */ResolverOptions.resolve;
/** @export */ResolverOptions.suggest;
/** @export */ResolverOptions.cache;
/** @export */ResolverOptions.async;
/** @export */ResolverOptions.queue;
/** @export */ResolverOptions.and;
/** @export */ResolverOptions.or;
/** @export */ResolverOptions.xor;
/** @export */ResolverOptions.not;
/** @export */ResolverOptions.pluck;
/** @export */ResolverOptions.field;

/** @export */HighlightBoundaryOptions.before;
/** @export */HighlightBoundaryOptions.after;
/** @export */HighlightBoundaryOptions.total;

/** @export */HighlightEllipsisOptions.template;
/** @export */HighlightEllipsisOptions.pattern;

/** @export */HighlightOptions.template;
/** @export */HighlightOptions.boundary;
/** @export */HighlightOptions.ellipsis;
/** @export */HighlightOptions.clip;
/** @export */HighlightOptions.merge;

const FlexSearch = {
    Index: Index,
    Charset: Charset,
    Encoder: Encoder,
    Document: Document,
    Worker: WorkerIndex,
    Resolver: Resolver,
    IndexedDB: IdxDB,
    Language: {}
};

{

    const root = "undefined" != typeof self ? self : "undefined" != typeof global ? global : self;
    let prop;

    if ((prop = root.define) && prop.amd) {
        prop([], function () {
            return FlexSearch;
        });
    } else if ("object" == typeof root.exports) {
        root.exports = FlexSearch;
    } else {
        /** @export */
        root.FlexSearch = FlexSearch;
    }
}


export default FlexSearch;
export { Index, Document, Encoder, Charset, WorkerIndex as Worker, Resolver, IdxDB as IndexedDB };