# FlexSearch v0.8 (Preview)

## Persistent Indexes

FlexSearch provides a new Storage Adapter where indexes are delegated through persistent storages.

Supported:

- IndexedDB (Browser)
- SQLite
- Postgres
- Clickhouse
- Redis

The `.export()` and `.import()` methods are still available for non-persistent In-Memory indexes.

### Example

```js
import FlexSearchIndex from "./index.js";
import Storage from "./storage/idxdb.js";
const index = new FlexSearchIndex();
// create instance with optional store prefix
const store = new Storage("my-store");
// mount and await before transfering data
await store.mount(flexsearch)

// update the index as usual
index.add(1, "content...");
index.append(2, "content...");
index.update(3, "content...");
index.remove(4);
// ....

// transfer all changes to the storage
await store.commit();
```

Alternatively:

```js
const index = new FlexSearchIndex({
    store: new Storage("my-store")
});
// apply changes to the index
// ...
// await for the storage response before access the first time
await index.store;
// transfer all changes to the storage
await index.store.commit();
```

Query against a persistent storage just as usual:

```js
const result = await index.search("gulliver");
```

## Encoder

Search capabilities highly depends on language processing. The old workflow wasn't really practicable. The new Encoder class is a huge improvement and fully replaces the encoding part. Some FlexSearch options was moved to the new `Encoder` instance.

New Encoding Pipeline:
1. charset normalization
2. custom preparation
3. split into terms (apply includes/excludes)
4. filter (pre-filter)
5. matcher (substitute terms)
6. stemmer (substitute term endings)
7. filter (post-filter)
8. custom regex (replacer)
9. replace chars (mapper)
10. letter deduplication
11. apply compression

### Example

```js
const encoder = new Encoder({
    normalize: true,
    dedupe: true,
    cache: true,
    include: {
        letter: true,
        number: true,
        symbol: false,
        punctuation: false,
        control: false,
        char: "@"
    }
});
```

```js
const encoder = new Encoder({
    normalize: function(str){
        return str.toLowerCase();
    },
    prepare: function(str){
        return str.replace(/&/g, " and ");
    },
    exclude: {
        letter: false,
        number: false,
        symbol: true,
        punctuation: true,
        control: true
    }
});
```

Define language specific transformations:

```js
const encoder = new Encoder({
    replacer: [
        /[´`’ʼ]/g, "'"
    ],
    filter: new Set([
        "and",
    ]),
    matcher: new Map([
        ["XV", "15"]
    ]),
    stemmer: new Map([
        ["ly", ""]
    ]),
    mapper: new Map([
        ["é", "e"]
    ])
});
```

Or use predefined language and add custom options:

```js
import EnglishBookPreset from "./lang/en.js";
const encoder = new Encoder({
    preset: EnglishBookPreset,
    filter: false
});
```

Assign extensions to the encoder instance:

```js
import LatinEncoder from "./lang/latin/simple.js";
import EnglishBookPreset from "./lang/en.js";
// stack definitions to the encoder instance
LatinEncoder.assign(EnglishBookPreset);
// assign further presets ...
```

Add transformations to an existing index:

```js
import LatinEncoder from "./lang/latin/default.js";
LatinEncoder.addReplacer(/[´`’ʼ]/g, "'");
LatinEncoder.addFilter("and");
LatinEncoder.addMatcher("xvi", "16");
LatinEncoder.addStemmer("ly", "");
LatinEncoder.addMapper("é", "e");
```

## Resolver

Retrieve an unresolved result:

```js
const raw = index.search("a short query", { 
    resolve: false
});
```

Example of intermediate raw result set:

```js
[{
    field: "...",
    query: "a short query",
    matches: ["a", "query"],
    result: [
        [ /* ids */ ],
        [ /* ids */ ],
        // ...
    ],
    suggest: [
        [ /* ids */ ],
        [ /* ids */ ],
        // ...
    ]
}]
```

You can apply different resolver to the raw result.

The default resolver:
```js
import collapse from "./resolve/collapse.js";
const raw = index.search("a short query", { 
    resolve: false
});
const result = collapse(raw);
```

### Chainable Boolean Operations
```js
import and from "./resolve/and.js";
import collapse from "./resolve/collapse.js";
const raw1 = index.search("a short query", { 
    resolve: false
});
const raw2 = index.search("another query", {
    resolve: false,
    boost: 2
});
// apply boolean operations
const raw3 = and(raw1, raw2, /* ... */);
// resolve result
const result = collapse(raw3);
```

Run at parallel (e.g. when using WorkerIndex):

```js
import and from "./resolve/and.js";
import or from "./resolve/or.js";
import collapse from "./resolve/collapse.js";
// apply boolean operations (execute all)
const result = collapse(
    or( // union
        and( // intersection
            index.search("a short query", {
                resolve: false
            }),
            index.search("another query", {
                resolve: false,
                boost: 2
            })
        ),
        index.search("further query", {
            resolve: false,
            boost: 2
        })
    )
);
```

Lazy injection (recommended for most usage):

```js
import and from "./resolve/and.js"; 
import or from "./resolve/or.js"; 
import collapse from "./resolve/collapse.js";
// define boolean operations (execute continually)
const result = collapse(
    or( // union
        and({ // intersection
            index: index,
            query: "a short query",
        },{
            index: index,
            query: "another query",
            boost: 2
        }),
        {
            index: index,
            query: "further query",
            boost: 2
        }
    )
);
```

### Custom Result Decoration

```js
import highlight from "./resolve/highlight.js";
import collapse from "./resolve/collapse.js";
const raw = index.search("a short query", { 
    resolve: false
});
// resolve result for display
const html = highlight(raw, {
    wrapper: "<ul>$1</ul>",
    item: "<li>$1</li>",
    text: "$1",
    highlight: "<b>$1</b>"
});
// resolve result for further processing
const result = collapse(raw);
```

Alternatively:

```js
const html = highlight(raw, {
    wrapper: function(content){
        const wrapper = document.createElement("ul");
        return wrapper;
    },
    item: function(content, wrapper){
        const item = document.createElement("li");
        wrapper.append(item);
    },
    text: function(content, item){
        const node = document.createTextNode(content);
        item.append(node);
    },
    highlight: function(content, item){
        const node = document.createElement("b");
        node.textContent = content;
        item.append(node);
    }
});
```

### Custom Resolver

```js
function resolver(raw){
    // console.log(raw)
    // generate output ...
    return raw;
}

const result = index.search("a short query", { 
    resolve: resolver
});
```

## Index Compression

... follow soon