import { MongoClient } from "mongodb";
const defaults = {
    host: "localhost",
    port: "27017",
    user: null,
    pass: null
};
const VERSION = 1;
const fields = ["map", "ctx", "tag", "reg", "cfg"];
import StorageInterface from "../interface.js";
import { toArray } from "../../common.js";

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_\-]/g, "");
}

let CLIENT;
let Index = Object.create(null);

/**
 * @constructor
 * @implements StorageInterface
 */

export default function MongoDB(name, config = {}){
    if(!this || this.constructor !== MongoDB){
        return new MongoDB(name, config);
    }
    if(typeof name === "object"){
        config = name;
        name = name.name;
    }
    if(!name){
        console.info("Default storage space was used, because a name was not passed.");
    }
    this.id = "flexsearch" + (name ? "-" + sanitize(name) : "");
    this.field = config.field ? "-" + sanitize(config.field) : "";
    this.type = config.type || "";
    this.db = config.db || Index[this.id] || CLIENT || null;
    this.trx = false;
    this.support_tag_search = true;
    Object.assign(defaults, config);
    this.db && delete defaults.db;
};

// MongoDB.mount = function(flexsearch){
//     return new this().mount(flexsearch);
// };

MongoDB.prototype.mount = function(flexsearch){
    //if(flexsearch.constructor === Document){
    if(flexsearch.index){
        return flexsearch.mount(this);
    }
    flexsearch.db = this;
    return this.open();
};

