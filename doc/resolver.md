## Resolver

Retrieve an unresolved result:

```js
const raw = index.search("a short query", { 
    resolve: false
});
```

You can apply and chain different resolver methods to the raw result, e.g.:

```js
raw.and( ... )
   .and( ... )
   .boost(2)
   .or( ... ,  ... )
   .limit(100)
   .xor( ... )
   .not( ... )
   // final resolve
   .resolve({
       limit: 10,
       offset: 0,
       enrich: true
   });
```

The default resolver:

```js
const raw = index.search("a short query", { 
    resolve: false
});
const result = raw.resolve();
```

Alternatively you can create a `Resolver` by passing an initial query:

```js
import { Resolver } from "flexsearch";
const raw = new Resolver({
    // pass the index is required when query was set
    index: index,
    query: "a short query"
});
const result = raw.resolve();
```

### Chainable Boolean Operations

The basic concept explained:

```js
// 1. get one or multiple unresolved results
const raw1 = index.search("a short query", { 
    resolve: false
});
const raw2 = index.search("another query", {
    resolve: false,
    boost: 2
});

// 2. apply and chain resolver operations
const raw3 = raw1.and(raw2, /* ... */);
// you can access the aggregated result by raw3.result
console.log("The aggregated result is:", raw3.result)
// apply further operations ...

// 3. resolve final result
const result = raw3.resolve({
    limit: 100,
    offset: 0
});
console.log("The final result is:", result)
```

Chain operations and nest inline queries:

```js
const result = index.search("further query", {
    // set resolve to false on the first query
    resolve: false,
    // boost the first query
    boost: 2
})
.or({
    // nested expression
    and: [{
        query: "a query"
    },{
        query: "another query"
    }]
})
.not({
    query: "some query"
})
// resolve the result
.resolve({
    limit: 100,
    offset: 0
});
```

Alternatively you can create a `Resolver` by passing an initial query:

```js
import { Resolver } from "flexsearch";
const result = new Resolver({
    // pass the index is required when query was set
    index: index,
    query: "further query",
    boost: 2
})
.or({
    and: [{
        query: "a query"
    },{
        // you can bind a different index for this
        // query when IDs are from same source
        index: index,
        query: "another query"
    }]
})
.not({
    index: index,
    query: "some query"
})
.resolve({
    limit: 100,
    offset: 0
});
```

When all queries are made against the same index, you can skip the index in every resolver stage followed after initially calling `new Resolve({ index: ... })`:

```js
import { Resolver } from "flexsearch";
const result = new Resolver({
    index: index,
    query: "a query"
})
.and({ query: "another query" })
.or ({ query: "further query", boost: 2 })
.not({ query: "some query" })
.resolve(100);
```

### Using Cached Queries

```js
import { Resolver } from "flexsearch";
const result = new Resolver({
    index: index,
    query: "a query",
    cache: true
})
.and({ 
    query: "another query",
    cache: true
})
.resolve(100);
```

### Using Async Queries (incl. Runtime Balancer)

All async tasks will run in parallel, balanced by the runtime observer:

```js
import { Resolver } from "flexsearch";
const resolver = new Resolver({
    index: index,
    query: "a query",
    async: true
})
.and({ 
    query: "another query",
    async: true
})
.or({
    query: "some query",
    async: true
});
const result = await resolver.resolve(100);
```

### Queuing Async Queries

All queued tasks will run consecutively, also balanced by the runtime observer:

```js
import { Resolver } from "flexsearch";
const resolver = await new Resolver({
    index: index,
    query: "a query",
    async: true
})
.and({ 
    query: "another query",
    queue: true
})
.or({
    query: "some query",
    queue: true
})
.resolve(100);
```

When tasks are processed consecutively, it will skip specific resolver stages when there is no result expected.

<!--
### Custom Resolver

```js
function CustomResolver(raw){
    // console.log(raw)
    let output;
    // generate output ...
    return output;
}

const result = index.search("a short query", { 
    resolve: CustomResolver
});
```
-->
