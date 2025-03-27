/**!
 * FlexSearch.js v0.8.143 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var r;
function u(a, d, b) {
  const f = typeof b, c = typeof a;
  if ("undefined" !== f) {
    if ("undefined" !== c) {
      if (b) {
        if ("function" === c && f === c) {
          return function(h) {
            return a(b(h));
          };
        }
        d = a.constructor;
        if (d === b.constructor) {
          if (d === Array) {
            return b.concat(a);
          }
          if (d === Map) {
            var g = new Map(b);
            for (var e of a) {
              g.set(e[0], e[1]);
            }
            return g;
          }
          if (d === Set) {
            e = new Set(b);
            for (g of a.values()) {
              e.add(g);
            }
            return e;
          }
        }
      }
      return a;
    }
    return b;
  }
  return "undefined" === c ? d : a;
}
function w() {
  return Object.create(null);
}
;const y = /[^\p{L}\p{N}]+/u, z = /(\d{3})/g, B = /(\D)(\d{3})/g, D = /(\d{3})(\D)/g, E = /[\u0300-\u036f]/g;
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
  let d = a.include, b = d || a.exclude || a.split, f;
  if (b || "" === b) {
    if ("object" === typeof b && b.constructor !== RegExp) {
      let c = "";
      f = !d;
      d || (c += "\\p{Z}");
      b.letter && (c += "\\p{L}");
      b.number && (c += "\\p{N}", f = !!d);
      b.symbol && (c += "\\p{S}");
      b.punctuation && (c += "\\p{P}");
      b.control && (c += "\\p{C}");
      if (b = b.char) {
        c += "object" === typeof b ? b.join("") : b;
      }
      try {
        this.split = new RegExp("[" + (d ? "^" : "") + c + "]+", "u");
      } catch (g) {
        console.error("Your split configuration:", b, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = b, f = !1 === b || 2 > "a1a".split(b).length;
    }
    this.numeric = u(a.numeric, f);
  } else {
    try {
      this.split = u(this.split, y);
    } catch (c) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = u(a.numeric, u(this.numeric, !0));
  }
  this.prepare = u(a.prepare, null, this.prepare);
  this.finalize = u(a.finalize, null, this.finalize);
  b = a.filter;
  this.filter = "function" === typeof b ? b : u(b && new Set(b), null, this.filter);
  this.dedupe = u(a.dedupe, !1, this.dedupe);
  this.matcher = u((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = u((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = u((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = u(a.replacer, null, this.replacer);
  this.minlength = u(a.minlength, 1, this.minlength);
  this.maxlength = u(a.maxlength, 0, this.maxlength);
  this.rtl = u(a.rtl, !1, this.rtl);
  if (this.cache = b = u(a.cache, !0, this.cache)) {
    this.l = null, this.A = "number" === typeof b ? b : 2e5, this.i = new Map(), this.j = new Map(), this.o = this.m = 128;
  }
  this.g = "";
  this.s = null;
  this.h = "";
  this.u = null;
  if (this.matcher) {
    for (const c of this.matcher.keys()) {
      this.g += (this.g ? "|" : "") + c;
    }
  }
  if (this.stemmer) {
    for (const c of this.stemmer.keys()) {
      this.h += (this.h ? "|" : "") + c;
    }
  }
  return this;
};
r.addStemmer = function(a, d) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, d);
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
r.addMapper = function(a, d) {
  if ("object" === typeof a) {
    return this.addReplacer(a, d);
  }
  if (1 < a.length) {
    return this.addMatcher(a, d);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, d);
  this.cache && G(this);
  return this;
};
r.addMatcher = function(a, d) {
  if ("object" === typeof a) {
    return this.addReplacer(a, d);
  }
  if (2 > a.length && (this.dedupe || this.mapper)) {
    return this.addMapper(a, d);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, d);
  this.g += (this.g ? "|" : "") + a;
  this.s = null;
  this.cache && G(this);
  return this;
};
r.addReplacer = function(a, d) {
  if ("string" === typeof a) {
    return this.addMatcher(a, d);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, d);
  this.cache && G(this);
  return this;
};
r.encode = function(a) {
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
  this.numeric && 3 < a.length && (a = a.replace(B, "$1 $2").replace(D, "$1 $2").replace(z, "$1 "));
  const d = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let b = [], f = this.split || "" === this.split ? a.split(this.split) : a;
  for (let g = 0, e, h; g < f.length; g++) {
    if ((e = h = f[g]) && !(e.length < this.minlength)) {
      if (d) {
        b.push(e);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(e) : !this.filter.has(e))) {
          if (this.cache && e.length <= this.o) {
            if (this.l) {
              var c = this.j.get(e);
              if (c || "" === c) {
                c && b.push(c);
                continue;
              }
            } else {
              this.l = setTimeout(G, 50, this);
            }
          }
          this.stemmer && 2 < e.length && (this.u || (this.u = new RegExp("(?!^)(" + this.h + ")$")), c = e, e = e.replace(this.u, k => this.stemmer.get(k)), c !== e && this.filter && e.length >= this.minlength && ("function" === typeof this.filter ? !this.filter(e) : this.filter.has(e)) && (e = ""));
          if (e && (this.mapper || this.dedupe && 1 < e.length)) {
            c = "";
            for (let k = 0, n = "", m, v; k < e.length; k++) {
              m = e.charAt(k), m === n && this.dedupe || ((v = this.mapper && this.mapper.get(m)) || "" === v ? v === n && this.dedupe || !(n = v) || (c += v) : c += n = m);
            }
            e = c;
          }
          this.matcher && 1 < e.length && (this.s || (this.s = new RegExp("(" + this.g + ")", "g")), e = e.replace(this.s, k => this.matcher.get(k)));
          if (e && this.replacer) {
            for (c = 0; e && c < this.replacer.length; c += 2) {
              e = e.replace(this.replacer[c], this.replacer[c + 1]);
            }
          }
          this.cache && h.length <= this.o && (this.j.set(h, e), this.j.size > this.A && (this.j.clear(), this.o = this.o / 1.1 | 0));
          e && b.push(e);
        }
      }
    }
  }
  this.finalize && (b = this.finalize(b) || b);
  this.cache && a.length <= this.m && (this.i.set(a, b), this.i.size > this.A && (this.i.clear(), this.m = this.m / 1.1 | 0));
  return b;
};
function G(a) {
  a.l = null;
  a.i.clear();
  a.j.clear();
}
;function H(a, d, b) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = b || a.length > d ? d ? a.slice(b, b + d) : a.slice(b) : a;
  }
  let f = [];
  for (let c = 0, g, e; c < a.length; c++) {
    if ((g = a[c]) && (e = g.length)) {
      if (b) {
        if (b >= e) {
          b -= e;
          continue;
        }
        b < e && (g = d ? g.slice(b, b + d) : g.slice(b), e = g.length, b = 0);
      }
      e > d && (g = g.slice(0, d), e = d);
      if (!f.length && e >= d) {
        return g;
      }
      f.push(g);
      d -= e;
      if (!d) {
        break;
      }
    }
  }
  return f = 1 < f.length ? [].concat.apply([], f) : f[0];
}
;w();
const I = {normalize:!0};
const J = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
K.prototype.add = function(a, d, b, f) {
  if (d && (a || 0 === a)) {
    if (!f && !b && this.reg.has(a)) {
      return this.update(a, d);
    }
    d = this.encoder.encode(d);
    if (f = d.length) {
      const n = w(), m = w(), v = this.depth, C = this.resolution;
      for (let p = 0; p < f; p++) {
        let l = d[this.rtl ? f - 1 - p : p];
        var c = l.length;
        if (c && (v || !m[l])) {
          var g = this.score ? this.score(d, l, p, null, 0) : L(C, f, p), e = "";
          switch(this.tokenize) {
            case "full":
              if (2 < c) {
                for (let q = 0, t; q < c; q++) {
                  for (g = c; g > q; g--) {
                    e = l.substring(q, g);
                    t = this.rtl ? c - 1 - q : q;
                    var h = this.score ? this.score(d, l, p, e, t) : L(C, f, p, c, t);
                    M(this, m, e, h, a, b);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < c) {
                for (h = c - 1; 0 < h; h--) {
                  e = l[this.rtl ? c - 1 - h : h] + e;
                  var k = this.score ? this.score(d, l, p, e, h) : L(C, f, p, c, h);
                  M(this, m, e, k, a, b);
                }
                e = "";
              }
            case "forward":
              if (1 < c) {
                for (h = 0; h < c; h++) {
                  e += l[this.rtl ? c - 1 - h : h], M(this, m, e, g, a, b);
                }
                break;
              }
            default:
              if (M(this, m, l, g, a, b), v && 1 < f && p < f - 1) {
                for (c = w(), e = this.v, g = l, h = Math.min(v + 1, this.rtl ? p + 1 : f - p), c[g] = 1, k = 1; k < h; k++) {
                  if ((l = d[this.rtl ? f - 1 - p - k : p + k]) && !c[l]) {
                    c[l] = 1;
                    const q = this.score ? this.score(d, g, p, l, k - 1) : L(e + (f / 2 > e ? 0 : 1), f, p, h - 1, k - 1), t = this.bidirectional && l > g;
                    M(this, n, t ? g : l, q, a, b, t ? l : g);
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
function M(a, d, b, f, c, g, e) {
  let h = e ? a.ctx : a.map, k;
  if (!d[b] || e && !(k = d[b])[e]) {
    e ? (d = k || (d[b] = w()), d[e] = 1, (k = h.get(e)) ? h = k : h.set(e, h = new Map())) : d[b] = 1, (k = h.get(b)) ? h = k : h.set(b, h = []), h = h[f] || (h[f] = []), g && h.includes(c) || (h.push(c), a.fastupdate && ((d = a.reg.get(c)) ? d.push(h) : a.reg.set(c, [h])));
  }
}
function L(a, d, b, f, c) {
  return b && 1 < a ? d + (f || 0) <= a ? b + (c || 0) : (a - 1) / (d + (f || 0)) * (b + (c || 0)) + 1 | 0 : 0;
}
;K.prototype.search = function(a, d, b) {
  b || (d || "object" !== typeof a ? "object" === typeof d && (b = d, d = 0) : (b = a, a = ""));
  var f = [], c = 0;
  if (b) {
    a = b.query || a;
    d = b.limit || d;
    c = b.offset || 0;
    var g = b.context;
    var e = b.suggest;
    var h = !0;
    var k = b.resolution;
  } else {
    h = !0;
  }
  a = this.encoder.encode(a);
  b = a.length;
  d = d || (h ? 100 : 0);
  if (1 === b) {
    return e = c, (c = N(this, a[0], "")) && c.length ? H.call(this, c, d, e) : [];
  }
  g = this.depth && !1 !== g;
  if (2 === b && g && !e) {
    return e = c, (c = N(this, a[0], a[1])) && c.length ? H.call(this, c, d, e) : [];
  }
  h = w();
  var n = 0;
  if (1 < b && g) {
    var m = a[0];
    n = 1;
  }
  k || 0 === k || (k = m ? this.v : this.resolution);
  for (let l, q; n < b; n++) {
    if ((q = a[n]) && !h[q]) {
      h[q] = 1;
      l = N(this, q, m);
      a: {
        g = l;
        var v = f, C = e, p = k;
        let t = [];
        if (g && g.length) {
          if (g.length <= p) {
            v.push(g);
            l = void 0;
            break a;
          }
          for (let x = 0, A; x < p; x++) {
            if (A = g[x]) {
              t[x] = A;
            }
          }
          if (t.length) {
            v.push(t);
            l = void 0;
            break a;
          }
        }
        l = C ? void 0 : t;
      }
      if (l) {
        f = l;
        break;
      }
      m && (e && l && f.length || (m = q));
    }
    e && m && n === b - 1 && !f.length && (k = this.resolution, m = "", n = -1, h = w());
  }
  a: {
    a = f;
    f = a.length;
    m = a;
    if (1 < f) {
      b: {
        f = e;
        m = a.length;
        e = [];
        b = w();
        for (let l = 0, q, t, x, A; l < k; l++) {
          for (n = 0; n < m; n++) {
            if (x = a[n], l < x.length && (q = x[l])) {
              for (g = 0; g < q.length; g++) {
                if (t = q[g], (h = b[t]) ? b[t]++ : (h = 0, b[t] = 1), A = e[h] || (e[h] = []), A.push(t), d && h === m - 1 && A.length - c === d) {
                  m = A;
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
                for (a = [], k = w(), f = e.length, h = f - 1; 0 <= h; h--) {
                  if (b = (f = e[h]) && f.length) {
                    for (n = 0; n < b; n++) {
                      if (m = f[n], !k[m]) {
                        if (k[m] = 1, c) {
                          c--;
                        } else {
                          if (a.push(m), a.length === d) {
                            break c;
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              a = (e = e[0]).length > d || c ? e.slice(c, d + c) : e;
            }
            e = a;
          } else {
            if (a < m) {
              m = [];
              break b;
            }
            e = e[a - 1];
            if (d || c) {
              if (e.length > d || c) {
                e = e.slice(c, d + c);
              }
            }
          }
        }
        m = e;
      }
    } else if (1 === f) {
      d = H.call(null, a[0], d, c);
      break a;
    }
    d = m;
  }
  return d;
};
function N(a, d, b) {
  let f;
  b && (f = a.bidirectional && d > b) && (f = b, b = d, d = f);
  a = b ? (a = a.ctx.get(b)) && a.get(d) : a.map.get(d);
  return a;
}
;K.prototype.remove = function(a, d) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let f = 0, c; f < b.length; f++) {
        if (c = b[f]) {
          if (2 > c.length) {
            c.pop();
          } else {
            const g = c.indexOf(a);
            g === b.length - 1 ? c.pop() : c.splice(g, 1);
          }
        }
      }
    } else {
      O(this.map, a), this.depth && O(this.ctx, a);
    }
    d || this.reg.delete(a);
  }
  return this;
};
function O(a, d) {
  let b = 0;
  if (a.constructor === Array) {
    for (let f = 0, c, g; f < a.length; f++) {
      if ((c = a[f]) && c.length) {
        if (g = c.indexOf(d), 0 <= g) {
          1 < c.length ? (c.splice(g, 1), b++) : delete a[f];
          break;
        } else {
          b++;
        }
      }
    }
  } else {
    for (let f of a.entries()) {
      const c = f[0], g = O(f[1], d);
      g ? b += g : a.delete(c);
    }
  }
  return b;
}
;function K(a, d) {
  if (!this || this.constructor !== K) {
    return new K(a);
  }
  if (a) {
    var b = "string" === typeof a ? a : a.preset;
    b && (J[b] || console.warn("Preset not found: " + b), a = Object.assign({}, J[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const f = !0 === b ? {depth:1} : b || {}, c = a.encode || a.encoder || I;
  this.encoder = c.encode ? c : "object" === typeof c ? new F(c) : {encode:c};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && "default" !== b && "exact" !== b && b || "strict";
  this.depth = "strict" === b && f.depth || 0;
  this.bidirectional = !1 !== f.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  f && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  this.map = new Map();
  this.ctx = new Map();
  this.reg = d || (this.fastupdate ? new Map() : new Set());
  this.v = f.resolution || 3;
  this.rtl = c.rtl || a.rtl || !1;
}
r = K.prototype;
r.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  return this;
};
r.append = function(a, d) {
  return this.add(a, d, !0);
};
r.contain = function(a) {
  return this.reg.has(a);
};
r.update = function(a, d) {
  const b = this, f = this.remove(a);
  return f && f.then ? f.then(() => b.add(a, d)) : this.add(a, d);
};
function P(a) {
  let d = 0;
  if (a.constructor === Array) {
    for (let b = 0, f; b < a.length; b++) {
      (f = a[b]) && (d += f.length);
    }
  } else {
    for (const b of a.entries()) {
      const f = b[0], c = P(b[1]);
      c ? d += c : a.delete(f);
    }
  }
  return d;
}
r.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  P(this.map);
  this.depth && P(this.ctx);
  return this;
};
w();
export default {Index:K, Charset:null, Encoder:F, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=K;export const  Charset=null;export const  Encoder=F;export const  Document=null;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};