<<<<<<< HEAD
# FlexSearch v0.8 (Preview)

```bash
npm install git+https://github.com/nextapps-de/flexsearch/tree/v0.8-preview
```

## What's New

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
  - [basic-export-import](example/nodejs-commonjs/basic-export-import)
  - [document](example/nodejs-commonjs/document)
  - [document-persistent](example/nodejs-commonjs/document-persistent)
  - [document-worker](example/nodejs-commonjs/document-worker)
  - [document-worker-extern-config](example/nodejs-commonjs/document-worker-extern-config)
  - [document-export-import](example/nodejs-commonjs/document-export-import)
  - [language-pack](example/nodejs-commonjs/language-pack)
- [nodejs-esm](example/nodejs-esm):
  - [basic](example/nodejs-esm/basic)
  - [basic-suggestion](example/nodejs-esm/basic-suggestion)
  - [basic-persistent](example/nodejs-esm/basic-persistent)
  - [basic-resolver](example/nodejs-esm/basic-resolver)
  - [basic-worker](example/nodejs-esm/basic-worker)
  - [basic-worker-extern-config](example/nodejs-esm/basic-worker-extern-config)
  - [basic-export-import](example/nodejs-esm/basic-export-import)
  - [document](example/nodejs-esm/document)
  - [document-persistent](example/nodejs-esm/document-persistent)
  - [document-worker](example/nodejs-esm/document-worker)
  - [document-worker-extern-config](example/nodejs-esm/document-worker-extern-config)
  - [document-export-import](example/nodejs-esm/document-export-import)
  - [language-pack](example/nodejs-esm/language-pack)

### Examples Browser

- [browser-legacy](example/browser-legacy):
  - [basic](example/browser-legacy/basic)
  - [basic-suggestion](example/browser-legacy/basic-suggestion)
  - [basic-persistent](example/browser-legacy/basic-persistent)
  - [basic-resolver](example/browser-legacy/basic-resolver)
  - [basic-worker](example/browser-legacy/basic-worker)
  - [document](example/browser-legacy/document)
  - [document-highlighting](example/browser-legacy/document-highlighting)
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
  - [document-highlighting](example/browser-module/document-highlighting)
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
=======
FlexSearch v0.8: [Overview and Migration Guide](doc/0.8.0.md)
<h1></h1>
<h1>
    <img src="doc/flexsearch-logo-glass-animated.svg" style="max-width: 500px" alt="FlexSearch.js: Next-Generation full-text search library for Browser and Node.js">
    <p></p>
</h1>
<h3>Next-Generation full-text search library for Browser and Node.js</h3>

<a target="_blank" href="https://www.npmjs.com/package/flexsearch"><img src="https://img.shields.io/npm/v/flexsearch.svg"></a>
<img src="https://img.shields.io/badge/build-passing-brightgreen">
<img src="https://img.shields.io/badge/typed-61%25-yellow">
<a target="_blank" href="https://github.com/nextapps-de/flexsearch/issues"><img src="https://img.shields.io/github/issues/nextapps-de/flexsearch.svg"></a>
<a target="_blank" href="https://github.com/nextapps-de/flexsearch/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/flexsearch.svg"></a>
<!--<img src="https://img.shields.io/badge/coverage-90%25-brightgreen">-->

<a href="#installation">Basic Start</a> &ensp;&bull;&ensp; 
<a href="#api">API Reference</a> &ensp;&bull;&ensp;
<a href="doc/encoder.md">Encoder</a> &ensp;&bull;&ensp;
<a href="doc/custom-builds.md">Document Search</a> &ensp;&bull;&ensp;
<a href="doc/persistent.md">Persistent Indexes</a> &ensp;&bull;&ensp;
<a href="doc/worker.md">Using Worker</a> &ensp;&bull;&ensp;
<a href="doc/document-search.md">Tag Search</a> &ensp;&bull;&ensp;
<a href="doc/resolver.md">Resolver</a> &ensp;&bull;&ensp;
<a href="doc/customization.md">Customization</a> &ensp;&bull;&ensp;
<a href="CHANGELOG.md">Changelog</a>

## Support this Project

You can help me by making a personal donation to keep this project alive and also to provide all the contribution to solve your needs.

<a href="https://opencollective.com/flexsearch/donate" target="_blank" style="margin-right: 10px"><img src="doc/opencollective.png" height="32" alt="Donate using Open Collective"></a>
<a href="https://github.com/sponsors/ts-thomas/" target="_blank" style="margin-right: 10px"><img src="doc/github-sponsors.png" height="32" alt="Donate using Github Sponsors"></a>
<a href="https://liberapay.com/ts-thomas/donate" target="_blank" style="margin-right: 10px"><img src="doc/liberapay.svg" height="32" alt="Donate using Liberapay"></a>
<a href="https://www.patreon.com/user?u=96245532" target="_blank" style="margin-right: 10px"><img src="doc/patron.png" height="32" alt="Donate using Patreon"></a>
<a href="https://salt.bountysource.com/teams/ts-thomas" target="_blank" style="margin-right: 10px"><img src="doc/bountysource.svg" height="32" alt="Donate using Bountysource"></a>
<a href="https://www.paypal.com/donate/?hosted_button_id=GEVR88FC9BWRW" target="_blank"><img src="doc/paypal.png" height="32" alt="Donate using PayPal"></a>

### FlexSearch Sponsors

<a href="https://antithesis.com" target="_blank" style="display: inline-block">
    <center>
        <img src="doc/antithesis_logo.svg" width="180" alt="Donate using Open Collective"><br>
        Antithesis Operations LLC
    </center>
</a>
<h1></h1>
>>>>>>> 2e0e190 (push v0.8 to master)

<!--
FlexSearch introduce a new scoring algorithm called <a href="#contextual">"contextual index"</a>, based on a <a href="#dictionary">pre-scored lexical dictionary</a> architecture which actually performs queries up to 1,000,000 times faster compared to other libraries.
-->

FlexSearch performs queries up to 1,000,000 times faster <a href="https://nextapps-de.github.io/flexsearch/bench/" target="_blank">compared to other libraries</a> by also providing <a href="https://nextapps-de.github.io/flexsearch/bench/match.html" target="_blank">powerful search capabilities</a> like multi-field search (document search), phonetic transformations, partial matching, tag-search or suggestions.

Bigger workloads are scalable through workers to perform any updates or queries on the index in parallel through dedicated balanced threads.

The latest generation v0.8 introduce <a href="#db">Persistent Indexes</a>, well optimized for scaling of large datasets and running in parallel. All available features was natively ported right into the database engine of your choice.

FlexSearch was nominated by the GitNation for the "Best Technology of the Year".

Supported Platforms:
- Browser
- Node.js

Supported Database:
- InMemory (Default)
- [IndexedDB (Browser)](doc/persistent-indexeddb.md)
- [Redis](doc/persistent-redis.md)
- [SQLite](doc/persistent-sqlite.md)
- [Postgres](doc/persistent-postgres.md)
- [MongoDB](doc/persistent-mongodb.md)
- [Clickhouse](doc/persistent-clickhouse.md)

Demos:
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/demo/autocomplete.html" target="_blank">Auto-Complete</a>

Library Comparison:
- <a href="https://nextapps-de.github.io/flexsearch/bench/" target="_blank">Performance Benchmark</a>
- <a href="https://nextapps-de.github.io/flexsearch/bench/match.html" target="_blank">Scoring Benchmark</a>

<<<<<<< HEAD
The result will look like:

