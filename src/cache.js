import { is_undefined, create_object } from "./common.js";

/**
 * @param {boolean|number=} limit
 * @constructor
 */

export default function CacheClass(limit){

    this.clear();

    /** @private */
    this.limit = (limit !== true) && limit;
}

CacheClass.prototype.clear = function(){

    /** @private */
    this.cache = create_object();
    /** @private */
    this.count = create_object();
    /** @private */
    this.index = create_object();
    /** @private */
    this.ids = [];
};

CacheClass.prototype.set = function(key, value){

    if(this.limit && is_undefined(this.cache[key])){

        let length = this.ids.length;

        if(length === this.limit){

            length--;

            const last_id = this.ids[length];

            delete this.cache[last_id];
            delete this.count[last_id];
            delete this.index[last_id];
        }

        this.ids[length] = key;
        this.index[key] = length;
        this.count[key] = -1;
        this.cache[key] = value;

        // TODO: remove extra call
        // shift up counter +1

        this.get(key);
    }
    else{

        this.cache[key] = value;
    }
};

/**
 * Note: It is better to have the complexity when fetching the cache:
 */

CacheClass.prototype.get = function(key){

    const cache = this.cache[key];

    if(this.limit && cache){

        const count = ++this.count[key];
        const index = this.index;
        let current_index = index[key];

        if(current_index > 0){

            const ids = this.ids;
            const old_index = current_index;

            // forward pointer
            while(this.count[ids[--current_index]] <= count){

                if(current_index === -1){

                    break;
                }
            }

            // move pointer back
            current_index++;

            if(current_index !== old_index){

                // copy values from predecessors
                for(let i = old_index; i > current_index; i--) {

                    const tmp = ids[i - 1];

                    ids[i] = tmp;
                    index[tmp] = i;
                }

                // push new value on top
                ids[current_index] = key;
                index[key] = current_index;
            }
        }
    }

    return cache;
};