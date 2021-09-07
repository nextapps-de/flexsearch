'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function parse_option(value, default_value){
  return typeof value !== 'undefined' ? value : default_value;
}

/**
 * @param {!number} count
 * @returns {Array<Object>}
 */

function create_object_array(count){
  const array = new Array(count);

  for(let i = 0; i < count; i++){
    array[i] = create_object();
  }

  return array;
}

/**
 * @param {!Object} obj
 * @returns {Array<string>}
 */

function get_keys(obj){
  return Object.keys(obj);
}

function create_object(){
  return Object.create(null);
}

function concat(arrays){
  return [].concat.apply([], arrays);
}

function sort_by_length_down(a, b){
  return b.length - a.length;
}

function is_array(val){
  return val.constructor === Array;
}

function is_string(val){
  return typeof val === 'string';
}

function is_object(val){
  return typeof val === 'object';
}

function is_function(val){
  return typeof val === 'function';
}

/**
 * @param {!string} str
 * @param {boolean|Array<string|RegExp>=} normalize
 * @param {boolean|string|RegExp=} split
 * @param {boolean=} _collapse
 * @returns {string|Array<string>}
 * @this IndexInterface
 */

function pipeline(str, normalize, split, _collapse){
  if(str){
    if(normalize){
      str = replace(str, /** @type {Array<string|RegExp>} */ (normalize));
    }

    if(this.matcher){
      str = replace(str, this.matcher);
    }

    if(this.stemmer && (str.length > 1)){
      str = replace(str, this.stemmer);
    }

    if(_collapse && (str.length > 1)){
      str = collapse(str);
    }

    if(split || (split === '')){
      const words = str.split(/** @type {string|RegExp} */ (split));

      return this.filter ? filter(words, this.filter) : words;
    }
  }

  return str;
}

const regex_whitespace = /[\p{Z}\p{S}\p{P}\p{C}]+/u;

/**
 * @param {!string} str
 * @param {boolean|Array<string|RegExp>=} normalize
 * @param {boolean|string|RegExp=} split
 * @param {boolean=} _collapse
 * @returns {string|Array<string>}
 */

// FlexSearch.prototype.pipeline = function(str, normalize, split, _collapse){
//
//     if(str){
//
//         if(normalize && str){
//
//             str = replace(str, /** @type {Array<string|RegExp>} */ (normalize));
//         }
//
//         if(str && this.matcher){
//
//             str = replace(str, this.matcher);
//         }
//
//         if(this.stemmer && str.length > 1){
//
//             str = replace(str, this.stemmer);
//         }
//
//         if(_collapse && str.length > 1){
//
//             str = collapse(str);
//         }
//
//         if(str){
//
//             if(split || (split === "")){
//
//                 const words = str.split(/** @type {string|RegExp} */ (split));
//
//                 return this.filter ? filter(words, this.filter) : words;
//             }
//         }
//     }
//
//     return str;
// };

// export function pipeline(str, normalize, matcher, stemmer, split, _filter, _collapse){
//
//     if(str){
//
//         if(normalize && str){
//
//             str = replace(str, normalize);
//         }
//
//         if(matcher && str){
//
//             str = replace(str, matcher);
//         }
//
//         if(stemmer && str.length > 1){
//
//             str = replace(str, stemmer);
//         }
//
//         if(_collapse && str.length > 1){
//
//             str = collapse(str);
//         }
//
//         if(str){
//
//             if(split !== false){
//
//                 str = str.split(split);
//
//                 if(_filter){
//
//                     str = filter(str, _filter);
//                 }
//             }
//         }
//     }
//
//     return str;
// }


/**
 * @param {Array<string>} words
 * @returns {Object<string, string>}
 */

function init_filter(words){
  const filter = create_object();

  for(let i = 0, length = words.length; i < length; i++){
    filter[words[i]] = 1;
  }

  return filter;
}

/**
 * @param {!Object<string, string>} obj
 * @param {boolean} is_stemmer
 * @returns {Array}
 */

function init_stemmer_or_matcher(obj, is_stemmer){
  const keys = get_keys(obj);
  const length = keys.length;
  const final = [];

  let removal = '', count = 0;

  for(let i = 0, key, tmp; i < length; i++){
    key = keys[i];
    tmp = obj[key];

    if(tmp){
      final[count++] = regex(is_stemmer ? '(?!\\b)' + key + '(\\b|_)' : key);
      final[count++] = tmp;
    }
    else {
      removal += (removal ? '|' : '') + key;
    }
  }

  if(removal){
    final[count++] = regex(is_stemmer ? '(?!\\b)(' + removal + ')(\\b|_)' : '(' + removal + ')');
    final[count] = '';
  }

  return final;
}


/**
 * @param {!string} str
 * @param {Array} regexp
 * @returns {string}
 */

function replace(str, regexp){
  for(let i = 0, len = regexp.length; i < len; i += 2){
    str = str.replace(regexp[i], regexp[i + 1]);

    if(!str){
      break;
    }
  }

  return str;
}

/**
 * @param {!string} str
 * @returns {RegExp}
 */

function regex(str){
  return new RegExp(str, 'g');
}

/**
 * Regex: replace(/(?:(\w)(?:\1)*)/g, "$1")
 * @param {!string} string
 * @returns {string}
 */

function collapse(string){
  let final = '', prev = '';

  for(let i = 0, len = string.length, char; i < len; i++){
    if((char = string[i]) !== prev){
      final += (prev = char);
    }
  }

  return final;
}

