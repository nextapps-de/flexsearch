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