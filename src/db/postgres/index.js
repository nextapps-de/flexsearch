import pg_promise from "pg-promise";
import StorageInterface from "../interface.js";
import { concat, toArray } from "../../common.js";
const defaults = {
    schema: "flexsearch",
    user: "postgres",
    pass: "postgres",
    name: "postgres",
    host: "localhost",
    port: "5432"
};

const pgp = pg_promise(/*{ noWarnings: true }*/);
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

let DB, TRX;

/**
 * @constructor
 * @implements StorageInterface
 */

export default function PostgresDB(name, config = {}){
    if(!this || this.constructor !== PostgresDB){
        return new PostgresDB(name, config);
    }
    if(typeof name === "object"){
        config = name;
        name = config.name;
    }
    if(!name){
        console.info("Default storage space was used, because a name was not passed.");
    }
    this.id = (config.schema ? sanitize(config.schema) : defaults.schema) + (name ? "_" + sanitize(name) : "");
    this.field = config.field ? "_" + sanitize(config.field) : "";
    this.type = config.type ? types[config.type.toLowerCase()] : "text";
    this.support_tag_search = true;
    if(!this.type) throw new Error("Unknown type of ID '" + config.type + "'");
    this.db = DB || (DB = config.db || null);
    Object.assign(defaults, config);
    this.db && delete defaults.db;
};

PostgresDB.prototype.mount = function(flexsearch){
    //if(flexsearch.constructor === Document){
    if(flexsearch.index){
        return flexsearch.mount(this);
    }
    flexsearch.db = this;
    return this.open();
};

