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

### CSP-friendly Worker (Browser)

When just using worker by passing the option `worker: true`, the worker will be created by code generation under the hood. This might have issues when using strict CSP settings.

You can overcome this issue by passing the filepath to the worker file like `worker: "./worker.js"`. The original worker file is located at `src/worker/worker.js`.