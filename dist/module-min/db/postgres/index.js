import pg_promise from"pg-promise";import StorageInterface from"../interface.js";import{concat,toArray}from"../../common.js";const defaults={schema:"flexsearch",user:"postgres",pass:"postgres",name:"postgres",host:"localhost",port:"5432"},pgp=pg_promise(),VERSION=1,MAXIMUM_QUERY_VARS=16000,fields=["map","ctx","reg","tag","cfg"],types={text:"text",char:"text",varchar:"text",string:"text",number:"int",numeric:"int",integer:"int",smallint:"int",tinyint:"int",mediumint:"int",int:"int",int8:"int",uint8:"int",int16:"int",uint16:"int",int32:"int",uint32:"bigint",int64:"bigint",bigint:"bigint"};function sanitize(a){return a.toLowerCase().replace(/[^a-z0-9_]/g,"")}let DB,TRX;export default function PostgresDB(a,b={}){if(!this||this.constructor!==PostgresDB)return new PostgresDB(a,b);if("object"==typeof a&&(b=a,a=b.name),a||console.info("Default storage space was used, because a name was not passed."),this.id=(b.schema?sanitize(b.schema):defaults.schema)+(a?"_"+sanitize(a):""),this.field=b.field?"_"+sanitize(b.field):"",this.type=b.type?types[b.type.toLowerCase()]:"text",this.support_tag_search=!0,!this.type)throw new Error("Unknown type of ID '"+b.type+"'");this.db=DB||(DB=b.db||null),Object.assign(defaults,b),this.db&&delete defaults.db}PostgresDB.prototype.mount=function(a){return a.index?a.mount(this):(a.db=this,this.open())},PostgresDB.prototype.open=async function(){this.db||(this.db=DB||(DB=pgp(`postgres://${defaults.user}:${encodeURIComponent(defaults.pass)}@${defaults.host}:${defaults.port}/${defaults.name}`)));const a=await this.db.oneOrNone(`
        SELECT EXISTS (
            SELECT 1 
            FROM information_schema.schemata 
            WHERE schema_name = '${this.id}'
        );
    `);a&&a.exists||(await this.db.none(`CREATE SCHEMA IF NOT EXISTS ${this.id};`));for(let a=0;a<fields.length;a++){const b=await this.db.oneOrNone(`
            SELECT EXISTS (
                SELECT 1 FROM pg_tables
                WHERE schemaname = '${this.id}' AND tablename = '${fields[a]+("reg"===fields[a]?"":this.field)}'
            );
        `);if(b&&b.exists)continue;const c="text"===this.type?"varchar(128)":this.type;switch(fields[a]){case"map":await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.map${this.field}(
                        key varchar(128) NOT NULL,
                        res smallint     NOT NULL,
                        id  ${c} NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS ${this.id}_map_index${this.field}
                        ON ${this.id}.map${this.field} (key);
                    CREATE INDEX IF NOT EXISTS ${this.id}_map_id${this.field}
                        ON ${this.id}.map${this.field} (id);
                `);break;case"ctx":await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.ctx${this.field}(
                        ctx varchar(128) NOT NULL,
                        key varchar(128) NOT NULL,
                        res smallint     NOT NULL,
                        id  ${c} NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS ${this.id}_ctx_index${this.field}
                        ON ${this.id}.ctx${this.field} (ctx, key);
                    CREATE INDEX IF NOT EXISTS ${this.id}_ctx_id${this.field}
                        ON ${this.id}.ctx${this.field} (id);
                `);break;case"tag":await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.tag${this.field}(
                        tag varchar(128) NOT NULL,
                        id  ${c} NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS ${this.id}_tag_index${this.field}
                        ON ${this.id}.tag${this.field} (tag);
                    CREATE INDEX IF NOT EXISTS ${this.id}_tag_id${this.field}
                        ON ${this.id}.tag${this.field} (id);
                `);break;case"reg":await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.reg(
                        id ${c} NOT NULL
                            CONSTRAINT ${this.id}_reg_pk
                                PRIMARY KEY,
                        doc text DEFAULT NULL
                    );
                `).catch(()=>{});break;case"cfg":await this.db.none(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.cfg${this.field}(
                        cfg text NOT NULL
                    );
                `);}}return this.db},PostgresDB.prototype.close=function(){return this.db=null,this},PostgresDB.prototype.destroy=function(){return this.db.none(`
        DROP TABLE IF EXISTS ${this.id}.map${this.field};
        DROP TABLE IF EXISTS ${this.id}.ctx${this.field};
        DROP TABLE IF EXISTS ${this.id}.tag${this.field};
        DROP TABLE IF EXISTS ${this.id}.cfg${this.field};
        DROP TABLE IF EXISTS ${this.id}.reg;
    `)},PostgresDB.prototype.clear=function(){return this.db.none(`
        TRUNCATE TABLE ${this.id}.map${this.field};
        TRUNCATE TABLE ${this.id}.ctx${this.field};
        TRUNCATE TABLE ${this.id}.tag${this.field};
        TRUNCATE TABLE ${this.id}.cfg${this.field};
        TRUNCATE TABLE ${this.id}.reg;
    `)};function create_result(a,b,c){if(b){for(let b=0;b<a.length;b++)c?a[b].doc&&(a[b].doc=JSON.parse(a[b].doc)):a[b]=a[b].id;return a}else{const b=[];for(let d,e=0;e<a.length;e++)d=a[e],b[d.res]||(b[d.res]=[]),b[d.res].push(c?d:d.id);return b}}PostgresDB.prototype.get=function(a,b,c=0,d=0,e=!0,f=!1,g){let h,j="",k=b?[b,a]:[a],l=this.id+(b?".ctx":".map")+this.field;if(g)for(let a=0,b=k.length+1;a<g.length;a+=2)j+=` AND ${l}.id IN (SELECT id FROM ${this.id}.tag_${sanitize(g[a])} WHERE tag = $${b++})`,k.push(g[a+1]);return h=b?this.db.any(`
            SELECT ${l}.id 
                   ${e?"":", res"}
                   ${f?", doc":""}
            FROM ${l}
            ${f?`
                LEFT JOIN ${this.id}.reg ON ${this.id}.reg.id = ${l}.id
            `:""}  
            WHERE ctx = $1 AND key = $2 ${j}
            ORDER BY res
            ${c?"LIMIT "+c:""}
            ${d?"OFFSET "+d:""}`,k):this.db.any(`
            SELECT ${l}.id
                   ${e?"":", res"}
                   ${f?", doc":""}
            FROM ${l}
            ${f?`
                LEFT JOIN ${this.id}.reg ON ${this.id}.reg.id = ${l}.id
            `:""}
            WHERE key = $1 ${j}
            ORDER BY res
            ${c?"LIMIT "+c:""}
            ${d?"OFFSET "+d:""}`,k),h.then(function(a){return create_result(a,e,f)})},PostgresDB.prototype.tag=function(a,b=0,c=0,d=!1){const e=this.id+".tag"+this.field,f=this.db.any(`
        SELECT ${e}.id
               ${d?", doc":""}
        FROM ${e}
        ${d?`
            LEFT JOIN ${this.id}.reg ON ${this.id}.reg.id = ${e}.id
        `:""}
        WHERE tag = $1
        ${b?"LIMIT "+b:""}
        ${c?"OFFSET "+c:""}`,[a]);return d||f.then(function(a){return create_result(a,!0,!1)}),f},PostgresDB.prototype.enrich=async function(a){let b=[];"object"!=typeof a&&(a=[a]);for(let c=0;c<a.length;){const d=a.length-c>MAXIMUM_QUERY_VARS?a.slice(c,c+MAXIMUM_QUERY_VARS):c?a.slice(c):a;c+=d.length;let e="";for(let a=1;a<=d.length;a++)e+=(e?",":"")+"$"+a;const f=await this.db.any(`
            SELECT id, doc 
            FROM ${this.id}.reg
            WHERE id IN (${e})`,a);if(f&&f.length){for(let a,b=0;b<f.length;b++)(a=f[b].doc)&&(f[b].doc=JSON.parse(a));b.push(f)}}return 1===b.length?b[0]:1<b.length?concat(b):b},PostgresDB.prototype.has=function(a){return this.db.oneOrNone("SELECT EXISTS(SELECT 1 FROM "+this.id+".reg WHERE id = $1)",[a]).then(function(a){return!!(a&&a.exists)})},PostgresDB.prototype.search=function(a,b,c=100,d=0,e=!1,f=!0,g=!1,h){let i;if(1<b.length&&a.depth){let j,k="",l=[],m=b[0],n=1;for(let c=1;c<b.length;c++){j=b[c];const d=a.bidirectional&&j>m;k+=(k?" OR ":"")+`(ctx = $${n++} AND key = $${n++})`,l.push(d?j:m,d?m:j),m=j}if(h){k="("+k+")";for(let a=0;a<h.length;a+=2)k+=` AND id IN (SELECT id FROM ${this.id}.tag_${sanitize(h[a])} WHERE tag = $${n++})`,l.push(h[a+1])}i=this.db.any(`
            SELECT r.id 
                   ${f?"":", res"}
                   ${g?", doc":""}
            FROM (
                SELECT id, count(*) as count,
                       ${e?"SUM":"SUM"}(res) as res
                FROM ${this.id}.ctx${this.field}
                WHERE ${k}
                GROUP BY id
            ) as r
            ${g?`
                LEFT JOIN ${this.id}.reg ON ${this.id}.reg.id = r.id
            `:""} 
            ${e?"":"WHERE count = "+(b.length-1)}
            ORDER BY ${e?"count DESC, res":"res"}
            ${c?"LIMIT "+c:""}
            ${d?"OFFSET "+d:""}
        `,l)}else{let a="",j=1,k=b.length;for(let b=0;b<k;b++)a+=(a?",":"")+"$"+j++;if(a="key "+(1<k?"IN ("+a+")":"= "+a),h){a="("+a+")";for(let c=0;c<h.length;c+=2)a+=` AND id IN (SELECT id FROM ${this.id}.tag_${sanitize(h[c])} WHERE tag = $${j++})`,b.push(h[c+1])}i=this.db.any(`
            SELECT r.id 
                   ${f?"":", res"}   
                   ${g?", doc":""}
            FROM (
                SELECT id, count(*) as count,
                       ${e?"SUM":"SUM"}(res) as res
                FROM ${this.id}.map${this.field}
                WHERE ${a}
                GROUP BY id
            ) as r
            ${g?`
                LEFT JOIN ${this.id}.reg ON ${this.id}.reg.id = r.id
            `:""}   
            ${e?"":"WHERE count = "+k}
            ORDER BY ${e?"count DESC, res":"res"}
            ${c?"LIMIT "+c:""}
            ${d?"OFFSET "+d:""}
        `,b)}return i.then(function(a){return create_result(a,f,g)})},PostgresDB.prototype.info=function(){},PostgresDB.prototype.transaction=function(a){const b=this;return this.db.tx(function(c){return a.call(b,c)})},PostgresDB.prototype.commit=async function(a){let b=a.commit_task,c=[];a.commit_task=[];for(let d,e=0;e<b.length;e++)d=b[e],d.del?c.push(d.del):d.ins;c.length&&(await this.remove(c));a.reg.size&&(await this.transaction(function(b){const c=[];if(a.store){let d=[],e=new pgp.helpers.ColumnSet(["id","doc"],{table:this.id+".reg"});for(const f of a.store.entries()){const a=f[0],g=f[1];if(d.push({id:a,doc:g&&JSON.stringify(g)}),d.length===MAXIMUM_QUERY_VARS){let a=pgp.helpers.insert(d,e);c.push(b.none(a.replace(/^(insert into )"([^"]+)"/,"$1 $2"))),d=[]}}if(d.length){let a=pgp.helpers.insert(d,e);c.push(b.none(a.replace(/^(insert into )"([^"]+)"/,"$1 $2")))}}else if(!a.bypass){let d=[],e=new pgp.helpers.ColumnSet(["id"],{table:this.id+".reg"});for(const f of a.reg.keys())if(d.push({id:f}),d.length===MAXIMUM_QUERY_VARS){let a=pgp.helpers.insert(d,e);c.push(b.none(a.replace(/^(insert into )"([^"]+)"/,"$1 $2"))),d=[]}if(d.length){let a=pgp.helpers.insert(d,e);c.push(b.none(a.replace(/^(insert into )"([^"]+)"/,"$1 $2")))}}if(a.map.size){let d=[],e=new pgp.helpers.ColumnSet(["key","res","id"],{table:this.id+".map"+this.field});for(const f of a.map){const a=f[0],g=f[1];for(let f,h=0;h<g.length;h++)if((f=g[h])&&f.length)for(let g=0;g<f.length;g++)if(d.push({key:a,res:h,id:f[g]}),d.length===MAXIMUM_QUERY_VARS){let a=pgp.helpers.insert(d,e);c.push(b.none(a.replace(/^(insert into )"([^"]+)"/,"$1 $2"))),d=[]}}if(d.length){let a=pgp.helpers.insert(d,e);c.push(b.none(a.replace(/^(insert into )"([^"]+)"/,"$1 $2")))}}if(a.ctx.size){let d=[],e=new pgp.helpers.ColumnSet(["ctx","key","res","id"],{table:this.id+".ctx"+this.field});for(const f of a.ctx){const a=f[0],g=f[1];for(const f of g){const g=f[0],h=f[1];for(let f,k=0;k<h.length;k++)if((f=h[k])&&f.length)for(let h=0;h<f.length;h++)if(d.push({ctx:a,key:g,res:k,id:f[h]}),d.length===MAXIMUM_QUERY_VARS){let a=pgp.helpers.insert(d,e);c.push(b.none(a.replace(/^(insert into )"([^"]+)"/,"$1 $2"))),d=[]}}}if(d.length){let a=pgp.helpers.insert(d,e);c.push(b.none(a.replace(/^(insert into )"([^"]+)"/,"$1 $2")))}}if(a.tag){let d=[],e=new pgp.helpers.ColumnSet(["tag","id"],{table:this.id+".tag"+this.field});for(const f of a.tag){const a=f[0],g=f[1];if(g.length)for(let f=0;f<g.length;f++)if(d.push({tag:a,id:g[f]}),d.length===MAXIMUM_QUERY_VARS){let a=pgp.helpers.insert(d,e);c.push(b.none(a.replace(/^(insert into )"([^"]+)"/,"$1 $2"))),d=[]}}if(d.length){let a=pgp.helpers.insert(d,e);c.push(b.none(a.replace(/^(insert into )"([^"]+)"/,"$1 $2")))}}return c.length?b.batch(c):void 0}),a.map.clear(),a.ctx.clear(),a.tag&&a.tag.clear(),a.store&&a.store.clear(),a.document||a.reg.clear())},PostgresDB.prototype.remove=function(a){if(a||0===a)return"object"!=typeof a&&(a=[a]),a.length?this.transaction(function(b){return a=[a],b.batch([b.none({text:"DELETE FROM "+this.id+".map"+this.field+" WHERE id = ANY ($1)",rowMode:"array"},a),b.none({text:"DELETE FROM "+this.id+".ctx"+this.field+" WHERE id = ANY ($1)",rowMode:"array"},a),b.none({text:"DELETE FROM "+this.id+".tag"+this.field+" WHERE id = ANY ($1)",rowMode:"array"},a),b.none({text:"DELETE FROM "+this.id+".reg WHERE id = ANY ($1)",rowMode:"array"},a)])}):void 0};