# FlexSearch

## Introduction

This project is an OpenHarmony-adapted version that is transplanted based on the open-source JS library [FlexSearch](https://github.com/nextapps-de/flexsearch/tree/0.7.2).

FlexSearch is a fast, full-text search library with zero dependencies. When it comes to raw search speed, FlexSearch outperforms every single searching library out there
and also provides flexible search capabilities like multi-field search, phonetic transformations, or partial matching. Depending on the used options, it also provides the most memory-efficient index.
FlexSearch introduces a new scoring algorithm called "contextual index" based on a pre-scored lexical dictionary architecture, which greatly improves the query speed in actual use compared with other libraries.
FlexSearch also provides you a non-blocking asynchronous processing model as well as web workers to perform any updates or queries on the index in parallel through dedicated balanced threads.

## How to Install

```shell
ohpm install @ohos/flexsearch
```

For details about the OpenHarmony ohpm environment configuration, see [OpenHarmony HAR](https://gitcode.com/openharmony-tpc/docs/blob/master/OpenHarmony_har_usage.en.md).

## How to Use

### Quick Start

Use **Index** for single-field search and **Document** for multi-field search. The following uses **Document** as an example.

```javascript
import FlexSearch, { StoreOption, IndexOptionsForDocumentSearch } from "@ohos/flexsearch";
import docs, { DocsDataType } from './docsData';

// DocsDataType is a custom multi-field data type. For details, see entry/src/main/ets/model/docsModel.ets.
const options: IndexOptionsForDocumentSearch<DocsDataType, StoreOption> = {
    // The CJK encoding mode or user-defined mode is required for Chinese search.
    charset: "cjk",
    document: {
        id: "url",
        tag: "tag",
        index: ["title", "content"],
        store: ["url", "title"],
    }
}

const index = new FlexSearch.Document(options);

// For details about DocsDataType, see entry/src/main/ets/model/docsData.ets.
const doc1 = new DocsDataType(
    "url1",
    "Pandemic",
    "The pandemic affects 8 provinces. CDC experts remind you of the pandemic prevention in winter...",
    "Elephant News reports that in just three days, it has... On October 18, the Shaanxi Province Health Commission reported..."
);
index.add(doc1);
let result = index.search("Pandemic", {
  limit: 100,
  offset: 0,
  suggest: false,
  index: ["title", "content"],
  tag: false,
  enrich: false,
  bool: "or",
});

// Search in asynchronous callback mode.
index.searchAsync(
  "Pandemic",
  {
    limit: 100,
    offset: 0,
    suggest: false,
    index: ["title", "content"],
    tag: false,
    enrich: false,
    bool: "or",
  },
  function (result) {
    console.log(result);
  }
);

// Search in asynchronous promise mode.
index
  .searchAsync("Pandemic", {
    limit: 100,
    offset: 0,
    suggest: false,
    index: ["title", "content"],
    tag: false,
    enrich: false,
    bool: "or",
  })
  .then(function (result) {
    console.log(result);
  });

// Search in async await mode.
async function search() {
  const results = await index.searchAsync("Pandemic", {
    limit: 100,
    offset: 0,
    suggest: false,
    index: ["title", "content"],
    tag: false,
    enrich: false,
    bool: "or",
  });
  console.log(result);
}
```

For details about the parameter **options**, see [FlexSearch README](https://github.com/nextapps-de/flexsearch/tree/0.7.2).

### Available APIs

Global methods:

- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.add">FlexSearch.registerCharset(name, charset)(id, string)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.add">FlexSearch.registerLanguage(name, language)</a> \*

Index methods:

- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.add">Index.**add**(id, string)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.append">Index.**append**(id, string)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.update">Index.**update**(id, string)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.remove">Index.**remove**(id)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.search">Index.**search**(string, \<limit\>, \<options\>)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.search">Index.**search**(options)</a> \*
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.export">Index.**export**(handler)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.import">Index.**import**(key, data)</a>

WorkerIndex methods:

- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.add">Index.**add**(id, string)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.append">Index.**append**(id, string)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.update">Index.**update**(id, string)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.remove">Index.**remove**(id)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.search">Index.**search**(string, \<limit\>, \<options\>)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.search">Index.**search**(options)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.export">~~Index.**export**(handler)~~</a> (WIP)
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.import">~~Index.**import**(key, data)~~</a> (WIP)

Document methods:

- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.add">Document.**add**(\<id\>, document)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.append">Document.**append**(\<id\>, document)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.update">Document.**update**(\<id\>, document)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.remove">Document.**remove**(id || document)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.search">Document.**search**(string, \<limit\>, \<options\>)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.search">Document.**search**(options)</a> \*
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.export">Document.**export**(handler)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.import">Document.**import**(key, data)</a>

<span>\*</span> indicates that for each of those methods there exists an asynchronous equivalent.

Async version:

- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#addAsync">.**addAsync**( ... , \<callback\>)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#appendAsync">.**appendAsync**( ... , \<callback\>)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#updateAsync">.**updateAsync**( ... , \<callback\>)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#removeAsync">.**removeAsync**( ... , \<callback\>)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#searchAsync">.**searchAsync**( ... , \<callback\>)</a>

Async methods will return a `Promise`. Alternatively, you can pass a callback function as the last parameter.

Methods `export` and `import` are always async as well as every method you call on a Worker-based Index.

### Worker Function Description

**Use FlexSearch.Worker instead of FlexSearch.Index during the single-field search using Worker.**
Due to the serialization problem of data transfer between threads, the **encode** attribute (value is **function**) in the **charset** object is ignored. In this case, the **charset** object needs to be split and transferred, and **charset.encode** needs to be specially processed, that is, **function.name** is transferred instead of **function**.

```javascript
import FlexSearch from "@ohos/flexsearch";
import charsetDefault from "@ohos/flexsearch/src/lang/latin/default.js";

const index = new FlexSearch.Worker({
  encode: charsetDefault.encode.name,
  tokenize: charsetDefault.tokenize,
  rtl: charsetDefault.rtl,
});
```

In the project directory **entry**, create the directory **workers** at the same level as the directory **pages**, and create a **worker.js** file in **workers**.

```javascript
// worker.js
import charsetDefault from "@ohos/flexsearch/src/lang/latin/default.js";
import {
  setEncode,
  handler,
  parentPort,
} from "@ohos/flexsearch/src/worker/ark.js";

setEncode(charsetDefault.encode);
parentPort.onmessage = handler;
```

**Use the Document object for multi-field search, which requires enabling Worker in configuration of a build object.**

```javascript
import FlexSearch, { StoreOption } from "@ohos/flexsearch";
import charsetCJK from "@ohos/flexsearch/src/lang/cjk/default.js";

const options: IndexOptionsForDocumentSearch<DocsDataType, StoreOption> = {
    rtl:false,
    tokenize: 'strict',
    encode: false,
    worker:true
}

const index = new FlexSearch.Document(options);
```

In the project directory **entry**, create the directory **workers** at the same level as the directory **pages**, and create a **worker.js** file in **workers**.
**worker.js** can be replaced with another file name, but the preceding configuration also needs to be modified as it changes. For example, if the file name is **myworker.js**, the preceding configuration is modified to **new Document({worker: "workers/myworker.js"});**.

```javascript
import charsetCJK from "@ohos/flexsearch/src/lang/cjk/default.js";
import {
  setEncode,
  handler,
  parentPort,
} from "@ohos/flexsearch/src/worker/ark.js";

setEncode(charsetCJK.encode);
parentPort.onmessage = handler;
```

### Description of charset and lang

When the library is initialized, only the following five charsets are registered by default:

```javascript
// flexsearch.js
if (SUPPORT_ENCODER) {
  registerCharset("latin:default", charset_default);
  registerCharset("latin:simple", charset_simple);
  registerCharset("latin:balance", charset_balance);
  registerCharset("latin:advanced", charset_advanced);
  registerCharset("latin:extra", charset_extra);
  registerCharset("cjk:default", charset_cjk);
}
```

Therefore, when **charset** uses a string as the value, only the preceding five types can be used by default. **latin** indicates **latin:default**, and **cjk** indicates **cjk:default**.
Alternatively, if you need to use another built-in **charset** or a custom **charset**, perform global registration first. For example:

```javascript
import FlexSearch from "@ohos/flexsearch";
import charsetArabic from "@ohos/flexsearch/dist/module/lang/arabic/default.js";
import langEN from "@ohos/flexsearch/dist/module/lang/en.js";

FlexSearch.registerCharset("arabic:default", charsetArabic);
FlexSearch.registerLanguage("en", langEN);

const index = new FlexSearch.Index({
  charset: "arabic",
  lang: "en",
});
```

Directly use the **import** object. For example:

```javascript
import FlexSearch from "@ohos/flexsearch";
import charsetLatinDefault from "@ohos/flexsearch/dist/module/lang/latin/default.js";
import langEN from "@ohos/flexsearch/dist/module/lang/en.js";

const index = new FlexSearch.Index({
  charset: charsetLatinDefault,
  lang: langEN,
});
```

## About obfuscation
- Code obfuscation, please see[Code Obfuscation](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/arkts-utils/source-obfuscation.md)
- If you want the flexsearch library not to be obfuscated during code obfuscation, you need to add corresponding exclusion rules in the obfuscation rule configuration file obfuscation-rules.txt：
```
-keep
./oh_modules/@ohos/flexsearch
```

## Constraints

- DevEco Studio: 4.1 Canary (4.1.3.317)
- OpenHarmony SDK: API 11 (4.1.0.36)

## Directory Structure

```
        ./entry/src/main/ets/MainAbility/
        │──    library
        │          └──src                   Library source code
        │              └──lang              Processing built-in languages and character sets
        │                    └──arabic      Processing Arabic character sets
        │                    └──cjk         Processing Chinese, Japanese, and Korean character sets
        │                    └──cyrillic      Processing Cyrillic character sets
        │                    └──latin      Processing Latin character sets
        │                    └──at.js       Processing the Austrian language
        │                    └──de.js       Processing the German language
        │                    └──en.js       Processing British English
        │                    └──us.js       Processing American English
        │              └──worker            Internal implementation of worker threads
        │                    └──ark.js      Logic implementation of worker threads
        │                    └──index.js    Logic implementation of WorkerIndex objects
        │          └──async.js              Public implementation logic of the Async method
        │          └──cache.js              Cache implementation logic
        │          └──common.js             Common utility functions
        │          └──config.js             Internal logic configurations
        │          └──document.js           Logic implementation of Document objects
        │          └──flexsearch.js         FlexSearch library entry file
        │          └──global.js             Global configurations
        │          └──index.js              Logic implementation of Index objects
        │          └──intersect.js          Processing logic of suggest in SearchOptions
        │          └──lang.js               Common functions for language processing
        │          └──preset.js             Processing logic of preset construction configuration items in Index
        │          └──serialize.js          Serialization processing logic such as import and export
        │          └──type.js               Type annotations
        │──    model                        demo logic processing and data files
        │──    pages                        page files
        │──    utils                        Common utilities
        │──    workers                      Worker scripts in the Ark environment
```

## License

This project is licensed under [Apache License 2.0](https://gitcode.com/openharmony-tpc/flexsearch-ohos/blob/master/LICENSE).

## How to Contribute

If you find any problem when using the project, submit an [issue](https://gitcode.com/openharmony-tpc/flexsearch-ohos/issues) or a [PR](https://gitcode.com/openharmony-tpc/flexsearch-ohos/pulls).
