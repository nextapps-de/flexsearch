/**!
 * FlexSearch.js v0.8.102 (Light/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;
var r;
function u(a, c, b) {
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
  return "undefined" === d ? c : a;
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
    let e = !c, d = "";
    a.include || (d += "\\p{Z}");
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
    } catch (g) {
      this.split = /\s+/;
    }
    this.numeric = e;
  } else {
    try {
      this.split = u(b, z, this.split);
    } catch (e) {
      this.split = /\s+/;
    }
    this.numeric = u(this.numeric, !0);
  }
  this.prepare = u(a.prepare, null, this.prepare);
  this.finalize = u(a.finalize, null, this.finalize);
  this.rtl = a.rtl || !1;
  this.dedupe = u(a.dedupe, !1, this.dedupe);
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
    for (const e of this.matcher.keys()) {
      this.g += (this.g ? "|" : "") + e;
    }
  }
  if (this.stemmer) {
    for (const e of this.stemmer.keys()) {
      this.i += (this.i ? "|" : "") + e;
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
  let b = [], e = this.split || "" === this.split ? a.split(this.split) : a;
  for (let g = 0, f, h; g < e.length; g++) {
    if (!(f = h = e[g])) {
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
        var d = this.j.get(f);
        if (d || "" === d) {
          d && b.push(d);
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
      d = "";
      for (let l = 0, t = "", q, n; l < f.length; l++) {
        q = f.charAt(l), q === t && this.dedupe || ((n = this.mapper && this.mapper.get(q)) || "" === n ? n === t && this.dedupe || !(t = n) || (d += n) : d += t = q);
      }
      f = d;
    }
    this.matcher && 1 < f.length && (this.s || (this.s = new RegExp("(" + this.g + ")", "g")), f = f.replace(this.s, l => this.matcher.get(l)));
    if (f && this.replacer) {
      for (d = 0; f && d < this.replacer.length; d += 2) {
        f = f.replace(this.replacer[d], this.replacer[d + 1]);
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
K.prototype.add = function(a, c, b, e) {
  if (c && (a || 0 === a)) {
    if (!e && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (e = c.length) {
      const l = x(), t = x(), q = this.depth, n = this.resolution;
      for (let m = 0; m < e; m++) {
        let p = c[this.rtl ? e - 1 - m : m];
        var d = p.length;
        if (d && (q || !t[p])) {
          var g = this.score ? this.score(c, p, m, null, 0) : L(n, e, m), f = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (g = 0; g < d; g++) {
                  for (var h = d; h > g; h--) {
                    f = p.substring(g, h);
                    var k = this.score ? this.score(c, p, m, f, g) : L(n, e, m, d, g);
                    M(this, t, f, k, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < d) {
                for (h = d - 1; 0 < h; h--) {
                  f = p[h] + f, k = this.score ? this.score(c, p, m, f, h) : L(n, e, m, d, h), M(this, t, f, k, a, b);
                }
                f = "";
              }
            case "forward":
              if (1 < d) {
                for (h = 0; h < d; h++) {
                  f += p[h], M(this, t, f, g, a, b);
                }
                break;
              }
            default:
              if (M(this, t, p, g, a, b), q && 1 < e && m < e - 1) {
                for (d = x(), f = this.A, g = p, h = Math.min(q + 1, e - m), d[g] = 1, k = 1; k < h; k++) {
                  if ((p = c[this.rtl ? e - 1 - m - k : m + k]) && !d[p]) {
                    d[p] = 1;
                    const v = this.score ? this.score(c, g, m, p, k) : L(f + (e / 2 > f ? 0 : 1), e, m, h - 1, k - 1), w = this.bidirectional && p > g;
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
function M(a, c, b, e, d, g, f) {
  let h = f ? a.ctx : a.map, k;
  if (!c[b] || f && !(k = c[b])[f]) {
    f ? (c = k || (c[b] = x()), c[f] = 1, (k = h.get(f)) ? h = k : h.set(f, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[e] || (h[e] = []), g && h.includes(d) || (h.push(d), a.fastupdate && ((c = a.reg.get(d)) ? c.push(h) : a.reg.set(d, [h])));
  }
}
function L(a, c, b, e, d) {
  return b && 1 < a ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;function N(a, c, b) {
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a;
  }
  let e = [];
  for (let d = 0, g, f; d < a.length; d++) {
    if ((g = a[d]) && (f = g.length)) {
      if (b) {
        if (b >= f) {
          b -= f;
          continue;
        }
        b < f && (g = c ? g.slice(b, b + c) : g.slice(b), f = g.length, b = 0);
      }
      if (e.length) {
        f > c && (g = g.slice(0, c), f = g.length);
      } else {
        if (f >= c) {
          return f > c && (g = g.slice(0, c)), g;
        }
      }
      e.push(g);
      c -= f;
      if (!c) {
        break;
      }
    }
  }
  return e.length ? e = 1 < e.length ? [].concat.apply([], e) : e[0] : e;
}
;K.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  var e = [], d = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    d = b.offset || 0;
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
    return O.call(this, l[0], "", c, d);
  }
  g = this.depth && !1 !== g;
  if (2 === b && g && !f) {
    return O.call(this, l[0], l[1], c, d);
  }
  let t = h = 0;
  if (1 < b) {
    const n = x(), m = [];
    for (let p = 0, v; p < b; p++) {
      if ((v = l[p]) && !n[v]) {
        if (f || P(this, v)) {
          m.push(v), n[v] = 1;
        } else {
          return e;
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
    return e;
  }
  a = 0;
  if (1 === b) {
    return O.call(this, l[0], "", c, d);
  }
  if (2 === b && g && !f) {
    return O.call(this, l[0], l[1], c, d);
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
    q ? (n = P(this, m, q), n = Q(n, e, f, this.A), f && !1 === n && e.length || (q = m)) : (n = P(this, m, ""), n = Q(n, e, f, k));
    if (n) {
      return n;
    }
    if (f && a === b - 1) {
      g = e.length;
      if (!g) {
        if (q) {
          q = "";
          a = -1;
          continue;
        }
        return e;
      }
      if (1 === g) {
        return N(e[0], c, d);
      }
    }
  }
  a: {
    q = f;
    b = e.length;
    f = [];
    g = x();
    for (let n = 0, m, p, v, w; n < k; n++) {
      for (a = 0; a < b; a++) {
        if (v = e[a], n < v.length && (m = v[n])) {
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
            for (k = [], e = x(), q = f.length, l = q - 1; 0 <= l; l--) {
              for (q = f[l], g = q.length, a = 0; a < g; a++) {
                if (b = q[a], !e[b]) {
                  if (e[b] = 1, d) {
                    d--;
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
          k = (f = f[0]).length > c || d ? f.slice(d, c + d) : f;
        }
        f = k;
      } else {
        if (k < b) {
          e = [];
          break a;
        }
        f = f[k - 1];
        if (c || d) {
          if (f.length > c || d) {
            f = f.slice(d, c + d);
          }
        }
      }
    }
    e = f;
  }
  return e;
};
function O(a, c, b, e) {
  return (a = P(this, a, c)) && a.length ? N(a, b, e) : [];
}
function Q(a, c, b, e) {
  let d = [];
  if (a) {
    e = Math.min(a.length, e);
    for (let g = 0, f; g < e; g++) {
      (f = a[g]) && f && (d[g] = f);
    }
    if (d.length) {
      c.push(d);
      return;
    }
  }
  return !b && d;
}
function P(a, c, b) {
  let e;
  b && (e = a.bidirectional && c > b);
  a = b ? (a = a.ctx.get(e ? c : b)) && a.get(e ? b : c) : a.map.get(c);
  return a;
}
;K.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let e = 0, d; e < b.length; e++) {
        if (d = b[e]) {
          if (2 > d.length) {
            d.pop();
          } else {
            const g = d.indexOf(a);
            g === b.length - 1 ? d.pop() : d.splice(g, 1);
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
    for (let e = 0, d, g; e < a.length; e++) {
      if ((d = a[e]) && d.length) {
        if (g = d.indexOf(c), 0 <= g) {
          1 < d.length ? (d.splice(g, 1), b++) : delete a[e];
          break;
        } else {
          b++;
        }
      }
    }
  } else {
    for (let e of a) {
      const d = e[0], g = R(e[1], c);
      g ? b += g : a.delete(d);
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
  const e = !0 === b ? {depth:1} : b || {}, d = a.encode || a.encoder || I;
  this.encoder = d.encode ? d : "object" === typeof d ? new E(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = a.tokenize || "strict";
  this.depth = "strict" === b && e.depth || 0;
  this.bidirectional = !1 !== e.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  b = !1;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.A = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
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
  const b = this, e = this.remove(a);
  return e && e.then ? e.then(() => b.add(a, c)) : this.add(a, c);
};
function S(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, e; b < a.length; b++) {
      (e = a[b]) && (c += e.length);
    }
  } else {
    for (const b of a) {
      const e = b[0], d = S(b[1]);
      d ? c += d : a.delete(e);
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
  let e = this.cache.get(a);
  if (!e) {
    e = this.search(a, c, b);
    if (e.then) {
      const d = this;
      e.then(function(g) {
        d.cache.set(a, g);
        return g;
      });
    }
    this.cache.set(a, e);
  }
  return e;
};
const T = {Index:K, Charset:null, Encoder:E, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, U = self;
let V;
(V = U.define) && V.amd ? V([], function() {
  return T;
}) : "object" === typeof U.exports ? U.exports = T : U.FlexSearch = T;
}(this||self));
