'use strict';

/**
 * @param {*} value
 * @param {*} default_value
 * @param {*=} merge_value
 * @return {*}
 */

function create_object(){
    return Object.create(null);
}

const VERSION = 1;
const IndexedDB = typeof window !== "undefined" && (
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB
);
const fields = ["map", "ctx", "tag", "reg", "cfg"];

/**
 * @param {!string} str
 * @return {string}
 */
function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

const Index = create_object();

/**
 * @param {string|PersistentOptions=} name
 * @param {PersistentOptions=} config
 * @constructor
 * @implements StorageInterface
 */

function IdxDB(name, config = {}){
    if(!this || this.constructor !== IdxDB){
        return new IdxDB(name, config);
    }
    if(typeof name === "object"){
        config = /** @type PersistentOptions */ (name);
        name = name.name;
    }
    if(!name){
        console.info("Default storage space was used, because a name was not passed.");
    }
    this.id = "flexsearch" + (name ? ":" + sanitize(name) : "");
    this.field = config.field ? sanitize(config.field) : "";
    this.type = config.type;
    this.support_tag_search = false;
    this.fastupdate = false;
    this.db = null;
    this.trx = {};
}
IdxDB.prototype.mount = function(flexsearch){
   
    if(flexsearch.index){
        return flexsearch.mount(this);
    }
    flexsearch.db = this;
    return this.open();
};

IdxDB.prototype.open = function(){

    if(this.db) return this.db;
    let self = this;

    navigator.storage &&
    navigator.storage.persist();

  

        Index[self.id] || (Index[self.id] = []);
        Index[self.id].push(self.field);

        const req = IndexedDB.open(self.id, VERSION);

        /** @this {IDBOpenDBRequest} */
        req.onupgradeneeded = function(event){

            const db = self.db = this.result;

           
           
           
           
           
            for(let i = 0, ref; i < fields.length; i++){
                ref = fields[i];
                for(let j = 0, field; j < Index[self.id].length; j++){
                    field = Index[self.id][j];
                    db.objectStoreNames.contains(ref + (ref !== "reg" ? (field ? ":" + field : "") : "")) ||
                    db.createObjectStore(ref + (ref !== "reg" ? (field ? ":" + field : "") : ""));
                   
                }
            }

           
           
           
           
           
           
           
           
        };

        return self.db = promisfy(req, function(result){
            self.db = result;
            self.db.onversionchange = function(){
               
                self.close();
            };
        });

       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
  
};

IdxDB.prototype.close = function(){
    this.db && this.db.close();
    this.db = null;
};

/**
 * @return {!Promise<undefined>}
 */
IdxDB.prototype.destroy = function(){
    const req = IndexedDB.deleteDatabase(this.id);
    return promisfy(req);
};



/**
 * @return {!Promise<undefined>}
 */
IdxDB.prototype.clear = function(){

    const stores = [];

    for(let i = 0, ref; i < fields.length; i++){
        ref = fields[i];
        for(let j = 0, field; j < Index[this.id].length; j++){
            field = Index[this.id][j];
            stores.push(ref + (ref !== "reg" ? (field ? ":" + field : "") : ""));
        }
    }

    const transaction = this.db.transaction(stores, "readwrite");

    for(let i = 0; i < stores.length; i++){
        transaction.objectStore(stores[i]).clear();
    }
    return promisfy(transaction);
};

/**
 * @param {!string} key
 * @param {string=} ctx
 * @param {number=} limit
 * @param {number=} offset
 * @param {boolean=} resolve
 * @param {boolean=} enrich
 * @return {!Promise<SearchResults|EnrichedSearchResults>}
 */
