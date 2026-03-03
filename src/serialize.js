// COMPILER BLOCK -->
import {
    SUPPORT_STORE,
    SUPPORT_TAGS,
    SUPPORT_WORKER,
    SUPPORT_SERIALIZE,
    SUPPORT_CHARSET,
    SUPPORT_ENCODER,
    SUPPORT_ASYNC,
    SUPPORT_KEYSTORE
} from "./config.js";
import { IntermediateSearchResults } from "./type.js";
// <-- COMPILER BLOCK
import Index from "./index.js";
import Document from "./document.js";
import Charset from "./charset.js";
import Encoder from "./encoder.js";
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
        json.push([key, map_to_json(value)[0] || []]);
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
 * Find the name of a Charset preset by object reference.
 * @param {*} encoderOpt
 * @return {string|null}
 */
function find_charset_name(encoderOpt){
    if(!encoderOpt || typeof encoderOpt === "string") return null;
    const keys = Object.keys(Charset);
    for(let i = 0; i < keys.length; i++){
        if(Charset[keys[i]] === encoderOpt) return keys[i];
    }
    return null;
}

/**
 * Serialize an encoder option to a string key for JSON export/import.
 * @param {*} encoderOpt
 * @return {string|null}
 */
function serialize_encoder_to_str(encoderOpt){
    if(!encoderOpt) return null;
    if(typeof encoderOpt === "string") return encoderOpt;
    const name = find_charset_name(encoderOpt);
    if(name) return name;
    if(typeof encoderOpt === "function") return encoderOpt.toString();
    return null;
}

/**
 * Serialize an encoder option to a JS expression for inject function bodies.
 * @param {*} encoderOpt
 * @param {string} charsetRef - JS variable name for Charset
 * @return {string|null}
 */
function serialize_encoder_to_js(encoderOpt, charsetRef){
    if(!encoderOpt) return null;
    if(typeof encoderOpt === "string") return charsetRef + '["' + encoderOpt + '"]';
    const name = find_charset_name(encoderOpt);
    if(name) return charsetRef + '["' + name + '"]';
    if(typeof encoderOpt === "function") return encoderOpt.toString();
    return null;
}

/**
 * Build an Index config as a JS object literal string.
 * @param {Index} index
 * @param {string} charsetRef
 * @return {string}
 */
function index_config_to_js(index, charsetRef){
    const parts = [];
    if(index.tokenize && index.tokenize !== "strict"){
        parts.push('tokenize:"' + index.tokenize + '"');
    }
    if(index.resolution !== undefined && index.resolution !== 9){
        parts.push("resolution:" + index.resolution);
    }
    if(index.depth){
        const ctxParts = ["depth:" + index.depth];
        if(!index.bidirectional) ctxParts.push("bidirectional:false");
        if(index.resolution_ctx !== undefined && index.resolution_ctx !== 3){
            ctxParts.push("resolution:" + index.resolution_ctx);
        }
        parts.push("context:{" + ctxParts.join(",") + "}");
    }
    if(index.rtl) parts.push("rtl:true");
    if(SUPPORT_SERIALIZE && index._encoderOpt){
        const expr = serialize_encoder_to_js(index._encoderOpt, charsetRef);
        if(expr) parts.push("encoder:" + expr);
    }
    if(index.score) parts.push("score:" + index.score.toString());
    if(SUPPORT_ASYNC && index.priority && index.priority !== 4) parts.push("priority:" + index.priority);
    if(SUPPORT_KEYSTORE && index.keystore) parts.push("keystore:" + index.keystore);
    return "{" + parts.join(",") + "}";
}

/**
 * Build an Index config as a plain object for JSON export.
 * @param {Index} index
 * @return {Object}
 */
function index_config_to_obj(index){
    const cfg = {};
    if(index.tokenize && index.tokenize !== "strict") cfg.tokenize = index.tokenize;
    if(index.resolution !== 9) cfg.resolution = index.resolution;
    if(index.depth){
        cfg.context = { depth: index.depth };
        if(!index.bidirectional) cfg.context.bidirectional = false;
        if(index.resolution_ctx !== 3) cfg.context.resolution = index.resolution_ctx;
    }
    if(index.rtl) cfg.rtl = true;
    if(SUPPORT_SERIALIZE && index._encoderOpt){
        const str = serialize_encoder_to_str(index._encoderOpt);
        if(str) cfg.encoder = str;
    }
    if(index.score) cfg.score = index.score.toString();
    if(SUPPORT_ASYNC && index.priority && index.priority !== 4) cfg.priority = index.priority;
    if(SUPPORT_KEYSTORE && index.keystore) cfg.keystore = index.keystore;
    return cfg;
}

