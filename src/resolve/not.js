import Resolver from "../resolver.js";
import {
    SearchResults,
    EnrichedSearchResults,
    IntermediateSearchResults,
    HighlightOptions
} from "../type.js";

/** @this {Resolver} */
Resolver.prototype["not"] = function(){
    return this.handler("not", return_result, arguments);
}

/**
 * @param {!Array<IntermediateSearchResults>} final
 * @param {number} limit
 * @param {number=} offset
 * @param {boolean=} enrich
 * @param {boolean=} resolve
 * @param {boolean=} suggest
 * @param {string|HighlightOptions=} highlight
 * @this {Resolver}
 * @return {
 *   SearchResults |
 *   EnrichedSearchResults |
 *   IntermediateSearchResults |
 *   Promise<SearchResults | EnrichedSearchResults | IntermediateSearchResults> |
 *   Resolver
 * }
 */
function return_result(final, limit, offset, enrich, resolve, suggest, highlight){

    if(!suggest && !this.result.length){
        return resolve
            ? this.result
            : this;
    }

    let resolved;

    if(final.length && this.result.length){
        this.result = exclusion.call(this,
            final,
            limit,
            offset,
            resolve
        );
        resolved = true;
    }

    // skip recursive promise execution in .resolve()
    if(resolve){
        this.await = null;
    }

    return resolve
        ? this.resolve(limit, offset, enrich, highlight, resolved)
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
