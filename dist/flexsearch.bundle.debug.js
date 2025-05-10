/**!
 * FlexSearch.js v0.8.163 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;
var v;
function F(a, c, b) {
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
  const c = [];
  for (const b of a.keys()) {
    c.push(b);
  }
  return c;
}
function ea(a, c) {
  if (L(c)) {
    a = a[c];
  } else {
    for (let b = 0; a && b < c.length; b++) {
      a = a[c[b]];
    }
  }
  return a;
}
function fa(a) {
  let c = 0;
  for (let b = 0, e; b < a.length; b++) {
    (e = a[b]) && c < e.length && (c = e.length);
  }
  return c;
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
  b = a.filter;
  this.filter = "function" === typeof b ? b : F(b && new Set(b), null, this.filter);
  this.dedupe = F(a.dedupe, !0, this.dedupe);
  this.matcher = F((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = F((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = F((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = F(a.replacer, null, this.replacer);
  this.minlength = F(a.minlength, 1, this.minlength);
  this.maxlength = F(a.maxlength, 1024, this.maxlength);
  this.rtl = F(a.rtl, !1, this.rtl);
  if (this.cache = b = F(a.cache, !0, this.cache)) {
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
v.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
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
v.addMapper = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (1 < a.length) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && N(this);
  return this;
};
v.addMatcher = function(a, c) {
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
  this.cache && N(this);
  return this;
};
v.addReplacer = function(a, c) {
  if ("string" === typeof a) {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && N(this);
  return this;
};
v.encode = function(a, c) {
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
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let e = [], d = G(), f, g, k = this.split || "" === this.split ? a.split(this.split) : [a];
  for (let l = 0, m, t; l < k.length; l++) {
    if ((m = t = k[l]) && !(m.length < this.minlength || m.length > this.maxlength)) {
      if (c) {
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
      if (b) {
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
            let q;
            for (; q !== m && 2 < m.length;) {
              q = m, m = m.replace(this.N, n => this.stemmer.get(n));
            }
          }
          if (m && (this.mapper || this.dedupe && 1 < m.length)) {
            h = "";
            for (let q = 0, n = "", r, u; q < m.length; q++) {
              r = m.charAt(q), r === n && this.dedupe || ((u = this.mapper && this.mapper.get(r)) || "" === u ? u === n && this.dedupe || !(n = u) || (h += u) : h += n = r);
            }
            m = h;
          }
          this.matcher && 1 < m.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), m = m.replace(this.M, q => this.matcher.get(q)));
          if (m && this.replacer) {
            for (h = 0; m && h < this.replacer.length; h += 2) {
              m = m.replace(this.replacer[h], this.replacer[h + 1]);
            }
          }
          this.cache && t.length <= this.L && (this.G.set(t, m), this.G.size > this.S && (this.G.clear(), this.L = this.L / 1.1 | 0));
          if (m) {
            if (m !== t) {
              if (c) {
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
  var c = a.task;
  const b = a.id;
  let e = a.args;
  switch(c) {
    case "init":
      O = a.options || {};
      (c = a.factory) ? (Function("return " + c)()(self), pa = new self.FlexSearch.Index(O), delete self.FlexSearch) : pa = new P(O);
      postMessage({id:b});
      break;
    default:
      let d;
      if ("export" === c) {
        if (!O.export || "function" !== typeof O.export) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
        }
        e[1] ? (e[0] = O.export, e[2] = 0, e[3] = 1) : e = null;
      }
      if ("import" === c) {
        if (!O.import || "function" !== typeof O.import) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
        }
        e[0] && (a = await O.import.call(pa, e[0]), pa.import(e[0], a));
      } else {
        (d = e && pa[c].apply(pa, e)) && d.then && (d = await d);
      }
      postMessage("search" === c ? {id:b, msg:d} : {id:b});
  }
}
;function ra(a) {
  sa.call(a, "add");
  sa.call(a, "append");
  sa.call(a, "search");
  sa.call(a, "update");
  sa.call(a, "remove");
  sa.call(a, "searchCache");
}
let ta, ua, xa;
function ya() {
  ta = xa = 0;
}
function sa(a) {
  this[a + "Async"] = function() {
    const c = arguments;
    var b = c[c.length - 1];
    let e;
    "function" === typeof b && (e = b, delete c[c.length - 1]);
    ta ? xa || (xa = Date.now() - ua >= this.priority * this.priority * 3) : (ta = setTimeout(ya, 0), ua = Date.now());
    if (xa) {
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
;let za = 0;
function Aa(a = {}) {
  function c(g) {
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
          d.worker.postMessage({id:za, task:"init", factory:b, options:a});
        });
      }
      this.worker.postMessage({task:"init", factory:b, options:a});
      this.priority = a.priority || 4;
      return this;
    }
  }
  if (!this || this.constructor !== Aa) {
    return new Aa(a);
  }
  let b = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  b && (b = b.toString());
  const e = "undefined" === typeof window, d = this, f = Ba(b, e, a.worker);
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
ra(Aa.prototype);
function R(a) {
  Aa.prototype[a] = function() {
    const c = this, b = [].slice.call(arguments);
    var e = b[b.length - 1];
    let d;
    "function" === typeof e && (d = e, b.pop());
    e = new Promise(function(f) {
      "export" === a && "function" === typeof b[0] && (b[0] = null);
      c.h[++za] = f;
      c.worker.postMessage({task:a, id:za, args:b});
    });
    return d ? (e.then(d), this) : e;
  };
}
function Ba(a, c, b) {
  return c ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + qa.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof b ? b : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function Ca(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function Da(a, c) {
  c || (c = new Map());
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c.set(e[0], e[1]);
  }
  return c;
}
function Ea(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], Ca(d[1])[0]]), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function Fa(a, c) {
  c || (c = new Map());
  for (let b = 0, e, d; b < a.length; b++) {
    e = a[b], d = c.get(e[0]), c.set(e[0], Da(e[1], d));
  }
  return c;
}
function Ga(a) {
  let c = [], b = [];
  for (const e of a.keys()) {
    b.push(e), 250000 === b.length && (c.push(b), b = []);
  }
  b.length && c.push(b);
  return c;
}
function Ha(a, c) {
  c || (c = new Set());
  for (let b = 0; b < a.length; b++) {
    c.add(a[b]);
  }
  return c;
}
function Ia(a, c, b, e, d, f, g = 0) {
  const k = e && e.constructor === Array;
  var h = k ? e.shift() : e;
  if (!h) {
    return this.export(a, c, d, f + 1);
  }
  if ((h = a((c ? c + "." : "") + (g + 1) + "." + b, JSON.stringify(h))) && h.then) {
    const l = this;
    return h.then(function() {
      return Ia.call(l, a, c, b, k ? e : null, d, f, g + 1);
    });
  }
  return Ia.call(this, a, c, b, k ? e : null, d, f, g + 1);
}
function Ja(a, c) {
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
;function Ka(a, c, b, e) {
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
function T(a) {
  if (!this || this.constructor !== T) {
    return new T(a);
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
        for (let g = 0, k, h; g < c.index.length; g++) {
          k = c.index[g];
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
        return Ka(c, d || 0, f || c.length, !1);
      };
    }
    if ("splice" === e) {
      return function(d, f) {
        return Ka(c, d || 0, f || c.length, !0);
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
  const c = this.index[this.B(a)];
  return c && c.get(a);
};
U.prototype.set = function(a, c) {
  var b = this.B(a);
  let e = this.index[b];
  e ? (b = e.size, e.set(a, c), (b -= e.size) && this.size++) : (this.index[b] = e = new Map([[a, c]]), this.h.push(e), this.size++);
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
  var c = this.B(a);
  let b = this.index[c];
  b ? (c = b.size, b.add(a), (c -= b.size) && this.size++) : (this.index[c] = b = new Set([a]), this.h.push(b), this.size++);
};
v = U.prototype;
v.has = V.prototype.has = function(a) {
  const c = this.index[this.B(a)];
  return c && c.has(a);
};
v.delete = V.prototype.delete = function(a) {
  const c = this.index[this.B(a)];
  c && c.delete(a) && this.size--;
};
v.clear = V.prototype.clear = function() {
  this.index = G();
  this.h = [];
  this.size = 0;
};
v.values = V.prototype.values = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let c of this.h[a].values()) {
      yield c;
    }
  }
};
v.keys = V.prototype.keys = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let c of this.h[a].keys()) {
      yield c;
    }
  }
};
v.entries = V.prototype.entries = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let c of this.h[a].entries()) {
      yield c;
    }
  }
};
function Oa(a) {
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
function Na(a) {
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
;Pa.prototype.add = function(a, c, b) {
  aa(a) && (c = a, a = ea(c, this.key));
  if (c && (a || 0 === a)) {
    if (!b && this.reg.has(a)) {
      return this.update(a, c);
    }
    for (let k = 0, h; k < this.field.length; k++) {
      h = this.F[k];
      var e = this.index.get(this.field[k]);
      if ("function" === typeof h) {
        var d = h(c);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = h.I, !d || d(c)) {
          h.constructor === String ? h = ["" + h] : L(h) && (h = [h]), Qa(c, h, this.J, 0, e, a, h[0], b);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.D.length; e++) {
        var f = this.D[e], g = this.R[e];
        d = this.tag.get(g);
        let k = G();
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
          f = ea(c, f);
        }
        if (d && f) {
          L(f) && (f = [f]);
          for (let h = 0, l, m; h < f.length; h++) {
            if (l = f[h], !k[l] && (k[l] = 1, (g = d.get(l)) ? m = g : d.set(l, m = []), !b || !m.includes(a))) {
              if (m.length === 2 ** 31 - 1) {
                g = new T(m);
                if (this.fastupdate) {
                  for (let t of this.reg.values()) {
                    t.includes(m) && (t[t.indexOf(m)] = g);
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
      let k;
      if (this.C) {
        k = G();
        for (let h = 0, l; h < this.C.length; h++) {
          l = this.C[h];
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
          } else if (L(l) || l.constructor === String) {
            k[l] = c[l];
            continue;
          }
          Ra(c, k, l, 0, l[0], m);
        }
      }
      this.store.set(a, k || c);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function Ra(a, c, b, e, d, f) {
  a = a[d];
  if (e === b.length - 1) {
    c[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (c = c[d] = Array(a.length), d = 0; d < a.length; d++) {
        Ra(a, c, b, e, d);
      }
    } else {
      c = c[d] || (c[d] = G()), d = b[++e], Ra(a, c, b, e, d);
    }
  }
}
function Qa(a, c, b, e, d, f, g, k) {
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
          Qa(a, c, b, e, d, f, g, k);
        }
      } else {
        g = c[++e], Qa(a, c, b, e, d, f, g, k);
      }
    }
  } else {
    d.db && d.remove(f);
  }
}
;function Sa(a, c, b, e, d, f, g) {
  const k = a.length;
  let h = [], l, m;
  l = G();
  for (let t = 0, q, n, r, u; t < c; t++) {
    for (let p = 0; p < k; p++) {
      if (r = a[p], t < r.length && (q = r[t])) {
        for (let z = 0; z < q.length; z++) {
          n = q[z];
          (m = l[n]) ? l[n]++ : (m = 0, l[n] = 1);
          u = h[m] || (h[m] = []);
          if (!g) {
            let x = t + (p || !d ? 0 : f || 0);
            u = u[x] || (u[x] = []);
          }
          u.push(n);
          if (g && b && m === k - 1 && u.length - e === b) {
            return e ? u.slice(e) : u;
          }
        }
      }
    }
  }
  if (a = h.length) {
    if (d) {
      h = 1 < h.length ? Ta(h, b, e, g, f) : (h = h[0]).length > b || e ? h.slice(e, b + e) : h;
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
          for (let t = 0, q; t < h.length; t++) {
            if (q = h[t]) {
              if (e && q.length > e) {
                e -= q.length;
              } else {
                if (b && q.length > b || e) {
                  q = q.slice(e, b + e), b -= q.length, e && (e -= q.length);
                }
                d.push(q);
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
function Ta(a, c, b, e, d) {
  const f = [], g = G();
  let k;
  var h = a.length;
  let l;
  if (e) {
    for (d = h - 1; 0 <= d; d--) {
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
    for (let m = h - 1, t, q = 0; 0 <= m; m--) {
      t = a[m];
      for (let n = 0; n < t.length; n++) {
        if (l = (e = t[n]) && e.length) {
          for (let r = 0; r < l; r++) {
            if (k = e[r], !g[k]) {
              if (g[k] = 1, b) {
                b--;
              } else {
                let u = (n + (m < h - 1 ? d || 0 : 0)) / (m + 1) | 0;
                (f[u] || (f[u] = [])).push(k);
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
function Ua(a, c, b) {
  const e = G(), d = [];
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
;function Va(a, c, b, e) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a, e ? X.call(this, a) : a;
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
        return e ? X.call(this, g) : g;
      }
      d.push(g);
      c -= k;
      if (!c) {
        break;
      }
    }
  }
  d = 1 < d.length ? [].concat.apply([], d) : d[0];
  return e ? X.call(this, d) : d;
}
;function Wa(a, c, b) {
  var e = b[0];
  if (e.then) {
    return Promise.all(b).then(function(q) {
      return a[c].apply(a, q);
    });
  }
  if (e[0] && e[0].index) {
    return a[c].apply(a, e);
  }
  e = [];
  let d = [], f = 0, g = 0, k, h, l, m, t;
  for (let q = 0, n; q < b.length; q++) {
    if (n = b[q]) {
      let r;
      if (n.constructor === Y) {
        r = n.result;
      } else if (n.constructor === Array) {
        r = n;
      } else {
        f = n.limit || 0;
        g = n.offset || 0;
        l = n.suggest;
        h = n.resolve;
        k = (m = n.highlight && h) || n.enrich && h;
        let u;
        n.index && (a.index = u = n.index);
        if (n.query || n.tag) {
          if (!a.index) {
            throw Error("Resolver can't apply because the corresponding Index was never specified");
          }
          if (n.field) {
            if (!a.index.index) {
              throw Error("Resolver can't apply because the corresponding Document Index was not specified");
            }
            u = a.index.index.get(n.field);
            if (!u) {
              throw Error("Resolver can't apply because the specified Document field '" + n.field + "' was not found");
            }
          }
          n.resolve = !1;
          r = u.search(n).result;
          n.resolve = h;
          m && (t = n.query);
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
        e[q] = r;
      } else if (!l && ("and" === c || "xor" === c)) {
        e = [];
        break;
      }
    }
  }
  return {O:e, P:d, limit:f, offset:g, enrich:k, resolve:h, suggest:l, highlight:m, W:t};
}
;Y.prototype.or = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f} = Wa(this, "or", arguments);
  return Xa.call(this, a, c, b, e, d, f);
};
function Xa(a, c, b, e, d, f) {
  if (c.length) {
    const g = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let h = 0, l; h < k.length; h++) {
        (l = k[h]).length && (a[h] = l);
      }
      return Xa.call(g, a, [], b, e, d, f);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = Ta(a, b, e, !1, this.h), e = 0));
  return f ? this.resolve(b, e, d) : this;
}
;Y.prototype.and = function() {
  let a = this.result.length, c, b, e, d;
  if (!a) {
    const f = arguments[0];
    f && (a = !!f.suggest, d = f.resolve, c = f.limit, b = f.offset, e = f.enrich && d);
  }
  if (a) {
    const {O:f, P:g, limit:k, offset:h, enrich:l, resolve:m, suggest:t} = Wa(this, "and", arguments);
    return Ya.call(this, f, g, k, h, l, m, t);
  }
  return d ? this.resolve(c, b, e) : this;
};
function Ya(a, c, b, e, d, f, g) {
  if (c.length) {
    const k = this;
    return Promise.all(c).then(function(h) {
      a = [];
      for (let l = 0, m; l < h.length; l++) {
        (m = h[l]).length && (a[l] = m);
      }
      return Ya.call(k, a, [], b, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (c = fa(a)) {
        return this.result = Sa(a, c, b, e, g, this.h, f), f ? d ? X.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(b, e, d) : this;
}
;Y.prototype.xor = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f, suggest:g} = Wa(this, "xor", arguments);
  return Za.call(this, a, c, b, e, d, f, g);
};
function Za(a, c, b, e, d, f, g) {
  if (c.length) {
    const k = this;
    return Promise.all(c).then(function(h) {
      a = [];
      for (let l = 0, m; l < h.length; l++) {
        (m = h[l]).length && (a[l] = m);
      }
      return Za.call(k, a, [], b, e, d, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = $a.call(this, a, b, e, f, this.h), f ? d ? X.call(this.index, this.result) : this.result : this;
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(b, e, d) : this;
}
function $a(a, c, b, e, d) {
  const f = [], g = G();
  let k = 0;
  for (let h = 0, l; h < a.length; h++) {
    if (l = a[h]) {
      k < l.length && (k = l.length);
      for (let m = 0, t; m < l.length; m++) {
        if (t = l[m]) {
          for (let q = 0, n; q < t.length; q++) {
            n = t[q], g[n] = g[n] ? 2 : 1;
          }
        }
      }
    }
  }
  for (let h = 0, l, m = 0; h < k; h++) {
    for (let t = 0, q; t < a.length; t++) {
      if (q = a[t]) {
        if (l = q[h]) {
          for (let n = 0, r; n < l.length; n++) {
            if (r = l[n], 1 === g[r]) {
              if (b) {
                b--;
              } else {
                if (e) {
                  if (f.push(r), f.length === c) {
                    return f;
                  }
                } else {
                  const u = h + (t ? d : 0);
                  f[u] || (f[u] = []);
                  f[u].push(r);
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
;Y.prototype.not = function() {
  const {O:a, P:c, limit:b, offset:e, enrich:d, resolve:f, suggest:g} = Wa(this, "not", arguments);
  return ab.call(this, a, c, b, e, d, f, g);
};
function ab(a, c, b, e, d, f, g) {
  if (c.length) {
    const k = this;
    return Promise.all(c).then(function(h) {
      a = [];
      for (let l = 0, m; l < h.length; l++) {
        (m = h[l]).length && (a[l] = m);
      }
      return ab.call(k, a, [], b, e, d, f, g);
    });
  }
  if (a.length && this.result.length) {
    this.result = bb.call(this, a, b, e, f);
  } else if (f) {
    return this.resolve(b, e, d);
  }
  return f ? d ? X.call(this.index, this.result) : this.result : this;
}
function bb(a, c, b, e) {
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
;function cb(a, c, b, e, d) {
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
  var t = 0;
  if ("object" === typeof d) {
    var q = d.template;
    t = q.length - 2;
    d = d.pattern;
  }
  "string" !== typeof d && (d = !1 === d ? "" : "...");
  t && (d = q.replace("$1", d));
  q = d.length - t;
  let n, r;
  "object" === typeof h && (n = h.before, 0 === n && (n = -1), r = h.after, 0 === r && (r = -1), h = h.total || 9e5);
  t = new Map();
  for (let La = 0, ba, hb, na; La < c.length; La++) {
    let oa;
    if (e) {
      oa = c, na = e;
    } else {
      var u = c[La];
      na = u.field;
      if (!na) {
        continue;
      }
      oa = u.result;
    }
    hb = b.get(na);
    ba = hb.encoder;
    u = t.get(ba);
    "string" !== typeof u && (u = ba.encode(a), t.set(ba, u));
    for (let va = 0; va < oa.length; va++) {
      var p = oa[va].doc;
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
      let wa = [];
      var J = -1, B = -1, y = 0;
      for (var A = 0; A < z.length; A++) {
        var E = z[A], D = ba.encode(E);
        D = 1 < D.length ? D.join(" ") : D[0];
        let w;
        if (D && E) {
          var C = E.length, H = (ba.split ? E.replace(ba.split, "") : E).length - D.length, M = "", W = 0;
          for (var ca = 0; ca < u.length; ca++) {
            var Q = u[ca];
            if (Q) {
              var K = Q.length;
              K += H;
              W && K <= W || (Q = D.indexOf(Q), -1 < Q && (M = (Q ? E.substring(0, Q) : "") + g + E.substring(Q, Q + K) + k + (Q + K < C ? E.substring(Q + K) : ""), W = K, w = !0));
            }
          }
          M && (h && (0 > J && (J = p.length + (p ? 1 : 0)), B = p.length + (p ? 1 : 0) + M.length, y += C, wa.push(x.length), x.push({match:M})), p += (p ? " " : "") + M);
        }
        if (!w) {
          E = z[A], p += (p ? " " : "") + E, h && x.push({text:E});
        } else if (h && y >= h) {
          break;
        }
      }
      y = wa.length * (f.length - 2);
      if (n || r || h && p.length - y > h) {
        if (y = h + y - 2 * q, A = B - J, 0 < n && (A += n), 0 < r && (A += r), A <= y) {
          z = n ? J - (0 < n ? n : 0) : J - ((y - A) / 2 | 0), x = r ? B + (0 < r ? r : 0) : z + y, l || (0 < z && " " !== p.charAt(z) && " " !== p.charAt(z - 1) && (z = p.indexOf(" ", z), 0 > z && (z = 0)), x < p.length && " " !== p.charAt(x - 1) && " " !== p.charAt(x) && (x = p.lastIndexOf(" ", x), x < B ? x = B : ++x)), p = (z ? d : "") + p.substring(z, x) + (x < p.length ? d : "");
        } else {
          B = [];
          J = {};
          y = {};
          A = {};
          E = {};
          D = {};
          M = H = C = 0;
          for (ca = W = 1;;) {
            var S = void 0;
            for (let w = 0, I; w < wa.length; w++) {
              I = wa[w];
              if (M) {
                if (H !== M) {
                  if (A[w + 1]) {
                    continue;
                  }
                  I += M;
                  if (J[I]) {
                    C -= q;
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
                    C -= q;
                  }
                  p = x[I].text;
                  if (K = r && D[w]) {
                    if (0 < K) {
                      if (p.length > K) {
                        if (A[w + 1] = 1, l) {
                          p = p.substring(0, K);
                        } else {
                          continue;
                        }
                      }
                      (K -= p.length) || (K = -1);
                      D[w] = K;
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
                    C -= q;
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
                    C -= q;
                  }
                  p = x[I].text;
                  if (K = n && E[w]) {
                    if (0 < K) {
                      if (p.length > K) {
                        if (A[w] = 1, l) {
                          p = p.substring(p.length - K);
                        } else {
                          continue;
                        }
                      }
                      (K -= p.length) || (K = -1);
                      E[w] = K;
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
                n && (E[w] = n);
                r && (D[w] = r);
                w && C++;
                let Ma;
                I ? !w && q && (C += q) : (y[w] = 1, A[w] = 1);
                I >= z.length - 1 ? Ma = 1 : I < x.length - 1 && x[I + 1].match ? Ma = 1 : q && (C += q);
                C -= f.length - 2;
                if (!w || C + p.length <= h) {
                  B[w] = p;
                } else {
                  S = W = ca = y[w] = 0;
                  break;
                }
                Ma && (y[w + 1] = 1, A[w + 1] = 1);
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
      oa[va].highlight = p;
    }
    if (e) {
      break;
    }
  }
  return c;
}
;function Y(a, c) {
  if (!this || this.constructor !== Y) {
    return new Y(a, c);
  }
  if (a && a.index) {
    return a.resolve = !1, this.index = a.index, this.h = a.boost || 0, this.result = this.index.search(a).result, this;
  }
  this.index = c || null;
  this.result = a || [];
  this.h = 0;
}
Y.prototype.limit = function(a) {
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
Y.prototype.offset = function(a) {
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
Y.prototype.boost = function(a) {
  this.h += a;
  return this;
};
Y.prototype.resolve = function(a, c, b) {
  const e = this.index;
  let d = this.result;
  this.result = this.index = null;
  d.length && ("object" === typeof a && (b = a.enrich, c = a.offset, a = a.limit), d = Va.call(e, d, a || 100, c, b));
  return d;
};
G();
Pa.prototype.search = function(a, c, b, e) {
  b || (!c && aa(a) ? (b = a, a = "") : aa(c) && (b = c, c = 0));
  if (b && b.cache) {
    b.cache = !1;
    var d = this.searchCache(a, c, b);
    b.cache = !0;
    return d;
  }
  let f = [];
  var g = [];
  let k, h;
  let l, m;
  let t = 0;
  var q = !0;
  let n;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    k = b.pluck;
    h = b.merge;
    l = k || b.field || (l = b.index) && (l.index ? null : l);
    m = this.tag && b.tag;
    var r = b.suggest;
    q = !1 !== b.resolve;
    if (!q && !k) {
      if (l = l || this.field) {
        L(l) ? k = l : (l.constructor === Array && 1 === l.length && (l = l[0]), k = l.field || l.index);
      }
      if (!k) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    this.store && b.highlight && !q ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && b.enrich && !q && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    n = q && this.store && b.highlight;
    d = !!n || q && this.store && b.enrich;
    c = b.limit || c;
    var u = b.offset || 0;
    c || (c = 100);
    if (m && (!this.db || !e)) {
      m.constructor !== Array && (m = [m]);
      var p = [];
      for (let B = 0, y; B < m.length; B++) {
        y = m[B];
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
          for (let A = 0, E, D; A < z.length; A++) {
            if (E = z[A], D = y[E], D.constructor === Array) {
              for (x = 0; x < D.length; x++) {
                p.push(E, D[x]);
              }
            } else {
              p.push(E, D);
            }
          }
        }
      }
      if (!p.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      m = p;
      if (!a) {
        q = [];
        if (p.length) {
          for (g = 0; g < p.length; g += 2) {
            if (this.db) {
              r = this.index.get(p[g]);
              if (!r) {
                console.warn("Tag '" + p[g] + ":" + p[g + 1] + "' will be skipped because there is no field '" + p[g] + "'.");
                continue;
              }
              q.push(r = r.db.tag(p[g + 1], c, u, d));
            } else {
              r = db.call(this, p[g], p[g + 1], c, u, d);
            }
            f.push({field:p[g], tag:p[g + 1], result:r});
          }
        }
        return q.length ? Promise.all(q).then(function(B) {
          for (let y = 0; y < B.length; y++) {
            f[y].result = B[y];
          }
          return f;
        }) : f;
      }
    }
    l && l.constructor !== Array && (l = [l]);
  }
  l || (l = this.field);
  let J;
  p = (this.worker || this.db) && !e && [];
  for (let B = 0, y, A, E; B < l.length; B++) {
    A = l[B];
    if (this.db && this.tag && !this.F[B]) {
      continue;
    }
    let D;
    L(A) || (D = A, A = D.field, a = D.query || a, c = eb(D.limit, c), u = eb(D.offset, u), r = eb(D.suggest, r), n = q && this.store && eb(D.highlight, n), d = !!n || q && this.store && eb(D.enrich, d));
    if (e) {
      y = e[B];
    } else {
      if (z = D || b, x = this.index.get(A), m && (this.db && (z.tag = m, J = x.db.support_tag_search, z.field = l), J || (z.enrich = !1)), p) {
        p[B] = x.search(a, c, z);
        z && d && (z.enrich = d);
        continue;
      } else {
        y = x.search(a, c, z), z && d && (z.enrich = d);
      }
    }
    E = y && (q ? y.length : y.result.length);
    if (m && E) {
      z = [];
      x = 0;
      if (this.db && e) {
        if (!J) {
          for (let C = l.length; C < e.length; C++) {
            let H = e[C];
            if (H && H.length) {
              x++, z.push(H);
            } else if (!r) {
              return q ? f : new Y(f, this);
            }
          }
        }
      } else {
        for (let C = 0, H, M; C < m.length; C += 2) {
          H = this.tag.get(m[C]);
          if (!H) {
            if (console.warn("Tag '" + m[C] + ":" + m[C + 1] + "' will be skipped because there is no field '" + m[C] + "'."), r) {
              continue;
            } else {
              return q ? f : new Y(f, this);
            }
          }
          if (M = (H = H && H.get(m[C + 1])) && H.length) {
            x++, z.push(H);
          } else if (!r) {
            return q ? f : new Y(f, this);
          }
        }
      }
      if (x) {
        y = Ua(y, z, q);
        E = y.length;
        if (!E && !r) {
          return q ? y : new Y(y, this);
        }
        x--;
      }
    }
    if (E) {
      g[t] = A, f.push(y), t++;
    } else if (1 === l.length) {
      return q ? f : new Y(f, this);
    }
  }
  if (p) {
    if (this.db && m && m.length && !J) {
      for (d = 0; d < m.length; d += 2) {
        g = this.index.get(m[d]);
        if (!g) {
          if (console.warn("Tag '" + m[d] + ":" + m[d + 1] + "' was not found because there is no field '" + m[d] + "'."), r) {
            continue;
          } else {
            return q ? f : new Y(f, this);
          }
        }
        p.push(g.db.tag(m[d + 1], c, u, !1));
      }
    }
    const B = this;
    return Promise.all(p).then(function(y) {
      return y.length ? B.search(a, c, b, y) : y;
    });
  }
  if (!t) {
    return q ? f : new Y(f, this);
  }
  if (k && (!d || !this.store)) {
    return f = f[0], q || (f.index = this), f;
  }
  p = [];
  for (u = 0; u < g.length; u++) {
    r = f[u];
    d && r.length && "undefined" === typeof r[0].doc && (this.db ? p.push(r = this.index.get(this.field[0]).db.enrich(r)) : r = X.call(this, r));
    if (k) {
      return q ? n ? cb(a, r, this.index, k, n) : r : new Y(r, this);
    }
    f[u] = {field:g[u], result:r};
  }
  if (d && this.db && p.length) {
    const B = this;
    return Promise.all(p).then(function(y) {
      for (let A = 0; A < y.length; A++) {
        f[A].result = y[A];
      }
      return h ? fb(f) : n ? cb(a, f, B.index, k, n) : f;
    });
  }
  return h ? fb(f) : n ? cb(a, f, this.index, k, n) : f;
};
function eb(a, c) {
  return "undefined" === typeof a ? c : a;
}
function fb(a) {
  const c = [], b = G();
  for (let e = 0, d, f; e < a.length; e++) {
    d = a[e];
    f = d.result;
    for (let g = 0, k, h, l; g < f.length; g++) {
      h = f[g], "object" !== typeof h && (h = {id:h}), k = h.id, (l = b[k]) ? l.push(d.field) : (h.field = b[k] = [d.field], c.push(h));
    }
  }
  return c;
}
function db(a, c, b, e, d) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(c)) && f.length - e) && 0 < a) {
    if (a > b || e) {
      f = f.slice(e, e + b);
    }
    d && (f = X.call(this, f));
    return f;
  }
}
function X(a) {
  if (!this || !this.store) {
    return a;
  }
  const c = Array(a.length);
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c[b] = {id:e, doc:this.store.get(e)};
  }
  return c;
}
;function Pa(a) {
  if (!this || this.constructor !== Pa) {
    return new Pa(a);
  }
  const c = a.document || a.doc || a;
  let b, e;
  this.F = [];
  this.field = [];
  this.J = [];
  this.key = (b = c.key || c.id) && gb(b, this.J) || "id";
  (e = a.keystore || 0) && (this.keystore = e);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? e ? new V(e) : new Set() : e ? new U(e) : new Map();
  this.C = (b = c.store || null) && b && !0 !== b && [];
  this.store = b && (e ? new U(e) : new Map());
  this.cache = (b = a.cache || null) && new ib(b);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = jb.call(this, a, c);
  this.tag = null;
  if (b = c.tag) {
    if ("string" === typeof b && (b = [b]), b.length) {
      this.tag = new Map();
      this.D = [];
      this.R = [];
      for (let d = 0, f, g; d < b.length; d++) {
        f = b[d];
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
          const t = m[0];
          var l = m[1];
          if (l.then) {
            l = d[h].encoder || {};
            let q = k.get(l);
            q || (q = l.encode ? l : new ma(l), k.set(l, q));
            l = g[h];
            l.encoder = q;
            f.index.set(t, l);
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
  let c = this.field;
  if (this.tag) {
    for (let f = 0, g; f < this.R.length; f++) {
      g = this.R[f];
      var b = void 0;
      this.index.set(g, b = new P({}, this.reg));
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
v.commit = async function(a, c) {
  const b = [];
  for (const e of this.index.values()) {
    b.push(e.commit(a, c));
  }
  await Promise.all(b);
  this.reg.clear();
};
v.destroy = function() {
  const a = [];
  for (const c of this.index.values()) {
    a.push(c.destroy());
  }
  return Promise.all(a);
};
function jb(a, c) {
  const b = new Map();
  let e = c.index || c.field || c;
  L(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d];
    L(f) || (g = f, f = f.field);
    g = aa(g) ? Object.assign({}, a, g) : a;
    if (this.worker) {
      const k = new Aa(g);
      k.encoder = g.encoder;
      b.set(f, k);
    }
    this.worker || b.set(f, new P(g, this.reg));
    g.custom ? this.F[d] = g.custom : (this.F[d] = gb(f, this.J), g.filter && ("string" === typeof this.F[d] && (this.F[d] = new String(this.F[d])), this.F[d].I = g.filter));
    this.field[d] = f;
  }
  if (this.C) {
    a = c.store;
    L(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.custom ? (this.C[d] = f.custom, f.custom.V = g) : (this.C[d] = gb(g, this.J), f.filter && ("string" === typeof this.C[d] && (this.C[d] = new String(this.C[d])), this.C[d].I = f.filter));
    }
  }
  return b;
}
function gb(a, c) {
  const b = a.split(":");
  let e = 0;
  for (let d = 0; d < b.length; d++) {
    a = b[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (c[e] = !0), a && (b[e++] = a);
  }
  e < b.length && (b.length = e);
  return 1 < e ? b : b[0];
}
v.append = function(a, c) {
  return this.add(a, c, !0);
};
v.update = function(a, c) {
  return this.remove(a).add(a, c);
};
v.remove = function(a) {
  aa(a) && (a = ea(a, this.key));
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
v.clear = function() {
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
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(c) {
    return c[0] && c[0].doc || null;
  }) : this.store.get(a) || null;
};
v.set = function(a, c) {
  "object" === typeof a && (c = a, a = ea(c, this.key));
  this.store.set(a, c);
  return this;
};
v.searchCache = kb;
v.export = function(a, c, b = 0, e = 0) {
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
      f = Ga(this.reg);
      c = null;
      break;
    case 1:
      d = "tag";
      f = this.tag && Ea(this.tag, this.reg.size);
      c = null;
      break;
    case 2:
      d = "doc";
      f = this.store && Ca(this.store);
      c = null;
      break;
    default:
      return;
  }
  return Ia.call(this, a, c, d, f, b, e);
};
v.import = function(a, c) {
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
        this.reg = Ha(c, this.reg);
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
        this.tag = Fa(c, this.tag);
        break;
      case "doc":
        this.store = Da(c, this.store);
    }
  }
};
ra(Pa.prototype);
function kb(a, c, b) {
  const e = (c ? "" + a : "object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new ib());
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
function ib(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
ib.prototype.set = function(a, c) {
  this.cache.set(this.h = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
ib.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
  return c;
};
ib.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
ib.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const lb = {normalize:!1, numeric:!1, dedupe:!1};
const mb = {};
const nb = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const ob = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), pb = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const qb = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var rb = {Exact:lb, Default:mb, Normalize:mb, LatinBalance:{mapper:nb}, LatinAdvanced:{mapper:nb, matcher:ob, replacer:pb}, LatinExtra:{mapper:nb, replacer:pb.concat([/(?!^)[aeo]/g, ""]), matcher:ob}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let e = c.charAt(0), d = qb[e];
    for (let f = 1, g; f < c.length && (g = c.charAt(f), "h" === g || "w" === g || !(g = qb[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[b] = e;
  }
}}, CJK:{split:""}, LatinExact:lb, LatinDefault:mb, LatinSimple:mb};
P.prototype.remove = function(a, c) {
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
      sb(this.map, a), this.depth && sb(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.T && tb(this));
  this.cache && this.cache.remove(a);
  return this;
};
function sb(a, c) {
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
      const f = sb(d[1], c);
      f ? b += f : a.delete(e);
    }
  }
  return b;
}
;const ub = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
P.prototype.add = function(a, c, b, e) {
  if (c && (a || 0 === a)) {
    if (!e && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    e = this.depth;
    c = this.encoder.encode(c, !e);
    const l = c.length;
    if (l) {
      const m = G(), t = G(), q = this.resolution;
      for (let n = 0; n < l; n++) {
        let r = c[this.rtl ? l - 1 - n : n];
        var d = r.length;
        if (d && (e || !t[r])) {
          var f = this.score ? this.score(c, r, n, null, 0) : vb(q, l, n), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (let u = 0, p; u < d; u++) {
                  for (f = d; f > u; f--) {
                    g = r.substring(u, f);
                    p = this.rtl ? d - 1 - u : u;
                    var k = this.score ? this.score(c, r, n, g, p) : vb(q, l, n, d, p);
                    wb(this, t, g, k, a, b);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < d) {
                for (k = d - 1; 0 < k; k--) {
                  g = r[this.rtl ? d - 1 - k : k] + g;
                  var h = this.score ? this.score(c, r, n, g, k) : vb(q, l, n, d, k);
                  wb(this, t, g, h, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (k = 0; k < d; k++) {
                  g += r[this.rtl ? d - 1 - k : k], wb(this, t, g, f, a, b);
                }
                break;
              }
            default:
              if (wb(this, t, r, f, a, b), e && 1 < l && n < l - 1) {
                for (d = G(), g = this.U, f = r, k = Math.min(e + 1, this.rtl ? n + 1 : l - n), d[f] = 1, h = 1; h < k; h++) {
                  if ((r = c[this.rtl ? l - 1 - n - h : n + h]) && !d[r]) {
                    d[r] = 1;
                    const u = this.score ? this.score(c, f, n, r, h - 1) : vb(g + (l / 2 > g ? 0 : 1), l, n, k - 1, h - 1), p = this.bidirectional && r > f;
                    wb(this, m, p ? f : r, u, a, b, p ? r : f);
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
  this.db && (c || this.commit_task.push({del:a}), this.T && tb(this));
  return this;
};
function wb(a, c, b, e, d, f, g) {
  let k = g ? a.ctx : a.map, h;
  if (!c[b] || g && !(h = c[b])[g]) {
    if (g ? (c = h || (c[b] = G()), c[g] = 1, (h = k.get(g)) ? k = h : k.set(g, k = new Map())) : c[b] = 1, (h = k.get(b)) ? k = h : k.set(b, k = h = []), k = k[e] || (k[e] = []), !f || !k.includes(d)) {
      if (k.length === 2 ** 31 - 1) {
        c = new T(k);
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
function vb(a, c, b, e, d) {
  return b && 1 < a ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;P.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  if (b && b.cache) {
    return b.cache = !1, a = this.searchCache(a, c, b), b.cache = !0, a;
  }
  let e = [], d, f, g, k = 0, h, l, m, t, q;
  b && (a = b.query || a, c = b.limit || c, k = b.offset || 0, f = b.context, g = b.suggest, q = (h = b.resolve) && b.enrich, m = b.boost, t = b.resolution, l = this.db && b.tag);
  "undefined" === typeof h && (h = this.resolve);
  f = this.depth && !1 !== f;
  let n = this.encoder.encode(a, !f);
  d = n.length;
  c = c || (h ? 100 : 0);
  if (1 === d) {
    return xb.call(this, n[0], "", c, k, h, q, l);
  }
  if (2 === d && f && !g) {
    return xb.call(this, n[1], n[0], c, k, h, q, l);
  }
  let r = G(), u = 0, p;
  f && (p = n[0], u = 1);
  t || 0 === t || (t = p ? this.U : this.resolution);
  if (this.db) {
    if (this.db.search && (b = this.db.search(this, n, c, k, g, h, q, l), !1 !== b)) {
      return b;
    }
    const z = this;
    return async function() {
      for (let x, J; u < d; u++) {
        if ((J = n[u]) && !r[J]) {
          r[J] = 1;
          x = await yb(z, J, p, 0, 0, !1, !1);
          if (x = zb(x, e, g, t)) {
            e = x;
            break;
          }
          p && (g && x && e.length || (p = J));
        }
        g && p && u === d - 1 && !e.length && (t = z.resolution, p = "", u = -1, r = G());
      }
      return Ab(e, t, c, k, g, m, h);
    }();
  }
  for (let z, x; u < d; u++) {
    if ((x = n[u]) && !r[x]) {
      r[x] = 1;
      z = yb(this, x, p, 0, 0, !1, !1);
      if (z = zb(z, e, g, t)) {
        e = z;
        break;
      }
      p && (g && z && e.length || (p = x));
    }
    g && p && u === d - 1 && !e.length && (t = this.resolution, p = "", u = -1, r = G());
  }
  return Ab(e, t, c, k, g, m, h);
};
function Ab(a, c, b, e, d, f, g) {
  let k = a.length, h = a;
  if (1 < k) {
    h = Sa(a, c, b, e, d, f, g);
  } else if (1 === k) {
    return g ? Va.call(null, a[0], b, e) : new Y(a[0], this);
  }
  return g ? h : new Y(h, this);
}
function xb(a, c, b, e, d, f, g) {
  a = yb(this, a, c, b, e, d, f, g);
  return this.db ? a.then(function(k) {
    return d ? k || [] : new Y(k, this);
  }) : a && a.length ? d ? Va.call(this, a, b, e) : new Y(a, this) : d ? [] : new Y([], this);
}
function zb(a, c, b, e) {
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
function yb(a, c, b, e, d, f, g, k) {
  let h;
  b && (h = a.bidirectional && c > b) && (h = b, b = c, c = h);
  if (a.db) {
    return a.db.get(c, b, e, d, f, g, k);
  }
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;function P(a, c) {
  if (!this || this.constructor !== P) {
    return new P(a);
  }
  if (a) {
    var b = L(a) ? a : a.preset;
    b && (ub[b] || console.warn("Preset not found: " + b), a = Object.assign({}, ub[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const e = !0 === b ? {depth:1} : b || {}, d = L(a.encoder) ? rb[a.encoder] : a.encode || a.encoder || {};
  this.encoder = d.encode ? d : "object" === typeof d ? new ma(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && "default" !== b && "exact" !== b && b || "strict";
  this.depth = "strict" === b && e.depth || 0;
  this.bidirectional = !1 !== e.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e && e.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (b = a.keystore || 0) && (this.keystore = b);
  this.map = b ? new U(b) : new Map();
  this.ctx = b ? new U(b) : new Map();
  this.reg = c || (this.fastupdate ? b ? new U(b) : new Map() : b ? new V(b) : new Set());
  this.U = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (b = a.cache || null) && new ib(b);
  this.resolve = !1 !== a.resolve;
  if (b = a.db) {
    this.db = this.mount(b);
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
v.commit = function(a, c) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.commit(this, a, c);
};
v.destroy = function() {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.destroy();
};
function tb(a) {
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
v.append = function(a, c) {
  return this.add(a, c, !0);
};
v.contain = function(a) {
  return this.db ? this.db.has(a) : this.reg.has(a);
};
v.update = function(a, c) {
  const b = this, e = this.remove(a);
  return e && e.then ? e.then(() => b.add(a, c)) : this.add(a, c);
};
v.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  sb(this.map);
  this.depth && sb(this.ctx);
  return this;
};
v.searchCache = kb;
v.export = function(a, c, b = 0, e = 0) {
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
  return Ia.call(this, a, c, d, f, b, e);
};
v.import = function(a, c) {
  if (c) {
    switch("string" === typeof c && (c = JSON.parse(c)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Ha(c, this.reg);
        break;
      case "map":
        this.map = Da(c, this.map);
        break;
      case "ctx":
        this.ctx = Fa(c, this.ctx);
    }
  }
};
v.serialize = function(a = !0) {
  let c = "", b = "", e = "";
  if (this.reg.size) {
    let f;
    for (var d of this.reg.keys()) {
      f || (f = typeof d), c += (c ? "," : "") + ("string" === f ? '"' + d + '"' : d);
    }
    c = "index.reg=new Set([" + c + "]);";
    b = Ja(this.map, f);
    b = "index.map=new Map([" + b + "]);";
    for (const g of this.ctx.entries()) {
      d = g[0];
      let k = Ja(g[1], f);
      k = "new Map([" + k + "])";
      k = '["' + d + '",' + k + "]";
      e += (e ? "," : "") + k;
    }
    e = "index.ctx=new Map([" + e + "]);";
  }
  return a ? "function inject(index){" + c + b + e + "}" : c + b + e;
};
ra(P.prototype);
const Bb = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), Cb = ["map", "ctx", "tag", "reg", "cfg"], Db = G();
function Eb(a, c = {}) {
  if (!this || this.constructor !== Eb) {
    return new Eb(a, c);
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
v = Eb.prototype;
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
  Db[a.id] || (Db[a.id] = []);
  Db[a.id].push(a.field);
  const c = Bb.open(a.id, 1);
  c.onupgradeneeded = function() {
    const b = a.db = this.result;
    for (let e = 0, d; e < Cb.length; e++) {
      d = Cb[e];
      for (let f = 0, g; f < Db[a.id].length; f++) {
        g = Db[a.id][f], b.objectStoreNames.contains(d + ("reg" !== d ? g ? ":" + g : "" : "")) || b.createObjectStore(d + ("reg" !== d ? g ? ":" + g : "" : ""));
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
v.close = function() {
  this.db && this.db.close();
  this.db = null;
};
v.destroy = function() {
  const a = Bb.deleteDatabase(this.id);
  return Z(a);
};
v.clear = function() {
  const a = [];
  for (let b = 0, e; b < Cb.length; b++) {
    e = Cb[b];
    for (let d = 0, f; d < Db[this.id].length; d++) {
      f = Db[this.id][d], a.push(e + ("reg" !== e ? f ? ":" + f : "" : ""));
    }
  }
  const c = this.db.transaction(a, "readwrite");
  for (let b = 0; b < a.length; b++) {
    c.objectStore(a[b]).clear();
  }
  return Z(c);
};
v.get = function(a, c, b = 0, e = 0, d = !0, f = !1) {
  a = this.db.transaction((c ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((c ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(c ? c + ":" + a : a);
  const g = this;
  return Z(a).then(function(k) {
    let h = [];
    if (!k || !k.length) {
      return h;
    }
    if (d) {
      if (!b && !e && 1 === k.length) {
        return k[0];
      }
      for (let l = 0, m; l < k.length; l++) {
        if ((m = k[l]) && m.length) {
          if (e >= m.length) {
            e -= m.length;
            continue;
          }
          const t = b ? e + Math.min(m.length - e, b) : m.length;
          for (let q = e; q < t; q++) {
            h.push(m[q]);
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
v.tag = function(a, c = 0, b = 0, e = !1) {
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
v.enrich = function(a) {
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
v.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return Z(a).then(function(c) {
    return !!c;
  });
};
v.search = null;
v.info = function() {
};
v.transaction = function(a, c, b) {
  a += "reg" !== a ? this.field ? ":" + this.field : "" : "";
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
v.commit = async function(a, c, b) {
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
    c || (b || (e = e.concat(da(a.reg))), e.length && await this.remove(e));
  }
  a.reg.size && (await this.transaction("map", "readwrite", function(e) {
    for (const d of a.map) {
      const f = d[0], g = d[1];
      g.length && (c ? e.put(g, f) : e.get(f).onsuccess = function() {
        let k = this.result;
        var h;
        if (k && k.length) {
          const l = Math.max(k.length, g.length);
          for (let m = 0, t, q; m < l; m++) {
            if ((q = g[m]) && q.length) {
              if ((t = k[m]) && t.length) {
                for (h = 0; h < q.length; h++) {
                  t.push(q[h]);
                }
              } else {
                k[m] = q;
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
          let m = this.result;
          var t;
          if (m && m.length) {
            const q = Math.max(m.length, l.length);
            for (let n = 0, r, u; n < q; n++) {
              if ((u = l[n]) && u.length) {
                if ((r = m[n]) && r.length) {
                  for (t = 0; t < u.length; t++) {
                    r.push(u[t]);
                  }
                } else {
                  m[n] = u;
                }
                t = 1;
              }
            }
          } else {
            m = l, t = 1;
          }
          t && e.put(m, f + ":" + h);
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
function Fb(a, c, b) {
  const e = a.value;
  let d, f = 0;
  for (let g = 0, k; g < e.length; g++) {
    if (k = b ? e : e[g]) {
      for (let h = 0, l, m; h < c.length; h++) {
        if (m = c[h], l = k.indexOf(m), 0 <= l) {
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
    if (b) {
      break;
    }
  }
  f ? d && a.update(e) : a.delete();
  a.continue();
}
v.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(c) {
    c.openCursor().onsuccess = function() {
      const b = this.result;
      b && Fb(b, a);
    };
  }), this.transaction("ctx", "readwrite", function(c) {
    c.openCursor().onsuccess = function() {
      const b = this.result;
      b && Fb(b, a);
    };
  }), this.transaction("tag", "readwrite", function(c) {
    c.openCursor().onsuccess = function() {
      const b = this.result;
      b && Fb(b, a, !0);
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
;const Gb = {Index:P, Charset:rb, Encoder:ma, Document:Pa, Worker:Aa, Resolver:Y, IndexedDB:Eb, Language:{}}, Hb = "undefined" !== typeof self ? self : "undefined" !== typeof global ? global : self;
let Ib;
(Ib = Hb.define) && Ib.amd ? Ib([], function() {
  return Gb;
}) : "object" === typeof Hb.exports ? Hb.exports = Gb : Hb.FlexSearch = Gb;
}(this||self));
