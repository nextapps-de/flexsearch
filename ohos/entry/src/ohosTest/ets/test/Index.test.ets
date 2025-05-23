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

import langEN from '../../../main/ets/utils/langEN';
import { describe, it, expect } from '@ohos/hypium'
import flexSearch, { Index, Id, SearchOptions, IndexSearchResult } from '@ohos/flexsearch';

flexSearch.registerLanguage('en', langEN);


namespace ohos_index {
  export function addData(): Index {
    const indexData: string[] = [
      'a', 'a aa', 'a aa aaa',
      'b', 'b bb', 'b bb bbb',
      'a', 'c cc', 'c cc ccc',
      'd', 'b bb', 'd dd ddd'
    ];
    let index = new flexSearch.Index();
    for (let i = 0; i < indexData.length; i++) {
      index.add(i, indexData[i]);
    }
    return index;
  }
}

export default function indexClassXTS() {

  const indexData: string[] = [
    'a', 'a aa', 'a aa aaa',
    'b', 'b bb', 'b bb bbb',
    'a', 'c cc', 'c cc ccc',
    'd', 'b bb', 'd dd ddd'
  ];
  let index = new flexSearch.Index();
  for (let i = 0; i < indexData.length; i++) {
    index.add(i, indexData[i]);
  }

  describe('indexClassTest', () => {
    it('Index.add_case_1', 0, () => {
      index.add(0, "content-0");
      expect(index.contain(0)).assertTrue();
    })

    it('Index.add_case_2', 0, () => {
      index.add(1, "content-1");
      expect(1).assertEqual(index.search("content-1")[0]);
    })

    it('Index.add_case_3', 0, () => {
      index.add(2, "content-2");
      expect(2).assertEqual(index.search("content-2")[0]);
    })

    it('Index.add_case_4', 0, () => {
      index.add(4, "content-3");
      expect(4).assertEqual(index.search("content-3")[0]);
    })

    it('Index.add_case_5', 0, () => {
      index.add('five', "content-five");
      expect('five').assertEqual(index.search("content-five")[0]);
    })

    it("Index.addAsync_case_1", 0, () => {
      index.addAsync(0, "content-1")
        .then((index: flexSearch.Index) => {
          expect(index.contain(0)).assertTrue();
        })
    })

    it("Index.addAsync_case_2", 0, async () => {
      let res: Index = await index.addAsync(indexData.length, "ddd")
      let resSearch = res.search("ddd");
      console.log("flexSearch result 000 : " + JSON.stringify(resSearch));
      expect(12).assertEqual(resSearch[0]);
    })

    it("Index.addAsync_case_3", 0, async () => {
      let res: Index = await index.addAsync(1, "content-2")
      let resSearch = res.search("content-2");
      console.log("flexSearch result 111 : " + JSON.stringify(resSearch));
      expect(2).assertEqual(resSearch.length);
    })

    it("Index.addAsync_case_4", 0, async () => {
      let res: Index = await index.addAsync("addKey", "addKey")
      let resSearch = res.search(' ');
      console.log("flexSearch result 222 : " + JSON.stringify(resSearch));
      expect(resSearch[0]).assertUndefined();
    })

    it("Index.addAsync_case_5", 0, async () => {
      let res: Index = await index.addAsync(9, " ");
      let resSearch = res.search("addKey");
      console.log("flexSearch result 333 : " + JSON.stringify(resSearch));
      expect("addKey").assertEqual(resSearch[0]);
    })

    it("Index.append_case_1", 0, () => {
      index.append(3, "append_3");
      let res = index.search("append_3");
      console.log("flexSearch append 000 :" + JSON.stringify(res));
      expect(3).assertEqual(res[0]);
    })

    it("Index.append_case_2", 0, () => {
      index.append(2, "append_case_2");
      let res = index.search("append_case_2");
      console.log("flexSearch append 222 :" + JSON.stringify(res));
      expect(2).assertEqual(res[0]);
    })

    it("Index.append_case_3", 0, () => {
      index.append(1, "append_case_3");
      let res = index.search("append_case_3");
      console.log("flexSearch append 333 :" + JSON.stringify(res));
      expect(1).assertEqual(res[0]);
    })

    it("Index.append_case_4", 0, () => {
      index.append(0, "append_case_4");
      let res = index.search("append_case_4");
      console.log("flexSearch append 444 :" + JSON.stringify(res));
      expect(0).assertEqual(res[0]);
    })

    it("Index.append_case_5", 0, () => {
      index.append(5, "append_case_5");
      let res = index.search("append_case_5");
      console.log("flexSearch append 555 :" + JSON.stringify(res));
      expect(5).assertEqual(res[0]);
    })

    it("Index.appendAsync_case_1", 0, async () => {
      let index = new flexSearch.Index();
      let res: Index = await index.appendAsync(0, "appendAsync_case_1");
      let resSearch = res.search("appendAsync_case_2");
      console.log("flexSearch appendAsync 111 :" + JSON.stringify(resSearch));
      expect(0).assertEqual(resSearch.length);
    })

    it("Index.appendAsync_case_2", 0, async () => {
      let index = new flexSearch.Index();
      let res: Index = await index.appendAsync(1, "appendAsync_case_2");
      let resSearch = res.search("appendAsync_case_2");
      console.log("flexSearch appendAsync 222 :" + JSON.stringify(resSearch));
      expect(res.contain(1)).assertTrue();
    })

    it("Index.appendAsync_case_3", 0, async () => {
      let res: Index = await index.appendAsync(0, "appendAsync_case_3", () => {
        let resSearch = res.search("appendAsync_case_1");
        console.log("flexSearch appendAsync 333 :" + JSON.stringify(resSearch));
        expect(0).assertEqual(resSearch.length);
      });
    })

    it("Index.appendAsync_case_4", 0, async () => {
      let res: Index = await index.appendAsync(8, "appendAsync_case_4", () => {
        let resSearch = res.search("appendAsync_case_4");
        console.log("flexSearch appendAsync 444 :" + JSON.stringify(resSearch));
        expect(8).assertEqual(resSearch[0]);
      });
    })

    it("Index.appendAsync_case_5", 0, async () => {
      let index = new flexSearch.Index();
      let res: Index = await index.appendAsync(7, "appendAsync_case_5", () => {
        let resSearch = res.search("appendAsync_case_5");
        console.log("flexSearch appendAsync 555 :" + JSON.stringify(resSearch));
        expect(7).assertEqual(resSearch[0]);
      });
    })

    it("Index.update_case_1", 0, () => {
      let index = ohos_index.addData();
      index.update(3, "update_case_1");
      expect(index.search("update_case_1",
        {
          query: "update_case_1", limit: 10, offset: 0, suggest: true
        }
      )[0]).assertEqual(3)
    })

    it("Index.update_case_2", 0, () => {
      let index = ohos_index.addData();
      index.update(8, "update_case_2");
      expect(index.search("update_case_2", 10)[0]).assertEqual(8);
    })

    it("Index.update_case_3", 0, () => {
      index.update(3, "update_case_3");
      let resSearch = index.search("update_case_3", 10);
      console.log("flexSearch update 333 :" + JSON.stringify(resSearch));
      expect(3).assertEqual(resSearch[0]);
    })

    it("Index.update_case_4", 0, () => {
      index.update("update_case_4", "update_case_4");
      let resSearch = index.search("update_case_4", 10);
      console.log("flexSearch update 444 :" + JSON.stringify(resSearch));
      expect("update_case_4").assertEqual(resSearch[0]);
    })

    it("Index.update_case_5", 0, () => {
      index.update("update_case_5", "update_case_5");
      let resSearch = index.search("update_case_5", 10);
      console.log("flexSearch update 555 :" + JSON.stringify(resSearch));
      expect("update_case_5").assertEqual(resSearch[0]);
    })


    it("Index.updateAsync_case_1", 0, async () => {
      let index = ohos_index.addData();
      let res = await index.updateAsync(3, "updateAsync_case_1");
      expect(res.search("updateAsync_case_1",
        {
          query: "updateAsync_case_1", limit: 10, offset: 0, suggest: true
        }
      )[0]).assertEqual(3)
    })

    it("Index.updateAsync_case_2", 0, async () => {
      let index = ohos_index.addData();
      let res = await index.updateAsync(3, "updateAsync_case_2");
      expect(res.search("updateAsync_case_2", 10)[0]).assertEqual(3);
    })

    it("Index.updateAsync_case_3", 0, async () => {
      let index = ohos_index.addData();
      let res = await index.updateAsync(7, "updateAsync_case_3");
      let resSearch = res.search("updateAsync_case_3", 10);
      console.log("flexSearch update 333 :" + JSON.stringify(resSearch));
      expect(7).assertEqual(resSearch[0])
    })

    it("Index.updateAsync_case_4", 0, async () => {
      let index = ohos_index.addData();
      let res = await index.updateAsync(9, "updateAsync_case_4");
      let resSearch = res.search("updateAsync_case_4",
        {
          query: "updateAsync_case_4", limit: 10, offset: 0, suggest: true
        }
      )
      console.log("flexSearch update 444 :" + JSON.stringify(resSearch));
      expect(9).assertEqual(resSearch[0])
    })

    it("Index.updateAsync_case_5", 0, async () => {
      let index = ohos_index.addData();
      let res = await index.updateAsync(0, "updateAsync_case_5");
      let resSearch = res.search("updateAsync_case_5",
        {
          query: "updateAsync_case_5", limit: 10, offset: 0, suggest: true
        }
      )
      console.log("flexSearch update 555 :" + JSON.stringify(resSearch));
      expect(0).assertEqual(resSearch[0])
    })

    it("Index.removeAndContain_case_1", 0, () => {
      let index = ohos_index.addData();
      let resSearch = index.search("a");
      console.log("flexSearch removeAndContain_case_1 :" + JSON.stringify(resSearch));
      expect(index.contain(0)).assertTrue()
      expect(index.contain(6)).assertTrue()
      index.remove(0);
      expect(index.contain(0)).assertFalse();
      expect(index.contain(6)).assertTrue();
    })

    it("Index.removeAndContain_case_2", 0, () => {
      let index = ohos_index.addData();
      index.add("removeAndContain_case_2", "removeAndContain_case_2");
      let resSearch0 = index.search("removeAndContain_case_2");
      console.log("flexSearch removeAndContain_case_2  00 :" + JSON.stringify(resSearch0));
      expect("removeAndContain_case_2").assertEqual(resSearch0[0]);
      index.remove("removeAndContain_case_2");
      let resSearch = index.search("removeAndContain_case_2");
      console.log("flexSearch removeAndContain_case_2  :" + JSON.stringify(resSearch));
      expect(0).assertEqual(resSearch.length);
    })

    it("Index.removeAndContain_case_3", 0, () => {
      let index = ohos_index.addData();
      let resSearch = index.search("b bb");
      console.log("flexSearch removeAndContain_case_3 :" + JSON.stringify(resSearch));
      expect(resSearch.length).assertEqual(2);
      expect(index.contain(4)).assertTrue();
      index.remove(4);
      expect(index.contain(4)).assertFalse();
      expect(resSearch.length).assertEqual(1);
      expect(index.contain(10)).assertTrue();
      index.remove(10);
      expect(index.contain(10)).assertFalse();
      expect(resSearch.length).assertEqual(0);
    })

    it("Index.removeAsync_case_1", 0, async () => {
      let res = await ohos_index.addData().removeAsync(6)
      expect(res.search("6")[0]).assertUndefined();
    })

    it("Index.removeAsync_case_2", 0, async () => {
      let index = ohos_index.addData();
      let res = await index.removeAsync(3)
      expect(res.search("1")).not().assertUndefined();
    })

    it("Index.removeAsync_case_3", 0, async () => {
      let index = ohos_index.addData();
      index.add("removeAsync_case_3", "removeAsync_case_3");
      let resSearch = index.search("removeAsync_case_3");
      expect("removeAsync_case_3").assertEqual(resSearch[0]);
      let res = await index.removeAsync("removeAsync_case_3", () => {
        let resSearch0 = res.search("removeAsync_case_3");
        expect(0).not().assertEqual(resSearch0.length);
      })
    })

    it("Index.contain_case_1", 0, () => {
      expect(ohos_index.addData().contain(0)).assertTrue();
    })

    it("Index.contain_case_2", 0, () => {
      expect(ohos_index.addData().contain(101)).assertFalse();
    })

    it("Index.export_case", 0, async () => {
      class exportedData {
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

      let index: Index = new flexSearch.Index();
      index.add('doc1', 'This is the content of document 1.');
      index.add('doc2', 'Another document with different content.');
      await index.export((key, data) => {
        let tmp = new exportedData(key, data);
        expect(tmp).not().assertNull();
      });
    })

    it("Index.import_case", 0, async () => {
      let newIndex: Index = new flexSearch.Index();
      const data = `{"doc1":1,"doc2":1}`;
      newIndex.import("reg", data)
      expect(newIndex.contain("doc1")).assertTrue();
    })

    it("Index.searchAsync_case1", 0, async () => {
      let index: Index = ohos_index.addData();
      await index.searchAsync(
        "b bb",
        {
          limit: 4,
          offset: 1,
          suggest: true
        },
        (ids: Id[]) => {
          expect(ids.length).assertEqual(1);
          expect(ids[0]).assertEqual(10);
        }
      );
    })

    it("Index.searchAsync_case2", 0, () => {
      const indexObj: Index = new flexSearch.Index();
      indexObj.add(1, "This is a sample document");
      indexObj.add("document", "document");
      indexObj.add(5, "document");
      const searchOptions: SearchOptions = {
        query: "document",
        limit: 2
      };
      indexObj.searchAsync("document", searchOptions)
        .then((result: IndexSearchResult) => {
          console.log("flexSearch Search result : ", JSON.stringify(result));
          expect(index.contain("document")).assertTrue();
          expect(2).assertEqual(result.length);
        })
    })
  })
}
