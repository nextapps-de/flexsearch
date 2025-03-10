// TODO return promises instead of inner await

import Index from "./index.js";
import Document from "./document.js";
import { create_object, is_string } from "./common.js";

function async(callback, self, field, key, index_doc, index, data, on_done){

    //setTimeout(function(){

        const res = callback(field ? field + "." + key : key, JSON.stringify(data));

        // await isn't supported by ES5

        if(res && res["then"]){

            res["then"](function(){

                self.export(callback, self, field, index_doc, index + 1, on_done);
            })
        }
        else{

            self.export(callback, self, field, index_doc, index + 1, on_done);
        }
    //});
}

/**
 * @param callback
 * @param self
 * @param field
 * @param index_doc
 * @param index
 * @param on_done
 * @this {Index|Document}
 */

export function exportIndex(callback, self, field, index_doc, index, on_done){

    let return_value = true
    if (typeof on_done === 'undefined') {
        return_value = new Promise((resolve) => {
            on_done = resolve
        })
    }

    let key, data;

    switch(index || (index = 0)){

        case 0:

            key = "reg";

            // fastupdate isn't supported by export

            if(this.fastupdate){

                data = create_object();

                for(let key of this.reg.keys()){

                    data[key] = 1;
                }
            }
            else{

                data = this.reg;
            }

            break;

        case 1:

            key = "cfg";
            data = {
                "doc": 0,
                "opt": this.optimize ? 1 : 0
            };

            break;

        case 2:

            key = "map";
            data = this.map;
            break;

        case 3:

            key = "ctx";
            data = this.ctx;
            break;

        default:

            if (typeof field === 'undefined' && on_done) {

                on_done();
            }

            return;
    }

    async(callback, self || this, field, key, index_doc, index, data, on_done);

    return return_value;
}

/**
 * @this Index
 */

export function importIndex(key, data){

    if(!data){

        return;
    }

    if(is_string(data)){

        data = JSON.parse(data);
    }

    switch(key){

        case "cfg":

            this.optimize = !!data["opt"];
            break;

        case "reg":

            // fastupdate isn't supported by import

            this.fastupdate = false;
            this.reg = data;
            break;

        case "map":

            this.map = data;
            break;

        case "ctx":

            this.ctx = data;
            break;
    }
}

/**
 * @this Document
 */

export function exportDocument(callback, self, field, index_doc, index, on_done){

    let return_value
    if (typeof on_done === 'undefined') {
        return_value = new Promise((resolve) => {
            on_done = resolve
        })
    }

    index || (index = 0);
    index_doc || (index_doc = 0);

    if(index_doc < this.field.length){

        const field = this.field[index_doc];
        const idx = this.index[field];

        self = this;

        //setTimeout(function(){

            if(!idx.export(callback, self, index ? field/*.replace(":", "-")*/ : "", index_doc, index++, on_done)){

                index_doc++;
                index = 1;

                self.export(callback, self, field, index_doc, index, on_done);
            }
        //});
    }
    else{

        let key, data;

        switch(index){

            case 1:

                key = "tag";
                data = this.tagindex;
                field = null;
                break;

            case 2:

                key = "store";
                data = this.store;
                field = null;
                break;

            // case 3:
            //
            //     key = "reg";
            //     data = this.register;
            //     break;

            default:

                on_done();
                return;
        }

        async(callback, this, field, key, index_doc, index, data, on_done);
    }
    
    return return_value
}

/**
 * @this Document
 */

export function importDocument(key, data){

    if(!data){

        return;
    }

    if(is_string(data)){

        data = JSON.parse(data);
    }

    switch(key){

        case "tag":

            this.tagindex = data;
            break;

        case "reg":

            // fastupdate isn't supported by import

            this.fastupdate = false;
            this.reg = data;

            for(let i = 0, index; i < this.field.length; i++){

                index = this.index[this.field[i]];
                index.reg = data;
                index.fastupdate = false;
            }

            break;

        case "store":

            this.store = data;
            break;

        default:

            key = key.split(".");
            const field = key[0];
            key = key[1];

            if(field && key){

                this.index[field].import(key, data);
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