PostgresDB.prototype.open = async function(){

    if(!this.db) {
        this.db = DB || (
            DB = pgp(`postgres://${defaults.user}:${encodeURIComponent(defaults.pass)}@${defaults.host}:${defaults.port}/${defaults.name}`)
        );
    }

    const exist = await this.db.oneOrNone(`
        SELECT EXISTS (
            SELECT 1 
            FROM information_schema.schemata 
            WHERE schema_name = '${this.id}'
        );
    `);
    if(!exist || !exist.exists){
        await this.db.none(`CREATE SCHEMA IF NOT EXISTS ${ this.id };`);
    }

    for(let i = 0; i < fields.length; i++){
        const exist = await this.db.oneOrNone(`
            SELECT EXISTS (
                SELECT 1 FROM pg_tables
                WHERE schemaname = '${this.id}' AND tablename = '${fields[i] + (fields[i] !== "reg" ? this.field : "")}'
            );
        `);
        if(exist && exist.exists) continue;

        const type = this.type === "text"
            ? "varchar(128)"
            : this.type;

        switch(fields[i]){
            case "map":
                await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.map${this.field}(
                        key varchar(128) NOT NULL,
                        res smallint     NOT NULL,
                        id  ${type} NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS ${this.id}_map_index${this.field}
                        ON ${this.id}.map${this.field} (key);
                    CREATE INDEX IF NOT EXISTS ${this.id}_map_id${this.field}
                        ON ${this.id}.map${this.field} (id);
                `);
                break;

            case "ctx":
                await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.ctx${this.field}(
                        ctx varchar(128) NOT NULL,
                        key varchar(128) NOT NULL,
                        res smallint     NOT NULL,
                        id  ${type} NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS ${this.id}_ctx_index${this.field}
                        ON ${this.id}.ctx${this.field} (ctx, key);
                    CREATE INDEX IF NOT EXISTS ${this.id}_ctx_id${this.field}
                        ON ${this.id}.ctx${this.field} (id);
                `);
                break;

            case "tag":
                await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.tag${this.field}(
                        tag varchar(128) NOT NULL,
                        id  ${type} NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS ${this.id}_tag_index${this.field}
                        ON ${this.id}.tag${this.field} (tag);
                    CREATE INDEX IF NOT EXISTS ${this.id}_tag_id${this.field}
                        ON ${this.id}.tag${this.field} (id);
                `);
                break;

            case "reg":
                await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.reg(
                        id ${type} NOT NULL
                            CONSTRAINT ${this.id}_reg_pk
                                PRIMARY KEY,
                        doc text DEFAULT NULL
                    );
                `).catch(e => {
                    // document indexes will try to create same registry table
                    // and the "IF NOT EXISTS" did not apply on parallel
                });
                break;

            case "cfg":
                await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.cfg${this.field}(
                        cfg text NOT NULL
                    );
                `);
                break;
        }
    }

    return this.db;
};

PostgresDB.prototype.close = function(){
    //DB && DB.close && DB.close();
    this.db = /*DB =*/ null;
    return this;
};

PostgresDB.prototype.destroy = function(){
    return this.db.none(`
        DROP TABLE IF EXISTS ${this.id}.map${this.field};
        DROP TABLE IF EXISTS ${this.id}.ctx${this.field};
        DROP TABLE IF EXISTS ${this.id}.tag${this.field};
        DROP TABLE IF EXISTS ${this.id}.cfg${this.field};
        DROP TABLE IF EXISTS ${this.id}.reg;
    `);
};

PostgresDB.prototype.clear = function(){
    return this.db.none(`
        TRUNCATE TABLE ${this.id}.map${ this.field };
        TRUNCATE TABLE ${this.id}.ctx${ this.field };
        TRUNCATE TABLE ${this.id}.tag${ this.field };
        TRUNCATE TABLE ${this.id}.cfg${ this.field };
        TRUNCATE TABLE ${this.id}.reg;
    `);
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

PostgresDB.prototype.get = function(key, ctx, limit = 0, offset = 0, resolve = true, enrich = false, tags){
    let rows;
    let stmt = '';
    let params = ctx ? [ctx, key] : [key];
    let table = this.id + (ctx ? ".ctx" : ".map") + this.field;
    if(tags){
        for(let i = 0, count = params.length + 1; i < tags.length; i+=2){
            stmt += ` AND ${ table }.id IN (SELECT id FROM ${ this.id }.tag_${ sanitize(tags[i]) } WHERE tag = $${ count++ })`;
            params.push(tags[i + 1]);
        }
    }
    if(ctx){
        rows = this.db.any(`
            SELECT ${ table }.id 
                   ${ resolve ? "" : ", res" }
                   ${ enrich ? ", doc" : "" }
            FROM ${ table }
            ${ enrich ? `
                LEFT JOIN ${ this.id }.reg ON ${ this.id }.reg.id = ${ table }.id
            ` : "" }  
            WHERE ctx = $1 AND key = $2 ${stmt}
            ORDER BY res
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }`,
            params
        );
    }
    else{
        rows = this.db.any(`
            SELECT ${ table }.id
                   ${ resolve ? "" : ", res" }
                   ${ enrich ? ", doc" : "" }
            FROM ${ table }
            ${ enrich ? `
                LEFT JOIN ${ this.id }.reg ON ${ this.id }.reg.id = ${ table }.id
            ` : "" }
            WHERE key = $1 ${stmt}
            ORDER BY res
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }`,
            params
        );
    }
    return rows.then(function(rows){
        return create_result(rows, resolve, enrich);
    });
};

PostgresDB.prototype.tag = function(tag, limit = 0, offset = 0, enrich = false){
    const table = this.id + ".tag" + this.field;
    const promise = this.db.any(`
        SELECT ${ table }.id
               ${ enrich ? ", doc" : "" }
        FROM ${ table }
        ${ enrich ? `
            LEFT JOIN ${ this.id }.reg ON ${ this.id }.reg.id = ${ table }.id
        ` : "" }
        WHERE tag = $1
        ${ limit ? "LIMIT " + limit : "" }
        ${ offset ? "OFFSET " + offset : "" }`,
        [tag]
    );
    enrich || promise.then(function(rows){
        return create_result(rows, true, false);
    });
    return promise;
};

PostgresDB.prototype.enrich = async function(ids){
    let result = [];
    if(typeof ids !== "object"){
        ids = [ids];
    }
    for(let count = 0; count < ids.length;){
        const chunk = ids.length - count > MAXIMUM_QUERY_VARS
            ? ids.slice(count, count + MAXIMUM_QUERY_VARS)
            : count ? ids.slice(count) : ids;
        count += chunk.length;
        let stmt = "";
        for(let i = 1; i <= chunk.length; i++){
            stmt += (stmt ? "," : "") + "$" + i;
        }
        const res = await this.db.any(`
            SELECT id, doc 
            FROM ${ this.id }.reg
            WHERE id IN (${ stmt })`,
            ids
        );
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
};

PostgresDB.prototype.has = function(id){
    return this.db.oneOrNone("SELECT EXISTS(SELECT 1 FROM " + this.id + ".reg WHERE id = $1)", [id]).then(function(result){
        return !!(result && result.exists);
    });
};

PostgresDB.prototype.search = function(flexsearch, query, limit = 100, offset = 0, suggest = false, resolve = true, enrich = false, tags){

    let rows;

    if(query.length > 1 && flexsearch.depth){

        let where = "";
        let params = [];
        let keyword = query[0];
        let term;
        let count = 1;
        // variant new

        for(let i = 1; i < query.length; i++){
            term = query[i];
            const swap = flexsearch.bidirectional && (term > keyword);
            where += (where ? " OR " : "") + `(ctx = $${ count++ } AND key = $${ count++ })`
            params.push(swap ? term : keyword, swap ? keyword : term);
            keyword = term;
        }

        if(tags){
            where = "(" + where + ")";
            for(let i = 0; i < tags.length; i+=2){
                where += ` AND id IN (SELECT id FROM ${ this.id }.tag_${ sanitize(tags[i]) } WHERE tag = $${ count++ })`;
                params.push(tags[i + 1]);
            }
        }

        rows = this.db.any(`
            SELECT r.id 
                   ${ resolve ? "" : ", res" }
                   ${ enrich ? ", doc" : "" }
            FROM (
                SELECT id, count(*) as count,
                       ${ suggest ? "SUM" : "SUM" /*"MIN"*/ }(res) as res
                FROM ${ this.id }.ctx${ this.field }
                WHERE ${ where }
                GROUP BY id
            ) as r
            ${ enrich ? `
                LEFT JOIN ${ this.id }.reg ON ${ this.id }.reg.id = r.id
            ` : "" } 
            ${ suggest ? "" : "WHERE count = " + (query.length - 1) }
            ORDER BY ${ suggest ? "count DESC, res" : "res" }
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }
        `, params);

        // variant 1

        // for(let i = 1, count = 1; i < query.length; i++){
        //     where += (where ? " UNION " : "") + `
        //         SELECT id, res
        //         FROM ${this.id}.ctx${this.field}
        //         WHERE ctx = $${count++} AND key = $${count++}
        //     `;
        //     term = query[i];
        //     const swap = flexsearch.bidirectional && (term > keyword);
        //     params.push(
        //         swap ? term : keyword,
        //         swap ? keyword : term
        //     );
        //     keyword = term;
        // }
        //
        // rows = await db.any(`
        //     SELECT id, res
        //     FROM (
        //         SELECT id, ${suggest ? "SUM" : "MIN"}(res) as res, count(*) as count
        //         FROM (${where}) as t
        //         GROUP BY id
        //         ORDER BY ${suggest ? "count DESC, res" : "res"}
        //         LIMIT ${limit}
        //         OFFSET ${offset}
        //     ) as r
        //     ${suggest ? "" : "WHERE count = " + (query.length - 1)}
        // `, params);

    }
    else{

        let where = "";
        let count = 1;
        let query_length = query.length;
        for(let i = 0; i < query_length; i++){
            where += (where ? "," : "") + "$" + count++;
        }
        where = "key " + (query_length > 1 ? "IN (" + where + ")" : "= " + where );

        if(tags){
            where = "(" + where + ")";
            for(let i = 0; i < tags.length; i+=2){
                where += ` AND id IN (SELECT id FROM ${ this.id }.tag_${ sanitize(tags[i]) } WHERE tag = $${ count++ })`;
                query.push(tags[i + 1]);
            }
        }

        rows = this.db.any(`
            SELECT r.id 
                   ${ resolve ? "" : ", res" }   
                   ${ enrich ? ", doc" : "" }
            FROM (
                SELECT id, count(*) as count,
                       ${ suggest ? "SUM" : "SUM" /*"MIN"*/ }(res) as res
                FROM ${ this.id }.map${ this.field }
                WHERE ${ where }
                GROUP BY id
            ) as r
            ${ enrich ? `
                LEFT JOIN ${ this.id }.reg ON ${ this.id }.reg.id = r.id
            ` : "" }   
            ${ suggest ? "" : "WHERE count = " + query_length }
            ORDER BY ${ suggest ? "count DESC, res" : "res" }
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }
        `, query);

        // variant 1
        // for(let i = 1; i <= query.length; i++){
        //     where += (where ? " UNION " : "") + `
        //         SELECT id, res
        //         FROM ${ this.id }.map${ this.field }
        //         WHERE key = $${i}
        //     `;
        // }
        // rows = await db.any(`
        //     SELECT id, res
        //     FROM (
        //         SELECT id, ${suggest ? "SUM" : "MIN"}(res) as res, count(*) as count
        //         FROM (${where}) as t
        //         GROUP BY id
        //         ORDER BY ${suggest ? "count DESC, res" : "res"}
        //         LIMIT ${limit}
        //         OFFSET ${offset}
        //     ) as r
        //     ${ suggest ? "" : "WHERE count = " + query.length }
        // `, query);

        // variant 2
        // for(let i = 1; i <= query.length; i++){
        //     where += (where ? " AND EXISTS " : "") + `(SELECT FROM ${this.id}.map${this.field} as d WHERE d.id = t.id AND d.key = $` + i + ")";
        // }
        // rows = await db.any(`
        //     SELECT t.id, min(t.res)
        //     FROM ${this.id}.map${this.field} AS t
        //     WHERE EXISTS ${where}
        //     GROUP BY t.id
        //     LIMIT ${limit || 100}
        //     OFFSET ${offset || 0}
        // `, query);

        // variant 3
        // for(let i = 1; i <= query.length; i++){
        //     where += (where ? " INTERSECT " : "") + `SELECT id FROM ${this.id}.map${this.field} WHERE key = $` + i;
        // }
        // rows = await db.any(`
        //     WITH filtering (id) AS(${where})
        //     SELECT t.id, min(t.res)
        //     FROM ${this.id}.map${this.field} AS t
        //     JOIN filtering USING (id)
        //     GROUP BY t.id
        //     LIMIT ${limit || 100}
        //     OFFSET ${offset || 0}
        // `, query);

        // variant 4
        // for(let i = 1; i <= query.length; i++){
        //     where += (where ? " INTERSECT " : "") + `SELECT id FROM ${this.id}.map${this.field} WHERE key = $` + i;
        // }
        // rows = await db.any(`
        //     SELECT id, min(res)
        //     FROM ${this.id}.map${this.field}
        //     WHERE id IN (${where})
        //     GROUP BY id
        //     LIMIT ${limit || 100}
        //     OFFSET ${offset || 0}
        // `, query);
    }

    return rows.then(function(rows){
        return create_result(rows, resolve, enrich);
    });
};

