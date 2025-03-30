## Worker Parallelism (Browser + Node.js)

The internal worker model is distributed by document fields and will solve subtasks in parallel.

When using a document index, then just apply the option "worker":

```js
const index = new Document({
    index: ["tag", "name", "title", "text"],
    worker: true
});

index.add({ 
    id: 1, tag: "cat", name: "Tom", title: "some", text: "some" 
}).add({
    id: 2, tag: "dog", name: "Ben", title: "title", text: "content" 
}).add({ 
    id: 3, tag: "cat", name: "Max", title: "to", text: "to" 
}).add({ 
    id: 4, tag: "dog", name: "Tim", title: "index", text: "index" 
});
```

```
Worker 1: { 1: "cat", 2: "dog", 3: "cat", 4: "dog" }
Worker 2: { 1: "Tom", 2: "Ben", 3: "Max", 4: "Tim" }
Worker 3: { 1: "some", 2: "title", 3: "to", 4: "index" }
Worker 4: { 1: "some", 2: "content", 3: "to", 4: "index" }
```

When you perform a field search through all fields then this task is being balanced perfectly through all workers, which can solve their subtasks independently.

### Worker Index

Above we have seen that documents will create worker automatically for each field. You can also create a `Worker`-Index directly. It's the same as using `Index` instead of `Document`.

> Worker-Index always return a `Promise` for all methods called on the index.

#### ES6 Module (Bundle):

When using one of the bundles from `/dist/` you can create a Worker-Index:

```js
import { Worker } from "./dist/flexsearch.bundle.module.min.js";
const index = new Worker({/* options */ });
await index.add(1, "some");
await index.add(2, "content");
await index.add(3, "to");
await index.add(4, "index");
```

#### ES6 Module (Non-Bundle):

When not using a bundle you can take the worker file from `/dist/` folder as follows:

```js
import Worker from "./dist/module/worker.js";
const index = new Worker({/* options */ });
index.add(1, "some")
     .add(2, "content")
     .add(3, "to")
     .add(4, "index");
```

#### Browser Legacy (Bundle):

When loading a legacy bundle via script tag (non-modules):

```js
const index = new FlexSearch.Worker({/* options */ });
await index.add(1, "some");
await index.add(2, "content");
await index.add(3, "to");
await index.add(4, "index");
```

### Worker (Node.js)

The worker model for Node.js is based on native worker threads and works exactly the same way:

```js
const { Document } = require("flexsearch");

const index = new Document({
    index: ["tag", "name", "title", "text"],
    worker: true
});
```

Or create a single worker instance for a non-document index:

```js
const { Worker } = require("flexsearch");
const index = new Worker({ options });
```

## The Worker Async Model (Best Practices)

A worker will always perform as async. On a query method call you always should handle the returned promise (e.g. use `await`) or pass a callback function as the last parameter.

```js
const index = new Document({
    index: ["tag", "name", "title", "text"],
    worker: true
});
```

All requests and sub-tasks will run in parallel (prioritize "all tasks completed"):

```js
index.searchAsync(query, callback);
index.searchAsync(query, callback);
index.searchAsync(query, callback);
```

Also (prioritize "all tasks completed"):

```js
index.searchAsync(query).then(callback);
index.searchAsync(query).then(callback);
index.searchAsync(query).then(callback);
```

Or when you have just one callback when all requests are done, simply use `Promise.all()` which also prioritize "all tasks completed":

```js
Promise.all([
    index.searchAsync(query),
    index.searchAsync(query),
    index.searchAsync(query)
]).then(callback);
```

Inside the callback of `Promise.all()` you will also get an array of results as the first parameter respectively for each query you put into.

When using `await` you can prioritize the order (prioritize "first task completed") and solve requests one by one and just process the sub-tasks in parallel:

```js
await index.searchAsync(query);
await index.searchAsync(query);
await index.searchAsync(query);
```

Same for `index.add()`, `index.append()`, `index.remove()` or `index.update()`. Here there is a special case which isn't disabled by the library, but you need to keep in mind when using Workers.

When you call the "synced" version on a worker index:

