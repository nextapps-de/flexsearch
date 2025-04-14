import { createClient } from "redis";
const defaults = {
    host: "localhost",
    port: "6379",
    user: null,
    pass: null
},
      VERSION = 1,
      fields = ["map", "ctx", "reg", "tag", "doc", "cfg"];

import StorageInterface from "../interface.js";
import { toArray } from "../../common.js";

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

let DB, TRX;

/**
 * @constructor
 * @implements StorageInterface
 */

export default function RedisDB(name, config = {}) {
    if (!this || this.constructor !== RedisDB) {
        return new RedisDB(name, config);
    }
    if ("object" == typeof name) {
        config = name;
        name = name.name;
    }
    if (!name) {
        console.info("Default storage space was used, because a name was not passed.");
    }
    this.id = (name ? sanitize(name) : "flexsearch") + "|";
    this.field = config.field ? "-" + sanitize(config.field) : "";
    this.type = config.type || "";
    this.fastupdate = /* tag? */ /* stringify */ /* stringify */!0 /*await rows.hasNext()*/ /*await rows.hasNext()*/ /*await rows.hasNext()*/;
    this.db = config.db || DB || null;
    this.support_tag_search = !0;
    //this.trx = false;
    Object.assign(defaults, config);
    this.db && delete defaults.db;
}

// RedisDB.mount = function(flexsearch){
//     return new this().mount(flexsearch);
// };

RedisDB.prototype.mount = function (flexsearch) {
    //if(flexsearch.constructor === Document){
    if (flexsearch.index) {
        return flexsearch.mount(this);
    }
    flexsearch.db = this;
    // todo support
    //this.fastupdate = flexsearch.fastupdate;
    return this.open();
};

RedisDB.prototype.open = async function () {
    if (this.db) {
        return this.db;
    }
    if (DB) {
        return this.db = DB;
    }
    let url = defaults.url;
    if (!url) {
        url = defaults.user ? `redis://${defaults.user}:${defaults.pass}@${defaults.host}:${defaults.port}` : `redis://${defaults.host}:${defaults.port}`;
    }
    return this.db = DB = await createClient(url).on("error", err => console.error(err)).connect();
};

RedisDB.prototype.close = async function () {
    DB && (await this.db.disconnect()); // this.db.client.disconnect();
    this.db = DB = null;
    return this;
};

RedisDB.prototype.destroy = function () {
    return this.clear();
};

RedisDB.prototype.clear = function () {
    return this.db.unlink([this.id + "map" + this.field, this.id + "ctx" + this.field, this.id + "tag" + this.field, this.id + "cfg" + this.field, this.id + "doc", this.id + "reg"]);
};

function create_result(range, type, resolve, enrich) {
    if (resolve) {
        if ("number" === type) {
            for (let i = 0, tmp, id; i < range.length; i++) {
                tmp = range[i];
                id = "number" === type ? parseInt(tmp.id || tmp, 10) : tmp.id || tmp;
                range[i] = enrich ? { id, doc: tmp.doc } : id;
            }
        }
        return range;
    } else {
        let result = [];
        for (let i = 0, tmp, id, score; i < range.length; i++) {
            tmp = range[i];
            id = "number" === type ? parseInt(tmp.id || tmp, 10) : tmp.id || tmp;
            score = tmp.score;
            result[score] || (result[score] = []);
            result[score].push(id);
        }
        return result;
    }
}

RedisDB.prototype.get = function (key, ctx, limit = 0, offset = 0, resolve = !0, enrich = /* suggest */!1, tags) {

    if (tags) {
        // flexsearch dummy
        const query = ctx ? [ctx, key] : [key];
        // keyword first
        return this.search({ depth: !!ctx }, query, limit, offset, !1, resolve, enrich, tags);
    }

    const type = this.type,
          self = this;

    let result;

    if (ctx) {
        result = this.db[resolve ? "zRange" : "zRangeWithScores"](this.id + "ctx" + this.field + ":" + ctx + ":" + key, "" + offset, "" + (offset + limit - 1), { REV: !0 });
    } else {
        result = this.db[resolve ? "zRange" : "zRangeWithScores"](this.id + "map" + this.field + ":" + key, "" + offset, "" + (offset + limit - 1), { REV: !0 });
    }

    return result.then(async function (range) {
        if (!range.length) return range;
        if (enrich) range = await self.enrich(range);
        return create_result(range, type, resolve, enrich);
    });
};

