/**!
 * FlexSearch.js v0.7.0-beta (Debug)
 * Copyright 2019 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
function t(a, b) {
  return "undefined" !== typeof a ? a : b;
}
function v(a) {
  const b = Array(a);
  for (let c = 0; c < a; c++) {
    b[c] = w();
  }
  return b;
}
function w() {
  return Object.create(null);
}
function aa(a, b) {
  return b.length - a.length;
}
function x(a) {
  return "string" === typeof a;
}
function z(a) {
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
function D(a, b) {
  const c = Object.keys(a), d = c.length, e = [];
  let f = "", g = 0;
  for (let h = 0, k, l; h < d; h++) {
    k = c[h], (l = a[k]) ? (e[g++] = E(b ? "(?!\\b)" + k + "(\\b|_)" : k), e[g++] = l) : f += (f ? "|" : "") + k;
  }
  f && (e[g++] = E(b ? "(?!\\b)(" + f + ")(\\b|_)" : "(" + f + ")"), e[g] = "");
  return e;
}
function F(a, b) {
  for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
function E(a) {
  return new RegExp(a, "g");
}
function H(a) {
  let b = "", c = "";
  for (let d = 0, e = a.length, f; d < e; d++) {
    (f = a[d]) !== c && (b += c = f);
  }
  return b;
}
;const ca = /[\W_]+/;
function da(a) {
  return this.pipeline(C(a).toLowerCase(), !1, ca, !1);
}
;const ea = {}, I = {};
let fa = Promise;
function ha(a) {
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
    e = new fa(function(g) {
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
;function ia(a, b, c, d) {
  var e = a.length;
  let f = [], g, h = 0;
  d && (d = []);
  for (--e; 0 <= e; e--) {
    const k = a[e], l = k.length, p = w();
    let u = !g;
    for (let r = 0; r < l; r++) {
      const q = k[r], n = q.length;
      if (n) {
        for (let m = 0, y = 0, A; m < n; m++) {
          if (A = q[m], !g) {
            p[A] = 1;
          } else {
            if (g[A]) {
              if (e) {
                d && y < b && ((d[r] || (d[r] = []))[y++] = A), p[A] = 1;
              } else {
                if (c) {
                  c--;
                } else {
                  if (f[h++] = A, h === b) {
                    return f;
                  }
                }
              }
              u = !0;
            }
          }
        }
      }
    }
    if (!u && !d) {
      return [];
    }
    g = p;
  }
  if (d) {
    for (let k = d.length - 1, l, p; 0 <= k; k--) {
      if ((p = (l = d[k]) && l.length) && c && (p <= c ? (c -= p, p = 0) : p -= c), p) {
        if (h + p >= b) {
          return f.concat(l.slice(c, b - h + c));
        }
        f = f.concat(c ? l.slice(c) : l);
        h += p;
        c = 0;
      }
    }
  }
  return f;
}
function ja(a, b) {
  const c = w(), d = w(), e = [];
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
  this.cache = w();
  this.queue = [];
}
function ka(a, b, c) {
  z(a) && (a = a.query);
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
const la = {memory:{charset:"latin:extra", resolution:3, minlength:3, fastupdate:!1, optimize:"memory"}, performance:{threshold:8, minlength:3, context:{depth:1, bidirectional:!0}}, match:{charset:"latin:extra", tokenize:"full", resolution:3, }, score:{charset:"latin:advanced", threshold:1, context:{depth:3, bidirectional:!0}}, "default":{resolution:3, threshold:0, depth:3}, };
function oa(a, b, c, d, e, f) {
  setTimeout(function() {
    const g = a(c, JSON.stringify(f));
    g && g.then ? g.then(function() {
      b.export(a, b, c, d, e + 1);
    }) : b.export(a, b, c, d, e + 1);
  });
}
;I["latin:default"] = da;
function L(a, b) {
  if (!(this instanceof L)) {
    return new L(a);
  }
  var c;
  if (a) {
    if (x(a)) {
      la[a] || console.warn("Preset not found: " + a), a = la[a];
    } else {
      if (c = a.preset) {
        c[c] || console.warn("Preset not found: " + c), a = Object.assign({}, c[c], a);
      }
    }
    c = a.charset;
    var d = a.lang;
    x(c) && (-1 === c.indexOf(":") && (c += ":default"), c = I[c]);
    x(d) && (d = ea[d]);
  } else {
    a = {};
  }
  let e, f, g, h = a.context || {};
  this.encode = a.encode || c && c.encode || da;
  this.register = b || w();
  e = a.resolution || 9;
  f = a.threshold || 0;
  f >= e && (f = e - 1);
  this.resolution = e;
  this.threshold = f;
  this.tokenizer = b = c && c.tokenize || a.tokenize || "strict";
  this.depth = "strict" === b && h.depth;
  this.bidirectional = t(h.bidirectional, !0);
  this.optimize = g = "memory" === a.optimize;
  this.fastupdate = t(a.fastupdate, !0);
  this.minlength = a.minlength || 1;
  this.map = g ? v(e - f) : w();
  e = h.resolution || e;
  f = h.threshold || f;
  f >= e && (f = e - 1);
  this.resolution_ctx = e;
  this.threshold_ctx = f;
  this.ctx = g ? v(e - f) : w();
  this.rtl = c && c.rtl || a.rtl;
  this.matcher = (b = a.matcher || d && d.matcher) && D(b, !1);
  this.stemmer = (b = a.stemmer || d && d.stemmer) && D(b, !0);
  if (c = b = a.filter || d && d.filter) {
    c = b;
    d = w();
    for (let k = 0, l = c.length; k < l; k++) {
      d[c[k]] = 1;
    }
    c = d;
  }
  this.filter = c;
  this.cache = (b = a.cache) && new K(b);
}
L.prototype.pipeline = function(a, b, c, d) {
  if (a && (b && (a = F(a, b)), this.matcher && (a = F(a, this.matcher)), this.stemmer && 1 < a.length && (a = F(a, this.stemmer)), d && 1 < a.length && (a = H(a)), c || "" === c)) {
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
    const p = this.depth, u = this.resolution - this.threshold, r = w(), q = w();
    for (let n = 0; n < d; n++) {
      let m = b[this.rtl ? d - 1 - n : n];
      var e = m.length;
      if (m && e >= this.minlength && (p || !r[m])) {
        var f = Math.min(this.resolution / d * n | 0, n);
        if (f < u) {
          var g = "";
          switch(this.tokenizer) {
            case "full":
              if (3 < e) {
                for (var h = 0; h < e; h++) {
                  var k = h ? Math.min(f / 2 + this.resolution / e * h / 2 | 0, f + h) : f;
                  if (k < u) {
                    for (var l = e; l > h; l--) {
                      g = m.substring(h, l), g.length >= this.minlength && this.push_index(r, g, k, a, c);
                    }
                  }
                }
                break;
              }
            case "reverse":
              if (2 < e) {
                for (h = e - 1; 0 < h; h--) {
                  g = m[h] + g, g.length >= this.minlength && this.push_index(r, g, f, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  g += m[h], g.length >= this.minlength && this.push_index(r, g, f, a, c);
                }
              }
              break;
            default:
              if (this.push_index(r, m, f, a, c), p && 1 < d && n < d - 1) {
                for (e = this.resolution_ctx - this.threshold_ctx, f = w(), g = m, h = Math.min(p + 1, d - n), f[g] = 1, k = 1; k < h; k++) {
                  if ((m = b[this.rtl ? d - 1 - n - k : n + k]) && m.length >= this.minlength && !f[m]) {
                    if (f[m] = 1, l = Math.min((this.resolution_ctx - h) / d * n + k | 0, n + (k - 1)), l < e) {
                      const y = this.bidirectional && m > g;
                      this.push_index(q, y ? g : m, l, a, c, y ? m : g);
                    }
                  } else {
                    h = Math.min(h + 1, d - n);
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
    this.optimize && (g = g[c]), f ? (a = a[b] || (a[b] = w()), a[f] = 1, g = g[f] || (g[f] = w())) : a[b] = 1, g = g[b] || (g[b] = []), this.optimize || (g = g[c] || (g[c] = [])), e && -1 !== g.indexOf(d) || (g[g.length] = d, this.fastupdate && (a = this.register[d] || (this.register[d] = []), a[a.length] = g));
  }
};
L.prototype.search = function(a, b, c) {
  z(a) ? (c = a, a = c.query) : z(b) && (c = b);
  let d = [], e;
  var f = this.threshold;
  let g, h = 0;
  if (c) {
    b = c.limit;
    h = c.offset || 0;
    f = t(c.threshold, f);
    var k = c.context;
    g = c.suggest;
  }
  if (a && (a = this.encode(a), e = a.length, 1 < e)) {
    c = w();
    var l = [];
    for (let u = 0, r = 0, q; u < e; u++) {
      if ((q = a[u]) && q.length >= this.minlength && !c[q]) {
        if (this.optimize || g || this.map[q]) {
          l[r++] = q, c[q] = 1;
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
  let p;
  k ? (p = a[0], l = 1) : 1 < e && a.sort(aa);
  for (let u, r; l < e; l++) {
    r = a[l];
    k ? (u = this.add_result(d, g, f, b, h, 2 === e, r, p), g && !1 === u && d.length || (p = r)) : u = this.add_result(d, g, c, b, h, 1 === e, r);
    if (u) {
      return u;
    }
    if (g && l === e - 1) {
      let q = d.length;
      if (!q) {
        if (k) {
          k = 0;
          l = -1;
          continue;
        }
        return d;
      }
      if (1 === q) {
        return pa(d[0], b, h);
      }
    }
  }
  return ia(d, b, h, g);
};
L.prototype.add_result = function(a, b, c, d, e, f, g, h) {
  let k = [], l = h ? this.ctx : this.map;
  this.optimize || (l = qa(l, g, h, this.bidirectional));
  if (l) {
    let p = 0;
    c = Math.min(l.length, c);
    for (let u = 0, r = 0, q, n; u < c && !(q = l[u], this.optimize && (q = qa(q, g, h, this.bidirectional)), q && f && (n = q.length, n <= e ? (e -= n, q = null) : e && (q = q.slice(e), e = 0)), q && (k[p++] = q, f && (r += q.length, r >= d))); u++) {
    }
    if (p) {
      if (f) {
        return pa(k, d, 0);
      }
      a[a.length] = k;
      return;
    }
  }
  return !b && k;
};
function pa(a, b, c) {
  a = 1 === a.length ? a[0] : [].concat.apply([], a);
  return c || a.length > b ? a.slice(c, c + b) : a;
}
function qa(a, b, c, d) {
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
      N(this.map, a, this.resolution - this.threshold, this.optimize), this.depth && N(this.ctx, a, this.resolution_ctx - this.threshold_ctx, this.optimize);
    }
    b || delete this.register[a];
    this.cache && this.cache.del(a);
  }
  return this;
};
function N(a, b, c, d, e) {
  let f = 0;
  if (a.constructor === Array) {
    if (e) {
      b = a.indexOf(b), -1 !== b ? 1 < a.length && (a.splice(b, 1), f++) : f++;
    } else {
      e = Math.min(a.length, c);
      for (let g = 0, h; g < e; g++) {
        if (h = a[g]) {
          f = N(h, b, c, d, e), d || f || delete a[g];
        }
      }
    }
  } else {
    for (let g in a) {
      (f = N(a[g], b, c, d, e)) || delete a[g];
    }
  }
  return f;
}
L.prototype.searchCache = ka;
L.prototype.export = function(a, b, c, d, e) {
  let f, g;
  switch(e || (e = 0)) {
    case 0:
      f = "reg";
      if (this.fastupdate) {
        g = w();
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
  oa(a, b || this, c ? c + "." + f : f, d, e, g);
  return !0;
};
L.prototype.import = function(a, b) {
  if (b) {
    switch(x(b) && (b = JSON.parse(b)), a) {
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
ha(L.prototype);
function ra(a) {
  a = a.data;
  var b = self._index;
  const c = a.args;
  var d = a.task;
  switch(d) {
    case "init":
      d = a.options || {};
      a = a.factory;
      b = d.encode;
      d.cache = !1;
      b && 0 === b.indexOf("function") && (d.encode = Function("return " + b)());
      a ? (Function("return " + a)()(self), self._index = new self.FlexSearch.Index(d), delete self.FlexSearch) : self._index = new L(d);
      break;
    default:
      a = a.id, b = b[d].apply(b, c), postMessage("search" === d ? {id:a, msg:b} : {id:a});
  }
}
;let sa = 0;
function O(a) {
  var b;
  a ? B(b = a.encode) && (a.encode = b.toString()) : a = {};
  (b = (self || window)._factory) && (b = b.toString());
  const c = self.exports, d = this;
  this.worker = ta(b, c, a.worker);
  this.resolver = w();
  if (this.worker) {
    if (c) {
      this.worker.on("message", function(e) {
        d.resolver[e.id](e.msg);
        delete d.resolver[e.id];
      });
    } else {
      this.worker.onmessage = function(e) {
        e = e.data;
        d.resolver[e.id](e.msg);
        delete d.resolver[e.id];
      };
    }
    this.worker.postMessage({task:"init", factory:b, options:a});
  }
}
P("add");
P("append");
P("search");
P("update");
P("remove");
function P(a) {
  O.prototype[a] = O.prototype[a + "Async"] = function() {
    const b = this, c = [].slice.call(arguments);
    var d = c[c.length - 1];
    let e;
    B(d) && (e = d, c.splice(c.length - 1, 1));
    d = new fa(function(f) {
      setTimeout(function() {
        b.resolver[++sa] = f;
        b.worker.postMessage({task:a, id:sa, args:c});
      });
    });
    return e ? (d.then(e), this) : d;
  };
}
function ta(a, b, c) {
  let d;
  try {
    d = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + ra.toString()], {type:"text/javascript"}))) : new Worker(x(c) ? c : "worker/worker.js", {type:"module"});
  } catch (e) {
  }
  return d;
}
;function Q(a) {
  if (!(this instanceof Q)) {
    return new Q(a);
  }
  var b = a.document || a.doc || a, c;
  this.tree = [];
  this.field = [];
  this.marker = [];
  this.register = w();
  this.key = (c = b.key || b.id) && R(c, this.marker) || "id";
  this.fastupdate = t(a.fastupdate, !0);
  this.extern = !!(c = b.extern);
  this.storetree = !this.extern && (c = b.store) && !0 !== c && [];
  this.store = c && (this.extern ? c : w());
  this.tag = (c = b.tag) && R(c, this.marker);
  this.tagindex = c && w();
  this.cache = (c = a.cache) && new K(c);
  a.cache = !1;
  this.worker = a.worker;
  this.async = !1;
  c = w();
  let d = b.index || b.field || b;
  x(d) && (d = [d]);
  for (let e = 0, f, g; e < d.length; e++) {
    f = d[e], x(f) || (g = f, f = f.field), g = z(g) ? Object.assign({}, a, g) : a, this.worker && (c[f] = new O(g), c[f].worker || (this.worker = !1)), this.worker || (c[f] = new L(g, this.register)), this.tree[e] = R(f, this.marker), this.field[e] = f;
  }
  if (this.storetree) {
    for (a = b.store, x(a) && (a = [a]), b = 0; b < a.length; b++) {
      this.storetree[b] = R(a[b], this.marker);
    }
  }
  this.index = c;
}
function R(a, b) {
  const c = a.split(":");
  let d = 0;
  for (let e = 0; e < c.length; e++) {
    a = c[e], 0 <= a.indexOf("[]") && (a = a.substring(0, a.length - 2)) && (b[d] = !0), a && (c[d++] = a);
  }
  d < c.length && (c.length = d);
  return 1 < d ? c : c[0];
}
function S(a, b) {
  if (x(b)) {
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
        b = b[e] || (b[e] = w()), e = c[++d], V(a, b, c, d, e);
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
Q.prototype.add = function(a, b, c) {
  z(a) && (b = a, a = S(b, this.key));
  if (b && (a || 0 === a)) {
    if (this.register[a]) {
      return this.update(a, b);
    }
    for (let d = 0, e, f; d < this.field.length; d++) {
      f = this.field[d], e = this.tree[d], x(e) && (e = [e]), W(b, e, this.marker, 0, this.index[f], a, e[0], c);
    }
    if (this.tag) {
      let d = S(b, this.tag), e = w();
      x(d) && (d = [d]);
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
        d = w();
        for (let e = 0, f; e < this.storetree.length; e++) {
          f = this.storetree[e], x(f) ? d[f] = b[f] : V(b, d, f, 0, f[0]);
        }
      }
      this.store[a] = d || b;
    }
  }
  return this;
};
Q.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
Q.prototype.update = function(a, b) {
  return this.remove(a).add(a, b);
};
Q.prototype.remove = function(a) {
  z(a) && (a = S(a, this.key));
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
Q.prototype.search = function(a, b, c, d) {
  z(a) ? (c = a, a = c.query) : z(b) && (c = b, b = 0);
  let e = [], f = [], g, h, k, l, p, u, r = 0;
  if (c) {
    if (c.constructor === Array) {
      k = c, c = null;
    } else {
      k = (g = c.pluck) || c.index || c.field || c;
      l = c.tag;
      h = this.store && c.enrich;
      p = "and" === c.bool;
      b = c.limit || 100;
      u = c.offset || 0;
      if (l && (x(l) && (l = [l]), !a)) {
        for (let n = 0, m; n < l.length; n++) {
          if (m = ua.call(this, l[n], b, u, h)) {
            e[e.length] = m, r++;
          }
        }
        return r ? e : [];
      }
      x(k) ? k = [k] : k.constructor === Array || (k = null);
    }
  }
  k || (k = this.field);
  p = p && (1 < k.length || l && 1 < l.length);
  const q = !d && (this.worker || this.async) && [];
  for (let n = 0, m, y, A; n < k.length; n++) {
    let T;
    y = k[n];
    x(y) || (T = y, y = y.field);
    if (q) {
      q[n] = this.index[y].searchAsync(a, b, T || c);
    } else {
      A = (m = d ? d[n] : this.index[y].search(a, b, T || c)) && m.length;
      if (l && A) {
        const G = [];
        let ma = 0;
        p && (G[0] = [m]);
        for (let U = 0, na, M; U < l.length; U++) {
          if (na = l[U], A = (M = this.tagindex[na]) && M.length) {
            ma++, G[G.length] = p ? [M] : M;
          }
        }
        ma && (m = p ? ia(G, b || 100, u || 0) : ja(m, G), A = m.length);
      }
      if (A) {
        f[r] = y, e[r++] = m;
      } else {
        if (p) {
          return [];
        }
      }
    }
  }
  if (q) {
    const n = this;
    return new Promise(function(m) {
      Promise.all(q).then(function(y) {
        m(n.search(a, b, c, y));
      });
    });
  }
  if (!r) {
    return [];
  }
  if (g && (!h || !this.store)) {
    return e[0];
  }
  for (let n = 0, m; n < f.length; n++) {
    m = e[n];
    m.length && h && (m = va.call(this, m));
    if (g) {
      return m;
    }
    e[n] = {field:f[n], result:m};
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
Q.prototype.contain = function(a) {
  return !!this.register[a];
};
Q.prototype.get = function(a) {
  return this.store[a];
};
Q.prototype.set = function(a, b) {
  this.store[a] = b;
  return this;
};
Q.prototype.searchCache = ka;
Q.prototype.export = function(a, b, c, d, e) {
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
    oa(a, this, c, d, e, f);
  }
};
Q.prototype.import = function(a, b) {
  if (b) {
    switch(x(b) && (b = JSON.parse(b)), a) {
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
ha(Q.prototype);
var xa = {encode:wa, rtl:!1, tokenize:""};
const ya = /[\W_]+/, za = E("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), Aa = E("[\u00e8\u00e9\u00ea\u00eb]"), Ba = E("[\u00ec\u00ed\u00ee\u00ef]"), Ca = E("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), Da = E("[\u00f9\u00fa\u00fb\u00fc\u0171]"), Ea = E("[\u00fd\u0177\u00ff]"), Fa = E("\u00f1"), Ga = E("[\u00e7c]"), Ha = E("\u00df"), Ia = E(" & "), Ja = [za, "a", Aa, "e", Ba, "i", Ca, "o", Da, "u", Ea, "y", Fa, "n", Ga, "k", Ha, "s", Ia, " and "];
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
          const p = Na[f] || f;
          p && p !== k && (h += p, k = p);
        }
        b[g++] = h;
      }
    }
  }
  return b;
}
;var Pa = {encode:Oa, rtl:!1, tokenize:""};
const Qa = E("ae"), Ra = E("oe"), Sa = E("sh"), Ta = E("th"), Ua = E("ph"), Va = E("pf"), Wa = [Qa, "a", Ra, "o", Sa, "s", Ta, "t", Ua, "f", Va, "f", ];
function Oa(a, b) {
  a && (a = Ka.call(this, a).join(" "), 2 < a.length && (a = F(a, Wa)), b || (1 < a.length && (a = H(a)), a && (a = a.split(" "))));
  return a;
}
;var Ya = {encode:Xa, rtl:!1, tokenize:""};
const Za = E("(?!\\b)[aeiouy]");
function Xa(a) {
  a && (a = Oa.call(this, a, !0), 1 < a.length && (a = a.replace(Za, "")), 1 < a.length && (a = H(a)), a && (a = a.split(" ")));
  return a;
}
;I["latin:simple"] = xa;
I["latin:balance"] = La;
I["latin:advanced"] = Pa;
I["latin:extra"] = Ya;
const X = self;
let Y;
const Z = {Index:L, Document:Q, Worker:O, registerCharset:function(a, b) {
  I[a] = b;
}, registerLanguage:function(a, b) {
  ea[a] = b;
}};
(Y = X.define) && Y.amd ? Y([], function() {
  return Z;
}) : X.exports ? X.exports = Z : X.FlexSearch = Z;
}(this));
