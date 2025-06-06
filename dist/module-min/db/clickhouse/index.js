import{ClickHouse}from"clickhouse";import StorageInterface from"../interface.js";import{concat,toArray}from"../../common.js";const defaults={host:"http://localhost",port:"8123",debug:!1,basicAuth:null,isUseGzip:!1,trimQuery:!1,usePost:!1,format:"json",raw:!1,config:{output_format_json_quote_64bit_integers:0,enable_http_compression:0,database:"default"}},VERSION=1,fields=["map","ctx","tag","reg","cfg"],types={text:"String",char:"String",varchar:"String",string:"String",number:"Int32",numeric:"Int32",integer:"Int32",smallint:"Int16",tinyint:"Int8",mediumint:"Int32",int:"Int32",int8:"Int8",uint8:"UInt8",int16:"Int16",uint16:"UInt16",int32:"Int32",uint32:"UInt32",int64:"Int64",uint64:"UInt64",bigint:"Int64"};function sanitize(a){return a.toLowerCase().replace(/[^a-z0-9_]/g,"")}let Index;export default function ClickhouseDB(a,b={}){if(!this||this.constructor!==ClickhouseDB)return new ClickhouseDB(a,b);if("object"==typeof a&&(b=a,a=a.name),a||console.info("Default storage space was used, because a name was not passed."),this.id="flexsearch"+(a?"_"+sanitize(a):""),this.field=b.field?"_"+sanitize(b.field):"",this.type=b.type?types[b.type.toLowerCase()]:"String",!this.type)throw new Error("Unknown type of ID '"+b.type+"'");this.support_tag_search=!0,this.db=Index||(Index=b.db||null),Object.assign(defaults,b),b.database&&(defaults.config.database=b.database),this.db&&delete defaults.db}ClickhouseDB.prototype.mount=function(a){return a.index?a.mount(this):(defaults.resolution=Math.max(a.resolution,a.resolution_ctx),a.db=this,this.open())},ClickhouseDB.prototype.open=async function(){this.db||(this.db=Index||(Index=new ClickHouse(defaults)));const a=await this.db.query(`
        SELECT 1 FROM system.databases WHERE name = '${this.id}';
    `).toPromise();a&&a.length||(await this.db.query(`
            CREATE DATABASE IF NOT EXISTS ${this.id};
        `).toPromise());for(let a=0;a<fields.length;a++)switch(fields[a]){case"map":await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.map${this.field}(
                        key String,
                        res ${255>=defaults.resolution?"UInt8":"UInt16"},
                        id  ${this.type}
                    )
                    ENGINE = MergeTree
                    
                    ORDER BY (key, id);
                `,{params:{name:this.id+".map"+this.field}}).toPromise();break;case"ctx":await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.ctx${this.field}(
                        ctx String,
                        key String,
                        res ${255>=defaults.resolution?"UInt8":"UInt16"},
                        id  ${this.type}
                    )
                    ENGINE = MergeTree
                    
                    ORDER BY (ctx, key, id);
                `).toPromise();break;case"tag":await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.tag${this.field}(
                        tag String,
                        id  ${this.type}
                    )
                    ENGINE = MergeTree
                    
                    ORDER BY (tag, id);
                `).toPromise();break;case"reg":await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.reg(
                        id  ${this.type},
                        doc Nullable(String)
                    )
                    ENGINE = MergeTree
                    ORDER BY (id);
                `).toPromise();break;case"cfg":await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.cfg${this.field}(
                        cfg String
                    ) 
                    ENGINE = TinyLog;
                `).toPromise();}return this.db},ClickhouseDB.prototype.close=function(){return this.db=Index=null,this},ClickhouseDB.prototype.destroy=function(){return Promise.all([this.db.query(`DROP TABLE ${this.id}.map${this.field};`).toPromise(),this.db.query(`DROP TABLE ${this.id}.ctx${this.field};`).toPromise(),this.db.query(`DROP TABLE ${this.id}.tag${this.field};`).toPromise(),this.db.query(`DROP TABLE ${this.id}.cfg${this.field};`).toPromise(),this.db.query(`DROP TABLE ${this.id}.reg;`).toPromise()])},ClickhouseDB.prototype.clear=function(){return Promise.all([this.db.query(`TRUNCATE TABLE ${this.id}.map${this.field};`).toPromise(),this.db.query(`TRUNCATE TABLE ${this.id}.ctx${this.field};`).toPromise(),this.db.query(`TRUNCATE TABLE ${this.id}.tag${this.field};`).toPromise(),this.db.query(`TRUNCATE TABLE ${this.id}.cfg${this.field};`).toPromise(),this.db.query(`TRUNCATE TABLE ${this.id}.reg;`).toPromise()])};function create_result(a,b,c){if(b){for(let b=0;b<a.length;b++)c?a[b].doc&&(a[b].doc=JSON.parse(a[b].doc)):a[b]=a[b].id;return a}else{const b=[];for(let d,e=0;e<a.length;e++)d=a[e],b[d.res]||(b[d.res]=[]),b[d.res].push(c?d:d.id);return b}}ClickhouseDB.prototype.get=function(a,b,c=0,d=0,e=!0,f=!1,g){let h,j="",k=b?{ctx:b,key:a}:{key:a},l=this.id+(b?".ctx":".map")+this.field;if(g)for(let a=0,b=1;a<g.length;a+=2)j+=` AND ${l}.id IN (SELECT id FROM ${this.id}.tag_${sanitize(g[a])} WHERE tag = {tag${b}:String})`,k["tag"+b]=g[a+1],b++;return h=b?this.db.query(`
            SELECT ${l}.id
                   ${e?"":", res"}
                   ${f?", doc":""}
            FROM ${l}
            ${f?`
                LEFT OUTER JOIN ${this.id}.reg ON ${this.id}.reg.id = ${l}.id
            `:""}
            WHERE ctx = {ctx:String} AND key = {key:String} 
            ORDER BY res
            ${c?"LIMIT "+c:""}
            ${d?"OFFSET "+d:""}`,{params:k}).toPromise():this.db.query(`
            SELECT ${l}.id
                   ${e?"":", res"}
                   ${f?", doc":""}
            FROM ${l}
            ${f?`
                LEFT OUTER JOIN ${this.id}.reg ON ${this.id}.reg.id = ${l}.id
            `:""}
            WHERE key = {key:String}
            ORDER BY res
            ${c?"LIMIT "+c:""}
            ${d?"OFFSET "+d:""}`,{params:k}).toPromise(),h.then(function(a){return create_result(a,e,f)})},ClickhouseDB.prototype.tag=function(a,b=0,c=0,d=!1){const e=this.id+".tag"+this.field,f=this.db.query(`
        SELECT ${e}.id
               ${d?", doc":""}
        FROM ${e} 
        ${d?`
            LEFT OUTER JOIN ${this.id}.reg ON ${this.id}.reg.id = ${e}.id
        `:""}
        WHERE tag = {tag:String}
        ${b?"LIMIT "+b:""} 
        ${c?"OFFSET "+c:""}`,{params:{tag:a}}).toPromise();return d||f.then(function(a){return create_result(a,!0,!1)}),f},ClickhouseDB.prototype.enrich=async function(a){let b=1e5,c=[];"object"!=typeof a&&(a=[a]);for(let d=0;d<a.length;){const e=a.length-d>b?a.slice(d,d+b):d?a.slice(d):a;d+=e.length;let f={},g="";for(let a=0;a<e.length;a++)g+=(g?",":"")+"{id"+(a+1)+":String}",f["id"+(a+1)]=e[a];const h=await this.db.query(`
            SELECT id, doc 
            FROM ${this.id}.reg
            WHERE id IN (${g})`,{params:f}).toPromise();if(h&&h.length){for(let a,b=0;b<h.length;b++)(a=h[b].doc)&&(h[b].doc=JSON.parse(a));c.push(h)}}return 1===c.length?c[0]:1<c.length?concat(c):c},ClickhouseDB.prototype.has=async function(a){const b=await this.db.query(`
        SELECT 1
        FROM ${this.id}.reg
        WHERE id = {id:${this.type}}
        LIMIT 1`,{params:{id:a}}).toPromise();return!!(b&&b[0]&&b[0][1])},ClickhouseDB.prototype.search=function(a,b,c=100,d=0,e=!1,f=!0,g=!1,h){let i;if(1<b.length&&a.depth){let j,k="",l={},m=b[0];for(let c=1;c<b.length;c++){j=b[c];const d=a.bidirectional&&j>m;k+=(k?" OR ":"")+`(ctx = {ctx${c}:String} AND key = {key${c}:String})`,l["ctx"+c]=d?j:m,l["key"+c]=d?m:j,m=j}if(h){k="("+k+")";for(let a=0,b=1;a<h.length;a+=2)k+=` AND id IN (SELECT id FROM ${this.id}.tag_${sanitize(h[a])} WHERE tag = {tag${b}:String})`,l["tag"+b]=h[a+1],b++}i=this.db.query(`
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
                LEFT OUTER JOIN ${this.id}.reg ON ${this.id}.reg.id = r.id
            `:""}
            ${e?"":"WHERE count = "+(b.length-1)}
            ORDER BY ${e?"count DESC, res":"res"}
            ${c?"LIMIT "+c:""}
            ${d?"OFFSET "+d:""}
        `,{params:l}).toPromise()}else{let a="",j={};for(let c=0;c<b.length;c++)a+=(a?",":"")+`{key${c}:String}`,j["key"+c]=b[c];if(a="key "+(1<b.length?"IN ("+a+")":"= "+a),h){a="("+a+")";for(let b=0,c=1;b<h.length;b+=2)a+=` AND id IN (SELECT id FROM ${this.id}.tag_${sanitize(h[b])} WHERE tag = {tag${c}:String})`,j["tag"+c]=h[b+1],c++}i=this.db.query(`
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
                LEFT OUTER JOIN ${this.id}.reg ON ${this.id}.reg.id = r.id
            `:""}            
            ${e?"":"WHERE count = "+b.length}
            ORDER BY ${e?"count DESC, res":"res"}
            ${c?"LIMIT "+c:""}
            ${d?"OFFSET "+d:""}
        `,{params:j}).toPromise()}return i.then(function(a){return create_result(a,f,g)})},ClickhouseDB.prototype.info=function(){},ClickhouseDB.prototype.transaction=function(a){return a.call(this)},ClickhouseDB.prototype.commit=async function(a){let b=a.commit_task,c=[];a.commit_task=[];for(let d,e=0;e<b.length;e++)d=b[e],d.del?c.push(d.del):d.ins;if(c.length&&(await this.remove(c)),!!a.reg.size){const b=[];if(a.map.size){let c=[];for(const b of a.map){const a=b[0],d=b[1];for(let b,e=0;e<d.length;e++)if((b=d[e])&&b.length)for(let d=0;d<b.length;d++)c.push({key:a,res:e,id:b[d]})}c.length&&b.push(this.db.insert(`INSERT INTO ${this.id}.map${this.field} (key, res, id)`,c).toPromise())}if(a.ctx.size){let c=[];for(const b of a.ctx){const a=b[0],d=b[1];for(const b of d){const d=b[0],e=b[1];for(let b,f=0;f<e.length;f++)if((b=e[f])&&b.length)for(let e=0;e<b.length;e++)c.push({ctx:a,key:d,res:f,id:b[e]})}}c.length&&b.push(this.db.insert(`INSERT INTO ${this.id}.ctx${this.field} (ctx, key, res, id)`,c).toPromise())}if(a.tag){let c=[];for(const b of a.tag){const a=b[0],d=b[1];if(d.length)for(let b=0;b<d.length;b++)c.push({tag:a,id:d[b]})}c.length&&b.push(this.db.insert(`INSERT INTO ${this.id}.tag${this.field} (tag, id)`,c).toPromise())}if(a.store){let c=[];for(const b of a.store.entries()){const a=b[0],d=b[1];c.push({id:a,doc:d&&JSON.stringify(d)})}c.length&&b.push(this.db.insert(`INSERT INTO ${this.id}.reg (id, doc)`,c).toPromise())}else if(!a.bypass){let c=toArray(a.reg);for(let a=0;a<c.length;a++)c[a]={id:c[a]};c.length&&b.push(this.db.insert(`INSERT INTO ${this.id}.reg (id)`,c).toPromise())}b.length&&(await Promise.all(b)),a.map.clear(),a.ctx.clear(),a.tag&&a.tag.clear(),a.store&&a.store.clear(),a.document||a.reg.clear(),await Promise.all([this.db.query(`OPTIMIZE TABLE ${this.id}.map${this.field} FINAL`).toPromise(),this.db.query(`OPTIMIZE TABLE ${this.id}.ctx${this.field} FINAL`).toPromise(),this.db.query(`OPTIMIZE TABLE ${this.id}.tag${this.field} FINAL`).toPromise(),this.db.query(`OPTIMIZE TABLE ${this.id}.reg FINAL`).toPromise()])}},ClickhouseDB.prototype.remove=async function(a){for("object"!=typeof a&&(a=[a]);a.length;){let b=a.slice(0,1e5);a=a.slice(1e5),b="String"===this.type?"'"+b.join("','")+"'":b.join(","),await Promise.all([this.db.query(`
                ALTER TABLE ${this.id}.map${this.field} 
                DELETE WHERE id IN (${b}) 
                SETTINGS mutations_sync = 1;`).toPromise(),this.db.query(`
                ALTER TABLE ${this.id}.ctx${this.field}
                DELETE WHERE id IN (${b})
                SETTINGS mutations_sync = 1;`).toPromise(),this.db.query(`
                ALTER TABLE ${this.id}.tag${this.field}
                DELETE WHERE id IN (${b})
                SETTINGS mutations_sync = 1;`).toPromise(),this.db.query(`
                ALTER TABLE ${this.id}.reg
                DELETE WHERE id IN (${b})
                SETTINGS mutations_sync = 1;`).toPromise()])}};