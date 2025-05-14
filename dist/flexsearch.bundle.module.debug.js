/**!
 * FlexSearch.js v0.8.166 (Bundle/Module/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var w;
function E(a, b, c) {
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
function aa(a, b) {
  return "undefined" === typeof a ? b : a;
}
function G() {
  return Object.create(null);
}
function M(a) {
  return "string" === typeof a;
}
function da(a) {
  return "object" === typeof a;
}
function ea(a) {
  const b = [];
  for (const c of a.keys()) {
    b.push(c);
  }
  return b;
}
function fa(a, b) {
  if (M(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function ha(a) {
  let b = 0;
  for (let c = 0, d; c < a.length; c++) {
    (d = a[c]) && b < d.length && (b = d.length);
  }
  return b;
}
;const ia = /[^\p{L}\p{N}]+/u, ja = /(\d{3})/g, ka = /(\D)(\d{3})/g, la = /(\d{3})(\D)/g, ma = /[\u0300-\u036f]/g;
function na(a = {}) {
  if (!this || this.constructor !== na) {
    return new na(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
w = na.prototype;
w.assign = function(a) {
  this.normalize = E(a.normalize, !0, this.normalize);
  let b = a.include, c = b || a.exclude || a.split, d;
  if (c || "" === c) {
    if ("object" === typeof c && c.constructor !== RegExp) {
      let e = "";
      d = !b;
      b || (e += "\\p{Z}");
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
        console.error("Your split configuration:", c, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = c, d = !1 === c || 2 > "a1a".split(c).length;
    }
    this.numeric = E(a.numeric, d);
  } else {
    try {
      this.split = E(this.split, ia);
    } catch (e) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = E(a.numeric, E(this.numeric, !0));
  }
  this.prepare = E(a.prepare, null, this.prepare);
  this.finalize = E(a.finalize, null, this.finalize);
  c = a.filter;
  this.filter = "function" === typeof c ? c : E(c && new Set(c), null, this.filter);
  this.dedupe = E(a.dedupe, !0, this.dedupe);
  this.matcher = E((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = E((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = E((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = E(a.replacer, null, this.replacer);
  this.minlength = E(a.minlength, 1, this.minlength);
  this.maxlength = E(a.maxlength, 1024, this.maxlength);
  this.rtl = E(a.rtl, !1, this.rtl);
  if (this.cache = c = E(a.cache, !0, this.cache)) {
    this.H = null, this.S = "number" === typeof c ? c : 2e5, this.B = new Map(), this.G = new Map(), this.L = this.K = 128;
  }
  this.h = "";
  this.M = null;
  this.A = "";
  this.N = null;
  if (this.matcher) {
    for (const e of this.matcher.keys()) {
      this.h += (this.h ? "|" : "") + e;
    }
  }
  if (this.stemmer) {
    for (const e of this.stemmer.keys()) {
      this.A += (this.A ? "|" : "") + e;
    }
  }
  return this;
};
w.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.A += (this.A ? "|" : "") + a;
  this.N = null;
  this.cache && N(this);
  return this;
};
w.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && N(this);
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
  this.cache && N(this);
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
  this.cache && N(this);
  return this;
};
w.addReplacer = function(a, b) {
  if ("string" === typeof a) {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && N(this);
  return this;
};
w.encode = function(a, b) {
  if (this.cache && a.length <= this.K) {
    if (this.H) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.H = setTimeout(N, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = ma ? a.normalize("NFKD").replace(ma, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ka, "$1 $2").replace(la, "$1 $2").replace(ja, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let d = [], e = G(), f, g, h = this.split || "" === this.split ? a.split(this.split) : [a];
  for (let l = 0, m, p; l < h.length; l++) {
    if ((m = p = h[l]) && !(m.length < this.minlength || m.length > this.maxlength)) {
      if (b) {
        if (e[m]) {
          continue;
        }
        e[m] = 1;
      } else {
        if (f === m) {
          continue;
        }
        f = m;
      }
      if (c) {
        d.push(m);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(m) : !this.filter.has(m))) {
          if (this.cache && m.length <= this.L) {
            if (this.H) {
              var k = this.G.get(m);
              if (k || "" === k) {
                k && d.push(k);
                continue;
              }
            } else {
              this.H = setTimeout(N, 50, this);
            }
          }
          if (this.stemmer) {
            this.N || (this.N = new RegExp("(?!^)(" + this.A + ")$"));
            let u;
            for (; u !== m && 2 < m.length;) {
              u = m, m = m.replace(this.N, q => this.stemmer.get(q));
            }
          }
          if (m && (this.mapper || this.dedupe && 1 < m.length)) {
            k = "";
            for (let u = 0, q = "", r, n; u < m.length; u++) {
              r = m.charAt(u), r === q && this.dedupe || ((n = this.mapper && this.mapper.get(r)) || "" === n ? n === q && this.dedupe || !(q = n) || (k += n) : k += q = r);
            }
            m = k;
          }
          this.matcher && 1 < m.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), m = m.replace(this.M, u => this.matcher.get(u)));
          if (m && this.replacer) {
            for (k = 0; m && k < this.replacer.length; k += 2) {
              m = m.replace(this.replacer[k], this.replacer[k + 1]);
            }
          }
          this.cache && p.length <= this.L && (this.G.set(p, m), this.G.size > this.S && (this.G.clear(), this.L = this.L / 1.1 | 0));
          if (m) {
            if (m !== p) {
              if (b) {
                if (e[m]) {
                  continue;
                }
                e[m] = 1;
              } else {
                if (g === m) {
                  continue;
                }
                g = m;
              }
            }
            d.push(m);
          }
        }
      }
    }
  }
  this.finalize && (d = this.finalize(d) || d);
  this.cache && a.length <= this.K && (this.B.set(a, d), this.B.size > this.S && (this.B.clear(), this.K = this.K / 1.1 | 0));
  return d;
};
function N(a) {
  a.H = null;
  a.B.clear();
  a.G.clear();
}
;let qa, O;
async function ra(a) {
  a = a.data;
  var b = a.task;
  const c = a.id;
  let d = a.args;
  switch(b) {
    case "init":
      O = a.options || {};
      (b = a.factory) ? (Function("return " + b)()(self), qa = new self.FlexSearch.Index(O), delete self.FlexSearch) : qa = new P(O);
      postMessage({id:c});
      break;
    default:
      let e;
      if ("export" === b) {
        if (!O.export || "function" !== typeof O.export) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
        }
        d[1] ? (d[0] = O.export, d[2] = 0, d[3] = 1) : d = null;
      }
      if ("import" === b) {
        if (!O.import || "function" !== typeof O.import) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
        }
        d[0] && (a = await O.import.call(qa, d[0]), qa.import(d[0], a));
      } else {
        (e = d && qa[b].apply(qa, d)) && e.then && (e = await e);
      }
      postMessage("search" === b ? {id:c, msg:e} : {id:c});
  }
}
;function sa(a) {
  ta.call(a, "add");
  ta.call(a, "append");
  ta.call(a, "search");
  ta.call(a, "update");
  ta.call(a, "remove");
  ta.call(a, "searchCache");
}
let ua, va, ya;
function za() {
  ua = ya = 0;
}
function ta(a) {
  this[a + "Async"] = function() {
    const b = arguments;
    var c = b[b.length - 1];
    let d;
    "function" === typeof c && (d = c, delete b[b.length - 1]);
    ua ? ya || (ya = Date.now() - va >= this.priority * this.priority * 3) : (ua = setTimeout(za, 0), va = Date.now());
    if (ya) {
      const f = this;
      return new Promise(g => {
        setTimeout(function() {
          g(f[a + "Async"].apply(f, b));
        }, 0);
      });
    }
    const e = this[a].apply(this, b);
    c = e.then ? e : new Promise(f => f(e));
    d && c.then(d);
    return c;
  };
}
;let Aa = 0;
function Ba(a = {}, b) {
  function c(h) {
    function k(l) {
      l = l.data || l;
      const m = l.id, p = m && f.h[m];
      p && (p(l.msg), delete f.h[m]);
    }
    this.worker = h;
    this.h = G();
    if (this.worker) {
      e ? this.worker.on("message", k) : this.worker.onmessage = k;
      if (a.config) {
        return new Promise(function(l) {
          f.h[++Aa] = function() {
            l(f);
            1e9 < Aa && (Aa = 0);
          };
          f.worker.postMessage({id:Aa, task:"init", factory:d, options:a});
        });
      }
      this.priority = a.priority || 4;
      this.encoder = b || null;
      this.worker.postMessage({task:"init", factory:d, options:a});
      return this;
    }
  }
  if (!this || this.constructor !== Ba) {
    return new Ba(a);
  }
  let d = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  d && (d = d.toString());
  const e = "undefined" === typeof window, f = this, g = Ca(d, e, a.worker);
  return g.then ? g.then(function(h) {
    return c.call(f, h);
  }) : c.call(this, g);
}
R("add");
R("append");
R("search");
R("searchCache");
R("update");
R("remove");
R("clear");
R("export");
R("import");
sa(Ba.prototype);
function R(a) {
  Ba.prototype[a] = function() {
    const b = this, c = [].slice.call(arguments);
    var d = c[c.length - 1];
    let e;
    "function" === typeof d && (e = d, c.pop());
    d = new Promise(function(f) {
      "export" === a && "function" === typeof c[0] && (c[0] = null);
      b.h[++Aa] = f;
      b.worker.postMessage({task:a, id:Aa, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function Ca(a, b, c) {
  return b ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/worker/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"](import.meta.dirname+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + ra.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof c ? c : import.meta.url.replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function Da(a, b = 0) {
  let c = [], d = [];
  b && (b = 250000 / b * 5000 | 0);
  for (const e of a.entries()) {
    d.push(e), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function Ea(a, b) {
  b || (b = new Map());
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b.set(d[0], d[1]);
  }
  return b;
}
function Fa(a, b = 0) {
  let c = [], d = [];
  b && (b = 250000 / b * 1000 | 0);
  for (const e of a.entries()) {
    d.push([e[0], Da(e[1])[0]]), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function Ga(a, b) {
  b || (b = new Map());
  for (let c = 0, d, e; c < a.length; c++) {
    d = a[c], e = b.get(d[0]), b.set(d[0], Ea(d[1], e));
  }
  return b;
}
function Ha(a) {
  let b = [], c = [];
  for (const d of a.keys()) {
    c.push(d), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function Ia(a, b) {
  b || (b = new Set());
  for (let c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function Ja(a, b, c, d, e, f, g = 0) {
  const h = d && d.constructor === Array;
  var k = h ? d.shift() : d;
  if (!k) {
    return this.export(a, b, e, f + 1);
  }
  if ((k = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(k))) && k.then) {
    const l = this;
    return k.then(function() {
      return Ja.call(l, a, b, c, h ? d : null, e, f, g + 1);
    });
  }
  return Ja.call(this, a, b, c, h ? d : null, e, f, g + 1);
}
function Ka(a, b) {
  let c = "";
  for (const d of a.entries()) {
    a = d[0];
    const e = d[1];
    let f = "";
    for (let g = 0, h; g < e.length; g++) {
      h = e[g] || [""];
      let k = "";
      for (let l = 0; l < h.length; l++) {
        k += (k ? "," : "") + ("string" === b ? '"' + h[l] + '"' : h[l]);
      }
      k = "[" + k + "]";
      f += (f ? "," : "") + k;
    }
    f = '["' + a + '",[' + f + "]]";
    c += (c ? "," : "") + f;
  }
  return c;
}
;function Na(a, b, c, d) {
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
function U(a) {
  if (!this || this.constructor !== U) {
    return new U(a);
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
        return Na(b, e || 0, f || b.length, !1);
      };
    }
    if ("splice" === d) {
      return function(e, f) {
        return Na(b, e || 0, f || b.length, !0);
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
U.prototype.clear = function() {
  this.index.length = 0;
};
U.prototype.destroy = function() {
  this.proxy = this.index = null;
};
U.prototype.push = function() {
};
function V(a = 8) {
  if (!this || this.constructor !== V) {
    return new V(a);
  }
  this.index = G();
  this.h = [];
  this.size = 0;
  32 < a ? (this.B = Oa, this.A = BigInt(a)) : (this.B = Pa, this.A = a);
}
V.prototype.get = function(a) {
  const b = this.index[this.B(a)];
  return b && b.get(a);
};
V.prototype.set = function(a, b) {
  var c = this.B(a);
  let d = this.index[c];
  d ? (c = d.size, d.set(a, b), (c -= d.size) && this.size++) : (this.index[c] = d = new Map([[a, b]]), this.h.push(d), this.size++);
};
function W(a = 8) {
  if (!this || this.constructor !== W) {
    return new W(a);
  }
  this.index = G();
  this.h = [];
  this.size = 0;
  32 < a ? (this.B = Oa, this.A = BigInt(a)) : (this.B = Pa, this.A = a);
}
W.prototype.add = function(a) {
  var b = this.B(a);
  let c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c), this.size++);
};
w = V.prototype;
w.has = W.prototype.has = function(a) {
  const b = this.index[this.B(a)];
  return b && b.has(a);
};
w.delete = W.prototype.delete = function(a) {
  const b = this.index[this.B(a)];
  b && b.delete(a) && this.size--;
};
w.clear = W.prototype.clear = function() {
  this.index = G();
  this.h = [];
  this.size = 0;
};
w.values = W.prototype.values = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].values()) {
      yield b;
    }
  }
};
w.keys = W.prototype.keys = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].keys()) {
      yield b;
    }
  }
};
w.entries = W.prototype.entries = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].entries()) {
      yield b;
    }
  }
};
function Pa(a) {
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
function Oa(a) {
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
;Qa.prototype.add = function(a, b, c) {
  da(a) && (b = a, a = fa(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (let h = 0, k; h < this.field.length; h++) {
      k = this.F[h];
      var d = this.index.get(this.field[h]);
      if ("function" === typeof k) {
        var e = k(b);
        e && d.add(a, e, !1, !0);
      } else {
        if (e = k.I, !e || e(b)) {
          k.constructor === String ? k = ["" + k] : M(k) && (k = [k]), Ra(b, k, this.J, 0, d, a, k[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.D.length; d++) {
        var f = this.D[d], g = this.R[d];
        e = this.tag.get(g);
        let h = G();
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
          f = fa(b, f);
        }
        if (e && f) {
          M(f) && (f = [f]);
          for (let k = 0, l, m; k < f.length; k++) {
            if (l = f[k], !h[l] && (h[l] = 1, (g = e.get(l)) ? m = g : e.set(l, m = []), !c || !m.includes(a))) {
              if (m.length === 2 ** 31 - 1) {
                g = new U(m);
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
        h = G();
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
            l = [l.V];
          } else if (M(l) || l.constructor === String) {
            h[l] = b[l];
            continue;
          }
          Sa(b, h, l, 0, l[0], m);
        }
      }
      this.store.set(a, h || b);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function Sa(a, b, c, d, e, f) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
        Sa(a, b, c, d, e);
      }
    } else {
      b = b[e] || (b[e] = G()), e = c[++d], Sa(a, b, c, d, e);
    }
  }
}
function Ra(a, b, c, d, e, f, g, h) {
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
          Ra(a, b, c, d, e, f, g, h);
        }
      } else {
        g = b[++d], Ra(a, b, c, d, e, f, g, h);
      }
    }
  } else {
    e.db && e.remove(f);
  }
}
;function Ta(a, b, c, d) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a, d ? X.call(this, a) : a;
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
      h > b && (g = g.slice(0, b), h = b);
      if (!e.length && h >= b) {
        return d ? X.call(this, g) : g;
      }
      e.push(g);
      b -= h;
      if (!b) {
        break;
      }
    }
  }
  e = 1 < e.length ? [].concat.apply([], e) : e[0];
  return d ? X.call(this, e) : e;
}
;function Ua(a, b, c) {
  var d = c[0];
  if (d.then) {
    return Promise.all(c).then(function(q) {
      return a[b].apply(a, q);
    });
  }
  if (d[0] && d[0].index) {
    return a[b].apply(a, d);
  }
  d = [];
  let e = [], f = 0, g = 0, h, k, l, m, p;
  for (let q = 0, r; q < c.length; q++) {
    if (r = c[q]) {
      var u = void 0;
      if (r.constructor === Y) {
        u = r.result;
      } else if (r.constructor === Array) {
        u = r;
      } else {
        f = r.limit || 0;
        g = r.offset || 0;
        l = r.suggest;
        k = r.resolve;
        h = (m = r.highlight && k) || r.enrich && k;
        let n;
        r.index ? a.index = n = r.index : n = a.index;
        if (r.query || r.tag) {
          if (!a.index) {
            throw Error("Resolver can't apply because the corresponding Index was never specified");
          }
          if (u = r.field || r.pluck) {
            if (!a.index.index) {
              throw Error("Resolver can't apply because the corresponding Document Index was not specified");
            }
            n = a.index.index.get(u);
            if (!n) {
              throw Error("Resolver can't apply because the specified Document Field '" + u + "' was not found");
            }
          }
          r.resolve = !1;
          u = n.search(r).result;
          r.resolve = k;
          m && (p = r.query);
        } else if (r.and) {
          u = a.and(r.and);
        } else if (r.or) {
          u = a.or(r.or);
        } else if (r.xor) {
          u = a.xor(r.xor);
        } else if (r.not) {
          u = a.not(r.not);
        } else {
          continue;
        }
      }
      if (u.then) {
        e.push(u);
      } else if (u.length) {
        d[q] = u;
      } else if (!l && ("and" === b || "xor" === b)) {
        d = [];
        break;
      }
    }
  }
  return {O:d, P:e, limit:f, offset:g, enrich:h, resolve:k, suggest:l, highlight:m, W:p};
}
;Y.prototype.or = function() {
  const {O:a, P:b, limit:c, offset:d, enrich:e, resolve:f} = Ua(this, "or", arguments);
  return Va.call(this, a, b, c, d, e, f);
};
function Va(a, b, c, d, e, f) {
  if (b.length) {
    const g = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (let k = 0, l; k < h.length; k++) {
        (l = h[k]).length && (a[k] = l);
      }
      return Va.call(g, a, [], c, d, e, f);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = Wa(a, c, d, !1, this.h), d = 0));
  return f ? this.resolve(c, d, e) : this;
}
;Y.prototype.and = function() {
  let a = this.result.length, b, c, d, e;
  if (!a) {
    const f = arguments[0];
    f && (a = !!f.suggest, e = f.resolve, b = f.limit, c = f.offset, d = f.enrich && e);
  }
  if (a) {
    const {O:f, P:g, limit:h, offset:k, enrich:l, resolve:m, suggest:p} = Ua(this, "and", arguments);
    return Xa.call(this, f, g, h, k, l, m, p);
  }
  return e ? this.resolve(b, c, d) : this;
};
function Xa(a, b, c, d, e, f, g) {
  if (b.length) {
    const h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return Xa.call(h, a, [], c, d, e, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (b = ha(a)) {
        return this.result = Ya(a, b, c, d, g, this.h, f), f ? e ? X.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, d, e) : this;
}
;Y.prototype.xor = function() {
  const {O:a, P:b, limit:c, offset:d, enrich:e, resolve:f, suggest:g} = Ua(this, "xor", arguments);
  return Za.call(this, a, b, c, d, e, f, g);
};
function Za(a, b, c, d, e, f, g) {
  if (b.length) {
    const h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return Za.call(h, a, [], c, d, e, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = $a.call(this, a, c, d, f, this.h), f ? e ? X.call(this.index, this.result) : this.result : this;
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, d, e) : this;
}
function $a(a, b, c, d, e) {
  const f = [], g = G();
  let h = 0;
  for (let k = 0, l; k < a.length; k++) {
    if (l = a[k]) {
      h < l.length && (h = l.length);
      for (let m = 0, p; m < l.length; m++) {
        if (p = l[m]) {
          for (let u = 0, q; u < p.length; u++) {
            q = p[u], g[q] = g[q] ? 2 : 1;
          }
        }
      }
    }
  }
  for (let k = 0, l, m = 0; k < h; k++) {
    for (let p = 0, u; p < a.length; p++) {
      if (u = a[p]) {
        if (l = u[k]) {
          for (let q = 0, r; q < l.length; q++) {
            if (r = l[q], 1 === g[r]) {
              if (c) {
                c--;
              } else {
                if (d) {
                  if (f.push(r), f.length === b) {
                    return f;
                  }
                } else {
                  const n = k + (p ? e : 0);
                  f[n] || (f[n] = []);
                  f[n].push(r);
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
  const {O:a, P:b, limit:c, offset:d, enrich:e, resolve:f, suggest:g} = Ua(this, "not", arguments);
  return ab.call(this, a, b, c, d, e, f, g);
};
function ab(a, b, c, d, e, f, g) {
  if (b.length) {
    const h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return ab.call(h, a, [], c, d, e, f, g);
    });
  }
  if (a.length && this.result.length) {
    this.result = bb.call(this, a, c, d, f);
  } else if (f) {
    return this.resolve(c, d, e);
  }
  return f ? e ? X.call(this.index, this.result) : this.result : this;
}
function bb(a, b, c, d) {
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
;function cb(a, b, c, d, e) {
  let f, g, h;
  "string" === typeof e ? (f = e, e = "") : f = e.template;
  if (!f) {
    throw Error('No template pattern was specified by the search option "highlight"');
  }
  g = f.indexOf("$1");
  if (-1 === g) {
    throw Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + f);
  }
  h = f.substring(g + 2);
  g = f.substring(0, g);
  let k = e && e.boundary, l = !e || !1 !== e.clip, m = e && e.merge && h && g && new RegExp(h + " " + g, "g");
  e = e && e.ellipsis;
  var p = 0;
  if ("object" === typeof e) {
    var u = e.template;
    p = u.length - 2;
    e = e.pattern;
  }
  "string" !== typeof e && (e = !1 === e ? "" : "...");
  p && (e = u.replace("$1", e));
  u = e.length - p;
  let q, r;
  "object" === typeof k && (q = k.before, 0 === q && (q = -1), r = k.after, 0 === r && (r = -1), k = k.total || 9e5);
  p = new Map();
  for (let La = 0, ba, fb, oa; La < b.length; La++) {
    let pa;
    if (d) {
      pa = b, oa = d;
    } else {
      var n = b[La];
      oa = n.field;
      if (!oa) {
        continue;
      }
      pa = n.result;
    }
    fb = c.get(oa);
    ba = fb.encoder;
    n = p.get(ba);
    "string" !== typeof n && (n = ba.encode(a), p.set(ba, n));
    for (let wa = 0; wa < pa.length; wa++) {
      var t = pa[wa].doc;
      if (!t) {
        continue;
      }
      t = fa(t, oa);
      if (!t) {
        continue;
      }
      var x = t.trim().split(/\s+/);
      if (!x.length) {
        continue;
      }
      t = "";
      var y = [];
      let xa = [];
      var D = -1, H = -1, B = 0;
      for (var v = 0; v < x.length; v++) {
        var A = x[v], I = ba.encode(A);
        I = 1 < I.length ? I.join(" ") : I[0];
        let z;
        if (I && A) {
          var C = A.length, J = (ba.split ? A.replace(ba.split, "") : A).length - I.length, F = "", S = 0;
          for (var ca = 0; ca < n.length; ca++) {
            var Q = n[ca];
            if (Q) {
              var L = Q.length;
              L += J;
              S && L <= S || (Q = I.indexOf(Q), -1 < Q && (F = (Q ? A.substring(0, Q) : "") + g + A.substring(Q, Q + L) + h + (Q + L < C ? A.substring(Q + L) : ""), S = L, z = !0));
            }
          }
          F && (k && (0 > D && (D = t.length + (t ? 1 : 0)), H = t.length + (t ? 1 : 0) + F.length, B += C, xa.push(y.length), y.push({match:F})), t += (t ? " " : "") + F);
        }
        if (!z) {
          A = x[v], t += (t ? " " : "") + A, k && y.push({text:A});
        } else if (k && B >= k) {
          break;
        }
      }
      B = xa.length * (f.length - 2);
      if (q || r || k && t.length - B > k) {
        if (B = k + B - 2 * u, v = H - D, 0 < q && (v += q), 0 < r && (v += r), v <= B) {
          x = q ? D - (0 < q ? q : 0) : D - ((B - v) / 2 | 0), y = r ? H + (0 < r ? r : 0) : x + B, l || (0 < x && " " !== t.charAt(x) && " " !== t.charAt(x - 1) && (x = t.indexOf(" ", x), 0 > x && (x = 0)), y < t.length && " " !== t.charAt(y - 1) && " " !== t.charAt(y) && (y = t.lastIndexOf(" ", y), y < H ? y = H : ++y)), t = (x ? e : "") + t.substring(x, y) + (y < t.length ? e : "");
        } else {
          H = [];
          D = {};
          B = {};
          v = {};
          A = {};
          I = {};
          F = J = C = 0;
          for (ca = S = 1;;) {
            var T = void 0;
            for (let z = 0, K; z < xa.length; z++) {
              K = xa[z];
              if (F) {
                if (J !== F) {
                  if (v[z + 1]) {
                    continue;
                  }
                  K += F;
                  if (D[K]) {
                    C -= u;
                    B[z + 1] = 1;
                    v[z + 1] = 1;
                    continue;
                  }
                  if (K >= y.length - 1) {
                    if (K >= y.length) {
                      v[z + 1] = 1;
                      K >= x.length && (B[z + 1] = 1);
                      continue;
                    }
                    C -= u;
                  }
                  t = y[K].text;
                  if (L = r && I[z]) {
                    if (0 < L) {
                      if (t.length > L) {
                        if (v[z + 1] = 1, l) {
                          t = t.substring(0, L);
                        } else {
                          continue;
                        }
                      }
                      (L -= t.length) || (L = -1);
                      I[z] = L;
                    } else {
                      v[z + 1] = 1;
                      continue;
                    }
                  }
                  if (C + t.length + 1 <= k) {
                    t = " " + t, H[z] += t;
                  } else if (l) {
                    T = k - C - 1, 0 < T && (t = " " + t.substring(0, T), H[z] += t), v[z + 1] = 1;
                  } else {
                    v[z + 1] = 1;
                    continue;
                  }
                } else {
                  if (v[z]) {
                    continue;
                  }
                  K -= J;
                  if (D[K]) {
                    C -= u;
                    v[z] = 1;
                    B[z] = 1;
                    continue;
                  }
                  if (0 >= K) {
                    if (0 > K) {
                      v[z] = 1;
                      B[z] = 1;
                      continue;
                    }
                    C -= u;
                  }
                  t = y[K].text;
                  if (L = q && A[z]) {
                    if (0 < L) {
                      if (t.length > L) {
                        if (v[z] = 1, l) {
                          t = t.substring(t.length - L);
                        } else {
                          continue;
                        }
                      }
                      (L -= t.length) || (L = -1);
                      A[z] = L;
                    } else {
                      v[z] = 1;
                      continue;
                    }
                  }
                  if (C + t.length + 1 <= k) {
                    t += " ", H[z] = t + H[z];
                  } else if (l) {
                    T = t.length + 1 - (k - C), 0 <= T && T < t.length && (t = t.substring(T) + " ", H[z] = t + H[z]), v[z] = 1;
                  } else {
                    v[z] = 1;
                    continue;
                  }
                }
              } else {
                t = y[K].match;
                q && (A[z] = q);
                r && (I[z] = r);
                z && C++;
                let Ma;
                K ? !z && u && (C += u) : (B[z] = 1, v[z] = 1);
                K >= x.length - 1 ? Ma = 1 : K < y.length - 1 && y[K + 1].match ? Ma = 1 : u && (C += u);
                C -= f.length - 2;
                if (!z || C + t.length <= k) {
                  H[z] = t;
                } else {
                  T = S = ca = B[z] = 0;
                  break;
                }
                Ma && (B[z + 1] = 1, v[z + 1] = 1);
              }
              C += t.length;
              T = D[K] = 1;
            }
            if (T) {
              J === F ? F++ : J++;
            } else {
              J === F ? S = 0 : ca = 0;
              if (!S && !ca) {
                break;
              }
              S ? (J++, F = J) : F++;
            }
          }
          t = "";
          for (let z = 0, K; z < H.length; z++) {
            K = (z && B[z] ? " " : (z && !e ? " " : "") + e) + H[z], t += K;
          }
          e && !B[H.length] && (t += e);
        }
      }
      m && (t = t.replace(m, " "));
      pa[wa].highlight = t;
    }
    if (d) {
      break;
    }
  }
  return b;
}
;function Y(a, b) {
  if (!this || this.constructor !== Y) {
    return new Y(a, b);
  }
  if (a && a.index) {
    return a.resolve = !1, this.index = a.index, this.h = a.boost || 0, this.result = this.index.search(a).result, this;
  }
  this.index = b || null;
  this.result = a || [];
  this.h = 0;
}
Y.prototype.limit = function(a) {
  if (this.result.length) {
    const b = [];
    for (let c = 0, d; c < this.result.length; c++) {
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
Y.prototype.offset = function(a) {
  if (this.result.length) {
    const b = [];
    for (let c = 0, d; c < this.result.length; c++) {
      if (d = this.result[c]) {
        d.length <= a ? a -= d.length : (b[c] = d.slice(a), a = 0);
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
  const d = this.index;
  let e = this.result;
  this.result = this.index = null;
  e.length && ("object" === typeof a && (c = a.enrich, b = a.offset, a = a.limit), e = Ta.call(d, e, a || 100, b, c));
  return e;
};
function Ya(a, b, c, d, e, f, g) {
  const h = a.length;
  let k = [], l, m;
  l = G();
  for (let p = 0, u, q, r, n; p < b; p++) {
    for (let t = 0; t < h; t++) {
      if (r = a[t], p < r.length && (u = r[p])) {
        for (let x = 0; x < u.length; x++) {
          q = u[x];
          (m = l[q]) ? l[q]++ : (m = 0, l[q] = 1);
          n = k[m] || (k[m] = []);
          if (!g) {
            let y = p + (t || !e ? 0 : f || 0);
            n = n[y] || (n[y] = []);
          }
          n.push(q);
          if (g && c && m === h - 1 && n.length - d === c) {
            return d ? n.slice(d) : n;
          }
        }
      }
    }
  }
  if (a = k.length) {
    if (e) {
      k = 1 < k.length ? Wa(k, c, d, g, f) : (k = k[0]).length > c || d ? k.slice(d, c + d) : k;
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
          for (let p = 0, u; p < k.length; p++) {
            if (u = k[p]) {
              if (d && u.length > d) {
                d -= u.length;
              } else {
                if (c && u.length > c || d) {
                  u = u.slice(d, c + d), c -= u.length, d && (d -= u.length);
                }
                e.push(u);
                if (!c) {
                  break;
                }
              }
            }
          }
          k = e;
        }
      }
    }
  }
  return k;
}
function Wa(a, b, c, d, e) {
  const f = [], g = G();
  let h;
  var k = a.length;
  let l;
  if (d) {
    for (e = k - 1; 0 <= e; e--) {
      if (l = (d = a[e]) && d.length) {
        for (k = 0; k < l; k++) {
          if (h = d[k], !g[h]) {
            if (g[h] = 1, c) {
              c--;
            } else {
              if (f.push(h), f.length === b) {
                return f;
              }
            }
          }
        }
      }
    }
  } else {
    for (let m = k - 1, p, u = 0; 0 <= m; m--) {
      p = a[m];
      for (let q = 0; q < p.length; q++) {
        if (l = (d = p[q]) && d.length) {
          for (let r = 0; r < l; r++) {
            if (h = d[r], !g[h]) {
              if (g[h] = 1, c) {
                c--;
              } else {
                let n = (q + (m < k - 1 ? e || 0 : 0)) / (m + 1) | 0;
                (f[n] || (f[n] = [])).push(h);
                if (++u === b) {
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
function db(a, b, c) {
  const d = G(), e = [];
  for (let f = 0, g; f < b.length; f++) {
    g = b[f];
    for (let h = 0; h < g.length; h++) {
      d[g[h]] = 1;
    }
  }
  if (c) {
    for (let f = 0, g; f < a.length; f++) {
      g = a[f], d[g] && (e.push(g), d[g] = 0);
    }
  } else {
    for (let f = 0, g, h; f < a.result.length; f++) {
      for (g = a.result[f], b = 0; b < g.length; b++) {
        h = g[b], d[h] && ((e[f] || (e[f] = [])).push(h), d[h] = 0);
      }
    }
  }
  return e;
}
;G();
Qa.prototype.search = function(a, b, c, d) {
  c || (!b && da(a) ? (c = a, a = "") : da(b) && (c = b, b = 0));
  if (c && c.cache) {
    c.cache = !1;
    var e = this.searchCache(a, b, c);
    c.cache = !0;
    return e;
  }
  let f = [];
  var g = [];
  let h, k, l, m, p;
  let u = 0, q = !0, r;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    h = c.pluck;
    k = c.merge;
    m = c.boost;
    p = h || c.field || (p = c.index) && (p.index ? null : p);
    var n = this.tag && c.tag;
    l = c.suggest;
    q = !1 !== c.resolve;
    this.store && c.highlight && !q ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && c.enrich && !q && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    r = q && this.store && c.highlight;
    e = !!r || q && this.store && c.enrich;
    b = c.limit || b;
    var t = c.offset || 0;
    b || (b = q ? 100 : 0);
    if (n && (!this.db || !d)) {
      n.constructor !== Array && (n = [n]);
      var x = [];
      for (let B = 0, v; B < n.length; B++) {
        v = n[B];
        if (M(v)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (v.field && v.tag) {
          var y = v.tag;
          if (y.constructor === Array) {
            for (var D = 0; D < y.length; D++) {
              x.push(v.field, y[D]);
            }
          } else {
            x.push(v.field, y);
          }
        } else {
          y = Object.keys(v);
          for (let A = 0, I, C; A < y.length; A++) {
            if (I = y[A], C = v[I], C.constructor === Array) {
              for (D = 0; D < C.length; D++) {
                x.push(I, C[D]);
              }
            } else {
              x.push(I, C);
            }
          }
        }
      }
      if (!x.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      n = x;
      if (!a) {
        g = [];
        if (x.length) {
          for (n = 0; n < x.length; n += 2) {
            if (this.db) {
              d = this.index.get(x[n]);
              if (!d) {
                console.warn("Tag '" + x[n] + ":" + x[n + 1] + "' will be skipped because there is no field '" + x[n] + "'.");
                continue;
              }
              g.push(d = d.db.tag(x[n + 1], b, t, e));
            } else {
              d = eb.call(this, x[n], x[n + 1], b, t, e);
            }
            f.push(q ? {field:x[n], tag:x[n + 1], result:d} : [d]);
          }
        }
        if (g.length) {
          const B = this;
          return Promise.all(g).then(function(v) {
            for (let A = 0; A < v.length; A++) {
              q ? f[A].result = v[A] : f[A] = v[A];
            }
            return q ? f : new Y(1 < f.length ? Ya(f, 1, 0, 0, l, m) : f[0], B);
          });
        }
        return q ? f : new Y(1 < f.length ? Ya(f, 1, 0, 0, l, m) : f[0], this);
      }
    }
    if (!q && !h) {
      if (p = p || this.field) {
        M(p) ? h = p : (p.constructor === Array && 1 === p.length && (p = p[0]), h = p.field || p.index);
      }
      if (!h) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    p && p.constructor !== Array && (p = [p]);
  }
  p || (p = this.field);
  let H;
  x = (this.worker || this.db) && !d && [];
  for (let B = 0, v, A, I; B < p.length; B++) {
    A = p[B];
    if (this.db && this.tag && !this.F[B]) {
      continue;
    }
    let C;
    M(A) || (C = A, A = C.field, a = C.query || a, b = aa(C.limit, b), t = aa(C.offset, t), l = aa(C.suggest, l), r = q && this.store && aa(C.highlight, r), e = !!r || q && this.store && aa(C.enrich, e));
    if (d) {
      v = d[B];
    } else {
      if (y = C || c, D = this.index.get(A), n && (this.db && (y.tag = n, H = D.db.support_tag_search, y.field = p), H || (y.enrich = !1)), x) {
        x[B] = D.search(a, b, y);
        y && e && (y.enrich = e);
        continue;
      } else {
        v = D.search(a, b, y), y && e && (y.enrich = e);
      }
    }
    I = v && (q ? v.length : v.result.length);
    if (n && I) {
      y = [];
      D = 0;
      if (this.db && d) {
        if (!H) {
          for (let J = p.length; J < d.length; J++) {
            let F = d[J];
            if (F && F.length) {
              D++, y.push(F);
            } else if (!l) {
              return q ? f : new Y(f, this);
            }
          }
        }
      } else {
        for (let J = 0, F, S; J < n.length; J += 2) {
          F = this.tag.get(n[J]);
          if (!F) {
            if (console.warn("Tag '" + n[J] + ":" + n[J + 1] + "' will be skipped because there is no field '" + n[J] + "'."), l) {
              continue;
            } else {
              return q ? f : new Y(f, this);
            }
          }
          if (S = (F = F && F.get(n[J + 1])) && F.length) {
            D++, y.push(F);
          } else if (!l) {
            return q ? f : new Y(f, this);
          }
        }
      }
      if (D) {
        v = db(v, y, q);
        I = v.length;
        if (!I && !l) {
          return q ? v : new Y(v, this);
        }
        D--;
      }
    }
    if (I) {
      g[u] = A, f.push(v), u++;
    } else if (1 === p.length) {
      return q ? f : new Y(f, this);
    }
  }
  if (x) {
    if (this.db && n && n.length && !H) {
      for (e = 0; e < n.length; e += 2) {
        g = this.index.get(n[e]);
        if (!g) {
          if (console.warn("Tag '" + n[e] + ":" + n[e + 1] + "' was not found because there is no field '" + n[e] + "'."), l) {
            continue;
          } else {
            return q ? f : new Y(f, this);
          }
        }
        x.push(g.db.tag(n[e + 1], b, t, !1));
      }
    }
    const B = this;
    return Promise.all(x).then(function(v) {
      return v.length ? B.search(a, b, c, v) : v;
    });
  }
  if (!u) {
    return q ? f : new Y(f, this);
  }
  if (h && (!e || !this.store)) {
    return f = f[0], q || (f.index = this), f;
  }
  x = [];
  for (t = 0; t < g.length; t++) {
    n = f[t];
    e && n.length && "undefined" === typeof n[0].doc && (this.db ? x.push(n = this.index.get(this.field[0]).db.enrich(n)) : n = X.call(this, n));
    if (h) {
      return q ? r ? cb(a, n, this.index, h, r) : n : new Y(n, this);
    }
    f[t] = {field:g[t], result:n};
  }
  if (e && this.db && x.length) {
    const B = this;
    return Promise.all(x).then(function(v) {
      for (let A = 0; A < v.length; A++) {
        f[A].result = v[A];
      }
      r && (f = cb(a, f, B.index, h, r));
      return k ? gb(f) : f;
    });
  }
  r && (f = cb(a, f, this.index, h, r));
  return k ? gb(f) : f;
};
function gb(a) {
  const b = [], c = G(), d = G();
  for (let e = 0, f, g, h, k, l, m, p; e < a.length; e++) {
    f = a[e];
    g = f.field;
    h = f.result;
    for (let u = 0; u < h.length; u++) {
      if (l = h[u], "object" !== typeof l ? l = {id:k = l} : k = l.id, (m = c[k]) ? m.push(g) : (l.field = c[k] = [g], b.push(l)), p = l.highlight) {
        m = d[k], m || (d[k] = m = {}, l.highlight = m), m[g] = p;
      }
    }
  }
  return b;
}
function eb(a, b, c, d, e) {
  a = this.tag.get(a);
  if (!a) {
    return [];
  }
  a = a.get(b);
  if (!a) {
    return [];
  }
  b = a.length - d;
  if (0 < b) {
    if (c && b > c || d) {
      a = a.slice(d, d + c);
    }
    e && (a = X.call(this, a));
  }
  return a;
}
function X(a) {
  if (!this || !this.store) {
    return a;
  }
  const b = Array(a.length);
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {id:d, doc:this.store.get(d)};
  }
  return b;
}
;const hb = {normalize:!1, numeric:!1, dedupe:!1};
const ib = {};
const jb = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const kb = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), lb = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const mb = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var nb = {Exact:hb, Default:ib, Normalize:ib, LatinBalance:{mapper:jb}, LatinAdvanced:{mapper:jb, matcher:kb, replacer:lb}, LatinExtra:{mapper:jb, replacer:lb.concat([/(?!^)[aeo]/g, ""]), matcher:kb}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let d = b.charAt(0), e = mb[d];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = mb[g]) || g === e || (d += g, e = g, 4 !== d.length)); f++) {
    }
    a[c] = d;
  }
}}, CJK:{split:""}, LatinExact:hb, LatinDefault:ib, LatinSimple:ib};
function Qa(a) {
  if (!this || this.constructor !== Qa) {
    return new Qa(a);
  }
  const b = a.document || a.doc || a;
  let c, d;
  this.F = [];
  this.field = [];
  this.J = [];
  this.key = (c = b.key || b.id) && ob(c, this.J) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? d ? new W(d) : new Set() : d ? new V(d) : new Map();
  this.C = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (d ? new V(d) : new Map());
  this.cache = (c = a.cache || null) && new pb(c);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = qb.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.D = [];
      this.R = [];
      for (let e = 0, f, g; e < c.length; e++) {
        f = c[e];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.D[e] = f.custom : (this.D[e] = ob(g, this.J), f.filter && ("string" === typeof this.D[e] && (this.D[e] = new String(this.D[e])), this.D[e].I = f.filter));
        this.R[e] = g;
        this.tag.set(g, new Map());
      }
    }
  }
  if (this.worker) {
    this.fastupdate = !1;
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
          let l = h[1];
          l.then && (l = f[g], e.index.set(k, l), g++);
        }
        return e;
      });
    }
  } else {
    a.db && (this.fastupdate = !1, this.mount(a.db));
  }
}
w = Qa.prototype;
w.mount = function(a) {
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
  const d = {db:a.db, type:a.type, fastupdate:a.fastupdate};
  for (let f = 0, g, h; f < b.length; f++) {
    d.field = h = b[f];
    g = this.index.get(h);
    const k = new a.constructor(a.id, d);
    k.id = a.id;
    c[f] = k.mount(g);
    g.document = !0;
    f ? g.bypass = !0 : g.store = this.store;
  }
  const e = this;
  return this.db = Promise.all(c).then(function() {
    e.db = !0;
  });
};
w.commit = async function(a, b) {
  const c = [];
  for (const d of this.index.values()) {
    c.push(d.commit(a, b));
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
function qb(a, b) {
  const c = new Map();
  let d = b.index || b.field || b;
  M(d) && (d = [d]);
  for (let f = 0, g, h; f < d.length; f++) {
    g = d[f];
    M(g) || (h = g, g = g.field);
    h = da(h) ? Object.assign({}, a, h) : a;
    if (this.worker) {
      var e = void 0;
      e = (e = h.encoder) && e.encode ? e : new na("string" === typeof e ? nb[e] : e || {});
      e = new Ba(h, e);
      c.set(g, e);
    }
    this.worker || c.set(g, new P(h, this.reg));
    h.custom ? this.F[f] = h.custom : (this.F[f] = ob(g, this.J), h.filter && ("string" === typeof this.F[f] && (this.F[f] = new String(this.F[f])), this.F[f].I = h.filter));
    this.field[f] = g;
  }
  if (this.C) {
    a = b.store;
    M(a) && (a = [a]);
    for (let f = 0, g, h; f < a.length; f++) {
      g = a[f], h = g.field || g, g.custom ? (this.C[f] = g.custom, g.custom.V = h) : (this.C[f] = ob(h, this.J), g.filter && ("string" === typeof this.C[f] && (this.C[f] = new String(this.C[f])), this.C[f].I = g.filter));
    }
  }
  return c;
}
function ob(a, b) {
  const c = a.split(":");
  let d = 0;
  for (let e = 0; e < c.length; e++) {
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
  da(a) && (a = fa(a, this.key));
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
  "object" === typeof a && (b = a, a = fa(b, this.key));
  this.store.set(a, b);
  return this;
};
w.searchCache = rb;
w.export = function(a, b, c = 0, d = 0) {
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
      f = Ha(this.reg);
      b = null;
      break;
    case 1:
      e = "tag";
      f = this.tag && Fa(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      e = "doc";
      f = this.store && Da(this.store);
      b = null;
      break;
    default:
      return;
  }
  return Ja.call(this, a, b, e, f, c, d);
};
w.import = function(a, b) {
  var c = a.split(".");
  "json" === c[c.length - 1] && c.pop();
  const d = 2 < c.length ? c[0] : "";
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
        this.reg = Ia(b, this.reg);
        for (let e = 0, f; e < this.field.length; e++) {
          f = this.index.get(this.field[e]), f.fastupdate = !1, f.reg = this.reg;
        }
        if (this.worker) {
          b = [];
          for (const e of this.index.values()) {
            b.push(e.import(a));
          }
          return Promise.all(b);
        }
        break;
      case "tag":
        this.tag = Ga(b, this.tag);
        break;
      case "doc":
        this.store = Ea(b, this.store);
    }
  }
};
sa(Qa.prototype);
function rb(a, b, c) {
  const d = (b ? "" + a : "object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new pb());
  let e = this.cache.get(d);
  if (!e) {
    e = this.search(a, b, c);
    if (e.then) {
      const f = this;
      e.then(function(g) {
        f.cache.set(d, g);
        return g;
      });
    }
    this.cache.set(d, e);
  }
  return e;
}
function pb(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
pb.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
pb.prototype.get = function(a) {
  const b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
pb.prototype.remove = function(a) {
  for (const b of this.cache) {
    const c = b[0];
    b[1].includes(a) && this.cache.delete(c);
  }
};
pb.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
P.prototype.remove = function(a, b) {
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
      sb(this.map, a), this.depth && sb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.T && tb(this));
  this.cache && this.cache.remove(a);
  return this;
};
function sb(a, b) {
  let c = 0;
  var d = "undefined" === typeof b;
  if (a.constructor === Array) {
    for (let e = 0, f, g; e < a.length; e++) {
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
    for (let e of a.entries()) {
      d = e[0];
      const f = sb(e[1], b);
      f ? c += f : a.delete(d);
    }
  }
  return c;
}
;const ub = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
P.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    d = this.depth;
    b = this.encoder.encode(b, !d);
    const l = b.length;
    if (l) {
      const m = G(), p = G(), u = this.resolution;
      for (let q = 0; q < l; q++) {
        let r = b[this.rtl ? l - 1 - q : q];
        var e = r.length;
        if (e && (d || !p[r])) {
          var f = this.score ? this.score(b, r, q, null, 0) : vb(u, l, q), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (let n = 0, t; n < e; n++) {
                  for (f = e; f > n; f--) {
                    g = r.substring(n, f);
                    t = this.rtl ? e - 1 - n : n;
                    var h = this.score ? this.score(b, r, q, g, t) : vb(u, l, q, e, t);
                    wb(this, p, g, h, a, c);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  g = r[this.rtl ? e - 1 - h : h] + g;
                  var k = this.score ? this.score(b, r, q, g, h) : vb(u, l, q, e, h);
                  wb(this, p, g, k, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  g += r[this.rtl ? e - 1 - h : h], wb(this, p, g, f, a, c);
                }
                break;
              }
            default:
              if (wb(this, p, r, f, a, c), d && 1 < l && q < l - 1) {
                for (e = G(), g = this.U, f = r, h = Math.min(d + 1, this.rtl ? q + 1 : l - q), e[f] = 1, k = 1; k < h; k++) {
                  if ((r = b[this.rtl ? l - 1 - q - k : q + k]) && !e[r]) {
                    e[r] = 1;
                    const n = this.score ? this.score(b, f, q, r, k - 1) : vb(g + (l / 2 > g ? 0 : 1), l, q, h - 1, k - 1), t = this.bidirectional && r > f;
                    wb(this, m, t ? f : r, n, a, c, t ? r : f);
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
  this.db && (b || this.commit_task.push({del:a}), this.T && tb(this));
  return this;
};
function wb(a, b, c, d, e, f, g) {
  let h = g ? a.ctx : a.map, k;
  if (!b[c] || g && !(k = b[c])[g]) {
    if (g ? (b = k || (b[c] = G()), b[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : b[c] = 1, (k = h.get(c)) ? h = k : h.set(c, h = k = []), h = h[d] || (h[d] = []), !f || !h.includes(e)) {
      if (h.length === 2 ** 31 - 1) {
        b = new U(h);
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
function vb(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;P.prototype.search = function(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : (c = a, a = ""));
  if (c && c.cache) {
    return c.cache = !1, a = this.searchCache(a, b, c), c.cache = !0, a;
  }
  let d = [], e, f, g, h = 0, k, l, m, p, u;
  c && (a = c.query || a, b = c.limit || b, h = c.offset || 0, f = c.context, g = c.suggest, u = (k = c.resolve) && c.enrich, m = c.boost, p = c.resolution, l = this.db && c.tag);
  "undefined" === typeof k && (k = this.resolve);
  f = this.depth && !1 !== f;
  let q = this.encoder.encode(a, !f);
  e = q.length;
  b = b || (k ? 100 : 0);
  if (1 === e) {
    return xb.call(this, q[0], "", b, h, k, u, l);
  }
  if (2 === e && f && !g) {
    return xb.call(this, q[1], q[0], b, h, k, u, l);
  }
  let r = G(), n = 0, t;
  f && (t = q[0], n = 1);
  p || 0 === p || (p = t ? this.U : this.resolution);
  if (this.db) {
    if (this.db.search && (c = this.db.search(this, q, b, h, g, k, u, l), !1 !== c)) {
      return c;
    }
    const x = this;
    return async function() {
      for (let y, D; n < e; n++) {
        if ((D = q[n]) && !r[D]) {
          r[D] = 1;
          y = await yb(x, D, t, 0, 0, !1, !1);
          if (y = zb(y, d, g, p)) {
            d = y;
            break;
          }
          t && (g && y && d.length || (t = D));
        }
        g && t && n === e - 1 && !d.length && (p = x.resolution, t = "", n = -1, r = G());
      }
      return Ab(d, p, b, h, g, m, k);
    }();
  }
  for (let x, y; n < e; n++) {
    if ((y = q[n]) && !r[y]) {
      r[y] = 1;
      x = yb(this, y, t, 0, 0, !1, !1);
      if (x = zb(x, d, g, p)) {
        d = x;
        break;
      }
      t && (g && x && d.length || (t = y));
    }
    g && t && n === e - 1 && !d.length && (p = this.resolution, t = "", n = -1, r = G());
  }
  return Ab(d, p, b, h, g, m, k);
};
function Ab(a, b, c, d, e, f, g) {
  let h = a.length, k = a;
  if (1 < h) {
    k = Ya(a, b, c, d, e, f, g);
  } else if (1 === h) {
    return g ? Ta.call(null, a[0], c, d) : new Y(a[0], this);
  }
  return g ? k : new Y(k, this);
}
function xb(a, b, c, d, e, f, g) {
  a = yb(this, a, b, c, d, e, f, g);
  return this.db ? a.then(function(h) {
    return e ? h || [] : new Y(h, this);
  }) : a && a.length ? e ? Ta.call(this, a, c, d) : new Y(a, this) : e ? [] : new Y([], this);
}
function zb(a, b, c, d) {
  let e = [];
  if (a && a.length) {
    if (a.length <= d) {
      b.push(a);
      return;
    }
    for (let f = 0, g; f < d; f++) {
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
function yb(a, b, c, d, e, f, g, h) {
  let k;
  c && (k = a.bidirectional && b > c) && (k = c, c = b, b = k);
  if (a.db) {
    return a.db.get(b, c, d, e, f, g, h);
  }
  a = c ? (a = a.ctx.get(c)) && a.get(b) : a.map.get(b);
  return a;
}
;function P(a, b) {
  if (!this || this.constructor !== P) {
    return new P(a);
  }
  if (a) {
    var c = M(a) ? a : a.preset;
    c && (ub[c] || console.warn("Preset not found: " + c), a = Object.assign({}, ub[c], a));
  } else {
    a = {};
  }
  c = a.context;
  const d = !0 === c ? {depth:1} : c || {}, e = M(a.encoder) ? nb[a.encoder] : a.encode || a.encoder || {};
  this.encoder = e.encode ? e : "object" === typeof e ? new na(e) : {encode:e};
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
  this.U = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new pb(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.T = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
w = P.prototype;
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
function tb(a) {
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
  const c = this, d = this.remove(a);
  return d && d.then ? d.then(() => c.add(a, b)) : this.add(a, b);
};
w.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  sb(this.map);
  this.depth && sb(this.ctx);
  return this;
};
w.searchCache = rb;
w.export = function(a, b, c = 0, d = 0) {
  let e, f;
  switch(d) {
    case 0:
      e = "reg";
      f = Ha(this.reg);
      break;
    case 1:
      e = "cfg";
      f = null;
      break;
    case 2:
      e = "map";
      f = Da(this.map, this.reg.size);
      break;
    case 3:
      e = "ctx";
      f = Fa(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return Ja.call(this, a, b, e, f, c, d);
};
w.import = function(a, b) {
  if (b) {
    switch("string" === typeof b && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Ia(b, this.reg);
        break;
      case "map":
        this.map = Ea(b, this.map);
        break;
      case "ctx":
        this.ctx = Ga(b, this.ctx);
    }
  }
};
w.serialize = function(a = !0) {
  let b = "", c = "", d = "";
  if (this.reg.size) {
    let f;
    for (var e of this.reg.keys()) {
      f || (f = typeof e), b += (b ? "," : "") + ("string" === f ? '"' + e + '"' : e);
    }
    b = "index.reg=new Set([" + b + "]);";
    c = Ka(this.map, f);
    c = "index.map=new Map([" + c + "]);";
    for (const g of this.ctx.entries()) {
      e = g[0];
      let h = Ka(g[1], f);
      h = "new Map([" + h + "])";
      h = '["' + e + '",' + h + "]";
      d += (d ? "," : "") + h;
    }
    d = "index.ctx=new Map([" + d + "]);";
  }
  return a ? "function inject(index){" + b + c + d + "}" : b + c + d;
};
sa(P.prototype);
const Bb = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), Cb = ["map", "ctx", "tag", "reg", "cfg"], Db = G();
function Eb(a, b = {}) {
  if (!this || this.constructor !== Eb) {
    return new Eb(a, b);
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
w = Eb.prototype;
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
  Db[a.id] || (Db[a.id] = []);
  Db[a.id].push(a.field);
  const b = Bb.open(a.id, 1);
  b.onupgradeneeded = function() {
    const c = a.db = this.result;
    for (let d = 0, e; d < Cb.length; d++) {
      e = Cb[d];
      for (let f = 0, g; f < Db[a.id].length; f++) {
        g = Db[a.id][f], c.objectStoreNames.contains(e + ("reg" !== e ? g ? ":" + g : "" : "")) || c.createObjectStore(e + ("reg" !== e ? g ? ":" + g : "" : ""));
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
  const a = Bb.deleteDatabase(this.id);
  return Z(a);
};
w.clear = function() {
  const a = [];
  for (let c = 0, d; c < Cb.length; c++) {
    d = Cb[c];
    for (let e = 0, f; e < Db[this.id].length; e++) {
      f = Db[this.id][e], a.push(d + ("reg" !== d ? f ? ":" + f : "" : ""));
    }
  }
  const b = this.db.transaction(a, "readwrite");
  for (let c = 0; c < a.length; c++) {
    b.objectStore(a[c]).clear();
  }
  return Z(b);
};
w.get = function(a, b, c = 0, d = 0, e = !0, f = !1) {
  a = this.db.transaction((b ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((b ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(b ? b + ":" + a : a);
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
          for (let u = d; u < p; u++) {
            k.push(m[u]);
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
w.tag = function(a, b = 0, c = 0, d = !1) {
  a = this.db.transaction("tag" + (this.field ? ":" + this.field : ""), "readonly").objectStore("tag" + (this.field ? ":" + this.field : "")).get(a);
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
w.enrich = function(a) {
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
  let d = this.h[a + ":" + b];
  if (d) {
    return c.call(this, d);
  }
  let e = this.db.transaction(a, b);
  this.h[a + ":" + b] = d = e.objectStore(a);
  const f = c.call(this, d);
  this.h[a + ":" + b] = null;
  return Z(e).finally(function() {
    e = d = null;
    return f;
  });
};
w.commit = async function(a, b, c) {
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
        d[e] = f.del;
      }
    }
    b || (c || (d = d.concat(ea(a.reg))), d.length && await this.remove(d));
  }
  a.reg.size && (await this.transaction("map", "readwrite", function(d) {
    for (const e of a.map) {
      const f = e[0], g = e[1];
      g.length && (b ? d.put(g, f) : d.get(f).onsuccess = function() {
        let h = this.result;
        var k;
        if (h && h.length) {
          const l = Math.max(h.length, g.length);
          for (let m = 0, p, u; m < l; m++) {
            if ((u = g[m]) && u.length) {
              if ((p = h[m]) && p.length) {
                for (k = 0; k < u.length; k++) {
                  p.push(u[k]);
                }
              } else {
                h[m] = u;
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
            const u = Math.max(m.length, l.length);
            for (let q = 0, r, n; q < u; q++) {
              if ((n = l[q]) && n.length) {
                if ((r = m[q]) && r.length) {
                  for (p = 0; p < n.length; p++) {
                    r.push(n[p]);
                  }
                } else {
                  m[q] = n;
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
function Fb(a, b, c) {
  const d = a.value;
  let e, f = 0;
  for (let g = 0, h; g < d.length; g++) {
    if (h = c ? d : d[g]) {
      for (let k = 0, l, m; k < b.length; k++) {
        if (m = b[k], l = h.indexOf(m), 0 <= l) {
          if (e = 1, 1 < h.length) {
            h.splice(l, 1);
          } else {
            d[g] = [];
            break;
          }
        }
      }
      f += h.length;
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
      const c = this.result;
      c && Fb(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && Fb(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && Fb(c, a, !0);
    };
  }), this.transaction("reg", "readwrite", function(b) {
    for (let c = 0; c < a.length; c++) {
      b.delete(a[c]);
    }
  })]);
};
function Z(a, b) {
  return new Promise((c, d) => {
    a.onsuccess = a.oncomplete = function() {
      b && b(this.result);
      b = null;
      c(this.result);
    };
    a.onerror = a.onblocked = d;
    a = null;
  });
}
;export default {Index:P, Charset:nb, Encoder:na, Document:Qa, Worker:Ba, Resolver:Y, IndexedDB:Eb, Language:{}};

export const Index=P;export const  Charset=nb;export const  Encoder=na;export const  Document=Qa;export const  Worker=Ba;export const  Resolver=Y;export const  IndexedDB=Eb;export const  Language={};