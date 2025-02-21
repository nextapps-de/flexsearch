import { create_object } from "./common.js";

export function KeystoreObj(bitlength = 8){

    if(!(this instanceof KeystoreObj)){
        return new KeystoreObj(bitlength);
    }

    this.index = new Map();

    if(bitlength > 32){
        this.crc = crc64;
        this.size = BigInt(2**bitlength);
    }
    else{
        this.crc = crc32;
        this.size = 2**bitlength;
    }

    return this.proxy = new Proxy(this, {
        get(target, key) {
            const address = target.crc(key);
            const obj = target.index.get(address);
            return obj && obj[key];
        },
        set(target, key, value){
            const address = target.crc(key);
            let obj = target.index.get(address);
            obj || target.index.set(address, obj = create_object());
            obj[key] = value;
            return true;
        },
        delete(target, key){
            const address = target.crc(key);
            const obj = target.index.get(address);
            obj && delete obj[key];
            return true;
        }
    });
}

KeystoreObj.prototype.clear = function(){
    this.index = create_object();
};

KeystoreObj.prototype.destroy = function(){
    this.index = null;
    this.proxy = null;
};

export function KeystoreArray(bitlength = 8){

    if(!(this instanceof KeystoreArray)){
        return new KeystoreArray(bitlength);
    }

    this.index = [];
    this.length = 0;

    return this.proxy = new Proxy(this, {
        get(target, key) {
            if(key === "length"){
                return target.length;
            }
            if(key === "push"){
                const self = this;
                return function(value){
                    self.set(target, target.length, value);
                }
            }
            if(key === "indexOf"){
                const self = this;
                return function(key){
                    const index = key / 2**30 | 0;
                    const arr = self.index[index];
                    return arr && arr.indexOf(key);
                }
            }
            if(key === "includes"){
                const self = this;
                return function(key){
                    const index = key / 2**30 | 0;
                    const arr = self.index[index];
                    return arr && arr.includes(key);
                }
            }
            if(key === "slice"){
                const self = this;
                return function(start = 0, end){
                    let arr = [];
                    for(let i = 0, index; i < target.index.length; i++){
                        index = target.index[i];
                        if(start >= index.length){
                            start -= index.length;
                        }
                        else{
                            const tmp = index.slice(start, end);
                            tmp.length && (arr = arr.concat(tmp));
                            end -= tmp.length;
                            start = 0;
                            if(!end) break;
                        }
                    }
                    return arr;
                }
            }
            if(key === "splice"){
                const self = this;
                return function(start = 0, end){
                    let arr = [];
                    for(let i = 0, index; i < target.index.length; i++){
                        index = target.index[i];
                        if(start >= index.length){
                            start -= index.length;
                        }
                        else{
                            const tmp = index.splice(start, end);
                            tmp.length && (arr = arr.concat());
                            end -= tmp.length;
                            start = 0;
                            if(!end) break;
                        }
                    }
                    return arr;
                }
            }
            if(typeof key !== "number"){
                // not supported
                return;
            }
            const index = key / 2**30 | 0;
            const arr = target.index[index];
            return arr && arr[key];
        },
        set(target, key, value){
            const index = key / 2**30 | 0;
            const arr = target.index[index] || (target.index[index] = []);
            arr[key] = value;
            target.length++;
            return true;
        },
        has(target, key){
            const index = key / 2**30 | 0;
            const arr = target.index[index];
            return !!(arr && arr[key]);
        },
        delete(target, key){
            const index = key / 2**30 | 0;
            const arr = target.index[index];
            const res = arr && arr.splice(key, 1);
            res.length && target.length--;
            arr.length || target.index.splice(index, 1);
            return res;
        }
    });
}

