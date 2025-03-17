/**!
 * FlexSearch.js v0.8.001 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var w;
function B(a, b, c) {
  const e = typeof c, d = typeof a;
  if ("undefined" !== e) {
    if ("undefined" !== d) {
      if (c) {
        if ("function" === d && e === d) {
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
            var f = new Map(c);
            for (var g of a) {
              f.set(g[0], g[1]);
            }
            return f;
          }
          if (b === Set) {
            g = new Set(c);
            for (f of a.values()) {
              g.add(f);
            }
            return g;
          }
        }
      }
      return a;
    }
    return c;
  }
  return "undefined" === d ? b : a;
}
function C() {
  return Object.create(null);
}
function aa(a, b) {
  return b.length - a.length;
}
function E(a) {
  return "string" === typeof a;
}
function H(a) {
  return "object" === typeof a;
}
function I(a, b) {
  if (E(b)) {
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
const ca = /[^\p{L}\p{N}]+/u, da = /(\d{3})/g, ea = /(\D)(\d{3})/g, fa = /(\d{3})(\D)/g, J = "".normalize && /[\u0300-\u036f]/g;
function L(a) {
  if (!this || this.constructor !== L) {
    return new L(...arguments);
  }
  for (let b = 0; b < arguments.length; b++) {
    this.assign(arguments[b]);
  }
}
w = L.prototype;
w.assign = function(a) {
  this.normalize = B(a.normalize, !0, this.normalize);
  let b = a.include, c = b || a.exclude || a.split;
  if ("object" === typeof c) {
    let e = !b, d = "";
    a.include || (d += "\\p{Z}");
    c.letter && (d += "\\p{L}");
    c.number && (d += "\\p{N}", e = !!b);
    c.symbol && (d += "\\p{S}");
    c.punctuation && (d += "\\p{P}");
    c.control && (d += "\\p{C}");
    if (c = c.char) {
      d += "object" === typeof c ? c.join("") : c;
    }
    try {
      this.split = new RegExp("[" + (b ? "^" : "") + d + "]+", "u");
    } catch (f) {
      this.split = /\s+/;
    }
    this.numeric = e;
  } else {
    try {
      this.split = B(c, ca, this.split);
    } catch (e) {
      this.split = /\s+/;
    }
    this.numeric = B(this.numeric, !0);
  }
  this.prepare = B(a.prepare, null, this.prepare);
  this.finalize = B(a.finalize, null, this.finalize);
  J || (this.mapper = new Map(ba));
  this.rtl = a.rtl || !1;
  this.dedupe = B(a.dedupe, !0, this.dedupe);
  this.filter = B((c = a.filter) && new Set(c), null, this.filter);
  this.matcher = B((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = B((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = B((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = B(a.replacer, null, this.replacer);
  this.minlength = B(a.minlength, 1, this.minlength);
  this.maxlength = B(a.maxlength, 0, this.maxlength);
  if (this.cache = c = B(a.cache, !0, this.cache)) {
    this.J = null, this.O = "number" === typeof c ? c : 2e5, this.F = new Map(), this.G = new Map(), this.L = this.K = 128;
  }
  this.h = "";
  this.M = null;
  this.D = "";
  this.N = null;
  if (this.matcher) {
    for (const e of this.matcher.keys()) {
      this.h += (this.h ? "|" : "") + e;
    }
  }
  if (this.stemmer) {
    for (const e of this.stemmer.keys()) {
      this.D += (this.D ? "|" : "") + e;
    }
  }
  return this;
};
w.addMatcher = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (2 > a.length) {
    return this.addMapper(a, b);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, b);
  this.h += (this.h ? "|" : "") + a;
  this.M = null;
  this.cache && M(this);
  return this;
};
w.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.D += (this.D ? "|" : "") + a;
  this.N = null;
  this.cache && M(this);
  return this;
};
w.addFilter = function(a) {
  this.filter || (this.filter = new Set());
  this.filter.add(a);
  this.cache && M(this);
  return this;
};
w.addMapper = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (1 < a.length) {
    return this.addMatcher(a, b);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, b);
  this.cache && M(this);
  return this;
};
w.addReplacer = function(a, b) {
  "string" === typeof a && (a = new RegExp(a, "g"));
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b || "");
  this.cache && M(this);
  return this;
};
function M(a) {
  a.F.clear();
  a.G.clear();
}
w.encode = function(a) {
  if (this.cache && a.length <= this.K) {
    if (this.J) {
      if (this.F.has(a)) {
        return this.F.get(a);
      }
    } else {
      this.J = setTimeout(ha, 50, this);
    }
  }
  this.normalize && (a = "function" === typeof this.normalize ? this.normalize(a) : J ? a.normalize("NFKD").replace(J, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ea, "$1 $2").replace(fa, "$1 $2").replace(da, "$1 "));
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let c = [], e = this.split || "" === this.split ? a.split(this.split) : a;
  for (let f = 0, g, h; f < e.length; f++) {
    if (!(g = h = e[f])) {
      continue;
    }
    if (g.length < this.minlength) {
      continue;
    }
    if (b) {
      c.push(g);
      continue;
    }
    if (this.filter && this.filter.has(g)) {
      continue;
    }
    if (this.cache && g.length <= this.L) {
      if (this.J) {
        var d = this.G.get(g);
        if (d || "" === d) {
          d && c.push(d);
          continue;
        }
      } else {
        this.J = setTimeout(ha, 50, this);
      }
    }
    let k;
    this.stemmer && 2 < g.length && (this.N || (this.N = new RegExp("(?!^)(" + this.D + ")$")), g = g.replace(this.N, l => this.stemmer.get(l)), k = 1);
    g && k && (g.length < this.minlength || this.filter && this.filter.has(g)) && (g = "");
    if (g && (this.mapper || this.dedupe && 1 < g.length)) {
      d = "";
      for (let l = 0, m = "", r, t; l < g.length; l++) {
        r = g.charAt(l), r === m && this.dedupe || ((t = this.mapper && this.mapper.get(r)) || "" === t ? t === m && this.dedupe || !(m = t) || (d += t) : d += m = r);
      }
      g = d;
    }
    this.matcher && 1 < g.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), g = g.replace(this.M, l => this.matcher.get(l)));
    if (g && this.replacer) {
      for (d = 0; g && d < this.replacer.length; d += 2) {
        g = g.replace(this.replacer[d], this.replacer[d + 1]);
      }
    }
    this.cache && h.length <= this.L && (this.G.set(h, g), this.G.size > this.O && (this.G.clear(), this.L = this.L / 1.1 | 0));
    g && c.push(g);
  }
  this.finalize && (c = this.finalize(c) || c);
  this.cache && a.length <= this.K && (this.F.set(a, c), this.F.size > this.O && (this.F.clear(), this.K = this.K / 1.1 | 0));
  return c;
};
function ha(a) {
  a.J = null;
  a.F.clear();
  a.G.clear();
}
;function ia(a) {
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
    b = this[a].apply(this, b);
    e && (b.then ? b.then(e) : e(b));
    return b;
  };
}
;function O(a, b = 0) {
  let c = [], e = [];
  b && (b = 250000 / b * 5000 | 0);
  for (const d of a.entries()) {
    e.push(d), e.length === b && (c.push(e), e = []);
  }
  e.length && c.push(e);
  return c;
}
function P(a, b) {
  b || (b = new Map());
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b.set(e[0], e[1]);
  }
  return b;
}
function ja(a, b = 0) {
  let c = [], e = [];
  b && (b = 250000 / b * 1000 | 0);
  for (const d of a.entries()) {
    e.push([d[0], O(d[1])[0]]), e.length === b && (c.push(e), e = []);
  }
  e.length && c.push(e);
  return c;
}
function ka(a, b) {
  b || (b = new Map());
  for (let c = 0, e, d; c < a.length; c++) {
    e = a[c], d = b.get(e[0]), b.set(e[0], P(e[1], d));
  }
  return b;
}
function la(a) {
  let b = [], c = [];
  for (const e of a.keys()) {
    c.push(e), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function ma(a, b) {
  b || (b = new Set());
  for (let c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function Q(a, b, c, e, d, f, g = 0) {
  const h = e && e.constructor === Array;
  var k = h ? e.shift() : e;
  if (!k) {
    return this.export(a, b, d, f + 1);
  }
  if ((k = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(k))) && k.then) {
    const l = this;
    return k.then(function() {
      return Q.call(l, a, b, c, h ? e : null, d, f, g + 1);
    });
  }
  return Q.call(this, a, b, c, h ? e : null, d, f, g + 1);
}
;R.prototype.add = function(a, b, c) {
  H(a) && (b = a, a = I(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (let h = 0, k; h < this.field.length; h++) {
      k = this.C[h];
      var e = this.index.get(this.field[h]);
      if ("function" === typeof k) {
        var d = k(b);
        d && e.add(a, d, !1, !0);
      } else {
        if (d = k.H, !d || d(b)) {
          k.constructor === String ? k = ["" + k] : E(k) && (k = [k]), S(b, k, this.I, 0, e, a, k[0], c);
        }
      }
    }
    if (this.tag) {
      for (e = 0; e < this.B.length; e++) {
        var f = this.B[e], g = this.R[e];
        d = this.tag.get(g);
        let h = C();
        if ("function" === typeof f) {
          if (f = f(b), !f) {
            continue;
          }
        } else {
          const k = f.H;
          if (k && !k(b)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = I(b, f);
        }
        if (d && f) {
          E(f) && (f = [f]);
          for (let k = 0, l, m; k < f.length; k++) {
            l = f[k], h[l] || (h[l] = 1, (g = d.get(l)) ? m = g : d.set(l, m = []), c && m.includes(a) || (m.push(a), this.fastupdate && ((g = this.reg.get(a)) ? g.push(m) : this.reg.set(a, [m]))));
          }
        } else {
          d || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!c || !this.store.has(a))) {
      let h;
      if (this.A) {
        h = C();
        for (let k = 0, l; k < this.A.length; k++) {
          l = this.A[k];
          if ((c = l.H) && !c(b)) {
            continue;
          }
          let m;
          if ("function" === typeof l) {
            m = l(b);
            if (!m) {
              continue;
            }
            l = [l.S];
          } else if (E(l) || l.constructor === String) {
            h[l] = b[l];
            continue;
          }
          na(b, h, l, 0, l[0], m);
        }
      }
      this.store.set(a, h || b);
    }
  }
  return this;
};
function na(a, b, c, e, d, f) {
  a = a[d];
  if (e === c.length - 1) {
    b[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[d] = Array(a.length), d = 0; d < a.length; d++) {
        na(a, b, c, e, d);
      }
    } else {
      b = b[d] || (b[d] = C()), d = c[++e], na(a, b, c, e, d);
    }
  }
}
function S(a, b, c, e, d, f, g, h) {
  if (a = a[g]) {
    if (e === b.length - 1) {
      if (a.constructor === Array) {
        if (c[e]) {
          for (b = 0; b < a.length; b++) {
            d.add(f, a[b], !0, !0);
          }
          return;
        }
        a = a.join(" ");
      }
      d.add(f, a, h, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          S(a, b, c, e, d, f, g, h);
        }
      } else {
        g = b[++e], S(a, b, c, e, d, f, g, h);
      }
    }
  }
}
;function oa(a, b) {
  const c = C(), e = [];
  for (let d = 0, f; d < b.length; d++) {
    f = b[d];
    for (let g = 0; g < f.length; g++) {
      c[f[g]] = 1;
    }
  }
  for (let d = 0, f; d < a.length; d++) {
    f = a[d], 1 === c[f] && (e.push(f), c[f] = 2);
  }
  return e;
}
;R.prototype.search = function(a, b, c, e) {
  c || (!b && H(a) ? (c = a, a = "") : H(b) && (c = b, b = 0));
  let d = [];
  var f = [];
  let g, h, k, l, m, r, t = 0, q;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    var n = c.pluck;
    h = c.merge;
    l = n || c.field || c.index;
    m = this.tag && c.tag;
    g = this.store && c.enrich;
    k = c.suggest;
    q = c.highlight;
    b = c.limit || b;
    r = c.offset || 0;
    b || (b = 100);
    if (m) {
      m.constructor !== Array && (m = [m]);
      var u = [];
      for (let x = 0, p; x < m.length; x++) {
        p = m[x];
        if (E(p)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (p.field && p.tag) {
          var v = p.tag;
          if (v.constructor === Array) {
            for (var y = 0; y < v.length; y++) {
              u.push(p.field, v[y]);
            }
          } else {
            u.push(p.field, v);
          }
        } else {
          v = Object.keys(p);
          for (let D = 0, A, z; D < v.length; D++) {
            if (A = v[D], z = p[A], z.constructor === Array) {
              for (y = 0; y < z.length; y++) {
                u.push(A, z[y]);
              }
            } else {
              u.push(A, z);
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
            n = pa.call(this, u[f], u[f + 1], b, r, g), d.push({field:u[f], tag:u[f + 1], result:n});
          }
        }
        return e.length ? Promise.all(e).then(function(x) {
          for (let p = 0; p < x.length; p++) {
            d[p].result = x[p];
          }
          return d;
        }) : d;
      }
    }
    E(l) && (l = [l]);
  }
  l || (l = this.field);
  u = !e && (this.worker || this.db) && [];
  for (let x = 0, p, D, A; x < l.length; x++) {
    D = l[x];
    let z;
    E(D) || (z = D, D = z.field, a = z.query || a, b = z.limit || b, r = z.offset || r, k = z.suggest || k, g = this.store && (z.enrich || g));
    if (e) {
      p = e[x];
    } else {
      if (v = z || c, y = this.index.get(D), m && (v.enrich = !1), u) {
        u[x] = y.search(a, b, v);
        v && g && (v.enrich = g);
        continue;
      } else {
        p = y.search(a, b, v), v && g && (v.enrich = g);
      }
    }
    A = p && p.length;
    if (m && A) {
      v = [];
      y = 0;
      for (let G = 0, F, K; G < m.length; G += 2) {
        F = this.tag.get(m[G]);
        if (!F) {
          if (console.warn("Tag '" + m[G] + ":" + m[G + 1] + "' will be skipped because there is no field '" + m[G] + "'."), k) {
            continue;
          } else {
            return d;
          }
        }
        if (K = (F = F && F.get(m[G + 1])) && F.length) {
          y++, v.push(F);
        } else if (!k) {
          return d;
        }
      }
      if (y) {
        p = oa(p, v);
        A = p.length;
        if (!A && !k) {
          return d;
        }
        y--;
      }
    }
    if (A) {
      f[t] = D, d.push(p), t++;
    } else if (1 === l.length) {
      return d;
    }
  }
  if (u) {
    const x = this;
    return Promise.all(u).then(function(p) {
      return p.length ? x.search(a, b, c, p) : p;
    });
  }
  if (!t) {
    return d;
  }
  if (n && (!g || !this.store)) {
    return d[0];
  }
  u = [];
  for (let x = 0, p; x < f.length; x++) {
    p = d[x];
    g && p.length && !p[0].doc && p.length && (p = qa.call(this, p));
    if (n) {
      return p;
    }
    d[x] = {field:f[x], result:p};
  }
  return h ? ra(d, b) : q ? sa(d, a, this.index, this.field, this.C, q) : d;
};
function sa(a, b, c, e, d, f) {
  let g, h, k;
  for (let m = 0, r, t, q, n, u; m < a.length; m++) {
    r = a[m].result;
    t = a[m].field;
    n = c.get(t);
    q = n.encoder;
    k = n.tokenize;
    u = d[e.indexOf(t)];
    q !== g && (g = q, h = g.encode(b));
    for (let v = 0; v < r.length; v++) {
      let y = "";
      var l = I(r[v].doc, u);
      let x = g.encode(l);
      l = l.split(g.split);
      for (let p = 0, D, A; p < x.length; p++) {
        D = x[p];
        A = l[p];
        let z;
        for (let G = 0, F; G < h.length; G++) {
          if (F = h[G], "strict" === k) {
            if (D === F) {
              y += (y ? " " : "") + f.replace("$1", A);
              z = !0;
              break;
            }
          } else {
            const K = D.indexOf(F);
            if (-1 < K) {
              y += (y ? " " : "") + A.substring(0, K) + f.replace("$1", A.substring(K, F.length)) + A.substring(K + F.length);
              z = !0;
              break;
            }
          }
        }
        z || (y += (y ? " " : "") + l[p]);
      }
      r[v].highlight = y;
    }
  }
  return a;
}
function ra(a, b) {
  const c = [], e = C();
  for (let d = 0, f, g; d < a.length; d++) {
    f = a[d];
    g = f.result;
    for (let h = 0, k, l, m; h < g.length; h++) {
      if (l = g[h], k = l.id, m = e[k]) {
        m.push(f.field);
      } else {
        if (c.length === b) {
          return c;
        }
        l.field = e[k] = [f.field];
        c.push(l);
      }
    }
  }
  return c;
}
function pa(a, b, c, e, d) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(b)) && f.length - e) && 0 < a) {
    if (a > c || e) {
      f = f.slice(e, e + c);
    }
    d && (f = qa.call(this, f));
    return f;
  }
}
function qa(a) {
  const b = Array(a.length);
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b[c] = {id:e, doc:this.store.get(e)};
  }
  return b;
}
;function R(a) {
  if (!this || this.constructor !== R) {
    return new R(a);
  }
  const b = a.document || a.doc || a;
  var c;
  this.C = [];
  this.field = [];
  this.I = [];
  this.key = (c = b.key || b.id) && T(c, this.I) || "id";
  this.reg = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.A = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && new Map();
  this.cache = (c = a.cache || null) && new U(c);
  a.cache = !1;
  c = new Map();
  let e = b.index || b.field || b;
  E(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d], E(f) || (g = f, f = f.field), g = H(g) ? Object.assign({}, a, g) : a, c.set(f, new V(g, this.reg)), g.custom ? this.C[d] = g.custom : (this.C[d] = T(f, this.I), g.filter && ("string" === typeof this.C[d] && (this.C[d] = new String(this.C[d])), this.C[d].H = g.filter)), this.field[d] = f;
  }
  if (this.A) {
    a = b.store;
    E(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.custom ? (this.A[d] = f.custom, f.custom.S = g) : (this.A[d] = T(g, this.I), f.filter && ("string" === typeof this.A[d] && (this.A[d] = new String(this.A[d])), this.A[d].H = f.filter));
    }
  }
  this.index = c;
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.B = [];
      this.R = [];
      for (let d = 0, f, g; d < c.length; d++) {
        f = c[d];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.B[d] = f.custom : (this.B[d] = T(g, this.I), f.filter && ("string" === typeof this.B[d] && (this.B[d] = new String(this.B[d])), this.B[d].H = f.filter));
        this.R[d] = g;
        this.tag.set(g, new Map());
      }
    }
  }
}
function T(a, b) {
  const c = a.split(":");
  let e = 0;
  for (let d = 0; d < c.length; d++) {
    a = c[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (b[e] = !0), a && (c[e++] = a);
  }
  e < c.length && (c.length = e);
  return 1 < e ? c : c[0];
}
w = R.prototype;
w.append = function(a, b) {
  return this.add(a, b, !0);
};
w.update = function(a, b) {
  return this.remove(a).add(a, b);
};
w.remove = function(a) {
  H(a) && (a = I(a, this.key));
  for (var b of this.index.values()) {
    b.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (let c of this.tag.values()) {
        for (let e of c) {
          b = e[0];
          const d = e[1], f = d.indexOf(a);
          -1 < f && (1 < d.length ? d.splice(f, 1) : c.delete(b));
        }
      }
    }
    this.store && this.store.delete(a);
    this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
w.clear = function() {
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
w.contain = function(a) {
  return this.reg.has(a);
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
w.set = function(a, b) {
  this.store.set(a, b);
  return this;
};
w.searchCache = ta;
w.export = function(a, b, c = 0, e = 0) {
  if (c < this.field.length) {
    const g = this.field[c];
    if ((b = this.index.get(g).export(a, g, c, e = 1)) && b.then) {
      const h = this;
      return b.then(function() {
        return h.export(a, g, c + 1);
      });
    }
    return this.export(a, g, c + 1);
  }
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = la(this.reg);
      b = null;
      break;
    case 1:
      d = "tag";
      f = ja(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      d = "doc";
      f = O(this.store);
      b = null;
      break;
    case 3:
      d = "cfg";
      f = {};
      b = null;
      break;
    default:
      return;
  }
  return Q.call(this, a, b, d, f, c, e);
};
w.import = function(a, b) {
  if (b) {
    E(b) && (b = JSON.parse(b));
    a = a.split(".");
    "json" === a[a.length - 1] && a.pop();
    var c = 2 < a.length ? a[0] : "";
    a = 2 < a.length ? a[2] : a[1];
    if (c) {
      return this.index.get(c).import(a, b);
    }
    switch(a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = ma(b, this.reg);
        for (let e = 0, d; e < this.field.length; e++) {
          d = this.index.get(this.field[e]), d.fastupdate = !1, d.reg = this.reg;
        }
        break;
      case "tag":
        this.tag = ka(b, this.tag);
        break;
      case "doc":
        this.store = P(b, this.store);
    }
  }
};
ia(R.prototype);
function ta(a, b, c) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  let e = this.cache.get(a);
  if (!e) {
    e = this.search(a, b, c);
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
function U(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
U.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
U.prototype.get = function(a) {
  const b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
U.prototype.remove = function(a) {
  for (const b of this.cache) {
    const c = b[0];
    b[1].includes(a) && this.cache.delete(c);
  }
};
U.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const ua = {normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1};
const va = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const wa = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["pf", "f"]]), xa = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /([^0-9])\1+/g, "$1"];
const ya = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const za = /[\x00-\x7F]+/g;
const Aa = /[\x00-\x7F]+/g;
const Ba = /[\x00-\x7F]+/g;
var Ca = {LatinExact:{normalize:!1, dedupe:!1}, LatinDefault:ua, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:va}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:va, matcher:wa, replacer:xa}, LatinExtra:{normalize:!0, dedupe:!0, mapper:va, replacer:xa.concat([/(?!^)[aeo]/g, ""]), matcher:wa}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let e = b.charAt(0), d = ya[e];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = ya[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[c] = e;
  }
}}, ArabicDefault:{rtl:!0, normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(za, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(Aa, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(Ba, " ");
}}};
const Da = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
C();
V.prototype.add = function(a, b, c, e) {
  if (b && (a || 0 === a)) {
    if (!e && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (e = b.length) {
      const l = C(), m = C(), r = this.depth, t = this.resolution;
      for (let q = 0; q < e; q++) {
        let n = b[this.rtl ? e - 1 - q : q];
        var d = n.length;
        if (d && (r || !m[n])) {
          var f = this.score ? this.score(b, n, q, null, 0) : W(t, e, q), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (f = 0; f < d; f++) {
                  for (var h = d; h > f; h--) {
                    g = n.substring(f, h);
                    var k = this.score ? this.score(b, n, q, g, f) : W(t, e, q, d, f);
                    X(this, m, g, k, a, c);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < d) {
                for (h = d - 1; 0 < h; h--) {
                  g = n[h] + g, k = this.score ? this.score(b, n, q, g, h) : W(t, e, q, d, h), X(this, m, g, k, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (h = 0; h < d; h++) {
                  g += n[h], X(this, m, g, f, a, c);
                }
                break;
              }
            default:
              if (X(this, m, n, f, a, c), r && 1 < e && q < e - 1) {
                for (d = C(), g = this.P, f = n, h = Math.min(r + 1, e - q), d[f] = 1, k = 1; k < h; k++) {
                  if ((n = b[this.rtl ? e - 1 - q - k : q + k]) && !d[n]) {
                    d[n] = 1;
                    const u = this.score ? this.score(b, f, q, n, k) : W(g + (e / 2 > g ? 0 : 1), e, q, h - 1, k - 1), v = this.bidirectional && n > f;
                    X(this, l, v ? f : n, u, a, c, v ? n : f);
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
function X(a, b, c, e, d, f, g) {
  let h = g ? a.ctx : a.map, k;
  if (!b[c] || g && !(k = b[c])[g]) {
    g ? (b = k || (b[c] = C()), b[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : b[c] = 1, (k = h.get(c)) ? h = k : h.set(c, h = []), h = h[e] || (h[e] = []), f && h.includes(d) || (h.push(d), a.fastupdate && ((b = a.reg.get(d)) ? b.push(h) : a.reg.set(d, [h])));
  }
}
function W(a, b, c, e, d) {
  return c && 1 < a ? b + (e || 0) <= a ? c + (d || 0) : (a - 1) / (b + (e || 0)) * (c + (d || 0)) + 1 | 0 : 0;
}
;function Ea(a, b, c) {
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a;
  }
  let e = [];
  for (let d = 0, f, g; d < a.length; d++) {
    if ((f = a[d]) && (g = f.length)) {
      if (c) {
        if (c >= g) {
          c -= g;
          continue;
        }
        c < g && (f = b ? f.slice(c, c + b) : f.slice(c), g = f.length, c = 0);
      }
      if (e.length) {
        g > b && (f = f.slice(0, b), g = f.length), e.push(f);
      } else {
        if (g >= b) {
          return g > b && (f = f.slice(0, b)), f;
        }
        e = [f];
      }
      b -= g;
      if (!b) {
        break;
      }
    }
  }
  return e.length ? e = 1 < e.length ? [].concat.apply([], e) : e[0] : e;
}
;V.prototype.search = function(a, b, c) {
  c || (!b && H(a) ? (c = a, a = "") : H(b) && (c = b, b = 0));
  var e = [], d = 0;
  if (c) {
    a = c.query || a;
    b = c.limit || b;
    d = c.offset || 0;
    var f = c.context;
    var g = c.suggest;
    var h = !0;
    var k = c.resolution;
  } else {
    h = !0;
  }
  var l = this.encoder.encode(a);
  c = l.length;
  b || !h || (b = 100);
  if (1 === c) {
    return Y.call(this, l[0], "", b, d);
  }
  f = this.depth && !1 !== f;
  if (2 === c && f && !g) {
    return Y.call(this, l[0], l[1], b, d);
  }
  let m = h = 0;
  if (1 < c) {
    const t = C(), q = [];
    for (let n = 0, u; n < c; n++) {
      if ((u = l[n]) && !t[u]) {
        if (g || Z(this, u)) {
          q.push(u), t[u] = 1;
        } else {
          return e;
        }
        const v = u.length;
        h = Math.max(h, v);
        m = m ? Math.min(m, v) : v;
      }
    }
    l = q;
    c = a.length;
  }
  if (!c) {
    return e;
  }
  a = 0;
  if (1 === c) {
    return Y.call(this, l[0], "", b, d);
  }
  if (2 === c && f && !g) {
    return Y.call(this, l[0], l[1], b, d);
  }
  if (1 < c) {
    if (f) {
      var r = l[0];
      a = 1;
    } else {
      9 < h && 3 < h / m && l.sort(aa);
    }
  }
  k || 0 === k || (k = this.resolution);
  for (let t, q; a < c; a++) {
    q = l[a];
    r ? (t = Z(this, q, r), t = Fa(t, e, g, this.P), g && !1 === t && e.length || (r = q)) : (t = Z(this, q, ""), t = Fa(t, e, g, k));
    if (t) {
      return t;
    }
    if (g && a === c - 1) {
      f = e.length;
      if (!f) {
        if (r) {
          r = "";
          a = -1;
          continue;
        }
        return e;
      }
      if (1 === f) {
        return Ea(e[0], b, d);
      }
    }
  }
  a: {
    r = g;
    c = e.length;
    g = [];
    f = C();
    for (let t = 0, q, n, u, v; t < k; t++) {
      for (a = 0; a < c; a++) {
        if (u = e[a], t < u.length && (q = u[t])) {
          for (h = 0; h < q.length; h++) {
            n = q[h], (l = f[n]) ? f[n]++ : (l = 0, f[n] = 1), v = g[l] || (g[l] = []), v.push(n);
          }
        }
      }
    }
    if (k = g.length) {
      if (r) {
        if (1 < g.length) {
          b: {
            for (k = [], e = C(), r = g.length, l = r - 1; 0 <= l; l--) {
              for (r = g[l], f = r.length, a = 0; a < f; a++) {
                if (c = r[a], !e[c]) {
                  if (e[c] = 1, d) {
                    d--;
                  } else {
                    if (k.push(c), k.length === b) {
                      break b;
                    }
                  }
                }
              }
            }
          }
        } else {
          k = (g = g[0]).length > b || d ? g.slice(d, b + d) : g;
        }
        g = k;
      } else {
        if (k < c) {
          e = [];
          break a;
        }
        g = g[k - 1];
        if (b || d) {
          if (g.length > b || d) {
            g = g.slice(d, b + d);
          }
        }
      }
    }
    e = g;
  }
  return e;
};
function Y(a, b, c, e) {
  return (a = Z(this, a, b)) && a.length ? Ea(a, c, e) : [];
}
function Fa(a, b, c, e) {
  let d = [];
  if (a) {
    e = Math.min(a.length, e);
    for (let f = 0, g; f < e; f++) {
      (g = a[f]) && g && (d[f] = g);
    }
    if (d.length) {
      b.push(d);
      return;
    }
  }
  return !c && d;
}
function Z(a, b, c) {
  let e;
  c && (e = a.bidirectional && b > c);
  a = c ? (a = a.ctx.get(e ? b : c)) && a.get(e ? c : b) : a.map.get(b);
  return a;
}
;V.prototype.remove = function(a, b) {
  const c = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (c) {
    if (this.fastupdate) {
      for (let e = 0, d; e < c.length; e++) {
        if (d = c[e]) {
          if (2 > d.length) {
            d.pop();
          } else {
            const f = d.indexOf(a);
            f === c.length - 1 ? d.pop() : d.splice(f, 1);
          }
        }
      }
    } else {
      Ga(this.map, a), this.depth && Ga(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function Ga(a, b) {
  let c = 0;
  if (a.constructor === Array) {
    for (let e = 0, d, f; e < a.length; e++) {
      if ((d = a[e]) && d.length) {
        if (f = d.indexOf(b), 0 <= f) {
          1 < d.length ? (d.splice(f, 1), c++) : delete a[e];
          break;
        } else {
          c++;
        }
      }
    }
  } else {
    for (let e of a) {
      const d = e[0], f = Ga(e[1], b);
      f ? c += f : a.delete(d);
    }
  }
  return c;
}
;function V(a, b) {
  if (!this || this.constructor !== V) {
    return new V(a);
  }
  if (a) {
    var c = E(a) ? a : a.preset;
    c && (Da[c] || console.warn("Preset not found: " + c), a = Object.assign({}, Da[c], a));
  } else {
    a = {};
  }
  c = a.context;
  const e = !0 === c ? {depth:1} : c || {}, d = E(a.encoder) ? Ca[a.encoder] : a.encode || a.encoder || ua;
  this.encoder = d.encode ? d : "object" === typeof d ? new L(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = c = a.tokenize || "strict";
  this.depth = "strict" === c && e.depth || 0;
  this.bidirectional = !1 !== e.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  c = !1;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = b || (this.fastupdate ? new Map() : new Set());
  this.P = e.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new U(c);
}
w = V.prototype;
w.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  return this;
};
w.append = function(a, b) {
  return this.add(a, b, !0);
};
w.contain = function(a) {
  return this.reg.has(a);
};
w.update = function(a, b) {
  const c = this, e = this.remove(a);
  return e && e.then ? e.then(() => c.add(a, b)) : this.add(a, b);
};
function Ha(a) {
  let b = 0;
  if (a.constructor === Array) {
    for (let c = 0, e; c < a.length; c++) {
      (e = a[c]) && (b += e.length);
    }
  } else {
    for (const c of a) {
      const e = c[0], d = Ha(c[1]);
      d ? b += d : a.delete(e);
    }
  }
  return b;
}
w.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Ha(this.map);
  this.depth && Ha(this.ctx);
  return this;
};
w.searchCache = ta;
w.export = function(a, b, c, e = 0) {
  let d, f;
  switch(e) {
    case 0:
      d = "reg";
      f = la(this.reg);
      break;
    case 1:
      d = "cfg";
      f = {};
      break;
    case 2:
      d = "map";
      f = O(this.map, this.reg.size);
      break;
    case 3:
      d = "ctx";
      f = ja(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return Q.call(this, a, b, d, f, c, e);
};
w.import = function(a, b) {
  if (b) {
    switch(E(b) && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = ma(b, this.reg);
        break;
      case "map":
        this.map = P(b, this.map);
        break;
      case "ctx":
        this.ctx = ka(b, this.ctx);
    }
  }
};
w.serialize = function(a = !0) {
  if (!this.reg.size) {
    return "";
  }
  let b = "", c = "";
  for (var e of this.reg.keys()) {
    c || (c = typeof e), b += (b ? "," : "") + ("string" === c ? '"' + e + '"' : e);
  }
  b = "index.reg=new Set([" + b + "]);";
  e = "";
  for (var d of this.map.entries()) {
    var f = d[0], g = d[1], h = "";
    for (let m = 0, r; m < g.length; m++) {
      r = g[m] || [""];
      var k = "";
      for (var l = 0; l < r.length; l++) {
        k += (k ? "," : "") + ("string" === c ? '"' + r[l] + '"' : r[l]);
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
    for (const r of g.entries()) {
      g = r[0];
      h = r[1];
      k = "";
      for (let t = 0, q; t < h.length; t++) {
        q = h[t] || [""];
        l = "";
        for (let n = 0; n < q.length; n++) {
          l += (l ? "," : "") + ("string" === c ? '"' + q[n] + '"' : q[n]);
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
  return a ? "function inject(index){" + b + e + d + "}" : b + e + d;
};
ia(V.prototype);
export default {Index:V, Charset:Ca, Encoder:L, Document:R, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=V;export const  Charset=Ca;export const  Encoder=L;export const  Document=R;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};