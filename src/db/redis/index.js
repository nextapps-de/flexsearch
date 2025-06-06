import { createClient } from "redis";
import StorageInterface from "../interface.js";
import { toArray } from "../../common.js";

const VERSION = 1;
const fields = ["map", "ctx", "reg", "tag", "doc", "cfg"];
const defaults = {
    host: "localhost",
    port: "6379",
    user: null,
    pass: null
};
let DB, TRX;

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

/**
 * @constructor
 * @implements StorageInterface
 */
export default function RedisDB(name, config = {}){
    if(!this || this.constructor !== RedisDB){
        return new RedisDB(name, config);
    }
    if(typeof name === "object"){
        config = name;
        name = name.name;
    }
    if(!name){
        console.info("Default storage space was used, because a name was not passed.");
    }
    this.id = (name ? sanitize(name) : "flexsearch") + "|";
    this.field = config.field ? "-" + sanitize(config.field) : "";
    this.type = config.type || "";
    this.fastupdate = true;
    this.db = config.db || DB || null;
    this.support_tag_search = true;
    this.resolution = 9;
    this.resolution_ctx = 9;
    //this.trx = false;
    Object.assign(defaults, config);
    this.db && delete defaults.db;
};

// RedisDB.mount = function(flexsearch){
//     return new this().mount(flexsearch);
// };

RedisDB.prototype.mount = function(flexsearch){
    //if(flexsearch.constructor === Document){
    if(flexsearch.index){
        return flexsearch.mount(this);
    }
    flexsearch.db = this;
    this.resolution = flexsearch.resolution;
    this.resolution_ctx = flexsearch.resolution_ctx;
    // todo support
    //this.fastupdate = flexsearch.fastupdate;
    return this.open();
};

RedisDB.prototype.open = async function(){
    if(this.db){
        return this.db
    }
    if(DB){
        return this.db = DB;
    }
    let url = defaults.url;
    if(!url){
        url = defaults.user
            ? `redis://${defaults.user}:${defaults.pass}@${defaults.host}:${defaults.port}`
            : `redis://${defaults.host}:${defaults.port}`;
    }
    return this.db = DB =
        await createClient(url)
        .on("error", err => console.error(err))
        .connect();
};

RedisDB.prototype.close = async function(){
    DB && await this.db.disconnect(); // this.db.client.disconnect();
    this.db = DB = null;
    return this;
};

RedisDB.prototype.destroy = function(){
    return this.clear(true);
};

RedisDB.prototype.clear = function(destroy = false){
    if(!this.id) return;
    const self = this;
    function unlink(keys){
        return keys.length && self.db.unlink(keys);
    }
    return Promise.all([
        this.db.keys(this.id + "map" + (destroy ? "" : this.field) + "*").then(unlink),
        this.db.keys(this.id + "ctx" + (destroy ? "" : this.field) + "*").then(unlink),
        this.db.keys(this.id + "tag" + (destroy ? "" : this.field) + "*").then(unlink),
        this.db.keys(this.id + "ref" + (destroy ? "" : this.field) + "*").then(unlink),
        unlink([
            this.id + "cfg" + (destroy ? "*" : this.field),
            this.id + "doc",
            this.id + "reg"
        ])
    ]);
};

function create_result(range, type, resolve, enrich, resolution){
    if(resolve){
        for(let i = 0, tmp, id; i < range.length; i++){
            tmp = range[i];
            id = type === "number"
                ? parseInt(tmp.value || tmp, 10)
                : tmp.value || tmp;
            range[i] = enrich
                ? { id, doc: tmp.doc }
                : id;
        }
        return range;
    }
    else {
        let result = [];
        for(let i = 0, tmp, id, score; i < range.length; i++){
            tmp = range[i];
            id = type === "number"
                ? parseInt(tmp.value || tmp, 10)
                : tmp.value || tmp;
            score = Math.max(resolution - tmp.score, 0);
            result[score] || (result[score] = []);
            result[score].push(id);
        }
        return result;
    }
}