IdxDB.prototype.get = function(key, ctx, limit = 0, offset = 0, resolve = true, enrich = false){
    const transaction = this.db.transaction((ctx ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly");
    const map = transaction.objectStore((ctx ? "ctx" : "map") + (this.field ? ":" + this.field : ""));
    const req = map.get(ctx ? ctx + ":" + key : key);
    const self = this;
    return promisfy(req).then(function(res){
        let result = [];
        if(!res || !res.length) return result;
        if(resolve){
            if(!limit && !offset && res.length === 1){
                return res[0];
            }
            for(let i = 0, arr; i < res.length; i++){
                if((arr = res[i]) && arr.length){
                    if(offset >= arr.length){
                        offset -= arr.length;
                        continue;
                    }
                    const end = limit
                        ? offset + Math.min(arr.length - offset, limit)
                        : arr.length;
                    for(let j = offset; j < end; j++){
                        result.push(arr[j]);
                    }
                    offset = 0;
                    if(result.length === limit){
                       break;
                    }
                }
            }
            return SUPPORT_STORE && enrich
                ? self.enrich(result)
                : result;
        }
        else {
            return res;
        }
    });
};

if(SUPPORT_TAGS){

    /**
     * @param {!string} tag
     * @param {number=} limit
     * @param {number=} offset
     * @param {boolean=} enrich
     * @return {!Promise<SearchResults|EnrichedSearchResults>}
     */
    IdxDB.prototype.tag = function(tag, limit = 0, offset = 0, enrich = false){
        const transaction = this.db.transaction("tag" + (this.field ? ":" + this.field : ""), "readonly");
        const map = transaction.objectStore("tag" + (this.field ? ":" + this.field : ""));
        const req = map.get(tag);
        const self = this;
        return promisfy(req).then(function(ids){
            if(!ids || !ids.length || offset >= ids.length) return [];
            if(!limit && !offset) return ids;
            const result = ids.slice(offset, offset + limit);
            return SUPPORT_STORE && enrich
                ? self.enrich(result)
                : result;
        });
    };
}

if(SUPPORT_STORE){

    /**
     * @param {SearchResults} ids
     * @return {!Promise<EnrichedSearchResults>}
     */
    IdxDB.prototype.enrich = function(ids){
        if(typeof ids !== "object"){
            ids = [ids];
        }
        const transaction = this.db.transaction("reg", "readonly");
        const map = transaction.objectStore("reg");
        const promises = [];
        for(let i = 0; i < ids.length; i++){
            promises[i] = promisfy(map.get(ids[i]));
        }
        return Promise.all(promises).then(function(docs){
            for(let i = 0; i < docs.length; i++){
                docs[i] = {
                    "id": ids[i],
                    "doc": docs[i] ? JSON.parse(docs[i]) : null
                };
            }
            return docs;
        });
    };
}

/**
 * @param {number|string} id
 * @return {!Promise<undefined>}
 */
IdxDB.prototype.has = function(id){
    const transaction = this.db.transaction("reg", "readonly");
    const map = transaction.objectStore("reg");
    const req = map.getKey(id);
    return promisfy(req).then(function(result){
        return !!result;
    });
};

IdxDB.prototype.search = null;


IdxDB.prototype.info = function(){
   
};

/**
 * @param {!string} ref
 * @param {!string} modifier
 * @param {!Function} task
 */

IdxDB.prototype.transaction = function(ref, modifier, task){

    const key = ref + (ref !== "reg" ? (this.field ? ":" + this.field : "") : "");
    /**
     * @type {IDBObjectStore}
     */
    let store = this.trx[key + ":" + modifier];
    if(store) return task.call(this, store);
    let transaction = this.db.transaction(key, modifier);
    /**
     * @type {IDBObjectStore}
     */
    this.trx[key + ":" + modifier] = store = transaction.objectStore(key);
    const promise = task.call(this, store);
    this.trx[key + ":" + modifier] = null;

    return promisfy(transaction).finally(function(){
        transaction = store = null;
        return promise;
    });

   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
};

IdxDB.prototype.commit = async function(flexsearch){

    let tasks = flexsearch.commit_task;
    let removals = [];
    flexsearch.commit_task = [];

    for(let i = 0, task; i < tasks.length; i++){
        /** @dict */
        task = tasks[i];
        if(task["del"]){
            removals.push(task["del"]);
        }
       
       
       
    }

    if(removals.length){
        await this.remove(removals);
    }

    if(!flexsearch.reg.size){
        return;
    }

    await this.transaction("map", "readwrite", function(store){

        for(const item of flexsearch.map){

            const key = item[0];
            const value = item[1];
            if(!value.length) continue;

           
           
           
           

            store.get(key).onsuccess = function(){
                let result = this.result;
                let changed;
                if(result && result.length){
                    const maxlen = Math.max(result.length, value.length);
                    for(let i = 0, res, val; i < maxlen; i++){
                        val = value[i];
                        if(val && val.length){
                            res = result[i];
                            if(res && res.length){
                                for(let j = 0; j < val.length; j++){
                                    res.push(val[j]);
                                }
                                changed = 1;
                               
                               
                               
                            }
                            else {
                                result[i] = val;
                                changed = 1;
                               
                            }
                        }
                    }
                }
                else {
                    result = value;
                    changed = 1;
                   
                   
                   
                   
                }

                changed &&
                store.put(result, key);
            };
        }
    });

    await this.transaction("ctx", "readwrite", function(store){

        for(const ctx of flexsearch.ctx){
            const ctx_key = ctx[0];
            const ctx_value = ctx[1];

            for(const item of ctx_value){
                const key = item[0];
                const value = item[1];
                if(!value.length) continue;

               
               
               
               

                store.get(ctx_key + ":" + key).onsuccess = function(){
                    let result = this.result;
                    let changed;
                    if(result && result.length){
                        const maxlen = Math.max(result.length, value.length);
                        for(let i = 0, res, val; i < maxlen; i++){
                            val = value[i];
                            if(val && val.length){
                                res = result[i];
                                if(res && res.length){
                                    for(let j = 0; j < val.length; j++){
                                        res.push(val[j]);
                                    }
                                   
                                    changed = 1;
                                }
                                else {
                                    result[i] = val;
                                    changed = 1;
                                }
                            }
                        }
                    }
                    else {
                        result = value;
                        changed = 1;
                    }

                    changed &&
                    store.put(result, ctx_key + ":" + key);
                };
            }
        }
    });

    if(SUPPORT_STORE && flexsearch.store){
        await this.transaction("reg", "readwrite", function(store){
            for(const item of flexsearch.store){
                const id = item[0];
                const doc = item[1];
                store.put(typeof doc === "object"
                    ? JSON.stringify(doc)
                    : 1
                , id);
            }
        });
    }
    else if(!flexsearch.bypass){
        await this.transaction("reg", "readwrite", function(store){
            for(const id of flexsearch.reg.keys()){
                store.put(1, id);
            }
        });
    }

    if(SUPPORT_TAGS && flexsearch.tag){
        await this.transaction("tag", "readwrite", function(store){
            for(const item of flexsearch.tag){
                const tag = item[0];
                const ids = item[1];
                if(!ids.length) continue;

                store.get(tag).onsuccess = function(){
                    let result = this.result;
                    result = result && result.length
                        ? result.concat(ids)
                        : ids;
                    store.put(result, tag);
                };
            }
        });
    }

   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   

    flexsearch.map.clear();
    flexsearch.ctx.clear();
    if(SUPPORT_TAGS){
        flexsearch.tag &&
        flexsearch.tag.clear();
    }
    if(SUPPORT_STORE){
        flexsearch.store &&
        flexsearch.store.clear();
    }
    flexsearch.document ||
    flexsearch.reg.clear();
};

/**
 * @param {IDBCursorWithValue} cursor
 * @param {Array<number|string>} ids
 * @param {boolean=} _tag
 */

function handle(cursor, ids, _tag){

    const arr = cursor.value;
    let changed;
    let count = 0;

    for(let x = 0, result; x < arr.length; x++){
       
        if((result = _tag ? arr : arr[x])){
            for(let i = 0, pos, id; i < ids.length; i++){
                id = ids[i];
                pos = result.indexOf(id);
                if(pos >= 0){
                    changed = 1;
                    if(result.length > 1){
                        result.splice(pos, 1);
                    }
                    else {
                        arr[x] = [];
                        break;
                    }
                }
            }

            count += result.length;
        }
        if(_tag) break;
    }

    if(!count){
        cursor.delete();
       
    }
    else if(changed){
       
        cursor.update(arr);
       
    }

    cursor.continue();
}

/**
 * @param {Array<number|string>} ids
 * @return {!Promise<undefined>}
 */
IdxDB.prototype.remove = function(ids){

    const self = this;

    if(typeof ids !== "object"){
        ids = [ids];
    }

    return /** @type {!Promise<undefined>} */(Promise.all([
        self.transaction("map", "readwrite", function(store){
            store.openCursor().onsuccess = function(){
                const cursor = this.result;
                cursor && handle(cursor, ids);
            };
        }),
        self.transaction("ctx", "readwrite", function(store){
            store.openCursor().onsuccess = function(){
                const cursor = this.result;
                cursor && handle(cursor, ids);
            };
        }),
        SUPPORT_TAGS && self.transaction("tag", "readwrite", function(store){
            store.openCursor().onsuccess = function(){
                const cursor = this.result;
                cursor && handle(cursor, ids,  true);
            };
        }),
       
        self.transaction("reg", "readwrite", function(store){
            for(let i = 0; i < ids.length; i++){
                store.delete(ids[i]);
            }
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
        })
       
    ]));
};

/**
 * @param {IDBRequest|IDBOpenDBRequest} req
 * @param {Function=} callback
 * @return {!Promise<undefined>}
 */

function promisfy(req, callback){
    return new Promise((resolve, reject) => {
       
        /** @this {IDBRequest|IDBOpenDBRequest} */
        req.onsuccess = req.oncomplete = function(){
            callback && callback(this.result);
            callback = null;
            resolve(this.result);
        };
        req.onerror = req.onblocked = reject;
        req = null;
    });
}

module.exports = IdxDB;