/**
 * Build a Document config as a JS object literal string for inject functions.
 * @param {Document} doc
 * @param {string} charsetRef
 * @return {string}
 */
function document_config_to_js(doc, charsetRef){
    const idField = (SUPPORT_SERIALIZE && doc._cfgKey) || doc.key || "id";
    let indexFields = "";
    for(let i = 0; i < doc.field.length; i++){
        const fieldName = doc.field[i];
        const fieldIdx = doc.index.get(fieldName);
        const inner = fieldIdx ? index_config_to_js(fieldIdx, charsetRef).slice(1, -1) : "";
        indexFields += (indexFields ? "," : "") + '{field:"' + fieldName + '"' + (inner ? "," + inner : "") + "}";
    }
    const parts = ['id:"' + idField + '"'];
    if(indexFields) parts.push("index:[" + indexFields + "]");
    if(SUPPORT_TAGS && doc.tagfield && doc.tagfield.length){
        let tagFields = "";
        for(let i = 0; i < doc.tagfield.length; i++){
            tagFields += (tagFields ? "," : "") + '{field:"' + doc.tagfield[i] + '"}';
        }
        parts.push("tag:[" + tagFields + "]");
    }
    if(SUPPORT_STORE && doc.store !== null) parts.push("store:true");
    return "{document:{" + parts.join(",") + "}}";
}

/**
 * Build a Document config as a plain object for JSON export.
 * @param {Document} doc
 * @return {Object}
 */
function document_config_to_export_obj(doc){
    const cfg = {
        id: (SUPPORT_SERIALIZE && doc._cfgKey) || doc.key || "id",
        fields: []
    };
    for(let i = 0; i < doc.field.length; i++){
        const fieldName = doc.field[i];
        const fieldIdx = doc.index.get(fieldName);
        const fieldCfg = { field: fieldName };
        if(fieldIdx){
            Object.assign(fieldCfg, index_config_to_obj(fieldIdx));
        }
        cfg.fields.push(fieldCfg);
    }
    if(SUPPORT_TAGS && doc.tagfield && doc.tagfield.length){
        cfg.tagfields = doc.tagfield.slice();
    }
    if(SUPPORT_STORE && doc.store !== null) cfg.store = true;
    return cfg;
}

/**
 * Apply a serialized config object to an Index instance.
 * @param {Index} index
 * @param {Object} cfg
 */
function apply_index_cfg(index, cfg){
    if(cfg.tokenize) index.tokenize = cfg.tokenize;
    if(cfg.resolution !== undefined) index.resolution = cfg.resolution;
    if(cfg.context){
        index.depth = cfg.context.depth || 0;
        if(cfg.context.bidirectional !== undefined) index.bidirectional = cfg.context.bidirectional;
        if(cfg.context.resolution !== undefined) index.resolution_ctx = cfg.context.resolution;
    }
    if(cfg.rtl !== undefined) index.rtl = cfg.rtl;
    if(cfg.encoder){
        let encoderOpt;
        const encoderStr = cfg.encoder;
        if(typeof encoderStr === "string" && SUPPORT_CHARSET && Charset[encoderStr]){
            encoderOpt = Charset[encoderStr];
        } else if(typeof encoderStr === "string"){
            try { encoderOpt = new Function("return (" + encoderStr + ")")(); } catch(e){}
        }
        if(encoderOpt){
            index.encoder = encoderOpt.encode
                ? encoderOpt
                : (SUPPORT_ENCODER && typeof encoderOpt === "object"
                    ? new Encoder(encoderOpt)
                    : { encode: encoderOpt });
            if(SUPPORT_SERIALIZE) index._encoderOpt = cfg.encoder;
        }
    }
    if(cfg.score && typeof cfg.score === "string"){
        try {
            const scoreFn = new Function("return (" + cfg.score + ")")();
            if(typeof scoreFn === "function") index.score = scoreFn;
        } catch(e){}
    }
    if(SUPPORT_ASYNC && cfg.priority !== undefined) index.priority = cfg.priority;
    if(SUPPORT_KEYSTORE && cfg.keystore){
        const ks = cfg.keystore;
        index.keystore = ks;
        // Replace empty map/ctx with Keystore variants (populated in subsequent imports)
        if(!index.map.size) index.map = new KeystoreMap(ks);
        if(!index.ctx.size) index.ctx = new KeystoreMap(ks);
    }
}

