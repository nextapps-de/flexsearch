
import Resolver from "./resolver.js";
import { create_object, concat, sort_by_length_up, get_max_len } from "./common.js";
import { SearchResults, IntermediateSearchResults } from "./type.js";

/*

 from -> result[
    res[score][id],
    res[score][id],
 ]

 to -> [id]

*/

/**
 * @param {!Array<IntermediateSearchResults>} arrays
 * @param {number} resolution
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} suggest
 * @param {number=} boost
 * @param {boolean=} resolve
 * @returns {SearchResults|IntermediateSearchResults}
 */
export function intersect(arrays, resolution, limit, offset, suggest, boost, resolve) {

    const length = arrays.length;

    /** @type {Array<SearchResults|IntermediateSearchResults>} */
    let result = [],
        check,
        count;


    check = create_object();

    for (let y = 0, ids, id, res_arr, tmp; y < resolution; y++) {

        for (let x = 0; x < length; x++) {

            res_arr = arrays[x];

            if (y < res_arr.length && (ids = res_arr[y])) {

                for (let z = 0; z < ids.length; z++) {

                    id = ids[z];

                    if (count = check[id]) {
                        check[id]++;
                    } else {
                        count = 0;
                        check[id] = 1;
                    }

                    tmp = result[count] || (result[count] = []);

                    if (!resolve) {

                        let score = y + (x || !suggest ? 0 : boost || 0);
                        tmp = tmp[score] || (tmp[score] = []);
                    }

                    tmp.push(id);

                    if (resolve) {
                        if (limit && count === length - 1) {
                            if (tmp.length - offset === limit) {
                                return offset ? tmp.slice(offset) : tmp;
                            }
                        }
                    }
                }
            }
        }
    }

    const result_len = result.length;

    if (result_len) {

        if (!suggest) {

            if (result_len < length) {
                return [];
            }

            result = /** @type {SearchResults|IntermediateSearchResults} */result[result_len - 1];

            if (limit || offset) {
                if (resolve) {
                    if (result.length > limit || offset) {
                        result = result.slice(offset, limit + offset);
                    }
                } else {

                    const final = [];
                    for (let i = 0, arr; i < result.length; i++) {
                        arr = result[i];
                        if (!arr) continue;
                        if (offset && arr.length > offset) {
                            offset -= arr.length;
                            continue;
                        }
                        if (limit && arr.length > limit || offset) {
                            arr = arr.slice(offset, limit + offset);
                            limit -= arr.length;
                            if (offset) offset -= arr.length;
                        }
                        final.push(arr);
                        if (!limit) {
                            break;
                        }
                    }
                    result = final;
                }
            }
        } else {

            result = 1 < result.length ? union(result, limit, offset, resolve, boost) : (result = result[0]) && limit && result.length > limit || offset ? result.slice(offset, limit + offset) : result;
        }
    }

    return (/** @type {SearchResults|IntermediateSearchResults} */result
    );
}

/**
 * @param {Array<SearchResults|IntermediateSearchResults>} arrays
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} resolve
 * @param {number=} boost
 * @returns {SearchResults|IntermediateSearchResults}
 */
export function union(arrays, limit, offset, resolve, boost) {

    /** @type {SearchResults|IntermediateSearchResults} */
    const result = [],
          check = create_object();

    let ids,
        id,
        arr_len = arrays.length,
        ids_len;

    if (!resolve) {

        for (let i = arr_len - 1, res, count = 0; 0 <= i; i--) {

            res = arrays[i];

            for (let k = 0; k < res.length; k++) {

                ids = res[k];
                ids_len = ids && ids.length;

                if (ids_len) for (let j = 0; j < ids_len; j++) {

                    id = ids[j];

                    if (!check[id]) {
                        check[id] = 1;
                        if (offset) {
                            offset--;
                        } else {
                            let score = 0 | (k + (i < arr_len - 1 ? boost || 0 : 0)) / (i + 1),
                                arr = result[score] || (result[score] = []);

                            arr.push(id);
                            if (++count === limit) {
                                return result;
                            }
                        }
                    }
                }
            }
        }
    } else for (let i = arr_len - 1; 0 <= i; i--) {

        ids = arrays[i];
        ids_len = ids && ids.length;

        if (ids_len) for (let j = 0; j < ids_len; j++) {

            id = ids[j];

            if (!check[id]) {
                check[id] = 1;
                if (offset) {
                    offset--;
                } else {
                    result.push(id);
                    if (result.length === limit) {
                        return result;
                    }
                }
            }
        }
    }

    return result;
}

/**
 * @param {SearchResults|IntermediateSearchResults|Resolver} arrays
 * @param {Array<SearchResults>} mandatory
 * @param {boolean=} resolve
 * @returns {SearchResults}
 */
export function intersect_union(arrays, mandatory, resolve) {
    const check = create_object(),
          result = [];
    /** @type {SearchResults|IntermediateSearchResults} */

    for (let x = 0, ids; x < mandatory.length; x++) {
        ids = mandatory[x];
        for (let i = 0; i < ids.length; i++) {
            check[ids[i]] = 1;
        }
    }

    if (resolve) {
        for (let i = 0, id; i < arrays.length; i++) {
            id = arrays[i];
            if (check[id]) {
                result.push(id);
                check[id] = 0;
            }
        }
    } else {
        for (let i = 0, ids, id; i < arrays.result.length; i++) {
            ids = arrays.result[i];
            for (let j = 0; j < ids.length; j++) {
                id = ids[j];
                if (check[id]) {
                    const arr = result[i] || (result[i] = []);
                    arr.push(id);
                    check[id] = 0;
                }
            }
        }
    }

    return result;
}

/**
 * Implementation based on Array.includes() provides better performance,
 * but it needs at least one word in the query which is less frequent.
 * Also on large indexes it does not scale well performance-wise.
 * This strategy also lacks of suggestion capabilities (matching & sorting).
 *
 * @param arrays
 * @param limit
 * @param offset
 * @param {boolean|Array=} suggest
 * @returns {Array}
 */