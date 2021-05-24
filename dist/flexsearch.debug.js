/**!
 * FlexSearch.js v0.7.0-beta (Debug)
 * Copyright 2019 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
const aa = /[\W_]+/;
function ba(a) {
  return this.pipeline(a.toLowerCase(), !1, aa, !1);
}
;function v(a, b) {
  return "undefined" !== typeof a ? a : b;
}
function x(a) {
  const b = Array(a);
  for (let c = 0; c < a; c++) {
    b[c] = y();
  }
  return b;
}
function y() {
  return Object.create(null);
}
function ca(a, b) {
  return b.length - a.length;
}
function z(a) {
  return "string" === typeof a;
}
function A(a) {
  return "object" === typeof a;
}
function B(a) {
  return "function" === typeof a;
}
;function C(a, b) {
  const c = Object.keys(a), d = c.length, e = [];
  let f = "", g = 0;
  for (let k = 0, h, l; k < d; k++) {
    h = c[k], (l = a[h]) ? (e[g++] = new RegExp(b ? "(?!\\b)" + h + "(\\b|_)" : h, "g"), e[g++] = l) : f += (f ? "|" : "") + h;
  }
  f && (e[g++] = new RegExp(b ? "(?!\\b)(" + f + ")(\\b|_)" : "(" + f + ")", "g"), e[g] = "");
  return e;
}
function D(a, b) {
  for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
;const G = {}, H = {};
let I = Promise;
function J(a) {
  M(a, "add");
  M(a, "append");
  M(a, "search");
  M(a, "update");
  M(a, "remove");
}
function M(a, b) {
  a[b + "Async"] = function() {
    const c = this, d = arguments;
    var e = d[d.length - 1];
    let f;
    B(e) && (f = e, delete d[d.length - 1]);
    e = new I(function(g) {
      setTimeout(function() {
        c.async = !0;
        g(c[b].apply(c, d));
        c.async = !1;
      });
    });
    return f ? (e.then(f), this) : e;
  };
}
;function da(a, b, c, d) {
  var e = a.length;
  let f = [], g, k = 0;
  d && (d = []);
  for (--e; 0 <= e; e--) {
    const h = a[e], l = h.length, n = y();
    let q = !g;
    for (let r = 0; r < l; r++) {
      const p = h[r], t = p.length;
      if (t) {
        for (let m = 0, u = 0, w; m < t; m++) {
          if (w = p[m], !g) {
            n[w] = 1;
          } else {
            if (g[w]) {
              if (e) {
                d && u < b && ((d[r] || (d[r] = []))[u++] = w), n[w] = 1;
              } else {
                if (c) {
                  c--;
                } else {
                  if (f[k++] = w, k === b) {
                    return f;
                  }
                }
              }
              q = !0;
            }
          }
        }
      }
    }
    if (!q && !d) {
      return [];
    }
    g = n;
  }
  if (d) {
    for (let h = d.length - 1, l, n; 0 <= h; h--) {
      if ((n = (l = d[h]) && l.length) && c && (n <= c ? (c -= n, n = 0) : n -= c), n) {
        if (k + n >= b) {
          return f.concat(l.slice(c, b - k + c));
        }
        f = f.concat(c ? l.slice(c) : l);
        k += n;
        c = 0;
      }
    }
  }
  return f;
}
function ea(a, b) {
  const c = y(), d = y(), e = [];
  for (let f = 0; f < a.length; f++) {
    c[a[f]] = 1;
  }
  for (let f = 0, g; f < b.length; f++) {
    g = b[f];
    for (let k = 0, h; k < g.length; k++) {
      h = g[k], c[h] && !d[h] && (d[h] = 1, e[e.length] = h);
    }
  }
  return e;
}
;function N(a) {
  this.limit = !0 !== a && a;
  this.cache = y();
  this.queue = [];
}
function fa(a, b, c) {
  A(a) && (a = a.query);
  let d = this.cache.get(a);
  d || (d = this.search(a, b, c), this.cache.set(a, d));
  return d;
}
N.prototype.set = function(a, b) {
  if (!this.cache[a]) {
    var c = this.queue.length;
    c === this.limit ? delete this.cache[this.queue[c - 1]] : c++;
    for (--c; 0 < c; c--) {
      this.queue[c] = this.queue[c - 1];
    }
    this.queue[0] = a;
  }
  this.cache[a] = b;
};
N.prototype.get = function(a) {
  const b = this.cache[a];
  if (this.limit && b && (a = this.queue.indexOf(a))) {
    const c = this.queue[a - 1];
    this.queue[a - 1] = this.queue[a];
    this.queue[a] = c;
  }
  return b;
};
N.prototype.del = function(a) {
  for (let b = 0, c, d; b < this.queue.length; b++) {
    d = this.queue[b], c = this.cache[d], -1 !== c.indexOf(a) && (this.queue.splice(b--, 1), delete this.cache[d]);
  }
};
const ha = {memory:{charset:"latin:extra", resolution:3, minlength:3, fastupdate:!1, optimize:"memory"}, performance:{threshold:8, minlength:3, context:{depth:1, bidirectional:!0}}, match:{charset:"latin:extra", tokenize:"full", resolution:3, }, score:{charset:"latin:advanced", threshold:1, context:{depth:3, bidirectional:!0}}, "default":{resolution:3, threshold:0, depth:3}, };
function ka(a, b, c, d, e, f) {
  setTimeout(function() {
    const g = a(c, JSON.stringify(f));
    g && g.then ? g.then(function() {
      b.export(a, b, c, d, e + 1);
    }) : b.export(a, b, c, d, e + 1);
  });
}
;function O(a, b) {
  if (!(this instanceof O)) {
    return new O(a);
  }
  var c;
  if (a) {
    if (z(a)) {
      ha[a] || console.warn("Preset not found: " + a), a = ha[a];
    } else {
      if (c = a.preset) {
        c[c] || console.warn("Preset not found: " + c), a = Object.assign({}, c[c], a);
      }
    }
    c = a.charset;
    var d = a.lang;
    z(c) && (-1 === c.indexOf(":") && (c += ":default"), c = H[c]);
    z(d) && (d = G[d]);
  } else {
    a = {};
  }
  let e, f, g, k = a.context || {};
  this.encode = a.encode || c && c.encode || ba;
  this.register = b || y();
  e = a.resolution || 9;
  f = a.threshold || 0;
  f >= e && (f = e - 1);
  this.resolution = e;
  this.threshold = f;
  this.tokenizer = b = c && c.tokenize || a.tokenize || "strict";
  this.depth = "strict" === b && k.depth;
  this.bidirectional = v(k.bidirectional, !0);
  this.optimize = g = "memory" === a.optimize;
  this.fastupdate = v(a.fastupdate, !0);
  this.minlength = a.minlength || 1;
  this.map = g ? x(e - f) : y();
  e = k.resolution || e;
  f = k.threshold || f;
  f >= e && (f = e - 1);
  this.resolution_ctx = e;
  this.threshold_ctx = f;
  this.ctx = g ? x(e - f) : y();
  this.rtl = c && c.rtl || a.rtl;
  this.matcher = (b = a.matcher || d && d.matcher) && C(b, !1);
  this.stemmer = (b = a.stemmer || d && d.stemmer) && C(b, !0);
  if (c = b = a.filter || d && d.filter) {
    c = b;
    d = y();
    for (let h = 0, l = c.length; h < l; h++) {
      d[c[h]] = 1;
    }
    c = d;
  }
  this.filter = c;
  this.cache = (b = a.cache) && new N(b);
}
O.prototype.pipeline = function(a, b, c, d) {
  if (a) {
    b && a && (a = D(a, b));
    a && this.matcher && (a = D(a, this.matcher));
    this.stemmer && 1 < a.length && (a = D(a, this.stemmer));
    if (d && 1 < a.length) {
      d = b = "";
      for (let e = 0, f = a.length, g; e < f; e++) {
        (g = a[e]) !== d && (b += d = g);
      }
      a = b;
    }
    if (a && (c || "" === c)) {
      a = a.split(c);
      if (this.filter) {
        c = this.filter;
        b = a.length;
        d = [];
        for (let e = 0, f = 0; e < b; e++) {
          const g = a[e];
          g && !c[g] && (d[f++] = g);
        }
        a = d;
      }
      return a;
    }
  }
  return a;
};
O.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
O.prototype.add = function(a, b, c) {
  if (this.register[a] && !c) {
    return this.update(a, b);
  }
  if (b && (a || 0 === a)) {
    b = this.encode(b);
    const l = b.length;
    if (l) {
      const n = this.depth, q = this.resolution - this.threshold, r = y(), p = y();
      for (let t = 0; t < l; t++) {
        let m = b[this.rtl ? l - 1 - t : t];
        var d = m.length;
        if (m && d >= this.minlength && (n || !r[m])) {
          var e = Math.min(this.resolution / l * t | 0, t);
          if (e < q) {
            var f = "";
            switch(this.tokenizer) {
              case "full":
                if (3 < d) {
                  for (var g = 0; g < d; g++) {
                    var k = g ? Math.min(e / 2 + this.resolution / d * g / 2 | 0, e + g) : e;
                    if (k < q) {
                      for (var h = d; h > g; h--) {
                        f = m.substring(g, h), f.length >= this.minlength && this.push_index(r, f, k, a, c);
                      }
                    }
                  }
                  break;
                }
              case "reverse":
                if (2 < d) {
                  for (g = d - 1; 0 < g; g--) {
                    f = m[g] + f, f.length >= this.minlength && this.push_index(r, f, e, a, c);
                  }
                  f = "";
                }
              case "forward":
                if (1 < d) {
                  for (g = 0; g < d; g++) {
                    f += m[g], f.length >= this.minlength && this.push_index(r, f, e, a, c);
                  }
                }
                break;
              default:
                if (this.push_index(r, m, e, a, c), n && 1 < l && t < l - 1) {
                  for (d = this.resolution_ctx - this.threshold_ctx, e = y(), f = m, g = Math.min(n + 1, l - t), e[f] = 1, k = 1; k < g; k++) {
                    if ((m = b[this.rtl ? l - 1 - t - k : t + k]) && m.length >= this.minlength && !e[m]) {
                      if (e[m] = 1, h = Math.min((this.resolution_ctx - g) / l * t + k | 0, t + (k - 1)), h < d) {
                        const u = this.bidirectional && m > f;
                        this.push_index(p, u ? f : m, h, a, c, u ? m : f);
                      }
                    } else {
                      g = Math.min(g + 1, l - t);
                    }
                  }
                }
            }
          }
        }
      }
      this.fastupdate || (this.register[a] = 1);
    }
  }
  return this;
};
O.prototype.push_index = function(a, b, c, d, e, f) {
  let g = f ? this.ctx : this.map;
  if (!a[b] || f && !a[b][f]) {
    this.optimize && (g = g[c]), f ? (a = a[b] || (a[b] = y()), a[f] = 1, g = g[f] || (g[f] = y())) : a[b] = 1, g = g[b] || (g[b] = []), this.optimize || (g = g[c] || (g[c] = [])), e && -1 !== g.indexOf(d) || (g[g.length] = d, this.fastupdate && (a = this.register[d] || (this.register[d] = []), a[a.length] = g));
  }
};
O.prototype.search = function(a, b, c) {
  A(a) ? (c = a, a = c.query) : A(b) && (c = b);
  let d = [], e;
  var f = this.threshold;
  let g, k = 0;
  if (c) {
    b = c.limit;
    k = c.offset || 0;
    f = v(c.threshold, f);
    var h = c.context;
    g = c.suggest;
  }
  if (a && (a = this.encode(a), e = a.length, 1 < e)) {
    c = y();
    var l = [];
    for (let q = 0, r = 0, p; q < e; q++) {
      if ((p = a[q]) && p.length >= this.minlength && !c[p]) {
        if (this.optimize || g || this.map[p]) {
          l[r++] = p, c[p] = 1;
        } else {
          return d;
        }
      }
    }
    a = l;
    e = a.length;
  }
  if (!e) {
    return d;
  }
  b || (b = 100);
  c = this.resolution - f;
  f = this.resolution_ctx - f;
  h = this.depth && 1 < e && !1 !== h;
  l = 0;
  let n;
  h ? (n = a[0], l = 1) : 1 < e && a.sort(ca);
  for (let q, r; l < e; l++) {
    r = a[l];
    h ? (q = this.add_result(d, g, f, b, k, 2 === e, r, n), g && !1 === q && d.length || (n = r)) : q = this.add_result(d, g, c, b, k, 1 === e, r);
    if (q) {
      return q;
    }
    if (g && l === e - 1) {
      let p = d.length;
      if (!p) {
        if (h) {
          h = 0;
          l = -1;
          continue;
        }
        return d;
      }
      if (1 === p) {
        return la(d[0], b, k);
      }
    }
  }
  return da(d, b, k, g);
};
O.prototype.add_result = function(a, b, c, d, e, f, g, k) {
  let h = [], l = k ? this.ctx : this.map;
  this.optimize || (l = ma(l, g, k, this.bidirectional));
  if (l) {
    let n = 0;
    c = Math.min(l.length, c);
    for (let q = 0, r = 0, p, t; q < c && !(p = l[q], this.optimize && (p = ma(p, g, k, this.bidirectional)), p && f && (t = p.length, t <= e ? (e -= t, p = null) : e && (p = p.slice(e), e = 0)), p && (h[n++] = p, f && (r += p.length, r >= d))); q++) {
    }
    if (n) {
      if (f) {
        return la(h, d, 0);
      }
      a[a.length] = h;
      return;
    }
  }
  return !b && h;
};
function la(a, b, c) {
  a = 1 === a.length ? a[0] : [].concat.apply([], a);
  return c || a.length > b ? a.slice(c, c + b) : a;
}
function ma(a, b, c, d) {
  c ? (d = d && b > c, a = (a = a[d ? b : c]) && a[d ? c : b]) : a = a[b];
  return a;
}
O.prototype.contain = function(a) {
  return !!this.register[a];
};
O.prototype.update = function(a, b) {
  return this.remove(a).add(a, b);
};
O.prototype.remove = function(a, b) {
  const c = this.register[a];
  if (c) {
    if (this.fastupdate) {
      for (let d = 0, e; d < c.length; d++) {
        e = c[d], e.splice(e.indexOf(a), 1);
      }
    } else {
      P(this.map, a, this.resolution - this.threshold, this.optimize), this.depth && P(this.ctx, a, this.resolution_ctx - this.threshold_ctx, this.optimize);
    }
    b || delete this.register[a];
    this.cache && this.cache.del(a);
  }
  return this;
};
function P(a, b, c, d, e) {
  let f = 0;
  if (a.constructor === Array) {
    if (e) {
      b = a.indexOf(b), -1 !== b ? 1 < a.length && (a.splice(b, 1), f++) : f++;
    } else {
      e = Math.min(a.length, c);
      for (let g = 0, k; g < e; g++) {
        if (k = a[g]) {
          f = P(k, b, c, d, e), d || f || delete a[g];
        }
      }
    }
  } else {
    for (let g in a) {
      (f = P(a[g], b, c, d, e)) || delete a[g];
    }
  }
  return f;
}
O.prototype.searchCache = fa;
O.prototype.export = function(a, b, c, d, e) {
  let f, g;
  switch(e || (e = 0)) {
    case 0:
      f = "reg";
      if (this.fastupdate) {
        g = y();
        for (let k in this.register) {
          g[k] = 1;
        }
      } else {
        g = this.register;
      }
      break;
    case 1:
      f = "cfg";
      g = {doc:0, opt:this.optimize ? 1 : 0};
      break;
    case 2:
      f = "map";
      g = this.map;
      break;
    case 3:
      f = "ctx";
      g = this.ctx;
      break;
    default:
      return;
  }
  ka(a, b || this, c ? c + "." + f : f, d, e, g);
  return !0;
};
O.prototype.import = function(a, b) {
  if (b) {
    switch(z(b) && (b = JSON.parse(b)), a) {
      case "cfg":
        this.optimize = !!b.opt;
        break;
      case "reg":
        this.fastupdate = !1;
        this.register = b;
        break;
      case "map":
        this.map = b;
        break;
      case "ctx":
        this.ctx = b;
    }
  }
};
J(O.prototype);
function na(a) {
  var b = self._index;
  a = a.data;
  var c = a.args;
  const d = a.task;
  switch(d) {
    case "init":
      b = a.options || {};
      a = a.factory;
      c = b.encode;
      b.cache = !1;
      c && 0 === c.indexOf("function") && (b.encode = Function("return " + c)());
      a ? (Function("return " + a)()(self), self._index = new self.FlexSearch.Index(b), delete self.FlexSearch) : self._index = new O(b);
      break;
    case "search":
      b = b.search.apply(b, c);
      postMessage(b);
      break;
    default:
      b[d].apply(b, c);
  }
}
;function Q(a, b) {
  var c;
  A(a) ? b = a : b ? B(c = b.encode) && (b.encode = c.toString()) : b = {};
  (a = (self || window)._factory) && (a = a.toString());
  c = self.exports;
  if (this.worker = oa(a, c)) {
    this.resolver = null;
    var d = this;
    if (c) {
      this.worker.on("message", function(e) {
        d.resolver(e);
      });
    } else {
      this.worker.onmessage = function(e) {
        d.resolver(e.data);
      };
    }
    this.worker.postMessage({task:"init", factory:a, options:b});
  }
}
S("add");
S("append");
S("search");
S("update");
S("remove");
function S(a) {
  Q.prototype[a] = Q.prototype[a + "Async"] = function() {
    const b = this, c = [].slice.call(arguments);
    var d = c[c.length - 1];
    let e;
    B(d) && (e = d, c.splice(c.length - 1, 1));
    d = new I(function(f) {
      setTimeout(function() {
        b.worker.postMessage({task:a, args:c});
        "search" === a ? b.resolver = f : f();
      });
    });
    return e ? (d.then(e), this) : d;
  };
}
function oa(a, b) {
  let c;
  try {
    c = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + na.toString()], {type:"text/javascript"}))) : new Worker("worker.js", {type:"module"});
  } catch (d) {
  }
  return c;
}
;function T(a) {
  if (!(this instanceof T)) {
    return new T(a);
  }
  var b;
  a || (a = {});
  this.tree = [];
  this.field = [];
  this.marker = [];
  this.register = y();
  this.key = (b = a.key) && U(b, this.marker) || "id";
  this.fastupdate = v(a.fastupdate, !0);
  this.extern = !!(b = a.extern);
  this.storetree = !this.extern && (b = a.store) && !0 !== b && [];
  this.store = b && (this.extern ? b : y());
  this.tag = (b = a.tag) && U(b, this.marker);
  this.tagindex = b && y();
  this.cache = (b = a.cache) && new N(b);
  a.cache = !1;
  this.worker = a.worker;
  this.async = !1;
  b = a;
  a = y();
  let c = b.doc;
  if (z(c)) {
    c = [c];
  } else {
    if (c.constructor !== Array) {
      var d = c;
      c = Object.keys(c);
    }
  }
  for (let e = 0, f, g; e < c.length; e++) {
    f = c[e], z(f) ? d && (g = d[f]) : (g = f, f = f.field), g = A(g) ? Object.assign({}, b, g) : b, this.worker && (a[f] = new Q(g), a[f].worker || (this.worker = !1)), this.worker || (a[f] = new O(g, this.register)), this.tree[e] = U(f, this.marker), this.field[e] = f;
  }
  if (this.storetree) {
    for (d = b.store, z(d) && (d = [d]), b = 0; b < d.length; b++) {
      this.storetree[b] = U(d[b], this.marker);
    }
  }
  this.index = a;
}
function U(a, b) {
  const c = a.split(":");
  let d = 0;
  for (let e = 0; e < c.length; e++) {
    a = c[e], 0 <= a.indexOf("[]") && (a = a.substring(0, a.length - 2)) && (b[d] = !0), a && (c[d++] = a);
  }
  d < c.length && (c.length = d);
  return 1 < d ? c : c[0];
}
function pa(a, b) {
  if (z(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function V(a, b, c, d, e) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = a;
  } else {
    if (a) {
      if (a.constructor === Array) {
        for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
          V(a, b, c, d, e);
        }
      } else {
        b = b[e] || (b[e] = y()), e = c[++d], V(a, b, c, d, e);
      }
    }
  }
}
function W(a, b, c, d, e, f, g, k) {
  a = a[g];
  if (d === b.length - 1) {
    if (a.constructor === Array) {
      if (c[d]) {
        for (b = 0; b < a.length; b++) {
          e.add(f, a[b], !0);
        }
        return;
      }
      a = a.join(" ");
    }
    e.add(f, a, k);
  } else {
    if (a) {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          W(a, b, c, d, e, f, g, k);
        }
      } else {
        g = b[++d], W(a, b, c, d, e, f, g, k);
      }
    }
  }
}
T.prototype.add = function(a, b, c) {
  A(a) && (b = a, a = pa(b, this.key));
  if (b && (a || 0 === a)) {
    if (this.register[a]) {
      return this.update(a, b);
    }
    for (let d = 0, e, f; d < this.field.length; d++) {
      f = this.field[d], e = this.tree[d], z(e) && (e = [e]), W(b, e, this.marker, 0, this.index[f], a, e[0], c);
    }
    if (this.tag) {
      let d = pa(b, this.tag), e = y();
      z(d) && (d = [d]);
      for (let f = 0, g, k; f < d.length; f++) {
        if (g = d[f], !e[g] && (e[g] = 1, k = this.tagindex[g] || (this.tagindex[g] = []), !c || -1 === k.indexOf(a))) {
          if (k[k.length] = a, this.fastupdate) {
            const h = this.register[a] || (this.register[a] = []);
            h[h.length] = k;
          }
        }
      }
    }
    if (this.store && !this.extern) {
      let d;
      if (this.storetree) {
        d = y();
        for (let e = 0, f; e < this.storetree.length; e++) {
          f = this.storetree[e], z(f) ? d[f] = b[f] : V(b, d, f, 0, f[0]);
        }
      }
      this.store[a] = d || b;
    }
  }
  return this;
};
T.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
T.prototype.update = function(a, b) {
  return this.remove(a).add(a, b);
};
T.prototype.remove = function(a) {
  A(a) && (a = a[this.key]);
  if (this.register[a]) {
    for (var b = 0; b < this.field.length && (this.index[this.field[b]].remove(a, !0), !this.fastupdate || this.worker); b++) {
    }
    if (this.tag && (!this.fastupdate || this.worker)) {
      for (let c in this.tagindex) {
        b = this.tagindex[c];
        const d = b.indexOf(a);
        -1 !== d && (1 < b.length ? b.splice(d, 1) : delete this.tagindex[c]);
      }
    }
    this.store && !this.extern && delete this.store[a];
    delete this.register[a];
  }
  return this;
};
T.prototype.search = function(a, b, c, d) {
  A(a) ? (c = a, a = c.query) : A(b) && (c = b, b = 0);
  let e = [], f = [], g, k, h, l, n, q, r, p = 0;
  if (c) {
    if (c.constructor === Array) {
      h = c, c = null;
    } else {
      if (h = (g = c.pluck) || c.field || c.doc, n = c.tag, k = this.store && c.enrich, q = "and" === c.bool, b = c.limit || 100, r = c.offset || 0, h && (z(h) ? h = [h] : h.constructor !== Array && (l = h, h = Object.keys(h))), n && (z(n) && (n = [n]), !a)) {
        for (let m = 0, u; m < n.length; m++) {
          if (u = qa.call(this, n[m], b, r, k)) {
            e[e.length] = u, p++;
          }
        }
        return p ? e : [];
      }
    }
  }
  h || (h = this.field);
  q = q && (1 < h.length || n && 1 < n.length);
  const t = !d && (this.worker || this.async) && [];
  for (let m = 0, u, w, E; m < h.length; m++) {
    let K;
    w = h[m];
    z(w) ? l && (K = l[w]) : (K = w, w = w.field);
    if (t) {
      t[m] = this.index[w].searchAsync(a, b, K || c);
    } else {
      u = d ? d[m] : this.index[w].search(a, b, K || c);
      E = u.length;
      if (n && E) {
        const F = [];
        let ia = 0;
        q && (F[0] = [u]);
        for (let R = 0, ja, L; R < n.length; R++) {
          if (ja = n[R], E = (L = this.tagindex[ja]) && L.length) {
            ia++, F[F.length] = q ? [L] : L;
          }
        }
        ia && (u = q ? da(F, b || 100, r || 0) : ea(u, F), E = u.length);
      }
      if (E) {
        f[p] = w, e[p++] = u;
      } else {
        if (q) {
          return [];
        }
      }
    }
  }
  if (t) {
    const m = this;
    return new Promise(function(u) {
      Promise.all(t).then(function(w) {
        u(m.search(a, b, c, w));
      });
    });
  }
  if (!p) {
    return [];
  }
  if (g && (!k || !this.store)) {
    return e[0];
  }
  for (let m = 0, u; m < f.length; m++) {
    u = e[m];
    u.length && k && (u = ra.call(this, u));
    if (g) {
      return u;
    }
    e[m] = {field:f[m], result:u};
  }
  return e;
};
function qa(a, b, c, d) {
  let e = this.tagindex[a], f = e && e.length - c;
  if (f && 0 < f) {
    if (f > b || c) {
      e = e.slice(c, c + b);
    }
    d && (e = ra.call(this, e));
    return {tag:a, result:e};
  }
}
function ra(a) {
  const b = Array(a.length);
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {key:d, doc:this.store[d]};
  }
  return b;
}
T.prototype.contain = function(a) {
  return !!this.register[a];
};
T.prototype.get = function(a) {
  return this.store[a];
};
T.prototype.set = function(a, b) {
  this.store[a] = b;
  return this;
};
T.prototype.searchCache = fa;
T.prototype.export = function(a, b, c, d, e) {
  e || (e = 0);
  d || (d = 0);
  if (d < this.field.length) {
    const f = this.field[d], g = this.index[f];
    b = this;
    setTimeout(function() {
      g.export(a, b, e ? f.replace(":", "-") : "", d, e++) || (d++, e = 1, b.export(a, b, f, d, e));
    });
  } else {
    let f;
    switch(e) {
      case 1:
        c = "tag";
        f = this.tagindex;
        break;
      case 2:
        c = "store";
        f = this.store;
        break;
      default:
        return;
    }
    ka(a, this, c, d, e, f);
  }
};
T.prototype.import = function(a, b) {
  if (b) {
    switch(z(b) && (b = JSON.parse(b)), a) {
      case "tag":
        this.tagindex = b;
        break;
      case "reg":
        this.fastupdate = !1;
        this.register = b;
        for (let d = 0, e; d < this.field.length; d++) {
          e = this.index[this.field[d]], e.register = b, e.fastupdate = !1;
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
J(T.prototype);
const X = self;
let Y;
const Z = {Index:O, Document:T, Worker:Q, registerCharset:function(a, b) {
  H[a] = b;
}, registerLanguage:function(a, b) {
  G[a] = b;
}};
(Y = X.define) && Y.amd ? Y([], function() {
  return Z;
}) : X.exports ? X.exports = Z : X.FlexSearch = Z;
}(this));
