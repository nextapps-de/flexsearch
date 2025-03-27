## Auto-Balanced Cache (By Popularity)

You need to initialize the cache and its limit during the creation of the index:

```js
const index = new Index({ cache: 100 });
```

```js
const results = index.searchCache(query);
```

A common scenario for using a cache is an autocomplete or instant search when typing.

> When passing a number as a limit the cache automatically balance stored entries related to their popularity.

> When just using "true" the cache is unbounded and perform actually 2-3 times faster (because the balancer do not have to run).
