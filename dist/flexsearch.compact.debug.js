/**!
 * FlexSearch.js v0.7.41 (Compact)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var t;
function v(a) {
  return "undefined" !== typeof a ? a : !0;
}
function w(a) {
  const b = Array(a);
  for (let c = 0; c < a; c++) {
    b[c] = z();
  }
  return b;
}
function z() {
  return Object.create(null);
}
function aa(a, b) {
  return b.length - a.length;
}
function C(a) {
  return "string" === typeof a;
}
function D(a) {
  return "object" === typeof a;
}
;function E(a, b) {
  var c = ba;
  if (a && (b && (a = F(a, b)), this.G && (a = F(a, this.G)), this.H && 1 < a.length && (a = F(a, this.H)), c || "" === c)) {
    b = a.split(c);
    if (this.filter) {
      a = this.filter;
      c = b.length;
      const e = [];
      for (let d = 0, f = 0; d < c; d++) {
        const g = b[d];
        g && !a[g] && (e[f++] = g);
      }
      a = e;
    } else {
      a = b;
    }
    return a;
  }
  return a;
}
const ba = /[\p{Z}\p{S}\p{P}\p{C}]+/u, ca = /[\u0300-\u036f]/g;
function H(a, b) {
  const c = Object.keys(a), e = c.length, d = [];
  let f = "", g = 0;
  for (let h = 0, k, m; h < e; h++) {
    k = c[h], (m = a[k]) ? (d[g++] = I(b ? "(?!\\b)" + k + "(\\b|_)" : k), d[g++] = m) : f += (f ? "|" : "") + k;
  }
  f && (d[g++] = I(b ? "(?!\\b)(" + f + ")(\\b|_)" : "(" + f + ")"), d[g] = "");
  return d;
}
function F(a, b) {
  for (let c = 0, e = b.length; c < e && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
function I(a) {
  return new RegExp(a, "g");
}
function J(a) {
  let b = "", c = "";
  for (let e = 0, d = a.length, f; e < d; e++) {
    (f = a[e]) !== c && (b += c = f);
  }
  return b;
}
;var da = {encode:K, B:!1, C:""};
function K(a) {
  return E.call(this, ("" + a).toLowerCase(), !1);
}
;const L = {}, M = {};
function ea(a) {
  O(a, "add");
  O(a, "append");
  O(a, "search");
  O(a, "update");
  O(a, "remove");
}
function O(a, b) {
  a[b + "Async"] = function() {
    const c = this, e = arguments;
    var d = e[e.length - 1];
    let f;
    "function" === typeof d && (f = d, delete e[e.length - 1]);
    d = new Promise(function(g) {
      setTimeout(function() {
        c.async = !0;
        const h = c[b].apply(c, e);
        c.async = !1;
        g(h);
      });
    });
    return f ? (d.then(f), this) : d;
  };
}
;function fa(a, b, c, e) {
  const d = a.length;
  let f = [], g, h, k = 0;
  e && (e = []);
  for (let m = d - 1; 0 <= m; m--) {
    const n = a[m], u = n.length, q = z();
    let r = !g;
    for (let l = 0; l < u; l++) {
      const p = n[l], A = p.length;
      if (A) {
        for (let B = 0, y, x; B < A; B++) {
          if (x = p[B], g) {
            if (g[x]) {
              if (!m) {
                if (c) {
                  c--;
                } else {
                  if (f[k++] = x, k === b) {
                    return f;
                  }
                }
              }
              if (m || e) {
                q[x] = 1;
              }
              r = !0;
            }
            if (e && (y = (h[x] || 0) + 1, h[x] = y, y < d)) {
              const G = e[y - 2] || (e[y - 2] = []);
              G[G.length] = x;
            }
          } else {
            q[x] = 1;
          }
        }
      }
    }
    if (e) {
      g || (h = q);
    } else if (!r) {
      return [];
    }
    g = q;
  }
  if (e) {
    for (let m = e.length - 1, n, u; 0 <= m; m--) {
      n = e[m];
      u = n.length;
      for (let q = 0, r; q < u; q++) {
        if (r = n[q], !g[r]) {
          if (c) {
            c--;
          } else {
            if (f[k++] = r, k === b) {
              return f;
            }
          }
          g[r] = 1;
        }
      }
    }
  }
  return f;
}
function ha(a, b) {
  const c = z(), e = z(), d = [];
  for (let f = 0; f < a.length; f++) {
    c[a[f]] = 1;
  }
  for (let f = 0, g; f < b.length; f++) {
    g = b[f];
    for (let h = 0, k; h < g.length; h++) {
      k = g[h], c[k] && !e[k] && (e[k] = 1, d[d.length] = k);
    }
  }
  return d;
}
;const ja = {memory:{charset:"latin:extra", A:3, m:4, D:!1}, performance:{A:3, m:3, s:!1, context:{depth:2, A:1}}, match:{charset:"latin:extra", C:"reverse"}, score:{charset:"latin:advanced", A:20, m:3, context:{depth:3, A:9}}, "default":{}};
function P(a, b) {
  if (!(this instanceof P)) {
    return new P(a);
  }
  var c;
  let e;
  if (a) {
    if (C(a)) {
      ja[a] || console.warn("Preset not found: " + a), a = ja[a];
    } else {
      if (c = a.preset) {
        c[c] || console.warn("Preset not found: " + c), a = Object.assign({}, c[c], a);
      }
    }
    c = a.charset;
    e = a.lang;
    C(c) && (-1 === c.indexOf(":") && (c += ":default"), c = M[c]);
    C(e) && (e = L[e]);
  } else {
    a = {};
  }
  let d, f, g = a.context || {};
  this.encode = a.encode || c && c.encode || K;
  this.register = b || z();
  this.A = d = a.resolution || 9;
  this.C = b = c && c.C || a.tokenize || "strict";
  this.depth = "strict" === b && g.depth;
  this.h = v(g.bidirectional);
  this.s = f = v(a.optimize);
  this.D = v(a.fastupdate);
  this.m = a.minlength || 1;
  this.F = a.boost;
  this.map = f ? w(d) : z();
  this.o = d = g.resolution || 1;
  this.l = f ? w(d) : z();
  this.B = c && c.B || a.rtl;
  this.G = (b = a.matcher || e && e.G) && H(b, !1);
  this.H = (b = a.stemmer || e && e.H) && H(b, !0);
  if (a = b = a.filter || e && e.filter) {
    a = b;
    c = z();
    for (let h = 0, k = a.length; h < k; h++) {
      c[a[h]] = 1;
    }
    a = c;
  }
  this.filter = a;
}
t = P.prototype;
t.append = function(a, b) {
  return this.add(a, b, !0);
};
t.add = function(a, b, c, e) {
  if (b && (a || 0 === a)) {
    if (!e && !c && this.register[a]) {
      return this.update(a, b);
    }
    b = this.encode(b);
    if (e = b.length) {
      const m = z(), n = z(), u = this.depth, q = this.A;
      for (let r = 0; r < e; r++) {
        let l = b[this.B ? e - 1 - r : r];
        var d = l.length;
        if (l && d >= this.m && (u || !n[l])) {
          var f = Q(q, e, r), g = "";
          switch(this.C) {
            case "full":
              if (2 < d) {
                for (f = 0; f < d; f++) {
                  for (var h = d; h > f; h--) {
                    if (h - f >= this.m) {
                      var k = Q(q, e, r, d, f);
                      g = l.substring(f, h);
                      S(this, n, g, k, a, c);
                    }
                  }
                }
                break;
              }
            case "reverse":
              if (1 < d) {
                for (h = d - 1; 0 < h; h--) {
                  g = l[h] + g, g.length >= this.m && S(this, n, g, Q(q, e, r, d, h), a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (h = 0; h < d; h++) {
                  g += l[h], g.length >= this.m && S(this, n, g, f, a, c);
                }
                break;
              }
            default:
              if (this.F && (f = Math.min(f / this.F(b, l, r) | 0, q - 1)), S(this, n, l, f, a, c), u && 1 < e && r < e - 1) {
                for (d = z(), g = this.o, f = l, h = Math.min(u + 1, e - r), d[f] = 1, k = 1; k < h; k++) {
                  if ((l = b[this.B ? e - 1 - r - k : r + k]) && l.length >= this.m && !d[l]) {
                    d[l] = 1;
                    const p = this.h && l > f;
                    S(this, m, p ? f : l, Q(g + (e / 2 > g ? 0 : 1), e, r, h - 1, k - 1), a, c, p ? l : f);
                  }
                }
              }
          }
        }
      }
      this.D || (this.register[a] = 1);
    }
  }
  return this;
};
function Q(a, b, c, e, d) {
  return c && 1 < a ? b + (e || 0) <= a ? c + (d || 0) : (a - 1) / (b + (e || 0)) * (c + (d || 0)) + 1 | 0 : 0;
}
function S(a, b, c, e, d, f, g) {
  let h = g ? a.l : a.map;
  if (!b[c] || g && !b[c][g]) {
    a.s && (h = h[e]), g ? (b = b[c] || (b[c] = z()), b[g] = 1, h = h[g] || (h[g] = z())) : b[c] = 1, h = h[c] || (h[c] = []), a.s || (h = h[e] || (h[e] = [])), f && h.includes(d) || (h[h.length] = d, a.D && (a = a.register[d] || (a.register[d] = []), a[a.length] = h));
  }
}
t.search = function(a, b, c) {
  c || (!b && D(a) ? (c = a, a = c.query) : D(b) && (c = b));
  let e = [], d;
  let f, g = 0;
  if (c) {
    a = c.query || a;
    b = c.limit;
    g = c.offset || 0;
    var h = c.context;
    f = c.suggest;
  }
  if (a && (a = this.encode("" + a), d = a.length, 1 < d)) {
    c = z();
    var k = [];
    for (let n = 0, u = 0, q; n < d; n++) {
      if ((q = a[n]) && q.length >= this.m && !c[q]) {
        if (this.s || f || this.map[q]) {
          k[u++] = q, c[q] = 1;
        } else {
          return e;
        }
      }
    }
    a = k;
    d = a.length;
  }
  if (!d) {
    return e;
  }
  b || (b = 100);
  h = this.depth && 1 < d && !1 !== h;
  c = 0;
  let m;
  h ? (m = a[0], c = 1) : 1 < d && a.sort(aa);
  for (let n, u; c < d; c++) {
    u = a[c];
    h ? (n = ka(this, e, f, b, g, 2 === d, u, m), f && !1 === n && e.length || (m = u)) : n = ka(this, e, f, b, g, 1 === d, u);
    if (n) {
      return n;
    }
    if (f && c === d - 1) {
      k = e.length;
      if (!k) {
        if (h) {
          h = 0;
          c = -1;
          continue;
        }
        return e;
      }
      if (1 === k) {
        return la(e[0], b, g);
      }
    }
  }
  return fa(e, b, g, f);
};
function ka(a, b, c, e, d, f, g, h) {
  let k = [], m = h ? a.l : a.map;
  a.s || (m = ma(m, g, h, a.h));
  if (m) {
    let n = 0;
    const u = Math.min(m.length, h ? a.o : a.A);
    for (let q = 0, r = 0, l, p; q < u; q++) {
      if (l = m[q]) {
        if (a.s && (l = ma(l, g, h, a.h)), d && l && f && (p = l.length, p <= d ? (d -= p, l = null) : (l = l.slice(d), d = 0)), l && (k[n++] = l, f && (r += l.length, r >= e))) {
          break;
        }
      }
    }
    if (n) {
      if (f) {
        return la(k, e, 0);
      }
      b[b.length] = k;
      return;
    }
  }
  return !c && k;
}
function la(a, b, c) {
  a = 1 === a.length ? a[0] : [].concat.apply([], a);
  return c || a.length > b ? a.slice(c, c + b) : a;
}
function ma(a, b, c, e) {
  c ? (e = e && b > c, a = (a = a[e ? b : c]) && a[e ? c : b]) : a = a[b];
  return a;
}
t.contain = function(a) {
  return !!this.register[a];
};
t.update = function(a, b) {
  return this.remove(a).add(a, b);
};
t.remove = function(a, b) {
  const c = this.register[a];
  if (c) {
    if (this.D) {
      for (let e = 0, d; e < c.length; e++) {
        d = c[e], d.splice(d.indexOf(a), 1);
      }
    } else {
      T(this.map, a, this.A, this.s), this.depth && T(this.l, a, this.o, this.s);
    }
    b || delete this.register[a];
  }
  return this;
};
function T(a, b, c, e, d) {
  let f = 0;
  if (a.constructor === Array) {
    if (d) {
      b = a.indexOf(b), -1 !== b ? 1 < a.length && (a.splice(b, 1), f++) : f++;
    } else {
      d = Math.min(a.length, c);
      for (let g = 0, h; g < d; g++) {
        if (h = a[g]) {
          f = T(h, b, c, e, d), e || f || delete a[g];
        }
      }
    }
  } else {
    for (let g in a) {
      (f = T(a[g], b, c, e, d)) || delete a[g];
    }
  }
  return f;
}
ea(P.prototype);
function U(a) {
  if (!(this instanceof U)) {
    return new U(a);
  }
  var b = a.document || a.doc || a, c;
  this.F = [];
  this.h = [];
  this.o = [];
  this.register = z();
  this.key = (c = b.key || b.id) && V(c, this.o) || "id";
  this.D = v(a.fastupdate);
  this.l = (c = b.store) && !0 !== c && [];
  this.store = c && z();
  this.async = !1;
  c = z();
  let e = b.index || b.field || b;
  C(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d], C(f) || (g = f, f = f.field), g = D(g) ? Object.assign({}, a, g) : a, this.I || (c[f] = new P(g, this.register)), this.F[d] = V(f, this.o), this.h[d] = f;
  }
  if (this.l) {
    for (a = b.store, C(a) && (a = [a]), b = 0; b < a.length; b++) {
      this.l[b] = V(a[b], this.o);
    }
  }
  this.index = c;
}
function V(a, b) {
  const c = a.split(":");
  let e = 0;
  for (let d = 0; d < c.length; d++) {
    a = c[d], 0 <= a.indexOf("[]") && (a = a.substring(0, a.length - 2)) && (b[e] = !0), a && (c[e++] = a);
  }
  e < c.length && (c.length = e);
  return 1 < e ? c : c[0];
}
function na(a, b) {
  if (C(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function W(a, b, c, e, d) {
  a = a[d];
  if (e === c.length - 1) {
    b[d] = a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[d] = Array(a.length), d = 0; d < a.length; d++) {
        W(a, b, c, e, d);
      }
    } else {
      b = b[d] || (b[d] = z()), d = c[++e], W(a, b, c, e, d);
    }
  }
}
function X(a, b, c, e, d, f, g, h) {
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
      d.add(f, a, h, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          X(a, b, c, e, d, f, g, h);
        }
      } else {
        g = b[++e], X(a, b, c, e, d, f, g, h);
      }
    }
  }
}
t = U.prototype;
t.add = function(a, b, c) {
  D(a) && (b = a, a = na(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.register[a]) {
      return this.update(a, b);
    }
    for (let e = 0, d, f; e < this.h.length; e++) {
      f = this.h[e], d = this.F[e], C(d) && (d = [d]), X(b, d, this.o, 0, this.index[f], a, d[0], c);
    }
    if (this.store && (!c || !this.store[a])) {
      let e;
      if (this.l) {
        e = z();
        for (let d = 0, f; d < this.l.length; d++) {
          f = this.l[d], C(f) ? e[f] = b[f] : W(b, e, f, 0, f[0]);
        }
      }
      this.store[a] = e || b;
    }
  }
  return this;
};
t.append = function(a, b) {
  return this.add(a, b, !0);
};
t.update = function(a, b) {
  return this.remove(a).add(a, b);
};
t.remove = function(a) {
  D(a) && (a = na(a, this.key));
  if (this.register[a]) {
    for (let b = 0; b < this.h.length && (this.index[this.h[b]].remove(a, !this.I), !this.D); b++) {
    }
    this.store && delete this.store[a];
    delete this.register[a];
  }
  return this;
};
t.search = function(a, b, c, e) {
  c || (!b && D(a) ? (c = a, a = "") : D(b) && (c = b, b = 0));
  let d = [], f = [], g, h, k, m, n, u, q = 0;
  if (c) {
    if (c.constructor === Array) {
      k = c, c = null;
    } else {
      a = c.query || a;
      k = (g = c.pluck) || c.index || c.field;
      m = !1;
      h = this.store && c.enrich;
      n = "and" === c.bool;
      b = c.limit || b || 100;
      u = c.offset || 0;
      if (m && (C(m) && (m = [m]), !a)) {
        for (let l = 0, p; l < m.length; l++) {
          if (p = oa.call(this, m[l], b, u, h)) {
            d[d.length] = p, q++;
          }
        }
        return q ? d : [];
      }
      C(k) && (k = [k]);
    }
  }
  k || (k = this.h);
  n = n && (1 < k.length || m && 1 < m.length);
  const r = !e && (this.I || this.async) && [];
  for (let l = 0, p, A, B; l < k.length; l++) {
    let y;
    A = k[l];
    C(A) || (y = A, A = y.field, a = y.query || a, b = y.limit || b, h = y.enrich || h);
    if (r) {
      r[l] = this.index[A].searchAsync(a, b, y || c);
    } else {
      e ? p = e[l] : p = this.index[A].search(a, b, y || c);
      B = p && p.length;
      if (m && B) {
        const x = [];
        let G = 0;
        n && (x[0] = [p]);
        for (let R = 0, ia, N; R < m.length; R++) {
          if (ia = m[R], B = (N = this.J[ia]) && N.length) {
            G++, x[x.length] = n ? [N] : N;
          }
        }
        G && (p = n ? fa(x, b || 100, u || 0) : ha(p, x), B = p.length);
      }
      if (B) {
        f[q] = A, d[q++] = p;
      } else if (n) {
        return [];
      }
    }
  }
  if (r) {
    const l = this;
    return new Promise(function(p) {
      Promise.all(r).then(function(A) {
        p(l.search(a, b, c, A));
      });
    });
  }
  if (!q) {
    return [];
  }
  if (g && (!h || !this.store)) {
    return d[0];
  }
  for (let l = 0, p; l < f.length; l++) {
    p = d[l];
    p.length && h && (p = pa.call(this, p));
    if (g) {
      return p;
    }
    d[l] = {field:f[l], result:p};
  }
  return d;
};
function oa(a, b, c, e) {
  let d = this.J[a], f = d && d.length - c;
  if (f && 0 < f) {
    if (f > b || c) {
      d = d.slice(c, c + b);
    }
    e && (d = pa.call(this, d));
    return {tag:a, result:d};
  }
}
function pa(a) {
  const b = Array(a.length);
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b[c] = {id:e, doc:this.store[e]};
  }
  return b;
}
t.contain = function(a) {
  return !!this.register[a];
};
t.get = function(a) {
  return this.store[a];
};
t.set = function(a, b) {
  this.store[a] = b;
  return this;
};
ea(U.prototype);
var ra = {encode:qa, B:!1, C:""};
const sa = [I("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), "a", I("[\u00e8\u00e9\u00ea\u00eb]"), "e", I("[\u00ec\u00ed\u00ee\u00ef]"), "i", I("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), "o", I("[\u00f9\u00fa\u00fb\u00fc\u0171]"), "u", I("[\u00fd\u0177\u00ff]"), "y", I("\u00f1"), "n", I("[\u00e7c]"), "k", I("\u00df"), "s", I(" & "), " and "];
function qa(a) {
  var b = a = "" + a;
  b.normalize && (b = b.normalize("NFD").replace(ca, ""));
  return E.call(this, b.toLowerCase(), !a.normalize && sa);
}
;var ua = {encode:ta, B:!1, C:"strict"};
const va = /[^a-z0-9]+/, wa = {b:"p", v:"f", w:"f", z:"s", x:"s", "\u00df":"s", d:"t", n:"m", c:"k", g:"k", j:"k", q:"k", i:"e", y:"e", u:"o"};
function ta(a) {
  a = qa.call(this, a).join(" ");
  const b = [];
  if (a) {
    const c = a.split(va), e = c.length;
    for (let d = 0, f, g = 0; d < e; d++) {
      if ((a = c[d]) && (!this.filter || !this.filter[a])) {
        f = a[0];
        let h = wa[f] || f, k = h;
        for (let m = 1; m < a.length; m++) {
          f = a[m];
          const n = wa[f] || f;
          n && n !== k && (h += n, k = n);
        }
        b[g++] = h;
      }
    }
  }
  return b;
}
;var ya = {encode:xa, B:!1, C:""};
const za = [I("ae"), "a", I("oe"), "o", I("sh"), "s", I("th"), "t", I("ph"), "f", I("pf"), "f", I("(?![aeo])h(?![aeo])"), "", I("(?!^[aeo])h(?!^[aeo])"), ""];
function xa(a, b) {
  a && (a = ta.call(this, a).join(" "), 2 < a.length && (a = F(a, za)), b || (1 < a.length && (a = J(a)), a && (a = a.split(" "))));
  return a || [];
}
;var Ba = {encode:Aa, B:!1, C:""};
const Ca = I("(?!\\b)[aeo]");
function Aa(a) {
  a && (a = xa.call(this, a, !0), 1 < a.length && (a = a.replace(Ca, "")), 1 < a.length && (a = J(a)), a && (a = a.split(" ")));
  return a || [];
}
;M["latin:default"] = da;
M["latin:simple"] = ra;
M["latin:balance"] = ua;
M["latin:advanced"] = ya;
M["latin:extra"] = Ba;
const Y = {Index:P, Document:U, Worker:null, registerCharset:function(a, b) {
  M[a] = b;
}, registerLanguage:function(a, b) {
  L[a] = b;
}};
let Z;
(Z = self.define) && Z.amd ? Z([], function() {
  return Y;
}) : self.exports ? self.exports = Y : self.FlexSearch = Y;
}(this));
