/**!
 * FlexSearch.js v0.7.0-beta (Debug)
 * Copyright 2019 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
function v(a, b) {
  return "undefined" !== typeof a ? a : b;
}
function w(a) {
  const b = Array(a);
  for (let c = 0; c < a; c++) {
    b[c] = y();
  }
  return b;
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
function A(a) {
  return "object" === typeof a;
}
function B(a) {
  return "function" === typeof a;
}
;const ba = /[\u0300-\u036f]/g;
function C(a) {
  a.normalize && (a = a.normalize("NFD").replace(ba, ""));
  return a;
}
function ca(a, b) {
  const c = Object.keys(a), d = c.length, e = [];
  let f = "", g = 0;
  for (let h = 0, k, l; h < d; h++) {
    k = c[h], (l = a[k]) ? (e[g++] = D(b ? "(?!\\b)" + k + "(\\b|_)" : k), e[g++] = l) : f += (f ? "|" : "") + k;
  }
  f && (e[g++] = D(b ? "(?!\\b)(" + f + ")(\\b|_)" : "(" + f + ")"), e[g] = "");
  return e;
}
function E(a, b) {
  for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
function D(a) {
  return new RegExp(a, "g");
}
function F(a) {
  let b = "", c = "";
  for (let d = 0, e = a.length, f; d < e; d++) {
    (f = a[d]) !== c && (b += c = f);
  }
  return b;
}
;const da = /[\W_]+/;
function ea(a) {
  return this.pipeline(C(a).toLowerCase(), !1, da, !1);
}
;const fa = {}, I = {};
let ha = Promise;
function ia(a) {
  J(a, "add");
  J(a, "append");
  J(a, "search");
  J(a, "update");
  J(a, "remove");
}
function J(a, b) {
  a[b + "Async"] = function() {
    const c = this, d = arguments;
    var e = d[d.length - 1];
    let f;
    B(e) && (f = e, delete d[d.length - 1]);
    e = new ha(function(g) {
      setTimeout(function() {
        c.async = !0;
        const h = c[b].apply(c, d);
        c.async = !1;
        g(h);
      });
    });
    return f ? (e.then(f), this) : e;
  };
}
;function ja(a, b, c, d) {
  var e = a.length;
  let f = [], g, h = 0;
  d && (d = []);
  for (--e; 0 <= e; e--) {
    const k = a[e], l = k.length, m = y();
    let q = !g;
    for (let r = 0; r < l; r++) {
      const p = k[r], t = p.length;
      if (t) {
        for (let n = 0, u = 0, x; n < t; n++) {
          if (x = p[n], !g) {
            m[x] = 1;
          } else {
            if (g[x]) {
              if (e) {
                d && u < b && ((d[r] || (d[r] = []))[u++] = x), m[x] = 1;
              } else {
                if (c) {
                  c--;
                } else {
                  if (f[h++] = x, h === b) {
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
    g = m;
  }
  if (d) {
    for (let k = d.length - 1, l, m; 0 <= k; k--) {
      if ((m = (l = d[k]) && l.length) && c && (m <= c ? (c -= m, m = 0) : m -= c), m) {
        if (h + m >= b) {
          return f.concat(l.slice(c, b - h + c));
        }
        f = f.concat(c ? l.slice(c) : l);
        h += m;
        c = 0;
      }
    }
  }
  return f;
}
function ka(a, b) {
  const c = y(), d = y(), e = [];
  for (let f = 0; f < a.length; f++) {
    c[a[f]] = 1;
  }
  for (let f = 0, g; f < b.length; f++) {
    g = b[f];
    for (let h = 0, k; h < g.length; h++) {
      k = g[h], c[k] && !d[k] && (d[k] = 1, e[e.length] = k);
    }
  }
  return e;
}
;function K(a) {
  this.limit = !0 !== a && a;
  this.cache = y();
  this.queue = [];
}
function la(a, b, c) {
  A(a) && (a = a.query);
  let d = this.cache.get(a);
  d || (d = this.search(a, b, c), this.cache.set(a, d));
  return d;
}
K.prototype.set = function(a, b) {
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
K.prototype.get = function(a) {
  const b = this.cache[a];
  if (this.limit && b && (a = this.queue.indexOf(a))) {
    const c = this.queue[a - 1];
    this.queue[a - 1] = this.queue[a];
    this.queue[a] = c;
  }
  return b;
};
K.prototype.del = function(a) {
  for (let b = 0, c, d; b < this.queue.length; b++) {
    d = this.queue[b], c = this.cache[d], -1 !== c.indexOf(a) && (this.queue.splice(b--, 1), delete this.cache[d]);
  }
};
const oa = {memory:{charset:"latin:extra", resolution:3, minlength:3, fastupdate:!1, optimize:"memory"}, performance:{threshold:8, minlength:3, context:{depth:1, bidirectional:!0}}, match:{charset:"latin:extra", tokenize:"full", resolution:3, }, score:{charset:"latin:advanced", threshold:1, context:{depth:3, bidirectional:!0}}, "default":{resolution:3, threshold:0, depth:3}, };
function pa(a, b, c, d, e, f) {
  setTimeout(function() {
    const g = a(c, JSON.stringify(f));
    g && g.then ? g.then(function() {
      b.export(a, b, c, d, e + 1);
    }) : b.export(a, b, c, d, e + 1);
  });
}
;I["latin:default"] = ea;
function L(a, b) {
  if (!(this instanceof L)) {
    return new L(a);
  }
  var c;
  if (a) {
    if (z(a)) {
      oa[a] || console.warn("Preset not found: " + a), a = oa[a];
    } else {
      if (c = a.preset) {
        c[c] || console.warn("Preset not found: " + c), a = Object.assign({}, c[c], a);
      }
    }
    c = a.charset;
    var d = a.lang;
    z(c) && (-1 === c.indexOf(":") && (c += ":default"), c = I[c]);
    z(d) && (d = fa[d]);
  } else {
    a = {};
  }
  let e, f, g, h = a.context || {};
  this.encode = a.encode || c && c.encode || ea;
  this.register = b || y();
  e = a.resolution || 9;
  f = a.threshold || 0;
  f >= e && (f = e - 1);
  this.resolution = e;
  this.threshold = f;
  this.tokenizer = b = c && c.tokenize || a.tokenize || "strict";
  this.depth = "strict" === b && h.depth;
  this.bidirectional = v(h.bidirectional, !0);
  this.optimize = g = "memory" === a.optimize;
  this.fastupdate = v(a.fastupdate, !0);
  this.minlength = a.minlength || 1;
  this.map = g ? w(e - f) : y();
  e = h.resolution || e;
  f = h.threshold || f;
  f >= e && (f = e - 1);
  this.resolution_ctx = e;
  this.threshold_ctx = f;
  this.ctx = g ? w(e - f) : y();
  this.rtl = c && c.rtl || a.rtl;
  this.matcher = (b = a.matcher || d && d.matcher) && ca(b, !1);
  this.stemmer = (b = a.stemmer || d && d.stemmer) && ca(b, !0);
  if (c = b = a.filter || d && d.filter) {
    c = b;
    d = y();
    for (let k = 0, l = c.length; k < l; k++) {
      d[c[k]] = 1;
    }
    c = d;
  }
  this.filter = c;
  this.cache = (b = a.cache) && new K(b);
}
L.prototype.pipeline = function(a, b, c, d) {
  if (a && (b && (a = E(a, b)), this.matcher && (a = E(a, this.matcher)), this.stemmer && 1 < a.length && (a = E(a, this.stemmer)), d && 1 < a.length && (a = F(a)), c || "" === c)) {
    a = a.split(c);
    if (this.filter) {
      b = this.filter;
      c = a.length;
      d = [];
      for (let e = 0, f = 0; e < c; e++) {
        const g = a[e];
        g && !b[g] && (d[f++] = g);
      }
      a = d;
    }
    return a;
  }
  return a;
};
L.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
L.prototype.add = function(a, b, c, d) {
  if (!d && !c && this.register[a]) {
    return this.update(a, b);
  }
  if (b && (a || 0 === a) && (b = this.encode(b), d = b.length)) {
    const m = this.depth, q = this.resolution - this.threshold, r = y(), p = y();
    for (let t = 0; t < d; t++) {
      let n = b[this.rtl ? d - 1 - t : t];
      var e = n.length;
      if (n && e >= this.minlength && (m || !r[n])) {
        var f = Math.min(this.resolution / d * t | 0, t);
        if (f < q) {
          var g = "";
          switch(this.tokenizer) {
            case "full":
              if (3 < e) {
                for (var h = 0; h < e; h++) {
                  var k = h ? Math.min(f / 2 + this.resolution / e * h / 2 | 0, f + h) : f;
                  if (k < q) {
                    for (var l = e; l > h; l--) {
                      g = n.substring(h, l), g.length >= this.minlength && this.push_index(r, g, k, a, c);
                    }
                  }
                }
                break;
              }
            case "reverse":
              if (2 < e) {
                for (h = e - 1; 0 < h; h--) {
                  g = n[h] + g, g.length >= this.minlength && this.push_index(r, g, f, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  g += n[h], g.length >= this.minlength && this.push_index(r, g, f, a, c);
                }
              }
              break;
            default:
              if (this.push_index(r, n, f, a, c), m && 1 < d && t < d - 1) {
                for (e = this.resolution_ctx - this.threshold_ctx, f = y(), g = n, h = Math.min(m + 1, d - t), f[g] = 1, k = 1; k < h; k++) {
                  if ((n = b[this.rtl ? d - 1 - t - k : t + k]) && n.length >= this.minlength && !f[n]) {
                    if (f[n] = 1, l = Math.min((this.resolution_ctx - h) / d * t + k | 0, t + (k - 1)), l < e) {
                      const u = this.bidirectional && n > g;
                      this.push_index(p, u ? g : n, l, a, c, u ? n : g);
                    }
                  } else {
                    h = Math.min(h + 1, d - t);
                  }
                }
              }
          }
        }
      }
    }
    this.fastupdate || (this.register[a] = 1);
  }
  return this;
};
L.prototype.push_index = function(a, b, c, d, e, f) {
  let g = f ? this.ctx : this.map;
  if (!a[b] || f && !a[b][f]) {
    this.optimize && (g = g[c]), f ? (a = a[b] || (a[b] = y()), a[f] = 1, g = g[f] || (g[f] = y())) : a[b] = 1, g = g[b] || (g[b] = []), this.optimize || (g = g[c] || (g[c] = [])), e && -1 !== g.indexOf(d) || (g[g.length] = d, this.fastupdate && (a = this.register[d] || (this.register[d] = []), a[a.length] = g));
  }
};
L.prototype.search = function(a, b, c) {
  A(a) ? (c = a, a = c.query) : A(b) && (c = b);
  let d = [], e;
  var f = this.threshold;
  let g, h = 0;
  if (c) {
    b = c.limit;
    h = c.offset || 0;
    f = v(c.threshold, f);
    var k = c.context;
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
  k = this.depth && 1 < e && !1 !== k;
  l = 0;
  let m;
  k ? (m = a[0], l = 1) : 1 < e && a.sort(aa);
  for (let q, r; l < e; l++) {
    r = a[l];
    k ? (q = this.add_result(d, g, f, b, h, 2 === e, r, m), g && !1 === q && d.length || (m = r)) : q = this.add_result(d, g, c, b, h, 1 === e, r);
    if (q) {
      return q;
    }
    if (g && l === e - 1) {
      let p = d.length;
      if (!p) {
        if (k) {
          k = 0;
          l = -1;
          continue;
        }
        return d;
      }
      if (1 === p) {
        return qa(d[0], b, h);
      }
    }
  }
  return ja(d, b, h, g);
};
L.prototype.add_result = function(a, b, c, d, e, f, g, h) {
  let k = [], l = h ? this.ctx : this.map;
  this.optimize || (l = ra(l, g, h, this.bidirectional));
  if (l) {
    let m = 0;
    c = Math.min(l.length, c);
    for (let q = 0, r = 0, p, t; q < c && !(p = l[q], this.optimize && (p = ra(p, g, h, this.bidirectional)), p && f && (t = p.length, t <= e ? (e -= t, p = null) : e && (p = p.slice(e), e = 0)), p && (k[m++] = p, f && (r += p.length, r >= d))); q++) {
    }
    if (m) {
      if (f) {
        return qa(k, d, 0);
      }
      a[a.length] = k;
      return;
    }
  }
  return !b && k;
};
function qa(a, b, c) {
  a = 1 === a.length ? a[0] : [].concat.apply([], a);
  return c || a.length > b ? a.slice(c, c + b) : a;
}
function ra(a, b, c, d) {
  c ? (d = d && b > c, a = (a = a[d ? b : c]) && a[d ? c : b]) : a = a[b];
  return a;
}
L.prototype.contain = function(a) {
  return !!this.register[a];
};
L.prototype.update = function(a, b) {
  return this.remove(a).add(a, b);
};
L.prototype.remove = function(a, b) {
  const c = this.register[a];
  if (c) {
    if (this.fastupdate) {
      for (let d = 0, e; d < c.length; d++) {
        e = c[d], e.splice(e.indexOf(a), 1);
      }
    } else {
      M(this.map, a, this.resolution - this.threshold, this.optimize), this.depth && M(this.ctx, a, this.resolution_ctx - this.threshold_ctx, this.optimize);
    }
    b || delete this.register[a];
    this.cache && this.cache.del(a);
  }
  return this;
};
function M(a, b, c, d, e) {
  let f = 0;
  if (a.constructor === Array) {
    if (e) {
      b = a.indexOf(b), -1 !== b ? 1 < a.length && (a.splice(b, 1), f++) : f++;
    } else {
      e = Math.min(a.length, c);
      for (let g = 0, h; g < e; g++) {
        if (h = a[g]) {
          f = M(h, b, c, d, e), d || f || delete a[g];
        }
      }
    }
  } else {
    for (let g in a) {
      (f = M(a[g], b, c, d, e)) || delete a[g];
    }
  }
  return f;
}
L.prototype.searchCache = la;
L.prototype.export = function(a, b, c, d, e) {
  let f, g;
  switch(e || (e = 0)) {
    case 0:
      f = "reg";
      if (this.fastupdate) {
        g = y();
        for (let h in this.register) {
          g[h] = 1;
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
  pa(a, b || this, c ? c + "." + f : f, d, e, g);
  return !0;
};
L.prototype.import = function(a, b) {
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
ia(L.prototype);
function sa(a) {
  var b = self._index;
  a = a.data;
  const c = a.args;
  var d = a.task;
  switch(d) {
    case "init":
      b = a.options || {};
      a = a.factory;
      d = b.encode;
      b.cache = !1;
      d && 0 === d.indexOf("function") && (b.encode = Function("return " + d)());
      a ? (Function("return " + a)()(self), self._index = new self.FlexSearch.Index(b), delete self.FlexSearch) : self._index = new L(b);
      break;
    default:
      b = b[d].apply(b, c), postMessage("search" === d ? b : null);
  }
}
;function P(a, b) {
  var c;
  A(a) && (b = a);
  b ? B(c = b.encode) && (b.encode = c.toString()) : b = {};
  (a = (self || window)._factory) && (a = a.toString());
  c = self.exports;
  if (this.worker = ta(a, c, b.worker)) {
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
Q("add");
Q("append");
Q("search");
Q("update");
Q("remove");
function Q(a) {
  P.prototype[a] = P.prototype[a + "Async"] = function() {
    const b = this, c = [].slice.call(arguments);
    var d = c[c.length - 1];
    let e;
    B(d) && (e = d, c.splice(c.length - 1, 1));
    d = new ha(function(f) {
      setTimeout(function() {
        b.worker.postMessage({task:a, args:c});
        b.resolver = f;
      });
    });
    return e ? (d.then(e), this) : d;
  };
}
function ta(a, b, c) {
  let d;
  try {
    d = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + sa.toString()], {type:"text/javascript"}))) : new Worker(z(c) ? c : "worker/worker.js", {type:"module"});
  } catch (e) {
  }
  return d;
}
;function R(a) {
  if (!(this instanceof R)) {
    return new R(a);
  }
  var b;
  a || (a = {});
  this.tree = [];
  this.field = [];
  this.marker = [];
  this.register = y();
  this.key = (b = a.key) && S(b, this.marker) || "id";
  this.fastupdate = v(a.fastupdate, !0);
  this.extern = !!(b = a.extern);
  this.storetree = !this.extern && (b = a.store) && !0 !== b && [];
  this.store = b && (this.extern ? b : y());
  this.tag = (b = a.tag) && S(b, this.marker);
  this.tagindex = b && y();
  this.cache = (b = a.cache) && new K(b);
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
    f = c[e], z(f) ? d && (g = d[f]) : (g = f, f = f.field), g = A(g) ? Object.assign({}, b, g) : b, this.worker && (a[f] = new P(g), a[f].worker || (this.worker = !1)), this.worker || (a[f] = new L(g, this.register)), this.tree[e] = S(f, this.marker), this.field[e] = f;
  }
  if (this.storetree) {
    for (d = b.store, z(d) && (d = [d]), b = 0; b < d.length; b++) {
      this.storetree[b] = S(d[b], this.marker);
    }
  }
  this.index = a;
}
function S(a, b) {
  const c = a.split(":");
  let d = 0;
  for (let e = 0; e < c.length; e++) {
    a = c[e], 0 <= a.indexOf("[]") && (a = a.substring(0, a.length - 2)) && (b[d] = !0), a && (c[d++] = a);
  }
  d < c.length && (c.length = d);
  return 1 < d ? c : c[0];
}
function T(a, b) {
  if (z(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function U(a, b, c, d, e) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = a;
  } else {
    if (a) {
      if (a.constructor === Array) {
        for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
          U(a, b, c, d, e);
        }
      } else {
        b = b[e] || (b[e] = y()), e = c[++d], U(a, b, c, d, e);
      }
    }
  }
}
function W(a, b, c, d, e, f, g, h) {
  a = a[g];
  if (d === b.length - 1) {
    if (a.constructor === Array) {
      if (c[d]) {
        for (b = 0; b < a.length; b++) {
          e.add(f, a[b], !0, !0);
        }
        return;
      }
      a = a.join(" ");
    }
    e.add(f, a, h, !0);
  } else {
    if (a) {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          W(a, b, c, d, e, f, g, h);
        }
      } else {
        g = b[++d], W(a, b, c, d, e, f, g, h);
      }
    }
  }
}
R.prototype.add = function(a, b, c) {
  A(a) && (b = a, a = T(b, this.key));
  if (b && (a || 0 === a)) {
    if (this.register[a]) {
      return this.update(a, b);
    }
    for (let d = 0, e, f; d < this.field.length; d++) {
      f = this.field[d], e = this.tree[d], z(e) && (e = [e]), W(b, e, this.marker, 0, this.index[f], a, e[0], c);
    }
    if (this.tag) {
      let d = T(b, this.tag), e = y();
      z(d) && (d = [d]);
      for (let f = 0, g, h; f < d.length; f++) {
        if (g = d[f], !e[g] && (e[g] = 1, h = this.tagindex[g] || (this.tagindex[g] = []), !c || -1 === h.indexOf(a))) {
          if (h[h.length] = a, this.fastupdate) {
            const k = this.register[a] || (this.register[a] = []);
            k[k.length] = h;
          }
        }
      }
    }
    if (this.store && !this.extern) {
      let d;
      if (this.storetree) {
        d = y();
        for (let e = 0, f; e < this.storetree.length; e++) {
          f = this.storetree[e], z(f) ? d[f] = b[f] : U(b, d, f, 0, f[0]);
        }
      }
      this.store[a] = d || b;
    }
  }
  return this;
};
R.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
R.prototype.update = function(a, b) {
  return this.remove(a).add(a, b);
};
R.prototype.remove = function(a) {
  A(a) && (a = T(a, this.key));
  if (this.register[a]) {
    var b = this.fastupdate && !this.worker;
    for (var c = 0; c < this.field.length && (this.index[this.field[c]].remove(a, b), !b); c++) {
    }
    if (this.tag && !b) {
      for (let d in this.tagindex) {
        b = this.tagindex[d], c = b.indexOf(a), -1 !== c && (1 < b.length ? b.splice(c, 1) : delete this.tagindex[d]);
      }
    }
    this.store && !this.extern && delete this.store[a];
    delete this.register[a];
  }
  return this;
};
R.prototype.search = function(a, b, c, d) {
  A(a) ? (c = a, a = c.query) : A(b) && (c = b, b = 0);
  let e = [], f = [], g, h, k, l, m, q, r, p = 0;
  if (c) {
    if (c.constructor === Array) {
      k = c, c = null;
    } else {
      if (k = (g = c.pluck) || c.field || c.doc, m = c.tag, h = this.store && c.enrich, q = "and" === c.bool, b = c.limit || 100, r = c.offset || 0, k && (z(k) ? k = [k] : k.constructor !== Array && (l = k, k = Object.keys(k))), m && (z(m) && (m = [m]), !a)) {
        for (let n = 0, u; n < m.length; n++) {
          if (u = ua.call(this, m[n], b, r, h)) {
            e[e.length] = u, p++;
          }
        }
        return p ? e : [];
      }
    }
  }
  k || (k = this.field);
  q = q && (1 < k.length || m && 1 < m.length);
  const t = !d && (this.worker || this.async) && [];
  for (let n = 0, u, x, G; n < k.length; n++) {
    let N;
    x = k[n];
    z(x) ? l && (N = l[x]) : (N = x, x = x.field);
    if (t) {
      t[n] = this.index[x].searchAsync(a, b, N || c);
    } else {
      u = d ? d[n] : this.index[x].search(a, b, N || c);
      G = u.length;
      if (m && G) {
        const H = [];
        let ma = 0;
        q && (H[0] = [u]);
        for (let V = 0, na, O; V < m.length; V++) {
          if (na = m[V], G = (O = this.tagindex[na]) && O.length) {
            ma++, H[H.length] = q ? [O] : O;
          }
        }
        ma && (u = q ? ja(H, b || 100, r || 0) : ka(u, H), G = u.length);
      }
      if (G) {
        f[p] = x, e[p++] = u;
      } else {
        if (q) {
          return [];
        }
      }
    }
  }
  if (t) {
    const n = this;
    return new Promise(function(u) {
      Promise.all(t).then(function(x) {
        u(n.search(a, b, c, x));
      });
    });
  }
  if (!p) {
    return [];
  }
  if (g && (!h || !this.store)) {
    return e[0];
  }
  for (let n = 0, u; n < f.length; n++) {
    u = e[n];
    u.length && h && (u = va.call(this, u));
    if (g) {
      return u;
    }
    e[n] = {field:f[n], result:u};
  }
  return e;
};
function ua(a, b, c, d) {
  let e = this.tagindex[a], f = e && e.length - c;
  if (f && 0 < f) {
    if (f > b || c) {
      e = e.slice(c, c + b);
    }
    d && (e = va.call(this, e));
    return {tag:a, result:e};
  }
}
function va(a) {
  const b = Array(a.length);
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {key:d, doc:this.store[d]};
  }
  return b;
}
R.prototype.contain = function(a) {
  return !!this.register[a];
};
R.prototype.get = function(a) {
  return this.store[a];
};
R.prototype.set = function(a, b) {
  this.store[a] = b;
  return this;
};
R.prototype.searchCache = la;
R.prototype.export = function(a, b, c, d, e) {
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
    pa(a, this, c, d, e, f);
  }
};
R.prototype.import = function(a, b) {
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
ia(R.prototype);
var xa = {encode:wa, rtl:!1, tokenize:""};
const ya = /[\W_]+/, za = D("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), Aa = D("[\u00e8\u00e9\u00ea\u00eb]"), Ba = D("[\u00ec\u00ed\u00ee\u00ef]"), Ca = D("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), Da = D("[\u00f9\u00fa\u00fb\u00fc\u0171]"), Ea = D("[\u00fd\u0177\u00ff]"), Fa = D("\u00f1"), Ga = D("[\u00e7c]"), Ha = D("\u00df"), Ia = D(" & "), Ja = [za, "a", Aa, "e", Ba, "i", Ca, "o", Da, "u", Ea, "y", Fa, "n", Ga, "k", Ha, "s", Ia, " and "];
function wa(a) {
  return this.pipeline(C(a).toLowerCase(), !a.normalize && Ja, ya, !1);
}
;var La = {encode:Ka, rtl:!1, tokenize:"strict"};
const Ma = /[^a-z0-9]+/, Na = {b:"p", v:"f", w:"f", z:"s", x:"s", "\u00df":"s", d:"t", n:"m", c:"k", g:"k", j:"k", q:"k", i:"e", y:"e", u:"o"};
function Ka(a) {
  a = wa.call(this, a).join(" ");
  const b = [];
  if (a) {
    const c = a.split(Ma), d = c.length;
    for (let e = 0, f, g = 0; e < d; e++) {
      if ((a = c[e]) && (!this.filter || !this.filter[a])) {
        f = a[0];
        let h = Na[f] || f, k = h;
        for (let l = 1; l < a.length; l++) {
          f = a[l];
          const m = Na[f] || f;
          m && m !== k && (h += m, k = m);
        }
        b[g++] = h;
      }
    }
  }
  return b;
}
;var Pa = {encode:Oa, rtl:!1, tokenize:""};
const Qa = D("ae"), Ra = D("oe"), Sa = D("sh"), Ta = D("th"), Ua = D("ph"), Va = D("pf"), Wa = [Qa, "a", Ra, "o", Sa, "s", Ta, "t", Ua, "f", Va, "f", ];
function Oa(a, b) {
  a && (a = Ka.call(this, a).join(" "), 2 < a.length && (a = E(a, Wa)), b || (1 < a.length && (a = F(a)), a && (a = a.split(" "))));
  return a;
}
;var Ya = {encode:Xa, rtl:!1, tokenize:""};
const Za = D("(?!\\b)[aeiouy]");
function Xa(a) {
  a && (a = Oa.call(this, a, !0), 1 < a.length && (a = a.replace(Za, "")), 1 < a.length && (a = F(a)), a && (a = a.split(" ")));
  return a;
}
;I["latin:simple"] = xa;
I["latin:balance"] = La;
I["latin:advanced"] = Pa;
I["latin:extra"] = Ya;
const X = self;
let Y;
const Z = {Index:L, Document:R, Worker:P, registerCharset:function(a, b) {
  I[a] = b;
}, registerLanguage:function(a, b) {
  fa[a] = b;
}};
(Y = X.define) && Y.amd ? Y([], function() {
  return Z;
}) : X.exports ? X.exports = Z : X.FlexSearch = Z;
}(this));
