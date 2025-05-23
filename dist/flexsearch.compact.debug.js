/**!
 * FlexSearch.js v0.8.203 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var B;
function I(a, c, b) {
  const e = typeof b, d = typeof a;
  if (e !== "undefined") {
    if (d !== "undefined") {
      if (b) {
        if (d === "function" && e === d) {
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
  return d === "undefined" ? c : a;
}
function J(a, c) {
  return typeof a === "undefined" ? c : a;
}
function M() {
  return Object.create(null);
}
function P(a) {
  return typeof a === "string";
}
function R(a) {
  return typeof a === "object";
}
function aa(a, c) {
  if (P(c)) {
    a = a[c];
  } else {
    for (let b = 0; a && b < c.length; b++) {
      a = a[c[b]];
    }
  }
  return a;
}
;const ba = /[^\p{L}\p{N}]+/u, ea = /(\d{3})/g, fa = /(\D)(\d{3})/g, ha = /(\d{3})(\D)/g, ka = /[\u0300-\u036f]/g;
function la(a = {}) {
  if (!this || this.constructor !== la) {
    return new la(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
B = la.prototype;
B.assign = function(a) {
  this.normalize = I(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split, e;
  if (b || b === "") {
    if (typeof b === "object" && b.constructor !== RegExp) {
      let d = "";
      e = !c;
      c || (d += "\\p{Z}");
      b.letter && (d += "\\p{L}");
      b.number && (d += "\\p{N}", e = !!c);
      b.symbol && (d += "\\p{S}");
      b.punctuation && (d += "\\p{P}");
      b.control && (d += "\\p{C}");
      if (b = b.char) {
        d += typeof b === "object" ? b.join("") : b;
      }
      try {
        this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
      } catch (f) {
        console.error("Your split configuration:", b, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = b, e = b === !1 || "a1a".split(b).length < 2;
    }
    this.numeric = I(a.numeric, e);
  } else {
    try {
      this.split = I(this.split, ba);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = I(a.numeric, I(this.numeric, !0));
  }
  this.prepare = I(a.prepare, null, this.prepare);
  this.finalize = I(a.finalize, null, this.finalize);
  b = a.filter;
  this.filter = typeof b === "function" ? b : I(b && new Set(b), null, this.filter);
  this.dedupe = I(a.dedupe, !0, this.dedupe);
  this.matcher = I((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = I((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = I((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = I(a.replacer, null, this.replacer);
  this.minlength = I(a.minlength, 1, this.minlength);
  this.maxlength = I(a.maxlength, 1024, this.maxlength);
  this.rtl = I(a.rtl, !1, this.rtl);
  if (this.cache = b = I(a.cache, !0, this.cache)) {
    this.D = null, this.K = typeof b === "number" ? b : 2e5, this.B = new Map(), this.C = new Map(), this.H = this.G = 128;
  }
  this.h = "";
  this.I = null;
  this.A = "";
  this.J = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.h += (this.h ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.A += (this.A ? "|" : "") + d;
    }
  }
  return this;
};
B.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.A += (this.A ? "|" : "") + a;
  this.J = null;
  this.cache && S(this);
  return this;
};
B.addFilter = function(a) {
  typeof a === "function" ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && S(this);
  return this;
};
B.addMapper = function(a, c) {
  if (typeof a === "object") {
    return this.addReplacer(a, c);
  }
  if (a.length > 1) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && S(this);
  return this;
};
B.addMatcher = function(a, c) {
  if (typeof a === "object") {
    return this.addReplacer(a, c);
  }
  if (a.length < 2 && (this.dedupe || this.mapper)) {
    return this.addMapper(a, c);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, c);
  this.h += (this.h ? "|" : "") + a;
  this.I = null;
  this.cache && S(this);
  return this;
};
B.addReplacer = function(a, c) {
  if (typeof a === "string") {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && S(this);
  return this;
};
B.encode = function(a, c) {
  if (this.cache && a.length <= this.G) {
    if (this.D) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.D = setTimeout(S, 50, this);
    }
  }
  this.normalize && (typeof this.normalize === "function" ? a = this.normalize(a) : a = ka ? a.normalize("NFKD").replace(ka, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && a.length > 3 && (a = a.replace(fa, "$1 $2").replace(ha, "$1 $2").replace(ea, "$1 "));
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let e = [], d = M(), f, g, h = this.split || this.split === "" ? a.split(this.split) : [a];
  for (let n = 0, l, z; n < h.length; n++) {
    if ((l = z = h[n]) && !(l.length < this.minlength || l.length > this.maxlength)) {
      if (c) {
        if (d[l]) {
          continue;
        }
        d[l] = 1;
      } else {
        if (f === l) {
          continue;
        }
        f = l;
      }
      if (b) {
        e.push(l);
      } else {
        if (!this.filter || (typeof this.filter === "function" ? this.filter(l) : !this.filter.has(l))) {
          if (this.cache && l.length <= this.H) {
            if (this.D) {
              var k = this.C.get(l);
              if (k || k === "") {
                k && e.push(k);
                continue;
              }
            } else {
              this.D = setTimeout(S, 50, this);
            }
          }
          if (this.stemmer) {
            this.J || (this.J = new RegExp("(?!^)(" + this.A + ")$"));
            let x;
            for (; x !== l && l.length > 2;) {
              x = l, l = l.replace(this.J, u => this.stemmer.get(u));
            }
          }
          if (l && (this.mapper || this.dedupe && l.length > 1)) {
            k = "";
            for (let x = 0, u = "", p, w; x < l.length; x++) {
              p = l.charAt(x), p === u && this.dedupe || ((w = this.mapper && this.mapper.get(p)) || w === "" ? w === u && this.dedupe || !(u = w) || (k += w) : k += u = p);
            }
            l = k;
          }
          this.matcher && l.length > 1 && (this.I || (this.I = new RegExp("(" + this.h + ")", "g")), l = l.replace(this.I, x => this.matcher.get(x)));
          if (l && this.replacer) {
            for (k = 0; l && k < this.replacer.length; k += 2) {
              l = l.replace(this.replacer[k], this.replacer[k + 1]);
            }
          }
          this.cache && z.length <= this.H && (this.C.set(z, l), this.C.size > this.K && (this.C.clear(), this.H = this.H / 1.1 | 0));
          if (l) {
            if (l !== z) {
              if (c) {
                if (d[l]) {
                  continue;
                }
                d[l] = 1;
              } else {
                if (g === l) {
                  continue;
                }
                g = l;
              }
            }
            e.push(l);
          }
        }
      }
    }
  }
  this.finalize && (e = this.finalize(e) || e);
  this.cache && a.length <= this.G && (this.B.set(a, e), this.B.size > this.K && (this.B.clear(), this.G = this.G / 1.1 | 0));
  return e;
};
function S(a) {
  a.D = null;
  a.B.clear();
  a.C.clear();
}
;function ma(a, c, b) {
  b || (c || typeof a !== "object" ? typeof c === "object" && (b = c, c = 0) : b = a);
  b && (a = b.query || a, c = b.limit || c);
  let e = "" + (c || 0);
  b && (e += (b.offset || 0) + !!b.context + !!b.suggest + (b.resolve !== !1) + (b.resolution || this.resolution) + (b.boost || 0));
  a = ("" + a).toLowerCase();
  this.cache || (this.cache = new T());
  let d = this.cache.get(a + e);
  if (!d) {
    const f = b && b.cache;
    f && (b.cache = !1);
    d = this.search(a, c, b);
    f && (b.cache = f);
    this.cache.set(a + e, d);
  }
  return d;
}
function T(a) {
  this.limit = a && a !== !0 ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
T.prototype.set = function(a, c) {
  this.cache.set(this.h = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
T.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
  return c;
};
T.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
T.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const na = {normalize:!1, numeric:!1, dedupe:!1};
const oa = {};
const pa = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const qa = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), ra = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const sa = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var va = {Exact:na, Default:oa, Normalize:oa, LatinBalance:{mapper:pa}, LatinAdvanced:{mapper:pa, matcher:qa, replacer:ra}, LatinExtra:{mapper:pa, replacer:ra.concat([/(?!^)[aeo]/g, ""]), matcher:qa}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let e = c.charAt(0), d = sa[e];
    for (let f = 1, g; f < c.length && (g = c.charAt(f), g === "h" || g === "w" || !(g = sa[g]) || g === d || (e += g, d = g, e.length !== 4)); f++) {
    }
    a[b] = e;
  }
}}, CJK:{split:""}, LatinExact:na, LatinDefault:oa, LatinSimple:oa};
function wa(a) {
  U.call(a, "add");
  U.call(a, "append");
  U.call(a, "search");
  U.call(a, "update");
  U.call(a, "remove");
  U.call(a, "searchCache");
}
let xa, ya, za;
function Aa() {
  xa = za = 0;
}
function U(a) {
  this[a + "Async"] = function() {
    const c = arguments;
    var b = c[c.length - 1];
    let e;
    typeof b === "function" && (e = b, delete c[c.length - 1]);
    xa ? za || (za = Date.now() - ya >= this.priority * this.priority * 3) : (xa = setTimeout(Aa, 0), ya = Date.now());
    if (za) {
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
;X.prototype.add = function(a, c, b) {
  R(a) && (c = a, a = aa(c, this.key));
  if (c && (a || a === 0)) {
    if (!b && this.reg.has(a)) {
      return this.update(a, c);
    }
    for (let h = 0, k; h < this.field.length; h++) {
      k = this.B[h];
      var e = this.index.get(this.field[h]);
      if (typeof k === "function") {
        var d = k(c);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = k.F, !d || d(c)) {
          k.constructor === String ? k = ["" + k] : P(k) && (k = [k]), Ba(c, k, this.C, 0, e, a, k[0], b);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.A.length; e++) {
        var f = this.A[e], g = this.D[e];
        d = this.tag.get(g);
        let h = M();
        if (typeof f === "function") {
          if (f = f(c), !f) {
            continue;
          }
        } else {
          const k = f.F;
          if (k && !k(c)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = aa(c, f);
        }
        if (d && f) {
          P(f) && (f = [f]);
          for (let k = 0, n, l; k < f.length; k++) {
            n = f[k], h[n] || (h[n] = 1, (g = d.get(n)) ? l = g : d.set(n, l = []), b && l.includes(a) || (l.push(a), this.fastupdate && ((g = this.reg.get(a)) ? g.push(l) : this.reg.set(a, [l]))));
          }
        } else {
          d || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!b || !this.store.has(a))) {
      let h;
      if (this.h) {
        h = M();
        for (let k = 0, n; k < this.h.length; k++) {
          n = this.h[k];
          if ((b = n.F) && !b(c)) {
            continue;
          }
          let l;
          if (typeof n === "function") {
            l = n(c);
            if (!l) {
              continue;
            }
            n = [n.M];
          } else if (P(n) || n.constructor === String) {
            h[n] = c[n];
            continue;
          }
          Ca(c, h, n, 0, n[0], l);
        }
      }
      this.store.set(a, h || c);
    }
  }
  return this;
};
function Ca(a, c, b, e, d, f) {
  a = a[d];
  if (e === b.length - 1) {
    c[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (c = c[d] = Array(a.length), d = 0; d < a.length; d++) {
        Ca(a, c, b, e, d);
      }
    } else {
      c = c[d] || (c[d] = M()), d = b[++e], Ca(a, c, b, e, d);
    }
  }
}
function Ba(a, c, b, e, d, f, g, h) {
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
      d.add(f, a, h, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          Ba(a, c, b, e, d, f, g, h);
        }
      } else {
        g = c[++e], Ba(a, c, b, e, d, f, g, h);
      }
    }
  }
}
;function Da(a, c, b) {
  if (!a.length) {
    return a;
  }
  if (a.length === 1) {
    return a = a[0], a = b || a.length > c ? a.slice(b, b + c) : a;
  }
  let e = [];
  for (let d = 0, f, g; d < a.length; d++) {
    if ((f = a[d]) && (g = f.length)) {
      if (b) {
        if (b >= g) {
          b -= g;
          continue;
        }
        f = f.slice(b, b + c);
        g = f.length;
        b = 0;
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
  return e = e.length > 1 ? [].concat.apply([], e) : e[0];
}
;function Ea(a, c, b, e, d) {
  let f, g, h;
  typeof d === "string" ? (f = d, d = "") : f = d.template;
  if (!f) {
    throw Error('No template pattern was specified by the search option "highlight"');
  }
  g = f.indexOf("$1");
  if (g === -1) {
    throw Error('Invalid highlight template. The replacement pattern "$1" was not found in template: ' + f);
  }
  h = f.substring(g + 2);
  g = f.substring(0, g);
  let k = d && d.boundary, n = !d || d.clip !== !1, l = d && d.merge && h && g && new RegExp(h + " " + g, "g");
  d = d && d.ellipsis;
  var z = 0;
  if (typeof d === "object") {
    var x = d.template;
    z = x.length - 2;
    d = d.pattern;
  }
  typeof d !== "string" && (d = d === !1 ? "" : "...");
  z && (d = x.replace("$1", d));
  x = d.length - z;
  let u, p;
  typeof k === "object" && (u = k.before, u === 0 && (u = -1), p = k.after, p === 0 && (p = -1), k = k.total || 9e5);
  z = new Map();
  for (let ta = 0, V, Ka, ca; ta < c.length; ta++) {
    let da;
    if (e) {
      da = c, ca = e;
    } else {
      var w = c[ta];
      ca = w.field;
      if (!ca) {
        continue;
      }
      da = w.result;
    }
    Ka = b.get(ca);
    V = Ka.encoder;
    w = z.get(V);
    typeof w !== "string" && (w = V.encode(a), z.set(V, w));
    for (let ia = 0; ia < da.length; ia++) {
      var m = da[ia].doc;
      if (!m) {
        continue;
      }
      m = aa(m, ca);
      if (!m) {
        continue;
      }
      var v = m.trim().split(/\s+/);
      if (!v.length) {
        continue;
      }
      m = "";
      var t = [];
      let ja = [];
      var C = -1, A = -1, r = 0;
      for (var y = 0; y < v.length; y++) {
        var F = v[y], D = V.encode(F);
        D = D.length > 1 ? D.join(" ") : D[0];
        let q;
        if (D && F) {
          var E = F.length, K = (V.split ? F.replace(V.split, "") : F).length - D.length, L = "", Q = 0;
          for (var W = 0; W < w.length; W++) {
            var N = w[W];
            if (N) {
              var H = N.length;
              H += K;
              Q && H <= Q || (N = D.indexOf(N), N > -1 && (L = (N ? F.substring(0, N) : "") + g + F.substring(N, N + H) + h + (N + H < E ? F.substring(N + H) : ""), Q = H, q = !0));
            }
          }
          L && (k && (C < 0 && (C = m.length + (m ? 1 : 0)), A = m.length + (m ? 1 : 0) + L.length, r += E, ja.push(t.length), t.push({match:L})), m += (m ? " " : "") + L);
        }
        if (!q) {
          F = v[y], m += (m ? " " : "") + F, k && t.push({text:F});
        } else if (k && r >= k) {
          break;
        }
      }
      r = ja.length * (f.length - 2);
      if (u || p || k && m.length - r > k) {
        if (r = k + r - x * 2, y = A - C, u > 0 && (y += u), p > 0 && (y += p), y <= r) {
          v = u ? C - (u > 0 ? u : 0) : C - ((r - y) / 2 | 0), t = p ? A + (p > 0 ? p : 0) : v + r, n || (v > 0 && m.charAt(v) !== " " && m.charAt(v - 1) !== " " && (v = m.indexOf(" ", v), v < 0 && (v = 0)), t < m.length && m.charAt(t - 1) !== " " && m.charAt(t) !== " " && (t = m.lastIndexOf(" ", t), t < A ? t = A : ++t)), m = (v ? d : "") + m.substring(v, t) + (t < m.length ? d : "");
        } else {
          A = [];
          C = {};
          r = {};
          y = {};
          F = {};
          D = {};
          L = K = E = 0;
          for (W = Q = 1;;) {
            var O = void 0;
            for (let q = 0, G; q < ja.length; q++) {
              G = ja[q];
              if (L) {
                if (K !== L) {
                  if (y[q + 1]) {
                    continue;
                  }
                  G += L;
                  if (C[G]) {
                    E -= x;
                    r[q + 1] = 1;
                    y[q + 1] = 1;
                    continue;
                  }
                  if (G >= t.length - 1) {
                    if (G >= t.length) {
                      y[q + 1] = 1;
                      G >= v.length && (r[q + 1] = 1);
                      continue;
                    }
                    E -= x;
                  }
                  m = t[G].text;
                  if (H = p && D[q]) {
                    if (H > 0) {
                      if (m.length > H) {
                        if (y[q + 1] = 1, n) {
                          m = m.substring(0, H);
                        } else {
                          continue;
                        }
                      }
                      (H -= m.length) || (H = -1);
                      D[q] = H;
                    } else {
                      y[q + 1] = 1;
                      continue;
                    }
                  }
                  if (E + m.length + 1 <= k) {
                    m = " " + m, A[q] += m;
                  } else if (n) {
                    O = k - E - 1, O > 0 && (m = " " + m.substring(0, O), A[q] += m), y[q + 1] = 1;
                  } else {
                    y[q + 1] = 1;
                    continue;
                  }
                } else {
                  if (y[q]) {
                    continue;
                  }
                  G -= K;
                  if (C[G]) {
                    E -= x;
                    y[q] = 1;
                    r[q] = 1;
                    continue;
                  }
                  if (G <= 0) {
                    if (G < 0) {
                      y[q] = 1;
                      r[q] = 1;
                      continue;
                    }
                    E -= x;
                  }
                  m = t[G].text;
                  if (H = u && F[q]) {
                    if (H > 0) {
                      if (m.length > H) {
                        if (y[q] = 1, n) {
                          m = m.substring(m.length - H);
                        } else {
                          continue;
                        }
                      }
                      (H -= m.length) || (H = -1);
                      F[q] = H;
                    } else {
                      y[q] = 1;
                      continue;
                    }
                  }
                  if (E + m.length + 1 <= k) {
                    m += " ", A[q] = m + A[q];
                  } else if (n) {
                    O = m.length + 1 - (k - E), O >= 0 && O < m.length && (m = m.substring(O) + " ", A[q] = m + A[q]), y[q] = 1;
                  } else {
                    y[q] = 1;
                    continue;
                  }
                }
              } else {
                m = t[G].match;
                u && (F[q] = u);
                p && (D[q] = p);
                q && E++;
                let ua;
                G ? !q && x && (E += x) : (r[q] = 1, y[q] = 1);
                G >= v.length - 1 ? ua = 1 : G < t.length - 1 && t[G + 1].match ? ua = 1 : x && (E += x);
                E -= f.length - 2;
                if (!q || E + m.length <= k) {
                  A[q] = m;
                } else {
                  O = Q = W = r[q] = 0;
                  break;
                }
                ua && (r[q + 1] = 1, y[q + 1] = 1);
              }
              E += m.length;
              O = C[G] = 1;
            }
            if (O) {
              K === L ? L++ : K++;
            } else {
              K === L ? Q = 0 : W = 0;
              if (!Q && !W) {
                break;
              }
              Q ? (K++, L = K) : L++;
            }
          }
          m = "";
          for (let q = 0, G; q < A.length; q++) {
            G = (q && r[q] ? " " : (q && !d ? " " : "") + d) + A[q], m += G;
          }
          d && !r[A.length] && (m += d);
        }
      }
      l && (m = m.replace(l, " "));
      da[ia].highlight = m;
    }
    if (e) {
      break;
    }
  }
  return c;
}
;function Fa(a, c) {
  const b = M(), e = [];
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
;M();
X.prototype.search = function(a, c, b, e) {
  b || (!c && R(a) ? (b = a, a = "") : R(c) && (b = c, c = 0));
  let d = [];
  var f = [];
  let g;
  let h, k, n, l;
  let z = 0, x = !0, u;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    var p = b.pluck;
    var w = b.merge;
    n = p || b.field || (n = b.index) && (n.index ? null : n);
    l = this.tag && b.tag;
    h = b.suggest;
    x = !0;
    k = b.cache;
    this.store && b.highlight && !x ? console.warn("Highlighting results can only be done on a final resolver task or when calling .resolve({ highlight: ... })") : this.store && b.enrich && !x && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    u = x && this.store && b.highlight;
    g = !!u || x && this.store && b.enrich;
    c = b.limit || c;
    var m = b.offset || 0;
    c || (c = x ? 100 : 0);
    if (l) {
      l.constructor !== Array && (l = [l]);
      var v = [];
      for (let A = 0, r; A < l.length; A++) {
        r = l[A];
        if (P(r)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (r.field && r.tag) {
          var t = r.tag;
          if (t.constructor === Array) {
            for (var C = 0; C < t.length; C++) {
              v.push(r.field, t[C]);
            }
          } else {
            v.push(r.field, t);
          }
        } else {
          t = Object.keys(r);
          for (let y = 0, F, D; y < t.length; y++) {
            if (F = t[y], D = r[F], D.constructor === Array) {
              for (C = 0; C < D.length; C++) {
                v.push(F, D[C]);
              }
            } else {
              v.push(F, D);
            }
          }
        }
      }
      if (!v.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      l = v;
      if (!a) {
        f = [];
        if (v.length) {
          for (p = 0; p < v.length; p += 2) {
            w = Ga.call(this, v[p], v[p + 1], c, m, g), d.push({field:v[p], tag:v[p + 1], result:w});
          }
        }
        return f.length ? Promise.all(f).then(function(A) {
          for (let r = 0; r < A.length; r++) {
            d[r].result = A[r];
          }
          return d;
        }) : d;
      }
    }
    n && n.constructor !== Array && (n = [n]);
  }
  n || (n = this.field);
  v = !1;
  for (let A = 0, r, y, F; A < n.length; A++) {
    y = n[A];
    let D;
    P(y) || (D = y, y = D.field, a = D.query || a, c = J(D.limit, c), m = J(D.offset, m), h = J(D.suggest, h), u = x && this.store && J(D.highlight, u), g = !!u || x && this.store && J(D.enrich, g), k = J(D.cache, k));
    if (e) {
      r = e[A];
    } else {
      t = D || b || {};
      C = t.enrich;
      const E = this.index.get(y);
      l && C && (t.enrich = !1);
      r = k ? E.searchCache(a, c, t) : E.search(a, c, t);
      C && (t.enrich = C);
      if (v) {
        v[A] = r;
        continue;
      }
    }
    F = (r = r.result || r) && r.length;
    if (l && F) {
      t = [];
      C = 0;
      for (let E = 0, K, L; E < l.length; E += 2) {
        K = this.tag.get(l[E]);
        if (!K) {
          if (console.warn("Tag '" + l[E] + ":" + l[E + 1] + "' will be skipped because there is no field '" + l[E] + "'."), h) {
            continue;
          } else {
            return d;
          }
        }
        if (L = (K = K && K.get(l[E + 1])) && K.length) {
          C++, t.push(K);
        } else if (!h) {
          return d;
        }
      }
      if (C) {
        r = Fa(r, t);
        F = r.length;
        if (!F && !h) {
          return r;
        }
        C--;
      }
    }
    if (F) {
      f[z] = y, d.push(r), z++;
    } else if (n.length === 1) {
      return d;
    }
  }
  if (v) {
    const A = this;
    return Promise.all(v).then(function(r) {
      b && (b.resolve = x);
      r.length && (r = A.search(a, c, b, r));
      return r;
    });
  }
  if (!z) {
    return d;
  }
  if (p && (!g || !this.store)) {
    return d = d[0];
  }
  v = [];
  for (m = 0; m < f.length; m++) {
    e = d[m];
    g && e.length && typeof e[0].doc === "undefined" && (e = Ha.call(this, e));
    if (p) {
      return u ? Ea(a, e, this.index, p, u) : e;
    }
    d[m] = {field:f[m], result:e};
  }
  u && (d = Ea(a, d, this.index, p, u));
  return w ? Ia(d) : d;
};
function Ia(a) {
  const c = [], b = M(), e = M();
  for (let d = 0, f, g, h, k, n, l, z; d < a.length; d++) {
    f = a[d];
    g = f.field;
    h = f.result;
    for (let x = 0; x < h.length; x++) {
      if (n = h[x], typeof n !== "object" ? n = {id:k = n} : k = n.id, (l = b[k]) ? l.push(g) : (n.field = b[k] = [g], c.push(n)), z = n.highlight) {
        l = e[k], l || (e[k] = l = {}, n.highlight = l), l[g] = z;
      }
    }
  }
  return c;
}
function Ga(a, c, b, e, d) {
  a = this.tag.get(a);
  if (!a) {
    return [];
  }
  a = a.get(c);
  if (!a) {
    return [];
  }
  c = a.length - e;
  if (c > 0) {
    if (b && c > b || e) {
      a = a.slice(e, e + b);
    }
    d && (a = Ha.call(this, a));
  }
  return a;
}
function Ha(a) {
  if (!this || !this.store) {
    return a;
  }
  const c = Array(a.length);
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c[b] = {id:e, doc:this.store.get(e)};
  }
  return c;
}
;function X(a) {
  if (!this || this.constructor !== X) {
    return new X(a);
  }
  const c = a.document || a.doc || a;
  var b;
  this.B = [];
  this.field = [];
  this.C = [];
  this.key = (b = c.key || c.id) && Ja(b, this.C) || "id";
  this.reg = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.h = (b = c.store || null) && b && b !== !0 && [];
  this.store = b ? new Map() : null;
  this.cache = (b = a.cache || null) && new T(b);
  a.cache = !1;
  this.priority = a.priority || 4;
  b = new Map();
  let e = c.index || c.field || c;
  P(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d], P(f) || (g = f, f = f.field), g = R(g) ? Object.assign({}, a, g) : a, b.set(f, new Y(g, this.reg)), g.custom ? this.B[d] = g.custom : (this.B[d] = Ja(f, this.C), g.filter && (typeof this.B[d] === "string" && (this.B[d] = new String(this.B[d])), this.B[d].F = g.filter)), this.field[d] = f;
  }
  if (this.h) {
    a = c.store;
    P(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.custom ? (this.h[d] = f.custom, f.custom.M = g) : (this.h[d] = Ja(g, this.C), f.filter && (typeof this.h[d] === "string" && (this.h[d] = new String(this.h[d])), this.h[d].F = f.filter));
    }
  }
  this.index = b;
  this.tag = null;
  if (b = c.tag) {
    if (typeof b === "string" && (b = [b]), b.length) {
      this.tag = new Map();
      this.A = [];
      this.D = [];
      for (let d = 0, f, g; d < b.length; d++) {
        f = b[d];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.A[d] = f.custom : (this.A[d] = Ja(g, this.C), f.filter && (typeof this.A[d] === "string" && (this.A[d] = new String(this.A[d])), this.A[d].F = f.filter));
        this.D[d] = g;
        this.tag.set(g, new Map());
      }
    }
  }
}
function Ja(a, c) {
  const b = a.split(":");
  let e = 0;
  for (let d = 0; d < b.length; d++) {
    a = b[d], a[a.length - 1] === "]" && (a = a.substring(0, a.length - 2)) && (c[e] = !0), a && (b[e++] = a);
  }
  e < b.length && (b.length = e);
  return e > 1 ? b : b[0];
}
B = X.prototype;
B.append = function(a, c) {
  return this.add(a, c, !0);
};
B.update = function(a, c) {
  return this.remove(a).add(a, c);
};
B.remove = function(a) {
  R(a) && (a = aa(a, this.key));
  for (var c of this.index.values()) {
    c.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (let b of this.tag.values()) {
        for (let e of b) {
          c = e[0];
          const d = e[1], f = d.indexOf(a);
          f > -1 && (d.length > 1 ? d.splice(f, 1) : b.delete(c));
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
  typeof a === "object" && (c = a, a = aa(c, this.key));
  this.store.set(a, c);
  return this;
};
B.searchCache = ma;
B.export = La;
B.import = Ma;
wa(X.prototype);
function Na(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function Oa(a, c) {
  c || (c = new Map());
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c.set(e[0], e[1]);
  }
  return c;
}
function Pa(a, c = 0) {
  let b = [], e = [];
  c && (c = 250000 / c * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], Na(d[1])[0]]), e.length === c && (b.push(e), e = []);
  }
  e.length && b.push(e);
  return b;
}
function Qa(a, c) {
  c || (c = new Map());
  for (let b = 0, e, d; b < a.length; b++) {
    e = a[b], d = c.get(e[0]), c.set(e[0], Oa(e[1], d));
  }
  return c;
}
function Ra(a) {
  let c = [], b = [];
  for (const e of a.keys()) {
    b.push(e), b.length === 250000 && (c.push(b), b = []);
  }
  b.length && c.push(b);
  return c;
}
function Sa(a, c) {
  c || (c = new Set());
  for (let b = 0; b < a.length; b++) {
    c.add(a[b]);
  }
  return c;
}
function Ta(a, c, b, e, d, f, g = 0) {
  const h = e && e.constructor === Array;
  var k = h ? e.shift() : e;
  if (!k) {
    return this.export(a, c, d, f + 1);
  }
  if ((k = a((c ? c + "." : "") + (g + 1) + "." + b, JSON.stringify(k))) && k.then) {
    const n = this;
    return k.then(function() {
      return Ta.call(n, a, c, b, h ? e : null, d, f, g + 1);
    });
  }
  return Ta.call(this, a, c, b, h ? e : null, d, f, g + 1);
}
function La(a, c, b = 0, e = 0) {
  if (b < this.field.length) {
    const g = this.field[b];
    if ((c = this.index.get(g).export(a, g, b, e = 1)) && c.then) {
      const h = this;
      return c.then(function() {
        return h.export(a, g, b + 1);
      });
    }
    return this.export(a, g, b + 1);
  }
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = Ra(this.reg);
      c = null;
      break;
    case 1:
      d = "tag";
      f = this.tag && Pa(this.tag, this.reg.size);
      c = null;
      break;
    case 2:
      d = "doc";
      f = this.store && Na(this.store);
      c = null;
      break;
    default:
      return;
  }
  return Ta.call(this, a, c, d, f || null, b, e);
}
function Ma(a, c) {
  var b = a.split(".");
  b[b.length - 1] === "json" && b.pop();
  a = b.length > 2 ? b[0] : "";
  b = b.length > 2 ? b[2] : b[1];
  if (c) {
    typeof c === "string" && (c = JSON.parse(c));
    if (a) {
      return this.index.get(a).import(b, c);
    }
    switch(b) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Sa(c, this.reg);
        for (let e = 0, d; e < this.field.length; e++) {
          d = this.index.get(this.field[e]), d.fastupdate = !1, d.reg = this.reg;
        }
        break;
      case "tag":
        this.tag = Qa(c, this.tag);
        break;
      case "doc":
        this.store = Oa(c, this.store);
    }
  }
}
function Ua(a, c) {
  let b = "";
  for (const e of a.entries()) {
    a = e[0];
    const d = e[1];
    let f = "";
    for (let g = 0, h; g < d.length; g++) {
      h = d[g] || [""];
      let k = "";
      for (let n = 0; n < h.length; n++) {
        k += (k ? "," : "") + (c === "string" ? '"' + h[n] + '"' : h[n]);
      }
      k = "[" + k + "]";
      f += (f ? "," : "") + k;
    }
    f = '["' + a + '",[' + f + "]]";
    b += (b ? "," : "") + f;
  }
  return b;
}
;Y.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let e = 0, d, f; e < b.length; e++) {
        if ((d = b[e]) && (f = d.length)) {
          if (d[f - 1] === a) {
            d.pop();
          } else {
            const g = d.indexOf(a);
            g >= 0 && d.splice(g, 1);
          }
        }
      }
    } else {
      Va(this.map, a), this.depth && Va(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function Va(a, c) {
  let b = 0;
  var e = typeof c === "undefined";
  if (a.constructor === Array) {
    for (let d = 0, f, g, h; d < a.length; d++) {
      if ((f = a[d]) && f.length) {
        if (e) {
          return 1;
        }
        g = f.indexOf(c);
        if (g >= 0) {
          if (f.length > 1) {
            return f.splice(g, 1), 1;
          }
          delete a[d];
          if (b) {
            return 1;
          }
          h = 1;
        } else {
          if (h) {
            return 1;
          }
          b++;
        }
      }
    }
  } else {
    for (let d of a.entries()) {
      e = d[0], Va(d[1], c) ? b++ : a.delete(e);
    }
  }
  return b;
}
;const Wa = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
Y.prototype.add = function(a, c, b, e) {
  if (c && (a || a === 0)) {
    if (!e && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    e = this.depth;
    c = this.encoder.encode(c, !e);
    const n = c.length;
    if (n) {
      const l = M(), z = M(), x = this.resolution;
      for (let u = 0; u < n; u++) {
        let p = c[this.rtl ? n - 1 - u : u];
        var d = p.length;
        if (d && (e || !z[p])) {
          var f = this.score ? this.score(c, p, u, null, 0) : Xa(x, n, u), g = "";
          switch(this.tokenize) {
            case "tolerant":
              Z(this, z, p, f, a, b);
              if (d > 2) {
                for (let w = 1, m, v, t, C; w < d - 1; w++) {
                  m = p.charAt(w), v = p.charAt(w + 1), t = p.substring(0, w) + v, C = p.substring(w + 2), g = t + m + C, z[g] || Z(this, z, g, f, a, b), g = t + C, z[g] || Z(this, z, g, f, a, b);
                }
              }
              break;
            case "full":
              if (d > 2) {
                for (let w = 0, m; w < d; w++) {
                  for (f = d; f > w; f--) {
                    if (g = p.substring(w, f), !z[g]) {
                      m = this.rtl ? d - 1 - w : w;
                      var h = this.score ? this.score(c, p, u, g, m) : Xa(x, n, u, d, m);
                      Z(this, z, g, h, a, b);
                    }
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (d > 1) {
                for (h = d - 1; h > 0; h--) {
                  if (g = p[this.rtl ? d - 1 - h : h] + g, !z[g]) {
                    var k = this.score ? this.score(c, p, u, g, h) : Xa(x, n, u, d, h);
                    Z(this, z, g, k, a, b);
                  }
                }
                g = "";
              }
            case "forward":
              if (d > 1) {
                for (h = 0; h < d; h++) {
                  g += p[this.rtl ? d - 1 - h : h], z[g] || Z(this, z, g, f, a, b);
                }
                break;
              }
            default:
              if (Z(this, z, p, f, a, b), e && n > 1 && u < n - 1) {
                for (d = M(), g = this.L, f = p, h = Math.min(e + 1, this.rtl ? u + 1 : n - u), d[f] = 1, k = 1; k < h; k++) {
                  if ((p = c[this.rtl ? n - 1 - u - k : u + k]) && !d[p]) {
                    d[p] = 1;
                    const w = this.score ? this.score(c, f, u, p, k - 1) : Xa(g + (n / 2 > g ? 0 : 1), n, u, h - 1, k - 1), m = this.bidirectional && p > f;
                    Z(this, l, m ? f : p, w, a, b, m ? p : f);
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
function Z(a, c, b, e, d, f, g) {
  let h = g ? a.ctx : a.map, k;
  if (!c[b] || g && !(k = c[b])[g]) {
    g ? (c = k || (c[b] = M()), c[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[e] || (h[e] = []), f && h.includes(d) || (h.push(d), a.fastupdate && ((c = a.reg.get(d)) ? c.push(h) : a.reg.set(d, [h])));
  }
}
function Xa(a, c, b, e, d) {
  return b && a > 1 ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;Y.prototype.search = function(a, c, b) {
  b || (c || typeof a !== "object" ? typeof c === "object" && (b = c, c = 0) : (b = a, a = ""));
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
    var h = !0;
    var k = b.resolution;
  }
  typeof h === "undefined" && (h = !0);
  f = this.depth && f !== !1;
  b = this.encoder.encode(a, !f);
  a = b.length;
  c = c || (h ? 100 : 0);
  if (a === 1) {
    return g = d, (d = Ya(this, b[0], "")) && d.length ? Da.call(this, d, c, g) : [];
  }
  if (a === 2 && f && !g) {
    return g = d, (d = Ya(this, b[1], b[0])) && d.length ? Da.call(this, d, c, g) : [];
  }
  h = M();
  var n = 0;
  if (f) {
    var l = b[0];
    n = 1;
  }
  k || k === 0 || (k = l ? this.L : this.resolution);
  for (let p, w; n < a; n++) {
    if ((w = b[n]) && !h[w]) {
      h[w] = 1;
      p = Ya(this, w, l);
      a: {
        f = p;
        var z = e, x = g, u = k;
        let m = [];
        if (f && f.length) {
          if (f.length <= u) {
            z.push(f);
            p = void 0;
            break a;
          }
          for (let v = 0, t; v < u; v++) {
            if (t = f[v]) {
              m[v] = t;
            }
          }
          if (m.length) {
            z.push(m);
            p = void 0;
            break a;
          }
        }
        p = x ? void 0 : m;
      }
      if (p) {
        e = p;
        break;
      }
      l && (g && p && e.length || (l = w));
    }
    g && l && n === a - 1 && !e.length && (k = this.resolution, l = "", n = -1, h = M());
  }
  a: {
    b = e;
    e = b.length;
    l = b;
    if (e > 1) {
      b: {
        e = g;
        l = b.length;
        g = [];
        a = M();
        for (let p = 0, w, m, v, t; p < k; p++) {
          for (n = 0; n < l; n++) {
            if (v = b[n], p < v.length && (w = v[p])) {
              for (f = 0; f < w.length; f++) {
                if (m = w[f], (h = a[m]) ? a[m]++ : (h = 0, a[m] = 1), t = g[h] || (g[h] = []), t.push(m), c && h === l - 1 && t.length - d === c) {
                  l = d ? t.slice(d) : t;
                  break b;
                }
              }
            }
          }
        }
        if (b = g.length) {
          if (e) {
            if (g.length > 1) {
              c: {
                for (b = [], k = M(), e = g.length, h = e - 1; h >= 0; h--) {
                  if (a = (e = g[h]) && e.length) {
                    for (n = 0; n < a; n++) {
                      if (l = e[n], !k[l]) {
                        if (k[l] = 1, d) {
                          d--;
                        } else {
                          if (b.push(l), b.length === c) {
                            break c;
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              b = (g = g[0]) && c && g.length > c || d ? g.slice(d, c + d) : g;
            }
            g = b;
          } else {
            if (b < l) {
              l = [];
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
        l = g;
      }
    } else if (e === 1) {
      c = Da.call(null, b[0], c, d);
      break a;
    }
    c = l;
  }
  return c;
};
function Ya(a, c, b) {
  let e;
  b && (e = a.bidirectional && c > b) && (e = b, b = c, c = e);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;function Y(a, c) {
  if (!this || this.constructor !== Y) {
    return new Y(a);
  }
  if (a) {
    var b = P(a) ? a : a.preset;
    b && (Wa[b] || console.warn("Preset not found: " + b), a = Object.assign({}, Wa[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const e = b === !0 ? {depth:1} : b || {}, d = P(a.encoder) ? va[a.encoder] : a.encode || a.encoder || {};
  this.encoder = d.encode ? d : typeof d === "object" ? new la(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && b !== "default" && b !== "exact" && b || "strict";
  this.depth = b === "strict" && e.depth || 0;
  this.bidirectional = e.bidirectional !== !1;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e && e.depth && this.tokenize !== "strict" && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  b = !1;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.L = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (b = a.cache || null) && new T(b);
  this.priority = a.priority || 4;
}
B = Y.prototype;
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
  Va(this.map);
  this.depth && Va(this.ctx);
  return this;
};
B.searchCache = ma;
B.export = function(a, c, b = 0, e = 0) {
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = Ra(this.reg);
      break;
    case 1:
      d = "cfg";
      f = null;
      break;
    case 2:
      d = "map";
      f = Na(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      f = Pa(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return Ta.call(this, a, c, d, f, b, e);
};
B.import = function(a, c) {
  if (c) {
    switch(typeof c === "string" && (c = JSON.parse(c)), a = a.split("."), a[a.length - 1] === "json" && a.pop(), a.length === 3 && a.shift(), a = a.length > 1 ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = Sa(c, this.reg);
        break;
      case "map":
        this.map = Oa(c, this.map);
        break;
      case "ctx":
        this.ctx = Qa(c, this.ctx);
    }
  }
};
B.serialize = function(a = !0) {
  let c = "", b = "", e = "";
  if (this.reg.size) {
    let f;
    for (var d of this.reg.keys()) {
      f || (f = typeof d), c += (c ? "," : "") + (f === "string" ? '"' + d + '"' : d);
    }
    c = "index.reg=new Set([" + c + "]);";
    b = Ua(this.map, f);
    b = "index.map=new Map([" + b + "]);";
    for (const g of this.ctx.entries()) {
      d = g[0];
      let h = Ua(g[1], f);
      h = "new Map([" + h + "])";
      h = '["' + d + '",' + h + "]";
      e += (e ? "," : "") + h;
    }
    e = "index.ctx=new Map([" + e + "]);";
  }
  return a ? "function inject(index){" + c + b + e + "}" : c + b + e;
};
wa(Y.prototype);
M();
const Za = {Index:Y, Charset:va, Encoder:la, Document:X, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, $a = typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : self;
let ab;
(ab = $a.define) && ab.amd ? ab([], function() {
  return Za;
}) : typeof $a.exports === "object" ? $a.exports = Za : $a.FlexSearch = Za;
}(this||self));
