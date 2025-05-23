/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import FlexSearch, {
  Id,
  IndexOptionsForDocumentSearch,
  SimpleDocumentSearchResultSetUnit,
  StoreOption
} from '@ohos/flexsearch';
import docs, { DocsDataType } from './docsData';
import { logDebug } from '../utils/LogUtil';

const options: IndexOptionsForDocumentSearch<DocsDataType, StoreOption> = {
  // 设置优化侧重方向，内存、性能、匹配、评分，default代表多方平衡
  preset: 'default',

  // 索引模式
  tokenize: 'strict',

  // 开启缓存，使用缓存的常见场景是键入时自动完成或即时搜索
  cache: 100,

  resolution: 9,

  // 是否开启上下文评分，仅在tokenize = 'strict'时可用
  context: false,

  // 开启内存优化
  optimize: true,

  charset: 'cjk',

  // 可自定义中文的stemmer、filter、matcher
  language: undefined,

  // encode值为false 或者 '' 或者 自定义function,优先级会比charset['encode']高
  encode: false,

  // 词干器，中文不需要
  stemmer: false,

  // 停用词过滤器
  filter: ['的', '又', '及'],

  matcher: false,

  worker: false,

  // Document索引专有
  document: {
    id: 'url',
    tag: 'tag',
    index: ['title', 'content'],
    store: ['url', 'title']
  }
};
const index = new FlexSearch.Document(options);

for (let i = 0; i < docs.length; i++) {
  index.add(docs[i]);
}

export function oneFieldSearchTest(): SimpleDocumentSearchResultSetUnit[] {

  return index.search(getResourceString($r('app.string.Property2')), 100, {
    limit: 100,
    offset: 0,
    suggest: false,
    index: 'content',
    enrich: true // 结果是否包含stored文档详情
  });
}

export function oneFieldSearchAsyncTest() {

  index.searchAsync(getResourceString($r('app.string.Property2')), {
    limit: 100,
    offset: 0,
    suggest: false,
    index: 'content',
    enrich: true // 结果是否包含stored文档详情
  }).then((result)=> {
    logDebug('result = ', result);
  });

}

export function multiFieldSearchTest(): SimpleDocumentSearchResultSetUnit[] {

  return index.search(getResourceString($r('app.string.Property2')), {
    limit: 100,
    offset: 0,
    suggest: false,
    index: ['title', 'content'],
    enrich: false,
    bool: 'or'
  });
}

export function paginationQuery(offset: ESObject): SimpleDocumentSearchResultSetUnit[] {

  return index.search(getResourceString($r('app.string.housing')), { limit: 1, offset: offset, suggest: false });
}

export function searchByTag(): SimpleDocumentSearchResultSetUnit[] {

  return index.search({ tag: [getResourceString($r('app.string.Property')), getResourceString($r('app.string.Epidemic'))] });
}

function getResourceString(res:Resource){
  return getContext().resourceManager.getStringSync(res.id)
}

export function storeGetTest(): DocsDataType[] {

  let stores: DocsDataType[]= [];
  for (let i = 1; i <= docs.length; i++) {
    stores.push(docs[i]);
  }
  return stores;

}

export function storeSetTest(): DocsDataType {
  index.update(new DocsDataType("url1", getResourceString($r('app.string.Property')), "title", ""));
  return docs[0];
}

export function appendTest(): SimpleDocumentSearchResultSetUnit[] {
  index.add("appendTest", new DocsDataType("url15", getResourceString($r('app.string.montage')), getResourceString($r('app.string.Before_montage')), getResourceString($r('app.string.the_value_before_montage'))));
  index.append("appendTest", new DocsDataType("url11", getResourceString($r('app.string.Property')), getResourceString($r('app.string.tail_title')), getResourceString($r('app.string.tail_content'))));
  let result: SimpleDocumentSearchResultSetUnit[] = index.search(getResourceString($r("app.string.tail_connection")), {
    index: ['title', 'content'],
    enrich: true
  });
  let tail_connection = getResourceString($r("app.string.tail_connection"));
  logDebug(`append then search(${tail_connection}), result = `, JSON.stringify(result));
  return result;
}

export function removeTest() {
  const options: ESObject = {
    limit: 100,
    offset: 0,
    suggest: false,
    index: ['title', 'content'],
    enrich: true,
    bool: 'or'
  };
  let res = index.search(getResourceString($r('app.string.Economy')),options);
  logDebug('removeAsync result please check [before deletion]:', res)
  index.removeAsync('url5').then((indexObj)=> {
    let res1 = indexObj.search(getResourceString($r('app.string.Economy')),options);
    logDebug('removeAsync result please check [after deletion]:', res1)
    if (res1.length == 0) {
      logDebug('removeAsync result please check [after deletion]:', "已删除....");
    }
    storeGetTest();
  });

}

export function updateTest() {
  let options: ESObject = {
    limit: 100,
    offset: 0,
    suggest: false,
    index: ['title', 'content'],
    tag: false,
    enrich: false,
    bool: 'or'
  };
  index.add("updateTest", new DocsDataType("url55", getResourceString($r('app.string.update')), getResourceString($r('app.string.before_update')),  getResourceString($r('app.string.value_before_update'))));
  index.updateAsync("updateTest"
    ,new DocsDataType("url2",getResourceString($r('app.string.Epidemic')),getResourceString($r('app.string.update_title')),getResourceString($r('app.string.update_content_value')))
  ).then((indexObj)=> {
    let res = indexObj.search( getResourceString($r('app.string.update_content')),options);
    logDebug('updateAsync result please check :', res)
    storeGetTest();
  });

}

export function searchCacheTest(): SimpleDocumentSearchResultSetUnit[] {

  return index.search(getResourceString($r('app.string.housing')));
}

const _map: Map<Id, DocsDataType> = new Map();
export function exportTest() {

  index.export((key, data)=> {

    logDebug('export log please check key = ', key);
    logDebug('export log please check data = ', data);
    _map.set(key, data);
  });
}

export function importTest() {

  const index2 = new FlexSearch.Document(options);

  _map.forEach((value, key)=> {
    index2.import(key, value);
  });

  index2.searchAsync(getResourceString($r('app.string.Property2')), {
    limit: 100,
    offset: 0,
    suggest: false,
    index: ['title', 'content'],
    enrich: false,
    bool: 'or'
  }, (result) => {
    logDebug("IMPORT log please check : ", result);
  });
}