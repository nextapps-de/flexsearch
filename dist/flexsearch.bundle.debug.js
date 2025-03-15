/**!
 * FlexSearch.js v0.8.0 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;
var v;
function z(a, b, c) {
  const d = typeof c, e = typeof a;
  if ("undefined" !== d) {
    if ("undefined" !== e) {
      if (c) {
        if ("function" === e && d === e) {
          return function(h) {
            return a(c(h));
          };
        }
        b = a.constructor;
        if (b === c.constructor) {
          if (b === Array) {
            return c.concat(a);
          }
          if (b === Map) {
            var f = new Map(c);
            for (var g of a) {
              f.set(g[0], g[1]);
            }
            return f;
          }
          if (b === Set) {
            g = new Set(c);
            for (f of a.values()) {
              g.add(f);
            }
            return g;
          }
        }
      }
      return a;
    }
    return c;
  }
  return "undefined" === e ? b : a;
}
function B() {
  return Object.create(null);
}
function aa(a, b) {
  return b.length - a.length;
}
function G(a) {
  return "string" === typeof a;
}
function H(a) {
  return "object" === typeof a;
}
function ba(a) {
  const b = [];
  for (const c of a.keys()) {
    b.push(c);
  }
  return b;
}
function J(a, b) {
  if (G(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function ca(a) {
  let b = 0;
  for (let c = 0, d; c < a.length; c++) {
    (d = a[c]) && b < d.length && (b = d.length);
  }
  return b;
}
;var da = [["\u00aa", "a"], ["\u00b2", "2"], ["\u00b3", "3"], ["\u00b9", "1"], ["\u00ba", "o"], ["\u00bc", "1\u20444"], ["\u00bd", "1\u20442"], ["\u00be", "3\u20444"], ["\u00e0", "a"], ["\u00e1", "a"], ["\u00e2", "a"], ["\u00e3", "a"], ["\u00e4", "a"], ["\u00e5", "a"], ["\u00e7", "c"], ["\u00e8", "e"], ["\u00e9", "e"], ["\u00ea", "e"], ["\u00eb", "e"], ["\u00ec", "i"], ["\u00ed", "i"], ["\u00ee", "i"], ["\u00ef", "i"], ["\u00f1", "n"], ["\u00f2", "o"], ["\u00f3", "o"], ["\u00f4", "o"], ["\u00f5", 
"o"], ["\u00f6", "o"], ["\u00f9", "u"], ["\u00fa", "u"], ["\u00fb", "u"], ["\u00fc", "u"], ["\u00fd", "y"], ["\u00ff", "y"], ["\u0101", "a"], ["\u0103", "a"], ["\u0105", "a"], ["\u0107", "c"], ["\u0109", "c"], ["\u010b", "c"], ["\u010d", "c"], ["\u010f", "d"], ["\u0113", "e"], ["\u0115", "e"], ["\u0117", "e"], ["\u0119", "e"], ["\u011b", "e"], ["\u011d", "g"], ["\u011f", "g"], ["\u0121", "g"], ["\u0123", "g"], ["\u0125", "h"], ["\u0129", "i"], ["\u012b", "i"], ["\u012d", "i"], ["\u012f", "i"], ["\u0133", 
"ij"], ["\u0135", "j"], ["\u0137", "k"], ["\u013a", "l"], ["\u013c", "l"], ["\u013e", "l"], ["\u0140", "l"], ["\u0144", "n"], ["\u0146", "n"], ["\u0148", "n"], ["\u0149", "n"], ["\u014d", "o"], ["\u014f", "o"], ["\u0151", "o"], ["\u0155", "r"], ["\u0157", "r"], ["\u0159", "r"], ["\u015b", "s"], ["\u015d", "s"], ["\u015f", "s"], ["\u0161", "s"], ["\u0163", "t"], ["\u0165", "t"], ["\u0169", "u"], ["\u016b", "u"], ["\u016d", "u"], ["\u016f", "u"], ["\u0171", "u"], ["\u0173", "u"], ["\u0175", "w"], ["\u0177", 
"y"], ["\u017a", "z"], ["\u017c", "z"], ["\u017e", "z"], ["\u017f", "s"], ["\u01a1", "o"], ["\u01b0", "u"], ["\u01c6", "dz"], ["\u01c9", "lj"], ["\u01cc", "nj"], ["\u01ce", "a"], ["\u01d0", "i"], ["\u01d2", "o"], ["\u01d4", "u"], ["\u01d6", "u"], ["\u01d8", "u"], ["\u01da", "u"], ["\u01dc", "u"], ["\u01df", "a"], ["\u01e1", "a"], ["\u01e3", "ae"], ["\u00e6", "ae"], ["\u01fd", "ae"], ["\u01e7", "g"], ["\u01e9", "k"], ["\u01eb", "o"], ["\u01ed", "o"], ["\u01ef", "\u0292"], ["\u01f0", "j"], ["\u01f3", 
"dz"], ["\u01f5", "g"], ["\u01f9", "n"], ["\u01fb", "a"], ["\u01ff", "\u00f8"], ["\u0201", "a"], ["\u0203", "a"], ["\u0205", "e"], ["\u0207", "e"], ["\u0209", "i"], ["\u020b", "i"], ["\u020d", "o"], ["\u020f", "o"], ["\u0211", "r"], ["\u0213", "r"], ["\u0215", "u"], ["\u0217", "u"], ["\u0219", "s"], ["\u021b", "t"], ["\u021f", "h"], ["\u0227", "a"], ["\u0229", "e"], ["\u022b", "o"], ["\u022d", "o"], ["\u022f", "o"], ["\u0231", "o"], ["\u0233", "y"], ["\u02b0", "h"], ["\u02b1", "h"], ["\u0266", "h"], 
["\u02b2", "j"], ["\u02b3", "r"], ["\u02b4", "\u0279"], ["\u02b5", "\u027b"], ["\u02b6", "\u0281"], ["\u02b7", "w"], ["\u02b8", "y"], ["\u02e0", "\u0263"], ["\u02e1", "l"], ["\u02e2", "s"], ["\u02e3", "x"], ["\u02e4", "\u0295"], ["\u0390", "\u03b9"], ["\u03ac", "\u03b1"], ["\u03ad", "\u03b5"], ["\u03ae", "\u03b7"], ["\u03af", "\u03b9"], ["\u03b0", "\u03c5"], ["\u03ca", "\u03b9"], ["\u03cb", "\u03c5"], ["\u03cc", "\u03bf"], ["\u03cd", "\u03c5"], ["\u03ce", "\u03c9"], ["\u03d0", "\u03b2"], ["\u03d1", 
"\u03b8"], ["\u03d2", "\u03a5"], ["\u03d3", "\u03a5"], ["\u03d4", "\u03a5"], ["\u03d5", "\u03c6"], ["\u03d6", "\u03c0"], ["\u03f0", "\u03ba"], ["\u03f1", "\u03c1"], ["\u03f2", "\u03c2"], ["\u03f5", "\u03b5"], ["\u0439", "\u0438"], ["\u0450", "\u0435"], ["\u0451", "\u0435"], ["\u0453", "\u0433"], ["\u0457", "\u0456"], ["\u045c", "\u043a"], ["\u045d", "\u0438"], ["\u045e", "\u0443"], ["\u0477", "\u0475"], ["\u04c2", "\u0436"], ["\u04d1", "\u0430"], ["\u04d3", "\u0430"], ["\u04d7", "\u0435"], ["\u04db", 
"\u04d9"], ["\u04dd", "\u0436"], ["\u04df", "\u0437"], ["\u04e3", "\u0438"], ["\u04e5", "\u0438"], ["\u04e7", "\u043e"], ["\u04eb", "\u04e9"], ["\u04ed", "\u044d"], ["\u04ef", "\u0443"], ["\u04f1", "\u0443"], ["\u04f3", "\u0443"], ["\u04f5", "\u0447"]];
const ea = /[^\p{L}\p{N}]+/u, fa = /(\d{3})/g, ha = /(\D)(\d{3})/g, ia = /(\d{3})(\D)/g, ja = "".normalize && /[\u0300-\u036f]/g;
function K(a) {
  if (!this || this.constructor !== K) {
    return new K(...arguments);
  }
  for (let b = 0; b < arguments.length; b++) {
    this.assign(arguments[b]);
  }
}
K.prototype.assign = function(a) {
  this.normalize = z(a.normalize, !0, this.normalize);
  let b = a.include, c = b || a.exclude || a.split;
  if ("object" === typeof c) {
    let d = !b, e = "";
    a.include || (e += "\\p{Z}");
    c.letter && (e += "\\p{L}");
    c.number && (e += "\\p{N}", d = !!b);
    c.symbol && (e += "\\p{S}");
    c.punctuation && (e += "\\p{P}");
    c.control && (e += "\\p{C}");
    if (c = c.char) {
      e += "object" === typeof c ? c.join("") : c;
    }
    try {
      this.split = new RegExp("[" + (b ? "^" : "") + e + "]+", "u");
    } catch (f) {
      this.split = /\s+/;
    }
    this.numeric = d;
  } else {
    try {
      this.split = z(c, ea, this.split);
    } catch (d) {
      this.split = /\s+/;
    }
    this.numeric = z(this.numeric, !0);
  }
  this.prepare = z(a.prepare, null, this.prepare);
  this.finalize = z(a.finalize, null, this.finalize);
  ja || (this.mapper = new Map(da));
  this.rtl = a.rtl || !1;
  this.dedupe = z(a.dedupe, !0, this.dedupe);
  this.filter = z((c = a.filter) && new Set(c), null, this.filter);
  this.matcher = z((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = z((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = z((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = z(a.replacer, null, this.replacer);
  this.minlength = z(a.minlength, 1, this.minlength);
  this.maxlength = z(a.maxlength, 0, this.maxlength);
  if (this.cache = c = z(a.cache, !0, this.cache)) {
    this.L = null, this.S = "number" === typeof c ? c : 2e5, this.H = new Map(), this.J = new Map(), this.A = this.h = 128;
  }
  this.B = "";
  this.O = null;
  this.M = "";
  this.P = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.B += (this.B ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.M += (this.M ? "|" : "") + d;
    }
  }
  return this;
};
K.prototype.encode = function(a) {
  if (this.cache && a.length <= this.h) {
    if (this.L) {
      if (this.H.has(a)) {
        return this.H.get(a);
      }
    } else {
      this.L = setTimeout(ka, 50, this);
    }
  }
  this.normalize && (a = "function" === typeof this.normalize ? this.normalize(a) : ja ? a.normalize("NFKD").replace(ja, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ha, "$1 $2").replace(ia, "$1 $2").replace(fa, "$1 "));
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let c = [], d = this.split || "" === this.split ? a.split(this.split) : a;
  for (let f = 0, g, h; f < d.length; f++) {
    if (!(g = h = d[f])) {
      continue;
    }
    if (g.length < this.minlength) {
      continue;
    }
    if (b) {
      c.push(g);
      continue;
    }
    if (this.filter && this.filter.has(g)) {
      continue;
    }
    if (this.cache && g.length <= this.A) {
      if (this.L) {
        var e = this.J.get(g);
        if (e || "" === e) {
          e && c.push(e);
          continue;
        }
      } else {
        this.L = setTimeout(ka, 50, this);
      }
    }
    let k;
    this.stemmer && 2 < g.length && (this.P || (this.P = new RegExp("(?!^)(" + this.M + ")$")), g = g.replace(this.P, l => this.stemmer.get(l)), k = 1);
    g && k && (g.length < this.minlength || this.filter && this.filter.has(g)) && (g = "");
    if (g && (this.mapper || this.dedupe && 1 < g.length)) {
      e = "";
      for (let l = 0, m = "", p, n; l < g.length; l++) {
        p = g.charAt(l), p === m && this.dedupe || ((n = this.mapper && this.mapper.get(p)) || "" === n ? n === m && this.dedupe || !(m = n) || (e += n) : e += m = p);
      }
      g = e;
    }
    this.matcher && 1 < g.length && (this.O || (this.O = new RegExp("(" + this.B + ")", "g")), g = g.replace(this.O, l => this.matcher.get(l)));
    if (g && this.replacer) {
      for (e = 0; g && e < this.replacer.length; e += 2) {
        g = g.replace(this.replacer[e], this.replacer[e + 1]);
      }
    }
    this.cache && h.length <= this.A && (this.J.set(h, g), this.J.size > this.S && (this.J.clear(), this.A = this.A / 1.1 | 0));
    g && c.push(g);
  }
  this.finalize && (c = this.finalize(c) || c);
  this.cache && a.length <= this.h && (this.H.set(a, c), this.H.size > this.S && (this.H.clear(), this.h = this.h / 1.1 | 0));
  return c;
};
function ka(a) {
  a.L = null;
  a.H.clear();
  a.J.clear();
}
;async function la(a) {
  a = a.data;
  var b = self._index;
  const c = a.args;
  var d = a.task;
  switch(d) {
    case "init":
      d = a.options || {};
      (b = d.config) && (d = b);
      (b = a.factory) ? (Function("return " + b)()(self), self._index = new self.FlexSearch.Index(d), delete self.FlexSearch) : self._index = new L(d);
      postMessage({id:a.id});
      break;
    default:
      a = a.id, b = b[d].apply(b, c), postMessage("search" === d ? {id:a, msg:b} : {id:a});
  }
}
;let M = 0;
function N(a = {}) {
  function b(g) {
    function h(k) {
      k = k.data || k;
      const l = k.id, m = l && e.h[l];
      m && (m(k.msg), delete e.h[l]);
    }
    this.worker = g;
    this.h = B();
    if (this.worker) {
      d ? this.worker.on("message", h) : this.worker.onmessage = h;
      if (a.config) {
        return new Promise(function(k) {
          e.h[++M] = function() {
            k(e);
          };
          e.worker.postMessage({id:M, task:"init", factory:c, options:a});
        });
      }
      this.worker.postMessage({task:"init", factory:c, options:a});
      return this;
    }
  }
  if (!this || this.constructor !== N) {
    return new N(a);
  }
  let c = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  c && (c = c.toString());
  const d = "undefined" === typeof window, e = this, f = ma(c, d, a.worker);
  return f.then ? f.then(function(g) {
    return b.call(e, g);
  }) : b.call(this, f);
}
O("add");
O("append");
O("search");
O("update");
O("remove");
function O(a) {
  N.prototype[a] = N.prototype[a + "Async"] = async function() {
    const b = this, c = [].slice.call(arguments);
    var d = c[c.length - 1];
    let e;
    "function" === typeof d && (e = d, c.splice(c.length - 1, 1));
    d = new Promise(function(f) {
      b.h[++M] = f;
      b.worker.postMessage({task:a, id:M, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function ma(a, b, c) {
  return b ? "undefined" !== typeof module ? new (require("worker_threads")["Worker"])(__dirname + "/node/node.js") : import("worker_threads").then(function(worker){ return new worker["Worker"]((1,eval)("import.meta.dirname") + "/node/node.mjs"); }) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + la.toString()], {type:"text/javascript"}))) : new window.Worker(G(c) ? c : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function na(a) {
  P.call(a, "add");
  P.call(a, "append");
  P.call(a, "search");
  P.call(a, "update");
  P.call(a, "remove");
}
function P(a) {
  this[a + "Async"] = function() {
    var b = arguments;
    const c = b[b.length - 1];
    let d;
    "function" === typeof c && (d = c, delete b[b.length - 1]);
    b = this[a].apply(this, b);
    d && (b.then ? b.then(d) : d(b));
    return b;
  };
}
;function oa(a, b = 0) {
  let c = [], d = [];
  b && (b = 250000 / b * 5000 | 0);
  for (const e of a.entries()) {
    d.push(e), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function pa(a, b) {
  b || (b = new Map());
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b.set(d[0], d[1]);
  }
  return b;
}
function qa(a, b = 0) {
  let c = [], d = [];
  b && (b = 250000 / b * 1000 | 0);
  for (const e of a.entries()) {
    d.push([e[0], oa(e[1])[0]]), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function ra(a, b) {
  b || (b = new Map());
  for (let c = 0, d, e; c < a.length; c++) {
    d = a[c], e = b.get(d[0]), b.set(d[0], pa(d[1], e));
  }
  return b;
}
function sa(a) {
  let b = [], c = [];
  for (const d of a.keys()) {
    c.push(d), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function ta(a, b) {
  b || (b = new Set());
  for (let c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function ua(a, b, c, d, e, f, g = 0) {
  const h = d && d.constructor === Array;
  var k = h ? d.shift() : d;
  if (!k) {
    return this.export(a, b, e, f + 1);
  }
  if ((k = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(k))) && k.then) {
    const l = this;
    return k.then(function() {
      return ua.call(l, a, b, c, h ? d : null, e, f, g + 1);
    });
  }
  return ua.call(this, a, b, c, h ? d : null, e, f, g + 1);
}
;function va(a, b, c, d) {
  let e = [];
  for (let f = 0, g; f < a.index.length; f++) {
    if (g = a.index[f], b >= g.length) {
      b -= g.length;
    } else {
      b = g[d ? "splice" : "slice"](b, c);
      const h = b.length;
      if (h && (e = e.length ? e.concat(b) : b, c -= h, d && (a.length -= h), !c)) {
        break;
      }
      b = 0;
    }
  }
  return e;
}
function Q(a) {
  if (!this) {
    return new Q(a);
  }
  this.index = a ? [a] : [];
  this.length = a ? a.length : 0;
  const b = this;
  return new Proxy([], {get(c, d) {
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
        let f = 0;
        for (let g = 0, h, k; g < b.index.length; g++) {
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
        for (let f = 0; f < b.index.length; f++) {
          if (b.index[f].includes(e)) {
            return !0;
          }
        }
        return !1;
      };
    }
    if ("slice" === d) {
      return function(e, f) {
        return va(b, e || 0, f || b.length, !1);
      };
    }
    if ("splice" === d) {
      return function(e, f) {
        return va(b, e || 0, f || b.length, !0);
      };
    }
    if ("constructor" === d) {
      return Array;
    }
    if ("symbol" !== typeof d) {
      return (c = b.index[d / 2 ** 31 | 0]) && c[d];
    }
  }, set(c, d, e) {
    c = d / 2 ** 31 | 0;
    (b.index[c] || (b.index[c] = []))[d] = e;
    b.length++;
    return !0;
  }});
}
Q.prototype.clear = function() {
  this.index.length = 0;
};
Q.prototype.destroy = function() {
  this.proxy = this.index = null;
};
Q.prototype.push = function() {
};
function R(a = 8) {
  if (!this) {
    return new R(a);
  }
  this.index = B();
  this.B = [];
  this.size = 0;
  32 < a ? (this.h = wa, this.A = BigInt(a)) : (this.h = xa, this.A = a);
}
R.prototype.get = function(a) {
  const b = this.index[this.h(a)];
  return b && b.get(a);
};
R.prototype.set = function(a, b) {
  var c = this.h(a);
  let d = this.index[c];
  d ? (c = d.size, d.set(a, b), (c -= d.size) && this.size++) : (this.index[c] = d = new Map([[a, b]]), this.B.push(d));
};
function S(a = 8) {
  if (!this) {
    return new S(a);
  }
  this.index = B();
  this.h = [];
  32 < a ? (this.B = wa, this.A = BigInt(a)) : (this.B = xa, this.A = a);
}
S.prototype.add = function(a) {
  var b = this.B(a);
  let c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c));
};
v = R.prototype;
v.has = S.prototype.has = function(a) {
  const b = this.index[this.B(a)];
  return b && b.has(a);
};
v.delete = S.prototype.delete = function(a) {
  const b = this.index[this.B(a)];
  b && b.delete(a) && this.size--;
};
v.clear = S.prototype.clear = function() {
  this.index = B();
  this.h = [];
  this.size = 0;
};
v.values = S.prototype.values = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].values()) {
      yield b;
    }
  }
};
v.keys = S.prototype.keys = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].keys()) {
      yield b;
    }
  }
};
v.entries = S.prototype.entries = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].entries()) {
      yield b;
    }
  }
};
function xa(a) {
  let b = 2 ** this.A - 1;
  if ("number" == typeof a) {
    return a & b;
  }
  let c = 0, d = this.A + 1;
  for (let e = 0; e < a.length; e++) {
    c = (c * d ^ a.charCodeAt(e)) & b;
  }
  return 32 === this.A ? c + 2 ** 31 : c;
}
function wa(a) {
  let b = BigInt(2) ** this.A - BigInt(1);
  var c = typeof a;
  if ("bigint" === c) {
    return a & b;
  }
  if ("number" === c) {
    return BigInt(a) & b;
  }
  c = BigInt(0);
  let d = this.A + BigInt(1);
  for (let e = 0; e < a.length; e++) {
    c = (c * d ^ BigInt(a.charCodeAt(e))) & b;
  }
  return c;
}
;T.prototype.add = function(a, b, c) {
  H(a) && (b = a, a = J(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (let h = 0, k; h < this.field.length; h++) {
      k = this.D[h];
      var d = this.index.get(this.field[h]);
      if ("function" === typeof k) {
        var e = k(b);
        e && d.add(a, e, !1, !0);
      } else {
        if (e = k.I, !e || e(b)) {
          k.constructor === String ? k = ["" + k] : G(k) && (k = [k]), ya(b, k, this.K, 0, d, a, k[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.G.length; d++) {
        var f = this.G[d], g = this.N[d];
        e = this.tag.get(g);
        let h = B();
        if ("function" === typeof f) {
          if (f = f(b), !f) {
            continue;
          }
        } else {
          const k = f.I;
          if (k && !k(b)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = J(b, f);
        }
        if (e && f) {
          G(f) && (f = [f]);
          for (let k = 0, l, m; k < f.length; k++) {
            if (l = f[k], !h[l] && (h[l] = 1, (g = e.get(l)) ? m = g : e.set(l, m = []), !c || !m.includes(a))) {
              if (m.length === 2 ** 31 - 1) {
                g = new Q(m);
                if (this.fastupdate) {
                  for (let p of this.reg.values()) {
                    p.includes(m) && (p[p.indexOf(m)] = g);
                  }
                }
                e.set(l, m = g);
              }
              m.push(a);
              this.fastupdate && ((g = this.reg.get(a)) ? g.push(m) : this.reg.set(a, [m]));
            }
          }
        } else {
          e || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!c || !this.store.has(a))) {
      let h;
      if (this.C) {
        h = B();
        for (let k = 0, l; k < this.C.length; k++) {
          l = this.C[k];
          if ((c = l.I) && !c(b)) {
            continue;
          }
          let m;
          if ("function" === typeof l) {
            m = l(b);
            if (!m) {
              continue;
            }
            l = [l.U];
          } else if (G(l) || l.constructor === String) {
            h[l] = b[l];
            continue;
          }
          za(b, h, l, 0, l[0], m);
        }
      }
      this.store.set(a, h || b);
    }
  }
  return this;
};
function za(a, b, c, d, e, f) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
        za(a, b, c, d, e);
      }
    } else {
      b = b[e] || (b[e] = B()), e = c[++d], za(a, b, c, d, e);
    }
  }
}
function ya(a, b, c, d, e, f, g, h) {
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
          ya(a, b, c, d, e, f, g, h);
        }
      } else {
        g = b[++d], ya(a, b, c, d, e, f, g, h);
      }
    }
  } else {
    e.db && e.remove(f);
  }
}
;function Aa(a, b, c, d, e, f, g) {
  const h = a.length;
  let k = [], l;
  var m;
  l = B();
  for (let p = 0, n, q, t, r; p < b; p++) {
    for (let u = 0; u < h; u++) {
      if (t = a[u], p < t.length && (n = t[p])) {
        for (let x = 0; x < n.length; x++) {
          q = n[x], (m = l[q]) ? l[q]++ : (m = 0, l[q] = 1), r = k[m] || (k[m] = []), g || (m = p + (u ? 0 : f || 0), r = r[m] || (r[m] = [])), r.push(q);
        }
      }
    }
  }
  if (a = k.length) {
    if (e) {
      k = 1 < k.length ? Ba(k, d, c, g, 0) : (k = k[0]).length > c || d ? k.slice(d, c + d) : k;
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
          for (let p = 0, n; p < k.length; p++) {
            if (n = k[p], n.length > d) {
              d -= n.length;
            } else {
              if (n.length > c || d) {
                n = n.slice(d, c + d), c -= n.length, d && (d -= n.length);
              }
              e.push(n);
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
function Ba(a, b, c, d, e) {
  const f = [], g = B();
  let h;
  var k = a.length;
  let l, m = 0;
  if (d) {
    for (e = k - 1; 0 <= e; e--) {
      for (d = a[e], l = d.length, k = 0; k < l; k++) {
        if (h = d[k], !g[h]) {
          if (g[h] = 1, b) {
            b--;
          } else {
            if (f.push(h), f.length === c) {
              return f;
            }
          }
        }
      }
    }
  } else {
    let p = ca(a);
    for (let n = 0; n < p; n++) {
      for (let q = k - 1; 0 <= q; q--) {
        if (l = (d = a[q][n]) && d.length) {
          for (let t = 0; t < l; t++) {
            if (h = d[t], !g[h]) {
              if (g[h] = 1, b) {
                b--;
              } else {
                let r = n + (q < k - 1 ? e || 0 : 0);
                (f[r] || (f[r] = [])).push(h);
                if (++m === c) {
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
function Ca(a, b) {
  const c = B(), d = [];
  for (let e = 0, f; e < b.length; e++) {
    f = b[e];
    for (let g = 0; g < f.length; g++) {
      c[f[g]] = 1;
    }
  }
  for (let e = 0, f; e < a.length; e++) {
    f = a[e], 1 === c[f] && (d.push(f), c[f] = 2);
  }
  return d;
}
;T.prototype.search = function(a, b, c, d) {
  c || (!b && H(a) ? (c = a, a = "") : H(b) && (c = b, b = 0));
  let e = [], f = [], g;
  let h;
  let k;
  let l, m = 0, p;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    g = c.pluck;
    h = c.merge;
    k = g || c.field || c.index;
    var n = this.tag && c.tag;
    var q = this.store && c.enrich;
    var t = c.suggest;
    p = c.highlight;
    b = c.limit || b;
    l = c.offset || 0;
    b || (b = 100);
    if (n && (!this.db || !d)) {
      n.constructor !== Array && (n = [n]);
      var r = [];
      for (let y = 0, w; y < n.length; y++) {
        w = n[y];
        if (G(w)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (w.field && w.tag) {
          var u = w.tag;
          if (u.constructor === Array) {
            for (var x = 0; x < u.length; x++) {
              r.push(w.field, u[x]);
            }
          } else {
            r.push(w.field, u);
          }
        } else {
          u = Object.keys(w);
          for (let A = 0, I, C; A < u.length; A++) {
            if (I = u[A], C = w[I], C.constructor === Array) {
              for (x = 0; x < C.length; x++) {
                r.push(I, C[x]);
              }
            } else {
              r.push(I, C);
            }
          }
        }
      }
      if (!r.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      n = r;
      if (!a) {
        t = [];
        if (r.length) {
          for (n = 0; n < r.length; n += 2) {
            if (this.db) {
              d = this.index.get(r[n]);
              if (!d) {
                console.warn("Tag '" + r[n] + ":" + r[n + 1] + "' will be skipped because there is no field '" + r[n] + "'.");
                continue;
              }
              t.push(d = d.db.tag(r[n + 1], b, l, q));
            } else {
              d = Da.call(this, r[n], r[n + 1], b, l, q);
            }
            e.push({field:r[n], tag:r[n + 1], result:d});
          }
        }
        return t.length ? Promise.all(t).then(function(y) {
          for (let w = 0; w < y.length; w++) {
            e[w].result = y[w];
          }
          return e;
        }) : e;
      }
    }
    G(k) && (k = [k]);
  }
  k || (k = this.field);
  r = !d && (this.worker || this.db) && [];
  let D;
  for (let y = 0, w, A, I; y < k.length; y++) {
    A = k[y];
    if (this.db && this.tag && !this.D[y]) {
      continue;
    }
    let C;
    G(A) || (C = A, A = C.field, a = C.query || a, b = C.limit || b, l = C.offset || l, t = C.suggest || t, q = this.store && (C.enrich || q));
    if (d) {
      w = d[y];
    } else {
      if (u = C || c, x = this.index.get(A), n && (this.db && (u.tag = n, D = x.db.support_tag_search, u.field = k), D || (u.enrich = !1)), r) {
        r[y] = x.search(a, b, u);
        u && q && (u.enrich = q);
        continue;
      } else {
        w = x.search(a, b, u), u && q && (u.enrich = q);
      }
    }
    I = w && w.length;
    if (n && I) {
      u = [];
      x = 0;
      if (this.db && d) {
        if (!D) {
          for (let E = k.length; E < d.length; E++) {
            let F = d[E];
            if (F && F.length) {
              x++, u.push(F);
            } else if (!t) {
              return e;
            }
          }
        }
      } else {
        for (let E = 0, F, ib; E < n.length; E += 2) {
          F = this.tag.get(n[E]);
          if (!F) {
            if (console.warn("Tag '" + n[E] + ":" + n[E + 1] + "' will be skipped because there is no field '" + n[E] + "'."), t) {
              continue;
            } else {
              return e;
            }
          }
          if (ib = (F = F && F.get(n[E + 1])) && F.length) {
            x++, u.push(F);
          } else if (!t) {
            return e;
          }
        }
      }
      if (x) {
        w = Ca(w, u);
        I = w.length;
        if (!I && !t) {
          return e;
        }
        x--;
      }
    }
    if (I) {
      f[m] = A, e.push(w), m++;
    } else if (1 === k.length) {
      return e;
    }
  }
  if (r) {
    if (this.db && n && n.length && !D) {
      for (q = 0; q < n.length; q += 2) {
        d = this.index.get(n[q]);
        if (!d) {
          if (console.warn("Tag '" + n[q] + ":" + n[q + 1] + "' was not found because there is no field '" + n[q] + "'."), t) {
            continue;
          } else {
            return e;
          }
        }
        r.push(d.db.tag(n[q + 1], b, l, !1));
      }
    }
    const y = this;
    return Promise.all(r).then(function(w) {
      return w.length ? y.search(a, b, c, w) : w;
    });
  }
  if (!m) {
    return e;
  }
  if (g && (!q || !this.store)) {
    return e[0];
  }
  r = [];
  for (let y = 0, w; y < f.length; y++) {
    w = e[y];
    q && w.length && !w[0].doc && (this.db ? r.push(w = this.index.get(this.field[0]).db.enrich(w)) : w.length && (w = Ea.call(this, w)));
    if (g) {
      return w;
    }
    e[y] = {field:f[y], result:w};
  }
  if (q && this.db && r.length) {
    const y = this;
    return Promise.all(r).then(function(w) {
      for (let A = 0; A < w.length; A++) {
        e[A].result = w[A];
      }
      return h ? Fa(e, b) : p ? Ga(e, a, y.index, y.field, y.D, p) : e;
    });
  }
  return h ? Fa(e, b) : p ? Ga(e, a, this.index, this.field, this.D, p) : e;
};
function Ga(a, b, c, d, e, f) {
  let g, h, k;
  for (let m = 0, p, n, q, t, r; m < a.length; m++) {
    p = a[m].result;
    n = a[m].field;
    t = c.get(n);
    q = t.encoder;
    k = t.tokenize;
    r = e[d.indexOf(n)];
    q !== g && (g = q, h = g.encode(b));
    for (let u = 0; u < p.length; u++) {
      let x = "";
      var l = J(p[u].doc, r);
      let D = g.encode(l);
      l = l.split(g.split);
      for (let y = 0, w, A; y < D.length; y++) {
        w = D[y];
        A = l[y];
        let I;
        for (let C = 0, E; C < h.length; C++) {
          if (E = h[C], "strict" === k) {
            if (w === E) {
              x += (x ? " " : "") + f.replace("$1", A);
              I = !0;
              break;
            }
          } else {
            const F = w.indexOf(E);
            if (-1 < F) {
              x += (x ? " " : "") + A.substring(0, F) + f.replace("$1", A.substring(F, E.length)) + A.substring(F + E.length);
              I = !0;
              break;
            }
          }
        }
        I || (x += (x ? " " : "") + l[y]);
      }
      p[u].highlight = x;
    }
  }
  return a;
}
function Fa(a, b) {
  const c = [], d = B();
  for (let e = 0, f, g; e < a.length; e++) {
    f = a[e];
    g = f.result;
    for (let h = 0, k, l, m; h < g.length; h++) {
      if (l = g[h], k = l.id, m = d[k]) {
        m.push(f.field);
      } else {
        if (c.length === b) {
          return c;
        }
        l.field = d[k] = [f.field];
        c.push(l);
      }
    }
  }
  return c;
}
function Da(a, b, c, d, e) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(b)) && f.length - d) && 0 < a) {
    if (a > c || d) {
      f = f.slice(d, d + c);
    }
    e && (f = Ea.call(this, f));
    return f;
  }
}
function Ea(a) {
  const b = Array(a.length);
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {id:d, doc:this.store.get(d)};
  }
  return b;
}
;function T(a) {
  if (!this || this.constructor !== T) {
    return new T(a);
  }
  const b = a.document || a.doc || a;
  let c, d;
  this.D = [];
  this.field = [];
  this.K = [];
  this.key = (c = b.key || b.id) && Ha(c, this.K) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.reg = (this.fastupdate = !!a.fastupdate) ? d ? new R(d) : new Map() : d ? new S(d) : new Set();
  this.C = (c = b.store || null) && !0 !== c && [];
  this.store = c && (d ? new R(d) : new Map());
  this.cache = (c = a.cache || null) && new U(c);
  a.cache = !1;
  this.worker = a.worker;
  this.index = Ia.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.G = [];
      this.N = [];
      for (let e = 0, f, g; e < c.length; e++) {
        f = c[e];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.G[e] = f.custom : (this.G[e] = Ha(g, this.K), f.filter && ("string" === typeof this.G[e] && (this.G[e] = new String(this.G[e])), this.G[e].I = f.filter));
        this.N[e] = g;
        this.tag.set(g, new Map());
      }
    }
  }
  if (this.worker) {
    a = [];
    for (const e of this.index.values()) {
      e.then && a.push(e);
    }
    if (a.length) {
      const e = this;
      return Promise.all(a).then(function(f) {
        let g = 0;
        for (const h of e.index.entries()) {
          const k = h[0];
          h[1].then && e.index.set(k, f[g++]);
        }
        return e;
      });
    }
  } else {
    a.db && this.mount(a.db);
  }
}
v = T.prototype;
v.mount = function(a) {
  let b = this.field;
  if (this.tag) {
    for (let e = 0, f; e < this.N.length; e++) {
      f = this.N[e];
      var c = void 0;
      this.index.set(f, c = new L({}, this.reg));
      b === this.field && (b = b.slice(0));
      b.push(f);
      c.tag = this.tag.get(f);
    }
  }
  c = [];
  const d = {db:a.db, type:a.type, fastupdate:a.fastupdate};
  for (let e = 0, f, g; e < b.length; e++) {
    d.field = g = b[e];
    f = this.index.get(g);
    const h = new a.constructor(a.id, d);
    h.id = a.id;
    c[e] = h.mount(f);
    f.document = !0;
    e ? f.bypass = !0 : f.store = this.store;
  }
  this.db = !0;
  return Promise.all(c);
};
v.commit = async function(a, b) {
  const c = [];
  for (const d of this.index.values()) {
    c.push(d.db.commit(d, a, b));
  }
  await Promise.all(c);
  this.reg.clear();
};
v.destroy = function() {
  const a = [];
  for (const b of this.index.values()) {
    a.push(b.destroy());
  }
  return Promise.all(a);
};
function Ia(a, b) {
  const c = new Map();
  let d = b.index || b.field || b;
  G(d) && (d = [d]);
  for (let e = 0, f, g; e < d.length; e++) {
    f = d[e];
    G(f) || (g = f, f = f.field);
    g = H(g) ? Object.assign({}, a, g) : a;
    if (this.worker) {
      const h = new N(g);
      c.set(f, h);
    }
    this.worker || c.set(f, new L(g, this.reg));
    g.custom ? this.D[e] = g.custom : (this.D[e] = Ha(f, this.K), g.filter && ("string" === typeof this.D[e] && (this.D[e] = new String(this.D[e])), this.D[e].I = g.filter));
    this.field[e] = f;
  }
  if (this.C) {
    a = b.store;
    G(a) && (a = [a]);
    for (let e = 0, f, g; e < a.length; e++) {
      f = a[e], g = f.field || f, f.custom ? (this.C[e] = f.custom, f.custom.U = g) : (this.C[e] = Ha(g, this.K), f.filter && ("string" === typeof this.C[e] && (this.C[e] = new String(this.C[e])), this.C[e].I = f.filter));
    }
  }
  return c;
}
function Ha(a, b) {
  const c = a.split(":");
  let d = 0;
  for (let e = 0; e < c.length; e++) {
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
  H(a) && (a = J(a, this.key));
  for (var b of this.index.values()) {
    b.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (let c of this.tag.values()) {
        for (let d of c) {
          b = d[0];
          const e = d[1], f = e.indexOf(a);
          -1 < f && (1 < e.length ? e.splice(f, 1) : c.delete(b));
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
  for (const a of this.index.values()) {
    a.clear();
  }
  if (this.tag) {
    for (const a of this.tag.values()) {
      a.clear();
    }
  }
  this.store && this.store.clear();
  return this;
};
v.contain = function(a) {
  return this.db ? this.index.get(this.field[0]).db.has(a) : this.reg.has(a);
};
v.cleanup = function() {
  for (const a of this.index.values()) {
    a.cleanup();
  }
  return this;
};
v.get = function(a) {
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(b) {
    return b[0] && b[0].doc;
  }) : this.store.get(a);
};
v.set = function(a, b) {
  this.store.set(a, b);
  return this;
};
v.searchCache = Ja;
v.export = function(a, b, c = 0, d = 0) {
  if (c < this.field.length) {
    const g = this.field[c];
    if ((b = this.index.get(g).export(a, g, c, d = 1)) && b.then) {
      const h = this;
      return b.then(function() {
        return h.export(a, g, c + 1);
      });
    }
    return this.export(a, g, c + 1);
  }
  let e, f;
  switch(d) {
    case 0:
      e = "reg";
      f = sa(this.reg);
      b = null;
      break;
    case 1:
      e = "tag";
      f = qa(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      e = "doc";
      f = oa(this.store);
      b = null;
      break;
    case 3:
      e = "cfg";
      f = {};
      b = null;
      break;
    default:
      return;
  }
  return ua.call(this, a, b, e, f, c, d);
};
v.import = function(a, b) {
  if (b) {
    G(b) && (b = JSON.parse(b));
    a = a.split(".");
    "json" === a[a.length - 1] && a.pop();
    var c = 2 < a.length ? a[0] : "";
    a = 2 < a.length ? a[2] : a[1];
    if (c) {
      return this.index.get(c).import(a, b);
    }
    switch(a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = ta(b, this.reg);
        for (let d = 0, e; d < this.field.length; d++) {
          e = this.index.get(this.field[d]), e.fastupdate = !1, e.reg = this.reg;
        }
        break;
      case "tag":
        this.tag = ra(b, this.tag);
        break;
      case "doc":
        this.store = pa(b, this.store);
    }
  }
};
na(T.prototype);
function Ja(a, b, c) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  let d = this.cache.get(a);
  if (!d) {
    d = this.search(a, b, c);
    if (d.then) {
      const e = this;
      d.then(function(f) {
        e.cache.set(a, f);
        return f;
      });
    }
    this.cache.set(a, d);
  }
  return d;
}
function U(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
U.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
U.prototype.get = function(a) {
  const b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
U.prototype.remove = function(a) {
  for (const b of this.cache) {
    const c = b[0];
    b[1].includes(a) && this.cache.delete(c);
  }
};
U.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const Ka = {normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1};
const La = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const Ma = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["pf", "f"]]), Na = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /([^0-9])\1+/g, "$1"];
const Oa = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const Pa = /[\x00-\x7F]+/g;
const Qa = /[\x00-\x7F]+/g;
const Ra = /[\x00-\x7F]+/g;
var Sa = {LatinExact:{normalize:!1, dedupe:!1}, LatinDefault:Ka, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:La}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:La, matcher:Ma, replacer:Na}, LatinExtra:{normalize:!0, dedupe:!0, mapper:La, replacer:Na.concat([/(?!^)[aeo]/g, ""]), matcher:Ma}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let d = b.charAt(0), e = Oa[d];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = Oa[g]) || g === e || (d += g, e = g, 4 !== d.length)); f++) {
    }
    a[c] = d;
  }
}}, ArabicDefault:{rtl:!0, normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(Pa, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(Qa, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(Ra, " ");
}}};
const Ta = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
B();
L.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (d = b.length) {
      const l = B(), m = B(), p = this.depth, n = this.resolution;
      for (let q = 0; q < d; q++) {
        let t = b[this.rtl ? d - 1 - q : q];
        var e = t.length;
        if (e && (p || !m[t])) {
          var f = this.score ? this.score(b, t, q, null, 0) : Ua(n, d, q), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (f = 0; f < e; f++) {
                  for (var h = e; h > f; h--) {
                    g = t.substring(f, h);
                    var k = this.score ? this.score(b, t, q, g, f) : Ua(n, d, q, e, f);
                    V(this, m, g, k, a, c);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  g = t[h] + g, k = this.score ? this.score(b, t, q, g, h) : Ua(n, d, q, e, h), V(this, m, g, k, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  g += t[h], V(this, m, g, f, a, c);
                }
                break;
              }
            default:
              if (V(this, m, t, f, a, c), p && 1 < d && q < d - 1) {
                for (e = B(), g = this.R, f = t, h = Math.min(p + 1, d - q), e[f] = 1, k = 1; k < h; k++) {
                  if ((t = b[this.rtl ? d - 1 - q - k : q + k]) && !e[t]) {
                    e[t] = 1;
                    const r = this.score ? this.score(b, f, q, t, k) : Ua(g + (d / 2 > g ? 0 : 1), d, q, h - 1, k - 1), u = this.bidirectional && t > f;
                    V(this, l, u ? f : t, r, a, c, u ? t : f);
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
  this.db && (b || this.commit_task.push({del:a}), this.T && Va(this));
  return this;
};
function V(a, b, c, d, e, f, g) {
  let h = g ? a.ctx : a.map, k;
  if (!b[c] || g && !(k = b[c])[g]) {
    if (g ? (b = k || (b[c] = B()), b[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : b[c] = 1, (k = h.get(c)) ? h = k : h.set(c, h = k = []), h = h[d] || (h[d] = []), !f || !h.includes(e)) {
      if (h.length === 2 ** 31 - 1) {
        b = new Q(h);
        if (a.fastupdate) {
          for (let l of a.reg.values()) {
            l.includes(h) && (l[l.indexOf(h)] = b);
          }
        }
        k[d] = h = b;
      }
      h.push(e);
      a.fastupdate && ((d = a.reg.get(e)) ? d.push(h) : a.reg.set(e, [h]));
    }
  }
}
function Ua(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;function W(a, b, c, d) {
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a, d ? Wa(a) : a;
  }
  let e = [];
  for (let f = 0, g, h; f < a.length; f++) {
    if ((g = a[f]) && (h = g.length)) {
      if (c) {
        if (c >= h) {
          c -= h;
          continue;
        }
        c < h && (g = b ? g.slice(c, c + b) : g.slice(c), h = g.length, c = 0);
      }
      if (e.length) {
        h > b && (g = g.slice(0, b), h = g.length), e.push(g);
      } else {
        if (h >= b) {
          return h > b && (g = g.slice(0, b)), d ? Wa(g) : g;
        }
        e = [g];
      }
      b -= h;
      if (!b) {
        break;
      }
    }
  }
  if (!e.length) {
    return e;
  }
  e = 1 < e.length ? [].concat.apply([], e) : e[0];
  return d ? Wa(e) : e;
}
function Wa(a) {
  for (let b = 0; b < a.length; b++) {
    a[b] = {score:b, id:a[b]};
  }
  return a;
}
;X.prototype.or = function() {
  const a = this;
  let b = arguments;
  var c = b[0];
  if (c.then) {
    return c.then(function() {
      return a.or.apply(a, b);
    });
  }
  if (c[0] && c[0].index) {
    return this.or.apply(this, c);
  }
  let d = [];
  c = [];
  let e = 0, f = 0, g, h;
  for (let k = 0, l; k < b.length; k++) {
    if (l = b[k]) {
      e = l.limit || 0;
      f = l.offset || 0;
      g = l.enrich;
      h = l.resolve;
      let m;
      if (l.constructor === X) {
        m = l.result;
      } else if (l.constructor === Array) {
        m = l;
      } else if (l.index) {
        l.resolve = !1, m = l.index.search(l).result;
      } else if (l.and) {
        m = this.and(l.and);
      } else if (l.xor) {
        m = this.xor(l.xor);
      } else if (l.not) {
        m = this.not(l.not);
      } else {
        continue;
      }
      d[k] = m;
      m.then && c.push(m);
    }
  }
  if (c.length) {
    return Promise.all(c).then(function() {
      a.result.length && (d = d.concat([a.result]));
      a.result = Xa(d, e, f, g, h, a.F);
      return h ? a.result : a;
    });
  }
  d.length && (this.result.length && (d = d.concat([this.result])), this.result = Xa(d, e, f, g, h, this.F));
  return h ? this.result : this;
};
function Xa(a, b, c, d, e, f) {
  if (!a.length) {
    return a;
  }
  "object" === typeof b && (c = b.offset || 0, d = b.enrich || !1, b = b.limit || 0);
  return 2 > a.length ? e ? W(a[0], b, c, d) : a[0] : Ba(a, c, b, e, f);
}
;X.prototype.and = function() {
  if (this.result.length) {
    const b = this;
    let c = arguments;
    var a = c[0];
    if (a.then) {
      return a.then(function() {
        return b.and.apply(b, c);
      });
    }
    if (a[0] && a[0].index) {
      return this.and.apply(this, a);
    }
    let d = [];
    a = [];
    let e = 0, f = 0, g, h;
    for (let k = 0, l; k < c.length; k++) {
      if (l = c[k]) {
        e = l.limit || 0;
        f = l.offset || 0;
        g = l.resolve;
        h = l.suggest;
        let m;
        if (l.constructor === X) {
          m = l.result;
        } else if (l.constructor === Array) {
          m = l;
        } else if (l.index) {
          l.resolve = !1, m = l.index.search(l).result;
        } else if (l.or) {
          m = this.or(l.or);
        } else if (l.xor) {
          m = this.xor(l.xor);
        } else if (l.not) {
          m = this.not(l.not);
        } else {
          continue;
        }
        d[k] = m;
        m.then && a.push(m);
      }
    }
    if (!d.length) {
      return this.result = d, g ? this.result : this;
    }
    if (a.length) {
      return Promise.all(a).then(function() {
        d = [b.result].concat(d);
        b.result = Ya(d, e, f, g, b.F, h);
        return g ? b.result : b;
      });
    }
    d = [this.result].concat(d);
    this.result = Ya(d, e, f, g, this.F, h);
    return g ? this.result : this;
  }
  return this;
};
function Ya(a, b, c, d, e, f) {
  if (2 > a.length) {
    return [];
  }
  let g = [];
  B();
  let h = ca(a);
  return h ? Aa(a, h, b, c, f, e, d) : g;
}
;X.prototype.xor = function() {
  const a = this;
  let b = arguments;
  var c = b[0];
  if (c.then) {
    return c.then(function() {
      return a.xor.apply(a, b);
    });
  }
  if (c[0] && c[0].index) {
    return this.xor.apply(this, c);
  }
  let d = [];
  c = [];
  let e = 0, f = 0, g, h;
  for (let k = 0, l; k < b.length; k++) {
    if (l = b[k]) {
      e = l.limit || 0;
      f = l.offset || 0;
      g = l.enrich;
      h = l.resolve;
      let m;
      if (l.constructor === X) {
        m = l.result;
      } else if (l.constructor === Array) {
        m = l;
      } else if (l.index) {
        l.resolve = !1, m = l.index.search(l).result;
      } else if (l.or) {
        m = this.or(l.or);
      } else if (l.and) {
        m = this.and(l.and);
      } else if (l.not) {
        m = this.not(l.not);
      } else {
        continue;
      }
      d[k] = m;
      m.then && c.push(m);
    }
  }
  if (c.length) {
    return Promise.all(c).then(function() {
      a.result.length && (d = [a.result].concat(d));
      a.result = Za(d, e, f, g, !h, a.F);
      return h ? a.result : a;
    });
  }
  d.length && (this.result.length && (d = [this.result].concat(d)), this.result = Za(d, e, f, g, !h, a.F));
  return h ? this.result : this;
};
function Za(a, b, c, d, e, f) {
  if (!a.length) {
    return a;
  }
  if (2 > a.length) {
    return e ? W(a[0], b, c, d) : a[0];
  }
  d = [];
  const g = B();
  let h = 0;
  for (let k = 0, l; k < a.length; k++) {
    if (l = a[k]) {
      for (let m = 0, p; m < l.length; m++) {
        if (p = l[m]) {
          h < p.length && (h = p.length);
          for (let n = 0, q; n < p.length; n++) {
            q = p[n], g[q] ? g[q]++ : g[q] = 1;
          }
        }
      }
    }
  }
  for (let k = 0, l, m = 0; k < h; k++) {
    for (let p = 0, n; p < a.length; p++) {
      if (n = a[p]) {
        if (l = n[k]) {
          for (let q = 0, t; q < l.length; q++) {
            if (t = l[q], 1 === g[t]) {
              if (c) {
                c--;
              } else {
                if (e) {
                  if (d.push(t), d.length === b) {
                    return d;
                  }
                } else {
                  const r = k + (p ? f : 0);
                  d[r] || (d[r] = []);
                  d[r].push(t);
                  if (++m === b) {
                    return d;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return d;
}
;X.prototype.not = function() {
  const a = this;
  let b = arguments;
  var c = b[0];
  if (c.then) {
    return c.then(function() {
      return a.not.apply(a, b);
    });
  }
  if (c[0] && c[0].index) {
    return this.not.apply(this, c);
  }
  let d = [];
  c = [];
  let e = 0, f = 0, g;
  for (let h = 0, k; h < b.length; h++) {
    if (k = b[h]) {
      e = k.limit || 0;
      f = k.offset || 0;
      g = k.resolve;
      let l;
      if (k.constructor === X) {
        l = k.result;
      } else if (k.constructor === Array) {
        l = k;
      } else if (k.index) {
        k.resolve = !1, l = k.index.search(k).result;
      } else if (k.or) {
        l = this.or(k.or);
      } else if (k.and) {
        l = this.and(k.and);
      } else if (k.xor) {
        l = this.xor(k.xor);
      } else {
        continue;
      }
      d[h] = l;
      l.then && c.push(l);
    }
  }
  if (c.length) {
    return Promise.all(c).then(function() {
      a.result = $a.call(a, d, e, f, g);
      return g ? a.result : a;
    });
  }
  d.length && (this.result = $a.call(this, d, e, f, g));
  return g ? this.result : this;
};
function $a(a, b, c, d) {
  if (!a.length) {
    return this.result;
  }
  const e = [];
  a = new Set(a.flat().flat());
  for (let f = 0, g, h = 0; f < this.result.length; f++) {
    if (g = this.result[f]) {
      for (let k = 0, l; k < g.length; k++) {
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
;function X(a) {
  if (!this || this.constructor !== X) {
    return new X(a);
  }
  if (a && a.index) {
    return a.resolve = !1, this.index = a.index, this.F = a.boost || 0, this.result = a.index.search(a).result, this;
  }
  if (a.constructor === X) {
    return a;
  }
  this.index = null;
  this.result = a || [];
  this.F = 0;
}
X.prototype.limit = function(a) {
  if (this.result.length) {
    const b = [];
    let c = 0;
    for (let d = 0, e; d < this.result.length; d++) {
      if (e = this.result[d], e.length + c < a) {
        b[d] = e, c += e.length;
      } else {
        b[d] = e.slice(0, a - c);
        this.result = b;
        break;
      }
    }
  }
  return this;
};
X.prototype.offset = function(a) {
  if (this.result.length) {
    const b = [];
    let c = 0;
    for (let d = 0, e; d < this.result.length; d++) {
      e = this.result[d], e.length + c < a ? c += e.length : (b[d] = e.slice(a - c), c = a);
    }
    this.result = b;
  }
  return this;
};
X.prototype.boost = function(a) {
  this.F += a;
  return this;
};
X.prototype.resolve = function(a, b, c) {
  ab = 1;
  const d = this.result;
  this.result = this.index = null;
  return d.length ? ("object" === typeof a && (c = a.enrich, b = a.offset, a = a.limit), W(d, a || 100, b, c)) : d;
};
let ab = 1;
L.prototype.search = function(a, b, c) {
  c || (!b && H(a) ? (c = a, a = "") : H(b) && (c = b, b = 0));
  let d = [], e;
  let f, g = 0, h, k, l, m;
  if (c) {
    a = c.query || a;
    b = c.limit || b;
    g = c.offset || 0;
    var p = c.context;
    f = c.suggest;
    (h = ab && !1 !== c.resolve) || (ab = 0);
    k = h && c.enrich;
    m = c.boost;
    l = this.db && c.tag;
  } else {
    h = this.resolve || ab;
  }
  a = this.encoder.encode(a);
  e = a.length;
  b || !h || (b = 100);
  if (1 === e) {
    return bb.call(this, a[0], "", b, g, h, k, l);
  }
  p = this.depth && !1 !== p;
  if (2 === e && p && !f) {
    return bb.call(this, a[0], a[1], b, g, h, k, l);
  }
  let n = c = 0;
  if (1 < e) {
    const r = B(), u = [];
    for (let x = 0, D; x < e; x++) {
      if ((D = a[x]) && !r[D]) {
        if (f || this.db || Y(this, D)) {
          u.push(D), r[D] = 1;
        } else {
          return h ? d : new X(d);
        }
        const y = D.length;
        c = Math.max(c, y);
        n = n ? Math.min(n, y) : y;
      }
    }
    a = u;
    e = a.length;
  }
  if (!e) {
    return h ? d : new X(d);
  }
  let q = 0, t;
  if (1 === e) {
    return bb.call(this, a[0], "", b, g, h, k, l);
  }
  if (2 === e && p && !f) {
    return bb.call(this, a[0], a[1], b, g, h, k, l);
  }
  1 < e && (p ? (t = a[0], q = 1) : 9 < c && 3 < c / n && a.sort(aa));
  if (this.db) {
    if (this.db.search && (p = this.db.search(this, a, b, g, f, h, k, l), !1 !== p)) {
      return p;
    }
    const r = this;
    return async function() {
      for (let u, x; q < e; q++) {
        x = a[q];
        t ? (u = await Y(r, x, t, 0, 0, !1, !1), u = cb(u, d, f, r.R), f && !1 === u && d.length || (t = x)) : (u = await Y(r, x, "", 0, 0, !1, !1), u = cb(u, d, f, r.resolution));
        if (u) {
          return u;
        }
        if (f && q === e - 1) {
          let D = d.length;
          if (!D) {
            if (t) {
              t = "";
              q = -1;
              continue;
            }
            return d;
          }
          if (1 === D) {
            return h ? W(d[0], b, g) : new X(d[0]);
          }
        }
      }
      return h ? Aa(d, r.resolution, b, g, f, m, h) : new X(d[0]);
    }();
  }
  for (let r, u; q < e; q++) {
    u = a[q];
    t ? (r = Y(this, u, t, 0, 0, !1, !1), r = cb(r, d, f, this.R), f && !1 === r && d.length || (t = u)) : (r = Y(this, u, "", 0, 0, !1, !1), r = cb(r, d, f, this.resolution));
    if (r) {
      return r;
    }
    if (f && q === e - 1) {
      p = d.length;
      if (!p) {
        if (t) {
          t = "";
          q = -1;
          continue;
        }
        return d;
      }
      if (1 === p) {
        return h ? W(d[0], b, g) : new X(d[0]);
      }
    }
  }
  d = Aa(d, this.resolution, b, g, f, m, h);
  return h ? d : new X(d);
};
function bb(a, b, c, d, e, f, g) {
  a = Y(this, a, b, c, d, e, f, g);
  return this.db ? a.then(function(h) {
    return e ? h : h && h.length ? e ? W(h, c, d) : new X(h) : e ? [] : new X([]);
  }) : a && a.length ? e ? W(a, c, d) : new X(a) : e ? [] : new X([]);
}
function cb(a, b, c, d) {
  let e = [];
  if (a) {
    d = Math.min(a.length, d);
    for (let f = 0, g; f < d; f++) {
      (g = a[f]) && g && (e[f] = g);
    }
    if (e.length) {
      b.push(e);
      return;
    }
  }
  return !c && e;
}
function Y(a, b, c, d, e, f, g, h) {
  let k;
  c && (k = a.bidirectional && b > c);
  if (a.db) {
    return c ? a.db.get(k ? c : b, k ? b : c, d, e, f, g, h) : a.db.get(b, "", d, e, f, g, h);
  }
  a = c ? (a = a.ctx.get(k ? b : c)) && a.get(k ? c : b) : a.map.get(b);
  return a;
}
;L.prototype.remove = function(a, b) {
  const c = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (c) {
    if (this.fastupdate) {
      for (let d = 0, e; d < c.length; d++) {
        if (e = c[d]) {
          if (2 > e.length) {
            e.pop();
          } else {
            const f = e.indexOf(a);
            f === c.length - 1 ? e.pop() : e.splice(f, 1);
          }
        }
      }
    } else {
      db(this.map, a), this.depth && db(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.T && Va(this));
  this.cache && this.cache.remove(a);
  return this;
};
function db(a, b) {
  let c = 0;
  if (a.constructor === Array) {
    for (let d = 0, e, f; d < a.length; d++) {
      if ((e = a[d]) && e.length) {
        if (f = e.indexOf(b), 0 <= f) {
          1 < e.length ? (e.splice(f, 1), c++) : delete a[d];
          break;
        } else {
          c++;
        }
      }
    }
  } else {
    for (let d of a) {
      const e = d[0], f = db(d[1], b);
      f ? c += f : a.delete(e);
    }
  }
  return c;
}
;function L(a, b) {
  if (!this || this.constructor !== L) {
    return new L(a);
  }
  if (a) {
    var c = G(a) ? a : a.preset;
    c && (Ta[c] || console.warn("Preset not found: " + c), a = Object.assign({}, Ta[c], a));
  } else {
    a = {};
  }
  c = a.context || {};
  const d = G(a.encoder) ? Sa[a.encoder] : a.encode || a.encoder || Ka;
  this.encoder = d.encode ? d : "object" === typeof d ? new K(d) : {encode:d};
  let e;
  this.resolution = a.resolution || 9;
  this.tokenize = e = a.tokenize || "strict";
  this.depth = "strict" === e && c.depth || 0;
  this.bidirectional = !1 !== c.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  (e = a.keystore || 0) && (this.keystore = e);
  this.map = e ? new R(e) : new Map();
  this.ctx = e ? new R(e) : new Map();
  this.reg = b || (this.fastupdate ? e ? new R(e) : new Map() : e ? new S(e) : new Set());
  this.R = c.resolution || 1;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (e = a.cache || null) && new U(e);
  this.resolve = !1 !== a.resolve;
  if (e = a.db) {
    this.db = this.mount(e);
  }
  this.T = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
}
v = L.prototype;
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
function Va(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a, void 0, void 0);
  }, 0));
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
  const c = this, d = this.remove(a);
  return d && d.then ? d.then(() => c.add(a, b)) : this.add(a, b);
};
function eb(a) {
  let b = 0;
  if (a.constructor === Array) {
    for (let c = 0, d; c < a.length; c++) {
      (d = a[c]) && (b += d.length);
    }
  } else {
    for (const c of a) {
      const d = c[0], e = eb(c[1]);
      e ? b += e : a.delete(d);
    }
  }
  return b;
}
v.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  eb(this.map);
  this.depth && eb(this.ctx);
  return this;
};
v.searchCache = Ja;
v.export = function(a, b, c, d = 0) {
  let e, f;
  switch(d) {
    case 0:
      e = "reg";
      f = sa(this.reg);
      break;
    case 1:
      e = "cfg";
      f = {};
      break;
    case 2:
      e = "map";
      f = oa(this.map, this.reg.size);
      break;
    case 3:
      e = "ctx";
      f = qa(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return ua.call(this, a, b, e, f, c, d);
};
v.import = function(a, b) {
  if (b) {
    switch(G(b) && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = ta(b, this.reg);
        break;
      case "map":
        this.map = pa(b, this.map);
        break;
      case "ctx":
        this.ctx = ra(b, this.ctx);
    }
  }
};
v.serialize = function(a = !0) {
  if (!this.reg.size) {
    return "";
  }
  let b = "", c = "";
  for (var d of this.reg.keys()) {
    c || (c = typeof d), b += (b ? "," : "") + ("string" === c ? '"' + d + '"' : d);
  }
  b = "index.reg=new Set([" + b + "]);";
  d = "";
  for (var e of this.map.entries()) {
    var f = e[0], g = e[1], h = "";
    for (let m = 0, p; m < g.length; m++) {
      p = g[m] || [""];
      var k = "";
      for (var l = 0; l < p.length; l++) {
        k += (k ? "," : "") + ("string" === c ? '"' + p[l] + '"' : p[l]);
      }
      k = "[" + k + "]";
      h += (h ? "," : "") + k;
    }
    h = '["' + f + '",[' + h + "]]";
    d += (d ? "," : "") + h;
  }
  d = "index.map=new Map([" + d + "]);";
  e = "";
  for (const m of this.ctx.entries()) {
    f = m[0];
    g = m[1];
    for (const p of g.entries()) {
      g = p[0];
      h = p[1];
      k = "";
      for (let n = 0, q; n < h.length; n++) {
        q = h[n] || [""];
        l = "";
        for (let t = 0; t < q.length; t++) {
          l += (l ? "," : "") + ("string" === c ? '"' + q[t] + '"' : q[t]);
        }
        l = "[" + l + "]";
        k += (k ? "," : "") + l;
      }
      k = 'new Map([["' + g + '",[' + k + "]]])";
      k = '["' + f + '",' + k + "]";
      e += (e ? "," : "") + k;
    }
  }
  e = "index.ctx=new Map([" + e + "]);";
  return a ? "function inject(index){" + b + d + e + "}" : b + d + e;
};
na(L.prototype);
const fb = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), gb = ["map", "ctx", "tag", "reg", "cfg"];
function hb(a, b = {}) {
  if (!this) {
    return new hb(a, b);
  }
  "object" === typeof a && (b = a = a.name);
  a || console.info("Default storage space was used, because a name was not passed.");
  this.id = "flexsearch" + (a ? ":" + a.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "");
  this.field = b.field ? b.field.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "";
  this.support_tag_search = !1;
  this.db = null;
  this.h = {};
}
v = hb.prototype;
v.mount = function(a) {
  if (!a.encoder) {
    return a.mount(this);
  }
  a.db = this;
  return this.open();
};
v.open = function() {
  let a = this;
  navigator.storage && navigator.storage.persist();
  return this.db || new Promise(function(b, c) {
    const d = fb.open(a.id + (a.field ? ":" + a.field : ""), 1);
    d.onupgradeneeded = function() {
      const e = a.db = this.result;
      gb.forEach(f => {
        e.objectStoreNames.contains(f) || e.createObjectStore(f);
      });
    };
    d.onblocked = function(e) {
      console.error("blocked", e);
      c();
    };
    d.onerror = function(e) {
      console.error(this.error, e);
      c();
    };
    d.onsuccess = function() {
      a.db = this.result;
      a.db.onversionchange = function() {
        a.close();
      };
      b(a);
    };
  });
};
v.close = function() {
  this.db.close();
  this.db = null;
};
v.destroy = function() {
  return fb.deleteDatabase(this.id + (this.field ? ":" + this.field : ""));
};
v.clear = function() {
  const a = this.db.transaction(gb, "readwrite");
  for (let b = 0; b < gb.length; b++) {
    a.objectStore(gb[b]).clear();
  }
  return Z(a);
};
v.get = function(a, b, c = 0, d = 0, e = !0, f = !1) {
  a = this.db.transaction(b ? "ctx" : "map", "readonly").objectStore(b ? "ctx" : "map").get(b ? b + ":" + a : a);
  const g = this;
  return Z(a).then(function(h) {
    let k = [];
    if (!h || !h.length) {
      return k;
    }
    if (e) {
      if (!c && !d && 1 === h.length) {
        return h[0];
      }
      for (let l = 0, m; l < h.length; l++) {
        if ((m = h[l]) && m.length) {
          if (d >= m.length) {
            d -= m.length;
            continue;
          }
          const p = c ? d + Math.min(m.length - d, c) : m.length;
          for (let n = d; n < p; n++) {
            k.push(m[n]);
          }
          d = 0;
          if (k.length === c) {
            break;
          }
        }
      }
      return f ? g.enrich(k) : k;
    }
    return h;
  });
};
v.tag = function(a, b = 0, c = 0, d = !1) {
  a = this.db.transaction("tag", "readonly").objectStore("tag").get(a);
  const e = this;
  return Z(a).then(function(f) {
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
  const b = this.db.transaction("reg", "readonly").objectStore("reg"), c = [];
  for (let d = 0; d < a.length; d++) {
    c[d] = Z(b.get(a[d]));
  }
  return Promise.all(c).then(function(d) {
    for (let e = 0; e < d.length; e++) {
      d[e] = {id:a[e], doc:d[e] ? JSON.parse(d[e]) : null};
    }
    return d;
  });
};
v.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return Z(a);
};
v.search = null;
v.info = function() {
};
v.transaction = function(a, b, c) {
  let d = this.h[a + ":" + b];
  if (d) {
    return c.call(this, d);
  }
  let e = this.db.transaction(a, b);
  this.h[a + ":" + b] = d = e.objectStore(a);
  return new Promise((f, g) => {
    e.onerror = h => {
      this.h[a + ":" + b] = null;
      e.abort();
      e = d = null;
      g(h);
    };
    e.oncomplete = h => {
      e = d = this.h[a + ":" + b] = null;
      f(h || !0);
    };
    return c.call(this, d);
  });
};
v.commit = async function(a, b, c) {
  if (b) {
    await this.clear(), a.commit_task = [];
  } else {
    let d = a.commit_task;
    a.commit_task = [];
    for (let e = 0, f; e < d.length; e++) {
      if (f = d[e], f.clear) {
        await this.clear();
        b = !0;
        break;
      } else {
        d[e] = f.V;
      }
    }
    b || (c || (d = d.concat(ba(a.reg))), d.length && await this.remove(d));
  }
  a.reg.size && (await this.transaction("map", "readwrite", function(d) {
    for (const e of a.map) {
      const f = e[0], g = e[1];
      g.length && (b ? d.put(g, f) : d.get(f).onsuccess = function() {
        let h = this.result;
        var k;
        if (h && h.length) {
          const l = Math.max(h.length, g.length);
          for (let m = 0, p, n; m < l; m++) {
            if ((n = g[m]) && n.length) {
              if ((p = h[m]) && p.length) {
                for (k = 0; k < n.length; k++) {
                  p.push(n[k]);
                }
              } else {
                h[m] = n;
              }
              k = 1;
            }
          }
        } else {
          h = g, k = 1;
        }
        k && d.put(h, f);
      });
    }
  }), await this.transaction("ctx", "readwrite", function(d) {
    for (const e of a.ctx) {
      const f = e[0], g = e[1];
      for (const h of g) {
        const k = h[0], l = h[1];
        l.length && (b ? d.put(l, f + ":" + k) : d.get(f + ":" + k).onsuccess = function() {
          let m = this.result;
          var p;
          if (m && m.length) {
            const n = Math.max(m.length, l.length);
            for (let q = 0, t, r; q < n; q++) {
              if ((r = l[q]) && r.length) {
                if ((t = m[q]) && t.length) {
                  for (p = 0; p < r.length; p++) {
                    t.push(r[p]);
                  }
                } else {
                  m[q] = r;
                }
                p = 1;
              }
            }
          } else {
            m = l, p = 1;
          }
          p && d.put(m, f + ":" + k);
        });
      }
    }
  }), a.store ? await this.transaction("reg", "readwrite", function(d) {
    for (const e of a.store) {
      const f = e[0], g = e[1];
      d.put("object" === typeof g ? JSON.stringify(g) : 1, f);
    }
  }) : a.bypass || await this.transaction("reg", "readwrite", function(d) {
    for (const e of a.reg.keys()) {
      d.put(1, e);
    }
  }), a.tag && await this.transaction("tag", "readwrite", function(d) {
    for (const e of a.tag) {
      const f = e[0], g = e[1];
      g.length && (d.get(f).onsuccess = function() {
        let h = this.result;
        h = h && h.length ? h.concat(g) : g;
        d.put(h, f);
      });
    }
  }), a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear());
};
function jb(a, b, c) {
  const d = a.value;
  let e, f, g = 0;
  for (let h = 0, k; h < d.length; h++) {
    if (k = c ? d : d[h]) {
      for (let l = 0, m, p; l < b.length; l++) {
        if (p = b[l], m = k.indexOf(f ? parseInt(p, 10) : p), 0 > m && !f && "string" === typeof p && !isNaN(p) && (m = k.indexOf(parseInt(p, 10))) && (f = 1), 0 <= m) {
          if (e = 1, 1 < k.length) {
            k.splice(m, 1);
          } else {
            d[h] = [];
            break;
          }
        }
      }
      g += k.length;
    }
    if (c) {
      break;
    }
  }
  g ? e && a.update(d) : a.delete();
  a.continue();
}
v.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && jb(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && jb(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && jb(c, a, !0);
    };
  }), this.transaction("reg", "readwrite", function(b) {
    for (let c = 0; c < a.length; c++) {
      b.delete(a[c]);
    }
  })]);
};
function Z(a) {
  return new Promise((b, c) => {
    a.onsuccess = function() {
      b(this.result);
    };
    a.oncomplete = function() {
      b(this.result);
    };
    a.onerror = c;
    a = null;
  });
}
;const kb = {Index:L, Charset:Sa, Encoder:K, Document:T, Worker:N, Resolver:X, IndexedDB:hb, Language:{}}, lb = self;
let mb;
(mb = lb.define) && mb.amd ? mb([], function() {
  return kb;
}) : "object" === typeof lb.exports ? lb.exports = kb : lb.FlexSearch = kb;
}(this||self));