```js
index.add(doc);
index.add(doc);
index.add(doc);
// contents aren't indexed yet,
// they just queued on the message channel 
```

Of course, you can do that but keep in mind that the main thread does not have an additional queue for distributed worker tasks. Running these in a long loop fires content massively to the message channel via `worker.postMessage()` internally. Luckily the browser and Node.js will handle such incoming tasks for you automatically (as long enough free RAM is available). When using the "synced" version on a worker index, the content isn't indexed one line below, because all calls are treated as async by default.

> When adding/updating/removing large bulks of content to the index (or high frequency), it is recommended to use the async version along with `async/await` to keep a low memory footprint during long processes.


## Extern Worker Configuration

When using Worker by __also__ assign custom functions to the options e.g.:

- Custom Encoder
- Custom Encoder methods (normalize, prepare, finalize)
- Custom Score (function)
- Custom Filter (function)
- Custom Fields (function)

... then you'll need to move your __field configuration__ into a file which exports the configuration as a `default` export. The field configuration is not the whole Document-Descriptor.

When not using custom functions in combination with Worker you can skip this part.

Since every field resolves into a dedicated Worker, also every field which includes custom functions should have their own configuration file accordingly.

Let's take this document descriptor:

```js
{
    document: {
        index: [{
            // this is the field configuration
            // ---->
            field: "custom_field",
            custom: function(data){
                return "custom field content";
            }
            // <------
        }]
    }
};
```

The configuration which needs to be available as a default export is:

```js
{
    field: "custom_field",
    custom: function(data){
        return "custom field content";
    }
};
```

You're welcome to make some suggestions how to improve the handling of extern configuration.

### Example Node.js:

An extern configuration for one WorkerIndex, let's assume it is located in `./custom_field.js`:
```js
const { Charset } = require("flexsearch");
const { LatinSimple } = Charset;
// it requires a default export:
module.exports = {
    encoder: LatinSimple,
    tokenize: "forward",
    // custom function:
    custom: function(data){
        return "custom field content";
    }
};
```

Create Worker Index along the configuration above:
```js
const { Document } = require("flexsearch");
const flexsearch = new Document({
    worker: true,
    document: {
        index: [{
            // the field name needs to be set here
            field: "custom_field",
            // path to your config from above:
            config: "./custom_field.js",
        }]
    }
});
```

### Browser (ESM)

An extern configuration for one WorkerIndex, let's assume it is located in `./custom_field.js`:
```js
import { Charset } from "./dist/flexsearch.bundle.module.min.js";
const { LatinSimple } = Charset;
// it requires a default export:
export default {
    encoder: LatinSimple,
    tokenize: "forward",
    // custom function:
    custom: function(data){
        return "custom field content";
    }
};
```

Create Worker Index with the configuration above:
```js
import { Document } from "./dist/flexsearch.bundle.module.min.js";
// you will need to await for the response!
const flexsearch = await new Document({
    worker: true,
    document: {
        index: [{
            // the field name needs to be set here
            field: "custom_field",
            // Absolute URL to your config from above:
            config: "http://localhost/custom_field.js"
        }]
    }
});
```

Here it needs the __absolute URL__, because the WorkerIndex context is from type `Blob` and you can't use relative URLs starting from this context.

### Test Case

As a test the whole IMDB data collection was indexed, containing of:

JSON Documents: 9,273,132<br>
Fields: 83,458,188<br>
Tokens: 128,898,832<br>

The used index configuration has 2 fields (using bidirectional context of `depth: 1`), 1 custom field, 2 tags and a full datastore of all input json documents.

A non-Worker Document index requires 181 seconds to index all contents.<br>
The Worker index just takes 32 seconds to index them all, by processing every field and tag in parallel. For such large content it is a quite impressive result.

## Export / Import Worker Indexes (Node.js)

Worker will save/load their data dedicated and does not need the message channel for the data transfer.

### Basic Worker Index