// export function KeystoreArray(bitlength = 8){
//
//     if(!(this instanceof KeystoreArray)){
//         return new KeystoreArray(bitlength);
//     }
//
//     this.index = new Map();
//     this.length = 0;
//
//     if(bitlength > 32){
//         this.crc = crc64;
//         this.size = BigInt(2**bitlength);
//     }
//     else{
//         this.crc = crc32;
//         this.size = 2**bitlength;
//     }
//
//     return this.proxy = new Proxy(this, {
//         get(target, key) {
//             if(key === "length"){
//                 return target.length;
//             }
//             if(key === "push"){
//                 const self = this;
//                 return function(value){
//                     self.set(target, target.length, value);
//                 }
//             }
//             if(key === "indexOf"){
//                 const self = this;
//                 return function(key){
//                     const address = self.crc(key);
//                     const arr = self.index.get(address);
//                     return arr && arr.indexOf(key);
//                 }
//             }
//             if(key === "includes"){
//                 const self = this;
//                 return function(key){
//                     const address = self.crc(key);
//                     const arr = self.index.get(address);
//                     return arr && arr.includes(key);
//                 }
//             }
//             if(key === "slice"){
//                 const self = this;
//                 return function(start = 0, end){
//                     const limit = end
//                         ? Math.min(end - start, target.length - start)
//                         : target.length - start;
//                     if(limit < 1) return [];
//                     const arr = new Array(limit);
//                     for(let i = 0; i < limit; i++){
//                         // todo improve strategy
//                         arr[i] = self.get(target, start + i);
//                     }
//                     return arr;
//                 }
//             }
//             if(key === "splice"){
//                 const self = this;
//                 return function(start = 0, end){
//                     const limit = end
//                         ? Math.min(end - start, target.length - start)
//                         : target.length - start;
//                     if(limit < 1) return [];
//                     const arr = new Array(limit);
//                     for(let i = 0; i < limit; i++){
//                         // todo improve strategy
//                         arr[i] = self.delete(target, start + i);
//                     }
//                     return arr;
//                 }
//             }
//             const address = target.crc(key);
//             const arr = target.index.get(address);
//             return arr && arr[key];
//         },
//         set(target, key, value){
//             const address = target.crc(key);
//             let arr = target.index.get(address);
//             arr || target.index.set(address, arr = []);
//             arr[key] = value;
//             target.length++;
//             return true;
//         },
//         has(target, key){
//             const address = target.crc(key);
//             const arr = target.index.get(address);
//             return !!(arr && arr[key]);
//         },
//         delete(target, key){
//             const address = target.crc(key);
//             const arr = target.index.get(address);
//             const res = arr && arr.splice(key, 1);
//             res.length
//                 ? target.length--
//                 : target.index.delete(address);
//             return res;
//         }
//     });
// }

KeystoreArray.prototype.clear = function(){
    this.index.length = 0;
};

KeystoreArray.prototype.destroy = function(){
    this.index = null;
    this.proxy = null;
};

export function KeystoreMap(bitlength = 8){

    if(!(this instanceof KeystoreMap)){
        return new KeystoreMap(bitlength);
    }

    this.index = new Map();

    if(bitlength > 32){
        this.crc = crc64;
        this.size = BigInt(2**bitlength);
    }
    else{
        this.crc = crc32;
        this.size = 2**bitlength;
    }
}

KeystoreMap.prototype.get = function(key) {
    const address = this.crc(key);
    const map = this.index.get(address);
    return map && map.get(key);
};

KeystoreMap.prototype.set = function(key, value){
    const address = this.crc(key);
    let map = this.index.get(address);
    map || this.index.set(address, map = new Map());
    map.set(key, value);
};

KeystoreMap.prototype.has = function(key) {
    const address = this.crc(key);
    const map = this.index.get(address);
    return map && map.has(key);
};

KeystoreMap.prototype.delete = function(key){
    const address = this.crc(key);
    const map = this.index.get(address);
    map && (map.size === 1
        ? this.index.delete(address)
        : map.delete(key));
};

KeystoreMap.prototype.clear = function(){
    this.index.clear();
};

KeystoreMap.prototype.destroy = function(){
    this.index = null;
    this.proxy = null;
};

export function KeystoreSet(bitlength = 8){

    if(!(this instanceof KeystoreSet)){
        return new KeystoreSet(bitlength);
    }

    this.index = new Map();

    if(bitlength > 32){
        this.crc = crc64;
        this.size = BigInt(2**bitlength);
    }
    else{
        this.crc = crc32;
        this.size = 2**bitlength;
    }
}

KeystoreSet.prototype.has = function(key) {
    const address = this.crc(key);
    const set = this.index.get(address);
    return set && set.has(key);
};

KeystoreSet.prototype.add = function(key){
    const address = this.crc(key);
    let set = this.index.get(address);
    set || this.index.set(address, set = new Set());
    set.add(key);
};

KeystoreSet.prototype.delete = function(key){
    const address = this.crc(key);
    const set = this.index.get(address);
    set && (set.size === 1
        ? this.index.delete(address)
        : set.delete(key));
};

KeystoreSet.prototype.clear = function(){
    this.index.clear();
};

KeystoreSet.prototype.destroy = function(){
    this.index = null;
    this.proxy = null;
};

// https://www.eevblog.com/forum/embedded-computing/32-bit-crc-is-it-standard/
function crc32(str){
    let crc = 0;
    if(typeof str == "number"){
        crc = str;
    }
    else{
        let i = 0, x;
        for(; i < str.length; i++){
            x = str.charCodeAt(i) ^ crc;
            //x ^= crc;
            crc >>= 8;
            if(x & 0x01) crc ^= 0x77073096;
            if(x & 0x02) crc ^= 0xEE0E612C;
            if(x & 0x04) crc ^= 0x076DC419;
            if(x & 0x08) crc ^= 0x0EDB8832;
            if(x & 0x10) crc ^= 0x1DB71064;
            if(x & 0x20) crc ^= 0x3B6E20C8;
            if(x & 0x40) crc ^= 0x76DC4190;
            if(x & 0x80) crc ^= 0xEDB88320;
        }
    }
    return (crc % this.size).toString(36);
}

