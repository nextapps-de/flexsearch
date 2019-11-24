(function(){'use strict';
Object.assign || (Object.assign = function() {
  for (var a = arguments, b = a.length, c = a[0], e = 1, d, g, f; e < b; e++) {
    d = a[e];
    g = Object.keys(d);
    f = g.length;
    for (var h = 0, k; h < f; h++) {
      k = g[h], c[k] = d[k];
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
function r(a) {
  return "string" === typeof a;
}
function y(a) {
  return a.constructor === Array;
}
function z(a) {
  return "function" === typeof a;
}
function E(a) {
  return "object" === typeof a;
}
function F(a) {
  return "undefined" === typeof a;
}
function aa(a) {
  for (var b = Array(a), c = 0; c < a; c++) {
    b[c] = G();
  }
  return b;
}
function G() {
  return Object.create(null);
}
function K(a, b) {
  for (var c = 0, e = b.length; c < e && (a = a.replace(b[c], b[c + 1]), a); c += 2) {
  }
  return a;
}
function L(a) {
  return new RegExp(a, "g");
}
function O(a) {
  for (var b = "", c = "", e = 0, d = a.length, g; e < d; e++) {
    (g = a[e]) !== c && (b += c = g);
  }
  return b;
}
R.prototype.pipeline = function(a, b, c, e) {
  if (a && (b && a && (a = K(a, b)), a && this.matcher && (a = K(a, this.matcher)), this.stemmer && 1 < a.length && (a = K(a, this.stemmer)), e && 1 < a.length && (a = O(a)), a && (c || "" === c) && (a = a.split(c), this.filter))) {
    b = this.filter;
    c = a.length;
    e = [];
    for (var d = 0, g = 0; d < c; d++) {
      var f = a[d];
      f && !b[f] && (e[g++] = f);
    }
    a = e;
  }
  return a;
};
R.prototype.export = function(a) {
  var b = !a || F(a.serialize) || a.serialize;
  if (this.doc) {
    var c = !a || F(a.doc) || a.doc, e = !a || F(a.index) || a.index;
    a = [];
    var d = 0;
    if (e) {
      for (e = this.doc.keys; d < e.length; d++) {
        var g = this.doc.index[e[d]];
        a[d] = [g._map, g._ctx, Object.keys(g._ids)];
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
  if (!b || F(b.serialize) || b.serialize) {
    a = JSON.parse(a);
  }
  var c = {};
  if (this.doc) {
    var e = !b || F(b.doc) || b.doc, d = 0;
    if (!b || F(b.index) || b.index) {
      b = this.doc.keys;
      for (var g = b.length, f = a[0][2]; d < f.length; d++) {
        c[f[d]] = 1;
      }
      for (d = 0; d < g; d++) {
        f = this.doc.index[b[d]];
        var h = a[d];
        h && (f._map = h[0], f._ctx = h[1], f._ids = c);
      }
    }
    e && (this._doc = E(e) ? e : a[d]);
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
  var d = this._doc, g = [], f = 0, h;
  if (E(a)) {
    c || (c = b);
    var k = Object.keys(a);
    var m = k.length;
    var q = !1;
    if (1 === m && "id" === k[0]) {
      return [d[a.id]];
    }
    if ((h = this._tags) && !e) {
      for (var u = 0; u < h.length; u++) {
        var p = h[u], l = a[p];
        if (!F(l)) {
          var n = this._tag[p]["@" + l];
          if (0 === --m) {
            return n;
          }
          k.splice(k.indexOf(p), 1);
          delete a[p];
          break;
        }
      }
    }
    h = Array(m);
    for (u = 0; u < m; u++) {
      h[u] = k[u].split(":");
    }
  } else {
    if (z(a)) {
      b = e || Object.keys(d);
      c = b.length;
      for (k = 0; k < c; k++) {
        m = d[b[k]], a(m) && (g[f++] = m);
      }
      return g;
    }
    if (F(b)) {
      return [d[a]];
    }
    if ("id" === a) {
      return [d[b]];
    }
    k = [a];
    m = 1;
    h = [a.split(":")];
    q = !0;
  }
  e = n || e || Object.keys(d);
  u = e.length;
  for (p = 0; p < u; p++) {
    l = n ? e[p] : d[e[p]];
    for (var w = !0, v = 0; v < m; v++) {
      q || (b = a[k[v]]);
      var x = h[v], t = x.length, A = l;
      if (1 < t) {
        for (var B = 0; B < t; B++) {
          A = A[x[B]];
        }
      } else {
        A = A[x[0]];
      }
      if (A !== b) {
        w = !1;
        break;
      }
    }
    if (w && (g[f++] = l, c && f === c)) {
      break;
    }
  }
  return g;
};
function S(a) {
  this.clear();
  this.limit = !0 !== a && a;
}
S.prototype.clear = function() {
  this.cache = G();
  this.count = G();
  this.index = G();
  this.ids = [];
};
S.prototype.set = function(a, b) {
  if (this.limit && F(this.cache[a])) {
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
      for (var g = this.ids, f = d; this.count[g[--d]] <= c && -1 !== d;) {
      }
      d++;
      if (d !== f) {
        for (c = f; c > d; c--) {
          f = g[c - 1], g[c] = f, e[f] = c;
        }
        g[d] = a;
        e[a] = d;
      }
    }
  }
  return b;
};
var ba = {memory:{charset:"latin:extra", threshold:0, resolution:1}, speed:{threshold:1, resolution:3, depth:2}, match:{charset:"latin:extra", tokenize:"full", threshold:1, resolution:3}, score:{charset:"latin:extra", threshold:1, resolution:9, depth:4}, balance:{charset:"latin:balance", threshold:0, resolution:3, depth:3}, fast:{threshold:8, resolution:9, depth:1}};
var da = {encode:ca, rtl:!1}, ea = /[\W_]+/;
function ca(a) {
  return this.pipeline(a.toLowerCase(), !1, ea, !1);
}
;var fa = 0, U = {}, V = {};
function R(a) {
  if (!(this instanceof R)) {
    return new R(a);
  }
  var b = a && a.id;
  this.id = b || 0 === b ? b : fa++;
  this.init(a);
  ha(this, "index", function() {
    return this.doc ? Object.keys(this.doc.index[this.doc.keys[0]]._ids) : Object.keys(this._ids);
  });
  ha(this, "length", function() {
    return this.index.length;
  });
}
R.registerCharset = function(a, b) {
  V[a] = b;
  return R;
};
R.registerLanguage = function(a, b) {
  U[a] = b;
  return R;
};
R.prototype.init = function(a) {
  var b, c;
  if (a) {
    if (r(a)) {
      a = ba[a];
    } else {
      if (b = a.preset) {
        a = Object.assign({}, ba[b], a);
      }
    }
  }
  a || (a = {});
  this.async = a.async;
  this.timer = 0;
  var e = a.charset, d = a.lang;
  r(e) && (-1 === e.indexOf(":") && (e += ":default"), e = V[e]);
  r(d) && (d = U[d]);
  this.tokenizer = b = e && e.tokenize || a.tokenize || "strict";
  this.depth = "strict" === b && a.depth || 0;
  this.rtl = e && e.rtl || a.rtl || !1;
  this.resolution = a.resolution || 9;
  this.threshold = b = a.threshold || 0;
  this.resolution <= b && (this.resolution = b + 1);
  this.encode = a.encode || e && e.encode || ca;
  this.matcher = (b = a.matcher || d && d.matcher) && ia(b, !1);
  this.stemmer = (b = a.stemmer || d && d.stemmer) && ia(b, !0);
  if (e = b = a.filter || d && d.filter) {
    e = b;
    d = G();
    var g = 0;
    for (c = e.length; g < c; g++) {
      d[e[g]] = 1;
    }
    e = d;
  }
  this.filter = e;
  (this.doc = c = (b = a.doc) && ja(b)) && (a.doc = null);
  this._map = aa(this.resolution - this.threshold);
  this._ctx = G();
  this._ids = G();
  if (c) {
    this._doc = G();
    e = c.index = {};
    d = c.keys = [];
    g = c.field;
    var f = c.tag, h = c.store;
    y(c.id) || (c.id = c.id.split(":"));
    if (h) {
      var k = G();
      if (r(h)) {
        k[h] = 1;
      } else {
        if (y(h)) {
          for (var m = 0; m < h.length; m++) {
            k[h[m]] = 1;
          }
        } else {
          E(h) && (k = h);
        }
      }
      c.store = k;
    }
    if (f) {
      this._tag = G();
      h = G();
      if (g) {
        if (r(g)) {
          h[g] = a;
        } else {
          if (y(g)) {
            for (k = 0; k < g.length; k++) {
              h[g[k]] = a;
            }
          } else {
            E(g) && (h = g);
          }
        }
      }
      y(f) || (c.tag = f = [f]);
      for (g = 0; g < f.length; g++) {
        this._tag[f[g]] = G();
      }
      this._tags = f;
      g = h;
    }
    if (g) {
      if (!y(g)) {
        if (E(g)) {
          var q = g;
          c.field = g = Object.keys(g);
        } else {
          c.field = g = [g];
        }
      }
      for (c = 0; c < g.length; c++) {
        f = g[c], y(f) || (q && (a = q[f]), d[c] = f, g[c] = f.split(":")), e[f] = new R(a);
      }
    }
  }
  this._cache_status = !0;
  this._cache = (b = a.cache) && new S(b);
  return this;
};
function ja(a) {
  var b = G(), c;
  for (c in a) {
    if (a.hasOwnProperty(c)) {
      var e = a[c];
      y(e) ? b[c] = e.slice(0) : E(e) ? b[c] = ja(e) : b[c] = e;
    }
  }
  return b;
}
R.prototype.add = function(a, b, c, e, d) {
  if (this.doc && E(a)) {
    return this.handle_docs("add", a, b);
  }
  if (b && r(b) && (a || 0 === a)) {
    if (this._ids[a] && !e) {
      return this.update(a, b);
    }
    if (!d) {
      if (this.async) {
        var g = this, f = new Promise(function(c) {
          setTimeout(function() {
            g.add(a, b, null, e, !0);
            g = null;
            c();
          });
        });
        if (c) {
          f.then(c);
        } else {
          return f;
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
    d = G();
    d._ctx = G();
    for (var h = c.length, k = this.threshold, m = this.depth, q = this.resolution, u = this._map, p = this.rtl, l = 0; l < h; l++) {
      var n = c[l];
      if (n) {
        f = 1;
        var w = n.length, v = (p ? l + 1 : h - l) / h, x = "";
        switch(this.tokenizer) {
          case "reverse":
          case "both":
            for (var t = w; --t;) {
              x = n[t] + x, W(u, d, x, a, p ? 1 : (w - t) / w, v, k, q - 1);
            }
            x = "";
          case "forward":
            for (t = 0; t < w; t++) {
              x += n[t], W(u, d, x, a, p ? (t + 1) / w : 1, v, k, q - 1);
            }
            break;
          case "full":
            for (t = 0; t < w; t++) {
              for (var A = (p ? t + 1 : w - t) / w, B = w; B > t; B--) {
                x = n.substring(t, B), W(u, d, x, a, A, v, k, q - 1);
              }
            }
            break;
          default:
            if (w = W(u, d, n, a, 1, v, k, q - 1), m && 1 < h && w >= k) {
              for (w = d._ctx[n] || (d._ctx[n] = G()), n = this._ctx[n] || (this._ctx[n] = aa(q - (k || 0))), v = l - m, x = l + m + 1, 0 > v && (v = 0), x > h && (x = h); v < x; v++) {
                v !== l && W(n, w, c[v], a, 0, q - (v < l ? l - v : v - l), k, q - 1);
              }
            }
        }
      }
    }
    f && (this._ids[a] = 1);
    this._cache_status = !1;
  }
  return this;
};
R.prototype.handle_docs = function(a, b, c) {
  if (y(b)) {
    var e = b.length;
    if (e) {
      for (var d = 0; d < e; d++) {
        this.handle_docs(a, b[d], d === e - 1 && c);
      }
    }
  } else {
    var g = this.doc.index, f = this.doc.keys, h = this.doc.tag;
    d = this.doc.store;
    var k;
    var m = this.doc.id;
    e = b;
    for (var q = 0; q < m.length; q++) {
      e = e[m[q]];
    }
    if ("remove" === a) {
      if (delete this._doc[e], b = f.length) {
        for (d = 0; d < b; d++) {
          g[f[d]].remove(e, d === b - 1 && c);
        }
      }
    } else {
      if (h) {
        for (k = 0; k < h.length; k++) {
          var u = h[k];
          var p = b;
          m = u.split(":");
          for (q = 0; q < m.length; q++) {
            p = p[m[q]];
          }
          p = "@" + p;
        }
        k = this._tag[u];
        k = k[p] || (k[p] = []);
      }
      m = this.doc.field;
      h = 0;
      for (u = m.length; h < u; h++) {
        q = m[h];
        p = b;
        for (var l = 0; l < q.length; l++) {
          p = p[q[l]];
        }
        q = g[f[h]];
        "add" === a ? q.add(e, p, h === u - 1 && c) : q.update(e, p, h === u - 1 && c);
      }
      if (d) {
        c = Object.keys(d);
        a = G();
        for (g = 0; g < c.length; g++) {
          if (f = c[g], d[f]) {
            for (f = f.split(":"), h = m = void 0, u = 0; u < f.length; u++) {
              p = f[u], m = (m || b)[p], h = (h || a)[p] = m;
            }
          }
        }
        b = a;
      }
      k && (k[k.length] = b);
      this._doc[e] = b;
    }
  }
  return this;
};
R.prototype.update = function(a, b, c) {
  if (this.doc && E(a)) {
    return this.handle_docs("update", a, b);
  }
  this._ids[a] && r(b) && (this.remove(a), this.add(a, b, c, !0));
  return this;
};
R.prototype.remove = function(a, b, c) {
  if (this.doc && E(a)) {
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
R.prototype.merge_and_sort = function(a, b, c, e, d, g, f, h, k, m) {
  c = ka(c, f ? 0 : d, h, g, b, k, m);
  if (h) {
    h = c.page;
    var q = c.next;
    c = c.result;
  }
  if (f) {
    c = this.where(f, null, d, c);
  } else {
    b = c;
    c = this._doc;
    d = b.length;
    g = Array(d);
    for (f = 0; f < d; f++) {
      g[f] = c[b[f]];
    }
    c = g;
  }
  e && (z(e) || (Y = e.split(":"), e = 1 < Y.length ? la : ma), c.sort(e));
  c = Z(h, q, c);
  this._cache && this._cache.set(a, c);
  return c;
};
R.prototype.search = function(a, b, c, e) {
  if (E(b)) {
    if (y(b)) {
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
  var g = [], f = a;
  if (E(a) && !y(a)) {
    c || (c = a.callback) && (f.callback = null);
    var h = a.sort;
    var k = a.page;
    b = a.limit;
    var m = a.threshold;
    var q = a.suggest;
    a = a.query;
  }
  if (this.doc) {
    m = this.doc.index;
    var u = f.where, p = f.bool || "or", l = f.field, n = p, w, v;
    if (l) {
      y(l) || (l = [l]);
    } else {
      if (y(f)) {
        var x = f;
        l = [];
        n = [];
        for (var t = 0; t < f.length; t++) {
          e = f[t], d = e.bool || p, l[t] = e.field, n[t] = d, "not" === d ? w = !0 : "and" === d && (v = !0);
        }
      } else {
        l = this.doc.keys;
      }
    }
    p = l.length;
    for (t = 0; t < p; t++) {
      x && (f = x[t]), k && !r(f) && (f.page = null, f.limit = 0), g[t] = m[l[t]].search(f, 0);
    }
    if (c) {
      return c(this.merge_and_sort(a, n, g, h, b, q, u, k, v, w));
    }
    if (this.async) {
      var A = this;
      return new Promise(function(c) {
        Promise.all(g).then(function(d) {
          c(A.merge_and_sort(a, n, d, h, b, q, u, k, v, w));
        });
      });
    }
    return this.merge_and_sort(a, n, g, h, b, q, u, k, v, w);
  }
  m || (m = this.threshold || 0);
  if (!e) {
    if (this.async && "function" !== typeof importScripts) {
      var B = this;
      m = new Promise(function(a) {
        setTimeout(function() {
          a(B.search(f, b, null, !0));
          B = null;
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
  if (!a || !r(a)) {
    return g;
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
    return g;
  }
  c = f;
  x = c.length;
  e = !0;
  d = [];
  var N = G(), P = 0;
  1 < x && (this.depth ? p = !0 : c.sort(na));
  if (!p || (t = this._ctx)) {
    for (var T = this.resolution; P < x; P++) {
      var C = c[P];
      if (C) {
        if (p) {
          if (!l) {
            if (t[C]) {
              l = C, N[C] = 1;
            } else {
              if (!q) {
                return g;
              }
            }
          }
          if (q && P === x - 1 && !d.length) {
            p = !1, C = l || C, N[C] = 0;
          } else {
            if (!l) {
              continue;
            }
          }
        }
        if (!N[C]) {
          var D = [], M = !1, H = 0, I = p ? t[l] : this._map;
          if (I) {
            for (var Q = void 0, J = 0; J < T - m; J++) {
              if (Q = I[J] && I[J][C]) {
                D[H++] = Q, M = !0;
              }
            }
          }
          if (M) {
            l = C, d[d.length] = 1 < H ? D.concat.apply([], D) : D[0];
          } else {
            if (!q) {
              e = !1;
              break;
            }
          }
          N[C] = 1;
        }
      }
    }
  } else {
    e = !1;
  }
  e && (g = ka(d, b, k, q));
  this._cache && this._cache.set(a, g);
  return g;
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
function ha(a, b, c) {
  Object.defineProperty(a, b, {get:c});
}
function W(a, b, c, e, d, g, f, h) {
  if (b[c]) {
    return b[c];
  }
  d = d ? (h - (f || h / 1.5)) * g + (f || h / 1.5) * d : g;
  b[c] = d;
  d >= f && (a = a[h - (d + 0.5 >> 0)], a = a[c] || (a[c] = []), a[a.length] = e);
  return d;
}
function X(a, b) {
  if (a) {
    for (var c = Object.keys(a), e = 0, d = c.length; e < d; e++) {
      var g = c[e], f = a[g];
      if (f) {
        for (var h = 0, k = f.length; h < k; h++) {
          if (f[h] === b) {
            1 === k ? delete a[g] : f.splice(h, 1);
            break;
          } else {
            E(f[h]) && X(f[h], b);
          }
        }
      }
    }
  }
}
function ia(a, b) {
  for (var c = Object.keys(a), e = c.length, d = [], g = "", f = 0, h = 0, k; h < e; h++) {
    var m = c[h];
    (k = a[m]) ? (d[f++] = L(b ? "(?!\\b)" + m + "(\\b|_)" : m), d[f++] = k) : g += (g ? "|" : "") + m;
  }
  g && (d[f++] = L(b ? "(?!\\b)(" + g + ")(\\b|_)" : "(" + g + ")"), d[f] = "");
  return d;
}
function na(a, b) {
  return b.length - a.length;
}
function ma(a, b) {
  a = a[Y];
  b = b[Y];
  return a < b ? -1 : a > b ? 1 : 0;
}
function la(a, b) {
  for (var c = Y.length, e = 0; e < c; e++) {
    a = a[Y[e]], b = b[Y[e]];
  }
  return a < b ? -1 : a > b ? 1 : 0;
}
function Z(a, b, c) {
  return a ? {page:a, next:b ? "" + b : null, result:c} : c;
}
function ka(a, b, c, e, d, g, f) {
  var h = [];
  if (!0 === c) {
    c = "0";
    var k = "";
  } else {
    k = c && c.split(":");
  }
  var m = a.length;
  if (1 < m) {
    var q = G(), u = [], p, l = 0, n, w = !0, v = 0, x;
    if (k) {
      if (2 === k.length) {
        var t = k;
        k = !1;
      } else {
        k = x = parseInt(k[0], 10);
      }
    }
    if (f) {
      for (p = G(); l < m; l++) {
        if ("not" === d[l]) {
          var A = a[l];
          var B = A.length;
          for (n = 0; n < B; n++) {
            p["@" + A[n]] = 1;
          }
        } else {
          var N = l + 1;
        }
      }
      if (F(N)) {
        return Z(c, J, h);
      }
      l = 0;
    } else {
      var P = r(d) && d;
    }
    for (var T; l < m; l++) {
      var C = l === (N || m) - 1;
      if (!P || !l) {
        if ((n = P || d && d[l]) && "and" !== n) {
          if ("or" === n) {
            T = !1;
          } else {
            continue;
          }
        } else {
          T = g = !0;
        }
      }
      A = a[l];
      if (B = A.length) {
        if (w) {
          if (H) {
            var D = H.length;
            for (n = 0; n < D; n++) {
              w = H[n];
              var M = "@" + w;
              f && p[M] || (q[M] = 1, g || (h[v++] = w));
            }
            var H = null;
            w = !1;
          } else {
            H = A;
            continue;
          }
        }
        M = !1;
        for (n = 0; n < B; n++) {
          D = A[n];
          var I = "@" + D, Q = g ? q[I] || 0 : l;
          if (!(!Q && !e || f && p[I] || !g && q[I])) {
            if (Q === l) {
              if (C) {
                if (!x || --x < v) {
                  if (h[v++] = D, b && v === b) {
                    return Z(c, v + (k || 0), h);
                  }
                }
              } else {
                q[I] = l + 1;
              }
              M = !0;
            } else {
              e && (I = u[Q] || (u[Q] = []), I[I.length] = D);
            }
          }
        }
        if (T && !M && !e) {
          break;
        }
      } else {
        if (T && !e) {
          return Z(c, J, A);
        }
      }
    }
    if (H) {
      if (l = H.length, f) {
        for (n = k ? parseInt(k, 10) : 0; n < l; n++) {
          a = H[n], p["@" + a] || (h[v++] = a);
        }
      } else {
        h = H;
      }
    }
    if (e) {
      for (v = h.length, t ? (l = parseInt(t[0], 10) + 1, n = parseInt(t[1], 10) + 1) : (l = u.length, n = 0); l--;) {
        if (D = u[l]) {
          for (B = D.length; n < B; n++) {
            if (e = D[n], !f || !p["@" + e]) {
              if (h[v++] = e, b && v === b) {
                return Z(c, l + ":" + n, h);
              }
            }
          }
          n = 0;
        }
      }
    }
  } else {
    !m || d && "not" === d[0] || (h = a[0], k && (k = parseInt(k[0], 10)));
  }
  if (b) {
    f = h.length;
    k && k > f && (k = 0);
    k = k || 0;
    var J = k + b;
    J < f ? h = h.slice(k, J) : (J = 0, k && (h = h.slice(k)));
  }
  return Z(c, J, h);
}
;var pa = {encode:oa, rtl:!1}, qa = /[\W_]+/, ra = L("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"), sa = L("[\u00e8\u00e9\u00ea\u00eb]"), ta = L("[\u00ec\u00ed\u00ee\u00ef]"), ua = L("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"), va = L("[\u00f9\u00fa\u00fb\u00fc\u0171]"), wa = L("[\u00fd\u0177\u00ff]"), xa = L("\u00f1"), ya = L("[\u00e7c]"), za = L("\u00df"), Aa = L(" & "), Ba = [ra, "a", sa, "e", ta, "i", ua, "o", va, "u", wa, "y", xa, "n", ya, "k", za, "s", Aa, " and "];
function oa(a, b) {
  return (b || this).pipeline(a.toLowerCase(), Ba, qa, !1);
}
;var Da = {encode:Ca, rtl:!1}, Ea = L("ae"), Fa = L("ai"), Ga = L("ay"), Ha = L("ey"), Ia = L("oe"), Ja = L("ue"), Ka = L("ie"), La = L("sz"), Ma = L("zs"), Na = L("ck"), Oa = L("cc"), Pa = L("sh"), Qa = L("th"), Ra = L("dt"), Sa = L("ph"), Ta = L("pf"), Ua = L("ou"), Va = L("uo"), Wa = [Ea, "a", Fa, "ei", Ga, "ei", Ha, "ei", Ia, "o", Ja, "u", Ka, "i", La, "s", Ma, "s", Pa, "s", Na, "k", Oa, "k", Qa, "t", Ra, "t", Sa, "f", Ta, "f", Ua, "o", Va, "u"];
function Ca(a, b, c) {
  a && (a = oa(a, b || this).join(" "), 2 < a.length && (a = K(a, Wa)), c || (1 < a.length && (a = O(a)), a && (a = a.split(" "))));
  return a;
}
;var Ya = {encode:Xa, rtl:!1}, Za = /[\W_]+/;
function Xa(a) {
  return this.pipeline(a.toLowerCase(), !1, Za, !1);
}
;var ab = {encode:$a, rtl:!1}, bb = L("(?!\\b)p"), cb = L("(?!\\b)z"), db = L("(?!\\b)[cgq]"), eb = L("(?!\\b)n"), fb = L("(?!\\b)d"), gb = L("(?!\\b)[vw]"), hb = L("(?!\\b)[aeiouy]"), ib = [bb, "b", cb, "s", db, "k", eb, "m", fb, "t", gb, "f", hb, ""];
function $a(a) {
  a && (a = Ca(a, this, !0), 1 < a.length && (a = K(a, ib)), 1 < a.length && (a = O(a)), a && (a = a.split(" ")));
  return a;
}
;var kb = {encode:jb, rtl:!1, tokenize:"strict"}, lb = /[^a-z]+/;
function jb(a) {
  a = this.pipeline(a.toLowerCase(), !1, !1, !1);
  var b = [];
  if (a) {
    for (var c = a.split(lb), e = c.length, d = 0, g = 0; d < e; d++) {
      if ((a = c[d]) && 2 < a.length && (!this.filter || !this.filter[a])) {
        for (var f = a[0], h = mb(f), k = 1; k < a.length; k++) {
          var m = mb(a[k]);
          if (m !== h && (f += m, h = m, 4 === f.length)) {
            break;
          }
        }
        b[g++] = (f + "0000").substring(0, 4);
      }
    }
  }
  return b;
}
function mb(a) {
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
;var ob = {encode:nb, rtl:!0}, pb = /[\x00-\x7F]+/g;
function nb(a) {
  return this.pipeline(a.replace(pb, " "), !1, " ", !1);
}
;var rb = {encode:qb, rtl:!1, tokenize:"strict"}, sb = /[\x00-\x7F]+/g;
function qb(a) {
  return this.pipeline(a.replace(sb, ""), !1, "", !1);
}
;var ub = {encode:tb, rtl:!1}, vb = /[\x00-\x7F]+/g;
function tb(a) {
  return this.pipeline(a.replace(vb, " "), !1, " ", !1);
}
;V["latin:advanced"] = Da;
V["latin:balance"] = Ya;
V["latin:default"] = da;
V["latin:extra"] = ab;
V["latin:simple"] = pa;
V["latin:soundex"] = kb;
V["arabic:default"] = ob;
V["cjk:default"] = rb;
V["cyrillic:default"] = ub;
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
    return R;
  }) : "object" === typeof a.exports ? a.module.exports = R : a.FlexSearch = R;
})();
}).call(this);
