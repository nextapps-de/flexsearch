
import { create_object } from "../common.js";
import Index, { autoCommit } from "../index.js";
import default_compress from "../compress.js";
import { KeystoreArray } from "../keystore.js";

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
        const word_length = content.length;

        if (word_length) {
            const dupes_ctx = create_object(),
                  dupes = create_object(),
                  resolution = this.resolution;


            for (let i = 0; i < word_length; i++) {
                let term = content[this.rtl ? word_length - 1 - i : i],
                    term_length = term.length;


                if (term_length && (depth || !dupes[term])) {
                    let score = this.score ? this.score(content, term, i, null, 0) : get_score(resolution, word_length, i),
                        token = "";


                    switch (this.tokenize) {

                        case "full":
                            if (2 < term_length) {
                                for (let x = 0, _x; x < term_length; x++) {
                                    for (let y = term_length; y > x; y--) {
                                        token = term.substring(x, y);
                                        _x = this.rtl ? term_length - 1 - x : x;
                                        const partial_score = this.score ? this.score(content, term, i, token, _x) : get_score(resolution, word_length, i, term_length, _x);
                                        this.push_index(dupes, token, partial_score, id, _append);
                                    }
                                }
                                break;
                            }

                        case "bidirectional":
                        case "reverse":

                            if (1 < term_length) {
                                for (let x = term_length - 1; 0 < x; x--) {
                                    token = term[this.rtl ? term_length - 1 - x : x] + token;
                                    const partial_score = this.score ? this.score(content, term, i, token, x) : get_score(resolution, word_length, i, term_length, x);
                                    this.push_index(dupes, token, partial_score, id, _append);
                                }
                                token = "";
                            }

                        case "forward":
                            if (1 < term_length) {
                                for (let x = 0; x < term_length; x++) {
                                    token += term[this.rtl ? term_length - 1 - x : x];
                                    this.push_index(dupes, token, score, id, _append);
                                }
                                break;
                            }

                        default:
                            this.push_index(dupes, term, score, id, _append);

                            if (depth) {

                                if (1 < word_length && i < word_length - 1) {
                                    const dupes_inner = create_object(),
                                          resolution = this.resolution_ctx,
                                          keyword = term,
                                          size = Math.min(depth + 1, this.rtl ? i + 1 : word_length - i);


                                    dupes_inner[keyword] = 1;

                                    for (let x = 1; x < size; x++) {

                                        term = content[this.rtl ? word_length - 1 - i - x : i + x];

                                        if (term && !dupes_inner[term]) {

                                            dupes_inner[term] = 1;
                                            const context_score = this.score ? this.score(content, keyword, i, term, x - 1) : get_score(resolution + (word_length / 2 > resolution ? 0 : 1), word_length, i, size - 1, x - 1),
                                                  swap = this.bidirectional && term > keyword;

                                            this.push_index(dupes_ctx, swap ? keyword : term, context_score, id, _append, swap ? term : keyword);
                                        }
                                    }
                                }
                            }
                    }
                }
            }

            this.fastupdate || this.reg.add(id);
        } else {
            content = "";
        }
    }

    if (this.db) {

        content || this.commit_task.push({ del: id });
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

Index.prototype.push_index = function (dupes, term, score, id, append, keyword) {
    let arr = keyword ? this.ctx : this.map,
        tmp;


    if (!dupes[term] || keyword && !(tmp = dupes[term])[keyword]) {

        if (keyword) {

            dupes = tmp || (dupes[term] = create_object());
            dupes[keyword] = 1;

            if (this.compress) {
                keyword = default_compress(keyword);
            }

            tmp = arr.get(keyword);
            tmp ? arr = tmp : arr.set(keyword, arr = new Map());
        } else {

            dupes[term] = 1;
        }

        if (this.compress) {
            term = default_compress(term);
        }

        tmp = arr.get(term);
        tmp ? arr = tmp : arr.set(term, arr = tmp = []);

        arr = arr[score] || (arr[score] = []);

        if (!append || !arr.includes(id)) {
            if (2147483647 === arr.length) {
                const keystore = new KeystoreArray(arr);
                if (this.fastupdate) {
                    for (let value of this.reg.values()) {
                        if (value.includes(arr)) {
                            value[value.indexOf(arr)] = keystore;
                        }
                    }
                }
                tmp[score] = arr = keystore;
            }


            arr.push(id);

            if (this.fastupdate) {
                const tmp = this.reg.get(id);
                tmp ? tmp.push(arr) : this.reg.set(id, [arr]);
            }
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