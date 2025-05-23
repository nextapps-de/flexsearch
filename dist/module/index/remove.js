
import { is_array } from "../common.js";
import Index, { autoCommit } from "../index.js";
import { KeystoreMap } from "../keystore.js";

/**
 * @param {!number|string} id
 * @param {boolean=} _skip_deletion
 */
Index.prototype.remove = function (id, _skip_deletion) {

    const refs = this.reg.size && (this.fastupdate ? this.reg.get(id) : this.reg.has(id));

    if (refs) {

        if (this.fastupdate) {

            for (let i = 0, tmp, len; i < refs.length; i++) {
                if ((tmp = refs[i]) && (len = tmp.length)) {

                    if (tmp[len - 1] === id) {
                        tmp.pop();
                    } else {
                        const index = tmp.indexOf(id);
                        if (0 <= index) {
                            tmp.splice(index, 1);
                        }
                    }
                }
            }
        } else {

            remove_index(this.map, id);
            this.depth && remove_index(this.ctx, id);
        }

        _skip_deletion || this.reg.delete(id);
    }

    if (this.db) {
        this.commit_task.push({ del: id });
        this.commit_auto && autoCommit(this);
    }

    if (this.cache) {
        this.cache.remove(id);
    }

    return this;
};

/**
 * When called without passing ID it just will clean up
 * @param {!Map|KeystoreMap|Array<number|string|Array<number|string>>} map
 * @param {!number|string=} id
 * @return {number}
 */

export function remove_index(map, id) {
    let count = 0;


    if (is_array(map)) {
        for (let x = 0, arr, index, found; x < map.length; x++) {
            if ((arr = map[x]) && arr.length) {
                if ("undefined" == typeof id) {
                    return 1;
                } else {
                    index = arr.indexOf(id);
                    if (0 <= index) {
                        if (1 < arr.length) {
                            arr.splice(index, 1);

                            return 1;
                        } else {

                            delete map[x];
                            if (count) {
                                return 1;
                            }
                            found = 1;
                        }
                    } else {
                        if (found) {
                            return 1;
                        }
                        count++;
                    }
                }
            }
        }
    } else for (let item of map.entries()) {
        const key = item[0],
              value = item[1],
              tmp = remove_index(value, id);

        tmp ? count++ : map.delete(key);
    }

    return count;
}