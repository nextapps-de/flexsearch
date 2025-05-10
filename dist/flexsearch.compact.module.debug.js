/**!
 * FlexSearch.js v0.8.163 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var A;
function I(a, c, b) {
  const f = typeof b, d = typeof a;
  if ("undefined" !== f) {
    if ("undefined" !== d) {
      if (b) {
        if ("function" === d && f === d) {
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
            var e = new Map(b);
            for (var g of a) {
              e.set(g[0], g[1]);
            }
            return e;
          }
          if (c === Set) {
            g = new Set(b);
            for (e of a.values()) {
              g.add(e);
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
function J() {
  return Object.create(null);
}
function L(a) {
  return "string" === typeof a;
}
function P(a) {
  return "object" === typeof a;
}
function R(a, c) {
  if (L(c)) {
    a = a[c];
  } else {
    for (let b = 0; a && b < c.length; b++) {
      a = a[c[b]];
    }
  }
  return a;
}
;const ca = /[^\p{L}\p{N}]+/u, da = /(\d{3})/g, ea = /(\D)(\d{3})/g, fa = /(\d{3})(\D)/g, ha = /[\u0300-\u036f]/g;
function S(a = {}) {
  if (!this || this.constructor !== S) {
    return new S(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
A = S.prototype;
A.assign = function(a) {
  this.normalize = I(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split, f;
  if (b || "" === b) {
    if ("object" === typeof b && b.constructor !== RegExp) {
      let d = "";
      f = !c;
      c || (d += "\\p{Z}");
      b.letter && (d += "\\p{L}");
      b.number && (d += "\\p{N}", f = !!c);
      b.symbol && (d += "\\p{S}");
      b.punctuation && (d += "\\p{P}");
      b.control && (d += "\\p{C}");
      if (b = b.char) {
        d += "object" === typeof b ? b.join("") : b;
      }
      try {
        this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
      } catch (e) {
        console.error("Your split configuration:", b, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = b, f = !1 === b || 2 > "a1a".split(b).length;
    }
    this.numeric = I(a.numeric, f);
  } else {
    try {
      this.split = I(this.split, ca);
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
A.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.C += (this.C ? "|" : "") + a;
  this.N = null;
  this.cache && V(this);
  return this;
};
A.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && V(this);
  return this;
};
A.addMapper = function(a, c) {
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
A.addMatcher = function(a, c) {
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
A.addReplacer = function(a, c) {
  if ("string" === typeof a) {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && V(this);
  return this;
};
A.encode = function(a, c) {
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
  let f = [], d = J(), e, g, k = this.split || "" === this.split ? a.split(this.split) : [a];
  for (let m = 0, n, B; m < k.length; m++) {
    if ((n = B = k[m]) && !(n.length < this.minlength || n.length > this.maxlength)) {
      if (c) {
        if (d[n]) {
          continue;
        }
        d[n] = 1;
      } else {
        if (e === n) {
          continue;
        }
        e = n;
      }
      if (b) {
        f.push(n);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(n) : !this.filter.has(n))) {
          if (this.cache && n.length <= this.L) {
            if (this.H) {
              var h = this.G.get(n);
              if (h || "" === h) {
                h && f.push(h);
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
          this.cache && B.length <= this.L && (this.G.set(B, n), this.G.size > this.O && (this.G.clear(), this.L = this.L / 1.1 | 0));
          if (n) {
            if (n !== B) {
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
            f.push(n);
          }
        }
      }
    }
  }
  this.finalize && (f = this.finalize(f) || f);
  this.cache && a.length <= this.K && (this.F.set(a, f), this.F.size > this.O && (this.F.clear(), this.K = this.K / 1.1 | 0));
  return f;
};
function V(a) {
  a.H = null;
  a.F.clear();
  a.G.clear();
}
;function ka(a) {
  W.call(a, "add");
  W.call(a, "append");
  W.call(a, "search");
  W.call(a, "update");
  W.call(a, "remove");
  W.call(a, "searchCache");
}
let la, ma, na;
function oa() {
  la = na = 0;
}
function W(a) {
  this[a + "Async"] = function() {
    const c = arguments;
    var b = c[c.length - 1];
    let f;
    "function" === typeof b && (f = b, delete c[c.length - 1]);
    la ? na || (na = Date.now() - ma >= this.priority * this.priority * 3) : (la = setTimeout(oa, 0), ma = Date.now());
    if (na) {
      const e = this;
      return new Promise(g => {
        setTimeout(function() {
          g(e[a + "Async"].apply(e, c));
        }, 0);
      });
    }
    const d = this[a].apply(this, c);
    b = d.then ? d : new Promise(e => e(d));
    f && b.then(f);
    return b;
  };
}
;function pa(a, c = 0) {
  let b = [], f = [];
  c && (c = 250000 / c * 5000 | 0);
  for (const d of a.entries()) {
    f.push(d), f.length === c && (b.push(f), f = []);
  }
  f.length && b.push(f);
  return b;
}
function qa(a, c) {
  c || (c = new Map());
  for (let b = 0, f; b < a.length; b++) {
    f = a[b], c.set(f[0], f[1]);
  }
  return c;
}
function ra(a, c = 0) {
  let b = [], f = [];
  c && (c = 250000 / c * 1000 | 0);
  for (const d of a.entries()) {
    f.push([d[0], pa(d[1])[0]]), f.length === c && (b.push(f), f = []);
  }
  f.length && b.push(f);
  return b;
}
function sa(a, c) {
  c || (c = new Map());
  for (let b = 0, f, d; b < a.length; b++) {
    f = a[b], d = c.get(f[0]), c.set(f[0], qa(f[1], d));
  }
  return c;
}
function va(a) {
  let c = [], b = [];
  for (const f of a.keys()) {
    b.push(f), 250000 === b.length && (c.push(b), b = []);
  }
  b.length && c.push(b);
  return c;
}
function wa(a, c) {
  c || (c = new Set());
  for (let b = 0; b < a.length; b++) {
    c.add(a[b]);
  }
  return c;
}
function xa(a, c, b, f, d, e, g = 0) {
  const k = f && f.constructor === Array;
  var h = k ? f.shift() : f;
  if (!h) {
    return this.export(a, c, d, e + 1);
  }
  if ((h = a((c ? c + "." : "") + (g + 1) + "." + b, JSON.stringify(h))) && h.then) {
    const m = this;
    return h.then(function() {
      return xa.call(m, a, c, b, k ? f : null, d, e, g + 1);
    });
  }
  return xa.call(this, a, c, b, k ? f : null, d, e, g + 1);
}
function ya(a, c) {
  let b = "";
  for (const f of a.entries()) {
    a = f[0];
    const d = f[1];
    let e = "";
    for (let g = 0, k; g < d.length; g++) {
      k = d[g] || [""];
      let h = "";
      for (let m = 0; m < k.length; m++) {
        h += (h ? "," : "") + ("string" === c ? '"' + k[m] + '"' : k[m]);
      }
      h = "[" + h + "]";
      e += (e ? "," : "") + h;
    }
    e = '["' + a + '",[' + e + "]]";
    b += (b ? "," : "") + e;
  }
  return b;
}
;X.prototype.add = function(a, c, b) {
  P(a) && (c = a, a = R(c, this.key));
  if (c && (a || 0 === a)) {
    if (!b && this.reg.has(a)) {
      return this.update(a, c);
    }
    for (let k = 0, h; k < this.field.length; k++) {
      h = this.D[k];
      var f = this.index.get(this.field[k]);
      if ("function" === typeof h) {
        var d = h(c);
        d && f.add(a, d, !1, !0);
      } else {
        if (d = h.I, !d || d(c)) {
          h.constructor === String ? h = ["" + h] : L(h) && (h = [h]), za(c, h, this.J, 0, f, a, h[0], b);
        }
      }
    }
    if (this.tag) {
      for (f = 0; f < this.B.length; f++) {
        var e = this.B[f], g = this.R[f];
        d = this.tag.get(g);
        let k = J();
        if ("function" === typeof e) {
          if (e = e(c), !e) {
            continue;
          }
        } else {
          const h = e.I;
          if (h && !h(c)) {
            continue;
          }
          e.constructor === String && (e = "" + e);
          e = R(c, e);
        }
        if (d && e) {
          L(e) && (e = [e]);
          for (let h = 0, m, n; h < e.length; h++) {
            m = e[h], k[m] || (k[m] = 1, (g = d.get(m)) ? n = g : d.set(m, n = []), b && n.includes(a) || (n.push(a), this.fastupdate && ((g = this.reg.get(a)) ? g.push(n) : this.reg.set(a, [n]))));
          }
        } else {
          d || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!b || !this.store.has(a))) {
      let k;
      if (this.A) {
        k = J();
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
          } else if (L(m) || m.constructor === String) {
            k[m] = c[m];
            continue;
          }
          Aa(c, k, m, 0, m[0], n);
        }
      }
      this.store.set(a, k || c);
    }
  }
  return this;
};
function Aa(a, c, b, f, d, e) {
  a = a[d];
  if (f === b.length - 1) {
    c[d] = e || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (c = c[d] = Array(a.length), d = 0; d < a.length; d++) {
        Aa(a, c, b, f, d);
      }
    } else {
      c = c[d] || (c[d] = J()), d = b[++f], Aa(a, c, b, f, d);
    }
  }
}
function za(a, c, b, f, d, e, g, k) {
  if (a = a[g]) {
    if (f === c.length - 1) {
      if (a.constructor === Array) {
        if (b[f]) {
          for (c = 0; c < a.length; c++) {
            d.add(e, a[c], !0, !0);
          }
          return;
        }
        a = a.join(" ");
      }
      d.add(e, a, k, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          za(a, c, b, f, d, e, g, k);
        }
      } else {
        g = c[++f], za(a, c, b, f, d, e, g, k);
      }
    }
  }
}
;function Ba(a, c) {
  const b = J(), f = [];
  for (let d = 0, e; d < c.length; d++) {
    e = c[d];
    for (let g = 0; g < e.length; g++) {
      b[e[g]] = 1;
    }
  }
  for (let d = 0, e; d < a.length; d++) {
    e = a[d], b[e] && (f.push(e), b[e] = 0);
  }
  return f;
}
;function Ca(a, c, b) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a;
  }
  let f = [];
  for (let d = 0, e, g; d < a.length; d++) {
    if ((e = a[d]) && (g = e.length)) {
      if (b) {
        if (b >= g) {
          b -= g;
          continue;
        }
        b < g && (e = c ? e.slice(b, b + c) : e.slice(b), g = e.length, b = 0);
      }
      g > c && (e = e.slice(0, c), g = c);
      if (!f.length && g >= c) {
        return e;
      }
      f.push(e);
      c -= g;
      if (!c) {
        break;
      }
    }
  }
  return f = 1 < f.length ? [].concat.apply([], f) : f[0];
}
;function Da(a, c, b, f, d) {
  let e, g, k;
  "string" === typeof d ? (e = d, d = "") : e = d.template;
  if (!e) {
    throw Error('No template pattern was specified by the search option "highlight"');
  }
  g = e.indexOf("$1");
  if (-1 === g) {
    throw Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + e);
  }
  k = e.substring(g + 2);
  g = e.substring(0, g);
  let h = d && d.boundary, m = !d || !1 !== d.clip, n = d && d.merge && k && g && new RegExp(k + " " + g, "g");
  d = d && d.ellipsis;
  var B = 0;
  if ("object" === typeof d) {
    var x = d.template;
    B = x.length - 2;
    d = d.pattern;
  }
  "string" !== typeof d && (d = !1 === d ? "" : "...");
  B && (d = x.replace("$1", d));
  x = d.length - B;
  let q, r;
  "object" === typeof h && (q = h.before, 0 === q && (q = -1), r = h.after, 0 === r && (r = -1), h = h.total || 9e5);
  B = new Map();
  for (let ta = 0, T, Ga, aa; ta < c.length; ta++) {
    let ba;
    if (f) {
      ba = c, aa = f;
    } else {
      var w = c[ta];
      aa = w.field;
      if (!aa) {
        continue;
      }
      ba = w.result;
    }
    Ga = b.get(aa);
    T = Ga.encoder;
    w = B.get(T);
    "string" !== typeof w && (w = T.encode(a), B.set(T, w));
    for (let ia = 0; ia < ba.length; ia++) {
      var l = ba[ia].doc;
      if (!l) {
        continue;
      }
      l = R(l, aa);
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
        var z = u[y], H = T.encode(z);
        H = 1 < H.length ? H.join(" ") : H[0];
        let p;
        if (H && z) {
          var D = z.length, M = (T.split ? z.replace(T.split, "") : z).length - H.length, K = "", Q = 0;
          for (var U = 0; U < w.length; U++) {
            var N = w[U];
            if (N) {
              var G = N.length;
              G += M;
              Q && G <= Q || (N = H.indexOf(N), -1 < N && (K = (N ? z.substring(0, N) : "") + g + z.substring(N, N + G) + k + (N + G < D ? z.substring(N + G) : ""), Q = G, p = !0));
            }
          }
          K && (h && (0 > E && (E = l.length + (l ? 1 : 0)), t = l.length + (l ? 1 : 0) + K.length, C += D, ja.push(v.length), v.push({match:K})), l += (l ? " " : "") + K);
        }
        if (!p) {
          z = u[y], l += (l ? " " : "") + z, h && v.push({text:z});
        } else if (h && C >= h) {
          break;
        }
      }
      C = ja.length * (e.length - 2);
      if (q || r || h && l.length - C > h) {
        if (C = h + C - 2 * x, y = t - E, 0 < q && (y += q), 0 < r && (y += r), y <= C) {
          u = q ? E - (0 < q ? q : 0) : E - ((C - y) / 2 | 0), v = r ? t + (0 < r ? r : 0) : u + C, m || (0 < u && " " !== l.charAt(u) && " " !== l.charAt(u - 1) && (u = l.indexOf(" ", u), 0 > u && (u = 0)), v < l.length && " " !== l.charAt(v - 1) && " " !== l.charAt(v) && (v = l.lastIndexOf(" ", v), v < t ? v = t : ++v)), l = (u ? d : "") + l.substring(u, v) + (v < l.length ? d : "");
        } else {
          t = [];
          E = {};
          C = {};
          y = {};
          z = {};
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
                  if (G = q && z[p]) {
                    if (0 < G) {
                      if (l.length > G) {
                        if (y[p] = 1, m) {
                          l = l.substring(l.length - G);
                        } else {
                          continue;
                        }
                      }
                      (G -= l.length) || (G = -1);
                      z[p] = G;
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
                q && (z[p] = q);
                r && (H[p] = r);
                p && D++;
                let ua;
                F ? !p && x && (D += x) : (C[p] = 1, y[p] = 1);
                F >= u.length - 1 ? ua = 1 : F < v.length - 1 && v[F + 1].match ? ua = 1 : x && (D += x);
                D -= e.length - 2;
                if (!p || D + l.length <= h) {
                  t[p] = l;
                } else {
                  O = Q = U = C[p] = 0;
                  break;
                }
                ua && (C[p + 1] = 1, y[p + 1] = 1);
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
      ba[ia].highlight = l;
    }
    if (f) {
      break;
    }
  }
  return c;
}
;J();
X.prototype.search = function(a, c, b, f) {
  b || (!c && P(a) ? (b = a, a = "") : P(c) && (b = c, c = 0));
  if (b && b.cache) {
    b.cache = !1;
    var d = this.searchCache(a, c, b);
    b.cache = !0;
    return d;
  }
  let e = [];
  var g = [];
  let k, h, m;
  let n = 0, B = !0, x;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    var q = b.pluck;
    var r = b.merge;
    h = q || b.field || (h = b.index) && (h.index ? null : h);
    m = this.tag && b.tag;
    k = b.suggest;
    B = !0;
    this.store && b.highlight && !B ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && b.enrich && !B && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    x = B && this.store && b.highlight;
    d = !!x || B && this.store && b.enrich;
    c = b.limit || c;
    var w = b.offset || 0;
    c || (c = 100);
    if (m) {
      m.constructor !== Array && (m = [m]);
      var l = [];
      for (let E = 0, t; E < m.length; E++) {
        t = m[E];
        if (L(t)) {
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
          for (let C = 0, y, z; C < u.length; C++) {
            if (y = u[C], z = t[y], z.constructor === Array) {
              for (v = 0; v < z.length; v++) {
                l.push(y, z[v]);
              }
            } else {
              l.push(y, z);
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
            r = Ea.call(this, l[q], l[q + 1], c, w, d), e.push({field:l[q], tag:l[q + 1], result:r});
          }
        }
        return g.length ? Promise.all(g).then(function(E) {
          for (let t = 0; t < E.length; t++) {
            e[t].result = E[t];
          }
          return e;
        }) : e;
      }
    }
    h && h.constructor !== Array && (h = [h]);
  }
  h || (h = this.field);
  l = !1;
  for (let E = 0, t, C, y; E < h.length; E++) {
    C = h[E];
    let z;
    L(C) || (z = C, C = z.field, a = z.query || a, c = Fa(z.limit, c), w = Fa(z.offset, w), k = Fa(z.suggest, k), x = B && this.store && Fa(z.highlight, x), d = !!x || B && this.store && Fa(z.enrich, d));
    if (f) {
      t = f[E];
    } else {
      if (u = z || b, v = this.index.get(C), m && (u.enrich = !1), l) {
        l[E] = v.search(a, c, u);
        u && d && (u.enrich = d);
        continue;
      } else {
        t = v.search(a, c, u), u && d && (u.enrich = d);
      }
    }
    y = t && (B ? t.length : t.result.length);
    if (m && y) {
      u = [];
      v = 0;
      for (let H = 0, D, M; H < m.length; H += 2) {
        D = this.tag.get(m[H]);
        if (!D) {
          if (console.warn("Tag '" + m[H] + ":" + m[H + 1] + "' will be skipped because there is no field '" + m[H] + "'."), k) {
            continue;
          } else {
            return e;
          }
        }
        if (M = (D = D && D.get(m[H + 1])) && D.length) {
          v++, u.push(D);
        } else if (!k) {
          return e;
        }
      }
      if (v) {
        t = Ba(t, u);
        y = t.length;
        if (!y && !k) {
          return t;
        }
        v--;
      }
    }
    if (y) {
      g[n] = C, e.push(t), n++;
    } else if (1 === h.length) {
      return e;
    }
  }
  if (l) {
    const E = this;
    return Promise.all(l).then(function(t) {
      return t.length ? E.search(a, c, b, t) : t;
    });
  }
  if (!n) {
    return e;
  }
  if (q && (!d || !this.store)) {
    return e = e[0], B || (e.index = this), e;
  }
  l = [];
  for (w = 0; w < g.length; w++) {
    f = e[w];
    d && f.length && "undefined" === typeof f[0].doc && (f = Ha.call(this, f));
    if (q) {
      return x ? Da(a, f, this.index, q, x) : f;
    }
    e[w] = {field:g[w], result:f};
  }
  return r ? Ia(e) : x ? Da(a, e, this.index, q, x) : e;
};
function Fa(a, c) {
  return "undefined" === typeof a ? c : a;
}
function Ia(a) {
  const c = [], b = J();
  for (let f = 0, d, e; f < a.length; f++) {
    d = a[f];
    e = d.result;
    for (let g = 0, k, h, m; g < e.length; g++) {
      h = e[g], "object" !== typeof h && (h = {id:h}), k = h.id, (m = b[k]) ? m.push(d.field) : (h.field = b[k] = [d.field], c.push(h));
    }
  }
  return c;
}
function Ea(a, c, b, f, d) {
  let e = this.tag.get(a);
  if (!e) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (e = e && e.get(c)) && e.length - f) && 0 < a) {
    if (a > b || f) {
      e = e.slice(f, f + b);
    }
    d && (e = Ha.call(this, e));
    return e;
  }
}
function Ha(a) {
  if (!this || !this.store) {
    return a;
  }
  const c = Array(a.length);
  for (let b = 0, f; b < a.length; b++) {
    f = a[b], c[b] = {id:f, doc:this.store.get(f)};
  }
  return c;
}
;function X(a) {
  if (!this || this.constructor !== X) {
    return new X(a);
  }
  const c = a.document || a.doc || a;
  var b;
  this.D = [];
  this.field = [];
  this.J = [];
  this.key = (b = c.key || c.id) && Ja(b, this.J) || "id";
  this.reg = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.A = (b = c.store || null) && b && !0 !== b && [];
  this.store = b && new Map();
  this.cache = (b = a.cache || null) && new Y(b);
  a.cache = !1;
  this.priority = a.priority || 4;
  b = new Map();
  let f = c.index || c.field || c;
  L(f) && (f = [f]);
  for (let d = 0, e, g; d < f.length; d++) {
    e = f[d], L(e) || (g = e, e = e.field), g = P(g) ? Object.assign({}, a, g) : a, b.set(e, new Z(g, this.reg)), g.custom ? this.D[d] = g.custom : (this.D[d] = Ja(e, this.J), g.filter && ("string" === typeof this.D[d] && (this.D[d] = new String(this.D[d])), this.D[d].I = g.filter)), this.field[d] = e;
  }
  if (this.A) {
    a = c.store;
    L(a) && (a = [a]);
    for (let d = 0, e, g; d < a.length; d++) {
      e = a[d], g = e.field || e, e.custom ? (this.A[d] = e.custom, e.custom.S = g) : (this.A[d] = Ja(g, this.J), e.filter && ("string" === typeof this.A[d] && (this.A[d] = new String(this.A[d])), this.A[d].I = e.filter));
    }
  }
  this.index = b;
  this.tag = null;
  if (b = c.tag) {
    if ("string" === typeof b && (b = [b]), b.length) {
      this.tag = new Map();
      this.B = [];
      this.R = [];
      for (let d = 0, e, g; d < b.length; d++) {
        e = b[d];
        g = e.field || e;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        e.custom ? this.B[d] = e.custom : (this.B[d] = Ja(g, this.J), e.filter && ("string" === typeof this.B[d] && (this.B[d] = new String(this.B[d])), this.B[d].I = e.filter));
        this.R[d] = g;
        this.tag.set(g, new Map());
      }
    }
  }
}
function Ja(a, c) {
  const b = a.split(":");
  let f = 0;
  for (let d = 0; d < b.length; d++) {
    a = b[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (c[f] = !0), a && (b[f++] = a);
  }
  f < b.length && (b.length = f);
  return 1 < f ? b : b[0];
}
A = X.prototype;
A.append = function(a, c) {
  return this.add(a, c, !0);
};
A.update = function(a, c) {
  return this.remove(a).add(a, c);
};
A.remove = function(a) {
  P(a) && (a = R(a, this.key));
  for (var c of this.index.values()) {
    c.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (let b of this.tag.values()) {
        for (let f of b) {
          c = f[0];
          const d = f[1], e = d.indexOf(a);
          -1 < e && (1 < d.length ? d.splice(e, 1) : b.delete(c));
        }
      }
    }
    this.store && this.store.delete(a);
    this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
A.clear = function() {
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
A.contain = function(a) {
  return this.reg.has(a);
};
A.cleanup = function() {
  for (const a of this.index.values()) {
    a.cleanup();
  }
  return this;
};
A.get = function(a) {
  return this.store.get(a) || null;
};
A.set = function(a, c) {
  "object" === typeof a && (c = a, a = R(c, this.key));
  this.store.set(a, c);
  return this;
};
A.searchCache = Ka;
A.export = function(a, c, b = 0, f = 0) {
  if (b < this.field.length) {
    const g = this.field[b];
    if ((c = this.index.get(g).export(a, g, b, f = 1)) && c.then) {
      const k = this;
      return c.then(function() {
        return k.export(a, g, b + 1);
      });
    }
    return this.export(a, g, b + 1);
  }
  let d, e;
  switch(f) {
    case 0:
      d = "reg";
      e = va(this.reg);
      c = null;
      break;
    case 1:
      d = "tag";
      e = this.tag && ra(this.tag, this.reg.size);
      c = null;
      break;
    case 2:
      d = "doc";
      e = this.store && pa(this.store);
      c = null;
      break;
    default:
      return;
  }
  return xa.call(this, a, c, d, e, b, f);
};
A.import = function(a, c) {
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
        this.reg = wa(c, this.reg);
        for (let f = 0, d; f < this.field.length; f++) {
          d = this.index.get(this.field[f]), d.fastupdate = !1, d.reg = this.reg;
        }
        break;
      case "tag":
        this.tag = sa(c, this.tag);
        break;
      case "doc":
        this.store = qa(c, this.store);
    }
  }
};
ka(X.prototype);
function Ka(a, c, b) {
  const f = (c ? "" + a : "object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new Y());
  let d = this.cache.get(f);
  if (!d) {
    d = this.search(a, c, b);
    if (d.then) {
      const e = this;
      d.then(function(g) {
        e.cache.set(f, g);
        return g;
      });
    }
    this.cache.set(f, d);
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
const La = {normalize:!1, numeric:!1, dedupe:!1};
const Ma = {};
const Na = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const Oa = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), Pa = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const Qa = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var Ra = {Exact:La, Default:Ma, Normalize:Ma, LatinBalance:{mapper:Na}, LatinAdvanced:{mapper:Na, matcher:Oa, replacer:Pa}, LatinExtra:{mapper:Na, replacer:Pa.concat([/(?!^)[aeo]/g, ""]), matcher:Oa}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let f = c.charAt(0), d = Qa[f];
    for (let e = 1, g; e < c.length && (g = c.charAt(e), "h" === g || "w" === g || !(g = Qa[g]) || g === d || (f += g, d = g, 4 !== f.length)); e++) {
    }
    a[b] = f;
  }
}}, CJK:{split:""}, LatinExact:La, LatinDefault:Ma, LatinSimple:Ma};
Z.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let f = 0, d; f < b.length; f++) {
        if (d = b[f]) {
          if (2 > d.length) {
            d.pop();
          } else {
            const e = d.indexOf(a);
            e === b.length - 1 ? d.pop() : d.splice(e, 1);
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
  var f = "undefined" === typeof c;
  if (a.constructor === Array) {
    for (let d = 0, e, g; d < a.length; d++) {
      if ((e = a[d]) && e.length) {
        if (f) {
          b++;
        } else {
          if (g = e.indexOf(c), 0 <= g) {
            1 < e.length ? (e.splice(g, 1), b++) : delete a[d];
            break;
          } else {
            b++;
          }
        }
      }
    }
  } else {
    for (let d of a.entries()) {
      f = d[0];
      const e = Sa(d[1], c);
      e ? b += e : a.delete(f);
    }
  }
  return b;
}
;const Ta = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
Z.prototype.add = function(a, c, b, f) {
  if (c && (a || 0 === a)) {
    if (!f && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    f = this.depth;
    c = this.encoder.encode(c, !f);
    const m = c.length;
    if (m) {
      const n = J(), B = J(), x = this.resolution;
      for (let q = 0; q < m; q++) {
        let r = c[this.rtl ? m - 1 - q : q];
        var d = r.length;
        if (d && (f || !B[r])) {
          var e = this.score ? this.score(c, r, q, null, 0) : Ua(x, m, q), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (let w = 0, l; w < d; w++) {
                  for (e = d; e > w; e--) {
                    g = r.substring(w, e);
                    l = this.rtl ? d - 1 - w : w;
                    var k = this.score ? this.score(c, r, q, g, l) : Ua(x, m, q, d, l);
                    Va(this, B, g, k, a, b);
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
                  Va(this, B, g, h, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (k = 0; k < d; k++) {
                  g += r[this.rtl ? d - 1 - k : k], Va(this, B, g, e, a, b);
                }
                break;
              }
            default:
              if (Va(this, B, r, e, a, b), f && 1 < m && q < m - 1) {
                for (d = J(), g = this.P, e = r, k = Math.min(f + 1, this.rtl ? q + 1 : m - q), d[e] = 1, h = 1; h < k; h++) {
                  if ((r = c[this.rtl ? m - 1 - q - h : q + h]) && !d[r]) {
                    d[r] = 1;
                    const w = this.score ? this.score(c, e, q, r, h - 1) : Ua(g + (m / 2 > g ? 0 : 1), m, q, k - 1, h - 1), l = this.bidirectional && r > e;
                    Va(this, n, l ? e : r, w, a, b, l ? r : e);
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
function Va(a, c, b, f, d, e, g) {
  let k = g ? a.ctx : a.map, h;
  if (!c[b] || g && !(h = c[b])[g]) {
    g ? (c = h || (c[b] = J()), c[g] = 1, (h = k.get(g)) ? k = h : k.set(g, k = new Map())) : c[b] = 1, (h = k.get(b)) ? k = h : k.set(b, k = []), k = k[f] || (k[f] = []), e && k.includes(d) || (k.push(d), a.fastupdate && ((c = a.reg.get(d)) ? c.push(k) : a.reg.set(d, [k])));
  }
}
function Ua(a, c, b, f, d) {
  return b && 1 < a ? c + (f || 0) <= a ? b + (d || 0) : (a - 1) / (c + (f || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;Z.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  if (b && b.cache) {
    return b.cache = !1, c = this.searchCache(a, c, b), b.cache = !0, c;
  }
  var f = [], d = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    d = b.offset || 0;
    var e = b.context;
    var g = b.suggest;
    var k = !0;
    var h = b.resolution;
  }
  "undefined" === typeof k && (k = !0);
  e = this.depth && !1 !== e;
  b = this.encoder.encode(a, !e);
  a = b.length;
  c = c || (k ? 100 : 0);
  if (1 === a) {
    return g = d, (d = Wa(this, b[0], "")) && d.length ? Ca.call(this, d, c, g) : [];
  }
  if (2 === a && e && !g) {
    return g = d, (d = Wa(this, b[1], b[0])) && d.length ? Ca.call(this, d, c, g) : [];
  }
  k = J();
  var m = 0;
  if (e) {
    var n = b[0];
    m = 1;
  }
  h || 0 === h || (h = n ? this.P : this.resolution);
  for (let r, w; m < a; m++) {
    if ((w = b[m]) && !k[w]) {
      k[w] = 1;
      r = Wa(this, w, n);
      a: {
        e = r;
        var B = f, x = g, q = h;
        let l = [];
        if (e && e.length) {
          if (e.length <= q) {
            B.push(e);
            r = void 0;
            break a;
          }
          for (let u = 0, v; u < q; u++) {
            if (v = e[u]) {
              l[u] = v;
            }
          }
          if (l.length) {
            B.push(l);
            r = void 0;
            break a;
          }
        }
        r = x ? void 0 : l;
      }
      if (r) {
        f = r;
        break;
      }
      n && (g && r && f.length || (n = w));
    }
    g && n && m === a - 1 && !f.length && (h = this.resolution, n = "", m = -1, k = J());
  }
  a: {
    b = f;
    f = b.length;
    n = b;
    if (1 < f) {
      b: {
        f = g;
        n = b.length;
        g = [];
        a = J();
        for (let r = 0, w, l, u, v; r < h; r++) {
          for (m = 0; m < n; m++) {
            if (u = b[m], r < u.length && (w = u[r])) {
              for (e = 0; e < w.length; e++) {
                if (l = w[e], (k = a[l]) ? a[l]++ : (k = 0, a[l] = 1), v = g[k] || (g[k] = []), v.push(l), c && k === n - 1 && v.length - d === c) {
                  n = d ? v.slice(d) : v;
                  break b;
                }
              }
            }
          }
        }
        if (b = g.length) {
          if (f) {
            if (1 < g.length) {
              c: {
                for (b = [], h = J(), f = g.length, k = f - 1; 0 <= k; k--) {
                  if (a = (f = g[k]) && f.length) {
                    for (m = 0; m < a; m++) {
                      if (n = f[m], !h[n]) {
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
    } else if (1 === f) {
      c = Ca.call(null, b[0], c, d);
      break a;
    }
    c = n;
  }
  return c;
};
function Wa(a, c, b) {
  let f;
  b && (f = a.bidirectional && c > b) && (f = b, b = c, c = f);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;function Z(a, c) {
  if (!this || this.constructor !== Z) {
    return new Z(a);
  }
  if (a) {
    var b = L(a) ? a : a.preset;
    b && (Ta[b] || console.warn("Preset not found: " + b), a = Object.assign({}, Ta[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const f = !0 === b ? {depth:1} : b || {}, d = L(a.encoder) ? Ra[a.encoder] : a.encode || a.encoder || {};
  this.encoder = d.encode ? d : "object" === typeof d ? new S(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && "default" !== b && "exact" !== b && b || "strict";
  this.depth = "strict" === b && f.depth || 0;
  this.bidirectional = !1 !== f.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  f && f.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  b = !1;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.P = f.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (b = a.cache || null) && new Y(b);
  this.priority = a.priority || 4;
}
A = Z.prototype;
A.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  return this;
};
A.append = function(a, c) {
  return this.add(a, c, !0);
};
A.contain = function(a) {
  return this.reg.has(a);
};
A.update = function(a, c) {
  const b = this, f = this.remove(a);
  return f && f.then ? f.then(() => b.add(a, c)) : this.add(a, c);
};
A.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Sa(this.map);
  this.depth && Sa(this.ctx);
  return this;
};
A.searchCache = Ka;
A.export = function(a, c, b = 0, f = 0) {
  let d, e;
  switch(f) {
    case 0:
      d = "reg";
      e = va(this.reg);
      break;
    case 1:
      d = "cfg";
      e = null;
      break;
    case 2:
      d = "map";
      e = pa(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      e = ra(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return xa.call(this, a, c, d, e, b, f);
};
A.import = function(a, c) {
  if (c) {
    switch("string" === typeof c && (c = JSON.parse(c)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = wa(c, this.reg);
        break;
      case "map":
        this.map = qa(c, this.map);
        break;
      case "ctx":
        this.ctx = sa(c, this.ctx);
    }
  }
};
A.serialize = function(a = !0) {
  let c = "", b = "", f = "";
  if (this.reg.size) {
    let e;
    for (var d of this.reg.keys()) {
      e || (e = typeof d), c += (c ? "," : "") + ("string" === e ? '"' + d + '"' : d);
    }
    c = "index.reg=new Set([" + c + "]);";
    b = ya(this.map, e);
    b = "index.map=new Map([" + b + "]);";
    for (const g of this.ctx.entries()) {
      d = g[0];
      let k = ya(g[1], e);
      k = "new Map([" + k + "])";
      k = '["' + d + '",' + k + "]";
      f += (f ? "," : "") + k;
    }
    f = "index.ctx=new Map([" + f + "]);";
  }
  return a ? "function inject(index){" + c + b + f + "}" : c + b + f;
};
ka(Z.prototype);
J();
export default {Index:Z, Charset:Ra, Encoder:S, Document:X, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=Z;export const  Charset=Ra;export const  Encoder=S;export const  Document=X;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};