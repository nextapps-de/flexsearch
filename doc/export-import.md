## Import / Export (In-Memory)

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
// Config is restored automatically from the export payload
const index = new Index({});

const files = await fs.readdir("./export/");
for(let i = 0; i < files.length; i++){
  const data = await fs.readFile("./export/" + files[i], "utf8");
  await index.import(files[i], data);
}
```

The export payload includes a `.cfg` key that carries all index configuration (tokenizer, encoder, resolution, context, score, etc). A plain `new Index({})` or `new Document({})` is sufficient — no need to repeat the original options.

> When a custom encoder or score function is defined **inline** in the original config it is serialized as source text and reconstructed on import. If the function closes over outer variables those bindings **will not** be available after restore — keep any required values inside the function body.

> The feature "fastupdate" is automatically disabled on import.

<a name="serialize"></a>
## Fast-Boot Serialization for Server-Side-Rendering (PHP, Python, Ruby, Rust, Java, Go, Node.js, ...)

> This is an experimental feature with limited support which probably might drop in future release. You're welcome to give some feedback.

When using Server-Side-Rendering you can create a different export which instantly boot up. Especially when using Server-side rendered content, this could help to restore a __<u>static</u>__ index on page load.

> When your index is too large you should use the default export/import mechanism.

You'll need Javascript to create the serialized output. Alternatively just create a small Node.js script to build the output.

As the first step populate the FlexSearch index with your contents.

You have three options:

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

### 3. Self-contained inject (config embedded)

Pass `true` as the second argument to embed the index configuration inside the serialized output. The restored index needs no external config at all:

```js
const fn_body = index.serialize(false, true);
const index2 = new Function("FlexSearch", fn_body)(FlexSearch);
```

This is the recommended approach when the index was built with custom options (custom encoder, score function, tokenizer, etc.) and you cannot guarantee the consumer will supply the same config. The encoder and score functions are serialized as source text — the same caveat about closure variables applies as with export/import.

<a name="document-serialize"></a>

## Document Fast-Boot Serialization

Document indexes can also be serialized for fast-boot on the client side. This works similarly to Index serialization but handles multiple fields, tags, and storage.

### Serialize a Document Index

```js
const fn_string = document.serialize();
```

This produces a function string that looks like:

```js
function inject(doc){
    doc.reg = new Set([/* ... */]);
    doc.index.get("fieldName").map = new Map([/* ... */]);
    doc.index.get("fieldName").ctx = new Map([/* ... */]);
    // ... for each field
}
```

### Restore the serialized Document

**Option A — self-contained inject (config embedded):**

```js
const fn_body = document.serialize(false, false, true);
const doc = new Function("FlexSearch", fn_body)(FlexSearch);

// Ready to search immediately
const results = doc.search("your query");
```

Pass `true` as the third argument to embed all field configuration (encoders, tokenizers, score functions, etc.) in the serialized output. `FlexSearch` must be in scope when the function runs.

**Option B — inject into a pre-created document (no config needed):**

```js
const fn_body = document.serialize(false);
const inject = new Function("doc", fn_body);

// A plain new Document({}) is enough — config is read from the serialized data
const doc = new Document({});
inject(doc);

// Ready to search
const results = doc.search("your query");
```

### Without function wrapper

Get just the body if you want to wrap it differently:

```js
const fn_body = document.serialize(false);
const inject = new Function("doc", fn_body);
```

<a name="compression"></a>

## Compression

Compression is decoupled from export and import. Call `export()` to collect the payload, then `compress()` separately:

```js
import { compress, decompress } from "flexsearch";

// export() with no args returns a Map<string, string> synchronously
const payload = index.export();

// compress() accepts a Map or a string
const compressed = await compress(payload);   // Promise<Uint8Array>
```

To restore:

```js
const json = await decompress(compressed);    // Promise<string>
const entries = JSON.parse(json);             // Array<[key, value]>

const index2 = new Index({});                 // no config needed — cfg key restores it
for(const [key, value] of entries) index2.import(key, value);
```

Same pattern for Document:

```js
const payload = doc.export();
const compressed = await compress(payload);

// ...

const doc2 = new Document({});
const entries = JSON.parse(await decompress(compressed));
for(const [key, value] of entries) doc2.import(key, value);
```

Compressing serialized Fast-Boot output works the same way — pass the string directly:

```js
const fn_string = index.serialize(false);
const compressed = await compress(fn_string);   // string → Uint8Array

const restored = await decompress(compressed);  // Uint8Array → string
const inject = new Function("index", restored);
```

#### API

| Function | Signature | Returns |
|---|---|---|
| `compress` | `(data: string \| Map)` | `Promise<Uint8Array>` |
| `decompress` | `(data: Uint8Array)` | `Promise<string>` |

