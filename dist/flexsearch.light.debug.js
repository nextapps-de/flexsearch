/**!
 * FlexSearch.js v0.8.0 (Light/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
function t(a, c, b) {
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
function u(a, c) {
  return c.length - a.length;
}
;const w = /[^\p{L}\p{N}]+/u, x = /(\d{3})/g, y = /(\D)(\d{3})/g, z = /(\d{3})(\D)/g, A = "".normalize && /[\u0300-\u036f]/g;
function B(a) {
  if (!this) {
    return new B(...arguments);
  }
  for (let c = 0; c < arguments.length; c++) {
    this.assign(arguments[c]);
  }
}
B.prototype.assign = function(a) {
  this.normalize = t(a.normalize, !0, this.normalize);
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
    this.split = new RegExp("[" + (c ? "^" : "") + e + "]+", "u");
    this.numeric = d;
  } else {
    this.split = t(b, w, this.split), this.numeric = t(this.numeric, !0);
  }
  this.prepare = t(a.prepare, null, this.prepare);
  this.finalize = t(a.finalize, null, this.finalize);
  this.rtl = a.rtl || !1;
  this.dedupe = t(a.dedupe, !0, this.dedupe);
  this.filter = t((b = a.filter) && new Set(b), null, this.filter);
  this.matcher = t((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = t((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = t((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = t(a.replacer, null, this.replacer);
  this.minlength = t(a.minlength, 1, this.minlength);
  this.maxlength = t(a.maxlength, 0, this.maxlength);
  if (this.cache = b = t(a.cache, !0, this.cache)) {
    this.m = null, this.B = "number" === typeof b ? b : 2e5, this.i = new Map(), this.j = new Map(), this.o = this.h = 128;
  }
  this.s = "";
  this.v = null;
  this.u = "";
  this.A = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.s += (this.s ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.u += (this.u ? "|" : "") + d;
    }
  }
  return this;
};
B.prototype.encode = function(a) {
  if (this.cache && a.length <= this.h) {
    if (this.m) {
      if (this.i.has(a)) {
        return this.i.get(a);
      }
    } else {
      this.m = setTimeout(C, 0, this);
    }
  }
  this.normalize && (a = "function" === typeof this.normalize ? this.normalize(a) : A ? a.normalize("NFKD").replace(A, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(y, "$1 $2").replace(z, "$1 $2").replace(x, "$1 "));
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
      if (this.m) {
        var e = this.j.get(f);
        if (e || "" === e) {
          e && b.push(e);
          continue;
        }
      } else {
        this.m = setTimeout(C, 0, this);
      }
    }
    let l;
    this.stemmer && 2 < f.length && (this.A || (this.A = new RegExp("(?!^)(" + this.u + ")$")), f = f.replace(this.A, r => this.stemmer.get(r)), l = 1);
    this.matcher && 1 < f.length && (this.v || (this.v = new RegExp("(" + this.s + ")", "g")), f = f.replace(this.v, r => this.matcher.get(r)), l = 1);
    f && l && (f.length < this.minlength || this.filter && this.filter.has(f)) && (f = "");
    if (f && (this.mapper || this.dedupe && 1 < f.length)) {
      e = "";
      for (let r = 0, k = "", p, q; r < f.length; r++) {
        p = f.charAt(r), p === k && this.dedupe || ((q = this.mapper && this.mapper.get(p)) || "" === q ? q === k && this.dedupe || !(k = q) || (e += q) : e += k = p);
      }
      f = e;
    }
    if (f && this.replacer) {
      for (e = 0; f && e < this.replacer.length; e += 2) {
        f = f.replace(this.replacer[e], this.replacer[e + 1]);
      }
    }
    this.cache && h.length <= this.o && (this.j.set(h, f), this.j.size > this.B && (this.j.clear(), this.o = this.o / 1.1 | 0));
    f && b.push(f);
  }
  this.finalize && (b = this.finalize(b) || b);
  this.cache && a.length <= this.h && (this.i.set(a, b), this.i.size > this.B && (this.i.clear(), this.h = this.h / 1.1 | 0));
  return b;
};
function C(a) {
  a.m = null;
  a.i.clear();
  a.j.clear();
}
;function D(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
D.prototype.set = function(a, c) {
  this.cache.set(this.h = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
D.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
  return c;
};
D.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
D.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const E = {normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1};
const F = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
Object.create(null);
G.prototype.add = function(a, c, b, d) {
  if (c && (a || 0 === a)) {
    if (!d && !b && this.g.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (d = c.length) {
      const r = Object.create(null), k = Object.create(null), p = this.depth, q = this.resolution;
      for (let m = 0; m < d; m++) {
        let n = c[this.rtl ? d - 1 - m : m];
        var e = n.length;
        if (e && (p || !k[n])) {
          var g = this.score ? this.score(c, n, m, null, 0) : H(q, d, m), f = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (g = 0; g < e; g++) {
                  for (var h = e; h > g; h--) {
                    f = n.substring(g, h);
                    var l = this.score ? this.score(c, n, m, f, g) : H(q, d, m, e, g);
                    I(this, k, f, l, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  f = n[h] + f, l = this.score ? this.score(c, n, m, f, h) : H(q, d, m, e, h), I(this, k, f, l, a, b);
                }
                f = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  f += n[h], I(this, k, f, g, a, b);
                }
                break;
              }
            default:
              if (I(this, k, n, g, a, b), p && 1 < d && m < d - 1) {
                for (e = Object.create(null), f = this.C, g = n, h = Math.min(p + 1, d - m), e[g] = 1, l = 1; l < h; l++) {
                  if ((n = c[this.rtl ? d - 1 - m - l : m + l]) && !e[n]) {
                    e[n] = 1;
                    const v = this.score ? this.score(c, g, m, n, l) : H(f + (d / 2 > f ? 0 : 1), d, m, h - 1, l - 1), L = this.bidirectional && n > g;
                    I(this, r, L ? g : n, v, a, b, L ? n : g);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || this.g.add(a);
    }
  }
  return this;
};
function I(a, c, b, d, e, g, f) {
  let h = f ? a.l : a.map, l;
  c[b] && f && (l = c[b])[f] || (f ? (c = l || (c[b] = Object.create(null)), c[f] = 1, (l = h.get(f)) ? h = l : h.set(f, h = new Map())) : c[b] = 1, (l = h.get(b)) ? h = l : h.set(b, h = []), h = h[d] || (h[d] = []), g && h.includes(e) || (h.push(e), a.fastupdate && ((c = a.g.get(e)) ? c.push(h) : a.g.set(e, [h]))));
}
function H(a, c, b, d, e) {
  return b && 1 < a ? c + (d || 0) <= a ? b + (e || 0) : (a - 1) / (c + (d || 0)) * (b + (e || 0)) + 1 | 0 : 0;
}
;function J(a, c, b) {
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
;function K(a, c, b, d) {
  var e = a.length;
  let g = [], f = 0, h, l, r;
  d && (d = []);
  for (let k = e - 1, p; 0 <= k; k--) {
    r = a[k];
    e = Object.create(null);
    p = !h;
    for (let q = 0, m; q < r.length; q++) {
      if ((m = r[q]) && m.length) {
        for (let n = 0, v; n < m.length; n++) {
          if (v = m[n], h) {
            if (h[v]) {
              if (!k) {
                if (b) {
                  b--;
                } else {
                  if (g[f++] = v, f === c) {
                    return g;
                  }
                }
              }
              if (k || d) {
                e[v] = 1;
              }
              p = !0;
            }
            d && !l[v] && (l[v] = 1, (d[q] || (d[q] = [])).push(v));
          } else {
            e[v] = 1;
          }
        }
      }
    }
    if (d) {
      h || (l = e);
    } else if (!p) {
      return [];
    }
    h = e;
  }
  if (d) {
    for (let k = d.length - 1, p, q; 0 <= k; k--) {
      p = d[k];
      q = p.length;
      for (let m = 0, n; m < q; m++) {
        if (n = p[m], !h[n]) {
          if (b) {
            b--;
          } else {
            if (g[f++] = n, f === c) {
              return g;
            }
          }
          h[n] = 1;
        }
      }
    }
  }
  return g;
}
;G.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  let d = [];
  let e, g = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    g = b.offset || 0;
    var f = b.context;
    e = b.suggest;
  }
  a = this.encoder.encode(a);
  b = a.length;
  c || (c = 100);
  if (1 === b) {
    return M.call(this, a[0], "", c, g);
  }
  f = this.depth && !1 !== f;
  if (2 === b && f && !e) {
    return M.call(this, a[0], a[1], c, g);
  }
  let h = 0, l = 0;
  if (1 < b) {
    var r = Object.create(null);
    const p = [];
    for (let q = 0, m; q < b; q++) {
      if ((m = a[q]) && !r[m]) {
        if (e || N(this, m)) {
          p.push(m), r[m] = 1;
        } else {
          return d;
        }
        const n = m.length;
        h = Math.max(h, n);
        l = l ? Math.min(l, n) : n;
      }
    }
    a = p;
    b = a.length;
  }
  if (!b) {
    return d;
  }
  r = 0;
  let k;
  if (1 === b) {
    return M.call(this, a[0], "", c, g);
  }
  if (2 === b && f && !e) {
    return M.call(this, a[0], a[1], c, g);
  }
  1 < b && (f ? (k = a[0], r = 1) : 9 < h && 3 < h / l && a.sort(u));
  for (let p, q; r < b; r++) {
    q = a[r];
    k ? (p = N(this, q, k), p = O(p, d, e, this.C, c, g, 2 === b), e && !1 === p && d.length || (k = q)) : (p = N(this, q), p = O(p, d, e, this.resolution, c, g, 1 === b));
    if (p) {
      return p;
    }
    if (e && r === b - 1) {
      f = d.length;
      if (!f) {
        if (k) {
          k = "";
          r = -1;
          continue;
        }
        return d;
      }
      if (1 === f) {
        return J(d[0], c, g);
      }
    }
  }
  return K(d, c, g, e);
};
function M(a, c, b, d) {
  return (a = N(this, a, c)) && a.length ? J(a, b, d) : [];
}
function O(a, c, b, d, e, g, f) {
  let h = [];
  if (a) {
    d = Math.min(a.length, d);
    for (let l = 0, r = 0, k; l < d; l++) {
      if (k = a[l]) {
        if (g && k && f && (k.length <= g ? (g -= k.length, k = null) : (k = k.slice(g), g = 0)), k && (h[l] = k, f && (r += k.length, r >= e))) {
          break;
        }
      }
    }
    if (h.length) {
      if (f) {
        return J(h, e, 0);
      }
      c.push(h);
      return;
    }
  }
  return !b && h;
}
function N(a, c, b) {
  let d;
  b && (d = a.bidirectional && c > b);
  a = b ? (a = a.l.get(d ? c : b)) && a.get(d ? b : c) : a.map.get(c);
  return a;
}
;G.prototype.remove = function(a, c) {
  const b = this.g.size && (this.fastupdate ? this.g.get(a) : this.g.has(a));
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
      P(this.map, a), this.depth && P(this.l, a);
    }
    c || this.g.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function P(a, c) {
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
      const e = d[0], g = P(d[1], c);
      g ? b += g : a.delete(e);
    }
  }
  return b;
}
;function G(a, c) {
  if (!this) {
    return new G(a);
  }
  if (a) {
    var b = "string" === typeof a ? a : a.preset;
    b && (F[b] || console.warn("Preset not found: " + b), a = Object.assign({}, F[b], a));
  } else {
    a = {};
  }
  b = a.context || {};
  const d = a.encode || a.encoder || E;
  this.encoder = d.encode ? d : "object" === typeof d ? new B(d) : {encode:d};
  let e;
  this.resolution = a.resolution || 9;
  this.tokenize = e = a.tokenize || "strict";
  this.depth = "strict" === e && b.depth || 0;
  this.bidirectional = !1 !== b.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e = !1;
  this.map = new Map();
  this.l = new Map();
  this.g = c || (this.fastupdate ? new Map() : new Set());
  this.C = b.resolution || 1;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (e = a.cache || null) && new D(e);
}
G.prototype.clear = function() {
  this.map.clear();
  this.l.clear();
  this.g.clear();
  this.cache && this.cache.clear();
  return this;
};
G.prototype.append = function(a, c) {
  return this.add(a, c, !0);
};
G.prototype.contain = function(a) {
  return this.g.has(a);
};
G.prototype.update = function(a, c) {
  if (this.async) {
    const b = this, d = this.remove(a);
    return d.then ? d.then(() => b.add(a, c)) : this.add(a, c);
  }
  return this.remove(a).add(a, c);
};
function Q(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, d; b < a.length; b++) {
      (d = a[b]) && (c += d.length);
    }
  } else {
    for (const b of a) {
      const d = b[0], e = Q(b[1]);
      e ? c += e : a.delete(d);
    }
  }
  return c;
}
G.prototype.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Q(this.map);
  this.depth && Q(this.l);
  return this;
};
G.prototype.searchCache = function(a, c, b) {
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
const R = {Index:G, Charset:null, Encoder:B, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, S = self;
let T;
(T = S.define) && T.amd ? T([], function() {
  return R;
}) : "object" === typeof S.exports ? S.exports = R : S.FlexSearch = R;
}(this));
