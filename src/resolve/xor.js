import Resolver from "../resolver.js";
import default_resolver from "./default.js";
import { create_object } from "../common.js";
import { SearchResults, EnrichedSearchResults, IntermediateSearchResults } from "../type.js";
import { apply_enrich } from "../document/search.js";

/** @this {Resolver} */
Resolver.prototype["xor"] = function(){

    const {
        final,
        promises,
        limit,
        offset,
        enrich,
        resolve,
        suggest
    } = this.handler("xor", arguments);

    return return_result.call(this,
        final,
        promises,
        limit,
        offset,
        enrich,
        resolve,
        suggest
    );
}

/**
 * @param {!Array<IntermediateSearchResults>} final
 * @param {!Array<Promise<IntermediateSearchResults>>} promises
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 * @param {boolean=} resolve
 * @param {boolean=} suggest
 * @this {Resolver}
 * @return {
 *   SearchResults |
 *   EnrichedSearchResults |
 *   IntermediateSearchResults |
 *   Promise<SearchResults | EnrichedSearchResults | IntermediateSearchResults> |
 *   Resolver
 * }
 */

function return_result(final, promises, limit, offset, enrich, resolve, suggest){

    if(promises.length){
        const self = this;
        return Promise.all(promises).then(function(result){

            final = [];
            for(let i = 0, tmp; i < result.length; i++){
                if((tmp = result[i]).length){
                    final[i] = tmp;
                }
            }

            return return_result.call(self,
                final,
                [],
                limit,
                offset,
                enrich,
                resolve,
                suggest
            );
        });
    }

    if(!final.length){
        if(!suggest) this.result = /** @type {SearchResults|IntermediateSearchResults} */ (final);
    }
    else{
        //this.result.length && (final = [this.result].concat(final));
        this.result.length && final.unshift(this.result);

        if(final.length < 2){
            this.result = final[0];
        }
        else{
            this.result = exclusive.call(this,
                final,
                limit,
                offset,
                resolve,
                this.boostval
            );

            return resolve
                ? (enrich
                    ? apply_enrich.call(this.index, /** @type {SearchResults} */ (this.result))
                    : this.result
                )
                : this;
        }
    }

    return resolve
        ? this.resolve(limit, offset, enrich)
        : this;
}

/**
 * Aggregate the intersection of N raw results
 * @param {!Array<IntermediateSearchResults>} result
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} resolve
 * @param {number=} boost
 * @this {Resolver}
 * @return {SearchResults|IntermediateSearchResults}
 */

function exclusive(result, limit, offset, resolve, boost){

    // if(!result.length){
    //     return result;
    // }

    /** @type {SearchResults|IntermediateSearchResults} */
    const final = [];
    const check = create_object();
    let maxres = 0;

    for(let i = 0, res; i < result.length; i++){
        res = result[i];
        if(!res) continue;

        if(maxres < res.length) maxres = res.length;

        for(let j = 0, ids; j < res.length; j++){
            ids = res[j];
            if(!ids) continue

            for(let k = 0, id; k < ids.length; k++){
                id = ids[k];
                check[id] = check[id] ? 2 : 1;
            }
        }
    }

    for(let j = 0, ids, count = 0; j < maxres; j++){

        for(let i = 0, res; i < result.length; i++){
            res = result[i];
            if(!res) continue;

            ids = res[j];
            if(!ids) continue;

            for(let k = 0, id; k < ids.length; k++){
                id = ids[k];
                if(check[id] === 1){
                    if(offset){
                        offset--;
                        continue;
                    }
                    if(resolve){
                        final.push(id);
                        if(final.length === limit){
                            return final;
                        }
                    }
                    else{
                        // shift resolution by boost (inverse)
                        const index = j + (i ? boost : 0);
                        final[index] || (final[index] = []);
                        final[index].push(id);
                        if(++count === limit){
                            return final;
                        }
                    }
                }
            }
        }
    }

    return final;
}
