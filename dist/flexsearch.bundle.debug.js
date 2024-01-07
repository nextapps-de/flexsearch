/**!
 * FlexSearch.js v0.7.39 (Bundle)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _factory(self){'use strict';
var t;
function u(a) {
  return "undefined" !== typeof a ? a : !0;
}
function aa(a) {
  const b = Array(a);
  for (let c = 0; c < a; c++) {
    b[c] = v();
  }
  return b;
}
function v() {
  return Object.create(null);
}
function ba(a, b) {
  return b.length - a.length;
}
function x(a) {
  return "string" === typeof a;
}
function C(a) {
  return "object" === typeof a;
}
function D(a) {
  return "function" === typeof a;
}
;function ca(a, b) {
  var c = da;
  if (a && (b && (a = E(a, b)), this.H && (a = E(a, this.H)), this.J && 1 < a.length && (a = E(a, this.J)), c || "" === c)) {
    b = a.split(c);
    if (this.filter) {
      a = this.filter;
      c = b.length;
      const d = [];
      for (let e = 0, f = 0; e < c; e++) {
        const h = b[e];
        h && !a[h] && (d[f++] = h);
      }
      a = d;
    } else {
      a = b;
    }
    return a;
  }
  return a;
}
const da = /[\p{Z}\p{S}\p{P}\p{C}]+/u, ea = /[\u0300-\u036f]/g;
function fa(a, b) {
  const c = Object.keys(a), d = c.length, e = [];
  let f = "", h = 0;
  for (let g = 0, k, m; g < d; g++) {
    k = c[g], (m = a[k]) ? (e[h++] = F(b ? "(?!\\b)" + k + "(\\b|_)" : k), e[h++] = m) : f += (f ? "|" : "") + k;
  }
  f && (e[h++] = F(b ? "(?!\\b)(" + f + ")(\\b|_)" : "(" + f + ")"), e[h] = "");
  return e;
}
function E(a, b) {
  for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
function F(a) {
  return new RegExp(a, "g");
}
function ha(a) {
  let b = "", c = "";
  for (let d = 0, e = a.length, f; d < e; d++) {
    (f = a[d]) !== c && (b += c = f);
  }
  return b;
}
;var ja = {encode:ia, F:!1, G:""};
function ia(a) {
  return ca.call(this, ("" + a).toLowerCase(), !1);
}
;const ka = {}, G = {};
function la(a) {
  I(a, "add");
  I(a, "append");
  I(a, "search");
  I(a, "update");
  I(a, "remove");
}
function I(a, b) {
  a[b + "Async"] = function() {
    const c = this, d = arguments;
    var e = d[d.length - 1];
    let f;
    D(e) && (f = e, delete d[d.length - 1]);
    e = new Promise(function(h) {
      setTimeout(function() {
        c.async = !0;
        const g = c[b].apply(c, d);
        c.async = !1;
        h(g);
      });
    });
    return f ? (e.then(f), this) : e;
  };
}
;function ma(a, b, c, d) {
  const e = a.length;
  let f = [], h, g, k = 0;
  d && (d = []);
  for (let m = e - 1; 0 <= m; m--) {
    const n = a[m], w = n.length, q = v();
    let r = !h;
    for (let l = 0; l < w; l++) {
      const p = n[l], A = p.length;
      if (A) {
        for (let B = 0, z, y; B < A; B++) {
          if (y = p[B], h) {
            if (h[y]) {
              if (!m) {
                if (c) {
                  c--;
                } else {
                  if (f[k++] = y, k === b) {
                    return f;
                  }
                }
              }
              if (m || d) {
                q[y] = 1;
              }
              r = !0;
            }
            if (d && (z = (g[y] || 0) + 1, g[y] = z, z < e)) {
              const H = d[z - 2] || (d[z - 2] = []);
              H[H.length] = y;
            }
          } else {
            q[y] = 1;
          }
        }
      }
    }
    if (d) {
      h || (g = q);
    } else if (!r) {
      return [];
    }
    h = q;
  }
  if (d) {
    for (let m = d.length - 1, n, w; 0 <= m; m--) {
      n = d[m];
      w = n.length;
      for (let q = 0, r; q < w; q++) {
        if (r = n[q], !h[r]) {
          if (c) {
            c--;
          } else {
            if (f[k++] = r, k === b) {
              return f;
            }
          }
          h[r] = 1;
        }
      }
    }
  }
  return f;
}
function na(a, b) {
  const c = v(), d = v(), e = [];
  for (let f = 0; f < a.length; f++) {
    c[a[f]] = 1;
  }
  for (let f = 0, h; f < b.length; f++) {
    h = b[f];
    for (let g = 0, k; g < h.length; g++) {
      k = h[g], c[k] && !d[k] && (d[k] = 1, e[e.length] = k);
    }
  }
  return e;
}
;function J(a) {
  this.l = !0 !== a && a;
  this.cache = v();
  this.h = [];
}
function oa(a, b, c) {
  C(a) && (a = a.query);
  let d = this.cache.get(a);
  d || (d = this.search(a, b, c), this.cache.set(a, d));
  return d;
}
J.prototype.set = function(a, b) {
  if (!this.cache[a]) {
    var c = this.h.length;
    c === this.l ? delete this.cache[this.h[c - 1]] : c++;
    for (--c; 0 < c; c--) {
      this.h[c] = this.h[c - 1];
    }
    this.h[0] = a;
  }
  this.cache[a] = b;
};
J.prototype.get = function(a) {
  const b = this.cache[a];
  if (this.l && b && (a = this.h.indexOf(a))) {
    const c = this.h[a - 1];
    this.h[a - 1] = this.h[a];
    this.h[a] = c;
  }
  return b;
};
const pa = {memory:{charset:"latin:extra", D:3, B:4, m:!1}, performance:{D:3, B:3, s:!1, context:{depth:2, D:1}}, match:{charset:"latin:extra", G:"reverse"}, score:{charset:"latin:advanced", D:20, B:3, context:{depth:3, D:9}}, "default":{}};
function ra(a, b, c, d, e, f, h, g) {
  setTimeout(function() {
    const k = a(c ? c + "." + d : d, JSON.stringify(h));
    k && k.then ? k.then(function() {
      b.export(a, b, c, e, f + 1, g);
    }) : b.export(a, b, c, e, f + 1, g);
  });
}
;function K(a, b) {
  if (!(this instanceof K)) {
    return new K(a);
  }
  var c;
  if (a) {
    if (x(a)) {
      pa[a] || console.warn("Preset not found: " + a), a = pa[a];
    } else {
      if (c = a.preset) {
        c[c] || console.warn("Preset not found: " + c), a = Object.assign({}, c[c], a);
      }
    }
    c = a.charset;
    var d = a.lang;
    x(c) && (-1 === c.indexOf(":") && (c += ":default"), c = G[c]);
    x(d) && (d = ka[d]);
  } else {
    a = {};
  }
  let e, f, h = a.context || {};
  this.encode = a.encode || c && c.encode || ia;
  this.register = b || v();
  this.D = e = a.resolution || 9;
  this.G = b = c && c.G || a.tokenize || "strict";
  this.depth = "strict" === b && h.depth;
  this.l = u(h.bidirectional);
  this.s = f = u(a.optimize);
  this.m = u(a.fastupdate);
  this.B = a.minlength || 1;
  this.C = a.boost;
  this.map = f ? aa(e) : v();
  this.A = e = h.resolution || 1;
  this.h = f ? aa(e) : v();
  this.F = c && c.F || a.rtl;
  this.H = (b = a.matcher || d && d.H) && fa(b, !1);
  this.J = (b = a.stemmer || d && d.J) && fa(b, !0);
  if (c = b = a.filter || d && d.filter) {
    c = b;
    d = v();
    for (let g = 0, k = c.length; g < k; g++) {
      d[c[g]] = 1;
    }
    c = d;
  }
  this.filter = c;
  this.cache = (b = a.cache) && new J(b);
}
t = K.prototype;
t.append = function(a, b) {
  return this.add(a, b, !0);
};
t.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.register[a]) {
      return this.update(a, b);
    }
    b = this.encode(b);
    if (d = b.length) {
      const m = v(), n = v(), w = this.depth, q = this.D;
      for (let r = 0; r < d; r++) {
        let l = b[this.F ? d - 1 - r : r];
        var e = l.length;
        if (l && e >= this.B && (w || !n[l])) {
          var f = L(q, d, r), h = "";
          switch(this.G) {
            case "full":
              if (2 < e) {
                for (f = 0; f < e; f++) {
                  for (var g = e; g > f; g--) {
                    if (g - f >= this.B) {
                      var k = L(q, d, r, e, f);
                      h = l.substring(f, g);
                      M(this, n, h, k, a, c);
                    }
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (g = e - 1; 0 < g; g--) {
                  h = l[g] + h, h.length >= this.B && M(this, n, h, L(q, d, r, e, g), a, c);
                }
                h = "";
              }
            case "forward":
              if (1 < e) {
                for (g = 0; g < e; g++) {
                  h += l[g], h.length >= this.B && M(this, n, h, f, a, c);
                }
                break;
              }
            default:
              if (this.C && (f = Math.min(f / this.C(b, l, r) | 0, q - 1)), M(this, n, l, f, a, c), w && 1 < d && r < d - 1) {
                for (e = v(), h = this.A, f = l, g = Math.min(w + 1, d - r), e[f] = 1, k = 1; k < g; k++) {
                  if ((l = b[this.F ? d - 1 - r - k : r + k]) && l.length >= this.B && !e[l]) {
                    e[l] = 1;
                    const p = this.l && l > f;
                    M(this, m, p ? f : l, L(h + (d / 2 > h ? 0 : 1), d, r, g - 1, k - 1), a, c, p ? l : f);
                  }
                }
              }
          }
        }
      }
      this.m || (this.register[a] = 1);
    }
  }
  return this;
};
function L(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
function M(a, b, c, d, e, f, h) {
  let g = h ? a.h : a.map;
  if (!b[c] || h && !b[c][h]) {
    a.s && (g = g[d]), h ? (b = b[c] || (b[c] = v()), b[h] = 1, g = g[h] || (g[h] = v())) : b[c] = 1, g = g[c] || (g[c] = []), a.s || (g = g[d] || (g[d] = [])), f && g.includes(e) || (g[g.length] = e, a.m && (a = a.register[e] || (a.register[e] = []), a[a.length] = g));
  }
}
t.search = function(a, b, c) {
  c || (!b && C(a) ? (c = a, a = c.query) : C(b) && (c = b));
  let d = [], e;
  let f, h = 0;
  if (c) {
    a = c.query || a;
    b = c.limit;
    h = c.offset || 0;
    var g = c.context;
    f = c.suggest;
  }
  if (a && (a = this.encode("" + a), e = a.length, 1 < e)) {
    c = v();
    var k = [];
    for (let n = 0, w = 0, q; n < e; n++) {
      if ((q = a[n]) && q.length >= this.B && !c[q]) {
        if (this.s || f || this.map[q]) {
          k[w++] = q, c[q] = 1;
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
  g = this.depth && 1 < e && !1 !== g;
  c = 0;
  let m;
  g ? (m = a[0], c = 1) : 1 < e && a.sort(ba);
  for (let n, w; c < e; c++) {
    w = a[c];
    g ? (n = sa(this, d, f, b, h, 2 === e, w, m), f && !1 === n && d.length || (m = w)) : n = sa(this, d, f, b, h, 1 === e, w);
    if (n) {
      return n;
    }
    if (f && c === e - 1) {
      k = d.length;
      if (!k) {
        if (g) {
          g = 0;
          c = -1;
          continue;
        }
        return d;
      }
      if (1 === k) {
        return ta(d[0], b, h);
      }
    }
  }
  return ma(d, b, h, f);
};
function sa(a, b, c, d, e, f, h, g) {
  let k = [], m = g ? a.h : a.map;
  a.s || (m = ua(m, h, g, a.l));
  if (m) {
    let n = 0;
    const w = Math.min(m.length, g ? a.A : a.D);
    for (let q = 0, r = 0, l, p; q < w; q++) {
      if (l = m[q]) {
        if (a.s && (l = ua(l, h, g, a.l)), e && l && f && (p = l.length, p <= e ? (e -= p, l = null) : (l = l.slice(e), e = 0)), l && (k[n++] = l, f && (r += l.length, r >= d))) {
          break;
        }
      }
    }
    if (n) {
      if (f) {
        return ta(k, d, 0);
      }
      b[b.length] = k;
      return;
    }
  }
  return !c && k;
}
function ta(a, b, c) {
  a = 1 === a.length ? a[0] : [].concat.apply([], a);
  return c || a.length > b ? a.slice(c, c + b) : a;
}
function ua(a, b, c, d) {
  c ? (d = d && b > c, a = (a = a[d ? b : c]) && a[d ? c : b]) : a = a[b];
  return a;
}
t.contain = function(a) {
  return !!this.register[a];
};
t.update = function(a, b) {
  return this.remove(a).add(a, b);
};
t.remove = function(a, b) {
  const c = this.register[a];
  if (c) {
    if (this.m) {
      for (let d = 0, e; d < c.length; d++) {
        e = c[d], e.splice(e.indexOf(a), 1);
      }
    } else {
      N(this.map, a, this.D, this.s), this.depth && N(this.h, a, this.A, this.s);
    }
    b || delete this.register[a];
    if (this.cache) {
      b = this.cache;
      for (let d = 0, e, f; d < b.h.length; d++) {
        f = b.h[d], e = b.cache[f], e.includes(a) && (b.h.splice(d--, 1), delete b.cache[f]);
      }
    }
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
      for (let h = 0, g; h < e; h++) {
        if (g = a[h]) {
          f = N(g, b, c, d, e), d || f || delete a[h];
        }
      }
    }
  } else {
    for (let h in a) {
      (f = N(a[h], b, c, d, e)) || delete a[h];
    }
  }
  return f;
}
t.searchCache = oa;
t.export = function(a, b, c, d, e, f) {
  let h = !0;
  "undefined" === typeof f && (h = new Promise(m => {
    f = m;
  }));
  let g, k;
  switch(e || (e = 0)) {
    case 0:
      g = "reg";
      if (this.m) {
        k = v();
        for (let m in this.register) {
          k[m] = 1;
        }
      } else {
        k = this.register;
      }
      break;
    case 1:
      g = "cfg";
      k = {doc:0, opt:this.s ? 1 : 0};
      break;
    case 2:
      g = "map";
      k = this.map;
      break;
    case 3:
      g = "ctx";
      k = this.h;
      break;
    default:
      "undefined" === typeof c && f && f();
      return;
  }
  ra(a, b || this, c, g, d, e, k, f);
  return h;
};
t.import = function(a, b) {
  if (b) {
    switch(x(b) && (b = JSON.parse(b)), a) {
      case "cfg":
        this.s = !!b.opt;
        break;
      case "reg":
        this.m = !1;
        this.register = b;
        break;
      case "map":
        this.map = b;
        break;
      case "ctx":
        this.h = b;
    }
  }
};
la(K.prototype);
function va(a) {
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
      a ? (Function("return " + a)()(self), self._index = new self.FlexSearch.Index(d), delete self.FlexSearch) : self._index = new K(d);
      break;
    default:
      a = a.id, b = b[d].apply(b, c), postMessage("search" === d ? {id:a, msg:b} : {id:a});
  }
}
;let wa = 0;
function O(a) {
  if (!(this instanceof O)) {
    return new O(a);
  }
  var b;
  a ? D(b = a.encode) && (a.encode = b.toString()) : a = {};
  (b = (self || window)._factory) && (b = b.toString());
  const c = "undefined" === typeof window && self.exports, d = this;
  this.o = xa(b, c, a.worker);
  this.h = v();
  if (this.o) {
    if (c) {
      this.o.on("message", function(e) {
        d.h[e.id](e.msg);
        delete d.h[e.id];
      });
    } else {
      this.o.onmessage = function(e) {
        e = e.data;
        d.h[e.id](e.msg);
        delete d.h[e.id];
      };
    }
    this.o.postMessage({task:"init", factory:b, options:a});
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
    D(d) && (e = d, c.splice(c.length - 1, 1));
    d = new Promise(function(f) {
      setTimeout(function() {
        b.h[++wa] = f;
        b.o.postMessage({task:a, id:wa, args:c});
      });
    });
    return e ? (d.then(e), this) : d;
  };
}
function xa(a, b, c) {
  let d;
  try {
    d = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + va.toString()], {type:"text/javascript"}))) : new Worker(x(c) ? c : "worker/worker.js", {type:"module"});
  } catch (e) {
  }
  return d;
}
;function Q(a) {
  if (!(this instanceof Q)) {
    return new Q(a);
  }
  var b = a.document || a.doc || a, c;
  this.K = [];
  this.h = [];
  this.A = [];
  this.register = v();
  this.key = (c = b.key || b.id) && S(c, this.A) || "id";
  this.m = u(a.fastupdate);
  this.C = (c = b.store) && !0 !== c && [];
  this.store = c && v();
  this.I = (c = b.tag) && S(c, this.A);
  this.l = c && v();
  this.cache = (c = a.cache) && new J(c);
  a.cache = !1;
  this.o = a.worker;
  this.async = !1;
  c = v();
  let d = b.index || b.field || b;
  x(d) && (d = [d]);
  for (let e = 0, f, h; e < d.length; e++) {
    f = d[e], x(f) || (h = f, f = f.field), h = C(h) ? Object.assign({}, a, h) : a, this.o && (c[f] = new O(h), c[f].o || (this.o = !1)), this.o || (c[f] = new K(h, this.register)), this.K[e] = S(f, this.A), this.h[e] = f;
  }
  if (this.C) {
    for (a = b.store, x(a) && (a = [a]), b = 0; b < a.length; b++) {
      this.C[b] = S(a[b], this.A);
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
  if (x(b)) {
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
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
        U(a, b, c, d, e);
      }
    } else {
      b = b[e] || (b[e] = v()), e = c[++d], U(a, b, c, d, e);
    }
  }
}
function V(a, b, c, d, e, f, h, g) {
  if (a = a[h]) {
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
      e.add(f, a, g, !0);
    } else {
      if (a.constructor === Array) {
        for (h = 0; h < a.length; h++) {
          V(a, b, c, d, e, f, h, g);
        }
      } else {
        h = b[++d], V(a, b, c, d, e, f, h, g);
      }
    }
  }
}
t = Q.prototype;
t.add = function(a, b, c) {
  C(a) && (b = a, a = T(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.register[a]) {
      return this.update(a, b);
    }
    for (let d = 0, e, f; d < this.h.length; d++) {
      f = this.h[d], e = this.K[d], x(e) && (e = [e]), V(b, e, this.A, 0, this.index[f], a, e[0], c);
    }
    if (this.I) {
      let d = T(b, this.I), e = v();
      x(d) && (d = [d]);
      for (let f = 0, h, g; f < d.length; f++) {
        if (h = d[f], !e[h] && (e[h] = 1, g = this.l[h] || (this.l[h] = []), !c || !g.includes(a))) {
          if (g[g.length] = a, this.m) {
            const k = this.register[a] || (this.register[a] = []);
            k[k.length] = g;
          }
        }
      }
    }
    if (this.store && (!c || !this.store[a])) {
      let d;
      if (this.C) {
        d = v();
        for (let e = 0, f; e < this.C.length; e++) {
          f = this.C[e], x(f) ? d[f] = b[f] : U(b, d, f, 0, f[0]);
        }
      }
      this.store[a] = d || b;
    }
  }
  return this;
};
t.append = function(a, b) {
  return this.add(a, b, !0);
};
t.update = function(a, b) {
  return this.remove(a).add(a, b);
};
t.remove = function(a) {
  C(a) && (a = T(a, this.key));
  if (this.register[a]) {
    for (var b = 0; b < this.h.length && (this.index[this.h[b]].remove(a, !this.o), !this.m); b++) {
    }
    if (this.I && !this.m) {
      for (let c in this.l) {
        b = this.l[c];
        const d = b.indexOf(a);
        -1 !== d && (1 < b.length ? b.splice(d, 1) : delete this.l[c]);
      }
    }
    this.store && delete this.store[a];
    delete this.register[a];
  }
  return this;
};
t.search = function(a, b, c, d) {
  c || (!b && C(a) ? (c = a, a = "") : C(b) && (c = b, b = 0));
  let e = [], f = [], h, g, k, m, n, w, q = 0;
  if (c) {
    if (c.constructor === Array) {
      k = c, c = null;
    } else {
      a = c.query || a;
      k = (h = c.pluck) || c.index || c.field;
      m = c.tag;
      g = this.store && c.enrich;
      n = "and" === c.bool;
      b = c.limit || b || 100;
      w = c.offset || 0;
      if (m && (x(m) && (m = [m]), !a)) {
        for (let l = 0, p; l < m.length; l++) {
          if (p = ya.call(this, m[l], b, w, g)) {
            e[e.length] = p, q++;
          }
        }
        return q ? e : [];
      }
      x(k) && (k = [k]);
    }
  }
  k || (k = this.h);
  n = n && (1 < k.length || m && 1 < m.length);
  const r = !d && (this.o || this.async) && [];
  for (let l = 0, p, A, B; l < k.length; l++) {
    let z;
    A = k[l];
    x(A) || (z = A, A = z.field, a = z.query || a, b = z.limit || b, g = z.enrich || g);
    if (r) {
      r[l] = this.index[A].searchAsync(a, b, z || c);
    } else {
      d ? p = d[l] : p = this.index[A].search(a, b, z || c);
      B = p && p.length;
      if (m && B) {
        const y = [];
        let H = 0;
        n && (y[0] = [p]);
        for (let X = 0, qa, R; X < m.length; X++) {
          if (qa = m[X], B = (R = this.l[qa]) && R.length) {
            H++, y[y.length] = n ? [R] : R;
          }
        }
        H && (p = n ? ma(y, b || 100, w || 0) : na(p, y), B = p.length);
      }
      if (B) {
        f[q] = A, e[q++] = p;
      } else if (n) {
        return [];
      }
    }
  }
  if (r) {
    const l = this;
    return new Promise(function(p) {
      Promise.all(r).then(function(A) {
        p(l.search(a, b, c, A));
      });
    });
  }
  if (!q) {
    return [];
  }
  if (h && (!g || !this.store)) {
    return e[0];
  }
  for (let l = 0, p; l < f.length; l++) {
    p = e[l];
    p.length && g && (p = za.call(this, p));
    if (h) {
      return p;
    }
    e[l] = {field:f[l], result:p};
  }
  return e;
};
function ya(a, b, c, d) {
  let e = this.l[a], f = e && e.length - c;
  if (f && 0 < f) {
    if (f > b || c) {
      e = e.slice(c, c + b);
    }
    d && (e = za.call(this, e));
    return {tag:a, result:e};
  }
}
function za(a) {
  const b = Array(a.length);
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {id:d, doc:this.store[d]};
  }
  return b;
}
t.contain = function(a) {
  return !!this.register[a];
};
t.get = function(a) {
  return this.store[a];
};
t.set = function(a, b) {
  this.store[a] = b;
  return this;
};
t.searchCache = oa;
t.export = function(a, b, c, d, e, f) {
  let h;
  "undefined" === typeof f && (h = new Promise(g => {
    f = g;
  }));
  e || (e = 0);
  d || (d = 0);
  if (d < this.h.length) {
    const g = this.h[d], k = this.index[g];
    b = this;
    setTimeout(function() {
      k.export(a, b, e ? g : "", d, e++, f) || (d++, e = 1, b.export(a, b, g, d, e, f));
    });
  } else {
    let g, k;
    switch(e) {
      case 1:
        g = "tag";
        k = this.l;
        c = null;
        break;
      case 2:
        g = "store";
        k = this.store;
        c = null;
        break;
      default:
        f();
        return;
    }
    ra(a, this, c, g, d, e, k, f);
  }
  return h;
};
t.import = function(a, b) {
  if (b) {
    switch(x(b) && (b = JSON.parse(b)), a) {
      case "tag":
        this.l = b;
        break;
      case "reg":
        this.m = !1;
        this.register = b;
        for (let d = 0, e; d < this.h.length; d++) {
          e = this.index[this.h[d]], e.register = b, e.m = !1;
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
la(Q.prototype);
var Ba = {encode:Aa, F:!1, G:""};
const Ca = [F("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), "a", F("[\u00e8\u00e9\u00ea\u00eb]"), "e", F("[\u00ec\u00ed\u00ee\u00ef]"), "i", F("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), "o", F("[\u00f9\u00fa\u00fb\u00fc\u0171]"), "u", F("[\u00fd\u0177\u00ff]"), "y", F("\u00f1"), "n", F("[\u00e7c]"), "k", F("\u00df"), "s", F(" & "), " and "];
function Aa(a) {
  var b = a = "" + a;
  b.normalize && (b = b.normalize("NFD").replace(ea, ""));
  return ca.call(this, b.toLowerCase(), !a.normalize && Ca);
}
;var Ea = {encode:Da, F:!1, G:"strict"};
const Fa = /[^a-z0-9]+/, Ga = {b:"p", v:"f", w:"f", z:"s", x:"s", "\u00df":"s", d:"t", n:"m", c:"k", g:"k", j:"k", q:"k", i:"e", y:"e", u:"o"};
function Da(a) {
  a = Aa.call(this, a).join(" ");
  const b = [];
  if (a) {
    const c = a.split(Fa), d = c.length;
    for (let e = 0, f, h = 0; e < d; e++) {
      if ((a = c[e]) && (!this.filter || !this.filter[a])) {
        f = a[0];
        let g = Ga[f] || f, k = g;
        for (let m = 1; m < a.length; m++) {
          f = a[m];
          const n = Ga[f] || f;
          n && n !== k && (g += n, k = n);
        }
        b[h++] = g;
      }
    }
  }
  return b;
}
;var Ia = {encode:Ha, F:!1, G:""};
const Ja = [F("ae"), "a", F("oe"), "o", F("sh"), "s", F("th"), "t", F("ph"), "f", F("pf"), "f", F("(?![aeo])h(?![aeo])"), "", F("(?!^[aeo])h(?!^[aeo])"), ""];
function Ha(a, b) {
  a && (a = Da.call(this, a).join(" "), 2 < a.length && (a = E(a, Ja)), b || (1 < a.length && (a = ha(a)), a && (a = a.split(" "))));
  return a || [];
}
;var La = {encode:Ka, F:!1, G:""};
const Ma = F("(?!\\b)[aeo]");
function Ka(a) {
  a && (a = Ha.call(this, a, !0), 1 < a.length && (a = a.replace(Ma, "")), 1 < a.length && (a = ha(a)), a && (a = a.split(" ")));
  return a || [];
}
;G["latin:default"] = ja;
G["latin:simple"] = Ba;
G["latin:balance"] = Ea;
G["latin:advanced"] = Ia;
G["latin:extra"] = La;
const W = self;
let Y;
const Z = {Index:K, Document:Q, Worker:O, registerCharset:function(a, b) {
  G[a] = b;
}, registerLanguage:function(a, b) {
  ka[a] = b;
}};
(Y = W.define) && Y.amd ? Y([], function() {
  return Z;
}) : W.exports ? W.exports = Z : W.FlexSearch = Z;
}(this));
