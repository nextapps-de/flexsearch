/**!
 * FlexSearch.js v0.7.0-beta (Debug)
 * Copyright 2019 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
function r(a, b) {
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
function y(a) {
  return "string" === typeof a;
}
function z(a) {
  return "object" === typeof a;
}
function C(a) {
  return "function" === typeof a;
}
;const ba = /[\u0300-\u036f]/g;
function E(a) {
  a.normalize && (a = a.normalize("NFD").replace(ba, ""));
  return a;
}
function ca(a, b) {
  const c = Object.keys(a), d = c.length, e = [];
  let f = "", g = 0;
  for (let h = 0, k, n; h < d; h++) {
    k = c[h], (n = a[k]) ? (e[g++] = F(b ? "(?!\\b)" + k + "(\\b|_)" : k), e[g++] = n) : f += (f ? "|" : "") + k;
  }
  f && (e[g++] = F(b ? "(?!\\b)(" + f + ")(\\b|_)" : "(" + f + ")"), e[g] = "");
  return e;
}
function G(a, b) {
  for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
function F(a) {
  return new RegExp(a, "g");
}
function H(a) {
  let b = "", c = "";
  for (let d = 0, e = a.length, f; d < e; d++) {
    (f = a[d]) !== c && (b += c = f);
  }
  return b;
}
;var ea = {encode:da, rtl:!1, tokenize:""};
const fa = /[\W_]+/;
function da(a) {
  return this.pipeline(E(a).toLowerCase(), !1, fa, !1);
}
;const ha = {}, I = {};
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
    C(e) && (f = e, delete d[d.length - 1]);
    e = new Promise(function(g) {
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
  let f = [], g, h, k = 0;
  d && (d = []);
  for (--e; 0 <= e; e--) {
    const n = a[e], p = n.length, q = w();
    let t = !g;
    for (let m = 0; m < p; m++) {
      const l = n[m], u = l.length;
      if (u) {
        for (let x = 0, A, B; x < u; x++) {
          if (B = l[x], g) {
            if (g[B]) {
              if (!e) {
                if (c) {
                  c--;
                } else {
                  if (f[k++] = B, k === b) {
                    return f;
                  }
                }
              }
              if (e || d) {
                q[B] = 1;
              }
              t = !0;
            }
            if (d && (h[B] = (A = h[B]) ? A++ : A = 1, A < p)) {
              const D = d[A - 1] || (d[A - 1] = []);
              D[D.length] = B;
            }
          } else {
            q[B] = 1;
          }
        }
      }
    }
    if (d) {
      g || (h = q);
    } else {
      if (!t) {
        return [];
      }
    }
    g = q;
  }
  if (d) {
    for (let n = d.length - 1, p, q; 0 <= n; n--) {
      p = d[n];
      q = p.length;
      for (let t = 0, m; t < q; t++) {
        if (m = p[t], !g[m]) {
          if (c) {
            c--;
          } else {
            if (f[k++] = m, k === b) {
              return f;
            }
          }
          g[m] = 1;
        }
      }
    }
  }
  return f;
}
function ka(a, b) {
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
function la(a, b, c) {
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
const oa = {memory:{charset:"latin:extra", resolution:3, minlength:3, fastupdate:!1, optimize:"memory"}, performance:{threshold:8, minlength:3, context:{depth:1, bidirectional:!0}}, match:{charset:"latin:extra", tokenize:"full", resolution:3, }, score:{charset:"latin:advanced", threshold:1, context:{depth:3, bidirectional:!0}}, "default":{resolution:3, threshold:0, depth:3}, };
function pa(a, b, c, d, e, f) {
  setTimeout(function() {
    const g = a(c, JSON.stringify(f));
    g && g.then ? g.then(function() {
      b.export(a, b, c, d, e + 1);
    }) : b.export(a, b, c, d, e + 1);
  });
}
;function L(a, b) {
  if (!(this instanceof L)) {
    return new L(a);
  }
  var c;
  if (a) {
    if (y(a)) {
      oa[a] || console.warn("Preset not found: " + a), a = oa[a];
    } else {
      if (c = a.preset) {
        c[c] || console.warn("Preset not found: " + c), a = Object.assign({}, c[c], a);
      }
    }
    c = a.charset;
    var d = a.lang;
    y(c) && (-1 === c.indexOf(":") && (c += ":default"), c = I[c]);
    y(d) && (d = ha[d]);
  } else {
    a = {};
  }
  let e, f, g = a.context || {};
  this.encode = a.encode || c && c.encode || da;
  this.register = b || w();
  this.resolution = e = a.resolution || 9;
  this.tokenize = b = c && c.tokenize || a.tokenize || "strict";
  this.depth = "strict" === b && g.depth;
  this.bidirectional = r(g.bidirectional, !0);
  this.optimize = f = r(a.optimize, !0);
  this.fastupdate = r(a.fastupdate, !0);
  this.minlength = a.minlength || 1;
  this.map = f ? v(e) : w();
  this.resolution_ctx = e = g.resolution || 1;
  this.ctx = f ? v(e) : w();
  this.rtl = c && c.rtl || a.rtl;
  this.matcher = (b = a.matcher || d && d.matcher) && ca(b, !1);
  this.stemmer = (b = a.stemmer || d && d.stemmer) && ca(b, !0);
  if (c = b = a.filter || d && d.filter) {
    c = b;
    d = w();
    for (let h = 0, k = c.length; h < k; h++) {
      d[c[h]] = 1;
    }
    c = d;
  }
  this.filter = c;
  this.cache = (b = a.cache) && new K(b);
}
L.prototype.pipeline = function(a, b, c, d) {
  if (a && (b && (a = G(a, b)), this.matcher && (a = G(a, this.matcher)), this.stemmer && 1 < a.length && (a = G(a, this.stemmer)), d && 1 < a.length && (a = H(a)), c || "" === c)) {
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
    const n = this.depth, p = this.resolution, q = w(), t = w();
    for (let m = 0; m < d; m++) {
      let l = b[this.rtl ? d - 1 - m : m];
      var e = l.length;
      if (l && e >= this.minlength && (n || !q[l])) {
        var f = M(p, d, m), g = "";
        switch(this.tokenize) {
          case "full":
            if (3 < e) {
              for (f = 0; f < e; f++) {
                for (var h = e; h > f; h--) {
                  if (h - f >= this.minlength) {
                    var k = M(p, d, m, e, f);
                    g = l.substring(f, h);
                    this.push_index(q, g, k, a, c);
                  }
                }
              }
              break;
            }
          case "reverse":
            if (2 < e) {
              for (h = e - 1; 0 < h; h--) {
                g = l[h] + g, g.length >= this.minlength && (k = M(p, d, m, e, h), this.push_index(q, g, k, a, c));
              }
              g = "";
            }
          case "forward":
            if (1 < e) {
              for (h = 0; h < e; h++) {
                g += l[h], g.length >= this.minlength && this.push_index(q, g, f, a, c);
              }
            }
            break;
          default:
            if (this.push_index(q, l, f, a, c), n && 1 < d && m < d - 1) {
              for (e = this.resolution_ctx, g = w(), f = l, h = Math.min(n + 1, d - m), g[f] = 1, k = 1; k < h; k++) {
                if ((l = b[this.rtl ? d - 1 - m - k : m + k]) && l.length >= this.minlength && !g[l]) {
                  g[l] = 1;
                  const u = M(e + (d / 2 > e ? 0 : 1), d, m, h - 1, k - 1), x = this.bidirectional && l > f;
                  this.push_index(t, x ? f : l, u, a, c, x ? l : f);
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
function M(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
L.prototype.push_index = function(a, b, c, d, e, f) {
  let g = f ? this.ctx : this.map;
  if (!a[b] || f && !a[b][f]) {
    this.optimize && (g = g[c]), f ? (a = a[b] || (a[b] = w()), a[f] = 1, g = g[f] || (g[f] = w())) : a[b] = 1, g = g[b] || (g[b] = []), this.optimize || (g = g[c] || (g[c] = [])), e && -1 !== g.indexOf(d) || (g[g.length] = d, this.fastupdate && (a = this.register[d] || (this.register[d] = []), a[a.length] = g));
  }
};
L.prototype.search = function(a, b, c) {
  z(a) ? (c = a, a = c.query) : z(b) && (c = b);
  let d = [], e;
  let f, g = 0;
  if (c) {
    b = c.limit;
    g = c.offset || 0;
    var h = c.context;
    f = c.suggest;
  }
  if (a && (a = this.encode(a), e = a.length, 1 < e)) {
    c = w();
    var k = [];
    for (let p = 0, q = 0, t; p < e; p++) {
      if ((t = a[p]) && t.length >= this.minlength && !c[t]) {
        if (this.optimize || f || this.map[t]) {
          k[q++] = t, c[t] = 1;
        } else {
          return d;
        }
      }
    }
    a = k;
    e = a.length;
  }
  if (!e) {
    return d;
  }
  b || (b = 100);
  h = this.depth && 1 < e && !1 !== h;
  c = 0;
  let n;
  h ? (n = a[0], c = 1) : 1 < e && a.sort(aa);
  for (let p, q; c < e; c++) {
    q = a[c];
    h ? (p = this.add_result(d, f, b, g, 2 === e, q, n), f && !1 === p && d.length || (n = q)) : p = this.add_result(d, f, b, g, 1 === e, q);
    if (p) {
      return p;
    }
    if (f && c === e - 1) {
      k = d.length;
      if (!k) {
        if (h) {
          h = 0;
          c = -1;
          continue;
        }
        return d;
      }
      if (1 === k) {
        return qa(d[0], b, g);
      }
    }
  }
  return ja(d, b, g, f);
};
L.prototype.add_result = function(a, b, c, d, e, f, g) {
  let h = [], k = g ? this.ctx : this.map;
  this.optimize || (k = ra(k, f, g, this.bidirectional));
  if (k) {
    let n = 0;
    const p = Math.min(k.length, g ? this.resolution_ctx : this.resolution);
    for (let q = 0, t = 0, m, l; q < p; q++) {
      if (m = k[q]) {
        if (this.optimize && (m = ra(m, f, g, this.bidirectional)), d && m && e && (l = m.length, l <= d ? (d -= l, m = null) : (m = m.slice(d), d = 0)), m && (h[n++] = m, e && (t += m.length, t >= c))) {
          break;
        }
      }
    }
    if (n) {
      if (e) {
        return qa(h, c, 0);
      }
      a[a.length] = h;
      return;
    }
  }
  return !b && h;
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
      N(this.map, a, this.resolution, this.optimize), this.depth && N(this.ctx, a, this.resolution_ctx, this.optimize);
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
L.prototype.searchCache = la;
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
  pa(a, b || this, c ? c + "." + f : f, d, e, g);
  return !0;
};
L.prototype.import = function(a, b) {
  if (b) {
    switch(y(b) && (b = JSON.parse(b)), a) {
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
;let ta = 0;
function P(a) {
  var b;
  a ? C(b = a.encode) && (a.encode = b.toString()) : a = {};
  (b = (self || window)._factory) && (b = b.toString());
  const c = self.exports, d = this;
  this.worker = ua(b, c, a.worker);
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
    C(d) && (e = d, c.splice(c.length - 1, 1));
    d = new Promise(function(f) {
      setTimeout(function() {
        b.resolver[++ta] = f;
        b.worker.postMessage({task:a, id:ta, args:c});
      });
    });
    return e ? (d.then(e), this) : d;
  };
}
function ua(a, b, c) {
  let d;
  try {
    d = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + sa.toString()], {type:"text/javascript"}))) : new Worker(y(c) ? c : "worker/worker.js", {type:"module"});
  } catch (e) {
  }
  return d;
}
;function R(a) {
  if (!(this instanceof R)) {
    return new R(a);
  }
  var b = a.document || a.doc || a, c;
  this.tree = [];
  this.field = [];
  this.marker = [];
  this.register = w();
  this.key = (c = b.key || b.id) && S(c, this.marker) || "id";
  this.fastupdate = r(a.fastupdate, !0);
  this.storetree = (c = b.store) && !0 !== c && [];
  this.store = c && w();
  this.tag = (c = b.tag) && S(c, this.marker);
  this.tagindex = c && w();
  this.cache = (c = a.cache) && new K(c);
  a.cache = !1;
  this.worker = a.worker;
  this.async = !1;
  c = w();
  let d = b.index || b.field || b;
  y(d) && (d = [d]);
  for (let e = 0, f, g; e < d.length; e++) {
    f = d[e], y(f) || (g = f, f = f.field), g = z(g) ? Object.assign({}, a, g) : a, this.worker && (c[f] = new P(g), c[f].worker || (this.worker = !1)), this.worker || (c[f] = new L(g, this.register)), this.tree[e] = S(f, this.marker), this.field[e] = f;
  }
  if (this.storetree) {
    for (a = b.store, y(a) && (a = [a]), b = 0; b < a.length; b++) {
      this.storetree[b] = S(a[b], this.marker);
    }
  }
  this.index = c;
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
  if (y(b)) {
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
        b = b[e] || (b[e] = w()), e = c[++d], U(a, b, c, d, e);
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
  z(a) && (b = a, a = T(b, this.key));
  if (b && (a || 0 === a)) {
    if (this.register[a]) {
      return this.update(a, b);
    }
    for (let d = 0, e, f; d < this.field.length; d++) {
      f = this.field[d], e = this.tree[d], y(e) && (e = [e]), W(b, e, this.marker, 0, this.index[f], a, e[0], c);
    }
    if (this.tag) {
      let d = T(b, this.tag), e = w();
      y(d) && (d = [d]);
      for (let f = 0, g, h; f < d.length; f++) {
        if (g = d[f], !e[g] && (e[g] = 1, h = this.tagindex[g] || (this.tagindex[g] = []), !c || -1 === h.indexOf(a))) {
          if (h[h.length] = a, this.fastupdate) {
            const k = this.register[a] || (this.register[a] = []);
            k[k.length] = h;
          }
        }
      }
    }
    if (this.store) {
      let d;
      if (this.storetree) {
        d = w();
        for (let e = 0, f; e < this.storetree.length; e++) {
          f = this.storetree[e], y(f) ? d[f] = b[f] : U(b, d, f, 0, f[0]);
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
  z(a) && (a = T(a, this.key));
  if (this.register[a]) {
    var b = this.fastupdate && !this.worker;
    for (var c = 0; c < this.field.length && (this.index[this.field[c]].remove(a, b), !b); c++) {
    }
    if (this.tag && !b) {
      for (let d in this.tagindex) {
        b = this.tagindex[d], c = b.indexOf(a), -1 !== c && (1 < b.length ? b.splice(c, 1) : delete this.tagindex[d]);
      }
    }
    this.store && delete this.store[a];
    delete this.register[a];
  }
  return this;
};
R.prototype.search = function(a, b, c, d) {
  z(a) ? (c = a, a = c.query) : z(b) && (c = b, b = 0);
  let e = [], f = [], g, h, k, n, p, q, t = 0;
  if (c) {
    if (c.constructor === Array) {
      k = c, c = null;
    } else {
      k = (g = c.pluck) || c.index || c.field || c;
      n = c.tag;
      h = this.store && c.enrich;
      p = "and" === c.bool;
      b = c.limit || 100;
      q = c.offset || 0;
      if (n && (y(n) && (n = [n]), !a)) {
        for (let l = 0, u; l < n.length; l++) {
          if (u = va.call(this, n[l], b, q, h)) {
            e[e.length] = u, t++;
          }
        }
        return t ? e : [];
      }
      y(k) ? k = [k] : k.constructor === Array || (k = null);
    }
  }
  k || (k = this.field);
  p = p && (1 < k.length || n && 1 < n.length);
  const m = !d && (this.worker || this.async) && [];
  for (let l = 0, u, x, A; l < k.length; l++) {
    let B;
    x = k[l];
    y(x) || (B = x, x = x.field);
    if (m) {
      m[l] = this.index[x].searchAsync(a, b, B || c);
    } else {
      A = (u = d ? d[l] : this.index[x].search(a, b, B || c)) && u.length;
      if (n && A) {
        const D = [];
        let ma = 0;
        p && (D[0] = [u]);
        for (let V = 0, na, O; V < n.length; V++) {
          if (na = n[V], A = (O = this.tagindex[na]) && O.length) {
            ma++, D[D.length] = p ? [O] : O;
          }
        }
        ma && (u = p ? ja(D, b || 100, q || 0) : ka(u, D), A = u.length);
      }
      if (A) {
        f[t] = x, e[t++] = u;
      } else {
        if (p) {
          return [];
        }
      }
    }
  }
  if (m) {
    const l = this;
    return new Promise(function(u) {
      Promise.all(m).then(function(x) {
        u(l.search(a, b, c, x));
      });
    });
  }
  if (!t) {
    return [];
  }
  if (g && (!h || !this.store)) {
    return e[0];
  }
  for (let l = 0, u; l < f.length; l++) {
    u = e[l];
    u.length && h && (u = wa.call(this, u));
    if (g) {
      return u;
    }
    e[l] = {field:f[l], result:u};
  }
  return e;
};
function va(a, b, c, d) {
  let e = this.tagindex[a], f = e && e.length - c;
  if (f && 0 < f) {
    if (f > b || c) {
      e = e.slice(c, c + b);
    }
    d && (e = wa.call(this, e));
    return {tag:a, result:e};
  }
}
function wa(a) {
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
    switch(y(b) && (b = JSON.parse(b)), a) {
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
var ya = {encode:xa, rtl:!1, tokenize:""};
const za = /[\W_]+/, Aa = F("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), Ba = F("[\u00e8\u00e9\u00ea\u00eb]"), Ca = F("[\u00ec\u00ed\u00ee\u00ef]"), Da = F("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), Ea = F("[\u00f9\u00fa\u00fb\u00fc\u0171]"), Fa = F("[\u00fd\u0177\u00ff]"), Ga = F("\u00f1"), Ha = F("[\u00e7c]"), Ia = F("\u00df"), Ja = F(" & "), Ka = [Aa, "a", Ba, "e", Ca, "i", Da, "o", Ea, "u", Fa, "y", Ga, "n", Ha, "k", Ia, "s", Ja, " and "];
function xa(a) {
  return this.pipeline(E(a).toLowerCase(), !a.normalize && Ka, za, !1);
}
;var Ma = {encode:La, rtl:!1, tokenize:"strict"};
const Na = /[^a-z0-9]+/, Oa = {b:"p", v:"f", w:"f", z:"s", x:"s", "\u00df":"s", d:"t", n:"m", c:"k", g:"k", j:"k", q:"k", i:"e", y:"e", u:"o"};
function La(a) {
  a = xa.call(this, a).join(" ");
  const b = [];
  if (a) {
    const c = a.split(Na), d = c.length;
    for (let e = 0, f, g = 0; e < d; e++) {
      if ((a = c[e]) && (!this.filter || !this.filter[a])) {
        f = a[0];
        let h = Oa[f] || f, k = h;
        for (let n = 1; n < a.length; n++) {
          f = a[n];
          const p = Oa[f] || f;
          p && p !== k && (h += p, k = p);
        }
        b[g++] = h;
      }
    }
  }
  return b;
}
;var Qa = {encode:Pa, rtl:!1, tokenize:""};
const Ra = F("ae"), Sa = F("oe"), Ta = F("sh"), Ua = F("th"), Va = F("ph"), Wa = F("pf"), Xa = [Ra, "a", Sa, "o", Ta, "s", Ua, "t", Va, "f", Wa, "f", ];
function Pa(a, b) {
  a && (a = La.call(this, a).join(" "), 2 < a.length && (a = G(a, Xa)), b || (1 < a.length && (a = H(a)), a && (a = a.split(" "))));
  return a;
}
;var Za = {encode:Ya, rtl:!1, tokenize:""};
const $a = F("(?!\\b)[aeiouy]");
function Ya(a) {
  a && (a = Pa.call(this, a, !0), 1 < a.length && (a = a.replace($a, "")), 1 < a.length && (a = H(a)), a && (a = a.split(" ")));
  return a;
}
;I["latin:default"] = ea;
I["latin:simple"] = ya;
I["latin:balance"] = Ma;
I["latin:advanced"] = Qa;
I["latin:extra"] = Za;
const X = self;
let Y;
const Z = {Index:L, Document:R, Worker:P, registerCharset:function(a, b) {
  I[a] = b;
}, registerLanguage:function(a, b) {
  ha[a] = b;
}};
(Y = X.define) && Y.amd ? Y([], function() {
  return Z;
}) : X.exports ? X.exports = Z : X.FlexSearch = Z;
}(this));