> This feature follows the strategy of using [Extern Worker Configuration](#extern-worker-configuration) in combination with [Basic Export Import](../example/nodejs-commonjs/basic-export-import).

Example (CommonJS): [basic-worker-export-import](../example/nodejs-commonjs/basic-worker-export-import)<br>
Example (ESM): [basic-worker-export-import](../example/nodejs-esm/basic-worker-export-import)

Provide the index configuration and keep it, because it isn't stored. Provide a parameter `config` which is including the filepath to the extern configuration file:

```js
const dirname = import.meta.dirname;
const config = {
    tokenize: "forward",
    config: dirname + "/config.js"
};
```

> Any changes you made to the configuration will almost require a full re-index.

Provide the extern configuration file e.g. `/config.js` as a default export including the methods `export` and `import`:

```js
import { promises as fs } from "fs";

export default {
    tokenize: "forward",
    export: async function(key, data){
        // like the usual export write files by key + data
        await fs.writeFile("./export/" + key, data, "utf8");
    },
    import: async function(index){
        // get the file contents of the export directory
        let files = await fs.readdir("./export/");
        files = await Promise.all(files);
        // loop through the files and push their contents to the index
        // by also passing the filename as the first parameter
        for(let i = 0; i < files.length; i++){
            const data = await fs.readFile("./export/" + files[i], "utf8");
            index.import(files[i], data);
        }
    }
};
```

Create your index by assigning the configuration file from above:

```js
import { Worker as WorkerIndex } from "flexsearch";
const index = await new WorkerIndex(config);
// add data to the index
// ...
```

Export the index:

```js
await index.export();
```

Import the index:

```js
// create the same type of index you have used by .export()
// along with the same configuration
const index = await new WorkerIndex(config);
await index.import();
```

### Document Worker Index

> This feature follows the strategy of using [Extern Worker Configuration](#extern-worker-configuration) in combination with [Document Export Import](../example/nodejs-esm/document-export-import).

Document Worker exports all their feature including:

- Multi-Tag Indexes
- Context-Search Indexes
- Document-Store

Example (CommonJS): [document-worker-export-import](../example/nodejs-commonjs/document-worker-export-import)<br>
Example (ESM): [document-worker-export-import](../example/nodejs-esm/document-worker-export-import)

Provide the index configuration and keep it, because it isn't stored. Provide a parameter `config` which is including the filepath to the extern configuration file:

```js
const dirname = import.meta.dirname;
const config = {
    worker: true,
    document: {
        id: "tconst",
        store: true,
        index: [{
            field: "primaryTitle",
            config: dirname + "/config.primaryTitle.js"
        },{
            field: "originalTitle",
            config: dirname + "/config.originalTitle.js"
        }],
        tag: [{
            field: "startYear"
        },{
            field: "genres"
        }]
    }
};
```

> Any changes you made to the configuration will almost require a full re-index.

Provide the extern configuration file as a default export including the methods `export` and `import`:

```js
import { promises as fs } from "fs";

export default {
    tokenize: "forward",
    export: async function(key, data){
        // like the usual export write files by key + data
        await fs.writeFile("./export/" + key, data, "utf8");
    },
    import: async function(file){
        // instead of looping you will get the filename as 2nd paramter
        // just return the loaded contents as a string
        return await fs.readFile("./export/" + file, "utf8");
    }
};
```

Create your index by assigning the configuration file from above:

```js
import { Document } from "flexsearch";
const document = await new Document(config);
// add data to the index
// ...
```

Export the index by providing a key-data handler:

```js
await document.export(async function(key, data){
    await fs.writeFile("./export/" + key, data, "utf8");
});
```

Import the index:

```js
const files = await fs.readdir("./export/");
// create the same type of index you have used by .export()
// along with the same configuration
const document = await new Document(config);
await Promise.all(files.map(async file => {
    const data = await fs.readFile("./export/" + file, "utf8");
    // call import (async)
    await document.import(file, data);
}));
```

## CSP-friendly Worker (Browser)

When just using worker by passing the option `worker: true`, the worker will be created by code generation under the hood. This might have issues when using strict CSP settings.

You can overcome this issue by passing the filepath to the worker file like `worker: "./worker.js"`. The original worker file is located at `src/worker/worker.js`.