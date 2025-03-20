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
import { Worker as WorkerIndex } from "flexsearch/esm";
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
import { Document } from "flexsearch/esm";
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