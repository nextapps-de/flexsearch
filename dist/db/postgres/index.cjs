'use strict';

var pg_promise = require('pg-promise');

/**
 * @param {*} value
 * @param {*} default_value
 * @param {*=} merge_value
 * @return {*}
 */

function concat(arrays){
    return [].concat.apply([], arrays);
}

const defaults = {
    schema: "flexsearch",
    user: "postgres",
    pass: "postgres",
    name: "postgres",
    host: "localhost",
    port: "5432"
};

const pgp = pg_promise();
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

let DB;

/**
 * @constructor
 * @implements StorageInterface
 */

function PostgresDB(name, config = {}){
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
}
PostgresDB.prototype.mount = function(flexsearch){
   
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
   
    this.db =  null;
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
            else {
                rows[i] = rows[i].id;
            }
        }
        return rows;
    }
    else {
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
    else {
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
       

        for(let i = 1; i < query.length; i++){
            term = query[i];
            const swap = flexsearch.bidirectional && (term > keyword);
            where += (where ? " OR " : "") + `(ctx = $${ count++ } AND key = $${ count++ })`;
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
                       ${ suggest ? "SUM" : "SUM"  }(res) as res
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

       

       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       

    }
    else {

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
                       ${ suggest ? "SUM" : "SUM"  }(res) as res
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

       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       

       
       
       
       
       
       
       
       
       
       
       
       

       
       
       
       
       
       
       
       
       
       
       
       
       

       
       
       
       
       
       
       
       
       
       
       
       
    }

    return rows.then(function(rows){
        return create_result(rows, resolve, enrich);
    });
};

PostgresDB.prototype.info = function(){
   
};


PostgresDB.prototype.transaction = function(task){
    const self = this;
    return this.db.tx(function(trx){
        return task.call(self, trx);
    });
};


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
        else if(task["ins"]);
    }

    if(removals.length){
        await this.remove(removals);
    }

    if(!flexsearch.reg.size){
        return;
    }

    await this.transaction(function(trx){

        const batch = [];

       

        if(flexsearch.store){
            let data = [];
            let stmt = new pgp.helpers.ColumnSet(["id", "doc"],{
                table: this.id + ".reg"
            });
            for(const item of flexsearch.store.entries()){
                const id = item[0];
                const doc = item[1];
               
               
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
           
           
           
           
           
           
           
           
           
           
           
        }

       

        else if(!flexsearch.bypass){
            let data = [];
            let stmt = new pgp.helpers.ColumnSet(["id"],{
                table: this.id + ".reg"
            });
            for(const id of flexsearch.reg.keys()){
               
               
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
                       
                       
                       
                        for(let j = 0; j < ids.length; j++){
                           
                           
                           
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
                           
                           
                            for(let j = 0; j < ids.length; j++){
                               
                               
                               
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

   
   
   
   
   
   
   

   
   
   
   
   
   
   

    return this.transaction(function(trx){

       

       
       
       
       
       

       
       
       
       
       
       

       
       
       
       
       
       

       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       

        ids = [ids];
        return trx.batch([
            trx.none({ text: "DELETE FROM " + this.id + ".map" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids),
            trx.none({ text: "DELETE FROM " + this.id + ".ctx" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids),
            trx.none({ text: "DELETE FROM " + this.id + ".tag" + this.field + " WHERE id = ANY ($1)", rowMode: "array" }, ids),
            trx.none({ text: "DELETE FROM " + this.id + ".reg WHERE id = ANY ($1)", rowMode: "array" }, ids)
        ]);

       
       
       
       
       
       
       

       
       
       
       
       
       

       
       
       
       
       
       

       
       
       
       
       
    });
};

module.exports = PostgresDB;
