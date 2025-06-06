
import { create_object } from "../common.js";
import Index, { autoCommit } from "../index.js";
import default_compress from "../compress.js";
import { KeystoreArray, KeystoreMap } from "../keystore.js";

/**
 * @param {!number|string} id
 * @param {!string} content
 * @param {boolean=} _append
 * @param {boolean=} _skip_update
 */
Index.prototype.add = function (id, content, _append, _skip_update) {

    if (content && (id || 0 === id)) {

        if (!_skip_update && !_append) {
            if (this.reg.has(id)) {
                return this.update(id, content);
            }
        }

        const depth = this.depth;

        content = this.encoder.encode(content, !depth);
        const term_count = content.length;

        if (term_count) {
            const dupes_ctx = create_object(),
                  dupes = create_object(),
                  resolution = this.resolution;


            for (let i = 0; i < term_count; i++) {
                let term = content[this.rtl ? term_count - 1 - i : i],
                    term_length = term.length;


                if (term_length && (depth || !dupes[term])) {
                    let score = this.score ? this.score(content, term, i, null, 0) : get_score(resolution, term_count, i),
                        token = "";


                    switch (this.tokenize) {

                        case "tolerant":
                            this._push_index(dupes, term, score, id, _append);
                            if (2 < term_length) {
                                for (let x = 1, char_a, char_b, prt_1, prt_2; x < term_length - 1; x++) {
                                    char_a = term.charAt(x);
                                    char_b = term.charAt(x + 1);
                                    prt_1 = term.substring(0, x) + char_b;
                                    prt_2 = term.substring(x + 2);

                                    token = prt_1 + char_a + prt_2;
                                    this._push_index(dupes, token, score, id, _append);

                                    token = prt_1 + prt_2;
                                    this._push_index(dupes, token, score, id, _append);
                                }

                                this._push_index(dupes, term.substring(0, term.length - 1), score, id, _append);
                            }
                            break;

                        case "full":
                            if (2 < term_length) {
                                for (let x = 0, _x; x < term_length; x++) {
                                    for (let y = term_length; y > x; y--) {
                                        token = term.substring(x, y);
                                        _x = this.rtl ? term_length - 1 - x : x;
                                        const partial_score = this.score ? this.score(content, term, i, token, _x) : get_score(resolution, term_count, i, term_length, _x);
                                        this._push_index(dupes, token, partial_score, id, _append);
                                    }
                                }
                                break;
                            }

                        case "bidirectional":
                        case "reverse":

                            if (1 < term_length) {
                                for (let x = term_length - 1; 0 < x; x--) {
                                    token = term[this.rtl ? term_length - 1 - x : x] + token;
                                    const partial_score = this.score ? this.score(content, term, i, token, x) : get_score(resolution, term_count, i, term_length, x);
                                    this._push_index(dupes, token, partial_score, id, _append);
                                }
                                token = "";
                            }

                        case "forward":
                            if (1 < term_length) {
                                for (let x = 0; x < term_length; x++) {
                                    token += term[this.rtl ? term_length - 1 - x : x];
                                    this._push_index(dupes, token, score, id, _append);
                                }
                                break;
                            }

                        default:
                            this._push_index(dupes, term, score, id, _append);

                            if (depth && 1 < term_count && i < term_count - 1) {
                                const resolution = this.resolution_ctx,
                                      keyword = term,
                                      size = Math.min(depth + 1, this.rtl ? i + 1 : term_count - i);


                                for (let x = 1; x < size; x++) {

                                    term = content[this.rtl ? term_count - 1 - i - x : i + x];

                                    const swap = this.bidirectional && term > keyword,
                                          context_score = this.score ? this.score(content, keyword, i, term, x - 1) : get_score(resolution + (term_count / 2 > resolution ? 0 : 1), term_count, i, size - 1, x - 1);

                                    this._push_index(dupes_ctx, swap ? keyword : term, context_score, id, _append, swap ? term : keyword);
                                }
                            }
                    }
                }
            }

            this.fastupdate || this.reg.add(id);
        }
    }

    if (this.db) {
        this.commit_task.push(_append ? { ins: id } : { del: id });
        this.commit_auto && autoCommit(this);
    }

    return this;
};

/**
 * @private
 * @param dupes
 * @param term
 * @param score
 * @param id
 * @param {boolean=} append
 * @param {string=} keyword
 */
Index.prototype._push_index = function (dupes, term, score, id, append, keyword) {

    let res, arr;

    if (!(res = dupes[term]) || keyword && !res[keyword]) {

        if (keyword) {

            dupes = res || (dupes[term] = create_object());
            dupes[keyword] = 1;

            if (this.compress) {
                keyword = default_compress(keyword);
            }

            arr = this.ctx;
            res = arr.get(keyword);
            res ? arr = res : arr.set(keyword, arr = this.keystore ? new KeystoreMap(this.keystore) : new Map());
        } else {

            arr = this.map;
            dupes[term] = 1;
        }

        if (this.compress) {
            term = default_compress(term);
        }

        res = arr.get(term);
        res ? arr = res : arr.set(term, arr = res = []);

        if (append) {
            for (let i = 0, arr; i < res.length; i++) {
                arr = res[i];
                if (arr && arr.includes(id)) {
                    if (i <= score) {

                        return;
                    } else {

                        arr.splice(arr.indexOf(id), 1);
                        if (this.fastupdate) {
                            const tmp = this.reg.get(id);
                            tmp && tmp.splice(tmp.indexOf(arr), 1);
                        }
                    }
                    break;
                }
            }
        }

        arr = arr[score] || (arr[score] = []);
        arr.push(id);

        if (2147483647 === arr.length) {
            const keystore = new KeystoreArray(arr);
            if (this.fastupdate) {
                for (let value of this.reg.values()) {
                    if (value.includes(arr)) {
                        value[value.indexOf(arr)] = keystore;
                    }
                }
            }
            res[score] = arr = keystore;
        }


        if (this.fastupdate) {
            const tmp = this.reg.get(id);
            tmp ? tmp.push(arr) : this.reg.set(id, [arr]);
        }
    }
};

/**
 * @param {number} resolution
 * @param {number} length
 * @param {number} i
 * @param {number=} term_length
 * @param {number=} x
 * @returns {number}
 */
function get_score(resolution, length, i, term_length, x) {

    return i && 1 < resolution ? length + (term_length || 0) <= resolution ? i + (x || 0) : 0 | (resolution - 1) / (length + (term_length || 0)) * (i + (x || 0)) + 1 : 0;
}