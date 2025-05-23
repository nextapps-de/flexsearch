import { create_object } from "./common.js";

function _slice(self, start, end, splice){
    let arr = [];
    for(let i = 0, index; i < self.index.length; i++){
        index = self.index[i];
        if(start >= index.length){
            start -= index.length;
        }
        else{
            const tmp = index[splice ? "splice" : "slice"](start, end);
            const length = tmp.length;
            if(length){
                arr = arr.length
                    ? arr.concat(tmp)
                    : tmp;
                end -= length;
                if(splice) self.length -= length;
                if(!end) break;
            }
            start = 0;
        }
    }
    return arr;
}

/**
 * @param arr
 * @constructor
 */

export function KeystoreArray(arr){

    if(!this || this.constructor !== KeystoreArray){
        return new KeystoreArray(arr);
    }

    this.index = arr ? [arr] : [];
    this.length = arr ? arr.length : 0;
    const self = this;

    return /*this.proxy =*/ new Proxy([], {
        get(target, key) {
            if(key === "length"){
                return self.length;
            }
            if(key === "push"){
                return function(value){
                    self.index[self.index.length - 1].push(value);
                    self.length++;
                }
            }
            if(key === "pop"){
                return function(){
                    if(self.length){
                        self.length--;
                        return self.index[self.index.length - 1].pop();
                    }
                }
            }
            if(key === "indexOf"){
                return function(key){
                    let index = 0;
                    for(let i = 0, arr, tmp; i < self.index.length; i++){
                        arr = self.index[i];
                        //if(!arr.includes(key)) continue;
                        tmp = arr.indexOf(key);
                        if(tmp >= 0) return index + tmp;
                        index += arr.length;
                    }
                    return -1;
                }
            }
            if(key === "includes"){
                return function(key){
                    for(let i = 0; i < self.index.length; i++){
                        if(self.index[i].includes(key)){
                            return true;
                        }
                    }
                    return false;
                }
            }
            if(key === "slice"){
                return function(start, end){
                    return _slice(
                        self,
                        start || 0,
                        end || self.length,
                        false
                    );
                }
            }
            if(key === "splice"){
                return function(start, end){
                    return _slice(
                        self,
                        start || 0,
                        end || self.length,
                        // splice:
                        true
                    );
                }
            }
            if(key === "constructor"){
                return Array;
            }
            if(typeof key === "symbol" /*|| isNaN(key)*/){
                // not supported
                return;
            }
            const index = key / (2**31) | 0;
            const arr = self.index[index];
            return arr && arr[key];
        },
        set(target, key, value){
            const index = key / (2**31) | 0;
            const arr = self.index[index] || (self.index[index] = []);
            arr[key] = value;
            self.length++;
            return true;
        }
    });
}

KeystoreArray.prototype.clear = function(){
    this.index.length = 0;
};

// KeystoreArray.prototype.destroy = function(){
//     this.index = null;
//     this.proxy = null;
// };

KeystoreArray.prototype.push = function(val){};

/**
 * @interface
 */
function Keystore() {
    /** @type {Object<number, Map|Set>} */
    this.index;
    /** @type {Array<Map|Set>} */
    this.refs;
    /** @type {number} */
    this.size;
    /** @type {function((string|bigint|number)):number} */
    this.crc;
    /** @type {bigint|number} */
    this.bit;
}

/**
 * @param bitlength
 * @constructor
 * @implements {Keystore}
 */
export function KeystoreMap(bitlength = 8){

    if(!this || this.constructor !== KeystoreMap){
        return new KeystoreMap(bitlength);
    }

    /** @type {Object<number, Map>} */
    this.index = create_object();
    /** @type {Array<Map>} */
    this.refs = [];
    /** @type {number} */
    this.size = 0;

    if(bitlength > 32){
        this.crc = lcg64;
        this.bit = BigInt(bitlength);
    }
    else {
        this.crc = lcg;
        this.bit = bitlength;
    }
}

/** @param {number|string} key */
KeystoreMap.prototype.get = function(key) {
    const address = this.crc(key);
    const map = this.index[address];
    return map && map.get(key);
};

/**
 * @param {number|string} key
 * @param {*} value
 */
KeystoreMap.prototype.set = function(key, value){
    const address = this.crc(key);
    let map = this.index[address];
    if(map){
        let size = map.size;
        map.set(key, value);
        size -= map.size;
        size && this.size++;
    }
    else{
        this.index[address] = map = new Map([[key, value]]);
        this.refs.push(map);
        this.size++;
    }
};

/**
 * @param bitlength
 * @constructor
 * @implements Keystore
 */

export function KeystoreSet(bitlength = 8){

    if(!this || this.constructor !== KeystoreSet){
        return new KeystoreSet(bitlength);
    }

    /** @type {Object<number, Set>} */
    this.index = create_object();
    /** @type {Array<Set>} */
    this.refs = [];
    /** @type {number} */
    this.size = 0;

    if(bitlength > 32){
        this.crc = lcg64;
        this.bit = BigInt(bitlength);
    }
    else {
        this.crc = lcg;
        this.bit = bitlength;
    }
}

