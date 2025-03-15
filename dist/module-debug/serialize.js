import Index from "./index.js";
import Document from "./document.js";
import { create_object, is_string } from "./common.js";

function map_to_json(map) {
    const json = [];
    for (const item of map.entries()) {
        json.push(item);
    }
    return json;
}

function ctx_to_json(ctx) {
    const json = [];
    for (const item of ctx.entries()) {
        json.push(map_to_json(item));
    }
    return json;
}

function reg_to_json(reg) {
    const json = [];
    for (const key of reg.keys()) {
        json.push(key);
    }
    return json;
}

function save(callback, field, key, index_doc, index, data) {

    const res = callback(field ? field + "." + key : key, JSON.stringify(data));

    if (res && res.then) {
        const self = this;
        return res.then(function () {
            return self.export(callback, field, index_doc, index + 1);
        });
    }

    return this.export(callback, field, index_doc, index + 1);
}

/**
 * @param callback
 * @param field
 * @param index_doc
 * @param index
 * @this {Index|Document}
 */

export function exportIndex(callback, field, index_doc, index = 0) {

    let key, data;

    switch (index) {

        case 0:

            key = "reg";
            data = reg_to_json(this.reg);
            break;

        case 1:

            key = "cfg";
            data = {};
            break;

        case 2:

            key = "map";
            data = map_to_json(this.map);
            break;

        case 3:

            key = "ctx";
            data = ctx_to_json(this.ctx);
            break;

        default:

            return;
    }

    return save.call(this, callback, field, key, index_doc, index, data);
}

/**
 * @this Index
 */

export function importIndex(key, data) {

    if (!data) {
        return;
    }
    if (is_string(data)) {
        data = JSON.parse(data);
    }

    switch (key) {

        case "cfg":
            break;

        case "reg":

            // fast update isn't supported by export/import
            this.fastupdate = /* suggest */ /* append: */ /* enrich */!1;
            this.reg = new Set(data);
            break;

        case "map":

            this.map = new Map(data);
            break;

        case "ctx":

            this.ctx = new Map(data);
            break;
    }
}

/**
 * @this Document
 */

export function exportDocument(callback, field, index_doc = 0, index = 0) {

    if (index_doc < this.field.length) {
        const field = this.field[index_doc],
              idx = this.index.get(field),
              res = idx.export(callback, field, index_doc, index = 1);
        // start from index 1, because document indexes does not additionally store register

        if (res && res.then) {
            const self = this;
            return res.then(function () {
                return self.export(callback, field, index_doc + 1, index = 0);
            });
        }

        return this.export(callback, field, index_doc + 1, index = 0);
    } else {

        let key, data;

        switch (index) {

            case 0:

                key = "reg";
                data = reg_to_json(this.reg);
                field = null;
                break;

            case 1:

                key = "tag";
                data = ctx_to_json(this.tag);
                field = null;
                break;

            case 2:

                key = "doc";
                data = map_to_json(this.store);
                field = null;
                break;

            case 3:

                key = "cfg";
                data = {};
                field = null;
                break;

            default:

                return;
        }

        return save.call(this, callback, field, key, index_doc, index, data);
    }
}

/**
 * @this Document
 */

