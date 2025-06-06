/**!
 * FlexSearch.js v0.8.205 (ES5/Debug)
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
function D(a) {
  var b = typeof Symbol != "undefined" && Symbol.iterator && a[Symbol.iterator];
  if (b) {
    return b.call(a);
  }
  if (typeof a.length == "number") {
    return {next:aa(a)};
  }
  throw Error(String(a) + " is not an iterable or ArrayLike");
}
var ca = typeof Object.defineProperties == "function" ? Object.defineProperty : function(a, b, c) {
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
      b != d && b != null && ca(c, a, {configurable:!0, writable:!0, value:b});
    }
  }
}
var fa;
if (typeof Object.setPrototypeOf == "function") {
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
  this.D = !1;
  this.A = null;
  this.B = void 0;
  this.h = 1;
  this.I = 0;
  this.C = null;
}
function ma(a) {
  if (a.D) {
    throw new TypeError("Generator is already running");
  }
  a.D = !0;
}
la.prototype.H = function(a) {
  this.B = a;
};
function na(a, b) {
  a.C = {ja:b, ka:!0};
  a.h = a.I;
}
la.prototype.return = function(a) {
  this.C = {return:a};
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
      return a.h.D = !1, e;
    }
    var f = e.value;
  } catch (g) {
    return a.h.A = null, na(a.h, g), sa(a);
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
        return a.h.D = !1, {value:b.value, done:!1};
      }
    } catch (c) {
      a.h.B = void 0, na(a.h, c);
    }
  }
  a.h.D = !1;
  if (a.h.C) {
    b = a.h.C;
    a.h.C = null;
    if (b.ka) {
      throw b.ja;
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
    function f(g) {
      g.done ? d(g.value) : Promise.resolve(g.value).then(b, c).then(f, e);
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
  function c(f, g) {
    this.h = f;
    ca(this, "description", {configurable:!0, writable:!0, value:g});
  }
  if (a) {
    return a;
  }
  c.prototype.toString = function() {
    return this.h;
  };
  var d = "jscomp_symbol_" + (Math.random() * 1E9 >>> 0) + "_", e = 0;
  return b;
});
H("Symbol.iterator", function(a) {
  if (a) {
    return a;
  }
  a = Symbol("Symbol.iterator");
  for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
    var d = ea[b[c]];
    typeof d === "function" && typeof d.prototype[a] != "function" && ca(d.prototype, a, {configurable:!0, writable:!0, value:function() {
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
  function b(g) {
    this.A = 0;
    this.B = void 0;
    this.h = [];
    this.K = !1;
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
    if (this.h == null) {
      this.h = [];
      var h = this;
      this.B(function() {
        h.D();
      });
    }
    this.h.push(g);
  };
  var e = ea.setTimeout;
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
    return {resolve:g(this.ea), reject:g(this.D)};
  };
  b.prototype.ea = function(g) {
    if (g === this) {
      this.D(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (g instanceof b) {
        this.ga(g);
      } else {
        a: {
          switch(typeof g) {
            case "object":
              var h = g != null;
              break a;
            case "function":
              h = !0;
              break a;
            default:
              h = !1;
          }
        }
        h ? this.da(g) : this.I(g);
      }
    }
  };
  b.prototype.da = function(g) {
    var h = void 0;
    try {
      h = g.then;
    } catch (k) {
      this.D(k);
      return;
    }
    typeof h == "function" ? this.ha(h, g) : this.I(g);
  };
  b.prototype.D = function(g) {
    this.L(2, g);
  };
  b.prototype.I = function(g) {
    this.L(1, g);
  };
  b.prototype.L = function(g, h) {
    if (this.A != 0) {
      throw Error("Cannot settle(" + g + ", " + h + "): Promise already settled in state" + this.A);
    }
    this.A = g;
    this.B = h;
    this.A === 2 && this.fa();
    this.P();
  };
  b.prototype.fa = function() {
    var g = this;
    e(function() {
      if (g.ca()) {
        var h = ea.console;
        typeof h !== "undefined" && h.error(g.B);
      }
    }, 1);
  };
  b.prototype.ca = function() {
    if (this.K) {
      return !1;
    }
    var g = ea.CustomEvent, h = ea.Event, k = ea.dispatchEvent;
    if (typeof k === "undefined") {
      return !0;
    }
    typeof g === "function" ? g = new g("unhandledrejection", {cancelable:!0}) : typeof h === "function" ? g = new h("unhandledrejection", {cancelable:!0}) : (g = ea.document.createEvent("CustomEvent"), g.initCustomEvent("unhandledrejection", !1, !0, g));
    g.promise = this;
    g.reason = this.B;
    return k(g);
  };
  b.prototype.P = function() {
    if (this.h != null) {
      for (var g = 0; g < this.h.length; ++g) {
        f.A(this.h[g]);
      }
      this.h = null;
    }
  };
  var f = new c();
  b.prototype.ga = function(g) {
    var h = this.C();
    g.R(h.resolve, h.reject);
  };
  b.prototype.ha = function(g, h) {
    var k = this.C();
    try {
      g.call(h, k.resolve, k.reject);
    } catch (l) {
      k.reject(l);
    }
  };
  b.prototype.then = function(g, h) {
    function k(n, q) {
      return typeof n == "function" ? function(t) {
        try {
          l(n(t));
        } catch (u) {
          m(u);
        }
      } : q;
    }
    var l, m, p = new b(function(n, q) {
      l = n;
      m = q;
    });
    this.R(k(g, l), k(h, m));
    return p;
  };
  b.prototype.catch = function(g) {
    return this.then(void 0, g);
  };
  b.prototype.R = function(g, h) {
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
    this.h == null ? f.A(k) : this.h.push(k);
    this.K = !0;
  };
  b.resolve = d;
  b.reject = function(g) {
    return new b(function(h, k) {
      k(g);
    });
  };
  b.race = function(g) {
    return new b(function(h, k) {
      for (var l = D(g), m = l.next(); !m.done; m = l.next()) {
        d(m.value).R(h, k);
      }
    });
  };
  b.all = function(g) {
    var h = D(g), k = h.next();
    return k.done ? d([]) : new b(function(l, m) {
      function p(t) {
        return function(u) {
          n[t] = u;
          q--;
          q == 0 && l(n);
        };
      }
      var n = [], q = 0;
      do {
        n.push(void 0), q++, d(k.value).R(p(n.length - 1), m), k = h.next();
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
    this.h = (h += Math.random() + 1).toString();
    if (k) {
      k = D(k);
      for (var l; !(l = k.next()).done;) {
        l = l.value, this.set(l[0], l[1]);
      }
    }
  }
  function c() {
  }
  function d(k) {
    var l = typeof k;
    return l === "object" && k !== null || l === "function";
  }
  function e(k) {
    if (!za(k, g)) {
      var l = new c();
      ca(k, g, {value:l});
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
      if (m.get(k) != 2 || m.get(l) != 3) {
        return !1;
      }
      m.delete(k);
      m.set(l, 4);
      return !m.has(k) && m.get(l) == 4;
    } catch (p) {
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
    if (!za(k, g)) {
      throw Error("WeakMap key fail: " + k);
    }
    k[g][this.h] = l;
    return this;
  };
  b.prototype.get = function(k) {
    return d(k) && za(k, g) ? k[g][this.h] : void 0;
  };
  b.prototype.has = function(k) {
    return d(k) && za(k, g) && za(k[g], this.h);
  };
  b.prototype.delete = function(k) {
    return d(k) && za(k, g) && za(k[g], this.h) ? delete k[g][this.h] : !1;
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
    return xa(function() {
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
    l == "object" || l == "function" ? f.has(k) ? l = f.get(k) : (l = "" + ++g, f.set(k, l)) : l = "p_" + k;
    var m = h[0][l];
    if (m && za(h[0], l)) {
      for (h = 0; h < m.length; h++) {
        var p = m[h];
        if (k !== k && p.key !== p.key || k === p.key) {
          return {id:l, list:m, index:h, G:p};
        }
      }
    }
    return {id:l, list:m, index:-1, G:void 0};
  }
  function e(h) {
    this[0] = {};
    this[1] = b();
    this.size = 0;
    if (h) {
      h = D(h);
      for (var k; !(k = h.next()).done;) {
        k = k.value, this.set(k[0], k[1]);
      }
    }
  }
  if (function() {
    if (!a || typeof a != "function" || !a.prototype.entries || typeof Object.seal != "function") {
      return !1;
    }
    try {
      var h = Object.seal({x:4}), k = new a(D([[h, "s"]]));
      if (k.get(h) != "s" || k.size != 1 || k.get({x:4}) || k.set({x:4}, "t") != k || k.size != 2) {
        return !1;
      }
      var l = k.entries(), m = l.next();
      if (m.done || m.value[0] != h || m.value[1] != "s") {
        return !1;
      }
      m = l.next();
      return m.done || m.value[0].x != 4 || m.value[1] != "t" || !l.next().done ? !1 : !0;
    } catch (p) {
      return !1;
    }
  }()) {
    return a;
  }
  var f = new WeakMap();
  e.prototype.set = function(h, k) {
    h = h === 0 ? 0 : h;
    var l = d(this, h);
    l.list || (l.list = this[0][l.id] = []);
    l.G ? l.G.value = k : (l.G = {next:this[1], J:this[1].J, head:this[1], key:h, value:k}, l.list.push(l.G), this[1].J.next = l.G, this[1].J = l.G, this.size++);
    return this;
  };
  e.prototype.delete = function(h) {
    h = d(this, h);
    return h.G && h.list ? (h.list.splice(h.index, 1), h.list.length || delete this[0][h.id], h.G.J.next = h.G.next, h.G.next.J = h.G.J, h.G.head = null, this.size--, !0) : !1;
  };
  e.prototype.clear = function() {
    this[0] = {};
    this[1] = this[1].J = b();
    this.size = 0;
  };
  e.prototype.has = function(h) {
    return !!d(this, h).G;
  };
  e.prototype.get = function(h) {
    return (h = d(this, h).G) && h.value;
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
      c = D(c);
      for (var d; !(d = c.next()).done;) {
        this.add(d.value);
      }
    }
    this.size = this.h.size;
  }
  if (function() {
    if (!a || typeof a != "function" || !a.prototype.entries || typeof Object.seal != "function") {
      return !1;
    }
    try {
      var c = Object.seal({x:4}), d = new a(D([c]));
      if (!d.has(c) || d.size != 1 || d.add(c) != d || d.size != 1 || d.add({x:4}) != d || d.size != 2) {
        return !1;
      }
      var e = d.entries(), f = e.next();
      if (f.done || f.value[0] != c || f.value[1] != c) {
        return !1;
      }
      f = e.next();
      return f.done || f.value[0] == c || f.value[0].x != 4 || f.value[1] != f.value[0] ? !1 : e.next().done;
    } catch (g) {
      return !1;
    }
  }()) {
    return a;
  }
  b.prototype.add = function(c) {
    c = c === 0 ? 0 : c;
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
    return b === c ? b !== 0 || 1 / b === 1 / c : b !== b && c !== c;
  };
});
H("Array.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    var d = this;
    d instanceof String && (d = String(d));
    var e = d.length;
    c = c || 0;
    for (c < 0 && (c = Math.max(c + e, 0)); c < e; c++) {
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
    if (this == null) {
      throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");
    }
    if (b instanceof RegExp) {
      throw new TypeError("First argument to String.prototype.includes must not be a regular expression");
    }
    return this.indexOf(b, c || 0) !== -1;
  };
});
H("Array.prototype.entries", function(a) {
  return a ? a : function() {
    return ya(this, function(b, c) {
      return [b, c];
    });
  };
});
var Aa = typeof Object.assign == "function" ? Object.assign : function(a, b) {
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
    b = b === void 0 ? 1 : b;
    var c = [];
    Array.prototype.forEach.call(this, function(d) {
      Array.isArray(d) && b > 0 ? (d = Array.prototype.flat.call(d, b - 1), c.push.apply(c, d)) : c.push(d);
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
  if (d !== "undefined") {
    if (e !== "undefined") {
      if (c) {
        if (e === "function" && d === e) {
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
            d = D(a);
            for (e = d.next(); !e.done; e = d.next()) {
              e = e.value, b.set(e[0], e[1]);
            }
            return b;
          }
          if (b === Set) {
            b = new Set(c);
            d = D(a.values());
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
  return e === "undefined" ? b : a;
}
function Ba(a, b) {
  return typeof a === "undefined" ? b : a;
}
function S() {
  return Object.create(null);
}
function U(a) {
  return typeof a === "string";
}
function Ca(a) {
  return typeof a === "object";
}
function Da(a, b) {
  if (U(b)) {
    a = a[b];
  } else {
    for (var c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
;var Ea = /[^\p{L}\p{N}]+/u, Fa = /(\d{3})/g, Ga = /(\D)(\d{3})/g, Ha = /(\d{3})(\D)/g, Ia = /[\u0300-\u036f]/g;
function Ja(a) {
  a = a === void 0 ? {} : a;
  if (!this || this.constructor !== Ja) {
    var b = Function.prototype.bind, c = b.apply, d = [null], e = d.concat;
    if (arguments instanceof Array) {
      var f = arguments;
    } else {
      f = D(arguments);
      for (var g, h = []; !(g = f.next()).done;) {
        h.push(g.value);
      }
      f = h;
    }
    return new (c.call(b, Ja, e.call(d, f)))();
  }
  if (arguments.length) {
    for (b = 0; b < arguments.length; b++) {
      this.assign(arguments[b]);
    }
  } else {
    this.assign(a);
  }
}
w = Ja.prototype;
w.assign = function(a) {
  this.normalize = P(a.normalize, !0, this.normalize);
  var b = a.include, c = b || a.exclude || a.split;
  if (c || c === "") {
    if (typeof c === "object" && c.constructor !== RegExp) {
      var d = "";
      var e = !b;
      b || (d += "\\p{Z}");
      c.letter && (d += "\\p{L}");
      c.number && (d += "\\p{N}", e = !!b);
      c.symbol && (d += "\\p{S}");
      c.punctuation && (d += "\\p{P}");
      c.control && (d += "\\p{C}");
      if (c = c.char) {
        d += typeof c === "object" ? c.join("") : c;
      }
      try {
        this.split = new RegExp("[" + (b ? "^" : "") + d + "]+", "u");
      } catch (f) {
        console.error("Your split configuration:", c, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = c, e = c === !1 || "a1a".split(c).length < 2;
    }
    this.numeric = P(a.numeric, e);
  } else {
    try {
      this.split = P(this.split, Ea);
    } catch (f) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = P(a.numeric, P(this.numeric, !0));
  }
  this.prepare = P(a.prepare, null, this.prepare);
  this.finalize = P(a.finalize, null, this.finalize);
  c = a.filter;
  this.filter = typeof c === "function" ? c : P(c && new Set(c), null, this.filter);
  this.dedupe = P(a.dedupe, !0, this.dedupe);
  this.matcher = P((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = P((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = P((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = P(a.replacer, null, this.replacer);
  this.minlength = P(a.minlength, 1, this.minlength);
  this.maxlength = P(a.maxlength, 1024, this.maxlength);
  this.rtl = P(a.rtl, !1, this.rtl);
  if (this.cache = c = P(a.cache, !0, this.cache)) {
    this.D = null, this.P = typeof c === "number" ? c : 2e5, this.B = new Map(), this.C = new Map(), this.I = this.H = 128;
  }
  this.h = "";
  this.K = null;
  this.A = "";
  this.L = null;
  if (this.matcher) {
    for (a = D(this.matcher.keys()), b = a.next(); !b.done; b = a.next()) {
      this.h += (this.h ? "|" : "") + b.value;
    }
  }
  if (this.stemmer) {
    for (a = D(this.stemmer.keys()), b = a.next(); !b.done; b = a.next()) {
      this.A += (this.A ? "|" : "") + b.value;
    }
  }
  return this;
};
w.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.A += (this.A ? "|" : "") + a;
  this.L = null;
  this.cache && Ka(this);
  return this;
};
w.addFilter = function(a) {
  typeof a === "function" ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && Ka(this);
  return this;
};
w.addMapper = function(a, b) {
  if (typeof a === "object") {
    return this.addReplacer(a, b);
  }
  if (a.length > 1) {
    return this.addMatcher(a, b);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, b);
  this.cache && Ka(this);
  return this;
};
w.addMatcher = function(a, b) {
  if (typeof a === "object") {
    return this.addReplacer(a, b);
  }
  if (a.length < 2 && (this.dedupe || this.mapper)) {
    return this.addMapper(a, b);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, b);
  this.h += (this.h ? "|" : "") + a;
  this.K = null;
  this.cache && Ka(this);
  return this;
};
w.addReplacer = function(a, b) {
  if (typeof a === "string") {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && Ka(this);
  return this;
};
w.encode = function(a, b) {
  var c = this;
  if (this.cache && a.length <= this.H) {
    if (this.D) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.D = setTimeout(Ka, 50, this);
    }
  }
  this.normalize && (typeof this.normalize === "function" ? a = this.normalize(a) : a = Ia ? a.normalize("NFKD").replace(Ia, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && a.length > 3 && (a = a.replace(Ga, "$1 $2").replace(Ha, "$1 $2").replace(Fa, "$1 "));
  for (var d = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer), e = [], f = S(), g, h, k = this.split || this.split === "" ? a.split(this.split) : [a], l = 0, m = void 0, p = void 0; l < k.length; l++) {
    if ((m = p = k[l]) && !(m.length < this.minlength || m.length > this.maxlength)) {
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
        if (!this.filter || (typeof this.filter === "function" ? this.filter(m) : !this.filter.has(m))) {
          if (this.cache && m.length <= this.I) {
            if (this.D) {
              var n = this.C.get(m);
              if (n || n === "") {
                n && e.push(n);
                continue;
              }
            } else {
              this.D = setTimeout(Ka, 50, this);
            }
          }
          if (this.stemmer) {
            for (this.L || (this.L = new RegExp("(?!^)(" + this.A + ")$")), n = void 0; n !== m && m.length > 2;) {
              n = m, m = m.replace(this.L, function(B) {
                return c.stemmer.get(B);
              });
            }
          }
          if (m && (this.mapper || this.dedupe && m.length > 1)) {
            n = "";
            for (var q = 0, t = "", u = void 0, v = void 0; q < m.length; q++) {
              u = m.charAt(q), u === t && this.dedupe || ((v = this.mapper && this.mapper.get(u)) || v === "" ? v === t && this.dedupe || !(t = v) || (n += v) : n += t = u);
            }
            m = n;
          }
          this.matcher && m.length > 1 && (this.K || (this.K = new RegExp("(" + this.h + ")", "g")), m = m.replace(this.K, function(B) {
            return c.matcher.get(B);
          }));
          if (m && this.replacer) {
            for (n = 0; m && n < this.replacer.length; n += 2) {
              m = m.replace(this.replacer[n], this.replacer[n + 1]);
            }
          }
          this.cache && p.length <= this.I && (this.C.set(p, m), this.C.size > this.P && (this.C.clear(), this.I = this.I / 1.1 | 0));
          if (m) {
            if (m !== p) {
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
  this.cache && a.length <= this.H && (this.B.set(a, e), this.B.size > this.P && (this.B.clear(), this.H = this.H / 1.1 | 0));
  return e;
};
function Ka(a) {
  a.D = null;
  a.B.clear();
  a.C.clear();
}
;function La(a, b, c) {
  c || (b || typeof a !== "object" ? typeof b === "object" && (c = b, b = 0) : c = a);
  c && (a = c.query || a, b = c.limit || b);
  var d = "" + (b || 0);
  if (c) {
    var e = c;
    d += (e.offset || 0) + !!e.context + !!e.suggest + (e.resolve !== !1) + (e.resolution || this.resolution) + (e.boost || 0);
  }
  a = ("" + a).toLowerCase();
  this.cache || (this.cache = new Ma());
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
function Ma(a) {
  this.limit = a && a !== !0 ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
Ma.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
Ma.prototype.get = function(a) {
  var b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
Ma.prototype.remove = function(a) {
  for (var b = D(this.cache), c = b.next(); !c.done; c = b.next()) {
    c = c.value;
    var d = c[0];
    c[1].includes(a) && this.cache.delete(d);
  }
};
Ma.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
var Na = {normalize:!1, numeric:!1, dedupe:!1};
var Oa = {};
var Pa = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
var Qa = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Ra = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
var Sa = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var Ta = {Exact:Na, Default:Oa, Normalize:Oa, LatinBalance:{mapper:Pa}, LatinAdvanced:{mapper:Pa, matcher:Qa, replacer:Ra}, LatinExtra:{mapper:Pa, replacer:Ra.concat([/(?!^)[aeo]/g, ""]), matcher:Qa}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (var b = 0; b < a.length; b++) {
    for (var c = a[b], d = c.charAt(0), e = Sa[d], f = 1, g; f < c.length && (g = c.charAt(f), g === "h" || g === "w" || !(g = Sa[g]) || g === e || (d += g, e = g, d.length !== 4)); f++) {
    }
    a[b] = d;
  }
}}, CJK:{split:""}, LatinExact:Na, LatinDefault:Oa, LatinSimple:Oa};
function Ua(a, b, c, d) {
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
function Va(a) {
  if (!this || this.constructor !== Va) {
    return new Va(a);
  }
  this.index = a ? [a] : [];
  this.length = a ? a.length : 0;
  var b = this;
  return new Proxy([], {get:function(c, d) {
    if (d === "length") {
      return b.length;
    }
    if (d === "push") {
      return function(e) {
        b.index[b.index.length - 1].push(e);
        b.length++;
      };
    }
    if (d === "pop") {
      return function() {
        if (b.length) {
          return b.length--, b.index[b.index.length - 1].pop();
        }
      };
    }
    if (d === "indexOf") {
      return function(e) {
        for (var f = 0, g = 0, h, k; g < b.index.length; g++) {
          h = b.index[g];
          k = h.indexOf(e);
          if (k >= 0) {
            return f + k;
          }
          f += h.length;
        }
        return -1;
      };
    }
    if (d === "includes") {
      return function(e) {
        for (var f = 0; f < b.index.length; f++) {
          if (b.index[f].includes(e)) {
            return !0;
          }
        }
        return !1;
      };
    }
    if (d === "slice") {
      return function(e, f) {
        return Ua(b, e || 0, f || b.length, !1);
      };
    }
    if (d === "splice") {
      return function(e, f) {
        return Ua(b, e || 0, f || b.length, !0);
      };
    }
    if (d === "constructor") {
      return Array;
    }
    if (typeof d !== "symbol") {
      return (c = b.index[d / 2147483648 | 0]) && c[d];
    }
  }, set:function(c, d, e) {
    c = d / 2147483648 | 0;
    (b.index[c] || (b.index[c] = []))[d] = e;
    b.length++;
    return !0;
  }});
}
Va.prototype.clear = function() {
  this.index.length = 0;
};
Va.prototype.push = function() {
};
function X(a) {
  a = a === void 0 ? 8 : a;
  if (!this || this.constructor !== X) {
    return new X(a);
  }
  this.index = S();
  this.h = [];
  this.size = 0;
  a > 32 ? (this.A = Wa, this.B = BigInt(a)) : (this.A = Xa, this.B = a);
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
  a = a === void 0 ? 8 : a;
  if (!this || this.constructor !== Y) {
    return new Y(a);
  }
  this.index = S();
  this.h = [];
  this.size = 0;
  a > 32 ? (this.A = Wa, this.B = BigInt(a)) : (this.A = Xa, this.B = a);
}
Y.prototype.add = function(a) {
  var b = this.A(a), c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c), this.size++);
};
w = X.prototype;
w.has = Y.prototype.has = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.has(a);
};
w.delete = Y.prototype.delete = function(a) {
  var b = this.A(a);
  (b = this.index[b]) && b.delete(a) && this.size--;
};
w.clear = Y.prototype.clear = function() {
  this.index = S();
  this.h = [];
  this.size = 0;
};
w.values = Y.prototype.values = function Ya() {
  var b, c = this, d, e, f;
  return ua(Ya, function(g) {
    switch(g.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          g.h = 0;
          break;
        }
        d = D(c.h[b].values());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          g.h = 2;
          break;
        }
        f = e.value;
        return K(g, f, 6);
      case 6:
        e = d.next(), g.h = 5;
    }
  });
};
w.keys = Y.prototype.keys = function Za() {
  var b, c = this, d, e, f;
  return ua(Za, function(g) {
    switch(g.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          g.h = 0;
          break;
        }
        d = D(c.h[b].keys());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          g.h = 2;
          break;
        }
        f = e.value;
        return K(g, f, 6);
      case 6:
        e = d.next(), g.h = 5;
    }
  });
};
w.entries = Y.prototype.entries = function $a() {
  var b, c = this, d, e, f;
  return ua($a, function(g) {
    switch(g.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          g.h = 0;
          break;
        }
        d = D(c.h[b].entries());
        e = d.next();
      case 5:
        if (e.done) {
          b++;
          g.h = 2;
          break;
        }
        f = e.value;
        return K(g, f, 6);
      case 6:
        e = d.next(), g.h = 5;
    }
  });
};
function Xa(a) {
  var b = Math.pow(2, this.B) - 1;
  if (typeof a == "number") {
    return a & b;
  }
  for (var c = 0, d = this.B + 1, e = 0; e < a.length; e++) {
    c = (c * d ^ a.charCodeAt(e)) & b;
  }
  return this.B === 32 ? c + 2147483648 : c;
}
function Wa() {
  throw Error("The keystore is limited to 32 for EcmaScript5");
}
;var ab, bb;
function cb(a) {
  var b, c, d, e, f, g;
  return wa(function(h) {
    switch(h.h) {
      case 1:
        a = a.data;
        b = a.task;
        c = a.id;
        d = a.args;
        switch(b) {
          case "init":
            bb = a.options || {};
            (e = a.factory) ? (Function("return " + e)()(self), ab = new self.FlexSearch.Index(bb), delete self.FlexSearch) : ab = new db(bb);
            postMessage({id:c});
            break;
          default:
            h.h = 2;
            return;
        }h.h = 0;
        break;
      case 2:
        if (b === "export") {
          if (!bb.export || typeof bb.export !== "function") {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
          }
          d[1] ? (d[0] = bb.export, d[2] = 0, d[3] = 1) : d = null;
        }
        if (b === "import") {
          if (!bb.import || typeof bb.import !== "function") {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
          }
          if (!d[0]) {
            h.h = 5;
            break;
          }
          return K(h, bb.import.call(ab, d[0]), 11);
        }
        f = d && ab[b].apply(ab, d);
        if (!f || !f.then) {
          h.h = 6;
          break;
        }
        return K(h, f, 7);
      case 7:
        f = h.B;
      case 6:
        if (!f || !f.await) {
          h.h = 8;
          break;
        }
        return K(h, f.await, 9);
      case 9:
        f = h.B;
      case 8:
        b === "search" && f.result && (f = f.result);
        h.h = 5;
        break;
      case 11:
        g = h.B, ab.import(d[0], g);
      case 5:
        postMessage(b === "search" ? {id:c, msg:f} : {id:c}), h.h = 0;
    }
  });
}
;function eb(a) {
  fb.call(a, "add");
  fb.call(a, "append");
  fb.call(a, "search");
  fb.call(a, "update");
  fb.call(a, "remove");
  fb.call(a, "searchCache");
}
var gb, hb, ib;
function jb() {
  gb = ib = 0;
}
function fb(a) {
  this[a + "Async"] = function() {
    var b = arguments, c = b[b.length - 1];
    if (typeof c === "function") {
      var d = c;
      delete b[b.length - 1];
    }
    gb ? ib || (ib = Date.now() - hb >= this.priority * this.priority * 3) : (gb = setTimeout(jb, 0), hb = Date.now());
    if (ib) {
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
;var kb = 0;
function lb(a, b) {
  function c(h) {
    function k(l) {
      l = l.data || l;
      var m = l.id, p = m && f.h[m];
      p && (p(l.msg), delete f.h[m]);
    }
    this.worker = h;
    this.h = S();
    if (this.worker) {
      e ? this.worker.on("message", k) : this.worker.onmessage = k;
      if (a.config) {
        return new Promise(function(l) {
          kb > 1e9 && (kb = 0);
          f.h[++kb] = function() {
            l(f);
          };
          f.worker.postMessage({id:kb, task:"init", factory:d, options:a});
        });
      }
      this.priority = a.priority || 4;
      this.encoder = b || null;
      this.worker.postMessage({task:"init", factory:d, options:a});
      return this;
    }
    console.warn("Worker is not available on this platform. Please report on Github: https://github.com/nextapps-de/flexsearch/issues");
  }
  a = a === void 0 ? {} : a;
  if (!this || this.constructor !== lb) {
    return new lb(a);
  }
  var d = typeof self !== "undefined" ? self._factory : typeof window !== "undefined" ? window._factory : null;
  d && (d = d.toString());
  var e = typeof window === "undefined", f = this, g = mb(d, e, a.worker);
  return g.then ? g.then(function(h) {
    return c.call(f, h);
  }) : c.call(this, g);
}
nb("add");
nb("append");
nb("search");
nb("update");
nb("remove");
nb("clear");
nb("export");
nb("import");
lb.prototype.searchCache = La;
eb(lb.prototype);
function nb(a) {
  lb.prototype[a] = function() {
    var b = this, c = [].slice.call(arguments), d = c[c.length - 1];
    if (typeof d === "function") {
      var e = d;
      c.pop();
    }
    d = new Promise(function(f) {
      a === "export" && typeof c[0] === "function" && (c[0] = null);
      kb > 1e9 && (kb = 0);
      b.h[++kb] = f;
      b.worker.postMessage({task:a, id:kb, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function mb(a, b, c) {
  return b ? typeof module !== "undefined" ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + cb.toString()], {type:"text/javascript"}))) : new window.Worker(typeof c === "string" ? c : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;ob.prototype.add = function(a, b, c) {
  Ca(a) && (b = a, a = Da(b, this.key));
  if (b && (a || a === 0)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (var d = 0, e; d < this.field.length; d++) {
      e = this.B[d];
      var f = this.index.get(this.field[d]);
      if (typeof e === "function") {
        (e = e(b)) && f.add(a, e, c, !0);
      } else {
        var g = e.M;
        if (!g || g(b)) {
          e.constructor === String ? e = ["" + e] : U(e) && (e = [e]), pb(b, e, this.C, 0, f, a, e[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.A.length; d++) {
        g = this.A[d];
        var h = this.D[d];
        f = this.tag.get(h);
        e = S();
        if (typeof g === "function") {
          if (g = g(b), !g) {
            continue;
          }
        } else {
          var k = g.M;
          if (k && !k(b)) {
            continue;
          }
          g.constructor === String && (g = "" + g);
          g = Da(b, g);
        }
        if (f && g) {
          for (U(g) && (g = [g]), h = 0, k = void 0; h < g.length; h++) {
            var l = g[h];
            if (!e[l]) {
              e[l] = 1;
              var m;
              (m = f.get(l)) ? k = m : f.set(l, k = []);
              if (!c || !k.includes(a)) {
                if (k.length === 2147483647) {
                  m = new Va(k);
                  if (this.fastupdate) {
                    for (var p = D(this.reg.values()), n = p.next(); !n.done; n = p.next()) {
                      n = n.value, n.includes(k) && (n[n.indexOf(k)] = m);
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
      if (this.h) {
        var q = S();
        for (c = 0; c < this.h.length; c++) {
          if (d = this.h[c], f = d.M, !f || f(b)) {
            f = void 0;
            if (typeof d === "function") {
              f = d(b);
              if (!f) {
                continue;
              }
              d = [d.ia];
            } else if (U(d) || d.constructor === String) {
              q[d] = b[d];
              continue;
            }
            qb(b, q, d, 0, d[0], f);
          }
        }
      }
      this.store.set(a, q || b);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function qb(a, b, c, d, e, f) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
        qb(a, b, c, d, e);
      }
    } else {
      b = b[e] || (b[e] = S()), e = c[++d], qb(a, b, c, d, e);
    }
  }
}
function pb(a, b, c, d, e, f, g, h) {
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
          pb(a, b, c, d, e, f, g, h);
        }
      } else {
        g = b[++d], pb(a, b, c, d, e, f, g, h);
      }
    }
  }
}
;function rb(a, b, c, d) {
  if (!a.length) {
    return a;
  }
  if (a.length === 1) {
    return a = a[0], a = c || a.length > b ? a.slice(c, c + b) : a, d ? sb.call(this, a) : a;
  }
  for (var e = [], f = 0, g = void 0, h = void 0; f < a.length; f++) {
    if ((g = a[f]) && (h = g.length)) {
      if (c) {
        if (c >= h) {
          c -= h;
          continue;
        }
        g = g.slice(c, c + b);
        h = g.length;
        c = 0;
      }
      h > b && (g = g.slice(0, b), h = b);
      if (!e.length && h >= b) {
        return d ? sb.call(this, g) : g;
      }
      e.push(g);
      b -= h;
      if (!b) {
        break;
      }
    }
  }
  e = e.length > 1 ? [].concat.apply([], e) : e[0];
  return d ? sb.call(this, e) : e;
}
;function tb(a, b, c, d) {
  var e = d[0];
  if (e[0] && e[0].query) {
    return a[b].apply(a, e);
  }
  if (!(b !== "and" && b !== "not" || a.result.length || a.await || e.suggest)) {
    return d.length > 1 && (e = d[d.length - 1]), (d = e.resolve) ? a.await || a.result : a;
  }
  var f = [], g = 0, h = 0, k;
  b = {};
  for (e = 0; e < d.length; b = {U:void 0, T:void 0, Y:void 0, aa:void 0}, e++) {
    var l = d[e];
    if (l) {
      var m = void 0;
      if (l.constructor === Z) {
        m = l.await || l.result;
      } else if (l.then || l.constructor === Array) {
        m = l;
      } else {
        g = l.limit || 0;
        h = l.offset || 0;
        var p = l.suggest;
        var n = l.resolve;
        var q = ((k = l.highlight || a.highlight) || l.enrich) && n;
        m = l.queue;
        b.Y = l.async || m;
        var t = l.index, u = l.query;
        t ? a.index || (a.index = t) : t = a.index;
        if (u || l.tag) {
          if (!t) {
            throw Error("Resolver can't apply because the corresponding Index was never specified");
          }
          var v = l.field || l.pluck;
          if (v) {
            !u || a.query && !k || (a.query = u, a.field = v, a.highlight = k);
            if (!t.index) {
              throw Error("Resolver can't apply because the corresponding Document Index was not specified");
            }
            t = t.index.get(v);
            if (!t) {
              throw Error("Resolver can't apply because the specified Document Field '" + v + "' was not found");
            }
          }
          if (m && (B || a.await)) {
            var B = 1;
            b.U = void 0;
            b.aa = a.F.length;
            b.T = new Promise(function(A) {
              return function(C) {
                A.U = C;
              };
            }(b));
            (function(A) {
              return function(C, r) {
                A.T.H = function() {
                  r.index = null;
                  r.resolve = !1;
                  var x = A.Y ? C.searchAsync(r) : C.search(r);
                  if (x.then) {
                    return x.then(function(E) {
                      a.F[A.aa] = E = E.result || E;
                      (0,A.U)(E);
                      return E;
                    });
                  }
                  x = x.result || x;
                  (0,A.U)(x);
                  return x;
                };
              };
            })(b)(t, Object.assign({}, l));
            a.F.push(b.T);
            f[e] = b.T;
            continue;
          } else {
            l.resolve = !1, l.index = null, m = b.Y ? t.searchAsync(l) : t.search(l), l.resolve = n, l.index = t;
          }
        } else if (l.and) {
          m = ub(l, "and", t);
        } else if (l.or) {
          m = ub(l, "or", t);
        } else if (l.not) {
          m = ub(l, "not", t);
        } else if (l.xor) {
          m = ub(l, "xor", t);
        } else {
          continue;
        }
      }
      m.await ? (B = 1, m = m.await) : m.then ? (B = 1, m = m.then(function(A) {
        return A.result || A;
      })) : m = m.result || m;
      f[e] = m;
    }
  }
  B && !a.await && (a.await = new Promise(function(A) {
    a.return = A;
  }));
  if (B) {
    var y = Promise.all(f).then(function(A) {
      for (var C = 0; C < a.F.length; C++) {
        if (a.F[C] === y) {
          a.F[C] = function() {
            return c.call(a, A, g, h, q, n, p, k);
          };
          break;
        }
      }
      vb(a);
    });
    a.F.push(y);
  } else if (a.await) {
    a.F.push(function() {
      return c.call(a, f, g, h, q, n, p, k);
    });
  } else {
    return c.call(a, f, g, h, q, n, p, k);
  }
  return n ? a.await || a.result : a;
}
function ub(a, b, c) {
  a = a[b];
  var d = a[0] || a;
  d.index || (d.index = c);
  c = new Z(d);
  a.length > 1 && (c = c[b].apply(c, a.slice(1)));
  return c;
}
;Z.prototype.or = function() {
  return tb(this, "or", wb, arguments);
};
function wb(a, b, c, d, e, f, g) {
  a.length && (this.result.length && a.push(this.result), a.length < 2 ? this.result = a[0] : (this.result = xb(a, b, c, !1, this.h), c = 0));
  e && (this.await = null);
  return e ? this.resolve(b, c, d, g) : this;
}
;Z.prototype.and = function() {
  return tb(this, "and", yb, arguments);
};
function yb(a, b, c, d, e, f, g) {
  if (!f && !this.result.length) {
    return e ? this.result : this;
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), a.length < 2) {
      this.result = a[0];
    } else {
      for (var h = 0, k = 0, l = void 0, m = void 0; k < a.length; k++) {
        if ((l = a[k]) && (m = l.length)) {
          h < m && (h = m);
        } else if (!f) {
          h = 0;
          break;
        }
      }
      if (h) {
        this.result = zb(a, h, b, c, f, this.h, e);
        var p = !0;
      } else {
        this.result = [];
      }
    }
  } else {
    f || (this.result = a);
  }
  e && (this.await = null);
  return e ? this.resolve(b, c, d, g, p) : this;
}
;Z.prototype.xor = function() {
  return tb(this, "xor", Ab, arguments);
};
function Ab(a, b, c, d, e, f, g) {
  if (a.length) {
    if (this.result.length && a.unshift(this.result), a.length < 2) {
      this.result = a[0];
    } else {
      a: {
        f = c;
        var h = this.h;
        for (var k = [], l = S(), m = 0, p = 0, n; p < a.length; p++) {
          if (n = a[p]) {
            m < n.length && (m = n.length);
            for (var q = 0, t; q < n.length; q++) {
              if (t = n[q]) {
                for (var u = 0, v; u < t.length; u++) {
                  v = t[u], l[v] = l[v] ? 2 : 1;
                }
              }
            }
          }
        }
        for (n = p = 0; p < m; p++) {
          for (q = 0; q < a.length; q++) {
            if (t = a[q]) {
              if (t = t[p]) {
                for (u = 0; u < t.length; u++) {
                  if (v = t[u], l[v] === 1) {
                    if (f) {
                      f--;
                    } else {
                      if (e) {
                        if (k.push(v), k.length === b) {
                          a = k;
                          break a;
                        }
                      } else {
                        var B = p + (q ? h : 0);
                        k[B] || (k[B] = []);
                        k[B].push(v);
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
      h = !0;
    }
  } else {
    f || (this.result = a);
  }
  e && (this.await = null);
  return e ? this.resolve(b, c, d, g, h) : this;
}
;Z.prototype.not = function() {
  return tb(this, "not", Bb, arguments);
};
function Bb(a, b, c, d, e, f, g) {
  if (!f && !this.result.length) {
    return e ? this.result : this;
  }
  if (a.length && this.result.length) {
    a: {
      f = c;
      var h = [];
      a = new Set(a.flat().flat());
      for (var k = 0, l, m = 0; k < this.result.length; k++) {
        if (l = this.result[k]) {
          for (var p = 0, n; p < l.length; p++) {
            if (n = l[p], !a.has(n)) {
              if (f) {
                f--;
              } else {
                if (e) {
                  if (h.push(n), h.length === b) {
                    f = h;
                    break a;
                  }
                } else {
                  if (h[k] || (h[k] = []), h[k].push(n), ++m === b) {
                    f = h;
                    break a;
                  }
                }
              }
            }
          }
        }
      }
      f = h;
    }
    this.result = f;
    h = !0;
  }
  e && (this.await = null);
  return e ? this.resolve(b, c, d, g, h) : this;
}
;function Cb(a, b, c, d, e) {
  if (typeof e === "string") {
    var f = e;
    e = "";
  } else {
    f = e.template;
  }
  if (!f) {
    throw Error('No template pattern was specified by the search option "highlight"');
  }
  var g = f.indexOf("$1");
  if (g === -1) {
    throw Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + f);
  }
  var h = f.substring(g + 2);
  g = f.substring(0, g);
  var k = e && e.boundary, l = !e || e.clip !== !1, m = e && e.merge && h && g && new RegExp(h + " " + g, "g");
  e = e && e.ellipsis;
  var p = 0;
  if (typeof e === "object") {
    var n = e.template;
    p = n.length - 2;
    e = e.pattern;
  }
  typeof e !== "string" && (e = e === !1 ? "" : "...");
  p && (e = n.replace("$1", e));
  n = e.length - p;
  if (typeof k === "object") {
    var q = k.before;
    q === 0 && (q = -1);
    var t = k.after;
    t === 0 && (t = -1);
    k = k.total || 9e5;
  }
  p = new Map();
  for (var u, v = 0, B, y; v < b.length; v++) {
    if (d) {
      var A = b;
      y = d;
    } else {
      A = b[v];
      y = A.field;
      if (!y) {
        continue;
      }
      A = A.result;
    }
    u = c.get(y);
    B = u.encoder;
    u = p.get(B);
    typeof u !== "string" && (u = B.encode(a), p.set(B, u));
    for (var C = 0; C < A.length; C++) {
      var r = A[C].doc;
      if (r && (r = Da(r, y))) {
        var x = r.trim().split(/\s+/);
        if (x.length) {
          r = "";
          for (var E = [], T = [], G = -1, N = -1, Q = 0, F = 0; F < x.length; F++) {
            var R = x[F], W = B.encode(R);
            W = W.length > 1 ? W.join(" ") : W[0];
            var O = void 0;
            if (W && R) {
              for (var L = R.length, M = (B.split ? R.replace(B.split, "") : R).length - W.length, ba = "", oa = 0, z = 0; z < u.length; z++) {
                var I = u[z];
                if (I) {
                  var J = I.length;
                  J += M;
                  oa && J <= oa || (I = W.indexOf(I), I > -1 && (ba = (I ? R.substring(0, I) : "") + g + R.substring(I, I + J) + h + (I + J < L ? R.substring(I + J) : ""), oa = J, O = !0));
                }
              }
              ba && (k && (G < 0 && (G = r.length + (r ? 1 : 0)), N = r.length + (r ? 1 : 0) + ba.length, Q += L, T.push(E.length), E.push({match:ba})), r += (r ? " " : "") + ba);
            }
            if (!O) {
              R = x[F], r += (r ? " " : "") + R, k && E.push({text:R});
            } else if (k && Q >= k) {
              break;
            }
          }
          Q = T.length * (f.length - 2);
          if (q || t || k && r.length - Q > k) {
            if (Q = k + Q - n * 2, F = N - G, q > 0 && (F += q), t > 0 && (F += t), F <= Q) {
              x = q ? G - (q > 0 ? q : 0) : G - ((Q - F) / 2 | 0), E = t ? N + (t > 0 ? t : 0) : x + Q, l || (x > 0 && r.charAt(x) !== " " && r.charAt(x - 1) !== " " && (x = r.indexOf(" ", x), x < 0 && (x = 0)), E < r.length && r.charAt(E - 1) !== " " && r.charAt(E) !== " " && (E = r.lastIndexOf(" ", E), E < N ? E = N : ++E)), r = (x ? e : "") + r.substring(x, E) + (E < r.length ? e : "");
            } else {
              N = [];
              Q = {};
              G = {};
              F = {};
              R = {};
              W = {};
              M = L = O = 0;
              for (oa = ba = 1;;) {
                I = void 0;
                for (z = 0; z < T.length; z++) {
                  J = T[z];
                  if (M) {
                    if (L !== M) {
                      if (F[z + 1]) {
                        continue;
                      }
                      J += M;
                      if (Q[J]) {
                        O -= n;
                        G[z + 1] = 1;
                        F[z + 1] = 1;
                        continue;
                      }
                      if (J >= E.length - 1) {
                        if (J >= E.length) {
                          F[z + 1] = 1;
                          J >= x.length && (G[z + 1] = 1);
                          continue;
                        }
                        O -= n;
                      }
                      r = E[J].text;
                      var V = t && W[z];
                      if (V) {
                        if (V > 0) {
                          if (r.length > V) {
                            if (F[z + 1] = 1, l) {
                              r = r.substring(0, V);
                            } else {
                              continue;
                            }
                          }
                          (V -= r.length) || (V = -1);
                          W[z] = V;
                        } else {
                          F[z + 1] = 1;
                          continue;
                        }
                      }
                      if (O + r.length + 1 <= k) {
                        r = " " + r, N[z] += r;
                      } else if (l) {
                        I = k - O - 1, I > 0 && (r = " " + r.substring(0, I), N[z] += r), F[z + 1] = 1;
                      } else {
                        F[z + 1] = 1;
                        continue;
                      }
                    } else {
                      if (F[z]) {
                        continue;
                      }
                      J -= L;
                      if (Q[J]) {
                        O -= n;
                        F[z] = 1;
                        G[z] = 1;
                        continue;
                      }
                      if (J <= 0) {
                        if (J < 0) {
                          F[z] = 1;
                          G[z] = 1;
                          continue;
                        }
                        O -= n;
                      }
                      r = E[J].text;
                      if (V = q && R[z]) {
                        if (V > 0) {
                          if (r.length > V) {
                            if (F[z] = 1, l) {
                              r = r.substring(r.length - V);
                            } else {
                              continue;
                            }
                          }
                          (V -= r.length) || (V = -1);
                          R[z] = V;
                        } else {
                          F[z] = 1;
                          continue;
                        }
                      }
                      if (O + r.length + 1 <= k) {
                        r += " ", N[z] = r + N[z];
                      } else if (l) {
                        I = r.length + 1 - (k - O), I >= 0 && I < r.length && (r = r.substring(I) + " ", N[z] = r + N[z]), F[z] = 1;
                      } else {
                        F[z] = 1;
                        continue;
                      }
                    }
                  } else {
                    r = E[J].match;
                    q && (R[z] = q);
                    t && (W[z] = t);
                    z && O++;
                    I = void 0;
                    J ? !z && n && (O += n) : (G[z] = 1, F[z] = 1);
                    J >= x.length - 1 ? I = 1 : J < E.length - 1 && E[J + 1].match ? I = 1 : n && (O += n);
                    O -= f.length - 2;
                    if (!z || O + r.length <= k) {
                      N[z] = r;
                    } else {
                      I = ba = oa = G[z] = 0;
                      break;
                    }
                    I && (G[z + 1] = 1, F[z + 1] = 1);
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
              for (x = 0; x < N.length; x++) {
                E = (x && G[x] ? " " : (x && !e ? " " : "") + e) + N[x], r += E;
              }
              e && !G[N.length] && (r += e);
            }
          }
          m && (r = r.replace(m, " "));
          A[C].highlight = r;
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
      var g = f.field || f.pluck;
      var h = f.highlight;
      var k = f.resolve;
      a = f.async || f.queue;
      f.resolve = !1;
      f.index = null;
      a = a ? b.searchAsync(f) : b.search(f);
      f.resolve = k;
      f.index = b;
      a = a.result || a;
    } else {
      a = [];
    }
  }
  if (a && a.then) {
    var l = this;
    a = a.then(function(n) {
      l.F[0] = l.result = n.result || n;
      vb(l);
    });
    var m = [a];
    a = [];
    var p = new Promise(function(n) {
      e = n;
    });
  }
  this.index = b || null;
  this.result = a || [];
  this.h = c;
  this.F = m || [];
  this.await = p || null;
  this.return = e || null;
  this.highlight = h || null;
  this.query = d || "";
  this.field = g || "";
}
w = Z.prototype;
w.limit = function(a) {
  if (this.await) {
    var b = this;
    this.F.push(function() {
      return b.limit(a).result;
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
    this.F.push(function() {
      return b.offset(a).result;
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
    this.F.push(function() {
      return b.boost(a).result;
    });
  } else {
    this.h += a;
  }
  return this;
};
function vb(a, b) {
  var c = a.result, d = a.await;
  a.await = null;
  for (var e = 0, f; e < a.F.length; e++) {
    if (f = a.F[e]) {
      if (typeof f === "function") {
        c = f(), a.F[e] = c = c.result || c, e--;
      } else if (f.H) {
        c = f.H(), a.F[e] = c = c.result || c, e--;
      } else if (f.then) {
        return a.await = d;
      }
    }
  }
  d = a.return;
  a.F = [];
  a.return = null;
  b || d(c);
  return c;
}
w.resolve = function(a, b, c, d, e) {
  var f = this.await ? vb(this, !0) : this.result;
  if (f.then) {
    var g = this;
    return f.then(function() {
      return g.resolve(a, b, c, d, e);
    });
  }
  f.length && (typeof a === "object" ? (d = a.highlight || this.highlight, c = !!d || a.enrich, b = a.offset, a = a.limit) : (d = d || this.highlight, c = !!d || c), f = e ? c ? sb.call(this.index, f) : f : rb.call(this.index, f, a || 100, b, c));
  return this.finalize(f, d);
};
w.finalize = function(a, b) {
  if (a.then) {
    var c = this;
    return a.then(function(e) {
      return c.finalize(e, b);
    });
  }
  b && !this.query && console.warn('There was no query specified for highlighting. Please specify a query within the highlight resolver stage like { query: "...", highlight: ... }.');
  b && a.length && this.query && (a = Cb(this.query, a, this.index.index, this.field, b));
  var d = this.return;
  this.highlight = this.index = this.result = this.F = this.await = this.return = null;
  this.query = this.field = "";
  d && d(a);
  return a;
};
function zb(a, b, c, d, e, f, g) {
  var h = a.length, k = [];
  var l = S();
  for (var m = 0, p = void 0, n, q; m < b; m++) {
    for (var t = 0; t < h; t++) {
      var u = a[t];
      if (m < u.length && (p = u[m])) {
        for (var v = 0; v < p.length; v++) {
          n = p[v];
          (u = l[n]) ? l[n]++ : (u = 0, l[n] = 1);
          q = k[u] || (k[u] = []);
          if (!g) {
            var B = m + (t || !e ? 0 : f || 0);
            q = q[B] || (q[B] = []);
          }
          q.push(n);
          if (g && c && u === h - 1 && q.length - d === c) {
            return d ? q.slice(d) : q;
          }
        }
      }
    }
  }
  if (a = k.length) {
    if (e) {
      k = k.length > 1 ? xb(k, c, d, g, f) : (k = k[0]) && c && k.length > c || d ? k.slice(d, c + d) : k;
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
function xb(a, b, c, d, e) {
  var f = [], g = S(), h = a.length, k;
  if (d) {
    for (e = h - 1; e >= 0; e--) {
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
    for (var m = h - 1, p, n = 0; m >= 0; m--) {
      p = a[m];
      for (var q = 0; q < p.length; q++) {
        if (k = (d = p[q]) && d.length) {
          for (var t = 0; t < k; t++) {
            if (l = d[t], !g[l]) {
              if (g[l] = 1, c) {
                c--;
              } else {
                var u = (q + (m < h - 1 ? e || 0 : 0)) / (m + 1) | 0;
                (f[u] || (f[u] = [])).push(l);
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
function Db(a, b, c) {
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
ob.prototype.search = function(a, b, c, d) {
  c || (!b && Ca(a) ? (c = a, a = "") : Ca(b) && (c = b, b = 0));
  var e = [], f = [], g = 0, h = !0;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    var k = c.pluck;
    var l = c.merge;
    var m = c.boost;
    var p = k || c.field || (p = c.index) && (p.index ? null : p);
    var n = this.tag && c.tag;
    var q = c.suggest;
    h = c.resolve !== !1;
    var t = c.cache;
    this.store && c.highlight && !h ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && c.enrich && !h && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    var u = h && this.store && c.highlight;
    var v = !!u || h && this.store && c.enrich;
    b = c.limit || b;
    var B = c.offset || 0;
    b || (b = h ? 100 : 0);
    if (n && (!this.db || !d)) {
      n.constructor !== Array && (n = [n]);
      for (var y = [], A = 0, C = void 0; A < n.length; A++) {
        C = n[A];
        if (U(C)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (C.field && C.tag) {
          var r = C.tag;
          if (r.constructor === Array) {
            for (var x = 0; x < r.length; x++) {
              y.push(C.field, r[x]);
            }
          } else {
            y.push(C.field, r);
          }
        } else {
          r = Object.keys(C);
          x = 0;
          for (var E = void 0, T = void 0; x < r.length; x++) {
            if (E = r[x], T = C[E], T.constructor === Array) {
              for (var G = 0; G < T.length; G++) {
                y.push(E, T[G]);
              }
            } else {
              y.push(E, T);
            }
          }
        }
      }
      if (!y.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      n = y;
      if (!a) {
        f = [];
        if (y.length) {
          for (n = 0; n < y.length; n += 2) {
            d = void 0;
            if (this.db) {
              d = this.index.get(y[n]);
              if (!d) {
                console.warn("Tag '" + y[n] + ":" + y[n + 1] + "' will be skipped because there is no field '" + y[n] + "'.");
                continue;
              }
              f.push(d = d.db.tag(y[n + 1], b, B, v));
            } else {
              d = Eb.call(this, y[n], y[n + 1], b, B, v);
            }
            e.push(h ? {field:y[n], tag:y[n + 1], result:d} : [d]);
          }
        }
        if (f.length) {
          var N = this;
          return Promise.all(f).then(function(L) {
            for (var M = 0; M < L.length; M++) {
              h ? e[M].result = L[M] : e[M] = L[M];
            }
            return h ? e : new Z(e.length > 1 ? zb(e, 1, 0, 0, q, m) : e[0], N);
          });
        }
        return h ? e : new Z(e.length > 1 ? zb(e, 1, 0, 0, q, m) : e[0], this);
      }
    }
    if (!h && !k) {
      if (p = p || this.field) {
        U(p) ? k = p : (p.constructor === Array && p.length === 1 && (p = p[0]), k = p.field || p.index);
      }
      if (!k) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    p && p.constructor !== Array && (p = [p]);
  }
  p || (p = this.field);
  y = (this.worker || this.db) && !d && [];
  A = 0;
  for (x = C = r = void 0; A < p.length; A++) {
    if (C = p[A], !this.db || !this.tag || this.B[A]) {
      r = void 0;
      U(C) || (r = C, C = r.field, a = r.query || a, b = Ba(r.limit, b), B = Ba(r.offset, B), q = Ba(r.suggest, q), u = h && this.store && Ba(r.highlight, u), v = !!u || h && this.store && Ba(r.enrich, v), t = Ba(r.cache, t));
      if (d) {
        r = d[A];
      } else {
        x = r || c || {};
        E = x.enrich;
        r = this.index.get(C);
        if (n) {
          if (this.db) {
            x.tag = n;
            var Q = r.db.support_tag_search;
            x.field = p;
          }
          !Q && E && (x.enrich = !1);
        }
        r = t ? r.searchCache(a, b, x) : r.search(a, b, x);
        E && (x.enrich = E);
        if (y) {
          y[A] = r;
          continue;
        }
      }
      x = (r = r.result || r) && r.length;
      if (n && x) {
        E = [];
        T = 0;
        if (this.db && d) {
          if (!Q) {
            for (G = p.length; G < d.length; G++) {
              var F = d[G];
              if (F && F.length) {
                T++, E.push(F);
              } else if (!q) {
                return h ? e : new Z(e, this);
              }
            }
          }
        } else {
          G = 0;
          for (var R = F = void 0; G < n.length; G += 2) {
            F = this.tag.get(n[G]);
            if (!F) {
              if (console.warn("Tag '" + n[G] + ":" + n[G + 1] + "' will be skipped because there is no field '" + n[G] + "'."), q) {
                continue;
              } else {
                return h ? e : new Z(e, this);
              }
            }
            if (R = (F = F && F.get(n[G + 1])) && F.length) {
              T++, E.push(F);
            } else if (!q) {
              return h ? e : new Z(e, this);
            }
          }
        }
        if (T) {
          r = Db(r, E, h);
          x = r.length;
          if (!x && !q) {
            return h ? r : new Z(r, this);
          }
          T--;
        }
      }
      if (x) {
        f[g] = C, e.push(r), g++;
      } else if (p.length === 1) {
        return h ? e : new Z(e, this);
      }
    }
  }
  if (y) {
    if (this.db && n && n.length && !Q) {
      for (v = 0; v < n.length; v += 2) {
        f = this.index.get(n[v]);
        if (!f) {
          if (console.warn("Tag '" + n[v] + ":" + n[v + 1] + "' was not found because there is no field '" + n[v] + "'."), q) {
            continue;
          } else {
            return h ? e : new Z(e, this);
          }
        }
        y.push(f.db.tag(n[v + 1], b, B, !1));
      }
    }
    var W = this;
    return Promise.all(y).then(function(L) {
      c && (c.resolve = h);
      L.length && (L = W.search(a, b, c, L));
      return L;
    });
  }
  if (!g) {
    return h ? e : new Z(e, this);
  }
  if (k && (!v || !this.store)) {
    return e = e[0], h ? e : new Z(e, this);
  }
  y = [];
  for (B = 0; B < f.length; B++) {
    n = e[B];
    v && n.length && typeof n[0].doc === "undefined" && (this.db ? y.push(n = this.index.get(this.field[0]).db.enrich(n)) : n = sb.call(this, n));
    if (k) {
      return h ? u ? Cb(a, n, this.index, k, u) : n : new Z(n, this);
    }
    e[B] = {field:f[B], result:n};
  }
  if (v && this.db && y.length) {
    var O = this;
    return Promise.all(y).then(function(L) {
      for (var M = 0; M < L.length; M++) {
        e[M].result = L[M];
      }
      u && (e = Cb(a, e, O.index, k, u));
      return l ? Fb(e) : e;
    });
  }
  u && (e = Cb(a, e, this.index, k, u));
  return l ? Fb(e) : e;
};
function Fb(a) {
  for (var b = [], c = S(), d = S(), e = 0, f, g, h = void 0, k, l, m; e < a.length; e++) {
    f = a[e];
    g = f.field;
    f = f.result;
    for (var p = 0; p < f.length; p++) {
      if (k = f[p], typeof k !== "object" ? k = {id:h = k} : h = k.id, (l = c[h]) ? l.push(g) : (k.field = c[h] = [g], b.push(k)), m = k.highlight) {
        l = d[h], l || (d[h] = l = {}, k.highlight = l), l[g] = m;
      }
    }
  }
  return b;
}
function Eb(a, b, c, d, e) {
  a = this.tag.get(a);
  if (!a) {
    return [];
  }
  a = a.get(b);
  if (!a) {
    return [];
  }
  b = a.length - d;
  if (b > 0) {
    if (c && b > c || d) {
      a = a.slice(d, d + c);
    }
    e && (a = sb.call(this, a));
  }
  return a;
}
function sb(a) {
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
;function ob(a) {
  if (!this || this.constructor !== ob) {
    return new ob(a);
  }
  var b = a.document || a.doc || a, c, d;
  this.B = [];
  this.field = [];
  this.C = [];
  this.key = (c = b.key || b.id) && Gb(c, this.C) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? d ? new Y(d) : new Set() : d ? new X(d) : new Map();
  this.h = (c = b.store || null) && c && c !== !0 && [];
  this.store = c ? d ? new X(d) : new Map() : null;
  this.cache = (c = a.cache || null) && new Ma(c);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = Hb.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if (typeof c === "string" && (c = [c]), c.length) {
      this.tag = new Map();
      this.A = [];
      this.D = [];
      b = 0;
      for (var e = d = void 0; b < c.length; b++) {
        d = c[b];
        e = d.field || d;
        if (!e) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        d.custom ? this.A[b] = d.custom : (this.A[b] = Gb(e, this.C), d.filter && (typeof this.A[b] === "string" && (this.A[b] = new String(this.A[b])), this.A[b].M = d.filter));
        this.D[b] = e;
        this.tag.set(e, new Map());
      }
    }
  }
  if (this.worker) {
    this.fastupdate = !1;
    a = [];
    c = D(this.index.values());
    for (b = c.next(); !b.done; b = c.next()) {
      b = b.value, b.then && a.push(b);
    }
    if (a.length) {
      var f = this;
      return Promise.all(a).then(function(g) {
        for (var h = 0, k = D(f.index.entries()), l = k.next(); !l.done; l = k.next()) {
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
w = ob.prototype;
w.mount = function(a) {
  if (this.worker) {
    throw Error("You can't use Worker-Indexes on a persistent model. That would be useless, since each of the persistent model acts like Worker-Index by default (Master/Slave).");
  }
  var b = this.field;
  if (this.tag) {
    for (var c = 0, d = void 0; c < this.D.length; c++) {
      d = this.D[c];
      var e = void 0;
      this.index.set(d, e = new db({}, this.reg));
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
w.commit = function() {
  var a = this, b, c, d, e;
  return wa(function(f) {
    if (f.h == 1) {
      b = [];
      c = D(a.index.values());
      for (d = c.next(); !d.done; d = c.next()) {
        e = d.value, b.push(e.commit());
      }
      return K(f, Promise.all(b), 2);
    }
    a.reg.clear();
    f.h = 0;
  });
};
w.destroy = function() {
  for (var a = [], b = D(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    a.push(c.value.destroy());
  }
  return Promise.all(a);
};
function Hb(a, b) {
  var c = new Map(), d = b.index || b.field || b;
  U(d) && (d = [d]);
  for (var e = 0, f, g = void 0; e < d.length; e++) {
    f = d[e];
    U(f) || (g = f, f = f.field);
    g = Ca(g) ? Object.assign({}, a, g) : a;
    if (this.worker) {
      var h = (h = g.encoder) && h.encode ? h : new Ja(typeof h === "string" ? Ta[h] : h || {});
      h = new lb(g, h);
      c.set(f, h);
    }
    this.worker || c.set(f, new db(g, this.reg));
    g.custom ? this.B[e] = g.custom : (this.B[e] = Gb(f, this.C), g.filter && (typeof this.B[e] === "string" && (this.B[e] = new String(this.B[e])), this.B[e].M = g.filter));
    this.field[e] = f;
  }
  if (this.h) {
    for (a = b.store, U(a) && (a = [a]), b = 0; b < a.length; b++) {
      d = a[b], e = d.field || d, d.custom ? (this.h[b] = d.custom, d.custom.ia = e) : (this.h[b] = Gb(e, this.C), d.filter && (typeof this.h[b] === "string" && (this.h[b] = new String(this.h[b])), this.h[b].M = d.filter));
    }
  }
  return c;
}
function Gb(a, b) {
  for (var c = a.split(":"), d = 0, e = 0; e < c.length; e++) {
    a = c[e], a[a.length - 1] === "]" && (a = a.substring(0, a.length - 2)) && (b[d] = !0), a && (c[d++] = a);
  }
  d < c.length && (c.length = d);
  return d > 1 ? c : c[0];
}
w.append = function(a, b) {
  return this.add(a, b, !0);
};
w.update = function(a, b) {
  return this.remove(a).add(a, b);
};
w.remove = function(a) {
  Ca(a) && (a = Da(a, this.key));
  for (var b = D(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c.value.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (b = D(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
        c = c.value;
        for (var d = D(c), e = d.next(); !e.done; e = d.next()) {
          var f = e.value;
          e = f[0];
          f = f[1];
          var g = f.indexOf(a);
          g > -1 && (f.length > 1 ? f.splice(g, 1) : c.delete(e));
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
  for (var a = [], b = D(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c = c.value.clear(), c.then && a.push(c);
  }
  if (this.tag) {
    for (b = D(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
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
  for (var a = D(this.index.values()), b = a.next(); !b.done; b = a.next()) {
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
  typeof a === "object" && (b = a, a = Da(b, this.key));
  this.store.set(a, b);
  return this;
};
w.searchCache = La;
w.export = Ib;
w.import = Jb;
eb(ob.prototype);
function Kb(a, b) {
  b = b === void 0 ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 5000 | 0);
  a = D(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    d.push(e.value), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function Lb(a, b) {
  b || (b = new Map());
  for (var c = 0, d; c < a.length; c++) {
    d = a[c], b.set(d[0], d[1]);
  }
  return b;
}
function Mb(a, b) {
  b = b === void 0 ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 1000 | 0);
  a = D(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    e = e.value, d.push([e[0], Kb(e[1])[0]]), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function Nb(a, b) {
  b || (b = new Map());
  for (var c = 0, d, e; c < a.length; c++) {
    d = a[c], e = b.get(d[0]), b.set(d[0], Lb(d[1], e));
  }
  return b;
}
function Ob(a) {
  var b = [], c = [];
  a = D(a.keys());
  for (var d = a.next(); !d.done; d = a.next()) {
    c.push(d.value), c.length === 250000 && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function Pb(a, b) {
  b || (b = new Set());
  for (var c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function Qb(a, b, c, d, e, f, g) {
  g = g === void 0 ? 0 : g;
  var h = d && d.constructor === Array, k = h ? d.shift() : d;
  if (!k) {
    return this.export(a, b, e, f + 1);
  }
  if ((k = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(k))) && k.then) {
    var l = this;
    return k.then(function() {
      return Qb.call(l, a, b, c, h ? d : null, e, f, g + 1);
    });
  }
  return Qb.call(this, a, b, c, h ? d : null, e, f, g + 1);
}
function Ib(a, b, c, d) {
  c = c === void 0 ? 0 : c;
  d = d === void 0 ? 0 : d;
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
      var h = Ob(this.reg);
      b = null;
      break;
    case 1:
      g = "tag";
      h = this.tag && Mb(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      g = "doc";
      h = this.store && Kb(this.store);
      b = null;
      break;
    default:
      return;
  }
  return Qb.call(this, a, b, g, h || null, c, d);
}
function Jb(a, b) {
  var c = a.split(".");
  c[c.length - 1] === "json" && c.pop();
  var d = c.length > 2 ? c[0] : "";
  c = c.length > 2 ? c[2] : c[1];
  if (this.worker && d) {
    return this.index.get(d).import(a);
  }
  if (b) {
    typeof b === "string" && (b = JSON.parse(b));
    if (d) {
      return this.index.get(d).import(c, b);
    }
    switch(c) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Pb(b, this.reg);
        for (b = 0; b < this.field.length; b++) {
          d = this.index.get(this.field[b]), d.fastupdate = !1, d.reg = this.reg;
        }
        if (this.worker) {
          b = [];
          d = D(this.index.values());
          for (c = d.next(); !c.done; c = d.next()) {
            b.push(c.value.import(a));
          }
          return Promise.all(b);
        }
        break;
      case "tag":
        this.tag = Nb(b, this.tag);
        break;
      case "doc":
        this.store = Lb(b, this.store);
    }
  }
}
function Rb(a, b) {
  var c = "";
  a = D(a.entries());
  for (var d = a.next(); !d.done; d = a.next()) {
    var e = d.value;
    d = e[0];
    e = e[1];
    for (var f = "", g = 0, h; g < e.length; g++) {
      h = e[g] || [""];
      for (var k = "", l = 0; l < h.length; l++) {
        k += (k ? "," : "") + (b === "string" ? '"' + h[l] + '"' : h[l]);
      }
      k = "[" + k + "]";
      f += (f ? "," : "") + k;
    }
    f = '["' + d + '",[' + f + "]]";
    c += (c ? "," : "") + f;
  }
  return c;
}
;db.prototype.remove = function(a, b) {
  var c = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (c) {
    if (this.fastupdate) {
      for (var d = 0, e = void 0, f = void 0; d < c.length; d++) {
        if ((e = c[d]) && (f = e.length)) {
          if (e[f - 1] === a) {
            e.pop();
          } else {
            var g = e.indexOf(a);
            g >= 0 && e.splice(g, 1);
          }
        }
      }
    } else {
      Sb(this.map, a), this.depth && Sb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.$ && Tb(this));
  this.cache && this.cache.remove(a);
  return this;
};
function Sb(a, b) {
  var c = 0, d = typeof b === "undefined";
  if (a.constructor === Array) {
    for (var e = 0, f = void 0, g, h = void 0; e < a.length; e++) {
      if ((f = a[e]) && f.length) {
        if (d) {
          return 1;
        }
        g = f.indexOf(b);
        if (g >= 0) {
          if (f.length > 1) {
            return f.splice(g, 1), 1;
          }
          delete a[e];
          if (c) {
            return 1;
          }
          h = 1;
        } else {
          if (h) {
            return 1;
          }
          c++;
        }
      }
    }
  } else {
    for (d = D(a.entries()), e = d.next(); !e.done; e = d.next()) {
      e = e.value, f = e[0], Sb(e[1], b) ? c++ : a.delete(f);
    }
  }
  return c;
}
;var Ub = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
db.prototype.add = function(a, b, c, d) {
  if (b && (a || a === 0)) {
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
          var p = this.score ? this.score(b, l, k, null, 0) : Vb(h, e, k), n = "";
          switch(this.tokenize) {
            case "tolerant":
              Wb(this, g, l, p, a, c);
              if (m > 2) {
                for (var q = 1, t, u; q < m - 1; q++) {
                  n = l.charAt(q), t = l.charAt(q + 1), t = l.substring(0, q) + t, u = l.substring(q + 2), n = t + n + u, Wb(this, g, n, p, a, c), n = t + u, Wb(this, g, n, p, a, c);
                }
                Wb(this, g, l.substring(0, l.length - 1), p, a, c);
              }
              break;
            case "full":
              if (m > 2) {
                for (p = 0; p < m; p++) {
                  for (q = m; q > p; q--) {
                    n = l.substring(p, q), t = this.rtl ? m - 1 - p : p, t = this.score ? this.score(b, l, k, n, t) : Vb(h, e, k, m, t), Wb(this, g, n, t, a, c);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (m > 1) {
                for (q = m - 1; q > 0; q--) {
                  n = l[this.rtl ? m - 1 - q : q] + n, t = this.score ? this.score(b, l, k, n, q) : Vb(h, e, k, m, q), Wb(this, g, n, t, a, c);
                }
                n = "";
              }
            case "forward":
              if (m > 1) {
                for (q = 0; q < m; q++) {
                  n += l[this.rtl ? m - 1 - q : q], Wb(this, g, n, p, a, c);
                }
                break;
              }
            default:
              if (Wb(this, g, l, p, a, c), d && e > 1 && k < e - 1) {
                for (m = this.ba, n = l, p = Math.min(d + 1, this.rtl ? k + 1 : e - k), q = 1; q < p; q++) {
                  l = b[this.rtl ? e - 1 - k - q : k + q], t = this.bidirectional && l > n, u = this.score ? this.score(b, n, k, l, q - 1) : Vb(m + (e / 2 > m ? 0 : 1), e, k, p - 1, q - 1), Wb(this, f, t ? n : l, u, a, c, t ? l : n);
                }
              }
          }
        }
      }
      this.fastupdate || this.reg.add(a);
    }
  }
  this.db && (this.commit_task.push(c ? {ins:a} : {del:a}), this.$ && Tb(this));
  return this;
};
function Wb(a, b, c, d, e, f, g) {
  var h;
  if (!(h = b[c]) || g && !h[g]) {
    if (g) {
      b = h || (b[c] = S());
      b[g] = 1;
      var k = a.ctx;
      (h = k.get(g)) ? k = h : k.set(g, k = a.keystore ? new X(a.keystore) : new Map());
    } else {
      k = a.map, b[c] = 1;
    }
    (h = k.get(c)) ? k = h : k.set(c, k = h = []);
    if (f) {
      for (c = 0; c < h.length; c++) {
        if ((b = h[c]) && b.includes(e)) {
          if (c <= d) {
            return;
          }
          b.splice(b.indexOf(e), 1);
          a.fastupdate && (c = a.reg.get(e)) && c.splice(c.indexOf(b), 1);
          break;
        }
      }
    }
    k = k[d] || (k[d] = []);
    k.push(e);
    if (k.length === 2147483647) {
      b = new Va(k);
      if (a.fastupdate) {
        for (c = D(a.reg.values()), f = c.next(); !f.done; f = c.next()) {
          f = f.value, f.includes(k) && (f[f.indexOf(k)] = b);
        }
      }
      h[d] = k = b;
    }
    a.fastupdate && ((d = a.reg.get(e)) ? d.push(k) : a.reg.set(e, [k]));
  }
}
function Vb(a, b, c, d, e) {
  return c && a > 1 ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;db.prototype.search = function(a, b, c) {
  c || (b || typeof a !== "object" ? typeof b === "object" && (c = b, b = 0) : (c = a, a = ""));
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
    var p = this.db && c.tag;
  }
  typeof f === "undefined" && (f = this.resolve);
  g = this.depth && g !== !1;
  var n = this.encoder.encode(a, !g);
  var q = n.length;
  b = b || (f ? 100 : 0);
  if (q === 1) {
    return Xb.call(this, n[0], "", b, e, f, k, p);
  }
  if (q === 2 && g && !h) {
    return Xb.call(this, n[1], n[0], b, e, f, k, p);
  }
  var t = S(), u = 0;
  if (g) {
    var v = n[0];
    u = 1;
  }
  m || m === 0 || (m = v ? this.ba : this.resolution);
  if (this.db) {
    if (this.db.search && (c = this.db.search(this, n, b, e, h, f, k, p), c !== !1)) {
      return c;
    }
    var B = this;
    return function() {
      var y, A;
      return wa(function(C) {
        switch(C.h) {
          case 1:
            A = y = void 0;
          case 2:
            if (!(u < q)) {
              C.h = 4;
              break;
            }
            A = n[u];
            if (!A || t[A]) {
              C.h = 5;
              break;
            }
            t[A] = 1;
            return K(C, Yb(B, A, v, 0, 0, !1, !1), 6);
          case 6:
            y = C.B;
            if (y = Zb(y, d, h, m)) {
              d = y;
              C.h = 4;
              break;
            }
            v && (h && y && d.length || (v = A));
          case 5:
            h && v && u === q - 1 && !d.length && (m = B.resolution, v = "", u = -1, t = S());
            u++;
            C.h = 2;
            break;
          case 4:
            return C.return($b(d, m, b, e, h, l, f));
        }
      });
    }();
  }
  for (a = c = void 0; u < q; u++) {
    if ((a = n[u]) && !t[a]) {
      t[a] = 1;
      c = Yb(this, a, v, 0, 0, !1, !1);
      if (c = Zb(c, d, h, m)) {
        d = c;
        break;
      }
      v && (h && c && d.length || (v = a));
    }
    h && v && u === q - 1 && !d.length && (m = this.resolution, v = "", u = -1, t = S());
  }
  return $b(d, m, b, e, h, l, f);
};
function $b(a, b, c, d, e, f, g) {
  var h = a.length, k = a;
  if (h > 1) {
    k = zb(a, b, c, d, e, f, g);
  } else if (h === 1) {
    return g ? rb.call(null, a[0], c, d) : new Z(a[0], this);
  }
  return g ? k : new Z(k, this);
}
function Xb(a, b, c, d, e, f, g) {
  a = Yb(this, a, b, c, d, e, f, g);
  return this.db ? a.then(function(h) {
    return e ? h || [] : new Z(h, this);
  }) : a && a.length ? e ? rb.call(this, a, c, d) : new Z(a, this) : e ? [] : new Z([], this);
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
;function db(a, b) {
  if (!this || this.constructor !== db) {
    return new db(a);
  }
  if (a) {
    var c = U(a) ? a : a.preset;
    c && (Ub[c] || console.warn("Preset not found: " + c), a = Object.assign({}, Ub[c], a));
  } else {
    a = {};
  }
  c = a.context;
  var d = c === !0 ? {depth:1} : c || {}, e = U(a.encoder) ? Ta[a.encoder] : a.encode || a.encoder || {};
  this.encoder = e.encode ? e : typeof e === "object" ? new Ja(e) : {encode:e};
  this.resolution = a.resolution || 9;
  this.tokenize = c = (c = a.tokenize) && c !== "default" && c !== "exact" && c || "strict";
  this.depth = c === "strict" && d.depth || 0;
  this.bidirectional = d.bidirectional !== !1;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  d && d.depth && this.tokenize !== "strict" && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new X(c) : new Map();
  this.ctx = c ? new X(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new X(c) : new Map() : c ? new Y(c) : new Set());
  this.ba = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new Ma(c);
  this.resolve = a.resolve !== !1;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.$ = a.commit !== !1;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
w = db.prototype;
w.mount = function(a) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return a.mount(this);
};
w.commit = function() {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.commit(this);
};
w.destroy = function() {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.destroy();
};
function Tb(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a);
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
  Sb(this.map);
  this.depth && Sb(this.ctx);
  return this;
};
w.searchCache = La;
w.export = function(a, b, c, d) {
  c = c === void 0 ? 0 : c;
  d = d === void 0 ? 0 : d;
  switch(d) {
    case 0:
      var e = "reg";
      var f = Ob(this.reg);
      break;
    case 1:
      e = "cfg";
      f = null;
      break;
    case 2:
      e = "map";
      f = Kb(this.map, this.reg.size);
      break;
    case 3:
      e = "ctx";
      f = Mb(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return Qb.call(this, a, b, e, f, c, d);
};
w.import = function(a, b) {
  if (b) {
    switch(typeof b === "string" && (b = JSON.parse(b)), a = a.split("."), a[a.length - 1] === "json" && a.pop(), a.length === 3 && a.shift(), a = a.length > 1 ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Pb(b, this.reg);
        break;
      case "map":
        this.map = Lb(b, this.map);
        break;
      case "ctx":
        this.ctx = Nb(b, this.ctx);
    }
  }
};
w.serialize = function(a) {
  a = a === void 0 ? !0 : a;
  var b = "", c = "", d = "";
  if (this.reg.size) {
    var e;
    c = D(this.reg.keys());
    for (var f = c.next(); !f.done; f = c.next()) {
      f = f.value, e || (e = typeof f), b += (b ? "," : "") + (e === "string" ? '"' + f + '"' : f);
    }
    b = "index.reg=new Set([" + b + "]);";
    c = Rb(this.map, e);
    c = "index.map=new Map([" + c + "]);";
    f = D(this.ctx.entries());
    for (var g = f.next(); !g.done; g = f.next()) {
      var h = g.value;
      g = h[0];
      h = Rb(h[1], e);
      h = "new Map([" + h + "])";
      h = '["' + g + '",' + h + "]";
      d += (d ? "," : "") + h;
    }
    d = "index.ctx=new Map([" + d + "]);";
  }
  return a ? "function inject(index){" + b + c + d + "}" : b + c + d;
};
eb(db.prototype);
var ac = typeof window !== "undefined" && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), bc = ["map", "ctx", "tag", "reg", "cfg"], cc = S();
function dc(a, b) {
  b = b === void 0 ? {} : b;
  if (!this || this.constructor !== dc) {
    return new dc(a, b);
  }
  typeof a === "object" && (b = a, a = a.name);
  a || console.info("Default storage space was used, because a name was not passed.");
  this.id = "flexsearch" + (a ? ":" + a.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "");
  this.field = b.field ? b.field.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "";
  this.type = b.type;
  this.fastupdate = this.support_tag_search = !1;
  this.db = null;
  this.h = {};
}
w = dc.prototype;
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
  cc[a.id] || (cc[a.id] = []);
  cc[a.id].push(a.field);
  var b = ac.open(a.id, 1);
  b.onupgradeneeded = function() {
    for (var c = a.db = this.result, d = 0, e; d < bc.length; d++) {
      e = bc[d];
      for (var f = 0, g; f < cc[a.id].length; f++) {
        g = cc[a.id][f], c.objectStoreNames.contains(e + (e !== "reg" ? g ? ":" + g : "" : "")) || c.createObjectStore(e + (e !== "reg" ? g ? ":" + g : "" : ""));
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
w.close = function() {
  this.db && this.db.close();
  this.db = null;
};
w.destroy = function() {
  var a = ac.deleteDatabase(this.id);
  return ec(a);
};
w.clear = function() {
  for (var a = [], b = 0, c; b < bc.length; b++) {
    c = bc[b];
    for (var d = 0, e; d < cc[this.id].length; d++) {
      e = cc[this.id][d], a.push(c + (c !== "reg" ? e ? ":" + e : "" : ""));
    }
  }
  b = this.db.transaction(a, "readwrite");
  for (c = 0; c < a.length; c++) {
    b.objectStore(a[c]).clear();
  }
  return ec(b);
};
w.get = function(a, b, c, d, e, f) {
  c = c === void 0 ? 0 : c;
  d = d === void 0 ? 0 : d;
  e = e === void 0 ? !0 : e;
  f = f === void 0 ? !1 : f;
  a = this.db.transaction((b ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((b ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(b ? b + ":" + a : a);
  var g = this;
  return ec(a).then(function(h) {
    var k = [];
    if (!h || !h.length) {
      return k;
    }
    if (e) {
      if (!c && !d && h.length === 1) {
        return h[0];
      }
      for (var l = 0, m = void 0; l < h.length; l++) {
        if ((m = h[l]) && m.length) {
          if (d >= m.length) {
            d -= m.length;
          } else {
            for (var p = c ? d + Math.min(m.length - d, c) : m.length, n = d; n < p; n++) {
              k.push(m[n]);
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
w.tag = function(a, b, c, d) {
  b = b === void 0 ? 0 : b;
  c = c === void 0 ? 0 : c;
  d = d === void 0 ? !1 : d;
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
w.enrich = function(a) {
  typeof a !== "object" && (a = [a]);
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
w.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return ec(a).then(function(b) {
    return !!b;
  });
};
w.search = null;
w.info = function() {
};
w.transaction = function(a, b, c) {
  a += a !== "reg" ? this.field ? ":" + this.field : "" : "";
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
w.commit = function(a) {
  var b = this, c, d, e, f;
  return wa(function(g) {
    switch(g.h) {
      case 1:
        c = a.commit_task;
        d = [];
        a.commit_task = [];
        e = 0;
        for (f = void 0; e < c.length; e++) {
          f = c[e], f.del && d.push(f.del);
        }
        if (!d.length) {
          g.h = 2;
          break;
        }
        return K(g, b.remove(d), 2);
      case 2:
        return a.reg.size ? K(g, b.transaction("map", "readwrite", function(h) {
          for (var k = D(a.map), l = k.next(), m = {}; !l.done; m = {N:void 0, W:void 0}, l = k.next()) {
            l = l.value, m.W = l[0], m.N = l[1], m.N.length && (h.get(m.W).onsuccess = function(p) {
              return function() {
                var n = this.result, q;
                if (n && n.length) {
                  for (var t = Math.max(n.length, p.N.length), u = 0, v; u < t; u++) {
                    if ((v = p.N[u]) && v.length) {
                      if ((q = n[u]) && q.length) {
                        for (var B = 0; B < v.length; B++) {
                          q.push(v[B]);
                        }
                      } else {
                        n[u] = v;
                      }
                      q = 1;
                    }
                  }
                } else {
                  n = p.N, q = 1;
                }
                q && h.put(n, p.W);
              };
            }(m));
          }
        }), 4) : g.return();
      case 4:
        return K(g, b.transaction("ctx", "readwrite", function(h) {
          for (var k = D(a.ctx), l = k.next(), m = {}; !l.done; m = {V:void 0}, l = k.next()) {
            l = l.value;
            m.V = l[0];
            l = D(l[1]);
            for (var p = l.next(), n = {}; !p.done; n = {O:void 0, X:void 0}, p = l.next()) {
              p = p.value, n.X = p[0], n.O = p[1], n.O.length && (h.get(m.V + ":" + n.X).onsuccess = function(q, t) {
                return function() {
                  var u = this.result, v;
                  if (u && u.length) {
                    for (var B = Math.max(u.length, q.O.length), y = 0, A; y < B; y++) {
                      if ((A = q.O[y]) && A.length) {
                        if ((v = u[y]) && v.length) {
                          for (var C = 0; C < A.length; C++) {
                            v.push(A[C]);
                          }
                        } else {
                          u[y] = A;
                        }
                        v = 1;
                      }
                    }
                  } else {
                    u = q.O, v = 1;
                  }
                  v && h.put(u, t.V + ":" + q.X);
                };
              }(n, m));
            }
          }
        }), 5);
      case 5:
        if (a.store) {
          return K(g, b.transaction("reg", "readwrite", function(h) {
            for (var k = D(a.store), l = k.next(); !l.done; l = k.next()) {
              var m = l.value;
              l = m[0];
              m = m[1];
              h.put(typeof m === "object" ? JSON.stringify(m) : 1, l);
            }
          }), 7);
        }
        if (a.bypass) {
          g.h = 7;
          break;
        }
        return K(g, b.transaction("reg", "readwrite", function(h) {
          for (var k = D(a.reg.keys()), l = k.next(); !l.done; l = k.next()) {
            h.put(1, l.value);
          }
        }), 7);
      case 7:
        if (!a.tag) {
          g.h = 11;
          break;
        }
        return K(g, b.transaction("tag", "readwrite", function(h) {
          for (var k = D(a.tag), l = k.next(), m = {}; !l.done; m = {S:void 0, Z:void 0}, l = k.next()) {
            l = l.value, m.Z = l[0], m.S = l[1], m.S.length && (h.get(m.Z).onsuccess = function(p) {
              return function() {
                var n = this.result;
                n = n && n.length ? n.concat(p.S) : p.S;
                h.put(n, p.Z);
              };
            }(m));
          }
        }), 11);
      case 11:
        a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear(), g.h = 0;
    }
  });
};
function fc(a, b, c) {
  for (var d = a.value, e, f = 0, g = 0, h; g < d.length; g++) {
    if (h = c ? d : d[g]) {
      for (var k = 0, l; k < b.length; k++) {
        if (l = b[k], l = h.indexOf(l), l >= 0) {
          if (e = 1, h.length > 1) {
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
w.remove = function(a) {
  typeof a !== "object" && (a = [a]);
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
;var hc = {Index:db, Charset:Ta, Encoder:Ja, Document:ob, Worker:lb, Resolver:Z, IndexedDB:dc, Language:{}}, ic = typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : self, jc;
(jc = ic.define) && jc.amd ? jc([], function() {
  return hc;
}) : typeof ic.exports === "object" ? ic.exports = hc : ic.FlexSearch = hc;
}(this||self));
