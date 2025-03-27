FlexSearch v0.8: [Overview and Migration Guide](doc/0.8.0.md)
<h1></h1>
<h1>
    <img src="doc/flexsearch-logo-glass-animated.svg" style="max-width: 500px" alt="FlexSearch.js: Next-Generation full-text search library for Browser and Node.js">
    <p></p>
</h1>
<h3>Next-Generation full-text search library for Browser and Node.js</h3>

<a target="_blank" href="https://www.npmjs.com/package/flexsearch"><img src="https://img.shields.io/npm/v/flexsearch.svg"></a>
<img src="https://img.shields.io/badge/build-passing-brightgreen">
<img src="https://img.shields.io/badge/typed-74%25-yellow">
<img src="https://img.shields.io/badge/coverage-91%25-brightgreen">
<a target="_blank" href="https://github.com/nextapps-de/flexsearch/issues"><img src="https://img.shields.io/github/issues/nextapps-de/flexsearch.svg"></a>
<a target="_blank" href="https://github.com/nextapps-de/flexsearch/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/flexsearch.svg"></a>

[Basic Start](#load-library) &ensp;&bull;&ensp; 
[API Reference](#api-overview) &ensp;&bull;&ensp;
<a href="doc/encoder.md">Encoder</a> &ensp;&bull;&ensp;
<a href="doc/document-search.md">Document Search</a> &ensp;&bull;&ensp;
<a href="doc/persistent.md">Persistent Indexes</a> &ensp;&bull;&ensp;
<a href="doc/worker.md">Using Worker</a> &ensp;&bull;&ensp;
<a href="doc/document-search.md#tag-search">Tag Search</a> &ensp;&bull;&ensp;
<a href="doc/resolver.md">Resolver</a> &ensp;&bull;&ensp;
<a href="CHANGELOG.md">Changelog</a>

<!--
> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
-->

## Please Support this Project

FlexSearch has been helping developers around the world build powerful, efficient search functionalities for years. Maintaining and improving the library requires significant time and resources. If you’ve found this project valuable and you're interested in supporting the project, please consider donating. Thanks a lot for your continued support!

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

FlexSearch performs queries up to 1,000,000 times faster <a href="https://nextapps-de.github.io/flexsearch/" target="_blank">compared to other libraries</a> by also providing <a href="https://nextapps-de.github.io/flexsearch/match.html" target="_blank">powerful search capabilities</a> like multi-field search (document search), phonetic transformations, partial matching, tag-search or suggestions.

Bigger workloads are scalable through workers to perform any updates or queries on the index in parallel through dedicated balanced threads.

The latest generation v0.8 introduce [Persistent Indexes](doc/persistent.md), well optimized for scaling of large datasets and running in parallel. All available features was natively ported right into the database engine of your choice.

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

Supported Charsets:
- Latin
- Chinese, Korean, Japanese (CJK)
- Hindi
- Arabic
- Cyrillic
- Greek and Coptic
- Hebrew

Common Code Examples:

- Node.js: [Module (ESM)](example/nodejs-esm)
- Node.js: [CommonJS](example/nodejs-commonjs)
- Browser: [Module (ESM)](example/browser-module)
- Browser: [Legacy Script](example/browser-legacy)

Demos:
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/demo/autocomplete.html" target="_blank">Auto-Complete</a>

<a name="benchmark"></a>
Benchmarks:
- <a href="https://nextapps-de.github.io/flexsearch/" target="_blank">Performance Benchmark</a>
- <a href="https://nextapps-de.github.io/flexsearch/match.html" target="_blank">Matching Benchmark</a>

<details>
<summary>Latest Benchmark Results</summary>

The benchmark was measured in terms per seconds, higher values are better (except the test "Memory").
The memory value refers to the amount of memory which was additionally allocated during search.

<table>
    <tr></tr>
    <tr>
        <th>Library</th>
        <th>Memory</th>
        <th>Query: Single</th>
        <th>Query: Multi</th>
        <th>Query: Large</th>
        <th>Query: Not Found</th>
    </tr>
    <tr>
        <td>flexsearch</td>
        <td align="right">16</td>
        <td align="right">50955718</td>
        <td align="right">11912730</td>
        <td align="right">13981110</td>
        <td align="right">51706499</td>
    </tr>
    <tr></tr>
    <tr>
        <td>jsii</td>
        <td align="right">2188</td>
        <td align="right">13847</td>
        <td align="right">949559</td>
        <td align="right">1635959</td>
        <td align="right">3730307</td>
    </tr>
    <tr></tr>
    <tr>
        <td>wade</td>
        <td align="right">980</td>
        <td align="right">60473</td>
        <td align="right">443214</td>
        <td align="right">419152</td>
        <td align="right">1239372</td>
    </tr>
    <tr></tr>
    <tr>
        <td>js-search</td>
        <td align="right">237</td>
        <td align="right">22982</td>
        <td align="right">383775</td>
        <td align="right">426609</td>
        <td align="right">994803</td>
    </tr>
    <tr></tr>
    <tr>
        <td>minisearch</td>
        <td align="right">4777</td>
        <td align="right">30589</td>
        <td align="right">191657</td>
        <td align="right">5849</td>
        <td align="right">304233</td>
    </tr>
    <tr></tr>
    <tr>
        <td>orama</td>
        <td align="right">5355</td>
        <td align="right">29445</td>
        <td align="right">170231</td>
        <td align="right">4454</td>
        <td align="right">225491</td>
    </tr>
    <tr></tr>
    <tr>
        <td>elasticlunr</td>
        <td align="right">3073</td>
        <td align="right">14326</td>
        <td align="right">48558</td>
        <td align="right">101206</td>
        <td align="right">95840</td>
    </tr>
    <tr></tr>
    <tr>
        <td>lunr</td>
        <td align="right">2443</td>
        <td align="right">11527</td>
        <td align="right">51476</td>
        <td align="right">88858</td>
        <td align="right">103386</td>
    </tr>
    <tr></tr>
    <tr>
        <td>ufuzzy</td>
        <td align="right">13754</td>
        <td align="right">2799</td>
        <td align="right">7788</td>
        <td align="right">58544</td>
        <td align="right">9557</td>
    </tr>
    <tr></tr>
    <tr>
        <td>bm25</td>
        <td align="right">33963</td>
        <td align="right">3903</td>
        <td align="right">4777</td>
        <td align="right">12657</td>
        <td align="right">12471</td>
    </tr>
    <tr></tr>
    <tr>
        <td>fuzzysearch</td>
        <td align="right">300147</td>
        <td align="right">148</td>
        <td align="right">229</td>
        <td align="right">455</td>
        <td align="right">276</td>
    </tr>
    <tr></tr>
    <tr>
        <td>fuse</td>
        <td align="right">247107</td>
        <td align="right">422</td>
        <td align="right">321</td>
        <td align="right">337</td>
        <td align="right">329</td>
    </tr>
</table>

Run Comparison: <a href="https://nextapps-de.github.io/flexsearch/" target="_blank">Performance Benchmark "Gulliver's Travels"</a>

</details>

Extern Projects & Plugins:
- React: https://github.com/angeloashmore/react-use-flexsearch
- Vue: https://github.com/Noction/vue-use-flexsearch
- Gatsby: https://www.gatsbyjs.org/packages/gatsby-plugin-flexsearch/

## Table of contents

> [!TIP]
> You will just need to spend 5 minutes to improve your results significantly by understanding these 3 elementary things about FlexSearch : [Tokenizer](#tokenize), [Encoder](#encoder) and [Suggestions](#suggestion)

- [Load Library (Node.js, ESM, Legacy Browser)](#load-library)
  - [Non-Module Bundles (ES5 Legacy)](#non-module-bundles-es5-legacy)
  - [Module (ESM)](#module-esm)
  - [Node.js](#nodejs)
- [Basic Usage and Variants](#basic-usage-and-variants)
- [API Overview](#api-overview)
- [Options](doc/options.md)
  - [Index Options](doc/options.md)
  - [Document Options](doc/options.md)
  - [Worker Options](doc/options.md)
  - [Persistent Options](doc/options.md)
  - [Encoder Options](doc/options.md)
  - [Resolver Options](doc/options.md)
- [Context Search](#context-search)
- [Document Search (Multi-Field Search)](doc/document-search.md)
- [Multi-Tag Search](doc/document-search.md)
- [Phonetic Search (Fuzzy Search)](doc/fuzzy-search.md)
- [Tokenizer (Partial Search)](#tokenizer-partial-match)
- [Encoder](doc/encoder.md)
  - Universal Charset Collection
  - Latin Charset Encoder Presets
  - Language Specific Preset
  - [Custom Encoder](doc/encoder.md#custom-encoder)
- [Non-Blocking Runtime Balancer (Async)](doc/async.md)
- [Worker Indexes](doc/worker.md)
- [Resolver (Complex Queries)](doc/resolver.md)
  - Boolean Operations (and, or, xor, not)
  - Boost
  - Limit / Offset
  - Resolve
- [Export / Import Indexes](doc/export-import.md)
  - [Fast-Boot Serialization](doc/export-import.md#fast-boot-serialization-for-server-side-rendering-php-python-ruby-rust-java-go-nodejs-)
- [Persistent Indexes](doc/persistent.md)
  - [IndexedDB (Browser)](doc/persistent-indexeddb.md)
  - [Postgres](doc/persistent-postgres.md)
  - [Redis](doc/persistent-redis.md)
  - [MongoDB](doc/persistent-mongodb.md)
  - [SQLite](doc/persistent-sqlite.md)
  - [Clickhouse](doc/persistent-clickhouse.md)
- [Result Highlighting](doc/result-highlighting.md)
- [Common Code Examples (Browser, Node.js)](#common-code-examples)

## Load Library (Node.js, ESM, Legacy Browser)

<!--
> Please do not use the `/src/` folder of this repo. It isn't meant to be used directly, instead it needs [conditional compilation](https://en.wikipedia.org/wiki/Conditional_compilation). You can easily perform a <a href="#builds">custom build</a>, but you shouldn't use the source folder for production. You will need at least any kind of compiler which resolve the compiler flags within the code like [Closure Compiler](https://github.com/google/closure-compiler) (Advanced Compilation) or with [Babel conditional-compile](https://github.com/brianZeng/babel-plugin-conditional-compile) plugin. The `/dist/` folder is containing every version which you probably need including unminified ESM modules.
-->

```bash
npm install flexsearch
```

The **_dist_** folder is located in: `node_modules/flexsearch/dist/`

<details>
<summary>Download Builds</summary>

<table>
    <tr></tr>
    <tr>
        <td>Build</td>
        <td>File</td>
        <td>CDN</td>
    </tr>
    <tr>
        <td>flexsearch.bundle.debug.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/flexsearch.bundle.debug.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.bundle.debug.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.bundle.debug.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.bundle.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/flexsearch.bundle.min.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.bundle.min.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.bundle.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.bundle.module.debug.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/flexsearch.bundle.module.debug.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.bundle.module.debug.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.bundle.module.debug.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.bundle.module.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/flexsearch.bundle.module.min.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.bundle.module.min.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.bundle.module.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.es5.debug.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/flexsearch.es5.debug.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.es5.debug.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.es5.debug.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.es5.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/flexsearch.es5.min.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.es5.min.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.es5.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.debug.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/flexsearch.light.debug.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.light.debug.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.light.debug.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/flexsearch.light.min.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.light.min.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.light.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.module.debug.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/flexsearch.light.module.debug.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.light.module.debug.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.light.module.debug.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.module.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/flexsearch.light.module.min.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.light.module.min.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.1/dist/flexsearch.light.module.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Javascript Modules (ESM)</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/module/" target="_blank">Download</a></td>
        <td><a href="https://github.com/nextapps-de/flexsearch/tree/0.8.1/dist/module" target="_blank">https://github.com/nextapps-de/flexsearch/tree/0.8.1/dist/module</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Javascript Modules Minified (ESM)</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/module-min/" target="_blank">Download</a></td>
        <td><a href="https://github.com/nextapps-de/flexsearch/tree/0.8.1/dist/module-min" target="_blank">https://github.com/nextapps-de/flexsearch/tree/0.8.1/dist/module-min</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Javascript Modules Debug (ESM)</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/0.8.1/dist/module-debug/" target="_blank">Download</a></td>
        <td><a href="https://github.com/nextapps-de/flexsearch/tree/0.8.1/dist/module-debug" target="_blank">https://github.com/nextapps-de/flexsearch/tree/0.8.1/dist/module-debug</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.custom.js</td>
        <td colspan="2"><a href="/doc/custom-builds.md">Read more about "Custom Build"</a></td>
    </tr>
</table>

</details>
<a name="bundles"></a>
<details>
<summary>Compare Bundles: Light, Compact, Bundle</summary>

> The Node.js package includes all features from `flexsearch.bundle.js`.

<table>
    <tr></tr>
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
            <a href="#async">Async Processing</a>
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
            <a href="#contextual">Context Search</a>
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
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#tags">Tag Search</a>
        </td>
        <td>✓</td>
        <td>✓</td>
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
            <a href="#phonetic">Phonetic Search (Fuzzy Search)</a>
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

</details>

> [!TIP]
> All debug versions are providing debug information through the console and gives you helpful advices on certain situations. Do not use them in production, since they are special builds containing extra debugging processes which noticeably reduce performance.

The abbreviations used at the end of the filenames indicates:

- `bundle` All features included, FlexSearch is available on `window.FlexSearch`
- `light` Only basic features are included, FlexSearch is available on `window.FlexSearch`
- `es5` bundle has support for EcmaScript5, FlexSearch is available on `window.FlexSearch`
- `module` indicates that this bundle is a Javascript module (ESM), FlexSearch members are available by `import { Index, Document, Worker, Encoder, Charset } from "./flexsearch.bundle.module.min.js"` or alternatively using the default export `import FlexSearch from "./flexsearch.bundle.module.min.js"`
- `min` bundle is minified
- `debug` bundle has enabled debug mode and contains additional code just for debugging purposes (do not use for production)

## Load Library

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
    import { Index, Document, Encoder, Charset, Resolver, Worker, IndexedDB } 
        from "./dist/flexsearch.bundle.module.min.js";
    const index = new Index(/* ... */);
</script>
```

Use bundled style on non-bundled modules:

```html
<script type="module">
    import { Index, Document, Encoder, Charset, Resolver, Worker, IndexedDB }
        from "./dist/module/bundle.js";
    const index = new Index(/* ... */);
</script>
```

Use non-bundled modules by file default exports:

```html
<script type="module">
    import Index from "./dist/module/index.js";
    import Document from "./dist/module/document.js";
    import Encoder from "./dist/module/encoder.js";
    import Charset from "./dist/module/charset.js";
    import Resolver from "./dist/module/resolver.js";
    import Worker from "./dist/module/worker.js";
    import IndexedDB from "./dist/module/db/indexeddb/db.js";
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
    import Index from "https://unpkg.com/flexsearch@0.8.1/dist/module/index.js";
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
const { Index, Document, Encoder, Charset, Resolver, Worker, IndexedDB } = require("flexsearch");
const index = new Index(/* ... */);
```

When using ESM instead of CommonJS:

```js
import { Index, Document, Encoder, Charset, Resolver, Worker, IndexedDB } from "flexsearch";
const index = new FlexSearch.Index(/* ... */);
```

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

There are 3 types of indexes:

1. `Index` is a flat high performance index which stores id-content-pairs.
2. `Worker` / `WorkerIndex` is also a flat index which stores id-content-pairs but runs in background as a dedicated worker thread.
3. `Document` is multi-field index which can store complex JSON documents (could also exist of worker indexes).

The most of you probably need just one of them according to your scenario. Any of these 3 index type are upgradable to persistent indexes.

The `worker` instance inherits from type `Index` and basically works like a standard FlexSearch Index. A document index is a complex register automatically operating on several of those standard indexes in parallel. Worker-Support in documents needs to be enabled by just passing the appropriate option during creation e.g. `{ worker: true }`.

```js
index.add(id, text);
const result = index.search(text, options);
```

```js
worker.add(id, text);
const result = worker.search(text, options);
```

```js
document.add(doc);
const result = document.search(text, options);
```

Each of these index types have a persistent model (optionally). So, persistent index isn't a new 4th index type, instead it extends the existing ones.

> Every method called on a `Worker` index is treated as async. You will get back a `Promise` or you can provide a callback function as the last parameter additionally.

### Common Code Examples

The documentation will refer to several examples. A list of all examples:

<a name="examples-nodejs"></a>
<details>
<summary>Examples Node.js (CommonJS)</summary>

- [basic](example/nodejs-commonjs/basic)
- [basic-suggestion](example/nodejs-commonjs/basic-suggestion)
- [basic-persistent](example/nodejs-commonjs/basic-persistent)
- [basic-resolver](example/nodejs-commonjs/basic-resolver)
- [basic-worker](example/nodejs-commonjs/basic-worker)
- [basic-worker-extern-config](example/nodejs-commonjs/basic-worker-extern-config)
- [basic-worker-export-import](example/nodejs-commonjs/basic-worker-export-import)
- [basic-export-import](example/nodejs-commonjs/basic-export-import)
- [document](example/nodejs-commonjs/document)
- [document-persistent](example/nodejs-commonjs/document-persistent)
- [document-worker](example/nodejs-commonjs/document-worker)
- [document-worker-extern-config](example/nodejs-commonjs/document-worker-extern-config)
- [document-export-import](example/nodejs-commonjs/document-export-import)
- [document-worker-export-import](example/nodejs-commonjs/document-worker-export-import)
- [language-pack](example/nodejs-commonjs/language-pack)

</details>
<details>
<summary>Examples Node.js (ESM/Module)</summary>

- [basic](example/nodejs-esm/basic)
- [basic-suggestion](example/nodejs-esm/basic-suggestion)
- [basic-persistent](example/nodejs-esm/basic-persistent)
- [basic-resolver](example/nodejs-esm/basic-resolver)
- [basic-worker](example/nodejs-esm/basic-worker)
- [basic-worker-extern-config](example/nodejs-esm/basic-worker-extern-config)
- [basic-worker-export-import](example/nodejs-esm/basic-worker-export-import)
- [basic-export-import](example/nodejs-esm/basic-export-import)
- [document](example/nodejs-esm/document)
- [document-persistent](example/nodejs-esm/document-persistent)
- [document-worker](example/nodejs-esm/document-worker)
- [document-worker-extern-config](example/nodejs-esm/document-worker-extern-config)
- [document-export-import](example/nodejs-esm/document-export-import)
- [document-worker-export-import](example/nodejs-esm/document-worker-export-import)
- [language-pack](example/nodejs-esm/language-pack)s

</details>

<a name="examples-browser"></a>
<details>
<summary>Examples Browser (Legacy)</summary>

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

</details>
<details>
<summary>Examples Browser (ESM/Module)</summary>

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
  
</details>

<a name="api"></a>
## API Overview

Constructors:

- new <a href="#mikado.new">**Index**</a>(\<options\>) : <small>_index_</small>
- new <a href="#mikado.new">**Document**</a>(options) : <small>_document_</small>
- new <a href="#mikado.new">**Worker**</a>(\<options\>) : <small>_worker_</small>
- new <a href="#mikado.new">**Encoder**</a>(\<options\>, \<options\>, ...) : <small>_encoder_</small>
- new <a href="#mikado.new">**Resolver**</a>(\<options\>) : <small>_resolver_</small>
- new <a href="#mikado.new">**IndexedDB**</a>(\<options\>) : <small>_indexeddb_</small>

---

Global Members:

- <a href="#flexsearch.resolver">Charset</a>
- <a href="#flexsearch.persistent">Language</a> (Legacy Browser)

---

`Index` / `Worker`-Index Methods:

- index.<a href="#index.add">__add__</a>(id, string)
- ~~index.<a href="#index.append">__append__</a>(id, string)~~
- index.<a href="#index.update">__update__</a>(id, string)
- index.<a href="#index.remove">__remove__</a>(id)
- index.<a href="#index.search">__search__</a>(string, \<limit\>, \<options\>)
- index.<a href="#index.search">__search__</a>(options)
- index.<a href="#index.searchCache">__searchCache__</a>(...)
- index.<a href="#index.contain">__contain__</a>(id)
- index.<a href="#index.clear">__clear__</a>()
- index.<a href="#index.cleanup">__cleanup__</a>()


- <small>_async_</small> index.<a href="#index.export">__export__</a>(handler)
- <small>_async_</small> index.<a href="#index.import">__import__</a>(key, data)
- <small>_async_</small> index.<a href="#index.serialize">__serialize__</a>(boolean)


- <small>_async_</small> index.<a href="#index.mount">__mount__</a>(db)
- <small>_async_</small> index.<a href="#index.commit">__commit__</a>(boolean)
- <small>_async_</small> index.<a href="#index.destroy">__destroy__</a>()

---

`Document` Methods:

- document.<a href="#document.add">__add__</a>(\<id\>, document)
- ~~document.<a href="#document.append">__append__</a>(\<id\>, document)~~
- document.<a href="#document.update">__update__</a>(\<id\>, document)
- document.<a href="#document.remove">__remove__</a>(id)
- document.<a href="#document.remove">__remove__</a>(document)
- document.<a href="#document.search">__search__</a>(string, \<limit\>, \<options\>)
- document.<a href="#document.search">__search__</a>(options)
- document.<a href="#document.searchCache">__searchCache__</a>(...)
- document.<a href="#document.contain">__contain__</a>(id)
- document.<a href="#document.clear">__clear__</a>()
- document.<a href="#index.cleanup">__cleanup__</a>()
- document.<a href="#document.get">__get__</a>(id)
- document.<a href="#document.get">__set__</a>(\<id\>, document)


- <small>_async_</small> document.<a href="#document.export">__export__</a>(handler)
- <small>_async_</small> document.<a href="#document.import">__import__</a>(key, data)


- <small>_async_</small> document.<a href="#document.mount">__mount__</a>(db)
- <small>_async_</small> document.<a href="#document.commit">__commit__</a>(boolean)
- <small>_async_</small> document.<a href="#document.destroy">__destroy__</a>()

`Document` Properties:

- document.<a href="#document.store">__store__</a>

---

Async Equivalents (Non-Blocking Balanced):

- <small>_async_</small> <a href="#addAsync">.__addAsync__( ... , \<callback\>)</a>
- <small>_async_</small> ~~<a href="#appendAsync">.__appendAsync__( ... , \<callback\>)</a>~~
- <small>_async_</small> <a href="#updateAsync">.__updateAsync__( ... , \<callback\>)</a>
- <small>_async_</small> <a href="#removeAsync">.__removeAsync__( ... , \<callback\>)</a>
- <small>_async_</small> <a href="#searchAsync">.__searchAsync__( ... , \<callback\>)</a>

Async methods will return a `Promise`, additionally you can pass a callback function as the last parameter.

Methods `export` and also `import` are always async as well as every method you call on a Worker-based or Persistent Index.

---

`Encoder` Methods:

- encoder.<a href="#encoder.encode">__encode__</a>(string)
- encoder.<a href="#encoder.assign">__assign__</a>(options, \<options\>, ...)
- encoder.<a href="#encoder.addFilter">__addFilter__</a>(string)
- encoder.<a href="#encoder.addStemmer">__addStemmer__</a>(string => boolean)
- encoder.<a href="#encoder.addMapper">__addMapper__</a>(char, char)
- encoder.<a href="#encoder.addMatcher">__addMatcher__</a>(string, string)
- encoder.<a href="#encoder.addReplacer">__addReplacer__</a>(regex, string)

---

`Resolver` Methods:

- resolver.<a href="#resolver.and">__and__</a>(options)
- resolver.<a href="#resolver.or">__or__</a>(options)
- resolver.<a href="#resolver.xor">__xor__</a>(options)
- resolver.<a href="#resolver.not">__not__</a>(options)
- resolver.<a href="#resolver.boost">__boost__</a>(number)
- resolver.<a href="#resolver.limit">__limit__</a>(number)
- resolver.<a href="#resolver.offset">__offset__</a>(number)
- resolver.<a href="#resolver.resolve">__resolve__</a>(\<options\>)

`Resolver` Properties:

- resolver.<a href="#resolver.result">__result__</a>

---

`StorageInterface` Methods:

- <small>_async_</small> db.<a href="#db.open">__mount__</a>(index, \<options\>)
- <small>_async_</small> db.<a href="#db.open">__open__</a>()
- <small>_async_</small> db.<a href="#db.close">__close__</a>()
- <small>_async_</small> db.<a href="#db.destroy">__destroy__</a>()
- <small>_async_</small> db.<a href="#db.clear">__clear__</a>()

---

`Charset` Encoder Preset:

- Charset.<a href="#charset">__Exact__</a>
- Charset.<a href="#charset">__Default__</a>
- Charset.<a href="#charset">__Normalize__</a>


- Charset.<a href="#charset">__LatinBalance__</a>
- Charset.<a href="#charset">__LatinAdvanced__</a>
- Charset.<a href="#charset">__LatinExtra__</a>
- Charset.<a href="#charset">__LatinSoundex__</a>

---

`Language` Encoder Preset:
- <a href="#charset">__en__</a>
- <a href="#charset">__de__</a>
- <a href="#charset">__fr__</a>

## Options

- [Index Options](doc/options.md#options-index)
- [Context Options](doc/options.md#options-context)
- [Document Options](doc/options.md)
- [Encoder Options](doc/options.md)
- [Resolver Options](doc/options.md)
- [Search Options](doc/options.md)
- [Document Search Options](doc/options.md)
- [Worker Options](doc/options.md)
- [Persistent Options](doc/options.md)

<a name="tokenize"></a>
## Tokenizer (Partial Match)

The tokenizer is one of the most important options and heavily influence:

1. required memory / storage
2. capabilities of partial matches

> [!TIP]
> If you want getting back results of an indexed term "flexsearch" when just typing "flex" or "search" then this is done by choosing a tokenizer.

Try to choose the most upper of these tokenizer which covers your requirements:

<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>Example</td>
        <td>Memory Factor (n = length of term)</td>
    </tr>
    <tr>
        <td><b>"strict"</b><br><b>"exact"</b><br><b>"default"</b></td>
        <td>index the full term</td>
        <td><code>foobar</code></td>
        <td>* 1</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"forward"</b></td>
        <td>index term in forward direction (supports right-to-left by Index option <code>rtl: true</code>)</td>
        <td><code>fo</code>obar<br><code>foob</code>ar<br></td>
        <td>* n</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"reverse"</b><br><b>"bidirectional"</b></td>
        <td>index term in both directions</td>
        <td><code>fo</code>obar<br><code>foob</code>ar<br>foob<code>ar</code><br>fo<code>obar</code></td>
        <td>* 2n - 1</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"full"</b></td>
        <td>index every consecutive partial</td>
        <td>fo<code>oba</code>r<br>f<code>oob</code>ar</td>
        <td>* n * (n - 1)</td>
    </tr>
</table>

<a name="charset"></a>
## Charset Collection

Encoding is one of the most important task and heavily influence:

1. required memory / storage
2. capabilities of phonetic matches (Fuzzy-Search)

<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>Compression Ratio</td>
    </tr>
    <tr>
        <td><code>Exact</code></td>
        <td>Bypass encoding and take exact input</td>
        <td>0%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>Default</code></td>
        <td>Case in-sensitive encoding</td>
        <td>3%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>Normalize</code></td>
        <td>Case in-sensitive encoding<br>Charset normalization</td>
        <td>~ 7%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>LatinBalance</code></td>
        <td>Case in-sensitive encoding<br>Charset normalization<br>Phonetic basic transformation</td>
        <td>~ 30%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>LatinAdvanced</code></td>
        <td>Case in-sensitive encoding<br>Charset normalization<br>Phonetic advanced transformation</td>
        <td>~ 45%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>LatinExtra</code></td>
        <td>Case in-sensitive encoding<br>Charset normalization<br>Soundex-like transformation</td>
        <td>~ 60%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>LatinSoundex</code></td>
        <td>Full Soundex transformation</td>
        <td>~ 70%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>function(str) => [str]</code></td>
        <td>Pass a custom encoding function to the <code>Encoder</code></td>
        <td></td>
    </tr>
</table>

## Basic Usage

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

<!--
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
-->

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

<a name="docs"></a>
## Document Search (Field-Search)

[Read here](doc/document-search.md)

<a name="chaining"></a>
### Chaining

Simply chain methods like:

```js
var index = Index.create().addMatcher({'â': 'a'}).add(0, 'foo').add(1, 'bar');
```

```js
index.remove(0).update(1, 'foo').add(2, 'foobar');
```

<a name="context-search"></a>
## Context Search

The basic idea of this concept is to limit relevance by its context instead of calculating relevance through the whole distance of its corresponding document. The context acts like a bidirectional moving window of 2 pointers (terms) which can initially have a maximum distance of the value passed via option setting `depth` and dynamically growth on search when the query did not match any results.

<p align="center">
    <img src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/doc/contextual-index.svg?v=4" width="100%">
</p>

<a name="contextual_enable"></a>
### Enable Context-Search

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

## Index Memory Allocation

The book "Gulliver's Travels" (Swift Jonathan 1726) was indexed for this test.

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

## Presets

1. `memory` primarily optimized for a small memory footprint
2. `performance` primarily optimized for high performance
3. `match` primarily optimized for matching capabilities
4. `score` primarily optimized for scoring capabilities (order of results)
5. `default` the default balanced profile

These profiles are covering standard use cases. It is recommended to apply custom configuration instead of using profiles to get the best out. Every profile could be optimized further to its specific task, e.g. extreme performance optimized configuration or extreme memory and so on.

You can pass a preset during creation/initialization of the index.

## Best Practices

### Use numeric IDs

It is recommended to use numeric id values as reference when adding content to the index. The byte length of passed ids influences the memory consumption significantly. If this is not possible you should consider to use a index table and map the ids with indexes, this becomes important especially when using contextual indexes on a large amount of content.

---

Copyright 2018-2025 Thomas Wilkerling, Hosted by Nextapps GmbH<br>
Released under the <a href="http://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache 2.0 License</a><br>