// https://stackoverflow.com/questions/60270174/most-efficent-way-to-calculate-crc64-with-reflected-input
let crctbl;

function gentbl(){
    crctbl = [];
    let crc = 0n;
    let b = 0n;
    let i = 0;
    for(let c = 0n; c < 0x100n; c++){
        crc = c;
        for(i = 0; i < 8; i++){
            b = crc & 1n;
            crc >>= 1n;
            // crc64 iso
            crc ^= (0n - b) & 0xd800000000000000n;
            // crc64 ecma
            //crc ^= (0 - b) & 0xc96c5795d7870f42;
        }
        crctbl[c] = crc;
    }
}

function crc64(str){
    let crc;
    if(typeof str == "number"){
        crc = BigInt(str);
    }
    else{
        crctbl || gentbl();
        crc = 0n;
        for(let i = 0, x; i < str.length; i++){
            x = BigInt(str.charCodeAt(i));
            crc = (crc >> 8n) ^ crctbl[(crc & 0xFFn) ^ x];
        }
    }
    return (crc % this.size).toString(36);
}

// https://github.com/glenmurphy/crc64
// const mask8 = 0xFFFFFFFFFFFFFFFFn;
// let crc64_table;
//
// function generateTable() {
//     crc64_table = [];
//     let c = 0n, crc = 0n;
//     for(let i = 0n, j; i < 256n; i++) {
//         crc = 0n;
//         c = i << 56n;
//         for(j = 0; j < 8; j++) {
//             (crc ^ c) & 0x8000000000000000n
//                 ? crc = (crc << 1n) ^ 0x42F0E1EBA9EA3693n // ECMA182 Polynomial
//                 : crc <<= 1n;
//             c <<= 1n;
//         }
//         crc64_table[i] = crc & mask8;
//     }
// }
//
// export function crc64(str) {
//     crc64_table || generateTable();
//     //str = unescape(encodeURIComponent(str)); // convert to UTF8
//     let crc = 0n;
//     for(let i = 0, byte56, index; i < str.length; i++) {
//         byte56 = BigInt(str.charCodeAt(i) & 0xFF) << 56n;
//         crc ^= byte56;
//         index = (crc >> 56n) & 0xFFn;
//         crc = ((crc << 8n) ^ crc64_table[index]) & mask8;
//     }
//     return crc.toString(36);
// }

// https://github.com/metalwarrior665/big-map/tree/master
// export class KeystoreMap{
//     /**
//      * @param {Iterable<any>} [iterable]
//      */
//     constructor(iterable) {
//         this._maps = [new Map()];
//         this._perMapSizeLimit = 2**24;
//
//         if (iterable) {
//             for (const key in iterable) {
//                 this.set(key, iterable[key]);
//             }
//         }
//     }
//     /**
//      * @param {string} key
//      */
//     has(key) {
//         for(let i = 0; i < this._maps.length; i++){
//             if(this._maps[i].has(key)){
//                 return true;
//             }
//         }
//         return false;
//     }
//     /**
//      * @param {string} key
//      * @returns {any | undefined}
//      */
//     get(key) {
//         for(let i = 0, map; i < this._maps.length; i++){
//             if((map = this._maps[i]).has(key)){
//                 return map.get(key);
//             }
//         }
//         return undefined;
//     }
//     /**
//      * @param {string} key
//      * @returns {this}
//      */
//     set(key, value) {
//
//         for(let i = 0, map; i < this._maps.length; i++){
//             if((map = this._maps[i]).has(key)){
//                 map.set(key, value);
//                 return this;
//             }
//         }
//         let map = this._maps[this._maps.length - 1];
//         if (map.size >= this._perMapSizeLimit) {
//             map = new Map();
//             this._maps.push(map);
//         }
//         map.set(key, value);
//         return this;
//     }
//     clear() {
//         for(let i = 0; i < this._maps.length; i++){
//             this._maps[i].clear();
//         }
//         this._maps.length = 1;
//     }
//     /**
//      * @returns {number}
//      */
//     get size() {
//         let size = 0;
//         for(let i = 0; i < this._maps.length; i++){
//             size += this._maps[i].size();
//         }
//         return size;
//     }
//     /**
//      * @private
//      * @param {Exclude<keyof Map<any, any>, 'number'>} type
//      */
//     _reduceSpread(type) {
//         return this._maps.reduce((out, map) => out.concat([...map[type]()]), []);
//     }
//     /**
//      * @returns {any[]}
//      */
//     values() {
//         return this._reduceSpread('values');
//     }
//     /**
//      * @returns {string[]}
//      */
//     keys() {
//         return this._reduceSpread('keys');
//     }
//     /**
//      * @returns {Array<[string, any]>}
//      */
//     entries() {
//         return this._reduceSpread('entries');
//     }
// }