/**
 * Apply a serialized config object to a Document instance.
 * Initializes fields/tags/store only when the document has no data yet.
 * @param {Document} doc
 * @param {Object} cfg
 */
function apply_document_cfg(doc, cfg){
    if(cfg.id || cfg.key) doc.key = cfg.id || cfg.key;
    if(!doc.field.length && cfg.fields && cfg.fields.length){
        for(let i = 0; i < cfg.fields.length; i++){
            const fc = cfg.fields[i];
            // Support both old format (string) and new format (object with .field)
            const fieldName = typeof fc === "string" ? fc : fc.field;
            doc.field.push(fieldName);
            // Reconstruct tree entry so new documents can be indexed after import
            const parts = fieldName.split(":");
            doc.tree[i] = parts.length > 1 ? parts : parts[0];
            if(!doc.index.has(fieldName)){
                const idx = new Index({}, doc.reg);
                if(typeof fc === "object") apply_index_cfg(idx, fc);
                doc.index.set(fieldName, idx);
            }
        }
    }
    if(SUPPORT_TAGS && cfg.tagfields && cfg.tagfields.length && !doc.tag){
        if(!doc.tagtree) doc.tagtree = [];
        doc.tag = new Map();
        doc.tagfield = cfg.tagfields;
        for(let i = 0; i < cfg.tagfields.length; i++){
            const parts = cfg.tagfields[i].split(":");
            doc.tagtree[i] = parts.length > 1 ? parts : parts[0];
            doc.tag.set(cfg.tagfields[i], new Map());
        }
    }
    if(SUPPORT_STORE && cfg.store && !doc.store){
        doc.store = new Map();
    }
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

            key = "cfg";
            chunk = [index_config_to_obj(this)];
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
            apply_index_cfg(this, data);
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

export function exportDocument(callback, _field, _index_doc = -1, _index_obj = 0){

    if(_index_doc === -1){
        const cfgObj = document_config_to_export_obj(this);
        const res = callback("1.cfg", JSON.stringify(cfgObj));
        if(res && res["then"]){
            const self = this;
            return res["then"](function(){
                return self.export(callback, null, 0, 0);
            });
        }
        return this.export(callback, null, 0, 0);
    }

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

                apply_document_cfg(this, data);
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
 * @param {boolean} withCfg - When true, embed config and return a self-contained function(FlexSearch)
 * @return {string}
 */

export function serializeIndex(withFunctionWrapper = true, withCfg = false){

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

    if(withCfg){
        const cfgJs = index_config_to_js(this, "Charset");
        const body = "const {Index,Charset}=FlexSearch;const index=new Index(" + cfgJs + ");" + reg + map + ctx + "return index;";
        return withFunctionWrapper
            ? "function inject(FlexSearch){" + body + "}"
            : body;
    }

    return withFunctionWrapper
        ? "function inject(index){" + reg + map + ctx + "}"
        : reg + map + ctx;
}

function parse_map(map, type){
    let result = '';
    for(const item of map.entries()){
        const key = item[0];
        const value = item[1];
        let res = '';
        for(let i = 0, ids; i < value.length; i++){
            ids = value[i];
            let str = '';
            if(ids && ids.length){
                for(let j = 0; j < ids.length; j++){
                    str += (str ? ',' : '') + (type === "string" ? '"' + ids[j] + '"' : ids[j]);
                }
                str = '[' + str + ']';
            }
            else{
                str = 'null'; // Preserve null/empty for array structure
            }
            res += (res ? ',' : '') + str;
        }
        res = '["' + key + '",[' + res + ']]';
        result += (result ? ',' : '') + res;
    }
    return result;
}

/**
 * Helper: Serialize a Map<tagValue, Array<ID>> for tags
 * @param {Map} tagMap - inner map: tagValue → Array<ID>
 * @param {string} type - "string" or "number"
 * @return {string}
 */
function parse_tag_map(tagMap, type){
    let result = '';
    for(const item of tagMap.entries()){
        const key = item[0];   // tag value (e.g., "1894")
        const ids = item[1];   // flat Array<ID> (e.g., ["tt0000001"])
        let idsStr = '';
        for(let j = 0; j < ids.length; j++){
            idsStr += (idsStr ? ',' : '') + (type === "string" ? '"' + ids[j] + '"' : ids[j]);
        }
        result += (result ? ',' : '') + '["' + key + '",[' + idsStr + ']]';
    }
    return result;
}

/**
 * Serialize a Document's multi-field indexes with optional streaming compression
 * @this {Document}
 * @param {boolean=} withFunctionWrapper - Wrap in function(doc) or return raw statements
 * @param {boolean=} withCompression - Apply gzip compression
 * @param {boolean=} withCfg - When true, embed config and return a self-contained function(FlexSearch)
 * @return {string|Promise<Uint8Array>|Uint8Array}
 */
export function serializeDocument(withFunctionWrapper = true, withCompression = false, withCfg = false){
    
    let statements = '';
    let type = undefined;
    
    // Serialize shared registry once
    if(this.reg && this.reg.size){
        let reg = '';
        for(const key of this.reg.keys()){
            type || (type = typeof key);
            reg += (reg ? ',' : '') + (type === "string" ? '"' + key + '"' : key);
        }
        statements += 'doc.reg=new Set([' + reg + ']);';
        // Sync the shared reg reference into each field index (mirrors importDocument "reg" case)
        for(const fieldName of this.field){
            statements += 'doc.index.get("' + fieldName + '").reg=doc.reg;';
        }
    }
    
    // Serialize each field index
    if(this.index && this.index.size){
        for(const fieldName of this.field){
            const index = this.index.get(fieldName);
            if(!index) continue;
            
            // Only serialize if field index has map data
            if(index.map && index.map.size){
                let map = parse_map(index.map, type);
                if(map){
                    statements += 'doc.index.get("' + fieldName + '").map=new Map([' + map + ']);';
                }
                
                // Serialize ctx if present
                if(index.ctx && index.ctx.size){
                    let ctx = '';
                    for(const context of index.ctx.entries()){
                        const key_ctx = context[0];
                        const value_ctx = context[1];
                        let ctx_map = parse_map(value_ctx, type);
                        if(ctx_map){
                            ctx_map = "new Map([" + ctx_map + "])";
                            ctx_map = '["' + key_ctx + '",' + ctx_map + ']';
                            ctx += (ctx ? ',' : '') + ctx_map;
                        }
                    }
                    if(ctx){
                        statements += 'doc.index.get("' + fieldName + '").ctx=new Map([' + ctx + ']);';
                    }
                }
            }
        }
    }
    
    // Serialize tags if present
    if(SUPPORT_TAGS && this.tag && this.tagfield){
        for(let i = 0; i < this.tagfield.length; i++){
            const tagField = this.tagfield[i];
            const tagMap = this.tag.get(tagField);
            if(tagMap && tagMap.size){
                let tag = parse_tag_map(tagMap, type);
                if(tag){
                    statements += 'doc.tag.get("' + tagField + '").clear();' + 
                                  'for(const [k,v] of new Map([' + tag + ']).entries()){doc.tag.get("' + tagField + '").set(k,v);}';
                }
            }
        }
    }
    
    // Serialize store if present
    if(SUPPORT_STORE && this.store && this.store.size){
        let storeData = '';
        for(const item of this.store.entries()){
            const key = item[0];
            const value = item[1];
            const valueJson = JSON.stringify(value);
            storeData += (storeData ? ',' : '') + '[' + (typeof key === "string" ? '"' + key + '"' : key) + ',' + valueJson + ']';
        }
        if(storeData){
            statements += 'for(const [k,v] of new Map([' + storeData + ']).entries()){doc.store.set(k,v);}';
        }
    }
    
    if(withCfg){
        const cfgJs = document_config_to_js(this, "Charset");
        const body = "const {Document,Charset}=FlexSearch;const doc=new Document(" + cfgJs + ");" + statements + "return doc;";
        const result = withFunctionWrapper
            ? "function inject(FlexSearch){" + body + "}"
            : body;
        return withCompression ? compress(result) : result;
    }

    const plain = withFunctionWrapper
        ? "function inject(doc){" + statements + "}"
        : statements;

    return withCompression ? compress(plain) : plain;
}

/**
 * Compress string using gzip
 * @param {string} data - String to compress
 * @return {Promise<Uint8Array>} Compressed data
 */
export async function compress(data){
    if(data instanceof Map) data = JSON.stringify(Array.from(data.entries()));
    const cs = new CompressionStream('gzip');
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const stream = blob.stream().pipeThrough(cs);
    const compressedBuffer = await new Response(stream).arrayBuffer();
    return new Uint8Array(compressedBuffer);
}

/**
 * Decompress gzip-compressed data
 * @param {Uint8Array} data - Compressed data
 * @return {Promise<string>} Decompressed string
 */
export async function decompress(data){
    const ds = new DecompressionStream('gzip');
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const stream = blob.stream().pipeThrough(ds);
    const decompressedBuffer = await new Response(stream).arrayBuffer();
    const decoder = new TextDecoder();
    return decoder.decode(decompressedBuffer);
}