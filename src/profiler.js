// COMPILER BLOCK -->
import { PROFILER } from "./config.js";
// <-- COMPILER BLOCK
import { create_object } from "./common.js";
const data = create_object();

if(PROFILER){
    if(typeof window !== "undefined"){
        window.profiler = data;
    }
}

/**
 * @param {!string} name
 */

export default function tick(name){
    if(PROFILER){
        /** @type {!Object<string, number>} */
        const profiler = data; //data["profiler"] || (data["profiler"] = {});
        profiler[name] || (profiler[name] = 0);
        profiler[name]++;
    }
}
