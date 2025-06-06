/**!
 * FlexSearch.js v0.8.205 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var r;
function v(a, c, b) {
  const f = typeof b, d = typeof a;
  if (f !== "undefined") {
    if (d !== "undefined") {
      if (b) {
        if (d === "function" && f === d) {
          return function(k) {
            return a(b(k));
          };
        }
        c = a.constructor;
        if (c === b.constructor) {
          if (c === Array) {
            return b.concat(a);
          }
          if (c === Map) {
            var h = new Map(b);
            for (var e of a) {
              h.set(e[0], e[1]);
            }
            return h;
          }
          if (c === Set) {
            e = new Set(b);
            for (h of a.values()) {
              e.add(h);
            }
            return e;
          }
        }
      }
      return a;
    }
    return b;
  }
  return d === "undefined" ? c : a;
}
function z() {
  return Object.create(null);
}
;const A = /[^\p{L}\p{N}]+/u, B = /(\d{3})/g, C = /(\D)(\d{3})/g, D = /(\d{3})(\D)/g, E = /[\u0300-\u036f]/g;
function F(a = {}) {
  if (!this || this.constructor !== F) {
    return new F(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
r = F.prototype;
r.assign = function(a) {
  this.normalize = v(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split, f;
  if (b || b === "") {
    if (typeof b === "object" && b.constructor !== RegExp) {
      let d = "";
      f = !c;
      c || (d += "\\p{Z}");
      b.letter && (d += "\\p{L}");
      b.number && (d += "\\p{N}", f = !!c);
      b.symbol && (d += "\\p{S}");
      b.punctuation && (d += "\\p{P}");
      b.control && (d += "\\p{C}");
      if (b = b.char) {
        d += typeof b === "object" ? b.join("") : b;
      }
      try {
        this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
      } catch (h) {
        console.error("Your split configuration:", b, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = b, f = b === !1 || "a1a".split(b).length < 2;
    }
    this.numeric = v(a.numeric, f);
  } else {
    try {
      this.split = v(this.split, A);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = v(a.numeric, v(this.numeric, !0));
  }
  this.prepare = v(a.prepare, null, this.prepare);
  this.finalize = v(a.finalize, null, this.finalize);
  b = a.filter;
  this.filter = typeof b === "function" ? b : v(b && new Set(b), null, this.filter);
  this.dedupe = v(a.dedupe, !0, this.dedupe);
  this.matcher = v((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = v((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = v((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = v(a.replacer, null, this.replacer);
  this.minlength = v(a.minlength, 1, this.minlength);
  this.maxlength = v(a.maxlength, 1024, this.maxlength);
  this.rtl = v(a.rtl, !1, this.rtl);
  if (this.cache = b = v(a.cache, !0, this.cache)) {
    this.l = null, this.A = typeof b === "number" ? b : 2e5, this.i = new Map(), this.j = new Map(), this.o = this.m = 128;
  }
  this.g = "";
  this.s = null;
  this.h = "";
  this.u = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.g += (this.g ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.h += (this.h ? "|" : "") + d;
    }
  }
  return this;
};
r.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.h += (this.h ? "|" : "") + a;
  this.u = null;
  this.cache && G(this);
  return this;
};
r.addFilter = function(a) {
  typeof a === "function" ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && G(this);
  return this;
};
r.addMapper = function(a, c) {
  if (typeof a === "object") {
    return this.addReplacer(a, c);
  }
  if (a.length > 1) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && G(this);
  return this;
};
r.addMatcher = function(a, c) {
  if (typeof a === "object") {
    return this.addReplacer(a, c);
  }
  if (a.length < 2 && (this.dedupe || this.mapper)) {
    return this.addMapper(a, c);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, c);
  this.g += (this.g ? "|" : "") + a;
  this.s = null;
  this.cache && G(this);
  return this;
};
r.addReplacer = function(a, c) {
  if (typeof a === "string") {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && G(this);
  return this;
};
r.encode = function(a, c) {
  if (this.cache && a.length <= this.m) {
    if (this.l) {
      if (this.i.has(a)) {
        return this.i.get(a);
      }
    } else {
      this.l = setTimeout(G, 50, this);
    }
  }
  this.normalize && (typeof this.normalize === "function" ? a = this.normalize(a) : a = E ? a.normalize("NFKD").replace(E, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && a.length > 3 && (a = a.replace(C, "$1 $2").replace(D, "$1 $2").replace(B, "$1 "));
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let f = [], d = z(), h, e, k = this.split || this.split === "" ? a.split(this.split) : [a];
  for (let n = 0, g, t; n < k.length; n++) {
    if ((g = t = k[n]) && !(g.length < this.minlength || g.length > this.maxlength)) {
      if (c) {
        if (d[g]) {
          continue;
        }
        d[g] = 1;
      } else {
        if (h === g) {
          continue;
        }
        h = g;
      }
      if (b) {
        f.push(g);
      } else {
        if (!this.filter || (typeof this.filter === "function" ? this.filter(g) : !this.filter.has(g))) {
          if (this.cache && g.length <= this.o) {
            if (this.l) {
              var l = this.j.get(g);
              if (l || l === "") {
                l && f.push(l);
                continue;
              }
            } else {
              this.l = setTimeout(G, 50, this);
            }
          }
          if (this.stemmer) {
            this.u || (this.u = new RegExp("(?!^)(" + this.h + ")$"));
            let w;
            for (; w !== g && g.length > 2;) {
              w = g, g = g.replace(this.u, q => this.stemmer.get(q));
            }
          }
          if (g && (this.mapper || this.dedupe && g.length > 1)) {
            l = "";
            for (let w = 0, q = "", m, p; w < g.length; w++) {
              m = g.charAt(w), m === q && this.dedupe || ((p = this.mapper && this.mapper.get(m)) || p === "" ? p === q && this.dedupe || !(q = p) || (l += p) : l += q = m);
            }
            g = l;
          }
          this.matcher && g.length > 1 && (this.s || (this.s = new RegExp("(" + this.g + ")", "g")), g = g.replace(this.s, w => this.matcher.get(w)));
          if (g && this.replacer) {
            for (l = 0; g && l < this.replacer.length; l += 2) {
              g = g.replace(this.replacer[l], this.replacer[l + 1]);
            }
          }
          this.cache && t.length <= this.o && (this.j.set(t, g), this.j.size > this.A && (this.j.clear(), this.o = this.o / 1.1 | 0));
          if (g) {
            if (g !== t) {
              if (c) {
                if (d[g]) {
                  continue;
                }
                d[g] = 1;
              } else {
                if (e === g) {
                  continue;
                }
                e = g;
              }
            }
            f.push(g);
          }
        }
      }
    }
  }
  this.finalize && (f = this.finalize(f) || f);
  this.cache && a.length <= this.m && (this.i.set(a, f), this.i.size > this.A && (this.i.clear(), this.m = this.m / 1.1 | 0));
  return f;
};
function G(a) {
  a.l = null;
  a.i.clear();
  a.j.clear();
}
;function I(a, c, b) {
  if (!a.length) {
    return a;
  }
  if (a.length === 1) {
    return a = a[0], a = b || a.length > c ? a.slice(b, b + c) : a;
  }
  let f = [];
  for (let d = 0, h, e; d < a.length; d++) {
    if ((h = a[d]) && (e = h.length)) {
      if (b) {
        if (b >= e) {
          b -= e;
          continue;
        }
        h = h.slice(b, b + c);
        e = h.length;
        b = 0;
      }
      e > c && (h = h.slice(0, c), e = c);
      if (!f.length && e >= c) {
        return h;
      }
      f.push(h);
      c -= e;
      if (!c) {
        break;
      }
    }
  }
  return f = f.length > 1 ? [].concat.apply([], f) : f[0];
}
;z();
J.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let f = 0, d, h; f < b.length; f++) {
        if ((d = b[f]) && (h = d.length)) {
          if (d[h - 1] === a) {
            d.pop();
          } else {
            const e = d.indexOf(a);
            e >= 0 && d.splice(e, 1);
          }
        }
      }
    } else {
      K(this.map, a), this.depth && K(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  return this;
};
function K(a, c) {
  let b = 0;
  var f = typeof c === "undefined";
  if (a.constructor === Array) {
    for (let d = 0, h, e, k; d < a.length; d++) {
      if ((h = a[d]) && h.length) {
        if (f) {
          return 1;
        }
        e = h.indexOf(c);
        if (e >= 0) {
          if (h.length > 1) {
            return h.splice(e, 1), 1;
          }
          delete a[d];
          if (b) {
            return 1;
          }
          k = 1;
        } else {
          if (k) {
            return 1;
          }
          b++;
        }
      }
    }
  } else {
    for (let d of a.entries()) {
      f = d[0], K(d[1], c) ? b++ : a.delete(f);
    }
  }
  return b;
}
;const L = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
J.prototype.add = function(a, c, b, f) {
  if (c && (a || a === 0)) {
    if (!f && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    f = this.depth;
    c = this.encoder.encode(c, !f);
    const n = c.length;
    if (n) {
      const g = z(), t = z(), w = this.resolution;
      for (let q = 0; q < n; q++) {
        let m = c[this.rtl ? n - 1 - q : q];
        var d = m.length;
        if (d && (f || !t[m])) {
          var h = this.score ? this.score(c, m, q, null, 0) : M(w, n, q), e = "";
          switch(this.tokenize) {
            case "tolerant":
              N(this, t, m, h, a, b);
              if (d > 2) {
                for (let p = 1, u, y, x, H; p < d - 1; p++) {
                  u = m.charAt(p), y = m.charAt(p + 1), x = m.substring(0, p) + y, H = m.substring(p + 2), e = x + u + H, N(this, t, e, h, a, b), e = x + H, N(this, t, e, h, a, b);
                }
                N(this, t, m.substring(0, m.length - 1), h, a, b);
              }
              break;
            case "full":
              if (d > 2) {
                for (let p = 0, u; p < d; p++) {
                  for (h = d; h > p; h--) {
                    e = m.substring(p, h);
                    u = this.rtl ? d - 1 - p : p;
                    var k = this.score ? this.score(c, m, q, e, u) : M(w, n, q, d, u);
                    N(this, t, e, k, a, b);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (d > 1) {
                for (k = d - 1; k > 0; k--) {
                  e = m[this.rtl ? d - 1 - k : k] + e;
                  var l = this.score ? this.score(c, m, q, e, k) : M(w, n, q, d, k);
                  N(this, t, e, l, a, b);
                }
                e = "";
              }
            case "forward":
              if (d > 1) {
                for (k = 0; k < d; k++) {
                  e += m[this.rtl ? d - 1 - k : k], N(this, t, e, h, a, b);
                }
                break;
              }
            default:
              if (N(this, t, m, h, a, b), f && n > 1 && q < n - 1) {
                for (d = this.v, e = m, h = Math.min(f + 1, this.rtl ? q + 1 : n - q), k = 1; k < h; k++) {
                  m = c[this.rtl ? n - 1 - q - k : q + k];
                  l = this.bidirectional && m > e;
                  const p = this.score ? this.score(c, e, q, m, k - 1) : M(d + (n / 2 > d ? 0 : 1), n, q, h - 1, k - 1);
                  N(this, g, l ? e : m, p, a, b, l ? m : e);
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
function N(a, c, b, f, d, h, e) {
  let k, l;
  if (!(k = c[b]) || e && !k[e]) {
    e ? (c = k || (c[b] = z()), c[e] = 1, l = a.ctx, (k = l.get(e)) ? l = k : l.set(e, l = new Map())) : (l = a.map, c[b] = 1);
    (k = l.get(b)) ? l = k : l.set(b, l = k = []);
    if (h) {
      for (let n = 0, g; n < k.length; n++) {
        if ((g = k[n]) && g.includes(d)) {
          if (n <= f) {
            return;
          }
          g.splice(g.indexOf(d), 1);
          a.fastupdate && (c = a.reg.get(d)) && c.splice(c.indexOf(g), 1);
          break;
        }
      }
    }
    l = l[f] || (l[f] = []);
    l.push(d);
    a.fastupdate && ((f = a.reg.get(d)) ? f.push(l) : a.reg.set(d, [l]));
  }
}
function M(a, c, b, f, d) {
  return b && a > 1 ? c + (f || 0) <= a ? b + (d || 0) : (a - 1) / (c + (f || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;J.prototype.search = function(a, c, b) {
  b || (c || typeof a !== "object" ? typeof c === "object" && (b = c, c = 0) : (b = a, a = ""));
  var f = [], d = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    d = b.offset || 0;
    var h = b.context;
    var e = b.suggest;
    var k = !0;
    var l = b.resolution;
  }
  typeof k === "undefined" && (k = !0);
  h = this.depth && h !== !1;
  a = this.encoder.encode(a, !h);
  b = a.length;
  c = c || (k ? 100 : 0);
  if (b === 1) {
    return e = d, (d = O(this, a[0], "")) && d.length ? I.call(this, d, c, e) : [];
  }
  if (b === 2 && h && !e) {
    return e = d, (d = O(this, a[1], a[0])) && d.length ? I.call(this, d, c, e) : [];
  }
  k = z();
  var n = 0;
  if (h) {
    var g = a[0];
    n = 1;
  }
  l || l === 0 || (l = g ? this.v : this.resolution);
  for (let m, p; n < b; n++) {
    if ((p = a[n]) && !k[p]) {
      k[p] = 1;
      m = O(this, p, g);
      a: {
        h = m;
        var t = f, w = e, q = l;
        let u = [];
        if (h && h.length) {
          if (h.length <= q) {
            t.push(h);
            m = void 0;
            break a;
          }
          for (let y = 0, x; y < q; y++) {
            if (x = h[y]) {
              u[y] = x;
            }
          }
          if (u.length) {
            t.push(u);
            m = void 0;
            break a;
          }
        }
        m = w ? void 0 : u;
      }
      if (m) {
        f = m;
        break;
      }
      g && (e && m && f.length || (g = p));
    }
    e && g && n === b - 1 && !f.length && (l = this.resolution, g = "", n = -1, k = z());
  }
  a: {
    a = f;
    f = a.length;
    g = a;
    if (f > 1) {
      b: {
        f = e;
        g = a.length;
        e = [];
        b = z();
        for (let m = 0, p, u, y, x; m < l; m++) {
          for (n = 0; n < g; n++) {
            if (y = a[n], m < y.length && (p = y[m])) {
              for (h = 0; h < p.length; h++) {
                if (u = p[h], (k = b[u]) ? b[u]++ : (k = 0, b[u] = 1), x = e[k] || (e[k] = []), x.push(u), c && k === g - 1 && x.length - d === c) {
                  g = d ? x.slice(d) : x;
                  break b;
                }
              }
            }
          }
        }
        if (a = e.length) {
          if (f) {
            if (e.length > 1) {
              c: {
                for (a = [], l = z(), f = e.length, k = f - 1; k >= 0; k--) {
                  if (b = (f = e[k]) && f.length) {
                    for (n = 0; n < b; n++) {
                      if (g = f[n], !l[g]) {
                        if (l[g] = 1, d) {
                          d--;
                        } else {
                          if (a.push(g), a.length === c) {
                            break c;
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              a = (e = e[0]) && c && e.length > c || d ? e.slice(d, c + d) : e;
            }
            e = a;
          } else {
            if (a < g) {
              g = [];
              break b;
            }
            e = e[a - 1];
            if (c || d) {
              if (e.length > c || d) {
                e = e.slice(d, c + d);
              }
            }
          }
        }
        g = e;
      }
    } else if (f === 1) {
      c = I.call(null, a[0], c, d);
      break a;
    }
    c = g;
  }
  return c;
};
function O(a, c, b) {
  let f;
  b && (f = a.bidirectional && c > b) && (f = b, b = c, c = f);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;function J(a, c) {
  if (!this || this.constructor !== J) {
    return new J(a);
  }
  if (a) {
    var b = typeof a === "string" ? a : a.preset;
    b && (L[b] || console.warn("Preset not found: " + b), a = Object.assign({}, L[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const f = b === !0 ? {depth:1} : b || {}, d = a.encode || a.encoder || {};
  this.encoder = d.encode ? d : typeof d === "object" ? new F(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && b !== "default" && b !== "exact" && b || "strict";
  this.depth = b === "strict" && f.depth || 0;
  this.bidirectional = f.bidirectional !== !1;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  f && f.depth && this.tokenize !== "strict" && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.v = f.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
}
r = J.prototype;
r.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  return this;
};
r.append = function(a, c) {
  return this.add(a, c, !0);
};
r.contain = function(a) {
  return this.reg.has(a);
};
r.update = function(a, c) {
  const b = this, f = this.remove(a);
  return f && f.then ? f.then(() => b.add(a, c)) : this.add(a, c);
};
r.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  K(this.map);
  this.depth && K(this.ctx);
  return this;
};
z();
export default {Index:J, Charset:null, Encoder:F, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=J;export const  Charset=null;export const  Encoder=F;export const  Document=null;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};