// TODO using fast-swap
function filter(words, map){
  const length = words.length;
  const filtered = [];

  for(let i = 0, count = 0; i < length; i++){
    const word = words[i];

    if(word && !map[word]){
      filtered[count++] = word;
    }
  }

  return filtered;
}

// const chars = {a:1, e:1, i:1, o:1, u:1, y:1};
//
// function collapse_repeating_chars(string){
//
//     let collapsed_string = "",
//         char_prev = "",
//         char_next = "";
//
//     for(let i = 0; i < string.length; i++){
//
//         const char = string[i];
//
//         if(char !== char_prev){
//
//             if(i && (char === "h")){
//
//                 if((chars[char_prev] && chars[char_next]) || (char_prev === " ")){
//
//                     collapsed_string += char;
//                 }
//             }
//             else{
//
//                 collapsed_string += char;
//             }
//         }
//
//         char_next = (
//
//             (i === (string.length - 1)) ?
//
//                 ""
//             :
//                 string[i + 1]
//         );
//
//         char_prev = char;
//     }
//
//     return collapsed_string;
// }

/**
 * @this IndexInterface
 */

function encode(str){
  return pipeline.call(

    this,
    /* string: */ ('' + str).toLowerCase(),
    /* normalize: */ false,
    /* split: */ regex_whitespace,
    /* collapse: */ false
  );
}

//import { promise as Promise } from "./polyfill.js";

function apply_async(prototype){
  register(prototype, 'add');
  register(prototype, 'append');
  register(prototype, 'search');
  register(prototype, 'update');
  register(prototype, 'remove');
}

function register(prototype, key){
  prototype[key + 'Async'] = function(){
    /** @type {IndexInterface|DocumentInterface} */
    const self = this;
    const args = /*[].slice.call*/(arguments);
    const arg = args[args.length - 1];
    let callback;

    if(is_function(arg)){
      callback = arg;
      delete args[args.length - 1];
    }

    const promise = new Promise(function(resolve){
      setTimeout(function(){
        self.async = true;
        const res = self[key].apply(self, args);
        self.async = false;
        resolve(res);
      });
    });

    if(callback){
      promise.then(callback);
      return this;
    }
    else {
      return promise;
    }
  };
}

/**
 * Implementation based on Array.indexOf() provides better performance,
 * but it needs at least one word in the query which is less frequent.
 * Also on large indexes it does not scale well performance-wise.
 * This strategy also lacks of suggestion capabilities (matching & sorting).
 *
 * @param arrays
 * @param limit
 * @param offset
 * @param {boolean|Array=} suggest
 * @returns {Array}
 */

// export function intersect(arrays, limit, offset, suggest) {
//
//     const length = arrays.length;
//     let result = [];
//     let check;
//
//     // determine shortest array and collect results
//     // from the sparse relevance arrays
//
//     let smallest_size;
//     let smallest_arr;
//     let smallest_index;
//
//     for(let x = 0; x < length; x++){
//
//         const arr = arrays[x];
//         const len = arr.length;
//
//         let size = 0;
//
//         for(let y = 0, tmp; y < len; y++){
//
//             tmp = arr[y];
//
//             if(tmp){
//
//                 size += tmp.length;
//             }
//         }
//
//         if(!smallest_size || (size < smallest_size)){
//
//             smallest_size = size;
//             smallest_arr = arr;
//             smallest_index = x;
//         }
//     }
//
//     smallest_arr = smallest_arr.length === 1 ?
//
//         smallest_arr[0]
//     :
//         concat(smallest_arr);
//
//     if(suggest){
//
//         suggest = [smallest_arr];
//         check = create_object();
//     }
//
//     let size = 0;
//     let steps = 0;
//
//     // process terms in reversed order often results in better performance.
//     // the outer loop must be the words array, using the
//     // smallest array here disables the "fast fail" optimization.
//
//     for(let x = length - 1; x >= 0; x--){
//
//         if(x !== smallest_index){
//
//             steps++;
//
//             const word_arr = arrays[x];
//             const word_arr_len = word_arr.length;
//             const new_arr = [];
//
//             let count = 0;
//
//             for(let z = 0, id; z < smallest_arr.length; z++){
//
//                 id = smallest_arr[z];
//
//                 let found;
//
//                 // process relevance in forward order (direction is
//                 // important for adding IDs during the last round)
//
//                 for(let y = 0; y < word_arr_len; y++){
//
//                     const arr = word_arr[y];
//
//                     if(arr.length){
//
//                         found = arr.indexOf(id) !== -1;
//
//                         if(found){
//
//                             // check if in last round
//
//                             if(steps === length - 1){
//
//                                 if(offset){
//
//                                     offset--;
//                                 }
//                                 else{
//
//                                     result[size++] = id;
//
//                                     if(size === limit){
//
//                                         // fast path "end reached"
//
//                                         return result;
//                                     }
//                                 }
//
//                                 if(suggest){
//
//                                     check[id] = 1;
//                                 }
//                             }
//
//                             break;
//                         }
//                     }
//                 }
//
//                 if(found){
//
//                     new_arr[count++] = id;
//                 }
//             }
//
//             if(suggest){
//
//                 suggest[steps] = new_arr;
//             }
//             else if(!count){
//
//                 return [];
//             }
//
//             smallest_arr = new_arr;
//         }
//     }
//
//     if(suggest){
//
//         // needs to iterate in reverse direction
//
//         for(let x = suggest.length - 1, arr, len; x >= 0; x--){
//
//             arr = suggest[x];
//             len = arr && arr.length;
//
//             if(len){
//
//                 for(let y = 0, id; y < len; y++){
//
//                     id = arr[y];
//
//                     if(!check[id]){
//
//                         check[id] = 1;
//
//                         if(offset){
//
//                             offset--;
//                         }
//                         else{
//
//                             result[size++] = id;
//
//                             if(size === limit){
//
//                                 // fast path "end reached"
//
//                                 return result;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
//
//     return result;
// }