RedisDB.prototype.get = function(key, ctx, limit = 0, offset = 0, resolve = true, enrich = false, tags){

    if(tags){
        // flexsearch dummy
        const flexsearch = { depth: !!ctx };
        const query = ctx ? [ctx, key] : [key]; // keyword first
        return this.search(flexsearch, query, limit, offset, /* suggest */ false, resolve, enrich, tags);
    }

    const type = this.type;
    const self = this;
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

    return result.then(async function(range){
        if(!range.length) return range;
        if(enrich) range = await self.enrich(range);
        return create_result(range, type, resolve, enrich, ctx ? self.resolution_ctx : self.resolution);
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
    return this.db.hmGet(this.id + "doc", this.type === "number" ? ids.map(i => "" + i) : ids).then(function(res){
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
    return this.db.sIsMember(this.id + "reg", "" + id).then(function(res){
        return !!res;
    });
};

RedisDB.prototype.search = function(flexsearch, query, limit = 100, offset = 0, suggest = false, resolve = true, enrich = false, tags){

    const ctx = query.length > 1 && flexsearch.depth;
    let result;
    let params = [];
    let weights = [];

    if(ctx){

        const key = this.id + "ctx" + this.field + ":";
        let keyword = query[0];
        let term;

        for(let i = 1, swap; i < query.length; i++){
            term = query[i];
            swap = flexsearch.bidirectional && (term > keyword);
            params.push(key + (swap ? term : keyword) + ":" + (swap ? keyword : term));
            weights.push(1);
            keyword = term;
        }
    }
    else{

        const key = this.id + "map" + this.field + ":";
        for(let i = 0; i < query.length; i++){
            params.push(key + query[i]);
            weights.push(1);
        }
    }

    query = params;

    const type = this.type;
    let key = this.id + "tmp:" + Math.random();
    const strict_tag_intersection = true;

    if(suggest){
        if(!strict_tag_intersection){
            if(tags) for(let i = 0; i < tags.length; i += 2){
                query.push(this.id + "tag-" + sanitize(tags[i]) + ":" + tags[i + 1]);
                weights.push(1);
            }
        }
        const multi = this.db.multi();
        // The zStore implementation lacks of ordering by match count (occurrences).
        // Unfortunately, I couldn't find an elegant way to overcome this issue completely.
        // For this reason it needs additionally a zInterStore to boost at least matches
        // when all terms were found
        multi.zInterStore(key, query, { AGGREGATE: "SUM" });
        query.push(key);
        weights.push(query.length);
        multi.zUnionStore(key, query, { WEIGHTS: weights, AGGREGATE: "SUM" });
        // Strict Tag Intersection: it does not put tags into union, instead it calculates the
        // intersection against the term match union. This was the default behavior
        // of Tag-Search. But putting everything into union will also provide suggestions derived
        // from tags when no term was matched.
        if(strict_tag_intersection){
            if(tags){
                // copy over zInterStore into the same destination surprisingly works fine
                // const key2 = key + ":2";
                query = [key];
                for(let i = 0; i < tags.length; i += 2){
                    query.push(this.id + "tag-" + sanitize(tags[i]) + ":" + tags[i + 1]);
                }
                multi.zInterStore(key, query, { AGGREGATE: "MAX" });
                // .unlink(key)
                // key = key2;
            }
        }
        result = multi
            [(resolve ? "zRange" : "zRangeWithScores")](
                key,
                "" + offset,
                "" + (offset + limit - 1),
                { REV: true }
            )
            .unlink(key)
            .exec();
    }
    else{
        if(tags) for(let i = 0; i < tags.length; i += 2){
            query.push(this.id + "tag-" + sanitize(tags[i]) + ":" + tags[i + 1]);
        }
        result = this.db.multi()
            .zInterStore(key, query, { AGGREGATE: "MAX" })
            [(resolve ? "zRange" : "zRangeWithScores")](
                key,
                "" + offset,
                "" + (offset + limit - 1),
                { REV: true }
            )
            .unlink(key)
            .exec();
    }

    const self = this;
    return result.then(async function(range){
        range = suggest && tags
            // take the 3rd result from batch return
            ? range[3]
            // take the 2nd result from batch return
            : range[suggest ? 2 : 1];
        if(!range.length) return range;
        if(enrich) range = await self.enrich(range);
        return create_result(range, type, resolve, enrich, ctx ? self.resolution_ctx : self.resolution);
    });
};

RedisDB.prototype.info = function(){
    // todo
};

RedisDB.prototype.transaction = function(task, callback){

    if(TRX){
        return task.call(this, TRX);
    }

    TRX = this.db.multi();
    let promise1 = /*await*/ task.call(this, TRX)
    let promise2 = TRX.exec();
    TRX = null;
    return Promise.all([promise1, promise2]).then(function(){
        callback && callback();
    });
};

RedisDB.prototype.commit = async function(flexsearch){

    let tasks = flexsearch.commit_task;
    let removals = [];
    flexsearch.commit_task = [];

    for(let i = 0, task; i < tasks.length; i++){
        /** @dict */
        task = tasks[i];
        if(task["del"]){
            removals.push(task["del"]);
        }
        else if(task["ins"]){

        }
    }

    if(removals.length){
        await this.remove(removals);
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
                            score: this.resolution - i,
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
                            result.push({
                                score: this.resolution_ctx - i,
                                value: "" + ids[j]
                            });
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
            let ids = toArray(flexsearch.reg, /* stringify */ true);
            if(ids.length){
                trx.sAdd(this.id + "reg", ids);
            }
        }

        if(flexsearch.tag){
            for(const item of flexsearch.tag){
                const tag = item[0];
                const ids = item[1];
                if(!ids.length) continue;
                let result = [];
                // for(let i = 0; i < ids.length; i++){
                //     result.push({
                //         score: 0,
                //         value: "" + ids[i]
                //     });
                // }
                if(typeof ids[0] === "number"){
                    for(let i = 0; i < ids.length; i++){
                        result[i] = "" + ids[i];
                    }
                }
                else{
                    result = ids;
                }
                trx.sAdd(this.id + "tag" + this.field + ":" + tag, result);
            }
        }

        // TODO
        // trx.set(this.id + "cfg" + this.field, JSON.stringify({
        //     "encode": typeof flexsearch.encode === "string" ? flexsearch.encode : "",
        //     "charset": typeof flexsearch.charset === "string" ? flexsearch.charset : "",
        //     "tokenize": flexsearch.tokenize,
        //     "resolution": flexsearch.resolution,
        //     "minlength": flexsearch.minlength,
        //     "optimize": flexsearch.optimize,
        //     "fastupdate": flexsearch.fastupdate,
        //     "encoder": flexsearch.encoder,
        //     "context": {
        //         "depth": flexsearch.depth,
        //         "bidirectional": flexsearch.bidirectional,
        //         "resolution": flexsearch.resolution_ctx
        //     }
        // }));
    });

    flexsearch.map.clear();
    flexsearch.ctx.clear();
    flexsearch.tag &&
    flexsearch.tag.clear();
    flexsearch.store &&
    flexsearch.store.clear();
    flexsearch.document ||
    flexsearch.reg.clear();
};

RedisDB.prototype.remove = function(ids){

    if(!ids && ids !== 0){
        return;
    }
    if(typeof ids !== "object"){
        ids = [ids];
    }
    if(!ids.length){
        return;
    }

    return this.transaction(async function(trx){

        while(ids.length){
            let next;
            if(ids.length > 10000){
                next = ids.slice(10000);
                ids = ids.slice(0, 10000);
            }

            if(typeof ids[0] === "number"){
                for(let i = 0; i < ids.length; i++){
                    ids[i] = "" + ids[i];
                }
            }

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

            if(next) ids = next;
            else break;
        }
    });
};
