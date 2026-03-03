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
const index = new Index({/* keep old config and place it here */});

const files = await fs.readdir("./export/");
for(let i = 0; i < files.length; i++){
  const data = await fs.readFile("./export/" + files[i], "utf8");
  await index.import(files[i], data);
}
```

> You'll need to use the same configuration as you used before the export. Any changes on the configuration needs to be re-indexed.

<a name="serialize"></a>
## Fast-Boot Serialization for Server-Side-Rendering (PHP, Python, Ruby, Rust, Java, Go, Node.js, ...)

> This is an experimental feature with limited support which probably might drop in future release. You're welcome to give some feedback.

When using Server-Side-Rendering you can create a different export which instantly boot up. Especially when using Server-side rendered content, this could help to restore a __<u>static</u>__ index on page load. Document-Indexes aren't supported yet for this method.

> When your index is too large you should use the default export/import mechanism.

You'll need Javascript to create the serialized output. Alternatively just create a small Node.js script to build the output.

As the first step populate the FlexSearch index with your contents.

You have two options:

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

> You'll need to use the same configuration as you used before the export. Any changes on the configuration needs to be re-indexed.

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

On the client side, create a new Document with the same configuration and inject:

```js
const config = {
    document: {
        id: "id",
        index: [{field: "title"}, {field: "body"}]
    }
};

const doc = new Document(config);
inject(doc);

// Now search on the restored index
const results = doc.search("your query");
```

### Without function wrapper

Get just the body if you want to wrap it differently:

```js
const fn_body = document.serialize(false);
const inject = new Function("doc", fn_body);
```

<a name="compression"></a>

## Compression Utilities

For large indexes, you can compress the serialized output using gzip compression to reduce payload size for delivery over the network or storage.

### Compress Serialized Data

```js
import { compress, decompress } from "flexsearch";

// Get compressed serialized output directly
const compressed = await document.serialize(true, true);
// Returns Uint8Array

// Store or send the compressed data
const buffer = Buffer.from(compressed);
await fs.writeFile("./serialized.js.gz", buffer);
```

### Decompress and Restore

```js
// Load compressed data
const buffer = await fs.readFile("./serialized.js.gz");
const compressed = new Uint8Array(buffer);

// Decompress
const fn_string = await decompress(compressed);

// Create inject function
const inject = new Function("doc", fn_string.slice(17, -1)); // Remove "function inject(doc){" and "}"

// Create document with same config and inject
const doc = new Document(config);
inject(doc);
```

### Compression Utilities API

#### compress(data: string | Uint8Array): Promise<Uint8Array>

Compress a string or binary data using gzip.

```js
const compressed = await compress("some string data");
```

#### decompress(data: Uint8Array): Promise<string>

Decompress gzip-compressed data back to string.

```js
const decompressed = await decompress(compressed);
```

### Compression Ratios

Typical compression ratios for serialized FlexSearch data:

- Small indexes (< 10KB): 15-25% reduction
- Medium indexes (10KB - 100KB): 25-35% reduction
- Large indexes (> 100KB): 30-45% reduction

Text-heavy content with repetitive terms compresses even better (40-50%+).

### Streaming Architecture

The compression is implemented with streaming to minimize memory overhead:

1. **Serialization with compression toggle:**
```js
const compressed = await document.serialize(true, true);
```

2. **Standalone compression:**
```js
const data = "...";
const compressed = await compress(data);
```

Both use efficient streaming to avoid allocating the entire uncompressed data in memory.

### Deployment Patterns

#### Pattern 1: Inline in HTML (small indexes)

```html
<script>
const serialized = "function inject(doc){...}";
const doc = new Document(config);
const inject = new Function("doc", serialized.slice(17, -1));
inject(doc);
</script>
```

#### Pattern 2: External gzipped script (medium indexes)

```html
<!-- Application/gzip in response headers + CompressionStream for decompression -->
<script src="serialized.js.gz"></script>
<!-- Browser automatically decompresses, then executes -->
```

#### Pattern 3: Dynamic loader with compression (large indexes)

```js
async function loadSerializedIndex() {
    const response = await fetch("serialized.js.gz");
    const compressed = new Uint8Array(await response.arrayBuffer());
    const fn_string = await decompress(compressed);
    
    const doc = new Document(config);
    const inject = new Function("doc", fn_string.slice(17, -1));
    inject(doc);
    return doc;
}

const doc = await loadSerializedIndex();
```

#### Pattern 4: Data URLs (very small indexes)

```js
const fn_string = document.serialize(true, false);
const dataUrl = "data:text/javascript;base64," + btoa(fn_string);
// Use in <script src> or dynamic loading
```

<a name="export"></a>

## Export / Import (In-Memory)

### Node.js

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
const index = new Index({/* keep old config and place it here */});

const files = await fs.readdir("./export/");
for(let i = 0; i < files.length; i++){
  const data = await fs.readFile("./export/" + files[i], "utf8");
  await index.import(files[i], data);
}
```

> You'll need to use the same configuration as you used before the export. Any changes on the configuration needs to be re-indexed.

### Browser

```js
index.export(function(key, data){ 
    
    // you need to store both the key and the data!
    // e.g. use the key for the filename and save your data
    
    localStorage.setItem(key, data);
});
```

> The size of the export corresponds to the memory consumption of the library. To reduce export size you have to use a configuration which has less memory footprint (use the table at the bottom to get information about configs and its memory allocation).

When your save routine runs asynchronously you have to use `async/await` or return a promise:

```js
index.export(function(key, data){ 
    
    return new Promise(function(resolve){
        
        // do the saving as async

        resolve();
    });
});
```

Before you can import data, you need to create your index first. For document indexes provide the same document descriptor you used when export the data. This configuration isn't stored in the export.

```js
const index = new Index({/* keep old config and place it here */});
```

To import the data just pass a key and data:

```
const data = localStorage.getItem(key);
index.import(key, data);
```

You need to import every key! Otherwise, your index does not work. You need to store the keys from the export and use this keys for the import (the order of the keys can differ).

> The feature "fastupdate" is automatically disabled on import.

This is just for demonstration and is not recommended, because you might have other keys in your localStorage which aren't supported as an import:

```js
var keys = Object.keys(localStorage);

for(let i = 0, key, data; i < keys.length; i++){
    key = keys[i]
    data = localStorage.getItem(key);
    index.import(key, data);
}
```