PostgresDB.prototype.info = function(){
    // todo
};

// PostgresDB.prototype.transaction = async function(task){
//     const self = this;
//     if(TRX){
//         return TRX.then(function(){
//             return self.transaction(task);
//             //task.call(self, TRX);
//         });
//     }
//     TRX = await this.db.tx(async function(trx){
//         await task.call(self, trx);
//     });
//     TRX = null;
// };

PostgresDB.prototype.transaction = function(task){
    const self = this;
    return this.db.tx(function(trx){
        return task.call(self, trx);
    });
};

// PostgresDB.prototype.transaction = async function(task){
//     if(TRX){
//         return await task.call(this, TRX);
//     }
//     const self = this;
//     return this.db.tx(async function(trx){
//         await task.call(self, TRX = trx);
//         TRX = null;
//     });
// };

PostgresDB.prototype.commit = async function(flexsearch){

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

        const batch = [];

        // Datastore + Registry

        if(flexsearch.store){
            let data = [];
            let stmt = new pgp.helpers.ColumnSet(["id", "doc"],{
                table: this.id + ".reg"
            });
            for(const item of flexsearch.store.entries()){
                const id = item[0];
                const doc = item[1];
                // const migration = checkMigration.call(this, id);
                // migration && await migration;
                data.push({ id, doc: doc && JSON.stringify(doc) });
                if(data.length === MAXIMUM_QUERY_VARS){
                    let insert = pgp.helpers.insert(data, stmt);
                    batch.push(
                        trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'))
                    );
                    data = [];
                }
            }
            if(data.length){
                let insert = pgp.helpers.insert(data, stmt);
                batch.push(
                    trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'))
                );
            }
            // while(data.length){
            //     let next;
            //     if(data.length > MAXIMUM_QUERY_VARS){
            //         next = data.slice(MAXIMUM_QUERY_VARS);
            //         data = data.slice(0, MAXIMUM_QUERY_VARS);
            //     }
            //     let insert = pgp.helpers.insert(data, stmt);
            //     trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'));
            //     if(next) data = next;
            //     else break;
            // }
        }

        // Registry Only

        else if(!flexsearch.bypass){
            let data = [];
            let stmt = new pgp.helpers.ColumnSet(["id"],{
                table: this.id + ".reg"
            });
            for(const id of flexsearch.reg.keys()){
                // const migration = checkMigration.call(this, id);
                // migration && await migration;
                data.push({ id });
                if(data.length === MAXIMUM_QUERY_VARS){
                    let insert = pgp.helpers.insert(data, stmt);
                    batch.push(
                        trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'))
                    );
                    data = [];
                }
            }
            if(data.length){
                let insert = pgp.helpers.insert(data, stmt);
                batch.push(
                    trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'))
                );
            }
        }

        // Default Index

        if(flexsearch.map.size){
            let data = [];
            let stmt = new pgp.helpers.ColumnSet(["key", "res", "id"], {
                table: this.id + ".map" + this.field
            });
            for(const item of flexsearch.map){
                const key = item[0];
                const arr = item[1];

                for(let i = 0, ids; i < arr.length; i++){
                    if((ids = arr[i]) && ids.length){
                        //this.type || (this.type = typeof ids[0]);
                        // let stmt = "($1,$2,$3)";
                        // let params = [key, i, ids[0]];
                        for(let j = 0; j < ids.length; j++){
                            // stmt += ",($1,$2,$3)";
                            // params.push(key, i, ids[j]);
                            //trx.none(`INSERT INTO ${config.schema}.map${self.field} (key, res, id) VALUES ($1,$2,$3)`, [key, i, ids[j]]);
                            data.push({
                                key: key,
                                res: i,
                                id: ids[j]
                            });
                            if(data.length === MAXIMUM_QUERY_VARS){
                                let insert = pgp.helpers.insert(data, stmt);
                                batch.push(
                                    trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'))
                                );
                                data = [];
                            }
                        }
                    }
                }
            }
            if(data.length){
                let insert = pgp.helpers.insert(data, stmt);
                batch.push(
                    trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'))
                );
            }
        }

        // Context Index

        if(flexsearch.ctx.size){
            let data = [];
            let stmt = new pgp.helpers.ColumnSet(["ctx", "key", "res", "id"], {
                table: this.id + ".ctx" + this.field
            });
            for(const ctx of flexsearch.ctx){
                const ctx_key = ctx[0];
                const ctx_value = ctx[1];

                for(const item of ctx_value){
                    const key = item[0];
                    const arr = item[1];

                    for(let i = 0, ids; i < arr.length; i++){
                        if((ids = arr[i]) && ids.length){
                            // let stmt = "(?,?,?)";
                            // let params = [ctx_key + ":" + key, i, ids[0]];
                            for(let j = 0; j < ids.length; j++){
                                // stmt += ",(?,?,?)";
                                // params.push(ctx_key + ":" + key, i, ids[j]);
                                //trx.none("INSERT INTO " + config.schema + ".ctx" + self.field + " (ctx, key, res, id) VALUES ($1,$2,$3,$4)", [ctx_key, key, i, ids[j]]);
                                data.push({
                                    ctx: ctx_key,
                                    key: key,
                                    res: i,
                                    id: ids[j]
                                });
                                if(data.length === MAXIMUM_QUERY_VARS){
                                    let insert = pgp.helpers.insert(data, stmt);
                                    batch.push(
                                        trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'))
                                    );
                                    data = [];
                                }
                            }
                        }
                    }
                }
            }
            if(data.length){
                let insert = pgp.helpers.insert(data, stmt);
                batch.push(
                    trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'))
                );
            }
        }

        // Tag Index

        if(flexsearch.tag){
            let data = [];
            let stmt = new pgp.helpers.ColumnSet(["tag", "id"],{
                table: this.id + ".tag" + this.field
            });
            for(const item of flexsearch.tag){
                const tag = item[0];
                const ids = item[1];
                if(!ids.length) continue;
                for(let j = 0; j < ids.length; j++){
                    data.push({ tag, id: ids[j] });
                    if(data.length === MAXIMUM_QUERY_VARS){
                        let insert = pgp.helpers.insert(data, stmt);
                        batch.push(
                            trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'))
                        );
                        data = [];
                    }
                }
            }
            if(data.length){
                let insert = pgp.helpers.insert(data, stmt);
                batch.push(
                    trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'))
                );
            }
        }

        // Field Configuration

        // TODO
        // trx.none("INSERT INTO " + this.id + ".cfg" + this.field + " (cfg) VALUES ($1)", [
        //     JSON.stringify({
        //         "encode": typeof flexsearch.encode === "string" ? flexsearch.encode : "",
        //         "charset": typeof flexsearch.charset === "string" ? flexsearch.charset : "",
        //         "tokenize": flexsearch.tokenize,
        //         "resolution": flexsearch.resolution,
        //         "minlength": flexsearch.minlength,
        //         "optimize": flexsearch.optimize,
        //         "fastupdate": flexsearch.fastupdate,
        //         "encoder": flexsearch.encoder,
        //         "context": {
        //             "depth": flexsearch.depth,
        //             "bidirectional": flexsearch.bidirectional,
        //             "resolution": flexsearch.resolution_ctx
        //         }
        //     })
        // ]);

        //return Promise.all(batch);

        if(batch.length){
            return trx.batch(batch);
        }
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

PostgresDB.prototype.remove = function(ids){

    if(!ids && ids !== 0){
        return;
    }
    if(typeof ids !== "object"){
        ids = [ids];
    }
    if(!ids.length){
        return;
    }

    // ids = [ids];
    // return this.db.none(
    //     "DELETE FROM " + this.id + ".map" + this.field + " WHERE id = ANY ($1);" +
    //     "DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id = ANY ($1);" +
    //     "DELETE FROM " + this.id + ".tag" + this.field + " WHERE id = ANY ($1);" +
    //     "DELETE FROM " + this.id + ".reg WHERE id = ANY ($1);", [ids]
    // );

    // ids = [ids];
    // return Promise.all([
    //     this.db.none({ text: "DELETE FROM " + this.id + ".map" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids),
    //     this.db.none({ text: "DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids),
    //     this.db.none({ text: "DELETE FROM " + this.id + ".tag" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids),
    //     this.db.none({ text: "DELETE FROM " + this.id + ".reg WHERE id = ANY ($1)", rowMode: "array" }, ids)
    // ]);

    return this.transaction(function(trx){

        //console.log("remove:", ids);

        // ids = [ids];
        // trx.none({ text: "DELETE FROM " + this.id + ".map" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids);
        // trx.none({ text: "DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids);
        // trx.none({ text: "DELETE FROM " + this.id + ".tag" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids);
        // trx.none({ text: "DELETE FROM " + this.id + ".reg WHERE id = ANY ($1)", rowMode: "array" }, ids);

        // ids = [ids];
        // trx.none("DELETE FROM " + this.id + ".map" + this.field + " WHERE id = ANY ($1)", ids);
        // trx.none("DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id = ANY ($1)", ids);
        // trx.none("DELETE FROM " + this.id + ".tag" + this.field + " WHERE id = ANY ($1)", ids);
        // trx.none("DELETE FROM " + this.id + ".reg WHERE id = ANY ($1)", ids);
        // return;

        // return trx.none(
        //     "DELETE FROM " + this.id + ".map" + this.field + " WHERE id = ANY ($1);" +
        //     "DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id = ANY ($1);" +
        //     "DELETE FROM " + this.id + ".tag" + this.field + " WHERE id = ANY ($1);" +
        //     "DELETE FROM " + this.id + ".reg WHERE id = ANY ($1);", [ids]
        // );

        // while(ids.length){
        //     let next;
        //     let stmt = "";
        //     let chunk = 0;
        //     let migration;
        //     for(let i = 0; i < ids.length; i++){
        //         stmt += (stmt ? "," : "") + "$" + (i + 1); // + "::text";
        //         // maximum count of variables supported
        //         if(++chunk === MAXIMUM_QUERY_VARS){
        //             next = ids.slice(MAXIMUM_QUERY_VARS);
        //             ids = ids.slice(0, MAXIMUM_QUERY_VARS);
        //             break;
        //         }
        //     }
        //
        //     trx.batch([
        //         trx.none("DELETE FROM " + this.id + ".map" + this.field + " WHERE id IN (" + stmt + ")", ids),
        //         trx.none("DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id IN (" + stmt + ")", ids),
        //         trx.none("DELETE FROM " + this.id + ".tag" + this.field + " WHERE id IN (" + stmt + ")", ids),
        //         trx.none("DELETE FROM " + this.id + ".reg WHERE id IN (" + stmt + ")", ids)
        //     ]);
        //
        //     // trx.none(
        //     //     "DELETE FROM " + this.id + ".map" + this.field + " WHERE id IN (" + stmt + ");" +
        //     //     "DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id IN (" + stmt + ");" +
        //     //     "DELETE FROM " + this.id + ".tag" + this.field + " WHERE id IN (" + stmt + ");" +
        //     //     "DELETE FROM " + this.id + ".reg WHERE id IN (" + stmt + ");", ids
        //     // );
        //
        //     if(next) ids = next;
        //     else break;
        // }

        ids = [ids];
        return trx.batch([
            trx.none({ text: "DELETE FROM " + this.id + ".map" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids),
            trx.none({ text: "DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids),
            trx.none({ text: "DELETE FROM " + this.id + ".tag" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids),
            trx.none({ text: "DELETE FROM " + this.id + ".reg WHERE id = ANY ($1)", rowMode: "array" }, ids)
        ]);

        // ids = [ids];
        // return trx.batch([
        //     trx.none("DELETE FROM " + this.id + ".map" + this.field + " WHERE id = ANY ($1)", ids),
        //     trx.none("DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id = ANY ($1)", ids),
        //     trx.none("DELETE FROM " + this.id + ".tag" + this.field + " WHERE id = ANY ($1)", ids),
        //     trx.none("DELETE FROM " + this.id + ".reg WHERE id = ANY ($1)", ids)
        // ]);

        // return trx.batch([
        //     trx.none("DELETE FROM " + this.id + ".map" + this.field + " WHERE id IN ($1:csv)", [ids]),
        //     trx.none("DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id IN ($1:csv)", [ids]),
        //     trx.none("DELETE FROM " + this.id + ".tag" + this.field + " WHERE id IN ($1:csv)", [ids]),
        //     trx.none("DELETE FROM " + this.id + ".reg WHERE id IN ($1:csv)", [ids])
        // ]);

        // const type = self.type === "text" ? "text" : "int";
        // return trx.batch([
        //     trx.none("DELETE FROM " + this.id + ".map" + self.field + " WHERE id = ANY($1::" + type + "[])", [ids]),
        //     trx.none("DELETE FROM " + this.id + ".ctx" + self.field + " WHERE id = ANY($1::" + type + "[])", [ids]),
        //     trx.none("DELETE FROM " + this.id + ".reg WHERE id = ANY($1::" + type + "[])", [ids])
        // ]);

        // return trx.batch([
        //     trx.none("DELETE FROM " + this.id + ".map" + self.field + " WHERE id = ANY($1)", [ids]),
        //     trx.none("DELETE FROM " + this.id + ".ctx" + self.field + " WHERE id = ANY($1)", [ids]),
        //     trx.none("DELETE FROM " + this.id + ".reg WHERE id = ANY($1)", [ids])
        // ]);
    });
};

// if(this.type === "int" && typeof ids[0] === "string"){
//     ids = ids.map(item => parseInt(item, 10));
// }
// if(this.type === "bigint" && typeof ids[0] === "string"){
//     ids = ids.map(item => BigInt(item));
// }
// if(this.type === "string" && typeof ids[0] === "number"){
//     ids = ids.map(item => item + "");
// }
// this.type !== "string" && checkMigration.call(this, ids[0]);

// function checkMigration(id){
//     if(this.type !== "string"){
//         if(typeof id === "object"){
//             id = id[0];
//         }
//         if(typeof id === "string"){
//             this.type = "string";
//             return upgradeTextId.call(this);
//         }
//         if(this.type !== "bigint"){
//             if(id > 2 ** 31 - 1){
//                 this.type = "bigint";
//                 return upgradeBigIntId.call(this);
//             }
//         }
//     }
// }
//
// function upgradeTextId(){
//     return this.db.none(`
//         ALTER TABLE ${this.id}.map${this.field}
//             ALTER COLUMN id type varchar(128)
//                 USING id::text;
//         ALTER TABLE ${this.id}.ctx${this.field}
//             ALTER COLUMN id type varchar(128)
//                 USING id::text;
//         ALTER TABLE ${this.id}.tag${this.field}
//             ALTER COLUMN id type varchar(128)
//                 USING id::text;
//         ALTER TABLE ${this.id}.reg
//             ALTER COLUMN id type varchar(128)
//                 USING id::text;
//     `);
// }
//
// function upgradeBigIntId(){
//     return this.db.none(`
//         ALTER TABLE ${this.id}.map${this.field}
//             ALTER COLUMN id type bigint
//                 USING id::bigint;
//         ALTER TABLE ${this.id}.ctx${this.field}
//             ALTER COLUMN id type bigint
//                 USING id::bigint;
//         ALTER TABLE ${this.id}.tag${this.field}
//             ALTER COLUMN id type bigint
//                 USING id::bigint;
//         ALTER TABLE ${this.id}.reg
//             ALTER COLUMN id type bigint
//                 USING id::bigint;
//     `);
// }
