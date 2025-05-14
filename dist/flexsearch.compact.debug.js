/**!
 * FlexSearch.js v0.8.166 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var B;
function I(a, c, b) {
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
function J(a, c) {
  return "undefined" === typeof a ? c : a;
}
function L() {
  return Object.create(null);
}
function P(a) {
  return "string" === typeof a;
}
function R(a) {
  return "object" === typeof a;
}
function S(a, c) {
  if (P(c)) {
    a = a[c];
  } else {
    for (let b = 0; a && b < c.length; b++) {
      a = a[c[b]];
    }
  }
  return a;
}
;const aa = /[^\p{L}\p{N}]+/u, da = /(\d{3})/g, ea = /(\D)(\d{3})/g, fa = /(\d{3})(\D)/g, ha = /[\u0300-\u036f]/g;
function ka(a = {}) {
  if (!this || this.constructor !== ka) {
    return new ka(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
B = ka.prototype;
B.assign = function(a) {
  this.normalize = I(a.normalize, !0, this.normalize);
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
    this.numeric = I(a.numeric, e);
  } else {
    try {
      this.split = I(this.split, aa);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = I(a.numeric, I(this.numeric, !0));
  }
  this.prepare = I(a.prepare, null, this.prepare);
  this.finalize = I(a.finalize, null, this.finalize);
  b = a.filter;
  this.filter = "function" === typeof b ? b : I(b && new Set(b), null, this.filter);
  this.dedupe = I(a.dedupe, !0, this.dedupe);
  this.matcher = I((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = I((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = I((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = I(a.replacer, null, this.replacer);
  this.minlength = I(a.minlength, 1, this.minlength);
  this.maxlength = I(a.maxlength, 1024, this.maxlength);
  this.rtl = I(a.rtl, !1, this.rtl);
  if (this.cache = b = I(a.cache, !0, this.cache)) {
    this.H = null, this.O = "number" === typeof b ? b : 2e5, this.F = new Map(), this.G = new Map(), this.L = this.K = 128;
  }
  this.h = "";
  this.M = null;
  this.C = "";
  this.N = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.h += (this.h ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.C += (this.C ? "|" : "") + d;
    }
  }
  return this;
};
B.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.C += (this.C ? "|" : "") + a;
  this.N = null;
  this.cache && V(this);
  return this;
};
B.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && V(this);
  return this;
};
B.addMapper = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (1 < a.length) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && V(this);
  return this;
};
B.addMatcher = function(a, c) {
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
  this.cache && V(this);
  return this;
};
B.addReplacer = function(a, c) {
  if ("string" === typeof a) {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && V(this);
  return this;
};
B.encode = function(a, c) {
  if (this.cache && a.length <= this.K) {
    if (this.H) {
      if (this.F.has(a)) {
        return this.F.get(a);
      }
    } else {
      this.H = setTimeout(V, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = ha ? a.normalize("NFKD").replace(ha, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ea, "$1 $2").replace(fa, "$1 $2").replace(da, "$1 "));
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let e = [], d = L(), f, g, k = this.split || "" === this.split ? a.split(this.split) : [a];
  for (let m = 0, n, z; m < k.length; m++) {
    if ((n = z = k[m]) && !(n.length < this.minlength || n.length > this.maxlength)) {
      if (c) {
        if (d[n]) {
          continue;
        }
        d[n] = 1;
      } else {
        if (f === n) {
          continue;
        }
        f = n;
      }
      if (b) {
        e.push(n);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(n) : !this.filter.has(n))) {
          if (this.cache && n.length <= this.L) {
            if (this.H) {
              var h = this.G.get(n);
              if (h || "" === h) {
                h && e.push(h);
                continue;
              }
            } else {
              this.H = setTimeout(V, 50, this);
            }
          }
          if (this.stemmer) {
            this.N || (this.N = new RegExp("(?!^)(" + this.C + ")$"));
            let x;
            for (; x !== n && 2 < n.length;) {
              x = n, n = n.replace(this.N, q => this.stemmer.get(q));
            }
          }
          if (n && (this.mapper || this.dedupe && 1 < n.length)) {
            h = "";
            for (let x = 0, q = "", r, w; x < n.length; x++) {
              r = n.charAt(x), r === q && this.dedupe || ((w = this.mapper && this.mapper.get(r)) || "" === w ? w === q && this.dedupe || !(q = w) || (h += w) : h += q = r);
            }
            n = h;
          }
          this.matcher && 1 < n.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), n = n.replace(this.M, x => this.matcher.get(x)));
          if (n && this.replacer) {
            for (h = 0; n && h < this.replacer.length; h += 2) {
              n = n.replace(this.replacer[h], this.replacer[h + 1]);
            }
          }
          this.cache && z.length <= this.L && (this.G.set(z, n), this.G.size > this.O && (this.G.clear(), this.L = this.L / 1.1 | 0));
          if (n) {
            if (n !== z) {
              if (c) {
                if (d[n]) {
                  continue;
                }
                d[n] = 1;
              } else {
                if (g === n) {
                  continue;
                }
                g = n;
              }
            }
            e.push(n);
          }
        }
      }
    }
  }
  this.finalize && (e = this.finalize(e) || e);
  this.cache && a.length <= this.K && (this.F.set(a, e), this.F.size > this.O && (this.F.clear(), this.K = this.K / 1.1 | 0));
  return e;
};
function V(a) {
  a.H = null;
  a.F.clear();
  a.G.clear();
}
;function la(a) {
  W.call(a, "add");
  W.call(a, "append");
  W.call(a, "search");
  W.call(a, "update");
  W.call(a, "remove");
  W.call(a, "searchCache");
}
let ma, na, oa;
function pa() {
  ma = oa = 0;
}
function W(a) {
  this[a + "Async"] = function() {
    const c = arguments;
    var b = c[c.length - 1];
    let e;
    "function" === typeof b && (e = b, delete c[c.length - 1]);
    ma ? oa || (oa = Date.now() - na >= this.priority * this.priority * 3) : (ma = setTimeout(pa, 0), na = Date.now());
    if (oa) {
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
;function qa(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function ra(a, c) {
  c || (c = new Map());
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c.set(e[0], e[1]);
  }
  return c;
}
function sa(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], qa(d[1])[0]]), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function ta(a, c) {
  c || (c = new Map());
  for (let b = 0, e, d; b < a.length; b++) {
    e = a[b], d = c.get(e[0]), c.set(e[0], ra(e[1], d));
  }
  return c;
}
function wa(a) {
  let c = [], b = [];
  for (const e of a.keys()) {
    b.push(e), 250000 === b.length && (c.push(b), b = []);
  }
  b.length && c.push(b);
  return c;
}
function xa(a, c) {
  c || (c = new Set());
  for (let b = 0; b < a.length; b++) {
    c.add(a[b]);
  }
  return c;
}
function ya(a, c, b, e, d, f, g = 0) {
  const k = e && e.constructor === Array;
  var h = k ? e.shift() : e;
  if (!h) {
    return this.export(a, c, d, f + 1);
  }
  if ((h = a((c ? c + "." : "") + (g + 1) + "." + b, JSON.stringify(h))) && h.then) {
    const m = this;
    return h.then(function() {
      return ya.call(m, a, c, b, k ? e : null, d, f, g + 1);
    });
  }
  return ya.call(this, a, c, b, k ? e : null, d, f, g + 1);
}
function za(a, c) {
  let b = "";
  for (const e of a.entries()) {
    a = e[0];
    const d = e[1];
    let f = "";
    for (let g = 0, k; g < d.length; g++) {
      k = d[g] || [""];
      let h = "";
      for (let m = 0; m < k.length; m++) {
        h += (h ? "," : "") + ("string" === c ? '"' + k[m] + '"' : k[m]);
      }
      h = "[" + h + "]";
      f += (f ? "," : "") + h;
    }
    f = '["' + a + '",[' + f + "]]";
    b += (b ? "," : "") + f;
  }
  return b;
}
;X.prototype.add = function(a, c, b) {
  R(a) && (c = a, a = S(c, this.key));
  if (c && (a || 0 === a)) {
    if (!b && this.reg.has(a)) {
      return this.update(a, c);
    }
    for (let k = 0, h; k < this.field.length; k++) {
      h = this.D[k];
      var e = this.index.get(this.field[k]);
      if ("function" === typeof h) {
        var d = h(c);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = h.I, !d || d(c)) {
          h.constructor === String ? h = ["" + h] : P(h) && (h = [h]), Aa(c, h, this.J, 0, e, a, h[0], b);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.B.length; e++) {
        var f = this.B[e], g = this.R[e];
        d = this.tag.get(g);
        let k = L();
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
          f = S(c, f);
        }
        if (d && f) {
          P(f) && (f = [f]);
          for (let h = 0, m, n; h < f.length; h++) {
            m = f[h], k[m] || (k[m] = 1, (g = d.get(m)) ? n = g : d.set(m, n = []), b && n.includes(a) || (n.push(a), this.fastupdate && ((g = this.reg.get(a)) ? g.push(n) : this.reg.set(a, [n]))));
          }
        } else {
          d || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!b || !this.store.has(a))) {
      let k;
      if (this.A) {
        k = L();
        for (let h = 0, m; h < this.A.length; h++) {
          m = this.A[h];
          if ((b = m.I) && !b(c)) {
            continue;
          }
          let n;
          if ("function" === typeof m) {
            n = m(c);
            if (!n) {
              continue;
            }
            m = [m.S];
          } else if (P(m) || m.constructor === String) {
            k[m] = c[m];
            continue;
          }
          Ba(c, k, m, 0, m[0], n);
        }
      }
      this.store.set(a, k || c);
    }
  }
  return this;
};
function Ba(a, c, b, e, d, f) {
  a = a[d];
  if (e === b.length - 1) {
    c[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (c = c[d] = Array(a.length), d = 0; d < a.length; d++) {
        Ba(a, c, b, e, d);
      }
    } else {
      c = c[d] || (c[d] = L()), d = b[++e], Ba(a, c, b, e, d);
    }
  }
}
function Aa(a, c, b, e, d, f, g, k) {
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
          Aa(a, c, b, e, d, f, g, k);
        }
      } else {
        g = c[++e], Aa(a, c, b, e, d, f, g, k);
      }
    }
  }
}
;function Ca(a, c, b) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a;
  }
  let e = [];
  for (let d = 0, f, g; d < a.length; d++) {
    if ((f = a[d]) && (g = f.length)) {
      if (b) {
        if (b >= g) {
          b -= g;
          continue;
        }
        b < g && (f = c ? f.slice(b, b + c) : f.slice(b), g = f.length, b = 0);
      }
      g > c && (f = f.slice(0, c), g = c);
      if (!e.length && g >= c) {
        return f;
      }
      e.push(f);
      c -= g;
      if (!c) {
        break;
      }
    }
  }
  return e = 1 < e.length ? [].concat.apply([], e) : e[0];
}
;function Da(a, c, b, e, d) {
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
  let h = d && d.boundary, m = !d || !1 !== d.clip, n = d && d.merge && k && g && new RegExp(k + " " + g, "g");
  d = d && d.ellipsis;
  var z = 0;
  if ("object" === typeof d) {
    var x = d.template;
    z = x.length - 2;
    d = d.pattern;
  }
  "string" !== typeof d && (d = !1 === d ? "" : "...");
  z && (d = x.replace("$1", d));
  x = d.length - z;
  let q, r;
  "object" === typeof h && (q = h.before, 0 === q && (q = -1), r = h.after, 0 === r && (r = -1), h = h.total || 9e5);
  z = new Map();
  for (let ua = 0, T, Ja, ba; ua < c.length; ua++) {
    let ca;
    if (e) {
      ca = c, ba = e;
    } else {
      var w = c[ua];
      ba = w.field;
      if (!ba) {
        continue;
      }
      ca = w.result;
    }
    Ja = b.get(ba);
    T = Ja.encoder;
    w = z.get(T);
    "string" !== typeof w && (w = T.encode(a), z.set(T, w));
    for (let ia = 0; ia < ca.length; ia++) {
      var l = ca[ia].doc;
      if (!l) {
        continue;
      }
      l = S(l, ba);
      if (!l) {
        continue;
      }
      var u = l.trim().split(/\s+/);
      if (!u.length) {
        continue;
      }
      l = "";
      var v = [];
      let ja = [];
      var E = -1, t = -1, C = 0;
      for (var y = 0; y < u.length; y++) {
        var A = u[y], H = T.encode(A);
        H = 1 < H.length ? H.join(" ") : H[0];
        let p;
        if (H && A) {
          var D = A.length, M = (T.split ? A.replace(T.split, "") : A).length - H.length, K = "", Q = 0;
          for (var U = 0; U < w.length; U++) {
            var N = w[U];
            if (N) {
              var G = N.length;
              G += M;
              Q && G <= Q || (N = H.indexOf(N), -1 < N && (K = (N ? A.substring(0, N) : "") + g + A.substring(N, N + G) + k + (N + G < D ? A.substring(N + G) : ""), Q = G, p = !0));
            }
          }
          K && (h && (0 > E && (E = l.length + (l ? 1 : 0)), t = l.length + (l ? 1 : 0) + K.length, C += D, ja.push(v.length), v.push({match:K})), l += (l ? " " : "") + K);
        }
        if (!p) {
          A = u[y], l += (l ? " " : "") + A, h && v.push({text:A});
        } else if (h && C >= h) {
          break;
        }
      }
      C = ja.length * (f.length - 2);
      if (q || r || h && l.length - C > h) {
        if (C = h + C - 2 * x, y = t - E, 0 < q && (y += q), 0 < r && (y += r), y <= C) {
          u = q ? E - (0 < q ? q : 0) : E - ((C - y) / 2 | 0), v = r ? t + (0 < r ? r : 0) : u + C, m || (0 < u && " " !== l.charAt(u) && " " !== l.charAt(u - 1) && (u = l.indexOf(" ", u), 0 > u && (u = 0)), v < l.length && " " !== l.charAt(v - 1) && " " !== l.charAt(v) && (v = l.lastIndexOf(" ", v), v < t ? v = t : ++v)), l = (u ? d : "") + l.substring(u, v) + (v < l.length ? d : "");
        } else {
          t = [];
          E = {};
          C = {};
          y = {};
          A = {};
          H = {};
          K = M = D = 0;
          for (U = Q = 1;;) {
            var O = void 0;
            for (let p = 0, F; p < ja.length; p++) {
              F = ja[p];
              if (K) {
                if (M !== K) {
                  if (y[p + 1]) {
                    continue;
                  }
                  F += K;
                  if (E[F]) {
                    D -= x;
                    C[p + 1] = 1;
                    y[p + 1] = 1;
                    continue;
                  }
                  if (F >= v.length - 1) {
                    if (F >= v.length) {
                      y[p + 1] = 1;
                      F >= u.length && (C[p + 1] = 1);
                      continue;
                    }
                    D -= x;
                  }
                  l = v[F].text;
                  if (G = r && H[p]) {
                    if (0 < G) {
                      if (l.length > G) {
                        if (y[p + 1] = 1, m) {
                          l = l.substring(0, G);
                        } else {
                          continue;
                        }
                      }
                      (G -= l.length) || (G = -1);
                      H[p] = G;
                    } else {
                      y[p + 1] = 1;
                      continue;
                    }
                  }
                  if (D + l.length + 1 <= h) {
                    l = " " + l, t[p] += l;
                  } else if (m) {
                    O = h - D - 1, 0 < O && (l = " " + l.substring(0, O), t[p] += l), y[p + 1] = 1;
                  } else {
                    y[p + 1] = 1;
                    continue;
                  }
                } else {
                  if (y[p]) {
                    continue;
                  }
                  F -= M;
                  if (E[F]) {
                    D -= x;
                    y[p] = 1;
                    C[p] = 1;
                    continue;
                  }
                  if (0 >= F) {
                    if (0 > F) {
                      y[p] = 1;
                      C[p] = 1;
                      continue;
                    }
                    D -= x;
                  }
                  l = v[F].text;
                  if (G = q && A[p]) {
                    if (0 < G) {
                      if (l.length > G) {
                        if (y[p] = 1, m) {
                          l = l.substring(l.length - G);
                        } else {
                          continue;
                        }
                      }
                      (G -= l.length) || (G = -1);
                      A[p] = G;
                    } else {
                      y[p] = 1;
                      continue;
                    }
                  }
                  if (D + l.length + 1 <= h) {
                    l += " ", t[p] = l + t[p];
                  } else if (m) {
                    O = l.length + 1 - (h - D), 0 <= O && O < l.length && (l = l.substring(O) + " ", t[p] = l + t[p]), y[p] = 1;
                  } else {
                    y[p] = 1;
                    continue;
                  }
                }
              } else {
                l = v[F].match;
                q && (A[p] = q);
                r && (H[p] = r);
                p && D++;
                let va;
                F ? !p && x && (D += x) : (C[p] = 1, y[p] = 1);
                F >= u.length - 1 ? va = 1 : F < v.length - 1 && v[F + 1].match ? va = 1 : x && (D += x);
                D -= f.length - 2;
                if (!p || D + l.length <= h) {
                  t[p] = l;
                } else {
                  O = Q = U = C[p] = 0;
                  break;
                }
                va && (C[p + 1] = 1, y[p + 1] = 1);
              }
              D += l.length;
              O = E[F] = 1;
            }
            if (O) {
              M === K ? K++ : M++;
            } else {
              M === K ? Q = 0 : U = 0;
              if (!Q && !U) {
                break;
              }
              Q ? (M++, K = M) : K++;
            }
          }
          l = "";
          for (let p = 0, F; p < t.length; p++) {
            F = (p && C[p] ? " " : (p && !d ? " " : "") + d) + t[p], l += F;
          }
          d && !C[t.length] && (l += d);
        }
      }
      n && (l = l.replace(n, " "));
      ca[ia].highlight = l;
    }
    if (e) {
      break;
    }
  }
  return c;
}
;function Ea(a, c) {
  const b = L(), e = [];
  for (let d = 0, f; d < c.length; d++) {
    f = c[d];
    for (let g = 0; g < f.length; g++) {
      b[f[g]] = 1;
    }
  }
  for (let d = 0, f; d < a.length; d++) {
    f = a[d], b[f] && (e.push(f), b[f] = 0);
  }
  return e;
}
;L();
X.prototype.search = function(a, c, b, e) {
  b || (!c && R(a) ? (b = a, a = "") : R(c) && (b = c, c = 0));
  if (b && b.cache) {
    b.cache = !1;
    var d = this.searchCache(a, c, b);
    b.cache = !0;
    return d;
  }
  let f = [];
  var g = [];
  let k, h, m;
  let n = 0, z = !0, x;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    var q = b.pluck;
    var r = b.merge;
    h = q || b.field || (h = b.index) && (h.index ? null : h);
    m = this.tag && b.tag;
    k = b.suggest;
    z = !0;
    this.store && b.highlight && !z ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && b.enrich && !z && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    x = z && this.store && b.highlight;
    d = !!x || z && this.store && b.enrich;
    c = b.limit || c;
    var w = b.offset || 0;
    c || (c = z ? 100 : 0);
    if (m) {
      m.constructor !== Array && (m = [m]);
      var l = [];
      for (let E = 0, t; E < m.length; E++) {
        t = m[E];
        if (P(t)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (t.field && t.tag) {
          var u = t.tag;
          if (u.constructor === Array) {
            for (var v = 0; v < u.length; v++) {
              l.push(t.field, u[v]);
            }
          } else {
            l.push(t.field, u);
          }
        } else {
          u = Object.keys(t);
          for (let C = 0, y, A; C < u.length; C++) {
            if (y = u[C], A = t[y], A.constructor === Array) {
              for (v = 0; v < A.length; v++) {
                l.push(y, A[v]);
              }
            } else {
              l.push(y, A);
            }
          }
        }
      }
      if (!l.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      m = l;
      if (!a) {
        g = [];
        if (l.length) {
          for (q = 0; q < l.length; q += 2) {
            r = Fa.call(this, l[q], l[q + 1], c, w, d), f.push({field:l[q], tag:l[q + 1], result:r});
          }
        }
        return g.length ? Promise.all(g).then(function(E) {
          for (let t = 0; t < E.length; t++) {
            f[t].result = E[t];
          }
          return f;
        }) : f;
      }
    }
    h && h.constructor !== Array && (h = [h]);
  }
  h || (h = this.field);
  l = !1;
  for (let E = 0, t, C, y; E < h.length; E++) {
    C = h[E];
    let A;
    P(C) || (A = C, C = A.field, a = A.query || a, c = J(A.limit, c), w = J(A.offset, w), k = J(A.suggest, k), x = z && this.store && J(A.highlight, x), d = !!x || z && this.store && J(A.enrich, d));
    if (e) {
      t = e[E];
    } else {
      if (u = A || b, v = this.index.get(C), m && (u.enrich = !1), l) {
        l[E] = v.search(a, c, u);
        u && d && (u.enrich = d);
        continue;
      } else {
        t = v.search(a, c, u), u && d && (u.enrich = d);
      }
    }
    y = t && (z ? t.length : t.result.length);
    if (m && y) {
      u = [];
      v = 0;
      for (let H = 0, D, M; H < m.length; H += 2) {
        D = this.tag.get(m[H]);
        if (!D) {
          if (console.warn("Tag '" + m[H] + ":" + m[H + 1] + "' will be skipped because there is no field '" + m[H] + "'."), k) {
            continue;
          } else {
            return f;
          }
        }
        if (M = (D = D && D.get(m[H + 1])) && D.length) {
          v++, u.push(D);
        } else if (!k) {
          return f;
        }
      }
      if (v) {
        t = Ea(t, u);
        y = t.length;
        if (!y && !k) {
          return t;
        }
        v--;
      }
    }
    if (y) {
      g[n] = C, f.push(t), n++;
    } else if (1 === h.length) {
      return f;
    }
  }
  if (l) {
    const E = this;
    return Promise.all(l).then(function(t) {
      return t.length ? E.search(a, c, b, t) : t;
    });
  }
  if (!n) {
    return f;
  }
  if (q && (!d || !this.store)) {
    return f = f[0];
  }
  l = [];
  for (w = 0; w < g.length; w++) {
    e = f[w];
    d && e.length && "undefined" === typeof e[0].doc && (e = Ga.call(this, e));
    if (q) {
      return x ? Da(a, e, this.index, q, x) : e;
    }
    f[w] = {field:g[w], result:e};
  }
  x && (f = Da(a, f, this.index, q, x));
  return r ? Ha(f) : f;
};
function Ha(a) {
  const c = [], b = L(), e = L();
  for (let d = 0, f, g, k, h, m, n, z; d < a.length; d++) {
    f = a[d];
    g = f.field;
    k = f.result;
    for (let x = 0; x < k.length; x++) {
      if (m = k[x], "object" !== typeof m ? m = {id:h = m} : h = m.id, (n = b[h]) ? n.push(g) : (m.field = b[h] = [g], c.push(m)), z = m.highlight) {
        n = e[h], n || (e[h] = n = {}, m.highlight = n), n[g] = z;
      }
    }
  }
  return c;
}
function Fa(a, c, b, e, d) {
  a = this.tag.get(a);
  if (!a) {
    return [];
  }
  a = a.get(c);
  if (!a) {
    return [];
  }
  c = a.length - e;
  if (0 < c) {
    if (b && c > b || e) {
      a = a.slice(e, e + b);
    }
    d && (a = Ga.call(this, a));
  }
  return a;
}
function Ga(a) {
  if (!this || !this.store) {
    return a;
  }
  const c = Array(a.length);
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c[b] = {id:e, doc:this.store.get(e)};
  }
  return c;
}
;const Ia = {normalize:!1, numeric:!1, dedupe:!1};
const Ka = {};
const La = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const Ma = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Na = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const Oa = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var Pa = {Exact:Ia, Default:Ka, Normalize:Ka, LatinBalance:{mapper:La}, LatinAdvanced:{mapper:La, matcher:Ma, replacer:Na}, LatinExtra:{mapper:La, replacer:Na.concat([/(?!^)[aeo]/g, ""]), matcher:Ma}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let e = c.charAt(0), d = Oa[e];
    for (let f = 1, g; f < c.length && (g = c.charAt(f), "h" === g || "w" === g || !(g = Oa[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[b] = e;
  }
}}, CJK:{split:""}, LatinExact:Ia, LatinDefault:Ka, LatinSimple:Ka};
function X(a) {
  if (!this || this.constructor !== X) {
    return new X(a);
  }
  const c = a.document || a.doc || a;
  var b;
  this.D = [];
  this.field = [];
  this.J = [];
  this.key = (b = c.key || c.id) && Qa(b, this.J) || "id";
  this.reg = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.A = (b = c.store || null) && b && !0 !== b && [];
  this.store = b && new Map();
  this.cache = (b = a.cache || null) && new Y(b);
  a.cache = !1;
  this.priority = a.priority || 4;
  b = new Map();
  let e = c.index || c.field || c;
  P(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d], P(f) || (g = f, f = f.field), g = R(g) ? Object.assign({}, a, g) : a, b.set(f, new Z(g, this.reg)), g.custom ? this.D[d] = g.custom : (this.D[d] = Qa(f, this.J), g.filter && ("string" === typeof this.D[d] && (this.D[d] = new String(this.D[d])), this.D[d].I = g.filter)), this.field[d] = f;
  }
  if (this.A) {
    a = c.store;
    P(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.custom ? (this.A[d] = f.custom, f.custom.S = g) : (this.A[d] = Qa(g, this.J), f.filter && ("string" === typeof this.A[d] && (this.A[d] = new String(this.A[d])), this.A[d].I = f.filter));
    }
  }
  this.index = b;
  this.tag = null;
  if (b = c.tag) {
    if ("string" === typeof b && (b = [b]), b.length) {
      this.tag = new Map();
      this.B = [];
      this.R = [];
      for (let d = 0, f, g; d < b.length; d++) {
        f = b[d];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.B[d] = f.custom : (this.B[d] = Qa(g, this.J), f.filter && ("string" === typeof this.B[d] && (this.B[d] = new String(this.B[d])), this.B[d].I = f.filter));
        this.R[d] = g;
        this.tag.set(g, new Map());
      }
    }
  }
}
function Qa(a, c) {
  const b = a.split(":");
  let e = 0;
  for (let d = 0; d < b.length; d++) {
    a = b[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (c[e] = !0), a && (b[e++] = a);
  }
  e < b.length && (b.length = e);
  return 1 < e ? b : b[0];
}
B = X.prototype;
B.append = function(a, c) {
  return this.add(a, c, !0);
};
B.update = function(a, c) {
  return this.remove(a).add(a, c);
};
B.remove = function(a) {
  R(a) && (a = S(a, this.key));
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
B.clear = function() {
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
B.contain = function(a) {
  return this.reg.has(a);
};
B.cleanup = function() {
  for (const a of this.index.values()) {
    a.cleanup();
  }
  return this;
};
B.get = function(a) {
  return this.store.get(a) || null;
};
B.set = function(a, c) {
  "object" === typeof a && (c = a, a = S(c, this.key));
  this.store.set(a, c);
  return this;
};
B.searchCache = Ra;
B.export = function(a, c, b = 0, e = 0) {
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
      f = wa(this.reg);
      c = null;
      break;
    case 1:
      d = "tag";
      f = this.tag && sa(this.tag, this.reg.size);
      c = null;
      break;
    case 2:
      d = "doc";
      f = this.store && qa(this.store);
      c = null;
      break;
    default:
      return;
  }
  return ya.call(this, a, c, d, f, b, e);
};
B.import = function(a, c) {
  var b = a.split(".");
  "json" === b[b.length - 1] && b.pop();
  a = 2 < b.length ? b[0] : "";
  b = 2 < b.length ? b[2] : b[1];
  if (c) {
    "string" === typeof c && (c = JSON.parse(c));
    if (a) {
      return this.index.get(a).import(b, c);
    }
    switch(b) {
      case "reg":
        this.fastupdate = !1;
        this.reg = xa(c, this.reg);
        for (let e = 0, d; e < this.field.length; e++) {
          d = this.index.get(this.field[e]), d.fastupdate = !1, d.reg = this.reg;
        }
        break;
      case "tag":
        this.tag = ta(c, this.tag);
        break;
      case "doc":
        this.store = ra(c, this.store);
    }
  }
};
la(X.prototype);
function Ra(a, c, b) {
  const e = (c ? "" + a : "object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new Y());
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
function Y(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
Y.prototype.set = function(a, c) {
  this.cache.set(this.h = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
Y.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
  return c;
};
Y.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
Y.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
Z.prototype.remove = function(a, c) {
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
      Sa(this.map, a), this.depth && Sa(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function Sa(a, c) {
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
      const f = Sa(d[1], c);
      f ? b += f : a.delete(e);
    }
  }
  return b;
}
;const Ta = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
Z.prototype.add = function(a, c, b, e) {
  if (c && (a || 0 === a)) {
    if (!e && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    e = this.depth;
    c = this.encoder.encode(c, !e);
    const m = c.length;
    if (m) {
      const n = L(), z = L(), x = this.resolution;
      for (let q = 0; q < m; q++) {
        let r = c[this.rtl ? m - 1 - q : q];
        var d = r.length;
        if (d && (e || !z[r])) {
          var f = this.score ? this.score(c, r, q, null, 0) : Ua(x, m, q), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (let w = 0, l; w < d; w++) {
                  for (f = d; f > w; f--) {
                    g = r.substring(w, f);
                    l = this.rtl ? d - 1 - w : w;
                    var k = this.score ? this.score(c, r, q, g, l) : Ua(x, m, q, d, l);
                    Va(this, z, g, k, a, b);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < d) {
                for (k = d - 1; 0 < k; k--) {
                  g = r[this.rtl ? d - 1 - k : k] + g;
                  var h = this.score ? this.score(c, r, q, g, k) : Ua(x, m, q, d, k);
                  Va(this, z, g, h, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (k = 0; k < d; k++) {
                  g += r[this.rtl ? d - 1 - k : k], Va(this, z, g, f, a, b);
                }
                break;
              }
            default:
              if (Va(this, z, r, f, a, b), e && 1 < m && q < m - 1) {
                for (d = L(), g = this.P, f = r, k = Math.min(e + 1, this.rtl ? q + 1 : m - q), d[f] = 1, h = 1; h < k; h++) {
                  if ((r = c[this.rtl ? m - 1 - q - h : q + h]) && !d[r]) {
                    d[r] = 1;
                    const w = this.score ? this.score(c, f, q, r, h - 1) : Ua(g + (m / 2 > g ? 0 : 1), m, q, k - 1, h - 1), l = this.bidirectional && r > f;
                    Va(this, n, l ? f : r, w, a, b, l ? r : f);
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
function Va(a, c, b, e, d, f, g) {
  let k = g ? a.ctx : a.map, h;
  if (!c[b] || g && !(h = c[b])[g]) {
    g ? (c = h || (c[b] = L()), c[g] = 1, (h = k.get(g)) ? k = h : k.set(g, k = new Map())) : c[b] = 1, (h = k.get(b)) ? k = h : k.set(b, k = []), k = k[e] || (k[e] = []), f && k.includes(d) || (k.push(d), a.fastupdate && ((c = a.reg.get(d)) ? c.push(k) : a.reg.set(d, [k])));
  }
}
function Ua(a, c, b, e, d) {
  return b && 1 < a ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;Z.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  if (b && b.cache) {
    return b.cache = !1, c = this.searchCache(a, c, b), b.cache = !0, c;
  }
  var e = [], d = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    d = b.offset || 0;
    var f = b.context;
    var g = b.suggest;
    var k = !0;
    var h = b.resolution;
  }
  "undefined" === typeof k && (k = !0);
  f = this.depth && !1 !== f;
  b = this.encoder.encode(a, !f);
  a = b.length;
  c = c || (k ? 100 : 0);
  if (1 === a) {
    return g = d, (d = Wa(this, b[0], "")) && d.length ? Ca.call(this, d, c, g) : [];
  }
  if (2 === a && f && !g) {
    return g = d, (d = Wa(this, b[1], b[0])) && d.length ? Ca.call(this, d, c, g) : [];
  }
  k = L();
  var m = 0;
  if (f) {
    var n = b[0];
    m = 1;
  }
  h || 0 === h || (h = n ? this.P : this.resolution);
  for (let r, w; m < a; m++) {
    if ((w = b[m]) && !k[w]) {
      k[w] = 1;
      r = Wa(this, w, n);
      a: {
        f = r;
        var z = e, x = g, q = h;
        let l = [];
        if (f && f.length) {
          if (f.length <= q) {
            z.push(f);
            r = void 0;
            break a;
          }
          for (let u = 0, v; u < q; u++) {
            if (v = f[u]) {
              l[u] = v;
            }
          }
          if (l.length) {
            z.push(l);
            r = void 0;
            break a;
          }
        }
        r = x ? void 0 : l;
      }
      if (r) {
        e = r;
        break;
      }
      n && (g && r && e.length || (n = w));
    }
    g && n && m === a - 1 && !e.length && (h = this.resolution, n = "", m = -1, k = L());
  }
  a: {
    b = e;
    e = b.length;
    n = b;
    if (1 < e) {
      b: {
        e = g;
        n = b.length;
        g = [];
        a = L();
        for (let r = 0, w, l, u, v; r < h; r++) {
          for (m = 0; m < n; m++) {
            if (u = b[m], r < u.length && (w = u[r])) {
              for (f = 0; f < w.length; f++) {
                if (l = w[f], (k = a[l]) ? a[l]++ : (k = 0, a[l] = 1), v = g[k] || (g[k] = []), v.push(l), c && k === n - 1 && v.length - d === c) {
                  n = d ? v.slice(d) : v;
                  break b;
                }
              }
            }
          }
        }
        if (b = g.length) {
          if (e) {
            if (1 < g.length) {
              c: {
                for (b = [], h = L(), e = g.length, k = e - 1; 0 <= k; k--) {
                  if (a = (e = g[k]) && e.length) {
                    for (m = 0; m < a; m++) {
                      if (n = e[m], !h[n]) {
                        if (h[n] = 1, d) {
                          d--;
                        } else {
                          if (b.push(n), b.length === c) {
                            break c;
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              b = (g = g[0]).length > c || d ? g.slice(d, c + d) : g;
            }
            g = b;
          } else {
            if (b < n) {
              n = [];
              break b;
            }
            g = g[b - 1];
            if (c || d) {
              if (g.length > c || d) {
                g = g.slice(d, c + d);
              }
            }
          }
        }
        n = g;
      }
    } else if (1 === e) {
      c = Ca.call(null, b[0], c, d);
      break a;
    }
    c = n;
  }
  return c;
};
function Wa(a, c, b) {
  let e;
  b && (e = a.bidirectional && c > b) && (e = b, b = c, c = e);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;function Z(a, c) {
  if (!this || this.constructor !== Z) {
    return new Z(a);
  }
  if (a) {
    var b = P(a) ? a : a.preset;
    b && (Ta[b] || console.warn("Preset not found: " + b), a = Object.assign({}, Ta[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const e = !0 === b ? {depth:1} : b || {}, d = P(a.encoder) ? Pa[a.encoder] : a.encode || a.encoder || {};
  this.encoder = d.encode ? d : "object" === typeof d ? new ka(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && "default" !== b && "exact" !== b && b || "strict";
  this.depth = "strict" === b && e.depth || 0;
  this.bidirectional = !1 !== e.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e && e.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  b = !1;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.P = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (b = a.cache || null) && new Y(b);
  this.priority = a.priority || 4;
}
B = Z.prototype;
B.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  return this;
};
B.append = function(a, c) {
  return this.add(a, c, !0);
};
B.contain = function(a) {
  return this.reg.has(a);
};
B.update = function(a, c) {
  const b = this, e = this.remove(a);
  return e && e.then ? e.then(() => b.add(a, c)) : this.add(a, c);
};
B.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Sa(this.map);
  this.depth && Sa(this.ctx);
  return this;
};
B.searchCache = Ra;
B.export = function(a, c, b = 0, e = 0) {
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = wa(this.reg);
      break;
    case 1:
      d = "cfg";
      f = null;
      break;
    case 2:
      d = "map";
      f = qa(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      f = sa(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return ya.call(this, a, c, d, f, b, e);
};
B.import = function(a, c) {
  if (c) {
    switch("string" === typeof c && (c = JSON.parse(c)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = xa(c, this.reg);
        break;
      case "map":
        this.map = ra(c, this.map);
        break;
      case "ctx":
        this.ctx = ta(c, this.ctx);
    }
  }
};
B.serialize = function(a = !0) {
  let c = "", b = "", e = "";
  if (this.reg.size) {
    let f;
    for (var d of this.reg.keys()) {
      f || (f = typeof d), c += (c ? "," : "") + ("string" === f ? '"' + d + '"' : d);
    }
    c = "index.reg=new Set([" + c + "]);";
    b = za(this.map, f);
    b = "index.map=new Map([" + b + "]);";
    for (const g of this.ctx.entries()) {
      d = g[0];
      let k = za(g[1], f);
      k = "new Map([" + k + "])";
      k = '["' + d + '",' + k + "]";
      e += (e ? "," : "") + k;
    }
    e = "index.ctx=new Map([" + e + "]);";
  }
  return a ? "function inject(index){" + c + b + e + "}" : c + b + e;
};
la(Z.prototype);
L();
const Xa = {Index:Z, Charset:Pa, Encoder:ka, Document:X, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, Ya = "undefined" !== typeof self ? self : "undefined" !== typeof global ? global : self;
let Za;
(Za = Ya.define) && Za.amd ? Za([], function() {
  return Xa;
}) : "object" === typeof Ya.exports ? Ya.exports = Xa : Ya.FlexSearch = Xa;
}(this||self));
