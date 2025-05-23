/**!
 * FlexSearch.js v0.8.203 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;
var w;
function H(a, c, b) {
  const e = typeof b, d = typeof a;
  if (e !== "undefined") {
    if (d !== "undefined") {
      if (b) {
        if (d === "function" && e === d) {
          return function(k) {
            return a(b(k));
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
  return d === "undefined" ? c : a;
}
function aa(a, c) {
  return typeof a === "undefined" ? c : a;
}
function I() {
  return Object.create(null);
}
function N(a) {
  return typeof a === "string";
}
function ba(a) {
  return typeof a === "object";
}
function ca(a) {
  const c = [];
  for (const b of a.keys()) {
    c.push(b);
  }
  return c;
}
function da(a, c) {
  if (N(c)) {
    a = a[c];
  } else {
    for (let b = 0; a && b < c.length; b++) {
      a = a[c[b]];
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
  let c = a.include, b = c || a.exclude || a.split, e;
  if (b || b === "") {
    if (typeof b === "object" && b.constructor !== RegExp) {
      let d = "";
      e = !c;
      c || (d += "\\p{Z}");
      b.letter && (d += "\\p{L}");
      b.number && (d += "\\p{N}", e = !!c);
      b.symbol && (d += "\\p{S}");
      b.punctuation && (d += "\\p{P}");
      b.control && (d += "\\p{C}");
      if (b = b.char) {
        d += typeof b === "object" ? b.join("") : b;
      }
      try {
        this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
      } catch (f) {
        console.error("Your split configuration:", b, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = b, e = b === !1 || "a1a".split(b).length < 2;
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
  b = a.filter;
  this.filter = typeof b === "function" ? b : H(b && new Set(b), null, this.filter);
  this.dedupe = H(a.dedupe, !0, this.dedupe);
  this.matcher = H((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = H((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = H((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = H(a.replacer, null, this.replacer);
  this.minlength = H(a.minlength, 1, this.minlength);
  this.maxlength = H(a.maxlength, 1024, this.maxlength);
  this.rtl = H(a.rtl, !1, this.rtl);
  if (this.cache = b = H(a.cache, !0, this.cache)) {
    this.F = null, this.L = typeof b === "number" ? b : 2e5, this.B = new Map(), this.D = new Map(), this.I = this.H = 128;
  }
  this.h = "";
  this.J = null;
  this.A = "";
  this.K = null;
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
w.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.A += (this.A ? "|" : "") + a;
  this.K = null;
  this.cache && ma(this);
  return this;
};
w.addFilter = function(a) {
  typeof a === "function" ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && ma(this);
  return this;
};
w.addMapper = function(a, c) {
  if (typeof a === "object") {
    return this.addReplacer(a, c);
  }
  if (a.length > 1) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && ma(this);
  return this;
};
w.addMatcher = function(a, c) {
  if (typeof a === "object") {
    return this.addReplacer(a, c);
  }
  if (a.length < 2 && (this.dedupe || this.mapper)) {
    return this.addMapper(a, c);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, c);
  this.h += (this.h ? "|" : "") + a;
  this.J = null;
  this.cache && ma(this);
  return this;
};
w.addReplacer = function(a, c) {
  if (typeof a === "string") {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && ma(this);
  return this;
};
w.encode = function(a, c) {
  if (this.cache && a.length <= this.H) {
    if (this.F) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.F = setTimeout(ma, 50, this);
    }
  }
  this.normalize && (typeof this.normalize === "function" ? a = this.normalize(a) : a = ka ? a.normalize("NFKD").replace(ka, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && a.length > 3 && (a = a.replace(ia, "$1 $2").replace(ja, "$1 $2").replace(ha, "$1 "));
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let e = [], d = I(), f, g, k = this.split || this.split === "" ? a.split(this.split) : [a];
  for (let l = 0, n, q; l < k.length; l++) {
    if ((n = q = k[l]) && !(n.length < this.minlength || n.length > this.maxlength)) {
      if (c) {
        if (d[n]) {
          continue;
        }
        d[n] = 1;
      } else {
        if (f === n) {
          continue;
        }
        f = n;
      }
      if (b) {
        e.push(n);
      } else {
        if (!this.filter || (typeof this.filter === "function" ? this.filter(n) : !this.filter.has(n))) {
          if (this.cache && n.length <= this.I) {
            if (this.F) {
              var h = this.D.get(n);
              if (h || h === "") {
                h && e.push(h);
                continue;
              }
            } else {
              this.F = setTimeout(ma, 50, this);
            }
          }
          if (this.stemmer) {
            this.K || (this.K = new RegExp("(?!^)(" + this.A + ")$"));
            let u;
            for (; u !== n && n.length > 2;) {
              u = n, n = n.replace(this.K, r => this.stemmer.get(r));
            }
          }
          if (n && (this.mapper || this.dedupe && n.length > 1)) {
            h = "";
            for (let u = 0, r = "", t, m; u < n.length; u++) {
              t = n.charAt(u), t === r && this.dedupe || ((m = this.mapper && this.mapper.get(t)) || m === "" ? m === r && this.dedupe || !(r = m) || (h += m) : h += r = t);
            }
            n = h;
          }
          this.matcher && n.length > 1 && (this.J || (this.J = new RegExp("(" + this.h + ")", "g")), n = n.replace(this.J, u => this.matcher.get(u)));
          if (n && this.replacer) {
            for (h = 0; n && h < this.replacer.length; h += 2) {
              n = n.replace(this.replacer[h], this.replacer[h + 1]);
            }
          }
          this.cache && q.length <= this.I && (this.D.set(q, n), this.D.size > this.L && (this.D.clear(), this.I = this.I / 1.1 | 0));
          if (n) {
            if (n !== q) {
              if (c) {
                if (d[n]) {
                  continue;
                }
                d[n] = 1;
              } else {
                if (g === n) {
                  continue;
                }
                g = n;
              }
            }
            e.push(n);
          }
        }
      }
    }
  }
  this.finalize && (e = this.finalize(e) || e);
  this.cache && a.length <= this.H && (this.B.set(a, e), this.B.size > this.L && (this.B.clear(), this.H = this.H / 1.1 | 0));
  return e;
};
function ma(a) {
  a.F = null;
  a.B.clear();
  a.D.clear();
}
;function na(a, c, b) {
  b || (c || typeof a !== "object" ? typeof c === "object" && (b = c, c = 0) : b = a);
  b && (a = b.query || a, c = b.limit || c);
  let e = "" + (c || 0);
  b && (e += (b.offset || 0) + !!b.context + !!b.suggest + (b.resolve !== !1) + (b.resolution || this.resolution) + (b.boost || 0));
  a = ("" + a).toLowerCase();
  this.cache || (this.cache = new oa());
  let d = this.cache.get(a + e);
  if (!d) {
    const f = b && b.cache;
    f && (b.cache = !1);
    d = this.search(a, c, b);
    f && (b.cache = f);
    this.cache.set(a + e, d);
  }
  return d;
}
function oa(a) {
  this.limit = a && a !== !0 ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
oa.prototype.set = function(a, c) {
  this.cache.set(this.h = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
oa.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
  return c;
};
oa.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
oa.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const ra = {normalize:!1, numeric:!1, dedupe:!1};
const sa = {};
const ta = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const ua = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), va = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const wa = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var xa = {Exact:ra, Default:sa, Normalize:sa, LatinBalance:{mapper:ta}, LatinAdvanced:{mapper:ta, matcher:ua, replacer:va}, LatinExtra:{mapper:ta, replacer:va.concat([/(?!^)[aeo]/g, ""]), matcher:ua}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let e = c.charAt(0), d = wa[e];
    for (let f = 1, g; f < c.length && (g = c.charAt(f), g === "h" || g === "w" || !(g = wa[g]) || g === d || (e += g, d = g, e.length !== 4)); f++) {
    }
    a[b] = e;
  }
}}, CJK:{split:""}, LatinExact:ra, LatinDefault:sa, LatinSimple:sa};
function Aa(a, c, b, e) {
  let d = [];
  for (let f = 0, g; f < a.index.length; f++) {
    if (g = a.index[f], c >= g.length) {
      c -= g.length;
    } else {
      c = g[e ? "splice" : "slice"](c, b);
      const k = c.length;
      if (k && (d = d.length ? d.concat(c) : c, b -= k, e && (a.length -= k), !b)) {
        break;
      }
      c = 0;
    }
  }
  return d;
}
function Ba(a) {
  if (!this || this.constructor !== Ba) {
    return new Ba(a);
  }
  this.index = a ? [a] : [];
  this.length = a ? a.length : 0;
  const c = this;
  return new Proxy([], {get(b, e) {
    if (e === "length") {
      return c.length;
    }
    if (e === "push") {
      return function(d) {
        c.index[c.index.length - 1].push(d);
        c.length++;
      };
    }
    if (e === "pop") {
      return function() {
        if (c.length) {
          return c.length--, c.index[c.index.length - 1].pop();
        }
      };
    }
    if (e === "indexOf") {
      return function(d) {
        let f = 0;
        for (let g = 0, k, h; g < c.index.length; g++) {
          k = c.index[g];
          h = k.indexOf(d);
          if (h >= 0) {
            return f + h;
          }
          f += k.length;
        }
        return -1;
      };
    }
    if (e === "includes") {
      return function(d) {
        for (let f = 0; f < c.index.length; f++) {
          if (c.index[f].includes(d)) {
            return !0;
          }
        }
        return !1;
      };
    }
    if (e === "slice") {
      return function(d, f) {
        return Aa(c, d || 0, f || c.length, !1);
      };
    }
    if (e === "splice") {
      return function(d, f) {
        return Aa(c, d || 0, f || c.length, !0);
      };
    }
    if (e === "constructor") {
      return Array;
    }
    if (typeof e !== "symbol") {
      return (b = c.index[e / 2 ** 31 | 0]) && b[e];
    }
  }, set(b, e, d) {
    b = e / 2 ** 31 | 0;
    (c.index[b] || (c.index[b] = []))[e] = d;
    c.length++;
    return !0;
  }});
}
Ba.prototype.clear = function() {
  this.index.length = 0;
};
Ba.prototype.push = function() {
};
function Q(a = 8) {
  if (!this || this.constructor !== Q) {
    return new Q(a);
  }
  this.index = I();
  this.h = [];
  this.size = 0;
  a > 32 ? (this.B = Ca, this.A = BigInt(a)) : (this.B = Da, this.A = a);
}
Q.prototype.get = function(a) {
  const c = this.index[this.B(a)];
  return c && c.get(a);
};
Q.prototype.set = function(a, c) {
  var b = this.B(a);
  let e = this.index[b];
  e ? (b = e.size, e.set(a, c), (b -= e.size) && this.size++) : (this.index[b] = e = new Map([[a, c]]), this.h.push(e), this.size++);
};
function R(a = 8) {
  if (!this || this.constructor !== R) {
    return new R(a);
  }
  this.index = I();
  this.h = [];
  this.size = 0;
  a > 32 ? (this.B = Ca, this.A = BigInt(a)) : (this.B = Da, this.A = a);
}
R.prototype.add = function(a) {
  var c = this.B(a);
  let b = this.index[c];
  b ? (c = b.size, b.add(a), (c -= b.size) && this.size++) : (this.index[c] = b = new Set([a]), this.h.push(b), this.size++);
};
w = Q.prototype;
w.has = R.prototype.has = function(a) {
  const c = this.index[this.B(a)];
  return c && c.has(a);
};
w.delete = R.prototype.delete = function(a) {
  const c = this.index[this.B(a)];
  c && c.delete(a) && this.size--;
};
w.clear = R.prototype.clear = function() {
  this.index = I();
  this.h = [];
  this.size = 0;
};
w.values = R.prototype.values = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let c of this.h[a].values()) {
      yield c;
    }
  }
};
w.keys = R.prototype.keys = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let c of this.h[a].keys()) {
      yield c;
    }
  }
};
w.entries = R.prototype.entries = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let c of this.h[a].entries()) {
      yield c;
    }
  }
};
function Da(a) {
  let c = 2 ** this.A - 1;
  if (typeof a == "number") {
    return a & c;
  }
  let b = 0, e = this.A + 1;
  for (let d = 0; d < a.length; d++) {
    b = (b * e ^ a.charCodeAt(d)) & c;
  }
  return this.A === 32 ? b + 2 ** 31 : b;
}
function Ca(a) {
  let c = BigInt(2) ** this.A - BigInt(1);
  var b = typeof a;
  if (b === "bigint") {
    return a & c;
  }
  if (b === "number") {
    return BigInt(a) & c;
  }
  b = BigInt(0);
  let e = this.A + BigInt(1);
  for (let d = 0; d < a.length; d++) {
    b = (b * e ^ BigInt(a.charCodeAt(d))) & c;
  }
  return b;
}
;let Ea, S;
async function Fa(a) {
  a = a.data;
  var c = a.task;
  const b = a.id;
  let e = a.args;
  switch(c) {
    case "init":
      S = a.options || {};
      (c = a.factory) ? (Function("return " + c)()(self), Ea = new self.FlexSearch.Index(S), delete self.FlexSearch) : Ea = new T(S);
      postMessage({id:b});
      break;
    default:
      let d;
      if (c === "export") {
        if (!S.export || typeof S.export !== "function") {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
        }
        e[1] ? (e[0] = S.export, e[2] = 0, e[3] = 1) : e = null;
      }
      if (c === "import") {
        if (!S.import || typeof S.import !== "function") {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
        }
        e[0] && (a = await S.import.call(Ea, e[0]), Ea.import(e[0], a));
      } else {
        (d = e && Ea[c].apply(Ea, e)) && d.then && (d = await d), d && d.await && (d = await d.await), c === "search" && d.result && (d = d.result);
      }
      postMessage(c === "search" ? {id:b, msg:d} : {id:b});
  }
}
;function Ga(a) {
  Ha.call(a, "add");
  Ha.call(a, "append");
  Ha.call(a, "search");
  Ha.call(a, "update");
  Ha.call(a, "remove");
  Ha.call(a, "searchCache");
}
let Ia, Ja, Ka;
function La() {
  Ia = Ka = 0;
}
function Ha(a) {
  this[a + "Async"] = function() {
    const c = arguments;
    var b = c[c.length - 1];
    let e;
    typeof b === "function" && (e = b, delete c[c.length - 1]);
    Ia ? Ka || (Ka = Date.now() - Ja >= this.priority * this.priority * 3) : (Ia = setTimeout(La, 0), Ja = Date.now());
    if (Ka) {
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
;let V = 0;
function Ma(a = {}, c) {
  function b(k) {
    function h(l) {
      l = l.data || l;
      const n = l.id, q = n && f.h[n];
      q && (q(l.msg), delete f.h[n]);
    }
    this.worker = k;
    this.h = I();
    if (this.worker) {
      d ? this.worker.on("message", h) : this.worker.onmessage = h;
      if (a.config) {
        return new Promise(function(l) {
          V > 1e9 && (V = 0);
          f.h[++V] = function() {
            l(f);
          };
          f.worker.postMessage({id:V, task:"init", factory:e, options:a});
        });
      }
      this.priority = a.priority || 4;
      this.encoder = c || null;
      this.worker.postMessage({task:"init", factory:e, options:a});
      return this;
    }
    console.warn("Worker is not available on this platform. Please report on Github: https://github.com/nextapps-de/flexsearch/issues");
  }
  if (!this || this.constructor !== Ma) {
    return new Ma(a);
  }
  let e = typeof self !== "undefined" ? self._factory : typeof window !== "undefined" ? window._factory : null;
  e && (e = e.toString());
  const d = typeof window === "undefined", f = this, g = Na(e, d, a.worker);
  return g.then ? g.then(function(k) {
    return b.call(f, k);
  }) : b.call(this, g);
}
W("add");
W("append");
W("search");
W("update");
W("remove");
W("clear");
W("export");
W("import");
Ma.prototype.searchCache = na;
Ga(Ma.prototype);
function W(a) {
  Ma.prototype[a] = function() {
    const c = this, b = [].slice.call(arguments);
    var e = b[b.length - 1];
    let d;
    typeof e === "function" && (d = e, b.pop());
    e = new Promise(function(f) {
      a === "export" && typeof b[0] === "function" && (b[0] = null);
      V > 1e9 && (V = 0);
      c.h[++V] = f;
      c.worker.postMessage({task:a, id:V, args:b});
    });
    return d ? (e.then(d), this) : e;
  };
}
function Na(a, c, b) {
  return c ? typeof module !== "undefined" ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + Fa.toString()], {type:"text/javascript"}))) : new window.Worker(typeof b === "string" ? b : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;Oa.prototype.add = function(a, c, b) {
  ba(a) && (c = a, a = da(c, this.key));
  if (c && (a || a === 0)) {
    if (!b && this.reg.has(a)) {
      return this.update(a, c);
    }
    for (let k = 0, h; k < this.field.length; k++) {
      h = this.B[k];
      var e = this.index.get(this.field[k]);
      if (typeof h === "function") {
        var d = h(c);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = h.G, !d || d(c)) {
          h.constructor === String ? h = ["" + h] : N(h) && (h = [h]), Ra(c, h, this.D, 0, e, a, h[0], b);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.A.length; e++) {
        var f = this.A[e], g = this.F[e];
        d = this.tag.get(g);
        let k = I();
        if (typeof f === "function") {
          if (f = f(c), !f) {
            continue;
          }
        } else {
          const h = f.G;
          if (h && !h(c)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = da(c, f);
        }
        if (d && f) {
          N(f) && (f = [f]);
          for (let h = 0, l, n; h < f.length; h++) {
            if (l = f[h], !k[l] && (k[l] = 1, (g = d.get(l)) ? n = g : d.set(l, n = []), !b || !n.includes(a))) {
              if (n.length === 2 ** 31 - 1) {
                g = new Ba(n);
                if (this.fastupdate) {
                  for (let q of this.reg.values()) {
                    q.includes(n) && (q[q.indexOf(n)] = g);
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
    if (this.store && (!b || !this.store.has(a))) {
      let k;
      if (this.h) {
        k = I();
        for (let h = 0, l; h < this.h.length; h++) {
          l = this.h[h];
          if ((b = l.G) && !b(c)) {
            continue;
          }
          let n;
          if (typeof l === "function") {
            n = l(c);
            if (!n) {
              continue;
            }
            l = [l.O];
          } else if (N(l) || l.constructor === String) {
            k[l] = c[l];
            continue;
          }
          Sa(c, k, l, 0, l[0], n);
        }
      }
      this.store.set(a, k || c);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function Sa(a, c, b, e, d, f) {
  a = a[d];
  if (e === b.length - 1) {
    c[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (c = c[d] = Array(a.length), d = 0; d < a.length; d++) {
        Sa(a, c, b, e, d);
      }
    } else {
      c = c[d] || (c[d] = I()), d = b[++e], Sa(a, c, b, e, d);
    }
  }
}
function Ra(a, c, b, e, d, f, g, k) {
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
      d.add(f, a, k, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          Ra(a, c, b, e, d, f, g, k);
        }
      } else {
        g = c[++e], Ra(a, c, b, e, d, f, g, k);
      }
    }
  }
}
;function Ta(a, c, b, e) {
  if (!a.length) {
    return a;
  }
  if (a.length === 1) {
    return a = a[0], a = b || a.length > c ? a.slice(b, b + c) : a, e ? Ua.call(this, a) : a;
  }
  let d = [];
  for (let f = 0, g, k; f < a.length; f++) {
    if ((g = a[f]) && (k = g.length)) {
      if (b) {
        if (b >= k) {
          b -= k;
          continue;
        }
        g = g.slice(b, b + c);
        k = g.length;
        b = 0;
      }
      k > c && (g = g.slice(0, c), k = c);
      if (!d.length && k >= c) {
        return e ? Ua.call(this, g) : g;
      }
      d.push(g);
      c -= k;
      if (!c) {
        break;
      }
    }
  }
  d = d.length > 1 ? [].concat.apply([], d) : d[0];
  return e ? Ua.call(this, d) : d;
}
;function Va(a, c, b, e) {
  var d = e[0];
  if (d[0] && d[0].query) {
    return a[c].apply(a, d);
  }
  if (!(c !== "and" && c !== "not" || a.result.length || a.await || d.suggest)) {
    return e.length > 1 && (d = e[e.length - 1]), (e = d.resolve) ? a.await || a.result : a;
  }
  let f = [], g = 0, k = 0, h, l, n, q, u;
  for (c = 0; c < e.length; c++) {
    if (d = e[c]) {
      var r = void 0;
      if (d.constructor === X) {
        r = d.await || d.result;
      } else if (d.then || d.constructor === Array) {
        r = d;
      } else {
        g = d.limit || 0;
        k = d.offset || 0;
        n = d.suggest;
        h = ((q = (l = d.resolve) && d.highlight) || d.enrich) && l;
        r = d.queue;
        let t = d.async || r, m = d.index;
        m ? a.index || (a.index = m) : m = a.index;
        if (d.query || d.tag) {
          if (!m) {
            throw Error("Resolver can't apply because the corresponding Index was never specified");
          }
          const p = d.field || d.pluck;
          if (p) {
            d.query && (a.query = d.query, a.field = p);
            if (!m.index) {
              throw Error("Resolver can't apply because the corresponding Document Index was not specified");
            }
            m = m.index.get(p);
            if (!m) {
              throw Error("Resolver can't apply because the specified Document Field '" + p + "' was not found");
            }
          }
          if (r && (u || a.await)) {
            u = 1;
            let x;
            const v = a.C.length, A = new Promise(function(C) {
              x = C;
            });
            (function(C, G) {
              A.h = function() {
                G.index = null;
                G.resolve = !1;
                let B = t ? C.searchAsync(G) : C.search(G);
                if (B.then) {
                  return B.then(function(E) {
                    a.C[v] = E = E.result || E;
                    x(E);
                    return E;
                  });
                }
                B = B.result || B;
                x(B);
                return B;
              };
            })(m, Object.assign({}, d));
            a.C.push(A);
            f[c] = A;
            continue;
          } else {
            d.resolve = !1, d.index = null, r = t ? m.searchAsync(d) : m.search(d), d.resolve = l, d.index = m;
          }
        } else if (d.and) {
          r = Wa(d, "and", m);
        } else if (d.or) {
          r = Wa(d, "or", m);
        } else if (d.not) {
          r = Wa(d, "not", m);
        } else if (d.xor) {
          r = Wa(d, "xor", m);
        } else {
          continue;
        }
      }
      r.await ? (u = 1, r = r.await) : r.then ? (u = 1, r = r.then(function(t) {
        return t.result || t;
      })) : r = r.result || r;
      f[c] = r;
    }
  }
  u && !a.await && (a.await = new Promise(function(t) {
    a.return = t;
  }));
  if (u) {
    const t = Promise.all(f).then(function(m) {
      for (let p = 0; p < a.C.length; p++) {
        if (a.C[p] === t) {
          a.C[p] = function() {
            return b.call(a, m, g, k, h, l, n, q);
          };
          break;
        }
      }
      Xa(a);
    });
    a.C.push(t);
  } else if (a.await) {
    a.C.push(function() {
      return b.call(a, f, g, k, h, l, n, q);
    });
  } else {
    return b.call(a, f, g, k, h, l, n, q);
  }
  return l ? a.await || a.result : a;
}
function Wa(a, c, b) {
  a = a[c];
  const e = a[0] || a;
  e.index || (e.index = b);
  b = new X(e);
  a.length > 1 && (b = b[c].apply(b, a.slice(1)));
  return b;
}
;X.prototype.or = function() {
  return Va(this, "or", Ya, arguments);
};
function Ya(a, c, b, e, d, f, g) {
  a.length && (this.result.length && a.push(this.result), a.length < 2 ? this.result = a[0] : (this.result = Za(a, c, b, !1, this.h), b = 0));
  d && (this.await = null);
  return d ? this.resolve(c, b, e, g) : this;
}
;X.prototype.and = function() {
  return Va(this, "and", $a, arguments);
};
function $a(a, c, b, e, d, f, g) {
  if (!f && !this.result.length) {
    return d ? this.result : this;
  }
  let k;
  if (a.length) {
    if (this.result.length && a.unshift(this.result), a.length < 2) {
      this.result = a[0];
    } else {
      let h = 0;
      for (let l = 0, n, q; l < a.length; l++) {
        if ((n = a[l]) && (q = n.length)) {
          h < q && (h = q);
        } else if (!f) {
          h = 0;
          break;
        }
      }
      h ? (this.result = ab(a, h, c, b, f, this.h, d), k = !0) : this.result = [];
    }
  } else {
    f || (this.result = a);
  }
  d && (this.await = null);
  return d ? this.resolve(c, b, e, g, k) : this;
}
;X.prototype.xor = function() {
  return Va(this, "xor", bb, arguments);
};
function bb(a, c, b, e, d, f, g) {
  if (a.length) {
    if (this.result.length && a.unshift(this.result), a.length < 2) {
      this.result = a[0];
    } else {
      a: {
        f = b;
        var k = this.h;
        const h = [], l = I();
        let n = 0;
        for (let q = 0, u; q < a.length; q++) {
          if (u = a[q]) {
            n < u.length && (n = u.length);
            for (let r = 0, t; r < u.length; r++) {
              if (t = u[r]) {
                for (let m = 0, p; m < t.length; m++) {
                  p = t[m], l[p] = l[p] ? 2 : 1;
                }
              }
            }
          }
        }
        for (let q = 0, u, r = 0; q < n; q++) {
          for (let t = 0, m; t < a.length; t++) {
            if (m = a[t]) {
              if (u = m[q]) {
                for (let p = 0, x; p < u.length; p++) {
                  if (x = u[p], l[x] === 1) {
                    if (f) {
                      f--;
                    } else {
                      if (d) {
                        if (h.push(x), h.length === c) {
                          a = h;
                          break a;
                        }
                      } else {
                        const v = q + (t ? k : 0);
                        h[v] || (h[v] = []);
                        h[v].push(x);
                        if (++r === c) {
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
  return d ? this.resolve(c, b, e, g, k) : this;
}
;X.prototype.not = function() {
  return Va(this, "not", cb, arguments);
};
function cb(a, c, b, e, d, f, g) {
  if (!f && !this.result.length) {
    return d ? this.result : this;
  }
  if (a.length && this.result.length) {
    a: {
      f = b;
      var k = [];
      a = new Set(a.flat().flat());
      for (let h = 0, l, n = 0; h < this.result.length; h++) {
        if (l = this.result[h]) {
          for (let q = 0, u; q < l.length; q++) {
            if (u = l[q], !a.has(u)) {
              if (f) {
                f--;
              } else {
                if (d) {
                  if (k.push(u), k.length === c) {
                    a = k;
                    break a;
                  }
                } else {
                  if (k[h] || (k[h] = []), k[h].push(u), ++n === c) {
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
  return d ? this.resolve(c, b, e, g, k) : this;
}
;function db(a, c, b, e, d) {
  let f, g, k;
  typeof d === "string" ? (f = d, d = "") : f = d.template;
  if (!f) {
    throw Error('No template pattern was specified by the search option "highlight"');
  }
  g = f.indexOf("$1");
  if (g === -1) {
    throw Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + f);
  }
  k = f.substring(g + 2);
  g = f.substring(0, g);
  let h = d && d.boundary, l = !d || d.clip !== !1, n = d && d.merge && k && g && new RegExp(k + " " + g, "g");
  d = d && d.ellipsis;
  var q = 0;
  if (typeof d === "object") {
    var u = d.template;
    q = u.length - 2;
    d = d.pattern;
  }
  typeof d !== "string" && (d = d === !1 ? "" : "...");
  q && (d = u.replace("$1", d));
  u = d.length - q;
  let r, t;
  typeof h === "object" && (r = h.before, r === 0 && (r = -1), t = h.after, t === 0 && (t = -1), h = h.total || 9e5);
  q = new Map();
  for (let Pa = 0, ea, gb, pa; Pa < c.length; Pa++) {
    let qa;
    if (e) {
      qa = c, pa = e;
    } else {
      var m = c[Pa];
      pa = m.field;
      if (!pa) {
        continue;
      }
      qa = m.result;
    }
    gb = b.get(pa);
    ea = gb.encoder;
    m = q.get(ea);
    typeof m !== "string" && (m = ea.encode(a), q.set(ea, m));
    for (let ya = 0; ya < qa.length; ya++) {
      var p = qa[ya].doc;
      if (!p) {
        continue;
      }
      p = da(p, pa);
      if (!p) {
        continue;
      }
      var x = p.trim().split(/\s+/);
      if (!x.length) {
        continue;
      }
      p = "";
      var v = [];
      let za = [];
      var A = -1, C = -1, G = 0;
      for (var B = 0; B < x.length; B++) {
        var E = x[B], z = ea.encode(E);
        z = z.length > 1 ? z.join(" ") : z[0];
        let y;
        if (z && E) {
          var D = E.length, K = (ea.split ? E.replace(ea.split, "") : E).length - z.length, F = "", L = 0;
          for (var O = 0; O < m.length; O++) {
            var P = m[O];
            if (P) {
              var M = P.length;
              M += K;
              L && M <= L || (P = z.indexOf(P), P > -1 && (F = (P ? E.substring(0, P) : "") + g + E.substring(P, P + M) + k + (P + M < D ? E.substring(P + M) : ""), L = M, y = !0));
            }
          }
          F && (h && (A < 0 && (A = p.length + (p ? 1 : 0)), C = p.length + (p ? 1 : 0) + F.length, G += D, za.push(v.length), v.push({match:F})), p += (p ? " " : "") + F);
        }
        if (!y) {
          E = x[B], p += (p ? " " : "") + E, h && v.push({text:E});
        } else if (h && G >= h) {
          break;
        }
      }
      G = za.length * (f.length - 2);
      if (r || t || h && p.length - G > h) {
        if (G = h + G - u * 2, B = C - A, r > 0 && (B += r), t > 0 && (B += t), B <= G) {
          x = r ? A - (r > 0 ? r : 0) : A - ((G - B) / 2 | 0), v = t ? C + (t > 0 ? t : 0) : x + G, l || (x > 0 && p.charAt(x) !== " " && p.charAt(x - 1) !== " " && (x = p.indexOf(" ", x), x < 0 && (x = 0)), v < p.length && p.charAt(v - 1) !== " " && p.charAt(v) !== " " && (v = p.lastIndexOf(" ", v), v < C ? v = C : ++v)), p = (x ? d : "") + p.substring(x, v) + (v < p.length ? d : "");
        } else {
          C = [];
          A = {};
          G = {};
          B = {};
          E = {};
          z = {};
          F = K = D = 0;
          for (O = L = 1;;) {
            var U = void 0;
            for (let y = 0, J; y < za.length; y++) {
              J = za[y];
              if (F) {
                if (K !== F) {
                  if (B[y + 1]) {
                    continue;
                  }
                  J += F;
                  if (A[J]) {
                    D -= u;
                    G[y + 1] = 1;
                    B[y + 1] = 1;
                    continue;
                  }
                  if (J >= v.length - 1) {
                    if (J >= v.length) {
                      B[y + 1] = 1;
                      J >= x.length && (G[y + 1] = 1);
                      continue;
                    }
                    D -= u;
                  }
                  p = v[J].text;
                  if (M = t && z[y]) {
                    if (M > 0) {
                      if (p.length > M) {
                        if (B[y + 1] = 1, l) {
                          p = p.substring(0, M);
                        } else {
                          continue;
                        }
                      }
                      (M -= p.length) || (M = -1);
                      z[y] = M;
                    } else {
                      B[y + 1] = 1;
                      continue;
                    }
                  }
                  if (D + p.length + 1 <= h) {
                    p = " " + p, C[y] += p;
                  } else if (l) {
                    U = h - D - 1, U > 0 && (p = " " + p.substring(0, U), C[y] += p), B[y + 1] = 1;
                  } else {
                    B[y + 1] = 1;
                    continue;
                  }
                } else {
                  if (B[y]) {
                    continue;
                  }
                  J -= K;
                  if (A[J]) {
                    D -= u;
                    B[y] = 1;
                    G[y] = 1;
                    continue;
                  }
                  if (J <= 0) {
                    if (J < 0) {
                      B[y] = 1;
                      G[y] = 1;
                      continue;
                    }
                    D -= u;
                  }
                  p = v[J].text;
                  if (M = r && E[y]) {
                    if (M > 0) {
                      if (p.length > M) {
                        if (B[y] = 1, l) {
                          p = p.substring(p.length - M);
                        } else {
                          continue;
                        }
                      }
                      (M -= p.length) || (M = -1);
                      E[y] = M;
                    } else {
                      B[y] = 1;
                      continue;
                    }
                  }
                  if (D + p.length + 1 <= h) {
                    p += " ", C[y] = p + C[y];
                  } else if (l) {
                    U = p.length + 1 - (h - D), U >= 0 && U < p.length && (p = p.substring(U) + " ", C[y] = p + C[y]), B[y] = 1;
                  } else {
                    B[y] = 1;
                    continue;
                  }
                }
              } else {
                p = v[J].match;
                r && (E[y] = r);
                t && (z[y] = t);
                y && D++;
                let Qa;
                J ? !y && u && (D += u) : (G[y] = 1, B[y] = 1);
                J >= x.length - 1 ? Qa = 1 : J < v.length - 1 && v[J + 1].match ? Qa = 1 : u && (D += u);
                D -= f.length - 2;
                if (!y || D + p.length <= h) {
                  C[y] = p;
                } else {
                  U = L = O = G[y] = 0;
                  break;
                }
                Qa && (G[y + 1] = 1, B[y + 1] = 1);
              }
              D += p.length;
              U = A[J] = 1;
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
          for (let y = 0, J; y < C.length; y++) {
            J = (y && G[y] ? " " : (y && !d ? " " : "") + d) + C[y], p += J;
          }
          d && !G[C.length] && (p += d);
        }
      }
      n && (p = p.replace(n, " "));
      qa[ya].highlight = p;
    }
    if (e) {
      break;
    }
  }
  return c;
}
;function X(a, c) {
  if (!this || this.constructor !== X) {
    return new X(a, c);
  }
  let b = 0, e, d, f, g, k;
  if (a && a.index) {
    const h = a;
    c = h.index;
    b = h.boost || 0;
    if (d = h.query) {
      f = h.field || h.pluck;
      const l = h.resolve;
      a = h.async || h.queue;
      h.resolve = !1;
      h.index = null;
      a = a ? c.searchAsync(h) : c.search(h);
      h.resolve = l;
      h.index = c;
      a = a.result || a;
    } else {
      a = [];
    }
  }
  if (a && a.then) {
    const h = this;
    a = a.then(function(l) {
      h.C[0] = h.result = l.result || l;
      Xa(h);
    });
    e = [a];
    a = [];
    g = new Promise(function(l) {
      k = l;
    });
  }
  this.index = c || null;
  this.result = a || [];
  this.h = b;
  this.C = e || [];
  this.await = g || null;
  this.return = k || null;
  this.query = d || "";
  this.field = f || "";
}
w = X.prototype;
w.limit = function(a) {
  if (this.await) {
    const c = this;
    this.C.push(function() {
      c.limit(a);
      return c.result;
    });
  } else {
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
  }
  return this;
};
w.offset = function(a) {
  if (this.await) {
    const c = this;
    this.C.push(function() {
      c.offset(a);
      return c.result;
    });
  } else {
    if (this.result.length) {
      const c = [];
      for (let b = 0, e; b < this.result.length; b++) {
        if (e = this.result[b]) {
          e.length <= a ? a -= e.length : (c[b] = e.slice(a), a = 0);
        }
      }
      this.result = c;
    }
  }
  return this;
};
w.boost = function(a) {
  if (this.await) {
    const c = this;
    this.C.push(function() {
      c.boost(a);
      return c.result;
    });
  } else {
    this.h += a;
  }
  return this;
};
function Xa(a, c) {
  let b = a.result;
  var e = a.await;
  a.await = null;
  for (let d = 0, f; d < a.C.length; d++) {
    if (f = a.C[d]) {
      if (typeof f === "function") {
        b = f(), a.C[d] = b = b.result || b, d--;
      } else if (f.h) {
        b = f.h(), a.C[d] = b = b.result || b, d--;
      } else if (f.then) {
        return a.await = e;
      }
    }
  }
  e = a.return;
  a.C = [];
  a.return = null;
  c || e(b);
  return b;
}
w.resolve = function(a, c, b, e, d) {
  let f = this.await ? Xa(this, !0) : this.result;
  if (f.then) {
    const g = this;
    return f.then(function() {
      return g.resolve(a, c, b, e, d);
    });
  }
  f.length && (typeof a === "object" ? (e = a.highlight, b = !!e || a.enrich, c = a.offset, a = a.limit) : b = !!e || b, f = d ? b ? Ua.call(this.index, f) : f : Ta.call(this.index, f, a || 100, c, b));
  return this.finalize(f, e);
};
w.finalize = function(a, c) {
  if (a.then) {
    const e = this;
    return a.then(function(d) {
      return e.finalize(d, c);
    });
  }
  c && !this.query && console.warn('There was no query specified for highlighting. Please specify a query within the last resolver stage like { query: "...", resolve: true, highlight: ... }.');
  c && a.length && this.query && (a = db(this.query, a, this.index.index, this.field, c));
  const b = this.return;
  this.index = this.result = this.C = this.await = this.return = null;
  this.query = this.field = "";
  b && b(a);
  return a;
};
function ab(a, c, b, e, d, f, g) {
  const k = a.length;
  let h = [], l, n;
  l = I();
  for (let q = 0, u, r, t, m; q < c; q++) {
    for (let p = 0; p < k; p++) {
      if (t = a[p], q < t.length && (u = t[q])) {
        for (let x = 0; x < u.length; x++) {
          r = u[x];
          (n = l[r]) ? l[r]++ : (n = 0, l[r] = 1);
          m = h[n] || (h[n] = []);
          if (!g) {
            let v = q + (p || !d ? 0 : f || 0);
            m = m[v] || (m[v] = []);
          }
          m.push(r);
          if (g && b && n === k - 1 && m.length - e === b) {
            return e ? m.slice(e) : m;
          }
        }
      }
    }
  }
  if (a = h.length) {
    if (d) {
      h = h.length > 1 ? Za(h, b, e, g, f) : (h = h[0]) && b && h.length > b || e ? h.slice(e, b + e) : h;
    } else {
      if (a < k) {
        return [];
      }
      h = h[a - 1];
      if (b || e) {
        if (g) {
          if (h.length > b || e) {
            h = h.slice(e, b + e);
          }
        } else {
          d = [];
          for (let q = 0, u; q < h.length; q++) {
            if (u = h[q]) {
              if (e && u.length > e) {
                e -= u.length;
              } else {
                if (b && u.length > b || e) {
                  u = u.slice(e, b + e), b -= u.length, e && (e -= u.length);
                }
                d.push(u);
                if (!b) {
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
function Za(a, c, b, e, d) {
  const f = [], g = I();
  let k;
  var h = a.length;
  let l;
  if (e) {
    for (d = h - 1; d >= 0; d--) {
      if (l = (e = a[d]) && e.length) {
        for (h = 0; h < l; h++) {
          if (k = e[h], !g[k]) {
            if (g[k] = 1, b) {
              b--;
            } else {
              if (f.push(k), f.length === c) {
                return f;
              }
            }
          }
        }
      }
    }
  } else {
    for (let n = h - 1, q, u = 0; n >= 0; n--) {
      q = a[n];
      for (let r = 0; r < q.length; r++) {
        if (l = (e = q[r]) && e.length) {
          for (let t = 0; t < l; t++) {
            if (k = e[t], !g[k]) {
              if (g[k] = 1, b) {
                b--;
              } else {
                let m = (r + (n < h - 1 ? d || 0 : 0)) / (n + 1) | 0;
                (f[m] || (f[m] = [])).push(k);
                if (++u === c) {
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
function eb(a, c, b) {
  const e = I(), d = [];
  for (let f = 0, g; f < c.length; f++) {
    g = c[f];
    for (let k = 0; k < g.length; k++) {
      e[g[k]] = 1;
    }
  }
  if (b) {
    for (let f = 0, g; f < a.length; f++) {
      g = a[f], e[g] && (d.push(g), e[g] = 0);
    }
  } else {
    for (let f = 0, g, k; f < a.result.length; f++) {
      for (g = a.result[f], c = 0; c < g.length; c++) {
        k = g[c], e[k] && ((d[f] || (d[f] = [])).push(k), e[k] = 0);
      }
    }
  }
  return d;
}
;I();
Oa.prototype.search = function(a, c, b, e) {
  b || (!c && ba(a) ? (b = a, a = "") : ba(c) && (b = c, c = 0));
  let d = [];
  var f = [];
  let g;
  let k, h, l, n, q;
  let u = 0, r = !0, t;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    g = b.pluck;
    k = b.merge;
    l = b.boost;
    q = g || b.field || (q = b.index) && (q.index ? null : q);
    var m = this.tag && b.tag;
    h = b.suggest;
    r = b.resolve !== !1;
    n = b.cache;
    this.store && b.highlight && !r ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && b.enrich && !r && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    t = r && this.store && b.highlight;
    var p = !!t || r && this.store && b.enrich;
    c = b.limit || c;
    var x = b.offset || 0;
    c || (c = r ? 100 : 0);
    if (m && (!this.db || !e)) {
      m.constructor !== Array && (m = [m]);
      var v = [];
      for (let E = 0, z; E < m.length; E++) {
        z = m[E];
        if (N(z)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (z.field && z.tag) {
          var A = z.tag;
          if (A.constructor === Array) {
            for (var C = 0; C < A.length; C++) {
              v.push(z.field, A[C]);
            }
          } else {
            v.push(z.field, A);
          }
        } else {
          A = Object.keys(z);
          for (let D = 0, K, F; D < A.length; D++) {
            if (K = A[D], F = z[K], F.constructor === Array) {
              for (C = 0; C < F.length; C++) {
                v.push(K, F[C]);
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
      m = v;
      if (!a) {
        f = [];
        if (v.length) {
          for (m = 0; m < v.length; m += 2) {
            if (this.db) {
              e = this.index.get(v[m]);
              if (!e) {
                console.warn("Tag '" + v[m] + ":" + v[m + 1] + "' will be skipped because there is no field '" + v[m] + "'.");
                continue;
              }
              f.push(e = e.db.tag(v[m + 1], c, x, p));
            } else {
              e = fb.call(this, v[m], v[m + 1], c, x, p);
            }
            d.push(r ? {field:v[m], tag:v[m + 1], result:e} : [e]);
          }
        }
        if (f.length) {
          const E = this;
          return Promise.all(f).then(function(z) {
            for (let D = 0; D < z.length; D++) {
              r ? d[D].result = z[D] : d[D] = z[D];
            }
            return r ? d : new X(d.length > 1 ? ab(d, 1, 0, 0, h, l) : d[0], E);
          });
        }
        return r ? d : new X(d.length > 1 ? ab(d, 1, 0, 0, h, l) : d[0], this);
      }
    }
    if (!r && !g) {
      if (q = q || this.field) {
        N(q) ? g = q : (q.constructor === Array && q.length === 1 && (q = q[0]), g = q.field || q.index);
      }
      if (!g) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    q && q.constructor !== Array && (q = [q]);
  }
  q || (q = this.field);
  let G;
  v = (this.worker || this.db) && !e && [];
  for (let E = 0, z, D, K; E < q.length; E++) {
    D = q[E];
    if (this.db && this.tag && !this.B[E]) {
      continue;
    }
    let F;
    N(D) || (F = D, D = F.field, a = F.query || a, c = aa(F.limit, c), x = aa(F.offset, x), h = aa(F.suggest, h), t = r && this.store && aa(F.highlight, t), p = !!t || r && this.store && aa(F.enrich, p), n = aa(F.cache, n));
    if (e) {
      z = e[E];
    } else {
      A = F || b || {};
      C = A.enrich;
      var B = this.index.get(D);
      m && (this.db && (A.tag = m, G = B.db.support_tag_search, A.field = q), !G && C && (A.enrich = !1));
      z = n ? B.searchCache(a, c, A) : B.search(a, c, A);
      C && (A.enrich = C);
      if (v) {
        v[E] = z;
        continue;
      }
    }
    K = (z = z.result || z) && z.length;
    if (m && K) {
      A = [];
      C = 0;
      if (this.db && e) {
        if (!G) {
          for (B = q.length; B < e.length; B++) {
            let L = e[B];
            if (L && L.length) {
              C++, A.push(L);
            } else if (!h) {
              return r ? d : new X(d, this);
            }
          }
        }
      } else {
        for (let L = 0, O, P; L < m.length; L += 2) {
          O = this.tag.get(m[L]);
          if (!O) {
            if (console.warn("Tag '" + m[L] + ":" + m[L + 1] + "' will be skipped because there is no field '" + m[L] + "'."), h) {
              continue;
            } else {
              return r ? d : new X(d, this);
            }
          }
          if (P = (O = O && O.get(m[L + 1])) && O.length) {
            C++, A.push(O);
          } else if (!h) {
            return r ? d : new X(d, this);
          }
        }
      }
      if (C) {
        z = eb(z, A, r);
        K = z.length;
        if (!K && !h) {
          return r ? z : new X(z, this);
        }
        C--;
      }
    }
    if (K) {
      f[u] = D, d.push(z), u++;
    } else if (q.length === 1) {
      return r ? d : new X(d, this);
    }
  }
  if (v) {
    if (this.db && m && m.length && !G) {
      for (p = 0; p < m.length; p += 2) {
        f = this.index.get(m[p]);
        if (!f) {
          if (console.warn("Tag '" + m[p] + ":" + m[p + 1] + "' was not found because there is no field '" + m[p] + "'."), h) {
            continue;
          } else {
            return r ? d : new X(d, this);
          }
        }
        v.push(f.db.tag(m[p + 1], c, x, !1));
      }
    }
    const E = this;
    return Promise.all(v).then(function(z) {
      b && (b.resolve = r);
      z.length && (z = E.search(a, c, b, z));
      return z;
    });
  }
  if (!u) {
    return r ? d : new X(d, this);
  }
  if (g && (!p || !this.store)) {
    return d = d[0], r ? d : new X(d, this);
  }
  v = [];
  for (x = 0; x < f.length; x++) {
    m = d[x];
    p && m.length && typeof m[0].doc === "undefined" && (this.db ? v.push(m = this.index.get(this.field[0]).db.enrich(m)) : m = Ua.call(this, m));
    if (g) {
      return r ? t ? db(a, m, this.index, g, t) : m : new X(m, this);
    }
    d[x] = {field:f[x], result:m};
  }
  if (p && this.db && v.length) {
    const E = this;
    return Promise.all(v).then(function(z) {
      for (let D = 0; D < z.length; D++) {
        d[D].result = z[D];
      }
      t && (d = db(a, d, E.index, g, t));
      return k ? hb(d) : d;
    });
  }
  t && (d = db(a, d, this.index, g, t));
  return k ? hb(d) : d;
};
function hb(a) {
  const c = [], b = I(), e = I();
  for (let d = 0, f, g, k, h, l, n, q; d < a.length; d++) {
    f = a[d];
    g = f.field;
    k = f.result;
    for (let u = 0; u < k.length; u++) {
      if (l = k[u], typeof l !== "object" ? l = {id:h = l} : h = l.id, (n = b[h]) ? n.push(g) : (l.field = b[h] = [g], c.push(l)), q = l.highlight) {
        n = e[h], n || (e[h] = n = {}, l.highlight = n), n[g] = q;
      }
    }
  }
  return c;
}
function fb(a, c, b, e, d) {
  a = this.tag.get(a);
  if (!a) {
    return [];
  }
  a = a.get(c);
  if (!a) {
    return [];
  }
  c = a.length - e;
  if (c > 0) {
    if (b && c > b || e) {
      a = a.slice(e, e + b);
    }
    d && (a = Ua.call(this, a));
  }
  return a;
}
function Ua(a) {
  if (!this || !this.store) {
    return a;
  }
  if (this.db) {
    return this.index.get(this.field[0]).db.enrich(a);
  }
  const c = Array(a.length);
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c[b] = {id:e, doc:this.store.get(e)};
  }
  return c;
}
;function Oa(a) {
  if (!this || this.constructor !== Oa) {
    return new Oa(a);
  }
  const c = a.document || a.doc || a;
  let b, e;
  this.B = [];
  this.field = [];
  this.D = [];
  this.key = (b = c.key || c.id) && ib(b, this.D) || "id";
  (e = a.keystore || 0) && (this.keystore = e);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? e ? new R(e) : new Set() : e ? new Q(e) : new Map();
  this.h = (b = c.store || null) && b && b !== !0 && [];
  this.store = b ? e ? new Q(e) : new Map() : null;
  this.cache = (b = a.cache || null) && new oa(b);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = jb.call(this, a, c);
  this.tag = null;
  if (b = c.tag) {
    if (typeof b === "string" && (b = [b]), b.length) {
      this.tag = new Map();
      this.A = [];
      this.F = [];
      for (let d = 0, f, g; d < b.length; d++) {
        f = b[d];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.A[d] = f.custom : (this.A[d] = ib(g, this.D), f.filter && (typeof this.A[d] === "string" && (this.A[d] = new String(this.A[d])), this.A[d].G = f.filter));
        this.F[d] = g;
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
w = Oa.prototype;
w.mount = function(a) {
  if (this.worker) {
    throw Error("You can't use Worker-Indexes on a persistent model. That would be useless, since each of the persistent model acts like Worker-Index by default (Master/Slave).");
  }
  let c = this.field;
  if (this.tag) {
    for (let f = 0, g; f < this.F.length; f++) {
      g = this.F[f];
      var b = void 0;
      this.index.set(g, b = new T({}, this.reg));
      c === this.field && (c = c.slice(0));
      c.push(g);
      b.tag = this.tag.get(g);
    }
  }
  b = [];
  const e = {db:a.db, type:a.type, fastupdate:a.fastupdate};
  for (let f = 0, g, k; f < c.length; f++) {
    e.field = k = c[f];
    g = this.index.get(k);
    const h = new a.constructor(a.id, e);
    h.id = a.id;
    b[f] = h.mount(g);
    g.document = !0;
    f ? g.bypass = !0 : g.store = this.store;
  }
  const d = this;
  return this.db = Promise.all(b).then(function() {
    d.db = !0;
  });
};
w.commit = async function(a, c) {
  const b = [];
  for (const e of this.index.values()) {
    b.push(e.commit(a, c));
  }
  await Promise.all(b);
  this.reg.clear();
};
w.destroy = function() {
  const a = [];
  for (const c of this.index.values()) {
    a.push(c.destroy());
  }
  return Promise.all(a);
};
function jb(a, c) {
  const b = new Map();
  let e = c.index || c.field || c;
  N(e) && (e = [e]);
  for (let f = 0, g, k; f < e.length; f++) {
    g = e[f];
    N(g) || (k = g, g = g.field);
    k = ba(k) ? Object.assign({}, a, k) : a;
    if (this.worker) {
      var d = void 0;
      d = (d = k.encoder) && d.encode ? d : new la(typeof d === "string" ? xa[d] : d || {});
      d = new Ma(k, d);
      b.set(g, d);
    }
    this.worker || b.set(g, new T(k, this.reg));
    k.custom ? this.B[f] = k.custom : (this.B[f] = ib(g, this.D), k.filter && (typeof this.B[f] === "string" && (this.B[f] = new String(this.B[f])), this.B[f].G = k.filter));
    this.field[f] = g;
  }
  if (this.h) {
    a = c.store;
    N(a) && (a = [a]);
    for (let f = 0, g, k; f < a.length; f++) {
      g = a[f], k = g.field || g, g.custom ? (this.h[f] = g.custom, g.custom.O = k) : (this.h[f] = ib(k, this.D), g.filter && (typeof this.h[f] === "string" && (this.h[f] = new String(this.h[f])), this.h[f].G = g.filter));
    }
  }
  return b;
}
function ib(a, c) {
  const b = a.split(":");
  let e = 0;
  for (let d = 0; d < b.length; d++) {
    a = b[d], a[a.length - 1] === "]" && (a = a.substring(0, a.length - 2)) && (c[e] = !0), a && (b[e++] = a);
  }
  e < b.length && (b.length = e);
  return e > 1 ? b : b[0];
}
w.append = function(a, c) {
  return this.add(a, c, !0);
};
w.update = function(a, c) {
  return this.remove(a).add(a, c);
};
w.remove = function(a) {
  ba(a) && (a = da(a, this.key));
  for (var c of this.index.values()) {
    c.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (let b of this.tag.values()) {
        for (let e of b) {
          c = e[0];
          const d = e[1], f = d.indexOf(a);
          f > -1 && (d.length > 1 ? d.splice(f, 1) : b.delete(c));
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
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(c) {
    return c[0] && c[0].doc || null;
  }) : this.store.get(a) || null;
};
w.set = function(a, c) {
  typeof a === "object" && (c = a, a = da(c, this.key));
  this.store.set(a, c);
  return this;
};
w.searchCache = na;
w.export = kb;
w.import = lb;
Ga(Oa.prototype);
function mb(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function nb(a, c) {
  c || (c = new Map());
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c.set(e[0], e[1]);
  }
  return c;
}
function ob(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], mb(d[1])[0]]), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function pb(a, c) {
  c || (c = new Map());
  for (let b = 0, e, d; b < a.length; b++) {
    e = a[b], d = c.get(e[0]), c.set(e[0], nb(e[1], d));
  }
  return c;
}
function qb(a) {
  let c = [], b = [];
  for (const e of a.keys()) {
    b.push(e), b.length === 250000 && (c.push(b), b = []);
  }
  b.length && c.push(b);
  return c;
}
function rb(a, c) {
  c || (c = new Set());
  for (let b = 0; b < a.length; b++) {
    c.add(a[b]);
  }
  return c;
}
function sb(a, c, b, e, d, f, g = 0) {
  const k = e && e.constructor === Array;
  var h = k ? e.shift() : e;
  if (!h) {
    return this.export(a, c, d, f + 1);
  }
  if ((h = a((c ? c + "." : "") + (g + 1) + "." + b, JSON.stringify(h))) && h.then) {
    const l = this;
    return h.then(function() {
      return sb.call(l, a, c, b, k ? e : null, d, f, g + 1);
    });
  }
  return sb.call(this, a, c, b, k ? e : null, d, f, g + 1);
}
function kb(a, c, b = 0, e = 0) {
  if (b < this.field.length) {
    const g = this.field[b];
    if ((c = this.index.get(g).export(a, g, b, e = 1)) && c.then) {
      const k = this;
      return c.then(function() {
        return k.export(a, g, b + 1);
      });
    }
    return this.export(a, g, b + 1);
  }
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = qb(this.reg);
      c = null;
      break;
    case 1:
      d = "tag";
      f = this.tag && ob(this.tag, this.reg.size);
      c = null;
      break;
    case 2:
      d = "doc";
      f = this.store && mb(this.store);
      c = null;
      break;
    default:
      return;
  }
  return sb.call(this, a, c, d, f || null, b, e);
}
function lb(a, c) {
  var b = a.split(".");
  b[b.length - 1] === "json" && b.pop();
  const e = b.length > 2 ? b[0] : "";
  b = b.length > 2 ? b[2] : b[1];
  if (this.worker && e) {
    return this.index.get(e).import(a);
  }
  if (c) {
    typeof c === "string" && (c = JSON.parse(c));
    if (e) {
      return this.index.get(e).import(b, c);
    }
    switch(b) {
      case "reg":
        this.fastupdate = !1;
        this.reg = rb(c, this.reg);
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
        this.tag = pb(c, this.tag);
        break;
      case "doc":
        this.store = nb(c, this.store);
    }
  }
}
function tb(a, c) {
  let b = "";
  for (const e of a.entries()) {
    a = e[0];
    const d = e[1];
    let f = "";
    for (let g = 0, k; g < d.length; g++) {
      k = d[g] || [""];
      let h = "";
      for (let l = 0; l < k.length; l++) {
        h += (h ? "," : "") + (c === "string" ? '"' + k[l] + '"' : k[l]);
      }
      h = "[" + h + "]";
      f += (f ? "," : "") + h;
    }
    f = '["' + a + '",[' + f + "]]";
    b += (b ? "," : "") + f;
  }
  return b;
}
;T.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let e = 0, d, f; e < b.length; e++) {
        if ((d = b[e]) && (f = d.length)) {
          if (d[f - 1] === a) {
            d.pop();
          } else {
            const g = d.indexOf(a);
            g >= 0 && d.splice(g, 1);
          }
        }
      }
    } else {
      ub(this.map, a), this.depth && ub(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.M && vb(this));
  this.cache && this.cache.remove(a);
  return this;
};
function ub(a, c) {
  let b = 0;
  var e = typeof c === "undefined";
  if (a.constructor === Array) {
    for (let d = 0, f, g, k; d < a.length; d++) {
      if ((f = a[d]) && f.length) {
        if (e) {
          return 1;
        }
        g = f.indexOf(c);
        if (g >= 0) {
          if (f.length > 1) {
            return f.splice(g, 1), 1;
          }
          delete a[d];
          if (b) {
            return 1;
          }
          k = 1;
        } else {
          if (k) {
            return 1;
          }
          b++;
        }
      }
    }
  } else {
    for (let d of a.entries()) {
      e = d[0], ub(d[1], c) ? b++ : a.delete(e);
    }
  }
  return b;
}
;const wb = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
T.prototype.add = function(a, c, b, e) {
  if (c && (a || a === 0)) {
    if (!e && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    e = this.depth;
    c = this.encoder.encode(c, !e);
    const l = c.length;
    if (l) {
      const n = I(), q = I(), u = this.resolution;
      for (let r = 0; r < l; r++) {
        let t = c[this.rtl ? l - 1 - r : r];
        var d = t.length;
        if (d && (e || !q[t])) {
          var f = this.score ? this.score(c, t, r, null, 0) : xb(u, l, r), g = "";
          switch(this.tokenize) {
            case "tolerant":
              Y(this, q, t, f, a, b);
              if (d > 2) {
                for (let m = 1, p, x, v, A; m < d - 1; m++) {
                  p = t.charAt(m), x = t.charAt(m + 1), v = t.substring(0, m) + x, A = t.substring(m + 2), g = v + p + A, q[g] || Y(this, q, g, f, a, b), g = v + A, q[g] || Y(this, q, g, f, a, b);
                }
              }
              break;
            case "full":
              if (d > 2) {
                for (let m = 0, p; m < d; m++) {
                  for (f = d; f > m; f--) {
                    if (g = t.substring(m, f), !q[g]) {
                      p = this.rtl ? d - 1 - m : m;
                      var k = this.score ? this.score(c, t, r, g, p) : xb(u, l, r, d, p);
                      Y(this, q, g, k, a, b);
                    }
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (d > 1) {
                for (k = d - 1; k > 0; k--) {
                  if (g = t[this.rtl ? d - 1 - k : k] + g, !q[g]) {
                    var h = this.score ? this.score(c, t, r, g, k) : xb(u, l, r, d, k);
                    Y(this, q, g, h, a, b);
                  }
                }
                g = "";
              }
            case "forward":
              if (d > 1) {
                for (k = 0; k < d; k++) {
                  g += t[this.rtl ? d - 1 - k : k], q[g] || Y(this, q, g, f, a, b);
                }
                break;
              }
            default:
              if (Y(this, q, t, f, a, b), e && l > 1 && r < l - 1) {
                for (d = I(), g = this.N, f = t, k = Math.min(e + 1, this.rtl ? r + 1 : l - r), d[f] = 1, h = 1; h < k; h++) {
                  if ((t = c[this.rtl ? l - 1 - r - h : r + h]) && !d[t]) {
                    d[t] = 1;
                    const m = this.score ? this.score(c, f, r, t, h - 1) : xb(g + (l / 2 > g ? 0 : 1), l, r, k - 1, h - 1), p = this.bidirectional && t > f;
                    Y(this, n, p ? f : t, m, a, b, p ? t : f);
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
  this.db && (c || this.commit_task.push({del:a}), this.M && vb(this));
  return this;
};
function Y(a, c, b, e, d, f, g) {
  let k = g ? a.ctx : a.map, h;
  if (!c[b] || g && !(h = c[b])[g]) {
    if (g ? (c = h || (c[b] = I()), c[g] = 1, (h = k.get(g)) ? k = h : k.set(g, k = new Map())) : c[b] = 1, (h = k.get(b)) ? k = h : k.set(b, k = h = []), k = k[e] || (k[e] = []), !f || !k.includes(d)) {
      if (k.length === 2 ** 31 - 1) {
        c = new Ba(k);
        if (a.fastupdate) {
          for (let l of a.reg.values()) {
            l.includes(k) && (l[l.indexOf(k)] = c);
          }
        }
        h[e] = k = c;
      }
      k.push(d);
      a.fastupdate && ((e = a.reg.get(d)) ? e.push(k) : a.reg.set(d, [k]));
    }
  }
}
function xb(a, c, b, e, d) {
  return b && a > 1 ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;T.prototype.search = function(a, c, b) {
  b || (c || typeof a !== "object" ? typeof c === "object" && (b = c, c = 0) : (b = a, a = ""));
  if (b && b.cache) {
    return b.cache = !1, a = this.searchCache(a, c, b), b.cache = !0, a;
  }
  let e = [], d, f, g, k = 0, h, l, n, q, u;
  b && (a = b.query || a, c = b.limit || c, k = b.offset || 0, f = b.context, g = b.suggest, u = (h = b.resolve) && b.enrich, n = b.boost, q = b.resolution, l = this.db && b.tag);
  typeof h === "undefined" && (h = this.resolve);
  f = this.depth && f !== !1;
  let r = this.encoder.encode(a, !f);
  d = r.length;
  c = c || (h ? 100 : 0);
  if (d === 1) {
    return yb.call(this, r[0], "", c, k, h, u, l);
  }
  if (d === 2 && f && !g) {
    return yb.call(this, r[1], r[0], c, k, h, u, l);
  }
  let t = I(), m = 0, p;
  f && (p = r[0], m = 1);
  q || q === 0 || (q = p ? this.N : this.resolution);
  if (this.db) {
    if (this.db.search && (b = this.db.search(this, r, c, k, g, h, u, l), b !== !1)) {
      return b;
    }
    const x = this;
    return async function() {
      for (let v, A; m < d; m++) {
        if ((A = r[m]) && !t[A]) {
          t[A] = 1;
          v = await zb(x, A, p, 0, 0, !1, !1);
          if (v = Ab(v, e, g, q)) {
            e = v;
            break;
          }
          p && (g && v && e.length || (p = A));
        }
        g && p && m === d - 1 && !e.length && (q = x.resolution, p = "", m = -1, t = I());
      }
      return Bb(e, q, c, k, g, n, h);
    }();
  }
  for (let x, v; m < d; m++) {
    if ((v = r[m]) && !t[v]) {
      t[v] = 1;
      x = zb(this, v, p, 0, 0, !1, !1);
      if (x = Ab(x, e, g, q)) {
        e = x;
        break;
      }
      p && (g && x && e.length || (p = v));
    }
    g && p && m === d - 1 && !e.length && (q = this.resolution, p = "", m = -1, t = I());
  }
  return Bb(e, q, c, k, g, n, h);
};
function Bb(a, c, b, e, d, f, g) {
  let k = a.length, h = a;
  if (k > 1) {
    h = ab(a, c, b, e, d, f, g);
  } else if (k === 1) {
    return g ? Ta.call(null, a[0], b, e) : new X(a[0], this);
  }
  return g ? h : new X(h, this);
}
function yb(a, c, b, e, d, f, g) {
  a = zb(this, a, c, b, e, d, f, g);
  return this.db ? a.then(function(k) {
    return d ? k || [] : new X(k, this);
  }) : a && a.length ? d ? Ta.call(this, a, b, e) : new X(a, this) : d ? [] : new X([], this);
}
function Ab(a, c, b, e) {
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
function zb(a, c, b, e, d, f, g, k) {
  let h;
  b && (h = a.bidirectional && c > b) && (h = b, b = c, c = h);
  if (a.db) {
    return a.db.get(c, b, e, d, f, g, k);
  }
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;function T(a, c) {
  if (!this || this.constructor !== T) {
    return new T(a);
  }
  if (a) {
    var b = N(a) ? a : a.preset;
    b && (wb[b] || console.warn("Preset not found: " + b), a = Object.assign({}, wb[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const e = b === !0 ? {depth:1} : b || {}, d = N(a.encoder) ? xa[a.encoder] : a.encode || a.encoder || {};
  this.encoder = d.encode ? d : typeof d === "object" ? new la(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && b !== "default" && b !== "exact" && b || "strict";
  this.depth = b === "strict" && e.depth || 0;
  this.bidirectional = e.bidirectional !== !1;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e && e.depth && this.tokenize !== "strict" && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (b = a.keystore || 0) && (this.keystore = b);
  this.map = b ? new Q(b) : new Map();
  this.ctx = b ? new Q(b) : new Map();
  this.reg = c || (this.fastupdate ? b ? new Q(b) : new Map() : b ? new R(b) : new Set());
  this.N = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (b = a.cache || null) && new oa(b);
  this.resolve = a.resolve !== !1;
  if (b = a.db) {
    this.db = this.mount(b);
  }
  this.M = a.commit !== !1;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
w = T.prototype;
w.mount = function(a) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return a.mount(this);
};
w.commit = function(a, c) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.commit(this, a, c);
};
w.destroy = function() {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.destroy();
};
function vb(a) {
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
w.append = function(a, c) {
  return this.add(a, c, !0);
};
w.contain = function(a) {
  return this.db ? this.db.has(a) : this.reg.has(a);
};
w.update = function(a, c) {
  const b = this, e = this.remove(a);
  return e && e.then ? e.then(() => b.add(a, c)) : this.add(a, c);
};
w.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  ub(this.map);
  this.depth && ub(this.ctx);
  return this;
};
w.searchCache = na;
w.export = function(a, c, b = 0, e = 0) {
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = qb(this.reg);
      break;
    case 1:
      d = "cfg";
      f = null;
      break;
    case 2:
      d = "map";
      f = mb(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      f = ob(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return sb.call(this, a, c, d, f, b, e);
};
w.import = function(a, c) {
  if (c) {
    switch(typeof c === "string" && (c = JSON.parse(c)), a = a.split("."), a[a.length - 1] === "json" && a.pop(), a.length === 3 && a.shift(), a = a.length > 1 ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = rb(c, this.reg);
        break;
      case "map":
        this.map = nb(c, this.map);
        break;
      case "ctx":
        this.ctx = pb(c, this.ctx);
    }
  }
};
w.serialize = function(a = !0) {
  let c = "", b = "", e = "";
  if (this.reg.size) {
    let f;
    for (var d of this.reg.keys()) {
      f || (f = typeof d), c += (c ? "," : "") + (f === "string" ? '"' + d + '"' : d);
    }
    c = "index.reg=new Set([" + c + "]);";
    b = tb(this.map, f);
    b = "index.map=new Map([" + b + "]);";
    for (const g of this.ctx.entries()) {
      d = g[0];
      let k = tb(g[1], f);
      k = "new Map([" + k + "])";
      k = '["' + d + '",' + k + "]";
      e += (e ? "," : "") + k;
    }
    e = "index.ctx=new Map([" + e + "]);";
  }
  return a ? "function inject(index){" + c + b + e + "}" : c + b + e;
};
Ga(T.prototype);
const Cb = typeof window !== "undefined" && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), Db = ["map", "ctx", "tag", "reg", "cfg"], Eb = I();
function Fb(a, c = {}) {
  if (!this || this.constructor !== Fb) {
    return new Fb(a, c);
  }
  typeof a === "object" && (c = a, a = a.name);
  a || console.info("Default storage space was used, because a name was not passed.");
  this.id = "flexsearch" + (a ? ":" + a.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "");
  this.field = c.field ? c.field.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "";
  this.type = c.type;
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
  const c = Cb.open(a.id, 1);
  c.onupgradeneeded = function() {
    const b = a.db = this.result;
    for (let e = 0, d; e < Db.length; e++) {
      d = Db[e];
      for (let f = 0, g; f < Eb[a.id].length; f++) {
        g = Eb[a.id][f], b.objectStoreNames.contains(d + (d !== "reg" ? g ? ":" + g : "" : "")) || b.createObjectStore(d + (d !== "reg" ? g ? ":" + g : "" : ""));
      }
    }
  };
  return a.db = Z(c, function(b) {
    a.db = b;
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
  for (let b = 0, e; b < Db.length; b++) {
    e = Db[b];
    for (let d = 0, f; d < Eb[this.id].length; d++) {
      f = Eb[this.id][d], a.push(e + (e !== "reg" ? f ? ":" + f : "" : ""));
    }
  }
  const c = this.db.transaction(a, "readwrite");
  for (let b = 0; b < a.length; b++) {
    c.objectStore(a[b]).clear();
  }
  return Z(c);
};
w.get = function(a, c, b = 0, e = 0, d = !0, f = !1) {
  a = this.db.transaction((c ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((c ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(c ? c + ":" + a : a);
  const g = this;
  return Z(a).then(function(k) {
    let h = [];
    if (!k || !k.length) {
      return h;
    }
    if (d) {
      if (!b && !e && k.length === 1) {
        return k[0];
      }
      for (let l = 0, n; l < k.length; l++) {
        if ((n = k[l]) && n.length) {
          if (e >= n.length) {
            e -= n.length;
            continue;
          }
          const q = b ? e + Math.min(n.length - e, b) : n.length;
          for (let u = e; u < q; u++) {
            h.push(n[u]);
          }
          e = 0;
          if (h.length === b) {
            break;
          }
        }
      }
      return f ? g.enrich(h) : h;
    }
    return k;
  });
};
w.tag = function(a, c = 0, b = 0, e = !1) {
  a = this.db.transaction("tag" + (this.field ? ":" + this.field : ""), "readonly").objectStore("tag" + (this.field ? ":" + this.field : "")).get(a);
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
w.enrich = function(a) {
  typeof a !== "object" && (a = [a]);
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
w.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return Z(a).then(function(c) {
    return !!c;
  });
};
w.search = null;
w.info = function() {
};
w.transaction = function(a, c, b) {
  a += a !== "reg" ? this.field ? ":" + this.field : "" : "";
  let e = this.h[a + ":" + c];
  if (e) {
    return b.call(this, e);
  }
  let d = this.db.transaction(a, c);
  this.h[a + ":" + c] = e = d.objectStore(a);
  const f = b.call(this, e);
  this.h[a + ":" + c] = null;
  return Z(d).finally(function() {
    d = e = null;
    return f;
  });
};
w.commit = async function(a, c, b) {
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
        e[d] = f.del;
      }
    }
    c || (b || (e = e.concat(ca(a.reg))), e.length && await this.remove(e));
  }
  a.reg.size && (await this.transaction("map", "readwrite", function(e) {
    for (const d of a.map) {
      const f = d[0], g = d[1];
      g.length && (c ? e.put(g, f) : e.get(f).onsuccess = function() {
        let k = this.result;
        var h;
        if (k && k.length) {
          const l = Math.max(k.length, g.length);
          for (let n = 0, q, u; n < l; n++) {
            if ((u = g[n]) && u.length) {
              if ((q = k[n]) && q.length) {
                for (h = 0; h < u.length; h++) {
                  q.push(u[h]);
                }
              } else {
                k[n] = u;
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
        l.length && (c ? e.put(l, f + ":" + h) : e.get(f + ":" + h).onsuccess = function() {
          let n = this.result;
          var q;
          if (n && n.length) {
            const u = Math.max(n.length, l.length);
            for (let r = 0, t, m; r < u; r++) {
              if ((m = l[r]) && m.length) {
                if ((t = n[r]) && t.length) {
                  for (q = 0; q < m.length; q++) {
                    t.push(m[q]);
                  }
                } else {
                  n[r] = m;
                }
                q = 1;
              }
            }
          } else {
            n = l, q = 1;
          }
          q && e.put(n, f + ":" + h);
        });
      }
    }
  }), a.store ? await this.transaction("reg", "readwrite", function(e) {
    for (const d of a.store) {
      const f = d[0], g = d[1];
      e.put(typeof g === "object" ? JSON.stringify(g) : 1, f);
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
function Gb(a, c, b) {
  const e = a.value;
  let d, f = 0;
  for (let g = 0, k; g < e.length; g++) {
    if (k = b ? e : e[g]) {
      for (let h = 0, l, n; h < c.length; h++) {
        if (n = c[h], l = k.indexOf(n), l >= 0) {
          if (d = 1, k.length > 1) {
            k.splice(l, 1);
          } else {
            e[g] = [];
            break;
          }
        }
      }
      f += k.length;
    }
    if (b) {
      break;
    }
  }
  f ? d && a.update(e) : a.delete();
  a.continue();
}
w.remove = function(a) {
  typeof a !== "object" && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(c) {
    c.openCursor().onsuccess = function() {
      const b = this.result;
      b && Gb(b, a);
    };
  }), this.transaction("ctx", "readwrite", function(c) {
    c.openCursor().onsuccess = function() {
      const b = this.result;
      b && Gb(b, a);
    };
  }), this.transaction("tag", "readwrite", function(c) {
    c.openCursor().onsuccess = function() {
      const b = this.result;
      b && Gb(b, a, !0);
    };
  }), this.transaction("reg", "readwrite", function(c) {
    for (let b = 0; b < a.length; b++) {
      c.delete(a[b]);
    }
  })]);
};
function Z(a, c) {
  return new Promise((b, e) => {
    a.onsuccess = a.oncomplete = function() {
      c && c(this.result);
      c = null;
      b(this.result);
    };
    a.onerror = a.onblocked = e;
    a = null;
  });
}
;const Hb = {Index:T, Charset:xa, Encoder:la, Document:Oa, Worker:Ma, Resolver:X, IndexedDB:Fb, Language:{}}, Ib = typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : self;
let Jb;
(Jb = Ib.define) && Jb.amd ? Jb([], function() {
  return Hb;
}) : typeof Ib.exports === "object" ? Ib.exports = Hb : Ib.FlexSearch = Hb;
}(this||self));
