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
 *   field: FieldOptions|Array<FieldOptions>|undefined,
 *   index: FieldOptions|Array<FieldOptions>|undefined,
 *   tag: TagOptions|Array<TagOptions>|undefined,
 *   store: StoreOptions|Array<StoreOptions>|undefined,
 *   config: string|undefined
 * }}
 */
export let DocumentDescriptor;

/**
 * @typedef FieldOptions {{
 *   field: string,
 *   filter: Function|undefined,
 *   custom: Function|undefined,
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
 *   config: string|undefined
 * }}
 */
export let FieldOptions;

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
 *   keystore: [number=0],
 *   db: StorageInterface|undefined,
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
 *   tag: Array|undefined
 * }}
 */
export let SearchOptions;

/**
 * @typedef DocumentSearchOptions {{
 *   query: string=,
 *   limit: [number=100],
 *   offset: [number=0],
 *   context: boolean|undefined,
 *   suggest: [boolean=false],
 *   enrich: [boolean=false],
 *   tag: Array|undefined,
 *   field: FieldOptions|Array<FieldOptions>|undefined,
 *   index: FieldOptions|Array<FieldOptions>|undefined,
 *   pluck: boolean|undefined,
 *   merge: [boolean=false]
 * }}
 */
export let DocumentSearchOptions;

export let EncoderOptions;
export let ResolverOptions;