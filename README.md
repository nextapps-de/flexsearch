# FlexSearch v0.8 (Preview)

## What's New

- Persistent indexes support for: IndexedDB (Browser), Redis, SQLite, Postgres, MongoDB, Clickhouse
- Enhanced language customization via the new Encoder class
- Searching single terms is up to 7 times faster
- Enhanced support for larger indexes or larger result sets
- Improved offset and limit processing achieve up to 100 times faster traversal performance through large datasets
- Support for larger In-Memory index with extended key size (the defaults maximum keystore limit is: 2^24)
- Greatly enhanced performance of the whole text encoding pipeline
- Improved indexing of numeric content (Triplets)
- Immediate result sets and resolver
- Basic Resolver: Collapse, And, Or, Output formatter
- Improved charset collection
- New charset preset "extreme" which further reduces memory consumption
- Performance gain when polling tasks to the index by using "Event-Loop-Caches"
- Up to 100 times faster deletion/replacement when not using the additional "fastupdate" register
- Regex Pre-Compilation (transforms hundreds of regex rules into just a few)

## Persistent Indexes

FlexSearch provides a new Storage Adapter where indexes are delegated through persistent storages.

Supported:

- [IndexedDB (Browser)](db/indexeddb/README.md)
- [Redis](db/redis/README.md)
- [SQLite](db/sqlite/README.md)
- [Postgres](db/postgres/README.md)
- [MongoDB](db/mongo/README.md)
- [Clickhouse](db/clickhouse/README.md)

The `.export()` and `.import()` methods are still available for non-persistent In-Memory indexes.

All search capabilities are available on persistent indexes like:
- Context-Search
- Suggestions
- Cursor-based Queries (Limit/Offset)
- Scoring (supports a resolution of up to 32767 slots)
- Document-Search
- Partial Search
- Boost Fields
- Resolver
- Document Store
- Worker Threads to run in parallel
- Auto-Balanced Cache (top queries, last queries)

All persistent variants are optimized for larger sized indexes under heavy workload. Almost every task will be streamlined to run in batch/parallel, getting the most out of the selected database engine. Whereas the InMemory index can't share their data between different nodes when running in a cluster, every persistent storage can handle this by default.

### Example

```js
import FlexSearchIndex from "./index.js";
import Database from "./db/indexeddb/index.js";
// create an index
const index = new FlexSearchIndex();
// create db instance with optional prefix
const db = new Database("my-store");
// mount and await before transfering data
await flexsearch.mount(db);

// update the index as usual
index.add(1, "content...");
index.update(2, "content...");
index.remove(3);

// changes are automatically committed by default
// when you need to wait for the task completion, then you
// can use the commit method explicitely:
await index.commit();
```

Alternatively mount a store by index creation:

```js
const index = new FlexSearchIndex({
    db: new Storage("my-store")
});

// await for the db response before access the first time
await index.db;
// apply changes to the index
// ...
```

Query against a persistent storage just as usual:

```js
const result = await index.search("gulliver");
```

Auto-Commit is enabled by default and will process changes asynchronously in batch.
You can fully disable the auto-commit feature and perform them manually:

```js
const index = new FlexSearchIndex({
    db: new Storage("my-store"),
    commit: false
});
// update the index
index.add(1, "content...");
index.update(2, "content...");
index.remove(3);

// transfer all changes to the db
await index.commit();
```

You can call the commit method manually also when `commit: true` option was set.

### Benchmark

The performance really depends on text size/length, so the benchmark was measured in "terms per second". To make the best pick you should evaluate scaling capabilities and also if replace/remove is needed.

