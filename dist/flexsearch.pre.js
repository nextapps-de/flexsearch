(function(){'use strict';
Object.assign || (Object.assign = function() {
  for (var a = arguments, b = a.length, c = a[0], e = 1, d, h, f; e < b; e++) {
    d = a[e];
    h = Object.keys(d);
    f = h.length;
    for (var g = 0, k; g < f; g++) {
      k = h[g], c[k] = d[k];
    }
  }
  return c;
});
window.requestAnimationFrame || (window.requestAnimationFrame = window.setTimeout);
window.cancelAnimationFrame || (window.cancelAnimationFrame = window.clearTimeout);
window.Promise || (window.Promise = function() {
  function a(a) {
    this.callback = null;
    var b = this;
    a(function(a) {
      b.callback && (b.callback(a), b.callback = null);
    });
  }
  a.prototype.then = function(a) {
    this.callback = a;
  };
  return a;
}());
function q(a) {
  return "string" === typeof a;
}
function x(a) {
  return a.constructor === Array;
}
function z(a) {
  return "function" === typeof a;
}
function B(a) {
  return "object" === typeof a;
}
function C(a) {
  return "undefined" === typeof a;
}
function aa(a) {
  for (var b = Array(a), c = 0; c < a; c++) {
    b[c] = F();
  }
  return b;
}
function F() {
  return Object.create(null);
}
function G(a, b) {
  for (var c = 0, e = b.length; c < e && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
function L(a) {
  return new RegExp(a, "g");
}
function M(a) {
  for (var b = "", c = "", e = 0, d = a.length, h; e < d; e++) {
    (h = a[e]) !== c && (b += c = h);
  }
  return b;
}
O.prototype.pipeline = function(a, b, c, e) {
  if (a && (b && a && (a = G(a, b)), a && this.matcher && (a = G(a, this.matcher)), this.stemmer && 1 < a.length && (a = G(a, this.stemmer)), e && 1 < a.length && (a = M(a)), a && (c || "" === c) && (a = a.split(c), this.filter))) {
    b = this.filter;
    c = a.length;
    e = [];
    for (var d = 0, h = 0; d < c; d++) {
      var f = a[d];
      f && !b[f] && (e[h++] = f);
    }
    a = e;
  }
  return a;
};
O.prototype.export = function(a) {
  var b = !a || C(a.serialize) || a.serialize;
  if (this.doc) {
    var c = !a || C(a.doc) || a.doc, e = !a || C(a.index) || a.index;
    a = [];
    var d = 0;
    if (e) {
      for (e = this.doc.keys; d < e.length; d++) {
        var h = this.doc.index[e[d]];
        a[d] = [h._map, h._ctx, Object.keys(h._ids)];
      }
    }
    c && (a[d] = this._doc);
  } else {
    a = [this._map, this._ctx, Object.keys(this._ids)];
  }
  b && (a = JSON.stringify(a));
  return a;
};
O.prototype.import = function(a, b) {
  if (!b || C(b.serialize) || b.serialize) {
    a = JSON.parse(a);
  }
  var c = {};
  if (this.doc) {
    var e = !b || C(b.doc) || b.doc, d = 0;
    if (!b || C(b.index) || b.index) {
      b = this.doc.keys;
      for (var h = b.length, f = a[0][2]; d < f.length; d++) {
        c[f[d]] = 1;
      }
      for (d = 0; d < h; d++) {
        f = this.doc.index[b[d]];
        var g = a[d];
        g && (f._map = g[0], f._ctx = g[1], f._ids = c);
      }
    }
    e && (this._doc = B(e) ? e : a[d]);
  } else {
    e = a[2];
    for (d = 0; d < e.length; d++) {
      c[e[d]] = 1;
    }
    this._map = a[0];
    this._ctx = a[1];
    this._ids = c;
  }
};
O.prototype.find = function(a, b) {
  return this.where(a, b, 1)[0] || null;
};
O.prototype.where = function(a, b, c, e) {
  var d = this._doc, h = [], f = 0, g;
  if (B(a)) {
    c || (c = b);
    var k = Object.keys(a);
    var l = k.length;
    var r = !1;
    if (1 === l && "id" === k[0]) {
      return [d[a.id]];
    }
    if ((g = this._tags) && !e) {
      for (var t = 0; t < g.length; t++) {
        var n = g[t], m = a[n];
        if (!C(m)) {
          var p = this._tag[n]["@" + m];
          if (0 === --l) {
            return p;
          }
          k.splice(k.indexOf(n), 1);
          delete a[n];
          break;
        }
      }
    }
    g = Array(l);
    for (t = 0; t < l; t++) {
      g[t] = k[t].split(":");
    }
  } else {
    if (z(a)) {
      b = e || Object.keys(d);
      c = b.length;
      for (k = 0; k < c; k++) {
        l = d[b[k]], a(l) && (h[f++] = l);
      }
      return h;
    }
    if (C(b)) {
      return [d[a]];
    }
    if ("id" === a) {
      return [d[b]];
    }
    k = [a];
    l = 1;
    g = [a.split(":")];
    r = !0;
  }
  e = p || e || Object.keys(d);
  t = e.length;
  for (n = 0; n < t; n++) {
    m = p ? e[n] : d[e[n]];
    for (var w = !0, u = 0; u < l; u++) {
      r || (b = a[k[u]]);
      var v = g[u], y = v.length, A = m;
      if (1 < y) {
        for (var H = 0; H < y; H++) {
          A = A[v[H]];
        }
      } else {
        A = A[v[0]];
      }
      if (A !== b) {
        w = !1;
        break;
      }
    }
    if (w && (h[f++] = m, c && f === c)) {
      break;
    }
  }
  return h;
};
function S(a) {
  this.clear();
  this.limit = !0 !== a && a;
}
S.prototype.clear = function() {
  this.cache = F();
  this.count = F();
  this.index = F();
  this.ids = [];
};
S.prototype.set = function(a, b) {
  if (this.limit && C(this.cache[a])) {
    var c = this.ids.length;
    if (c === this.limit) {
      c--;
      var e = this.ids[c];
      delete this.cache[e];
      delete this.count[e];
      delete this.index[e];
    }
    this.ids[c] = a;
    this.index[a] = c;
    this.count[a] = -1;
    this.cache[a] = b;
    this.get(a);
  } else {
    this.cache[a] = b;
  }
};
S.prototype.get = function(a) {
  var b = this.cache[a];
  if (this.limit && b) {
    var c = ++this.count[a], e = this.index, d = e[a];
    if (0 < d) {
      for (var h = this.ids, f = d; this.count[h[--d]] <= c && -1 !== d;) {
      }
      d++;
      if (d !== f) {
        for (c = f; c > d; c--) {
          f = h[c - 1], h[c] = f, e[f] = c;
        }
        h[d] = a;
        e[a] = d;
      }
    }
  }
  return b;
};
var ba = {memory:{encode:"extra", tokenize:"strict", threshold:0, resolution:1}, speed:{encode:"icase", tokenize:"strict", threshold:1, resolution:3, depth:2}, match:{encode:"extra", tokenize:"full", threshold:1, resolution:3}, score:{encode:"extra", tokenize:"strict", threshold:1, resolution:9, depth:4}, balance:{encode:"balance", tokenize:"strict", threshold:0, resolution:3, depth:3}, fast:{encode:"icase", tokenize:"strict", threshold:8, resolution:9, depth:1}};
var da = {encode:ca, rtl:!1}, ea = /[\W_]+/;
function ca(a) {
  return this.pipeline(a.toLowerCase(), !1, ea, !1);
}
;var fa = {encode:ca, tokenize:"strict", cache:!1, async:!1, worker:!1, rtl:!1, doc:!1, resolution:9, threshold:0, depth:0}, ha = 0, U = {}, V = {};
function O(a) {
  if (!(this instanceof O)) {
    return new O(a);
  }
  var b = a && a.id;
  this.id = b || 0 === b ? b : ha++;
  this.init(a);
  ia(this, "index", function() {
    return Object.keys(this._ids);
  });
  ia(this, "length", function() {
    return this.index.length;
  });
}
O.registerCharset = function(a, b) {
  V[a] = b;
  return O;
};
O.registerLanguage = function(a, b) {
  V[a] = b;
  return O;
};
O.prototype.init = function(a) {
  var b;
  if (q(a)) {
    a = ba[a];
  } else {
    if (b = a.preset) {
      a = Object.assign({}, ba[b], a);
    }
  }
  this.encode || (a = a ? Object.assign({}, fa, a) : fa);
  if (a) {
    this.async = a.async;
    this.timer = 0;
    var c = a.charset;
    var e = a.lang;
    this.tokenizer = (q(c) ? V[c].tokenize : c && c.tokenize) || a.tokenize;
    this.rtl = q(b = a.rtl || c) ? V[b].rtl : c && c.rtl || b;
    this.threshold = a.threshold;
    this.resolution = (b = a.resolution) <= this.threshold ? this.threshold + 1 : b;
    this.depth = "strict" === this.tokenizer && a.depth || 0;
    this.encode = q(b = a.encode || c) ? V[-1 === b.indexOf(":") ? b + ":default" : b].encode : c && c.encode || b;
    this.matcher = (b = a.matcher || e) && ja(q(b) ? U[b].matcher : e && e.matcher || b, !1);
    if (c = b = a.filter || e) {
      c = q(b) ? U[b].filter : e && e.filter || b;
      for (var d = F(), h = 0, f = c.length; h < f; h++) {
        d[c[h]] = 1;
      }
      c = d;
    }
    this.filter = c;
    this.stemmer = (b = a.stemmer || e) && ja(q(b) ? U[b].stemmer : e && e.stemmer || b, !0);
    (this.doc = c = (b = a.doc) && ka(b)) && (a.doc = null);
  }
  this._map = aa(this.resolution - (this.threshold || 0));
  this._ctx = F();
  this._ids = {};
  if (c) {
    this._doc = F();
    b = c.index = {};
    e = c.keys = [];
    d = c.field;
    h = c.tag;
    f = c.store;
    x(c.id) || (c.id = c.id.split(":"));
    if (f) {
      var g = F();
      if (q(f)) {
        g[f] = 1;
      } else {
        if (x(f)) {
          for (var k = 0; k < f.length; k++) {
            g[f[k]] = 1;
          }
        } else {
          B(f) && (g = f);
        }
      }
      c.store = g;
    }
    if (h) {
      this._tag = F();
      f = F();
      if (d) {
        if (q(d)) {
          f[d] = a;
        } else {
          if (x(d)) {
            for (g = 0; g < d.length; g++) {
              f[d[g]] = a;
            }
          } else {
            B(d) && (f = d);
          }
        }
      }
      x(h) || (c.tag = h = [h]);
      for (d = 0; d < h.length; d++) {
        this._tag[h[d]] = F();
      }
      this._tags = h;
      d = f;
    }
    if (d) {
      if (!x(d)) {
        if (B(d)) {
          var l = d;
          c.field = d = Object.keys(d);
        } else {
          c.field = d = [d];
        }
      }
      for (c = 0; c < d.length; c++) {
        h = d[c], x(h) || (l && (a = l[h]), e[c] = h, d[c] = h.split(":")), b[h] = new O(a);
      }
    }
  }
  if (b = a.cache) {
    this._cache_status = !0, this._cache = new S(b);
  }
  return this;
};
function ka(a) {
  var b = F(), c;
  for (c in a) {
    if (a.hasOwnProperty(c)) {
      var e = a[c];
      x(e) ? b[c] = e.slice(0) : B(e) ? b[c] = ka(e) : b[c] = e;
    }
  }
  return b;
}
O.prototype.add = function(a, b, c, e, d) {
  if (this.doc && B(a)) {
    return this.handle_docs("add", a, b);
  }
  if (b && q(b) && (a || 0 === a)) {
    if (this._ids[a] && !e) {
      return this.update(a, b);
    }
    if (!d) {
      if (this.async) {
        var h = this;
        d = new Promise(function(c) {
          setTimeout(function() {
            h.add(a, b, null, e, !0);
            h = null;
            c();
          });
        });
        if (c) {
          d.then(c);
        } else {
          return d;
        }
        return this;
      }
      if (c) {
        return this.add(a, b, null, e, !0), c(), this;
      }
    }
    b = this.encode(b);
    if (!b.length) {
      return this;
    }
    c = b;
    d = F();
    d._ctx = F();
    for (var f = c.length, g = this.threshold, k = this.depth, l = this.resolution, r = this._map, t = this.rtl, n = 0; n < f; n++) {
      var m = c[n];
      if (m) {
        var p = m.length, w = (t ? n + 1 : f - n) / f, u = "";
        switch(this.tokenizer) {
          case "reverse":
          case "both":
            for (var v = p; --v;) {
              u = m[v] + u, W(r, d, u, a, t ? 1 : (p - v) / p, w, g, l - 1);
            }
            u = "";
          case "forward":
            for (v = 0; v < p; v++) {
              u += m[v], W(r, d, u, a, t ? (v + 1) / p : 1, w, g, l - 1);
            }
            break;
          case "full":
            for (v = 0; v < p; v++) {
              for (var y = (t ? v + 1 : p - v) / p, A = p; A > v; A--) {
                u = m.substring(v, A), W(r, d, u, a, y, w, g, l - 1);
              }
            }
            break;
          default:
            if (p = W(r, d, m, a, 1, w, g, l - 1), k && 1 < f && p >= g) {
              for (p = d._ctx[m] || (d._ctx[m] = F()), m = this._ctx[m] || (this._ctx[m] = aa(l - (g || 0))), w = n - k, u = n + k + 1, 0 > w && (w = 0), u > f && (u = f); w < u; w++) {
                w !== n && W(m, p, c[w], a, 0, l - (w < n ? n - w : w - n), g, l - 1);
              }
            }
        }
      }
    }
    this._ids[a] = 1;
    this._cache_status = !1;
  }
  return this;
};
O.prototype.handle_docs = function(a, b, c) {
  if (x(b)) {
    var e = b.length;
    if (e--) {
      for (var d = 0; d < e; d++) {
        this.handle_docs(a, b[d]);
      }
      return this.handle_docs(a, b[e], c);
    }
  } else {
    var h = this.doc.index, f = this.doc.keys, g = this.doc.tag;
    d = this.doc.store;
    var k;
    var l = this.doc.id;
    e = b;
    for (var r = 0; r < l.length; r++) {
      e = e[l[r]];
    }
    if ("remove" === a && (delete this._doc[e], l = f.length, l--)) {
      for (b = 0; b < l; b++) {
        h[f[b]].remove(e);
      }
      return h[f[l]].remove(e, c);
    }
    if (g) {
      for (k = 0; k < g.length; k++) {
        var t = g[k];
        var n = b;
        l = t.split(":");
        for (r = 0; r < l.length; r++) {
          n = n[l[r]];
        }
        n = "@" + n;
      }
      k = this._tag[t];
      k = k[n] || (k[n] = []);
    }
    l = this.doc.field;
    g = 0;
    for (t = l.length; g < t; g++) {
      r = l[g];
      n = b;
      for (var m = 0; m < r.length; m++) {
        n = n[r[m]];
      }
      r = h[f[g]];
      "add" === a ? r.add(e, n, g === t - 1 && c) : r.update(e, n, g === t - 1 && c);
    }
    if (d) {
      c = Object.keys(d);
      a = F();
      for (h = 0; h < c.length; h++) {
        if (f = c[h], d[f]) {
          for (f = f.split(":"), g = l = void 0, t = 0; t < f.length; t++) {
            n = f[t], l = (l || b)[n], g = (g || a)[n] = l;
          }
        }
      }
      b = a;
    }
    k && (k[k.length] = b);
    this._doc[e] = b;
  }
  return this;
};
O.prototype.update = function(a, b, c) {
  if (this.doc && B(a)) {
    return this.handle_docs("update", a, b);
  }
  this._ids[a] && q(b) && (this.remove(a), this.add(a, b, c, !0));
  return this;
};
O.prototype.remove = function(a, b, c) {
  if (this.doc && B(a)) {
    return this.handle_docs("remove", a, b);
  }
  if (this._ids[a]) {
    if (!c) {
      if (this.async && "function" !== typeof importScripts) {
        var e = this;
        c = new Promise(function(b) {
          setTimeout(function() {
            e.remove(a, null, !0);
            e = null;
            b();
          });
        });
        if (b) {
          c.then(b);
        } else {
          return c;
        }
        return this;
      }
      if (b) {
        return this.remove(a, null, !0), b(), this;
      }
    }
    for (b = 0; b < this.resolution - (this.threshold || 0); b++) {
      X(this._map[b], a);
    }
    this.depth && X(this._ctx, a);
    delete this._ids[a];
    this._cache_status = !1;
  }
  return this;
};
var Y;
O.prototype.merge_and_sort = function(a, b, c, e, d, h, f, g, k, l) {
  c = la(c, f ? 0 : d, g, h, b, k, l);
  if (g) {
    g = c.page;
    var r = c.next;
    c = c.result;
  }
  if (f) {
    c = this.where(f, null, d, c);
  } else {
    b = c;
    c = this._doc;
    d = b.length;
    h = Array(d);
    for (f = 0; f < d; f++) {
      h[f] = c[b[f]];
    }
    c = h;
  }
  e && (z(e) || (Y = e.split(":"), 1 < Y.length ? e = ma : (Y = Y[0], e = na)), c.sort(e));
  c = Z(g, r, c);
  this._cache && this._cache.set(a, c);
  return c;
};
O.prototype.search = function(a, b, c, e) {
  if (B(b)) {
    if (x(b)) {
      for (var d = 0; d < b.length; d++) {
        b[d].query = a;
      }
    } else {
      b.query = a;
    }
    a = b;
    b = 1000;
  } else {
    b && z(b) ? (c = b, b = 1000) : b || 0 === b || (b = 1000);
  }
  var h = [], f = a;
  if (B(a) && !x(a)) {
    c || (c = a.callback) && (f.callback = null);
    var g = a.sort;
    var k = a.page;
    b = a.limit;
    var l = a.threshold;
    var r = a.suggest;
    a = a.query;
  }
  if (this.doc) {
    l = this.doc.index;
    var t = f.where, n = f.bool || "or", m = f.field, p = n, w, u;
    if (m) {
      x(m) || (m = [m]);
    } else {
      if (x(f)) {
        var v = f;
        m = [];
        p = [];
        for (var y = 0; y < f.length; y++) {
          e = f[y], d = e.bool || n, m[y] = e.field, p[y] = d, "not" === d ? w = !0 : "and" === d && (u = !0);
        }
      } else {
        m = this.doc.keys;
      }
    }
    n = m.length;
    for (y = 0; y < n; y++) {
      v && (f = v[y]), k && !q(f) && (f.page = null, f.limit = 0), h[y] = l[m[y]].search(f, 0);
    }
    if (c) {
      return c(this.merge_and_sort(a, p, h, g, b, r, t, k, u, w));
    }
    if (this.async) {
      var A = this;
      return new Promise(function(c) {
        Promise.all(h).then(function(d) {
          c(A.merge_and_sort(a, p, d, g, b, r, t, k, u, w));
        });
      });
    }
    return this.merge_and_sort(a, p, h, g, b, r, t, k, u, w);
  }
  l || (l = this.threshold || 0);
  if (!e) {
    if (this.async && "function" !== typeof importScripts) {
      var H = this;
      l = new Promise(function(a) {
        setTimeout(function() {
          a(H.search(f, b, null, !0));
          H = null;
        });
      });
      if (c) {
        l.then(c);
      } else {
        return l;
      }
      return this;
    }
    if (c) {
      return c(this.search(f, b, null, !0)), this;
    }
  }
  if (!a || !q(a)) {
    return h;
  }
  f = a;
  if (this._cache) {
    if (this._cache_status) {
      if (c = this._cache.get(a)) {
        return c;
      }
    } else {
      this._cache.clear(), this._cache_status = !0;
    }
  }
  f = this.encode(f);
  if (!f.length) {
    return h;
  }
  c = f;
  v = c.length;
  e = !0;
  d = [];
  var P = F(), Q = 0;
  1 < v && (this.depth ? n = !0 : c.sort(oa));
  if (!n || (y = this._ctx)) {
    for (var T = this.resolution; Q < v; Q++) {
      var D = c[Q];
      if (D) {
        if (n) {
          if (!m) {
            if (y[D]) {
              m = D, P[D] = 1;
            } else {
              if (!r) {
                return h;
              }
            }
          }
          if (r && Q === v - 1 && !d.length) {
            n = !1, D = m || D, P[D] = 0;
          } else {
            if (!m) {
              continue;
            }
          }
        }
        if (!P[D]) {
          var E = [], N = !1, I = 0, J = n ? y[m] : this._map;
          if (J) {
            for (var R = void 0, K = 0; K < T - l; K++) {
              if (R = J[K] && J[K][D]) {
                E[I++] = R, N = !0;
              }
            }
          }
          if (N) {
            m = D, d[d.length] = 1 < I ? E.concat.apply([], E) : E[0];
          } else {
            if (!r) {
              e = !1;
              break;
            }
          }
          P[D] = 1;
        }
      }
    }
  } else {
    e = !1;
  }
  e && (h = la(d, b, k, r));
  this._cache && this._cache.set(a, h);
  return h;
};
O.prototype.info = function() {
  return {id:this.id, items:this.length, matcher:this.matcher.length, worker:this.worker, threshold:this.threshold, depth:this.depth, resolution:this.resolution, contextual:this.depth && "strict" === this.tokenizer};
};
O.prototype.clear = function() {
  return this.destroy().init();
};
O.prototype.destroy = function() {
  this._cache && (this._cache.clear(), this._cache = null);
  this._map = this._ctx = this._ids = null;
  if (this.doc) {
    for (var a = this.doc.keys, b = 0; b < a.length; b++) {
      this.doc.index[a[b]].destroy();
    }
    this.doc = this._doc = null;
  }
  return this;
};
function ia(a, b, c) {
  Object.defineProperty(a, b, {get:c});
}
function W(a, b, c, e, d, h, f, g) {
  if (b[c]) {
    return b[c];
  }
  d = d ? (g - (f || g / 1.5)) * h + (f || g / 1.5) * d : h;
  b[c] = d;
  d >= f && (a = a[g - (d + 0.5 >> 0)], a = a[c] || (a[c] = []), a[a.length] = e);
  return d;
}
function X(a, b) {
  if (a) {
    for (var c = Object.keys(a), e = 0, d = c.length; e < d; e++) {
      var h = c[e], f = a[h];
      if (f) {
        for (var g = 0, k = f.length; g < k; g++) {
          if (f[g] === b) {
            1 === k ? delete a[h] : f.splice(g, 1);
            break;
          } else {
            B(f[g]) && X(f[g], b);
          }
        }
      }
    }
  }
}
function ja(a, b) {
  for (var c = Object.keys(a), e = c.length, d = [], h = "", f = 0, g = 0, k; g < e; g++) {
    var l = c[g];
    (k = a[l]) ? (d[f++] = L(b ? "(?!\\b)" + l + "(\\b|_)" : l), d[f++] = k) : h += (h ? "|" : "") + l;
  }
  h && (d[f++] = L(b ? "(?!\\b)(" + h + ")(\\b|_)" : "(" + h + ")"), d[f] = "");
  return d;
}
function oa(a, b) {
  return b.length - a.length;
}
function na(a, b) {
  return a[Y] - b[Y];
}
function ma(a, b) {
  for (var c = Y.length, e = 0; e < c; e++) {
    a = a[Y[e]], b = b[Y[e]];
  }
  return a - b;
}
function Z(a, b, c) {
  return a ? {page:a, next:b ? "" + b : null, result:c} : c;
}
function la(a, b, c, e, d, h, f) {
  var g = [];
  if (!0 === c) {
    c = "0";
    var k = "";
  } else {
    k = c && c.split(":");
  }
  var l = a.length;
  if (1 < l) {
    var r = F(), t = [], n, m = 0, p, w = !0, u = 0, v;
    if (k) {
      if (2 === k.length) {
        var y = k;
        k = !1;
      } else {
        k = v = parseInt(k[0], 10);
      }
    }
    if (f) {
      for (n = F(); m < l; m++) {
        if ("not" === d[m]) {
          var A = a[m];
          var H = A.length;
          for (p = 0; p < H; p++) {
            n["@" + A[p]] = 1;
          }
        } else {
          var P = m + 1;
        }
      }
      if (C(P)) {
        return Z(c, K, g);
      }
      m = 0;
    } else {
      var Q = q(d) && d;
    }
    for (var T; m < l; m++) {
      var D = m === (P || l) - 1;
      if (!Q || !m) {
        if ((p = Q || d && d[m]) && "and" !== p) {
          if ("or" === p) {
            T = !1;
          } else {
            continue;
          }
        } else {
          T = h = !0;
        }
      }
      A = a[m];
      if (H = A.length) {
        if (w) {
          if (I) {
            var E = I.length;
            for (p = 0; p < E; p++) {
              w = I[p];
              var N = "@" + w;
              f && n[N] || (r[N] = 1, h || (g[u++] = w));
            }
            var I = null;
            w = !1;
          } else {
            I = A;
            continue;
          }
        }
        N = !1;
        for (p = 0; p < H; p++) {
          E = A[p];
          var J = "@" + E, R = h ? r[J] || 0 : m;
          if (!(!R && !e || f && n[J] || !h && r[J])) {
            if (R === m) {
              if (D) {
                if (!v || --v < u) {
                  if (g[u++] = E, b && u === b) {
                    return Z(c, u + (k || 0), g);
                  }
                }
              } else {
                r[J] = m + 1;
              }
              N = !0;
            } else {
              e && (J = t[R] || (t[R] = []), J[J.length] = E);
            }
          }
        }
        if (T && !N && !e) {
          break;
        }
      } else {
        if (T && !e) {
          return Z(c, K, A);
        }
      }
    }
    if (I) {
      if (m = I.length, f) {
        for (p = k ? parseInt(k, 10) : 0; p < m; p++) {
          a = I[p], n["@" + a] || (g[u++] = a);
        }
      } else {
        g = I;
      }
    }
    if (e) {
      for (u = g.length, y ? (m = parseInt(y[0], 10) + 1, p = parseInt(y[1], 10) + 1) : (m = t.length, p = 0); m--;) {
        if (E = t[m]) {
          for (H = E.length; p < H; p++) {
            if (e = E[p], !f || !n["@" + e]) {
              if (g[u++] = e, b && u === b) {
                return Z(c, m + ":" + p, g);
              }
            }
          }
          p = 0;
        }
      }
    }
  } else {
    !l || d && "not" === d[0] || (g = a[0], k && (k = parseInt(k[0], 10)));
  }
  if (b) {
    f = g.length;
    k && k > f && (k = 0);
    k = k || 0;
    var K = k + b;
    K < f ? g = g.slice(k, K) : (K = 0, k && (g = g.slice(k)));
  }
  return Z(c, K, g);
}
;var qa = {encode:pa, rtl:!1}, ra = /[\W_]+/, sa = L("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), ta = L("[\u00e8\u00e9\u00ea\u00eb]"), ua = L("[\u00ec\u00ed\u00ee\u00ef]"), va = L("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), wa = L("[\u00f9\u00fa\u00fb\u00fc\u0171]"), xa = L("[\u00fd\u0177\u00ff]"), ya = L("\u00f1"), za = L("[\u00e7c]"), Aa = L("\u00df"), Ba = L(" & "), Ca = [sa, "a", ta, "e", ua, "i", va, "o", wa, "u", xa, "y", ya, "n", za, "k", Aa, "s", Ba, " and "];
function pa(a, b) {
  b || (b = this);
  return b.pipeline(a.toLowerCase(), Ca, ra, !1);
}
;var Ea = {encode:Da, rtl:!1}, Fa = L("ae"), Ga = L("ai"), Ha = L("ay"), Ia = L("ey"), Ja = L("oe"), Ka = L("ue"), La = L("ie"), Ma = L("sz"), Na = L("zs"), Oa = L("ck"), Pa = L("cc"), Qa = L("sh"), Ra = L("th"), Sa = L("dt"), Ta = L("ph"), Ua = L("pf"), Va = L("ou"), Wa = L("uo"), Xa = [Fa, "a", Ga, "ei", Ha, "ei", Ia, "ei", Ja, "o", Ka, "u", La, "i", Ma, "s", Na, "s", Qa, "s", Oa, "k", Pa, "k", Ra, "t", Sa, "t", Ta, "f", Ua, "f", Va, "o", Wa, "u"];
function Da(a, b) {
  a && (a = pa(a, this).join(" "), 2 < a.length && (a = G(a, Xa)), b || (1 < a.length && (a = M(a)), a && (a = a.split(" "))));
  return a;
}
;var Za = {encode:Ya, rtl:!1}, $a = /[\W_]+/;
function Ya(a) {
  return this.pipeline(a.toLowerCase(), !1, $a, !1);
}
;var bb = {encode:ab, rtl:!1}, cb = L("(?!\\b)p"), db = L("(?!\\b)z"), eb = L("(?!\\b)[cgq]"), fb = L("(?!\\b)n"), gb = L("(?!\\b)d"), hb = L("(?!\\b)[vw]"), ib = L("(?!\\b)[aeiouy]"), jb = [cb, "b", db, "s", eb, "k", fb, "m", gb, "t", hb, "f", ib, ""];
function ab(a) {
  a && (a = Da(a, !0), 1 < a.length && (a = G(a, jb)), 1 < a.length && (a = M(a)), a && (a = a.split(" ")));
  return a;
}
;var lb = {encode:kb, rtl:!1, tokenize:"strict"}, mb = /[^a-z]+/;
function kb(a) {
  a = this.pipeline(a.toLowerCase(), !1, !1, !1);
  var b = [];
  if (a) {
    for (var c = a.split(mb), e = c.length, d = 0, h = 0; d < e; d++) {
      if ((a = c[d]) && 2 < a.length && (!this.filter || !this.filter[a])) {
        for (var f = a[0], g = nb(f), k = 1; k < a.length; k++) {
          var l = nb(a[k]);
          if (l !== g && (f += l, g = l, 4 === f.length)) {
            break;
          }
        }
        b[h++] = (f + "0000").substring(0, 4);
      }
    }
  }
  return b;
}
function nb(a) {
  switch(a) {
    case "b":
    case "f":
    case "p":
    case "v":
      return 1;
    case "c":
    case "g":
    case "j":
    case "k":
    case "q":
    case "s":
    case "x":
    case "z":
      return 2;
    case "d":
    case "t":
      return 3;
    case "l":
      return 4;
    case "m":
    case "n":
      return 5;
    case "r":
      return 6;
  }
  return "";
}
;var pb = {encode:ob, rtl:!0}, qb = /[\W_]+/;
function ob(a) {
  return this.pipeline(a, !1, qb, !1);
}
;var sb = {encode:rb, rtl:!1, tokenize:"strict"}, tb = /[\x00-\x7F]/g;
function rb(a) {
  return this.pipeline(a.replace(tb, ""), !1, "", !1);
}
;var vb = {encode:ub, rtl:!1}, wb = /[\W_]+/;
function ub(a) {
  return this.pipeline(a, !1, wb, !1);
}
;V["latin:advanced"] = Ea;
V["latin:balance"] = Za;
V["latin:default"] = da;
V["latin:extra"] = bb;
V["latin:simple"] = qa;
V["latin:soundex"] = lb;
V["arabic:default"] = pb;
V["cjk:default"] = sb;
V["cyrillic:default"] = vb;
U.de = {filter:"aber als am an auch auf aus bei bin bis bist da dadurch daher darum das da\u00df dass dein deine dem den der des dessen deshalb die dies dieser dieses doch dort du durch ein eine einem einen einer eines er es euer eure f\u00fcr hatte hatten hattest hattet hier hinter ich ihr ihre im in ist ja jede jedem jeden jeder jedes jener jenes jetzt kann kannst k\u00f6nnen k\u00f6nnt machen mein meine mit mu\u00df mu\u00dft musst m\u00fcssen m\u00fc\u00dft nach nachdem nein nicht nun oder seid sein seine sich sie sind soll sollen sollst sollt sonst soweit sowie und unser unsere unter vom von vor wann warum was weiter weitere wenn wer werde werden werdet weshalb wie wieder wieso wir wird wirst wo woher wohin zu zum zur \u00fcber".split(" "), 
stemmer:{niss:"", isch:"", lich:"", heit:"", keit:"", ell:"", bar:"", end:"", ung:"", est:"", ern:"", em:"", er:"", en:"", es:"", st:"", ig:"", ik:"", e:"", s:""}, matcher:{}};
U.en = {filter:"a about above after again against all also am an and any are aren't as at be because been before being below both but by can cannot can't come could couldn't did didn't do does doesn't doing dont down during each even few first for from further get go had hadn't has hasn't have haven't having he hed her here here's hers herself hes him himself his how how's i id if ill im in into is isn't it it's itself i've just know let's like make me more most mustn't my myself new no nor not now of off on once only or other ought our our's ourselves out over own same say see shan't she she'd shell shes should shouldn't so some such than that that's the their theirs them themselves then there there's these they they'd they'll they're they've this those through time to too until up us very want was wasn't way we wed well were weren't we've what what's when when's where where's which while who whom who's why why's will with won't would wouldn't you you'd you'll your you're your's yourself yourselves you've".split(" "), 
stemmer:{ational:"ate", iveness:"ive", fulness:"ful", ousness:"ous", ization:"ize", tional:"tion", biliti:"ble", icate:"ic", ative:"", alize:"al", iciti:"ic", entli:"ent", ousli:"ous", alism:"al", ation:"ate", aliti:"al", iviti:"ive", ement:"", enci:"ence", anci:"ance", izer:"ize", alli:"al", ator:"ate", logi:"log", ical:"ic", ance:"", ence:"", ness:"", able:"", ible:"", ment:"", eli:"e", bli:"ble", ful:"", ant:"", ent:"", ism:"", ate:"", iti:"", ous:"", ive:"", ize:"", al:"", ou:"", er:"", ic:""}, 
matcher:{}};
U.at = {filter:"aber als am an auch auf aus bei bin bis bist da dadurch daher darum das da\u00df dass dein deine dem den der des dessen deshalb die dies dieser dieses doch dort du durch ein eine einem einen einer eines er es euer eure f\u00fcr hatte hatten hattest hattet hier hinter ich ihr ihre im in ist ja jede jedem jeden jeder jedes jener jenes jetzt kann kannst k\u00f6nnen k\u00f6nnt machen mein meine mit mu\u00df mu\u00dft musst m\u00fcssen m\u00fc\u00dft nach nachdem nein nicht nun oder seid sein seine sich sie sind soll sollen sollst sollt sonst soweit sowie und unser unsere unter vom von vor wann warum was weiter weitere wenn wer werde werden werdet weshalb wie wieder wieso wir wird wirst wo woher wohin zu zum zur \u00fcber".split(" "), 
stemmer:{niss:"", isch:"", lich:"", heit:"", keit:"", end:"", ung:"", est:"", ern:"", em:"", er:"", en:"", es:"", st:"", ig:"", ik:"", e:"", s:""}, matcher:{}};
U.us = {filter:"a about above after again against all also am an and any are aren't as at be because been before being below both but by can cannot can't come could couldn't did didn't do does doesn't doing dont down during each even few first for from further get go had hadn't has hasn't have haven't having he hed her here here's hers herself hes him himself his how how's i id if ill im in into is isn't it it's itself i've just know let's like make me more most mustn't my myself new no nor not now of off on once only or other ought our our's ourselves out over own same say see shan't she she'd shell shes should shouldn't so some such than that that's the their theirs them themselves then there there's these they they'd they'll they're they've this those through time to too until up us very want was wasn't way we wed well were weren't we've what what's when when's where where's which while who whom who's why why's will with won't would wouldn't you you'd you'll your you're your's yourself yourselves you've".split(" "), 
stemmer:{ational:"ate", iveness:"ive", fulness:"ful", ousness:"ous", ization:"ize", tional:"tion", biliti:"ble", icate:"ic", ative:"", alize:"al", iciti:"ic", entli:"ent", ousli:"ous", alism:"al", ation:"ate", aliti:"al", iviti:"ive", ement:"", enci:"ence", anci:"ance", izer:"ize", alli:"al", ator:"ate", logi:"log", ical:"ic", ance:"", ence:"", ness:"", able:"", ible:"", ment:"", eli:"e", bli:"ble", ful:"", ant:"", ent:"", ism:"", ate:"", iti:"", ous:"", ive:"", ize:"", al:"", ou:"", er:"", ic:""}, 
matcher:{}};
(function() {
  var a = this || window, b;
  (b = a.define) && b.amd ? b([], function() {
    return O;
  }) : "object" === typeof a.exports ? a.module.exports = O : a.FlexSearch = O;
})();
}).call(this);
