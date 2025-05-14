
import Resolver from "../resolver.js";
import { ResolverOptions, SearchResults, IntermediateSearchResults } from "../type.js";

/**
 * @param {string} fn
 * @param {Array<ResolverOptions|Promise<ResolverOptions>>|Arguments} args
 */
Resolver.prototype.handler = function (fn, args) {

    /** @type {ResolverOptions|Promise<ResolverOptions>} */
    let first_argument = args[0];

    if (first_argument.then) {
        const self = this;

        return Promise.all(args).then(function (args) {
            return self[fn].apply(self, args);
        });
    }

    if (first_argument[0]) {

        if (first_argument[0].index) {
            return this[fn].apply(this, first_argument);
        }
    }

    /** @type {SearchResults|IntermediateSearchResults} */
    let final = [],
        promises = [],
        limit = 0,
        offset = 0,
        enrich,
        resolve,
        suggest,
        highlight,
        highlight_query;
    /** @type {Array<Promise<SearchResults|IntermediateSearchResults>>} */

    for (let i = 0, query; i < args.length; i++) {

        query = /** @type {string|ResolverOptions} */args[i];

        if (query) {

            let result;
            if (query.constructor === Resolver) {
                result = query.result;
            } else if (query.constructor === Array) {
                result = query;
            } else {

                limit = query.limit || 0;
                offset = query.offset || 0;
                suggest = query.suggest;
                resolve = query.resolve;
                highlight = query.highlight && resolve;
                enrich = highlight || query.enrich && resolve;
                let index;

                if (query.index) {
                    this.index = index = query.index;
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

                    query.resolve = !1;

                    result = index.search(query).result;
                    query.resolve = resolve;

                    if (highlight) {
                        highlight_query = query.query;
                    }
                } else if (query.and) {
                    result = this.and(query.and);
                } else if (query.or) {
                    result = this.or(query.or);
                } else if (query.xor) {
                    result = this.xor(query.xor);
                } else if (query.not) {
                    result = this.not(query.not);
                } else {
                    continue;
                }
            }

            if (result.then) {
                promises.push(result);
            } else if (result.length) {
                final[i] = result;
            } else if (!suggest && ("and" === fn || "xor" === fn)) {
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
};