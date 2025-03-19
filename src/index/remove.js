// COMPILER BLOCK -->
import {
    SUPPORT_CACHE,
    SUPPORT_PERSISTENT
} from "../config.js";
// <-- COMPILER BLOCK
import { is_array } from "../common.js";
import Index, { autoCommit } from "../index.js";

/**
 * @param {!number|string} id
 * @param {boolean=} _skip_deletion
 */
Index.prototype.remove = function(id, _skip_deletion){

    const refs = this.reg.size && (
        this.fastupdate
            ? this.reg.get(id)
            : this.reg.has(id)
    );

    if(refs){

        if(this.fastupdate){

            // fast updates did not fully clean up the key entries

            for(let i = 0, tmp; i < refs.length; i++){
                if((tmp = refs[i])){
                    // todo check
                    //if(tmp.length < 1) throw new Error("invalid length");
                    //if(tmp.indexOf(id) < 0) throw new Error("invalid id");
                    if(tmp.length < 2){
                        tmp.pop();
                    }
                    else{
                        const index = tmp.indexOf(id);
                        index === refs.length - 1
                            ? tmp.pop()
                            : tmp.splice(index, 1);
                    }
                }
                else{
                    // todo investigate empty entries
                }
            }

            // todo variation which cleans up, requires to push [ctx, key] instead of arr to the index.reg
            // for(let i = 0, arr, term, keyword; i < refs.length; i++){
            //     arr = refs[i];
            //     if(typeof arr === "string"){
            //         arr = this.map.get(term = arr);
            //     }
            //     else{
            //         arr = this.ctx.get(keyword = arr[0]);
            //         arr && (arr = arr.get(arr[1]));
            //     }
            //     let counter = 0, found;
            //     if(arr && arr.length){
            //         for(let j = 0, tmp; j < arr.length; j++){
            //             if((tmp = arr[j])){
            //                 if(!found && tmp.length){
            //                     const index = tmp.indexOf(id);
            //                     if(index >= 0){
            //                         tmp.splice(index, 1);
            //                         // the index [ctx, key]:[res, id] is unique
            //                         found = 1;
            //                     }
            //                 }
            //                 if(tmp.length){
            //                     counter++;
            //                     if(found){
            //                         break;
            //                     }
            //                 }
            //                 else{
            //                     delete arr[j];
            //                 }
            //             }
            //         }
            //     }
            //     if(!counter){
            //         keyword
            //             ? this.ctx.delete(keyword)
            //             : this.map.delete(term);
            //     }
            // }
        }
        else{

            remove_index(this.map, id/*, this.resolution*/);
            this.depth &&
            remove_index(this.ctx, id/*, this.resolution_ctx*/);
        }

        _skip_deletion || this.reg.delete(id);
    }

    if(SUPPORT_PERSISTENT && this.db){
        this.commit_task.push({ "del": id });
        this.commit_auto && autoCommit(this);
        //return this.db.remove(id);
    }

    // the cache could be used outside the InMemory store
    if(SUPPORT_CACHE && this.cache){
        this.cache.remove(id);
    }

    return this;
};

/**
 * @param {!Map|Array<number|string|Array<number|string>>} map
 * @param {!number|string} id
 * @return {number}
 */

function remove_index(map, id){

    // a check counter of filled resolution slots
    // to prevent removing the field
    let count = 0;

    if(is_array(map)){
        for(let x = 0, arr, index; x < map.length; x++){
            if((arr = map[x]) && arr.length){
                index = arr.indexOf(id);
                if(index >= 0){
                    if(arr.length > 1){
                        arr.splice(index, 1);
                        count++;
                    }
                    else{
                        // remove resolution slot
                        delete map[x];
                    }
                    // the index key:[res, id] is unique
                    break;
                }
                else{
                    count++;
                }
            }
        }
    }
    else for(let item of map.entries()){
        const key = item[0];
        const value = item[1];
        const tmp = remove_index(value, id);
        tmp ? count += tmp
            : map.delete(key);
    }

    return count;
}
