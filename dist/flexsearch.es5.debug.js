/**!
 * FlexSearch.js v0.8.142 (ES5/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;
var u;
function aa(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
}
function x(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (b) {
    return b.call(a);
  }
  if ("number" == typeof a.length) {
    return {next:aa(a)};
  }
  throw Error(String(a) + " is not an iterable or ArrayLike");
}
var ba = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  if (a == Array.prototype || a == Object.prototype) {
    return a;
  }
  a[b] = c.value;
  return a;
};
function ca(a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) {
      return c;
    }
  }
  throw Error("Cannot find global object");
}
var B = ca(this);
function C(a, b) {
  if (b) {
    a: {
      var c = B;
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
      b != d && null != b && ba(c, a, {configurable:!0, writable:!0, value:b});
    }
  }
}
var da;
if ("function" == typeof Object.setPrototypeOf) {
  da = Object.setPrototypeOf;
} else {
  var ea;
  a: {
    var fa = {a:!0}, ha = {};
    try {
      ha.__proto__ = fa;
      ea = ha.a;
      break a;
    } catch (a) {
    }
    ea = !1;
  }
  da = ea ? function(a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) {
      throw new TypeError(a + " is not extensible");
    }
    return a;
  } : null;
}
var ia = da;
function ja() {
  this.C = !1;
  this.A = null;
  this.D = void 0;
  this.h = 1;
  this.H = 0;
  this.B = null;
}
function ka(a) {
  if (a.C) {
    throw new TypeError("Generator is already running");
  }
  a.C = !0;
}
ja.prototype.G = function(a) {
  this.D = a;
};
function la(a, b) {
  a.B = {ka:b, la:!0};
  a.h = a.H;
}
ja.prototype.return = function(a) {
  this.B = {return:a};
  this.h = this.H;
};
function E(a, b, c) {
  a.h = c;
  return {value:b};
}
function ma(a) {
  this.h = new ja();
  this.A = a;
}
function na(a, b) {
  ka(a.h);
  var c = a.h.A;
  if (c) {
    return oa(a, "return" in c ? c["return"] : function(d) {
      return {value:d, done:!0};
    }, b, a.h.return);
  }
  a.h.return(b);
  return pa(a);
}
function oa(a, b, c, d) {
  try {
    var e = b.call(a.h.A, c);
    if (!(e instanceof Object)) {
      throw new TypeError("Iterator result " + e + " is not an object");
    }
    if (!e.done) {
      return a.h.C = !1, e;
    }
    var g = e.value;
  } catch (f) {
    return a.h.A = null, la(a.h, f), pa(a);
  }
  a.h.A = null;
  d.call(a.h, g);
  return pa(a);
}
function pa(a) {
  for (; a.h.h;) {
    try {
      var b = a.A(a.h);
      if (b) {
        return a.h.C = !1, {value:b.value, done:!1};
      }
    } catch (c) {
      a.h.D = void 0, la(a.h, c);
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
function qa(a) {
  this.next = function(b) {
    ka(a.h);
    a.h.A ? b = oa(a, a.h.A.next, b, a.h.G) : (a.h.G(b), b = pa(a));
    return b;
  };
  this.throw = function(b) {
    ka(a.h);
    a.h.A ? b = oa(a, a.h.A["throw"], b, a.h.G) : (la(a.h, b), b = pa(a));
    return b;
  };
  this.return = function(b) {
    return na(a, b);
  };
  this[Symbol.iterator] = function() {
    return this;
  };
}
function ra(a, b) {
  b = new qa(new ma(b));
  ia && a.prototype && ia(b, a.prototype);
  return b;
}
function sa(a) {
  function b(d) {
    return a.next(d);
  }
  function c(d) {
    return a.throw(d);
  }
  return new Promise(function(d, e) {
    function g(f) {
      f.done ? d(f.value) : Promise.resolve(f.value).then(b, c).then(g, e);
    }
    g(a.next());
  });
}
function ta(a) {
  return sa(new qa(new ma(a)));
}
C("Symbol", function(a) {
  function b(g) {
    if (this instanceof b) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new c(d + (g || "") + "_" + e++, g);
  }
  function c(g, f) {
    this.h = g;
    ba(this, "description", {configurable:!0, writable:!0, value:f});
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
C("Symbol.iterator", function(a) {
  if (a) {
    return a;
  }
  a = Symbol("Symbol.iterator");
  for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
    var d = B[b[c]];
    "function" === typeof d && "function" != typeof d.prototype[a] && ba(d.prototype, a, {configurable:!0, writable:!0, value:function() {
      return ua(aa(this));
    }});
  }
  return a;
});
function ua(a) {
  a = {next:a};
  a[Symbol.iterator] = function() {
    return this;
  };
  return a;
}
C("Promise", function(a) {
  function b(f) {
    this.A = 0;
    this.B = void 0;
    this.h = [];
    this.H = !1;
    var h = this.C();
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
  c.prototype.A = function(f) {
    if (null == this.h) {
      this.h = [];
      var h = this;
      this.B(function() {
        h.D();
      });
    }
    this.h.push(f);
  };
  var e = B.setTimeout;
  c.prototype.B = function(f) {
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
          this.C(l);
        }
      }
    }
    this.h = null;
  };
  c.prototype.C = function(f) {
    this.B(function() {
      throw f;
    });
  };
  b.prototype.C = function() {
    function f(l) {
      return function(m) {
        k || (k = !0, l.call(h, m));
      };
    }
    var h = this, k = !1;
    return {resolve:f(this.fa), reject:f(this.D)};
  };
  b.prototype.fa = function(f) {
    if (f === this) {
      this.D(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (f instanceof b) {
        this.ha(f);
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
        h ? this.ea(f) : this.G(f);
      }
    }
  };
  b.prototype.ea = function(f) {
    var h = void 0;
    try {
      h = f.then;
    } catch (k) {
      this.D(k);
      return;
    }
    "function" == typeof h ? this.ia(h, f) : this.G(f);
  };
  b.prototype.D = function(f) {
    this.M(2, f);
  };
  b.prototype.G = function(f) {
    this.M(1, f);
  };
  b.prototype.M = function(f, h) {
    if (0 != this.A) {
      throw Error("Cannot settle(" + f + ", " + h + "): Promise already settled in state" + this.A);
    }
    this.A = f;
    this.B = h;
    2 === this.A && this.ga();
    this.N();
  };
  b.prototype.ga = function() {
    var f = this;
    e(function() {
      if (f.T()) {
        var h = B.console;
        "undefined" !== typeof h && h.error(f.B);
      }
    }, 1);
  };
  b.prototype.T = function() {
    if (this.H) {
      return !1;
    }
    var f = B.CustomEvent, h = B.Event, k = B.dispatchEvent;
    if ("undefined" === typeof k) {
      return !0;
    }
    "function" === typeof f ? f = new f("unhandledrejection", {cancelable:!0}) : "function" === typeof h ? f = new h("unhandledrejection", {cancelable:!0}) : (f = B.document.createEvent("CustomEvent"), f.initCustomEvent("unhandledrejection", !1, !0, f));
    f.promise = this;
    f.reason = this.B;
    return k(f);
  };
  b.prototype.N = function() {
    if (null != this.h) {
      for (var f = 0; f < this.h.length; ++f) {
        g.A(this.h[f]);
      }
      this.h = null;
    }
  };
  var g = new c();
  b.prototype.ha = function(f) {
    var h = this.C();
    f.U(h.resolve, h.reject);
  };
  b.prototype.ia = function(f, h) {
    var k = this.C();
    try {
      f.call(h, k.resolve, k.reject);
    } catch (l) {
      k.reject(l);
    }
  };
  b.prototype.then = function(f, h) {
    function k(p, q) {
      return "function" == typeof p ? function(t) {
        try {
          l(p(t));
        } catch (w) {
          m(w);
        }
      } : q;
    }
    var l, m, n = new b(function(p, q) {
      l = p;
      m = q;
    });
    this.U(k(f, l), k(h, m));
    return n;
  };
  b.prototype.catch = function(f) {
    return this.then(void 0, f);
  };
  b.prototype.U = function(f, h) {
    function k() {
      switch(l.A) {
        case 1:
          f(l.B);
          break;
        case 2:
          h(l.B);
          break;
        default:
          throw Error("Unexpected state: " + l.A);
      }
    }
    var l = this;
    null == this.h ? g.A(k) : this.h.push(k);
    this.H = !0;
  };
  b.resolve = d;
  b.reject = function(f) {
    return new b(function(h, k) {
      k(f);
    });
  };
  b.race = function(f) {
    return new b(function(h, k) {
      for (var l = x(f), m = l.next(); !m.done; m = l.next()) {
        d(m.value).U(h, k);
      }
    });
  };
  b.all = function(f) {
    var h = x(f), k = h.next();
    return k.done ? d([]) : new b(function(l, m) {
      function n(t) {
        return function(w) {
          p[t] = w;
          q--;
          0 == q && l(p);
        };
      }
      var p = [], q = 0;
      do {
        p.push(void 0), q++, d(k.value).U(n(p.length - 1), m), k = h.next();
      } while (!k.done);
    });
  };
  return b;
});
function va(a, b) {
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
C("Array.prototype.values", function(a) {
  return a ? a : function() {
    return va(this, function(b, c) {
      return c;
    });
  };
});
C("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return va(this, function(b) {
      return b;
    });
  };
});
function F(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
}
C("WeakMap", function(a) {
  function b(k) {
    this.h = (h += Math.random() + 1).toString();
    if (k) {
      k = x(k);
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
    if (!F(k, f)) {
      var l = new c();
      ba(k, f, {value:l});
    }
  }
  function g(k) {
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
    } catch (n) {
      return !1;
    }
  }()) {
    return a;
  }
  var f = "$jscomp_hidden_" + Math.random();
  g("freeze");
  g("preventExtensions");
  g("seal");
  var h = 0;
  b.prototype.set = function(k, l) {
    if (!d(k)) {
      throw Error("Invalid WeakMap key");
    }
    e(k);
    if (!F(k, f)) {
      throw Error("WeakMap key fail: " + k);
    }
    k[f][this.h] = l;
    return this;
  };
  b.prototype.get = function(k) {
    return d(k) && F(k, f) ? k[f][this.h] : void 0;
  };
  b.prototype.has = function(k) {
    return d(k) && F(k, f) && F(k[f], this.h);
  };
  b.prototype.delete = function(k) {
    return d(k) && F(k, f) && F(k[f], this.h) ? delete k[f][this.h] : !1;
  };
  return b;
});
C("Map", function(a) {
  function b() {
    var h = {};
    return h.K = h.next = h.head = h;
  }
  function c(h, k) {
    var l = h[1];
    return ua(function() {
      if (l) {
        for (; l.head != h[1];) {
          l = l.K;
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
    "object" == l || "function" == l ? g.has(k) ? l = g.get(k) : (l = "" + ++f, g.set(k, l)) : l = "p_" + k;
    var m = h[0][l];
    if (m && F(h[0], l)) {
      for (h = 0; h < m.length; h++) {
        var n = m[h];
        if (k !== k && n.key !== n.key || k === n.key) {
          return {id:l, list:m, index:h, F:n};
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
      h = x(h);
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
      var h = Object.seal({x:4}), k = new a(x([[h, "s"]]));
      if ("s" != k.get(h) || 1 != k.size || k.get({x:4}) || k.set({x:4}, "t") != k || 2 != k.size) {
        return !1;
      }
      var l = k.entries(), m = l.next();
      if (m.done || m.value[0] != h || "s" != m.value[1]) {
        return !1;
      }
      m = l.next();
      return m.done || 4 != m.value[0].x || "t" != m.value[1] || !l.next().done ? !1 : !0;
    } catch (n) {
      return !1;
    }
  }()) {
    return a;
  }
  var g = new WeakMap();
  e.prototype.set = function(h, k) {
    h = 0 === h ? 0 : h;
    var l = d(this, h);
    l.list || (l.list = this[0][l.id] = []);
    l.F ? l.F.value = k : (l.F = {next:this[1], K:this[1].K, head:this[1], key:h, value:k}, l.list.push(l.F), this[1].K.next = l.F, this[1].K = l.F, this.size++);
    return this;
  };
  e.prototype.delete = function(h) {
    h = d(this, h);
    return h.F && h.list ? (h.list.splice(h.index, 1), h.list.length || delete this[0][h.id], h.F.K.next = h.F.next, h.F.next.K = h.F.K, h.F.head = null, this.size--, !0) : !1;
  };
  e.prototype.clear = function() {
    this[0] = {};
    this[1] = this[1].K = b();
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
  var f = 0;
  return e;
});
C("Set", function(a) {
  function b(c) {
    this.h = new Map();
    if (c) {
      c = x(c);
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
      var c = Object.seal({x:4}), d = new a(x([c]));
      if (!d.has(c) || 1 != d.size || d.add(c) != d || 1 != d.size || d.add({x:4}) != d || 2 != d.size) {
        return !1;
      }
      var e = d.entries(), g = e.next();
      if (g.done || g.value[0] != c || g.value[1] != c) {
        return !1;
      }
      g = e.next();
      return g.done || g.value[0] == c || 4 != g.value[0].x || g.value[1] != g.value[0] ? !1 : e.next().done;
    } catch (f) {
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
    this.h.forEach(function(g) {
      return c.call(d, g, g, e);
    });
  };
  return b;
});
C("Array.prototype.entries", function(a) {
  return a ? a : function() {
    return va(this, function(b, c) {
      return [b, c];
    });
  };
});
C("Object.is", function(a) {
  return a ? a : function(b, c) {
    return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
  };
});
C("Array.prototype.includes", function(a) {
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
C("String.prototype.includes", function(a) {
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
C("Array.prototype.flat", function(a) {
  return a ? a : function(b) {
    b = void 0 === b ? 1 : b;
    var c = [];
    Array.prototype.forEach.call(this, function(d) {
      Array.isArray(d) && 0 < b ? (d = Array.prototype.flat.call(d, b - 1), c.push.apply(c, d)) : c.push(d);
    });
    return c;
  };
});
var wa = "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var d = arguments[c];
    if (d) {
      for (var e in d) {
        F(d, e) && (a[e] = d[e]);
      }
    }
  }
  return a;
};
C("Object.assign", function(a) {
  return a || wa;
});
C("Promise.prototype.finally", function(a) {
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
function G(a, b, c) {
  var d = typeof c, e = typeof a;
  if ("undefined" !== d) {
    if ("undefined" !== e) {
      if (c) {
        if ("function" === e && d === e) {
          return function(g) {
            return a(c(g));
          };
        }
        b = a.constructor;
        if (b === c.constructor) {
          if (b === Array) {
            return c.concat(a);
          }
          if (b === Map) {
            b = new Map(c);
            d = x(a);
            for (e = d.next(); !e.done; e = d.next()) {
              e = e.value, b.set(e[0], e[1]);
            }
            return b;
          }
          if (b === Set) {
            b = new Set(c);
            d = x(a.values());
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
function J() {
  return Object.create(null);
}
function K(a) {
  return "string" === typeof a;
}
function L(a) {
  return "object" === typeof a;
}
function xa(a) {
  var b = [];
  a = x(a.keys());
  for (var c = a.next(); !c.done; c = a.next()) {
    b.push(c.value);
  }
  return b;
}
function ya(a, b) {
  if (K(b)) {
    a = a[b];
  } else {
    for (var c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function za(a) {
  for (var b = 0, c = 0, d = void 0; c < a.length; c++) {
    (d = a[c]) && b < d.length && (b = d.length);
  }
  return b;
}
;var Aa = [["\u00aa", "a"], ["\u00b2", "2"], ["\u00b3", "3"], ["\u00b9", "1"], ["\u00ba", "o"], ["\u00bc", "1\u20444"], ["\u00bd", "1\u20442"], ["\u00be", "3\u20444"], ["\u00e0", "a"], ["\u00e1", "a"], ["\u00e2", "a"], ["\u00e3", "a"], ["\u00e4", "a"], ["\u00e5", "a"], ["\u00e7", "c"], ["\u00e8", "e"], ["\u00e9", "e"], ["\u00ea", "e"], ["\u00eb", "e"], ["\u00ec", "i"], ["\u00ed", "i"], ["\u00ee", "i"], ["\u00ef", "i"], ["\u00f1", "n"], ["\u00f2", "o"], ["\u00f3", "o"], ["\u00f4", "o"], ["\u00f5", 
"o"], ["\u00f6", "o"], ["\u00f9", "u"], ["\u00fa", "u"], ["\u00fb", "u"], ["\u00fc", "u"], ["\u00fd", "y"], ["\u00ff", "y"], ["\u0101", "a"], ["\u0103", "a"], ["\u0105", "a"], ["\u0107", "c"], ["\u0109", "c"], ["\u010b", "c"], ["\u010d", "c"], ["\u010f", "d"], ["\u0113", "e"], ["\u0115", "e"], ["\u0117", "e"], ["\u0119", "e"], ["\u011b", "e"], ["\u011d", "g"], ["\u011f", "g"], ["\u0121", "g"], ["\u0123", "g"], ["\u0125", "h"], ["\u0129", "i"], ["\u012b", "i"], ["\u012d", "i"], ["\u012f", "i"], ["\u0133", 
"ij"], ["\u0135", "j"], ["\u0137", "k"], ["\u013a", "l"], ["\u013c", "l"], ["\u013e", "l"], ["\u0140", "l"], ["\u0144", "n"], ["\u0146", "n"], ["\u0148", "n"], ["\u0149", "n"], ["\u014d", "o"], ["\u014f", "o"], ["\u0151", "o"], ["\u0155", "r"], ["\u0157", "r"], ["\u0159", "r"], ["\u015b", "s"], ["\u015d", "s"], ["\u015f", "s"], ["\u0161", "s"], ["\u0163", "t"], ["\u0165", "t"], ["\u0169", "u"], ["\u016b", "u"], ["\u016d", "u"], ["\u016f", "u"], ["\u0171", "u"], ["\u0173", "u"], ["\u0175", "w"], ["\u0177", 
"y"], ["\u017a", "z"], ["\u017c", "z"], ["\u017e", "z"], ["\u017f", "s"], ["\u01a1", "o"], ["\u01b0", "u"], ["\u01c6", "dz"], ["\u01c9", "lj"], ["\u01cc", "nj"], ["\u01ce", "a"], ["\u01d0", "i"], ["\u01d2", "o"], ["\u01d4", "u"], ["\u01d6", "u"], ["\u01d8", "u"], ["\u01da", "u"], ["\u01dc", "u"], ["\u01df", "a"], ["\u01e1", "a"], ["\u01e3", "ae"], ["\u00e6", "ae"], ["\u01fd", "ae"], ["\u01e7", "g"], ["\u01e9", "k"], ["\u01eb", "o"], ["\u01ed", "o"], ["\u01ef", "\u0292"], ["\u01f0", "j"], ["\u01f3", 
"dz"], ["\u01f5", "g"], ["\u01f9", "n"], ["\u01fb", "a"], ["\u01ff", "\u00f8"], ["\u0201", "a"], ["\u0203", "a"], ["\u0205", "e"], ["\u0207", "e"], ["\u0209", "i"], ["\u020b", "i"], ["\u020d", "o"], ["\u020f", "o"], ["\u0211", "r"], ["\u0213", "r"], ["\u0215", "u"], ["\u0217", "u"], ["\u0219", "s"], ["\u021b", "t"], ["\u021f", "h"], ["\u0227", "a"], ["\u0229", "e"], ["\u022b", "o"], ["\u022d", "o"], ["\u022f", "o"], ["\u0231", "o"], ["\u0233", "y"], ["\u02b0", "h"], ["\u02b1", "h"], ["\u0266", "h"], 
["\u02b2", "j"], ["\u02b3", "r"], ["\u02b4", "\u0279"], ["\u02b5", "\u027b"], ["\u02b6", "\u0281"], ["\u02b7", "w"], ["\u02b8", "y"], ["\u02e0", "\u0263"], ["\u02e1", "l"], ["\u02e2", "s"], ["\u02e3", "x"], ["\u02e4", "\u0295"], ["\u0390", "\u03b9"], ["\u03ac", "\u03b1"], ["\u03ad", "\u03b5"], ["\u03ae", "\u03b7"], ["\u03af", "\u03b9"], ["\u03b0", "\u03c5"], ["\u03ca", "\u03b9"], ["\u03cb", "\u03c5"], ["\u03cc", "\u03bf"], ["\u03cd", "\u03c5"], ["\u03ce", "\u03c9"], ["\u03d0", "\u03b2"], ["\u03d1", 
"\u03b8"], ["\u03d2", "\u03a5"], ["\u03d3", "\u03a5"], ["\u03d4", "\u03a5"], ["\u03d5", "\u03c6"], ["\u03d6", "\u03c0"], ["\u03f0", "\u03ba"], ["\u03f1", "\u03c1"], ["\u03f2", "\u03c2"], ["\u03f5", "\u03b5"], ["\u0439", "\u0438"], ["\u0450", "\u0435"], ["\u0451", "\u0435"], ["\u0453", "\u0433"], ["\u0457", "\u0456"], ["\u045c", "\u043a"], ["\u045d", "\u0438"], ["\u045e", "\u0443"], ["\u0477", "\u0475"], ["\u04c2", "\u0436"], ["\u04d1", "\u0430"], ["\u04d3", "\u0430"], ["\u04d7", "\u0435"], ["\u04db", 
"\u04d9"], ["\u04dd", "\u0436"], ["\u04df", "\u0437"], ["\u04e3", "\u0438"], ["\u04e5", "\u0438"], ["\u04e7", "\u043e"], ["\u04eb", "\u04e9"], ["\u04ed", "\u044d"], ["\u04ef", "\u0443"], ["\u04f1", "\u0443"], ["\u04f3", "\u0443"], ["\u04f5", "\u0447"]];
var Ba = /[^\p{L}\p{N}]+/u, Ca = /(\d{3})/g, Da = /(\D)(\d{3})/g, Ea = /(\d{3})(\D)/g, Fa = "".normalize && /[\u0300-\u036f]/g;
function Ga(a) {
  a = void 0 === a ? {} : a;
  if (!this || this.constructor !== Ga) {
    var b = Function.prototype.bind, c = b.apply, d = [null], e = d.concat;
    if (arguments instanceof Array) {
      var g = arguments;
    } else {
      g = x(arguments);
      for (var f, h = []; !(f = g.next()).done;) {
        h.push(f.value);
      }
      g = h;
    }
    return new (c.call(b, Ga, e.call(d, g)))();
  }
  if (arguments.length) {
    for (b = 0; b < arguments.length; b++) {
      this.assign(arguments[b]);
    }
  } else {
    this.assign(a);
  }
}
u = Ga.prototype;
u.assign = function(a) {
  this.normalize = G(a.normalize, !0, this.normalize);
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
      } catch (g) {
        console.error("Your split configuration:", c, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = c, e = !1 === c || 2 > "a1a".split(c).length;
    }
    this.numeric = G(a.numeric, e);
  } else {
    try {
      this.split = G(this.split, Ba);
    } catch (g) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = G(a.numeric, G(this.numeric, !0));
  }
  this.prepare = G(a.prepare, null, this.prepare);
  this.finalize = G(a.finalize, null, this.finalize);
  Fa || (this.mapper = new Map(Aa));
  c = a.filter;
  this.filter = "function" === typeof c ? c : G(c && new Set(c), null, this.filter);
  this.dedupe = G(a.dedupe, !1, this.dedupe);
  this.matcher = G((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = G((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = G((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = G(a.replacer, null, this.replacer);
  this.minlength = G(a.minlength, 1, this.minlength);
  this.maxlength = G(a.maxlength, 0, this.maxlength);
  this.rtl = G(a.rtl, !1, this.rtl);
  if (this.cache = c = G(a.cache, !0, this.cache)) {
    this.D = null, this.T = "number" === typeof c ? c : 2e5, this.B = new Map(), this.C = new Map(), this.H = this.G = 128;
  }
  this.h = "";
  this.M = null;
  this.A = "";
  this.N = null;
  if (this.matcher) {
    for (a = x(this.matcher.keys()), b = a.next(); !b.done; b = a.next()) {
      this.h += (this.h ? "|" : "") + b.value;
    }
  }
  if (this.stemmer) {
    for (a = x(this.stemmer.keys()), b = a.next(); !b.done; b = a.next()) {
      this.A += (this.A ? "|" : "") + b.value;
    }
  }
  return this;
};
u.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.A += (this.A ? "|" : "") + a;
  this.N = null;
  this.cache && N(this);
  return this;
};
u.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && N(this);
  return this;
};
u.addMapper = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (1 < a.length) {
    return this.addMatcher(a, b);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, b);
  this.cache && N(this);
  return this;
};
u.addMatcher = function(a, b) {
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
  this.cache && N(this);
  return this;
};
u.addReplacer = function(a, b) {
  if ("string" === typeof a) {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && N(this);
  return this;
};
u.encode = function(a) {
  var b = this;
  if (this.cache && a.length <= this.G) {
    if (this.D) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.D = setTimeout(N, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = Fa ? a.normalize("NFKD").replace(Fa, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(Da, "$1 $2").replace(Ea, "$1 $2").replace(Ca, "$1 "));
  for (var c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer), d = [], e = this.split || "" === this.split ? a.split(this.split) : a, g = 0, f = void 0, h = void 0; g < e.length; g++) {
    if ((f = h = e[g]) && !(f.length < this.minlength)) {
      if (c) {
        d.push(f);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(f) : !this.filter.has(f))) {
          if (this.cache && f.length <= this.H) {
            if (this.D) {
              var k = this.C.get(f);
              if (k || "" === k) {
                k && d.push(k);
                continue;
              }
            } else {
              this.D = setTimeout(N, 50, this);
            }
          }
          this.stemmer && 2 < f.length && (this.N || (this.N = new RegExp("(?!^)(" + this.A + ")$")), k = f, f = f.replace(this.N, function(q) {
            return b.stemmer.get(q);
          }), k !== f && this.filter && f.length >= this.minlength && ("function" === typeof this.filter ? !this.filter(f) : this.filter.has(f)) && (f = ""));
          if (f && (this.mapper || this.dedupe && 1 < f.length)) {
            k = "";
            for (var l = 0, m = "", n = void 0, p = void 0; l < f.length; l++) {
              n = f.charAt(l), n === m && this.dedupe || ((p = this.mapper && this.mapper.get(n)) || "" === p ? p === m && this.dedupe || !(m = p) || (k += p) : k += m = n);
            }
            f = k;
          }
          this.matcher && 1 < f.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), f = f.replace(this.M, function(q) {
            return b.matcher.get(q);
          }));
          if (f && this.replacer) {
            for (k = 0; f && k < this.replacer.length; k += 2) {
              f = f.replace(this.replacer[k], this.replacer[k + 1]);
            }
          }
          this.cache && h.length <= this.H && (this.C.set(h, f), this.C.size > this.T && (this.C.clear(), this.H = this.H / 1.1 | 0));
          f && d.push(f);
        }
      }
    }
  }
  this.finalize && (d = this.finalize(d) || d);
  this.cache && a.length <= this.G && (this.B.set(a, d), this.B.size > this.T && (this.B.clear(), this.G = this.G / 1.1 | 0));
  return d;
};
function N(a) {
  a.D = null;
  a.B.clear();
  a.C.clear();
}
;var Ha, O;
function Ia(a) {
  var b, c, d, e, g, f;
  return ta(function(h) {
    switch(h.h) {
      case 1:
        a = a.data;
        b = a.task;
        c = a.id;
        d = a.args;
        switch(b) {
          case "init":
            O = a.options || {};
            (e = a.factory) ? (Function("return " + e)()(self), Ha = new self.FlexSearch.Index(O), delete self.FlexSearch) : Ha = new P(O);
            postMessage({id:c});
            break;
          default:
            h.h = 2;
            return;
        }h.h = 0;
        break;
      case 2:
        if ("export" === b) {
          if (!O.export || "function" !== typeof O.export) {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
          }
          d[1] ? (d[0] = O.export, d[2] = 0, d[3] = 1) : d = null;
        }
        if ("import" === b) {
          if (!O.import || "function" !== typeof O.import) {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
          }
          if (!d[0]) {
            h.h = 5;
            break;
          }
          return E(h, O.import.call(Ha, d[0]), 9);
        }
        g = d && Ha[b].apply(Ha, d);
        if (!g || !g.then) {
          h.h = 5;
          break;
        }
        return E(h, g, 7);
      case 7:
        g = h.D;
        h.h = 5;
        break;
      case 9:
        f = h.D, Ha.import(d[0], f);
      case 5:
        postMessage("search" === b ? {id:c, msg:g} : {id:c}), h.h = 0;
    }
  });
}
;function Ja(a) {
  Ma.call(a, "add");
  Ma.call(a, "append");
  Ma.call(a, "search");
  Ma.call(a, "update");
  Ma.call(a, "remove");
}
var Na, Oa, Pa;
function Qa() {
  Na = Pa = 0;
}
function Ma(a) {
  this[a + "Async"] = function() {
    var b = arguments, c = b[b.length - 1];
    if ("function" === typeof c) {
      var d = c;
      delete b[b.length - 1];
    }
    Na ? Pa || (Pa = Date.now() - Oa >= this.priority * this.priority * 3) : (Na = setTimeout(Qa, 0), Oa = Date.now());
    if (Pa) {
      var e = this;
      return new Promise(function(f) {
        setTimeout(function() {
          f(e[a + "Async"].apply(e, b));
        }, 0);
      });
    }
    var g = this[a].apply(this, b);
    c = g.then ? g : new Promise(function(f) {
      return f(g);
    });
    d && c.then(d);
    return c;
  };
}
;var Ra = 0;
function Sa(a) {
  function b(f) {
    function h(k) {
      k = k.data || k;
      var l = k.id, m = l && e.h[l];
      m && (m(k.msg), delete e.h[l]);
    }
    this.worker = f;
    this.h = J();
    if (this.worker) {
      d ? this.worker.on("message", h) : this.worker.onmessage = h;
      if (a.config) {
        return new Promise(function(k) {
          e.h[++Ra] = function() {
            k(e);
            1e9 < Ra && (Ra = 0);
          };
          e.worker.postMessage({id:Ra, task:"init", factory:c, options:a});
        });
      }
      this.worker.postMessage({task:"init", factory:c, options:a});
      this.priority = a.priority || 4;
      return this;
    }
  }
  a = void 0 === a ? {} : a;
  if (!this || this.constructor !== Sa) {
    return new Sa(a);
  }
  var c = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  c && (c = c.toString());
  var d = "undefined" === typeof window, e = this, g = Ta(c, d, a.worker);
  return g.then ? g.then(function(f) {
    return b.call(e, f);
  }) : b.call(this, g);
}
S("add");
S("append");
S("search");
S("update");
S("remove");
S("clear");
S("export");
S("import");
Ja(Sa.prototype);
function S(a) {
  Sa.prototype[a] = function() {
    var b = this, c = [].slice.call(arguments), d = c[c.length - 1];
    if ("function" === typeof d) {
      var e = d;
      c.pop();
    }
    d = new Promise(function(g) {
      "export" === a && "function" === typeof c[0] && (c[0] = null);
      b.h[++Ra] = g;
      b.worker.postMessage({task:a, id:Ra, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function Ta(a, b, c) {
  return b ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + Ia.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof c ? c : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function Ua(a, b) {
  b = void 0 === b ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 5000 | 0);
  a = x(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    d.push(e.value), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function Va(a, b) {
  b || (b = new Map());
  for (var c = 0, d; c < a.length; c++) {
    d = a[c], b.set(d[0], d[1]);
  }
  return b;
}
function Wa(a, b) {
  b = void 0 === b ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 1000 | 0);
  a = x(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    e = e.value, d.push([e[0], Ua(e[1])[0]]), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function Xa(a, b) {
  b || (b = new Map());
  for (var c = 0, d, e; c < a.length; c++) {
    d = a[c], e = b.get(d[0]), b.set(d[0], Va(d[1], e));
  }
  return b;
}
function Ya(a) {
  var b = [], c = [];
  a = x(a.keys());
  for (var d = a.next(); !d.done; d = a.next()) {
    c.push(d.value), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function Za(a, b) {
  b || (b = new Set());
  for (var c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function $a(a, b, c, d, e, g, f) {
  f = void 0 === f ? 0 : f;
  var h = d && d.constructor === Array, k = h ? d.shift() : d;
  if (!k) {
    return this.export(a, b, e, g + 1);
  }
  if ((k = a((b ? b + "." : "") + (f + 1) + "." + c, JSON.stringify(k))) && k.then) {
    var l = this;
    return k.then(function() {
      return $a.call(l, a, b, c, h ? d : null, e, g, f + 1);
    });
  }
  return $a.call(this, a, b, c, h ? d : null, e, g, f + 1);
}
function ab(a, b) {
  var c = "";
  a = x(a.entries());
  for (var d = a.next(); !d.done; d = a.next()) {
    var e = d.value;
    d = e[0];
    e = e[1];
    for (var g = "", f = 0, h; f < e.length; f++) {
      h = e[f] || [""];
      for (var k = "", l = 0; l < h.length; l++) {
        k += (k ? "," : "") + ("string" === b ? '"' + h[l] + '"' : h[l]);
      }
      k = "[" + k + "]";
      g += (g ? "," : "") + k;
    }
    g = '["' + d + '",[' + g + "]]";
    c += (c ? "," : "") + g;
  }
  return c;
}
;function bb(a, b, c, d) {
  for (var e = [], g = 0, f; g < a.index.length; g++) {
    if (f = a.index[g], b >= f.length) {
      b -= f.length;
    } else {
      b = f[d ? "splice" : "slice"](b, c);
      if (f = b.length) {
        if (e = e.length ? e.concat(b) : b, c -= f, d && (a.length -= f), !c) {
          break;
        }
      }
      b = 0;
    }
  }
  return e;
}
function T(a) {
  if (!this || this.constructor !== T) {
    return new T(a);
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
        for (var g = 0, f = 0, h, k; f < b.index.length; f++) {
          h = b.index[f];
          k = h.indexOf(e);
          if (0 <= k) {
            return g + k;
          }
          g += h.length;
        }
        return -1;
      };
    }
    if ("includes" === d) {
      return function(e) {
        for (var g = 0; g < b.index.length; g++) {
          if (b.index[g].includes(e)) {
            return !0;
          }
        }
        return !1;
      };
    }
    if ("slice" === d) {
      return function(e, g) {
        return bb(b, e || 0, g || b.length, !1);
      };
    }
    if ("splice" === d) {
      return function(e, g) {
        return bb(b, e || 0, g || b.length, !0);
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
T.prototype.clear = function() {
  this.index.length = 0;
};
T.prototype.destroy = function() {
  this.proxy = this.index = null;
};
T.prototype.push = function() {
};
function U(a) {
  a = void 0 === a ? 8 : a;
  if (!this || this.constructor !== U) {
    return new U(a);
  }
  this.index = J();
  this.h = [];
  this.size = 0;
  32 < a ? (this.A = cb, this.B = BigInt(a)) : (this.A = db, this.B = a);
}
U.prototype.get = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.get(a);
};
U.prototype.set = function(a, b) {
  var c = this.A(a), d = this.index[c];
  d ? (c = d.size, d.set(a, b), (c -= d.size) && this.size++) : (this.index[c] = d = new Map([[a, b]]), this.h.push(d), this.size++);
};
function V(a) {
  a = void 0 === a ? 8 : a;
  if (!this || this.constructor !== V) {
    return new V(a);
  }
  this.index = J();
  this.h = [];
  this.size = 0;
  32 < a ? (this.A = cb, this.B = BigInt(a)) : (this.A = db, this.B = a);
}
V.prototype.add = function(a) {
  var b = this.A(a), c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c), this.size++);
};
u = U.prototype;
u.has = V.prototype.has = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.has(a);
};
u.delete = V.prototype.delete = function(a) {
  var b = this.A(a);
  (b = this.index[b]) && b.delete(a) && this.size--;
};
u.clear = V.prototype.clear = function() {
  this.index = J();
  this.h = [];
  this.size = 0;
};
u.values = V.prototype.values = function eb() {
  var b, c = this, d, e, g;
  return ra(eb, function(f) {
    switch(f.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          f.h = 0;
          break;
        }
        d = x(c.h[b].values());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          f.h = 2;
          break;
        }
        g = e.value;
        return E(f, g, 6);
      case 6:
        e = d.next(), f.h = 5;
    }
  });
};
u.keys = V.prototype.keys = function fb() {
  var b, c = this, d, e, g;
  return ra(fb, function(f) {
    switch(f.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          f.h = 0;
          break;
        }
        d = x(c.h[b].keys());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          f.h = 2;
          break;
        }
        g = e.value;
        return E(f, g, 6);
      case 6:
        e = d.next(), f.h = 5;
    }
  });
};
u.entries = V.prototype.entries = function gb() {
  var b, c = this, d, e, g;
  return ra(gb, function(f) {
    switch(f.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          f.h = 0;
          break;
        }
        d = x(c.h[b].entries());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          f.h = 2;
          break;
        }
        g = e.value;
        return E(f, g, 6);
      case 6:
        e = d.next(), f.h = 5;
    }
  });
};
function db(a) {
  var b = Math.pow(2, this.B) - 1;
  if ("number" == typeof a) {
    return a & b;
  }
  for (var c = 0, d = this.B + 1, e = 0; e < a.length; e++) {
    c = (c * d ^ a.charCodeAt(e)) & b;
  }
  return 32 === this.B ? c + Math.pow(2, 31) : c;
}
function cb() {
  throw Error("The keystore is limited to 32 for EcmaScript5");
}
;W.prototype.add = function(a, b, c) {
  L(a) && (b = a, a = ya(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (var d = 0, e; d < this.field.length; d++) {
      e = this.J[d];
      var g = this.index.get(this.field[d]);
      if ("function" === typeof e) {
        (e = e(b)) && g.add(a, e, !1, !0);
      } else {
        var f = e.R;
        if (!f || f(b)) {
          e.constructor === String ? e = ["" + e] : K(e) && (e = [e]), hb(b, e, this.S, 0, g, a, e[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.L.length; d++) {
        f = this.L[d];
        var h = this.aa[d];
        g = this.tag.get(h);
        e = J();
        if ("function" === typeof f) {
          if (f = f(b), !f) {
            continue;
          }
        } else {
          var k = f.R;
          if (k && !k(b)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = ya(b, f);
        }
        if (g && f) {
          for (K(f) && (f = [f]), h = 0, k = void 0; h < f.length; h++) {
            var l = f[h];
            if (!e[l]) {
              e[l] = 1;
              var m;
              (m = g.get(l)) ? k = m : g.set(l, k = []);
              if (!c || !k.includes(a)) {
                if (k.length === Math.pow(2, 31) - 1) {
                  m = new T(k);
                  if (this.fastupdate) {
                    for (var n = x(this.reg.values()), p = n.next(); !p.done; p = n.next()) {
                      p = p.value, p.includes(k) && (p[p.indexOf(k)] = m);
                    }
                  }
                  g.set(l, k = m);
                }
                k.push(a);
                this.fastupdate && ((l = this.reg.get(a)) ? l.push(k) : this.reg.set(a, [k]));
              }
            }
          }
        } else {
          g || console.warn("Tag '" + h + "' was not found");
        }
      }
    }
    if (this.store && (!c || !this.store.has(a))) {
      if (this.I) {
        var q = J();
        for (c = 0; c < this.I.length; c++) {
          if (d = this.I[c], g = d.R, !g || g(b)) {
            g = void 0;
            if ("function" === typeof d) {
              g = d(b);
              if (!g) {
                continue;
              }
              d = [d.ja];
            } else if (K(d) || d.constructor === String) {
              q[d] = b[d];
              continue;
            }
            ib(b, q, d, 0, d[0], g);
          }
        }
      }
      this.store.set(a, q || b);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function ib(a, b, c, d, e, g) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = g || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
        ib(a, b, c, d, e);
      }
    } else {
      b = b[e] || (b[e] = J()), e = c[++d], ib(a, b, c, d, e);
    }
  }
}
function hb(a, b, c, d, e, g, f, h) {
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
          hb(a, b, c, d, e, g, f, h);
        }
      } else {
        f = b[++d], hb(a, b, c, d, e, g, f, h);
      }
    }
  } else {
    e.db && e.remove(g);
  }
}
;function jb(a, b, c, d, e, g, f) {
  var h = a.length, k = [];
  var l = J();
  for (var m = 0, n = void 0, p, q; m < b; m++) {
    for (var t = 0; t < h; t++) {
      var w = a[t];
      if (m < w.length && (n = w[m])) {
        for (var r = 0; r < n.length; r++) {
          p = n[r];
          (w = l[p]) ? l[p]++ : (w = 0, l[p] = 1);
          q = k[w] || (k[w] = []);
          if (!f) {
            var A = m + (t || !e ? 0 : g || 0);
            q = q[A] || (q[A] = []);
          }
          q.push(p);
          if (f && c && w === h - 1 && q.length - d === c) {
            return q;
          }
        }
      }
    }
  }
  if (a = k.length) {
    if (e) {
      k = 1 < k.length ? kb(k, c, d, f, g) : (k = k[0]).length > c || d ? k.slice(d, c + d) : k;
    } else {
      if (a < h) {
        return [];
      }
      k = k[a - 1];
      if (c || d) {
        if (f) {
          if (k.length > c || d) {
            k = k.slice(d, c + d);
          }
        } else {
          e = [];
          for (g = 0; g < k.length; g++) {
            if (f = k[g], f.length > d) {
              d -= f.length;
            } else {
              if (f.length > c || d) {
                f = f.slice(d, c + d), c -= f.length, d && (d -= f.length);
              }
              e.push(f);
              if (!c) {
                break;
              }
            }
          }
          k = 1 < e.length ? [].concat.apply([], e) : e[0];
        }
      }
    }
  }
  return k;
}
function kb(a, b, c, d, e) {
  var g = [], f = J(), h = a.length, k;
  if (d) {
    for (e = h - 1; 0 <= e; e--) {
      if (k = (d = a[e]) && d.length) {
        for (h = 0; h < k; h++) {
          var l = d[h];
          if (!f[l]) {
            if (f[l] = 1, c) {
              c--;
            } else {
              if (g.push(l), g.length === b) {
                return g;
              }
            }
          }
        }
      }
    }
  } else {
    for (var m = h - 1, n, p = 0; 0 <= m; m--) {
      n = a[m];
      for (var q = 0; q < n.length; q++) {
        if (k = (d = n[q]) && d.length) {
          for (var t = 0; t < k; t++) {
            if (l = d[t], !f[l]) {
              if (f[l] = 1, c) {
                c--;
              } else {
                var w = (q + (m < h - 1 ? e || 0 : 0)) / (m + 1) | 0;
                (g[w] || (g[w] = [])).push(l);
                if (++p === b) {
                  return g;
                }
              }
            }
          }
        }
      }
    }
  }
  return g;
}
function lb(a, b, c) {
  for (var d = J(), e = [], g = 0, f; g < b.length; g++) {
    f = b[g];
    for (var h = 0; h < f.length; h++) {
      d[f[h]] = 1;
    }
  }
  if (c) {
    for (b = 0; b < a.length; b++) {
      c = a[b], d[c] && (e.push(c), d[c] = 0);
    }
  } else {
    for (b = 0; b < a.result.length; b++) {
      for (c = a.result[b], f = 0; f < c.length; f++) {
        g = c[f], d[g] && ((e[b] || (e[b] = [])).push(g), d[g] = 0);
      }
    }
  }
  return e;
}
;function mb(a, b, c, d) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a, d ? X.call(this, a) : a;
  }
  for (var e = [], g = 0, f = void 0, h = void 0; g < a.length; g++) {
    if ((f = a[g]) && (h = f.length)) {
      if (c) {
        if (c >= h) {
          c -= h;
          continue;
        }
        c < h && (f = b ? f.slice(c, c + b) : f.slice(c), h = f.length, c = 0);
      }
      h > b && (f = f.slice(0, b), h = b);
      if (!e.length && h >= b) {
        return d ? X.call(this, f) : f;
      }
      e.push(f);
      b -= h;
      if (!b) {
        break;
      }
    }
  }
  e = 1 < e.length ? [].concat.apply([], e) : e[0];
  return d ? X.call(this, e) : e;
}
;function nb(a, b, c) {
  var d = c[0];
  if (d.then) {
    return Promise.all(c).then(function(q) {
      return a[b].apply(a, q);
    });
  }
  if (d[0] && d[0].index) {
    return a[b].apply(a, d);
  }
  d = [];
  for (var e = [], g = 0, f = 0, h, k, l, m = 0, n = void 0; m < c.length; m++) {
    if (n = c[m]) {
      var p = void 0;
      if (n.constructor === Y) {
        p = n.result;
      } else if (n.constructor === Array) {
        p = n;
      } else {
        if (g = n.limit || 0, f = n.offset || 0, l = n.suggest, k = n.resolve, h = n.enrich && k, n.index) {
          n.resolve = !1, n.enrich = !1, p = n.index.search(n).result, n.resolve = k, n.enrich = h;
        } else if (n.and) {
          p = a.and(n.and);
        } else if (n.or) {
          p = a.or(n.or);
        } else if (n.xor) {
          p = a.xor(n.xor);
        } else if (n.not) {
          p = a.not(n.not);
        } else {
          continue;
        }
      }
      if (p.then) {
        e.push(p);
      } else if (p.length) {
        d[m] = p;
      } else if (!l && ("and" === b || "xor" === b)) {
        d = [];
        break;
      }
    }
  }
  return {W:d, $:e, limit:g, offset:f, enrich:h, resolve:k, suggest:l};
}
;Y.prototype.or = function() {
  var a = nb(this, "or", arguments);
  return ob.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve);
};
function ob(a, b, c, d, e, g) {
  if (b.length) {
    var f = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (var k = 0, l = void 0; k < h.length; k++) {
        (l = h[k]).length && (a[k] = l);
      }
      return ob.call(f, a, [], c, d, e, g);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = kb(a, c, d, !1, this.h), d = 0));
  return g ? this.resolve(c, d, e) : this;
}
;Y.prototype.and = function() {
  var a = this.result.length;
  if (!a) {
    var b = arguments[0];
    if (b) {
      a = !!b.suggest;
      var c = b.resolve;
      var d = b.limit;
      var e = b.offset;
      var g = b.enrich && c;
    }
  }
  return a ? (a = nb(this, "and", arguments), pb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest)) : c ? this.resolve(d, e, g) : this;
};
function pb(a, b, c, d, e, g, f) {
  if (b.length) {
    var h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (var l = 0, m = void 0; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return pb.call(h, a, [], c, d, e, g, f);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (b = za(a)) {
        return this.result = jb(a, b, c, d, f, this.h, g), g ? e ? X.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    f || (this.result = a);
  }
  return g ? this.resolve(c, d, e) : this;
}
;Y.prototype.xor = function() {
  var a = nb(this, "xor", arguments);
  return qb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest);
};
function qb(a, b, c, d, e, g, f) {
  if (b.length) {
    var h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (var l = 0, m = void 0; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return qb.call(h, a, [], c, d, e, g, f);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = rb.call(this, a, c, d, g, this.h), g ? e ? X.call(this.index, this.result) : this.result : this;
    }
  } else {
    f || (this.result = a);
  }
  return g ? this.resolve(c, d, e) : this;
}
function rb(a, b, c, d, e) {
  for (var g = [], f = J(), h = 0, k = 0, l; k < a.length; k++) {
    if (l = a[k]) {
      h < l.length && (h = l.length);
      for (var m = 0, n; m < l.length; m++) {
        if (n = l[m]) {
          for (var p = 0, q; p < n.length; p++) {
            q = n[p], f[q] = f[q] ? 2 : 1;
          }
        }
      }
    }
  }
  for (l = k = 0; k < h; k++) {
    for (m = 0; m < a.length; m++) {
      if (n = a[m]) {
        if (n = n[k]) {
          for (p = 0; p < n.length; p++) {
            if (q = n[p], 1 === f[q]) {
              if (c) {
                c--;
              } else {
                if (d) {
                  if (g.push(q), g.length === b) {
                    return g;
                  }
                } else {
                  var t = k + (m ? e : 0);
                  g[t] || (g[t] = []);
                  g[t].push(q);
                  if (++l === b) {
                    return g;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return g;
}
;Y.prototype.not = function() {
  var a = nb(this, "not", arguments);
  return sb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest);
};
function sb(a, b, c, d, e, g, f) {
  if (b.length) {
    var h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (var l = 0, m = void 0; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return sb.call(h, a, [], c, d, e, g, f);
    });
  }
  if (a.length && this.result.length) {
    this.result = tb.call(this, a, c, d, g);
  } else if (g) {
    return this.resolve(c, d, e);
  }
  return g ? e ? X.call(this.index, this.result) : this.result : this;
}
function tb(a, b, c, d) {
  var e = [];
  a = new Set(a.flat().flat());
  for (var g = 0, f, h = 0; g < this.result.length; g++) {
    if (f = this.result[g]) {
      for (var k = 0, l; k < f.length; k++) {
        if (l = f[k], !a.has(l)) {
          if (c) {
            c--;
          } else {
            if (d) {
              if (e.push(l), e.length === b) {
                return e;
              }
            } else {
              if (e[g] || (e[g] = []), e[g].push(l), ++h === b) {
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
;function Y(a) {
  if (!this || this.constructor !== Y) {
    return new Y(a);
  }
  if (a && a.index) {
    return a.resolve = !1, this.index = a.index, this.h = a.boost || 0, this.result = a.index.search(a).result, this;
  }
  this.index = null;
  this.result = a || [];
  this.h = 0;
}
Y.prototype.limit = function(a) {
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
Y.prototype.offset = function(a) {
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
Y.prototype.boost = function(a) {
  this.h += a;
  return this;
};
Y.prototype.resolve = function(a, b, c) {
  var d = this.result, e = this.index;
  this.result = this.index = null;
  return d.length ? ("object" === typeof a && (c = a.enrich, b = a.offset, a = a.limit), mb.call(e, d, a || 100, b, c)) : d;
};
J();
W.prototype.search = function(a, b, c, d) {
  c || (!b && L(a) ? (c = a, a = "") : L(b) && (c = b, b = 0));
  var e = [], g = [], f, h = 0, k = !0;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    var l = c.pluck;
    var m = c.merge;
    var n = l || c.field || (n = c.index) && (n.index ? null : n);
    var p = this.tag && c.tag;
    var q = c.suggest;
    k = !1 !== c.resolve;
    if (!k && !l) {
      if (n = n || this.field) {
        K(n) ? l = n : (n.constructor === Array && 1 === n.length && (n = n[0]), l = n.field || n.index);
      }
      if (!l) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    this.store && c.enrich && !k && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    var t = (f = this.store && c.enrich && k) && c.highlight;
    b = c.limit || b;
    var w = c.offset || 0;
    b || (b = 100);
    if (p && (!this.db || !d)) {
      p.constructor !== Array && (p = [p]);
      for (var r = [], A = 0, z = void 0; A < p.length; A++) {
        z = p[A];
        if (K(z)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (z.field && z.tag) {
          var v = z.tag;
          if (v.constructor === Array) {
            for (var y = 0; y < v.length; y++) {
              r.push(z.field, v[y]);
            }
          } else {
            r.push(z.field, v);
          }
        } else {
          v = Object.keys(z);
          y = 0;
          for (var D = void 0, H = void 0; y < v.length; y++) {
            if (D = v[y], H = z[D], H.constructor === Array) {
              for (var I = 0; I < H.length; I++) {
                r.push(D, H[I]);
              }
            } else {
              r.push(D, H);
            }
          }
        }
      }
      if (!r.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      p = r;
      if (!a) {
        k = [];
        if (r.length) {
          for (g = 0; g < r.length; g += 2) {
            l = void 0;
            if (this.db) {
              l = this.index.get(r[g]);
              if (!l) {
                console.warn("Tag '" + r[g] + ":" + r[g + 1] + "' will be skipped because there is no field '" + r[g] + "'.");
                continue;
              }
              k.push(l = l.db.tag(r[g + 1], b, w, f));
            } else {
              l = ub.call(this, r[g], r[g + 1], b, w, f);
            }
            e.push({field:r[g], tag:r[g + 1], result:l});
          }
        }
        return k.length ? Promise.all(k).then(function(Q) {
          for (var R = 0; R < Q.length; R++) {
            e[R].result = Q[R];
          }
          return e;
        }) : e;
      }
    }
    n && n.constructor !== Array && (n = [n]);
  }
  n || (n = this.field);
  r = !d && (this.worker || this.db) && [];
  A = 0;
  for (y = z = v = void 0; A < n.length; A++) {
    if (z = n[A], !this.db || !this.tag || this.J[A]) {
      v = void 0;
      K(z) || (v = z, z = v.field, a = v.query || a, b = v.limit || b, w = v.offset || w, q = v.suggest || q, f = this.store && (v.enrich || f));
      if (d) {
        v = d[A];
      } else {
        y = v || c;
        v = this.index.get(z);
        if (p) {
          if (this.db) {
            y.tag = p;
            var Ka = v.db.support_tag_search;
            y.field = n;
          }
          Ka || (y.enrich = !1);
        }
        if (r) {
          r[A] = v.search(a, b, y);
          y && f && (y.enrich = f);
          continue;
        } else {
          v = v.search(a, b, y), y && f && (y.enrich = f);
        }
      }
      y = v && (k ? v.length : v.result.length);
      if (p && y) {
        D = [];
        H = 0;
        if (this.db && d) {
          if (!Ka) {
            for (I = n.length; I < d.length; I++) {
              var M = d[I];
              if (M && M.length) {
                H++, D.push(M);
              } else if (!q) {
                return k ? e : new Y(e);
              }
            }
          }
        } else {
          I = 0;
          for (var Yb = M = void 0; I < p.length; I += 2) {
            M = this.tag.get(p[I]);
            if (!M) {
              if (console.warn("Tag '" + p[I] + ":" + p[I + 1] + "' will be skipped because there is no field '" + p[I] + "'."), q) {
                continue;
              } else {
                return k ? e : new Y(e);
              }
            }
            if (Yb = (M = M && M.get(p[I + 1])) && M.length) {
              H++, D.push(M);
            } else if (!q) {
              return k ? e : new Y(e);
            }
          }
        }
        if (H) {
          v = lb(v, D, k);
          y = v.length;
          if (!y && !q) {
            return k ? v : new Y(v);
          }
          H--;
        }
      }
      if (y) {
        g[h] = z, e.push(v), h++;
      } else if (1 === n.length) {
        return k ? e : new Y(e);
      }
    }
  }
  if (r) {
    if (this.db && p && p.length && !Ka) {
      for (f = 0; f < p.length; f += 2) {
        g = this.index.get(p[f]);
        if (!g) {
          if (console.warn("Tag '" + p[f] + ":" + p[f + 1] + "' was not found because there is no field '" + p[f] + "'."), q) {
            continue;
          } else {
            return k ? e : new Y(e);
          }
        }
        r.push(g.db.tag(p[f + 1], b, w, !1));
      }
    }
    var Zb = this;
    return Promise.all(r).then(function(Q) {
      return Q.length ? Zb.search(a, b, c, Q) : Q;
    });
  }
  if (!h) {
    return k ? e : new Y(e);
  }
  if (l && (!f || !this.store)) {
    return e[0];
  }
  r = [];
  for (w = 0; w < g.length; w++) {
    q = e[w];
    f && q.length && "undefined" === typeof q[0].doc && (this.db ? r.push(q = this.index.get(this.field[0]).db.enrich(q)) : q = X.call(this, q));
    if (l) {
      return k ? q : new Y(q);
    }
    e[w] = {field:g[w], result:q};
  }
  if (f && this.db && r.length) {
    var La = this;
    return Promise.all(r).then(function(Q) {
      for (var R = 0; R < Q.length; R++) {
        e[R].result = Q[R];
      }
      return m ? vb(e, b) : t ? wb(e, a, La.index, La.field, La.J, t) : e;
    });
  }
  return m ? vb(e, b) : t ? wb(e, a, this.index, this.field, this.J, t) : e;
};
function wb(a, b, c, d, e, g) {
  for (var f, h, k, l = 0, m, n; l < a.length; l++) {
    var p = a[l].result;
    m = a[l].field;
    k = c.get(m);
    n = k.encoder;
    k = k.tokenize;
    m = e[d.indexOf(m)];
    n !== f && (f = n, h = f.encode(b));
    for (n = 0; n < p.length; n++) {
      var q = "", t = ya(p[n].doc, m), w = f.encode(t);
      t = t.split(f.split);
      for (var r = 0, A, z; r < w.length; r++) {
        if (A = w[r], z = t[r], A && z) {
          for (var v = void 0, y = 0, D; y < h.length; y++) {
            if (D = h[y], "strict" === k) {
              if (A === D) {
                q += (q ? " " : "") + g.replace("$1", z);
                v = !0;
                break;
              }
            } else {
              var H = A.indexOf(D);
              if (-1 < H) {
                q += (q ? " " : "") + z.substring(0, H) + g.replace("$1", z.substring(H, D.length)) + z.substring(H + D.length);
                v = !0;
                break;
              }
            }
          }
          v || (q += (q ? " " : "") + t[r]);
        }
      }
      p[n].highlight = q;
    }
  }
  return a;
}
function vb(a, b) {
  for (var c = [], d = J(), e = 0, g, f; e < a.length; e++) {
    g = a[e];
    f = g.result;
    for (var h = 0, k, l, m; h < f.length; h++) {
      if (l = f[h], "object" !== typeof l && (l = {id:l}), k = l.id, m = d[k]) {
        m.push(g.field);
      } else {
        if (c.length === b) {
          return c;
        }
        l.field = d[k] = [g.field];
        c.push(l);
      }
    }
  }
  return c;
}
function ub(a, b, c, d, e) {
  var g = this.tag.get(a);
  if (!g) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (g = g && g.get(b)) && g.length - d) && 0 < a) {
    if (a > c || d) {
      g = g.slice(d, d + c);
    }
    e && (g = X.call(this, g));
    return g;
  }
}
function X(a) {
  if (!this || !this.store) {
    return a;
  }
  for (var b = Array(a.length), c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {id:d, doc:this.store.get(d)};
  }
  return b;
}
;function W(a) {
  if (!this || this.constructor !== W) {
    return new W(a);
  }
  var b = a.document || a.doc || a, c, d;
  this.J = [];
  this.field = [];
  this.S = [];
  this.key = (c = b.key || b.id) && xb(c, this.S) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? d ? new V(d) : new Set() : d ? new U(d) : new Map();
  this.I = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (d ? new U(d) : new Map());
  this.cache = (c = a.cache || null) && new yb(c);
  a.cache = !1;
  this.worker = a.worker;
  this.priority = a.priority || 4;
  this.index = zb.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.L = [];
      this.aa = [];
      b = 0;
      for (var e = d = void 0; b < c.length; b++) {
        d = c[b];
        e = d.field || d;
        if (!e) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        d.custom ? this.L[b] = d.custom : (this.L[b] = xb(e, this.S), d.filter && ("string" === typeof this.L[b] && (this.L[b] = new String(this.L[b])), this.L[b].R = d.filter));
        this.aa[b] = e;
        this.tag.set(e, new Map());
      }
    }
  }
  if (this.worker) {
    this.fastupdate = !1;
    a = [];
    c = x(this.index.values());
    for (b = c.next(); !b.done; b = c.next()) {
      b = b.value, b.then && a.push(b);
    }
    if (a.length) {
      var g = this;
      return Promise.all(a).then(function(f) {
        for (var h = 0, k = x(g.index.entries()), l = k.next(); !l.done; l = k.next()) {
          l = l.value;
          var m = l[0];
          l[1].then && g.index.set(m, f[h++]);
        }
        return g;
      });
    }
  } else {
    a.db && (this.fastupdate = !1, this.mount(a.db));
  }
}
u = W.prototype;
u.mount = function(a) {
  if (this.worker) {
    throw Error("You can't use Worker-Indexes on a persistent model. That would be useless, since each of the persistent model acts like Worker-Index by default (Master/Slave).");
  }
  var b = this.field;
  if (this.tag) {
    for (var c = 0, d; c < this.aa.length; c++) {
      d = this.aa[c];
      var e;
      this.index.set(d, e = new P({}, this.reg));
      b === this.field && (b = b.slice(0));
      b.push(d);
      e.tag = this.tag.get(d);
    }
  }
  c = [];
  d = {db:a.db, type:a.type, fastupdate:a.fastupdate};
  e = 0;
  for (var g; e < b.length; e++) {
    d.field = g = b[e];
    g = this.index.get(g);
    var f = new a.constructor(a.id, d);
    f.id = a.id;
    c[e] = f.mount(g);
    g.document = !0;
    e ? g.bypass = !0 : g.store = this.store;
  }
  this.db = !0;
  return Promise.all(c);
};
u.commit = function(a, b) {
  var c = this, d, e, g, f;
  return ta(function(h) {
    if (1 == h.h) {
      d = [];
      e = x(c.index.values());
      for (g = e.next(); !g.done; g = e.next()) {
        f = g.value, d.push(f.commit(a, b));
      }
      return E(h, Promise.all(d), 2);
    }
    c.reg.clear();
    h.h = 0;
  });
};
u.destroy = function() {
  for (var a = [], b = x(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    a.push(c.value.destroy());
  }
  return Promise.all(a);
};
function zb(a, b) {
  var c = new Map(), d = b.index || b.field || b;
  K(d) && (d = [d]);
  for (var e = 0, g, f = void 0; e < d.length; e++) {
    g = d[e];
    K(g) || (f = g, g = g.field);
    f = L(f) ? Object.assign({}, a, f) : a;
    if (this.worker) {
      var h = new Sa(f);
      c.set(g, h);
    }
    this.worker || c.set(g, new P(f, this.reg));
    f.custom ? this.J[e] = f.custom : (this.J[e] = xb(g, this.S), f.filter && ("string" === typeof this.J[e] && (this.J[e] = new String(this.J[e])), this.J[e].R = f.filter));
    this.field[e] = g;
  }
  if (this.I) {
    for (a = b.store, K(a) && (a = [a]), b = 0; b < a.length; b++) {
      d = a[b], e = d.field || d, d.custom ? (this.I[b] = d.custom, d.custom.ja = e) : (this.I[b] = xb(e, this.S), d.filter && ("string" === typeof this.I[b] && (this.I[b] = new String(this.I[b])), this.I[b].R = d.filter));
    }
  }
  return c;
}
function xb(a, b) {
  for (var c = a.split(":"), d = 0, e = 0; e < c.length; e++) {
    a = c[e], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (b[d] = !0), a && (c[d++] = a);
  }
  d < c.length && (c.length = d);
  return 1 < d ? c : c[0];
}
u.append = function(a, b) {
  return this.add(a, b, !0);
};
u.update = function(a, b) {
  return this.remove(a).add(a, b);
};
u.remove = function(a) {
  L(a) && (a = ya(a, this.key));
  for (var b = x(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c.value.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (b = x(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
        c = c.value;
        for (var d = x(c), e = d.next(); !e.done; e = d.next()) {
          var g = e.value;
          e = g[0];
          g = g[1];
          var f = g.indexOf(a);
          -1 < f && (1 < g.length ? g.splice(f, 1) : c.delete(e));
        }
      }
    }
    this.store && this.store.delete(a);
    this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
u.clear = function() {
  for (var a = [], b = x(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c = c.value.clear(), c.then && a.push(c);
  }
  if (this.tag) {
    for (b = x(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
      c.value.clear();
    }
  }
  this.store && this.store.clear();
  this.cache && this.cache.clear();
  return a.length ? Promise.all(a) : this;
};
u.contain = function(a) {
  return this.db ? this.index.get(this.field[0]).db.has(a) : this.reg.has(a);
};
u.cleanup = function() {
  for (var a = x(this.index.values()), b = a.next(); !b.done; b = a.next()) {
    b.value.cleanup();
  }
  return this;
};
u.get = function(a) {
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(b) {
    return b[0] && b[0].doc;
  }) : this.store.get(a);
};
u.set = function(a, b) {
  this.store.set(a, b);
  return this;
};
u.searchCache = Ab;
u.export = function(a, b, c, d) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  if (c < this.field.length) {
    var e = this.field[c];
    if ((b = this.index.get(e).export(a, e, c, d = 1)) && b.then) {
      var g = this;
      return b.then(function() {
        return g.export(a, e, c + 1);
      });
    }
    return this.export(a, e, c + 1);
  }
  switch(d) {
    case 0:
      var f = "reg";
      var h = Ya(this.reg);
      b = null;
      break;
    case 1:
      f = "tag";
      h = this.tag && Wa(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      f = "doc";
      h = this.store && Ua(this.store);
      b = null;
      break;
    default:
      return;
  }
  return $a.call(this, a, b, f, h, c, d);
};
u.import = function(a, b) {
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
        this.reg = Za(b, this.reg);
        for (b = 0; b < this.field.length; b++) {
          d = this.index.get(this.field[b]), d.fastupdate = !1, d.reg = this.reg;
        }
        if (this.worker) {
          b = [];
          d = x(this.index.values());
          for (c = d.next(); !c.done; c = d.next()) {
            b.push(c.value.import(a));
          }
          return Promise.all(b);
        }
        break;
      case "tag":
        this.tag = Xa(b, this.tag);
        break;
      case "doc":
        this.store = Va(b, this.store);
    }
  }
};
Ja(W.prototype);
function Ab(a, b, c) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new yb());
  var d = this.cache.get(a);
  if (!d) {
    d = this.search(a, b, c);
    if (d.then) {
      var e = this;
      d.then(function(g) {
        e.cache.set(a, g);
        return g;
      });
    }
    this.cache.set(a, d);
  }
  return d;
}
function yb(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
yb.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
yb.prototype.get = function(a) {
  var b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
yb.prototype.remove = function(a) {
  for (var b = x(this.cache), c = b.next(); !c.done; c = b.next()) {
    c = c.value;
    var d = c[0];
    c[1].includes(a) && this.cache.delete(d);
  }
};
yb.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
var Bb = {normalize:function(a) {
  return a.toLowerCase();
}};
var Cb = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
var Db = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Eb = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
var Fb = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var Gb = /[\x00-\x7F]+/g;
var Hb = /[\x00-\x7F]+/g;
var Ib = /[\x00-\x7F]+/g;
var Jb = {LatinExact:{split:/\s+/, normalize:!1}, LatinDefault:Bb, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:Cb}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:Cb, matcher:Db, replacer:Eb}, LatinExtra:{normalize:!0, dedupe:!0, mapper:Cb, replacer:Eb.concat([/(?!^)[aeo]/g, ""]), matcher:Db}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (var b = 0; b < a.length; b++) {
    for (var c = a[b], d = c.charAt(0), e = Fb[d], g = 1, f; g < c.length && (f = c.charAt(g), "h" === f || "w" === f || !(f = Fb[f]) || f === e || (d += f, e = f, 4 !== d.length)); g++) {
    }
    a[b] = d;
  }
}}, ArabicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(Gb, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(Hb, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(Ib, " ");
}}};
var Kb = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
P.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (d = b.length) {
      for (var e = J(), g = J(), f = this.depth, h = this.resolution, k = 0; k < d; k++) {
        var l = b[this.rtl ? d - 1 - k : k], m = l.length;
        if (m && (f || !g[l])) {
          var n = this.score ? this.score(b, l, k, null, 0) : Lb(h, d, k), p = "";
          switch(this.tokenize) {
            case "full":
              if (2 < m) {
                n = 0;
                for (var q; n < m; n++) {
                  for (var t = m; t > n; t--) {
                    p = l.substring(n, t), q = this.rtl ? m - 1 - n : n, q = this.score ? this.score(b, l, k, p, q) : Lb(h, d, k, m, q), Mb(this, g, p, q, a, c);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < m) {
                for (t = m - 1; 0 < t; t--) {
                  p = l[this.rtl ? m - 1 - t : t] + p, q = this.score ? this.score(b, l, k, p, t) : Lb(h, d, k, m, t), Mb(this, g, p, q, a, c);
                }
                p = "";
              }
            case "forward":
              if (1 < m) {
                for (t = 0; t < m; t++) {
                  p += l[this.rtl ? m - 1 - t : t], Mb(this, g, p, n, a, c);
                }
                break;
              }
            default:
              if (Mb(this, g, l, n, a, c), f && 1 < d && k < d - 1) {
                for (m = J(), p = this.da, n = l, t = Math.min(f + 1, this.rtl ? k + 1 : d - k), q = m[n] = 1; q < t; q++) {
                  if ((l = b[this.rtl ? d - 1 - k - q : k + q]) && !m[l]) {
                    m[l] = 1;
                    var w = this.score ? this.score(b, n, k, l, q - 1) : Lb(p + (d / 2 > p ? 0 : 1), d, k, t - 1, q - 1), r = this.bidirectional && l > n;
                    Mb(this, e, r ? n : l, w, a, c, r ? l : n);
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
  this.db && (b || this.commit_task.push({del:a}), this.ca && Nb(this));
  return this;
};
function Mb(a, b, c, d, e, g, f) {
  var h = f ? a.ctx : a.map, k;
  if (!b[c] || f && !(k = b[c])[f]) {
    if (f ? (b = k || (b[c] = J()), b[f] = 1, (k = h.get(f)) ? h = k : h.set(f, h = new Map())) : b[c] = 1, (k = h.get(c)) ? h = k : h.set(c, h = k = []), h = h[d] || (h[d] = []), !g || !h.includes(e)) {
      if (h.length === Math.pow(2, 31) - 1) {
        b = new T(h);
        if (a.fastupdate) {
          for (c = x(a.reg.values()), g = c.next(); !g.done; g = c.next()) {
            g = g.value, g.includes(h) && (g[g.indexOf(h)] = b);
          }
        }
        k[d] = h = b;
      }
      h.push(e);
      a.fastupdate && ((d = a.reg.get(e)) ? d.push(h) : a.reg.set(e, [h]));
    }
  }
}
function Lb(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;P.prototype.search = function(a, b, c) {
  c || (!b && L(a) ? (c = a, a = "") : L(b) && (c = b, b = 0));
  var d = [], e = 0, g;
  if (c) {
    a = c.query || a;
    b = c.limit || b;
    e = c.offset || 0;
    var f = c.context;
    var h = c.suggest;
    var k = (g = !1 !== c.resolve) && c.enrich;
    var l = c.boost;
    var m = c.resolution;
    var n = this.db && c.tag;
  } else {
    g = this.resolve;
  }
  var p = this.encoder.encode(a);
  var q = p.length;
  b = b || (g ? 100 : 0);
  if (1 === q) {
    return Ob.call(this, p[0], "", b, e, g, k, n);
  }
  f = this.depth && !1 !== f;
  if (2 === q && f && !h) {
    return Ob.call(this, p[0], p[1], b, e, g, k, n);
  }
  var t = J(), w = 0;
  if (1 < q && f) {
    var r = p[0];
    w = 1;
  }
  m || 0 === m || (m = r ? this.da : this.resolution);
  if (this.db) {
    if (this.db.search && (a = this.db.search(this, p, b, e, h, g, k, n), !1 !== a)) {
      return a;
    }
    var A = this;
    return function() {
      var z, v;
      return ta(function(y) {
        switch(y.h) {
          case 1:
            v = z = void 0;
          case 2:
            if (!(w < q)) {
              y.h = 4;
              break;
            }
            v = p[w];
            if (!v || t[v]) {
              y.h = 5;
              break;
            }
            t[v] = 1;
            return E(y, Pb(A, v, r, 0, 0, !1, !1), 6);
          case 6:
            z = y.D;
            if (z = Qb(z, d, h, m)) {
              d = z;
              y.h = 4;
              break;
            }
            r && (h && z && d.length || (r = v));
          case 5:
            h && r && w === q - 1 && !d.length && (m = A.resolution, r = "", w = -1, t = J());
            w++;
            y.h = 2;
            break;
          case 4:
            return y.return(Rb(d, m, b, e, h, l, g));
        }
      });
    }();
  }
  for (c = a = void 0; w < q; w++) {
    if ((c = p[w]) && !t[c]) {
      t[c] = 1;
      a = Pb(this, c, r, 0, 0, !1, !1);
      if (a = Qb(a, d, h, m)) {
        d = a;
        break;
      }
      r && (h && a && d.length || (r = c));
    }
    h && r && w === q - 1 && !d.length && (m = this.resolution, r = "", w = -1, t = J());
  }
  return Rb(d, m, b, e, h, l, g);
};
function Rb(a, b, c, d, e, g, f) {
  var h = a.length, k = a;
  if (1 < h) {
    k = jb(a, b, c, d, e, g, f);
  } else if (1 === h) {
    return f ? mb.call(null, a[0], c, d) : new Y(a[0]);
  }
  return f ? k : new Y(k);
}
function Ob(a, b, c, d, e, g, f) {
  a = Pb(this, a, b, c, d, e, g, f);
  return this.db ? a.then(function(h) {
    return e ? h || [] : new Y(h);
  }) : a && a.length ? e ? mb.call(this, a, c, d) : new Y(a) : e ? [] : new Y();
}
function Qb(a, b, c, d) {
  var e = [];
  if (a && a.length) {
    if (a.length <= d) {
      b.push(a);
      return;
    }
    for (var g = 0, f; g < d; g++) {
      if (f = a[g]) {
        e[g] = f;
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
function Pb(a, b, c, d, e, g, f, h) {
  var k;
  c && (k = a.bidirectional && b > c) && (k = c, c = b, b = k);
  if (a.db) {
    return a.db.get(b, c, d, e, g, f, h);
  }
  a = c ? (a = a.ctx.get(c)) && a.get(b) : a.map.get(b);
  return a;
}
;P.prototype.remove = function(a, b) {
  var c = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (c) {
    if (this.fastupdate) {
      for (var d = 0, e; d < c.length; d++) {
        if (e = c[d]) {
          if (2 > e.length) {
            e.pop();
          } else {
            var g = e.indexOf(a);
            g === c.length - 1 ? e.pop() : e.splice(g, 1);
          }
        }
      }
    } else {
      Sb(this.map, a), this.depth && Sb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.ca && Nb(this));
  this.cache && this.cache.remove(a);
  return this;
};
function Sb(a, b) {
  var c = 0;
  if (a.constructor === Array) {
    for (var d = 0, e = void 0, g; d < a.length; d++) {
      if ((e = a[d]) && e.length) {
        if (g = e.indexOf(b), 0 <= g) {
          1 < e.length ? (e.splice(g, 1), c++) : delete a[d];
          break;
        } else {
          c++;
        }
      }
    }
  } else {
    for (d = x(a.entries()), e = d.next(); !e.done; e = d.next()) {
      g = e.value, e = g[0], (g = Sb(g[1], b)) ? c += g : a.delete(e);
    }
  }
  return c;
}
;function P(a, b) {
  if (!this || this.constructor !== P) {
    return new P(a);
  }
  if (a) {
    var c = K(a) ? a : a.preset;
    c && (Kb[c] || console.warn("Preset not found: " + c), a = Object.assign({}, Kb[c], a));
  } else {
    a = {};
  }
  c = a.context;
  var d = !0 === c ? {depth:1} : c || {}, e = K(a.encoder) ? Jb[a.encoder] : a.encode || a.encoder || Bb;
  this.encoder = e.encode ? e : "object" === typeof e ? new Ga(e) : {encode:e};
  this.resolution = a.resolution || 9;
  this.tokenize = c = (c = a.tokenize) && "default" !== c && c || "strict";
  this.depth = "strict" === c && d.depth || 0;
  this.bidirectional = !1 !== d.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  d && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new U(c) : new Map();
  this.ctx = c ? new U(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new U(c) : new Map() : c ? new V(c) : new Set());
  this.da = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new yb(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.ca = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
u = P.prototype;
u.mount = function(a) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return a.mount(this);
};
u.commit = function(a, b) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.commit(this, a, b);
};
u.destroy = function() {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.destroy();
};
function Nb(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a, void 0, void 0);
  }, 1));
}
u.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  this.db && (this.commit_timer && clearTimeout(this.commit_timer), this.commit_timer = null, this.commit_task = [{clear:!0}]);
  return this;
};
u.append = function(a, b) {
  return this.add(a, b, !0);
};
u.contain = function(a) {
  return this.db ? this.db.has(a) : this.reg.has(a);
};
u.update = function(a, b) {
  var c = this, d = this.remove(a);
  return d && d.then ? d.then(function() {
    return c.add(a, b);
  }) : this.add(a, b);
};
function Tb(a) {
  var b = 0;
  if (a.constructor === Array) {
    for (var c = 0, d = void 0; c < a.length; c++) {
      (d = a[c]) && (b += d.length);
    }
  } else {
    for (c = x(a.entries()), d = c.next(); !d.done; d = c.next()) {
      var e = d.value;
      d = e[0];
      (e = Tb(e[1])) ? b += e : a.delete(d);
    }
  }
  return b;
}
u.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Tb(this.map);
  this.depth && Tb(this.ctx);
  return this;
};
u.searchCache = Ab;
u.export = function(a, b, c, d) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  switch(d) {
    case 0:
      var e = "reg";
      var g = Ya(this.reg);
      break;
    case 1:
      e = "cfg";
      g = null;
      break;
    case 2:
      e = "map";
      g = Ua(this.map, this.reg.size);
      break;
    case 3:
      e = "ctx";
      g = Wa(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return $a.call(this, a, b, e, g, c, d);
};
u.import = function(a, b) {
  if (b) {
    switch("string" === typeof b && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Za(b, this.reg);
        break;
      case "map":
        this.map = Va(b, this.map);
        break;
      case "ctx":
        this.ctx = Xa(b, this.ctx);
    }
  }
};
u.serialize = function(a) {
  a = void 0 === a ? !0 : a;
  var b = "", c = "", d = "";
  if (this.reg.size) {
    var e;
    c = x(this.reg.keys());
    for (var g = c.next(); !g.done; g = c.next()) {
      g = g.value, e || (e = typeof g), b += (b ? "," : "") + ("string" === e ? '"' + g + '"' : g);
    }
    b = "index.reg=new Set([" + b + "]);";
    c = ab(this.map, e);
    c = "index.map=new Map([" + c + "]);";
    g = x(this.ctx.entries());
    for (var f = g.next(); !f.done; f = g.next()) {
      var h = f.value;
      f = h[0];
      h = ab(h[1], e);
      h = "new Map([" + h + "])";
      h = '["' + f + '",' + h + "]";
      d += (d ? "," : "") + h;
    }
    d = "index.ctx=new Map([" + d + "]);";
  }
  return a ? "function inject(index){" + b + c + d + "}" : b + c + d;
};
Ja(P.prototype);
var Ub = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), Vb = ["map", "ctx", "tag", "reg", "cfg"], Wb = J();
function Xb(a, b) {
  b = void 0 === b ? {} : b;
  if (!this) {
    return new Xb(a, b);
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
u = Xb.prototype;
u.mount = function(a) {
  if (!a.encoder) {
    return a.mount(this);
  }
  a.db = this;
  return this.open();
};
u.open = function() {
  if (this.db) {
    return this.db;
  }
  var a = this;
  navigator.storage && navigator.storage.persist();
  Wb[a.id] || (Wb[a.id] = []);
  Wb[a.id].push(a.field);
  var b = Ub.open(a.id, 1);
  b.onupgradeneeded = function() {
    for (var c = a.db = this.result, d = 0, e; d < Vb.length; d++) {
      e = Vb[d];
      for (var g = 0, f; g < Wb[a.id].length; g++) {
        f = Wb[a.id][g], c.objectStoreNames.contains(e + ("reg" !== e ? f ? ":" + f : "" : "")) || c.createObjectStore(e + ("reg" !== e ? f ? ":" + f : "" : ""));
      }
    }
  };
  return a.db = Z(b, function(c) {
    a.db = c;
    a.db.onversionchange = function() {
      a.close();
    };
  });
};
u.close = function() {
  this.db && this.db.close();
  this.db = null;
};
u.destroy = function() {
  var a = Ub.deleteDatabase(this.id);
  return Z(a);
};
u.clear = function() {
  for (var a = [], b = 0, c; b < Vb.length; b++) {
    c = Vb[b];
    for (var d = 0, e; d < Wb[this.id].length; d++) {
      e = Wb[this.id][d], a.push(c + ("reg" !== c ? e ? ":" + e : "" : ""));
    }
  }
  b = this.db.transaction(a, "readwrite");
  for (c = 0; c < a.length; c++) {
    b.objectStore(a[c]).clear();
  }
  return Z(b);
};
u.get = function(a, b, c, d, e, g) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  e = void 0 === e ? !0 : e;
  g = void 0 === g ? !1 : g;
  a = this.db.transaction((b ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((b ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(b ? b + ":" + a : a);
  var f = this;
  return Z(a).then(function(h) {
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
            for (var n = c ? d + Math.min(m.length - d, c) : m.length, p = d; p < n; p++) {
              k.push(m[p]);
            }
            d = 0;
            if (k.length === c) {
              break;
            }
          }
        }
      }
      return g ? f.enrich(k) : k;
    }
    return h;
  });
};
u.tag = function(a, b, c, d) {
  b = void 0 === b ? 0 : b;
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? !1 : d;
  a = this.db.transaction("tag" + (this.field ? ":" + this.field : ""), "readonly").objectStore("tag" + (this.field ? ":" + this.field : "")).get(a);
  var e = this;
  return Z(a).then(function(g) {
    if (!g || !g.length || c >= g.length) {
      return [];
    }
    if (!b && !c) {
      return g;
    }
    g = g.slice(c, c + b);
    return d ? e.enrich(g) : g;
  });
};
u.enrich = function(a) {
  "object" !== typeof a && (a = [a]);
  for (var b = this.db.transaction("reg", "readonly").objectStore("reg"), c = [], d = 0; d < a.length; d++) {
    c[d] = Z(b.get(a[d]));
  }
  return Promise.all(c).then(function(e) {
    for (var g = 0; g < e.length; g++) {
      e[g] = {id:a[g], doc:e[g] ? JSON.parse(e[g]) : null};
    }
    return e;
  });
};
u.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return Z(a).then(function(b) {
    return !!b;
  });
};
u.search = null;
u.info = function() {
};
u.transaction = function(a, b, c) {
  a += "reg" !== a ? this.field ? ":" + this.field : "" : "";
  var d = this.h[a + ":" + b];
  if (d) {
    return c.call(this, d);
  }
  var e = this.db.transaction(a, b);
  this.h[a + ":" + b] = d = e.objectStore(a);
  var g = c.call(this, d);
  this.h[a + ":" + b] = null;
  return Z(e).finally(function() {
    e = d = null;
    return g;
  });
};
u.commit = function(a, b, c) {
  var d = this, e, g, f;
  return ta(function(h) {
    switch(h.h) {
      case 1:
        if (b) {
          return E(h, d.clear(), 12);
        }
        e = a.commit_task;
        a.commit_task = [];
        g = 0;
        f = void 0;
      case 4:
        if (!(g < e.length)) {
          h.h = 6;
          break;
        }
        f = e[g];
        if (!f.clear) {
          e[g] = f.del;
          h.h = 5;
          break;
        }
        return E(h, d.clear(), 8);
      case 8:
        b = !0;
        h.h = 6;
        break;
      case 5:
        g++;
        h.h = 4;
        break;
      case 6:
        if (b) {
          h.h = 3;
          break;
        }
        c || (e = e.concat(xa(a.reg)));
        if (!e.length) {
          h.h = 10;
          break;
        }
        return E(h, d.remove(e), 11);
      case 11:
      case 10:
        h.h = 3;
        break;
      case 12:
        a.commit_task = [];
      case 3:
        return a.reg.size ? E(h, d.transaction("map", "readwrite", function(k) {
          for (var l = x(a.map), m = l.next(), n = {}; !m.done; n = {O:void 0, Y:void 0}, m = l.next()) {
            m = m.value, n.Y = m[0], n.O = m[1], n.O.length && (b ? k.put(n.O, n.Y) : k.get(n.Y).onsuccess = function(p) {
              return function() {
                var q = this.result, t;
                if (q && q.length) {
                  for (var w = Math.max(q.length, p.O.length), r = 0, A; r < w; r++) {
                    if ((A = p.O[r]) && A.length) {
                      if ((t = q[r]) && t.length) {
                        for (var z = 0; z < A.length; z++) {
                          t.push(A[z]);
                        }
                      } else {
                        q[r] = A;
                      }
                      t = 1;
                    }
                  }
                } else {
                  q = p.O, t = 1;
                }
                t && k.put(q, p.Y);
              };
            }(n));
          }
        }), 13) : h.return();
      case 13:
        return E(h, d.transaction("ctx", "readwrite", function(k) {
          for (var l = x(a.ctx), m = l.next(), n = {}; !m.done; n = {V:void 0}, m = l.next()) {
            m = m.value;
            n.V = m[0];
            m = x(m[1]);
            for (var p = m.next(), q = {}; !p.done; q = {P:void 0, Z:void 0}, p = m.next()) {
              p = p.value, q.Z = p[0], q.P = p[1], q.P.length && (b ? k.put(q.P, n.V + ":" + q.Z) : k.get(n.V + ":" + q.Z).onsuccess = function(t, w) {
                return function() {
                  var r = this.result, A;
                  if (r && r.length) {
                    for (var z = Math.max(r.length, t.P.length), v = 0, y; v < z; v++) {
                      if ((y = t.P[v]) && y.length) {
                        if ((A = r[v]) && A.length) {
                          for (var D = 0; D < y.length; D++) {
                            A.push(y[D]);
                          }
                        } else {
                          r[v] = y;
                        }
                        A = 1;
                      }
                    }
                  } else {
                    r = t.P, A = 1;
                  }
                  A && k.put(r, w.V + ":" + t.Z);
                };
              }(q, n));
            }
          }
        }), 14);
      case 14:
        if (a.store) {
          return E(h, d.transaction("reg", "readwrite", function(k) {
            for (var l = x(a.store), m = l.next(); !m.done; m = l.next()) {
              var n = m.value;
              m = n[0];
              n = n[1];
              k.put("object" === typeof n ? JSON.stringify(n) : 1, m);
            }
          }), 16);
        }
        if (a.bypass) {
          h.h = 16;
          break;
        }
        return E(h, d.transaction("reg", "readwrite", function(k) {
          for (var l = x(a.reg.keys()), m = l.next(); !m.done; m = l.next()) {
            k.put(1, m.value);
          }
        }), 16);
      case 16:
        if (!a.tag) {
          h.h = 20;
          break;
        }
        return E(h, d.transaction("tag", "readwrite", function(k) {
          for (var l = x(a.tag), m = l.next(), n = {}; !m.done; n = {X:void 0, ba:void 0}, m = l.next()) {
            m = m.value, n.ba = m[0], n.X = m[1], n.X.length && (k.get(n.ba).onsuccess = function(p) {
              return function() {
                var q = this.result;
                q = q && q.length ? q.concat(p.X) : p.X;
                k.put(q, p.ba);
              };
            }(n));
          }
        }), 20);
      case 20:
        a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear(), h.h = 0;
    }
  });
};
function $b(a, b, c) {
  for (var d = a.value, e, g = 0, f = 0, h; f < d.length; f++) {
    if (h = c ? d : d[f]) {
      for (var k = 0, l; k < b.length; k++) {
        if (l = b[k], l = h.indexOf(l), 0 <= l) {
          if (e = 1, 1 < h.length) {
            h.splice(l, 1);
          } else {
            d[f] = [];
            break;
          }
        }
      }
      g += h.length;
    }
    if (c) {
      break;
    }
  }
  g ? e && a.update(d) : a.delete();
  a.continue();
}
u.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && $b(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && $b(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && $b(c, a, !0);
    };
  }), this.transaction("reg", "readwrite", function(b) {
    for (var c = 0; c < a.length; c++) {
      b.delete(a[c]);
    }
  })]);
};
function Z(a, b) {
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
;var ac = {Index:P, Charset:Jb, Encoder:Ga, Document:W, Worker:Sa, Resolver:Y, IndexedDB:Xb, Language:{}}, bc = "undefined" !== typeof self ? self : "undefined" !== typeof global ? global : self, cc;
(cc = bc.define) && cc.amd ? cc([], function() {
  return ac;
}) : "object" === typeof bc.exports ? bc.exports = ac : bc.FlexSearch = ac;
}(this||self));
