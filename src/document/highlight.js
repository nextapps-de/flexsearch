// COMPILER BLOCK -->
import { DEBUG } from "../config.js";
// <-- COMPILER BLOCK
import { parse_simple } from "../common.js";
import Index from "../index.js";
import WorkerIndex from "../worker.js";
import {
    EnrichedDocumentSearchResults,
    EnrichedSearchResults,
    HighlightOptions
} from "../type.js";

/**
 * @param {string} query
 * @param {EnrichedDocumentSearchResults|EnrichedSearchResults} result
 * @param {Map<string, Index|WorkerIndex>} index
 * @param {string} pluck
 * @param {HighlightOptions|string} config
 * @return {EnrichedDocumentSearchResults|EnrichedSearchResults}
 */
export function highlight_fields(query, result, index, pluck, config){

    // The biggest issue is dealing with custom encoders, for this reason
    // a combined regular expression can't apply as a template

    let template, markup_open, markup_close;

    if(typeof config === "string"){
        template = config;
        config = "";
    }
    else{
        template = config.template;
    }

    if(DEBUG){
        if(!template){
            throw new Error('No template pattern was specified by the search option "highlight"');
        }
    }

    markup_open = template.indexOf("$1");

    if(DEBUG){
        if(markup_open === -1){
            throw new Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + template);
        }
    }

    markup_close = template.substring(markup_open + 2);
    markup_open = template.substring(0, markup_open);

    let boundary = config && config.boundary;
    let clip = !config || config.clip !== false;
    let merge = config && config.merge && markup_close && markup_open && new RegExp(markup_close + " " + markup_open, "g");
    let ellipsis = config && config.ellipsis;

    let ellipsis_markup_length = 0;
    let ellipsis_markup;
    if(typeof ellipsis === "object"){
        ellipsis_markup = ellipsis.template;
        ellipsis_markup_length = ellipsis_markup.length - 2;
        ellipsis = ellipsis.pattern;
    }
    if(typeof ellipsis !== "string"){
        ellipsis = ellipsis === false ? "" : "...";
    }
    if(ellipsis_markup_length){
        ellipsis = ellipsis_markup.replace("$1", ellipsis);
    }

    let ellipsis_length = ellipsis.length - ellipsis_markup_length;
    let boundary_before, boundary_after;

    if(typeof boundary === "object"){
        boundary_before = boundary.before;
        if(boundary_before === 0) boundary_before = -1;
        boundary_after = boundary.after;
        if(boundary_after === 0) boundary_after = -1;
        boundary = boundary.total || 9e5;
    }

    // cache shared encoders across fields
    let encoder = new Map();
    let query_enc;

    // todo remove this loop and pass in the field data directly
    // todo support field-specific configuration

    // for every field
    for(let i = 0, enc, idx, path; i < result.length; i++){

        /** @type {EnrichedSearchResults} */
        let res;

        if(pluck){
            res = result;
            path = pluck;
        }
        else{
            const tmp = result[i];
            path = tmp.field;
            // skip when not a field entry (e.g., tags)
            if(!path) continue;
            res = tmp.result;
        }

        idx = index.get(path);
        enc = idx.encoder;
        query_enc = encoder.get(enc);

        // re-encode a query when encoder has changed or take cache from shared encoders
        if(typeof query_enc !== "string"){
            query_enc = enc.encode(query);
            encoder.set(enc, query_enc);
        }

        // for every doc in results
        for(let j = 0; j < res.length; j++){

            const doc = res[j]["doc"];
            if(!doc) continue;
            const content = parse_simple(doc, path);
            if(!content) continue;
            // just split on whitespace and keep the original string (encoder split can't apply)
            const doc_org = content.trim().split(/\s+/);
            if(!doc_org.length) continue;

            let str = "";
            let str_arr = [];
            let pos_matches = [];
            let pos_first_match = -1;
            let pos_last_match = -1;
            let length_matches_all = 0;

            // loop terms of encoded doc content
            for(let k = 0; k < doc_org.length; k++){
                let doc_org_cur = doc_org[k];
                let doc_enc_cur = enc.encode(doc_org_cur);
                doc_enc_cur = doc_enc_cur.length > 1
                    ? doc_enc_cur.join(" ")
                    : doc_enc_cur[0];

                let found;

                if(doc_enc_cur && doc_org_cur){

                    let doc_org_cur_len = doc_org_cur.length;
                    let doc_org_diff = (enc.split ? doc_org_cur.replace(enc.split, "") : doc_org_cur).length - doc_enc_cur.length;
                    let match = "";
                    let match_length = 0;

                    // loop terms of encoded query content and determine the longest match
                    for(let l = 0; l < query_enc.length; l++){
                        let query_enc_cur = query_enc[l];
                        if(!query_enc_cur) continue;
                        let query_enc_cur_len = query_enc_cur.length;
                        // add length from shrinking phonetic transformations (todo: add tests)
                        query_enc_cur_len += doc_org_diff;
                        // skip the query token when match length can't exceed the previously highest found match
                        if(match_length && query_enc_cur_len <= match_length){
                            continue;
                        }
                        const position = doc_enc_cur.indexOf(query_enc_cur);
                        if(position > -1){
                            match =
                                // prefix
                                (position ? doc_org_cur.substring(0, position) : "") +
                                // match
                                markup_open + doc_org_cur.substring(position, position + query_enc_cur_len) + markup_close +
                                // suffix
                                (position + query_enc_cur_len < doc_org_cur_len ? doc_org_cur.substring(position + query_enc_cur_len) : "");
                            match_length = query_enc_cur_len;
                            found = true;
                        }
                        //console.log(doc_org_cur, doc_enc_cur, query_enc_cur, position, match)
                    }

                    // apply the longest match
                    if(match){
                        if(boundary){
                            // the outer boundary is used to check if all matches are within the total boundary
                            // if so, it can apply a simpler alignment
                            if(pos_first_match < 0){
                                pos_first_match = str.length + (str ? 1 : 0);
                            }
                            pos_last_match = str.length + (str ? 1 : 0) + match.length;
                            // the overall length of all matches is used to check if matches exceed the total boundary
                            // if so, it can early stop further processing
                            length_matches_all += doc_org_cur_len;
                            // the match positions are used to pick items for the final result more quickly
                            pos_matches.push(str_arr.length)
                            // collect every term as a match or text
                            str_arr.push({ match });
                        }
                        str += (str ? " " : "") + match;
                    }
                }

                if(!found){
                    const text = doc_org[k];
                    str += (str ? " " : "") + text;
                    // collect every term as a match or text
                    boundary && str_arr.push({ text });
                }
                else if(boundary){
                    if(length_matches_all >= boundary){
                        // matches have reached the total boundary
                        break;
                    }
                }
            }

            // the markup length does not apply to the total boundary
            let markup_length = pos_matches.length * (template.length - 2);

            // apply boundaries and align highlights
            if(boundary_before || boundary_after || (boundary && (str.length - markup_length) > boundary)){

                // also reduce ellipsis length from the boundary
                let boundary_length = boundary + markup_length - ellipsis_length * 2;
                let length = pos_last_match - pos_first_match;
                let start, end;

                if(boundary_before > 0){
                    length += boundary_before;
                }
                if(boundary_after > 0){
                    length += boundary_after;
                }

                // 1. all matches are withing the overall boundary (apply simple alignment)
                if(length <= boundary_length){

                    start = boundary_before
                        ? pos_first_match - (boundary_before > 0 ? boundary_before : 0)
                        : pos_first_match - ((boundary_length - length) / 2 | 0);
                    end = boundary_after
                        ? pos_last_match + (boundary_after > 0 ? boundary_after : 0)
                        : start + boundary_length;

                    // do not clip terms
                    if(!clip){
                       if(start > 0){
                           if(str.charAt(start) === " "){}
                           else if(str.charAt(start - 1) !== " "){
                                start = str.indexOf(" ", start);
                                (start < 0) && (start = 0);
                            }
                        }
                        if(end < str.length){
                            if(str.charAt(end - 1) === " "){}
                            else if(str.charAt(end) !== " "){
                                end = str.lastIndexOf(" ", end);
                                end < pos_last_match
                                    ? end = pos_last_match
                                    : ++end;
                            }
                        }
                    }

                    str = (start ? ellipsis : "") + str.substring(start, end) + (end < str.length ? ellipsis : "");
                }
                // 2. matches needs to be split by surrounded terms to fit into the boundary
                else{

                    const final = [];
                    const check = {};
                    const seamless = {};
                    const finished = {};
                    const before = {};
                    const after = {};
                    let final_length = 0;
                    let shift_left = 0;
                    let shift_right = 0;
                    let loop_left = 1;
                    let loop_right = 1;

                    while(true){

                        let loop;

                        for(let k = 0, pos; k < pos_matches.length; k++){

                            pos = pos_matches[k];

                            // 1. add matches to the result
                            if(!shift_right){
                                str = str_arr[pos].match;

                                // initialize custom boundaries for each slot
                                if(boundary_before){
                                    before[k] = boundary_before;
                                }
                                if(boundary_after){
                                    after[k] = boundary_after;
                                }

                                // count whitespaces between each term
                                if(k){
                                    final_length++;
                                }

                                let close;

                                // close left side when first term was matched
                                if(!pos){
                                    // it can be set before content was added,
                                    // because the first term match is always added
                                    seamless[k] = 1;
                                    finished[k] = 1;
                                }
                                // initial ellipsis
                                else if(!k && ellipsis_length){
                                    final_length += ellipsis_length;
                                }

                                // close right side when last term was matched
                                if(pos >= doc_org.length - 1){
                                    close = 1;
                                }
                                // close right side when next term was a match
                                else if((pos < str_arr.length - 1) && str_arr[pos + 1].match){
                                    close = 1;
                                }
                                else if(ellipsis_length){
                                    final_length += ellipsis_length;
                                }

                                // reduce template length on matches
                                final_length -= template.length - 2;

                                // at least add one match
                                if(!k || (final_length + str.length <= boundary)){
                                    final[k] = str;
                                }
                                else{
                                    seamless[k] = 0;
                                    loop = loop_left = loop_right = 0;
                                    break;
                                }

                                // update state when term was added
                                if(close){
                                    seamless[k + 1] = 1;
                                    finished[k + 1] = 1;
                                }
                            }
                            // 2. add surrounded text to the result
                            else{
                                // alternate direction term by term
                                // 2.1. extend to the right first (index: k + 1)
                                if(shift_left !== shift_right){
                                    if(finished[k + 1]) continue;
                                    pos += shift_right;

                                    // overlap with another slot
                                    if(check[pos]){
                                        final_length -= ellipsis_length;
                                        seamless[k + 1] = 1;
                                        finished[k + 1] = 1;
                                        continue;
                                    }
                                    // end reached
                                    if(pos >= str_arr.length - 1){
                                        if(pos >= str_arr.length){
                                            finished[k + 1] = 1;
                                            if(pos >= doc_org.length){
                                                seamless[k + 1] = 1;
                                            }
                                            continue;
                                        }
                                        final_length -= ellipsis_length;
                                    }

                                    str = str_arr[pos].text;

                                    let current_after = boundary_after && after[k];
                                    if(current_after){
                                        if(current_after > 0){
                                            if(str.length > current_after){
                                                finished[k + 1] = 1;
                                                if(clip){
                                                    str = str.substring(0, current_after);
                                                }
                                                else{
                                                    continue;
                                                }
                                            }
                                            current_after -= str.length;
                                            if(!current_after) current_after = -1;
                                            after[k] = current_after;
                                        }
                                        else{
                                            finished[k + 1] = 1;
                                            continue;
                                        }
                                    }

                                    // count whitespaces between each term
                                    if(final_length + str.length + 1 <= boundary){
                                        str = " " + str;
                                        final[k] += str;
                                    }
                                    else if(clip){
                                        const diff = boundary - final_length - 1;
                                        if(diff > 0){
                                            str = " " + str.substring(0, diff);
                                            final[k] += str;
                                        }
                                        finished[k + 1] = 1;
                                    }
                                    else{
                                        finished[k + 1] = 1;
                                        continue;
                                    }
                                }
                                // 2.2. extend to left (index: k)
                                else{
                                    if(finished[k]) continue;
                                    pos -= shift_left;

                                    // overlap with another slot
                                    if(check[pos]){
                                        final_length -= ellipsis_length;
                                        finished[k] = 1;
                                        seamless[k] = 1;
                                        continue;
                                    }
                                    // start reached
                                    if(pos <= 0){
                                        if(pos < 0){
                                            finished[k] = 1;
                                            seamless[k] = 1;
                                            continue;
                                        }
                                        final_length -= ellipsis_length;
                                    }

                                    str = str_arr[pos].text;

                                    let current_before = boundary_before && before[k];
                                    if(current_before){
                                        if(current_before > 0){
                                            if(str.length > current_before){
                                                finished[k] = 1;
                                                if(clip){
                                                    str = str.substring(str.length - current_before);
                                                }
                                                else{
                                                    continue;
                                                }
                                            }
                                            current_before -= str.length;
                                            if(!current_before) current_before = -1;
                                            before[k] = current_before;
                                        }
                                        else{
                                            finished[k] = 1;
                                            continue;
                                        }
                                    }

                                    // count whitespaces between each term
                                    if(final_length + str.length + 1 <= boundary){
                                        str += " ";
                                        final[k] = str + final[k];
                                    }
                                    else if(clip){
                                        const diff = str.length + 1 - (boundary - final_length);
                                        if(diff >= 0 && diff < str.length){
                                            str = str.substring(diff) + " ";
                                            final[k] = str + final[k];
                                        }
                                        finished[k] = 1;
                                    }
                                    else{
                                        finished[k] = 1;
                                        continue;
                                    }
                                }
                            }

                            // update state when term was added
                            final_length += str.length;
                            check[pos] = 1;
                            loop = 1;
                        }

                        if(loop){
                            // alternate shift direction
                            shift_left === shift_right
                                ? shift_right++
                                : shift_left++;
                        }
                        else{
                            // check finish state
                            shift_left === shift_right
                                ? loop_left = 0
                                : loop_right = 0;
                            // break the process when both directions are done
                            if(!loop_left && !loop_right){
                                break;
                            }
                            // continue with the opposite direction
                            if(loop_left){
                                shift_left++;
                                shift_right = shift_left;
                            }
                            else{
                                shift_right++;
                            }
                        }
                    }

                    str = "";
                    for(let k = 0, tmp; k < final.length; k++){
                        tmp = (k && seamless[k] ? " " : (k && !ellipsis ? " " : "") + ellipsis) + final[k];
                        str += tmp;
                    }
                    if(ellipsis && !seamless[final.length]){
                        str += ellipsis;
                    }
                    //console.log(query, seamless, final)
                }
            }

            if(merge){
                str = str.replace(/** @type {RegExp} */ (merge), " ");
            }

            res[j]["highlight"] = str;
        }

        if(pluck){
            break;
        }
    }

    return result;
}

