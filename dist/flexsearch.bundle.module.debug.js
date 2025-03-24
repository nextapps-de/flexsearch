/**!
 * FlexSearch.js v0.8.132 (Bundle/Module/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var t;
function A(a, c, b) {
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
  const c = [];
  for (const b of a.keys()) {
    c.push(b);
  }
  return c;
}
function ba(a, c) {
  if (E(c)) {
    a = a[c];
  } else {
    for (let b = 0; a && b < c.length; b++) {
      a = a[c[b]];
    }
  }
  return a;
}
function ca(a) {
  let c = 0;
  for (let b = 0, e; b < a.length; b++) {
    (e = a[b]) && c < e.length && (c = e.length);
  }
  return c;
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
function J(a = {}) {
  if (!this || this.constructor !== J) {
    return new J(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
t = J.prototype;
t.assign = function(a) {
  this.normalize = A(a.normalize, !0, this.normalize);
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
  b = a.filter;
  this.filter = "function" === typeof b ? b : A(b && new Set(b), null, this.filter);
  this.dedupe = A(a.dedupe, !1, this.dedupe);
  this.matcher = A((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = A((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = A((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = A(a.replacer, null, this.replacer);
  this.minlength = A(a.minlength, 1, this.minlength);
  this.maxlength = A(a.maxlength, 0, this.maxlength);
  this.rtl = A(a.rtl, !1, this.rtl);
  if (this.cache = b = A(a.cache, !0, this.cache)) {
    this.H = null, this.S = "number" === typeof b ? b : 2e5, this.B = new Map(), this.G = new Map(), this.L = this.K = 128;
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
t.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.A += (this.A ? "|" : "") + a;
  this.N = null;
  this.cache && K(this);
  return this;
};
t.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && K(this);
  return this;
};
t.addMapper = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (1 < a.length) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && K(this);
  return this;
};
t.addMatcher = function(a, c) {
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
  this.cache && K(this);
  return this;
};
t.addReplacer = function(a, c) {
  if ("string" === typeof a) {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && K(this);
  return this;
};
t.encode = function(a) {
  if (this.cache && a.length <= this.K) {
    if (this.H) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.H = setTimeout(K, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = ja ? a.normalize("NFKD").replace(ja, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ha, "$1 $2").replace(ia, "$1 $2").replace(fa, "$1 "));
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
              this.H = setTimeout(K, 50, this);
            }
          }
          this.stemmer && 2 < g.length && (this.N || (this.N = new RegExp("(?!^)(" + this.A + ")$")), d = g, g = g.replace(this.N, k => this.stemmer.get(k)), d !== g && this.filter && g.length >= this.minlength && ("function" === typeof this.filter ? !this.filter(g) : this.filter.has(g)) && (g = ""));
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
          this.cache && h.length <= this.L && (this.G.set(h, g), this.G.size > this.S && (this.G.clear(), this.L = this.L / 1.1 | 0));
          g && b.push(g);
        }
      }
    }
  }
  this.finalize && (b = this.finalize(b) || b);
  this.cache && a.length <= this.K && (this.B.set(a, b), this.B.size > this.S && (this.B.clear(), this.K = this.K / 1.1 | 0));
  return b;
};
function K(a) {
  a.H = null;
  a.B.clear();
  a.G.clear();
}
;let M, N;
async function ka(a) {
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
;function la(a) {
  ma.call(a, "add");
  ma.call(a, "append");
  ma.call(a, "search");
  ma.call(a, "update");
  ma.call(a, "remove");
}
let na, oa, pa;
function qa() {
  na = pa = 0;
}
function ma(a) {
  this[a + "Async"] = function() {
    const c = arguments;
    var b = c[c.length - 1];
    let e;
    "function" === typeof b && (e = b, delete c[c.length - 1]);
    na ? pa || (pa = Date.now() - oa >= this.priority * this.priority * 3) : (na = setTimeout(qa, 0), oa = Date.now());
    if (pa) {
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
;let P = 0;
function Q(a = {}) {
  function c(g) {
    function h(k) {
      k = k.data || k;
      const l = k.id, m = l && d.h[l];
      m && (m(k.msg), delete d.h[l]);
    }
    this.worker = g;
    this.h = B();
    if (this.worker) {
      e ? this.worker.on("message", h) : this.worker.onmessage = h;
      if (a.config) {
        return new Promise(function(k) {
          d.h[++P] = function() {
            k(d);
            1e9 < P && (P = 0);
          };
          d.worker.postMessage({id:P, task:"init", factory:b, options:a});
        });
      }
      this.worker.postMessage({task:"init", factory:b, options:a});
      this.priority = a.priority || 4;
      return this;
    }
  }
  if (!this || this.constructor !== Q) {
    return new Q(a);
  }
  let b = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  b && (b = b.toString());
  const e = "undefined" === typeof window, d = this, f = ra(b, e, a.worker);
  return f.then ? f.then(function(g) {
    return c.call(d, g);
  }) : c.call(this, f);
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
    const c = this, b = [].slice.call(arguments);
    var e = b[b.length - 1];
    let d;
    "function" === typeof e && (d = e, b.pop());
    e = new Promise(function(f) {
      "export" === a && "function" === typeof b[0] && (b[0] = null);
      c.h[++P] = f;
      c.worker.postMessage({task:a, id:P, args:b});
    });
    return d ? (e.then(d), this) : e;
  };
}
function ra(a, c, b) {
  return c ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/worker/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"](import.meta.dirname+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + ka.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof b ? b : import.meta.url.replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function sa(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function ta(a, c) {
  c || (c = new Map());
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c.set(e[0], e[1]);
  }
  return c;
}
function ua(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], sa(d[1])[0]]), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function va(a, c) {
  c || (c = new Map());
  for (let b = 0, e, d; b < a.length; b++) {
    e = a[b], d = c.get(e[0]), c.set(e[0], ta(e[1], d));
  }
  return c;
}
function wa(a) {
  let c = [], b = [];
  for (const e of a.keys()) {
    b.push(e), 250000 === b.length && (c.push(b), b = []);
  }
  b.length && c.push(b);
  return c;
}
function xa(a, c) {
  c || (c = new Set());
  for (let b = 0; b < a.length; b++) {
    c.add(a[b]);
  }
  return c;
}
function ya(a, c, b, e, d, f, g = 0) {
  const h = e && e.constructor === Array;
  var k = h ? e.shift() : e;
  if (!k) {
    return this.export(a, c, d, f + 1);
  }
  if ((k = a((c ? c + "." : "") + (g + 1) + "." + b, JSON.stringify(k))) && k.then) {
    const l = this;
    return k.then(function() {
      return ya.call(l, a, c, b, h ? e : null, d, f, g + 1);
    });
  }
  return ya.call(this, a, c, b, h ? e : null, d, f, g + 1);
}
function za(a, c) {
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
;function Aa(a, c, b, e) {
  let d = [];
  for (let f = 0, g; f < a.index.length; f++) {
    if (g = a.index[f], c >= g.length) {
      c -= g.length;
    } else {
      c = g[e ? "splice" : "slice"](c, b);
      const h = c.length;
      if (h && (d = d.length ? d.concat(c) : c, b -= h, e && (a.length -= h), !b)) {
        break;
      }
      c = 0;
    }
  }
  return d;
}
function S(a) {
  if (!this || this.constructor !== S) {
    return new S(a);
  }
  this.index = a ? [a] : [];
  this.length = a ? a.length : 0;
  const c = this;
  return new Proxy([], {get(b, e) {
    if ("length" === e) {
      return c.length;
    }
    if ("push" === e) {
      return function(d) {
        c.index[c.index.length - 1].push(d);
        c.length++;
      };
    }
    if ("pop" === e) {
      return function() {
        if (c.length) {
          return c.length--, c.index[c.index.length - 1].pop();
        }
      };
    }
    if ("indexOf" === e) {
      return function(d) {
        let f = 0;
        for (let g = 0, h, k; g < c.index.length; g++) {
          h = c.index[g];
          k = h.indexOf(d);
          if (0 <= k) {
            return f + k;
          }
          f += h.length;
        }
        return -1;
      };
    }
    if ("includes" === e) {
      return function(d) {
        for (let f = 0; f < c.index.length; f++) {
          if (c.index[f].includes(d)) {
            return !0;
          }
        }
        return !1;
      };
    }
    if ("slice" === e) {
      return function(d, f) {
        return Aa(c, d || 0, f || c.length, !1);
      };
    }
    if ("splice" === e) {
      return function(d, f) {
        return Aa(c, d || 0, f || c.length, !0);
      };
    }
    if ("constructor" === e) {
      return Array;
    }
    if ("symbol" !== typeof e) {
      return (b = c.index[e / 2 ** 31 | 0]) && b[e];
    }
  }, set(b, e, d) {
    b = e / 2 ** 31 | 0;
    (c.index[b] || (c.index[b] = []))[e] = d;
    c.length++;
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
  if (!this || this.constructor !== T) {
    return new T(a);
  }
  this.index = B();
  this.h = [];
  this.size = 0;
  32 < a ? (this.B = Ba, this.A = BigInt(a)) : (this.B = Ca, this.A = a);
}
T.prototype.get = function(a) {
  const c = this.index[this.B(a)];
  return c && c.get(a);
};
T.prototype.set = function(a, c) {
  var b = this.B(a);
  let e = this.index[b];
  e ? (b = e.size, e.set(a, c), (b -= e.size) && this.size++) : (this.index[b] = e = new Map([[a, c]]), this.h.push(e), this.size++);
};
function U(a = 8) {
  if (!this || this.constructor !== U) {
    return new U(a);
  }
  this.index = B();
  this.h = [];
  this.size = 0;
  32 < a ? (this.B = Ba, this.A = BigInt(a)) : (this.B = Ca, this.A = a);
}
U.prototype.add = function(a) {
  var c = this.B(a);
  let b = this.index[c];
  b ? (c = b.size, b.add(a), (c -= b.size) && this.size++) : (this.index[c] = b = new Set([a]), this.h.push(b), this.size++);
};
t = T.prototype;
t.has = U.prototype.has = function(a) {
  const c = this.index[this.B(a)];
  return c && c.has(a);
};
t.delete = U.prototype.delete = function(a) {
  const c = this.index[this.B(a)];
  c && c.delete(a) && this.size--;
};
t.clear = U.prototype.clear = function() {
  this.index = B();
  this.h = [];
  this.size = 0;
};
t.values = U.prototype.values = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let c of this.h[a].values()) {
      yield c;
    }
  }
};
t.keys = U.prototype.keys = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let c of this.h[a].keys()) {
      yield c;
    }
  }
};
t.entries = U.prototype.entries = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let c of this.h[a].entries()) {
      yield c;
    }
  }
};
function Ca(a) {
  let c = 2 ** this.A - 1;
  if ("number" == typeof a) {
    return a & c;
  }
  let b = 0, e = this.A + 1;
  for (let d = 0; d < a.length; d++) {
    b = (b * e ^ a.charCodeAt(d)) & c;
  }
  return 32 === this.A ? b + 2 ** 31 : b;
}
function Ba(a) {
  let c = BigInt(2) ** this.A - BigInt(1);
  var b = typeof a;
  if ("bigint" === b) {
    return a & c;
  }
  if ("number" === b) {
    return BigInt(a) & c;
  }
  b = BigInt(0);
  let e = this.A + BigInt(1);
  for (let d = 0; d < a.length; d++) {
    b = (b * e ^ BigInt(a.charCodeAt(d))) & c;
  }
  return b;
}
;V.prototype.add = function(a, c, b) {
  I(a) && (c = a, a = ba(c, this.key));
  if (c && (a || 0 === a)) {
    if (!b && this.reg.has(a)) {
      return this.update(a, c);
    }
    for (let h = 0, k; h < this.field.length; h++) {
      k = this.D[h];
      var e = this.index.get(this.field[h]);
      if ("function" === typeof k) {
        var d = k(c);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = k.I, !d || d(c)) {
          k.constructor === String ? k = ["" + k] : E(k) && (k = [k]), Da(c, k, this.J, 0, e, a, k[0], b);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.F.length; e++) {
        var f = this.F[e], g = this.R[e];
        d = this.tag.get(g);
        let h = B();
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
          f = ba(c, f);
        }
        if (d && f) {
          E(f) && (f = [f]);
          for (let k = 0, l, m; k < f.length; k++) {
            if (l = f[k], !h[l] && (h[l] = 1, (g = d.get(l)) ? m = g : d.set(l, m = []), !b || !m.includes(a))) {
              if (m.length === 2 ** 31 - 1) {
                g = new S(m);
                if (this.fastupdate) {
                  for (let n of this.reg.values()) {
                    n.includes(m) && (n[n.indexOf(m)] = g);
                  }
                }
                d.set(l, m = g);
              }
              m.push(a);
              this.fastupdate && ((g = this.reg.get(a)) ? g.push(m) : this.reg.set(a, [m]));
            }
          }
        } else {
          d || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!b || !this.store.has(a))) {
      let h;
      if (this.C) {
        h = B();
        for (let k = 0, l; k < this.C.length; k++) {
          l = this.C[k];
          if ((b = l.I) && !b(c)) {
            continue;
          }
          let m;
          if ("function" === typeof l) {
            m = l(c);
            if (!m) {
              continue;
            }
            l = [l.V];
          } else if (E(l) || l.constructor === String) {
            h[l] = c[l];
            continue;
          }
          Ea(c, h, l, 0, l[0], m);
        }
      }
      this.store.set(a, h || c);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function Ea(a, c, b, e, d, f) {
  a = a[d];
  if (e === b.length - 1) {
    c[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (c = c[d] = Array(a.length), d = 0; d < a.length; d++) {
        Ea(a, c, b, e, d);
      }
    } else {
      c = c[d] || (c[d] = B()), d = b[++e], Ea(a, c, b, e, d);
    }
  }
}
function Da(a, c, b, e, d, f, g, h) {
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
          Da(a, c, b, e, d, f, g, h);
        }
      } else {
        g = c[++e], Da(a, c, b, e, d, f, g, h);
      }
    }
  } else {
    d.db && d.remove(f);
  }
}
;function Fa(a, c, b, e, d, f, g) {
  const h = a.length;
  let k = [], l, m;
  l = B();
  for (let n = 0, q, r, p, v; n < c; n++) {
    for (let u = 0; u < h; u++) {
      if (p = a[u], n < p.length && (q = p[n])) {
        for (let x = 0; x < q.length; x++) {
          r = q[x];
          (m = l[r]) ? l[r]++ : (m = 0, l[r] = 1);
          v = k[m] || (k[m] = []);
          if (!g) {
            let y = n + (u || !d ? 0 : f || 0);
            v = v[y] || (v[y] = []);
          }
          v.push(r);
          if (g && b && m === h - 1 && v.length - e === b) {
            return v;
          }
        }
      }
    }
  }
  if (a = k.length) {
    if (d) {
      k = 1 < k.length ? Ga(k, b, e, g, f) : (k = k[0]).length > b || e ? k.slice(e, b + e) : k;
    } else {
      if (a < h) {
        return [];
      }
      k = k[a - 1];
      if (b || e) {
        if (g) {
          if (k.length > b || e) {
            k = k.slice(e, b + e);
          }
        } else {
          d = [];
          for (let n = 0, q; n < k.length; n++) {
            if (q = k[n], q.length > e) {
              e -= q.length;
            } else {
              if (q.length > b || e) {
                q = q.slice(e, b + e), b -= q.length, e && (e -= q.length);
              }
              d.push(q);
              if (!b) {
                break;
              }
            }
          }
          k = 1 < d.length ? [].concat.apply([], d) : d[0];
        }
      }
    }
  }
  return k;
}
function Ga(a, c, b, e, d) {
  const f = [], g = B();
  let h;
  var k = a.length;
  let l;
  if (e) {
    for (d = k - 1; 0 <= d; d--) {
      if (l = (e = a[d]) && e.length) {
        for (k = 0; k < l; k++) {
          if (h = e[k], !g[h]) {
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
    }
  } else {
    for (let m = k - 1, n, q = 0; 0 <= m; m--) {
      n = a[m];
      for (let r = 0; r < n.length; r++) {
        if (l = (e = n[r]) && e.length) {
          for (let p = 0; p < l; p++) {
            if (h = e[p], !g[h]) {
              if (g[h] = 1, b) {
                b--;
              } else {
                let v = (r + (m < k - 1 ? d || 0 : 0)) / (m + 1) | 0;
                (f[v] || (f[v] = [])).push(h);
                if (++q === c) {
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
function Ha(a, c, b) {
  const e = B(), d = [];
  for (let f = 0, g; f < c.length; f++) {
    g = c[f];
    for (let h = 0; h < g.length; h++) {
      e[g[h]] = 1;
    }
  }
  if (b) {
    for (let f = 0, g; f < a.length; f++) {
      g = a[f], e[g] && (d.push(g), e[g] = 0);
    }
  } else {
    for (let f = 0, g, h; f < a.result.length; f++) {
      for (g = a.result[f], c = 0; c < g.length; c++) {
        h = g[c], e[h] && ((d[f] || (d[f] = [])).push(h), e[h] = 0);
      }
    }
  }
  return d;
}
;function Ia(a, c, b, e) {
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
;function Ja(a, c, b) {
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
      let q;
      if (n.constructor === X) {
        q = n.result;
      } else if (n.constructor === Array) {
        q = n;
      } else {
        if (f = n.limit || 0, g = n.offset || 0, l = n.suggest, k = n.resolve, h = n.enrich && k, n.index) {
          n.resolve = !1, n.enrich = !1, q = n.index.search(n).result, n.resolve = k, n.enrich = h;
        } else if (n.and) {
          q = a.and(n.and);
        } else if (n.or) {
          q = a.or(n.or);
        } else if (n.xor) {
          q = a.xor(n.xor);
        } else if (n.not) {
          q = a.not(n.not);
        } else {
          continue;
        }
      }
      if (q.then) {
        d.push(q);
      } else if (q.length) {
        e[m] = q;
      } else if (!l && ("and" === c || "xor" === c)) {
        e = [];
        break;
      }
    }
  }
  return {O:e, P:d, limit:f, offset:g, enrich:h, resolve:k, suggest:l};
}
;X.prototype.or = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f} = Ja(this, "or", arguments);
  return Ka.call(this, a, c, b, e, d, f);
};
function Ka(a, c, b, e, d, f) {
  if (c.length) {
    const g = this;
    return Promise.all(c).then(function(h) {
      a = [];
      for (let k = 0, l; k < h.length; k++) {
        (l = h[k]).length && (a[k] = l);
      }
      return Ka.call(g, a, [], b, e, d, f);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = Ga(a, b, e, !1, this.h), e = 0));
  return f ? this.resolve(b, e, d) : this;
}
;X.prototype.and = function() {
  let a = this.result.length, c, b, e, d;
  if (!a) {
    const f = arguments[0];
    f && (a = !!f.suggest, d = f.resolve, c = f.limit, b = f.offset, e = f.enrich && d);
  }
  if (a) {
    const {O:f, P:g, limit:h, offset:k, enrich:l, resolve:m, suggest:n} = Ja(this, "and", arguments);
    return La.call(this, f, g, h, k, l, m, n);
  }
  return d ? this.resolve(c, b, e) : this;
};
function La(a, c, b, e, d, f, g) {
  if (c.length) {
    const h = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return La.call(h, a, [], b, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (c = ca(a)) {
        return this.result = Fa(a, c, b, e, g, this.h, f), f ? d ? W.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(b, e, d) : this;
}
;X.prototype.xor = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f, suggest:g} = Ja(this, "xor", arguments);
  return Ma.call(this, a, c, b, e, d, f, g);
};
function Ma(a, c, b, e, d, f, g) {
  if (c.length) {
    const h = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return Ma.call(h, a, [], b, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = Na.call(this, a, b, e, f, this.h), f ? d ? W.call(this.index, this.result) : this.result : this;
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(b, e, d) : this;
}
function Na(a, c, b, e, d) {
  const f = [], g = B();
  let h = 0;
  for (let k = 0, l; k < a.length; k++) {
    if (l = a[k]) {
      h < l.length && (h = l.length);
      for (let m = 0, n; m < l.length; m++) {
        if (n = l[m]) {
          for (let q = 0, r; q < n.length; q++) {
            r = n[q], g[r] = g[r] ? 2 : 1;
          }
        }
      }
    }
  }
  for (let k = 0, l, m = 0; k < h; k++) {
    for (let n = 0, q; n < a.length; n++) {
      if (q = a[n]) {
        if (l = q[k]) {
          for (let r = 0, p; r < l.length; r++) {
            if (p = l[r], 1 === g[p]) {
              if (b) {
                b--;
              } else {
                if (e) {
                  if (f.push(p), f.length === c) {
                    return f;
                  }
                } else {
                  const v = k + (n ? d : 0);
                  f[v] || (f[v] = []);
                  f[v].push(p);
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
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f, suggest:g} = Ja(this, "not", arguments);
  return Oa.call(this, a, c, b, e, d, f, g);
};
function Oa(a, c, b, e, d, f, g) {
  if (c.length) {
    const h = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return Oa.call(h, a, [], b, e, d, f, g);
    });
  }
  if (a.length && this.result.length) {
    this.result = Pa.call(this, a, b, e, f);
  } else if (f) {
    return this.resolve(b, e, d);
  }
  return f ? d ? W.call(this.index, this.result) : this.result : this;
}
function Pa(a, c, b, e) {
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
  return e.length ? ("object" === typeof a && (b = a.enrich, c = a.offset, a = a.limit), Ia.call(d, e, a || 100, c, b)) : e;
};
B();
V.prototype.search = function(a, c, b, e) {
  b || (!c && I(a) ? (b = a, a = "") : I(c) && (b = c, c = 0));
  let d = [], f = [], g;
  var h;
  let k;
  let l;
  let m, n = 0;
  var q = !0;
  let r;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    g = b.pluck;
    k = b.merge;
    l = g || b.field || (l = b.index) && (l.index ? null : l);
    var p = this.tag && b.tag;
    var v = b.suggest;
    q = !1 !== b.resolve;
    if (!q && !g) {
      if (l = l || this.field) {
        E(l) ? g = l : (l.constructor === Array && 1 === l.length && (l = l[0]), g = l.field || l.index);
      }
      if (!g) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    this.store && b.enrich && !q && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    r = (h = this.store && b.enrich && q) && b.highlight;
    c = b.limit || c;
    m = b.offset || 0;
    c || (c = 100);
    if (p && (!this.db || !e)) {
      p.constructor !== Array && (p = [p]);
      var u = [];
      for (let z = 0, w; z < p.length; z++) {
        w = p[z];
        if (E(w)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (w.field && w.tag) {
          var x = w.tag;
          if (x.constructor === Array) {
            for (var y = 0; y < x.length; y++) {
              u.push(w.field, x[y]);
            }
          } else {
            u.push(w.field, x);
          }
        } else {
          x = Object.keys(w);
          for (let D = 0, H, C; D < x.length; D++) {
            if (H = x[D], C = w[H], C.constructor === Array) {
              for (y = 0; y < C.length; y++) {
                u.push(H, C[y]);
              }
            } else {
              u.push(H, C);
            }
          }
        }
      }
      if (!u.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      p = u;
      if (!a) {
        v = [];
        if (u.length) {
          for (p = 0; p < u.length; p += 2) {
            if (this.db) {
              q = this.index.get(u[p]);
              if (!q) {
                console.warn("Tag '" + u[p] + ":" + u[p + 1] + "' will be skipped because there is no field '" + u[p] + "'.");
                continue;
              }
              v.push(q = q.db.tag(u[p + 1], c, m, h));
            } else {
              q = Qa.call(this, u[p], u[p + 1], c, m, h);
            }
            d.push({field:u[p], tag:u[p + 1], result:q});
          }
        }
        return v.length ? Promise.all(v).then(function(z) {
          for (let w = 0; w < z.length; w++) {
            d[w].result = z[w];
          }
          return d;
        }) : d;
      }
    }
    l && l.constructor !== Array && (l = [l]);
  }
  l || (l = this.field);
  u = !e && (this.worker || this.db) && [];
  let F;
  for (let z = 0, w, D, H; z < l.length; z++) {
    D = l[z];
    if (this.db && this.tag && !this.D[z]) {
      continue;
    }
    let C;
    E(D) || (C = D, D = C.field, a = C.query || a, c = C.limit || c, m = C.offset || m, v = C.suggest || v, h = this.store && (C.enrich || h));
    if (e) {
      w = e[z];
    } else {
      if (x = C || b, y = this.index.get(D), p && (this.db && (x.tag = p, F = y.db.support_tag_search, x.field = l), F || (x.enrich = !1)), u) {
        u[z] = y.search(a, c, x);
        x && h && (x.enrich = h);
        continue;
      } else {
        w = y.search(a, c, x), x && h && (x.enrich = h);
      }
    }
    H = w && (q ? w.length : w.result.length);
    if (p && H) {
      x = [];
      y = 0;
      if (this.db && e) {
        if (!F) {
          for (let G = l.length; G < e.length; G++) {
            let L = e[G];
            if (L && L.length) {
              y++, x.push(L);
            } else if (!v) {
              return q ? d : new X(d);
            }
          }
        }
      } else {
        for (let G = 0, L, ob; G < p.length; G += 2) {
          L = this.tag.get(p[G]);
          if (!L) {
            if (console.warn("Tag '" + p[G] + ":" + p[G + 1] + "' will be skipped because there is no field '" + p[G] + "'."), v) {
              continue;
            } else {
              return q ? d : new X(d);
            }
          }
          if (ob = (L = L && L.get(p[G + 1])) && L.length) {
            y++, x.push(L);
          } else if (!v) {
            return q ? d : new X(d);
          }
        }
      }
      if (y) {
        w = Ha(w, x, q);
        H = w.length;
        if (!H && !v) {
          return q ? w : new X(w);
        }
        y--;
      }
    }
    if (H) {
      f[n] = D, d.push(w), n++;
    } else if (1 === l.length) {
      return q ? d : new X(d);
    }
  }
  if (u) {
    if (this.db && p && p.length && !F) {
      for (h = 0; h < p.length; h += 2) {
        e = this.index.get(p[h]);
        if (!e) {
          if (console.warn("Tag '" + p[h] + ":" + p[h + 1] + "' was not found because there is no field '" + p[h] + "'."), v) {
            continue;
          } else {
            return q ? d : new X(d);
          }
        }
        u.push(e.db.tag(p[h + 1], c, m, !1));
      }
    }
    const z = this;
    return Promise.all(u).then(function(w) {
      return w.length ? z.search(a, c, b, w) : w;
    });
  }
  if (!n) {
    return q ? d : new X(d);
  }
  if (g && (!h || !this.store)) {
    return d[0];
  }
  u = [];
  for (let z = 0, w; z < f.length; z++) {
    w = d[z];
    h && w.length && !w[0].doc && (this.db ? u.push(w = this.index.get(this.field[0]).db.enrich(w)) : w = W.call(this, w));
    if (g) {
      return q ? w : new X(w);
    }
    d[z] = {field:f[z], result:w};
  }
  if (h && this.db && u.length) {
    const z = this;
    return Promise.all(u).then(function(w) {
      for (let D = 0; D < w.length; D++) {
        d[D].result = w[D];
      }
      return k ? Ra(d, c) : r ? Sa(d, a, z.index, z.field, z.D, r) : d;
    });
  }
  return k ? Ra(d, c) : r ? Sa(d, a, this.index, this.field, this.D, r) : d;
};
function Sa(a, c, b, e, d, f) {
  let g, h, k;
  for (let m = 0, n, q, r, p, v; m < a.length; m++) {
    n = a[m].result;
    q = a[m].field;
    p = b.get(q);
    r = p.encoder;
    k = p.tokenize;
    v = d[e.indexOf(q)];
    r !== g && (g = r, h = g.encode(c));
    for (let u = 0; u < n.length; u++) {
      let x = "";
      var l = ba(n[u].doc, v);
      let y = g.encode(l);
      l = l.split(g.split);
      for (let F = 0, z, w; F < y.length; F++) {
        z = y[F];
        w = l[F];
        let D;
        for (let H = 0, C; H < h.length; H++) {
          if (C = h[H], "strict" === k) {
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
      n[u].highlight = x;
    }
  }
  return a;
}
function Ra(a, c) {
  const b = [], e = B();
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
function Qa(a, c, b, e, d) {
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
  let b, e;
  this.D = [];
  this.field = [];
  this.J = [];
  this.key = (b = c.key || c.id) && Ta(b, this.J) || "id";
  (e = a.keystore || 0) && (this.keystore = e);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? e ? new U(e) : new Set() : e ? new T(e) : new Map();
  this.C = (b = c.store || null) && b && !0 !== b && [];
  this.store = b && (e ? new T(e) : new Map());
  this.cache = (b = a.cache || null) && new Y(b);
  a.cache = !1;
  this.worker = a.worker;
  this.priority = a.priority || 4;
  this.index = Ua.call(this, a, c);
  this.tag = null;
  if (b = c.tag) {
    if ("string" === typeof b && (b = [b]), b.length) {
      this.tag = new Map();
      this.F = [];
      this.R = [];
      for (let d = 0, f, g; d < b.length; d++) {
        f = b[d];
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
        for (const h of d.index.entries()) {
          const k = h[0];
          h[1].then && d.index.set(k, f[g++]);
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
  let c = this.field;
  if (this.tag) {
    for (let d = 0, f; d < this.R.length; d++) {
      f = this.R[d];
      var b = void 0;
      this.index.set(f, b = new O({}, this.reg));
      c === this.field && (c = c.slice(0));
      c.push(f);
      b.tag = this.tag.get(f);
    }
  }
  b = [];
  const e = {db:a.db, type:a.type, fastupdate:a.fastupdate};
  for (let d = 0, f, g; d < c.length; d++) {
    e.field = g = c[d];
    f = this.index.get(g);
    const h = new a.constructor(a.id, e);
    h.id = a.id;
    b[d] = h.mount(f);
    f.document = !0;
    d ? f.bypass = !0 : f.store = this.store;
  }
  this.db = !0;
  return Promise.all(b);
};
t.commit = async function(a, c) {
  const b = [];
  for (const e of this.index.values()) {
    b.push(e.commit(e, a, c));
  }
  await Promise.all(b);
  this.reg.clear();
};
t.destroy = function() {
  const a = [];
  for (const c of this.index.values()) {
    a.push(c.destroy());
  }
  return Promise.all(a);
};
function Ua(a, c) {
  const b = new Map();
  let e = c.index || c.field || c;
  E(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d];
    E(f) || (g = f, f = f.field);
    g = I(g) ? Object.assign({}, a, g) : a;
    if (this.worker) {
      const h = new Q(g);
      b.set(f, h);
    }
    this.worker || b.set(f, new O(g, this.reg));
    g.custom ? this.D[d] = g.custom : (this.D[d] = Ta(f, this.J), g.filter && ("string" === typeof this.D[d] && (this.D[d] = new String(this.D[d])), this.D[d].I = g.filter));
    this.field[d] = f;
  }
  if (this.C) {
    a = c.store;
    E(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.custom ? (this.C[d] = f.custom, f.custom.V = g) : (this.C[d] = Ta(g, this.J), f.filter && ("string" === typeof this.C[d] && (this.C[d] = new String(this.C[d])), this.C[d].I = f.filter));
    }
  }
  return b;
}
function Ta(a, c) {
  const b = a.split(":");
  let e = 0;
  for (let d = 0; d < b.length; d++) {
    a = b[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (c[e] = !0), a && (b[e++] = a);
  }
  e < b.length && (b.length = e);
  return 1 < e ? b : b[0];
}
t.append = function(a, c) {
  return this.add(a, c, !0);
};
t.update = function(a, c) {
  return this.remove(a).add(a, c);
};
t.remove = function(a) {
  I(a) && (a = ba(a, this.key));
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
t.clear = function() {
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
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(c) {
    return c[0] && c[0].doc;
  }) : this.store.get(a);
};
t.set = function(a, c) {
  this.store.set(a, c);
  return this;
};
t.searchCache = Va;
t.export = function(a, c, b = 0, e = 0) {
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
      f = wa(this.reg);
      c = null;
      break;
    case 1:
      d = "tag";
      f = this.tag && ua(this.tag, this.reg.size);
      c = null;
      break;
    case 2:
      d = "doc";
      f = this.store && sa(this.store);
      c = null;
      break;
    default:
      return;
  }
  return ya.call(this, a, c, d, f, b, e);
};
t.import = function(a, c) {
  var b = a.split(".");
  "json" === b[b.length - 1] && b.pop();
  const e = 2 < b.length ? b[0] : "";
  b = 2 < b.length ? b[2] : b[1];
  if (this.worker && e) {
    return this.index.get(e).import(a);
  }
  if (c) {
    "string" === typeof c && (c = JSON.parse(c));
    if (e) {
      return this.index.get(e).import(b, c);
    }
    switch(b) {
      case "reg":
        this.fastupdate = !1;
        this.reg = xa(c, this.reg);
        for (let d = 0, f; d < this.field.length; d++) {
          f = this.index.get(this.field[d]), f.fastupdate = !1, f.reg = this.reg;
        }
        if (this.worker) {
          c = [];
          for (const d of this.index.values()) {
            c.push(d.import(a));
          }
          return Promise.all(c);
        }
        break;
      case "tag":
        this.tag = va(c, this.tag);
        break;
      case "doc":
        this.store = ta(c, this.store);
    }
  }
};
la(V.prototype);
function Va(a, c, b) {
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
const Wa = {normalize:function(a) {
  return a.toLowerCase();
}};
const Xa = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const Ya = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Za = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const $a = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const ab = /[\x00-\x7F]+/g;
const bb = /[\x00-\x7F]+/g;
const cb = /[\x00-\x7F]+/g;
var db = {LatinExact:{split:/\s+/, normalize:!1}, LatinDefault:Wa, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:Xa}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:Xa, matcher:Ya, replacer:Za}, LatinExtra:{normalize:!0, dedupe:!0, mapper:Xa, replacer:Za.concat([/(?!^)[aeo]/g, ""]), matcher:Ya}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let e = c.charAt(0), d = $a[e];
    for (let f = 1, g; f < c.length && (g = c.charAt(f), "h" === g || "w" === g || !(g = $a[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[b] = e;
  }
}}, ArabicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(ab, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(bb, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(cb, " ");
}}};
const eb = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
O.prototype.add = function(a, c, b, e) {
  if (c && (a || 0 === a)) {
    if (!e && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (e = c.length) {
      const l = B(), m = B(), n = this.depth, q = this.resolution;
      for (let r = 0; r < e; r++) {
        let p = c[this.rtl ? e - 1 - r : r];
        var d = p.length;
        if (d && (n || !m[p])) {
          var f = this.score ? this.score(c, p, r, null, 0) : fb(q, e, r), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (let v = 0, u; v < d; v++) {
                  for (f = d; f > v; f--) {
                    g = p.substring(v, f);
                    u = this.rtl ? d - 1 - v : v;
                    var h = this.score ? this.score(c, p, r, g, u) : fb(q, e, r, d, u);
                    gb(this, m, g, h, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < d) {
                for (h = d - 1; 0 < h; h--) {
                  g = p[this.rtl ? d - 1 - h : h] + g;
                  var k = this.score ? this.score(c, p, r, g, h) : fb(q, e, r, d, h);
                  gb(this, m, g, k, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (h = 0; h < d; h++) {
                  g += p[this.rtl ? d - 1 - h : h], gb(this, m, g, f, a, b);
                }
                break;
              }
            default:
              if (gb(this, m, p, f, a, b), n && 1 < e && r < e - 1) {
                for (d = B(), g = this.U, f = p, h = Math.min(n + 1, this.rtl ? r + 1 : e - r), d[f] = 1, k = 1; k < h; k++) {
                  if ((p = c[this.rtl ? e - 1 - r - k : r + k]) && !d[p]) {
                    d[p] = 1;
                    const v = this.score ? this.score(c, f, r, p, k - 1) : fb(g + (e / 2 > g ? 0 : 1), e, r, h - 1, k - 1), u = this.bidirectional && p > f;
                    gb(this, l, u ? f : p, v, a, b, u ? p : f);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || this.reg.add(a);
    } else {
      c = "";
    }
  }
  this.db && (c || this.commit_task.push({del:a}), this.T && hb(this));
  return this;
};
function gb(a, c, b, e, d, f, g) {
  let h = g ? a.ctx : a.map, k;
  if (!c[b] || g && !(k = c[b])[g]) {
    if (g ? (c = k || (c[b] = B()), c[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = k = []), h = h[e] || (h[e] = []), !f || !h.includes(d)) {
      if (h.length === 2 ** 31 - 1) {
        c = new S(h);
        if (a.fastupdate) {
          for (let l of a.reg.values()) {
            l.includes(h) && (l[l.indexOf(h)] = c);
          }
        }
        k[e] = h = c;
      }
      h.push(d);
      a.fastupdate && ((e = a.reg.get(d)) ? e.push(h) : a.reg.set(d, [h]));
    }
  }
}
function fb(a, c, b, e, d) {
  return b && 1 < a ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;O.prototype.search = function(a, c, b) {
  b || (!c && I(a) ? (b = a, a = "") : I(c) && (b = c, c = 0));
  let e = [], d, f, g, h = 0, k, l, m, n, q;
  b ? (a = b.query || a, c = b.limit || c, h = b.offset || 0, f = b.context, g = b.suggest, q = (k = !1 !== b.resolve) && b.enrich, m = b.boost, n = b.resolution, l = this.db && b.tag) : k = this.resolve;
  let r = this.encoder.encode(a);
  d = r.length;
  c = c || (k ? 100 : 0);
  if (1 === d) {
    return ib.call(this, r[0], "", c, h, k, q, l);
  }
  f = this.depth && !1 !== f;
  if (2 === d && f && !g) {
    return ib.call(this, r[0], r[1], c, h, k, q, l);
  }
  let p = B(), v = 0, u;
  1 < d && f && (u = r[0], v = 1);
  n || 0 === n || (n = u ? this.U : this.resolution);
  if (this.db) {
    if (this.db.search && (a = this.db.search(this, r, c, h, g, k, q, l), !1 !== a)) {
      return a;
    }
    const x = this;
    return async function() {
      for (let y, F; v < d; v++) {
        if ((F = r[v]) && !p[F]) {
          p[F] = 1;
          y = await jb(x, F, u, 0, 0, !1, !1);
          if (y = kb(y, e, g, n)) {
            e = y;
            break;
          }
          u && (g && y && e.length || (u = F));
        }
        g && u && v === d - 1 && !e.length && (n = x.resolution, u = "", v = -1, p = B());
      }
      return lb(e, n, c, h, g, m, k);
    }();
  }
  for (let x, y; v < d; v++) {
    if ((y = r[v]) && !p[y]) {
      p[y] = 1;
      x = jb(this, y, u, 0, 0, !1, !1);
      if (x = kb(x, e, g, n)) {
        e = x;
        break;
      }
      u && (g && x && e.length || (u = y));
    }
    g && u && v === d - 1 && !e.length && (n = this.resolution, u = "", v = -1, p = B());
  }
  return lb(e, n, c, h, g, m, k);
};
function lb(a, c, b, e, d, f, g) {
  let h = a.length, k = a;
  if (1 < h) {
    k = Fa(a, c, b, e, d, f, g);
  } else if (1 === h) {
    return g ? Ia.call(null, a[0], b, e) : new X(a[0]);
  }
  return g ? k : new X(k);
}
function ib(a, c, b, e, d, f, g) {
  a = jb(this, a, c, b, e, d, f, g);
  return this.db ? a.then(function(h) {
    return d ? h || [] : new X(h);
  }) : a && a.length ? d ? Ia.call(this, a, b, e) : new X(a) : d ? [] : new X();
}
function kb(a, c, b, e) {
  let d = [];
  if (a && a.length) {
    if (a.length <= e) {
      c.push(a);
      return;
    }
    for (let f = 0, g; f < e; f++) {
      if (g = a[f]) {
        d[f] = g;
      }
    }
    if (d.length) {
      c.push(d);
      return;
    }
  }
  if (!b) {
    return d;
  }
}
function jb(a, c, b, e, d, f, g, h) {
  let k;
  b && (k = a.bidirectional && c > b) && (k = b, b = c, c = k);
  if (a.db) {
    return a.db.get(c, b, e, d, f, g, h);
  }
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
      mb(this.map, a), this.depth && mb(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.T && hb(this));
  this.cache && this.cache.remove(a);
  return this;
};
function mb(a, c) {
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
      const d = e[0], f = mb(e[1], c);
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
    var b = E(a) ? a : a.preset;
    b && (eb[b] || console.warn("Preset not found: " + b), a = Object.assign({}, eb[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const e = !0 === b ? {depth:1} : b || {}, d = E(a.encoder) ? db[a.encoder] : a.encode || a.encoder || Wa;
  this.encoder = d.encode ? d : "object" === typeof d ? new J(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && "default" !== b && b || "strict";
  this.depth = "strict" === b && e.depth || 0;
  this.bidirectional = !1 !== e.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (b = a.keystore || 0) && (this.keystore = b);
  this.map = b ? new T(b) : new Map();
  this.ctx = b ? new T(b) : new Map();
  this.reg = c || (this.fastupdate ? b ? new T(b) : new Map() : b ? new U(b) : new Set());
  this.U = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (b = a.cache || null) && new Y(b);
  this.resolve = !1 !== a.resolve;
  if (b = a.db) {
    this.db = this.mount(b);
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
t.commit = function(a, c) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.commit(this, a, c);
};
t.destroy = function() {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.destroy();
};
function hb(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a, void 0, void 0);
  }, 1));
}
t.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  this.db && (this.commit_timer && clearTimeout(this.commit_timer), this.commit_timer = null, this.commit_task = [{clear:!0}]);
  return this;
};
t.append = function(a, c) {
  return this.add(a, c, !0);
};
t.contain = function(a) {
  return this.db ? this.db.has(a) : this.reg.has(a);
};
t.update = function(a, c) {
  const b = this, e = this.remove(a);
  return e && e.then ? e.then(() => b.add(a, c)) : this.add(a, c);
};
function nb(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, e; b < a.length; b++) {
      (e = a[b]) && (c += e.length);
    }
  } else {
    for (const b of a.entries()) {
      const e = b[0], d = nb(b[1]);
      d ? c += d : a.delete(e);
    }
  }
  return c;
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
t.export = function(a, c, b = 0, e = 0) {
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = wa(this.reg);
      break;
    case 1:
      d = "cfg";
      f = null;
      break;
    case 2:
      d = "map";
      f = sa(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      f = ua(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return ya.call(this, a, c, d, f, b, e);
};
t.import = function(a, c) {
  if (c) {
    switch("string" === typeof c && (c = JSON.parse(c)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = xa(c, this.reg);
        break;
      case "map":
        this.map = ta(c, this.map);
        break;
      case "ctx":
        this.ctx = va(c, this.ctx);
    }
  }
};
t.serialize = function(a = !0) {
  let c = "", b = "", e = "";
  if (this.reg.size) {
    let f;
    for (var d of this.reg.keys()) {
      f || (f = typeof d), c += (c ? "," : "") + ("string" === f ? '"' + d + '"' : d);
    }
    c = "index.reg=new Set([" + c + "]);";
    b = za(this.map, f);
    b = "index.map=new Map([" + b + "]);";
    for (const g of this.ctx.entries()) {
      d = g[0];
      let h = za(g[1], f);
      h = "new Map([" + h + "])";
      h = '["' + d + '",' + h + "]";
      e += (e ? "," : "") + h;
    }
    e = "index.ctx=new Map([" + e + "]);";
  }
  return a ? "function inject(index){" + c + b + e + "}" : c + b + e;
};
la(O.prototype);
const pb = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), qb = ["map", "ctx", "tag", "reg", "cfg"];
function rb(a, c = {}) {
  if (!this) {
    return new rb(a, c);
  }
  "object" === typeof a && (c = a, a = a.name);
  a || console.info("Default storage space was used, because a name was not passed.");
  this.id = "flexsearch" + (a ? ":" + a.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "");
  this.field = c.field ? c.field.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "";
  this.type = c.type;
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
  return this.db || new Promise(function(c, b) {
    const e = pb.open(a.id + (a.field ? ":" + a.field : ""), 1);
    e.onupgradeneeded = function() {
      const d = a.db = this.result;
      qb.forEach(f => {
        d.objectStoreNames.contains(f) || d.createObjectStore(f);
      });
    };
    e.onblocked = function(d) {
      console.error("blocked", d);
      b();
    };
    e.onerror = function(d) {
      console.error(this.error, d);
      b();
    };
    e.onsuccess = function() {
      a.db = this.result;
      a.db.onversionchange = function() {
        a.close();
      };
      c(a);
    };
  });
};
t.close = function() {
  this.db && this.db.close();
  this.db = null;
};
t.destroy = function() {
  const a = pb.deleteDatabase(this.id + (this.field ? ":" + this.field : ""));
  return Z(a);
};
t.clear = function() {
  const a = this.db.transaction(qb, "readwrite");
  for (let c = 0; c < qb.length; c++) {
    a.objectStore(qb[c]).clear();
  }
  return Z(a);
};
t.get = function(a, c, b = 0, e = 0, d = !0, f = !1) {
  a = this.db.transaction(c ? "ctx" : "map", "readonly").objectStore(c ? "ctx" : "map").get(c ? c + ":" + a : a);
  const g = this;
  return Z(a).then(function(h) {
    let k = [];
    if (!h || !h.length) {
      return k;
    }
    if (d) {
      if (!b && !e && 1 === h.length) {
        return h[0];
      }
      for (let l = 0, m; l < h.length; l++) {
        if ((m = h[l]) && m.length) {
          if (e >= m.length) {
            e -= m.length;
            continue;
          }
          const n = b ? e + Math.min(m.length - e, b) : m.length;
          for (let q = e; q < n; q++) {
            k.push(m[q]);
          }
          e = 0;
          if (k.length === b) {
            break;
          }
        }
      }
      return f ? g.enrich(k) : k;
    }
    return h;
  });
};
t.tag = function(a, c = 0, b = 0, e = !1) {
  a = this.db.transaction("tag", "readonly").objectStore("tag").get(a);
  const d = this;
  return Z(a).then(function(f) {
    if (!f || !f.length || b >= f.length) {
      return [];
    }
    if (!c && !b) {
      return f;
    }
    f = f.slice(b, b + c);
    return e ? d.enrich(f) : f;
  });
};
t.enrich = function(a) {
  "object" !== typeof a && (a = [a]);
  const c = this.db.transaction("reg", "readonly").objectStore("reg"), b = [];
  for (let e = 0; e < a.length; e++) {
    b[e] = Z(c.get(a[e]));
  }
  return Promise.all(b).then(function(e) {
    for (let d = 0; d < e.length; d++) {
      e[d] = {id:a[d], doc:e[d] ? JSON.parse(e[d]) : null};
    }
    return e;
  });
};
t.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return Z(a).then(function(c) {
    return !!c;
  });
};
t.search = null;
t.info = function() {
};
t.transaction = function(a, c, b) {
  let e = this.h[a + ":" + c];
  if (e) {
    return b.call(this, e);
  }
  let d = this.db.transaction(a, c);
  this.h[a + ":" + c] = e = d.objectStore(a);
  return new Promise((f, g) => {
    d.onerror = k => {
      d.abort();
      d = e = null;
      g(k);
    };
    d.oncomplete = k => {
      d = e = null;
      f(k || !0);
    };
    const h = b.call(this, e);
    this.h[a + ":" + c] = null;
    return h;
  });
};
t.commit = async function(a, c, b) {
  if (c) {
    await this.clear(), a.commit_task = [];
  } else {
    let e = a.commit_task;
    a.commit_task = [];
    for (let d = 0, f; d < e.length; d++) {
      if (f = e[d], f.clear) {
        await this.clear();
        c = !0;
        break;
      } else {
        e[d] = f.W;
      }
    }
    c || (b || (e = e.concat(aa(a.reg))), e.length && await this.remove(e));
  }
  a.reg.size && (await this.transaction("map", "readwrite", function(e) {
    for (const d of a.map) {
      const f = d[0], g = d[1];
      g.length && (c ? e.put(g, f) : e.get(f).onsuccess = function() {
        let h = this.result;
        var k;
        if (h && h.length) {
          const l = Math.max(h.length, g.length);
          for (let m = 0, n, q; m < l; m++) {
            if ((q = g[m]) && q.length) {
              if ((n = h[m]) && n.length) {
                for (k = 0; k < q.length; k++) {
                  n.push(q[k]);
                }
              } else {
                h[m] = q;
              }
              k = 1;
            }
          }
        } else {
          h = g, k = 1;
        }
        k && e.put(h, f);
      });
    }
  }), await this.transaction("ctx", "readwrite", function(e) {
    for (const d of a.ctx) {
      const f = d[0], g = d[1];
      for (const h of g) {
        const k = h[0], l = h[1];
        l.length && (c ? e.put(l, f + ":" + k) : e.get(f + ":" + k).onsuccess = function() {
          let m = this.result;
          var n;
          if (m && m.length) {
            const q = Math.max(m.length, l.length);
            for (let r = 0, p, v; r < q; r++) {
              if ((v = l[r]) && v.length) {
                if ((p = m[r]) && p.length) {
                  for (n = 0; n < v.length; n++) {
                    p.push(v[n]);
                  }
                } else {
                  m[r] = v;
                }
                n = 1;
              }
            }
          } else {
            m = l, n = 1;
          }
          n && e.put(m, f + ":" + k);
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
        let h = this.result;
        h = h && h.length ? h.concat(g) : g;
        e.put(h, f);
      });
    }
  }), a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear());
};
function sb(a, c, b) {
  const e = a.value;
  let d, f, g = 0;
  for (let h = 0, k; h < e.length; h++) {
    if (k = b ? e : e[h]) {
      for (let l = 0, m, n; l < c.length; l++) {
        if (n = c[l], m = k.indexOf(f ? parseInt(n, 10) : n), 0 > m && !f && "string" === typeof n && !isNaN(n) && (m = k.indexOf(parseInt(n, 10))) && (f = 1), 0 <= m) {
          if (d = 1, 1 < k.length) {
            k.splice(m, 1);
          } else {
            e[h] = [];
            break;
          }
        }
      }
      g += k.length;
    }
    if (b) {
      break;
    }
  }
  g ? d && a.update(e) : a.delete();
  a.continue();
}
t.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(c) {
    c.openCursor().onsuccess = function() {
      const b = this.result;
      b && sb(b, a);
    };
  }), this.transaction("ctx", "readwrite", function(c) {
    c.openCursor().onsuccess = function() {
      const b = this.result;
      b && sb(b, a);
    };
  }), this.transaction("tag", "readwrite", function(c) {
    c.openCursor().onsuccess = function() {
      const b = this.result;
      b && sb(b, a, !0);
    };
  }), this.transaction("reg", "readwrite", function(c) {
    for (let b = 0; b < a.length; b++) {
      c.delete(a[b]);
    }
  })]);
};
function Z(a) {
  return new Promise((c, b) => {
    a.onsuccess = function() {
      c(this.result);
    };
    a.oncomplete = function() {
      c(this.result);
    };
    a.onerror = b;
    a = null;
  });
}
;export default {Index:O, Charset:db, Encoder:J, Document:V, Worker:Q, Resolver:X, IndexedDB:rb, Language:{}};

export const Index=O;export const  Charset=db;export const  Encoder=J;export const  Document=V;export const  Worker=Q;export const  Resolver=X;export const  IndexedDB=rb;export const  Language={};