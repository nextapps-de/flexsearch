import Resolver from "../resolver.js";
import { SearchResults, EnrichedSearchResults, IntermediateSearchResults } from "../type.js";
import { apply_enrich } from "../document/search.js";

/** @this {Resolver} */
Resolver.prototype["not"] = function(){

    const {
        final,
        promises,
        limit,
        offset,
        enrich,
        resolve,
        suggest
    } = this.handler("not", arguments);

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

    if(final.length && this.result.length){
        this.result = exclusion.call(this,
            final,
            limit,
            offset,
            resolve
        );
    }
    else if(resolve){
        return this.resolve(limit, offset, enrich);
    }

    return resolve
        ? (enrich
            ? apply_enrich.call(this.index, this.result)
            : this.result
        )
        : this;
}

/**
 * @param {!Array<IntermediateSearchResults>} result
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} resolve
 * @this {Resolver}
 * @return {SearchResults|IntermediateSearchResults}
 */

function exclusion(result, limit, offset, resolve){

    // if(!result.length){
    //     return this.result;
    // }

    /** @type {SearchResults|IntermediateSearchResults} */
    const final = [];
    const exclude = new Set(result.flat().flat());

    for(let j = 0, ids, count = 0; j < this.result.length; j++){
        ids = this.result[j];
        if(!ids) continue;

        for(let k = 0, id; k < ids.length; k++){
            id = ids[k];
            if(!exclude.has(id)){
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
                    final[j] || (final[j] = []);
                    final[j].push(id);
                    if(++count === limit){
                        return final;
                    }
                }
            }
        }
    }

    return final;
}
