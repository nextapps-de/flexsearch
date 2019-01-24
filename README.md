<p align="center">
    <br>
    <img src="https://rawgithub.com/nextapps-de/flexsearch/master/doc/flexsearch.svg" alt="Search Library" width="50%">
    <br><br>
    <a target="_blank" href="https://www.npmjs.com/package/flexsearch"><img src="https://img.shields.io/npm/v/flexsearch.svg"></a>
    <!--<img src="https://img.shields.io/badge/status-BETA-orange.svg">-->
    <a target="_blank" href="https://travis-ci.org/nextapps-de/flexsearch"><img src="https://travis-ci.org/nextapps-de/flexsearch.svg?branch=master"></a>
    <a target="_blank" href="https://coveralls.io/github/nextapps-de/flexsearch?branch=master"><img src="https://coveralls.io/repos/github/nextapps-de/flexsearch/badge.svg?branch=master"></a>
    <a target="_blank" href="https://www.codacy.com/app/ts-thomas/FlexSearch?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nextapps-de/flexsearch&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/a896e010f6b4429aa7bc9a89550320a7"/></a>
    <a target="_blank" href="https://github.com/nextapps-de/flexsearch/issues"><img src="https://img.shields.io/github/issues/nextapps-de/xone.svg"></a>
    <!--<img src="https://badges.greenkeeper.io/nextapps-de/flexsearch.svg">-->
    <a target="_blank" href="https://github.com/nextapps-de/flexsearch/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/xone.svg"></a>
</p>

<h1></h1>
<h3>World's fastest and most memory efficient full text search library with zero dependencies.</h3>

When it comes to raw search speed <a href="https://rawgit.com/nextapps-de/flexsearch/master/test/benchmark.html" target="_blank">FlexSearch outperforms every single searching library out there</a> and also provides flexible search capabilities like multi-word matching, phonetic transformations or partial matching. 
It also has the <a href="#memory">most memory-efficient index</a>. Keep in mind that updating and/or removing existing items from the index has a significant cost. When your index needs to be updated continuously then <a href="bulksearch/" target="_blank">BulkSearch</a> may be a better choice.
FlexSearch also provides you a non-blocking asynchronous processing model as well as web workers to perform any updates or queries on the index in parallel through dedicated balanced threads. 

<a href="#installation">Installation Guide</a> &ensp;&bull;&ensp; <a href="#api">API Reference</a> &ensp;&bull;&ensp; <a href="#profiles">Example Options</a> &ensp;&bull;&ensp; <a href="#builds">Custom Builds</a>

Supported Platforms:
- Browser
- Node.js

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
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/master/flexsearch.min.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/flexsearch.min.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/flexsearch.min.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.light.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/master/flexsearch.light.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/flexsearch.light.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/flexsearch.light.js</a></td>
    </tr>
    <tr></tr>
    <tr>
        <td>flexsearch.compact.js</td>
        <td><a href="https://github.com/nextapps-de/flexsearch/raw/master/flexsearch.compact.js" target="_blank">Download</a></td>
        <td><a href="https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/flexsearch.compact.js" target="_blank">https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@master/flexsearch.compact.js</a></td>
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
            <a href="#webworker">Web-Worker Sharding</a> (not available in Node.js)
        </td>
        <td>x</td>
        <td>x</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#contextual">Contextual Indexes</a>
        </td>
        <td>x</td>
        <td>x</td>
        <td>x</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            Partial Matching
        </td>
        <td>x</td>
        <td>x</td>
        <td>x</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            Multi-Phrase Search
        </td>
        <td>x</td>
        <td>x</td>
        <td>x</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            Relevance-based Scoring
        </td>
        <td>x</td>
        <td>x</td>
        <td>x</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            Auto-Balanced Cache by Popularity
        </td>
        <td>x</td>
        <td>x</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            Suggestions (Results)
        </td>
        <td>x</td>
        <td>x</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            Asynchronous Processing & Concurrency Control
        </td>
        <td>x</td>
        <td>x</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            <a href="#phonetic">Phonetic Mathching</a>
        </td>
        <td>x</td>
        <td>x</td>
        <td>-</td>
    </tr>
    <tr></tr>
    <tr>
        <td>
            Customizable: Matcher, Encoder, Tokenizer, Stemmer, Filter
        </td>
        <td>x</td>
        <td>x</td>
        <td>x</td>
    </tr>
    <tr>
        <td>File Size (gzip)</td>
        <td>6.7 kb</td>
        <td>4.5 kb</td>
        <td>1.9 kb</td>
    </tr>
