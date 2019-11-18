/*
 FlexSearch v0.6.30
 Copyright 2019 Nextapps GmbH
 Author: Thomas Wilkerling
 Released under the Apache 2.0 Licence
 https://github.com/nextapps-de/flexsearch
*/
'use strict';
(function(w, N, Q) {
  let K;
  (K = Q.define) && K.amd ? K([], function() {
    return N;
  }) : (K = Q.modules) ? K[w.toLowerCase()] = N : "object" === typeof exports ? module.exports = N : Q[w] = N;
})("FlexSearch", function() {
  function w(a, b) {
    const c = b ? b.id : a && a.id;
    this.id = c || 0 === c ? c : ka++;
    this.init(a, b);
    da(this, "index", function() {
      return this.a ? Object.keys(this.a.index[this.a.keys[0]].f) : Object.keys(this.f);
    });
    da(this, "length", function() {
      return this.index.length;
    });
  }
  function N(a) {
    const b = B();
    for (const c in a) {
      if (a.hasOwnProperty(c)) {
        const d = a[c];
        E(d) ? b[c] = d.slice(0) : F(d) ? b[c] = N(d) : b[c] = d;
      }
    }
    return b;
  }
  function Q(a, b) {
    const c = a.length, d = O(b), e = [];
    for (let g = 0, f = 0; g < c; g++) {
      const h = a[g];
      if (d && b(h) || !d && !b[h]) {
        e[f++] = h;
      }
    }
    return e;
  }
  function K(a, b, c, d, e, g, f, h, k, l) {
    c = ea(c, f ? 0 : e, h, g, b, k, l);
    let p;
    h && (h = c.page, p = c.next, c = c.result);
    if (f) {
      b = this.where(f, null, e, c);
    } else {
      b = c;
      c = this.i;
      e = b.length;
      g = Array(e);
      for (f = 0; f < e; f++) {
        g[f] = c[b[f]];
      }
      b = g;
    }
    c = b;
    d && (O(d) || (L = d.split(":"), 1 < L.length ? d = la : (L = L[0], d = ma)), c.sort(d));
    c = R(h, p, c);
    this.cache && this.j.set(a, c);
    return c;
  }
  function da(a, b, c) {
    Object.defineProperty(a, b, {get:c});
  }
  function r(a) {
    return new RegExp(a, "g");
  }
  function P(a, b) {
    for (let c = 0; c < b.length; c += 2) {
      a = a.replace(b[c], b[c + 1]);
    }
    return a;
  }
  function T(a, b, c, d, e, g, f, h) {
    if (b[c]) {
      return b[c];
    }
    e = e ? (h - (f || h / 1.5)) * g + (f || h / 1.5) * e : g;
    b[c] = e;
    e >= f && (a = a[h - (e + 0.5 >> 0)], a = a[c] || (a[c] = []), a[a.length] = d);
    return e;
  }
  function Y(a, b) {
    if (a) {
      const c = Object.keys(a);
      for (let d = 0, e = c.length; d < e; d++) {
        const g = c[d], f = a[g];
        if (f) {
          for (let h = 0, k = f.length; h < k; h++) {
            if (f[h] === b) {
              1 === k ? delete a[g] : f.splice(h, 1);
              break;
            } else {
              F(f[h]) && Y(f[h], b);
            }
          }
        }
      }
    }
  }
  function Z(a) {
    let b = "", c = "";
    var d = "";
    for (let e = 0; e < a.length; e++) {
      const g = a[e];
      if (g !== c) {
        if (e && "h" === g) {
          if (d = "a" === d || "e" === d || "i" === d || "o" === d || "u" === d || "y" === d, ("a" === c || "e" === c || "i" === c || "o" === c || "u" === c || "y" === c) && d || " " === c) {
            b += g;
          }
        } else {
          b += g;
        }
      }
      d = e === a.length - 1 ? "" : a[e + 1];
      c = g;
    }
    return b;
  }
  function na(a, b) {
    a = a.length - b.length;
    return 0 > a ? 1 : a ? -1 : 0;
  }
  function ma(a, b) {
    a = a[L];
    b = b[L];
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function la(a, b) {
    const c = L.length;
    for (let d = 0; d < c; d++) {
      a = a[L[d]], b = b[L[d]];
    }
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function R(a, b, c) {
    return a ? {page:a, next:b ? "" + b : null, result:c} : c;
  }
  function ea(a, b, c, d, e, g, f) {
    let h, k = [];
    if (!0 === c) {
      c = "0";
      var l = "";
    } else {
      l = c && c.split(":");
    }
    const p = a.length;
    if (1 < p) {
      const x = B(), t = [];
      let v, z;
      var n = 0, m;
      let H;
      var q = !0;
      let D, G = 0, M, aa, U, ba;
      l && (2 === l.length ? (U = l, l = !1) : l = ba = parseInt(l[0], 10));
      if (f) {
        for (v = B(); n < p; n++) {
          if ("not" === e[n]) {
            for (z = a[n], H = z.length, m = 0; m < H; m++) {
              v["@" + z[m]] = 1;
            }
          } else {
            aa = n + 1;
          }
        }
        if (C(aa)) {
          return R(c, h, k);
        }
        n = 0;
      } else {
        M = I(e) && e;
      }
      let V, ca;
      for (; n < p; n++) {
        const oa = n === (aa || p) - 1;
        if (!M || !n) {
          if ((m = M || e && e[n]) && "and" !== m) {
            if ("or" === m) {
              ca = !0, V = !1;
            } else {
              continue;
            }
          } else {
            V = g = !0, ca = !1;
          }
        }
        z = a[n];
        if (H = z.length) {
          if (q) {
            if (D) {
              var u = D.length;
              for (m = 0; m < u; m++) {
                q = D[m];
                var A = "@" + q;
                f && v[A] || (x[A] = 1, g || (k[G++] = q));
              }
              D = null;
              q = !1;
            } else {
              D = z;
              continue;
            }
          }
          A = !1;
          for (m = 0; m < H; m++) {
            u = z[m];
            var y = "@" + u;
            const W = g ? x[y] || 0 : n;
            if (!(!W && !d || f && v[y] || !g && x[y])) {
              if (W === n) {
                if (oa || ca) {
                  if (!ba || --ba < G) {
                    if (k[G++] = u, b && G === b) {
                      return R(c, G + (l || 0), k);
                    }
                  }
                } else {
                  x[y] = n + 1;
                }
                A = !0;
              } else {
                d && (y = t[W] || (t[W] = []), y[y.length] = u);
              }
            }
          }
          if (V && !A && !d) {
            break;
          }
        } else {
          if (V && !d) {
            return R(c, h, z);
          }
        }
      }
      if (D) {
        if (n = D.length, f) {
          for (m = l ? parseInt(l, 10) : 0; m < n; m++) {
            a = D[m], v["@" + a] || (k[G++] = a);
          }
        } else {
          k = D;
        }
      }
      if (d) {
        for (G = k.length, U ? (n = parseInt(U[0], 10) + 1, m = parseInt(U[1], 10) + 1) : (n = t.length, m = 0); n--;) {
          if (u = t[n]) {
            for (H = u.length; m < H; m++) {
              if (d = u[m], !f || !v["@" + d]) {
                if (k[G++] = d, b && G === b) {
                  return R(c, n + ":" + m, k);
                }
              }
            }
            m = 0;
          }
        }
      }
    } else {
      !p || e && "not" === e[0] || (k = a[0], l && (l = parseInt(l[0], 10)));
    }
    b && (f = k.length, l && l > f && (l = 0), l = l || 0, h = l + b, h < f ? k = k.slice(l, h) : (h = 0, l && (k = k.slice(l))));
    return R(c, h, k);
  }
  function I(a) {
    return "string" === typeof a;
  }
  function E(a) {
    return a.constructor === Array;
  }
  function O(a) {
    return "function" === typeof a;
  }
  function F(a) {
    return "object" === typeof a;
  }
  function C(a) {
    return "undefined" === typeof a;
  }
  function fa(a) {
    const b = Array(a);
    for (let c = 0; c < a; c++) {
      b[c] = B();
    }
    return b;
  }
  function B() {
    return Object.create(null);
  }
  const J = {encode:"icase", c:"forward", split:/\W+/, cache:!1, async:!1, D:!1, v:!1, a:!1, b:9, threshold:0, depth:0}, ha = {memory:{encode:"extra", c:"strict", threshold:0, b:1}, speed:{encode:"icase", c:"strict", threshold:1, b:3, depth:2}, match:{encode:"extra", c:"full", threshold:1, b:3}, score:{encode:"extra", c:"strict", threshold:1, b:9, depth:4}, balance:{encode:"balance", c:"strict", threshold:0, b:3, depth:3}, fast:{encode:"icase", c:"strict", threshold:8, b:9, depth:1}}, X = [];
  let ka = 0;
  const ia = {}, ja = {};
  w.create = function(a, b) {
    return new w(a, b);
  };
  w.registerMatcher = function(a) {
    for (const b in a) {
      a.hasOwnProperty(b) && X.push(r(b), a[b]);
    }
    return this;
  };
  w.registerEncoder = function(a, b) {
    S[a] = b.bind(S);
    return this;
  };
  w.registerLanguage = function(a, b) {
    ia[a] = b.filter;
    ja[a] = b.stemmer;
    return this;
  };
  w.encode = function(a, b) {
    return S[a](b);
  };
  w.prototype.init = function(a, b) {
    this.m = [];
    if (b) {
      var c = b.preset;
      a = b;
    } else {
      a || (a = J), c = a.preset;
    }
    b = {};
    I(a) ? (b = ha[a], a = {}) : c && (b = ha[c]);
    this.c = a.tokenize || b.c || this.c || J.c;
    this.split = C(c = a.split) ? this.split || J.split : I(c) ? r(c) : c;
    this.v = a.rtl || this.v || J.v;
    this.async = "undefined" === typeof Promise || C(c = a.async) ? this.async || J.async : c;
    this.threshold = C(c = a.threshold) ? b.threshold || this.threshold || J.threshold : c;
    this.b = C(c = a.resolution) ? c = b.b || this.b || J.b : c;
    c <= this.threshold && (this.b = this.threshold + 1);
    this.depth = "strict" !== this.c || C(c = a.depth) ? b.depth || this.depth || J.depth : c;
    this.o = (c = C(c = a.encode) ? b.encode || J.encode : c) && S[c] && S[c].bind(S) || (O(c) ? c : this.o || !1);
    (c = a.matcher) && this.addMatcher(c);
    if (c = (b = a.lang) || a.filter) {
      I(c) && (c = ia[c]);
      if (E(c)) {
        var d = this.o, e = B();
        for (var g = 0; g < c.length; g++) {
          var f = d ? d(c[g]) : c[g];
          e[f] = 1;
        }
        c = e;
      }
      this.filter = c;
    }
    if (c = b || a.stemmer) {
      var h;
      b = I(c) ? ja[c] : c;
      d = this.o;
      e = [];
      for (h in b) {
        b.hasOwnProperty(h) && (g = d ? d(h) : h, e.push(r(g + "($|\\W)"), d ? d(b[h]) : b[h]));
      }
      this.stemmer = h = e;
    }
    this.a = e = (c = a.doc) ? N(c) : this.a || J.a;
    this.h = fa(this.b - (this.threshold || 0));
    this.g = B();
    this.f = B();
    if (e) {
      this.i = B();
      a.doc = null;
      h = e.index = {};
      b = e.keys = [];
      d = e.field;
      g = e.tag;
      f = e.store;
      E(e.id) || (e.id = e.id.split(":"));
      if (f) {
        var k = B();
        if (I(f)) {
          k[f] = 1;
        } else {
          if (E(f)) {
            for (let l = 0; l < f.length; l++) {
              k[f[l]] = 1;
            }
          } else {
            F(f) && (k = f);
          }
        }
        e.store = k;
      }
      if (g) {
        this.w = B();
        f = B();
        if (d) {
          if (I(d)) {
            f[d] = a;
          } else {
            if (E(d)) {
              for (k = 0; k < d.length; k++) {
                f[d[k]] = a;
              }
            } else {
              F(d) && (f = d);
            }
          }
        }
        E(g) || (e.tag = g = [g]);
        for (d = 0; d < g.length; d++) {
          this.w[g[d]] = B();
        }
        this.C = g;
        d = f;
      }
      if (d) {
        let l;
        E(d) || (F(d) ? (l = d, e.field = d = Object.keys(d)) : e.field = d = [d]);
        for (e = 0; e < d.length; e++) {
          g = d[e], E(g) || (l && (a = l[g]), b[e] = g, d[e] = g.split(":")), h[g] = new w(a);
        }
      }
      a.doc = c;
    }
    this.u = !0;
    this.j = (this.cache = c = C(c = a.cache) ? this.cache || J.cache : c) ? new pa(c) : !1;
    return this;
  };
  w.prototype.encode = function(a) {
    a && (X.length && (a = P(a, X)), this.m.length && (a = P(a, this.m)), this.o && (a = this.o(a)), this.stemmer && (a = P(a, this.stemmer)));
    return a;
  };
  w.prototype.addMatcher = function(a) {
    const b = this.m;
    for (const c in a) {
      a.hasOwnProperty(c) && b.push(r(c), a[c]);
    }
    return this;
  };
  w.prototype.add = function(a, b, c, d, e) {
    if (this.a && F(a)) {
      return this.s("add", a, b);
    }
    if (b && I(b) && (a || 0 === a)) {
      var g = "@" + a;
      if (this.f[g] && !d) {
        return this.update(a, b);
      }
      if (!e) {
        if (this.async) {
          let t = this;
          g = new Promise(function(v) {
            setTimeout(function() {
              t.add(a, b, null, d, !0);
              t = null;
              v();
            });
          });
          if (c) {
            g.then(c);
          } else {
            return g;
          }
          return this;
        }
        if (c) {
          return this.add(a, b, null, d, !0), c(), this;
        }
      }
      b = this.encode(b);
      if (!b.length) {
        return this;
      }
      c = this.c;
      e = O(c) ? c(b) : b.split(this.split);
      this.filter && (e = Q(e, this.filter));
      const n = B();
      n._ctx = B();
      const m = e.length, q = this.threshold, u = this.depth, A = this.b, y = this.h, x = this.v;
      for (let t = 0; t < m; t++) {
        var f = e[t];
        if (f) {
          var h = f.length, k = (x ? t + 1 : m - t) / m, l = "";
          switch(c) {
            case "reverse":
            case "both":
              for (var p = h; --p;) {
                l = f[p] + l, T(y, n, l, a, x ? 1 : (h - p) / h, k, q, A - 1);
              }
              l = "";
            case "forward":
              for (p = 0; p < h; p++) {
                l += f[p], T(y, n, l, a, x ? (p + 1) / h : 1, k, q, A - 1);
              }
              break;
            case "full":
              for (p = 0; p < h; p++) {
                const v = (x ? p + 1 : h - p) / h;
                for (let z = h; z > p; z--) {
                  l = f.substring(p, z), T(y, n, l, a, v, k, q, A - 1);
                }
              }
              break;
            default:
              if (h = T(y, n, f, a, 1, k, q, A - 1), u && 1 < m && h >= q) {
                for (h = n._ctx[f] || (n._ctx[f] = B()), f = this.g[f] || (this.g[f] = fa(A - (q || 0))), k = t - u, l = t + u + 1, 0 > k && (k = 0), l > m && (l = m); k < l; k++) {
                  k !== t && T(f, h, e[k], a, 0, A - (k < t ? t - k : k - t), q, A - 1);
                }
              }
          }
        }
      }
      this.f[g] = 1;
      this.u = !1;
    }
    return this;
  };
  w.prototype.s = function(a, b, c) {
    if (E(b)) {
      var d = b.length;
      if (d--) {
        for (var e = 0; e < d; e++) {
          this.s(a, b[e]);
        }
        return this.s(a, b[d], c);
      }
    } else {
      var g = this.a.index, f = this.a.keys, h = this.a.tag;
      e = this.a.store;
      var k;
      var l = this.a.id;
      d = b;
      for (var p = 0; p < l.length; p++) {
        d = d[l[p]];
      }
      if ("remove" === a && (delete this.i[d], l = f.length, l--)) {
        for (b = 0; b < l; b++) {
          g[f[b]].remove(d);
        }
        return g[f[l]].remove(d, c);
      }
      if (h) {
        for (k = 0; k < h.length; k++) {
          var n = h[k];
          var m = b;
          l = n.split(":");
          for (p = 0; p < l.length; p++) {
            m = m[l[p]];
          }
          m = "@" + m;
        }
        k = this.w[n];
        k = k[m] || (k[m] = []);
      }
      l = this.a.field;
      for (let q = 0, u = l.length; q < u; q++) {
        n = l[q];
        h = b;
        for (m = 0; m < n.length; m++) {
          h = h[n[m]];
        }
        n = g[f[q]];
        m = "add" === a ? n.add : n.update;
        q === u - 1 ? m.call(n, d, h, c) : m.call(n, d, h);
      }
      if (e) {
        c = Object.keys(e);
        a = B();
        for (g = 0; g < c.length; g++) {
          if (f = c[g], e[f]) {
            f = f.split(":");
            let q, u;
            for (l = 0; l < f.length; l++) {
              h = f[l], q = (q || b)[h], u = (u || a)[h] = q;
            }
          }
        }
        b = a;
      }
      k && (k[k.length] = b);
      this.i[d] = b;
    }
    return this;
  };
  w.prototype.update = function(a, b, c) {
    if (this.a && F(a)) {
      return this.s("update", a, b);
    }
    this.f["@" + a] && I(b) && (this.remove(a), this.add(a, b, c, !0));
    return this;
  };
  w.prototype.remove = function(a, b, c) {
    if (this.a && F(a)) {
      return this.s("remove", a, b);
    }
    var d = "@" + a;
    if (this.f[d]) {
      if (!c) {
        if (this.async && "function" !== typeof importScripts) {
          let e = this;
          d = new Promise(function(g) {
            setTimeout(function() {
              e.remove(a, null, !0);
              e = null;
              g();
            });
          });
          if (b) {
            d.then(b);
          } else {
            return d;
          }
          return this;
        }
        if (b) {
          return this.remove(a, null, !0), b(), this;
        }
      }
      for (b = 0; b < this.b - (this.threshold || 0); b++) {
        Y(this.h[b], a);
      }
      this.depth && Y(this.g, a);
      delete this.f[d];
      this.u = !1;
    }
    return this;
  };
  let L;
  w.prototype.search = function(a, b, c, d) {
    if (F(b)) {
      if (E(b)) {
        for (var e = 0; e < b.length; e++) {
          b[e].query = a;
        }
      } else {
        b.query = a;
      }
      a = b;
      b = 1000;
    } else {
      b && O(b) ? (c = b, b = 1000) : b || 0 === b || (b = 1000);
    }
    let g = [], f = a;
    let h, k, l;
    if (F(a) && !E(a)) {
      c || (c = a.callback) && (f.callback = null);
      k = a.sort;
      h = a.page;
      b = a.limit;
      var p = a.threshold;
      l = a.suggest;
      a = a.query;
    }
    if (this.a) {
      p = this.a.index;
      const x = f.where;
      var n;
      const t = [];
      E(f) ? n = f : n = [f];
      var m = 0;
      for (var q = 0; q < n.length; q++) {
        for (var u = 0; u < n[q].B.length; u++) {
          t[m] = n[q].F || "or", h && !I(f) && (f.page = null, f.limit = 0), g[m++] = p[n[q].B[u]].search(n[q], 0);
        }
      }
      if (c) {
        return c(K.call(this, a, t, g, k, b, l, x, h, void 0, void 0));
      }
      if (this.async) {
        const v = this;
        return new Promise(function(z) {
          Promise.all(g).then(function(H) {
            z(K.call(v, a, t, H, k, b, l, x, h, void 0, void 0));
          });
        });
      }
      return K.call(this, a, t, g, k, b, l, x, h, void 0, void 0);
    }
    p || (p = this.threshold || 0);
    if (!d) {
      if (this.async && "function" !== typeof importScripts) {
        let x = this;
        p = new Promise(function(t) {
          setTimeout(function() {
            t(x.search(f, b, null, !0));
            x = null;
          });
        });
        if (c) {
          p.then(c);
        } else {
          return p;
        }
        return this;
      }
      if (c) {
        return c(this.search(f, b, null, !0)), this;
      }
    }
    if (!a || !I(a)) {
      return g;
    }
    f = a;
    if (this.cache) {
      if (this.u) {
        if (c = this.j.get(a)) {
          return c;
        }
      } else {
        this.j.clear(), this.u = !0;
      }
    }
    f = this.encode(f);
    if (!f.length) {
      return g;
    }
    c = this.c;
    c = O(c) ? c(f) : f.split(this.split);
    this.filter && (c = Q(c, this.filter));
    n = c.length;
    d = !0;
    e = [];
    const A = B();
    let y = 0;
    1 < n && (this.depth && "strict" === this.c ? q = !0 : c.sort(na));
    if (!q || (u = this.g)) {
      const x = this.b;
      for (; y < n; y++) {
        let t = c[y];
        if (t) {
          if (q) {
            if (!m) {
              if (u[t]) {
                m = t, A[t] = 1;
              } else {
                if (!l) {
                  return g;
                }
              }
            }
            if (l && y === n - 1 && !e.length) {
              q = !1, t = m || t, A[t] = 0;
            } else {
              if (!m) {
                continue;
              }
            }
          }
          if (!A[t]) {
            const v = [];
            let z = !1, H = 0;
            const D = q ? u[m] : this.h;
            if (D) {
              let G;
              for (let M = 0; M < x - p; M++) {
                if (G = D[M] && D[M][t]) {
                  v[H++] = G, z = !0;
                }
              }
            }
            if (z) {
              m = t, e[e.length] = 1 < H ? v.concat.apply([], v) : v[0];
            } else {
              if (!l) {
                d = !1;
                break;
              }
            }
            A[t] = 1;
          }
        }
      }
    } else {
      d = !1;
    }
    d && (g = ea(e, b, h, l));
    this.cache && this.j.set(a, g);
    return g;
  };
  w.prototype.find = function(a, b) {
    return this.where(a, b, 1)[0] || null;
  };
  w.prototype.where = function(a, b, c, d) {
    const e = this.i, g = [];
    let f = 0;
    let h;
    var k;
    let l;
    if (F(a)) {
      c || (c = b);
      var p = Object.keys(a);
      var n = p.length;
      h = !1;
      if (1 === n && "id" === p[0]) {
        return [e[a.id]];
      }
      if ((k = this.C) && !d) {
        for (var m = 0; m < k.length; m++) {
          var q = k[m], u = a[q];
          if (!C(u)) {
            l = this.w[q]["@" + u];
            if (0 === --n) {
              return l;
            }
            p.splice(p.indexOf(q), 1);
            delete a[q];
            break;
          }
        }
      }
      k = Array(n);
      for (m = 0; m < n; m++) {
        k[m] = p[m].split(":");
      }
    } else {
      if (O(a)) {
        b = d || Object.keys(e);
        c = b.length;
        for (p = 0; p < c; p++) {
          n = e[b[p]], a(n) && (g[f++] = n);
        }
        return g;
      }
      if (C(b)) {
        return [e[a]];
      }
      if ("id" === a) {
        return [e[b]];
      }
      p = [a];
      n = 1;
      k = [a.split(":")];
      h = !0;
    }
    d = l || d || Object.keys(e);
    m = d.length;
    for (q = 0; q < m; q++) {
      u = l ? d[q] : e[d[q]];
      let A = !0;
      for (let y = 0; y < n; y++) {
        h || (b = a[p[y]]);
        const x = k[y], t = x.length;
        let v = u;
        if (1 < t) {
          for (let z = 0; z < t; z++) {
            v = v[x[z]];
          }
        } else {
          v = v[x[0]];
        }
        if (v !== b) {
          A = !1;
          break;
        }
      }
      if (A && (g[f++] = u, c && f === c)) {
        break;
      }
    }
    return g;
  };
  w.prototype.info = function() {
    return {id:this.id, items:this.length, cache:this.cache && this.cache.l ? this.cache.l.length : !1, matcher:X.length + (this.m ? this.m.length : 0), worker:this.D, threshold:this.threshold, depth:this.depth, resolution:this.b, contextual:this.depth && "strict" === this.c};
  };
  w.prototype.clear = function() {
    return this.destroy().init();
  };
  w.prototype.destroy = function() {
    this.cache && (this.j.clear(), this.j = null);
    this.h = this.g = this.f = null;
    if (this.a) {
      const a = this.a.keys;
      for (let b = 0; b < a.length; b++) {
        this.a.index[a[b]].destroy();
      }
      this.a = this.i = null;
    }
    return this;
  };
  w.prototype.export = function(a) {
    const b = !a || C(a.serialize) || a.serialize;
    if (this.a) {
      const d = !a || C(a.doc) || a.doc;
      var c = !a || C(a.index) || a.index;
      a = [];
      let e = 0;
      if (c) {
        for (c = this.a.keys; e < c.length; e++) {
          const g = this.a.index[c[e]];
          a[e] = [g.h, g.g, Object.keys(g.f)];
        }
      }
      d && (a[e] = this.i);
    } else {
      a = [this.h, this.g, Object.keys(this.f)];
    }
    b && (a = JSON.stringify(a));
    return a;
  };
  w.prototype.import = function(a, b) {
    if (!b || C(b.serialize) || b.serialize) {
      a = JSON.parse(a);
    }
    const c = B();
    if (this.a) {
      var d = !b || C(b.doc) || b.doc, e = 0;
      if (!b || C(b.index) || b.index) {
        b = this.a.keys;
        const f = b.length;
        for (var g = a[0][2]; e < g.length; e++) {
          c[g[e]] = 1;
        }
        for (e = 0; e < f; e++) {
          g = this.a.index[b[e]];
          const h = a[e];
          h && (g.h = h[0], g.g = h[1], g.f = c);
        }
      }
      d && (this.i = F(d) ? d : a[e]);
    } else {
      d = a[2];
      for (e = 0; e < d.length; e++) {
        c[d[e]] = 1;
      }
      this.h = a[0];
      this.g = a[1];
      this.f = c;
    }
  };
  const qa = function() {
    const a = r("\\s+"), b = r("[^a-z0-9 ]"), c = [r("[-/]"), " ", b, "", a, " "];
    return function(d) {
      return Z(P(d.toLowerCase(), c));
    };
  }(), S = {icase:function(a) {
    return a.toLowerCase();
  }, simple:function() {
    const a = r("\\s+"), b = r("[^a-z0-9 ]"), c = r("[-/]"), d = r("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), e = r("[\u00e8\u00e9\u00ea\u00eb]"), g = r("[\u00ec\u00ed\u00ee\u00ef]"), f = r("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), h = r("[\u00f9\u00fa\u00fb\u00fc\u0171]"), k = r("[\u00fd\u0177\u00ff]"), l = r("\u00f1"), p = r("[\u00e7c]"), n = r("\u00df"), m = r(" & "), q = [d, "a", e, "e", g, "i", f, "o", h, "u", k, "y", l, "n", p, "k", n, "s", m, " and ", c, " ", b, "", a, " "];
    return function(u) {
      u = P(u.toLowerCase(), q);
      return " " === u ? "" : u;
    };
  }(), advanced:function() {
    const a = r("ae"), b = r("ai"), c = r("ay"), d = r("ey"), e = r("oe"), g = r("ue"), f = r("ie"), h = r("sz"), k = r("zs"), l = r("ck"), p = r("cc"), n = r("sh"), m = r("th"), q = r("dt"), u = r("ph"), A = r("pf"), y = r("ou"), x = r("uo"), t = [a, "a", b, "ei", c, "ei", d, "ei", e, "o", g, "u", f, "i", h, "s", k, "s", n, "s", l, "k", p, "k", m, "t", q, "t", u, "f", A, "f", y, "o", x, "u"];
    return function(v, z) {
      if (!v) {
        return v;
      }
      v = this.simple(v);
      2 < v.length && (v = P(v, t));
      z || 1 < v.length && (v = Z(v));
      return v;
    };
  }(), extra:function() {
    const a = r("p"), b = r("z"), c = r("[cgq]"), d = r("n"), e = r("d"), g = r("[vw]"), f = r("[aeiouy]"), h = [a, "b", b, "s", c, "k", d, "m", e, "t", g, "f", f, ""];
    return function(k) {
      if (!k) {
        return k;
      }
      k = this.advanced(k, !0);
      if (1 < k.length) {
        k = k.split(" ");
        for (let l = 0; l < k.length; l++) {
          const p = k[l];
          1 < p.length && (k[l] = p[0] + P(p.substring(1), h));
        }
        k = k.join(" ");
        k = Z(k);
      }
      return k;
    };
  }(), balance:qa}, pa = function() {
    function a(b) {
      this.clear();
      this.A = !0 !== b && b;
    }
    a.prototype.clear = function() {
      this.cache = B();
      this.count = B();
      this.index = B();
      this.l = [];
    };
    a.prototype.set = function(b, c) {
      if (this.A && C(this.cache[b])) {
        let d = this.l.length;
        if (d === this.A) {
          d--;
          const e = this.l[d];
          delete this.cache[e];
          delete this.count[e];
          delete this.index[e];
        }
        this.index[b] = d;
        this.l[d] = b;
        this.count[b] = -1;
        this.cache[b] = c;
        this.get(b);
      } else {
        this.cache[b] = c;
      }
    };
    a.prototype.get = function(b) {
      const c = this.cache[b];
      if (this.A && c) {
        var d = ++this.count[b];
        const g = this.index;
        let f = g[b];
        if (0 < f) {
          const h = this.l;
          for (var e = f; this.count[h[--f]] <= d && -1 !== f;) {
          }
          f++;
          if (f !== e) {
            for (d = e; d > f; d--) {
              e = h[d - 1], h[d] = e, g[e] = d;
            }
            h[f] = b;
            g[b] = f;
          }
        }
      }
      return c;
    };
    return a;
  }();
  return w;
}(!1), this);

