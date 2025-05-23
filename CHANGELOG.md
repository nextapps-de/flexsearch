# Changelog

### Current Version

- Calling `index.clear()` on a persistent Index does not stack to the task queue by default (which executes on commit), instead it will execute immediately and return a Promise
- Added new tokenizer `tolerant`, inherits from `strict` but also matches simple typos like missing letters and swapped letters
- Improved Redis Cleanup
- Resolver: Support Result Highlighting

### v0.8.2

- Config-Serialized Query Caches, Improved caching strategy for Document indexes and Resolver
- Resolver Async Processing Workflow (including Queuing)
- Extended Resolver Support: Worker, Persistent, Cache
- Extended Result Highlighting: Boundaries, Ellipsis, Alignment
- Improved TypeScript Typings
- Improved Stemmer Handling
- Improved Result Highlighting
- Use multi-language charset normalization as the default `Encoder`
- Simplified charset support for multi-language content
- Charset renamed `LatinExact` => `Exact`, `LatinDefault` => `Default` and `LatinSimple` => `Normalize`, these are universal charset presets for any languages
- Charset `ArabicDefault` and `CyrillicDefault` was removed, they are fully covered by the default universal charset presets
- Charset `Charset.CjkDefault` was renamed to `Charset.CJK`

### v0.8.1

- Resolver Support for Documents
- Asynchronous Runtime Balancer, new option `priority`
- Export/Import Worker Indexes + Document Worker, new extern config options `export` and `import`
- Improved interoperability of the different build packages, including source folder
- Support custom `filter` function for encoder (stop-word filter)

### v0.8.0

- Persistent indexes support for: `IndexedDB` (Browser), `Redis`, `SQLite`, `Postgres`, `MongoDB`, `Clickhouse`
- Enhanced language customization via the new `Encoder` class
- Result Highlighting
- Query performance achieve results up to 4.5 times faster compared to the previous generation v0.7.x by also improving the quality of results
- Enhanced support for larger indexes or larger result sets
- Improved offset and limit processing achieve up to 100 times faster traversal performance through large datasets
- Support for larger In-Memory index with extended key size (the defaults maximum keystore limit is: 2^24)
- Greatly enhanced performance of the whole text encoding pipeline
- Improved indexing of numeric content (Triplets)
- Intermediate result sets and `Resolver`
- Basic Resolver: `and`, `or`, `xor`, `not`, `limit`, `offset`, `boost`, `resolve`
- Improved charset collection
- New charset preset `soundex` which further reduces memory consumption by also increasing "fuzziness"
- Performance gain when polling tasks to the index by using "Event-Loop-Caches"
- Up to 100 times faster deletion/replacement when not using the additional "fastupdate" register
- Regex Pre-Compilation (transforms hundreds of regex rules into just a few)
- Extended support for multiple tags (DocumentIndex)
- Custom Fields ("Virtual Fields")
- Custom Filter
- Custom Score Function
- Added French language preset (stop-word filter, stemmer)
- Enhanced Worker Support
- Export / Import index in chunks
- Improved Build System + Bundler (Supported: CommonJS, ESM, Global Namespace), also the import of language packs are now supported for Node.js
- Full covering index.d.ts type definitions
- Fast-Boot Serialization optimized for Server-Side-Rendering (PHP, Python, Ruby, Rust, Java, Go, Node.js, ...)

### v0.7.0

- Bidirectional Context (the order of words can now vary, does not increase memory when using bidirectional context)
- New memory-friendly strategy for indexes (switchable, saves up to 50% of memory for each index, slightly decrease performance)
- Better scoring calculation (one of the biggest concerns of the old implementation was that the order of arrays processed in the intersection has affected the order of relevance in the final result)
- Fix resolution (the resolution in the old implementation was not fully stretched through the whole range in some cases)
- Skip words (optionally, automatically skip words from the context chain which are too short)
- Hugely improves performance of long queries (up to 450x faster!) and also memory allocation (up to 250x less memory)
- New fast-update strategy (optionally, hugely improves performance of all updates and removals of indexed contents up to 2850x)
- Improved auto-balanced cache (keep and expire cache by popularity)
- Append contents to already existing entries (already indexed documents or contents)
- New method "contain" to check if an ID was already indexed
- Access documents directly from internal store (read/write)
- Suggestions are hugely improved, falls back from context search all the way down to single term match
- Document descriptor has now array support (optionally adds array entries via the new `append` under the hood to provide a unique relevance context for each entry)
- Document storage handler gets improved
- Results from document index now grouped by field (this is one of the few bigger breaking changes which needs migrations of your old code)
- Boolean search has a new concept (use in combination of the new result structure)
- Node.js Worker Threads
- Improved default latin encoders
- New parallelization model and workload distribution
- Improved Export/Import
- Tag Search
- Offset pagination
- Enhanced Field Search
- Improved sorting by relevance (score)
- Added Context Scoring (context index has its own resolution)
- Enhanced charset normalization
- Improved bundler (support for inline WebWorker)

These features have been removed:

- Where-Clause
- Index Information `index.info()`
- Paging Cursor (was replaced by `offset`)

#### Migration Quick Overview

> The "async" options was removed, instead you can call each method in its async version, e.g. `index.addAsync` or `index.searchAsync`.

> Define document fields as object keys is not longer supported due to the unification of all option payloads.

A full configuration example for a context-based index:

```js
var index = new Index({
    tokenize: "strict",
    resolution: 9,
    minlength: 3,
    optimize: true,
    fastupdate: true,
    cache: 100,
    context: {
        depth: 1,
        resolution: 3,
        bidirectional: true
    }
});
```

The `resolution` could be set also for the contextual index.

A full configuration example for a document based index:

```js
const index = new Document({
    tokenize: "forward",
    optimize: true,
    resolution: 9,
    cache: 100,
    worker: true,
    document: {
        id: "id",
        tag: "tag",
        store: [
            "title", "content"
        ],
        index: [{
            field: "title",
            tokenize: "forward",
            optimize: true,
            resolution: 9
        },{
            field:  "content",
            tokenize: "strict",
            optimize: true,
            resolution: 9,
            minlength: 3,
            context: {
                depth: 1,
                resolution: 3
            }
        }]
    }
});
```

A full configuration example for a document search:

```js
index.search({
    enrich: true,
    bool: "and",
    tag: ["cat", "dog"],
    index: [{
        field: "title",
        query: "some query",
        limit: 100,
        suggest: true
    },{
        field: "content",
        query: "same or other query",
        limit: 100,
        suggest: true
    }]
});
```

#### Where Clause Replacement

Old Syntax:

```js
const result = index.where({
    cat: "comedy",
    year: "2018"
});
```

Equivalent Syntax (0.7.x):

```js
const data = Object.values(index.store);
```

The line above retrieves data from the document store (just useful when not already available in your runtime).

```js
const result = data.filter(function(item){ 
    return item.cat === "comedy" && item.year === "2018";
});
```

Also considering using the <a href="https://github.com/nextapps-de/flexsearch#tags">Tag-Search</a> feature, which partially replaces the Where-Clause with a huge performance boost.

### v0.6.0

- Pagination

### v0.5.3

- Logical Operator

### v0.5.2

- Intersect Partial Results

### v0.5.1

- Customizable Scoring Resolution

### v0.5.0

- Where / Find Documents
- Document Tags
- Custom Sort

### v0.4.0

- Index Documents (Field-Search)

### v0.3.6

- Right-To-Left Support
- CJK Word Splitting Support

### v0.3.5

- Promise Support

### v0.3.4

- Export / Import Indexes (Serialize)

### v0.3.0

- Profiler Support
