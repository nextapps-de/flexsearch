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
  IndexOptionsForDocumentSearch,
  SimpleDocumentSearchResultSetUnit,
  StoreOption,
} from '@ohos/flexsearch';
import { DocBeanStyle, DocumentSearchResultBean, ResultBeanStyle } from './Bean';

const TAG: string = "flexSearch document async method :: ";

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

export default function documentClassAsyncMethodXts() {
  describe('documentClassAsyncMethodTest', () => {
    it("Document.addAsyncAndSearchAsync_case1", 0, () => {
      flexSearchDocument.addAsync("addAsyncAndSearchAsync_case1", new DocsDataType('url12', '开源', '开源鸿蒙', 'Document.add_case1。。'))
      setTimeout(() => {
        flexSearchDocument.searchAsync("开源").then((result: SimpleDocumentSearchResultSetUnit[]) => {
          console.log(TAG + "Document.addAsyncAndSearchAsync_case1 : " + JSON.stringify(result));
          expect(result).assertDeepEquals([{
            "field": "title", "result": ["addAsyncAndSearchAsync_case1    oo"]
          }]);
        });
      }, 500)
    })

    it("Document.addAsyncAndSearchAsync_case2", 0, () => {
      flexSearchDocument.addAsync(2222,
        new DocsDataType('url13', '2222数字', '数字经济', 'Document.这有数字add_case2。。'))
        .then(() => {
          let result: SimpleDocumentSearchResultSetUnit[] = flexSearchDocument.search("数字", 10);
          console.log(TAG + "Document.addAsyncAndSearchAsync_case2 : " + JSON.stringify(result));
          expect(result).assertDeepEquals([{
            "field": "title", "result": [2222]
          }, {
            "field": "content", "result": [2222]
          }]);
        })
    })

    it("Document.addAsyncAndSearchAsync_case3", 0, () => {
      flexSearchDocument.addAsync("add_case3",
        new DocsDataType('url14', '吃喝', '谈吃喝', 'Document.add_case3。。'));
      setTimeout(() => {
        flexSearchDocument.searchAsync("开源", ['title', 'content']).then((result) => {
          console.log(TAG + "Document.addAsyncAndSearchAsync_case3 : " + JSON.stringify(result));
          expect(result).assertDeepEquals([{
            "field": "title", "result": ["addAsyncAndSearchAsync_case1"]
          }]);
        })
      }, 300)

    })

    it("Document.addAsyncAndSearchAsync_case4", 0, () => {
      flexSearchDocument.addAsync("add_case4",
        new DocsDataType('url15', '语言', 'ArkTs 语言', 'ArkTs 语言 for app。。'));
      setTimeout(() => {
        flexSearchDocument.searchAsync("语言", 10)
          .then((result) => {
            console.log(TAG + " Document.addAsyncAndSearchAsync_case4 : " + JSON.stringify(result));
            expect(result).assertDeepEquals([{
              "field": "title", "result": ["add_case4"]
            }, {
              "field": "content", "result": ["add_case4"]
            }]);
          })
      }, 300);
    })

    it("Document.addAsyncAndSearchAsync_case5", 0, () => {
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
      flexSearchDocumentTmp.addAsync("number001", new DocumentAnother("开发语言", "ArkTs语言", "app 开发语言"));
      setTimeout(() => {
        flexSearchDocumentTmp.searchAsync("语言", {
          index: ['name', 'value']
        }).then((result) => {
          console.log(TAG + " Document.addAsyncAndSearchAsync_case5 ： " + JSON.stringify(result));
          expect(result).assertDeepEquals([{
            "field": "name", "result": ["number001"]
          }, {
            "field": "value", "result": ["number001"]
          }]);
        })
      }, 300)
    })

    it("Document.appendAsyncAndSearchAsync_case1", 0, () => {
      flexSearchDocument.appendAsync("appendAsyncAndSearchAsync_case1", new DocsDataType("url1", "拼接", "拼接标题", "这是拼接内容"));
      setTimeout(() => {
        flexSearchDocument.searchAsync("拼接", 10, (searchResult: SimpleDocumentSearchResultSetUnit[]) => {
          console.log(TAG + " appendAsyncAndSearchAsync_case1 :  " + JSON.stringify(searchResult));
          expect(searchResult).assertDeepEquals([{
            "field": "title", "result": ["appendAsyncAndSearchAsync_case1", 1001]
          }, {
            "field": "content", "result": ["appendAsyncAndSearchAsync_case1", 1001]
          }]);
        })
      }, 300);
    })

    it("Document.appendAsyncAndSearchAsync_case2", 0, () => {
      flexSearchDocument.appendAsync(1001, new DocsDataType("url2", "拼接+2", "拼接标题+2", "这是拼接内容+2"));
      setTimeout(() => {
        flexSearchDocument.searchAsync("拼接", {
          index: ['title'],
          limit: 10,
          enrich: true,
          bool: 'and'
        }, (searchResult: SimpleDocumentSearchResultSetUnit[]) => {
          console.log(TAG + " appendAsyncAndSearchAsync_case2 :  " + JSON.stringify(searchResult));
          const documentSearchResultBean: DocumentSearchResultBean = new DocumentSearchResultBean(
            "title", [
            new ResultBeanStyle("appendAsyncAndSearchAsync_case1", new DocBeanStyle("url1", "拼接标题")),
            new ResultBeanStyle(1001, new DocBeanStyle("url2", "拼接标题+2"))
          ]);
          expect(searchResult).assertDeepEquals(documentSearchResultBean);
        })
      }, 300);
    })

    it("Document.appendAsyncAndSearchAsync_case3", 0, () => {
      flexSearchDocument.appendAsync(404, new DocsDataType("url3", "介绍", "自我介绍", "这是自我介绍内容"));
      setTimeout(() => {
        flexSearchDocument.searchAsync("介绍", {
          index: ['title'],
          limit: 10,
          enrich: true,
          bool: 'and'
        }, (searchResult: SimpleDocumentSearchResultSetUnit[]) => {
          console.log(TAG + " appendAsyncAndSearchAsync_case3 :  " + JSON.stringify(searchResult));
          const documentSearchResultBean: DocumentSearchResultBean = new DocumentSearchResultBean(
            "title", [new ResultBeanStyle(404, new DocBeanStyle("url3", "自我介绍"))]);
          expect(searchResult).assertDeepEquals(documentSearchResultBean);
        })
      }, 300);
    })

    it("Document.appendAsyncAndSearchAsync_case4", 0, () => {
      flexSearchDocument.appendAsync(505, new DocsDataType("url4", "你好", "你好的解释", "你好是问候语"));
      setTimeout(() => {
        flexSearchDocument.searchAsync("你好", {
          index: ['title'],
          limit: 10,
          enrich: true,
          bool: "and"
        }, (searchResult: SimpleDocumentSearchResultSetUnit[]) => {
          console.log(TAG + " appendAsyncAndSearchAsync_case4 :  " + JSON.stringify(searchResult));
          const documentSearchResultBean: DocumentSearchResultBean = new DocumentSearchResultBean(
            "title", [new ResultBeanStyle(505, new DocBeanStyle("url4", "你好的解释"))]);
          expect(searchResult).assertDeepEquals(documentSearchResultBean);
        })
      }, 300);
    })

    it("Document.appendAsyncAndSearchAsync_case5", 0, () => {
      flexSearchDocument.appendAsync(200, new DocsDataType("url5", "辛苦", "辛苦的解释", "辛苦可以形容工作或学习努力"));
      setTimeout(() => {
        flexSearchDocument.searchAsync("辛苦", {
          index: ['title'],
          limit: 10,
          enrich: true,
          bool: 'or'
        }, (searchResult: SimpleDocumentSearchResultSetUnit[]) => {
          console.log(TAG + " appendAsyncAndSearchAsync_case5 :  " + JSON.stringify(searchResult));
          const documentSearchResultBean: DocumentSearchResultBean = new DocumentSearchResultBean(
            "title", [new ResultBeanStyle("url5", new DocBeanStyle("url5", "经济走向")),
            new ResultBeanStyle(200, new DocBeanStyle("url5", "辛苦的解释"))
          ]);
          expect(searchResult).assertDeepEquals(documentSearchResultBean);
        })
      }, 300);
    })

    it("Document.updateAsync_case1", 0, () => {
      flexSearchDocument.add("原始id",
        new DocsDataType('url15', '语言', 'ArkTs 语言', 'ArkTs 语言 for app。。'));
      flexSearchDocument.updateAsync("原始id", new DocsDataType("url1", "更新", "标题已更新", "这是更新后的内容"));
      setTimeout(() => {
        flexSearchDocument.searchAsync({
          query: "更新",
          index: ['title'],
          limit: 10,
          enrich: true,
          bool: "and"
        }, (result) => {
          console.log(TAG + " updateAsync_case1 :  " + JSON.stringify(result));
          const documentSearchResultBean: DocumentSearchResultBean = new DocumentSearchResultBean(
            "title", [new ResultBeanStyle("原始id", new DocBeanStyle("url1", "标题已更新")),
            new ResultBeanStyle("ID2", new DocBeanStyle("url1", "标题已更新")),
            new ResultBeanStyle("IDID", new DocBeanStyle("url1", "标题已更新")),
            new ResultBeanStyle("使用options", new DocBeanStyle("url1", "标题已更新")),
          ]);
          expect(result).assertDeepEquals(documentSearchResultBean);
        });
      }, 300)
    })

    it("Document.updateAsync_case2", 0, () => {
      flexSearchDocument.add("updateAsync_case2",
        new DocsDataType('url15', '语言', 'ArkTs 语言', 'ArkTs 语言 for app。。'));
      flexSearchDocument.updateAsync("updateAsync_case2", new DocsDataType("url1", "更新双倍", "标题已更新", "我爱我家"));
      setTimeout(() => {
        flexSearchDocument.searchAsync({
          query: "我家",
          index: ['content'],
          limit: 10,
          enrich: true,
          bool: "or"
        }, (result) => {
          console.log(TAG + " updateAsync_case2 :  " + JSON.stringify(result));
          const documentSearchResultBean: DocumentSearchResultBean = new DocumentSearchResultBean(
            "content", [new ResultBeanStyle("updateAsync_case2", new DocBeanStyle("url1", "标题已更新"))
          ]);
          expect(result).assertDeepEquals(documentSearchResultBean);
        });
      }, 300)
    })

    it("Document.updateAsync_case3", 0, () => {
      flexSearchDocument.add("IDID",
        new DocsDataType('url16', '语言', 'ArkTs 语言', 'ArkTs 语言 for app。。'));
      flexSearchDocument.updateAsync("IDID", new DocsDataType("url1", "更新三倍倍", "标题已更新", "这是更新三倍倍内容"));
      setTimeout(() => {
        flexSearchDocument.searchAsync({
          query: "三倍",
          index: ['content'],
          limit: 10,
          enrich: true,
          bool: "or"
        }).then((result) => {
          console.log(TAG + " updateAsync_case3 :  " + JSON.stringify(result));
          const documentSearchResultBean: DocumentSearchResultBean = new DocumentSearchResultBean(
            "content", [new ResultBeanStyle("IDID", new DocBeanStyle("url1", "标题已更新"))
          ]);
          expect(result).assertDeepEquals(documentSearchResultBean);
        });
      }, 300)
    })

    it("Document.updateAsync_case4", 0, () => {
      flexSearchDocument.add("使用options",
        new DocsDataType('url17', '语言', 'ArkTs 语言', 'ArkTs 语言 for app。。'));
      flexSearchDocument.updateAsync("使用options", new DocsDataType("url1", "使用options", "标题已更新", "只使用options的异步搜索"));
      setTimeout(() => {
        flexSearchDocument.searchAsync({
          query: "异步搜索",
          index: ['title','content'],
          limit: 10,
          enrich: true,
          bool: "and"
        }).then((result) => {
          console.log(TAG + " updateAsync_case4 :  " + JSON.stringify(result));
          const documentSearchResultBean: DocumentSearchResultBean = new DocumentSearchResultBean(
            "title", [new ResultBeanStyle("updateAsync_case5", new DocBeanStyle("url1", "异步搜索"))
          ]);
          const documentSearchResultBean1: DocumentSearchResultBean = new DocumentSearchResultBean(
            "content", [new ResultBeanStyle("updateAsync_case5", new DocBeanStyle("url1", "异步搜索")),
            new ResultBeanStyle("使用options", new DocBeanStyle("url1", "标题已更新"))
          ]);
          expect(result).assertDeepEquals([documentSearchResultBean, documentSearchResultBean1]);
        });
      }, 300)
    })

    it("Document.updateAsync_case5", 0, () => {
      flexSearchDocument.add("updateAsync_case5",
        new DocsDataType('url17', '语言', 'ArkTs 语言', 'ArkTs 语言 for app。。'));
      flexSearchDocument.updateAsync("updateAsync_case5", new DocsDataType("url1", "搜索", "异步搜索", "全参异步搜索"));
      setTimeout(() => {
        flexSearchDocument.searchAsync({
          query: "异步搜索",
          index: ['title','content'],
          bool: "and"
        }).then((result) => {
          console.log(TAG + " updateAsync_case5 :  " + JSON.stringify(result));
          const documentSearchResultBean: DocumentSearchResultBean = new DocumentSearchResultBean("title",["updateAsync_case5"]);
          const documentSearchResultBean1: DocumentSearchResultBean = new DocumentSearchResultBean("content", ["updateAsync_case5", "使用options"]);
          expect(result).assertDeepEquals([documentSearchResultBean, documentSearchResultBean1]);
        });
      }, 300)
    })

    it("Document.removeAsync_case1", 0, () => {
      flexSearchDocument.add("remove_targetIdAndT_AndSearch_case1", new DocsDataType("number001", "库里库里", "超级巨星", "斯蒂芬库里库里"));
      let result0 = flexSearchDocument.search("库里库里");
      console.log(TAG + " removeAsync_case1 000 :  " + JSON.stringify(result0));
      expect(result0).assertDeepEquals([{"field":"content","result":["remove_targetIdAndT_AndSearch_case1"]}]);
      flexSearchDocument.removeAsync(new DocsDataType("number001", "库里库里", "超级巨星", "斯蒂芬库里库里"));
      setTimeout(() => {
        flexSearchDocument.searchAsync({
          query: "库里库里",
          index: ['title', 'content'],
          limit: 10,
          enrich: true,
          bool: "and"
        }).then((result) => {
          console.log(TAG + " removeAsync_case1 111 :  " + JSON.stringify(result));
          expect(result.length).assertEqual(0);
        })
      }, 300)
    })

    it("Document.removeAsync_case2", 0, () => {
      flexSearchDocument.add("remove_targetIdAndT_AndSearch_case2", new DocsDataType("number002", "詹姆斯詹姆斯", "超级巨星", "勒布朗詹姆斯詹姆斯"));
      let result0 = flexSearchDocument.search("詹姆斯詹姆斯");
      console.log(TAG + " removeAsync_case2 000 :  " + JSON.stringify(result0));
      expect(result0).assertDeepEquals([{"field":"content","result":["remove_targetIdAndT_AndSearch_case2"]}]);
      flexSearchDocument.removeAsync("remove_targetIdAndT_AndSearch_case2");
      setTimeout(()=>{
        flexSearchDocument.searchAsync({
          query: "库里库里",
          index: ['title', 'content'],
          limit: 10,
          enrich: true,
          bool: "and"
        }).then((result) => {
          console.log(TAG + " removeAsync_case2 111 :  " + JSON.stringify(result));
          expect(result.length).assertEqual(0);
        })
      },300)
    })

    it("Document.removeAsync_case3", 0, () => {
      flexSearchDocument.add("remove_targetIdAndT_AndSearch_case3", new DocsDataType("number003", "杜兰特杜兰特", "超级巨星", "凯文杜兰特杜兰特"));
      let result0: SimpleDocumentSearchResultSetUnit[] = flexSearchDocument.search("杜兰特杜兰特");
      console.log(TAG + " removeAsync_case3 000 :  " + JSON.stringify(result0));
      const documentSearchResultBean: DocumentSearchResultBean = new DocumentSearchResultBean("content", ["remove_targetIdAndT_AndSearch_case3"]);
      expect(result0.length).assertDeepEquals(1);
      expect(result0[0].result).assertDeepEquals(documentSearchResultBean.result);
      flexSearchDocument.removeAsync("remove_targetIdAndT_AndSearch_case3", () => {
        flexSearchDocument.searchAsync("杜兰特杜兰特").then((result) => {
          console.log(TAG + " removeAsync_case3 111 :  " + JSON.stringify(result));
          expect(result.length).assertEqual(0);
        })
      });
    })
  })
}