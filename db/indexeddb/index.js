const VERSION = 1;
const IndexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
const IDBTransaction =
    window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction;
const IDBKeyRange =
    window.IDBKeyRange ||
    window.webkitIDBKeyRange ||
    window.msIDBKeyRange;
const fields = ["map", "ctx", "reg", "cfg"];
import StorageInterface from "../interface.js";

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

/**
 * @constructor
 * @implements StorageInterface
 */

export default function IdxDB(name, config = {}){
    if(typeof name === "object"){
        name = name.name;
        config = name;
    }
    //field = "Test-456";
    this.field = config.field ? sanitize(config.field) : "";
    this.id = "flexsearch" + (name ? ":" + sanitize(name) : "") + (this.field ? ":" + this.field : "");
    this.db = null;
    this.trx = {};
};

IdxDB.mount = function(flexsearch){
    return new this().mount(flexsearch);
};

IdxDB.prototype.mount = function(flexsearch){
    flexsearch.db = this;
    return this.open();
};

IdxDB.prototype.open = function(){

    let self = this;

    return this.db || new Promise(function(resolve, reject){

        navigator.storage &&
        navigator.storage.persist();

        const req = IndexedDB.open(self.id, VERSION);

        req.onupgradeneeded = function(event){

            const db = self.db = this.result;

            // Using Indexes + IDBKeyRange on schema map => [key, res, id] performs
            // too bad and blows up amazingly in size
            // The schema map:key => [res][id] is currently used instead
            // In fact that bypass the idea of a storage solution,
            // IndexedDB is just a poor contribution :(

            fields.forEach(ref => {
                db.objectStoreNames.contains(ref) ||
                db.createObjectStore(ref);//{ autoIncrement: true /*keyPath: "id"*/ }
                //.createIndex("idx", "ids", { multiEntry: true, unique: false });
            });

            // switch(event.oldVersion){ // existing db version
            //     case 0:
            //     // version 0 means that the client had no database
            //     // perform initialization
            //     case 1:
            //     // client had version 1
            //     // update
            // }
        };

        req.onblocked = function(event) {
            // this event shouldn't trigger if we handle onversionchange correctly
            // it means that there's another open connection to the same database
            // and it wasn't closed after db.onversionchange triggered for it
            console.error("blocked", event);
            reject();
        };

        req.onerror = function(event){
            console.error(this.error, event);
            reject();
        };

        req.onsuccess = function(event){
            self.db = this.result; //event.target.result;
            self.db.onversionchange = function(){
                //database is outdated
                self.close();
            };
            resolve(self);
        };
    });
};

IdxDB.prototype.close = function(){
    this.db.close();
    this.db = null;
};

IdxDB.prototype.destroy = function(){
    this.db && this.close();
    return IndexedDB.deleteDatabase(this.id);
};

// IdxDB.prototype.set = function(ref, key, ctx, data){
//     const transaction = this.db.transaction(ref, "readwrite");
//     const map = transaction.objectStore(ref);
//     const req = map.put(data, ctx ? ctx + ":" + key : key);
//     return transaction;//promisfy(req, callback);
// };

// IdxDB.prototype.delete = function(ref, key, ctx){
//     const transaction = this.db.transaction(ref, "readwrite");
//     const map = transaction.objectStore(ref);
//     const req = map.delete(ctx ? ctx + ":" + key : key);
//     return transaction;//promisfy(req, callback);
// };

IdxDB.prototype.clear = function(){
    const transaction = this.db.transaction(fields, "readwrite");
    for(let i = 0; i < fields.length; i++){
        transaction.objectStore(fields[i]).clear();
    }
    return transaction;
};

IdxDB.prototype.get = function(ref, key, ctx, limit = 0, offset = 0, resolve = true){

    const transaction = this.db.transaction(ref, "readonly");
    const map = transaction.objectStore(ref);
    const req = map.get(ctx ? ctx + ":" + key : key);

    return promisfy(req).then(function(res){
        let result = [];
        if(!res) return result;
        if(resolve){
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
                        return [result];
                    }
                }
            }
            return [result];
        }
        else{
            return res;
        }
    });
};

IdxDB.prototype.has = function(ref, key, ctx){
    const transaction = this.db.transaction(ref, "readonly");
    const map = transaction.objectStore(ref);
    const req = map.getKey(ctx ? ctx + ":" + key : key);
    return promisfy(req);
};

IdxDB.prototype.info = function(){
    // todo
};

IdxDB.prototype.transaction = function(ref, modifier = "readwrite", task){

    let store = this.trx[ref + ":" + modifier];
    if(store) return task.call(this, store);

    let transaction = this.db.transaction(ref, modifier);
    this.trx[ref + ":" + modifier] = store = transaction.objectStore(ref);

    return new Promise((resolve, reject) => {
        transaction.onerror = (err) => {
            this.trx[ref+ ":" + modifier] = null;
            transaction.abort();
            transaction = store = null;
            reject(err);
            //db.close;
        };
        transaction.oncomplete = (res) => {
            this.trx[ref+ ":" + modifier] = null;
            transaction = store = null;
            resolve(res || true);
            //db.close;
        };
        return task.call(this, store);
    });
};

