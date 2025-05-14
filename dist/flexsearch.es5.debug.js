/**!
 * FlexSearch.js v0.8.165 (ES5/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;
var v;
function ca(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
}
function A(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (b) {
    return b.call(a);
  }
  if ("number" == typeof a.length) {
    return {next:ca(a)};
  }
  throw Error(String(a) + " is not an iterable or ArrayLike");
}
var da = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  if (a == Array.prototype || a == Object.prototype) {
    return a;
  }
  a[b] = c.value;
  return a;
};
function ea(a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) {
      return c;
    }
  }
  throw Error("Cannot find global object");
}
var fa = ea(this);
function H(a, b) {
  if (b) {
    a: {
      var c = fa;
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
      b != d && null != b && da(c, a, {configurable:!0, writable:!0, value:b});
    }
  }
}
var ha;
if ("function" == typeof Object.setPrototypeOf) {
  ha = Object.setPrototypeOf;
} else {
  var ia;
  a: {
    var ja = {a:!0}, ka = {};
    try {
      ka.__proto__ = ja;
      ia = ka.a;
      break a;
    } catch (a) {
    }
    ia = !1;
  }
  ha = ia ? function(a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) {
      throw new TypeError(a + " is not extensible");
    }
    return a;
  } : null;
}
var la = ha;
function na() {
  this.C = !1;
  this.A = null;
  this.D = void 0;
  this.h = 1;
  this.H = 0;
  this.B = null;
}
function oa(a) {
  if (a.C) {
    throw new TypeError("Generator is already running");
  }
  a.C = !0;
}
na.prototype.G = function(a) {
  this.D = a;
};
function pa(a, b) {
  a.B = {ka:b, la:!0};
  a.h = a.H;
}
na.prototype.return = function(a) {
  this.B = {return:a};
  this.h = this.H;
};
function L(a, b, c) {
  a.h = c;
  return {value:b};
}
function qa(a) {
  this.h = new na();
  this.A = a;
}
function ra(a, b) {
  oa(a.h);
  var c = a.h.A;
  if (c) {
    return sa(a, "return" in c ? c["return"] : function(d) {
      return {value:d, done:!0};
    }, b, a.h.return);
  }
  a.h.return(b);
  return ta(a);
}
function sa(a, b, c, d) {
  try {
    var e = b.call(a.h.A, c);
    if (!(e instanceof Object)) {
      throw new TypeError("Iterator result " + e + " is not an object");
    }
    if (!e.done) {
      return a.h.C = !1, e;
    }
    var f = e.value;
  } catch (g) {
    return a.h.A = null, pa(a.h, g), ta(a);
  }
  a.h.A = null;
  d.call(a.h, f);
  return ta(a);
}
function ta(a) {
  for (; a.h.h;) {
    try {
      var b = a.A(a.h);
      if (b) {
        return a.h.C = !1, {value:b.value, done:!1};
      }
    } catch (c) {
      a.h.D = void 0, pa(a.h, c);
    }
  }
  a.h.C = !1;
  if (a.h.B) {
    b = a.h.B;
    a.h.B = null;
    if (b.la) {
      throw b.ka;
    }
    return {value:b.return, done:!0};
  }
  return {value:void 0, done:!0};
}
function ua(a) {
  this.next = function(b) {
    oa(a.h);
    a.h.A ? b = sa(a, a.h.A.next, b, a.h.G) : (a.h.G(b), b = ta(a));
    return b;
  };
  this.throw = function(b) {
    oa(a.h);
    a.h.A ? b = sa(a, a.h.A["throw"], b, a.h.G) : (pa(a.h, b), b = ta(a));
    return b;
  };
  this.return = function(b) {
    return ra(a, b);
  };
  this[Symbol.iterator] = function() {
    return this;
  };
}
function va(a, b) {
  b = new ua(new qa(b));
  la && a.prototype && la(b, a.prototype);
  return b;
}
function wa(a) {
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
}
function xa(a) {
  return wa(new ua(new qa(a)));
}
H("Symbol", function(a) {
  function b(f) {
    if (this instanceof b) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new c(d + (f || "") + "_" + e++, f);
  }
  function c(f, g) {
    this.h = f;
    da(this, "description", {configurable:!0, writable:!0, value:g});
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
    var d = fa[b[c]];
    "function" === typeof d && "function" != typeof d.prototype[a] && da(d.prototype, a, {configurable:!0, writable:!0, value:function() {
      return ya(ca(this));
    }});
  }
  return a;
});
function ya(a) {
  a = {next:a};
  a[Symbol.iterator] = function() {
    return this;
  };
  return a;
}
H("Promise", function(a) {
  function b(g) {
    this.A = 0;
    this.B = void 0;
    this.h = [];
    this.H = !1;
    var h = this.C();
    try {
      g(h.resolve, h.reject);
    } catch (k) {
      h.reject(k);
    }
  }
  function c() {
    this.h = null;
  }
  function d(g) {
    return g instanceof b ? g : new b(function(h) {
      h(g);
    });
  }
  if (a) {
    return a;
  }
  c.prototype.A = function(g) {
    if (null == this.h) {
      this.h = [];
      var h = this;
      this.B(function() {
        h.D();
      });
    }
    this.h.push(g);
  };
  var e = fa.setTimeout;
  c.prototype.B = function(g) {
    e(g, 0);
  };
  c.prototype.D = function() {
    for (; this.h && this.h.length;) {
      var g = this.h;
      this.h = [];
      for (var h = 0; h < g.length; ++h) {
        var k = g[h];
        g[h] = null;
        try {
          k();
        } catch (l) {
          this.C(l);
        }
      }
    }
    this.h = null;
  };
  c.prototype.C = function(g) {
    this.B(function() {
      throw g;
    });
  };
  b.prototype.C = function() {
    function g(l) {
      return function(m) {
        k || (k = !0, l.call(h, m));
      };
    }
    var h = this, k = !1;
    return {resolve:g(this.fa), reject:g(this.D)};
  };
  b.prototype.fa = function(g) {
    if (g === this) {
      this.D(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (g instanceof b) {
        this.ha(g);
      } else {
        a: {
          switch(typeof g) {
            case "object":
              var h = null != g;
              break a;
            case "function":
              h = !0;
              break a;
            default:
              h = !1;
          }
        }
        h ? this.ea(g) : this.G(g);
      }
    }
  };
  b.prototype.ea = function(g) {
    var h = void 0;
    try {
      h = g.then;
    } catch (k) {
      this.D(k);
      return;
    }
    "function" == typeof h ? this.ia(h, g) : this.G(g);
  };
  b.prototype.D = function(g) {
    this.M(2, g);
  };
  b.prototype.G = function(g) {
    this.M(1, g);
  };
  b.prototype.M = function(g, h) {
    if (0 != this.A) {
      throw Error("Cannot settle(" + g + ", " + h + "): Promise already settled in state" + this.A);
    }
    this.A = g;
    this.B = h;
    2 === this.A && this.ga();
    this.N();
  };
  b.prototype.ga = function() {
    var g = this;
    e(function() {
      if (g.T()) {
        var h = fa.console;
        "undefined" !== typeof h && h.error(g.B);
      }
    }, 1);
  };
  b.prototype.T = function() {
    if (this.H) {
      return !1;
    }
    var g = fa.CustomEvent, h = fa.Event, k = fa.dispatchEvent;
    if ("undefined" === typeof k) {
      return !0;
    }
    "function" === typeof g ? g = new g("unhandledrejection", {cancelable:!0}) : "function" === typeof h ? g = new h("unhandledrejection", {cancelable:!0}) : (g = fa.document.createEvent("CustomEvent"), g.initCustomEvent("unhandledrejection", !1, !0, g));
    g.promise = this;
    g.reason = this.B;
    return k(g);
  };
  b.prototype.N = function() {
    if (null != this.h) {
      for (var g = 0; g < this.h.length; ++g) {
        f.A(this.h[g]);
      }
      this.h = null;
    }
  };
  var f = new c();
  b.prototype.ha = function(g) {
    var h = this.C();
    g.U(h.resolve, h.reject);
  };
  b.prototype.ia = function(g, h) {
    var k = this.C();
    try {
      g.call(h, k.resolve, k.reject);
    } catch (l) {
      k.reject(l);
    }
  };
  b.prototype.then = function(g, h) {
    function k(p, n) {
      return "function" == typeof p ? function(r) {
        try {
          l(p(r));
        } catch (u) {
          m(u);
        }
      } : n;
    }
    var l, m, q = new b(function(p, n) {
      l = p;
      m = n;
    });
    this.U(k(g, l), k(h, m));
    return q;
  };
  b.prototype.catch = function(g) {
    return this.then(void 0, g);
  };
  b.prototype.U = function(g, h) {
    function k() {
      switch(l.A) {
        case 1:
          g(l.B);
          break;
        case 2:
          h(l.B);
          break;
        default:
          throw Error("Unexpected state: " + l.A);
      }
    }
    var l = this;
    null == this.h ? f.A(k) : this.h.push(k);
    this.H = !0;
  };
  b.resolve = d;
  b.reject = function(g) {
    return new b(function(h, k) {
      k(g);
    });
  };
  b.race = function(g) {
    return new b(function(h, k) {
      for (var l = A(g), m = l.next(); !m.done; m = l.next()) {
        d(m.value).U(h, k);
      }
    });
  };
  b.all = function(g) {
    var h = A(g), k = h.next();
    return k.done ? d([]) : new b(function(l, m) {
      function q(r) {
        return function(u) {
          p[r] = u;
          n--;
          0 == n && l(p);
        };
      }
      var p = [], n = 0;
      do {
        p.push(void 0), n++, d(k.value).U(q(p.length - 1), m), k = h.next();
      } while (!k.done);
    });
  };
  return b;
});
function za(a, b) {
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
    return za(this, function(b, c) {
      return c;
    });
  };
});
H("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return za(this, function(b) {
      return b;
    });
  };
});
function Aa(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
}
H("WeakMap", function(a) {
  function b(k) {
    this.h = (h += Math.random() + 1).toString();
    if (k) {
      k = A(k);
      for (var l; !(l = k.next()).done;) {
        l = l.value, this.set(l[0], l[1]);
      }
    }
  }
  function c() {
  }
  function d(k) {
    var l = typeof k;
    return "object" === l && null !== k || "function" === l;
  }
  function e(k) {
    if (!Aa(k, g)) {
      var l = new c();
      da(k, g, {value:l});
    }
  }
  function f(k) {
    var l = Object[k];
    l && (Object[k] = function(m) {
      if (m instanceof c) {
        return m;
      }
      Object.isExtensible(m) && e(m);
      return l(m);
    });
  }
  if (function() {
    if (!a || !Object.seal) {
      return !1;
    }
    try {
      var k = Object.seal({}), l = Object.seal({}), m = new a([[k, 2], [l, 3]]);
      if (2 != m.get(k) || 3 != m.get(l)) {
        return !1;
      }
      m.delete(k);
      m.set(l, 4);
      return !m.has(k) && 4 == m.get(l);
    } catch (q) {
      return !1;
    }
  }()) {
    return a;
  }
  var g = "$jscomp_hidden_" + Math.random();
  f("freeze");
  f("preventExtensions");
  f("seal");
  var h = 0;
  b.prototype.set = function(k, l) {
    if (!d(k)) {
      throw Error("Invalid WeakMap key");
    }
    e(k);
    if (!Aa(k, g)) {
      throw Error("WeakMap key fail: " + k);
    }
    k[g][this.h] = l;
    return this;
  };
  b.prototype.get = function(k) {
    return d(k) && Aa(k, g) ? k[g][this.h] : void 0;
  };
  b.prototype.has = function(k) {
    return d(k) && Aa(k, g) && Aa(k[g], this.h);
  };
  b.prototype.delete = function(k) {
    return d(k) && Aa(k, g) && Aa(k[g], this.h) ? delete k[g][this.h] : !1;
  };
  return b;
});
H("Map", function(a) {
  function b() {
    var h = {};
    return h.J = h.next = h.head = h;
  }
  function c(h, k) {
    var l = h[1];
    return ya(function() {
      if (l) {
        for (; l.head != h[1];) {
          l = l.J;
        }
        for (; l.next != l.head;) {
          return l = l.next, {done:!1, value:k(l)};
        }
        l = null;
      }
      return {done:!0, value:void 0};
    });
  }
  function d(h, k) {
    var l = k && typeof k;
    "object" == l || "function" == l ? f.has(k) ? l = f.get(k) : (l = "" + ++g, f.set(k, l)) : l = "p_" + k;
    var m = h[0][l];
    if (m && Aa(h[0], l)) {
      for (h = 0; h < m.length; h++) {
        var q = m[h];
        if (k !== k && q.key !== q.key || k === q.key) {
          return {id:l, list:m, index:h, F:q};
        }
      }
    }
    return {id:l, list:m, index:-1, F:void 0};
  }
  function e(h) {
    this[0] = {};
    this[1] = b();
    this.size = 0;
    if (h) {
      h = A(h);
      for (var k; !(k = h.next()).done;) {
        k = k.value, this.set(k[0], k[1]);
      }
    }
  }
  if (function() {
    if (!a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) {
      return !1;
    }
    try {
      var h = Object.seal({x:4}), k = new a(A([[h, "s"]]));
      if ("s" != k.get(h) || 1 != k.size || k.get({x:4}) || k.set({x:4}, "t") != k || 2 != k.size) {
        return !1;
      }
      var l = k.entries(), m = l.next();
      if (m.done || m.value[0] != h || "s" != m.value[1]) {
        return !1;
      }
      m = l.next();
      return m.done || 4 != m.value[0].x || "t" != m.value[1] || !l.next().done ? !1 : !0;
    } catch (q) {
      return !1;
    }
  }()) {
    return a;
  }
  var f = new WeakMap();
  e.prototype.set = function(h, k) {
    h = 0 === h ? 0 : h;
    var l = d(this, h);
    l.list || (l.list = this[0][l.id] = []);
    l.F ? l.F.value = k : (l.F = {next:this[1], J:this[1].J, head:this[1], key:h, value:k}, l.list.push(l.F), this[1].J.next = l.F, this[1].J = l.F, this.size++);
    return this;
  };
  e.prototype.delete = function(h) {
    h = d(this, h);
    return h.F && h.list ? (h.list.splice(h.index, 1), h.list.length || delete this[0][h.id], h.F.J.next = h.F.next, h.F.next.J = h.F.J, h.F.head = null, this.size--, !0) : !1;
  };
  e.prototype.clear = function() {
    this[0] = {};
    this[1] = this[1].J = b();
    this.size = 0;
  };
  e.prototype.has = function(h) {
    return !!d(this, h).F;
  };
  e.prototype.get = function(h) {
    return (h = d(this, h).F) && h.value;
  };
  e.prototype.entries = function() {
    return c(this, function(h) {
      return [h.key, h.value];
    });
  };
  e.prototype.keys = function() {
    return c(this, function(h) {
      return h.key;
    });
  };
  e.prototype.values = function() {
    return c(this, function(h) {
      return h.value;
    });
  };
  e.prototype.forEach = function(h, k) {
    for (var l = this.entries(), m; !(m = l.next()).done;) {
      m = m.value, h.call(k, m[1], m[0], this);
    }
  };
  e.prototype[Symbol.iterator] = e.prototype.entries;
  var g = 0;
  return e;
});
H("Set", function(a) {
  function b(c) {
    this.h = new Map();
    if (c) {
      c = A(c);
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
      var c = Object.seal({x:4}), d = new a(A([c]));
      if (!d.has(c) || 1 != d.size || d.add(c) != d || 1 != d.size || d.add({x:4}) != d || 2 != d.size) {
        return !1;
      }
      var e = d.entries(), f = e.next();
      if (f.done || f.value[0] != c || f.value[1] != c) {
        return !1;
      }
      f = e.next();
      return f.done || f.value[0] == c || 4 != f.value[0].x || f.value[1] != f.value[0] ? !1 : e.next().done;
    } catch (g) {
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
H("Array.prototype.entries", function(a) {
  return a ? a : function() {
    return za(this, function(b, c) {
      return [b, c];
    });
  };
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
var Ba = "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var d = arguments[c];
    if (d) {
      for (var e in d) {
        Aa(d, e) && (a[e] = d[e]);
      }
    }
  }
  return a;
};
H("Object.assign", function(a) {
  return a || Ba;
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
            d = A(a);
            for (e = d.next(); !e.done; e = d.next()) {
              e = e.value, b.set(e[0], e[1]);
            }
            return b;
          }
          if (b === Set) {
            b = new Set(c);
            d = A(a.values());
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
function Ca(a, b) {
  return "undefined" === typeof a ? b : a;
}
function S() {
  return Object.create(null);
}
function T(a) {
  return "string" === typeof a;
}
function Da(a) {
  return "object" === typeof a;
}
function Ea(a) {
  var b = [];
  a = A(a.keys());
  for (var c = a.next(); !c.done; c = a.next()) {
    b.push(c.value);
  }
  return b;
}
function Fa(a, b) {
  if (T(b)) {
    a = a[b];
  } else {
    for (var c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function Ga(a) {
  for (var b = 0, c = 0, d = void 0; c < a.length; c++) {
    (d = a[c]) && b < d.length && (b = d.length);
  }
  return b;
}
;var Ha = /[^\p{L}\p{N}]+/u, Ia = /(\d{3})/g, Ja = /(\D)(\d{3})/g, Ka = /(\d{3})(\D)/g, La = /[\u0300-\u036f]/g;
function Ma(a) {
  a = void 0 === a ? {} : a;
  if (!this || this.constructor !== Ma) {
    var b = Function.prototype.bind, c = b.apply, d = [null], e = d.concat;
    if (arguments instanceof Array) {
      var f = arguments;
    } else {
      f = A(arguments);
      for (var g, h = []; !(g = f.next()).done;) {
        h.push(g.value);
      }
      f = h;
    }
    return new (c.call(b, Ma, e.call(d, f)))();
  }
  if (arguments.length) {
    for (b = 0; b < arguments.length; b++) {
      this.assign(arguments[b]);
    }
  } else {
    this.assign(a);
  }
}
v = Ma.prototype;
v.assign = function(a) {
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
      this.split = P(this.split, Ha);
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
    this.D = null, this.T = "number" === typeof c ? c : 2e5, this.B = new Map(), this.C = new Map(), this.H = this.G = 128;
  }
  this.h = "";
  this.M = null;
  this.A = "";
  this.N = null;
  if (this.matcher) {
    for (a = A(this.matcher.keys()), b = a.next(); !b.done; b = a.next()) {
      this.h += (this.h ? "|" : "") + b.value;
    }
  }
  if (this.stemmer) {
    for (a = A(this.stemmer.keys()), b = a.next(); !b.done; b = a.next()) {
      this.A += (this.A ? "|" : "") + b.value;
    }
  }
  return this;
};
v.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.A += (this.A ? "|" : "") + a;
  this.N = null;
  this.cache && Na(this);
  return this;
};
v.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && Na(this);
  return this;
};
v.addMapper = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (1 < a.length) {
    return this.addMatcher(a, b);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, b);
  this.cache && Na(this);
  return this;
};
v.addMatcher = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (2 > a.length && (this.dedupe || this.mapper)) {
    return this.addMapper(a, b);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, b);
  this.h += (this.h ? "|" : "") + a;
  this.M = null;
  this.cache && Na(this);
  return this;
};
v.addReplacer = function(a, b) {
  if ("string" === typeof a) {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && Na(this);
  return this;
};
v.encode = function(a, b) {
  var c = this;
  if (this.cache && a.length <= this.G) {
    if (this.D) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.D = setTimeout(Na, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = La ? a.normalize("NFKD").replace(La, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(Ja, "$1 $2").replace(Ka, "$1 $2").replace(Ia, "$1 "));
  for (var d = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer), e = [], f = S(), g, h, k = this.split || "" === this.split ? a.split(this.split) : [a], l = 0, m = void 0, q = void 0; l < k.length; l++) {
    if ((m = q = k[l]) && !(m.length < this.minlength || m.length > this.maxlength)) {
      if (b) {
        if (f[m]) {
          continue;
        }
        f[m] = 1;
      } else {
        if (g === m) {
          continue;
        }
        g = m;
      }
      if (d) {
        e.push(m);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(m) : !this.filter.has(m))) {
          if (this.cache && m.length <= this.H) {
            if (this.D) {
              var p = this.C.get(m);
              if (p || "" === p) {
                p && e.push(p);
                continue;
              }
            } else {
              this.D = setTimeout(Na, 50, this);
            }
          }
          if (this.stemmer) {
            for (this.N || (this.N = new RegExp("(?!^)(" + this.A + ")$")), p = void 0; p !== m && 2 < m.length;) {
              p = m, m = m.replace(this.N, function(w) {
                return c.stemmer.get(w);
              });
            }
          }
          if (m && (this.mapper || this.dedupe && 1 < m.length)) {
            p = "";
            for (var n = 0, r = "", u = void 0, x = void 0; n < m.length; n++) {
              u = m.charAt(n), u === r && this.dedupe || ((x = this.mapper && this.mapper.get(u)) || "" === x ? x === r && this.dedupe || !(r = x) || (p += x) : p += r = u);
            }
            m = p;
          }
          this.matcher && 1 < m.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), m = m.replace(this.M, function(w) {
            return c.matcher.get(w);
          }));
          if (m && this.replacer) {
            for (p = 0; m && p < this.replacer.length; p += 2) {
              m = m.replace(this.replacer[p], this.replacer[p + 1]);
            }
          }
          this.cache && q.length <= this.H && (this.C.set(q, m), this.C.size > this.T && (this.C.clear(), this.H = this.H / 1.1 | 0));
          if (m) {
            if (m !== q) {
              if (b) {
                if (f[m]) {
                  continue;
                }
                f[m] = 1;
              } else {
                if (h === m) {
                  continue;
                }
                h = m;
              }
            }
            e.push(m);
          }
        }
      }
    }
  }
  this.finalize && (e = this.finalize(e) || e);
  this.cache && a.length <= this.G && (this.B.set(a, e), this.B.size > this.T && (this.B.clear(), this.G = this.G / 1.1 | 0));
  return e;
};
function Na(a) {
  a.D = null;
  a.B.clear();
  a.C.clear();
}
;var Oa, Pa;
function Qa(a) {
  var b, c, d, e, f, g;
  return xa(function(h) {
    switch(h.h) {
      case 1:
        a = a.data;
        b = a.task;
        c = a.id;
        d = a.args;
        switch(b) {
          case "init":
            Pa = a.options || {};
            (e = a.factory) ? (Function("return " + e)()(self), Oa = new self.FlexSearch.Index(Pa), delete self.FlexSearch) : Oa = new W(Pa);
            postMessage({id:c});
            break;
          default:
            h.h = 2;
            return;
        }h.h = 0;
        break;
      case 2:
        if ("export" === b) {
          if (!Pa.export || "function" !== typeof Pa.export) {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
          }
          d[1] ? (d[0] = Pa.export, d[2] = 0, d[3] = 1) : d = null;
        }
        if ("import" === b) {
          if (!Pa.import || "function" !== typeof Pa.import) {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
          }
          if (!d[0]) {
            h.h = 5;
            break;
          }
          return L(h, Pa.import.call(Oa, d[0]), 9);
        }
        f = d && Oa[b].apply(Oa, d);
        if (!f || !f.then) {
          h.h = 5;
          break;
        }
        return L(h, f, 7);
      case 7:
        f = h.D;
        h.h = 5;
        break;
      case 9:
        g = h.D, Oa.import(d[0], g);
      case 5:
        postMessage("search" === b ? {id:c, msg:f} : {id:c}), h.h = 0;
    }
  });
}
;function Ra(a) {
  Sa.call(a, "add");
  Sa.call(a, "append");
  Sa.call(a, "search");
  Sa.call(a, "update");
  Sa.call(a, "remove");
  Sa.call(a, "searchCache");
}
var Ta, Ua, Va;
function Wa() {
  Ta = Va = 0;
}
function Sa(a) {
  this[a + "Async"] = function() {
    var b = arguments, c = b[b.length - 1];
    if ("function" === typeof c) {
      var d = c;
      delete b[b.length - 1];
    }
    Ta ? Va || (Va = Date.now() - Ua >= this.priority * this.priority * 3) : (Ta = setTimeout(Wa, 0), Ua = Date.now());
    if (Va) {
      var e = this;
      return new Promise(function(g) {
        setTimeout(function() {
          g(e[a + "Async"].apply(e, b));
        }, 0);
      });
    }
    var f = this[a].apply(this, b);
    c = f.then ? f : new Promise(function(g) {
      return g(f);
    });
    d && c.then(d);
    return c;
  };
}
;var Xa = 0;
function Ya(a, b) {
  function c(h) {
    function k(l) {
      l = l.data || l;
      var m = l.id, q = m && f.h[m];
      q && (q(l.msg), delete f.h[m]);
    }
    this.worker = h;
    this.h = S();
    if (this.worker) {
      e ? this.worker.on("message", k) : this.worker.onmessage = k;
      if (a.config) {
        return new Promise(function(l) {
          f.h[++Xa] = function() {
            l(f);
            1e9 < Xa && (Xa = 0);
          };
          f.worker.postMessage({id:Xa, task:"init", factory:d, options:a});
        });
      }
      this.priority = a.priority || 4;
      this.encoder = b || null;
      this.worker.postMessage({task:"init", factory:d, options:a});
      return this;
    }
  }
  a = void 0 === a ? {} : a;
  if (!this || this.constructor !== Ya) {
    return new Ya(a);
  }
  var d = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  d && (d = d.toString());
  var e = "undefined" === typeof window, f = this, g = Za(d, e, a.worker);
  return g.then ? g.then(function(h) {
    return c.call(f, h);
  }) : c.call(this, g);
}
$a("add");
$a("append");
$a("search");
$a("searchCache");
$a("update");
$a("remove");
$a("clear");
$a("export");
$a("import");
Ra(Ya.prototype);
function $a(a) {
  Ya.prototype[a] = function() {
    var b = this, c = [].slice.call(arguments), d = c[c.length - 1];
    if ("function" === typeof d) {
      var e = d;
      c.pop();
    }
    d = new Promise(function(f) {
      "export" === a && "function" === typeof c[0] && (c[0] = null);
      b.h[++Xa] = f;
      b.worker.postMessage({task:a, id:Xa, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function Za(a, b, c) {
  return b ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + Qa.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof c ? c : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function ab(a, b) {
  b = void 0 === b ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 5000 | 0);
  a = A(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    d.push(e.value), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function bb(a, b) {
  b || (b = new Map());
  for (var c = 0, d; c < a.length; c++) {
    d = a[c], b.set(d[0], d[1]);
  }
  return b;
}
function cb(a, b) {
  b = void 0 === b ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 1000 | 0);
  a = A(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    e = e.value, d.push([e[0], ab(e[1])[0]]), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function db(a, b) {
  b || (b = new Map());
  for (var c = 0, d, e; c < a.length; c++) {
    d = a[c], e = b.get(d[0]), b.set(d[0], bb(d[1], e));
  }
  return b;
}
function eb(a) {
  var b = [], c = [];
  a = A(a.keys());
  for (var d = a.next(); !d.done; d = a.next()) {
    c.push(d.value), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function fb(a, b) {
  b || (b = new Set());
  for (var c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function gb(a, b, c, d, e, f, g) {
  g = void 0 === g ? 0 : g;
  var h = d && d.constructor === Array, k = h ? d.shift() : d;
  if (!k) {
    return this.export(a, b, e, f + 1);
  }
  if ((k = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(k))) && k.then) {
    var l = this;
    return k.then(function() {
      return gb.call(l, a, b, c, h ? d : null, e, f, g + 1);
    });
  }
  return gb.call(this, a, b, c, h ? d : null, e, f, g + 1);
}
function hb(a, b) {
  var c = "";
  a = A(a.entries());
  for (var d = a.next(); !d.done; d = a.next()) {
    var e = d.value;
    d = e[0];
    e = e[1];
    for (var f = "", g = 0, h; g < e.length; g++) {
      h = e[g] || [""];
      for (var k = "", l = 0; l < h.length; l++) {
        k += (k ? "," : "") + ("string" === b ? '"' + h[l] + '"' : h[l]);
      }
      k = "[" + k + "]";
      f += (f ? "," : "") + k;
    }
    f = '["' + d + '",[' + f + "]]";
    c += (c ? "," : "") + f;
  }
  return c;
}
;function ib(a, b, c, d) {
  for (var e = [], f = 0, g; f < a.index.length; f++) {
    if (g = a.index[f], b >= g.length) {
      b -= g.length;
    } else {
      b = g[d ? "splice" : "slice"](b, c);
      if (g = b.length) {
        if (e = e.length ? e.concat(b) : b, c -= g, d && (a.length -= g), !c) {
          break;
        }
      }
      b = 0;
    }
  }
  return e;
}
function jb(a) {
  if (!this || this.constructor !== jb) {
    return new jb(a);
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
        for (var f = 0, g = 0, h, k; g < b.index.length; g++) {
          h = b.index[g];
          k = h.indexOf(e);
          if (0 <= k) {
            return f + k;
          }
          f += h.length;
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
        return ib(b, e || 0, f || b.length, !1);
      };
    }
    if ("splice" === d) {
      return function(e, f) {
        return ib(b, e || 0, f || b.length, !0);
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
jb.prototype.clear = function() {
  this.index.length = 0;
};
jb.prototype.destroy = function() {
  this.proxy = this.index = null;
};
jb.prototype.push = function() {
};
function X(a) {
  a = void 0 === a ? 8 : a;
  if (!this || this.constructor !== X) {
    return new X(a);
  }
  this.index = S();
  this.h = [];
  this.size = 0;
  32 < a ? (this.A = kb, this.B = BigInt(a)) : (this.A = lb, this.B = a);
}
X.prototype.get = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.get(a);
};
X.prototype.set = function(a, b) {
  var c = this.A(a), d = this.index[c];
  d ? (c = d.size, d.set(a, b), (c -= d.size) && this.size++) : (this.index[c] = d = new Map([[a, b]]), this.h.push(d), this.size++);
};
function Y(a) {
  a = void 0 === a ? 8 : a;
  if (!this || this.constructor !== Y) {
    return new Y(a);
  }
  this.index = S();
  this.h = [];
  this.size = 0;
  32 < a ? (this.A = kb, this.B = BigInt(a)) : (this.A = lb, this.B = a);
}
Y.prototype.add = function(a) {
  var b = this.A(a), c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c), this.size++);
};
v = X.prototype;
v.has = Y.prototype.has = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.has(a);
};
v.delete = Y.prototype.delete = function(a) {
  var b = this.A(a);
  (b = this.index[b]) && b.delete(a) && this.size--;
};
v.clear = Y.prototype.clear = function() {
  this.index = S();
  this.h = [];
  this.size = 0;
};
v.values = Y.prototype.values = function mb() {
  var b, c = this, d, e, f;
  return va(mb, function(g) {
    switch(g.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          g.h = 0;
          break;
        }
        d = A(c.h[b].values());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          g.h = 2;
          break;
        }
        f = e.value;
        return L(g, f, 6);
      case 6:
        e = d.next(), g.h = 5;
    }
  });
};
v.keys = Y.prototype.keys = function nb() {
  var b, c = this, d, e, f;
  return va(nb, function(g) {
    switch(g.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          g.h = 0;
          break;
        }
        d = A(c.h[b].keys());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          g.h = 2;
          break;
        }
        f = e.value;
        return L(g, f, 6);
      case 6:
        e = d.next(), g.h = 5;
    }
  });
};
v.entries = Y.prototype.entries = function ob() {
  var b, c = this, d, e, f;
  return va(ob, function(g) {
    switch(g.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          g.h = 0;
          break;
        }
        d = A(c.h[b].entries());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          g.h = 2;
          break;
        }
        f = e.value;
        return L(g, f, 6);
      case 6:
        e = d.next(), g.h = 5;
    }
  });
};
function lb(a) {
  var b = Math.pow(2, this.B) - 1;
  if ("number" == typeof a) {
    return a & b;
  }
  for (var c = 0, d = this.B + 1, e = 0; e < a.length; e++) {
    c = (c * d ^ a.charCodeAt(e)) & b;
  }
  return 32 === this.B ? c + Math.pow(2, 31) : c;
}
function kb() {
  throw Error("The keystore is limited to 32 for EcmaScript5");
}
;pb.prototype.add = function(a, b, c) {
  Da(a) && (b = a, a = Fa(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (var d = 0, e; d < this.field.length; d++) {
      e = this.L[d];
      var f = this.index.get(this.field[d]);
      if ("function" === typeof e) {
        (e = e(b)) && f.add(a, e, !1, !0);
      } else {
        var g = e.R;
        if (!g || g(b)) {
          e.constructor === String ? e = ["" + e] : T(e) && (e = [e]), qb(b, e, this.S, 0, f, a, e[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.K.length; d++) {
        g = this.K[d];
        var h = this.aa[d];
        f = this.tag.get(h);
        e = S();
        if ("function" === typeof g) {
          if (g = g(b), !g) {
            continue;
          }
        } else {
          var k = g.R;
          if (k && !k(b)) {
            continue;
          }
          g.constructor === String && (g = "" + g);
          g = Fa(b, g);
        }
        if (f && g) {
          for (T(g) && (g = [g]), h = 0, k = void 0; h < g.length; h++) {
            var l = g[h];
            if (!e[l]) {
              e[l] = 1;
              var m;
              (m = f.get(l)) ? k = m : f.set(l, k = []);
              if (!c || !k.includes(a)) {
                if (k.length === Math.pow(2, 31) - 1) {
                  m = new jb(k);
                  if (this.fastupdate) {
                    for (var q = A(this.reg.values()), p = q.next(); !p.done; p = q.next()) {
                      p = p.value, p.includes(k) && (p[p.indexOf(k)] = m);
                    }
                  }
                  f.set(l, k = m);
                }
                k.push(a);
                this.fastupdate && ((l = this.reg.get(a)) ? l.push(k) : this.reg.set(a, [k]));
              }
            }
          }
        } else {
          f || console.warn("Tag '" + h + "' was not found");
        }
      }
    }
    if (this.store && (!c || !this.store.has(a))) {
      if (this.I) {
        var n = S();
        for (c = 0; c < this.I.length; c++) {
          if (d = this.I[c], f = d.R, !f || f(b)) {
            f = void 0;
            if ("function" === typeof d) {
              f = d(b);
              if (!f) {
                continue;
              }
              d = [d.ja];
            } else if (T(d) || d.constructor === String) {
              n[d] = b[d];
              continue;
            }
            rb(b, n, d, 0, d[0], f);
          }
        }
      }
      this.store.set(a, n || b);
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
function qb(a, b, c, d, e, f, g, h) {
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
      e.add(f, a, h, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          qb(a, b, c, d, e, f, g, h);
        }
      } else {
        g = b[++d], qb(a, b, c, d, e, f, g, h);
      }
    }
  } else {
    e.db && e.remove(f);
  }
}
;function sb(a, b, c, d) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a, d ? tb.call(this, a) : a;
  }
  for (var e = [], f = 0, g = void 0, h = void 0; f < a.length; f++) {
    if ((g = a[f]) && (h = g.length)) {
      if (c) {
        if (c >= h) {
          c -= h;
          continue;
        }
        c < h && (g = b ? g.slice(c, c + b) : g.slice(c), h = g.length, c = 0);
      }
      h > b && (g = g.slice(0, b), h = b);
      if (!e.length && h >= b) {
        return d ? tb.call(this, g) : g;
      }
      e.push(g);
      b -= h;
      if (!b) {
        break;
      }
    }
  }
  e = 1 < e.length ? [].concat.apply([], e) : e[0];
  return d ? tb.call(this, e) : e;
}
;function ub(a, b, c) {
  var d = c[0];
  if (d.then) {
    return Promise.all(c).then(function(x) {
      return a[b].apply(a, x);
    });
  }
  if (d[0] && d[0].index) {
    return a[b].apply(a, d);
  }
  d = [];
  for (var e = [], f = 0, g = 0, h, k, l, m, q, p = 0, n = void 0; p < c.length; p++) {
    if (n = c[p]) {
      var r = void 0;
      if (n.constructor === Z) {
        r = n.result;
      } else if (n.constructor === Array) {
        r = n;
      } else {
        if (f = n.limit || 0, g = n.offset || 0, l = n.suggest, k = n.resolve, h = (m = n.highlight && k) || n.enrich && k, r = void 0, n.index ? a.index = r = n.index : r = a.index, n.query || n.tag) {
          if (!a.index) {
            throw Error("Resolver can't apply because the corresponding Index was never specified");
          }
          var u = n.field || n.pluck;
          if (u) {
            if (!a.index.index) {
              throw Error("Resolver can't apply because the corresponding Document Index was not specified");
            }
            r = a.index.index.get(u);
            if (!r) {
              throw Error("Resolver can't apply because the specified Document Field '" + u + "' was not found");
            }
          }
          n.resolve = !1;
          r = r.search(n).result;
          n.resolve = k;
          m && (q = n.query);
        } else if (n.and) {
          r = a.and(n.and);
        } else if (n.or) {
          r = a.or(n.or);
        } else if (n.xor) {
          r = a.xor(n.xor);
        } else if (n.not) {
          r = a.not(n.not);
        } else {
          continue;
        }
      }
      if (r.then) {
        e.push(r);
      } else if (r.length) {
        d[p] = r;
      } else if (!l && ("and" === b || "xor" === b)) {
        d = [];
        break;
      }
    }
  }
  return {W:d, $:e, limit:f, offset:g, enrich:h, resolve:k, suggest:l, highlight:m, ma:q};
}
;Z.prototype.or = function() {
  var a = ub(this, "or", arguments);
  return vb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve);
};
function vb(a, b, c, d, e, f) {
  if (b.length) {
    var g = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (var k = 0, l = void 0; k < h.length; k++) {
        (l = h[k]).length && (a[k] = l);
      }
      return vb.call(g, a, [], c, d, e, f);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = wb(a, c, d, !1, this.h), d = 0));
  return f ? this.resolve(c, d, e) : this;
}
;Z.prototype.and = function() {
  var a = this.result.length;
  if (!a) {
    var b = arguments[0];
    if (b) {
      a = !!b.suggest;
      var c = b.resolve;
      var d = b.limit;
      var e = b.offset;
      var f = b.enrich && c;
    }
  }
  return a ? (a = ub(this, "and", arguments), xb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest)) : c ? this.resolve(d, e, f) : this;
};
function xb(a, b, c, d, e, f, g) {
  if (b.length) {
    var h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (var l = 0, m = void 0; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return xb.call(h, a, [], c, d, e, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (b = Ga(a)) {
        return this.result = yb(a, b, c, d, g, this.h, f), f ? e ? tb.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, d, e) : this;
}
;Z.prototype.xor = function() {
  var a = ub(this, "xor", arguments);
  return zb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest);
};
function zb(a, b, c, d, e, f, g) {
  if (b.length) {
    var h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (var l = 0, m = void 0; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return zb.call(h, a, [], c, d, e, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = Ab.call(this, a, c, d, f, this.h), f ? e ? tb.call(this.index, this.result) : this.result : this;
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, d, e) : this;
}
function Ab(a, b, c, d, e) {
  for (var f = [], g = S(), h = 0, k = 0, l; k < a.length; k++) {
    if (l = a[k]) {
      h < l.length && (h = l.length);
      for (var m = 0, q; m < l.length; m++) {
        if (q = l[m]) {
          for (var p = 0, n; p < q.length; p++) {
            n = q[p], g[n] = g[n] ? 2 : 1;
          }
        }
      }
    }
  }
  for (l = k = 0; k < h; k++) {
    for (m = 0; m < a.length; m++) {
      if (q = a[m]) {
        if (q = q[k]) {
          for (p = 0; p < q.length; p++) {
            if (n = q[p], 1 === g[n]) {
              if (c) {
                c--;
              } else {
                if (d) {
                  if (f.push(n), f.length === b) {
                    return f;
                  }
                } else {
                  var r = k + (m ? e : 0);
                  f[r] || (f[r] = []);
                  f[r].push(n);
                  if (++l === b) {
                    return f;
                  }
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
;Z.prototype.not = function() {
  var a = ub(this, "not", arguments);
  return Bb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest);
};
function Bb(a, b, c, d, e, f, g) {
  if (b.length) {
    var h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (var l = 0, m = void 0; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return Bb.call(h, a, [], c, d, e, f, g);
    });
  }
  if (a.length && this.result.length) {
    this.result = Cb.call(this, a, c, d, f);
  } else if (f) {
    return this.resolve(c, d, e);
  }
  return f ? e ? tb.call(this.index, this.result) : this.result : this;
}
function Cb(a, b, c, d) {
  var e = [];
  a = new Set(a.flat().flat());
  for (var f = 0, g, h = 0; f < this.result.length; f++) {
    if (g = this.result[f]) {
      for (var k = 0, l; k < g.length; k++) {
        if (l = g[k], !a.has(l)) {
          if (c) {
            c--;
          } else {
            if (d) {
              if (e.push(l), e.length === b) {
                return e;
              }
            } else {
              if (e[f] || (e[f] = []), e[f].push(l), ++h === b) {
                return e;
              }
            }
          }
        }
      }
    }
  }
  return e;
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
  var g = f.indexOf("$1");
  if (-1 === g) {
    throw Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + f);
  }
  var h = f.substring(g + 2);
  g = f.substring(0, g);
  var k = e && e.boundary, l = !e || !1 !== e.clip, m = e && e.merge && h && g && new RegExp(h + " " + g, "g");
  e = e && e.ellipsis;
  var q = 0;
  if ("object" === typeof e) {
    var p = e.template;
    q = p.length - 2;
    e = e.pattern;
  }
  "string" !== typeof e && (e = !1 === e ? "" : "...");
  q && (e = p.replace("$1", e));
  p = e.length - q;
  if ("object" === typeof k) {
    var n = k.before;
    0 === n && (n = -1);
    var r = k.after;
    0 === r && (r = -1);
    k = k.total || 9e5;
  }
  q = new Map();
  for (var u, x = 0, w, E; x < b.length; x++) {
    if (d) {
      var B = b;
      E = d;
    } else {
      B = b[x];
      E = B.field;
      if (!E) {
        continue;
      }
      B = B.result;
    }
    u = c.get(E);
    w = u.encoder;
    u = q.get(w);
    "string" !== typeof u && (u = w.encode(a), q.set(w, u));
    for (var y = 0; y < B.length; y++) {
      var t = B[y].doc;
      if (t && (t = Fa(t, E))) {
        var D = t.trim().split(/\s+/);
        if (D.length) {
          t = "";
          for (var C = [], O = [], Q = -1, M = -1, J = 0, F = 0; F < D.length; F++) {
            var R = D[F], V = w.encode(R);
            V = 1 < V.length ? V.join(" ") : V[0];
            var G = void 0;
            if (V && R) {
              for (var N = R.length, aa = (w.split ? R.replace(w.split, "") : R).length - V.length, ba = "", ma = 0, z = 0; z < u.length; z++) {
                var I = u[z];
                if (I) {
                  var K = I.length;
                  K += aa;
                  ma && K <= ma || (I = V.indexOf(I), -1 < I && (ba = (I ? R.substring(0, I) : "") + g + R.substring(I, I + K) + h + (I + K < N ? R.substring(I + K) : ""), ma = K, G = !0));
                }
              }
              ba && (k && (0 > Q && (Q = t.length + (t ? 1 : 0)), M = t.length + (t ? 1 : 0) + ba.length, J += N, O.push(C.length), C.push({match:ba})), t += (t ? " " : "") + ba);
            }
            if (!G) {
              R = D[F], t += (t ? " " : "") + R, k && C.push({text:R});
            } else if (k && J >= k) {
              break;
            }
          }
          J = O.length * (f.length - 2);
          if (n || r || k && t.length - J > k) {
            if (J = k + J - 2 * p, F = M - Q, 0 < n && (F += n), 0 < r && (F += r), F <= J) {
              D = n ? Q - (0 < n ? n : 0) : Q - ((J - F) / 2 | 0), C = r ? M + (0 < r ? r : 0) : D + J, l || (0 < D && " " !== t.charAt(D) && " " !== t.charAt(D - 1) && (D = t.indexOf(" ", D), 0 > D && (D = 0)), C < t.length && " " !== t.charAt(C - 1) && " " !== t.charAt(C) && (C = t.lastIndexOf(" ", C), C < M ? C = M : ++C)), t = (D ? e : "") + t.substring(D, C) + (C < t.length ? e : "");
            } else {
              M = [];
              J = {};
              Q = {};
              F = {};
              R = {};
              V = {};
              aa = N = G = 0;
              for (ma = ba = 1;;) {
                I = void 0;
                for (z = 0; z < O.length; z++) {
                  K = O[z];
                  if (aa) {
                    if (N !== aa) {
                      if (F[z + 1]) {
                        continue;
                      }
                      K += aa;
                      if (J[K]) {
                        G -= p;
                        Q[z + 1] = 1;
                        F[z + 1] = 1;
                        continue;
                      }
                      if (K >= C.length - 1) {
                        if (K >= C.length) {
                          F[z + 1] = 1;
                          K >= D.length && (Q[z + 1] = 1);
                          continue;
                        }
                        G -= p;
                      }
                      t = C[K].text;
                      var U = r && V[z];
                      if (U) {
                        if (0 < U) {
                          if (t.length > U) {
                            if (F[z + 1] = 1, l) {
                              t = t.substring(0, U);
                            } else {
                              continue;
                            }
                          }
                          (U -= t.length) || (U = -1);
                          V[z] = U;
                        } else {
                          F[z + 1] = 1;
                          continue;
                        }
                      }
                      if (G + t.length + 1 <= k) {
                        t = " " + t, M[z] += t;
                      } else if (l) {
                        I = k - G - 1, 0 < I && (t = " " + t.substring(0, I), M[z] += t), F[z + 1] = 1;
                      } else {
                        F[z + 1] = 1;
                        continue;
                      }
                    } else {
                      if (F[z]) {
                        continue;
                      }
                      K -= N;
                      if (J[K]) {
                        G -= p;
                        F[z] = 1;
                        Q[z] = 1;
                        continue;
                      }
                      if (0 >= K) {
                        if (0 > K) {
                          F[z] = 1;
                          Q[z] = 1;
                          continue;
                        }
                        G -= p;
                      }
                      t = C[K].text;
                      if (U = n && R[z]) {
                        if (0 < U) {
                          if (t.length > U) {
                            if (F[z] = 1, l) {
                              t = t.substring(t.length - U);
                            } else {
                              continue;
                            }
                          }
                          (U -= t.length) || (U = -1);
                          R[z] = U;
                        } else {
                          F[z] = 1;
                          continue;
                        }
                      }
                      if (G + t.length + 1 <= k) {
                        t += " ", M[z] = t + M[z];
                      } else if (l) {
                        I = t.length + 1 - (k - G), 0 <= I && I < t.length && (t = t.substring(I) + " ", M[z] = t + M[z]), F[z] = 1;
                      } else {
                        F[z] = 1;
                        continue;
                      }
                    }
                  } else {
                    t = C[K].match;
                    n && (R[z] = n);
                    r && (V[z] = r);
                    z && G++;
                    I = void 0;
                    K ? !z && p && (G += p) : (Q[z] = 1, F[z] = 1);
                    K >= D.length - 1 ? I = 1 : K < C.length - 1 && C[K + 1].match ? I = 1 : p && (G += p);
                    G -= f.length - 2;
                    if (!z || G + t.length <= k) {
                      M[z] = t;
                    } else {
                      I = ba = ma = Q[z] = 0;
                      break;
                    }
                    I && (Q[z + 1] = 1, F[z + 1] = 1);
                  }
                  G += t.length;
                  I = J[K] = 1;
                }
                if (I) {
                  N === aa ? aa++ : N++;
                } else {
                  N === aa ? ba = 0 : ma = 0;
                  if (!ba && !ma) {
                    break;
                  }
                  ba ? (N++, aa = N) : aa++;
                }
              }
              t = "";
              for (D = 0; D < M.length; D++) {
                C = (D && Q[D] ? " " : (D && !e ? " " : "") + e) + M[D], t += C;
              }
              e && !Q[M.length] && (t += e);
            }
          }
          m && (t = t.replace(m, " "));
          B[y].highlight = t;
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
  if (a && a.index) {
    return a.resolve = !1, this.index = a.index, this.h = a.boost || 0, this.result = this.index.search(a).result, this;
  }
  this.index = b || null;
  this.result = a || [];
  this.h = 0;
}
Z.prototype.limit = function(a) {
  if (this.result.length) {
    for (var b = [], c = 0, d; c < this.result.length; c++) {
      if (d = this.result[c]) {
        if (d.length <= a) {
          if (b[c] = d, a -= d.length, !a) {
            break;
          }
        } else {
          b[c] = d.slice(0, a);
          break;
        }
      }
    }
    this.result = b;
  }
  return this;
};
Z.prototype.offset = function(a) {
  if (this.result.length) {
    for (var b = [], c = 0, d; c < this.result.length; c++) {
      if (d = this.result[c]) {
        d.length <= a ? a -= d.length : (b[c] = d.slice(a), a = 0);
      }
    }
    this.result = b;
  }
  return this;
};
Z.prototype.boost = function(a) {
  this.h += a;
  return this;
};
Z.prototype.resolve = function(a, b, c) {
  var d = this.index, e = this.result;
  this.result = this.index = null;
  e.length && ("object" === typeof a && (c = a.enrich, b = a.offset, a = a.limit), e = sb.call(d, e, a || 100, b, c));
  return e;
};
function yb(a, b, c, d, e, f, g) {
  var h = a.length, k = [];
  var l = S();
  for (var m = 0, q = void 0, p, n; m < b; m++) {
    for (var r = 0; r < h; r++) {
      var u = a[r];
      if (m < u.length && (q = u[m])) {
        for (var x = 0; x < q.length; x++) {
          p = q[x];
          (u = l[p]) ? l[p]++ : (u = 0, l[p] = 1);
          n = k[u] || (k[u] = []);
          if (!g) {
            var w = m + (r || !e ? 0 : f || 0);
            n = n[w] || (n[w] = []);
          }
          n.push(p);
          if (g && c && u === h - 1 && n.length - d === c) {
            return d ? n.slice(d) : n;
          }
        }
      }
    }
  }
  if (a = k.length) {
    if (e) {
      k = 1 < k.length ? wb(k, c, d, g, f) : (k = k[0]).length > c || d ? k.slice(d, c + d) : k;
    } else {
      if (a < h) {
        return [];
      }
      k = k[a - 1];
      if (c || d) {
        if (g) {
          if (k.length > c || d) {
            k = k.slice(d, c + d);
          }
        } else {
          e = [];
          for (f = 0; f < k.length; f++) {
            if (g = k[f]) {
              if (d && g.length > d) {
                d -= g.length;
              } else {
                if (c && g.length > c || d) {
                  g = g.slice(d, c + d), c -= g.length, d && (d -= g.length);
                }
                e.push(g);
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
function wb(a, b, c, d, e) {
  var f = [], g = S(), h = a.length, k;
  if (d) {
    for (e = h - 1; 0 <= e; e--) {
      if (k = (d = a[e]) && d.length) {
        for (h = 0; h < k; h++) {
          var l = d[h];
          if (!g[l]) {
            if (g[l] = 1, c) {
              c--;
            } else {
              if (f.push(l), f.length === b) {
                return f;
              }
            }
          }
        }
      }
    }
  } else {
    for (var m = h - 1, q, p = 0; 0 <= m; m--) {
      q = a[m];
      for (var n = 0; n < q.length; n++) {
        if (k = (d = q[n]) && d.length) {
          for (var r = 0; r < k; r++) {
            if (l = d[r], !g[l]) {
              if (g[l] = 1, c) {
                c--;
              } else {
                var u = (n + (m < h - 1 ? e || 0 : 0)) / (m + 1) | 0;
                (f[u] || (f[u] = [])).push(l);
                if (++p === b) {
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
  for (var d = S(), e = [], f = 0, g; f < b.length; f++) {
    g = b[f];
    for (var h = 0; h < g.length; h++) {
      d[g[h]] = 1;
    }
  }
  if (c) {
    for (b = 0; b < a.length; b++) {
      c = a[b], d[c] && (e.push(c), d[c] = 0);
    }
  } else {
    for (b = 0; b < a.result.length; b++) {
      for (c = a.result[b], g = 0; g < c.length; g++) {
        f = c[g], d[f] && ((e[b] || (e[b] = [])).push(f), d[f] = 0);
      }
    }
  }
  return e;
}
;S();
pb.prototype.search = function(a, b, c, d) {
  c || (!b && Da(a) ? (c = a, a = "") : Da(b) && (c = b, b = 0));
  if (c && c.cache) {
    c.cache = !1;
    var e = this.searchCache(a, b, c);
    c.cache = !0;
    return e;
  }
  var f = [], g = [], h = 0, k = !0;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    var l = c.pluck;
    var m = c.merge;
    var q = c.boost;
    var p = l || c.field || (p = c.index) && (p.index ? null : p);
    var n = this.tag && c.tag;
    var r = c.suggest;
    k = !1 !== c.resolve;
    this.store && c.highlight && !k ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && c.enrich && !k && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    var u = k && this.store && c.highlight;
    e = !!u || k && this.store && c.enrich;
    b = c.limit || b;
    var x = c.offset || 0;
    b || (b = k ? 100 : 0);
    if (n && (!this.db || !d)) {
      n.constructor !== Array && (n = [n]);
      for (var w = [], E = 0, B = void 0; E < n.length; E++) {
        B = n[E];
        if (T(B)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (B.field && B.tag) {
          var y = B.tag;
          if (y.constructor === Array) {
            for (var t = 0; t < y.length; t++) {
              w.push(B.field, y[t]);
            }
          } else {
            w.push(B.field, y);
          }
        } else {
          y = Object.keys(B);
          t = 0;
          for (var D = void 0, C = void 0; t < y.length; t++) {
            if (D = y[t], C = B[D], C.constructor === Array) {
              for (var O = 0; O < C.length; O++) {
                w.push(D, C[O]);
              }
            } else {
              w.push(D, C);
            }
          }
        }
      }
      if (!w.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      n = w;
      if (!a) {
        g = [];
        if (w.length) {
          for (n = 0; n < w.length; n += 2) {
            d = void 0;
            if (this.db) {
              d = this.index.get(w[n]);
              if (!d) {
                console.warn("Tag '" + w[n] + ":" + w[n + 1] + "' will be skipped because there is no field '" + w[n] + "'.");
                continue;
              }
              g.push(d = d.db.tag(w[n + 1], b, x, e));
            } else {
              d = Fb.call(this, w[n], w[n + 1], b, x, e);
            }
            f.push(k ? {field:w[n], tag:w[n + 1], result:d} : [d]);
          }
        }
        if (g.length) {
          var Q = this;
          return Promise.all(g).then(function(G) {
            for (var N = 0; N < G.length; N++) {
              k ? f[N].result = G[N] : f[N] = G[N];
            }
            return k ? f : new Z(1 < f.length ? yb(f, 1, 0, 0, r, q) : f[0], Q);
          });
        }
        return k ? f : new Z(1 < f.length ? yb(f, 1, 0, 0, r, q) : f[0], this);
      }
    }
    if (!k && !l) {
      if (p = p || this.field) {
        T(p) ? l = p : (p.constructor === Array && 1 === p.length && (p = p[0]), l = p.field || p.index);
      }
      if (!l) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    p && p.constructor !== Array && (p = [p]);
  }
  p || (p = this.field);
  w = (this.worker || this.db) && !d && [];
  E = 0;
  for (t = B = y = void 0; E < p.length; E++) {
    if (B = p[E], !this.db || !this.tag || this.L[E]) {
      y = void 0;
      T(B) || (y = B, B = y.field, a = y.query || a, b = Ca(y.limit, b), x = Ca(y.offset, x), r = Ca(y.suggest, r), u = k && this.store && Ca(y.highlight, u), e = !!u || k && this.store && Ca(y.enrich, e));
      if (d) {
        y = d[E];
      } else {
        t = y || c;
        y = this.index.get(B);
        if (n) {
          if (this.db) {
            t.tag = n;
            var M = y.db.support_tag_search;
            t.field = p;
          }
          M || (t.enrich = !1);
        }
        if (w) {
          w[E] = y.search(a, b, t);
          t && e && (t.enrich = e);
          continue;
        } else {
          y = y.search(a, b, t), t && e && (t.enrich = e);
        }
      }
      t = y && (k ? y.length : y.result.length);
      if (n && t) {
        D = [];
        C = 0;
        if (this.db && d) {
          if (!M) {
            for (O = p.length; O < d.length; O++) {
              var J = d[O];
              if (J && J.length) {
                C++, D.push(J);
              } else if (!r) {
                return k ? f : new Z(f, this);
              }
            }
          }
        } else {
          O = 0;
          for (var F = J = void 0; O < n.length; O += 2) {
            J = this.tag.get(n[O]);
            if (!J) {
              if (console.warn("Tag '" + n[O] + ":" + n[O + 1] + "' will be skipped because there is no field '" + n[O] + "'."), r) {
                continue;
              } else {
                return k ? f : new Z(f, this);
              }
            }
            if (F = (J = J && J.get(n[O + 1])) && J.length) {
              C++, D.push(J);
            } else if (!r) {
              return k ? f : new Z(f, this);
            }
          }
        }
        if (C) {
          y = Eb(y, D, k);
          t = y.length;
          if (!t && !r) {
            return k ? y : new Z(y, this);
          }
          C--;
        }
      }
      if (t) {
        g[h] = B, f.push(y), h++;
      } else if (1 === p.length) {
        return k ? f : new Z(f, this);
      }
    }
  }
  if (w) {
    if (this.db && n && n.length && !M) {
      for (e = 0; e < n.length; e += 2) {
        g = this.index.get(n[e]);
        if (!g) {
          if (console.warn("Tag '" + n[e] + ":" + n[e + 1] + "' was not found because there is no field '" + n[e] + "'."), r) {
            continue;
          } else {
            return k ? f : new Z(f, this);
          }
        }
        w.push(g.db.tag(n[e + 1], b, x, !1));
      }
    }
    var R = this;
    return Promise.all(w).then(function(G) {
      return G.length ? R.search(a, b, c, G) : G;
    });
  }
  if (!h) {
    return k ? f : new Z(f, this);
  }
  if (l && (!e || !this.store)) {
    return f = f[0], k || (f.index = this), f;
  }
  w = [];
  for (x = 0; x < g.length; x++) {
    n = f[x];
    e && n.length && "undefined" === typeof n[0].doc && (this.db ? w.push(n = this.index.get(this.field[0]).db.enrich(n)) : n = tb.call(this, n));
    if (l) {
      return k ? u ? Db(a, n, this.index, l, u) : n : new Z(n, this);
    }
    f[x] = {field:g[x], result:n};
  }
  if (e && this.db && w.length) {
    var V = this;
    return Promise.all(w).then(function(G) {
      for (var N = 0; N < G.length; N++) {
        f[N].result = G[N];
      }
      u && (f = Db(a, f, V.index, l, u));
      return m ? Gb(f) : f;
    });
  }
  u && (f = Db(a, f, this.index, l, u));
  return m ? Gb(f) : f;
};
function Gb(a) {
  for (var b = [], c = S(), d = S(), e = 0, f, g, h = void 0, k, l, m; e < a.length; e++) {
    f = a[e];
    g = f.field;
    f = f.result;
    for (var q = 0; q < f.length; q++) {
      if (k = f[q], "object" !== typeof k ? k = {id:h = k} : h = k.id, (l = c[h]) ? l.push(g) : (k.field = c[h] = [g], b.push(k)), m = k.highlight) {
        l = d[h], l || (d[h] = l = {}, k.highlight = l), l[g] = m;
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
  for (var b = Array(a.length), c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {id:d, doc:this.store.get(d)};
  }
  return b;
}
;var Hb = {normalize:!1, numeric:!1, dedupe:!1};
var Ib = {};
var Jb = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
var Kb = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Lb = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
var Mb = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var Nb = {Exact:Hb, Default:Ib, Normalize:Ib, LatinBalance:{mapper:Jb}, LatinAdvanced:{mapper:Jb, matcher:Kb, replacer:Lb}, LatinExtra:{mapper:Jb, replacer:Lb.concat([/(?!^)[aeo]/g, ""]), matcher:Kb}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (var b = 0; b < a.length; b++) {
    for (var c = a[b], d = c.charAt(0), e = Mb[d], f = 1, g; f < c.length && (g = c.charAt(f), "h" === g || "w" === g || !(g = Mb[g]) || g === e || (d += g, e = g, 4 !== d.length)); f++) {
    }
    a[b] = d;
  }
}}, CJK:{split:""}, LatinExact:Hb, LatinDefault:Ib, LatinSimple:Ib};
function pb(a) {
  if (!this || this.constructor !== pb) {
    return new pb(a);
  }
  var b = a.document || a.doc || a, c, d;
  this.L = [];
  this.field = [];
  this.S = [];
  this.key = (c = b.key || b.id) && Ob(c, this.S) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? d ? new Y(d) : new Set() : d ? new X(d) : new Map();
  this.I = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (d ? new X(d) : new Map());
  this.cache = (c = a.cache || null) && new Pb(c);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = Qb.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.K = [];
      this.aa = [];
      b = 0;
      for (var e = d = void 0; b < c.length; b++) {
        d = c[b];
        e = d.field || d;
        if (!e) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        d.custom ? this.K[b] = d.custom : (this.K[b] = Ob(e, this.S), d.filter && ("string" === typeof this.K[b] && (this.K[b] = new String(this.K[b])), this.K[b].R = d.filter));
        this.aa[b] = e;
        this.tag.set(e, new Map());
      }
    }
  }
  if (this.worker) {
    this.fastupdate = !1;
    a = [];
    c = A(this.index.values());
    for (b = c.next(); !b.done; b = c.next()) {
      b = b.value, b.then && a.push(b);
    }
    if (a.length) {
      var f = this;
      return Promise.all(a).then(function(g) {
        for (var h = 0, k = A(f.index.entries()), l = k.next(); !l.done; l = k.next()) {
          var m = l.value;
          l = m[0];
          m = m[1];
          m.then && (m = g[h], f.index.set(l, m), h++);
        }
        return f;
      });
    }
  } else {
    a.db && (this.fastupdate = !1, this.mount(a.db));
  }
}
v = pb.prototype;
v.mount = function(a) {
  if (this.worker) {
    throw Error("You can't use Worker-Indexes on a persistent model. That would be useless, since each of the persistent model acts like Worker-Index by default (Master/Slave).");
  }
  var b = this.field;
  if (this.tag) {
    for (var c = 0, d = void 0; c < this.aa.length; c++) {
      d = this.aa[c];
      var e = void 0;
      this.index.set(d, e = new W({}, this.reg));
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
    var g = new a.constructor(a.id, d);
    g.id = a.id;
    c[e] = g.mount(f);
    f.document = !0;
    e ? f.bypass = !0 : f.store = this.store;
  }
  var h = this;
  return this.db = Promise.all(c).then(function() {
    h.db = !0;
  });
};
v.commit = function(a, b) {
  var c = this, d, e, f, g;
  return xa(function(h) {
    if (1 == h.h) {
      d = [];
      e = A(c.index.values());
      for (f = e.next(); !f.done; f = e.next()) {
        g = f.value, d.push(g.commit(a, b));
      }
      return L(h, Promise.all(d), 2);
    }
    c.reg.clear();
    h.h = 0;
  });
};
v.destroy = function() {
  for (var a = [], b = A(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    a.push(c.value.destroy());
  }
  return Promise.all(a);
};
function Qb(a, b) {
  var c = new Map(), d = b.index || b.field || b;
  T(d) && (d = [d]);
  for (var e = 0, f, g = void 0; e < d.length; e++) {
    f = d[e];
    T(f) || (g = f, f = f.field);
    g = Da(g) ? Object.assign({}, a, g) : a;
    if (this.worker) {
      var h = (h = g.encoder) && h.encode ? h : new Ma("string" === typeof h ? Nb[h] : h);
      h = new Ya(g, h);
      c.set(f, h);
    }
    this.worker || c.set(f, new W(g, this.reg));
    g.custom ? this.L[e] = g.custom : (this.L[e] = Ob(f, this.S), g.filter && ("string" === typeof this.L[e] && (this.L[e] = new String(this.L[e])), this.L[e].R = g.filter));
    this.field[e] = f;
  }
  if (this.I) {
    for (a = b.store, T(a) && (a = [a]), b = 0; b < a.length; b++) {
      d = a[b], e = d.field || d, d.custom ? (this.I[b] = d.custom, d.custom.ja = e) : (this.I[b] = Ob(e, this.S), d.filter && ("string" === typeof this.I[b] && (this.I[b] = new String(this.I[b])), this.I[b].R = d.filter));
    }
  }
  return c;
}
function Ob(a, b) {
  for (var c = a.split(":"), d = 0, e = 0; e < c.length; e++) {
    a = c[e], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (b[d] = !0), a && (c[d++] = a);
  }
  d < c.length && (c.length = d);
  return 1 < d ? c : c[0];
}
v.append = function(a, b) {
  return this.add(a, b, !0);
};
v.update = function(a, b) {
  return this.remove(a).add(a, b);
};
v.remove = function(a) {
  Da(a) && (a = Fa(a, this.key));
  for (var b = A(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c.value.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (b = A(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
        c = c.value;
        for (var d = A(c), e = d.next(); !e.done; e = d.next()) {
          var f = e.value;
          e = f[0];
          f = f[1];
          var g = f.indexOf(a);
          -1 < g && (1 < f.length ? f.splice(g, 1) : c.delete(e));
        }
      }
    }
    this.store && this.store.delete(a);
    this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
v.clear = function() {
  for (var a = [], b = A(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c = c.value.clear(), c.then && a.push(c);
  }
  if (this.tag) {
    for (b = A(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
      c.value.clear();
    }
  }
  this.store && this.store.clear();
  this.cache && this.cache.clear();
  return a.length ? Promise.all(a) : this;
};
v.contain = function(a) {
  return this.db ? this.index.get(this.field[0]).db.has(a) : this.reg.has(a);
};
v.cleanup = function() {
  for (var a = A(this.index.values()), b = a.next(); !b.done; b = a.next()) {
    b.value.cleanup();
  }
  return this;
};
v.get = function(a) {
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(b) {
    return b[0] && b[0].doc || null;
  }) : this.store.get(a) || null;
};
v.set = function(a, b) {
  "object" === typeof a && (b = a, a = Fa(b, this.key));
  this.store.set(a, b);
  return this;
};
v.searchCache = Rb;
v.export = function(a, b, c, d) {
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
      var g = "reg";
      var h = eb(this.reg);
      b = null;
      break;
    case 1:
      g = "tag";
      h = this.tag && cb(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      g = "doc";
      h = this.store && ab(this.store);
      b = null;
      break;
    default:
      return;
  }
  return gb.call(this, a, b, g, h, c, d);
};
v.import = function(a, b) {
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
        this.reg = fb(b, this.reg);
        for (b = 0; b < this.field.length; b++) {
          d = this.index.get(this.field[b]), d.fastupdate = !1, d.reg = this.reg;
        }
        if (this.worker) {
          b = [];
          d = A(this.index.values());
          for (c = d.next(); !c.done; c = d.next()) {
            b.push(c.value.import(a));
          }
          return Promise.all(b);
        }
        break;
      case "tag":
        this.tag = db(b, this.tag);
        break;
      case "doc":
        this.store = bb(b, this.store);
    }
  }
};
Ra(pb.prototype);
function Rb(a, b, c) {
  var d = (b ? "" + a : "object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new Pb());
  var e = this.cache.get(d);
  if (!e) {
    e = this.search(a, b, c);
    if (e.then) {
      var f = this;
      e.then(function(g) {
        f.cache.set(d, g);
        return g;
      });
    }
    this.cache.set(d, e);
  }
  return e;
}
function Pb(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
Pb.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
Pb.prototype.get = function(a) {
  var b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
Pb.prototype.remove = function(a) {
  for (var b = A(this.cache), c = b.next(); !c.done; c = b.next()) {
    c = c.value;
    var d = c[0];
    c[1].includes(a) && this.cache.delete(d);
  }
};
Pb.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
W.prototype.remove = function(a, b) {
  var c = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (c) {
    if (this.fastupdate) {
      for (var d = 0, e; d < c.length; d++) {
        if (e = c[d]) {
          if (2 > e.length) {
            e.pop();
          } else {
            var f = e.indexOf(a);
            f === c.length - 1 ? e.pop() : e.splice(f, 1);
          }
        }
      }
    } else {
      Sb(this.map, a), this.depth && Sb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.ca && Tb(this));
  this.cache && this.cache.remove(a);
  return this;
};
function Sb(a, b) {
  var c = 0, d = "undefined" === typeof b;
  if (a.constructor === Array) {
    for (var e = 0, f = void 0, g; e < a.length; e++) {
      if ((f = a[e]) && f.length) {
        if (d) {
          c++;
        } else {
          if (g = f.indexOf(b), 0 <= g) {
            1 < f.length ? (f.splice(g, 1), c++) : delete a[e];
            break;
          } else {
            c++;
          }
        }
      }
    }
  } else {
    for (d = A(a.entries()), e = d.next(); !e.done; e = d.next()) {
      f = e.value, e = f[0], (f = Sb(f[1], b)) ? c += f : a.delete(e);
    }
  }
  return c;
}
;var Ub = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
W.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    d = this.depth;
    b = this.encoder.encode(b, !d);
    var e = b.length;
    if (e) {
      for (var f = S(), g = S(), h = this.resolution, k = 0; k < e; k++) {
        var l = b[this.rtl ? e - 1 - k : k], m = l.length;
        if (m && (d || !g[l])) {
          var q = this.score ? this.score(b, l, k, null, 0) : Vb(h, e, k), p = "";
          switch(this.tokenize) {
            case "full":
              if (2 < m) {
                q = 0;
                for (var n; q < m; q++) {
                  for (var r = m; r > q; r--) {
                    p = l.substring(q, r), n = this.rtl ? m - 1 - q : q, n = this.score ? this.score(b, l, k, p, n) : Vb(h, e, k, m, n), Wb(this, g, p, n, a, c);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < m) {
                for (r = m - 1; 0 < r; r--) {
                  p = l[this.rtl ? m - 1 - r : r] + p, n = this.score ? this.score(b, l, k, p, r) : Vb(h, e, k, m, r), Wb(this, g, p, n, a, c);
                }
                p = "";
              }
            case "forward":
              if (1 < m) {
                for (r = 0; r < m; r++) {
                  p += l[this.rtl ? m - 1 - r : r], Wb(this, g, p, q, a, c);
                }
                break;
              }
            default:
              if (Wb(this, g, l, q, a, c), d && 1 < e && k < e - 1) {
                for (m = S(), p = this.da, q = l, r = Math.min(d + 1, this.rtl ? k + 1 : e - k), n = m[q] = 1; n < r; n++) {
                  if ((l = b[this.rtl ? e - 1 - k - n : k + n]) && !m[l]) {
                    m[l] = 1;
                    var u = this.score ? this.score(b, q, k, l, n - 1) : Vb(p + (e / 2 > p ? 0 : 1), e, k, r - 1, n - 1), x = this.bidirectional && l > q;
                    Wb(this, f, x ? q : l, u, a, c, x ? l : q);
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
  this.db && (b || this.commit_task.push({del:a}), this.ca && Tb(this));
  return this;
};
function Wb(a, b, c, d, e, f, g) {
  var h = g ? a.ctx : a.map, k;
  if (!b[c] || g && !(k = b[c])[g]) {
    if (g ? (b = k || (b[c] = S()), b[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : b[c] = 1, (k = h.get(c)) ? h = k : h.set(c, h = k = []), h = h[d] || (h[d] = []), !f || !h.includes(e)) {
      if (h.length === Math.pow(2, 31) - 1) {
        b = new jb(h);
        if (a.fastupdate) {
          for (c = A(a.reg.values()), f = c.next(); !f.done; f = c.next()) {
            f = f.value, f.includes(h) && (f[f.indexOf(h)] = b);
          }
        }
        k[d] = h = b;
      }
      h.push(e);
      a.fastupdate && ((d = a.reg.get(e)) ? d.push(h) : a.reg.set(e, [h]));
    }
  }
}
function Vb(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;W.prototype.search = function(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : (c = a, a = ""));
  if (c && c.cache) {
    return c.cache = !1, a = this.searchCache(a, b, c), c.cache = !0, a;
  }
  var d = [], e = 0, f;
  if (c) {
    a = c.query || a;
    b = c.limit || b;
    e = c.offset || 0;
    var g = c.context;
    var h = c.suggest;
    var k = (f = c.resolve) && c.enrich;
    var l = c.boost;
    var m = c.resolution;
    var q = this.db && c.tag;
  }
  "undefined" === typeof f && (f = this.resolve);
  g = this.depth && !1 !== g;
  var p = this.encoder.encode(a, !g);
  var n = p.length;
  b = b || (f ? 100 : 0);
  if (1 === n) {
    return Xb.call(this, p[0], "", b, e, f, k, q);
  }
  if (2 === n && g && !h) {
    return Xb.call(this, p[1], p[0], b, e, f, k, q);
  }
  var r = S(), u = 0;
  if (g) {
    var x = p[0];
    u = 1;
  }
  m || 0 === m || (m = x ? this.da : this.resolution);
  if (this.db) {
    if (this.db.search && (c = this.db.search(this, p, b, e, h, f, k, q), !1 !== c)) {
      return c;
    }
    var w = this;
    return function() {
      var E, B;
      return xa(function(y) {
        switch(y.h) {
          case 1:
            B = E = void 0;
          case 2:
            if (!(u < n)) {
              y.h = 4;
              break;
            }
            B = p[u];
            if (!B || r[B]) {
              y.h = 5;
              break;
            }
            r[B] = 1;
            return L(y, Yb(w, B, x, 0, 0, !1, !1), 6);
          case 6:
            E = y.D;
            if (E = Zb(E, d, h, m)) {
              d = E;
              y.h = 4;
              break;
            }
            x && (h && E && d.length || (x = B));
          case 5:
            h && x && u === n - 1 && !d.length && (m = w.resolution, x = "", u = -1, r = S());
            u++;
            y.h = 2;
            break;
          case 4:
            return y.return($b(d, m, b, e, h, l, f));
        }
      });
    }();
  }
  for (a = c = void 0; u < n; u++) {
    if ((a = p[u]) && !r[a]) {
      r[a] = 1;
      c = Yb(this, a, x, 0, 0, !1, !1);
      if (c = Zb(c, d, h, m)) {
        d = c;
        break;
      }
      x && (h && c && d.length || (x = a));
    }
    h && x && u === n - 1 && !d.length && (m = this.resolution, x = "", u = -1, r = S());
  }
  return $b(d, m, b, e, h, l, f);
};
function $b(a, b, c, d, e, f, g) {
  var h = a.length, k = a;
  if (1 < h) {
    k = yb(a, b, c, d, e, f, g);
  } else if (1 === h) {
    return g ? sb.call(null, a[0], c, d) : new Z(a[0], this);
  }
  return g ? k : new Z(k, this);
}
function Xb(a, b, c, d, e, f, g) {
  a = Yb(this, a, b, c, d, e, f, g);
  return this.db ? a.then(function(h) {
    return e ? h || [] : new Z(h, this);
  }) : a && a.length ? e ? sb.call(this, a, c, d) : new Z(a, this) : e ? [] : new Z([], this);
}
function Zb(a, b, c, d) {
  var e = [];
  if (a && a.length) {
    if (a.length <= d) {
      b.push(a);
      return;
    }
    for (var f = 0, g; f < d; f++) {
      if (g = a[f]) {
        e[f] = g;
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
function Yb(a, b, c, d, e, f, g, h) {
  var k;
  c && (k = a.bidirectional && b > c) && (k = c, c = b, b = k);
  if (a.db) {
    return a.db.get(b, c, d, e, f, g, h);
  }
  a = c ? (a = a.ctx.get(c)) && a.get(b) : a.map.get(b);
  return a;
}
;function W(a, b) {
  if (!this || this.constructor !== W) {
    return new W(a);
  }
  if (a) {
    var c = T(a) ? a : a.preset;
    c && (Ub[c] || console.warn("Preset not found: " + c), a = Object.assign({}, Ub[c], a));
  } else {
    a = {};
  }
  c = a.context;
  var d = !0 === c ? {depth:1} : c || {}, e = T(a.encoder) ? Nb[a.encoder] : a.encode || a.encoder || {};
  this.encoder = e.encode ? e : "object" === typeof e ? new Ma(e) : {encode:e};
  this.resolution = a.resolution || 9;
  this.tokenize = c = (c = a.tokenize) && "default" !== c && "exact" !== c && c || "strict";
  this.depth = "strict" === c && d.depth || 0;
  this.bidirectional = !1 !== d.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  d && d.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new X(c) : new Map();
  this.ctx = c ? new X(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new X(c) : new Map() : c ? new Y(c) : new Set());
  this.da = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new Pb(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.ca = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
v = W.prototype;
v.mount = function(a) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return a.mount(this);
};
v.commit = function(a, b) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.commit(this, a, b);
};
v.destroy = function() {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.destroy();
};
function Tb(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a, void 0, void 0);
  }, 1));
}
v.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  this.db && (this.commit_timer && clearTimeout(this.commit_timer), this.commit_timer = null, this.commit_task = [{clear:!0}]);
  return this;
};
v.append = function(a, b) {
  return this.add(a, b, !0);
};
v.contain = function(a) {
  return this.db ? this.db.has(a) : this.reg.has(a);
};
v.update = function(a, b) {
  var c = this, d = this.remove(a);
  return d && d.then ? d.then(function() {
    return c.add(a, b);
  }) : this.add(a, b);
};
v.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Sb(this.map);
  this.depth && Sb(this.ctx);
  return this;
};
v.searchCache = Rb;
v.export = function(a, b, c, d) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  switch(d) {
    case 0:
      var e = "reg";
      var f = eb(this.reg);
      break;
    case 1:
      e = "cfg";
      f = null;
      break;
    case 2:
      e = "map";
      f = ab(this.map, this.reg.size);
      break;
    case 3:
      e = "ctx";
      f = cb(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return gb.call(this, a, b, e, f, c, d);
};
v.import = function(a, b) {
  if (b) {
    switch("string" === typeof b && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = fb(b, this.reg);
        break;
      case "map":
        this.map = bb(b, this.map);
        break;
      case "ctx":
        this.ctx = db(b, this.ctx);
    }
  }
};
v.serialize = function(a) {
  a = void 0 === a ? !0 : a;
  var b = "", c = "", d = "";
  if (this.reg.size) {
    var e;
    c = A(this.reg.keys());
    for (var f = c.next(); !f.done; f = c.next()) {
      f = f.value, e || (e = typeof f), b += (b ? "," : "") + ("string" === e ? '"' + f + '"' : f);
    }
    b = "index.reg=new Set([" + b + "]);";
    c = hb(this.map, e);
    c = "index.map=new Map([" + c + "]);";
    f = A(this.ctx.entries());
    for (var g = f.next(); !g.done; g = f.next()) {
      var h = g.value;
      g = h[0];
      h = hb(h[1], e);
      h = "new Map([" + h + "])";
      h = '["' + g + '",' + h + "]";
      d += (d ? "," : "") + h;
    }
    d = "index.ctx=new Map([" + d + "]);";
  }
  return a ? "function inject(index){" + b + c + d + "}" : b + c + d;
};
Ra(W.prototype);
var ac = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), bc = ["map", "ctx", "tag", "reg", "cfg"], cc = S();
function dc(a, b) {
  b = void 0 === b ? {} : b;
  if (!this || this.constructor !== dc) {
    return new dc(a, b);
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
v = dc.prototype;
v.mount = function(a) {
  if (a.index) {
    return a.mount(this);
  }
  a.db = this;
  return this.open();
};
v.open = function() {
  if (this.db) {
    return this.db;
  }
  var a = this;
  navigator.storage && navigator.storage.persist();
  cc[a.id] || (cc[a.id] = []);
  cc[a.id].push(a.field);
  var b = ac.open(a.id, 1);
  b.onupgradeneeded = function() {
    for (var c = a.db = this.result, d = 0, e; d < bc.length; d++) {
      e = bc[d];
      for (var f = 0, g; f < cc[a.id].length; f++) {
        g = cc[a.id][f], c.objectStoreNames.contains(e + ("reg" !== e ? g ? ":" + g : "" : "")) || c.createObjectStore(e + ("reg" !== e ? g ? ":" + g : "" : ""));
      }
    }
  };
  return a.db = ec(b, function(c) {
    a.db = c;
    a.db.onversionchange = function() {
      a.close();
    };
  });
};
v.close = function() {
  this.db && this.db.close();
  this.db = null;
};
v.destroy = function() {
  var a = ac.deleteDatabase(this.id);
  return ec(a);
};
v.clear = function() {
  for (var a = [], b = 0, c; b < bc.length; b++) {
    c = bc[b];
    for (var d = 0, e; d < cc[this.id].length; d++) {
      e = cc[this.id][d], a.push(c + ("reg" !== c ? e ? ":" + e : "" : ""));
    }
  }
  b = this.db.transaction(a, "readwrite");
  for (c = 0; c < a.length; c++) {
    b.objectStore(a[c]).clear();
  }
  return ec(b);
};
v.get = function(a, b, c, d, e, f) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  e = void 0 === e ? !0 : e;
  f = void 0 === f ? !1 : f;
  a = this.db.transaction((b ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((b ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(b ? b + ":" + a : a);
  var g = this;
  return ec(a).then(function(h) {
    var k = [];
    if (!h || !h.length) {
      return k;
    }
    if (e) {
      if (!c && !d && 1 === h.length) {
        return h[0];
      }
      for (var l = 0, m = void 0; l < h.length; l++) {
        if ((m = h[l]) && m.length) {
          if (d >= m.length) {
            d -= m.length;
          } else {
            for (var q = c ? d + Math.min(m.length - d, c) : m.length, p = d; p < q; p++) {
              k.push(m[p]);
            }
            d = 0;
            if (k.length === c) {
              break;
            }
          }
        }
      }
      return f ? g.enrich(k) : k;
    }
    return h;
  });
};
v.tag = function(a, b, c, d) {
  b = void 0 === b ? 0 : b;
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? !1 : d;
  a = this.db.transaction("tag" + (this.field ? ":" + this.field : ""), "readonly").objectStore("tag" + (this.field ? ":" + this.field : "")).get(a);
  var e = this;
  return ec(a).then(function(f) {
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
v.enrich = function(a) {
  "object" !== typeof a && (a = [a]);
  for (var b = this.db.transaction("reg", "readonly").objectStore("reg"), c = [], d = 0; d < a.length; d++) {
    c[d] = ec(b.get(a[d]));
  }
  return Promise.all(c).then(function(e) {
    for (var f = 0; f < e.length; f++) {
      e[f] = {id:a[f], doc:e[f] ? JSON.parse(e[f]) : null};
    }
    return e;
  });
};
v.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return ec(a).then(function(b) {
    return !!b;
  });
};
v.search = null;
v.info = function() {
};
v.transaction = function(a, b, c) {
  a += "reg" !== a ? this.field ? ":" + this.field : "" : "";
  var d = this.h[a + ":" + b];
  if (d) {
    return c.call(this, d);
  }
  var e = this.db.transaction(a, b);
  this.h[a + ":" + b] = d = e.objectStore(a);
  var f = c.call(this, d);
  this.h[a + ":" + b] = null;
  return ec(e).finally(function() {
    e = d = null;
    return f;
  });
};
v.commit = function(a, b, c) {
  var d = this, e, f, g;
  return xa(function(h) {
    switch(h.h) {
      case 1:
        if (b) {
          return L(h, d.clear(), 12);
        }
        e = a.commit_task;
        a.commit_task = [];
        f = 0;
        g = void 0;
      case 4:
        if (!(f < e.length)) {
          h.h = 6;
          break;
        }
        g = e[f];
        if (!g.clear) {
          e[f] = g.del;
          h.h = 5;
          break;
        }
        return L(h, d.clear(), 8);
      case 8:
        b = !0;
        h.h = 6;
        break;
      case 5:
        f++;
        h.h = 4;
        break;
      case 6:
        if (b) {
          h.h = 3;
          break;
        }
        c || (e = e.concat(Ea(a.reg)));
        if (!e.length) {
          h.h = 10;
          break;
        }
        return L(h, d.remove(e), 11);
      case 11:
      case 10:
        h.h = 3;
        break;
      case 12:
        a.commit_task = [];
      case 3:
        return a.reg.size ? L(h, d.transaction("map", "readwrite", function(k) {
          for (var l = A(a.map), m = l.next(), q = {}; !m.done; q = {O:void 0, Y:void 0}, m = l.next()) {
            m = m.value, q.Y = m[0], q.O = m[1], q.O.length && (b ? k.put(q.O, q.Y) : k.get(q.Y).onsuccess = function(p) {
              return function() {
                var n = this.result, r;
                if (n && n.length) {
                  for (var u = Math.max(n.length, p.O.length), x = 0, w; x < u; x++) {
                    if ((w = p.O[x]) && w.length) {
                      if ((r = n[x]) && r.length) {
                        for (var E = 0; E < w.length; E++) {
                          r.push(w[E]);
                        }
                      } else {
                        n[x] = w;
                      }
                      r = 1;
                    }
                  }
                } else {
                  n = p.O, r = 1;
                }
                r && k.put(n, p.Y);
              };
            }(q));
          }
        }), 13) : h.return();
      case 13:
        return L(h, d.transaction("ctx", "readwrite", function(k) {
          for (var l = A(a.ctx), m = l.next(), q = {}; !m.done; q = {V:void 0}, m = l.next()) {
            m = m.value;
            q.V = m[0];
            m = A(m[1]);
            for (var p = m.next(), n = {}; !p.done; n = {P:void 0, Z:void 0}, p = m.next()) {
              p = p.value, n.Z = p[0], n.P = p[1], n.P.length && (b ? k.put(n.P, q.V + ":" + n.Z) : k.get(q.V + ":" + n.Z).onsuccess = function(r, u) {
                return function() {
                  var x = this.result, w;
                  if (x && x.length) {
                    for (var E = Math.max(x.length, r.P.length), B = 0, y; B < E; B++) {
                      if ((y = r.P[B]) && y.length) {
                        if ((w = x[B]) && w.length) {
                          for (var t = 0; t < y.length; t++) {
                            w.push(y[t]);
                          }
                        } else {
                          x[B] = y;
                        }
                        w = 1;
                      }
                    }
                  } else {
                    x = r.P, w = 1;
                  }
                  w && k.put(x, u.V + ":" + r.Z);
                };
              }(n, q));
            }
          }
        }), 14);
      case 14:
        if (a.store) {
          return L(h, d.transaction("reg", "readwrite", function(k) {
            for (var l = A(a.store), m = l.next(); !m.done; m = l.next()) {
              var q = m.value;
              m = q[0];
              q = q[1];
              k.put("object" === typeof q ? JSON.stringify(q) : 1, m);
            }
          }), 16);
        }
        if (a.bypass) {
          h.h = 16;
          break;
        }
        return L(h, d.transaction("reg", "readwrite", function(k) {
          for (var l = A(a.reg.keys()), m = l.next(); !m.done; m = l.next()) {
            k.put(1, m.value);
          }
        }), 16);
      case 16:
        if (!a.tag) {
          h.h = 20;
          break;
        }
        return L(h, d.transaction("tag", "readwrite", function(k) {
          for (var l = A(a.tag), m = l.next(), q = {}; !m.done; q = {X:void 0, ba:void 0}, m = l.next()) {
            m = m.value, q.ba = m[0], q.X = m[1], q.X.length && (k.get(q.ba).onsuccess = function(p) {
              return function() {
                var n = this.result;
                n = n && n.length ? n.concat(p.X) : p.X;
                k.put(n, p.ba);
              };
            }(q));
          }
        }), 20);
      case 20:
        a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear(), h.h = 0;
    }
  });
};
function fc(a, b, c) {
  for (var d = a.value, e, f = 0, g = 0, h; g < d.length; g++) {
    if (h = c ? d : d[g]) {
      for (var k = 0, l; k < b.length; k++) {
        if (l = b[k], l = h.indexOf(l), 0 <= l) {
          if (e = 1, 1 < h.length) {
            h.splice(l, 1);
          } else {
            d[g] = [];
            break;
          }
        }
      }
      f += h.length;
    }
    if (c) {
      break;
    }
  }
  f ? e && a.update(d) : a.delete();
  a.continue();
}
v.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && fc(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && fc(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && fc(c, a, !0);
    };
  }), this.transaction("reg", "readwrite", function(b) {
    for (var c = 0; c < a.length; c++) {
      b.delete(a[c]);
    }
  })]);
};
function ec(a, b) {
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
;var gc = {Index:W, Charset:Nb, Encoder:Ma, Document:pb, Worker:Ya, Resolver:Z, IndexedDB:dc, Language:{}}, hc = "undefined" !== typeof self ? self : "undefined" !== typeof global ? global : self, ic;
(ic = hc.define) && ic.amd ? ic([], function() {
  return gc;
}) : "object" === typeof hc.exports ? hc.exports = gc : hc.FlexSearch = gc;
}(this||self));
