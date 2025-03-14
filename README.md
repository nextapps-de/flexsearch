# FlexSearch v0.8 (Preview)

```bash
npm install git+https://github.com/nextapps-de/flexsearch/tree/v0.8-preview
```

## What's New

- Persistent indexes support for: `IndexedDB` (Browser), `Redis`, `SQLite`, `Postgres`, `MongoDB`, `Clickhouse`
- Enhanced language customization via the new `Encoder` class
- Query performance achieve results up to 4.5 times faster compared to the previous generation v0.7.x by also improving the quality of results
- Enhanced support for larger indexes or larger result sets
- Improved offset and limit processing achieve up to 100 times faster traversal performance through large datasets
- Support for larger In-Memory index with extended key size (the defaults maximum keystore limit is: 2^24)
- Greatly enhanced performance of the whole text encoding pipeline
- Improved indexing of numeric content (Triplets)
- Intermediate result sets and `Resolver`
- Basic Resolver: `and`, `or`, `xor`, `not`, `limit`, `offset`, `enrich`, `resolve`, Output formatter
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
- Improved Build System + Bundler (Supported: CommonJS, ESM, Global Namespace), also the import of language packs are now supported for Node.js
- Full covering index.d.ts type definitions
- Fast-Boot Serialization optimized for Server-Side-Rendering (PHP, Python, Ruby, Rust, Java, Go, Node.js, ...)

