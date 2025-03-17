import { MongoClient } from "mongodb";
const defaults = {
    host: "localhost",
    port: "27017",
    user: null,
    pass: null
},
      VERSION = 1,
      fields = ["map", "ctx", "tag", "reg", "cfg"];

import StorageInterface from "../interface.js";
import { toArray } from "../../common.js";

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

let CLIENT,
    DB = Object.create(null);


/**
 * @constructor
 * @implements StorageInterface
 */

export default function MongoDB(name, config = {}) {
    if (!this) {
        return new MongoDB(name, config);
    }
    if ("object" == typeof name) {
        config = name;
        name = name.name;
    }
    if (!name) {
        console.info("Default storage space was used, because a name was not passed.");
    }
    this.id = "flexsearch" + (name ? "-" + sanitize(name) : "");
    this.field = config.field ? "-" + sanitize(config.field) : "";
    this.type = config.type || "";
    this.db = config.db || DB[this.id] || CLIENT || null;
    this.trx = !1;
    this.support_tag_search = /* tag? */!0 /*await rows.hasNext()*/ /*await rows.hasNext()*/ /*await rows.hasNext()*/;
    Object.assign(defaults, config);
    this.db && delete defaults.db;
}

// MongoDB.mount = function(flexsearch){
//     return new this().mount(flexsearch);
// };

MongoDB.prototype.mount = function (flexsearch) {
    //if(flexsearch.constructor === Document){
    if (!flexsearch.encoder) {
        return flexsearch.mount(this);
    }
    flexsearch.db = this;
    return this.open();
};

async function createCollection(db, ref, field) {
    switch (ref) {
        case "map":
            await db.createCollection("map" + field);
            await db.collection("map" + field).createIndex({ key: 1 });
            await db.collection("map" + field).createIndex({ id: 1 });
            break;
        case "ctx":
            await db.createCollection("ctx" + field);
            await db.collection("ctx" + field).createIndex({ ctx: 1, key: 1 });
            await db.collection("ctx" + field).createIndex({ id: 1 });
            break;
        case "tag":
            await db.createCollection("tag" + field);
            await db.collection("tag" + field).createIndex({ tag: 1 });
            await db.collection("tag" + field).createIndex({ id: 1 });
            break;
        case "reg":
            await db.createCollection("reg");
            await db.collection("reg").createIndex({ id: 1 });
            break;
        case "cfg":
            await db.createCollection("cfg" + field);
    }
}

MongoDB.prototype.open = async function () {

    if (!this.db) {
        if (!(this.db = DB[this.id])) {
            if (!(this.db = CLIENT)) {

                let url = defaults.url;
                if (!url) {
                    url = defaults.user ? `mongodb://${defaults.user}:${defaults.pass}@${defaults.host}:${defaults.port}` : `mongodb://${defaults.host}:${defaults.port}`;
                }
                this.db = CLIENT = new MongoClient(url);
                await this.db.connect();
            }
        }
    }

    if (this.db.db) {
        this.db = DB[this.id] = this.db.db(this.id);
    }

    const collections = await this.db.listCollections().toArray();

    for (let i = 0, found; i < fields.length; i++) {
        found = !1;

        for (let j = 0; j < collections.length; j++) {
            if (collections[j].name === fields[i] + ("reg" !== fields[i] ? this.field : "")) {
                found = !0;
                break;
            }
        }
        if (!found) {
            await createCollection(this.db, fields[i], this.field);
        }
    }

    return this.db;
};

MongoDB.prototype.close = function () {
    this.db.close();
    this.db = null;
    return this;
};

MongoDB.prototype.destroy = function () {
    return Promise.all([this.db.dropCollection("map" + this.field), this.db.dropCollection("ctx" + this.field), this.db.dropCollection("tag" + this.field), this.db.dropCollection("cfg" + this.field), this.db.dropCollection("reg")]);
};

