<p align="center">
    <br>
    <img src="http://nextapps.de/img/flexsearch.svg" alt="Search Library" width="50%">
    <br><br>
    <a target="_blank" href="https://www.npmjs.com/package/flexsearch"><img src="https://img.shields.io/npm/v/flexsearch.svg"></a>
    <img src="https://img.shields.io/badge/status-BETA-orange.svg">
    <a target="_blank" href="https://travis-ci.org/nextapps-de/flexsearch"><img src="https://travis-ci.org/nextapps-de/flexsearch.svg?branch=master"></a>
    <a target="_blank" href="https://coveralls.io/github/nextapps-de/flexsearch?branch=master"><img src="https://coveralls.io/repos/github/nextapps-de/flexsearch/badge.svg?branch=master"></a>
    <a target="_blank" href="https://github.com/nextapps-de/flexsearch/issues"><img src="https://img.shields.io/github/issues/nextapps-de/xone.svg"></a>
    <a target="_blank" href="https://github.com/nextapps-de/flexsearch/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/xone.svg"></a>
</p>

<h1></h1>
<h3>Fastest and most memory efficient full text search library with zero dependencies.</h3>

When it comes to raw search speed __FlexSearch outperforms every single searching library out there__ and also provides flexible search capabilities like multi-word matching, phonetic transformations or partial matching. It also has the __most memory-efficient index__. Keep in mind that updating items from the index has a significant cost. When your index needs to be updated continuously then <a href="bulksearch/" target="_blank">BulkSearch</a> may be a better choice. FlexSearch also provides you a non-blocking asynchronous processing model as well as web workers to perform any updates on the index as well as queries through dedicated threads. 

Benchmark:
- Library Comparison: <a href="https://jsperf.com/compare-search-libraries" target="_blank">https://jsperf.com/compare-search-libraries</a>
- BulkSearch vs. FlexSearch: <a href="https://jsperf.com/flexsearch" target="_blank">https://jsperf.com/flexsearch</a>

Supported Platforms:
- Browser
- Node.js

Supported Module Definitions:
- AMD (RequireJS)
- CommonJS (Node.js)
- Closure (Xone)
- Global (Browser)

All Features:
<ul>
    <li><a href="#webworker">Web-Worker Support</a> (not available in Node.js)</li>
    <li>Partial Matching</li>
    <li>Multiple Words</li>
    <li><a href="#phonetic">Phonetic Search</a></li>
    <li>Relevance-based Scoring</li>
    <li>Limit Results</li>
    <li>Caching</li>
    <li>Asynchronous Mode</li>
    <li>Custom Matchers</li>
    <li>Custom Encoders</li>
</ul>
<a name="webworker"></a>

#### Web-Worker Support

