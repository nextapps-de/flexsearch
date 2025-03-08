/**
 * @interface
 */
export default function StorageInterface() {}

// Mandatory Initializer
// ------------------------------

// assign store to an index
StorageInterface.prototype.mount = async function () {};
// open connection
StorageInterface.prototype.open = async function () {};
// close connection
StorageInterface.prototype.close = function () {};
// drop the database (drop tables)
StorageInterface.prototype.destroy = async function () {};

// Mandatory Query Tasks
// ------------------------------

// transfer all changes of an index to the database
StorageInterface.prototype.commit = async function () {};
// get results of a term "key" with optional context "ctx"
StorageInterface.prototype.get = async function () {};
// get documents stored in index (enrich result)
StorageInterface.prototype.enrich = async function () {};
// check if id exists on a specific index
StorageInterface.prototype.has = async function () {};
// delete one id or multiple ids on a specific index
StorageInterface.prototype.remove = async function () {};
// clear all data (truncate)
StorageInterface.prototype.clear = async function () {};

// Optional Methods
// ------------------------------

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