import {
    Document,
    Index,
    Worker,
    Resolver,
    IndexedDB, EnrichedResults
} from "flexsearch";
import {
    DefaultDocumentSearchResults,
    StorageInterface,
    DefaultSearchResults,
    EnrichedDocumentSearchResults,
    MergedDocumentSearchResults,
    DocumentData
} from "flexsearch";

async function test_index() {

    const index = new Index();
    const index2 = new Index({ resolve: false });
    const index3 = new Index({ db: new IndexedDB("my-store") });

    const idx1: DefaultSearchResults = index.search({ cache: true });
    const idx2: Promise<DefaultSearchResults> = index.searchAsync({ cache: true });
    const idx3: Resolver = index.search({ resolve: false });
    const idx4: Resolver = index2.search({});
    const idx5: Resolver = idx3.and({}, {}).limit(100).or({}, {}).boost(2).xor({}, { resolve: false }).not({}, {}).offset(10);
    const idx6: DefaultSearchResults = idx5.resolve({ limit: 10, offset: 2 });
    const idx7: DefaultSearchResults = idx5.and({}, { resolve: true });
    const idx8: DefaultSearchResults = index.searchCache({});
    const idx9: Promise<DefaultSearchResults> = index.searchCacheAsync({});

    const db1: Promise<IndexedDB> = index3.db;
    const db2: IndexedDB = await index3.db;
    const idx10: Promise<DefaultSearchResults> = index3.search({ cache: true });
    const idx11: Promise<DefaultSearchResults> = index3.searchAsync({ cache: true }, function(res: DefaultSearchResults){});
    const idx12: Promise<void> = index3.commit();
    const idx13: Promise<void> = index3.mount(db2);
    const idx14: Promise<DefaultSearchResults> = index3.searchCache({});
    const idx15: Promise<DefaultSearchResults> = index3.searchCacheAsync({});
    const idx16: Promise<DefaultSearchResults> = index3.search({ resolve: true, cache: true });
    const idx17: Promise<DefaultSearchResults> = index3.searchAsync({ resolve: true, cache: true });
    const idx18: Resolver = index2.searchCache({});
    const idx19: Promise<Resolver> = index2.searchCacheAsync({});

    const res1: Resolver = new Resolver({ index });
    const res2: Resolver = res1.and({}, { index }).limit(100);
    const res3: DefaultSearchResults = res2.resolve();

    const res4: Resolver<undefined, false, IndexedDB> = new Resolver({ index: index3 });
    const res5: Promise<Resolver<undefined, false, IndexedDB>> = res4.and();
    const res6: Promise<Resolver<undefined, false, IndexedDB>> = res4.and({ index: index3 });
    const res7: Promise<DefaultSearchResults> = (await res6).limit(100).resolve();

    // @ts-expect-error
    const idx_err1 = index.search({ highlight: true });
    // @ts-expect-error
    const idx_err2 = index.search({ pluck: true });
    // @ts-expect-error
    const idx_err3 = index.search({ enrich: true });
    // @ts-expect-error
    const idx_err4 = index.search({ merge: true });
    // @ts-expect-error
    const index4 = new Index({ document: {} });
    // @ts-expect-error
    const index5 = new Index({ worker: true });

    // @ts-expect-error
    const idx_err5: DefaultSearchResults = idx5.resolve({}, { boost: 1 });
    // @ts-expect-error
    const idx_err6: DefaultSearchResults = idx5.resolve({}, { enrich: true });
    // @ts-expect-error
    const idx_err7: DefaultSearchResults = idx5.resolve({}, { highlight: true });
    // @ts-expect-error
    const idx_err8: DefaultSearchResults = idx5.and({}, { resolve: true }).limit(100);

    // @ts-expect-error
    const idx_err9: Resolver = index2.search({ cache: true });
    // @ts-expect-error
    const idx_err10: Promise<Resolver> = index2.searchAsync({ cache: true });
    // @ts-expect-error
    const idx_err11: Resolver = index3.search({ resolve: false, cache: true });
    // @ts-expect-error
    const idx_err12: Promise<Resolver> = index3.searchAsync({ resolve: false, cache: true });

    // @ts-expect-deprecation
    const idx_err13: DefaultSearchResults = index.search("query", 100);
}