Compare Benchmark: [0.7.0](https://nextapps-de.github.io/flexsearch/test/flexsearch-0.7.0/) vs. [0.8.0](https://nextapps-de.github.io/flexsearch/test/flexsearch-0.8.0/)

## Persistent Indexes

FlexSearch provides a new Storage Adapter where indexes are delegated through persistent storages.

Supported:

- [IndexedDB (Browser)](src/db/indexeddb/)
- [Redis](src/db/redis/)
- [SQLite](src/db/sqlite/)
- [Postgres](src/db/postgres/)
- [MongoDB](src/db/mongodb/)
- [Clickhouse](src/db/clickhouse/)

The `.export()` and `.import()` methods are still available for non-persistent In-Memory indexes.

<<<<<<< HEAD
When it comes to raw search speed <a href="https://nextapps-de.github.io/flexsearch/" target="_blank">FlexSearch outperforms every single searching library out there</a> and also provides flexible search capabilities like multi-field search, phonetic transformations or partial matching. 
=======
All search capabilities are available on persistent indexes like:
- Context-Search
- Suggestions
- Cursor-based Queries (Limit/Offset)
- Scoring (supports a resolution of up to 32767 slots)
- Document-Search
- Partial Search
- Multi-Tag-Search
- Boost Fields
- Custom Encoder
- Resolver
- Tokenizer (Strict, Forward, Reverse, Full)
- Document Store (incl. enrich results) 
- Worker Threads to run in parallel
- Auto-Balanced Cache (top queries + last queries)
>>>>>>> 7755e7d (bundle pre-release)

All persistent variants are optimized for larger sized indexes under heavy workload. Almost every task will be streamlined to run in batch/parallel, getting the most out of the selected database engine. Whereas the InMemory index can't share their data between different nodes when running in a cluster, every persistent storage can handle this by default.

### Examples Node.js

- [nodejs-commonjs](example/nodejs-commonjs):
  - [basic](example/nodejs-commonjs/basic)
  - [basic-suggestion](example/nodejs-commonjs/basic-suggestion)
  - [basic-persistent](example/nodejs-commonjs/basic-persistent)
  - [basic-resolver](example/nodejs-commonjs/basic-resolver)
  - [basic-worker](example/nodejs-commonjs/basic-worker)
  - [basic-worker-extern-config](example/nodejs-commonjs/basic-worker-extern-config)
  - [document](example/nodejs-commonjs/document)
  - [document-persistent](example/nodejs-commonjs/document-persistent)
  - [document-worker](example/nodejs-commonjs/document-worker)
  - [document-worker-extern-config](example/nodejs-commonjs/document-worker-extern-config)
  - [language-pack](example/nodejs-commonjs/language-pack)
- [nodejs-esm](example/nodejs-esm):
  - [basic](example/nodejs-esm/basic)
  - [basic-suggestion](example/nodejs-esm/basic-suggestion)
  - [basic-persistent](example/nodejs-esm/basic-persistent)
  - [basic-resolver](example/nodejs-esm/basic-resolver)
  - [basic-worker](example/nodejs-esm/basic-worker)
  - [basic-worker-extern-config](example/nodejs-esm/basic-worker-extern-config)
  - [document](example/nodejs-esm/document)
  - [document-persistent](example/nodejs-esm/document-persistent)
  - [document-worker](example/nodejs-esm/document-worker)
  - [document-worker-extern-config](example/nodejs-esm/document-worker-extern-config)
  - [language-pack](example/nodejs-esm/language-pack)

### Examples Browser

- [browser-legacy](example/browser-legacy):
  - [basic](example/browser-legacy/basic)
  - [basic-suggestion](example/browser-legacy/basic-suggestion)
  - [basic-persistent](example/browser-legacy/basic-persistent)
  - [basic-resolver](example/browser-legacy/basic-resolver)
  - [basic-worker](example/browser-legacy/basic-worker)
  - [document](example/browser-legacy/document)
  - [document-persistent](example/browser-legacy/document-persistent)
  - [document-worker](example/browser-legacy/document-worker)
  - [language-pack](example/browser-legacy/language-pack)
- [browser-module](example/browser-module):
  - [basic](example/browser-module/basic)
  - [basic-suggestion](example/browser-module/basic-suggestion)
  - [basic-persistent](example/browser-module/basic-persistent)
  - [basic-resolver](example/browser-module/basic-resolver)
  - [basic-worker](example/browser-module/basic-worker)
  - [basic-worker-extern-config](example/browser-module/basic-worker-extern-config)
  - [document](example/browser-module/document)
  - [document-persistent](example/browser-module/document-persistent)
  - [document-worker](example/browser-module/document-worker)
  - [document-worker-extern-config](example/browser-module/document-worker-extern-config)
  - [language-pack](example/browser-module/language-pack)

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

The benchmark was measured in "terms per second".

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
    <!--
    <tr>
        <td align="left">Memory</td>
        <td align="right">28,345,405</td>
        <td align="right">65,180,102</td>
        <td align="right">12,098,298</td>
        <td align="right">19,099,981</td>
        <td align="right">36,164,827</td>
        <td align="right">143,369,175</td>
        <td align="right">No</td>
    </tr>
    -->
    <tr>
        <td align="left">IndexedDB</td>
        <td align="right">123,298</td>
        <td align="right">83,823</td>
        <td align="right">62,370</td>
        <td align="right">57,410</td>
        <td align="right">171,053</td>
        <td align="right">425,744</td>
        <td align="right">No</td>
    </tr>
    <tr>
        <td align="left">Redis</td>
        <td align="right">1,566,091</td>
        <td align="right">201,534</td>
        <td align="right">859,463</td>
        <td align="right">117,013</td>
        <td align="right">129,595</td>
        <td align="right">875,526</td>
        <td align="right">Yes</td>
    </tr>
    <tr>
        <td align="left">Sqlite</td>
        <td align="right">269,812</td>
        <td align="right">29,627</td>
        <td align="right">129,735</td>
        <td align="right">174,445</td>
        <td align="right">1,406,553</td>
        <td align="right">122,566</td>
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

__Search 1:__ Single term query<br>
__Search N:__ Multi term query (Context-Search)

The benchmark was executed against a single client.

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
8. replace chars (mapper)
9. custom regex (replacer)
10. letter deduplication
11. apply finalize

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

You can use an `include` __instead__ of an `exclude` definition:

```js
const encoder = new Encoder({
    exclude: {
        letter: false,
        number: false,
        symbol: true,
        punctuation: true,
        control: true
    }
});
```

Instead of using `include` or `exclude` you can pass a regular expression to the field `split`:

```js
const encoder = new Encoder({
    split: /\s+/
});
```

> The definitions `include` and `exclude` is a replacement for `split`. You can just define one of those 3.

Adding custom functions to the encoder pipeline:

```js
const encoder = new Encoder({
    normalize: function(str){
        return str.toLowerCase();
    },
    prepare: function(str){
        return str.replace(/&/g, " and ");
    },
    finalize: function(arr){
        return arr.filter(term => term.length > 2);
    }
});
```

Assign encoder to an index:

```js
const index = new Index({ 
    encoder: encoder
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

Or use predefined language and extend it with custom options:

```js
import EnglishBookPreset from "./lang/en.js";
const encoder = new Encoder(EnglishBookPreset, {
    filter: false
});
```

Equivalent:

```js
import EnglishBookPreset from "./lang/en.js";
const encoder = new Encoder(EnglishBookPreset);
encoder.assign({ filter: false });
```

Assign extensions to the encoder instance:

```js
import LatinEncoderPreset from "./charset/latin/simple.js";
import EnglishBookPreset from "./lang/en.js";
// stack definitions to the encoder instance
const encoder = new Encoder()
    .assign(LatinEncoderPreset)
    .assign(EnglishBookPreset)
// override preset options ...
    .assign({ minlength: 3 });
// assign further presets ...
```

> When adding extension to the encoder every previously assigned configuration is still intact, very much like Mixins, also when assigning custom functions.

Add custom transformations to an existing index:

```js
import LatinEncoderPreset from "./charset/latin/default.js";
const encoder = new Encoder(LatinEncoderPreset);
encoder.addReplacer(/[´`’ʼ]/g, "'");
encoder.addFilter("and");
encoder.addMatcher("xvi", "16");
encoder.addStemmer("ly", "");
encoder.addMapper("é", "e");
```

Shortcut for just assigning one encoder configuration to an index:

```js
import LatinEncoderPreset from "./charset/latin/default.js";
const index = new Index({ 
    encoder: LatinEncoderPreset
});
```

## Resolver

Retrieve an unresolved result:

```js
const raw = index.search("a short query", { 
    resolve: false
});
```

<<<<<<< HEAD
<!--
Example of an intermediate raw result set:

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
-->

<<<<<<< HEAD
Library Comparison "Gulliver's Travels":
- <a href="https://nextapps-de.github.io/flexsearch/" target="_blank">Performance Benchmark</a>
- <a href="https://nextapps-de.github.io/flexsearch/match.html" target="_blank">Scoring Benchmark</a>
- <a href="#consumption">Memory Consumption</a>

Plugins (extern projects):
- React: https://github.com/angeloashmore/react-use-flexsearch
- Vue: https://github.com/Noction/vue-use-flexsearch
- Gatsby: https://www.gatsbyjs.org/packages/gatsby-plugin-flexsearch/

### Get Latest

<table>
    <tr><td colspan="3"></td></tr>
    <tr>
        <td>Build</td>
        <td>File</td>
        <td>CDN</td>
    </tr>
    <tr>
        <td>flexsearch.bundle.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.7.31/dist/flexsearch.bundle.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.bundle.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.bundle.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.7.31/dist/flexsearch.light.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.light.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.light.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.compact.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.7.31/dist/flexsearch.compact.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.compact.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.compact.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.es5.js *</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.7.31/dist/flexsearch.es5.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.es5.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/0.7.31/dist/flexsearch.es5.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>ES6 Modules</td>
        <td><a href="https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/nextapps-de/flexsearch/tree/0.7.31/dist/module/" target="_blank">Download</a></td>
        <td>The <i>/dist/module/</i> folder of this Github repository</td>
    </tr>
</table>

<span>*</span> The bundle "flexsearch.es5.js" includes polyfills for EcmaScript 5 Support.

#### Get Latest (NPM)

```cmd
npm install flexsearch
```

### Compare Web-Bundles

> The Node.js package includes all features from `flexsearch.bundle.js`.

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Feature</td>
        <td>flexsearch.bundle.js</td>
        <td>flexsearch.compact.js</td>
        <td>flexsearch.light.js</td>
    </tr>
    <tr>
        <td>
            <a href="#presets">Presets</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#async">Async Search</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#webworker">Workers (Web + Node.js)</a>
        </td>
        <td>✓</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#contextual">Contextual Indexes</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#docs">Index Documents (Field-Search)</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#store">Document Store</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#tokenizer">Partial Matching</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            Relevance Scoring
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#cache">Auto-Balanced Cache by Popularity</a>
        </td>
        <td>✓</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#tags">Tags</a>
        </td>
        <td>✓</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#suggestions">Suggestions</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#phonetic">Phonetic Matching</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>Customizable Charset/Language (Matcher, Encoder, Tokenizer, Stemmer, Filter, Split, RTL)</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr></tr>
    <tr>
        <td><a href="#export">Export / Import Indexes</a></td>
        <td>✓</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>File Size (gzip)</td>
        <td>6.8 kb</td>
        <td>5.3 kb</td>
        <td>2.9 kb</td>
    </tr>
</table>

<a name="compare" id="compare"></a>
## Performance Benchmark (Ranking)

Run Comparison: <a href="https://nextapps-de.github.io/flexsearch/" target="_blank">Performance Benchmark "Gulliver's Travels"</a>

Operation per seconds, higher is better, except the test "Memory" on which lower is better.

<table>
    <tr><td colspan="8"></td></tr>
    <tr>
        <td>Rank</td>
        <td>Library</td>
        <td>Memory</td>
        <td>Query (Single Term)</td>
        <td>Query (Multi Term)</td>
        <td>Query (Long)</td>
        <td>Query (Dupes)</td>
        <td>Query (Not Found)</td>	
    </tr>
    <tr>
        <td>1</td>
        <td>FlexSearch</td>
        <td><b>17</b></td>
        <td><b>7084129</b></td>
        <td><b>1586856</b></td>
        <td><b>511585</b></td>
        <td><b>2017142</b></td>
        <td>3202006</td>
    </tr>
    <tr></tr>
    <tr>
        <td>2</td>
        <td>JSii</td>
        <td>27</td>
        <td>6564</td>
        <td>158149</td>
        <td>61290</td>
        <td>95098</td>
        <td>534109</td>
    </tr>
    <tr></tr>
    <tr>
        <td>3</td>
        <td>Wade</td>
        <td>424</td>
        <td>20471</td>
        <td>78780</td>
        <td>16693</td>
        <td>225824</td>
        <td>213754</td>
    </tr>
    <tr></tr>
    <tr>
        <td>4</td>
        <td>JS Search</td>
        <td>193</td>
        <td>8221</td>
        <td>64034</td>
        <td>10377</td>
        <td>95830</td>
        <td>167605</td>
    </tr>
    <tr></tr>
    <tr>
        <td>5</td>
        <td>Elasticlunr.js</td>
        <td>646</td>
        <td>5412</td>
        <td>7573</td>
        <td>2865</td>
        <td>23786</td>
        <td>13982</td>
    </tr>
    <tr></tr>
    <tr>
        <td>6</td>
        <td>BulkSearch</td>
        <td>1021</td>
        <td>3069</td>
        <td>3141</td>
        <td>3333</td>
        <td>3265</td>
        <td><b>21825569</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>7</td>
        <td>MiniSearch</td>
        <td>24348</td>
        <td>4406</td>
        <td>10945</td>
        <td>72</td>
        <td>39989</td>
        <td>17624</td>
    </tr>
    <tr></tr>
    <tr>
        <td>8</td>
        <td>bm25</td>
        <td>15719</td>
        <td>1429</td>
        <td>789</td>
        <td>366</td>
        <td>884</td>
        <td>1823</td>
    </tr>
    <tr></tr>
    <tr>
        <td>9</td>
        <td>Lunr.js</td>
        <td>2219</td>
        <td>255</td>
        <td>271</td>
        <td>272</td>
        <td>266</td>
        <td>267</td>
    </tr>
    <tr></tr>
    <tr>
        <td>10</td>
        <td>FuzzySearch</td>
        <td>157373</td>
        <td>53</td>
        <td>38</td>
        <td>15</td>
        <td>32</td>
        <td>43</td>
    </tr>
    <tr></tr>
    <tr>
        <td>11</td>
        <td>Fuse</td>
        <td>7641904</td>
        <td>6</td>
        <td>2</td>
        <td>1</td>
        <td>2</td>
        <td>3</td>
    </tr>
</table>

<a name="installation"></a>
## Load Library

There are 3 types of indexes:

1. `Index` is a flat high performance index which stores id-content-pairs.
2. `Worker` / `WorkerIndex` is also a flat index which stores id-content-pairs but runs in background as a dedicated worker thread.
3. `Document` is multi-field index which can store complex JSON documents (could also exist of worker indexes).

The most of you probably need just one of them according to your scenario.

### Browser

#### Legacy ES5 Script Tag (Bundled)

```html
<script src="node_modules/flexsearch/dist/flexsearch.bundle.min.js"></script>
<script>

    // FlexSearch is available on window.FlexSearch
    // Access FlexSearch static methods via bundled export (static class methods of FlexSearch)

    const index = FlexSearch.Index(options);
    const document = FlexSearch.Document(options);
    const worker = FlexSearch.Worker(options);

</script>
```

#### ESM/ES6 Modules:

```html
<script type="module">

    // FlexSearch is NOT available on window.FlexSearch
    // Access FlexSearch static methods by importing them explicitly

    import Index from "./node_modules/flexsearch/dist/module/index";
    import Document from "./node_modules/flexsearch/dist/module/document";
    import Worker from "./node_modules/flexsearch/dist/module/worker";

    const index = new Index(options);
    const document = new Document(options);
    const worker = new Worker(options);

</script>
```

#### ESM/ES6 Bundled Module:

```html
<script type="module">

    // FlexSearch is NOT available on window.FlexSearch
    // Access FlexSearch static methods via bundled export (static class methods of FlexSearch)

    import FlexSearch from "./node_modules/flexsearch/dist/flexsearch.bundle.module.min.js";

    const index = FlexSearch.Index(options);
    const document = FlexSearch.Document(options);
    const worker = FlexSearch.Worker(options);

</script>
```

Or via CDN:
```html
<script src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.7.41/dist/flexsearch.bundle.min.js"></script>
```

AMD / CommonJS:

```javascript
var FlexSearch = require("./node_modules/flexsearch/dist/flexsearch.bundle.min.js");
```

### Node.js

```npm
npm install flexsearch
```

In your code include as follows:
=======
=======
>>>>>>> 06878b8 (re-bundle)
You can apply and chain different resolver methods to the raw result, e.g.:
>>>>>>> 7755e7d (bundle pre-release)

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

## Big In-Memory Keystores

The default maximum keystore limit for the In-Memory index is 2^24 of distinct terms/partials being stored (so-called "cardinality"). An additional register could be enabled and is dividing the index into self-balanced partitions.

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

## Multi-Tag-Search

Assume this document schema (a dataset from IMDB):
```js
{
    "tconst": "tt0000001",
    "titleType": "short",
    "primaryTitle": "Carmencita",
    "originalTitle": "Carmencita",
    "isAdult": 0,
    "startYear": "1894",
    "endYear": "",
    "runtimeMinutes": "1",
    "genres": [
        "Documentary",
        "Short"
    ]
}
```

An appropriate document descriptor could look like:
```js
import LatinEncoder from "./charset/latin/simple.js";

const flexsearch = new Document({
    encoder: LatinEncoder,
    resolution: 3,
    document: {
        id: "tconst",
        //store: true, // document store
        index: [{
            field: "primaryTitle",
            tokenize: "forward"
        },{
            field: "originalTitle",
            tokenize: "forward"
        }],
        tag: [
            "startYear",
            "genres"
        ]
    }
});
```
The field contents of `primaryTitle` and `originalTitle` are encoded by the forward tokenizer. The field contents of `startYear` and `genres` are added as tags.

Get all entries of a specific tag:
```js
const result = flexsearch.search({
    //enrich: true, // enrich documents
    tag: { "genres": "Documentary" },
    limit: 1000,
    offset: 0
});
```

Get entries of multiple tags (intersection):
```js
const result = flexsearch.search({
    //enrich: true, // enrich documents
    tag: { 
        "genres": ["Documentary", "Short"],
        "startYear": "1894"
    }
});
```

Combine tags with queries (intersection):
```js
const result = flexsearch.search({
    query: "Carmen", // forward tokenizer
    tag: { 
        "genres": ["Documentary", "Short"],
        "startYear": "1894"
    }
});
```

Alternative declaration:
```js
const result = flexsearch.search("Carmen", {
    tag: [{
        field: "genres",
        tag: ["Documentary", "Short"]
    },{
        field: "startYear",
        tag: "1894"
    }]
});
```

## Filter Fields (Index / Tags / Datastore)

```js
const flexsearch = new Document({
    document: {
        id: "id",
        index: [{
            // custom field:
            field: "somefield",
            filter: function(data){
                // return false to filter out
                // return anything else to keep
                return true;
            }
        }],
        tag: [{
            field: "city",
            filter: function(data){
                // return false to filter out
                // return anything else to keep
                return true;
            }
        }],
        store: [{
            field: "anotherfield",
            filter: function(data){
                // return false to filter out
                // return anything else to keep
                return true;
            }
        }]
    }
});
```

## Custom Fields (Index / Tags / Datastore)

Dataset example:
```js
{
    "id": 10001,
    "firstname": "John",
    "lastname": "Doe",
    "city": "Berlin",
    "street": "Alexanderplatz",
    "number": "1a",
    "postal": "10178"
}
```

You can apply custom fields derived from data or by anything else:
```js
const flexsearch = new Document({
    document: {
        id: "id",
        index: [{
            // custom field:
            field: "fullname",
            custom: function(data){
                // return custom string
                return data.firstname + " " + 
                       data.lastname;
            }
        },{
            // custom field:
            field: "location",
            custom: function(data){
                return data.street + " " +
                       data.number + ", " +
                       data.postal + " " +
                       data.city;
            }
        }],
        tag: [{
            // existing field
            field: "city"
        },{
            // custom field:
            field: "category",
            custom: function(data){
                let tags = [];
                // push one or multiple tags
                // ....
                return tags;
            }
        }],
        store: [{
            field: "anotherfield",
            custom: function(data){
                // return a falsy value to filter out
                // return anything else as to keep in store
                return data;
            }
        }]
    }
});
```

> Filter is also available in custom functions when returning `false`.

Perform a query against the custom field as usual:
```js
const result = flexsearch.search({
    query: "10178 Berlin Alexanderplatz",
    field: "location"
});
```

```js
const result = flexsearch.search({
    query: "john doe",
    tag: { "city": "Berlin" }
});
```

## Custom Score Function

```js
const index = new FlexSearchIndex({
    resolution: 10,
    score: function(content, term, term_index, partial, partial_index){
        // you'll need to return a number between 0 and "resolution"
        // score is starting from 0, which is the highest score
        // for a resolution of 10 you can return 0 - 9
        // ... 
        return 3;
    } 
});
```

A common situation is you have some predefined labels which are related to some kind of order, e.g. the importance or priority. A priority label could be `high`, `moderate`, `low` so you can derive the scoring from those properties. Another example is when you have something already ordered and you would like to keep this order as relevance.

Probably you won't need the parameters passed to the score function. But when needed here are the parameters from the score function explained:

1. `content` is the whole content as an array of terms (encoded) 
2. `term` is the current term which is actually processed (encoded)
3. `term_index` is the index of the term in the content array
4. `partial` is the current partial of a term which is actually processed
5. `partial_index` is the index position of the partial within the term

Partials params are empty when using tokenizer `strict`. Let's take an example by using the tokenizer `full`.

The content: "This is an ex[amp]()le of partial encoding"<br>
The highlighting part marks the partial which is actually processed. Then your score function will called by passing these parameters:

```js
function score(content, term, term_index, partial, partial_index){
    content = ["this", "is", "an", "example", "of", "partial", "encoding"]
    term = "example"
    term_index = 3
    partial = "amp"
    partial_index = 2
} 
```

## Merge Document Results

By default, the result set of Field-Search has a structure grouped by field names:
```js
[{
    field: "fieldname-1",
    result: [{
        id: 1001,
        doc: {/* stored document */}
    }]
},{
    field: "fieldname-2",
    result: [{
        id: 1001,
        doc: {/* stored document */}
    }]
},{
    field: "fieldname-3",
    result: [{
        id: 1002,
        doc: {/* stored document */}
    }]
}]
```

By passing the search option `merge: true` the result set will be merged into (group by id):
```js
[{
    id: 1001,
    doc: {/* stored document */}
    field: ["fieldname-1", "fieldname-2"]
},{
    id: 1002,
    doc: {/* stored document */}
    field: ["fieldname-3"]
}]
```

## Extern Worker Configuration

When using Worker by __also__ assign custom functions to the options e.g.:

- Custom Encoder
- Custom Encoder methods (normalize, prepare, finalize)
- Custom Score (function)
- Custom Filter (function)
- Custom Fields (function)

... then you'll need to move your __field configuration__ into a file which exports the configuration as a `default` export. The field configuration is not the whole Document-Descriptor.

When not using custom functions in combination with Worker you can skip this part.

Since every field resolves into a dedicated Worker, also every field which includes custom functions should have their own configuration file accordingly.

Let's take this document descriptor:

```js
{
    document: {
        index: [{
            // this is the field configuration
            // ---->
            field: "custom_field",
            custom: function(data){
                return "custom field content";
            }
            // <------
        }]
    }
};
```

The configuration which needs to be available as a default export is:

<<<<<<< HEAD
> __Note:__ This feature is disabled by default because of its extended memory usage. Read <a href="#contextual_enable">here</a> get more information about and how to enable.

FlexSearch introduce a new scoring mechanism called __Contextual Search__ which was invented by <a href="https://github.com/ts-thomas" target="_blank">Thomas Wilkerling</a>, the author of this library. A Contextual Search <a href="https://nextapps-de.github.io/flexsearch/" target="_blank">incredibly boost up queries to a complete new level</a> but also requires some additional memory (depending on ___depth___).
The basic idea of this concept is to limit relevance by its context instead of calculating relevance through the whole distance of its corresponding document.
This way contextual search also <a href="https://nextapps-de.github.io/flexsearch/match.html" target="_blank">improves the results of relevance-based queries</a> on a large amount of text data.

<p align="center">
    <img src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/doc/contextual-index.svg?v=4" width="100%">
</p>

<a name="contextual_enable"></a>
## Enable Contextual Scoring

Create an index and use the default context:
=======
>>>>>>> 7755e7d (bundle pre-release)
```js
{
    field: "custom_field",
    custom: function(data){
        return "custom field content";
    }
};
```

You're welcome to make some suggestions how to improve the handling of extern configuration.

### Example Node.js:

An extern configuration for one WorkerIndex, let's assume it is located in `./custom_field.js`:
```js
const { Charset } = require("flexsearch");
const { LatinSimple } = Charset;
// it requires a default export:
module.exports = {
    encoder: LatinSimple,
    tokenize: "forward",
    // custom function:
    custom: function(data){
        return "custom field content";
    }
};
```

Create Worker Index along the configuration above:
```js
const { Document } = require("flexsearch");
const flexsearch = new Document({
    worker: true,
    document: {
        index: [{
            // the field name needs to be set here
            field: "custom_field",
            // path to your config from above:
            config: "./custom_field.js",
        }]
    }
});
```

### Browser (ESM)

An extern configuration for one WorkerIndex, let's assume it is located in `./custom_field.js`:
```js
import { Charset } from "./dist/flexsearch.bundle.module.min.js";
const { LatinSimple } = Charset;
// it requires a default export:
export default {
    encoder: LatinSimple,
    tokenize: "forward",
    // custom function:
    custom: function(data){
        return "custom field content";
    }
};
```

Create Worker Index with the configuration above:
```js
import { Document } from "./dist/flexsearch.bundle.module.min.js";
// you will need to await for the response!
const flexsearch = await new Document({
    worker: true,
    document: {
        index: [{
            // the field name needs to be set here
            field: "custom_field",
            // Absolute URL to your config from above:
            config: "http://localhost/custom_field.js"
        }]
    }
});
```

Here it needs the __absolute URL__, because the WorkerIndex context is from type `Blob` and you can't use relative URLs starting from this context.

### Test Case

As a test the whole IMDB data collection was indexed, containing of:

JSON Documents: 9,273,132<br>
Fields: 83,458,188<br>
Tokens: 128,898,832<br>

The used index configuration has 2 fields (using bidirectional context of `depth: 1`), 1 custom field, 2 tags and a full datastore of all input json documents.

A non-Worker Document index requires 181 seconds to index all contents.<br>
The Worker index just takes 32 seconds to index them all, by processing every field and tag in parallel. For such large content it is a quite impressive result.

### CSP-friendly Worker (Browser)

When just using worker by passing the option `worker: true`, the worker will be created by code generation under the hood. This might have issues when using strict CSP settings.

You can overcome this issue by passing the filepath to the worker file like `worker: "./worker.js"`. The original worker file is located at `src/worker/worker.js`.

## Fuzzy-Search

Fuzzysearch describes a basic concept of how making queries more tolerant. FlexSearch provides several methods to achieve fuzziness:

1. Use a tokenizer: `forward`, `reverse` or `full`
2. Don't forget to use any of the builtin encoder `simple` > `balanced` > `advanced` > `extra` > `soundex` (sorted by fuzziness)
3. Use one of the language specific presets e.g. `/lang/en.js` for en-US specific content
4. Enable suggestions by passing the search option `suggest: true`

Additionally, you can apply custom `Mapper`, `Replacer`, `Stemmer`, `Filter` or by assigning a custom `normalize(str)`, `prepare(str)` or `finalize(arr)` function to the Encoder.

### Compare Fuzzy-Search Encoding

Original term which was indexed: "Struldbrugs"

<table>
    <tr>
        <th align="left">Encoder:</th>
        <th><code>exact</code></th>
        <th><code>default</code></th>
        <th><code>simple</code></th>
        <th><code>balance</code></th>
        <th><code>advanced</code></th>
        <th><code>extra</code></th>
        <th><code>soundex</code></th>
    </tr>
    <tr>
        <th align="left">Index Size</th>
        <th>3.1 Mb</th>
        <th>1.9 Mb</th>
        <th>1.8 Mb</th>
        <th>1.7 Mb</th>
        <th>1.6 Mb</th>
        <th>1.1 Mb</th>
        <th>0.7 Mb</th>
    </tr>
    <tr>
        <td align="left">Struldbrugs</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr>
        <td align="left">struldbrugs</td>
        <td></td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr>
        <td align="left">strũldbrųĝgs</td>
        <td></td>
        <td></td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr>
        <td align="left">strultbrooks</td>
        <td></td>
        <td></td>
        <td></td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr>
        <td align="left">shtruhldbrohkz</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr>
        <td align="left">zdroltbrykz</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr>
        <td align="left">struhlbrogger</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>✓</td>
    </tr>
</table>

The index size was measured after indexing the book "Gulliver's Travels".

### Custom Encoder

Since it is very simple to create a custom Encoder, you are welcome to create your own.
e.g.
```js
function customEncoder(content){
   const tokens = [];
   // split content into terms/tokens
   // apply your changes to each term/token
   // you will need to return an Array of terms/tokens
   // so just iterate through the input string and
   // push tokens to the array
   // ...
   return tokens;
}

const index = new Index({
   // set to strict when your tokenization was already done
   tokenize: "strict",
   encode: customEncoder
});
```

If you get some good results please feel free to share your encoder.

## Fast-Boot Serialization for Server-Side-Rendering (PHP, Python, Ruby, Rust, Java, Go, Node.js, ...)

> This is an experimental feature with limited support which probably might drop in future release. You're welcome to give some feedback.

When using Server-Side-Rendering you can create a different export which instantly boot up. Especially when using Server-side rendered content, this could help to restore a __static__ index on page load. Document-Indexes aren't supported yet for this method.

> When your index is too large you should use the default export/import mechanism.

As the first step populate the FlexSearch index with your contents.

You have two options:

### 1. Create a function as string

```js
const fn_string = index.serialize();
```

The contents of `fn_string` is a valid Javascript-Function declared as `inject(index)`. Store it or place this somewhere in your code.

This function basically looks like:

```js
function inject(index){
    index.reg = new Set([/* ... */]);
    index.map = new Map([/* ... */]);
    index.ctx = new Map([/* ... */]);
}
```

You could store this function by e.g. `fs.writeFileSync("inject.js", fn_string);` or place it as string in your markup.

After creating the index on client side just call the inject method like:

```js
const index = new Index({/* use same configuration! */});
inject(index);
```

That's it.

> You'll need to use the same configuration as you used before the export. Any changes on the configuration needs to be re-indexed.

### 2. Create just a function body as string

Alternatively you can use lazy function declaration by passing `false` to the serialize function:

```js
const fn_body = index.serialize(false);
```

You will get just the function body which looks like:

```js
index.reg = new Set([/* ... */]);
index.map = new Map([/* ... */]);
index.ctx = new Map([/* ... */]);
```

Now you can place this in your code directly (name your index as `index`), or you can also create an inject function from it, e.g.:

```js
const inject = new Function("index", fn_body);
```

This function is callable like the above example:

```js
const index = new Index();
inject(index);
```

## Load Library (Node.js, ESM, Legacy Browser)

<!--
> Please do not use the `/src/` folder of this repo. It isn't meant to be used directly, instead it needs [conditional compilation](https://en.wikipedia.org/wiki/Conditional_compilation). You can easily perform a <a href="#builds">custom build</a>, but you shouldn't use the source folder for production. You will need at least any kind of compiler which resolve the compiler flags within the code like [Closure Compiler](https://github.com/google/closure-compiler) (Advanced Compilation) or with [Babel conditional-compile](https://github.com/brianZeng/babel-plugin-conditional-compile) plugin. The `/dist/` folder is containing every version which you probably need including unminified ESM modules.
-->

```bash
npm install flexsearch
```
The **_dist_** folder are located in: `node_modules/flexsearch/dist/`

<table>
    <tr></tr>
    <tr>
        <td>Build</td>
        <td>File</td>
        <td>CDN</td>
    </tr>
    <tr>
        <td>flexsearch.bundle.debug.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/flexsearch.bundle.debug.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.bundle.debug.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.bundle.debug.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.bundle.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/flexsearch.bundle.min.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.bundle.min.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.bundle.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.bundle.module.debug.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/flexsearch.bundle.module.debug.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.bundle.module.debug.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.bundle.module.debug.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.bundle.module.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/flexsearch.bundle.module.min.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.bundle.module.min.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.bundle.module.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.es5.debug.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/flexsearch.es5.debug.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.es5.debug.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.es5.debug.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.es5.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/flexsearch.es5.min.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.es5.min.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.es5.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.debug.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/flexsearch.light.debug.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.light.debug.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.light.debug.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/flexsearch.light.min.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.light.min.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.light.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.module.debug.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/flexsearch.light.module.debug.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.light.module.debug.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.light.module.debug.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.module.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/flexsearch.light.module.min.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.light.module.min.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.light.module.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Javascript Modules (ESM)</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/module/" target="_blank">Download</a></td>
        <td><a href="https://github.com/nextapps-de/flexsearch/tree/v0.8-preview/dist/module" target="_blank">https://github.com/nextapps-de/flexsearch/tree/v0.8-preview/dist/module</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Javascript Modules Minified (ESM)</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/module-min/" target="_blank">Download</a></td>
        <td><a href="https://github.com/nextapps-de/flexsearch/tree/v0.8-preview/dist/module-min" target="_blank">https://github.com/nextapps-de/flexsearch/tree/v0.8-preview/dist/module-min</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Javascript Modules Debug (ESM)</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/v0.8-preview/dist/module-debug/" target="_blank">Download</a></td>
        <td><a href="https://github.com/nextapps-de/flexsearch/tree/v0.8-preview/dist/module-debug" target="_blank">https://github.com/nextapps-de/flexsearch/tree/v0.8-preview/dist/module-debug</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.custom.js</td>
        <td colspan="2"><a href="#builds">Read more about "Custom Build"</a></td>
    </tr>
</table>

> All debug versions are providing debug information through the console and gives you helpful advices on certain situations. Do not use them in production, since they are special builds containing extra debugging processes which noticeably reduce performance.

The abbreviations used at the end of the filenames indicates:

- `bundle` All features included, FlexSearch is available on `window.FlexSearch`
- `light` Only basic features are included, FlexSearch is available on `window.FlexSearch`
- `es5` bundle has support for EcmaScript5, FlexSearch is available on `window.FlexSearch`
- `module` indicates that this bundle is a Javascript module (ESM), FlexSearch members are available by `import { Index, Document, Worker, Encoder, Charset } from "./flexsearch.bundle.module.min.js"` or alternatively using the default export `import FlexSearch from "./flexsearch.bundle.module.min.js"`
- `min` bundle is minified
- `debug` bundle has enabled debug mode and contains additional code just for debugging purposes (do not use for production)

### Non-Module Bundles (ES5 Legacy)

> Non-Module Bundles export all their features to the public namespace "FlexSearch" e.g. `window.FlexSearch.Index` or `window.FlexSearch.Document`.

Load the bundle by a script tag:

```html
<script src="dist/flexsearch.bundle.min.js"></script>
<script>
  // ... access FlexSearch
  var Index = window.FlexSearch.Index;
  var index = new Index(/* ... */);
</script>
```

FlexSearch Members are accessible on:
```js
var Index = window.FlexSearch.Index;
var Document = window.FlexSearch.Document;
var Encoder = window.FlexSearch.Encoder;
var Charset = window.FlexSearch.Charset;
var Resolver = window.FlexSearch.Resolver;
var Worker = window.FlexSearch.Worker;
var IdxDB = window.FlexSearch.IndexedDB;
// only exported by non-module builds:
var Language = window.FlexSearch.Language;
```

Load language packs:

```html
<!-- English: -->
<script src="dist/lang/en.min.js"></script>
<!-- German: -->
<script src="dist/lang/de.min.js"></script>
<!-- French: -->
<script src="dist/lang/fr.min.js"></script>
<script>
  var EnglishEncoderPreset = window.FlexSearch.Language.en;
  var GermanEncoderPreset = window.FlexSearch.Language.de;
  var FrenchEncoderPreset = window.FlexSearch.Language.fr;
</script>
```

### Module (ESM)

When using modules you can choose from 2 variants: `flexsearch.xxx.module.min.js` has all features bundled ready for production, whereas the folder `/dist/module/` export all the features in the same structure as the source code but here compiler flags was resolved.

Also, for each variant there exist:
1. A debug version for the development
2. A pre-compiled minified version for production

Use the bundled version exported as a module (default export):

```html
<script type="module">
    import FlexSearch from "./dist/flexsearch.bundle.module.min.js";
    const index = new FlexSearch.Index(/* ... */);
</script>
```

Or import FlexSearch members separately by:

```html
<script type="module">
    import { Index, Document, Encoder, Charset, Resolver, Worker, IdxDB } 
        from "./dist/flexsearch.bundle.module.min.js";
    const index = new Index(/* ... */);
</script>
```

Use non-bundled modules:

```html
<script type="module">
    import Index from "./dist/module/index.js";
    import Document from "./dist/module/document.js";
    import Encoder from "./dist/module/encoder.js";
    import Charset from "./dist/module/charset.js";
    import Resolver from "./dist/module/resolver.js";
    import Worker from "./dist/module/worker.js";
    import IdxDB from "./dist/module/db/indexeddb/index.js";
    const index = new Index(/* ... */);
</script>
```

Language packs are accessible via:

```js
import EnglishEncoderPreset from "./dist/module/lang/en.js";
import GermanEncoderPreset from "./dist/module/lang/de.js";
import FrenchEncoderPreset from "./dist/module/lang/fr.js";
```

Also, pre-compiled non-bundled production-ready modules are located in `dist/module-min/`, whereas the debug version is located at `dist/module-debug/`.

You can also load modules via CDN:

```html
<script type="module">
    import Index from "https://unpkg.com/flexsearch@v0.8-preview/dist/module/index.js";
    const index = new Index(/* ... */);
</script>
```

### Node.js

Install FlexSearch via NPM:

```npm
npm install flexsearch
```

Use the default export:

```js
const FlexSearch = require("flexsearch");
const index = new FlexSearch.Index(/* ... */);
```

Or require FlexSearch members separately by:

```js
const { Index, Document, Encoder, Charset, Resolver, Worker, IdxDB } = require("flexsearch");
const index = new Index(/* ... */);
```

When you are using ESM in Node.js then just use the Modules explained one section above.

Language packs are accessible via:

```js
const EnglishEncoderPreset = require("flexsearch/lang/en");
const GermanEncoderPreset = require("flexsearch/lang/de");
const FrenchEncoderPreset = require("flexsearch/lang/fr");
```

Persistent Connectors are accessible via:

```js
const Postgres = require("flexsearch/db/postgres");
const Sqlite = require("flexsearch/db/sqlite");
const MongoDB = require("flexsearch/db/mongodb");
const Redis = require("flexsearch/db/redis");
const Clickhouse = require("flexsearch/db/clickhouse");
```

<a name="builds" id="builds"></a>

## Custom Builds

The `/src/` folder of this repository requires some compilation to resolve the build flags. Those are your options:

- Closure Compiler (Advanced Compilation) (used by this library <a href="task/build.js">here</a>)
- Babel + Plugin `babel-plugin-conditional-compile` (used by this library <a href="task/babel.min.json">here</a>)

You can't resolve build flags with:

- Webpack
- esbuild
- rollup
- Terser

These are some of the basic builds located in the `/dist/` folder:

```bash
npm run build:bundle
npm run build:light
npm run build:module
npm run build:es5
```

Perform a custom build (UMD bundle) by passing build flags:

```bash
npm run build:custom SUPPORT_DOCUMENT=true SUPPORT_TAGS=true LANGUAGE_OUT=ECMASCRIPT5 POLYFILL=true
```

Perform a custom build in ESM module format:

```bash
npm run build:custom RELEASE=custom.module SUPPORT_DOCUMENT=true SUPPORT_TAGS=true 
```

Perform a debug build:

```bash
npm run build:custom DEBUG=true SUPPORT_DOCUMENT=true SUPPORT_TAGS=true 
```

> On custom builds each build flag will be set to `false` by default when not passed.

The custom build will be saved to `dist/flexsearch.custom.xxxx.min.js` or when format is module to `dist/flexsearch.custom.module.xxxx.min.js` (the "xxxx" is a hash based on the used build flags).

<a name="build-flags" id="builds"></a>

### Supported Build Flags

<table>
    <tr>
        <td>Flag</td>
        <td>Values</td>
        <td>Info</td>
    </tr>
    <tr>
        <td colspan="3"><br><b>Feature Flags</b></td>
    </tr>
    <tr>
        <td>SUPPORT_WORKER</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_ENCODER</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_CHARSET</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_CACHE</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_ASYNC</td>
        <td>true, false</td>
        <td>Asynchronous Rendering (support Promises)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_STORE</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_SUGGESTION</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_SERIALIZE</td>
        <td>true, <b>false</b></td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_DOCUMENT</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_TAGS</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_PERSISTENT</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_KEYSTORE</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_COMPRESSION</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_RESOLVER</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr>
        <td colspan="3"><br><b>Compiler Flags</b></td>
    </tr>
    <tr>
        <td>DEBUG</td>
        <td>true, <b>false</b></td>
        <td>Output debug information to the console (default: false)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>RELEASE<br><br><br><br><br></td>
        <td><b>custom</b><br>custom.module<br>bundle<br>bundle.module<br>es5<br>light<br>compact</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>POLYFILL</td>
        <td>true, <b>false</b></td>
        <td>Include Polyfills (based on LANGUAGE_OUT)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>PROFILER</td>
        <td>true, <b>false</b></td>
        <td>Just used for automatic performance tests</td>
    </tr>
    <tr></tr>
    <tr>
        <td>LANGUAGE_OUT<br><br><br><br><br><br><br><br><br><br><br></td>
        <td>ECMASCRIPT3<br>ECMASCRIPT5<br>ECMASCRIPT_2015<br>ECMASCRIPT_2016<br>ECMASCRIPT_2017<br>ECMASCRIPT_2018<br>ECMASCRIPT_2019<br>ECMASCRIPT_2020<br>ECMASCRIPT_2021<br>ECMASCRIPT_2022<br>ECMASCRIPT_NEXT<br>STABLE</td>
        <td>Target language</td>
    </tr>
</table>

### Misc

A formula to determine a well balanced value for the `resolution` is: $2*floor(\sqrt{content.length})$ where content is the value pushed by `index.add()`. Here the maximum length of all contents should be used.

## Migration

- The index option property "minlength" has moved to the Encoder Class
- The index option flag "optimize" was removed
- The index option flag "lang" was replaced by the Encoder Class `.assign()`
- Boost cannot apply upfront anymore when indexing, instead you can use the boost property on a query dynamically
- All definitions of the old text encoding process was replaced by similar definitions (Array changed to Set, Object changed to Map). You can use of the helper methods like `.addMatcher(char_match, char_replace)` which adds everything properly.
- The default value for `fastupdate` is set to `false` by default when not passed via options
- The method `index.encode()` has moved to `index.encoder.encode()`
- The options `charset` and `lang` was removed from index (replaced by `Encoder.assign({...})`)
- Every charset collection (files in folder `/lang/**.js`) is now exported as a config object (instead of a function). This config needs to be created by passing to the constructor `new Encoder(config)` or can be added to an existing instance via `encoder.assign(config)`. The reason was to keep the default encoder configuration when having multiple document indexes.
- The property `bool` from DocumentOptions was removed (replaced by `Resolver`)
- The static methods `FlexSearch.registerCharset()` and `FlexSearch.registerLanguage()` was removed, those collections are now exported to `FlexSearch.Charset` which can be accessed as module `import { Charset } from "flexsearch"` and language packs are now applied by `encoder.assign()`
- Instead of e.g. "latin:simple" the Charset collection is exported as a module and has to be imported by e.g. `import LatinSimple from "./charset.js"` and then assigned to an existing Encoder by `encoder.assign(LatinSimple)` or by creation `encoder = new Encoder(LatinSimple)`
- You can import language packs by `dist/module/lang/*` when using ESM and by `const EnglishPreset = require("flexsearch/lang/en");` when using CommonJS (Node.js)
- The method `index.append()` is now deprecated and will be removed in the near future, because it isn't consistent and leads into unexpected behavior when not used properly. You should only use `index.add()` to push contents to the index.
- Using the `async` variants like `.searchAsync` is now deprecated (but still works), asynchronous responses will always return from Worker-Index and from Persistent-Index, everything else will return a non-promised result. Having both types of methods looks like the developers can choose between them, but they can't.

## Not finished yet

Unfortunately, not everything could be finished and needs to be done in the upcoming version.

- The `Resolver` does not support Document-Indexes, there is still some work to do.
- Config serialization for persistent indexes (store configuration, check migrations, import and restore field configurations)
- Tooling for persistent indexes (list all tables, remove tables)