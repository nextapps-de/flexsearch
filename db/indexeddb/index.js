const VERSION = 1;
const IndexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
const IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
const fields = ["map", "ctx", "reg", "cfg"];
import StorageInterface from "../interface.js";

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

/**
 * @constructor
 * @implements StorageInterface
 */

export default function IdxDB(name, config){
    //field = "Test-456";
    if(name) name = sanitize(name);
    if(config && config.field) config.field = sanitize(config.field);

    this.field = (config && config.field) || "";
    this.id = "flexsearch" + (name ? ":" + name : "") + (this.field ? ":" + this.field : "");
    this.db = null;
    this.trx = {};

    navigator.storage &&
    navigator.storage.persist();
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

        const req = IndexedDB.open(self.id, VERSION);

        req.onupgradeneeded = function(event){

            const db = self.db = this.result;

            fields.forEach(ref => {
                db.objectStoreNames.contains(ref) ||
                db.createObjectStore(ref) //{ autoIncrement: true /*keyPath: "id"*/ }
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

IdxDB.prototype.set = function(ref, key, ctx, data){
    const transaction = this.db.transaction(ref, "readwrite");
    const map = transaction.objectStore(ref);
    const req = map.put(data, ctx ? ctx + ":" + key : key);
    return transaction;//promisfy(req, callback);
};

IdxDB.prototype.delete = function(ref, key, ctx){
    const transaction = this.db.transaction(ref, "readwrite");
    const map = transaction.objectStore(ref);
    const req = map.delete(ctx ? ctx + ":" + key : key);
    return transaction;//promisfy(req, callback);
};

IdxDB.prototype.clear = function(){
    const transaction = this.db.transaction(fields, "readwrite");
    for(let i = 0; i < fields.length; i++){
        transaction.objectStore(fields[i]).clear();
    }
    return transaction;
};

IdxDB.prototype.get = function(ref, key, ctx, limit, offset){
    const transaction = this.db.transaction(ref, "readonly");
    const map = transaction.objectStore(ref);
    const req = map.get(ctx ? ctx + ":" + key : key);
    return promisfy(req);
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
    if(store) return store;

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
        return task(store);
    });
};

// IdxDB.prototype.transaction2 = function(ref, modifier, task){
//
//     let transaction = this.db.transaction(ref, modifier);
//     const promise = new Promise((resolve, reject) => {
//         transaction.onerror = () => {
//             transaction.abort();
//             transaction = null;
//             reject();
//             //db.close;
//         };
//         transaction.oncomplete = () => {
//             transaction = null;
//             resolve();
//             //db.close;
//         };
//     });
//
//     task(transaction);
//     return promise;
// };

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

            if(_replace){
                //store.add(value, key);
                store.put(value, key);
                continue;
            }

            store.get(key).onsuccess = function(){

                let result = this.result;

                if(result){

                    const maxlen = Math.max(result.length, value.length);

                    for(let i = 0; i < maxlen; i++){
                        if(result[i] && value[i]){
                            result[i] = result[i].concat(value[i]);
                            //result[i] = new Set([...result[i], ...value[i]]);
                            //result[i] = result[i].union(new Set(value[i]));
                        }
                        else if(value[i]){
                            result[i] = value[i];
                            //result[i] = new Set(value[i])
                        }
                    }
                }
                else{
                    result = value;
                    //result = [];
                    //for(let i = 0; i < value.length; i++){
                    //    if(value[i]) result[i] = new Set(value[i]);
                    //}
                }

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

                if(_replace){
                    //store.add(value, ctx_key + ":" + key)
                    store.put(value, ctx_key + ":" + key);
                    continue;
                }

                store.get(ctx_key + ":" + key).onsuccess = function(){
                    let result = this.result;
                    if(result){
                        const maxlen = Math.max(result.length, value.length);
                        for(let i = 0; i < maxlen; i++){
                            if(result[i] && value[i]){
                                result[i] = result[i].concat(value[i]);
                            }
                            else if(value[i]){
                                result[i] = value[i];
                            }
                        }
                    }
                    else{
                        result = value;
                    }
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

                // if(arr[x].has(i)){
                //     arr[x].size < 2
                //         ? arr[x] = new Set()
                //         : arr[x].delete(i);
                //     changed = 1;
                // }
            }

            count += result.length;
            // count += arr[x].size;
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

IdxDB.prototype.remove = async function(ids){

    if(typeof ids !== "object"){
        ids = [ids];
    }

    // const transaction = this.db.transaction("reg", "readonly");
    // const map = transaction.objectStore("reg");
    //
    // for(let i = 0; i < ids.length; i++){
    //     const req = await promisfy(map.getKey("" + ids[i]));
    //     if(!req) ids.splice(i--, 1);
    // }

    // let filtered = [];
    // for(let i = 0, id; i < ids.length; i++){
    //     id = ids[i];
    //     if(await this.has("reg", "" + id))
    //         filtered.push(id);
    // }
    // ids = filtered;

    await this.transaction("map", "readwrite", function(store){
        store.openCursor().onsuccess = function(){
            const cursor = this.result;
            cursor && handle(cursor, ids);
        };
    });

    await this.transaction("ctx", "readwrite", function(store){
        store.openCursor().onsuccess = function(){
            const cursor = this.result;
            cursor && handle(cursor, ids);
        };
    });

    await this.transaction("reg", "readwrite", function(store){
        for(let i = 0; i < ids.length; i++){
            store.delete(ids[i]);
        }
    });

    // return this.transaction2(fields, "readwrite", function(transaction){
    //
    //     let store = transaction.objectStore("map");
    //     store.openCursor().onsuccess = function(){
    //         const cursor = this.result;
    //         cursor && handle(cursor, ids);
    //     };
    //
    //     store = transaction.objectStore("ctx");
    //     store.openCursor().onsuccess = function(){
    //         const cursor = this.result;
    //         cursor && handle(cursor, ids);
    //     };
    //
    //     store = transaction.objectStore("reg");
    //     for(let i = 0; i < ids.length; i++){
    //         store.delete(/*"" +*/ ids[i]);
    //     }
    // });
};

function promisfy(req, callback){

    return new Promise((resolve, reject) => {

        req.onsuccess = function(){
            //console.log(req)
            //console.log(req.result);
            callback && callback(this.result);
            resolve(this.result);
        };

        req.onerror = function() {
            //console.error(req.error);
            //callback && callback.call(self, this.result);
            reject();
        };

        req = null;
    });
}