export function importDocument(key, data) {

    if (!data) {
        return;
    }
    if (is_string(data)) {
        data = JSON.parse(data);
    }

    switch (key) {

        case "tag":

            this.tagindex = new Map(data);
            break;

        case "reg":

            // fast update isn't supported by export/import
            this.fastupdate = !1;
            this.reg = new Set(data);

            for (let i = 0, idx; i < this.field.length; i++) {
                idx = this.index.get(this.field[i]);
                idx.fastupdate = !1;
                idx.reg = this.reg;
            }

            break;

        case "doc":

            this.store = new Map(data);
            break;

        default:

            key = key.split(".");
            const field = key[0];
            key = key[1];

            if (field && key) {
                this.index.get(field).import(key, data);
            }
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

export function serialize(withFunctionWrapper = /* tag? */ /* stringify */ /* stringify */ /* single param */ /* skip update: */ /* append: */ /* skip update: */ /* skip_update: */ /* skip deletion */ // splice:
!0 /*await rows.hasNext()*/ /*await rows.hasNext()*/ /*await rows.hasNext()*/) {

    if (!this.reg.size) return "";

    let reg = '',
        type = "";

    for (const key of this.reg.keys()) {
        type || (type = typeof key);
        reg += (reg ? ',' : '') + ("string" == type ? '"' + key + '"' : key);
    }
    reg = 'index.reg=new Set([' + reg + ']);';

    let map = '';
    for (const item of this.map.entries()) {
        const key = item[0],
              value = item[1];

        let res = '';
        for (let i = 0, ids; i < value.length; i++) {
            ids = value[i] || [''];
            let str = '';
            for (let j = 0; j < ids.length; j++) {
                str += (str ? ',' : '') + ("string" == type ? '"' + ids[j] + '"' : ids[j]);
            }
            str = '[' + str + ']';
            res += (res ? ',' : '') + str;
        }
        res = '["' + key + '",[' + res + ']]';
        map += (map ? ',' : '') + res;
    }
    map = "index.map=new Map([" + map + "]);";

    let ctx = '';
    for (const context of this.ctx.entries()) {
        const key_ctx = context[0],
              value_ctx = context[1];


        for (const item of value_ctx.entries()) {
            const key = item[0],
                  value = item[1];


            let res = '';
            for (let i = 0, ids; i < value.length; i++) {
                ids = value[i] || [''];
                let str = '';
                for (let j = 0; j < ids.length; j++) {
                    str += (str ? ',' : '') + ("string" == type ? '"' + ids[j] + '"' : ids[j]);
                }
                str = '[' + str + ']';
                res += (res ? ',' : '') + str;
            }
            res = 'new Map([["' + key + '",[' + res + ']]])';
            res = '["' + key_ctx + '",' + res + ']';
            ctx += (ctx ? ',' : '') + res;
        }
    }
    ctx = "index.ctx=new Map([" + ctx + "]);";

    return withFunctionWrapper ? "function inject(index){" + reg + map + ctx + "}" : reg + map + ctx;
}

// export function exportSnapshot(flexsearch){
//
//     if(!flexsearch.reg.size) return;
//
//     let reg = '';
//     let type = "";
//     for(const key of flexsearch.reg.keys()){
//         type || (type = typeof key);
//         reg += (reg ? ',' : '') + (type === "string" ? '"' + key + '"' : key);
//     }
//     reg = "f.reg=[" + reg + "];";
//
//     let map = '';
//     for(const item of flexsearch.map.entries()){
//         const key = item[0];
//         const value = item[1];
//         let res = '';
//         for(let i = 0, ids; i < value.length; i++){
//             ids = value[i] || [''];
//             let str = '';
//             for(let j = 0; j < ids.length; j++){
//                 str += (str ? ',' : '') + (type === "string" ? '"' + ids[j] + '"' : ids[j]);
//             }
//             str = "[
//             res += (res ? '|' : '') + str;
//         }
//         map += (map ? ';' : '') + key + ':' + res;
//     }
//
//
//     let ctx = '';
//     for(const context of flexsearch.ctx.entries()){
//         const key_ctx = context[0];
//         const value_ctx = context[1];
//
//         for(const item of value_ctx.entries()){
//             const key = item[0];
//             const value = item[1];
//
//             let res = '';
//             for(let i = 0, ids; i < value.length; i++){
//                 ids = value[i] || [''];
//                 let str = '';
//                 for(let j = 0; j < ids.length; j++){
//                     str += (str ? ',' : '') + (type === "string" ? '"' + ids[j] + '"' : ids[j]);
//                 }
//                 res += (res ? '|' : '') + str;
//             }
//             ctx += (ctx ? ';' : '') + key_ctx + '+' + key + ':' + res;
//         }
//     }
//
//     return reg + '#' + map + '#' + ctx;
// }
//
// export function importSnapshot(flexsearch, input){
//
//     if(!input) return;
//
//     let pos_reg = input.indexOf("#");
//     const reg = input.substring(0, pos_reg).split(",");
//     flexsearch.reg = new Set(reg);
//
//     let pos_map = input.indexOf("#", pos_reg + 1);
//     const map = input.substring(pos_reg + 1, pos_map).split(";").map(res => {
//         const split = res.split(":");
//         split[1] = split[1].split("|").map(ids => ids ? ids.split(",") : null);
//         return split;
//     });
//     flexsearch.map = new Map(map);
//
//     input = input.substring(pos_map + 1);
//     if(input){
//         const ctx = input.split(";").map(res => {
//             const split = res.split(":");
//             const context = split[0].split("+");
//             const map = new Map([
//                 [context[1], split[1].split("|").map(ids => ids ? ids.split(",") : null)]
//             ]);
//             return [context[0], map]
//         });
//         flexsearch.ctx = new Map(ctx);
//     }
// }