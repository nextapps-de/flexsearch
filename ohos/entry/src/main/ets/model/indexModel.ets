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

import FlexSearch, { Id, IndexOptions, IndexSearchResult } from '@ohos/flexsearch';
import indexData from './indexData';
import langEN from '../utils/langEN'
import { logDebug } from '../utils/LogUtil';

FlexSearch.registerLanguage('en', langEN);
const options: IndexOptions<string> = {
  preset: 'default',
  tokenize: 'strict',
  cache: true,
  resolution: 9,
  context: false,
  optimize: true,
  boost: undefined,
  charset: 'latin',
  language: 'en',
  encode: false,
  stemmer: false,
  filter: false,
  matcher: false,
};
const index = new FlexSearch.Index(options);
for (let i = 0; i < indexData.length; i++) {
  asyncAddIndex(i, indexData[i]);
}

function checkId(id: Id) {
  return index.contain(id);
}

function addIndex(id: Id, content: string): boolean {

  index.add(id, content);
  return checkId(id);

}

function asyncAddIndex(id: Id, content: string) {

  index.addAsync(id, content, () => {
    if (checkId(id)) {
      logDebug('addAsync success: ', id);
    } else {
      logDebug('addAsync fail: ', id);
    }
  });


}

function appendIndex(id: Id, content: string) {

  index.append(id, content);
}

function asyncAppendIndex(id: Id, content: string) {

  index.appendAsync(id, content, () => {
    logDebug('appendAsync success: ', content);
  });

}

function updateIndex(id: Id, content: string) {

  index.update(id, content);
}

function asyncUpdateIndex(id: Id, content: string) {

  index.updateAsync(id, content, () => {
    logDebug('updateAsync success: ', content);
  });
}


function deleteIndex(id: Id): boolean {

  index.remove(id);
  return checkId(id)

}

function asyncDeleteIndex(id: Id) {

  index.removeAsync(id, () => {
    if (checkId(id)) {
      logDebug('removeAsync fail: ', id);
    } else {
      logDebug('removeAsync success: ', id);
    }
  });

}

function search(text: string) {

  return index.search(text);

}

function asyncSearch(query: string) {

  index.searchAsync(query).then((result: IndexSearchResult) => {
    logDebug('searchAsync result = ', result);
  })

}

class ExportedData {
  key: number | string = '';
  data: string = '';

  constructor(key?: number | string, data?: string) {
    if (key != undefined) {
      this.key = key;
    }
    if (data != undefined) {
      this.data = data;
    }
  }
}

let exportedData: ExportedData[] = [];

async function exportIndex() {
  await index.export((key: string | number, data: string) => {
    exportedData.push(new ExportedData(key, data))
    logDebug('exportIndex success, key = ', key);
    logDebug('exportIndex success, data = ', data);
  })
}

function importIndex() {
  logDebug("importIndex exportedData.length : ", JSON.stringify(exportedData.length));
  const index2 = new FlexSearch.Index(options);
  if (exportedData != null && exportedData != undefined && exportedData.length > 0) {
    exportedData.forEach((exportedDataObj: ExportedData) => {
      logDebug('importIndex success, key = ', exportedDataObj.key);
      logDebug('importIndex success, data = ', exportedDataObj.data);
      index2.import(exportedDataObj.key, exportedDataObj.data);
    })
  }
  setTimeout(() => {

    const result = index2.search('dd');
    logDebug('index2.search(dd) result = ', result);
  }, 1000);

}

export class FunctionDataType {
  name: string;
  fun: Function;

  constructor(name: string, fun: Function) {
    this.name = name;
    this.fun = fun;
  }
}

const model: FunctionDataType[] = [
  new FunctionDataType('addIndex', addIndex),
  new FunctionDataType('deleteIndex', deleteIndex),
  new FunctionDataType('updateIndex', updateIndex),
  new FunctionDataType('appendIndex', appendIndex),
  new FunctionDataType('exportIndex', exportIndex),
  new FunctionDataType('importIndex', importIndex),
  new FunctionDataType('search', search)
]

export default model;