// /**
//  * @param {string} query
//  * @param {EnrichedDocumentSearchResults|EnrichedSearchResults} result
//  * @param {Map<string, Index>} index
//  * @param {string} pluck
//  * @param {HighlightOptions|string} config
//  * @return {EnrichedDocumentSearchResults|EnrichedSearchResults}
//  */
// export function highlight_fields(query, result, index, pluck, config){
//
//     // The biggest issue is dealing with custom encoders, for this reason
//     // a combined regular expression can't apply as a template
//
//     let template, markup_open, markup_close;
//
//     if(typeof config === "string"){
//         template = config;
//         config = "";
//     }
//     else{
//         template = config.template;
//     }
//
//     if(DEBUG){
//         if(!template){
//             throw new Error('No template pattern was specified by the search option "highlight"');
//         }
//     }
//
//     markup_open = template.indexOf("$1");
//
//     if(DEBUG){
//         if(markup_open === -1){
//             throw new Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + template);
//         }
//     }
//
//     markup_close = template.substring(markup_open + 2);
//     markup_open = template.substring(0, markup_open);
//
//     let boundary = config && config.boundary;
//     let clip = !config || config.clip !== false;
//     let merge = config && config.merge && markup_close && markup_open && new RegExp(markup_close + " " + markup_open, "g");
//     let ellipsis = config && config.ellipsis;
//     if(typeof ellipsis !== "string"){
//         ellipsis = "...";
//     }
//
//     let boundary_before, boundary_after;
//
//     if(typeof boundary === "object"){
//         boundary_before = boundary.before;
//         if(boundary_before === 0) boundary_before = -1;
//         boundary_after = boundary.after;
//         if(boundary_after === 0) boundary_after = -1;
//         boundary = boundary.total || 9e5;
//     }
//
//     // cache shared encoders across fields
//     let encoder = new Map();
//     let query_enc;
//
//     // todo remove this loop and pass in the field data directly
//     // todo support field-specific configuration
//
//     // for every field
//     for(let i = 0, enc, idx, path; i < result.length; i++){
//
//         /** @type {EnrichedSearchResults} */
//         let res;
//
//         if(pluck){
//             res = result;
//             path = pluck;
//         }
//         else{
//             const tmp = result[i];
//             path = tmp.field;
//             // skip when not a field entry (e.g. tags)
//             if(!path) continue;
//             res = tmp.result;
//         }
//
//         idx = index.get(path);
//         enc = idx.encoder;
//         query_enc = encoder.get(enc);
//
//         // re-encode query when encoder has changed or take cache from shared encoders
//         if(typeof query_enc !== "string"){
//             query_enc = enc.encode(query);
//             encoder.set(enc, query_enc);
//         }
//
//         // for every doc in results
//         for(let j = 0; j < res.length; j++){
//
//             const doc = res[j]["doc"];
//             if(!doc) continue;
//             const content = parse_simple(doc, path);
//             if(!content) continue;
//             const doc_org = content.trim().split(/\s+/);
//             if(!doc_org.length) continue;
//
//             let str = "";
//             let pos_matches = [];
//             let length_matches_all = 0;
//
//             // loop terms of encoded doc content
//             for(let k = 0; k < doc_org.length; k++){
//                 let doc_org_cur = doc_org[k];
//                 let doc_org_cur_len = doc_org_cur.length;
//                 let doc_enc_cur = enc.encode(doc_org_cur);
//                 doc_enc_cur = doc_enc_cur.length > 1
//                     ? doc_enc_cur.join(" ")
//                     : doc_enc_cur[0];
//
//                 let found;
//
//                 if(doc_enc_cur && doc_org_cur){
//
//                     let match = "";
//                     let match_length = 0;
//
//                     // loop terms of encoded query content and determine the longest match
//                     for(let l = 0; l < query_enc.length; l++){
//                         let query_enc_cur = query_enc[l];
//                         if(!query_enc_cur) continue;
//                         let query_enc_cur_len = query_enc_cur.length;
//                         // add length from shrinking phonetic transformations (todo: add tests)
//                         query_enc_cur_len += doc_org_cur.length - doc_enc_cur.length;
//                         // skip query token when match length can't exceed previously highest found match
//                         if(match_length && query_enc_cur_len <= match_length){
//                             continue;
//                         }
//                         const position = doc_enc_cur.indexOf(query_enc_cur);
//                         //console.log(doc_org_cur, doc_enc_cur, query_enc_cur, position)
//                         if(position > -1){
//                             match =
//                                 // prefix
//                                 (position ? doc_org_cur.substring(0, position) : "") +
//                                 // match
//                                 markup_open + doc_org_cur.substring(position, position + query_enc_cur_len) + markup_close +
//                                 // suffix
//                                 (position + query_enc_cur_len < doc_org_cur_len ? doc_org_cur.substring(position + query_enc_cur_len) : "");
//                             match_length = query_enc_cur_len;
//                             found = true;
//                         }
//                     }
//
//                     // apply the longest match
//                     if(match){
//                         if(boundary){
//                             if(!pos_matches.length && k) length_matches_all += ellipsis.length;
//                             // the overall length of all matches is used to check if matches exceeds the total boundary
//                             // if so, it can early stop further processing
//                             length_matches_all += match.length;//doc_org_cur_len + (str ? 1 : 0) + (k < doc_org.length - 1 ? ellipsis.length : 0);
//                             // the match positions are used to pick items for the final result more quickly
//                             pos_matches.push([
//                                 str.length + (str ? 1 : 0),
//                                 str.length + (str ? 1 : 0) + match.length,
//                                 k
//                             ]);
//                         }
//                         str += (str ? " " : "") + match;
//                     }
//                 }
//
//                 if(!found){
//                     const text = doc_org[k];
//                     str += (str ? " " : "") + text;
//                 }
//                 else if(boundary){
//                     if(length_matches_all >= boundary){
//                         // matches has reached total boundary
//                         break;
//                     }
//                 }
//             }
//
//             // the markup length does not apply to the total boundary
//             let markup_length = pos_matches.length * (template.length - 2);
//
//             // apply boundaries and align highlights
//             if(boundary_before || boundary_after || (boundary && (str.length - markup_length) > boundary)){
//
//                 let final = "";
//                 let surrounded_length = (((((boundary + markup_length) - length_matches_all) / pos_matches.length) - ellipsis.length) / 2);
//                 //if(surrounded_length < 0) surrounded_length = 0;
//
//                 let before = boundary_before || (
//                     surrounded_length > 0
//                         ? Math.floor(surrounded_length +
//                             (boundary_after
//                                 ? surrounded_length - boundary_after
//                                 : 0))
//                         : 0
//                 );
//                 let after = boundary_after || (
//                     surrounded_length > 0
//                         ? Math.ceil(surrounded_length +
//                             (boundary_before
//                                 ? surrounded_length - boundary_before
//                                 : 0))
//                         : 0
//                 );
//
//                 //console.log(surrounded_length, before, after)
//
//                 for(let k = 0, cur, prev, next; k < pos_matches.length; k++){
//
//                     prev = cur;
//                     cur = next || pos_matches[k];
//                     next = pos_matches[k + 1];
//
//                     let start = cur[0] - before;
//                     let end = cur[1] + after;
//                     let closed_left;
//                     let closed_right;
//
//                     // if(k){
//                     //     closed_left = 1;
//                     // }
//
//                     // apply right limit
//                     if(next && (end >= next[0] - before)){
//                         end = cur[1] + (next[0] - cur[1]) / 2 | 0;
//                         start -= ellipsis.length + 1;
//                         closed_right = 1;
//                     }
//                     // apply left limit
//                     if(prev && (start <= prev[1] + after)){
//                         start = cur[0] - (cur[0] - prev[1]) / 2 | 0;
//                         end += ellipsis.length + 1;
//                         closed_left = 1;
//
//                         // repeat right limit
//                         if(next && (end >= next[0] - before)){
//                             end = cur[1] + (next[0] - cur[1]) / 2 | 0;
//                             closed_right = 1;
//                         }
//                     }
//
//                     //console.log(start, end, prev, cur, next);
//
//                     // do not clip terms
//                     if(!clip){
//                         if(start){
//                             if(str.charAt(start) === " "){
//                                 //start++;
//                             }
//                             else if(str.charAt(start - 1) !== " "){
//                                 start = str.indexOf(" ", start);
//                                 start < 0
//                                     ? start = cur[0]
//                                     : start;//++;
//                             }
//                         }
//                         if(end < str.length){
//                             if(str.charAt(end - 1) === " "){
//                                 //end--;
//                             }
//                             else if(str.charAt(end) !== " "){
//                                 end = str.lastIndexOf(" ", end);
//                                 end < cur[1]
//                                     ? end = cur[1]
//                                     : end++;
//                             }
//                         }
//                     }
//
//                     final +=
//                         /*(final ? " " : "") +*/
//                         (!closed_left && start > 0 ? ellipsis : "") +
//                         str.substring(start, end) +
//                         (!closed_right && cur[2] < doc_org.length - 1 ? ellipsis : "");
//
//                     //console.log(final)
//                 }
//
//                 str = final;
//             }
//
//             if(merge){
//                 str = str.replace(merge, " ");
//             }
//
//             res[j]["highlight"] = str;
//         }
//
//         if(pluck){
//             break;
//         }
//     }
//
//     return result;
// }