RedisDB.prototype.tag = function (tag, limit = 0, offset = 0, enrich = !1) {
    const self = this;
    return this.db.sMembers(this.id + "tag" + this.field + ":" + tag).then(function (ids) {
        if (!ids || !ids.length || offset >= ids.length) return [];
        if (!limit && !offset) return ids;
        const result = ids.slice(offset, offset + limit);
        return enrich ? self.enrich(result) : result;
    });
};

RedisDB.prototype.enrich = function (ids) {
    if ("object" != typeof ids) {
        ids = [ids];
    }
    return this.db.hmGet(this.id + "doc", ids).then(function (res) {
        for (let i = 0; i < res.length; i++) {
            res[i] = {
                id: ids[i],
                doc: res[i] && JSON.parse(res[i])
            };
        }
        return res;
    });
};

RedisDB.prototype.has = function (id) {
    return this.db.sIsMember(this.id + "reg", "" + id);
};

RedisDB.prototype.search = function (flexsearch, query, limit = 100, offset = 0, suggest = !1, resolve = !0, enrich = !1, tags) {
    let result,
        params = [];


    if (1 < query.length && flexsearch.depth) {

        const key = this.id + "ctx" + this.field + ":";
        let keyword = query[0],
            term;


        for (let i = 1, swap; i < query.length; i++) {
            term = query[i];
            swap = flexsearch.bidirectional && term > keyword;
            params.push(key + (swap ? term : keyword) + ":" + (swap ? keyword : term));
            keyword = term;
        }
    } else {

        const key = this.id + "map" + this.field + ":";
        for (let i = 0; i < query.length; i++) {
            params.push(key + query[i]);
        }
    }

    query = params;

    const type = this.type;
    let key = this.id + "tmp:" + Math.random();


    if (suggest) {
        const multi = this.db.multi().zUnionStore(key, query, { AGGREGATE: "SUM" });
        // Strict Tag Intersection: it does not put tags into union, instead it calculates the
        // intersection against the term match union. This was the default behavior
        // of Tag-Search. But putting everything into union will also provide suggestions derived
        // from tags when no term was matched.
        if (tags) {
            // copy over zInterStore into the same destination surprisingly works fine
            // const key2 = key + ":2";
            query = [key];
            for (let i = 0; i < tags.length; i += 2) {
                query.push(this.id + "tag-" + sanitize(tags[i]) + ":" + tags[i + 1]);
            }
            multi.zInterStore(key, query, { AGGREGATE: "SUM" });
            // .unlink(key)
            // key = key2;
        }

        result = multi[resolve ? "zRange" : "zRangeWithScores"](key, "" + offset, "" + (offset + limit - 1), { REV: !0 }).unlink(key).exec();
    } else {
        if (tags) for (let i = 0; i < tags.length; i += 2) {
            query.push(this.id + "tag-" + sanitize(tags[i]) + ":" + tags[i + 1]);
        }
        result = this.db.multi().zInterStore(key, query, { AGGREGATE: "MIN" })[resolve ? "zRange" : "zRangeWithScores"](key, "" + offset, "" + (offset + limit - 1), { REV: !0 }).unlink(key).exec();
    }

    const self = this;
    return result.then(async function (range) {
        range = suggest && tags
        // take the 3rd result from batch return
        ? range[2]
        // take the 2nd result from batch return
        : range[1];
        if (!range.length) return range;
        if (enrich) range = await self.enrich(range);
        return create_result(range, type, resolve, enrich);
    });
};

RedisDB.prototype.info = function () {
    // todo
};

RedisDB.prototype.transaction = async function (task, callback) {

    if (TRX) {
        return task.call(this, TRX);
    }

    TRX = this.db.multi();
    let promise1 = /*await*/task.call(this, TRX),
        promise2 = TRX.exec();

    TRX = null;
    callback && promise.then(callback);
    await Promise.all([promise1, promise2]);
};

