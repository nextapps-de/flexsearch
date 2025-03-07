import { createClient } from "redis";
import { create_object } from "../../common.js";
const config = {
    url: "redis://localhost:6379",
    // host: "localhost",
    // port: "6379",
    // password: void 0,
    // prefix: "flexsearch"
};
const VERSION = 1;
const fields = ["map", "ctx", "reg", "cfg"];
import StorageInterface from "../interface.js";

/**
 * @constructor
 * @implements StorageInterface
 */

export default function RedisDB(sid, field){
    //field = "Test-456";
    this.id = "flexsearch" + (sid ? "-" + sid : "");
    // prevent malicious sql injection
    this.field = field ? "-" - field.toLowerCase().replace(/[^a-z_-]/g, "") : "";
    this.type = "";
    this.resolution = 0;
    this.resolution_ctx = 0;
    this.fastupdate = true;
    this.db = null;
    this.trx = false;
};

RedisDB.mount = function(flexsearch){
    return new this().mount(flexsearch);
};

RedisDB.prototype.mount = function(flexsearch){
    flexsearch.db = this;
    this.resolution = flexsearch.resolution;
    this.resolution_ctx = flexsearch.resolution_ctx;
    this.fastupdate = flexsearch.fastupdate;
    return this.open();
};

RedisDB.prototype.open = async function(){

    if(this.db) return this.db;
    config.prefix = this.id;

    return this.db =
        await createClient(config)
            .on("error", err => console.error(err))
            .connect();
};

RedisDB.prototype.close = async function(){
    await this.db.disconnect(); // this.db.client.disconnect();
    this.db = null;
    return this;
};

RedisDB.prototype.destroy = async function(){
    await this.db.flushAll();
    return this.close();
};

RedisDB.prototype.clear = function(ref){
    return fields.includes(ref) && this.db./*json.*/del(ref + this.field);
};

RedisDB.prototype.reset = function(callback){
    return this.db.flushAll();
};

RedisDB.prototype.get = function(ref, key, ctx){
    let result;
    switch(ref){
        case "map":
            result = this.db.json.get(ref + this.field, { path: "$." + key + "[*]" });
            // fallthrough
        case "ctx":
            result = result || this.db.json.get(ref + this.field, { path: "$." + ctx + "." + key + "[*]" });
            return this.type === "number"
                ? result.then(
                    res => res.map(
                        arr => arr
                            ? arr.map(id => parseInt(id, 10))
                            : arr
                    )
                )
                : result;
        case "reg":
            return this.db.sIsMember("reg", "" + key);
        case "cfg":
            return this.db.get("cfg" + this.field);
    }
};

RedisDB.prototype.has = function(ref, key, ctx){
    switch(ref){
        case "map":
            return this.db.json.arrLen("map" + self.field, "$." + key);
        case "ctx":
            return this.db.json.arrLen("ctx" + self.field, "$." + ctx + "." + key);
        case "reg":
            return this.db.sIsMember("reg", "" + key);
        case "cfg":
            return this.db.exists("cfg" + self.field);
    }
};

RedisDB.prototype.info = function(){
    // todo
};

RedisDB.prototype.transaction = async function(task, callback){

    if(this.trx){
        return task.call(this, this.trx);
    }

    this.trx = this.db.multi();
    await task.call(this, this.trx);
    const promise = this.trx.exec();
    this.trx = null;
    callback && promise.then(callback);
    await promise;
};

function not_empty(arr){
    for(let i = 0; i < arr.length; i++){
        if(arr[i] && arr[i].length){
            return true;
        }
    }
}

