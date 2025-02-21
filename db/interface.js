/**
 * @interface
 */
export default function StorageInterface(sid, field){};

// assign store to an index
StorageInterface.prototype.mount = function(index){};
// open connection
StorageInterface.prototype.open = function(){};
// close connection
StorageInterface.prototype.close = function(){};
// clean the database
StorageInterface.prototype.destroy = function(){};

// set a value by a given key to a specific table
//StorageInterface.prototype.set = function(ref, key, value){};
// get a key from a specific table
StorageInterface.prototype.get = async function(ref, key){};
// check if a key exists on a specific table
StorageInterface.prototype.has = async function(ref, key){};
// delete an id on a specific table
StorageInterface.prototype.remove = async function(id){};
StorageInterface.prototype.remove = async function(ids){};
// clear a specific table
StorageInterface.prototype.clear = async function(ref){};

StorageInterface.prototype.transaction = async function(fn){};
StorageInterface.prototype.commit = async function(){};
StorageInterface.prototype.reset = function(){};
StorageInterface.prototype.info = function(){};
