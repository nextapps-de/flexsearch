/*
 FlexSearch v0.6.24
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
    this.id = c || 0 === c ? c : ja++;
    this.init(a, b);
    ca(this, "index", function() {
      return this.a ? Object.keys(this.a.index[this.a.keys[0]].f) : Object.keys(this.f);
    });
    ca(this, "length", function() {
      return this.index.length;
    });
  }
  function N(a) {
    const b = B();
    for (const c in a) {
      if (a.hasOwnProperty(c)) {
        const d = a[c];
        F(d) ? b[c] = d.slice(0) : G(d) ? b[c] = N(d) : b[c] = d;
      }
    }
    return b;
  }
  function Q(a, b) {
    const c = a.length, d = O(b), e = [];
    for (let g = 0, f = 0; g < c; g++) {
      const k = a[g];
      if (d && b(k) || !d && !b[k]) {
        e[f++] = k;
      }
    }
    return e;
  }
  function K(a, b, c, d, e, g, f, k, h, m) {
    c = da(c, f ? 0 : e, k, g, b, h, m);
    let n;
    k && (k = c.page, n = c.next, c = c.result);
    if (f) {
      b = this.where(f, null, e, c);
    } else {
      b = c;
      c = this.h;
      e = b.length;
      g = Array(e);
      for (f = 0; f < e; f++) {
        g[f] = c[b[f]];
      }
      b = g;
    }
    c = b;
    d && (O(d) || (L = d.split(":"), 1 < L.length ? d = ka : (L = L[0], d = la)), c.sort(d));
    c = R(k, n, c);
    this.cache && this.j.set(a, c);
    return c;
  }
  function ca(a, b, c) {
    Object.defineProperty(a, b, {get:c});
  }
  function q(a) {
    return new RegExp(a, "g");
  }
  function P(a, b) {
    for (let c = 0; c < b.length; c += 2) {
      a = a.replace(b[c], b[c + 1]);
    }
    return a;
  }
  function T(a, b, c, d, e, g, f, k) {
    if (b[c]) {
      return b[c];
    }
    e = e ? (k - (f || k / 1.5)) * g + (f || k / 1.5) * e : g;
    b[c] = e;
    e >= f && (a = a[k - (e + 0.5 >> 0)], a = a[c] || (a[c] = []), a[a.length] = d);
    return e;
  }
  function Y(a, b) {
    if (a) {
      const c = Object.keys(a);
      for (let d = 0, e = c.length; d < e; d++) {
        const g = c[d], f = a[g];
        if (f) {
          for (let k = 0, h = f.length; k < h; k++) {
            if (f[k] === b) {
              1 === h ? delete a[g] : f.splice(k, 1);
              break;
            } else {
              G(f[k]) && Y(f[k], b);
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
  function ma(a, b) {
    a = a.length - b.length;
    return 0 > a ? 1 : a ? -1 : 0;
  }
  function la(a, b) {
    a = a[L];
    b = b[L];
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function ka(a, b) {
    const c = L.length;
    for (let d = 0; d < c; d++) {
      a = a[L[d]], b = b[L[d]];
    }
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function R(a, b, c) {
    return a ? {page:a, next:b ? "" + b : null, result:c} : c;
  }
  function da(a, b, c, d, e, g, f) {
    let k, h = [];
    if (!0 === c) {
      c = "0";
      var m = "";
    } else {
      m = c && c.split(":");
    }
    const n = a.length;
    if (1 < n) {
      const y = B(), t = [];
      let v, x;
      var p = 0, l;
      let H;
      var u = !0;
      let D, E = 0, M, aa, U, ba;
      m && (2 === m.length ? (U = m, m = !1) : m = ba = parseInt(m[0], 10));
      if (f) {
        for (v = B(); p < n; p++) {
          if ("not" === e[p]) {
            for (x = a[p], H = x.length, l = 0; l < H; l++) {
              v["@" + x[l]] = 1;
            }
          } else {
            aa = p + 1;
          }
        }
        if (C(aa)) {
          return R(c, k, h);
        }
        p = 0;
      } else {
        M = J(e) && e;
      }
      let V;
      for (; p < n; p++) {
        const na = p === (aa || n) - 1;
        if (!M || !p) {
          if ((l = M || e && e[p]) && "and" !== l) {
            if ("or" === l) {
              V = !1;
            } else {
              continue;
            }
          } else {
            V = g = !0;
          }
        }
        x = a[p];
        if (H = x.length) {
          if (u) {
            if (D) {
              var r = D.length;
              for (l = 0; l < r; l++) {
                u = D[l];
                var A = "@" + u;
                f && v[A] || (y[A] = 1, g || (h[E++] = u));
              }
              D = null;
              u = !1;
            } else {
              D = x;
              continue;
            }
          }
          A = !1;
          for (l = 0; l < H; l++) {
            r = x[l];
            var z = "@" + r;
            const W = g ? y[z] || 0 : p;
            if (!(!W && !d || f && v[z] || !g && y[z])) {
              if (W === p) {
                if (na) {
                  if (!ba || --ba < E) {
                    if (h[E++] = r, b && E === b) {
                      return R(c, E + (m || 0), h);
                    }
                  }
                } else {
                  y[z] = p + 1;
                }
                A = !0;
              } else {
                d && (z = t[W] || (t[W] = []), z[z.length] = r);
              }
            }
          }
          if (V && !A && !d) {
            break;
          }
        } else {
          if (V && !d) {
            return R(c, k, x);
          }
        }
      }
      if (D) {
        if (p = D.length, f) {
          for (l = m ? parseInt(m, 10) : 0; l < p; l++) {
            a = D[l], v["@" + a] || (h[E++] = a);
          }
        } else {
          h = D;
        }
      }
      if (d) {
        for (E = h.length, U ? (p = parseInt(U[0], 10) + 1, l = parseInt(U[1], 10) + 1) : (p = t.length, l = 0); p--;) {
          if (r = t[p]) {
            for (H = r.length; l < H; l++) {
              if (d = r[l], !f || !v["@" + d]) {
                if (h[E++] = d, b && E === b) {
                  return R(c, p + ":" + l, h);
                }
              }
            }
            l = 0;
          }
        }
      }
    } else {
      !n || e && "not" === e[0] || (h = a[0], m && (m = parseInt(m[0], 10)));
    }
    b && (f = h.length, m && m > f && (m = 0), m = m || 0, k = m + b, k < f ? h = h.slice(m, k) : (k = 0, m && (h = h.slice(m))));
    return R(c, k, h);
  }
  function J(a) {
    return "string" === typeof a;
  }
  function F(a) {
    return a.constructor === Array;
  }
  function O(a) {
    return "function" === typeof a;
  }
  function G(a) {
    return "object" === typeof a;
  }
  function C(a) {
    return "undefined" === typeof a;
  }
  function ea(a) {
    const b = Array(a);
    for (let c = 0; c < a; c++) {
      b[c] = B();
    }
    return b;
  }
  function B() {
    return Object.create(null);
  }
  const I = {encode:"icase", c:"forward", split:/\W+/, cache:!1, async:!1, C:!1, v:!1, a:!1, b:9, threshold:0, depth:0}, fa = {memory:{encode:"extra", c:"strict", threshold:0, b:1}, speed:{encode:"icase", c:"strict", threshold:1, b:3, depth:2}, match:{encode:"extra", c:"full", threshold:1, b:3}, score:{encode:"extra", c:"strict", threshold:1, b:9, depth:4}, balance:{encode:"balance", c:"strict", threshold:0, b:3, depth:3}, fast:{encode:"icase", c:"strict", threshold:8, b:9, depth:1}}, X = [];
  let ja = 0;
  const ha = {}, ia = {};
  w.create = function(a, b) {
    return new w(a, b);
  };
  w.registerMatcher = function(a) {
    for (const b in a) {
      a.hasOwnProperty(b) && X.push(q(b), a[b]);
    }
    return this;
  };
  w.registerEncoder = function(a, b) {
    S[a] = b.bind(S);
    return this;
  };
  w.registerLanguage = function(a, b) {
    ha[a] = b.filter;
    ia[a] = b.stemmer;
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
      a || (a = I), c = a.preset;
    }
    b = {};
    J(a) ? (b = fa[a], a = {}) : c && (b = fa[c]);
    this.c = a.tokenize || b.c || this.c || I.c;
    this.split = C(c = a.split) ? this.split || I.split : J(c) ? q(c) : c;
    this.v = a.rtl || this.v || I.v;
    this.async = "undefined" === typeof Promise || C(c = a.async) ? this.async || I.async : c;
    this.threshold = C(c = a.threshold) ? b.threshold || this.threshold || I.threshold : c;
    this.b = C(c = a.resolution) ? c = b.b || this.b || I.b : c;
    c <= this.threshold && (this.b = this.threshold + 1);
    this.depth = "strict" !== this.c || C(c = a.depth) ? b.depth || this.depth || I.depth : c;
    this.o = (c = C(c = a.encode) ? b.encode || I.encode : c) && S[c] && S[c].bind(S) || (O(c) ? c : this.o || !1);
    (c = a.matcher) && this.addMatcher(c);
    if (c = (b = a.lang) || a.filter) {
      J(c) && (c = ha[c]);
      if (F(c)) {
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
      var k;
      b = J(c) ? ia[c] : c;
      d = this.o;
      e = [];
      for (k in b) {
        b.hasOwnProperty(k) && (g = d ? d(k) : k, e.push(q(g + "($|\\W)"), d ? d(b[k]) : b[k]));
      }
      this.stemmer = k = e;
    }
    this.a = e = (c = a.doc) ? N(c) : this.a || I.a;
    this.i = ea(this.b - (this.threshold || 0));
    this.g = B();
    this.f = B();
    if (e) {
      this.h = B();
      a.doc = null;
      k = e.index = {};
      b = e.keys = [];
      d = e.field;
      g = e.tag;
      F(e.id) || (e.id = e.id.split(":"));
      if (g) {
        this.w = B();
        f = B();
        if (d) {
          if (J(d)) {
            f[d] = a;
          } else {
            if (F(d)) {
              for (let h = 0; h < d.length; h++) {
                f[d[h]] = a;
              }
            } else {
              G(d) && (f = d);
            }
          }
        }
        F(g) || (e.tag = g = [g]);
        for (d = 0; d < g.length; d++) {
          this.w[g[d]] = B();
        }
        this.B = g;
        d = f;
      }
      if (d) {
        let h;
        F(d) || (G(d) ? (h = d, e.field = d = Object.keys(d)) : e.field = d = [d]);
        for (e = 0; e < d.length; e++) {
          g = d[e], F(g) || (h && (a = h[g]), b[e] = g, d[e] = g.split(":")), k[g] = new w(a), k[g].h = this.h;
        }
      }
    }
    this.u = !0;
    this.j = (this.cache = c = C(c = a.cache) ? this.cache || I.cache : c) ? new oa(c) : !1;
    return this;
  };
  w.prototype.encode = function(a) {
    a && (X.length && (a = P(a, X)), this.m.length && (a = P(a, this.m)), this.o && (a = this.o(a)), this.stemmer && (a = P(a, this.stemmer)));
    return a;
  };
  w.prototype.addMatcher = function(a) {
    const b = this.m;
    for (const c in a) {
      a.hasOwnProperty(c) && b.push(q(c), a[c]);
    }
    return this;
  };
  w.prototype.add = function(a, b, c, d, e) {
    if (this.a && G(a)) {
      return this.s("add", a, b);
    }
    if (b && J(b) && (a || 0 === a)) {
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
      const p = B();
      p._ctx = B();
      const l = e.length, u = this.threshold, r = this.depth, A = this.b, z = this.i, y = this.v;
      for (let t = 0; t < l; t++) {
        var f = e[t];
        if (f) {
          var k = f.length, h = (y ? t + 1 : l - t) / l, m = "";
          switch(c) {
            case "reverse":
            case "both":
              for (var n = k; --n;) {
                m = f[n] + m, T(z, p, m, a, y ? 1 : (k - n) / k, h, u, A - 1);
              }
              m = "";
            case "forward":
              for (n = 0; n < k; n++) {
                m += f[n], T(z, p, m, a, y ? (n + 1) / k : 1, h, u, A - 1);
              }
              break;
            case "full":
              for (n = 0; n < k; n++) {
                const v = (y ? n + 1 : k - n) / k;
                for (let x = k; x > n; x--) {
                  m = f.substring(n, x), T(z, p, m, a, v, h, u, A - 1);
                }
              }
              break;
            default:
              if (k = T(z, p, f, a, 1, h, u, A - 1), r && 1 < l && k >= u) {
                for (k = p._ctx[f] || (p._ctx[f] = B()), f = this.g[f] || (this.g[f] = ea(A - (u || 0))), h = t - r, m = t + r + 1, 0 > h && (h = 0), m > l && (m = l); h < m; h++) {
                  h !== t && T(f, k, e[h], a, 0, A - (h < t ? t - h : h - t), u, A - 1);
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
    if (F(b)) {
      for (let h = 0, m = b.length; h < m; h++) {
        if (h === m - 1) {
          return this.s(a, b[h], c);
        }
        this.s(a, b[h]);
      }
    } else {
      const h = this.a.index, m = this.a.keys;
      var d = this.a.tag, e = this.a.id;
      let n;
      let p;
      for (var g = 0; g < e.length; g++) {
        n = (n || b)[e[g]];
      }
      if (d) {
        for (e = 0; e < d.length; e++) {
          var f = d[e];
          var k = f.split(":");
          for (g = 0; g < k.length; g++) {
            p = (p || b)[k[g]];
          }
          p = "@" + p;
        }
        k = this.w[f];
        k = k[p] || (k[p] = []);
      }
      if ("remove" === a) {
        delete this.h[n];
        for (let l = 0, u = m.length; l < u; l++) {
          if (l === u - 1) {
            return h[m[l]].remove(n, c), this;
          }
          h[m[l]].remove(n);
        }
      }
      e = this.a.field;
      k && (k[k.length] = b);
      this.h[n] = b;
      for (let l = 0, u = e.length; l < u; l++) {
        d = e[l];
        let r;
        for (f = 0; f < d.length; f++) {
          r = (r || b)[d[f]];
        }
        d = h[m[l]];
        f = "add" === a ? d.add : d.update;
        l === u - 1 ? f.call(d, n, r, c) : f.call(d, n, r);
      }
    }
    return this;
  };
  w.prototype.update = function(a, b, c) {
    if (this.a && G(a)) {
      return this.s("update", a, b);
    }
    this.f["@" + a] && J(b) && (this.remove(a), this.add(a, b, c, !0));
    return this;
  };
  w.prototype.remove = function(a, b, c) {
    if (this.a && G(a)) {
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
        Y(this.i[b], a);
      }
      this.depth && Y(this.g, a);
      delete this.f[d];
      this.u = !1;
    }
    return this;
  };
  let L;
  w.prototype.search = function(a, b, c, d) {
    if (G(b)) {
      if (F(b)) {
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
    let k, h, m;
    if (G(a) && !F(a)) {
      c || (c = a.callback) && (f.callback = null);
      h = a.sort;
      k = a.page;
      b = a.limit;
      var n = a.threshold;
      m = a.suggest;
      a = a.query;
    }
    if (this.a) {
      n = this.a.index;
      const y = f.where;
      var p = f.bool || "or", l = f.field;
      let t = p;
      let v, x;
      if (l) {
        F(l) || (l = [l]);
      } else {
        if (F(f)) {
          var u = f;
          l = [];
          t = [];
          for (var r = 0; r < f.length; r++) {
            d = f[r], e = d.bool || p, l[r] = d.field, t[r] = e, "not" === e ? v = !0 : "and" === e && (x = !0);
          }
        } else {
          l = this.a.keys;
        }
      }
      p = l.length;
      for (r = 0; r < p; r++) {
        u && (f = u[r]), k && !J(f) && (f.page = null, f.limit = 0), g[r] = n[l[r]].search(f, 0);
      }
      if (c) {
        return c(K.call(this, a, t, g, h, b, m, y, k, x, v));
      }
      if (this.async) {
        const H = this;
        return new Promise(function(D) {
          Promise.all(g).then(function(E) {
            D(K.call(H, a, t, E, h, b, m, y, k, x, v));
          });
        });
      }
      return K.call(this, a, t, g, h, b, m, y, k, x, v);
    }
    n || (n = this.threshold || 0);
    if (!d) {
      if (this.async && "function" !== typeof importScripts) {
        let y = this;
        n = new Promise(function(t) {
          setTimeout(function() {
            t(y.search(f, b, null, !0));
            y = null;
          });
        });
        if (c) {
          n.then(c);
        } else {
          return n;
        }
        return this;
      }
      if (c) {
        return c(this.search(f, b, null, !0)), this;
      }
    }
    if (!a || !J(a)) {
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
    u = c.length;
    d = !0;
    e = [];
    const A = B();
    let z = 0;
    1 < u && (this.depth && "strict" === this.c ? p = !0 : c.sort(ma));
    if (!p || (r = this.g)) {
      const y = this.b;
      for (; z < u; z++) {
        let t = c[z];
        if (t) {
          if (p) {
            if (!l) {
              if (r[t]) {
                l = t, A[t] = 1;
              } else {
                if (!m) {
                  return g;
                }
              }
            }
            if (m && z === u - 1 && !e.length) {
              p = !1, t = l || t, A[t] = 0;
            } else {
              if (!l) {
                continue;
              }
            }
          }
          if (!A[t]) {
            const v = [];
            let x = !1, H = 0;
            const D = p ? r[l] : this.i;
            if (D) {
              let E;
              for (let M = 0; M < y - n; M++) {
                if (E = D[M] && D[M][t]) {
                  v[H++] = E, x = !0;
                }
              }
            }
            if (x) {
              l = t, e[e.length] = 1 < H ? v.concat.apply([], v) : v[0];
            } else {
              if (!m) {
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
    d && (g = da(e, b, k, m));
    this.cache && this.j.set(a, g);
    return g;
  };
  w.prototype.find = function(a, b) {
    return this.where(a, b, 1)[0] || null;
  };
  w.prototype.where = function(a, b, c, d) {
    const e = this.h, g = [];
    let f = 0;
    let k;
    var h;
    let m;
    if (G(a)) {
      c || (c = b);
      var n = Object.keys(a);
      var p = n.length;
      k = !1;
      if (1 === p && "id" === n[0]) {
        return [e[a.id]];
      }
      if ((h = this.B) && !d) {
        for (var l = 0; l < h.length; l++) {
          var u = h[l], r = a[u];
          if (!C(r)) {
            m = this.w[u]["@" + r];
            if (0 === --p) {
              return m;
            }
            n.splice(n.indexOf(u), 1);
            delete a[u];
            break;
          }
        }
      }
      h = Array(p);
      for (l = 0; l < p; l++) {
        h[l] = n[l].split(":");
      }
    } else {
      if (O(a)) {
        b = d || Object.keys(e);
        c = b.length;
        for (n = 0; n < c; n++) {
          p = e[b[n]], a(p) && (g[f++] = p);
        }
        return g;
      }
      if (C(b)) {
        return [e[a]];
      }
      if ("id" === a) {
        return [e[b]];
      }
      n = [a];
      p = 1;
      h = [a.split(":")];
      k = !0;
    }
    d = m || d || Object.keys(e);
    l = d.length;
    for (u = 0; u < l; u++) {
      r = m ? d[u] : e[d[u]];
      let A = !0;
      for (let z = 0; z < p; z++) {
        k || (b = a[n[z]]);
        const y = h[z], t = y.length;
        let v = r;
        if (1 < t) {
          for (let x = 0; x < t; x++) {
            v = v[y[x]];
          }
        } else {
          v = v[y[0]];
        }
        if (v !== b) {
          A = !1;
          break;
        }
      }
      if (A && (g[f++] = r, c && f === c)) {
        break;
      }
    }
    return g;
  };
  w.prototype.info = function() {
    return {id:this.id, items:this.length, cache:this.cache && this.cache.l ? this.cache.l.length : !1, matcher:X.length + (this.m ? this.m.length : 0), worker:this.C, threshold:this.threshold, depth:this.depth, resolution:this.b, contextual:this.depth && "strict" === this.c};
  };
  w.prototype.clear = function() {
    return this.destroy().init();
  };
  w.prototype.destroy = function() {
    this.cache && (this.j.clear(), this.j = null);
    this.i = this.g = this.f = null;
    if (this.a) {
      const a = this.a.keys;
      for (let b = 0; b < a.length; b++) {
        this.a.index[a[b]].destroy();
      }
      this.a = this.h = null;
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
          a[e] = [g.i, g.g, Object.keys(g.f)];
        }
      }
      d && (a[e] = this.h);
    } else {
      a = [this.i, this.g, Object.keys(this.f)];
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
          g = this.a.index[b[e]], g.i = a[e][0], g.g = a[e][1], g.f = c;
        }
      }
      d && (this.h = G(d) ? d : a[e]);
    } else {
      d = a[2];
      for (e = 0; e < d.length; e++) {
        c[d[e]] = 1;
      }
      this.i = a[0];
      this.g = a[1];
      this.f = c;
    }
  };
  const pa = function() {
    const a = q("\\s+"), b = q("[^a-z0-9 ]"), c = [q("[-/]"), " ", b, "", a, " "];
    return function(d) {
      return Z(P(d.toLowerCase(), c));
    };
  }(), S = {icase:function(a) {
    return a.toLowerCase();
  }, simple:function() {
    const a = q("\\s+"), b = q("[^a-z0-9 ]"), c = q("[-/]"), d = q("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), e = q("[\u00e8\u00e9\u00ea\u00eb]"), g = q("[\u00ec\u00ed\u00ee\u00ef]"), f = q("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), k = q("[\u00f9\u00fa\u00fb\u00fc\u0171]"), h = q("[\u00fd\u0177\u00ff]"), m = q("\u00f1"), n = q("[\u00e7c]"), p = q("\u00df"), l = q(" & "), u = [d, "a", e, "e", g, "i", f, "o", k, "u", h, "y", m, "n", n, "k", p, "s", l, " and ", c, " ", b, "", a, " "];
    return function(r) {
      r = P(r.toLowerCase(), u);
      return " " === r ? "" : r;
    };
  }(), advanced:function() {
    const a = q("ae"), b = q("ai"), c = q("ay"), d = q("ey"), e = q("oe"), g = q("ue"), f = q("ie"), k = q("sz"), h = q("zs"), m = q("ck"), n = q("cc"), p = q("sh"), l = q("th"), u = q("dt"), r = q("ph"), A = q("pf"), z = q("ou"), y = q("uo"), t = [a, "a", b, "ei", c, "ei", d, "ei", e, "o", g, "u", f, "i", k, "s", h, "s", p, "s", m, "k", n, "k", l, "t", u, "t", r, "f", A, "f", z, "o", y, "u"];
    return function(v, x) {
      if (!v) {
        return v;
      }
      v = this.simple(v);
      2 < v.length && (v = P(v, t));
      x || 1 < v.length && (v = Z(v));
      return v;
    };
  }(), extra:function() {
    const a = q("p"), b = q("z"), c = q("[cgq]"), d = q("n"), e = q("d"), g = q("[vw]"), f = q("[aeiouy]"), k = [a, "b", b, "s", c, "k", d, "m", e, "t", g, "f", f, ""];
    return function(h) {
      if (!h) {
        return h;
      }
      h = this.advanced(h, !0);
      if (1 < h.length) {
        h = h.split(" ");
        for (let m = 0; m < h.length; m++) {
          const n = h[m];
          1 < n.length && (h[m] = n[0] + P(n.substring(1), k));
        }
        h = h.join(" ");
        h = Z(h);
      }
      return h;
    };
  }(), balance:pa}, oa = function() {
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
          const k = this.l;
          for (var e = f; this.count[k[--f]] <= d && -1 !== f;) {
          }
          f++;
          if (f !== e) {
            for (d = e; d > f; d--) {
              e = k[d - 1], k[d] = e, g[e] = d;
            }
            k[f] = b;
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

