import Resolver from "../resolver.js";
import { create_object, get_max_len } from "../common.js";
import { intersect as _intersect } from "../intersect.js";
import { ResolverOptions } from "../type.js";

Resolver.prototype.and = function(){
    if(this.result.length){

        const self = this;
        let args = arguments;
        let first_argument = args[0];

        if(first_argument.then){
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

        let final = [];
        let promises = [];
        let limit = 0, offset = 0, enrich, resolve, suggest;

        for(let i = 0, query; i < args.length; i++){

            query = /** @type {string|ResolverOptions} */ (
                args[i]
            );

            if(query){

                limit = query.limit || 0;
                offset = query.offset || 0;
                enrich = query.enrich;
                resolve = query.resolve;
                suggest = query.suggest;

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
                    continue;
                }

                final[i] = result;

                if(result.then){
                    promises.push(result); //{ query, result };
                }
            }
        }

        if(!final.length){
            this.result = final;
            return resolve ? this.result : this;
        }

        if(promises.length){
            return Promise.all(promises).then(function(){
                final = [self.result].concat(final);
                self.result = intersect(final, limit, offset, enrich, resolve, self.boostval, suggest);
                return resolve ? self.result : self;
            });
        }

        final = [this.result].concat(final);
        this.result = intersect(final, limit, offset, enrich, resolve, this.boostval, suggest);
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
 * @param suggest
 * @return {Array}
 */

function intersect(result, limit, offset, enrich, resolve, boost, suggest){

    // if(!result.length){
    //     // todo remove
    //     console.log("Empty Result")
    //     return result;
    // }

    if(result.length < 2){
        return [];
    }

    let final = [];
    let count = 0;
    let contain = create_object();
    let maxres = get_max_len(result);
    if(!maxres) return final;

    //console.log(result)

    return _intersect(result, maxres, limit, offset, suggest, boost, resolve);

    // for(let j = 0, ids, res = result[0]; j < res.length; j++){
    //     ids = res[j];
    //     for(let k = 0; k < ids.length; k++){
    //         contain[ids[k]] = 1;
    //     }
    // }

    // for(let i = 0, res; i < result.length; i++){
    //     res = result[i];
    //     if(!res || !res.length) return [];
    //     let contain_new = create_object();
    //     let match = 0;
    //     let last_round = i === result.length - 1;
    //
    //     for(let j = 0, ids; j < maxres; j++){
    //         ids = res[j];
    //         if(!ids) continue;
    //
    //         for(let k = 0, id, min; k < ids.length; k++){
    //             id = ids[k];
    //             // fill in first round
    //             if(!i){
    //                 // shift resolution +1
    //                 // shift resolution by boost (inverse)
    //                 contain_new[id] = j + 1 + (i ? boost : 0);
    //                 match = 1;
    //             }
    //             // result in last round
    //             else if(last_round){
    //                 if((min = contain[id])){
    //                     match = 1;
    //                     //if(!contain_new[id]){
    //                     if(offset){
    //                         offset--;
    //                         continue;
    //                     }
    //                     if(resolve){
    //                         final.push(id);
    //                     }
    //                     else{
    //                         // reduce resolution -1
    //                         min--;
    //                         if(j < min) min = j;
    //                         final[min] || (final[min] = []);
    //                         final[min].push(id);
    //                     }
    //                     if(limit && ++count === limit){
    //                         //this.boost = 0;
    //                         return final;
    //                     }
    //                     // shift resolution +1
    //                     //contain_new[id] = min + 1;
    //                     //}
    //                 }
    //             }
    //             // check for intersection
    //             else if((min = contain[id])){
    //                 // shift resolution +1
    //                 if(j + 1 < min) min = j + 1;
    //                 contain_new[id] = min;
    //                 match = 1;
    //             }
    //         }
    //     }
    //
    //     if(!match){
    //         //this.boost = 0;
    //         return [];
    //     }
    //
    //     contain = contain_new;
    // }
    //
    // //this.boost = 0;
    // return final;
}
