<p align="center">
    <br>
    <img src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/doc/flexsearch.svg" alt="Search Library" width="50%">
    <br><br>
    <a target="_blank" href="https://www.npmjs.com/package/flexsearch"><img src="https://img.shields.io/npm/v/flexsearch.svg"></a>
    <a target="_blank" href="https://travis-ci.org/nextapps-de/flexsearch"><img src="https://travis-ci.org/nextapps-de/flexsearch.svg?branch=master"></a>
    <a target="_blank" href="https://coveralls.io/github/nextapps-de/flexsearch?branch=master"><img src="https://coveralls.io/repos/github/nextapps-de/flexsearch/badge.svg?branch=master&v=0"></a>
    <a target="_blank" href="https://www.codacy.com/app/ts-thomas/FlexSearch?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nextapps-de/flexsearch&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/a896e010f6b4429aa7bc9a89550320a7"/></a>
    <a target="_blank" href="https://github.com/nextapps-de/flexsearch/issues"><img src="https://img.shields.io/github/issues/nextapps-de/flexsearch.svg"></a>
    <a target="_blank" href="https://github.com/nextapps-de/flexsearch/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/flexsearch.svg"></a>
</p>

<h1></h1>
<h3>Web's fastest and most memory-flexible full-text search library with zero dependencies.</h3>

When it comes to raw search speed <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/benchmark.html" target="_blank">FlexSearch outperforms every single searching library out there</a> and also provides flexible search capabilities like multi-field search, phonetic transformations or partial matching. 
Depending on the used <a href="#options">options</a> it also provides the <a href="#memory">most memory-efficient index</a>. FlexSearch introduce a new scoring algorithm called <a href="#contextual">"contextual index"</a> based on a <a href="#dictionary">pre-scored lexical dictionary</a> architecture which actually performs queries up to 1,000,000 times faster compared to other libraries.
FlexSearch also provides you a non-blocking asynchronous processing model as well as web workers to perform any updates or queries on the index in parallel through dedicated balanced threads. 

FlexSearch Server is available here: <a target="_blank" href="https://github.com/nextapps-de/flexsearch-server">https://github.com/nextapps-de/flexsearch-server</a>.

<a href="#installation">Installation Guide</a> &ensp;&bull;&ensp; <a href="#api">API Reference</a> &ensp;&bull;&ensp; <a href="#builds">Custom Builds</a> &ensp;&bull;&ensp; <a target="_blank" href="https://github.com/nextapps-de/flexsearch-server">Flexsearch Server</a> &ensp;&bull;&ensp; <a href="CHANGELOG.md">Changelog</a>

Supported Platforms:
- Browser
- Node.js

Demos:
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/demo/autocomplete.html" target="_blank">Auto-Complete</a>

Library Comparison:
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/benchmark.html" target="_blank">Benchmark "Gulliver's Travels"</a>
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/matching.html" target="_blank">Relevance Scoring</a>
- <a href="#consumption">Memory Consumption</a>

Get Latest (Stable Release):

<table>
    <tr></tr>
    <tr>
        <td>Build</td>
        <td>File</td>
        <td>CDN</td>
    </tr>
    <tr>
        <td>flexsearch.min.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/master/dist/flexsearch.min.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/master/dist/flexsearch.min.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/master/dist/flexsearch.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/master/dist/flexsearch.light.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/master/dist/flexsearch.light.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/master/dist/flexsearch.light.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.compact.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/master/dist/flexsearch.compact.js" target="_blank">Download</a></td>
        <td><a href="https://rawcdn.githack.com/nextapps-de/flexsearch/master/dist/flexsearch.compact.js" target="_blank">https://rawcdn.githack.com/nextapps-de/flexsearch/master/dist/flexsearch.compact.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.custom.js</td>
        <td><a href="#builds">Custom Build</a></td>
        <td></td>
    </tr>
</table>

All Features:
<table>
    <tr></tr>
    <tr>
        <td>Feature</td>
        <td>flexsearch.min.js</td>
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
            <a href="#async_search">Async Search</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#webworker">Web-Workers</a> (not available in Node.js)
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
            <a href="#operators">Logical Operators</a>
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#where">Where / Find</a> / <a href="#tags">Tags</a>
        </td>
        <td>✓</td>
        <td>-</td>
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
            <a href="#pagination">Pagination</a>
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
        <td>-</td>
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
        <td>
            Customizable: Matcher, Encoder, Tokenizer, Stemmer, Filter
        </td>
        <td>✓</td>
        <td>✓</td>
        <td>✓</td>
    </tr>
    <tr>
        <td>File Size (gzip)</td>
        <td>6.6 kb</td>
        <td>4.7 kb</td>
        <td>2.7 kb</td>
    </tr>
</table>

> It is also pretty simple to make <a href="#builds">Custom Builds</a> 

<a name="compare" id="compare"></a>
## Benchmark Ranking 

Comparison: <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/benchmark.html" target="_blank">Benchmark "Gulliver's Travels"</a>

##### Query Test: "Gulliver's Travels"

<table>
    <tr></tr>
    <tr>
        <td>Rank</td>
        <td>Library Name</td>
        <td>Library Version</td>
        <td>Single Phrase (op/s)</td>
        <td>Multi Phrase (op/s)</td>
        <td>Not Found (op/s)</td>
    </tr>
    <tr>
        <td>1</td>
        <td>FlexSearch <a href="#notes">*</a></td>
        <td>0.3.6</td>
        <td><b>363757</b></td>
        <td><b>182603</b></td>
        <td><b>1627219</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>2</td>
        <td>Wade</td>
        <td>0.3.3</td>
        <td><b>899</b></td>
        <td><b>6098</b></td>
        <td><b>214286</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>3</td>
        <td>JS Search</td>
        <td>1.4.2</td>
        <td><b>735</b></td>
        <td><b>8889</b></td>
        <td><b>800000</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>4</td>
        <td>JSii</td>
        <td>1.0</td>
        <td><b>551</b></td>
        <td><b>9970</b></td>
        <td><b>75000</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>5</td>
        <td>Lunr.js</td>
        <td>2.3.5</td>
        <td><b>355</b></td>
        <td><b>1051</b></td>
        <td><b>25000</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>6</td>
        <td>Elasticlunr.js</td>
        <td>0.9.6</td>
        <td><b>327</b></td>
        <td><b>781</b></td>
        <td><b>6667</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>7</td>
        <td>BulkSearch</td>
        <td>0.1.3</td>
        <td><b>265</b></td>
        <td><b>535</b></td>
        <td><b>2778</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>8</td>
        <td>bm25</td>
        <td>0.2</td>
        <td><b>71</b></td>
        <td><b>116</b></td>
        <td><b>2065</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>9</td>
        <td>Fuse</td>
        <td>3.3.0</td>
        <td><b>0.5</b></td>
        <td><b>0.4</b></td>
        <td><b>0.7</b></td>
    </tr>
