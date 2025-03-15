import Index from "./index.js";
import Document from "./document.js";
import { is_string } from "./common.js";

const chunk_size_reg = 250000;
const chunk_size_map = 5000;
const chunk_size_ctx = 1000;

function map_to_json(map, size = 0){
    let chunk = [];
    let json = [];
    if(size){
        size = chunk_size_map * (chunk_size_reg / size) | 0;
    }
    for(const item of map.entries()){
        json.push(item);
        if(json.length === size){
            chunk.push(json);
            json = [];
        }
    }
    json.length && chunk.push(json);
    return chunk;
}

function json_to_map(json, map){
    map || (map = new Map());
    for(let i = 0, entry; i < json.length; i++) {
        entry = json[i];
        map.set(entry[0], entry[1]);
    }
    return map;
}

function ctx_to_json(ctx, size = 0){
    let chunk = [];
    let json = [];
    if(size){
        size = chunk_size_ctx * (chunk_size_reg / size) | 0;
    }
    for(const item of ctx.entries()){
        const key = item[0];
        const value = item[1];
        json.push([key, map_to_json(value)[0]]);
        if(json.length === size){
            chunk.push(json);
            json = [];
        }
    }
    json.length && chunk.push(json);
    return chunk;
}

function json_to_ctx(json, ctx){
    ctx || (ctx = new Map());
    for(let i = 0, entry, map; i < json.length; i++) {
        entry = json[i];
        map = ctx.get(entry[0]);
        ctx.set(entry[0], json_to_map(entry[1], map));
    }
    return ctx;
}

function reg_to_json(reg){
    let chunk = [];
    let json = [];
    for(const key of reg.keys()){
        json.push(key);
        if(json.length === chunk_size_reg){
            chunk.push(json);
            json = [];
        }
    }
    json.length && chunk.push(json);
    return chunk;
}

function json_to_reg(json, reg){
    reg || (reg = new Set());
    for(let i = 0; i < json.length; i++) {
        reg.add(json[i]);
    }
    return reg;
}

/**
 * @this {Index|Document}
 */

function save(callback, field, key, chunk, index_doc, index_obj, index_prt = 0){

    const is_arr = chunk && chunk.constructor === Array;
    const data = is_arr ? chunk.shift() : chunk;
    if(!data){
        return this.export(
            callback,
            field,
            index_doc,
            index_obj + 1
        );
    }

    const res = callback(
        (field ? field + "." : "") + (index_prt + 1) + "." + key,
        JSON.stringify(data)
    );

    if(res && res["then"]){
        const self = this;
        return res["then"](function(){
            return save.call(self,
                callback,
                field,
                key,
                is_arr ? chunk : null,
                index_doc,
                index_obj,
                index_prt + 1
            );
        });
    }

    return save.call(this,
        callback,
        field,
        key,
        is_arr ? chunk : null,
        index_doc,
        index_obj,
        index_prt + 1
    );
}

/**
 * @param {function(string,string):Promise|void} callback
 * @param {string|null=} field
 * @param {number=} index_doc
 * @param {number=} index_obj
 * @this {Index}
 */

export function exportIndex(callback, field, index_doc, index_obj = 0){

    let key, chunk;

    switch(index_obj){

        case 0:

            key = "reg";
            chunk = reg_to_json(this.reg);
            break;

        case 1:

            // todo
            key = "cfg";
            chunk = {};
            break;

        case 2:

            key = "map";
            chunk = map_to_json(this.map, this.reg.size);
            break;

        case 3:

            key = "ctx";
            chunk = ctx_to_json(this.ctx, this.reg.size);
            break;

        default:

            return;
    }

    return save.call(this,
        callback,
        field,
        key,
        chunk,
        index_doc,
        index_obj
    );
}

/**
 * @param {string} key
 * @param {string|*} data
 * @this {Index}
 */

export function importIndex(key, data){

    if(!data){
        return;
    }
    if(is_string(data)){
        data = JSON.parse(/** @type {string} */(data));
    }

    const split = key.split(".");
    if(split[split.length - 1] === "json"){
        split.pop();
    }
    key = split.length > 1 ? split[1] : split[0];

    switch(key){

        case "cfg":
            // todo
            break;

        case "reg":

            // fast update isn't supported by export/import
            this.fastupdate = false;
            this.reg = json_to_reg(data, this.reg);
            break;

        case "map":

            this.map = json_to_map(data, this.map);
            break;

        case "ctx":

            this.ctx = json_to_ctx(data, this.ctx);
            break;
    }
}

