
import Resolver from "../resolver.js";
import { ResolverOptions, SearchResults, EnrichedSearchResults, IntermediateSearchResults } from "../type.js";

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
Resolver.prototype.handler = function (method, fn, args) {

    /** @type {ResolverOptions} */
    let arg = args[0];

    if (arg[0] && arg[0].query) {
        return this[method].apply(this, arg);
    }

    if ("and" === method || "not" === method) {
        let execute = this.result.length || this.await,
            resolve;

        if (!execute) {
            if (!arg.suggest) {
                if (1 < args.length) {
                    arg = args[args.length - 1];
                }
                resolve = arg.resolve;
                return resolve ? this.await || this.result : this;
            }
        }
    }

    const self = this;
    /** @type {!Array<IntermediateSearchResults|Promise<IntermediateSearchResults>>} */
    let final = [],
        limit = 0,
        offset = 0,
        enrich,
        resolve,
        suggest,
        highlight,
        async;


    for (let i = 0, query; i < args.length; i++) {

        /** @type {ResolverOptions} */
        query = args[i];


        if (query) {

            let result;

            if (query.constructor === Resolver) {
                result = query.await || query.result;
            } else if (query.then || query.constructor === Array) {
                result = query;
            } else {

                limit = query.limit || 0;
                offset = query.offset || 0;
                suggest = query.suggest;
                resolve = query.resolve;
                highlight = query.highlight && resolve;
                enrich = highlight || query.enrich && resolve;
                let opt_queue = query.queue,
                    opt_async = query.async || opt_queue,
                    index = query.index;


                if (index) {
                    this.index || (this.index = index);
                } else {
                    index = this.index;
                }

                if (query.query || query.tag) {
                    {
                        const field = query.field || query.pluck;
                        if (field) {

                            index = this.index.index.get(field);
                        }
                    }

                    if (opt_queue && (async || this.await)) {
                        async = 1;

                        let resolve;
                        const idx = this.promises.length,
                              promise = new Promise(function (_resolve) {
                            resolve = _resolve;
                        });


                        (function (index, query) {

                            promise._fn = function () {
                                query.index = null;
                                query.resolve = !1;
                                let result = opt_async ? index.searchAsync(query) : index.search(query);
                                if (result.then) {
                                    return result.then(function (result) {
                                        self.promises[idx] = result = result.result || result;
                                        resolve(result);
                                        return result;
                                    });
                                }
                                result = result.result || result;
                                resolve(result);
                                return result;
                            };
                        })(index, Object.assign({}, /** @type Object */query));

                        this.promises.push(promise);
                        final[i] = promise;
                        continue;
                    } else {
                        query.resolve = !1;
                        query.index = null;

                        result = opt_async ? index.searchAsync(query) : index.search(query);

                        query.resolve = resolve;
                        query.index = index;
                    }

                    if (highlight) {
                        query.query;
                    }
                } else if (query.and) {
                    result = inner_call(query, "and", index);
                } else if (query.or) {
                    result = inner_call(query, "or", index);
                } else if (query.not) {
                    result = inner_call(query, "not", index);
                } else if (query.xor) {
                    result = inner_call(query, "xor", index);
                } else {
                    continue;
                }
            }

            if (result.await) {
                async = 1;
                result = result.await;
            } else if (result.then) {
                async = 1;
                result = result.then(function (result) {
                    return result.result || result;
                });
            } else {
                result = result.result || result;
            }

            final[i] = result;
        }
    }

    if (async && !this.await) {
        this.await = new Promise(function (resolve) {
            self.return = resolve;
        });
    }

    if (async) {

        const promises = Promise.all(final).then(function (final) {
            for (let i = 0; i < self.promises.length; i++) {
                if (self.promises[i] === promises) {
                    self.promises[i] = function () {
                        return fn.call(self, final, limit, offset, enrich, resolve, suggest);
                    };
                    break;
                }
            }
            self.execute();
        });
        this.promises.push(promises);
    } else if (this.await) {

        this.promises.push(function () {
            return fn.call(self, final, limit, offset, enrich, resolve, suggest);
        });
    } else {

        return fn.call(this, final, limit, offset, enrich, resolve, suggest);
    }

    return resolve ? this.await || this.result : this;
};

function inner_call(query, method, index) {
    const args = query[method],
          arg = args[0] || args;

    arg.index || (arg.index = index);

    let resolver = new Resolver(arg);
    if (1 < args.length) {
        resolver = resolver[method].apply(resolver, args.slice(1));
    }

    return resolver;
}