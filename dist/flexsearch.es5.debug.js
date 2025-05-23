/**!
 * FlexSearch.js v0.8.203 (ES5/Debug)
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
  function b(h) {
    this.A = 0;
    this.B = void 0;
    this.h = [];
    this.K = !1;
    var g = this.C();
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
    if (this.h == null) {
      this.h = [];
      var g = this;
      this.B(function() {
        g.D();
      });
    }
    this.h.push(h);
  };
  var e = ea.setTimeout;
  c.prototype.B = function(h) {
    e(h, 0);
  };
  c.prototype.D = function() {
    for (; this.h && this.h.length;) {
      var h = this.h;
      this.h = [];
      for (var g = 0; g < h.length; ++g) {
        var k = h[g];
        h[g] = null;
        try {
          k();
        } catch (m) {
          this.C(m);
        }
      }
    }
    this.h = null;
  };
  c.prototype.C = function(h) {
    this.B(function() {
      throw h;
    });
  };
  b.prototype.C = function() {
    function h(m) {
      return function(l) {
        k || (k = !0, m.call(g, l));
      };
    }
    var g = this, k = !1;
    return {resolve:h(this.ea), reject:h(this.D)};
  };
  b.prototype.ea = function(h) {
    if (h === this) {
      this.D(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (h instanceof b) {
        this.ga(h);
      } else {
        a: {
          switch(typeof h) {
            case "object":
              var g = h != null;
              break a;
            case "function":
              g = !0;
              break a;
            default:
              g = !1;
          }
        }
        g ? this.da(h) : this.I(h);
      }
    }
  };
  b.prototype.da = function(h) {
    var g = void 0;
    try {
      g = h.then;
    } catch (k) {
      this.D(k);
      return;
    }
    typeof g == "function" ? this.ha(g, h) : this.I(h);
  };
  b.prototype.D = function(h) {
    this.L(2, h);
  };
  b.prototype.I = function(h) {
    this.L(1, h);
  };
  b.prototype.L = function(h, g) {
    if (this.A != 0) {
      throw Error("Cannot settle(" + h + ", " + g + "): Promise already settled in state" + this.A);
    }
    this.A = h;
    this.B = g;
    this.A === 2 && this.fa();
    this.P();
  };
  b.prototype.fa = function() {
    var h = this;
    e(function() {
      if (h.ca()) {
        var g = ea.console;
        typeof g !== "undefined" && g.error(h.B);
      }
    }, 1);
  };
  b.prototype.ca = function() {
    if (this.K) {
      return !1;
    }
    var h = ea.CustomEvent, g = ea.Event, k = ea.dispatchEvent;
    if (typeof k === "undefined") {
      return !0;
    }
    typeof h === "function" ? h = new h("unhandledrejection", {cancelable:!0}) : typeof g === "function" ? h = new g("unhandledrejection", {cancelable:!0}) : (h = ea.document.createEvent("CustomEvent"), h.initCustomEvent("unhandledrejection", !1, !0, h));
    h.promise = this;
    h.reason = this.B;
    return k(h);
  };
  b.prototype.P = function() {
    if (this.h != null) {
      for (var h = 0; h < this.h.length; ++h) {
        f.A(this.h[h]);
      }
      this.h = null;
    }
  };
  var f = new c();
  b.prototype.ga = function(h) {
    var g = this.C();
    h.R(g.resolve, g.reject);
  };
  b.prototype.ha = function(h, g) {
    var k = this.C();
    try {
      h.call(g, k.resolve, k.reject);
    } catch (m) {
      k.reject(m);
    }
  };
  b.prototype.then = function(h, g) {
    function k(n, q) {
      return typeof n == "function" ? function(t) {
        try {
          m(n(t));
        } catch (u) {
          l(u);
        }
      } : q;
    }
    var m, l, p = new b(function(n, q) {
      m = n;
      l = q;
    });
    this.R(k(h, m), k(g, l));
    return p;
  };
  b.prototype.catch = function(h) {
    return this.then(void 0, h);
  };
  b.prototype.R = function(h, g) {
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
    this.h == null ? f.A(k) : this.h.push(k);
    this.K = !0;
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
        d(l.value).R(g, k);
      }
    });
  };
  b.all = function(h) {
    var g = B(h), k = g.next();
    return k.done ? d([]) : new b(function(m, l) {
      function p(t) {
        return function(u) {
          n[t] = u;
          q--;
          q == 0 && m(n);
        };
      }
      var n = [], q = 0;
      do {
        n.push(void 0), q++, d(k.value).R(p(n.length - 1), l), k = g.next();
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
    return m === "object" && k !== null || m === "function";
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
      if (l.get(k) != 2 || l.get(m) != 3) {
        return !1;
      }
      l.delete(k);
      l.set(m, 4);
      return !l.has(k) && l.get(m) == 4;
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
    return g.J = g.next = g.head = g;
  }
  function c(g, k) {
    var m = g[1];
    return xa(function() {
      if (m) {
        for (; m.head != g[1];) {
          m = m.J;
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
    m == "object" || m == "function" ? f.has(k) ? m = f.get(k) : (m = "" + ++h, f.set(k, m)) : m = "p_" + k;
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
    if (!a || typeof a != "function" || !a.prototype.entries || typeof Object.seal != "function") {
      return !1;
    }
    try {
      var g = Object.seal({x:4}), k = new a(B([[g, "s"]]));
      if (k.get(g) != "s" || k.size != 1 || k.get({x:4}) || k.set({x:4}, "t") != k || k.size != 2) {
        return !1;
      }
      var m = k.entries(), l = m.next();
      if (l.done || l.value[0] != g || l.value[1] != "s") {
        return !1;
      }
      l = m.next();
      return l.done || l.value[0].x != 4 || l.value[1] != "t" || !m.next().done ? !1 : !0;
    } catch (p) {
      return !1;
    }
  }()) {
    return a;
  }
  var f = new WeakMap();
  e.prototype.set = function(g, k) {
    g = g === 0 ? 0 : g;
    var m = d(this, g);
    m.list || (m.list = this[0][m.id] = []);
    m.G ? m.G.value = k : (m.G = {next:this[1], J:this[1].J, head:this[1], key:g, value:k}, m.list.push(m.G), this[1].J.next = m.G, this[1].J = m.G, this.size++);
    return this;
  };
  e.prototype.delete = function(g) {
    g = d(this, g);
    return g.G && g.list ? (g.list.splice(g.index, 1), g.list.length || delete this[0][g.id], g.G.J.next = g.G.next, g.G.next.J = g.G.J, g.G.head = null, this.size--, !0) : !1;
  };
  e.prototype.clear = function() {
    this[0] = {};
    this[1] = this[1].J = b();
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
    if (!a || typeof a != "function" || !a.prototype.entries || typeof Object.seal != "function") {
      return !1;
    }
    try {
      var c = Object.seal({x:4}), d = new a(B([c]));
      if (!d.has(c) || d.size != 1 || d.add(c) != d || d.size != 1 || d.add({x:4}) != d || d.size != 2) {
        return !1;
      }
      var e = d.entries(), f = e.next();
      if (f.done || f.value[0] != c || f.value[1] != c) {
        return !1;
      }
      f = e.next();
      return f.done || f.value[0] == c || f.value[0].x != 4 || f.value[1] != f.value[0] ? !1 : e.next().done;
    } catch (h) {
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
  return e === "undefined" ? b : a;
}
function Ba(a, b) {
  return typeof a === "undefined" ? b : a;
}
function S() {
  return Object.create(null);
}
function T(a) {
  return typeof a === "string";
}
function Ca(a) {
  return typeof a === "object";
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
  a = a === void 0 ? {} : a;
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
      this.split = P(this.split, Fa);
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
  this.L = null;
  this.cache && La(this);
  return this;
};
w.addFilter = function(a) {
  typeof a === "function" ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && La(this);
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
  this.cache && La(this);
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
  this.cache && La(this);
  return this;
};
w.addReplacer = function(a, b) {
  if (typeof a === "string") {
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
    if (this.D) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.D = setTimeout(La, 50, this);
    }
  }
  this.normalize && (typeof this.normalize === "function" ? a = this.normalize(a) : a = Ja ? a.normalize("NFKD").replace(Ja, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && a.length > 3 && (a = a.replace(Ha, "$1 $2").replace(Ia, "$1 $2").replace(Ga, "$1 "));
  for (var d = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer), e = [], f = S(), h, g, k = this.split || this.split === "" ? a.split(this.split) : [a], m = 0, l = void 0, p = void 0; m < k.length; m++) {
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
        if (!this.filter || (typeof this.filter === "function" ? this.filter(l) : !this.filter.has(l))) {
          if (this.cache && l.length <= this.I) {
            if (this.D) {
              var n = this.C.get(l);
              if (n || n === "") {
                n && e.push(n);
                continue;
              }
            } else {
              this.D = setTimeout(La, 50, this);
            }
          }
          if (this.stemmer) {
            for (this.L || (this.L = new RegExp("(?!^)(" + this.A + ")$")), n = void 0; n !== l && l.length > 2;) {
              n = l, l = l.replace(this.L, function(z) {
                return c.stemmer.get(z);
              });
            }
          }
          if (l && (this.mapper || this.dedupe && l.length > 1)) {
            n = "";
            for (var q = 0, t = "", u = void 0, v = void 0; q < l.length; q++) {
              u = l.charAt(q), u === t && this.dedupe || ((v = this.mapper && this.mapper.get(u)) || v === "" ? v === t && this.dedupe || !(t = v) || (n += v) : n += t = u);
            }
            l = n;
          }
          this.matcher && l.length > 1 && (this.K || (this.K = new RegExp("(" + this.h + ")", "g")), l = l.replace(this.K, function(z) {
            return c.matcher.get(z);
          }));
          if (l && this.replacer) {
            for (n = 0; l && n < this.replacer.length; n += 2) {
              l = l.replace(this.replacer[n], this.replacer[n + 1]);
            }
          }
          this.cache && p.length <= this.I && (this.C.set(p, l), this.C.size > this.P && (this.C.clear(), this.I = this.I / 1.1 | 0));
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
  this.cache && a.length <= this.H && (this.B.set(a, e), this.B.size > this.P && (this.B.clear(), this.H = this.H / 1.1 | 0));
  return e;
};
function La(a) {
  a.D = null;
  a.B.clear();
  a.C.clear();
}
;function Ma(a, b, c) {
  c || (b || typeof a !== "object" ? typeof b === "object" && (c = b, b = 0) : c = a);
  c && (a = c.query || a, b = c.limit || b);
  var d = "" + (b || 0);
  if (c) {
    var e = c;
    d += (e.offset || 0) + !!e.context + !!e.suggest + (e.resolve !== !1) + (e.resolution || this.resolution) + (e.boost || 0);
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
  this.limit = a && a !== !0 ? a : 1000;
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
    for (var c = a[b], d = c.charAt(0), e = Ta[d], f = 1, h; f < c.length && (h = c.charAt(f), h === "h" || h === "w" || !(h = Ta[h]) || h === e || (d += h, e = h, d.length !== 4)); f++) {
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
        for (var f = 0, h = 0, g, k; h < b.index.length; h++) {
          g = b.index[h];
          k = g.indexOf(e);
          if (k >= 0) {
            return f + k;
          }
          f += g.length;
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
        return Va(b, e || 0, f || b.length, !1);
      };
    }
    if (d === "splice") {
      return function(e, f) {
        return Va(b, e || 0, f || b.length, !0);
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
Wa.prototype.clear = function() {
  this.index.length = 0;
};
Wa.prototype.push = function() {
};
function Xa(a) {
  a = a === void 0 ? 8 : a;
  if (!this || this.constructor !== Xa) {
    return new Xa(a);
  }
  this.index = S();
  this.h = [];
  this.size = 0;
  a > 32 ? (this.A = Ya, this.B = BigInt(a)) : (this.A = Za, this.B = a);
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
  a = a === void 0 ? 8 : a;
  if (!this || this.constructor !== X) {
    return new X(a);
  }
  this.index = S();
  this.h = [];
  this.size = 0;
  a > 32 ? (this.A = Ya, this.B = BigInt(a)) : (this.A = Za, this.B = a);
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
  if (typeof a == "number") {
    return a & b;
  }
  for (var c = 0, d = this.B + 1, e = 0; e < a.length; e++) {
    c = (c * d ^ a.charCodeAt(e)) & b;
  }
  return this.B === 32 ? c + 2147483648 : c;
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
        if (b === "export") {
          if (!db.export || typeof db.export !== "function") {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
          }
          d[1] ? (d[0] = db.export, d[2] = 0, d[3] = 1) : d = null;
        }
        if (b === "import") {
          if (!db.import || typeof db.import !== "function") {
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
        b === "search" && f.result && (f = f.result);
        g.h = 5;
        break;
      case 11:
        h = g.B, cb.import(d[0], h);
      case 5:
        postMessage(b === "search" ? {id:c, msg:f} : {id:c}), g.h = 0;
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
    if (typeof c === "function") {
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
          lb > 1e9 && (lb = 0);
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
  a = a === void 0 ? {} : a;
  if (!this || this.constructor !== mb) {
    return new mb(a);
  }
  var d = typeof self !== "undefined" ? self._factory : typeof window !== "undefined" ? window._factory : null;
  d && (d = d.toString());
  var e = typeof window === "undefined", f = this, h = nb(d, e, a.worker);
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
    if (typeof d === "function") {
      var e = d;
      c.pop();
    }
    d = new Promise(function(f) {
      a === "export" && typeof c[0] === "function" && (c[0] = null);
      lb > 1e9 && (lb = 0);
      b.h[++lb] = f;
      b.worker.postMessage({task:a, id:lb, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function nb(a, b, c) {
  return b ? typeof module !== "undefined" ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + eb.toString()], {type:"text/javascript"}))) : new window.Worker(typeof c === "string" ? c : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;pb.prototype.add = function(a, b, c) {
  Ca(a) && (b = a, a = Ea(b, this.key));
  if (b && (a || a === 0)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (var d = 0, e; d < this.field.length; d++) {
      e = this.B[d];
      var f = this.index.get(this.field[d]);
      if (typeof e === "function") {
        (e = e(b)) && f.add(a, e, !1, !0);
      } else {
        var h = e.O;
        if (!h || h(b)) {
          e.constructor === String ? e = ["" + e] : T(e) && (e = [e]), qb(b, e, this.C, 0, f, a, e[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.A.length; d++) {
        h = this.A[d];
        var g = this.D[d];
        f = this.tag.get(g);
        e = S();
        if (typeof h === "function") {
          if (h = h(b), !h) {
            continue;
          }
        } else {
          var k = h.O;
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
                if (k.length === 2147483647) {
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
      if (this.h) {
        var q = S();
        for (c = 0; c < this.h.length; c++) {
          if (d = this.h[c], f = d.O, !f || f(b)) {
            f = void 0;
            if (typeof d === "function") {
              f = d(b);
              if (!f) {
                continue;
              }
              d = [d.ia];
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
  if (a.length === 1) {
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
  e = e.length > 1 ? [].concat.apply([], e) : e[0];
  return d ? tb.call(this, e) : e;
}
;function ub(a, b, c, d) {
  var e = d[0];
  if (e[0] && e[0].query) {
    return a[b].apply(a, e);
  }
  if (!(b !== "and" && b !== "not" || a.result.length || a.await || e.suggest)) {
    return d.length > 1 && (e = d[d.length - 1]), (d = e.resolve) ? a.await || a.result : a;
  }
  var f = [], h = 0, g = 0, k, m;
  b = {};
  for (e = 0; e < d.length; b = {X:void 0, W:void 0, Y:void 0, aa:void 0}, e++) {
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
        b.Y = l.async || p;
        var t = l.index;
        t ? a.index || (a.index = t) : t = a.index;
        if (l.query || l.tag) {
          if (!t) {
            throw Error("Resolver can't apply because the corresponding Index was never specified");
          }
          var u = l.field || l.pluck;
          if (u) {
            l.query && (a.query = l.query, a.field = u);
            if (!t.index) {
              throw Error("Resolver can't apply because the corresponding Document Index was not specified");
            }
            t = t.index.get(u);
            if (!t) {
              throw Error("Resolver can't apply because the specified Document Field '" + u + "' was not found");
            }
          }
          if (p && (v || a.await)) {
            var v = 1;
            b.X = void 0;
            b.aa = a.F.length;
            b.W = new Promise(function(x) {
              return function(C) {
                x.X = C;
              };
            }(b));
            (function(x) {
              return function(C, D) {
                x.W.H = function() {
                  D.index = null;
                  D.resolve = !1;
                  var r = x.Y ? C.searchAsync(D) : C.search(D);
                  if (r.then) {
                    return r.then(function(y) {
                      a.F[x.aa] = y = y.result || y;
                      (0,x.X)(y);
                      return y;
                    });
                  }
                  r = r.result || r;
                  (0,x.X)(r);
                  return r;
                };
              };
            })(b)(t, Object.assign({}, l));
            a.F.push(b.W);
            f[e] = b.W;
            continue;
          } else {
            l.resolve = !1, l.index = null, p = b.Y ? t.searchAsync(l) : t.search(l), l.resolve = k, l.index = t;
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
      p.await ? (v = 1, p = p.await) : p.then ? (v = 1, p = p.then(function(x) {
        return x.result || x;
      })) : p = p.result || p;
      f[e] = p;
    }
  }
  v && !a.await && (a.await = new Promise(function(x) {
    a.return = x;
  }));
  if (v) {
    var z = Promise.all(f).then(function(x) {
      for (var C = 0; C < a.F.length; C++) {
        if (a.F[C] === z) {
          a.F[C] = function() {
            return c.call(a, x, h, g, q, k, n, m);
          };
          break;
        }
      }
      wb(a);
    });
    a.F.push(z);
  } else if (a.await) {
    a.F.push(function() {
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
  a.length > 1 && (c = c[b].apply(c, a.slice(1)));
  return c;
}
;Z.prototype.or = function() {
  return ub(this, "or", xb, arguments);
};
function xb(a, b, c, d, e, f, h) {
  a.length && (this.result.length && a.push(this.result), a.length < 2 ? this.result = a[0] : (this.result = yb(a, b, c, !1, this.h), c = 0));
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
    if (this.result.length && a.unshift(this.result), a.length < 2) {
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
    if (this.result.length && a.unshift(this.result), a.length < 2) {
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
                for (var u = 0, v; u < t.length; u++) {
                  v = t[u], m[v] = m[v] ? 2 : 1;
                }
              }
            }
          }
        }
        for (n = p = 0; p < l; p++) {
          for (q = 0; q < a.length; q++) {
            if (t = a[q]) {
              if (t = t[p]) {
                for (u = 0; u < t.length; u++) {
                  if (v = t[u], m[v] === 1) {
                    if (f) {
                      f--;
                    } else {
                      if (e) {
                        if (k.push(v), k.length === b) {
                          a = k;
                          break a;
                        }
                      } else {
                        var z = p + (q ? g : 0);
                        k[z] || (k[z] = []);
                        k[z].push(v);
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
  if (typeof e === "string") {
    var f = e;
    e = "";
  } else {
    f = e.template;
  }
  if (!f) {
    throw Error('No template pattern was specified by the search option "highlight"');
  }
  var h = f.indexOf("$1");
  if (h === -1) {
    throw Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + f);
  }
  var g = f.substring(h + 2);
  h = f.substring(0, h);
  var k = e && e.boundary, m = !e || e.clip !== !1, l = e && e.merge && g && h && new RegExp(g + " " + h, "g");
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
  for (var u, v = 0, z, x; v < b.length; v++) {
    if (d) {
      var C = b;
      x = d;
    } else {
      C = b[v];
      x = C.field;
      if (!x) {
        continue;
      }
      C = C.result;
    }
    u = c.get(x);
    z = u.encoder;
    u = p.get(z);
    typeof u !== "string" && (u = z.encode(a), p.set(z, u));
    for (var D = 0; D < C.length; D++) {
      var r = C[D].doc;
      if (r && (r = Ea(r, x))) {
        var y = r.trim().split(/\s+/);
        if (y.length) {
          r = "";
          for (var F = [], U = [], G = -1, N = -1, Q = 0, E = 0; E < y.length; E++) {
            var R = y[E], W = z.encode(R);
            W = W.length > 1 ? W.join(" ") : W[0];
            var O = void 0;
            if (W && R) {
              for (var L = R.length, M = (z.split ? R.replace(z.split, "") : R).length - W.length, ba = "", oa = 0, A = 0; A < u.length; A++) {
                var I = u[A];
                if (I) {
                  var J = I.length;
                  J += M;
                  oa && J <= oa || (I = W.indexOf(I), I > -1 && (ba = (I ? R.substring(0, I) : "") + h + R.substring(I, I + J) + g + (I + J < L ? R.substring(I + J) : ""), oa = J, O = !0));
                }
              }
              ba && (k && (G < 0 && (G = r.length + (r ? 1 : 0)), N = r.length + (r ? 1 : 0) + ba.length, Q += L, U.push(F.length), F.push({match:ba})), r += (r ? " " : "") + ba);
            }
            if (!O) {
              R = y[E], r += (r ? " " : "") + R, k && F.push({text:R});
            } else if (k && Q >= k) {
              break;
            }
          }
          Q = U.length * (f.length - 2);
          if (q || t || k && r.length - Q > k) {
            if (Q = k + Q - n * 2, E = N - G, q > 0 && (E += q), t > 0 && (E += t), E <= Q) {
              y = q ? G - (q > 0 ? q : 0) : G - ((Q - E) / 2 | 0), F = t ? N + (t > 0 ? t : 0) : y + Q, m || (y > 0 && r.charAt(y) !== " " && r.charAt(y - 1) !== " " && (y = r.indexOf(" ", y), y < 0 && (y = 0)), F < r.length && r.charAt(F - 1) !== " " && r.charAt(F) !== " " && (F = r.lastIndexOf(" ", F), F < N ? F = N : ++F)), r = (y ? e : "") + r.substring(y, F) + (F < r.length ? e : "");
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
                        if (V > 0) {
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
                        I = k - O - 1, I > 0 && (r = " " + r.substring(0, I), N[A] += r), E[A + 1] = 1;
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
                      if (J <= 0) {
                        if (J < 0) {
                          E[A] = 1;
                          G[A] = 1;
                          continue;
                        }
                        O -= n;
                      }
                      r = F[J].text;
                      if (V = q && R[A]) {
                        if (V > 0) {
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
                        I = r.length + 1 - (k - O), I >= 0 && I < r.length && (r = r.substring(I) + " ", N[A] = r + N[A]), E[A] = 1;
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
      k.F[0] = k.result = p.result || p;
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
  this.F = m || [];
  this.await = l || null;
  this.return = e || null;
  this.query = d || "";
  this.field = h || "";
}
w = Z.prototype;
w.limit = function(a) {
  if (this.await) {
    var b = this;
    this.F.push(function() {
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
    this.F.push(function() {
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
    this.F.push(function() {
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
  var f = this.await ? wb(this, !0) : this.result;
  if (f.then) {
    var h = this;
    return f.then(function() {
      return h.resolve(a, b, c, d, e);
    });
  }
  f.length && (typeof a === "object" ? (d = a.highlight, c = !!d || a.enrich, b = a.offset, a = a.limit) : c = !!d || c, f = e ? c ? tb.call(this.index, f) : f : sb.call(this.index, f, a || 100, b, c));
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
  this.index = this.result = this.F = this.await = this.return = null;
  this.query = this.field = "";
  d && d(a);
  return a;
};
function Ab(a, b, c, d, e, f, h) {
  var g = a.length, k = [];
  var m = S();
  for (var l = 0, p = void 0, n, q; l < b; l++) {
    for (var t = 0; t < g; t++) {
      var u = a[t];
      if (l < u.length && (p = u[l])) {
        for (var v = 0; v < p.length; v++) {
          n = p[v];
          (u = m[n]) ? m[n]++ : (u = 0, m[n] = 1);
          q = k[u] || (k[u] = []);
          if (!h) {
            var z = l + (t || !e ? 0 : f || 0);
            q = q[z] || (q[z] = []);
          }
          q.push(n);
          if (h && c && u === g - 1 && q.length - d === c) {
            return d ? q.slice(d) : q;
          }
        }
      }
    }
  }
  if (a = k.length) {
    if (e) {
      k = k.length > 1 ? yb(k, c, d, h, f) : (k = k[0]) && c && k.length > c || d ? k.slice(d, c + d) : k;
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
    for (e = g - 1; e >= 0; e--) {
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
    for (var l = g - 1, p, n = 0; l >= 0; l--) {
      p = a[l];
      for (var q = 0; q < p.length; q++) {
        if (k = (d = p[q]) && d.length) {
          for (var t = 0; t < k; t++) {
            if (m = d[t], !h[m]) {
              if (h[m] = 1, c) {
                c--;
              } else {
                var u = (q + (l < g - 1 ? e || 0 : 0)) / (l + 1) | 0;
                (f[u] || (f[u] = [])).push(m);
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
    g = c.resolve !== !1;
    var t = c.cache;
    this.store && c.highlight && !g ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && c.enrich && !g && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    var u = g && this.store && c.highlight;
    var v = !!u || g && this.store && c.enrich;
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
              f.push(d = d.db.tag(x[n + 1], b, z, v));
            } else {
              d = Fb.call(this, x[n], x[n + 1], b, z, v);
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
            return g ? e : new Z(e.length > 1 ? Ab(e, 1, 0, 0, q, l) : e[0], N);
          });
        }
        return g ? e : new Z(e.length > 1 ? Ab(e, 1, 0, 0, q, l) : e[0], this);
      }
    }
    if (!g && !k) {
      if (p = p || this.field) {
        T(p) ? k = p : (p.constructor === Array && p.length === 1 && (p = p[0]), k = p.field || p.index);
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
    if (D = p[C], !this.db || !this.tag || this.B[C]) {
      r = void 0;
      T(D) || (r = D, D = r.field, a = r.query || a, b = Ba(r.limit, b), z = Ba(r.offset, z), q = Ba(r.suggest, q), u = g && this.store && Ba(r.highlight, u), v = !!u || g && this.store && Ba(r.enrich, v), t = Ba(r.cache, t));
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
      } else if (p.length === 1) {
        return g ? e : new Z(e, this);
      }
    }
  }
  if (x) {
    if (this.db && n && n.length && !Q) {
      for (v = 0; v < n.length; v += 2) {
        f = this.index.get(n[v]);
        if (!f) {
          if (console.warn("Tag '" + n[v] + ":" + n[v + 1] + "' was not found because there is no field '" + n[v] + "'."), q) {
            continue;
          } else {
            return g ? e : new Z(e, this);
          }
        }
        x.push(f.db.tag(n[v + 1], b, z, !1));
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
  if (k && (!v || !this.store)) {
    return e = e[0], g ? e : new Z(e, this);
  }
  x = [];
  for (z = 0; z < f.length; z++) {
    n = e[z];
    v && n.length && typeof n[0].doc === "undefined" && (this.db ? x.push(n = this.index.get(this.field[0]).db.enrich(n)) : n = tb.call(this, n));
    if (k) {
      return g ? u ? Db(a, n, this.index, k, u) : n : new Z(n, this);
    }
    e[z] = {field:f[z], result:n};
  }
  if (v && this.db && x.length) {
    var O = this;
    return Promise.all(x).then(function(L) {
      for (var M = 0; M < L.length; M++) {
        e[M].result = L[M];
      }
      u && (e = Db(a, e, O.index, k, u));
      return m ? Gb(e) : e;
    });
  }
  u && (e = Db(a, e, this.index, k, u));
  return m ? Gb(e) : e;
};
function Gb(a) {
  for (var b = [], c = S(), d = S(), e = 0, f, h, g = void 0, k, m, l; e < a.length; e++) {
    f = a[e];
    h = f.field;
    f = f.result;
    for (var p = 0; p < f.length; p++) {
      if (k = f[p], typeof k !== "object" ? k = {id:g = k} : g = k.id, (m = c[g]) ? m.push(h) : (k.field = c[g] = [h], b.push(k)), l = k.highlight) {
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
  if (b > 0) {
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
  this.B = [];
  this.field = [];
  this.C = [];
  this.key = (c = b.key || b.id) && Hb(c, this.C) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? d ? new X(d) : new Set() : d ? new Xa(d) : new Map();
  this.h = (c = b.store || null) && c && c !== !0 && [];
  this.store = c ? d ? new Xa(d) : new Map() : null;
  this.cache = (c = a.cache || null) && new Na(c);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = Ib.call(this, a, b);
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
        d.custom ? this.A[b] = d.custom : (this.A[b] = Hb(e, this.C), d.filter && (typeof this.A[b] === "string" && (this.A[b] = new String(this.A[b])), this.A[b].O = d.filter));
        this.D[b] = e;
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
    for (var c = 0, d = void 0; c < this.D.length; c++) {
      d = this.D[c];
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
    if (g.h == 1) {
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
      var g = (g = h.encoder) && g.encode ? g : new Ka(typeof g === "string" ? Ua[g] : g || {});
      g = new mb(h, g);
      c.set(f, g);
    }
    this.worker || c.set(f, new Y(h, this.reg));
    h.custom ? this.B[e] = h.custom : (this.B[e] = Hb(f, this.C), h.filter && (typeof this.B[e] === "string" && (this.B[e] = new String(this.B[e])), this.B[e].O = h.filter));
    this.field[e] = f;
  }
  if (this.h) {
    for (a = b.store, T(a) && (a = [a]), b = 0; b < a.length; b++) {
      d = a[b], e = d.field || d, d.custom ? (this.h[b] = d.custom, d.custom.ia = e) : (this.h[b] = Hb(e, this.C), d.filter && (typeof this.h[b] === "string" && (this.h[b] = new String(this.h[b])), this.h[b].O = d.filter));
    }
  }
  return c;
}
function Hb(a, b) {
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
          h > -1 && (f.length > 1 ? f.splice(h, 1) : c.delete(e));
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
  typeof a === "object" && (b = a, a = Ea(b, this.key));
  this.store.set(a, b);
  return this;
};
w.searchCache = Ma;
w.export = Jb;
w.import = Kb;
fb(pb.prototype);
function Lb(a, b) {
  b = b === void 0 ? 0 : b;
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
  b = b === void 0 ? 0 : b;
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
    c.push(d.value), c.length === 250000 && (b.push(c), c = []);
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
  h = h === void 0 ? 0 : h;
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
  return Rb.call(this, a, b, h, g || null, c, d);
}
function Kb(a, b) {
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
        k += (k ? "," : "") + (b === "string" ? '"' + g[m] + '"' : g[m]);
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
            h >= 0 && e.splice(h, 1);
          }
        }
      }
    } else {
      Tb(this.map, a), this.depth && Tb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.$ && Ub(this));
  this.cache && this.cache.remove(a);
  return this;
};
function Tb(a, b) {
  var c = 0, d = typeof b === "undefined";
  if (a.constructor === Array) {
    for (var e = 0, f = void 0, h, g = void 0; e < a.length; e++) {
      if ((f = a[e]) && f.length) {
        if (d) {
          return 1;
        }
        h = f.indexOf(b);
        if (h >= 0) {
          if (f.length > 1) {
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
  if (b && (a || a === 0)) {
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
            case "tolerant":
              Xb(this, h, m, p, a, c);
              if (l > 2) {
                for (var q = 1, t, u; q < l - 1; q++) {
                  n = m.charAt(q), t = m.charAt(q + 1), t = m.substring(0, q) + t, u = m.substring(q + 2), n = t + n + u, h[n] || Xb(this, h, n, p, a, c), n = t + u, h[n] || Xb(this, h, n, p, a, c);
                }
              }
              break;
            case "full":
              if (l > 2) {
                for (p = 0; p < l; p++) {
                  for (q = l; q > p; q--) {
                    n = m.substring(p, q), h[n] || (t = this.rtl ? l - 1 - p : p, t = this.score ? this.score(b, m, k, n, t) : Wb(g, e, k, l, t), Xb(this, h, n, t, a, c));
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (l > 1) {
                for (q = l - 1; q > 0; q--) {
                  n = m[this.rtl ? l - 1 - q : q] + n, h[n] || (t = this.score ? this.score(b, m, k, n, q) : Wb(g, e, k, l, q), Xb(this, h, n, t, a, c));
                }
                n = "";
              }
            case "forward":
              if (l > 1) {
                for (q = 0; q < l; q++) {
                  n += m[this.rtl ? l - 1 - q : q], h[n] || Xb(this, h, n, p, a, c);
                }
                break;
              }
            default:
              if (Xb(this, h, m, p, a, c), d && e > 1 && k < e - 1) {
                for (l = S(), n = this.ba, p = m, q = Math.min(d + 1, this.rtl ? k + 1 : e - k), t = l[p] = 1; t < q; t++) {
                  if ((m = b[this.rtl ? e - 1 - k - t : k + t]) && !l[m]) {
                    l[m] = 1;
                    u = this.score ? this.score(b, p, k, m, t - 1) : Wb(n + (e / 2 > n ? 0 : 1), e, k, q - 1, t - 1);
                    var v = this.bidirectional && m > p;
                    Xb(this, f, v ? p : m, u, a, c, v ? m : p);
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
  this.db && (b || this.commit_task.push({del:a}), this.$ && Ub(this));
  return this;
};
function Xb(a, b, c, d, e, f, h) {
  var g = h ? a.ctx : a.map, k;
  if (!b[c] || h && !(k = b[c])[h]) {
    if (h ? (b = k || (b[c] = S()), b[h] = 1, (k = g.get(h)) ? g = k : g.set(h, g = new Map())) : b[c] = 1, (k = g.get(c)) ? g = k : g.set(c, g = k = []), g = g[d] || (g[d] = []), !f || !g.includes(e)) {
      if (g.length === 2147483647) {
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
  return c && a > 1 ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;Y.prototype.search = function(a, b, c) {
  c || (b || typeof a !== "object" ? typeof b === "object" && (c = b, b = 0) : (c = a, a = ""));
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
  typeof f === "undefined" && (f = this.resolve);
  h = this.depth && h !== !1;
  var n = this.encoder.encode(a, !h);
  var q = n.length;
  b = b || (f ? 100 : 0);
  if (q === 1) {
    return Yb.call(this, n[0], "", b, e, f, k, p);
  }
  if (q === 2 && h && !g) {
    return Yb.call(this, n[1], n[0], b, e, f, k, p);
  }
  var t = S(), u = 0;
  if (h) {
    var v = n[0];
    u = 1;
  }
  l || l === 0 || (l = v ? this.ba : this.resolution);
  if (this.db) {
    if (this.db.search && (c = this.db.search(this, n, b, e, g, f, k, p), c !== !1)) {
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
            if (!(u < q)) {
              D.h = 4;
              break;
            }
            C = n[u];
            if (!C || t[C]) {
              D.h = 5;
              break;
            }
            t[C] = 1;
            return K(D, Zb(z, C, v, 0, 0, !1, !1), 6);
          case 6:
            x = D.B;
            if (x = $b(x, d, g, l)) {
              d = x;
              D.h = 4;
              break;
            }
            v && (g && x && d.length || (v = C));
          case 5:
            g && v && u === q - 1 && !d.length && (l = z.resolution, v = "", u = -1, t = S());
            u++;
            D.h = 2;
            break;
          case 4:
            return D.return(ac(d, l, b, e, g, m, f));
        }
      });
    }();
  }
  for (a = c = void 0; u < q; u++) {
    if ((a = n[u]) && !t[a]) {
      t[a] = 1;
      c = Zb(this, a, v, 0, 0, !1, !1);
      if (c = $b(c, d, g, l)) {
        d = c;
        break;
      }
      v && (g && c && d.length || (v = a));
    }
    g && v && u === q - 1 && !d.length && (l = this.resolution, v = "", u = -1, t = S());
  }
  return ac(d, l, b, e, g, m, f);
};
function ac(a, b, c, d, e, f, h) {
  var g = a.length, k = a;
  if (g > 1) {
    k = Ab(a, b, c, d, e, f, h);
  } else if (g === 1) {
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
  var d = c === !0 ? {depth:1} : c || {}, e = T(a.encoder) ? Ua[a.encoder] : a.encode || a.encoder || {};
  this.encoder = e.encode ? e : typeof e === "object" ? new Ka(e) : {encode:e};
  this.resolution = a.resolution || 9;
  this.tokenize = c = (c = a.tokenize) && c !== "default" && c !== "exact" && c || "strict";
  this.depth = c === "strict" && d.depth || 0;
  this.bidirectional = d.bidirectional !== !1;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  d && d.depth && this.tokenize !== "strict" && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new Xa(c) : new Map();
  this.ctx = c ? new Xa(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new Xa(c) : new Map() : c ? new X(c) : new Set());
  this.ba = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new Na(c);
  this.resolve = a.resolve !== !1;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.$ = a.commit !== !1;
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
  c = c === void 0 ? 0 : c;
  d = d === void 0 ? 0 : d;
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
    switch(typeof b === "string" && (b = JSON.parse(b)), a = a.split("."), a[a.length - 1] === "json" && a.pop(), a.length === 3 && a.shift(), a = a.length > 1 ? a[1] : a[0], a) {
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
  a = a === void 0 ? !0 : a;
  var b = "", c = "", d = "";
  if (this.reg.size) {
    var e;
    c = B(this.reg.keys());
    for (var f = c.next(); !f.done; f = c.next()) {
      f = f.value, e || (e = typeof f), b += (b ? "," : "") + (e === "string" ? '"' + f + '"' : f);
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
var bc = typeof window !== "undefined" && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), cc = ["map", "ctx", "tag", "reg", "cfg"], dc = S();
function ec(a, b) {
  b = b === void 0 ? {} : b;
  if (!this || this.constructor !== ec) {
    return new ec(a, b);
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
        h = dc[a.id][f], c.objectStoreNames.contains(e + (e !== "reg" ? h ? ":" + h : "" : "")) || c.createObjectStore(e + (e !== "reg" ? h ? ":" + h : "" : ""));
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
      e = dc[this.id][d], a.push(c + (c !== "reg" ? e ? ":" + e : "" : ""));
    }
  }
  b = this.db.transaction(a, "readwrite");
  for (c = 0; c < a.length; c++) {
    b.objectStore(a[c]).clear();
  }
  return fc(b);
};
w.get = function(a, b, c, d, e, f) {
  c = c === void 0 ? 0 : c;
  d = d === void 0 ? 0 : d;
  e = e === void 0 ? !0 : e;
  f = f === void 0 ? !1 : f;
  a = this.db.transaction((b ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((b ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(b ? b + ":" + a : a);
  var h = this;
  return fc(a).then(function(g) {
    var k = [];
    if (!g || !g.length) {
      return k;
    }
    if (e) {
      if (!c && !d && g.length === 1) {
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
  b = b === void 0 ? 0 : b;
  c = c === void 0 ? 0 : c;
  d = d === void 0 ? !1 : d;
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
  typeof a !== "object" && (a = [a]);
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
  a += a !== "reg" ? this.field ? ":" + this.field : "" : "";
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
          for (var m = B(a.map), l = m.next(), p = {}; !l.done; p = {M:void 0, U:void 0}, l = m.next()) {
            l = l.value, p.U = l[0], p.M = l[1], p.M.length && (b ? k.put(p.M, p.U) : k.get(p.U).onsuccess = function(n) {
              return function() {
                var q = this.result, t;
                if (q && q.length) {
                  for (var u = Math.max(q.length, n.M.length), v = 0, z; v < u; v++) {
                    if ((z = n.M[v]) && z.length) {
                      if ((t = q[v]) && t.length) {
                        for (var x = 0; x < z.length; x++) {
                          t.push(z[x]);
                        }
                      } else {
                        q[v] = z;
                      }
                      t = 1;
                    }
                  }
                } else {
                  q = n.M, t = 1;
                }
                t && k.put(q, n.U);
              };
            }(p));
          }
        }), 13) : g.return();
      case 13:
        return K(g, d.transaction("ctx", "readwrite", function(k) {
          for (var m = B(a.ctx), l = m.next(), p = {}; !l.done; p = {S:void 0}, l = m.next()) {
            l = l.value;
            p.S = l[0];
            l = B(l[1]);
            for (var n = l.next(), q = {}; !n.done; q = {N:void 0, V:void 0}, n = l.next()) {
              n = n.value, q.V = n[0], q.N = n[1], q.N.length && (b ? k.put(q.N, p.S + ":" + q.V) : k.get(p.S + ":" + q.V).onsuccess = function(t, u) {
                return function() {
                  var v = this.result, z;
                  if (v && v.length) {
                    for (var x = Math.max(v.length, t.N.length), C = 0, D; C < x; C++) {
                      if ((D = t.N[C]) && D.length) {
                        if ((z = v[C]) && z.length) {
                          for (var r = 0; r < D.length; r++) {
                            z.push(D[r]);
                          }
                        } else {
                          v[C] = D;
                        }
                        z = 1;
                      }
                    }
                  } else {
                    v = t.N, z = 1;
                  }
                  z && k.put(v, u.S + ":" + t.V);
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
              k.put(typeof p === "object" ? JSON.stringify(p) : 1, l);
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
          for (var m = B(a.tag), l = m.next(), p = {}; !l.done; p = {T:void 0, Z:void 0}, l = m.next()) {
            l = l.value, p.Z = l[0], p.T = l[1], p.T.length && (k.get(p.Z).onsuccess = function(n) {
              return function() {
                var q = this.result;
                q = q && q.length ? q.concat(n.T) : n.T;
                k.put(q, n.Z);
              };
            }(p));
          }
        }), 20);
      case 20:
        a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear(), g.h = 0;
    }
  });
};
function hc(a, b, c) {
  for (var d = a.value, e, f = 0, h = 0, g; h < d.length; h++) {
    if (g = c ? d : d[h]) {
      for (var k = 0, m; k < b.length; k++) {
        if (m = b[k], m = g.indexOf(m), m >= 0) {
          if (e = 1, g.length > 1) {
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
  typeof a !== "object" && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && hc(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && hc(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      var c = this.result;
      c && hc(c, a, !0);
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
;var ic = {Index:Y, Charset:Ua, Encoder:Ka, Document:pb, Worker:mb, Resolver:Z, IndexedDB:ec, Language:{}}, jc = typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : self, kc;
(kc = jc.define) && kc.amd ? kc([], function() {
  return ic;
}) : typeof jc.exports === "object" ? jc.exports = ic : jc.FlexSearch = ic;
}(this||self));
