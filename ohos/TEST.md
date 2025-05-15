# flexsearch-ohos单元测试用例

该测试用例基于OpenHarmony系统下，自己编写用例进行单元测试。

单元测试用例覆盖情况

## Index单字段索引
|                                                     接口名                                                     |     是否通过	      |备注|
|:-----------------------------------------------------------------------------------------------------------:|:--------------:|:---:|
 |                                          add(id: Id, item: string)                                          |      PASS      |     |
 |                                        append(id: Id, item: string)                                         |      PASS      |     |
 |                                        update(id: Id, item: string)                                         |      PASS      |     |
 |                                             remove(target: Id)                                              |      PASS      |     |
 |                            search(query: string, options?: Limit &#124; SearchOptions)                            |   PASS   |     |
 |                         search(query: string,limit: number,options: SearchOptions)                          |      PASS      |     |
 |                                       search(options: SearchOptions)                                        |      PASS      |     |
 |                                               contain(id: Id)                                               |      PASS      |     |
 |                                   export(handler: ExportHandler<string>)                                    |      PASS      |     |
 |                                        import(id: Id, item: string)                                         |      PASS      |     |
 |                       addAsync(id: Id, item: string, callback?: AsyncCallback<this>)                        |      PASS      |     |
 |                      appendAsync(id: Id, item: string, callback?: AsyncCallback<this>)                      |      PASS      |     |
 |                      updateAsync(id: Id, item: string, callback?: AsyncCallback<this>)                      |      PASS      |     |
 |                           removeAsync(target: Id, callback?: AsyncCallback<this>)                           |      PASS      |     |
 | searchAsync(query: string,options?: Limit &#124; SearchOptions,callback?: AsyncCallback<IndexSearchResult>) |      PASS      |     |
 |                searchAsync(query: string,limit: number,options?: Limit &#124; SearchOptions)                |   PASS   |     |
 |                                     searchAsync(options: SearchOptions)                                     |      PASS      |     |

## Documnet多字段索引
|                                                                                                      接口名                                                                                                       |            是否通过	            |备注|
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------:|:---:|
|                                                                                                add(document: T)                                                                                                |            PASS             |     |
|                                                                                            add(id: Id, document: T)                                                                                            |            PASS             |     |
|                                                                                              append(document: T)                                                                                               |            PASS             |     |
|                                                                                          append(id: Id, document: T)                                                                                           |            PASS             |     |
|                                                                                              update(document: T)                                                                                               |            PASS             |     |
|                                                                                          update(id: Id, document: T)                                                                                           |            PASS             |     |
|                                                                                          remove(target: Id &#124; T)                                                                                           |            PASS             |     |
|                                                                                     search(query: string, limit?: number)                                                                                      |            PASS             |     |
|                                                            search(query: string, options: string[] &#124; Partial<DocumentSearchOptions<boolean>>)                                                             |            PASS             |     |
|                                             search<Enrich extends boolean = false>(query: string,limit?: number,options?: Partial<DocumentSearchOptions<Enrich>>)                                              |            PASS             |     |
|                                                                            search(options: Partial<DocumentSearchOptions<boolean>>)                                                                            |            PASS             |     |
|                                                                                       export(handler: ExportHandler<T>)                                                                                        |            PASS             |     |
|                                                                                          import(id: Id, document: T)                                                                                           |            PASS             |     |
|                                                                            addAsync(id: Id, document: T, callback?: AsyncCallback)                                                                             |            PASS             |     |
|                                                                           appendAsync(id: Id, document: T, callback?: AsyncCallback)                                                                           |            PASS             |     |
|                                                                           updateAsync(id: Id, document: T, callback?: AsyncCallback)                                                                           |            PASS             |     |
|                                           searchAsync<Enrich extends boolean = false>(query: string,options: string[] &#124; Partial<DocumentSearchOptions<Enrich>>)                                           |            PASS             |     |
|                                                                 searchAsync(query: string,limit?: number,) &#124; T, callback?: AsyncCallback)                                                                 |            PASS             |     |
|                                   searchAsync(query: string,limit: number,callback: AsyncCallback<SimpleDocumentSearchResultSetUnit[]>) &#124; T, callback?: AsyncCallback)                                    |            PASS             |     |
| searchAsync<Enrich extends boolean = false>(query: string,options: Partial<DocumentSearchOptions<Enrich>>,callback: AsyncCallback<DocumentSearchResult<T, Store, Enrich>>) &#124; T, callback?: AsyncCallback) |      PASS      |     |