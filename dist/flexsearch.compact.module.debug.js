/**!
 * FlexSearch.js v0.8.0 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var v;
function x(a, b, c) {
  const e = typeof c, f = typeof a;
  if ("undefined" !== e) {
    if ("undefined" !== f) {
      if (c) {
        if ("function" === f && e === f) {
          return function(h) {
            return a(c(h));
          };
        }
        b = a.constructor;
        if (b === c.constructor) {
          if (b === Array) {
            return c.concat(a);
          }
          if (b === Map) {
            var d = new Map(c);
            for (var g of a) {
              d.set(g[0], g[1]);
            }
            return d;
          }
          if (b === Set) {
            g = new Set(c);
            for (d of a.values()) {
              g.add(d);
            }
            return g;
          }
        }
      }
      return a;
    }
    return c;
  }
  return "undefined" === f ? b : a;
}
function y() {
  return Object.create(null);
}
function aa(a, b) {
  return b.length - a.length;
}
function z(a) {
  return "string" === typeof a;
}
function E(a) {
  return "object" === typeof a;
}
function F(a, b) {
  if (z(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
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
  for (let b = 0; b < arguments.length; b++) {
    this.assign(arguments[b]);
  }
}
J.prototype.assign = function(a) {
  this.normalize = x(a.normalize, !0, this.normalize);
  let b = a.include, c = b || a.exclude || a.split;
  if ("object" === typeof c) {
    let e = !b, f = "";
    a.include || (f += "\\p{Z}");
    c.letter && (f += "\\p{L}");
    c.number && (f += "\\p{N}", e = !!b);
    c.symbol && (f += "\\p{S}");
    c.punctuation && (f += "\\p{P}");
    c.control && (f += "\\p{C}");
    if (c = c.char) {
      f += "object" === typeof c ? c.join("") : c;
    }
    this.split = new RegExp("[" + (b ? "^" : "") + f + "]+", "u");
    this.numeric = e;
  } else {
    this.split = x(c, ca, this.split), this.numeric = x(this.numeric, !0);
  }
  this.prepare = x(a.prepare, null, this.prepare);
  this.finalize = x(a.finalize, null, this.finalize);
  I || (this.mapper = new Map(ba));
  this.rtl = a.rtl || !1;
  this.dedupe = x(a.dedupe, !0, this.dedupe);
  this.filter = x((c = a.filter) && new Set(c), null, this.filter);
  this.matcher = x((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = x((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = x((c = a.stemmer) && new Map(c), null, this.stemmer);
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
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let c = [];
  a = this.split || "" === this.split ? a.split(this.split) : a;
  for (let f = 0, d; f < a.length; f++) {
    if (!(d = a[f])) {
      continue;
    }
    if (d.length < this.minlength) {
      continue;
    }
    if (b) {
      c.push(d);
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
      for (let h = 0, k = "", p, m; h < d.length; h++) {
        p = d.charAt(h), p === k && this.dedupe || ((m = this.mapper && this.mapper.get(p)) || "" === m ? m === k && this.dedupe || !(k = m) || (e += m) : e += k = p);
      }
      d = e;
    }
    if (d && this.replacer) {
      for (e = 0; d && e < this.replacer.length; e += 2) {
        d = d.replace(this.replacer[e], this.replacer[e + 1]);
      }
    }
    d && c.push(d);
  }
  this.finalize && (c = this.finalize(c) || c);
  return c;
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
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let e = b.charAt(0), f = ia[e];
    for (let d = 1, g; d < b.length && (g = b.charAt(d), "h" === g || "w" === g || !(g = ia[g]) || g === f || (e += g, f = g, 4 !== e.length)); d++) {
    }
    a[c] = e;
  }
}}, ArabicDefault:{rtl:!0, normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(ja, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(ka, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(la, " ");
}}};
function na(a, b, c, e, f, d, g, h) {
  (e = a(c ? c + "." + e : e, JSON.stringify(g))) && e.then ? e.then(function() {
    b.export(a, b, c, f, d + 1, h);
  }) : b.export(a, b, c, f, d + 1, h);
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
    var b = arguments;
    const c = b[b.length - 1];
    let e;
    "function" === typeof c && (e = c, delete b[b.length - 1]);
    this.async = !0;
    b = this[a].apply(this, b);
    this.async = !1;
    e && (b.then ? b.then(e) : e(b));
    return b;
  };
}
;y();
O.prototype.add = function(a, b, c, e) {
  if (b && (a || 0 === a)) {
    if (!e && !c && this.h.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (e = b.length) {
      const p = y(), m = y(), r = this.depth, t = this.resolution;
      for (let n = 0; n < e; n++) {
        let l = b[this.rtl ? e - 1 - n : n];
        var f = l.length;
        if (f && (r || !m[l])) {
          var d = this.score ? this.score(b, l, n, null, 0) : P(t, e, n), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < f) {
                for (d = 0; d < f; d++) {
                  for (var h = f; h > d; h--) {
                    g = l.substring(d, h);
                    var k = this.score ? this.score(b, l, n, g, d) : P(t, e, n, f, d);
                    Q(this, m, g, k, a, c);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < f) {
                for (h = f - 1; 0 < h; h--) {
                  g = l[h] + g, k = this.score ? this.score(b, l, n, g, h) : P(t, e, n, f, h), Q(this, m, g, k, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < f) {
                for (h = 0; h < f; h++) {
                  g += l[h], Q(this, m, g, d, a, c);
                }
                break;
              }
            default:
              if (Q(this, m, l, d, a, c), r && 1 < e && n < e - 1) {
                for (f = y(), g = this.K, d = l, h = Math.min(r + 1, e - n), f[d] = 1, k = 1; k < h; k++) {
                  if ((l = b[this.rtl ? e - 1 - n - k : n + k]) && !f[l]) {
                    f[l] = 1;
                    const w = this.score ? this.score(b, d, n, l, k) : P(g + (e / 2 > g ? 0 : 1), e, n, h - 1, k - 1), B = this.bidirectional && l > d;
                    Q(this, p, B ? d : l, w, a, c, B ? l : d);
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
function Q(a, b, c, e, f, d, g) {
  let h = g ? a.B : a.map, k;
  b[c] && g && (k = b[c])[g] || (g ? (b = k || (b[c] = y()), b[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : b[c] = 1, (k = h.get(c)) ? h = k : h.set(c, h = []), h = h[e] || (h[e] = []), d && h.includes(f) || (h.push(f), a.fastupdate && ((b = a.h.get(f)) ? b.push(h) : a.h.set(f, [h]))));
}
function P(a, b, c, e, f) {
  return c && 1 < a ? b + (e || 0) <= a ? c + (f || 0) : (a - 1) / (b + (e || 0)) * (c + (f || 0)) + 1 | 0 : 0;
}
;function R(a, b, c) {
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a;
  }
  let e = [];
  for (let f = 0, d, g; f < a.length; f++) {
    if ((d = a[f]) && (g = d.length)) {
      if (c) {
        if (c >= g) {
          c -= g;
          continue;
        }
        c < g && (d = b ? d.slice(c, c + b) : d.slice(c), g = d.length, c = 0);
      }
      if (e.length) {
        g > b && (d = d.slice(0, b), g = d.length), e.push(d);
      } else {
        if (g >= b) {
          return g > b && (d = d.slice(0, b)), d;
        }
        e = [d];
      }
      b -= g;
      if (!b) {
        break;
      }
    }
  }
  return e.length ? e = 1 < e.length ? [].concat.apply([], e) : e[0] : e;
}
;function qa(a, b) {
  const c = y(), e = y(), f = [];
  for (let d = 0; d < a.length; d++) {
    c[a[d]] = 1;
  }
  for (let d = 0, g; d < b.length; d++) {
    g = b[d];
    for (let h = 0, k; h < g.length; h++) {
      k = g[h], c[k] && !e[k] && (e[k] = 1, f.push(k));
    }
  }
  return f;
}
;O.prototype.search = function(a, b, c) {
  c || (!b && E(a) ? (c = a, a = "") : E(b) && (c = b, b = 0));
  var e = [], f = 0;
  if (c) {
    a = c.query || a;
    b = c.limit || b;
    f = c.offset || 0;
    var d = c.context;
    var g = c.suggest;
  }
  a = this.encoder.encode(a);
  c = a.length;
  b || (b = 100);
  if (1 === c) {
    return S.call(this, a[0], "", b, f);
  }
  d = this.depth && !1 !== d;
  if (2 === c && d && !g) {
    return S.call(this, a[0], a[1], b, f);
  }
  var h = 0, k = 0;
  if (1 < c) {
    var p = y();
    const r = [];
    for (let t = 0, n; t < c; t++) {
      if ((n = a[t]) && !p[n]) {
        if (g || T(this, n)) {
          r.push(n), p[n] = 1;
        } else {
          return e;
        }
        const l = n.length;
        h = Math.max(h, l);
        k = k ? Math.min(k, l) : l;
      }
    }
    a = r;
    c = a.length;
  }
  if (!c) {
    return e;
  }
  p = 0;
  if (1 === c) {
    return S.call(this, a[0], "", b, f);
  }
  if (2 === c && d && !g) {
    return S.call(this, a[0], a[1], b, f);
  }
  if (1 < c) {
    if (d) {
      var m = a[0];
      p = 1;
    } else {
      9 < h && 3 < h / k && a.sort(aa);
    }
  }
  for (let r, t; p < c; p++) {
    t = a[p];
    m ? (r = T(this, t, m), r = ra(r, e, g, this.K, b, f, 2 === c), g && !1 === r && e.length || (m = t)) : (r = T(this, t), r = ra(r, e, g, this.resolution, b, f, 1 === c));
    if (r) {
      return r;
    }
    if (g && p === c - 1) {
      d = e.length;
      if (!d) {
        if (m) {
          m = "";
          p = -1;
          continue;
        }
        return e;
      }
      if (1 === d) {
        return R(e[0], b, f);
      }
    }
  }
  a: {
    a = e;
    e = this.resolution;
    m = g;
    c = a.length;
    g = [];
    d = y();
    for (let r = 0, t, n, l, w; r < e; r++) {
      for (k = 0; k < c; k++) {
        if (l = a[k], r < l.length && (t = l[r])) {
          for (p = 0; p < t.length; p++) {
            n = t[p], (h = d[n]) ? d[n]++ : (h = 0, d[n] = 1), w = g[h] || (g[h] = []), w.push(n);
          }
        }
      }
    }
    if (a = g.length) {
      if (m) {
        e = [];
        for (let r = a - 1, t = 0, n, l; 0 <= r; r--) {
          if (n = g[r], l = n.length, f >= l) {
            f -= l;
          } else {
            if (l + t > b || f) {
              n = n.slice(f, b - t + f), l = n.length;
            }
            e.push(n);
            t += l;
            if (b === t) {
              break;
            }
          }
        }
        g = 1 < e.length ? [].concat.apply([], e) : e[0];
      } else {
        if (a < c) {
          e = [];
          break a;
        }
        g = g[a - 1];
        if (g.length > b || f) {
          g = g.slice(f, b + f);
        }
      }
    }
    e = g;
  }
  return e;
};
function S(a, b, c, e) {
  return (a = T(this, a, b)) && a.length ? R(a, c, e) : [];
}
function ra(a, b, c, e, f, d, g) {
  let h = [];
  if (a) {
    e = Math.min(a.length, e);
    for (let k = 0, p = 0, m; k < e; k++) {
      if (m = a[k]) {
        if (d && m && g && (m.length <= d ? (d -= m.length, m = null) : (m = m.slice(d), d = 0)), m && (h[k] = m, g && (p += m.length, p >= f))) {
          break;
        }
      }
    }
    if (h.length) {
      if (g) {
        return R(h, f, 0);
      }
      b.push(h);
      return;
    }
  }
  return !c && h;
}
function T(a, b, c) {
  let e;
  c && (e = a.bidirectional && b > c);
  a = c ? (a = a.B.get(e ? b : c)) && a.get(e ? c : b) : a.map.get(b);
  return a;
}
;O.prototype.remove = function(a, b) {
  const c = this.h.size && (this.fastupdate ? this.h.get(a) : this.h.has(a));
  if (c) {
    if (this.fastupdate) {
      for (let e = 0, f; e < c.length; e++) {
        if (f = c[e]) {
          if (2 > f.length) {
            f.pop();
          } else {
            const d = f.indexOf(a);
            d === c.length - 1 ? f.pop() : f.splice(d, 1);
          }
        }
      }
    } else {
      U(this.map, a), this.depth && U(this.B, a);
    }
    b || this.h.delete(a);
  }
  return this;
};
function U(a, b) {
  let c = 0;
  if (a.constructor === Array) {
    for (let e = 0, f, d; e < a.length; e++) {
      if ((f = a[e]) && f.length) {
        if (d = f.indexOf(b), 0 <= d) {
          1 < f.length ? (f.splice(d, 1), c++) : delete a[e];
          break;
        } else {
          c++;
        }
      }
    }
  } else {
    for (let e of a) {
      const f = e[0], d = U(e[1], b);
      d ? c += d : a.delete(f);
    }
  }
  return c;
}
;function O(a, b) {
  if (!this) {
    return new O(a);
  }
  if (a) {
    var c = z(a) ? a : a.preset;
    c && (oa[c] || console.warn("Preset not found: " + c), a = Object.assign({}, oa[c], a));
  } else {
    a = {};
  }
  c = a.context || {};
  const e = a.encode || a.encoder || K;
  this.encoder = e.encode ? e : "object" === typeof e ? new J(e) : {encode:e};
  let f;
  this.resolution = a.resolution || 9;
  this.tokenize = f = a.tokenize || "strict";
  this.depth = "strict" === f && c.depth || 0;
  this.bidirectional = !1 !== c.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  this.map = new Map();
  this.B = new Map();
  this.h = b || (this.fastupdate ? new Map() : new Set());
  this.K = c.resolution || 1;
  this.rtl = e.rtl || a.rtl || !1;
}
v = O.prototype;
v.clear = function() {
  this.map.clear();
  this.B.clear();
  this.h.clear();
  return this;
};
v.append = function(a, b) {
  return this.add(a, b, !0);
};
v.contain = function(a) {
  return this.h.has(a);
};
v.update = function(a, b) {
  if (this.async) {
    const c = this, e = this.remove(a);
    return e.then ? e.then(() => c.add(a, b)) : this.add(a, b);
  }
  return this.remove(a).add(a, b);
};
function V(a) {
  let b = 0;
  if (a.constructor === Array) {
    for (let c = 0, e; c < a.length; c++) {
      (e = a[c]) && (b += e.length);
    }
  } else {
    for (const c of a) {
      const e = c[0], f = V(c[1]);
      f ? b += f : a.delete(e);
    }
  }
  return b;
}
v.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  V(this.map);
  this.depth && V(this.B);
  return this;
};
v.export = function(a, b, c, e, f, d) {
  let g = !0;
  "undefined" === typeof d && (g = new Promise(p => {
    d = p;
  }));
  let h, k;
  switch(f || (f = 0)) {
    case 0:
      h = "reg";
      if (this.fastupdate) {
        k = y();
        for (let p of this.h.keys()) {
          k[p] = 1;
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
      "undefined" === typeof c && d && d();
      return;
  }
  na(a, b || this, c, h, e, f, k, d);
  return g;
};
v.import = function(a, b) {
  if (b) {
    switch(z(b) && (b = JSON.parse(b)), a) {
      case "cfg":
        this.F = !!b.opt;
        break;
      case "reg":
        this.fastupdate = !1;
        this.h = b;
        break;
      case "map":
        this.map = b;
        break;
      case "ctx":
        this.B = b;
    }
  }
};
pa(O.prototype);
W.prototype.add = function(a, b, c) {
  E(a) && (b = a, a = F(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.h.has(a)) {
      return this.update(a, b);
    }
    for (let f = 0, d; f < this.field.length; f++) {
      d = this.C[f];
      const g = this.index.get(this.field[f]);
      if ("function" === typeof d) {
        var e = d(b);
        e && g.add(a, e, !1, !0);
      } else {
        if (e = d.J, !e || e(b)) {
          d.constructor === String ? d = ["" + d] : z(d) && (d = [d]), X(b, d, this.G, 0, g, a, d[0], c);
        }
      }
    }
    if (this.store && (!c || !this.store.has(a))) {
      let f;
      if (this.A) {
        f = y();
        for (let d = 0, g; d < this.A.length; d++) {
          g = this.A[d];
          if ((c = g.J) && !c(b)) {
            continue;
          }
          let h;
          if ("function" === typeof g) {
            h = g(b);
            if (!h) {
              continue;
            }
            g = [g.L];
          } else if (z(g) || g.constructor === String) {
            f[g] = b[g];
            continue;
          }
          Y(b, f, g, 0, g[0], h);
        }
      }
      this.store.set(a, f || b);
    }
  }
  return this;
};
function Y(a, b, c, e, f, d) {
  a = a[f];
  if (e === c.length - 1) {
    b[f] = d || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[f] = Array(a.length), f = 0; f < a.length; f++) {
        Y(a, b, c, e, f);
      }
    } else {
      b = b[f] || (b[f] = y()), f = c[++e], Y(a, b, c, e, f);
    }
  }
}
function X(a, b, c, e, f, d, g, h) {
  if (a = a[g]) {
    if (e === b.length - 1) {
      if (a.constructor === Array) {
        if (c[e]) {
          for (b = 0; b < a.length; b++) {
            f.add(d, a[b], !0, !0);
          }
          return;
        }
        a = a.join(" ");
      }
      f.add(d, a, h, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          X(a, b, c, e, f, d, g, h);
        }
      } else {
        g = b[++e], X(a, b, c, e, f, d, g, h);
      }
    }
  }
}
;W.prototype.search = function(a, b, c, e) {
  c || (!b && E(a) ? (c = a, a = "") : E(b) && (c = b, b = 0));
  let f = [];
  var d = [];
  let g, h, k, p, m;
  let r = 0;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    var t = c.pluck;
    h = c.merge;
    p = t || c.field || c.index;
    m = !1;
    g = this.store && c.enrich;
    k = c.suggest;
    b = c.limit || b;
    var n = c.offset || 0;
    b || (b = 100);
    if (m) {
      m.constructor !== Array && (m = [m]);
      var l = [];
      for (let u = 0, q; u < m.length; u++) {
        q = m[u];
        if (z(q)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (q.field && q.tag) {
          var w = q.tag;
          if (w.constructor === Array) {
            for (var B = 0; B < w.length; B++) {
              l.push(q.field, w[B]);
            }
          } else {
            l.push(q.field, w);
          }
        } else {
          w = Object.keys(q);
          for (let C = 0, D, A; C < w.length; C++) {
            if (D = w[C], A = q[D], A.constructor === Array) {
              for (B = 0; B < A.length; B++) {
                l.push(D, A[B]);
              }
            } else {
              l.push(D, A);
            }
          }
        }
      }
      if (!l.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      m = l;
      if (!a) {
        e = [];
        if (l.length) {
          for (d = 0; d < l.length; d += 2) {
            t = sa.call(this, l[d], l[d + 1], b, n, g), f.push({field:l[d], tag:l[d + 1], result:t});
          }
        }
        return e.length ? Promise.all(e).then(function(u) {
          for (let q = 0; q < u.length; q++) {
            f[q].result = u[q];
          }
          return f;
        }) : f;
      }
    }
    z(p) && (p = [p]);
  }
  p || (p = this.field);
  n = !e && (this.worker || this.async) && [];
  for (let u = 0, q, C, D; u < p.length; u++) {
    C = p[u];
    let A;
    z(C) || (A = C, C = A.field, a = A.query || a, b = A.limit || b, k = A.suggest || k);
    if (e) {
      q = e[u];
    } else {
      if (l = A || c, w = this.index.get(C), m && (l.enrich = !1), n) {
        n[u] = w.searchAsync(a, b, l);
        l && g && (l.enrich = g);
        continue;
      } else {
        q = w.search(a, b, l), l && g && (l.enrich = g);
      }
    }
    D = q && q.length;
    if (m && D) {
      l = [];
      w = 0;
      for (let G = 0, H, ua; G < m.length; G += 2) {
        H = this.tag.get(m[G]);
        if (!H) {
          if (console.warn("Tag '" + m[G] + ":" + m[G + 1] + "' will be skipped because there is no field '" + m[G] + "'."), k) {
            continue;
          } else {
            return f;
          }
        }
        if (ua = (H = H && H.get(m[G + 1])) && H.length) {
          w++, l.push(H);
        } else if (!k) {
          return f;
        }
      }
      if (w) {
        q = qa(q, l);
        D = q.length;
        if (!D && !k) {
          return f;
        }
        w--;
      }
    }
    if (D) {
      d[r] = C, f.push(q), r++;
    } else if (1 === p.length) {
      return f;
    }
  }
  if (n) {
    const u = this;
    return Promise.all(n).then(function(q) {
      return q.length ? u.search(a, b, c, q) : q;
    });
  }
  if (!r) {
    return f;
  }
  if (t && (!g || !this.store)) {
    return f[0];
  }
  n = [];
  for (let u = 0, q; u < d.length; u++) {
    q = f[u];
    g && q.length && !q[0].doc && q.length && (q = ta.call(this, q));
    if (t) {
      return q;
    }
    f[u] = {field:d[u], result:q};
  }
  return h ? va(f, b) : f;
};
function va(a, b) {
  const c = [], e = y();
  for (let f = 0, d, g; f < a.length; f++) {
    d = a[f];
    g = d.result;
    for (let h = 0, k, p, m; h < g.length; h++) {
      if (p = g[h], k = p.id, m = e[k]) {
        m.push(d.field);
      } else {
        if (c.length === b) {
          return c;
        }
        p.field = e[k] = [d.field];
        c.push(p);
      }
    }
  }
  return c;
}
function sa(a, b, c, e, f) {
  let d = this.tag.get(a);
  if (!d) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (d = d && d.get(b)) && d.length - e) && 0 < a) {
    if (a > c || e) {
      d = d.slice(e, e + c);
    }
    f && (d = ta.call(this, d));
    return d;
  }
}
function ta(a) {
  const b = Array(a.length);
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b[c] = {id:e, doc:this.store.get(e)};
  }
  return b;
}
;function W(a) {
  if (!this) {
    return new W(a);
  }
  const b = a.document || a.doc || a;
  var c;
  this.C = [];
  this.field = [];
  this.G = [];
  this.key = (c = b.key || b.id) && Z(c, this.G) || "id";
  this.h = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.A = (c = b.store || null) && !0 !== c && [];
  this.store = c && new Map();
  this.async = !1;
  c = new Map();
  let e = b.index || b.field || b;
  z(e) && (e = [e]);
  for (let f = 0, d, g; f < e.length; f++) {
    d = e[f], z(d) || (g = d, d = d.field), g = E(g) ? Object.assign({}, a, g) : a, c.set(d, new O(g, this.h)), g.custom ? this.C[f] = g.custom : (this.C[f] = Z(d, this.G), g.filter && ("string" === typeof this.C[f] && (this.C[f] = new String(this.C[f])), this.C[f].J = g.filter)), this.field[f] = d;
  }
  if (this.A) {
    a = b.store;
    z(a) && (a = [a]);
    for (let f = 0, d, g; f < a.length; f++) {
      d = a[f], g = d.field || d, d.custom ? (this.A[f] = d.custom, d.custom.L = g) : (this.A[f] = Z(g, this.G), d.filter && ("string" === typeof this.A[f] && (this.A[f] = new String(this.A[f])), this.A[f].J = d.filter));
    }
  }
  this.index = c;
}
function Z(a, b) {
  const c = a.split(":");
  let e = 0;
  for (let f = 0; f < c.length; f++) {
    a = c[f], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (b[e] = !0), a && (c[e++] = a);
  }
  e < c.length && (c.length = e);
  return 1 < e ? c : c[0];
}
v = W.prototype;
v.append = function(a, b) {
  return this.add(a, b, !0);
};
v.update = function(a, b) {
  return this.remove(a).add(a, b);
};
v.remove = function(a) {
  E(a) && (a = F(a, this.key));
  for (const b of this.index.values()) {
    b.remove(a, !0);
  }
  this.h.has(a) && (this.store && this.store.delete(a), this.h.delete(a));
  return this;
};
v.clear = function() {
  for (const a of this.index.values()) {
    a.clear();
  }
  this.store && this.store.clear();
  return this;
};
v.contain = function(a) {
  return this.h.has(a);
};
v.cleanup = function() {
  for (const a of this.index.values()) {
    a.cleanup();
  }
  return this;
};
v.get = function(a) {
  return this.store.get(a);
};
v.set = function(a, b) {
  this.store.set(a, b);
  return this;
};
v.export = function(a, b, c, e, f, d) {
  let g;
  "undefined" === typeof d && (g = new Promise(k => {
    d = k;
  }));
  f || (f = 0);
  e || (e = 0);
  if (e < this.field.length) {
    c = this.field[e];
    var h = this.index[c];
    b = this;
    h.export(a, b, f ? c : "", e, f++, d) || (e++, b.export(a, b, c, e, 1, d));
  } else {
    switch(f) {
      case 1:
        b = "tag";
        h = this.D;
        c = null;
        break;
      case 2:
        b = "store";
        h = this.store;
        c = null;
        break;
      default:
        d();
        return;
    }
    na(a, this, c, b, e, f, h, d);
  }
  return g;
};
v.import = function(a, b) {
  if (b) {
    switch(z(b) && (b = JSON.parse(b)), a) {
      case "tag":
        this.D = b;
        break;
      case "reg":
        this.fastupdate = !1;
        this.h = b;
        for (let e = 0, f; e < this.field.length; e++) {
          f = this.index[this.field[e]], f.h = b, f.fastupdate = !1;
        }
        break;
      case "store":
        this.store = b;
        break;
      default:
        a = a.split(".");
        const c = a[0];
        a = a[1];
        c && a && this.index[c].import(a, b);
    }
  }
};
pa(W.prototype);
export default {Index:O, Charset:ma, Encoder:J, Document:W, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=O;export const  Charset=ma;export const  Encoder=J;export const  Document=W;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};