/**
 * Implementation based on Object[key] provides better suggestions
 * capabilities and has less performance scaling issues on large indexes.
 *
 * @param arrays
 * @param limit
 * @param offset
 * @param {boolean|Array=} suggest
 * @returns {Array}
 */

function intersect(arrays, limit, offset, suggest) {
  const length = arrays.length;
  let result = [];
  let check;
  let check_suggest;
  let size = 0;

  if(suggest){
    suggest = [];
  }

  // process terms in reversed order often has advantage for the fast path "end reached".
  // also a reversed order prioritize the order of words from a query.

  for(let x = length - 1; x >= 0; x--){
    const word_arr = arrays[x];
    const word_arr_len = word_arr.length;
    const check_new = create_object();

    let found = !check;

    // process relevance in forward order (direction is
    // important for adding IDs during the last round)

    for(let y = 0; y < word_arr_len; y++){
      const arr = word_arr[y];
      const arr_len = arr.length;

      if(arr_len){
        // loop through IDs

        for(let z = 0, check_idx, id; z < arr_len; z++){
          id = arr[z];

          if(check){
            if(check[id]){
              // check if in last round

              if(!x){
                if(offset){
                  offset--;
                }
                else {
                  result[size++] = id;

                  if(size === limit){
                    // fast path "end reached"

                    return result;
                  }
                }
              }

              if(x || suggest){
                check_new[id] = 1;
              }

              found = true;
            }

            if(suggest){
              check_idx = check_suggest[id];
              check_suggest[id] = check_idx ? ++check_idx : check_idx = 1;

              // do not adding IDs which are already included in the result (saves one loop)
              // the first intersection match has the check index 2, so shift by -2

              if(check_idx < length){
                const tmp = suggest[check_idx - 2] || (suggest[check_idx - 2] = []);
                tmp[tmp.length] = id;
              }
            }
          }
          else {
            // pre-fill in first round

            check_new[id] = 1;
          }
        }
      }
    }

    if(suggest){
      // re-use the first pre-filled check for suggestions

      check || (check_suggest = check_new);
    }
    else if(!found){
      return [];
    }

    check = check_new;
  }

  if(suggest){
    // needs to iterate in reverse direction

    for(let x = suggest.length - 1, arr, len; x >= 0; x--){
      arr = suggest[x];
      len = arr.length;

      for(let y = 0, id; y < len; y++){
        id = arr[y];

        if(!check[id]){
          if(offset){
            offset--;
          }
          else {
            result[size++] = id;

            if(size === limit){
              // fast path "end reached"

              return result;
            }
          }

          check[id] = 1;
        }
      }
    }
  }

  return result;
}

/**
 * @param mandatory
 * @param arrays
 * @returns {Array}
 */

function intersect_union(mandatory, arrays) {
  const check = create_object();
  const union = create_object();
  const result = [];

  for(let x = 0; x < mandatory.length; x++){
    check[mandatory[x]] = 1;
  }

  for(let x = 0, arr; x <  arrays.length; x++){
    arr = arrays[x];

    for(let y = 0, id; y < arr.length; y++){
      id = arr[y];

      if(check[id]){
        if(!union[id]){
          union[id] = 1;
          result[result.length] = id;
        }
      }
    }
  }

  return result;
}

/**
 * @param {boolean|number=} limit
 * @constructor
 */

function CacheClass(limit){
  /** @private */
  this.limit = (limit !== true) && limit;

  /** @private */
  this.cache = create_object();

  /** @private */
  this.queue = [];

  //this.clear();
}

/**
 * @param {string|Object} query
 * @param {number|Object=} limit
 * @param {Object=} options
 * @this {IndexInterface}
 * @returns {Array<number|string>}
 */

function searchCache(query, limit, options){
  if(is_object(query)){
    query = query.query;
  }

  let cache = this.cache.get(query);

  if(!cache){
    cache = this.search(query, limit, options);
    this.cache.set(query, cache);
  }

  return cache;
}

// CacheClass.prototype.clear = function(){
//
//     /** @private */
//     this.cache = create_object();
//
//     /** @private */
//     this.queue = [];
// };

CacheClass.prototype.set = function(key, value){
  if(!this.cache[key]){
    // it is just a shame that native function array.shift() performs so bad

    // const length = this.queue.length;
    //
    // this.queue[length] = key;
    //
    // if(length === this.limit){
    //
    //     delete this.cache[this.queue.shift()];
    // }

    // the same bad performance

    // this.queue.unshift(key);
    //
    // if(this.queue.length === this.limit){
    //
    //     this.queue.pop();
    // }

    // fast implementation variant

    // let length = this.queue.length;
    //
    // if(length === this.limit){
    //
    //     length--;
    //
    //     delete this.cache[this.queue[0]];
    //
    //     for(let x = 0; x < length; x++){
    //
    //         this.queue[x] = this.queue[x + 1];
    //     }
    // }
    //
    // this.queue[length] = key;

    // current fastest implementation variant
    // theoretically that should not perform better compared to the example above

    let length = this.queue.length;

    if(length === this.limit){
      delete this.cache[this.queue[length - 1]];
    }
    else {
      length++;
    }

    for(let x = length - 1; x > 0; x--){
      this.queue[x] = this.queue[x - 1];
    }

    this.queue[0] = key;
  }

  this.cache[key] = value;
};

