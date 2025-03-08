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
function v(a, b) {
  return b.length - a.length;
}
;function w(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.C = "";
}
w.prototype.set = function(a, b) {
  this.cache.has(a) || (this.cache.set(this.C = a, b), this.limit && this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value));
};
w.prototype.get = function(a) {
  const b = this.cache.get(a);
  b && this.limit && this.C !== a && (this.cache.delete(a), this.cache.set(this.C = a, b));
  return b;
};
w.prototype.remove = function(a) {
  for (const b of this.cache) {
    const c = b[0];
    b[1].includes(a) && this.cache.delete(c);
  }
};
w.prototype.clear = function() {
  this.cache.clear();
  this.C = "";
};
const x = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
function y(a) {
  const b = "string" === typeof a ? a : a.preset;
  b && (x[b] || console.warn("Preset not found: " + b), a = Object.assign({}, x[b], a));
  return a;
}
;t();
z.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.h.has(a)) {
      return this.update(a, b);
    }
    b = this.encoder.encode(b);
    if (d = b.length) {
      const r = t(), k = t(), p = this.depth, q = this.resolution;
      for (let l = 0; l < d; l++) {
        let n = b[this.rtl ? d - 1 - l : l];
        var e = n.length;
        if (e && (p || !k[n])) {
          var f = this.score ? this.score(b, n, l, null, 0) : A(q, d, l), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (f = 0; f < e; f++) {
                  for (var h = e; h > f; h--) {
                    g = n.substring(f, h);
                    var m = this.score ? this.score(b, n, l, g, f) : A(q, d, l, e, f);
                    B(this, k, g, m, a, c);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  g = n[h] + g, m = this.score ? this.score(b, n, l, g, h) : A(q, d, l, e, h), B(this, k, g, m, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  g += n[h], B(this, k, g, f, a, c);
                }
                break;
              }
            default:
              if (B(this, k, n, f, a, c), p && 1 < d && l < d - 1) {
                for (e = t(), g = this.F, f = n, h = Math.min(p + 1, d - l), e[f] = 1, m = 1; m < h; m++) {
                  if ((n = b[this.rtl ? d - 1 - l - m : l + m]) && !e[n]) {
                    e[n] = 1;
                    const u = this.score ? this.score(b, f, l, n, m) : A(g + (d / 2 > g ? 0 : 1), d, l, h - 1, m - 1), H = this.bidirectional && n > f;
                    B(this, r, H ? f : n, u, a, c, H ? n : f);
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
function B(a, b, c, d, e, f, g) {
  let h = g ? a.B : a.map, m;
  b[c] && g && (m = b[c])[g] || (g ? (b = m || (b[c] = t()), b[g] = 1, (m = h.get(g)) ? h = m : h.set(g, h = new Map())) : b[c] = 1, (m = h.get(c)) ? h = m : h.set(c, h = []), h = h[d] || (h[d] = []), f && h.includes(e) || (h.push(e), a.fastupdate && ((b = a.h.get(e)) ? b.push(h) : a.h.set(e, [h]))));
}
function A(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;function C(a, b, c) {
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
;function D(a, b, c, d) {
  var e = a.length;
  let f = [], g = 0, h, m, r;
  d && (d = []);
  for (let k = e - 1, p; 0 <= k; k--) {
    r = a[k];
    e = t();
    p = !h;
    for (let q = 0, l; q < r.length; q++) {
      if ((l = r[q]) && l.length) {
        for (let n = 0, u; n < l.length; n++) {
          if (u = l[n], h) {
            if (h[u]) {
              if (!k) {
                if (c) {
                  c--;
                } else {
                  if (f[g++] = u, g === b) {
                    return f;
                  }
                }
              }
              if (k || d) {
                e[u] = 1;
              }
              p = !0;
            }
            d && !m[u] && (m[u] = 1, (d[q] || (d[q] = [])).push(u));
          } else {
            e[u] = 1;
          }
        }
      }
    }
    if (d) {
      h || (m = e);
    } else if (!p) {
      return [];
    }
    h = e;
  }
  if (d) {
    for (let k = d.length - 1, p, q; 0 <= k; k--) {
      p = d[k];
      q = p.length;
      for (let l = 0, n; l < q; l++) {
        if (n = p[l], !h[n]) {
          if (c) {
            c--;
          } else {
            if (f[g++] = n, g === b) {
              return f;
            }
          }
          h[n] = 1;
        }
      }
    }
  }
  return f;
}
;z.prototype.search = function(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : (c = a, a = ""));
  let d = [];
  let e, f = 0;
  if (c) {
    a = c.query || a;
    b = c.limit || b;
    f = c.offset || 0;
    var g = c.context;
    e = !1;
  }
  a = this.encoder.encode(a);
  c = a.length;
  b || (b = 100);
  if (1 === c) {
    return E.call(this, a[0], "", b, f);
  }
  g = this.depth && !1 !== g;
  if (2 === c && g && !e) {
    return E.call(this, a[0], a[1], b, f);
  }
  let h = 0, m = 0;
  if (1 < c) {
    var r = t();
    const p = [];
    for (let q = 0, l; q < c; q++) {
      if ((l = a[q]) && !r[l]) {
        if (e || F(this, l)) {
          p.push(l), r[l] = 1;
        } else {
          return d;
        }
        const n = l.length;
        h = Math.max(h, n);
        m = m ? Math.min(m, n) : n;
      }
    }
    a = p;
    c = a.length;
  }
  if (!c) {
    return d;
  }
  r = 0;
  let k;
  if (1 === c) {
    return E.call(this, a[0], "", b, f);
  }
  if (2 === c && g && !e) {
    return E.call(this, a[0], a[1], b, f);
  }
  1 < c && (g ? (k = a[0], r = 1) : 9 < h && 3 < h / m && a.sort(v));
  for (let p, q; r < c; r++) {
    q = a[r];
    k ? (p = F(this, q, k), p = G(p, d, e, this.F, b, f, 2 === c), e && !1 === p && d.length || (k = q)) : (p = F(this, q), p = G(p, d, e, this.resolution, b, f, 1 === c));
    if (p) {
      return p;
    }
    if (e && r === c - 1) {
      g = d.length;
      if (!g) {
        if (k) {
          k = "";
          r = -1;
          continue;
        }
        return d;
      }
      if (1 === g) {
        return C(d[0], b, f);
      }
    }
  }
  return D(d, b, f, e);
};
function E(a, b, c, d) {
  return (a = F(this, a, b)) && a.length ? C(a, c, d) : [];
}
function G(a, b, c, d, e, f, g) {
  let h = [];
  if (a) {
    d = Math.min(a.length, d);
    for (let m = 0, r = 0, k; m < d; m++) {
      if (k = a[m]) {
        if (f && k && g && (k.length <= f ? (f -= k.length, k = null) : (k = k.slice(f), f = 0)), k && (h[m] = k, g && (r += k.length, r >= e))) {
          break;
        }
      }
    }
    if (h.length) {
      if (g) {
        return C(h, e, 0);
      }
      b.push(h);
      return;
    }
  }
  return !c && h;
}
function F(a, b, c) {
  let d;
  c && (d = a.bidirectional && b > c);
  a = c ? (a = a.B.get(d ? b : c)) && a.get(d ? c : b) : a.map.get(b);
  return a;
}
;z.prototype.remove = function(a, b) {
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
      I(this.map, a), this.depth && I(this.B, a);
    }
    b || this.h.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function I(a, b) {
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
      const e = d[0], f = I(d[1], b);
      f ? c += f : a.delete(e);
    }
  }
  return c;
}
;function z(a, b) {
  if (!(this instanceof z)) {
    return new z(a);
  }
  a = a ? y(a) : {};
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
  this.B = new Map();
  this.h = b || (this.fastupdate ? new Map() : new Set());
  this.F = c.resolution || 1;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (e = a.cache || null) && new w(e);
}
z.prototype.clear = function() {
  this.map.clear();
  this.B.clear();
  this.h.clear();
  this.cache && this.cache.clear();
  return this;
};
z.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
z.prototype.contain = function(a) {
  return this.h.has(a);
};
z.prototype.update = function(a, b) {
  if (this.async) {
    const c = this, d = this.remove(a);
    return d.then ? d.then(() => c.add(a, b)) : this.add(a, b);
  }
  return this.remove(a).add(a, b);
};
function J(a) {
  let b = 0;
  if (a.constructor === Array) {
    for (let c = 0, d; c < a.length; c++) {
      (d = a[c]) && (b += d.length);
    }
  } else {
    for (const c of a) {
      const d = c[0], e = J(c[1]);
      e ? b += e : a.delete(d);
    }
  }
  return b;
}
z.prototype.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  J(this.map);
  this.depth && J(this.B);
  return this;
};
z.prototype.searchCache = function(a, b, c) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  let d = this.cache.get(a);
  if (!d) {
    d = this.search(a, b, c);
    if (d instanceof Promise) {
      const e = this;
      d.then(function(f) {
        e.cache.set(a, f);
      });
    }
    this.cache.set(a, d);
  }
  return d;
};
const K = t();
const L = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
var M = {normalize:!0, A:!0, D:L};
const N = new Map([["ai", "ei"], ["ae", "a"], ["oe", "o"], ["ue", "u"], ["sh", "s"], ["ch", "c"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), O = [/([^aeo])h([aeo$])/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2"];
var P = {normalize:!0, A:!0, D:L, H:O, G:N};
var Q = {normalize:!0, A:!0, D:L, H:O.concat([/(?!^)[aeoy]/g, ""]), G:N};
const R = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
K["latin:exact"] = {normalize:!1, A:!1};
K["latin:default"] = {normalize:function(a) {
  return a.toLowerCase();
}, A:!1};
K["latin:simple"] = {normalize:!0, A:!0};
K["latin:balance"] = M;
K["latin:advanced"] = P;
K["latin:extra"] = Q;
K["latin:soundex"] = {normalize:!0, A:!1, J:{K:!0}, I:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let d = b.charAt(0), e = R[d];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = R[g]) || g === e || (d += g, e = g, 4 !== d.length)); f++) {
    }
    a[c] = d;
  }
}};
export default {Index:z, Charset:K, Encoder:null, Document:null, Worker:null, Resolver:null, IndexedDB:null};

export const Index=z;export const  Charset=K;export const  Encoder=null;export const  Document=null;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;