</table>

<!--
##### Memory Test: "Gulliver's Travels"

<table>
    <tr></tr>
    <tr>
        <td>Rank</td>
        <td>Library Name</td>
        <td>Library Version</td>
        <td>Index Size <a href="#notes">*</a></td>
        <td>Memory Allocation <a href="#notes">**</a></td>
    </tr>
    <tr>
        <td>1</td>
        <td>FlexSearch <a href="#notes">****</a></td>
        <td>0.3.1</td>
        <td>1.33 Mb</td>
        <td>20.31 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>2</td>
        <td>Wade</td>
        <td>0.3.3</td>
        <td>3.18 Mb</td>
        <td>68.53 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>3</td>
        <td>Fuse</td>
        <td>3.3.0</td>
        <td>0.22 Mb</td>
        <td>156.46 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>4</td>
        <td>JSii</td>
        <td>1.0</td>
        <td>8.9 Mb</td>
        <td>81.03 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>5</td>
        <td>bm25</td>
        <td>0.2</td>
        <td>6.95 Mb</td>
        <td>137.88 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>6</td>
        <td>BulkSearch</td>
        <td>0.1.3</td>
        <td>1.53 Mb</td>
        <td>984.30 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>7</td>
        <td>Elasticlunr.js</td>
        <td>0.9.6</td>
        <td>11.83 Mb</td>
        <td>68.69 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>8</td>
        <td>Lunr.js</td>
        <td>2.3.5</td>
        <td>16.24 Mb</td>
        <td>84.73 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>9</td>
        <td>JS Search</td>
        <td>1.4.2</td>
        <td>36.9 Mb</td>
        <td>53.0 kb</td>
    </tr>
</table>
-->

<a name="notes" id="notes"></a>
_* The preset "fast" was used for this test_ <br>
<!--
_* Index Size: The size of memory the index requires_<br>
_** Memory Allocation: The amount of memory which was additionally allocated during a row of 10 queries_<br>
_*** The preset "fast" was used for this test_ <br>
_**** The preset "memory" was used for this test_ 
-->

Run Comparison: <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/benchmark.html" target="_blank">Benchmark "Gulliver's Travels"</a>

<a name="contextual"></a>
## Contextual Search

> __Note:__ This feature is actually not enabled by default. Read <a href="#contextual_enable">here</a> how to enable.

FlexSearch introduce a new scoring mechanism called __Contextual Search__ which was invented by <a href="https://github.com/ts-thomas" target="_blank">Thomas Wilkerling</a>, the author of this library. A Contextual Search <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/benchmark.html" target="_blank">incredibly boost up queries to a complete new level</a> but also requires some additional memory (depending on ___depth___).
The basic idea of this concept is to limit relevance by its context instead of calculating relevance through the whole (unlimited) distance.<!--Imagine you add a text block of some sentences to an index ID. Assuming the query includes a combination of first and last word from this text block, are they really relevant to each other?-->
In this way contextual search also <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/matching.html" target="_blank">improves the results of relevance-based queries</a> on a large amount of text data.

<!--
> "TF-IDF and all kinds of variations (like BM25) is a big mistake in searching algorithms today. They don't provide neither: a meaningful relevance of a term nor the importance of it! Like many pseudo-intelligent algorithms this is also just an example of mathematical stupidity." — Thomas Wilkerling, _Contextual-based Scoring_, 2018
#### Model of context-based scoring
-->

<p align="center">
    <img src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/doc/contextual-index.svg">
</p>

<a name="dictionary"></a>
#### Lexical Pre-Scored Dictionary / Context-based Map
The index consists of an in-memory pre-scored dictionary as its base. The biggest complexity of these algorithm occurs during the calculation of intersections. As a consequence each additional term in the query has a significant potential to increase complexity. A contextual map comes into play __when the query contains more than 1 term__ and increase effect for each additional term by cutting down the complexity for the intersection calculations. Instead of an increase, the complexity is lowered for each additional term. The contextual index itself is also based on a pre-scored dictionary and follows a memory-friendly strategy.

<table>
    <tr></tr>
    <tr>
        <td>Type</td>
        <td>Complexity</td>
    </tr>
    <tr>
        <td>Each single term query:</td>
        <td><i>1</i></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Lexical Pre-Scored Dictionary (Solo):</td>
        <td><i>TERM_COUNT * TERM_MATCHES</i></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Lexical Pre-Scored Dictionary + Context-based Map:</td>
        <td><i>TERM_MATCHES / TERM_COUNT</i></td>
    </tr>
</table>

The complexity for one single term is always 1.

## Compare BulkSearch vs. FlexSearch

<table>
    <tr></tr>
    <tr>
        <td></td>
        <td><b>BulkSearch</b></td>
        <td><b>FlexSearch</b></td>
    </tr>
    <tr>
        <td>Access</td>
        <td>Read-Write optimized index</td>
        <td>Read-Memory optimized index</td>
    </tr>
    <tr></tr>
    <tr>
        <td>Memory</td>
        <td>Large: ~ 1 Mb per 100,000 words</td>
        <td>Tiny: ~ 100 Kb per 100,000 words</td>
    </tr>
    <tr></tr>
    <tr>
        <td>Index Type</td>
        <td>Bulk of encoded string data divided into chunks</td>
        <td><ol><li>Lexical pre-scored dictionary</li><li>Context-based map</li></ol></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Strength</td>
        <td><ul><li>fast adds</li><li>fast updates</li><li>fast removals</li></ul></td>
        <td><ul><li>fast queries</li><li>memory-efficient index</li></ul></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Weaks</td>
        <td><ul><li>less powerful contextual search</li><li>less memory efficient (has to be defragmented from time to time)</li></ul></td>
        <td><ul><li>updating existing / deleting items from index is slow</li><li>adding items to the index optimized for partial matching (tokenize: "forward" / "reverse" / "full") is slow</li></ul></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Pagination</td>
        <td>Yes</td>
        <td>No</td>
    </tr>
    <tr></tr>
    <tr>
        <td>Wildcards</td>
        <td>Yes</td>
        <td>No</td>
    </tr>
    <tr></tr>
    <!--
    <tr>
        <td>Ranked Searching</td>
        <td>Yes</td>
        <td>Yes</td>
    </tr>
    <tr></tr>
    <tr>
        <td>Contextual Search</td>
        <td>Yes</td>
        <td>Yes</td>
    </tr>
    <tr></tr>
    <tr>
        <td>Super-Partial-Matching</td>
        <td>Yes</td>
        <td>Yes</td>
    </tr>
    <tr></tr>
    <tr>
        <td>Auto-balanced Cache</td>
        <td>Yes</td>
        <td>Yes</td>
    </tr>
    <tr></tr>
    <tr>
        <td>WebWorker</td>
        <td>Yes</td>
        <td>Yes</td>
    </tr>
    -->
