// COMPILER BLOCK -->
import {
    DEBUG,
    SUPPORT_DOCUMENT,
    SUPPORT_HIGHLIGHTING,
    SUPPORT_STORE
} from "../config.js";
// <-- COMPILER BLOCK
import Resolver from "../resolver.js";
import {
    ResolverOptions,
    SearchResults,
    IntermediateSearchResults
} from "../type.js";

/**
 * @param {string} fn
 * @param {Array<ResolverOptions|Promise<ResolverOptions>>|Arguments} args
 */
Resolver.prototype.handler = function(fn, args){

    /** @type {ResolverOptions|Promise<ResolverOptions>} */
    let first_argument = args[0];

    if(first_argument.then){
        const self = this;
        // todo: check when this branch was taken
        // instead of Promise.all the args[] array could be reduced
        // by iterate recursively one by one
        return Promise.all(args).then(function(args){
            return self[fn].apply(self, args);
        });
    }

    if(first_argument[0]){
        // detect array parameter style
        if(first_argument[0].index){
            return this[fn].apply(this, first_argument);
        }
    }

    /** @type {SearchResults|IntermediateSearchResults} */
    let final = [];
    /** @type {Array<Promise<SearchResults|IntermediateSearchResults>>} */
    let promises = [];
    let limit = 0, offset = 0, enrich, resolve, suggest, highlight, highlight_query;

    for(let i = 0, query; i < args.length; i++){

        query = /** @type {string|ResolverOptions} */ (
            args[i]
        );

        if(query){

            let result;
            if(query.constructor === Resolver){
                result = query.result;
            }
            else if(query.constructor === Array){
                result = query;
            }
            else{

                limit = query.limit || 0;
                offset = query.offset || 0;
                suggest = query.suggest;
                resolve = query.resolve;
                highlight = SUPPORT_DOCUMENT && SUPPORT_STORE && SUPPORT_HIGHLIGHTING && query.highlight && resolve;
                enrich = SUPPORT_DOCUMENT && SUPPORT_STORE && highlight || (query.enrich && resolve);
                let index;

                if(query.index){
                    this.index = index = query.index;
                }
                else{
                    index = this.index;
                }

                if(query.query || query.tag){

                    if(DEBUG){
                        if(!this.index){
                            throw new Error("Resolver can't apply because the corresponding Index was never specified");
                        }
                    }

                    if(SUPPORT_DOCUMENT){
                        const field = query.field || query.pluck;
                        if(field){

                            if(DEBUG){
                                if(!this.index.index){
                                    throw new Error("Resolver can't apply because the corresponding Document Index was not specified");
                                }
                            }

                            index = this.index.index.get(field);

                            if(DEBUG){
                                if(!index){
                                    throw new Error("Resolver can't apply because the specified Document Field '" + field + "' was not found");
                                }
                            }
                        }
                    }

                    query.resolve = false;
                    //if(DEBUG)
                    //query.enrich = false;
                    result = index.search(query).result;
                    query.resolve = resolve;
                    //if(DEBUG)
                    //query.enrich = enrich;

                    if(highlight){
                        highlight_query = query.query;
                    }
                }
                else if(query.and){
                    result = this["and"](query.and);
                }
                else if(query.or){
                    result = this["or"](query.or);
                }
                else if(query.xor){
                    result = this["xor"](query.xor);
                }
                else if(query.not){
                    result = this["not"](query.not);
                }
                else{
                    continue;
                }
            }

            if(result.then){
                promises.push(result);
            }
            else if(result.length){
                final[i] = result;
            }
            else if(!suggest && (fn === "and" || fn === "xor")){
                final = [];
                break;
            }
        }
    }

    return {
        final,
        promises,
        limit,
        offset,
        enrich,
        resolve,
        suggest,
        highlight,
        highlight_query
    };
}
