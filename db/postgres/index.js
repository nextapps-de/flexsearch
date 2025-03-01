import pg_promise from "pg-promise";
const defaults = {
    schema: "flexsearch",
    user: "postgres",
    pass: "postgres",
    name: "postgres",
    host: "localhost",
    port: "5432"
};

const pgp = pg_promise({ noWarnings: true });
const VERSION = 1;
const MAXIMUM_QUERY_VARS = 16000;
const fields = ["map", "ctx", "reg", "tag", "cfg"];
import StorageInterface from "../interface.js";
import Document from "../../document.js";
import { concat, toArray } from "../../common.js";

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

let DB;

/**
 * @constructor
 * @implements StorageInterface
 */

export default function PostgresDB(name, config = {}){
    if(!(this instanceof PostgresDB)){
        return new PostgresDB(name, config);
    }
    if(typeof name === "object"){
        name = name.name;
        config = name;
    }
    if(!name){
        console.info("Default storage space was used, because a name was not passed.");
    }
    //field = "Test-456";
    this.id = (config.schema ? sanitize(config.schema) : defaults.schema) + (name ? "_" + sanitize(name) : "");
    this.field = config.field ? "_" + sanitize(config.field) : "";
    this.type = "int";
    this.db = DB = config.db || null;
    this.trx = false;
    // todo:
    //this.type = config && config.type ? types[config.type.toLowerCase()] : "String";
    //if(!this.type) throw new Error("Unknown type of ID '" + config.type + "'");
    Object.assign(defaults, config);
    this.db && delete defaults.db;
};

// PostgresDB.mount = function(flexsearch){
//     return new this().mount(flexsearch);
// };

PostgresDB.prototype.mount = function(flexsearch){
    if(flexsearch instanceof Document){
        return flexsearch.mount(this);
    }
    flexsearch.db = this;
    return this.open();
};

