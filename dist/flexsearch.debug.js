/**!
 * FlexSearch.js v0.7.2 (Debug)
 * Copyright 2018-2021 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var h = h || {};
h.scope = {};
h.ASSUME_ES5 = !1;
h.ASSUME_NO_NATIVE_MAP = !1;
h.ASSUME_NO_NATIVE_SET = !1;
h.SIMPLE_FROUND_POLYFILL = !1;
h.ISOLATE_POLYFILLS = !1;
h.FORCE_POLYFILL_PROMISE = !1;
h.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
h.defineProperty = h.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  if (a == Array.prototype || a == Object.prototype) {
    return a;
  }
  a[b] = c.value;
  return a;
};
h.getGlobal = function(a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global, ];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) {
      return c;
    }
  }
  throw Error("Cannot find global object");
};
h.global = h.getGlobal(this);
h.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
h.TRUST_ES6_POLYFILLS = !h.ISOLATE_POLYFILLS || h.IS_SYMBOL_NATIVE;
h.polyfills = {};
h.propertyToPolyfillSymbol = {};
h.POLYFILL_PREFIX = "$jscp$";
h.polyfill = function(a, b, c, d) {
  b && (h.ISOLATE_POLYFILLS ? h.polyfillIsolated(a, b, c, d) : h.polyfillUnisolated(a, b, c, d));
};
h.polyfillUnisolated = function(a, b) {
  var c = h.global;
  a = a.split(".");
  for (var d = 0; d < a.length - 1; d++) {
    var e = a[d];
    if (!(e in c)) {
      return;
    }
    c = c[e];
  }
  a = a[a.length - 1];
  d = c[a];
  b = b(d);
  b != d && null != b && h.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
};
h.polyfillIsolated = function(a, b, c) {
  var d = a.split(".");
  a = 1 === d.length;
  var e = d[0];
  e = !a && e in h.polyfills ? h.polyfills : h.global;
  for (var f = 0; f < d.length - 1; f++) {
    var g = d[f];
    if (!(g in e)) {
      return;
    }
    e = e[g];
  }
  d = d[d.length - 1];
  c = h.IS_SYMBOL_NATIVE && "es6" === c ? e[d] : null;
  b = b(c);
  null != b && (a ? h.defineProperty(h.polyfills, d, {configurable:!0, writable:!0, value:b}) : b !== c && (void 0 === h.propertyToPolyfillSymbol[d] && (a = 1e9 * Math.random() >>> 0, h.propertyToPolyfillSymbol[d] = h.IS_SYMBOL_NATIVE ? h.global.Symbol(d) : h.POLYFILL_PREFIX + a + "$" + d), h.defineProperty(e, h.propertyToPolyfillSymbol[d], {configurable:!0, writable:!0, value:b})));
};
h.underscoreProtoCanBeSet = function() {
  var a = {a:!0}, b = {};
  try {
    return b.__proto__ = a, b.a;
  } catch (c) {
  }
  return !1;
};
h.setPrototypeOf = h.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : h.underscoreProtoCanBeSet() ? function(a, b) {
  a.__proto__ = b;
  if (a.__proto__ !== b) {
    throw new TypeError(a + " is not extensible");
  }
  return a;
} : null;
h.arrayIteratorImpl = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++], } : {done:!0};
  };
};
h.arrayIterator = function(a) {
  return {next:h.arrayIteratorImpl(a)};
};
h.makeIterator = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : h.arrayIterator(a);
};
h.generator = {};
h.generator.ensureIteratorResultIsObject_ = function(a) {
  if (!(a instanceof Object)) {
    throw new TypeError("Iterator result " + a + " is not an object");
  }
};
h.generator.Context = function() {
  this.isRunning_ = !1;
  this.yieldAllIterator_ = null;
  this.yieldResult = void 0;
  this.nextAddress = 1;
  this.finallyAddress_ = this.catchAddress_ = 0;
  this.finallyContexts_ = this.abruptCompletion_ = null;
};
h.generator.Context.prototype.start_ = function() {
  if (this.isRunning_) {
    throw new TypeError("Generator is already running");
  }
  this.isRunning_ = !0;
};
h.generator.Context.prototype.stop_ = function() {
  this.isRunning_ = !1;
};
h.generator.Context.prototype.jumpToErrorHandler_ = function() {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
h.generator.Context.prototype.next_ = function(a) {
  this.yieldResult = a;
};
h.generator.Context.prototype.throw_ = function(a) {
  this.abruptCompletion_ = {exception:a, isException:!0};
  this.jumpToErrorHandler_();
};
h.generator.Context.prototype.return = function(a) {
  this.abruptCompletion_ = {return:a};
  this.nextAddress = this.finallyAddress_;
};
h.generator.Context.prototype.jumpThroughFinallyBlocks = function(a) {
  this.abruptCompletion_ = {jumpTo:a};
  this.nextAddress = this.finallyAddress_;
};
h.generator.Context.prototype.yield = function(a, b) {
  this.nextAddress = b;
  return {value:a};
};
h.generator.Context.prototype.yieldAll = function(a, b) {
  a = h.makeIterator(a);
  var c = a.next();
  h.generator.ensureIteratorResultIsObject_(c);
  if (c.done) {
    this.yieldResult = c.value, this.nextAddress = b;
  } else {
    return this.yieldAllIterator_ = a, this.yield(c.value, b);
  }
};
h.generator.Context.prototype.jumpTo = function(a) {
  this.nextAddress = a;
};
h.generator.Context.prototype.jumpToEnd = function() {
  this.nextAddress = 0;
};
h.generator.Context.prototype.setCatchFinallyBlocks = function(a, b) {
  this.catchAddress_ = a;
  void 0 != b && (this.finallyAddress_ = b);
};
h.generator.Context.prototype.setFinallyBlock = function(a) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = a || 0;
};
h.generator.Context.prototype.leaveTryBlock = function(a, b) {
  this.nextAddress = a;
  this.catchAddress_ = b || 0;
};
h.generator.Context.prototype.enterCatchBlock = function(a) {
  this.catchAddress_ = a || 0;
  a = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return a;
};
h.generator.Context.prototype.enterFinallyBlock = function(a, b, c) {
  c ? this.finallyContexts_[c] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
  this.catchAddress_ = a || 0;
  this.finallyAddress_ = b || 0;
};
h.generator.Context.prototype.leaveFinallyBlock = function(a, b) {
  b = this.finallyContexts_.splice(b || 0)[0];
  if (b = this.abruptCompletion_ = this.abruptCompletion_ || b) {
    if (b.isException) {
      return this.jumpToErrorHandler_();
    }
    void 0 != b.jumpTo && this.finallyAddress_ < b.jumpTo ? (this.nextAddress = b.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_;
  } else {
    this.nextAddress = a;
  }
};
h.generator.Context.prototype.forIn = function(a) {
  return new h.generator.Context.PropertyIterator(a);
};
h.generator.Context.PropertyIterator = function(a) {
  this.object_ = a;
  this.properties_ = [];
  for (var b in a) {
    this.properties_.push(b);
  }
  this.properties_.reverse();
};
h.generator.Context.PropertyIterator.prototype.getNext = function() {
  for (; 0 < this.properties_.length;) {
    var a = this.properties_.pop();
    if (a in this.object_) {
      return a;
    }
  }
  return null;
};
h.generator.Engine_ = function(a) {
  this.context_ = new h.generator.Context;
  this.program_ = a;
};
h.generator.Engine_.prototype.next_ = function(a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
  }
  this.context_.next_(a);
  return this.nextStep_();
};
h.generator.Engine_.prototype.return_ = function(a) {
  this.context_.start_();
  var b = this.context_.yieldAllIterator_;
  if (b) {
    return this.yieldAllStep_("return" in b ? b["return"] : function(c) {
      return {value:c, done:!0};
    }, a, this.context_.return);
  }
  this.context_.return(a);
  return this.nextStep_();
};
h.generator.Engine_.prototype.throw_ = function(a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
  }
  this.context_.throw_(a);
  return this.nextStep_();
};
h.generator.Engine_.prototype.yieldAllStep_ = function(a, b, c) {
  try {
    var d = a.call(this.context_.yieldAllIterator_, b);
    h.generator.ensureIteratorResultIsObject_(d);
    if (!d.done) {
      return this.context_.stop_(), d;
    }
    var e = d.value;
  } catch (f) {
    return this.context_.yieldAllIterator_ = null, this.context_.throw_(f), this.nextStep_();
  }
  this.context_.yieldAllIterator_ = null;
  c.call(this.context_, e);
  return this.nextStep_();
};
h.generator.Engine_.prototype.nextStep_ = function() {
  for (; this.context_.nextAddress;) {
    try {
      var a = this.program_(this.context_);
      if (a) {
        return this.context_.stop_(), {value:a.value, done:!1};
      }
    } catch (b) {
      this.context_.yieldResult = void 0, this.context_.throw_(b);
    }
  }
  this.context_.stop_();
  if (this.context_.abruptCompletion_) {
    a = this.context_.abruptCompletion_;
    this.context_.abruptCompletion_ = null;
    if (a.isException) {
      throw a.exception;
    }
    return {value:a.return, done:!0};
  }
  return {value:void 0, done:!0};
};
h.generator.Generator_ = function(a) {
  this.next = function(b) {
    return a.next_(b);
  };
  this.throw = function(b) {
    return a.throw_(b);
  };
  this.return = function(b) {
    return a.return_(b);
  };
  this[Symbol.iterator] = function() {
    return this;
  };
};
h.generator.createGenerator = function(a, b) {
  b = new h.generator.Generator_(new h.generator.Engine_(b));
  h.setPrototypeOf && a.prototype && h.setPrototypeOf(b, a.prototype);
  return b;
};
h.asyncExecutePromiseGenerator = function(a) {
  function b(d) {
    return a.next(d);
  }
  function c(d) {
    return a.throw(d);
  }
  return new Promise(function(d, e) {
    function f(g) {
      g.done ? d(g.value) : Promise.resolve(g.value).then(b, c).then(f, e);
    }
    f(a.next());
  });
};
h.asyncExecutePromiseGeneratorFunction = function(a) {
  return h.asyncExecutePromiseGenerator(a());
};
h.asyncExecutePromiseGeneratorProgram = function(a) {
  return h.asyncExecutePromiseGenerator(new h.generator.Generator_(new h.generator.Engine_(a)));
};
function t(a, b) {
  return "undefined" !== typeof a ? a : b;
}
function aa(a) {
  const b = Array(a);
  for (let c = 0; c < a; c++) {
    b[c] = w();
  }
  return b;
}
function w() {
  return Object.create(null);
}
function ba(a, b) {
  return b.length - a.length;
}
function x(a) {
  return "string" === typeof a;
}
function y(a) {
  return "object" === typeof a;
}
function A(a) {
  return "function" === typeof a;
}
;function ca(a, b, c, d) {
  if (a && (b && (a = E(a, b)), this.matcher && (a = E(a, this.matcher)), this.stemmer && 1 < a.length && (a = E(a, this.stemmer)), d && 1 < a.length && (a = F(a)), c || "" === c)) {
    a = a.split(c);
    if (this.filter) {
      b = this.filter;
      c = a.length;
      d = [];
      for (let e = 0, f = 0; e < c; e++) {
        const g = a[e];
        g && !b[g] && (d[f++] = g);
      }
      a = d;
    }
    return a;
  }
  return a;
}
const da = /[\p{Z}\p{S}\p{P}\p{C}]+/u, ea = /[\u0300-\u036f]/g;
function fa(a, b) {
  const c = Object.keys(a), d = c.length, e = [];
  let f = "", g = 0;
  for (let k = 0, l, n; k < d; k++) {
    l = c[k], (n = a[l]) ? (e[g++] = G(b ? "(?!\\b)" + l + "(\\b|_)" : l), e[g++] = n) : f += (f ? "|" : "") + l;
  }
  f && (e[g++] = G(b ? "(?!\\b)(" + f + ")(\\b|_)" : "(" + f + ")"), e[g] = "");
  return e;
}
function E(a, b) {
  for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
function G(a) {
  return new RegExp(a, "g");
}
function F(a) {
  let b = "", c = "";
  for (let d = 0, e = a.length, f; d < e; d++) {
    (f = a[d]) !== c && (b += c = f);
  }
  return b;
}
;var ia = {encode:ha, rtl:!1, tokenize:""};
function ha(a) {
  return ca.call(this, a.toLowerCase(), !1, da, !1);
}
;const ja = {}, H = {};
function ka(a) {
  J(a, "add");
  J(a, "append");
  J(a, "search");
  J(a, "update");
  J(a, "remove");
}
function J(a, b) {
  a[b + "Async"] = function() {
    const c = this, d = arguments;
    var e = d[d.length - 1];
    let f;
    A(e) && (f = e, delete d[d.length - 1]);
    e = new Promise(function(g) {
      setTimeout(function() {
        c.async = !0;
        const k = c[b].apply(c, d);
        c.async = !1;
        g(k);
      });
    });
    return f ? (e.then(f), this) : e;
  };
}
;function la(a, b, c, d) {
  const e = a.length;
  let f = [], g, k, l = 0;
  d && (d = []);
  for (let n = e - 1; 0 <= n; n--) {
    const q = a[n], v = q.length, r = w();
    let p = !g;
    for (let m = 0; m < v; m++) {
      const u = q[m], z = u.length;
      if (z) {
        for (let D = 0, C, B; D < z; D++) {
          if (B = u[D], g) {
            if (g[B]) {
              if (!n) {
                if (c) {
                  c--;
                } else {
                  if (f[l++] = B, l === b) {
                    return f;
                  }
                }
              }
              if (n || d) {
                r[B] = 1;
              }
              p = !0;
            }
            if (d && (k[B] = (C = k[B]) ? ++C : C = 1, C < e)) {
              const I = d[C - 2] || (d[C - 2] = []);
              I[I.length] = B;
            }
          } else {
            r[B] = 1;
          }
        }
      }
    }
    if (d) {
      g || (k = r);
    } else {
      if (!p) {
        return [];
      }
    }
    g = r;
  }
  if (d) {
    for (let n = d.length - 1, q, v; 0 <= n; n--) {
      q = d[n];
      v = q.length;
      for (let r = 0, p; r < v; r++) {
        if (p = q[r], !g[p]) {
          if (c) {
            c--;
          } else {
            if (f[l++] = p, l === b) {
              return f;
            }
          }
          g[p] = 1;
        }
      }
    }
  }
  return f;
}
function ma(a, b) {
  const c = w(), d = w(), e = [];
  for (let f = 0; f < a.length; f++) {
    c[a[f]] = 1;
  }
  for (let f = 0, g; f < b.length; f++) {
    g = b[f];
    for (let k = 0, l; k < g.length; k++) {
      l = g[k], c[l] && !d[l] && (d[l] = 1, e[e.length] = l);
    }
  }
  return e;
}
;function K(a) {
  this.limit = !0 !== a && a;
  this.cache = w();
  this.queue = [];
}
function na(a, b, c) {
  y(a) && (a = a.query);
  let d = this.cache.get(a);
  d || (d = this.search(a, b, c), this.cache.set(a, d));
  return d;
}
K.prototype.set = function(a, b) {
  if (!this.cache[a]) {
    var c = this.queue.length;
    c === this.limit ? delete this.cache[this.queue[c - 1]] : c++;
    for (--c; 0 < c; c--) {
      this.queue[c] = this.queue[c - 1];
    }
    this.queue[0] = a;
  }
  this.cache[a] = b;
};
K.prototype.get = function(a) {
  const b = this.cache[a];
  if (this.limit && b && (a = this.queue.indexOf(a))) {
    const c = this.queue[a - 1];
    this.queue[a - 1] = this.queue[a];
    this.queue[a] = c;
  }
  return b;
};
K.prototype.del = function(a) {
  for (let b = 0, c, d; b < this.queue.length; b++) {
    d = this.queue[b], c = this.cache[d], -1 !== c.indexOf(a) && (this.queue.splice(b--, 1), delete this.cache[d]);
  }
};
const oa = {memory:{charset:"latin:extra", resolution:3, minlength:4, fastupdate:!1}, performance:{resolution:3, minlength:3, optimize:!1, context:{depth:2, resolution:1}}, match:{charset:"latin:extra", tokenize:"reverse", }, score:{charset:"latin:advanced", resolution:20, minlength:3, context:{depth:3, resolution:9, }}, "default":{}, };
function qa(a, b, c, d, e, f) {
  return h.asyncExecutePromiseGeneratorFunction(function*() {
    const g = a(c, JSON.stringify(f));
    g && g.then && (yield g);
    return yield b.export(a, b, c, d, e + 1);
  });
}
;function L(a, b) {
  if (!(this instanceof L)) {
    return new L(a);
  }
  var c;
  if (a) {
    if (x(a)) {
      oa[a] || console.warn("Preset not found: " + a), a = oa[a];
    } else {
      if (c = a.preset) {
        c[c] || console.warn("Preset not found: " + c), a = Object.assign({}, c[c], a);
      }
    }
    c = a.charset;
    var d = a.lang;
    x(c) && (-1 === c.indexOf(":") && (c += ":default"), c = H[c]);
    x(d) && (d = ja[d]);
  } else {
    a = {};
  }
  let e, f, g = a.context || {};
  this.encode = a.encode || c && c.encode || ha;
  this.register = b || w();
  this.resolution = e = a.resolution || 9;
  this.tokenize = b = c && c.tokenize || a.tokenize || "strict";
  this.depth = "strict" === b && g.depth;
  this.bidirectional = t(g.bidirectional, !0);
  this.optimize = f = t(a.optimize, !0);
  this.fastupdate = t(a.fastupdate, !0);
  this.minlength = a.minlength || 1;
  this.boost = a.boost;
  this.map = f ? aa(e) : w();
  this.resolution_ctx = e = g.resolution || 1;
  this.ctx = f ? aa(e) : w();
  this.rtl = c && c.rtl || a.rtl;
  this.matcher = (b = a.matcher || d && d.matcher) && fa(b, !1);
  this.stemmer = (b = a.stemmer || d && d.stemmer) && fa(b, !0);
  if (c = b = a.filter || d && d.filter) {
    c = b;
    d = w();
    for (let k = 0, l = c.length; k < l; k++) {
      d[c[k]] = 1;
    }
    c = d;
  }
  this.filter = c;
  this.cache = (b = a.cache) && new K(b);
}
L.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
L.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.register[a]) {
      return this.update(a, b);
    }
    b = this.encode(b);
    if (d = b.length) {
      const n = w(), q = w(), v = this.depth, r = this.resolution;
      for (let p = 0; p < d; p++) {
        let m = b[this.rtl ? d - 1 - p : p];
        var e = m.length;
        if (m && e >= this.minlength && (v || !q[m])) {
          var f = M(r, d, p), g = "";
          switch(this.tokenize) {
            case "full":
              if (3 < e) {
                for (f = 0; f < e; f++) {
                  for (var k = e; k > f; k--) {
                    if (k - f >= this.minlength) {
                      var l = M(r, d, p, e, f);
                      g = m.substring(f, k);
                      this.push_index(q, g, l, a, c);
                    }
                  }
                }
                break;
              }
            case "reverse":
              if (2 < e) {
                for (k = e - 1; 0 < k; k--) {
                  g = m[k] + g, g.length >= this.minlength && (l = M(r, d, p, e, k), this.push_index(q, g, l, a, c));
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (k = 0; k < e; k++) {
                  g += m[k], g.length >= this.minlength && this.push_index(q, g, f, a, c);
                }
                break;
              }
            default:
              if (this.boost && (f = Math.min(f / this.boost(b, m, p) | 0, r - 1)), this.push_index(q, m, f, a, c), v && 1 < d && p < d - 1) {
                for (e = w(), g = this.resolution_ctx, f = m, k = Math.min(v + 1, d - p), e[f] = 1, l = 1; l < k; l++) {
                  if ((m = b[this.rtl ? d - 1 - p - l : p + l]) && m.length >= this.minlength && !e[m]) {
                    e[m] = 1;
                    const u = M(g + (d / 2 > g ? 0 : 1), d, p, k - 1, l - 1), z = this.bidirectional && m > f;
                    this.push_index(n, z ? f : m, u, a, c, z ? m : f);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || (this.register[a] = 1);
    }
  }
  return this;
};
function M(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
L.prototype.push_index = function(a, b, c, d, e, f) {
  let g = f ? this.ctx : this.map;
  if (!a[b] || f && !a[b][f]) {
    this.optimize && (g = g[c]), f ? (a = a[b] || (a[b] = w()), a[f] = 1, g = g[f] || (g[f] = w())) : a[b] = 1, g = g[b] || (g[b] = []), this.optimize || (g = g[c] || (g[c] = [])), e && -1 !== g.indexOf(d) || (g[g.length] = d, this.fastupdate && (a = this.register[d] || (this.register[d] = []), a[a.length] = g));
  }
};
L.prototype.search = function(a, b, c) {
  c || (!b && y(a) ? (c = a, a = c.query) : y(b) && (c = b));
  let d = [], e;
  let f, g = 0;
  if (c) {
    b = c.limit;
    g = c.offset || 0;
    var k = c.context;
    f = c.suggest;
  }
  if (a && (a = this.encode(a), e = a.length, 1 < e)) {
    c = w();
    var l = [];
    for (let q = 0, v = 0, r; q < e; q++) {
      if ((r = a[q]) && r.length >= this.minlength && !c[r]) {
        if (this.optimize || f || this.map[r]) {
          l[v++] = r, c[r] = 1;
        } else {
          return d;
        }
      }
    }
    a = l;
    e = a.length;
  }
  if (!e) {
    return d;
  }
  b || (b = 100);
  k = this.depth && 1 < e && !1 !== k;
  c = 0;
  let n;
  k ? (n = a[0], c = 1) : 1 < e && a.sort(ba);
  for (let q, v; c < e; c++) {
    v = a[c];
    k ? (q = this.add_result(d, f, b, g, 2 === e, v, n), f && !1 === q && d.length || (n = v)) : q = this.add_result(d, f, b, g, 1 === e, v);
    if (q) {
      return q;
    }
    if (f && c === e - 1) {
      l = d.length;
      if (!l) {
        if (k) {
          k = 0;
          c = -1;
          continue;
        }
        return d;
      }
      if (1 === l) {
        return ra(d[0], b, g);
      }
    }
  }
  return la(d, b, g, f);
};
L.prototype.add_result = function(a, b, c, d, e, f, g) {
  let k = [], l = g ? this.ctx : this.map;
  this.optimize || (l = sa(l, f, g, this.bidirectional));
  if (l) {
    let n = 0;
    const q = Math.min(l.length, g ? this.resolution_ctx : this.resolution);
    for (let v = 0, r = 0, p, m; v < q; v++) {
      if (p = l[v]) {
        if (this.optimize && (p = sa(p, f, g, this.bidirectional)), d && p && e && (m = p.length, m <= d ? (d -= m, p = null) : (p = p.slice(d), d = 0)), p && (k[n++] = p, e && (r += p.length, r >= c))) {
          break;
        }
      }
    }
    if (n) {
      if (e) {
        return ra(k, c, 0);
      }
      a[a.length] = k;
      return;
    }
  }
  return !b && k;
};
function ra(a, b, c) {
  a = 1 === a.length ? a[0] : [].concat.apply([], a);
  return c || a.length > b ? a.slice(c, c + b) : a;
}
function sa(a, b, c, d) {
  c ? (d = d && b > c, a = (a = a[d ? b : c]) && a[d ? c : b]) : a = a[b];
  return a;
}
L.prototype.contain = function(a) {
  return !!this.register[a];
};
L.prototype.update = function(a, b) {
  return this.remove(a).add(a, b);
};
L.prototype.remove = function(a, b) {
  const c = this.register[a];
  if (c) {
    if (this.fastupdate) {
      for (let d = 0, e; d < c.length; d++) {
        e = c[d], e.splice(e.indexOf(a), 1);
      }
    } else {
      N(this.map, a, this.resolution, this.optimize), this.depth && N(this.ctx, a, this.resolution_ctx, this.optimize);
    }
    b || delete this.register[a];
    this.cache && this.cache.del(a);
  }
  return this;
};
function N(a, b, c, d, e) {
  let f = 0;
  if (a.constructor === Array) {
    if (e) {
      b = a.indexOf(b), -1 !== b ? 1 < a.length && (a.splice(b, 1), f++) : f++;
    } else {
      e = Math.min(a.length, c);
      for (let g = 0, k; g < e; g++) {
        if (k = a[g]) {
          f = N(k, b, c, d, e), d || f || delete a[g];
        }
      }
    }
  } else {
    for (let g in a) {
      (f = N(a[g], b, c, d, e)) || delete a[g];
    }
  }
  return f;
}
L.prototype.searchCache = na;
L.prototype.export = function(a, b, c, d, e) {
  const f = this;
  return h.asyncExecutePromiseGeneratorFunction(function*() {
    let g, k;
    switch(e || (e = 0)) {
      case 0:
        g = "reg";
        if (f.fastupdate) {
          k = w();
          for (let l in f.register) {
            k[l] = 1;
          }
        } else {
          k = f.register;
        }
        break;
      case 1:
        g = "cfg";
        k = {doc:0, opt:f.optimize ? 1 : 0};
        break;
      case 2:
        g = "map";
        k = f.map;
        break;
      case 3:
        g = "ctx";
        k = f.ctx;
        break;
      default:
        return !0;
    }
    return yield qa(a, b || f, c ? c + "." + g : g, d, e, k);
  });
};
L.prototype.import = function(a, b) {
  if (b) {
    switch(x(b) && (b = JSON.parse(b)), a) {
      case "cfg":
        this.optimize = !!b.opt;
        break;
      case "reg":
        this.fastupdate = !1;
        this.register = b;
        break;
      case "map":
        this.map = b;
        break;
      case "ctx":
        this.ctx = b;
    }
  }
};
ka(L.prototype);
function ta(a) {
  a = a.data;
  var b = self._index;
  const c = a.args;
  var d = a.task;
  switch(d) {
    case "init":
      d = a.options || {};
      a = a.factory;
      b = d.encode;
      d.cache = !1;
      b && 0 === b.indexOf("function") && (d.encode = Function("return " + b)());
      a ? (Function("return " + a)()(self), self._index = new self.FlexSearch.Index(d), delete self.FlexSearch) : self._index = new L(d);
      break;
    default:
      a = a.id, b = b[d].apply(b, c), postMessage("search" === d ? {id:a, msg:b} : {id:a});
  }
}
;let ua = 0;
function O(a) {
  if (!(this instanceof O)) {
    return new O(a);
  }
  var b;
  a ? A(b = a.encode) && (a.encode = b.toString()) : a = {};
  (b = (self || window)._factory) && (b = b.toString());
  const c = self.exports, d = this;
  this.worker = va(b, c, a.worker);
  this.resolver = w();
  if (this.worker) {
    if (c) {
      this.worker.on("message", function(e) {
        d.resolver[e.id](e.msg);
        delete d.resolver[e.id];
      });
    } else {
      this.worker.onmessage = function(e) {
        e = e.data;
        d.resolver[e.id](e.msg);
        delete d.resolver[e.id];
      };
    }
    this.worker.postMessage({task:"init", factory:b, options:a});
  }
}
P("add");
P("append");
P("search");
P("update");
P("remove");
function P(a) {
  O.prototype[a] = O.prototype[a + "Async"] = function() {
    const b = this, c = [].slice.call(arguments);
    var d = c[c.length - 1];
    let e;
    A(d) && (e = d, c.splice(c.length - 1, 1));
    d = new Promise(function(f) {
      setTimeout(function() {
        b.resolver[++ua] = f;
        b.worker.postMessage({task:a, id:ua, args:c});
      });
    });
    return e ? (d.then(e), this) : d;
  };
}
function va(a, b, c) {
  let d;
  try {
    d = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + ta.toString()], {type:"text/javascript"}))) : new Worker(x(c) ? c : "worker/worker.js", {type:"module"});
  } catch (e) {
  }
  return d;
}
;function R(a) {
  if (!(this instanceof R)) {
    return new R(a);
  }
  var b = a.document || a.doc || a, c;
  this.tree = [];
  this.field = [];
  this.marker = [];
  this.register = w();
  this.key = (c = b.key || b.id) && S(c, this.marker) || "id";
  this.fastupdate = t(a.fastupdate, !0);
  this.storetree = (c = b.store) && !0 !== c && [];
  this.store = c && w();
  this.tag = (c = b.tag) && S(c, this.marker);
  this.tagindex = c && w();
  this.cache = (c = a.cache) && new K(c);
  a.cache = !1;
  this.worker = a.worker;
  this.async = !1;
  c = w();
  let d = b.index || b.field || b;
  x(d) && (d = [d]);
  for (let e = 0, f, g; e < d.length; e++) {
    f = d[e], x(f) || (g = f, f = f.field), g = y(g) ? Object.assign({}, a, g) : a, this.worker && (c[f] = new O(g), c[f].worker || (this.worker = !1)), this.worker || (c[f] = new L(g, this.register)), this.tree[e] = S(f, this.marker), this.field[e] = f;
  }
  if (this.storetree) {
    for (a = b.store, x(a) && (a = [a]), b = 0; b < a.length; b++) {
      this.storetree[b] = S(a[b], this.marker);
    }
  }
  this.index = c;
}
function S(a, b) {
  const c = a.split(":");
  let d = 0;
  for (let e = 0; e < c.length; e++) {
    a = c[e], 0 <= a.indexOf("[]") && (a = a.substring(0, a.length - 2)) && (b[d] = !0), a && (c[d++] = a);
  }
  d < c.length && (c.length = d);
  return 1 < d ? c : c[0];
}
function T(a, b) {
  if (x(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function U(a, b, c, d, e) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = a;
  } else {
    if (a) {
      if (a.constructor === Array) {
        for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
          U(a, b, c, d, e);
        }
      } else {
        b = b[e] || (b[e] = w()), e = c[++d], U(a, b, c, d, e);
      }
    }
  }
}
function V(a, b, c, d, e, f, g, k) {
  if (a = a[g]) {
    if (d === b.length - 1) {
      if (a.constructor === Array) {
        if (c[d]) {
          for (b = 0; b < a.length; b++) {
            e.add(f, a[b], !0, !0);
          }
          return;
        }
        a = a.join(" ");
      }
      e.add(f, a, k, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          V(a, b, c, d, e, f, g, k);
        }
      } else {
        g = b[++d], V(a, b, c, d, e, f, g, k);
      }
    }
  }
}
R.prototype.add = function(a, b, c) {
  y(a) && (b = a, a = T(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.register[a]) {
      return this.update(a, b);
    }
    for (let d = 0, e, f; d < this.field.length; d++) {
      f = this.field[d], e = this.tree[d], x(e) && (e = [e]), V(b, e, this.marker, 0, this.index[f], a, e[0], c);
    }
    if (this.tag) {
      let d = T(b, this.tag), e = w();
      x(d) && (d = [d]);
      for (let f = 0, g, k; f < d.length; f++) {
        if (g = d[f], !e[g] && (e[g] = 1, k = this.tagindex[g] || (this.tagindex[g] = []), !c || -1 === k.indexOf(a))) {
          if (k[k.length] = a, this.fastupdate) {
            const l = this.register[a] || (this.register[a] = []);
            l[l.length] = k;
          }
        }
      }
    }
    if (this.store && (!c || !this.store[a])) {
      let d;
      if (this.storetree) {
        d = w();
        for (let e = 0, f; e < this.storetree.length; e++) {
          f = this.storetree[e], x(f) ? d[f] = b[f] : U(b, d, f, 0, f[0]);
        }
      }
      this.store[a] = d || b;
    }
  }
  return this;
};
R.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
R.prototype.update = function(a, b) {
  return this.remove(a).add(a, b);
};
R.prototype.remove = function(a) {
  y(a) && (a = T(a, this.key));
  if (this.register[a]) {
    for (var b = 0; b < this.field.length && (this.index[this.field[b]].remove(a, !this.worker), !this.fastupdate); b++) {
    }
    if (this.tag && !this.fastupdate) {
      for (let c in this.tagindex) {
        b = this.tagindex[c];
        const d = b.indexOf(a);
        -1 !== d && (1 < b.length ? b.splice(d, 1) : delete this.tagindex[c]);
      }
    }
    this.store && delete this.store[a];
    delete this.register[a];
  }
  return this;
};
R.prototype.search = function(a, b, c, d) {
  c || (!b && y(a) ? (c = a, a = c.query) : y(b) && (c = b, b = 0));
  let e = [], f = [], g, k, l, n, q, v, r = 0;
  if (c) {
    if (c.constructor === Array) {
      l = c, c = null;
    } else {
      l = (g = c.pluck) || c.index || c.field;
      n = c.tag;
      k = this.store && c.enrich;
      q = "and" === c.bool;
      b = c.limit || 100;
      v = c.offset || 0;
      if (n && (x(n) && (n = [n]), !a)) {
        for (let m = 0, u; m < n.length; m++) {
          if (u = wa.call(this, n[m], b, v, k)) {
            e[e.length] = u, r++;
          }
        }
        return r ? e : [];
      }
      x(l) && (l = [l]);
    }
  }
  l || (l = this.field);
  q = q && (1 < l.length || n && 1 < n.length);
  const p = !d && (this.worker || this.async) && [];
  for (let m = 0, u, z, D; m < l.length; m++) {
    let C;
    z = l[m];
    x(z) || (C = z, z = z.field);
    if (p) {
      p[m] = this.index[z].searchAsync(a, b, C || c);
    } else {
      D = (u = d ? d[m] : this.index[z].search(a, b, C || c)) && u.length;
      if (n && D) {
        const B = [];
        let I = 0;
        q && (B[0] = [u]);
        for (let X = 0, pa, Q; X < n.length; X++) {
          if (pa = n[X], D = (Q = this.tagindex[pa]) && Q.length) {
            I++, B[B.length] = q ? [Q] : Q;
          }
        }
        I && (u = q ? la(B, b || 100, v || 0) : ma(u, B), D = u.length);
      }
      if (D) {
        f[r] = z, e[r++] = u;
      } else {
        if (q) {
          return [];
        }
      }
    }
  }
  if (p) {
    const m = this;
    return new Promise(function(u) {
      Promise.all(p).then(function(z) {
        u(m.search(a, b, c, z));
      });
    });
  }
  if (!r) {
    return [];
  }
  if (g && (!k || !this.store)) {
    return e[0];
  }
  for (let m = 0, u; m < f.length; m++) {
    u = e[m];
    u.length && k && (u = xa.call(this, u));
    if (g) {
      return u;
    }
    e[m] = {field:f[m], result:u};
  }
  return e;
};
function wa(a, b, c, d) {
  let e = this.tagindex[a], f = e && e.length - c;
  if (f && 0 < f) {
    if (f > b || c) {
      e = e.slice(c, c + b);
    }
    d && (e = xa.call(this, e));
    return {tag:a, result:e};
  }
}
function xa(a) {
  const b = Array(a.length);
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {id:d, doc:this.store[d]};
  }
  return b;
}
R.prototype.contain = function(a) {
  return !!this.register[a];
};
R.prototype.get = function(a) {
  return this.store[a];
};
R.prototype.set = function(a, b) {
  this.store[a] = b;
  return this;
};
R.prototype.searchCache = na;
R.prototype.export = function(a, b, c, d, e) {
  const f = this;
  return h.asyncExecutePromiseGeneratorFunction(function*() {
    e || (e = 0);
    d || (d = 0);
    if (d < f.field.length) {
      var g = f.field[d], k = f.index[g];
      b = f;
      (yield k.export(a, b, e ? g.replace(":", "-") : "", d, e++)) || (d++, e = 1, yield b.export(a, b, g, d, e));
      return !0;
    }
    switch(e) {
      case 1:
        g = "tag";
        k = f.tagindex;
        break;
      case 2:
        g = "store";
        k = f.store;
        break;
      default:
        return Promise.resolve(!0);
    }
    return yield qa(a, f, g, d, e, k);
  });
};
R.prototype.import = function(a, b) {
  if (b) {
    switch(x(b) && (b = JSON.parse(b)), a) {
      case "tag":
        this.tagindex = b;
        break;
      case "reg":
        this.fastupdate = !1;
        this.register = b;
        for (let d = 0, e; d < this.field.length; d++) {
          e = this.index[this.field[d]], e.register = b, e.fastupdate = !1;
        }
        break;
      case "store":
        this.store = b;
        break;
      default:
        a = a.split(".");
        const c = a[0];
        a = a[1];
        c && a && this.index[c].import(a, b);
    }
  }
};
ka(R.prototype);
var za = {encode:ya, rtl:!1, tokenize:""};
const Aa = G("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), Ba = G("[\u00e8\u00e9\u00ea\u00eb]"), Ca = G("[\u00ec\u00ed\u00ee\u00ef]"), Da = G("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), Ea = G("[\u00f9\u00fa\u00fb\u00fc\u0171]"), Fa = G("[\u00fd\u0177\u00ff]"), Ga = G("\u00f1"), Ha = G("[\u00e7c]"), Ia = G("\u00df"), Ja = G(" & "), Ka = [Aa, "a", Ba, "e", Ca, "i", Da, "o", Ea, "u", Fa, "y", Ga, "n", Ha, "k", Ia, "s", Ja, " and "];
function ya(a) {
  var b = a = "" + a;
  b.normalize && (b = b.normalize("NFD").replace(ea, ""));
  return ca.call(this, b.toLowerCase(), !a.normalize && Ka, da, !1);
}
;var Ma = {encode:La, rtl:!1, tokenize:"strict"};
const Na = /[^a-z0-9]+/, Oa = {b:"p", v:"f", w:"f", z:"s", x:"s", "\u00df":"s", d:"t", n:"m", c:"k", g:"k", j:"k", q:"k", i:"e", y:"e", u:"o"};
function La(a) {
  a = ya.call(this, a).join(" ");
  const b = [];
  if (a) {
    const c = a.split(Na), d = c.length;
    for (let e = 0, f, g = 0; e < d; e++) {
      if ((a = c[e]) && (!this.filter || !this.filter[a])) {
        f = a[0];
        let k = Oa[f] || f, l = k;
        for (let n = 1; n < a.length; n++) {
          f = a[n];
          const q = Oa[f] || f;
          q && q !== l && (k += q, l = q);
        }
        b[g++] = k;
      }
    }
  }
  return b;
}
;var Qa = {encode:Pa, rtl:!1, tokenize:""};
const Ra = G("ae"), Sa = G("oe"), Ta = G("sh"), Ua = G("th"), Va = G("ph"), Wa = G("pf"), Xa = [Ra, "a", Sa, "o", Ta, "s", Ua, "t", Va, "f", Wa, "f", G("(?![aeo])h(?![aeo])"), "", G("(?!^[aeo])h(?!^[aeo])"), ""];
function Pa(a, b) {
  a && (a = La.call(this, a).join(" "), 2 < a.length && (a = E(a, Xa)), b || (1 < a.length && (a = F(a)), a && (a = a.split(" "))));
  return a;
}
;var Za = {encode:Ya, rtl:!1, tokenize:""};
const $a = G("(?!\\b)[aeo]");
function Ya(a) {
  a && (a = Pa.call(this, a, !0), 1 < a.length && (a = a.replace($a, "")), 1 < a.length && (a = F(a)), a && (a = a.split(" ")));
  return a;
}
;H["latin:default"] = ia;
H["latin:simple"] = za;
H["latin:balance"] = Ma;
H["latin:advanced"] = Qa;
H["latin:extra"] = Za;
const W = self;
let Y;
const Z = {Index:L, Document:R, Worker:O, registerCharset:function(a, b) {
  H[a] = b;
}, registerLanguage:function(a, b) {
  ja[a] = b;
}};
(Y = W.define) && Y.amd ? Y([], function() {
  return Z;
}) : W.exports ? W.exports = Z : W.FlexSearch = Z;
}(this));
