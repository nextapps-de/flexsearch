// When you are looking for type definitions which fully describes the usage take a look into the index.d.ts file.
// Some of the types here aren't supposed to be used as public, they might be defined just for internal state.

import Index from "./index.js";
import Document from "./document.js";
import WorkerIndex from "./worker.js";
import Encoder from "./encoder.js";
import StorageInterface from "./db/interface.js";

/**
 * @typedef {{
 *   preset: (string|undefined),
 *   context: (IndexOptions|undefined),
 *   encoder: (Encoder|Function|Object|undefined),
 *   encode: (function(string):Array<string>|undefined),
 *   resolution: (number|undefined),
 *   tokenize: (string|undefined),
 *   fastupdate: (boolean|undefined),
 *   score: (function():number|undefined),
 *   keystore: (number|undefined),
 *   rtl: (boolean|undefined),
 *   cache: (number|boolean|undefined),
 *   db: (StorageInterface|undefined),
 *   commit: (boolean|undefined),
 *   worker: (string|undefined),
 *   config: (string|undefined),
 *   priority: (number|undefined),
 *   export: (Function|undefined),
 *   import: (Function|undefined)
 * }}
 */
export let IndexOptions = {};

/**
 * @typedef {{
 *   preset: (string|undefined),
 *   context: (IndexOptions|undefined),
 *   encoder: (Encoder|Function|Object|undefined),
 *   encode: (Function|undefined),
 *   resolution: (number|undefined),
 *   tokenize: (string|undefined),
 *   fastupdate: (boolean|undefined),
 *   score: (Function|undefined),
 *   keystore: (number|undefined),
 *   rtl: (boolean|undefined),
 *   cache: (number|boolean|undefined),
 *   db: (StorageInterface|undefined),
 *   commit: (boolean|undefined),
 *   config: (string|undefined),
 *   priority: (number|undefined),
 *   field: (string|undefined),
 *   filter: (Function|undefined),
 *   custom: (Function|undefined)
 * }}
 */
export let FieldOptions = {};

/**
 * @typedef {{
 *   context: (IndexOptions|undefined),
 *   encoder: (Encoder|Function|Object|undefined),
 *   encode: (Function|undefined),
 *   resolution: (number|undefined),
 *   tokenize: (string|undefined),
 *   fastupdate: (boolean|undefined),
 *   score: (Function|undefined),
 *   keystore: (number|undefined),
 *   rtl: (boolean|undefined),
 *   cache: (number|boolean|undefined),
 *   db: (StorageInterface|undefined),
 *   doc: (DocumentDescriptor|Array<DocumentDescriptor>|undefined),
 *   document: (DocumentDescriptor|Array<DocumentDescriptor>|undefined),
 *   worker: (boolean|string|undefined),
 *   priority: (number|undefined),
 *   export: (Function|undefined),
 *   import: (Function|undefined)
 * }}
 */
export let DocumentOptions = {};

/**
 * @typedef {{
 *   depth: (number|undefined),
 *   bidirectional: (boolean|undefined),
 *   resolution: (number|undefined),
 * }}
 */
export let ContextOptions = {};

/**
 * @typedef {{
 *   id: (string|undefined),
 *   field: (string|Array<string>|FieldOptions|Array<FieldOptions>|undefined),
 *   index: (string|Array<string>|FieldOptions|Array<FieldOptions>|undefined),
 *   tag: (string|Array<string>|TagOptions|Array<TagOptions>|undefined),
 *   store: (string|Array<string>|StoreOptions|Array<StoreOptions>|boolean|undefined),
 * }}
 */
export let DocumentDescriptor = {};

/**
 * @typedef {{
 *   field: string,
 *   filter: ((function(string):boolean)|undefined),
 *   custom: ((function(string):string)|undefined),
 *   db: (StorageInterface|undefined),
 * }}
 */
export let TagOptions = {};

/**
 * @typedef {{
 *   field: string,
 *   filter: ((function(string):boolean)|undefined),
 *   custom: ((function(string):string)|undefined)
 * }}
 */
export let StoreOptions = {};

/**
 * @typedef {{
 *   query: (string|undefined),
 *   limit: (number|undefined),
 *   offset: (number|undefined),
 *   resolution: (number|undefined),
 *   context: (boolean|undefined),
 *   suggest: (boolean|undefined),
 *   resolve: (boolean|undefined),
 *   enrich: (boolean|undefined),
 *   cache: (boolean|undefined)
 * }}
 */
export let SearchOptions = {};

/**
 * @typedef {{
 *   query: (string|undefined),
 *   limit: (number|undefined),
 *   offset: (number|undefined),
 *   resolution: (number|undefined),
 *   context: (boolean|undefined),
 *   suggest: (boolean|undefined),
 *   resolve: (boolean|undefined),
 *   enrich: (boolean|undefined),
 *   cache: (boolean|undefined),
 *   tag: (Object<string, string>|Array<Object<string, string>>|undefined),
 *   field: (Array<string>|Array<DocumentSearchOptions>|DocumentSearchOptions|string|undefined),
 *   index: (Array<string>|Array<DocumentSearchOptions>|DocumentSearchOptions|string|undefined),
 *   pluck: (string|DocumentSearchOptions|undefined),
 *   merge: (boolean|undefined),
 *   highlight: (HighlightOptions|string|undefined)
 * }}
 */
