/**!
 * FlexSearch.js v0.8.0 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
function t() {
  return Object.create(null);
}
function u(a, b) {
  return b.length - a.length;
}
;function v(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.B = "";
}
v.prototype.set = function(a, b) {
  this.cache.set(this.B = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
v.prototype.get = function(a) {
  const b = this.cache.get(a);
  b && this.B !== a && (this.cache.delete(a), this.cache.set(this.B = a, b));
  return b;
};
v.prototype.remove = function(a) {
  for (const b of this.cache) {
    const c = b[0];
    b[1].includes(a) && this.cache.delete(c);
  }
};
v.prototype.clear = function() {
  this.cache.clear();
  this.B = "";
};
const w = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const x = new Map([["ai", "ei"], ["ae", "a"], ["oe", "o"], ["ue", "u"], ["sh", "s"], ["ch", "c"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), z = [/([^aeo])h([aeo$])/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2"];
const A = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const B = /[\x00-\x7F]+/g;
const C = /[\x00-\x7F]+/g;
const D = /[\x00-\x7F]+/g;
var E = {LatinExact:{normalize:!1, dedupe:!1}, LatinDefault:{normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1}, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:w}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:w, replacer:z, matcher:x}, LatinExtra:{normalize:!0, dedupe:!0, mapper:w, replacer:z.concat([/(?!^)[aeoy]/g, ""]), matcher:x}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let d = b.charAt(0), e = A[d];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = A[g]) || g === e || (d += g, e = g, 4 !== d.length)); f++) {
    }
    a[c] = d;
  }
}}, ArabicDefault:{rtl:!0, normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(B, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(C, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(D, " ");
}}};
const F = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
function G(a) {
  const b = "string" === typeof a ? a : a.preset;
  b && (F[b] || console.warn("Preset not found: " + b), a = Object.assign({}, F[b], a));
  return a;
}
;t();
H.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.h.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (d = b.length) {
      const q = t(), n = t(), p = this.depth, r = this.resolution;
      for (let k = 0; k < d; k++) {
        let m = b[this.rtl ? d - 1 - k : k];
        var e = m.length;
        if (e && (p || !n[m])) {
          var f = this.score ? this.score(b, m, k, null, 0) : I(r, d, k), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (f = 0; f < e; f++) {
                  for (var h = e; h > f; h--) {
                    g = m.substring(f, h);
                    var l = this.score ? this.score(b, m, k, g, f) : I(r, d, k, e, f);
                    K(this, n, g, l, a, c);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  g = m[h] + g, l = this.score ? this.score(b, m, k, g, h) : I(r, d, k, e, h), K(this, n, g, l, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  g += m[h], K(this, n, g, f, a, c);
                }
                break;
              }
            default:
              if (K(this, n, m, f, a, c), p && 1 < d && k < d - 1) {
                for (e = t(), g = this.C, f = m, h = Math.min(p + 1, d - k), e[f] = 1, l = 1; l < h; l++) {
                  if ((m = b[this.rtl ? d - 1 - k - l : k + l]) && !e[m]) {
                    e[m] = 1;
                    const y = this.score ? this.score(b, f, k, m, l) : I(g + (d / 2 > g ? 0 : 1), d, k, h - 1, l - 1), J = this.bidirectional && m > f;
                    K(this, q, J ? f : m, y, a, c, J ? m : f);
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
function K(a, b, c, d, e, f, g) {
  let h = g ? a.A : a.map, l;
  b[c] && g && (l = b[c])[g] || (g ? (b = l || (b[c] = t()), b[g] = 1, (l = h.get(g)) ? h = l : h.set(g, h = new Map())) : b[c] = 1, (l = h.get(c)) ? h = l : h.set(c, h = []), h = h[d] || (h[d] = []), f && h.includes(e) || (h.push(e), a.fastupdate && ((b = a.h.get(e)) ? b.push(h) : a.h.set(e, [h]))));
}
function I(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;function L(a, b, c) {
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a;
  }
  let d = [];
  for (let e = 0, f, g; e < a.length; e++) {
    if ((f = a[e]) && (g = f.length)) {
      if (c) {
        if (c >= g) {
          c -= g;
          continue;
        }
        c < g && (f = b ? f.slice(c, c + b) : f.slice(c), g = f.length, c = 0);
      }
      if (d.length) {
        g > b && (f = f.slice(0, b), g = f.length), d.push(f);
      } else {
        if (g >= b) {
          return g > b && (f = f.slice(0, b)), f;
        }
        d = [f];
      }
      b -= g;
      if (!b) {
        break;
      }
    }
  }
  return d.length ? d = 1 < d.length ? [].concat.apply([], d) : d[0] : d;
}
;H.prototype.search = function(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : (c = a, a = ""));
  var d = [], e = 0;
  if (c) {
    a = c.query || a;
    b = c.limit || b;
    e = c.offset || 0;
    var f = c.context;
    var g = !1;
  }
  a = this.encoder.encode(a);
  c = a.length;
  b || (b = 100);
  if (1 === c) {
    return M.call(this, a[0], "", b, e);
  }
  f = this.depth && !1 !== f;
  if (2 === c && f && !g) {
    return M.call(this, a[0], a[1], b, e);
  }
  var h = 0, l = 0;
  if (1 < c) {
    var q = t();
    const p = [];
    for (let r = 0, k; r < c; r++) {
      if ((k = a[r]) && !q[k]) {
        if (g || N(this, k)) {
          p.push(k), q[k] = 1;
        } else {
          return d;
        }
        const m = k.length;
        h = Math.max(h, m);
        l = l ? Math.min(l, m) : m;
      }
    }
    a = p;
    c = a.length;
  }
  if (!c) {
    return d;
  }
  q = 0;
  if (1 === c) {
    return M.call(this, a[0], "", b, e);
  }
  if (2 === c && f && !g) {
    return M.call(this, a[0], a[1], b, e);
  }
  if (1 < c) {
    if (f) {
      var n = a[0];
      q = 1;
    } else {
      9 < h && 3 < h / l && a.sort(u);
    }
  }
  for (let p, r; q < c; q++) {
    r = a[q];
    n ? (p = N(this, r, n), p = O(p, d, g, this.C, b, e, 2 === c), g && !1 === p && d.length || (n = r)) : (p = N(this, r), p = O(p, d, g, this.resolution, b, e, 1 === c));
    if (p) {
      return p;
    }
    if (g && q === c - 1) {
      f = d.length;
      if (!f) {
        if (n) {
          n = "";
          q = -1;
          continue;
        }
        return d;
      }
      if (1 === f) {
        return L(d[0], b, e);
      }
    }
  }
  a: {
    a = d;
    d = this.resolution;
    n = g;
    c = a.length;
    g = [];
    f = t();
    for (let p = 0, r, k, m, y; p < d; p++) {
      for (l = 0; l < c; l++) {
        if (m = a[l], p < m.length && (r = m[p])) {
          for (q = 0; q < r.length; q++) {
            k = r[q], (h = f[k]) ? f[k]++ : (h = 0, f[k] = 1), y = g[h] || (g[h] = []), y.push(k);
          }
        }
      }
    }
    if (a = g.length) {
      if (n) {
        d = [];
        for (let p = a - 1, r = 0, k, m; 0 <= p; p--) {
          if (k = g[p], m = k.length, e >= m) {
            e -= m;
          } else {
            if (m + r > b || e) {
              k = k.slice(e, b - r + e), m = k.length;
            }
            d.push(k);
            r += m;
            if (b === r) {
              break;
            }
          }
        }
        if (1 < d.length) {
          g = d;
          a = [];
          d = t();
          f = g.length;
          for (l = 0; l < f; l++) {
            for (n = g[l], h = n.length, q = 0; q < h; q++) {
              if (c = n[q], !d[c]) {
                if (d[c] = 1, e) {
                  e--;
                } else {
                  if (a.push(c), a.length === b) {
                    break;
                  }
                }
              }
            }
          }
          b = a;
        } else {
          b = d[0];
        }
        g = b;
      } else {
        if (a < c) {
          d = [];
          break a;
        }
        g = g[a - 1];
        if (g.length > b || e) {
          g = g.slice(e, b + e);
        }
      }
    }
    d = g;
  }
  return d;
};
function M(a, b, c, d) {
  return (a = N(this, a, b)) && a.length ? L(a, c, d) : [];
}
function O(a, b, c, d, e, f, g) {
  let h = [];
  if (a) {
    d = Math.min(a.length, d);
    for (let l = 0, q = 0, n; l < d; l++) {
      if (n = a[l]) {
        if (f && n && g && (n.length <= f ? (f -= n.length, n = null) : (n = n.slice(f), f = 0)), n && (h[l] = n, g && (q += n.length, q >= e))) {
          break;
        }
      }
    }
    if (h.length) {
      if (g) {
        return L(h, e, 0);
      }
      b.push(h);
      return;
    }
  }
  return !c && h;
}
function N(a, b, c) {
  let d;
  c && (d = a.bidirectional && b > c);
  a = c ? (a = a.A.get(d ? b : c)) && a.get(d ? c : b) : a.map.get(b);
  return a;
}
;H.prototype.remove = function(a, b) {
  const c = this.h.size && (this.fastupdate ? this.h.get(a) : this.h.has(a));
  if (c) {
    if (this.fastupdate) {
      for (let d = 0, e; d < c.length; d++) {
        if (e = c[d]) {
          if (2 > e.length) {
            e.pop();
          } else {
            const f = e.indexOf(a);
            f === c.length - 1 ? e.pop() : e.splice(f, 1);
          }
        }
      }
    } else {
      P(this.map, a), this.depth && P(this.A, a);
    }
    b || this.h.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function P(a, b) {
  let c = 0;
  if (a.constructor === Array) {
    for (let d = 0, e, f; d < a.length; d++) {
      if ((e = a[d]) && e.length) {
        if (f = e.indexOf(b), 0 <= f) {
          1 < e.length ? (e.splice(f, 1), c++) : delete a[d];
          break;
        } else {
          c++;
        }
      }
    }
  } else {
    for (let d of a) {
      const e = d[0], f = P(d[1], b);
      f ? c += f : a.delete(e);
    }
  }
  return c;
}
;function H(a, b) {
  if (!this) {
    return new H(a);
  }
  a = a ? G(a) : {};
  const c = a.context || {}, d = a.encode || a.encoder || function(f) {
    return f.toLowerCase().trim().split(/\s+/);
  };
  this.encoder = d.encode ? d : "object" === typeof d ? d : {encode:d};
  let e;
  this.resolution = a.resolution || 9;
  this.tokenize = e = a.tokenize || "strict";
  this.depth = "strict" === e && c.depth || 0;
  this.bidirectional = !1 !== c.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e = !1;
  this.map = new Map();
  this.A = new Map();
  this.h = b || (this.fastupdate ? new Map() : new Set());
  this.C = c.resolution || 1;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (e = a.cache || null) && new v(e);
}
H.prototype.clear = function() {
  this.map.clear();
  this.A.clear();
  this.h.clear();
  this.cache && this.cache.clear();
  return this;
};
H.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
H.prototype.contain = function(a) {
  return this.h.has(a);
};
H.prototype.update = function(a, b) {
  if (this.async) {
    const c = this, d = this.remove(a);
    return d.then ? d.then(() => c.add(a, b)) : this.add(a, b);
  }
  return this.remove(a).add(a, b);
};
function Q(a) {
  let b = 0;
  if (a.constructor === Array) {
    for (let c = 0, d; c < a.length; c++) {
      (d = a[c]) && (b += d.length);
    }
  } else {
    for (const c of a) {
      const d = c[0], e = Q(c[1]);
      e ? b += e : a.delete(d);
    }
  }
  return b;
}
H.prototype.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Q(this.map);
  this.depth && Q(this.A);
  return this;
};
H.prototype.searchCache = function(a, b, c) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  let d = this.cache.get(a);
  if (!d) {
    d = this.search(a, b, c);
    if (d.then) {
      const e = this;
      d.then(function(f) {
        e.cache.set(a, f);
        return f;
      });
    }
    this.cache.set(a, d);
  }
  return d;
};
export default {Index:H, Charset:E, Encoder:null, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=H;export const  Charset=E;export const  Encoder=null;export const  Document=null;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};