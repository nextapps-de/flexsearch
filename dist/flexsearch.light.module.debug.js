/**!
 * FlexSearch.js v0.8.001 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var r;
function u(a, c, b) {
  const d = typeof b, e = typeof a;
  if ("undefined" !== d) {
    if ("undefined" !== e) {
      if (b) {
        if ("function" === e && d === e) {
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
            var g = new Map(b);
            for (var f of a) {
              g.set(f[0], f[1]);
            }
            return g;
          }
          if (c === Set) {
            f = new Set(b);
            for (g of a.values()) {
              f.add(g);
            }
            return f;
          }
        }
      }
      return a;
    }
    return b;
  }
  return "undefined" === e ? c : a;
}
function x() {
  return Object.create(null);
}
function y(a, c) {
  return c.length - a.length;
}
;const z = /[^\p{L}\p{N}]+/u, A = /(\d{3})/g, B = /(\D)(\d{3})/g, C = /(\d{3})(\D)/g, D = "".normalize && /[\u0300-\u036f]/g;
function E(a) {
  if (!this || this.constructor !== E) {
    return new E(...arguments);
  }
  for (let c = 0; c < arguments.length; c++) {
    this.assign(arguments[c]);
  }
}
r = E.prototype;
r.assign = function(a) {
  this.normalize = u(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split;
  if ("object" === typeof b) {
    let d = !c, e = "";
    a.include || (e += "\\p{Z}");
    b.letter && (e += "\\p{L}");
    b.number && (e += "\\p{N}", d = !!c);
    b.symbol && (e += "\\p{S}");
    b.punctuation && (e += "\\p{P}");
    b.control && (e += "\\p{C}");
    if (b = b.char) {
      e += "object" === typeof b ? b.join("") : b;
    }
    try {
      this.split = new RegExp("[" + (c ? "^" : "") + e + "]+", "u");
    } catch (g) {
      this.split = /\s+/;
    }
    this.numeric = d;
  } else {
    try {
      this.split = u(b, z, this.split);
    } catch (d) {
      this.split = /\s+/;
    }
    this.numeric = u(this.numeric, !0);
  }
  this.prepare = u(a.prepare, null, this.prepare);
  this.finalize = u(a.finalize, null, this.finalize);
  this.rtl = a.rtl || !1;
  this.dedupe = u(a.dedupe, !0, this.dedupe);
  this.filter = u((b = a.filter) && new Set(b), null, this.filter);
  this.matcher = u((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = u((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = u((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = u(a.replacer, null, this.replacer);
  this.minlength = u(a.minlength, 1, this.minlength);
  this.maxlength = u(a.maxlength, 0, this.maxlength);
  if (this.cache = b = u(a.cache, !0, this.cache)) {
    this.l = null, this.v = "number" === typeof b ? b : 2e5, this.h = new Map(), this.j = new Map(), this.o = this.m = 128;
  }
  this.g = "";
  this.s = null;
  this.i = "";
  this.u = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.g += (this.g ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.i += (this.i ? "|" : "") + d;
    }
  }
  return this;
};
r.addMatcher = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (2 > a.length) {
    return this.addMapper(a, c);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, c);
  this.g += (this.g ? "|" : "") + a;
  this.s = null;
  this.cache && F(this);
  return this;
};
r.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.i += (this.i ? "|" : "") + a;
  this.u = null;
  this.cache && F(this);
  return this;
};
r.addFilter = function(a) {
  this.filter || (this.filter = new Set());
  this.filter.add(a);
  this.cache && F(this);
  return this;
};
r.addMapper = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (1 < a.length) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && F(this);
  return this;
};
r.addReplacer = function(a, c) {
  "string" === typeof a && (a = new RegExp(a, "g"));
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c || "");
  this.cache && F(this);
  return this;
};
function F(a) {
  a.h.clear();
  a.j.clear();
}
r.encode = function(a) {
  if (this.cache && a.length <= this.m) {
    if (this.l) {
      if (this.h.has(a)) {
        return this.h.get(a);
      }
    } else {
      this.l = setTimeout(G, 50, this);
    }
  }
  this.normalize && (a = "function" === typeof this.normalize ? this.normalize(a) : D ? a.normalize("NFKD").replace(D, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(B, "$1 $2").replace(C, "$1 $2").replace(A, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let b = [], d = this.split || "" === this.split ? a.split(this.split) : a;
  for (let g = 0, f, h; g < d.length; g++) {
    if (!(f = h = d[g])) {
      continue;
    }
    if (f.length < this.minlength) {
      continue;
    }
    if (c) {
      b.push(f);
      continue;
    }
    if (this.filter && this.filter.has(f)) {
      continue;
    }
    if (this.cache && f.length <= this.o) {
      if (this.l) {
        var e = this.j.get(f);
        if (e || "" === e) {
          e && b.push(e);
          continue;
        }
      } else {
        this.l = setTimeout(G, 50, this);
      }
    }
    let k;
    this.stemmer && 2 < f.length && (this.u || (this.u = new RegExp("(?!^)(" + this.i + ")$")), f = f.replace(this.u, l => this.stemmer.get(l)), k = 1);
    f && k && (f.length < this.minlength || this.filter && this.filter.has(f)) && (f = "");
    if (f && (this.mapper || this.dedupe && 1 < f.length)) {
      e = "";
      for (let l = 0, t = "", q, n; l < f.length; l++) {
        q = f.charAt(l), q === t && this.dedupe || ((n = this.mapper && this.mapper.get(q)) || "" === n ? n === t && this.dedupe || !(t = n) || (e += n) : e += t = q);
      }
      f = e;
    }
    this.matcher && 1 < f.length && (this.s || (this.s = new RegExp("(" + this.g + ")", "g")), f = f.replace(this.s, l => this.matcher.get(l)));
    if (f && this.replacer) {
      for (e = 0; f && e < this.replacer.length; e += 2) {
        f = f.replace(this.replacer[e], this.replacer[e + 1]);
      }
    }
    this.cache && h.length <= this.o && (this.j.set(h, f), this.j.size > this.v && (this.j.clear(), this.o = this.o / 1.1 | 0));
    f && b.push(f);
  }
  this.finalize && (b = this.finalize(b) || b);
  this.cache && a.length <= this.m && (this.h.set(a, b), this.h.size > this.v && (this.h.clear(), this.m = this.m / 1.1 | 0));
  return b;
};
function G(a) {
  a.l = null;
  a.h.clear();
  a.j.clear();
}
;function H(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.g = "";
}
H.prototype.set = function(a, c) {
  this.cache.set(this.g = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
H.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.g !== a && (this.cache.delete(a), this.cache.set(this.g = a, c));
  return c;
};
H.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
H.prototype.clear = function() {
  this.cache.clear();
  this.g = "";
};
const I = {normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1};
const J = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
x();
K.prototype.add = function(a, c, b, d) {
  if (c && (a || 0 === a)) {
    if (!d && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (d = c.length) {
      const l = x(), t = x(), q = this.depth, n = this.resolution;
      for (let m = 0; m < d; m++) {
        let p = c[this.rtl ? d - 1 - m : m];
        var e = p.length;
        if (e && (q || !t[p])) {
          var g = this.score ? this.score(c, p, m, null, 0) : L(n, d, m), f = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (g = 0; g < e; g++) {
                  for (var h = e; h > g; h--) {
                    f = p.substring(g, h);
                    var k = this.score ? this.score(c, p, m, f, g) : L(n, d, m, e, g);
                    M(this, t, f, k, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  f = p[h] + f, k = this.score ? this.score(c, p, m, f, h) : L(n, d, m, e, h), M(this, t, f, k, a, b);
                }
                f = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  f += p[h], M(this, t, f, g, a, b);
                }
                break;
              }
            default:
              if (M(this, t, p, g, a, b), q && 1 < d && m < d - 1) {
                for (e = x(), f = this.A, g = p, h = Math.min(q + 1, d - m), e[g] = 1, k = 1; k < h; k++) {
                  if ((p = c[this.rtl ? d - 1 - m - k : m + k]) && !e[p]) {
                    e[p] = 1;
                    const v = this.score ? this.score(c, g, m, p, k) : L(f + (d / 2 > f ? 0 : 1), d, m, h - 1, k - 1), w = this.bidirectional && p > g;
                    M(this, l, w ? g : p, v, a, b, w ? p : g);
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
function M(a, c, b, d, e, g, f) {
  let h = f ? a.ctx : a.map, k;
  if (!c[b] || f && !(k = c[b])[f]) {
    f ? (c = k || (c[b] = x()), c[f] = 1, (k = h.get(f)) ? h = k : h.set(f, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[d] || (h[d] = []), g && h.includes(e) || (h.push(e), a.fastupdate && ((c = a.reg.get(e)) ? c.push(h) : a.reg.set(e, [h])));
  }
}
function L(a, c, b, d, e) {
  return b && 1 < a ? c + (d || 0) <= a ? b + (e || 0) : (a - 1) / (c + (d || 0)) * (b + (e || 0)) + 1 | 0 : 0;
}
;function N(a, c, b) {
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a;
  }
  let d = [];
  for (let e = 0, g, f; e < a.length; e++) {
    if ((g = a[e]) && (f = g.length)) {
      if (b) {
        if (b >= f) {
          b -= f;
          continue;
        }
        b < f && (g = c ? g.slice(b, b + c) : g.slice(b), f = g.length, b = 0);
      }
      if (d.length) {
        f > c && (g = g.slice(0, c), f = g.length), d.push(g);
      } else {
        if (f >= c) {
          return f > c && (g = g.slice(0, c)), g;
        }
        d = [g];
      }
      c -= f;
      if (!c) {
        break;
      }
    }
  }
  return d.length ? d = 1 < d.length ? [].concat.apply([], d) : d[0] : d;
}
;K.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  var d = [], e = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    e = b.offset || 0;
    var g = b.context;
    var f = b.suggest;
    var h = !0;
    var k = b.resolution;
  } else {
    h = !0;
  }
  var l = this.encoder.encode(a);
  b = l.length;
  c || !h || (c = 100);
  if (1 === b) {
    return O.call(this, l[0], "", c, e);
  }
  g = this.depth && !1 !== g;
  if (2 === b && g && !f) {
    return O.call(this, l[0], l[1], c, e);
  }
  let t = h = 0;
  if (1 < b) {
    const n = x(), m = [];
    for (let p = 0, v; p < b; p++) {
      if ((v = l[p]) && !n[v]) {
        if (f || P(this, v)) {
          m.push(v), n[v] = 1;
        } else {
          return d;
        }
        const w = v.length;
        h = Math.max(h, w);
        t = t ? Math.min(t, w) : w;
      }
    }
    l = m;
    b = a.length;
  }
  if (!b) {
    return d;
  }
  a = 0;
  if (1 === b) {
    return O.call(this, l[0], "", c, e);
  }
  if (2 === b && g && !f) {
    return O.call(this, l[0], l[1], c, e);
  }
  if (1 < b) {
    if (g) {
      var q = l[0];
      a = 1;
    } else {
      9 < h && 3 < h / t && l.sort(y);
    }
  }
  k || 0 === k || (k = this.resolution);
  for (let n, m; a < b; a++) {
    m = l[a];
    q ? (n = P(this, m, q), n = Q(n, d, f, this.A), f && !1 === n && d.length || (q = m)) : (n = P(this, m, ""), n = Q(n, d, f, k));
    if (n) {
      return n;
    }
    if (f && a === b - 1) {
      g = d.length;
      if (!g) {
        if (q) {
          q = "";
          a = -1;
          continue;
        }
        return d;
      }
      if (1 === g) {
        return N(d[0], c, e);
      }
    }
  }
  a: {
    q = f;
    b = d.length;
    f = [];
    g = x();
    for (let n = 0, m, p, v, w; n < k; n++) {
      for (a = 0; a < b; a++) {
        if (v = d[a], n < v.length && (m = v[n])) {
          for (h = 0; h < m.length; h++) {
            p = m[h], (l = g[p]) ? g[p]++ : (l = 0, g[p] = 1), w = f[l] || (f[l] = []), w.push(p);
          }
        }
      }
    }
    if (k = f.length) {
      if (q) {
        if (1 < f.length) {
          b: {
            for (k = [], d = x(), q = f.length, l = q - 1; 0 <= l; l--) {
              for (q = f[l], g = q.length, a = 0; a < g; a++) {
                if (b = q[a], !d[b]) {
                  if (d[b] = 1, e) {
                    e--;
                  } else {
                    if (k.push(b), k.length === c) {
                      break b;
                    }
                  }
                }
              }
            }
          }
        } else {
          k = (f = f[0]).length > c || e ? f.slice(e, c + e) : f;
        }
        f = k;
      } else {
        if (k < b) {
          d = [];
          break a;
        }
        f = f[k - 1];
        if (c || e) {
          if (f.length > c || e) {
            f = f.slice(e, c + e);
          }
        }
      }
    }
    d = f;
  }
  return d;
};
function O(a, c, b, d) {
  return (a = P(this, a, c)) && a.length ? N(a, b, d) : [];
}
function Q(a, c, b, d) {
  let e = [];
  if (a) {
    d = Math.min(a.length, d);
    for (let g = 0, f; g < d; g++) {
      (f = a[g]) && f && (e[g] = f);
    }
    if (e.length) {
      c.push(e);
      return;
    }
  }
  return !b && e;
}
function P(a, c, b) {
  let d;
  b && (d = a.bidirectional && c > b);
  a = b ? (a = a.ctx.get(d ? c : b)) && a.get(d ? b : c) : a.map.get(c);
  return a;
}
;K.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let d = 0, e; d < b.length; d++) {
        if (e = b[d]) {
          if (2 > e.length) {
            e.pop();
          } else {
            const g = e.indexOf(a);
            g === b.length - 1 ? e.pop() : e.splice(g, 1);
          }
        }
      }
    } else {
      R(this.map, a), this.depth && R(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function R(a, c) {
  let b = 0;
  if (a.constructor === Array) {
    for (let d = 0, e, g; d < a.length; d++) {
      if ((e = a[d]) && e.length) {
        if (g = e.indexOf(c), 0 <= g) {
          1 < e.length ? (e.splice(g, 1), b++) : delete a[d];
          break;
        } else {
          b++;
        }
      }
    }
  } else {
    for (let d of a) {
      const e = d[0], g = R(d[1], c);
      g ? b += g : a.delete(e);
    }
  }
  return b;
}
;function K(a, c) {
  if (!this || this.constructor !== K) {
    return new K(a);
  }
  if (a) {
    var b = "string" === typeof a ? a : a.preset;
    b && (J[b] || console.warn("Preset not found: " + b), a = Object.assign({}, J[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const d = !0 === b ? {depth:1} : b || {}, e = a.encode || a.encoder || I;
  this.encoder = e.encode ? e : "object" === typeof e ? new E(e) : {encode:e};
  this.resolution = a.resolution || 9;
  this.tokenize = b = a.tokenize || "strict";
  this.depth = "strict" === b && d.depth || 0;
  this.bidirectional = !1 !== d.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  b = !1;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.A = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (b = a.cache || null) && new H(b);
}
r = K.prototype;
r.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  return this;
};
r.append = function(a, c) {
  return this.add(a, c, !0);
};
r.contain = function(a) {
  return this.reg.has(a);
};
r.update = function(a, c) {
  const b = this, d = this.remove(a);
  return d && d.then ? d.then(() => b.add(a, c)) : this.add(a, c);
};
function S(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, d; b < a.length; b++) {
      (d = a[b]) && (c += d.length);
    }
  } else {
    for (const b of a) {
      const d = b[0], e = S(b[1]);
      e ? c += e : a.delete(d);
    }
  }
  return c;
}
r.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  S(this.map);
  this.depth && S(this.ctx);
  return this;
};
r.searchCache = function(a, c, b) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  let d = this.cache.get(a);
  if (!d) {
    d = this.search(a, c, b);
    if (d.then) {
      const e = this;
      d.then(function(g) {
        e.cache.set(a, g);
        return g;
      });
    }
    this.cache.set(a, d);
  }
  return d;
};
export default {Index:K, Charset:null, Encoder:E, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=K;export const  Charset=null;export const  Encoder=E;export const  Document=null;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};