</table>

> It is also pretty simple to make <a href="#builds">Custom Builds</a> 

<a name="compare" id="compare"></a>
#### Benchmark Ranking 

- Library Comparison: <a href="https://rawgit.com/nextapps-de/flexsearch/master/test/benchmark.html" target="_blank">Benchmark "Gulliver's Travels"</a>
- Library Comparison: <a href="https://rawgit.com/nextapps-de/flexsearch/master/test/matching.html" target="_blank">Relevance Scoring</a>
- Library Comparison: <a href="#consumption">Memory Consumption</a>

__Query Test: "Gulliver's Travels"__

<table>
    <tr></tr>
    <tr>
        <td align="left">Rank</td>
        <td align="left">Library Name</td>
        <td align="left">Library Version</td>
        <td align="left">Library Size</td>
        <td align="left">Operations per second</td>
    </tr>
    <tr>
        <td>1</td>
        <td>FlexSearch</td>
        <td>0.3.0</td>
        <td>2.9 kb</td>
        <td><b>316336</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>2</td>
        <td>Wade</td>
        <td>0.3.3</td>
        <td>1.6 kb</td>
        <td><b>1524</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>3</td>
        <td>JS Search</td>
        <td>1.4.2</td>
        <td>3.8 kb</td>
        <td><b>739</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>4</td>
        <td>JSii</td>
        <td>1.0</td>
        <td>3.9 kb</td>
        <td><b>544</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>5</td>
        <td>Lunr.js</td>
        <td>2.3.5</td>
        <td>8.8 kb</td>
        <td><b>310</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>6</td>
        <td>Elasticlunr.js</td>
        <td>0.9.6</td>
        <td>5.6 kb</td>
        <td><b>286</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>7</td>
        <td>BulkSearch</td>
        <td>0.1.3</td>
        <td>3.1 kb</td>
        <td><b>265</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>8</td>
        <td>bm25</td>
        <td>0.2</td>
        <td>3.5 kb</td>
        <td><b>72</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>9</td>
        <td>Fuse</td>
        <td>3.3.0</td>
        <td>3.7 kb</td>
        <td><b>1</b></td>
    </tr>
</table>

__Memory Test: "Gulliver's Travels"__

<table>
    <tr></tr>
    <tr>
        <td align="left">Rank</td>
        <td align="left">Library Name</td>
        <td align="left">Library Version</td>
        <td align="left">Index Size <a href="#notes">*</a></td>
        <td align="left">Memory Allocation <a href="#notes">**</a></td>
    </tr>
    <tr>
        <td>1</td>
        <td>FlexSearch</td>
        <td>0.3.0</td>
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
        <td>JS Search</td>
        <td>1.4.2</td>
        <td>36.9 Mb</td>
        <td>53.0 kb</td>
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
        <td>Lunr.js</td>
        <td>2.3.5</td>
        <td>16.24 Mb</td>
        <td>84.73 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>6</td>
        <td>Elasticlunr.js</td>
        <td>0.9.6</td>
        <td>11.83 Mb</td>
        <td>68.69 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>7</td>
        <td>BulkSearch</td>
        <td>0.1.3</td>
        <td>1.53 Mb</td>
        <td>984.30 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>8</td>
        <td>bm25</td>
        <td>0.2</td>
        <td>6.95 Mb</td>
        <td>137.88 kb</td>
    </tr>
    <tr></tr>
    <tr>
        <td>9</td>
        <td>Fuse</td>
        <td>3.3.0</td>
        <td>0.22 Mb</td>
        <td>156.46 kb</td>
    </tr>
</table>

<a name="notes" id="notes"></a>
_* Index Size: The size of memory the index requires_<br>
_** Memory Allocation: The amount of memory which was additionally allocated during a row of 10 queries_

Library Comparison: <a href="https://rawgit.com/nextapps-de/flexsearch/master/test/benchmark.html" target="_blank">Benchmark "Gulliver's Travels"</a>

<a name="contextual"></a>
#### Contextual Search

