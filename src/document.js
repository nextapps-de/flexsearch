/**!
 * FlexSearch.js
 * Copyright 2018-2021 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */

import { Index } from './index.js';
import Cache, { searchCache } from './cache.js';
import { create_object, is_array, is_string, is_object } from './common.js';
import apply_async from './async.js';
import { intersect, intersect_union } from './intersect.js';

/**
 * @constructor
 * @implements DocumentInterface
 * @param {Object=} options
 * @return {Document}
 */

export class Document {
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

    this.cache = (opt = options.cache) && new Cache(opt);

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
  else{
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
    else{
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
    else{
      if(is_array(obj)){
        for(let i = 0; i < obj.length; i++){
          // do not increase index, an array is not a field

          add_index(obj, tree, marker, pos, index, id, i, _append);
        }
      }
      else{
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
