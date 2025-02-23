/**
 * @interface
 */
export default function StorageInterface(sid, field){};

// Mandatory Initializer
// ------------------------------

// assign store to an index
StorageInterface.prototype.mount = async function(index){};
// open connection
StorageInterface.prototype.open = async function(){};
// close connection
StorageInterface.prototype.close = async function(){};
// drop the database (drop tables)
StorageInterface.prototype.destroy = async function(){};

// Mandatory Query Tasks
// ------------------------------

// transfer all changes of an index to the database
StorageInterface.prototype.commit = async function(){};
// get results of a term "key" with optional context "ctx"
StorageInterface.prototype.get = async function(key, ctx, limit, offset, resolve){};
// check if id exists on a specific index
StorageInterface.prototype.has = async function(id){};
// delete one id or multiple ids on a specific index
StorageInterface.prototype.remove = async function(ids){};
// clear all data (truncate)
StorageInterface.prototype.clear = async function(){};

// Optional Methods
// ------------------------------

// perform the query intersection on database side
StorageInterface.prototype.search = async function(index, query, suggest, limit, offset, resolve){};
// give some information about the storage
StorageInterface.prototype.info = async function(){};
