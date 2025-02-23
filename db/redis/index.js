import { createClient } from "redis";
const defaults = {
    host: "localhost",
    port: "6379",
    user: null,
    pass: null
};
const VERSION = 1;
const fields = ["map", "ctx", "reg", "cfg"];
import StorageInterface from "../interface.js";

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

/**
 * @constructor
 * @implements StorageInterface
 */

export default function RedisDB(name, config = {}){
    if(typeof name === "object"){
        name = name.name;
        config = name;
    }
    if(!name){
        console.info("Default storage space was used, because a name was not passed.");
    }
    //field = "Test-456";
    this.id = (name ? sanitize(name) : "flexsearch") + "|";
    this.field = config.field ? "-" + sanitize(config.field) : "";
    this.type = "";
    this.fastupdate = true;
    this.db = config.db || null;
    this.trx = false;
    Object.assign(defaults, config);
    this.db && delete defaults.db;
};

RedisDB.mount = function(flexsearch){
    return new this().mount(flexsearch);
};

RedisDB.prototype.mount = function(flexsearch){
    flexsearch.db = this;
    // todo support
    //this.fastupdate = flexsearch.fastupdate;
    return this.open();
};

RedisDB.prototype.open = async function(){
    if(this.db){
        return this.db
    }
    let url = defaults.url;
    if(!url){
        url = defaults.user
            ? `redis://${defaults.user}:${defaults.pass}@${defaults.host}:${defaults.port}`
            : `redis://${defaults.host}:${defaults.port}`;
    }
    return this.db =
        await createClient(url)
        .on("error", err => console.error(err))
        .connect();
};

RedisDB.prototype.close = async function(){
    await this.db.disconnect(); // this.db.client.disconnect();
    this.db = null;
    return this;
};

RedisDB.prototype.clear = function(){
    return this.db.unlink([
        this.id + "map" + this.field,
        this.id + "ctx" + this.field,
        this.id + "cfg" + this.field,
        this.id + "reg",
    ]);
};

RedisDB.prototype.get = function(ref, key, ctx, limit = 0, offset = 0){
    let result;
    switch(ref){
        case "ctx":
            result = this.db.zRangeWithScores(
                this.id + "ctx" + this.field + ":" + ctx + ":" + key,
                "" + offset,
                "" + (offset + limit - 1),
                { REV: true }
            );
            // fallthrough
        case "map":
            result = result || this.db.zRangeWithScores(
                this.id + "map" + this.field + ":" + key,
                "" + offset,
                "" + (offset + limit - 1),
                { REV: true }
            );
            const type = this.type;
            return result.then(function(range){
                let result = [];
                for(let i = 0, tmp, score; i < range.length; i++){
                    tmp = range[i];
                    score = tmp.score;
                    result[score] || (result[score] = []);
                    result[score].push(
                        type === "number"
                            ? parseInt(tmp.value, 10)
                            : tmp.value
                    );
                }
                return result;
            });
        // case "reg":
        //     return this.db.sIsMember(
        //         this.id + "reg",
        //         "" + key
        //     );
        // case "cfg":
        //     return this.db.get(
        //         this.id + "cfg" + this.field
        //     );
    }
};

RedisDB.prototype.has = function(ref, key, ctx){
    switch(ref){
        case "ctx":
            return this.db.sIsMember(
                this.id + "ctx" + this.field + ":" + ctx + ":" + key,
                "" + key
            );
        case "map":
            return this.db.sIsMember(
                this.id + "map" + this.field + ":" + key,
                "" + key
            );
        case "reg":
            return this.db.sIsMember(
                this.id + "reg",
                "" + key
            );
        // case "cfg":
        //     return this.db.exists(
        //         this.id + "cfg" + this.field
        //     );
    }
};

