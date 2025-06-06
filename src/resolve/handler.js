// COMPILER BLOCK -->
import {
    DEBUG,
    SUPPORT_ASYNC,
    SUPPORT_DOCUMENT,
    SUPPORT_HIGHLIGHTING,
    SUPPORT_STORE
} from "../config.js";
// <-- COMPILER BLOCK
import Resolver from "../resolver.js";
import {
    ResolverOptions,
    SearchResults,
    EnrichedSearchResults,
    IntermediateSearchResults
} from "../type.js";

/**
 * @param {string} method
 * @param {Function} fn
 * @param {Array<ResolverOptions>|Arguments} args
 * @return {
 *   SearchResults |
 *   EnrichedSearchResults |
 *   IntermediateSearchResults |
 *   Promise<SearchResults | EnrichedSearchResults | IntermediateSearchResults> |
 *   Resolver
 * }
 */
Resolver.prototype.handler = function(method, fn, args){

    /** @type {ResolverOptions} */
    let arg = args[0];
    // detect array parameter style
    if(arg[0] && arg[0].query){
        return this[method].apply(this, arg);
    }

    // skip tasks on specific conditions
    if(method === "and" || method === "not") {
        let execute = this.result.length || this.await;
        let resolve;
        if(!execute){
            if(!arg.suggest){
                if(args.length > 1){
                    arg = args[args.length - 1];
                }
                resolve = arg.resolve;
                return resolve
                    ? this.await || this.result
                    : this;
            }
        }
    }

    const self = this;
    /** @type {!Array<IntermediateSearchResults|Promise<IntermediateSearchResults>>} */
    let final = [];
    let limit = 0, offset = 0, enrich, resolve, suggest, highlight;
    let async;

    for(let i = 0; i < args.length; i++){

        /** @type {ResolverOptions} */
        let query = args[i];

        if(query){

            let result;

            if(query.constructor === Resolver){
                result = query.await || query.result;
            }
            else if(query.then || query.constructor === Array){
                result = query;
            }
            else{

                limit = query.limit || 0;
                offset = query.offset || 0;
                suggest = query.suggest;
                resolve = query.resolve;
                highlight = SUPPORT_DOCUMENT && SUPPORT_STORE && SUPPORT_HIGHLIGHTING && (query.highlight || this.highlight);
                enrich = SUPPORT_DOCUMENT && SUPPORT_STORE && (highlight || query.enrich) && resolve;
                let opt_queue = SUPPORT_ASYNC && query.queue;
                let opt_async = SUPPORT_ASYNC && (query.async || opt_queue);
                let index = query.index;
                let query_value = query.query;

                if(index){
                    this.index || (this.index = index);
                }
                else{
                    index = this.index;
                }

                if(query_value || query.tag){

                    if(DEBUG){
                        if(!index){
                            throw new Error("Resolver can't apply because the corresponding Index was never specified");
                        }
                    }

                    if(SUPPORT_DOCUMENT){
                        const field = query.field || query.pluck;
                        if(field){

                            if(SUPPORT_STORE && SUPPORT_HIGHLIGHTING && query_value && (!this.query || highlight)){
                                this.query = query_value;
                                this.field = field;
                                this.highlight = highlight;
                            }

                            if(DEBUG){
                                if(!index.index){
                                    throw new Error("Resolver can't apply because the corresponding Document Index was not specified");
                                }
                            }

                            index = index.index.get(field);

                            if(DEBUG){
                                if(!index){
                                    throw new Error("Resolver can't apply because the specified Document Field '" + field + "' was not found");
                                }
                            }
                        }
                    }

                    if(opt_queue && (async || this.await)){
                        async = 1;

                        // create a new promise for the main queue
                        // the promise return is controlled internally
                        let resolve;
                        const idx = this.promises.length;
                        const promise = new Promise(function(_resolve){
                            resolve = _resolve;
                        });

                        (function(index, query){

                            promise._fn = function(){
                                query.index = null;
                                query.resolve = false;
                                let result = opt_async
                                    ? index.searchAsync(query)
                                    : index.search(query);
                                if(result.then){
                                    return result.then(function(result){
                                        self.promises[idx] = result = result.result || result;
                                        resolve(result);
                                        return result;
                                    });
                                }
                                result = result.result || result;
                                resolve(result);
                                return result;
                            }

                        }(index, Object.assign({}, /** @type Object */ (query))));

                        this.promises.push(promise);
                        final[i] = promise;
                        continue;
                    }
                    else {
                        query.resolve = false;
                        query.index = null;
                        result = opt_async
                            ? index.searchAsync(query)
                            : index.search(query);
                        query.resolve = resolve;
                        query.index = index;
                    }
                }
                else if(query.and){
                    result = inner_call(query, "and", index);
                }
                else if(query.or){
                    result = inner_call(query, "or", index);
                }
                else if(query.not){
                    result = inner_call(query, "not", index);
                }
                else if(query.xor){
                    result = inner_call(query, "xor", index);
                }
                else{
                    continue;
                }
            }

            if(result.await){
                async = 1;
                result = result.await;
            }
            else if(result.then){
                async = 1;
                result = result.then(function(result){
                    return result.result || result;
                });
            }
            else{
                result = result.result || result;
            }

            final[i] = result;
        }
    }

    if(async && !this.await){
        this.await = new Promise(function(resolve){
            self.return = resolve;
        });
    }

    if(async){

        const promises = Promise.all(final).then(function(final){
            for(let i = 0; i < self.promises.length; i++){
                if(self.promises[i] === promises){
                    self.promises[i] = function(){
                        return fn.call(self,
                            final,
                            limit,
                            offset,
                            enrich,
                            resolve,
                            suggest,
                            highlight
                        )
                    };
                    break;
                }
            }
            self.execute();
        });

        this.promises.push(promises);
    }
    else if(this.await){

        this.promises.push(function(){
            return fn.call(self,
                final,
                limit,
                offset,
                enrich,
                resolve,
                suggest,
                highlight
            );
        });
    }
    else{

        return fn.call(this,
            final,
            limit,
            offset,
            enrich,
            resolve,
            suggest,
            highlight
        );
    }

    return resolve
        ? this.await || this.result
        : this;
}

function inner_call(query, method, index){

    const args = query[method];
    const arg = args[0] || args;
    arg.index || (arg.index = index);

    let resolver = new Resolver(arg);
    if(args.length > 1){
        resolver = resolver[method].apply(resolver, args.slice(1));
    }

    return resolver;
}
