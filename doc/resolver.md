## Resolver (Complex Queries)

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
// raw1 has changed, raw2 is same, raw3 refers to raw1
// you can access the raw result by
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

## Resolver Tasks

<table>
    <tr></tr>
    <tr>
        <td>Method</td>
        <td>Description</td>
        <td>Return</td>
    </tr>
    <tr>
        <td>
            <code>.and(options,...)</code><br>
            <code>.or(options,...)</code><br>
            <code>.not(options,...)</code><br>
            <code>.xor(options,...)</code>
        </td>
        <td>Apply an operation</td>
        <td>Returns a <code>Resolver</code> when <code>resolve</code> was not set to <code>false</code> within the options, otherwise it returns the result (or promise in async context).</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <code>.limit(number)</code><br>
            <code>.offset(number)</code><br>
            <code>.boost(number)</code>
        </td>
        <td>Apply boost, limit and offset to the result</td>
        <td>Returns a <code>Resolver</code></td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <code>.resolve(options)</code>
        </td>
        <td>Resolve results</td>
        <td>Returns the final result or promise in async context (can't be executed twice)</td>
    </tr>
</table>


## Resolver Options

<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr></tr>
    <tr>
        <td colspan="4">Resolver Task Options:</td>
    </tr>
    <tr>
        <td><code>query</code></td>
        <td>
            String
        </td>
        <td>The search query</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>index</code></td>
        <td>
            <code>Index</code><br>
            <code>Document</code>
        </td>
        <td>Assign the index where the query should be applied to</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>suggest</code></td>
        <td>
            Boolean
        </td>
        <td>Enables <a href="../README.md#suggestions">suggestions</a> in results</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>boost</code></td>
        <td>
            Number
        </td>
        <td>Boost or reduce the score of this query</td>
        <td>0</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>async</code></td>
        <td>
            Boolean
        </td>
        <td>Use a <a href="#using-async-queries-incl-runtime-balancer">parallel processing workflow</a></td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>queue</code></td>
        <td>
            Boolean
        </td>
        <td>Use a <a href="#queuing-async-queries">queued processing workflow</a></td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <code>and</code><br>
            <code>or</code><br>
            <code>not</code><br>
            <code>xor</code><br>
        </td>
        <td>
            Array&lt;<a href="#resolver-options">ResolverOptions</a>&gt;
        </td>
        <td>Apply nested queries</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>resolve</code></td>
        <td>
            Boolean
        </td>
        <td>
            Resolve the result immediately or not. When set to <code>true</code> all final resolve options are also allowed and there can't exist any further resolver operations.
        </td>
        <td>false</td>
    </tr>
    <tr>
        <td colspan="4">Document Resolver Options:</td>
    </tr>
    <tr>
        <td><code>field</code><br><code>pluck</code></td>
        <td>
            String
        </td>
        <td>Select the Document field on which the query should apply to.</td>
        <td></td>
    </tr>
    <tr>
        <td colspan="4">Final Resolve Options:</td>
    </tr>
    <tr>
        <td><code>enrich</code></td>
        <td>
            Boolean
        </td>
        <td>Enrich IDs from the results with the corresponding documents (for Document Indexes only)</td>
        <td>true</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>highlight</code></td>
        <td>
            <a href="./result-highlighting.md#highlighting-options">Highlighting Options</a><br>
            String
        </td>
        <td>Highlight query matches in the result (for Document Indexes only)</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>limit</code></td>
        <td>
            Number
        </td>
        <td>Sets the limit of results</td>
        <td>100</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>offset</code></td>
        <td>
            Boolean
        </td>
        <td>Apply offset (skip items)</td>
        <td>0</td>
    </tr>
</table>

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

## Async Resolver

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

When you need to access the raw result `resolver.result` you should await for the task completion of all added resolver stages up to this point.

```js
const resolver = new Resolver({
    index: index,
    query: "a query",
    async: true
})
.and({ 
    query: "another query",
    async: true
});

// await for the task completion
await resolver.await;
// get the raw result
const raw = resolver.result;
// continue adding further tasks ...
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

### Compare Parallel VS. Consecutive

When using the parallel workflow by passing `{ async: true }`, all resolver stages will send their requests (including nested tasks) to the DB immediately and calculate the results in the right order as soon as the request resolves. When the overall workload of your applications has some free resources, a parallel request workflow improves performance compared to the consecutive counterpart. 

<br><img src="resolver-parallel.svg" style="width: 780px; max-width: 100%">

<h2></h2>

When using the consecutive workflow by passing `{ queue: true }`, all resolver stages will send their requests (including nested tasks) to the DB only when the previous request resolves. The advantage of this variant is when a stage becomes invalid because of the previous result, it can skip the request completely and continue with the next stage. This can reduce the overall workload.

<br><img src="resolver-consecutive.svg" style="width: 780px; max-width: 100%">

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
