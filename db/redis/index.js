import { createClient } from "redis";
const defaults = {
    host: "localhost",
    port: "6379",
    user: null,
    pass: null
};
const VERSION = 1;
const fields = ["map", "ctx", "reg", "tag", "doc", "cfg"];
import StorageInterface from "../interface.js";
import Document from "../../document.js";
import { toArray } from "../../common.js";

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

/**
 * @constructor
 * @implements StorageInterface
 */

export default function RedisDB(name, config = {}){
    if(!(this instanceof RedisDB)){
        return new RedisDB(name, config);
    }
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

// RedisDB.mount = function(flexsearch){
//     return new this().mount(flexsearch);
// };

RedisDB.prototype.mount = function(flexsearch){
    if(flexsearch instanceof Document){
        return flexsearch.mount(this);
    }
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
        this.id + "tag" + this.field,
        this.id + "cfg" + this.field,
        this.id + "doc",
        this.id + "reg"
    ]);
};

function create_result(range, type, resolve, enrich){
    if(resolve){
        for(let i = 0, tmp, id; i < range.length; i++){
            tmp = range[i];
            id = type === "number"
                ? parseInt(tmp.value || tmp, 10)
                : tmp.value || tmp;
            range[i] = /*enrich
                ? { id, doc: tmp.doc }
                :*/ id;
        }
        return range;
    }
    else{
        let result = [];
        for(let i = 0, tmp, id, score; i < range.length; i++){
            tmp = range[i];
            id = type === "number"
                ? parseInt(tmp.value, 10)
                : tmp.value
            score = tmp.score;
            result[score] || (result[score] = []);
            result[score].push(
                enrich
                    ? { id, doc: tmp.doc }
                    : id
            );
        }
        return result;
    }
}

RedisDB.prototype.get = function(key, ctx, limit = 0, offset = 0, resolve = true, enrich = false){
    let result;
    if(ctx){
        result = this.db[resolve ? "zRange" : "zRangeWithScores"](
            this.id + "ctx" + this.field + ":" + ctx + ":" + key,
            "" + offset,
            "" + (offset + limit - 1),
            { REV: true }
        );
    }
    else{
        result = this.db[resolve ? "zRange" : "zRangeWithScores"](
            this.id + "map" + this.field + ":" + key,
            "" + offset,
            "" + (offset + limit - 1),
            { REV: true }
        );
    }
    const type = this.type;
    return result.then(function(range){
        return create_result(range, type, resolve, enrich);
    });
};

RedisDB.prototype.tag = function(tag, limit = 0, offset = 0, enrich = false){
    const self = this;
    return this.db.sMembers(this.id + "tag" + this.field + ":" + tag).then(function(ids){
        if(!ids || !ids.length || offset >= ids.length) return [];
        if(!limit && !offset) return ids;
        const result = ids.slice(offset, offset + limit);
        return enrich
            ? self.enrich(result)
            : result;
    });
};

RedisDB.prototype.enrich = function(ids){
    if(typeof ids !== "object"){
        ids = [ids];
    }
    return this.db.hmGet(this.id + "doc", ids).then(function(res){
        for(let i = 0; i < res.length; i++){
            res[i] = {
                id: ids[i],
                doc: res[i] && JSON.parse(res[i])
            };
        }
        return res;
    });
};

RedisDB.prototype.has = function(id){
    return this.db.sIsMember(this.id + "reg", "" + id);
};

// RedisDB.prototype.has = function(ref, key, ctx){
//     switch(ref){
//         case "ctx":
//             return this.db.sIsMember(
//                 this.id + "ctx" + this.field + ":" + ctx + ":" + key,
//                 "" + key
//             );
//         case "map":
//             return this.db.sIsMember(
//                 this.id + "map" + this.field + ":" + key,
//                 "" + key
//             );
//         case "reg":
//             return this.db.sIsMember(
//                 this.id + "reg",
//                 "" + key
//             );
//         // case "cfg":
//         //     return this.db.exists(
//         //         this.id + "cfg" + this.field
//         //     );
//     }
// };

RedisDB.prototype.search = function(flexsearch, query, limit = 100, offset = 0, suggest = false, resolve = true, enrich = false){

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
        query = params;
    }
    else{

        const key = this.id + "map" + this.field + ":";
        for(let i = 0; i < query.length; i++){
            query[i] = key + query[i];
        }
    }

    const type = this.type;
    const key = this.id + "tmp:" + Math.random();
    result = suggest
        ? this.db.multi()
            .zUnionStore(key, query, { AGGREGATE: "SUM" })
            [(resolve ? "zRange" : "zRangeWithScores")](key, "" + offset, "" + (offset + limit - 1), { REV: true })
            .unlink(key)
            .exec()
        : this.db.multi()
            .zInterStore(key, query, { AGGREGATE: "MIN" })
            [(resolve ? "zRange" : "zRangeWithScores")](key, "" + offset, "" + (offset + limit - 1), { REV: true })
            .unlink(key)
            .exec();

    return result.then(async function(range){
        // take the 2nd result from batch return
        range = range[1];
        if(enrich) range = await this.enrich(range);
        return create_result(range, type, resolve, enrich);
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
                tasks = tasks.concat(toArray(flexsearch.reg));
            }
            tasks.length && await this.remove(tasks);
        }
    }

    if(!flexsearch.reg.size){
        return;
    }

    await this.transaction(function(trx){

        let refs = new Map();
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
                        let tmp = refs.get(id);
                        tmp || refs.set(id, tmp = []);
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
        if(this.fastupdate) for(const item of refs){
            const key = item[0];
            const value = item[1];
            trx.sAdd(this.id + "ref" + this.field + ":" + key, value);
        }

        refs = new Map();
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
                            let tmp = refs.get(id);
                            tmp || refs.set(id, tmp = []);
                            tmp.push(ref);
                        }
                    }
                }
            }
        }


        if(this.fastupdate) for(const item of refs){
            const key = item[0];
            const value = item[1];
            trx.sAdd(this.id + "ref" + this.field + ":" + key, value);
        }

        if(flexsearch.store){
            for(const item of flexsearch.store.entries()){
                const id = item[0];
                const doc = item[1];
                doc && trx.hSet(this.id + "doc", "" + id, JSON.stringify(doc));
            }
        }
        if(!flexsearch.bypass){
            let ids = toArray(flexsearch.reg);
            if(ids.length){
                if(typeof ids[0] === "number"){
                    ids = ids.map(id => "" + id);
                }
                trx.sAdd(this.id + "reg", ids);
            }
        }

        if(flexsearch.tag){
            for(const item of flexsearch.tag){
                const tag = item[0];
                let ids = item[1];
                if(!ids.length) continue;
                if(typeof ids[0] === "number"){
                    ids = ids.map(id => "" + id);
                }
                trx.sAdd(this.id + "tag" + this.field + ":" + tag, ids);
            }
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
    flexsearch.tag &&
    flexsearch.tag.clear();
    flexsearch.store &&
    flexsearch.store.clear();
    flexsearch instanceof Document ||
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
            id = "" + ids[i];

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

            trx.hDel(this.id + "doc", id);
            trx.sRem(this.id + "reg", id);
        }
    });
};
