/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
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

export class DocumentSearchResultBean {
  public field: string;
  public result: ResultBeanStyle[] | string[] = [];

  constructor(field: string, result: ResultBeanStyle[] | string[]) {
    this.field = field;
    if (result != undefined) {
      this.result = result;
    }
  }
}

export class ResultBeanStyle {
  public id: number | string = "";
  public doc: DocBeanStyle;

  constructor(id: number | string, doc: DocBeanStyle) {
    if (id != undefined) {
      this.id = id;
    }
    this.doc = doc;
  }
}

export class DocBeanStyle {
  public url: string = "";
  public title: string;

  constructor(url: string, title: string) {
    this.url = url;
    this.title = title;
  }
}