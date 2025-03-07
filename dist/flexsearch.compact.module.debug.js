/**!
 * FlexSearch.js v0.8.0 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var u;
function x(a, b, c) {
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
function y() {
  return Object.create(null);
}
function aa(a, b) {
  return b.length - a.length;
}
function z(a) {
  return "string" === typeof a;
}
function B(a) {
  return "object" === typeof a;
}
function ba(a, b) {
  if (z(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
;const ca = /[^\p{L}\p{N}]+/u, da = /(\d{3})/g, ea = /(\D)(\d{3})/g, fa = /(\d{3})(\D)/g, F = "".normalize && /[\u0300-\u036f]/g, ha = !F && new Map([["\u00aa", "a"], ["\u00b2", "2"], ["\u00b3", "3"], ["\u00b9", "1"], ["\u00ba", "o"], ["\u00bc", "1\u20444"], ["\u00bd", "1\u20442"], ["\u00be", "3\u20444"], ["\u00e0", "a"], ["\u00e1", "a"], ["\u00e2", "a"], ["\u00e3", "a"], ["\u00e4", "a"], ["\u00e5", "a"], ["\u00e7", "c"], ["\u00e8", "e"], ["\u00e9", "e"], ["\u00ea", "e"], ["\u00eb", "e"], ["\u00ec", 
"i"], ["\u00ed", "i"], ["\u00ee", "i"], ["\u00ef", "i"], ["\u00f1", "n"], ["\u00f2", "o"], ["\u00f3", "o"], ["\u00f4", "o"], ["\u00f5", "o"], ["\u00f6", "o"], ["\u00f9", "u"], ["\u00fa", "u"], ["\u00fb", "u"], ["\u00fc", "u"], ["\u00fd", "y"], ["\u00ff", "y"], ["\u0101", "a"], ["\u0103", "a"], ["\u0105", "a"], ["\u0107", "c"], ["\u0109", "c"], ["\u010b", "c"], ["\u010d", "c"], ["\u010f", "d"], ["\u0113", "e"], ["\u0115", "e"], ["\u0117", "e"], ["\u0119", "e"], ["\u011b", "e"], ["\u011d", "g"], ["\u011f", 
"g"], ["\u0121", "g"], ["\u0123", "g"], ["\u0125", "h"], ["\u0129", "i"], ["\u012b", "i"], ["\u012d", "i"], ["\u012f", "i"], ["\u0133", "ij"], ["\u0135", "j"], ["\u0137", "k"], ["\u013a", "l"], ["\u013c", "l"], ["\u013e", "l"], ["\u0140", "l"], ["\u0144", "n"], ["\u0146", "n"], ["\u0148", "n"], ["\u0149", "n"], ["\u014d", "o"], ["\u014f", "o"], ["\u0151", "o"], ["\u0155", "r"], ["\u0157", "r"], ["\u0159", "r"], ["\u015b", "s"], ["\u015d", "s"], ["\u015f", "s"], ["\u0161", "s"], ["\u0163", "t"], ["\u0165", 
"t"], ["\u0169", "u"], ["\u016b", "u"], ["\u016d", "u"], ["\u016f", "u"], ["\u0171", "u"], ["\u0173", "u"], ["\u0175", "w"], ["\u0177", "y"], ["\u017a", "z"], ["\u017c", "z"], ["\u017e", "z"], ["\u017f", "s"], ["\u01a1", "o"], ["\u01b0", "u"], ["\u01c6", "dz"], ["\u01c9", "lj"], ["\u01cc", "nj"], ["\u01ce", "a"], ["\u01d0", "i"], ["\u01d2", "o"], ["\u01d4", "u"], ["\u01d6", "u"], ["\u01d8", "u"], ["\u01da", "u"], ["\u01dc", "u"], ["\u01df", "a"], ["\u01e1", "a"], ["\u01e3", "ae"], ["\u00e6", "ae"], 
["\u01fd", "ae"], ["\u01e7", "g"], ["\u01e9", "k"], ["\u01eb", "o"], ["\u01ed", "o"], ["\u01ef", "\u0292"], ["\u01f0", "j"], ["\u01f3", "dz"], ["\u01f5", "g"], ["\u01f9", "n"], ["\u01fb", "a"], ["\u01ff", "\u00f8"], ["\u0201", "a"], ["\u0203", "a"], ["\u0205", "e"], ["\u0207", "e"], ["\u0209", "i"], ["\u020b", "i"], ["\u020d", "o"], ["\u020f", "o"], ["\u0211", "r"], ["\u0213", "r"], ["\u0215", "u"], ["\u0217", "u"], ["\u0219", "s"], ["\u021b", "t"], ["\u021f", "h"], ["\u0227", "a"], ["\u0229", "e"], 
["\u022b", "o"], ["\u022d", "o"], ["\u022f", "o"], ["\u0231", "o"], ["\u0233", "y"], ["\u02b0", "h"], ["\u02b1", "h"], ["\u0266", "h"], ["\u02b2", "j"], ["\u02b3", "r"], ["\u02b4", "\u0279"], ["\u02b5", "\u027b"], ["\u02b6", "\u0281"], ["\u02b7", "w"], ["\u02b8", "y"], ["\u02e0", "\u0263"], ["\u02e1", "l"], ["\u02e2", "s"], ["\u02e3", "x"], ["\u02e4", "\u0295"], ["\u0390", "\u03b9"], ["\u03ac", "\u03b1"], ["\u03ad", "\u03b5"], ["\u03ae", "\u03b7"], ["\u03af", "\u03b9"], ["\u03b0", "\u03c5"], ["\u03ca", 
"\u03b9"], ["\u03cb", "\u03c5"], ["\u03cc", "\u03bf"], ["\u03cd", "\u03c5"], ["\u03ce", "\u03c9"], ["\u03d0", "\u03b2"], ["\u03d1", "\u03b8"], ["\u03d2", "\u03a5"], ["\u03d3", "\u03a5"], ["\u03d4", "\u03a5"], ["\u03d5", "\u03c6"], ["\u03d6", "\u03c0"], ["\u03f0", "\u03ba"], ["\u03f1", "\u03c1"], ["\u03f2", "\u03c2"], ["\u03f5", "\u03b5"], ["\u0439", "\u0438"], ["\u0450", "\u0435"], ["\u0451", "\u0435"], ["\u0453", "\u0433"], ["\u0457", "\u0456"], ["\u045c", "\u043a"], ["\u045d", "\u0438"], ["\u045e", 
"\u0443"], ["\u0477", "\u0475"], ["\u04c2", "\u0436"], ["\u04d1", "\u0430"], ["\u04d3", "\u0430"], ["\u04d7", "\u0435"], ["\u04db", "\u04d9"], ["\u04dd", "\u0436"], ["\u04df", "\u0437"], ["\u04e3", "\u0438"], ["\u04e5", "\u0438"], ["\u04e7", "\u043e"], ["\u04eb", "\u04e9"], ["\u04ed", "\u044d"], ["\u04ef", "\u0443"], ["\u04f1", "\u0443"], ["\u04f3", "\u0443"], ["\u04f5", "\u0447"]]);
function G(a = {}) {
  if (!(this instanceof G)) {
    return new G(...arguments);
  }
  for (a = 0; a < arguments.length; a++) {
    this.assign(arguments[a]);
  }
}
G.prototype.assign = function(a) {
  this.normalize = x(a.normalize, !0, this.normalize);
  let b = a.U, c = b || a.Z || a.split;
  if ("object" === typeof c) {
    let e = !b, d = "";
    a.U || (d += "\\p{Z}");
    c.Y && (d += "\\p{L}");
    c.$ && (d += "\\p{N}", e = !!b);
    c.ba && (d += "\\p{S}");
    c.aa && (d += "\\p{P}");
    c.control && (d += "\\p{C}");
    if (c = c.char) {
      d += "object" === typeof c ? c.join("") : c;
    }
    this.split = new RegExp("[" + (b ? "^" : "") + d + "]+", "u");
    this.numeric = e;
  } else {
    this.split = x(c, ca, this.split), this.numeric = x(this.numeric, !0);
  }
  this.R = x(a.R, null, this.R);
  this.M = x(a.M, null, this.M);
  this.rtl = a.rtl || !1;
  this.C = x(a.C, !0, this.C);
  this.filter = x((c = a.filter) && new Set(c), null, this.filter);
  this.H = x((c = a.H) && new Map(c), null, this.H);
  this.D = x((c = a.D) && new Map(c), null, this.D);
  this.K = x((c = a.K) && new Map(c), null, this.K);
  this.I = x(a.I, null, this.I);
  this.P = x(a.P, 1, this.P);
  this.V = x(a.V, 0, this.V);
  this.A = "";
  this.F = null;
  this.B = "";
  this.S = null;
  if (this.H) {
    for (const e of this.H.keys()) {
      this.A += (this.A ? "|" : "") + e;
    }
  }
  if (this.K) {
    for (const e of this.K.keys()) {
      this.B += (this.B ? "|" : "") + e;
    }
  }
  return this;
};
G.prototype.encode = function(a) {
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : F ? a = a.normalize("NFKD").replace(F, "").toLowerCase() : (a = a.toLowerCase(), this.D = this.D ? new Map([...ha, ...this.D]) : new Map(ha)));
  this.R && (a = this.R(a));
  this.numeric && 3 < a.length && (a = a.replace(ea, "$1 $2").replace(fa, "$1 $2").replace(da, "$1 "));
  const b = !(this.C || this.D || this.filter || this.H || this.K || this.I);
  let c = [];
  a = this.split || "" === this.split ? a.split(this.split) : a;
  for (let d = 0, f; d < a.length; d++) {
    if (!(f = a[d])) {
      continue;
    }
    if (f.length < this.P) {
      continue;
    }
    if (b) {
      c.push(f);
      continue;
    }
    if (this.filter && this.filter.has(f)) {
      continue;
    }
    let g;
    this.K && 2 < f.length && (this.S || (this.S = new RegExp("(?!^)(" + this.B + ")$")), f = f.replace(this.S, h => this.K.get(h)), g = 1);
    this.H && 1 < f.length && (this.F || (this.F = new RegExp("(" + this.A + ")", "g")), f = f.replace(this.F, h => this.H.get(h)), g = 1);
    f && g && (f.length < this.P || this.filter && this.filter.has(f)) && (f = "");
    if (f && (this.D || this.C && 1 < f.length)) {
      var e = "";
      for (let h = 0, k = "", n, l; h < f.length; h++) {
        n = f.charAt(h), n === k && this.C || ((l = this.D && this.D.get(n)) || "" === l ? l === k && this.C || !(k = l) || (e += l) : e += k = n);
      }
      f = e;
    }
    if (f && this.I) {
      for (e = 0; f && e < this.I.length; e += 2) {
        f = f.replace(this.I[e], this.I[e + 1]);
      }
    }
    f && c.push(f);
  }
  this.M && (c = this.M(c) || c);
  return c;
};
function H(a = 8) {
  if (!(this instanceof H)) {
    return new H(a);
  }
  this.index = y();
  this.F = [];
  this.size = 0;
  32 < a ? (this.A = ia, this.B = BigInt(a)) : (this.A = ja, this.B = a);
}
H.prototype.get = function(a) {
  const b = this.index[this.A(a)];
  return b && b.get(a);
};
H.prototype.set = function(a, b) {
  var c = this.A(a);
  let e = this.index[c];
  e ? (c = e.size, e.set(a, b), (c -= e.size) && this.size++) : (this.index[c] = e = new Map([[a, b]]), this.F.push(e));
};
function I(a = 8) {
  if (!(this instanceof I)) {
    return new I(a);
  }
  this.index = y();
  this.A = [];
  32 < a ? (this.F = ia, this.B = BigInt(a)) : (this.F = ja, this.B = a);
}
I.prototype.add = function(a) {
  var b = this.F(a);
  let c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.A.push(c));
};
u = H.prototype;
u.has = I.prototype.has = function(a) {
  const b = this.index[this.F(a)];
  return b && b.has(a);
};
u.delete = I.prototype.delete = function(a) {
  const b = this.index[this.F(a)];
  b && b.delete(a) && this.size--;
};
u.clear = I.prototype.clear = function() {
  this.index = y();
  this.A = [];
  this.size = 0;
};
u.values = I.prototype.values = function*() {
  for (let a = 0; a < this.A.length; a++) {
    for (let b of this.A[a].values()) {
      yield b;
    }
  }
};
u.keys = I.prototype.keys = function*() {
  for (let a = 0; a < this.A.length; a++) {
    for (let b of this.A[a].keys()) {
      yield b;
    }
  }
};
u.entries = I.prototype.entries = function*() {
  for (let a = 0; a < this.A.length; a++) {
    for (let b of this.A[a].entries()) {
      yield b;
    }
  }
};
function ja(a) {
  let b = 2 ** this.B - 1;
  if ("number" == typeof a) {
    return a & b;
  }
  let c = 0, e = this.B + 1;
  for (let d = 0; d < a.length; d++) {
    c = (c * e ^ a.charCodeAt(d)) & b;
  }
  return 32 === this.B ? c + 2 ** 31 : c;
}
function ia(a) {
  let b = BigInt(2) ** this.B - BigInt(1);
  var c = typeof a;
  if ("bigint" === c) {
    return a & b;
  }
  if ("number" === c) {
    return BigInt(a) & b;
  }
  c = BigInt(0);
  let e = this.B + BigInt(1);
  for (let d = 0; d < a.length; d++) {
    c = (c * e ^ BigInt(a.charCodeAt(d))) & b;
  }
  return c;
}
;function ka(a, b, c, e, d, f, g, h) {
  (e = a(c ? c + "." + e : e, JSON.stringify(g))) && e.then ? e.then(function() {
    b.export(a, b, c, d, f + 1, h);
  }) : b.export(a, b, c, d, f + 1, h);
}
;const la = y(), J = y();
var ma = {normalize:function(a) {
  return a.toLowerCase();
}, C:!1};
const na = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
function oa(a) {
  M.call(a, "add");
  M.call(a, "append");
  M.call(a, "search");
  M.call(a, "update");
  M.call(a, "remove");
}
function M(a) {
  this[a + "Async"] = function() {
    var b = arguments;
    const c = b[b.length - 1];
    let e;
    "function" === typeof c && (e = c, delete b[b.length - 1]);
    this.async = !0;
    b = this[a].apply(this, b);
    this.async = !1;
    b.then ? b.then(e) : e(b);
    return b;
  };
}
;y();
N.prototype.add = function(a, b, c, e) {
  if (b && (a || 0 === a)) {
    if (!e && !c && this.h.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (e = b.length) {
      const n = y(), l = y(), r = this.depth, t = this.resolution;
      for (let p = 0; p < e; p++) {
        let m = b[this.rtl ? e - 1 - p : p];
        var d = m.length;
        if (d && (r || !l[m])) {
          var f = this.score ? this.score(b, m, p, null, 0) : O(t, e, p), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (f = 0; f < d; f++) {
                  for (var h = d; h > f; h--) {
                    g = m.substring(f, h);
                    var k = this.score ? this.score(b, m, p, g, f) : O(t, e, p, d, f);
                    P(this, l, g, k, a, c);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < d) {
                for (h = d - 1; 0 < h; h--) {
                  g = m[h] + g, k = this.score ? this.score(b, m, p, g, h) : O(t, e, p, d, h), P(this, l, g, k, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < d) {
                for (h = 0; h < d; h++) {
                  g += m[h], P(this, l, g, f, a, c);
                }
                break;
              }
            default:
              if (P(this, l, m, f, a, c), r && 1 < e && p < e - 1) {
                for (d = y(), g = this.W, f = m, h = Math.min(r + 1, e - p), d[f] = 1, k = 1; k < h; k++) {
                  if ((m = b[this.rtl ? e - 1 - p - k : p + k]) && !d[m]) {
                    d[m] = 1;
                    const v = this.score ? this.score(b, f, p, m, k) : O(g + (e / 2 > g ? 0 : 1), e, p, h - 1, k - 1), C = this.bidirectional && m > f;
                    P(this, n, C ? f : m, v, a, c, C ? m : f);
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
function P(a, b, c, e, d, f, g) {
  let h = g ? a.J : a.map, k;
  b[c] && g && (k = b[c])[g] || (g ? (b = k || (b[c] = y()), b[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : b[c] = 1, (k = h.get(c)) ? h = k : h.set(c, h = []), h = h[e] || (h[e] = []), f && h.includes(d) || (h.push(d), a.fastupdate && ((b = a.h.get(d)) ? b.push(h) : a.h.set(d, [h]))));
}
function O(a, b, c, e, d) {
  return c && 1 < a ? b + (e || 0) <= a ? c + (d || 0) : (a - 1) / (b + (e || 0)) * (c + (d || 0)) + 1 | 0 : 0;
}
;function Q(a, b, c) {
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
;function pa(a, b, c, e) {
  var d = a.length;
  let f = [], g = 0, h, k, n;
  e && (e = []);
  for (let l = d - 1, r; 0 <= l; l--) {
    n = a[l];
    d = y();
    r = !h;
    for (let t = 0, p; t < n.length; t++) {
      if ((p = n[t]) && p.length) {
        for (let m = 0, v; m < p.length; m++) {
          if (v = p[m], h) {
            if (h[v]) {
              if (!l) {
                if (c) {
                  c--;
                } else {
                  if (f[g++] = v, g === b) {
                    return f;
                  }
                }
              }
              if (l || e) {
                d[v] = 1;
              }
              r = !0;
            }
            e && !k[v] && (k[v] = 1, (e[t] || (e[t] = [])).push(v));
          } else {
            d[v] = 1;
          }
        }
      }
    }
    if (e) {
      h || (k = d);
    } else if (!r) {
      return [];
    }
    h = d;
  }
  if (e) {
    for (let l = e.length - 1, r, t; 0 <= l; l--) {
      r = e[l];
      t = r.length;
      for (let p = 0, m; p < t; p++) {
        if (m = r[p], !h[m]) {
          if (c) {
            c--;
          } else {
            if (f[g++] = m, g === b) {
              return f;
            }
          }
          h[m] = 1;
        }
      }
    }
  }
  return f;
}
function qa(a, b) {
  const c = y(), e = y(), d = [];
  for (let f = 0; f < a.length; f++) {
    c[a[f]] = 1;
  }
  for (let f = 0, g; f < b.length; f++) {
    g = b[f];
    for (let h = 0, k; h < g.length; h++) {
      k = g[h], c[k] && !e[k] && (e[k] = 1, d.push(k));
    }
  }
  return d;
}
;N.prototype.search = function(a, b, c) {
  c || (!b && B(a) ? (c = a, a = "") : B(b) && (c = b, b = 0));
  let e = [];
  let d, f = 0;
  if (c) {
    a = c.query || a;
    b = c.limit || b;
    f = c.offset || 0;
    var g = c.context;
    d = c.suggest;
  }
  a = this.encoder.encode(a);
  c = a.length;
  b || (b = 100);
  if (1 === c) {
    return R.call(this, a[0], "", b, f);
  }
  g = this.depth && !1 !== g;
  if (2 === c && g && !d) {
    return R.call(this, a[0], a[1], b, f);
  }
  let h = 0, k = 0;
  if (1 < c) {
    var n = y();
    const r = [];
    for (let t = 0, p; t < c; t++) {
      if ((p = a[t]) && !n[p]) {
        if (d || S(this, p)) {
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
    c = a.length;
  }
  if (!c) {
    return e;
  }
  n = 0;
  let l;
  if (1 === c) {
    return R.call(this, a[0], "", b, f);
  }
  if (2 === c && g && !d) {
    return R.call(this, a[0], a[1], b, f);
  }
  1 < c && (g ? (l = a[0], n = 1) : 9 < h && 3 < h / k && a.sort(aa));
  for (let r, t; n < c; n++) {
    t = a[n];
    l ? (r = S(this, t, l), r = ra(r, e, d, this.W, b, f, 2 === c), d && !1 === r && e.length || (l = t)) : (r = S(this, t), r = ra(r, e, d, this.resolution, b, f, 1 === c));
    if (r) {
      return r;
    }
    if (d && n === c - 1) {
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
        return Q(e[0], b, f);
      }
    }
  }
  return pa(e, b, f, d);
};
function R(a, b, c, e) {
  return (a = S(this, a, b)) && a.length ? Q(a, c, e) : [];
}
function ra(a, b, c, e, d, f, g) {
  let h = [];
  if (a) {
    e = Math.min(a.length, e);
    for (let k = 0, n = 0, l; k < e; k++) {
      if (l = a[k]) {
        if (f && l && g && (l.length <= f ? (f -= l.length, l = null) : (l = l.slice(f), f = 0)), l && (h[k] = l, g && (n += l.length, n >= d))) {
          break;
        }
      }
    }
    if (h.length) {
      if (g) {
        return Q(h, d, 0);
      }
      b.push(h);
      return;
    }
  }
  return !c && h;
}
function S(a, b, c) {
  let e;
  c && (e = a.bidirectional && b > c);
  a = c ? (a = a.J.get(e ? b : c)) && a.get(e ? c : b) : a.map.get(b);
  return a;
}
;N.prototype.remove = function(a, b) {
  const c = this.h.size && (this.fastupdate ? this.h.get(a) : this.h.has(a));
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
      T(this.map, a), this.depth && T(this.J, a);
    }
    b || this.h.delete(a);
  }
  return this;
};
function T(a, b) {
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
      const d = e[0], f = T(e[1], b);
      f ? c += f : a.delete(d);
    }
  }
  return c;
}
;function N(a, b) {
  if (!(this instanceof N)) {
    return new N(a);
  }
  if (a) {
    var c = z(a) ? a : a.preset;
    c && (na[c] || console.warn("Preset not found: " + c), a = Object.assign({}, na[c], a));
  } else {
    a = {};
  }
  c = a.context || {};
  const e = a.encode || a.encoder || ma;
  this.encoder = e.encode ? e : "object" === typeof e ? new G(e) : {encode:e};
  let d;
  this.resolution = a.resolution || 9;
  this.tokenize = d = a.tokenize || "strict";
  this.depth = "strict" === d && c.depth || 0;
  this.bidirectional = !1 !== c.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  this.map = (d = !1, new Map());
  this.J = d ? new H(d) : new Map();
  this.h = b || (this.fastupdate ? d ? new H(d) : new Map() : d ? new I(d) : new Set());
  this.W = c.resolution || 1;
  this.rtl = e.rtl || a.rtl || !1;
}
u = N.prototype;
u.clear = function() {
  this.map.clear();
  this.J.clear();
  this.h.clear();
  return this;
};
u.append = function(a, b) {
  return this.add(a, b, !0);
};
u.contain = function(a) {
  return this.h.has(a);
};
u.update = function(a, b) {
  if (this.async) {
    const c = this, e = this.remove(a);
    return e.then ? e.then(() => c.add(a, b)) : this.add(a, b);
  }
  return this.remove(a).add(a, b);
};
function U(a) {
  let b = 0;
  if (a.constructor === Array) {
    for (let c = 0, e; c < a.length; c++) {
      (e = a[c]) && (b += e.length);
    }
  } else {
    for (const c of a) {
      const e = c[0], d = U(c[1]);
      d ? b += d : a.delete(e);
    }
  }
  return b;
}
u.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  U(this.map);
  this.depth && U(this.J);
  return this;
};
u.export = function(a, b, c, e, d, f) {
  let g = !0;
  "undefined" === typeof f && (g = new Promise(n => {
    f = n;
  }));
  let h, k;
  switch(d || (d = 0)) {
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
      k = {doc:0, opt:this.A ? 1 : 0};
      break;
    case 2:
      h = "map";
      k = this.map;
      break;
    case 3:
      h = "ctx";
      k = this.J;
      break;
    default:
      "undefined" === typeof c && f && f();
      return;
  }
  ka(a, b || this, c, h, e, d, k, f);
  return g;
};
u.import = function(a, b) {
  if (b) {
    switch(z(b) && (b = JSON.parse(b)), a) {
      case "cfg":
        this.A = !!b.opt;
        break;
      case "reg":
        this.fastupdate = !1;
        this.h = b;
        break;
      case "map":
        this.map = b;
        break;
      case "ctx":
        this.J = b;
    }
  }
};
oa(N.prototype);
V.prototype.add = function(a, b, c) {
  B(a) && (b = a, a = ba(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.h.has(a)) {
      return this.update(a, b);
    }
    for (let d = 0, f; d < this.field.length; d++) {
      f = this.L[d];
      const g = this.index.get(this.field[d]);
      if ("function" === typeof f) {
        var e = f(b);
        e && g.add(a, e, !1, !0);
      } else {
        if (e = f.T, !e || e(b)) {
          f instanceof String ? f = ["" + f] : z(f) && (f = [f]), W(b, f, this.O, 0, g, a, f[0], c);
        }
      }
    }
    if (this.store && (!c || !this.store.has(a))) {
      let d;
      if (this.G) {
        d = y();
        for (let f = 0, g; f < this.G.length; f++) {
          g = this.G[f];
          if ((c = g.T) && !c(b)) {
            continue;
          }
          let h;
          if ("function" === typeof g) {
            h = g(b);
            if (!h) {
              continue;
            }
            g = [g.X];
          } else if (z(g) || g instanceof String) {
            d[g] = b[g];
            continue;
          }
          X(b, d, g, 0, g[0], h);
        }
      }
      this.store.set(a, d || b);
    }
  }
  return this;
};
function X(a, b, c, e, d, f) {
  a = a[d];
  if (e === c.length - 1) {
    b[d] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[d] = Array(a.length), d = 0; d < a.length; d++) {
        X(a, b, c, e, d);
      }
    } else {
      b = b[d] || (b[d] = y()), d = c[++e], X(a, b, c, e, d);
    }
  }
}
function W(a, b, c, e, d, f, g, h) {
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
          W(a, b, c, e, d, f, g, h);
        }
      } else {
        g = b[++e], W(a, b, c, e, d, f, g, h);
      }
    }
  }
}
;V.prototype.search = function(a, b, c, e) {
  c || (!b && B(a) ? (c = a, a = "") : B(b) && (c = b, b = 0));
  let d = [];
  var f = [];
  let g, h, k, n, l;
  let r = 0;
  if (c) {
    if (c.constructor === Array) {
      n = c, c = null;
    } else {
      a = c.query || a;
      var t = c.pluck;
      h = c.merge;
      n = t || c.field || c.index;
      l = !1;
      g = this.store && c.enrich;
      k = c.suggest;
      b = c.limit || b;
      var p = c.offset || 0;
      b || (b = 100);
      if (l) {
        l.constructor !== Array && (l = [l]);
        var m = [];
        for (let w = 0, q; w < l.length; w++) {
          q = l[w];
          if (z(q)) {
            throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
          }
          if (q.field && q.tag) {
            var v = q.tag;
            if (v.constructor === Array) {
              for (var C = 0; C < v.length; C++) {
                m.push(q.field, v[C]);
              }
            } else {
              m.push(q.field, v);
            }
          } else {
            v = Object.keys(q);
            for (let D = 0, E, A; D < v.length; D++) {
              if (E = v[D], A = q[E], A.constructor === Array) {
                for (C = 0; C < A.length; C++) {
                  m.push(E, A[C]);
                }
              } else {
                m.push(E, A);
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
            for (f = 0; f < m.length; f += 2) {
              t = sa.call(this, m[f], m[f + 1], b, p, g), d.push({field:m[f], tag:m[f + 1], result:t});
            }
          }
          return e.length ? Promise.all(e).then(function(w) {
            for (let q = 0; q < w.length; q++) {
              d[q].result = w[q];
            }
            return d;
          }) : d;
        }
      }
      z(n) && (n = [n]);
    }
  }
  n || (n = this.field);
  p = !e && (this.worker || this.async) && [];
  for (let w = 0, q, D, E; w < n.length; w++) {
    D = n[w];
    let A;
    z(D) || (A = D, D = A.field, a = A.query || a, b = A.limit || b, k = A.suggest || k);
    if (e) {
      q = e[w];
    } else {
      if (m = A || c, v = this.index.get(D), l && (m.enrich = !1), p) {
        p[w] = v.searchAsync(a, b, m);
        m && g && (m.enrich = g);
        continue;
      } else {
        q = v.search(a, b, m), m && g && (m.enrich = g);
      }
    }
    E = q && q.length;
    if (l && E) {
      m = [];
      v = 0;
      for (let K = 0, L, xa; K < l.length; K += 2) {
        L = this.tag.get(l[K]);
        if (!L) {
          if (console.warn("Tag '" + l[K] + ":" + l[K + 1] + "' will be skipped because there is no field '" + l[K] + "'."), k) {
            continue;
          } else {
            return d;
          }
        }
        if (xa = (L = L && L.get(l[K + 1])) && L.length) {
          v++, m.push(L);
        } else if (!k) {
          return d;
        }
      }
      if (v) {
        q = qa(q, m);
        E = q.length;
        if (!E && !k) {
          return d;
        }
        v--;
      }
    }
    if (E) {
      f[r] = D, d.push(q), r++;
    } else if (1 === n.length) {
      return d;
    }
  }
  if (p) {
    const w = this;
    return Promise.all(p).then(function(q) {
      return q.length ? w.search(a, b, c, q) : q;
    });
  }
  if (!r) {
    return d;
  }
  if (t && (!g || !this.store)) {
    return d[0];
  }
  p = [];
  for (let w = 0, q; w < f.length; w++) {
    q = d[w];
    g && q.length && !q[0].doc && q.length && (q = ta.call(this, q));
    if (t) {
      return q;
    }
    d[w] = {field:f[w], result:q};
  }
  return h ? ua(d, b) : d;
};
function ua(a, b) {
  const c = [], e = y();
  for (let d = 0, f, g; d < a.length; d++) {
    f = a[d];
    g = f.result;
    for (let h = 0, k, n, l; h < g.length; h++) {
      if (n = g[h], k = n.id, l = e[k]) {
        l.push(f.field);
      } else {
        if (c.length === b) {
          return c;
        }
        n.field = e[k] = [f.field];
        c.push(n);
      }
    }
  }
  return c;
}
function sa(a, b, c, e, d) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(b)) && f.length - e) && 0 < a) {
    if (a > c || e) {
      f = f.slice(e, e + c);
    }
    d && (f = ta.call(this, f));
    return f;
  }
}
function ta(a) {
  const b = Array(a.length);
  for (let c = 0, e; c < a.length; c++) {
    e = a[c], b[c] = {id:e, doc:this.store.get(e)};
  }
  return b;
}
;function V(a) {
  if (!(this instanceof V)) {
    return new V(a);
  }
  const b = a.document || a.doc || a;
  var c;
  this.L = [];
  this.field = [];
  this.O = [];
  this.key = (c = b.key || b.id) && Y(c, this.O) || "id";
  this.h = (this.fastupdate = !!a.fastupdate) ? new Map() : new Set();
  this.G = (c = b.store || null) && !0 !== c && [];
  this.store = c && new Map();
  this.async = !1;
  c = new Map();
  let e = b.index || b.field || b;
  z(e) && (e = [e]);
  for (let d = 0, f, g; d < e.length; d++) {
    f = e[d], z(f) || (g = f, f = f.field), g = B(g) ? Object.assign({}, a, g) : a, c.set(f, new N(g, this.h)), g.N ? this.L[d] = g.N : (this.L[d] = Y(f, this.O), g.filter && ("string" === typeof this.L[d] && (this.L[d] = new String(this.L[d])), this.L[d].T = g.filter)), this.field[d] = f;
  }
  if (this.G) {
    a = b.store;
    z(a) && (a = [a]);
    for (let d = 0, f, g; d < a.length; d++) {
      f = a[d], g = f.field || f, f.N ? (this.G[d] = f.N, f.N.X = g) : (this.G[d] = Y(g, this.O), f.filter && ("string" === typeof this.G[d] && (this.G[d] = new String(this.G[d])), this.G[d].T = f.filter));
    }
  }
  this.index = c;
}
function Y(a, b) {
  const c = a.split(":");
  let e = 0;
  for (let d = 0; d < c.length; d++) {
    a = c[d], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (b[e] = !0), a && (c[e++] = a);
  }
  e < c.length && (c.length = e);
  return 1 < e ? c : c[0];
}
u = V.prototype;
u.append = function(a, b) {
  return this.add(a, b, !0);
};
u.update = function(a, b) {
  return this.remove(a).add(a, b);
};
u.remove = function(a) {
  B(a) && (a = ba(a, this.key));
  for (const b of this.index.values()) {
    b.remove(a, !0);
  }
  this.h.has(a) && (this.store && this.store.delete(a), this.h.delete(a));
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
u.set = function(a, b) {
  this.store.set(a, b);
  return this;
};
u.export = function(a, b, c, e, d, f) {
  let g;
  "undefined" === typeof f && (g = new Promise(k => {
    f = k;
  }));
  d || (d = 0);
  e || (e = 0);
  if (e < this.field.length) {
    c = this.field[e];
    var h = this.index[c];
    b = this;
    h.export(a, b, d ? c : "", e, d++, f) || (e++, b.export(a, b, c, e, 1, f));
  } else {
    switch(d) {
      case 1:
        b = "tag";
        h = this.B;
        c = null;
        break;
      case 2:
        b = "store";
        h = this.store;
        c = null;
        break;
      default:
        f();
        return;
    }
    ka(a, this, c, b, e, d, h, f);
  }
  return g;
};
u.import = function(a, b) {
  if (b) {
    switch(z(b) && (b = JSON.parse(b)), a) {
      case "tag":
        this.B = b;
        break;
      case "reg":
        this.fastupdate = !1;
        this.h = b;
        for (let e = 0, d; e < this.field.length; e++) {
          d = this.index[this.field[e]], d.h = b, d.fastupdate = !1;
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
oa(V.prototype);
const Z = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
var va = {normalize:!0, C:!0, D:Z};
const wa = new Map([["ai", "ei"], ["ae", "a"], ["oe", "o"], ["ue", "u"], ["sh", "s"], ["ch", "c"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), ya = [/([^aeo])h([aeo$])/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2"];
var za = {normalize:!0, C:!0, D:Z, I:ya, H:wa};
var Aa = {normalize:!0, C:!0, D:Z, I:ya.concat([/(?!^)[aeoy]/g, ""]), H:wa};
const Ba = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
J["latin:exact"] = {normalize:!1, C:!1};
J["latin:default"] = ma;
J["latin:simple"] = {normalize:!0, C:!0};
J["latin:balance"] = va;
J["latin:advanced"] = za;
J["latin:extra"] = Aa;
J["latin:soundex"] = {normalize:!0, C:!1, U:{Y:!0}, M:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let e = b.charAt(0), d = Ba[e];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = Ba[g]) || g === d || (e += g, d = g, 4 !== e.length)); f++) {
    }
    a[c] = e;
  }
}};
export default {Index:N, Encoder:G, Charset:J, Language:la, Document:V, Worker:null, Resolver:null, IndexedDB:null};

export const Index=N;export const  Encoder=G;export const  Charset=J;export const  Language=la;export const  Document=V;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;