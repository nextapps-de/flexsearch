import { ClickHouse } from "clickhouse";
import StorageInterface from "../interface.js";
const defaults = {
    host: "http://localhost",
    port: "8123",
    debug: false,
    basicAuth: null,
    isUseGzip: false,
    trimQuery: false,
    usePost: false,
    format: "json",
    raw: false,
    config: {
        output_format_json_quote_64bit_integers: 0,
        enable_http_compression: 0,
        database: "default"
    }
};

const DEBUG = true;
const VERSION = 1;
const fields = ["map", "ctx", "reg", "cfg"];
const types = {
    "text": "String",
    "char": "String",
    "varchar": "String",
    "string": "String",
    "number": "Int32",
    "numeric": "Int32",
    "integer": "Int32",
    "smallint": "Int16",
    "tinyint": "Int8",
    "mediumint": "Int32",
    "int": "Int32",
    "int8": "Int8",
    "uint8": "UInt8",
    "int16": "Int16",
    "uint16": "UInt16",
    "int32": "Int32",
    "uint32": "UInt32",
    "int64": "Int64",
    "uint64": "UInt64",
    "bigint": "Int64"
};

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

/**
 * @constructor
 * @implements StorageInterface
 */

export default function ClickhouseDB(sid, config){
    //field = "Test-456";
    this.id = "flexsearch" + (sid ? "_" + sanitize(sid) : "");
    this.field = config && config.field ? "_" + sanitize(config.field) : "";
    this.db = (config && config.db) || null;
    this.trx = false;
    // Clickhouse does not support ALTER TABLE to upgrade
    // the type of the ID when it is a part of the merge key
    this.type = config && config.type ? types[config.type.toLowerCase()] : "String";
    if(!this.type) throw new Error("Unknown type of ID '" + config.type + "'");
    config && Object.assign(defaults, config);
    this.db && delete defaults.db;
};

ClickhouseDB.mount = function(flexsearch){
    return new this().mount(flexsearch);
};

ClickhouseDB.prototype.mount = function(flexsearch){
    flexsearch.db = this;
    defaults.resolution = Math.max(flexsearch.resolution, flexsearch.resolution_ctx);
    return this.open(defaults);
};

ClickhouseDB.prototype.open = async function(config){

    if(!this.db) {
        this.db = new ClickHouse(config || defaults);
    }

    const exists = await this.db.query(`
        SELECT 1 FROM system.databases WHERE name = '${this.id}';
    `).toPromise();

    if(!exists || !exists.length){
        await this.db.query(`
            CREATE DATABASE IF NOT EXISTS ${this.id};
        `).toPromise();
    }

    for(let i = 0; i < fields.length; i++){
        switch(fields[i]){
            case "map":
                await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.map${this.field}(
                        key String,
                        res ${config.resolution <= 255 ? "UInt8" : "UInt16"},
                        id  ${this.type}
                    )
                    ENGINE = MergeTree
                    /*PRIMARY KEY (key, id)*/
                    ORDER BY (key, id);
                `, { params: { name: this.id + ".map" + this.field }}).toPromise();
                break;

            case "ctx":
                await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.ctx${this.field}(
                        ctx String,
                        key String,
                        res ${config.resolution <= 255 ? "UInt8" : "UInt16"},
                        id  ${this.type}
                    )
                    ENGINE = MergeTree
                    /*PRIMARY KEY (ctx, key, id)*/
                    ORDER BY (ctx, key, id);
                `).toPromise();
                break;

            case "reg":
                await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.reg(
                        id ${this.type}
                    )
                    ENGINE = MergeTree
                    ORDER BY (id);
                `).toPromise();
                break;

            case "cfg":
                await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.cfg${this.field}(
                        cfg String
                    ) 
                    ENGINE = TinyLog;
                `).toPromise();
                break;
        }
    }

    return this.db;
};

ClickhouseDB.prototype.close = function(){
    this.db.close();
    this.db = null;
};

ClickhouseDB.prototype.destroy = async function(){
    await Promise.all([
        this.db.query(`DROP TABLE ${this.id}.map${this.field};`).toPromise(),
        this.db.query(`DROP TABLE ${this.id}.ctx${this.field};`).toPromise(),
        this.db.query(`DROP TABLE ${this.id}.cfg${this.field};`).toPromise(),
        this.db.query(`DROP TABLE ${this.id}.reg;`).toPromise()
    ]);
    return this.close();
};

