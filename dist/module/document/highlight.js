
import { parse_simple } from "../common.js";
import Index from "../index.js";
import WorkerIndex from "../worker.js";
import { EnrichedDocumentSearchResults, EnrichedSearchResults, HighlightOptions } from "../type.js";

/**
 * @param {string} query
 * @param {EnrichedDocumentSearchResults|EnrichedSearchResults} result
 * @param {Map<string, Index|WorkerIndex>} index
 * @param {string} pluck
 * @param {HighlightOptions|string} config
 * @return {EnrichedDocumentSearchResults|EnrichedSearchResults}
 */
export function highlight_fields(query, result, index, pluck, config) {

    let template, markup_open, markup_close;

    if ("string" == typeof config) {
        template = config;
        config = "";
    } else {
        template = config.template;
    }

    markup_open = template.indexOf("$1");

    markup_close = template.substring(markup_open + 2);
    markup_open = template.substring(0, markup_open);

    let boundary = config && config.boundary,
        clip = !config || !1 !== config.clip,
        merge = config && config.merge && markup_close && markup_open && new RegExp(markup_close + " " + markup_open, "g"),
        ellipsis = config && config.ellipsis,
        ellipsis_markup_length = 0,
        ellipsis_markup;

    if ("object" == typeof ellipsis) {
        ellipsis_markup = ellipsis.template;
        ellipsis_markup_length = ellipsis_markup.length - 2;
        ellipsis = ellipsis.pattern;
    }
    if ("string" != typeof ellipsis) {
        ellipsis = !1 === ellipsis ? "" : "...";
    }
    if (ellipsis_markup_length) {
        ellipsis = ellipsis_markup.replace("$1", ellipsis);
    }

    let ellipsis_length = ellipsis.length - ellipsis_markup_length,
        boundary_before,
        boundary_after;


    if ("object" == typeof boundary) {
        boundary_before = boundary.before;
        if (0 === boundary_before) boundary_before = -1;
        boundary_after = boundary.after;
        if (0 === boundary_after) boundary_after = -1;
        boundary = boundary.total || 9e5;
    }

    let encoder = new Map(),
        query_enc;


    for (let i = 0, enc, idx, path; i < result.length; i++) {

        /** @type {EnrichedSearchResults} */
        let res;

        if (pluck) {
            res = result;
            path = pluck;
        } else {
            const tmp = result[i];
            path = tmp.field;

            if (!path) continue;
            res = tmp.result;
        }

        idx = index.get(path);
        enc = idx.encoder;
        query_enc = encoder.get(enc);

        if ("string" != typeof query_enc) {
            query_enc = enc.encode(query);
            encoder.set(enc, query_enc);
        }

        for (let j = 0; j < res.length; j++) {

            const doc = res[j].doc;
            if (!doc) continue;
            const content = parse_simple(doc, path);
            if (!content) continue;

            const doc_org = content.trim().split(/\s+/);
            if (!doc_org.length) continue;

            let str = "",
                str_arr = [],
                pos_matches = [],
                pos_first_match = -1,
                pos_last_match = -1,
                length_matches_all = 0;


            for (let k = 0; k < doc_org.length; k++) {
                let doc_org_cur = doc_org[k],
                    doc_enc_cur = enc.encode(doc_org_cur);

                doc_enc_cur = 1 < doc_enc_cur.length ? doc_enc_cur.join(" ") : doc_enc_cur[0];

                let found;

                if (doc_enc_cur && doc_org_cur) {
                    let doc_org_cur_len = doc_org_cur.length,
                        doc_org_diff = (enc.split ? doc_org_cur.replace(enc.split, "") : doc_org_cur).length - doc_enc_cur.length,
                        match = "",
                        match_length = 0;


                    for (let l = 0, query_enc_cur; l < query_enc.length; l++) {
                        query_enc_cur = query_enc[l];

                        if (!query_enc_cur) continue;
                        let query_enc_cur_len = query_enc_cur.length;

                        query_enc_cur_len += doc_org_diff;

                        if (match_length && query_enc_cur_len <= match_length) {
                            continue;
                        }
                        const position = doc_enc_cur.indexOf(query_enc_cur);
                        if (-1 < position) {
                            match = (position ? doc_org_cur.substring(0, position) : "") + markup_open + doc_org_cur.substring(position, position + query_enc_cur_len) + markup_close + (position + query_enc_cur_len < doc_org_cur_len ? doc_org_cur.substring(position + query_enc_cur_len) : "");
                            match_length = query_enc_cur_len;
                            found = !0;
                        }
                    }

                    if (match) {
                        if (boundary) {

                            if (0 > pos_first_match) {
                                pos_first_match = str.length + (str ? 1 : 0);
                            }
                            pos_last_match = str.length + (str ? 1 : 0) + match.length;

                            length_matches_all += doc_org_cur_len;

                            pos_matches.push(str_arr.length);

                            str_arr.push({ match });
                        }
                        str += (str ? " " : "") + match;
                    }
                }

                if (!found) {
                    const text = doc_org[k];
                    str += (str ? " " : "") + text;

                    boundary && str_arr.push({ text });
                } else if (boundary) {
                    if (length_matches_all >= boundary) {

                        break;
                    }
                }
            }

            let markup_length = pos_matches.length * (template.length - 2);

            if (boundary_before || boundary_after || boundary && str.length - markup_length > boundary) {
                let boundary_length = boundary + markup_length - 2 * ellipsis_length,
                    length = pos_last_match - pos_first_match,
                    start,
                    end;


                if (0 < boundary_before) {
                    length += boundary_before;
                }
                if (0 < boundary_after) {
                    length += boundary_after;
                }

                if (length <= boundary_length) {

                    start = boundary_before ? pos_first_match - (0 < boundary_before ? boundary_before : 0) : pos_first_match - (0 | (boundary_length - length) / 2);
                    end = boundary_after ? pos_last_match + (0 < boundary_after ? boundary_after : 0) : start + boundary_length;

                    if (!clip) {
                        if (0 < start) {
                            if (" " === str.charAt(start)) {} else if (" " !== str.charAt(start - 1)) {
                                start = str.indexOf(" ", start);
                                0 > start && (start = 0);
                            }
                        }
                        if (end < str.length) {
                            if (" " === str.charAt(end - 1)) {} else if (" " !== str.charAt(end)) {
                                end = str.lastIndexOf(" ", end);
                                end < pos_last_match ? end = pos_last_match : ++end;
                            }
                        }
                    }

                    str = (start ? ellipsis : "") + str.substring(start, end) + (end < str.length ? ellipsis : "");
                } else {
                    const final = [],
                          check = {},
                          seamless = {},
                          finished = {},
                          before = {},
                          after = {};
                    let final_length = 0,
                        shift_left = 0,
                        shift_right = 0,
                        loop_left = 1,
                        loop_right = 1;


                    while (!0) {

                        let loop;

                        for (let k = 0, pos; k < pos_matches.length; k++) {

                            pos = pos_matches[k];

                            if (!shift_right) {
                                str = str_arr[pos].match;

                                if (boundary_before) {
                                    before[k] = boundary_before;
                                }
                                if (boundary_after) {
                                    after[k] = boundary_after;
                                }

                                if (k) {
                                    final_length++;
                                }

                                let close;

                                if (!pos) {

                                    seamless[k] = 1;
                                    finished[k] = 1;
                                } else if (!k && ellipsis_length) {
                                    final_length += ellipsis_length;
                                }

                                if (pos >= doc_org.length - 1) {
                                    close = 1;
                                } else if (pos < str_arr.length - 1 && str_arr[pos + 1].match) {
                                    close = 1;
                                } else if (ellipsis_length) {
                                    final_length += ellipsis_length;
                                }

                                final_length -= template.length - 2;

                                if (!k || final_length + str.length <= boundary) {
                                    final[k] = str;
                                } else {
                                    seamless[k] = 0;
                                    loop = loop_left = loop_right = 0;
                                    break;
                                }

                                if (close) {
                                    seamless[k + 1] = 1;
                                    finished[k + 1] = 1;
                                }
                            } else {

                                if (shift_left != shift_right) {
                                    if (finished[k + 1]) continue;
                                    pos += shift_right;

                                    if (check[pos]) {
                                        final_length -= ellipsis_length;
                                        seamless[k + 1] = 1;
                                        finished[k + 1] = 1;
                                        continue;
                                    }

                                    if (pos >= str_arr.length - 1) {
                                        if (pos >= str_arr.length) {
                                            finished[k + 1] = 1;
                                            if (pos >= doc_org.length) {
                                                seamless[k + 1] = 1;
                                            }
                                            continue;
                                        }
                                        final_length -= ellipsis_length;
                                    }

                                    str = str_arr[pos].text;

                                    let current_after = boundary_after && after[k];
                                    if (current_after) {
                                        if (0 < current_after) {
                                            if (str.length > current_after) {
                                                finished[k + 1] = 1;
                                                if (clip) {
                                                    str = str.substring(0, current_after);
                                                } else {
                                                    continue;
                                                }
                                            }
                                            current_after -= str.length;
                                            if (!current_after) current_after = -1;
                                            after[k] = current_after;
                                        } else {
                                            finished[k + 1] = 1;
                                            continue;
                                        }
                                    }

                                    if (final_length + str.length + 1 <= boundary) {
                                        str = " " + str;
                                        final[k] += str;
                                    } else if (clip) {
                                        const diff = boundary - final_length - 1;
                                        if (0 < diff) {
                                            str = " " + str.substring(0, diff);
                                            final[k] += str;
                                        }
                                        finished[k + 1] = 1;
                                    } else {
                                        finished[k + 1] = 1;
                                        continue;
                                    }
                                } else {
                                    if (finished[k]) continue;
                                    pos -= shift_left;

                                    if (check[pos]) {
                                        final_length -= ellipsis_length;
                                        finished[k] = 1;
                                        seamless[k] = 1;
                                        continue;
                                    }

                                    if (0 >= pos) {
                                        if (0 > pos) {
                                            finished[k] = 1;
                                            seamless[k] = 1;
                                            continue;
                                        }
                                        final_length -= ellipsis_length;
                                    }

                                    str = str_arr[pos].text;

                                    let current_before = boundary_before && before[k];
                                    if (current_before) {
                                        if (0 < current_before) {
                                            if (str.length > current_before) {
                                                finished[k] = 1;
                                                if (clip) {
                                                    str = str.substring(str.length - current_before);
                                                } else {
                                                    continue;
                                                }
                                            }
                                            current_before -= str.length;
                                            if (!current_before) current_before = -1;
                                            before[k] = current_before;
                                        } else {
                                            finished[k] = 1;
                                            continue;
                                        }
                                    }

                                    if (final_length + str.length + 1 <= boundary) {
                                        str += " ";
                                        final[k] = str + final[k];
                                    } else if (clip) {
                                        const diff = str.length + 1 - (boundary - final_length);
                                        if (0 <= diff && diff < str.length) {
                                            str = str.substring(diff) + " ";
                                            final[k] = str + final[k];
                                        }
                                        finished[k] = 1;
                                    } else {
                                        finished[k] = 1;
                                        continue;
                                    }
                                }
                            }

                            final_length += str.length;
                            check[pos] = 1;
                            loop = 1;
                        }

                        if (loop) {

                            shift_left == shift_right ? shift_right++ : shift_left++;
                        } else {

                            shift_left == shift_right ? loop_left = 0 : loop_right = 0;

                            if (!loop_left && !loop_right) {
                                break;
                            }

                            if (loop_left) {
                                shift_left++;
                                shift_right = shift_left;
                            } else {
                                shift_right++;
                            }
                        }
                    }

                    str = "";
                    for (let k = 0, tmp; k < final.length; k++) {
                        tmp = (k && seamless[k] ? " " : (k && !ellipsis ? " " : "") + ellipsis) + final[k];
                        str += tmp;
                    }
                    if (ellipsis && !seamless[final.length]) {
                        str += ellipsis;
                    }
                }
            }

            if (merge) {
                str = str.replace( /** @type {RegExp} */merge, " ");
            }

            res[j].highlight = str;
        }

        if (pluck) {
            break;
        }
    }

    return result;
}