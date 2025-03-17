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

Or use declaration style:

```js
import Resolver from "./resolver.js";
const raw = new Resolver({ 
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

Use inline queries:

```js
const result = index.search("further query", {
    // set resolve to false on the first query
    resolve: false,
    boost: 2
})
.or( // union
    index.search("a query")
    .and( // intersection
        index.search("another query", {
            boost: 2
        })
    )
)
.not( // exclusion
    index.search("some query")
)
// resolve the result
.resolve({
    limit: 100,
    offset: 0
});
```

```js
import Resolver from "./resolver.js";
const result = new Resolver({
    index: index,
    query: "further query",
    boost: 2
})
.or({
    and: [{ // inner expression
        index: index,
        query: "a query"
    },{
        index: index,
        query: "another query",
        boost: 2
    }]
})
.not({ // exclusion
    index: index,
    query: "some query"
})
.resolve({
    limit: 100,
    offset: 0
});
```

When all queries are made against the same index, you can skip the index in every declaration followed after initially calling `new Resolve()`:

```js
import Resolver from "./resolver.js";
const result = new Resolver({
    index: index,
    query: "a query"
})
.and({ query: "another query", boost: 2 })
.or ({ query: "further query", boost: 2 })
.not({ query: "some query" })
.resolve(100);
```

<!--
### Custom Result Decoration

```js
import highlight from "./resolve/highlight.js";
import collapse from "./resolve/collapse.js";
const raw = index.search("a short query", { 
    resolve: false
});
// resolve result for display
const template = highlight(raw, {
    wrapper: "<ul>$1</ul>",
    item: "<li>$1</li>",
    text: "$1",
    highlight: "<b>$1</b>"
});
document.body.appendChild(template);
// resolve result for further processing
const result = collapse(raw);
```

Alternatively:

```js
const template = highlight(raw, {
    wrapper: function(){
        const wrapper = document.createElement("ul");
        return wrapper;
    },
    item: function(wrapper){
        const item = document.createElement("li");
        wrapper.append(item);
    },
    text: function(item, content){
        const node = document.createTextNode(content);
        item.append(node);
    },
    highlight: function(item, content){
        const node = document.createElement("b");
        node.textContent = content;
        item.append(node);
    }
});
document.body.appendChild(template);
```
-->

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
