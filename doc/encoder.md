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
