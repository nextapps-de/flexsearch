## Encoder

> [!IMPORTANT]
> You shouldn't miss this part as it is one of the most important aspects of FlexSearch.

Search capabilities highly depends on language processing. The Encoder class is one of the most important core functionalities of FlexSearch.

Current Encoding Pipeline:

1. Charset Normalization
2. Custom Preparation
3. Split Content (into terms, apply includes/excludes)
4. Filter: Pre-Filter
5. Matcher (substitute partials)
6. Stemmer (substitute term endings)
7. Filter: Post-Filter
8. Replace Chars (Mapper)
9. Custom Regex (Replacer)
10. Letter Deduplication
11. Custom Finalize

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

Shortcut for just assigning one encoder configuration to an index:

```js
const index = new Index({ 
    encoder: Charset.Normalize
});
```

### Encoder Processing Workflow

This workflow schema might help you to understand each step in the iteration:
<br><br>
<img src="encoder-workflow.svg">

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

You can't extend to the built-in tokenizer "exact", "forward", "bidirectional" or "full".
If nothing of them are applicable for your task you should tokenize everything inside your custom encoder function.

If you get some good results please feel free to share your encoder.

### Add language-specific stemmer and/or filter

> __Stemmer:__ several linguistic mutations of the same word (e.g. "run" and "running")

> __Filter:__ a blacklist of words to be filtered out from indexing at all (e.g. "and", "to" or "be")

Assign a private custom stemmer or filter during creation/initialization:
```js
const index = new Index({
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
const index = new Index({
    filter: function(value){
        // just add values with length > 1 to the index
        return value.length > 1;
    }
});
```

Load language packs with legacy browser support (non-modules):

```html
<html>
<head>
    <script src="js/flexsearch.bundle.min.js"></script>
    <script src="js/lang/en.min.js"></script>
    <script src="js/lang/de.min.js"></script>
</head>
...
```

In Node.js all built-in language packs files are available by its scope:

```js
const EnglishPreset = require("flexsearch/lang/en");
const index = new Index({
    encoder: EnglishPreset
});
```

<a name="rtl"></a>
## Right-To-Left Support

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
## CJK Word Break (Chinese, Japanese, Korean)

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

## Built-In Language Packs

- English: `en`
- German: `de`
- French: `fr`

### 1. Import Language Packs: ES6 Modules

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

#### 2. Import Language Packs: ES5 Legacy Browser

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
