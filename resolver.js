import default_resolver from "./resolve/default.js";
import { set_resolve } from "./index/search.js";
import or from "./resolve/or.js";
import and from "./resolve/and.js";
import xor from "./resolve/xor.js";
import not from "./resolve/not.js";

export default function Resolver(result){
    if(result && result.index){
        result.resolve = false;
        this.index = result.index;
        return result.index.search(result);
    }
    if(!(this instanceof Resolver)){
        return new Resolver(result);
    }
    if(result instanceof Resolver){
        // todo remove
        console.log("Resolver Loopback")
        return result;
    }
    this.index = null;
    this.result = result || [];
    this.boost = 0;
}

Resolver.prototype.or = or;
Resolver.prototype.and = and;
Resolver.prototype.not = not;
Resolver.prototype.xor = xor;

Resolver.prototype.limit = function(limit){
    if(this.result.length){
        const final = [];
        let count = 0;
        for(let j = 0, ids; j < this.result.length; j++){
            ids = this.result[j];
            if(ids.length + count < limit){
                final[j] = ids;
                count += ids.length;
            }
            else{
                final[j] = ids.slice(0, limit - count);
                this.result = final;
                break;
            }
        }
    }
    return this;
};

Resolver.prototype.offset = function(offset){
    if(this.result.length){
        const final = [];
        let count = 0;
        for(let j = 0, ids; j < this.result.length; j++){
            ids = this.result[j];
            if(ids.length + count < offset){
                count += ids.length;
            }
            else{
                final[j] = ids.slice(offset - count);
                count = offset;
            }
        }
        this.result = final;
    }
    return this;
};

Resolver.prototype.boost = function(boost){
    this.boost += boost;
    return this;
};

Resolver.prototype.enrich = function(){
    if(this.result.length){
        for(let j = 0, ids; j < this.result.length; j++){
            ids = this.result[j];
            for(let i = 0; i < ids.length; i++){
                ids[i] = {
                    score: j,
                    id: ids[i],
                    doc: null
                }
            }
        }
    }
    return this;
};

Resolver.prototype.resolve = function(limit, offset, enrich){
    set_resolve(1);
    const tmp = this.result;
    this.index = null;
    this.result = null;
    if(tmp.length){
        return default_resolver(tmp, limit, offset, enrich);
    }
    return tmp;
};
