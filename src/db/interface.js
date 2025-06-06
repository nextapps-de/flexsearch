import { PersistentOptions, SearchResults, EnrichedSearchResults } from "../type.js";

/**
 * @interface
 */
export default function StorageInterface(name, config){};

// Mandatory Initializer
// ------------------------------

// assign store to an index
StorageInterface.prototype.mount = async function(index){};
// open connection
StorageInterface.prototype.open = async function(){};
// close connection
StorageInterface.prototype.close = function(){};
// drop the database (drop tables)
StorageInterface.prototype.destroy = async function(){};

// Mandatory Query Tasks
// ------------------------------

// transfer all changes of an index to the database
StorageInterface.prototype.commit = async function(index/*, _replace, _append*/){};
/**
 * get results of a term "key" with optional context "ctx"
 * @param {!string} key
 * @param {string=} ctx
 * @param {number=} limit
 * @param {number=} offset
 * @param {boolean=} resolve
 * @param {boolean=} enrich
 * @return {!Promise<SearchResults|EnrichedSearchResults>}
 */
StorageInterface.prototype.get = async function(key, ctx, limit, offset, resolve, enrich){};
/**
 * get documents stored in index (enrich result)
 * @param {SearchResults} ids
 * @return {!Promise<EnrichedSearchResults>}
 */
StorageInterface.prototype.enrich = async function(ids){};
// check if id exists on a specific index
StorageInterface.prototype.has = async function(id){};
// delete one id or multiple ids on a specific index
StorageInterface.prototype.remove = async function(ids){};
// clear all data (truncate)
StorageInterface.prototype.clear = async function(){};

// Optional Methods
// ------------------------------

/**
 * Perform the query intersection on database side
 * @type {Function|null}
 */
StorageInterface.prototype.search = async function(index, query, limit, offset, suggest, resolve, enrich){};

/**
 * Give some information about the storage
 * @type {Function|null}
 */
StorageInterface.prototype.info = async function(){};