</table>

Keep in mind that updating __existing__ items or removing items from the index has a significant cost. When existing items of your index needs to be updated/removed continuously then <a href="https://github.com/nextapps-de/bulksearch" target="_blank">BulkSearch</a> may be a better choice.

<a name="installation"></a>
## Installation

#### HTML / Javascript

> Use _flexsearch.min.js_ for production and _flexsearch.js_ for development.

```html
<html>
<head>
    <script src="js/flexsearch.min.js"></script>
</head>
...
```

Use latest from CDN:
```html
<script src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/dist/flexsearch.min.js"></script>
```

Or a specific version:
```html
<script src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.3.51/dist/flexsearch.min.js"></script>
```

AMD:

```javascript
var FlexSearch = require("./flexsearch.js");
```

#### Node.js

```npm
npm install flexsearch
```

In your code include as follows:

```javascript
var FlexSearch = require("flexsearch");
```

Or pass in options when requiring:

```javascript
var index = require("flexsearch").create({/* options */});
```

<a name="api"></a>
## API Overview

Global methods:
- <a href="#flexsearch.create">FlexSearch.__create__(\<options\>)</a>
- <a href="#flexsearch.addmatcher">FlexSearch.__registerMatcher__({_KEY: VALUE_})</a>
- <a href="#flexsearch.register">FlexSearch.__registerEncoder__(name, encoder)</a>
- <a href="#flexsearch.language">FlexSearch.__registerLanguage__(lang, {stemmer:{}, filter:[]})</a>
- <a href="#flexsearch.encode">FlexSearch.__encode__(name, string)</a>

Index methods:
- <a href="#index.add">Index.__add__(id, string)</a>
- <a href="#index.search">Index.__search__(string, \<limit\>, \<callback\>)</a>
- <a href="#index.search">Index.__search__(\<options\>)</a>
- <a href="#index.update">Index.__update__(id, string)</a>
- <a href="#index.remove">Index.__remove__(id)</a>
- <a href="#index.clear">Index.__clear__()</a>
- <a href="#index.destroy">Index.__destroy__()</a>
- <a href="#index.init">Index.__init__(\<options\>)</a>
- <a href="#index.info">Index.__info__()</a>
- <a href="#where">Index.__find__()</a>
- <a href="#where">Index.__where__()</a>
- <a href="#index.addmatcher">Index.__addMatcher__({_KEY: VALUE_})</a>
- <a href="#index.encode">Index.__encode__(string)</a>
- <a href="#index.export">Index.__export__()</a>
- <a href="#index.import">Index.__import__(string)</a>

Index properties:
- <a href="#index.id">Index.__id__</a>
- <a href="#index.length">Index.__length__</a>
- <a href="#index.index">Index.__index__</a>

## Usage

<a name="flexsearch.create"></a>
#### Create a new index

> FlexSearch.__create(\<options\>)__

```js
var index = new FlexSearch();
```

alternatively you can also use:

```js
var index = FlexSearch.create();
```

Create a new index and choosing one of the presets:

```js
var index = new FlexSearch("speed");
```

Create a new index with custom options:

```js
var index = new FlexSearch({

    // default values:

    encode: "balance",
    tokenize: "forward",
    threshold: 0,
    async: false,
    worker: false,
    cache: false
});
```

Create a new index and extend a preset with custom options:

```js
var index = new FlexSearch("memory", {
    encode: "balance",
    tokenize: "forward",
    threshold: 0
});
```

<a href="#options">See all available custom options.</a>

<a name="index.add"></a>
#### Add text item to an index

> Index.__add(id, string)__

```js
index.add(10025, "John Doe");
```
<a name="index.search"></a>
#### Search items

> Index.__search(string | options, \<limit\>, \<callback\>)__

```js
index.search("John");
```

Limit the result:

```js
index.search("John", 10);
```

<a name="async_search"></a>
#### Async Search

Perform queries asynchronously:

```js
index.search("John", function(result){
    
    // array of results
});
```

> Passing a callback always will perform as asynchronous even if the "async" option was not set.

Perform queries asynchronously (Promise-based):

> Make sure the option "async" is enabled on this instance to receive promises.

```js
index.search("John").then(function(result){
    
    // array of results
});
```

Alternatively ES6:

```js
async function search(query){

    const result = await index.search(query);
    
    // ...
}
```

#### Custom Search

Pass custom options for each query:

```js
index.search({

    query: "John",
    limit: 1000,
    threshold: 5, // >= threshold
    depth: 3,     // <= depth
    callback: function(results){
        // ...
    }
});
```

The same from above could also be written as:

```js
index.search("John", {

    limit: 1000,
    threshold: 5,
    depth: 3
    
}, function(results){
    
    // ....
});
```

<a href="#options-search">See all available custom search options.</a>

<a name="pagination"></a>
#### Pagination

FlexSearch is providing a cursor-based pagination which has the ability to inject into the most-inner process. This enables the possibility of many performance improvements.

> The cursor implementation may be changed often. Just take the cursor as it is and do not expect any specific value or format.

To enable pagination you have to pass a ___page___ field within the custom search object (optionally also a ___limit___ as maximum items per page).

Get the first page of results:
```js
var response = index.search("John Doe", {

    limit: 5,
    page: true
});
```

Always when passing a ___page___ within custom search the ___response___ have this format:
```json
{
    "page": "xxx:xxx",
    "next": "xxx:xxx",
    "result": []
}
```

- ___page___ is the pointer to the current page
- ___next___ is the pointer to the next page or ___null___ when no pages are left
- ___result___ yields the searching results

Get the second (next) page of results:
```js
index.search("John Doe", {

    limit: 10,
    page: response.next
});
```

The limit can be modified for each query.

<a name="suggestions"></a>
#### Suggestions

Get also suggestions for a query:

```js
index.search({

    query: "John Doe",
    suggest: true
});
```

When suggestion is enabled all results will be filled up (until limit, default 1000) with similar matches ordered by relevance.

Actually phonetic suggestions are not supported, for that purpose use the encoder and tokenizer which provides similar functionality. Suggestions comes into game when a query has multiple words/phrases. Assume a query contains 3 words. When the index just match 2 of 3 words then normally you will get no results, but with suggestion enabled you will also get results when 2 of 3 words was matched as well 1 of 3 words was matched (depends on the limit), also sorted by relevance.

__Note:__ Is is planned to improve this feature and providing more flexibility.

<a name="index.update"></a>
#### Update item from an index

> Index.__update(id, string)__

```js
index.update(10025, "Road Runner");
```

<a name="index.remove"></a>
#### Remove item from an index