RedisDB.prototype.commit = async function(flexsearch, _replace, _append){

    _replace
        ? await this.db.flushAll()
        : _append || await this.remove([...flexsearch.reg.keys()]);

    await this.transaction(async function(trx){

        // the biggest issue with RedisJSON is the need of an existing
        // structure before using JSON.ARRAPPEND on it.
        // the most cost comes about of checking for this structure.

        // todo:
        // instead of JSON.SET map $.ctx.term[*][*] the json could be split into
        // term scopes like JSON.SET map:ctx:term $[*][*].

        let exist = await this.db.json.objLen("map" + this.field);
        if(!exist){

            trx.json.set("map" + this.field, "$", Object.fromEntries(flexsearch.map));

            if(this.fastupdate){
                const reg = new Map();
                for(const item of flexsearch.map){
                    const key = item[0];
                    const arr = item[1];
                    for(let i = 0, ids; i < arr.length; i++){
                        if((ids = arr[i]) && ids.length){
                            this.type || (this.type = typeof ids[0]);
                            const ref = "m:" + /*"$." +*/ key + "[" + i + "]";
                            for(let j = 0, arr, id; j < ids.length; j++){
                                id = ids[j];
                                arr = reg.get(id);
                                arr || reg.set(id, arr = []);
                                arr.push(ref);
                                //trx.sAdd("ref" + this.field + ":" + ids[j], "map:" + ref);
                            }
                        }
                    }
                }
                for(const item of reg){
                    const key = item[0];
                    const value = item[1];
                    trx.sAdd("ref" + this.field + ":" + key, value);
                }
            }
        }
        else{

            for(const item of flexsearch.map){
                const key = item[0];
                const arr = item[1];

                let i = 0;
                let failed;

                // optimistic try to add to an existing slot
                for(let ids; i < arr.length; i++){
                    if((ids = arr[i]) && ids.length){
                        this.type || (this.type = typeof ids[0]);
                        const ref = /*"$." +*/ key + "[" + i + "]";
                        // transaction can't be used here because it needs some result immediately
                        const res = await this.db.json.arrAppend("map" + this.field, "$." + ref, ...ids);
                        // when not found break and continue with structure checking
                        if(!res.length) {
                            failed = true;
                            break;
                        }
                        if(this.fastupdate) for(let j = 0; j < ids.length; j++){
                            trx.sAdd("ref" + this.field + ":" + ids[j], "m:" + ref);
                        }
                    }
                }
                if(!failed) continue;

                exist = (await this.db.json.arrLen("map" + this.field, "$." + key))[0];
                if(!exist /*|| getsize(exist, 0) === 0*/){
                    trx.json.set("map" + this.field, "$." + key, arr);

                    if(this.fastupdate){
                        const reg = new Map();
                        for(let i = 0, ids; i < arr.length; i++){
                            if((ids = arr[i]) && ids.length){
                                this.type || (this.type = typeof ids[0]);
                                const ref = "m:" + /*"$." +*/ key + "[" + i + "]";
                                for(let j = 0, id, arr; j < ids.length; j++){
                                    id = ids[j];
                                    arr = reg.get(id);
                                    arr || reg.set(id, arr = []);
                                    arr.push(ref);
                                    //trx.sAdd("ref" + this.field + ":" + ids[j], "map:" + ref);
                                }
                            }
                        }
                        for(const item of reg){
                            const key = item[0];
                            const value = item[1];
                            trx.sAdd("ref" + this.field + ":" + key, value);
                        }
                    }

                    continue;
                }

                for(let ids; i < arr.length; i++){
                    if((ids = arr[i]) && ids.length){
                        this.type || (this.type = typeof ids[0]);

                        exist = (await this.db.json.arrLen("map" + this.field, "$." + key + "[" + i + "]"))[0];
                        if(!exist){
                            trx.json.set("map" + this.field, "$." + key + "[" + i + "]", ids);

                            if(this.fastupdate){
                                const reg = new Map();
                                const ref = "m:" + /*"$." +*/ key + "[" + i + "]";
                                for(let j = 0, id, arr; j < ids.length; j++){
                                    id = ids[j];
                                    arr = reg.get(id);
                                    arr || reg.set(id, arr = []);
                                    arr.push(ref);
                                    //trx.sAdd("ref" + this.field + ":" + ids[j], "map:" + ref);
                                }
                                for(const item of reg){
                                    const key = item[0];
                                    const value = item[1];
                                    trx.sAdd("ref" + this.field + ":" + key, value);
                                }
                            }

                            continue;
                        }

                        const ref = /*"$." +*/ key + "[" + i + "]";
                        trx.json.arrAppend("map" + this.field, "$." + ref, ...ids);
                        if(this.fastupdate) for(let j = 0; j < ids.length; j++){
                            trx.sAdd("ref" + this.field + ":" + ids[j], "m:" + ref);
                        }
                    }
                }
            }
        }

        exist = await this.db.json.objLen("ctx" + this.field);
        if(!exist){
            const obj = Object.create(null);
            for(const item of flexsearch.ctx){
                const key = item[0];
                const value = item[1];
                obj[key] = Object.fromEntries(value);
                // obj[ctx_key] = Object.create(null);
                // for(let [key, value] of ctx_value){
                //     obj[ctx_key][key] = value;
                // }
            }
            trx.json.set("ctx" + this.field, "$", obj);

            if(this.fastupdate){
                const reg = new Map();
                for(const ctx of flexsearch.ctx){
                    const ctx_key = ctx[0];
                    const ctx_value = ctx[1];
                    for(const item of ctx_value){
                        const key = item[0];
                        const arr = item[1];
                        for(let i = 0, ids; i < arr.length; i++){
                            if((ids = arr[i]) && ids.length){
                                this.type || (this.type = typeof ids[0]);
                                const ref = "c:" + /*"$." +*/ ctx_key + ":" + key + "[" + i + "]";
                                for(let j = 0, id, arr; j < ids.length; j++){
                                    id = ids[j];
                                    arr = reg.get(id);
                                    arr || reg.set(id, arr = []);
                                    arr.push(ref);
                                    //trx.sAdd("ref" + this.field + ":" + ids[j], "map:" + ref);
                                }
                            }
                        }
                    }
                }
                for(const item of reg){
                    const key = item[0];
                    const value = item[1];
                    trx.sAdd("ref" + this.field + ":" + key, value);
                }
            }
        }
        else{
            for(const ctx of flexsearch.ctx){
                const ctx_key = ctx[0];
                const ctx_value = ctx[1];

                let exist = (await this.db.json.objLen("ctx" + this.field, "$." + ctx_key))[0];
                if(!exist /*|| getsize(exist) === 0*/){
                    trx.json.set("ctx" + this.field, "$." + ctx_key, Object.fromEntries(ctx_value));

                    if(this.fastupdate){
                        const reg = new Map();
                        for(const item of ctx_value){
                            const key = item[0];
                            const arr = item[1];
                            for(let i = 0, ids; i < arr.length; i++){
                                if((ids = arr[i]) && ids.length){
                                    this.type || (this.type = typeof ids[0]);
                                    const ref = "c:" + /*"$." +*/ ctx_key + ":" + key + "[" + i + "]";
                                    for(let j = 0, id, arr; j < ids.length; j++){
                                        id = ids[j];
                                        arr = reg.get(id);
                                        arr || reg.set(id, arr = []);
                                        arr.push(ref);
                                    }
                                }
                            }
                        }
                        for(const item of reg){
                            const key = item[0];
                            const value = item[1];
                            trx.sAdd("ref" + this.field + ":" + key, value);
                        }
                    }

                    continue;
                }

                for(const item of ctx_value){
                    const key = item[0];
                    const arr = item[1];

                    let i = 0;
                    let failed;

                    // optimistic try to add to an existing slot
                    for(let ids; i < arr.length; i++){
                        if((ids = arr[i]) && ids.length){
                            this.type || (this.type = typeof ids[0]);
                            const res = await this.db.json.arrAppend("ctx" + this.field, "$." + ctx_key + "." + key + "[" + i + "]", ...ids);
                            if(!res.length){
                                failed = true;
                                break;
                            }
                        }
                    }
                    if(!failed) continue;

                    //let exist = await this.db.json.get("ctx" + this.field, { path: "$." + ctx_key + ":" + key + "[*]" });
                    let exist = (await this.db.json.arrLen("ctx" + this.field, "$." + ctx_key + "." + key))[0];
                    if(!exist /*|| getsize(exist) === 0*/){
                        trx.json.set("ctx" + this.field, "$." + ctx_key + "." + key, arr);

                        if(this.fastupdate){
                            const reg = new Map();
                            for(let i = 0, ids; i < arr.length; i++){
                                if((ids = arr[i]) && ids.length){
                                    this.type || (this.type = typeof ids[0]);
                                    const ref = "c:" + /*"$." +*/ ctx_key + ":" + key + "[" + i + "]";
                                    for(let j = 0, id, arr; j < ids.length; j++){
                                        id = ids[j];
                                        arr = reg.get(id);
                                        arr || reg.set(id, arr = []);
                                        arr.push(ref);
                                    }
                                }
                            }
                            for(const item of reg){
                                const key = item[0];
                                const value = item[1];
                                trx.sAdd("ref" + this.field + ":" + key, value);
                            }
                        }

                        continue;
                    }

                    for(let ids; i < arr.length; i++){
                        if((ids = arr[i]) && ids.length){
                            this.type || (this.type = typeof ids[0]);
                            exist = (await this.db.json.arrLen("ctx" + this.field, "$." + ctx_key + "." + key + "[" + i + "]"))[0];
                            if(!exist){
                                trx.json.set("ctx" + this.field, "$." + ctx_key + "." + key + "[" + i + "]", ids);

                                if(this.fastupdate){
                                    const reg = new Map();
                                    const ref = "c:" + /*"$." +*/ ctx_key + ":" + key + "[" + i + "]";
                                    for(let j = 0, id, arr; j < ids.length; j++){
                                        id = ids[j];
                                        arr = reg.get(id);
                                        arr || reg.set(id, arr = []);
                                        arr.push(ref);
                                    }
                                    for(const item of reg){
                                        const key = item[0];
                                        const value = item[1];
                                        trx.sAdd("ref" + this.field + ":" + key, value);
                                    }
                                }

                                continue;
                            }

                            const ref = ctx_key + "." + key + "[" + i + "]";
                            trx.json.arrAppend("ctx" + this.field, "$." + ref, ...ids);
                            if(this.fastupdate) for(let j = 0; j < ids.length; j++){
                                trx.sAdd("ref" + this.field + ":" + ids[j], "c:" + ref);
                            }
                            // for(let j = 1; j < ids.length; j++){
                            //     exist = (await this.db.json.arrLen("ctx" + self.field, "$." + ctx_key + "." + key + "[" + i + "]"))[0];
                            //     if(exist /*&& exist.length*/){
                            //         trx.json.arrAppend("ctx" + self.field, "$." + ctx_key + "." + key + "[" + i + "]", ids[j]);
                            //     }
                            //     else{
                            //         trx.json.set("ctx" + this.field, "$." + ctx_key + "." + key + "[" + i + "]", ids);
                            //     }
                            // }
                        }
                    }
                }
            }
        }

        let ids = [...flexsearch.reg.keys()];
        if(ids.length){
            if(typeof ids[0] === "number"){
                ids = ids.map(id => "" + id);
            }
            trx.sAdd("reg", ids);
        }

        trx.set("cfg" + this.field, JSON.stringify({
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
        }));
    });

    //flexsearch.map = new Map();
    //flexsearch.ctx = new Map();
    //flexsearch.reg = flexsearch.bidirectional ? new Map() : new Set();
    flexsearch.map.clear();
    flexsearch.ctx.clear();
    flexsearch.reg.clear();
};

