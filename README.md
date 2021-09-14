# 🚢 Trawler 💨

The search library of Skiff. Originally forked from
[FlexSearch](https://github.com/nextapps-de/flexsearch), this library trims down
unwanted features and modernizes code for a smooth and easy-to-use search
library.

Trawler removes many details and features from FlexSearch, to produce a trimmed-down, optimized, and modernized search library for our needs.

Trawler should be considered alpha-grade, software, so use with care

TODO make this trawler instead
#### Get Latest (NPM)

```cmd
npm install @skiff-org/trawler
```
## Start

There are two types of indices:

1. `Index` is a flat high performance index which stores id-content-pairs.
2. `Document` is multi-field index which can store complex JSON documents


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
## API Overview

Index methods:

- [`index.add(id, string): this`](#index.add)*
- [`index.update(id, string): this`](#index.update) *
- [`index.remove(id): this`](#index.remove) *
- [`index.search(string, limit?, options?): any[]`](#index.search) *
- [`index.serialize(): Record<string, any>`](#index.serialize)
- [`Index.deserialize(Record<string, any>): Index`](#Index.deserialize)

Document methods:

- [`document.add(id?, document): this`](#document.add) *
- [`document.update(id?, document): this`](#document.update) *
- [`document.remove(id): this`](#document.remove) *
- [`document.search(string, limit?, options?): any`](#document.search) *
- [`document.serialize(): Record<string, any>`]()

<span>*</span> For each of those methods there exist an asynchronous equivalent:

Async Version:

- _async_ <a href="#addAsync">.__addAsync__( ... , \<callback\>)</a>
- _async_ <a href="#appendAsync">.__appendAsync__( ... , \<callback\>)</a>
- _async_ <a href="#updateAsync">.__updateAsync__( ... , \<callback\>)</a>
- _async_ <a href="#removeAsync">.__removeAsync__( ... , \<callback\>)</a>
- _async_ <a href="#searchAsync">.__searchAsync__( ... , \<callback\>)</a>

Async methods will return a `Promise`

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
        <td>Sets the scoring resolution (default: 9).</td>
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

## Append Contents

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

We can initialize an index like so:

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

Then use the colon separated notation ___"root:child:child"___ to define hierarchy within the document descriptor:

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


<a name="serialize"></a>
## Serialize / Deserialize

### Serialize

In order to serialize a document or index, call `index.serialize()`, which returns an object storing all the relevant properties of an index:

```js
index.serialize() // -> { map: {...}, reg: {...}, ...}
```

If you want to write an index to a string, stringify this object:

```js
const str = JSON.stringify(index.serialize());
```

Exporting data to the localStorage isn't really a good practice, but if size is not a concern than use it if you like. The export primarily exists for the usage in Node.js or to store indexes you want to delegate from a server to the client.

> The size of the export corresponds to the memory consumption of the library. To reduce export size you have to use a configuration which has less memory footprint (use the table at the bottom to get information about configs and its memory allocation).


### Deserialize

If you want to deserialize an object, call the `Document.deserialize()` or `Index.deserialize()` methods.

The `Index.deserialize()` is simply passed the output of the `index.serialize()` method:

```js
const serialized = JSON.stringify(idx.serialize());
const deserialized = Index.deserialize(JSON.parse(serialized));
```

On the other hand, the `Document.deserialize()` method requires the document `options` required to re-create the document configuration

```js
const serialized = JSON.stringify(idx.serialize());
const deserialized = Document.deserialize(JSON.parse(serialized), {
  document: {
    id: 'id',
    field: ['text']
  }
});
```

## Best Practices

##### Use numeric IDs

It is recommended to use numeric id values as reference when adding content to the index. The byte length of passed ids influences the memory consumption significantly. If this is not possible you should consider to use a index table and map the ids with indexes, this becomes important especially when using contextual indexes on a large amount of content.

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

Split indexes by categories improves performance significantly.

---

Copyright 2018-2021 Nextapps GmbH, 2021– Skiff World, Inc.

Released under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html)
