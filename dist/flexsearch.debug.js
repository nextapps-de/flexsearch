/**!
 * FlexSearch.js v0.7.0
 * Copyright 2019 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */
(function(){'use strict';
var RELEASE = "browser";
var DEBUG = true;
var PROFILER = false;
var SUPPORT_WORKER = true;
var SUPPORT_ENCODER = true;
var SUPPORT_CACHE = true;
var SUPPORT_ASYNC = true;
var SUPPORT_PRESET = true;
var SUPPORT_SUGGESTION = true;
var SUPPORT_SERIALIZE = true;
var SUPPORT_INFO = true;
var SUPPORT_DOCUMENT = true;
var SUPPORT_WHERE = true;
var SUPPORT_PAGINATION = true;
var SUPPORT_OPERATOR = true;
var SUPPORT_CALLBACK = true;
var USE_POLYFILL = true;
if (USE_POLYFILL) {
  Object.assign || (Object.assign = function() {
    var args = arguments;
    var size = args.length;
    var obj = args[0];
    for (var x = 1, current = undefined, keys = undefined, length = undefined; x < size; x++) {
      current = args[x];
      keys = Object.keys(current);
      length = keys.length;
      for (var i = 0, key = undefined; i < length; i++) {
        key = keys[i];
        obj[key] = current[key];
      }
    }
    return obj;
  });
  if (SUPPORT_ASYNC) {
    window["requestAnimationFrame"] || (window["requestAnimationFrame"] = window.setTimeout);
    window["cancelAnimationFrame"] || (window["cancelAnimationFrame"] = window.clearTimeout);
    window["Promise"] || (window["Promise"] = function() {
      function Promise(fn) {
        this.callback = null;
        var self = this;
        fn(function(val) {
          if (self.callback) {
            self.callback(val);
            self.callback = null;
          }
        });
      }
      Promise.prototype.then = function(callback) {
        this.callback = callback;
      };
      return Promise;
    }());
  }
}
;function is_string$$module$src$common(val) {
  return typeof val === "string";
}
function is_array$$module$src$common(val) {
  return val.constructor === Array;
}
function is_function$$module$src$common(val) {
  return typeof val === "function";
}
function is_object$$module$src$common(val) {
  return typeof val === "object";
}
function is_undefined$$module$src$common(val) {
  return typeof val === "undefined";
}
function get_keys$$module$src$common(obj) {
  return Object.keys(obj);
}
function create_object_array$$module$src$common(count) {
  var array = new Array(count);
  for (var i = 0; i < count; i++) {
    array[i] = create_object$$module$src$common();
  }
  return array;
}
function create_object$$module$src$common() {
  return Object.create(null);
}
function replace$$module$src$common(str, regexp) {
  for (var i = 0, len = regexp.length; i < len; i += 2) {
    str = str.replace(regexp[i], regexp[i + 1]);
  }
  return str;
}
function regex$$module$src$common(str) {
  return new RegExp(str, "g");
}
function collapse$$module$src$common(string) {
  var final = "";
  var prev = "";
  for (var i = 0, len = string.length, char = undefined; i < len; i++) {
    if ((char = string[i]) !== prev) {
      final += prev = char;
    }
  }
  return final;
}
var module$src$common = {};
module$src$common.collapse = collapse$$module$src$common;
module$src$common.create_object = create_object$$module$src$common;
module$src$common.create_object_array = create_object_array$$module$src$common;
module$src$common.get_keys = get_keys$$module$src$common;
module$src$common.is_array = is_array$$module$src$common;
module$src$common.is_function = is_function$$module$src$common;
module$src$common.is_object = is_object$$module$src$common;
module$src$common.is_string = is_string$$module$src$common;
module$src$common.is_undefined = is_undefined$$module$src$common;
module$src$common.regex = regex$$module$src$common;
module$src$common.replace = replace$$module$src$common;
if (SUPPORT_SERIALIZE) {
  FlexSearch$$module$src$flexsearch.prototype.export = function(config) {
    var serialize = !config || is_undefined$$module$src$common(config["serialize"]) || config["serialize"];
    var payload;
    if (SUPPORT_DOCUMENT && this.doc) {
      var export_doc = !config || is_undefined$$module$src$common(config["doc"]) || config["doc"];
      var export_index = !config || is_undefined$$module$src$common(config["index"]) || config["index"];
      payload = [];
      var i = 0;
      if (export_index) {
        var keys = this.doc.keys;
        for (; i < keys.length; i++) {
          var idx = this.doc.index[keys[i]];
          payload[i] = [idx._map, idx._ctx, get_keys$$module$src$common(idx._ids)];
        }
      }
      if (export_doc) {
        payload[i] = this._doc;
      }
    } else {
      payload = [this._map, this._ctx, get_keys$$module$src$common(this._ids)];
    }
    if (serialize) {
      payload = JSON.stringify(payload);
    }
    return payload;
  };
  FlexSearch$$module$src$flexsearch.prototype.import = function(payload, config) {
    var serialize = !config || is_undefined$$module$src$common(config["serialize"]) || config["serialize"];
    if (serialize) {
      payload = JSON.parse(payload);
    }
    var ids = {};
    if (SUPPORT_DOCUMENT && this.doc) {
      var import_doc = !config || is_undefined$$module$src$common(config["doc"]) || config["doc"];
      var import_index = !config || is_undefined$$module$src$common(config["index"]) || config["index"];
      var i = 0;
      if (import_index) {
        var keys = this.doc.keys;
        var length = keys.length;
        var current = payload[0][2];
        for (; i < current.length; i++) {
          ids[current[i]] = 1;
        }
        for (i = 0; i < length; i++) {
          var idx = this.doc.index[keys[i]];
          var item = payload[i];
          if (item) {
            idx._map = item[0];
            idx._ctx = item[1];
            idx._ids = ids;
          }
        }
      }
      if (import_doc) {
        this._doc = is_object$$module$src$common(import_doc) ? import_doc : payload[i];
      }
    } else {
      var current$0 = payload[2];
      for (var i$1 = 0; i$1 < current$0.length; i$1++) {
        ids[current$0[i$1]] = 1;
      }
      this._map = payload[0];
      this._ctx = payload[1];
      this._ids = ids;
    }
  };
}
var module$src$serialize = {};
if (SUPPORT_DOCUMENT && SUPPORT_WHERE) {
  FlexSearch$$module$src$flexsearch.prototype.find = function(key, value) {
    return this.where(key, value, 1)[0] || null;
  };
  FlexSearch$$module$src$flexsearch.prototype.where = function(key, value, limit, result) {
    var doc = this._doc;
    var results = [];
    var count = 0;
    var keys;
    var keys_len;
    var has_value;
    var tree;
    var tag_results;
    if (is_object$$module$src$common(key)) {
      limit || (limit = value);
      keys = get_keys$$module$src$common(key);
      keys_len = keys.length;
      has_value = false;
      if (keys_len === 1 && keys[0] === "id") {
        return [doc[key["id"]]];
      }
      var tags = this._tags;
      if (tags && !result) {
        for (var i = 0; i < tags.length; i++) {
          var current_tag = tags[i];
          var current_where = key[current_tag];
          if (!is_undefined$$module$src$common(current_where)) {
            tag_results = this._tag[current_tag]["@" + current_where];
            if (--keys_len === 0) {
              return tag_results;
            }
            keys.splice(keys.indexOf(current_tag), 1);
            delete key[current_tag];
            break;
          }
        }
      }
      tree = new Array(keys_len);
      for (var i$2 = 0; i$2 < keys_len; i$2++) {
        tree[i$2] = keys[i$2].split(":");
      }
    } else {
      if (is_function$$module$src$common(key)) {
        var ids$3 = result || get_keys$$module$src$common(doc);
        var length$4 = ids$3.length;
        for (var x = 0; x < length$4; x++) {
          var obj = doc[ids$3[x]];
          if (key(obj)) {
            results[count++] = obj;
          }
        }
        return results;
      } else {
        if (is_undefined$$module$src$common(value)) {
          return [doc[key]];
        }
        if (key === "id") {
          return [doc[value]];
        }
        keys = [key];
        keys_len = 1;
        tree = [key.split(":")];
        has_value = true;
      }
    }
    var ids = tag_results || result || get_keys$$module$src$common(doc);
    var length = ids.length;
    for (var x$5 = 0; x$5 < length; x$5++) {
      var obj$6 = tag_results ? ids[x$5] : doc[ids[x$5]];
      var found = true;
      for (var i$7 = 0; i$7 < keys_len; i$7++) {
        has_value || (value = key[keys[i$7]]);
        var tree_cur = tree[i$7];
        var tree_len = tree_cur.length;
        var ref = obj$6;
        if (tree_len > 1) {
          for (var z = 0; z < tree_len; z++) {
            ref = ref[tree_cur[z]];
          }
        } else {
          ref = ref[tree_cur[0]];
        }
        if (ref !== value) {
          found = false;
          break;
        }
      }
      if (found) {
        results[count++] = obj$6;
        if (limit && count === limit) {
          break;
        }
      }
    }
    return results;
  };
}
var module$src$where = {};
function CacheClass$$module$src$cache(limit) {
  this.clear();
  this.limit = limit !== true && limit;
}
CacheClass$$module$src$cache.prototype.clear = function() {
  this.cache = create_object$$module$src$common();
  this.count = create_object$$module$src$common();
  this.index = create_object$$module$src$common();
  this.ids = [];
};
CacheClass$$module$src$cache.prototype.set = function(key, value) {
  if (this.limit && is_undefined$$module$src$common(this.cache[key])) {
    var length = this.ids.length;
    if (length === this.limit) {
      length--;
      var last_id = this.ids[length];
      delete this.cache[last_id];
      delete this.count[last_id];
      delete this.index[last_id];
    }
    this.ids[length] = key;
    this.index[key] = length;
    this.count[key] = -1;
    this.cache[key] = value;
    this.get(key);
  } else {
    this.cache[key] = value;
  }
};
CacheClass$$module$src$cache.prototype.get = function(key) {
  var cache = this.cache[key];
  if (this.limit && cache) {
    var count = ++this.count[key];
    var index = this.index;
    var current_index = index[key];
    if (current_index > 0) {
      var ids = this.ids;
      var old_index = current_index;
      while (this.count[ids[--current_index]] <= count) {
        if (current_index === -1) {
          break;
        }
      }
      current_index++;
      if (current_index !== old_index) {
        for (var i = old_index; i > current_index; i--) {
          var tmp = ids[i - 1];
          ids[i] = tmp;
          index[tmp] = i;
        }
        ids[current_index] = key;
        index[key] = current_index;
      }
    }
  }
  return cache;
};
var module$src$cache = {};
module$src$cache.default = CacheClass$$module$src$cache;
var worker_stack$$module$src$worker = {};
var inline_supported$$module$src$worker = typeof Blob !== "undefined" && typeof URL !== "undefined" && URL.createObjectURL;
function init$$module$src$worker(_name, _id, _worker, _callback, _core) {
  var name = _name;
  var worker_payload = inline_supported$$module$src$worker ? URL.createObjectURL(new Blob([(RELEASE ? "" : "var RELEASE = '" + RELEASE + "';" + "var DEBUG = " + (DEBUG ? "true" : "false") + ";" + "var PROFILER = " + (PROFILER ? "true" : "false") + ";" + "var SUPPORT_PRESET = " + (SUPPORT_PRESET ? "true" : "false") + ";" + "var SUPPORT_SUGGESTION = " + (SUPPORT_SUGGESTION ? "true" : "false") + ";" + "var SUPPORT_ENCODER = " + (SUPPORT_ENCODER ? "true" : "false") + ";" + "var SUPPORT_CACHE = " + (SUPPORT_CACHE ? 
  "true" : "false") + ";" + "var SUPPORT_ASYNC = " + (SUPPORT_ASYNC ? "true" : "false") + ";" + "var SUPPORT_SERIALIZE = " + (SUPPORT_SERIALIZE ? "true" : "false") + ";" + "var SUPPORT_INFO = " + (SUPPORT_INFO ? "true" : "false") + ";" + "var SUPPORT_DOCUMENT = " + (SUPPORT_DOCUMENT ? "true" : "false") + ";" + "var SUPPORT_WHERE = " + (SUPPORT_WHERE ? "true" : "false") + ";" + "var SUPPORT_PAGINATION = " + (SUPPORT_PAGINATION ? "true" : "false") + ";" + "var SUPPORT_OPERATOR = " + (SUPPORT_OPERATOR ? 
  "true" : "false") + ";" + "var SUPPORT_CALLBACK = " + (SUPPORT_CALLBACK ? "true" : "false") + ";" + "var SUPPORT_WORKER = true;") + "(" + _worker.toString() + ")()"], {"type":"text/javascript"})) : name + (RELEASE ? "." + RELEASE : "") + ".js";
  name += "-" + _id;
  worker_stack$$module$src$worker[name] || (worker_stack$$module$src$worker[name] = []);
  worker_stack$$module$src$worker[name][_core] = new Worker(worker_payload);
  worker_stack$$module$src$worker[name][_core]["onmessage"] = _callback;
  if (DEBUG) {
    console.log("Register Worker: " + name + "@" + _core);
  }
  return worker_stack$$module$src$worker[name][_core];
}
function worker_module$$module$src$worker() {
  var id;
  var FlexSearchWorker;
  self.onmessage = function(event) {
    var data = event["data"];
    if (data) {
      if (data["search"]) {
        var results = FlexSearchWorker["search"](data["content"], data["threshold"] ? {"limit":data["limit"], "threshold":data["threshold"], "where":data["where"]} : data["limit"]);
        self.postMessage({"id":id, "content":data["content"], "limit":data["limit"], "result":results});
      } else {
        if (data["add"]) {
          FlexSearchWorker["add"](data["id"], data["content"]);
        } else {
          if (data["update"]) {
            FlexSearchWorker["update"](data["id"], data["content"]);
          } else {
            if (data["remove"]) {
              FlexSearchWorker["remove"](data["id"]);
            } else {
              if (data["clear"]) {
                FlexSearchWorker["clear"]();
              } else {
                if (SUPPORT_INFO && data["info"]) {
                  var info = FlexSearchWorker["info"]();
                  info["worker"] = id;
                  console.log(info);
                } else {
                  if (data["register"]) {
                    id = data["id"];
                    data["options"]["cache"] = false;
                    data["options"]["async"] = false;
                    data["options"]["worker"] = false;
                    FlexSearchWorker = (new Function(data["register"].substring(data["register"].indexOf("{") + 1, data["register"].lastIndexOf("}"))))();
                    FlexSearchWorker = new FlexSearchWorker(data["options"]);
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}
function addWorker$$module$src$worker(id, core, options, callback) {
  var thread = init$$module$src$worker("flexsearch", "id" + id, worker_module$$module$src$worker, function(event) {
    var data = event["data"];
    if (data && data["result"]) {
      callback(data["id"], data["content"], data["result"], data["limit"], data["where"], data["cursor"], data["suggest"]);
    }
  }, core);
  var fnStr = FlexSearch$$module$src$flexsearch.toString();
  options["id"] = core;
  thread.postMessage({"register":fnStr, "options":options, "id":core});
  return thread;
}
if (SUPPORT_WORKER) {
  FlexSearch$$module$src$flexsearch.prototype.worker_handler = function(id, query, result, limit, where, cursor, suggest) {
    if (this._task_completed !== this.worker) {
      this._task_result = this._task_result.concat(result);
      this._task_completed++;
      if (limit && this._task_result.length >= limit) {
        this._task_completed = this.worker;
      }
      if (this._task_completed === this.worker) {
        if (this.cache) {
          this._cache.set(query, this._task_result);
        }
        if (this._current_callback) {
          this._current_callback(this._task_result);
        }
      }
    }
    return this;
  };
}
var module$src$worker = {};
module$src$worker.addWorker = addWorker$$module$src$worker;
module$src$worker.default = init$$module$src$worker;
var $jscompDefaultExport$$module$src$presets = {"memory":{encode:SUPPORT_ENCODER ? "extra" : "icase", tokenize:"strict", threshold:0, resolution:1}, "speed":{encode:"icase", tokenize:"strict", threshold:1, resolution:3, depth:2}, "match":{encode:SUPPORT_ENCODER ? "extra" : "icase", tokenize:"full", threshold:1, resolution:3}, "score":{encode:SUPPORT_ENCODER ? "extra" : "icase", tokenize:"strict", threshold:1, resolution:9, depth:4}, "balance":{encode:SUPPORT_ENCODER ? "balance" : "icase", tokenize:"strict", 
threshold:0, resolution:3, depth:3}, "fast":{encode:"icase", tokenize:"strict", threshold:8, resolution:9, depth:1}};
var module$src$presets = {};
module$src$presets.default = $jscompDefaultExport$$module$src$presets;
var regex_whitespace$$module$src$lang$latin$simple = regex$$module$src$common("[\\W_]+");
var regex_strip$$module$src$lang$latin$simple = regex$$module$src$common("[^a-z0-9 ]");
var regex_a$$module$src$lang$latin$simple = regex$$module$src$common("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]");
var regex_e$$module$src$lang$latin$simple = regex$$module$src$common("[\u00e8\u00e9\u00ea\u00eb]");
var regex_i$$module$src$lang$latin$simple = regex$$module$src$common("[\u00ec\u00ed\u00ee\u00ef]");
var regex_o$$module$src$lang$latin$simple = regex$$module$src$common("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]");
var regex_u$$module$src$lang$latin$simple = regex$$module$src$common("[\u00f9\u00fa\u00fb\u00fc\u0171]");
var regex_y$$module$src$lang$latin$simple = regex$$module$src$common("[\u00fd\u0177\u00ff]");
var regex_n$$module$src$lang$latin$simple = regex$$module$src$common("\u00f1");
var regex_c$$module$src$lang$latin$simple = regex$$module$src$common("[\u00e7c]");
var regex_s$$module$src$lang$latin$simple = regex$$module$src$common("\u00df");
var regex_and$$module$src$lang$latin$simple = regex$$module$src$common(" & ");
var regex_pairs_simple$$module$src$lang$latin$simple = [regex_a$$module$src$lang$latin$simple, "a", regex_e$$module$src$lang$latin$simple, "e", regex_i$$module$src$lang$latin$simple, "i", regex_o$$module$src$lang$latin$simple, "o", regex_u$$module$src$lang$latin$simple, "u", regex_y$$module$src$lang$latin$simple, "y", regex_n$$module$src$lang$latin$simple, "n", regex_c$$module$src$lang$latin$simple, "k", regex_s$$module$src$lang$latin$simple, "s", regex_and$$module$src$lang$latin$simple, " and ", 
regex_whitespace$$module$src$lang$latin$simple, " ", regex_strip$$module$src$lang$latin$simple, ""];
var $jscompDefaultExport$$module$src$lang$latin$simple = function(str) {
  if (!str) {
    return str;
  }
  return replace$$module$src$common(str.toLowerCase(), regex_pairs_simple$$module$src$lang$latin$simple);
};
var module$src$lang$latin$simple = {};
module$src$lang$latin$simple.default = $jscompDefaultExport$$module$src$lang$latin$simple;
var regex_ae$$module$src$lang$latin$advanced = regex$$module$src$common("ae");
var regex_ai$$module$src$lang$latin$advanced = regex$$module$src$common("ai");
var regex_ay$$module$src$lang$latin$advanced = regex$$module$src$common("ay");
var regex_ey$$module$src$lang$latin$advanced = regex$$module$src$common("ey");
var regex_oe$$module$src$lang$latin$advanced = regex$$module$src$common("oe");
var regex_ue$$module$src$lang$latin$advanced = regex$$module$src$common("ue");
var regex_ie$$module$src$lang$latin$advanced = regex$$module$src$common("ie");
var regex_sz$$module$src$lang$latin$advanced = regex$$module$src$common("sz");
var regex_zs$$module$src$lang$latin$advanced = regex$$module$src$common("zs");
var regex_ck$$module$src$lang$latin$advanced = regex$$module$src$common("ck");
var regex_cc$$module$src$lang$latin$advanced = regex$$module$src$common("cc");
var regex_sh$$module$src$lang$latin$advanced = regex$$module$src$common("sh");
var regex_th$$module$src$lang$latin$advanced = regex$$module$src$common("th");
var regex_dt$$module$src$lang$latin$advanced = regex$$module$src$common("dt");
var regex_ph$$module$src$lang$latin$advanced = regex$$module$src$common("ph");
var regex_pf$$module$src$lang$latin$advanced = regex$$module$src$common("pf");
var regex_ou$$module$src$lang$latin$advanced = regex$$module$src$common("ou");
var regex_uo$$module$src$lang$latin$advanced = regex$$module$src$common("uo");
var pairs$$module$src$lang$latin$advanced = [regex_ae$$module$src$lang$latin$advanced, "a", regex_ai$$module$src$lang$latin$advanced, "ei", regex_ay$$module$src$lang$latin$advanced, "ei", regex_ey$$module$src$lang$latin$advanced, "ei", regex_oe$$module$src$lang$latin$advanced, "o", regex_ue$$module$src$lang$latin$advanced, "u", regex_ie$$module$src$lang$latin$advanced, "i", regex_sz$$module$src$lang$latin$advanced, "s", regex_zs$$module$src$lang$latin$advanced, "s", regex_sh$$module$src$lang$latin$advanced, 
"s", regex_ck$$module$src$lang$latin$advanced, "k", regex_cc$$module$src$lang$latin$advanced, "k", regex_th$$module$src$lang$latin$advanced, "t", regex_dt$$module$src$lang$latin$advanced, "t", regex_ph$$module$src$lang$latin$advanced, "f", regex_pf$$module$src$lang$latin$advanced, "f", regex_ou$$module$src$lang$latin$advanced, "o", regex_uo$$module$src$lang$latin$advanced, "u"];
var $jscompDefaultExport$$module$src$lang$latin$advanced = function(string, _skip_post_processing) {
  if (!string) {
    return string;
  }
  string = $jscompDefaultExport$$module$src$lang$latin$simple(string);
  if (string.length > 2) {
    string = replace$$module$src$common(string, pairs$$module$src$lang$latin$advanced);
  }
  if (!_skip_post_processing) {
    if (string.length > 1) {
      string = collapse$$module$src$common(string);
    }
  }
  return string;
};
var module$src$lang$latin$advanced = {};
module$src$lang$latin$advanced.default = $jscompDefaultExport$$module$src$lang$latin$advanced;
var regex_whitespace$$module$src$lang$latin$balance = regex$$module$src$common("[\\W_]+");
var regex_strip$$module$src$lang$latin$balance = regex$$module$src$common("[^a-z0-9 ]");
var pairs$$module$src$lang$latin$balance = [regex_whitespace$$module$src$lang$latin$balance, " ", regex_strip$$module$src$lang$latin$balance, ""];
var $jscompDefaultExport$$module$src$lang$latin$balance = function(str) {
  if (!str) {
    return str;
  }
  return collapse$$module$src$common(replace$$module$src$common(str.toLowerCase(), pairs$$module$src$lang$latin$balance));
};
var module$src$lang$latin$balance = {};
module$src$lang$latin$balance.default = $jscompDefaultExport$$module$src$lang$latin$balance;
var soundex_b$$module$src$lang$latin$extra = regex$$module$src$common("p");
var soundex_s$$module$src$lang$latin$extra = regex$$module$src$common("z");
var soundex_k$$module$src$lang$latin$extra = regex$$module$src$common("[cgq]");
var soundex_m$$module$src$lang$latin$extra = regex$$module$src$common("n");
var soundex_t$$module$src$lang$latin$extra = regex$$module$src$common("d");
var soundex_f$$module$src$lang$latin$extra = regex$$module$src$common("[vw]");
var regex_vowel$$module$src$lang$latin$extra = regex$$module$src$common("[aeiouy]");
var regex_pairs_extra$$module$src$lang$latin$extra = [soundex_b$$module$src$lang$latin$extra, "b", soundex_s$$module$src$lang$latin$extra, "s", soundex_k$$module$src$lang$latin$extra, "k", soundex_m$$module$src$lang$latin$extra, "m", soundex_t$$module$src$lang$latin$extra, "t", soundex_f$$module$src$lang$latin$extra, "f", regex_vowel$$module$src$lang$latin$extra, ""];
var $jscompDefaultExport$$module$src$lang$latin$extra = function(str) {
  if (!str) {
    return str;
  }
  str = $jscompDefaultExport$$module$src$lang$latin$advanced(str, true);
  if (str.length > 1) {
    str = str.split(" ");
    for (var i = 0; i < str.length; i++) {
      var current = str[i];
      if (current.length > 1) {
        str[i] = current[0] + replace$$module$src$common(current.substring(1), regex_pairs_extra$$module$src$lang$latin$extra);
      }
    }
    str = str.join(" ");
    str = collapse$$module$src$common(str);
  }
  return str;
};
var module$src$lang$latin$extra = {};
module$src$lang$latin$extra.default = $jscompDefaultExport$$module$src$lang$latin$extra;
function encode$$module$src$lang$latin$index(str) {
  return str.toLowerCase();
}
var split$$module$src$lang$latin$index = /[\W_]+/;
var rtl$$module$src$lang$latin$index = false;
var advanced$$module$src$lang$latin$index = $jscompDefaultExport$$module$src$lang$latin$advanced;
var balance$$module$src$lang$latin$index = $jscompDefaultExport$$module$src$lang$latin$balance;
var extra$$module$src$lang$latin$index = $jscompDefaultExport$$module$src$lang$latin$extra;
var simple$$module$src$lang$latin$index = $jscompDefaultExport$$module$src$lang$latin$simple;
var module$src$lang$latin$index = {};
module$src$lang$latin$index.advanced = advanced$$module$src$lang$latin$index;
module$src$lang$latin$index.balance = balance$$module$src$lang$latin$index;
module$src$lang$latin$index.encode = encode$$module$src$lang$latin$index;
module$src$lang$latin$index.extra = extra$$module$src$lang$latin$index;
module$src$lang$latin$index.rtl = rtl$$module$src$lang$latin$index;
module$src$lang$latin$index.simple = simple$$module$src$lang$latin$index;
module$src$lang$latin$index.split = split$$module$src$lang$latin$index;
var defaults$$module$src$flexsearch = {encode:encode$$module$src$lang$latin$index, tokenize:"strict", split:split$$module$src$lang$latin$index, cache:false, async:false, worker:false, rtl:false, doc:false, resolution:9, threshold:0, depth:0};
var id_counter$$module$src$flexsearch = 0;
var global_lang$$module$src$flexsearch = {};
function FlexSearch$$module$src$flexsearch(options) {
  if (!(this instanceof FlexSearch$$module$src$flexsearch)) {
    return new FlexSearch$$module$src$flexsearch(options);
  }
  var id = options && options["id"];
  this.id = id || id === 0 ? id : id_counter$$module$src$flexsearch++;
  this.init(options);
  register_property$$module$src$flexsearch(this, "index", function() {
    return get_keys$$module$src$common(this._ids);
  });
  register_property$$module$src$flexsearch(this, "length", function() {
    return this.index.length;
  });
}
FlexSearch$$module$src$flexsearch["registerCharset"] = function(name, encoder, split, rtl) {
  var lang = global_lang$$module$src$flexsearch[name] || (global_lang$$module$src$flexsearch[name] = {});
  lang.encoder = encoder;
  lang.split = split;
  lang.rtl = rtl;
  return FlexSearch$$module$src$flexsearch;
};
FlexSearch$$module$src$flexsearch["registerLanguage"] = function(name, filter, stemmer, matcher) {
  var lang = global_lang$$module$src$flexsearch[name] || (global_lang$$module$src$flexsearch[name] = {});
  lang.filter = filter;
  lang.stemmer = stemmer;
  lang.matcher = matcher;
  return FlexSearch$$module$src$flexsearch;
};
FlexSearch$$module$src$flexsearch.prototype.init = function(options) {
  this.matcher = [];
  var custom;
  var doc;
  if (SUPPORT_PRESET) {
    if (is_string$$module$src$common(options)) {
      if (DEBUG && !$jscompDefaultExport$$module$src$presets[options]) {
        console.warn("Preset not found: " + options);
      }
      options = $jscompDefaultExport$$module$src$presets[options];
    } else {
      if (custom = options["preset"]) {
        if (DEBUG && !$jscompDefaultExport$$module$src$presets[custom]) {
          console.warn("Preset not found: " + custom);
        }
        options = Object.assign({}, $jscompDefaultExport$$module$src$presets[custom], options);
      }
    }
  }
  if (!this.encoder) {
    if (options) {
      options = Object.assign({}, defaults$$module$src$flexsearch, options);
    } else {
      options = defaults$$module$src$flexsearch;
    }
  }
  if (options) {
    if (SUPPORT_WORKER && (custom = options["worker"])) {
      if (typeof init$$module$src$worker === "undefined") {
        options["worker"] = false;
        this._worker = null;
      } else {
        var threads = parseInt(custom, 10) || 4;
        this._current_task = -1;
        this._task_completed = 0;
        this._task_result = [];
        this._current_callback = null;
        this._worker = new Array(threads);
        for (var i = 0; i < threads; i++) {
          this._worker[i] = addWorker$$module$src$worker(this.id, i, options, this.worker_handler);
        }
      }
      this.worker = custom;
    }
    var charset = options["charset"];
    var lang = options["lang"];
    this.tokenizer = options["tokenize"];
    this.split = is_string$$module$src$common(custom = charset || options["split"]) ? global_lang$$module$src$flexsearch[custom] ? global_lang$$module$src$flexsearch[custom].split : regex$$module$src$common(custom) : custom;
    this.rtl = is_string$$module$src$common(custom = charset || options["rtl"]) ? global_lang$$module$src$flexsearch[custom].rtl : custom;
    if (SUPPORT_ASYNC) {
      this.async = options["async"];
      this._timer = 0;
    }
    this.threshold = options["threshold"];
    this.resolution = (custom = options["resolution"]) <= this.threshold ? this.threshold + 1 : custom;
    this.depth = this.tokenizer === "strict" && options["depth"] || 0;
    this.encoder = is_string$$module$src$common(custom = charset || options["encode"]) ? global_lang$$module$src$flexsearch[custom.indexOf(":") === -1 ? custom + ":default" : custom].encode : custom;
    this.matcher = (custom = lang || options["matcher"]) && init_matcher$$module$src$flexsearch(is_string$$module$src$common(custom) ? global_lang$$module$src$flexsearch[custom].matcher : custom);
    this.filter = (custom = lang || options["filter"]) && init_filter$$module$src$flexsearch(is_string$$module$src$common(custom) ? global_lang$$module$src$flexsearch[custom].filter : custom);
    this.stemmer = (custom = lang || options["stemmer"]) && init_stemmer$$module$src$flexsearch(is_string$$module$src$common(custom) ? global_lang$$module$src$flexsearch[custom].stemmer : custom);
    if (SUPPORT_DOCUMENT) {
      this.doc = doc = (custom = options["doc"]) && clone_object$$module$src$flexsearch(custom);
      if (doc) {
        options["doc"] = null;
      }
    }
  }
  this._map = create_object_array$$module$src$common(this.resolution - (this.threshold || 0));
  this._ctx = create_object$$module$src$common();
  this._ids = {};
  if (SUPPORT_DOCUMENT && doc) {
    this._doc = create_object$$module$src$common();
    var index = doc.index = {};
    var keys = doc.keys = [];
    var field = doc["field"];
    var tag = doc["tag"];
    var store = doc["store"];
    if (!is_array$$module$src$common(doc["id"])) {
      doc["id"] = doc["id"].split(":");
    }
    if (store) {
      var store_custom = create_object$$module$src$common();
      if (is_string$$module$src$common(store)) {
        store_custom[store] = 1;
      } else {
        if (is_array$$module$src$common(store)) {
          for (var i$8 = 0; i$8 < store.length; i$8++) {
            store_custom[store[i$8]] = 1;
          }
        } else {
          if (is_object$$module$src$common(store)) {
            store_custom = store;
          }
        }
      }
      doc["store"] = store_custom;
    }
    if (SUPPORT_WHERE && tag) {
      this._tag = create_object$$module$src$common();
      var field_custom = create_object$$module$src$common();
      if (field) {
        if (is_string$$module$src$common(field)) {
          field_custom[field] = options;
        } else {
          if (is_array$$module$src$common(field)) {
            for (var i$9 = 0; i$9 < field.length; i$9++) {
              field_custom[field[i$9]] = options;
            }
          } else {
            if (is_object$$module$src$common(field)) {
              field_custom = field;
            }
          }
        }
      }
      if (!is_array$$module$src$common(tag)) {
        doc["tag"] = tag = [tag];
      }
      for (var i$10 = 0; i$10 < tag.length; i$10++) {
        this._tag[tag[i$10]] = create_object$$module$src$common();
      }
      this._tags = tag;
      field = field_custom;
    }
    if (field) {
      var has_custom;
      if (!is_array$$module$src$common(field)) {
        if (is_object$$module$src$common(field)) {
          has_custom = field;
          doc["field"] = field = get_keys$$module$src$common(field);
        } else {
          doc["field"] = field = [field];
        }
      }
      for (var i$11 = 0; i$11 < field.length; i$11++) {
        var ref = field[i$11];
        if (!is_array$$module$src$common(ref)) {
          if (has_custom) {
            options = has_custom[ref];
          }
          keys[i$11] = ref;
          field[i$11] = ref.split(":");
        }
        index[ref] = new FlexSearch$$module$src$flexsearch(options);
      }
    }
  }
  if (SUPPORT_CACHE && (custom = options["cache"])) {
    this._cache_status = true;
    this._cache = new CacheClass$$module$src$cache(custom);
  }
  return this;
};
function clone_object$$module$src$flexsearch(obj) {
  var clone = create_object$$module$src$common();
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key];
      if (is_array$$module$src$common(value)) {
        clone[key] = value.slice(0);
      } else {
        if (is_object$$module$src$common(value)) {
          clone[key] = clone_object$$module$src$flexsearch(value);
        } else {
          clone[key] = value;
        }
      }
    }
  }
  return clone;
}
function init_matcher$$module$src$flexsearch(custom) {
  var keys = get_keys$$module$src$common(custom);
  var length = keys.length;
  var matcher = new Array(length * 2);
  for (var i = 0, count = 0; i < length; i++) {
    var key = keys[i];
    matcher[count++] = regex$$module$src$common(key);
    matcher[count++] = custom[key];
  }
  return matcher;
}
FlexSearch$$module$src$flexsearch.prototype.add = function(id, content, callback, _skip_update, _recall) {
  if (SUPPORT_DOCUMENT && this.doc && is_object$$module$src$common(id)) {
    return this.handle_docs("add", id, content);
  }
  if (content && is_string$$module$src$common(content) && (id || id === 0)) {
    var index = id;
    if (this._ids[index] && !_skip_update) {
      return this.update(id, content);
    }
    if (!_recall) {
      if (SUPPORT_ASYNC && this.async && (!SUPPORT_WORKER || typeof importScripts !== "function")) {
        var self$12 = this;
        var promise = new Promise(function(resolve) {
          setTimeout(function() {
            self$12.add(id, content, null, _skip_update, true);
            self$12 = null;
            resolve();
          });
        });
        if (callback) {
          promise.then(callback);
        } else {
          return promise;
        }
        return this;
      }
      if (callback) {
        this.add(id, content, null, _skip_update, true);
        callback();
        return this;
      }
    }
    content = this.encode(content);
    if (!content.length) {
      return this;
    }
    var words = this.tokenize(content);
    var dupes = create_object$$module$src$common();
    dupes["_ctx"] = create_object$$module$src$common();
    var word_length = words.length;
    var threshold = this.threshold;
    var depth = this.depth;
    var resolution = this.resolution;
    var map = this._map;
    var rtl = this.rtl;
    for (var i = 0; i < word_length; i++) {
      var value = words[i];
      if (value) {
        var length = value.length;
        var context_score = (rtl ? i + 1 : word_length - i) / word_length;
        var token = "";
        switch(this.tokenizer) {
          case "reverse":
          case "both":
            for (var a = length; --a;) {
              token = value[a] + token;
              add_index$$module$src$flexsearch(map, dupes, token, id, rtl ? 1 : (length - a) / length, context_score, threshold, resolution - 1);
            }
            token = "";
          case "forward":
            for (var a$13 = 0; a$13 < length; a$13++) {
              token += value[a$13];
              add_index$$module$src$flexsearch(map, dupes, token, id, rtl ? (a$13 + 1) / length : 1, context_score, threshold, resolution - 1);
            }
            break;
          case "full":
            for (var x = 0; x < length; x++) {
              var partial_score = (rtl ? x + 1 : length - x) / length;
              for (var y = length; y > x; y--) {
                token = value.substring(x, y);
                add_index$$module$src$flexsearch(map, dupes, token, id, partial_score, context_score, threshold, resolution - 1);
              }
            }
            break;
          default:
            var score = add_index$$module$src$flexsearch(map, dupes, value, id, 1, context_score, threshold, resolution - 1);
            if (depth && word_length > 1 && score >= threshold) {
              var ctxDupes = dupes["_ctx"][value] || (dupes["_ctx"][value] = create_object$$module$src$common());
              var ctxTmp = this._ctx[value] || (this._ctx[value] = create_object_array$$module$src$common(resolution - (threshold || 0)));
              var x$14 = i - depth;
              var y$15 = i + depth + 1;
              if (x$14 < 0) {
                x$14 = 0;
              }
              if (y$15 > word_length) {
                y$15 = word_length;
              }
              for (; x$14 < y$15; x$14++) {
                if (x$14 !== i) {
                  add_index$$module$src$flexsearch(ctxTmp, ctxDupes, words[x$14], id, 0, resolution - (x$14 < i ? i - x$14 : x$14 - i), threshold, resolution - 1);
                }
              }
            }
            break;
        }
      }
    }
    this._ids[index] = 1;
    if (SUPPORT_CACHE) {
      this._cache_status = false;
    }
  }
  return this;
};
if (SUPPORT_DOCUMENT) {
  FlexSearch$$module$src$flexsearch.prototype.handle_docs = function(job, doc, callback) {
    if (is_array$$module$src$common(doc)) {
      var len = doc.length;
      if (len--) {
        for (var i = 0; i < len; i++) {
          this.handle_docs(job, doc[i]);
        }
        return this.handle_docs(job, doc[len], callback);
      }
    } else {
      var index = this.doc.index;
      var keys = this.doc.keys;
      var tags = this.doc["tag"];
      var store = this.doc["store"];
      var tree;
      var tag;
      tree = this.doc["id"];
      var id = doc;
      for (var i$16 = 0; i$16 < tree.length; i$16++) {
        id = id[tree[i$16]];
      }
      if (job === "remove") {
        delete this._doc[id];
        var length = keys.length;
        if (length--) {
          for (var z = 0; z < length; z++) {
            index[keys[z]].remove(id);
          }
          return index[keys[length]].remove(id, callback);
        }
      }
      if (tags) {
        var tag_key;
        var tag_value;
        for (var i$17 = 0; i$17 < tags.length; i$17++) {
          tag_key = tags[i$17];
          tag_value = doc;
          var tag_split = tag_key.split(":");
          for (var a = 0; a < tag_split.length; a++) {
            tag_value = tag_value[tag_split[a]];
          }
          tag_value = "@" + tag_value;
        }
        tag = this._tag[tag_key];
        tag = tag[tag_value] || (tag[tag_value] = []);
      }
      tree = this.doc["field"];
      for (var i$18 = 0, len$19 = tree.length; i$18 < len$19; i$18++) {
        var branch = tree[i$18];
        var content = doc;
        for (var x = 0; x < branch.length; x++) {
          content = content[branch[x]];
        }
        var self$20 = index[keys[i$18]];
        if (job === "add") {
          self$20.add(id, content, i$18 === len$19 - 1 && callback);
        } else {
          self$20.update(id, content, i$18 === len$19 - 1 && callback);
        }
      }
      if (store) {
        var store_keys = get_keys$$module$src$common(store);
        var store_doc = create_object$$module$src$common();
        for (var i$21 = 0; i$21 < store_keys.length; i$21++) {
          var store_key = store_keys[i$21];
          if (store[store_key]) {
            var store_split = store_key.split(":");
            var store_value = undefined;
            var store_doc_value = undefined;
            for (var a$22 = 0; a$22 < store_split.length; a$22++) {
              var store_split_key = store_split[a$22];
              store_value = (store_value || doc)[store_split_key];
              store_doc_value = (store_doc_value || store_doc)[store_split_key] = store_value;
            }
          }
        }
        doc = store_doc;
      }
      if (tag) {
        tag[tag.length] = doc;
      }
      this._doc[id] = doc;
    }
    return this;
  };
}
FlexSearch$$module$src$flexsearch.prototype.update = function(id, content, callback) {
  if (SUPPORT_DOCUMENT && this.doc && is_object$$module$src$common(id)) {
    return this.handle_docs("update", id, content);
  }
  var index = id;
  if (this._ids[index] && is_string$$module$src$common(content)) {
    this.remove(id);
    this.add(id, content, callback, true);
  }
  return this;
};
FlexSearch$$module$src$flexsearch.prototype.remove = function(id, callback, _recall) {
  if (SUPPORT_DOCUMENT && this.doc && is_object$$module$src$common(id)) {
    return this.handle_docs("remove", id, callback);
  }
  var index = id;
  if (this._ids[index]) {
    if (!_recall) {
      if (SUPPORT_ASYNC && this.async && typeof importScripts !== "function") {
        var self$23 = this;
        var promise = new Promise(function(resolve) {
          setTimeout(function() {
            self$23.remove(id, null, true);
            self$23 = null;
            resolve();
          });
        });
        if (callback) {
          promise.then(callback);
        } else {
          return promise;
        }
        return this;
      }
      if (callback) {
        this.remove(id, null, true);
        callback();
        return this;
      }
    }
    for (var z = 0; z < this.resolution - (this.threshold || 0); z++) {
      remove_index$$module$src$flexsearch(this._map[z], id);
    }
    if (this.depth) {
      remove_index$$module$src$flexsearch(this._ctx, id);
    }
    delete this._ids[index];
    if (SUPPORT_CACHE) {
      this._cache_status = false;
    }
  }
  return this;
};
var field_to_sort$$module$src$flexsearch;
function enrich_documents$$module$src$flexsearch(arr, docs) {
  var length = arr.length;
  var result = new Array(length);
  for (var i = 0; i < length; i++) {
    result[i] = docs[arr[i]];
  }
  return result;
}
FlexSearch$$module$src$flexsearch.prototype.merge_and_sort = function(query, bool, result, sort, limit, suggest, where, cursor, has_and, has_not) {
  result = intersect$$module$src$flexsearch(result, where ? 0 : limit, SUPPORT_PAGINATION && cursor, SUPPORT_SUGGESTION && suggest, bool, has_and, has_not);
  var next;
  if (cursor) {
    cursor = result.page;
    next = result.next;
    result = result.result;
  }
  if (where) {
    result = this.where(where, null, limit, result);
  } else {
    result = enrich_documents$$module$src$flexsearch(result, this._doc);
  }
  if (sort) {
    if (!is_function$$module$src$common(sort)) {
      field_to_sort$$module$src$flexsearch = sort.split(":");
      if (field_to_sort$$module$src$flexsearch.length > 1) {
        sort = sort_by_deep_field_up$$module$src$flexsearch;
      } else {
        field_to_sort$$module$src$flexsearch = field_to_sort$$module$src$flexsearch[0];
        sort = sort_by_field_up$$module$src$flexsearch;
      }
    }
    result.sort(sort);
  }
  result = create_page$$module$src$flexsearch(cursor, next, result);
  if (SUPPORT_CACHE && this._cache) {
    this._cache.set(query, result);
  }
  return result;
};
FlexSearch$$module$src$flexsearch.prototype.search = function(query, limit, callback, _recall) {
  if (SUPPORT_DOCUMENT && is_object$$module$src$common(limit)) {
    if (is_array$$module$src$common(limit)) {
      for (var i = 0; i < limit.length; i++) {
        limit[i]["query"] = query;
      }
    } else {
      limit["query"] = query;
    }
    query = limit;
    limit = 1000;
  } else {
    if (limit && is_function$$module$src$common(limit)) {
      callback = limit;
      limit = 1000;
    } else {
      limit || limit === 0 || (limit = 1000);
    }
  }
  var result = [];
  var _query = query;
  var threshold;
  var cursor;
  var sort;
  var suggest;
  if (is_object$$module$src$common(query) && (!SUPPORT_DOCUMENT || !is_array$$module$src$common(query))) {
    if (SUPPORT_ASYNC) {
      if (!callback) {
        callback = query["callback"];
        if (callback) {
          _query["callback"] = null;
        }
      }
    }
    sort = SUPPORT_DOCUMENT && query["sort"];
    cursor = SUPPORT_PAGINATION && query["page"];
    limit = query["limit"];
    threshold = query["threshold"];
    suggest = SUPPORT_SUGGESTION && query["suggest"];
    query = query["query"];
  }
  if (SUPPORT_DOCUMENT && this.doc) {
    var doc_idx = this.doc.index;
    var where = SUPPORT_WHERE && _query["where"];
    var bool_main = SUPPORT_OPERATOR && _query["bool"] || "or";
    var field = _query["field"];
    var bool = bool_main;
    var queries;
    var has_not;
    var has_and;
    if (field) {
      if (!is_array$$module$src$common(field)) {
        field = [field];
      }
    } else {
      if (is_array$$module$src$common(_query)) {
        queries = _query;
        field = [];
        bool = [];
        for (var i$24 = 0; i$24 < _query.length; i$24++) {
          var current = _query[i$24];
          var current_bool = SUPPORT_OPERATOR && current["bool"] || bool_main;
          field[i$24] = current["field"];
          bool[i$24] = current_bool;
          if (current_bool === "not") {
            has_not = true;
          } else {
            if (current_bool === "and") {
              has_and = true;
            }
          }
        }
      } else {
        field = this.doc.keys;
      }
    }
    var len = field.length;
    for (var i$25 = 0; i$25 < len; i$25++) {
      if (queries) {
        _query = queries[i$25];
      }
      if (cursor && !is_string$$module$src$common(_query)) {
        _query["page"] = null;
        _query["limit"] = 0;
      }
      result[i$25] = doc_idx[field[i$25]].search(_query, 0);
    }
    if (callback) {
      return callback(this.merge_and_sort(query, bool, result, sort, limit, suggest, where, cursor, has_and, has_not));
    } else {
      if (SUPPORT_ASYNC && this.async) {
        var self$26 = this;
        return new Promise(function(resolve) {
          Promise.all(result).then(function(values) {
            resolve(self$26.merge_and_sort(query, bool, values, sort, limit, suggest, where, cursor, has_and, has_not));
          });
        });
      } else {
        return this.merge_and_sort(query, bool, result, sort, limit, suggest, where, cursor, has_and, has_not);
      }
    }
  }
  threshold || (threshold = this.threshold || 0);
  if (!_recall) {
    if (SUPPORT_ASYNC && this.async && typeof importScripts !== "function") {
      var self$27 = this;
      var promise = new Promise(function(resolve) {
        setTimeout(function() {
          resolve(self$27.search(_query, limit, null, true));
          self$27 = null;
        });
      });
      if (callback) {
        promise.then(callback);
      } else {
        return promise;
      }
      return this;
    }
    if (callback) {
      callback(this.search(_query, limit, null, true));
      return this;
    }
  }
  if (!query || !is_string$$module$src$common(query)) {
    return result;
  }
  _query = query;
  if (SUPPORT_CACHE && this._cache) {
    if (this._cache_status) {
      var cache = this._cache.get(query);
      if (cache) {
        return cache;
      }
    } else {
      this._cache.clear();
      this._cache_status = true;
    }
  }
  _query = this.encode(_query);
  if (!_query.length) {
    return result;
  }
  var words = this.tokenize(_query);
  var length = words.length;
  var found = true;
  var check = [];
  var check_words = create_object$$module$src$common();
  var ctx_root;
  var use_contextual;
  var a = 0;
  if (length > 1) {
    if (this.depth) {
      use_contextual = true;
    } else {
      words.sort(sort_by_length_down$$module$src$flexsearch);
    }
  }
  var ctx_map;
  if (!use_contextual || (ctx_map = this._ctx)) {
    var resolution = this.resolution;
    for (; a < length; a++) {
      var value = words[a];
      if (value) {
        if (use_contextual) {
          if (!ctx_root) {
            if (ctx_map[value]) {
              ctx_root = value;
              check_words[value] = 1;
            } else {
              if (!suggest) {
                return result;
              }
            }
          }
          if (suggest && a === length - 1 && !check.length) {
            use_contextual = false;
            value = ctx_root || value;
            check_words[value] = 0;
          } else {
            if (!ctx_root) {
              continue;
            }
          }
        }
        if (!check_words[value]) {
          var map_check = [];
          var map_found = false;
          var count = 0;
          var map = use_contextual ? ctx_map[ctx_root] : this._map;
          if (map) {
            var map_value = undefined;
            for (var z = 0; z < resolution - threshold; z++) {
              if (map_value = map[z] && map[z][value]) {
                map_check[count++] = map_value;
                map_found = true;
              }
            }
          }
          if (map_found) {
            ctx_root = value;
            check[check.length] = count > 1 ? map_check.concat.apply([], map_check) : map_check[0];
          } else {
            if (!SUPPORT_SUGGESTION || !suggest) {
              found = false;
              break;
            }
          }
          check_words[value] = 1;
        }
      }
    }
  } else {
    found = false;
  }
  if (found) {
    result = intersect$$module$src$flexsearch(check, limit, cursor, SUPPORT_SUGGESTION && suggest);
  }
  if (SUPPORT_CACHE && this._cache) {
    this._cache.set(query, result);
  }
  return result;
};
if (SUPPORT_INFO) {
  FlexSearch$$module$src$flexsearch.prototype.info = function() {
    return {"id":this.id, "items":this["length"], "matcher":this.matcher.length, "worker":this.worker, "threshold":this.threshold, "depth":this.depth, "resolution":this.resolution, "contextual":this.depth && this.tokenizer === "strict"};
  };
}
FlexSearch$$module$src$flexsearch.prototype.clear = function() {
  return this.destroy().init();
};
FlexSearch$$module$src$flexsearch.prototype.destroy = function() {
  if (SUPPORT_CACHE && this._cache) {
    this._cache.clear();
    this._cache = null;
  }
  this._map = this._ctx = this._ids = null;
  if (SUPPORT_DOCUMENT && this.doc) {
    var keys = this.doc.keys;
    for (var i = 0; i < keys.length; i++) {
      this.doc.index[keys[i]].destroy();
    }
    this.doc = this._doc = null;
  }
  return this;
};
function register_property$$module$src$flexsearch(obj, key, fn) {
  Object.defineProperty(obj, key, {get:fn});
}
function add_index$$module$src$flexsearch(map, dupes, value, id, partial_score, context_score, threshold, resolution) {
  if (dupes[value]) {
    return dupes[value];
  }
  var score = partial_score ? (resolution - (threshold || resolution / 1.5)) * context_score + (threshold || resolution / 1.5) * partial_score : context_score;
  dupes[value] = score;
  if (score >= threshold) {
    var arr = map[resolution - (score + 0.5 >> 0)];
    arr = arr[value] || (arr[value] = []);
    arr[arr.length] = id;
  }
  return score;
}
function remove_index$$module$src$flexsearch(map, id) {
  if (map) {
    var keys = get_keys$$module$src$common(map);
    for (var i = 0, lengthKeys = keys.length; i < lengthKeys; i++) {
      var key = keys[i];
      var tmp = map[key];
      if (tmp) {
        for (var a = 0, lengthMap = tmp.length; a < lengthMap; a++) {
          if (tmp[a] === id) {
            if (lengthMap === 1) {
              delete map[key];
            } else {
              tmp.splice(a, 1);
            }
            break;
          } else {
            if (is_object$$module$src$common(tmp[a])) {
              remove_index$$module$src$flexsearch(tmp[a], id);
            }
          }
        }
      }
    }
  }
}
FlexSearch$$module$src$flexsearch.prototype.encode = function(value) {
  if (value && this.encoder) {
    value = this.encoder(value);
  }
  if (value && this.matcher.length) {
    value = replace$$module$src$common(value, this.matcher);
  }
  if (value && this.stemmer) {
    value = replace$$module$src$common(value, this.stemmer);
  }
  return value;
};
FlexSearch$$module$src$flexsearch.prototype.tokenize = function(content) {
  var words = is_array$$module$src$common(content) ? content : is_function$$module$src$common(this.tokenizer) ? this.tokenizer(content) : content.split(this.split);
  if (this.filter) {
    words = filter_words$$module$src$flexsearch(words, this.filter);
  }
  return words;
};
function filter_words$$module$src$flexsearch(words, fn_or_map) {
  var length = words.length;
  var has_function = is_function$$module$src$common(fn_or_map);
  var filtered = [];
  for (var i = 0, count = 0; i < length; i++) {
    var word = words[i];
    if (word) {
      if (has_function && fn_or_map(word) || !has_function && !fn_or_map[word]) {
        filtered[count++] = word;
      }
    }
  }
  return filtered;
}
function init_filter$$module$src$flexsearch(words) {
  var final = create_object$$module$src$common();
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    final[word] = 1;
  }
  return final;
}
function init_stemmer$$module$src$flexsearch(stem) {
  var keys = Object.keys(stem);
  var length = keys.length;
  var final = new Array(length * 2);
  for (var i = 0, count = 0; i < length; i++) {
    var key = keys[i];
    final[count++] = regex$$module$src$common(key + "(?!\\b)" + key + "(\\b)");
    final[count++] = stem[key];
  }
  return final;
}
function sort_by_length_down$$module$src$flexsearch(a, b) {
  return b.length - a.length;
}
function sort_by_field_up$$module$src$flexsearch(a, b) {
  return a[field_to_sort$$module$src$flexsearch] - b[field_to_sort$$module$src$flexsearch];
}
function sort_by_deep_field_up$$module$src$flexsearch(a, b) {
  var field_len = field_to_sort$$module$src$flexsearch.length;
  for (var i = 0; i < field_len; i++) {
    a = a[field_to_sort$$module$src$flexsearch[i]];
    b = b[field_to_sort$$module$src$flexsearch[i]];
  }
  return a - b;
}
function create_page$$module$src$flexsearch(cursor, page, result) {
  return cursor ? {"page":cursor, "next":page ? "" + page : null, "result":result} : result;
}
function intersect$$module$src$flexsearch(arrays, limit, cursor, suggest, bool, has_and, has_not) {
  var page;
  var result = [];
  var pointer;
  if (cursor === true) {
    cursor = "0";
    pointer = "";
  } else {
    pointer = cursor && cursor.split(":");
  }
  var length_z = arrays.length;
  if (length_z > 1) {
    var check = create_object$$module$src$common();
    var suggestions = [];
    var check_not;
    var arr;
    var z = 0;
    var i = 0;
    var length;
    var tmp;
    var init = true;
    var first_result;
    var count = 0;
    var bool_main;
    var last_index;
    var pointer_suggest;
    var pointer_count;
    if (pointer) {
      if (pointer.length === 2) {
        pointer_suggest = pointer;
        pointer = false;
      } else {
        pointer = pointer_count = parseInt(pointer[0], 10);
      }
    }
    if (SUPPORT_DOCUMENT && SUPPORT_OPERATOR) {
      if (has_not) {
        check_not = create_object$$module$src$common();
        for (; z < length_z; z++) {
          if (bool[z] === "not") {
            arr = arrays[z];
            length = arr.length;
            for (i = 0; i < length; i++) {
              check_not["@" + arr[i]] = 1;
            }
          } else {
            last_index = z + 1;
          }
        }
        if (is_undefined$$module$src$common(last_index)) {
          return create_page$$module$src$flexsearch(cursor, page, result);
        }
        z = 0;
      } else {
        bool_main = is_string$$module$src$common(bool) && bool;
      }
    }
    var bool_and;
    var bool_or;
    for (; z < length_z; z++) {
      var is_final_loop = z === (last_index || length_z) - 1;
      if (SUPPORT_DOCUMENT && SUPPORT_OPERATOR) {
        if (!bool_main || !z) {
          var bool_current = bool_main || bool && bool[z];
          if (!bool_current || bool_current === "and") {
            bool_and = has_and = true;
            bool_or = false;
          } else {
            if (bool_current === "or") {
              bool_or = true;
              bool_and = false;
            } else {
              continue;
            }
          }
        }
      } else {
        bool_and = has_and = true;
      }
      arr = arrays[z];
      length = arr.length;
      if (!length) {
        if (bool_and && !suggest) {
          return create_page$$module$src$flexsearch(cursor, page, arr);
        }
        continue;
      }
      if (init) {
        if (first_result) {
          var result_length = first_result.length;
          for (i = 0; i < result_length; i++) {
            var id = first_result[i];
            var index = "@" + id;
            if (!has_not || !check_not[index]) {
              check[index] = 1;
              if (!has_and) {
                result[count++] = id;
              }
            }
          }
          first_result = null;
          init = false;
        } else {
          first_result = arr;
          continue;
        }
      }
      var found = false;
      for (i = 0; i < length; i++) {
        tmp = arr[i];
        var index$28 = "@" + tmp;
        var check_val = has_and ? check[index$28] || 0 : z;
        if (check_val || suggest) {
          if (has_not && check_not[index$28]) {
            continue;
          }
          if (!has_and && check[index$28]) {
            continue;
          }
          if (check_val === z) {
            if (is_final_loop) {
              if (!pointer_count || --pointer_count < count) {
                result[count++] = tmp;
                if (limit && count === limit) {
                  return create_page$$module$src$flexsearch(cursor, count + (pointer || 0), result);
                }
              }
            } else {
              check[index$28] = z + 1;
            }
            found = true;
          } else {
            if (suggest) {
              var current_suggestion = suggestions[check_val] || (suggestions[check_val] = []);
              current_suggestion[current_suggestion.length] = tmp;
            }
          }
        }
      }
      if (bool_and && !found && !suggest) {
        break;
      }
    }
    if (first_result) {
      var result_length$29 = first_result.length;
      if (has_not) {
        if (pointer) {
          i = parseInt(pointer, 10);
        } else {
          i = 0;
        }
        for (; i < result_length$29; i++) {
          var id$30 = first_result[i];
          if (!check_not["@" + id$30]) {
            result[count++] = id$30;
          }
        }
      } else {
        result = first_result;
      }
    }
    if (suggest) {
      count = result.length;
      if (pointer_suggest) {
        z = parseInt(pointer_suggest[0], 10) + 1;
        i = parseInt(pointer_suggest[1], 10) + 1;
      } else {
        z = suggestions.length;
        i = 0;
      }
      for (; z--;) {
        tmp = suggestions[z];
        if (tmp) {
          for (length = tmp.length; i < length; i++) {
            var id$31 = tmp[i];
            if (!has_not || !check_not["@" + id$31]) {
              result[count++] = id$31;
              if (limit && count === limit) {
                return create_page$$module$src$flexsearch(cursor, z + ":" + i, result);
              }
            }
          }
          i = 0;
        }
      }
    }
  } else {
    if (length_z) {
      if (!bool || SUPPORT_OPERATOR && bool[0] !== "not") {
        result = arrays[0];
        if (pointer) {
          pointer = parseInt(pointer[0], 10);
        }
      }
    }
  }
  if (limit) {
    var length$32 = result.length;
    if (pointer && pointer > length$32) {
      pointer = 0;
    }
    var start = pointer || 0;
    page = start + limit;
    if (page < length$32) {
      result = result.slice(start, page);
    } else {
      page = 0;
      if (start) {
        result = result.slice(start);
      }
    }
  }
  return create_page$$module$src$flexsearch(cursor, page, result);
}
var module$src$flexsearch = {};
module$src$flexsearch.default = FlexSearch$$module$src$flexsearch;
FlexSearch$$module$src$flexsearch.prototype.init;
FlexSearch$$module$src$flexsearch.prototype.search;
FlexSearch$$module$src$flexsearch.prototype.add;
FlexSearch$$module$src$flexsearch.prototype.update;
FlexSearch$$module$src$flexsearch.prototype.remove;
FlexSearch$$module$src$flexsearch.prototype.find;
FlexSearch$$module$src$flexsearch.prototype.where;
FlexSearch$$module$src$flexsearch.prototype.info;
FlexSearch$$module$src$flexsearch.prototype.clear;
FlexSearch$$module$src$flexsearch.prototype.destroy;
FlexSearch$$module$src$flexsearch.prototype.export;
FlexSearch$$module$src$flexsearch.prototype.import;
FlexSearch$$module$src$flexsearch.prototype.encode;
FlexSearch$$module$src$flexsearch.prototype.addMatcher;
Promise.prototype.then;
var module$src$export = {};
if (SUPPORT_ENCODER) {
}
(function() {
  var name = "FlexSearch";
  var root = this || window;
  var prop;
  if ((prop = root["define"]) && prop["amd"]) {
    prop([], function() {
      return FlexSearch$$module$src$flexsearch;
    });
  } else {
    if (typeof root["exports"] === "object") {
      root["module"].exports = FlexSearch$$module$src$flexsearch;
    } else {
      root[name] = FlexSearch$$module$src$flexsearch;
    }
  }
})();
var module$src$bundle = {};
}).call(this);