/** @param {number|string} key */
KeystoreSet.prototype.add = function(key){
    const address = this.crc(key);
    let set = this.index[address];
    if(set){
        let size = set.size;
        set.add(key);
        size -= set.size;
        size && this.size++;
    }
    else{
        this.index[address] = set = new Set([key]);
        this.refs.push(set);
        this.size++;
    }
};

KeystoreMap.prototype.has =
/** @param {number|string} key */
KeystoreSet.prototype.has = function(key) {
    const address = this.crc(key);
    const map_or_set = this.index[address];
    return map_or_set && map_or_set.has(key);
};

/*
KeystoreMap.prototype.size =
KeystoreSet.prototype.size = function(){
    let size = 0;
    const values = Object.values(this.index);
    for(let i = 0; i < values.length; i++){
        size += values[i].size;
    }
    return size;
};
*/

KeystoreMap.prototype.delete =
/** @param {number|string} key */
KeystoreSet.prototype.delete = function(key){
    const address = this.crc(key);
    const map_or_set = this.index[address];
    // set && (set.size === 1
    //     ? this.index.delete(address)
    //     : set.delete(key));
    map_or_set &&
    map_or_set.delete(key) &&
    this.size--;
};

KeystoreMap.prototype.clear =
KeystoreSet.prototype.clear = function(){
    this.index = create_object();
    this.refs = [];
    this.size = 0;
};

// KeystoreMap.prototype.destroy =
// KeystoreSet.prototype.destroy = function(){
//     this.index = null;
//     this.refs = null;
//     this.proxy = null;
// };

/**
 * @return Iterable
 */
KeystoreMap.prototype.values =
KeystoreSet.prototype.values = function*(){
    // alternatively iterate through this.keys[]
    //const refs = Object.values(this.index);
    for(let i = 0; i < this.refs.length; i++){
        for(let value of this.refs[i].values()){
            yield value;
        }
    }
};

/**
 * @return Iterable
 */
KeystoreMap.prototype.keys =
KeystoreSet.prototype.keys = function*(){
    //const values = Object.values(this.index);
    for(let i = 0; i < this.refs.length; i++){
        for(let key of this.refs[i].keys()){
            yield key;
        }
    }
};

/**
 * @return Iterable
 */
KeystoreMap.prototype.entries =
KeystoreSet.prototype.entries = function*(){
    //const values = Object.values(this.index);
    for(let i = 0; i < this.refs.length; i++){
        for(let entry of this.refs[i].entries()){
            yield entry;
        }
    }
};

// /**
//  * @param bitlength
//  * @constructor
//  */
//
// export function KeystoreObj(bitlength = 8){
//
//     if(!this || this.constructor !== KeystoreObj){
//         return new KeystoreObj(bitlength);
//     }
//
//     this.index = create_object();
//     this.keys = [];
//
//     if(bitlength > 32){
//         this.crc = lcg64;
//         this.bit = BigInt(bitlength);
//     }
//     else {
//         this.crc = lcg;
//         this.bit = bitlength;
//     }
//
//     return /*this.proxy =*/ new Proxy(this, {
//         get(target, key) {
//             const address = target.crc(key);
//             const obj = target.index[address];
//             return obj && obj[key];
//         },
//         set(target, key, value){
//             const address = target.crc(key);
//             let obj = target.index[address];
//             if(!obj){
//                 target.index[address] = obj = create_object();
//                 target.keys.push(address);
//             }
//             obj[key] = value;
//             return true;
//         },
//         delete(target, key){
//             const address = target.crc(key);
//             const obj = target.index[address];
//             obj && delete obj[key];
//             return true;
//         }
//     });
// }
//
// KeystoreObj.prototype.clear = function(){
//     this.index = create_object();
//     this.keys = [];
// };

// KeystoreObj.prototype.destroy = function(){
//     this.index = null;
//     this.keys = null;
//     this.proxy = null;
// };

/**
 * Linear Congruential Generator (LCG)
 * @param {!number|bigint|string} str
 * @this {KeystoreMap|KeystoreSet}
 */

function lcg(str) {
    let range = 2 ** this.bit - 1;
    if(typeof str == "number"){
        return str & range;
    }
    let crc = 0, bit = this.bit + 1;
    for(let i = 0; i < str.length; i++) {
        crc = (crc * bit ^ str.charCodeAt(i)) & range;
    }
    // shift Int32 to UInt32 because negative numbers
    // extremely slows down key lookup
    return this.bit === 32
        ? crc + 2 ** 31
        : crc;// & 0xFFFF;
}

/**
 * @param {!number|bigint|string} str
 * @this {KeystoreMap|KeystoreSet}
 */

function lcg64(str) {
    let range = BigInt(2) ** /** @type {!bigint} */ (this.bit) - BigInt(1);
    let type = typeof str;
    if(type === "bigint"){
        return /** @type {!bigint} */ (str) & range;
    }
    if(type === "number"){
        return BigInt(str) & range;
    }
    let crc = BigInt(0), bit = /** @type {!bigint} */ (this.bit) + BigInt(1);
    for(let i = 0; i < str.length; i++){
        crc = (crc * bit ^ BigInt(str.charCodeAt(i))) & range;
    }
    return crc;// & 0xFFFFFFFFFFFFFFFF;
}
