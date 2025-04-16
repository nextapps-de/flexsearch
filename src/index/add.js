// COMPILER BLOCK -->
import {
    SUPPORT_COMPRESSION,
    SUPPORT_KEYSTORE,
    SUPPORT_PERSISTENT
} from "../config.js";
// <-- COMPILER BLOCK
import { create_object } from "../common.js";
import Index, { autoCommit } from "../index.js";
import default_compress from "../compress.js";
import { KeystoreArray } from "../keystore.js";

// TODO:
// string + number as text
// boolean, null, undefined as ?


/**
 * @param {!number|string} id
 * @param {!string} content
 * @param {boolean=} _append
 * @param {boolean=} _skip_update
 */

Index.prototype.add = function(id, content, _append, _skip_update){

    if(content && (id || (id === 0))){

        // todo check skip_update
        //_skip_update = false;

        if(!_skip_update && !_append){
            if(this.reg.has(id)){
                return this.update(id, content);
            }
        }

        const depth = this.depth;
        // do not force a string as input
        // https://github.com/nextapps-de/flexsearch/issues/432
        content = this.encoder.encode(content, !depth);
        const word_length = content.length;

        if(word_length){

            // check context dupes to skip all contextual redundancy along a document

            const dupes_ctx = create_object();
            const dupes = create_object();
            const resolution = this.resolution;

            for(let i = 0; i < word_length; i++){

                let term = content[this.rtl ? word_length - 1 - i : i];
                let term_length = term.length;

                // todo check context search
                // this check also wasn't applied on search, so it's useless here
                // skip dupes will break the context chain
                if(term_length && (depth || !dupes[term])){

                    let score = this.score
                        ? this.score(content, term, i, null, 0)
                        : get_score(resolution, word_length, i);
                    let token = "";

                    switch(this.tokenize){

                        case "full":
                            if(term_length > 2){
                                for(let x = 0, _x; x < term_length; x++){
                                    for(let y = term_length; y > x; y--){
                                        token = term.substring(x, y);
                                        _x = this.rtl ? term_length - 1 - x : x;
                                        const partial_score = this.score
                                            ? this.score(content, term, i, token, _x)
                                            : get_score(resolution, word_length, i, term_length, _x);
                                        this.push_index(dupes, token, partial_score, id, _append);
                                    }
                                }
                                break;
                            }
                        // fallthrough to next case when term length < 3
                        case "bidirectional":
                        case "reverse":
                            // skip last round (this token exist already in "forward")
                            if(term_length > 1){
                                for(let x = term_length - 1; x > 0; x--){
                                    token = term[
                                        this.rtl
                                            ? term_length - 1 - x
                                            : x
                                    ] + token;
                                    const partial_score = this.score
                                        ? this.score(content, term, i, token, x)
                                        : get_score(resolution, word_length, i, term_length, x);
                                    this.push_index(dupes, token, partial_score, id, _append);
                                }
                                token = "";
                            }

                        // fallthrough to next case to apply forward also
                        case "forward":
                            if(term_length > 1){
                                for(let x = 0; x < term_length; x++){
                                    token += term[
                                        this.rtl
                                            ? term_length - 1 - x
                                            : x
                                    ];
                                    this.push_index(dupes, token, score, id, _append);
                                }
                                break;
                            }

                        // fallthrough to next case when token has a length of 1
                        default: // "strict":
                            this.push_index(dupes, term, score, id, _append);
                            // context is just supported by tokenizer "strict"
                            if(depth){

                                if((word_length > 1) && (i < (word_length - 1))){

                                    // check inner dupes to skip repeating words in the current context
                                    const dupes_inner = create_object();
                                    const resolution = this.resolution_ctx;
                                    const keyword = term;
                                    const size = Math.min(
                                        depth + 1,
                                        this.rtl
                                            ? i + 1
                                            : word_length - i
                                    );

                                    dupes_inner[keyword] = 1;

                                    for(let x = 1; x < size; x++){

                                        term = content[
                                            this.rtl
                                                ? word_length - 1 - i - x
                                                : i + x
                                        ];

                                        if(term && !dupes_inner[term]){

                                            dupes_inner[term] = 1;
                                            const context_score = this.score
                                                ? this.score(content, keyword, i, term, x - 1)
                                                : get_score(resolution + ((word_length / 2) > resolution ? 0 : 1), word_length, i, size - 1, x - 1);
                                            const swap = this.bidirectional && (term > keyword);
                                            this.push_index(
                                                dupes_ctx,
                                                swap ? keyword : term,
                                                context_score,
                                                id,
                                                _append,
                                                swap ? term : keyword
                                            );
                                        }
                                    }
                                }
                            }
                    }
                }
            }

            this.fastupdate || this.reg.add(id);
        }
        else{
            content = "";
        }
    }

    if(SUPPORT_PERSISTENT && this.db){
        // when the term has no valid content (e.g. empty),
        // then it was not added to the ID registry for removal
        content || this.commit_task.push({ "del": id });
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

Index.prototype.push_index = function(dupes, term, score, id, append, keyword){

    let arr = keyword ? this.ctx : this.map;
    let tmp;

    if(!dupes[term] || (keyword && !(tmp = dupes[term])[keyword])){

        if(keyword){

            dupes = tmp || (dupes[term] = create_object());
            dupes[keyword] = 1;

            if(SUPPORT_COMPRESSION && this.compress){
                keyword = default_compress(keyword);
            }

            tmp = arr.get(keyword);
            tmp ? arr = tmp
                : arr.set(keyword, arr = new Map());
        }
        else{

            dupes[term] = 1;
        }

        if(SUPPORT_COMPRESSION && this.compress){
            term = default_compress(term);
        }

        tmp = arr.get(term);
        tmp ? arr = tmp : arr.set(term, arr = tmp = []);
        // the ID array will be upgraded dynamically
        arr = arr[score] || (arr[score] = []);

        if(!append || !arr.includes(id)){

            // auto-upgrade to keystore array if max size exceeded
            if(SUPPORT_KEYSTORE){
                if(arr.length === 2**31-1 /*|| !(arr instanceof KeystoreArray)*/){
                    const keystore = new KeystoreArray(arr);
                    if(this.fastupdate){
                        for(let value of this.reg.values()){
                            if(value.includes(arr)){
                                value[value.indexOf(arr)] = keystore;
                            }
                        }
                    }
                    tmp[score] = arr = keystore;
                }
            }

            arr.push(id);

            // add a reference to the register for fast updates
            if(this.fastupdate){
                const tmp = this.reg.get(id);
                tmp ? tmp.push(arr)
                    : this.reg.set(id, [arr]);
            }
        }
    }
}

/**
 * @param {number} resolution
 * @param {number} length
 * @param {number} i
 * @param {number=} term_length
 * @param {number=} x
 * @returns {number}
 */

function get_score(resolution, length, i, term_length, x){

    // console.log("resolution", resolution);
    // console.log("length", length);
    // console.log("term_length", term_length);
    // console.log("i", i);
    // console.log("x", x);
    // console.log((resolution - 1) / (length + (term_length || 0)) * (i + (x || 0)) + 1);

    // the first resolution slot is reserved for the best match,
    // when a query matches the first word(s).

    // also to stretch score to the whole range of resolution, the
    // calculation is shift by one and cut the floating point.
    // this needs the resolution "1" to be handled additionally.

    // do not stretch the resolution more than the term length will
    // improve performance and memory, also it improves scoring in
    // most cases between a short document and a long document

    return i && (resolution > 1) ? (

        (length + (term_length || 0)) <= resolution ?

            i + (x || 0)
        :
            ((resolution - 1) / (length + (term_length || 0)) * (i + (x || 0)) + 1) | 0
        ):
            0;
}