async function clear(ref) {
    await this.db.dropCollection(ref);
    await createCollection(this.db, ref, this.field);
}

MongoDB.prototype.clear = function () {
    return Promise.all([clear.call(this, "map" + this.field), clear.call(this, "ctx" + this.field), clear.call(this, "tag" + this.field), clear.call(this, "cfg" + this.field), clear.call(this, "reg")]);
};

function create_result(rows, resolve, enrich) {
    if (resolve) {
        if (!enrich) for (let i = 0; i < rows.length; i++) {
            rows[i] = rows[i].id;
        }
        return rows;
    } else {
        const arr = [];
        for (let i = 0, row; i < rows.length; i++) {
            row = rows[i];
            arr[row.res] || (arr[row.res] = []);
            arr[row.res].push(enrich ? row : row.id);
        }
        return arr;
    }
}

MongoDB.prototype.get = async function (key, ctx, limit = 0, offset = 0, resolve = !0, enrich = !1, tags) {
    let rows,
        params = ctx ? { ctx, key } : { key };

    if (!enrich && !tags) {
        rows = await this.db.collection((ctx ? "ctx" : "map") + this.field).find(params, { projection: { _id: 0, res: 1, id: 1 }, limit, skip: offset }).toArray();
    } else {
        const project = { _id: 0, id: 1 },
              stmt = [{ $match: params }];


        if (!resolve) {
            project.res = 1;
        }

        if (enrich) {
            project.doc = "$doc.doc";
            stmt.push({ $lookup: {
                    from: "reg",
                    localField: "id",
                    foreignField: "id",
                    as: "doc"
                } }, { $unwind: {
                    path: "$doc",
                    preserveNullAndEmptyArrays: !0
                } });
        }

        if (tags) {

            const match = {};
            for (let i = 0, count = 1; i < tags.length; i += 2) {
                project["tag" + count] = "$tag" + count + ".tag";
                match["tag" + count] = tags[i + 1];
                stmt.push({ $lookup: {
                        from: "tag-" + sanitize(tags[i]),
                        localField: "id",
                        foreignField: "id",
                        as: "tag" + count
                    } });
                count++;
            }

            stmt.push({ $project: project }, { $match: match }, { $project: { id: 1, doc: 1 } });
        } else {
            stmt.push({ $project: project });
        }

        stmt.push({ $sort: { res: 1 } }, { $skip: offset }, { $limit: limit });

        rows = [];
        const result = await this.db.collection((ctx ? "ctx" : "map") + this.field).aggregate(stmt);

        while (!0) {
            const row = await result.next();
            if (row) rows.push(row);else break;
        }
    }

    return create_result(rows, resolve, enrich);
};

MongoDB.prototype.tag = async function (tag, limit = 0, offset = 0, enrich = !1) {

    if (!enrich) {

        const rows = await this.db.collection("tag" + this.field).find({ tag }, { projection: { _id: 0, id: 1 }, limit, skip: offset }).toArray();
        return create_result(rows, !0, !1);
    } else {

        let rows = [];
        const result = await this.db.collection("tag" + this.field).aggregate([{ $match: { tag } }, { $skip: offset }, { $limit: limit }, { $lookup: {
                from: "reg",
                localField: "id",
                foreignField: "id",
                as: "doc"
            } }, { $project: { _id: 0, id: 1, doc: "$doc.doc" } }, { $unwind: {
                path: "$doc",
                preserveNullAndEmptyArrays: !0
            } }]);

        while (!0) {
            const row = await result.next();
            if (row) rows.push(row);else break;
        }

        return rows;
    }
};

MongoDB.prototype.enrich = function (ids) {
    if ("object" != typeof ids) {
        ids = [ids];
    }
    return this.db.collection("reg").find({ id: { $in: ids } }, { projection: { _id: 0, id: 1, doc: 1 } }).toArray();
};

MongoDB.prototype.has = function (id) {
    return this.db.collection("reg").countDocuments({ id }, { limit: 1 });
};

