// COMPILER BLOCK -->
import { SUPPORT_CACHE } from "./config.js";
// <-- COMPILER BLOCK

let table;// = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
let timer;
const cache = new Map();

function toRadix(number, radix = 255) {

    if(!table){
        table = new Array(radix);
        // the char code 0 could be a special marker
        for(let i = 0; i < radix; i++) table[i] = i + 1;
        table = String.fromCharCode.apply(null, table);
    }

    let rixit;
    let residual = number;
    let result = "";

    while(true){
        rixit = residual % radix;
        result = table.charAt(rixit) + result;
        residual = residual / radix | 0;
        if(!residual)
            break;
    }

    return result;
}

export default function(str){

    if(SUPPORT_CACHE){
        if(timer){
            if(cache.has(str)){
                return cache.get(str);
            }
        }
        else{
            timer = setTimeout(clear, 1);
        }
    }

    /* 2 ** ((level + 1.5) * 1.6 | 0) */

    const result = toRadix(
        typeof str == "number"
            ? str
            : lcg(str)
    );

    if(SUPPORT_CACHE){
        cache.size > 2e5 && cache.clear();
        cache.set(str, result);
    }

    return result;
}

function lcg(str) {
    let range = 2 ** 32 - 1;
    if(typeof str == "number"){
        return str & range;
    }
    let crc = 0, bit = 32 + 1;
    for(let i = 0; i < str.length; i++) {
        crc = (crc * bit ^ str.charCodeAt(i)) & range;
    }
    // shift up from Int32 to UInt32 range 0xFFFFFFFF
    return crc + 2 ** 31;
}

function clear(){
    timer = null;
    cache.clear();
}
