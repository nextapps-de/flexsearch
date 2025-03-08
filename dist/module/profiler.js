import { create_object } from "./common.js";
const data = create_object();

/**
 * @param {!string} name
 */

export default function tick(name) {

    /** @type {!Object<string, number>} */
    const profiler = data.profiler || (data.profiler = {});

    profiler[name] || (profiler[name] = 0);
    profiler[name]++;
}