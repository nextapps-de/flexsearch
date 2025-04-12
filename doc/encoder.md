## Encoder

> [!IMPORTANT]
> You shouldn't miss this part as it is one of the most important aspects of FlexSearch.

Search capabilities highly depends on language processing. The Encoder class is one of the most important core functionalities of FlexSearch.

> Encoders are basically responsible for "fuzziness". [Read here about Phonetic Search/Fuzzy Search](../README.md#fuzzy-search)

### Default Encoder

The default Encoder (when passing no options on creation) uses this configuration:

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
        char: ""
    }
});
```

The default configuration will:

1. apply charset normalization, e.g. "é" to "e"
2. apply letter deduplication, e.g. "missing" to "mising"
3. just index alphanumeric content and filter everything else out

This is important to keep in mind, because when you need a different configuration you'll have to change those settings accordingly.

Let's assume you want including the symbols "#", "@" and "-", because those are needed to differentiate search results (otherwise it would be useless), and let's say you don't need numeric content indexed you can do this by:

```js
const encoder = new Encoder({
    // default configuration is applied
    // extend or override:
    include: {
        // by default everything is set to false
        letter: true,
        number: false,
        char: ["#", "@", "-"]
    }
});
```

#### Built-In Universal Encoders

1. Charset.Exact
2. Charset.Normalize (Charset.Default)

#### Built-In Latin Encoders

1. Charset.LatinBalance
2. Charset.LatinAdvanced
3. Charset.LatinExtra
4. Charset.LatinSoundex

#### Built-In CJK Encoder

1. Charset.CJK

### Basic Usage

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

Instead of using `include` or `exclude` you can pass a regular expression or a string to the field `split`:

```js
const encoder = new Encoder({ 
    split: /\s+/
});
```

E.g. this split configuration will tokenize every symbol/char from a content:

```js
const encoder = new Encoder({ 
    split: ""
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

Further reading: [Encoder Processing Workflow](#encoder-processing-workflow)

Assign an encoder to an index:

```js
const index = new Index({ 
    encoder: encoder
});
```

Define language specific normalizations/transformations:

```js
const encoder = new Encoder({
    stemmer: new Map([
        ["ly", ""]
    ]),
    filter: new Set([
        "and",
    ]),
    mapper: new Map([
        ["é", "e"]
    ]),
    matcher: new Map([
        ["xvi", "16"]
    ]),
    replacer: [
        /[´`’ʼ]/g, "'"
    ],
});
```

Further reading: [Encoder Processing Workflow](#encoder-processing-workflow)

Or use built-in helpers alternatively:

```js
const encoder = new Encoder()
    .addStemmer("ly", "")
    .addFilter("and")
    .addMapper("é", "e")
    .addMatcher("xvi", "16")
    .addReplacer(/[´`’ʼ]/g, "'");
```

Some of the built-in helpers will automatically detect inputs and use the proper helper under the hood. So theoretically you can lazily just write:

```js
const encoder = new Encoder()
    .addStemmer("ly", "")
    .addFilter("and")
    .addReplacer("é", "e")
    .addReplacer("xvi", "16")
    .addReplacer(/[´`’ʼ]/g, "'");
```

You can also use presets and extend it with custom options:

```js
import EnglishBookPreset from "flexsearch/lang/en";
const encoder = new Encoder(
    EnglishBookPreset,
    // use the preset but don't filter terms
    { filter: false }
);
```

Equivalent:

```js
const encoder = new Encoder(EnglishBookPreset);
encoder.assign({ filter: false });
```

Assign multiple extensions to the encoder instance:

```js
import Charset from "flexsearch";
import EnglishBookPreset from "flexsearch/lang/en";
// stack definitions to the encoder instance
const encoder = new Encoder()
    .assign(Charset.LatinSoundex)
    .assign(EnglishBookPreset)
    // extend or override preset options:
    .assign({ minlength: 3 });
    // assign further presets ...
