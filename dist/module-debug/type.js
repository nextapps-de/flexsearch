// When you are looking for type definitions which fully describes the usage take a look into the index.d.ts file.
// Some of the types here aren't supposed to be used as public, they might be defined just for internal state.
import Encoder from "./encoder.js";
import StorageInterface from "./db/interface.js";

/**
 * @typedef IndexOptions {{
 *   preset: string|undefined,
 *   context: (IndexOptions|undefined),
 *   encoder: Encoder|Function|Object|undefined,
 *   encode: Function|undefined,
 *   resolution: [number=9],
 *   tokenize: [string="strict"],
 *   fastupdate: [boolean:false],
 *   score: Function]|undefined,
 *   keystore: [number=0],
 *   rtl: [boolean=false],
 *   cache: [number=null],
 *   resolve: [boolean=true],
 *   db: StorageInterface|undefined,
 *   config: string|undefined
 * }}
 */
export let IndexOptions;

/**
 * @typedef DocumentIndexOptions {{
 *   preset: string|undefined,
 *   context: (IndexOptions|undefined),
 *   encoder: Encoder|Function|Object|undefined,
 *   encode: Function|undefined,
 *   resolution: [number=9],
 *   tokenize: [string="strict"],
 *   fastupdate: [boolean:false],
 *   score: Function]|undefined,
 *   keystore: [number=0],
 *   rtl: [boolean=false],
 *   cache: [number=null],
 *   db: StorageInterface|undefined,
 *   config: string|undefined,
 *
 *   field: string,
 *   filter: Function|undefined,
 *   custom: Function|undefined
 * }}
 */
export let DocumentIndexOptions;

/**
 * @typedef DocumentOptions {{
 *   context: (IndexOptions|undefined),
 *   encoder: Encoder|Function|Object|undefined,
 *   encode: Function|undefined,
 *   resolution: [number=9],
 *   tokenize: [string="strict"],
 *   fastupdate: [boolean:false],
 *   score: Function]|undefined,
 *   keystore: [number=0],
 *   rtl: [boolean=false],
 *   cache: [number=null],
 *   db: StorageInterface|undefined,
 *   doc: DocumentDescriptor|Array<DocumentDescriptor>|undefined,
 *   document: DocumentDescriptor|Array<DocumentDescriptor>|undefined,
 *   worker: boolean|string|undefined
 * }}
 */
export let DocumentOptions;

/**
 * @typedef ContextOptions {{
 *   depth: number,
 *   bidirectional: boolean|undefined,
 *   resolution: number|undefined
 * }}
 */
export let ContextOptions;

/**
 * @typedef DocumentDescriptor {{
 *   id: string="id",
 *   field: FieldOptions|Array<FieldOptions>|undefined,
 *   index: FieldOptions|Array<FieldOptions>|undefined,
 *   tag: TagOptions|Array<TagOptions>|undefined,
 *   store: StoreOptions|Array<StoreOptions>|undefined
 * }}
 */
export let DocumentDescriptor;

/**
 * @typedef TagOptions {{
 *   field: string,
 *   tag: Object<string, string|Array<string>>|Array<string>|string,
 *   filter: Function|undefined,
 *   custom: Function|undefined,
 *   keystore: [number=0],
 *   db: StorageInterface|undefined,
 *   config: string|undefined
 * }}
 */
export let TagOptions;

/**
 * @typedef StoreOptions {{
 *   field: string,
 *   filter: Function|undefined,
 *   custom: Function|undefined,
 *   config: string|undefined
 * }}
 */
export let StoreOptions;

/**
 * @typedef SearchOptions {{
 *   query: string=,
 *   limit: [number=100],
 *   offset: [number=0],
 *   context: boolean|undefined,
 *   suggest: [boolean=false],
 *   resolve: [boolean=true],
 *   enrich: [boolean=false],
 * }}
 */
export let SearchOptions;
// tag: Array|undefined

/**
 * @typedef DocumentSearchOptions {{
 *   query: string=,
 *   limit: [number=100],
 *   offset: [number=0],
 *   context: boolean|undefined,
 *   suggest: [boolean=false],
 *   enrich: [boolean=false],
 *   tag: Object|Array<Object>|undefined,
 *   field: Array<DocumentSearchOptions>|undefined,
 *   index: Array<DocumentSearchOptions>|undefined,
 *   pluck: boolean|undefined,
 *   merge: [boolean=false]
 * }}
 */
export let DocumentSearchOptions;

/**
 * @typedef EncoderOptions {{
 *   rtl: boolean=false,
 *   dedupe: boolean=true,
 *   split: string|undefined,
 *   include: EncoderSplitOptions|undefined,
 *   exclude: EncoderSplitOptions|undefined,
 *   prepare: function(string):string|undefined,
 *   finalize: function(Array<>string>):Array<string>|undefined,
 *   filter: Set|undefined,
 *   matcher: Map|undefined,
 *   mapper: Map|undefined,
 *   stemmer: Map|undefined,
 *   replacer: Array<string|RegExp>|undefined,
 *   minlength: number=1,
 *   maxlength: number|undefined,
 *   cache: boolean=true,
 * }}
 */
export let EncoderOptions;

/**
 * @typedef EncoderSplitOptions {{
 *   letter: boolean=false,
 *   number: boolean=false,
 *   symbol: boolean=false,
 *   punctuation: boolean=false,
 *   control: boolean=false,
 *   char: string|Array<string>|undefined,
 * }}
 */
export let EncoderSplitOptions;