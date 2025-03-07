import Resolver from "../resolver.js";
import default_resolver from "./default.js";
import { create_object, get_max_len } from "../common.js";
// import xor from "./xor.js";
// import or from "./or.js";
// import not from "./not.js";

Resolver.prototype.and = function(){
    if(this.result.length){

        const self = this;
        let args = arguments;
        let first_argument = args[0];

        if(first_argument instanceof Promise){
            return first_argument.then(function(){
                return self.and.apply(self, args);
            });
        }

        if(first_argument[0]){
            // fix false passed parameter style
            if(first_argument[0].index){
                return this.and.apply(this, first_argument);
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
        //         return first_argument.index.search(first_argument);
        //     }
        // }

        let final = [];
        let promises = [];
        let limit = 0, offset = 0, enrich, resolve;

        for(let i = 0, query; i < args.length; i++){
            if((query = args[i])){

                let result;
                if(query instanceof Resolver){
                    result = query.result;
                }
                else if(query.constructor === Array){
                    result = query;
                }
                else if(query.index){
                    query.resolve = false;
                    result = query.index.search(query).result;
                }
                else if(query.or){
                    result = this.or(query.or);
                }
                else if(query.xor){
                    result = this.xor(query.xor);
                }
                else if(query.not){
                    result = this.not(query.not);
                }
                else{
                    limit = query.limit || 0;
                    offset = query.offset || 0;
                    enrich = query.enrich;
                    resolve = query.resolve;
                    continue;
                }

                final[i] = result;

                if(result instanceof Promise){
                    promises.push(result); //{ query, result };
                }
            }
        }

        if(promises.length){
            return Promise.all(promises).then(function(){
                final = [self.result].concat(final);
                self.result = intersect(final, limit, offset, enrich, resolve, self.boostval);
                return resolve ? self.result : self;
            });
        }

        final = [this.result].concat(final);
        this.result = intersect(final, limit, offset, enrich, resolve, self.boostval);
        return resolve ? this.result : this;
    }
    return this;
}

/**
 * Aggregate the intersection of N raw results
 * @param result
 * @param limit
 * @param offset
 * @param enrich
 * @param resolve
 * @param boost
 * @return {Array}
 */

function intersect(result, limit, offset, enrich, resolve, boost){

    // if(!result.length){
    //     // todo remove
    //     console.log("Empty Result")
    //     return result;
    // }

    if(result.length < 2){
        // todo remove
        //console.log("Single Result")
        return [];
        // if(resolve){
        //     return default_resolver(result[0], limit, offset, enrich);
        // }
        // else{
        //     return result[0];
        // }
    }

    let final = [];
    let count = 0;

    // fast path single slot
    // if(result.length < 2){
    //     if(limit || offset){
    //         let res = result[0];
    //         for(let j = 0, ids; j < res.length; j++){
    //             ids = res[j];
    //             if(!ids) continue;
    //             for(let k = 0, id; k < ids.length; k++){
    //                 id = ids[k];
    //                 if(offset){
    //                     offset--;
    //                     continue;
    //                 }
    //                 if(resolve){
    //                     final.push(id);
    //                 }
    //                 else{
    //                     final[j + this.boost] || (final[j + this.boost] = []);
    //                     final[j + this.boost].push(id);
    //                 }
    //                 if(limit && ++count === limit){
    //                     this.boost = 0;
    //                     return final;
    //                 }
    //             }
    //         }
    //     }
    //     this.boost = 0;
    //     return result[0];
    // }

    let contain = create_object();
    let maxres = get_max_len(result);
    if(!maxres) return final;

    // for(let j = 0, ids, res = result[0]; j < res.length; j++){
    //     ids = res[j];
    //     for(let k = 0; k < ids.length; k++){
    //         contain[ids[k]] = 1;
    //     }
    // }

    for(let i = 0, res; i < result.length; i++){
        res = result[i];
        if(!res || !res.length) return [];
        let contain_new = create_object();
        let match = 0;
        let last_round = i === result.length - 1;

        for(let j = 0, ids; j < maxres; j++){
            ids = res[j];
            if(!ids) continue;

            for(let k = 0, id, min; k < ids.length; k++){
                id = ids[k];
                // fill in first round
                if(!i){
                    // shift resolution +1
                    // shift resolution by boost (inverse)
                    contain_new[id] = j + 1 + (i ? boost : 0);
                    match = 1;
                }
                // result in last round
                else if(last_round){
                    if((min = contain[id])){
                        match = 1;
                        //if(!contain_new[id]){
                        if(offset){
                            offset--;
                            continue;
                        }
                        if(resolve){
                            final.push(id);
                        }
                        else{
                            // reduce resolution -1
                            min--;
                            if(j < min) min = j;
                            final[min] || (final[min] = []);
                            final[min].push(id);
                        }
                        if(limit && ++count === limit){
                            //this.boost = 0;
                            return final;
                        }
                        // shift resolution +1
                        //contain_new[id] = min + 1;
                        //}
                    }
                }
                // check for intersection
                else if((min = contain[id])){
                    // shift resolution +1
                    if(j + 1 < min) min = j + 1;
                    contain_new[id] = min;
                    match = 1;
                }
            }
        }

        if(!match){
            //this.boost = 0;
            return [];
        }

        contain = contain_new;
    }

    //this.boost = 0;
    return final;
}