```js
[{
  "field": "title",
  "result": [{
      "id": 1,
      "doc": {
        "id": 1,
        "title": "Carmencita"
      },
      "highlight": "<b>Carmen</b>cita"
    },{
      "id": 2,
      "doc": {
        "id": 2,
        "title": "Le clown et ses chiens"
      },
      "highlight": "Le <b>clown</b> et ses chiens"
    }
  ]
}]
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
2. Don't forget to use any of the builtin encoder `simple` > `balance` > `advanced` > `extra` > `soundex` (sorted by fuzziness)
3. Use one of the language specific presets e.g. `/lang/en.js` for en-US specific content
4. Enable suggestions by passing the search option `suggest: true`

Additionally, you can apply custom `Mapper`, `Replacer`, `Stemmer`, `Filter` or by assigning a custom `normalize(str)`, `prepare(str)` or `finalize(arr)` function to the Encoder.

### Compare Fuzzy-Search Encoding

Original term which was indexed: "Struldbrugs"

<table>
    <tr>
        <th align="left">Encoder:</th>
        <th><code>LatinExact</code></th>
        <th><code>LatinDefault</code></th>
        <th><code>LatinSimple</code></th>
        <th><code>LatinBalance</code></th>
        <th><code>LatinAdvanced</code></th>
        <th><code>LatinExtra</code></th>
        <th><code>LatinSoundex</code></th>
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

When using Server-Side-Rendering you can create a different export which instantly boot up. Especially when using Server-side rendered content, this could help to restore a __<u>static</u>__ index on page load. Document-Indexes aren't supported yet for this method.

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

You can save this function by e.g. `fs.writeFileSync("inject.js", fn_string);` or place it as string in your SSR-generated markup.

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
=======
Extern Projects & Plugins:
- React: https://github.com/angeloashmore/react-use-flexsearch
- Vue: https://github.com/Noction/vue-use-flexsearch
- Gatsby: https://www.gatsbyjs.org/packages/gatsby-plugin-flexsearch/
>>>>>>> 2e0e190 (push v0.8 to master)

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
        <td>✓</td>
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
            <a href="#docs">Document Search</a>
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
            <a href="#cache">Auto-Balanced Cache by Popularity/Last Queries</a>
        </td>
        <td>✓</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#tags">Tag Search</a>
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
        <td>✓</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#phonetic">Phonetic Match (Fuzzy Search)</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>Encoder</td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr></tr>
    <tr>
        <td><a href="#export">Export / Import Indexes</a></td>
        <td>✓</td>
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td><a href="#resolver">Resolver</a></td>
        <td>✓</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td><a href="#db">Persistent Index (IndexedDB)</a></td>
        <td>✓</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>File Size (gzip)</td>
        <td>14.0 kb</td>
        <td>9.0 kb</td>
        <td>4.4 kb</td>
    </tr>
</table>

<a name="compare" id="compare"></a>
## Performance Benchmark (Ranking)

Run Comparison: <a href="https://nextapps-de.github.io/flexsearch/bench/" target="_blank">Performance Benchmark "Gulliver's Travels"</a>

Operation per seconds, higher is better, except the test "Memory" on which lower is better.
The memory value refers to the amount of memory which was additionally allocated during search.

<table>
    <tr><td colspan="8"></td></tr>
    <tr>
        <td>Rank</td>
        <td>Library</td>
        <td>Memory</td>
        <td>Query: Single</td>
        <td>Query: Multi</td>
        <td>Query: Large</td>
        <td>Query: Not Found</td>	
    </tr>
    <tr>
        <td>1</td>
        <td>FlexSearch</td>
        <td><b>4</b></td>
        <td><b>60129740</b></td>
        <td><b>26512159</b></td>
        <td><b>17737877</b></td>
        <td><b>66410956</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>2</td>
        <td>JSii</td>
        <td>27</td>
        <td>6564</td>
        <td>158149</td>
        <td>61290</td>
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
        <td>13982</td>
    </tr>
    <!--
    <tr></tr>
    <tr>
        <td>6</td>
        <td>BulkSearch</td>
        <td>1021</td>
        <td>3069</td>
        <td>3141</td>
        <td>3333</td>
        <td><b>21825569</b></td>
    </tr>
    -->
    <tr></tr>
    <tr>
        <td>7</td>
        <td>MiniSearch</td>
        <td>24348</td>
        <td>4406</td>
        <td>10945</td>
        <td>72</td>
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

## Basic Usage and Variants

```js
index.add(id, text);
index.search(text);
index.search(text, limit);
index.search(text, options);
index.search(text, limit, options);
index.search(options);
```

```js
document.add(doc);
document.add(id, doc);
document.search(text);
document.search(text, limit);
document.search(text, options);
document.search(text, limit, options);
document.search(options);
```

```js
worker.add(id, text);
worker.search(text);
worker.search(text, limit);
worker.search(text, options);
worker.search(text, limit, options);
worker.search(text, limit, options, callback);
worker.search(options);
```

The `worker` inherits from type `Index` and does not inherit from type `Document`. Therefore, a WorkerIndex basically works like a standard FlexSearch Index. Worker-Support in documents needs to be enabled by just passing the appropriate option during creation `{ worker: true }`.

> Every method called on a `Worker` index is treated as async. You will get back a `Promise` or you can provide a callback function as the last parameter alternatively.

### Examples Node.js

- [nodejs-commonjs](example/nodejs-commonjs):
    - [basic](example/nodejs-commonjs/basic)
    - [basic-suggestion](example/nodejs-commonjs/basic-suggestion)
    - [basic-persistent](example/nodejs-commonjs/basic-persistent)
    - [basic-resolver](example/nodejs-commonjs/basic-resolver)
    - [basic-worker](example/nodejs-commonjs/basic-worker)
    - [basic-worker-extern-config](example/nodejs-commonjs/basic-worker-extern-config)
    - [basic-export-import](example/nodejs-commonjs/basic-export-import)
    - [document](example/nodejs-commonjs/document)
    - [document-persistent](example/nodejs-commonjs/document-persistent)
    - [document-worker](example/nodejs-commonjs/document-worker)
    - [document-worker-extern-config](example/nodejs-commonjs/document-worker-extern-config)
    - [document-export-import](example/nodejs-commonjs/document-export-import)
    - [language-pack](example/nodejs-commonjs/language-pack)
- [nodejs-esm](example/nodejs-esm):
    - [basic](example/nodejs-esm/basic)
    - [basic-suggestion](example/nodejs-esm/basic-suggestion)
    - [basic-persistent](example/nodejs-esm/basic-persistent)
    - [basic-resolver](example/nodejs-esm/basic-resolver)
    - [basic-worker](example/nodejs-esm/basic-worker)
    - [basic-worker-extern-config](example/nodejs-esm/basic-worker-extern-config)
    - [basic-export-import](example/nodejs-esm/basic-export-import)
    - [document](example/nodejs-esm/document)
    - [document-persistent](example/nodejs-esm/document-persistent)
    - [document-worker](example/nodejs-esm/document-worker)
    - [document-worker-extern-config](example/nodejs-esm/document-worker-extern-config)
    - [document-export-import](example/nodejs-esm/document-export-import)
    - [language-pack](example/nodejs-esm/language-pack)

### Examples Browser

- [browser-legacy](example/browser-legacy):
    - [basic](example/browser-legacy/basic)
    - [basic-suggestion](example/browser-legacy/basic-suggestion)
    - [basic-persistent](example/browser-legacy/basic-persistent)
    - [basic-resolver](example/browser-legacy/basic-resolver)
    - [basic-worker](example/browser-legacy/basic-worker)
    - [document](example/browser-legacy/document)
    - [document-highlighting](example/browser-legacy/document-highlighting)
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
    - [document-highlighting](example/browser-module/document-highlighting)
    - [document-persistent](example/browser-module/document-persistent)
    - [document-worker](example/browser-module/document-worker)
    - [document-worker-extern-config](example/browser-module/document-worker-extern-config)
    - [language-pack](example/browser-module/language-pack)

<a name="api"></a>
## API Overview

Global methods:

- <a href="#flexsearch.register">FlexSearch.__registerCharset__(name, charset)</a>
- <a href="#flexsearch.language">FlexSearch.__registerLanguage__(name, language)</a>

Index methods:

- <a href="#index.add">Index.__add__(id, string)</a> *
- <a href="#index.append">Index.__append__(id, string)</a> *
- <a href="#index.update">Index.__update__(id, string)</a> *
- <a href="#index.remove">Index.__remove__(id)</a> *
- <a href="#index.search">Index.__search__(string, \<limit\>, \<options\>)</a> *
- <a href="#index.search">Index.__search__(options)</a> *
- _async_ <a href="#index.export">Index.__export__(handler)</a>
- _async_ <a href="#index.import">Index.__import__(key, data)</a>

WorkerIndex methods:

- _async_ <a href="#index.add">Index.__add__(id, string)</a>
- _async_ <a href="#index.append">Index.__append__(id, string)</a>
- _async_ <a href="#index.update">Index.__update__(id, string)</a>
- _async_ <a href="#index.remove">Index.__remove__(id)</a>
- _async_ <a href="#index.search">Index.__search__(string, \<limit\>, \<options\>)</a>
- _async_ <a href="#index.search">Index.__search__(options)</a>
- _async_ <a href="#index.export">~~Index.__export__(handler)~~</a> (WIP)
- _async_ <a href="#index.import">~~Index.__import__(key, data)~~</a> (WIP)

Document methods:

- <a href="#document.add">Document.__add__(\<id\>, document)</a> *
- <a href="#document.append">Document.__append__(\<id\>, document)</a> *
- <a href="#document.update">Document.__update__(\<id\>, document)</a> *
- <a href="#document.remove">Document.__remove__(id || document)</a> *
- <a href="#document.search">Document.__search__(string, \<limit\>, \<options\>)</a> *
- <a href="#document.search">Document.__search__(options)</a> *
- _async_ <a href="#document.export">Document.__export__(handler)</a>
- _async_ <a href="#document.import">Document.__import__(key, data)</a>

<span>*</span> For each of those methods there exist an asynchronous equivalent:

Async Version:

- _async_ <a href="#addAsync">.__addAsync__( ... , \<callback\>)</a>
- _async_ <a href="#appendAsync">.__appendAsync__( ... , \<callback\>)</a>
- _async_ <a href="#updateAsync">.__updateAsync__( ... , \<callback\>)</a>
- _async_ <a href="#removeAsync">.__removeAsync__( ... , \<callback\>)</a>
- _async_ <a href="#searchAsync">.__searchAsync__( ... , \<callback\>)</a>

Async methods will return a `Promise`, alternatively you can pass a callback function as the last parameter.

Methods `export` and also `import` are always async as well as every method you call on a Worker-based Index.

<a name="options"></a>
## Options

FlexSearch is highly customizable. Make use of the right options can really improve your results as well as memory economy and query time.

<a name="options-index"></a>
### Index Options

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>preset</td>
        <td>
            "memory"<br>
            "performance"<br>
            "match"<br>
            "score"<br>
            "default"
        </td>
        <td>
            The <a href="#presets">configuration profile</a> as a shortcut or as a base for your custom settings.<br>
        </td>
        <td>"default"</td>
    </tr>
    <tr></tr>
    <tr>
        <td>tokenize</td>
        <td>
            "strict"<br>
            "forward"<br>
            "reverse"<br>
            "full"
        </td>
        <td>
            The <a href="#tokenizer">indexing mode (tokenizer)</a>.<br><br>Choose one of the <a href="#tokenizer">built-ins</a> or pass a <a href="#flexsearch.tokenizer">custom tokenizer function</a>.<br>
        </td>
        <td>"strict"</td>
    </tr>
    <tr></tr>
    <tr>
        <td>cache</td>
        <td>
            Boolean<br>
            Number
        </td>
        <td>Enable/Disable and/or set capacity of cached entries.<br><br>When passing a number as a limit the <b>cache automatically balance stored entries related to their popularity</b>.<br><br>Note: When just using "true" the cache has no limits and growth unbounded.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>resolution</td>
        <td>
            Number
        </td>
        <td>Sets the scoring resolution (default: 9).</td>
        <td>9</td>
    </tr>
    <tr></tr>
    <tr>
        <td>context</td>
        <td>
            Boolean<br>
            Context Options
        </td>
        <td>Enable/Disable <a href="#contextual">contextual indexing</a>. When passing "true" as value it will take the default values for the context.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>optimize</td>
        <td>
            Boolean
        </td>
        <td>When enabled it uses a memory-optimized stack flow for the index.</td>
        <td>true</td>
    </tr>
    <tr></tr>
    <tr>
        <td>boost</td>
        <td>
            function(arr, str, int) => float
        </td>
        <td>A custom boost function used when indexing contents to the index. The function has this signature: <code>Function(words[], term, index) => Float</code>. It has 3 parameters where you get an array of all words, the current term and the current index where the term is placed in the word array. You can apply your own calculation e.g. the occurrences of a term and return this factor (<1 means relevance is lowered, >1 means relevance is increased).<br><br>Note: this feature is currently limited by using the tokenizer "strict" only.</td>
        <td>null</td>
    </tr>
    <tr>
        <td colspan="4">
            Language-specific Options and Encoding:
        </td>
    </tr>
    <tr>
        <td>charset<br><br></td>
        <td>
            Charset Payload<br>
            String (key)
        </td>
        <td vertical-align="top">
            Provide a custom charset payload or pass one of the keys of built-in charsets.
        </td>
        <td>"latin"</td>
    </tr>
    <tr></tr>
    <tr>
        <td>language<br><br></td>
        <td>
            Language Payload<br>
            String (key)
        </td>
        <td vertical-align="top">
            Provide a custom language payload or pass in language shorthand flag (ISO-3166) of built-in languages.
        </td>
        <td>null</td>
    </tr>
    <tr></tr>
    <tr>
        <td>encode<br><br><br><br><br><br><br></td>
        <td>
            false<br>
            "default"<br>
            "simple"<br>
            "balance"<br>
            "advanced"<br>
            "extra"<br>
            function(str) => [words]
        </td>
        <td>The encoding type.<br><br>Choose one of the <a href="#phonetic">built-ins</a> or pass a <a href="#flexsearch.encoder">custom encoding function</a>.</td>
        <td>"default"</td>
    </tr>
    <tr></tr>
    <tr>
        <td>stemmer<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td></td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>filter<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td></td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>matcher<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td></td>
        <td>false</td>
    </tr>
    <tr>
        <td colspan="4">
            Additional Options for Document Indexes:
        </td>
    </tr>
    <tr>
        <td>worker<br></td>
        <td>
            Boolean
        </td>
        <td>Enable/Disable and set count of running worker threads.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>document<br></td>
        <td>Document Descriptor</td>
        <td vertical-align="top">
            Includes definitions for the document index and storage.
        </td>
        <td></td>
    </tr>
</table>

<a name="options-context"></a>
### Context Options

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>resolution</td>
        <td>
            Number
        </td>
        <td>Sets the scoring resolution for the context (default: 1).</td>
        <td>1</td>
    </tr>
    <tr></tr>
    <tr>
        <td>depth<br><br></td>
        <td>
            false<br>
            Number
        </td>
        <td>Enable/Disable <a href="#contextual">contextual indexing</a> and also sets contextual distance of relevance. Depth is the maximum number of words/tokens away a term to be considered as relevant.</td>
        <td>1</td>
    </tr>
    <tr></tr>
    <tr>
        <td>bidirectional</td>
        <td>
            Boolean
        </td>
        <td>Sets bidirectional search result. If enabled and the source text contains "red hat", it will be found for queries "red hat" and "hat red".</td>
        <td>true</td>
    </tr>
</table>

<a name="options-document"></a>
### Document Options

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>id<br></td>
        <td>String</td>
        <td vertical-align="top"></td>
        <td>"id""</td>
    </tr>
    <tr></tr>
    <tr>
        <td>tag<br><br></td>
        <td>false<br>String</td>
        <td vertical-align="top"></td>
        <td>"tag"</td>
    </tr>
    <tr></tr>
    <tr>
        <td>index<br><br><br></td>
        <td>String<br>Array&lt;String><br>Array&lt;Object></td>
        <td vertical-align="top"></td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>store<br><br><br></td>
        <td>Boolean<br>String<br>Array&lt;String></td>
        <td vertical-align="top"></td>
        <td>false</td>
    </tr>
</table>

<a name="options-charset"></a>
### Charset Options

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>split<br><br></td>
        <td>
            false<br>
            RegExp<br>
            String
        </td>
        <td vertical-align="top">
            The rule to split words when using non-custom tokenizer (<a href="#tokenizer">built-ins</a> e.g. "forward"). Use a string/char or use a regular expression (default: <code>/\W+/</code>).<br>
        </td>
        <td><code>/[\W_]+/</code></td>
    </tr>
    <tr></tr>
    <tr>
        <td>rtl<br></td>
        <td>
            Boolean
        </td>
        <td>Enables Right-To-Left encoding.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>encode<br></td>
        <td>
            function(str) => [words]
        </td>
        <td>The custom encoding function.</td>
        <td>/lang/latin/default.js</td>
    </tr>
</table>

<a name="options-language"></a>
### Language Options

<table>
    <tr><td colspan="3"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>stemmer<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td>Disable or pass in language shorthand flag (ISO-3166) or a custom object.
    </tr>
    <tr></tr>
    <tr>
        <td>filter<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td>Disable or pass in language shorthand flag (ISO-3166) or a custom array.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>matcher<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td>Disable or pass in language shorthand flag (ISO-3166) or a custom array.</td>
    </tr>
</table>

<a name="options-search"></a>
### Search Options

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>limit</td>
        <td>number</td>
        <td>Sets the limit of results.</td>
        <td>100</td>
    </tr>
    <tr></tr>
    <tr>
        <td>offset</td>
        <td>number</td>
        <td>Apply offset (skip items).</td>
        <td>0</td>
    </tr>
    <tr></tr>
    <tr>
        <td>suggest</td>
        <td>Boolean</td>
        <td>Enables <a href="#suggestions">suggestions</a> in results.</td>
        <td>false</td>
    </tr>
</table>

<a name="options-field-search"></a>
### Document Search Options

* Additionally, to the Index search options above.

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>index</td>
        <td>String<br>Array&lt;String&gt;<br>Array&lt;Object&gt;</td>
        <td>Sets the <a href="#docs">document fields</a> which should be searched. When no field is set, all fields will be searched. <a href="#options-field-search">Custom options per field</a> are also supported.</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>tag</td>
        <td>String<br>Array&lt;String></td>
        <td>Sets the <a href="#docs">document fields</a> which should be searched. When no field is set, all fields will be searched. <a href="#options-field-search">Custom options per field</a> are also supported.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>enrich</td>
        <td>Boolean</td>
        <td>Enrich IDs from the results with the corresponding documents.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>bool</td>
        <td>"and"<br>"or"</td>
        <td>Sets the used <a href="#operators">logical operator</a> when searching through multiple fields or tags.</td>
        <td>"or"</td>
    </tr>
</table>

<a name="tokenizer"></a>
## Tokenizer (Prefix Search)

Tokenizer affects the required memory also as query time and flexibility of partial matches. Try to choose the most upper of these tokenizer which fits your needs:

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>Example</td>
        <td>Memory Factor (n = length of word)</td>
    </tr>
    <tr>
        <td><b>"strict"</b></td>
        <td>index whole words</td>
        <td><code>foobar</code></td>
        <td>* 1</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"forward"</b></td>
        <td>incrementally index words in forward direction</td>
        <td><code>fo</code>obar<br><code>foob</code>ar<br></td>
        <td>* n</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"reverse"</b></td>
        <td>incrementally index words in both directions</td>
        <td>foob<code>ar</code><br>fo<code>obar</code></td>
        <td>* 2n - 1</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"full"</b></td>
        <td>index every possible combination</td>
        <td>fo<code>oba</code>r<br>f<code>oob</code>ar</td>
        <td>* n * (n - 1)</td>
    </tr>
</table>

<a name="phonetic"></a>
## Encoders

Encoding affects the required memory also as query time and phonetic matches. Try to choose the most upper of these encoders which fits your needs, or pass in a <a href="#flexsearch.encoder">custom encoder</a>:

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>False-Positives</td>
        <td>Compression</td>
    </tr>
    <tr>
        <td><b>false</b></td>
        <td>Turn off encoding</td>
        <td>no</td>
        <td>0%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"default"</b></td>
        <td>Case in-sensitive encoding</td>
        <td>no</td>
        <td>0%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"simple"</b></td>
        <td>Case in-sensitive encoding<br>Charset normalizations</td>
        <td>no</td>
        <td>~ 3%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"balance"</b></td>
        <td>Case in-sensitive encoding<br>Charset normalizations<br>Literal transformations</td>
        <td>no</td>
        <td>~ 30%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"advanced"</b></td>
        <td>Case in-sensitive encoding<br>Charset normalizations<br>Literal transformations<br>Phonetic normalizations</td>
        <td>no</td>
        <td>~ 40%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"extra"</b></td>
        <td>Case in-sensitive encoding<br>Charset normalizations<br>Literal transformations<br>Phonetic normalizations<br>Soundex transformations</td>
        <td>yes</td>
        <td>~ 65%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>function()</b></td>
        <td>Pass custom encoding via <i>function(string):[words]</i></td>
        <td></td>
        <td></td>
    </tr>
</table>

## Usage

<a name="flexsearch.create"></a>
#### Create a new index

```js
var index = new Index();
```

Create a new index and choosing one of the presets:

```js
var index = new Index("performance");
```

Create a new index with custom options:

```js
var index = new Index({
    charset: "latin:extra",
    tokenize: "reverse",
    resolution: 9
});
```

Create a new index and extend a preset with custom options:

```js
var index = new FlexSearch({
    preset: "memory",
    tokenize: "forward",
    resolution: 5
});
```

The resolution refers to the maximum count of scoring slots on which the content is divided into.

> A formula to determine a well-balanced value for the `resolution` is: $2*floor(\sqrt{content.length})$ where content is the value pushed by `index.add()`. Here the maximum length of all contents should be used.

<a href="#options">See all available custom options.</a>

<a name="index.add"></a>
#### Add text item to an index

Every content which should be added to the index needs an ID. When your content has no ID, then you need to create one by passing an index or count or something else as an ID (a value from type `number` is highly recommended). Those IDs are unique references to a given content. This is important when you update or adding over content through existing IDs. When referencing is not a concern, you can simply use something simple like `count++`.

> Index.__add(id, string)__

```js
index.add(0, "John Doe");
```

<a name="index.search"></a>
#### Search items

> Index.__search(string | options, \<limit\>, \<options\>)__

```js
index.search("John");
```

Limit the result:

```js
index.search("John", 10);
```

#### Check existence of already indexed IDs

You can check if an ID was already indexed by:

```js
if(index.contain(1)){
    console.log("ID is already in index");
}
```

<a name="async_search"></a>
## Async

You can call each method in its async version, e.g. `index.addAsync` or `index.searchAsync`.

You can assign callbacks to each async function:

```js
index.addAsync(id, content, function(){
    console.log("Task Done");
});