MongoDB.prototype.search = async function (flexsearch, query, limit = 100, offset = 0, suggest = !1, resolve = !0, enrich = !1, tags) {

    let result = [],
        rows;

    if (1 < query.length && flexsearch.depth) {
        let params = [],
            keyword = query[0],
            term;


        for (let i = 1; i < query.length; i++) {
            term = query[i];
            const swap = flexsearch.bidirectional && term > keyword;
            params.push({
                ctx: swap ? term : keyword,
                key: swap ? keyword : term
            });
            keyword = term;
        }

        let project = resolve ? { _id: 1 } : { _id: 1, res: 1 };

        const stmt = [{ $match: { $or: params } }, { $group: {
                _id: "$id",
                res: suggest ? { $sum: 1 } : { $min: 1 },
                count: { $sum: 1 }
            } }];

        suggest || stmt.push({ $match: { count: query.length - 1 } });

        if (enrich) {
            project.doc = "$doc.doc";
            stmt.push({ $lookup: {
                    from: "reg",
                    localField: "_id",
                    foreignField: "id",
                    as: "doc"
                } }, { $unwind: {
                    path: "$doc",
                    preserveNullAndEmptyArrays: !0
                } });
        }

        if (tags) {

            const match = {};
            for (let i = 0, count = 1; i < tags.length; i += 2) {
                project["tag" + count] = "$tag" + count + ".tag";
                match["tag" + count] = tags[i + 1];
                stmt.push({ $lookup: {
                        from: "tag-" + sanitize(tags[i]),
                        localField: "_id",
                        foreignField: "id",
                        as: "tag" + count
                    } });
                count++;
            }

            stmt.push({ $project: project }, { $match: match });
        } else {
            stmt.push({ $project: project });
        }

        stmt.push({ $sort: suggest ? { count: -1, res: 1 } : { res: 1 } }, { $skip: offset }, { $limit: limit });

        if (tags) {
            project = { _id: 1 };
            if (!resolve) project.res = 1;
            if (enrich) project.doc = 1;

            stmt.push({ $project: project });
        }

        rows = await this.db.collection("ctx" + this.field).aggregate(stmt);
    } else {

        let project = resolve ? { _id: 1 } : { _id: 1, res: 1 };

        const stmt = [{ $match: {
                key: { $in: query }
            } }, { $group: {
                _id: "$id",
                res: suggest ? { $sum: 1 } : { $min: 1 },
                count: { $sum: 1 }
            } }];

        suggest || stmt.push({ $match: { count: query.length } });

        if (enrich) {
            project.doc = "$doc.doc";
            stmt.push({ $lookup: {
                    from: "reg",
                    localField: "_id",
                    foreignField: "id",
                    as: "doc"
                } }, { $unwind: {
                    path: "$doc",
                    preserveNullAndEmptyArrays: !0
                } });
        }

        if (tags) {

            const match = {};
            for (let i = 0, count = 1; i < tags.length; i += 2) {
                project["tag" + count] = "$tag" + count + ".tag";
                match["tag" + count] = tags[i + 1];
                stmt.push({ $lookup: {
                        from: "tag-" + sanitize(tags[i]),
                        localField: "_id",
                        foreignField: "id",
                        as: "tag" + count
                    } });
                count++;
            }

            stmt.push({ $project: project }, { $match: match });
        } else {
            stmt.push({ $project: project });
        }

        stmt.push({ $sort: suggest ? { count: -1, res: 1 } : { res: 1 } }, { $skip: offset }, { $limit: limit });

        if (tags) {
            project = { _id: 1 };
            if (!resolve) project.res = 1;
            if (enrich) project.doc = 1;

            stmt.push({ $project: project });
        }

        rows = await this.db.collection("map" + this.field).aggregate(stmt);
    }

    while (!0) {
        const row = await rows.next();
        if (row) {
            if (resolve && !enrich) {
                result.push(row._id);
            } else {
                row.id = row._id;
                delete row._id;
                result.push(row);
            }
        } else break;
    }

    if (resolve && !enrich) {
        return result;
    } else {
        return create_result(result, resolve, enrich);
    }
};