> Index.__remove(id)__

```js
index.remove(10025);
```
<a name="index.clear"></a>
#### Reset index

```js
index.clear();
```

<a name="index.destroy"></a>
#### Destroy the index

```js
index.destroy();
```

<a name="index.init"></a>
#### Re-Initialize the index

> Index.__init(\<options\>)__

Initialize (with same options):
```js
index.init();
```

Initialize with new options:
```js
index.init({

    /* options */
});
```

> Re-initialization will also destroy the old index.

<a name="index.length"></a>
#### Get Length

Get the length of an index:

```js
var length = index.length;
```

<a name="index.index"></a>
#### Get Register

Get the index (register) of an instance:

```js
var index = index.index;
```

The register has the format _"@" + id_.

> Important: Do not modify manually, just use it as read-only.

<a name="flexsearch.addmatcher"></a>
#### Add custom matcher

> FlexSearch.__registerMatcher({_REGEX: REPLACE_})__

Add global matchers for all instances:
```js
FlexSearch.registerMatcher({

    'ä': 'a', // replaces all 'ä' to 'a'
    'ó': 'o',
    '[ûúù]': 'u' // replaces multiple
});
```

<a name="index.addmatcher"></a>
Add private matchers for a specific instance:
```js
index.addMatcher({

    'ä': 'a', // replaces all 'ä' to 'a'
    'ó': 'o',
    '[ûúù]': 'u' // replaces multiple
});
```

<a name="flexsearch.encoder"></a>
#### Add custom encoder

Assign a custom encoder by passing a function during index creation/initialization:
```js
var index = new FlexSearch({

    encode: function(str){
    
        // do something with str ...
        
        return str;
    }
});
```

> The encoder function gets a string as a parameter and has to return the modified string.

Call a custom encoder directly:
```js
var encoded = index.encode("sample text");
```

<a name="flexsearch.register"></a>
#### Register a global encoder

> FlexSearch.__registerEncoder(name, encoder)__

Global encoders can be shared/used by all instances.

```js
FlexSearch.registerEncoder("whitespace", function(str){

    return str.replace(/\s/g, "");
});
```

Initialize index and assign a global encoder:
```js
var index = new FlexSearch({ encode: "whitespace" });
```

Call a global encoder directly:
```js
var encoded = FlexSearch.encode("whitespace", "sample text");
```

#### Mix/Extend multiple encoders

```js
FlexSearch.registerEncoder('mixed', function(str){
  
    str = this.encode("icase", str); // built-in
    str = this.encode("whitespace", str); // custom
    
     // do something additional with str ...
    
    return str;
});
```

<a name="flexsearch.tokenizer"></a>
#### Add custom tokenizer

> A tokenizer split words into components or chunks.

Define a private custom tokenizer during creation/initialization:
```js
var index = new FlexSearch({

    tokenize: function(str){

        return str.split(/\s-\//g);
    }
});
```

> The tokenizer function gets a string as a parameter and has to return an array of strings (parts).

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

Using a custom stemmer, e.g.:
```js
var index = new FlexSearch({

    stemmer: function(value){

        // apply some replacements
        // ...
        
        return value;
    }
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
    <script src="js/flexsearch.min.js"></script>
    <script src="js/lang/en.min.js"></script>
    <script src="js/lang/de.min.js"></script>
</head>
...
```

Now you can assign built-in stemmer during creation/initialization:
```js
var index_en = new FlexSearch({
    stemmer: "en", 
    filter: "en" 
});

var index_de = new FlexSearch({
    stemmer: "de",
    filter: [ /* custom */ ]
});
```

In Node.js you just have to require the language pack files to make them available:

```js
require("flexsearch.js");
require("lang/en.js");
require("lang/de.js");
```

It is also possible to <a href="#builds">compile language packs into the build</a> as follows:

```bash
node compile SUPPORT_LANG_EN=true SUPPORT_LANG_DE=true
```

<a name="rtl"></a>
### Right-To-Left Support

> Set the tokenizer at least to "reverse" or "full" when using RTL.

Just set the field "rtl" to _true_ and use a compatible tokenizer:

```js
var index = FlexSearch.create({
    encode: "icase",
    tokenize: "reverse", 
    rtl: true
});
```

<a name="cjk"></a>
### CJK Word Break (Chinese, Japanese, Korean)

Set a custom tokenizer which fits your needs, e.g.:

```js
var index = FlexSearch.create({
    encode: false,
    tokenize: function(str){
        return str.replace(/[\x00-\x7F]/g, "").split("");
    }
});
```

You can also pass a custom encoder function to apply some linguistic transformations.

```js
index.add(0, "一个单词");
```

```js
var results = index.search("单词");
```

<a name="index.info"></a>
### Get info about an index

> This feature is available in _DEBUG_ mode.

```js
index.info();
```

Returns information e.g.:

```json
{
    "id": 0,
    "memory": 10000,
    "items": 500,
    "sequences": 3000,
    "matchers": 0,
    "chars": 3500,
    "cache": false,
    "matcher": 0,
    "worker": false,
    "threshold": 7,
    "depth": 3,
    "contextual": true                                 
}
```

<a name="docs"></a>
## Index Documents (Field-Search)

#### The Document Descriptor

Assume the document is an array of data like:

```js
var docs = [{
    id: 0,
    title: "Title",
    cat: "Category",
    content: "Body"
},{
    id: 1,
    title: "Title",
    cat: "Category",
    content: "Body"
}];
```

Provide a document descriptor ___doc___ when initializing a new index, e.g. related to the example above:

```js
var index = new FlexSearch({
    tokenize: "strict",
    depth: 3,
    doc: {
        id: "id",
        field: "content"
    }
});
```

The above example will just index the field "content", to index multiple fields pass an array:

```js
var index = new FlexSearch({
    doc: {
        id: "id",
        field: [
            "title",
            "cat",
            "content"
        ]
    }
});
```

You are also able to provide custom presets for each field separately:

```js
var index = new FlexSearch({
    doc: {
        id: "id",
        field: {
            title: {
                encode: "extra",
                tokenize: "reverse",
                threshold: 7
            },
            cat: {
                encode: false,
                tokenize: function(val){
                    return [val];
                }
            },
            content: "memory"
        }
    }
});
```

#### Complex Objects

Assume the document array looks more complex (has nested branches etc.), e.g.:

```js
var docs = [{
    data:{
        id: 0,
        title: "Foo",
        body: {
            content: "Foobar"
        }
    }
},{
    data:{
        id: 1,
        title: "Bar",
        body: {
            content: "Foobar"
        }
    }
}];
```

Then use the colon separated notation ___"root:child:child"___ to define hierarchy within the document descriptor:

```js
var index = new FlexSearch({
    doc: {
        id: "data:id",
        field: [
            "data:title",
            "data:body:content"
        ]
    }
});
```

> __Hint:__ This is an alternative for indexing documents which has nested arrays: <a href="https://github.com/nextapps-de/flexsearch/issues/36">https://github.com/nextapps-de/flexsearch/issues/36</a>

#### Add/Update/Remove Documents to/from the Index

Just pass the document array (or a single object) to the index:

```js
index.add(docs);
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

#### Field-Search

The search gives you several options when using documents.

> The colon notation also has to be applied for the searching respectively.

This will search through all indexed fields:

```js
var results = index.search("body");
```

This will search on a specific field):

```js
var results = index.search({
    field: "title",
    query: "foobar"
});
```

```js
var results = index.search({
    field: "data:body:content",
    query: "foobar"
});
```

This could also be written as:

```js
var results = index.search("foobar", {
    field: "data:body:content",
});
```

Search the same query on multiple fields:

> Using ___bool___ as a logical operator when searching through multiple fields. The default operator when not set is ___"or"___.

```js
var results = index.search({
    query: "foobar",
    field: ["title", "body"],
    bool: "or"
});
```

Could also be written as:

```js
var results = index.search("foobar", {
    field: ["title", "body"],
    bool: "or"
});
```

Search different queries on multiple fields:

```js
var results = index.search([{
    field: "title",
    query: "foo"
},{
    field: "body",
    query: "bar"
}]);
```

<!--
Boost scoring on specific fields:

```js
var results = index.search([{
    field: "title",
    query: "foo",
    boost: 2
},{
    field: "body",
    query: "bar",
    boost: 0.5
}]);
```
-->

<a href="#options-field-search">See all available field-search options.</a>

<a name="operators"></a>
## Logical Operators

There are 3 different operators (and, or, not). Just pass the field ___bool___ in custom search:
```js
var results = index.search([{
    field: "title",
    query: "foobar",
    bool: "and"
},{
    field: "body",
    query: "content",
    bool: "or"
},{
    field: "blacklist",
    query: "xxx",
    bool: "not"
}]);
```

- ___"and"___ indicates to be __required__ in the result
- ___"or"___ indicates to be __optional__ in the result
- ___"not"___ indicates to be __prohibited__ in the result

<a name="where"></a>
## Find / Where

When indexing documents, you are also able to get results by specific attributes.

> The colon notation also has to be applied for using "where" and "find" respectively.

#### Find a document by an attribute

```js
index.find("cat", "comedy");
```

Same as:
```js
index.find({"cat": "comedy"});
```

To get by ID, you can also use short form:
```js
index.find(1);
```

Getting a doc by ID is actually the fastest way to retrieve a result from documents.

Find by a custom function:
```js
index.find(function(item){
    return item.cat === "comedy";
});
```

#### Find documents by multiple attributes

Get just the first result:
```js
index.find({
    cat: "comedy", 
    year: "2018"
});
```

Get all matched results:
```js
index.where({
    cat: "comedy",
    year: "2018"
});
```

Get all results and set a limit:
```js
index.where({
    cat: "comedy",
    year: "2018"
 }, 100);
