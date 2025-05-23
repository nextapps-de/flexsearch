// COMPILER BLOCK -->
import {
    SUPPORT_STORE,
    SUPPORT_TAGS,
    SUPPORT_WORKER
} from "./config.js";
import { IntermediateSearchResults } from "./type.js";
// <-- COMPILER BLOCK
import Index from "./index.js";
import Document from "./document.js";
import { KeystoreMap, KeystoreSet } from "./keystore.js";
import { is_string } from "./common.js";

const chunk_size_reg = 250000;
const chunk_size_map = 5000;
const chunk_size_ctx = 1000;

/**
 * @param {Map<IntermediateSearchResults>|KeystoreMap<IntermediateSearchResults>} map
 * @param {number=} size
 * @return {Array<Object>}
 */
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

/**
 * @param {Array<Object>} json
 * @param {Map<IntermediateSearchResults>|KeystoreMap<IntermediateSearchResults>} map
 * @return {Map<IntermediateSearchResults>|KeystoreMap<IntermediateSearchResults>}
 */
function json_to_map(json, map){
    map || (map = new Map());
    for(let i = 0, entry; i < json.length; i++) {
        entry = json[i];
        map.set(entry[0], entry[1]);
    }
    return /** @type {Map} */ (map);
}

/**
 * @param {Map<Map<IntermediateSearchResults>>|KeystoreMap<KeystoreMap<IntermediateSearchResults>>} ctx
 * @param {number=} size
 * @return {Array<Object>}
 */
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

/**
 * @param {Array<Object>} json
 * @param {Map<Map<IntermediateSearchResults>>|KeystoreMap<KeystoreMap<IntermediateSearchResults>>} ctx
 * @return {Map<Map<IntermediateSearchResults>>|KeystoreMap<KeystoreMap<IntermediateSearchResults>>}
 */
function json_to_ctx(json, ctx){
    ctx || (ctx = new Map());
    for(let i = 0, entry, map; i < json.length; i++) {
        entry = json[i];
        map = ctx.get(entry[0]);
        ctx.set(entry[0], json_to_map(entry[1], map));
    }
    return ctx;
}

/**
 * @param {
 *   Set<string|number>|
 *   Map<Array<string|number>>|
 *   KeystoreSet<string|number>|
 *   KeystoreMap<Array<string|number>>
 * } reg
 * @return {Array<Array<string|number>>}
 */
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

/**
 * @param {Array<string|number>} json
 * @param {
 *   Set<string|number>|
 *   Map<Array<string|number>>|
 *   KeystoreSet<string|number>|
 *   KeystoreMap<Array<string|number>>
 * } reg
 * @return {
 *   Set<string|number>|
 *   KeystoreSet<string|number>
 * }
 */
function json_to_reg(json, reg){
    reg || (reg = new Set());
    for(let i = 0; i < json.length; i++) {
        reg.add(json[i]);
    }
    return /** @type {Set<string|number>} */ (reg);
}

/**
 *
 * @param {function(string, string):Promise|void} callback
 * @param {string|null|void} field
 * @param {string} key
 * @param {Array|null} chunk
 * @param {number} index_doc
 * @param {number} index_obj
 * @param {number=} index_prt
 * @this {Index|Document}
 * @return {Promise}
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
 * @param {!string|null=} _field
 * @param {number=} _index_doc
 * @param {number=} _index_obj
 * @this {Index}
 */

export function exportIndex(callback, _field, _index_doc = 0, _index_obj = 0){

    let key, chunk;

    switch(_index_obj){

        case 0:

            key = "reg";
            chunk = reg_to_json(this.reg);
            break;

        case 1:

            // todo
            key = "cfg";
            chunk = null;
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
        _field,
        key,
        chunk,
        _index_doc,
        _index_obj
    );
}

/**
 * @param {string} key
 * @param {string|Array<Object>=} data
 * @this Index
 */

