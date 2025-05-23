/**!
 * FlexSearch.js v0.8.202 (ES5/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;
var w;
function aa(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
}
function B(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (b) {
    return b.call(a);
  }
  if ("number" == typeof a.length) {
    return {next:aa(a)};
  }
  throw Error(String(a) + " is not an iterable or ArrayLike");
}
var ca = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  if (a == Array.prototype || a == Object.prototype) {
    return a;
  }
  a[b] = c.value;
  return a;
};
function da(a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) {
      return c;
    }
  }
  throw Error("Cannot find global object");
}
var ea = da(this);
function H(a, b) {
  if (b) {
    a: {
      var c = ea;
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
      b != d && null != b && ca(c, a, {configurable:!0, writable:!0, value:b});
    }
  }
}
var fa;
if ("function" == typeof Object.setPrototypeOf) {
  fa = Object.setPrototypeOf;
} else {
  var ha;
  a: {
    var ia = {a:!0}, ja = {};
    try {
      ja.__proto__ = ia;
      ha = ja.a;
      break a;
    } catch (a) {
    }
    ha = !1;
  }
  fa = ha ? function(a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) {
      throw new TypeError(a + " is not extensible");
    }
    return a;
  } : null;
}
var ka = fa;
function la() {
  this.F = !1;
  this.A = null;
  this.B = void 0;
  this.h = 1;
  this.I = 0;
  this.D = null;
}
function ma(a) {
  if (a.F) {
    throw new TypeError("Generator is already running");
  }
  a.F = !0;
}
la.prototype.H = function(a) {
  this.B = a;
};
function na(a, b) {
  a.D = {oa:b, pa:!0};
  a.h = a.I;
}
la.prototype.return = function(a) {
  this.D = {return:a};
  this.h = this.I;
};
function K(a, b, c) {
  a.h = c;
  return {value:b};
}
function pa(a) {
  this.h = new la();
  this.A = a;
}
function qa(a, b) {
  ma(a.h);
  var c = a.h.A;
  if (c) {
    return ra(a, "return" in c ? c["return"] : function(d) {
      return {value:d, done:!0};
    }, b, a.h.return);
  }
  a.h.return(b);
  return sa(a);
}
function ra(a, b, c, d) {
  try {
    var e = b.call(a.h.A, c);
    if (!(e instanceof Object)) {
      throw new TypeError("Iterator result " + e + " is not an object");
    }
    if (!e.done) {
      return a.h.F = !1, e;
    }
    var f = e.value;
  } catch (h) {
    return a.h.A = null, na(a.h, h), sa(a);
  }
  a.h.A = null;
  d.call(a.h, f);
  return sa(a);
}
function sa(a) {
  for (; a.h.h;) {
    try {
      var b = a.A(a.h);
      if (b) {
        return a.h.F = !1, {value:b.value, done:!1};
      }
    } catch (c) {
      a.h.B = void 0, na(a.h, c);
    }
  }
  a.h.F = !1;
  if (a.h.D) {
    b = a.h.D;
    a.h.D = null;
    if (b.pa) {
      throw b.oa;
    }
    return {value:b.return, done:!0};
  }
  return {value:void 0, done:!0};
}
function ta(a) {
  this.next = function(b) {
    ma(a.h);
    a.h.A ? b = ra(a, a.h.A.next, b, a.h.H) : (a.h.H(b), b = sa(a));
    return b;
  };
  this.throw = function(b) {
    ma(a.h);
    a.h.A ? b = ra(a, a.h.A["throw"], b, a.h.H) : (na(a.h, b), b = sa(a));
    return b;
  };
  this.return = function(b) {
    return qa(a, b);
  };
  this[Symbol.iterator] = function() {
    return this;
  };
}
function ua(a, b) {
  b = new ta(new pa(b));
  ka && a.prototype && ka(b, a.prototype);
  return b;
}
function va(a) {
  function b(d) {
    return a.next(d);
  }
  function c(d) {
    return a.throw(d);
  }
  return new Promise(function(d, e) {
    function f(h) {
      h.done ? d(h.value) : Promise.resolve(h.value).then(b, c).then(f, e);
    }
    f(a.next());
  });
}
function wa(a) {
  return va(new ta(new pa(a)));
}
H("Symbol", function(a) {
  function b(f) {
    if (this instanceof b) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new c(d + (f || "") + "_" + e++, f);
  }
  function c(f, h) {
    this.h = f;
    ca(this, "description", {configurable:!0, writable:!0, value:h});
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
H("Symbol.iterator", function(a) {
  if (a) {
    return a;
  }
  a = Symbol("Symbol.iterator");
  for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
    var d = ea[b[c]];
    "function" === typeof d && "function" != typeof d.prototype[a] && ca(d.prototype, a, {configurable:!0, writable:!0, value:function() {
      return xa(aa(this));
    }});
  }
  return a;
});
function xa(a) {
  a = {next:a};
  a[Symbol.iterator] = function() {
    return this;
  };
  return a;
}
H("Promise", function(a) {
  function b(h) {
    this.A = 0;
    this.B = void 0;
    this.h = [];
    this.N = !1;
    var g = this.D();
    try {
      h(g.resolve, g.reject);
    } catch (k) {
      g.reject(k);
    }
  }
  function c() {
    this.h = null;
  }
  function d(h) {
    return h instanceof b ? h : new b(function(g) {
      g(h);
    });
  }
  if (a) {
    return a;
  }
  c.prototype.A = function(h) {
    if (null == this.h) {
      this.h = [];
      var g = this;
      this.B(function() {
        g.F();
      });
    }
    this.h.push(h);
  };
  var e = ea.setTimeout;
  c.prototype.B = function(h) {
    e(h, 0);
  };
  c.prototype.F = function() {
    for (; this.h && this.h.length;) {
      var h = this.h;
      this.h = [];
      for (var g = 0; g < h.length; ++g) {
        var k = h[g];
        h[g] = null;
        try {
          k();
        } catch (m) {
          this.D(m);
        }
      }
    }
    this.h = null;
  };
  c.prototype.D = function(h) {
    this.B(function() {
      throw h;
    });
  };
  b.prototype.D = function() {
    function h(m) {
      return function(l) {
        k || (k = !0, m.call(g, l));
      };
    }
    var g = this, k = !1;
    return {resolve:h(this.ja), reject:h(this.F)};
  };
  b.prototype.ja = function(h) {
    if (h === this) {
      this.F(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (h instanceof b) {
        this.la(h);
      } else {
        a: {
          switch(typeof h) {
            case "object":
              var g = null != h;
              break a;
            case "function":
              g = !0;
              break a;
            default:
              g = !1;
          }
        }
        g ? this.ia(h) : this.I(h);
      }
    }
  };
  b.prototype.ia = function(h) {
    var g = void 0;
    try {
      g = h.then;
    } catch (k) {
      this.F(k);
      return;
    }
    "function" == typeof g ? this.ma(g, h) : this.I(h);
  };
  b.prototype.F = function(h) {
    this.O(2, h);
  };
  b.prototype.I = function(h) {
    this.O(1, h);
  };
  b.prototype.O = function(h, g) {
    if (0 != this.A) {
      throw Error("Cannot settle(" + h + ", " + g + "): Promise already settled in state" + this.A);
    }
    this.A = h;
    this.B = g;
    2 === this.A && this.ka();
    this.U();
  };
  b.prototype.ka = function() {
    var h = this;
    e(function() {
      if (h.ha()) {
        var g = ea.console;
        "undefined" !== typeof g && g.error(h.B);
      }
    }, 1);
  };
  b.prototype.ha = function() {
    if (this.N) {
      return !1;
    }
    var h = ea.CustomEvent, g = ea.Event, k = ea.dispatchEvent;
    if ("undefined" === typeof k) {
      return !0;
    }
    "function" === typeof h ? h = new h("unhandledrejection", {cancelable:!0}) : "function" === typeof g ? h = new g("unhandledrejection", {cancelable:!0}) : (h = ea.document.createEvent("CustomEvent"), h.initCustomEvent("unhandledrejection", !1, !0, h));
    h.promise = this;
    h.reason = this.B;
    return k(h);
  };
  b.prototype.U = function() {
    if (null != this.h) {
      for (var h = 0; h < this.h.length; ++h) {
        f.A(this.h[h]);
      }
      this.h = null;
    }
  };
  var f = new c();
  b.prototype.la = function(h) {
    var g = this.D();
    h.V(g.resolve, g.reject);
  };
  b.prototype.ma = function(h, g) {
    var k = this.D();
    try {
      h.call(g, k.resolve, k.reject);
    } catch (m) {
      k.reject(m);
    }
  };
  b.prototype.then = function(h, g) {
    function k(n, q) {
      return "function" == typeof n ? function(t) {
        try {
          m(n(t));
        } catch (v) {
          l(v);
        }
      } : q;
    }
    var m, l, p = new b(function(n, q) {
      m = n;
      l = q;
    });
    this.V(k(h, m), k(g, l));
    return p;
  };
  b.prototype.catch = function(h) {
    return this.then(void 0, h);
  };
  b.prototype.V = function(h, g) {
    function k() {
      switch(m.A) {
        case 1:
          h(m.B);
          break;
        case 2:
          g(m.B);
          break;
        default:
          throw Error("Unexpected state: " + m.A);
      }
    }
    var m = this;
    null == this.h ? f.A(k) : this.h.push(k);
    this.N = !0;
  };
  b.resolve = d;
  b.reject = function(h) {
    return new b(function(g, k) {
      k(h);
    });
  };
  b.race = function(h) {
    return new b(function(g, k) {
      for (var m = B(h), l = m.next(); !l.done; l = m.next()) {
        d(l.value).V(g, k);
      }
    });
  };
  b.all = function(h) {
    var g = B(h), k = g.next();
    return k.done ? d([]) : new b(function(m, l) {
      function p(t) {
        return function(v) {
          n[t] = v;
          q--;
          0 == q && m(n);
        };
      }
      var n = [], q = 0;
      do {
        n.push(void 0), q++, d(k.value).V(p(n.length - 1), l), k = g.next();
      } while (!k.done);
    });
  };
  return b;
});
function ya(a, b) {
  a instanceof String && (a += "");
  var c = 0, d = !1, e = {next:function() {
    if (!d && c < a.length) {
      var f = c++;
      return {value:b(f, a[f]), done:!1};
    }
    d = !0;
    return {done:!0, value:void 0};
  }};
  e[Symbol.iterator] = function() {
    return e;
  };
  return e;
}
H("Array.prototype.values", function(a) {
  return a ? a : function() {
    return ya(this, function(b, c) {
      return c;
    });
  };
});
H("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return ya(this, function(b) {
      return b;
    });
  };
});
function za(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
}
H("WeakMap", function(a) {
  function b(k) {
    this.h = (g += Math.random() + 1).toString();
    if (k) {
      k = B(k);
      for (var m; !(m = k.next()).done;) {
        m = m.value, this.set(m[0], m[1]);
      }
    }
  }
  function c() {
  }
  function d(k) {
    var m = typeof k;
    return "object" === m && null !== k || "function" === m;
  }
  function e(k) {
    if (!za(k, h)) {
      var m = new c();
      ca(k, h, {value:m});
    }
  }
  function f(k) {
    var m = Object[k];
    m && (Object[k] = function(l) {
      if (l instanceof c) {
        return l;
      }
      Object.isExtensible(l) && e(l);
      return m(l);
    });
  }
  if (function() {
    if (!a || !Object.seal) {
      return !1;
    }
    try {
      var k = Object.seal({}), m = Object.seal({}), l = new a([[k, 2], [m, 3]]);
      if (2 != l.get(k) || 3 != l.get(m)) {
        return !1;
      }
      l.delete(k);
      l.set(m, 4);
      return !l.has(k) && 4 == l.get(m);
    } catch (p) {
      return !1;
    }
  }()) {
    return a;
  }
  var h = "$jscomp_hidden_" + Math.random();
  f("freeze");
  f("preventExtensions");
  f("seal");
  var g = 0;
  b.prototype.set = function(k, m) {
    if (!d(k)) {
      throw Error("Invalid WeakMap key");
    }
    e(k);
    if (!za(k, h)) {
      throw Error("WeakMap key fail: " + k);
    }
    k[h][this.h] = m;
    return this;
  };
  b.prototype.get = function(k) {
    return d(k) && za(k, h) ? k[h][this.h] : void 0;
  };
  b.prototype.has = function(k) {
    return d(k) && za(k, h) && za(k[h], this.h);
  };
  b.prototype.delete = function(k) {
    return d(k) && za(k, h) && za(k[h], this.h) ? delete k[h][this.h] : !1;
  };
  return b;
});
H("Map", function(a) {
  function b() {
    var g = {};
    return g.K = g.next = g.head = g;
  }
  function c(g, k) {
    var m = g[1];
    return xa(function() {
      if (m) {
        for (; m.head != g[1];) {
          m = m.K;
        }
        for (; m.next != m.head;) {
          return m = m.next, {done:!1, value:k(m)};
        }
        m = null;
      }
      return {done:!0, value:void 0};
    });
  }
  function d(g, k) {
    var m = k && typeof k;
    "object" == m || "function" == m ? f.has(k) ? m = f.get(k) : (m = "" + ++h, f.set(k, m)) : m = "p_" + k;
    var l = g[0][m];
    if (l && za(g[0], m)) {
      for (g = 0; g < l.length; g++) {
        var p = l[g];
        if (k !== k && p.key !== p.key || k === p.key) {
          return {id:m, list:l, index:g, G:p};
        }
      }
    }
    return {id:m, list:l, index:-1, G:void 0};
  }
  function e(g) {
    this[0] = {};
    this[1] = b();
    this.size = 0;
    if (g) {
      g = B(g);
      for (var k; !(k = g.next()).done;) {
        k = k.value, this.set(k[0], k[1]);
      }
    }
  }
  if (function() {
    if (!a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) {
      return !1;
    }
    try {
      var g = Object.seal({x:4}), k = new a(B([[g, "s"]]));
      if ("s" != k.get(g) || 1 != k.size || k.get({x:4}) || k.set({x:4}, "t") != k || 2 != k.size) {
        return !1;
      }
      var m = k.entries(), l = m.next();
      if (l.done || l.value[0] != g || "s" != l.value[1]) {
        return !1;
      }
      l = m.next();
      return l.done || 4 != l.value[0].x || "t" != l.value[1] || !m.next().done ? !1 : !0;
    } catch (p) {
      return !1;
    }
  }()) {
    return a;
  }
  var f = new WeakMap();
  e.prototype.set = function(g, k) {
    g = 0 === g ? 0 : g;
    var m = d(this, g);
    m.list || (m.list = this[0][m.id] = []);
    m.G ? m.G.value = k : (m.G = {next:this[1], K:this[1].K, head:this[1], key:g, value:k}, m.list.push(m.G), this[1].K.next = m.G, this[1].K = m.G, this.size++);
    return this;
  };
  e.prototype.delete = function(g) {
    g = d(this, g);
    return g.G && g.list ? (g.list.splice(g.index, 1), g.list.length || delete this[0][g.id], g.G.K.next = g.G.next, g.G.next.K = g.G.K, g.G.head = null, this.size--, !0) : !1;
  };
  e.prototype.clear = function() {
    this[0] = {};
    this[1] = this[1].K = b();
    this.size = 0;
  };
  e.prototype.has = function(g) {
    return !!d(this, g).G;
  };
  e.prototype.get = function(g) {
    return (g = d(this, g).G) && g.value;
  };
  e.prototype.entries = function() {
    return c(this, function(g) {
      return [g.key, g.value];
    });
  };
  e.prototype.keys = function() {
    return c(this, function(g) {
      return g.key;
    });
  };
  e.prototype.values = function() {
    return c(this, function(g) {
      return g.value;
    });
  };
  e.prototype.forEach = function(g, k) {
    for (var m = this.entries(), l; !(l = m.next()).done;) {
      l = l.value, g.call(k, l[1], l[0], this);
    }
  };
  e.prototype[Symbol.iterator] = e.prototype.entries;
  var h = 0;
  return e;
});
H("Set", function(a) {
  function b(c) {
    this.h = new Map();
    if (c) {
      c = B(c);
      for (var d; !(d = c.next()).done;) {
        this.add(d.value);
      }
    }
    this.size = this.h.size;
  }
  if (function() {
    if (!a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) {
      return !1;
    }
    try {
      var c = Object.seal({x:4}), d = new a(B([c]));
      if (!d.has(c) || 1 != d.size || d.add(c) != d || 1 != d.size || d.add({x:4}) != d || 2 != d.size) {
        return !1;
      }
      var e = d.entries(), f = e.next();
      if (f.done || f.value[0] != c || f.value[1] != c) {
        return !1;
      }
      f = e.next();
      return f.done || f.value[0] == c || 4 != f.value[0].x || f.value[1] != f.value[0] ? !1 : e.next().done;
    } catch (h) {
      return !1;
    }
  }()) {
    return a;
  }
  b.prototype.add = function(c) {
    c = 0 === c ? 0 : c;
    this.h.set(c, c);
    this.size = this.h.size;
    return this;
  };
  b.prototype.delete = function(c) {
    c = this.h.delete(c);
    this.size = this.h.size;
    return c;
  };
  b.prototype.clear = function() {
    this.h.clear();
    this.size = 0;
  };
  b.prototype.has = function(c) {
    return this.h.has(c);
  };
  b.prototype.entries = function() {
    return this.h.entries();
  };
  b.prototype.values = function() {
    return this.h.values();
  };
  b.prototype.keys = b.prototype.values;
  b.prototype[Symbol.iterator] = b.prototype.values;
  b.prototype.forEach = function(c, d) {
    var e = this;
    this.h.forEach(function(f) {
      return c.call(d, f, f, e);
    });
  };
  return b;
});
H("Object.is", function(a) {
  return a ? a : function(b, c) {
    return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
  };
});
H("Array.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    var d = this;
    d instanceof String && (d = String(d));
    var e = d.length;
    c = c || 0;
    for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
      var f = d[c];
      if (f === b || Object.is(f, b)) {
        return !0;
      }
    }
    return !1;
  };
});
H("String.prototype.includes", function(a) {
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
H("Array.prototype.entries", function(a) {
  return a ? a : function() {
    return ya(this, function(b, c) {
      return [b, c];
    });
  };
});
var Aa = "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var d = arguments[c];
    if (d) {
      for (var e in d) {
        za(d, e) && (a[e] = d[e]);
      }
    }
  }
  return a;
};
H("Object.assign", function(a) {
  return a || Aa;
});
H("Array.prototype.flat", function(a) {
  return a ? a : function(b) {
    b = void 0 === b ? 1 : b;
    var c = [];
    Array.prototype.forEach.call(this, function(d) {
      Array.isArray(d) && 0 < b ? (d = Array.prototype.flat.call(d, b - 1), c.push.apply(c, d)) : c.push(d);
    });
    return c;
  };
});
H("Promise.prototype.finally", function(a) {
  return a ? a : function(b) {
    return this.then(function(c) {
      return Promise.resolve(b()).then(function() {
        return c;
      });
    }, function(c) {
      return Promise.resolve(b()).then(function() {
        throw c;
      });
    });
  };
});
function P(a, b, c) {
  var d = typeof c, e = typeof a;
  if ("undefined" !== d) {
    if ("undefined" !== e) {
      if (c) {
        if ("function" === e && d === e) {
          return function(f) {
            return a(c(f));
          };
        }
        b = a.constructor;
        if (b === c.constructor) {
          if (b === Array) {
            return c.concat(a);
          }
          if (b === Map) {
            b = new Map(c);
            d = B(a);
            for (e = d.next(); !e.done; e = d.next()) {
              e = e.value, b.set(e[0], e[1]);
            }
            return b;
          }
          if (b === Set) {
            b = new Set(c);
            d = B(a.values());
            for (e = d.next(); !e.done; e = d.next()) {
              b.add(e.value);
            }
            return b;
          }
        }
      }
      return a;
    }
    return c;
  }
  return "undefined" === e ? b : a;
}
function Ba(a, b) {
  return "undefined" === typeof a ? b : a;
}
function S() {
  return Object.create(null);
}
function T(a) {
  return "string" === typeof a;
}
function Ca(a) {
  return "object" === typeof a;
}
function Da(a) {
  var b = [];
  a = B(a.keys());
  for (var c = a.next(); !c.done; c = a.next()) {
    b.push(c.value);
  }
  return b;
}
function Ea(a, b) {
  if (T(b)) {
    a = a[b];
  } else {
    for (var c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
;var Fa = /[^\p{L}\p{N}]+/u, Ga = /(\d{3})/g, Ha = /(\D)(\d{3})/g, Ia = /(\d{3})(\D)/g, Ja = /[\u0300-\u036f]/g;
function Ka(a) {
  a = void 0 === a ? {} : a;
  if (!this || this.constructor !== Ka) {
    var b = Function.prototype.bind, c = b.apply, d = [null], e = d.concat;
    if (arguments instanceof Array) {
      var f = arguments;
    } else {
      f = B(arguments);
      for (var h, g = []; !(h = f.next()).done;) {
        g.push(h.value);
      }
      f = g;
    }
    return new (c.call(b, Ka, e.call(d, f)))();
  }
  if (arguments.length) {
    for (b = 0; b < arguments.length; b++) {
      this.assign(arguments[b]);
    }
  } else {
    this.assign(a);
  }
}
w = Ka.prototype;
w.assign = function(a) {
  this.normalize = P(a.normalize, !0, this.normalize);
  var b = a.include, c = b || a.exclude || a.split;
  if (c || "" === c) {
    if ("object" === typeof c && c.constructor !== RegExp) {
      var d = "";
      var e = !b;
      b || (d += "\\p{Z}");
      c.letter && (d += "\\p{L}");
      c.number && (d += "\\p{N}", e = !!b);
      c.symbol && (d += "\\p{S}");
      c.punctuation && (d += "\\p{P}");
      c.control && (d += "\\p{C}");
      if (c = c.char) {
        d += "object" === typeof c ? c.join("") : c;
      }
      try {
        this.split = new RegExp("[" + (b ? "^" : "") + d + "]+", "u");
      } catch (f) {
        console.error("Your split configuration:", c, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = c, e = !1 === c || 2 > "a1a".split(c).length;
    }
    this.numeric = P(a.numeric, e);
  } else {
    try {
      this.split = P(this.split, Fa);
    } catch (f) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = P(a.numeric, P(this.numeric, !0));
  }
  this.prepare = P(a.prepare, null, this.prepare);
  this.finalize = P(a.finalize, null, this.finalize);
  c = a.filter;
  this.filter = "function" === typeof c ? c : P(c && new Set(c), null, this.filter);
  this.dedupe = P(a.dedupe, !0, this.dedupe);
  this.matcher = P((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = P((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = P((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = P(a.replacer, null, this.replacer);
  this.minlength = P(a.minlength, 1, this.minlength);
  this.maxlength = P(a.maxlength, 1024, this.maxlength);
  this.rtl = P(a.rtl, !1, this.rtl);
  if (this.cache = c = P(a.cache, !0, this.cache)) {
    this.F = null, this.U = "number" === typeof c ? c : 2e5, this.B = new Map(), this.D = new Map(), this.I = this.H = 128;
  }
  this.h = "";
  this.N = null;
  this.A = "";
  this.O = null;
  if (this.matcher) {
    for (a = B(this.matcher.keys()), b = a.next(); !b.done; b = a.next()) {
      this.h += (this.h ? "|" : "") + b.value;
    }
  }
  if (this.stemmer) {
    for (a = B(this.stemmer.keys()), b = a.next(); !b.done; b = a.next()) {
      this.A += (this.A ? "|" : "") + b.value;
    }
  }
  return this;
};
w.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.A += (this.A ? "|" : "") + a;
  this.O = null;
  this.cache && La(this);
  return this;
};
w.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && La(this);
  return this;
};
w.addMapper = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (1 < a.length) {
    return this.addMatcher(a, b);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, b);
  this.cache && La(this);
  return this;
};
w.addMatcher = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (2 > a.length && (this.dedupe || this.mapper)) {
    return this.addMapper(a, b);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, b);
  this.h += (this.h ? "|" : "") + a;
  this.N = null;
  this.cache && La(this);
  return this;
};
w.addReplacer = function(a, b) {
  if ("string" === typeof a) {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && La(this);
  return this;
};
w.encode = function(a, b) {
  var c = this;
  if (this.cache && a.length <= this.H) {
    if (this.F) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.F = setTimeout(La, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = Ja ? a.normalize("NFKD").replace(Ja, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(Ha, "$1 $2").replace(Ia, "$1 $2").replace(Ga, "$1 "));
  for (var d = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer), e = [], f = S(), h, g, k = this.split || "" === this.split ? a.split(this.split) : [a], m = 0, l = void 0, p = void 0; m < k.length; m++) {
    if ((l = p = k[m]) && !(l.length < this.minlength || l.length > this.maxlength)) {
      if (b) {
        if (f[l]) {
          continue;
        }
        f[l] = 1;
      } else {
        if (h === l) {
          continue;
        }
        h = l;
      }
      if (d) {
        e.push(l);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(l) : !this.filter.has(l))) {
          if (this.cache && l.length <= this.I) {
            if (this.F) {
              var n = this.D.get(l);
              if (n || "" === n) {
                n && e.push(n);
                continue;
              }
            } else {
              this.F = setTimeout(La, 50, this);
            }
          }
          if (this.stemmer) {
            for (this.O || (this.O = new RegExp("(?!^)(" + this.A + ")$")), n = void 0; n !== l && 2 < l.length;) {
              n = l, l = l.replace(this.O, function(z) {
                return c.stemmer.get(z);
              });
            }
          }
          if (l && (this.mapper || this.dedupe && 1 < l.length)) {
            n = "";
            for (var q = 0, t = "", v = void 0, u = void 0; q < l.length; q++) {
              v = l.charAt(q), v === t && this.dedupe || ((u = this.mapper && this.mapper.get(v)) || "" === u ? u === t && this.dedupe || !(t = u) || (n += u) : n += t = v);
            }
            l = n;
          }
          this.matcher && 1 < l.length && (this.N || (this.N = new RegExp("(" + this.h + ")", "g")), l = l.replace(this.N, function(z) {
            return c.matcher.get(z);
          }));
          if (l && this.replacer) {
            for (n = 0; l && n < this.replacer.length; n += 2) {
              l = l.replace(this.replacer[n], this.replacer[n + 1]);
            }
          }
          this.cache && p.length <= this.I && (this.D.set(p, l), this.D.size > this.U && (this.D.clear(), this.I = this.I / 1.1 | 0));
          if (l) {
            if (l !== p) {
              if (b) {
                if (f[l]) {
                  continue;
                }
                f[l] = 1;
              } else {
                if (g === l) {
                  continue;
                }
                g = l;
              }
            }
            e.push(l);
          }
        }
      }
    }
  }
  this.finalize && (e = this.finalize(e) || e);
  this.cache && a.length <= this.H && (this.B.set(a, e), this.B.size > this.U && (this.B.clear(), this.H = this.H / 1.1 | 0));
  return e;
};
function La(a) {
  a.F = null;
  a.B.clear();
  a.D.clear();
}
;function Ma(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : c = a);
  c && (a = c.query || a, b = c.limit || b);
  var d = "" + (b || 0);
  if (c) {
    var e = c;
    d += (e.offset || 0) + !!e.context + !!e.suggest + (!1 !== e.resolve) + (e.resolution || this.resolution) + (e.boost || 0);
  }
  a = ("" + a).toLowerCase();
  this.cache || (this.cache = new Na());
  e = this.cache.get(a + d);
  if (!e) {
    var f = c && c.cache;
    f && (c.cache = !1);
    e = this.search(a, b, c);
    f && (c.cache = f);
    this.cache.set(a + d, e);
  }
  return e;
}
function Na(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
Na.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
Na.prototype.get = function(a) {
  var b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
Na.prototype.remove = function(a) {
  for (var b = B(this.cache), c = b.next(); !c.done; c = b.next()) {
    c = c.value;
    var d = c[0];
    c[1].includes(a) && this.cache.delete(d);
  }
};
Na.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
var Oa = {normalize:!1, numeric:!1, dedupe:!1};
var Pa = {};
var Qa = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
var Ra = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Sa = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
var Ta = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var Ua = {Exact:Oa, Default:Pa, Normalize:Pa, LatinBalance:{mapper:Qa}, LatinAdvanced:{mapper:Qa, matcher:Ra, replacer:Sa}, LatinExtra:{mapper:Qa, replacer:Sa.concat([/(?!^)[aeo]/g, ""]), matcher:Ra}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (var b = 0; b < a.length; b++) {
    for (var c = a[b], d = c.charAt(0), e = Ta[d], f = 1, h; f < c.length && (h = c.charAt(f), "h" === h || "w" === h || !(h = Ta[h]) || h === e || (d += h, e = h, 4 !== d.length)); f++) {
    }
    a[b] = d;
  }
}}, CJK:{split:""}, LatinExact:Oa, LatinDefault:Pa, LatinSimple:Pa};
function Va(a, b, c, d) {
  for (var e = [], f = 0, h; f < a.index.length; f++) {
    if (h = a.index[f], b >= h.length) {
      b -= h.length;
    } else {
      b = h[d ? "splice" : "slice"](b, c);
      if (h = b.length) {
        if (e = e.length ? e.concat(b) : b, c -= h, d && (a.length -= h), !c) {
          break;
        }
      }
      b = 0;
    }
  }
  return e;
}
function Wa(a) {
  if (!this || this.constructor !== Wa) {
    return new Wa(a);
  }
  this.index = a ? [a] : [];
  this.length = a ? a.length : 0;
  var b = this;
  return new Proxy([], {get:function(c, d) {
    if ("length" === d) {
      return b.length;
    }
    if ("push" === d) {
      return function(e) {
        b.index[b.index.length - 1].push(e);
        b.length++;
      };
    }
    if ("pop" === d) {
      return function() {
        if (b.length) {
          return b.length--, b.index[b.index.length - 1].pop();
        }
      };
    }
    if ("indexOf" === d) {
      return function(e) {
        for (var f = 0, h = 0, g, k; h < b.index.length; h++) {
          g = b.index[h];
          k = g.indexOf(e);
          if (0 <= k) {
            return f + k;
          }
          f += g.length;
        }
        return -1;
      };
    }
    if ("includes" === d) {
      return function(e) {
        for (var f = 0; f < b.index.length; f++) {
          if (b.index[f].includes(e)) {
            return !0;
          }
        }
        return !1;
      };
    }
    if ("slice" === d) {
      return function(e, f) {
        return Va(b, e || 0, f || b.length, !1);
      };
    }
    if ("splice" === d) {
      return function(e, f) {
        return Va(b, e || 0, f || b.length, !0);
      };
    }
    if ("constructor" === d) {
      return Array;
    }
    if ("symbol" !== typeof d) {
      return (c = b.index[d / Math.pow(2, 31) | 0]) && c[d];
    }
  }, set:function(c, d, e) {
    c = d / Math.pow(2, 31) | 0;
    (b.index[c] || (b.index[c] = []))[d] = e;
    b.length++;
    return !0;
  }});
}
Wa.prototype.clear = function() {
  this.index.length = 0;
};
Wa.prototype.destroy = function() {
  this.proxy = this.index = null;
};
Wa.prototype.push = function() {
};
function Xa(a) {
  a = void 0 === a ? 8 : a;
  if (!this || this.constructor !== Xa) {
    return new Xa(a);
  }
  this.index = S();
  this.h = [];
  this.size = 0;
  32 < a ? (this.A = Ya, this.B = BigInt(a)) : (this.A = Za, this.B = a);
}
Xa.prototype.get = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.get(a);
};
Xa.prototype.set = function(a, b) {
  var c = this.A(a), d = this.index[c];
  d ? (c = d.size, d.set(a, b), (c -= d.size) && this.size++) : (this.index[c] = d = new Map([[a, b]]), this.h.push(d), this.size++);
};
function X(a) {
  a = void 0 === a ? 8 : a;
  if (!this || this.constructor !== X) {
    return new X(a);
  }
  this.index = S();
  this.h = [];
  this.size = 0;
  32 < a ? (this.A = Ya, this.B = BigInt(a)) : (this.A = Za, this.B = a);
}
X.prototype.add = function(a) {
  var b = this.A(a), c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c), this.size++);
};
w = Xa.prototype;
w.has = X.prototype.has = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.has(a);
};
w.delete = X.prototype.delete = function(a) {
  var b = this.A(a);
  (b = this.index[b]) && b.delete(a) && this.size--;
};
w.clear = X.prototype.clear = function() {
  this.index = S();
  this.h = [];
  this.size = 0;
};
w.values = X.prototype.values = function $a() {
  var b, c = this, d, e, f;
  return ua($a, function(h) {
    switch(h.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          h.h = 0;
          break;
        }
        d = B(c.h[b].values());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          h.h = 2;
          break;
        }
        f = e.value;
        return K(h, f, 6);
      case 6:
        e = d.next(), h.h = 5;
    }
  });
};
w.keys = X.prototype.keys = function ab() {
  var b, c = this, d, e, f;
  return ua(ab, function(h) {
    switch(h.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          h.h = 0;
          break;
        }
        d = B(c.h[b].keys());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          h.h = 2;
          break;
        }
        f = e.value;
        return K(h, f, 6);
      case 6:
        e = d.next(), h.h = 5;
    }
  });
};
w.entries = X.prototype.entries = function bb() {
  var b, c = this, d, e, f;
  return ua(bb, function(h) {
    switch(h.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          h.h = 0;
          break;
        }
        d = B(c.h[b].entries());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          h.h = 2;
          break;
        }
        f = e.value;
        return K(h, f, 6);
      case 6:
        e = d.next(), h.h = 5;
    }
  });
};
function Za(a) {
  var b = Math.pow(2, this.B) - 1;
  if ("number" == typeof a) {
    return a & b;
  }
  for (var c = 0, d = this.B + 1, e = 0; e < a.length; e++) {
    c = (c * d ^ a.charCodeAt(e)) & b;
  }
  return 32 === this.B ? c + Math.pow(2, 31) : c;
}
function Ya() {
  throw Error("The keystore is limited to 32 for EcmaScript5");
}
;var cb, db;
function eb(a) {
  var b, c, d, e, f, h;
  return wa(function(g) {
    switch(g.h) {
      case 1:
        a = a.data;
        b = a.task;
        c = a.id;
        d = a.args;
        switch(b) {
          case "init":
            db = a.options || {};
            (e = a.factory) ? (Function("return " + e)()(self), cb = new self.FlexSearch.Index(db), delete self.FlexSearch) : cb = new Y(db);
            postMessage({id:c});
            break;
          default:
            g.h = 2;
            return;
        }g.h = 0;
        break;
      case 2:
        if ("export" === b) {
          if (!db.export || "function" !== typeof db.export) {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
          }
          d[1] ? (d[0] = db.export, d[2] = 0, d[3] = 1) : d = null;
        }
        if ("import" === b) {
          if (!db.import || "function" !== typeof db.import) {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
          }
          if (!d[0]) {
            g.h = 5;
            break;
          }
          return K(g, db.import.call(cb, d[0]), 11);
        }
        f = d && cb[b].apply(cb, d);
        if (!f || !f.then) {
          g.h = 6;
          break;
        }
        return K(g, f, 7);
      case 7:
        f = g.B;
      case 6:
        if (!f || !f.await) {
          g.h = 8;
          break;
        }
        return K(g, f.await, 9);
      case 9:
        f = g.B;
      case 8:
        "search" === b && f.result && (f = f.result);
        g.h = 5;
        break;
      case 11:
        h = g.B, cb.import(d[0], h);
      case 5:
        postMessage("search" === b ? {id:c, msg:f} : {id:c}), g.h = 0;
    }
  });
}
;function fb(a) {
  gb.call(a, "add");
  gb.call(a, "append");
  gb.call(a, "search");
  gb.call(a, "update");
  gb.call(a, "remove");
  gb.call(a, "searchCache");
}
var hb, ib, jb;
function kb() {
  hb = jb = 0;
}
function gb(a) {
  this[a + "Async"] = function() {
    var b = arguments, c = b[b.length - 1];
    if ("function" === typeof c) {
      var d = c;
      delete b[b.length - 1];
    }
    hb ? jb || (jb = Date.now() - ib >= this.priority * this.priority * 3) : (hb = setTimeout(kb, 0), ib = Date.now());
    if (jb) {
      var e = this;
      return new Promise(function(h) {
        setTimeout(function() {
          h(e[a + "Async"].apply(e, b));
        }, 0);
      });
    }
    var f = this[a].apply(this, b);
    c = f.then ? f : new Promise(function(h) {
      return h(f);
    });
    d && c.then(d);
    return c;
  };
}
;var lb = 0;
function mb(a, b) {
  function c(g) {
    function k(m) {
      m = m.data || m;
      var l = m.id, p = l && f.h[l];
      p && (p(m.msg), delete f.h[l]);
    }
    this.worker = g;
    this.h = S();
    if (this.worker) {
      e ? this.worker.on("message", k) : this.worker.onmessage = k;
      if (a.config) {
        return new Promise(function(m) {
          1e9 < lb && (lb = 0);
          f.h[++lb] = function() {
            m(f);
          };
          f.worker.postMessage({id:lb, task:"init", factory:d, options:a});
        });
      }
      this.priority = a.priority || 4;
      this.encoder = b || null;
      this.worker.postMessage({task:"init", factory:d, options:a});
      return this;
    }
    console.warn("Worker is not available on this platform. Please report on Github: https://github.com/nextapps-de/flexsearch/issues");
  }
  a = void 0 === a ? {} : a;
  if (!this || this.constructor !== mb) {
    return new mb(a);
  }
  var d = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  d && (d = d.toString());
  var e = "undefined" === typeof window, f = this, h = nb(d, e, a.worker);
  return h.then ? h.then(function(g) {
    return c.call(f, g);
  }) : c.call(this, h);
}
ob("add");
ob("append");
ob("search");
ob("update");
ob("remove");
ob("clear");
ob("export");
ob("import");
mb.prototype.searchCache = Ma;
fb(mb.prototype);
function ob(a) {
  mb.prototype[a] = function() {
    var b = this, c = [].slice.call(arguments), d = c[c.length - 1];
    if ("function" === typeof d) {
      var e = d;
      c.pop();
    }
    d = new Promise(function(f) {
      "export" === a && "function" === typeof c[0] && (c[0] = null);
      1e9 < lb && (lb = 0);
      b.h[++lb] = f;
      b.worker.postMessage({task:a, id:lb, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function nb(a, b, c) {
  return b ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + eb.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof c ? c : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;pb.prototype.add = function(a, b, c) {
  Ca(a) && (b = a, a = Ea(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (var d = 0, e; d < this.field.length; d++) {
      e = this.M[d];
      var f = this.index.get(this.field[d]);
      if ("function" === typeof e) {
        (e = e(b)) && f.add(a, e, !1, !0);
      } else {
        var h = e.S;
        if (!h || h(b)) {
          e.constructor === String ? e = ["" + e] : T(e) && (e = [e]), qb(b, e, this.T, 0, f, a, e[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.L.length; d++) {
        h = this.L[d];
        var g = this.ba[d];
        f = this.tag.get(g);
        e = S();
        if ("function" === typeof h) {
          if (h = h(b), !h) {
            continue;
          }
        } else {
          var k = h.S;
          if (k && !k(b)) {
            continue;
          }
          h.constructor === String && (h = "" + h);
          h = Ea(b, h);
        }
        if (f && h) {
          for (T(h) && (h = [h]), g = 0, k = void 0; g < h.length; g++) {
            var m = h[g];
            if (!e[m]) {
              e[m] = 1;
              var l;
              (l = f.get(m)) ? k = l : f.set(m, k = []);
              if (!c || !k.includes(a)) {
                if (k.length === Math.pow(2, 31) - 1) {
                  l = new Wa(k);
                  if (this.fastupdate) {
                    for (var p = B(this.reg.values()), n = p.next(); !n.done; n = p.next()) {
                      n = n.value, n.includes(k) && (n[n.indexOf(k)] = l);
                    }
                  }
                  f.set(m, k = l);
                }
                k.push(a);
                this.fastupdate && ((m = this.reg.get(a)) ? m.push(k) : this.reg.set(a, [k]));
              }
            }
          }
        } else {
          f || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!c || !this.store.has(a))) {
      if (this.J) {
        var q = S();
        for (c = 0; c < this.J.length; c++) {
          if (d = this.J[c], f = d.S, !f || f(b)) {
            f = void 0;
            if ("function" === typeof d) {
              f = d(b);
              if (!f) {
                continue;
              }
              d = [d.na];
            } else if (T(d) || d.constructor === String) {
              q[d] = b[d];
              continue;
            }
            rb(b, q, d, 0, d[0], f);
          }
        }
      }
      this.store.set(a, q || b);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function rb(a, b, c, d, e, f) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
        rb(a, b, c, d, e);
      }
    } else {
      b = b[e] || (b[e] = S()), e = c[++d], rb(a, b, c, d, e);
    }
  }
}
function qb(a, b, c, d, e, f, h, g) {
  if (a = a[h]) {
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
      e.add(f, a, g, !0);
    } else {
      if (a.constructor === Array) {
        for (h = 0; h < a.length; h++) {
          qb(a, b, c, d, e, f, h, g);
        }
      } else {
        h = b[++d], qb(a, b, c, d, e, f, h, g);
      }
    }
  }
}
;function sb(a, b, c, d) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? a.slice(c, c + b) : a, d ? tb.call(this, a) : a;
  }
  for (var e = [], f = 0, h = void 0, g = void 0; f < a.length; f++) {
    if ((h = a[f]) && (g = h.length)) {
      if (c) {
        if (c >= g) {
          c -= g;
          continue;
        }
        h = h.slice(c, c + b);
        g = h.length;
        c = 0;
      }
      g > b && (h = h.slice(0, b), g = b);
      if (!e.length && g >= b) {
        return d ? tb.call(this, h) : h;
      }
      e.push(h);
      b -= g;
      if (!b) {
        break;
      }
    }
  }
  e = 1 < e.length ? [].concat.apply([], e) : e[0];
  return d ? tb.call(this, e) : e;
}
;function ub(a, b, c, d) {
  var e = d[0];
  if (e[0] && e[0].query) {
    return a[b].apply(a, e);
  }
  if (!("and" !== b && "not" !== b || a.result.length || a.await || e.suggest)) {
    return 1 < d.length && (e = d[d.length - 1]), (d = e.resolve) ? a.await || a.result : a;
  }
  var f = [], h = 0, g = 0, k, m;
  b = {};
  for (e = 0; e < d.length; b = {aa:void 0, $:void 0, ca:void 0, fa:void 0}, e++) {
    var l = d[e];
    if (l) {
      var p = void 0;
      if (l.constructor === Z) {
        p = l.await || l.result;
      } else if (l.then || l.constructor === Array) {
        p = l;
      } else {
        h = l.limit || 0;
        g = l.offset || 0;
        var n = l.suggest;
        var q = ((m = (k = l.resolve) && l.highlight) || l.enrich) && k;
        p = l.queue;
        b.ca = l.async || p;
        var t = l.index;
        t ? a.index || (a.index = t) : t = a.index;
        if (l.query || l.tag) {
          if (!t) {
            throw Error("Resolver can't apply because the corresponding Index was never specified");
          }
          var v = l.field || l.pluck;
          if (v) {
            l.query && (a.query = l.query, a.field = v);
            if (!t.index) {
              throw Error("Resolver can't apply because the corresponding Document Index was not specified");
            }
            t = t.index.get(v);
            if (!t) {
              throw Error("Resolver can't apply because the specified Document Field '" + v + "' was not found");
            }
          }
          if (p && (u || a.await)) {
            var u = 1;
            b.aa = void 0;
            b.fa = a.C.length;
            b.$ = new Promise(function(x) {
              return function(C) {
                x.aa = C;
              };
            }(b));
            (function(x) {
              return function(C, D) {
                x.$.H = function() {
                  D.index = null;
                  D.resolve = !1;
                  var r = x.ca ? C.searchAsync(D) : C.search(D);
                  if (r.then) {
                    return r.then(function(y) {
                      a.C[x.fa] = y = y.result || y;
                      (0,x.aa)(y);
                      return y;
                    });
                  }
                  r = r.result || r;
                  (0,x.aa)(r);
                  return r;
                };
              };
            })(b)(t, Object.assign({}, l));
            a.C.push(b.$);
            f[e] = b.$;
            continue;
          } else {
            l.resolve = !1, l.index = null, p = b.ca ? t.searchAsync(l) : t.search(l), l.resolve = k, l.index = t;
          }
        } else if (l.and) {
          p = vb(l, "and", t);
        } else if (l.or) {
          p = vb(l, "or", t);
        } else if (l.not) {
          p = vb(l, "not", t);
        } else if (l.xor) {
          p = vb(l, "xor", t);
        } else {
          continue;
        }
      }
      p.await ? (u = 1, p = p.await) : p.then ? (u = 1, p = p.then(function(x) {
        return x.result || x;
      })) : p = p.result || p;
      f[e] = p;
    }
  }
  u && !a.await && (a.await = new Promise(function(x) {
    a.return = x;
  }));
  if (u) {
    var z = Promise.all(f).then(function(x) {
      for (var C = 0; C < a.C.length; C++) {
        if (a.C[C] === z) {
          a.C[C] = function() {
            return c.call(a, x, h, g, q, k, n, m);
          };
          break;
        }
      }
      wb(a);
    });
    a.C.push(z);
  } else if (a.await) {
    a.C.push(function() {
      return c.call(a, f, h, g, q, k, n, m);
    });
  } else {
    return c.call(a, f, h, g, q, k, n, m);
  }
  return k ? a.await || a.result : a;
}
function vb(a, b, c) {
  a = a[b];
  var d = a[0] || a;
  d.index || (d.index = c);
  c = new Z(d);
  1 < a.length && (c = c[b].apply(c, a.slice(1)));
  return c;
}
;Z.prototype.or = function() {
  return ub(this, "or", xb, arguments);
};
function xb(a, b, c, d, e, f, h) {
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = yb(a, b, c, !1, this.h), c = 0));
  e && (this.await = null);
  return e ? this.resolve(b, c, d, h) : this;
}
;Z.prototype.and = function() {
  return ub(this, "and", zb, arguments);
};
function zb(a, b, c, d, e, f, h) {
  if (!f && !this.result.length) {
    return e ? this.result : this;
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      for (var g = 0, k = 0, m = void 0, l = void 0; k < a.length; k++) {
        if ((m = a[k]) && (l = m.length)) {
          g < l && (g = l);
        } else if (!f) {
          g = 0;
          break;
        }
      }
      if (g) {
        this.result = Ab(a, g, b, c, f, this.h, e);
        var p = !0;
      } else {
        this.result = [];
      }
    }
  } else {
    f || (this.result = a);
  }
  e && (this.await = null);
  return e ? this.resolve(b, c, d, h, p) : this;
}
;Z.prototype.xor = function() {
  return ub(this, "xor", Bb, arguments);
};
function Bb(a, b, c, d, e, f, h) {
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      a: {
        f = c;
        var g = this.h;
        for (var k = [], m = S(), l = 0, p = 0, n; p < a.length; p++) {
          if (n = a[p]) {
            l < n.length && (l = n.length);
            for (var q = 0, t; q < n.length; q++) {
              if (t = n[q]) {
                for (var v = 0, u; v < t.length; v++) {
                  u = t[v], m[u] = m[u] ? 2 : 1;
                }
              }
            }
          }
        }
        for (n = p = 0; p < l; p++) {
          for (q = 0; q < a.length; q++) {
            if (t = a[q]) {
              if (t = t[p]) {
                for (v = 0; v < t.length; v++) {
                  if (u = t[v], 1 === m[u]) {
                    if (f) {
                      f--;
                    } else {
                      if (e) {
                        if (k.push(u), k.length === b) {
                          a = k;
                          break a;
                        }
                      } else {
                        var z = p + (q ? g : 0);
                        k[z] || (k[z] = []);
                        k[z].push(u);
                        if (++n === b) {
                          a = k;
                          break a;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        a = k;
      }
      this.result = a;
      g = !0;
    }
  } else {
    f || (this.result = a);
  }
  e && (this.await = null);
  return e ? this.resolve(b, c, d, h, g) : this;
}
;Z.prototype.not = function() {
  return ub(this, "not", Cb, arguments);
};
function Cb(a, b, c, d, e, f, h) {
  if (!f && !this.result.length) {
    return e ? this.result : this;
  }
  if (a.length && this.result.length) {
    a: {
      f = c;
      var g = [];
      a = new Set(a.flat().flat());
      for (var k = 0, m, l = 0; k < this.result.length; k++) {
        if (m = this.result[k]) {
          for (var p = 0, n; p < m.length; p++) {
            if (n = m[p], !a.has(n)) {
              if (f) {
                f--;
              } else {
                if (e) {
                  if (g.push(n), g.length === b) {
                    f = g;
                    break a;
                  }
                } else {
                  if (g[k] || (g[k] = []), g[k].push(n), ++l === b) {
                    f = g;
                    break a;
                  }
                }
              }
            }
          }
        }
      }
      f = g;
    }
    this.result = f;
    g = !0;
  }
  e && (this.await = null);
  return e ? this.resolve(b, c, d, h, g) : this;
}
;function Db(a, b, c, d, e) {
  if ("string" === typeof e) {
    var f = e;
    e = "";
  } else {
    f = e.template;
  }
  if (!f) {
    throw Error('No template pattern was specified by the search option "highlight"');
  }
  var h = f.indexOf("$1");
  if (-1 === h) {
    throw Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + f);
  }
  var g = f.substring(h + 2);
  h = f.substring(0, h);
  var k = e && e.boundary, m = !e || !1 !== e.clip, l = e && e.merge && g && h && new RegExp(g + " " + h, "g");
  e = e && e.ellipsis;
  var p = 0;
  if ("object" === typeof e) {
    var n = e.template;
    p = n.length - 2;
    e = e.pattern;
  }
  "string" !== typeof e && (e = !1 === e ? "" : "...");
  p && (e = n.replace("$1", e));
  n = e.length - p;
  if ("object" === typeof k) {
    var q = k.before;
    0 === q && (q = -1);
    var t = k.after;
    0 === t && (t = -1);
    k = k.total || 9e5;
  }
  p = new Map();
  for (var v, u = 0, z, x; u < b.length; u++) {
    if (d) {
      var C = b;
      x = d;
    } else {
      C = b[u];
      x = C.field;
      if (!x) {
        continue;
      }
      C = C.result;
    }
    v = c.get(x);
    z = v.encoder;
    v = p.get(z);
    "string" !== typeof v && (v = z.encode(a), p.set(z, v));
    for (var D = 0; D < C.length; D++) {
      var r = C[D].doc;
      if (r && (r = Ea(r, x))) {
        var y = r.trim().split(/\s+/);
        if (y.length) {
          r = "";
          for (var F = [], U = [], G = -1, N = -1, Q = 0, E = 0; E < y.length; E++) {
            var R = y[E], W = z.encode(R);
            W = 1 < W.length ? W.join(" ") : W[0];
            var O = void 0;
            if (W && R) {
              for (var L = R.length, M = (z.split ? R.replace(z.split, "") : R).length - W.length, ba = "", oa = 0, A = 0; A < v.length; A++) {
                var I = v[A];
                if (I) {
                  var J = I.length;
                  J += M;
                  oa && J <= oa || (I = W.indexOf(I), -1 < I && (ba = (I ? R.substring(0, I) : "") + h + R.substring(I, I + J) + g + (I + J < L ? R.substring(I + J) : ""), oa = J, O = !0));
                }
              }
              ba && (k && (0 > G && (G = r.length + (r ? 1 : 0)), N = r.length + (r ? 1 : 0) + ba.length, Q += L, U.push(F.length), F.push({match:ba})), r += (r ? " " : "") + ba);
            }
            if (!O) {
              R = y[E], r += (r ? " " : "") + R, k && F.push({text:R});
            } else if (k && Q >= k) {
              break;
            }
          }
          Q = U.length * (f.length - 2);
          if (q || t || k && r.length - Q > k) {
            if (Q = k + Q - 2 * n, E = N - G, 0 < q && (E += q), 0 < t && (E += t), E <= Q) {
              y = q ? G - (0 < q ? q : 0) : G - ((Q - E) / 2 | 0), F = t ? N + (0 < t ? t : 0) : y + Q, m || (0 < y && " " !== r.charAt(y) && " " !== r.charAt(y - 1) && (y = r.indexOf(" ", y), 0 > y && (y = 0)), F < r.length && " " !== r.charAt(F - 1) && " " !== r.charAt(F) && (F = r.lastIndexOf(" ", F), F < N ? F = N : ++F)), r = (y ? e : "") + r.substring(y, F) + (F < r.length ? e : "");
            } else {
              N = [];
              Q = {};
              G = {};
              E = {};
              R = {};
              W = {};
              M = L = O = 0;
              for (oa = ba = 1;;) {
                I = void 0;
                for (A = 0; A < U.length; A++) {
                  J = U[A];
                  if (M) {
                    if (L !== M) {
                      if (E[A + 1]) {
                        continue;
                      }
                      J += M;
                      if (Q[J]) {
                        O -= n;
                        G[A + 1] = 1;
                        E[A + 1] = 1;
                        continue;
                      }
                      if (J >= F.length - 1) {
                        if (J >= F.length) {
                          E[A + 1] = 1;
                          J >= y.length && (G[A + 1] = 1);
                          continue;
                        }
                        O -= n;
                      }
                      r = F[J].text;
                      var V = t && W[A];
                      if (V) {
                        if (0 < V) {
                          if (r.length > V) {
                            if (E[A + 1] = 1, m) {
                              r = r.substring(0, V);
                            } else {
                              continue;
                            }
                          }
                          (V -= r.length) || (V = -1);
                          W[A] = V;
                        } else {
                          E[A + 1] = 1;
                          continue;
                        }
                      }
                      if (O + r.length + 1 <= k) {
                        r = " " + r, N[A] += r;
                      } else if (m) {
                        I = k - O - 1, 0 < I && (r = " " + r.substring(0, I), N[A] += r), E[A + 1] = 1;
                      } else {
                        E[A + 1] = 1;
                        continue;
                      }
                    } else {
                      if (E[A]) {
                        continue;
                      }
                      J -= L;
                      if (Q[J]) {
                        O -= n;
                        E[A] = 1;
                        G[A] = 1;
                        continue;
                      }
                      if (0 >= J) {
                        if (0 > J) {
                          E[A] = 1;
                          G[A] = 1;
                          continue;
                        }
                        O -= n;
                      }
                      r = F[J].text;
                      if (V = q && R[A]) {
                        if (0 < V) {
                          if (r.length > V) {
                            if (E[A] = 1, m) {
                              r = r.substring(r.length - V);
                            } else {
                              continue;
                            }
                          }
                          (V -= r.length) || (V = -1);
                          R[A] = V;
                        } else {
                          E[A] = 1;
                          continue;
                        }
                      }
                      if (O + r.length + 1 <= k) {
                        r += " ", N[A] = r + N[A];
                      } else if (m) {
                        I = r.length + 1 - (k - O), 0 <= I && I < r.length && (r = r.substring(I) + " ", N[A] = r + N[A]), E[A] = 1;
                      } else {
                        E[A] = 1;
                        continue;
                      }
                    }
                  } else {
                    r = F[J].match;
                    q && (R[A] = q);
                    t && (W[A] = t);
                    A && O++;
                    I = void 0;
                    J ? !A && n && (O += n) : (G[A] = 1, E[A] = 1);
                    J >= y.length - 1 ? I = 1 : J < F.length - 1 && F[J + 1].match ? I = 1 : n && (O += n);
                    O -= f.length - 2;
                    if (!A || O + r.length <= k) {
                      N[A] = r;
                    } else {
                      I = ba = oa = G[A] = 0;
                      break;
                    }
                    I && (G[A + 1] = 1, E[A + 1] = 1);
                  }
                  O += r.length;
                  I = Q[J] = 1;
                }
                if (I) {
                  L === M ? M++ : L++;
                } else {
                  L === M ? ba = 0 : oa = 0;
                  if (!ba && !oa) {
                    break;
                  }
                  ba ? (L++, M = L) : M++;
                }
              }
              r = "";
              for (y = 0; y < N.length; y++) {
                F = (y && G[y] ? " " : (y && !e ? " " : "") + e) + N[y], r += F;
              }
              e && !G[N.length] && (r += e);
            }
          }
          l && (r = r.replace(l, " "));
          C[D].highlight = r;
        }
      }
    }
    if (d) {
      break;
    }
  }
  return b;
}
;function Z(a, b) {
  if (!this || this.constructor !== Z) {
    return new Z(a, b);
  }
  var c = 0, d, e;
  if (a && a.index) {
    var f = a;
    b = f.index;
    c = f.boost || 0;
    if (d = f.query) {
      var h = f.field || f.pluck;
      var g = f.resolve;
      a = f.async || f.queue;
      f.resolve = !1;
      f.index = null;
      a = a ? b.searchAsync(f) : b.search(f);
      f.resolve = g;
      f.index = b;
      a = a.result || a;
    } else {
      a = [];
    }
  }
  if (a && a.then) {
    var k = this;
    a = a.then(function(p) {
      k.C[0] = k.result = p.result || p;
      wb(k);
    });
    var m = [a];
    a = [];
    var l = new Promise(function(p) {
      e = p;
    });
  }
  this.index = b || null;
  this.result = a || [];
  this.h = c;
  this.C = m || [];
  this.await = l || null;
  this.return = e || null;
  this.query = d || "";
  this.field = h || "";
}
w = Z.prototype;
w.limit = function(a) {
  if (this.await) {
    var b = this;
    this.C.push(function() {
      b.limit(a);
      return b.result;
    });
  } else {
    if (this.result.length) {
      for (var c = [], d = 0, e = void 0; d < this.result.length; d++) {
        if (e = this.result[d]) {
          if (e.length <= a) {
            if (c[d] = e, a -= e.length, !a) {
              break;
            }
          } else {
            c[d] = e.slice(0, a);
            break;
          }
        }
      }
      this.result = c;
    }
  }
  return this;
};
w.offset = function(a) {
  if (this.await) {
    var b = this;
    this.C.push(function() {
      b.offset(a);
      return b.result;
    });
  } else {
    if (this.result.length) {
      for (var c = [], d = 0, e = void 0; d < this.result.length; d++) {
        if (e = this.result[d]) {
          e.length <= a ? a -= e.length : (c[d] = e.slice(a), a = 0);
        }
      }
      this.result = c;
    }
  }
  return this;
};
w.boost = function(a) {
  if (this.await) {
    var b = this;
    this.C.push(function() {
      b.boost(a);
      return b.result;
    });
  } else {
    this.h += a;
  }
  return this;
};
function wb(a, b) {
  var c = a.result, d = a.await;
  a.await = null;
  for (var e = 0, f; e < a.C.length; e++) {
    if (f = a.C[e]) {
      if ("function" === typeof f) {
        c = f(), a.C[e] = c = c.result || c, e--;
      } else if (f.H) {
        c = f.H(), a.C[e] = c = c.result || c, e--;
      } else if (f.then) {
        return a.await = d;
      }
    }
  }
  d = a.return;
  a.C = [];
  a.return = null;
  b || d(c);
  return c;
}
w.resolve = function(a, b, c, d, e) {
  var f = this.await ? wb(this, !0) : this.result;
  if (f.then) {
    var h = this;
    return f.then(function() {
      return h.resolve(a, b, c, d, e);
    });
  }
  f.length && ("object" === typeof a ? (d = a.highlight, c = !!d || a.enrich, b = a.offset, a = a.limit) : c = !!d || c, f = e ? c ? tb.call(this.index, f) : f : sb.call(this.index, f, a || 100, b, c));
  return this.finalize(f, d);
};
w.finalize = function(a, b) {
  if (a.then) {
    var c = this;
    return a.then(function(e) {
      return c.finalize(e, b);
    });
  }
  b && !this.query && console.warn('There was no query specified for highlighting. Please specify a query within the last resolver stage like { query: "...", resolve: true, highlight: ... }.');
  b && a.length && this.query && (a = Db(this.query, a, this.index.index, this.field, b));
  var d = this.return;
  this.index = this.result = this.C = this.await = this.return = null;
  this.query = this.field = "";
  d && d(a);
  return a;
};
function Ab(a, b, c, d, e, f, h) {
  var g = a.length, k = [];
  var m = S();
  for (var l = 0, p = void 0, n, q; l < b; l++) {
    for (var t = 0; t < g; t++) {
      var v = a[t];
      if (l < v.length && (p = v[l])) {
        for (var u = 0; u < p.length; u++) {
          n = p[u];
          (v = m[n]) ? m[n]++ : (v = 0, m[n] = 1);
          q = k[v] || (k[v] = []);
          if (!h) {
            var z = l + (t || !e ? 0 : f || 0);
            q = q[z] || (q[z] = []);
          }
          q.push(n);
          if (h && c && v === g - 1 && q.length - d === c) {
            return d ? q.slice(d) : q;
          }
        }
      }
    }
  }
  if (a = k.length) {
    if (e) {
      k = 1 < k.length ? yb(k, c, d, h, f) : (k = k[0]) && c && k.length > c || d ? k.slice(d, c + d) : k;
    } else {
      if (a < g) {
        return [];
      }
      k = k[a - 1];
      if (c || d) {
        if (h) {
          if (k.length > c || d) {
            k = k.slice(d, c + d);
          }
        } else {
          e = [];
          for (f = 0; f < k.length; f++) {
            if (h = k[f]) {
              if (d && h.length > d) {
                d -= h.length;
              } else {
                if (c && h.length > c || d) {
                  h = h.slice(d, c + d), c -= h.length, d && (d -= h.length);
                }
                e.push(h);
                if (!c) {
                  break;
                }
              }
            }
          }
          k = e;
        }
      }
    }
  }
  return k;
}
function yb(a, b, c, d, e) {
  var f = [], h = S(), g = a.length, k;
  if (d) {
    for (e = g - 1; 0 <= e; e--) {
      if (k = (d = a[e]) && d.length) {
        for (g = 0; g < k; g++) {
          var m = d[g];
          if (!h[m]) {
            if (h[m] = 1, c) {
              c--;
            } else {
              if (f.push(m), f.length === b) {
                return f;
              }
            }
          }
        }
      }
    }
  } else {
    for (var l = g - 1, p, n = 0; 0 <= l; l--) {
      p = a[l];
      for (var q = 0; q < p.length; q++) {
        if (k = (d = p[q]) && d.length) {
          for (var t = 0; t < k; t++) {
            if (m = d[t], !h[m]) {
              if (h[m] = 1, c) {
                c--;
              } else {
                var v = (q + (l < g - 1 ? e || 0 : 0)) / (l + 1) | 0;
                (f[v] || (f[v] = [])).push(m);
                if (++n === b) {
                  return f;
                }
              }
            }
          }
        }
      }
    }
  }
  return f;
}
function Eb(a, b, c) {
  for (var d = S(), e = [], f = 0, h; f < b.length; f++) {
    h = b[f];
    for (var g = 0; g < h.length; g++) {
      d[h[g]] = 1;
    }
  }
  if (c) {
    for (b = 0; b < a.length; b++) {
      c = a[b], d[c] && (e.push(c), d[c] = 0);
    }
  } else {
    for (b = 0; b < a.result.length; b++) {
      for (c = a.result[b], h = 0; h < c.length; h++) {
        f = c[h], d[f] && ((e[b] || (e[b] = [])).push(f), d[f] = 0);
      }
    }
  }
  return e;
}
;S();
pb.prototype.search = function(a, b, c, d) {
  c || (!b && Ca(a) ? (c = a, a = "") : Ca(b) && (c = b, b = 0));
  var e = [], f = [], h = 0, g = !0;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    var k = c.pluck;
    var m = c.merge;
    var l = c.boost;
    var p = k || c.field || (p = c.index) && (p.index ? null : p);
    var n = this.tag && c.tag;
    var q = c.suggest;
    g = !1 !== c.resolve;
    var t = c.cache;
    this.store && c.highlight && !g ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && c.enrich && !g && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    var v = g && this.store && c.highlight;
    var u = !!v || g && this.store && c.enrich;
    b = c.limit || b;
    var z = c.offset || 0;
    b || (b = g ? 100 : 0);
    if (n && (!this.db || !d)) {
      n.constructor !== Array && (n = [n]);
      for (var x = [], C = 0, D = void 0; C < n.length; C++) {
        D = n[C];
        if (T(D)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (D.field && D.tag) {
          var r = D.tag;
          if (r.constructor === Array) {
            for (var y = 0; y < r.length; y++) {
              x.push(D.field, r[y]);
            }
          } else {
            x.push(D.field, r);
          }
        } else {
          r = Object.keys(D);
          y = 0;
          for (var F = void 0, U = void 0; y < r.length; y++) {
            if (F = r[y], U = D[F], U.constructor === Array) {
              for (var G = 0; G < U.length; G++) {
                x.push(F, U[G]);
              }
            } else {
              x.push(F, U);
            }
          }
        }
      }
      if (!x.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      n = x;
      if (!a) {
        f = [];
        if (x.length) {
          for (n = 0; n < x.length; n += 2) {
            d = void 0;
            if (this.db) {
              d = this.index.get(x[n]);
              if (!d) {
                console.warn("Tag '" + x[n] + ":" + x[n + 1] + "' will be skipped because there is no field '" + x[n] + "'.");
                continue;
              }
              f.push(d = d.db.tag(x[n + 1], b, z, u));
            } else {
              d = Fb.call(this, x[n], x[n + 1], b, z, u);
            }
            e.push(g ? {field:x[n], tag:x[n + 1], result:d} : [d]);
          }
        }
        if (f.length) {
          var N = this;
          return Promise.all(f).then(function(L) {
            for (var M = 0; M < L.length; M++) {
              g ? e[M].result = L[M] : e[M] = L[M];
            }
            return g ? e : new Z(1 < e.length ? Ab(e, 1, 0, 0, q, l) : e[0], N);
          });
        }
        return g ? e : new Z(1 < e.length ? Ab(e, 1, 0, 0, q, l) : e[0], this);
      }
    }
    if (!g && !k) {
      if (p = p || this.field) {
        T(p) ? k = p : (p.constructor === Array && 1 === p.length && (p = p[0]), k = p.field || p.index);
      }
      if (!k) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    p && p.constructor !== Array && (p = [p]);
  }
  p || (p = this.field);
  x = (this.worker || this.db) && !d && [];
  C = 0;
  for (y = D = r = void 0; C < p.length; C++) {
    if (D = p[C], !this.db || !this.tag || this.M[C]) {
      r = void 0;
      T(D) || (r = D, D = r.field, a = r.query || a, b = Ba(r.limit, b), z = Ba(r.offset, z), q = Ba(r.suggest, q), v = g && this.store && Ba(r.highlight, v), u = !!v || g && this.store && Ba(r.enrich, u), t = Ba(r.cache, t));
      if (d) {
        r = d[C];
      } else {
        y = r || c || {};
        F = y.enrich;
        r = this.index.get(D);
        if (n) {
          if (this.db) {
            y.tag = n;
            var Q = r.db.support_tag_search;
            y.field = p;
          }
          !Q && F && (y.enrich = !1);
        }
        r = t ? r.searchCache(a, b, y) : r.search(a, b, y);
        F && (y.enrich = F);
        if (x) {
          x[C] = r;
          continue;
        }
      }
      y = (r = r.result || r) && r.length;
      if (n && y) {
        F = [];
        U = 0;
        if (this.db && d) {
          if (!Q) {
            for (G = p.length; G < d.length; G++) {
              var E = d[G];
              if (E && E.length) {
                U++, F.push(E);
              } else if (!q) {
                return g ? e : new Z(e, this);
              }
            }
          }
        } else {
          G = 0;
          for (var R = E = void 0; G < n.length; G += 2) {
            E = this.tag.get(n[G]);
            if (!E) {
              if (console.warn("Tag '" + n[G] + ":" + n[G + 1] + "' will be skipped because there is no field '" + n[G] + "'."), q) {
                continue;
              } else {
                return g ? e : new Z(e, this);
              }
            }
            if (R = (E = E && E.get(n[G + 1])) && E.length) {
              U++, F.push(E);
            } else if (!q) {
              return g ? e : new Z(e, this);
            }
          }
        }
        if (U) {
          r = Eb(r, F, g);
          y = r.length;
          if (!y && !q) {
            return g ? r : new Z(r, this);
          }
          U--;
        }
      }
      if (y) {
        f[h] = D, e.push(r), h++;
      } else if (1 === p.length) {
        return g ? e : new Z(e, this);
      }
    }
  }
  if (x) {
    if (this.db && n && n.length && !Q) {
      for (u = 0; u < n.length; u += 2) {
        f = this.index.get(n[u]);
        if (!f) {
          if (console.warn("Tag '" + n[u] + ":" + n[u + 1] + "' was not found because there is no field '" + n[u] + "'."), q) {
            continue;
          } else {
            return g ? e : new Z(e, this);
          }
        }
        x.push(f.db.tag(n[u + 1], b, z, !1));
      }
    }
    var W = this;
    return Promise.all(x).then(function(L) {
      c && (c.resolve = g);
      L.length && (L = W.search(a, b, c, L));
      return L;
    });
  }
  if (!h) {
    return g ? e : new Z(e, this);
  }
  if (k && (!u || !this.store)) {
    return e = e[0], g ? e : new Z(e, this);
  }
  x = [];
  for (z = 0; z < f.length; z++) {
    n = e[z];
    u && n.length && "undefined" === typeof n[0].doc && (this.db ? x.push(n = this.index.get(this.field[0]).db.enrich(n)) : n = tb.call(this, n));
    if (k) {
      return g ? v ? Db(a, n, this.index, k, v) : n : new Z(n, this);
    }
    e[z] = {field:f[z], result:n};
  }
  if (u && this.db && x.length) {
    var O = this;
    return Promise.all(x).then(function(L) {
      for (var M = 0; M < L.length; M++) {
        e[M].result = L[M];
      }
      v && (e = Db(a, e, O.index, k, v));
      return m ? Gb(e) : e;
    });
  }
  v && (e = Db(a, e, this.index, k, v));
  return m ? Gb(e) : e;
};
function Gb(a) {
  for (var b = [], c = S(), d = S(), e = 0, f, h, g = void 0, k, m, l; e < a.length; e++) {
    f = a[e];
    h = f.field;
    f = f.result;
    for (var p = 0; p < f.length; p++) {
      if (k = f[p], "object" !== typeof k ? k = {id:g = k} : g = k.id, (m = c[g]) ? m.push(h) : (k.field = c[g] = [h], b.push(k)), l = k.highlight) {
        m = d[g], m || (d[g] = m = {}, k.highlight = m), m[h] = l;
      }
    }
  }
  return b;
}
function Fb(a, b, c, d, e) {
  a = this.tag.get(a);
  if (!a) {
    return [];
  }
  a = a.get(b);
  if (!a) {
    return [];
  }
  b = a.length - d;
  if (0 < b) {
    if (c && b > c || d) {
      a = a.slice(d, d + c);
    }
    e && (a = tb.call(this, a));
  }
  return a;
}
function tb(a) {
  if (!this || !this.store) {
    return a;
  }
  if (this.db) {
    return this.index.get(this.field[0]).db.enrich(a);
  }
  for (var b = Array(a.length), c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {id:d, doc:this.store.get(d)};
  }
  return b;
}
;function pb(a) {
  if (!this || this.constructor !== pb) {
    return new pb(a);
  }
  var b = a.document || a.doc || a, c, d;
  this.M = [];
  this.field = [];
  this.T = [];
  this.key = (c = b.key || b.id) && Hb(c, this.T) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? d ? new X(d) : new Set() : d ? new Xa(d) : new Map();
  this.J = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (d ? new Xa(d) : new Map());
  this.cache = (c = a.cache || null) && new Na(c);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = Ib.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.L = [];
      this.ba = [];
      b = 0;
      for (var e = d = void 0; b < c.length; b++) {
        d = c[b];
        e = d.field || d;
        if (!e) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        d.custom ? this.L[b] = d.custom : (this.L[b] = Hb(e, this.T), d.filter && ("string" === typeof this.L[b] && (this.L[b] = new String(this.L[b])), this.L[b].S = d.filter));
        this.ba[b] = e;
        this.tag.set(e, new Map());
      }
    }
  }
  if (this.worker) {
    this.fastupdate = !1;
    a = [];
    c = B(this.index.values());
    for (b = c.next(); !b.done; b = c.next()) {
      b = b.value, b.then && a.push(b);
    }
    if (a.length) {
      var f = this;
      return Promise.all(a).then(function(h) {
        for (var g = 0, k = B(f.index.entries()), m = k.next(); !m.done; m = k.next()) {
          var l = m.value;
          m = l[0];
          l = l[1];
          l.then && (l = h[g], f.index.set(m, l), g++);
        }
        return f;
      });
    }
  } else {
    a.db && (this.fastupdate = !1, this.mount(a.db));
  }
}
w = pb.prototype;
w.mount = function(a) {
  if (this.worker) {
    throw Error("You can't use Worker-Indexes on a persistent model. That would be useless, since each of the persistent model acts like Worker-Index by default (Master/Slave).");
  }
  var b = this.field;
  if (this.tag) {
    for (var c = 0, d = void 0; c < this.ba.length; c++) {
      d = this.ba[c];
      var e = void 0;
      this.index.set(d, e = new Y({}, this.reg));
      b === this.field && (b = b.slice(0));
      b.push(d);
      e.tag = this.tag.get(d);
    }
  }
  c = [];
  d = {db:a.db, type:a.type, fastupdate:a.fastupdate};
  e = 0;
  var f = void 0;
  for (f = void 0; e < b.length; e++) {
    d.field = f = b[e];
    f = this.index.get(f);
    var h = new a.constructor(a.id, d);
    h.id = a.id;
    c[e] = h.mount(f);
    f.document = !0;
    e ? f.bypass = !0 : f.store = this.store;
  }
  var g = this;
  return this.db = Promise.all(c).then(function() {
    g.db = !0;
  });
};
w.commit = function(a, b) {
  var c = this, d, e, f, h;
  return wa(function(g) {
    if (1 == g.h) {
      d = [];
      e = B(c.index.values());
      for (f = e.next(); !f.done; f = e.next()) {
        h = f.value, d.push(h.commit(a, b));
      }
      return K(g, Promise.all(d), 2);
    }
    c.reg.clear();
    g.h = 0;
  });
};
w.destroy = function() {
  for (var a = [], b = B(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    a.push(c.value.destroy());
  }
  return Promise.all(a);
};
function Ib(a, b) {
  var c = new Map(), d = b.index || b.field || b;
  T(d) && (d = [d]);
  for (var e = 0, f, h = void 0; e < d.length; e++) {
    f = d[e];
    T(f) || (h = f, f = f.field);
    h = Ca(h) ? Object.assign({}, a, h) : a;
    if (this.worker) {
      var g = (g = h.encoder) && g.encode ? g : new Ka("string" === typeof g ? Ua[g] : g || {});
      g = new mb(h, g);
      c.set(f, g);
    }
    this.worker || c.set(f, new Y(h, this.reg));
    h.custom ? this.M[e] = h.custom : (this.M[e] = Hb(f, this.T), h.filter && ("string" === typeof this.M[e] && (this.M[e] = new String(this.M[e])), this.M[e].S = h.filter));
    this.field[e] = f;
  }
  if (this.J) {
    for (a = b.store, T(a) && (a = [a]), b = 0; b < a.length; b++) {
      d = a[b], e = d.field || d, d.custom ? (this.J[b] = d.custom, d.custom.na = e) : (this.J[b] = Hb(e, this.T), d.filter && ("string" === typeof this.J[b] && (this.J[b] = new String(this.J[b])), this.J[b].S = d.filter));
    }
  }
  return c;
}
function Hb(a, b) {
  for (var c = a.split(":"), d = 0, e = 0; e < c.length; e++) {
    a = c[e], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (b[d] = !0), a && (c[d++] = a);
  }
  d < c.length && (c.length = d);
  return 1 < d ? c : c[0];
}
w.append = function(a, b) {
  return this.add(a, b, !0);
};
w.update = function(a, b) {
  return this.remove(a).add(a, b);
};
w.remove = function(a) {
  Ca(a) && (a = Ea(a, this.key));
  for (var b = B(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c.value.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (b = B(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
        c = c.value;
        for (var d = B(c), e = d.next(); !e.done; e = d.next()) {
          var f = e.value;
          e = f[0];
          f = f[1];
          var h = f.indexOf(a);
          -1 < h && (1 < f.length ? f.splice(h, 1) : c.delete(e));
        }
      }
    }
    this.store && this.store.delete(a);
    this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
w.clear = function() {
  for (var a = [], b = B(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c = c.value.clear(), c.then && a.push(c);
  }
  if (this.tag) {
    for (b = B(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
      c.value.clear();
    }
  }
  this.store && this.store.clear();
  this.cache && this.cache.clear();
  return a.length ? Promise.all(a) : this;
};
w.contain = function(a) {
  return this.db ? this.index.get(this.field[0]).db.has(a) : this.reg.has(a);
};
w.cleanup = function() {
  for (var a = B(this.index.values()), b = a.next(); !b.done; b = a.next()) {
    b.value.cleanup();
  }
  return this;
};
w.get = function(a) {
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(b) {
    return b[0] && b[0].doc || null;
  }) : this.store.get(a) || null;
};
w.set = function(a, b) {
  "object" === typeof a && (b = a, a = Ea(b, this.key));
  this.store.set(a, b);
  return this;
};
w.searchCache = Ma;
w.export = Jb;
w.import = Kb;
fb(pb.prototype);
function Lb(a, b) {
  b = void 0 === b ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 5000 | 0);
  a = B(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    d.push(e.value), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function Mb(a, b) {
  b || (b = new Map());
  for (var c = 0, d; c < a.length; c++) {
    d = a[c], b.set(d[0], d[1]);
  }
  return b;
}
function Nb(a, b) {
  b = void 0 === b ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 1000 | 0);
  a = B(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    e = e.value, d.push([e[0], Lb(e[1])[0]]), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function Ob(a, b) {
  b || (b = new Map());
  for (var c = 0, d, e; c < a.length; c++) {
    d = a[c], e = b.get(d[0]), b.set(d[0], Mb(d[1], e));
  }
  return b;
}
function Pb(a) {
  var b = [], c = [];
  a = B(a.keys());
  for (var d = a.next(); !d.done; d = a.next()) {
    c.push(d.value), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function Qb(a, b) {
  b || (b = new Set());
  for (var c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function Rb(a, b, c, d, e, f, h) {
  h = void 0 === h ? 0 : h;
  var g = d && d.constructor === Array, k = g ? d.shift() : d;
  if (!k) {
    return this.export(a, b, e, f + 1);
  }
  if ((k = a((b ? b + "." : "") + (h + 1) + "." + c, JSON.stringify(k))) && k.then) {
    var m = this;
    return k.then(function() {
      return Rb.call(m, a, b, c, g ? d : null, e, f, h + 1);
    });
  }
  return Rb.call(this, a, b, c, g ? d : null, e, f, h + 1);
}
function Jb(a, b, c, d) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  if (c < this.field.length) {
    var e = this.field[c];
    if ((b = this.index.get(e).export(a, e, c, d = 1)) && b.then) {
      var f = this;
      return b.then(function() {
        return f.export(a, e, c + 1);
      });
    }
    return this.export(a, e, c + 1);
  }
  switch(d) {
    case 0:
      var h = "reg";
      var g = Pb(this.reg);
      b = null;
      break;
    case 1:
      h = "tag";
      g = this.tag && Nb(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      h = "doc";
      g = this.store && Lb(this.store);
      b = null;
      break;
    default:
      return;
  }
  return Rb.call(this, a, b, h, g, c, d);
}
function Kb(a, b) {
  var c = a.split(".");
  "json" === c[c.length - 1] && c.pop();
  var d = 2 < c.length ? c[0] : "";
  c = 2 < c.length ? c[2] : c[1];
  if (this.worker && d) {
    return this.index.get(d).import(a);
  }
  if (b) {
    "string" === typeof b && (b = JSON.parse(b));
    if (d) {
      return this.index.get(d).import(c, b);
    }
    switch(c) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Qb(b, this.reg);
        for (b = 0; b < this.field.length; b++) {
          d = this.index.get(this.field[b]), d.fastupdate = !1, d.reg = this.reg;
        }
        if (this.worker) {
          b = [];
          d = B(this.index.values());
          for (c = d.next(); !c.done; c = d.next()) {
            b.push(c.value.import(a));
          }
          return Promise.all(b);
        }
        break;
      case "tag":
        this.tag = Ob(b, this.tag);
        break;
      case "doc":
        this.store = Mb(b, this.store);
    }
  }
}
function Sb(a, b) {
  var c = "";
  a = B(a.entries());
  for (var d = a.next(); !d.done; d = a.next()) {
    var e = d.value;
    d = e[0];
    e = e[1];
    for (var f = "", h = 0, g; h < e.length; h++) {
      g = e[h] || [""];
      for (var k = "", m = 0; m < g.length; m++) {
        k += (k ? "," : "") + ("string" === b ? '"' + g[m] + '"' : g[m]);
      }
      k = "[" + k + "]";
      f += (f ? "," : "") + k;
    }
    f = '["' + d + '",[' + f + "]]";
    c += (c ? "," : "") + f;
  }
  return c;
}
;Y.prototype.remove = function(a, b) {
  var c = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (c) {
    if (this.fastupdate) {
      for (var d = 0, e = void 0, f = void 0; d < c.length; d++) {
        if ((e = c[d]) && (f = e.length)) {
          if (e[f - 1] === a) {
            e.pop();
          } else {
            var h = e.indexOf(a);
            0 <= h && e.splice(h, 1);
          }
        }
      }
    } else {
      Tb(this.map, a), this.depth && Tb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.ea && Ub(this));
  this.cache && this.cache.remove(a);
  return this;
};
function Tb(a, b) {
  var c = 0, d = "undefined" === typeof b;
  if (a.constructor === Array) {
    for (var e = 0, f = void 0, h, g = void 0; e < a.length; e++) {
      if ((f = a[e]) && f.length) {
        if (d) {
          return 1;
        }
        h = f.indexOf(b);
        if (0 <= h) {
          if (1 < f.length) {
            return f.splice(h, 1), 1;
          }
          delete a[e];
          if (c) {
            return 1;
          }
          g = 1;
        } else {
          if (g) {
            return 1;
          }
          c++;
        }
      }
    }
  } else {
    for (d = B(a.entries()), e = d.next(); !e.done; e = d.next()) {
      e = e.value, f = e[0], Tb(e[1], b) ? c++ : a.delete(f);
    }
  }
  return c;
}
;var Vb = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
Y.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    d = this.depth;
    b = this.encoder.encode(b, !d);
    var e = b.length;
    if (e) {
      for (var f = S(), h = S(), g = this.resolution, k = 0; k < e; k++) {
        var m = b[this.rtl ? e - 1 - k : k], l = m.length;
        if (l && (d || !h[m])) {
          var p = this.score ? this.score(b, m, k, null, 0) : Wb(g, e, k), n = "";
          switch(this.tokenize) {
            case "full":
              if (2 < l) {
                p = 0;
                for (var q; p < l; p++) {
                  for (var t = l; t > p; t--) {
                    n = m.substring(p, t), q = this.rtl ? l - 1 - p : p, q = this.score ? this.score(b, m, k, n, q) : Wb(g, e, k, l, q), Xb(this, h, n, q, a, c);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < l) {
                for (t = l - 1; 0 < t; t--) {
                  n = m[this.rtl ? l - 1 - t : t] + n, q = this.score ? this.score(b, m, k, n, t) : Wb(g, e, k, l, t), Xb(this, h, n, q, a, c);
                }
                n = "";
              }
            case "forward":
              if (1 < l) {
                for (t = 0; t < l; t++) {
                  n += m[this.rtl ? l - 1 - t : t], Xb(this, h, n, p, a, c);
                }
                break;
              }
            default:
              if (Xb(this, h, m, p, a, c), d && 1 < e && k < e - 1) {
                for (l = S(), n = this.ga, p = m, t = Math.min(d + 1, this.rtl ? k + 1 : e - k), q = l[p] = 1; q < t; q++) {
                  if ((m = b[this.rtl ? e - 1 - k - q : k + q]) && !l[m]) {
                    l[m] = 1;
                    var v = this.score ? this.score(b, p, k, m, q - 1) : Wb(n + (e / 2 > n ? 0 : 1), e, k, t - 1, q - 1), u = this.bidirectional && m > p;
                    Xb(this, f, u ? p : m, v, a, c, u ? m : p);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || this.reg.add(a);
    } else {
      b = "";
    }
  }
  this.db && (b || this.commit_task.push({del:a}), this.ea && Ub(this));
  return this;
};
function Xb(a, b, c, d, e, f, h) {
  var g = h ? a.ctx : a.map, k;
  if (!b[c] || h && !(k = b[c])[h]) {
    if (h ? (b = k || (b[c] = S()), b[h] = 1, (k = g.get(h)) ? g = k : g.set(h, g = new Map())) : b[c] = 1, (k = g.get(c)) ? g = k : g.set(c, g = k = []), g = g[d] || (g[d] = []), !f || !g.includes(e)) {
      if (g.length === Math.pow(2, 31) - 1) {
        b = new Wa(g);
        if (a.fastupdate) {
          for (c = B(a.reg.values()), f = c.next(); !f.done; f = c.next()) {
            f = f.value, f.includes(g) && (f[f.indexOf(g)] = b);
          }
        }
        k[d] = g = b;
      }
      g.push(e);
      a.fastupdate && ((d = a.reg.get(e)) ? d.push(g) : a.reg.set(e, [g]));
    }
  }
}
function Wb(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;Y.prototype.search = function(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : (c = a, a = ""));
  if (c && c.cache) {
    return c.cache = !1, a = this.searchCache(a, b, c), c.cache = !0, a;
  }
  var d = [], e = 0, f;
  if (c) {
    a = c.query || a;
    b = c.limit || b;
    e = c.offset || 0;
    var h = c.context;
    var g = c.suggest;
    var k = (f = c.resolve) && c.enrich;
    var m = c.boost;
    var l = c.resolution;
    var p = this.db && c.tag;
  }
  "undefined" === typeof f && (f = this.resolve);
  h = this.depth && !1 !== h;
  var n = this.encoder.encode(a, !h);
  var q = n.length;
  b = b || (f ? 100 : 0);
  if (1 === q) {
    return Yb.call(this, n[0], "", b, e, f, k, p);
  }
  if (2 === q && h && !g) {
    return Yb.call(this, n[1], n[0], b, e, f, k, p);
  }
  var t = S(), v = 0;
  if (h) {
    var u = n[0];
    v = 1;
  }
  l || 0 === l || (l = u ? this.ga : this.resolution);
  if (this.db) {
    if (this.db.search && (c = this.db.search(this, n, b, e, g, f, k, p), !1 !== c)) {
      return c;
    }
    var z = this;
    return function() {
      var x, C;
      return wa(function(D) {
        switch(D.h) {
          case 1:
            C = x = void 0;
          case 2:
            if (!(v < q)) {
              D.h = 4;
              break;
            }
            C = n[v];
            if (!C || t[C]) {
              D.h = 5;
              break;
            }
            t[C] = 1;
            return K(D, Zb(z, C, u, 0, 0, !1, !1), 6);
          case 6:
            x = D.B;
            if (x = $b(x, d, g, l)) {
              d = x;
              D.h = 4;
              break;
            }
            u && (g && x && d.length || (u = C));
          case 5:
            g && u && v === q - 1 && !d.length && (l = z.resolution, u = "", v = -1, t = S());
            v++;
            D.h = 2;
            break;
          case 4:
            return D.return(ac(d, l, b, e, g, m, f));
        }
      });
    }();
  }
  for (a = c = void 0; v < q; v++) {
    if ((a = n[v]) && !t[a]) {
      t[a] = 1;
      c = Zb(this, a, u, 0, 0, !1, !1);
      if (c = $b(c, d, g, l)) {
        d = c;
        break;
      }
      u && (g && c && d.length || (u = a));
    }
    g && u && v === q - 1 && !d.length && (l = this.resolution, u = "", v = -1, t = S());
  }
  return ac(d, l, b, e, g, m, f);
};
function ac(a, b, c, d, e, f, h) {
  var g = a.length, k = a;
  if (1 < g) {
    k = Ab(a, b, c, d, e, f, h);
  } else if (1 === g) {
    return h ? sb.call(null, a[0], c, d) : new Z(a[0], this);
  }
  return h ? k : new Z(k, this);
}
function Yb(a, b, c, d, e, f, h) {
  a = Zb(this, a, b, c, d, e, f, h);
  return this.db ? a.then(function(g) {
    return e ? g || [] : new Z(g, this);
  }) : a && a.length ? e ? sb.call(this, a, c, d) : new Z(a, this) : e ? [] : new Z([], this);
}
function $b(a, b, c, d) {
  var e = [];
  if (a && a.length) {
    if (a.length <= d) {
      b.push(a);
      return;
    }
    for (var f = 0, h; f < d; f++) {
      if (h = a[f]) {
        e[f] = h;
      }
    }
    if (e.length) {
      b.push(e);
      return;
    }
  }
  if (!c) {
    return e;
  }
}
function Zb(a, b, c, d, e, f, h, g) {
  var k;
  c && (k = a.bidirectional && b > c) && (k = c, c = b, b = k);
  if (a.db) {
    return a.db.get(b, c, d, e, f, h, g);
  }
  a = c ? (a = a.ctx.get(c)) && a.get(b) : a.map.get(b);
  return a;
}
;function Y(a, b) {
  if (!this || this.constructor !== Y) {
    return new Y(a);
  }
  if (a) {
    var c = T(a) ? a : a.preset;
    c && (Vb[c] || console.warn("Preset not found: " + c), a = Object.assign({}, Vb[c], a));
  } else {
    a = {};
  }
  c = a.context;
  var d = !0 === c ? {depth:1} : c || {}, e = T(a.encoder) ? Ua[a.encoder] : a.encode || a.encoder || {};
  this.encoder = e.encode ? e : "object" === typeof e ? new Ka(e) : {encode:e};
  this.resolution = a.resolution || 9;
  this.tokenize = c = (c = a.tokenize) && "default" !== c && "exact" !== c && c || "strict";
  this.depth = "strict" === c && d.depth || 0;
  this.bidirectional = !1 !== d.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  d && d.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new Xa(c) : new Map();
  this.ctx = c ? new Xa(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new Xa(c) : new Map() : c ? new X(c) : new Set());
  this.ga = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new Na(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.ea = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
w = Y.prototype;
w.mount = function(a) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return a.mount(this);
};
w.commit = function(a, b) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.commit(this, a, b);
};
w.destroy = function() {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.destroy();
};
function Ub(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a, void 0, void 0);
  }, 1));
}
w.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  return this.db ? (this.commit_timer && clearTimeout(this.commit_timer), this.commit_timer = null, this.commit_task = [], this.db.clear()) : this;
};
w.append = function(a, b) {
  return this.add(a, b, !0);
};
w.contain = function(a) {
  return this.db ? this.db.has(a) : this.reg.has(a);
};
w.update = function(a, b) {
  var c = this, d = this.remove(a);
  return d && d.then ? d.then(function() {
    return c.add(a, b);
  }) : this.add(a, b);
};
w.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Tb(this.map);
  this.depth && Tb(this.ctx);
  return this;
};
w.searchCache = Ma;
w.export = function(a, b, c, d) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  switch(d) {
    case 0:
      var e = "reg";
      var f = Pb(this.reg);
      break;
    case 1:
      e = "cfg";
      f = null;
      break;
    case 2:
      e = "map";
      f = Lb(this.map, this.reg.size);
      break;
    case 3:
      e = "ctx";
      f = Nb(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return Rb.call(this, a, b, e, f, c, d);
};
w.import = function(a, b) {
  if (b) {
    switch("string" === typeof b && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Qb(b, this.reg);
        break;
      case "map":
        this.map = Mb(b, this.map);
        break;
      case "ctx":
        this.ctx = Ob(b, this.ctx);
    }
  }
};
w.serialize = function(a) {
  a = void 0 === a ? !0 : a;
  var b = "", c = "", d = "";
  if (this.reg.size) {
    var e;
    c = B(this.reg.keys());
    for (var f = c.next(); !f.done; f = c.next()) {
      f = f.value, e || (e = typeof f), b += (b ? "," : "") + ("string" === e ? '"' + f + '"' : f);
    }
    b = "index.reg=new Set([" + b + "]);";
    c = Sb(this.map, e);
    c = "index.map=new Map([" + c + "]);";
    f = B(this.ctx.entries());
    for (var h = f.next(); !h.done; h = f.next()) {
      var g = h.value;
      h = g[0];
      g = Sb(g[1], e);
      g = "new Map([" + g + "])";
      g = '["' + h + '",' + g + "]";
      d += (d ? "," : "") + g;
    }
    d = "index.ctx=new Map([" + d + "]);";
  }
  return a ? "function inject(index){" + b + c + d + "}" : b + c + d;
};
fb(Y.prototype);
var bc = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), cc = ["map", "ctx", "tag", "reg", "cfg"], dc = S();
function ec(a, b) {
  b = void 0 === b ? {} : b;
  if (!this || this.constructor !== ec) {
    return new ec(a, b);
  }
  "object" === typeof a && (b = a, a = a.name);
  a || console.info("Default storage space was used, because a name was not passed.");
  this.id = "flexsearch" + (a ? ":" + a.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "");
  this.field = b.field ? b.field.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "";
  this.type = b.type;
  this.fastupdate = this.support_tag_search = !1;
  this.db = null;
  this.h = {};
}
w = ec.prototype;
w.mount = function(a) {
  if (a.index) {
    return a.mount(this);
  }
  a.db = this;
  return this.open();
};
w.open = function() {
  if (this.db) {
    return this.db;
  }
  var a = this;
  navigator.storage && navigator.storage.persist();
  dc[a.id] || (dc[a.id] = []);
  dc[a.id].push(a.field);
  var b = bc.open(a.id, 1);
  b.onupgradeneeded = function() {
    for (var c = a.db = this.result, d = 0, e; d < cc.length; d++) {
      e = cc[d];
      for (var f = 0, h; f < dc[a.id].length; f++) {
        h = dc[a.id][f], c.objectStoreNames.contains(e + ("reg" !== e ? h ? ":" + h : "" : "")) || c.createObjectStore(e + ("reg" !== e ? h ? ":" + h : "" : ""));
      }
    }
  };
  return a.db = fc(b, function(c) {
    a.db = c;
    a.db.onversionchange = function() {
      a.close();
    };
  });
};
w.close = function() {
  this.db && this.db.close();
  this.db = null;
};
w.destroy = function() {
  var a = bc.deleteDatabase(this.id);
  return fc(a);
};
w.clear = function() {
  for (var a = [], b = 0, c; b < cc.length; b++) {
    c = cc[b];
    for (var d = 0, e; d < dc[this.id].length; d++) {
      e = dc[this.id][d], a.push(c + ("reg" !== c ? e ? ":" + e : "" : ""));
    }
  }
  b = this.db.transaction(a, "readwrite");
  for (c = 0; c < a.length; c++) {
    b.objectStore(a[c]).clear();
  }
  return fc(b);
};
w.get = function(a, b, c, d, e, f) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  e = void 0 === e ? !0 : e;
  f = void 0 === f ? !1 : f;
  a = this.db.transaction((b ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((b ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(b ? b + ":" + a : a);
  var h = this;
  return fc(a).then(function(g) {
    var k = [];
    if (!g || !g.length) {
      return k;
    }
    if (e) {
      if (!c && !d && 1 === g.length) {
        return g[0];
      }
      for (var m = 0, l = void 0; m < g.length; m++) {
        if ((l = g[m]) && l.length) {
          if (d >= l.length) {
            d -= l.length;
          } else {
            for (var p = c ? d + Math.min(l.length - d, c) : l.length, n = d; n < p; n++) {
              k.push(l[n]);
            }
            d = 0;
            if (k.length === c) {
              break;
            }
          }
        }
      }
      return f ? h.enrich(k) : k;
    }
    return g;
  });
};
w.tag = function(a, b, c, d) {
  b = void 0 === b ? 0 : b;
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? !1 : d;
  a = this.db.transaction("tag" + (this.field ? ":" + this.field : ""), "readonly").objectStore("tag" + (this.field ? ":" + this.field : "")).get(a);
  var e = this;
  return fc(a).then(function(f) {
    if (!f || !f.length || c >= f.length) {
      return [];
    }
    if (!b && !c) {
      return f;
    }
    f = f.slice(c, c + b);
    return d ? e.enrich(f) : f;
  });
};
w.enrich = function(a) {
  "object" !== typeof a && (a = [a]);
  for (var b = this.db.transaction("reg", "readonly").objectStore("reg"), c = [], d = 0; d < a.length; d++) {
    c[d] = fc(b.get(a[d]));
  }
  return Promise.all(c).then(function(e) {
    for (var f = 0; f < e.length; f++) {
      e[f] = {id:a[f], doc:e[f] ? JSON.parse(e[f]) : null};
    }
    return e;
  });
};
w.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return fc(a).then(function(b) {
    return !!b;
  });
};
w.search = null;
w.info = function() {
};
w.transaction = function(a, b, c) {
  a += "reg" !== a ? this.field ? ":" + this.field : "" : "";
  var d = this.h[a + ":" + b];
  if (d) {
    return c.call(this, d);
  }
  var e = this.db.transaction(a, b);
  this.h[a + ":" + b] = d = e.objectStore(a);
  var f = c.call(this, d);
  this.h[a + ":" + b] = null;
  return fc(e).finally(function() {
    e = d = null;
    return f;
  });
};
w.commit = function(a, b, c) {
  var d = this, e, f, h;
  return wa(function(g) {
    switch(g.h) {
      case 1:
        if (b) {
          return K(g, d.clear(), 12);
        }
        e = a.commit_task;
        a.commit_task = [];
        f = 0;
        h = void 0;
      case 4:
        if (!(f < e.length)) {
          g.h = 6;
          break;
        }
        h = e[f];
        if (!h.clear) {
          e[f] = h.del;
          g.h = 5;
          break;
        }
        return K(g, d.clear(), 8);
      case 8:
        b = !0;
        g.h = 6;
        break;
      case 5:
        f++;
        g.h = 4;
        break;
      case 6:
        if (b) {
          g.h = 3;
          break;
        }
        c || (e = e.concat(Da(a.reg)));
        if (!e.length) {
          g.h = 10;
          break;
        }
        return K(g, d.remove(e), 11);
      case 11:
      case 10:
        g.h = 3;
        break;
      case 12:
        a.commit_task = [];
      case 3:
        return a.reg.size ? K(g, d.transaction("map", "readwrite", function(k) {
          for (var m = B(a.map), l = m.next(), p = {}; !l.done; p = {P:void 0, Y:void 0}, l = m.next()) {
            l = l.value, p.Y = l[0], p.P = l[1], p.P.length && (b ? k.put(p.P, p.Y) : k.get(p.Y).onsuccess = function(n) {
              return function() {
                var q = this.result, t;
                if (q && q.length) {
                  for (var v = Math.max(q.length, n.P.length), u = 0, z; u < v; u++) {
                    if ((z = n.P[u]) && z.length) {
                      if ((t = q[u]) && t.length) {
                        for (var x = 0; x < z.length; x++) {
                          t.push(z[x]);
                        }
                      } else {
                        q[u] = z;
                      }
                      t = 1;
                    }
                  }
                } else {
                  q = n.P, t = 1;
                }
                t && k.put(q, n.Y);
              };
            }(p));
          }
        }), 13) : g.return();
      case 13:
        return K(g, d.transaction("ctx", "readwrite", function(k) {
          for (var m = B(a.ctx), l = m.next(), p = {}; !l.done; p = {W:void 0}, l = m.next()) {
            l = l.value;
            p.W = l[0];
            l = B(l[1]);
            for (var n = l.next(), q = {}; !n.done; q = {R:void 0, Z:void 0}, n = l.next()) {
              n = n.value, q.Z = n[0], q.R = n[1], q.R.length && (b ? k.put(q.R, p.W + ":" + q.Z) : k.get(p.W + ":" + q.Z).onsuccess = function(t, v) {
                return function() {
                  var u = this.result, z;
                  if (u && u.length) {
                    for (var x = Math.max(u.length, t.R.length), C = 0, D; C < x; C++) {
                      if ((D = t.R[C]) && D.length) {
                        if ((z = u[C]) && z.length) {
                          for (var r = 0; r < D.length; r++) {
                            z.push(D[r]);
                          }
                        } else {
                          u[C] = D;
                        }
                        z = 1;
                      }
                    }
                  } else {
                    u = t.R, z = 1;
                  }
                  z && k.put(u, v.W + ":" + t.Z);
                };
              }(q, p));
            }
          }
        }), 14);
      case 14:
        if (a.store) {
          return K(g, d.transaction("reg", "readwrite", function(k) {
            for (var m = B(a.store), l = m.next(); !l.done; l = m.next()) {
              var p = l.value;
              l = p[0];
              p = p[1];
              k.put("object" === typeof p ? JSON.stringify(p) : 1, l);
            }
          }), 16);
        }
        if (a.bypass) {
          g.h = 16;
          break;
        }
        return K(g, d.transaction("reg", "readwrite", function(k) {
          for (var m = B(a.reg.keys()), l = m.next(); !l.done; l = m.next()) {
            k.put(1, l.value);
          }
        }), 16);
      case 16:
        if (!a.tag) {
          g.h = 20;
          break;
        }
        return K(g, d.transaction("tag", "readwrite", function(k) {
          for (var m = B(a.tag), l = m.next(), p = {}; !l.done; p = {X:void 0, da:void 0}, l = m.next()) {
            l = l.value, p.da = l[0], p.X = l[1], p.X.length && (k.get(p.da).onsuccess = function(n) {
              return function() {
                var q = this.result;
                q = q && q.length ? q.concat(n.X) : n.X;
                k.put(q, n.da);
              };
            }(p));
          }
        }), 20);
      case 20:
        a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear(), g.h = 0;
    }
  });
};
function gc(a, b, c) {
  for (var d = a.value, e, f = 0, h = 0, g; h < d.length; h++) {
    if (g = c ? d : d[h]) {
      for (var k = 0, m; k < b.length; k++) {
        if (m = b[k], m = g.indexOf(m), 0 <= m) {
          if (e = 1, 1 < g.length) {
            g.splice(m, 1);
          } else {
            d[h] = [];
            break;
          }
        }
      }
      f += g.length;
    }
    if (c) {
      break;
    }
  }
  f ? e && a.update(d) : a.delete();
  a.continue();
}
w.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && gc(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && gc(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && gc(c, a, !0);
    };
  }), this.transaction("reg", "readwrite", function(b) {
    for (var c = 0; c < a.length; c++) {
      b.delete(a[c]);
    }
  })]);
};
function fc(a, b) {
  return new Promise(function(c, d) {
    a.onsuccess = a.oncomplete = function() {
      b && b(this.result);
      b = null;
      c(this.result);
    };
    a.onerror = a.onblocked = d;
    a = null;
  });
}
;var hc = {Index:Y, Charset:Ua, Encoder:Ka, Document:pb, Worker:mb, Resolver:Z, IndexedDB:ec, Language:{}}, ic = "undefined" !== typeof self ? self : "undefined" !== typeof global ? global : self, jc;
(jc = ic.define) && jc.amd ? jc([], function() {
  return hc;
}) : "object" === typeof ic.exports ? ic.exports = hc : ic.FlexSearch = hc;
}(this||self));