```

Get all by a custom function:
```js
index.where(function(item){
    return item.cat === "comedy";
});
```

#### Combine fuzzy search with a where-clause

Add some content, e.g.:
```js
index.add([{
    id: 0,
    title: "Foobar",
    cat: "adventure",
    content: "Body"
},{
    id: 1,
    title: "Title",
    cat: "comedy",
    content: "Foobar"
}]);
```

Using search and also apply a where-clause:
```js
index.search("foo", {
    field: [
        "title", 
        "body"
    ],
    where: {
        "cat": "comedy"
    },
    limit: 10
});
```

<a name="tags"></a>
## Tags

> __IMPORTANT NOTICE:__ This feature will be removed due to the lack of scaling and redundancy.

Tagging is pretty much the same like adding an additional index to a database column. Whenever you use ___index.where()___ on an indexed/tagged attribute will really improve performance but also at a cost of some additional memory.

> The colon notation also has to be applied for tags respectively.

Add one single tag to the index:
```js
var index = new FlexSearch({
    doc: {
        id: "id",
        field: ["title", "content"],
        tag: "cat"
    }
});
```

Or add multiple tags to the index:
```js
var index = new FlexSearch({
    doc: {
        id: "id",
        field: ["title", "content"],
        tag: ["cat", "year"]
    }
});
```

Add some content:
```js
index.add([{
    id: 0,
    title: "Foobar",
    cat: "adventure",
    year: "2018",
    content: "Body"
},{
    id: 1,
    title: "Title",
    cat: "comedy",
    year: "2018",
    content: "Foobar"
}]);
```

Find all documents by an attribute:
```js
index.where({"cat": "comedy"}, 10);
```

Since the attribute "cat" was tagged (has its own index) this expression performs really fast. This is actually the fastest way to retrieve multiple results from documents.

Search documents and also apply a where-clause:
```js
index.search("foo", {
    field: [
        "title", 
        "content"
    ],
    where: {
        "cat": "comedy"
    },
    limit: 10
});
```

An additional where-clause has a significant cost. Using the same expression without _where_ performs significantly better (depending on the count of matches).

<a name="sort"></a>
## Custom Sort

> The colon notation also has to be applied for a custom sort respectively.

Sort by an attribute:
```js
var results = index.search("John", {

    limit: 100,
    sort: "data:title"
});
```

> The default sorting order is from lowest to highest.

<!--
Explicitly set sorting direction (from highest to lowest):
```js
sort: ">data:title"
```
-->

Sort by a custom function:
```js
var results = index.search("John", {

    limit: 100,
    sort: function(a, b){
        return (
            a.id < b.id ? -1 : (
                a.id > b.id ? 1 : 0
        ));
    }
});
```

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

<a name="contextual_enable"></a>
## Enable Contextual Scoring

Create an index and just set the limit of relevance as "depth":
```js
var index = new FlexSearch({

    encode: "icase",
    tokenize: "strict",
    threshold: 7,
    depth: 3
});
```

> Only the tokenizer "strict" is actually supported by the contextual index.

> The contextual index requires <a href="#memory">additional amount of memory</a> depending on depth.

> Try to use the __lowest depth__ and __highest threshold__ which fits your needs.

It is possible to modify values for _threshold_ and _depth_ during search (see custom search). The restriction is that the _threshold_ can only be raised, on the other hand the _depth_ can only be lowered.

<a name="cache"></a>
## Enable Auto-Balanced Cache

Create index and just set a limit of cache entries:
```js
var index = new FlexSearch({

    profile: "score",
    cache: 1000
});
```

> When passing a number as a limit the cache automatically balance stored entries related to their popularity.

> When just using "true" the cache is unbounded and perform actually 2-3 times faster (because the balancer do not have to run).

<a name="webworker"></a>
## Web-Worker (Browser only)

Worker get its own dedicated memory and also run in their own dedicated thread without blocking the UI while processing. Especially for larger indexes, web worker improves speed and available memory a lot. FlexSearch index was tested with a 250 Mb text file including 10 Million words. <!--The indexing was done silently in background by multiple parallel running workers in about 7 minutes. The final index reserves ~ 8.2 Mb memory/space. The search result took ~ 0.25 ms.-->

> When the index isn't big enough it is faster to use no web worker.

Create index and just set the count of parallel threads:
```js
var index = new FlexSearch({

    encode: "icase",
    tokenize: "full",
    async: true,
    worker: 4
});
```

Adding items to worker index as usual (async enabled):

```js
index.add(10025, "John Doe");
```

Perform search and simply pass in callback like:

```js
index.search("John Doe", function(results){

    // do something with array of results
});
```

Or use promises accordingly:

```js
index.search("John Doe").then(function(results){

    // do something with array of results
});
```

<a name="options"></a>
## Options

FlexSearch ist highly customizable. Make use of the the right options can really improve your results as well as memory economy and query time.

<a name="options-index"></a>
### Initialize Index
<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>profile<br><br><br><br><br><br></td>
        <td>
            "memory"<br>
            "speed"<br>
            "match"<br>
            "score"<br>
            "balance"<br>
            "fast"
        </td>
        <td vertical-align="top">
            The <a href="#presets">configuration profile</a>. Choose your preferation.<br>
        </td>
    </tr>
    <tr></tr>
    <tr>
        <td>tokenize<br><br><br><br><br><!--<br>--></td>
        <td>
            "strict"<br>
            "forward"<br>
            "reverse"<br>
            <!--"ngram"<br>-->
            "full"<br>
            function()
        </td>
        <td vertical-align="top">
            The <a href="#tokenizer">indexing mode (tokenizer)</a>.<br><br>Choose one of the <a href="#tokenizer">built-ins</a> or pass a <a href="#flexsearch.tokenizer">custom tokenizer function</a>.<br>
        </td>
    </tr>
    <tr></tr>
    <tr>
        <td>split<br><br></td>
        <td>
            RegExp<br>
            string
        </td>
        <td vertical-align="top">
            The rule to split words when using non-custom tokenizer (<a href="#tokenizer">built-ins</a> e.g. "forward"). Use a string/char or use a regular expression (default: <code>/\W+/</code>).<br>
        </td>
    </tr>
    <tr></tr>
    <tr>
        <td>encode<br><br><br><br><br><br><br></td>
        <td>
            false<br>
            "icase"<br>
            "simple"<br>
            "advanced"<br>
            "extra"<br>
            "balance"<br>
            function()
        </td>
        <td>The encoding type.<br><br>Choose one of the <a href="#phonetic">built-ins</a> or pass a <a href="#flexsearch.encoder">custom encoding function</a>.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>cache<br><br><br></td>
        <td>
            false<br>
            true<br>
            {number}
        </td>
        <td>Enable/Disable and/or set capacity of cached entries.<br><br>When passing a number as a limit the <b>cache automatically balance stored entries related to their popularity</b>.<br><br>Note: When just using "true" the cache has no limits and is actually 2-3 times faster (because the balancer do not have to run).</td>
    </tr>
    <tr></tr>
    <tr>
        <td>async<br><br></td>
        <td>
            true<br>
            false
        </td>
        <td>Enable/Disable asynchronous processing.<br><br>Each job will be queued for non-blocking processing. Recommended when using WebWorkers.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>worker<br><br></td>
        <td>
            false<br>
            {number}
        </td>
        <td>Enable/Disable and set count of running worker threads.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>depth<br><br></td>
        <td>
            false<br>
            {number}
        </td>
        <td>Enable/Disable <a href="#contextual">contextual indexing</a> and also sets contextual distance of relevance. Depth is the maximum number of words/tokens away a term to be considered as relevant.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>threshold<br><br></td>
        <td>
            false<br>
            {number}
        </td>
        <td>Enable/Disable the threshold of minimum relevance all results should have.<br><br>Note: It is also possible to set a lower threshold for indexing and pass a higher value when calling <i>index.search(options)</i>.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>resolution</td>
        <td>
            {number}
        </td>
        <td>Sets the scoring resolution (default: 9).</td>
    </tr>
    <tr></tr>
    <tr>
        <td>stemmer<br><br><br></td>
        <td>
            false<br>
            {string}<br>
            {function}
        </td>
        <td>Disable or pass in language shorthand flag (ISO-3166) or a custom object.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>filter<br><br><br></td>
        <td>
            false<br>
            {string}<br>
            {function}
        </td>
        <td>Disable or pass in language shorthand flag (ISO-3166) or a custom array.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>rtl<br><br></td>
        <td>
            true<br>
            false
        </td>
        <td>Enables Right-To-Left encoding.</td>
    </tr>
</table>

<a name="options-search"></a>
### Custom Search

<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>limit</td>
        <td>number</td>
        <td>Sets the limit of results.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>suggest</td>
        <td>true, false</td>
        <td>Enables <a href="#suggestions">suggestions</a> in results.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>where</td>
        <td>object</td>
        <td>Use a <a href="#where">where-clause</a> for non-indexed fields.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>field</td>
        <td>string, Array&lt;string&gt;</td>
        <td>Sets the <a href="#docs">document fields</a> which should be searched. When no field is set, all fields will be searched. <a href="#options-field-search">Custom options per field</a> are also supported.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>bool</td>
        <td>"and", "or"</td>
        <td>Sets the used <a href="#operators">logical operator</a> when searching through multiple fields.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>page</td>
        <td>true, false, cursor</td>
        <td>Enables <a href="#pagination">paginated results</a>.</td>
    </tr>
</table>

You can also override these following <a href="#options-index">index settings</a> via custom search (v0.7.0):

- encode
- split
- tokenize
- threshold
- cache
- async

Custom-Search options will override index options.

<a name="options-field-search"></a>
### Field-Search (v0.7.0)

<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>limit</td>
        <td>number</td>
        <td>Sets the limit of results per field.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>suggest</td>
        <td>true, false</td>
        <td>Enables <a href="#suggestions">suggestions</a> in results per field.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>bool</td>
        <td>"and", "or", "not"</td>
        <td>Sets the used <a href="#operators">logical operator</a> when searching through multiple fields.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>boost</td>
        <td>number</td>
        <td>Enables boosting fields.</td>
    </tr>
</table>

You can also override these following <a href="#options-index">index settings</a> per field via custom field-search:

- encode
- split
- tokenize
- threshold

Field-Search options will override custom-search options and index options.

## Depth, Threshold, Resolution?

Whereas __depth__ is the minimum relevance for the __contextual index__, __threshold__ is the minimum relevance for the __lexical index__. The threshold score is an enhanced variation of a conventional scoring calculation, it uses on document distance and partial distance instead of TF-IDF. The final scoring value is based on <a href="#contextual">3 kinds of distance</a>.

Resolution on the other hand specify the max scoring value. The final score value is an integer value, so resolution affect how many segments the score may have. When the resolution is 1, then there exist just one scoring level for all matched terms. To get more differentiated results you need to raise the resolution.

> The difference of both affects the performance on higher values (complexity = _resolution_ - _threshold_).

The combination of resolution and threshold gives you a good controlling of your matches as well as performance, e.g. when the resolution is 25 and the threshold is 22, then the result only contains matches which are super relevant. The goal should always be just have items in result which are really needed. On top, that also improves performance a lot.

<a name="tokenizer"></a>
## Tokenizer

Tokenizer affects the required memory also as query time and flexibility of partial matches. Try to choose the most upper of these tokenizer which fits your needs:

<table>
    <tr></tr>
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
    <!--
    <tr>
        <td><b>"ngram"</b> (default)</td>
        <td>index words partially through phonetic n-grams</td>
        <td><code>foo</code>bar<br>foo<code>bar</code></td>
        <td>* n / 3</td>
    </tr>
    <tr></tr>
    -->
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
    <tr></tr>
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
        <td>no</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"icase"</b> (default)</td>
        <td>Case in-sensitive encoding</td>
        <td>no</td>
        <td>no</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"simple"</b></td>
        <td>Phonetic normalizations</td>
        <td>no</td>
        <td>~ 7%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"advanced"</b></td>
        <td>Phonetic normalizations + Literal transformations</td>
        <td>no</td>
        <td>~ 35%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"extra"</b></td>
        <td>Phonetic normalizations + Soundex transformations</td>
        <td>yes</td>
        <td>~ 60%</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>function()</b></td>
        <td>Pass custom encoding via <i>function(string):string</i></td>
        <td></td>
        <td></td>
    </tr>
</table>

<a name="compare" id="compare"></a>
#### Encoder Matching Comparison

> Reference String: __"Björn-Phillipp Mayer"__

<table>
    <tr></tr>
    <tr>
        <td>Query</td>
        <td>icase</td>
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

<a name="memory"></a>
## Memory Usage

The required memory for the index depends on several options:

<table>
    <tr></tr>
    <tr>
        <td>Encoding</td>
        <td>Memory usage of every ~ 100,000 indexed word</td>
    </tr>
    <tr>
        <td>false</td>
        <td>260 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>"icase" (default)</td>
        <td>210 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>"simple"</td>
        <td>190 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>"advanced"</td>
        <td>150 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>"extra"</td>
        <td>90 kb</td>
    </tr>
    <tr>
        <td>Mode</td>
        <td>Multiplied with: (n = average length of indexed words)</td>
    </tr>
    <tr>
        <td>"strict"</td>
        <td>* 1</td>
    </tr>
    <!--
    <tr></tr>
    <tr>
        <td>"ngram" (default)</td>
        <td>* n / 3</td>
    </tr>
    -->
    <tr></tr>
    <tr>
        <td>"forward"</td>
        <td>* n</td>
    </tr>
    <tr></tr>
    <tr>
        <td>"reverse"</td>
        <td>* 2n - 1</td>
    </tr>
    <tr></tr>
    <tr>
        <td>"full"</td>
        <td>* n * (n - 1)</td>
    </tr>
    <tr>
        <td>Contextual Index</td>
        <td>Multiply the sum above with:</td>
    </tr>
    <tr>
        <td></td>
        <td>* (depth * 2 + 1)</td>
    </tr>
</table>

Adding, removing or updating existing items has a similar complexity. The contextual index grows exponentially, that's why it is actually just supported for the tokenizer ___"strict"___.

<a name="consumption"></a>
#### Compare Memory Consumption

The book "Gulliver's Travels" (Swift Jonathan 1726) was used for this test.

<br>
<img src="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/doc/memory-comparison.svg">

<a name="presets"></a>
## Presets

You can pass a preset during creation/initialization. They represents these following settings:

__"default"__: Standard profile
```js
{
    encode: "icase",
    tokenize: "forward",
    resolution: 9
}
```

__"memory"__: Memory-optimized profile
```js
{
    encode: "extra",
    tokenize: "strict",
    threshold: 0,
    resolution: 1
}
```

__"speed"__: Speed-optimized profile

```js
{
    encode: "icase",
    tokenize: "strict",
    threshold: 1,
    resolution: 3,
    depth: 2
}
```

__"match"__: Matching-tolerant profile

```js
{
    encode: "extra",
    tokenize: "full",
    threshold: 1,
    resolution: 3
}
```

__"score"__: Relevance-optimized profile

```js
{
    encode: "extra",
    tokenize: "strict",
    threshold: 1,
    resolution: 9,
    depth: 4
}
```

__"balance"__: Most-balanced profile

```js
{
    encode: "balance",
    tokenize: "strict",
    threshold: 0,
    resolution: 3,
    depth: 3
}
```

__"fast"__: Absolute fastest profile

```js
{
    encode: "icase",
    threshold: 8,
    resolution: 9,
    depth: 1
}
```

Compare these presets:
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/matching-presets.html" target="_blank">Relevance Scoring</a><br>
- <a href="https://raw.githack.com/nextapps-de/flexsearch/master/test/benchmark-presets.html" target="_blank">Benchmarks</a>

## Performance Guide

Methods to retrieve results sorted from fastest to slowest:

1. `index.find(id) -> doc`
2. `index.where({field: string}) -> Arrary<doc>` with a tag on the same field
3. `index.search(query) -> Arrary<id>` when just adding _id_ and _content_ to the index (no documents)
4. `index.search(query) -> Arrary<doc>` when using documents
5. `index.search(query, { where }) -> Arrary<doc>` when using documents and a where clause
6. `index.where({field: [string, string]}) -> Arrary<doc>` when a tag was set to one of two fields
7. `index.where({field: string}) -> Arrary<doc>` when no tag was set to this field

Methods to change index from fastest to slowest:

1. `index.add(id, string)`
2. `index.add(docs)`
3. `index.delete(id, string)`
4. `index.delete(docs)`
5. `index.update(id, string)`
6. `index.update(docs)`

Performance Checklist:

- Using just id-content-pairs for the index performs almost faster than using docs
- An additional where-clause in `index.search()` has a significant cost
- When adding multiple fields of documents to the index try to set the lowest possible preset for each field separately
- Make sure the auto-balanced ___cache___ is enabled and has a meaningful value
- Using `index.where()` to find documents is very slow when not using a tagged field
- Getting a document by ID via `index.find(id)` is extremely fast
- Do not enable ___async___ as well as ___worker___ when the index does not claim it
- Use numeric IDs (the datatype length of IDs influences the memory consumption significantly)
- Try to enable _contextual index_ by setting the ___depth___ to a minimum meaningful value and tokenizer to ___"strict"___
- Pass a ___limit___ when searching (lower values performs better)
- Pass a minimum ___threshold___ when searching (higher values performs better)
- Try to minify the content size of indexed documents by just adding attributes you really need to get back from results

## Best Practices

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
var results = search("action", "movie title"); // --> [1]
```