export function importIndex(key, data){

    if(!data){
        return;
    }
    if(typeof data === "string"){
        data = /** @type {Array<Object>} */(
            JSON.parse(/** @type {string} */(data))
        );
    }

    const split = key.split(".");
    if(split[split.length - 1] === "json"){
        split.pop();
    }
    if(split.length === 3){
        split.shift();
    }
    key = split.length > 1 ? split[1] : split[0];

    switch(key){

        case "cfg":
            // todo
            break;

        case "reg":

            // fast update isn't supported by export/import
            this.fastupdate = false;
            this.reg = json_to_reg(/** @type {Array<string|number>} */ (data), this.reg);
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
 * @param {string|null=} _field
 * @param {number=} _index_doc
 * @param {number=} _index_obj
 * @this {Document}
 */

export function exportDocument(callback, _field, _index_doc = 0, _index_obj = 0){

    if(_index_doc < this.field.length){

        const field = this.field[_index_doc];
        const idx = this.index.get(field);
        // start from index 1, because document indexes does not additionally store register
        const res = idx.export(callback, field, _index_doc, _index_obj = 1);

        if(res && res["then"]){
            const self = this;
            return res["then"](function(){
                return self.export(callback, field, _index_doc + 1);
            });
        }

        return this.export(callback, field, _index_doc + 1);
    }
    else{

        let key, chunk;

        switch(_index_obj){

            case 0:

                key = "reg";
                chunk = reg_to_json(this.reg);
                _field = null;
                break;

            case SUPPORT_TAGS && 1:

                key = "tag";
                chunk = this.tag && ctx_to_json(this.tag, this.reg.size);
                _field = null;
                break;

            case SUPPORT_STORE && 2:

                key = "doc";
                chunk = this.store && map_to_json(
                    /** @type {Map<IntermediateSearchResults>} */ (this.store)
                );
                _field = null;
                break;

            // case 3:
            //
            //     key = "cfg";
            //     chunk = null;
            //     _field = null;
            //     break;

            default:

                return;
        }

        return save.call(this,
            callback,
            _field,
            key,
            /** @type {Array|null} */ (chunk || null),
            _index_doc,
            _index_obj
        );
    }
}

/**
 * @param {!string} key
 * @param {string|Array<Object>} data
 * @this {Document}
 */

export function importDocument(key, data){

    const split = key.split(".");
    if(split[split.length - 1] === "json"){
        split.pop();
    }
    const field = split.length > 2 ? split[0] : "";
    const ref = split.length > 2 ? split[2] : split[1];

    // trigger the import for worker field indexes
    if(SUPPORT_WORKER && this.worker && field){
        return this.index.get(field).import(key);
    }

    if(!data){
        return;
    }
    if(typeof data === "string"){
        data = /** @type {Array<Object>} */(
            JSON.parse(/** @type {string} */(data))
        );
    }

    if(!field){

        switch(ref){

            case "reg":

                // fast update isn't supported by export/import
                this.fastupdate = false;
                this.reg = json_to_reg(/** @type {Array<string|number>} */ (data), this.reg);

                for(let i = 0, idx; i < this.field.length; i++){
                    idx = this.index.get(this.field[i]);
                    idx.fastupdate = false;
                    idx.reg = this.reg;
                }

                // trigger the import for worker field indexes
                if(SUPPORT_WORKER && this.worker){

                    const promises = [];
                    const self = this;

                    for(const index of this.index.values()){
                        // const ref = item[0];
                        // const index = item[1];
                        promises.push(index.import(key));
                        //this.index.get(field).import(key);
                    }

                    return Promise.all(promises);
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

        return this.index.get(field).import(ref, data);
    }
}

/*
reg: "1,2,3,4,5,6,7,8,9"
map: "gulliver:1,2,3|4,5,6|7,8,9;"
ctx: "gulliver+travel:1,2,3|4,5,6|7,8,9;"
*/

/**
 * @this {Index}
 * @param {boolean} withFunctionWrapper
 * @return {string}
 */

export function serialize(withFunctionWrapper = true){

    let reg = '';
    let map = '';
    let ctx = '';

    if(this.reg.size){

        let type;
        for(const key of this.reg.keys()){
            type || (type = typeof key);
            reg += (reg ? ',' : '') + (type === "string" ? '"' + key + '"' : key);
        }
        reg = 'index.reg=new Set([' + reg + ']);';

        map = parse_map(this.map, type);
        map = "index.map=new Map([" + map + "]);";

        for(const context of this.ctx.entries()){
            const key_ctx = context[0];
            const value_ctx = context[1];
            let ctx_map = parse_map(value_ctx, type);
            ctx_map = "new Map([" + ctx_map + "])";
            ctx_map = '["' + key_ctx + '",' + ctx_map + ']';
            ctx += (ctx ? ',' : '') + ctx_map;
        }
        ctx = "index.ctx=new Map([" + ctx + "]);";
    }

    return withFunctionWrapper
        ? "function inject(index){" + reg + map + ctx + "}"
        : reg + map + ctx
}

function parse_map(map, type){
    let result = '';
    for(const item of map.entries()){
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
        result += (result ? ',' : '') + res;
    }
    return result;
}