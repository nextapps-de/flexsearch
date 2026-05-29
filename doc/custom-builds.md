## Custom Builds

The `/src/` folder of this repository requires some compilation to resolve the build flags.

<!--
Those are your options:

- Closure Compiler (Advanced Compilation)
- Babel + Plugin `babel-plugin-conditional-compile`

You can't resolve build flags with:

- Webpack
- esbuild
- rollup
- Terser
-->

You can run any of the basic builds located in the `/dist/` folder, e.g.:

```bash
npm run build:bundle
npm run build:light
npm run build:module
```

Perform a custom build (UMD bundle) by passing build flags:

```bash
npm run build:custom SUPPORT_DOCUMENT=true SUPPORT_TAGS=true LANGUAGE_OUT=ECMASCRIPT5 POLYFILL=true
```

Perform a custom build in ESM module format:

```bash
npm run build:custom RELEASE=custom.module SUPPORT_DOCUMENT=true SUPPORT_TAGS=true
```

Perform a debug build:

```bash
npm run build:custom DEBUG=true SUPPORT_DOCUMENT=true SUPPORT_TAGS=true
```

> On custom builds each build flag will be set to `false` by default when not passed.

Just build the core library:

```bash
npm run build:custom
```

The custom build will be saved to `dist/flexsearch.custom.xxxx.min.js` or when format is module to `dist/flexsearch.custom.module.xxxx.min.js` (the "xxxx" is a hash based on the used build flags).

### Supported Build Flags

|      |        |      |
|------|--------|------|
| Flag | Values | Info |
| Feature Flags |
| SUPPORT_WORKER | true, false | Worker Indexes |
| SUPPORT_ENCODER | true, false | When not included you'll need to pass a custom encode method when creating an index |
| SUPPORT_CHARSET | true, false | Includes: LatinBalance, LatinAdvanced, LatinExtra, LatinSoundex |
| SUPPORT_CACHE | true, false | Support for index.searchCache() |
| SUPPORT_ASYNC | true, false | The async version of index standard methods |
| SUPPORT_STORE | true, false | Document Datastore |
| SUPPORT_SUGGESTION | true, false | Use the option suggestions when searching |
| SUPPORT_SERIALIZE | true, false | Export / Import / Serialize Index |
| SUPPORT_DOCUMENT | true, false | Document Indexes |
| SUPPORT_TAGS | true, false | Tag-Search |
| SUPPORT_PERSISTENT | true, false | Use any of the persistent indexes |
| SUPPORT_KEYSTORE | true, false | Extended size for InMemory indexes |
| SUPPORT_COMPRESSION | true, false |  |
| SUPPORT_RESOLVER | true, false | Apply complex queries by chaining boolean operations |
| SUPPORT_HIGHLIGHTING | true, false | Result Highlighting for Document-Search (also requires SUPPORT_STORE) |
| Compiler Flags |
| DEBUG | true, false | Apply common checks and throw errors more frequently, output debug information and helpful hints to the console |
| RELEASE | customcustom.module | Choose build schema: custom = Legacy Browser (window.FlexSearch), custom.module = ES6 Modules (ESM) |
| POLYFILL | true, false | Include Polyfills (based on LANGUAGE_OUT) |
| PROFILER | true, false | Just used for automatic performance tests |
| LANGUAGE_OUT | ECMASCRIPT3ECMASCRIPT5ECMASCRIPT_2015ECMASCRIPT_2016ECMASCRIPT_2017ECMASCRIPT_2018ECMASCRIPT_2019ECMASCRIPT_2020ECMASCRIPT_2021ECMASCRIPT_2022ECMASCRIPT_NEXTSTABLE | Target language |

