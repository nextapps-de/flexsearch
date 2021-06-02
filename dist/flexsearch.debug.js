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
function y(a) {
  return "string" === typeof a;
}
function A(a) {
  return "object" === typeof a;
}
function D(a) {
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
  for (let h = 0, k, m; h < d; h++) {
    k = c[h], (m = a[k]) ? (e[g++] = F(b ? "(?!\\b)" + k + "(\\b|_)" : k), e[g++] = m) : f += (f ? "|" : "") + k;
  }
  f && (e[g++] = F(b ? "(?!\\b)(" + f + ")(\\b|_)" : "(" + f + ")"), e[g] = "");
  return e;
}
function H(a, b) {
  for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
function F(a) {
  return new RegExp(a, "g");
}
function I(a) {
  let b = "", c = "";
  for (let d = 0, e = a.length, f; d < e; d++) {
    (f = a[d]) !== c && (b += c = f);
  }
  return b;
}
;const da = /[\W_]+/;
function ea(a) {
  return this.pipeline(E(a).toLowerCase(), !1, da, !1);
}
;const fa = {}, J = {};
function ha(a) {
  K(a, "add");
  K(a, "append");
  K(a, "search");
  K(a, "update");
  K(a, "remove");
}
function K(a, b) {
  a[b + "Async"] = function() {
    const c = this, d = arguments;
    var e = d[d.length - 1];
    let f;
    D(e) && (f = e, delete d[d.length - 1]);
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
;function ia(a, b, c, d) {
  const e = a.length;
  let f = [], g;
  let h, k;
  for (var m = 0; m < e; m++) {
    var n = a[m], r = n.length, u = 0;
    for (let l = 0, q; l < r; l++) {
      (q = n[l]) && (u += q.length);
    }
    if (!p || u < p) {
      var p = u;
      h = n;
      k = m;
    }
  }
  h = 1 === h.length ? h[0] : [].concat.apply([], h);
  d && (d = [h], g = w());
  m = p = 0;
  for (n = e - 1; 0 <= n; n--) {
    if (n !== k) {
      m++;
      r = a[n];
      u = r.length;
      const l = [];
      let q = 0;
      for (let x = 0, z; x < h.length; x++) {
        z = h[x];
        let B;
        for (let C = 0; C < u; C++) {
          const G = r[C];
          if (G.length && (B = -1 !== G.indexOf(z))) {
            if (m === e - 1) {
              if (c) {
                c--;
              } else {
                if (f[p++] = z, p === b) {
                  return f;
                }
              }
              d && (g[z] = 1);
            }
            break;
          }
        }
        B && (l[q++] = z);
      }
      if (d) {
        d[m] = l;
      } else {
        if (!q) {
          return [];
        }
      }
      h = l;
    }
  }
  if (d) {
    for (let l = d.length - 1, q, x; 0 <= l; l--) {
      if (x = (q = d[l]) && q.length) {
        for (let z = 0, B; z < x; z++) {
          if (B = q[z], !g[B]) {
            if (g[B] = 1, c) {
              c--;
            } else {
              if (f[p++] = B, p === b) {
                return f;
              }
            }
          }
        }
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
;function L(a) {
  this.limit = !0 !== a && a;
  this.cache = w();
  this.queue = [];
}
function ka(a, b, c) {
  A(a) && (a = a.query);
  let d = this.cache.get(a);
  d || (d = this.search(a, b, c), this.cache.set(a, d));
  return d;
}
L.prototype.set = function(a, b) {
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
L.prototype.get = function(a) {
  const b = this.cache[a];
  if (this.limit && b && (a = this.queue.indexOf(a))) {
    const c = this.queue[a - 1];
    this.queue[a - 1] = this.queue[a];
    this.queue[a] = c;
  }
  return b;
};
L.prototype.del = function(a) {
  for (let b = 0, c, d; b < this.queue.length; b++) {
    d = this.queue[b], c = this.cache[d], -1 !== c.indexOf(a) && (this.queue.splice(b--, 1), delete this.cache[d]);
  }
};
const la = {memory:{charset:"latin:extra", resolution:3, minlength:3, fastupdate:!1, optimize:"memory"}, performance:{threshold:8, minlength:3, context:{depth:1, bidirectional:!0}}, match:{charset:"latin:extra", tokenize:"full", resolution:3, }, score:{charset:"latin:advanced", threshold:1, context:{depth:3, bidirectional:!0}}, "default":{resolution:3, threshold:0, depth:3}, };
function na(a, b, c, d, e, f) {
  setTimeout(function() {
    const g = a(c, JSON.stringify(f));
    g && g.then ? g.then(function() {
      b.export(a, b, c, d, e + 1);
    }) : b.export(a, b, c, d, e + 1);
  });
}
;J["latin:default"] = ea;
function M(a, b) {
  if (!(this instanceof M)) {
    return new M(a);
  }
  var c;
  if (a) {
    if (y(a)) {
      la[a] || console.warn("Preset not found: " + a), a = la[a];
    } else {
      if (c = a.preset) {
        c[c] || console.warn("Preset not found: " + c), a = Object.assign({}, c[c], a);
      }
    }
    c = a.charset;
    var d = a.lang;
    y(c) && (-1 === c.indexOf(":") && (c += ":default"), c = J[c]);
    y(d) && (d = fa[d]);
  } else {
    a = {};
  }
  let e, f, g = a.context || {};
  this.encode = a.encode || c && c.encode || ea;
  this.register = b || w();
  this.resolution = e = a.resolution || 9;
  this.tokenizer = b = c && c.tokenize || a.tokenize || "strict";
  this.depth = "strict" === b && g.depth;
  this.bidirectional = t(g.bidirectional, !0);
  this.optimize = f = "memory" === a.optimize;
  this.fastupdate = t(a.fastupdate, !0);
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
  this.cache = (b = a.cache) && new L(b);
}
M.prototype.pipeline = function(a, b, c, d) {
  if (a && (b && (a = H(a, b)), this.matcher && (a = H(a, this.matcher)), this.stemmer && 1 < a.length && (a = H(a, this.stemmer)), d && 1 < a.length && (a = I(a)), c || "" === c)) {
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
M.prototype.append = function(a, b) {
  return this.add(a, b, !0);
};
M.prototype.add = function(a, b, c, d) {
  if (!d && !c && this.register[a]) {
    return this.update(a, b);
  }
  if (b && (a || 0 === a) && (b = this.encode(b), d = b.length)) {
    const m = this.depth, n = this.resolution, r = w(), u = w();
    for (let p = 0; p < d; p++) {
      let l = b[this.rtl ? d - 1 - p : p];
      var e = l.length;
      if (l && e >= this.minlength && (m || !r[l])) {
        var f = Math.min(n / d * p | 0, p), g = "";
        switch(this.tokenizer) {
          case "full":
            if (3 < e) {
              for (var h = 0; h < e; h++) {
                var k = h ? Math.min(f / 2 + n / e * h / 2 | 0, f + h) : f;
                for (let q = e; q > h; q--) {
                  g = l.substring(h, q), g.length >= this.minlength && this.push_index(r, g, k, a, c);
                }
              }
              break;
            }
          case "reverse":
            if (2 < e) {
              for (h = e - 1; 0 < h; h--) {
                g = l[h] + g, g.length >= this.minlength && this.push_index(r, g, f, a, c);
              }
              g = "";
            }
          case "forward":
            if (1 < e) {
              for (h = 0; h < e; h++) {
                g += l[h], g.length >= this.minlength && this.push_index(r, g, f, a, c);
              }
            }
            break;
          default:
            if (this.push_index(r, l, f, a, c), m && 1 < d && p < d - 1) {
              for (e = w(), f = l, g = Math.min(m + 1, d - p), e[f] = 1, h = 1; h < g; h++) {
                (l = b[this.rtl ? d - 1 - p - h : p + h]) && l.length >= this.minlength && !e[l] ? (e[l] = 1, k = this.bidirectional && l > f, this.push_index(u, k ? f : l, 0, a, c, k ? l : f)) : g = Math.min(g + 1, d - p);
              }
            }
        }
      }
    }
    this.fastupdate || (this.register[a] = 1);
  }
  return this;
};
M.prototype.push_index = function(a, b, c, d, e, f) {
  let g = f ? this.ctx : this.map;
  if (!a[b] || f && !a[b][f]) {
    this.optimize && (g = g[c]), f ? (a = a[b] || (a[b] = w()), a[f] = 1, g = g[f] || (g[f] = w())) : a[b] = 1, g = g[b] || (g[b] = []), this.optimize || (g = g[c] || (g[c] = [])), e && -1 !== g.indexOf(d) || (g[g.length] = d, this.fastupdate && (a = this.register[d] || (this.register[d] = []), a[a.length] = g));
  }
};
M.prototype.search = function(a, b, c) {
  A(a) ? (c = a, a = c.query) : A(b) && (c = b);
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
    for (let n = 0, r = 0, u; n < e; n++) {
      if ((u = a[n]) && u.length >= this.minlength && !c[u]) {
        if (this.optimize || f || this.map[u]) {
          k[r++] = u, c[u] = 1;
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
  let m;
  h ? (m = a[0], c = 1) : 1 < e && a.sort(aa);
  for (let n, r; c < e; c++) {
    r = a[c];
    h ? (n = this.add_result(d, f, b, g, 2 === e, r, m), f && !1 === n && d.length || (m = r)) : n = this.add_result(d, f, b, g, 1 === e, r);
    if (n) {
      return n;
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
        return oa(d[0], b, g);
      }
    }
  }
  return ia(d, b, g, f);
};
M.prototype.add_result = function(a, b, c, d, e, f, g) {
  let h = [], k = g ? this.ctx : this.map;
  this.optimize || (k = pa(k, f, g, this.bidirectional));
  if (k) {
    let m = 0;
    const n = Math.min(k.length, g ? this.resolution_ctx : this.resolution);
    for (let r = 0, u = 0, p, l; r < n; r++) {
      if (p = k[r]) {
        if (this.optimize && (p = pa(p, f, g, this.bidirectional)), d && p && e && (l = p.length, l <= d ? (d -= l, p = null) : (p = p.slice(d), d = 0)), p && (h[m++] = p, e && (u += p.length, u >= c))) {
          break;
        }
      }
    }
    if (m) {
      if (e) {
        return oa(h, c, 0);
      }
      a[a.length] = h;
      return;
    }
  }
  return !b && h;
};
function oa(a, b, c) {
  a = 1 === a.length ? a[0] : [].concat.apply([], a);
  return c || a.length > b ? a.slice(c, c + b) : a;
}
function pa(a, b, c, d) {
  c ? (d = d && b > c, a = (a = a[d ? b : c]) && a[d ? c : b]) : a = a[b];
  return a;
}
M.prototype.contain = function(a) {
  return !!this.register[a];
};
M.prototype.update = function(a, b) {
  return this.remove(a).add(a, b);
};
M.prototype.remove = function(a, b) {
  const c = this.register[a];
  if (c) {
    if (this.fastupdate) {
      for (let d = 0, e; d < c.length; d++) {
        e = c[d], e.splice(e.indexOf(a), 1);
      }
    } else {
      O(this.map, a, this.resolution, this.optimize), this.depth && O(this.ctx, a, this.resolution_ctx, this.optimize);
    }
    b || delete this.register[a];
    this.cache && this.cache.del(a);
  }
  return this;
};
function O(a, b, c, d, e) {
  let f = 0;
  if (a.constructor === Array) {
    if (e) {
      b = a.indexOf(b), -1 !== b ? 1 < a.length && (a.splice(b, 1), f++) : f++;
    } else {
      e = Math.min(a.length, c);
      for (let g = 0, h; g < e; g++) {
        if (h = a[g]) {
          f = O(h, b, c, d, e), d || f || delete a[g];
        }
      }
    }
  } else {
    for (let g in a) {
      (f = O(a[g], b, c, d, e)) || delete a[g];
    }
  }
  return f;
}
M.prototype.searchCache = ka;
M.prototype.export = function(a, b, c, d, e) {
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
  na(a, b || this, c ? c + "." + f : f, d, e, g);
  return !0;
};
M.prototype.import = function(a, b) {
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
ha(M.prototype);
function qa(a) {
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
      a ? (Function("return " + a)()(self), self._index = new self.FlexSearch.Index(d), delete self.FlexSearch) : self._index = new M(d);
      break;
    default:
      a = a.id, b = b[d].apply(b, c), postMessage("search" === d ? {id:a, msg:b} : {id:a});
  }
}
;let ra = 0;
function P(a) {
  var b;
  a ? D(b = a.encode) && (a.encode = b.toString()) : a = {};
  (b = (self || window)._factory) && (b = b.toString());
  const c = self.exports, d = this;
  this.worker = sa(b, c, a.worker);
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
    D(d) && (e = d, c.splice(c.length - 1, 1));
    d = new Promise(function(f) {
      setTimeout(function() {
        b.resolver[++ra] = f;
        b.worker.postMessage({task:a, id:ra, args:c});
      });
    });
    return e ? (d.then(e), this) : d;
  };
}
function sa(a, b, c) {
  let d;
  try {
    d = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + qa.toString()], {type:"text/javascript"}))) : new Worker(y(c) ? c : "worker/worker.js", {type:"module"});
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
  this.fastupdate = t(a.fastupdate, !0);
  this.storetree = (c = b.store) && !0 !== c && [];
  this.store = c && w();
  this.tag = (c = b.tag) && S(c, this.marker);
  this.tagindex = c && w();
  this.cache = (c = a.cache) && new L(c);
  a.cache = !1;
  this.worker = a.worker;
  this.async = !1;
  c = w();
  let d = b.index || b.field || b;
  y(d) && (d = [d]);
  for (let e = 0, f, g; e < d.length; e++) {
    f = d[e], y(f) || (g = f, f = f.field), g = A(g) ? Object.assign({}, a, g) : a, this.worker && (c[f] = new P(g), c[f].worker || (this.worker = !1)), this.worker || (c[f] = new M(g, this.register)), this.tree[e] = S(f, this.marker), this.field[e] = f;
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
  A(a) && (b = a, a = T(b, this.key));
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
    this.store && delete this.store[a];
    delete this.register[a];
  }
  return this;
};
R.prototype.search = function(a, b, c, d) {
  A(a) ? (c = a, a = c.query) : A(b) && (c = b, b = 0);
  let e = [], f = [], g, h, k, m, n, r, u = 0;
  if (c) {
    if (c.constructor === Array) {
      k = c, c = null;
    } else {
      k = (g = c.pluck) || c.index || c.field || c;
      m = c.tag;
      h = this.store && c.enrich;
      n = "and" === c.bool;
      b = c.limit || 100;
      r = c.offset || 0;
      if (m && (y(m) && (m = [m]), !a)) {
        for (let l = 0, q; l < m.length; l++) {
          if (q = ta.call(this, m[l], b, r, h)) {
            e[e.length] = q, u++;
          }
        }
        return u ? e : [];
      }
      y(k) ? k = [k] : k.constructor === Array || (k = null);
    }
  }
  k || (k = this.field);
  n = n && (1 < k.length || m && 1 < m.length);
  const p = !d && (this.worker || this.async) && [];
  for (let l = 0, q, x, z; l < k.length; l++) {
    let B;
    x = k[l];
    y(x) || (B = x, x = x.field);
    if (p) {
      p[l] = this.index[x].searchAsync(a, b, B || c);
    } else {
      z = (q = d ? d[l] : this.index[x].search(a, b, B || c)) && q.length;
      if (m && z) {
        const C = [];
        let G = 0;
        n && (C[0] = [q]);
        for (let V = 0, ma, N; V < m.length; V++) {
          if (ma = m[V], z = (N = this.tagindex[ma]) && N.length) {
            G++, C[C.length] = n ? [N] : N;
          }
        }
        G && (q = n ? ia(C, b || 100, r || 0) : ja(q, C), z = q.length);
      }
      if (z) {
        f[u] = x, e[u++] = q;
      } else {
        if (n) {
          return [];
        }
      }
    }
  }
  if (p) {
    const l = this;
    return new Promise(function(q) {
      Promise.all(p).then(function(x) {
        q(l.search(a, b, c, x));
      });
    });
  }
  if (!u) {
    return [];
  }
  if (g && (!h || !this.store)) {
    return e[0];
  }
  for (let l = 0, q; l < f.length; l++) {
    q = e[l];
    q.length && h && (q = ua.call(this, q));
    if (g) {
      return q;
    }
    e[l] = {field:f[l], result:q};
  }
  return e;
};
function ta(a, b, c, d) {
  let e = this.tagindex[a], f = e && e.length - c;
  if (f && 0 < f) {
    if (f > b || c) {
      e = e.slice(c, c + b);
    }
    d && (e = ua.call(this, e));
    return {tag:a, result:e};
  }
}
function ua(a) {
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
R.prototype.searchCache = ka;
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
    na(a, this, c, d, e, f);
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
ha(R.prototype);
var wa = {encode:va, rtl:!1, tokenize:""};
const xa = /[\W_]+/, ya = F("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), za = F("[\u00e8\u00e9\u00ea\u00eb]"), Aa = F("[\u00ec\u00ed\u00ee\u00ef]"), Ba = F("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), Ca = F("[\u00f9\u00fa\u00fb\u00fc\u0171]"), Da = F("[\u00fd\u0177\u00ff]"), Ea = F("\u00f1"), Fa = F("[\u00e7c]"), Ga = F("\u00df"), Ha = F(" & "), Ia = [ya, "a", za, "e", Aa, "i", Ba, "o", Ca, "u", Da, "y", Ea, "n", Fa, "k", Ga, "s", Ha, " and "];
function va(a) {
  return this.pipeline(E(a).toLowerCase(), !a.normalize && Ia, xa, !1);
}
;var Ka = {encode:Ja, rtl:!1, tokenize:"strict"};
const La = /[^a-z0-9]+/, Ma = {b:"p", v:"f", w:"f", z:"s", x:"s", "\u00df":"s", d:"t", n:"m", c:"k", g:"k", j:"k", q:"k", i:"e", y:"e", u:"o"};
function Ja(a) {
  a = va.call(this, a).join(" ");
  const b = [];
  if (a) {
    const c = a.split(La), d = c.length;
    for (let e = 0, f, g = 0; e < d; e++) {
      if ((a = c[e]) && (!this.filter || !this.filter[a])) {
        f = a[0];
        let h = Ma[f] || f, k = h;
        for (let m = 1; m < a.length; m++) {
          f = a[m];
          const n = Ma[f] || f;
          n && n !== k && (h += n, k = n);
        }
        b[g++] = h;
      }
    }
  }
  return b;
}
;var Oa = {encode:Na, rtl:!1, tokenize:""};
const Pa = F("ae"), Qa = F("oe"), Ra = F("sh"), Sa = F("th"), Ta = F("ph"), Ua = F("pf"), Va = [Pa, "a", Qa, "o", Ra, "s", Sa, "t", Ta, "f", Ua, "f", ];
function Na(a, b) {
  a && (a = Ja.call(this, a).join(" "), 2 < a.length && (a = H(a, Va)), b || (1 < a.length && (a = I(a)), a && (a = a.split(" "))));
  return a;
}
;var Xa = {encode:Wa, rtl:!1, tokenize:""};
const Ya = F("(?!\\b)[aeiouy]");
function Wa(a) {
  a && (a = Na.call(this, a, !0), 1 < a.length && (a = a.replace(Ya, "")), 1 < a.length && (a = I(a)), a && (a = a.split(" ")));
  return a;
}
;J["latin:simple"] = wa;
J["latin:balance"] = Ka;
J["latin:advanced"] = Oa;
J["latin:extra"] = Xa;
const X = self;
let Y;
const Z = {Index:M, Document:R, Worker:P, registerCharset:function(a, b) {
  J[a] = b;
}, registerLanguage:function(a, b) {
  fa[a] = b;
}};
(Y = X.define) && Y.amd ? Y([], function() {
  return Z;
}) : X.exports ? X.exports = Z : X.FlexSearch = Z;
}(this));
