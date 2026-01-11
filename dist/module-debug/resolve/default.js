import { concat } from "../common.js";
import { IntermediateSearchResults, SearchResults, EnrichedSearchResults } from "../type.js";
import { apply_enrich } from "../document/search.js";
import Document from "../document.js";
import Index from "../index.js";
import WorkerIndex from "../worker.js";

/*
 from -> res[score][id]
 to   -> [id]
*/

/**
 * Aggregate the union of a single raw result
 * @param {IntermediateSearchResults} result
 * @param {!number} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 * @param {boolean=} score
 * @return {SearchResults|EnrichedSearchResults}
 * @this {Document|Index|WorkerIndex}
 */

export default function (result, limit, offset, enrich, score) {

    if (!result.length) {
        return result;
    }

    score = !0 === score;

    let hasScore = !1;
    if (0 < result.length && result[0]) {
        if (Array.isArray(result[0]) && 0 < result[0].length) {

            const firstItem = result[0][0];
            hasScore = 'object' == typeof firstItem && null !== firstItem && !Array.isArray(firstItem) && 'id' in firstItem && 'score' in firstItem;
        } else if ('object' == typeof result[0] && null !== result[0] && !Array.isArray(result[0])) {

            hasScore = 'id' in result[0] && 'score' in result[0];
        }
    }

    if (1 === result.length) {
        let final = result[0];
        final = offset || final.length > limit ? final.slice(offset, offset + limit) : final;

        if (score && !hasScore && 0 < final.length) {
            const firstItem = final[0];


            if ('number' == typeof firstItem || 'string' == typeof firstItem) {
                const scoredFinal = [],
                      baseScore = this && this.resolution || 9;

                for (let i = 0; i < final.length; i++) {
                    scoredFinal.push({
                        id: final[i],
                        score: baseScore
                    });
                }
                final = scoredFinal;
            }
        }

        return enrich ? /** @type {EnrichedSearchResults} */apply_enrich.call(this, final) : final;
    }

    let final = [];

    for (let i = 0, arr, len; i < result.length; i++) {
        if (!(arr = result[i]) || !(len = arr.length)) continue;

        if (offset) {

            if (offset >= len) {
                offset -= len;
                continue;
            }

            arr = arr.slice(offset, offset + limit);
            len = arr.length;
            offset = 0;
        }

        if (len > limit) {

            arr = arr.slice(0, limit);
            len = limit;
        }

        if (!final.length) {

            if (len >= limit) {

                if (score && !hasScore && 0 < arr.length && 'object' != typeof arr[0]) {
                    const scoredArr = [];
                    for (let j = 0; j < arr.length; j++) {
                        scoredArr.push({
                            id: arr[j],
                            score: result.length - i - j
                        });
                    }
                    arr = scoredArr;
                }
                return enrich ? /** @type {EnrichedSearchResults} */apply_enrich.call(this, arr) : arr;
            }
        }

        final.push(arr);
        limit -= len;

        if (!limit) {
            break;
        }
    }

    final = 1 < final.length ? concat(final) : final[0];

    if (score && !hasScore && 0 < final.length && 'object' != typeof final[0]) {
        const scoredFinal = [];
        for (let i = 0; i < final.length; i++) {
            scoredFinal.push({
                id: final[i],
                score: final.length - i
            });
        }
        final = scoredFinal;
    }

    return enrich ? apply_enrich.call(this, final) : final;
}