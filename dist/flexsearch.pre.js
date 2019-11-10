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
function F(a) {
  for (var b = Array(a), c = 0; c < a; c++) {
    b[c] = H();
  }
  return b;
}
function H() {
  return Object.create(null);
}
function L(a, b) {
  for (var c = 0, e = b.length; c < e; c += 2) {
    a = a.replace(b[c], b[c + 1]);
  }
  return a;
}
function M(a) {
  return new RegExp(a, "g");
}
;R.prototype.export = function(a) {
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
R.prototype.import = function(a, b) {
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
R.prototype.find = function(a, b) {
  return this.where(a, b, 1)[0] || null;
};
R.prototype.where = function(a, b, c, e) {
  var d = this._doc, h = [], f = 0, g;
  if (B(a)) {
    c || (c = b);
    var k = Object.keys(a);
    var m = k.length;
    var r = !1;
    if (1 === m && "id" === k[0]) {
      return [d[a.id]];
    }
    if ((g = this._tags) && !e) {
      for (var t = 0; t < g.length; t++) {
        var n = g[t], l = a[n];
        if (!C(l)) {
          var p = this._tag[n]["@" + l];
          if (0 === --m) {
            return p;
          }
          k.splice(k.indexOf(n), 1);
          delete a[n];
          break;
        }
      }
    }
    g = Array(m);
    for (t = 0; t < m; t++) {
      g[t] = k[t].split(":");
    }
  } else {
    if (z(a)) {
      b = e || Object.keys(d);
      c = b.length;
      for (k = 0; k < c; k++) {
        m = d[b[k]], a(m) && (h[f++] = m);
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
    m = 1;
    g = [a.split(":")];
    r = !0;
  }
  e = p || e || Object.keys(d);
  t = e.length;
  for (n = 0; n < t; n++) {
    l = p ? e[n] : d[e[n]];
    for (var w = !0, u = 0; u < m; u++) {
      r || (b = a[k[u]]);
      var v = g[u], y = v.length, A = l;
      if (1 < y) {
        for (var G = 0; G < y; G++) {
          A = A[v[G]];
        }
      } else {
        A = A[v[0]];
      }
      if (A !== b) {
        w = !1;
        break;
      }
    }
    if (w && (h[f++] = l, c && f === c)) {
      break;
    }
  }
  return h;
};
function T(a) {
  this.clear();
  this.limit = !0 !== a && a;
}
T.prototype.clear = function() {
  this.cache = H();
  this.count = H();
  this.index = H();
  this.ids = [];
};
T.prototype.set = function(a, b) {
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
T.prototype.get = function(a) {
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
var U = {memory:{encode:"extra", tokenize:"strict", threshold:0, resolution:1}, speed:{encode:"icase", tokenize:"strict", threshold:1, resolution:3, depth:2}, match:{encode:"extra", tokenize:"full", threshold:1, resolution:3}, score:{encode:"extra", tokenize:"strict", threshold:1, resolution:9, depth:4}, balance:{encode:"balance", tokenize:"strict", threshold:0, resolution:3, depth:3}, fast:{encode:"icase", tokenize:"strict", threshold:8, resolution:9, depth:1}};
M("[\\W_]+");
M("[^a-z0-9 ]");
M("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]");
M("[\u00e8\u00e9\u00ea\u00eb]");
M("[\u00ec\u00ed\u00ee\u00ef]");
M("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]");
M("[\u00f9\u00fa\u00fb\u00fc\u0171]");
M("[\u00fd\u0177\u00ff]");
M("\u00f1");
M("[\u00e7c]");
M("\u00df");
M(" & ");
M("ae");
M("ai");
M("ay");
M("ey");
M("oe");
M("ue");
M("ie");
M("sz");
M("zs");
M("ck");
M("cc");
M("sh");
M("th");
M("dt");
M("ph");
M("pf");
M("ou");
M("uo");
M("[\\W_]+");
M("[^a-z0-9 ]");
M("p");
M("z");
M("[cgq]");
M("n");
M("d");
M("[vw]");
M("[aeiouy]");
var aa = {encode:function(a) {
  return a.toLowerCase();
}, tokenize:"strict", split:/[\W_]+/, cache:!1, async:!1, worker:!1, rtl:!1, doc:!1, resolution:9, threshold:0, depth:0}, ba = 0, V = {};
function R(a) {
  if (!(this instanceof R)) {
    return new R(a);
  }
  var b = a && a.id;
  this.id = b || 0 === b ? b : ba++;
  this.init(a);
  ca(this, "index", function() {
    return Object.keys(this._ids);
  });
  ca(this, "length", function() {
    return this.index.length;
  });
}
R.registerCharset = function(a, b, c, e) {
  a = V[a] || (V[a] = {});
  a.encoder = b;
  a.split = c;
  a.rtl = e;
  return R;
};
R.registerLanguage = function(a, b, c, e) {
  a = V[a] || (V[a] = {});
  a.filter = b;
  a.stemmer = c;
  a.matcher = e;
  return R;
};
R.prototype.init = function(a) {
  this.matcher = [];
  var b;
  if (q(a)) {
    a = U[a];
  } else {
    if (b = a.preset) {
      a = Object.assign({}, U[b], a);
    }
  }
  this.encoder || (a = a ? Object.assign({}, aa, a) : aa);
  if (a) {
    var c = a.charset;
    var e = a.lang;
    this.tokenizer = a.tokenize;
    this.split = q(b = c || a.split) ? V[b] ? V[b].split : M(b) : b;
    this.rtl = q(b = c || a.rtl) ? V[b].rtl : b;
    this.async = a.async;
    this._timer = 0;
    this.threshold = a.threshold;
    this.resolution = (b = a.resolution) <= this.threshold ? this.threshold + 1 : b;
    this.depth = "strict" === this.tokenizer && a.depth || 0;
    this.encoder = q(b = c || a.encode) ? V[-1 === b.indexOf(":") ? b + ":default" : b].encode : b;
    if (c = b = e || a.matcher) {
      b = q(b) ? V[b].matcher : b;
      c = Object.keys(b);
      for (var d = c.length, h = Array(2 * d), f = 0, g = 0; f < d; f++) {
        var k = c[f];
        h[g++] = M(k);
        h[g++] = b[k];
      }
      c = h;
    }
    this.matcher = c;
    if (c = b = e || a.filter) {
      for (b = q(b) ? V[b].filter : b, c = H(), d = 0; d < b.length; d++) {
        c[b[d]] = 1;
      }
    }
    this.filter = c;
    if (e = b = e || a.stemmer) {
      e = q(b) ? V[b].stemmer : b;
      c = Object.keys(e);
      d = c.length;
      h = Array(2 * d);
      for (g = f = 0; f < d; f++) {
        k = c[f], h[g++] = M(k + "(?!\\b)" + k + "(\\b)"), h[g++] = e[k];
      }
      e = h;
    }
    this.stemmer = e;
    (this.doc = c = (b = a.doc) && da(b)) && (a.doc = null);
  }
  this._map = F(this.resolution - (this.threshold || 0));
  this._ctx = H();
  this._ids = {};
  if (c) {
    this._doc = H();
    e = c.index = {};
    b = c.keys = [];
    d = c.field;
    h = c.tag;
    f = c.store;
    x(c.id) || (c.id = c.id.split(":"));
    if (f) {
      g = H();
      if (q(f)) {
        g[f] = 1;
      } else {
        if (x(f)) {
          for (k = 0; k < f.length; k++) {
            g[f[k]] = 1;
          }
        } else {
          B(f) && (g = f);
        }
      }
      c.store = g;
    }
    if (h) {
      this._tag = H();
      f = H();
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
        this._tag[h[d]] = H();
      }
      this._tags = h;
      d = f;
    }
    if (d) {
      if (!x(d)) {
        if (B(d)) {
          var m = d;
          c.field = d = Object.keys(d);
        } else {
          c.field = d = [d];
        }
      }
      for (c = 0; c < d.length; c++) {
        h = d[c], x(h) || (m && (a = m[h]), b[c] = h, d[c] = h.split(":")), e[h] = new R(a);
      }
    }
  }
  if (b = a.cache) {
    this._cache_status = !0, this._cache = new T(b);
  }
  return this;
};
function da(a) {
  var b = H(), c;
  for (c in a) {
    if (a.hasOwnProperty(c)) {
      var e = a[c];
      x(e) ? b[c] = e.slice(0) : B(e) ? b[c] = da(e) : b[c] = e;
    }
  }
  return b;
}
R.prototype.add = function(a, b, c, e, d) {
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
    c = this.tokenize(b);
    d = H();
    d._ctx = H();
    for (var f = c.length, g = this.threshold, k = this.depth, m = this.resolution, r = this._map, t = this.rtl, n = 0; n < f; n++) {
      var l = c[n];
      if (l) {
        var p = l.length, w = (t ? n + 1 : f - n) / f, u = "";
        switch(this.tokenizer) {
          case "reverse":
          case "both":
            for (var v = p; --v;) {
              u = l[v] + u, W(r, d, u, a, t ? 1 : (p - v) / p, w, g, m - 1);
            }
            u = "";
          case "forward":
            for (v = 0; v < p; v++) {
              u += l[v], W(r, d, u, a, t ? (v + 1) / p : 1, w, g, m - 1);
            }
            break;
          case "full":
            for (v = 0; v < p; v++) {
              for (var y = (t ? v + 1 : p - v) / p, A = p; A > v; A--) {
                u = l.substring(v, A), W(r, d, u, a, y, w, g, m - 1);
              }
            }
            break;
          default:
            if (p = W(r, d, l, a, 1, w, g, m - 1), k && 1 < f && p >= g) {
              for (p = d._ctx[l] || (d._ctx[l] = H()), l = this._ctx[l] || (this._ctx[l] = F(m - (g || 0))), w = n - k, u = n + k + 1, 0 > w && (w = 0), u > f && (u = f); w < u; w++) {
                w !== n && W(l, p, c[w], a, 0, m - (w < n ? n - w : w - n), g, m - 1);
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
R.prototype.handle_docs = function(a, b, c) {
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
    var m = this.doc.id;
    e = b;
    for (var r = 0; r < m.length; r++) {
      e = e[m[r]];
    }
    if ("remove" === a && (delete this._doc[e], m = f.length, m--)) {
      for (b = 0; b < m; b++) {
        h[f[b]].remove(e);
      }
      return h[f[m]].remove(e, c);
    }
    if (g) {
      for (k = 0; k < g.length; k++) {
        var t = g[k];
        var n = b;
        m = t.split(":");
        for (r = 0; r < m.length; r++) {
          n = n[m[r]];
        }
        n = "@" + n;
      }
      k = this._tag[t];
      k = k[n] || (k[n] = []);
    }
    m = this.doc.field;
    g = 0;
    for (t = m.length; g < t; g++) {
      r = m[g];
      n = b;
      for (var l = 0; l < r.length; l++) {
        n = n[r[l]];
      }
      r = h[f[g]];
      "add" === a ? r.add(e, n, g === t - 1 && c) : r.update(e, n, g === t - 1 && c);
    }
    if (d) {
      c = Object.keys(d);
      a = H();
      for (h = 0; h < c.length; h++) {
        if (f = c[h], d[f]) {
          for (f = f.split(":"), g = m = void 0, t = 0; t < f.length; t++) {
            n = f[t], m = (m || b)[n], g = (g || a)[n] = m;
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
R.prototype.update = function(a, b, c) {
  if (this.doc && B(a)) {
    return this.handle_docs("update", a, b);
  }
  this._ids[a] && q(b) && (this.remove(a), this.add(a, b, c, !0));
  return this;
};
R.prototype.remove = function(a, b, c) {
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
R.prototype.merge_and_sort = function(a, b, c, e, d, h, f, g, k, m) {
  c = ea(c, f ? 0 : d, g, h, b, k, m);
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
  e && (z(e) || (Y = e.split(":"), 1 < Y.length ? e = fa : (Y = Y[0], e = ha)), c.sort(e));
  c = Z(g, r, c);
  this._cache && this._cache.set(a, c);
  return c;
};
R.prototype.search = function(a, b, c, e) {
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
    var m = a.threshold;
    var r = a.suggest;
    a = a.query;
  }
  if (this.doc) {
    m = this.doc.index;
    var t = f.where, n = f.bool || "or", l = f.field, p = n, w, u;
    if (l) {
      x(l) || (l = [l]);
    } else {
      if (x(f)) {
        var v = f;
        l = [];
        p = [];
        for (var y = 0; y < f.length; y++) {
          e = f[y], d = e.bool || n, l[y] = e.field, p[y] = d, "not" === d ? w = !0 : "and" === d && (u = !0);
        }
      } else {
        l = this.doc.keys;
      }
    }
    n = l.length;
    for (y = 0; y < n; y++) {
      v && (f = v[y]), k && !q(f) && (f.page = null, f.limit = 0), h[y] = m[l[y]].search(f, 0);
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
  m || (m = this.threshold || 0);
  if (!e) {
    if (this.async && "function" !== typeof importScripts) {
      var G = this;
      m = new Promise(function(a) {
        setTimeout(function() {
          a(G.search(f, b, null, !0));
          G = null;
        });
      });
      if (c) {
        m.then(c);
      } else {
        return m;
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
  c = this.tokenize(f);
  v = c.length;
  e = !0;
  d = [];
  var O = H(), P = 0;
  1 < v && (this.depth ? n = !0 : c.sort(ia));
  if (!n || (y = this._ctx)) {
    for (var S = this.resolution; P < v; P++) {
      var D = c[P];
      if (D) {
        if (n) {
          if (!l) {
            if (y[D]) {
              l = D, O[D] = 1;
            } else {
              if (!r) {
                return h;
              }
            }
          }
          if (r && P === v - 1 && !d.length) {
            n = !1, D = l || D, O[D] = 0;
          } else {
            if (!l) {
              continue;
            }
          }
        }
        if (!O[D]) {
          var E = [], N = !1, I = 0, J = n ? y[l] : this._map;
          if (J) {
            for (var Q = void 0, K = 0; K < S - m; K++) {
              if (Q = J[K] && J[K][D]) {
                E[I++] = Q, N = !0;
              }
            }
          }
          if (N) {
            l = D, d[d.length] = 1 < I ? E.concat.apply([], E) : E[0];
          } else {
            if (!r) {
              e = !1;
              break;
            }
          }
          O[D] = 1;
        }
      }
    }
  } else {
    e = !1;
  }
  e && (h = ea(d, b, k, r));
  this._cache && this._cache.set(a, h);
  return h;
};
R.prototype.info = function() {
  return {id:this.id, items:this.length, matcher:this.matcher.length, worker:this.worker, threshold:this.threshold, depth:this.depth, resolution:this.resolution, contextual:this.depth && "strict" === this.tokenizer};
};
R.prototype.clear = function() {
  return this.destroy().init();
};
R.prototype.destroy = function() {
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
function ca(a, b, c) {
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
R.prototype.encode = function(a) {
  a && this.encoder && (a = this.encoder(a));
  a && this.matcher.length && (a = L(a, this.matcher));
  a && this.stemmer && (a = L(a, this.stemmer));
  return a;
};
R.prototype.tokenize = function(a) {
  a = x(a) ? a : z(this.tokenizer) ? this.tokenizer(a) : a.split(this.split);
  if (this.filter) {
    for (var b = this.filter, c = a.length, e = z(b), d = [], h = 0, f = 0; h < c; h++) {
      var g = a[h];
      g && (e && b(g) || !e && !b[g]) && (d[f++] = g);
    }
    a = d;
  }
  return a;
};
function ia(a, b) {
  return b.length - a.length;
}
function ha(a, b) {
  return a[Y] - b[Y];
}
function fa(a, b) {
  for (var c = Y.length, e = 0; e < c; e++) {
    a = a[Y[e]], b = b[Y[e]];
  }
  return a - b;
}
function Z(a, b, c) {
  return a ? {page:a, next:b ? "" + b : null, result:c} : c;
}
function ea(a, b, c, e, d, h, f) {
  var g = [];
  if (!0 === c) {
    c = "0";
    var k = "";
  } else {
    k = c && c.split(":");
  }
  var m = a.length;
  if (1 < m) {
    var r = H(), t = [], n, l = 0, p, w = !0, u = 0, v;
    if (k) {
      if (2 === k.length) {
        var y = k;
        k = !1;
      } else {
        k = v = parseInt(k[0], 10);
      }
    }
    if (f) {
      for (n = H(); l < m; l++) {
        if ("not" === d[l]) {
          var A = a[l];
          var G = A.length;
          for (p = 0; p < G; p++) {
            n["@" + A[p]] = 1;
          }
        } else {
          var O = l + 1;
        }
      }
      if (C(O)) {
        return Z(c, K, g);
      }
      l = 0;
    } else {
      var P = q(d) && d;
    }
    for (var S; l < m; l++) {
      var D = l === (O || m) - 1;
      if (!P || !l) {
        if ((p = P || d && d[l]) && "and" !== p) {
          if ("or" === p) {
            S = !1;
          } else {
            continue;
          }
        } else {
          S = h = !0;
        }
      }
      A = a[l];
      if (G = A.length) {
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
        for (p = 0; p < G; p++) {
          E = A[p];
          var J = "@" + E, Q = h ? r[J] || 0 : l;
          if (!(!Q && !e || f && n[J] || !h && r[J])) {
            if (Q === l) {
              if (D) {
                if (!v || --v < u) {
                  if (g[u++] = E, b && u === b) {
                    return Z(c, u + (k || 0), g);
                  }
                }
              } else {
                r[J] = l + 1;
              }
              N = !0;
            } else {
              e && (J = t[Q] || (t[Q] = []), J[J.length] = E);
            }
          }
        }
        if (S && !N && !e) {
          break;
        }
      } else {
        if (S && !e) {
          return Z(c, K, A);
        }
      }
    }
    if (I) {
      if (l = I.length, f) {
        for (p = k ? parseInt(k, 10) : 0; p < l; p++) {
          a = I[p], n["@" + a] || (g[u++] = a);
        }
      } else {
        g = I;
      }
    }
    if (e) {
      for (u = g.length, y ? (l = parseInt(y[0], 10) + 1, p = parseInt(y[1], 10) + 1) : (l = t.length, p = 0); l--;) {
        if (E = t[l]) {
          for (G = E.length; p < G; p++) {
            if (e = E[p], !f || !n["@" + e]) {
              if (g[u++] = e, b && u === b) {
                return Z(c, l + ":" + p, g);
              }
            }
          }
          p = 0;
        }
      }
    }
  } else {
    !m || d && "not" === d[0] || (g = a[0], k && (k = parseInt(k[0], 10)));
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
;(function() {
  var a = this || window, b;
  (b = a.define) && b.amd ? b([], function() {
    return R;
  }) : "object" === typeof a.exports ? a.module.exports = R : a.FlexSearch = R;
})();
}).call(this);