FlexSearch introduce a new scoring mechanism called __Contextual Search__ which was invented by Thomas Wilkerling, the author of this library. A Contextual Search <a href="https://rawgit.com/nextapps-de/flexsearch/master/test/benchmark.html" target="_blank">incredibly boost up queries to a complete new level</a> but also requires a lot of additionally memory.
The basic idea of this concept is to limit relevance by its context instead of calculating relevance through the whole (unlimited) distance.
Imagine you add a text block of some sentences to an index ID. Assuming the query includes a combination of first and last word from this text block, are they really relevant to each other?
In this way contextual search <a href="https://rawgit.com/nextapps-de/flexsearch/master/test/matching.html" target="_blank">also improves the results of relevance-based queries</a> on large amount of text data.

<p align="center">
    <img src="https://rawgithub.com/nextapps-de/flexsearch/master/doc/contextual-index.svg">
</p>

__Note:__ This feature is actually not enabled by default.

###### TF-IDF / BM25?

> "TF-IDF and all kinds of variations (like BM25) is a big mistake in searching algorithms today. They don't provide neither: a meaningful relevance of a term nor the importance of it! Like many pseudo-intelligent algorithms this is also just an example of mathematical stupidity." — Thomas Wilkerling, _Contextual-based Scoring_, 2018

<a name="webworker"></a>
#### Web-Worker Support

Workers get its own dedicated memory. Especially for larger indexes, web worker improves speed and available memory a lot. FlexSearch index was tested with a 250 Mb text file including 10 Million words. The indexing was done silently in background by multiple parallel running workers in about 7 minutes. The final index reserves ~ 8.2 Mb memory/space. The search result took ~ 0.25 ms.

__Note:__ It is slightly faster to use no web worker when the index or query isn't too big (index < 500,000 words, query < 25 words).

#### Compare BulkSearch vs. FlexSearch

<table>
    <tr></tr>
    <tr>
        <td align="left">Description</th>
        <td align="left">BulkSearch</th>
        <td align="left">FlexSearch</th>
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
        <td><ol><li>Lexical pre-scored dictionary</li><li>Contextual-based map</li></ol></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Strength</td>
        <td><ul><li>fast adds / fast updates / fast removals</li></ul></td>
        <td><ul><li>fast queries</li><li>memory-efficient index</li></ul></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Weaks</td>
        <td><ul><li>less powerful contextual search</li><li>less memory efficient (has to be defragmented from time to time)</li></ul></td>
        <td><ul><li>updating / deleting extisting items from index is slow</li><li>adding items to the index optimized for super partial matching (mode: "full") is slow</li></ul></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Pagination</td>
        <td>Yes</td>
        <td>No</td>
    </tr>
    <!--
    <tr></tr>
    <tr>
        <td>Query Wildcards</td>
        <td>Yes</td>
        <td>No</td>
    </tr>
    <tr></tr>
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

<a name="installation"></a>
## Installation

##### HTML / Javascript

```html
<html>
<head>
    <script src="js/flexsearch.min.js"></script>
</head>
...
```
__Note:__ Use _flexsearch.min.js_ for production and _flexsearch.js_ for development.

Use latest from CDN:
```html
<script src="https://cdn.rawgit.com/nextapps-de/flexsearch/master/flexsearch.min.js"></script>
```

##### Node.js

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

__AMD__