PostgresDB.prototype.open = async function(){

    if(!this.db) {
        // todo enable warnings and share database instance
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
    if(!exist || !exist.exist){
        await this.db.none(`CREATE SCHEMA IF NOT EXISTS ${ this.id };`);
    }

    for(let i = 0; i < fields.length; i++){
        const exist = await this.db.oneOrNone(`
            SELECT EXISTS (
                SELECT 1 FROM pg_tables
                WHERE schemaname = '${this.id}' AND tablename = '${fields[i] + (fields[i] !== "reg" ? this.field : "")}'
            );
        `);
        if(exist && exist.exist) continue;

        switch(fields[i]){
            case "map":
                await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.map${this.field}(
                        key varchar(128) NOT NULL,
                        res smallint     NOT NULL,
                        id  integer      NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS map_index
                        ON ${this.id}.map${this.field} (key);
                    CREATE INDEX IF NOT EXISTS map_id
                        ON ${this.id}.map${this.field} (id);
                `);
                break;

            case "ctx":
                await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.ctx${this.field}(
                        ctx varchar(128) NOT NULL,
                        key varchar(128) NOT NULL,
                        res smallint     NOT NULL,
                        id  integer      NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS ctx_index
                        ON ${this.id}.ctx${this.field} (ctx, key);
                    CREATE INDEX IF NOT EXISTS ctx_id
                        ON ${this.id}.ctx${this.field} (id);
                `);
                break;

            case "tag":
                await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.tag${this.field}(
                        tag varchar(128) NOT NULL,
                        id  integer      NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS tag_index
                        ON ${this.id}.tag${this.field} (tag);
                    CREATE INDEX IF NOT EXISTS tag_id
                        ON ${this.id}.tag${this.field} (id);
                `);
                break;

            case "reg":
                await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.reg(
                        id  integer NOT NULL,
                        doc text DEFAULT NULL
                    );
                    CREATE INDEX IF NOT EXISTS reg_id
                        ON ${this.id}.reg (id);
                `);
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
    this.db.close && this.db.close();
    this.db = DB = null;
};

PostgresDB.prototype.destroy = async function(){
    await this.db.none(`
        DROP TABLE IF EXISTS ${this.id}.map${this.field};
        DROP TABLE IF EXISTS ${this.id}.ctx${this.field};
        DROP TABLE IF EXISTS ${this.id}.tag${this.field};
        DROP TABLE IF EXISTS ${this.id}.cfg${this.field};
        DROP TABLE IF EXISTS ${this.id}.reg;
        /*DROP SCHEMA ${this.id} CASCADE;*/
    `);
    this.close();
};

PostgresDB.prototype.clear = function(){
    return this.transaction(function(trx){
        return trx.batch(fields.map(
            field => trx.none(`TRUNCATE TABLE ${this.id}.${field + (field !== "reg" ? this.field : "")};`)
        ));
    });
};

function create_result(rows, resolve, enrich){
    if(resolve){
        if(!enrich) for(let i = 0; i < rows.length; i++){
            rows[i] = rows[i].id
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

PostgresDB.prototype.get = function(key, ctx, limit = 0, offset = 0, resolve = true, enrich = false){
    let rows;
    if(ctx){
        const table = this.id + ".ctx" + this.field;
        rows = this.db.any(`
            SELECT ${ table }.id 
                   ${ resolve ? "" : ", res" }
                   ${ enrich ? ", doc" : "" }
            FROM ${ table }
            ${ enrich ? `
                LEFT JOIN ${ this.id }.reg ON ${ this.id }.reg.id = ${ table }.id
            ` : "" }  
            WHERE ctx = $1 AND key = $2
            ORDER BY res
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }`,
            [ctx, key]
        );
    }
    else{
        const table = this.id + ".map" + this.field;
        rows = this.db.any(`
            SELECT ${ table }.id
                   ${ resolve ? "" : ", res" }
                   ${ enrich ? ", doc" : "" }
            FROM ${ table }
            ${ enrich ? `
                LEFT JOIN ${ this.id }.reg ON ${ this.id }.reg.id = ${ table }.id
            ` : "" }
            WHERE key = $1
            ORDER BY res
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }`,
            [key]
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
    return this.db.oneOrNone("SELECT EXISTS(SELECT 1 FROM " + this.id + ".reg WHERE id = $1)", [id]);
};

PostgresDB.prototype.search = function(flexsearch, query, limit = 100, offset = 0, suggest = false, resolve = true, enrich = false){

    let rows;

    if(query.length > 1 && flexsearch.depth){

        let stmt = "";
        let params = [];
        let keyword = query[0];
        let term;

        // variant new

        for(let i = 1, count = 1; i < query.length; i++){
            term = query[i];
            const swap = flexsearch.bidirectional && (term > keyword);
            stmt += (stmt ? " OR " : "") + `(ctx = $${ count++ } AND key = $${ count++ })`
            params.push(swap ? term : keyword, swap ? keyword : term);
            keyword = term;
        }

        rows = this.db.any(`
            SELECT r.id 
                   ${ resolve ? "" : ", res" }
                   ${ enrich ? ", doc" : "" }
            FROM (
                SELECT id, count(*) as count,
                       ${ suggest ? "SUM" : "MIN" }(res) as res
                FROM ${ this.id }.ctx${ this.field }
                WHERE ${ stmt }
                GROUP BY id
                ORDER BY ${ suggest ? "count DESC, res" : "res" }
            ) as r
            ${ enrich ? `
                LEFT JOIN ${ this.id }.reg ON ${ this.id }.reg.id = r.id
            ` : "" } 
            ${ suggest ? "" : "WHERE count = " + (query.length - 1) }
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }
        `, params);

        // variant 1

        // for(let i = 1, count = 1; i < query.length; i++){
        //     stmt += (stmt ? " UNION " : "") + `
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
        //         FROM (${stmt}) as t
        //         GROUP BY id
        //         ORDER BY ${suggest ? "count DESC, res" : "res"}
        //         LIMIT ${limit}
        //         OFFSET ${offset}
        //     ) as r
        //     ${suggest ? "" : "WHERE count = " + (query.length - 1)}
        // `, params);

    }
    else{

        let stmt = "";
        for(let i = 0, count = 1; i < query.length; i++){
            stmt += (stmt ? "," : "") + "$" + count++;
        }

        rows = this.db.any(`
            SELECT r.id 
                   ${ resolve ? "" : ", res" }   
                   ${ enrich ? ", doc" : "" }
            FROM (
                SELECT id, count(*) as count,
                       ${ suggest ? "SUM" : "MIN" }(res) as res
                FROM ${ this.id }.map${ this.field }
                WHERE key ${ query.length > 1 ? "IN (" + stmt + ")" : "= " + stmt }
                GROUP BY id
                ORDER BY ${ suggest ? "count DESC, res" : "res" }
            ) as r
            ${ enrich ? `
                LEFT JOIN ${ this.id }.reg ON ${ this.id }.reg.id = r.id
            ` : "" }   
            ${ suggest ? "" : "WHERE count = " + query.length }
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }
        `, query);

        // variant 1
        // for(let i = 1; i <= query.length; i++){
        //     stmt += (stmt ? " UNION " : "") + `
        //         SELECT id, res
        //         FROM ${ this.id }.map${ this.field }
        //         WHERE key = $${i}
        //     `;
        // }
        // rows = await db.any(`
        //     SELECT id, res
        //     FROM (
        //         SELECT id, ${suggest ? "SUM" : "MIN"}(res) as res, count(*) as count
        //         FROM (${stmt}) as t
        //         GROUP BY id
        //         ORDER BY ${suggest ? "count DESC, res" : "res"}
        //         LIMIT ${limit}
        //         OFFSET ${offset}
        //     ) as r
        //     ${ suggest ? "" : "WHERE count = " + query.length }
        // `, query);

        // variant 2
        // for(let i = 1; i <= query.length; i++){
        //     stmt += (stmt ? " AND EXISTS " : "") + `(SELECT FROM ${this.id}.map${this.field} as d WHERE d.id = t.id AND d.key = $` + i + ")";
        // }
        // rows = await db.any(`
        //     SELECT t.id, min(t.res)
        //     FROM ${this.id}.map${this.field} AS t
        //     WHERE EXISTS ${stmt}
        //     GROUP BY t.id
        //     LIMIT ${limit || 100}
        //     OFFSET ${offset || 0}
        // `, query);

        // variant 3
        // for(let i = 1; i <= query.length; i++){
        //     stmt += (stmt ? " INTERSECT " : "") + `SELECT id FROM ${this.id}.map${this.field} WHERE key = $` + i;
        // }
        // rows = await db.any(`
        //     WITH filtering (id) AS(${stmt})
        //     SELECT t.id, min(t.res)
        //     FROM ${this.id}.map${this.field} AS t
        //     JOIN filtering USING (id)
        //     GROUP BY t.id
        //     LIMIT ${limit || 100}
        //     OFFSET ${offset || 0}
        // `, query);

        // variant 4
        // for(let i = 1; i <= query.length; i++){
        //     stmt += (stmt ? " INTERSECT " : "") + `SELECT id FROM ${this.id}.map${this.field} WHERE key = $` + i;
        // }
        // rows = await db.any(`
        //     SELECT id, min(res)
        //     FROM ${this.id}.map${this.field}
        //     WHERE id IN (${stmt})
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

PostgresDB.prototype.transaction = function(task){

    if(this.trx){
        return task.call(this, this.trx);
    }

    const self = this;
    return this.db.tx(async function(trx){
        self.trx = trx;
        await task.call(self, trx);
        self.trx = null;
    });
};

PostgresDB.prototype.commit = async function(flexsearch, _replace, _append){

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
                tasks = tasks.concat(toArray(flexsearch.reg));
            }
            tasks.length && await this.remove(tasks);
        }
    }

    if(!flexsearch.reg.size){
        return;
    }

    await this.transaction(async function(trx){

        let stmt, data;

        if(flexsearch.store){
            stmt = new pgp.helpers.ColumnSet(["id", "doc"],{
                table: this.id + ".reg"
            });
            data = [];
            for(const item of flexsearch.store.entries()){
                const id = item[0];
                const doc = item[1];
                const migration = checkMigration.call(this, id);
                migration && await migration;
                data.push({ id, doc: doc && JSON.stringify(doc) });
            }
            if(data.length){
                let insert = pgp.helpers.insert(data, stmt);
                trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'));
            }
        }
        else if(!flexsearch.bypass){
            stmt = new pgp.helpers.ColumnSet(["id"],{
                table: this.id + ".reg"
            });
            data = [];
            for(const id of flexsearch.reg.keys()){
                const migration = checkMigration.call(this, id);
                migration && await migration;
                data.push({ id });
            }
            // data = Object.keys(flexsearch.reg).map(id => {
            //     return { id: id }
            // });
            //stmt = db.prepare("INSERT INTO reg (id) VALUES (?)");
            //stmt.finalize();
            if(data.length){
                let insert = pgp.helpers.insert(data, stmt);
                trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'));
            }
        }

        stmt = new pgp.helpers.ColumnSet(["key", "res", "id"],{
            table: this.id + ".map" + this.field
        });
        data = [];
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
                    }
                }
            }
        }
        if(data.length){
            let insert = pgp.helpers.insert(data, stmt);
            trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'));
        }

        stmt = new pgp.helpers.ColumnSet(["ctx", "key", "res", "id"],{
            table: this.id + ".ctx" + this.field
        });
        data = [];
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
                        }
                    }
                }
            }
        }
        //stmt.finalize();
        if(data.length){
            let insert = pgp.helpers.insert(data, stmt);
            trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'));
        }

        if(flexsearch.tag){
            stmt = new pgp.helpers.ColumnSet(["tag", "id"],{
                table: this.id + ".tag" + this.field
            });
            data = [];
            for(const item of flexsearch.tag){
                const tag = item[0];
                const ids = item[1];
                if(!ids.length) continue;
                for(let j = 0; j < ids.length; j++){
                    data.push({ tag, id: ids[j] });
                }
            }
            if(data.length){
                let insert = pgp.helpers.insert(data, stmt);
                trx.none(insert.replace(/^(insert into )"([^"]+)"/, '$1 $2'));
            }
        }

        trx.none("INSERT INTO " + this.id + ".cfg" + this.field + " (cfg) VALUES ($1)", [
            JSON.stringify({
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
        ]);
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

PostgresDB.prototype.remove = function(ids){

    if(typeof ids !== "object"){
        ids = [ids];
    }
    if(!ids.length){
        return;
    }
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

    return this.transaction(async function(trx){

        let migration;
        let stmt = "";
        let chunk = 0;
        let next;
        for(let i = 1; i <= ids.length; i++) {
            stmt += (stmt ? "," : "") + "$" + i; // + "::text";
            if(this.type !== "string"){
                migration = checkMigration.call(this, ids[i]);
                migration && await migration;
            }
            // maximum count of variables supported
            if(++chunk === MAXIMUM_QUERY_VARS){
                next = ids.slice(MAXIMUM_QUERY_VARS);
                break;
            }
        }

        const self = this;
        return trx.batch([
            trx.none("DELETE FROM " + this.id + ".map" + this.field + " WHERE id IN (" + stmt + ")", ids),
            trx.none("DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id IN (" + stmt + ")", ids),
            trx.none("DELETE FROM " + this.id + ".tag" + this.field + " WHERE id IN (" + stmt + ")", ids),
            trx.none("DELETE FROM " + this.id + ".reg WHERE id IN (" + stmt + ")", ids)
        ]).then(function(res){
            return next
                ? self.remove(next)
                : res;
        });

        // return trx.batch([
        //     trx.none("DELETE FROM " + this.id + ".map" + self.field + " WHERE id IN ($1:csv)", [ids]),
        //     trx.none("DELETE FROM " + this.id + ".ctx" + self.field + " WHERE id IN ($1:csv)", [ids]),
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

function checkMigration(id){
    if(this.type !== "string"){
        if(typeof id === "object"){
            id = id[0];
        }
        if(typeof id === "string"){
            this.type = "string";
            return migrateTextId.call(this);
        }
        if(this.type !== "bigint"){
            if(id > 2 ** 31 - 1){
                this.type = "bigint";
                return migrateBigIntId.call(this);
            }
        }
    }
}

function migrateTextId(){
    return this.db.none(`
        ALTER TABLE ${this.id}.map${this.field}
            ALTER COLUMN id type varchar(128) 
                USING id::text;
        ALTER TABLE ${this.id}.ctx${this.field}
            ALTER COLUMN id type varchar(128)
                USING id::text;
        ALTER TABLE ${this.id}.tag${this.field}
            ALTER COLUMN id type varchar(128) 
                USING id::text;
        ALTER TABLE ${this.id}.reg
            ALTER COLUMN id type varchar(128) 
                USING id::text;
    `);
}

function migrateBigIntId(){
    return this.db.none(`
        ALTER TABLE ${this.id}.map${this.field}
            ALTER COLUMN id type bigint 
                USING id::bigint;
        ALTER TABLE ${this.id}.ctx${this.field}
            ALTER COLUMN id type bigint 
                USING id::bigint;
        ALTER TABLE ${this.id}.tag${this.field}
            ALTER COLUMN id type bigint 
                USING id::bigint;
        ALTER TABLE ${this.id}.reg
            ALTER COLUMN id type bigint 
                USING id::bigint;
    `);
}