RedisDB.prototype.remove = async function(ids){

    if(typeof ids !== "object"){
        ids = [ids];
    }
    if(!ids.length){
        return;
    }
    if(typeof ids[0] === "number"){
        ids = ids.map(item => "" + item);
    }

    const check = await this.db.smIsMember("reg", ids);

    return this.transaction(async function(trx){
        //let stmt = "";
        for(let i = 0, id; i < ids.length; i++){
            if(!check[i]) continue;
            id = ids[i];

            if(this.fastupdate){
                const refs = await this.db.sMembers("ref" + this.field + ":" + id);
                if(refs){
                    for(let j = 0; j < refs.length; j++){
                        const ref = refs[j][0] === "m" ? "map" : "ctx";
                        const path = refs[j].substring(2);
                        trx.json.del(ref + this.field, "$." + path + "[?@==" + id + "]");
                        //trx.json.del("ctx" + this.field, refs[j] + "[?@==" + id + "]");
                    }
                    trx.del("ref" + this.field + ":" + id);
                }
            }
            else{

                trx.json.del("map" + this.field, "$.*[*][?@==" + id + "]");
                trx.json.del("ctx" + this.field, "$.*.*[*][?@==" + id + "]");
            }

            //stmt += (stmt ? "||" : "") + "@==" + ids[i];
            //const result = await this.db.json.arrIndex("map" + this.field, "$.*.* ", ids[i])
            //trx.json.del("map" + this.field, "$.*[*][?@==" + ids[i] + "]");
            //trx.json.del("ctx" + this.field, "$.*.*[*][?@==" + ids[i] + "]");
            trx.sRem("reg", ids[i]);
        }
        //stmt += "||@==null";

        //trx.json.del("map" + this.field, "$.*[*][?" + stmt + "]");
        //trx.json.del("ctx" + this.field, "$.*.*[*][?" + stmt + "]");

        // trx.json.del("map" + this.field, "$..[?@==null]");
        // trx.json.del("ctx" + this.field, "$..[?@==null]");
    });
};

// RedisDB.prototype.promisfy = function(opt){
//     const db = this.db;
//     return new Promise(function(resolve, reject){
//         db[opt.method](opt.stmt, opt.params || [], function(err, rows){
//             opt.callback && opt.callback(rows);
//             err ? reject(err)
//                 : resolve(rows);
//         });
//     });
// };