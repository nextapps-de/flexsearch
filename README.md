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

- IndexedDB (Browser)
- Redis 
- SQLite
- Postgres
- MongoDB
- Clickhouse

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
        <!--<th>Size</th>-->
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
        <!--<td align="right"><sub>Mb</sub></td>-->
        <td></td>
    </tr>
    <tr>
        <td align="left">Memory</td>
        <td align="right">11,267,299</td>
        <td align="right">21,273,578</td>
        <td align="right"></td>
        <td align="right">3,666,862</td>
        <td align="right">10,636,088</td>
        <td align="right">121,414,478</td>
        <!--<td align="right">3.1</td>-->
        <td align="right">No</td>
    </tr>
    <tr>
        <td align="left">Redis</td>
        <td align="right">1,463,878</td>
        <td align="right">106,210</td>
        <td align="right">1,535,598</td>
        <td align="right">121,915</td>
        <td align="right">119,418</td>
        <td align="right">2,419,564</td>
        <!--<td align="right"></td>-->
        <td align="right">Yes</td>
    </tr>
    <tr>
        <td align="left">Clickhouse</td>
        <td align="right">1,220,158</td>
        <td align="right">4,684</td>
        <td align="right"></td>
        <td align="right"></td>
        <td align="right"></td>
        <td align="right"></td>
        <!--<td align="right"></td>-->
        <td align="right">Yes</td>
    </tr>
    <tr>
        <td align="left">Sqlite</td>
        <td align="right">232,484</td>
        <td align="right">26,129</td>
        <td align="right">52,190</td>
        <td align="right">152,443</td>
        <td align="right">1,439,203</td>
        <td align="right">295,171</td>
        <!--<td align="right"></td>-->
        <td align="right">No</td>
    </tr>
    <tr>
        <td align="left">Postgres</td>
        <td align="right">343,097</td>
        <td align="right">23,706</td>
        <td align="right">133,729</td>
        <td align="right">308,259</td>
        <td align="right">3,783,992</td>
        <td align="right">156,588</td>
        <!--<td align="right"></td>-->
        <td align="right">Yes</td>
    </tr>
    <tr>
        <td align="left">MongoDB</td>
        <td align="right">501,242</td>
        <td align="right">18,269</td>
        <td align="right">13,745</td>
        <td align="right">237,323</td>
        <td align="right">482,317</td>
        <td align="right">67,133</td>
        <!--<td align="right"></td>-->
        <td align="right">Yes</td>
    </tr>
    <tr>
        <td align="left">IndexedDB</td>
        <td align="right">22,109</td>
        <td align="right">19,602</td>
        <td align="right"></td>
        <td align="right"></td>
        <td align="right"></td>
        <td align="right"></td>
        <!--<td align="right"></td>-->
        <td align="right">No</td>
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

The default maximum keystore limit for the In-Memory index is 2^24 of stored ids or terms/partials. An additional 64-Bit register could be enabled and is dividing the index into self-balanced partitions by using Proxy.

```js
const index = new FlexSearchIndex({
    // e.g. set keystore range to 16-Bit:
    // 2^16 * 2^24 = 2^40 keys total
    keystore: 16 
});
```

You can theoretically store up to 2^88 keys (64-Bit address range).

> Persistent storages has no keystore limit by default.

## Migration

- The index option property "minlength" has moved to the Encoder Class
- The index option flag "optimize" was removed
- The index option flag "lang" was replaced by the Encoder Class `.assign()`
- Boost cannot apply upfront anymore when indexing, instead you can use the boost property on a query dynamically
- All definitions of the old text encoding process was replaced by similar definitions (Array changed to Set, Object changed to Map). You can use of the helper methods like `.addMatcher(char_match, char_replace)` which adds everything properly (almost everything will pre-compiled anyway).