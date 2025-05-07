## 2.0.1
- Add obfuscation configuration to the document
- Switch the repository address to gitcode

## 2.0.0
* 名称由flexsearch-ohos修改为flexsearch。
* 旧的包flexsearch-ohos已不维护，请使用新包flexsearch。
* 工程由api8升级到api9
* 适配DevEco Studio 版本： 4.1 Canary(4.1.3.317), OpenHarmony SDK: API11 (4.1.0.36)
* 补充XTS单元测试用例


## 1.0.2
新增OpenHarmony关键字


## 1.0.1
适配了ark引擎上无法运行的问题
* fix：空格正则表达式由ECMA2018语法不支持的问题。
* fix：ark引擎不支持new Function()导致的worker功能无法使用问题。

## 1.0.0
适配兼容OpenHarmony系统，修复相关问题，具体如下：
* 源库Async方法在sdk6上运行会出错，但sdk7以上运行没问题，做了sdk6的兼容。
* 源库worker功能切换到ark环境上，删除了浏览器和node环境worker功能相关的代码。
* 源库Index.import方法无效的问题修复。
* 源库入口文件src/webpack.js重命名为src/flexsearch.js，并修改adm和commonJS方式的模块化为ES6方式的模块化。

对源库文件改动如下：
* 删除原库src/config目录所有文件，该目录代码用于打包成浏览器上使用的不同功能版本的js bundle，OpenHarmony环境支持全部，无需多种配置。
* 删除原库src/worker/handler.js和src/worker/node.js和src/worker/worker.js文件，该代码为浏览器和node环境上的worker相关代码。
* 新增src/worker/ark.js，新增OpenHarmony环境上的worker功能实现。
* 修改该src/worker/index.js，修改worker功能相关代码以适配OpenHarmony环境。
* 修改src/async.js，兼容sdk6异步方法无效问题。
* 删除src/engine.js，该代码ES6模块化中无用。
* 修改src/index.js，Fix源库import方法无效问题。
* 删除src/polyfill.js，浏览器环境做es5兼容相关的代码。
* 修改src/webpack.js， 重命名并修改模块化方式。

