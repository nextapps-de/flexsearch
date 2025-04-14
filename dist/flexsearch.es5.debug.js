/**!
 * FlexSearch.js v0.8.156 (ES5/Debug)
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
function y(a) {
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
function D(a, b, c) {
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
      for (var l = y(f), m = l.next(); !m.done; m = l.next()) {
        d(m.value).U(h, k);
      }
    });
  };
  b.all = function(f) {
    var h = y(f), k = h.next();
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
      k = y(k);
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
    return h.J = h.next = h.head = h;
  }
  function c(h, k) {
    var l = h[1];
    return ua(function() {
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
      h = y(h);
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
      var h = Object.seal({x:4}), k = new a(y([[h, "s"]]));
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
  var f = 0;
  return e;
});
C("Set", function(a) {
  function b(c) {
    this.h = new Map();
    if (c) {
      c = y(c);
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
      var c = Object.seal({x:4}), d = new a(y([c]));
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
            d = y(a);
            for (e = d.next(); !e.done; e = d.next()) {
              e = e.value, b.set(e[0], e[1]);
            }
            return b;
          }
          if (b === Set) {
            b = new Set(c);
            d = y(a.values());
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
function I() {
  return Object.create(null);
}
function J(a) {
  return "string" === typeof a;
}
function xa(a) {
  return "object" === typeof a;
}
function ya(a) {
  var b = [];
  a = y(a.keys());
  for (var c = a.next(); !c.done; c = a.next()) {
    b.push(c.value);
  }
  return b;
}
function za(a, b) {
  if (J(b)) {
    a = a[b];
  } else {
    for (var c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function Aa(a) {
  for (var b = 0, c = 0, d = void 0; c < a.length; c++) {
    (d = a[c]) && b < d.length && (b = d.length);
  }
  return b;
}
;var Ba = /[^\p{L}\p{N}]+/u, Ca = /(\d{3})/g, Da = /(\D)(\d{3})/g, Ea = /(\d{3})(\D)/g, Fa = /[\u0300-\u036f]/g;
function Ga(a) {
  a = void 0 === a ? {} : a;
  if (!this || this.constructor !== Ga) {
    var b = Function.prototype.bind, c = b.apply, d = [null], e = d.concat;
    if (arguments instanceof Array) {
      var g = arguments;
    } else {
      g = y(arguments);
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
  c = a.filter;
  this.filter = "function" === typeof c ? c : G(c && new Set(c), null, this.filter);
  this.dedupe = G(a.dedupe, !0, this.dedupe);
  this.matcher = G((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = G((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = G((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = G(a.replacer, null, this.replacer);
  this.minlength = G(a.minlength, 1, this.minlength);
  this.maxlength = G(a.maxlength, 1024, this.maxlength);
  this.rtl = G(a.rtl, !1, this.rtl);
  if (this.cache = c = G(a.cache, !0, this.cache)) {
    this.D = null, this.T = "number" === typeof c ? c : 2e5, this.B = new Map(), this.C = new Map(), this.H = this.G = 128;
  }
  this.h = "";
  this.M = null;
  this.A = "";
  this.N = null;
  if (this.matcher) {
    for (a = y(this.matcher.keys()), b = a.next(); !b.done; b = a.next()) {
      this.h += (this.h ? "|" : "") + b.value;
    }
  }
  if (this.stemmer) {
    for (a = y(this.stemmer.keys()), b = a.next(); !b.done; b = a.next()) {
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
  this.cache && K(this);
  return this;
};
u.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && K(this);
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
  this.cache && K(this);
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
  this.cache && K(this);
  return this;
};
u.addReplacer = function(a, b) {
  if ("string" === typeof a) {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && K(this);
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
      this.D = setTimeout(K, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = Fa ? a.normalize("NFKD").replace(Fa, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(Da, "$1 $2").replace(Ea, "$1 $2").replace(Ca, "$1 "));
  for (var c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer), d = [], e = this.split || "" === this.split ? a.split(this.split) : a, g = 0, f = void 0, h = void 0; g < e.length; g++) {
    if ((f = h = e[g]) && !(f.length < this.minlength || f.length > this.maxlength)) {
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
              this.D = setTimeout(K, 50, this);
            }
          }
          this.stemmer && 2 < f.length && (this.N || (this.N = new RegExp("(?!^)(" + this.A + ")$")), f = f.replace(this.N, function(q) {
            return b.stemmer.get(q);
          }));
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
function K(a) {
  a.D = null;
  a.B.clear();
  a.C.clear();
}
;var Ha, M;
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
            M = a.options || {};
            (e = a.factory) ? (Function("return " + e)()(self), Ha = new self.FlexSearch.Index(M), delete self.FlexSearch) : Ha = new O(M);
            postMessage({id:c});
            break;
          default:
            h.h = 2;
            return;
        }h.h = 0;
        break;
      case 2:
        if ("export" === b) {
          if (!M.export || "function" !== typeof M.export) {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
          }
          d[1] ? (d[0] = M.export, d[2] = 0, d[3] = 1) : d = null;
        }
        if ("import" === b) {
          if (!M.import || "function" !== typeof M.import) {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
          }
          if (!d[0]) {
            h.h = 5;
            break;
          }
          return D(h, M.import.call(Ha, d[0]), 9);
        }
        g = d && Ha[b].apply(Ha, d);
        if (!g || !g.then) {
          h.h = 5;
          break;
        }
        return D(h, g, 7);
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
  Ka.call(a, "add");
  Ka.call(a, "append");
  Ka.call(a, "search");
  Ka.call(a, "update");
  Ka.call(a, "remove");
}
var La, Na, Oa;
function Pa() {
  La = Oa = 0;
}
function Ka(a) {
  this[a + "Async"] = function() {
    var b = arguments, c = b[b.length - 1];
    if ("function" === typeof c) {
      var d = c;
      delete b[b.length - 1];
    }
    La ? Oa || (Oa = Date.now() - Na >= this.priority * this.priority * 3) : (La = setTimeout(Pa, 0), Na = Date.now());
    if (Oa) {
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
;var Qa = 0;
function Ra(a) {
  function b(f) {
    function h(k) {
      k = k.data || k;
      var l = k.id, m = l && e.h[l];
      m && (m(k.msg), delete e.h[l]);
    }
    this.worker = f;
    this.h = I();
    if (this.worker) {
      d ? this.worker.on("message", h) : this.worker.onmessage = h;
      if (a.config) {
        return new Promise(function(k) {
          e.h[++Qa] = function() {
            k(e);
            1e9 < Qa && (Qa = 0);
          };
          e.worker.postMessage({id:Qa, task:"init", factory:c, options:a});
        });
      }
      this.worker.postMessage({task:"init", factory:c, options:a});
      this.priority = a.priority || 4;
      return this;
    }
  }
  a = void 0 === a ? {} : a;
  if (!this || this.constructor !== Ra) {
    return new Ra(a);
  }
  var c = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  c && (c = c.toString());
  var d = "undefined" === typeof window, e = this, g = Sa(c, d, a.worker);
  return g.then ? g.then(function(f) {
    return b.call(e, f);
  }) : b.call(this, g);
}
P("add");
P("append");
P("search");
P("update");
P("remove");
P("clear");
P("export");
P("import");
Ja(Ra.prototype);
function P(a) {
  Ra.prototype[a] = function() {
    var b = this, c = [].slice.call(arguments), d = c[c.length - 1];
    if ("function" === typeof d) {
      var e = d;
      c.pop();
    }
    d = new Promise(function(g) {
      "export" === a && "function" === typeof c[0] && (c[0] = null);
      b.h[++Qa] = g;
      b.worker.postMessage({task:a, id:Qa, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function Sa(a, b, c) {
  return b ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + Ia.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof c ? c : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function Ta(a, b) {
  b = void 0 === b ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 5000 | 0);
  a = y(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    d.push(e.value), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function Ua(a, b) {
  b || (b = new Map());
  for (var c = 0, d; c < a.length; c++) {
    d = a[c], b.set(d[0], d[1]);
  }
  return b;
}
function Va(a, b) {
  b = void 0 === b ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 1000 | 0);
  a = y(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    e = e.value, d.push([e[0], Ta(e[1])[0]]), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function Wa(a, b) {
  b || (b = new Map());
  for (var c = 0, d, e; c < a.length; c++) {
    d = a[c], e = b.get(d[0]), b.set(d[0], Ua(d[1], e));
  }
  return b;
}
function Xa(a) {
  var b = [], c = [];
  a = y(a.keys());
  for (var d = a.next(); !d.done; d = a.next()) {
    c.push(d.value), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function Ya(a, b) {
  b || (b = new Set());
  for (var c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function Za(a, b, c, d, e, g, f) {
  f = void 0 === f ? 0 : f;
  var h = d && d.constructor === Array, k = h ? d.shift() : d;
  if (!k) {
    return this.export(a, b, e, g + 1);
  }
  if ((k = a((b ? b + "." : "") + (f + 1) + "." + c, JSON.stringify(k))) && k.then) {
    var l = this;
    return k.then(function() {
      return Za.call(l, a, b, c, h ? d : null, e, g, f + 1);
    });
  }
  return Za.call(this, a, b, c, h ? d : null, e, g, f + 1);
}
function $a(a, b) {
  var c = "";
  a = y(a.entries());
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
;function ab(a, b, c, d) {
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
function S(a) {
  if (!this || this.constructor !== S) {
    return new S(a);
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
        return ab(b, e || 0, g || b.length, !1);
      };
    }
    if ("splice" === d) {
      return function(e, g) {
        return ab(b, e || 0, g || b.length, !0);
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
S.prototype.clear = function() {
  this.index.length = 0;
};
S.prototype.destroy = function() {
  this.proxy = this.index = null;
};
S.prototype.push = function() {
};
function T(a) {
  a = void 0 === a ? 8 : a;
  if (!this || this.constructor !== T) {
    return new T(a);
  }
  this.index = I();
  this.h = [];
  this.size = 0;
  32 < a ? (this.A = bb, this.B = BigInt(a)) : (this.A = cb, this.B = a);
}
T.prototype.get = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.get(a);
};
T.prototype.set = function(a, b) {
  var c = this.A(a), d = this.index[c];
  d ? (c = d.size, d.set(a, b), (c -= d.size) && this.size++) : (this.index[c] = d = new Map([[a, b]]), this.h.push(d), this.size++);
};
function U(a) {
  a = void 0 === a ? 8 : a;
  if (!this || this.constructor !== U) {
    return new U(a);
  }
  this.index = I();
  this.h = [];
  this.size = 0;
  32 < a ? (this.A = bb, this.B = BigInt(a)) : (this.A = cb, this.B = a);
}
U.prototype.add = function(a) {
  var b = this.A(a), c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c), this.size++);
};
u = T.prototype;
u.has = U.prototype.has = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.has(a);
};
u.delete = U.prototype.delete = function(a) {
  var b = this.A(a);
  (b = this.index[b]) && b.delete(a) && this.size--;
};
u.clear = U.prototype.clear = function() {
  this.index = I();
  this.h = [];
  this.size = 0;
};
u.values = U.prototype.values = function db() {
  var b, c = this, d, e, g;
  return ra(db, function(f) {
    switch(f.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          f.h = 0;
          break;
        }
        d = y(c.h[b].values());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          f.h = 2;
          break;
        }
        g = e.value;
        return D(f, g, 6);
      case 6:
        e = d.next(), f.h = 5;
    }
  });
};
u.keys = U.prototype.keys = function eb() {
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
        d = y(c.h[b].keys());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          f.h = 2;
          break;
        }
        g = e.value;
        return D(f, g, 6);
      case 6:
        e = d.next(), f.h = 5;
    }
  });
};
u.entries = U.prototype.entries = function fb() {
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
        d = y(c.h[b].entries());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          f.h = 2;
          break;
        }
        g = e.value;
        return D(f, g, 6);
      case 6:
        e = d.next(), f.h = 5;
    }
  });
};
function cb(a) {
  var b = Math.pow(2, this.B) - 1;
  if ("number" == typeof a) {
    return a & b;
  }
  for (var c = 0, d = this.B + 1, e = 0; e < a.length; e++) {
    c = (c * d ^ a.charCodeAt(e)) & b;
  }
  return 32 === this.B ? c + Math.pow(2, 31) : c;
}
function bb() {
  throw Error("The keystore is limited to 32 for EcmaScript5");
}
;V.prototype.add = function(a, b, c) {
  xa(a) && (b = a, a = za(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (var d = 0, e; d < this.field.length; d++) {
      e = this.L[d];
      var g = this.index.get(this.field[d]);
      if ("function" === typeof e) {
        (e = e(b)) && g.add(a, e, !1, !0);
      } else {
        var f = e.R;
        if (!f || f(b)) {
          e.constructor === String ? e = ["" + e] : J(e) && (e = [e]), gb(b, e, this.S, 0, g, a, e[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.K.length; d++) {
        f = this.K[d];
        var h = this.aa[d];
        g = this.tag.get(h);
        e = I();
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
          f = za(b, f);
        }
        if (g && f) {
          for (J(f) && (f = [f]), h = 0, k = void 0; h < f.length; h++) {
            var l = f[h];
            if (!e[l]) {
              e[l] = 1;
              var m;
              (m = g.get(l)) ? k = m : g.set(l, k = []);
              if (!c || !k.includes(a)) {
                if (k.length === Math.pow(2, 31) - 1) {
                  m = new S(k);
                  if (this.fastupdate) {
                    for (var n = y(this.reg.values()), p = n.next(); !p.done; p = n.next()) {
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
        var q = I();
        for (c = 0; c < this.I.length; c++) {
          if (d = this.I[c], g = d.R, !g || g(b)) {
            g = void 0;
            if ("function" === typeof d) {
              g = d(b);
              if (!g) {
                continue;
              }
              d = [d.ja];
            } else if (J(d) || d.constructor === String) {
              q[d] = b[d];
              continue;
            }
            hb(b, q, d, 0, d[0], g);
          }
        }
      }
      this.store.set(a, q || b);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function hb(a, b, c, d, e, g) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = g || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
        hb(a, b, c, d, e);
      }
    } else {
      b = b[e] || (b[e] = I()), e = c[++d], hb(a, b, c, d, e);
    }
  }
}
function gb(a, b, c, d, e, g, f, h) {
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
          gb(a, b, c, d, e, g, f, h);
        }
      } else {
        f = b[++d], gb(a, b, c, d, e, g, f, h);
      }
    }
  } else {
    e.db && e.remove(g);
  }
}
;function ib(a, b, c, d, e, g, f) {
  var h = a.length, k = [];
  var l = I();
  for (var m = 0, n = void 0, p, q; m < b; m++) {
    for (var t = 0; t < h; t++) {
      var w = a[t];
      if (m < w.length && (n = w[m])) {
        for (var r = 0; r < n.length; r++) {
          p = n[r];
          (w = l[p]) ? l[p]++ : (w = 0, l[p] = 1);
          q = k[w] || (k[w] = []);
          if (!f) {
            var z = m + (t || !e ? 0 : g || 0);
            q = q[z] || (q[z] = []);
          }
          q.push(p);
          if (f && c && w === h - 1 && q.length - d === c) {
            return d ? q.slice(d) : q;
          }
        }
      }
    }
  }
  if (a = k.length) {
    if (e) {
      k = 1 < k.length ? jb(k, c, d, f, g) : (k = k[0]).length > c || d ? k.slice(d, c + d) : k;
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
function jb(a, b, c, d, e) {
  var g = [], f = I(), h = a.length, k;
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
function kb(a, b, c) {
  for (var d = I(), e = [], g = 0, f; g < b.length; g++) {
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
;function lb(a, b, c, d) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a, d ? W.call(this, a) : a;
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
        return d ? W.call(this, f) : f;
      }
      e.push(f);
      b -= h;
      if (!b) {
        break;
      }
    }
  }
  e = 1 < e.length ? [].concat.apply([], e) : e[0];
  return d ? W.call(this, e) : e;
}
;function mb(a, b, c) {
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
      if (n.constructor === X) {
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
;X.prototype.or = function() {
  var a = mb(this, "or", arguments);
  return nb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve);
};
function nb(a, b, c, d, e, g) {
  if (b.length) {
    var f = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (var k = 0, l = void 0; k < h.length; k++) {
        (l = h[k]).length && (a[k] = l);
      }
      return nb.call(f, a, [], c, d, e, g);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = jb(a, c, d, !1, this.h), d = 0));
  return g ? this.resolve(c, d, e) : this;
}
;X.prototype.and = function() {
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
  return a ? (a = mb(this, "and", arguments), ob.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest)) : c ? this.resolve(d, e, g) : this;
};
function ob(a, b, c, d, e, g, f) {
  if (b.length) {
    var h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (var l = 0, m = void 0; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return ob.call(h, a, [], c, d, e, g, f);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (b = Aa(a)) {
        return this.result = ib(a, b, c, d, f, this.h, g), g ? e ? W.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    f || (this.result = a);
  }
  return g ? this.resolve(c, d, e) : this;
}
;X.prototype.xor = function() {
  var a = mb(this, "xor", arguments);
  return pb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest);
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
      return this.result = qb.call(this, a, c, d, g, this.h), g ? e ? W.call(this.index, this.result) : this.result : this;
    }
  } else {
    f || (this.result = a);
  }
  return g ? this.resolve(c, d, e) : this;
}
function qb(a, b, c, d, e) {
  for (var g = [], f = I(), h = 0, k = 0, l; k < a.length; k++) {
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
;X.prototype.not = function() {
  var a = mb(this, "not", arguments);
  return rb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest);
};
function rb(a, b, c, d, e, g, f) {
  if (b.length) {
    var h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (var l = 0, m = void 0; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return rb.call(h, a, [], c, d, e, g, f);
    });
  }
  if (a.length && this.result.length) {
    this.result = sb.call(this, a, c, d, g);
  } else if (g) {
    return this.resolve(c, d, e);
  }
  return g ? e ? W.call(this.index, this.result) : this.result : this;
}
function sb(a, b, c, d) {
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
;function X(a) {
  if (!this || this.constructor !== X) {
    return new X(a);
  }
  if (a && a.index) {
    return a.resolve = !1, this.index = a.index, this.h = a.boost || 0, this.result = a.index.search(a).result, this;
  }
  this.index = null;
  this.result = a || [];
  this.h = 0;
}
X.prototype.limit = function(a) {
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
X.prototype.offset = function(a) {
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
X.prototype.boost = function(a) {
  this.h += a;
  return this;
};
X.prototype.resolve = function(a, b, c) {
  var d = this.result, e = this.index;
  this.result = this.index = null;
  return d.length ? ("object" === typeof a && (c = a.enrich, b = a.offset, a = a.limit), lb.call(e, d, a || 100, b, c)) : d;
};
I();
V.prototype.search = function(a, b, c, d) {
  c || (!b && xa(a) ? (c = a, a = "") : xa(b) && (c = b, b = 0));
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
        J(n) ? l = n : (n.constructor === Array && 1 === n.length && (n = n[0]), l = n.field || n.index);
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
      for (var r = [], z = 0, A = void 0; z < p.length; z++) {
        A = p[z];
        if (J(A)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (A.field && A.tag) {
          var v = A.tag;
          if (v.constructor === Array) {
            for (var x = 0; x < v.length; x++) {
              r.push(A.field, v[x]);
            }
          } else {
            r.push(A.field, v);
          }
        } else {
          v = Object.keys(A);
          x = 0;
          for (var E = void 0, N = void 0; x < v.length; x++) {
            if (E = v[x], N = A[E], N.constructor === Array) {
              for (var H = 0; H < N.length; H++) {
                r.push(E, N[H]);
              }
            } else {
              r.push(E, N);
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
            q = void 0;
            if (this.db) {
              q = this.index.get(r[g]);
              if (!q) {
                console.warn("Tag '" + r[g] + ":" + r[g + 1] + "' will be skipped because there is no field '" + r[g] + "'.");
                continue;
              }
              k.push(q = q.db.tag(r[g + 1], b, w, f));
            } else {
              q = tb.call(this, r[g], r[g + 1], b, w, f);
            }
            e.push({field:r[g], tag:r[g + 1], result:q});
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
  z = 0;
  for (x = A = v = void 0; z < n.length; z++) {
    if (A = n[z], !this.db || !this.tag || this.L[z]) {
      v = void 0;
      J(A) || (v = A, A = v.field, a = v.query || a, b = v.limit || b, w = v.offset || w, q = v.suggest || q, f = this.store && (v.enrich || f));
      if (d) {
        v = d[z];
      } else {
        x = v || c;
        v = this.index.get(A);
        if (p) {
          if (this.db) {
            x.tag = p;
            var Ma = v.db.support_tag_search;
            x.field = n;
          }
          Ma || (x.enrich = !1);
        }
        if (r) {
          r[z] = v.search(a, b, x);
          x && f && (x.enrich = f);
          continue;
        } else {
          v = v.search(a, b, x), x && f && (x.enrich = f);
        }
      }
      x = v && (k ? v.length : v.result.length);
      if (p && x) {
        E = [];
        N = 0;
        if (this.db && d) {
          if (!Ma) {
            for (H = n.length; H < d.length; H++) {
              var L = d[H];
              if (L && L.length) {
                N++, E.push(L);
              } else if (!q) {
                return k ? e : new X(e);
              }
            }
          }
        } else {
          H = 0;
          for (var Wb = L = void 0; H < p.length; H += 2) {
            L = this.tag.get(p[H]);
            if (!L) {
              if (console.warn("Tag '" + p[H] + ":" + p[H + 1] + "' will be skipped because there is no field '" + p[H] + "'."), q) {
                continue;
              } else {
                return k ? e : new X(e);
              }
            }
            if (Wb = (L = L && L.get(p[H + 1])) && L.length) {
              N++, E.push(L);
            } else if (!q) {
              return k ? e : new X(e);
            }
          }
        }
        if (N) {
          v = kb(v, E, k);
          x = v.length;
          if (!x && !q) {
            return k ? v : new X(v);
          }
          N--;
        }
      }
      if (x) {
        g[h] = A, e.push(v), h++;
      } else if (1 === n.length) {
        return k ? e : new X(e);
      }
    }
  }
  if (r) {
    if (this.db && p && p.length && !Ma) {
      for (f = 0; f < p.length; f += 2) {
        g = this.index.get(p[f]);
        if (!g) {
          if (console.warn("Tag '" + p[f] + ":" + p[f + 1] + "' was not found because there is no field '" + p[f] + "'."), q) {
            continue;
          } else {
            return k ? e : new X(e);
          }
        }
        r.push(g.db.tag(p[f + 1], b, w, !1));
      }
    }
    var Xb = this;
    return Promise.all(r).then(function(Q) {
      return Q.length ? Xb.search(a, b, c, Q) : Q;
    });
  }
  if (!h) {
    return k ? e : new X(e);
  }
  if (l && (!f || !this.store)) {
    return e[0];
  }
  r = [];
  for (w = 0; w < g.length; w++) {
    q = e[w];
    f && q.length && "undefined" === typeof q[0].doc && (this.db ? r.push(q = this.index.get(this.field[0]).db.enrich(q)) : q = W.call(this, q));
    if (l) {
      return k ? t ? ub(a, q, this.index, l, t) : q : new X(q);
    }
    e[w] = {field:g[w], result:q};
  }
  if (f && this.db && r.length) {
    var Yb = this;
    return Promise.all(r).then(function(Q) {
      for (var R = 0; R < Q.length; R++) {
        e[R].result = Q[R];
      }
      return m ? vb(e) : t ? ub(a, e, Yb.index, l, t) : e;
    });
  }
  return m ? vb(e) : t ? ub(a, e, this.index, l, t) : e;
};
function ub(a, b, c, d, e) {
  for (var g, f, h, k = 0, l, m; k < b.length; k++) {
    if (d) {
      var n = b;
      m = d;
    } else {
      l = b[k];
      m = l.field;
      if (!m) {
        continue;
      }
      n = l.result;
    }
    h = c.get(m);
    l = h.encoder;
    h = h.tokenize;
    l !== g && (g = l, f = g.encode(a));
    for (var p = 0; p < n.length; p++) {
      for (var q = "", t = za(n[p].doc, m).split(/\s+/), w = 0, r, z; w < t.length; w++) {
        r = t[w];
        z = l.encode(r);
        z = 1 < z.length ? z.join(" ") : z[0];
        var A = void 0;
        if (z && r) {
          for (var v = 0, x; v < f.length; v++) {
            if (x = f[v], "strict" === h) {
              if (z === x) {
                q += (q ? " " : "") + e.replace("$1", r);
                A = !0;
                break;
              }
            } else {
              var E = z.indexOf(x);
              if (-1 < E) {
                q += (q ? " " : "") + r.substring(0, E) + e.replace("$1", r.substring(E, x.length)) + r.substring(E + x.length);
                A = !0;
                break;
              }
            }
          }
        }
        A || (q += (q ? " " : "") + t[w]);
      }
      n[p].highlight = q;
    }
    if (d) {
      break;
    }
  }
  return b;
}
function vb(a) {
  for (var b = [], c = I(), d = 0, e, g; d < a.length; d++) {
    e = a[d];
    g = e.result;
    for (var f = 0, h, k, l; f < g.length; f++) {
      k = g[f], "object" !== typeof k && (k = {id:k}), h = k.id, (l = c[h]) ? l.push(e.field) : (k.field = c[h] = [e.field], b.push(k));
    }
  }
  return b;
}
function tb(a, b, c, d, e) {
  var g = this.tag.get(a);
  if (!g) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (g = g && g.get(b)) && g.length - d) && 0 < a) {
    if (a > c || d) {
      g = g.slice(d, d + c);
    }
    e && (g = W.call(this, g));
    return g;
  }
}
function W(a) {
  if (!this || !this.store) {
    return a;
  }
  for (var b = Array(a.length), c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {id:d, doc:this.store.get(d)};
  }
  return b;
}
;function V(a) {
  if (!this || this.constructor !== V) {
    return new V(a);
  }
  var b = a.document || a.doc || a, c, d;
  this.L = [];
  this.field = [];
  this.S = [];
  this.key = (c = b.key || b.id) && wb(c, this.S) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? d ? new U(d) : new Set() : d ? new T(d) : new Map();
  this.I = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (d ? new T(d) : new Map());
  this.cache = (c = a.cache || null) && new Y(c);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = xb.call(this, a, b);
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
        d.custom ? this.K[b] = d.custom : (this.K[b] = wb(e, this.S), d.filter && ("string" === typeof this.K[b] && (this.K[b] = new String(this.K[b])), this.K[b].R = d.filter));
        this.aa[b] = e;
        this.tag.set(e, new Map());
      }
    }
  }
  if (this.worker) {
    this.fastupdate = !1;
    var g = [];
    a = y(this.index.values());
    for (c = a.next(); !c.done; c = a.next()) {
      c = c.value, c.then && g.push(c);
    }
    if (g.length) {
      var f = this;
      return Promise.all(g).then(function(h) {
        for (var k = new Map(), l = 0, m = y(f.index.entries()), n = m.next(); !n.done; n = m.next()) {
          var p = n.value;
          n = p[0];
          var q = p[1];
          q.then && (q = g[l].encoder || {}, p = k.get(q), p || (p = q.encode ? q : new Ga(q), k.set(q, p)), q = h[l], q.encoder = p, f.index.set(n, q), l++);
        }
        return f;
      });
    }
  } else {
    a.db && (this.fastupdate = !1, this.mount(a.db));
  }
}
u = V.prototype;
u.mount = function(a) {
  if (this.worker) {
    throw Error("You can't use Worker-Indexes on a persistent model. That would be useless, since each of the persistent model acts like Worker-Index by default (Master/Slave).");
  }
  var b = this.field;
  if (this.tag) {
    for (var c = 0, d = void 0; c < this.aa.length; c++) {
      d = this.aa[c];
      var e = void 0;
      this.index.set(d, e = new O({}, this.reg));
      b === this.field && (b = b.slice(0));
      b.push(d);
      e.tag = this.tag.get(d);
    }
  }
  c = [];
  d = {db:a.db, type:a.type, fastupdate:a.fastupdate};
  e = 0;
  var g = void 0;
  for (g = void 0; e < b.length; e++) {
    d.field = g = b[e];
    g = this.index.get(g);
    var f = new a.constructor(a.id, d);
    f.id = a.id;
    c[e] = f.mount(g);
    g.document = !0;
    e ? g.bypass = !0 : g.store = this.store;
  }
  var h = this;
  return this.db = Promise.all(c).then(function() {
    h.db = !0;
  });
};
u.commit = function(a, b) {
  var c = this, d, e, g, f;
  return ta(function(h) {
    if (1 == h.h) {
      d = [];
      e = y(c.index.values());
      for (g = e.next(); !g.done; g = e.next()) {
        f = g.value, d.push(f.commit(a, b));
      }
      return D(h, Promise.all(d), 2);
    }
    c.reg.clear();
    h.h = 0;
  });
};
u.destroy = function() {
  for (var a = [], b = y(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    a.push(c.value.destroy());
  }
  return Promise.all(a);
};
function xb(a, b) {
  var c = new Map(), d = b.index || b.field || b;
  J(d) && (d = [d]);
  for (var e = 0, g, f = void 0; e < d.length; e++) {
    g = d[e];
    J(g) || (f = g, g = g.field);
    f = xa(f) ? Object.assign({}, a, f) : a;
    if (this.worker) {
      var h = new Ra(f);
      h.encoder = f.encoder;
      c.set(g, h);
    }
    this.worker || c.set(g, new O(f, this.reg));
    f.custom ? this.L[e] = f.custom : (this.L[e] = wb(g, this.S), f.filter && ("string" === typeof this.L[e] && (this.L[e] = new String(this.L[e])), this.L[e].R = f.filter));
    this.field[e] = g;
  }
  if (this.I) {
    for (a = b.store, J(a) && (a = [a]), b = 0; b < a.length; b++) {
      d = a[b], e = d.field || d, d.custom ? (this.I[b] = d.custom, d.custom.ja = e) : (this.I[b] = wb(e, this.S), d.filter && ("string" === typeof this.I[b] && (this.I[b] = new String(this.I[b])), this.I[b].R = d.filter));
    }
  }
  return c;
}
function wb(a, b) {
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
  xa(a) && (a = za(a, this.key));
  for (var b = y(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c.value.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (b = y(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
        c = c.value;
        for (var d = y(c), e = d.next(); !e.done; e = d.next()) {
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
  for (var a = [], b = y(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c = c.value.clear(), c.then && a.push(c);
  }
  if (this.tag) {
    for (b = y(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
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
  for (var a = y(this.index.values()), b = a.next(); !b.done; b = a.next()) {
    b.value.cleanup();
  }
  return this;
};
u.get = function(a) {
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(b) {
    return b[0] && b[0].doc || null;
  }) : this.store.get(a) || null;
};
u.set = function(a, b) {
  "object" === typeof a && (b = a, a = za(b, this.key));
  this.store.set(a, b);
  return this;
};
u.searchCache = yb;
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
      var h = Xa(this.reg);
      b = null;
      break;
    case 1:
      f = "tag";
      h = this.tag && Va(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      f = "doc";
      h = this.store && Ta(this.store);
      b = null;
      break;
    default:
      return;
  }
  return Za.call(this, a, b, f, h, c, d);
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
        this.reg = Ya(b, this.reg);
        for (b = 0; b < this.field.length; b++) {
          d = this.index.get(this.field[b]), d.fastupdate = !1, d.reg = this.reg;
        }
        if (this.worker) {
          b = [];
          d = y(this.index.values());
          for (c = d.next(); !c.done; c = d.next()) {
            b.push(c.value.import(a));
          }
          return Promise.all(b);
        }
        break;
      case "tag":
        this.tag = Wa(b, this.tag);
        break;
      case "doc":
        this.store = Ua(b, this.store);
    }
  }
};
Ja(V.prototype);
function yb(a, b, c) {
  var d = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new Y());
  var e = this.cache.get(d);
  if (!e) {
    e = this.search(a, b, c);
    if (e.then) {
      var g = this;
      e.then(function(f) {
        g.cache.set(d, f);
        return f;
      });
    }
    this.cache.set(d, e);
  }
  return e;
}
function Y(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
Y.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
Y.prototype.get = function(a) {
  var b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
Y.prototype.remove = function(a) {
  for (var b = y(this.cache), c = b.next(); !c.done; c = b.next()) {
    c = c.value;
    var d = c[0];
    c[1].includes(a) && this.cache.delete(d);
  }
};
Y.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
var zb = {normalize:!1, numeric:!1, dedupe:!1};
var Ab = {};
var Bb = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
var Cb = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Db = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
var Eb = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var Fb = {Exact:zb, Default:Ab, Normalize:Ab, LatinBalance:{mapper:Bb}, LatinAdvanced:{mapper:Bb, matcher:Cb, replacer:Db}, LatinExtra:{mapper:Bb, replacer:Db.concat([/(?!^)[aeo]/g, ""]), matcher:Cb}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (var b = 0; b < a.length; b++) {
    for (var c = a[b], d = c.charAt(0), e = Eb[d], g = 1, f; g < c.length && (f = c.charAt(g), "h" === f || "w" === f || !(f = Eb[f]) || f === e || (d += f, e = f, 4 !== d.length)); g++) {
    }
    a[b] = d;
  }
}}, CJK:{split:""}, LatinExact:zb, LatinDefault:Ab, LatinSimple:Ab};
O.prototype.remove = function(a, b) {
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
      Gb(this.map, a), this.depth && Gb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.ca && Hb(this));
  this.cache && this.cache.remove(a);
  return this;
};
function Gb(a, b) {
  var c = 0, d = "undefined" === typeof b;
  if (a.constructor === Array) {
    for (var e = 0, g = void 0, f; e < a.length; e++) {
      if ((g = a[e]) && g.length) {
        if (d) {
          c++;
        } else {
          if (f = g.indexOf(b), 0 <= f) {
            1 < g.length ? (g.splice(f, 1), c++) : delete a[e];
            break;
          } else {
            c++;
          }
        }
      }
    }
  } else {
    for (d = y(a.entries()), e = d.next(); !e.done; e = d.next()) {
      g = e.value, e = g[0], (g = Gb(g[1], b)) ? c += g : a.delete(e);
    }
  }
  return c;
}
;var Ib = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
O.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (d = b.length) {
      for (var e = I(), g = I(), f = this.depth, h = this.resolution, k = 0; k < d; k++) {
        var l = b[this.rtl ? d - 1 - k : k], m = l.length;
        if (m && (f || !g[l])) {
          var n = this.score ? this.score(b, l, k, null, 0) : Jb(h, d, k), p = "";
          switch(this.tokenize) {
            case "full":
              if (2 < m) {
                n = 0;
                for (var q; n < m; n++) {
                  for (var t = m; t > n; t--) {
                    p = l.substring(n, t), q = this.rtl ? m - 1 - n : n, q = this.score ? this.score(b, l, k, p, q) : Jb(h, d, k, m, q), Kb(this, g, p, q, a, c);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < m) {
                for (t = m - 1; 0 < t; t--) {
                  p = l[this.rtl ? m - 1 - t : t] + p, q = this.score ? this.score(b, l, k, p, t) : Jb(h, d, k, m, t), Kb(this, g, p, q, a, c);
                }
                p = "";
              }
            case "forward":
              if (1 < m) {
                for (t = 0; t < m; t++) {
                  p += l[this.rtl ? m - 1 - t : t], Kb(this, g, p, n, a, c);
                }
                break;
              }
            default:
              if (Kb(this, g, l, n, a, c), f && 1 < d && k < d - 1) {
                for (m = I(), p = this.da, n = l, t = Math.min(f + 1, this.rtl ? k + 1 : d - k), q = m[n] = 1; q < t; q++) {
                  if ((l = b[this.rtl ? d - 1 - k - q : k + q]) && !m[l]) {
                    m[l] = 1;
                    var w = this.score ? this.score(b, n, k, l, q - 1) : Jb(p + (d / 2 > p ? 0 : 1), d, k, t - 1, q - 1), r = this.bidirectional && l > n;
                    Kb(this, e, r ? n : l, w, a, c, r ? l : n);
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
  this.db && (b || this.commit_task.push({del:a}), this.ca && Hb(this));
  return this;
};
function Kb(a, b, c, d, e, g, f) {
  var h = f ? a.ctx : a.map, k;
  if (!b[c] || f && !(k = b[c])[f]) {
    if (f ? (b = k || (b[c] = I()), b[f] = 1, (k = h.get(f)) ? h = k : h.set(f, h = new Map())) : b[c] = 1, (k = h.get(c)) ? h = k : h.set(c, h = k = []), h = h[d] || (h[d] = []), !g || !h.includes(e)) {
      if (h.length === Math.pow(2, 31) - 1) {
        b = new S(h);
        if (a.fastupdate) {
          for (c = y(a.reg.values()), g = c.next(); !g.done; g = c.next()) {
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
function Jb(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;O.prototype.search = function(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : (c = a, a = ""));
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
    return Lb.call(this, p[0], "", b, e, g, k, n);
  }
  f = this.depth && !1 !== f;
  if (2 === q && f && !h) {
    return Lb.call(this, p[1], p[0], b, e, g, k, n);
  }
  var t = I(), w = 0;
  if (f) {
    var r = p[0];
    w = 1;
  }
  m || 0 === m || (m = r ? this.da : this.resolution);
  if (this.db) {
    if (this.db.search && (a = this.db.search(this, p, b, e, h, g, k, n), !1 !== a)) {
      return a;
    }
    var z = this;
    return function() {
      var A, v;
      return ta(function(x) {
        switch(x.h) {
          case 1:
            v = A = void 0;
          case 2:
            if (!(w < q)) {
              x.h = 4;
              break;
            }
            v = p[w];
            if (!v || t[v]) {
              x.h = 5;
              break;
            }
            t[v] = 1;
            return D(x, Mb(z, v, r, 0, 0, !1, !1), 6);
          case 6:
            A = x.D;
            if (A = Nb(A, d, h, m)) {
              d = A;
              x.h = 4;
              break;
            }
            r && (h && A && d.length || (r = v));
          case 5:
            h && r && w === q - 1 && !d.length && (m = z.resolution, r = "", w = -1, t = I());
            w++;
            x.h = 2;
            break;
          case 4:
            return x.return(Ob(d, m, b, e, h, l, g));
        }
      });
    }();
  }
  for (c = a = void 0; w < q; w++) {
    if ((c = p[w]) && !t[c]) {
      t[c] = 1;
      a = Mb(this, c, r, 0, 0, !1, !1);
      if (a = Nb(a, d, h, m)) {
        d = a;
        break;
      }
      r && (h && a && d.length || (r = c));
    }
    h && r && w === q - 1 && !d.length && (m = this.resolution, r = "", w = -1, t = I());
  }
  return Ob(d, m, b, e, h, l, g);
};
function Ob(a, b, c, d, e, g, f) {
  var h = a.length, k = a;
  if (1 < h) {
    k = ib(a, b, c, d, e, g, f);
  } else if (1 === h) {
    return f ? lb.call(null, a[0], c, d) : new X(a[0]);
  }
  return f ? k : new X(k);
}
function Lb(a, b, c, d, e, g, f) {
  a = Mb(this, a, b, c, d, e, g, f);
  return this.db ? a.then(function(h) {
    return e ? h || [] : new X(h);
  }) : a && a.length ? e ? lb.call(this, a, c, d) : new X(a) : e ? [] : new X();
}
function Nb(a, b, c, d) {
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
function Mb(a, b, c, d, e, g, f, h) {
  var k;
  c && (k = a.bidirectional && b > c) && (k = c, c = b, b = k);
  if (a.db) {
    return a.db.get(b, c, d, e, g, f, h);
  }
  a = c ? (a = a.ctx.get(c)) && a.get(b) : a.map.get(b);
  return a;
}
;function O(a, b) {
  if (!this || this.constructor !== O) {
    return new O(a);
  }
  if (a) {
    var c = J(a) ? a : a.preset;
    c && (Ib[c] || console.warn("Preset not found: " + c), a = Object.assign({}, Ib[c], a));
  } else {
    a = {};
  }
  c = a.context;
  var d = !0 === c ? {depth:1} : c || {}, e = J(a.encoder) ? Fb[a.encoder] : a.encode || a.encoder || {};
  this.encoder = e.encode ? e : "object" === typeof e ? new Ga(e) : {encode:e};
  this.resolution = a.resolution || 9;
  this.tokenize = c = (c = a.tokenize) && "default" !== c && "exact" !== c && c || "strict";
  this.depth = "strict" === c && d.depth || 0;
  this.bidirectional = !1 !== d.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  d && d.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new T(c) : new Map();
  this.ctx = c ? new T(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new T(c) : new Map() : c ? new U(c) : new Set());
  this.da = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new Y(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.ca = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
u = O.prototype;
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
function Hb(a) {
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
u.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Gb(this.map);
  this.depth && Gb(this.ctx);
  return this;
};
u.searchCache = yb;
u.export = function(a, b, c, d) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  switch(d) {
    case 0:
      var e = "reg";
      var g = Xa(this.reg);
      break;
    case 1:
      e = "cfg";
      g = null;
      break;
    case 2:
      e = "map";
      g = Ta(this.map, this.reg.size);
      break;
    case 3:
      e = "ctx";
      g = Va(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return Za.call(this, a, b, e, g, c, d);
};
u.import = function(a, b) {
  if (b) {
    switch("string" === typeof b && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Ya(b, this.reg);
        break;
      case "map":
        this.map = Ua(b, this.map);
        break;
      case "ctx":
        this.ctx = Wa(b, this.ctx);
    }
  }
};
u.serialize = function(a) {
  a = void 0 === a ? !0 : a;
  var b = "", c = "", d = "";
  if (this.reg.size) {
    var e;
    c = y(this.reg.keys());
    for (var g = c.next(); !g.done; g = c.next()) {
      g = g.value, e || (e = typeof g), b += (b ? "," : "") + ("string" === e ? '"' + g + '"' : g);
    }
    b = "index.reg=new Set([" + b + "]);";
    c = $a(this.map, e);
    c = "index.map=new Map([" + c + "]);";
    g = y(this.ctx.entries());
    for (var f = g.next(); !f.done; f = g.next()) {
      var h = f.value;
      f = h[0];
      h = $a(h[1], e);
      h = "new Map([" + h + "])";
      h = '["' + f + '",' + h + "]";
      d += (d ? "," : "") + h;
    }
    d = "index.ctx=new Map([" + d + "]);";
  }
  return a ? "function inject(index){" + b + c + d + "}" : b + c + d;
};
Ja(O.prototype);
var Pb = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), Qb = ["map", "ctx", "tag", "reg", "cfg"], Rb = I();
function Sb(a, b) {
  b = void 0 === b ? {} : b;
  if (!this || this.constructor !== Sb) {
    return new Sb(a, b);
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
u = Sb.prototype;
u.mount = function(a) {
  if (a.index) {
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
  Rb[a.id] || (Rb[a.id] = []);
  Rb[a.id].push(a.field);
  var b = Pb.open(a.id, 1);
  b.onupgradeneeded = function() {
    for (var c = a.db = this.result, d = 0, e; d < Qb.length; d++) {
      e = Qb[d];
      for (var g = 0, f; g < Rb[a.id].length; g++) {
        f = Rb[a.id][g], c.objectStoreNames.contains(e + ("reg" !== e ? f ? ":" + f : "" : "")) || c.createObjectStore(e + ("reg" !== e ? f ? ":" + f : "" : ""));
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
  var a = Pb.deleteDatabase(this.id);
  return Z(a);
};
u.clear = function() {
  for (var a = [], b = 0, c; b < Qb.length; b++) {
    c = Qb[b];
    for (var d = 0, e; d < Rb[this.id].length; d++) {
      e = Rb[this.id][d], a.push(c + ("reg" !== c ? e ? ":" + e : "" : ""));
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
          return D(h, d.clear(), 12);
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
        return D(h, d.clear(), 8);
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
        c || (e = e.concat(ya(a.reg)));
        if (!e.length) {
          h.h = 10;
          break;
        }
        return D(h, d.remove(e), 11);
      case 11:
      case 10:
        h.h = 3;
        break;
      case 12:
        a.commit_task = [];
      case 3:
        return a.reg.size ? D(h, d.transaction("map", "readwrite", function(k) {
          for (var l = y(a.map), m = l.next(), n = {}; !m.done; n = {O:void 0, Y:void 0}, m = l.next()) {
            m = m.value, n.Y = m[0], n.O = m[1], n.O.length && (b ? k.put(n.O, n.Y) : k.get(n.Y).onsuccess = function(p) {
              return function() {
                var q = this.result, t;
                if (q && q.length) {
                  for (var w = Math.max(q.length, p.O.length), r = 0, z; r < w; r++) {
                    if ((z = p.O[r]) && z.length) {
                      if ((t = q[r]) && t.length) {
                        for (var A = 0; A < z.length; A++) {
                          t.push(z[A]);
                        }
                      } else {
                        q[r] = z;
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
        return D(h, d.transaction("ctx", "readwrite", function(k) {
          for (var l = y(a.ctx), m = l.next(), n = {}; !m.done; n = {V:void 0}, m = l.next()) {
            m = m.value;
            n.V = m[0];
            m = y(m[1]);
            for (var p = m.next(), q = {}; !p.done; q = {P:void 0, Z:void 0}, p = m.next()) {
              p = p.value, q.Z = p[0], q.P = p[1], q.P.length && (b ? k.put(q.P, n.V + ":" + q.Z) : k.get(n.V + ":" + q.Z).onsuccess = function(t, w) {
                return function() {
                  var r = this.result, z;
                  if (r && r.length) {
                    for (var A = Math.max(r.length, t.P.length), v = 0, x; v < A; v++) {
                      if ((x = t.P[v]) && x.length) {
                        if ((z = r[v]) && z.length) {
                          for (var E = 0; E < x.length; E++) {
                            z.push(x[E]);
                          }
                        } else {
                          r[v] = x;
                        }
                        z = 1;
                      }
                    }
                  } else {
                    r = t.P, z = 1;
                  }
                  z && k.put(r, w.V + ":" + t.Z);
                };
              }(q, n));
            }
          }
        }), 14);
      case 14:
        if (a.store) {
          return D(h, d.transaction("reg", "readwrite", function(k) {
            for (var l = y(a.store), m = l.next(); !m.done; m = l.next()) {
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
        return D(h, d.transaction("reg", "readwrite", function(k) {
          for (var l = y(a.reg.keys()), m = l.next(); !m.done; m = l.next()) {
            k.put(1, m.value);
          }
        }), 16);
      case 16:
        if (!a.tag) {
          h.h = 20;
          break;
        }
        return D(h, d.transaction("tag", "readwrite", function(k) {
          for (var l = y(a.tag), m = l.next(), n = {}; !m.done; n = {X:void 0, ba:void 0}, m = l.next()) {
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
function Tb(a, b, c) {
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
      c && Tb(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && Tb(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && Tb(c, a, !0);
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
;var Ub = {Index:O, Charset:Fb, Encoder:Ga, Document:V, Worker:Ra, Resolver:X, IndexedDB:Sb, Language:{}}, Vb = "undefined" !== typeof self ? self : "undefined" !== typeof global ? global : self, Zb;
(Zb = Vb.define) && Zb.amd ? Zb([], function() {
  return Ub;
}) : "object" === typeof Vb.exports ? Vb.exports = Ub : Vb.FlexSearch = Ub;
}(this||self));
