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
function u(a, c) {
  return c.length - a.length;
}
;function v(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
v.prototype.set = function(a, c) {
  this.cache.set(this.h = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
v.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
  return c;
};
v.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
v.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
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
  for (let b = 0; b < a.length; b++) {
    var c = a[b];
    let d = c.charAt(0), e = A[d];
    for (let f = 1, g; f < c.length && (g = c.charAt(f), "h" === g || "w" === g || !(g = A[g]) || g === e || (d += g, e = g, 4 !== d.length)); f++) {
    }
    a[b] = d;
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
  const c = "string" === typeof a ? a : a.preset;
  c && (F[c] || console.warn("Preset not found: " + c), a = Object.assign({}, F[c], a));
  return a;
}
;t();
H.prototype.add = function(a, c, b, d) {
  if (c && (a || 0 === a)) {
    if (!d && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (d = c.length) {
      const p = t(), q = t(), n = this.depth, r = this.resolution;
      for (let l = 0; l < d; l++) {
        let m = c[this.rtl ? d - 1 - l : l];
        var e = m.length;
        if (e && (n || !q[m])) {
          var f = this.score ? this.score(c, m, l, null, 0) : I(r, d, l), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (f = 0; f < e; f++) {
                  for (var h = e; h > f; h--) {
                    g = m.substring(f, h);
                    var k = this.score ? this.score(c, m, l, g, f) : I(r, d, l, e, f);
                    K(this, q, g, k, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  g = m[h] + g, k = this.score ? this.score(c, m, l, g, h) : I(r, d, l, e, h), K(this, q, g, k, a, b);
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  g += m[h], K(this, q, g, f, a, b);
                }
                break;
              }
            default:
              if (K(this, q, m, f, a, b), n && 1 < d && l < d - 1) {
                for (e = t(), g = this.A, f = m, h = Math.min(n + 1, d - l), e[f] = 1, k = 1; k < h; k++) {
                  if ((m = c[this.rtl ? d - 1 - l - k : l + k]) && !e[m]) {
                    e[m] = 1;
                    const y = this.score ? this.score(c, f, l, m, k) : I(g + (d / 2 > g ? 0 : 1), d, l, h - 1, k - 1), J = this.bidirectional && m > f;
                    K(this, p, J ? f : m, y, a, b, J ? m : f);
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
function K(a, c, b, d, e, f, g) {
  let h = g ? a.ctx : a.map, k;
  c[b] && g && (k = c[b])[g] || (g ? (c = k || (c[b] = t()), c[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : c[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[d] || (h[d] = []), f && h.includes(e) || (h.push(e), a.fastupdate && ((c = a.reg.get(e)) ? c.push(h) : a.reg.set(e, [h]))));
}
function I(a, c, b, d, e) {
  return b && 1 < a ? c + (d || 0) <= a ? b + (e || 0) : (a - 1) / (c + (d || 0)) * (b + (e || 0)) + 1 | 0 : 0;
}
;function L(a, c, b) {
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a;
  }
  let d = [];
  for (let e = 0, f, g; e < a.length; e++) {
    if ((f = a[e]) && (g = f.length)) {
      if (b) {
        if (b >= g) {
          b -= g;
          continue;
        }
        b < g && (f = c ? f.slice(b, b + c) : f.slice(b), g = f.length, b = 0);
      }
      if (d.length) {
        g > c && (f = f.slice(0, c), g = f.length), d.push(f);
      } else {
        if (g >= c) {
          return g > c && (f = f.slice(0, c)), f;
        }
        d = [f];
      }
      c -= g;
      if (!c) {
        break;
      }
    }
  }
  return d.length ? d = 1 < d.length ? [].concat.apply([], d) : d[0] : d;
}
;H.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  var d = [], e = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    e = b.offset || 0;
    var f = b.context;
    var g = b.suggest;
  }
  a = this.encoder.encode(a);
  b = a.length;
  c || (c = 100);
  if (1 === b) {
    return M.call(this, a[0], "", c, e);
  }
  f = this.depth && !1 !== f;
  if (2 === b && f && !g) {
    return M.call(this, a[0], a[1], c, e);
  }
  var h = 0, k = 0;
  if (1 < b) {
    var p = t();
    const n = [];
    for (let r = 0, l; r < b; r++) {
      if ((l = a[r]) && !p[l]) {
        if (g || N(this, l)) {
          n.push(l), p[l] = 1;
        } else {
          return d;
        }
        const m = l.length;
        h = Math.max(h, m);
        k = k ? Math.min(k, m) : m;
      }
    }
    a = n;
    b = a.length;
  }
  if (!b) {
    return d;
  }
  p = 0;
  if (1 === b) {
    return M.call(this, a[0], "", c, e);
  }
  if (2 === b && f && !g) {
    return M.call(this, a[0], a[1], c, e);
  }
  if (1 < b) {
    if (f) {
      var q = a[0];
      p = 1;
    } else {
      9 < h && 3 < h / k && a.sort(u);
    }
  }
  for (let n, r; p < b; p++) {
    r = a[p];
    q ? (n = N(this, r, q), n = O(n, d, g, this.A), g && !1 === n && d.length || (q = r)) : (n = N(this, r, ""), n = O(n, d, g, this.resolution));
    if (n) {
      return n;
    }
    if (g && p === b - 1) {
      f = d.length;
      if (!f) {
        if (q) {
          q = "";
          p = -1;
          continue;
        }
        return d;
      }
      if (1 === f) {
        return L(d[0], c, e);
      }
    }
  }
  a: {
    a = d;
    d = this.resolution;
    q = a.length;
    b = [];
    f = t();
    for (let n = 0, r, l, m, y; n < d; n++) {
      for (k = 0; k < q; k++) {
        if (m = a[k], n < m.length && (r = m[n])) {
          for (p = 0; p < r.length; p++) {
            l = r[p], (h = f[l]) ? f[l]++ : (h = 0, f[l] = 1), y = b[h] || (b[h] = []), y.push(l);
          }
        }
      }
    }
    if (a = b.length) {
      if (g) {
        if (1 < b.length) {
          g = b;
          a = [];
          d = t();
          f = g.length;
          for (k = 0; k < f; k++) {
            for (q = g[k], h = q.length, p = 0; p < h; p++) {
              if (b = q[p], !d[b]) {
                if (d[b] = 1, e) {
                  e--;
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
        if (a < q) {
          d = [];
          break a;
        }
        b = b[a - 1];
        if (b.length > c || e) {
          b = b.slice(e, c + e);
        }
      }
    }
    d = b;
  }
  return d;
};
function M(a, c, b, d) {
  return (a = N(this, a, c)) && a.length ? L(a, b, d) : [];
}
function O(a, c, b, d) {
  let e = [];
  if (a) {
    d = Math.min(a.length, d);
    for (let f = 0, g; f < d; f++) {
      (g = a[f]) && g && (e[f] = g);
    }
    if (e.length) {
      c.push(e);
      return;
    }
  }
  return !b && e;
}
function N(a, c, b) {
  let d;
  b && (d = a.bidirectional && c > b);
  a = b ? (a = a.ctx.get(d ? c : b)) && a.get(d ? b : c) : a.map.get(c);
  return a;
}
;H.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let d = 0, e; d < b.length; d++) {
        if (e = b[d]) {
          if (2 > e.length) {
            e.pop();
          } else {
            const f = e.indexOf(a);
            f === b.length - 1 ? e.pop() : e.splice(f, 1);
          }
        }
      }
    } else {
      P(this.map, a), this.depth && P(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function P(a, c) {
  let b = 0;
  if (a.constructor === Array) {
    for (let d = 0, e, f; d < a.length; d++) {
      if ((e = a[d]) && e.length) {
        if (f = e.indexOf(c), 0 <= f) {
          1 < e.length ? (e.splice(f, 1), b++) : delete a[d];
          break;
        } else {
          b++;
        }
      }
    }
  } else {
    for (let d of a) {
      const e = d[0], f = P(d[1], c);
      f ? b += f : a.delete(e);
    }
  }
  return b;
}
;function H(a, c) {
  if (!this) {
    return new H(a);
  }
  a = a ? G(a) : {};
  const b = a.context || {}, d = "string" === typeof a.encoder ? E[a.encoder] : a.encode || a.encoder || function(f) {
    return f.toLowerCase().trim().split(/\s+/);
  };
  this.encoder = d.encode ? d : "object" === typeof d ? d : {encode:d};
  let e;
  this.resolution = a.resolution || 9;
  this.tokenize = e = a.tokenize || "strict";
  this.depth = "strict" === e && b.depth || 0;
  this.bidirectional = !1 !== b.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e = !1;
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.A = b.resolution || 1;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (e = a.cache || null) && new v(e);
}
H.prototype.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  return this;
};
H.prototype.append = function(a, c) {
  return this.add(a, c, !0);
};
H.prototype.contain = function(a) {
  return this.reg.has(a);
};
H.prototype.update = function(a, c) {
  const b = this, d = this.remove(a);
  return d && d.then ? d.then(() => b.add(a, c)) : this.add(a, c);
};
function Q(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, d; b < a.length; b++) {
      (d = a[b]) && (c += d.length);
    }
  } else {
    for (const b of a) {
      const d = b[0], e = Q(b[1]);
      e ? c += e : a.delete(d);
    }
  }
  return c;
}
H.prototype.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  Q(this.map);
  this.depth && Q(this.ctx);
  return this;
};
H.prototype.searchCache = function(a, c, b) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  let d = this.cache.get(a);
  if (!d) {
    d = this.search(a, c, b);
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