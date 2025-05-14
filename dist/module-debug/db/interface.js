

/**
 * @interface
 */
export default function StorageInterface() {}

StorageInterface.prototype.mount = async function () {};

StorageInterface.prototype.open = async function () {};

StorageInterface.prototype.close = function () {};

StorageInterface.prototype.destroy = async function () {};

StorageInterface.prototype.commit = async function () {};
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
StorageInterface.prototype.get = async function () {};
/**
 * get documents stored in index (enrich result)
 * @param {SearchResults} ids
 * @return {!Promise<EnrichedSearchResults>}
 */
StorageInterface.prototype.enrich = async function () {};

StorageInterface.prototype.has = async function () {};

StorageInterface.prototype.remove = async function () {};

StorageInterface.prototype.clear = async function () {};

/**
 * Perform the query intersection on database side
 * @type {Function|null}
 */
StorageInterface.prototype.search = async function () {};

/**
 * Give some information about the storage
 * @type {Function|null}
 */
StorageInterface.prototype.info = async function () {};