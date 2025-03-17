/**!
 * FlexSearch.js v0.8.103 (Bundle/Module/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var u;
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
u = K.prototype;
u.assign = function(a) {
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
  this.dedupe = z(a.dedupe, !1, this.dedupe);
  this.filter = z((c = a.filter) && new Set(c), null, this.filter);
  this.matcher = z((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = z((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = z((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = z(a.replacer, null, this.replacer);
  this.minlength = z(a.minlength, 1, this.minlength);
  this.maxlength = z(a.maxlength, 0, this.maxlength);
  if (this.cache = c = z(a.cache, !0, this.cache)) {
    this.L = null, this.S = "number" === typeof c ? c : 2e5, this.H = new Map(), this.I = new Map(), this.M = this.B = 128;
  }
  this.h = "";
  this.N = null;
  this.A = "";
  this.O = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.h += (this.h ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.A += (this.A ? "|" : "") + d;
    }
  }
  return this;
};
u.addMatcher = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (2 > a.length) {
    return this.addMapper(a, b);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, b);
  this.h += (this.h ? "|" : "") + a;
  this.N = null;
  this.cache && L(this);
  return this;
};
u.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.A += (this.A ? "|" : "") + a;
  this.O = null;
  this.cache && L(this);
  return this;
};
u.addFilter = function(a) {
  this.filter || (this.filter = new Set());
  this.filter.add(a);
  this.cache && L(this);
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
  this.cache && L(this);
  return this;
};
u.addReplacer = function(a, b) {
  "string" === typeof a && (a = new RegExp(a, "g"));
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b || "");
  this.cache && L(this);
  return this;
};
function L(a) {
  a.H.clear();
  a.I.clear();
}
u.encode = function(a) {
  if (this.cache && a.length <= this.B) {
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
    if (this.cache && g.length <= this.M) {
      if (this.L) {
        var e = this.I.get(g);
        if (e || "" === e) {
          e && c.push(e);
          continue;
        }
      } else {
        this.L = setTimeout(ka, 50, this);
      }
    }
    let k;
    this.stemmer && 2 < g.length && (this.O || (this.O = new RegExp("(?!^)(" + this.A + ")$")), g = g.replace(this.O, l => this.stemmer.get(l)), k = 1);
    g && k && (g.length < this.minlength || this.filter && this.filter.has(g)) && (g = "");
    if (g && (this.mapper || this.dedupe && 1 < g.length)) {
      e = "";
      for (let l = 0, m = "", q, n; l < g.length; l++) {
        q = g.charAt(l), q === m && this.dedupe || ((n = this.mapper && this.mapper.get(q)) || "" === n ? n === m && this.dedupe || !(m = n) || (e += n) : e += m = q);
      }
      g = e;
    }
    this.matcher && 1 < g.length && (this.N || (this.N = new RegExp("(" + this.h + ")", "g")), g = g.replace(this.N, l => this.matcher.get(l)));
    if (g && this.replacer) {
      for (e = 0; g && e < this.replacer.length; e += 2) {
        g = g.replace(this.replacer[e], this.replacer[e + 1]);
      }
    }
    this.cache && h.length <= this.M && (this.I.set(h, g), this.I.size > this.S && (this.I.clear(), this.M = this.M / 1.1 | 0));
    g && c.push(g);
  }
  this.finalize && (c = this.finalize(c) || c);
  this.cache && a.length <= this.B && (this.H.set(a, c), this.H.size > this.S && (this.H.clear(), this.B = this.B / 1.1 | 0));
  return c;
};
function ka(a) {
  a.L = null;
  a.H.clear();
  a.I.clear();
}
;async function la(a) {
  a = a.data;
  var b = self._index;
  const c = a.args;
  var d = a.task;
  switch(d) {
    case "init":
      d = a.options || {};
      (b = a.factory) ? (Function("return " + b)()(self), self._index = new self.FlexSearch.Index(d), delete self.FlexSearch) : self._index = new M(d);
      postMessage({id:a.id});
      break;
    default:
      a = a.id, b = b[d].apply(b, c), postMessage("search" === d ? {id:a, msg:b} : {id:a});
  }
}
;let ma = 0;
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
          e.h[++ma] = function() {
            k(e);
          };
          e.worker.postMessage({id:ma, task:"init", factory:c, options:a});
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
  const d = "undefined" === typeof window, e = this, f = na(c, d, a.worker);
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
      b.h[++ma] = f;
      b.worker.postMessage({task:a, id:ma, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function na(a, b, c) {
  return b ? "undefined" !== typeof module ? new (require("worker_threads")["Worker"])(__dirname + "/node/node.js") : import("worker_threads").then(function(worker){ return new worker["Worker"](import.meta.dirname + "/node/node.mjs"); }) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + la.toString()], {type:"text/javascript"}))) : new window.Worker(G(c) ? c : import.meta.url.replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function oa(a) {
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
;function pa(a, b = 0) {
  let c = [], d = [];
  b && (b = 250000 / b * 5000 | 0);
  for (const e of a.entries()) {
    d.push(e), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function qa(a, b) {
  b || (b = new Map());
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b.set(d[0], d[1]);
  }
  return b;
}
function ra(a, b = 0) {
  let c = [], d = [];
  b && (b = 250000 / b * 1000 | 0);
  for (const e of a.entries()) {
    d.push([e[0], pa(e[1])[0]]), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function sa(a, b) {
  b || (b = new Map());
  for (let c = 0, d, e; c < a.length; c++) {
    d = a[c], e = b.get(d[0]), b.set(d[0], qa(d[1], e));
  }
  return b;
}
function ta(a) {
  let b = [], c = [];
  for (const d of a.keys()) {
    c.push(d), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function ua(a, b) {
  b || (b = new Set());
  for (let c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function va(a, b, c, d, e, f, g = 0) {
  const h = d && d.constructor === Array;
  var k = h ? d.shift() : d;
  if (!k) {
    return this.export(a, b, e, f + 1);
  }
  if ((k = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(k))) && k.then) {
    const l = this;
    return k.then(function() {
      return va.call(l, a, b, c, h ? d : null, e, f, g + 1);
    });
  }
  return va.call(this, a, b, c, h ? d : null, e, f, g + 1);
}
;function wa(a, b, c, d) {
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
        return wa(b, e || 0, f || b.length, !1);
      };
    }
    if ("splice" === d) {
      return function(e, f) {
        return wa(b, e || 0, f || b.length, !0);
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
  32 < a ? (this.h = xa, this.A = BigInt(a)) : (this.h = ya, this.A = a);
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
  32 < a ? (this.B = xa, this.A = BigInt(a)) : (this.B = ya, this.A = a);
}
S.prototype.add = function(a) {
  var b = this.B(a);
  let c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c));
};
u = R.prototype;
u.has = S.prototype.has = function(a) {
  const b = this.index[this.B(a)];
  return b && b.has(a);
};
u.delete = S.prototype.delete = function(a) {
  const b = this.index[this.B(a)];
  b && b.delete(a) && this.size--;
};
u.clear = S.prototype.clear = function() {
  this.index = B();
  this.h = [];
  this.size = 0;
};
u.values = S.prototype.values = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].values()) {
      yield b;
    }
  }
};
u.keys = S.prototype.keys = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].keys()) {
      yield b;
    }
  }
};
u.entries = S.prototype.entries = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].entries()) {
      yield b;
    }
  }
};
function ya(a) {
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
function xa(a) {
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
        if (e = k.J, !e || e(b)) {
          k.constructor === String ? k = ["" + k] : G(k) && (k = [k]), za(b, k, this.K, 0, d, a, k[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.G.length; d++) {
        var f = this.G[d], g = this.P[d];
        e = this.tag.get(g);
        let h = B();
        if ("function" === typeof f) {
          if (f = f(b), !f) {
            continue;
          }
        } else {
          const k = f.J;
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
                  for (let q of this.reg.values()) {
                    q.includes(m) && (q[q.indexOf(m)] = g);
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
          if ((c = l.J) && !c(b)) {
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
          Aa(b, h, l, 0, l[0], m);
        }
      }
      this.store.set(a, h || b);
    }
  }
  return this;
};
function Aa(a, b, c, d, e, f) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
        Aa(a, b, c, d, e);
      }
    } else {
      b = b[e] || (b[e] = B()), e = c[++d], Aa(a, b, c, d, e);
    }
  }
}
function za(a, b, c, d, e, f, g, h) {
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
          za(a, b, c, d, e, f, g, h);
        }
      } else {
        g = b[++d], za(a, b, c, d, e, f, g, h);
      }
    }
  } else {
    e.db && e.remove(f);
  }
}
;function Ba(a, b, c, d, e, f, g) {
  const h = a.length;
  let k = [], l;
  var m;
  l = B();
  for (let q = 0, n, p, r, t; q < b; q++) {
    for (let v = 0; v < h; v++) {
      if (r = a[v], q < r.length && (n = r[q])) {
        for (let x = 0; x < n.length; x++) {
          p = n[x], (m = l[p]) ? l[p]++ : (m = 0, l[p] = 1), t = k[m] || (k[m] = []), g || (m = q + (v ? 0 : f || 0), t = t[m] || (t[m] = [])), t.push(p);
        }
      }
    }
  }
  if (a = k.length) {
    if (e) {
      k = 1 < k.length ? Ca(k, d, c, g, 0) : (k = k[0]).length > c || d ? k.slice(d, c + d) : k;
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
          for (let q = 0, n; q < k.length; q++) {
            if (n = k[q], n.length > d) {
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
function Ca(a, b, c, d, e) {
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
    let q = ca(a);
    for (let n = 0; n < q; n++) {
      for (let p = k - 1; 0 <= p; p--) {
        if (l = (d = a[p][n]) && d.length) {
          for (let r = 0; r < l; r++) {
            if (h = d[r], !g[h]) {
              if (g[h] = 1, b) {
                b--;
              } else {
                let t = n + (p < k - 1 ? e || 0 : 0);
                (f[t] || (f[t] = [])).push(h);
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
function Da(a, b) {
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
  let l, m = 0, q;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    g = c.pluck;
    h = c.merge;
    k = g || c.field || c.index;
    var n = this.tag && c.tag;
    var p = this.store && c.enrich;
    var r = c.suggest;
    q = c.highlight;
    b = c.limit || b;
    l = c.offset || 0;
    b || (b = 100);
    if (n && (!this.db || !d)) {
      n.constructor !== Array && (n = [n]);
      var t = [];
      for (let y = 0, w; y < n.length; y++) {
        w = n[y];
        if (G(w)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (w.field && w.tag) {
          var v = w.tag;
          if (v.constructor === Array) {
            for (var x = 0; x < v.length; x++) {
              t.push(w.field, v[x]);
            }
          } else {
            t.push(w.field, v);
          }
        } else {
          v = Object.keys(w);
          for (let A = 0, I, C; A < v.length; A++) {
            if (I = v[A], C = w[I], C.constructor === Array) {
              for (x = 0; x < C.length; x++) {
                t.push(I, C[x]);
              }
            } else {
              t.push(I, C);
            }
          }
        }
      }
      if (!t.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      n = t;
      if (!a) {
        r = [];
        if (t.length) {
          for (n = 0; n < t.length; n += 2) {
            if (this.db) {
              d = this.index.get(t[n]);
              if (!d) {
                console.warn("Tag '" + t[n] + ":" + t[n + 1] + "' will be skipped because there is no field '" + t[n] + "'.");
                continue;
              }
              r.push(d = d.db.tag(t[n + 1], b, l, p));
            } else {
              d = Ea.call(this, t[n], t[n + 1], b, l, p);
            }
            e.push({field:t[n], tag:t[n + 1], result:d});
          }
        }
        return r.length ? Promise.all(r).then(function(y) {
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
  t = !d && (this.worker || this.db) && [];
  let E;
  for (let y = 0, w, A, I; y < k.length; y++) {
    A = k[y];
    if (this.db && this.tag && !this.D[y]) {
      continue;
    }
    let C;
    G(A) || (C = A, A = C.field, a = C.query || a, b = C.limit || b, l = C.offset || l, r = C.suggest || r, p = this.store && (C.enrich || p));
    if (d) {
      w = d[y];
    } else {
      if (v = C || c, x = this.index.get(A), n && (this.db && (v.tag = n, E = x.db.support_tag_search, v.field = k), E || (v.enrich = !1)), t) {
        t[y] = x.search(a, b, v);
        v && p && (v.enrich = p);
        continue;
      } else {
        w = x.search(a, b, v), v && p && (v.enrich = p);
      }
    }
    I = w && w.length;
    if (n && I) {
      v = [];
      x = 0;
      if (this.db && d) {
        if (!E) {
          for (let D = k.length; D < d.length; D++) {
            let F = d[D];
            if (F && F.length) {
              x++, v.push(F);
            } else if (!r) {
              return e;
            }
          }
        }
      } else {
        for (let D = 0, F, gb; D < n.length; D += 2) {
          F = this.tag.get(n[D]);
          if (!F) {
            if (console.warn("Tag '" + n[D] + ":" + n[D + 1] + "' will be skipped because there is no field '" + n[D] + "'."), r) {
              continue;
            } else {
              return e;
            }
          }
          if (gb = (F = F && F.get(n[D + 1])) && F.length) {
            x++, v.push(F);
          } else if (!r) {
            return e;
          }
        }
      }
      if (x) {
        w = Da(w, v);
        I = w.length;
        if (!I && !r) {
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
  if (t) {
    if (this.db && n && n.length && !E) {
      for (p = 0; p < n.length; p += 2) {
        d = this.index.get(n[p]);
        if (!d) {
          if (console.warn("Tag '" + n[p] + ":" + n[p + 1] + "' was not found because there is no field '" + n[p] + "'."), r) {
            continue;
          } else {
            return e;
          }
        }
        t.push(d.db.tag(n[p + 1], b, l, !1));
      }
    }
    const y = this;
    return Promise.all(t).then(function(w) {
      return w.length ? y.search(a, b, c, w) : w;
    });
  }
  if (!m) {
    return e;
  }
  if (g && (!p || !this.store)) {
    return e[0];
  }
  t = [];
  for (let y = 0, w; y < f.length; y++) {
    w = e[y];
    p && w.length && !w[0].doc && (this.db ? t.push(w = this.index.get(this.field[0]).db.enrich(w)) : w.length && (w = Fa.call(this, w)));
    if (g) {
      return w;
    }
    e[y] = {field:f[y], result:w};
  }
  if (p && this.db && t.length) {
    const y = this;
    return Promise.all(t).then(function(w) {
      for (let A = 0; A < w.length; A++) {
        e[A].result = w[A];
      }
      return h ? Ga(e, b) : q ? Ha(e, a, y.index, y.field, y.D, q) : e;
    });
  }
  return h ? Ga(e, b) : q ? Ha(e, a, this.index, this.field, this.D, q) : e;
};
function Ha(a, b, c, d, e, f) {
  let g, h, k;
  for (let m = 0, q, n, p, r, t; m < a.length; m++) {
    q = a[m].result;
    n = a[m].field;
    r = c.get(n);
    p = r.encoder;
    k = r.tokenize;
    t = e[d.indexOf(n)];
    p !== g && (g = p, h = g.encode(b));
    for (let v = 0; v < q.length; v++) {
      let x = "";
      var l = J(q[v].doc, t);
      let E = g.encode(l);
      l = l.split(g.split);
      for (let y = 0, w, A; y < E.length; y++) {
        w = E[y];
        A = l[y];
        let I;
        for (let C = 0, D; C < h.length; C++) {
          if (D = h[C], "strict" === k) {
            if (w === D) {
              x += (x ? " " : "") + f.replace("$1", A);
              I = !0;
              break;
            }
          } else {
            const F = w.indexOf(D);
            if (-1 < F) {
              x += (x ? " " : "") + A.substring(0, F) + f.replace("$1", A.substring(F, D.length)) + A.substring(F + D.length);
              I = !0;
              break;
            }
          }
        }
        I || (x += (x ? " " : "") + l[y]);
      }
      q[v].highlight = x;
    }
  }
  return a;
}
function Ga(a, b) {
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
function Ea(a, b, c, d, e) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(b)) && f.length - d) && 0 < a) {
    if (a > c || d) {
      f = f.slice(d, d + c);
    }
    e && (f = Fa.call(this, f));
    return f;
  }
}
function Fa(a) {
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
  this.key = (c = b.key || b.id) && Ia(c, this.K) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.reg = (this.fastupdate = !!a.fastupdate) ? d ? new R(d) : new Map() : d ? new S(d) : new Set();
  this.C = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (d ? new R(d) : new Map());
  this.cache = (c = a.cache || null) && new U(c);
  a.cache = !1;
  this.worker = a.worker;
  this.index = Ja.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.G = [];
      this.P = [];
      for (let e = 0, f, g; e < c.length; e++) {
        f = c[e];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.G[e] = f.custom : (this.G[e] = Ia(g, this.K), f.filter && ("string" === typeof this.G[e] && (this.G[e] = new String(this.G[e])), this.G[e].J = f.filter));
        this.P[e] = g;
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
u = T.prototype;
u.mount = function(a) {
  let b = this.field;
  if (this.tag) {
    for (let e = 0, f; e < this.P.length; e++) {
      f = this.P[e];
      var c = void 0;
      this.index.set(f, c = new M({}, this.reg));
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
u.commit = async function(a, b) {
  const c = [];
  for (const d of this.index.values()) {
    c.push(d.db.commit(d, a, b));
  }
  await Promise.all(c);
  this.reg.clear();
};
u.destroy = function() {
  const a = [];
  for (const b of this.index.values()) {
    a.push(b.destroy());
  }
  return Promise.all(a);
};
function Ja(a, b) {
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
    this.worker || c.set(f, new M(g, this.reg));
    g.custom ? this.D[e] = g.custom : (this.D[e] = Ia(f, this.K), g.filter && ("string" === typeof this.D[e] && (this.D[e] = new String(this.D[e])), this.D[e].J = g.filter));
    this.field[e] = f;
  }
  if (this.C) {
    a = b.store;
    G(a) && (a = [a]);
    for (let e = 0, f, g; e < a.length; e++) {
      f = a[e], g = f.field || f, f.custom ? (this.C[e] = f.custom, f.custom.U = g) : (this.C[e] = Ia(g, this.K), f.filter && ("string" === typeof this.C[e] && (this.C[e] = new String(this.C[e])), this.C[e].J = f.filter));
    }
  }
  return c;
}
function Ia(a, b) {
  const c = a.split(":");
  let d = 0;
  for (let e = 0; e < c.length; e++) {
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
u.clear = function() {
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
u.contain = function(a) {
  return this.db ? this.index.get(this.field[0]).db.has(a) : this.reg.has(a);
};
u.cleanup = function() {
  for (const a of this.index.values()) {
    a.cleanup();
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
u.searchCache = Ka;
u.export = function(a, b, c = 0, d = 0) {
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
      f = ta(this.reg);
      b = null;
      break;
    case 1:
      e = "tag";
      f = ra(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      e = "doc";
      f = pa(this.store);
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
  return va.call(this, a, b, e, f, c, d);
};
u.import = function(a, b) {
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
        this.reg = ua(b, this.reg);
        for (let d = 0, e; d < this.field.length; d++) {
          e = this.index.get(this.field[d]), e.fastupdate = !1, e.reg = this.reg;
        }
        break;
      case "tag":
        this.tag = sa(b, this.tag);
        break;
      case "doc":
        this.store = qa(b, this.store);
    }
  }
};
oa(T.prototype);
function Ka(a, b, c) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new U());
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
const La = {normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1};
const Ma = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const Na = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["pf", "f"]]), Oa = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /([^0-9])\1+/g, "$1"];
const Pa = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const Qa = /[\x00-\x7F]+/g;
const Ra = /[\x00-\x7F]+/g;
const Sa = /[\x00-\x7F]+/g;
var Ta = {LatinExact:{normalize:!1, dedupe:!1}, LatinDefault:La, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:Ma}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:Ma, matcher:Na, replacer:Oa}, LatinExtra:{normalize:!0, dedupe:!0, mapper:Ma, replacer:Oa.concat([/(?!^)[aeo]/g, ""]), matcher:Na}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let d = b.charAt(0), e = Pa[d];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = Pa[g]) || g === e || (d += g, e = g, 4 !== d.length)); f++) {
    }
    a[c] = d;
  }
}}, ArabicDefault:{rtl:!0, normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(Qa, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(Ra, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(Sa, " ");
}}};
const Ua = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
B();
M.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (d = b.length) {
      const l = B(), m = B(), q = this.depth, n = this.resolution;
      for (let p = 0; p < d; p++) {
        let r = b[this.rtl ? d - 1 - p : p];
        var e = r.length;
        if (e && (q || !m[r])) {
          var f = this.score ? this.score(b, r, p, null, 0) : Va(n, d, p), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (f = 0; f < e; f++) {
                  for (var h = e; h > f; h--) {
                    g = r.substring(f, h);
                    var k = this.score ? this.score(b, r, p, g, f) : Va(n, d, p, e, f);
                    V(this, m, g, k, a, c);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  g = r[h] + g, k = this.score ? this.score(b, r, p, g, h) : Va(n, d, p, e, h), V(this, m, g, k, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  g += r[h], V(this, m, g, f, a, c);
                }
                break;
              }
            default:
              if (V(this, m, r, f, a, c), q && 1 < d && p < d - 1) {
                for (e = B(), g = this.R, f = r, h = Math.min(q + 1, d - p), e[f] = 1, k = 1; k < h; k++) {
                  if ((r = b[this.rtl ? d - 1 - p - k : p + k]) && !e[r]) {
                    e[r] = 1;
                    const t = this.score ? this.score(b, f, p, r, k) : Va(g + (d / 2 > g ? 0 : 1), d, p, h - 1, k - 1), v = this.bidirectional && r > f;
                    V(this, l, v ? f : r, t, a, c, v ? r : f);
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
  this.db && (b || this.commit_task.push({del:a}), this.T && Wa(this));
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
function Va(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;function W(a, b, c, d) {
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a, d ? Xa(a) : a;
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
        h > b && (g = g.slice(0, b), h = g.length);
      } else {
        if (h >= b) {
          return h > b && (g = g.slice(0, b)), d ? Xa(g) : g;
        }
      }
      e.push(g);
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
  return d ? Xa(e) : e;
}
function Xa(a) {
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
      a.result = Ya(d, e, f, g, h, a.F);
      return h ? a.result : a;
    });
  }
  d.length && (this.result.length && (d = d.concat([this.result])), this.result = Ya(d, e, f, g, h, this.F));
  return h ? this.result : this;
};
function Ya(a, b, c, d, e, f) {
  if (!a.length) {
    return a;
  }
  "object" === typeof b && (c = b.offset || 0, d = b.enrich || !1, b = b.limit || 0);
  return 2 > a.length ? e ? W(a[0], b, c, d) : a[0] : Ca(a, c, b, e, f);
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
        b.result = Za(d, e, f, g, b.F, h);
        return g ? b.result : b;
      });
    }
    d = [this.result].concat(d);
    this.result = Za(d, e, f, g, this.F, h);
    return g ? this.result : this;
  }
  return this;
};
function Za(a, b, c, d, e, f) {
  if (2 > a.length) {
    return [];
  }
  let g = [];
  B();
  let h = ca(a);
  return h ? Ba(a, h, b, c, f, e, d) : g;
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
      a.result = $a(d, e, f, g, !h, a.F);
      return h ? a.result : a;
    });
  }
  d.length && (this.result.length && (d = [this.result].concat(d)), this.result = $a(d, e, f, g, !h, a.F));
  return h ? this.result : this;
};
function $a(a, b, c, d, e, f) {
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
      for (let m = 0, q; m < l.length; m++) {
        if (q = l[m]) {
          h < q.length && (h = q.length);
          for (let n = 0, p; n < q.length; n++) {
            p = q[n], g[p] ? g[p]++ : g[p] = 1;
          }
        }
      }
    }
  }
  for (let k = 0, l, m = 0; k < h; k++) {
    for (let q = 0, n; q < a.length; q++) {
      if (n = a[q]) {
        if (l = n[k]) {
          for (let p = 0, r; p < l.length; p++) {
            if (r = l[p], 1 === g[r]) {
              if (c) {
                c--;
              } else {
                if (e) {
                  if (d.push(r), d.length === b) {
                    return d;
                  }
                } else {
                  const t = k + (q ? f : 0);
                  d[t] || (d[t] = []);
                  d[t].push(r);
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
      a.result = ab.call(a, d, e, f, g);
      return g ? a.result : a;
    });
  }
  d.length && (this.result = ab.call(this, d, e, f, g));
  return g ? this.result : this;
};
function ab(a, b, c, d) {
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
  bb = 1;
  const d = this.result;
  this.result = this.index = null;
  return d.length ? ("object" === typeof a && (c = a.enrich, b = a.offset, a = a.limit), W(d, a || 100, b, c)) : d;
};
let bb = 1;
M.prototype.search = function(a, b, c) {
  c || (!b && H(a) ? (c = a, a = "") : H(b) && (c = b, b = 0));
  let d = [], e;
  let f, g = 0, h, k, l, m, q;
  if (c) {
    a = c.query || a;
    b = c.limit || b;
    g = c.offset || 0;
    var n = c.context;
    f = c.suggest;
    (h = bb && !1 !== c.resolve) || (bb = 0);
    k = h && c.enrich;
    m = c.boost;
    q = c.resolution;
    l = this.db && c.tag;
  } else {
    h = this.resolve || bb;
  }
  let p = this.encoder.encode(a);
  e = p.length;
  b || !h || (b = 100);
  if (1 === e) {
    return cb.call(this, p[0], "", b, g, h, k, l);
  }
  n = this.depth && !1 !== n;
  if (2 === e && n && !f) {
    return cb.call(this, p[0], p[1], b, g, h, k, l);
  }
  c = a = 0;
  if (1 < e) {
    const v = B(), x = [];
    for (let E = 0, y; E < e; E++) {
      if ((y = p[E]) && !v[y]) {
        if (f || this.db || Y(this, y)) {
          x.push(y), v[y] = 1;
        } else {
          return h ? d : new X(d);
        }
        const w = y.length;
        a = Math.max(a, w);
        c = c ? Math.min(c, w) : w;
      }
    }
    p = x;
    e = p.length;
  }
  if (!e) {
    return h ? d : new X(d);
  }
  let r = 0, t;
  if (1 === e) {
    return cb.call(this, p[0], "", b, g, h, k, l);
  }
  if (2 === e && n && !f) {
    return cb.call(this, p[0], p[1], b, g, h, k, l);
  }
  1 < e && (n ? (t = p[0], r = 1) : 9 < a && 3 < a / c && p.sort(aa));
  q || 0 === q || (q = this.resolution);
  if (this.db) {
    if (this.db.search && (n = this.db.search(this, p, b, g, f, h, k, l), !1 !== n)) {
      return n;
    }
    const v = this;
    return async function() {
      for (let x, E; r < e; r++) {
        E = p[r];
        t ? (x = await Y(v, E, t, 0, 0, !1, !1), x = db(x, d, f, v.R), f && !1 === x && d.length || (t = E)) : (x = await Y(v, E, "", 0, 0, !1, !1), x = db(x, d, f, q));
        if (x) {
          return x;
        }
        if (f && r === e - 1) {
          let y = d.length;
          if (!y) {
            if (t) {
              t = "";
              r = -1;
              continue;
            }
            return d;
          }
          if (1 === y) {
            return h ? W(d[0], b, g) : new X(d[0]);
          }
        }
      }
      return h ? Ba(d, q, b, g, f, m, h) : new X(d[0]);
    }();
  }
  for (let v, x; r < e; r++) {
    x = p[r];
    t ? (v = Y(this, x, t, 0, 0, !1, !1), v = db(v, d, f, this.R), f && !1 === v && d.length || (t = x)) : (v = Y(this, x, "", 0, 0, !1, !1), v = db(v, d, f, q));
    if (v) {
      return v;
    }
    if (f && r === e - 1) {
      n = d.length;
      if (!n) {
        if (t) {
          t = "";
          r = -1;
          continue;
        }
        return d;
      }
      if (1 === n) {
        return h ? W(d[0], b, g) : new X(d[0]);
      }
    }
  }
  d = Ba(d, q, b, g, f, m, h);
  return h ? d : new X(d);
};
function cb(a, b, c, d, e, f, g) {
  a = Y(this, a, b, c, d, e, f, g);
  return this.db ? a.then(function(h) {
    return e ? h : h && h.length ? e ? W(h, c, d) : new X(h) : e ? [] : new X([]);
  }) : a && a.length ? e ? W(a, c, d) : new X(a) : e ? [] : new X([]);
}
function db(a, b, c, d) {
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
;M.prototype.remove = function(a, b) {
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
      eb(this.map, a), this.depth && eb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.T && Wa(this));
  this.cache && this.cache.remove(a);
  return this;
};
function eb(a, b) {
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
      const e = d[0], f = eb(d[1], b);
      f ? c += f : a.delete(e);
    }
  }
  return c;
}
;function M(a, b) {
  if (!this || this.constructor !== M) {
    return new M(a);
  }
  if (a) {
    var c = G(a) ? a : a.preset;
    c && (Ua[c] || console.warn("Preset not found: " + c), a = Object.assign({}, Ua[c], a));
  } else {
    a = {};
  }
  c = a.context;
  const d = !0 === c ? {depth:1} : c || {}, e = G(a.encoder) ? Ta[a.encoder] : a.encode || a.encoder || La;
  this.encoder = e.encode ? e : "object" === typeof e ? new K(e) : {encode:e};
  this.resolution = a.resolution || 9;
  this.tokenize = c = a.tokenize || "strict";
  this.depth = "strict" === c && d.depth || 0;
  this.bidirectional = !1 !== d.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new R(c) : new Map();
  this.ctx = c ? new R(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new R(c) : new Map() : c ? new S(c) : new Set());
  this.R = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new U(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.T = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
}
u = M.prototype;
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
function Wa(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a, void 0, void 0);
  }, 0));
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
  const c = this, d = this.remove(a);
  return d && d.then ? d.then(() => c.add(a, b)) : this.add(a, b);
};
function fb(a) {
  let b = 0;
  if (a.constructor === Array) {
    for (let c = 0, d; c < a.length; c++) {
      (d = a[c]) && (b += d.length);
    }
  } else {
    for (const c of a) {
      const d = c[0], e = fb(c[1]);
      e ? b += e : a.delete(d);
    }
  }
  return b;
}
u.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  fb(this.map);
  this.depth && fb(this.ctx);
  return this;
};
u.searchCache = Ka;
u.export = function(a, b, c, d = 0) {
  let e, f;
  switch(d) {
    case 0:
      e = "reg";
      f = ta(this.reg);
      break;
    case 1:
      e = "cfg";
      f = {};
      break;
    case 2:
      e = "map";
      f = pa(this.map, this.reg.size);
      break;
    case 3:
      e = "ctx";
      f = ra(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return va.call(this, a, b, e, f, c, d);
};
u.import = function(a, b) {
  if (b) {
    switch(G(b) && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = ua(b, this.reg);
        break;
      case "map":
        this.map = qa(b, this.map);
        break;
      case "ctx":
        this.ctx = sa(b, this.ctx);
    }
  }
};
u.serialize = function(a = !0) {
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
    for (let m = 0, q; m < g.length; m++) {
      q = g[m] || [""];
      var k = "";
      for (var l = 0; l < q.length; l++) {
        k += (k ? "," : "") + ("string" === c ? '"' + q[l] + '"' : q[l]);
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
    for (const q of g.entries()) {
      g = q[0];
      h = q[1];
      k = "";
      for (let n = 0, p; n < h.length; n++) {
        p = h[n] || [""];
        l = "";
        for (let r = 0; r < p.length; r++) {
          l += (l ? "," : "") + ("string" === c ? '"' + p[r] + '"' : p[r]);
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
oa(M.prototype);
const hb = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), ib = ["map", "ctx", "tag", "reg", "cfg"];
function jb(a, b = {}) {
  if (!this) {
    return new jb(a, b);
  }
  "object" === typeof a && (b = a, a = a.name);
  a || console.info("Default storage space was used, because a name was not passed.");
  this.id = "flexsearch" + (a ? ":" + a.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "");
  this.field = b.field ? b.field.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "";
  this.support_tag_search = !1;
  this.db = null;
  this.h = {};
}
u = jb.prototype;
u.mount = function(a) {
  if (!a.encoder) {
    return a.mount(this);
  }
  a.db = this;
  return this.open();
};
u.open = function() {
  let a = this;
  navigator.storage && navigator.storage.persist();
  return this.db || new Promise(function(b, c) {
    const d = hb.open(a.id + (a.field ? ":" + a.field : ""), 1);
    d.onupgradeneeded = function() {
      const e = a.db = this.result;
      ib.forEach(f => {
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
u.close = function() {
  this.db.close();
  this.db = null;
};
u.destroy = function() {
  return hb.deleteDatabase(this.id + (this.field ? ":" + this.field : ""));
};
u.clear = function() {
  const a = this.db.transaction(ib, "readwrite");
  for (let b = 0; b < ib.length; b++) {
    a.objectStore(ib[b]).clear();
  }
  return Z(a);
};
u.get = function(a, b, c = 0, d = 0, e = !0, f = !1) {
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
          const q = c ? d + Math.min(m.length - d, c) : m.length;
          for (let n = d; n < q; n++) {
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
u.tag = function(a, b = 0, c = 0, d = !1) {
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
u.enrich = function(a) {
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
u.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return Z(a);
};
u.search = null;
u.info = function() {
};
u.transaction = function(a, b, c) {
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
u.commit = async function(a, b, c) {
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
          for (let m = 0, q, n; m < l; m++) {
            if ((n = g[m]) && n.length) {
              if ((q = h[m]) && q.length) {
                for (k = 0; k < n.length; k++) {
                  q.push(n[k]);
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
          var q;
          if (m && m.length) {
            const n = Math.max(m.length, l.length);
            for (let p = 0, r, t; p < n; p++) {
              if ((t = l[p]) && t.length) {
                if ((r = m[p]) && r.length) {
                  for (q = 0; q < t.length; q++) {
                    r.push(t[q]);
                  }
                } else {
                  m[p] = t;
                }
                q = 1;
              }
            }
          } else {
            m = l, q = 1;
          }
          q && d.put(m, f + ":" + k);
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
function kb(a, b, c) {
  const d = a.value;
  let e, f, g = 0;
  for (let h = 0, k; h < d.length; h++) {
    if (k = c ? d : d[h]) {
      for (let l = 0, m, q; l < b.length; l++) {
        if (q = b[l], m = k.indexOf(f ? parseInt(q, 10) : q), 0 > m && !f && "string" === typeof q && !isNaN(q) && (m = k.indexOf(parseInt(q, 10))) && (f = 1), 0 <= m) {
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
u.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && kb(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && kb(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && kb(c, a, !0);
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
;export default {Index:M, Charset:Ta, Encoder:K, Document:T, Worker:N, Resolver:X, IndexedDB:jb, Language:{}};

export const Index=M;export const  Charset=Ta;export const  Encoder=K;export const  Document=T;export const  Worker=N;export const  Resolver=X;export const  IndexedDB=jb;export const  Language={};