RedisDB.prototype.commit = async function (flexsearch, _replace, _append) {

    // process cleanup tasks
    if (_replace) {
        await this.clear();
        // there are just removals in the task queue
        flexsearch.commit_task = [];
    } else {
        let tasks = flexsearch.commit_task;
        flexsearch.commit_task = [];
        for (let i = 0, task; i < tasks.length; i++) {
            task = tasks[i];
            // there are just removals in the task queue
            if (task.clear) {
                await this.clear();
                _replace = !0;
                break;
            } else {
                tasks[i] = "" + task.del;
            }
        }
        if (!_replace) {
            if (!_append) {
                tasks = tasks.concat(toArray(flexsearch.reg, !0));
            }
            tasks.length && (await this.remove(tasks));
        }
    }

    if (!flexsearch.reg.size) {
        return;
    }

    await this.transaction(function (trx) {

        let refs = new Map();
        for (const item of flexsearch.map) {
            const key = item[0],
                  arr = item[1];

            for (let i = 0, ids; i < arr.length; i++) {
                if ((ids = arr[i]) && ids.length) {

                    let result = [];
                    for (let j = 0; j < ids.length; j++) {
                        result.push({
                            score: i,
                            value: "" + ids[j]
                        });
                    }
                    if ("number" == typeof ids[0]) {
                        this.type = "number";
                    }

                    const ref = this.id + "map" + this.field + ":" + key;
                    trx.zAdd(ref, result);
                    // if(this.fastupdate) for(let j = 0; j < ids.length; j++){
                    //     trx.sAdd("ref" + this.field + ":" + ids[j], ref);
                    // }
                    if (this.fastupdate) for (let j = 0, id; j < ids.length; j++) {
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
        if (this.fastupdate) for (const item of refs) {
            const key = item[0],
                  value = item[1];

            trx.sAdd(this.id + "ref" + this.field + ":" + key, value);
        }

        refs = new Map();
        for (const ctx of flexsearch.ctx) {
            const ctx_key = ctx[0],
                  ctx_value = ctx[1];

            for (const item of ctx_value) {
                const key = item[0],
                      arr = item[1];

                for (let i = 0, ids; i < arr.length; i++) {
                    if ((ids = arr[i]) && ids.length) {
                        let result = [];
                        for (let j = 0; j < ids.length; j++) {
                            result.push({ score: i, value: "" + ids[j] });
                        }
                        if ("number" == typeof ids[0]) {
                            this.type = "number";
                        }
                        const ref = this.id + "ctx" + this.field + ":" + ctx_key + ":" + key;
                        trx.zAdd(ref, result);
                        // if(this.fastupdate) for(let j = 0; j < ids.length; j++){
                        //     trx.sAdd("ref" + this.field + ":" + ids[j], ref);
                        // }
                        if (this.fastupdate) for (let j = 0, id; j < ids.length; j++) {
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

        if (this.fastupdate) for (const item of refs) {
            const key = item[0],
                  value = item[1];

            trx.sAdd(this.id + "ref" + this.field + ":" + key, value);
        }

        if (flexsearch.store) {
            for (const item of flexsearch.store.entries()) {
                const id = item[0],
                      doc = item[1];

                doc && trx.hSet(this.id + "doc", "" + id, JSON.stringify(doc));
            }
        }
        if (!flexsearch.bypass) {
            let ids = toArray(flexsearch.reg, !0);
            if (ids.length) {
                trx.sAdd(this.id + "reg", ids);
            }
        }

        if (flexsearch.tag) {
            for (const item of flexsearch.tag) {
                const tag = item[0],
                      ids = item[1];

                if (!ids.length) continue;
                let result = [];
                // for(let i = 0; i < ids.length; i++){
                //     result.push({
                //         score: 0,
                //         value: "" + ids[i]
                //     });
                // }
                if ("number" == typeof ids[0]) {
                    for (let i = 0; i < ids.length; i++) {
                        result[i] = "" + ids[i];
                    }
                } else {
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
    flexsearch.tag && flexsearch.tag.clear();
    flexsearch.store && flexsearch.store.clear();
    flexsearch.document || flexsearch.reg.clear();
};

RedisDB.prototype.remove = function (ids) {

    if (!ids && 0 !== ids) {
        return;
    }
    if ("object" != typeof ids) {
        ids = [ids];
    }
    if (!ids.length) {
        return;
    }

    return this.transaction(async function (trx) {

        while (ids.length) {
            let next;
            if (10000 < ids.length) {
                next = ids.slice(10000);
                ids = ids.slice(0, 10000);
            }

            if ("number" == typeof ids[0]) {
                for (let i = 0; i < ids.length; i++) {
                    ids[i] = "" + ids[i];
                }
            }

            const check = await this.db.smIsMember(this.id + "reg", ids);

            for (let i = 0, id; i < ids.length; i++) {
                if (!check[i]) continue;
                id = "" + ids[i];

                if (this.fastupdate) {
                    // const refs = new Map();
                    const ref = await this.db.sMembers(this.id + "ref" + this.field + ":" + id);
                    if (ref) {
                        for (let j = 0; j < ref.length; j++) {
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

                trx.hDel(this.id + "doc", id);
                trx.sRem(this.id + "reg", id);
            }

            if (next) ids = next;else break;
        }
    });
};