[![Greenkeeper badge](https://badges.greenkeeper.io/nextapps-de/flexsearch.svg)](https://greenkeeper.io/)

Workers get its own dedicated memory. Especially for larger indexes, web worker improves speed and available memory a lot. FlexSearch index was tested with a 250 Mb text file including __10 Million words__. The indexing was done silently in background by multiple parallel running workers in about 7 minutes and __reserve ~ 8.2 Mb__ memory. The search result __took ~ 0.25 ms__!

__Note:__ It is slightly faster to use no web worker when the index isn't too big (< 100,000 words).

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
        <td>Large (~ 90 bytes per word)</td>
        <td>Tiny (~ 2 bytes per word)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>Usage</td>
        <td><ul><li>Limited content</li><li>Index updates continously</li></ul></td>
        <td><ul><li>Fastest possible search</li><li>Rare updates on index</li><li>Low memory capabilities</li></ul></td>
    </tr>
    <tr></tr>
    <tr>
        <td>Ranked Searching</td>
        <td>No</td>
        <td>Yes</td>
    </tr>
    <tr></tr>
    <tr>
        <td>Pagination</td>
        <td>Yes</td>
        <td>No</td>
    </tr>
</table>

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

## API Overview

Global methods:
- <a href="#flexsearch.create">FlexSearch.__create__(\<options\>)</a>
- <a href="#flexsearch.addmatcher">FlexSearch.__addMatcher__({_KEY: VALUE_})</a>
- <a href="#flexsearch.register">FlexSearch.__register__(name, encoder)</a>
- <a href="#flexsearch.encode">FlexSearch.__encode__(name, string)</a>

Index methods:
- <a href="#index.add">Index.__add__(id, string)</a>
- <a href="#index.search">Index.__search__(string, \<limit\>, \<callback\>)</a>
- <a href="#index.update">Index.__update__(id, string)</a>
- <a href="#index.remove">Index.__remove__(id)</a>
- <a href="#index.reset">Index.__reset__()</a>
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

##### Create a new index with custom options

```js
var index = new FlexSearch({

    // default values:

    encode: "icase",
    mode: "forward",
    multi: false,
    async: false,
    cache: false
});
```

__Read more:__ <a href="#phonetic">Phonetic Search</a>, <a href="#compare">Phonetic Comparison</a>, <a href="#memory">Improve Memory Usage</a>
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
<a name="index.reset"></a>
#### Reset index

```js
index.reset();
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

> FlexSearch.__addMatcher({_REGEX: REPLACE_})__

Add global matchers for all instances:
```js
FlexSearch.addMatcher({

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

> FlexSearch.__register(name, encoder)__

```js
FlexSearch.register('whitespace', function(str){

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
FlexSearch.register('mixed', function(str){
  
    str = this.encode("icase", str);  // built-in
    str = this.encode("whitespace", str); // custom
    
    return str;
});
```
```js
FlexSearch.register('extended', function(str){
  
    str = this.encode("custom", str);
    
    // do something additional with str ...

    return str;
});
```

<a name="index.info"></a>
#### Get info

```js
index.info();
```

Returns information about the index, e.g.:

```json
{
    "bytes": 3600356288,
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

<a name="options"></a>
## Options

<table>
    <tr></tr>
    <tr>
        <td align="left">Option</td>
        <td align="left">Values</td>
        <td align="left">Description</td>
    </tr>
    <tr>
        <td align="top">mode</td>
        <td vertical="top" vertical-align="top">
            "strict"<br>
            "foward"<br>
            "inverse"<br>
            "full"
        </td>
        <td vertical-align="top">The indexing mode.</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">encode</td>
        <td>
            false<br>
            "icase"<br>
            "simple"<br>
            "advanced"<br>
            "extra"<br>
            function(string):string
        </td>
        <td>The encoding type. Choose one of the built-ins or pass a custom encoding function.</td>
    </tr>
    <!--
    <tr></tr>
    <tr>
        <td align="top">boolean</td>
        <td>
            "and"<br>
            "or"
        </td>
        <td>The applied boolean model when comparing multiple words. <b>Note:</b> When using "or" the first word is also compared with "and". Example: a query with 3 words, results has either: matched word 1 & 2 and matched word 1 & 3.</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">multi</td>
        <td>
            true<br>
            false
        </td>
        <td>Enable multi word processing.</td>
    </tr>
    -->
    <tr></tr>
    <tr>
        <td align="top">cache</td>
        <td>
            true<br>
            false
        </td>
        <td>Enable/Disable caching.</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">async</td>
        <td>
            true<br>
            false
        </td>
        <td>Enable/Disable asynchronous processing.</td>
    </tr>
    <tr></tr>
    <tr>
        <td align="top">worker</td>
        <td>
            false<br>
            {number}
        </td>
        <td>Enable and also count of running worker threads.</td>
    </tr>
</table>

<a name="phonetic" id="phonetic"></a>
## Phonetic Encoding

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
        <td><b>"icase"</b></td>
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
        <td><b>"ngram"</b></td>
        <td>Phonetic normalizations + N-Gram sequencing</td>
        <td>yes</td>
        <td>~ 40%</td>
    </tr>
</table>

<a name="compare" id="compare"></a>
### Compare Phonetic Encoder

Reference String: __"Björn-Phillipp Mayer"__

<table>
    <tr></tr>
    <tr>
        <td align="left">Query</td>
        <td align="left">iCase</td>
        <td align="left">Simple</td>
        <td align="left">Advanced</td>
        <td align="left">Extra</td>
        <td align="left">N-Gram</td>
    </tr>
    <tr>
        <td>björn</td>
        <td><b>yes</b></td>
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
        <td>no</td>
    </tr>
    <tr></tr>
    <tr>
        <td>bjorn</td>
        <td>no</td>
        <td><b>yes</b></td>
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
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>philipp</td>
        <td>no</td>
        <td>no</td>
        <td><b>yes</b></td>
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
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>björnphillip</td>
        <td>no</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
        <td>no</td>
    </tr>
    <tr></tr>
    <tr>
        <td>meier</td>
        <td>no</td>
        <td>no</td>
        <td><b>yes</b></td>
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
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>meier fhilip</td>
        <td>no</td>
        <td>no</td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
        <td><b>yes</b></td>
    </tr>
    <tr></tr>
    <tr>
        <td>byorn mair</td>
        <td>no</td>
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
        <td><b>no</b></td>
    </tr>
</table>

<a name="memory" id="memory"></a>
## Compare Memory Usage

__Note:__ The required memory depends on several options. 

<table>
    <tr></tr>
    <tr>
        <td align="left">Encoding</td>
        <td align="left">Memory usage of every ~ 100,000 indexed words</td>
    </tr>
    <tr>
        <td>"icase" (default) / false</td>
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
        <td>"ngram"</td>
        <td>110 kb</td>
    </tr>
    <tr>
        <td align="left">Mode</td>
        <td align="left">Multiplied with:</td>
    </tr>
    <tr>
        <td>"strict"</td>
        <td>x 1</td>
    </tr>
    <tr></tr>
    <tr>
        <td>"forward" (default)</td>
        <td>x 1.5</td>
    </tr>
    <tr></tr>
    <tr>
        <td>"inverse"</td>
        <td>x 2</td>
    </tr>
    <tr></tr>
    <tr>
        <td>"full"</td>
        <td>x 2.3</td>
    </tr>
</table>

---

Author FlexSearch: Thomas Wilkerling<br>
License: <a href="http://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache 2.0 License</a><br>