MongoDB.prototype.info = function () {
    // todo
};

MongoDB.prototype.transaction = function (task) {
    // not supported
    return task.call(this);
};

MongoDB.prototype.commit = async function (flexsearch, _replace, _append) {

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
                tasks[i] = task.del;
            }
        }
        if (!_replace) {
            if (!_append) {
                tasks = tasks.concat(toArray(flexsearch.reg));
            }
            tasks.length && (await this.remove(tasks));
        }
    }

    if (!flexsearch.reg.size) {
        return;
    }

    if (flexsearch.map.size) {
        let data = [];
        for (const item of flexsearch.map) {
            const key = item[0],
                  arr = item[1];

            for (let i = 0, ids; i < arr.length; i++) {
                if ((ids = arr[i]) && ids.length) {
                    this.type || (this.type = typeof ids[0]);
                    for (let j = 0; j < ids.length; j++) {
                        data.push({
                            key: key,
                            res: i,
                            id: ids[j]
                        });
                    }
                }
            }
        }
        if (data.length) {
            await this.db.collection("map" + this.field).insertMany(data);
            flexsearch.map.clear();
        }
    }

    if (flexsearch.ctx.size) {
        let data = [];
        for (const ctx of flexsearch.ctx) {
            const ctx_key = ctx[0],
                  ctx_value = ctx[1];

            for (const item of ctx_value) {
                const key = item[0],
                      arr = item[1];

                for (let i = 0, ids; i < arr.length; i++) {
                    if ((ids = arr[i]) && ids.length) {
                        for (let j = 0; j < ids.length; j++) {
                            data.push({
                                ctx: ctx_key,
                                key: key,
                                res: i,
                                id: ids[j]
                            });
                        }
                    }
                }
            }
        }
        if (data.length) {
            await this.db.collection("ctx" + this.field).insertMany(data);
            flexsearch.ctx.clear();
        }
    }

    if (flexsearch.tag) {
        let data = [];
        if (flexsearch.tag) {
            for (const item of flexsearch.tag) {
                const tag = item[0],
                      ids = item[1];

                if (!ids.length) continue;
                for (let j = 0; j < ids.length; j++) {
                    data.push({ tag, id: ids[j] });
                }
            }
        }
        if (data.length) {
            await this.db.collection("tag" + this.field).insertMany(data);
            flexsearch.tag.clear();
        }
    }

    let data = [];
    if (flexsearch.store) {
        for (const item of flexsearch.store.entries()) {
            const id = item[0],
                  doc = item[1];

            data.push({ id, doc });
        }
    } else if (!flexsearch.bypass) {
        for (const id of flexsearch.reg.keys()) {
            data.push({ id });
        }
    }
    if (data.length) {
        await this.db.collection("reg").insertMany(data);
        flexsearch.store && flexsearch.store.clear();
        flexsearch.document || flexsearch.reg.clear();
    }

    // TODO
    // await this.db.collection("cfg" + this.field).insertOne({
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
    // });
};

MongoDB.prototype.remove = function (ids) {

    if (!ids && 0 !== ids) return;
    if ("object" != typeof ids) {
        ids = [ids];
    }

    // if(this.type !== "string" && typeof ids[0] !== "number"){
    //     ids = ids.map(item => parseInt(item, 10));
    // }

    return Promise.all([this.db.collection("map" + this.field).deleteMany({ id: { $in: ids } }), this.db.collection("ctx" + this.field).deleteMany({ id: { $in: ids } }), this.db.collection("tag" + this.field).deleteMany({ id: { $in: ids } }), this.db.collection("reg").deleteMany({ id: { $in: ids } })]);
};