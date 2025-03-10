/**!
 * FlexSearch.js v0.8.0 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var u;
function x(a, c, b) {
  const e = typeof b, d = typeof a;
  if ("undefined" !== e) {
    if ("undefined" !== d) {
      if (b) {
        if ("function" === d && e === d) {
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
  return "undefined" === d ? c : a;
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
    let e = !c, d = "";
    a.include || (d += "\\p{Z}");
    b.letter && (d += "\\p{L}");
    b.number && (d += "\\p{N}", e = !!c);
    b.symbol && (d += "\\p{S}");
    b.punctuation && (d += "\\p{P}");
    b.control && (d += "\\p{C}");
    if (b = b.char) {
      d += "object" === typeof b ? b.join("") : b;
    }
    this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
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
  if (this.cache = b = x(a.cache, !0, this.cache)) {
    this.L = null, this.R = "number" === typeof b ? b : 2e5, this.H = new Map(), this.J = new Map(), this.G = this.A = 128;
  }
  this.M = "";
  this.O = null;
  this.N = "";
  this.P = null;
  if (this.matcher) {
    for (const e of this.matcher.keys()) {
      this.M += (this.M ? "|" : "") + e;
    }
  }
  if (this.stemmer) {
    for (const e of this.stemmer.keys()) {
      this.N += (this.N ? "|" : "") + e;
    }
  }
  return this;
};
J.prototype.encode = function(a) {
  if (this.cache && a.length <= this.A) {
    if (this.L) {
      if (this.H.has(a)) {
        return this.H.get(a);
      }
    } else {
      this.L = setTimeout(ha, 0, this);
    }
  }
  this.normalize && (a = "function" === typeof this.normalize ? this.normalize(a) : I ? a.normalize("NFKD").replace(I, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ea, "$1 $2").replace(fa, "$1 $2").replace(da, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let b = [], e = this.split || "" === this.split ? a.split(this.split) : a;
  for (let f = 0, g, h; f < e.length; f++) {
    if (!(g = h = e[f])) {
      continue;
    }
    if (g.length < this.minlength) {
      continue;
    }
    if (c) {
      b.push(g);
      continue;
    }
    if (this.filter && this.filter.has(g)) {
      continue;
    }
    if (this.cache && g.length <= this.G) {
      if (this.L) {
        var d = this.J.get(g);
        if (d || "" === d) {
          d && b.push(d);
          continue;
        }
      } else {
        this.L = setTimeout(ha, 0, this);
      }
    }
    let k;
    this.stemmer && 2 < g.length && (this.P || (this.P = new RegExp("(?!^)(" + this.N + ")$")), g = g.replace(this.P, l => this.stemmer.get(l)), k = 1);
    this.matcher && 1 < g.length && (this.O || (this.O = new RegExp("(" + this.M + ")", "g")), g = g.replace(this.O, l => this.matcher.get(l)), k = 1);
    g && k && (g.length < this.minlength || this.filter && this.filter.has(g)) && (g = "");
    if (g && (this.mapper || this.dedupe && 1 < g.length)) {
      d = "";
      for (let l = 0, m = "", r, t; l < g.length; l++) {
        r = g.charAt(l), r === m && this.dedupe || ((t = this.mapper && this.mapper.get(r)) || "" === t ? t === m && this.dedupe || !(m = t) || (d += t) : d += m = r);
      }
      g = d;
    }
    if (g && this.replacer) {
      for (d = 0; g && d < this.replacer.length; d += 2) {
        g = g.replace(this.replacer[d], this.replacer[d + 1]);
      }
    }
    this.cache && h.length <= this.G && (this.J.set(h, g), this.J.size > this.R && (this.J.clear(), this.G = this.G / 1.1 | 0));
    g && b.push(g);
  }
  this.finalize && (b = this.finalize(b) || b);
  this.cache && a.length <= this.A && (this.H.set(a, b), this.H.size > this.R && (this.H.clear(), this.A = this.A / 1.1 | 0));
  return b;
};
function ha(a) {
  a.L = null;
  a.H.clear();
  a.J.clear();
}
;function ia(a, c, b) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  let e = this.cache.get(a);
  if (!e) {
    e = this.search(a, c, b);
    if (e.then) {
      const d = this;
      e.then(function(f) {
        d.cache.set(a, f);
        return f;
      });
    }
    this.cache.set(a, e);
  }
  return e;
}
function K(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.A = "";
}
K.prototype.set = function(a, c) {
  this.cache.set(this.A = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
K.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.A !== a && (this.cache.delete(a), this.cache.set(this.A = a, c));
  return c;
};
K.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
K.prototype.clear = function() {
  this.cache.clear();
  this.A = "";
};
const ja = {normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1};
const L = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const ka = new Map([["ai", "ei"], ["ae", "a"], ["oe", "o"], ["ue", "u"], ["sh", "s"], ["ch", "c"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), la = [/([^aeo])h([aeo$])/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2"];
const ma = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const na = /[\x00-\x7F]+/g;
const oa = /[\x00-\x7F]+/g;
const pa = /[\x00-\x7F]+/g;
var qa = {LatinExact:{normalize:!1, dedupe:!1}, LatinDefault:ja, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:L}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:L, replacer:la, matcher:ka}, LatinExtra:{normalize:!0, dedupe:!0, mapper:L, replacer:la.concat([/(?!^)[aeoy]/g, ""]), matcher:ka}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let e = c.charAt(0), d = ma[e];
    for (let f = 1, g; f < c.length && (g = c.charAt(f), "h" === g || "w" === g || !(g = ma[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[b] = e;
  }
}}, ArabicDefault:{rtl:!0, normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(na, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(oa, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(pa, " ");
}}};
function ra(a, c, b, e, d, f, g, h) {
  (e = a(b ? b + "." + e : e, JSON.stringify(g))) && e.then ? e.then(function() {
    c.export(a, c, b, d, f + 1, h);
  }) : c.export(a, c, b, d, f + 1, h);
}
;const sa = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
function ta(a) {
  M.call(a, "add");
  M.call(a, "append");
  M.call(a, "search");
  M.call(a, "update");
  M.call(a, "remove");
}
function M(a) {
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
N.prototype.add = function(a, c, b, e) {
  if (c && (a || 0 === a)) {
    if (!e && !b && this.h.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (e = c.length) {
      const l = y(), m = y(), r = this.depth, t = this.resolution;
      for (let p = 0; p < e; p++) {
        let n = c[this.rtl ? e - 1 - p : p];
        var d = n.length;
        if (d && (r || !m[n])) {
          var f = this.score ? this.score(c, n, p, null, 0) : O(t, e, p), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (f = 0; f < d; f++) {
                  for (var h = d; h > f; h--) {
                    g = n.substring(f, h);
                    var k = this.score ? this.score(c, n, p, g, f) : O(t, e, p, d, f);
                    P(this, m, g, k, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < d) {
                for (h = d - 1; 0 < h; h--) {
                  g = n[h] + g, k = this.score ? this.score(c, n, p, g, h) : O(t, e, p, d, h), P(this, m, g, k, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (h = 0; h < d; h++) {
                  g += n[h], P(this, m, g, f, a, b);
                }
                break;
              }
            default:
              if (P(this, m, n, f, a, b), r && 1 < e && p < e - 1) {
                for (d = y(), g = this.S, f = n, h = Math.min(r + 1, e - p), d[f] = 1, k = 1; k < h; k++) {
                  if ((n = c[this.rtl ? e - 1 - p - k : p + k]) && !d[n]) {
                    d[n] = 1;
                    const w = this.score ? this.score(c, f, p, n, k) : O(g + (e / 2 > g ? 0 : 1), e, p, h - 1, k - 1), B = this.bidirectional && n > f;
                    P(this, l, B ? f : n, w, a, b, B ? n : f);
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
function P(a, c, b, e, d, f, g) {
  let h = g ? a.D : a.map, k;
  c[b] && g && (k = c[b])[g] || (g ? (c = k || (c[b] = y()), c[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[e] || (h[e] = []), f && h.includes(d) || (h.push(d), a.fastupdate && ((c = a.h.get(d)) ? c.push(h) : a.h.set(d, [h]))));
}
function O(a, c, b, e, d) {
  return b && 1 < a ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;function Q(a, c, b) {
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
      if (e.length) {
        g > c && (f = f.slice(0, c), g = f.length), e.push(f);
      } else {
        if (g >= c) {
          return g > c && (f = f.slice(0, c)), f;
        }
        e = [f];
      }
      c -= g;
      if (!c) {
        break;
      }
    }
  }
  return e.length ? e = 1 < e.length ? [].concat.apply([], e) : e[0] : e;
}
;function ua(a, c) {
  const b = y(), e = y(), d = [];
  for (let f = 0; f < a.length; f++) {
    b[a[f]] = 1;
  }
  for (let f = 0, g; f < c.length; f++) {
    g = c[f];
    for (let h = 0, k; h < g.length; h++) {
      k = g[h], b[k] && !e[k] && (e[k] = 1, d.push(k));
    }
  }
  return d;
}
;N.prototype.search = function(a, c, b) {
  b || (!c && E(a) ? (b = a, a = "") : E(c) && (b = c, c = 0));
  var e = [], d = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    d = b.offset || 0;
    var f = b.context;
    var g = b.suggest;
  }
  a = this.encoder.encode(a);
  b = a.length;
  c || (c = 100);
  if (1 === b) {
    return R.call(this, a[0], "", c, d);
  }
  f = this.depth && !1 !== f;
  if (2 === b && f && !g) {
    return R.call(this, a[0], a[1], c, d);
  }
  var h = 0, k = 0;
  if (1 < b) {
    var l = y();
    const r = [];
    for (let t = 0, p; t < b; t++) {
      if ((p = a[t]) && !l[p]) {
        if (g || S(this, p)) {
          r.push(p), l[p] = 1;
        } else {
          return e;
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
    return e;
  }
  l = 0;
  if (1 === b) {
    return R.call(this, a[0], "", c, d);
  }
  if (2 === b && f && !g) {
    return R.call(this, a[0], a[1], c, d);
  }
  if (1 < b) {
    if (f) {
      var m = a[0];
      l = 1;
    } else {
      9 < h && 3 < h / k && a.sort(aa);
    }
  }
  for (let r, t; l < b; l++) {
    t = a[l];
    m ? (r = S(this, t, m), r = va(r, e, g, this.S, c, d, 2 === b), g && !1 === r && e.length || (m = t)) : (r = S(this, t), r = va(r, e, g, this.resolution, c, d, 1 === b));
    if (r) {
      return r;
    }
    if (g && l === b - 1) {
      f = e.length;
      if (!f) {
        if (m) {
          m = "";
          l = -1;
          continue;
        }
        return e;
      }
      if (1 === f) {
        return Q(e[0], c, d);
      }
    }
  }
  a: {
    a = e;
    e = this.resolution;
    m = g;
    b = a.length;
    g = [];
    f = y();
    for (let r = 0, t, p, n, w; r < e; r++) {
      for (k = 0; k < b; k++) {
        if (n = a[k], r < n.length && (t = n[r])) {
          for (l = 0; l < t.length; l++) {
            p = t[l], (h = f[p]) ? f[p]++ : (h = 0, f[p] = 1), w = g[h] || (g[h] = []), w.push(p);
          }
        }
      }
    }
    if (a = g.length) {
      if (m) {
        e = [];
        for (let r = a - 1, t = 0, p, n; 0 <= r; r--) {
          if (p = g[r], n = p.length, d >= n) {
            d -= n;
          } else {
            if (n + t > c || d) {
              p = p.slice(d, c - t + d), n = p.length;
            }
            e.push(p);
            t += n;
            if (c === t) {
              break;
            }
          }
        }
        g = 1 < e.length ? [].concat.apply([], e) : e[0];
      } else {
        if (a < b) {
          e = [];
          break a;
        }
        g = g[a - 1];
        if (g.length > c || d) {
          g = g.slice(d, c + d);
        }
      }
    }
    e = g;
  }
  return e;
};
function R(a, c, b, e) {
  return (a = S(this, a, c)) && a.length ? Q(a, b, e) : [];
}
function va(a, c, b, e, d, f, g) {
  let h = [];
  if (a) {
    e = Math.min(a.length, e);
    for (let k = 0, l = 0, m; k < e; k++) {
      if (m = a[k]) {
        if (f && m && g && (m.length <= f ? (f -= m.length, m = null) : (m = m.slice(f), f = 0)), m && (h[k] = m, g && (l += m.length, l >= d))) {
          break;
        }
      }
    }
    if (h.length) {
      if (g) {
        return Q(h, d, 0);
      }
      c.push(h);
      return;
    }
  }
  return !b && h;
}
function S(a, c, b) {
  let e;
  b && (e = a.bidirectional && c > b);
  a = b ? (a = a.D.get(e ? c : b)) && a.get(e ? b : c) : a.map.get(c);
  return a;
}
;N.prototype.remove = function(a, c) {
  const b = this.h.size && (this.fastupdate ? this.h.get(a) : this.h.has(a));
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
      T(this.map, a), this.depth && T(this.D, a);
    }
    c || this.h.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function T(a, c) {
  let b = 0;
  if (a.constructor === Array) {
    for (let e = 0, d, f; e < a.length; e++) {
      if ((d = a[e]) && d.length) {
        if (f = d.indexOf(c), 0 <= f) {
          1 < d.length ? (d.splice(f, 1), b++) : delete a[e];
          break;
        } else {
          b++;
        }
      }
    }
  } else {
    for (let e of a) {
      const d = e[0], f = T(e[1], c);
      f ? b += f : a.delete(d);
    }
  }
  return b;
}
;function N(a, c) {
  if (!this) {
    return new N(a);
  }
  if (a) {
    var b = z(a) ? a : a.preset;
    b && (sa[b] || console.warn("Preset not found: " + b), a = Object.assign({}, sa[b], a));
  } else {
    a = {};
  }
  b = a.context || {};
  const e = a.encode || a.encoder || ja;
  this.encoder = e.encode ? e : "object" === typeof e ? new J(e) : {encode:e};
  let d;
  this.resolution = a.resolution || 9;
  this.tokenize = d = a.tokenize || "strict";
  this.depth = "strict" === d && b.depth || 0;
  this.bidirectional = !1 !== b.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  d = !1;
  this.map = new Map();
  this.D = new Map();
  this.h = c || (this.fastupdate ? new Map() : new Set());
  this.S = b.resolution || 1;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (d = a.cache || null) && new K(d);
}
u = N.prototype;
u.clear = function() {
  this.map.clear();
  this.D.clear();
  this.h.clear();
  this.cache && this.cache.clear();
  return this;
};
u.append = function(a, c) {
  return this.add(a, c, !0);
};
u.contain = function(a) {
  return this.h.has(a);
};
u.update = function(a, c) {
  if (this.async) {
    const b = this, e = this.remove(a);
    return e.then ? e.then(() => b.add(a, c)) : this.add(a, c);
  }
  return this.remove(a).add(a, c);
};
function U(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, e; b < a.length; b++) {
      (e = a[b]) && (c += e.length);
    }
  } else {
    for (const b of a) {
      const e = b[0], d = U(b[1]);
      d ? c += d : a.delete(e);
    }
  }
  return c;
}
u.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  U(this.map);
  this.depth && U(this.D);
  return this;
};
u.searchCache = ia;
u.export = function(a, c, b, e, d, f) {
  let g = !0;
  "undefined" === typeof f && (g = new Promise(l => {
    f = l;
  }));
  let h, k;
  switch(d || (d = 0)) {
    case 0:
      h = "reg";
      if (this.fastupdate) {
        k = y();
        for (let l of this.h.keys()) {
          k[l] = 1;
        }
      } else {
        k = this.h;
      }
      break;
    case 1:
      h = "cfg";
      k = {doc:0, opt:this.A ? 1 : 0};
      break;
    case 2:
      h = "map";
      k = this.map;
      break;
    case 3:
      h = "ctx";
      k = this.D;
      break;
    default:
      "undefined" === typeof b && f && f();
      return;
  }
  ra(a, c || this, b, h, e, d, k, f);
  return g;
};
u.import = function(a, c) {
  if (c) {
    switch(z(c) && (c = JSON.parse(c)), a) {
      case "cfg":
        this.A = !!c.opt;
        break;
      case "reg":
        this.fastupdate = !1;
        this.h = c;
        break;
      case "map":
        this.map = c;
        break;
      case "ctx":
        this.D = c;
    }
  }
};
ta(N.prototype);
V.prototype.add = function(a, c, b) {
  E(a) && (c = a, a = F(c, this.key));
  if (c && (a || 0 === a)) {
    if (!b && this.h.has(a)) {
      return this.update(a, c);
    }
    for (let h = 0, k; h < this.field.length; h++) {
      k = this.F[h];
      var e = this.index.get(this.field[h]);
      if ("function" === typeof k) {
        var d = k(c);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = k.I, !d || d(c)) {
          k.constructor === String ? k = ["" + k] : z(k) && (k = [k]), W(c, k, this.K, 0, e, a, k[0], b);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.C.length; e++) {
        var f = this.C[e], g = this.T[e];
        d = this.tag.get(g);
        let h = y();
        if ("function" === typeof f) {
          if (f = f(c), !f) {
            continue;
          }
        } else {
          const k = f.I;
          if (k && !k(c)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = F(c, f);
        }
        if (d && f) {
          z(f) && (f = [f]);
          for (let k = 0, l, m; k < f.length; k++) {
            l = f[k], h[l] || (h[l] = 1, (g = d.get(l)) ? m = g : d.set(l, m = []), b && m.includes(a) || (m.push(a), this.fastupdate && ((g = this.h.get(a)) ? g.push(m) : this.h.set(a, [m]))));
          }
        } else {
          d || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!b || !this.store.has(a))) {
      let h;
      if (this.B) {
        h = y();
        for (let k = 0, l; k < this.B.length; k++) {
          l = this.B[k];
          if ((b = l.I) && !b(c)) {
            continue;
          }
          let m;
          if ("function" === typeof l) {
            m = l(c);
            if (!m) {
              continue;
            }
            l = [l.U];
          } else if (z(l) || l.constructor === String) {
            h[l] = c[l];
            continue;
          }
          X(c, h, l, 0, l[0], m);
        }
      }
      this.store.set(a, h || c);
    }
  }
  return this;
};
function X(a, c, b, e, d, f) {
  a = a[d];
  if (e === b.length - 1) {
    c[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (c = c[d] = Array(a.length), d = 0; d < a.length; d++) {
        X(a, c, b, e, d);
      }
    } else {
      c = c[d] || (c[d] = y()), d = b[++e], X(a, c, b, e, d);
    }
  }
}
function W(a, c, b, e, d, f, g, h) {
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
          W(a, c, b, e, d, f, g, h);
        }
      } else {
        g = c[++e], W(a, c, b, e, d, f, g, h);
      }
    }
  }
}
;V.prototype.search = function(a, c, b, e) {
  b || (!c && E(a) ? (b = a, a = "") : E(c) && (b = c, c = 0));
  let d = [];
  var f = [];
  let g, h, k, l, m;
  let r = 0;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    var t = b.pluck;
    h = b.merge;
    l = t || b.field || b.index;
    m = this.tag && b.tag;
    g = this.store && b.enrich;
    k = b.suggest;
    c = b.limit || c;
    var p = b.offset || 0;
    c || (c = 100);
    if (m) {
      m.constructor !== Array && (m = [m]);
      var n = [];
      for (let v = 0, q; v < m.length; v++) {
        q = m[v];
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
      m = n;
      if (!a) {
        e = [];
        if (n.length) {
          for (f = 0; f < n.length; f += 2) {
            t = wa.call(this, n[f], n[f + 1], c, p, g), d.push({field:n[f], tag:n[f + 1], result:t});
          }
        }
        return e.length ? Promise.all(e).then(function(v) {
          for (let q = 0; q < v.length; q++) {
            d[q].result = v[q];
          }
          return d;
        }) : d;
      }
    }
    z(l) && (l = [l]);
  }
  l || (l = this.field);
  p = !e && (this.worker || this.async) && [];
  for (let v = 0, q, C, D; v < l.length; v++) {
    C = l[v];
    let A;
    z(C) || (A = C, C = A.field, a = A.query || a, c = A.limit || c, k = A.suggest || k);
    if (e) {
      q = e[v];
    } else {
      if (n = A || b, w = this.index.get(C), m && (n.enrich = !1), p) {
        p[v] = w.searchAsync(a, c, n);
        n && g && (n.enrich = g);
        continue;
      } else {
        q = w.search(a, c, n), n && g && (n.enrich = g);
      }
    }
    D = q && q.length;
    if (m && D) {
      n = [];
      w = 0;
      for (let G = 0, H, Aa; G < m.length; G += 2) {
        H = this.tag.get(m[G]);
        if (!H) {
          if (console.warn("Tag '" + m[G] + ":" + m[G + 1] + "' will be skipped because there is no field '" + m[G] + "'."), k) {
            continue;
          } else {
            return d;
          }
        }
        if (Aa = (H = H && H.get(m[G + 1])) && H.length) {
          w++, n.push(H);
        } else if (!k) {
          return d;
        }
      }
      if (w) {
        q = ua(q, n);
        D = q.length;
        if (!D && !k) {
          return d;
        }
        w--;
      }
    }
    if (D) {
      f[r] = C, d.push(q), r++;
    } else if (1 === l.length) {
      return d;
    }
  }
  if (p) {
    const v = this;
    return Promise.all(p).then(function(q) {
      return q.length ? v.search(a, c, b, q) : q;
    });
  }
  if (!r) {
    return d;
  }
  if (t && (!g || !this.store)) {
    return d[0];
  }
  p = [];
  for (let v = 0, q; v < f.length; v++) {
    q = d[v];
    g && q.length && !q[0].doc && q.length && (q = xa.call(this, q));
    if (t) {
      return q;
    }
    d[v] = {field:f[v], result:q};
  }
  return h ? ya(d, c) : d;
};
function ya(a, c) {
  const b = [], e = y();
  for (let d = 0, f, g; d < a.length; d++) {
    f = a[d];
    g = f.result;
    for (let h = 0, k, l, m; h < g.length; h++) {
      if (l = g[h], k = l.id, m = e[k]) {
        m.push(f.field);
      } else {
        if (b.length === c) {
          return b;
        }
        l.field = e[k] = [f.field];
        b.push(l);
      }
    }
  }
  return b;
}
function wa(a, c, b, e, d) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(c)) && f.length - e) && 0 < a) {
    if (a > b || e) {
      f = f.slice(e, e + b);
    }
    d && (f = xa.call(this, f));
    return f;
  }
}
function xa(a) {
  const c = Array(a.length);
  for (let b = 0, e; b < a.length; b++) {
    e = a[b], c[b] = {id:e, doc:this.store.get(e)};
  }
  return c;
}
;function V(a) {
  if (!this) {
    return new V(a);
  }
  const c = a.document || a.doc || a;
  var b;
  this.F = [];
  this.field = [];
  this.K = [];
  this.key = (b = c.key || c.id) && Y(b, this.K) || "id";
  this.h = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.B = (b = c.store || null) && !0 !== b && [];
  this.store = b && new Map();
  this.cache = (b = a.cache || null) && new K(b);
  this.async = a.cache = !1;
  b = new Map();
  let e = c.index || c.field || c;
  z(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d], z(f) || (g = f, f = f.field), g = E(g) ? Object.assign({}, a, g) : a, b.set(f, new N(g, this.h)), g.custom ? this.F[d] = g.custom : (this.F[d] = Y(f, this.K), g.filter && ("string" === typeof this.F[d] && (this.F[d] = new String(this.F[d])), this.F[d].I = g.filter)), this.field[d] = f;
  }
  if (this.B) {
    a = c.store;
    z(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.custom ? (this.B[d] = f.custom, f.custom.U = g) : (this.B[d] = Y(g, this.K), f.filter && ("string" === typeof this.B[d] && (this.B[d] = new String(this.B[d])), this.B[d].I = f.filter));
    }
  }
  this.index = b;
  this.tag = null;
  if (b = c.tag) {
    if ("string" === typeof b && (b = [b]), b.length) {
      this.tag = new Map();
      this.C = [];
      this.T = [];
      for (let d = 0, f, g; d < b.length; d++) {
        f = b[d];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.C[d] = f.custom : (this.C[d] = Y(g, this.K), f.filter && ("string" === typeof this.C[d] && (this.C[d] = new String(this.C[d])), this.C[d].I = f.filter));
        this.T[d] = g;
        this.tag.set(g, new Map());
      }
    }
  }
}
function Y(a, c) {
  const b = a.split(":");
  let e = 0;
  for (let d = 0; d < b.length; d++) {
    a = b[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (c[e] = !0), a && (b[e++] = a);
  }
  e < b.length && (b.length = e);
  return 1 < e ? b : b[0];
}
u = V.prototype;
u.append = function(a, c) {
  return this.add(a, c, !0);
};
u.update = function(a, c) {
  return this.remove(a).add(a, c);
};
u.remove = function(a) {
  E(a) && (a = F(a, this.key));
  for (var c of this.index.values()) {
    c.remove(a, !0);
  }
  if (this.h.has(a)) {
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
    this.h.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
u.clear = function() {
  for (const a of this.index.values()) {
    a.clear();
  }
  if (this.tag) {
    for (const a of this.tag.values()) {
      a.clear();
    }
  }
  this.store && this.store.clear();
  return this;
};
u.contain = function(a) {
  return this.h.has(a);
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
u.searchCache = ia;
u.export = function(a, c, b, e, d, f) {
  let g;
  "undefined" === typeof f && (g = new Promise(k => {
    f = k;
  }));
  d || (d = 0);
  e || (e = 0);
  if (e < this.field.length) {
    b = this.field[e];
    var h = this.index[b];
    c = this;
    h.export(a, c, d ? b : "", e, d++, f) || (e++, c.export(a, c, b, e, 1, f));
  } else {
    switch(d) {
      case 1:
        c = "tag";
        h = this.G;
        b = null;
        break;
      case 2:
        c = "store";
        h = this.store;
        b = null;
        break;
      default:
        f();
        return;
    }
    ra(a, this, b, c, e, d, h, f);
  }
  return g;
};
u.import = function(a, c) {
  if (c) {
    switch(z(c) && (c = JSON.parse(c)), a) {
      case "tag":
        this.G = c;
        break;
      case "reg":
        this.fastupdate = !1;
        this.h = c;
        for (let e = 0, d; e < this.field.length; e++) {
          d = this.index[this.field[e]], d.h = c, d.fastupdate = !1;
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
ta(V.prototype);
const za = {Index:N, Charset:qa, Encoder:J, Document:V, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, Z = self;
let Ba;
(Ba = Z.define) && Ba.amd ? Ba([], function() {
  return za;
}) : "object" === typeof Z.exports ? Z.exports = za : Z.FlexSearch = za;
}(this));