async function createCollection(db, ref, field){
    switch(ref){
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

MongoDB.prototype.open = async function(){

    if(!this.db){
        if(!(this.db = Index[this.id])){
            if(!(this.db = CLIENT)){

                let url = defaults.url;
                if(!url){
                    url = defaults.user
                        ? `mongodb://${ defaults.user }:${ defaults.pass }@${ defaults.host }:${ defaults.port }`
                        : `mongodb://${ defaults.host }:${ defaults.port }`;
                }
                this.db = CLIENT = new MongoClient(url);
                await this.db.connect();
            }
        }
    }

    if(this.db.db){
        this.db = Index[this.id] = this.db.db(this.id);
    }

    const collections = await this.db.listCollections().toArray();

    for(let i = 0; i < fields.length; i++){
        let found = false;
        for(let j = 0; j < collections.length; j++){
            if(collections[j].name === fields[i] + (fields[i] !== "reg" ? this.field : "")){
                found = true;
                break;
            }
        }
        if(!found){
            await createCollection(this.db, fields[i], this.field);
        }
    }

    return this.db;
};

MongoDB.prototype.close = function(){
    //CLIENT && CLIENT.close();
    this.db = CLIENT = null;
    Index[this.id] = null;
    return this;
};

MongoDB.prototype.destroy = function(){
    return Promise.all([
        this.db.dropCollection("map" + this.field),
        this.db.dropCollection("ctx" + this.field),
        this.db.dropCollection("tag" + this.field),
        this.db.dropCollection("cfg" + this.field),
        this.db.dropCollection("reg")
    ]);
};

async function clear(ref){
    await this.db.dropCollection(ref);
    await createCollection(this.db, ref, this.field);
}

MongoDB.prototype.clear = function(){
    return Promise.all([
        clear.call(this, "map" + this.field),
        clear.call(this, "ctx" + this.field),
        clear.call(this, "tag" + this.field),
        clear.call(this, "cfg" + this.field),
        clear.call(this, "reg")
    ]);
};

function create_result(rows, resolve, enrich){
    const _id = rows[0] && typeof rows[0]._id !== "undefined";
    if(resolve){
        if(!enrich || _id) for(let i = 0, row; i < rows.length; i++){
            row = rows[i];
            if(enrich){
                const id = row._id;
                delete row._id;
                row.id = id;
            }
            else{
                rows[i] = _id ? row._id : row.id;
            }
        }
        return rows;
    }
    else{
        const arr = [];
        for(let i = 0, row, res; i < rows.length; i++){
            row = rows[i];
            res = row.res;
            (arr[res] || (arr[res] = [])).push(
                _id ? row._id : row.id
            );
        }
        return arr;
    }
}

MongoDB.prototype.get = async function(key, ctx, limit = 0, offset = 0, resolve = true, enrich = false, tags){

    let rows;
    let params = ctx ? { ctx, key } : { key };

    if(!enrich && !tags){

        const stmt = {
            projection: { _id: 0, res: 1, id: 1 }
        };

        limit && (stmt.limit = limit);
        offset && (stmt.skip = offset);

        rows = await this.db.collection((ctx ? "ctx" : "map") + this.field)
            .find(params, stmt)
            .toArray();
    }
    else{

        const project = { _id: 0, id: 1 };
        const stmt = [
            { $match: params }
        ];

        if(!resolve){
            project["res"] = 1;
        }

        if(enrich){
            project["doc"] = "$doc.doc";
            stmt.push(
                { $lookup: {
                    from: "reg",
                    localField: "id",
                    foreignField: "id",
                    as: "doc"
                } },
                { $unwind: {
                    path: "$doc",
                    preserveNullAndEmptyArrays: true
                } }
            );
        }

        if(tags){

            const match = {};
            for(let i = 0, count = 1; i < tags.length; i += 2){
                project["tag" + count] = "$tag" + count + ".tag";
                match["tag" + count] = tags[i + 1];
                stmt.push(
                    { $lookup: {
                        from: "tag-" + sanitize(tags[i]),
                        localField: "id",
                        foreignField: "id",
                        as: "tag" + count
                    } }
                );
                count++;
            }

            stmt.push(
                { $project: project },
                { $match: match },
                { $project: { id: 1, doc: 1 } }
            );
        }
        else{
            stmt.push(
                { $project: project }
            );
        }

        stmt.push(
            { $sort: { res: 1 } }
        );

        limit && stmt.push(
            { $limit: limit }
        );
        offset && stmt.push(
            { $skip: offset}
        );

        rows = [];
        const result = await this.db.collection((ctx ? "ctx" : "map") + this.field).aggregate(stmt);

        while(true/*await rows.hasNext()*/){
            const row = await result.next();
            if(row) rows.push(row)
            else break;
        }
    }

    return create_result(rows, resolve, enrich);
};

MongoDB.prototype.tag = async function(tag, limit = 0, offset = 0, enrich = false){

    let rows;

    if(!enrich){

        const stmt = {
            projection: { _id: 0, id: 1 }
        };

        limit && (stmt.limit = limit);
        offset && (stmt.skip = offset);

        rows = await this.db.collection("tag" + this.field)
            .find({ tag }, stmt)
            .toArray();
    }
    else{

        const stmt = [
            { $match: { tag } }
        ];

        limit && stmt.push(
            { $limit: limit }
        );
        offset && stmt.push(
            { $skip: offset}
        );

        stmt.push(
            { $lookup: {
                from: "reg",
                localField: "id",
                foreignField: "id",
                as: "doc"
            } },
            { $project: { _id: 0, id: 1, doc: "$doc.doc" } },
            { $unwind: {
                path: "$doc",
                preserveNullAndEmptyArrays: true
            } }
        );

        rows = [];
        const result = await this.db.collection("tag" + this.field).aggregate(stmt);

        while(true/*await rows.hasNext()*/){
            const row = await result.next();
            if(row) rows.push(row)
            else break;
        }
    }

    create_result(rows, true, enrich);
};

MongoDB.prototype.enrich = function(ids){
    if(typeof ids !== "object"){
        ids = [ids];
    }
    return this.db.collection("reg")
        .find({ id: { $in: ids } }, { projection: { _id: 0, id: 1, doc: 1 } })
        .toArray();
};

MongoDB.prototype.has = function(id){
    return this.db.collection("reg").countDocuments({ id }, { limit: 1 }).then(function(result){
        return !!result;
    });
};

MongoDB.prototype.search = async function(flexsearch, query, limit = 100, offset = 0, suggest = false, resolve = true, enrich = false, tags){

    let result = [], rows;

    if(query.length > 1 && flexsearch.depth){

        let params = [];
        let keyword = query[0];
        let term;

        for(let i = 1; i < query.length; i++){
            term = query[i];
            const swap = flexsearch.bidirectional && (term > keyword);
            params.push({
                ctx: swap ? term : keyword,
                key: swap ? keyword : term
            });
            keyword = term;
        }


        const project = { _id: 1 };
        if(!resolve) project["res"] = 1;
        if(enrich) project["doc"] = 1;

        const stmt = [
            { $match: { $or: params } },
            { $group: {
                _id: "$id",
                count: { $sum: 1 },
                res: suggest ? { $sum: "$res" } : { $sum /*$min*/: "$res" }
            } }
        ];

        suggest || stmt.push(
            { $match: { count: query.length - 1 } }
        );

        if(enrich){
            project["doc"] = "$doc.doc";
            stmt.push(
                { $lookup: {
                    from: "reg",
                    localField: "_id",
                    foreignField: "id",
                    as: "doc"
                } },
                { $unwind: {
                    path: "$doc",
                    preserveNullAndEmptyArrays: true
                } }
            );
        }

        if(tags){

            const match = {};
            for(let i = 0, count = 1; i < tags.length; i += 2){
                project["tag" + count] = "$tag" + count + ".tag";
                match["tag" + count] = tags[i + 1];
                stmt.push(
                    { $lookup: {
                        from: "tag-" + sanitize(tags[i]),
                        localField: "_id",
                        foreignField: "id",
                        as: "tag" + count
                    } }
                );
                count++;
            }

            stmt.push(
                { $match: match }
            );
        }

        stmt.push(
            { $sort: suggest
                ? { count: -1, res: 1}
                : { res: 1 } }
        );
        limit && stmt.push(
            { $limit: limit }
        );
        offset && stmt.push(
            { $skip: offset}
        );
        stmt.push(
            { $project: project }
        );

        rows = await this.db.collection("ctx" + this.field).aggregate(stmt);
    }
    else{

        const project = { _id: 1 };
        if(!resolve) project["res"] = 1;
        if(enrich) project["doc"] = 1;

        const stmt = [
            { $match: {
                key: { $in: query }
            } },
            { $group: {
                _id: "$id",
                count: { $sum: 1 },
                res: suggest ? { $sum: "$res" } : { $sum /*$min*/: "$res" }
            } }
        ];

        suggest || stmt.push(
            { $match: { count: query.length } }
        );

        if(enrich){
            project["doc"] = "$doc.doc";
            stmt.push(
                { $lookup: {
                    from: "reg",
                    localField: "_id",
                    foreignField: "id",
                    as: "doc"
                } },
                { $unwind: {
                    path: "$doc",
                    preserveNullAndEmptyArrays: true
                } }
            );
        }

        if(tags){

            const match = {};
            for(let i = 0, count = 1; i < tags.length; i += 2){
                project["tag" + count] = "$tag" + count + ".tag";
                match["tag" + count] = tags[i + 1];
                stmt.push(
                    { $lookup: {
                        from: "tag-" + sanitize(tags[i]),
                        localField: "_id",
                        foreignField: "id",
                        as: "tag" + count
                    } }
                );
                count++;
            }

            stmt.push(
                { $match: match }
            );
        }

        stmt.push(
            { $sort: suggest
                ? { count: -1, res: 1 }
                : { res: 1 }
            }
        );
        limit && stmt.push(
            { $limit: limit }
        );
        offset && stmt.push(
            { $skip: offset}
        );
        stmt.push(
            { $project: project }
        );

        rows = await this.db.collection("map" + this.field).aggregate(stmt);
    }

    while(true/*await rows.hasNext()*/) {
        const row = await rows.next();
        if(row){
            if(resolve && enrich){
                row.id = row._id;
                delete row._id;
            }
            result.push(row);
        }
        else break;
    }

    return create_result(result, resolve, enrich);
}

MongoDB.prototype.info = function(){
    // todo
};

MongoDB.prototype.transaction = function(task){
    // not supported
    return task.call(this);
};

MongoDB.prototype.commit = async function(flexsearch){

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

    const promises = [];

    if(flexsearch.map.size){
        let data = [];
        for(const item of flexsearch.map){
            const key = item[0];
            const arr = item[1];
            for(let i = 0, ids; i < arr.length; i++){
                if((ids = arr[i]) && ids.length){
                    this.type || (this.type = typeof ids[0]);
                    for(let j = 0; j < ids.length; j++){
                        data.push({
                            key: key,
                            res: i,
                            id: ids[j]
                        });
                    }
                }
            }
        }
        if(data.length){
            promises.push(
                this.db.collection("map" + this.field).insertMany(data)
            );
        }
    }

    if(flexsearch.ctx.size){
        let data = [];
        for(const ctx of flexsearch.ctx){
            const ctx_key = ctx[0];
            const ctx_value = ctx[1];
            for(const item of ctx_value){
                const key = item[0];
                const arr = item[1];
                for(let i = 0, ids; i < arr.length; i++){
                    if((ids = arr[i]) && ids.length){
                        for(let j = 0; j < ids.length; j++){
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
        if(data.length){
            promises.push(
                this.db.collection("ctx" + this.field).insertMany(data)
            );
        }
    }

    if(flexsearch.tag){
        let data = [];
        for(const item of flexsearch.tag){
            const tag = item[0];
            const ids = item[1];
            if(!ids.length) continue;
            for(let j = 0; j < ids.length; j++){
                data.push({ tag, id: ids[j] });
            }
        }
        if(data.length){
            promises.push(
                this.db.collection("tag" + this.field).insertMany(data)
            );
        }
    }

    let data = [];
    if(flexsearch.store){
        for(const item of flexsearch.store.entries()){
            const id = item[0];
            const doc = item[1];
            data.push({ id, doc });
        }
    }
    else if(!flexsearch.bypass){
        for(const id of flexsearch.reg.keys()){
            data.push({ id });
        }
    }
    if(data.length){
        promises.push(
            this.db.collection("reg").insertMany(data)
        );
    }

    promises.length && await Promise.all(promises);

    flexsearch.map.clear();
    flexsearch.ctx.clear();
    flexsearch.tag &&
    flexsearch.tag.clear();
    flexsearch.store &&
    flexsearch.store.clear();
    flexsearch.document ||
    flexsearch.reg.clear();

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

MongoDB.prototype.remove = function(ids){

    if(!ids && ids !== 0) return;
    if(typeof ids !== "object"){
        ids = [ids];
    }

    // if(this.type !== "string" && typeof ids[0] !== "number"){
    //     ids = ids.map(item => parseInt(item, 10));
    // }

    return Promise.all([
        this.db.collection("map" + this.field).deleteMany({ "id": { "$in": ids }}),
        this.db.collection("ctx" + this.field).deleteMany({ "id": { "$in": ids }}),
        this.db.collection("tag" + this.field).deleteMany({ "id": { "$in": ids }}),
        this.db.collection("reg").deleteMany({ "id": { "$in": ids }})
    ]);
};
