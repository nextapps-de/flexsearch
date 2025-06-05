//const sqlite3 = require("sqlite3").verbose();
import sqlite3 from "sqlite3";
import path from "path";
import StorageInterface from "../interface.js";
import { concat, toArray } from "../../common.js";

const VERSION = 1;
const MAXIMUM_QUERY_VARS = 16000;
const fields = ["map", "ctx", "reg", "tag", "cfg"];
const types = {
    "text": "text",
    "char": "text",
    "varchar": "text",
    "string": "text",
    "number": "int",
    "numeric": "int",
    "integer": "int",
    "smallint": "int",
    "tinyint": "int",
    "mediumint": "int",
    "int": "int",
    "int8": "int",
    "uint8": "int",
    "int16": "int",
    "uint16": "int",
    "int32": "int",
    "uint32": "bigint",
    "int64": "bigint",
    "bigint": "bigint"
};

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

// global transaction to keep track of database lock
const TRX = Object.create(null);
const Index = Object.create(null);

/**
 * @constructor
 * @implements StorageInterface
 */

export default function SqliteDB(name, config = {}){
    if(!this || this.constructor !== SqliteDB){
        return new SqliteDB(name, config);
    }
    if(typeof name === "object"){
        config = name;
        name = name.name;
    }
    if(!name){
        console.info("Default storage space was used, because a name was not passed.");
    }
    //field = "Test-456";
    this.id = config.path || (
        name === ":memory:"
            ? name
            : "flexsearch" + (name ? "-" + sanitize(name) : "") + ".sqlite"
    );
    this.field = config.field ? "_" + sanitize(config.field) : "";
    this.support_tag_search = true;
    this.db = config.db || Index[this.id] || null;
    this.type = config.type ? types[config.type.toLowerCase()] : "string";
    if(!this.type) throw new Error("Unknown type of ID '" + config.type + "'");
};

SqliteDB.prototype.mount = function(flexsearch){
    //if(flexsearch.constructor === Document){
    if(flexsearch.index){
        return flexsearch.mount(this);
    }
    flexsearch.db = this;
    return this.open();
};

SqliteDB.prototype.open = async function(){

    if(!this.db){

        if(!(this.db = Index[this.id])){

            let filepath = this.id;
            if(filepath !== ":memory:"){
                // skip absolute path
                if(filepath[0] !== "/" && filepath[0] !== "\\"){
                    // current working directory
                    const dir = process.cwd();
                    filepath = path.join(dir, this.id);
                }
            }

            this.db = Index[this.id] = new sqlite3.Database(filepath);
        }
    }

    const db = this.db;

    for(let i = 0; i < fields.length; i++){
        const exist = await this.promisfy({
            method: "get",
            stmt: "SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?) as exist",
            params: [fields[i] + (fields[i] === "reg" ? "" : this.field)]
        });
        if(!exist || !exist.exist){
            let stmt, stmt_index;
            switch(fields[i]){
                case "map":
                    stmt = `
                        CREATE TABLE IF NOT EXISTS main.map${this.field}(
                            key TEXT NOT NULL,
                            res INTEGER NOT NULL,
                            id  ${this.type} NOT NULL
                        );
                    `;
                    stmt_index = `
                        CREATE INDEX IF NOT EXISTS map_key_index${this.field} 
                            ON map${this.field} (key);
                        CREATE INDEX IF NOT EXISTS map_id_index${this.field}
                            ON map${this.field} (id);
                    `;
                    break;

                case "ctx":
                    stmt = `
                        CREATE TABLE IF NOT EXISTS main.ctx${this.field}(
                            ctx TEXT NOT NULL,
                            key TEXT NOT NULL,
                            res INTEGER NOT NULL,
                            id  ${this.type} NOT NULL
                        );
                    
                    `;
                    stmt_index = `
                        CREATE INDEX IF NOT EXISTS ctx_key_index${this.field} 
                            ON ctx${this.field} (ctx, key);
                        CREATE INDEX IF NOT EXISTS ctx_id_index${this.field}
                            ON ctx${this.field} (id);
                    `;
                    break;

                case "tag":
                    stmt = `
                        CREATE TABLE IF NOT EXISTS main.tag${this.field}(
                            tag TEXT NOT NULL,
                            id  ${this.type} NOT NULL
                        );
                    `;
                    stmt_index = `
                        CREATE INDEX IF NOT EXISTS tag_index${this.field} 
                            ON tag${this.field} (tag);
                        CREATE INDEX IF NOT EXISTS tag_id_index${this.field}
                            ON tag${this.field} (id);
                    `;
                    break;

                case "reg":
                    stmt = `
                        CREATE TABLE IF NOT EXISTS main.reg(
                            id ${this.type} NOT NULL
                                CONSTRAINT reg_pk${this.field}
                                    PRIMARY KEY,
                            doc TEXT DEFAULT NULL                    
                        );
                    `;
                    stmt_index = `
                        CREATE INDEX IF NOT EXISTS reg_index
                            ON reg (id);
                    `;
                    break;

                case "cfg":
                    stmt = `
                        CREATE TABLE IF NOT EXISTS main.cfg${this.field} (
                            cfg TEXT NOT NULL
                        );
                    `;
                    break;
            }

            await new Promise(function(resolve, reject){
                db.exec(stmt, function(err, rows){
                    if(err) return reject(err);
                    stmt_index
                        ? db.exec(stmt_index, function(err, rows){
                            if(err) return reject(err);
                            resolve(rows);
                        })
                        : resolve(rows);
                });
            });
        }
    }

    db.exec("PRAGMA optimize = 0x10002");

    return db;
};

