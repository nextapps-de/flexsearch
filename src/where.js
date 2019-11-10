import FlexSearch from "./flexsearch.js";
import { get_keys, is_function, is_object, is_undefined } from "./common.js";

if(SUPPORT_DOCUMENT && SUPPORT_WHERE){

    FlexSearch.prototype.find = function(key, value){

        return this.where(key, value, 1)[0] || null;
    };

    /**
     * @param key
     * @param value
     * @param limit
     * @param {Array<Object>=} result
     * @returns {Array<Object>}
     */

    FlexSearch.prototype.where = function(key, value, limit, result){

        const doc = this._doc;
        const results = [];

        let count = 0;
        let keys;
        let keys_len;
        let has_value;
        let tree;
        let tag_results;

        if(is_object(key)){

            limit || (limit = value);
            keys = get_keys(key);
            keys_len = keys.length;
            has_value = false;

            if((keys_len === 1) && (keys[0] === "id")){

                return [doc[key["id"]]];
            }

            const tags = this._tags;

            if(tags && !result){

                for(let i = 0; i < tags.length; i++){

                    const current_tag = tags[i];
                    const current_where = key[current_tag];

                    if(!is_undefined(current_where)){

                        tag_results = this._tag[current_tag]["@" + current_where];
                        //result = result.slice(0, limit && (limit < result.length) ? limit : result.length);

                        if(--keys_len === 0){

                            return tag_results;
                        }

                        keys.splice(keys.indexOf(current_tag), 1);

                        // TODO: delete from original reference?
                        delete key[current_tag];
                        break;
                    }
                }
            }

            tree = new Array(keys_len);

            for(let i = 0; i < keys_len; i++){

                tree[i] = keys[i].split(":");
            }
        }
        else if(is_function(key)){

            const ids = result || get_keys(doc);
            const length = ids.length;

            for(let x = 0; x < length; x++){

                const obj = doc[ids[x]];

                if(key(obj)){

                    results[count++] = obj;
                }
            }

            return results;
        }
        else{

            if(is_undefined(value)){

                return [doc[key]];
            }

            if(key === "id"){

                return [doc[value]];
            }

            keys = [key];
            keys_len = 1;
            tree = [key.split(":")];
            has_value = true;
        }

        const ids = tag_results || result || get_keys(doc); // this._ids;
        const length = ids.length;

        for(let x = 0; x < length; x++){

            const obj = tag_results ? ids[x] : doc[ids[x]];
            let found = true;

            for(let i = 0; i < keys_len; i++){

                has_value || (value = key[keys[i]]);

                const tree_cur = tree[i];
                const tree_len = tree_cur.length;

                let ref = obj;

                if(tree_len > 1){

                    for(let z = 0; z < tree_len; z++){

                        ref = ref[tree_cur[z]];
                    }
                }
                else{

                    ref = ref[tree_cur[0]];
                }

                if(ref !== value){

                    found = false;
                    break;
                }
            }

            if(found){

                results[count++] = obj;

                if(limit && (count === limit)){

                    break;
                }
            }
        }

        return results;
    };
}