CacheClass.prototype.get = function(key){
  const cache = this.cache[key];

  if(this.limit && cache){
    // probably the indexOf() method performs faster when matched content is on front (left-to-right)
    // using lastIndexOf() does not help, it performs almost slower

    const pos = this.queue.indexOf(key);

    // if(pos < this.queue.length - 1){
    //
    //     const tmp = this.queue[pos];
    //     this.queue[pos] = this.queue[pos + 1];
    //     this.queue[pos + 1] = tmp;
    // }

    if(pos){
      const tmp = this.queue[pos - 1];
      this.queue[pos - 1] = this.queue[pos];
      this.queue[pos] = tmp;
    }
  }

  return cache;
};

CacheClass.prototype.del = function(id){
  for(let i = 0, item, key; i < this.queue.length; i++){
    key = this.queue[i];
    item = this.cache[key];

    if(item.indexOf(id) !== -1){
      this.queue.splice(i--, 1);
      delete this.cache[key];
    }
  }
};

/**!
 * FlexSearch.js
 * Copyright 2018-2021 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */

/**
 * @constructor
 * @param {Object=} options
 * @return {Index}
 */

class Index {
  constructor(options = {}) {
    this.encode = encode;
    this.register = create_object();
    this.resolution = options.resolution || 9;
    this.tokenize = options.tokenize || 'strict';
    this.depth = options?.context?.depth;
    this.bidirectional = parse_option(options?.context?.bidirectional, true);
    this.optimize = parse_option(options.optimize, true);
    this.minlength = options.minlength || 1;
    this.boost = options.boost;

    // when not using the memory strategy the score array should not pre-allocated to its full length
    this.map = this.optimize ? create_object_array(options?.context?.resolution || 9) : create_object();
    this.resolution_ctx = options?.context?.resolution || 1;
    this.ctx = this.optimize ? create_object_array(options?.context?.resolution || 1) : create_object();
    this.rtl = options.rtl;
    this.matcher = options.matcher && init_stemmer_or_matcher(options.matcher, false);
    this.stemmer = options.stemmer && init_stemmer_or_matcher(options.stemmer, true);
    this.filter = options.filter && init_filter(options.filter);
    this.cache = options.cache && new CacheClass(options.cache);
  }
  //Index.prototype.pipeline = pipeline;
  /**
   * @param {!number|string} id
   * @param {!string} content
   */
  append(id, content) {
    return this.add(id, content, true);
  }
  /**
   * @param {!number|string} id
   * @param {!string} content
   * @param {boolean=} _append
   * @param {boolean=} _skip_update
   */
  add(id, content, _append, _skip_update) {
    if (content && (id || (id === 0))) {
      if (!_skip_update && !_append && this.register[id]) {
        return this.update(id, content);
      }

      content = this.encode(content);
      const length = content.length;

      if (length) {
        // check context dupes to skip all contextual redundancy along a document
        const dupes_ctx = create_object();
        const dupes = create_object();
        const depth = this.depth;
        const resolution = this.resolution;

        for (let i = 0; i < length; i++) {
          let term = content[this.rtl ? length - 1 - i : i];
          let term_length = term.length;

          // skip dupes will break the context chain
          if (term && (term_length >= this.minlength) && (depth || !dupes[term])) {
            let score = get_score(resolution, length, i);
            let token = '';

            switch (this.tokenize) {
            case 'full':

              if (term_length > 3) {
                for (let x = 0; x < term_length; x++) {
                  for (let y = term_length; y > x; y--) {
                    if ((y - x) >= this.minlength) {
                      const partial_score = get_score(resolution, length, i, term_length, x);
                      token = term.substring(x, y);
                      this.push_index(dupes, token, partial_score, id, _append);
                    }
                  }
                }

                break;
              }

              // fallthrough to next case when term length < 4
            case 'reverse':

              // skip last round (this token exist already in "forward")
              if (term_length > 2) {
                for (let x = term_length - 1; x > 0; x--) {
                  token = term[x] + token;

                  if (token.length >= this.minlength) {
                    const partial_score = get_score(resolution, length, i, term_length, x);
                    this.push_index(dupes, token, partial_score, id, _append);
                  }
                }

                token = '';
              }

              // fallthrough to next case to apply forward also
            case 'forward':

              if (term_length > 1) {
                for (let x = 0; x < term_length; x++) {
                  token += term[x];

                  if (token.length >= this.minlength) {
                    this.push_index(dupes, token, score, id, _append);
                  }
                }

                break;
              }

              // fallthrough to next case when token has a length of 1
            default:
              // case "strict":
              if (this.boost) {
                score = Math.min((score / this.boost(content, term, i)) | 0, resolution - 1);
              }

              this.push_index(dupes, term, score, id, _append);

              // context is just supported by tokenizer "strict"
              if (depth) {
                if ((length > 1) && (i < (length - 1))) {
                  // check inner dupes to skip repeating words in the current context
                  const dupes_inner = create_object();
                  const resolution = this.resolution_ctx;
                  const keyword = term;
                  const size = Math.min(depth + 1, length - i);

                  dupes_inner[keyword] = 1;

                  for (let x = 1; x < size; x++) {
                    term = content[this.rtl ? length - 1 - i - x : i + x];

                    if (term && (term.length >= this.minlength) && !dupes_inner[term]) {
                      dupes_inner[term] = 1;

                      const context_score = get_score(resolution + ((length / 2) > resolution ? 0 : 1), length, i, size - 1, x - 1);
                      const swap = this.bidirectional && (term > keyword);
                      this.push_index(dupes_ctx, swap ? keyword : term, context_score, id, _append, swap ? term : keyword);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return this;
  }
  /**
   * @private
   * @param dupes
   * @param value
   * @param score
   * @param id
   * @param {boolean=} append
   * @param {string=} keyword
   */
  push_index(dupes, value, score, id, append, keyword) {
    let arr = keyword ? this.ctx : this.map;

    if (!dupes[value] || (keyword && !dupes[value][keyword])) {
      if (this.optimize) {
        arr = arr[score];
      }

      if (keyword) {
        dupes = dupes[value] || (dupes[value] = create_object());
        dupes[keyword] = 1;

        arr = arr[keyword] || (arr[keyword] = create_object());
      }
      else {
        dupes[value] = 1;
      }

      arr = arr[value] || (arr[value] = []);

      if (!this.optimize) {
        arr = arr[score] || (arr[score] = []);
      }

      if (!append || (arr.indexOf(id) === -1)) {
        arr[arr.length] = id;
        this.register[id] ||= [];
        this.register[id].push(arr);
      }
    }
  }
  /**
   * @param {string|Object} query
   * @param {number|Object=} limit
   * @param {Object=} options
   * @returns {Array<number|string>}
   */
  search(query, limit, options) {
    if (!options) {
      if (!limit && is_object(query)) {
        options = /** @type {Object} */ (query);
        query = options.query;
      }
      else if (is_object(limit)) {
        options = /** @type {Object} */ (limit);
      }
    }

    let result = [];
    let length;
    let context, suggest, offset = 0;

    if (options) {
      limit = options.limit;
      offset = options.offset || 0;
      context = options.context;
      suggest = options.suggest;
    }

    if (query) {
      query = /** @type {Array} */ (this.encode(query));
      length = query.length;

      // TODO: solve this in one single loop below
      if (length > 1) {
        const dupes = create_object();
        const query_new = [];

        for (let i = 0, count = 0, term; i < length; i++) {
          term = query[i];

          if (term && (term.length >= this.minlength) && !dupes[term]) {
            // this fast path just could applied when not in memory-optimized mode
            if (!this.optimize && !suggest && !this.map[term]) {
              // fast path "not found"
              return result;
            }
            else {
              query_new[count++] = term;
              dupes[term] = 1;
            }
          }
        }

        query = query_new;
        length = query.length;
      }
    }

    if (!length) {
      return result;
    }

    limit || (limit = 100);

    let depth = this.depth && (length > 1) && (context !== false);
    let index = 0, keyword;

    if (depth) {
      keyword = query[0];
      index = 1;
    }
    else {
      if (length > 1) {
        query.sort(sort_by_length_down);
      }
    }

    for (let arr, term; index < length; index++) {
      term = query[index];

      // console.log(keyword);
      // console.log(term);
      // console.log("");
      if (depth) {
        arr = this.add_result(result, suggest, limit, offset, length === 2, term, keyword);

        // console.log(arr);
        // console.log(result);
        // when suggestion enabled just forward keyword if term was found
        // as long as the result is empty forward the pointer also
        if (!suggest || (arr !== false) || !result.length) {
          keyword = term;
        }
      }
      else {
        arr = this.add_result(result, suggest, limit, offset, length === 1, term);
      }

      if (arr) {
        return /** @type {Array<number|string>} */ (arr);
      }

      // apply suggestions on last loop or fallback
      if (suggest && (index === length - 1)) {
        let length = result.length;

        if (!length) {
          if (depth) {
            // fallback to non-contextual search when no result was found
            depth = 0;
            index = -1;

            continue;
          }

          return result;
        }
        else if (length === 1) {
          // fast path optimization
          return single_result(result[0], limit, offset);
        }
      }
    }

    return intersect(result, limit, offset, suggest);
  }
  /**
   * Returns an array when the result is done (to stop the process immediately),
   * returns false when suggestions is enabled and no result was found,
   * or returns nothing when a set was pushed successfully to the results
   *
   * @private
   * @param {Array} result
   * @param {Array} suggest
   * @param {number} limit
   * @param {number} offset
   * @param {boolean} single_term
   * @param {string} term
   * @param {string=} keyword
   * @return {Array<Array<string|number>>|boolean|undefined}
   */
  add_result(result, suggest, limit, offset, single_term, term, keyword) {
    let word_arr = [];
    let arr = keyword ? this.ctx : this.map;

    if (!this.optimize) {
      arr = get_array(arr, term, keyword, this.bidirectional);
    }

    if (arr) {
      let count = 0;
      const arr_len = Math.min(arr.length, keyword ? this.resolution_ctx : this.resolution);

      // relevance:
      for (let x = 0, size = 0, tmp, len; x < arr_len; x++) {
        tmp = arr[x];

        if (tmp) {
          if (this.optimize) {
            tmp = get_array(tmp, term, keyword, this.bidirectional);
          }

          if (offset) {
            if (tmp && single_term) {
              len = tmp.length;

              if (len <= offset) {
                offset -= len;
                tmp = null;
              }
              else {
                tmp = tmp.slice(offset);
                offset = 0;
              }
            }
          }

          if (tmp) {
            // keep score (sparse array):
            //word_arr[x] = tmp;
            // simplified score order:
            word_arr[count++] = tmp;

            if (single_term) {
              size += tmp.length;

              if (size >= limit) {
                // fast path optimization
                break;
              }
            }
          }
        }
      }

      if (count) {
        if (single_term) {
          // fast path optimization
          // offset was already applied at this point
          return single_result(word_arr, limit, 0);
        }

        result[result.length] = word_arr;
        return;
      }
    }

    // return an empty array will stop the loop,
    // to prevent stop when using suggestions return a false value
    return !suggest && word_arr;
  }
  contain(id) {
    return !!this.register[id];
  }
  update(id, content) {
    return this.remove(id).add(id, content);
  }
  /**
   * @param {boolean=} _skip_deletion
   */
  remove(id, _skip_deletion) {
    const refs = this.register[id];

    if (refs) {
      remove_index(this.map, id, this.resolution, this.optimize);

      if (this.depth) {
        remove_index(this.ctx, id, this.resolution_ctx, this.optimize);
      }

      _skip_deletion || delete this.register[id];

      if (this.cache) {
        this.cache.del(id);
      }
    }

    return this;
  }

  /**
   * Convert `this` into an exportable object
   */
  serialize() {
    return {
      reg: this.register,
      opt: this.optimize,
      map: this.map,
      ctx: this.ctx,
      tok: this.tokenize
    };
  }

  /**
   * Given a string load an Index object from it
   * @param {string} str the serialized Index object
   */
  static deserialize(obj, params) {
    // TODO add extra parameter for index initialization?
    const result = new Index(params);
    result.optimize = obj.opt;
    result.register = obj.reg;
    result.map      = obj.map;
    result.ctx      = obj.ctx;
    result.tokenize = obj.tok;
    return result;
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




function single_result(result, limit, offset){
  if(result.length === 1){
    result = result[0];
  }
  else {
    result = concat(result);
  }

  return offset || (result.length > limit) ?

    result.slice(offset, offset + limit)
    :
    result;
}

function get_array(arr, term, keyword, bidirectional){
  if(keyword){
    // the frequency of the starting letter is slightly less
    // on the last half of the alphabet (m-z) in almost every latin language,
    // so we sort downwards (https://en.wikipedia.org/wiki/Letter_frequency)

    const swap = bidirectional && (term > keyword);

    arr = arr[swap ? term : keyword];
    arr = arr && arr[swap ? keyword : term];
  }
  else {
    arr = arr[term];
  }

  return arr;
}




/**
 * @param map
 * @param id
 * @param res
 * @param optimize
 * @param {number=} resolution
 * @return {number}
 */

function remove_index(map, id, res, optimize, resolution){
  let count = 0;

  if(is_array(map)){
    // the first array is the score array in both strategies

    if(!resolution){
      resolution = Math.min(map.length, res);

      for(let x = 0, arr; x < resolution; x++){
        arr = map[x];

        if(arr){
          count = remove_index(arr, id, res, optimize, resolution);

          if(!optimize && !count){
            // when not memory optimized the score index should removed

            delete map[x];
          }
        }
      }
    }
    else {
      const pos = map.indexOf(id);

      if(pos !== -1){
        // fast path, when length is 1 or lower then the whole field gets deleted

        if(map.length > 1){
          map.splice(pos, 1);
          count++;
        }
      }
      else {
        count++;
      }
    }
  }
  else {
    for(let key in map){
      count = remove_index(map[key], id, res, optimize, resolution);

      if(!count){
        delete map[key];
      }
    }
  }

  return count;
}

// TODO bring all these functions into this file
Index.prototype.searchCache = searchCache;
apply_async(Index.prototype);

/**!
 * FlexSearch.js
 * Copyright 2018-2021 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */

/**
 * @constructor
 * @implements DocumentInterface
 * @param {Object=} options
 * @return {Document}
 */

class Document {
  constructor(options) {
    const document = options.document || options.doc || options;
    let opt;

    this.tree = [];
    this.field = [];
    this.marker = [];
    this.register = create_object();
    this.key = ((opt = document.key || document.id) && parse_tree(opt, this.marker)) || 'id';

    this.storetree = (opt = document.store) && (opt !== true) && [];
    this.store = opt && create_object();

    this.tag = ((opt = document.tag) && parse_tree(opt, this.marker));
    this.tagindex = opt && create_object();

    this.cache = (opt = options.cache) && new CacheClass(opt);

    // do not apply cache again for the indexes
    options.cache = false;

    this.worker = options.worker;

    // this switch is used by recall of promise callbacks
    this.async = false;

    this.index = this.parse_descriptor(options, document);
  }

  /**
   *
   * @param id
   * @param content
   * @param {boolean=} _append
   * @returns {Document|Promise}
   */
  add(id, content, _append) {
    if (is_object(id)) {
      content = id;
      id = parse_simple(content, this.key);
    }

    if (content && (id || (id === 0))) {
      if (!_append && this.register[id]) {
        return this.update(id, content);
      }

      for (let i = 0, tree, field; i < this.field.length; i++) {
        field = this.field[i];
        tree = this.tree[i];

        if (is_string(tree)) {
          tree = [tree];
        }

        add_index(content, tree, this.marker, 0, this.index[field], id, tree[0], _append);
      }

      if (this.tag) {
        let tag = parse_simple(content, this.tag);
        let dupes = create_object();

        if (is_string(tag)) {
          tag = [tag];
        }

        for (let i = 0, key, arr; i < tag.length; i++) {
          key = tag[i];

          if (!dupes[key]) {
            dupes[key] = 1;
            arr = this.tagindex[key] || (this.tagindex[key] = []);

            if (!_append || (arr.indexOf(id) === -1)) {
              arr[arr.length] = id;
            }
          }
        }
      }

      // TODO: how to handle store when appending contents?
      if (this.store && (!_append || !this.store[id])) {
        let store;

        if (this.storetree) {
          store = create_object();

          for (let i = 0, tree; i < this.storetree.length; i++) {
            tree = this.storetree[i];

            if (is_string(tree)) {
              store[tree] = content[tree];
            }
            else {
              store_value(content, store, tree, 0, tree[0]);
            }
          }
        }

        this.store[id] = store || content;
      }
    }

    return this;
  }
  append(id, content) {
    return this.add(id, content, true);
  }
  update(id, content) {
    return this.remove(id).add(id, content);
  }
  remove(id) {
    if (is_object(id)) {
      id = parse_simple(id, this.key);
    }

    if (this.register[id]) {
      for (let i = 0; i < this.field.length; i++) {
        // workers does not share the register
        this.index[this.field[i]].remove(id, !this.worker);
      }

      if (this.tag) {
        for (let key in this.tagindex) {
          const tag = this.tagindex[key];
          const pos = tag.indexOf(id);

          if (pos !== -1) {
            if (tag.length > 1) {
              tag.splice(pos, 1);
            }
            else {
              delete this.tagindex[key];
            }
          }
        }
      }

      if (this.store) {
        delete this.store[id];
      }

      delete this.register[id];
    }

    return this;
  }
  /**
   * @param {!string|Object} query
   * @param {number|Object=} limit
   * @param {Object=} options
   * @param {Array<Array>=} _resolve For internal use only.
   * @returns {Promise|Array}
   */
  search(query, limit, options, _resolve) {
    if (!options) {
      if (!limit && is_object(query)) {
        options = /** @type {Object} */ (query);
        query = options.query;
      }
      else if (is_object(limit)) {
        options = /** @type {Object} */ (limit);
        limit = 0;
      }
    }

    let result = [], result_field = [];
    let pluck, enrich;
    let field, tag, bool, offset, count = 0;

    if (options) {
      if (is_array(options)) {
        field = options;
        options = null;
      }
      else {
        pluck = options.pluck;
        field = pluck || options.index || options.field /*|| (is_string(options) && [options])*/;
        tag = options.tag;
        enrich = this.store && options.enrich;
        bool = options.bool === 'and';
        limit = options.limit || 100;
        offset = options.offset || 0;

        if (tag) {
          if (is_string(tag)) {
            tag = [tag];
          }

          // when tags is used and no query was set,
          // then just return the tag indexes
          if (!query) {
            for (let i = 0, res; i < tag.length; i++) {
              res = get_tag.call(this, tag[i], limit, offset, enrich);

              if (res) {
                result[result.length] = res;
                count++;
              }
            }

            return count ? result : [];
          }
        }

        if (is_string(field)) {
          field = [field];
        }
      }
    }

    field || (field = this.field);
    bool = bool && ((field.length > 1) || (tag && (tag.length > 1)));

    const promises = !_resolve && (this.worker || this.async) && [];

    // TODO solve this in one loop below
    for (let i = 0, res, key, len; i < field.length; i++) {
      let opt;

      key = field[i];

      if (!is_string(key)) {
        opt = key;
        key = key.field;
      }

      if (promises) {
        promises[i] = this.index[key].searchAsync(query, limit, opt || options);

        // just collect and continue
        continue;
      }
      else if (_resolve) {
        res = _resolve[i];
      }
      else {
        // inherit options also when search? it is just for laziness, Object.assign() has a cost
        res = this.index[key].search(query, limit, opt || options);
      }

      len = res && res.length;

      if (tag && len) {
        const arr = [];
        let count = 0;

        if (bool) {
          // prepare for intersection
          arr[0] = [res];
        }

        for (let y = 0, key, res; y < tag.length; y++) {
          key = tag[y];
          res = this.tagindex[key];
          len = res && res.length;

          if (len) {
            count++;
            arr[arr.length] = bool ? [res] : res;
          }
        }

        if (count) {
          if (bool) {
            res = intersect(arr, limit || 100, offset || 0);
          }
          else {
            res = intersect_union(res, arr);
          }

          len = res.length;
        }
      }

      if (len) {
        result_field[count] = key;
        result[count++] = res;
      }
      else if (bool) {
        return [];
      }
    }

    if (promises) {
      const self = this;

      // anyone knows a better workaround of optionally having async promises?
      // the promise.all() needs to be wrapped into additional promise,
      // otherwise the recursive callback wouldn't run before return
      return new Promise(function (resolve) {
        Promise.all(promises).then(function (result) {
          resolve(self.search(query, limit, options, result));
        });
      });
    }

    if (!count) {
      // fast path "not found"
      return [];
    }

    if (pluck && (!enrich || !this.store)) {
      // fast path optimization
      return result[0];
    }

    for (let i = 0, res; i < result_field.length; i++) {
      res = result[i];

      if (res.length) {
        if (enrich) {
          res = apply_enrich.call(this, res);
        }
      }

      if (pluck) {
        return res;
      }

      result[i] = {
        'field': result_field[i],
        'result': res
      };
    }

    return result;
  }
  contain(id) {
    return !!this.register[id];
  }
  get(id) {
    return this.store[id];
  }
  set(id, data) {
    this.store[id] = data;
    return this;
  }

  /**
   * Serialize `this` into an exportable object
   */
  serialize() {
    const result = {
      tag:   this.tagIndex,
      reg:   this.register,
      store: this.store,
      field: this.field,
      index: {}
    };
    Object.entries(this.index).forEach(([key, index]) => {
      result.index[key] = index.serialize();
    });
    return result;
  }

  /**
   * Create a `Document` from a serialized object
   */
  static deserialize(obj, params) {
    // TODO add properties here?
    const result = new Document(params);
    result.tagIndex = obj.tag;
    result.register = obj.reg;
    result.store    = obj.store;
    result.field    = obj.field;
    Object.entries(obj.index).forEach(([key, exportedIndex]) => {
      result.index[key] = Index.deserialize(exportedIndex);
      result.index[key].register = obj.reg;
    });
    return result;
  }

  // Helper methods

  parse_descriptor(options, document) {
    const index = create_object();
    let field = document.index || document.field || document;

    if (is_string(field)) {
      field = [field];
    }

    for (let i = 0, key, opt; i < field.length; i++) {
      key = field[i];

      if (!is_string(key)) {
        opt = key;
        key = key.field;
      }

      opt = is_object(opt) ? Object.assign({}, options, opt) : options;

      if (!this.worker) {
        index[key] = new Index(opt);
        index[key].register = this.register;
      }

      this.tree[i] = parse_tree(key, this.marker);
      this.field[i] = key;
    }

    if (this.storetree) {
      let store = document.store;

      if (is_string(store)) {
        store = [store];
      }

      for (let i = 0; i < store.length; i++) {
        this.storetree[i] = parse_tree(store[i], this.marker);
      }
    }

    return index;
  }
}

function parse_tree(key, marker){
  const tree = key.split(':');
  let count = 0;

  for(let i = 0; i < tree.length; i++){
    key = tree[i];

    if(key.indexOf('[]') >= 0){
      key = key.substring(0, key.length - 2);

      if(key){
        marker[count] = true;
      }
    }

    if(key){
      tree[count++] = key;
    }
  }

  if(count < tree.length){
    tree.length = count;
  }

  return count > 1 ? tree : tree[0];
}

function parse_simple(obj, tree){
  if(is_string(tree)){
    obj = obj[tree];
  }
  else {
    for(let i = 0; obj && (i < tree.length); i++){
      obj = obj[tree[i]];
    }
  }

  return obj;
}

function store_value(obj, store, tree, pos, key){
  obj = obj[key];

  // reached target field

  if(pos === (tree.length - 1)){
    // store target value

    store[key] = obj;
  }
  else if(obj){
    if(is_array(obj)){
      store = store[key] = new Array(obj.length);

      for(let i = 0; i < obj.length; i++){
        // do not increase pos (an array is not a field)
        store_value(obj, store, tree, pos, i);
      }
    }
    else {
      store = store[key] || (store[key] = create_object());
      key = tree[++pos];

      store_value(obj, store, tree, pos, key);
    }
  }
}

function add_index(obj, tree, marker, pos, index, id, key, _append){
  obj = obj[key];

  if(obj){
    // reached target field

    if(pos === (tree.length - 1)){
      // handle target value

      if(is_array(obj)){
        // append array contents so each entry gets a new scoring context

        if(marker[pos]){
          for(let i = 0; i < obj.length; i++){
            index.add(id, obj[i], /* append: */ true, /* skip update: */ true);
          }

          return;
        }

        // or join array contents and use one scoring context

        obj = obj.join(' ');
      }

      index.add(id, obj, _append, /* skip_update: */ true);
    }
    else {
      if(is_array(obj)){
        for(let i = 0; i < obj.length; i++){
          // do not increase index, an array is not a field

          add_index(obj, tree, marker, pos, index, id, i, _append);
        }
      }
      else {
        key = tree[++pos];

        add_index(obj, tree, marker, pos, index, id, key, _append);
      }
    }
  }
}






/**
 * @this Document
 */

function get_tag(key, limit, offset, enrich){
  let res = this.tagindex[key];
  let len = res && (res.length - offset);

  if(len && (len > 0)){
    if((len > limit) || offset){
      res = res.slice(offset, offset + limit);
    }

    if(enrich){
      res = apply_enrich.call(this, res);
    }

    return {

      'tag': key,
      'result': res
    };
  }
}

/**
 * @this Document
 */

function apply_enrich(res){
  const arr = new Array(res.length);

  for(let x = 0, id; x < res.length; x++){
    id = res[x];

    arr[x] = {

      'id': id,
      'doc': this.store[id]
    };
  }

  return arr;
}

// TODO move all of this into this file
Document.prototype.searchCache = searchCache;
apply_async(Document.prototype);

exports.Document = Document;
exports.Index = Index;
//# sourceMappingURL=lib.js.map