ClickhouseDB.prototype.clear = function(){
    return Promise.all([
        this.db.query(`TRUNCATE TABLE ${this.id}.map${this.field};`).toPromise(),
        this.db.query(`TRUNCATE TABLE ${this.id}.ctx${this.field};`).toPromise(),
        this.db.query(`TRUNCATE TABLE ${this.id}.cfg${this.field};`).toPromise(),
        this.db.query(`TRUNCATE TABLE ${this.id}.reg;`).toPromise()
    ]);
};

ClickhouseDB.prototype.get = async function(ref, key, ctx, limit = 0, offset = 0){
    let rows;
    if(ref) switch(ref){
        case "map":
            rows = await this.db.query(`
                SELECT res, id 
                FROM ${this.id}.map${this.field}
                WHERE key = {key:String}
                ${limit ? `LIMIT ${limit}` : ''}
                ${offset ? `OFFSET ${offset}` : ''}`,
                { params: { key }}
            ).toPromise();
            // fallthrough
        case "ctx":
            rows = rows || await this.db.query(`
                SELECT res, id 
                FROM ${this.id}.ctx${this.field} 
                WHERE ctx = {ctx:String} AND key = {key:String}
                ${limit ? `LIMIT ${limit}` : ''}
                ${offset ? `OFFSET ${offset}` : ''}`,
                { params: { ctx, key }}
            ).toPromise();
            // fallthrough
        case "":
            const arr = [];
            for(let i = 0, row; i < rows.length; i++){
                row = rows[i];
                arr[row.res] || (arr[row.res] = []);
                arr[row.res].push(row.id);
            }
            return arr;
        case "reg":
            return this.has(ref, key);
        case "cfg":
            const cfg = (
                await this.db.query(`
                    SELECT cfg 
                    FROM ${this.id}.cfg${this.field} 
                    LIMIT 1`
                ).toPromise()
            )[0];
            return cfg ? JSON.parse(cfg) : {};
    }
};

ClickhouseDB.prototype.has = async function(ref, key, ctx){
    switch(ref){
        case "map":
            return (
                await this.db.query(`
                    SELECT 1 
                    FROM ${this.id}.map${this.field} 
                    WHERE key = {key:String} 
                    LIMIT 1`,
                    { params: { key }}
                ).toPromise()
            )[0];
        case "ctx":
            return (
                await this.db.query(`
                    SELECT 1
                    FROM ${this.id}.ctx${this.field}
                    WHERE ctx = {ctx:String} AND key = {key:String} 
                    LIMIT 1`,
                    { params: { ctx, key }}
                ).toPromise()
            )[0];
        case "reg":
            return (
                await this.db.query(`
                    SELECT 1
                    FROM ${this.id}.reg
                    WHERE id = {key:${this.type /*=== "number" ? "Int32" : "String"*/}}
                    LIMIT 1`,
                    { params: { key }}
                ).toPromise()
            )[0];
        case "cfg":
            return (
                await this.db.query(`
                    SELECT 1 
                    FROM ${this.id}.cfg${this.field} 
                    WHERE cfg IS NOT NULL 
                    LIMIT 1`
                ).toPromise()
            )[0];
    }
};

