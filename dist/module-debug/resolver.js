import default_resolver from "./resolve/default.js";
import { set_resolve } from "./index/search.js";
import "./resolve/or.js";
import "./resolve/and.js";
import "./resolve/xor.js";
import "./resolve/not.js";

/**
 * @param result
 * @constructor
 */

export default function Resolver(result) {
    if (!this) {
        return new Resolver(result);
    }
    if (result && result.index) {
        result.resolve = /* suggest */ /* append: */ /* enrich */!1;
        this.index = result.index;
        return result.index.search(result);
    }
    if (result.constructor === Resolver) {
        // todo test this branch
        //console.log("Resolver Loopback")
        return result;
    }
    this.index = null;
    this.result = result || [];
    this.boostval = 0;
}

Resolver.prototype.limit = function (limit) {
    if (this.result.length) {
        const final = [];
        let count = 0;
        for (let j = 0, ids; j < this.result.length; j++) {
            ids = this.result[j];
            if (ids.length + count < limit) {
                final[j] = ids;
                count += ids.length;
            } else {
                final[j] = ids.slice(0, limit - count);
                this.result = final;
                break;
            }
        }
    }
    return this;
};

Resolver.prototype.offset = function (offset) {
    if (this.result.length) {
        const final = [];
        let count = 0;
        for (let j = 0, ids; j < this.result.length; j++) {
            ids = this.result[j];
            if (ids.length + count < offset) {
                count += ids.length;
            } else {
                final[j] = ids.slice(offset - count);
                count = offset;
            }
        }
        this.result = final;
    }
    return this;
};

Resolver.prototype.boost = function (boost) {
    this.boostval += boost;
    return this;
};

Resolver.prototype.resolve = function (limit, offset, enrich) {
    set_resolve(1);
    const result = this.result;
    this.index = null;
    this.result = null;

    if (result.length) {
        if ("object" == typeof limit) {
            enrich = limit.enrich;
            offset = limit.offset;
            limit = limit.limit;
        }
        return default_resolver(result, limit || 100, offset, enrich);
    }

    return result;
};