<table>
    <tr>
        <th align="left">Store</th>
        <th>Add</th>
        <th>Search 1</th>
        <th>Search N</th>
        <th>Replace</th>
        <th>Remove</th>
        <th>Not Found</th>
        <th>Scaling</th>
    </tr>
    <tr>
        <td></td>
        <td align="right"><sub>terms per sec</sub></td>
        <td align="right"><sub>terms per sec</sub></td>
        <td align="right"><sub>terms per sec</sub></td>
        <td align="right"><sub>terms per sec</sub></td>
        <td align="right"><sub>terms per sec</sub></td>
        <td align="right"><sub>terms per sec</sub></td>
        <td></td>
    </tr>
    <tr>
        <td align="left">Memory</td>
        <td align="right">16,647,301</td>
        <td align="right">10,892,933</td>
        <td align="right">11,767,590</td>
        <td align="right">19,099,981</td>
        <td align="right">80,675,387</td>
        <td align="right">143,369,175</td>
        <td align="right">No</td>
    </tr>
   <tr>
        <td align="left">IndexedDB</td>
        <td align="right">123,298</td>
        <td align="right">126,666</td>
        <td align="right">62,370</td>
        <td align="right">50,599</td>
        <td align="right">151,201</td>
        <td align="right">430,322</td>
        <td align="right">No</td>
    </tr>
    <tr>
        <td align="left">Redis</td>
        <td align="right">1,574,878</td>
        <td align="right">106,210</td>
        <td align="right">690,143</td>
        <td align="right">117,013</td>
        <td align="right">129,595</td>
        <td align="right">656,157</td>
        <td align="right">Yes</td>
    </tr>
    <tr>
        <td align="left">Sqlite</td>
        <td align="right">252,328</td>
        <td align="right">35,184</td>
        <td align="right">138,487</td>
        <td align="right">193,342</td>
        <td align="right">1,751,232</td>
        <td align="right">141,939</td>
        <td align="right">No</td>
    </tr>
    <tr>
        <td align="left">Postgres</td>
        <td align="right">354,894</td>
        <td align="right">24,329</td>
        <td align="right">76,189</td>
        <td align="right">324,546</td>
        <td align="right">3,702,647</td>
        <td align="right">50,305</td>
        <td align="right">Yes</td>
    </tr>
    <tr>
        <td align="left">MongoDB</td>
        <td align="right">515,938</td>
        <td align="right">19,684</td>
        <td align="right">81,558</td>
        <td align="right">243,353</td>
        <td align="right">485,192</td>
        <td align="right">67,751</td>
        <td align="right">Yes</td>
    </tr>
    <tr>
        <td align="left">Clickhouse</td>
        <td align="right">1,436,992</td>
        <td align="right">11,507</td>
        <td align="right">22,196</td>
        <td align="right">931,026</td>
        <td align="right">3,276,847</td>
        <td align="right">16,644</td>
        <td align="right">Yes</td>
    </tr>
</table>

__Search 1:__ single term query<br>
__Search N:__ multi term query (this often performs better because of the intersection is shrinking the final result, especially when using Context-Search)

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
        ["xvi", "16"]
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

Add custom transformations to an existing index:

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
    data: { /* the data item */ },
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

## Big In-Memory Keystores

The default maximum keystore limit for the In-Memory index is 2^24 of distinct terms/partials being stored. An additional register could be enabled and is dividing the index into self-balanced partitions.

```js
const index = new FlexSearchIndex({
    // e.g. set keystore range to 8-Bit:
    // 2^8 * 2^24 = 2^32 keys total
    keystore: 8 
});
```

You can theoretically store up to 2^88 keys (64-Bit address range).

The internal ID arrays scales automatically when limit of 2^31 has reached by using Proxy.

> Persistent storages has no keystore limit by default. You should not enable keystore when using persistent indexes, as long as you do not stress the buffer too hard before calling `index.commit()`.

## Migration

- The index option property "minlength" has moved to the Encoder Class
- The index option flag "optimize" was removed
- The index option flag "lang" was replaced by the Encoder Class `.assign()`
- Boost cannot apply upfront anymore when indexing, instead you can use the boost property on a query dynamically
- All definitions of the old text encoding process was replaced by similar definitions (Array changed to Set, Object changed to Map). You can use of the helper methods like `.addMatcher(char_match, char_replace)` which adds everything properly (almost everything will pre-compiled anyway).