async function test_document() {

    // ----------------------------------------------------------------

    const document = new Document<{
        id: number,
        title: string,
        description: string,
        tags: string[]
    }>({
        encoder: "LatinBalance",
        resolution: 9,
        context: false,
        document: {
            id: "id",
            store: [ "title", "description" ],
            index: [ "title", "description" ],
            tag: [ "tags" ]
        },
    });

    type doctype = {
        id: number,
        meta: {
            title: string,
            description: string,
            tags: string[]
        }
    };

    const document2 = new Document<doctype>({
        document: {
            id: "id",
            store: [{
                field: "meta:title",
                filter: function(data){
                    return true;
                }
            },{
                field: "meta:description"
            },{
                field: "custom",
                custom: function(data){
                    return false;
                }
            }],
            index: [{
                field: "meta:title",
                filter: function(data){
                    return true;
                }
            },{
                field: "meta:description",
                encoder: "LatinBalance",
                resolution: 9,
                context: false,
            },{
                field: "custom",
                custom: function(data){
                    return data.meta.title + " " + data.meta.description;
                }
            }],
            tag: [{
                field: "meta:tags",
                filter: function(data){
                    return true;
                }
            },{
                field: "custom",
                custom: function(data){
                    return "tag";
                }
            }]
        },
    });

    const doc1: DefaultDocumentSearchResults = document.search({ cache: true });
    const doc2: EnrichedDocumentSearchResults = document.search({ enrich: true });
    const doc3: MergedDocumentSearchResults = document.search({ merge: true });
    const doc4: EnrichedDocumentSearchResults = document.search({ highlight: true });
    const doc5: Promise<DefaultDocumentSearchResults> = document.searchAsync({});
    const doc6: Resolver = document.search({ resolve: false });
    const doc7: DefaultSearchResults = document.search({ pluck: "title" });
    const doc8: DefaultSearchResults = document2.search({ pluck: "meta:title" });
    const doc9: DefaultDocumentSearchResults = document.searchCache({});
    const doc10: Promise<DefaultDocumentSearchResults> = document.searchAsync({ cache: true });
    const doc11: Promise<DefaultDocumentSearchResults> = document.searchCacheAsync({});
    const doc13: DefaultDocumentSearchResults = document.search({ resolve: true });

    const doc14: Resolver = document.search({ resolve: false });
    const doc15: DefaultSearchResults = doc14.resolve({});
    const doc16: DefaultSearchResults = doc14.and({ resolve: true });
    const doc17: EnrichedResults = doc14.resolve({ enrich: true });
    const doc18: EnrichedResults = doc14.and({ resolve: true, enrich: true });
    const doc19: Resolver = doc14.and({ index: document, field: "title" });
    const doc20: Resolver = doc19.or({ index: document2, field: "meta:title" });
    const doc21: DefaultDocumentSearchResults = doc20.resolve();
    const doc22: EnrichedResults = doc20.resolve({ enrich: true });
    // highlight on .resolve() is never supported:
    //const doc23: EnrichedResults = doc20.resolve({ highlight: true });
    // highlight within last resolver stage is work in progress:
    const doc23: EnrichedResults = doc20.and({ resolve: true, highlight: true });

    const doc24: Resolver = new Resolver({ index: document });
    const doc25: EnrichedResults = doc24.and({}, { index: document2, resolve: true, enrich: true });
    const doc26: EnrichedResults = doc24.and({}, { index: document2 }).resolve({ enrich: true });
    // highlight on .resolve() is never supported:
    //const doc27: EnrichedResults = doc24.and({}, { index: document2 }).resolve({ highlight: true });
    // highlight within last resolver stage is work in progress:
    const doc27: EnrichedResults = doc24.and({}, { index: document2, resolve: true, highlight: true });

    // @ts-expect-error
    let tmp1: DocumentData = doc1[0].result[0].doc;
    let tmp2: DocumentData = doc2[0].result[0].doc;
    let tmp3: DocumentData = doc3[0].doc;

    // @ts-expect-error
    const t_2_1: DefaultSearchResults = document2.search({ pluck: "title" });
    // @ts-expect-error
    const t_2_2: DefaultSearchResults = document.search("test", {});

    // @ts-expect-error
    const t_4_3: Resolver = document.search({});
    // @ts-expect-error
    const t_4_4: Resolver = document.search({ resolve: true });

    // @ts-expect-error
    const docw6: DefaultDocumentSearchResults = await document.searchAsync({});
    // @ts-expect-error
    const docw7: DefaultDocumentSearchResults = await document.searchAsync({ pluck: false });
    // @ts-expect-error
    const docw8: DefaultDocumentSearchResults = await document.searchAsync({ enrich: false });

    // @ts-expect-error
    const docw4: Resolver = await document.searchAsync({});
    // @ts-expect-error
    const docw5: Resolver = await document.searchAsync({ resolve: true });
    // @ts-expect-error
    const docw6: DefaultDocumentSearchResults = await document.searchAsync({});
    // @ts-expect-error
    const docw7: DefaultDocumentSearchResults = await document.searchAsync({ pluck: false });
    // @ts-expect-error
    const docw8: DefaultDocumentSearchResults = await document.searchAsync({ enrich: false });

}

async function test_worker() {

    const documentNoWorker = new Document({});
    const doc6 = documentNoWorker.search({}); // No Promise

    const documentWorker = new Document({
        worker: true,
    });
    const doc7 = await documentWorker.search({}) // Promise

    const documentWorker2 = new Document({
        worker: '...',
    });
    const doc8 = await documentWorker2.search({}) // Promise

    const worker =  new Worker()
    const wkr = await worker.search({}) // Promise

    const documentDb = new Document({
        db: {} as unknown as StorageInterface
    })

    const doc9 = documentDb.search({}) // Promise
}

