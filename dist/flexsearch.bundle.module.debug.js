/**!
 * FlexSearch.js v0.8.160 (Bundle/Module/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var v;
function F(a, b, c) {
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
function G() {
  return Object.create(null);
}
function L(a) {
  return "string" === typeof a;
}
function aa(a) {
  return "object" === typeof a;
}
function da(a) {
  const b = [];
  for (const c of a.keys()) {
    b.push(c);
  }
  return b;
}
function ea(a, b) {
  if (L(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function fa(a) {
  let b = 0;
  for (let c = 0, e; c < a.length; c++) {
    (e = a[c]) && b < e.length && (b = e.length);
  }
  return b;
}
;const ha = /[^\p{L}\p{N}]+/u, ia = /(\d{3})/g, ja = /(\D)(\d{3})/g, ka = /(\d{3})(\D)/g, la = /[\u0300-\u036f]/g;
function ma(a = {}) {
  if (!this || this.constructor !== ma) {
    return new ma(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
v = ma.prototype;
v.assign = function(a) {
  this.normalize = F(a.normalize, !0, this.normalize);
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
    this.numeric = F(a.numeric, e);
  } else {
    try {
      this.split = F(this.split, ha);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = F(a.numeric, F(this.numeric, !0));
  }
  this.prepare = F(a.prepare, null, this.prepare);
  this.finalize = F(a.finalize, null, this.finalize);
  c = a.filter;
  this.filter = "function" === typeof c ? c : F(c && new Set(c), null, this.filter);
  this.dedupe = F(a.dedupe, !0, this.dedupe);
  this.matcher = F((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = F((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = F((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = F(a.replacer, null, this.replacer);
  this.minlength = F(a.minlength, 1, this.minlength);
  this.maxlength = F(a.maxlength, 1024, this.maxlength);
  this.rtl = F(a.rtl, !1, this.rtl);
  if (this.cache = c = F(a.cache, !0, this.cache)) {
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
v.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.A += (this.A ? "|" : "") + a;
  this.N = null;
  this.cache && N(this);
  return this;
};
v.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && N(this);
  return this;
};
v.addMapper = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (1 < a.length) {
    return this.addMatcher(a, b);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, b);
  this.cache && N(this);
  return this;
};
v.addMatcher = function(a, b) {
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
  this.cache && N(this);
  return this;
};
v.addReplacer = function(a, b) {
  if ("string" === typeof a) {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && N(this);
  return this;
};
v.encode = function(a, b) {
  if (this.cache && a.length <= this.K) {
    if (this.H) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.H = setTimeout(N, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = la ? a.normalize("NFKD").replace(la, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ja, "$1 $2").replace(ka, "$1 $2").replace(ia, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let e = [], d = G(), f, g, k = this.split || "" === this.split ? a.split(this.split) : [a];
  for (let l = 0, m, n; l < k.length; l++) {
    if ((m = n = k[l]) && !(m.length < this.minlength || m.length > this.maxlength)) {
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
          if (this.cache && m.length <= this.L) {
            if (this.H) {
              var h = this.G.get(m);
              if (h || "" === h) {
                h && e.push(h);
                continue;
              }
            } else {
              this.H = setTimeout(N, 50, this);
            }
          }
          if (this.stemmer) {
            this.N || (this.N = new RegExp("(?!^)(" + this.A + ")$"));
            let r;
            for (; r !== m && 2 < m.length;) {
              r = m, m = m.replace(this.N, q => this.stemmer.get(q));
            }
          }
          if (m && (this.mapper || this.dedupe && 1 < m.length)) {
            h = "";
            for (let r = 0, q = "", t, u; r < m.length; r++) {
              t = m.charAt(r), t === q && this.dedupe || ((u = this.mapper && this.mapper.get(t)) || "" === u ? u === q && this.dedupe || !(q = u) || (h += u) : h += q = t);
            }
            m = h;
          }
          this.matcher && 1 < m.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), m = m.replace(this.M, r => this.matcher.get(r)));
          if (m && this.replacer) {
            for (h = 0; m && h < this.replacer.length; h += 2) {
              m = m.replace(this.replacer[h], this.replacer[h + 1]);
            }
          }
          this.cache && n.length <= this.L && (this.G.set(n, m), this.G.size > this.S && (this.G.clear(), this.L = this.L / 1.1 | 0));
          if (m) {
            if (m !== n) {
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
  this.cache && a.length <= this.K && (this.B.set(a, e), this.B.size > this.S && (this.B.clear(), this.K = this.K / 1.1 | 0));
  return e;
};
function N(a) {
  a.H = null;
  a.B.clear();
  a.G.clear();
}
;let pa, O;
async function qa(a) {
  a = a.data;
  var b = a.task;
  const c = a.id;
  let e = a.args;
  switch(b) {
    case "init":
      O = a.options || {};
      (b = a.factory) ? (Function("return " + b)()(self), pa = new self.FlexSearch.Index(O), delete self.FlexSearch) : pa = new P(O);
      postMessage({id:c});
      break;
    default:
      let d;
      if ("export" === b) {
        if (!O.export || "function" !== typeof O.export) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
        }
        e[1] ? (e[0] = O.export, e[2] = 0, e[3] = 1) : e = null;
      }
      if ("import" === b) {
        if (!O.import || "function" !== typeof O.import) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
        }
        e[0] && (a = await O.import.call(pa, e[0]), pa.import(e[0], a));
      } else {
        (d = e && pa[b].apply(pa, e)) && d.then && (d = await d);
      }
      postMessage("search" === b ? {id:c, msg:d} : {id:c});
  }
}
;function ra(a) {
  sa.call(a, "add");
  sa.call(a, "append");
  sa.call(a, "search");
  sa.call(a, "update");
  sa.call(a, "remove");
}
let ta, wa, xa;
function ya() {
  ta = xa = 0;
}
function sa(a) {
  this[a + "Async"] = function() {
    const b = arguments;
    var c = b[b.length - 1];
    let e;
    "function" === typeof c && (e = c, delete b[b.length - 1]);
    ta ? xa || (xa = Date.now() - wa >= this.priority * this.priority * 3) : (ta = setTimeout(ya, 0), wa = Date.now());
    if (xa) {
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
;let za = 0;
function Aa(a = {}) {
  function b(g) {
    function k(h) {
      h = h.data || h;
      const l = h.id, m = l && d.h[l];
      m && (m(h.msg), delete d.h[l]);
    }
    this.worker = g;
    this.h = G();
    if (this.worker) {
      e ? this.worker.on("message", k) : this.worker.onmessage = k;
      if (a.config) {
        return new Promise(function(h) {
          d.h[++za] = function() {
            h(d);
            1e9 < za && (za = 0);
          };
          d.worker.postMessage({id:za, task:"init", factory:c, options:a});
        });
      }
      this.worker.postMessage({task:"init", factory:c, options:a});
      this.priority = a.priority || 4;
      return this;
    }
  }
  if (!this || this.constructor !== Aa) {
    return new Aa(a);
  }
  let c = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  c && (c = c.toString());
  const e = "undefined" === typeof window, d = this, f = Ba(c, e, a.worker);
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
ra(Aa.prototype);
function R(a) {
  Aa.prototype[a] = function() {
    const b = this, c = [].slice.call(arguments);
    var e = c[c.length - 1];
    let d;
    "function" === typeof e && (d = e, c.pop());
    e = new Promise(function(f) {
      "export" === a && "function" === typeof c[0] && (c[0] = null);
      b.h[++za] = f;
      b.worker.postMessage({task:a, id:za, args:c});
    });
    return d ? (e.then(d), this) : e;
  };
}
function Ba(a, b, c) {
  return b ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/worker/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"](import.meta.dirname+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + qa.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof c ? c : import.meta.url.replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function Ca(a, b = 0) {
  let c = [], e = [];
  b && (b = 250000 / b * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === b && (c.push(e), e = []);
  }
  e.length && c.push(e);
  return c;
}
function Da(a, b) {
  b || (b = new Map());
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b.set(e[0], e[1]);
  }
  return b;
}
function Ea(a, b = 0) {
  let c = [], e = [];
  b && (b = 250000 / b * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], Ca(d[1])[0]]), e.length === b && (c.push(e), e = []);
  }
  e.length && c.push(e);
  return c;
}
function Fa(a, b) {
  b || (b = new Map());
  for (let c = 0, e, d; c < a.length; c++) {
    e = a[c], d = b.get(e[0]), b.set(e[0], Da(e[1], d));
  }
  return b;
}
function Ga(a) {
  let b = [], c = [];
  for (const e of a.keys()) {
    c.push(e), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function Ha(a, b) {
  b || (b = new Set());
  for (let c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function Ia(a, b, c, e, d, f, g = 0) {
  const k = e && e.constructor === Array;
  var h = k ? e.shift() : e;
  if (!h) {
    return this.export(a, b, d, f + 1);
  }
  if ((h = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(h))) && h.then) {
    const l = this;
    return h.then(function() {
      return Ia.call(l, a, b, c, k ? e : null, d, f, g + 1);
    });
  }
  return Ia.call(this, a, b, c, k ? e : null, d, f, g + 1);
}
function La(a, b) {
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
;function Ma(a, b, c, e) {
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
function T(a) {
  if (!this || this.constructor !== T) {
    return new T(a);
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
        return Ma(b, d || 0, f || b.length, !1);
      };
    }
    if ("splice" === e) {
      return function(d, f) {
        return Ma(b, d || 0, f || b.length, !0);
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
T.prototype.clear = function() {
  this.index.length = 0;
};
T.prototype.destroy = function() {
  this.proxy = this.index = null;
};
T.prototype.push = function() {
};
function U(a = 8) {
  if (!this || this.constructor !== U) {
    return new U(a);
  }
  this.index = G();
  this.h = [];
  this.size = 0;
  32 < a ? (this.B = Na, this.A = BigInt(a)) : (this.B = Oa, this.A = a);
}
U.prototype.get = function(a) {
  const b = this.index[this.B(a)];
  return b && b.get(a);
};
U.prototype.set = function(a, b) {
  var c = this.B(a);
  let e = this.index[c];
  e ? (c = e.size, e.set(a, b), (c -= e.size) && this.size++) : (this.index[c] = e = new Map([[a, b]]), this.h.push(e), this.size++);
};
function V(a = 8) {
  if (!this || this.constructor !== V) {
    return new V(a);
  }
  this.index = G();
  this.h = [];
  this.size = 0;
  32 < a ? (this.B = Na, this.A = BigInt(a)) : (this.B = Oa, this.A = a);
}
V.prototype.add = function(a) {
  var b = this.B(a);
  let c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c), this.size++);
};
v = U.prototype;
v.has = V.prototype.has = function(a) {
  const b = this.index[this.B(a)];
  return b && b.has(a);
};
v.delete = V.prototype.delete = function(a) {
  const b = this.index[this.B(a)];
  b && b.delete(a) && this.size--;
};
v.clear = V.prototype.clear = function() {
  this.index = G();
  this.h = [];
  this.size = 0;
};
v.values = V.prototype.values = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].values()) {
      yield b;
    }
  }
};
v.keys = V.prototype.keys = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].keys()) {
      yield b;
    }
  }
};
v.entries = V.prototype.entries = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].entries()) {
      yield b;
    }
  }
};
function Oa(a) {
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
function Na(a) {
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
;Pa.prototype.add = function(a, b, c) {
  aa(a) && (b = a, a = ea(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (let k = 0, h; k < this.field.length; k++) {
      h = this.F[k];
      var e = this.index.get(this.field[k]);
      if ("function" === typeof h) {
        var d = h(b);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = h.I, !d || d(b)) {
          h.constructor === String ? h = ["" + h] : L(h) && (h = [h]), Qa(b, h, this.J, 0, e, a, h[0], c);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.D.length; e++) {
        var f = this.D[e], g = this.R[e];
        d = this.tag.get(g);
        let k = G();
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
          f = ea(b, f);
        }
        if (d && f) {
          L(f) && (f = [f]);
          for (let h = 0, l, m; h < f.length; h++) {
            if (l = f[h], !k[l] && (k[l] = 1, (g = d.get(l)) ? m = g : d.set(l, m = []), !c || !m.includes(a))) {
              if (m.length === 2 ** 31 - 1) {
                g = new T(m);
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
    if (this.store && (!c || !this.store.has(a))) {
      let k;
      if (this.C) {
        k = G();
        for (let h = 0, l; h < this.C.length; h++) {
          l = this.C[h];
          if ((c = l.I) && !c(b)) {
            continue;
          }
          let m;
          if ("function" === typeof l) {
            m = l(b);
            if (!m) {
              continue;
            }
            l = [l.V];
          } else if (L(l) || l.constructor === String) {
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
      b = b[d] || (b[d] = G()), d = c[++e], Ra(a, b, c, e, d);
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
  } else {
    d.db && d.remove(f);
  }
}
;function Sa(a, b, c, e, d, f, g) {
  const k = a.length;
  let h = [], l, m;
  l = G();
  for (let n = 0, r, q, t, u; n < b; n++) {
    for (let p = 0; p < k; p++) {
      if (t = a[p], n < t.length && (r = t[n])) {
        for (let z = 0; z < r.length; z++) {
          q = r[z];
          (m = l[q]) ? l[q]++ : (m = 0, l[q] = 1);
          u = h[m] || (h[m] = []);
          if (!g) {
            let x = n + (p || !d ? 0 : f || 0);
            u = u[x] || (u[x] = []);
          }
          u.push(q);
          if (g && c && m === k - 1 && u.length - e === c) {
            return e ? u.slice(e) : u;
          }
        }
      }
    }
  }
  if (a = h.length) {
    if (d) {
      h = 1 < h.length ? Ta(h, c, e, g, f) : (h = h[0]).length > c || e ? h.slice(e, c + e) : h;
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
          for (let n = 0, r; n < h.length; n++) {
            if (r = h[n], r.length > e) {
              e -= r.length;
            } else {
              if (r.length > c || e) {
                r = r.slice(e, c + e), c -= r.length, e && (e -= r.length);
              }
              d.push(r);
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
function Ta(a, b, c, e, d) {
  const f = [], g = G();
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
    for (let m = h - 1, n, r = 0; 0 <= m; m--) {
      n = a[m];
      for (let q = 0; q < n.length; q++) {
        if (l = (e = n[q]) && e.length) {
          for (let t = 0; t < l; t++) {
            if (k = e[t], !g[k]) {
              if (g[k] = 1, c) {
                c--;
              } else {
                let u = (q + (m < h - 1 ? d || 0 : 0)) / (m + 1) | 0;
                (f[u] || (f[u] = [])).push(k);
                if (++r === b) {
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
function Ua(a, b, c) {
  const e = G(), d = [];
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
;function Va(a, b, c, e) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a, e ? X.call(this, a) : a;
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
        return e ? X.call(this, g) : g;
      }
      d.push(g);
      b -= k;
      if (!b) {
        break;
      }
    }
  }
  d = 1 < d.length ? [].concat.apply([], d) : d[0];
  return e ? X.call(this, d) : d;
}
;function Wa(a, b, c) {
  var e = c[0];
  if (e.then) {
    return Promise.all(c).then(function(m) {
      return a[b].apply(a, m);
    });
  }
  if (e[0] && e[0].index) {
    return a[b].apply(a, e);
  }
  e = [];
  let d = [], f = 0, g = 0, k, h, l;
  for (let m = 0, n; m < c.length; m++) {
    if (n = c[m]) {
      let r;
      if (n.constructor === Y) {
        r = n.result;
      } else if (n.constructor === Array) {
        r = n;
      } else {
        if (f = n.limit || 0, g = n.offset || 0, l = n.suggest, h = n.resolve, k = n.enrich && h, n.index) {
          n.resolve = !1, n.enrich = !1, r = n.index.search(n).result, n.resolve = h, n.enrich = k;
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
        d.push(r);
      } else if (r.length) {
        e[m] = r;
      } else if (!l && ("and" === b || "xor" === b)) {
        e = [];
        break;
      }
    }
  }
  return {O:e, P:d, limit:f, offset:g, enrich:k, resolve:h, suggest:l};
}
;Y.prototype.or = function() {
  const {O:a, P:b, limit:c, offset:e, enrich:d, resolve:f} = Wa(this, "or", arguments);
  return Xa.call(this, a, b, c, e, d, f);
};
function Xa(a, b, c, e, d, f) {
  if (b.length) {
    const g = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (let h = 0, l; h < k.length; h++) {
        (l = k[h]).length && (a[h] = l);
      }
      return Xa.call(g, a, [], c, e, d, f);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = Ta(a, c, e, !1, this.h), e = 0));
  return f ? this.resolve(c, e, d) : this;
}
;Y.prototype.and = function() {
  let a = this.result.length, b, c, e, d;
  if (!a) {
    const f = arguments[0];
    f && (a = !!f.suggest, d = f.resolve, b = f.limit, c = f.offset, e = f.enrich && d);
  }
  if (a) {
    const {O:f, P:g, limit:k, offset:h, enrich:l, resolve:m, suggest:n} = Wa(this, "and", arguments);
    return Ya.call(this, f, g, k, h, l, m, n);
  }
  return d ? this.resolve(b, c, e) : this;
};
function Ya(a, b, c, e, d, f, g) {
  if (b.length) {
    const k = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (let l = 0, m; l < h.length; l++) {
        (m = h[l]).length && (a[l] = m);
      }
      return Ya.call(k, a, [], c, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (b = fa(a)) {
        return this.result = Sa(a, b, c, e, g, this.h, f), f ? d ? X.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, e, d) : this;
}
;Y.prototype.xor = function() {
  const {O:a, P:b, limit:c, offset:e, enrich:d, resolve:f, suggest:g} = Wa(this, "xor", arguments);
  return Za.call(this, a, b, c, e, d, f, g);
};
function Za(a, b, c, e, d, f, g) {
  if (b.length) {
    const k = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (let l = 0, m; l < h.length; l++) {
        (m = h[l]).length && (a[l] = m);
      }
      return Za.call(k, a, [], c, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = $a.call(this, a, c, e, f, this.h), f ? d ? X.call(this.index, this.result) : this.result : this;
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, e, d) : this;
}
function $a(a, b, c, e, d) {
  const f = [], g = G();
  let k = 0;
  for (let h = 0, l; h < a.length; h++) {
    if (l = a[h]) {
      k < l.length && (k = l.length);
      for (let m = 0, n; m < l.length; m++) {
        if (n = l[m]) {
          for (let r = 0, q; r < n.length; r++) {
            q = n[r], g[q] = g[q] ? 2 : 1;
          }
        }
      }
    }
  }
  for (let h = 0, l, m = 0; h < k; h++) {
    for (let n = 0, r; n < a.length; n++) {
      if (r = a[n]) {
        if (l = r[h]) {
          for (let q = 0, t; q < l.length; q++) {
            if (t = l[q], 1 === g[t]) {
              if (c) {
                c--;
              } else {
                if (e) {
                  if (f.push(t), f.length === b) {
                    return f;
                  }
                } else {
                  const u = h + (n ? d : 0);
                  f[u] || (f[u] = []);
                  f[u].push(t);
                  if (++m === b) {
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
;Y.prototype.not = function() {
  const {O:a, P:b, limit:c, offset:e, enrich:d, resolve:f, suggest:g} = Wa(this, "not", arguments);
  return ab.call(this, a, b, c, e, d, f, g);
};
function ab(a, b, c, e, d, f, g) {
  if (b.length) {
    const k = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (let l = 0, m; l < h.length; l++) {
        (m = h[l]).length && (a[l] = m);
      }
      return ab.call(k, a, [], c, e, d, f, g);
    });
  }
  if (a.length && this.result.length) {
    this.result = bb.call(this, a, c, e, f);
  } else if (f) {
    return this.resolve(c, e, d);
  }
  return f ? d ? X.call(this.index, this.result) : this.result : this;
}
function bb(a, b, c, e) {
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
;function Y(a) {
  if (!this || this.constructor !== Y) {
    return new Y(a);
  }
  if (a && a.index) {
    return a.resolve = !1, this.index = a.index, this.h = a.boost || 0, this.result = a.index.search(a).result, this;
  }
  this.index = null;
  this.result = a || [];
  this.h = 0;
}
Y.prototype.limit = function(a) {
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
Y.prototype.offset = function(a) {
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
Y.prototype.boost = function(a) {
  this.h += a;
  return this;
};
Y.prototype.resolve = function(a, b, c) {
  const e = this.result, d = this.index;
  this.result = this.index = null;
  return e.length ? ("object" === typeof a && (c = a.enrich, b = a.offset, a = a.limit), Va.call(d, e, a || 100, b, c)) : e;
};
G();
function cb(a, b, c, e, d) {
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
  var n = 0;
  if ("object" === typeof d) {
    var r = d.template;
    n = r.length - 2;
    d = d.pattern;
  }
  "string" !== typeof d && (d = !1 === d ? "" : "...");
  n && (d = r.replace("$1", d));
  r = d.length - n;
  let q, t;
  "object" === typeof h && (q = h.before, 0 === q && (q = -1), t = h.after, 0 === t && (t = -1), h = h.total || 9e5);
  n = new Map();
  for (let Ja = 0, ba, db, na; Ja < b.length; Ja++) {
    let oa;
    if (e) {
      oa = b, na = e;
    } else {
      var u = b[Ja];
      na = u.field;
      if (!na) {
        continue;
      }
      oa = u.result;
    }
    db = c.get(na);
    ba = db.encoder;
    u = n.get(ba);
    "string" !== typeof u && (u = ba.encode(a), n.set(ba, u));
    for (let ua = 0; ua < oa.length; ua++) {
      var p = oa[ua].doc;
      if (!p) {
        continue;
      }
      p = ea(p, na);
      if (!p) {
        continue;
      }
      var z = p.trim().split(/\s+/);
      if (!z.length) {
        continue;
      }
      p = "";
      var x = [];
      let va = [];
      var J = -1, B = -1, y = 0;
      for (var A = 0; A < z.length; A++) {
        var D = z[A], E = ba.encode(D);
        E = 1 < E.length ? E.join(" ") : E[0];
        let w;
        if (E && D) {
          var C = D.length, H = (ba.split ? D.replace(ba.split, "") : D).length - E.length, M = "", W = 0;
          for (var ca = 0; ca < u.length; ca++) {
            var Q = u[ca];
            if (Q) {
              var K = Q.length;
              K += H;
              W && K <= W || (Q = E.indexOf(Q), -1 < Q && (M = (Q ? D.substring(0, Q) : "") + g + D.substring(Q, Q + K) + k + (Q + K < C ? D.substring(Q + K) : ""), W = K, w = !0));
            }
          }
          M && (h && (0 > J && (J = p.length + (p ? 1 : 0)), B = p.length + (p ? 1 : 0) + M.length, y += C, va.push(x.length), x.push({match:M})), p += (p ? " " : "") + M);
        }
        if (!w) {
          D = z[A], p += (p ? " " : "") + D, h && x.push({text:D});
        } else if (h && y >= h) {
          break;
        }
      }
      y = va.length * (f.length - 2);
      if (q || t || h && p.length - y > h) {
        if (y = h + y - 2 * r, A = B - J, 0 < q && (A += q), 0 < t && (A += t), A <= y) {
          z = q ? J - (0 < q ? q : 0) : J - ((y - A) / 2 | 0), x = t ? B + (0 < t ? t : 0) : z + y, l || (0 < z && " " !== p.charAt(z) && " " !== p.charAt(z - 1) && (z = p.indexOf(" ", z), 0 > z && (z = 0)), x < p.length && " " !== p.charAt(x - 1) && " " !== p.charAt(x) && (x = p.lastIndexOf(" ", x), x < B ? x = B : ++x)), p = (z ? d : "") + p.substring(z, x) + (x < p.length ? d : "");
        } else {
          B = [];
          J = {};
          y = {};
          A = {};
          D = {};
          E = {};
          M = H = C = 0;
          for (ca = W = 1;;) {
            var S = void 0;
            for (let w = 0, I; w < va.length; w++) {
              I = va[w];
              if (M) {
                if (H !== M) {
                  if (A[w + 1]) {
                    continue;
                  }
                  I += M;
                  if (J[I]) {
                    C -= r;
                    y[w + 1] = 1;
                    A[w + 1] = 1;
                    continue;
                  }
                  if (I >= x.length - 1) {
                    if (I >= x.length) {
                      A[w + 1] = 1;
                      I >= z.length && (y[w + 1] = 1);
                      continue;
                    }
                    C -= r;
                  }
                  p = x[I].text;
                  if (K = t && E[w]) {
                    if (0 < K) {
                      if (p.length > K) {
                        if (A[w + 1] = 1, l) {
                          p = p.substring(0, K);
                        } else {
                          continue;
                        }
                      }
                      (K -= p.length) || (K = -1);
                      E[w] = K;
                    } else {
                      A[w + 1] = 1;
                      continue;
                    }
                  }
                  if (C + p.length + 1 <= h) {
                    p = " " + p, B[w] += p;
                  } else if (l) {
                    S = h - C - 1, 0 < S && (p = " " + p.substring(0, S), B[w] += p), A[w + 1] = 1;
                  } else {
                    A[w + 1] = 1;
                    continue;
                  }
                } else {
                  if (A[w]) {
                    continue;
                  }
                  I -= H;
                  if (J[I]) {
                    C -= r;
                    A[w] = 1;
                    y[w] = 1;
                    continue;
                  }
                  if (0 >= I) {
                    if (0 > I) {
                      A[w] = 1;
                      y[w] = 1;
                      continue;
                    }
                    C -= r;
                  }
                  p = x[I].text;
                  if (K = q && D[w]) {
                    if (0 < K) {
                      if (p.length > K) {
                        if (A[w] = 1, l) {
                          p = p.substring(p.length - K);
                        } else {
                          continue;
                        }
                      }
                      (K -= p.length) || (K = -1);
                      D[w] = K;
                    } else {
                      A[w] = 1;
                      continue;
                    }
                  }
                  if (C + p.length + 1 <= h) {
                    p += " ", B[w] = p + B[w];
                  } else if (l) {
                    S = p.length + 1 - (h - C), 0 <= S && S < p.length && (p = p.substring(S) + " ", B[w] = p + B[w]), A[w] = 1;
                  } else {
                    A[w] = 1;
                    continue;
                  }
                }
              } else {
                p = x[I].match;
                q && (D[w] = q);
                t && (E[w] = t);
                w && C++;
                let Ka;
                I ? !w && r && (C += r) : (y[w] = 1, A[w] = 1);
                I >= z.length - 1 ? Ka = 1 : I < x.length - 1 && x[I + 1].match ? Ka = 1 : r && (C += r);
                C -= f.length - 2;
                if (!w || C + p.length <= h) {
                  B[w] = p;
                } else {
                  S = W = ca = y[w] = 0;
                  break;
                }
                Ka && (y[w + 1] = 1, A[w + 1] = 1);
              }
              C += p.length;
              S = J[I] = 1;
            }
            if (S) {
              H === M ? M++ : H++;
            } else {
              H === M ? W = 0 : ca = 0;
              if (!W && !ca) {
                break;
              }
              W ? (H++, M = H) : M++;
            }
          }
          p = "";
          for (let w = 0, I; w < B.length; w++) {
            I = (w && y[w] ? " " : (w && !d ? " " : "") + d) + B[w], p += I;
          }
          d && !y[B.length] && (p += d);
        }
      }
      m && (p = p.replace(m, " "));
      oa[ua].highlight = p;
    }
    if (e) {
      break;
    }
  }
  return b;
}
;Pa.prototype.search = function(a, b, c, e) {
  c || (!b && aa(a) ? (c = a, a = "") : aa(b) && (c = b, b = 0));
  let d = [];
  var f = [];
  let g;
  let k;
  let h, l;
  let m = 0;
  var n = !0;
  let r;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    g = c.pluck;
    k = c.merge;
    h = g || c.field || (h = c.index) && (h.index ? null : h);
    l = this.tag && c.tag;
    var q = c.suggest;
    n = !1 !== c.resolve;
    if (!n && !g) {
      if (h = h || this.field) {
        L(h) ? g = h : (h.constructor === Array && 1 === h.length && (h = h[0]), g = h.field || h.index);
      }
      if (!g) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    this.store && c.enrich && !n && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    var t = (r = n && this.store && c.highlight) || n && this.store && c.enrich;
    b = c.limit || b;
    var u = c.offset || 0;
    b || (b = 100);
    if (l && (!this.db || !e)) {
      l.constructor !== Array && (l = [l]);
      var p = [];
      for (let B = 0, y; B < l.length; B++) {
        y = l[B];
        if (L(y)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (y.field && y.tag) {
          var z = y.tag;
          if (z.constructor === Array) {
            for (var x = 0; x < z.length; x++) {
              p.push(y.field, z[x]);
            }
          } else {
            p.push(y.field, z);
          }
        } else {
          z = Object.keys(y);
          for (let A = 0, D, E; A < z.length; A++) {
            if (D = z[A], E = y[D], E.constructor === Array) {
              for (x = 0; x < E.length; x++) {
                p.push(D, E[x]);
              }
            } else {
              p.push(D, E);
            }
          }
        }
      }
      if (!p.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      l = p;
      if (!a) {
        n = [];
        if (p.length) {
          for (f = 0; f < p.length; f += 2) {
            if (this.db) {
              q = this.index.get(p[f]);
              if (!q) {
                console.warn("Tag '" + p[f] + ":" + p[f + 1] + "' will be skipped because there is no field '" + p[f] + "'.");
                continue;
              }
              n.push(q = q.db.tag(p[f + 1], b, u, t));
            } else {
              q = eb.call(this, p[f], p[f + 1], b, u, t);
            }
            d.push({field:p[f], tag:p[f + 1], result:q});
          }
        }
        return n.length ? Promise.all(n).then(function(B) {
          for (let y = 0; y < B.length; y++) {
            d[y].result = B[y];
          }
          return d;
        }) : d;
      }
    }
    h && h.constructor !== Array && (h = [h]);
  }
  h || (h = this.field);
  p = !e && (this.worker || this.db) && [];
  let J;
  for (let B = 0, y, A, D; B < h.length; B++) {
    A = h[B];
    if (this.db && this.tag && !this.F[B]) {
      continue;
    }
    let E;
    L(A) || (E = A, A = E.field, a = E.query || a, b = E.limit || b, u = E.offset || u, q = E.suggest || q, r = (t = this.store && (E.enrich || t)) && (c.highlight || r));
    if (e) {
      y = e[B];
    } else {
      if (z = E || c, x = this.index.get(A), l && (this.db && (z.tag = l, J = x.db.support_tag_search, z.field = h), J || (z.enrich = !1)), p) {
        p[B] = x.search(a, b, z);
        z && t && (z.enrich = t);
        continue;
      } else {
        y = x.search(a, b, z), z && t && (z.enrich = t);
      }
    }
    D = y && (n ? y.length : y.result.length);
    if (l && D) {
      z = [];
      x = 0;
      if (this.db && e) {
        if (!J) {
          for (let C = h.length; C < e.length; C++) {
            let H = e[C];
            if (H && H.length) {
              x++, z.push(H);
            } else if (!q) {
              return n ? d : new Y(d);
            }
          }
        }
      } else {
        for (let C = 0, H, M; C < l.length; C += 2) {
          H = this.tag.get(l[C]);
          if (!H) {
            if (console.warn("Tag '" + l[C] + ":" + l[C + 1] + "' will be skipped because there is no field '" + l[C] + "'."), q) {
              continue;
            } else {
              return n ? d : new Y(d);
            }
          }
          if (M = (H = H && H.get(l[C + 1])) && H.length) {
            x++, z.push(H);
          } else if (!q) {
            return n ? d : new Y(d);
          }
        }
      }
      if (x) {
        y = Ua(y, z, n);
        D = y.length;
        if (!D && !q) {
          return n ? y : new Y(y);
        }
        x--;
      }
    }
    if (D) {
      f[m] = A, d.push(y), m++;
    } else if (1 === h.length) {
      return n ? d : new Y(d);
    }
  }
  if (p) {
    if (this.db && l && l.length && !J) {
      for (t = 0; t < l.length; t += 2) {
        f = this.index.get(l[t]);
        if (!f) {
          if (console.warn("Tag '" + l[t] + ":" + l[t + 1] + "' was not found because there is no field '" + l[t] + "'."), q) {
            continue;
          } else {
            return n ? d : new Y(d);
          }
        }
        p.push(f.db.tag(l[t + 1], b, u, !1));
      }
    }
    const B = this;
    return Promise.all(p).then(function(y) {
      return y.length ? B.search(a, b, c, y) : y;
    });
  }
  if (!m) {
    return n ? d : new Y(d);
  }
  if (g && (!t || !this.store)) {
    return d[0];
  }
  p = [];
  for (u = 0; u < f.length; u++) {
    q = d[u];
    t && q.length && "undefined" === typeof q[0].doc && (this.db ? p.push(q = this.index.get(this.field[0]).db.enrich(q)) : q = X.call(this, q));
    if (g) {
      return n ? r ? cb(a, q, this.index, g, r) : q : new Y(q);
    }
    d[u] = {field:f[u], result:q};
  }
  if (t && this.db && p.length) {
    const B = this;
    return Promise.all(p).then(function(y) {
      for (let A = 0; A < y.length; A++) {
        d[A].result = y[A];
      }
      return k ? fb(d) : r ? cb(a, d, B.index, g, r) : d;
    });
  }
  return k ? fb(d) : r ? cb(a, d, this.index, g, r) : d;
};
function fb(a) {
  const b = [], c = G();
  for (let e = 0, d, f; e < a.length; e++) {
    d = a[e];
    f = d.result;
    for (let g = 0, k, h, l; g < f.length; g++) {
      h = f[g], "object" !== typeof h && (h = {id:h}), k = h.id, (l = c[k]) ? l.push(d.field) : (h.field = c[k] = [d.field], b.push(h));
    }
  }
  return b;
}
function eb(a, b, c, e, d) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(b)) && f.length - e) && 0 < a) {
    if (a > c || e) {
      f = f.slice(e, e + c);
    }
    d && (f = X.call(this, f));
    return f;
  }
}
function X(a) {
  if (!this || !this.store) {
    return a;
  }
  const b = Array(a.length);
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b[c] = {id:e, doc:this.store.get(e)};
  }
  return b;
}
;function Pa(a) {
  if (!this || this.constructor !== Pa) {
    return new Pa(a);
  }
  const b = a.document || a.doc || a;
  let c, e;
  this.F = [];
  this.field = [];
  this.J = [];
  this.key = (c = b.key || b.id) && gb(c, this.J) || "id";
  (e = a.keystore || 0) && (this.keystore = e);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? e ? new V(e) : new Set() : e ? new U(e) : new Map();
  this.C = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (e ? new U(e) : new Map());
  this.cache = (c = a.cache || null) && new hb(c);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = ib.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.D = [];
      this.R = [];
      for (let d = 0, f, g; d < c.length; d++) {
        f = c[d];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.D[d] = f.custom : (this.D[d] = gb(g, this.J), f.filter && ("string" === typeof this.D[d] && (this.D[d] = new String(this.D[d])), this.D[d].I = f.filter));
        this.R[d] = g;
        this.tag.set(g, new Map());
      }
    }
  }
  if (this.worker) {
    this.fastupdate = !1;
    const d = [];
    for (const f of this.index.values()) {
      f.then && d.push(f);
    }
    if (d.length) {
      const f = this;
      return Promise.all(d).then(function(g) {
        const k = new Map();
        let h = 0;
        for (const m of f.index.entries()) {
          const n = m[0];
          var l = m[1];
          if (l.then) {
            l = d[h].encoder || {};
            let r = k.get(l);
            r || (r = l.encode ? l : new ma(l), k.set(l, r));
            l = g[h];
            l.encoder = r;
            f.index.set(n, l);
            h++;
          }
        }
        return f;
      });
    }
  } else {
    a.db && (this.fastupdate = !1, this.mount(a.db));
  }
}
v = Pa.prototype;
v.mount = function(a) {
  if (this.worker) {
    throw Error("You can't use Worker-Indexes on a persistent model. That would be useless, since each of the persistent model acts like Worker-Index by default (Master/Slave).");
  }
  let b = this.field;
  if (this.tag) {
    for (let f = 0, g; f < this.R.length; f++) {
      g = this.R[f];
      var c = void 0;
      this.index.set(g, c = new P({}, this.reg));
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
v.commit = async function(a, b) {
  const c = [];
  for (const e of this.index.values()) {
    c.push(e.commit(a, b));
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
function ib(a, b) {
  const c = new Map();
  let e = b.index || b.field || b;
  L(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d];
    L(f) || (g = f, f = f.field);
    g = aa(g) ? Object.assign({}, a, g) : a;
    if (this.worker) {
      const k = new Aa(g);
      k.encoder = g.encoder;
      c.set(f, k);
    }
    this.worker || c.set(f, new P(g, this.reg));
    g.custom ? this.F[d] = g.custom : (this.F[d] = gb(f, this.J), g.filter && ("string" === typeof this.F[d] && (this.F[d] = new String(this.F[d])), this.F[d].I = g.filter));
    this.field[d] = f;
  }
  if (this.C) {
    a = b.store;
    L(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.custom ? (this.C[d] = f.custom, f.custom.V = g) : (this.C[d] = gb(g, this.J), f.filter && ("string" === typeof this.C[d] && (this.C[d] = new String(this.C[d])), this.C[d].I = f.filter));
    }
  }
  return c;
}
function gb(a, b) {
  const c = a.split(":");
  let e = 0;
  for (let d = 0; d < c.length; d++) {
    a = c[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (b[e] = !0), a && (c[e++] = a);
  }
  e < c.length && (c.length = e);
  return 1 < e ? c : c[0];
}
v.append = function(a, b) {
  return this.add(a, b, !0);
};
v.update = function(a, b) {
  return this.remove(a).add(a, b);
};
v.remove = function(a) {
  aa(a) && (a = ea(a, this.key));
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
v.clear = function() {
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
    return b[0] && b[0].doc || null;
  }) : this.store.get(a) || null;
};
v.set = function(a, b) {
  "object" === typeof a && (b = a, a = ea(b, this.key));
  this.store.set(a, b);
  return this;
};
v.searchCache = jb;
v.export = function(a, b, c = 0, e = 0) {
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
      f = Ga(this.reg);
      b = null;
      break;
    case 1:
      d = "tag";
      f = this.tag && Ea(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      d = "doc";
      f = this.store && Ca(this.store);
      b = null;
      break;
    default:
      return;
  }
  return Ia.call(this, a, b, d, f, c, e);
};
v.import = function(a, b) {
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
        this.reg = Ha(b, this.reg);
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
        this.tag = Fa(b, this.tag);
        break;
      case "doc":
        this.store = Da(b, this.store);
    }
  }
};
ra(Pa.prototype);
function jb(a, b, c) {
  const e = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new hb());
  let d = this.cache.get(e);
  if (!d) {
    d = this.search(a, b, c);
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
function hb(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
hb.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
hb.prototype.get = function(a) {
  const b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
hb.prototype.remove = function(a) {
  for (const b of this.cache) {
    const c = b[0];
    b[1].includes(a) && this.cache.delete(c);
  }
};
hb.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const kb = {normalize:!1, numeric:!1, dedupe:!1};
const lb = {};
const mb = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const nb = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), ob = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const pb = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var qb = {Exact:kb, Default:lb, Normalize:lb, LatinBalance:{mapper:mb}, LatinAdvanced:{mapper:mb, matcher:nb, replacer:ob}, LatinExtra:{mapper:mb, replacer:ob.concat([/(?!^)[aeo]/g, ""]), matcher:nb}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let e = b.charAt(0), d = pb[e];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = pb[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[c] = e;
  }
}}, CJK:{split:""}, LatinExact:kb, LatinDefault:lb, LatinSimple:lb};
P.prototype.remove = function(a, b) {
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
      rb(this.map, a), this.depth && rb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.T && sb(this));
  this.cache && this.cache.remove(a);
  return this;
};
function rb(a, b) {
  let c = 0;
  var e = "undefined" === typeof b;
  if (a.constructor === Array) {
    for (let d = 0, f, g; d < a.length; d++) {
      if ((f = a[d]) && f.length) {
        if (e) {
          c++;
        } else {
          if (g = f.indexOf(b), 0 <= g) {
            1 < f.length ? (f.splice(g, 1), c++) : delete a[d];
            break;
          } else {
            c++;
          }
        }
      }
    }
  } else {
    for (let d of a.entries()) {
      e = d[0];
      const f = rb(d[1], b);
      f ? c += f : a.delete(e);
    }
  }
  return c;
}
;const tb = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
P.prototype.add = function(a, b, c, e) {
  if (b && (a || 0 === a)) {
    if (!e && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    e = this.depth;
    b = this.encoder.encode(b, !e);
    const l = b.length;
    if (l) {
      const m = G(), n = G(), r = this.resolution;
      for (let q = 0; q < l; q++) {
        let t = b[this.rtl ? l - 1 - q : q];
        var d = t.length;
        if (d && (e || !n[t])) {
          var f = this.score ? this.score(b, t, q, null, 0) : ub(r, l, q), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (let u = 0, p; u < d; u++) {
                  for (f = d; f > u; f--) {
                    g = t.substring(u, f);
                    p = this.rtl ? d - 1 - u : u;
                    var k = this.score ? this.score(b, t, q, g, p) : ub(r, l, q, d, p);
                    vb(this, n, g, k, a, c);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < d) {
                for (k = d - 1; 0 < k; k--) {
                  g = t[this.rtl ? d - 1 - k : k] + g;
                  var h = this.score ? this.score(b, t, q, g, k) : ub(r, l, q, d, k);
                  vb(this, n, g, h, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (k = 0; k < d; k++) {
                  g += t[this.rtl ? d - 1 - k : k], vb(this, n, g, f, a, c);
                }
                break;
              }
            default:
              if (vb(this, n, t, f, a, c), e && 1 < l && q < l - 1) {
                for (d = G(), g = this.U, f = t, k = Math.min(e + 1, this.rtl ? q + 1 : l - q), d[f] = 1, h = 1; h < k; h++) {
                  if ((t = b[this.rtl ? l - 1 - q - h : q + h]) && !d[t]) {
                    d[t] = 1;
                    const u = this.score ? this.score(b, f, q, t, h - 1) : ub(g + (l / 2 > g ? 0 : 1), l, q, k - 1, h - 1), p = this.bidirectional && t > f;
                    vb(this, m, p ? f : t, u, a, c, p ? t : f);
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
  this.db && (b || this.commit_task.push({del:a}), this.T && sb(this));
  return this;
};
function vb(a, b, c, e, d, f, g) {
  let k = g ? a.ctx : a.map, h;
  if (!b[c] || g && !(h = b[c])[g]) {
    if (g ? (b = h || (b[c] = G()), b[g] = 1, (h = k.get(g)) ? k = h : k.set(g, k = new Map())) : b[c] = 1, (h = k.get(c)) ? k = h : k.set(c, k = h = []), k = k[e] || (k[e] = []), !f || !k.includes(d)) {
      if (k.length === 2 ** 31 - 1) {
        b = new T(k);
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
function ub(a, b, c, e, d) {
  return c && 1 < a ? b + (e || 0) <= a ? c + (d || 0) : (a - 1) / (b + (e || 0)) * (c + (d || 0)) + 1 | 0 : 0;
}
;P.prototype.search = function(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : (c = a, a = ""));
  let e = [], d, f, g, k = 0, h, l, m, n, r;
  c ? (a = c.query || a, b = c.limit || b, k = c.offset || 0, f = c.context, g = c.suggest, r = (h = !1 !== c.resolve) && c.enrich, m = c.boost, n = c.resolution, l = this.db && c.tag) : h = this.resolve;
  f = this.depth && !1 !== f;
  let q = this.encoder.encode(a, !f);
  d = q.length;
  b = b || (h ? 100 : 0);
  if (1 === d) {
    return wb.call(this, q[0], "", b, k, h, r, l);
  }
  if (2 === d && f && !g) {
    return wb.call(this, q[1], q[0], b, k, h, r, l);
  }
  let t = G(), u = 0, p;
  f && (p = q[0], u = 1);
  n || 0 === n || (n = p ? this.U : this.resolution);
  if (this.db) {
    if (this.db.search && (a = this.db.search(this, q, b, k, g, h, r, l), !1 !== a)) {
      return a;
    }
    const z = this;
    return async function() {
      for (let x, J; u < d; u++) {
        if ((J = q[u]) && !t[J]) {
          t[J] = 1;
          x = await xb(z, J, p, 0, 0, !1, !1);
          if (x = yb(x, e, g, n)) {
            e = x;
            break;
          }
          p && (g && x && e.length || (p = J));
        }
        g && p && u === d - 1 && !e.length && (n = z.resolution, p = "", u = -1, t = G());
      }
      return zb(e, n, b, k, g, m, h);
    }();
  }
  for (let z, x; u < d; u++) {
    if ((x = q[u]) && !t[x]) {
      t[x] = 1;
      z = xb(this, x, p, 0, 0, !1, !1);
      if (z = yb(z, e, g, n)) {
        e = z;
        break;
      }
      p && (g && z && e.length || (p = x));
    }
    g && p && u === d - 1 && !e.length && (n = this.resolution, p = "", u = -1, t = G());
  }
  return zb(e, n, b, k, g, m, h);
};
function zb(a, b, c, e, d, f, g) {
  let k = a.length, h = a;
  if (1 < k) {
    h = Sa(a, b, c, e, d, f, g);
  } else if (1 === k) {
    return g ? Va.call(null, a[0], c, e) : new Y(a[0]);
  }
  return g ? h : new Y(h);
}
function wb(a, b, c, e, d, f, g) {
  a = xb(this, a, b, c, e, d, f, g);
  return this.db ? a.then(function(k) {
    return d ? k || [] : new Y(k);
  }) : a && a.length ? d ? Va.call(this, a, c, e) : new Y(a) : d ? [] : new Y();
}
function yb(a, b, c, e) {
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
function xb(a, b, c, e, d, f, g, k) {
  let h;
  c && (h = a.bidirectional && b > c) && (h = c, c = b, b = h);
  if (a.db) {
    return a.db.get(b, c, e, d, f, g, k);
  }
  a = c ? (a = a.ctx.get(c)) && a.get(b) : a.map.get(b);
  return a;
}
;function P(a, b) {
  if (!this || this.constructor !== P) {
    return new P(a);
  }
  if (a) {
    var c = L(a) ? a : a.preset;
    c && (tb[c] || console.warn("Preset not found: " + c), a = Object.assign({}, tb[c], a));
  } else {
    a = {};
  }
  c = a.context;
  const e = !0 === c ? {depth:1} : c || {}, d = L(a.encoder) ? qb[a.encoder] : a.encode || a.encoder || {};
  this.encoder = d.encode ? d : "object" === typeof d ? new ma(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = c = (c = a.tokenize) && "default" !== c && "exact" !== c && c || "strict";
  this.depth = "strict" === c && e.depth || 0;
  this.bidirectional = !1 !== e.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e && e.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new U(c) : new Map();
  this.ctx = c ? new U(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new U(c) : new Map() : c ? new V(c) : new Set());
  this.U = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new hb(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.T = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
v = P.prototype;
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
function sb(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a, void 0, void 0);
  }, 1));
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
  const c = this, e = this.remove(a);
  return e && e.then ? e.then(() => c.add(a, b)) : this.add(a, b);
};
v.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  rb(this.map);
  this.depth && rb(this.ctx);
  return this;
};
v.searchCache = jb;
v.export = function(a, b, c = 0, e = 0) {
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = Ga(this.reg);
      break;
    case 1:
      d = "cfg";
      f = null;
      break;
    case 2:
      d = "map";
      f = Ca(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      f = Ea(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return Ia.call(this, a, b, d, f, c, e);
};
v.import = function(a, b) {
  if (b) {
    switch("string" === typeof b && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Ha(b, this.reg);
        break;
      case "map":
        this.map = Da(b, this.map);
        break;
      case "ctx":
        this.ctx = Fa(b, this.ctx);
    }
  }
};
v.serialize = function(a = !0) {
  let b = "", c = "", e = "";
  if (this.reg.size) {
    let f;
    for (var d of this.reg.keys()) {
      f || (f = typeof d), b += (b ? "," : "") + ("string" === f ? '"' + d + '"' : d);
    }
    b = "index.reg=new Set([" + b + "]);";
    c = La(this.map, f);
    c = "index.map=new Map([" + c + "]);";
    for (const g of this.ctx.entries()) {
      d = g[0];
      let k = La(g[1], f);
      k = "new Map([" + k + "])";
      k = '["' + d + '",' + k + "]";
      e += (e ? "," : "") + k;
    }
    e = "index.ctx=new Map([" + e + "]);";
  }
  return a ? "function inject(index){" + b + c + e + "}" : b + c + e;
};
ra(P.prototype);
const Ab = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), Bb = ["map", "ctx", "tag", "reg", "cfg"], Cb = G();
function Db(a, b = {}) {
  if (!this || this.constructor !== Db) {
    return new Db(a, b);
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
v = Db.prototype;
v.mount = function(a) {
  if (a.index) {
    return a.mount(this);
  }
  a.db = this;
  return this.open();
};
v.open = function() {
  if (this.db) {
    return this.db;
  }
  let a = this;
  navigator.storage && navigator.storage.persist();
  Cb[a.id] || (Cb[a.id] = []);
  Cb[a.id].push(a.field);
  const b = Ab.open(a.id, 1);
  b.onupgradeneeded = function() {
    const c = a.db = this.result;
    for (let e = 0, d; e < Bb.length; e++) {
      d = Bb[e];
      for (let f = 0, g; f < Cb[a.id].length; f++) {
        g = Cb[a.id][f], c.objectStoreNames.contains(d + ("reg" !== d ? g ? ":" + g : "" : "")) || c.createObjectStore(d + ("reg" !== d ? g ? ":" + g : "" : ""));
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
v.close = function() {
  this.db && this.db.close();
  this.db = null;
};
v.destroy = function() {
  const a = Ab.deleteDatabase(this.id);
  return Z(a);
};
v.clear = function() {
  const a = [];
  for (let c = 0, e; c < Bb.length; c++) {
    e = Bb[c];
    for (let d = 0, f; d < Cb[this.id].length; d++) {
      f = Cb[this.id][d], a.push(e + ("reg" !== e ? f ? ":" + f : "" : ""));
    }
  }
  const b = this.db.transaction(a, "readwrite");
  for (let c = 0; c < a.length; c++) {
    b.objectStore(a[c]).clear();
  }
  return Z(b);
};
v.get = function(a, b, c = 0, e = 0, d = !0, f = !1) {
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
          const n = c ? e + Math.min(m.length - e, c) : m.length;
          for (let r = e; r < n; r++) {
            h.push(m[r]);
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
v.tag = function(a, b = 0, c = 0, e = !1) {
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
v.enrich = function(a) {
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
v.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return Z(a).then(function(b) {
    return !!b;
  });
};
v.search = null;
v.info = function() {
};
v.transaction = function(a, b, c) {
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
v.commit = async function(a, b, c) {
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
    b || (c || (e = e.concat(da(a.reg))), e.length && await this.remove(e));
  }
  a.reg.size && (await this.transaction("map", "readwrite", function(e) {
    for (const d of a.map) {
      const f = d[0], g = d[1];
      g.length && (b ? e.put(g, f) : e.get(f).onsuccess = function() {
        let k = this.result;
        var h;
        if (k && k.length) {
          const l = Math.max(k.length, g.length);
          for (let m = 0, n, r; m < l; m++) {
            if ((r = g[m]) && r.length) {
              if ((n = k[m]) && n.length) {
                for (h = 0; h < r.length; h++) {
                  n.push(r[h]);
                }
              } else {
                k[m] = r;
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
          var n;
          if (m && m.length) {
            const r = Math.max(m.length, l.length);
            for (let q = 0, t, u; q < r; q++) {
              if ((u = l[q]) && u.length) {
                if ((t = m[q]) && t.length) {
                  for (n = 0; n < u.length; n++) {
                    t.push(u[n]);
                  }
                } else {
                  m[q] = u;
                }
                n = 1;
              }
            }
          } else {
            m = l, n = 1;
          }
          n && e.put(m, f + ":" + h);
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
function Eb(a, b, c) {
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
v.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && Eb(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && Eb(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && Eb(c, a, !0);
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
;export default {Index:P, Charset:qb, Encoder:ma, Document:Pa, Worker:Aa, Resolver:Y, IndexedDB:Db, Language:{}};

export const Index=P;export const  Charset=qb;export const  Encoder=ma;export const  Document=Pa;export const  Worker=Aa;export const  Resolver=Y;export const  IndexedDB=Db;export const  Language={};