ClickhouseDB.prototype.search = async function(flexsearch, query, suggest, limit = 100, offset = 0){

    let rows;
    let stmt = "";

    if(query.length > 1 && flexsearch.depth){

        let params = {};
        let keyword = query[0];
        let term;

        for(let i = 1; i < query.length; i++){
            stmt += (stmt ? " UNION ALL " : "") + `
                SELECT id, res 
                FROM ${this.id}.ctx${this.field}
                WHERE ctx = {ctx${i}:String} AND key = {key${i}:String}
            `;
            term = query[i];
            const swap = flexsearch.bidirectional && (term > keyword);
            params["ctx" + i] = swap ? term : keyword;
            params["key" + i] = swap ? keyword : term;
            keyword = term;
        }

        rows = await this.db.query(`
            SELECT id, res 
            FROM (
                SELECT id, ${suggest ? "SUM" : "MIN"}(res) as res, count(*) as count 
                FROM (${stmt}) as t
                GROUP BY id
                ORDER BY ${suggest ? "count DESC, res" : "res"}
                LIMIT ${limit}
                OFFSET ${offset}
            ) as r
            ${suggest ? "" : "WHERE count = " + (query.length - 1)}
        `, { params }).toPromise();
    }
    else{

        let params = {};

        for(let i = 0; i < query.length; i++){
            params["key" + i] = query[i];
            stmt += (stmt ? " UNION ALL " : "") + `
                SELECT id, res
                FROM ${ this.id }.map${ this.field }
                WHERE key = {key${i}:String}
            `;
        }
        rows = await this.db.query(`
            SELECT id, res
            FROM (
                SELECT id, ${suggest ? "SUM" : "MIN"}(res) as res, count(*) as count
                FROM (${stmt}) as t
                GROUP BY id
                ORDER BY ${suggest ? "count DESC, res" : "res"}
                LIMIT ${limit} 
                OFFSET ${offset}
            ) as r
            ${ suggest ? "" : "WHERE count = " + query.length }
        `, { params }).toPromise();
    }

    // const arr = [];
    // for(let i = 0, row; i < rows.length; i++){
    //     row = rows[i];
    //     arr[row.res] || (arr[row.res] = []);
    //     arr[row.res].push(row.id);
    // }

    for(let i = 0; i < rows.length; i++){
        rows[i] = rows[i].id;
    }

    return rows;
}

ClickhouseDB.prototype.info = function(){
    // todo
};

ClickhouseDB.prototype.transaction = function(task){

    // not supported
    return task.call(this);
};

ClickhouseDB.prototype.commit = async function(flexsearch, _replace, _append){

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
                //this.type || (this.type = typeof ids[0]);
                for(let j = 0; j < ids.length; j++){
                    data.push({
                        key: key,
                        res: i,
                        id: /*this.type === "number"
                            ? parseInt(ids[j], 10)
                            :*/ ids[j]
                    });
                }
            }
        }
    }

    if(data.length){
        await this.db.insert(
            `INSERT INTO ${this.id}.map${this.field} (key, res, id)`, data
        ).toPromise();
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
                            id: /*this.type === "number"
                                ? parseInt(ids[j], 10)
                                :*/ ids[j]
                        });
                    }
                }
            }
        }
    }

    if(data.length){
        await this.db.insert(
            `INSERT INTO ${this.id}.ctx${this.field} (ctx, key, res, id)`, data
        ).toPromise();
    }

    data = [...flexsearch.reg.keys()].map(id => {
        return { id }
    });

    if(data.length){
        await this.db.insert(
            `INSERT INTO ${this.id}.reg (id)`, data
        ).toPromise();
    }

    await this.db.insert(`INSERT INTO ${this.id}.cfg${this.field} (cfg)`, [{
        cfg: JSON.stringify({
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
        })
    }]).toPromise();

    flexsearch.map.clear();
    flexsearch.ctx.clear();
    flexsearch.reg.clear();

    await Promise.all([
        this.db.query(`OPTIMIZE TABLE ${this.id}.map${this.field} FINAL`).toPromise(),
        this.db.query(`OPTIMIZE TABLE ${this.id}.ctx${this.field} FINAL`).toPromise(),
        this.db.query(`OPTIMIZE TABLE ${this.id}.reg FINAL`).toPromise()
    ]);
};

ClickhouseDB.prototype.remove = async function(ids){

    if(typeof ids !== "object"){
        ids = [ids];
    }

    while(ids.length){

        let chunk = ids.slice(0, 1e5);
        ids = ids.slice(1e5);
        chunk = this.type === "String"
            ? "'" + chunk.join("','") + "'"
            : chunk.join(",");

        await Promise.all([
            this.db.query(`
                ALTER TABLE ${this.id}.map${this.field} 
                DELETE WHERE id IN (${chunk}) 
                SETTINGS mutations_sync = 1;`
            ).toPromise(),

            this.db.query(`
                ALTER TABLE ${this.id}.ctx${this.field}
                DELETE WHERE id IN (${chunk})
                SETTINGS mutations_sync = 1;`
            ).toPromise(),

            this.db.query(`
                ALTER TABLE ${this.id}.reg
                DELETE WHERE id IN (${chunk})
                SETTINGS mutations_sync = 1;`
            ).toPromise()
        ]);
    }
};
