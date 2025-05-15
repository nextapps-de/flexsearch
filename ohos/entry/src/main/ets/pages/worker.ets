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

import indexData from '../model/indexData';
import model from '../model/workerIndexModel';

@Entry
@Component
struct WorkerPage {
  @State rst: string = 'WorkerIndex page';

  @Builder MyButton(content: string, eventType: number) {
    Button(content)
      .size({ width: 100, height: 40 })
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
      Text(JSON.stringify(indexData))
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
      Row() {
        this.MyButton("add(26, 'z zz zzz')", 0)
        this.MyButton('remove(0)', 1)
        this.MyButton("update(1, 'nb nbb nbbb')", 2)
      }

      Row() {
        this.MyButton("search('c')", 3)
        this.MyButton("append(26,' append ')", 4)
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

  onMyButtonClick(eventType: number) {

    switch (eventType) {
      case 0:
        model[0].fun(26, 'z zz zzz')

        this.rst = 'addAsync method, please look for log,search in hilog：flexsearch---WorkerIndex.addAsync success:'
        break
      case 1:
        model[2].fun(0)
        this.rst = 'removeAsync method, please look for log，search in hilog：WorkerIndex.removeAsync success:'
        break
      case 2:
        model[3].fun(1, 'nb nbb nbbb')
        this.rst = 'updateAsync method, please look for log，search in hilog：WorkerIndex.updateAsync success:'
        break
      case 3:
        model[4].fun('c');
        this.rst = 'searchAsync method, please look for log，search in hilog：WorkerIndex.searchAsync result ='
        break
      case 4:
        model[1].fun(26, ' append ');
        this.rst = 'appendAsync method, please look for log，search in hilog：WorkerIndex.appendAsync success:'
        break
    }
  }
}




