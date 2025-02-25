import { MongoClient } from "mongodb";
const defaults = {
    host: "localhost",
    port: "27017",
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

export default function MongoDB(name, config = {}){
    if(!(this instanceof MongoDB)){
        return new MongoDB(name, config);
    }
    if(typeof name === "object"){
        name = name.name;
        config = name;
    }
    if(!name){
        console.info("Default storage space was used, because a name was not passed.");
    }
    //field = "Test-456";
    this.id = "flexsearch" + (name ? "-" + sanitize(name) : "");
    this.field = config.field ? "-" + sanitize(config) : "";
    this.type = "";
    this.db = config.db || null;
    this.trx = false;
    Object.assign(defaults, config);
    this.db && delete defaults.db;
};

// MongoDB.mount = function(flexsearch){
//     return new this().mount(flexsearch);
// };

MongoDB.prototype.mount = function(flexsearch){
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
        let url = defaults.url;
        if(!url){
            url = defaults.user
                ? `mongodb://${defaults.user}:${defaults.pass}@${defaults.host}:${defaults.port}`
                : `mongodb://${defaults.host}:${defaults.port}`;
        }

        this.db = new MongoClient(url);
        await this.db.connect();
    }

    if(this.db.db) this.db = this.db.db(this.id);
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
    this.db.close();
    this.db = null;
};

MongoDB.prototype.destroy = async function(){
    await Promise.all([
        this.db.dropCollection("map" + this.field),
        this.db.dropCollection("ctx" + this.field),
        this.db.dropCollection("cfg" + this.field),
        this.db.dropCollection("reg")
    ]);
    this.close();
};

async function clear(ref){
    await this.db.dropCollection(ref + (ref !== "reg" ? this.field : ""));
    await createCollection(this.db, ref, this.field);
}

MongoDB.prototype.clear = function(){
    return Promise.all([
        clear.call(this, "map" + this.field),
        clear.call(this, "ctx" + this.field),
        clear.call(this, "cfg" + this.field),
        clear.call(this, "reg")
    ]);
};

function create_result(rows, resolve, enrich){
    if(resolve){
        if(!enrich) for(let i = 0; i < rows.length; i++){
            rows[i] = rows[i].id;
        }
        return rows;
    }
    else{
        const arr = [];
        for(let i = 0, row; i < rows.length; i++){
            row = rows[i];
            arr[row.res] || (arr[row.res] = []);
            arr[row.res].push(enrich
                ? row
                : row.id
            );
        }
        return arr;
    }
}

MongoDB.prototype.get = function(key, ctx, limit = 0, offset = 0, resolve = true, enrich = false){
    let rows;
    if(ctx){
        rows = this.db.collection("ctx" + this.field)
                   .find({ ctx, key }, { projection: { _id: 0, res: 1, id: 1 }, limit, skip: offset })
                   .toArray();
    }
    else{
        rows = this.db.collection("map" + this.field)
                   .find({ key }, { projection: { _id: 0, res: 1, id: 1 }, limit, skip: offset })
                   .toArray();
    }
    return rows.then(function(rows){
        return create_result(rows, resolve, enrich);
    });
};

MongoDB.prototype.has = function(id){
    return this.db.collection("reg").countDocuments({ id }, { limit: 1 });
};

// MongoDB.prototype.has = function(ref, key, ctx){
//     switch(ref){
//         case "map":
//             return this.db.collection("map" + this.field).countDocuments({ key }, { limit: 1 });
//         case "ctx":
//             return this.db.collection("ctx" + this.field).countDocuments({ ctx, key }, { limit: 1 });
//         case "cfg":
//             return this.db.collection("cfg" + this.field).countDocuments({}, { limit: 1 });
//         case "reg":
//             return this.db.collection("reg").countDocuments({ id: key }, { limit: 1 });
//     }
// };

MongoDB.prototype.search = async function(flexsearch, query, limit = 100, offset = 0, suggest = false, resolve = true, enrich = false){

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

        const stmt = [
            { $match: { $or: params } },
            { $group: {
                _id: "$id",
                res: suggest ? { $sum: 1 } : { $min: 1 },
                count: { $sum: 1 }
            } }
        ];
        suggest || stmt.push(
            { $match: { count: query.length - 1 } }
        );
        stmt.push(
            { $sort: suggest
                ? { count: -1, res: 1}
                : { res: 1 } },
            { $skip: offset},
            { $limit: limit }
        );
        enrich && stmt.push(
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
        stmt.push(
            { $project: { count: 0, res: resolve ? 0 : 1 } }
        );

        rows = await this.db.collection("ctx" + this.field).aggregate(stmt);
    }
    else{

        const stmt = [
            { $match: {
                key: { $in: query }
            } },
            { $group: {
                _id: "$id",
                res: suggest ? { $sum: 1 } : { $min: 1 },
                count: { $sum: 1 }
            } }
        ];
        suggest || stmt.push(
            { $match: { count: query.length } }
        );
        stmt.push(
            { $sort: suggest
                ? { count: -1, res: 1 }
                : { res: 1 } },
            { $skip: offset},
            { $limit: limit }
        );
        enrich && stmt.push(
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
        stmt.push(
            { $project: { count: 0, res: resolve ? 0 : 1} }
        );

        rows = await this.db.collection("map" + this.field).aggregate(stmt);
    }

    while(true/*await rows.hasNext()*/) {
        const row = await rows.next();
        if(row){
            if(resolve && !enrich){
                result.push(row._id);
            }
            else{
                row.id = row._id;
                delete row._id;
                result.push(row);
            }

        }
        else break;
    }

    if(resolve && !enrich){
        return result;
    }
    else{
        return create_result(result, resolve, enrich);
    }
}

MongoDB.prototype.info = function(){
    // todo
};

MongoDB.prototype.transaction = function(task){
    // not supported
    return task.call(this);
};

MongoDB.prototype.commit = async function(flexsearch, _replace, _append){

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
        await this.db.collection("map" + this.field).insertMany(data);
        flexsearch.map.clear();
    }

    data = [];
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
        await this.db.collection("ctx" + this.field).insertMany(data);
        flexsearch.ctx.clear();
    }

    // data = Object.keys(flexsearch.reg).map(id => {
    //     return { id: parseInt(id, 10) }
    // });
    data = [...flexsearch.reg.keys()].map(id => {
        return { id };
    });
    if(data.length){
        await this.db.collection("reg").insertMany(data);
        flexsearch.reg.clear();
    }

    await this.db.collection("cfg" + this.field).insertOne({
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
    });
};

MongoDB.prototype.remove = function(ids){

    if(!ids && ids !== 0) return;
    if(typeof ids !== "object"){
        ids = [ids];
    }

    // const exist = [];
    // const check = await Promise.all(
    //     ids.map(id => this.has("reg", this.type === "number" ? parseInt(id, 10) : id))
    // );
    //
    // for(let i = 0; i < ids.length; i++){
    //     check[i] && exist.push(
    //         this.type === "number"
    //             ? parseInt(ids[i], 10)
    //             : ids[i]
    //     );
    // }

    // if(this.type !== "string" && typeof ids[0] !== "number"){
    //     ids = ids.map(item => parseInt(item, 10));
    // }

    return Promise.all([
        this.db.collection("map" + this.field).deleteMany({ "id": { "$in": ids }}),
        this.db.collection("ctx" + this.field).deleteMany({ "id": { "$in": ids }}),
        this.db.collection("reg").deleteMany({ "id": { "$in": ids }})
    ]);
};