SqliteDB.prototype.close = function(){
    this.db && this.db.close();
    this.db = null;
    Index[this.id] = null;
    TRX[this.id] = null;
    return this;
};

SqliteDB.prototype.destroy = function(){
    return this.transaction(function(){
        this.db.run("DROP TABLE IF EXISTS main.map" + this.field + ";");
        this.db.run("DROP TABLE IF EXISTS main.ctx" + this.field + ";");
        this.db.run("DROP TABLE IF EXISTS main.tag" + this.field + ";");
        this.db.run("DROP TABLE IF EXISTS main.cfg" + this.field + ";");
        this.db.run("DROP TABLE IF EXISTS main.reg;");
    });
};

SqliteDB.prototype.clear = function(){
     return this.transaction(function(){
         this.db.run("DELETE FROM main.map" + this.field + " WHERE 1;");
         this.db.run("DELETE FROM main.ctx" + this.field + " WHERE 1;");
         this.db.run("DELETE FROM main.tag" + this.field + " WHERE 1;");
         this.db.run("DELETE FROM main.cfg" + this.field + " WHERE 1;");
         this.db.run("DELETE FROM main.reg WHERE 1;");
     });
};

function create_result(rows, resolve, enrich){
    if(resolve){
        for(let i = 0; i < rows.length; i++){
            if(enrich){
                if(rows[i].doc){
                    rows[i].doc = JSON.parse(rows[i].doc);
                }
            }
            else{
                rows[i] = rows[i].id;
            }
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

SqliteDB.prototype.get = function(key, ctx, limit = 0, offset = 0, resolve = true, enrich = false, tags){

    let result;
    let stmt = '';
    let params = ctx ? [ctx, key] : [key];
    let table = "main." + (ctx ? "ctx" : "map") + this.field;

    if(tags){
        for(let i = 0; i < tags.length; i+=2){
            stmt += ` AND ${ table }.id IN (SELECT id FROM main.tag_${ sanitize(tags[i]) } WHERE tag = ?)`;
            params.push(tags[i + 1]);
        }
    }
    if(ctx){
        result = this.promisfy({
            method: "all",
            stmt: `
                SELECT ${ table }.id 
                       ${ resolve ? "" : ", res" }
                       ${ enrich ? ", doc" : "" }
                FROM ${ table }
                ${ enrich ? `
                    LEFT JOIN main.reg ON main.reg.id = ${ table }.id
                ` : "" }
                WHERE ctx = ? AND key = ? ${stmt}
                ORDER BY res 
                ${ limit ? "LIMIT " + limit : "" }
                ${ offset ? "OFFSET " + offset : "" }
            `,
            params
        });
    }
    else{
        result = this.promisfy({
            method: "all",
            stmt: `
                SELECT ${ table }.id
                       ${ resolve ? "" : ", res" } 
                       ${ enrich ? ", doc" : "" }
                FROM ${ table }
                ${ enrich ? `
                    LEFT JOIN main.reg ON main.reg.id = ${ table }.id
                ` : "" }
                WHERE key = ? ${stmt}
                ORDER BY res
                ${ limit ? "LIMIT " + limit : "" }
                ${ offset ? "OFFSET " + offset : "" }
            `,
            params
        });
    }

    return result.then(function(rows){
        return create_result(rows, resolve, enrich);
    });
};

SqliteDB.prototype.tag = function(tag, limit = 0, offset = 0, enrich = false){

    const table = "main.tag" + this.field;
    const promise = this.promisfy({
        method: "all",
        stmt: `
            SELECT ${ table }.id 
                   ${ enrich ? ", doc" : "" }
            FROM ${ table }
            ${ enrich ? `
                LEFT JOIN main.reg ON main.reg.id = ${ table }.id
            ` : "" }
            WHERE tag = ? 
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }
        `,
        params: [tag]
    });

    enrich || promise.then(function(rows){
        return create_result(rows, true, false);
    });

    return promise;
};

function build_params(length, single_param){

    // let stmt = "?";
    // for(let i = 1; i < length; i++){
    //     stmt += ",?";
    // }

    let stmt = single_param
        ? ",(?)"
        : ",?";

    for(let i = 1; i < length;){
        if(i <= (length - i)){
            stmt += stmt;
            i *= 2;
        }
        else{
            stmt += stmt.substring(0, (length - i) * (single_param ? 4 : 2));
            break;
        }
    }

    return stmt.substring(1);
}

SqliteDB.prototype.enrich = function(ids){

    const result = [];
    const promises = [];
    if(typeof ids !== "object"){
        ids = [ids];
    }

    for(let count = 0; count < ids.length;){

        const chunk = ids.length - count > MAXIMUM_QUERY_VARS
            ? ids.slice(count, count + MAXIMUM_QUERY_VARS)
            : count ? ids.slice(count) : ids;
        const stmt = build_params(chunk.length);
        count += chunk.length;

        promises.push(this.promisfy({
            method: "all",
            stmt: `SELECT id, doc FROM main.reg WHERE id IN (${stmt})`,
            params: chunk
        }));
    }

    return Promise.all(promises).then(function(promises){

        for(let i = 0, res; i < promises.length; i++){
            res = promises[i];
            if(res && res.length){
                for(let i = 0, doc; i < res.length; i++){
                    if((doc = res[i].doc)){
                        res[i].doc = JSON.parse(doc);
                    }
                }
                result.push(res);
            }
        }

        return result.length === 1
            ? result[0]
            : result.length > 1
                ? concat(result)
                : result;
    });
};

SqliteDB.prototype.has = function(id){
    return this.promisfy({
        method: "get",
        stmt: `SELECT EXISTS(SELECT 1 FROM main.reg WHERE id = ?) as exist`,
        params: [id]
    }).then(function(result){
        return !!(result && result.exist);
    });
};

SqliteDB.prototype.search = function(flexsearch, query, limit = 100, offset = 0, suggest = false, resolve = true, enrich = false, tags){

    let rows;

    if(query.length > 1 && flexsearch.depth){

        let stmt = "";
        let params = [];
        let keyword = query[0];
        let term;

        for(let i = 1; i < query.length; i++){
            term = query[i];
            const swap = flexsearch.bidirectional && (term > keyword);
            stmt += (stmt ? " OR " : "") + `(ctx = ? AND key = ?)`
            params.push(swap ? term : keyword, swap ? keyword : term);
            keyword = term;
        }

        if(tags){
            stmt = "(" + stmt + ")";
            for(let i = 0; i < tags.length; i+=2){
                stmt += ` AND id IN (SELECT id FROM main.tag_${ sanitize(tags[i]) } WHERE tag = ?)`;
                params.push(tags[i + 1]);
            }
        }

        rows = this.promisfy({
            method: "all",
            stmt: `
                SELECT r.id 
                       ${ resolve ? "" : ", res" }
                       ${ enrich ? ", doc" : "" }
                FROM (
                    SELECT id, count(*) as count,
                           ${ suggest ? "SUM" : "SUM" /*"MIN"*/ }(res) as res
                    FROM main.ctx${ this.field }
                    WHERE ${ stmt }
                    GROUP BY id
                ) as r
                ${ enrich ? `
                    LEFT JOIN main.reg ON main.reg.id = r.id
                ` : "" }  
                ${ suggest ? "" : "WHERE count = " + (query.length - 1) }
                ORDER BY ${ suggest ? "count DESC, res" : "res" }
                ${ limit ? "LIMIT " + limit : "" }
                ${ offset ? "OFFSET " + offset : "" }
            `,
            params
        });

        // variant 1
        // for(let i = 1; i < query.length; i++){
        //     stmt += (stmt ? " UNION ALL " : "") + `
        //         SELECT id, res
        //         FROM main.ctx${this.field}
        //         WHERE ctx = ? AND key = ?
        //     `;
        //     term = query[i];
        //     const swap = flexsearch.bidirectional && (term > keyword);
        //     params.push(swap ? term : keyword, swap ? keyword : term);
        //     keyword = term;
        // }
        //
        // rows = await this.promisfy({
        //     method: "all",
        //     stmt: `
        //         SELECT id/*, res */
        //         FROM (
        //             SELECT id, ${suggest ? "SUM" : "MIN"}(res) as res, count(*) as count
        //             FROM (${stmt}) as t
        //             GROUP BY id
        //             ORDER BY ${suggest ? "count DESC, res" : "res"}
        //             LIMIT ${limit}
        //             OFFSET ${offset}
        //         ) as r
        //         ${suggest ? "" : "WHERE count = " + (query.length - 1)}
        //     `,
        //     params
        // });
    }
    else{

        let stmt = "";
        let query_length = query.length;
        for(let i = 0; i < query_length; i++){
            stmt += (stmt ? " OR " : "") + `key = ?`
        }

        if(tags){
            stmt = "(" + stmt + ")";
            for(let i = 0; i < tags.length; i+=2){
                stmt += ` AND id IN (SELECT id FROM main.tag_${sanitize(tags[i])} WHERE tag = ?)`;
                query.push(tags[i + 1]);
            }
        }

        rows = this.promisfy({
            method: "all",
            stmt: `
                SELECT r.id 
                       ${ resolve ? "" : ", res" }  
                       ${ enrich ? ", doc" : "" }
                FROM (
                    SELECT id, count(*) as count,
                           ${ suggest ? "SUM" : "SUM" /*"MIN"*/ }(res) as res
                    FROM main.map${ this.field }
                    WHERE ${ stmt }
                    GROUP BY id
                ) as r
                ${ enrich ? `
                    LEFT JOIN main.reg ON main.reg.id = r.id
                ` : "" }  
                ${ suggest ? "" : "WHERE count = " + query_length }
                ORDER BY ${ suggest ? "count DESC, res" : "res" }
                ${ limit ? "LIMIT " + limit : "" }
                ${ offset ? "OFFSET " + offset : "" }
            `,
            params: query
        });

        // variant 1
        // for(let i = 0; i < query.length; i++){
        //     stmt += (stmt ? " UNION ALL " : "") + `
        //         SELECT id, res
        //         FROM main.map${ this.field }
        //         WHERE key = ?
        //     `;
        // }
        //
        // rows = await this.promisfy({
        //     method: "all",
        //     stmt: `
        //         SELECT id/*, res*/
        //         FROM (
        //              SELECT id, ${suggest ? "SUM" : "MIN"}(res) as res, count(*) as count
        //              FROM (${stmt}) as t
        //              GROUP BY id
        //              ORDER BY ${suggest ? "count DESC, res" : "res"}
        //              LIMIT ${limit}
        //              OFFSET ${offset}
        //          ) as r
        //         ${ suggest ? "" : "WHERE count = " + query.length }
        //     `,
        //     params: query
        // });
    }

    return rows.then(function(rows){
        return create_result(rows, resolve, enrich);
    });
};

SqliteDB.prototype.info = function(){
    // todo
};

SqliteDB.prototype.transaction = async function(task, callback){

    if(TRX[this.id]){
        return await task.call(this);
    }

    const db = this.db;
    const self = this;

    return TRX[this.id] = new Promise(function(resolve, reject){
        db.exec("PRAGMA optimize");
        db.exec('PRAGMA busy_timeout = 5000');
        db.exec("BEGIN");
        db.parallelize(function(){
            task.call(self);
        });
        db.exec("COMMIT", function(err, rows){
            TRX[self.id] = null;
            if(err) return reject(err);
            callback && callback(rows);
            resolve(rows);
            db.exec("PRAGMA shrink_memory");
        });
    });
};

SqliteDB.prototype.commit = async function(flexsearch){

    let tasks = flexsearch.commit_task;
    let removals = [];
    let inserts = [];
    flexsearch.commit_task = [];

    for(let i = 0, task; i < tasks.length; i++){
        task = tasks[i];
        if(typeof task["del"] !== "undefined"){
            removals.push(task["del"]);
        }
        else if(typeof task["ins"] !== "undefined"){
            inserts.push(task["ins"]);
        }
    }

    if(removals.length){
        await this.remove(removals);
    }
    // if(inserts_map.length || inserts_ctx.length){
    //     await this.insert(inserts_map, inserts_ctx);
    // }
    if(!flexsearch.reg.size){
        return;
    }

    await this.transaction(function(){

        for(const item of flexsearch.map){
            const key = item[0];
            const arr = item[1];

            for(let i = 0, ids; i < arr.length; i++){
                if((ids = arr[i]) && ids.length){
                    let stmt = "";
                    let params = [];

                    for(let j = 0; j < ids.length; j++){
                        stmt += (stmt ? "," : "") + "(?,?,?)";
                        params.push(key, i, ids[j]);
                        // maximum count of variables supported
                        if((j === ids.length - 1) || (params.length + 3 > MAXIMUM_QUERY_VARS)){
                            this.db.run(
                                "INSERT INTO main.map" + this.field + " (key, res, id) VALUES " + stmt
                                // " ON CONFLICT DO " +
                                // "UPDATE main.map" + this.field + " SET key = '', res = 0 WHERE key = ? AND res > ? AND id = ?"
                            , params);
                            stmt = "";
                            params = [];
                        }
                        //this.db.run("INSERT INTO map (key, res, id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING", [key, i, ids[j]]);
                    }
                }
            }
        }

    //});
    //await this.transaction(function(){

        for(const ctx of flexsearch.ctx){
            const ctx_key = ctx[0];
            const ctx_value = ctx[1];

            for(const item of ctx_value){
                const key = item[0];
                const arr = item[1];

                for(let i = 0, ids; i < arr.length; i++){
                    if((ids = arr[i]) && ids.length){
                        let stmt = "";
                        let params = [];

                        for(let j = 0; j < ids.length; j++){
                            stmt += (stmt ? "," : "") + "(?,?,?,?)";
                            params.push(ctx_key, key, i, ids[j]);
                            // maximum count of variables supported
                            if((j === ids.length - 1) || (params.length + 4 > MAXIMUM_QUERY_VARS)){
                                this.db.run("INSERT INTO main.ctx" + this.field + " (ctx, key, res, id) VALUES " + stmt, params);
                                stmt = "";
                                params = [];
                            }
                        }
                    }
                }
            }
        }
    //});
    //await this.transaction(function(){

        if(flexsearch.store){
            let stmt = "";
            let chunk = [];
            for(const item of flexsearch.store.entries()){
                const id = item[0];
                const doc = item[1];
                stmt += (stmt ? "," : "") + "(?,?)";
                chunk.push(id, typeof doc === "object"
                    ? JSON.stringify(doc)
                    : doc || null
                );
                if(chunk.length + 2 > MAXIMUM_QUERY_VARS){
                    this.db.run("INSERT INTO main.reg (id, doc) VALUES " + stmt + " ON CONFLICT DO NOTHING", chunk);
                    stmt = "";
                    chunk = [];
                }
            }
            if(chunk.length){
                this.db.run("INSERT INTO main.reg (id, doc) VALUES " + stmt + " ON CONFLICT DO NOTHING", chunk);
            }
        }
        else if(!flexsearch.bypass){
            let ids = toArray(flexsearch.reg);
            for(let count = 0; count < ids.length;){
                const chunk = ids.length - count > MAXIMUM_QUERY_VARS
                    ? ids.slice(count, count + MAXIMUM_QUERY_VARS)
                    : count ? ids.slice(count) : ids;
                count += chunk.length;
                const stmt = build_params(chunk.length, /* single param */ true);
                this.db.run("INSERT INTO main.reg (id) VALUES " + stmt + " ON CONFLICT DO NOTHING", chunk);
            }
        }
    //});
    //await this.transaction(function(){

        if(flexsearch.tag){
            let stmt = "";
            let chunk = [];
            for(const item of flexsearch.tag){
                const tag = item[0];
                const ids = item[1];
                if(!ids.length) continue;
                for(let i = 0; i < ids.length; i++){
                    stmt += (stmt ? "," : "") + "(?,?)";
                    chunk.push(tag, ids[i]);
                }
                if(chunk.length + 2 > MAXIMUM_QUERY_VARS){
                    this.db.run("INSERT INTO main.tag" + this.field + " (tag, id) VALUES " + stmt, chunk);
                    stmt = "";
                    chunk = [];
                }
            }
            if(chunk.length){
                this.db.run("INSERT INTO main.tag" + this.field + " (tag, id) VALUES " + stmt, chunk);
            }
        }
    });

    if(inserts.length){
        await this.cleanup();
    }

    // TODO
    //await this.transaction(function(){
    //     this.db.run("INSERT INTO main.cfg" + this.field + " (cfg) VALUES (?)", [JSON.stringify({
    //         "charset": flexsearch.charset,
    //         "tokenize": flexsearch.tokenize,
    //         "resolution": flexsearch.resolution,
    //         "fastupdate": flexsearch.fastupdate,
    //         "compress": flexsearch.compress,
    //         "encoder": {
    //             "minlength": flexsearch.encoder.minlength
    //         },
    //         "context": {
    //             "depth": flexsearch.depth,
    //             "bidirectional": flexsearch.bidirectional,
    //             "resolution": flexsearch.resolution_ctx
    //         }
    //     })]);
    //});

    flexsearch.map.clear();
    flexsearch.ctx.clear();
    flexsearch.tag &&
    flexsearch.tag.clear();
    flexsearch.store &&
    flexsearch.store.clear();
    flexsearch.document ||
    flexsearch.reg.clear();
};

SqliteDB.prototype.remove = function(ids){

    if(typeof ids !== "object"){
        ids = [ids];
    }

    let next;
    // maximum count of variables supported
    if(ids.length > MAXIMUM_QUERY_VARS){
        next = ids.slice(MAXIMUM_QUERY_VARS);
        ids = ids.slice(0, MAXIMUM_QUERY_VARS);
    }

    const self = this;
    return this.transaction(function(){
        const stmt = build_params(ids.length);
        this.db.run("DELETE FROM main.map" + self.field + " WHERE id IN (" + stmt + ")", ids);
        this.db.run("DELETE FROM main.ctx" + self.field + " WHERE id IN (" + stmt + ")", ids);
        this.db.run("DELETE FROM main.tag" + self.field + " WHERE id IN (" + stmt + ")", ids);
        this.db.run("DELETE FROM main.reg WHERE id IN (" + stmt + ")", ids);
    }).then(function(result){
        return next
            ? self.remove(next)
            : result;
    });
};

SqliteDB.prototype.cleanup = function(){
    return this.transaction(function(){
        this.db.run(
            "DELETE FROM main.map" + this.field + " " +
            "WHERE ROWID IN (" +
                "SELECT ROWID FROM (" +
                    "SELECT ROWID, row_number() OVER dupes AS count " +
                    "FROM main.map" + this.field + " _t " +
                    "WINDOW dupes AS (PARTITION BY id, key ORDER BY res) " +
                ") " +
                "WHERE count > 1" +
            ")"

        );
        this.db.run(
            "DELETE FROM main.ctx" + this.field + " " +
            "WHERE ROWID IN (" +
                "SELECT ROWID FROM (" +
                    "SELECT ROWID, row_number() OVER dupes AS count " +
                    "FROM main.ctx" + this.field + " _t " +
                    "WINDOW dupes AS (PARTITION BY id, ctx, key ORDER BY res) " +
                ") " +
                "WHERE count > 1" +
            ")"
        );
    });
};

SqliteDB.prototype.promisfy = function(opt){
    const db = this.db;
    return new Promise(function(resolve, reject){
        db[opt.method](opt.stmt, opt.params || [], function(err, rows){
            opt.callback && opt.callback(rows);
            err ? reject(err)
                : resolve(rows);
        });
    });
};
