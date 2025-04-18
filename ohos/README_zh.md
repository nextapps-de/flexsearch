# FlexSearch

## 简介

本项目是基于 js 库开源库 [FlexSearch](https://github.com/nextapps-de/flexsearch/tree/0.7.2) 进行移植的 OpenHarmony 适配版本。

FlexSearch 是一个快速、零依赖的全文搜索库。 在原始搜索速度方面，FlexSearch 优于每一个搜索库，
并提供灵活的搜索功能，如多字段搜索，语音转换或部分匹配。根据使用的选项，它还提供最高内存效率的索引。
FlexSearch 引入了一种新的评分算法，称为“上下文索引”，基于预先评分的词典字典体系结构，与其它库相比，实际执行的查询速度有大幅度提高。
FlexSearch 还为您提供非阻塞异步处理模型，以通过专用平衡线程并行地对索引执行任何更新或查询。

## 下载安装

```shell
ohpm install @ohos/flexsearch
```

OpenHarmony ohpm 环境配置等更多内容，请参考 [如何安装OpenHarmony ohpm 包](https://gitcode.com/openharmony-tpc/docs/blob/master/OpenHarmony_har_usage.md)

## 使用说明

### 快速接入

单字段检索使用 Index 更简单，多字段检索使用 Document，以 Document 为例

```javascript
import FlexSearch, { StoreOption, IndexOptionsForDocumentSearch } from "@ohos/flexsearch";
import docs, { DocsDataType } from './docsData';

// DocsDataType是自定义的多字段数据类型，详情参考entry/src/main/ets/model/docsModel.ets
const options: IndexOptionsForDocumentSearch<DocsDataType, StoreOption> = {
    // 中文检索需要使用CJK编码方式或自定义
    charset: "cjk",
    document: {
        id: "url",
        tag: "tag",
        index: ["title", "content"],
        store: ["url", "title"],
    }
}

const index = new FlexSearch.Document(options);

// DocsDataType数据类型可参考entry/src/main/ets/model/docsData.ets
const doc1 = new DocsDataType(
    "url1",
    "流行病",
    "流行病波及8省份！疾控专家提醒冬季流行病 ...",
    "大象新闻消息，仅三天时间，已经 ... 10月18日，陕西省卫健委通报..."
);
index.add(doc1);
let result = index.search("流行病", {
  limit: 100,
  offset: 0,
  suggest: false,
  index: ["title", "content"],
  tag: false,
  enrich: false,
  bool: "or",
});

// 异步版本搜索方法callback方式
index.searchAsync(
  "流行病",
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

// 异步版本搜索方法promise方式
index
  .searchAsync("流行病", {
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

// async await方式
async function search() {
  const results = await index.searchAsync("流行病", {
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

**关于配置项参数 options 的详细说明，原库 readme 中有详细的说明，请见**[FlexSearch readme](https://github.com/nextapps-de/flexsearch/tree/0.7.2)

### API 预览

Global Methods：

- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.add">FlexSearch.registerCharset(name, charset)(id, string)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.add">FlexSearch.registerLanguage(name, language)</a> \*

Index Methods:

- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.add">Index.**add**(id, string)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.append">Index.**append**(id, string)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.update">Index.**update**(id, string)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.remove">Index.**remove**(id)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.search">Index.**search**(string, \<limit\>, \<options\>)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.search">Index.**search**(options)</a> \*
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.export">Index.**export**(handler)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.import">Index.**import**(key, data)</a>

WorkerIndex Methods:

- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.add">Index.**add**(id, string)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.append">Index.**append**(id, string)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.update">Index.**update**(id, string)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.remove">Index.**remove**(id)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.search">Index.**search**(string, \<limit\>, \<options\>)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.search">Index.**search**(options)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.export">~~Index.**export**(handler)~~</a> (WIP)
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#index.import">~~Index.**import**(key, data)~~</a> (WIP)

Document Methods:

- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.add">Document.**add**(\<id\>, document)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.append">Document.**append**(\<id\>, document)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.update">Document.**update**(\<id\>, document)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.remove">Document.**remove**(id || document)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.search">Document.**search**(string, \<limit\>, \<options\>)</a> \*
- <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.search">Document.**search**(options)</a> \*
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.export">Document.**export**(handler)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#document.import">Document.**import**(key, data)</a>

<span>\*</span> 表示此方法存在一个等价的异步方法

Async Version:

- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#addAsync">.**addAsync**( ... , \<callback\>)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#appendAsync">.**appendAsync**( ... , \<callback\>)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#updateAsync">.**updateAsync**( ... , \<callback\>)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#removeAsync">.**removeAsync**( ... , \<callback\>)</a>
- _async_ <a href="https://github.com/nextapps-de/flexsearch/tree/0.7.2#searchAsync">.**searchAsync**( ... , \<callback\>)</a>

异步方法会返回一个 `Promise`, 或者，您可以将回调函数作为最后一个参数传递.

方法`export`和`import`始终是异步的，您在基于 Worker 的索引上调用的每个方法也都是异步的.

### worker 功能使用说明

**单字段检索使用使用 worker 功能需用 FlexSearch.Worker 代替 FlexSearch.Index**
由于线程间数据传递序列化问题，charset 对象里的 encode 属性（value 为 function）会被忽略，此时需将 charset 对象拆分传递，并且将 charset.encode 做个特殊处理，不传递 function 改为传递 function.name

```javascript
import FlexSearch from "@ohos/flexsearch";
import charsetDefault from "@ohos/flexsearch/src/lang/latin/default.js";

const index = new FlexSearch.Worker({
  encode: charsetDefault.encode.name,
  tokenize: charsetDefault.tokenize,
  rtl: charsetDefault.rtl,
});
```

然后 entry 工程目录里，与 pages 目录同级创建 workers 目录，然后在 workers 目录里新建 worker.js 文件

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

**多字段检索还是使用 Document 对象，需在构建对象的配置里设置开启 worker**

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

然后 entry 工程目录里，与 pages 目录同级创建 workers 目录，然后在 workers 目录里新建 worker.js 文件
worker.js 也可为其它文件名，但是上面的配置也需改动，如 myworker.js,则上面配置为 new Document({worker: "workers/myworker.js"});

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

### 关于 charset 和 lang 的说明

本库初始化时，仅默认注册了 5 种 charset，如下：

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

故 charset 以字符串为值的时候，只能默认使用以上 5 种，'latin'即'latin:default'，'cjk'即'cjk:default'。
或者为了方便，在需要使用到其它内置的 charset 或自定义的 charset 时，也可先全局注册，eg：

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

直接使用 import 对象的方式，eg：

```javascript
import FlexSearch from "@ohos/flexsearch";
import charsetLatinDefault from "@ohos/flexsearch/dist/module/lang/latin/default.js";
import langEN from "@ohos/flexsearch/dist/module/lang/en.js";

const index = new FlexSearch.Index({
  charset: charsetLatinDefault,
  lang: langEN,
});
```
## 关于混淆
- 代码混淆，请查看[代码混淆简介](https://docs.openharmony.cn/pages/v5.0/zh-cn/application-dev/arkts-utils/source-obfuscation.md)
- 如果希望flexsearch库在代码混淆过程中不会被混淆，需要在混淆规则配置文件obfuscation-rules.txt中添加相应的排除规则：
```
-keep
./oh_modules/@ohos/flexsearch
```

## 约束与限制

- DevEco Studio 版本： 4.1 Canary(4.1.3.317)
- OpenHarmony SDK: API11 (4.1.0.36)

## 目录

```
        ./entry/src/main/ets/MainAbility/
        │──    library
        │          └──src                   库源码目录
        │              └──lang              内置语言和字符集处理目录
        │                    └──arabic      阿拉伯字符集处理目录
        │                    └──cjk         中日韩字符集处理目录
        │                    └──cyrillic    西里尔字符集处理目录
        │                    └──latin       拉丁字符集处理目录
        │                    └──at.js       奥地利语言处理
        │                    └──de.js       德国语言处理
        │                    └──en.js       英式英语处理
        │                    └──us.js       美式英语处理
        │              └──worker            worker线程内部实现目录
        │                    └──ark.js      worker线程逻辑实现
        │                    └──index.js    WorkerIndex对象逻辑实现
        │          └──async.js              Async方法的公共实现逻辑
        │          └──cache.js              缓存实现逻辑
        │          └──common.js             通用工具函数
        │          └──config.js             内部逻辑配置
        │          └──document.js           Document对象逻辑实现
        │          └──flexsearch.js         flexsearch库入口文件
        │          └──global.js             全局配置
        │          └──index.js              Index对象逻辑实现
        │          └──intersect.js          SearchOptions中suggest的处理逻辑
        │          └──lang.js               语言处理的公共函数
        │          └──preset.js             Index中preset构造配置项的处理逻辑
        │          └──serialize.js          序列化处理逻辑，如导入和导出
        │          └──type.js               用来做类型注释
        │──    model                        demo逻辑处理和数据文件目录
        │──    pages                        页面文件目录
        │──    utils                        工具类目录
        │──    workers                      ark环境worker脚本目录
```

## 开源协议

本项目基于 [Apache License 2.0](https://gitcode.com/openharmony-tpc/flexsearch-ohos/blob/master/LICENSE) ，请自由地享受和参与开源。

## 贡献代码

使用过程中发现任何问题都可以提 [Issue](https://gitcode.com/openharmony-tpc/flexsearch-ohos/issues) 给组件，当然，也非常欢迎发 [PR](https://gitcode.com/openharmony-tpc/flexsearch-ohos/pulls) 共建。
