/**!
 * FlexSearch.js v0.8.201 (Light/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var r;
function u(a, c, b) {
  const f = typeof b, d = typeof a;
  if ("undefined" !== f) {
    if ("undefined" !== d) {
      if (b) {
        if ("function" === d && f === d) {
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
  return "undefined" === d ? c : a;
}
function x() {
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
  this.normalize = u(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split, f;
  if (b || "" === b) {
    if ("object" === typeof b && b.constructor !== RegExp) {
      let d = "";
      f = !c;
      c || (d += "\\p{Z}");
      b.letter && (d += "\\p{L}");
      b.number && (d += "\\p{N}", f = !!c);
      b.symbol && (d += "\\p{S}");
      b.punctuation && (d += "\\p{P}");
      b.control && (d += "\\p{C}");
      if (b = b.char) {
        d += "object" === typeof b ? b.join("") : b;
      }
      try {
        this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
      } catch (h) {
        console.error("Your split configuration:", b, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = b, f = !1 === b || 2 > "a1a".split(b).length;
    }
    this.numeric = u(a.numeric, f);
  } else {
    try {
      this.split = u(this.split, A);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = u(a.numeric, u(this.numeric, !0));
  }
  this.prepare = u(a.prepare, null, this.prepare);
  this.finalize = u(a.finalize, null, this.finalize);
  b = a.filter;
  this.filter = "function" === typeof b ? b : u(b && new Set(b), null, this.filter);
  this.dedupe = u(a.dedupe, !0, this.dedupe);
  this.matcher = u((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = u((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = u((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = u(a.replacer, null, this.replacer);
  this.minlength = u(a.minlength, 1, this.minlength);
  this.maxlength = u(a.maxlength, 1024, this.maxlength);
  this.rtl = u(a.rtl, !1, this.rtl);
  if (this.cache = b = u(a.cache, !0, this.cache)) {
    this.l = null, this.A = "number" === typeof b ? b : 2e5, this.i = new Map(), this.j = new Map(), this.o = this.m = 128;
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
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && G(this);
  return this;
};
r.addMapper = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (1 < a.length) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && G(this);
  return this;
};
r.addMatcher = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (2 > a.length && (this.dedupe || this.mapper)) {
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
  if ("string" === typeof a) {
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
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = E ? a.normalize("NFKD").replace(E, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(C, "$1 $2").replace(D, "$1 $2").replace(B, "$1 "));
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let f = [], d = x(), h, e, k = this.split || "" === this.split ? a.split(this.split) : [a];
  for (let n = 0, g, w; n < k.length; n++) {
    if ((g = w = k[n]) && !(g.length < this.minlength || g.length > this.maxlength)) {
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
        if (!this.filter || ("function" === typeof this.filter ? this.filter(g) : !this.filter.has(g))) {
          if (this.cache && g.length <= this.o) {
            if (this.l) {
              var l = this.j.get(g);
              if (l || "" === l) {
                l && f.push(l);
                continue;
              }
            } else {
              this.l = setTimeout(G, 50, this);
            }
          }
          if (this.stemmer) {
            this.u || (this.u = new RegExp("(?!^)(" + this.h + ")$"));
            let v;
            for (; v !== g && 2 < g.length;) {
              v = g, g = g.replace(this.u, p => this.stemmer.get(p));
            }
          }
          if (g && (this.mapper || this.dedupe && 1 < g.length)) {
            l = "";
            for (let v = 0, p = "", m, q; v < g.length; v++) {
              m = g.charAt(v), m === p && this.dedupe || ((q = this.mapper && this.mapper.get(m)) || "" === q ? q === p && this.dedupe || !(p = q) || (l += q) : l += p = m);
            }
            g = l;
          }
          this.matcher && 1 < g.length && (this.s || (this.s = new RegExp("(" + this.g + ")", "g")), g = g.replace(this.s, v => this.matcher.get(v)));
          if (g && this.replacer) {
            for (l = 0; g && l < this.replacer.length; l += 2) {
              g = g.replace(this.replacer[l], this.replacer[l + 1]);
            }
          }
          this.cache && w.length <= this.o && (this.j.set(w, g), this.j.size > this.A && (this.j.clear(), this.o = this.o / 1.1 | 0));
          if (g) {
            if (g !== w) {
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
;function H(a, c, b) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
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
  return f = 1 < f.length ? [].concat.apply([], f) : f[0];
}
;x();
I.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let f = 0, d, h; f < b.length; f++) {
        if ((d = b[f]) && (h = d.length)) {
          if (d[h - 1] === a) {
            d.pop();
          } else {
            const e = d.indexOf(a);
            0 <= e && d.splice(e, 1);
          }
        }
      }
    } else {
      J(this.map, a), this.depth && J(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  return this;
};
function J(a, c) {
  let b = 0;
  var f = "undefined" === typeof c;
  if (a.constructor === Array) {
    for (let d = 0, h, e, k; d < a.length; d++) {
      if ((h = a[d]) && h.length) {
        if (f) {
          return 1;
        }
        e = h.indexOf(c);
        if (0 <= e) {
          if (1 < h.length) {
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
      f = d[0], J(d[1], c) ? b++ : a.delete(f);
    }
  }
  return b;
}
;const K = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
I.prototype.add = function(a, c, b, f) {
  if (c && (a || 0 === a)) {
    if (!f && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    f = this.depth;
    c = this.encoder.encode(c, !f);
    const n = c.length;
    if (n) {
      const g = x(), w = x(), v = this.resolution;
      for (let p = 0; p < n; p++) {
        let m = c[this.rtl ? n - 1 - p : p];
        var d = m.length;
        if (d && (f || !w[m])) {
          var h = this.score ? this.score(c, m, p, null, 0) : L(v, n, p), e = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (let q = 0, t; q < d; q++) {
                  for (h = d; h > q; h--) {
                    e = m.substring(q, h);
                    t = this.rtl ? d - 1 - q : q;
                    var k = this.score ? this.score(c, m, p, e, t) : L(v, n, p, d, t);
                    M(this, w, e, k, a, b);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < d) {
                for (k = d - 1; 0 < k; k--) {
                  e = m[this.rtl ? d - 1 - k : k] + e;
                  var l = this.score ? this.score(c, m, p, e, k) : L(v, n, p, d, k);
                  M(this, w, e, l, a, b);
                }
                e = "";
              }
            case "forward":
              if (1 < d) {
                for (k = 0; k < d; k++) {
                  e += m[this.rtl ? d - 1 - k : k], M(this, w, e, h, a, b);
                }
                break;
              }
            default:
              if (M(this, w, m, h, a, b), f && 1 < n && p < n - 1) {
                for (d = x(), e = this.v, h = m, k = Math.min(f + 1, this.rtl ? p + 1 : n - p), d[h] = 1, l = 1; l < k; l++) {
                  if ((m = c[this.rtl ? n - 1 - p - l : p + l]) && !d[m]) {
                    d[m] = 1;
                    const q = this.score ? this.score(c, h, p, m, l - 1) : L(e + (n / 2 > e ? 0 : 1), n, p, k - 1, l - 1), t = this.bidirectional && m > h;
                    M(this, g, t ? h : m, q, a, b, t ? m : h);
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
function M(a, c, b, f, d, h, e) {
  let k = e ? a.ctx : a.map, l;
  if (!c[b] || e && !(l = c[b])[e]) {
    e ? (c = l || (c[b] = x()), c[e] = 1, (l = k.get(e)) ? k = l : k.set(e, k = new Map())) : c[b] = 1, (l = k.get(b)) ? k = l : k.set(b, k = []), k = k[f] || (k[f] = []), h && k.includes(d) || (k.push(d), a.fastupdate && ((c = a.reg.get(d)) ? c.push(k) : a.reg.set(d, [k])));
  }
}
function L(a, c, b, f, d) {
  return b && 1 < a ? c + (f || 0) <= a ? b + (d || 0) : (a - 1) / (c + (f || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;I.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
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
  "undefined" === typeof k && (k = !0);
  h = this.depth && !1 !== h;
  a = this.encoder.encode(a, !h);
  b = a.length;
  c = c || (k ? 100 : 0);
  if (1 === b) {
    return e = d, (d = N(this, a[0], "")) && d.length ? H.call(this, d, c, e) : [];
  }
  if (2 === b && h && !e) {
    return e = d, (d = N(this, a[1], a[0])) && d.length ? H.call(this, d, c, e) : [];
  }
  k = x();
  var n = 0;
  if (h) {
    var g = a[0];
    n = 1;
  }
  l || 0 === l || (l = g ? this.v : this.resolution);
  for (let m, q; n < b; n++) {
    if ((q = a[n]) && !k[q]) {
      k[q] = 1;
      m = N(this, q, g);
      a: {
        h = m;
        var w = f, v = e, p = l;
        let t = [];
        if (h && h.length) {
          if (h.length <= p) {
            w.push(h);
            m = void 0;
            break a;
          }
          for (let y = 0, z; y < p; y++) {
            if (z = h[y]) {
              t[y] = z;
            }
          }
          if (t.length) {
            w.push(t);
            m = void 0;
            break a;
          }
        }
        m = v ? void 0 : t;
      }
      if (m) {
        f = m;
        break;
      }
      g && (e && m && f.length || (g = q));
    }
    e && g && n === b - 1 && !f.length && (l = this.resolution, g = "", n = -1, k = x());
  }
  a: {
    a = f;
    f = a.length;
    g = a;
    if (1 < f) {
      b: {
        f = e;
        g = a.length;
        e = [];
        b = x();
        for (let m = 0, q, t, y, z; m < l; m++) {
          for (n = 0; n < g; n++) {
            if (y = a[n], m < y.length && (q = y[m])) {
              for (h = 0; h < q.length; h++) {
                if (t = q[h], (k = b[t]) ? b[t]++ : (k = 0, b[t] = 1), z = e[k] || (e[k] = []), z.push(t), c && k === g - 1 && z.length - d === c) {
                  g = d ? z.slice(d) : z;
                  break b;
                }
              }
            }
          }
        }
        if (a = e.length) {
          if (f) {
            if (1 < e.length) {
              c: {
                for (a = [], l = x(), f = e.length, k = f - 1; 0 <= k; k--) {
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
    } else if (1 === f) {
      c = H.call(null, a[0], c, d);
      break a;
    }
    c = g;
  }
  return c;
};
function N(a, c, b) {
  let f;
  b && (f = a.bidirectional && c > b) && (f = b, b = c, c = f);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;function I(a, c) {
  if (!this || this.constructor !== I) {
    return new I(a);
  }
  if (a) {
    var b = "string" === typeof a ? a : a.preset;
    b && (K[b] || console.warn("Preset not found: " + b), a = Object.assign({}, K[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const f = !0 === b ? {depth:1} : b || {}, d = a.encode || a.encoder || {};
  this.encoder = d.encode ? d : "object" === typeof d ? new F(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && "default" !== b && "exact" !== b && b || "strict";
  this.depth = "strict" === b && f.depth || 0;
  this.bidirectional = !1 !== f.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  f && f.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.v = f.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
}
r = I.prototype;
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
  J(this.map);
  this.depth && J(this.ctx);
  return this;
};
x();
const O = {Index:I, Charset:null, Encoder:F, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, P = "undefined" !== typeof self ? self : "undefined" !== typeof global ? global : self;
let Q;
(Q = P.define) && Q.amd ? Q([], function() {
  return O;
}) : "object" === typeof P.exports ? P.exports = O : P.FlexSearch = O;
}(this||self));
