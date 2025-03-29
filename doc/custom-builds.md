## Custom Builds

The `/src/` folder of this repository requires some compilation to resolve the build flags. Those are your options:

- Closure Compiler (Advanced Compilation)
- Babel + Plugin `babel-plugin-conditional-compile`

You can't resolve build flags with:

- Webpack
- esbuild
- rollup
- Terser

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

<a name="build-flags" id="builds"></a>

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
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_ENCODER</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_CHARSET</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_CACHE</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_ASYNC</td>
        <td>true, false</td>
        <td>Asynchronous Rendering (support Promises)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_STORE</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_SUGGESTION</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_SERIALIZE</td>
        <td>true, <b>false</b></td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_DOCUMENT</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_TAGS</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_PERSISTENT</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_KEYSTORE</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_COMPRESSION</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>SUPPORT_RESOLVER</td>
        <td>true, false</td>
        <td></td>
    </tr>
    <tr>
        <td colspan="3"><br><b>Compiler Flags</b></td>
    </tr>
    <tr>
        <td>DEBUG</td>
        <td>true, <b>false</b></td>
        <td>Output debug information to the console (default: false)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>RELEASE<br><br><br><br><br></td>
        <td><b>custom</b><br>custom.module<br>bundle<br>bundle.module<br>es5<br>light<br>compact</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>POLYFILL</td>
        <td>true, <b>false</b></td>
        <td>Include Polyfills (based on LANGUAGE_OUT)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>PROFILER</td>
        <td>true, <b>false</b></td>
        <td>Just used for automatic performance tests</td>
    </tr>
    <tr></tr>
    <tr>
        <td>LANGUAGE_OUT<br><br><br><br><br><br><br><br><br><br><br></td>
        <td>ECMASCRIPT3<br>ECMASCRIPT5<br>ECMASCRIPT_2015<br>ECMASCRIPT_2016<br>ECMASCRIPT_2017<br>ECMASCRIPT_2018<br>ECMASCRIPT_2019<br>ECMASCRIPT_2020<br>ECMASCRIPT_2021<br>ECMASCRIPT_2022<br>ECMASCRIPT_NEXT<br>STABLE</td>
        <td>Target language</td>
    </tr>
</table>
