/**!
 * FlexSearch.js v0.8.155 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var x;
function A(a, c, b) {
  const e = typeof b, d = typeof a;
  if ("undefined" !== e) {
    if ("undefined" !== d) {
      if (b) {
        if ("function" === d && e === d) {
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
  return "undefined" === d ? c : a;
}
function B() {
  return Object.create(null);
}
function C(a) {
  return "string" === typeof a;
}
function G(a) {
  return "object" === typeof a;
}
function H(a, c) {
  if (C(c)) {
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
;const ba = /[^\p{L}\p{N}]+/u, ca = /(\d{3})/g, da = /(\D)(\d{3})/g, ea = /(\d{3})(\D)/g, fa = /[\u0300-\u036f]/g;
function I(a = {}) {
  if (!this || this.constructor !== I) {
    return new I(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
x = I.prototype;
x.assign = function(a) {
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
      this.split = A(this.split, ba);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = A(a.numeric, A(this.numeric, !0));
  }
  this.prepare = A(a.prepare, null, this.prepare);
  this.finalize = A(a.finalize, null, this.finalize);
  b = a.filter;
  this.filter = "function" === typeof b ? b : A(b && new Set(b), null, this.filter);
  this.dedupe = A(a.dedupe, !0, this.dedupe);
  this.matcher = A((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = A((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = A((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = A(a.replacer, null, this.replacer);
  this.minlength = A(a.minlength, 1, this.minlength);
  this.maxlength = A(a.maxlength, 1024, this.maxlength);
  this.rtl = A(a.rtl, !1, this.rtl);
  if (this.cache = b = A(a.cache, !0, this.cache)) {
    this.H = null, this.R = "number" === typeof b ? b : 2e5, this.F = new Map(), this.G = new Map(), this.L = this.K = 128;
  }
  this.h = "";
  this.M = null;
  this.C = "";
  this.N = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.h += (this.h ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.C += (this.C ? "|" : "") + d;
    }
  }
  return this;
};
x.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.C += (this.C ? "|" : "") + a;
  this.N = null;
  this.cache && J(this);
  return this;
};
x.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && J(this);
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
  this.cache && J(this);
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
  this.cache && J(this);
  return this;
};
x.addReplacer = function(a, c) {
  if ("string" === typeof a) {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && J(this);
  return this;
};
x.encode = function(a) {
  if (this.cache && a.length <= this.K) {
    if (this.H) {
      if (this.F.has(a)) {
        return this.F.get(a);
      }
    } else {
      this.H = setTimeout(J, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = fa ? a.normalize("NFKD").replace(fa, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(da, "$1 $2").replace(ea, "$1 $2").replace(ca, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let b = [], e = this.split || "" === this.split ? a.split(this.split) : a;
  for (let f = 0, g, k; f < e.length; f++) {
    if ((g = k = e[f]) && !(g.length < this.minlength || g.length > this.maxlength)) {
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
              this.H = setTimeout(J, 50, this);
            }
          }
          this.stemmer && 2 < g.length && (this.N || (this.N = new RegExp("(?!^)(" + this.C + ")$")), g = g.replace(this.N, h => this.stemmer.get(h)));
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
          this.cache && k.length <= this.L && (this.G.set(k, g), this.G.size > this.R && (this.G.clear(), this.L = this.L / 1.1 | 0));
          g && b.push(g);
        }
      }
    }
  }
  this.finalize && (b = this.finalize(b) || b);
  this.cache && a.length <= this.K && (this.F.set(a, b), this.F.size > this.R && (this.F.clear(), this.K = this.K / 1.1 | 0));
  return b;
};
function J(a) {
  a.H = null;
  a.F.clear();
  a.G.clear();
}
;let K, L;
async function ha(a) {
  a = a.data;
  var c = a.task;
  const b = a.id;
  let e = a.args;
  switch(c) {
    case "init":
      L = a.options || {};
      (c = a.factory) ? (Function("return " + c)()(self), K = new self.FlexSearch.Index(L), delete self.FlexSearch) : K = new M(L);
      postMessage({id:b});
      break;
    default:
      let d;
      if ("export" === c) {
        if (!L.export || "function" !== typeof L.export) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
        }
        e[1] ? (e[0] = L.export, e[2] = 0, e[3] = 1) : e = null;
      }
      if ("import" === c) {
        if (!L.import || "function" !== typeof L.import) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
        }
        e[0] && (a = await L.import.call(K, e[0]), K.import(e[0], a));
      } else {
        (d = e && K[c].apply(K, e)) && d.then && (d = await d);
      }
      postMessage("search" === c ? {id:b, msg:d} : {id:b});
  }
}
;function ia(a) {
  P.call(a, "add");
  P.call(a, "append");
  P.call(a, "search");
  P.call(a, "update");
  P.call(a, "remove");
}
let ja, ka, Q;
function la() {
  ja = Q = 0;
}
function P(a) {
  this[a + "Async"] = function() {
    const c = arguments;
    var b = c[c.length - 1];
    let e;
    "function" === typeof b && (e = b, delete c[c.length - 1]);
    ja ? Q || (Q = Date.now() - ka >= this.priority * this.priority * 3) : (ja = setTimeout(la, 0), ka = Date.now());
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
          d.h[++R] = function() {
            h(d);
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
  const e = "undefined" === typeof window, d = this, f = ma(b, e, a.worker);
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
ia(S.prototype);
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
function ma(a, c, b) {
  return c ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + ha.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof b ? b : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function na(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function oa(a, c) {
  c || (c = new Map());
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c.set(e[0], e[1]);
  }
  return c;
}
function pa(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], na(d[1])[0]]), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function qa(a, c) {
  c || (c = new Map());
  for (let b = 0, e, d; b < a.length; b++) {
    e = a[b], d = c.get(e[0]), c.set(e[0], oa(e[1], d));
  }
  return c;
}
function ra(a) {
  let c = [], b = [];
  for (const e of a.keys()) {
    b.push(e), 250000 === b.length && (c.push(b), b = []);
  }
  b.length && c.push(b);
  return c;
}
function sa(a, c) {
  c || (c = new Set());
  for (let b = 0; b < a.length; b++) {
    c.add(a[b]);
  }
  return c;
}
function ta(a, c, b, e, d, f, g = 0) {
  const k = e && e.constructor === Array;
  var h = k ? e.shift() : e;
  if (!h) {
    return this.export(a, c, d, f + 1);
  }
  if ((h = a((c ? c + "." : "") + (g + 1) + "." + b, JSON.stringify(h))) && h.then) {
    const l = this;
    return h.then(function() {
      return ta.call(l, a, c, b, k ? e : null, d, f, g + 1);
    });
  }
  return ta.call(this, a, c, b, k ? e : null, d, f, g + 1);
}
function ua(a, c) {
  let b = "";
  for (const e of a.entries()) {
    a = e[0];
    const d = e[1];
    let f = "";
    for (let g = 0, k; g < d.length; g++) {
      k = d[g] || [""];
      let h = "";
      for (let l = 0; l < k.length; l++) {
        h += (h ? "," : "") + ("string" === c ? '"' + k[l] + '"' : k[l]);
      }
      h = "[" + h + "]";
      f += (f ? "," : "") + h;
    }
    f = '["' + a + '",[' + f + "]]";
    b += (b ? "," : "") + f;
  }
  return b;
}
;U.prototype.add = function(a, c, b) {
  G(a) && (c = a, a = H(c, this.key));
  if (c && (a || 0 === a)) {
    if (!b && this.reg.has(a)) {
      return this.update(a, c);
    }
    for (let k = 0, h; k < this.field.length; k++) {
      h = this.D[k];
      var e = this.index.get(this.field[k]);
      if ("function" === typeof h) {
        var d = h(c);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = h.I, !d || d(c)) {
          h.constructor === String ? h = ["" + h] : C(h) && (h = [h]), va(c, h, this.J, 0, e, a, h[0], b);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.B.length; e++) {
        var f = this.B[e], g = this.T[e];
        d = this.tag.get(g);
        let k = B();
        if ("function" === typeof f) {
          if (f = f(c), !f) {
            continue;
          }
        } else {
          const h = f.I;
          if (h && !h(c)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = H(c, f);
        }
        if (d && f) {
          C(f) && (f = [f]);
          for (let h = 0, l, n; h < f.length; h++) {
            l = f[h], k[l] || (k[l] = 1, (g = d.get(l)) ? n = g : d.set(l, n = []), b && n.includes(a) || (n.push(a), this.fastupdate && ((g = this.reg.get(a)) ? g.push(n) : this.reg.set(a, [n]))));
          }
        } else {
          d || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!b || !this.store.has(a))) {
      let k;
      if (this.A) {
        k = B();
        for (let h = 0, l; h < this.A.length; h++) {
          l = this.A[h];
          if ((b = l.I) && !b(c)) {
            continue;
          }
          let n;
          if ("function" === typeof l) {
            n = l(c);
            if (!n) {
              continue;
            }
            l = [l.U];
          } else if (C(l) || l.constructor === String) {
            k[l] = c[l];
            continue;
          }
          wa(c, k, l, 0, l[0], n);
        }
      }
      this.store.set(a, k || c);
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
      c = c[d] || (c[d] = B()), d = b[++e], wa(a, c, b, e, d);
    }
  }
}
function va(a, c, b, e, d, f, g, k) {
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
          va(a, c, b, e, d, f, g, k);
        }
      } else {
        g = c[++e], va(a, c, b, e, d, f, g, k);
      }
    }
  }
}
;function xa(a, c, b, e, d) {
  const f = a.length;
  let g = [], k, h;
  k = B();
  for (let l = 0, n, m, r, p; l < c; l++) {
    for (let q = 0; q < f; q++) {
      if (r = a[q], l < r.length && (n = r[l])) {
        for (let t = 0; t < n.length; t++) {
          if (m = n[t], (h = k[m]) ? k[m]++ : (h = 0, k[m] = 1), p = g[h] || (g[h] = []), p.push(m), b && h === f - 1 && p.length - e === b) {
            return e ? p.slice(e) : p;
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
  const e = [], d = B();
  let f;
  var g = a.length;
  let k;
  for (let h = g - 1; 0 <= h; h--) {
    if (k = (g = a[h]) && g.length) {
      for (let l = 0; l < k; l++) {
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
  const b = B(), e = [];
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
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a, e ? V.call(this, a) : a;
  }
  let d = [];
  for (let f = 0, g, k; f < a.length; f++) {
    if ((g = a[f]) && (k = g.length)) {
      if (b) {
        if (b >= k) {
          b -= k;
          continue;
        }
        b < k && (g = c ? g.slice(b, b + c) : g.slice(b), k = g.length, b = 0);
      }
      k > c && (g = g.slice(0, c), k = c);
      if (!d.length && k >= c) {
        return e ? V.call(this, g) : g;
      }
      d.push(g);
      c -= k;
      if (!c) {
        break;
      }
    }
  }
  d = 1 < d.length ? [].concat.apply([], d) : d[0];
  return e ? V.call(this, d) : d;
}
;function Ba(a, c, b) {
  var e = b[0];
  if (e.then) {
    return Promise.all(b).then(function(n) {
      return a[c].apply(a, n);
    });
  }
  if (e[0] && e[0].index) {
    return a[c].apply(a, e);
  }
  e = [];
  let d = [], f = 0, g = 0, k, h, l;
  for (let n = 0, m; n < b.length; n++) {
    if (m = b[n]) {
      let r;
      if (m.constructor === W) {
        r = m.result;
      } else if (m.constructor === Array) {
        r = m;
      } else {
        if (f = m.limit || 0, g = m.offset || 0, l = m.suggest, h = m.resolve, k = m.enrich && h, m.index) {
          m.resolve = !1, m.enrich = !1, r = m.index.search(m).result, m.resolve = h, m.enrich = k;
        } else if (m.and) {
          r = a.and(m.and);
        } else if (m.or) {
          r = a.or(m.or);
        } else if (m.xor) {
          r = a.xor(m.xor);
        } else if (m.not) {
          r = a.not(m.not);
        } else {
          continue;
        }
      }
      if (r.then) {
        d.push(r);
      } else if (r.length) {
        e[n] = r;
      } else if (!l && ("and" === c || "xor" === c)) {
        e = [];
        break;
      }
    }
  }
  return {O:e, P:d, limit:f, offset:g, enrich:k, resolve:h, suggest:l};
}
;W.prototype.or = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f} = Ba(this, "or", arguments);
  return Ca.call(this, a, c, b, e, d, f);
};
function Ca(a, c, b, e, d, f) {
  if (c.length) {
    const g = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let h = 0, l; h < k.length; h++) {
        (l = k[h]).length && (a[h] = l);
      }
      return Ca.call(g, a, [], b, e, d, f);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = ya(a, b, e), e = 0));
  return f ? this.resolve(b, e, d) : this;
}
;W.prototype.and = function() {
  let a = this.result.length, c, b, e, d;
  if (!a) {
    const f = arguments[0];
    f && (a = !!f.suggest, d = f.resolve, c = f.limit, b = f.offset, e = f.enrich && d);
  }
  if (a) {
    const {O:f, P:g, limit:k, offset:h, enrich:l, resolve:n, suggest:m} = Ba(this, "and", arguments);
    return Da.call(this, f, g, k, h, l, n, m);
  }
  return d ? this.resolve(c, b, e) : this;
};
function Da(a, c, b, e, d, f, g) {
  if (c.length) {
    const k = this;
    return Promise.all(c).then(function(h) {
      a = [];
      for (let l = 0, n; l < h.length; l++) {
        (n = h[l]).length && (a[l] = n);
      }
      return Da.call(k, a, [], b, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (c = aa(a)) {
        return this.result = xa(a, c, b, e, g), f ? d ? V.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(b, e, d) : this;
}
;W.prototype.xor = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f, suggest:g} = Ba(this, "xor", arguments);
  return Ea.call(this, a, c, b, e, d, f, g);
};
function Ea(a, c, b, e, d, f, g) {
  if (c.length) {
    const k = this;
    return Promise.all(c).then(function(h) {
      a = [];
      for (let l = 0, n; l < h.length; l++) {
        (n = h[l]).length && (a[l] = n);
      }
      return Ea.call(k, a, [], b, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = Fa.call(this, a, b, e, f, this.h), f ? d ? V.call(this.index, this.result) : this.result : this;
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(b, e, d) : this;
}
function Fa(a, c, b, e, d) {
  const f = [], g = B();
  let k = 0;
  for (let h = 0, l; h < a.length; h++) {
    if (l = a[h]) {
      k < l.length && (k = l.length);
      for (let n = 0, m; n < l.length; n++) {
        if (m = l[n]) {
          for (let r = 0, p; r < m.length; r++) {
            p = m[r], g[p] = g[p] ? 2 : 1;
          }
        }
      }
    }
  }
  for (let h = 0, l, n = 0; h < k; h++) {
    for (let m = 0, r; m < a.length; m++) {
      if (r = a[m]) {
        if (l = r[h]) {
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
                  const t = h + (m ? d : 0);
                  f[t] || (f[t] = []);
                  f[t].push(q);
                  if (++n === c) {
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
;W.prototype.not = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f, suggest:g} = Ba(this, "not", arguments);
  return Ga.call(this, a, c, b, e, d, f, g);
};
function Ga(a, c, b, e, d, f, g) {
  if (c.length) {
    const k = this;
    return Promise.all(c).then(function(h) {
      a = [];
      for (let l = 0, n; l < h.length; l++) {
        (n = h[l]).length && (a[l] = n);
      }
      return Ga.call(k, a, [], b, e, d, f, g);
    });
  }
  if (a.length && this.result.length) {
    this.result = Ha.call(this, a, b, e, f);
  } else if (f) {
    return this.resolve(b, e, d);
  }
  return f ? d ? V.call(this.index, this.result) : this.result : this;
}
function Ha(a, c, b, e) {
  const d = [];
  a = new Set(a.flat().flat());
  for (let f = 0, g, k = 0; f < this.result.length; f++) {
    if (g = this.result[f]) {
      for (let h = 0, l; h < g.length; h++) {
        if (l = g[h], !a.has(l)) {
          if (b) {
            b--;
          } else {
            if (e) {
              if (d.push(l), d.length === c) {
                return d;
              }
            } else {
              if (d[f] || (d[f] = []), d[f].push(l), ++k === c) {
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
;function W(a) {
  if (!this || this.constructor !== W) {
    return new W(a);
  }
  if (a && a.index) {
    return a.resolve = !1, this.index = a.index, this.h = a.boost || 0, this.result = a.index.search(a).result, this;
  }
  this.index = null;
  this.result = a || [];
  this.h = 0;
}
W.prototype.limit = function(a) {
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
W.prototype.offset = function(a) {
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
W.prototype.boost = function(a) {
  this.h += a;
  return this;
};
W.prototype.resolve = function(a, c, b) {
  const e = this.result, d = this.index;
  this.result = this.index = null;
  return e.length ? ("object" === typeof a && (b = a.enrich, c = a.offset, a = a.limit), Aa.call(d, e, a || 100, c, b)) : e;
};
B();
U.prototype.search = function(a, c, b, e) {
  b || (!c && G(a) ? (b = a, a = "") : G(c) && (b = c, c = 0));
  let d = [];
  var f = [];
  let g;
  let k, h, l;
  let n = 0, m = !0, r;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    var p = b.pluck;
    var q = b.merge;
    h = p || b.field || (h = b.index) && (h.index ? null : h);
    l = this.tag && b.tag;
    k = b.suggest;
    m = !0;
    this.store && b.enrich && !m && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    r = (g = this.store && b.enrich && m) && b.highlight;
    c = b.limit || c;
    var t = b.offset || 0;
    c || (c = 100);
    if (l) {
      l.constructor !== Array && (l = [l]);
      var u = [];
      for (let z = 0, v; z < l.length; z++) {
        v = l[z];
        if (C(v)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (v.field && v.tag) {
          var w = v.tag;
          if (w.constructor === Array) {
            for (var y = 0; y < w.length; y++) {
              u.push(v.field, w[y]);
            }
          } else {
            u.push(v.field, w);
          }
        } else {
          w = Object.keys(v);
          for (let D = 0, E, F; D < w.length; D++) {
            if (E = w[D], F = v[E], F.constructor === Array) {
              for (y = 0; y < F.length; y++) {
                u.push(E, F[y]);
              }
            } else {
              u.push(E, F);
            }
          }
        }
      }
      if (!u.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      l = u;
      if (!a) {
        f = [];
        if (u.length) {
          for (p = 0; p < u.length; p += 2) {
            q = Ia.call(this, u[p], u[p + 1], c, t, g), d.push({field:u[p], tag:u[p + 1], result:q});
          }
        }
        return f.length ? Promise.all(f).then(function(z) {
          for (let v = 0; v < z.length; v++) {
            d[v].result = z[v];
          }
          return d;
        }) : d;
      }
    }
    h && h.constructor !== Array && (h = [h]);
  }
  h || (h = this.field);
  u = !e && (this.worker || this.db) && [];
  for (let z = 0, v, D, E; z < h.length; z++) {
    D = h[z];
    let F;
    C(D) || (F = D, D = F.field, a = F.query || a, c = F.limit || c, t = F.offset || t, k = F.suggest || k, g = this.store && (F.enrich || g));
    if (e) {
      v = e[z];
    } else {
      if (w = F || b, y = this.index.get(D), l && (w.enrich = !1), u) {
        u[z] = y.search(a, c, w);
        w && g && (w.enrich = g);
        continue;
      } else {
        v = y.search(a, c, w), w && g && (w.enrich = g);
      }
    }
    E = v && (m ? v.length : v.result.length);
    if (l && E) {
      w = [];
      y = 0;
      for (let N = 0, O, Za; N < l.length; N += 2) {
        O = this.tag.get(l[N]);
        if (!O) {
          if (console.warn("Tag '" + l[N] + ":" + l[N + 1] + "' will be skipped because there is no field '" + l[N] + "'."), k) {
            continue;
          } else {
            return m ? d : new W(d);
          }
        }
        if (Za = (O = O && O.get(l[N + 1])) && O.length) {
          y++, w.push(O);
        } else if (!k) {
          return m ? d : new W(d);
        }
      }
      if (y) {
        v = za(v, w);
        E = v.length;
        if (!E && !k) {
          return m ? v : new W(v);
        }
        y--;
      }
    }
    if (E) {
      f[n] = D, d.push(v), n++;
    } else if (1 === h.length) {
      return m ? d : new W(d);
    }
  }
  if (u) {
    const z = this;
    return Promise.all(u).then(function(v) {
      return v.length ? z.search(a, c, b, v) : v;
    });
  }
  if (!n) {
    return m ? d : new W(d);
  }
  if (p && (!g || !this.store)) {
    return d[0];
  }
  u = [];
  for (t = 0; t < f.length; t++) {
    e = d[t];
    g && e.length && "undefined" === typeof e[0].doc && (e = V.call(this, e));
    if (p) {
      return m ? r ? Ja(a, e, this.index, p, r) : e : new W(e);
    }
    d[t] = {field:f[t], result:e};
  }
  return q ? Ka(d) : r ? Ja(a, d, this.index, p, r) : d;
};
function Ja(a, c, b, e, d) {
  let f, g;
  for (let h = 0, l, n, m; h < c.length; h++) {
    let r;
    if (e) {
      r = c, m = e;
    } else {
      var k = c[h];
      m = k.field;
      if (!m) {
        continue;
      }
      r = k.result;
    }
    n = b.get(m);
    l = n.encoder;
    k = n.tokenize;
    l !== f && (f = l, g = f.encode(a));
    for (let p = 0; p < r.length; p++) {
      let q = "", t = H(r[p].doc, m).split(/\s+/);
      for (let u = 0, w, y; u < t.length; u++) {
        w = t[u];
        y = l.encode(w);
        y = 1 < y.length ? y.join(" ") : y[0];
        let z;
        if (y && w) {
          for (let v = 0, D; v < g.length; v++) {
            if (D = g[v], "strict" === k) {
              if (y === D) {
                q += (q ? " " : "") + d.replace("$1", w);
                z = !0;
                break;
              }
            } else {
              const E = y.indexOf(D);
              if (-1 < E) {
                q += (q ? " " : "") + w.substring(0, E) + d.replace("$1", w.substring(E, D.length)) + w.substring(E + D.length);
                z = !0;
                break;
              }
            }
          }
        }
        z || (q += (q ? " " : "") + t[u]);
      }
      r[p].highlight = q;
    }
    if (e) {
      break;
    }
  }
  return c;
}
function Ka(a) {
  const c = [], b = B();
  for (let e = 0, d, f; e < a.length; e++) {
    d = a[e];
    f = d.result;
    for (let g = 0, k, h, l; g < f.length; g++) {
      h = f[g], "object" !== typeof h && (h = {id:h}), k = h.id, (l = b[k]) ? l.push(d.field) : (h.field = b[k] = [d.field], c.push(h));
    }
  }
  return c;
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
    d && (f = V.call(this, f));
    return f;
  }
}
function V(a) {
  if (!this || !this.store) {
    return a;
  }
  const c = Array(a.length);
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c[b] = {id:e, doc:this.store.get(e)};
  }
  return c;
}
;function U(a) {
  if (!this || this.constructor !== U) {
    return new U(a);
  }
  const c = a.document || a.doc || a;
  var b;
  this.D = [];
  this.field = [];
  this.J = [];
  this.key = (b = c.key || c.id) && La(b, this.J) || "id";
  this.reg = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.A = (b = c.store || null) && b && !0 !== b && [];
  this.store = b && new Map();
  this.cache = (b = a.cache || null) && new X(b);
  a.cache = !1;
  this.priority = a.priority || 4;
  b = new Map();
  let e = c.index || c.field || c;
  C(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d], C(f) || (g = f, f = f.field), g = G(g) ? Object.assign({}, a, g) : a, b.set(f, new M(g, this.reg)), g.custom ? this.D[d] = g.custom : (this.D[d] = La(f, this.J), g.filter && ("string" === typeof this.D[d] && (this.D[d] = new String(this.D[d])), this.D[d].I = g.filter)), this.field[d] = f;
  }
  if (this.A) {
    a = c.store;
    C(a) && (a = [a]);
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
x = U.prototype;
x.append = function(a, c) {
  return this.add(a, c, !0);
};
x.update = function(a, c) {
  return this.remove(a).add(a, c);
};
x.remove = function(a) {
  G(a) && (a = H(a, this.key));
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
  return this.store.get(a) || null;
};
x.set = function(a, c) {
  "object" === typeof a && (c = a, a = H(c, this.key));
  this.store.set(a, c);
  return this;
};
x.searchCache = Ma;
x.export = function(a, c, b = 0, e = 0) {
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
      f = ra(this.reg);
      c = null;
      break;
    case 1:
      d = "tag";
      f = this.tag && pa(this.tag, this.reg.size);
      c = null;
      break;
    case 2:
      d = "doc";
      f = this.store && na(this.store);
      c = null;
      break;
    default:
      return;
  }
  return ta.call(this, a, c, d, f, b, e);
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
        this.reg = sa(c, this.reg);
        for (let e = 0, d; e < this.field.length; e++) {
          d = this.index.get(this.field[e]), d.fastupdate = !1, d.reg = this.reg;
        }
        break;
      case "tag":
        this.tag = qa(c, this.tag);
        break;
      case "doc":
        this.store = oa(c, this.store);
    }
  }
};
ia(U.prototype);
function Ma(a, c, b) {
  const e = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new X());
  let d = this.cache.get(e);
  if (!d) {
    d = this.search(a, c, b);
    if (d.then) {
      const f = this;
      d.then(function(g) {
        f.cache.set(e, g);
        return g;
      });
    }
    this.cache.set(e, d);
  }
  return d;
}
function X(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
X.prototype.set = function(a, c) {
  this.cache.set(this.h = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
X.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
  return c;
};
X.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
X.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const Na = {normalize:!1, numeric:!1, dedupe:!1};
const Oa = {};
const Pa = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const Qa = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Ra = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const Sa = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var Ta = {Exact:Na, Default:Oa, Normalize:Oa, LatinBalance:{mapper:Pa}, LatinAdvanced:{mapper:Pa, matcher:Qa, replacer:Ra}, LatinExtra:{mapper:Pa, replacer:Ra.concat([/(?!^)[aeo]/g, ""]), matcher:Qa}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let e = c.charAt(0), d = Sa[e];
    for (let f = 1, g; f < c.length && (g = c.charAt(f), "h" === g || "w" === g || !(g = Sa[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[b] = e;
  }
}}, CJK:{split:""}, LatinExact:Na, LatinDefault:Oa, LatinSimple:Oa};
M.prototype.remove = function(a, c) {
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
      Y(this.map, a), this.depth && Y(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function Y(a, c) {
  let b = 0;
  var e = "undefined" === typeof c;
  if (a.constructor === Array) {
    for (let d = 0, f, g; d < a.length; d++) {
      if ((f = a[d]) && f.length) {
        if (e) {
          b++;
        } else {
          if (g = f.indexOf(c), 0 <= g) {
            1 < f.length ? (f.splice(g, 1), b++) : delete a[d];
            break;
          } else {
            b++;
          }
        }
      }
    }
  } else {
    for (let d of a.entries()) {
      e = d[0];
      const f = Y(d[1], c);
      f ? b += f : a.delete(e);
    }
  }
  return b;
}
;const Ua = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
M.prototype.add = function(a, c, b, e) {
  if (c && (a || 0 === a)) {
    if (!e && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (e = c.length) {
      const l = B(), n = B(), m = this.depth, r = this.resolution;
      for (let p = 0; p < e; p++) {
        let q = c[this.rtl ? e - 1 - p : p];
        var d = q.length;
        if (d && (m || !n[q])) {
          var f = this.score ? this.score(c, q, p, null, 0) : Va(r, e, p), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (let t = 0, u; t < d; t++) {
                  for (f = d; f > t; f--) {
                    g = q.substring(t, f);
                    u = this.rtl ? d - 1 - t : t;
                    var k = this.score ? this.score(c, q, p, g, u) : Va(r, e, p, d, u);
                    Z(this, n, g, k, a, b);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < d) {
                for (k = d - 1; 0 < k; k--) {
                  g = q[this.rtl ? d - 1 - k : k] + g;
                  var h = this.score ? this.score(c, q, p, g, k) : Va(r, e, p, d, k);
                  Z(this, n, g, h, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (k = 0; k < d; k++) {
                  g += q[this.rtl ? d - 1 - k : k], Z(this, n, g, f, a, b);
                }
                break;
              }
            default:
              if (Z(this, n, q, f, a, b), m && 1 < e && p < e - 1) {
                for (d = B(), g = this.S, f = q, k = Math.min(m + 1, this.rtl ? p + 1 : e - p), d[f] = 1, h = 1; h < k; h++) {
                  if ((q = c[this.rtl ? e - 1 - p - h : p + h]) && !d[q]) {
                    d[q] = 1;
                    const t = this.score ? this.score(c, f, p, q, h - 1) : Va(g + (e / 2 > g ? 0 : 1), e, p, k - 1, h - 1), u = this.bidirectional && q > f;
                    Z(this, l, u ? f : q, t, a, b, u ? q : f);
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
  let k = g ? a.ctx : a.map, h;
  if (!c[b] || g && !(h = c[b])[g]) {
    g ? (c = h || (c[b] = B()), c[g] = 1, (h = k.get(g)) ? k = h : k.set(g, k = new Map())) : c[b] = 1, (h = k.get(b)) ? k = h : k.set(b, k = []), k = k[e] || (k[e] = []), f && k.includes(d) || (k.push(d), a.fastupdate && ((c = a.reg.get(d)) ? c.push(k) : a.reg.set(d, [k])));
  }
}
function Va(a, c, b, e, d) {
  return b && 1 < a ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;M.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  var e = [], d = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    d = b.offset || 0;
    var f = b.context;
    var g = b.suggest;
    var k = !0;
    var h = b.resolution;
  } else {
    k = !0;
  }
  a = this.encoder.encode(a);
  b = a.length;
  c = c || (k ? 100 : 0);
  if (1 === b) {
    return g = c, (c = Wa(this, a[0], "")) && c.length ? Aa.call(this, c, g, d) : [];
  }
  f = this.depth && !1 !== f;
  if (2 === b && f && !g) {
    return g = c, (c = Wa(this, a[1], a[0])) && c.length ? Aa.call(this, c, g, d) : [];
  }
  k = B();
  let l = 0;
  if (f) {
    var n = a[0];
    l = 1;
  }
  h || 0 === h || (h = n ? this.S : this.resolution);
  for (let q, t; l < b; l++) {
    if ((t = a[l]) && !k[t]) {
      k[t] = 1;
      q = Wa(this, t, n);
      a: {
        f = q;
        var m = e, r = g, p = h;
        let u = [];
        if (f && f.length) {
          if (f.length <= p) {
            m.push(f);
            q = void 0;
            break a;
          }
          for (let w = 0, y; w < p; w++) {
            if (y = f[w]) {
              u[w] = y;
            }
          }
          if (u.length) {
            m.push(u);
            q = void 0;
            break a;
          }
        }
        q = r ? void 0 : u;
      }
      if (q) {
        e = q;
        break;
      }
      n && (g && q && e.length || (n = t));
    }
    g && n && l === b - 1 && !e.length && (h = this.resolution, n = "", l = -1, k = B());
  }
  a: {
    a = e;
    e = a.length;
    n = a;
    if (1 < e) {
      n = xa(a, h, c, d, g);
    } else if (1 === e) {
      g = Aa.call(null, a[0], c, d);
      break a;
    }
    g = n;
  }
  return g;
};
function Wa(a, c, b) {
  let e;
  b && (e = a.bidirectional && c > b) && (e = b, b = c, c = e);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;function M(a, c) {
  if (!this || this.constructor !== M) {
    return new M(a);
  }
  if (a) {
    var b = C(a) ? a : a.preset;
    b && (Ua[b] || console.warn("Preset not found: " + b), a = Object.assign({}, Ua[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const e = !0 === b ? {depth:1} : b || {}, d = C(a.encoder) ? Ta[a.encoder] : a.encode || a.encoder || {};
  this.encoder = d.encode ? d : "object" === typeof d ? new I(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && "default" !== b && "exact" !== b && b || "strict";
  this.depth = "strict" === b && e.depth || 0;
  this.bidirectional = !1 !== e.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e && e.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  b = !1;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.S = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (b = a.cache || null) && new X(b);
  this.priority = a.priority || 4;
}
x = M.prototype;
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
x.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Y(this.map);
  this.depth && Y(this.ctx);
  return this;
};
x.searchCache = Ma;
x.export = function(a, c, b = 0, e = 0) {
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = ra(this.reg);
      break;
    case 1:
      d = "cfg";
      f = null;
      break;
    case 2:
      d = "map";
      f = na(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      f = pa(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return ta.call(this, a, c, d, f, b, e);
};
x.import = function(a, c) {
  if (c) {
    switch("string" === typeof c && (c = JSON.parse(c)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = sa(c, this.reg);
        break;
      case "map":
        this.map = oa(c, this.map);
        break;
      case "ctx":
        this.ctx = qa(c, this.ctx);
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
      let k = ua(g[1], f);
      k = "new Map([" + k + "])";
      k = '["' + d + '",' + k + "]";
      e += (e ? "," : "") + k;
    }
    e = "index.ctx=new Map([" + e + "]);";
  }
  return a ? "function inject(index){" + c + b + e + "}" : c + b + e;
};
ia(M.prototype);
B();
const Xa = {Index:M, Charset:Ta, Encoder:I, Document:U, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, Ya = "undefined" !== typeof self ? self : "undefined" !== typeof global ? global : self;
let $a;
($a = Ya.define) && $a.amd ? $a([], function() {
  return Xa;
}) : "object" === typeof Ya.exports ? Ya.exports = Xa : Ya.FlexSearch = Xa;
}(this||self));
