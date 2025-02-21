import pg_promise from "pg-promise";
const config = {
    schema: "flexsearch",
    user: "postgres",
    pass: "postgres",
    name: "postgres",
    host: "localhost",
    port: "5432"
};

const pgp = pg_promise();
const VERSION = 1;
const fields = ["map", "ctx", "reg", "cfg"];
import StorageInterface from "../interface.js";

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

/**
 * @constructor
 * @implements StorageInterface
 */

export default function PostgresDB(sid, config){
    //field = "Test-456";
    this.id = config && config.schema + (sid ? "_" + sanitize(sid) : "");
    this.field = config && config.field ? "_" + sanitize(config.field) : "";
    this.type = "int";
    this.db = null;
    this.trx = false;
};

PostgresDB.mount = function(flexsearch){
    return new this().mount(flexsearch);
};

PostgresDB.prototype.mount = function(flexsearch){
    flexsearch.db = this;
    return this.open();
};

PostgresDB.prototype.open = async function(){

    if(this.db) return this.db;
    const self = this;
    const db = this.db = pgp(`postgres://${config.user}:${encodeURIComponent(config.pass)}@${config.host}:${config.port}/${config.name}`);

    const exist = await db.oneOrNone(`
        SELECT EXISTS (
            SELECT 1 
            FROM information_schema.schemata 
            WHERE schema_name = '${this.id}'
        );
    `);
    if(!exist || !exist.exist){
        await db.none(`CREATE SCHEMA IF NOT EXISTS ${this.id};`);
    }

    for(let i = 0; i < fields.length; i++){
        const exist = await db.oneOrNone(`
            SELECT EXISTS (
                SELECT 1 FROM pg_tables
                WHERE schemaname = '${this.id}' AND tablename = '${fields[i] + (fields[i] !== "reg" ? self.field : "")}'
            );
        `);
        if(exist && exist.exist) continue;

        switch(fields[i]){
            case "map":
                await db.none(`
                    create table if not exists ${this.id}.map${self.field}(
                        key varchar(128) not null,
                        res smallint     not null,
                        id  integer      not null,
                        constraint map_pk
                            unique (key, id)
                    );
                    create index if not exists map_id_index
                        on ${this.id}.map${self.field} (id);
                `);
                break;

            case "ctx":
                await db.none(`
                    create table if not exists ${this.id}.ctx${self.field}(
                        ctx varchar(128) not null,
                        key varchar(128) not null,
                        res smallint     not null,
                        id  integer      not null,
                        constraint ctx_pk
                            unique (ctx, key, id)
                    );
                    create index if not exists ctx_id_index
                        on ${this.id}.ctx${self.field} (id);
                `);
                break;

            case "reg":
                await db.none(`
                    create table if not exists ${this.id}.reg(
                        id integer not null
                            constraint reg_pk
                                primary key
                    );
                `);
                break;

            case "cfg":
                await db.none(`
                    create table if not exists ${this.id}.cfg${self.field}(
                        cfg text not null
                    );
                `);
                break;
        }
    }

    return db;
};

PostgresDB.prototype.close = function(){
    this.db.close();
    this.db = null;
    return this;
};

PostgresDB.prototype.destroy = async function(){
    await this.db.none(`
        DROP TABLE ${this.id}.map${this.field};
        DROP TABLE ${this.id}.ctx${this.field};
        DROP TABLE ${this.id}.cfg${this.field};
        DROP TABLE ${this.id}.reg;
    `);
    return this.close();
};

PostgresDB.prototype.clear = function(){
    return this.transaction(function(trx){
        return trx.batch(fields.map(
            field => trx.none(`TRUNCATE TABLE ${this.id}.${field + (field !== "reg" ? this.field : "")};`)
        ));
    });
};

PostgresDB.prototype.get = async function(ref, key, ctx, limit, offset){
    const self = this;
    const db = this.db;
    let rows;
    let stmt = "";

    if(limit){
        stmt += " LIMIT " + limit;
        if(offset){
            stmt += " OFFSET " + offset
        }
    }

    switch(ref){
        case "map":
            rows = await db.any(`SELECT res, id FROM ${this.id}.${ref + self.field} WHERE key = $1` + stmt, [key]);
            // fallthrough
        case "ctx":
            rows = rows || await db.any(`SELECT res, id FROM ${this.id}.${ref + self.field} WHERE ctx = $1 AND key = $2` + stmt, [ctx, key]);
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
            return db.oneOrNone(`SELECT 1 FROM ${this.id}.reg WHERE id = $1`, [key]);
        case "cfg":
            const cfg = await db.oneOrNone(`SELECT cfg FROM ${this.id}.cfg${self.field}`);
            return cfg ? JSON.parse(cfg) : null;
    }
};

PostgresDB.prototype.has = function(ref, key, ctx){
    const db = this.db
    switch(ref){
        case "map":
            return db.oneOrNone("SELECT 1 FROM " + this.id + "." + ref + self.field + " WHERE key = $1", [key]);
        case "ctx":
            return db.oneOrNone("SELECT 1 FROM " + this.id + "." + ref + self.field + " WHERE ctx = $1 AND key = $2", [ctx, key]);
        case "cfg":
            return db.oneOrNone("SELECT 1 FROM " + this.id + "." + ref + self.field + " WHERE cfg IS NOT NULL");
        case "reg":
            return db.oneOrNone("SELECT 1 FROM " + this.id + "." + ref + " WHERE id = $1", [key]);
    }
};

PostgresDB.prototype.search = async function(flexsearch, query, suggest, limit = 100, offset = 0){

    const db = this.db;
    let rows;
    let stmt = "";

    if(query.length > 1 && flexsearch.depth){

        let params = [];
        let keyword = query[0];
        let term;

        for(let i = 1, count = 1; i < query.length; i++){
            stmt += (stmt ? " UNION " : "") + `
                SELECT id, res 
                FROM ${this.id}.ctx${this.field}
                WHERE ctx = $${count++} AND key = $${count++}
            `;
            term = query[i];
            const swap = flexsearch.bidirectional && (term > keyword);
            params.push(
                swap ? term : keyword,
                swap ? keyword : term
            );
            keyword = term;
        }

        rows = await db.any(`
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
        `, params);
    }
    else{

        // variant 1
        for(let i = 1; i <= query.length; i++){
            stmt += (stmt ? " UNION " : "") + `
                SELECT id, res
                FROM ${ this.id }.map${ this.field }
                WHERE key = $${i}
            `;
        }
        rows = await db.any(`
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
        `, query);

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
                tasks = tasks.concat([...flexsearch.reg.keys()]);
            }
            tasks.length && await this.remove(tasks);
        }
    }

    if(!flexsearch.reg.size){
        return;
    }

    await this.transaction(async function(trx){

        let stmt = new pgp.helpers.ColumnSet(["id"],{
            table: this.id + ".reg"
        });
        let data = [];
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
        for(let i = 1; i <= ids.length; i++) {
            stmt += (stmt ? "," : "") + "$" + i; // + "::text";
            if(this.type !== "string"){
                migration = checkMigration.call(this, ids[i]);
                migration && await migration;
            }
        }

        return trx.batch([
            trx.none("DELETE FROM " + this.id + ".map" + this.field + " WHERE id IN (" + stmt + ")", ids),
            trx.none("DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id IN (" + stmt + ")", ids),
            trx.none("DELETE FROM " + this.id + ".reg WHERE id IN (" + stmt + ")", ids)
        ]);

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
        ALTER TABLE ${this.id}.reg
            ALTER COLUMN id type bigint 
                  USING id::bigint;
    `);
}