<!--
##### Split Complexity by Tags (Document Indexes)

You can also gets the same effect when using documents in combination with tags and a ___where___ clause, e.g.:

```js
var movies = new FlexSearch({
    doc: {
        id: "id",
        title: "title"
    },
    tag:{
        cat: "cat"
    }
});
```

Add content to the index:

```js
add({ id: 1, cat: "action", title: "Movie Title" });
add({ id: 2, cat: "adventure", title: "Movie Title" });
add({ id: 3, cat: "comedy", title: "Movie Title" });
```

Perform queries:
```js
var results = search("movie title", {
    field: "title",
    where: {
        cat: "adventure"
    }
});
```
-->

Split indexes by categories improves performance significantly.

##### Use numeric IDs

It is recommended to use numeric id values as reference when adding content to the index. The byte length of passed ids influences the memory consumption significantly. If this is not possible you should consider to use a index table and map the ids with indexes, this becomes important especially when using contextual indexes on a large amount of content.

<!--
e.g. instead of this:
```js
index.add("fdf12cad-8779-47ab-b614-4dbbd649178b", "content");
```

you should probably use this:
```js
var index_table = {
    "fdf12cad-8779-47ab-b614-4dbbd649178b": 0,
    "48b3041c-a243-4a52-b1ed-225041847366": 1,
    "7236c8b5-86e1-451a-842f-d9aba9642e4d": 2,
    // ....
};

index.add(index_table["fdf12cad-8779-47ab-b614-4dbbd649178b"], "content");
```

