
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
        // todo: check when this branch was taken
        // instead of Promise.all the args[] array could be reduced
        // by iterate recursively one by one
        return Promise.all(args).then(function (args) {
            return self[fn].apply(self, args);
        });
    }

    if (first_argument[0]) {
        // detect array parameter style
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
        suggest;
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
                enrich = query.enrich && resolve;

                if (query.index) {
                    query.resolve = /* suggest */ /* append: */ /* enrich */!1;
                    query.enrich = !1;
                    result = query.index.search(query).result;
                    query.resolve = resolve;
                    query.enrich = enrich;
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
        suggest
    };
};