/**
 * @param {function(string,string):Promise|void} callback
 * @param {string|null=} field
 * @param {number=} index_doc
 * @param {number=} index_obj
 * @this {Document}
 */

export function exportDocument(callback, field, index_doc = 0, index_obj = 0){

    if(index_doc < this.field.length){

        const field = this.field[index_doc];
        const idx = this.index.get(field);
        // start from index 1, because document indexes does not additionally store register
        const res = idx.export(callback, field, index_doc, index_obj = 1);

        if(res && res["then"]){
            const self = this;
            return res["then"](function(){
                return self.export(callback, field, index_doc + 1);
            });
        }

        return this.export(callback, field, index_doc + 1);
    }
    else{

        let key, chunk;

        switch(index_obj){

            case 0:

                key = "reg";
                chunk = reg_to_json(this.reg);
                field = null;
                break;

            case 1:

                key = "tag";
                chunk = ctx_to_json(this.tag, this.reg.size);
                field = null;
                break;

            case 2:

                key = "doc";
                chunk = map_to_json(this.store);
                field = null;
                break;

            case 3:

                key = "cfg";
                chunk = {};
                field = null;
                break;

            default:

                return;
        }

        return save.call(this,
            callback,
            field,
            key,
            chunk,
            index_doc,
            index_obj
        );
    }
}

/**
 * @param key
 * @param {string|*} data
 * @this {Document}
 */

export function importDocument(key, data){

    if(!data){
        return;
    }
    if(is_string(data)){
        data = JSON.parse(/** @type {string} */(data));
    }

    const split = key.split(".");
    if(split[split.length - 1] === "json"){
        split.pop();
    }
    const field = split.length > 2 ? split[0] : "";
    key = split.length > 2 ? split[2] : split[1];

    if(!field){

        switch(key){

            case "reg":

                // fast update isn't supported by export/import
                this.fastupdate = false;
                this.reg = json_to_reg(data, this.reg);

                for(let i = 0, idx; i < this.field.length; i++){
                    idx = this.index.get(this.field[i]);
                    idx.fastupdate = false;
                    idx.reg = this.reg;
                }

                break;

            case "tag":

                this.tag = json_to_ctx(data, this.tag);
                break;

            case "doc":

                this.store = json_to_map(data, this.store);
                break;

            case "cfg":

                break;

        }
    }
    else{

        return this.index.get(field).import(key, data);
    }
}

/*
reg: "1,2,3,4,5,6,7,8,9"
map: "gulliver:1,2,3|4,5,6|7,8,9;"
ctx: "gulliver+travel:1,2,3|4,5,6|7,8,9;"
*/

/**
 * @this Index
 * @param {boolean} withFunctionWrapper
 * @return {string}
 */

export function serialize(withFunctionWrapper = true){

    if(!this.reg.size) return "";

    let reg = '';
    let type = "";
    for(const key of this.reg.keys()){
        type || (type = typeof key);
        reg += (reg ? ',' : '') + (type === "string" ? '"' + key + '"' : key);
    }
    reg = 'index.reg=new Set([' + reg + ']);';

    let map = '';
    for(const item of this.map.entries()){
        const key = item[0];
        const value = item[1];
        let res = '';
        for(let i = 0, ids; i < value.length; i++){
            ids = value[i] || [''];
            let str = '';
            for(let j = 0; j < ids.length; j++){
                str += (str ? ',' : '') + (type === "string" ? '"' + ids[j] + '"' : ids[j]);
            }
            str = '[' + str + ']';
            res += (res ? ',' : '') + str;
        }
        res = '["' + key + '",[' + res + ']]';
        map += (map ? ',' : '') + res;
    }
    map = "index.map=new Map([" + map + "]);";

    let ctx = '';
    for(const context of this.ctx.entries()){
        const key_ctx = context[0];
        const value_ctx = context[1];

        for(const item of value_ctx.entries()){
            const key = item[0];
            const value = item[1];

            let res = '';
            for(let i = 0, ids; i < value.length; i++){
                ids = value[i] || [''];
                let str = '';
                for(let j = 0; j < ids.length; j++){
                    str += (str ? ',' : '') + (type === "string" ? '"' + ids[j] + '"' : ids[j]);
                }
                str = '[' + str + ']';
                res += (res ? ',' : '') + str;
            }
            res = 'new Map([["' + key + '",[' + res + ']]])';
            res = '["' + key_ctx + '",' + res + ']';
            ctx += (ctx ? ',' : '') +  res;
        }
    }
    ctx = "index.ctx=new Map([" + ctx + "]);";

    return withFunctionWrapper
        ? "function inject(index){" + reg + map + ctx + "}"
        : reg + map + ctx
}
