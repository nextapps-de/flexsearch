/**!
 * FlexSearch.js v0.8.0 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var u;
function x(a, c, b) {
  const d = typeof b, f = typeof a;
  if ("undefined" !== d) {
    if ("undefined" !== f) {
      if (b) {
        if ("function" === f && d === f) {
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
    let d = !c, f = "";
    a.include || (f += "\\p{Z}");
    b.letter && (f += "\\p{L}");
    b.number && (f += "\\p{N}", d = !!c);
    b.symbol && (f += "\\p{S}");
    b.punctuation && (f += "\\p{P}");
    b.control && (f += "\\p{C}");
    if (b = b.char) {
      f += "object" === typeof b ? b.join("") : b;
    }
    this.split = new RegExp("[" + (c ? "^" : "") + f + "]+", "u");
    this.numeric = d;
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
  this.C = "";
  this.F = null;
  this.B = "";
  this.G = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.C += (this.C ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.B += (this.B ? "|" : "") + d;
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
  for (let f = 0, e; f < a.length; f++) {
    if (!(e = a[f])) {
      continue;
    }
    if (e.length < this.minlength) {
      continue;
    }
    if (c) {
      b.push(e);
      continue;
    }
    if (this.filter && this.filter.has(e)) {
      continue;
    }
    let g;
    this.stemmer && 2 < e.length && (this.G || (this.G = new RegExp("(?!^)(" + this.B + ")$")), e = e.replace(this.G, h => this.stemmer.get(h)), g = 1);
    this.matcher && 1 < e.length && (this.F || (this.F = new RegExp("(" + this.C + ")", "g")), e = e.replace(this.F, h => this.matcher.get(h)), g = 1);
    e && g && (e.length < this.minlength || this.filter && this.filter.has(e)) && (e = "");
    if (e && (this.mapper || this.dedupe && 1 < e.length)) {
      var d = "";
      for (let h = 0, k = "", m, l; h < e.length; h++) {
        m = e.charAt(h), m === k && this.dedupe || ((l = this.mapper && this.mapper.get(m)) || "" === l ? l === k && this.dedupe || !(k = l) || (d += l) : d += k = m);
      }
      e = d;
    }
    if (e && this.replacer) {
      for (d = 0; e && d < this.replacer.length; d += 2) {
        e = e.replace(this.replacer[d], this.replacer[d + 1]);
      }
    }
    e && b.push(e);
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
    let d = c.charAt(0), f = ia[d];
    for (let e = 1, g; e < c.length && (g = c.charAt(e), "h" === g || "w" === g || !(g = ia[g]) || g === f || (d += g, f = g, 4 !== d.length)); e++) {
    }
    a[b] = d;
  }
}}, ArabicDefault:{rtl:!0, normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(ja, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(ka, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(la, " ");
}}};
function na(a, c, b, d, f, e, g, h) {
  (d = a(b ? b + "." + d : d, JSON.stringify(g))) && d.then ? d.then(function() {
    c.export(a, c, b, f, e + 1, h);
  }) : c.export(a, c, b, f, e + 1, h);
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
    let d;
    "function" === typeof b && (d = b, delete c[c.length - 1]);
    this.async = !0;
    c = this[a].apply(this, c);
    this.async = !1;
    d && (c.then ? c.then(d) : d(c));
    return c;
  };
}
;y();
O.prototype.add = function(a, c, b, d) {
  if (c && (a || 0 === a)) {
    if (!d && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (d = c.length) {
      const m = y(), l = y(), r = this.depth, t = this.resolution;
      for (let p = 0; p < d; p++) {
        let n = c[this.rtl ? d - 1 - p : p];
        var f = n.length;
        if (f && (r || !l[n])) {
          var e = this.score ? this.score(c, n, p, null, 0) : P(t, d, p), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < f) {
                for (e = 0; e < f; e++) {
                  for (var h = f; h > e; h--) {
                    g = n.substring(e, h);
                    var k = this.score ? this.score(c, n, p, g, e) : P(t, d, p, f, e);
                    Q(this, l, g, k, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < f) {
                for (h = f - 1; 0 < h; h--) {
                  g = n[h] + g, k = this.score ? this.score(c, n, p, g, h) : P(t, d, p, f, h), Q(this, l, g, k, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < f) {
                for (h = 0; h < f; h++) {
                  g += n[h], Q(this, l, g, e, a, b);
                }
                break;
              }
            default:
              if (Q(this, l, n, e, a, b), r && 1 < d && p < d - 1) {
                for (f = y(), g = this.I, e = n, h = Math.min(r + 1, d - p), f[e] = 1, k = 1; k < h; k++) {
                  if ((n = c[this.rtl ? d - 1 - p - k : p + k]) && !f[n]) {
                    f[n] = 1;
                    const w = this.score ? this.score(c, e, p, n, k) : P(g + (d / 2 > g ? 0 : 1), d, p, h - 1, k - 1), B = this.bidirectional && n > e;
                    Q(this, m, B ? e : n, w, a, b, B ? n : e);
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
function Q(a, c, b, d, f, e, g) {
  let h = g ? a.ctx : a.map, k;
  c[b] && g && (k = c[b])[g] || (g ? (c = k || (c[b] = y()), c[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[d] || (h[d] = []), e && h.includes(f) || (h.push(f), a.fastupdate && ((c = a.reg.get(f)) ? c.push(h) : a.reg.set(f, [h]))));
}
function P(a, c, b, d, f) {
  return b && 1 < a ? c + (d || 0) <= a ? b + (f || 0) : (a - 1) / (c + (d || 0)) * (b + (f || 0)) + 1 | 0 : 0;
}
;function R(a, c, b) {
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a;
  }
  let d = [];
  for (let f = 0, e, g; f < a.length; f++) {
    if ((e = a[f]) && (g = e.length)) {
      if (b) {
        if (b >= g) {
          b -= g;
          continue;
        }
        b < g && (e = c ? e.slice(b, b + c) : e.slice(b), g = e.length, b = 0);
      }
      if (d.length) {
        g > c && (e = e.slice(0, c), g = e.length), d.push(e);
      } else {
        if (g >= c) {
          return g > c && (e = e.slice(0, c)), e;
        }
        d = [e];
      }
      c -= g;
      if (!c) {
        break;
      }
    }
  }
  return d.length ? d = 1 < d.length ? [].concat.apply([], d) : d[0] : d;
}
;function qa(a, c) {
  const b = y(), d = y(), f = [];
  for (let e = 0; e < a.length; e++) {
    b[a[e]] = 1;
  }
  for (let e = 0, g; e < c.length; e++) {
    g = c[e];
    for (let h = 0, k; h < g.length; h++) {
      k = g[h], b[k] && !d[k] && (d[k] = 1, f.push(k));
    }
  }
  return f;
}
;O.prototype.search = function(a, c, b) {
  b || (!c && E(a) ? (b = a, a = "") : E(c) && (b = c, c = 0));
  var d = [], f = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    f = b.offset || 0;
    var e = b.context;
    var g = b.suggest;
  }
  a = this.encoder.encode(a);
  b = a.length;
  c || (c = 100);
  if (1 === b) {
    return S.call(this, a[0], "", c, f);
  }
  e = this.depth && !1 !== e;
  if (2 === b && e && !g) {
    return S.call(this, a[0], a[1], c, f);
  }
  var h = 0, k = 0;
  if (1 < b) {
    var m = y();
    const r = [];
    for (let t = 0, p; t < b; t++) {
      if ((p = a[t]) && !m[p]) {
        if (g || T(this, p)) {
          r.push(p), m[p] = 1;
        } else {
          return d;
        }
        const n = p.length;
        h = Math.max(h, n);
        k = k ? Math.min(k, n) : n;
      }
    }
    a = r;
    b = a.length;
  }
  if (!b) {
    return d;
  }
  m = 0;
  if (1 === b) {
    return S.call(this, a[0], "", c, f);
  }
  if (2 === b && e && !g) {
    return S.call(this, a[0], a[1], c, f);
  }
  if (1 < b) {
    if (e) {
      var l = a[0];
      m = 1;
    } else {
      9 < h && 3 < h / k && a.sort(aa);
    }
  }
  for (let r, t; m < b; m++) {
    t = a[m];
    l ? (r = T(this, t, l), r = ra(r, d, g, this.I, c, f, 2 === b), g && !1 === r && d.length || (l = t)) : (r = T(this, t), r = ra(r, d, g, this.resolution, c, f, 1 === b));
    if (r) {
      return r;
    }
    if (g && m === b - 1) {
      e = d.length;
      if (!e) {
        if (l) {
          l = "";
          m = -1;
          continue;
        }
        return d;
      }
      if (1 === e) {
        return R(d[0], c, f);
      }
    }
  }
  a: {
    a = d;
    d = this.resolution;
    l = a.length;
    b = [];
    e = y();
    for (let r = 0, t, p, n, w; r < d; r++) {
      for (k = 0; k < l; k++) {
        if (n = a[k], r < n.length && (t = n[r])) {
          for (m = 0; m < t.length; m++) {
            p = t[m], (h = e[p]) ? e[p]++ : (h = 0, e[p] = 1), w = b[h] || (b[h] = []), w.push(p);
          }
        }
      }
    }
    if (a = b.length) {
      if (g) {
        if (1 < b.length) {
          g = b;
          a = [];
          d = y();
          e = g.length;
          for (k = 0; k < e; k++) {
            for (l = g[k], h = l.length, m = 0; m < h; m++) {
              if (b = l[m], !d[b]) {
                if (d[b] = 1, f) {
                  f--;
                } else {
                  if (a.push(b), a.length === c) {
                    break;
                  }
                }
              }
            }
          }
          c = a;
        } else {
          c = b[0];
        }
        b = c;
      } else {
        if (a < l) {
          d = [];
          break a;
        }
        b = b[a - 1];
        if (b.length > c || f) {
          b = b.slice(f, c + f);
        }
      }
    }
    d = b;
  }
  return d;
};
function S(a, c, b, d) {
  return (a = T(this, a, c)) && a.length ? R(a, b, d) : [];
}
function ra(a, c, b, d, f, e, g) {
  let h = [];
  if (a) {
    d = Math.min(a.length, d);
    for (let k = 0, m = 0, l; k < d; k++) {
      if (l = a[k]) {
        if (e && l && g && (l.length <= e ? (e -= l.length, l = null) : (l = l.slice(e), e = 0)), l && (h[k] = l, g && (m += l.length, m >= f))) {
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
  let d;
  b && (d = a.bidirectional && c > b);
  a = b ? (a = a.ctx.get(d ? c : b)) && a.get(d ? b : c) : a.map.get(c);
  return a;
}
;O.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let d = 0, f; d < b.length; d++) {
        if (f = b[d]) {
          if (2 > f.length) {
            f.pop();
          } else {
            const e = f.indexOf(a);
            e === b.length - 1 ? f.pop() : f.splice(e, 1);
          }
        }
      }
    } else {
      U(this.map, a), this.depth && U(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  return this;
};
function U(a, c) {
  let b = 0;
  if (a.constructor === Array) {
    for (let d = 0, f, e; d < a.length; d++) {
      if ((f = a[d]) && f.length) {
        if (e = f.indexOf(c), 0 <= e) {
          1 < f.length ? (f.splice(e, 1), b++) : delete a[d];
          break;
        } else {
          b++;
        }
      }
    }
  } else {
    for (let d of a) {
      const f = d[0], e = U(d[1], c);
      e ? b += e : a.delete(f);
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
  const d = a.encode || a.encoder || K;
  this.encoder = d.encode ? d : "object" === typeof d ? new J(d) : {encode:d};
  let f;
  this.resolution = a.resolution || 9;
  this.tokenize = f = a.tokenize || "strict";
  this.depth = "strict" === f && b.depth || 0;
  this.bidirectional = !1 !== b.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.I = b.resolution || 1;
  this.rtl = d.rtl || a.rtl || !1;
}
u = O.prototype;
u.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  return this;
};
u.append = function(a, c) {
  return this.add(a, c, !0);
};
u.contain = function(a) {
  return this.reg.has(a);
};
u.update = function(a, c) {
  if (this.async) {
    const b = this, d = this.remove(a);
    return d.then ? d.then(() => b.add(a, c)) : this.add(a, c);
  }
  return this.remove(a).add(a, c);
};
function V(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, d; b < a.length; b++) {
      (d = a[b]) && (c += d.length);
    }
  } else {
    for (const b of a) {
      const d = b[0], f = V(b[1]);
      f ? c += f : a.delete(d);
    }
  }
  return c;
}
u.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  V(this.map);
  this.depth && V(this.ctx);
  return this;
};
u.export = function(a, c, b, d, f, e) {
  let g = !0;
  "undefined" === typeof e && (g = new Promise(m => {
    e = m;
  }));
  let h, k;
  switch(f || (f = 0)) {
    case 0:
      h = "reg";
      if (this.fastupdate) {
        k = y();
        for (let m of this.reg.keys()) {
          k[m] = 1;
        }
      } else {
        k = this.reg;
      }
      break;
    case 1:
      h = "cfg";
      k = {doc:0, opt:this.C ? 1 : 0};
      break;
    case 2:
      h = "map";
      k = this.map;
      break;
    case 3:
      h = "ctx";
      k = this.ctx;
      break;
    default:
      "undefined" === typeof b && e && e();
      return;
  }
  na(a, c || this, b, h, d, f, k, e);
  return g;
};
u.import = function(a, c) {
  if (c) {
    switch(z(c) && (c = JSON.parse(c)), a) {
      case "cfg":
        this.C = !!c.opt;
        break;
      case "reg":
        this.fastupdate = !1;
        this.reg = c;
        break;
      case "map":
        this.map = c;
        break;
      case "ctx":
        this.ctx = c;
    }
  }
};
u.serialize = function(a = !0) {
  if (!this.reg.size) {
    return "";
  }
  let c = "", b = "";
  for (var d of this.reg.keys()) {
    b || (b = typeof d), c += (c ? "," : "") + ("string" === b ? '"' + d + '"' : d);
  }
  c = "index.reg=new Set([" + c + "]);";
  d = "";
  for (var f of this.map.entries()) {
    var e = f[0], g = f[1], h = "";
    for (let l = 0, r; l < g.length; l++) {
      r = g[l] || [""];
      var k = "";
      for (var m = 0; m < r.length; m++) {
        k += (k ? "," : "") + ("string" === b ? '"' + r[m] + '"' : r[m]);
      }
      k = "[" + k + "]";
      h += (h ? "," : "") + k;
    }
    h = '["' + e + '",[' + h + "]]";
    d += (d ? "," : "") + h;
  }
  d = "index.map=new Map([" + d + "]);";
  f = "";
  for (const l of this.ctx.entries()) {
    e = l[0];
    g = l[1];
    for (const r of g.entries()) {
      g = r[0];
      h = r[1];
      k = "";
      for (let t = 0, p; t < h.length; t++) {
        p = h[t] || [""];
        m = "";
        for (let n = 0; n < p.length; n++) {
          m += (m ? "," : "") + ("string" === b ? '"' + p[n] + '"' : p[n]);
        }
        m = "[" + m + "]";
        k += (k ? "," : "") + m;
      }
      k = 'new Map([["' + g + '",[' + k + "]]])";
      k = '["' + e + '",' + k + "]";
      f += (f ? "," : "") + k;
    }
  }
  f = "index.ctx=new Map([" + f + "]);";
  return a ? "function inject(index){" + c + d + f + "}" : c + d + f;
};
pa(O.prototype);
W.prototype.add = function(a, c, b) {
  E(a) && (c = a, a = F(c, this.key));
  if (c && (a || 0 === a)) {
    if (!b && this.reg.has(a)) {
      return this.update(a, c);
    }
    for (let f = 0, e; f < this.field.length; f++) {
      e = this.A[f];
      const g = this.index.get(this.field[f]);
      if ("function" === typeof e) {
        var d = e(c);
        d && g.add(a, d, !1, !0);
      } else {
        if (d = e.H, !d || d(c)) {
          e.constructor === String ? e = ["" + e] : z(e) && (e = [e]), X(c, e, this.D, 0, g, a, e[0], b);
        }
      }
    }
    if (this.store && (!b || !this.store.has(a))) {
      let f;
      if (this.h) {
        f = y();
        for (let e = 0, g; e < this.h.length; e++) {
          g = this.h[e];
          if ((b = g.H) && !b(c)) {
            continue;
          }
          let h;
          if ("function" === typeof g) {
            h = g(c);
            if (!h) {
              continue;
            }
            g = [g.J];
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
function Y(a, c, b, d, f, e) {
  a = a[f];
  if (d === b.length - 1) {
    c[f] = e || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (c = c[f] = Array(a.length), f = 0; f < a.length; f++) {
        Y(a, c, b, d, f);
      }
    } else {
      c = c[f] || (c[f] = y()), f = b[++d], Y(a, c, b, d, f);
    }
  }
}
function X(a, c, b, d, f, e, g, h) {
  if (a = a[g]) {
    if (d === c.length - 1) {
      if (a.constructor === Array) {
        if (b[d]) {
          for (c = 0; c < a.length; c++) {
            f.add(e, a[c], !0, !0);
          }
          return;
        }
        a = a.join(" ");
      }
      f.add(e, a, h, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          X(a, c, b, d, f, e, g, h);
        }
      } else {
        g = c[++d], X(a, c, b, d, f, e, g, h);
      }
    }
  }
}
;W.prototype.search = function(a, c, b, d) {
  b || (!c && E(a) ? (b = a, a = "") : E(c) && (b = c, c = 0));
  let f = [];
  var e = [];
  let g, h, k, m, l;
  let r = 0;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    var t = b.pluck;
    h = b.merge;
    m = t || b.field || b.index;
    l = !1;
    g = this.store && b.enrich;
    k = b.suggest;
    c = b.limit || c;
    var p = b.offset || 0;
    c || (c = 100);
    if (l) {
      l.constructor !== Array && (l = [l]);
      var n = [];
      for (let v = 0, q; v < l.length; v++) {
        q = l[v];
        if (z(q)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (q.field && q.tag) {
          var w = q.tag;
          if (w.constructor === Array) {
            for (var B = 0; B < w.length; B++) {
              n.push(q.field, w[B]);
            }
          } else {
            n.push(q.field, w);
          }
        } else {
          w = Object.keys(q);
          for (let C = 0, D, A; C < w.length; C++) {
            if (D = w[C], A = q[D], A.constructor === Array) {
              for (B = 0; B < A.length; B++) {
                n.push(D, A[B]);
              }
            } else {
              n.push(D, A);
            }
          }
        }
      }
      if (!n.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      l = n;
      if (!a) {
        d = [];
        if (n.length) {
          for (e = 0; e < n.length; e += 2) {
            t = sa.call(this, n[e], n[e + 1], c, p, g), f.push({field:n[e], tag:n[e + 1], result:t});
          }
        }
        return d.length ? Promise.all(d).then(function(v) {
          for (let q = 0; q < v.length; q++) {
            f[q].result = v[q];
          }
          return f;
        }) : f;
      }
    }
    z(m) && (m = [m]);
  }
  m || (m = this.field);
  p = !d && (this.worker || this.async) && [];
  for (let v = 0, q, C, D; v < m.length; v++) {
    C = m[v];
    let A;
    z(C) || (A = C, C = A.field, a = A.query || a, c = A.limit || c, k = A.suggest || k);
    if (d) {
      q = d[v];
    } else {
      if (n = A || b, w = this.index.get(C), l && (n.enrich = !1), p) {
        p[v] = w.searchAsync(a, c, n);
        n && g && (n.enrich = g);
        continue;
      } else {
        q = w.search(a, c, n), n && g && (n.enrich = g);
      }
    }
    D = q && q.length;
    if (l && D) {
      n = [];
      w = 0;
      for (let G = 0, H, ua; G < l.length; G += 2) {
        H = this.tag.get(l[G]);
        if (!H) {
          if (console.warn("Tag '" + l[G] + ":" + l[G + 1] + "' will be skipped because there is no field '" + l[G] + "'."), k) {
            continue;
          } else {
            return f;
          }
        }
        if (ua = (H = H && H.get(l[G + 1])) && H.length) {
          w++, n.push(H);
        } else if (!k) {
          return f;
        }
      }
      if (w) {
        q = qa(q, n);
        D = q.length;
        if (!D && !k) {
          return f;
        }
        w--;
      }
    }
    if (D) {
      e[r] = C, f.push(q), r++;
    } else if (1 === m.length) {
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
  for (let v = 0, q; v < e.length; v++) {
    q = f[v];
    g && q.length && !q[0].doc && q.length && (q = ta.call(this, q));
    if (t) {
      return q;
    }
    f[v] = {field:e[v], result:q};
  }
  return h ? va(f, c) : f;
};
function va(a, c) {
  const b = [], d = y();
  for (let f = 0, e, g; f < a.length; f++) {
    e = a[f];
    g = e.result;
    for (let h = 0, k, m, l; h < g.length; h++) {
      if (m = g[h], k = m.id, l = d[k]) {
        l.push(e.field);
      } else {
        if (b.length === c) {
          return b;
        }
        m.field = d[k] = [e.field];
        b.push(m);
      }
    }
  }
  return b;
}
function sa(a, c, b, d, f) {
  let e = this.tag.get(a);
  if (!e) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (e = e && e.get(c)) && e.length - d) && 0 < a) {
    if (a > b || d) {
      e = e.slice(d, d + b);
    }
    f && (e = ta.call(this, e));
    return e;
  }
}
function ta(a) {
  const c = Array(a.length);
  for (let b = 0, d; b < a.length; b++) {
    d = a[b], c[b] = {id:d, doc:this.store.get(d)};
  }
  return c;
}
;function W(a) {
  if (!this) {
    return new W(a);
  }
  const c = a.document || a.doc || a;
  var b;
  this.A = [];
  this.field = [];
  this.D = [];
  this.key = (b = c.key || c.id) && Z(b, this.D) || "id";
  this.reg = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.h = (b = c.store || null) && !0 !== b && [];
  this.store = b && new Map();
  this.async = !1;
  b = new Map();
  let d = c.index || c.field || c;
  z(d) && (d = [d]);
  for (let f = 0, e, g; f < d.length; f++) {
    e = d[f], z(e) || (g = e, e = e.field), g = E(g) ? Object.assign({}, a, g) : a, b.set(e, new O(g, this.reg)), g.custom ? this.A[f] = g.custom : (this.A[f] = Z(e, this.D), g.filter && ("string" === typeof this.A[f] && (this.A[f] = new String(this.A[f])), this.A[f].H = g.filter)), this.field[f] = e;
  }
  if (this.h) {
    a = c.store;
    z(a) && (a = [a]);
    for (let f = 0, e, g; f < a.length; f++) {
      e = a[f], g = e.field || e, e.custom ? (this.h[f] = e.custom, e.custom.J = g) : (this.h[f] = Z(g, this.D), e.filter && ("string" === typeof this.h[f] && (this.h[f] = new String(this.h[f])), this.h[f].H = e.filter));
    }
  }
  this.index = b;
}
function Z(a, c) {
  const b = a.split(":");
  let d = 0;
  for (let f = 0; f < b.length; f++) {
    a = b[f], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (c[d] = !0), a && (b[d++] = a);
  }
  d < b.length && (b.length = d);
  return 1 < d ? b : b[0];
}
u = W.prototype;
u.append = function(a, c) {
  return this.add(a, c, !0);
};
u.update = function(a, c) {
  return this.remove(a).add(a, c);
};
u.remove = function(a) {
  E(a) && (a = F(a, this.key));
  for (const c of this.index.values()) {
    c.remove(a, !0);
  }
  this.reg.has(a) && (this.store && this.store.delete(a), this.reg.delete(a));
  return this;
};
u.clear = function() {
  for (const a of this.index.values()) {
    a.clear();
  }
  this.store && this.store.clear();
  return this;
};
u.contain = function(a) {
  return this.reg.has(a);
};
u.cleanup = function() {
  for (const a of this.index.values()) {
    a.cleanup();
  }
  return this;
};
u.get = function(a) {
  return this.store.get(a);
};
u.set = function(a, c) {
  this.store.set(a, c);
  return this;
};
u.export = function(a, c, b, d, f, e) {
  let g;
  "undefined" === typeof e && (g = new Promise(k => {
    e = k;
  }));
  f || (f = 0);
  d || (d = 0);
  if (d < this.field.length) {
    b = this.field[d];
    var h = this.index[b];
    c = this;
    h.export(a, c, f ? b : "", d, f++, e) || (d++, c.export(a, c, b, d, 1, e));
  } else {
    switch(f) {
      case 1:
        c = "tag";
        h = this.B;
        b = null;
        break;
      case 2:
        c = "store";
        h = this.store;
        b = null;
        break;
      default:
        e();
        return;
    }
    na(a, this, b, c, d, f, h, e);
  }
  return g;
};
u.import = function(a, c) {
  if (c) {
    switch(z(c) && (c = JSON.parse(c)), a) {
      case "tag":
        this.B = c;
        break;
      case "reg":
        this.fastupdate = !1;
        this.reg = c;
        for (let d = 0, f; d < this.field.length; d++) {
          f = this.index[this.field[d]], f.reg = c, f.fastupdate = !1;
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