export let DocumentSearchOptions = {};

/**
 * @typedef Array<number|string>
 * @global
 */
export let SearchResults = [];

/**
 * @typedef Array<SearchResults>
 * @global
 */
export let IntermediateSearchResults = [];

/**
 * @typedef Array<{
 *   id: (number|string),
 *   doc: (Object|null),
 *   highlight: (string|undefined)
 * }>
 */
export let EnrichedSearchResults = [];

/**
 * @typedef Array<{
 *   field: (string|undefined),
 *   tag: (string|undefined),
 *   result: SearchResults
 * }>
 */
export let DocumentSearchResults = [];

/**
 * @typedef Array<{
 *   field: (string|undefined),
 *   tag: (string|undefined),
 *   result: EnrichedSearchResults
 * }>
 */
export let EnrichedDocumentSearchResults = [];

/**
 * @typedef {{
 *   id: (number|string),
 *   doc: (Object|null|undefined),
 *   field: (Array<string>|undefined),
 *   tag: (Array<string>|undefined),
 *   highlight: (Object<string, string>|undefined)
 * }}
 */
export let MergedDocumentSearchEntry = {};

/**
 * @typedef Array<MergedDocumentSearchEntry>
 */
export let MergedDocumentSearchResults = [];

/**
 * @typedef {{
 *   letter: (boolean|undefined),
 *   number: (boolean|undefined),
 *   symbol: (boolean|undefined),
 *   punctuation: (boolean|undefined),
 *   control: (boolean|undefined),
 *   char: (string|Array<string>|undefined)
 * }}
 */
export let EncoderSplitOptions = {};

/**
 * @typedef {{
 *   rtl: (boolean|undefined),
 *   dedupe: (boolean|undefined),
 *   include: (EncoderSplitOptions|undefined),
 *   exclude: (EncoderSplitOptions|undefined),
 *   split: (string|boolean|RegExp|undefined),
 *   numeric: (boolean|undefined),
 *   normalize: (boolean|(function(string):string)|undefined),
 *   prepare: ((function(string):string)|undefined),
 *   finalize: ((function(Array<string>):(Array<string>|void))|undefined),
 *   filter: (Set<string>|function(string):boolean|undefined),
 *   matcher: (Map<string, string>|undefined),
 *   mapper: (Map<string, string>|undefined),
 *   stemmer: (Map<string, string>|undefined),
 *   replacer: (Array<string|RegExp, string>|undefined),
 *   minlength: (number|undefined),
 *   maxlength: (number|undefined),
 *   cache: (boolean|undefined)
 * }}
 */
export let EncoderOptions = {};

/**
 * @typedef {{
 *   name: (string|undefined),
 *   field: (string|undefined),
 *   type: (string|undefined),
 *   db: (StorageInterface|undefined)
 * }}
 */
export let PersistentOptions = {};

/**
 * @typedef {{
 *   index: (Index|Document|WorkerIndex|undefined),
 *   query: (string|undefined),
 *   pluck: (string|undefined),
 *   field: (string|undefined),
 *   limit: (number|undefined),
 *   offset: (number|undefined),
 *   boost: (number|undefined),
 *   enrich: (boolean|undefined),
 *   highlight: (HighlightOptions|string|undefined),
 *   resolve: (boolean|undefined),
 *   suggest: (boolean|undefined),
 *   cache: (boolean|undefined),
 *   async: (boolean|undefined),
 *   queue: (boolean|undefined),
 *   and: (ResolverOptions|Array<ResolverOptions>|undefined),
 *   or: (ResolverOptions|Array<ResolverOptions>|undefined),
 *   xor: (ResolverOptions|Array<ResolverOptions>|undefined),
 *   not: (ResolverOptions|Array<ResolverOptions>|undefined)
 * }}
 */
export let ResolverOptions = {};

/**
 * @typedef {{
 *   before: (number|undefined),
 *   after: (number|undefined),
 *   total: (number|undefined)
 * }}
 */
export let HighlightBoundaryOptions = {};

/**
 * @typedef {{
 *   template: string,
 *   pattern: (string|boolean|undefined)
 * }}
 */
export let HighlightEllipsisOptions = {};

/**
 * @typedef {{
 *   template: string,
 *   boundary: (HighlightBoundaryOptions|number|undefined),
 *   clip: (boolean|undefined),
 *   merge: (boolean|undefined),
 *   ellipsis: (HighlightEllipsisOptions|string|boolean|undefined)
 * }}
 */
export let HighlightOptions = {};
