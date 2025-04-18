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

export class DocsDataType {
  public url: string;
  public tag: string;
  public title: string;
  public content: string;

  constructor(url: string, tag: string, title: string, content: string) {
    this.url = url;
    this.tag = tag;
    this.title = title;
    this.content = content;
  }
}
function getResourceString(res:Resource){
  return getContext().resourceManager.getStringSync(res.id)
}

const docs: DocsDataType[] = [
  new DocsDataType('url1', getResourceString($r('app.string.Property')), getResourceString($r('app.string.title1')),
    getResourceString($r('app.string.content1'))),
  new DocsDataType('url2', getResourceString($r('app.string.Epidemic')), getResourceString($r('app.string.title2')),
    getResourceString($r('app.string.content2'))),
  new DocsDataType('url3', getResourceString($r('app.string.Livelihood')), getResourceString($r('app.string.title3')),
    getResourceString($r('app.string.content3'))),
  new DocsDataType('url4', getResourceString($r('app.string.Property')), getResourceString($r('app.string.title4')),
    getResourceString($r('app.string.content4'))),
  new DocsDataType('url5', getResourceString($r('app.string.Economy')), getResourceString($r('app.string.title5')), getResourceString($r('app.string.content5'))),
  new DocsDataType('url6', getResourceString($r('app.string.Epidemic')), getResourceString($r('app.string.title6')),
    getResourceString($r('app.string.content6'))),
  new DocsDataType('url7', getResourceString($r('app.string.Epidemic')), getResourceString($r('app.string.title7')),
    getResourceString($r('app.string.content7'))),
  new DocsDataType('url8', getResourceString($r('app.string.Property')), getResourceString($r('app.string.title8')),
    getResourceString($r('app.string.content8'))),
  new DocsDataType('url9', getResourceString($r('app.string.Property')), getResourceString($r('app.string.title9')), getResourceString($r('app.string.content9'))),
  new DocsDataType('url10', getResourceString($r('app.string.Property')), getResourceString($r('app.string.title10')), getResourceString($r('app.string.content10'))),
  new DocsDataType('url11', getResourceString($r('app.string.Livelihood')), getResourceString($r('app.string.title11')),
    getResourceString($r('app.string.content11')))
];

export default docs