IdxDB.prototype.commit = async function(flexsearch, _replace, _append){

    // process cleanup tasks
    if(_replace){
        await this.clear();
        // there are just removals in the task queue
        flexsearch.commit_task = [];
    }
    else{
        let tasks = flexsearch.commit_task;
        flexsearch.commit_task = [];
        for(let i = 0, task; i < tasks.length; i++){
            task = tasks[i];
            // there are just removals in the task queue
            if(task.clear){
                await this.clear();
                _replace = true;
                break;
            }
            else{
                tasks[i] = task.del;
            }
        }
        if(!_replace){
            if(!_append){
                tasks = tasks.concat([...flexsearch.reg.keys()]);
            }
            tasks.length && await this.remove(tasks);
        }
    }

    if(!flexsearch.reg.size){
        return;
    }

    await this.transaction("map", "readwrite", function(store){

        for(const item of flexsearch.map){

            const key = item[0];
            const value = item[1];
            if(!value.length) continue;

            if(_replace){
                store.put(value, key);
                continue;
            }

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
                                //result[i] = res.concat(val);
                                //result[i] = new Set([...result[i], ...value[i]]);
                                //result[i] = result[i].union(new Set(value[i]));
                            }
                            else{
                                result[i] = val;
                                changed = 1;
                                //result[i] = new Set(value[i])
                            }
                        }
                    }
                }
                else{
                    result = value;
                    changed = 1;
                    //result = [];
                    //for(let i = 0; i < value.length; i++){
                    //    if(value[i]) result[i] = new Set(value[i]);
                    //}
                }

                changed &&
                store.put(result, key);
            }
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

                if(_replace){
                    store.put(value, ctx_key + ":" + key);
                    continue;
                }

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
                                    //result[i] = res.concat(val);
                                    changed = 1;
                                }
                                else{
                                    result[i] = val;
                                    changed = 1;
                                }
                            }
                        }
                    }
                    else{
                        result = value;
                        changed = 1;
                    }

                    changed &&
                    store.put(result, ctx_key + ":" + key);
                }
            }
        }
    });

    await this.transaction("reg", "readwrite", function(store){
        for(const key of flexsearch.reg.keys()){
            store.put(1, key);
        }
    });

    await this.transaction("cfg", "readwrite", function(store){
        store.put({
            "encode": typeof flexsearch.encode === "string" ? flexsearch.encode : "",
            "charset": typeof flexsearch.charset === "string" ? flexsearch.charset : "",
            "tokenize": flexsearch.tokenize,
            "resolution": flexsearch.resolution,
            "minlength": flexsearch.minlength,
            "optimize": flexsearch.optimize,
            "fastupdate": flexsearch.fastupdate,
            "encoder": flexsearch.encoder,
            "context": {
                "depth": flexsearch.depth,
                "bidirectional": flexsearch.bidirectional,
                "resolution": flexsearch.resolution_ctx
            }
        }, "current");
    });

    flexsearch.map.clear();
    flexsearch.ctx.clear();
    flexsearch.reg.clear();
};

function handle(cursor, ids){

    const arr = cursor.value;
    let changed;
    let parse;
    let count = 0;

    for(let x = 0, result; x < arr.length; x++){
        if((result = arr[x])){
            for(let i = 0, pos, id; i < ids.length; i++){
                id = ids[i];
                pos = result.indexOf(parse ? parseInt(id, 10) : id);
                if(pos < 0 && !parse && typeof id === "string" && !isNaN(id)){
                    pos = result.indexOf(parseInt(id, 10));
                    pos && (parse = 1);
                }
                if(pos >= 0){
                    changed = 1;
                    if(result.length > 1){
                        result.splice(pos, 1);
                    }
                    else{
                        arr[x] = [];
                        break;
                    }
                }
            }

            count += result.length;
        }
    }

    if(!count){

        cursor.delete();
        //store.delete(cursor.key);
    }
    else if(changed){

        //await new Promise(resolve => {
        cursor.update(arr);//.onsuccess = resolve;
        //});
    }

    cursor.continue();
}

IdxDB.prototype.remove = function(ids){

    if(typeof ids !== "object"){
        ids = [ids];
    }

    return Promise.all([
        this.transaction("map", "readwrite", function(store){
            store.openCursor().onsuccess = function(){
                const cursor = this.result;
                cursor && handle(cursor, ids);
            };
        }),
        this.transaction("ctx", "readwrite", function(store){
            store.openCursor().onsuccess = function(){
                const cursor = this.result;
                cursor && handle(cursor, ids);
            };
        }),
        // let filtered = [];
        this.transaction("reg", "readwrite", function(store){
            for(let i = 0; i < ids.length; i++){
                store.delete(ids[i]);
            }
            // return new Promise(resolve => {
            //     store.openCursor().onsuccess = function(){
            //         const cursor = this.result;
            //         if(cursor){
            //             const id = cursor.value;
            //             if(ids.includes(id)){
            //                 filtered.push(id);
            //                 cursor.delete();
            //             }
            //             cursor.continue();
            //         }
            //         else{
            //             resolve();
            //         }
            //     };
            // });
        })
        // ids = filtered;
    ]);
};

function promisfy(req, callback){
    return new Promise((resolve, reject) => {
        req.onsuccess = function(){
            callback && callback(this.result);
            resolve(this.result);
        };
        req.onerror = reject;
        req = null;
    });
}
