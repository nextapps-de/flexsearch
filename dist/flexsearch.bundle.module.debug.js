/**!
 * FlexSearch.js v0.8.115 (Bundle/Module/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var t;
function A(a, b, c) {
  const e = typeof c, d = typeof a;
  if ("undefined" !== e) {
    if ("undefined" !== d) {
      if (c) {
        if ("function" === d && e === d) {
          return function(k) {
            return a(c(k));
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
  return "undefined" === d ? b : a;
}
function B() {
  return Object.create(null);
}
function E(a) {
  return "string" === typeof a;
}
function I(a) {
  return "object" === typeof a;
}
function aa(a) {
  const b = [];
  for (const c of a.keys()) {
    b.push(c);
  }
  return b;
}
function ba(a, b) {
  if (E(b)) {
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
  for (let c = 0, e; c < a.length; c++) {
    (e = a[c]) && b < e.length && (b = e.length);
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
function J(a) {
  if (!this || this.constructor !== J) {
    return new J(...arguments);
  }
  for (let b = 0; b < arguments.length; b++) {
    this.assign(arguments[b]);
  }
}
t = J.prototype;
t.assign = function(a) {
  this.normalize = A(a.normalize, !0, this.normalize);
  let b = a.include, c = b || a.exclude || a.split, e;
  if (c || "" === c) {
    if ("object" === typeof c && c.constructor !== RegExp) {
      let d = "";
      e = !b;
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
    this.numeric = A(a.numeric, e);
  } else {
    try {
      this.split = A(this.split, ea);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = A(a.numeric, A(this.numeric, !0));
  }
  this.prepare = A(a.prepare, null, this.prepare);
  this.finalize = A(a.finalize, null, this.finalize);
  ja || (this.mapper = new Map(da));
  this.rtl = A(a.rtl, !1, this.rtl);
  this.dedupe = A(a.dedupe, !1, this.dedupe);
  this.filter = A((c = a.filter) && new Set(c), null, this.filter);
  this.matcher = A((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = A((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = A((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = A(a.replacer, null, this.replacer);
  this.minlength = A(a.minlength, 1, this.minlength);
  this.maxlength = A(a.maxlength, 0, this.maxlength);
  if (this.cache = c = A(a.cache, !0, this.cache)) {
    this.H = null, this.S = "number" === typeof c ? c : 2e5, this.B = new Map(), this.G = new Map(), this.L = this.K = 128;
  }
  this.h = "";
  this.M = null;
  this.A = "";
  this.N = null;
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
t.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.A += (this.A ? "|" : "") + a;
  this.N = null;
  this.cache && L(this);
  return this;
};
t.addFilter = function(a) {
  this.filter || (this.filter = new Set());
  this.filter.add(a);
  this.cache && L(this);
  return this;
};
t.addMapper = function(a, b) {
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
t.addMatcher = function(a, b) {
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
  this.cache && L(this);
  return this;
};
t.addReplacer = function(a, b) {
  if ("string" === typeof a) {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && L(this);
  return this;
};
t.encode = function(a) {
  if (this.cache && a.length <= this.K) {
    if (this.H) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.H = setTimeout(L, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = ja ? a.normalize("NFKD").replace(ja, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ha, "$1 $2").replace(ia, "$1 $2").replace(fa, "$1 "));
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let c = [], e = this.split || "" === this.split ? a.split(this.split) : a;
  for (let f = 0, g, k; f < e.length; f++) {
    if ((g = k = e[f]) && !(g.length < this.minlength)) {
      if (b) {
        c.push(g);
      } else {
        if (!this.filter || !this.filter.has(g)) {
          if (this.cache && g.length <= this.L) {
            if (this.H) {
              var d = this.G.get(g);
              if (d || "" === d) {
                d && c.push(d);
                continue;
              }
            } else {
              this.H = setTimeout(L, 50, this);
            }
          }
          this.stemmer && 2 < g.length && (this.N || (this.N = new RegExp("(?!^)(" + this.A + ")$")), g = g.replace(this.N, h => this.stemmer.get(h)), g.length < this.minlength || this.filter && this.filter.has(g)) && (g = "");
          if (g && (this.mapper || this.dedupe && 1 < g.length)) {
            d = "";
            for (let h = 0, l = "", n, m; h < g.length; h++) {
              n = g.charAt(h), n === l && this.dedupe || ((m = this.mapper && this.mapper.get(n)) || "" === m ? m === l && this.dedupe || !(l = m) || (d += m) : d += l = n);
            }
            g = d;
          }
          this.matcher && 1 < g.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), g = g.replace(this.M, h => this.matcher.get(h)));
          if (g && this.replacer) {
            for (d = 0; g && d < this.replacer.length; d += 2) {
              g = g.replace(this.replacer[d], this.replacer[d + 1]);
            }
          }
          this.cache && k.length <= this.L && (this.G.set(k, g), this.G.size > this.S && (this.G.clear(), this.L = this.L / 1.1 | 0));
          g && c.push(g);
        }
      }
    }
  }
  this.finalize && (c = this.finalize(c) || c);
  this.cache && a.length <= this.K && (this.B.set(a, c), this.B.size > this.S && (this.B.clear(), this.K = this.K / 1.1 | 0));
  return c;
};
function L(a) {
  a.H = null;
  a.B.clear();
  a.G.clear();
}
;let M, N;
async function ka(a) {
  a = a.data;
  var b = a.task;
  const c = a.id;
  let e = a.args;
  switch(b) {
    case "init":
      N = a.options || {};
      (b = a.factory) ? (Function("return " + b)()(self), M = new self.FlexSearch.Index(N), delete self.FlexSearch) : M = new O(N);
      postMessage({id:c});
      break;
    default:
      let d;
      if ("export" === b) {
        if (!N.export || "function" !== typeof N.export) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
        }
        e[1] ? (e[0] = N.export, e[2] = 0, e[3] = 1) : e = null;
      }
      if ("import" === b) {
        if (!N.import || "function" !== typeof N.import) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
        }
        e[0] && (a = await N.import.call(M, e[0]), M.import(e[0], a));
      } else {
        (d = e && M[b].apply(M, e)) && d.then && (d = await d);
      }
      postMessage("search" === b ? {id:c, msg:d} : {id:c});
  }
}
;function la(a) {
  P.call(a, "add");
  P.call(a, "append");
  P.call(a, "search");
  P.call(a, "update");
  P.call(a, "remove");
}
let ma, na;
const oa = {}, pa = {};
function qa(a) {
  ma = 0;
  oa[a] = pa[a];
}
function P(a) {
  this[a + "Async"] = function() {
    const b = arguments;
    var c = b[b.length - 1];
    let e;
    "function" === typeof c && (e = c, delete b[b.length - 1]);
    ma || (ma = setTimeout(qa, 0, a), na = Date.now());
    pa[a] || (pa[a] = oa[a] = 1000);
    if (!--oa[a]) {
      oa[a] = pa[a] = pa[a] * this.priority * this.priority * 3 / (Date.now() - na) | 0 || 1;
      ma = clearTimeout(ma);
      const f = this;
      return new Promise(g => {
        setTimeout(function() {
          g(f[a + "Async"].apply(f, b));
        }, 0);
      });
    }
    const d = this[a].apply(this, b);
    c = d.then ? d : new Promise(f => f(d));
    e && c.then(e);
    return c;
  };
}
;let ra = 0;
function Q(a = {}) {
  function b(g) {
    function k(h) {
      h = h.data || h;
      const l = h.id, n = l && d.h[l];
      n && (n(h.msg), delete d.h[l]);
    }
    this.worker = g;
    this.h = B();
    if (this.worker) {
      e ? this.worker.on("message", k) : this.worker.onmessage = k;
      if (a.config) {
        return new Promise(function(h) {
          d.h[++ra] = function() {
            h(d);
          };
          d.worker.postMessage({id:ra, task:"init", factory:c, options:a});
        });
      }
      this.worker.postMessage({task:"init", factory:c, options:a});
      return this;
    }
  }
  if (!this || this.constructor !== Q) {
    return new Q(a);
  }
  let c = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  c && (c = c.toString());
  const e = "undefined" === typeof window, d = this, f = sa(c, e, a.worker);
  return f.then ? f.then(function(g) {
    return b.call(d, g);
  }) : b.call(this, f);
}
R("add");
R("append");
R("search");
R("update");
R("remove");
R("clear");
R("export");
R("import");
la(Q.prototype);
function R(a) {
  Q.prototype[a] = function() {
    const b = this, c = [].slice.call(arguments);
    var e = c[c.length - 1];
    let d;
    "function" === typeof e && (d = e, c.pop());
    e = new Promise(function(f) {
      "export" === a && "function" === typeof c[0] && (c[0] = null);
      b.h[++ra] = f;
      b.worker.postMessage({task:a, id:ra, args:c});
    });
    return d ? (e.then(d), this) : e;
  };
}
function sa(a, b, c) {
  return b ? "undefined" !== typeof module ? new (require("worker_threads")["Worker"])(__dirname + "/node/node.js") : import("worker_threads").then(function(worker){ return new worker["Worker"](import.meta.dirname + "/node/node.mjs"); }) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + ka.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof c ? c : import.meta.url.replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function ta(a, b = 0) {
  let c = [], e = [];
  b && (b = 250000 / b * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === b && (c.push(e), e = []);
  }
  e.length && c.push(e);
  return c;
}
function ua(a, b) {
  b || (b = new Map());
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b.set(e[0], e[1]);
  }
  return b;
}
function va(a, b = 0) {
  let c = [], e = [];
  b && (b = 250000 / b * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], ta(d[1])[0]]), e.length === b && (c.push(e), e = []);
  }
  e.length && c.push(e);
  return c;
}
function wa(a, b) {
  b || (b = new Map());
  for (let c = 0, e, d; c < a.length; c++) {
    e = a[c], d = b.get(e[0]), b.set(e[0], ua(e[1], d));
  }
  return b;
}
function xa(a) {
  let b = [], c = [];
  for (const e of a.keys()) {
    c.push(e), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function ya(a, b) {
  b || (b = new Set());
  for (let c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function za(a, b, c, e, d, f, g = 0) {
  const k = e && e.constructor === Array;
  var h = k ? e.shift() : e;
  if (!h) {
    return this.export(a, b, d, f + 1);
  }
  if ((h = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(h))) && h.then) {
    const l = this;
    return h.then(function() {
      return za.call(l, a, b, c, k ? e : null, d, f, g + 1);
    });
  }
  return za.call(this, a, b, c, k ? e : null, d, f, g + 1);
}
;function Aa(a, b, c, e) {
  let d = [];
  for (let f = 0, g; f < a.index.length; f++) {
    if (g = a.index[f], b >= g.length) {
      b -= g.length;
    } else {
      b = g[e ? "splice" : "slice"](b, c);
      const k = b.length;
      if (k && (d = d.length ? d.concat(b) : b, c -= k, e && (a.length -= k), !c)) {
        break;
      }
      b = 0;
    }
  }
  return d;
}
function S(a) {
  if (!this) {
    return new S(a);
  }
  this.index = a ? [a] : [];
  this.length = a ? a.length : 0;
  const b = this;
  return new Proxy([], {get(c, e) {
    if ("length" === e) {
      return b.length;
    }
    if ("push" === e) {
      return function(d) {
        b.index[b.index.length - 1].push(d);
        b.length++;
      };
    }
    if ("pop" === e) {
      return function() {
        if (b.length) {
          return b.length--, b.index[b.index.length - 1].pop();
        }
      };
    }
    if ("indexOf" === e) {
      return function(d) {
        let f = 0;
        for (let g = 0, k, h; g < b.index.length; g++) {
          k = b.index[g];
          h = k.indexOf(d);
          if (0 <= h) {
            return f + h;
          }
          f += k.length;
        }
        return -1;
      };
    }
    if ("includes" === e) {
      return function(d) {
        for (let f = 0; f < b.index.length; f++) {
          if (b.index[f].includes(d)) {
            return !0;
          }
        }
        return !1;
      };
    }
    if ("slice" === e) {
      return function(d, f) {
        return Aa(b, d || 0, f || b.length, !1);
      };
    }
    if ("splice" === e) {
      return function(d, f) {
        return Aa(b, d || 0, f || b.length, !0);
      };
    }
    if ("constructor" === e) {
      return Array;
    }
    if ("symbol" !== typeof e) {
      return (c = b.index[e / 2 ** 31 | 0]) && c[e];
    }
  }, set(c, e, d) {
    c = e / 2 ** 31 | 0;
    (b.index[c] || (b.index[c] = []))[e] = d;
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
function T(a = 8) {
  if (!this) {
    return new T(a);
  }
  this.index = B();
  this.B = [];
  this.size = 0;
  32 < a ? (this.h = Ba, this.A = BigInt(a)) : (this.h = Ca, this.A = a);
}
T.prototype.get = function(a) {
  const b = this.index[this.h(a)];
  return b && b.get(a);
};
T.prototype.set = function(a, b) {
  var c = this.h(a);
  let e = this.index[c];
  e ? (c = e.size, e.set(a, b), (c -= e.size) && this.size++) : (this.index[c] = e = new Map([[a, b]]), this.B.push(e));
};
function U(a = 8) {
  if (!this) {
    return new U(a);
  }
  this.index = B();
  this.h = [];
  32 < a ? (this.B = Ba, this.A = BigInt(a)) : (this.B = Ca, this.A = a);
}
U.prototype.add = function(a) {
  var b = this.B(a);
  let c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c));
};
t = T.prototype;
t.has = U.prototype.has = function(a) {
  const b = this.index[this.B(a)];
  return b && b.has(a);
};
t.delete = U.prototype.delete = function(a) {
  const b = this.index[this.B(a)];
  b && b.delete(a) && this.size--;
};
t.clear = U.prototype.clear = function() {
  this.index = B();
  this.h = [];
  this.size = 0;
};
t.values = U.prototype.values = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].values()) {
      yield b;
    }
  }
};
t.keys = U.prototype.keys = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].keys()) {
      yield b;
    }
  }
};
t.entries = U.prototype.entries = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].entries()) {
      yield b;
    }
  }
};
function Ca(a) {
  let b = 2 ** this.A - 1;
  if ("number" == typeof a) {
    return a & b;
  }
  let c = 0, e = this.A + 1;
  for (let d = 0; d < a.length; d++) {
    c = (c * e ^ a.charCodeAt(d)) & b;
  }
  return 32 === this.A ? c + 2 ** 31 : c;
}
function Ba(a) {
  let b = BigInt(2) ** this.A - BigInt(1);
  var c = typeof a;
  if ("bigint" === c) {
    return a & b;
  }
  if ("number" === c) {
    return BigInt(a) & b;
  }
  c = BigInt(0);
  let e = this.A + BigInt(1);
  for (let d = 0; d < a.length; d++) {
    c = (c * e ^ BigInt(a.charCodeAt(d))) & b;
  }
  return c;
}
;V.prototype.add = function(a, b, c) {
  I(a) && (b = a, a = ba(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (let k = 0, h; k < this.field.length; k++) {
      h = this.D[k];
      var e = this.index.get(this.field[k]);
      if ("function" === typeof h) {
        var d = h(b);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = h.I, !d || d(b)) {
          h.constructor === String ? h = ["" + h] : E(h) && (h = [h]), Da(b, h, this.J, 0, e, a, h[0], c);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.F.length; e++) {
        var f = this.F[e], g = this.R[e];
        d = this.tag.get(g);
        let k = B();
        if ("function" === typeof f) {
          if (f = f(b), !f) {
            continue;
          }
        } else {
          const h = f.I;
          if (h && !h(b)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = ba(b, f);
        }
        if (d && f) {
          E(f) && (f = [f]);
          for (let h = 0, l, n; h < f.length; h++) {
            if (l = f[h], !k[l] && (k[l] = 1, (g = d.get(l)) ? n = g : d.set(l, n = []), !c || !n.includes(a))) {
              if (n.length === 2 ** 31 - 1) {
                g = new S(n);
                if (this.fastupdate) {
                  for (let m of this.reg.values()) {
                    m.includes(n) && (m[m.indexOf(n)] = g);
                  }
                }
                d.set(l, n = g);
              }
              n.push(a);
              this.fastupdate && ((g = this.reg.get(a)) ? g.push(n) : this.reg.set(a, [n]));
            }
          }
        } else {
          d || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!c || !this.store.has(a))) {
      let k;
      if (this.C) {
        k = B();
        for (let h = 0, l; h < this.C.length; h++) {
          l = this.C[h];
          if ((c = l.I) && !c(b)) {
            continue;
          }
          let n;
          if ("function" === typeof l) {
            n = l(b);
            if (!n) {
              continue;
            }
            l = [l.V];
          } else if (E(l) || l.constructor === String) {
            k[l] = b[l];
            continue;
          }
          Ea(b, k, l, 0, l[0], n);
        }
      }
      this.store.set(a, k || b);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function Ea(a, b, c, e, d, f) {
  a = a[d];
  if (e === c.length - 1) {
    b[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[d] = Array(a.length), d = 0; d < a.length; d++) {
        Ea(a, b, c, e, d);
      }
    } else {
      b = b[d] || (b[d] = B()), d = c[++e], Ea(a, b, c, e, d);
    }
  }
}
function Da(a, b, c, e, d, f, g, k) {
  if (a = a[g]) {
    if (e === b.length - 1) {
      if (a.constructor === Array) {
        if (c[e]) {
          for (b = 0; b < a.length; b++) {
            d.add(f, a[b], !0, !0);
          }
          return;
        }
        a = a.join(" ");
      }
      d.add(f, a, k, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          Da(a, b, c, e, d, f, g, k);
        }
      } else {
        g = b[++e], Da(a, b, c, e, d, f, g, k);
      }
    }
  } else {
    d.db && d.remove(f);
  }
}
;function Fa(a, b, c, e, d, f, g) {
  const k = a.length;
  let h = [], l;
  var n;
  l = B();
  for (let m = 0, q, p, r, u; m < b; m++) {
    for (let v = 0; v < k; v++) {
      if (r = a[v], m < r.length && (q = r[m])) {
        for (let x = 0; x < q.length; x++) {
          p = q[x], (n = l[p]) ? l[p]++ : (n = 0, l[p] = 1), u = h[n] || (h[n] = []), g || (n = m + (v || !d ? 0 : f || 0), u = u[n] || (u[n] = [])), u.push(p);
        }
      }
    }
  }
  if (a = h.length) {
    if (d) {
      h = 1 < h.length ? Ga(h, c, e, g, f) : (h = h[0]).length > c || e ? h.slice(e, c + e) : h;
    } else {
      if (a < k) {
        return [];
      }
      h = h[a - 1];
      if (c || e) {
        if (g) {
          if (h.length > c || e) {
            h = h.slice(e, c + e);
          }
        } else {
          d = [];
          for (let m = 0, q; m < h.length; m++) {
            if (q = h[m], q.length > e) {
              e -= q.length;
            } else {
              if (q.length > c || e) {
                q = q.slice(e, c + e), c -= q.length, e && (e -= q.length);
              }
              d.push(q);
              if (!c) {
                break;
              }
            }
          }
          h = 1 < d.length ? [].concat.apply([], d) : d[0];
        }
      }
    }
  }
  return h;
}
function Ga(a, b, c, e, d) {
  const f = [], g = B();
  let k;
  var h = a.length;
  let l;
  if (e) {
    for (d = h - 1; 0 <= d; d--) {
      if (l = (e = a[d]) && e.length) {
        for (h = 0; h < l; h++) {
          if (k = e[h], !g[k]) {
            if (g[k] = 1, c) {
              c--;
            } else {
              if (f.push(k), f.length === b) {
                return f;
              }
            }
          }
        }
      }
    }
  } else {
    for (let n = h - 1, m, q = 0; 0 <= n; n--) {
      m = a[n];
      for (let p = 0; p < m.length; p++) {
        if (l = (e = m[p]) && e.length) {
          for (let r = 0; r < l; r++) {
            if (k = e[r], !g[k]) {
              if (g[k] = 1, c) {
                c--;
              } else {
                let u = (p + (n < h - 1 ? d || 0 : 0)) / (n + 1) | 0;
                (f[u] || (f[u] = [])).push(k);
                if (++q === b) {
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
function Ha(a, b, c) {
  const e = B(), d = [];
  for (let f = 0, g; f < b.length; f++) {
    g = b[f];
    for (let k = 0; k < g.length; k++) {
      e[g[k]] = 1;
    }
  }
  if (c) {
    for (let f = 0, g; f < a.length; f++) {
      g = a[f], e[g] && (d.push(g), e[g] = 0);
    }
  } else {
    for (let f = 0, g, k; f < a.result.length; f++) {
      for (g = a.result[f], b = 0; b < g.length; b++) {
        k = g[b], e[k] && ((d[f] || (d[f] = [])).push(k), e[k] = 0);
      }
    }
  }
  return d;
}
;function Ia(a, b, c, e) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a, e ? W.call(this, a) : a;
  }
  let d = [];
  for (let f = 0, g, k; f < a.length; f++) {
    if ((g = a[f]) && (k = g.length)) {
      if (c) {
        if (c >= k) {
          c -= k;
          continue;
        }
        c < k && (g = b ? g.slice(c, c + b) : g.slice(c), k = g.length, c = 0);
      }
      k > b && (g = g.slice(0, b), k = b);
      if (!d.length && k >= b) {
        return e ? W.call(this, g) : g;
      }
      d.push(g);
      b -= k;
      if (!b) {
        break;
      }
    }
  }
  d = 1 < d.length ? [].concat.apply([], d) : d[0];
  return e ? W.call(this, d) : d;
}
;function Ja(a, b, c) {
  var e = c[0];
  if (e.then) {
    return Promise.all(c).then(function(n) {
      return a[b].apply(a, n);
    });
  }
  if (e[0] && e[0].index) {
    return a[b].apply(a, e);
  }
  e = [];
  let d = [], f = 0, g = 0, k, h, l;
  for (let n = 0, m; n < c.length; n++) {
    if (m = c[n]) {
      let q;
      if (m.constructor === X) {
        q = m.result;
      } else if (m.constructor === Array) {
        q = m;
      } else {
        if (f = m.limit || 0, g = m.offset || 0, l = m.suggest, h = m.resolve, k = m.enrich && h, m.index) {
          m.resolve = !1, m.enrich = !1, q = m.index.search(m).result, m.resolve = h, m.enrich = k;
        } else if (m.and) {
          q = a.and(m.and);
        } else if (m.or) {
          q = a.or(m.or);
        } else if (m.xor) {
          q = a.xor(m.xor);
        } else if (m.not) {
          q = a.not(m.not);
        } else {
          continue;
        }
      }
      if (q.then) {
        d.push(q);
      } else if (q.length) {
        e[n] = q;
      } else if (!l && ("and" === b || "xor" === b)) {
        e = [];
        break;
      }
    }
  }
  return {O:e, P:d, limit:f, offset:g, enrich:k, resolve:h, suggest:l};
}
;X.prototype.or = function() {
  const {O:a, P:b, limit:c, offset:e, enrich:d, resolve:f} = Ja(this, "or", arguments);
  return Ka.call(this, a, b, c, e, d, f);
};
function Ka(a, b, c, e, d, f) {
  if (b.length) {
    const g = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (let h = 0, l; h < k.length; h++) {
        (l = k[h]).length && (a[h] = l);
      }
      return Ka.call(g, a, [], c, e, d, f);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = Ga(a, c, e, !1, this.h), e = 0));
  return f ? this.resolve(c, e, d) : this;
}
;X.prototype.and = function() {
  let a = this.result.length, b, c, e, d;
  if (!a) {
    const f = arguments[0];
    f && (a = !!f.suggest, d = f.resolve, b = f.limit, c = f.offset, e = f.enrich && d);
  }
  if (a) {
    const {O:f, P:g, limit:k, offset:h, enrich:l, resolve:n, suggest:m} = Ja(this, "and", arguments);
    return La.call(this, f, g, k, h, l, n, m);
  }
  return d ? this.resolve(b, c, e) : this;
};
function La(a, b, c, e, d, f, g) {
  if (b.length) {
    const k = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (let l = 0, n; l < h.length; l++) {
        (n = h[l]).length && (a[l] = n);
      }
      return La.call(k, a, [], c, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (b = ca(a)) {
        return this.result = Fa(a, b, c, e, g, this.h, f), f ? d ? W.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, e, d) : this;
}
;X.prototype.xor = function() {
  const {O:a, P:b, limit:c, offset:e, enrich:d, resolve:f, suggest:g} = Ja(this, "xor", arguments);
  return Ma.call(this, a, b, c, e, d, f, g);
};
function Ma(a, b, c, e, d, f, g) {
  if (b.length) {
    const k = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (let l = 0, n; l < h.length; l++) {
        (n = h[l]).length && (a[l] = n);
      }
      return Ma.call(k, a, [], c, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = Na.call(this, a, c, e, f, this.h), f ? d ? W.call(this.index, this.result) : this.result : this;
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, e, d) : this;
}
function Na(a, b, c, e, d) {
  const f = [], g = B();
  let k = 0;
  for (let h = 0, l; h < a.length; h++) {
    if (l = a[h]) {
      k < l.length && (k = l.length);
      for (let n = 0, m; n < l.length; n++) {
        if (m = l[n]) {
          for (let q = 0, p; q < m.length; q++) {
            p = m[q], g[p] = g[p] ? 2 : 1;
          }
        }
      }
    }
  }
  for (let h = 0, l, n = 0; h < k; h++) {
    for (let m = 0, q; m < a.length; m++) {
      if (q = a[m]) {
        if (l = q[h]) {
          for (let p = 0, r; p < l.length; p++) {
            if (r = l[p], 1 === g[r]) {
              if (c) {
                c--;
              } else {
                if (e) {
                  if (f.push(r), f.length === b) {
                    return f;
                  }
                } else {
                  const u = h + (m ? d : 0);
                  f[u] || (f[u] = []);
                  f[u].push(r);
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
  }
  return f;
}
;X.prototype.not = function() {
  const {O:a, P:b, limit:c, offset:e, enrich:d, resolve:f, suggest:g} = Ja(this, "not", arguments);
  return Oa.call(this, a, b, c, e, d, f, g);
};
function Oa(a, b, c, e, d, f, g) {
  if (b.length) {
    const k = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (let l = 0, n; l < h.length; l++) {
        (n = h[l]).length && (a[l] = n);
      }
      return Oa.call(k, a, [], c, e, d, f, g);
    });
  }
  if (a.length && this.result.length) {
    this.result = Pa.call(this, a, c, e, f);
  } else if (f) {
    return this.resolve(c, e, d);
  }
  return f ? d ? W.call(this.index, this.result) : this.result : this;
}
function Pa(a, b, c, e) {
  const d = [];
  a = new Set(a.flat().flat());
  for (let f = 0, g, k = 0; f < this.result.length; f++) {
    if (g = this.result[f]) {
      for (let h = 0, l; h < g.length; h++) {
        if (l = g[h], !a.has(l)) {
          if (c) {
            c--;
          } else {
            if (e) {
              if (d.push(l), d.length === b) {
                return d;
              }
            } else {
              if (d[f] || (d[f] = []), d[f].push(l), ++k === b) {
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
    const b = [];
    for (let c = 0, e; c < this.result.length; c++) {
      if (e = this.result[c]) {
        if (e.length <= a) {
          if (b[c] = e, a -= e.length, !a) {
            break;
          }
        } else {
          b[c] = e.slice(0, a);
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
    const b = [];
    for (let c = 0, e; c < this.result.length; c++) {
      if (e = this.result[c]) {
        e.length <= a ? a -= e.length : (b[c] = e.slice(a), a = 0);
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
  const e = this.result, d = this.index;
  this.result = this.index = null;
  return e.length ? ("object" === typeof a && (c = a.enrich, b = a.offset, a = a.limit), Ia.call(d, e, a || 100, b, c)) : e;
};
B();
V.prototype.search = function(a, b, c, e) {
  c || (!b && I(a) ? (c = a, a = "") : I(b) && (c = b, b = 0));
  let d = [], f = [], g;
  let k;
  let h;
  let l, n = 0;
  var m = !0;
  let q;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    g = c.pluck;
    k = c.merge;
    h = g || c.field || (h = c.index) && (h.index ? null : h);
    var p = this.tag && c.tag;
    var r = c.suggest;
    m = !1 !== c.resolve;
    if (!m && !g) {
      if (h = h || this.field) {
        E(h) ? g = h : (h.constructor === Array && 1 === h.length && (h = h[0]), g = h.field || h.index);
      }
      if (!g) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    this.store && c.enrich && !m && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    var u = this.store && c.enrich && m;
    q = c.highlight && u;
    b = c.limit || b;
    l = c.offset || 0;
    b || (b = 100);
    if (p && (!this.db || !e)) {
      p.constructor !== Array && (p = [p]);
      var v = [];
      for (let z = 0, w; z < p.length; z++) {
        w = p[z];
        if (E(w)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (w.field && w.tag) {
          var x = w.tag;
          if (x.constructor === Array) {
            for (var y = 0; y < x.length; y++) {
              v.push(w.field, x[y]);
            }
          } else {
            v.push(w.field, x);
          }
        } else {
          x = Object.keys(w);
          for (let D = 0, H, C; D < x.length; D++) {
            if (H = x[D], C = w[H], C.constructor === Array) {
              for (y = 0; y < C.length; y++) {
                v.push(H, C[y]);
              }
            } else {
              v.push(H, C);
            }
          }
        }
      }
      if (!v.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      p = v;
      if (!a) {
        r = [];
        if (v.length) {
          for (p = 0; p < v.length; p += 2) {
            if (this.db) {
              m = this.index.get(v[p]);
              if (!m) {
                console.warn("Tag '" + v[p] + ":" + v[p + 1] + "' will be skipped because there is no field '" + v[p] + "'.");
                continue;
              }
              r.push(m = m.db.tag(v[p + 1], b, l, u));
            } else {
              m = Qa.call(this, v[p], v[p + 1], b, l, u);
            }
            d.push({field:v[p], tag:v[p + 1], result:m});
          }
        }
        return r.length ? Promise.all(r).then(function(z) {
          for (let w = 0; w < z.length; w++) {
            d[w].result = z[w];
          }
          return d;
        }) : d;
      }
    }
    h && h.constructor !== Array && (h = [h]);
  }
  h || (h = this.field);
  v = !e && (this.worker || this.db) && [];
  let F;
  for (let z = 0, w, D, H; z < h.length; z++) {
    D = h[z];
    if (this.db && this.tag && !this.D[z]) {
      continue;
    }
    let C;
    E(D) || (C = D, D = C.field, a = C.query || a, b = C.limit || b, l = C.offset || l, r = C.suggest || r, u = this.store && (C.enrich || u));
    if (e) {
      w = e[z];
    } else {
      if (x = C || c, y = this.index.get(D), p && (this.db && (x.tag = p, F = y.db.support_tag_search, x.field = h), F || (x.enrich = !1)), v) {
        v[z] = y.search(a, b, x);
        x && u && (x.enrich = u);
        continue;
      } else {
        w = y.search(a, b, x), x && u && (x.enrich = u);
      }
    }
    H = w && (m ? w.length : w.result.length);
    if (p && H) {
      x = [];
      y = 0;
      if (this.db && e) {
        if (!F) {
          for (let G = h.length; G < e.length; G++) {
            let K = e[G];
            if (K && K.length) {
              y++, x.push(K);
            } else if (!r) {
              return m ? d : new X(d);
            }
          }
        }
      } else {
        for (let G = 0, K, ob; G < p.length; G += 2) {
          K = this.tag.get(p[G]);
          if (!K) {
            if (console.warn("Tag '" + p[G] + ":" + p[G + 1] + "' will be skipped because there is no field '" + p[G] + "'."), r) {
              continue;
            } else {
              return m ? d : new X(d);
            }
          }
          if (ob = (K = K && K.get(p[G + 1])) && K.length) {
            y++, x.push(K);
          } else if (!r) {
            return m ? d : new X(d);
          }
        }
      }
      if (y) {
        w = Ha(w, x, m);
        H = w.length;
        if (!H && !r) {
          return m ? w : new X(w);
        }
        y--;
      }
    }
    if (H) {
      f[n] = D, d.push(w), n++;
    } else if (1 === h.length) {
      return m ? d : new X(d);
    }
  }
  if (v) {
    if (this.db && p && p.length && !F) {
      for (u = 0; u < p.length; u += 2) {
        e = this.index.get(p[u]);
        if (!e) {
          if (console.warn("Tag '" + p[u] + ":" + p[u + 1] + "' was not found because there is no field '" + p[u] + "'."), r) {
            continue;
          } else {
            return m ? d : new X(d);
          }
        }
        v.push(e.db.tag(p[u + 1], b, l, !1));
      }
    }
    const z = this;
    return Promise.all(v).then(function(w) {
      return w.length ? z.search(a, b, c, w) : w;
    });
  }
  if (!n) {
    return m ? d : new X(d);
  }
  if (g && (!u || !this.store)) {
    return d[0];
  }
  v = [];
  for (let z = 0, w; z < f.length; z++) {
    w = d[z];
    u && w.length && !w[0].doc && (this.db ? v.push(w = this.index.get(this.field[0]).db.enrich(w)) : w = W.call(this, w));
    if (g) {
      return m ? w : new X(w);
    }
    d[z] = {field:f[z], result:w};
  }
  if (u && this.db && v.length) {
    const z = this;
    return Promise.all(v).then(function(w) {
      for (let D = 0; D < w.length; D++) {
        d[D].result = w[D];
      }
      return k ? Ra(d, b) : q ? Sa(d, a, z.index, z.field, z.D, q) : d;
    });
  }
  return k ? Ra(d, b) : q ? Sa(d, a, this.index, this.field, this.D, q) : d;
};
function Sa(a, b, c, e, d, f) {
  let g, k, h;
  for (let n = 0, m, q, p, r, u; n < a.length; n++) {
    m = a[n].result;
    q = a[n].field;
    r = c.get(q);
    p = r.encoder;
    h = r.tokenize;
    u = d[e.indexOf(q)];
    p !== g && (g = p, k = g.encode(b));
    for (let v = 0; v < m.length; v++) {
      let x = "";
      var l = ba(m[v].doc, u);
      let y = g.encode(l);
      l = l.split(g.split);
      for (let F = 0, z, w; F < y.length; F++) {
        z = y[F];
        w = l[F];
        let D;
        for (let H = 0, C; H < k.length; H++) {
          if (C = k[H], "strict" === h) {
            if (z === C) {
              x += (x ? " " : "") + f.replace("$1", w);
              D = !0;
              break;
            }
          } else {
            const G = z.indexOf(C);
            if (-1 < G) {
              x += (x ? " " : "") + w.substring(0, G) + f.replace("$1", w.substring(G, C.length)) + w.substring(G + C.length);
              D = !0;
              break;
            }
          }
        }
        D || (x += (x ? " " : "") + l[F]);
      }
      m[v].highlight = x;
    }
  }
  return a;
}
function Ra(a, b) {
  const c = [], e = B();
  for (let d = 0, f, g; d < a.length; d++) {
    f = a[d];
    g = f.result;
    for (let k = 0, h, l, n; k < g.length; k++) {
      if (l = g[k], h = l.id, n = e[h]) {
        n.push(f.field);
      } else {
        if (c.length === b) {
          return c;
        }
        l.field = e[h] = [f.field];
        c.push(l);
      }
    }
  }
  return c;
}
function Qa(a, b, c, e, d) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(b)) && f.length - e) && 0 < a) {
    if (a > c || e) {
      f = f.slice(e, e + c);
    }
    d && (f = W.call(this, f));
    return f;
  }
}
function W(a) {
  if (!this || !this.store) {
    return a;
  }
  const b = Array(a.length);
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b[c] = {id:e, doc:this.store.get(e)};
  }
  return b;
}
;function V(a) {
  if (!this || this.constructor !== V) {
    return new V(a);
  }
  const b = a.document || a.doc || a;
  let c, e;
  this.D = [];
  this.field = [];
  this.J = [];
  this.key = (c = b.key || b.id) && Ta(c, this.J) || "id";
  (e = a.keystore || 0) && (this.keystore = e);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? e ? new U(e) : new Set() : e ? new T(e) : new Map();
  this.C = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (e ? new T(e) : new Map());
  this.cache = (c = a.cache || null) && new Y(c);
  a.cache = !1;
  this.worker = a.worker;
  this.index = Ua.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.F = [];
      this.R = [];
      for (let d = 0, f, g; d < c.length; d++) {
        f = c[d];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.F[d] = f.custom : (this.F[d] = Ta(g, this.J), f.filter && ("string" === typeof this.F[d] && (this.F[d] = new String(this.F[d])), this.F[d].I = f.filter));
        this.R[d] = g;
        this.tag.set(g, new Map());
      }
    }
  }
  if (this.worker) {
    this.fastupdate = !1;
    a = [];
    for (const d of this.index.values()) {
      d.then && a.push(d);
    }
    if (a.length) {
      const d = this;
      return Promise.all(a).then(function(f) {
        let g = 0;
        for (const k of d.index.entries()) {
          const h = k[0];
          k[1].then && d.index.set(h, f[g++]);
        }
        return d;
      });
    }
  } else {
    a.db && (this.fastupdate = !1, this.mount(a.db));
  }
}
t = V.prototype;
t.mount = function(a) {
  if (this.worker) {
    throw Error("You can't use Worker-Indexes on a persistent model. That would be useless, since each of the persistent model acts like Worker-Index by default (Master/Slave).");
  }
  let b = this.field;
  if (this.tag) {
    for (let d = 0, f; d < this.R.length; d++) {
      f = this.R[d];
      var c = void 0;
      this.index.set(f, c = new O({}, this.reg));
      b === this.field && (b = b.slice(0));
      b.push(f);
      c.tag = this.tag.get(f);
    }
  }
  c = [];
  const e = {db:a.db, type:a.type, fastupdate:a.fastupdate};
  for (let d = 0, f, g; d < b.length; d++) {
    e.field = g = b[d];
    f = this.index.get(g);
    const k = new a.constructor(a.id, e);
    k.id = a.id;
    c[d] = k.mount(f);
    f.document = !0;
    d ? f.bypass = !0 : f.store = this.store;
  }
  this.db = !0;
  return Promise.all(c);
};
t.commit = async function(a, b) {
  const c = [];
  for (const e of this.index.values()) {
    c.push(e.db.commit(e, a, b));
  }
  await Promise.all(c);
  this.reg.clear();
};
t.destroy = function() {
  const a = [];
  for (const b of this.index.values()) {
    a.push(b.destroy());
  }
  return Promise.all(a);
};
function Ua(a, b) {
  const c = new Map();
  let e = b.index || b.field || b;
  E(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d];
    E(f) || (g = f, f = f.field);
    g = I(g) ? Object.assign({}, a, g) : a;
    if (this.worker) {
      const k = new Q(g);
      c.set(f, k);
    }
    this.worker || c.set(f, new O(g, this.reg));
    g.custom ? this.D[d] = g.custom : (this.D[d] = Ta(f, this.J), g.filter && ("string" === typeof this.D[d] && (this.D[d] = new String(this.D[d])), this.D[d].I = g.filter));
    this.field[d] = f;
  }
  if (this.C) {
    a = b.store;
    E(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.custom ? (this.C[d] = f.custom, f.custom.V = g) : (this.C[d] = Ta(g, this.J), f.filter && ("string" === typeof this.C[d] && (this.C[d] = new String(this.C[d])), this.C[d].I = f.filter));
    }
  }
  return c;
}
function Ta(a, b) {
  const c = a.split(":");
  let e = 0;
  for (let d = 0; d < c.length; d++) {
    a = c[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (b[e] = !0), a && (c[e++] = a);
  }
  e < c.length && (c.length = e);
  return 1 < e ? c : c[0];
}
t.append = function(a, b) {
  return this.add(a, b, !0);
};
t.update = function(a, b) {
  return this.remove(a).add(a, b);
};
t.remove = function(a) {
  I(a) && (a = ba(a, this.key));
  for (var b of this.index.values()) {
    b.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (let c of this.tag.values()) {
        for (let e of c) {
          b = e[0];
          const d = e[1], f = d.indexOf(a);
          -1 < f && (1 < d.length ? d.splice(f, 1) : c.delete(b));
        }
      }
    }
    this.store && this.store.delete(a);
    this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
t.clear = function() {
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
t.contain = function(a) {
  return this.db ? this.index.get(this.field[0]).db.has(a) : this.reg.has(a);
};
t.cleanup = function() {
  for (const a of this.index.values()) {
    a.cleanup();
  }
  return this;
};
t.get = function(a) {
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(b) {
    return b[0] && b[0].doc;
  }) : this.store.get(a);
};
t.set = function(a, b) {
  this.store.set(a, b);
  return this;
};
t.searchCache = Va;
t.export = function(a, b, c = 0, e = 0) {
  if (c < this.field.length) {
    const g = this.field[c];
    if ((b = this.index.get(g).export(a, g, c, e = 1)) && b.then) {
      const k = this;
      return b.then(function() {
        return k.export(a, g, c + 1);
      });
    }
    return this.export(a, g, c + 1);
  }
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = xa(this.reg);
      b = null;
      break;
    case 1:
      d = "tag";
      f = va(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      d = "doc";
      f = ta(this.store);
      b = null;
      break;
    case 3:
      d = "cfg";
      b = f = null;
      break;
    default:
      return;
  }
  return za.call(this, a, b, d, f, c, e);
};
t.import = function(a, b) {
  var c = a.split(".");
  "json" === c[c.length - 1] && c.pop();
  const e = 2 < c.length ? c[0] : "";
  c = 2 < c.length ? c[2] : c[1];
  if (this.worker && e) {
    return this.index.get(e).import(a);
  }
  if (b) {
    "string" === typeof b && (b = JSON.parse(b));
    if (e) {
      return this.index.get(e).import(c, b);
    }
    switch(c) {
      case "reg":
        this.fastupdate = !1;
        this.reg = ya(b, this.reg);
        for (let d = 0, f; d < this.field.length; d++) {
          f = this.index.get(this.field[d]), f.fastupdate = !1, f.reg = this.reg;
        }
        if (this.worker) {
          b = [];
          for (const d of this.index.values()) {
            b.push(d.import(a));
          }
          return Promise.all(b);
        }
        break;
      case "tag":
        this.tag = wa(b, this.tag);
        break;
      case "doc":
        this.store = ua(b, this.store);
    }
  }
};
la(V.prototype);
function Va(a, b, c) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new Y());
  let e = this.cache.get(a);
  if (!e) {
    e = this.search(a, b, c);
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
Y.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
Y.prototype.get = function(a) {
  const b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
Y.prototype.remove = function(a) {
  for (const b of this.cache) {
    const c = b[0];
    b[1].includes(a) && this.cache.delete(c);
  }
};
Y.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const Wa = {normalize:function(a) {
  return a.toLowerCase();
}};
const Xa = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const Ya = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["pf", "f"]]), Za = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /([^0-9])\1+/g, "$1"];
const $a = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const ab = /[\x00-\x7F]+/g;
const bb = /[\x00-\x7F]+/g;
const cb = /[\x00-\x7F]+/g;
var db = {LatinExact:{normalize:!1, dedupe:!1}, LatinDefault:Wa, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:Xa}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:Xa, matcher:Ya, replacer:Za}, LatinExtra:{normalize:!0, dedupe:!0, mapper:Xa, replacer:Za.concat([/(?!^)[aeo]/g, ""]), matcher:Ya}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let e = b.charAt(0), d = $a[e];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = $a[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[c] = e;
  }
}}, ArabicDefault:{rtl:!0, normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(ab, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(bb, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(cb, " ");
}}};
const eb = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
O.prototype.add = function(a, b, c, e) {
  if (b && (a || 0 === a)) {
    if (!e && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (e = b.length) {
      const l = B(), n = B(), m = this.depth, q = this.resolution;
      for (let p = 0; p < e; p++) {
        let r = b[this.rtl ? e - 1 - p : p];
        var d = r.length;
        if (d && (m || !n[r])) {
          var f = this.score ? this.score(b, r, p, null, 0) : fb(q, e, p), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (f = 0; f < d; f++) {
                  for (var k = d; k > f; k--) {
                    g = r.substring(f, k);
                    var h = this.score ? this.score(b, r, p, g, f) : fb(q, e, p, d, f);
                    gb(this, n, g, h, a, c);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < d) {
                for (k = d - 1; 0 < k; k--) {
                  g = r[k] + g, h = this.score ? this.score(b, r, p, g, k) : fb(q, e, p, d, k), gb(this, n, g, h, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (k = 0; k < d; k++) {
                  g += r[k], gb(this, n, g, f, a, c);
                }
                break;
              }
            default:
              if (gb(this, n, r, f, a, c), m && 1 < e && p < e - 1) {
                for (d = B(), g = this.U, f = r, k = Math.min(m + 1, e - p), d[f] = 1, h = 1; h < k; h++) {
                  if ((r = b[this.rtl ? e - 1 - p - h : p + h]) && !d[r]) {
                    d[r] = 1;
                    const u = this.score ? this.score(b, f, p, r, h) : fb(g + (e / 2 > g ? 0 : 1), e, p, k - 1, h - 1), v = this.bidirectional && r > f;
                    gb(this, l, v ? f : r, u, a, c, v ? r : f);
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
  this.db && (b || this.commit_task.push({del:a}), this.T && hb(this));
  return this;
};
function gb(a, b, c, e, d, f, g) {
  let k = g ? a.ctx : a.map, h;
  if (!b[c] || g && !(h = b[c])[g]) {
    if (g ? (b = h || (b[c] = B()), b[g] = 1, (h = k.get(g)) ? k = h : k.set(g, k = new Map())) : b[c] = 1, (h = k.get(c)) ? k = h : k.set(c, k = h = []), k = k[e] || (k[e] = []), !f || !k.includes(d)) {
      if (k.length === 2 ** 31 - 1) {
        b = new S(k);
        if (a.fastupdate) {
          for (let l of a.reg.values()) {
            l.includes(k) && (l[l.indexOf(k)] = b);
          }
        }
        h[e] = k = b;
      }
      k.push(d);
      a.fastupdate && ((e = a.reg.get(d)) ? e.push(k) : a.reg.set(d, [k]));
    }
  }
}
function fb(a, b, c, e, d) {
  return c && 1 < a ? b + (e || 0) <= a ? c + (d || 0) : (a - 1) / (b + (e || 0)) * (c + (d || 0)) + 1 | 0 : 0;
}
;O.prototype.search = function(a, b, c) {
  c || (!b && I(a) ? (c = a, a = "") : I(b) && (c = b, b = 0));
  let e = [], d, f, g, k = 0, h, l, n, m, q;
  c ? (a = c.query || a, b = c.limit || b, k = c.offset || 0, f = c.context, g = c.suggest, q = (h = !1 !== c.resolve) && c.enrich, n = c.boost, m = c.resolution, l = this.db && c.tag) : h = this.resolve;
  let p = this.encoder.encode(a);
  d = p.length;
  b = b || (h ? 100 : 0);
  if (1 === d) {
    return ib.call(this, p[0], "", b, k, h, q, l);
  }
  f = this.depth && !1 !== f;
  if (2 === d && f && !g) {
    return ib.call(this, p[0], p[1], b, k, h, q, l);
  }
  let r = B(), u = 0, v;
  1 < d && f && (v = p[0], u = 1);
  m || 0 === m || (m = v ? this.U : this.resolution);
  if (this.db) {
    if (this.db.search && (a = this.db.search(this, p, b, k, g, h, q, l), !1 !== a)) {
      return a;
    }
    const x = this;
    return async function() {
      for (let y, F; u < d; u++) {
        if ((F = p[u]) && !r[F]) {
          r[F] = 1;
          y = await jb(x, F, v, 0, 0, !1, !1);
          if (y = kb(y, e, g, m)) {
            e = y;
            break;
          }
          v && (g && y && e.length || (v = F));
        }
        g && v && u === d - 1 && !e.length && (v = "", u = -1, r = B());
      }
      return lb(e, m, b, k, g, n, h);
    }();
  }
  for (let x, y; u < d; u++) {
    if ((y = p[u]) && !r[y]) {
      r[y] = 1;
      x = jb(this, y, v, 0, 0, !1, !1);
      if (x = kb(x, e, g, m)) {
        e = x;
        break;
      }
      v && (g && x && e.length || (v = y));
    }
    g && v && u === d - 1 && !e.length && (v = "", u = -1, r = B());
  }
  return lb(e, m, b, k, g, n, h);
};
function lb(a, b, c, e, d, f, g) {
  let k = a.length, h = a;
  if (1 < k) {
    h = Fa(a, b, c, e, d, f, g);
  } else if (1 === k) {
    return g ? Ia.call(null, a[0], c, e) : new X(a[0]);
  }
  return g ? h : new X(h);
}
function ib(a, b, c, e, d, f, g) {
  a = jb(this, a, b, c, e, d, f, g);
  return this.db ? a.then(function(k) {
    return d ? k || [] : new X(k);
  }) : a && a.length ? d ? Ia.call(this, a, c, e) : new X(a) : d ? [] : new X();
}
function kb(a, b, c, e) {
  let d = [];
  if (a && a.length) {
    if (a.length <= e) {
      b.push(a);
      return;
    }
    for (let f = 0, g; f < e; f++) {
      if (g = a[f]) {
        d[f] = g;
      }
    }
    if (d.length) {
      b.push(d);
      return;
    }
  }
  if (!c) {
    return d;
  }
}
function jb(a, b, c, e, d, f, g, k) {
  let h;
  c && (h = a.bidirectional && b > c) && (h = c, c = b, b = h);
  if (a.db) {
    return a.db.get(b, c, e, d, f, g, k);
  }
  a = c ? (a = a.ctx.get(c)) && a.get(b) : a.map.get(b);
  return a;
}
;O.prototype.remove = function(a, b) {
  const c = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (c) {
    if (this.fastupdate) {
      for (let e = 0, d; e < c.length; e++) {
        if (d = c[e]) {
          if (2 > d.length) {
            d.pop();
          } else {
            const f = d.indexOf(a);
            f === c.length - 1 ? d.pop() : d.splice(f, 1);
          }
        }
      }
    } else {
      mb(this.map, a), this.depth && mb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.T && hb(this));
  this.cache && this.cache.remove(a);
  return this;
};
function mb(a, b) {
  let c = 0;
  if (a.constructor === Array) {
    for (let e = 0, d, f; e < a.length; e++) {
      if ((d = a[e]) && d.length) {
        if (f = d.indexOf(b), 0 <= f) {
          1 < d.length ? (d.splice(f, 1), c++) : delete a[e];
          break;
        } else {
          c++;
        }
      }
    }
  } else {
    for (let e of a.entries()) {
      const d = e[0], f = mb(e[1], b);
      f ? c += f : a.delete(d);
    }
  }
  return c;
}
;function O(a, b) {
  if (!this || this.constructor !== O) {
    return new O(a);
  }
  if (a) {
    var c = E(a) ? a : a.preset;
    c && (eb[c] || console.warn("Preset not found: " + c), a = Object.assign({}, eb[c], a));
  } else {
    a = {};
  }
  c = a.context;
  const e = !0 === c ? {depth:1} : c || {}, d = E(a.encoder) ? db[a.encoder] : a.encode || a.encoder || Wa;
  this.encoder = d.encode ? d : "object" === typeof d ? new J(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = (c = a.tokenize) && "default" !== c && c || "strict";
  this.depth = "strict" === c && e.depth || 0;
  this.bidirectional = !1 !== e.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new T(c) : new Map();
  this.ctx = c ? new T(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new T(c) : new Map() : c ? new U(c) : new Set());
  this.U = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new Y(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.T = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
t = O.prototype;
t.mount = function(a) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return a.mount(this);
};
t.commit = function(a, b) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.commit(this, a, b);
};
t.destroy = function() {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.destroy();
};
function hb(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a, void 0, void 0);
  }, 0));
}
t.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  this.db && (this.commit_timer && clearTimeout(this.commit_timer), this.commit_timer = null, this.commit_task = [{clear:!0}]);
  return this;
};
t.append = function(a, b) {
  return this.add(a, b, !0);
};
t.contain = function(a) {
  return this.db ? this.db.has(a) : this.reg.has(a);
};
t.update = function(a, b) {
  const c = this, e = this.remove(a);
  return e && e.then ? e.then(() => c.add(a, b)) : this.add(a, b);
};
function nb(a) {
  let b = 0;
  if (a.constructor === Array) {
    for (let c = 0, e; c < a.length; c++) {
      (e = a[c]) && (b += e.length);
    }
  } else {
    for (const c of a) {
      const e = c[0], d = nb(c[1]);
      d ? b += d : a.delete(e);
    }
  }
  return b;
}
t.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  nb(this.map);
  this.depth && nb(this.ctx);
  return this;
};
t.searchCache = Va;
t.export = function(a, b, c = 0, e = 0) {
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = xa(this.reg);
      break;
    case 1:
      d = "cfg";
      f = null;
      break;
    case 2:
      d = "map";
      f = ta(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      f = va(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return za.call(this, a, b, d, f, c, e);
};
t.import = function(a, b) {
  if (b) {
    switch("string" === typeof b && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = ya(b, this.reg);
        break;
      case "map":
        this.map = ua(b, this.map);
        break;
      case "ctx":
        this.ctx = wa(b, this.ctx);
    }
  }
};
t.serialize = function(a = !0) {
  if (!this.reg.size) {
    return "";
  }
  let b = "", c = "";
  for (var e of this.reg.keys()) {
    c || (c = typeof e), b += (b ? "," : "") + ("string" === c ? '"' + e + '"' : e);
  }
  b = "index.reg=new Set([" + b + "]);";
  e = "";
  for (var d of this.map.entries()) {
    var f = d[0], g = d[1], k = "";
    for (let n = 0, m; n < g.length; n++) {
      m = g[n] || [""];
      var h = "";
      for (var l = 0; l < m.length; l++) {
        h += (h ? "," : "") + ("string" === c ? '"' + m[l] + '"' : m[l]);
      }
      h = "[" + h + "]";
      k += (k ? "," : "") + h;
    }
    k = '["' + f + '",[' + k + "]]";
    e += (e ? "," : "") + k;
  }
  e = "index.map=new Map([" + e + "]);";
  d = "";
  for (const n of this.ctx.entries()) {
    f = n[0];
    g = n[1];
    for (const m of g.entries()) {
      g = m[0];
      k = m[1];
      h = "";
      for (let q = 0, p; q < k.length; q++) {
        p = k[q] || [""];
        l = "";
        for (let r = 0; r < p.length; r++) {
          l += (l ? "," : "") + ("string" === c ? '"' + p[r] + '"' : p[r]);
        }
        l = "[" + l + "]";
        h += (h ? "," : "") + l;
      }
      h = 'new Map([["' + g + '",[' + h + "]]])";
      h = '["' + f + '",' + h + "]";
      d += (d ? "," : "") + h;
    }
  }
  d = "index.ctx=new Map([" + d + "]);";
  return a ? "function inject(index){" + b + e + d + "}" : b + e + d;
};
la(O.prototype);
const pb = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), qb = ["map", "ctx", "tag", "reg", "cfg"];
function rb(a, b = {}) {
  if (!this) {
    return new rb(a, b);
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
t = rb.prototype;
t.mount = function(a) {
  if (!a.encoder) {
    return a.mount(this);
  }
  a.db = this;
  return this.open();
};
t.open = function() {
  let a = this;
  navigator.storage && navigator.storage.persist();
  return this.db || new Promise(function(b, c) {
    const e = pb.open(a.id + (a.field ? ":" + a.field : ""), 1);
    e.onupgradeneeded = function() {
      const d = a.db = this.result;
      qb.forEach(f => {
        d.objectStoreNames.contains(f) || d.createObjectStore(f);
      });
    };
    e.onblocked = function(d) {
      console.error("blocked", d);
      c();
    };
    e.onerror = function(d) {
      console.error(this.error, d);
      c();
    };
    e.onsuccess = function() {
      a.db = this.result;
      a.db.onversionchange = function() {
        a.close();
      };
      b(a);
    };
  });
};
t.close = function() {
  this.db.close();
  this.db = null;
};
t.destroy = function() {
  const a = pb.deleteDatabase(this.id + (this.field ? ":" + this.field : ""));
  return Z(a);
};
t.clear = function() {
  const a = this.db.transaction(qb, "readwrite");
  for (let b = 0; b < qb.length; b++) {
    a.objectStore(qb[b]).clear();
  }
  return Z(a);
};
t.get = function(a, b, c = 0, e = 0, d = !0, f = !1) {
  a = this.db.transaction(b ? "ctx" : "map", "readonly").objectStore(b ? "ctx" : "map").get(b ? b + ":" + a : a);
  const g = this;
  return Z(a).then(function(k) {
    let h = [];
    if (!k || !k.length) {
      return h;
    }
    if (d) {
      if (!c && !e && 1 === k.length) {
        return k[0];
      }
      for (let l = 0, n; l < k.length; l++) {
        if ((n = k[l]) && n.length) {
          if (e >= n.length) {
            e -= n.length;
            continue;
          }
          const m = c ? e + Math.min(n.length - e, c) : n.length;
          for (let q = e; q < m; q++) {
            h.push(n[q]);
          }
          e = 0;
          if (h.length === c) {
            break;
          }
        }
      }
      return f ? g.enrich(h) : h;
    }
    return k;
  });
};
t.tag = function(a, b = 0, c = 0, e = !1) {
  a = this.db.transaction("tag", "readonly").objectStore("tag").get(a);
  const d = this;
  return Z(a).then(function(f) {
    if (!f || !f.length || c >= f.length) {
      return [];
    }
    if (!b && !c) {
      return f;
    }
    f = f.slice(c, c + b);
    return e ? d.enrich(f) : f;
  });
};
t.enrich = function(a) {
  "object" !== typeof a && (a = [a]);
  const b = this.db.transaction("reg", "readonly").objectStore("reg"), c = [];
  for (let e = 0; e < a.length; e++) {
    c[e] = Z(b.get(a[e]));
  }
  return Promise.all(c).then(function(e) {
    for (let d = 0; d < e.length; d++) {
      e[d] = {id:a[d], doc:e[d] ? JSON.parse(e[d]) : null};
    }
    return e;
  });
};
t.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return Z(a);
};
t.search = null;
t.info = function() {
};
t.transaction = function(a, b, c) {
  let e = this.h[a + ":" + b];
  if (e) {
    return c.call(this, e);
  }
  let d = this.db.transaction(a, b);
  this.h[a + ":" + b] = e = d.objectStore(a);
  return new Promise((f, g) => {
    d.onerror = h => {
      d.abort();
      d = e = null;
      g(h);
    };
    d.oncomplete = h => {
      d = e = null;
      f(h || !0);
    };
    const k = c.call(this, e);
    this.h[a + ":" + b] = null;
    return k;
  });
};
t.commit = async function(a, b, c) {
  if (b) {
    await this.clear(), a.commit_task = [];
  } else {
    let e = a.commit_task;
    a.commit_task = [];
    for (let d = 0, f; d < e.length; d++) {
      if (f = e[d], f.clear) {
        await this.clear();
        b = !0;
        break;
      } else {
        e[d] = f.W;
      }
    }
    b || (c || (e = e.concat(aa(a.reg))), e.length && await this.remove(e));
  }
  a.reg.size && (await this.transaction("map", "readwrite", function(e) {
    for (const d of a.map) {
      const f = d[0], g = d[1];
      g.length && (b ? e.put(g, f) : e.get(f).onsuccess = function() {
        let k = this.result;
        var h;
        if (k && k.length) {
          const l = Math.max(k.length, g.length);
          for (let n = 0, m, q; n < l; n++) {
            if ((q = g[n]) && q.length) {
              if ((m = k[n]) && m.length) {
                for (h = 0; h < q.length; h++) {
                  m.push(q[h]);
                }
              } else {
                k[n] = q;
              }
              h = 1;
            }
          }
        } else {
          k = g, h = 1;
        }
        h && e.put(k, f);
      });
    }
  }), await this.transaction("ctx", "readwrite", function(e) {
    for (const d of a.ctx) {
      const f = d[0], g = d[1];
      for (const k of g) {
        const h = k[0], l = k[1];
        l.length && (b ? e.put(l, f + ":" + h) : e.get(f + ":" + h).onsuccess = function() {
          let n = this.result;
          var m;
          if (n && n.length) {
            const q = Math.max(n.length, l.length);
            for (let p = 0, r, u; p < q; p++) {
              if ((u = l[p]) && u.length) {
                if ((r = n[p]) && r.length) {
                  for (m = 0; m < u.length; m++) {
                    r.push(u[m]);
                  }
                } else {
                  n[p] = u;
                }
                m = 1;
              }
            }
          } else {
            n = l, m = 1;
          }
          m && e.put(n, f + ":" + h);
        });
      }
    }
  }), a.store ? await this.transaction("reg", "readwrite", function(e) {
    for (const d of a.store) {
      const f = d[0], g = d[1];
      e.put("object" === typeof g ? JSON.stringify(g) : 1, f);
    }
  }) : a.bypass || await this.transaction("reg", "readwrite", function(e) {
    for (const d of a.reg.keys()) {
      e.put(1, d);
    }
  }), a.tag && await this.transaction("tag", "readwrite", function(e) {
    for (const d of a.tag) {
      const f = d[0], g = d[1];
      g.length && (e.get(f).onsuccess = function() {
        let k = this.result;
        k = k && k.length ? k.concat(g) : g;
        e.put(k, f);
      });
    }
  }), a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear());
};
function sb(a, b, c) {
  const e = a.value;
  let d, f, g = 0;
  for (let k = 0, h; k < e.length; k++) {
    if (h = c ? e : e[k]) {
      for (let l = 0, n, m; l < b.length; l++) {
        if (m = b[l], n = h.indexOf(f ? parseInt(m, 10) : m), 0 > n && !f && "string" === typeof m && !isNaN(m) && (n = h.indexOf(parseInt(m, 10))) && (f = 1), 0 <= n) {
          if (d = 1, 1 < h.length) {
            h.splice(n, 1);
          } else {
            e[k] = [];
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
  g ? d && a.update(e) : a.delete();
  a.continue();
}
t.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && sb(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && sb(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && sb(c, a, !0);
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
;export default {Index:O, Charset:db, Encoder:J, Document:V, Worker:Q, Resolver:X, IndexedDB:rb, Language:{}};

export const Index=O;export const  Charset=db;export const  Encoder=J;export const  Document=V;export const  Worker=Q;export const  Resolver=X;export const  IndexedDB=rb;export const  Language={};