index.searchAsync(query, function(result){
    console.log("Results: ", result);
});
```

Or do not pass a callback function and getting back a `Promise` instead:

```js
index.addAsync(id, content).then(function(){
    console.log("Task Done");
});

index.searchAsync(query).then(function(result){
    console.log("Results: ", result);
});
```

Or use `async` and `await`:

```js
async function add(){
    await index.addAsync(id, content);
    console.log("Task Done");
}

async function search(){
    const results = await index.searchAsync(query);
    console.log("Results: ", result);
}
```

## Append Contents (*deprecated)

You can append contents to an existing index like:

```js
index.append(id, content);
```

This will not overwrite the old indexed contents as it will do when perform `index.update(id, content)`. Keep in mind that `index.add(id, content)` will also perform "update" under the hood when the id was already being indexed.

Appended contents will have their own context and also their own full `resolution`. Therefore, the relevance isn't being stacked but gets its own context.

Let us take this example:

```js
index.add(0, "some index");
index.append(0, "some appended content");

index.add(1, "some text");
index.append(1, "index appended content");
```

When you query `index.search("index")` then you will get index id 1 as the first entry in the result, because the context starts from zero for the appended data (isn't stacked to the old context) and here "index" is the first term.

If you didn't want this behavior than just use the standard `index.add(id, content)` and provide the full length of content.

<a name="index.update"></a>
#### Update item from an index

> Index.__update(id, string)__

```js
index.update(0, "Max Miller");
```

<a name="index.remove"></a>
#### Remove item from an index

> Index.__remove(id)__

```js
index.remove(0);
```

<a name="flexsearch.tokenizer"></a>
#### Add custom tokenizer

> A tokenizer split words/terms into components or partials.

Define a private custom tokenizer during creation/initialization:
```js
var index = new FlexSearch({

    tokenize: function(str){

        return str.split(/\s-\//g);
    }
});
```

> The tokenizer function gets a string as a parameter and has to return an array of strings representing a word or term. In some languages every char is a term and also not separated via whitespaces.

<a name="flexsearch.language"></a>
#### Add language-specific stemmer and/or filter

> __Stemmer:__ several linguistic mutations of the same word (e.g. "run" and "running")

> __Filter:__ a blacklist of words to be filtered out from indexing at all (e.g. "and", "to" or "be")

Assign a private custom stemmer or filter during creation/initialization:
```js
var index = new FlexSearch({

    stemmer: {

        // object {key: replacement}
        "ational": "ate",
        "tional": "tion",
        "enci": "ence",
        "ing": ""
    },
    filter: [

        // array blacklist
        "in",
        "into",
        "is",
        "isn't",
        "it",
        "it's"
    ]
});
```

Using a custom filter, e.g.:
```js
var index = new FlexSearch({

    filter: function(value){

        // just add values with length > 1 to the index

        return value.length > 1;
    }
});
```

Or assign stemmer/filters globally to a language:

> Stemmer are passed as a object (key-value-pair), filter as an array.

```js
FlexSearch.registerLanguage("us", {

    stemmer: { /* ... */ },
    filter:  [ /* ... */ ]
});
```

Or use some pre-defined stemmer or filter of your preferred languages:
```html
<html>
<head>
    <script src="js/flexsearch.bundle.js"></script>
    <script src="js/lang/en.min.js"></script>
    <script src="js/lang/de.min.js"></script>
</head>
...
```

Now you can assign built-in stemmer during creation/initialization:
```js
var index_en = new FlexSearch.Index({
    language: "en"
});

var index_de = new FlexSearch.Index({
    language: "de"
});
```

In Node.js all built-in language packs files are available:

```js
const { Index } = require("flexsearch");

var index_en = new Index({
    language: "en"
});
```

<a name="rtl"></a>
### Right-To-Left Support

> Set the tokenizer at least to "reverse" or "full" when using RTL.

Just set the field "rtl" to _true_ and use a compatible tokenizer:

```js
var index = new Index({
    encode: str => str.toLowerCase().split(/[^a-z]+/),
    tokenize: "reverse",
    rtl: true
});
```

<a name="cjk"></a>
### CJK Word Break (Chinese, Japanese, Korean)

Set a custom tokenizer which fits your needs, e.g.:

```js
var index = FlexSearch.create({
    encode: str => str.replace(/[\x00-\x7F]/g, "").split("")
});
```

You can also pass a custom encoder function to apply some linguistic transformations.

```js
index.add(0, "一个单词");
```

```js
var results = index.search("单词");
```

<a name="docs"></a>
## Index Documents (Field-Search)

### The Document Descriptor

Assuming our document has a data structure like this:

```json
{ 
    "id": 0, 
    "content": "some text"
}
```

Old syntax FlexSearch v0.6.3 (___not supported anymore!___):

```js
const index = new Document({
    doc: {
        id: "id",
        field: ["content"]
    }
});
```

> The document descriptor has slightly changed, there is no `field` branch anymore, instead just apply one level higher, so `key` becomes a main member of options.

For the new syntax the field "doc" was renamed to `document` and the field "field" was renamed to `index`:

```js
const index = new Document({
    document: {
        id: "id",
        index: ["content"]
    }
});

index.add({ 
    id: 0, 
    content: "some text"
});
```

The field `id` describes where the ID or unique key lives inside your documents. The default key gets the value `id` by default when not passed, so you can shorten the example from above to:

```js
const index = new Document({
    document: {
        index: ["content"]
    }
});
```

The member `index` has a list of fields which you want to be indexed from your documents. When just selecting one field, then you can pass a string. When also using default key `id` then this shortens to just:

```js
const index = new Document({ document: "content" });
index.add({ id: 0, content: "some text" });
```

Assuming you have several fields, you can add multiple fields to the index:

```js
var docs = [{
    id: 0,
    title: "Title A",
    content: "Body A"
},{
    id: 1,
    title: "Title B",
    content: "Body B"
}];
```

```js
const index = new Document({
    id: "id",
    index: ["title", "content"]
});
```

You can pass custom options for each field:

```js
const index = new Document({
    id: "id",
    index: [{
        field: "title",
        tokenize: "forward",
        optimize: true,
        resolution: 9
    },{
        field:  "content",
        tokenize: "strict",
        optimize: true,
        resolution: 5,
        minlength: 3,
        context: {
            depth: 1,
            resolution: 3
        }
    }]
});
```

Field options gets inherited when also global options was passed, e.g.:

```js
const index = new Document({
    tokenize: "strict",
    optimize: true,
    resolution: 9,
    document: {
        id: "id",
        index:[{
            field: "title",
            tokenize: "forward"
        },{
            field: "content",
            minlength: 3,
            context: {
                depth: 1,
                resolution: 3
            }
        }]
    }
});
```

Note: The context options from the field "content" also gets inherited by the corresponding field options, whereas this field options was inherited by the global option.

### Nested Data Fields (Complex Objects)

Assume the document array looks more complex (has nested branches etc.), e.g.:

```json
{
  "record": {
    "id": 0,
    "title": "some title",
    "content": {
      "header": "some text",
      "footer": "some text"
    }
  }
}
```

Then use the colon separated notation `root:child:child` to define hierarchy within the document descriptor:

```js
const index = new Document({
    document: {
        id: "record:id",
        index: [
            "record:title",
            "record:content:header",
            "record:content:footer"
        ]
    }
});
```
> Just add fields you want to query against. Do not add fields to the index, you just need in the result (but did not query against). For this purpose you can store documents independently of its index (read below).

When you want to query through a field you have to pass the exact key of the field you have defined in the `doc` as a field name (with colon syntax):

```js
index.search(query, {
    index: [
        "record:title",
        "record:content:header",
        "record:content:footer"
    ]
});
```

Same as:

```js
index.search(query, [
    "record:title",
    "record:content:header",
    "record:content:footer"
]);
```

Using field-specific options:

```js
index.search([{
    field: "record:title",
    query: "some query",
    limit: 100,
    suggest: true
},{
    field: "record:title",
    query: "some other query",
    limit: 100,
    suggest: true
}]);
```

You can perform a search through the same field with different queries.

> When passing field-specific options you need to provide the full configuration for each field. They get not inherited like the document descriptor.

### Complex Documents

You need to follow 2 rules for your documents:

1. The document cannot start with an Array at the root index. This will introduce sequential data and isn't supported yet. See below for a workaround for such data.

```js
[ // <-- not allowed as document start!
  {
    "id": 0,
    "title": "title"
  }
]
```

2. The id can't be nested inside an array (also none of the parent fields can't be an array). This will introduce sequential data and isn't supported yet. See below for a workaround for such data.

```js
{
  "records": [ // <-- not allowed when ID or tag lives inside!
    {
      "id": 0,
      "title": "title"
    }
  ]
}
```

Here an example for a supported complex document:

```json
{
  "meta": {
    "tag": "cat",
    "id": 0
  },
  "contents": [
    {
      "body": {
        "title": "some title",
        "footer": "some text"
      },
      "keywords": ["some", "key", "words"]
    },
    {
      "body": {
        "title": "some title",
        "footer": "some text"
      },
      "keywords": ["some", "key", "words"]
    }
  ]
}
```

The corresponding document descriptor (when all fields should be indexed) looks like:

```js
const index = new Document({
    document: {
        id: "meta:id",
        tag: "meta:tag",
        index: [
            "contents[]:body:title",
            "contents[]:body:footer",
            "contents[]:keywords"
        ]
    }
});
```

Again, when searching you have to use the same colon-separated-string from your field definition.

```js
index.search(query, { 
    index: "contents[]:body:title"
});
```

### Not Supported Documents (Sequential Data)

This example breaks both rules from above:

```js
[ // <-- not allowed as document start!
  {
    "tag": "cat",
    "records": [ // <-- not allowed when ID or tag lives inside!
      {
        "id": 0,
        "body": {
          "title": "some title",
          "footer": "some text"
        },
        "keywords": ["some", "key", "words"]
      },
      {
        "id": 1,
        "body": {
          "title": "some title",
          "footer": "some text"
        },
        "keywords": ["some", "key", "words"]
      }
    ]
  }
]
```

You need to apply some kind of structure normalization.

A workaround to such a data structure looks like this:

```js
const index = new Document({
    document: {
        id: "record:id",
        tag: "tag",
        index: [
            "record:body:title",
            "record:body:footer",
            "record:body:keywords"
        ]
    }
});

function add(sequential_data){

    for(let x = 0, data; x < sequential_data.length; x++){

        data = sequential_data[x];

        for(let y = 0, record; y < data.records.length; y++){

            record = data.records[y];

            index.add({
                id: record.id,
                tag: data.tag,
                record: record
            });
        }
    }  
}

// now just use add() helper method as usual:

add([{
    // sequential structured data
    // take the data example above
}]);
```

You can skip the first loop when your document data has just one index as the outer array.

### Add/Update/Remove Documents to/from the Index

Add a document to the index:

```js
index.add({
            id: 0,
            title: "Foo",
            content: "Bar"
          });
```

Update index with a single object or an array of objects:

```js
index.update({
    data:{
        id: 0,
        title: "Foo",
        body: {
            content: "Bar"
        }
    }
});
```

Remove a single object or an array of objects from the index:

```js
index.remove(docs);
```

When the id is known, you can also simply remove by (faster):

```js
index.remove(id);
```

### Join / Append Arrays

On the complex example above, the field `keywords` is an array but here the markup did not have brackets like `keywords[]`. That will also detect the array but instead of appending each entry to a new context, the array will be joined into on large string and added to the index.

The difference of both kinds of adding array contents is the relevance when searching. When adding each item of an array via `append()` to its own context by using the syntax `field[]`, then the relevance of the last entry concurrent with the first entry. When you left the brackets in the notation, it will join the array to one whitespace-separated string. Here the first entry has the highest relevance, whereas the last entry has the lowest relevance.

So assuming the keyword from the example above are pre-sorted by relevance to its popularity, then you want to keep this order (information of relevance). For this purpose do not add brackets to the notation. Otherwise, it would take the entries in a new scoring context (the old order is getting lost).

Also you can left bracket notation for better performance and smaller memory footprint. Use it when you did not need the granularity of relevance by the entries.

### Field-Search

Search through all fields:

```js
index.search(query);
```

Search through a specific field:

```js
index.search(query, { index: "title" });
```

Search through a given set of fields:

```js
index.search(query, { index: ["title", "content"] });
```

Same as:

```js
index.search(query, ["title", "content"]);
```

Pass custom modifiers and queries to each field:

```js
index.search([{
    field: "content",
    query: "some query",
    limit: 100,
    suggest: true
},{
    field: "content",
    query: "some other query",
    limit: 100,
    suggest: true
}]);
```

You can perform a search through the same field with different queries.

<a href="#options-field-search">See all available field-search options.</a>

### The Result Set

Schema of the result-set:

> `fields[] => { field, result[] => { document }}`

The first index is an array of fields the query was applied to. Each of this field has a record (object) with 2 properties "field" and "result". The "result" is also an array and includes the result for this specific field. The result could be an array of IDs or as enriched with stored document data.

A non-enriched result set now looks like:

```js
[{
    field: "title",
    result: [0, 1, 2]
},{
    field: "content",
    result: [3, 4, 5]
}]
```

An enriched result set now looks like:

```js
[{
    field: "title",
    result: [
        { id: 0, doc: { /* document */ }},
        { id: 1, doc: { /* document */ }},
        { id: 2, doc: { /* document */ }}
    ]
},{
    field: "content",
    result: [
        { id: 3, doc: { /* document */ }},
        { id: 4, doc: { /* document */ }},
        { id: 5, doc: { /* document */ }}
    ]
}]
```

When using `pluck` instead of "field" you can explicitly select just one field and get back a flat representation:

```js
index.search(query, { pluck: "title", enrich: true });
```

```js
[
    { id: 0, doc: { /* document */ }},
    { id: 1, doc: { /* document */ }},
    { id: 2, doc: { /* document */ }}
]
```

This result set is a replacement of "boolean search". Instead of applying your bool logic to a nested object, you can apply your logic by yourself on top of the result-set dynamically. This opens hugely capabilities on how you process the results. Therefore, the results from the fields aren't squashed into one result anymore. That keeps some important information, like the name of the field as well as the relevance of each field results which didn't get mixed anymore.

> A field search will apply a query with the boolean "or" logic by default. Each field has its own result to the given query.

There is one situation where the `bool` property is being still supported. When you like to switch the default "or" logic from the field search into "and", e.g.:

```js
index.search(query, { 
    index: ["title", "content"],
    bool: "and" 
});
```

You will just get results which contains the query in both fields. That's it.

### Tags

Like the `key` for the ID just define the path to the tag:

```js
const index = new Document({
    document: { 
        id: "id",
        tag: "tag",
        index: "content"
    }
});
```

```js
index.add({
    id: 0,
    tag: "cat",
    content: "Some content ..."
});
```

Your data also can have multiple tags as an array:

```js
index.add({
    id: 1,
    tag: ["animal", "dog"],
    content: "Some content ..."
});
```

You can perform a tag-specific search by:

```js
index.search(query, { 
    index: "content",
    tag: "animal" 
});
```

This just gives you result which was tagged with the given tag.

Use multiple tags when searching:

```js
index.search(query, { 
    index: "content",
    tag: ["cat", "dog"]
});
```

This gives you result which are tagged with one of the given tag.

> Multiple tags will apply as the boolean "or" by default. It just needs one of the tags to be existing.

This is another situation where the `bool` property is still supported. When you like to switch the default "or" logic from the tag search into "and", e.g.:

```js
index.search(query, { 
    index: "content",
    tag: ["dog", "animal"],
    bool: "and"
});
```

You will just get results which contains both tags (in this example there is just one records which has the tag "dog" and "animal").

### Tag Search

You can also fetch results from one or more tags when no query was passed:

```js
index.search({ tag: ["cat", "dog"] });
```

In this case the result-set looks like:

```js
[{
    tag: "cat",
    result: [ /* all cats */ ]
},{
    tag: "dog",
    result: [ /* all dogs */ ]
}]
```

### Limit & Offset

> By default, every query is limited to 100 entries. Unbounded queries leads into issues. You need to set the limit as an option to adjust the size.

You can set the limit and the offset for each query:

```js
index.search(query, { limit: 20, offset: 100 });
```

> You cannot pre-count the size of the result-set. That's a limit by the design of FlexSearch. When you really need a count of all results you are able to page through, then just assign a high enough limit and get back all results and apply your paging offset manually (this works also on server-side). FlexSearch is fast enough that this isn't an issue.

## Document Store

Only a document index can have a store. You can use a document index instead of a flat index to get this functionality also when only storing ID-content-pairs.

You can define independently which fields should be indexed and which fields should be stored. This way you can index fields which should not be included in the search result.

> Do not use a store when: 1. an array of IDs as the result is good enough, or 2. you already have the contents/documents stored elsewhere (outside the index).

> When the `store` attribute was set, you have to include all fields which should be stored explicitly (acts like a whitelist).

> When the `store` attribute was not set, the original document is stored as a fallback.

This will add the whole original content to the store:

```js
const index = new Document({
    document: { 
        index: "content",
        store: true
    }
});

index.add({ id: 0, content: "some text" });
```

### Access documents from internal store

You can get indexed documents from the store:

```js
var data = index.get(1);
```

You can update/change store contents directly without changing the index by:

```js
index.set(1, data);
```

To update the store and also update the index then just use `index.update`, `index.add` or `index.append`.

When you perform a query, weather it is a document index or a flat index, then you will always get back an array of IDs.

Optionally you can enrich the query results automatically with stored contents by:

```js
index.search(query, { enrich: true });
```

Your results look now like:

```js
[{
    id: 0,
    doc: { /* content from store */ }
},{
    id: 1,
    doc: { /* content from store */ }
}]
```

### Configure Storage (Recommended)

This will add just specific fields from a document to the store (the ID isn't necessary to keep in store):

```js
const index = new Document({
    document: {
        index: "content",
        store: ["author", "email"]
    }
});

index.add(id, content);
```

You can configure independently what should being indexed and what should being stored. It is highly recommended to make use of this whenever you can.

Here a useful example of configuring doc and store:

```js
const index = new Document({
    document: { 
        index: "content",
        store: ["author", "email"] 
    }
});

index.add({
    id: 0,
    author: "Jon Doe",
    email: "john@mail.com",
    content: "Some content for the index ..."
});
```

You can query through the contents and will get back the stored values instead:

```js
index.search("some content", { enrich: true });
```

Your results are now looking like:

```js
[{
    field: "content",
    result: [{
        id: 0,
        doc: {
            author: "Jon Doe",
            email: "john@mail.com",
        }
    }]
}]
```

Both field "author" and "email" are not indexed.

<a name="chaining"></a>
### Chaining

Simply chain methods like:

```js
var index = FlexSearch.create()
                      .addMatcher({'â': 'a'})
                      .add(0, 'foo')
                      .add(1, 'bar');
```

```js
index.remove(0).update(1, 'foo').add(2, 'foobar');
```

<a name="contextual"></a>
## Contextual Search

> __Note:__ This feature is disabled by default because of its extended memory usage. Read <a href="#contextual_enable">here</a> get more information about and how to enable.

FlexSearch introduce a new scoring mechanism called __Contextual Search__ which was invented by <a href="https://github.com/ts-thomas" target="_blank">Thomas Wilkerling</a>, the author of this library. A Contextual Search <a href="https://nextapps-de.github.io/flexsearch/bench/" target="_blank">incredibly boost up queries to a complete new level</a> but also requires some additional memory (depending on ___depth___).
The basic idea of this concept is to limit relevance by its context instead of calculating relevance through the whole distance of its corresponding document.
This way contextual search also <a href="https://nextapps-de.github.io/flexsearch/bench/match.html" target="_blank">improves the results of relevance-based queries</a> on a large amount of text data.

<p align="center">
    <img src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/doc/contextual-index.svg?v=4" width="100%">
</p>

<a name="contextual_enable"></a>
## Enable Contextual Scoring

Create an index and use the default context:
```js
var index = new FlexSearch({

    tokenize: "strict",
    context: true
});
```

Create an index and apply custom options for the context:
```js
var index = new FlexSearch({

    tokenize: "strict",
    context: { 
        resolution: 5,
        depth: 3,
        bidirectional: true
    }
});
```

> Only the tokenizer "strict" is actually supported by the contextual index.

> The contextual index requires <a href="#memory">additional amount of memory</a> depending on depth.

<a name="cache"></a>
### Auto-Balanced Cache (By Popularity)

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

<a name="webworker"></a>
## Worker Parallelism (Browser + Node.js)

The new worker model from v0.7.0 is divided into "fields" from the document (1 worker = 1 field index). This way the worker becomes able to solve tasks (subtasks) completely. The downside of this paradigm is they might not have been perfect balanced in storing contents (fields may have different length of contents). On the other hand there is no indication that balancing the storage gives any advantage (they all require the same amount in total).

When using a document index, then just apply the option "worker":
```js
const index = new Document({
    index: ["tag", "name", "title", "text"],
    worker: true
});

index.add({ 
    id: 1, tag: "cat", name: "Tom", title: "some", text: "some" 
}).add({
    id: 2, tag: "dog", name: "Ben", title: "title", text: "content" 
}).add({ 
    id: 3, tag: "cat", name: "Max", title: "to", text: "to" 
}).add({ 
    id: 4, tag: "dog", name: "Tim", title: "index", text: "index" 
});
```

```
Worker 1: { 1: "cat", 2: "dog", 3: "cat", 4: "dog" }
Worker 2: { 1: "Tom", 2: "Ben", 3: "Max", 4: "Tim" }
Worker 3: { 1: "some", 2: "title", 3: "to", 4: "index" }
Worker 4: { 1: "some", 2: "content", 3: "to", 4: "index" }
```

When you perform a field search through all fields then this task is being balanced perfectly through all workers, which can solve their subtasks independently.

### Worker Index

Above we have seen that documents will create worker automatically for each field. You can also create a WorkerIndex directly (same like using `Index` instead of `Document`).

Use as ES6 module:

```js
import WorkerIndex from "./worker/index.js";
const index = new WorkerIndex(options);
index.add(1, "some")
     .add(2, "content")
     .add(3, "to")
     .add(4, "index");
```

Or when bundled version was used instead:

```js
var index = new FlexSearch.Worker(options);
index.add(1, "some")
     .add(2, "content")
     .add(3, "to")
     .add(4, "index");
```

Such a WorkerIndex works pretty much the same as a created instance of `Index`.

> A WorkerIndex only support the `async` variant of all methods. That means when you call `index.search()` on a WorkerIndex this will perform also in async the same way as `index.searchAsync()` will do.

### Worker Threads (Node.js)

The worker model for Node.js is based on "worker threads" and works exactly the same way:

```js
const { Document } = require("flexsearch");

const index = new Document({
    index: ["tag", "name", "title", "text"],
    worker: true
});
```

Or create a single worker instance for a non-document index:

```js
const { Worker } = require("flexsearch");
const index = new Worker({ options });
```

### The Worker Async Model (Best Practices)

A worker will always perform as async. On a query method call you always should handle the returned promise (e.g. use `await`) or pass a callback function as the last parameter.

```js
const index = new Document({
    index: ["tag", "name", "title", "text"],
    worker: true
});
```

All requests and sub-tasks will run in parallel (prioritize "all tasks completed"):

```js
index.searchAsync(query, callback);
index.searchAsync(query, callback);
index.searchAsync(query, callback);
```

Also (prioritize "all tasks completed"):

```js
index.searchAsync(query).then(callback);
index.searchAsync(query).then(callback);
index.searchAsync(query).then(callback);
```

Or when you have just one callback when all requests are done, simply use `Promise.all()` which also prioritize "all tasks completed":

```js
Promise.all([
    index.searchAsync(query),
    index.searchAsync(query),
    index.searchAsync(query)
]).then(callback);
```

Inside the callback of `Promise.all()` you will also get an array of results as the first parameter respectively for each query you put into.

When using `await` you can prioritize the order (prioritize "first task completed") and solve requests one by one and just process the sub-tasks in parallel:

```js
await index.searchAsync(query);
await index.searchAsync(query);
await index.searchAsync(query);
```

Same for `index.add()`, `index.append()`, `index.remove()` or `index.update()`. Here there is a special case which isn't disabled by the library, but you need to keep in mind when using Workers.

When you call the "synced" version on a worker index:

```js
index.add(doc);
index.add(doc);
index.add(doc);
// contents aren't indexed yet,
// they just queued on the message channel 
```

Of course, you can do that but keep in mind that the main thread does not have an additional queue for distributed worker tasks. Running these in a long loop fires content massively to the message channel via `worker.postMessage()` internally. Luckily the browser and Node.js will handle such incoming tasks for you automatically (as long enough free RAM is available). When using the "synced" version on a worker index, the content isn't indexed one line below, because all calls are treated as async by default.

> When adding/updating/removing large bulks of content to the index (or high frequency), it is recommended to use the async version along with `async/await` to keep a low memory footprint during long processes.

<a name="export"></a>

## Export / Import (In-Memory)

### Node.js

> Persistent-Indexes and Worker-Indexes don't support Import/Export.

Export an `Index` or `Document-Index` to the folder `/export/`:

```js
import { promises as fs } from "fs";

await index.export(async function(key, data){
  await fs.writeFile("./export/" + key, data, "utf8");
});
```

Import from folder `/export/` into an `Index` or `Document-Index`:

```js
const index = new Index({/* keep old config and place it here */});

const files = await fs.readdir("./export/");
for(let i = 0; i < files.length; i++){
  const data = await fs.readFile("./export/" + files[i], "utf8");
  await index.import(files[i], data);
}
```

> You'll need to use the same configuration as you used before the export. Any changes on the configuration needs to be re-indexed.

### Browser

```js
index.export(function(key, data){ 
    
    // you need to store both the key and the data!
    // e.g. use the key for the filename and save your data
    
    localStorage.setItem(key, data);
});
```

> The size of the export corresponds to the memory consumption of the library. To reduce export size you have to use a configuration which has less memory footprint (use the table at the bottom to get information about configs and its memory allocation).

When your save routine runs asynchronously you have to use `async/await` or return a promise:

```js
index.export(function(key, data){ 
    
    return new Promise(function(resolve){
        
        // do the saving as async

        resolve();
    });
});
```

Before you can import data, you need to create your index first. For document indexes provide the same document descriptor you used when export the data. This configuration isn't stored in the export.

```js
const index = new Index({/* keep old config and place it here */});
```

To import the data just pass a key and data:

```
const data = localStorage.getItem(key);
index.import(key, data);
```

You need to import every key! Otherwise, your index does not work. You need to store the keys from the export and use this keys for the import (the order of the keys can differ).

> The feature "fastupdate" is automatically disabled on import.

This is just for demonstration and is not recommended, because you might have other keys in your localStorage which aren't supported as an import:

```js
var keys = Object.keys(localStorage);

for(let i = 0, key, data; i < keys.length; i++){
    key = keys[i]
    data = localStorage.getItem(key);
    index.import(key, data);
}
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

## Languages

Language-specific definitions are being divided into two groups:

1. Charset
    1. ___encode___, type: `function(string):string[]`
    2. ___rtl___, type: `boolean`
2. Language
    1. ___matcher___, type: `{string: string}`
    2. ___stemmer___, type: `{string: string}`
    3. ___filter___, type: `string[]`

The charset contains the encoding logic, the language contains stemmer, stopword filter and matchers. Multiple language definitions can use the same charset encoder. Also this separation let you manage different language definitions for special use cases (e.g. names, cities, dialects/slang, etc.).

To fully describe a custom language __on the fly__ you need to pass:

```js
const index = FlexSearch({
    // mandatory:
    encode: (content) => [words],
    // optionally:
    rtl: false,
    stemmer: {},
    matcher: {},
    filter: []
});
```

When passing no parameter it uses the `latin:default` schema by default.

<table>
    <tr></tr>
    <tr>
        <td>Field</td>
        <td>Category</td>
        <td>Description</td>
    </tr>
    <tr>
        <td><b>encode</b></td>
        <td>charset</td>
        <td>The encoder function. Has to return an array of separated words (or an empty string).</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>rtl</b></td>
        <td>charset</td>
        <td>A boolean property which indicates right-to-left encoding.</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>filter</b></td>
        <td>language</td>
        <td>Filter are also known as "stopwords", they completely filter out words from being indexed.</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>stemmer</b></td>
        <td>language</td>
        <td>Stemmer removes word endings and is a kind of "partial normalization". A word ending just matched when the word length is bigger than the matched partial.</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>matcher</b></td>
        <td>language</td>
        <td>Matcher replaces all occurrences of a given string regardless of its position and is also a kind of "partial normalization".</td>
    </tr>
</table>

### 1. Language Packs: ES6 Modules

The most simple way to assign charset/language specific encoding via modules is:

```js
import charset from "./dist/module/lang/latin/advanced.js";
import lang from "./dist/module/lang/en.js";

const index = FlexSearch({
    charset: charset,
    lang: lang
});
```

Just import the __default export__ by each module and assign them accordingly.

The full qualified example from above is:

```js
import { encode, rtl } from "./dist/module/lang/latin/advanced.js";
import { stemmer, filter, matcher } from "./dist/module/lang/en.js";

const index = FlexSearch({
    encode: encode,
    rtl: rtl,
    stemmer: stemmer,
    matcher: matcher,
    filter: filter
});
```

The example above is the standard interface which is at least exported from each charset/language.

You can also define the encoder directly and left all other options:

```js
import simple from "./dist/module/lang/latin/simple.js";

const index = FlexSearch({
    encode: simple
});
```

#### Available Latin Encoders

1. default
2. simple
3. balance
4. advanced
5. extra

You can assign a charset by passing the charset during initialization, e.g. `charset: "latin"` for the default charset encoder or `charset: "latin:soundex"` for a encoder variant.

#### Dialect / Slang

Language definitions (especially matchers) also could be used to normalize dialect and slang of a specific language.

### 2. Language Packs: ES5 (Language Packs)

You need to make the charset and/or language definitions available by:

1. All charset definitions are included in the `flexsearch.bundle.js` build by default, but no language-specific definitions are included
2. You can load packages located in `/dist/lang/` (files refers to languages, folders are charsets)
3. You can make a custom build

When loading language packs, make sure that the library was loaded before:

```html
<script src="dist/flexsearch.light.js"></script>
<script src="dist/lang/latin/default.min.js"></script>
<script src="dist/lang/en.min.js"></script>
```

When using the full "bundle" version the built-in latin encoders are already included and you just have to load the language file:

```html
<script src="dist/flexsearch.bundle.js"></script>
<script src="dist/lang/en.min.js"></script>
```

Because you loading packs as external packages (non-ES6-modules) you have to initialize them by shortcuts:

```js
const index = FlexSearch({
    charset: "latin:soundex",
    lang: "en"
});
```

> Use the `charset:variant` notation to assign charset and its variants. When just passing the charset without a variant will automatically resolve as `charset:default`.

You can also override existing definitions, e.g.:

```js
const index = FlexSearch({
    charset: "latin",
    lang: "en",
    matcher: {}
});
```

> Passed definitions will __not__ extend default definitions, they will replace them.

When you like to extend a definition just create a new language file and put in all the logic.

#### Encoder Variants

It is pretty straight forward when using an encoder variant:

```html
<script src="dist/flexsearch.light.js"></script>
<script src="dist/lang/latin/advanced.min.js"></script>
<script src="dist/lang/latin/extra.min.js"></script>
<script src="dist/lang/en.min.js"></script>
```

When using the full "bundle" version the built-in latin encoders are already included and you just have to load the language file:

```html
<script src="dist/flexsearch.bundle.js"></script>
<script src="dist/lang/en.min.js"></script>
```

```js
const index_advanced = FlexSearch({
    charset: "latin:advanced"
});

const index_extra = FlexSearch({
    charset: "latin:extra"
});
```

### Partial Tokenizer

In FlexSearch you can't provide your own partial tokenizer, because it is a direct dependency to the core unit. The built-in tokenizer of FlexSearch splits each word into fragments by different patterns:

1. strict (supports contextual index)
2. forward
3. reverse (including forward)
4. full

### Language Processing Pipeline

This is the default pipeline provided by FlexSearch:

<p>
    <img src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch/doc/pipeline.svg?2">
</p>

#### Custom Pipeline

At first take a look into the default pipeline in `src/common.js`. It is very simple and straight forward. The pipeline will process as some sort of inversion of control, the final encoder implementation has to handle charset and also language specific transformations. This workaround has left over from many tests.

Inject the default pipeline by e.g.:

```js
this.pipeline(

    /* string: */ str.toLowerCase(),
    /* normalize: */ false,
    /* split: */ split,
    /* collapse: */ false
);
```

Use the pipeline schema from above to understand the iteration and the difference of pre-encoding and post-encoding. Stemmer and matchers needs to be applied after charset normalization but before language transformations, filters also.

Here is a good example of extending pipelines: `src/lang/latin/extra.js` → `src/lang/latin/advanced.js` → `src/lang/latin/simple.js`.

### How to contribute?

Search for your language in `src/lang/`, if it exists you can extend or provide variants (like dialect/slang). If the language doesn't exist create a new file and check if any of the existing charsets (e.g. latin) fits to your language. When no charset exist, you need to provide a charset as a base for the language.

A new charset should provide at least:

1. `encode` A function which normalize the charset of a passed text content (remove special chars, lingual transformations, etc.) and __returns an array of separated words__. Also stemmer, matcher or stopword filter needs to be applied here. When the language has no words make sure to provide something similar, e.g. each chinese sign could also be a "word". Don't return the whole text content without split.
3. `rtl` A boolean flag which indicates right-to-left encoding

Basically the charset needs just to provide an encoder function along with an indicator for right-to-left encoding:

```js
export function encode(str){ return [str] }
export const rtl = false;
```

## Fuzzy-Search

Fuzzysearch describes a basic concept of how making queries more tolerant. FlexSearch provides several methods to achieve fuzziness:

1. Use a tokenizer: `forward`, `reverse` or `full`
2. Don't forget to use any of the builtin encoder `simple` > `balance` > `advanced` > `extra` > `soundex` (sorted by fuzziness)
3. Use one of the language specific presets e.g. `/lang/en.js` for en-US specific content
4. Enable suggestions by passing the search option `suggest: true`

Additionally, you can apply custom `Mapper`, `Replacer`, `Stemmer`, `Filter` or by assigning a custom `normalize(str)`, `prepare(str)` or `finalize(arr)` function to the Encoder.

### Compare Fuzzy-Search Encoding

Original term which was indexed: "Struldbrugs"

<table>
    <tr>
        <th align="left">Encoder:</th>
        <th><code>LatinExact</code></th>
        <th><code>LatinDefault</code></th>
        <th><code>LatinSimple</code></th>
        <th><code>LatinBalance</code></th>
        <th><code>LatinAdvanced</code></th>
        <th><code>LatinExtra</code></th>
        <th><code>LatinSoundex</code></th>
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

<!--
<a name="compare" id="compare"></a>
## Encoder Matching Comparison

> Reference String: __"Björn-Phillipp Mayer"__

<table>
    <tr><td colspan="5"></td></tr>
    <tr>
        <td>Query</td>
        <td>default</td>
        <td>simple</td>
        <td>advanced</td>
        <td>extra</td>
    </tr>
    <tr>
        <td>björn</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>björ</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>bjorn</td>
        <td>no</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>bjoern</td>
        <td>no</td>
        <td>no</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>philipp</td>
        <td>no</td>
        <td>no</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>filip</td>
        <td>no</td>
        <td>no</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>björnphillip</td>
        <td>no</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>meier</td>
        <td>no</td>
        <td>no</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>björn meier</td>
        <td>no</td>
        <td>no</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>meier fhilip</td>
        <td>no</td>
        <td>no</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>byorn mair</td>
        <td>no</td>
        <td>no</td>
        <td>no</td>
        <td><b>yes</b></td>
    </tr>
    <tr>
        <td><i>(false positives)</i></td>
        <td><b>no</b></td>
        <td><b>no</b></td>
        <td><b>no</b></td>
        <td>yes</td>
    </tr>
</table>
-->

<a name="memory"></a>
## Memory Allocation

The book "Gulliver's Travels Swift Jonathan 1726" was fully indexed for the examples below.

The most memory-optimized meaningful setting will allocate just 1.2 Mb for the whole book indexed! This is probably the most tiny memory footprint you will get from a search library.

```js
import { encode } from "./lang/latin/extra.js";

index = new Index({
    encode: encode,
    tokenize: "strict",
    optimize: true,
    resolution: 1,
    minlength: 3,
    fastupdate: false,
    context: false
});
```

<a name="consumption"></a>
### Memory Consumption

The book "Gulliver's Travels" (Swift Jonathan 1726) was completely indexed for this test:

<!--
<br>
<img src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/doc/memory-comparison.svg?v=2">
-->

### Compare Impact of Memory Allocation

by default a lexical index is very small:<br>
`depth: 0, bidirectional: 0, resolution: 3, minlength: 0` => 2.1 Mb

a higher resolution will increase the memory allocation:<br>
`depth: 0, bidirectional: 0, resolution: 9, minlength: 0` => 2.9 Mb

using the contextual index will increase the memory allocation:<br>
`depth: 1, bidirectional: 0, resolution: 9, minlength: 0` => 12.5 Mb

a higher contextual depth will increase the memory allocation:<br>
`depth: 2, bidirectional: 0, resolution: 9, minlength: 0` => 21.5 Mb

a higher minlength will decrease memory allocation:<br>
`depth: 2, bidirectional: 0, resolution: 9, minlength: 3` => 19.0 Mb

using bidirectional will decrease memory allocation:<br>
`depth: 2, bidirectional: 1, resolution: 9, minlength: 3` => 17.9 Mb

enable the option "fastupdate" will increase memory allocation:<br>
`depth: 2, bidirectional: 1, resolution: 9, minlength: 3` => 6.3 Mb

<a name="presets"></a>
## Presets

1. `memory` (primary optimize for memory)
2. `performance` (primary optimize for performance)
3. `match` (primary optimize for matching)
4. `score` (primary optimize for scoring)
5. `default` (the default balanced profile)

These profiles are covering standard use cases. It is recommended to apply custom configuration instead of using profiles to get the best out for your situation. Every profile could be optimized further to its specific task, e.g. extreme performance optimized configuration or extreme memory and so on.

You can pass a preset during creation/initialization of the index. 

<!--
Compare these presets:
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/matching-presets.html" target="_blank">Relevance Scoring</a><br>
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/benchmark-presets.html" target="_blank">Benchmarks</a>
-->

## Best Practices

### Use numeric IDs

It is recommended to use numeric id values as reference when adding content to the index. The byte length of passed ids influences the memory consumption significantly. If this is not possible you should consider to use a index table and map the ids with indexes, this becomes important especially when using contextual indexes on a large amount of content.

<!--
##### Split Complexity

Whenever you can, try to divide content by categories and add them to its own index, e.g.:

```js
var action = new FlexSearch();
var adventure = new FlexSearch();
var comedy = new FlexSearch();
```

This way you can also provide different settings for each category. This is actually the fastest way to perform a fuzzy search.

To make this workaround more extendable you can use a short helper:

```js
var index = {};

function add(id, cat, content){
    (index[cat] || (
        index[cat] = new FlexSearch
    )).add(id, content);
}

function search(cat, query){
    return index[cat] ?
        index[cat].search(query) : [];
}
```

Add content to the index:
```js
add(1, "action", "Movie Title");
add(2, "adventure", "Movie Title");
add(3, "comedy", "Movie Title");
```

Perform queries:
```js
var results = search("action", "movie title"); // [1]
```

Split indexes by categories improves performance significantly.
-->

---

Copyright 2018-2025 Thomas Wilkerling, Hosted by Nextapps GmbH<br>
Released under the <a href="http://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache 2.0 License</a><br>
