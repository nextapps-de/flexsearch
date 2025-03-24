/**!
 * FlexSearch.js v0.8.132 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var x;
function B(a, c, b) {
  const e = typeof b, d = typeof a;
  if ("undefined" !== e) {
    if ("undefined" !== d) {
      if (b) {
        if ("function" === d && e === d) {
          return function(h) {
            return a(b(h));
          };
        }
        c = a.constructor;
        if (c === b.constructor) {
          if (c === Array) {
            return b.concat(a);
          }
          if (c === Map) {
            var f = new Map(b);
            for (var g of a) {
              f.set(g[0], g[1]);
            }
            return f;
          }
          if (c === Set) {
            g = new Set(b);
            for (f of a.values()) {
              g.add(f);
            }
            return g;
          }
        }
      }
      return a;
    }
    return b;
  }
  return "undefined" === d ? c : a;
}
function C() {
  return Object.create(null);
}
function D(a) {
  return "string" === typeof a;
}
function I(a) {
  return "object" === typeof a;
}
function J(a, c) {
  if (D(c)) {
    a = a[c];
  } else {
    for (let b = 0; a && b < c.length; b++) {
      a = a[c[b]];
    }
  }
  return a;
}
function aa(a) {
  let c = 0;
  for (let b = 0, e; b < a.length; b++) {
    (e = a[b]) && c < e.length && (c = e.length);
  }
  return c;
}
;var ba = [["\u00aa", "a"], ["\u00b2", "2"], ["\u00b3", "3"], ["\u00b9", "1"], ["\u00ba", "o"], ["\u00bc", "1\u20444"], ["\u00bd", "1\u20442"], ["\u00be", "3\u20444"], ["\u00e0", "a"], ["\u00e1", "a"], ["\u00e2", "a"], ["\u00e3", "a"], ["\u00e4", "a"], ["\u00e5", "a"], ["\u00e7", "c"], ["\u00e8", "e"], ["\u00e9", "e"], ["\u00ea", "e"], ["\u00eb", "e"], ["\u00ec", "i"], ["\u00ed", "i"], ["\u00ee", "i"], ["\u00ef", "i"], ["\u00f1", "n"], ["\u00f2", "o"], ["\u00f3", "o"], ["\u00f4", "o"], ["\u00f5", 
"o"], ["\u00f6", "o"], ["\u00f9", "u"], ["\u00fa", "u"], ["\u00fb", "u"], ["\u00fc", "u"], ["\u00fd", "y"], ["\u00ff", "y"], ["\u0101", "a"], ["\u0103", "a"], ["\u0105", "a"], ["\u0107", "c"], ["\u0109", "c"], ["\u010b", "c"], ["\u010d", "c"], ["\u010f", "d"], ["\u0113", "e"], ["\u0115", "e"], ["\u0117", "e"], ["\u0119", "e"], ["\u011b", "e"], ["\u011d", "g"], ["\u011f", "g"], ["\u0121", "g"], ["\u0123", "g"], ["\u0125", "h"], ["\u0129", "i"], ["\u012b", "i"], ["\u012d", "i"], ["\u012f", "i"], ["\u0133", 
"ij"], ["\u0135", "j"], ["\u0137", "k"], ["\u013a", "l"], ["\u013c", "l"], ["\u013e", "l"], ["\u0140", "l"], ["\u0144", "n"], ["\u0146", "n"], ["\u0148", "n"], ["\u0149", "n"], ["\u014d", "o"], ["\u014f", "o"], ["\u0151", "o"], ["\u0155", "r"], ["\u0157", "r"], ["\u0159", "r"], ["\u015b", "s"], ["\u015d", "s"], ["\u015f", "s"], ["\u0161", "s"], ["\u0163", "t"], ["\u0165", "t"], ["\u0169", "u"], ["\u016b", "u"], ["\u016d", "u"], ["\u016f", "u"], ["\u0171", "u"], ["\u0173", "u"], ["\u0175", "w"], ["\u0177", 
"y"], ["\u017a", "z"], ["\u017c", "z"], ["\u017e", "z"], ["\u017f", "s"], ["\u01a1", "o"], ["\u01b0", "u"], ["\u01c6", "dz"], ["\u01c9", "lj"], ["\u01cc", "nj"], ["\u01ce", "a"], ["\u01d0", "i"], ["\u01d2", "o"], ["\u01d4", "u"], ["\u01d6", "u"], ["\u01d8", "u"], ["\u01da", "u"], ["\u01dc", "u"], ["\u01df", "a"], ["\u01e1", "a"], ["\u01e3", "ae"], ["\u00e6", "ae"], ["\u01fd", "ae"], ["\u01e7", "g"], ["\u01e9", "k"], ["\u01eb", "o"], ["\u01ed", "o"], ["\u01ef", "\u0292"], ["\u01f0", "j"], ["\u01f3", 
"dz"], ["\u01f5", "g"], ["\u01f9", "n"], ["\u01fb", "a"], ["\u01ff", "\u00f8"], ["\u0201", "a"], ["\u0203", "a"], ["\u0205", "e"], ["\u0207", "e"], ["\u0209", "i"], ["\u020b", "i"], ["\u020d", "o"], ["\u020f", "o"], ["\u0211", "r"], ["\u0213", "r"], ["\u0215", "u"], ["\u0217", "u"], ["\u0219", "s"], ["\u021b", "t"], ["\u021f", "h"], ["\u0227", "a"], ["\u0229", "e"], ["\u022b", "o"], ["\u022d", "o"], ["\u022f", "o"], ["\u0231", "o"], ["\u0233", "y"], ["\u02b0", "h"], ["\u02b1", "h"], ["\u0266", "h"], 
["\u02b2", "j"], ["\u02b3", "r"], ["\u02b4", "\u0279"], ["\u02b5", "\u027b"], ["\u02b6", "\u0281"], ["\u02b7", "w"], ["\u02b8", "y"], ["\u02e0", "\u0263"], ["\u02e1", "l"], ["\u02e2", "s"], ["\u02e3", "x"], ["\u02e4", "\u0295"], ["\u0390", "\u03b9"], ["\u03ac", "\u03b1"], ["\u03ad", "\u03b5"], ["\u03ae", "\u03b7"], ["\u03af", "\u03b9"], ["\u03b0", "\u03c5"], ["\u03ca", "\u03b9"], ["\u03cb", "\u03c5"], ["\u03cc", "\u03bf"], ["\u03cd", "\u03c5"], ["\u03ce", "\u03c9"], ["\u03d0", "\u03b2"], ["\u03d1", 
"\u03b8"], ["\u03d2", "\u03a5"], ["\u03d3", "\u03a5"], ["\u03d4", "\u03a5"], ["\u03d5", "\u03c6"], ["\u03d6", "\u03c0"], ["\u03f0", "\u03ba"], ["\u03f1", "\u03c1"], ["\u03f2", "\u03c2"], ["\u03f5", "\u03b5"], ["\u0439", "\u0438"], ["\u0450", "\u0435"], ["\u0451", "\u0435"], ["\u0453", "\u0433"], ["\u0457", "\u0456"], ["\u045c", "\u043a"], ["\u045d", "\u0438"], ["\u045e", "\u0443"], ["\u0477", "\u0475"], ["\u04c2", "\u0436"], ["\u04d1", "\u0430"], ["\u04d3", "\u0430"], ["\u04d7", "\u0435"], ["\u04db", 
"\u04d9"], ["\u04dd", "\u0436"], ["\u04df", "\u0437"], ["\u04e3", "\u0438"], ["\u04e5", "\u0438"], ["\u04e7", "\u043e"], ["\u04eb", "\u04e9"], ["\u04ed", "\u044d"], ["\u04ef", "\u0443"], ["\u04f1", "\u0443"], ["\u04f3", "\u0443"], ["\u04f5", "\u0447"]];
const ca = /[^\p{L}\p{N}]+/u, da = /(\d{3})/g, ea = /(\D)(\d{3})/g, fa = /(\d{3})(\D)/g, ha = "".normalize && /[\u0300-\u036f]/g;
function K(a = {}) {
  if (!this || this.constructor !== K) {
    return new K(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
x = K.prototype;
x.assign = function(a) {
  this.normalize = B(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split, e;
  if (b || "" === b) {
    if ("object" === typeof b && b.constructor !== RegExp) {
      let d = "";
      e = !c;
      c || (d += "\\p{Z}");
      b.letter && (d += "\\p{L}");
      b.number && (d += "\\p{N}", e = !!c);
      b.symbol && (d += "\\p{S}");
      b.punctuation && (d += "\\p{P}");
      b.control && (d += "\\p{C}");
      if (b = b.char) {
        d += "object" === typeof b ? b.join("") : b;
      }
      try {
        this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
      } catch (f) {
        console.error("Your split configuration:", b, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = b, e = !1 === b || 2 > "a1a".split(b).length;
    }
    this.numeric = B(a.numeric, e);
  } else {
    try {
      this.split = B(this.split, ca);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = B(a.numeric, B(this.numeric, !0));
  }
  this.prepare = B(a.prepare, null, this.prepare);
  this.finalize = B(a.finalize, null, this.finalize);
  ha || (this.mapper = new Map(ba));
  b = a.filter;
  this.filter = "function" === typeof b ? b : B(b && new Set(b), null, this.filter);
  this.dedupe = B(a.dedupe, !1, this.dedupe);
  this.matcher = B((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = B((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = B((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = B(a.replacer, null, this.replacer);
  this.minlength = B(a.minlength, 1, this.minlength);
  this.maxlength = B(a.maxlength, 0, this.maxlength);
  this.rtl = B(a.rtl, !1, this.rtl);
  if (this.cache = b = B(a.cache, !0, this.cache)) {
    this.H = null, this.R = "number" === typeof b ? b : 2e5, this.F = new Map(), this.G = new Map(), this.L = this.K = 128;
  }
  this.h = "";
  this.M = null;
  this.D = "";
  this.N = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.h += (this.h ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.D += (this.D ? "|" : "") + d;
    }
  }
  return this;
};
x.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.D += (this.D ? "|" : "") + a;
  this.N = null;
  this.cache && L(this);
  return this;
};
x.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && L(this);
  return this;
};
x.addMapper = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (1 < a.length) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && L(this);
  return this;
};
x.addMatcher = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (2 > a.length && (this.dedupe || this.mapper)) {
    return this.addMapper(a, c);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, c);
  this.h += (this.h ? "|" : "") + a;
  this.M = null;
  this.cache && L(this);
  return this;
};
x.addReplacer = function(a, c) {
  if ("string" === typeof a) {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && L(this);
  return this;
};
x.encode = function(a) {
  if (this.cache && a.length <= this.K) {
    if (this.H) {
      if (this.F.has(a)) {
        return this.F.get(a);
      }
    } else {
      this.H = setTimeout(L, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = ha ? a.normalize("NFKD").replace(ha, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ea, "$1 $2").replace(fa, "$1 $2").replace(da, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let b = [], e = this.split || "" === this.split ? a.split(this.split) : a;
  for (let f = 0, g, h; f < e.length; f++) {
    if ((g = h = e[f]) && !(g.length < this.minlength)) {
      if (c) {
        b.push(g);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(g) : !this.filter.has(g))) {
          if (this.cache && g.length <= this.L) {
            if (this.H) {
              var d = this.G.get(g);
              if (d || "" === d) {
                d && b.push(d);
                continue;
              }
            } else {
              this.H = setTimeout(L, 50, this);
            }
          }
          this.stemmer && 2 < g.length && (this.N || (this.N = new RegExp("(?!^)(" + this.D + ")$")), d = g, g = g.replace(this.N, k => this.stemmer.get(k)), d !== g && this.filter && g.length >= this.minlength && ("function" === typeof this.filter ? !this.filter(g) : this.filter.has(g)) && (g = ""));
          if (g && (this.mapper || this.dedupe && 1 < g.length)) {
            d = "";
            for (let k = 0, l = "", m, n; k < g.length; k++) {
              m = g.charAt(k), m === l && this.dedupe || ((n = this.mapper && this.mapper.get(m)) || "" === n ? n === l && this.dedupe || !(l = n) || (d += n) : d += l = m);
            }
            g = d;
          }
          this.matcher && 1 < g.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), g = g.replace(this.M, k => this.matcher.get(k)));
          if (g && this.replacer) {
            for (d = 0; g && d < this.replacer.length; d += 2) {
              g = g.replace(this.replacer[d], this.replacer[d + 1]);
            }
          }
          this.cache && h.length <= this.L && (this.G.set(h, g), this.G.size > this.R && (this.G.clear(), this.L = this.L / 1.1 | 0));
          g && b.push(g);
        }
      }
    }
  }
  this.finalize && (b = this.finalize(b) || b);
  this.cache && a.length <= this.K && (this.F.set(a, b), this.F.size > this.R && (this.F.clear(), this.K = this.K / 1.1 | 0));
  return b;
};
function L(a) {
  a.H = null;
  a.F.clear();
  a.G.clear();
}
;let M, N;
async function ia(a) {
  a = a.data;
  var c = a.task;
  const b = a.id;
  let e = a.args;
  switch(c) {
    case "init":
      N = a.options || {};
      (c = a.factory) ? (Function("return " + c)()(self), M = new self.FlexSearch.Index(N), delete self.FlexSearch) : M = new O(N);
      postMessage({id:b});
      break;
    default:
      let d;
      if ("export" === c) {
        if (!N.export || "function" !== typeof N.export) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
        }
        e[1] ? (e[0] = N.export, e[2] = 0, e[3] = 1) : e = null;
      }
      if ("import" === c) {
        if (!N.import || "function" !== typeof N.import) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
        }
        e[0] && (a = await N.import.call(M, e[0]), M.import(e[0], a));
      } else {
        (d = e && M[c].apply(M, e)) && d.then && (d = await d);
      }
      postMessage("search" === c ? {id:b, msg:d} : {id:b});
  }
}
;function ja(a) {
  P.call(a, "add");
  P.call(a, "append");
  P.call(a, "search");
  P.call(a, "update");
  P.call(a, "remove");
}
let ka, la, Q;
function ma() {
  ka = Q = 0;
}
function P(a) {
  this[a + "Async"] = function() {
    const c = arguments;
    var b = c[c.length - 1];
    let e;
    "function" === typeof b && (e = b, delete c[c.length - 1]);
    ka ? Q || (Q = Date.now() - la >= this.priority * this.priority * 3) : (ka = setTimeout(ma, 0), la = Date.now());
    if (Q) {
      const f = this;
      return new Promise(g => {
        setTimeout(function() {
          g(f[a + "Async"].apply(f, c));
        }, 0);
      });
    }
    const d = this[a].apply(this, c);
    b = d.then ? d : new Promise(f => f(d));
    e && b.then(e);
    return b;
  };
}
;let R = 0;
function S(a = {}) {
  function c(g) {
    function h(k) {
      k = k.data || k;
      const l = k.id, m = l && d.h[l];
      m && (m(k.msg), delete d.h[l]);
    }
    this.worker = g;
    this.h = C();
    if (this.worker) {
      e ? this.worker.on("message", h) : this.worker.onmessage = h;
      if (a.config) {
        return new Promise(function(k) {
          d.h[++R] = function() {
            k(d);
            1e9 < R && (R = 0);
          };
          d.worker.postMessage({id:R, task:"init", factory:b, options:a});
        });
      }
      this.worker.postMessage({task:"init", factory:b, options:a});
      this.priority = a.priority || 4;
      return this;
    }
  }
  if (!this || this.constructor !== S) {
    return new S(a);
  }
  let b = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  b && (b = b.toString());
  const e = "undefined" === typeof window, d = this, f = na(b, e, a.worker);
  return f.then ? f.then(function(g) {
    return c.call(d, g);
  }) : c.call(this, f);
}
T("add");
T("append");
T("search");
T("update");
T("remove");
T("clear");
T("export");
T("import");
ja(S.prototype);
function T(a) {
  S.prototype[a] = function() {
    const c = this, b = [].slice.call(arguments);
    var e = b[b.length - 1];
    let d;
    "function" === typeof e && (d = e, b.pop());
    e = new Promise(function(f) {
      "export" === a && "function" === typeof b[0] && (b[0] = null);
      c.h[++R] = f;
      c.worker.postMessage({task:a, id:R, args:b});
    });
    return d ? (e.then(d), this) : e;
  };
}
function na(a, c, b) {
  return c ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + ia.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof b ? b : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function oa(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function pa(a, c) {
  c || (c = new Map());
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c.set(e[0], e[1]);
  }
  return c;
}
function qa(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], oa(d[1])[0]]), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function ra(a, c) {
  c || (c = new Map());
  for (let b = 0, e, d; b < a.length; b++) {
    e = a[b], d = c.get(e[0]), c.set(e[0], pa(e[1], d));
  }
  return c;
}
function sa(a) {
  let c = [], b = [];
  for (const e of a.keys()) {
    b.push(e), 250000 === b.length && (c.push(b), b = []);
  }
  b.length && c.push(b);
  return c;
}
function ta(a, c) {
  c || (c = new Set());
  for (let b = 0; b < a.length; b++) {
    c.add(a[b]);
  }
  return c;
}
function U(a, c, b, e, d, f, g = 0) {
  const h = e && e.constructor === Array;
  var k = h ? e.shift() : e;
  if (!k) {
    return this.export(a, c, d, f + 1);
  }
  if ((k = a((c ? c + "." : "") + (g + 1) + "." + b, JSON.stringify(k))) && k.then) {
    const l = this;
    return k.then(function() {
      return U.call(l, a, c, b, h ? e : null, d, f, g + 1);
    });
  }
  return U.call(this, a, c, b, h ? e : null, d, f, g + 1);
}
function ua(a, c) {
  let b = "";
  for (const e of a.entries()) {
    a = e[0];
    const d = e[1];
    let f = "";
    for (let g = 0, h; g < d.length; g++) {
      h = d[g] || [""];
      let k = "";
      for (let l = 0; l < h.length; l++) {
        k += (k ? "," : "") + ("string" === c ? '"' + h[l] + '"' : h[l]);
      }
      k = "[" + k + "]";
      f += (f ? "," : "") + k;
    }
    f = '["' + a + '",[' + f + "]]";
    b += (b ? "," : "") + f;
  }
  return b;
}
;V.prototype.add = function(a, c, b) {
  I(a) && (c = a, a = J(c, this.key));
  if (c && (a || 0 === a)) {
    if (!b && this.reg.has(a)) {
      return this.update(a, c);
    }
    for (let h = 0, k; h < this.field.length; h++) {
      k = this.C[h];
      var e = this.index.get(this.field[h]);
      if ("function" === typeof k) {
        var d = k(c);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = k.I, !d || d(c)) {
          k.constructor === String ? k = ["" + k] : D(k) && (k = [k]), va(c, k, this.J, 0, e, a, k[0], b);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.B.length; e++) {
        var f = this.B[e], g = this.T[e];
        d = this.tag.get(g);
        let h = C();
        if ("function" === typeof f) {
          if (f = f(c), !f) {
            continue;
          }
        } else {
          const k = f.I;
          if (k && !k(c)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = J(c, f);
        }
        if (d && f) {
          D(f) && (f = [f]);
          for (let k = 0, l, m; k < f.length; k++) {
            l = f[k], h[l] || (h[l] = 1, (g = d.get(l)) ? m = g : d.set(l, m = []), b && m.includes(a) || (m.push(a), this.fastupdate && ((g = this.reg.get(a)) ? g.push(m) : this.reg.set(a, [m]))));
          }
        } else {
          d || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!b || !this.store.has(a))) {
      let h;
      if (this.A) {
        h = C();
        for (let k = 0, l; k < this.A.length; k++) {
          l = this.A[k];
          if ((b = l.I) && !b(c)) {
            continue;
          }
          let m;
          if ("function" === typeof l) {
            m = l(c);
            if (!m) {
              continue;
            }
            l = [l.U];
          } else if (D(l) || l.constructor === String) {
            h[l] = c[l];
            continue;
          }
          wa(c, h, l, 0, l[0], m);
        }
      }
      this.store.set(a, h || c);
    }
  }
  return this;
};
function wa(a, c, b, e, d, f) {
  a = a[d];
  if (e === b.length - 1) {
    c[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (c = c[d] = Array(a.length), d = 0; d < a.length; d++) {
        wa(a, c, b, e, d);
      }
    } else {
      c = c[d] || (c[d] = C()), d = b[++e], wa(a, c, b, e, d);
    }
  }
}
function va(a, c, b, e, d, f, g, h) {
  if (a = a[g]) {
    if (e === c.length - 1) {
      if (a.constructor === Array) {
        if (b[e]) {
          for (c = 0; c < a.length; c++) {
            d.add(f, a[c], !0, !0);
          }
          return;
        }
        a = a.join(" ");
      }
      d.add(f, a, h, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          va(a, c, b, e, d, f, g, h);
        }
      } else {
        g = c[++e], va(a, c, b, e, d, f, g, h);
      }
    }
  }
}
;function xa(a, c, b, e, d) {
  const f = a.length;
  let g = [], h, k;
  h = C();
  for (let l = 0, m, n, t, p; l < c; l++) {
    for (let q = 0; q < f; q++) {
      if (t = a[q], l < t.length && (m = t[l])) {
        for (let v = 0; v < m.length; v++) {
          if (n = m[v], (k = h[n]) ? h[n]++ : (k = 0, h[n] = 1), p = g[k] || (g[k] = []), p.push(n), b && k === f - 1 && p.length - e === b) {
            return p;
          }
        }
      }
    }
  }
  if (a = g.length) {
    if (d) {
      g = 1 < g.length ? ya(g, b, e) : (g = g[0]).length > b || e ? g.slice(e, b + e) : g;
    } else {
      if (a < f) {
        return [];
      }
      g = g[a - 1];
      if (b || e) {
        if (g.length > b || e) {
          g = g.slice(e, b + e);
        }
      }
    }
  }
  return g;
}
function ya(a, c, b) {
  const e = [], d = C();
  let f;
  var g = a.length;
  let h;
  for (let k = g - 1; 0 <= k; k--) {
    if (h = (g = a[k]) && g.length) {
      for (let l = 0; l < h; l++) {
        if (f = g[l], !d[f]) {
          if (d[f] = 1, b) {
            b--;
          } else {
            if (e.push(f), e.length === c) {
              return e;
            }
          }
        }
      }
    }
  }
  return e;
}
function za(a, c) {
  const b = C(), e = [];
  for (let d = 0, f; d < c.length; d++) {
    f = c[d];
    for (let g = 0; g < f.length; g++) {
      b[f[g]] = 1;
    }
  }
  for (let d = 0, f; d < a.length; d++) {
    f = a[d], b[f] && (e.push(f), b[f] = 0);
  }
  return e;
}
;function Aa(a, c, b, e) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a, e ? W.call(this, a) : a;
  }
  let d = [];
  for (let f = 0, g, h; f < a.length; f++) {
    if ((g = a[f]) && (h = g.length)) {
      if (b) {
        if (b >= h) {
          b -= h;
          continue;
        }
        b < h && (g = c ? g.slice(b, b + c) : g.slice(b), h = g.length, b = 0);
      }
      h > c && (g = g.slice(0, c), h = c);
      if (!d.length && h >= c) {
        return e ? W.call(this, g) : g;
      }
      d.push(g);
      c -= h;
      if (!c) {
        break;
      }
    }
  }
  d = 1 < d.length ? [].concat.apply([], d) : d[0];
  return e ? W.call(this, d) : d;
}
;function Ba(a, c, b) {
  var e = b[0];
  if (e.then) {
    return Promise.all(b).then(function(m) {
      return a[c].apply(a, m);
    });
  }
  if (e[0] && e[0].index) {
    return a[c].apply(a, e);
  }
  e = [];
  let d = [], f = 0, g = 0, h, k, l;
  for (let m = 0, n; m < b.length; m++) {
    if (n = b[m]) {
      let t;
      if (n.constructor === X) {
        t = n.result;
      } else if (n.constructor === Array) {
        t = n;
      } else {
        if (f = n.limit || 0, g = n.offset || 0, l = n.suggest, k = n.resolve, h = n.enrich && k, n.index) {
          n.resolve = !1, n.enrich = !1, t = n.index.search(n).result, n.resolve = k, n.enrich = h;
        } else if (n.and) {
          t = a.and(n.and);
        } else if (n.or) {
          t = a.or(n.or);
        } else if (n.xor) {
          t = a.xor(n.xor);
        } else if (n.not) {
          t = a.not(n.not);
        } else {
          continue;
        }
      }
      if (t.then) {
        d.push(t);
      } else if (t.length) {
        e[m] = t;
      } else if (!l && ("and" === c || "xor" === c)) {
        e = [];
        break;
      }
    }
  }
  return {O:e, P:d, limit:f, offset:g, enrich:h, resolve:k, suggest:l};
}
;X.prototype.or = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f} = Ba(this, "or", arguments);
  return Ca.call(this, a, c, b, e, d, f);
};
function Ca(a, c, b, e, d, f) {
  if (c.length) {
    const g = this;
    return Promise.all(c).then(function(h) {
      a = [];
      for (let k = 0, l; k < h.length; k++) {
        (l = h[k]).length && (a[k] = l);
      }
      return Ca.call(g, a, [], b, e, d, f);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = ya(a, b, e), e = 0));
  return f ? this.resolve(b, e, d) : this;
}
;X.prototype.and = function() {
  let a = this.result.length, c, b, e, d;
  if (!a) {
    const f = arguments[0];
    f && (a = !!f.suggest, d = f.resolve, c = f.limit, b = f.offset, e = f.enrich && d);
  }
  if (a) {
    const {O:f, P:g, limit:h, offset:k, enrich:l, resolve:m, suggest:n} = Ba(this, "and", arguments);
    return Da.call(this, f, g, h, k, l, m, n);
  }
  return d ? this.resolve(c, b, e) : this;
};
function Da(a, c, b, e, d, f, g) {
  if (c.length) {
    const h = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return Da.call(h, a, [], b, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (c = aa(a)) {
        return this.result = xa(a, c, b, e, g), f ? d ? W.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(b, e, d) : this;
}
;X.prototype.xor = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f, suggest:g} = Ba(this, "xor", arguments);
  return Ea.call(this, a, c, b, e, d, f, g);
};
function Ea(a, c, b, e, d, f, g) {
  if (c.length) {
    const h = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return Ea.call(h, a, [], b, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = Fa.call(this, a, b, e, f, this.h), f ? d ? W.call(this.index, this.result) : this.result : this;
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(b, e, d) : this;
}
function Fa(a, c, b, e, d) {
  const f = [], g = C();
  let h = 0;
  for (let k = 0, l; k < a.length; k++) {
    if (l = a[k]) {
      h < l.length && (h = l.length);
      for (let m = 0, n; m < l.length; m++) {
        if (n = l[m]) {
          for (let t = 0, p; t < n.length; t++) {
            p = n[t], g[p] = g[p] ? 2 : 1;
          }
        }
      }
    }
  }
  for (let k = 0, l, m = 0; k < h; k++) {
    for (let n = 0, t; n < a.length; n++) {
      if (t = a[n]) {
        if (l = t[k]) {
          for (let p = 0, q; p < l.length; p++) {
            if (q = l[p], 1 === g[q]) {
              if (b) {
                b--;
              } else {
                if (e) {
                  if (f.push(q), f.length === c) {
                    return f;
                  }
                } else {
                  const v = k + (n ? d : 0);
                  f[v] || (f[v] = []);
                  f[v].push(q);
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
  }
  return f;
}
;X.prototype.not = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f, suggest:g} = Ba(this, "not", arguments);
  return Ga.call(this, a, c, b, e, d, f, g);
};
function Ga(a, c, b, e, d, f, g) {
  if (c.length) {
    const h = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return Ga.call(h, a, [], b, e, d, f, g);
    });
  }
  if (a.length && this.result.length) {
    this.result = Ha.call(this, a, b, e, f);
  } else if (f) {
    return this.resolve(b, e, d);
  }
  return f ? d ? W.call(this.index, this.result) : this.result : this;
}
function Ha(a, c, b, e) {
  const d = [];
  a = new Set(a.flat().flat());
  for (let f = 0, g, h = 0; f < this.result.length; f++) {
    if (g = this.result[f]) {
      for (let k = 0, l; k < g.length; k++) {
        if (l = g[k], !a.has(l)) {
          if (b) {
            b--;
          } else {
            if (e) {
              if (d.push(l), d.length === c) {
                return d;
              }
            } else {
              if (d[f] || (d[f] = []), d[f].push(l), ++h === c) {
                return d;
              }
            }
          }
        }
      }
    }
  }
  return d;
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
    const c = [];
    for (let b = 0, e; b < this.result.length; b++) {
      if (e = this.result[b]) {
        if (e.length <= a) {
          if (c[b] = e, a -= e.length, !a) {
            break;
          }
        } else {
          c[b] = e.slice(0, a);
          break;
        }
      }
    }
    this.result = c;
  }
  return this;
};
X.prototype.offset = function(a) {
  if (this.result.length) {
    const c = [];
    for (let b = 0, e; b < this.result.length; b++) {
      if (e = this.result[b]) {
        e.length <= a ? a -= e.length : (c[b] = e.slice(a), a = 0);
      }
    }
    this.result = c;
  }
  return this;
};
X.prototype.boost = function(a) {
  this.h += a;
  return this;
};
X.prototype.resolve = function(a, c, b) {
  const e = this.result, d = this.index;
  this.result = this.index = null;
  return e.length ? ("object" === typeof a && (b = a.enrich, c = a.offset, a = a.limit), Aa.call(d, e, a || 100, c, b)) : e;
};
C();
V.prototype.search = function(a, c, b, e) {
  b || (!c && I(a) ? (b = a, a = "") : I(c) && (b = c, c = 0));
  let d = [];
  var f = [];
  let g, h, k, l, m, n, t = 0, p = !0, q;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    var v = b.pluck;
    h = b.merge;
    l = v || b.field || (l = b.index) && (l.index ? null : l);
    m = this.tag && b.tag;
    k = b.suggest;
    p = !0;
    this.store && b.enrich && !p && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    q = (g = this.store && b.enrich && p) && b.highlight;
    c = b.limit || c;
    n = b.offset || 0;
    c || (c = 100);
    if (m) {
      m.constructor !== Array && (m = [m]);
      var u = [];
      for (let y = 0, r; y < m.length; y++) {
        r = m[y];
        if (D(r)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (r.field && r.tag) {
          var w = r.tag;
          if (w.constructor === Array) {
            for (var z = 0; z < w.length; z++) {
              u.push(r.field, w[z]);
            }
          } else {
            u.push(r.field, w);
          }
        } else {
          w = Object.keys(r);
          for (let E = 0, F, A; E < w.length; E++) {
            if (F = w[E], A = r[F], A.constructor === Array) {
              for (z = 0; z < A.length; z++) {
                u.push(F, A[z]);
              }
            } else {
              u.push(F, A);
            }
          }
        }
      }
      if (!u.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      m = u;
      if (!a) {
        e = [];
        if (u.length) {
          for (f = 0; f < u.length; f += 2) {
            v = Ia.call(this, u[f], u[f + 1], c, n, g), d.push({field:u[f], tag:u[f + 1], result:v});
          }
        }
        return e.length ? Promise.all(e).then(function(y) {
          for (let r = 0; r < y.length; r++) {
            d[r].result = y[r];
          }
          return d;
        }) : d;
      }
    }
    l && l.constructor !== Array && (l = [l]);
  }
  l || (l = this.field);
  u = !e && (this.worker || this.db) && [];
  for (let y = 0, r, E, F; y < l.length; y++) {
    E = l[y];
    let A;
    D(E) || (A = E, E = A.field, a = A.query || a, c = A.limit || c, n = A.offset || n, k = A.suggest || k, g = this.store && (A.enrich || g));
    if (e) {
      r = e[y];
    } else {
      if (w = A || b, z = this.index.get(E), m && (w.enrich = !1), u) {
        u[y] = z.search(a, c, w);
        w && g && (w.enrich = g);
        continue;
      } else {
        r = z.search(a, c, w), w && g && (w.enrich = g);
      }
    }
    F = r && (p ? r.length : r.result.length);
    if (m && F) {
      w = [];
      z = 0;
      for (let G = 0, H, Za; G < m.length; G += 2) {
        H = this.tag.get(m[G]);
        if (!H) {
          if (console.warn("Tag '" + m[G] + ":" + m[G + 1] + "' will be skipped because there is no field '" + m[G] + "'."), k) {
            continue;
          } else {
            return p ? d : new X(d);
          }
        }
        if (Za = (H = H && H.get(m[G + 1])) && H.length) {
          z++, w.push(H);
        } else if (!k) {
          return p ? d : new X(d);
        }
      }
      if (z) {
        r = za(r, w);
        F = r.length;
        if (!F && !k) {
          return p ? r : new X(r);
        }
        z--;
      }
    }
    if (F) {
      f[t] = E, d.push(r), t++;
    } else if (1 === l.length) {
      return p ? d : new X(d);
    }
  }
  if (u) {
    const y = this;
    return Promise.all(u).then(function(r) {
      return r.length ? y.search(a, c, b, r) : r;
    });
  }
  if (!t) {
    return p ? d : new X(d);
  }
  if (v && (!g || !this.store)) {
    return d[0];
  }
  u = [];
  for (let y = 0, r; y < f.length; y++) {
    r = d[y];
    g && r.length && !r[0].doc && (r = W.call(this, r));
    if (v) {
      return p ? r : new X(r);
    }
    d[y] = {field:f[y], result:r};
  }
  return h ? Ja(d, c) : q ? Ka(d, a, this.index, this.field, this.C, q) : d;
};
function Ka(a, c, b, e, d, f) {
  let g, h, k;
  for (let m = 0, n, t, p, q, v; m < a.length; m++) {
    n = a[m].result;
    t = a[m].field;
    q = b.get(t);
    p = q.encoder;
    k = q.tokenize;
    v = d[e.indexOf(t)];
    p !== g && (g = p, h = g.encode(c));
    for (let u = 0; u < n.length; u++) {
      let w = "";
      var l = J(n[u].doc, v);
      let z = g.encode(l);
      l = l.split(g.split);
      for (let y = 0, r, E; y < z.length; y++) {
        r = z[y];
        E = l[y];
        let F;
        for (let A = 0, G; A < h.length; A++) {
          if (G = h[A], "strict" === k) {
            if (r === G) {
              w += (w ? " " : "") + f.replace("$1", E);
              F = !0;
              break;
            }
          } else {
            const H = r.indexOf(G);
            if (-1 < H) {
              w += (w ? " " : "") + E.substring(0, H) + f.replace("$1", E.substring(H, G.length)) + E.substring(H + G.length);
              F = !0;
              break;
            }
          }
        }
        F || (w += (w ? " " : "") + l[y]);
      }
      n[u].highlight = w;
    }
  }
  return a;
}
function Ja(a, c) {
  const b = [], e = C();
  for (let d = 0, f, g; d < a.length; d++) {
    f = a[d];
    g = f.result;
    for (let h = 0, k, l, m; h < g.length; h++) {
      if (l = g[h], "object" !== typeof l && (l = {id:l}), k = l.id, m = e[k]) {
        m.push(f.field);
      } else {
        if (b.length === c) {
          return b;
        }
        l.field = e[k] = [f.field];
        b.push(l);
      }
    }
  }
  return b;
}
function Ia(a, c, b, e, d) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(c)) && f.length - e) && 0 < a) {
    if (a > b || e) {
      f = f.slice(e, e + b);
    }
    d && (f = W.call(this, f));
    return f;
  }
}
function W(a) {
  if (!this || !this.store) {
    return a;
  }
  const c = Array(a.length);
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c[b] = {id:e, doc:this.store.get(e)};
  }
  return c;
}
;function V(a) {
  if (!this || this.constructor !== V) {
    return new V(a);
  }
  const c = a.document || a.doc || a;
  var b;
  this.C = [];
  this.field = [];
  this.J = [];
  this.key = (b = c.key || c.id) && La(b, this.J) || "id";
  this.reg = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.A = (b = c.store || null) && b && !0 !== b && [];
  this.store = b && new Map();
  this.cache = (b = a.cache || null) && new Y(b);
  a.cache = !1;
  this.priority = a.priority || 4;
  b = new Map();
  let e = c.index || c.field || c;
  D(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d], D(f) || (g = f, f = f.field), g = I(g) ? Object.assign({}, a, g) : a, b.set(f, new O(g, this.reg)), g.custom ? this.C[d] = g.custom : (this.C[d] = La(f, this.J), g.filter && ("string" === typeof this.C[d] && (this.C[d] = new String(this.C[d])), this.C[d].I = g.filter)), this.field[d] = f;
  }
  if (this.A) {
    a = c.store;
    D(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.custom ? (this.A[d] = f.custom, f.custom.U = g) : (this.A[d] = La(g, this.J), f.filter && ("string" === typeof this.A[d] && (this.A[d] = new String(this.A[d])), this.A[d].I = f.filter));
    }
  }
  this.index = b;
  this.tag = null;
  if (b = c.tag) {
    if ("string" === typeof b && (b = [b]), b.length) {
      this.tag = new Map();
      this.B = [];
      this.T = [];
      for (let d = 0, f, g; d < b.length; d++) {
        f = b[d];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.B[d] = f.custom : (this.B[d] = La(g, this.J), f.filter && ("string" === typeof this.B[d] && (this.B[d] = new String(this.B[d])), this.B[d].I = f.filter));
        this.T[d] = g;
        this.tag.set(g, new Map());
      }
    }
  }
}
function La(a, c) {
  const b = a.split(":");
  let e = 0;
  for (let d = 0; d < b.length; d++) {
    a = b[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (c[e] = !0), a && (b[e++] = a);
  }
  e < b.length && (b.length = e);
  return 1 < e ? b : b[0];
}
x = V.prototype;
x.append = function(a, c) {
  return this.add(a, c, !0);
};
x.update = function(a, c) {
  return this.remove(a).add(a, c);
};
x.remove = function(a) {
  I(a) && (a = J(a, this.key));
  for (var c of this.index.values()) {
    c.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (let b of this.tag.values()) {
        for (let e of b) {
          c = e[0];
          const d = e[1], f = d.indexOf(a);
          -1 < f && (1 < d.length ? d.splice(f, 1) : b.delete(c));
        }
      }
    }
    this.store && this.store.delete(a);
    this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
x.clear = function() {
  const a = [];
  for (const c of this.index.values()) {
    const b = c.clear();
    b.then && a.push(b);
  }
  if (this.tag) {
    for (const c of this.tag.values()) {
      c.clear();
    }
  }
  this.store && this.store.clear();
  this.cache && this.cache.clear();
  return a.length ? Promise.all(a) : this;
};
x.contain = function(a) {
  return this.reg.has(a);
};
x.cleanup = function() {
  for (const a of this.index.values()) {
    a.cleanup();
  }
  return this;
};
x.get = function(a) {
  return this.store.get(a);
};
x.set = function(a, c) {
  this.store.set(a, c);
  return this;
};
x.searchCache = Ma;
x.export = function(a, c, b = 0, e = 0) {
  if (b < this.field.length) {
    const g = this.field[b];
    if ((c = this.index.get(g).export(a, g, b, e = 1)) && c.then) {
      const h = this;
      return c.then(function() {
        return h.export(a, g, b + 1);
      });
    }
    return this.export(a, g, b + 1);
  }
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = sa(this.reg);
      c = null;
      break;
    case 1:
      d = "tag";
      f = this.tag && qa(this.tag, this.reg.size);
      c = null;
      break;
    case 2:
      d = "doc";
      f = this.store && oa(this.store);
      c = null;
      break;
    default:
      return;
  }
  return U.call(this, a, c, d, f, b, e);
};
x.import = function(a, c) {
  var b = a.split(".");
  "json" === b[b.length - 1] && b.pop();
  a = 2 < b.length ? b[0] : "";
  b = 2 < b.length ? b[2] : b[1];
  if (c) {
    "string" === typeof c && (c = JSON.parse(c));
    if (a) {
      return this.index.get(a).import(b, c);
    }
    switch(b) {
      case "reg":
        this.fastupdate = !1;
        this.reg = ta(c, this.reg);
        for (let e = 0, d; e < this.field.length; e++) {
          d = this.index.get(this.field[e]), d.fastupdate = !1, d.reg = this.reg;
        }
        break;
      case "tag":
        this.tag = ra(c, this.tag);
        break;
      case "doc":
        this.store = pa(c, this.store);
    }
  }
};
ja(V.prototype);
function Ma(a, c, b) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new Y());
  let e = this.cache.get(a);
  if (!e) {
    e = this.search(a, c, b);
    if (e.then) {
      const d = this;
      e.then(function(f) {
        d.cache.set(a, f);
        return f;
      });
    }
    this.cache.set(a, e);
  }
  return e;
}
function Y(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
Y.prototype.set = function(a, c) {
  this.cache.set(this.h = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
Y.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
  return c;
};
Y.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
Y.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const Na = {normalize:function(a) {
  return a.toLowerCase();
}};
const Oa = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const Pa = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Qa = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const Ra = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const Sa = /[\x00-\x7F]+/g;
const Ta = /[\x00-\x7F]+/g;
const Ua = /[\x00-\x7F]+/g;
var Va = {LatinExact:{split:/\s+/, normalize:!1}, LatinDefault:Na, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:Oa}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:Oa, matcher:Pa, replacer:Qa}, LatinExtra:{normalize:!0, dedupe:!0, mapper:Oa, replacer:Qa.concat([/(?!^)[aeo]/g, ""]), matcher:Pa}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let e = c.charAt(0), d = Ra[e];
    for (let f = 1, g; f < c.length && (g = c.charAt(f), "h" === g || "w" === g || !(g = Ra[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[b] = e;
  }
}}, ArabicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(Sa, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(Ta, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(Ua, " ");
}}};
const Wa = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
O.prototype.add = function(a, c, b, e) {
  if (c && (a || 0 === a)) {
    if (!e && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (e = c.length) {
      const l = C(), m = C(), n = this.depth, t = this.resolution;
      for (let p = 0; p < e; p++) {
        let q = c[this.rtl ? e - 1 - p : p];
        var d = q.length;
        if (d && (n || !m[q])) {
          var f = this.score ? this.score(c, q, p, null, 0) : Xa(t, e, p), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (let v = 0, u; v < d; v++) {
                  for (f = d; f > v; f--) {
                    g = q.substring(v, f);
                    u = this.rtl ? d - 1 - v : v;
                    var h = this.score ? this.score(c, q, p, g, u) : Xa(t, e, p, d, u);
                    Z(this, m, g, h, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < d) {
                for (h = d - 1; 0 < h; h--) {
                  g = q[this.rtl ? d - 1 - h : h] + g;
                  var k = this.score ? this.score(c, q, p, g, h) : Xa(t, e, p, d, h);
                  Z(this, m, g, k, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (h = 0; h < d; h++) {
                  g += q[this.rtl ? d - 1 - h : h], Z(this, m, g, f, a, b);
                }
                break;
              }
            default:
              if (Z(this, m, q, f, a, b), n && 1 < e && p < e - 1) {
                for (d = C(), g = this.S, f = q, h = Math.min(n + 1, this.rtl ? p + 1 : e - p), d[f] = 1, k = 1; k < h; k++) {
                  if ((q = c[this.rtl ? e - 1 - p - k : p + k]) && !d[q]) {
                    d[q] = 1;
                    const v = this.score ? this.score(c, f, p, q, k - 1) : Xa(g + (e / 2 > g ? 0 : 1), e, p, h - 1, k - 1), u = this.bidirectional && q > f;
                    Z(this, l, u ? f : q, v, a, b, u ? q : f);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || this.reg.add(a);
    }
  }
  return this;
};
function Z(a, c, b, e, d, f, g) {
  let h = g ? a.ctx : a.map, k;
  if (!c[b] || g && !(k = c[b])[g]) {
    g ? (c = k || (c[b] = C()), c[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[e] || (h[e] = []), f && h.includes(d) || (h.push(d), a.fastupdate && ((c = a.reg.get(d)) ? c.push(h) : a.reg.set(d, [h])));
  }
}
function Xa(a, c, b, e, d) {
  return b && 1 < a ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;O.prototype.search = function(a, c, b) {
  b || (!c && I(a) ? (b = a, a = "") : I(c) && (b = c, c = 0));
  var e = [], d = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    d = b.offset || 0;
    var f = b.context;
    var g = b.suggest;
    var h = !0;
    var k = b.resolution;
  } else {
    h = !0;
  }
  a = this.encoder.encode(a);
  b = a.length;
  c = c || (h ? 100 : 0);
  if (1 === b) {
    return g = c, (c = Ya(this, a[0], "")) && c.length ? Aa.call(this, c, g, d) : [];
  }
  f = this.depth && !1 !== f;
  if (2 === b && f && !g) {
    return g = c, (c = Ya(this, a[0], a[1])) && c.length ? Aa.call(this, c, g, d) : [];
  }
  h = C();
  let l = 0;
  if (1 < b && f) {
    var m = a[0];
    l = 1;
  }
  k || 0 === k || (k = m ? this.S : this.resolution);
  for (let q, v; l < b; l++) {
    if ((v = a[l]) && !h[v]) {
      h[v] = 1;
      q = Ya(this, v, m);
      a: {
        f = q;
        var n = e, t = g, p = k;
        let u = [];
        if (f && f.length) {
          if (f.length <= p) {
            n.push(f);
            q = void 0;
            break a;
          }
          for (let w = 0, z; w < p; w++) {
            if (z = f[w]) {
              u[w] = z;
            }
          }
          if (u.length) {
            n.push(u);
            q = void 0;
            break a;
          }
        }
        q = t ? void 0 : u;
      }
      if (q) {
        e = q;
        break;
      }
      m && (g && q && e.length || (m = v));
    }
    g && m && l === b - 1 && !e.length && (k = this.resolution, m = "", l = -1, h = C());
  }
  a: {
    a = e;
    e = a.length;
    m = a;
    if (1 < e) {
      m = xa(a, k, c, d, g);
    } else if (1 === e) {
      g = Aa.call(null, a[0], c, d);
      break a;
    }
    g = m;
  }
  return g;
};
function Ya(a, c, b) {
  let e;
  b && (e = a.bidirectional && c > b) && (e = b, b = c, c = e);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;O.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let e = 0, d; e < b.length; e++) {
        if (d = b[e]) {
          if (2 > d.length) {
            d.pop();
          } else {
            const f = d.indexOf(a);
            f === b.length - 1 ? d.pop() : d.splice(f, 1);
          }
        }
      }
    } else {
      $a(this.map, a), this.depth && $a(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function $a(a, c) {
  let b = 0;
  if (a.constructor === Array) {
    for (let e = 0, d, f; e < a.length; e++) {
      if ((d = a[e]) && d.length) {
        if (f = d.indexOf(c), 0 <= f) {
          1 < d.length ? (d.splice(f, 1), b++) : delete a[e];
          break;
        } else {
          b++;
        }
      }
    }
  } else {
    for (let e of a.entries()) {
      const d = e[0], f = $a(e[1], c);
      f ? b += f : a.delete(d);
    }
  }
  return b;
}
;function O(a, c) {
  if (!this || this.constructor !== O) {
    return new O(a);
  }
  if (a) {
    var b = D(a) ? a : a.preset;
    b && (Wa[b] || console.warn("Preset not found: " + b), a = Object.assign({}, Wa[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const e = !0 === b ? {depth:1} : b || {}, d = D(a.encoder) ? Va[a.encoder] : a.encode || a.encoder || Na;
  this.encoder = d.encode ? d : "object" === typeof d ? new K(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && "default" !== b && b || "strict";
  this.depth = "strict" === b && e.depth || 0;
  this.bidirectional = !1 !== e.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  b = !1;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.S = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (b = a.cache || null) && new Y(b);
  this.priority = a.priority || 4;
}
x = O.prototype;
x.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  return this;
};
x.append = function(a, c) {
  return this.add(a, c, !0);
};
x.contain = function(a) {
  return this.reg.has(a);
};
x.update = function(a, c) {
  const b = this, e = this.remove(a);
  return e && e.then ? e.then(() => b.add(a, c)) : this.add(a, c);
};
function ab(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, e; b < a.length; b++) {
      (e = a[b]) && (c += e.length);
    }
  } else {
    for (const b of a.entries()) {
      const e = b[0], d = ab(b[1]);
      d ? c += d : a.delete(e);
    }
  }
  return c;
}
x.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  ab(this.map);
  this.depth && ab(this.ctx);
  return this;
};
x.searchCache = Ma;
x.export = function(a, c, b = 0, e = 0) {
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = sa(this.reg);
      break;
    case 1:
      d = "cfg";
      f = null;
      break;
    case 2:
      d = "map";
      f = oa(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      f = qa(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return U.call(this, a, c, d, f, b, e);
};
x.import = function(a, c) {
  if (c) {
    switch("string" === typeof c && (c = JSON.parse(c)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = ta(c, this.reg);
        break;
      case "map":
        this.map = pa(c, this.map);
        break;
      case "ctx":
        this.ctx = ra(c, this.ctx);
    }
  }
};
x.serialize = function(a = !0) {
  let c = "", b = "", e = "";
  if (this.reg.size) {
    let f;
    for (var d of this.reg.keys()) {
      f || (f = typeof d), c += (c ? "," : "") + ("string" === f ? '"' + d + '"' : d);
    }
    c = "index.reg=new Set([" + c + "]);";
    b = ua(this.map, f);
    b = "index.map=new Map([" + b + "]);";
    for (const g of this.ctx.entries()) {
      d = g[0];
      let h = ua(g[1], f);
      h = "new Map([" + h + "])";
      h = '["' + d + '",' + h + "]";
      e += (e ? "," : "") + h;
    }
    e = "index.ctx=new Map([" + e + "]);";
  }
  return a ? "function inject(index){" + c + b + e + "}" : c + b + e;
};
ja(O.prototype);
const bb = {Index:O, Charset:Va, Encoder:K, Document:V, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, cb = self;
let db;
(db = cb.define) && db.amd ? db([], function() {
  return bb;
}) : "object" === typeof cb.exports ? cb.exports = bb : cb.FlexSearch = bb;
}(this||self));
