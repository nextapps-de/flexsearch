/**!
 * FlexSearch.js v0.8.0 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;
var v;
function y(a, c, b) {
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
function z() {
  return Object.create(null);
}
function aa(a, c) {
  return c.length - a.length;
}
function A(a) {
  return "string" === typeof a;
}
function F(a) {
  return "object" === typeof a;
}
function G(a, c) {
  if (A(c)) {
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
const ca = /[^\p{L}\p{N}]+/u, da = /(\d{3})/g, ea = /(\D)(\d{3})/g, fa = /(\d{3})(\D)/g, J = "".normalize && /[\u0300-\u036f]/g;
function K(a) {
  if (!this) {
    return new K(...arguments);
  }
  for (let c = 0; c < arguments.length; c++) {
    this.assign(arguments[c]);
  }
}
K.prototype.assign = function(a) {
  this.normalize = y(a.normalize, !0, this.normalize);
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
    try {
      this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
    } catch (f) {
      this.split = /\s+/;
    }
    this.numeric = e;
  } else {
    try {
      this.split = y(b, ca, this.split);
    } catch (e) {
      this.split = /\s+/;
    }
    this.numeric = y(this.numeric, !0);
  }
  this.prepare = y(a.prepare, null, this.prepare);
  this.finalize = y(a.finalize, null, this.finalize);
  J || (this.mapper = new Map(ba));
  this.rtl = a.rtl || !1;
  this.dedupe = y(a.dedupe, !0, this.dedupe);
  this.filter = y((b = a.filter) && new Set(b), null, this.filter);
  this.matcher = y((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = y((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = y((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = y(a.replacer, null, this.replacer);
  this.minlength = y(a.minlength, 1, this.minlength);
  this.maxlength = y(a.maxlength, 0, this.maxlength);
  if (this.cache = b = y(a.cache, !0, this.cache)) {
    this.J = null, this.O = "number" === typeof b ? b : 2e5, this.F = new Map(), this.H = new Map(), this.D = this.h = 128;
  }
  this.K = "";
  this.M = null;
  this.L = "";
  this.N = null;
  if (this.matcher) {
    for (const e of this.matcher.keys()) {
      this.K += (this.K ? "|" : "") + e;
    }
  }
  if (this.stemmer) {
    for (const e of this.stemmer.keys()) {
      this.L += (this.L ? "|" : "") + e;
    }
  }
  return this;
};
K.prototype.encode = function(a) {
  if (this.cache && a.length <= this.h) {
    if (this.J) {
      if (this.F.has(a)) {
        return this.F.get(a);
      }
    } else {
      this.J = setTimeout(ha, 0, this);
    }
  }
  this.normalize && (a = "function" === typeof this.normalize ? this.normalize(a) : J ? a.normalize("NFKD").replace(J, "").toLowerCase() : a.toLowerCase());
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
    if (this.cache && g.length <= this.D) {
      if (this.J) {
        var d = this.H.get(g);
        if (d || "" === d) {
          d && b.push(d);
          continue;
        }
      } else {
        this.J = setTimeout(ha, 0, this);
      }
    }
    let k;
    this.stemmer && 2 < g.length && (this.N || (this.N = new RegExp("(?!^)(" + this.L + ")$")), g = g.replace(this.N, l => this.stemmer.get(l)), k = 1);
    this.matcher && 1 < g.length && (this.M || (this.M = new RegExp("(" + this.K + ")", "g")), g = g.replace(this.M, l => this.matcher.get(l)), k = 1);
    g && k && (g.length < this.minlength || this.filter && this.filter.has(g)) && (g = "");
    if (g && (this.mapper || this.dedupe && 1 < g.length)) {
      d = "";
      for (let l = 0, m = "", n, t; l < g.length; l++) {
        n = g.charAt(l), n === m && this.dedupe || ((t = this.mapper && this.mapper.get(n)) || "" === t ? t === m && this.dedupe || !(m = t) || (d += t) : d += m = n);
      }
      g = d;
    }
    if (g && this.replacer) {
      for (d = 0; g && d < this.replacer.length; d += 2) {
        g = g.replace(this.replacer[d], this.replacer[d + 1]);
      }
    }
    this.cache && h.length <= this.D && (this.H.set(h, g), this.H.size > this.O && (this.H.clear(), this.D = this.D / 1.1 | 0));
    g && b.push(g);
  }
  this.finalize && (b = this.finalize(b) || b);
  this.cache && a.length <= this.h && (this.F.set(a, b), this.F.size > this.O && (this.F.clear(), this.h = this.h / 1.1 | 0));
  return b;
};
function ha(a) {
  a.J = null;
  a.F.clear();
  a.H.clear();
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
function L(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
L.prototype.set = function(a, c) {
  this.cache.set(this.h = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
L.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
  return c;
};
L.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
L.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const ja = {normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1};
const M = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const ka = new Map([["ai", "ei"], ["ae", "a"], ["oe", "o"], ["ue", "u"], ["sh", "s"], ["ch", "c"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), la = [/([^aeo])h([aeo$])/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2"];
const ma = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const na = /[\x00-\x7F]+/g;
const oa = /[\x00-\x7F]+/g;
const pa = /[\x00-\x7F]+/g;
var qa = {LatinExact:{normalize:!1, dedupe:!1}, LatinDefault:ja, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:M}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:M, replacer:la, matcher:ka}, LatinExtra:{normalize:!0, dedupe:!0, mapper:M, replacer:la.concat([/(?!^)[aeoy]/g, ""]), matcher:ka}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
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
    c = this[a].apply(this, c);
    e && (c.then ? c.then(e) : e(c));
    return c;
  };
}
;z();
O.prototype.add = function(a, c, b, e) {
  if (c && (a || 0 === a)) {
    if (!e && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (e = c.length) {
      const l = z(), m = z(), n = this.depth, t = this.resolution;
      for (let p = 0; p < e; p++) {
        let q = c[this.rtl ? e - 1 - p : p];
        var d = q.length;
        if (d && (n || !m[q])) {
          var f = this.score ? this.score(c, q, p, null, 0) : P(t, e, p), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (f = 0; f < d; f++) {
                  for (var h = d; h > f; h--) {
                    g = q.substring(f, h);
                    var k = this.score ? this.score(c, q, p, g, f) : P(t, e, p, d, f);
                    Q(this, m, g, k, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < d) {
                for (h = d - 1; 0 < h; h--) {
                  g = q[h] + g, k = this.score ? this.score(c, q, p, g, h) : P(t, e, p, d, h), Q(this, m, g, k, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (h = 0; h < d; h++) {
                  g += q[h], Q(this, m, g, f, a, b);
                }
                break;
              }
            default:
              if (Q(this, m, q, f, a, b), n && 1 < e && p < e - 1) {
                for (d = z(), g = this.P, f = q, h = Math.min(n + 1, e - p), d[f] = 1, k = 1; k < h; k++) {
                  if ((q = c[this.rtl ? e - 1 - p - k : p + k]) && !d[q]) {
                    d[q] = 1;
                    const u = this.score ? this.score(c, f, p, q, k) : P(g + (e / 2 > g ? 0 : 1), e, p, h - 1, k - 1), w = this.bidirectional && q > f;
                    Q(this, l, w ? f : q, u, a, b, w ? q : f);
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
function Q(a, c, b, e, d, f, g) {
  let h = g ? a.ctx : a.map, k;
  c[b] && g && (k = c[b])[g] || (g ? (c = k || (c[b] = z()), c[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[e] || (h[e] = []), f && h.includes(d) || (h.push(d), a.fastupdate && ((c = a.reg.get(d)) ? c.push(h) : a.reg.set(d, [h]))));
}
function P(a, c, b, e, d) {
  return b && 1 < a ? c + (e || 0) <= a ? b + (d || 0) : (a - 1) / (c + (e || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;function ua(a, c, b) {
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
;function va(a, c) {
  const b = z(), e = [];
  for (let d = 0, f; d < c.length; d++) {
    f = c[d];
    for (let g = 0; g < f.length; g++) {
      b[f[g]] = 1;
    }
  }
  for (let d = 0, f; d < a.length; d++) {
    f = a[d], 1 === b[f] && (e.push(f), b[f] = 2);
  }
  return e;
}
;O.prototype.search = function(a, c, b) {
  b || (!c && F(a) ? (b = a, a = "") : F(c) && (b = c, c = 0));
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
    var l = z();
    const n = [];
    for (let t = 0, p; t < b; t++) {
      if ((p = a[t]) && !l[p]) {
        if (g || S(this, p)) {
          n.push(p), l[p] = 1;
        } else {
          return e;
        }
        const q = p.length;
        h = Math.max(h, q);
        k = k ? Math.min(k, q) : q;
      }
    }
    a = n;
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
  for (let n, t; l < b; l++) {
    t = a[l];
    m ? (n = S(this, t, m), n = wa(n, e, g, this.P), g && !1 === n && e.length || (m = t)) : (n = S(this, t, ""), n = wa(n, e, g, this.resolution));
    if (n) {
      return n;
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
        return ua(e[0], c, d);
      }
    }
  }
  a: {
    a = e;
    e = this.resolution;
    m = a.length;
    b = [];
    f = z();
    for (let n = 0, t, p, q, u; n < e; n++) {
      for (k = 0; k < m; k++) {
        if (q = a[k], n < q.length && (t = q[n])) {
          for (l = 0; l < t.length; l++) {
            p = t[l], (h = f[p]) ? f[p]++ : (h = 0, f[p] = 1), u = b[h] || (b[h] = []), u.push(p);
          }
        }
      }
    }
    if (a = b.length) {
      if (g) {
        if (1 < b.length) {
          b: {
            g = b;
            a = [];
            e = z();
            m = g.length;
            for (h = m - 1; 0 <= h; h--) {
              for (m = g[h], f = m.length, k = 0; k < f; k++) {
                if (b = m[k], !e[b]) {
                  if (e[b] = 1, d) {
                    d--;
                  } else {
                    if (a.push(b), a.length === c) {
                      c = a;
                      break b;
                    }
                  }
                }
              }
            }
            c = a;
          }
        } else {
          c = b[0];
        }
        b = c;
      } else {
        if (a < m) {
          e = [];
          break a;
        }
        b = b[a - 1];
        if (c || d) {
          if (b.length > c || d) {
            b = b.slice(d, c + d);
          }
        }
      }
    }
    e = b;
  }
  return e;
};
function R(a, c, b, e) {
  return (a = S(this, a, c)) && a.length ? ua(a, b, e) : [];
}
function wa(a, c, b, e) {
  let d = [];
  if (a) {
    e = Math.min(a.length, e);
    for (let f = 0, g; f < e; f++) {
      (g = a[f]) && g && (d[f] = g);
    }
    if (d.length) {
      c.push(d);
      return;
    }
  }
  return !b && d;
}
function S(a, c, b) {
  let e;
  b && (e = a.bidirectional && c > b);
  a = b ? (a = a.ctx.get(e ? c : b)) && a.get(e ? b : c) : a.map.get(c);
  return a;
}
;O.prototype.remove = function(a, c) {
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
      T(this.map, a), this.depth && T(this.ctx, a);
    }
    c || this.reg.delete(a);
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
;function O(a, c) {
  if (!this) {
    return new O(a);
  }
  if (a) {
    var b = A(a) ? a : a.preset;
    b && (sa[b] || console.warn("Preset not found: " + b), a = Object.assign({}, sa[b], a));
  } else {
    a = {};
  }
  b = a.context || {};
  const e = A(a.encoder) ? qa[a.encoder] : a.encode || a.encoder || ja;
  this.encoder = e.encode ? e : "object" === typeof e ? new K(e) : {encode:e};
  let d;
  this.resolution = a.resolution || 9;
  this.tokenize = d = a.tokenize || "strict";
  this.depth = "strict" === d && b.depth || 0;
  this.bidirectional = !1 !== b.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  d = !1;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.P = b.resolution || 1;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (d = a.cache || null) && new L(d);
}
v = O.prototype;
v.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  return this;
};
v.append = function(a, c) {
  return this.add(a, c, !0);
};
v.contain = function(a) {
  return this.reg.has(a);
};
v.update = function(a, c) {
  const b = this, e = this.remove(a);
  return e && e.then ? e.then(() => b.add(a, c)) : this.add(a, c);
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
v.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  U(this.map);
  this.depth && U(this.ctx);
  return this;
};
v.searchCache = ia;
v.export = function(a, c, b, e, d, f) {
  let g = !0;
  "undefined" === typeof f && (g = new Promise(l => {
    f = l;
  }));
  let h, k;
  switch(d || (d = 0)) {
    case 0:
      h = "reg";
      if (this.fastupdate) {
        k = z();
        for (let l of this.reg.keys()) {
          k[l] = 1;
        }
      } else {
        k = this.reg;
      }
      break;
    case 1:
      h = "cfg";
      k = {doc:0, opt:this.h ? 1 : 0};
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
      "undefined" === typeof b && f && f();
      return;
  }
  ra(a, c || this, b, h, e, d, k, f);
  return g;
};
v.import = function(a, c) {
  if (c) {
    switch(A(c) && (c = JSON.parse(c)), a) {
      case "cfg":
        this.h = !!c.opt;
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
v.serialize = function(a = !0) {
  if (!this.reg.size) {
    return "";
  }
  let c = "", b = "";
  for (var e of this.reg.keys()) {
    b || (b = typeof e), c += (c ? "," : "") + ("string" === b ? '"' + e + '"' : e);
  }
  c = "index.reg=new Set([" + c + "]);";
  e = "";
  for (var d of this.map.entries()) {
    var f = d[0], g = d[1], h = "";
    for (let m = 0, n; m < g.length; m++) {
      n = g[m] || [""];
      var k = "";
      for (var l = 0; l < n.length; l++) {
        k += (k ? "," : "") + ("string" === b ? '"' + n[l] + '"' : n[l]);
      }
      k = "[" + k + "]";
      h += (h ? "," : "") + k;
    }
    h = '["' + f + '",[' + h + "]]";
    e += (e ? "," : "") + h;
  }
  e = "index.map=new Map([" + e + "]);";
  d = "";
  for (const m of this.ctx.entries()) {
    f = m[0];
    g = m[1];
    for (const n of g.entries()) {
      g = n[0];
      h = n[1];
      k = "";
      for (let t = 0, p; t < h.length; t++) {
        p = h[t] || [""];
        l = "";
        for (let q = 0; q < p.length; q++) {
          l += (l ? "," : "") + ("string" === b ? '"' + p[q] + '"' : p[q]);
        }
        l = "[" + l + "]";
        k += (k ? "," : "") + l;
      }
      k = 'new Map([["' + g + '",[' + k + "]]])";
      k = '["' + f + '",' + k + "]";
      d += (d ? "," : "") + k;
    }
  }
  d = "index.ctx=new Map([" + d + "]);";
  return a ? "function inject(index){" + c + e + d + "}" : c + e + d;
};
ta(O.prototype);
V.prototype.add = function(a, c, b) {
  F(a) && (c = a, a = G(c, this.key));
  if (c && (a || 0 === a)) {
    if (!b && this.reg.has(a)) {
      return this.update(a, c);
    }
    for (let h = 0, k; h < this.field.length; h++) {
      k = this.C[h];
      var e = this.index.get(this.field[h]);
      if ("function" === typeof k) {
        var d = k(c);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = k.G, !d || d(c)) {
          k.constructor === String ? k = ["" + k] : A(k) && (k = [k]), W(c, k, this.I, 0, e, a, k[0], b);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.B.length; e++) {
        var f = this.B[e], g = this.R[e];
        d = this.tag.get(g);
        let h = z();
        if ("function" === typeof f) {
          if (f = f(c), !f) {
            continue;
          }
        } else {
          const k = f.G;
          if (k && !k(c)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = G(c, f);
        }
        if (d && f) {
          A(f) && (f = [f]);
          for (let k = 0, l, m; k < f.length; k++) {
            l = f[k], h[l] || (h[l] = 1, (g = d.get(l)) ? m = g : d.set(l, m = []), b && m.includes(a) || (m.push(a), this.fastupdate && ((g = this.reg.get(a)) ? g.push(m) : this.reg.set(a, [m]))));
          }
        } else {
          d || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!b || !this.store.has(a))) {
      let h;
      if (this.A) {
        h = z();
        for (let k = 0, l; k < this.A.length; k++) {
          l = this.A[k];
          if ((b = l.G) && !b(c)) {
            continue;
          }
          let m;
          if ("function" === typeof l) {
            m = l(c);
            if (!m) {
              continue;
            }
            l = [l.S];
          } else if (A(l) || l.constructor === String) {
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
      c = c[d] || (c[d] = z()), d = b[++e], X(a, c, b, e, d);
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
  b || (!c && F(a) ? (b = a, a = "") : F(c) && (b = c, c = 0));
  let d = [];
  var f = [];
  let g, h, k, l, m, n, t = 0, p;
  if (b) {
    b.constructor === Array && (b = {index:b});
    a = b.query || a;
    var q = b.pluck;
    h = b.merge;
    l = q || b.field || b.index;
    m = this.tag && b.tag;
    g = this.store && b.enrich;
    k = b.suggest;
    p = b.T;
    c = b.limit || c;
    n = b.offset || 0;
    c || (c = 100);
    if (m) {
      m.constructor !== Array && (m = [m]);
      var u = [];
      for (let x = 0, r; x < m.length; x++) {
        r = m[x];
        if (A(r)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (r.field && r.tag) {
          var w = r.tag;
          if (w.constructor === Array) {
            for (var B = 0; B < w.length; B++) {
              u.push(r.field, w[B]);
            }
          } else {
            u.push(r.field, w);
          }
        } else {
          w = Object.keys(r);
          for (let D = 0, E, C; D < w.length; D++) {
            if (E = w[D], C = r[E], C.constructor === Array) {
              for (B = 0; B < C.length; B++) {
                u.push(E, C[B]);
              }
            } else {
              u.push(E, C);
            }
          }
        }
      }
      if (!u.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      m = u;
      if (!a) {
        e = [];
        if (u.length) {
          for (f = 0; f < u.length; f += 2) {
            q = xa.call(this, u[f], u[f + 1], c, n, g), d.push({field:u[f], tag:u[f + 1], result:q});
          }
        }
        return e.length ? Promise.all(e).then(function(x) {
          for (let r = 0; r < x.length; r++) {
            d[r].result = x[r];
          }
          return d;
        }) : d;
      }
    }
    A(l) && (l = [l]);
  }
  l || (l = this.field);
  u = !e && (this.worker || this.db) && [];
  for (let x = 0, r, D, E; x < l.length; x++) {
    D = l[x];
    let C;
    A(D) || (C = D, D = C.field, a = C.query || a, c = C.limit || c, n = C.offset || n, k = C.suggest || k, g = this.store && (C.enrich || g));
    if (e) {
      r = e[x];
    } else {
      if (w = C || b, B = this.index.get(D), m && (w.enrich = !1), u) {
        u[x] = B.search(a, c, w);
        w && g && (w.enrich = g);
        continue;
      } else {
        r = B.search(a, c, w), w && g && (w.enrich = g);
      }
    }
    E = r && r.length;
    if (m && E) {
      w = [];
      B = 0;
      for (let H = 0, I, Ba; H < m.length; H += 2) {
        I = this.tag.get(m[H]);
        if (!I) {
          if (console.warn("Tag '" + m[H] + ":" + m[H + 1] + "' will be skipped because there is no field '" + m[H] + "'."), k) {
            continue;
          } else {
            return d;
          }
        }
        if (Ba = (I = I && I.get(m[H + 1])) && I.length) {
          B++, w.push(I);
        } else if (!k) {
          return d;
        }
      }
      if (B) {
        r = va(r, w);
        E = r.length;
        if (!E && !k) {
          return d;
        }
        B--;
      }
    }
    if (E) {
      f[t] = D, d.push(r), t++;
    } else if (1 === l.length) {
      return d;
    }
  }
  if (u) {
    const x = this;
    return Promise.all(u).then(function(r) {
      return r.length ? x.search(a, c, b, r) : r;
    });
  }
  if (!t) {
    return d;
  }
  if (q && (!g || !this.store)) {
    return d[0];
  }
  u = [];
  for (let x = 0, r; x < f.length; x++) {
    r = d[x];
    g && r.length && !r[0].doc && r.length && (r = ya.call(this, r));
    if (q) {
      return r;
    }
    d[x] = {field:f[x], result:r};
  }
  return h ? za(d, c) : p ? Aa(d, a, this.index, this.C, p) : d;
};
function Aa(a, c, b, e, d) {
  let f;
  for (let g = 0, h, k, l, m; g < a.length; g++) {
    h = a[g].result;
    k = a[g].field;
    l = b.get(k).encoder;
    m = e[k.indexOf(k)];
    l !== f && (f = l, f.encode(c));
    for (let n = 0; n < h.length; n++) {
      let t = "", p = G(h[n].doc, m), q = f.encode(p);
      for (let u = 0; u < q.length; u++) {
        t += q[u].replace(new RegExp("(" + q[u] + ")", "g"), d.replace("$1", p));
      }
      console.log(a, b, d);
      h[n].T = t;
    }
  }
  return a;
}
function za(a, c) {
  const b = [], e = z();
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
function xa(a, c, b, e, d) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(c)) && f.length - e) && 0 < a) {
    if (a > b || e) {
      f = f.slice(e, e + b);
    }
    d && (f = ya.call(this, f));
    return f;
  }
}
function ya(a) {
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
  this.C = [];
  this.field = [];
  this.I = [];
  this.key = (b = c.key || c.id) && Y(b, this.I) || "id";
  this.reg = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.A = (b = c.store || null) && !0 !== b && [];
  this.store = b && new Map();
  this.cache = (b = a.cache || null) && new L(b);
  a.cache = !1;
  b = new Map();
  let e = c.index || c.field || c;
  A(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d], A(f) || (g = f, f = f.field), g = F(g) ? Object.assign({}, a, g) : a, b.set(f, new O(g, this.reg)), g.custom ? this.C[d] = g.custom : (this.C[d] = Y(f, this.I), g.filter && ("string" === typeof this.C[d] && (this.C[d] = new String(this.C[d])), this.C[d].G = g.filter)), this.field[d] = f;
  }
  if (this.A) {
    a = c.store;
    A(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.custom ? (this.A[d] = f.custom, f.custom.S = g) : (this.A[d] = Y(g, this.I), f.filter && ("string" === typeof this.A[d] && (this.A[d] = new String(this.A[d])), this.A[d].G = f.filter));
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
        f.custom ? this.B[d] = f.custom : (this.B[d] = Y(g, this.I), f.filter && ("string" === typeof this.B[d] && (this.B[d] = new String(this.B[d])), this.B[d].G = f.filter));
        this.R[d] = g;
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
v = V.prototype;
v.append = function(a, c) {
  return this.add(a, c, !0);
};
v.update = function(a, c) {
  return this.remove(a).add(a, c);
};
v.remove = function(a) {
  F(a) && (a = G(a, this.key));
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
v.clear = function() {
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
v.contain = function(a) {
  return this.reg.has(a);
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
v.set = function(a, c) {
  this.store.set(a, c);
  return this;
};
v.searchCache = ia;
v.export = function(a, c, b, e, d, f) {
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
        h = this.D;
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
v.import = function(a, c) {
  if (c) {
    switch(A(c) && (c = JSON.parse(c)), a) {
      case "tag":
        this.D = c;
        break;
      case "reg":
        this.fastupdate = !1;
        this.reg = c;
        for (let e = 0, d; e < this.field.length; e++) {
          d = this.index[this.field[e]], d.reg = c, d.fastupdate = !1;
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
const Ca = {Index:O, Charset:qa, Encoder:K, Document:V, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, Z = self;
let Da;
(Da = Z.define) && Da.amd ? Da([], function() {
  return Ca;
}) : "object" === typeof Z.exports ? Z.exports = Ca : Z.FlexSearch = Ca;
}(this||self));
