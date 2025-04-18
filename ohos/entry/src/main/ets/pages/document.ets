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

import {
  oneFieldSearchTest,
  oneFieldSearchAsyncTest,
  multiFieldSearchTest,
  searchByTag,
  searchCacheTest,
  appendTest,
  exportTest,
  importTest,
  paginationQuery,
  removeTest,
  updateTest,
  storeGetTest,
  storeSetTest
} from '../model/docsModel';
import docs from '../model/docsData';

@Entry
@Component

struct DocumentPage {
  @State rst: string = 'Document page'
  @State pageNo: number = 0

  @Builder MyButton(content: string, eventType: number) {
    Button(content)
      .size({ width: 160, height: 36 })
      .margin({ top: 10, right: 6, bottom: 0, left: 6 })
      .fontColor('white')
      .fontSize(12)
      .fontWeight(FontWeight.Bold)
      .backgroundColor('#00a6ff')
      .border({ width: 1, color: '#28c989', style: BorderStyle.Solid })
      .borderRadius(2)
      .onClick(() => {
        this.onMyButtonClick(eventType)
      })
  }

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Start }) {
      Text($r('app.string.document_data'))
        .alignSelf(ItemAlign.Start)
        .fontSize(12)
        .fontWeight(FontWeight.Bold)
      Text(JSON.stringify(docs))
        .width('100%')
        .height('26%')
        .margin(2)
        .borderWidth(1)
        .borderColor('#28c989')
        .borderRadius(4)
        .fontSize(12)
        .fontWeight(FontWeight.Normal)
        .backgroundColor('#f3f1f1')
        .maxLines(10)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
      Row({ space: 10 }) {
        this.MyButton(this.getResourceString($r('app.string.Single_field')), 0)
        this.MyButton(this.getResourceString($r('app.string.Multi_field')), 1)
      }

      Row({ space: 10 }) {
        this.MyButton(this.getResourceString($r('app.string.Search_by_tag')), 2)
        this.MyButton(this.getResourceString($r('app.string.page_search')), 3)
      }

      Row({ space: 10 }) {
        this.MyButton('removeAsyncTest', 4)
        this.MyButton('updateAsyncTest', 5)
      }

      Row({ space: 10 }) {
        this.MyButton('storeGetTest', 6)
        this.MyButton('storeSetTest', 7)
      }

      Row({ space: 10 }) {
        this.MyButton('appendTest', 8)
        this.MyButton('searchCacheTest', 9)
      }

      Row({ space: 10 }) {
        this.MyButton('exportTest', 10)
        this.MyButton(this.getResourceString($r('app.string.importTest')), 11)
      }

      Text($r('app.string.Test_Result'))
        .alignSelf(ItemAlign.Start)
        .fontSize(12)
        .fontWeight(FontWeight.Bold)
      Text(this.rst)
        .width('100%')
        .height('30%')
        .margin(2)
        .borderWidth(1)
        .borderColor('#28c989')
        .borderRadius(4)
        .fontSize(12)
        .fontWeight(FontWeight.Normal)
        .backgroundColor('#f3f1f1')
        .maxLines(10)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
    }
    .width('100%')
    .height('100%')
  }

  getResourceString(res:Resource){
    return getContext().resourceManager.getStringSync(res.id)
  }

  onMyButtonClick(eventType: number) {
    switch (eventType) {
      case 0:
        this.rst = JSON.stringify(oneFieldSearchTest())
        break
      case 1:
        this.rst = JSON.stringify(multiFieldSearchTest())
        break
      case 2:
        this.rst = JSON.stringify(searchByTag())
        break
      case 3:
        let result = paginationQuery(this.pageNo);
        this.rst = JSON.stringify(result);
        if (result.length == 0) {
          this.rst = this.getResourceString($r('app.string.Page_content_display_completed'));
        }
        this.pageNo++
        break
      case 4:
        removeTest()
        this.rst = 'removeAsync method result, please look for log,search in hilog：removeAsync result please check'
        break
      case 5:
        updateTest()
        this.rst = 'updateAsync method result, please look for log,search in hilog：updateAsync result please check'
        break
      case 6:
        this.rst = JSON.stringify(storeGetTest())
        break
      case 7:
        this.rst = JSON.stringify(storeSetTest())
        break
      case 8:
        this.rst = JSON.stringify(appendTest())
        break
      case 9:
        this.rst = JSON.stringify(searchCacheTest())
        break
      case 10:
        exportTest()
        this.rst = 'export async method result, please look for log,search in hilog：export log please check'
        break
      case 11:
        importTest()
        this.rst = 'import async method result, please look for log,search in hilog：IMPORT log please check :'
        break
    }
  }
}