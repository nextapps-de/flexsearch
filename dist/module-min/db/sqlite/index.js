import sqlite3 from"sqlite3";import path from"path";import StorageInterface from"../interface.js";import{concat,toArray}from"../../common.js";const VERSION=1,MAXIMUM_QUERY_VARS=16000,fields=["map","ctx","reg","tag","cfg"],types={text:"text",char:"text",varchar:"text",string:"text",number:"int",numeric:"int",integer:"int",smallint:"int",tinyint:"int",mediumint:"int",int:"int",int8:"int",uint8:"int",int16:"int",uint16:"int",int32:"int",uint32:"bigint",int64:"bigint",bigint:"bigint"};function sanitize(a){return a.toLowerCase().replace(/[^a-z0-9_]/g,"")}const TRX=Object.create(null),Index=Object.create(null);export default function SqliteDB(a,b={}){if(!this||this.constructor!==SqliteDB)return new SqliteDB(a,b);if("object"==typeof a&&(b=a,a=a.name),a||console.info("Default storage space was used, because a name was not passed."),this.id=b.path||(":memory:"===a?a:"flexsearch"+(a?"-"+sanitize(a):"")+".sqlite"),this.field=b.field?"_"+sanitize(b.field):"",this.support_tag_search=!0,this.db=b.db||Index[this.id]||null,this.type=b.type?types[b.type.toLowerCase()]:"string",!this.type)throw new Error("Unknown type of ID '"+b.type+"'")}SqliteDB.prototype.mount=function(a){return a.index?a.mount(this):(a.db=this,this.open())},SqliteDB.prototype.open=async function(){if(!this.db&&!(this.db=Index[this.id])){let a=this.id;if(":memory:"!==a&&"/"!==a[0]&&"\\"!==a[0]){const b=process.cwd();a=path.join(b,this.id)}this.db=Index[this.id]=new sqlite3.Database(a)}const a=this.db;for(let b=0;b<fields.length;b++){const c=await this.promisfy({method:"get",stmt:"SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?) as exist",params:[fields[b]+("reg"===fields[b]?"":this.field)]});if(!c||!c.exist){let c,d;switch(fields[b]){case"map":c=`
                        CREATE TABLE IF NOT EXISTS main.map${this.field}(
                            key TEXT NOT NULL,
                            res INTEGER NOT NULL,
                            id  ${this.type} NOT NULL
                        );
                    `,d=`
                        CREATE INDEX IF NOT EXISTS map_key_index${this.field} 
                            ON map${this.field} (key);
                        CREATE INDEX IF NOT EXISTS map_id_index${this.field}
                            ON map${this.field} (id);
                    `;break;case"ctx":c=`
                        CREATE TABLE IF NOT EXISTS main.ctx${this.field}(
                            ctx TEXT NOT NULL,
                            key TEXT NOT NULL,
                            res INTEGER NOT NULL,
                            id  ${this.type} NOT NULL
                        );
                    
                    `,d=`
                        CREATE INDEX IF NOT EXISTS ctx_key_index${this.field} 
                            ON ctx${this.field} (ctx, key);
                        CREATE INDEX IF NOT EXISTS ctx_id_index${this.field}
                            ON ctx${this.field} (id);
                    `;break;case"tag":c=`
                        CREATE TABLE IF NOT EXISTS main.tag${this.field}(
                            tag TEXT NOT NULL,
                            id  ${this.type} NOT NULL
                        );
                    `,d=`
                        CREATE INDEX IF NOT EXISTS tag_index${this.field} 
                            ON tag${this.field} (tag);
                        CREATE INDEX IF NOT EXISTS tag_id_index${this.field}
                            ON tag${this.field} (id);
                    `;break;case"reg":c=`
                        CREATE TABLE IF NOT EXISTS main.reg(
                            id ${this.type} NOT NULL
                                CONSTRAINT reg_pk${this.field}
                                    PRIMARY KEY,
                            doc TEXT DEFAULT NULL                    
                        );
                    `,d=`
                        CREATE INDEX IF NOT EXISTS reg_index
                            ON reg (id);
                    `;break;case"cfg":c=`
                        CREATE TABLE IF NOT EXISTS main.cfg${this.field} (
                            cfg TEXT NOT NULL
                        );
                    `;}await new Promise(function(b,e){a.exec(c,function(c,f){return c?e(c):void(d?a.exec(d,function(a,c){return a?e(a):void b(c)}):b(f))})})}}return a.exec("PRAGMA optimize = 0x10002"),a},SqliteDB.prototype.close=function(){return this.db&&this.db.close(),this.db=null,Index[this.id]=null,TRX[this.id]=null,this},SqliteDB.prototype.destroy=function(){return this.transaction(function(){this.db.run("DROP TABLE IF EXISTS main.map"+this.field+";"),this.db.run("DROP TABLE IF EXISTS main.ctx"+this.field+";"),this.db.run("DROP TABLE IF EXISTS main.tag"+this.field+";"),this.db.run("DROP TABLE IF EXISTS main.cfg"+this.field+";"),this.db.run("DROP TABLE IF EXISTS main.reg;")})},SqliteDB.prototype.clear=function(){return this.transaction(function(){this.db.run("DELETE FROM main.map"+this.field+" WHERE 1;"),this.db.run("DELETE FROM main.ctx"+this.field+" WHERE 1;"),this.db.run("DELETE FROM main.tag"+this.field+" WHERE 1;"),this.db.run("DELETE FROM main.cfg"+this.field+" WHERE 1;"),this.db.run("DELETE FROM main.reg WHERE 1;")})};function create_result(a,b,c){if(b){for(let b=0;b<a.length;b++)c?a[b].doc&&(a[b].doc=JSON.parse(a[b].doc)):a[b]=a[b].id;return a}else{const b=[];for(let d,e=0;e<a.length;e++)d=a[e],b[d.res]||(b[d.res]=[]),b[d.res].push(c?d:d.id);return b}}SqliteDB.prototype.get=function(a,b,c=0,d=0,e=!0,f=!1,g){let h,j="",k=b?[b,a]:[a],l="main."+(b?"ctx":"map")+this.field;if(g)for(let a=0;a<g.length;a+=2)j+=` AND ${l}.id IN (SELECT id FROM main.tag_${sanitize(g[a])} WHERE tag = ?)`,k.push(g[a+1]);return h=b?this.promisfy({method:"all",stmt:`
                SELECT ${l}.id 
                       ${e?"":", res"}
                       ${f?", doc":""}
                FROM ${l}
                ${f?`
                    LEFT JOIN main.reg ON main.reg.id = ${l}.id
                `:""}
                WHERE ctx = ? AND key = ? ${j}
                ORDER BY res 
                ${c?"LIMIT "+c:""}
                ${d?"OFFSET "+d:""}
            `,params:k}):this.promisfy({method:"all",stmt:`
                SELECT ${l}.id
                       ${e?"":", res"} 
                       ${f?", doc":""}
                FROM ${l}
                ${f?`
                    LEFT JOIN main.reg ON main.reg.id = ${l}.id
                `:""}
                WHERE key = ? ${j}
                ORDER BY res
                ${c?"LIMIT "+c:""}
                ${d?"OFFSET "+d:""}
            `,params:k}),h.then(function(a){return create_result(a,e,f)})},SqliteDB.prototype.tag=function(a,b=0,c=0,d=!1){const e="main.tag"+this.field,f=this.promisfy({method:"all",stmt:`
            SELECT ${e}.id 
                   ${d?", doc":""}
            FROM ${e}
            ${d?`
                LEFT JOIN main.reg ON main.reg.id = ${e}.id
            `:""}
            WHERE tag = ? 
            ${b?"LIMIT "+b:""}
            ${c?"OFFSET "+c:""}
        `,params:[a]});return d||f.then(function(a){return create_result(a,!0,!1)}),f};function build_params(a,b){let c=b?",(?)":",?";for(let d=1;d<a;)if(d<=a-d)c+=c,d*=2;else{c+=c.substring(0,(a-d)*(b?4:2));break}return c.substring(1)}SqliteDB.prototype.enrich=function(a){const b=[],c=[];"object"!=typeof a&&(a=[a]);for(let b=0;b<a.length;){const d=a.length-b>MAXIMUM_QUERY_VARS?a.slice(b,b+MAXIMUM_QUERY_VARS):b?a.slice(b):a,e=build_params(d.length);b+=d.length,c.push(this.promisfy({method:"all",stmt:`SELECT id, doc FROM main.reg WHERE id IN (${e})`,params:d}))}return Promise.all(c).then(function(a){for(let c,d=0;d<a.length;d++)if(c=a[d],c&&c.length){for(let a,b=0;b<c.length;b++)(a=c[b].doc)&&(c[b].doc=JSON.parse(a));b.push(c)}return 1===b.length?b[0]:1<b.length?concat(b):b})},SqliteDB.prototype.has=function(a){return this.promisfy({method:"get",stmt:`SELECT EXISTS(SELECT 1 FROM main.reg WHERE id = ?) as exist`,params:[a]}).then(function(a){return!!(a&&a.exist)})},SqliteDB.prototype.search=function(a,b,c=100,d=0,e=!1,f=!0,g=!1,h){let i;if(1<b.length&&a.depth){let j,k="",l=[],m=b[0];for(let c=1;c<b.length;c++){j=b[c];const d=a.bidirectional&&j>m;k+=(k?" OR ":"")+`(ctx = ? AND key = ?)`,l.push(d?j:m,d?m:j),m=j}if(h){k="("+k+")";for(let a=0;a<h.length;a+=2)k+=` AND id IN (SELECT id FROM main.tag_${sanitize(h[a])} WHERE tag = ?)`,l.push(h[a+1])}i=this.promisfy({method:"all",stmt:`
                SELECT r.id 
                       ${f?"":", res"}
                       ${g?", doc":""}
                FROM (
                    SELECT id, count(*) as count,
                           ${e?"SUM":"SUM"}(res) as res
                    FROM main.ctx${this.field}
                    WHERE ${k}
                    GROUP BY id
                ) as r
                ${g?`
                    LEFT JOIN main.reg ON main.reg.id = r.id
                `:""}  
                ${e?"":"WHERE count = "+(b.length-1)}
                ORDER BY ${e?"count DESC, res":"res"}
                ${c?"LIMIT "+c:""}
                ${d?"OFFSET "+d:""}
            `,params:l})}else{let a="",j=b.length;for(let b=0;b<j;b++)a+=(a?" OR ":"")+`key = ?`;if(h){a="("+a+")";for(let c=0;c<h.length;c+=2)a+=` AND id IN (SELECT id FROM main.tag_${sanitize(h[c])} WHERE tag = ?)`,b.push(h[c+1])}i=this.promisfy({method:"all",stmt:`
                SELECT r.id 
                       ${f?"":", res"}  
                       ${g?", doc":""}
                FROM (
                    SELECT id, count(*) as count,
                           ${e?"SUM":"SUM"}(res) as res
                    FROM main.map${this.field}
                    WHERE ${a}
                    GROUP BY id
                ) as r
                ${g?`
                    LEFT JOIN main.reg ON main.reg.id = r.id
                `:""}  
                ${e?"":"WHERE count = "+j}
                ORDER BY ${e?"count DESC, res":"res"}
                ${c?"LIMIT "+c:""}
                ${d?"OFFSET "+d:""}
            `,params:b})}return i.then(function(a){return create_result(a,f,g)})},SqliteDB.prototype.info=function(){},SqliteDB.prototype.transaction=async function(a,b){if(TRX[this.id])return await a.call(this);const c=this.db,d=this;return TRX[this.id]=new Promise(function(e,f){c.exec("PRAGMA optimize"),c.exec("PRAGMA busy_timeout = 5000"),c.exec("BEGIN"),c.parallelize(function(){a.call(d)}),c.exec("COMMIT",function(a,g){return TRX[d.id]=null,a?f(a):void(b&&b(g),e(g),c.exec("PRAGMA shrink_memory"))})})},SqliteDB.prototype.commit=async function(a){let b=a.commit_task,c=[],d=[];a.commit_task=[];for(let e,f=0;f<b.length;f++)e=b[f],"undefined"==typeof e.del?"undefined"!=typeof e.ins&&d.push(e.ins):c.push(e.del);c.length&&(await this.remove(c));a.reg.size&&(await this.transaction(function(){for(const b of a.map){const a=b[0],c=b[1];for(let b,d=0;d<c.length;d++)if((b=c[d])&&b.length){let c="",e=[];for(let f=0;f<b.length;f++)c+=(c?",":"")+"(?,?,?)",e.push(a,d,b[f]),(f===b.length-1||e.length+3>MAXIMUM_QUERY_VARS)&&(this.db.run("INSERT INTO main.map"+this.field+" (key, res, id) VALUES "+c,e),c="",e=[])}}for(const b of a.ctx){const a=b[0],c=b[1];for(const b of c){const c=b[0],d=b[1];for(let b,e=0;e<d.length;e++)if((b=d[e])&&b.length){let d="",f=[];for(let g=0;g<b.length;g++)d+=(d?",":"")+"(?,?,?,?)",f.push(a,c,e,b[g]),(g===b.length-1||f.length+4>MAXIMUM_QUERY_VARS)&&(this.db.run("INSERT INTO main.ctx"+this.field+" (ctx, key, res, id) VALUES "+d,f),d="",f=[])}}}if(a.store){let b="",c=[];for(const d of a.store.entries()){const a=d[0],e=d[1];b+=(b?",":"")+"(?,?)",c.push(a,"object"==typeof e?JSON.stringify(e):e||null),c.length+2>MAXIMUM_QUERY_VARS&&(this.db.run("INSERT INTO main.reg (id, doc) VALUES "+b+" ON CONFLICT DO NOTHING",c),b="",c=[])}c.length&&this.db.run("INSERT INTO main.reg (id, doc) VALUES "+b+" ON CONFLICT DO NOTHING",c)}else if(!a.bypass){let b=toArray(a.reg);for(let a=0;a<b.length;){const c=b.length-a>MAXIMUM_QUERY_VARS?b.slice(a,a+MAXIMUM_QUERY_VARS):a?b.slice(a):b;a+=c.length;const d=build_params(c.length,!0);this.db.run("INSERT INTO main.reg (id) VALUES "+d+" ON CONFLICT DO NOTHING",c)}}if(a.tag){let b="",c=[];for(const d of a.tag){const a=d[0],e=d[1];if(e.length){for(let d=0;d<e.length;d++)b+=(b?",":"")+"(?,?)",c.push(a,e[d]);c.length+2>MAXIMUM_QUERY_VARS&&(this.db.run("INSERT INTO main.tag"+this.field+" (tag, id) VALUES "+b,c),b="",c=[])}}c.length&&this.db.run("INSERT INTO main.tag"+this.field+" (tag, id) VALUES "+b,c)}}),d.length&&(await this.cleanup()),a.map.clear(),a.ctx.clear(),a.tag&&a.tag.clear(),a.store&&a.store.clear(),a.document||a.reg.clear())},SqliteDB.prototype.remove=function(a){"object"!=typeof a&&(a=[a]);let b;a.length>MAXIMUM_QUERY_VARS&&(b=a.slice(MAXIMUM_QUERY_VARS),a=a.slice(0,MAXIMUM_QUERY_VARS));const c=this;return this.transaction(function(){const b=build_params(a.length);this.db.run("DELETE FROM main.map"+c.field+" WHERE id IN ("+b+")",a),this.db.run("DELETE FROM main.ctx"+c.field+" WHERE id IN ("+b+")",a),this.db.run("DELETE FROM main.tag"+c.field+" WHERE id IN ("+b+")",a),this.db.run("DELETE FROM main.reg WHERE id IN ("+b+")",a)}).then(function(a){return b?c.remove(b):a})},SqliteDB.prototype.cleanup=function(){return this.transaction(function(){this.db.run("DELETE FROM main.map"+this.field+" WHERE ROWID IN (SELECT ROWID FROM (SELECT ROWID, row_number() OVER dupes AS count FROM main.map"+this.field+" _t WINDOW dupes AS (PARTITION BY id, key ORDER BY res) ) WHERE count > 1)"),this.db.run("DELETE FROM main.ctx"+this.field+" WHERE ROWID IN (SELECT ROWID FROM (SELECT ROWID, row_number() OVER dupes AS count FROM main.ctx"+this.field+" _t WINDOW dupes AS (PARTITION BY id, ctx, key ORDER BY res) ) WHERE count > 1)")})},SqliteDB.prototype.promisfy=function(a){const b=this.db;return new Promise(function(c,d){b[a.method](a.stmt,a.params||[],function(b,e){a.callback&&a.callback(e),b?d(b):c(e)})})};