```

> When adding extension to the encoder every previously assigned configuration is still intact, also when assigning custom functions, the previously added function will still execute.

Add custom transformations to an existing index:

```js
const encoder = new Encoder(Charset.Normalize);
// filter terms
encoder.addFilter("and");
// replace single chars
encoder.addMapper("é", "e");
// replace char sequences
encoder.addMatcher("xvi", "16");
// replace single chars or char sequences
// at the end of a term
encoder.addStemmer("ly", "");
// custom regex replace
encoder.addReplacer(/[´`’ʼ]/g, "'");
```

Using a custom filter:

```js
encoder.addFilter(function(str){
    // return true to keep the content
    return str.length > 1;
});
```

Shortcut for just assigning one encoder configuration to an index:

```js
const index = new Index({ 
    encoder: Charset.Normalize
});
```

## Encoder Options

<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr></tr>
    <tr>
        <td colspan="4">You can just choose one of those 3 options:</td>
    </tr>
    <tr>
        <td><code>include</code></td>
        <td>
            <a href="#encoder-split-options">Encoder Split Options</a>
        </td>
        <td>Define which of the string contents should be included (inclusion properties defaults to false)</td>
        <td>{ letter: true, number: true }</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>exclude</code></td>
        <td>
            <a href="#encoder-split-options">Encoder Split Options</a>
        </td>
        <td>Define which of the string contents should be excluded (exclusion properties defaults to true)</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>split</code></td>
        <td>
            false<br>
            RegExp<br>
            String<br>
            <a href="#encoder-split-options">Encoder Split Options</a>
        </td>
        <td>
            The expression used to split the content into terms
        </td>
        <td>→ include { letter: true, number: true }</td>
    </tr>
    <tr>
        <td colspan="4">Other options:</td>
    </tr>
    <tr>
        <td><code>dedupe</code></td>
        <td>
            Boolean
        </td>
        <td>Deduplicate consecutive letters, e.g. "missing" to "mising"</td>
        <td>true</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>numeric</code></td>
        <td>
            Boolean
        </td>
        <td>By default, the extended numeric support (Triplets) inherits from chosen <a href="#encoder-split-options">Encoder Split Options</a>. You probably might want to disable Triplets to get a more exact result (fewer entries) in some cases.</td>
        <td>true</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>minlength</code></td>
        <td>
            Number
        </td>
        <td>Set the minimum term length which should be added to the index. This limit does not apply to the <code>forward</code> tokenizer. You still get results when just typing "f" on a term "flexsearch" when e.g. <code>minlength: 4</code> was used.</td>
        <td>1</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>maxlength</code></td>
        <td>
            Number
        </td>
        <td>Set the maximum term length which should be added to the index. Larger content will drop.</td>
        <td>1</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>rtl</code></td>
        <td>
            Boolean
        </td>
        <td>Force Right-To-Left encoding (you should just apply this when the string content was not already encoded as RTL)</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>normalize</code></td>
        <td>
            <code>true</code> enable normalization (default)<br>
            <code>false</code> disable normalization<br>
            <code>function(str) => str</code> custom function
        </td>
        <td>The normalization stage will apply basic charset normalization e.g. by replacing "é" to "e"</td>
        <td>true</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>prepare</code></td>
        <td>
            <code>function(str) => str</code> custom function
        </td>
        <td>The preparation stage is a custom function direct followed when normalization was done</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>finalize</code></td>
        <td>
            <code>function([str]) => [str]</code> custom function
        </td>
        <td>The finalization stage is a custom function executed at the last task in the encoding pipeline (here it gets an array of tokens and need to return an array of tokens)</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>filter</code></td>
        <td>
            <code>Set(["and", "to", "be"])</code><br>
            <code>function(str) => bool</code> custom function<h2></h2>
            <code>encoder.addFilter("and")</code>
        </td>
        <td>Stop-word filter is like a blacklist of words to be filtered out from indexing at all (e.g. "and", "to" or "be"). This is also very useful when using <a href="../README.md#context-search">Context Search</a></td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>stemmer</code></td>
        <td>
            <code>Map([["ing", ""], ["ies", "y"]])</code><h2></h2>
            <code>encoder.addStemmer("ing", "")</code>
        </td>
        <td>Stemmer will normalize several linguistic mutations of the same word (e.g. "run" and "running", or "property" and "properties"). This is also very useful when using <a href="../README.md#context-search">Context Search</a></td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>mapper</code></td>
        <td>
            <code>Map([["é", "e"], ["ß", "ss"]])</code><h2></h2>
            <code>encoder.addMapper("é", "e")</code>
        </td>
        <td>Mapper will replace a single char (e.g. "é" into "e")</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>matcher</code></td>
        <td>
            <code>Map([["and", "&"], ["usd", "$"]])</code><h2></h2>
            <code>encoder.addMatcher("and", "&")</code>
        </td>
        <td>Matcher will do same as Mapper but instead of single chars it will replace char sequences</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>replacer</code></td>
        <td>
            <code>[/[^a-z0-9]/g, "", /([^aeo])h(.)/g, "$1$2"])</code><h2></h2>
            <code>encoder.addReplacer(/[^a-z0-9]/g, "")</code>
        </td>
        <td>Replacer takes custom regular expressions and couldn't get optimized in the same way as Mapper or Matcher. You should take this as the last option when no other replacement can do the same.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>cache</code></td>
        <td>
            Boolean
        </td>
        <td>In some very rare situations (large consecutive content with high cardinality) it might be useful to disable the internal event-loop-cache</td>
        <td>true</td>
    </tr>
</table>

> [!TIP]
> The methods `.addMapper()`, `.addMatcher()` and `.addReplacer()` might be confusing. For this reason they will automatically resolve to the right one when just using the same method for every rule. You can simplify this e.g. by just use `.addReplacer()` for each of this 3 rules.

### Encoder Split Options

<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td><code>letter</code></td>
        <td>
            Boolean
        </td>
        <td>Toggle inclusion of letters on/off</td>
        <td>true</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>number</code></td>
        <td>
            Boolean
        </td>
        <td>Toggle inclusion of numerics on/off</td>
        <td>true</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>symbol</code></td>
        <td>
            Boolean
        </td>
        <td>Toggle inclusion of symbols on/off</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>punctuation</code></td>
        <td>
            Boolean
        </td>
        <td>
            Toggle inclusion of punctuation on/off
        </td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>control</code></td>
        <td>
            Boolean
        </td>
        <td>Toggle inclusion of control chars on/off</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>char</code></td>
        <td>
            String<br>
            Array[String]
        </td>
        <td>Toggle inclusion of specific chars on/off</td>
        <td>false</td>
    </tr>
</table>

## Custom Encoder

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

You can't extend to the built-in tokenizer "exact", "forward", "bidirectional" or "full".
If nothing of them are applicable for your task you should tokenize everything inside your custom encoder function.

If you get some good results please feel free creating a pull request to share your encoder to the community.

### Encoder Processing Workflow

1. Charset Normalization
2. Custom Preparation
3. Split Content (into terms, apply includes/excludes)
4. Filter: Pre-Filter
5. Stemmer (substitute term endings)
6. Filter: Post-Filter
7. Replace Chars (Mapper)
8. Letter Deduplication
9. Matcher (substitute partials)
10. Custom Regex (Replacer)
11. Custom Finalize

This workflow schema might help you to understand each step in the iteration:
<br><br>
<img src="encoder-workflow.svg" width="750px">

## Right-To-Left Support

> [!NOTE]
> When a string is already encoded/interpreted as Right-To-Left you didn't need to use that. This option is just useful, when the source content wasn't encoded as RTL.

Just set the property `rtl: true` when creating the `Encoder`:

```js
const encoder = new Encoder({ rtl: true });
```

## CJK Word Break (Chinese, Japanese, Korean)

```js
const index = new Index({ encoder: Charset.CJK });
index.add(0, "一个单词");
var results = index.search("单词");
```

## Built-In Language Packs

- English: `en`
- German: `de`
- French: `fr`

### Import Language Packs: ES6 Modules

The most simple way to assign charset/language specific encoding via modules is:

```js
import EnglishPreset from "flexsearch/lang/en";
const index = Index({
    charset: EnglishPreset
});
```

You can stack up and combine multiple presets:

```js
import { Charset } from "flexsearch";
import EnglishPreset from "flexsearch/lang/en";

const index = Index({
    charset: new Encoder(
        Charset.LatinAdvanced,
        EnglishPreset,
        { minlength: 3 }
    )
});
```

You can also assign the encoder preset directly:

```js
const index = Index({
    encoder: Charset.Default
});
```

#### Import Language Packs: ES5 Legacy Browser

When loading language packs, make sure that the library was loaded before:

```html
<script src="dist/flexsearch.compact.min.js"></script>
<script src="dist/lang/en.min.js"></script>
```

The language packs are registered on `FlexSearch.Language`:

```js
const index = FlexSearch.Index({
    encoder: FlexSearch.Language["en"]
});
```

You can stack up and combine multiple presets:

```js
const index = FlexSearch.Index({
    charset: new FlexSearch.Encoder(
        FlexSearch.Charset.LatinAdvanced,
        FlexSearch.Language["en"],
        { minlength: 3 }
    )
});
```

#### Import Language Packs: Node.js

In Node.js all built-in language packs files are available by its scope:

```js
const EnglishPreset = require("flexsearch/lang/en");
const index = new Index({
    encoder: EnglishPreset
});
```

### Share Encoders

Assigning the `Encoder` instance to the top level configuration will share the encoder to all fields. You should avoid this when contents of fields don't have the same type of content (e.g. one field contains terms, another contains numeric IDs).

Sharing the encoder can improve encoding efficiency and memory allocation, but when not properly used also has negative effect to the performance. You can share encoders to any type of index, also through multiple instances of indexes (also documents).

You should group similar types of contents to one encoder respectively. When you have different content types then define one for each of them.

In this example there are two Document-Indexes for two different documents "orders" and "billings". You can also share encoder to different fields of just one document.

```js
// usual term encoding
const encoder_terms = Encoder(
    Charset.LatinAdvanced,
    // just add letters (no numbers)
    { include: { letter: true } }
);
// numeric encoding
const encoder_numeric = new Encoder(Charset.Default);

const orders = Document({
   document: {
       id: "id",
       index: [{
          field: "product_title",
          encoder: encoder_terms
       },{
          field: "product_details",
          encoder: encoder_terms
       },{
          field: "order_date",
          encoder: encoder_numeric
       },{
          field: "customer_id",
          encoder: encoder_numeric
       }]
   }
});

const billings = Document({
   document: {
      id: "id",
      index: [{
         field: "product_title",
         encoder: encoder_terms
      },{
         field: "product_content",
         encoder: encoder_terms
      },{
         field: "billing_date",
         encoder: encoder_numeric
      },{
         field: "customer_id",
         encoder: encoder_numeric
      }]
   }
});
```

### Merge Documents

When you have multiple document types (indexed by multiple indexes) but some of the data has same fields (like in the example above) and you can refer them by any identifier or key, you should consider merging those documents into one. This will hugely improve index size.

E.g. when you merge "orders" and "billings" from example above by ID, then you can use just one index:

```js
const encoder_terms = Encoder(
    Charset.LatinAdvanced,
    // just add letters (no numbers)
    { include: { letter: true } }
);
const encoder_numeric = new Encoder(
    Charset.Default
);

const merged = Document({
   document: {
       id: "id",
       index: [{
          field: "product_title",
          encoder: encoder_terms
       },{
          field: "product_details",
          encoder: encoder_terms
       },{
          field: "order_date",
          encoder: encoder_numeric
       },{
           field: "billing_date",
           encoder: encoder_numeric
       },{
          field: "customer_id",
          encoder: encoder_numeric
       }]
   }
});
```
