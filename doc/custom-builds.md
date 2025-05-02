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

<table>
    <tr>
        <td>Flag</td>
        <td>Values</td>
        <td>Info</td>
    </tr>
    <tr>
        <td colspan="3"><br><b>Feature Flags</b></td>
    </tr>
    <tr>
        <td>SUPPORT_WORKER</td>
        <td>true, false</td>
        <td>Worker Indexes</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_ENCODER</td>
        <td>true, false</td>
        <td>When not included you'll need to pass a custom <code>encode</code> method when creating an index</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_CHARSET</td>
        <td>true, false</td>
        <td>Includes: <code>LatinBalance</code>, <code>LatinAdvanced</code>, <code>LatinExtra</code>, <code>LatinSoundex</code></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_CACHE</td>
        <td>true, false</td>
        <td>Support for <code>index.searchCache()</code></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_ASYNC</td>
        <td>true, false</td>
        <td>The async version of index standard methods</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_STORE</td>
        <td>true, false</td>
        <td>Document Datastore</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_SUGGESTION</td>
        <td>true, false</td>
        <td>Use the option <code>suggestions</code> when searching</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_SERIALIZE</td>
        <td>true, <b>false</b></td>
        <td>Export / Import / Serialize Index</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_DOCUMENT</td>
        <td>true, false</td>
        <td>Document Indexes</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_TAGS</td>
        <td>true, false</td>
        <td>Tag-Search</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_PERSISTENT</td>
        <td>true, false</td>
        <td>Use any of the persistent indexes</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_KEYSTORE</td>
        <td>true, false</td>
        <td>Extended size for InMemory indexes</td>
    </tr>
    <!--
    <tr></tr>
    <tr>
        <td>SUPPORT_COMPRESSION</td>
        <td>true, false</td>
        <td></td>
    </tr>
    -->
    <tr></tr>
    <tr>
        <td>SUPPORT_RESOLVER</td>
        <td>true, false</td>
        <td>Apply complex queries by chaining boolean operations</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_HIGHLIGHTING</td>
        <td>true, false</td>
        <td>Result Highlighting for Document-Search (also requires <code>SUPPORT_STORE</code>)</td>
    </tr>
    <tr>
        <td colspan="3"><br><b>Compiler Flags</b></td>
    </tr>
    <tr>
        <td>DEBUG</td>
        <td>true, false</td>
        <td>Apply common checks and throw errors more frequently, output debug information and helpful hints to the console</td>
    </tr>
    <tr></tr>
    <tr>
        <td>RELEASE</td>
        <td>custom<br>custom.module</td>
        <td>Choose build schema: custom = Legacy Browser (<code>window.FlexSearch</code>), custom.module = ES6 Modules (ESM)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>POLYFILL</td>
        <td>true, false</td>
        <td>Include Polyfills (based on <code>LANGUAGE_OUT</code>)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>PROFILER</td>
        <td>true, false</td>
        <td>Just used for automatic performance tests</td>
    </tr>
    <tr></tr>
    <tr>
        <td>LANGUAGE_OUT</td>
        <td>ECMASCRIPT3<br>ECMASCRIPT5<br>ECMASCRIPT_2015<br>ECMASCRIPT_2016<br>ECMASCRIPT_2017<br>ECMASCRIPT_2018<br>ECMASCRIPT_2019<br>ECMASCRIPT_2020<br>ECMASCRIPT_2021<br>ECMASCRIPT_2022<br>ECMASCRIPT_NEXT<br>STABLE</td>
        <td>Target language</td>
    </tr>
</table>
