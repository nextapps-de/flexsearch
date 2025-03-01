import Resolver from "../resolver.js";
import default_resolver from "./default.js";
import { create_object } from "../common.js";
import or from "./or.js";
import and from "./and.js";
import not from "./not.js";

export default function xor(){
    const self = this;
    let args = arguments;
    let first_argument = args[0];

    if(first_argument instanceof Promise){
        return first_argument.then(function(){
            return self.xor.apply(self, args);
        });
    }

    if(first_argument[0]){
        // fix false passed parameter style
        if(first_argument[0].index){
            return this.xor.apply(this, first_argument);
        }
    }

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
                result = or(query.or);
            }
            else if(query.and){
                result = and(query.and);
            }
            else if(query.not){
                result = not(query.not);
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
            self.result.length && (final = [self.result].concat(final));
            self.result = exclusive(final, limit, offset, enrich, !resolve);
            return resolve ? self.result : self;
        });
    }

    this.result.length && (final = [this.result].concat(final));
    this.result = exclusive(final, limit, offset, enrich, !resolve);
    return resolve ? this.result : this;
}

function exclusive(result, limit, offset, enrich, resolve){

    if(!result.length){
        // todo remove
        console.log("Empty Result")
        return result;
    }

    if(result.length < 2){
        // todo remove
        console.log("Single Result")
        if(resolve){
            return default_resolver(result[0], limit, offset, enrich);
        }
        else{
            return result[0];
        }
    }

    const final = [];
    const check = create_object()

    for(let i = 0, res; i < result.length; i++){
        res = result[i];
        if(!res) continue;

        for(let j = 0, ids; j < res.length; j++){
            ids = res[j];
            if(!ids) continue;

            for(let k = 0, id; k < ids.length; k++){
                id = ids[k];
                check[id]
                    ? check[id]++
                    : check[id] = 1;
            }
        }
    }

    for(let i = 0, res; i < result.length; i++){
        res = result[i];
        if(!res) continue;

        for(let j = 0, ids; j < res.length; j++){
            ids = res[j];
            if(!ids) continue;

            for(let k = 0, id; k < ids.length; k++){
                id = ids[k];
                if(check[id] === 1){
                    if(resolve){
                        final.push(id);
                    }
                    else{
                        // shift resolution by boost (inverse)
                        const index = j + (i ? this.boost : 0);
                        final[index] || (final[index] = []);
                        final[index].push(id);
                    }
                }
            }
        }
    }

    //this.boost = 0;
    return final;
}