```javascript
var FlexSearch = require("./flexsearch.js");
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
- <a href="#index.addmatcher">Index.__addMatcher__({_KEY: VALUE_})</a>
- <a href="#index.encode">Index.__encode__(string)</a>

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

##### Create a new index and choosing one of the built-in profiles

```js
var index = new FlexSearch("speed");
```

##### Create a new index with custom options

```js
var index = new FlexSearch({

    // default values:

    profile: "balance",
    encode: "icase",
    mode: "ngram",
    async: false,
    cache: false
});
```

<a href="#options">Read more about custom options</a>

<a name="index.add"></a>
#### Add items to an index

> Index.__add___(id, string)

```js
index.add(10025, "John Doe");
```
<a name="index.search"></a>
#### Search items

> Index.__search(string|options, \<limit\>, \<callback\>)__

```js
index.search("John");
```

Limit the result:

```js
index.search("John", 10);
```

Perform queries asynchronously:

```js
index.search("John", function(result){
    
    // array of results
});
```

Pass custom options for each query:

```js
index.search({
    
    query: "John",
    limit: 1000,
    threshold: 5, // >= initial threshold
    depth: 3,     // <= initial depth
    callback: function(results){/* ... */}
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

Get also suggestions for a query:

```js
index.search({
    
    query: "John Doe",
    suggest: true
});
```

When suggestion is enabled all results will be filled up (until limit, default 1000) with similar matches ordered by relevance.

<a name="index.update"></a>
#### Update item to the index

> Index.__update__(id, string)

```js
index.update(10025, "Road Runner");
```

<a name="index.remove"></a>
#### Remove item to the index

> Index.__remove__(id)

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
#### Re-Initialize index

> Index.__init(\<options\>)__

__Note:__ Re-initialization will also destroy the old index!

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

Define a private custom encoder during creation/initialization:
```js
var index = new FlexSearch({

    encode: function(str){
    
        // do something with str ...
        
        return str;
    }
});
```
<a name="flexsearch.register"></a>
##### Register a global encoder to be used by all instances

> FlexSearch.__registerEncoder(name, encoder)__

```js
FlexSearch.registerEncoder('whitespace', function(str){

    return str.replace(/ /g, '');
});
```

Use global encoders:
```js
var index = new FlexSearch({ encode: 'whitespace' });
```
<a name="index.encode"></a>
##### Call encoders directly

Private encoder:
```js
var encoded = index.encode("sample text");
```
<a name="flexsearch.encode"></a>
Global encoder:
```js
var encoded = FlexSearch.encode("whitespace", "sample text");
```

##### Mixup/Extend multiple encoders

```js
FlexSearch.registerEncoder('mixed', function(str){
  
    str = this.encode("icase", str);  // built-in
    str = this.encode("whitespace", str); // custom
    
    return str;
});
```
```js
FlexSearch.registerEncoder('extended', function(str){
  
    str = this.encode("custom", str);
    
    // do something additional with str ...

    return str;
});
```
<a name="flexsearch.tokenizer"></a>
#### Add custom tokenizer

Define a private custom tokenizer during creation/initialization:
```js
var index = new FlexSearch({

    mode: function(str){
    
        // split string into components, e.g.:
        
        return str.split(/ -\//g);
    }
});
```
<a name="flexsearch.language"></a>
#### Add language-specific stemmer and/or filter

> __Stemmer:__ several linguistic mutations of the same word (e.g. "run" and "running")

> __Filter:__ a blacklist of words to be filtered out from indexing at all (e.g. "and", "to" or "be")

Define a private custom stemmer or filter during creation/initialization:
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

Or assign stemmer/filters globally to a language:
```js
FlexSearch.registerLanguage('us', {

    stemmer: {/* ... */},
    filter: [/* ... */]
});
```

Or use built-in stemmer or filter of your preferred languages:
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
var index_en = new FlexSearch({stemmer: 'en', filter: 'en'});
var index_de = new FlexSearch({stemmer: 'de', filter: [/* custom */]});
```

In Node.js you just need require the language pack files to make them available:

```js
require('lang/en.js');
require('lang/de.js');
```

It is also possible to <a href="#builds">compile language packs into the build</a> as follows:

```bash
node compile SUPPORT_LANG_EN=true SUPPORT_LANG_DE=true
```

<a name="index.info"></a>
#### Get info about an index

```js
index.info();
```

Returns information e.g.:

```json
{
    "bytes": 64000,
    "id": 0,
    "matchers": 0,
    "size": 10000,
    "status": false
}
```
<a name="chaining"></a>
#### Chaining

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

#### Enable Contextual Index

Create index and just set the limit of relevance ("depth"):
```js
var index = new FlexSearch({

    encode: "icase",
    mode: "strict",
    depth: 3
});
```

#### Enable Auto-Balanced Cache

Create index and just set a limit of cache entries:
```js
var index = new FlexSearch({

    profile: "score",
    cache: 10000
});
```

#### Use WebWorker Sharding (Browser only)

Create index and just set the count of parallel threads:
```js
var index = new FlexSearch({

    encode: "icase",
    mode: "full",
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

<a name="options"></a>
## Options

FlexSearch ist highly customizable. Make use of the the <a href="#profiles">right options</a> can really improve your results as well as memory economy or query time.

<table>
    <tr></tr>
    <tr>
        <td align="left">Option</td>
        <td align="left">Values</td>
        <td align="left">Description</td>
    </tr>
    <tr>
        <td align="top">profile<br><br><br><br><br><br></td>
        <td vertical="top" vertical-align="top">
            "memory"<br>
            "speed"<br>
            "match"<br>
            "score"<br>
            "balance"<br>
            "fastest"
        </td>
        <td vertical-align="top">
            The <a href="#profiles">configuration profile</a>. Choose your preferation.<br>
        </td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">mode<br><br><br><br><br><br></td>
        <td vertical="top" vertical-align="top">
            "strict"<br>
            "foward"<br>
            "reverse"<br>
            "ngram"<br>
            "full"<br>
            function()
        </td>
        <td vertical-align="top">
            The <a href="#tokenizer">indexing mode (tokenizer)</a>.<br><br>Choose one of the <a href="#tokenizer">built-ins</a> or pass a <a href="#flexsearch.tokenizer">custom tokenizer function</a>.<br>
        </td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">encode<br><br><br><br><br><br><br></td>
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
    <!--
    <tr></tr>
    <tr>
        <td align="top">boolean<br><br></td>
        <td>
            "and"<br>
            "or"
        </td>
        <td>The applied boolean model when comparing multiple words. <b>Note:</b> When using "or" the first word is also compared with "and". Example: a query with 3 words, results has either: matched word 1 & 2 and matched word 1 & 3.</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">multi<br><br></td>
        <td>
            true<br>
            false
        </td>
        <td>Enable multi word processing.</td>
    </tr>
    -->
    <tr></tr>
    <tr>
        <td align="top">cache<br><br><br></td>
        <td>
            false<br>
            true<br>
            {number}
        </td>
        <td>Enable/Disable and/or set capacity of cached entries.<br><br>When passing a number as a limit the <b>cache automatically balance stored entries related to their popularity</b>.<br><br>Note: When just using "true" the cache has no limits and is actually 2-3 times faster (because the balancer do not have to run).</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">async<br><br></td>
        <td>
            true<br>
            false
        </td>
        <td>Enable/Disable asynchronous processing.<br><br>Each job will be queued for non-blocking processing. Recommended when using WebWorkers.</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">worker<br><br></td>
        <td>
            false<br>
            {number}
        </td>
        <td>Enable/Disable and set count of running worker threads.</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">depth<br><br></td>
        <td>
            false<br>
            {number:0-9}
        </td>
        <td>Enable/Disable <a href="#contextual">contextual indexing</a> and also sets contextual distance of relevance.</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">threshold<br><br></td>
        <td>
            false<br>
            {number:0-9}
        </td>
        <td>Enable/Disable the threshold of minimum relevance all results should have.<br><br>Note: It is also possible to set a lower threshold for indexing and pass a higher value when calling <i>index.search(options)</i>.</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">stemmer<br><br><br></td>
        <td>
            false<br>
            {string}<br>
            {function}
        </td>
        <td>Disable or pass in language shorthand flag (ISO-3166) or a custom object.</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">filter<br><br><br></td>
        <td>
            false<br>
            {string}<br>
            {function}
        </td>
        <td>Disable or pass in language shorthand flag (ISO-3166) or a custom array.</td>
    </tr>
</table>

<a name="tokenizer"></a>
## Tokenizer

Tokenizer effects the required memory also as query time and flexibility of partial matches. Try to choose the most upper of these tokenizer which fits your needs:

<table>
    <tr></tr>
    <tr>
        <td align="left">Option</td>
        <td align="left">Description</td>
        <td align="left">Example</td>
        <td align="left">Memory Factor (n = length of word)</td>
    </tr>
    <tr>
        <td><b>"strict"</b></td>
        <td>index whole words</td>
        <td><b>foobar</b></td>
        <td>* 1</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"ngram"</b> (default)</td>
        <td>index words partially through phonetic n-grams</td>
        <td><b>foo</b>bar<br>foo<b>bar</b></td>
        <td>* n / 3</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"foward"</b></td>
        <td>incrementally index words in forward direction</td>
        <td><b>fo</b>obar<br><b>foob</b>ar<br></td>
        <td>* n</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"reverse"</b></td>
        <td>incrementally index words in both directions</td>
        <td>foob<b>ar</b><br>fo<b>obar</b></td>
        <td>* 2n - 1</td>
    </tr>
    <tr></tr>
    <tr>
        <td><b>"full"</b></td>
        <td>index every possible combination</td>
        <td>fo<b>oba</b>r<br>f<b>oob</b>ar</td>
        <td>* n * (n - 1)</td>
    </tr>

</table>

<a name="phonetic"></a>
## Phonetic Encoding

Encoding effects the required memory also as query time and phonetic matches. Try to choose the most upper of these encoders which fits your needs, or pass in a <a href="#flexsearch.encoder">custom encoder</a>:

<table>
    <tr></tr>
    <tr>
        <td align="left">Option</td>
        <td align="left">Description</td>
        <td align="left">False-Positives</td>
        <td align="left">Compression</td>
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
        <td>Pass custom encoding: function(string):string</td>
        <td></td>
        <td></td>
    </tr>
</table>

<a name="compare" id="compare"></a>
#### Comparison (Matching)

> Reference String: __"Björn-Phillipp Mayer"__

<table>
    <tr></tr>
    <tr>
        <td align="left">Query</td>
        <td align="left">iCase</td>
        <td align="left">Simple</td>
        <td align="left">Advanced</td>
        <td align="left">Extra</td>
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
        <td align="left">Encoding</td>
        <td align="left">Memory usage of every ~ 100,000 indexed word</td>
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
        <td align="left">Mode</td>
        <td align="left">Multiplied with: (n = <u>average</u> length of indexed words)</td>
    </tr>
    <tr>
        <td>"strict"</td>
        <td>* 1</td>
    </tr>
    <tr></tr>
    <tr>
        <td>"ngram" (default)</td>
        <td>* n / 3</td>
    </tr>
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
        <td align="left">Contextual Index</td>
        <td align="left">Multiply the sum above with:</td>
    </tr>
    <tr>
        <td></td>
        <td>* (depth * 2 + 1)</td>
    </tr>
</table>

<a name="consumption"></a>
#### Compare Memory Consumption

The book "Gulliver's Travels" (Swift Jonathan 1726) was used for this test.

<br>
<img src="https://rawgithub.com/nextapps-de/flexsearch/master/doc/memory-comparison.svg">

<a name="profiles"></a>
## Built-in Profiles

You can pass a built-in profile during creation/initialization. They have these following settings:

Standard profile: __"default"__
```js
{
    encode: "icase",
    mode: "forward"
}
```

Memory-optimized profile: __"memory"__
```js
{
    encode: "extra",
    mode: "strict",
    threshold: 7
}
```

Speed-optimized profile: __"speed"__

```js
{
    encode: "icase",
    mode: "strict",
    threshold: 7,
    depth: 2
}
```

Matching-tolerant profile: __"match"__

```js
{
    encode: "extra",
    mode: "full"
}
```

Relevance-optimized profile: __"score"__

```js
{
    encode: "extra",
    mode: "strict",
    threshold: 5,
    depth: 5
}
```

Most-balanced profile: __"balanced"__

```js
{
    encode: "balanced",
    mode: "ngram",
    threshold: 6,
    depth: 3
}
```

Absolute fastest profile: __"fastest"__

```js
{
    encode: "icase",
    threshold: 9,
    depth: 1
}
```

Compare these options above:
- <a href="https://jsperf.com/compare-flexsearch-options" target="_blank">Benchmarks</a>
- <a href="https://rawgit.com/nextapps-de/flexsearch/master/test/matching-flexsearch.html" target="_blank">Relevance Scoring</a>

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

Alternatively you can also use:
```bash
node compile SUPPORT_WORKER=true
```

> The custom build will be saved to flexsearch.custom.xxxxx.js (the "xxxxx" is a hash based on the used build flags).

__Supported Build Flags__

<table>
    <tr></tr>
    <tr>
        <td align="left">Flag</td>
        <td align="left">Values</td>
    </tr>
    <tr>
        <td>SUPPORT_DEBUG</td>
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
        <td>SUPPORT_BUILTINS (built-in encoders)</td>
        <td>true, false</td>
    </tr>
    <tr>
        <td><br><b>Language Flags </b>(includes stemmer and filter)</td>
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

---

Copyright 2019 Nextapps GmbH<br>
Released under the <a href="http://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache 2.0 License</a><br>
