/**!
 * FlexSearch.js v0.8.162 (ES5/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;
var w;
function ba(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
}
function z(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (b) {
    return b.call(a);
  }
  if ("number" == typeof a.length) {
    return {next:ba(a)};
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
function I(a, b) {
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
  fa = ia ? function(a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) {
      throw new TypeError(a + " is not extensible");
    }
    return a;
  } : null;
}
var la = fa;
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
I("Symbol", function(a) {
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
  var d = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_", e = 0;
  return b;
});
I("Symbol.iterator", function(a) {
  if (a) {
    return a;
  }
  a = Symbol("Symbol.iterator");
  for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
    var d = ea[b[c]];
    "function" === typeof d && "function" != typeof d.prototype[a] && ca(d.prototype, a, {configurable:!0, writable:!0, value:function() {
      return ya(ba(this));
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
I("Promise", function(a) {
  function b(g) {
    this.A = 0;
    this.B = void 0;
    this.h = [];
    this.H = !1;
    var k = this.C();
    try {
      g(k.resolve, k.reject);
    } catch (h) {
      k.reject(h);
    }
  }
  function c() {
    this.h = null;
  }
  function d(g) {
    return g instanceof b ? g : new b(function(k) {
      k(g);
    });
  }
  if (a) {
    return a;
  }
  c.prototype.A = function(g) {
    if (null == this.h) {
      this.h = [];
      var k = this;
      this.B(function() {
        k.D();
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
      for (var k = 0; k < g.length; ++k) {
        var h = g[k];
        g[k] = null;
        try {
          h();
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
        h || (h = !0, l.call(k, m));
      };
    }
    var k = this, h = !1;
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
              var k = null != g;
              break a;
            case "function":
              k = !0;
              break a;
            default:
              k = !1;
          }
        }
        k ? this.ea(g) : this.G(g);
      }
    }
  };
  b.prototype.ea = function(g) {
    var k = void 0;
    try {
      k = g.then;
    } catch (h) {
      this.D(h);
      return;
    }
    "function" == typeof k ? this.ia(k, g) : this.G(g);
  };
  b.prototype.D = function(g) {
    this.M(2, g);
  };
  b.prototype.G = function(g) {
    this.M(1, g);
  };
  b.prototype.M = function(g, k) {
    if (0 != this.A) {
      throw Error("Cannot settle(" + g + ", " + k + "): Promise already settled in state" + this.A);
    }
    this.A = g;
    this.B = k;
    2 === this.A && this.ga();
    this.N();
  };
  b.prototype.ga = function() {
    var g = this;
    e(function() {
      if (g.T()) {
        var k = ea.console;
        "undefined" !== typeof k && k.error(g.B);
      }
    }, 1);
  };
  b.prototype.T = function() {
    if (this.H) {
      return !1;
    }
    var g = ea.CustomEvent, k = ea.Event, h = ea.dispatchEvent;
    if ("undefined" === typeof h) {
      return !0;
    }
    "function" === typeof g ? g = new g("unhandledrejection", {cancelable:!0}) : "function" === typeof k ? g = new k("unhandledrejection", {cancelable:!0}) : (g = ea.document.createEvent("CustomEvent"), g.initCustomEvent("unhandledrejection", !1, !0, g));
    g.promise = this;
    g.reason = this.B;
    return h(g);
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
    var k = this.C();
    g.U(k.resolve, k.reject);
  };
  b.prototype.ia = function(g, k) {
    var h = this.C();
    try {
      g.call(k, h.resolve, h.reject);
    } catch (l) {
      h.reject(l);
    }
  };
  b.prototype.then = function(g, k) {
    function h(p, n) {
      return "function" == typeof p ? function(r) {
        try {
          l(p(r));
        } catch (v) {
          m(v);
        }
      } : n;
    }
    var l, m, q = new b(function(p, n) {
      l = p;
      m = n;
    });
    this.U(h(g, l), h(k, m));
    return q;
  };
  b.prototype.catch = function(g) {
    return this.then(void 0, g);
  };
  b.prototype.U = function(g, k) {
    function h() {
      switch(l.A) {
        case 1:
          g(l.B);
          break;
        case 2:
          k(l.B);
          break;
        default:
          throw Error("Unexpected state: " + l.A);
      }
    }
    var l = this;
    null == this.h ? f.A(h) : this.h.push(h);
    this.H = !0;
  };
  b.resolve = d;
  b.reject = function(g) {
    return new b(function(k, h) {
      h(g);
    });
  };
  b.race = function(g) {
    return new b(function(k, h) {
      for (var l = z(g), m = l.next(); !m.done; m = l.next()) {
        d(m.value).U(k, h);
      }
    });
  };
  b.all = function(g) {
    var k = z(g), h = k.next();
    return h.done ? d([]) : new b(function(l, m) {
      function q(r) {
        return function(v) {
          p[r] = v;
          n--;
          0 == n && l(p);
        };
      }
      var p = [], n = 0;
      do {
        p.push(void 0), n++, d(h.value).U(q(p.length - 1), m), h = k.next();
      } while (!h.done);
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
I("Array.prototype.values", function(a) {
  return a ? a : function() {
    return za(this, function(b, c) {
      return c;
    });
  };
});
I("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return za(this, function(b) {
      return b;
    });
  };
});
function Aa(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
}
I("WeakMap", function(a) {
  function b(h) {
    this.h = (k += Math.random() + 1).toString();
    if (h) {
      h = z(h);
      for (var l; !(l = h.next()).done;) {
        l = l.value, this.set(l[0], l[1]);
      }
    }
  }
  function c() {
  }
  function d(h) {
    var l = typeof h;
    return "object" === l && null !== h || "function" === l;
  }
  function e(h) {
    if (!Aa(h, g)) {
      var l = new c();
      ca(h, g, {value:l});
    }
  }
  function f(h) {
    var l = Object[h];
    l && (Object[h] = function(m) {
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
      var h = Object.seal({}), l = Object.seal({}), m = new a([[h, 2], [l, 3]]);
      if (2 != m.get(h) || 3 != m.get(l)) {
        return !1;
      }
      m.delete(h);
      m.set(l, 4);
      return !m.has(h) && 4 == m.get(l);
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
  var k = 0;
  b.prototype.set = function(h, l) {
    if (!d(h)) {
      throw Error("Invalid WeakMap key");
    }
    e(h);
    if (!Aa(h, g)) {
      throw Error("WeakMap key fail: " + h);
    }
    h[g][this.h] = l;
    return this;
  };
  b.prototype.get = function(h) {
    return d(h) && Aa(h, g) ? h[g][this.h] : void 0;
  };
  b.prototype.has = function(h) {
    return d(h) && Aa(h, g) && Aa(h[g], this.h);
  };
  b.prototype.delete = function(h) {
    return d(h) && Aa(h, g) && Aa(h[g], this.h) ? delete h[g][this.h] : !1;
  };
  return b;
});
I("Map", function(a) {
  function b() {
    var k = {};
    return k.J = k.next = k.head = k;
  }
  function c(k, h) {
    var l = k[1];
    return ya(function() {
      if (l) {
        for (; l.head != k[1];) {
          l = l.J;
        }
        for (; l.next != l.head;) {
          return l = l.next, {done:!1, value:h(l)};
        }
        l = null;
      }
      return {done:!0, value:void 0};
    });
  }
  function d(k, h) {
    var l = h && typeof h;
    "object" == l || "function" == l ? f.has(h) ? l = f.get(h) : (l = "" + ++g, f.set(h, l)) : l = "p_" + h;
    var m = k[0][l];
    if (m && Aa(k[0], l)) {
      for (k = 0; k < m.length; k++) {
        var q = m[k];
        if (h !== h && q.key !== q.key || h === q.key) {
          return {id:l, list:m, index:k, F:q};
        }
      }
    }
    return {id:l, list:m, index:-1, F:void 0};
  }
  function e(k) {
    this[0] = {};
    this[1] = b();
    this.size = 0;
    if (k) {
      k = z(k);
      for (var h; !(h = k.next()).done;) {
        h = h.value, this.set(h[0], h[1]);
      }
    }
  }
  if (function() {
    if (!a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) {
      return !1;
    }
    try {
      var k = Object.seal({x:4}), h = new a(z([[k, "s"]]));
      if ("s" != h.get(k) || 1 != h.size || h.get({x:4}) || h.set({x:4}, "t") != h || 2 != h.size) {
        return !1;
      }
      var l = h.entries(), m = l.next();
      if (m.done || m.value[0] != k || "s" != m.value[1]) {
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
  e.prototype.set = function(k, h) {
    k = 0 === k ? 0 : k;
    var l = d(this, k);
    l.list || (l.list = this[0][l.id] = []);
    l.F ? l.F.value = h : (l.F = {next:this[1], J:this[1].J, head:this[1], key:k, value:h}, l.list.push(l.F), this[1].J.next = l.F, this[1].J = l.F, this.size++);
    return this;
  };
  e.prototype.delete = function(k) {
    k = d(this, k);
    return k.F && k.list ? (k.list.splice(k.index, 1), k.list.length || delete this[0][k.id], k.F.J.next = k.F.next, k.F.next.J = k.F.J, k.F.head = null, this.size--, !0) : !1;
  };
  e.prototype.clear = function() {
    this[0] = {};
    this[1] = this[1].J = b();
    this.size = 0;
  };
  e.prototype.has = function(k) {
    return !!d(this, k).F;
  };
  e.prototype.get = function(k) {
    return (k = d(this, k).F) && k.value;
  };
  e.prototype.entries = function() {
    return c(this, function(k) {
      return [k.key, k.value];
    });
  };
  e.prototype.keys = function() {
    return c(this, function(k) {
      return k.key;
    });
  };
  e.prototype.values = function() {
    return c(this, function(k) {
      return k.value;
    });
  };
  e.prototype.forEach = function(k, h) {
    for (var l = this.entries(), m; !(m = l.next()).done;) {
      m = m.value, k.call(h, m[1], m[0], this);
    }
  };
  e.prototype[Symbol.iterator] = e.prototype.entries;
  var g = 0;
  return e;
});
I("Set", function(a) {
  function b(c) {
    this.h = new Map();
    if (c) {
      c = z(c);
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
      var c = Object.seal({x:4}), d = new a(z([c]));
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
I("Array.prototype.entries", function(a) {
  return a ? a : function() {
    return za(this, function(b, c) {
      return [b, c];
    });
  };
});
I("Object.is", function(a) {
  return a ? a : function(b, c) {
    return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
  };
});
I("Array.prototype.includes", function(a) {
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
I("String.prototype.includes", function(a) {
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
I("Array.prototype.flat", function(a) {
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
I("Object.assign", function(a) {
  return a || Ba;
});
I("Promise.prototype.finally", function(a) {
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
function O(a, b, c) {
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
            d = z(a);
            for (e = d.next(); !e.done; e = d.next()) {
              e = e.value, b.set(e[0], e[1]);
            }
            return b;
          }
          if (b === Set) {
            b = new Set(c);
            d = z(a.values());
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
function Q() {
  return Object.create(null);
}
function R(a) {
  return "string" === typeof a;
}
function Ca(a) {
  return "object" === typeof a;
}
function Da(a) {
  var b = [];
  a = z(a.keys());
  for (var c = a.next(); !c.done; c = a.next()) {
    b.push(c.value);
  }
  return b;
}
function Ea(a, b) {
  if (R(b)) {
    a = a[b];
  } else {
    for (var c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function Fa(a) {
  for (var b = 0, c = 0, d = void 0; c < a.length; c++) {
    (d = a[c]) && b < d.length && (b = d.length);
  }
  return b;
}
;var Ga = /[^\p{L}\p{N}]+/u, Ha = /(\d{3})/g, Ia = /(\D)(\d{3})/g, Ja = /(\d{3})(\D)/g, Ka = /[\u0300-\u036f]/g;
function La(a) {
  a = void 0 === a ? {} : a;
  if (!this || this.constructor !== La) {
    var b = Function.prototype.bind, c = b.apply, d = [null], e = d.concat;
    if (arguments instanceof Array) {
      var f = arguments;
    } else {
      f = z(arguments);
      for (var g, k = []; !(g = f.next()).done;) {
        k.push(g.value);
      }
      f = k;
    }
    return new (c.call(b, La, e.call(d, f)))();
  }
  if (arguments.length) {
    for (b = 0; b < arguments.length; b++) {
      this.assign(arguments[b]);
    }
  } else {
    this.assign(a);
  }
}
w = La.prototype;
w.assign = function(a) {
  this.normalize = O(a.normalize, !0, this.normalize);
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
    this.numeric = O(a.numeric, e);
  } else {
    try {
      this.split = O(this.split, Ga);
    } catch (f) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = O(a.numeric, O(this.numeric, !0));
  }
  this.prepare = O(a.prepare, null, this.prepare);
  this.finalize = O(a.finalize, null, this.finalize);
  c = a.filter;
  this.filter = "function" === typeof c ? c : O(c && new Set(c), null, this.filter);
  this.dedupe = O(a.dedupe, !0, this.dedupe);
  this.matcher = O((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = O((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = O((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = O(a.replacer, null, this.replacer);
  this.minlength = O(a.minlength, 1, this.minlength);
  this.maxlength = O(a.maxlength, 1024, this.maxlength);
  this.rtl = O(a.rtl, !1, this.rtl);
  if (this.cache = c = O(a.cache, !0, this.cache)) {
    this.D = null, this.T = "number" === typeof c ? c : 2e5, this.B = new Map(), this.C = new Map(), this.H = this.G = 128;
  }
  this.h = "";
  this.M = null;
  this.A = "";
  this.N = null;
  if (this.matcher) {
    for (a = z(this.matcher.keys()), b = a.next(); !b.done; b = a.next()) {
      this.h += (this.h ? "|" : "") + b.value;
    }
  }
  if (this.stemmer) {
    for (a = z(this.stemmer.keys()), b = a.next(); !b.done; b = a.next()) {
      this.A += (this.A ? "|" : "") + b.value;
    }
  }
  return this;
};
w.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.A += (this.A ? "|" : "") + a;
  this.N = null;
  this.cache && Ma(this);
  return this;
};
w.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && Ma(this);
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
  this.cache && Ma(this);
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
  this.M = null;
  this.cache && Ma(this);
  return this;
};
w.addReplacer = function(a, b) {
  if ("string" === typeof a) {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && Ma(this);
  return this;
};
w.encode = function(a, b) {
  var c = this;
  if (this.cache && a.length <= this.G) {
    if (this.D) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.D = setTimeout(Ma, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = Ka ? a.normalize("NFKD").replace(Ka, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(Ia, "$1 $2").replace(Ja, "$1 $2").replace(Ha, "$1 "));
  for (var d = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer), e = [], f = Q(), g, k, h = this.split || "" === this.split ? a.split(this.split) : [a], l = 0, m = void 0, q = void 0; l < h.length; l++) {
    if ((m = q = h[l]) && !(m.length < this.minlength || m.length > this.maxlength)) {
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
              this.D = setTimeout(Ma, 50, this);
            }
          }
          if (this.stemmer) {
            for (this.N || (this.N = new RegExp("(?!^)(" + this.A + ")$")), p = void 0; p !== m && 2 < m.length;) {
              p = m, m = m.replace(this.N, function(B) {
                return c.stemmer.get(B);
              });
            }
          }
          if (m && (this.mapper || this.dedupe && 1 < m.length)) {
            p = "";
            for (var n = 0, r = "", v = void 0, u = void 0; n < m.length; n++) {
              v = m.charAt(n), v === r && this.dedupe || ((u = this.mapper && this.mapper.get(v)) || "" === u ? u === r && this.dedupe || !(r = u) || (p += u) : p += r = v);
            }
            m = p;
          }
          this.matcher && 1 < m.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), m = m.replace(this.M, function(B) {
            return c.matcher.get(B);
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
                if (k === m) {
                  continue;
                }
                k = m;
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
function Ma(a) {
  a.D = null;
  a.B.clear();
  a.C.clear();
}
;var Na, Oa;
function Pa(a) {
  var b, c, d, e, f, g;
  return xa(function(k) {
    switch(k.h) {
      case 1:
        a = a.data;
        b = a.task;
        c = a.id;
        d = a.args;
        switch(b) {
          case "init":
            Oa = a.options || {};
            (e = a.factory) ? (Function("return " + e)()(self), Na = new self.FlexSearch.Index(Oa), delete self.FlexSearch) : Na = new U(Oa);
            postMessage({id:c});
            break;
          default:
            k.h = 2;
            return;
        }k.h = 0;
        break;
      case 2:
        if ("export" === b) {
          if (!Oa.export || "function" !== typeof Oa.export) {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
          }
          d[1] ? (d[0] = Oa.export, d[2] = 0, d[3] = 1) : d = null;
        }
        if ("import" === b) {
          if (!Oa.import || "function" !== typeof Oa.import) {
            throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
          }
          if (!d[0]) {
            k.h = 5;
            break;
          }
          return L(k, Oa.import.call(Na, d[0]), 9);
        }
        f = d && Na[b].apply(Na, d);
        if (!f || !f.then) {
          k.h = 5;
          break;
        }
        return L(k, f, 7);
      case 7:
        f = k.D;
        k.h = 5;
        break;
      case 9:
        g = k.D, Na.import(d[0], g);
      case 5:
        postMessage("search" === b ? {id:c, msg:f} : {id:c}), k.h = 0;
    }
  });
}
;function Qa(a) {
  Ra.call(a, "add");
  Ra.call(a, "append");
  Ra.call(a, "search");
  Ra.call(a, "update");
  Ra.call(a, "remove");
  Ra.call(a, "searchCache");
}
var Sa, Ta, Ua;
function Va() {
  Sa = Ua = 0;
}
function Ra(a) {
  this[a + "Async"] = function() {
    var b = arguments, c = b[b.length - 1];
    if ("function" === typeof c) {
      var d = c;
      delete b[b.length - 1];
    }
    Sa ? Ua || (Ua = Date.now() - Ta >= this.priority * this.priority * 3) : (Sa = setTimeout(Va, 0), Ta = Date.now());
    if (Ua) {
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
;var Wa = 0;
function Xa(a) {
  function b(g) {
    function k(h) {
      h = h.data || h;
      var l = h.id, m = l && e.h[l];
      m && (m(h.msg), delete e.h[l]);
    }
    this.worker = g;
    this.h = Q();
    if (this.worker) {
      d ? this.worker.on("message", k) : this.worker.onmessage = k;
      if (a.config) {
        return new Promise(function(h) {
          e.h[++Wa] = function() {
            h(e);
            1e9 < Wa && (Wa = 0);
          };
          e.worker.postMessage({id:Wa, task:"init", factory:c, options:a});
        });
      }
      this.worker.postMessage({task:"init", factory:c, options:a});
      this.priority = a.priority || 4;
      return this;
    }
  }
  a = void 0 === a ? {} : a;
  if (!this || this.constructor !== Xa) {
    return new Xa(a);
  }
  var c = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  c && (c = c.toString());
  var d = "undefined" === typeof window, e = this, f = Ya(c, d, a.worker);
  return f.then ? f.then(function(g) {
    return b.call(e, g);
  }) : b.call(this, f);
}
Za("add");
Za("append");
Za("search");
Za("update");
Za("remove");
Za("clear");
Za("export");
Za("import");
Qa(Xa.prototype);
function Za(a) {
  Xa.prototype[a] = function() {
    var b = this, c = [].slice.call(arguments), d = c[c.length - 1];
    if ("function" === typeof d) {
      var e = d;
      c.pop();
    }
    d = new Promise(function(f) {
      "export" === a && "function" === typeof c[0] && (c[0] = null);
      b.h[++Wa] = f;
      b.worker.postMessage({task:a, id:Wa, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function Ya(a, b, c) {
  return b ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + Pa.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof c ? c : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function $a(a, b) {
  b = void 0 === b ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 5000 | 0);
  a = z(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    d.push(e.value), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function ab(a, b) {
  b || (b = new Map());
  for (var c = 0, d; c < a.length; c++) {
    d = a[c], b.set(d[0], d[1]);
  }
  return b;
}
function bb(a, b) {
  b = void 0 === b ? 0 : b;
  var c = [], d = [];
  b && (b = 250000 / b * 1000 | 0);
  a = z(a.entries());
  for (var e = a.next(); !e.done; e = a.next()) {
    e = e.value, d.push([e[0], $a(e[1])[0]]), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function cb(a, b) {
  b || (b = new Map());
  for (var c = 0, d, e; c < a.length; c++) {
    d = a[c], e = b.get(d[0]), b.set(d[0], ab(d[1], e));
  }
  return b;
}
function db(a) {
  var b = [], c = [];
  a = z(a.keys());
  for (var d = a.next(); !d.done; d = a.next()) {
    c.push(d.value), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function eb(a, b) {
  b || (b = new Set());
  for (var c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function fb(a, b, c, d, e, f, g) {
  g = void 0 === g ? 0 : g;
  var k = d && d.constructor === Array, h = k ? d.shift() : d;
  if (!h) {
    return this.export(a, b, e, f + 1);
  }
  if ((h = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(h))) && h.then) {
    var l = this;
    return h.then(function() {
      return fb.call(l, a, b, c, k ? d : null, e, f, g + 1);
    });
  }
  return fb.call(this, a, b, c, k ? d : null, e, f, g + 1);
}
function gb(a, b) {
  var c = "";
  a = z(a.entries());
  for (var d = a.next(); !d.done; d = a.next()) {
    var e = d.value;
    d = e[0];
    e = e[1];
    for (var f = "", g = 0, k; g < e.length; g++) {
      k = e[g] || [""];
      for (var h = "", l = 0; l < k.length; l++) {
        h += (h ? "," : "") + ("string" === b ? '"' + k[l] + '"' : k[l]);
      }
      h = "[" + h + "]";
      f += (f ? "," : "") + h;
    }
    f = '["' + d + '",[' + f + "]]";
    c += (c ? "," : "") + f;
  }
  return c;
}
;function hb(a, b, c, d) {
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
function ib(a) {
  if (!this || this.constructor !== ib) {
    return new ib(a);
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
        for (var f = 0, g = 0, k, h; g < b.index.length; g++) {
          k = b.index[g];
          h = k.indexOf(e);
          if (0 <= h) {
            return f + h;
          }
          f += k.length;
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
        return hb(b, e || 0, f || b.length, !1);
      };
    }
    if ("splice" === d) {
      return function(e, f) {
        return hb(b, e || 0, f || b.length, !0);
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
ib.prototype.clear = function() {
  this.index.length = 0;
};
ib.prototype.destroy = function() {
  this.proxy = this.index = null;
};
ib.prototype.push = function() {
};
function V(a) {
  a = void 0 === a ? 8 : a;
  if (!this || this.constructor !== V) {
    return new V(a);
  }
  this.index = Q();
  this.h = [];
  this.size = 0;
  32 < a ? (this.A = jb, this.B = BigInt(a)) : (this.A = kb, this.B = a);
}
V.prototype.get = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.get(a);
};
V.prototype.set = function(a, b) {
  var c = this.A(a), d = this.index[c];
  d ? (c = d.size, d.set(a, b), (c -= d.size) && this.size++) : (this.index[c] = d = new Map([[a, b]]), this.h.push(d), this.size++);
};
function W(a) {
  a = void 0 === a ? 8 : a;
  if (!this || this.constructor !== W) {
    return new W(a);
  }
  this.index = Q();
  this.h = [];
  this.size = 0;
  32 < a ? (this.A = jb, this.B = BigInt(a)) : (this.A = kb, this.B = a);
}
W.prototype.add = function(a) {
  var b = this.A(a), c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c), this.size++);
};
w = V.prototype;
w.has = W.prototype.has = function(a) {
  var b = this.A(a);
  return (b = this.index[b]) && b.has(a);
};
w.delete = W.prototype.delete = function(a) {
  var b = this.A(a);
  (b = this.index[b]) && b.delete(a) && this.size--;
};
w.clear = W.prototype.clear = function() {
  this.index = Q();
  this.h = [];
  this.size = 0;
};
w.values = W.prototype.values = function lb() {
  var b, c = this, d, e, f;
  return va(lb, function(g) {
    switch(g.h) {
      case 1:
        b = 0;
      case 2:
        if (!(b < c.h.length)) {
          g.h = 0;
          break;
        }
        d = z(c.h[b].values());
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
w.keys = W.prototype.keys = function mb() {
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
        d = z(c.h[b].keys());
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
w.entries = W.prototype.entries = function nb() {
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
        d = z(c.h[b].entries());
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
function kb(a) {
  var b = Math.pow(2, this.B) - 1;
  if ("number" == typeof a) {
    return a & b;
  }
  for (var c = 0, d = this.B + 1, e = 0; e < a.length; e++) {
    c = (c * d ^ a.charCodeAt(e)) & b;
  }
  return 32 === this.B ? c + Math.pow(2, 31) : c;
}
function jb() {
  throw Error("The keystore is limited to 32 for EcmaScript5");
}
;ob.prototype.add = function(a, b, c) {
  Ca(a) && (b = a, a = Ea(b, this.key));
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
          e.constructor === String ? e = ["" + e] : R(e) && (e = [e]), pb(b, e, this.S, 0, f, a, e[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.K.length; d++) {
        g = this.K[d];
        var k = this.aa[d];
        f = this.tag.get(k);
        e = Q();
        if ("function" === typeof g) {
          if (g = g(b), !g) {
            continue;
          }
        } else {
          var h = g.R;
          if (h && !h(b)) {
            continue;
          }
          g.constructor === String && (g = "" + g);
          g = Ea(b, g);
        }
        if (f && g) {
          for (R(g) && (g = [g]), k = 0, h = void 0; k < g.length; k++) {
            var l = g[k];
            if (!e[l]) {
              e[l] = 1;
              var m;
              (m = f.get(l)) ? h = m : f.set(l, h = []);
              if (!c || !h.includes(a)) {
                if (h.length === Math.pow(2, 31) - 1) {
                  m = new ib(h);
                  if (this.fastupdate) {
                    for (var q = z(this.reg.values()), p = q.next(); !p.done; p = q.next()) {
                      p = p.value, p.includes(h) && (p[p.indexOf(h)] = m);
                    }
                  }
                  f.set(l, h = m);
                }
                h.push(a);
                this.fastupdate && ((l = this.reg.get(a)) ? l.push(h) : this.reg.set(a, [h]));
              }
            }
          }
        } else {
          f || console.warn("Tag '" + k + "' was not found");
        }
      }
    }
    if (this.store && (!c || !this.store.has(a))) {
      if (this.I) {
        var n = Q();
        for (c = 0; c < this.I.length; c++) {
          if (d = this.I[c], f = d.R, !f || f(b)) {
            f = void 0;
            if ("function" === typeof d) {
              f = d(b);
              if (!f) {
                continue;
              }
              d = [d.ja];
            } else if (R(d) || d.constructor === String) {
              n[d] = b[d];
              continue;
            }
            qb(b, n, d, 0, d[0], f);
          }
        }
      }
      this.store.set(a, n || b);
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
      b = b[e] || (b[e] = Q()), e = c[++d], qb(a, b, c, d, e);
    }
  }
}
function pb(a, b, c, d, e, f, g, k) {
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
          pb(a, b, c, d, e, f, g, k);
        }
      } else {
        g = b[++d], pb(a, b, c, d, e, f, g, k);
      }
    }
  } else {
    e.db && e.remove(f);
  }
}
;function rb(a, b, c, d, e, f, g) {
  var k = a.length, h = [];
  var l = Q();
  for (var m = 0, q = void 0, p, n; m < b; m++) {
    for (var r = 0; r < k; r++) {
      var v = a[r];
      if (m < v.length && (q = v[m])) {
        for (var u = 0; u < q.length; u++) {
          p = q[u];
          (v = l[p]) ? l[p]++ : (v = 0, l[p] = 1);
          n = h[v] || (h[v] = []);
          if (!g) {
            var B = m + (r || !e ? 0 : f || 0);
            n = n[B] || (n[B] = []);
          }
          n.push(p);
          if (g && c && v === k - 1 && n.length - d === c) {
            return d ? n.slice(d) : n;
          }
        }
      }
    }
  }
  if (a = h.length) {
    if (e) {
      h = 1 < h.length ? sb(h, c, d, g, f) : (h = h[0]).length > c || d ? h.slice(d, c + d) : h;
    } else {
      if (a < k) {
        return [];
      }
      h = h[a - 1];
      if (c || d) {
        if (g) {
          if (h.length > c || d) {
            h = h.slice(d, c + d);
          }
        } else {
          e = [];
          for (f = 0; f < h.length; f++) {
            if (g = h[f], g.length > d) {
              d -= g.length;
            } else {
              if (g.length > c || d) {
                g = g.slice(d, c + d), c -= g.length, d && (d -= g.length);
              }
              e.push(g);
              if (!c) {
                break;
              }
            }
          }
          h = 1 < e.length ? [].concat.apply([], e) : e[0];
        }
      }
    }
  }
  return h;
}
function sb(a, b, c, d, e) {
  var f = [], g = Q(), k = a.length, h;
  if (d) {
    for (e = k - 1; 0 <= e; e--) {
      if (h = (d = a[e]) && d.length) {
        for (k = 0; k < h; k++) {
          var l = d[k];
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
    for (var m = k - 1, q, p = 0; 0 <= m; m--) {
      q = a[m];
      for (var n = 0; n < q.length; n++) {
        if (h = (d = q[n]) && d.length) {
          for (var r = 0; r < h; r++) {
            if (l = d[r], !g[l]) {
              if (g[l] = 1, c) {
                c--;
              } else {
                var v = (n + (m < k - 1 ? e || 0 : 0)) / (m + 1) | 0;
                (f[v] || (f[v] = [])).push(l);
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
function tb(a, b, c) {
  for (var d = Q(), e = [], f = 0, g; f < b.length; f++) {
    g = b[f];
    for (var k = 0; k < g.length; k++) {
      d[g[k]] = 1;
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
;function ub(a, b, c, d) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a, d ? vb.call(this, a) : a;
  }
  for (var e = [], f = 0, g = void 0, k = void 0; f < a.length; f++) {
    if ((g = a[f]) && (k = g.length)) {
      if (c) {
        if (c >= k) {
          c -= k;
          continue;
        }
        c < k && (g = b ? g.slice(c, c + b) : g.slice(c), k = g.length, c = 0);
      }
      k > b && (g = g.slice(0, b), k = b);
      if (!e.length && k >= b) {
        return d ? vb.call(this, g) : g;
      }
      e.push(g);
      b -= k;
      if (!b) {
        break;
      }
    }
  }
  e = 1 < e.length ? [].concat.apply([], e) : e[0];
  return d ? vb.call(this, e) : e;
}
;function wb(a, b, c) {
  var d = c[0];
  if (d.then) {
    return Promise.all(c).then(function(v) {
      return a[b].apply(a, v);
    });
  }
  if (d[0] && d[0].index) {
    return a[b].apply(a, d);
  }
  d = [];
  for (var e = [], f = 0, g = 0, k, h, l, m, q, p = 0, n = void 0; p < c.length; p++) {
    if (n = c[p]) {
      var r = void 0;
      if (n.constructor === X) {
        r = n.result;
      } else if (n.constructor === Array) {
        r = n;
      } else {
        if (f = n.limit || 0, g = n.offset || 0, l = n.suggest, h = n.resolve, k = (m = n.highlight && h) || n.enrich && h, n.index) {
          n.resolve = !1, r = n.index.search(n).result, n.resolve = h, m && (q = n.search);
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
  return {W:d, $:e, limit:f, offset:g, enrich:k, resolve:h, suggest:l, highlight:m, ma:q};
}
;X.prototype.or = function() {
  var a = wb(this, "or", arguments);
  return xb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve);
};
function xb(a, b, c, d, e, f) {
  if (b.length) {
    var g = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (var h = 0, l = void 0; h < k.length; h++) {
        (l = k[h]).length && (a[h] = l);
      }
      return xb.call(g, a, [], c, d, e, f);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = sb(a, c, d, !1, this.h), d = 0));
  return f ? this.resolve(c, d, e) : this;
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
      var f = b.enrich && c;
    }
  }
  return a ? (a = wb(this, "and", arguments), yb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest)) : c ? this.resolve(d, e, f) : this;
};
function yb(a, b, c, d, e, f, g) {
  if (b.length) {
    var k = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (var l = 0, m = void 0; l < h.length; l++) {
        (m = h[l]).length && (a[l] = m);
      }
      return yb.call(k, a, [], c, d, e, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (b = Fa(a)) {
        return this.result = rb(a, b, c, d, g, this.h, f), f ? e ? vb.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, d, e) : this;
}
;X.prototype.xor = function() {
  var a = wb(this, "xor", arguments);
  return zb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest);
};
function zb(a, b, c, d, e, f, g) {
  if (b.length) {
    var k = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (var l = 0, m = void 0; l < h.length; l++) {
        (m = h[l]).length && (a[l] = m);
      }
      return zb.call(k, a, [], c, d, e, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = Ab.call(this, a, c, d, f, this.h), f ? e ? vb.call(this.index, this.result) : this.result : this;
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, d, e) : this;
}
function Ab(a, b, c, d, e) {
  for (var f = [], g = Q(), k = 0, h = 0, l; h < a.length; h++) {
    if (l = a[h]) {
      k < l.length && (k = l.length);
      for (var m = 0, q; m < l.length; m++) {
        if (q = l[m]) {
          for (var p = 0, n; p < q.length; p++) {
            n = q[p], g[n] = g[n] ? 2 : 1;
          }
        }
      }
    }
  }
  for (l = h = 0; h < k; h++) {
    for (m = 0; m < a.length; m++) {
      if (q = a[m]) {
        if (q = q[h]) {
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
                  var r = h + (m ? e : 0);
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
;X.prototype.not = function() {
  var a = wb(this, "not", arguments);
  return Bb.call(this, a.W, a.$, a.limit, a.offset, a.enrich, a.resolve, a.suggest);
};
function Bb(a, b, c, d, e, f, g) {
  if (b.length) {
    var k = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (var l = 0, m = void 0; l < h.length; l++) {
        (m = h[l]).length && (a[l] = m);
      }
      return Bb.call(k, a, [], c, d, e, f, g);
    });
  }
  if (a.length && this.result.length) {
    this.result = Cb.call(this, a, c, d, f);
  } else if (f) {
    return this.resolve(c, d, e);
  }
  return f ? e ? vb.call(this.index, this.result) : this.result : this;
}
function Cb(a, b, c, d) {
  var e = [];
  a = new Set(a.flat().flat());
  for (var f = 0, g, k = 0; f < this.result.length; f++) {
    if (g = this.result[f]) {
      for (var h = 0, l; h < g.length; h++) {
        if (l = g[h], !a.has(l)) {
          if (c) {
            c--;
          } else {
            if (d) {
              if (e.push(l), e.length === b) {
                return e;
              }
            } else {
              if (e[f] || (e[f] = []), e[f].push(l), ++k === b) {
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
  var k = f.substring(g + 2);
  g = f.substring(0, g);
  var h = e && e.boundary, l = !e || !1 !== e.clip, m = e && e.merge && k && g && new RegExp(k + " " + g, "g");
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
  if ("object" === typeof h) {
    var n = h.before;
    0 === n && (n = -1);
    var r = h.after;
    0 === r && (r = -1);
    h = h.total || 9e5;
  }
  q = new Map();
  for (var v, u = 0, B, D; u < b.length; u++) {
    if (d) {
      var x = b;
      D = d;
    } else {
      x = b[u];
      D = x.field;
      if (!D) {
        continue;
      }
      x = x.result;
    }
    v = c.get(D);
    B = v.encoder;
    v = q.get(B);
    "string" !== typeof v && (v = B.encode(a), q.set(B, v));
    for (var A = 0; A < x.length; A++) {
      var t = x[A].doc;
      if (t && (t = Ea(t, D))) {
        var E = t.trim().split(/\s+/);
        if (E.length) {
          t = "";
          for (var C = [], ha = [], G = -1, N = -1, S = 0, F = 0; F < E.length; F++) {
            var J = E[F], M = B.encode(J);
            M = 1 < M.length ? M.join(" ") : M[0];
            var P = void 0;
            if (M && J) {
              for (var Y = J.length, Z = (B.split ? J.replace(B.split, "") : J).length - M.length, aa = "", ma = 0, y = 0; y < v.length; y++) {
                var H = v[y];
                if (H) {
                  var K = H.length;
                  K += Z;
                  ma && K <= ma || (H = M.indexOf(H), -1 < H && (aa = (H ? J.substring(0, H) : "") + g + J.substring(H, H + K) + k + (H + K < Y ? J.substring(H + K) : ""), ma = K, P = !0));
                }
              }
              aa && (h && (0 > G && (G = t.length + (t ? 1 : 0)), N = t.length + (t ? 1 : 0) + aa.length, S += Y, ha.push(C.length), C.push({match:aa})), t += (t ? " " : "") + aa);
            }
            if (!P) {
              J = E[F], t += (t ? " " : "") + J, h && C.push({text:J});
            } else if (h && S >= h) {
              break;
            }
          }
          S = ha.length * (f.length - 2);
          if (n || r || h && t.length - S > h) {
            if (S = h + S - 2 * p, F = N - G, 0 < n && (F += n), 0 < r && (F += r), F <= S) {
              E = n ? G - (0 < n ? n : 0) : G - ((S - F) / 2 | 0), C = r ? N + (0 < r ? r : 0) : E + S, l || (0 < E && " " !== t.charAt(E) && " " !== t.charAt(E - 1) && (E = t.indexOf(" ", E), 0 > E && (E = 0)), C < t.length && " " !== t.charAt(C - 1) && " " !== t.charAt(C) && (C = t.lastIndexOf(" ", C), C < N ? C = N : ++C)), t = (E ? e : "") + t.substring(E, C) + (C < t.length ? e : "");
            } else {
              N = [];
              S = {};
              G = {};
              F = {};
              J = {};
              M = {};
              Z = Y = P = 0;
              for (ma = aa = 1;;) {
                H = void 0;
                for (y = 0; y < ha.length; y++) {
                  K = ha[y];
                  if (Z) {
                    if (Y !== Z) {
                      if (F[y + 1]) {
                        continue;
                      }
                      K += Z;
                      if (S[K]) {
                        P -= p;
                        G[y + 1] = 1;
                        F[y + 1] = 1;
                        continue;
                      }
                      if (K >= C.length - 1) {
                        if (K >= C.length) {
                          F[y + 1] = 1;
                          K >= E.length && (G[y + 1] = 1);
                          continue;
                        }
                        P -= p;
                      }
                      t = C[K].text;
                      var T = r && M[y];
                      if (T) {
                        if (0 < T) {
                          if (t.length > T) {
                            if (F[y + 1] = 1, l) {
                              t = t.substring(0, T);
                            } else {
                              continue;
                            }
                          }
                          (T -= t.length) || (T = -1);
                          M[y] = T;
                        } else {
                          F[y + 1] = 1;
                          continue;
                        }
                      }
                      if (P + t.length + 1 <= h) {
                        t = " " + t, N[y] += t;
                      } else if (l) {
                        H = h - P - 1, 0 < H && (t = " " + t.substring(0, H), N[y] += t), F[y + 1] = 1;
                      } else {
                        F[y + 1] = 1;
                        continue;
                      }
                    } else {
                      if (F[y]) {
                        continue;
                      }
                      K -= Y;
                      if (S[K]) {
                        P -= p;
                        F[y] = 1;
                        G[y] = 1;
                        continue;
                      }
                      if (0 >= K) {
                        if (0 > K) {
                          F[y] = 1;
                          G[y] = 1;
                          continue;
                        }
                        P -= p;
                      }
                      t = C[K].text;
                      if (T = n && J[y]) {
                        if (0 < T) {
                          if (t.length > T) {
                            if (F[y] = 1, l) {
                              t = t.substring(t.length - T);
                            } else {
                              continue;
                            }
                          }
                          (T -= t.length) || (T = -1);
                          J[y] = T;
                        } else {
                          F[y] = 1;
                          continue;
                        }
                      }
                      if (P + t.length + 1 <= h) {
                        t += " ", N[y] = t + N[y];
                      } else if (l) {
                        H = t.length + 1 - (h - P), 0 <= H && H < t.length && (t = t.substring(H) + " ", N[y] = t + N[y]), F[y] = 1;
                      } else {
                        F[y] = 1;
                        continue;
                      }
                    }
                  } else {
                    t = C[K].match;
                    n && (J[y] = n);
                    r && (M[y] = r);
                    y && P++;
                    H = void 0;
                    K ? !y && p && (P += p) : (G[y] = 1, F[y] = 1);
                    K >= E.length - 1 ? H = 1 : K < C.length - 1 && C[K + 1].match ? H = 1 : p && (P += p);
                    P -= f.length - 2;
                    if (!y || P + t.length <= h) {
                      N[y] = t;
                    } else {
                      H = aa = ma = G[y] = 0;
                      break;
                    }
                    H && (G[y + 1] = 1, F[y + 1] = 1);
                  }
                  P += t.length;
                  H = S[K] = 1;
                }
                if (H) {
                  Y === Z ? Z++ : Y++;
                } else {
                  Y === Z ? aa = 0 : ma = 0;
                  if (!aa && !ma) {
                    break;
                  }
                  aa ? (Y++, Z = Y) : Z++;
                }
              }
              t = "";
              for (E = 0; E < N.length; E++) {
                C = (E && G[E] ? " " : (E && !e ? " " : "") + e) + N[E], t += C;
              }
              e && !G[N.length] && (t += e);
            }
          }
          m && (t = t.replace(m, " "));
          x[A].highlight = t;
        }
      }
    }
    if (d) {
      break;
    }
  }
  return b;
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
  var d = this.index, e = this.result;
  this.result = this.index = null;
  e.length && ("object" === typeof a && (c = a.enrich, b = a.offset, a = a.limit), e = ub.call(d, e, a || 100, b, c));
  return e;
};
Q();
ob.prototype.search = function(a, b, c, d) {
  c || (!b && Ca(a) ? (c = a, a = "") : Ca(b) && (c = b, b = 0));
  if (c && c.cache) {
    c.cache = !1;
    var e = this.searchCache(a, b, c);
    c.cache = !0;
    return e;
  }
  var f = [], g = [], k = 0, h = !0;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    var l = c.pluck;
    var m = c.merge;
    var q = l || c.field || (q = c.index) && (q.index ? null : q);
    var p = this.tag && c.tag;
    var n = c.suggest;
    h = !1 !== c.resolve;
    if (!h && !l) {
      if (q = q || this.field) {
        R(q) ? l = q : (q.constructor === Array && 1 === q.length && (q = q[0]), l = q.field || q.index);
      }
      if (!l) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    this.store && c.highlight && !h ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && c.enrich && !h && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    var r = h && this.store && c.highlight;
    e = !!r || h && this.store && c.enrich;
    b = c.limit || b;
    var v = c.offset || 0;
    b || (b = 100);
    if (p && (!this.db || !d)) {
      p.constructor !== Array && (p = [p]);
      for (var u = [], B = 0, D = void 0; B < p.length; B++) {
        D = p[B];
        if (R(D)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (D.field && D.tag) {
          var x = D.tag;
          if (x.constructor === Array) {
            for (var A = 0; A < x.length; A++) {
              u.push(D.field, x[A]);
            }
          } else {
            u.push(D.field, x);
          }
        } else {
          x = Object.keys(D);
          A = 0;
          for (var t = void 0, E = void 0; A < x.length; A++) {
            if (t = x[A], E = D[t], E.constructor === Array) {
              for (var C = 0; C < E.length; C++) {
                u.push(t, E[C]);
              }
            } else {
              u.push(t, E);
            }
          }
        }
      }
      if (!u.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      p = u;
      if (!a) {
        h = [];
        if (u.length) {
          for (g = 0; g < u.length; g += 2) {
            n = void 0;
            if (this.db) {
              n = this.index.get(u[g]);
              if (!n) {
                console.warn("Tag '" + u[g] + ":" + u[g + 1] + "' will be skipped because there is no field '" + u[g] + "'.");
                continue;
              }
              h.push(n = n.db.tag(u[g + 1], b, v, e));
            } else {
              n = Eb.call(this, u[g], u[g + 1], b, v, e);
            }
            f.push({field:u[g], tag:u[g + 1], result:n});
          }
        }
        return h.length ? Promise.all(h).then(function(J) {
          for (var M = 0; M < J.length; M++) {
            f[M].result = J[M];
          }
          return f;
        }) : f;
      }
    }
    q && q.constructor !== Array && (q = [q]);
  }
  q || (q = this.field);
  u = (this.worker || this.db) && !d && [];
  B = 0;
  for (A = D = x = void 0; B < q.length; B++) {
    if (D = q[B], !this.db || !this.tag || this.L[B]) {
      x = void 0;
      R(D) || (x = D, D = x.field, a = x.query || a, b = Fb(x.limit, b), v = Fb(x.offset, v), n = Fb(x.suggest, n), r = h && this.store && Fb(x.highlight, r), e = !!r || h && this.store && Fb(x.enrich, e));
      if (d) {
        x = d[B];
      } else {
        A = x || c;
        x = this.index.get(D);
        if (p) {
          if (this.db) {
            A.tag = p;
            var ha = x.db.support_tag_search;
            A.field = q;
          }
          ha || (A.enrich = !1);
        }
        if (u) {
          u[B] = x.search(a, b, A);
          A && e && (A.enrich = e);
          continue;
        } else {
          x = x.search(a, b, A), A && e && (A.enrich = e);
        }
      }
      A = x && (h ? x.length : x.result.length);
      if (p && A) {
        t = [];
        E = 0;
        if (this.db && d) {
          if (!ha) {
            for (C = q.length; C < d.length; C++) {
              var G = d[C];
              if (G && G.length) {
                E++, t.push(G);
              } else if (!n) {
                return h ? f : new X(f);
              }
            }
          }
        } else {
          C = 0;
          for (var N = G = void 0; C < p.length; C += 2) {
            G = this.tag.get(p[C]);
            if (!G) {
              if (console.warn("Tag '" + p[C] + ":" + p[C + 1] + "' will be skipped because there is no field '" + p[C] + "'."), n) {
                continue;
              } else {
                return h ? f : new X(f);
              }
            }
            if (N = (G = G && G.get(p[C + 1])) && G.length) {
              E++, t.push(G);
            } else if (!n) {
              return h ? f : new X(f);
            }
          }
        }
        if (E) {
          x = tb(x, t, h);
          A = x.length;
          if (!A && !n) {
            return h ? x : new X(x);
          }
          E--;
        }
      }
      if (A) {
        g[k] = D, f.push(x), k++;
      } else if (1 === q.length) {
        return h ? f : new X(f);
      }
    }
  }
  if (u) {
    if (this.db && p && p.length && !ha) {
      for (e = 0; e < p.length; e += 2) {
        g = this.index.get(p[e]);
        if (!g) {
          if (console.warn("Tag '" + p[e] + ":" + p[e + 1] + "' was not found because there is no field '" + p[e] + "'."), n) {
            continue;
          } else {
            return h ? f : new X(f);
          }
        }
        u.push(g.db.tag(p[e + 1], b, v, !1));
      }
    }
    var S = this;
    return Promise.all(u).then(function(J) {
      return J.length ? S.search(a, b, c, J) : J;
    });
  }
  if (!k) {
    return h ? f : new X(f);
  }
  if (l && (!e || !this.store)) {
    return f[0];
  }
  u = [];
  for (v = 0; v < g.length; v++) {
    n = f[v];
    e && n.length && "undefined" === typeof n[0].doc && (this.db ? u.push(n = this.index.get(this.field[0]).db.enrich(n)) : n = vb.call(this, n));
    if (l) {
      return h ? r ? Db(a, n, this.index, l, r) : n : new X(n);
    }
    f[v] = {field:g[v], result:n};
  }
  if (e && this.db && u.length) {
    var F = this;
    return Promise.all(u).then(function(J) {
      for (var M = 0; M < J.length; M++) {
        f[M].result = J[M];
      }
      return m ? Gb(f) : r ? Db(a, f, F.index, l, r) : f;
    });
  }
  return m ? Gb(f) : r ? Db(a, f, this.index, l, r) : f;
};
function Fb(a, b) {
  return "undefined" === typeof a ? b : a;
}
function Gb(a) {
  for (var b = [], c = Q(), d = 0, e, f; d < a.length; d++) {
    e = a[d];
    f = e.result;
    for (var g = 0, k, h, l; g < f.length; g++) {
      h = f[g], "object" !== typeof h && (h = {id:h}), k = h.id, (l = c[k]) ? l.push(e.field) : (h.field = c[k] = [e.field], b.push(h));
    }
  }
  return b;
}
function Eb(a, b, c, d, e) {
  var f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(b)) && f.length - d) && 0 < a) {
    if (a > c || d) {
      f = f.slice(d, d + c);
    }
    e && (f = vb.call(this, f));
    return f;
  }
}
function vb(a) {
  if (!this || !this.store) {
    return a;
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
  this.L = [];
  this.field = [];
  this.S = [];
  this.key = (c = b.key || b.id) && Hb(c, this.S) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? d ? new W(d) : new Set() : d ? new V(d) : new Map();
  this.I = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (d ? new V(d) : new Map());
  this.cache = (c = a.cache || null) && new Ib(c);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = Jb.call(this, a, b);
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
        d.custom ? this.K[b] = d.custom : (this.K[b] = Hb(e, this.S), d.filter && ("string" === typeof this.K[b] && (this.K[b] = new String(this.K[b])), this.K[b].R = d.filter));
        this.aa[b] = e;
        this.tag.set(e, new Map());
      }
    }
  }
  if (this.worker) {
    this.fastupdate = !1;
    var f = [];
    a = z(this.index.values());
    for (c = a.next(); !c.done; c = a.next()) {
      c = c.value, c.then && f.push(c);
    }
    if (f.length) {
      var g = this;
      return Promise.all(f).then(function(k) {
        for (var h = new Map(), l = 0, m = z(g.index.entries()), q = m.next(); !q.done; q = m.next()) {
          var p = q.value;
          q = p[0];
          var n = p[1];
          n.then && (n = f[l].encoder || {}, p = h.get(n), p || (p = n.encode ? n : new La(n), h.set(n, p)), n = k[l], n.encoder = p, g.index.set(q, n), l++);
        }
        return g;
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
    for (var c = 0, d = void 0; c < this.aa.length; c++) {
      d = this.aa[c];
      var e = void 0;
      this.index.set(d, e = new U({}, this.reg));
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
  var k = this;
  return this.db = Promise.all(c).then(function() {
    k.db = !0;
  });
};
w.commit = function(a, b) {
  var c = this, d, e, f, g;
  return xa(function(k) {
    if (1 == k.h) {
      d = [];
      e = z(c.index.values());
      for (f = e.next(); !f.done; f = e.next()) {
        g = f.value, d.push(g.commit(a, b));
      }
      return L(k, Promise.all(d), 2);
    }
    c.reg.clear();
    k.h = 0;
  });
};
w.destroy = function() {
  for (var a = [], b = z(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    a.push(c.value.destroy());
  }
  return Promise.all(a);
};
function Jb(a, b) {
  var c = new Map(), d = b.index || b.field || b;
  R(d) && (d = [d]);
  for (var e = 0, f, g = void 0; e < d.length; e++) {
    f = d[e];
    R(f) || (g = f, f = f.field);
    g = Ca(g) ? Object.assign({}, a, g) : a;
    if (this.worker) {
      var k = new Xa(g);
      k.encoder = g.encoder;
      c.set(f, k);
    }
    this.worker || c.set(f, new U(g, this.reg));
    g.custom ? this.L[e] = g.custom : (this.L[e] = Hb(f, this.S), g.filter && ("string" === typeof this.L[e] && (this.L[e] = new String(this.L[e])), this.L[e].R = g.filter));
    this.field[e] = f;
  }
  if (this.I) {
    for (a = b.store, R(a) && (a = [a]), b = 0; b < a.length; b++) {
      d = a[b], e = d.field || d, d.custom ? (this.I[b] = d.custom, d.custom.ja = e) : (this.I[b] = Hb(e, this.S), d.filter && ("string" === typeof this.I[b] && (this.I[b] = new String(this.I[b])), this.I[b].R = d.filter));
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
  for (var b = z(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c.value.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (b = z(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
        c = c.value;
        for (var d = z(c), e = d.next(); !e.done; e = d.next()) {
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
w.clear = function() {
  for (var a = [], b = z(this.index.values()), c = b.next(); !c.done; c = b.next()) {
    c = c.value.clear(), c.then && a.push(c);
  }
  if (this.tag) {
    for (b = z(this.tag.values()), c = b.next(); !c.done; c = b.next()) {
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
  for (var a = z(this.index.values()), b = a.next(); !b.done; b = a.next()) {
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
w.searchCache = Kb;
w.export = function(a, b, c, d) {
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
      var k = db(this.reg);
      b = null;
      break;
    case 1:
      g = "tag";
      k = this.tag && bb(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      g = "doc";
      k = this.store && $a(this.store);
      b = null;
      break;
    default:
      return;
  }
  return fb.call(this, a, b, g, k, c, d);
};
w.import = function(a, b) {
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
        this.reg = eb(b, this.reg);
        for (b = 0; b < this.field.length; b++) {
          d = this.index.get(this.field[b]), d.fastupdate = !1, d.reg = this.reg;
        }
        if (this.worker) {
          b = [];
          d = z(this.index.values());
          for (c = d.next(); !c.done; c = d.next()) {
            b.push(c.value.import(a));
          }
          return Promise.all(b);
        }
        break;
      case "tag":
        this.tag = cb(b, this.tag);
        break;
      case "doc":
        this.store = ab(b, this.store);
    }
  }
};
Qa(ob.prototype);
function Kb(a, b, c) {
  var d = (b ? "" + a : "object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new Ib());
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
function Ib(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
Ib.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
Ib.prototype.get = function(a) {
  var b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
Ib.prototype.remove = function(a) {
  for (var b = z(this.cache), c = b.next(); !c.done; c = b.next()) {
    c = c.value;
    var d = c[0];
    c[1].includes(a) && this.cache.delete(d);
  }
};
Ib.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
var Lb = {normalize:!1, numeric:!1, dedupe:!1};
var Mb = {};
var Nb = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
var Ob = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Pb = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
var Qb = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var Rb = {Exact:Lb, Default:Mb, Normalize:Mb, LatinBalance:{mapper:Nb}, LatinAdvanced:{mapper:Nb, matcher:Ob, replacer:Pb}, LatinExtra:{mapper:Nb, replacer:Pb.concat([/(?!^)[aeo]/g, ""]), matcher:Ob}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (var b = 0; b < a.length; b++) {
    for (var c = a[b], d = c.charAt(0), e = Qb[d], f = 1, g; f < c.length && (g = c.charAt(f), "h" === g || "w" === g || !(g = Qb[g]) || g === e || (d += g, e = g, 4 !== d.length)); f++) {
    }
    a[b] = d;
  }
}}, CJK:{split:""}, LatinExact:Lb, LatinDefault:Mb, LatinSimple:Mb};
U.prototype.remove = function(a, b) {
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
    for (d = z(a.entries()), e = d.next(); !e.done; e = d.next()) {
      f = e.value, e = f[0], (f = Sb(f[1], b)) ? c += f : a.delete(e);
    }
  }
  return c;
}
;var Ub = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
U.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    d = this.depth;
    b = this.encoder.encode(b, !d);
    var e = b.length;
    if (e) {
      for (var f = Q(), g = Q(), k = this.resolution, h = 0; h < e; h++) {
        var l = b[this.rtl ? e - 1 - h : h], m = l.length;
        if (m && (d || !g[l])) {
          var q = this.score ? this.score(b, l, h, null, 0) : Vb(k, e, h), p = "";
          switch(this.tokenize) {
            case "full":
              if (2 < m) {
                q = 0;
                for (var n; q < m; q++) {
                  for (var r = m; r > q; r--) {
                    p = l.substring(q, r), n = this.rtl ? m - 1 - q : q, n = this.score ? this.score(b, l, h, p, n) : Vb(k, e, h, m, n), Wb(this, g, p, n, a, c);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < m) {
                for (r = m - 1; 0 < r; r--) {
                  p = l[this.rtl ? m - 1 - r : r] + p, n = this.score ? this.score(b, l, h, p, r) : Vb(k, e, h, m, r), Wb(this, g, p, n, a, c);
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
              if (Wb(this, g, l, q, a, c), d && 1 < e && h < e - 1) {
                for (m = Q(), p = this.da, q = l, r = Math.min(d + 1, this.rtl ? h + 1 : e - h), n = m[q] = 1; n < r; n++) {
                  if ((l = b[this.rtl ? e - 1 - h - n : h + n]) && !m[l]) {
                    m[l] = 1;
                    var v = this.score ? this.score(b, q, h, l, n - 1) : Vb(p + (e / 2 > p ? 0 : 1), e, h, r - 1, n - 1), u = this.bidirectional && l > q;
                    Wb(this, f, u ? q : l, v, a, c, u ? l : q);
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
  var k = g ? a.ctx : a.map, h;
  if (!b[c] || g && !(h = b[c])[g]) {
    if (g ? (b = h || (b[c] = Q()), b[g] = 1, (h = k.get(g)) ? k = h : k.set(g, k = new Map())) : b[c] = 1, (h = k.get(c)) ? k = h : k.set(c, k = h = []), k = k[d] || (k[d] = []), !f || !k.includes(e)) {
      if (k.length === Math.pow(2, 31) - 1) {
        b = new ib(k);
        if (a.fastupdate) {
          for (c = z(a.reg.values()), f = c.next(); !f.done; f = c.next()) {
            f = f.value, f.includes(k) && (f[f.indexOf(k)] = b);
          }
        }
        h[d] = k = b;
      }
      k.push(e);
      a.fastupdate && ((d = a.reg.get(e)) ? d.push(k) : a.reg.set(e, [k]));
    }
  }
}
function Vb(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;U.prototype.search = function(a, b, c) {
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
    var k = c.suggest;
    var h = (f = c.resolve) && c.enrich;
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
    return Xb.call(this, p[0], "", b, e, f, h, q);
  }
  if (2 === n && g && !k) {
    return Xb.call(this, p[1], p[0], b, e, f, h, q);
  }
  var r = Q(), v = 0;
  if (g) {
    var u = p[0];
    v = 1;
  }
  m || 0 === m || (m = u ? this.da : this.resolution);
  if (this.db) {
    if (this.db.search && (c = this.db.search(this, p, b, e, k, f, h, q), !1 !== c)) {
      return c;
    }
    var B = this;
    return function() {
      var D, x;
      return xa(function(A) {
        switch(A.h) {
          case 1:
            x = D = void 0;
          case 2:
            if (!(v < n)) {
              A.h = 4;
              break;
            }
            x = p[v];
            if (!x || r[x]) {
              A.h = 5;
              break;
            }
            r[x] = 1;
            return L(A, Yb(B, x, u, 0, 0, !1, !1), 6);
          case 6:
            D = A.D;
            if (D = Zb(D, d, k, m)) {
              d = D;
              A.h = 4;
              break;
            }
            u && (k && D && d.length || (u = x));
          case 5:
            k && u && v === n - 1 && !d.length && (m = B.resolution, u = "", v = -1, r = Q());
            v++;
            A.h = 2;
            break;
          case 4:
            return A.return($b(d, m, b, e, k, l, f));
        }
      });
    }();
  }
  for (a = c = void 0; v < n; v++) {
    if ((a = p[v]) && !r[a]) {
      r[a] = 1;
      c = Yb(this, a, u, 0, 0, !1, !1);
      if (c = Zb(c, d, k, m)) {
        d = c;
        break;
      }
      u && (k && c && d.length || (u = a));
    }
    k && u && v === n - 1 && !d.length && (m = this.resolution, u = "", v = -1, r = Q());
  }
  return $b(d, m, b, e, k, l, f);
};
function $b(a, b, c, d, e, f, g) {
  var k = a.length, h = a;
  if (1 < k) {
    h = rb(a, b, c, d, e, f, g);
  } else if (1 === k) {
    return g ? ub.call(null, a[0], c, d) : new X(a[0]);
  }
  return g ? h : new X(h);
}
function Xb(a, b, c, d, e, f, g) {
  a = Yb(this, a, b, c, d, e, f, g);
  return this.db ? a.then(function(k) {
    return e ? k || [] : new X(k);
  }) : a && a.length ? e ? ub.call(this, a, c, d) : new X(a) : e ? [] : new X();
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
function Yb(a, b, c, d, e, f, g, k) {
  var h;
  c && (h = a.bidirectional && b > c) && (h = c, c = b, b = h);
  if (a.db) {
    return a.db.get(b, c, d, e, f, g, k);
  }
  a = c ? (a = a.ctx.get(c)) && a.get(b) : a.map.get(b);
  return a;
}
;function U(a, b) {
  if (!this || this.constructor !== U) {
    return new U(a);
  }
  if (a) {
    var c = R(a) ? a : a.preset;
    c && (Ub[c] || console.warn("Preset not found: " + c), a = Object.assign({}, Ub[c], a));
  } else {
    a = {};
  }
  c = a.context;
  var d = !0 === c ? {depth:1} : c || {}, e = R(a.encoder) ? Rb[a.encoder] : a.encode || a.encoder || {};
  this.encoder = e.encode ? e : "object" === typeof e ? new La(e) : {encode:e};
  this.resolution = a.resolution || 9;
  this.tokenize = c = (c = a.tokenize) && "default" !== c && "exact" !== c && c || "strict";
  this.depth = "strict" === c && d.depth || 0;
  this.bidirectional = !1 !== d.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  d && d.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new V(c) : new Map();
  this.ctx = c ? new V(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new V(c) : new Map() : c ? new W(c) : new Set());
  this.da = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new Ib(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.ca = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
w = U.prototype;
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
function Tb(a) {
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
  this.db && (this.commit_timer && clearTimeout(this.commit_timer), this.commit_timer = null, this.commit_task = [{clear:!0}]);
  return this;
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
w.searchCache = Kb;
w.export = function(a, b, c, d) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  switch(d) {
    case 0:
      var e = "reg";
      var f = db(this.reg);
      break;
    case 1:
      e = "cfg";
      f = null;
      break;
    case 2:
      e = "map";
      f = $a(this.map, this.reg.size);
      break;
    case 3:
      e = "ctx";
      f = bb(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return fb.call(this, a, b, e, f, c, d);
};
w.import = function(a, b) {
  if (b) {
    switch("string" === typeof b && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = eb(b, this.reg);
        break;
      case "map":
        this.map = ab(b, this.map);
        break;
      case "ctx":
        this.ctx = cb(b, this.ctx);
    }
  }
};
w.serialize = function(a) {
  a = void 0 === a ? !0 : a;
  var b = "", c = "", d = "";
  if (this.reg.size) {
    var e;
    c = z(this.reg.keys());
    for (var f = c.next(); !f.done; f = c.next()) {
      f = f.value, e || (e = typeof f), b += (b ? "," : "") + ("string" === e ? '"' + f + '"' : f);
    }
    b = "index.reg=new Set([" + b + "]);";
    c = gb(this.map, e);
    c = "index.map=new Map([" + c + "]);";
    f = z(this.ctx.entries());
    for (var g = f.next(); !g.done; g = f.next()) {
      var k = g.value;
      g = k[0];
      k = gb(k[1], e);
      k = "new Map([" + k + "])";
      k = '["' + g + '",' + k + "]";
      d += (d ? "," : "") + k;
    }
    d = "index.ctx=new Map([" + d + "]);";
  }
  return a ? "function inject(index){" + b + c + d + "}" : b + c + d;
};
Qa(U.prototype);
var ac = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), bc = ["map", "ctx", "tag", "reg", "cfg"], cc = Q();
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
      e = cc[this.id][d], a.push(c + ("reg" !== c ? e ? ":" + e : "" : ""));
    }
  }
  b = this.db.transaction(a, "readwrite");
  for (c = 0; c < a.length; c++) {
    b.objectStore(a[c]).clear();
  }
  return ec(b);
};
w.get = function(a, b, c, d, e, f) {
  c = void 0 === c ? 0 : c;
  d = void 0 === d ? 0 : d;
  e = void 0 === e ? !0 : e;
  f = void 0 === f ? !1 : f;
  a = this.db.transaction((b ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((b ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(b ? b + ":" + a : a);
  var g = this;
  return ec(a).then(function(k) {
    var h = [];
    if (!k || !k.length) {
      return h;
    }
    if (e) {
      if (!c && !d && 1 === k.length) {
        return k[0];
      }
      for (var l = 0, m = void 0; l < k.length; l++) {
        if ((m = k[l]) && m.length) {
          if (d >= m.length) {
            d -= m.length;
          } else {
            for (var q = c ? d + Math.min(m.length - d, c) : m.length, p = d; p < q; p++) {
              h.push(m[p]);
            }
            d = 0;
            if (h.length === c) {
              break;
            }
          }
        }
      }
      return f ? g.enrich(h) : h;
    }
    return k;
  });
};
w.tag = function(a, b, c, d) {
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
w.enrich = function(a) {
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
w.commit = function(a, b, c) {
  var d = this, e, f, g;
  return xa(function(k) {
    switch(k.h) {
      case 1:
        if (b) {
          return L(k, d.clear(), 12);
        }
        e = a.commit_task;
        a.commit_task = [];
        f = 0;
        g = void 0;
      case 4:
        if (!(f < e.length)) {
          k.h = 6;
          break;
        }
        g = e[f];
        if (!g.clear) {
          e[f] = g.del;
          k.h = 5;
          break;
        }
        return L(k, d.clear(), 8);
      case 8:
        b = !0;
        k.h = 6;
        break;
      case 5:
        f++;
        k.h = 4;
        break;
      case 6:
        if (b) {
          k.h = 3;
          break;
        }
        c || (e = e.concat(Da(a.reg)));
        if (!e.length) {
          k.h = 10;
          break;
        }
        return L(k, d.remove(e), 11);
      case 11:
      case 10:
        k.h = 3;
        break;
      case 12:
        a.commit_task = [];
      case 3:
        return a.reg.size ? L(k, d.transaction("map", "readwrite", function(h) {
          for (var l = z(a.map), m = l.next(), q = {}; !m.done; q = {O:void 0, Y:void 0}, m = l.next()) {
            m = m.value, q.Y = m[0], q.O = m[1], q.O.length && (b ? h.put(q.O, q.Y) : h.get(q.Y).onsuccess = function(p) {
              return function() {
                var n = this.result, r;
                if (n && n.length) {
                  for (var v = Math.max(n.length, p.O.length), u = 0, B; u < v; u++) {
                    if ((B = p.O[u]) && B.length) {
                      if ((r = n[u]) && r.length) {
                        for (var D = 0; D < B.length; D++) {
                          r.push(B[D]);
                        }
                      } else {
                        n[u] = B;
                      }
                      r = 1;
                    }
                  }
                } else {
                  n = p.O, r = 1;
                }
                r && h.put(n, p.Y);
              };
            }(q));
          }
        }), 13) : k.return();
      case 13:
        return L(k, d.transaction("ctx", "readwrite", function(h) {
          for (var l = z(a.ctx), m = l.next(), q = {}; !m.done; q = {V:void 0}, m = l.next()) {
            m = m.value;
            q.V = m[0];
            m = z(m[1]);
            for (var p = m.next(), n = {}; !p.done; n = {P:void 0, Z:void 0}, p = m.next()) {
              p = p.value, n.Z = p[0], n.P = p[1], n.P.length && (b ? h.put(n.P, q.V + ":" + n.Z) : h.get(q.V + ":" + n.Z).onsuccess = function(r, v) {
                return function() {
                  var u = this.result, B;
                  if (u && u.length) {
                    for (var D = Math.max(u.length, r.P.length), x = 0, A; x < D; x++) {
                      if ((A = r.P[x]) && A.length) {
                        if ((B = u[x]) && B.length) {
                          for (var t = 0; t < A.length; t++) {
                            B.push(A[t]);
                          }
                        } else {
                          u[x] = A;
                        }
                        B = 1;
                      }
                    }
                  } else {
                    u = r.P, B = 1;
                  }
                  B && h.put(u, v.V + ":" + r.Z);
                };
              }(n, q));
            }
          }
        }), 14);
      case 14:
        if (a.store) {
          return L(k, d.transaction("reg", "readwrite", function(h) {
            for (var l = z(a.store), m = l.next(); !m.done; m = l.next()) {
              var q = m.value;
              m = q[0];
              q = q[1];
              h.put("object" === typeof q ? JSON.stringify(q) : 1, m);
            }
          }), 16);
        }
        if (a.bypass) {
          k.h = 16;
          break;
        }
        return L(k, d.transaction("reg", "readwrite", function(h) {
          for (var l = z(a.reg.keys()), m = l.next(); !m.done; m = l.next()) {
            h.put(1, m.value);
          }
        }), 16);
      case 16:
        if (!a.tag) {
          k.h = 20;
          break;
        }
        return L(k, d.transaction("tag", "readwrite", function(h) {
          for (var l = z(a.tag), m = l.next(), q = {}; !m.done; q = {X:void 0, ba:void 0}, m = l.next()) {
            m = m.value, q.ba = m[0], q.X = m[1], q.X.length && (h.get(q.ba).onsuccess = function(p) {
              return function() {
                var n = this.result;
                n = n && n.length ? n.concat(p.X) : p.X;
                h.put(n, p.ba);
              };
            }(q));
          }
        }), 20);
      case 20:
        a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear(), k.h = 0;
    }
  });
};
function fc(a, b, c) {
  for (var d = a.value, e, f = 0, g = 0, k; g < d.length; g++) {
    if (k = c ? d : d[g]) {
      for (var h = 0, l; h < b.length; h++) {
        if (l = b[h], l = k.indexOf(l), 0 <= l) {
          if (e = 1, 1 < k.length) {
            k.splice(l, 1);
          } else {
            d[g] = [];
            break;
          }
        }
      }
      f += k.length;
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
;var gc = {Index:U, Charset:Rb, Encoder:La, Document:ob, Worker:Xa, Resolver:X, IndexedDB:dc, Language:{}}, hc = "undefined" !== typeof self ? self : "undefined" !== typeof global ? global : self, ic;
(ic = hc.define) && ic.amd ? ic([], function() {
  return gc;
}) : "object" === typeof hc.exports ? hc.exports = gc : hc.FlexSearch = gc;
}(this||self));