It is planned to provide a built-in feature which should replace this workaround.
-->

<a name="export"></a>
## Export/Import Index

> index.export() returns a serialized dump as a string.

> index.import(string) takes a serialized dump as a string and load it to the index.

Assuming you have one or several indexes:
```js
var feeds_2017 = new FlexSearch();
var feeds_2018 = new FlexSearch();
var feeds_2019 = new FlexSearch();
```

Export indexes, e.g. to the local storage:
```js
localStorage.setItem("feeds_2017", feeds_2017.export());
localStorage.setItem("feeds_2018", feeds_2018.export());
localStorage.setItem("feeds_2019", feeds_2019.export());
```

Import indexes, e.g. from the local storage:
```js
feeds_2017.import(localStorage.getItem("feeds_2017"));
feeds_2018.import(localStorage.getItem("feeds_2018"));
feeds_2019.import(localStorage.getItem("feeds_2019"));
```

<a name="debug"></a>
## Debug

> Do not use DEBUG in production builds.

If you get issues, you can temporary set the _DEBUG_ flag to _true_ on top of _flexsearch.js_:

```js
DEBUG = true;
```

This enables console logging of several processes. Just open the browsers console to make this information visible.

<a name="profile"></a>
## Profiler Stats

> Do not use PROFILER in production builds.

To collect some performance statistics of your indexes you need to temporary set the _PROFILER_ flag to _true_ on top of _flexsearch.js_:

```js
PROFILER = true;
```

This enables profiling of several processes.

An array of all profiles is available on:

```js
window.stats;
```

You can also just open the browsers console and enter this line to get stats.

> The index of the array corresponds to the _index.id_.

Get stats from a specific index:

```js
index.stats;
```

The returning stats payload is divided into several categories. Each of these category provides its own statistic values.

##### Profiler Stats Properties
<table>
    <tr></tr>
    <tr>
        <td>Property</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>time</td>
        <td>The sum of time (ms) the process takes (lower is better)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>count</td>
        <td>How often the process was called</td>
    </tr>
    <tr></tr>
    <tr>
        <td>ops</td>
        <td>Average operations per seconds (higher is better)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>nano</td>
        <td>Average cost (ns) per operation/call (lower is better)</td>
    </tr>
</table>

<a name="builds"></a>
## Custom Builds

Full Build:
```bash
npm run build
```

Compact Build:
```bash
npm run build-compact
```

Light Build:
```bash
npm run build-light
```

Build Language Packs:
```bash
npm run build-lang
```

Custom Build:
```bash
npm run build-custom SUPPORT_WORKER=true SUPPORT_ASYNC=true
```

> On custom builds each build flag will be set to _false_ by default.

Alternatively you can also use:
```bash
node compile SUPPORT_WORKER=true
```

> The custom build will be saved to flexsearch.custom.xxxxx.js (the "xxxxx" is a hash based on the used build flags).

##### Supported Build Flags

<table>
    <tr></tr>
    <tr>
        <td>Flag</td>
        <td>Values</td>
    </tr>
    <tr>
        <td>DEBUG</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>PROFILER</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_ENCODER</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_DOCUMENT</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_WHERE</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_WORKER</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_CACHE</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_ASYNC</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_PRESET</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_INFO</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_SERIALIZE</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_SUGGESTION</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_PAGINATION</td>
        <td>true, false</td>
    </tr>
     <tr></tr>
     <tr>
         <td>SUPPORT_OPERATOR</td>
         <td>true, false</td>
     </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_CALLBACK</td>
        <td>true, false</td>
    </tr>
    <tr>
        <td><br><b>Language Packs</b></td>
        <td></td>
    </tr>
    <tr>
        <td>SUPPORT_LANG_EN</td>
        <td>true, false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><a>SUPPORT_LANG_DE</td>
        <td>true, false</td>
    </tr>
    <tr>
        <td><br><b>Compiler Flags</b></td>
        <td></td>
    </tr>
    <tr>
        <td>LANGUAGE_OUT<br><br><br><br><br><br><br><br></td>
        <td>ECMASCRIPT3<br>ECMASCRIPT5<br>ECMASCRIPT5_STRICT<br>ECMASCRIPT6<br>ECMASCRIPT6_STRICT<br>ECMASCRIPT_2015<br>ECMASCRIPT_2017<br>STABLE</td>
    </tr>
</table>

## Contribution

Feel free to contribute to this project and also feel free to contact me (<a href="https://github.com/ts-thomas">https://github.com/ts-thomas</a>) when you have any questions.

<a href="CHANGELOG.md">Changelog</a>

---

Copyright 2019 Nextapps GmbH<br>
Released under the <a href="http://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache 2.0 License</a><br>
