/**!
 * FlexSearch.js v0.8.0 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var w;
function x(a, c, b) {
  const e = typeof b, f = typeof a;
  if ("undefined" !== e) {
    if ("undefined" !== f) {
      if (b) {
        if ("function" === f && e === f) {
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
            var d = new Map(b);
            for (var g of a) {
              d.set(g[0], g[1]);
            }
            return d;
          }
          if (c === Set) {
            g = new Set(b);
            for (d of a.values()) {
              g.add(d);
            }
            return g;
          }
        }
      }
      return a;
    }
    return b;
  }
  return "undefined" === f ? c : a;
}
function y() {
  return Object.create(null);
}
function aa(a, c) {
  return c.length - a.length;
}
function z(a) {
  return "string" === typeof a;
}
function E(a) {
  return "object" === typeof a;
}
function F(a, c) {
  if (z(c)) {
    a = a[c];
  } else {
    for (let b = 0; a && b < c.length; b++) {
      a = a[c[b]];
    }
  }
  return a;
}
;var ba = [["\u00aa", "a"], ["\u00b2", "2"], ["\u00b3", "3"], ["\u00b9", "1"], ["\u00ba", "o"], ["\u00bc", "1\u20444"], ["\u00bd", "1\u20442"], ["\u00be", "3\u20444"], ["\u00e0", "a"], ["\u00e1", "a"], ["\u00e2", "a"], ["\u00e3", "a"], ["\u00e4", "a"], ["\u00e5", "a"], ["\u00e7", "c"], ["\u00e8", "e"], ["\u00e9", "e"], ["\u00ea", "e"], ["\u00eb", "e"], ["\u00ec", "i"], ["\u00ed", "i"], ["\u00ee", "i"], ["\u00ef", "i"], ["\u00f1", "n"], ["\u00f2", "o"], ["\u00f3", "o"], ["\u00f4", "o"], ["\u00f5", 
"o"], ["\u00f6", "o"], ["\u00f9", "u"], ["\u00fa", "u"], ["\u00fb", "u"], ["\u00fc", "u"], ["\u00fd", "y"], ["\u00ff", "y"], ["\u0101", "a"], ["\u0103", "a"], ["\u0105", "a"], ["\u0107", "c"], ["\u0109", "c"], ["\u010b", "c"], ["\u010d", "c"], ["\u010f", "d"], ["\u0113", "e"], ["\u0115", "e"], ["\u0117", "e"], ["\u0119", "e"], ["\u011b", "e"], ["\u011d", "g"], ["\u011f", "g"], ["\u0121", "g"], ["\u0123", "g"], ["\u0125", "h"], ["\u0129", "i"], ["\u012b", "i"], ["\u012d", "i"], ["\u012f", "i"], ["\u0133", 
"ij"], ["\u0135", "j"], ["\u0137", "k"], ["\u013a", "l"], ["\u013c", "l"], ["\u013e", "l"], ["\u0140", "l"], ["\u0144", "n"], ["\u0146", "n"], ["\u0148", "n"], ["\u0149", "n"], ["\u014d", "o"], ["\u014f", "o"], ["\u0151", "o"], ["\u0155", "r"], ["\u0157", "r"], ["\u0159", "r"], ["\u015b", "s"], ["\u015d", "s"], ["\u015f", "s"], ["\u0161", "s"], ["\u0163", "t"], ["\u0165", "t"], ["\u0169", "u"], ["\u016b", "u"], ["\u016d", "u"], ["\u016f", "u"], ["\u0171", "u"], ["\u0173", "u"], ["\u0175", "w"], ["\u0177", 
"y"], ["\u017a", "z"], ["\u017c", "z"], ["\u017e", "z"], ["\u017f", "s"], ["\u01a1", "o"], ["\u01b0", "u"], ["\u01c6", "dz"], ["\u01c9", "lj"], ["\u01cc", "nj"], ["\u01ce", "a"], ["\u01d0", "i"], ["\u01d2", "o"], ["\u01d4", "u"], ["\u01d6", "u"], ["\u01d8", "u"], ["\u01da", "u"], ["\u01dc", "u"], ["\u01df", "a"], ["\u01e1", "a"], ["\u01e3", "ae"], ["\u00e6", "ae"], ["\u01fd", "ae"], ["\u01e7", "g"], ["\u01e9", "k"], ["\u01eb", "o"], ["\u01ed", "o"], ["\u01ef", "\u0292"], ["\u01f0", "j"], ["\u01f3", 
"dz"], ["\u01f5", "g"], ["\u01f9", "n"], ["\u01fb", "a"], ["\u01ff", "\u00f8"], ["\u0201", "a"], ["\u0203", "a"], ["\u0205", "e"], ["\u0207", "e"], ["\u0209", "i"], ["\u020b", "i"], ["\u020d", "o"], ["\u020f", "o"], ["\u0211", "r"], ["\u0213", "r"], ["\u0215", "u"], ["\u0217", "u"], ["\u0219", "s"], ["\u021b", "t"], ["\u021f", "h"], ["\u0227", "a"], ["\u0229", "e"], ["\u022b", "o"], ["\u022d", "o"], ["\u022f", "o"], ["\u0231", "o"], ["\u0233", "y"], ["\u02b0", "h"], ["\u02b1", "h"], ["\u0266", "h"], 
["\u02b2", "j"], ["\u02b3", "r"], ["\u02b4", "\u0279"], ["\u02b5", "\u027b"], ["\u02b6", "\u0281"], ["\u02b7", "w"], ["\u02b8", "y"], ["\u02e0", "\u0263"], ["\u02e1", "l"], ["\u02e2", "s"], ["\u02e3", "x"], ["\u02e4", "\u0295"], ["\u0390", "\u03b9"], ["\u03ac", "\u03b1"], ["\u03ad", "\u03b5"], ["\u03ae", "\u03b7"], ["\u03af", "\u03b9"], ["\u03b0", "\u03c5"], ["\u03ca", "\u03b9"], ["\u03cb", "\u03c5"], ["\u03cc", "\u03bf"], ["\u03cd", "\u03c5"], ["\u03ce", "\u03c9"], ["\u03d0", "\u03b2"], ["\u03d1", 
"\u03b8"], ["\u03d2", "\u03a5"], ["\u03d3", "\u03a5"], ["\u03d4", "\u03a5"], ["\u03d5", "\u03c6"], ["\u03d6", "\u03c0"], ["\u03f0", "\u03ba"], ["\u03f1", "\u03c1"], ["\u03f2", "\u03c2"], ["\u03f5", "\u03b5"], ["\u0439", "\u0438"], ["\u0450", "\u0435"], ["\u0451", "\u0435"], ["\u0453", "\u0433"], ["\u0457", "\u0456"], ["\u045c", "\u043a"], ["\u045d", "\u0438"], ["\u045e", "\u0443"], ["\u0477", "\u0475"], ["\u04c2", "\u0436"], ["\u04d1", "\u0430"], ["\u04d3", "\u0430"], ["\u04d7", "\u0435"], ["\u04db", 
"\u04d9"], ["\u04dd", "\u0436"], ["\u04df", "\u0437"], ["\u04e3", "\u0438"], ["\u04e5", "\u0438"], ["\u04e7", "\u043e"], ["\u04eb", "\u04e9"], ["\u04ed", "\u044d"], ["\u04ef", "\u0443"], ["\u04f1", "\u0443"], ["\u04f3", "\u0443"], ["\u04f5", "\u0447"]];
const ca = /[^\p{L}\p{N}]+/u, da = /(\d{3})/g, ea = /(\D)(\d{3})/g, fa = /(\d{3})(\D)/g, I = "".normalize && /[\u0300-\u036f]/g;
function J(a) {
  if (!this) {
    return new J(...arguments);
  }
  for (let c = 0; c < arguments.length; c++) {
    this.assign(arguments[c]);
  }
}
J.prototype.assign = function(a) {
  this.normalize = x(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split;
  if ("object" === typeof b) {
    let e = !c, f = "";
    a.include || (f += "\\p{Z}");
    b.letter && (f += "\\p{L}");
    b.number && (f += "\\p{N}", e = !!c);
    b.symbol && (f += "\\p{S}");
    b.punctuation && (f += "\\p{P}");
    b.control && (f += "\\p{C}");
    if (b = b.char) {
      f += "object" === typeof b ? b.join("") : b;
    }
    this.split = new RegExp("[" + (c ? "^" : "") + f + "]+", "u");
    this.numeric = e;
  } else {
    this.split = x(b, ca, this.split), this.numeric = x(this.numeric, !0);
  }
  this.prepare = x(a.prepare, null, this.prepare);
  this.finalize = x(a.finalize, null, this.finalize);
  I || (this.mapper = new Map(ba));
  this.rtl = a.rtl || !1;
  this.dedupe = x(a.dedupe, !0, this.dedupe);
  this.filter = x((b = a.filter) && new Set(b), null, this.filter);
  this.matcher = x((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = x((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = x((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = x(a.replacer, null, this.replacer);
  this.minlength = x(a.minlength, 1, this.minlength);
  this.maxlength = x(a.maxlength, 0, this.maxlength);
  this.F = "";
  this.H = null;
  this.D = "";
  this.I = null;
  if (this.matcher) {
    for (const e of this.matcher.keys()) {
      this.F += (this.F ? "|" : "") + e;
    }
  }
  if (this.stemmer) {
    for (const e of this.stemmer.keys()) {
      this.D += (this.D ? "|" : "") + e;
    }
  }
  return this;
};
J.prototype.encode = function(a) {
  this.normalize && (a = "function" === typeof this.normalize ? this.normalize(a) : I ? a.normalize("NFKD").replace(I, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ea, "$1 $2").replace(fa, "$1 $2").replace(da, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let b = [];
  a = this.split || "" === this.split ? a.split(this.split) : a;
  for (let f = 0, d; f < a.length; f++) {
    if (!(d = a[f])) {
      continue;
    }
    if (d.length < this.minlength) {
      continue;
    }
    if (c) {
      b.push(d);
      continue;
    }
    if (this.filter && this.filter.has(d)) {
      continue;
    }
    let g;
    this.stemmer && 2 < d.length && (this.I || (this.I = new RegExp("(?!^)(" + this.D + ")$")), d = d.replace(this.I, h => this.stemmer.get(h)), g = 1);
    this.matcher && 1 < d.length && (this.H || (this.H = new RegExp("(" + this.F + ")", "g")), d = d.replace(this.H, h => this.matcher.get(h)), g = 1);
    d && g && (d.length < this.minlength || this.filter && this.filter.has(d)) && (d = "");
    if (d && (this.mapper || this.dedupe && 1 < d.length)) {
      var e = "";
      for (let h = 0, k = "", n, l; h < d.length; h++) {
        n = d.charAt(h), n === k && this.dedupe || ((l = this.mapper && this.mapper.get(n)) || "" === l ? l === k && this.dedupe || !(k = l) || (e += l) : e += k = n);
      }
      d = e;
    }
    if (d && this.replacer) {
      for (e = 0; d && e < this.replacer.length; e += 2) {
        d = d.replace(this.replacer[e], this.replacer[e + 1]);
      }
    }
    d && b.push(d);
  }
  this.finalize && (b = this.finalize(b) || b);
  return b;
};
const K = {normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1};
const L = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const M = new Map([["ai", "ei"], ["ae", "a"], ["oe", "o"], ["ue", "u"], ["sh", "s"], ["ch", "c"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), ha = [/([^aeo])h([aeo$])/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2"];
const ia = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const ja = /[\x00-\x7F]+/g;
const ka = /[\x00-\x7F]+/g;
const la = /[\x00-\x7F]+/g;
var ma = {LatinExact:{normalize:!1, dedupe:!1}, LatinDefault:K, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:L}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:L, replacer:ha, matcher:M}, LatinExtra:{normalize:!0, dedupe:!0, mapper:L, replacer:ha.concat([/(?!^)[aeoy]/g, ""]), matcher:M}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let e = c.charAt(0), f = ia[e];
    for (let d = 1, g; d < c.length && (g = c.charAt(d), "h" === g || "w" === g || !(g = ia[g]) || g === f || (e += g, f = g, 4 !== e.length)); d++) {
    }
    a[b] = e;
  }
}}, ArabicDefault:{rtl:!0, normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(ja, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(ka, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(la, " ");
}}};
function na(a, c, b, e, f, d, g, h) {
  (e = a(b ? b + "." + e : e, JSON.stringify(g))) && e.then ? e.then(function() {
    c.export(a, c, b, f, d + 1, h);
  }) : c.export(a, c, b, f, d + 1, h);
}
;const oa = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
function pa(a) {
  N.call(a, "add");
  N.call(a, "append");
  N.call(a, "search");
  N.call(a, "update");
  N.call(a, "remove");
}
function N(a) {
  this[a + "Async"] = function() {
    var c = arguments;
    const b = c[c.length - 1];
    let e;
    "function" === typeof b && (e = b, delete c[c.length - 1]);
    this.async = !0;
    c = this[a].apply(this, c);
    this.async = !1;
    e && (c.then ? c.then(e) : e(c));
    return c;
  };
}
;y();
O.prototype.add = function(a, c, b, e) {
  if (c && (a || 0 === a)) {
    if (!e && !b && this.h.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (e = c.length) {
      const n = y(), l = y(), r = this.depth, t = this.resolution;
      for (let p = 0; p < e; p++) {
        let m = c[this.rtl ? e - 1 - p : p];
        var f = m.length;
        if (f && (r || !l[m])) {
          var d = this.score ? this.score(c, m, p, null, 0) : P(t, e, p), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < f) {
                for (d = 0; d < f; d++) {
                  for (var h = f; h > d; h--) {
                    g = m.substring(d, h);
                    var k = this.score ? this.score(c, m, p, g, d) : P(t, e, p, f, d);
                    Q(this, l, g, k, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < f) {
                for (h = f - 1; 0 < h; h--) {
                  g = m[h] + g, k = this.score ? this.score(c, m, p, g, h) : P(t, e, p, f, h), Q(this, l, g, k, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < f) {
                for (h = 0; h < f; h++) {
                  g += m[h], Q(this, l, g, d, a, b);
                }
                break;
              }
            default:
              if (Q(this, l, m, d, a, b), r && 1 < e && p < e - 1) {
                for (f = y(), g = this.K, d = m, h = Math.min(r + 1, e - p), f[d] = 1, k = 1; k < h; k++) {
                  if ((m = c[this.rtl ? e - 1 - p - k : p + k]) && !f[m]) {
                    f[m] = 1;
                    const u = this.score ? this.score(c, d, p, m, k) : P(g + (e / 2 > g ? 0 : 1), e, p, h - 1, k - 1), B = this.bidirectional && m > d;
                    Q(this, n, B ? d : m, u, a, b, B ? m : d);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || this.h.add(a);
    }
  }
  return this;
};
function Q(a, c, b, e, f, d, g) {
  let h = g ? a.B : a.map, k;
  c[b] && g && (k = c[b])[g] || (g ? (c = k || (c[b] = y()), c[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[e] || (h[e] = []), d && h.includes(f) || (h.push(f), a.fastupdate && ((c = a.h.get(f)) ? c.push(h) : a.h.set(f, [h]))));
}
function P(a, c, b, e, f) {
  return b && 1 < a ? c + (e || 0) <= a ? b + (f || 0) : (a - 1) / (c + (e || 0)) * (b + (f || 0)) + 1 | 0 : 0;
}
;function R(a, c, b) {
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a;
  }
  let e = [];
  for (let f = 0, d, g; f < a.length; f++) {
    if ((d = a[f]) && (g = d.length)) {
      if (b) {
        if (b >= g) {
          b -= g;
          continue;
        }
        b < g && (d = c ? d.slice(b, b + c) : d.slice(b), g = d.length, b = 0);
      }
      if (e.length) {
        g > c && (d = d.slice(0, c), g = d.length), e.push(d);
      } else {
        if (g >= c) {
          return g > c && (d = d.slice(0, c)), d;
        }
        e = [d];
      }
      c -= g;
      if (!c) {
        break;
      }
    }
  }
  return e.length ? e = 1 < e.length ? [].concat.apply([], e) : e[0] : e;
}
;function qa(a, c, b, e) {
  var f = a.length;
  let d = [], g = 0, h, k, n;
  e && (e = []);
  for (let l = f - 1, r; 0 <= l; l--) {
    n = a[l];
    f = y();
    r = !h;
    for (let t = 0, p; t < n.length; t++) {
      if ((p = n[t]) && p.length) {
        for (let m = 0, u; m < p.length; m++) {
          if (u = p[m], h) {
            if (h[u]) {
              if (!l) {
                if (b) {
                  b--;
                } else {
                  if (d[g++] = u, g === c) {
                    return d;
                  }
                }
              }
              if (l || e) {
                f[u] = 1;
              }
              r = !0;
            }
            e && !k[u] && (k[u] = 1, (e[t] || (e[t] = [])).push(u));
          } else {
            f[u] = 1;
          }
        }
      }
    }
    if (e) {
      h || (k = f);
    } else if (!r) {
      return [];
    }
    h = f;
  }
  if (e) {
    for (let l = e.length - 1, r, t; 0 <= l; l--) {
      r = e[l];
      t = r.length;
      for (let p = 0, m; p < t; p++) {
        if (m = r[p], !h[m]) {
          if (b) {
            b--;
          } else {
            if (d[g++] = m, g === c) {
              return d;
            }
          }
          h[m] = 1;
        }
      }
    }
  }
  return d;
}
function ra(a, c) {
  const b = y(), e = y(), f = [];
  for (let d = 0; d < a.length; d++) {
    b[a[d]] = 1;
  }
  for (let d = 0, g; d < c.length; d++) {
    g = c[d];
    for (let h = 0, k; h < g.length; h++) {
      k = g[h], b[k] && !e[k] && (e[k] = 1, f.push(k));
    }
  }
  return f;
}
;O.prototype.search = function(a, c, b) {
  b || (!c && E(a) ? (b = a, a = "") : E(c) && (b = c, c = 0));
  let e = [];
  let f, d = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    d = b.offset || 0;
    var g = b.context;
    f = b.suggest;
  }
  a = this.encoder.encode(a);
  b = a.length;
  c || (c = 100);
  if (1 === b) {
    return S.call(this, a[0], "", c, d);
  }
  g = this.depth && !1 !== g;
  if (2 === b && g && !f) {
    return S.call(this, a[0], a[1], c, d);
  }
  let h = 0, k = 0;
  if (1 < b) {
    var n = y();
    const r = [];
    for (let t = 0, p; t < b; t++) {
      if ((p = a[t]) && !n[p]) {
        if (f || T(this, p)) {
          r.push(p), n[p] = 1;
        } else {
          return e;
        }
        const m = p.length;
        h = Math.max(h, m);
        k = k ? Math.min(k, m) : m;
      }
    }
    a = r;
    b = a.length;
  }
  if (!b) {
    return e;
  }
  n = 0;
  let l;
  if (1 === b) {
    return S.call(this, a[0], "", c, d);
  }
  if (2 === b && g && !f) {
    return S.call(this, a[0], a[1], c, d);
  }
  1 < b && (g ? (l = a[0], n = 1) : 9 < h && 3 < h / k && a.sort(aa));
  for (let r, t; n < b; n++) {
    t = a[n];
    l ? (r = T(this, t, l), r = sa(r, e, f, this.K, c, d, 2 === b), f && !1 === r && e.length || (l = t)) : (r = T(this, t), r = sa(r, e, f, this.resolution, c, d, 1 === b));
    if (r) {
      return r;
    }
    if (f && n === b - 1) {
      g = e.length;
      if (!g) {
        if (l) {
          l = "";
          n = -1;
          continue;
        }
        return e;
      }
      if (1 === g) {
        return R(e[0], c, d);
      }
    }
  }
  return qa(e, c, d, f);
};
function S(a, c, b, e) {
  return (a = T(this, a, c)) && a.length ? R(a, b, e) : [];
}
function sa(a, c, b, e, f, d, g) {
  let h = [];
  if (a) {
    e = Math.min(a.length, e);
    for (let k = 0, n = 0, l; k < e; k++) {
      if (l = a[k]) {
        if (d && l && g && (l.length <= d ? (d -= l.length, l = null) : (l = l.slice(d), d = 0)), l && (h[k] = l, g && (n += l.length, n >= f))) {
          break;
        }
      }
    }
    if (h.length) {
      if (g) {
        return R(h, f, 0);
      }
      c.push(h);
      return;
    }
  }
  return !b && h;
}
function T(a, c, b) {
  let e;
  b && (e = a.bidirectional && c > b);
  a = b ? (a = a.B.get(e ? c : b)) && a.get(e ? b : c) : a.map.get(c);
  return a;
}
;O.prototype.remove = function(a, c) {
  const b = this.h.size && (this.fastupdate ? this.h.get(a) : this.h.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let e = 0, f; e < b.length; e++) {
        if (f = b[e]) {
          if (2 > f.length) {
            f.pop();
          } else {
            const d = f.indexOf(a);
            d === b.length - 1 ? f.pop() : f.splice(d, 1);
          }
        }
      }
    } else {
      U(this.map, a), this.depth && U(this.B, a);
    }
    c || this.h.delete(a);
  }
  return this;
};
function U(a, c) {
  let b = 0;
  if (a.constructor === Array) {
    for (let e = 0, f, d; e < a.length; e++) {
      if ((f = a[e]) && f.length) {
        if (d = f.indexOf(c), 0 <= d) {
          1 < f.length ? (f.splice(d, 1), b++) : delete a[e];
          break;
        } else {
          b++;
        }
      }
    }
  } else {
    for (let e of a) {
      const f = e[0], d = U(e[1], c);
      d ? b += d : a.delete(f);
    }
  }
  return b;
}
;function O(a, c) {
  if (!this) {
    return new O(a);
  }
  if (a) {
    var b = z(a) ? a : a.preset;
    b && (oa[b] || console.warn("Preset not found: " + b), a = Object.assign({}, oa[b], a));
  } else {
    a = {};
  }
  b = a.context || {};
  const e = a.encode || a.encoder || K;
  this.encoder = e.encode ? e : "object" === typeof e ? new J(e) : {encode:e};
  let f;
  this.resolution = a.resolution || 9;
  this.tokenize = f = a.tokenize || "strict";
  this.depth = "strict" === f && b.depth || 0;
  this.bidirectional = !1 !== b.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  this.map = new Map();
  this.B = new Map();
  this.h = c || (this.fastupdate ? new Map() : new Set());
  this.K = b.resolution || 1;
  this.rtl = e.rtl || a.rtl || !1;
}
w = O.prototype;
w.clear = function() {
  this.map.clear();
  this.B.clear();
  this.h.clear();
  return this;
};
w.append = function(a, c) {
  return this.add(a, c, !0);
};
w.contain = function(a) {
  return this.h.has(a);
};
w.update = function(a, c) {
  if (this.async) {
    const b = this, e = this.remove(a);
    return e.then ? e.then(() => b.add(a, c)) : this.add(a, c);
  }
  return this.remove(a).add(a, c);
};
function V(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, e; b < a.length; b++) {
      (e = a[b]) && (c += e.length);
    }
  } else {
    for (const b of a) {
      const e = b[0], f = V(b[1]);
      f ? c += f : a.delete(e);
    }
  }
  return c;
}
w.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  V(this.map);
  this.depth && V(this.B);
  return this;
};
w.export = function(a, c, b, e, f, d) {
  let g = !0;
  "undefined" === typeof d && (g = new Promise(n => {
    d = n;
  }));
  let h, k;
  switch(f || (f = 0)) {
    case 0:
      h = "reg";
      if (this.fastupdate) {
        k = y();
        for (let n of this.h.keys()) {
          k[n] = 1;
        }
      } else {
        k = this.h;
      }
      break;
    case 1:
      h = "cfg";
      k = {doc:0, opt:this.F ? 1 : 0};
      break;
    case 2:
      h = "map";
      k = this.map;
      break;
    case 3:
      h = "ctx";
      k = this.B;
      break;
    default:
      "undefined" === typeof b && d && d();
      return;
  }
  na(a, c || this, b, h, e, f, k, d);
  return g;
};
w.import = function(a, c) {
  if (c) {
    switch(z(c) && (c = JSON.parse(c)), a) {
      case "cfg":
        this.F = !!c.opt;
        break;
      case "reg":
        this.fastupdate = !1;
        this.h = c;
        break;
      case "map":
        this.map = c;
        break;
      case "ctx":
        this.B = c;
    }
  }
};
pa(O.prototype);
W.prototype.add = function(a, c, b) {
  E(a) && (c = a, a = F(c, this.key));
  if (c && (a || 0 === a)) {
    if (!b && this.h.has(a)) {
      return this.update(a, c);
    }
    for (let f = 0, d; f < this.field.length; f++) {
      d = this.C[f];
      const g = this.index.get(this.field[f]);
      if ("function" === typeof d) {
        var e = d(c);
        e && g.add(a, e, !1, !0);
      } else {
        if (e = d.J, !e || e(c)) {
          d.constructor === String ? d = ["" + d] : z(d) && (d = [d]), X(c, d, this.G, 0, g, a, d[0], b);
        }
      }
    }
    if (this.store && (!b || !this.store.has(a))) {
      let f;
      if (this.A) {
        f = y();
        for (let d = 0, g; d < this.A.length; d++) {
          g = this.A[d];
          if ((b = g.J) && !b(c)) {
            continue;
          }
          let h;
          if ("function" === typeof g) {
            h = g(c);
            if (!h) {
              continue;
            }
            g = [g.L];
          } else if (z(g) || g.constructor === String) {
            f[g] = c[g];
            continue;
          }
          Y(c, f, g, 0, g[0], h);
        }
      }
      this.store.set(a, f || c);
    }
  }
  return this;
};
function Y(a, c, b, e, f, d) {
  a = a[f];
  if (e === b.length - 1) {
    c[f] = d || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (c = c[f] = Array(a.length), f = 0; f < a.length; f++) {
        Y(a, c, b, e, f);
      }
    } else {
      c = c[f] || (c[f] = y()), f = b[++e], Y(a, c, b, e, f);
    }
  }
}
function X(a, c, b, e, f, d, g, h) {
  if (a = a[g]) {
    if (e === c.length - 1) {
      if (a.constructor === Array) {
        if (b[e]) {
          for (c = 0; c < a.length; c++) {
            f.add(d, a[c], !0, !0);
          }
          return;
        }
        a = a.join(" ");
      }
      f.add(d, a, h, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          X(a, c, b, e, f, d, g, h);
        }
      } else {
        g = c[++e], X(a, c, b, e, f, d, g, h);
      }
    }
  }
}
;W.prototype.search = function(a, c, b, e) {
  b || (!c && E(a) ? (b = a, a = "") : E(c) && (b = c, c = 0));
  let f = [];
  var d = [];
  let g, h, k, n, l;
  let r = 0;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    var t = b.pluck;
    h = b.merge;
    n = t || b.field || b.index;
    l = !1;
    g = this.store && b.enrich;
    k = b.suggest;
    c = b.limit || c;
    var p = b.offset || 0;
    c || (c = 100);
    if (l) {
      l.constructor !== Array && (l = [l]);
      var m = [];
      for (let v = 0, q; v < l.length; v++) {
        q = l[v];
        if (z(q)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (q.field && q.tag) {
          var u = q.tag;
          if (u.constructor === Array) {
            for (var B = 0; B < u.length; B++) {
              m.push(q.field, u[B]);
            }
          } else {
            m.push(q.field, u);
          }
        } else {
          u = Object.keys(q);
          for (let C = 0, D, A; C < u.length; C++) {
            if (D = u[C], A = q[D], A.constructor === Array) {
              for (B = 0; B < A.length; B++) {
                m.push(D, A[B]);
              }
            } else {
              m.push(D, A);
            }
          }
        }
      }
      if (!m.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      l = m;
      if (!a) {
        e = [];
        if (m.length) {
          for (d = 0; d < m.length; d += 2) {
            t = ta.call(this, m[d], m[d + 1], c, p, g), f.push({field:m[d], tag:m[d + 1], result:t});
          }
        }
        return e.length ? Promise.all(e).then(function(v) {
          for (let q = 0; q < v.length; q++) {
            f[q].result = v[q];
          }
          return f;
        }) : f;
      }
    }
    z(n) && (n = [n]);
  }
  n || (n = this.field);
  p = !e && (this.worker || this.async) && [];
  for (let v = 0, q, C, D; v < n.length; v++) {
    C = n[v];
    let A;
    z(C) || (A = C, C = A.field, a = A.query || a, c = A.limit || c, k = A.suggest || k);
    if (e) {
      q = e[v];
    } else {
      if (m = A || b, u = this.index.get(C), l && (m.enrich = !1), p) {
        p[v] = u.searchAsync(a, c, m);
        m && g && (m.enrich = g);
        continue;
      } else {
        q = u.search(a, c, m), m && g && (m.enrich = g);
      }
    }
    D = q && q.length;
    if (l && D) {
      m = [];
      u = 0;
      for (let G = 0, H, va; G < l.length; G += 2) {
        H = this.tag.get(l[G]);
        if (!H) {
          if (console.warn("Tag '" + l[G] + ":" + l[G + 1] + "' will be skipped because there is no field '" + l[G] + "'."), k) {
            continue;
          } else {
            return f;
          }
        }
        if (va = (H = H && H.get(l[G + 1])) && H.length) {
          u++, m.push(H);
        } else if (!k) {
          return f;
        }
      }
      if (u) {
        q = ra(q, m);
        D = q.length;
        if (!D && !k) {
          return f;
        }
        u--;
      }
    }
    if (D) {
      d[r] = C, f.push(q), r++;
    } else if (1 === n.length) {
      return f;
    }
  }
  if (p) {
    const v = this;
    return Promise.all(p).then(function(q) {
      return q.length ? v.search(a, c, b, q) : q;
    });
  }
  if (!r) {
    return f;
  }
  if (t && (!g || !this.store)) {
    return f[0];
  }
  p = [];
  for (let v = 0, q; v < d.length; v++) {
    q = f[v];
    g && q.length && !q[0].doc && q.length && (q = ua.call(this, q));
    if (t) {
      return q;
    }
    f[v] = {field:d[v], result:q};
  }
  return h ? wa(f, c) : f;
};
function wa(a, c) {
  const b = [], e = y();
  for (let f = 0, d, g; f < a.length; f++) {
    d = a[f];
    g = d.result;
    for (let h = 0, k, n, l; h < g.length; h++) {
      if (n = g[h], k = n.id, l = e[k]) {
        l.push(d.field);
      } else {
        if (b.length === c) {
          return b;
        }
        n.field = e[k] = [d.field];
        b.push(n);
      }
    }
  }
  return b;
}
function ta(a, c, b, e, f) {
  let d = this.tag.get(a);
  if (!d) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (d = d && d.get(c)) && d.length - e) && 0 < a) {
    if (a > b || e) {
      d = d.slice(e, e + b);
    }
    f && (d = ua.call(this, d));
    return d;
  }
}
function ua(a) {
  const c = Array(a.length);
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c[b] = {id:e, doc:this.store.get(e)};
  }
  return c;
}
;function W(a) {
  if (!this) {
    return new W(a);
  }
  const c = a.document || a.doc || a;
  var b;
  this.C = [];
  this.field = [];
  this.G = [];
  this.key = (b = c.key || c.id) && Z(b, this.G) || "id";
  this.h = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.A = (b = c.store || null) && !0 !== b && [];
  this.store = b && new Map();
  this.async = !1;
  b = new Map();
  let e = c.index || c.field || c;
  z(e) && (e = [e]);
  for (let f = 0, d, g; f < e.length; f++) {
    d = e[f], z(d) || (g = d, d = d.field), g = E(g) ? Object.assign({}, a, g) : a, b.set(d, new O(g, this.h)), g.custom ? this.C[f] = g.custom : (this.C[f] = Z(d, this.G), g.filter && ("string" === typeof this.C[f] && (this.C[f] = new String(this.C[f])), this.C[f].J = g.filter)), this.field[f] = d;
  }
  if (this.A) {
    a = c.store;
    z(a) && (a = [a]);
    for (let f = 0, d, g; f < a.length; f++) {
      d = a[f], g = d.field || d, d.custom ? (this.A[f] = d.custom, d.custom.L = g) : (this.A[f] = Z(g, this.G), d.filter && ("string" === typeof this.A[f] && (this.A[f] = new String(this.A[f])), this.A[f].J = d.filter));
    }
  }
  this.index = b;
}
function Z(a, c) {
  const b = a.split(":");
  let e = 0;
  for (let f = 0; f < b.length; f++) {
    a = b[f], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (c[e] = !0), a && (b[e++] = a);
  }
  e < b.length && (b.length = e);
  return 1 < e ? b : b[0];
}
w = W.prototype;
w.append = function(a, c) {
  return this.add(a, c, !0);
};
w.update = function(a, c) {
  return this.remove(a).add(a, c);
};
w.remove = function(a) {
  E(a) && (a = F(a, this.key));
  for (const c of this.index.values()) {
    c.remove(a, !0);
  }
  this.h.has(a) && (this.store && this.store.delete(a), this.h.delete(a));
  return this;
};
w.clear = function() {
  for (const a of this.index.values()) {
    a.clear();
  }
  this.store && this.store.clear();
  return this;
};
w.contain = function(a) {
  return this.h.has(a);
};
w.cleanup = function() {
  for (const a of this.index.values()) {
    a.cleanup();
  }
  return this;
};
w.get = function(a) {
  return this.store.get(a);
};
w.set = function(a, c) {
  this.store.set(a, c);
  return this;
};
w.export = function(a, c, b, e, f, d) {
  let g;
  "undefined" === typeof d && (g = new Promise(k => {
    d = k;
  }));
  f || (f = 0);
  e || (e = 0);
  if (e < this.field.length) {
    b = this.field[e];
    var h = this.index[b];
    c = this;
    h.export(a, c, f ? b : "", e, f++, d) || (e++, c.export(a, c, b, e, 1, d));
  } else {
    switch(f) {
      case 1:
        c = "tag";
        h = this.D;
        b = null;
        break;
      case 2:
        c = "store";
        h = this.store;
        b = null;
        break;
      default:
        d();
        return;
    }
    na(a, this, b, c, e, f, h, d);
  }
  return g;
};
w.import = function(a, c) {
  if (c) {
    switch(z(c) && (c = JSON.parse(c)), a) {
      case "tag":
        this.D = c;
        break;
      case "reg":
        this.fastupdate = !1;
        this.h = c;
        for (let e = 0, f; e < this.field.length; e++) {
          f = this.index[this.field[e]], f.h = c, f.fastupdate = !1;
        }
        break;
      case "store":
        this.store = c;
        break;
      default:
        a = a.split(".");
        const b = a[0];
        a = a[1];
        b && a && this.index[b].import(a, c);
    }
  }
};
pa(W.prototype);
export default {Index:O, Charset:ma, Encoder:J, Document:W, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=O;export const  Charset=ma;export const  Encoder=J;export const  Document=W;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};