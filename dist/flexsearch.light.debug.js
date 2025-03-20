/**!
 * FlexSearch.js v0.8.107 (Light/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var t;
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
function w() {
  return Object.create(null);
}
function x(a) {
  let c = 0;
  for (let b = 0, d; b < a.length; b++) {
    (d = a[b]) && c < d.length && (c = d.length);
  }
  return c;
}
;const aa = /[^\p{L}\p{N}]+/u, ba = /(\d{3})/g, ca = /(\D)(\d{3})/g, da = /(\d{3})(\D)/g, y = "".normalize && /[\u0300-\u036f]/g;
function z(a) {
  if (!this || this.constructor !== z) {
    return new z(...arguments);
  }
  for (let c = 0; c < arguments.length; c++) {
    this.assign(arguments[c]);
  }
}
t = z.prototype;
t.assign = function(a) {
  this.normalize = u(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split, d;
  if (b || "" === b) {
    if ("object" === typeof b && b.constructor !== RegExp) {
      let e = "";
      d = !c;
      c || (e += "\\p{Z}");
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
        console.error("Your split configuration:", b, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = b, d = !1 === b || 2 > "a1a".split(b).length;
    }
    this.numeric = u(a.numeric, d);
  } else {
    try {
      this.split = u(this.split, aa);
    } catch (e) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = u(a.numeric, u(this.numeric, !0));
  }
  this.prepare = u(a.prepare, null, this.prepare);
  this.finalize = u(a.finalize, null, this.finalize);
  this.rtl = u(a.rtl, !1, this.rtl);
  this.dedupe = u(a.dedupe, !1, this.dedupe);
  this.filter = u((b = a.filter) && new Set(b), null, this.filter);
  this.matcher = u((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = u((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = u((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = u(a.replacer, null, this.replacer);
  this.minlength = u(a.minlength, 1, this.minlength);
  this.maxlength = u(a.maxlength, 0, this.maxlength);
  if (this.cache = b = u(a.cache, !0, this.cache)) {
    this.l = null, this.C = "number" === typeof b ? b : 2e5, this.i = new Map(), this.j = new Map(), this.s = this.o = 128;
  }
  this.g = "";
  this.v = null;
  this.h = "";
  this.A = null;
  if (this.matcher) {
    for (const e of this.matcher.keys()) {
      this.g += (this.g ? "|" : "") + e;
    }
  }
  if (this.stemmer) {
    for (const e of this.stemmer.keys()) {
      this.h += (this.h ? "|" : "") + e;
    }
  }
  return this;
};
t.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.h += (this.h ? "|" : "") + a;
  this.A = null;
  this.cache && B(this);
  return this;
};
t.addFilter = function(a) {
  this.filter || (this.filter = new Set());
  this.filter.add(a);
  this.cache && B(this);
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
  this.cache && B(this);
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
  this.g += (this.g ? "|" : "") + a;
  this.v = null;
  this.cache && B(this);
  return this;
};
t.addReplacer = function(a, c) {
  if ("string" === typeof a) {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && B(this);
  return this;
};
t.encode = function(a) {
  if (this.cache && a.length <= this.o) {
    if (this.l) {
      if (this.i.has(a)) {
        return this.i.get(a);
      }
    } else {
      this.l = setTimeout(B, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = y ? a.normalize("NFKD").replace(y, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ca, "$1 $2").replace(da, "$1 $2").replace(ba, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let b = [], d = this.split || "" === this.split ? a.split(this.split) : a;
  for (let g = 0, f, h; g < d.length; g++) {
    if ((f = h = d[g]) && !(f.length < this.minlength)) {
      if (c) {
        b.push(f);
      } else {
        if (!this.filter || !this.filter.has(f)) {
          if (this.cache && f.length <= this.s) {
            if (this.l) {
              var e = this.j.get(f);
              if (e || "" === e) {
                e && b.push(e);
                continue;
              }
            } else {
              this.l = setTimeout(B, 50, this);
            }
          }
          this.stemmer && 2 < f.length && (this.A || (this.A = new RegExp("(?!^)(" + this.h + ")$")), f = f.replace(this.A, k => this.stemmer.get(k)), f.length < this.minlength || this.filter && this.filter.has(f)) && (f = "");
          if (f && (this.mapper || this.dedupe && 1 < f.length)) {
            e = "";
            for (let k = 0, l = "", n, m; k < f.length; k++) {
              n = f.charAt(k), n === l && this.dedupe || ((m = this.mapper && this.mapper.get(n)) || "" === m ? m === l && this.dedupe || !(l = m) || (e += m) : e += l = n);
            }
            f = e;
          }
          this.matcher && 1 < f.length && (this.v || (this.v = new RegExp("(" + this.g + ")", "g")), f = f.replace(this.v, k => this.matcher.get(k)));
          if (f && this.replacer) {
            for (e = 0; f && e < this.replacer.length; e += 2) {
              f = f.replace(this.replacer[e], this.replacer[e + 1]);
            }
          }
          this.cache && h.length <= this.s && (this.j.set(h, f), this.j.size > this.C && (this.j.clear(), this.s = this.s / 1.1 | 0));
          f && b.push(f);
        }
      }
    }
  }
  this.finalize && (b = this.finalize(b) || b);
  this.cache && a.length <= this.o && (this.i.set(a, b), this.i.size > this.C && (this.i.clear(), this.o = this.o / 1.1 | 0));
  return b;
};
function B(a) {
  a.l = null;
  a.i.clear();
  a.j.clear();
}
;function C(a, c, b, d, e) {
  const g = a.length;
  let f = [], h, k;
  h = w();
  for (let l = 0, n, m, r, q; l < c; l++) {
    for (let p = 0; p < g; p++) {
      if (r = a[p], l < r.length && (n = r[l])) {
        for (let v = 0; v < n.length; v++) {
          m = n[v], (k = h[m]) ? h[m]++ : (k = 0, h[m] = 1), q = f[k] || (f[k] = []), q.push(m);
        }
      }
    }
  }
  if (a = f.length) {
    if (e) {
      f = 1 < f.length ? D(f, b, d) : (f = f[0]).length > b || d ? f.slice(d, b + d) : f;
    } else {
      if (a < g) {
        return [];
      }
      f = f[a - 1];
      if (b || d) {
        if (f.length > b || d) {
          f = f.slice(d, b + d);
        }
      }
    }
  }
  return f;
}
function D(a, c, b) {
  const d = [], e = w();
  let g;
  var f = a.length;
  let h;
  for (let k = f - 1; 0 <= k; k--) {
    if (h = (f = a[k]) && f.length) {
      for (let l = 0; l < h; l++) {
        if (g = f[l], !e[g]) {
          if (e[g] = 1, b) {
            b--;
          } else {
            if (d.push(g), d.length === c) {
              return d;
            }
          }
        }
      }
    }
  }
  return d;
}
;function E(a, c, b, d) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a, d ? F.call(this, a) : a;
  }
  let e = [];
  for (let g = 0, f, h; g < a.length; g++) {
    if ((f = a[g]) && (h = f.length)) {
      if (b) {
        if (b >= h) {
          b -= h;
          continue;
        }
        b < h && (f = c ? f.slice(b, b + c) : f.slice(b), h = f.length, b = 0);
      }
      h > c && (f = f.slice(0, c), h = c);
      if (!e.length && h >= c) {
        return d ? F.call(this, f) : f;
      }
      e.push(f);
      c -= h;
      if (!c) {
        break;
      }
    }
  }
  e = 1 < e.length ? [].concat.apply([], e) : e[0];
  return d ? F.call(this, e) : e;
}
;function G(a, c, b) {
  var d = b[0];
  if (d.then) {
    return Promise.all(b).then(function(n) {
      return a[c].apply(a, n);
    });
  }
  if (d[0] && d[0].index) {
    return a[c].apply(a, d);
  }
  d = [];
  let e = [], g = 0, f = 0, h, k, l;
  for (let n = 0, m; n < b.length; n++) {
    if (m = b[n]) {
      let r;
      if (m.constructor === I) {
        r = m.result;
      } else if (m.constructor === Array) {
        r = m;
      } else {
        if (g = m.limit || 0, f = m.offset || 0, l = m.suggest, k = m.resolve, h = m.enrich && k, m.index) {
          m.resolve = !1, m.enrich = !1, r = m.index.search(m).result, m.resolve = k, m.enrich = h;
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
        e.push(r);
      } else if (r.length) {
        d[n] = r;
      } else if (!l && ("and" === c || "xor" === c)) {
        d = [];
        break;
      }
    }
  }
  return {m:d, u:e, limit:g, offset:f, enrich:h, resolve:k, suggest:l};
}
;I.prototype.or = function() {
  const {m:a, u:c, limit:b, offset:d, enrich:e, resolve:g} = G(this, "or", arguments);
  return J.call(this, a, c, b, d, e, g);
};
function J(a, c, b, d, e, g) {
  if (c.length) {
    const f = this;
    return Promise.all(c).then(function(h) {
      a = [];
      for (let k = 0, l; k < h.length; k++) {
        (l = h[k]).length && (a[k] = l);
      }
      return J.call(f, a, [], b, d, e, g);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = D(a, b, d), d = 0));
  return g ? this.resolve(b, d, e) : this;
}
;I.prototype.and = function() {
  let a = this.result.length, c, b, d, e;
  if (!a) {
    const g = arguments[0];
    g && (a = !!g.suggest, e = g.resolve, c = g.limit, b = g.offset, d = g.enrich && e);
  }
  if (a) {
    const {m:g, u:f, limit:h, offset:k, enrich:l, resolve:n, suggest:m} = G(this, "and", arguments);
    return K.call(this, g, f, h, k, l, n, m);
  }
  return e ? this.resolve(c, b, d) : this;
};
function K(a, c, b, d, e, g, f) {
  if (c.length) {
    const h = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let l = 0, n; l < k.length; l++) {
        (n = k[l]).length && (a[l] = n);
      }
      return K.call(h, a, [], b, d, e, g, f);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (c = x(a)) {
        return this.result = C(a, c, b, d, f), g ? e ? F.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    f || (this.result = a);
  }
  return g ? this.resolve(b, d, e) : this;
}
;I.prototype.xor = function() {
  const {m:a, u:c, limit:b, offset:d, enrich:e, resolve:g, suggest:f} = G(this, "xor", arguments);
  return L.call(this, a, c, b, d, e, g, f);
};
function L(a, c, b, d, e, g, f) {
  if (c.length) {
    const h = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let l = 0, n; l < k.length; l++) {
        (n = k[l]).length && (a[l] = n);
      }
      return L.call(h, a, [], b, d, e, g, f);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = ea.call(this, a, b, d, g, this.g), g ? e ? F.call(this.index, this.result) : this.result : this;
    }
  } else {
    f || (this.result = a);
  }
  return g ? this.resolve(b, d, e) : this;
}
function ea(a, c, b, d, e) {
  const g = [], f = w();
  let h = 0;
  for (let k = 0, l; k < a.length; k++) {
    if (l = a[k]) {
      h < l.length && (h = l.length);
      for (let n = 0, m; n < l.length; n++) {
        if (m = l[n]) {
          for (let r = 0, q; r < m.length; r++) {
            q = m[r], f[q] = f[q] ? 2 : 1;
          }
        }
      }
    }
  }
  for (let k = 0, l, n = 0; k < h; k++) {
    for (let m = 0, r; m < a.length; m++) {
      if (r = a[m]) {
        if (l = r[k]) {
          for (let q = 0, p; q < l.length; q++) {
            if (p = l[q], 1 === f[p]) {
              if (b) {
                b--;
              } else {
                if (d) {
                  if (g.push(p), g.length === c) {
                    return g;
                  }
                } else {
                  const v = k + (m ? e : 0);
                  g[v] || (g[v] = []);
                  g[v].push(p);
                  if (++n === c) {
                    return g;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return g;
}
;I.prototype.not = function() {
  const {m:a, u:c, limit:b, offset:d, enrich:e, resolve:g, suggest:f} = G(this, "not", arguments);
  return M.call(this, a, c, b, d, e, g, f);
};
function M(a, c, b, d, e, g, f) {
  if (c.length) {
    const h = this;
    return Promise.all(c).then(function(k) {
      a = [];
      for (let l = 0, n; l < k.length; l++) {
        (n = k[l]).length && (a[l] = n);
      }
      return M.call(h, a, [], b, d, e, g, f);
    });
  }
  if (a.length && this.result.length) {
    this.result = fa.call(this, a, b, d, g);
  } else if (g) {
    return this.resolve(b, d, e);
  }
  return g ? e ? F.call(this.index, this.result) : this.result : this;
}
function fa(a, c, b, d) {
  const e = [];
  a = new Set(a.flat().flat());
  for (let g = 0, f, h = 0; g < this.result.length; g++) {
    if (f = this.result[g]) {
      for (let k = 0, l; k < f.length; k++) {
        if (l = f[k], !a.has(l)) {
          if (b) {
            b--;
          } else {
            if (d) {
              if (e.push(l), e.length === c) {
                return e;
              }
            } else {
              if (e[g] || (e[g] = []), e[g].push(l), ++h === c) {
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
;function I(a) {
  if (!this || this.constructor !== I) {
    return new I(a);
  }
  if (a && a.index) {
    return a.resolve = !1, this.index = a.index, this.g = a.boost || 0, this.result = a.index.search(a).result, this;
  }
  this.index = null;
  this.result = a || [];
  this.g = 0;
}
I.prototype.limit = function(a) {
  if (this.result.length) {
    const c = [];
    for (let b = 0, d; b < this.result.length; b++) {
      if (d = this.result[b]) {
        if (d.length <= a) {
          if (c[b] = d, a -= d.length, !a) {
            break;
          }
        } else {
          c[b] = d.slice(0, a);
          break;
        }
      }
    }
    this.result = c;
  }
  return this;
};
I.prototype.offset = function(a) {
  if (this.result.length) {
    const c = [];
    for (let b = 0, d; b < this.result.length; b++) {
      if (d = this.result[b]) {
        d.length <= a ? a -= d.length : (c[b] = d.slice(a), a = 0);
      }
    }
    this.result = c;
  }
  return this;
};
I.prototype.boost = function(a) {
  this.g += a;
  return this;
};
I.prototype.resolve = function(a, c, b) {
  const d = this.result, e = this.index;
  this.result = this.index = null;
  return d.length ? ("object" === typeof a && (b = a.enrich, c = a.offset, a = a.limit), E.call(e, d, a || 100, c, b)) : d;
};
w();
function F(a) {
  if (!this || !this.store) {
    return a;
  }
  const c = Array(a.length);
  for (let b = 0, d; b < a.length; b++) {
    d = a[b], c[b] = {id:d, doc:this.store.get(d)};
  }
  return c;
}
;function N(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.g = "";
}
N.prototype.set = function(a, c) {
  this.cache.set(this.g = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
N.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.g !== a && (this.cache.delete(a), this.cache.set(this.g = a, c));
  return c;
};
N.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
N.prototype.clear = function() {
  this.cache.clear();
  this.g = "";
};
const ha = {normalize:function(a) {
  return a.toLowerCase();
}};
const O = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
P.prototype.add = function(a, c, b, d) {
  if (c && (a || 0 === a)) {
    if (!d && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (d = c.length) {
      const l = w(), n = w(), m = this.depth, r = this.resolution;
      for (let q = 0; q < d; q++) {
        let p = c[this.rtl ? d - 1 - q : q];
        var e = p.length;
        if (e && (m || !n[p])) {
          var g = this.score ? this.score(c, p, q, null, 0) : Q(r, d, q), f = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (g = 0; g < e; g++) {
                  for (var h = e; h > g; h--) {
                    f = p.substring(g, h);
                    var k = this.score ? this.score(c, p, q, f, g) : Q(r, d, q, e, g);
                    R(this, n, f, k, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  f = p[h] + f, k = this.score ? this.score(c, p, q, f, h) : Q(r, d, q, e, h), R(this, n, f, k, a, b);
                }
                f = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  f += p[h], R(this, n, f, g, a, b);
                }
                break;
              }
            default:
              if (R(this, n, p, g, a, b), m && 1 < d && q < d - 1) {
                for (e = w(), f = this.B, g = p, h = Math.min(m + 1, d - q), e[g] = 1, k = 1; k < h; k++) {
                  if ((p = c[this.rtl ? d - 1 - q - k : q + k]) && !e[p]) {
                    e[p] = 1;
                    const v = this.score ? this.score(c, g, q, p, k) : Q(f + (d / 2 > f ? 0 : 1), d, q, h - 1, k - 1), A = this.bidirectional && p > g;
                    R(this, l, A ? g : p, v, a, b, A ? p : g);
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
function R(a, c, b, d, e, g, f) {
  let h = f ? a.ctx : a.map, k;
  if (!c[b] || f && !(k = c[b])[f]) {
    f ? (c = k || (c[b] = w()), c[f] = 1, (k = h.get(f)) ? h = k : h.set(f, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[d] || (h[d] = []), g && h.includes(e) || (h.push(e), a.fastupdate && ((c = a.reg.get(e)) ? c.push(h) : a.reg.set(e, [h])));
  }
}
function Q(a, c, b, d, e) {
  return b && 1 < a ? c + (d || 0) <= a ? b + (e || 0) : (a - 1) / (c + (d || 0)) * (b + (e || 0)) + 1 | 0 : 0;
}
;P.prototype.search = function(a, c, b) {
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
  b = this.encoder.encode(a);
  a = b.length;
  c = c || (h ? 100 : 0);
  if (1 === a) {
    return S.call(this, b[0], "", c, e, h);
  }
  g = this.depth && !1 !== g;
  if (2 === a && g && !f) {
    return S.call(this, b[0], b[1], c, e, h);
  }
  h = w();
  let l = 0;
  if (1 < a && g) {
    var n = b[0];
    l = 1;
  }
  k || 0 === k || (k = n ? this.B : this.resolution);
  for (let p, v; l < a; l++) {
    if ((v = b[l]) && !h[v]) {
      h[v] = 1;
      p = T(this, v, n);
      a: {
        g = p;
        var m = d, r = f, q = k;
        let A = [];
        if (g && g.length) {
          if (g.length <= q) {
            m.push(g);
            p = void 0;
            break a;
          }
          for (let H = 0, Y; H < q; H++) {
            if (Y = g[H]) {
              A[H] = Y;
            }
          }
          if (A.length) {
            m.push(A);
            p = void 0;
            break a;
          }
        }
        p = r ? void 0 : A;
      }
      if (p) {
        d = p;
        break;
      }
      n && (f && p && d.length || (n = v));
    }
    f && n && l === a - 1 && !d.length && (n = "", l = -1, h = w());
  }
  a: {
    n = d.length;
    a = d;
    if (1 < n) {
      a = C(d, k, c, e, f);
    } else if (1 === n) {
      f = E.call(null, d[0], c, e);
      break a;
    }
    f = a;
  }
  return f;
};
function S(a, c, b, d, e) {
  a = T(this, a, c);
  e = !0;
  return a && a.length ? e ? E.call(this, a, b, d) : new I(a) : e ? [] : new I();
}
function T(a, c, b) {
  let d;
  b && (d = a.bidirectional && c > b) && (d = b, b = c, c = d);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;P.prototype.remove = function(a, c) {
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
      U(this.map, a), this.depth && U(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function U(a, c) {
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
    for (let d of a.entries()) {
      const e = d[0], g = U(d[1], c);
      g ? b += g : a.delete(e);
    }
  }
  return b;
}
;function P(a, c) {
  if (!this || this.constructor !== P) {
    return new P(a);
  }
  if (a) {
    var b = "string" === typeof a ? a : a.preset;
    b && (O[b] || console.warn("Preset not found: " + b), a = Object.assign({}, O[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const d = !0 === b ? {depth:1} : b || {}, e = a.encode || a.encoder || ha;
  this.encoder = e.encode ? e : "object" === typeof e ? new z(e) : {encode:e};
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
  this.B = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (b = a.cache || null) && new N(b);
}
t = P.prototype;
t.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  return this;
};
t.append = function(a, c) {
  return this.add(a, c, !0);
};
t.contain = function(a) {
  return this.reg.has(a);
};
t.update = function(a, c) {
  const b = this, d = this.remove(a);
  return d && d.then ? d.then(() => b.add(a, c)) : this.add(a, c);
};
function V(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, d; b < a.length; b++) {
      (d = a[b]) && (c += d.length);
    }
  } else {
    for (const b of a) {
      const d = b[0], e = V(b[1]);
      e ? c += e : a.delete(d);
    }
  }
  return c;
}
t.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  V(this.map);
  this.depth && V(this.ctx);
  return this;
};
t.searchCache = function(a, c, b) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new N());
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
const W = {Index:P, Charset:null, Encoder:z, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, X = self;
let Z;
(Z = X.define) && Z.amd ? Z([], function() {
  return W;
}) : "object" === typeof X.exports ? X.exports = W : X.FlexSearch = W;
}(this||self));
