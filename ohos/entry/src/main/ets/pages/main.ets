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

import router from '@ohos.router';

@Entry
@Component
struct MainPage {
  @Builder MyButton(content: string, pagePath: string) {
    Button(content)
      .size({ width: 300, height: 36 })
      .margin({ top: 20, right: 6, bottom: 0, left: 6 })
      .fontColor('white')
      .fontSize(14)
      .fontWeight(FontWeight.Bold)
      .backgroundColor('#00a6ff')
      .borderWidth(1)
      .borderColor('#28c989')
      .borderRadius(2)
      .borderStyle(BorderStyle.Solid)
      .onClick(() => {
        router.pushUrl({ url: pagePath })
      })
  }

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Start }) {
      this.MyButton('demo for {@code Index}', 'pages/index')
      this.MyButton('demo for {@code Document}', 'pages/document')
      this.MyButton('demo for {@code WorkerIndex}', 'pages/worker')
    }
    .width('100%')
    .height('100%')
  }
}