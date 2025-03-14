import Resolver from "../resolver.js";
import default_resolver from "./default.js";
import { create_object } from "../common.js";
// import or from "./or.js";
// import and from "./and.js";
// import not from "./not.js";

Resolver.prototype.xor = function () {
    const self = this;
    let args = arguments,
        first_argument = args[0];


    if (first_argument.then) {
        return first_argument.then(function () {
            return self.xor.apply(self, args);
        });
    }

    if (first_argument[0]) {
        // fix false passed parameter style
        if (first_argument[0].index) {
            return this.xor.apply(this, first_argument);
        }
    }

    let final = [],
        promises = [],
        limit = 0,
        offset = 0,
        enrich,
        resolve;


    for (let i = 0, query; i < args.length; i++) {
        if (query = args[i]) {

            limit = query.limit || 0;
            offset = query.offset || 0;
            enrich = query.enrich;
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
            } else if (query.not) {
                result = this.not(query.not);
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
            self.result.length && (final = [self.result].concat(final));
            self.result = exclusive(final, limit, offset, enrich, !resolve, self.boostval);
            return resolve ? self.result : self;
        });
    }

    if (final.length) {
        this.result.length && (final = [this.result].concat(final));
        this.result = exclusive(final, limit, offset, enrich, !resolve, self.boostval);
    }
    return resolve ? this.result : this;
};

/**
 * @param result
 * @param limit
 * @param offset
 * @param enrich
 * @param resolve
 * @param boost
 * @return {Array}
 */

function exclusive(result, limit, offset, enrich, resolve, boost) {

    if (!result.length) {
        // todo remove
        //console.log("Empty Result")
        return result;
    }

    if (2 > result.length) {
        // todo remove
        //console.log("Single Result")
        if (resolve) {
            return default_resolver(result[0], limit, offset, enrich);
        } else {
            return result[0];
        }
    }

    const final = [],
          check = create_object();

    let maxres = 0;

    for (let i = 0, res; i < result.length; i++) {
        res = result[i];
        if (!res) continue;

        for (let j = 0, ids; j < res.length; j++) {
            ids = res[j];
            if (!ids) continue;

            if (maxres < ids.length) maxres = ids.length;

            for (let k = 0, id; k < ids.length; k++) {
                id = ids[k];
                check[id] ? check[id]++ : check[id] = 1;
            }
        }
    }

    for (let j = 0, ids, count = 0; j < maxres; j++) {

        for (let i = 0, res; i < result.length; i++) {
            res = result[i];
            if (!res) continue;

            ids = res[j];
            if (!ids) continue;

            for (let k = 0, id; k < ids.length; k++) {
                id = ids[k];
                if (1 === check[id]) {
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
                        // shift resolution by boost (inverse)
                        const index = j + (i ? boost : 0);
                        final[index] || (final[index] = []);
                        final[index].push(id);
                        if (++count === limit) {
                            return final;
                        }
                    }
                }
            }
        }
    }

    //this.boost = 0;
    return final;
}