RedisDB.prototype.search = function(flexsearch, query, suggest, limit = 100, offset = 0){

    // if(suggest){
    //     // not supported
    //     return false;
    // }

    let result;

    if(query.length > 1 && flexsearch.depth){

        const key = this.id + "ctx" + this.field + ":";
        let params = [];
        let keyword = query[0];
        let term;

        for(let i = 1, swap; i < query.length; i++){
            term = query[i];
            swap = flexsearch.bidirectional && (term > keyword);
            params.push(key + (swap ? term : keyword) + ":" + (swap ? keyword : term));
            keyword = term;
        }
        //result = this.db.zInterWithScores(params);
        query = params;
    }
    else{

        const key = this.id + "map" + this.field + ":";
        for(let i = 0; i < query.length; i++){
            query[i] = key + query[i];
        }
        //query = query.map(term => key + term);
        //result = this.db.zInterWithScores(query);
    }

    const type = this.type;
    const key = this.id + "tmp:" + Math.random();
    result = suggest
        ? this.db.multi()
            .zUnionStore(key, query, { AGGREGATE: "SUM" })
            .zRangeWithScores(key, "" + offset, "" + (offset + limit - 1), { REV: true })
            .unlink(key)
            .exec()
        : this.db.multi()
            .zInterStore(key, query, { AGGREGATE: "MIN" })
            .zRangeWithScores(key, "" + offset, "" + (offset + limit - 1), { REV: true })
            .unlink(key)
            .exec();

    return result.then(function(result){
        // take the 2nd result from batch return
        result = result[1];
        // if(offset){
        //     if(result.length < offset){
        //         return [];
        //     }
        //     if(result.length > offset){
        //         //result.splice(0, offset);
        //         result = result.slice(offset, offset + limit);
        //     }
        // }
        // else if(limit){
        //     if(result.length > limit){
        //         //result.splice(limit);
        //         result = result.slice(0, limit);
        //     }
        // }

        for(let i = 0; i < result.length; i++){
            result[i] = type === "number"
                ? parseInt(result[i].value, 10)
                : result[i].value
        }

        return result;
    });
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

RedisDB.prototype.commit = async function(flexsearch, _replace, _append){

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
                tasks[i] = "" + task.del;
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

    await this.transaction(function(trx){

        let refs = Object.create(null);
        for(const item of flexsearch.map){
            const key = item[0];
            const arr = item[1];
            for(let i = 0, ids; i < arr.length; i++){
                if((ids = arr[i]) && ids.length){

                    let result = [];
                    for(let j = 0; j < ids.length; j++){
                        result.push({
                            score: i,
                            value: "" + ids[j]
                        });
                    }
                    if(typeof ids[0] === "number"){
                        this.type = "number";
                    }

                    const ref = this.id + "map" + this.field + ":" + key;
                    trx.zAdd(ref, result);
                    // if(this.fastupdate) for(let j = 0; j < ids.length; j++){
                    //     trx.sAdd("ref" + this.field + ":" + ids[j], ref);
                    // }
                    if(this.fastupdate) for(let j = 0, id; j < ids.length; j++){
                        // Map performs bad when pushing numeric-like values as key
                        // id = ids[j];
                        // let tmp = refs.get(id);
                        // tmp || refs.set(id, tmp = []);
                        // tmp.push(ref);
                        id = ids[j];
                        let tmp = refs[id] || (refs[id] = []);
                        tmp.push(ref);
                    }
                }
            }
        }
        // if(this.fastupdate) for(let item of refs){
        //     const key = item[0];
        //     const value = item[1];
        //     trx.sAdd("ref" + this.field + ":" + key, value);
        // }
        if(this.fastupdate) for(let key in refs){
            trx.sAdd(this.id + "ref" + this.field + ":" + key, refs[key]);
        }

        refs = Object.create(null);
        for(const ctx of flexsearch.ctx){
            const ctx_key = ctx[0];
            const ctx_value = ctx[1];
            for(const item of ctx_value){
                const key = item[0];
                const arr = item[1];
                for(let i = 0, ids; i < arr.length; i++){
                    if((ids = arr[i]) && ids.length){

                        let result = [];
                        for(let j = 0; j < ids.length; j++){
                            result.push({ score: i, value: "" + ids[j] });
                        }
                        if(typeof ids[0] === "number"){
                            this.type = "number";
                        }

                        const ref = this.id + "ctx" + this.field + ":" + ctx_key + ":" + key;
                        trx.zAdd(ref, result);
                        // if(this.fastupdate) for(let j = 0; j < ids.length; j++){
                        //     trx.sAdd("ref" + this.field + ":" + ids[j], ref);
                        // }
                        if(this.fastupdate) for(let j = 0, id; j < ids.length; j++){
                            // Map performs bad when pushing numeric-like values as key
                            // id = ids[j];
                            // let tmp = refs.get(id);
                            // tmp || refs.set(id, tmp = []);
                            // tmp.push(ref);
                            id = ids[j];
                            let tmp = refs[id] || (refs[id] = []);
                            tmp.push(ref);
                        }
                    }
                }
            }
        }
        // if(this.fastupdate) for(let item of refs){
        //     const key = item[0];
        //     const value = item[1];
        //     trx.sAdd("ref" + this.field + ":" + key, value);
        // }
        if(this.fastupdate) for(let key in refs){
            trx.sAdd(this.id + "ref" + this.field + ":" + key, refs[key]);
        }

        let ids = [...flexsearch.reg.keys()];
        if(ids.length){
            if(typeof ids[0] === "number"){
                ids = ids.map(id => "" + id);
            }
            trx.sAdd(this.id + "reg", ids);
        }

        trx.set(this.id + "cfg" + this.field, JSON.stringify({
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

    flexsearch.map.clear();
    flexsearch.ctx.clear();
    flexsearch.reg.clear();
};

RedisDB.prototype.remove = function(ids){

    if(typeof ids !== "object"){
        ids = [ids];
    }
    if(!ids.length){
        return;
    }
    if(typeof ids[0] === "number"){
        ids = ids.map(item => "" + item);
    }
    if(ids.length > 10000){
        const self = this;
        const next = ids.splice(10000);
        //ids = ids.slice(10000);
        return this.remove(ids).then(function(){
            return self.remove(next);
        });
    }

    return this.transaction(async function(trx){

        const check = await this.db.smIsMember(this.id + "reg", ids);

        for(let i = 0, id; i < ids.length; i++){
            if(!check[i]) continue;
            id = ids[i];

            if(this.fastupdate){
                // const refs = new Map();
                const ref = await this.db.sMembers(this.id + "ref" + this.field + ":" + id);
                if(ref){
                    for(let j = 0; j < ref.length; j++){
                        // let tmp = refs.get(ref[j]);
                        // tmp || refs.set(ref[j], tmp = []);
                        // tmp.push(id);
                        trx.zRem(ref[j], id);
                    }
                    trx.unlink(this.id + "ref" + this.field + ":" + id);
                }
                // for(let item of refs){
                //     //console.log(item[0], item[1])
                //     trx.zRem(item[0], item[1]);
                // }
            }
            else{

                // todo scan
            }

            trx.sRem(this.id + "reg", id);
        }
    });
};
