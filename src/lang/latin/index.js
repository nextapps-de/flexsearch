import encoder_advanced from "./advanced.js";
import encoder_balance from "./balance.js";
import encoder_extra from "./extra.js";
import encoder_simple from "./simple.js";

export function encode(str){

    return str.toLowerCase();
}

export const split = /[\W_]+/;
export const rtl = false;

export const advanced = encoder_advanced;
export const balance = encoder_balance;
export const extra = encoder_extra;
export const simple = encoder_simple;