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

import { describe, it, expect } from '@ohos/hypium';
import FlexSearch, {
  DocumentSearchResult,
  Id,
  IndexOptionsForDocumentSearch,
  SimpleDocumentSearchResultSetUnit,
  StoreOption,
} from '@ohos/flexsearch';

const TAG: string = "flexSearch document :: ";

class DocsDataType {
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

const docs: DocsDataType[] = [
  new DocsDataType('url1', '房产', '外卖小哥7万元小城买房', '一年前，李某在“流浪吧”详述了自己前往买房的经历，相比于一线城市的天价，5万一套房的叙说令一夜爆火。于是很多“流浪”的人也携带几万块现金，去往该地试图终结自己的流浪生涯'),
  new DocsDataType('url2', '流行病', '一对母子入境某地确诊', '陈某，女，31岁，无业，入境前半年一直在某地区居住生活，以居家为主，2-3天外出买菜一次。7月17日凌晨出现咽痛，无发热等其他症状...'),
  new DocsDataType('url3', '民生', '暴雨内涝', '某地区多地出现暴雨到大暴雨，清江水位暴涨，恩施城区内涝严重，民众财产受损。图为群众清理道路淤泥'),
  new DocsDataType('url4', '房产', '楼市新数据：金九不再 四季度或持续降温', '周三公布的70个大中城市房价数据显示，一、二线城市新建 ... 在3季度金融数据新闻发布会上还表示，部分金融机构对融资惯例规则存在...'),
  new DocsDataType('url5', '经济', '经济走向', '把脉经济走向. By Reuters Staff. 2 Min Read.'),
  new DocsDataType('url6', '流行病', '流行病波及8省份！加强针什么时候能打？疾控专家提醒冬季流行病 ...', '大象新闻消息，仅三天时间，已经 ... 10月18日，当地新增本土确诊病例6例，无症状感染者1...'),
  new DocsDataType('url7', '流行病', '流行病：变种病毒在引发关注议会报告以应对 ...', '消息人士向有线电视新闻网记者透露，可能很快就会推荐40岁或40岁以上、此前曾接种过莫德纳或辉瑞疫苗的人员接种第三剂疫苗。'),
  new DocsDataType('url8', '房产', '新闻8点见丨一周内两度公开谈事件，释放哪些信息？_ ...', '一家房地产公司，目前的主要风险是到期债务未能偿还，部分工地停工，已预售的房产按时交付有不确定性。总体而言，风险是个案风险。 易纲称，...'),
  new DocsDataType('url9', '房产', '征收房地产税计划试点城市', '... 在房地产中；房地产价值的...。'),
  new DocsDataType('url10', '房产', '中国房地产发展', '土地供应方面，保障住房...'),
  new DocsDataType('url11', '民生', '人才引进来技术留下来（一线探民生）--新闻报道', '近年来，加强人才引进与培养：根据产业发展需求搭建平台，有针对性地引入高层次人才；在医疗、教育等民生领域进行组团式帮...')
];

const options: IndexOptionsForDocumentSearch<DocsDataType, StoreOption> = {
  preset: 'default',
  tokenize: 'strict',
  cache: 100,
  resolution: 9,
  context: false,
  optimize: true,
  charset: 'cjk',
  language: undefined,
  encode: false,
  stemmer: false,
  filter: ['的', '又', '及'],
  matcher: false,
  worker: false,
  document: {
    id: 'url',
    tag: 'tag',
    index: ['title', 'content'],
    store: ['url', 'title']
  }
};

let flexSearchDocument = new FlexSearch.Document(options);
// add init data
for (let index = 0; index < docs.length; index++) {
  flexSearchDocument.add(docs[index]);
}

const map: Map<Id, DocsDataType> = new Map();

export default function documentClassXts() {
  describe('DocumentClassTest', () => {
    it("Document.addAndSearch_case1", 0, () => {
      flexSearchDocument.add(new DocsDataType('url12', '开源', '开源鸿蒙', 'Document.add_case1。。'));
      flexSearchDocument.searchAsync("开源").then((result: SimpleDocumentSearchResultSetUnit[]) => {
        console.log(TAG + "Document.addAndSearch_case1 : " + JSON.stringify(result));
        expect(result[0].result[0]).assertEqual("url12");
      });
    })

    it("Document.addAndSearch_case2", 0, () => {
      flexSearchDocument.add(2222,
        new DocsDataType('url13', '2222数字', '数字经济', 'Document.这有数字add_case2。。'));
      let result: SimpleDocumentSearchResultSetUnit[] = flexSearchDocument.search("数字", 10);
      console.log(TAG + "Document.addAndSearch_case2 : " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "title", "result": [2222]
      }, {
        "field": "content", "result": [2222]
      }]);
    })

    it("Document.addAndSearch_case3", 0, () => {
      flexSearchDocument.add("add_case3",
        new DocsDataType('url14', '吃喝', '谈吃喝', 'Document.add_case3。。'));
      let result: SimpleDocumentSearchResultSetUnit[] = flexSearchDocument.search("开源", ['title', 'content']);
      console.log(TAG + "Document.addAndSearch_case3 : " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "title", "result": ["url12"]
      }]);
    })

    it("Document.addAndSearch_case4", 0, () => {
      flexSearchDocument.add("add_case4",
        new DocsDataType('url15', '语言', 'ArkTs 语言', 'ArkTs 语言 for app。。'));
      let result: SimpleDocumentSearchResultSetUnit[] = flexSearchDocument.search("语言", 10);
      console.log(TAG + " Document.addAndSearch_case4 : " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "title", "result": ["add_case4"]
      }, {
        "field": "content", "result": ["add_case4"]
      }]);
    })

    it("Document.addAndSearch_case5", 0, () => {
      class DocumentAnother {
        label: string;
        name: string;
        value: string;

        constructor(label: string, name: string, value: string) {
          this.label = label;
          this.name = name;
          this.value = value;
        }
      }

      const optionsTmp: IndexOptionsForDocumentSearch<DocumentAnother, StoreOption> = {
        preset: 'default',
        tokenize: 'strict',
        cache: 100,
        resolution: 9,
        context: false,
        optimize: true,
        charset: 'cjk',
        language: undefined,
        encode: false,
        stemmer: false,
        filter: ['的', '又', '及'],
        matcher: false,
        worker: false,
        document: {
          id: 'label',
          index: ['name', 'value'],
          store: ['label', 'value']
        }
      };
      let flexSearchDocumentTmp = new FlexSearch.Document(optionsTmp);
      flexSearchDocumentTmp.add("number001", new DocumentAnother("开发语言", "ArkTs语言", "app 开发语言"));
      let result: SimpleDocumentSearchResultSetUnit[] = flexSearchDocumentTmp.search("语言", {
        index: ['name', 'value']
      });
      console.log(TAG + " Document.addAndSearch_case5 ： " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "name", "result": ["number001"]
      }, {
        "field": "value", "result": ["number001"]
      }]);
    })

    it("Document.append_documentT_AndSearch_case1", 0, () => {
      flexSearchDocument.append(new DocsDataType("url1", "拼接", "拼接标题", "这是拼接内容"));
      const searchResult: DocumentSearchResult<DocsDataType, StoreOption, true> = flexSearchDocument.search("拼接", 10, {
        index: ['title'],
        limit: 10,
        enrich: true,
        bool: 'and'
      });
      console.log(TAG + " append_documentT_AndSearch_case1 :  " + JSON.stringify(searchResult));
      expect(searchResult).not().assertNull();
    })

    it("Document.append_documentT_AndSearch_case2", 0, () => {
      flexSearchDocument.append(new DocsDataType("url2", "拼接+2", "拼接标题+2", "这是拼接内容+2"));
      let result = flexSearchDocument.search("拼接");
      console.log(TAG + " append_documentT_AndSearch_case2 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "title", "result": ["url1", "url2"]
      }, {
        "field": "content", "result": ["url1", "url2"]
      }]);
    })

    it("Document.append_documentT_AndSearch_case3", 0, () => {
      flexSearchDocument.append(new DocsDataType("url3", "拼接拼接", "拼接标题到append_documentT_AndSearch_case3",
        "这是拼接内容append_documentT_AndSearch_case3"));
      let result = flexSearchDocument.search("拼接");
      console.log(TAG + " append_documentT_AndSearch_case3 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "title", "result": ["url1", "url2", "url3"]
      }, {
        "field": "content", "result": ["url1", "url2", "url3"]
      }]);
    })

    it("Document.append_idId_documentT_AndSearch_case4", 0, () => {
      flexSearchDocument.append(new DocsDataType("url4", "你好", "你好的解释", "你好是问候语"));
      let result = flexSearchDocument.search("你好");
      console.log(TAG + " append_idId_documentT_AndSearch_case4 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "title", "result": ["url4"]
      }, {
        "field": "content", "result": ["url4"]
      }]);
    })

    it("Document.append_idId_documentT_AndSearch_case5", 0, () => {
      flexSearchDocument.append(new DocsDataType("url5", "辛苦", "辛苦的解释", "辛苦可以形容工作或学习努力"));
      let result = flexSearchDocument.search("辛苦");
      console.log(TAG + " append_idId_documentT_AndSearch_case5 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "title", "result": ["url5"]
      }, {
        "field": "content", "result": ["url5"]
      }]);
    })

    it("Document.append_idId_documentT_AndSearch_case6", 0, () => {
      flexSearchDocument.append(new DocsDataType("url6", "开朗", "开朗的解释", "开朗可以形容人阳光积极"));
      let result = flexSearchDocument.search({
        index: ['title', 'content'],
        query: "开朗",
        limit: 10,
        enrich: true,
        bool: 'and'
      });
      console.log(TAG + " append_idId_documentT_AndSearch_case6 :  " + JSON.stringify(result));
      expect(result.length).assertEqual(2);
    })

    it("Document.update_documentT_AndSearch_case1", 0, () => {
      flexSearchDocument.update(new DocsDataType("url1", "更新", "标题已更新", "这是更新后的内容"));
      let result = flexSearchDocument.search("更新");
      console.log(TAG + " update_documentT_AndSearch_case1 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "title", "result": ["url1"]
      }, {
        "field": "content", "result": ["url1"]
      }]);
      let result1 = flexSearchDocument.search("房产");
      console.log(TAG + " update_documentT_AndSearch_case1 000 :  " + JSON.stringify(result1));
      expect(result1.length).assertEqual(2);
    })

    it("Document.update_documentT_AndSearch_case2", 0, () => {
      flexSearchDocument.update(new DocsDataType("url2", "变更22", "标题已变更", "这是变更后的内容"));
      let result = flexSearchDocument.search("变更");
      console.log(TAG + " update_documentT_AndSearch_case2 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "title", "result": ["url2"]
      }, {
        "field": "content", "result": ["url2"]
      }]);
      let result1 = flexSearchDocument.search("陈某");
      console.log(TAG + " update_documentT_AndSearch_case2 000 :  " + JSON.stringify(result1));
      expect(result1.length).assertEqual(0)
    })

    it("Document.update_idId_documentT_AndSearch_case3", 0, () => {
      flexSearchDocument.update("update_idId_documentT_AndSearch_case3", new DocsDataType("url3", "詹姆斯", "NBA球星", "这是詹姆斯"));
      let result = flexSearchDocument.search("詹姆斯");
      console.log(TAG + " update_idId_documentT_AndSearch_case3 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "content", "result": ["update_idId_documentT_AndSearch_case3"]
      }]);
    })

    it("Document.update_idId_documentT_AndSearch_case4", 0, () => {
      flexSearchDocument.update("update_idId_documentT_AndSearch_case4", new DocsDataType("url4", "斯蒂芬库里", "NBA球星", "这是库里"));
      let result = flexSearchDocument.search("库里");
      console.log(TAG + " update_idId_documentT_AndSearch_case4 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "content", "result": ["update_idId_documentT_AndSearch_case4"]
      }]);
    })

    it("Document.update_idId_documentT_AndSearch_case5", 0, () => {
      flexSearchDocument.update("update_idId_documentT_AndSearch_case5", new DocsDataType("url5", "杜兰特", "NBA球星", "杜兰特布克"));
      let result = flexSearchDocument.search("布克");
      console.log(TAG + " update_idId_documentT_AndSearch_case5 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "content", "result": ["update_idId_documentT_AndSearch_case5"]
      }]);
    })

    it("Document.update_idId_documentT_AndSearch_case6", 0, () => {
      flexSearchDocument.update("update_idId_documentT_AndSearch_case6", new DocsDataType("url6", "克莱汤普森", "NBA球星", "这是克莱汤普森"));
      let result = flexSearchDocument.search("克莱汤普森");
      console.log(TAG + " update_idId_documentT_AndSearch_case6 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "content", "result": ["update_idId_documentT_AndSearch_case6"]
      }]);
    })

    it("Document.update_idId_documentT_AndSearch_case7", 0, () => {
      flexSearchDocument.update("update_idId_documentT_AndSearch_case7", new DocsDataType("url7", "维金斯", "NBA球星", "布克维金斯"));
      let result = flexSearchDocument.search("金");
      console.log(TAG + " update_idId_documentT_AndSearch_case7 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "title", "result": ["url4"]
      }, {
        "field": "content", "result": ["update_idId_documentT_AndSearch_case7", "url4"]
      }]);
    })

    it("Document.remove_targetIdAndT_AndSearch_case1", 0, () => {
      flexSearchDocument.add("remove_targetIdAndT_AndSearch_case1", new DocsDataType("number001", "库里库里", "超级巨星", "斯蒂芬库里库里"));
      let result0 = flexSearchDocument.search("库里库里");
      console.log(TAG + " remove_targetIdAndT_AndSearch_case1 000 :  " + JSON.stringify(result0));
      expect(result0).assertDeepEquals([{
        "field": "content",
        "result": ["update_idId_documentT_AndSearch_case4", "remove_targetIdAndT_AndSearch_case1"]
      }]);
      flexSearchDocument.remove("remove_targetIdAndT_AndSearch_case1");
      let result = flexSearchDocument.search("库里库里");
      console.log(TAG + " remove_targetIdAndT_AndSearch_case1 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "content", "result": ["update_idId_documentT_AndSearch_case4"]
      }]);
    })

    it("Document.remove_targetIdAndT_AndSearch_case2", 0, () => {
      flexSearchDocument.add("remove_targetIdAndT_AndSearch_case2", new DocsDataType("number002", "詹姆斯詹姆斯", "超级巨星", "勒布朗詹姆斯詹姆斯"));
      let result0 = flexSearchDocument.search("詹姆斯詹姆斯");
      console.log(TAG + " remove_targetIdAndT_AndSearch_case2 000 :  " + JSON.stringify(result0));
      expect(result0).assertDeepEquals([{
        "field": "content",
        "result": ["update_idId_documentT_AndSearch_case3", "remove_targetIdAndT_AndSearch_case2"]
      }]);
      flexSearchDocument.remove("remove_targetIdAndT_AndSearch_case2");
      let result = flexSearchDocument.search("詹姆斯詹姆斯");
      console.log(TAG + " remove_targetIdAndT_AndSearch_case2 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "content", "result": ["update_idId_documentT_AndSearch_case3"]
      }]);
    })

    it("Document.remove_targetIdAndT_AndSearch_case3", 0, () => {
      flexSearchDocument.add("remove_targetIdAndT_AndSearch_case3", new DocsDataType("number003", "杜兰特杜兰特", "超级巨星", "凯文杜兰特杜兰特"));
      let result0 = flexSearchDocument.search("杜兰特杜兰特");
      console.log(TAG + " remove_targetIdAndT_AndSearch_case3 000 :  " + JSON.stringify(result0));
      expect(result0).assertDeepEquals([{
        "field": "content",
        "result": ["update_idId_documentT_AndSearch_case5", "remove_targetIdAndT_AndSearch_case3"]
      }]);
      flexSearchDocument.remove("remove_targetIdAndT_AndSearch_case3");
      let result = flexSearchDocument.search("杜兰特杜兰特");
      console.log(TAG + " remove_targetIdAndT_AndSearch_case3 :  " + JSON.stringify(result));
      expect(result).assertDeepEquals([{
        "field": "content", "result": ["update_idId_documentT_AndSearch_case5"]
      }]);
    })

    it("Document.remove_targetIdAndT_AndSearch_case4", 0, () => {
      flexSearchDocument.add("remove_targetIdAndT_AndSearch_case4", new DocsDataType("number004", "ID", "删除的标记", "根据ID删除"));
      let result0 = flexSearchDocument.search("删除");
      console.log(TAG + " remove_targetIdAndT_AndSearch_case4 000 :  " + JSON.stringify(result0));
      expect(result0).assertDeepEquals([{
        "field": "title", "result": ["remove_targetIdAndT_AndSearch_case4"]
      }, {
        "field": "content", "result": ["remove_targetIdAndT_AndSearch_case4"]
      }]);
      flexSearchDocument.remove("remove_targetIdAndT_AndSearch_case4");
      let result = flexSearchDocument.search("删除");
      console.log(TAG + " remove_targetIdAndT_AndSearch_case4 :  " + JSON.stringify(result));
      expect(result.length).assertEqual(0);
    })

    it("Document.remove_targetIdAndT_AndSearch_case5", 0, () => {
      flexSearchDocument.add("remove_targetIdAndT_AndSearch_case5", new DocsDataType("number005", "ID", "删除的标记第二次", "根据ID删除第二次"));
      let result0 = flexSearchDocument.search("第二次");
      console.log(TAG + " remove_targetIdAndT_AndSearch_case5 000 :  " + JSON.stringify(result0));
      expect(result0).assertDeepEquals([{
        "field": "title", "result": ["remove_targetIdAndT_AndSearch_case5"]
      }, {
        "field": "content", "result": ["remove_targetIdAndT_AndSearch_case5"]
      }]);
      flexSearchDocument.remove("remove_targetIdAndT_AndSearch_case5");
      let result = flexSearchDocument.search("第二次");
      console.log(TAG + " remove_targetIdAndT_AndSearch_case5 :  " + JSON.stringify(result));
      expect(result.length).assertEqual(0);
    })

    it("Document.exportCase", 0, () => {
      flexSearchDocument.export((id, value) => {
        map.set(id, value);
      })
      setTimeout(() => {
        console.log(TAG + " export map.size : " + map.size);
        expect(9).assertEqual(map.size);
      }, 1000)
    })

    it("Document.importCase", 0, () => {
      const importDocument = new FlexSearch.Document(options);
      setTimeout(() => {
        console.log(TAG + " import map.size : " + map.size);
        map.forEach((value, id) => {
          importDocument.import(id, value);
        })
        let result = importDocument.search("一线探民生");
        console.log(TAG + " Document.importCase :  " + JSON.stringify(result));
        expect(result).assertDeepEquals([{
          "field": "title", "result": ["url11"]
        }]);
        let result1 = importDocument.search("流行病");
        console.log(TAG + " Document.importCase result1 :  " + JSON.stringify(result1));
        expect(result1).assertDeepEquals([{
          "field": "title", "result": ["url6", "url7"]
        }]);
      }, 1000)
    })
  })
}