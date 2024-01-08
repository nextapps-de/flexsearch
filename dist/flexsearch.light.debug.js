/**!
 * FlexSearch.js v0.7.41 (Light)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
function t(a) {
  return "undefined" !== typeof a ? a : !0;
}
function v(a) {
  const b = Array(a);
  for (let c = 0; c < a; c++) {
    b[c] = y();
  }
  return b;
}
function y() {
  return Object.create(null);
}
function z(a, b) {
  return b.length - a.length;
}
;const A = /[\p{Z}\p{S}\p{P}\p{C}]+/u;
function B(a, b) {
  const c = Object.keys(a), d = c.length, e = [];
  let h = "", f = 0;
  for (let g = 0, l, n; g < d; g++) {
    l = c[g], (n = a[l]) ? (e[f++] = new RegExp(b ? "(?!\\b)" + l + "(\\b|_)" : l, "g"), e[f++] = n) : h += (h ? "|" : "") + l;
  }
  h && (e[f++] = new RegExp(b ? "(?!\\b)(" + h + ")(\\b|_)" : "(" + h + ")", "g"), e[f] = "");
  return e;
}
function C(a, b) {
  for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
;function E(a) {
  if (a = ("" + a).toLowerCase()) {
    if (this.o && (a = C(a, this.o)), this.A && 1 < a.length && (a = C(a, this.A)), A || "" === A) {
      const b = a.split(A);
      if (this.filter) {
        a = this.filter;
        const c = b.length, d = [];
        for (let e = 0, h = 0; e < c; e++) {
          const f = b[e];
          f && !a[f] && (d[h++] = f);
        }
        a = d;
      } else {
        a = b;
      }
    }
  }
  return a;
}
;const F = {}, G = {};
function H(a, b, c, d) {
  const e = a.length;
  let h = [], f, g, l = 0;
  d && (d = []);
  for (let n = e - 1; 0 <= n; n--) {
    const m = a[n], r = m.length, p = y();
    let q = !f;
    for (let k = 0; k < r; k++) {
      const u = m[k], L = u.length;
      if (L) {
        for (let D = 0, x, w; D < L; D++) {
          if (w = u[D], f) {
            if (f[w]) {
              if (!n) {
                if (c) {
                  c--;
                } else {
                  if (h[l++] = w, l === b) {
                    return h;
                  }
                }
              }
              if (n || d) {
                p[w] = 1;
              }
              q = !0;
            }
            if (d && (x = (g[w] || 0) + 1, g[w] = x, x < e)) {
              const M = d[x - 2] || (d[x - 2] = []);
              M[M.length] = w;
            }
          } else {
            p[w] = 1;
          }
        }
      }
    }
    if (d) {
      f || (g = p);
    } else if (!q) {
      return [];
    }
    f = p;
  }
  if (d) {
    for (let n = d.length - 1, m, r; 0 <= n; n--) {
      m = d[n];
      r = m.length;
      for (let p = 0, q; p < r; p++) {
        if (q = m[p], !f[q]) {
          if (c) {
            c--;
          } else {
            if (h[l++] = q, l === b) {
              return h;
            }
          }
          f[q] = 1;
        }
      }
    }
  }
  return h;
}
;function I(a, b) {
  if (!(this instanceof I)) {
    return new I(a);
  }
  let c;
  if (a) {
    var d = a.charset;
    c = a.lang;
    "string" === typeof d && (-1 === d.indexOf(":") && (d += ":default"), d = G[d]);
    "string" === typeof c && (c = F[c]);
  } else {
    a = {};
  }
  let e, h, f = a.context || {};
  this.encode = a.encode || d && d.encode || E;
  this.register = b || y();
  this.s = e = a.resolution || 9;
  this.B = b = d && d.B || a.tokenize || "strict";
  this.i = "strict" === b && f.depth;
  this.j = t(f.bidirectional);
  this.g = h = t(a.optimize);
  this.m = t(a.fastupdate);
  this.h = a.minlength || 1;
  this.C = a.boost;
  this.map = h ? v(e) : y();
  this.v = e = f.resolution || 1;
  this.l = h ? v(e) : y();
  this.u = d && d.u || a.rtl;
  this.o = (b = a.matcher || c && c.o) && B(b, !1);
  this.A = (b = a.stemmer || c && c.A) && B(b, !0);
  if (a = b = a.filter || c && c.filter) {
    a = b;
    d = y();
    for (let g = 0, l = a.length; g < l; g++) {
      d[a[g]] = 1;
    }
    a = d;
  }
  this.filter = a;
}
I.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
I.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.register[a]) {
      return this.update(a, b);
    }
    b = this.encode(b);
    if (d = b.length) {
      const n = y(), m = y(), r = this.i, p = this.s;
      for (let q = 0; q < d; q++) {
        let k = b[this.u ? d - 1 - q : q];
        var e = k.length;
        if (k && e >= this.h && (r || !m[k])) {
          var h = J(p, d, q), f = "";
          switch(this.B) {
            case "full":
              if (2 < e) {
                for (h = 0; h < e; h++) {
                  for (var g = e; g > h; g--) {
                    if (g - h >= this.h) {
                      var l = J(p, d, q, e, h);
                      f = k.substring(h, g);
                      K(this, m, f, l, a, c);
                    }
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (g = e - 1; 0 < g; g--) {
                  f = k[g] + f, f.length >= this.h && K(this, m, f, J(p, d, q, e, g), a, c);
                }
                f = "";
              }
            case "forward":
              if (1 < e) {
                for (g = 0; g < e; g++) {
                  f += k[g], f.length >= this.h && K(this, m, f, h, a, c);
                }
                break;
              }
            default:
              if (this.C && (h = Math.min(h / this.C(b, k, q) | 0, p - 1)), K(this, m, k, h, a, c), r && 1 < d && q < d - 1) {
                for (e = y(), f = this.v, h = k, g = Math.min(r + 1, d - q), e[h] = 1, l = 1; l < g; l++) {
                  if ((k = b[this.u ? d - 1 - q - l : q + l]) && k.length >= this.h && !e[k]) {
                    e[k] = 1;
                    const u = this.j && k > h;
                    K(this, n, u ? h : k, J(f + (d / 2 > f ? 0 : 1), d, q, g - 1, l - 1), a, c, u ? k : h);
                  }
                }
              }
          }
        }
      }
      this.m || (this.register[a] = 1);
    }
  }
  return this;
};
function J(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
function K(a, b, c, d, e, h, f) {
  let g = f ? a.l : a.map;
  if (!b[c] || f && !b[c][f]) {
    a.g && (g = g[d]), f ? (b = b[c] || (b[c] = y()), b[f] = 1, g = g[f] || (g[f] = y())) : b[c] = 1, g = g[c] || (g[c] = []), a.g || (g = g[d] || (g[d] = [])), h && g.includes(e) || (g[g.length] = e, a.m && (a = a.register[e] || (a.register[e] = []), a[a.length] = g));
  }
}
I.prototype.search = function(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b) : (c = a, a = c.query));
  let d = [], e;
  let h, f = 0;
  if (c) {
    a = c.query || a;
    b = c.limit;
    f = c.offset || 0;
    var g = c.context;
    h = !1;
  }
  if (a && (a = this.encode("" + a), e = a.length, 1 < e)) {
    c = y();
    var l = [];
    for (let m = 0, r = 0, p; m < e; m++) {
      if ((p = a[m]) && p.length >= this.h && !c[p]) {
        if (this.g || h || this.map[p]) {
          l[r++] = p, c[p] = 1;
        } else {
          return d;
        }
      }
    }
    a = l;
    e = a.length;
  }
  if (!e) {
    return d;
  }
  b || (b = 100);
  g = this.i && 1 < e && !1 !== g;
  c = 0;
  let n;
  g ? (n = a[0], c = 1) : 1 < e && a.sort(z);
  for (let m, r; c < e; c++) {
    r = a[c];
    g ? (m = N(this, d, h, b, f, 2 === e, r, n), h && !1 === m && d.length || (n = r)) : m = N(this, d, h, b, f, 1 === e, r);
    if (m) {
      return m;
    }
    if (h && c === e - 1) {
      l = d.length;
      if (!l) {
        if (g) {
          g = 0;
          c = -1;
          continue;
        }
        return d;
      }
      if (1 === l) {
        return O(d[0], b, f);
      }
    }
  }
  return H(d, b, f, h);
};
function N(a, b, c, d, e, h, f, g) {
  let l = [], n = g ? a.l : a.map;
  a.g || (n = P(n, f, g, a.j));
  if (n) {
    let m = 0;
    const r = Math.min(n.length, g ? a.v : a.s);
    for (let p = 0, q = 0, k, u; p < r; p++) {
      if (k = n[p]) {
        if (a.g && (k = P(k, f, g, a.j)), e && k && h && (u = k.length, u <= e ? (e -= u, k = null) : (k = k.slice(e), e = 0)), k && (l[m++] = k, h && (q += k.length, q >= d))) {
          break;
        }
      }
    }
    if (m) {
      if (h) {
        return O(l, d, 0);
      }
      b[b.length] = l;
      return;
    }
  }
  return !c && l;
}
function O(a, b, c) {
  a = 1 === a.length ? a[0] : [].concat.apply([], a);
  return c || a.length > b ? a.slice(c, c + b) : a;
}
function P(a, b, c, d) {
  c ? (d = d && b > c, a = (a = a[d ? b : c]) && a[d ? c : b]) : a = a[b];
  return a;
}
I.prototype.contain = function(a) {
  return !!this.register[a];
};
I.prototype.update = function(a, b) {
  return this.remove(a).add(a, b);
};
I.prototype.remove = function(a, b) {
  const c = this.register[a];
  if (c) {
    if (this.m) {
      for (let d = 0, e; d < c.length; d++) {
        e = c[d], e.splice(e.indexOf(a), 1);
      }
    } else {
      Q(this.map, a, this.s, this.g), this.i && Q(this.l, a, this.v, this.g);
    }
    b || delete this.register[a];
  }
  return this;
};
function Q(a, b, c, d, e) {
  let h = 0;
  if (a.constructor === Array) {
    if (e) {
      b = a.indexOf(b), -1 !== b ? 1 < a.length && (a.splice(b, 1), h++) : h++;
    } else {
      e = Math.min(a.length, c);
      for (let f = 0, g; f < e; f++) {
        if (g = a[f]) {
          h = Q(g, b, c, d, e), d || h || delete a[f];
        }
      }
    }
  } else {
    for (let f in a) {
      (h = Q(a[f], b, c, d, e)) || delete a[f];
    }
  }
  return h;
}
;const R = {Index:I, Document:null, Worker:null, registerCharset:function(a, b) {
  G[a] = b;
}, registerLanguage:function(a, b) {
  F[a] = b;
}};
let S;
(S = self.define) && S.amd ? S([], function() {
  return R;
}) : self.exports ? self.exports = R : self.FlexSearch = R;
}(this));
