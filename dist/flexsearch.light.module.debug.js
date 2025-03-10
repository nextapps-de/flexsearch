/**!
 * FlexSearch.js v0.8.0 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
function t(a, b) {
  return b.length - a.length;
}
;function u(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.B = "";
}
u.prototype.set = function(a, b) {
  this.cache.set(this.B = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
u.prototype.get = function(a) {
  const b = this.cache.get(a);
  b && this.B !== a && (this.cache.delete(a), this.cache.set(this.B = a, b));
  return b;
};
u.prototype.remove = function(a) {
  for (const b of this.cache) {
    const c = b[0];
    b[1].includes(a) && this.cache.delete(c);
  }
};
u.prototype.clear = function() {
  this.cache.clear();
  this.B = "";
};
const v = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const w = new Map([["ai", "ei"], ["ae", "a"], ["oe", "o"], ["ue", "u"], ["sh", "s"], ["ch", "c"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), y = [/([^aeo])h([aeo$])/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2"];
const z = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
const A = /[\x00-\x7F]+/g;
const B = /[\x00-\x7F]+/g;
const C = /[\x00-\x7F]+/g;
var D = {LatinExact:{normalize:!1, dedupe:!1}, LatinDefault:{normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1}, LatinSimple:{normalize:!0, dedupe:!0}, LatinBalance:{normalize:!0, dedupe:!0, mapper:v}, LatinAdvanced:{normalize:!0, dedupe:!0, mapper:v, replacer:y, matcher:w}, LatinExtra:{normalize:!0, dedupe:!0, mapper:v, replacer:y.concat([/(?!^)[aeoy]/g, ""]), matcher:w}, LatinSoundex:{normalize:!0, dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let d = b.charAt(0), e = z[d];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = z[g]) || g === e || (d += g, e = g, 4 !== d.length)); f++) {
    }
    a[c] = d;
  }
}}, ArabicDefault:{rtl:!0, normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(A, " ");
}}, CjkDefault:{normalize:!1, dedupe:!0, split:"", prepare:function(a) {
  return ("" + a).replace(B, "");
}}, CyrillicDefault:{normalize:!1, dedupe:!0, prepare:function(a) {
  return ("" + a).replace(C, " ");
}}};
const E = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
function F(a) {
  const b = "string" === typeof a ? a : a.preset;
  b && (E[b] || console.warn("Preset not found: " + b), a = Object.assign({}, E[b], a));
  return a;
}
;Object.create(null);
G.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.h.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (d = b.length) {
      const r = Object.create(null), p = Object.create(null), n = this.depth, q = this.resolution;
      for (let k = 0; k < d; k++) {
        let l = b[this.rtl ? d - 1 - k : k];
        var e = l.length;
        if (e && (n || !p[l])) {
          var f = this.score ? this.score(b, l, k, null, 0) : H(q, d, k), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (f = 0; f < e; f++) {
                  for (var h = e; h > f; h--) {
                    g = l.substring(f, h);
                    var m = this.score ? this.score(b, l, k, g, f) : H(q, d, k, e, f);
                    J(this, p, g, m, a, c);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  g = l[h] + g, m = this.score ? this.score(b, l, k, g, h) : H(q, d, k, e, h), J(this, p, g, m, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  g += l[h], J(this, p, g, f, a, c);
                }
                break;
              }
            default:
              if (J(this, p, l, f, a, c), n && 1 < d && k < d - 1) {
                for (e = Object.create(null), g = this.C, f = l, h = Math.min(n + 1, d - k), e[f] = 1, m = 1; m < h; m++) {
                  if ((l = b[this.rtl ? d - 1 - k - m : k + m]) && !e[l]) {
                    e[l] = 1;
                    const x = this.score ? this.score(b, f, k, l, m) : H(g + (d / 2 > g ? 0 : 1), d, k, h - 1, m - 1), I = this.bidirectional && l > f;
                    J(this, r, I ? f : l, x, a, c, I ? l : f);
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
function J(a, b, c, d, e, f, g) {
  let h = g ? a.A : a.map, m;
  b[c] && g && (m = b[c])[g] || (g ? (b = m || (b[c] = Object.create(null)), b[g] = 1, (m = h.get(g)) ? h = m : h.set(g, h = new Map())) : b[c] = 1, (m = h.get(c)) ? h = m : h.set(c, h = []), h = h[d] || (h[d] = []), f && h.includes(e) || (h.push(e), a.fastupdate && ((b = a.h.get(e)) ? b.push(h) : a.h.set(e, [h]))));
}
function H(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;function K(a, b, c) {
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
;G.prototype.search = function(a, b, c) {
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
    return L.call(this, a[0], "", b, e);
  }
  f = this.depth && !1 !== f;
  if (2 === c && f && !g) {
    return L.call(this, a[0], a[1], b, e);
  }
  var h = 0, m = 0;
  if (1 < c) {
    var r = Object.create(null);
    const n = [];
    for (let q = 0, k; q < c; q++) {
      if ((k = a[q]) && !r[k]) {
        if (g || M(this, k)) {
          n.push(k), r[k] = 1;
        } else {
          return d;
        }
        const l = k.length;
        h = Math.max(h, l);
        m = m ? Math.min(m, l) : l;
      }
    }
    a = n;
    c = a.length;
  }
  if (!c) {
    return d;
  }
  r = 0;
  if (1 === c) {
    return L.call(this, a[0], "", b, e);
  }
  if (2 === c && f && !g) {
    return L.call(this, a[0], a[1], b, e);
  }
  if (1 < c) {
    if (f) {
      var p = a[0];
      r = 1;
    } else {
      9 < h && 3 < h / m && a.sort(t);
    }
  }
  for (let n, q; r < c; r++) {
    q = a[r];
    p ? (n = M(this, q, p), n = N(n, d, g, this.C, b, e, 2 === c), g && !1 === n && d.length || (p = q)) : (n = M(this, q), n = N(n, d, g, this.resolution, b, e, 1 === c));
    if (n) {
      return n;
    }
    if (g && r === c - 1) {
      f = d.length;
      if (!f) {
        if (p) {
          p = "";
          r = -1;
          continue;
        }
        return d;
      }
      if (1 === f) {
        return K(d[0], b, e);
      }
    }
  }
  a: {
    a = d;
    d = this.resolution;
    p = g;
    c = a.length;
    g = [];
    f = Object.create(null);
    for (let n = 0, q, k, l, x; n < d; n++) {
      for (m = 0; m < c; m++) {
        if (l = a[m], n < l.length && (q = l[n])) {
          for (r = 0; r < q.length; r++) {
            k = q[r], (h = f[k]) ? f[k]++ : (h = 0, f[k] = 1), x = g[h] || (g[h] = []), x.push(k);
          }
        }
      }
    }
    if (a = g.length) {
      if (p) {
        d = [];
        for (let n = a - 1, q = 0, k, l; 0 <= n; n--) {
          if (k = g[n], l = k.length, e >= l) {
            e -= l;
          } else {
            if (l + q > b || e) {
              k = k.slice(e, b - q + e), l = k.length;
            }
            d.push(k);
            q += l;
            if (b === q) {
              break;
            }
          }
        }
        g = 1 < d.length ? [].concat.apply([], d) : d[0];
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
function L(a, b, c, d) {
  return (a = M(this, a, b)) && a.length ? K(a, c, d) : [];
}
function N(a, b, c, d, e, f, g) {
  let h = [];
  if (a) {
    d = Math.min(a.length, d);
    for (let m = 0, r = 0, p; m < d; m++) {
      if (p = a[m]) {
        if (f && p && g && (p.length <= f ? (f -= p.length, p = null) : (p = p.slice(f), f = 0)), p && (h[m] = p, g && (r += p.length, r >= e))) {
          break;
        }
      }
    }
    if (h.length) {
      if (g) {
        return K(h, e, 0);
      }
      b.push(h);
      return;
    }
  }
  return !c && h;
}
function M(a, b, c) {
  let d;
  c && (d = a.bidirectional && b > c);
  a = c ? (a = a.A.get(d ? b : c)) && a.get(d ? c : b) : a.map.get(b);
  return a;
}
;G.prototype.remove = function(a, b) {
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
      O(this.map, a), this.depth && O(this.A, a);
    }
    b || this.h.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function O(a, b) {
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
      const e = d[0], f = O(d[1], b);
      f ? c += f : a.delete(e);
    }
  }
  return c;
}
;function G(a, b) {
  if (!this) {
    return new G(a);
  }
  a = a ? F(a) : {};
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
  this.cache = (e = a.cache || null) && new u(e);
}
G.prototype.clear = function() {
  this.map.clear();
  this.A.clear();
  this.h.clear();
  this.cache && this.cache.clear();
  return this;
};
G.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
G.prototype.contain = function(a) {
  return this.h.has(a);
};
G.prototype.update = function(a, b) {
  if (this.async) {
    const c = this, d = this.remove(a);
    return d.then ? d.then(() => c.add(a, b)) : this.add(a, b);
  }
  return this.remove(a).add(a, b);
};
function P(a) {
  let b = 0;
  if (a.constructor === Array) {
    for (let c = 0, d; c < a.length; c++) {
      (d = a[c]) && (b += d.length);
    }
  } else {
    for (const c of a) {
      const d = c[0], e = P(c[1]);
      e ? b += e : a.delete(d);
    }
  }
  return b;
}
G.prototype.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  P(this.map);
  this.depth && P(this.A);
  return this;
};
G.prototype.searchCache = function(a, b, c) {
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
export default {Index:G, Charset:D, Encoder:null, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=G;export const  Charset=D;export const  Encoder=null;export const  Document=null;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};