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

import FlexSearch, { Id, IndexOptions, IndexSearchResult, Worker } from '@ohos/flexsearch';
import indexData from './indexData';
import langEN from '../utils/langEN';
import { logDebug } from '../utils/LogUtil';
import { FunctionDataType } from './indexModel';

let options: IndexOptions<string> = {
  preset: 'default',
  cache: true,
  resolution: 9,
  context: false,
  optimize: true,
  language: langEN,
};
const index = new FlexSearch.Worker(options);

for (let i = 0; i < indexData.length; i++) {
  asyncAddIndex(i, indexData[i]);
}

function asyncAddIndex(id: Id, content: string) {

    index.addAsync(id, content, ()=> {
      logDebug('flexsearch---WorkerIndex.addAsync success: ', id);
    });
}

function asyncAppendIndex(id: Id, content: string) {

  index.appendAsync(id, content, ()=> {
    logDebug('WorkerIndex.appendAsync success: ', id);
  });
}

function asyncUpdateIndex(id: Id, content: string) {

  index.updateAsync(id, content, ()=> {
    logDebug('WorkerIndex.updateAsync success: ', content);
  });
}


function asyncDeleteIndex(id: Id) {

  index.removeAsync(id, ()=> {
    logDebug('WorkerIndex.removeAsync success: ', id);
  });
}

function asyncSearch(query: string) {

  index.searchAsync(query,10,(result:IndexSearchResult)=>{
    logDebug('WorkerIndex.searchAsync result = ', result);
  });
}

const model: FunctionDataType[] = [
  new FunctionDataType('asyncAddIndex', asyncAddIndex),
  new FunctionDataType('asyncAppendIndex', asyncAppendIndex),
  new FunctionDataType('asyncDeleteIndex', asyncDeleteIndex),
  new FunctionDataType('asyncUpdateIndex', asyncUpdateIndex),
  new FunctionDataType('asyncSearch', asyncSearch),
]

export default model;