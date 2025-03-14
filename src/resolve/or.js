import Resolver from "../resolver.js";
import default_resolver from "./default.js";
import { create_object, get_max_len } from "../common.js";
import { union as _union } from "../intersect.js";

Resolver.prototype.or = function(){

    const self = this;
    let args = arguments;
    let first_argument = args[0];

    if(first_argument.then){
        return first_argument.then(function(){
            return self.or.apply(self, args);
        });
    }

    if(first_argument[0]){
        // fix false passed parameter style
        if(first_argument[0].index){
            return this.or.apply(this, first_argument);
        }
    }

    // for(let i = 0; i < args.length; i++){
    //     if(args[i].result instanceof Promise){
    //         return;
    //     }
    // }

    // if(args.length < 2){
    //     if(first_argument.index){
    //         first_argument.resolve = false;
    //         const result = first_argument.index.search(first_argument);
    //         if(result instanceof Promise){
    //             result.then(function(result){
    //                 final = self.result.concat(result);
    //                 self.result = resolver(final, limit, offset, enrich, !resolve);
    //                 return resolve ? self.result : self;
    //             });
    //         }
    //         else{
    //             final = this.result.concat(result);
    //             this.result = resolver(final, limit, offset, enrich, !resolve);
    //             return resolve ? this.result : this;
    //         }
    //     }
    // }

    let final = [];
    let promises = [];
    let limit = 0, offset = 0, enrich, resolve;

    for(let i = 0, query; i < args.length; i++){
        if((query = args[i])){

            limit = query.limit || 0;
            offset = query.offset || 0;
            enrich = query.enrich;
            resolve = query.resolve;

            let result;
            if(query.constructor === Resolver){
                result = query.result;
            }
            else if(query.constructor === Array){
                result = query;
            }
            else if(query.index){
                query.resolve = false;
                result = query.index.search(query).result;
            }
            else if(query.and){
                result = this.and(query.and);
            }
            else if(query.xor){
                result = this.xor(query.xor);
            }
            else if(query.not){
                result = this.not(query.not);
            }
            else{
                continue;
            }

            final[i] = result;

            if(result.then){
                promises.push(result); //{ query, result };
            }
        }
    }

    if(promises.length){
        return Promise.all(promises).then(function(){
            //self.result.length && (final = [self.result].concat(final));
            // the suggest-union was re-used from but there it needs reversed order
            self.result.length && (final = final.concat([self.result]));
            self.result = union(final, limit, offset, enrich, resolve, self.boostval);
            return resolve ? self.result : self;
        });
    }

    if(final.length){
        //this.result.length && (final = [this.result].concat(final));
        // the suggest-union was re-used but there it needs reversed order
        this.result.length && (final = final.concat([this.result]));
        this.result = union(final, limit, offset, enrich, resolve, this.boostval);
    }
    return resolve ? this.result : this;
};

/**
 * Aggregate the union of N raw results
 * @param result
 * @param limit
 * @param offset
 * @param enrich
 * @param resolve
 * @param boost
 * @return {Array}
 */

function union(result, limit, offset, enrich, resolve, boost){

    if(!result.length){
        // todo remove
        //console.log("Empty Result")
        return result;
    }

    if(typeof limit === "object"){
        offset = limit.offset || 0;
        enrich = limit.enrich || false;
        limit = limit.limit || 0;
    }

    if(result.length < 2){
        // todo remove
        //console.log("Single Result")
        if(resolve){
            return default_resolver(result[0], limit, offset, enrich);
        }
        else{
            return result[0];
        }
    }

    // the suggest-union
    return _union(result/*.reverse()*/, offset, limit, resolve, boost);

    // let final = [];
    // let count = 0;
    // let dupe = create_object();
    // let maxres = get_max_len(result);
    //
    // for(let j = 0, ids; j < maxres; j++){
    //     for(let i = 0, res; i < result.length; i++){
    //         res = result[i];
    //         if(!res) continue;
    //         ids = res[j];
    //         if(!ids) continue;
    //
    //         for(let k = 0, id; k < ids.length; k++){
    //             id = ids[k];
    //             if(!dupe[id]){
    //                 dupe[id] = 1;
    //                 if(offset){
    //                     offset--;
    //                     continue;
    //                 }
    //                 if(resolve){
    //                     final.push(id);
    //                 }
    //                 else{
    //                     // shift resolution by boost (inverse)
    //                     const index = j + (boost || 0);
    //                     final[index] || (final[index] = []);
    //                     final[index].push(id);
    //                 }
    //                 if(limit && ++count === limit){
    //                     //this.boost = 0;
    //                     return final;
    //                 }
    //             }
    //         }
    //     }
    // }
    //
    // //this.boost = 0;
    // return final;
}
