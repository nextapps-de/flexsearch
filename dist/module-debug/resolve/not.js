import Resolver from "../resolver.js";
import default_resolver from "./default.js";
import { create_object } from "../common.js";
// import or from "./or.js";
// import and from "./and.js";
// import xor from "./xor.js";

Resolver.prototype.not = function () {
    const self = this;
    let args = arguments,
        first_argument = args[0];


    if (first_argument.then) {
        return first_argument.then(function () {
            return self.not.apply(self, args);
        });
    }

    if (first_argument[0]) {
        // fix false passed parameter style
        if (first_argument[0].index) {
            return this.not.apply(this, first_argument);
        }
    }

    let final = [],
        promises = [],
        limit = 0,
        offset = 0,
        resolve;


    for (let i = 0, query; i < args.length; i++) {
        if (query = args[i]) {

            limit = query.limit || 0;
            offset = query.offset || 0;
            query.enrich;
            resolve = query.resolve;

            let result;
            if (query.constructor === Resolver) {
                result = query.result;
            } else if (query.constructor === Array) {
                result = query;
            } else if (query.index) {
                query.resolve = /* suggest */ /* append: */ /* enrich */!1;
                result = query.index.search(query).result;
            } else if (query.or) {
                result = this.or(query.or);
            } else if (query.and) {
                result = this.and(query.and);
            } else if (query.xor) {
                result = this.xor(query.xor);
            } else {
                continue;
            }

            final[i] = result;

            if (result.then) {
                promises.push(result); //{ query, result };
            }
        }
    }

    if (promises.length) {
        return Promise.all(promises).then(function () {
            self.result = exclusion.call(self, final, limit, offset, resolve);
            return resolve ? self.result : self;
        });
    }

    if (final.length) {
        this.result = exclusion.call(this, final, limit, offset, resolve);
    }

    return resolve ? this.result : this;
};

/**
 * @param result
 * @param limit
 * @param offset
 * @param resolve
 * @this Resolver
 * @return {Array}
 */

function exclusion(result, limit, offset, resolve) {

    if (!result.length) {
        return this.result;
    }

    const final = [],
          exclude = new Set(result.flat().flat());


    for (let j = 0, ids, count = 0; j < this.result.length; j++) {
        ids = this.result[j];
        if (!ids) continue;

        for (let k = 0, id; k < ids.length; k++) {
            id = ids[k];
            if (!exclude.has(id)) {
                if (offset) {
                    offset--;
                    continue;
                }
                if (resolve) {
                    final.push(id);
                    if (final.length === limit) {
                        return final;
                    }
                } else {
                    final[j] || (final[j] = []);
                    final[j].push(id);
                    if (++count === limit) {
                        return final;
                    }
                }
            }
        }
    }

    return final;
}