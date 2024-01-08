/**!
 * FlexSearch.js v0.7.41 (Es5)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var t;
function aa(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
}
var v = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  if (a == Array.prototype || a == Object.prototype) {
    return a;
  }
  a[b] = c.value;
  return a;
};
function ba(a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) {
      return c;
    }
  }
  throw Error("Cannot find global object");
}
var x = ba(this);
function y(a, b) {
  if (b) {
    a: {
      var c = x;
      a = a.split(".");
      for (var d = 0; d < a.length - 1; d++) {
        var e = a[d];
        if (!(e in c)) {
          break a;
        }
        c = c[e];
      }
      a = a[a.length - 1];
      d = c[a];
      b = b(d);
      b != d && null != b && v(c, a, {configurable:!0, writable:!0, value:b});
    }
  }
}
y("Symbol", function(a) {
  function b(g) {
    if (this instanceof b) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new c(d + (g || "") + "_" + e++, g);
  }
  function c(g, f) {
    this.h = g;
    v(this, "description", {configurable:!0, writable:!0, value:f});
  }
  if (a) {
    return a;
  }
  c.prototype.toString = function() {
    return this.h;
  };
  var d = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_", e = 0;
  return b;
});
y("Symbol.iterator", function(a) {
  if (a) {
    return a;
  }
  a = Symbol("Symbol.iterator");
  for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
    var d = x[b[c]];
    "function" === typeof d && "function" != typeof d.prototype[a] && v(d.prototype, a, {configurable:!0, writable:!0, value:function() {
      return ca(aa(this));
    }});
  }
  return a;
});
function ca(a) {
  a = {next:a};
  a[Symbol.iterator] = function() {
    return this;
  };
  return a;
}
function da(a, b) {
  a instanceof String && (a += "");
  var c = 0, d = !1, e = {next:function() {
    if (!d && c < a.length) {
      var g = c++;
      return {value:b(g, a[g]), done:!1};
    }
    d = !0;
    return {done:!0, value:void 0};
  }};
  e[Symbol.iterator] = function() {
    return e;
  };
  return e;
}
y("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return da(this, function(b) {
      return b;
    });
  };
});
function ea(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (b) {
    return b.call(a);
  }
  if ("number" == typeof a.length) {
    return {next:aa(a)};
  }
  throw Error(String(a) + " is not an iterable or ArrayLike");
}
y("Promise", function(a) {
  function b(f) {
    this.l = 0;
    this.m = void 0;
    this.h = [];
    this.M = !1;
    var h = this.o();
    try {
      f(h.resolve, h.reject);
    } catch (k) {
      h.reject(k);
    }
  }
  function c() {
    this.h = null;
  }
  function d(f) {
    return f instanceof b ? f : new b(function(h) {
      h(f);
    });
  }
  if (a) {
    return a;
  }
  c.prototype.l = function(f) {
    if (null == this.h) {
      this.h = [];
      var h = this;
      this.m(function() {
        h.D();
      });
    }
    this.h.push(f);
  };
  var e = x.setTimeout;
  c.prototype.m = function(f) {
    e(f, 0);
  };
  c.prototype.D = function() {
    for (; this.h && this.h.length;) {
      var f = this.h;
      this.h = [];
      for (var h = 0; h < f.length; ++h) {
        var k = f[h];
        f[h] = null;
        try {
          k();
        } catch (l) {
          this.o(l);
        }
      }
    }
    this.h = null;
  };
  c.prototype.o = function(f) {
    this.m(function() {
      throw f;
    });
  };
  b.prototype.o = function() {
    function f(l) {
      return function(m) {
        k || (k = !0, l.call(h, m));
      };
    }
    var h = this, k = !1;
    return {resolve:f(this.S), reject:f(this.D)};
  };
  b.prototype.S = function(f) {
    if (f === this) {
      this.D(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (f instanceof b) {
        this.U(f);
      } else {
        a: {
          switch(typeof f) {
            case "object":
              var h = null != f;
              break a;
            case "function":
              h = !0;
              break a;
            default:
              h = !1;
          }
        }
        h ? this.R(f) : this.I(f);
      }
    }
  };
  b.prototype.R = function(f) {
    var h = void 0;
    try {
      h = f.then;
    } catch (k) {
      this.D(k);
      return;
    }
    "function" == typeof h ? this.V(h, f) : this.I(f);
  };
  b.prototype.D = function(f) {
    this.N(2, f);
  };
  b.prototype.I = function(f) {
    this.N(1, f);
  };
  b.prototype.N = function(f, h) {
    if (0 != this.l) {
      throw Error("Cannot settle(" + f + ", " + h + "): Promise already settled in state" + this.l);
    }
    this.l = f;
    this.m = h;
    2 === this.l && this.T();
    this.O();
  };
  b.prototype.T = function() {
    var f = this;
    e(function() {
      if (f.P()) {
        var h = x.console;
        "undefined" !== typeof h && h.error(f.m);
      }
    }, 1);
  };
  b.prototype.P = function() {
    if (this.M) {
      return !1;
    }
    var f = x.CustomEvent, h = x.Event, k = x.dispatchEvent;
    if ("undefined" === typeof k) {
      return !0;
    }
    "function" === typeof f ? f = new f("unhandledrejection", {cancelable:!0}) : "function" === typeof h ? f = new h("unhandledrejection", {cancelable:!0}) : (f = x.document.createEvent("CustomEvent"), f.initCustomEvent("unhandledrejection", !1, !0, f));
    f.promise = this;
    f.reason = this.m;
    return k(f);
  };
  b.prototype.O = function() {
    if (null != this.h) {
      for (var f = 0; f < this.h.length; ++f) {
        g.l(this.h[f]);
      }
      this.h = null;
    }
  };
  var g = new c();
  b.prototype.U = function(f) {
    var h = this.o();
    f.J(h.resolve, h.reject);
  };
  b.prototype.V = function(f, h) {
    var k = this.o();
    try {
      f.call(h, k.resolve, k.reject);
    } catch (l) {
      k.reject(l);
    }
  };
  b.prototype.then = function(f, h) {
    function k(n, q) {
      return "function" == typeof n ? function(r) {
        try {
          l(n(r));
        } catch (u) {
          m(u);
        }
      } : q;
    }
    var l, m, p = new b(function(n, q) {
      l = n;
      m = q;
    });
    this.J(k(f, l), k(h, m));
    return p;
  };
  b.prototype.catch = function(f) {
    return this.then(void 0, f);
  };
  b.prototype.J = function(f, h) {
    function k() {
      switch(l.l) {
        case 1:
          f(l.m);
          break;
        case 2:
          h(l.m);
          break;
        default:
          throw Error("Unexpected state: " + l.l);
      }
    }
    var l = this;
    null == this.h ? g.l(k) : this.h.push(k);
    this.M = !0;
  };
  b.resolve = d;
  b.reject = function(f) {
    return new b(function(h, k) {
      k(f);
    });
  };
  b.race = function(f) {
    return new b(function(h, k) {
      for (var l = ea(f), m = l.next(); !m.done; m = l.next()) {
        d(m.value).J(h, k);
      }
    });
  };
  b.all = function(f) {
    var h = ea(f), k = h.next();
    return k.done ? d([]) : new b(function(l, m) {
      function p(r) {
        return function(u) {
          n[r] = u;
          q--;
          0 == q && l(n);
        };
      }
      var n = [], q = 0;
      do {
        n.push(void 0), q++, d(k.value).J(p(n.length - 1), m), k = h.next();
      } while (!k.done);
    });
  };
  return b;
});
y("Object.is", function(a) {
  return a ? a : function(b, c) {
    return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
  };
});
y("Array.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    var d = this;
    d instanceof String && (d = String(d));
    var e = d.length;
    c = c || 0;
    for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
      var g = d[c];
      if (g === b || Object.is(g, b)) {
        return !0;
      }
    }
    return !1;
  };
});
y("String.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    if (null == this) {
      throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");
    }
    if (b instanceof RegExp) {
      throw new TypeError("First argument to String.prototype.includes must not be a regular expression");
    }
    return -1 !== this.indexOf(b, c || 0);
  };
});
var fa = "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var d = arguments[c];
    if (d) {
      for (var e in d) {
        Object.prototype.hasOwnProperty.call(d, e) && (a[e] = d[e]);
      }
    }
  }
  return a;
};
y("Object.assign", function(a) {
  return a || fa;
});
function C(a) {
  return "undefined" !== typeof a ? a : !0;
}
function ha(a) {
  for (var b = Array(a), c = 0; c < a; c++) {
    b[c] = D();
  }
  return b;
}
function D() {
  return Object.create(null);
}
function ia(a, b) {
  return b.length - a.length;
}
function E(a) {
  return "string" === typeof a;
}
function F(a) {
  return "object" === typeof a;
}
function G(a) {
  return "function" === typeof a;
}
;function ja(a, b) {
  var c = ka;
  if (a && (b && (a = I(a, b)), this.K && (a = I(a, this.K)), this.L && 1 < a.length && (a = I(a, this.L)), c || "" === c)) {
    a = a.split(c);
    if (this.filter) {
      b = this.filter;
      c = a.length;
      for (var d = [], e = 0, g = 0; e < c; e++) {
        var f = a[e];
        f && !b[f] && (d[g++] = f);
      }
      a = d;
    }
    return a;
  }
  return a;
}
var ka = /[\p{Z}\p{S}\p{P}\p{C}]+/u, la = /[\u0300-\u036f]/g;
function ma(a, b) {
  for (var c = Object.keys(a), d = c.length, e = [], g = "", f = 0, h = 0, k, l; h < d; h++) {
    k = c[h], (l = a[k]) ? (e[f++] = J(b ? "(?!\\b)" + k + "(\\b|_)" : k), e[f++] = l) : g += (g ? "|" : "") + k;
  }
  g && (e[f++] = J(b ? "(?!\\b)(" + g + ")(\\b|_)" : "(" + g + ")"), e[f] = "");
  return e;
}
function I(a, b) {
  for (var c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
function J(a) {
  return new RegExp(a, "g");
}
function na(a) {
  for (var b = "", c = "", d = 0, e = a.length, g = void 0; d < e; d++) {
    (g = a[d]) !== c && (b += c = g);
  }
  return b;
}
;var pa = {encode:oa, G:!1, H:""};
function oa(a) {
  return ja.call(this, ("" + a).toLowerCase(), !1);
}
;var qa = {}, K = {};
function ra(a) {
  L(a, "add");
  L(a, "append");
  L(a, "search");
  L(a, "update");
  L(a, "remove");
}
function L(a, b) {
  a[b + "Async"] = function() {
    var c = this, d = arguments, e = d[d.length - 1];
    if (G(e)) {
      var g = e;
      delete d[d.length - 1];
    }
    e = new Promise(function(f) {
      setTimeout(function() {
        c.async = !0;
        var h = c[b].apply(c, d);
        c.async = !1;
        f(h);
      });
    });
    return g ? (e.then(g), this) : e;
  };
}
;function sa(a, b, c, d) {
  var e = a.length, g = [], f, h = 0;
  d && (d = []);
  for (var k = e - 1; 0 <= k; k--) {
    for (var l = a[k], m = l.length, p = D(), n = !B, q = 0; q < m; q++) {
      var r = l[q], u = r.length;
      if (u) {
        for (var A = 0, w, z; A < u; A++) {
          if (z = r[A], B) {
            if (B[z]) {
              if (!k) {
                if (c) {
                  c--;
                } else {
                  if (g[h++] = z, h === b) {
                    return g;
                  }
                }
              }
              if (k || d) {
                p[z] = 1;
              }
              n = !0;
            }
            d && (w = (f[z] || 0) + 1, f[z] = w, w < e && (w = d[w - 2] || (d[w - 2] = []), w[w.length] = z));
          } else {
            p[z] = 1;
          }
        }
      }
    }
    if (d) {
      B || (f = p);
    } else if (!n) {
      return [];
    }
    var B = p;
  }
  if (d) {
    for (a = d.length - 1; 0 <= a; a--) {
      for (e = d[a], f = e.length, k = 0; k < f; k++) {
        if (l = e[k], !B[l]) {
          if (c) {
            c--;
          } else {
            if (g[h++] = l, h === b) {
              return g;
            }
          }
          B[l] = 1;
        }
      }
    }
  }
  return g;
}
function ta(a, b) {
  for (var c = D(), d = D(), e = [], g = 0; g < a.length; g++) {
    c[a[g]] = 1;
  }
  for (a = 0; a < b.length; a++) {
    g = b[a];
    for (var f = 0, h; f < g.length; f++) {
      h = g[f], c[h] && !d[h] && (d[h] = 1, e[e.length] = h);
    }
  }
  return e;
}
;function M(a) {
  this.l = !0 !== a && a;
  this.cache = D();
  this.h = [];
}
function ua(a, b, c) {
  F(a) && (a = a.query);
  var d = this.cache.get(a);
  d || (d = this.search(a, b, c), this.cache.set(a, d));
  return d;
}
M.prototype.set = function(a, b) {
  if (!this.cache[a]) {
    var c = this.h.length;
    c === this.l ? delete this.cache[this.h[c - 1]] : c++;
    for (--c; 0 < c; c--) {
      this.h[c] = this.h[c - 1];
    }
    this.h[0] = a;
  }
  this.cache[a] = b;
};
M.prototype.get = function(a) {
  var b = this.cache[a];
  if (this.l && b && (a = this.h.indexOf(a))) {
    var c = this.h[a - 1];
    this.h[a - 1] = this.h[a];
    this.h[a] = c;
  }
  return b;
};
var va = {memory:{charset:"latin:extra", F:3, C:4, s:!1}, performance:{F:3, C:3, B:!1, context:{depth:2, F:1}}, match:{charset:"latin:extra", H:"reverse"}, score:{charset:"latin:advanced", F:20, C:3, context:{depth:3, F:9}}, "default":{}};
function wa(a, b, c, d, e, g, f, h) {
  setTimeout(function() {
    var k = a(c ? c + "." + d : d, JSON.stringify(f));
    k && k.then ? k.then(function() {
      b.export(a, b, c, e, g + 1, h);
    }) : b.export(a, b, c, e, g + 1, h);
  });
}
;function N(a, b) {
  if (!(this instanceof N)) {
    return new N(a);
  }
  var c;
  if (a) {
    if (E(a)) {
      va[a] || console.warn("Preset not found: " + a), a = va[a];
    } else {
      if (c = a.preset) {
        c[c] || console.warn("Preset not found: " + c), a = Object.assign({}, c[c], a);
      }
    }
    c = a.charset;
    var d = a.lang;
    E(c) && (-1 === c.indexOf(":") && (c += ":default"), c = K[c]);
    E(d) && (d = qa[d]);
  } else {
    a = {};
  }
  var e, g, f = a.context || {};
  this.encode = a.encode || c && c.encode || oa;
  this.register = b || D();
  this.F = e = a.resolution || 9;
  this.H = b = c && c.H || a.tokenize || "strict";
  this.depth = "strict" === b && f.depth;
  this.l = C(f.bidirectional);
  this.B = g = C(a.optimize);
  this.s = C(a.fastupdate);
  this.C = a.minlength || 1;
  this.o = a.boost;
  this.map = g ? ha(e) : D();
  this.m = e = f.resolution || 1;
  this.h = g ? ha(e) : D();
  this.G = c && c.G || a.rtl;
  this.K = (b = a.matcher || d && d.K) && ma(b, !1);
  this.L = (b = a.stemmer || d && d.L) && ma(b, !0);
  if (c = b = a.filter || d && d.filter) {
    c = b;
    d = D();
    f = 0;
    for (e = c.length; f < e; f++) {
      d[c[f]] = 1;
    }
    c = d;
  }
  this.filter = c;
  this.cache = (b = a.cache) && new M(b);
}
t = N.prototype;
t.append = function(a, b) {
  return this.add(a, b, !0);
};
t.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.register[a]) {
      return this.update(a, b);
    }
    b = this.encode(b);
    if (d = b.length) {
      for (var e = D(), g = D(), f = this.depth, h = this.F, k = 0; k < d; k++) {
        var l = b[this.G ? d - 1 - k : k], m = l.length;
        if (l && m >= this.C && (f || !g[l])) {
          var p = O(h, d, k), n = "";
          switch(this.H) {
            case "full":
              if (2 < m) {
                for (p = 0; p < m; p++) {
                  for (var q = m; q > p; q--) {
                    if (q - p >= this.C) {
                      var r = O(h, d, k, m, p);
                      n = l.substring(p, q);
                      P(this, g, n, r, a, c);
                    }
                  }
                }
                break;
              }
            case "reverse":
              if (1 < m) {
                for (q = m - 1; 0 < q; q--) {
                  n = l[q] + n, n.length >= this.C && P(this, g, n, O(h, d, k, m, q), a, c);
                }
                n = "";
              }
            case "forward":
              if (1 < m) {
                for (q = 0; q < m; q++) {
                  n += l[q], n.length >= this.C && P(this, g, n, p, a, c);
                }
                break;
              }
            default:
              if (this.o && (p = Math.min(p / this.o(b, l, k) | 0, h - 1)), P(this, g, l, p, a, c), f && 1 < d && k < d - 1) {
                for (m = D(), n = this.m, p = l, q = Math.min(f + 1, d - k), r = m[p] = 1; r < q; r++) {
                  if ((l = b[this.G ? d - 1 - k - r : k + r]) && l.length >= this.C && !m[l]) {
                    m[l] = 1;
                    var u = this.l && l > p;
                    P(this, e, u ? p : l, O(n + (d / 2 > n ? 0 : 1), d, k, q - 1, r - 1), a, c, u ? l : p);
                  }
                }
              }
          }
        }
      }
      this.s || (this.register[a] = 1);
    }
  }
  return this;
};
function O(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
function P(a, b, c, d, e, g, f) {
  var h = f ? a.h : a.map;
  if (!b[c] || f && !b[c][f]) {
    a.B && (h = h[d]), f ? (b = b[c] || (b[c] = D()), b[f] = 1, h = h[f] || (h[f] = D())) : b[c] = 1, h = h[c] || (h[c] = []), a.B || (h = h[d] || (h[d] = [])), g && h.includes(e) || (h[h.length] = e, a.s && (a = a.register[e] || (a.register[e] = []), a[a.length] = h));
  }
}
t.search = function(a, b, c) {
  c || (!b && F(a) ? (c = a, a = c.query) : F(b) && (c = b));
  var d = [], e = 0;
  if (c) {
    a = c.query || a;
    b = c.limit;
    e = c.offset || 0;
    var g = c.context;
    var f = c.suggest;
  }
  if (a) {
    a = this.encode("" + a);
    var h = a.length;
    if (1 < h) {
      c = D();
      for (var k = [], l = 0, m = 0, p; l < h; l++) {
        if ((p = a[l]) && p.length >= this.C && !c[p]) {
          if (this.B || f || this.map[p]) {
            k[m++] = p, c[p] = 1;
          } else {
            return d;
          }
        }
      }
      a = k;
      h = a.length;
    }
  }
  if (!h) {
    return d;
  }
  b || (b = 100);
  g = this.depth && 1 < h && !1 !== g;
  c = 0;
  if (g) {
    var n = a[0];
    c = 1;
  } else {
    1 < h && a.sort(ia);
  }
  for (; c < h; c++) {
    l = a[c];
    g ? (k = xa(this, d, f, b, e, 2 === h, l, n), f && !1 === k && d.length || (n = l)) : k = xa(this, d, f, b, e, 1 === h, l);
    if (k) {
      return k;
    }
    if (f && c === h - 1) {
      k = d.length;
      if (!k) {
        if (g) {
          g = 0;
          c = -1;
          continue;
        }
        return d;
      }
      if (1 === k) {
        return ya(d[0], b, e);
      }
    }
  }
  return sa(d, b, e, f);
};
function xa(a, b, c, d, e, g, f, h) {
  var k = [], l = h ? a.h : a.map;
  a.B || (l = za(l, f, h, a.l));
  if (l) {
    for (var m = 0, p = Math.min(l.length, h ? a.m : a.F), n = 0, q = 0, r, u; n < p; n++) {
      if (r = l[n]) {
        if (a.B && (r = za(r, f, h, a.l)), e && r && g && (u = r.length, u <= e ? (e -= u, r = null) : (r = r.slice(e), e = 0)), r && (k[m++] = r, g && (q += r.length, q >= d))) {
          break;
        }
      }
    }
    if (m) {
      if (g) {
        return ya(k, d, 0);
      }
      b[b.length] = k;
      return;
    }
  }
  return !c && k;
}
function ya(a, b, c) {
  a = 1 === a.length ? a[0] : [].concat.apply([], a);
  return c || a.length > b ? a.slice(c, c + b) : a;
}
function za(a, b, c, d) {
  c ? (d = d && b > c, a = (a = a[d ? b : c]) && a[d ? c : b]) : a = a[b];
  return a;
}
t.contain = function(a) {
  return !!this.register[a];
};
t.update = function(a, b) {
  return this.remove(a).add(a, b);
};
t.remove = function(a, b) {
  var c = this.register[a];
  if (c) {
    if (this.s) {
      for (var d = 0, e; d < c.length; d++) {
        e = c[d], e.splice(e.indexOf(a), 1);
      }
    } else {
      Q(this.map, a, this.F, this.B), this.depth && Q(this.h, a, this.m, this.B);
    }
    b || delete this.register[a];
    if (this.cache) {
      for (b = this.cache, c = 0; c < b.h.length; c++) {
        e = b.h[c], d = b.cache[e], d.includes(a) && (b.h.splice(c--, 1), delete b.cache[e]);
      }
    }
  }
  return this;
};
function Q(a, b, c, d, e) {
  var g = 0;
  if (a.constructor === Array) {
    if (e) {
      b = a.indexOf(b), -1 !== b ? 1 < a.length && (a.splice(b, 1), g++) : g++;
    } else {
      e = Math.min(a.length, c);
      for (var f = 0, h; f < e; f++) {
        if (h = a[f]) {
          g = Q(h, b, c, d, e), d || g || delete a[f];
        }
      }
    }
  } else {
    for (f in a) {
      (g = Q(a[f], b, c, d, e)) || delete a[f];
    }
  }
  return g;
}
t.searchCache = ua;
t.export = function(a, b, c, d, e, g) {
  var f = !0;
  "undefined" === typeof g && (f = new Promise(function(m) {
    g = m;
  }));
  switch(e || (e = 0)) {
    case 0:
      var h = "reg";
      if (this.s) {
        var k = D();
        for (var l in this.register) {
          k[l] = 1;
        }
      } else {
        k = this.register;
      }
      break;
    case 1:
      h = "cfg";
      k = {doc:0, opt:this.B ? 1 : 0};
      break;
    case 2:
      h = "map";
      k = this.map;
      break;
    case 3:
      h = "ctx";
      k = this.h;
      break;
    default:
      "undefined" === typeof c && g && g();
      return;
  }
  wa(a, b || this, c, h, d, e, k, g);
  return f;
};
t.import = function(a, b) {
  if (b) {
    switch(E(b) && (b = JSON.parse(b)), a) {
      case "cfg":
        this.B = !!b.opt;
        break;
      case "reg":
        this.s = !1;
        this.register = b;
        break;
      case "map":
        this.map = b;
        break;
      case "ctx":
        this.h = b;
    }
  }
};
ra(N.prototype);
function Aa(a) {
  a = a.data;
  var b = self._index, c = a.args, d = a.task;
  switch(d) {
    case "init":
      d = a.options || {};
      a = a.factory;
      b = d.encode;
      d.cache = !1;
      b && 0 === b.indexOf("function") && (d.encode = Function("return " + b)());
      a ? (Function("return " + a)()(self), self._index = new self.FlexSearch.Index(d), delete self.FlexSearch) : self._index = new N(d);
      break;
    default:
      a = a.id, b = b[d].apply(b, c), postMessage("search" === d ? {id:a, msg:b} : {id:a});
  }
}
;var Ba = 0;
function R(a) {
  if (!(this instanceof R)) {
    return new R(a);
  }
  var b;
  a ? G(b = a.encode) && (a.encode = b.toString()) : a = {};
  (b = (self || window)._factory) && (b = b.toString());
  var c = "undefined" === typeof window && self.exports, d = this;
  this.A = Ca(b, c, a.worker);
  this.h = D();
  if (this.A) {
    if (c) {
      this.A.on("message", function(e) {
        d.h[e.id](e.msg);
        delete d.h[e.id];
      });
    } else {
      this.A.onmessage = function(e) {
        e = e.data;
        d.h[e.id](e.msg);
        delete d.h[e.id];
      };
    }
    this.A.postMessage({task:"init", factory:b, options:a});
  }
}
S("add");
S("append");
S("search");
S("update");
S("remove");
function S(a) {
  R.prototype[a] = R.prototype[a + "Async"] = function() {
    var b = this, c = [].slice.call(arguments), d = c[c.length - 1];
    if (G(d)) {
      var e = d;
      c.splice(c.length - 1, 1);
    }
    d = new Promise(function(g) {
      setTimeout(function() {
        b.h[++Ba] = g;
        b.A.postMessage({task:a, id:Ba, args:c});
      });
    });
    return e ? (d.then(e), this) : d;
  };
}
function Ca(a, b, c) {
  try {
    var d = b ? new (require("worker_threads")["Worker"])(__dirname + "/node/node.js") : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + Aa.toString()], {type:"text/javascript"}))) : new Worker(E(c) ? c : "worker/worker.js", {type:"module"});
  } catch (e) {
  }
  return d;
}
;function T(a) {
  if (!(this instanceof T)) {
    return new T(a);
  }
  var b = a.document || a.doc || a, c;
  this.I = [];
  this.h = [];
  this.m = [];
  this.register = D();
  this.key = (c = b.key || b.id) && U(c, this.m) || "id";
  this.s = C(a.fastupdate);
  this.o = (c = b.store) && !0 !== c && [];
  this.store = c && D();
  this.D = (c = b.tag) && U(c, this.m);
  this.l = c && D();
  this.cache = (c = a.cache) && new M(c);
  a.cache = !1;
  this.A = a.worker;
  this.async = !1;
  c = D();
  var d = b.index || b.field || b;
  E(d) && (d = [d]);
  for (var e = 0, g, f = void 0; e < d.length; e++) {
    g = d[e], E(g) || (f = g, g = g.field), f = F(f) ? Object.assign({}, a, f) : a, this.A && (c[g] = new R(f), c[g].A || (this.A = !1)), this.A || (c[g] = new N(f, this.register)), this.I[e] = U(g, this.m), this.h[e] = g;
  }
  if (this.o) {
    for (a = b.store, E(a) && (a = [a]), b = 0; b < a.length; b++) {
      this.o[b] = U(a[b], this.m);
    }
  }
  this.index = c;
}
function U(a, b) {
  for (var c = a.split(":"), d = 0, e = 0; e < c.length; e++) {
    a = c[e], 0 <= a.indexOf("[]") && (a = a.substring(0, a.length - 2)) && (b[d] = !0), a && (c[d++] = a);
  }
  d < c.length && (c.length = d);
  return 1 < d ? c : c[0];
}
function V(a, b) {
  if (E(b)) {
    a = a[b];
  } else {
    for (var c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function W(a, b, c, d, e) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
        W(a, b, c, d, e);
      }
    } else {
      b = b[e] || (b[e] = D()), e = c[++d], W(a, b, c, d, e);
    }
  }
}
function X(a, b, c, d, e, g, f, h) {
  if (a = a[f]) {
    if (d === b.length - 1) {
      if (a.constructor === Array) {
        if (c[d]) {
          for (b = 0; b < a.length; b++) {
            e.add(g, a[b], !0, !0);
          }
          return;
        }
        a = a.join(" ");
      }
      e.add(g, a, h, !0);
    } else {
      if (a.constructor === Array) {
        for (f = 0; f < a.length; f++) {
          X(a, b, c, d, e, g, f, h);
        }
      } else {
        f = b[++d], X(a, b, c, d, e, g, f, h);
      }
    }
  }
}
t = T.prototype;
t.add = function(a, b, c) {
  F(a) && (b = a, a = V(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.register[a]) {
      return this.update(a, b);
    }
    for (var d = 0, e, g; d < this.h.length; d++) {
      g = this.h[d], e = this.I[d], E(e) && (e = [e]), X(b, e, this.m, 0, this.index[g], a, e[0], c);
    }
    if (this.D) {
      d = V(b, this.D);
      e = D();
      E(d) && (d = [d]);
      g = 0;
      for (var f; g < d.length; g++) {
        if (f = d[g], !e[f] && (e[f] = 1, f = this.l[f] || (this.l[f] = []), !c || !f.includes(a))) {
          if (f[f.length] = a, this.s) {
            var h = this.register[a] || (this.register[a] = []);
            h[h.length] = f;
          }
        }
      }
    }
    if (this.store && (!c || !this.store[a])) {
      if (this.o) {
        var k = D();
        for (c = 0; c < this.o.length; c++) {
          d = this.o[c], E(d) ? k[d] = b[d] : W(b, k, d, 0, d[0]);
        }
      }
      this.store[a] = k || b;
    }
  }
  return this;
};
t.append = function(a, b) {
  return this.add(a, b, !0);
};
t.update = function(a, b) {
  return this.remove(a).add(a, b);
};
t.remove = function(a) {
  F(a) && (a = V(a, this.key));
  if (this.register[a]) {
    for (var b = 0; b < this.h.length && (this.index[this.h[b]].remove(a, !this.A), !this.s); b++) {
    }
    if (this.D && !this.s) {
      for (var c in this.l) {
        b = this.l[c];
        var d = b.indexOf(a);
        -1 !== d && (1 < b.length ? b.splice(d, 1) : delete this.l[c]);
      }
    }
    this.store && delete this.store[a];
    delete this.register[a];
  }
  return this;
};
t.search = function(a, b, c, d) {
  c || (!b && F(a) ? (c = a, a = "") : F(b) && (c = b, b = 0));
  var e = [], g = [], f, h = 0;
  if (c) {
    if (c.constructor === Array) {
      var k = c;
      c = null;
    } else {
      a = c.query || a;
      k = (f = c.pluck) || c.index || c.field;
      var l = c.tag;
      var m = this.store && c.enrich;
      var p = "and" === c.bool;
      b = c.limit || b || 100;
      var n = c.offset || 0;
      if (l && (E(l) && (l = [l]), !a)) {
        g = 0;
        for (f = void 0; g < l.length; g++) {
          if (f = Da.call(this, l[g], b, n, m)) {
            e[e.length] = f, h++;
          }
        }
        return h ? e : [];
      }
      E(k) && (k = [k]);
    }
  }
  k || (k = this.h);
  p = p && (1 < k.length || l && 1 < l.length);
  for (var q = !d && (this.A || this.async) && [], r = 0, u = void 0, A = void 0, w = void 0; r < k.length; r++) {
    if (w = void 0, A = k[r], E(A) || (w = A, A = w.field, a = w.query || a, b = w.limit || b, m = w.enrich || m), q) {
      q[r] = this.index[A].searchAsync(a, b, w || c);
    } else {
      d ? u = d[r] : u = this.index[A].search(a, b, w || c);
      w = u && u.length;
      if (l && w) {
        var z = [], B = 0;
        p && (z[0] = [u]);
        var Y = 0, H = void 0;
        for (H = void 0; Y < l.length; Y++) {
          if (H = l[Y], w = (H = this.l[H]) && H.length) {
            B++, z[z.length] = p ? [H] : H;
          }
        }
        B && (u = p ? sa(z, b || 100, n || 0) : ta(u, z), w = u.length);
      }
      if (w) {
        g[h] = A, e[h++] = u;
      } else if (p) {
        return [];
      }
    }
  }
  if (q) {
    var Ka = this;
    return new Promise(function(La) {
      Promise.all(q).then(function(Ma) {
        La(Ka.search(a, b, c, Ma));
      });
    });
  }
  if (!h) {
    return [];
  }
  if (f && (!m || !this.store)) {
    return e[0];
  }
  l = 0;
  for (n = void 0; l < g.length; l++) {
    n = e[l];
    n.length && m && (n = Ea.call(this, n));
    if (f) {
      return n;
    }
    e[l] = {field:g[l], result:n};
  }
  return e;
};
function Da(a, b, c, d) {
  var e = this.l[a], g = e && e.length - c;
  if (g && 0 < g) {
    if (g > b || c) {
      e = e.slice(c, c + b);
    }
    d && (e = Ea.call(this, e));
    return {tag:a, result:e};
  }
}
function Ea(a) {
  for (var b = Array(a.length), c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {id:d, doc:this.store[d]};
  }
  return b;
}
t.contain = function(a) {
  return !!this.register[a];
};
t.get = function(a) {
  return this.store[a];
};
t.set = function(a, b) {
  this.store[a] = b;
  return this;
};
t.searchCache = ua;
t.export = function(a, b, c, d, e, g) {
  var f;
  "undefined" === typeof g && (f = new Promise(function(p) {
    g = p;
  }));
  e || (e = 0);
  d || (d = 0);
  if (d < this.h.length) {
    var h = this.h[d], k = this.index[h];
    b = this;
    setTimeout(function() {
      k.export(a, b, e ? h : "", d, e++, g) || (d++, e = 1, b.export(a, b, h, d, e, g));
    });
  } else {
    switch(e) {
      case 1:
        var l = "tag";
        var m = this.l;
        c = null;
        break;
      case 2:
        l = "store";
        m = this.store;
        c = null;
        break;
      default:
        g();
        return;
    }
    wa(a, this, c, l, d, e, m, g);
  }
  return f;
};
t.import = function(a, b) {
  if (b) {
    switch(E(b) && (b = JSON.parse(b)), a) {
      case "tag":
        this.l = b;
        break;
      case "reg":
        this.s = !1;
        this.register = b;
        a = 0;
        for (var c; a < this.h.length; a++) {
          c = this.index[this.h[a]], c.register = b, c.s = !1;
        }
        break;
      case "store":
        this.store = b;
        break;
      default:
        a = a.split("."), c = a[0], a = a[1], c && a && this.index[c].import(a, b);
    }
  }
};
ra(T.prototype);
var Ga = {encode:Fa, G:!1, H:""}, Ha = [J("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), "a", J("[\u00e8\u00e9\u00ea\u00eb]"), "e", J("[\u00ec\u00ed\u00ee\u00ef]"), "i", J("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), "o", J("[\u00f9\u00fa\u00fb\u00fc\u0171]"), "u", J("[\u00fd\u0177\u00ff]"), "y", J("\u00f1"), "n", J("[\u00e7c]"), "k", J("\u00df"), "s", J(" & "), " and "];
function Fa(a) {
  var b = a = "" + a;
  b.normalize && (b = b.normalize("NFD").replace(la, ""));
  return ja.call(this, b.toLowerCase(), !a.normalize && Ha);
}
;var Ja = {encode:Ia, G:!1, H:"strict"}, Na = /[^a-z0-9]+/, Oa = {b:"p", v:"f", w:"f", z:"s", x:"s", "\u00df":"s", d:"t", n:"m", c:"k", g:"k", j:"k", q:"k", i:"e", y:"e", u:"o"};
function Ia(a) {
  a = Fa.call(this, a).join(" ");
  var b = [];
  if (a) {
    for (var c = a.split(Na), d = c.length, e = 0, g, f = 0; e < d; e++) {
      if ((a = c[e]) && (!this.filter || !this.filter[a])) {
        g = a[0];
        for (var h = Oa[g] || g, k = h, l = 1; l < a.length; l++) {
          g = a[l], (g = Oa[g] || g) && g !== k && (h += g, k = g);
        }
        b[f++] = h;
      }
    }
  }
  return b;
}
;var Qa = {encode:Pa, G:!1, H:""}, Ra = [J("ae"), "a", J("oe"), "o", J("sh"), "s", J("th"), "t", J("ph"), "f", J("pf"), "f", J("(?![aeo])h(?![aeo])"), "", J("(?!^[aeo])h(?!^[aeo])"), ""];
function Pa(a, b) {
  a && (a = Ia.call(this, a).join(" "), 2 < a.length && (a = I(a, Ra)), b || (1 < a.length && (a = na(a)), a && (a = a.split(" "))));
  return a || [];
}
;var Ta = {encode:Sa, G:!1, H:""}, Ua = J("(?!\\b)[aeo]");
function Sa(a) {
  a && (a = Pa.call(this, a, !0), 1 < a.length && (a = a.replace(Ua, "")), 1 < a.length && (a = na(a)), a && (a = a.split(" ")));
  return a || [];
}
;K["latin:default"] = pa;
K["latin:simple"] = Ga;
K["latin:balance"] = Ja;
K["latin:advanced"] = Qa;
K["latin:extra"] = Ta;
var Z = {Index:N, Document:T, Worker:R, registerCharset:function(a, b) {
  K[a] = b;
}, registerLanguage:function(a, b) {
  qa[a] = b;
}}, Va;
(Va = self.define) && Va.amd ? Va([], function() {
  return Z;
}) : self.exports ? self.exports = Z : self.FlexSearch = Z;
}(this));
