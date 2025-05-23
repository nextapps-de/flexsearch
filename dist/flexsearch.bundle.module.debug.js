/**!
 * FlexSearch.js v0.8.202 (Bundle/Module/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var w;
function H(a, b, c) {
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
function aa(a, b) {
  return "undefined" === typeof a ? b : a;
}
function I() {
  return Object.create(null);
}
function N(a) {
  return "string" === typeof a;
}
function ba(a) {
  return "object" === typeof a;
}
function ca(a) {
  const b = [];
  for (const c of a.keys()) {
    b.push(c);
  }
  return b;
}
function da(a, b) {
  if (N(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
;const fa = /[^\p{L}\p{N}]+/u, ha = /(\d{3})/g, ia = /(\D)(\d{3})/g, ja = /(\d{3})(\D)/g, ka = /[\u0300-\u036f]/g;
function la(a = {}) {
  if (!this || this.constructor !== la) {
    return new la(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
w = la.prototype;
w.assign = function(a) {
  this.normalize = H(a.normalize, !0, this.normalize);
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
    this.numeric = H(a.numeric, e);
  } else {
    try {
      this.split = H(this.split, fa);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = H(a.numeric, H(this.numeric, !0));
  }
  this.prepare = H(a.prepare, null, this.prepare);
  this.finalize = H(a.finalize, null, this.finalize);
  c = a.filter;
  this.filter = "function" === typeof c ? c : H(c && new Set(c), null, this.filter);
  this.dedupe = H(a.dedupe, !0, this.dedupe);
  this.matcher = H((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = H((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = H((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = H(a.replacer, null, this.replacer);
  this.minlength = H(a.minlength, 1, this.minlength);
  this.maxlength = H(a.maxlength, 1024, this.maxlength);
  this.rtl = H(a.rtl, !1, this.rtl);
  if (this.cache = c = H(a.cache, !0, this.cache)) {
    this.I = null, this.R = "number" === typeof c ? c : 2e5, this.C = new Map(), this.H = new Map(), this.M = this.L = 128;
  }
  this.h = "";
  this.N = null;
  this.B = "";
  this.O = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.h += (this.h ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.B += (this.B ? "|" : "") + d;
    }
  }
  return this;
};
w.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.B += (this.B ? "|" : "") + a;
  this.O = null;
  this.cache && Q(this);
  return this;
};
w.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && Q(this);
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
  this.cache && Q(this);
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
  this.N = null;
  this.cache && Q(this);
  return this;
};
w.addReplacer = function(a, b) {
  if ("string" === typeof a) {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && Q(this);
  return this;
};
w.encode = function(a, b) {
  if (this.cache && a.length <= this.L) {
    if (this.I) {
      if (this.C.has(a)) {
        return this.C.get(a);
      }
    } else {
      this.I = setTimeout(Q, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = ka ? a.normalize("NFKD").replace(ka, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ia, "$1 $2").replace(ja, "$1 $2").replace(ha, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let e = [], d = I(), f, g, k = this.split || "" === this.split ? a.split(this.split) : [a];
  for (let l = 0, m, r; l < k.length; l++) {
    if ((m = r = k[l]) && !(m.length < this.minlength || m.length > this.maxlength)) {
      if (b) {
        if (d[m]) {
          continue;
        }
        d[m] = 1;
      } else {
        if (f === m) {
          continue;
        }
        f = m;
      }
      if (c) {
        e.push(m);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(m) : !this.filter.has(m))) {
          if (this.cache && m.length <= this.M) {
            if (this.I) {
              var h = this.H.get(m);
              if (h || "" === h) {
                h && e.push(h);
                continue;
              }
            } else {
              this.I = setTimeout(Q, 50, this);
            }
          }
          if (this.stemmer) {
            this.O || (this.O = new RegExp("(?!^)(" + this.B + ")$"));
            let t;
            for (; t !== m && 2 < m.length;) {
              t = m, m = m.replace(this.O, q => this.stemmer.get(q));
            }
          }
          if (m && (this.mapper || this.dedupe && 1 < m.length)) {
            h = "";
            for (let t = 0, q = "", u, n; t < m.length; t++) {
              u = m.charAt(t), u === q && this.dedupe || ((n = this.mapper && this.mapper.get(u)) || "" === n ? n === q && this.dedupe || !(q = n) || (h += n) : h += q = u);
            }
            m = h;
          }
          this.matcher && 1 < m.length && (this.N || (this.N = new RegExp("(" + this.h + ")", "g")), m = m.replace(this.N, t => this.matcher.get(t)));
          if (m && this.replacer) {
            for (h = 0; m && h < this.replacer.length; h += 2) {
              m = m.replace(this.replacer[h], this.replacer[h + 1]);
            }
          }
          this.cache && r.length <= this.M && (this.H.set(r, m), this.H.size > this.R && (this.H.clear(), this.M = this.M / 1.1 | 0));
          if (m) {
            if (m !== r) {
              if (b) {
                if (d[m]) {
                  continue;
                }
                d[m] = 1;
              } else {
                if (g === m) {
                  continue;
                }
                g = m;
              }
            }
            e.push(m);
          }
        }
      }
    }
  }
  this.finalize && (e = this.finalize(e) || e);
  this.cache && a.length <= this.L && (this.C.set(a, e), this.C.size > this.R && (this.C.clear(), this.L = this.L / 1.1 | 0));
  return e;
};
function Q(a) {
  a.I = null;
  a.C.clear();
  a.H.clear();
}
;function ma(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : c = a);
  c && (a = c.query || a, b = c.limit || b);
  let e = "" + (b || 0);
  c && (e += (c.offset || 0) + !!c.context + !!c.suggest + (!1 !== c.resolve) + (c.resolution || this.resolution) + (c.boost || 0));
  a = ("" + a).toLowerCase();
  this.cache || (this.cache = new na());
  let d = this.cache.get(a + e);
  if (!d) {
    const f = c && c.cache;
    f && (c.cache = !1);
    d = this.search(a, b, c);
    f && (c.cache = f);
    this.cache.set(a + e, d);
  }
  return d;
}
function na(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
na.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
na.prototype.get = function(a) {
  const b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
na.prototype.remove = function(a) {
  for (const b of this.cache) {
    const c = b[0];
    b[1].includes(a) && this.cache.delete(c);
  }
};
na.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const qa = {normalize:!1, numeric:!1, dedupe:!1};
const ra = {};
const sa = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const ta = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), ua = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const va = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var wa = {Exact:qa, Default:ra, Normalize:ra, LatinBalance:{mapper:sa}, LatinAdvanced:{mapper:sa, matcher:ta, replacer:ua}, LatinExtra:{mapper:sa, replacer:ua.concat([/(?!^)[aeo]/g, ""]), matcher:ta}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let e = b.charAt(0), d = va[e];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = va[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[c] = e;
  }
}}, CJK:{split:""}, LatinExact:qa, LatinDefault:ra, LatinSimple:ra};
function xa(a, b, c, e) {
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
function Aa(a) {
  if (!this || this.constructor !== Aa) {
    return new Aa(a);
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
        return xa(b, d || 0, f || b.length, !1);
      };
    }
    if ("splice" === e) {
      return function(d, f) {
        return xa(b, d || 0, f || b.length, !0);
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
Aa.prototype.clear = function() {
  this.index.length = 0;
};
Aa.prototype.destroy = function() {
  this.proxy = this.index = null;
};
Aa.prototype.push = function() {
};
function R(a = 8) {
  if (!this || this.constructor !== R) {
    return new R(a);
  }
  this.index = I();
  this.h = [];
  this.size = 0;
  32 < a ? (this.C = Ba, this.B = BigInt(a)) : (this.C = Ca, this.B = a);
}
R.prototype.get = function(a) {
  const b = this.index[this.C(a)];
  return b && b.get(a);
};
R.prototype.set = function(a, b) {
  var c = this.C(a);
  let e = this.index[c];
  e ? (c = e.size, e.set(a, b), (c -= e.size) && this.size++) : (this.index[c] = e = new Map([[a, b]]), this.h.push(e), this.size++);
};
function S(a = 8) {
  if (!this || this.constructor !== S) {
    return new S(a);
  }
  this.index = I();
  this.h = [];
  this.size = 0;
  32 < a ? (this.C = Ba, this.B = BigInt(a)) : (this.C = Ca, this.B = a);
}
S.prototype.add = function(a) {
  var b = this.C(a);
  let c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c), this.size++);
};
w = R.prototype;
w.has = S.prototype.has = function(a) {
  const b = this.index[this.C(a)];
  return b && b.has(a);
};
w.delete = S.prototype.delete = function(a) {
  const b = this.index[this.C(a)];
  b && b.delete(a) && this.size--;
};
w.clear = S.prototype.clear = function() {
  this.index = I();
  this.h = [];
  this.size = 0;
};
w.values = S.prototype.values = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].values()) {
      yield b;
    }
  }
};
w.keys = S.prototype.keys = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].keys()) {
      yield b;
    }
  }
};
w.entries = S.prototype.entries = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].entries()) {
      yield b;
    }
  }
};
function Ca(a) {
  let b = 2 ** this.B - 1;
  if ("number" == typeof a) {
    return a & b;
  }
  let c = 0, e = this.B + 1;
  for (let d = 0; d < a.length; d++) {
    c = (c * e ^ a.charCodeAt(d)) & b;
  }
  return 32 === this.B ? c + 2 ** 31 : c;
}
function Ba(a) {
  let b = BigInt(2) ** this.B - BigInt(1);
  var c = typeof a;
  if ("bigint" === c) {
    return a & b;
  }
  if ("number" === c) {
    return BigInt(a) & b;
  }
  c = BigInt(0);
  let e = this.B + BigInt(1);
  for (let d = 0; d < a.length; d++) {
    c = (c * e ^ BigInt(a.charCodeAt(d))) & b;
  }
  return c;
}
;let Da, T;
async function Ea(a) {
  a = a.data;
  var b = a.task;
  const c = a.id;
  let e = a.args;
  switch(b) {
    case "init":
      T = a.options || {};
      (b = a.factory) ? (Function("return " + b)()(self), Da = new self.FlexSearch.Index(T), delete self.FlexSearch) : Da = new V(T);
      postMessage({id:c});
      break;
    default:
      let d;
      if ("export" === b) {
        if (!T.export || "function" !== typeof T.export) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
        }
        e[1] ? (e[0] = T.export, e[2] = 0, e[3] = 1) : e = null;
      }
      if ("import" === b) {
        if (!T.import || "function" !== typeof T.import) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
        }
        e[0] && (a = await T.import.call(Da, e[0]), Da.import(e[0], a));
      } else {
        (d = e && Da[b].apply(Da, e)) && d.then && (d = await d), d && d.await && (d = await d.await), "search" === b && d.result && (d = d.result);
      }
      postMessage("search" === b ? {id:c, msg:d} : {id:c});
  }
}
;function Fa(a) {
  Ga.call(a, "add");
  Ga.call(a, "append");
  Ga.call(a, "search");
  Ga.call(a, "update");
  Ga.call(a, "remove");
  Ga.call(a, "searchCache");
}
let Ha, Ia, Ja;
function Ka() {
  Ha = Ja = 0;
}
function Ga(a) {
  this[a + "Async"] = function() {
    const b = arguments;
    var c = b[b.length - 1];
    let e;
    "function" === typeof c && (e = c, delete b[b.length - 1]);
    Ha ? Ja || (Ja = Date.now() - Ia >= this.priority * this.priority * 3) : (Ha = setTimeout(Ka, 0), Ia = Date.now());
    if (Ja) {
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
;let W = 0;
function La(a = {}, b) {
  function c(k) {
    function h(l) {
      l = l.data || l;
      const m = l.id, r = m && f.h[m];
      r && (r(l.msg), delete f.h[m]);
    }
    this.worker = k;
    this.h = I();
    if (this.worker) {
      d ? this.worker.on("message", h) : this.worker.onmessage = h;
      if (a.config) {
        return new Promise(function(l) {
          1e9 < W && (W = 0);
          f.h[++W] = function() {
            l(f);
          };
          f.worker.postMessage({id:W, task:"init", factory:e, options:a});
        });
      }
      this.priority = a.priority || 4;
      this.encoder = b || null;
      this.worker.postMessage({task:"init", factory:e, options:a});
      return this;
    }
    console.warn("Worker is not available on this platform. Please report on Github: https://github.com/nextapps-de/flexsearch/issues");
  }
  if (!this || this.constructor !== La) {
    return new La(a);
  }
  let e = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  e && (e = e.toString());
  const d = "undefined" === typeof window, f = this, g = Ma(e, d, a.worker);
  return g.then ? g.then(function(k) {
    return c.call(f, k);
  }) : c.call(this, g);
}
X("add");
X("append");
X("search");
X("update");
X("remove");
X("clear");
X("export");
X("import");
La.prototype.searchCache = ma;
Fa(La.prototype);
function X(a) {
  La.prototype[a] = function() {
    const b = this, c = [].slice.call(arguments);
    var e = c[c.length - 1];
    let d;
    "function" === typeof e && (d = e, c.pop());
    e = new Promise(function(f) {
      "export" === a && "function" === typeof c[0] && (c[0] = null);
      1e9 < W && (W = 0);
      b.h[++W] = f;
      b.worker.postMessage({task:a, id:W, args:c});
    });
    return d ? (e.then(d), this) : e;
  };
}
function Ma(a, b, c) {
  return b ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/worker/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"](import.meta.dirname+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + Ea.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof c ? c : import.meta.url.replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;Na.prototype.add = function(a, b, c) {
  ba(a) && (b = a, a = da(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (let k = 0, h; k < this.field.length; k++) {
      h = this.G[k];
      var e = this.index.get(this.field[k]);
      if ("function" === typeof h) {
        var d = h(b);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = h.J, !d || d(b)) {
          h.constructor === String ? h = ["" + h] : N(h) && (h = [h]), Qa(b, h, this.K, 0, e, a, h[0], c);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.F.length; e++) {
        var f = this.F[e], g = this.P[e];
        d = this.tag.get(g);
        let k = I();
        if ("function" === typeof f) {
          if (f = f(b), !f) {
            continue;
          }
        } else {
          const h = f.J;
          if (h && !h(b)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = da(b, f);
        }
        if (d && f) {
          N(f) && (f = [f]);
          for (let h = 0, l, m; h < f.length; h++) {
            if (l = f[h], !k[l] && (k[l] = 1, (g = d.get(l)) ? m = g : d.set(l, m = []), !c || !m.includes(a))) {
              if (m.length === 2 ** 31 - 1) {
                g = new Aa(m);
                if (this.fastupdate) {
                  for (let r of this.reg.values()) {
                    r.includes(m) && (r[r.indexOf(m)] = g);
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
    if (this.store && (!c || !this.store.has(a))) {
      let k;
      if (this.D) {
        k = I();
        for (let h = 0, l; h < this.D.length; h++) {
          l = this.D[h];
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
          } else if (N(l) || l.constructor === String) {
            k[l] = b[l];
            continue;
          }
          Ra(b, k, l, 0, l[0], m);
        }
      }
      this.store.set(a, k || b);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function Ra(a, b, c, e, d, f) {
  a = a[d];
  if (e === c.length - 1) {
    b[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[d] = Array(a.length), d = 0; d < a.length; d++) {
        Ra(a, b, c, e, d);
      }
    } else {
      b = b[d] || (b[d] = I()), d = c[++e], Ra(a, b, c, e, d);
    }
  }
}
function Qa(a, b, c, e, d, f, g, k) {
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
          Qa(a, b, c, e, d, f, g, k);
        }
      } else {
        g = b[++e], Qa(a, b, c, e, d, f, g, k);
      }
    }
  }
}
;function Sa(a, b, c, e) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? a.slice(c, c + b) : a, e ? Ta.call(this, a) : a;
  }
  let d = [];
  for (let f = 0, g, k; f < a.length; f++) {
    if ((g = a[f]) && (k = g.length)) {
      if (c) {
        if (c >= k) {
          c -= k;
          continue;
        }
        g = g.slice(c, c + b);
        k = g.length;
        c = 0;
      }
      k > b && (g = g.slice(0, b), k = b);
      if (!d.length && k >= b) {
        return e ? Ta.call(this, g) : g;
      }
      d.push(g);
      b -= k;
      if (!b) {
        break;
      }
    }
  }
  d = 1 < d.length ? [].concat.apply([], d) : d[0];
  return e ? Ta.call(this, d) : d;
}
;function Ua(a, b, c, e) {
  var d = e[0];
  if (d[0] && d[0].query) {
    return a[b].apply(a, d);
  }
  if (!("and" !== b && "not" !== b || a.result.length || a.await || d.suggest)) {
    return 1 < e.length && (d = e[e.length - 1]), (e = d.resolve) ? a.await || a.result : a;
  }
  let f = [], g = 0, k = 0, h, l, m, r, t;
  for (b = 0; b < e.length; b++) {
    if (d = e[b]) {
      var q = void 0;
      if (d.constructor === Y) {
        q = d.await || d.result;
      } else if (d.then || d.constructor === Array) {
        q = d;
      } else {
        g = d.limit || 0;
        k = d.offset || 0;
        m = d.suggest;
        h = ((r = (l = d.resolve) && d.highlight) || d.enrich) && l;
        q = d.queue;
        let u = d.async || q, n = d.index;
        n ? a.index || (a.index = n) : n = a.index;
        if (d.query || d.tag) {
          if (!n) {
            throw Error("Resolver can't apply because the corresponding Index was never specified");
          }
          const p = d.field || d.pluck;
          if (p) {
            d.query && (a.query = d.query, a.field = p);
            if (!n.index) {
              throw Error("Resolver can't apply because the corresponding Document Index was not specified");
            }
            n = n.index.get(p);
            if (!n) {
              throw Error("Resolver can't apply because the specified Document Field '" + p + "' was not found");
            }
          }
          if (q && (t || a.await)) {
            t = 1;
            let y;
            const v = a.A.length, D = new Promise(function(B) {
              y = B;
            });
            (function(B, G) {
              D.h = function() {
                G.index = null;
                G.resolve = !1;
                let A = u ? B.searchAsync(G) : B.search(G);
                if (A.then) {
                  return A.then(function(E) {
                    a.A[v] = E = E.result || E;
                    y(E);
                    return E;
                  });
                }
                A = A.result || A;
                y(A);
                return A;
              };
            })(n, Object.assign({}, d));
            a.A.push(D);
            f[b] = D;
            continue;
          } else {
            d.resolve = !1, d.index = null, q = u ? n.searchAsync(d) : n.search(d), d.resolve = l, d.index = n;
          }
        } else if (d.and) {
          q = Va(d, "and", n);
        } else if (d.or) {
          q = Va(d, "or", n);
        } else if (d.not) {
          q = Va(d, "not", n);
        } else if (d.xor) {
          q = Va(d, "xor", n);
        } else {
          continue;
        }
      }
      q.await ? (t = 1, q = q.await) : q.then ? (t = 1, q = q.then(function(u) {
        return u.result || u;
      })) : q = q.result || q;
      f[b] = q;
    }
  }
  t && !a.await && (a.await = new Promise(function(u) {
    a.return = u;
  }));
  if (t) {
    const u = Promise.all(f).then(function(n) {
      for (let p = 0; p < a.A.length; p++) {
        if (a.A[p] === u) {
          a.A[p] = function() {
            return c.call(a, n, g, k, h, l, m, r);
          };
          break;
        }
      }
      Wa(a);
    });
    a.A.push(u);
  } else if (a.await) {
    a.A.push(function() {
      return c.call(a, f, g, k, h, l, m, r);
    });
  } else {
    return c.call(a, f, g, k, h, l, m, r);
  }
  return l ? a.await || a.result : a;
}
function Va(a, b, c) {
  a = a[b];
  const e = a[0] || a;
  e.index || (e.index = c);
  c = new Y(e);
  1 < a.length && (c = c[b].apply(c, a.slice(1)));
  return c;
}
;Y.prototype.or = function() {
  return Ua(this, "or", Xa, arguments);
};
function Xa(a, b, c, e, d, f, g) {
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = Ya(a, b, c, !1, this.h), c = 0));
  d && (this.await = null);
  return d ? this.resolve(b, c, e, g) : this;
}
;Y.prototype.and = function() {
  return Ua(this, "and", Za, arguments);
};
function Za(a, b, c, e, d, f, g) {
  if (!f && !this.result.length) {
    return d ? this.result : this;
  }
  let k;
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      let h = 0;
      for (let l = 0, m, r; l < a.length; l++) {
        if ((m = a[l]) && (r = m.length)) {
          h < r && (h = r);
        } else if (!f) {
          h = 0;
          break;
        }
      }
      h ? (this.result = $a(a, h, b, c, f, this.h, d), k = !0) : this.result = [];
    }
  } else {
    f || (this.result = a);
  }
  d && (this.await = null);
  return d ? this.resolve(b, c, e, g, k) : this;
}
;Y.prototype.xor = function() {
  return Ua(this, "xor", ab, arguments);
};
function ab(a, b, c, e, d, f, g) {
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      a: {
        f = c;
        var k = this.h;
        const h = [], l = I();
        let m = 0;
        for (let r = 0, t; r < a.length; r++) {
          if (t = a[r]) {
            m < t.length && (m = t.length);
            for (let q = 0, u; q < t.length; q++) {
              if (u = t[q]) {
                for (let n = 0, p; n < u.length; n++) {
                  p = u[n], l[p] = l[p] ? 2 : 1;
                }
              }
            }
          }
        }
        for (let r = 0, t, q = 0; r < m; r++) {
          for (let u = 0, n; u < a.length; u++) {
            if (n = a[u]) {
              if (t = n[r]) {
                for (let p = 0, y; p < t.length; p++) {
                  if (y = t[p], 1 === l[y]) {
                    if (f) {
                      f--;
                    } else {
                      if (d) {
                        if (h.push(y), h.length === b) {
                          a = h;
                          break a;
                        }
                      } else {
                        const v = r + (u ? k : 0);
                        h[v] || (h[v] = []);
                        h[v].push(y);
                        if (++q === b) {
                          a = h;
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
        a = h;
      }
      this.result = a;
      k = !0;
    }
  } else {
    f || (this.result = a);
  }
  d && (this.await = null);
  return d ? this.resolve(b, c, e, g, k) : this;
}
;Y.prototype.not = function() {
  return Ua(this, "not", bb, arguments);
};
function bb(a, b, c, e, d, f, g) {
  if (!f && !this.result.length) {
    return d ? this.result : this;
  }
  if (a.length && this.result.length) {
    a: {
      f = c;
      var k = [];
      a = new Set(a.flat().flat());
      for (let h = 0, l, m = 0; h < this.result.length; h++) {
        if (l = this.result[h]) {
          for (let r = 0, t; r < l.length; r++) {
            if (t = l[r], !a.has(t)) {
              if (f) {
                f--;
              } else {
                if (d) {
                  if (k.push(t), k.length === b) {
                    a = k;
                    break a;
                  }
                } else {
                  if (k[h] || (k[h] = []), k[h].push(t), ++m === b) {
                    a = k;
                    break a;
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
    k = !0;
  }
  d && (this.await = null);
  return d ? this.resolve(b, c, e, g, k) : this;
}
;function cb(a, b, c, e, d) {
  let f, g, k;
  "string" === typeof d ? (f = d, d = "") : f = d.template;
  if (!f) {
    throw Error('No template pattern was specified by the search option "highlight"');
  }
  g = f.indexOf("$1");
  if (-1 === g) {
    throw Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + f);
  }
  k = f.substring(g + 2);
  g = f.substring(0, g);
  let h = d && d.boundary, l = !d || !1 !== d.clip, m = d && d.merge && k && g && new RegExp(k + " " + g, "g");
  d = d && d.ellipsis;
  var r = 0;
  if ("object" === typeof d) {
    var t = d.template;
    r = t.length - 2;
    d = d.pattern;
  }
  "string" !== typeof d && (d = !1 === d ? "" : "...");
  r && (d = t.replace("$1", d));
  t = d.length - r;
  let q, u;
  "object" === typeof h && (q = h.before, 0 === q && (q = -1), u = h.after, 0 === u && (u = -1), h = h.total || 9e5);
  r = new Map();
  for (let Oa = 0, ea, db, oa; Oa < b.length; Oa++) {
    let pa;
    if (e) {
      pa = b, oa = e;
    } else {
      var n = b[Oa];
      oa = n.field;
      if (!oa) {
        continue;
      }
      pa = n.result;
    }
    db = c.get(oa);
    ea = db.encoder;
    n = r.get(ea);
    "string" !== typeof n && (n = ea.encode(a), r.set(ea, n));
    for (let ya = 0; ya < pa.length; ya++) {
      var p = pa[ya].doc;
      if (!p) {
        continue;
      }
      p = da(p, oa);
      if (!p) {
        continue;
      }
      var y = p.trim().split(/\s+/);
      if (!y.length) {
        continue;
      }
      p = "";
      var v = [];
      let za = [];
      var D = -1, B = -1, G = 0;
      for (var A = 0; A < y.length; A++) {
        var E = y[A], z = ea.encode(E);
        z = 1 < z.length ? z.join(" ") : z[0];
        let x;
        if (z && E) {
          var C = E.length, K = (ea.split ? E.replace(ea.split, "") : E).length - z.length, F = "", L = 0;
          for (var O = 0; O < n.length; O++) {
            var P = n[O];
            if (P) {
              var M = P.length;
              M += K;
              L && M <= L || (P = z.indexOf(P), -1 < P && (F = (P ? E.substring(0, P) : "") + g + E.substring(P, P + M) + k + (P + M < C ? E.substring(P + M) : ""), L = M, x = !0));
            }
          }
          F && (h && (0 > D && (D = p.length + (p ? 1 : 0)), B = p.length + (p ? 1 : 0) + F.length, G += C, za.push(v.length), v.push({match:F})), p += (p ? " " : "") + F);
        }
        if (!x) {
          E = y[A], p += (p ? " " : "") + E, h && v.push({text:E});
        } else if (h && G >= h) {
          break;
        }
      }
      G = za.length * (f.length - 2);
      if (q || u || h && p.length - G > h) {
        if (G = h + G - 2 * t, A = B - D, 0 < q && (A += q), 0 < u && (A += u), A <= G) {
          y = q ? D - (0 < q ? q : 0) : D - ((G - A) / 2 | 0), v = u ? B + (0 < u ? u : 0) : y + G, l || (0 < y && " " !== p.charAt(y) && " " !== p.charAt(y - 1) && (y = p.indexOf(" ", y), 0 > y && (y = 0)), v < p.length && " " !== p.charAt(v - 1) && " " !== p.charAt(v) && (v = p.lastIndexOf(" ", v), v < B ? v = B : ++v)), p = (y ? d : "") + p.substring(y, v) + (v < p.length ? d : "");
        } else {
          B = [];
          D = {};
          G = {};
          A = {};
          E = {};
          z = {};
          F = K = C = 0;
          for (O = L = 1;;) {
            var U = void 0;
            for (let x = 0, J; x < za.length; x++) {
              J = za[x];
              if (F) {
                if (K !== F) {
                  if (A[x + 1]) {
                    continue;
                  }
                  J += F;
                  if (D[J]) {
                    C -= t;
                    G[x + 1] = 1;
                    A[x + 1] = 1;
                    continue;
                  }
                  if (J >= v.length - 1) {
                    if (J >= v.length) {
                      A[x + 1] = 1;
                      J >= y.length && (G[x + 1] = 1);
                      continue;
                    }
                    C -= t;
                  }
                  p = v[J].text;
                  if (M = u && z[x]) {
                    if (0 < M) {
                      if (p.length > M) {
                        if (A[x + 1] = 1, l) {
                          p = p.substring(0, M);
                        } else {
                          continue;
                        }
                      }
                      (M -= p.length) || (M = -1);
                      z[x] = M;
                    } else {
                      A[x + 1] = 1;
                      continue;
                    }
                  }
                  if (C + p.length + 1 <= h) {
                    p = " " + p, B[x] += p;
                  } else if (l) {
                    U = h - C - 1, 0 < U && (p = " " + p.substring(0, U), B[x] += p), A[x + 1] = 1;
                  } else {
                    A[x + 1] = 1;
                    continue;
                  }
                } else {
                  if (A[x]) {
                    continue;
                  }
                  J -= K;
                  if (D[J]) {
                    C -= t;
                    A[x] = 1;
                    G[x] = 1;
                    continue;
                  }
                  if (0 >= J) {
                    if (0 > J) {
                      A[x] = 1;
                      G[x] = 1;
                      continue;
                    }
                    C -= t;
                  }
                  p = v[J].text;
                  if (M = q && E[x]) {
                    if (0 < M) {
                      if (p.length > M) {
                        if (A[x] = 1, l) {
                          p = p.substring(p.length - M);
                        } else {
                          continue;
                        }
                      }
                      (M -= p.length) || (M = -1);
                      E[x] = M;
                    } else {
                      A[x] = 1;
                      continue;
                    }
                  }
                  if (C + p.length + 1 <= h) {
                    p += " ", B[x] = p + B[x];
                  } else if (l) {
                    U = p.length + 1 - (h - C), 0 <= U && U < p.length && (p = p.substring(U) + " ", B[x] = p + B[x]), A[x] = 1;
                  } else {
                    A[x] = 1;
                    continue;
                  }
                }
              } else {
                p = v[J].match;
                q && (E[x] = q);
                u && (z[x] = u);
                x && C++;
                let Pa;
                J ? !x && t && (C += t) : (G[x] = 1, A[x] = 1);
                J >= y.length - 1 ? Pa = 1 : J < v.length - 1 && v[J + 1].match ? Pa = 1 : t && (C += t);
                C -= f.length - 2;
                if (!x || C + p.length <= h) {
                  B[x] = p;
                } else {
                  U = L = O = G[x] = 0;
                  break;
                }
                Pa && (G[x + 1] = 1, A[x + 1] = 1);
              }
              C += p.length;
              U = D[J] = 1;
            }
            if (U) {
              K === F ? F++ : K++;
            } else {
              K === F ? L = 0 : O = 0;
              if (!L && !O) {
                break;
              }
              L ? (K++, F = K) : F++;
            }
          }
          p = "";
          for (let x = 0, J; x < B.length; x++) {
            J = (x && G[x] ? " " : (x && !d ? " " : "") + d) + B[x], p += J;
          }
          d && !G[B.length] && (p += d);
        }
      }
      m && (p = p.replace(m, " "));
      pa[ya].highlight = p;
    }
    if (e) {
      break;
    }
  }
  return b;
}
;function Y(a, b) {
  if (!this || this.constructor !== Y) {
    return new Y(a, b);
  }
  let c = 0, e, d, f, g, k;
  if (a && a.index) {
    const h = a;
    b = h.index;
    c = h.boost || 0;
    if (d = h.query) {
      f = h.field || h.pluck;
      const l = h.resolve;
      a = h.async || h.queue;
      h.resolve = !1;
      h.index = null;
      a = a ? b.searchAsync(h) : b.search(h);
      h.resolve = l;
      h.index = b;
      a = a.result || a;
    } else {
      a = [];
    }
  }
  if (a && a.then) {
    const h = this;
    a = a.then(function(l) {
      h.A[0] = h.result = l.result || l;
      Wa(h);
    });
    e = [a];
    a = [];
    g = new Promise(function(l) {
      k = l;
    });
  }
  this.index = b || null;
  this.result = a || [];
  this.h = c;
  this.A = e || [];
  this.await = g || null;
  this.return = k || null;
  this.query = d || "";
  this.field = f || "";
}
w = Y.prototype;
w.limit = function(a) {
  if (this.await) {
    const b = this;
    this.A.push(function() {
      b.limit(a);
      return b.result;
    });
  } else {
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
  }
  return this;
};
w.offset = function(a) {
  if (this.await) {
    const b = this;
    this.A.push(function() {
      b.offset(a);
      return b.result;
    });
  } else {
    if (this.result.length) {
      const b = [];
      for (let c = 0, e; c < this.result.length; c++) {
        if (e = this.result[c]) {
          e.length <= a ? a -= e.length : (b[c] = e.slice(a), a = 0);
        }
      }
      this.result = b;
    }
  }
  return this;
};
w.boost = function(a) {
  if (this.await) {
    const b = this;
    this.A.push(function() {
      b.boost(a);
      return b.result;
    });
  } else {
    this.h += a;
  }
  return this;
};
function Wa(a, b) {
  let c = a.result;
  var e = a.await;
  a.await = null;
  for (let d = 0, f; d < a.A.length; d++) {
    if (f = a.A[d]) {
      if ("function" === typeof f) {
        c = f(), a.A[d] = c = c.result || c, d--;
      } else if (f.h) {
        c = f.h(), a.A[d] = c = c.result || c, d--;
      } else if (f.then) {
        return a.await = e;
      }
    }
  }
  e = a.return;
  a.A = [];
  a.return = null;
  b || e(c);
  return c;
}
w.resolve = function(a, b, c, e, d) {
  let f = this.await ? Wa(this, !0) : this.result;
  if (f.then) {
    const g = this;
    return f.then(function() {
      return g.resolve(a, b, c, e, d);
    });
  }
  f.length && ("object" === typeof a ? (e = a.highlight, c = !!e || a.enrich, b = a.offset, a = a.limit) : c = !!e || c, f = d ? c ? Ta.call(this.index, f) : f : Sa.call(this.index, f, a || 100, b, c));
  return this.finalize(f, e);
};
w.finalize = function(a, b) {
  if (a.then) {
    const e = this;
    return a.then(function(d) {
      return e.finalize(d, b);
    });
  }
  b && !this.query && console.warn('There was no query specified for highlighting. Please specify a query within the last resolver stage like { query: "...", resolve: true, highlight: ... }.');
  b && a.length && this.query && (a = cb(this.query, a, this.index.index, this.field, b));
  const c = this.return;
  this.index = this.result = this.A = this.await = this.return = null;
  this.query = this.field = "";
  c && c(a);
  return a;
};
function $a(a, b, c, e, d, f, g) {
  const k = a.length;
  let h = [], l, m;
  l = I();
  for (let r = 0, t, q, u, n; r < b; r++) {
    for (let p = 0; p < k; p++) {
      if (u = a[p], r < u.length && (t = u[r])) {
        for (let y = 0; y < t.length; y++) {
          q = t[y];
          (m = l[q]) ? l[q]++ : (m = 0, l[q] = 1);
          n = h[m] || (h[m] = []);
          if (!g) {
            let v = r + (p || !d ? 0 : f || 0);
            n = n[v] || (n[v] = []);
          }
          n.push(q);
          if (g && c && m === k - 1 && n.length - e === c) {
            return e ? n.slice(e) : n;
          }
        }
      }
    }
  }
  if (a = h.length) {
    if (d) {
      h = 1 < h.length ? Ya(h, c, e, g, f) : (h = h[0]) && c && h.length > c || e ? h.slice(e, c + e) : h;
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
          for (let r = 0, t; r < h.length; r++) {
            if (t = h[r]) {
              if (e && t.length > e) {
                e -= t.length;
              } else {
                if (c && t.length > c || e) {
                  t = t.slice(e, c + e), c -= t.length, e && (e -= t.length);
                }
                d.push(t);
                if (!c) {
                  break;
                }
              }
            }
          }
          h = d;
        }
      }
    }
  }
  return h;
}
function Ya(a, b, c, e, d) {
  const f = [], g = I();
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
    for (let m = h - 1, r, t = 0; 0 <= m; m--) {
      r = a[m];
      for (let q = 0; q < r.length; q++) {
        if (l = (e = r[q]) && e.length) {
          for (let u = 0; u < l; u++) {
            if (k = e[u], !g[k]) {
              if (g[k] = 1, c) {
                c--;
              } else {
                let n = (q + (m < h - 1 ? d || 0 : 0)) / (m + 1) | 0;
                (f[n] || (f[n] = [])).push(k);
                if (++t === b) {
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
function eb(a, b, c) {
  const e = I(), d = [];
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
;I();
Na.prototype.search = function(a, b, c, e) {
  c || (!b && ba(a) ? (c = a, a = "") : ba(b) && (c = b, b = 0));
  let d = [];
  var f = [];
  let g;
  let k, h, l, m, r;
  let t = 0, q = !0, u;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    g = c.pluck;
    k = c.merge;
    l = c.boost;
    r = g || c.field || (r = c.index) && (r.index ? null : r);
    var n = this.tag && c.tag;
    h = c.suggest;
    q = !1 !== c.resolve;
    m = c.cache;
    this.store && c.highlight && !q ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && c.enrich && !q && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    u = q && this.store && c.highlight;
    var p = !!u || q && this.store && c.enrich;
    b = c.limit || b;
    var y = c.offset || 0;
    b || (b = q ? 100 : 0);
    if (n && (!this.db || !e)) {
      n.constructor !== Array && (n = [n]);
      var v = [];
      for (let E = 0, z; E < n.length; E++) {
        z = n[E];
        if (N(z)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (z.field && z.tag) {
          var D = z.tag;
          if (D.constructor === Array) {
            for (var B = 0; B < D.length; B++) {
              v.push(z.field, D[B]);
            }
          } else {
            v.push(z.field, D);
          }
        } else {
          D = Object.keys(z);
          for (let C = 0, K, F; C < D.length; C++) {
            if (K = D[C], F = z[K], F.constructor === Array) {
              for (B = 0; B < F.length; B++) {
                v.push(K, F[B]);
              }
            } else {
              v.push(K, F);
            }
          }
        }
      }
      if (!v.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      n = v;
      if (!a) {
        f = [];
        if (v.length) {
          for (n = 0; n < v.length; n += 2) {
            if (this.db) {
              e = this.index.get(v[n]);
              if (!e) {
                console.warn("Tag '" + v[n] + ":" + v[n + 1] + "' will be skipped because there is no field '" + v[n] + "'.");
                continue;
              }
              f.push(e = e.db.tag(v[n + 1], b, y, p));
            } else {
              e = fb.call(this, v[n], v[n + 1], b, y, p);
            }
            d.push(q ? {field:v[n], tag:v[n + 1], result:e} : [e]);
          }
        }
        if (f.length) {
          const E = this;
          return Promise.all(f).then(function(z) {
            for (let C = 0; C < z.length; C++) {
              q ? d[C].result = z[C] : d[C] = z[C];
            }
            return q ? d : new Y(1 < d.length ? $a(d, 1, 0, 0, h, l) : d[0], E);
          });
        }
        return q ? d : new Y(1 < d.length ? $a(d, 1, 0, 0, h, l) : d[0], this);
      }
    }
    if (!q && !g) {
      if (r = r || this.field) {
        N(r) ? g = r : (r.constructor === Array && 1 === r.length && (r = r[0]), g = r.field || r.index);
      }
      if (!g) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    r && r.constructor !== Array && (r = [r]);
  }
  r || (r = this.field);
  let G;
  v = (this.worker || this.db) && !e && [];
  for (let E = 0, z, C, K; E < r.length; E++) {
    C = r[E];
    if (this.db && this.tag && !this.G[E]) {
      continue;
    }
    let F;
    N(C) || (F = C, C = F.field, a = F.query || a, b = aa(F.limit, b), y = aa(F.offset, y), h = aa(F.suggest, h), u = q && this.store && aa(F.highlight, u), p = !!u || q && this.store && aa(F.enrich, p), m = aa(F.cache, m));
    if (e) {
      z = e[E];
    } else {
      D = F || c || {};
      B = D.enrich;
      var A = this.index.get(C);
      n && (this.db && (D.tag = n, G = A.db.support_tag_search, D.field = r), !G && B && (D.enrich = !1));
      z = m ? A.searchCache(a, b, D) : A.search(a, b, D);
      B && (D.enrich = B);
      if (v) {
        v[E] = z;
        continue;
      }
    }
    K = (z = z.result || z) && z.length;
    if (n && K) {
      D = [];
      B = 0;
      if (this.db && e) {
        if (!G) {
          for (A = r.length; A < e.length; A++) {
            let L = e[A];
            if (L && L.length) {
              B++, D.push(L);
            } else if (!h) {
              return q ? d : new Y(d, this);
            }
          }
        }
      } else {
        for (let L = 0, O, P; L < n.length; L += 2) {
          O = this.tag.get(n[L]);
          if (!O) {
            if (console.warn("Tag '" + n[L] + ":" + n[L + 1] + "' will be skipped because there is no field '" + n[L] + "'."), h) {
              continue;
            } else {
              return q ? d : new Y(d, this);
            }
          }
          if (P = (O = O && O.get(n[L + 1])) && O.length) {
            B++, D.push(O);
          } else if (!h) {
            return q ? d : new Y(d, this);
          }
        }
      }
      if (B) {
        z = eb(z, D, q);
        K = z.length;
        if (!K && !h) {
          return q ? z : new Y(z, this);
        }
        B--;
      }
    }
    if (K) {
      f[t] = C, d.push(z), t++;
    } else if (1 === r.length) {
      return q ? d : new Y(d, this);
    }
  }
  if (v) {
    if (this.db && n && n.length && !G) {
      for (p = 0; p < n.length; p += 2) {
        f = this.index.get(n[p]);
        if (!f) {
          if (console.warn("Tag '" + n[p] + ":" + n[p + 1] + "' was not found because there is no field '" + n[p] + "'."), h) {
            continue;
          } else {
            return q ? d : new Y(d, this);
          }
        }
        v.push(f.db.tag(n[p + 1], b, y, !1));
      }
    }
    const E = this;
    return Promise.all(v).then(function(z) {
      c && (c.resolve = q);
      z.length && (z = E.search(a, b, c, z));
      return z;
    });
  }
  if (!t) {
    return q ? d : new Y(d, this);
  }
  if (g && (!p || !this.store)) {
    return d = d[0], q ? d : new Y(d, this);
  }
  v = [];
  for (y = 0; y < f.length; y++) {
    n = d[y];
    p && n.length && "undefined" === typeof n[0].doc && (this.db ? v.push(n = this.index.get(this.field[0]).db.enrich(n)) : n = Ta.call(this, n));
    if (g) {
      return q ? u ? cb(a, n, this.index, g, u) : n : new Y(n, this);
    }
    d[y] = {field:f[y], result:n};
  }
  if (p && this.db && v.length) {
    const E = this;
    return Promise.all(v).then(function(z) {
      for (let C = 0; C < z.length; C++) {
        d[C].result = z[C];
      }
      u && (d = cb(a, d, E.index, g, u));
      return k ? gb(d) : d;
    });
  }
  u && (d = cb(a, d, this.index, g, u));
  return k ? gb(d) : d;
};
function gb(a) {
  const b = [], c = I(), e = I();
  for (let d = 0, f, g, k, h, l, m, r; d < a.length; d++) {
    f = a[d];
    g = f.field;
    k = f.result;
    for (let t = 0; t < k.length; t++) {
      if (l = k[t], "object" !== typeof l ? l = {id:h = l} : h = l.id, (m = c[h]) ? m.push(g) : (l.field = c[h] = [g], b.push(l)), r = l.highlight) {
        m = e[h], m || (e[h] = m = {}, l.highlight = m), m[g] = r;
      }
    }
  }
  return b;
}
function fb(a, b, c, e, d) {
  a = this.tag.get(a);
  if (!a) {
    return [];
  }
  a = a.get(b);
  if (!a) {
    return [];
  }
  b = a.length - e;
  if (0 < b) {
    if (c && b > c || e) {
      a = a.slice(e, e + c);
    }
    d && (a = Ta.call(this, a));
  }
  return a;
}
function Ta(a) {
  if (!this || !this.store) {
    return a;
  }
  if (this.db) {
    return this.index.get(this.field[0]).db.enrich(a);
  }
  const b = Array(a.length);
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b[c] = {id:e, doc:this.store.get(e)};
  }
  return b;
}
;function Na(a) {
  if (!this || this.constructor !== Na) {
    return new Na(a);
  }
  const b = a.document || a.doc || a;
  let c, e;
  this.G = [];
  this.field = [];
  this.K = [];
  this.key = (c = b.key || b.id) && hb(c, this.K) || "id";
  (e = a.keystore || 0) && (this.keystore = e);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? e ? new S(e) : new Set() : e ? new R(e) : new Map();
  this.D = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (e ? new R(e) : new Map());
  this.cache = (c = a.cache || null) && new na(c);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = ib.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.F = [];
      this.P = [];
      for (let d = 0, f, g; d < c.length; d++) {
        f = c[d];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.F[d] = f.custom : (this.F[d] = hb(g, this.K), f.filter && ("string" === typeof this.F[d] && (this.F[d] = new String(this.F[d])), this.F[d].J = f.filter));
        this.P[d] = g;
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
          let l = k[1];
          l.then && (l = f[g], d.index.set(h, l), g++);
        }
        return d;
      });
    }
  } else {
    a.db && (this.fastupdate = !1, this.mount(a.db));
  }
}
w = Na.prototype;
w.mount = function(a) {
  if (this.worker) {
    throw Error("You can't use Worker-Indexes on a persistent model. That would be useless, since each of the persistent model acts like Worker-Index by default (Master/Slave).");
  }
  let b = this.field;
  if (this.tag) {
    for (let f = 0, g; f < this.P.length; f++) {
      g = this.P[f];
      var c = void 0;
      this.index.set(g, c = new V({}, this.reg));
      b === this.field && (b = b.slice(0));
      b.push(g);
      c.tag = this.tag.get(g);
    }
  }
  c = [];
  const e = {db:a.db, type:a.type, fastupdate:a.fastupdate};
  for (let f = 0, g, k; f < b.length; f++) {
    e.field = k = b[f];
    g = this.index.get(k);
    const h = new a.constructor(a.id, e);
    h.id = a.id;
    c[f] = h.mount(g);
    g.document = !0;
    f ? g.bypass = !0 : g.store = this.store;
  }
  const d = this;
  return this.db = Promise.all(c).then(function() {
    d.db = !0;
  });
};
w.commit = async function(a, b) {
  const c = [];
  for (const e of this.index.values()) {
    c.push(e.commit(a, b));
  }
  await Promise.all(c);
  this.reg.clear();
};
w.destroy = function() {
  const a = [];
  for (const b of this.index.values()) {
    a.push(b.destroy());
  }
  return Promise.all(a);
};
function ib(a, b) {
  const c = new Map();
  let e = b.index || b.field || b;
  N(e) && (e = [e]);
  for (let f = 0, g, k; f < e.length; f++) {
    g = e[f];
    N(g) || (k = g, g = g.field);
    k = ba(k) ? Object.assign({}, a, k) : a;
    if (this.worker) {
      var d = void 0;
      d = (d = k.encoder) && d.encode ? d : new la("string" === typeof d ? wa[d] : d || {});
      d = new La(k, d);
      c.set(g, d);
    }
    this.worker || c.set(g, new V(k, this.reg));
    k.custom ? this.G[f] = k.custom : (this.G[f] = hb(g, this.K), k.filter && ("string" === typeof this.G[f] && (this.G[f] = new String(this.G[f])), this.G[f].J = k.filter));
    this.field[f] = g;
  }
  if (this.D) {
    a = b.store;
    N(a) && (a = [a]);
    for (let f = 0, g, k; f < a.length; f++) {
      g = a[f], k = g.field || g, g.custom ? (this.D[f] = g.custom, g.custom.U = k) : (this.D[f] = hb(k, this.K), g.filter && ("string" === typeof this.D[f] && (this.D[f] = new String(this.D[f])), this.D[f].J = g.filter));
    }
  }
  return c;
}
function hb(a, b) {
  const c = a.split(":");
  let e = 0;
  for (let d = 0; d < c.length; d++) {
    a = c[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (b[e] = !0), a && (c[e++] = a);
  }
  e < c.length && (c.length = e);
  return 1 < e ? c : c[0];
}
w.append = function(a, b) {
  return this.add(a, b, !0);
};
w.update = function(a, b) {
  return this.remove(a).add(a, b);
};
w.remove = function(a) {
  ba(a) && (a = da(a, this.key));
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
w.clear = function() {
  const a = [];
  for (const b of this.index.values()) {
    const c = b.clear();
    c.then && a.push(c);
  }
  if (this.tag) {
    for (const b of this.tag.values()) {
      b.clear();
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
  for (const a of this.index.values()) {
    a.cleanup();
  }
  return this;
};
w.get = function(a) {
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(b) {
    return b[0] && b[0].doc || null;
  }) : this.store.get(a) || null;
};
w.set = function(a, b) {
  "object" === typeof a && (b = a, a = da(b, this.key));
  this.store.set(a, b);
  return this;
};
w.searchCache = ma;
w.export = jb;
w.import = kb;
Fa(Na.prototype);
function lb(a, b = 0) {
  let c = [], e = [];
  b && (b = 250000 / b * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === b && (c.push(e), e = []);
  }
  e.length && c.push(e);
  return c;
}
function mb(a, b) {
  b || (b = new Map());
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b.set(e[0], e[1]);
  }
  return b;
}
function nb(a, b = 0) {
  let c = [], e = [];
  b && (b = 250000 / b * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], lb(d[1])[0]]), e.length === b && (c.push(e), e = []);
  }
  e.length && c.push(e);
  return c;
}
function ob(a, b) {
  b || (b = new Map());
  for (let c = 0, e, d; c < a.length; c++) {
    e = a[c], d = b.get(e[0]), b.set(e[0], mb(e[1], d));
  }
  return b;
}
function pb(a) {
  let b = [], c = [];
  for (const e of a.keys()) {
    c.push(e), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function qb(a, b) {
  b || (b = new Set());
  for (let c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function rb(a, b, c, e, d, f, g = 0) {
  const k = e && e.constructor === Array;
  var h = k ? e.shift() : e;
  if (!h) {
    return this.export(a, b, d, f + 1);
  }
  if ((h = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(h))) && h.then) {
    const l = this;
    return h.then(function() {
      return rb.call(l, a, b, c, k ? e : null, d, f, g + 1);
    });
  }
  return rb.call(this, a, b, c, k ? e : null, d, f, g + 1);
}
function jb(a, b, c = 0, e = 0) {
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
      f = pb(this.reg);
      b = null;
      break;
    case 1:
      d = "tag";
      f = this.tag && nb(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      d = "doc";
      f = this.store && lb(this.store);
      b = null;
      break;
    default:
      return;
  }
  return rb.call(this, a, b, d, f, c, e);
}
function kb(a, b) {
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
        this.reg = qb(b, this.reg);
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
        this.tag = ob(b, this.tag);
        break;
      case "doc":
        this.store = mb(b, this.store);
    }
  }
}
function sb(a, b) {
  let c = "";
  for (const e of a.entries()) {
    a = e[0];
    const d = e[1];
    let f = "";
    for (let g = 0, k; g < d.length; g++) {
      k = d[g] || [""];
      let h = "";
      for (let l = 0; l < k.length; l++) {
        h += (h ? "," : "") + ("string" === b ? '"' + k[l] + '"' : k[l]);
      }
      h = "[" + h + "]";
      f += (f ? "," : "") + h;
    }
    f = '["' + a + '",[' + f + "]]";
    c += (c ? "," : "") + f;
  }
  return c;
}
;V.prototype.remove = function(a, b) {
  const c = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (c) {
    if (this.fastupdate) {
      for (let e = 0, d, f; e < c.length; e++) {
        if ((d = c[e]) && (f = d.length)) {
          if (d[f - 1] === a) {
            d.pop();
          } else {
            const g = d.indexOf(a);
            0 <= g && d.splice(g, 1);
          }
        }
      }
    } else {
      tb(this.map, a), this.depth && tb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.S && ub(this));
  this.cache && this.cache.remove(a);
  return this;
};
function tb(a, b) {
  let c = 0;
  var e = "undefined" === typeof b;
  if (a.constructor === Array) {
    for (let d = 0, f, g, k; d < a.length; d++) {
      if ((f = a[d]) && f.length) {
        if (e) {
          return 1;
        }
        g = f.indexOf(b);
        if (0 <= g) {
          if (1 < f.length) {
            return f.splice(g, 1), 1;
          }
          delete a[d];
          if (c) {
            return 1;
          }
          k = 1;
        } else {
          if (k) {
            return 1;
          }
          c++;
        }
      }
    }
  } else {
    for (let d of a.entries()) {
      e = d[0], tb(d[1], b) ? c++ : a.delete(e);
    }
  }
  return c;
}
;const vb = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
V.prototype.add = function(a, b, c, e) {
  if (b && (a || 0 === a)) {
    if (!e && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    e = this.depth;
    b = this.encoder.encode(b, !e);
    const l = b.length;
    if (l) {
      const m = I(), r = I(), t = this.resolution;
      for (let q = 0; q < l; q++) {
        let u = b[this.rtl ? l - 1 - q : q];
        var d = u.length;
        if (d && (e || !r[u])) {
          var f = this.score ? this.score(b, u, q, null, 0) : wb(t, l, q), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (let n = 0, p; n < d; n++) {
                  for (f = d; f > n; f--) {
                    g = u.substring(n, f);
                    p = this.rtl ? d - 1 - n : n;
                    var k = this.score ? this.score(b, u, q, g, p) : wb(t, l, q, d, p);
                    xb(this, r, g, k, a, c);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < d) {
                for (k = d - 1; 0 < k; k--) {
                  g = u[this.rtl ? d - 1 - k : k] + g;
                  var h = this.score ? this.score(b, u, q, g, k) : wb(t, l, q, d, k);
                  xb(this, r, g, h, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (k = 0; k < d; k++) {
                  g += u[this.rtl ? d - 1 - k : k], xb(this, r, g, f, a, c);
                }
                break;
              }
            default:
              if (xb(this, r, u, f, a, c), e && 1 < l && q < l - 1) {
                for (d = I(), g = this.T, f = u, k = Math.min(e + 1, this.rtl ? q + 1 : l - q), d[f] = 1, h = 1; h < k; h++) {
                  if ((u = b[this.rtl ? l - 1 - q - h : q + h]) && !d[u]) {
                    d[u] = 1;
                    const n = this.score ? this.score(b, f, q, u, h - 1) : wb(g + (l / 2 > g ? 0 : 1), l, q, k - 1, h - 1), p = this.bidirectional && u > f;
                    xb(this, m, p ? f : u, n, a, c, p ? u : f);
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
  this.db && (b || this.commit_task.push({del:a}), this.S && ub(this));
  return this;
};
function xb(a, b, c, e, d, f, g) {
  let k = g ? a.ctx : a.map, h;
  if (!b[c] || g && !(h = b[c])[g]) {
    if (g ? (b = h || (b[c] = I()), b[g] = 1, (h = k.get(g)) ? k = h : k.set(g, k = new Map())) : b[c] = 1, (h = k.get(c)) ? k = h : k.set(c, k = h = []), k = k[e] || (k[e] = []), !f || !k.includes(d)) {
      if (k.length === 2 ** 31 - 1) {
        b = new Aa(k);
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
function wb(a, b, c, e, d) {
  return c && 1 < a ? b + (e || 0) <= a ? c + (d || 0) : (a - 1) / (b + (e || 0)) * (c + (d || 0)) + 1 | 0 : 0;
}
;V.prototype.search = function(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : (c = a, a = ""));
  if (c && c.cache) {
    return c.cache = !1, a = this.searchCache(a, b, c), c.cache = !0, a;
  }
  let e = [], d, f, g, k = 0, h, l, m, r, t;
  c && (a = c.query || a, b = c.limit || b, k = c.offset || 0, f = c.context, g = c.suggest, t = (h = c.resolve) && c.enrich, m = c.boost, r = c.resolution, l = this.db && c.tag);
  "undefined" === typeof h && (h = this.resolve);
  f = this.depth && !1 !== f;
  let q = this.encoder.encode(a, !f);
  d = q.length;
  b = b || (h ? 100 : 0);
  if (1 === d) {
    return yb.call(this, q[0], "", b, k, h, t, l);
  }
  if (2 === d && f && !g) {
    return yb.call(this, q[1], q[0], b, k, h, t, l);
  }
  let u = I(), n = 0, p;
  f && (p = q[0], n = 1);
  r || 0 === r || (r = p ? this.T : this.resolution);
  if (this.db) {
    if (this.db.search && (c = this.db.search(this, q, b, k, g, h, t, l), !1 !== c)) {
      return c;
    }
    const y = this;
    return async function() {
      for (let v, D; n < d; n++) {
        if ((D = q[n]) && !u[D]) {
          u[D] = 1;
          v = await zb(y, D, p, 0, 0, !1, !1);
          if (v = Ab(v, e, g, r)) {
            e = v;
            break;
          }
          p && (g && v && e.length || (p = D));
        }
        g && p && n === d - 1 && !e.length && (r = y.resolution, p = "", n = -1, u = I());
      }
      return Bb(e, r, b, k, g, m, h);
    }();
  }
  for (let y, v; n < d; n++) {
    if ((v = q[n]) && !u[v]) {
      u[v] = 1;
      y = zb(this, v, p, 0, 0, !1, !1);
      if (y = Ab(y, e, g, r)) {
        e = y;
        break;
      }
      p && (g && y && e.length || (p = v));
    }
    g && p && n === d - 1 && !e.length && (r = this.resolution, p = "", n = -1, u = I());
  }
  return Bb(e, r, b, k, g, m, h);
};
function Bb(a, b, c, e, d, f, g) {
  let k = a.length, h = a;
  if (1 < k) {
    h = $a(a, b, c, e, d, f, g);
  } else if (1 === k) {
    return g ? Sa.call(null, a[0], c, e) : new Y(a[0], this);
  }
  return g ? h : new Y(h, this);
}
function yb(a, b, c, e, d, f, g) {
  a = zb(this, a, b, c, e, d, f, g);
  return this.db ? a.then(function(k) {
    return d ? k || [] : new Y(k, this);
  }) : a && a.length ? d ? Sa.call(this, a, c, e) : new Y(a, this) : d ? [] : new Y([], this);
}
function Ab(a, b, c, e) {
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
function zb(a, b, c, e, d, f, g, k) {
  let h;
  c && (h = a.bidirectional && b > c) && (h = c, c = b, b = h);
  if (a.db) {
    return a.db.get(b, c, e, d, f, g, k);
  }
  a = c ? (a = a.ctx.get(c)) && a.get(b) : a.map.get(b);
  return a;
}
;function V(a, b) {
  if (!this || this.constructor !== V) {
    return new V(a);
  }
  if (a) {
    var c = N(a) ? a : a.preset;
    c && (vb[c] || console.warn("Preset not found: " + c), a = Object.assign({}, vb[c], a));
  } else {
    a = {};
  }
  c = a.context;
  const e = !0 === c ? {depth:1} : c || {}, d = N(a.encoder) ? wa[a.encoder] : a.encode || a.encoder || {};
  this.encoder = d.encode ? d : "object" === typeof d ? new la(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = c = (c = a.tokenize) && "default" !== c && "exact" !== c && c || "strict";
  this.depth = "strict" === c && e.depth || 0;
  this.bidirectional = !1 !== e.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e && e.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new R(c) : new Map();
  this.ctx = c ? new R(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new R(c) : new Map() : c ? new S(c) : new Set());
  this.T = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new na(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.S = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
w = V.prototype;
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
function ub(a) {
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
  const c = this, e = this.remove(a);
  return e && e.then ? e.then(() => c.add(a, b)) : this.add(a, b);
};
w.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  tb(this.map);
  this.depth && tb(this.ctx);
  return this;
};
w.searchCache = ma;
w.export = function(a, b, c = 0, e = 0) {
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = pb(this.reg);
      break;
    case 1:
      d = "cfg";
      f = null;
      break;
    case 2:
      d = "map";
      f = lb(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      f = nb(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return rb.call(this, a, b, d, f, c, e);
};
w.import = function(a, b) {
  if (b) {
    switch("string" === typeof b && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = qb(b, this.reg);
        break;
      case "map":
        this.map = mb(b, this.map);
        break;
      case "ctx":
        this.ctx = ob(b, this.ctx);
    }
  }
};
w.serialize = function(a = !0) {
  let b = "", c = "", e = "";
  if (this.reg.size) {
    let f;
    for (var d of this.reg.keys()) {
      f || (f = typeof d), b += (b ? "," : "") + ("string" === f ? '"' + d + '"' : d);
    }
    b = "index.reg=new Set([" + b + "]);";
    c = sb(this.map, f);
    c = "index.map=new Map([" + c + "]);";
    for (const g of this.ctx.entries()) {
      d = g[0];
      let k = sb(g[1], f);
      k = "new Map([" + k + "])";
      k = '["' + d + '",' + k + "]";
      e += (e ? "," : "") + k;
    }
    e = "index.ctx=new Map([" + e + "]);";
  }
  return a ? "function inject(index){" + b + c + e + "}" : b + c + e;
};
Fa(V.prototype);
const Cb = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), Db = ["map", "ctx", "tag", "reg", "cfg"], Eb = I();
function Fb(a, b = {}) {
  if (!this || this.constructor !== Fb) {
    return new Fb(a, b);
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
w = Fb.prototype;
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
  let a = this;
  navigator.storage && navigator.storage.persist();
  Eb[a.id] || (Eb[a.id] = []);
  Eb[a.id].push(a.field);
  const b = Cb.open(a.id, 1);
  b.onupgradeneeded = function() {
    const c = a.db = this.result;
    for (let e = 0, d; e < Db.length; e++) {
      d = Db[e];
      for (let f = 0, g; f < Eb[a.id].length; f++) {
        g = Eb[a.id][f], c.objectStoreNames.contains(d + ("reg" !== d ? g ? ":" + g : "" : "")) || c.createObjectStore(d + ("reg" !== d ? g ? ":" + g : "" : ""));
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
w.close = function() {
  this.db && this.db.close();
  this.db = null;
};
w.destroy = function() {
  const a = Cb.deleteDatabase(this.id);
  return Z(a);
};
w.clear = function() {
  const a = [];
  for (let c = 0, e; c < Db.length; c++) {
    e = Db[c];
    for (let d = 0, f; d < Eb[this.id].length; d++) {
      f = Eb[this.id][d], a.push(e + ("reg" !== e ? f ? ":" + f : "" : ""));
    }
  }
  const b = this.db.transaction(a, "readwrite");
  for (let c = 0; c < a.length; c++) {
    b.objectStore(a[c]).clear();
  }
  return Z(b);
};
w.get = function(a, b, c = 0, e = 0, d = !0, f = !1) {
  a = this.db.transaction((b ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((b ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(b ? b + ":" + a : a);
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
      for (let l = 0, m; l < k.length; l++) {
        if ((m = k[l]) && m.length) {
          if (e >= m.length) {
            e -= m.length;
            continue;
          }
          const r = c ? e + Math.min(m.length - e, c) : m.length;
          for (let t = e; t < r; t++) {
            h.push(m[t]);
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
w.tag = function(a, b = 0, c = 0, e = !1) {
  a = this.db.transaction("tag" + (this.field ? ":" + this.field : ""), "readonly").objectStore("tag" + (this.field ? ":" + this.field : "")).get(a);
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
w.enrich = function(a) {
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
w.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return Z(a).then(function(b) {
    return !!b;
  });
};
w.search = null;
w.info = function() {
};
w.transaction = function(a, b, c) {
  a += "reg" !== a ? this.field ? ":" + this.field : "" : "";
  let e = this.h[a + ":" + b];
  if (e) {
    return c.call(this, e);
  }
  let d = this.db.transaction(a, b);
  this.h[a + ":" + b] = e = d.objectStore(a);
  const f = c.call(this, e);
  this.h[a + ":" + b] = null;
  return Z(d).finally(function() {
    d = e = null;
    return f;
  });
};
w.commit = async function(a, b, c) {
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
        e[d] = f.del;
      }
    }
    b || (c || (e = e.concat(ca(a.reg))), e.length && await this.remove(e));
  }
  a.reg.size && (await this.transaction("map", "readwrite", function(e) {
    for (const d of a.map) {
      const f = d[0], g = d[1];
      g.length && (b ? e.put(g, f) : e.get(f).onsuccess = function() {
        let k = this.result;
        var h;
        if (k && k.length) {
          const l = Math.max(k.length, g.length);
          for (let m = 0, r, t; m < l; m++) {
            if ((t = g[m]) && t.length) {
              if ((r = k[m]) && r.length) {
                for (h = 0; h < t.length; h++) {
                  r.push(t[h]);
                }
              } else {
                k[m] = t;
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
          let m = this.result;
          var r;
          if (m && m.length) {
            const t = Math.max(m.length, l.length);
            for (let q = 0, u, n; q < t; q++) {
              if ((n = l[q]) && n.length) {
                if ((u = m[q]) && u.length) {
                  for (r = 0; r < n.length; r++) {
                    u.push(n[r]);
                  }
                } else {
                  m[q] = n;
                }
                r = 1;
              }
            }
          } else {
            m = l, r = 1;
          }
          r && e.put(m, f + ":" + h);
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
function Gb(a, b, c) {
  const e = a.value;
  let d, f = 0;
  for (let g = 0, k; g < e.length; g++) {
    if (k = c ? e : e[g]) {
      for (let h = 0, l, m; h < b.length; h++) {
        if (m = b[h], l = k.indexOf(m), 0 <= l) {
          if (d = 1, 1 < k.length) {
            k.splice(l, 1);
          } else {
            e[g] = [];
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
  f ? d && a.update(e) : a.delete();
  a.continue();
}
w.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && Gb(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && Gb(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && Gb(c, a, !0);
    };
  }), this.transaction("reg", "readwrite", function(b) {
    for (let c = 0; c < a.length; c++) {
      b.delete(a[c]);
    }
  })]);
};
function Z(a, b) {
  return new Promise((c, e) => {
    a.onsuccess = a.oncomplete = function() {
      b && b(this.result);
      b = null;
      c(this.result);
    };
    a.onerror = a.onblocked = e;
    a = null;
  });
}
;export default {Index:V, Charset:wa, Encoder:la, Document:Na, Worker:La, Resolver:Y, IndexedDB:Fb, Language:{}};

export const Index=V;export const  Charset=wa;export const  Encoder=la;export const  Document=Na;export const  Worker=La;export const  Resolver=Y;export const  IndexedDB=Fb;export const  Language={};