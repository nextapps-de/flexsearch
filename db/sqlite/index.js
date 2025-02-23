//const sqlite3 = require("sqlite3").verbose();
import sqlite3 from "sqlite3";
import path from "path";
import StorageInterface from "../interface.js";

const VERSION = 1;
const defaults = {};
const fields = ["map", "ctx", "reg", "cfg"];
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

/**
 * @constructor
 * @implements StorageInterface
 */

export default function SqliteDB(name, config = {}){
    if(typeof name === "object"){
        name = name.name;
        config = name;
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
    this.db = config.db || null;
    this.trx = false;
    // SQLite does not support ALTER TABLE to upgrade
    // the type of the ID later on
    this.type = config.type ? types[config.type.toLowerCase()] : "string";
    if(!this.type) throw new Error("Unknown type of ID '" + config.type + "'");
};

SqliteDB.mount = function(flexsearch){
    return new this().mount(flexsearch);
};

SqliteDB.prototype.mount = function(flexsearch){
    flexsearch.db = this;
    return this.open();
};

SqliteDB.prototype.open = async function(){

    if(!this.db){
        let filepath = this.id;
        if(filepath !== ":memory:"){
            // skip absolute path
            if(filepath[0] !== "/" && filepath[0] !== "\\"){
                // current working directory
                const dir = process.cwd();
                filepath = path.join(dir, this.id);
            }
        }

        this.db = new sqlite3.Database(filepath);
    }

    const db = this.db;
    db.exec("PRAGMA optimize = 0x10002");
    //db.exec("PRAGMA journal_mode = WAL");

    for(let i = 0; i < fields.length; i++){
        const exist = await this.promisfy({
            method: "get",
            stmt: "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
            params: [fields[i] + this.field]
        });
        if(!exist){
            let stmt, stmt_index;
            switch(fields[i]){
                case "map":
                    stmt = `
                        CREATE TABLE main.map${this.field}(
                            key TEXT NOT NULL,
                            res INTEGER NOT NULL,
                            id  ${this.type} NOT NULL
                            /*CONSTRAINT map_pk${this.field} PRIMARY KEY (key, id)*/
                        );
                    `;
                    stmt_index = `
                        CREATE INDEX map_key_res_index${this.field} ON map${this.field} (key, res);
                    `;
                    break;

                case "ctx":
                    stmt = `
                        CREATE TABLE main.ctx${this.field}(
                            ctx TEXT NOT NULL,
                            key TEXT NOT NULL,
                            res INTEGER NOT NULL,
                            id  ${this.type} NOT NULL
                            /*CONSTRAINT ctx_pk${this.field} PRIMARY KEY (ctx, key, id)*/
                        );
                    
                    `;
                    stmt_index = `
                        CREATE INDEX ctx_key_res_index${this.field} ON ctx${this.field} (ctx, key, res);
                    `;
                    break;

                case "reg":
                    stmt = `
                        CREATE TABLE main.reg${this.field}(
                            id ${this.type} NOT NULL
                               /*CONSTRAINT reg_pk${this.field} PRIMARY KEY*/
                        );
                    `;
                    break;

                case "cfg":
                    stmt = `
                        CREATE TABLE main.cfg${this.field} (cfg TEXT NOT NULL);
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

    return db;
};

SqliteDB.prototype.close = function(){
    this.db.close();
    this.db = null;
};

SqliteDB.prototype.destroy = async function(){
    await this.promisfy({
        method: "exec",
        stmt: "DROP TABLE main.map" + this.field + ";" +
              "DROP TABLE main.ctx" + this.field + ";" +
              "DROP TABLE main.cfg" + this.field + ";" +
              "DROP TABLE main.reg;"
    });
    this.close();
};

// SqliteDB.prototype.set = function(ref, key, data, callback){
//     // const transaction = this.db.transaction(ref, "readwrite");
//     // const map = transaction.objectStore(ref);
//     // const req = map.put(data, key);
//     // callback && transaction.then(callback);
//     // return transaction;//promisfy(req, callback);
//
//     const db = this.db;
//     let stmt;
//
//     return;
//
//     return new Promise(function(resolve, reject){
//         switch(ref){
//             case "map":
//                 stmt = db.prepare("INSERT INTO map (key, res, id) VALUES (?, ?, ?)");
//                 stmt.run(key, JSON.stringify(data), function(err, rows){
//                     err ? reject(err)
//                         : resolve(rows);
//                 });
//                 stmt.finalize();
//                 break;
//
//             case "ctx":
//                 stmt = db.prepare("INSERT INTO ctx (key, value) VALUES (?, ?)");
//                 stmt.run(key, JSON.stringify(data), function(err, rows){
//                     err ? reject(err)
//                         : resolve(rows);
//                 });
//                 stmt.finalize();
//                 break;
//
//             case "reg":
//                 stmt = db.prepare("INSERT INTO reg (id) VALUES (?)");
//                 stmt.run(key, function(err, rows){
//                     err ? reject(err)
//                         : resolve(rows);
//                 });
//                 stmt.finalize();
//                 break;
//
//             case "cfg":
//                 stmt = db.prepare("INSERT INTO cfg (cfg) VALUES (?)");
//                 stmt.run(JSON.stringify(data), function(err, rows){
//                     err ? reject(err)
//                         : resolve(rows);
//                 });
//                 stmt.finalize();
//                 break;
//
//             default:
//                 reject()
//         }
//     });
// };

// SqliteDB.prototype.delete = function(ref, key, callback){
//     // const transaction = this.db.transaction(ref, "readwrite");
//     // const map = transaction.objectStore(ref);
//     // const req = map.delete(key);
//     // callback && transaction.then(callback);
//     // return transaction;//promisfy(req, callback);
//
//     const db = this.db
//     return new Promise(function(resolve, reject){
//         switch(ref){
//             case "map":
//                 db.run("DELETE FROM map WHERE key = '" + key + "'", function(err, rows){
//                     err ? reject(err)
//                         : resolve(rows);
//                 });
//                 break;
//
//             case "ctx":
//                 db.run("DELETE FROM ctx WHERE key = '" + key + "'", function(err, rows){
//                     err ? reject(err)
//                         : resolve(rows);
//                 });
//                 break;
//
//             case "reg":
//                 db.run("DELETE FROM reg WHERE id = '" + key + "'", function(err, rows){
//                     err ? reject(err)
//                         : resolve(rows);
//                 });
//                 break;
//
//             case "cfg":
//                 db.run("DELETE FROM cfg WHERE key = null", function(err, rows){
//                     err ? reject(err)
//                         : resolve(rows);
//                 });
//                 break;
//
//             default:
//                 reject()
//         }
//     });
// };

SqliteDB.prototype.clear = function(){
    return this.transaction(async function(){
        const self = this;
        fields.forEach(function(ref){
            self.db.exec("DELETE FROM main." + ref + self.field + ";");
        });
    });
};

SqliteDB.prototype.get = function(ref, key, ctx, limit = 0, offset = 0, resolve = true){
    let result;
    switch(ref){
        case "map":
            result = this.promisfy({
                method: "all",
                stmt: `
                    SELECT id ${resolve ? "" : ", res"}
                    FROM main.map${this.field} 
                    WHERE key = ? 
                    ORDER BY res 
                    LIMIT ${limit}
                    ${offset ? "OFFSET " + offset : ""}
                `,
                params: [key]
            });
            // fallthrough
        case "ctx":
            result = result || this.promisfy({
                method: "all",
                stmt: `
                    SELECT id ${resolve ? "" : ", res"}
                    FROM main.map${this.field} 
                    WHERE ctx = ? AND key = ? 
                    ORDER BY res 
                    LIMIT ${limit}
                    ${offset ? "OFFSET " + offset : ""}
                `,
                params: [ctx, key]
            });
            return result.then(function(rows){
                if(resolve){
                    for(let i = 0; i < rows.length; i++){
                        rows[i] = rows[i].id
                    }
                    return [rows];
                }
                else{
                    const arr = [];
                    for(let i = 0, row; i < rows.length; i++){
                        row = rows[i];
                        arr[row.res] || (arr[row.res] = []);
                        arr[row.res].push(row.id);
                    }
                    return arr;
                }
            });
        // case "reg":
        //     return this.promisfy({
        //         method: "get",
        //         stmt: "SELECT 1 FROM main.reg" + this.field + " WHERE id = ?",
        //         params: [key]
        //     });
        // case "cfg":
        //     result = this.promisfy({
        //         method: "get",
        //         stmt: "SELECT cfg FROM main.cfg" + this.field
        //     });
        //     return result.then(function(cfg){
        //         return cfg && JSON.parse(cfg);
        //     });
    }
};

SqliteDB.prototype.has = function(ref, key, ctx){
    switch(ref){
        case "map":
            return this.promisfy({
                method: "get",
                stmt: "SELECT EXISTS(SELECT 1 FROM main." + ref + self.field + " WHERE key = ? LIMIT 1)",
                params: [key]
            });
        case "ctx":
            return this.promisfy({
                method: "get",
                stmt: "SELECT EXISTS(SELECT 1 FROM main." + ref + self.field + " WHERE ctx = ? AND key = ? LIMIT 1)",
                params: [ctx, key]
            });
        case "reg":
            return this.promisfy({
                method: "get",
                stmt: "SELECT EXISTS(SELECT 1 FROM main.reg" + self.field + " WHERE id = ? LIMIT 1)",
                params: [key]
            });
        // case "cfg":
        //     return this.promisfy({
        //         method: "get",
        //         stmt: "SELECT EXISTS(SELECT 1 FROM main.cfg" + self.field + " WHERE cfg IS NOT NULL LIMIT 1)"
        //     });
    }
};

SqliteDB.prototype.search = async function(flexsearch, query, suggest, limit = 100, offset = 0, resolve = true){

    let rows;
    let stmt = "";

    if(query.length > 1 && flexsearch.depth){

        let params = [];
        let keyword = query[0];
        let term;

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

        for(let i = 1; i < query.length; i++){
            term = query[i];
            const swap = flexsearch.bidirectional && (term > keyword);
            stmt += (stmt ? " OR " : "") + `(ctx = ? AND key = ?)`
            params.push(swap ? term : keyword, swap ? keyword : term);
            keyword = term;
        }

        rows = await this.promisfy({
            method: "all",
            stmt: `
                SELECT id
                FROM (
                    SELECT id, count(id) as count
                    FROM main.ctx${this.field}
                    WHERE ${stmt}
                    GROUP BY id
                    ORDER BY count DESC, res
                )
                ${ suggest ? "" : "WHERE count = " + (query.length - 1) }
                LIMIT ${limit}
                ${offset ? "OFFSET " + offset : ""}
            `,
            params
        });

        // rows = await db.any(`
        //     SELECT id, res
        //     FROM (
        //         SELECT id, min(res) as res, count(*) as count
        //         FROM (${stmt}) as t
        //         GROUP BY id
        //         ORDER BY count desc, res
        //         LIMIT ${limit || 100}
        //         OFFSET ${offset || 0}
        //     ) as r
        //     ${suggest ? "" : "WHERE count = " + (query.length - 1)}
        // `, params);
    }
    else{

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

        for(let i = 0; i < query.length; i++){
            stmt += (stmt ? " OR " : "") + `key = ?`
        }

        rows = await this.promisfy({
            method: "all",
            stmt: `
                SELECT id
                FROM (
                    SELECT id, count(id) as count
                    FROM main.map${this.field}
                    WHERE ${stmt}
                    GROUP BY id
                    ORDER BY count DESC, res
                )
                ${ suggest ? "" : "WHERE count = " + query.length }
                LIMIT ${limit}
                ${offset ? "OFFSET " + offset : ""}
            `,
            params: query
        });
    }

    if(resolve){
        for(let i = 0; i < rows.length; i++){
            rows[i] = rows[i].id;
        }
        return rows;
    }
    else{
        const arr = [];
        for(let i = 0, row; i < rows.length; i++){
            row = rows[i];
            arr[row.res] || (arr[row.res] = []);
            arr[row.res].push(row.id);
        }
        return arr;
    }
}

SqliteDB.prototype.info = function(){
    // todo
};

SqliteDB.prototype.transaction = function(task, callback){

    //console.log("EXISTING", this.trx)

    if(this.trx) return task.call(this);
    this.trx = true;

    const self = this;
    const db = this.db;
    return new Promise(function(resolve, reject){
        db.exec("BEGIN TRANSACTION");
        db.parallelize(function(){
            task.call(self);
        });
        db.exec("COMMIT", function(err, rows){
            if(err) return reject(err);
            callback && callback(rows);
            resolve(rows);
        });
        self.trx = false;
    });
};

SqliteDB.prototype.commit = async function(flexsearch, _replace, _append){

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

    const self = this;
    const db = this.db;

    db.exec("PRAGMA optimize");

    await this.transaction(function(){

        //stmt = db.prepare("INSERT INTO map (key, res, id) VALUES (?, ?, ?)");

        for(const item of flexsearch.map){
            const key = item[0];
            const arr = item[1];

            for(let i = 0, ids; i < arr.length; i++){
                if((ids = arr[i]) && ids.length){
                    let stmt = "(?,?,?)";
                    let params = [key, i, ids[0]];
                    for(let j = 1; j < ids.length; j++){
                        stmt += ",(?,?,?)";
                        params.push(key, i, ids[j]);
                        //db.run("INSERT INTO map (key, res, id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING", [key, i, ids[j]]);
                        //db.run("INSERT INTO map (key, res, id) VALUES (?, ?, ?)", [key, i, ids[j]]);
                        //stmt.run(key, i, ids[j]);
                    }
                    db.run("INSERT INTO main.map" + self.field + " (key, res, id) VALUES " + stmt, params);
                }
            }
        }

        //stmt = db.prepare("INSERT INTO ctx (key, res, id) VALUES (?, ?, ?)");

        for(const ctx of flexsearch.ctx){
            const ctx_key = ctx[0];
            const ctx_value = ctx[1];

            for(const item of ctx_value){
                const key = item[0];
                const arr = item[1];

                for(let i = 0, ids; i < arr.length; i++){
                    if((ids = arr[i]) && ids.length){
                        let stmt = "(?,?,?,?)";
                        let params = [ctx_key, key, i, ids[0]];
                        for(let j = 1; j < ids.length; j++){
                            stmt += ",(?,?,?,?)";
                            params.push(ctx_key, key, i, ids[j]);
                            //db.run("INSERT INTO ctx (key, res, id) VALUES (?, ?, ?)", [ctx_key + ":" + key, i, ids[j]]);
                            //stmt.run(ctx_key + ":" + key, i, ids[j]);
                        }
                        db.run("INSERT INTO main.ctx" + self.field + " (ctx, key, res, id) VALUES " + stmt, params);
                    }
                }
            }
        }
        //stmt.finalize();

        //stmt = db.prepare("INSERT INTO reg (id) VALUES (?)");
        let params = [...flexsearch.reg.keys()];
        let stmt = params.map(() => "(?)").join(",");
        db.run("INSERT INTO main.reg" + self.field + " (id) VALUES " + stmt, params);
        //stmt.finalize();

        db.run("INSERT INTO main.cfg" + self.field + " (cfg) VALUES (?)", [JSON.stringify({
            "encode": typeof flexsearch.encode === "string" ? flexsearch.encode : "",
            "charset": typeof flexsearch.charset === "string" ? flexsearch.charset : "",
            "tokenize": flexsearch.tokenize,
            "resolution": flexsearch.resolution,
            //"minlength": flexsearch.minlength,
            "optimize": flexsearch.optimize,
            "fastupdate": flexsearch.fastupdate,
            "encoder": flexsearch.encoder,
            "context": {
                "depth": flexsearch.depth,
                "bidirectional": flexsearch.bidirectional,
                "resolution": flexsearch.resolution_ctx
            }
        })]);
    });

    db.exec("PRAGMA shrink_memory");

    flexsearch.map.clear();
    flexsearch.ctx.clear();
    flexsearch.reg.clear();
};

SqliteDB.prototype.remove = function(ids, _skip_transaction){

    if(typeof ids !== "object"){
        ids = [ids];
    }

    const self = this;
    return this.transaction(function(){
        const stmt = ids.map(() => "?").join(',');
        this.db.run("DELETE FROM main.map" + self.field + " WHERE id IN (" + stmt + ")", ids);
        this.db.run("DELETE FROM main.ctx" + self.field + " WHERE id IN (" + stmt + ")", ids);
        this.db.run("DELETE FROM main.reg" + self.field + " WHERE id IN (" + stmt + ")", ids);
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
