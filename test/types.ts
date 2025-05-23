import {
    Document,
    Index,
    Worker,
    Resolver,
    Charset,
    IndexedDB
} from "flexsearch";
import {
    DefaultDocumentSearchResults,
    StorageInterface,
    DefaultSearchResults,
    EnrichedDocumentSearchResults,
    MergedDocumentSearchResults,
    EnrichedResults,
    DocumentData
} from "flexsearch";

test_index();
test_document();
test_persistent();
test_worker();

async function test_index() {

    const index = new Index();
    const idx1: DefaultSearchResults = index.search({ cache: true });
    const idx2: Promise<DefaultSearchResults> = index.searchAsync({ cache: true });
    const idx3: Resolver = index.search({ resolve: false });

    const index2 = new Index({ resolve: false });
    const idx4: Resolver = index2.search({});
    const idx5: Resolver = idx3.and({}, {}).limit(100).or({}, {}).boost(2).xor({}, { resolve: false }).not({}, {}).offset(10);
    const idx6: DefaultSearchResults = idx5.resolve({ limit: 10, offset: 2 });
    const idx7: DefaultSearchResults = idx5.and({}, { resolve: true });
    const idx8: DefaultSearchResults = index.searchCache({});
    const idx9: Promise<DefaultSearchResults> = index.searchCacheAsync({});

    (function(){
        const api1: Index = index.clear();
        const api2: boolean = index.contain(1);
        const api3: Index = index.add(1, "");
        const api4: Index = index.remove(1);
        const api5: Index = index.update(1, "");
    }());

    const index3: Index<false, IndexedDB> = new Index({ db: new IndexedDB("my-store") });
    const db1: Promise<IndexedDB> = index3.db;
    const db2: IndexedDB = await index3.db;
    const idx12: Promise<DefaultSearchResults> = index3.search({ cache: true });
    const idx13: Promise<DefaultSearchResults> = index3.searchAsync({ cache: true }, function(res: DefaultSearchResults){});
    const idx14: Promise<void> = index3.commit();
    const idx15: Promise<void> = index3.mount(db2);
    const idx16: Promise<DefaultSearchResults> = index3.searchCache({});
    const idx17: Promise<DefaultSearchResults> = index3.searchCacheAsync({});
    const idx18: Promise<DefaultSearchResults> = index3.search({ resolve: true, cache: true });
    const idx19: Promise<DefaultSearchResults> = index3.searchAsync({ cache: true });
    const idx20: Resolver = index2.searchCache({});
    const idx21: Resolver = index2.searchCacheAsync({});
    const idx22: Resolver = idx5.and({ async: true });
    const idx23: Promise<DefaultSearchResults> = idx5.and({ queue: true }).resolve();
    const idx24: Promise<DefaultSearchResults> = idx5.xor({ async: true, resolve: true });
    const idx25: Promise<DefaultSearchResults> = idx5.and({}).and({ queue: true }).and({ resolve: true });
    const idx26: Resolver<undefined, false, IndexedDB> = index3.search({ resolve: false });
    const idx27: Promise<DefaultSearchResults> = index3.search({ resolve: false }).and({}).resolve();
    const idx28: Promise<DefaultSearchResults> = index3.search({ resolve: false }).and({ resolve: true });

    (function(){
        const api1: Promise<void> = index3.clear();
        const api2: Promise<boolean> = index3.contain(1);
        const api3: Index<false, IndexedDB> = index3.add(1, "");
        const api4: Index<false, IndexedDB> = index3.remove(1);
        const api5: Index<false, IndexedDB> = index3.update(1, "");
    }());

    const index4 = await new Worker();
    const idx31: Promise<DefaultSearchResults> = index4.search({ cache: true });
    const idx32: Promise<DefaultSearchResults> = index4.searchAsync({ cache: true }, function(res: DefaultSearchResults){});
    const idx33: Promise<DefaultSearchResults> = index4.searchCache({});
    const idx34: Promise<DefaultSearchResults> = index4.searchCacheAsync({});
    const idx35: Promise<DefaultSearchResults> = index4.search({ resolve: true, cache: true });
    const idx36: Promise<DefaultSearchResults> = index4.searchAsync({ cache: true });
    const idx37: Resolver<undefined, true> = index4.search({ resolve: false });
    const idx38: Promise<DefaultSearchResults> = index4.search({ resolve: false }).and({}).resolve();
    const idx39: Promise<DefaultSearchResults> = index4.search({ resolve: false }).and({ resolve: true });
    const api5: Promise<void> = index4.clear();
    const api6: boolean = index4.contain(1);

    const res1: Resolver = new Resolver({ index });
    const res2: Resolver = res1.and({}, { index }).limit(100);
    const res3: DefaultSearchResults = res2.resolve();
    const res4: Resolver<undefined, false, IndexedDB> = new Resolver({ index: index3 });
    const res5: Resolver<undefined, false, IndexedDB> = res4.and({});
    const res6: Resolver<undefined, false, IndexedDB> = res4.and({ index: index3 });
    const res7: Promise<DefaultSearchResults> = (await res6).limit(100).resolve();
    const res8: Resolver<undefined, false, IndexedDB> = index3.search({ resolve: false });
    const res9: Resolver<undefined, false, IndexedDB> = res4.and({ async: true, cache: true });
    const res10: Promise<DefaultSearchResults> = res4.or({ async: true, cache: true }).resolve();
    const res11: Promise<DefaultSearchResults> = res4.not({ queue: true, cache: true, resolve: true });

    // @ts-expect-error
    const idx_err1 = index.search({ highlight: true });
    // @ts-expect-error
    const idx_err2 = index.search({ pluck: true });
    // @ts-expect-error
    const idx_err3 = index.search({ enrich: true });
    // @ts-expect-error
    const idx_err4 = index.search({ merge: true });
    // @ts-expect-error
    const index5 = new Index({ document: {} });
    // @ts-expect-error
    const index6 = new Index({ worker: true });

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

    // @ts-expect-error
    const idx_err14: Index = index.add(1);
    // @ts-expect-error
    const idx_err15: Index = index.add("");
    // @ts-expect-error
    const idx_err15: Index = index.add({});
    // @ts-expect-error
    const idx_err16: Index = index.remove();
    // @ts-expect-error
    const idx_err17: Index = index.remove({});
}

async function test_document() {

    type doctype = {
        id: number,
        title: string,
        description: string,
        tags: string[]
    };

    const document = new Document<doctype>({
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

    type doctype2 = {
        id: number,
        meta: {
            title: string,
            description: string,
            tags: string[]
        }
    };

    const document2 = new Document<doctype2>({
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
    const doc4: EnrichedDocumentSearchResults = document.search({ highlight: { template: "" } });
    const doc5: Promise<DefaultDocumentSearchResults> = document.searchAsync({});
    const doc6: DefaultSearchResults = document.search({ resolve: false }).resolve();
    const doc7: DefaultDocumentSearchResults = document.search({ field: "title" });
    const doc8: DefaultSearchResults = document2.search({ pluck: "meta:title" });
    const doc9: DefaultDocumentSearchResults = document.searchCache({});
    const doc10: Promise<DefaultDocumentSearchResults> = document.searchAsync({ cache: true });
    const doc11: Promise<DefaultDocumentSearchResults> = document.searchCacheAsync({});
    const doc13: DefaultDocumentSearchResults = document.search({ resolve: true });

    const doc14: Resolver<doctype> = document.search({ resolve: false });
    const doc15: DefaultSearchResults = doc14.resolve({});
    const doc16: DefaultSearchResults = doc14.and({ resolve: true });
    const doc17: EnrichedResults = doc14.resolve({ enrich: true });
    const doc18: EnrichedResults = doc14.and({ resolve: true, enrich: true });
    const doc19: Resolver<doctype> = doc14.and({ index: document, field: "title" });
    const doc20: Resolver<doctype2> = doc19.or({ index: document2, pluck: "meta:title" });
    const doc21: DefaultSearchResults = doc20.resolve();
    const doc22: EnrichedResults = doc20.resolve({ enrich: true });
    // highlight within the last resolver stage is work in progress:
    const doc23: EnrichedResults = doc20.and({ resolve: true, highlight: { template: "", boundary: {} } });

    const doc24: Resolver<doctype2> = new Resolver({ index: document2 });
    const doc25: EnrichedResults = doc24.and({}, { index: document, resolve: true, enrich: true });
    const doc26: EnrichedResults = doc24.and({}, { index: document2 }).resolve({ enrich: true });
    // highlight within the last resolver stage is work in progress:
    const doc27: EnrichedResults = doc24.and({}, { index: document2, resolve: true, highlight: "" });
    const doc28: DefaultSearchResults = document2.search({ pluck: { field: "meta:title", limit: 10 } });
    const doc30: EnrichedResults = document2.search({ highlight: true, enrich: true, pluck: { field: "meta:title"} });
    const doc31: MergedDocumentSearchResults = document2.search({ highlight: true, merge: true });
    const doc32: string = document.search({ highlight: true, merge: true })[0].highlight.title;
    const doc33: string = document2.search({ highlight: true, merge: true })[0].highlight["meta:title"];

    const doc34: Resolver<doctype> = document.searchCacheAsync({ resolve: false });
    const doc35: Resolver<doctype2> = doc24.and({ async: true, cache: true });
    const doc36: Promise<DefaultSearchResults> = doc24.and({ queue: true, cache: true }).resolve();
    const doc37: Promise<EnrichedResults> = doc24.and({ queue: true, cache: true }).resolve({ enrich: true });
    const doc38: Promise<EnrichedResults> = doc24.and({ queue: true }, { enrich: true, highlight: true, resolve: true });

    (function(){
        const api1: Document<doctype> = document.clear();
        const api2: boolean = document.contain(1);
        const api3: Document<doctype> = document.add(1, { id: 1, tags: [""], title: "", description: "" });
        const api4: Document<doctype> = document.add({ id: 1, tags: [""], title: "", description: "" });
        const api5: Document<doctype> = document.remove(1);
        const api6: Document<doctype> = document.remove({ id: 1, tags: [""], title: "", description: "" });
        const api7: Document<doctype> = document.update(1, { id: 1, tags: [""], title: "", description: "" });
        const api8: Document<doctype> = document.update({ id: 1, tags: [""], title: "", description: "" });
    }());

    // highlight on .resolve() is never supported:
    // @ts-expect-error
    const err0: EnrichedResults = doc24.resolve({ highlight: "" });

    // @ts-expect-error
    const err1: DocumentData = doc1[0].result[0].doc;
    const err2: DocumentData = doc2[0].result[0].doc;
    const err3: DocumentData = doc3[0].doc;

    // @ts-expect-error
    const err4: DefaultSearchResults = document2.search({ pluck: "title" });
    // @ts-expect-error
    const err5: DefaultSearchResults = document.search("test", {});

    // @ts-expect-error
    const err6: Resolver = document.search({});
    // @ts-expect-error
    const err7: Resolver = document.search({ resolve: true });

    // @ts-expect-error
    const err8: DefaultDocumentSearchResults = document.searchAsync({});
    // @ts-expect-error
    const err9: DefaultDocumentSearchResults = await document.searchAsync({ pluck: "title" });
    // @ts-expect-error
    const err10: DefaultDocumentSearchResults = await document.searchAsync({ enrich: true });
    // @ts-expect-error
    const err11: EnrichedDocumentSearchResults = document.search({ highlight: {} });

    // @ts-expect-error
    const err12: string = document2.search({ highlight: true, merge: true })[0].highlight;
    // @ts-expect-error
    const err13: string = document.search({ highlight: true, merge: true })[0].highlight.title2;
}

async function test_persistent() {

    type doctype = {
        id: number,
        title: string,
        description: string,
        tags: string[]
    };

    const document = new Document<doctype, false, IndexedDB>({
        db: new IndexedDB("my-store"),
        encoder: Charset.LatinBalance,
        resolution: 9,
        context: false,
        document: {
            id: "id",
            store: [ "title", "description" ],
            index: [ "title", "description" ],
            tag: [ "tags" ]
        },
    });

    await document.mount(new IndexedDB("my-store"));

    type doctype2 = {
        id: number,
        meta: {
            title: string,
            description: string,
            tags: string[]
        }
    };

    const document2 = new Document<doctype2, false, IndexedDB>({
        db: new IndexedDB("my-store"),
        encoder: Charset.Normalize,
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

    await document2.mount(new IndexedDB("my-store"));

    const doc0: Promise<DefaultDocumentSearchResults> = document.search({ cache: true });
    const doc1: DefaultDocumentSearchResults = await doc0;
    const doc2: Promise<EnrichedDocumentSearchResults> = document.search({ enrich: true });
    const doc3: Promise<MergedDocumentSearchResults> = document.search({ merge: true });
    const doc4: Promise<EnrichedDocumentSearchResults> = document.search({ highlight: { template: "" } });
    const doc5: Promise<DefaultDocumentSearchResults> = document.searchAsync({});
    const doc6: Promise<DefaultSearchResults> = (await document.search({ resolve: false })).resolve();
    const doc7: Promise<DefaultDocumentSearchResults> = document.search({ field: "title" });
    const doc8: Promise<DefaultSearchResults> = document2.search({ pluck: "meta:title" });
    const doc9: Promise<DefaultDocumentSearchResults> = document.searchCache({});
    const doc10: Promise<DefaultDocumentSearchResults> = document.searchAsync({ cache: true });
    const doc11: Promise<DefaultDocumentSearchResults> = document.searchCacheAsync({});
    const doc13: Promise<DefaultDocumentSearchResults> = document.search({ resolve: true });

    const doc14: Resolver<doctype, false, IndexedDB> = document.search({ resolve: false });
    const doc15: Promise<DefaultSearchResults> = doc14.resolve({});
    const doc16: Promise<DefaultSearchResults> = doc14.and({ resolve: true });
    const doc17: Promise<EnrichedResults> = doc14.resolve({ enrich: true });
    const doc18: Promise<EnrichedResults> = doc14.and({ resolve: true, enrich: true });
    const doc19: Resolver<doctype, false, IndexedDB> = doc14.and({ index: document, field: "title" });
    const doc20: Resolver<doctype2, false, IndexedDB> = doc19.or({ index: document2, pluck: "meta:title" });
    const doc21: Promise<DefaultSearchResults> = doc20.resolve();
    const doc22: Promise<EnrichedResults> = doc20.resolve({ enrich: true });
    // highlight within the last resolver stage is work in progress:
    const doc23: Promise<EnrichedResults> = doc20.and({ resolve: true, highlight: { template: "", boundary: {} } });

    const doc24: Resolver<doctype2, false, IndexedDB> = new Resolver({ index: document2 });
    const doc25: Promise<EnrichedResults> = doc24.and({}, { index: document, resolve: true, enrich: true });
    const doc26: Promise<EnrichedResults> = doc24.and({}, { index: document2 }).resolve({ enrich: true });
    // highlight within the last resolver stage is work in progress:
    const doc27: Promise<EnrichedResults> = doc24.and({}, { index: document2, resolve: true, highlight: "" });
    const doc28: Promise<DefaultSearchResults> = document2.search({ pluck: { field: "meta:title", limit: 10 } });
    const doc30: Promise<EnrichedResults> = document2.search({ highlight: true, enrich: true, pluck: { field: "meta:title"} });
    const doc31: Promise<MergedDocumentSearchResults> = document2.search({ highlight: true, merge: true });
    const doc32: string = (await document.search({ highlight: true, merge: true }))[0].highlight.title;
    const doc33: string = (await document2.search({ highlight: true, merge: true }))[0].highlight["meta:title"];

    const doc34: Resolver<doctype, false, IndexedDB> = document.searchCacheAsync({ resolve: false });
    const doc35: Resolver<doctype2, false, IndexedDB> = doc24.and({ async: true, cache: true });
    const doc36: Promise<DefaultSearchResults> = doc24.and({ queue: true, cache: true }).resolve();
    const doc37: Promise<EnrichedResults> = doc24.and({ queue: true, cache: true }).resolve({ enrich: true });
    const doc38: Promise<EnrichedResults> = doc24.and({ queue: true }, { enrich: true, highlight: true, resolve: true });

    const doc39: Resolver<doctype2, false, IndexedDB> = doc24.and({ cache: true });
    const doc40: Promise<DefaultSearchResults> = doc24.and({ cache: true }).resolve();
    const doc41: Promise<EnrichedResults> = doc24.and({ cache: true }).resolve({ enrich: true });
    const doc42: Promise<EnrichedResults> = doc24.and({}, { enrich: true, highlight: true, resolve: true });

    (function(){
        const api1: Promise<void> = document.clear();
        const api2: Promise<boolean> = document.contain(1);
        const api3: Document<doctype, false, IndexedDB> = document.add(1, { id: 1, tags: [""], title: "", description: "" });
        const api4: Document<doctype, false, IndexedDB> = document.add({ id: 1, tags: [""], title: "", description: "" });
        const api5: Document<doctype, false, IndexedDB> = document.remove(1);
        const api6: Document<doctype, false, IndexedDB> = document.remove({ id: 1, tags: [""], title: "", description: "" });
        const api7: Document<doctype, false, IndexedDB> = document.update(1, { id: 1, tags: [""], title: "", description: "" });
        const api8: Document<doctype, false, IndexedDB> = document.update({ id: 1, tags: [""], title: "", description: "" });
        const api9: Promise<void> = document.commit();
    }());

    // highlight on .resolve() is never supported:
    // @ts-expect-error
    const err0: EnrichedResults = doc24.resolve({ highlight: "" });

    // @ts-expect-error
    const err1: DocumentData = doc1[0].result[0].doc;
    const err2: DocumentData = doc2[0].result[0].doc;
    const err3: DocumentData = doc3[0].doc;

    // @ts-expect-error
    const err4: DefaultSearchResults = document2.search({ pluck: "title" });
    // @ts-expect-error
    const err5: DefaultSearchResults = document.search("test", {});

    // @ts-expect-error
    const err6: Resolver = document.search({});
    // @ts-expect-error
    const err7: Resolver = document.search({ resolve: true });

    // @ts-expect-error
    const err8: DefaultDocumentSearchResults = document.searchAsync({});
    // @ts-expect-error
    const err9: DefaultDocumentSearchResults = await document.searchAsync({ pluck: "title" });
    // @ts-expect-error
    const err10: DefaultDocumentSearchResults = await document.searchAsync({ enrich: true });
    // @ts-expect-error
    const err11: EnrichedDocumentSearchResults = document.search({ highlight: {} });

    // @ts-expect-error
    const err12: string = (await document2.search({ highlight: true, merge: true }))[0].highlight;
    // @ts-expect-error
    const err13: string = (await document.search({ highlight: true, merge: true }))[0].highlight.title2;

    // @ts-expect-error
    const err14: EnrichedResults = doc24.resolve({ enrich: true });
}

async function test_worker() {

    type doctype = {
        id: number,
        title: string,
        description: string,
        tags: string[]
    };

    const document = new Document<doctype, true>({
        worker: true,
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

    type doctype2 = {
        id: number,
        meta: {
            title: string,
            description: string,
            tags: string[]
        }
    };

    const document2 = new Document<doctype2, true>({
        worker: true,
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

    const doc0: Promise<DefaultDocumentSearchResults> = document.search({ cache: true });
    const doc1: DefaultDocumentSearchResults = await doc0;
    const doc2: Promise<EnrichedDocumentSearchResults> = document.search({ enrich: true });
    const doc3: Promise<MergedDocumentSearchResults> = document.search({ merge: true });
    const doc4: Promise<EnrichedDocumentSearchResults> = document.search({ highlight: { template: "" } });
    const doc5: Promise<DefaultDocumentSearchResults> = document.searchAsync({});
    const doc6: Promise<DefaultSearchResults> = (await document.search({ resolve: false })).resolve();
    const doc7: Promise<DefaultDocumentSearchResults> = document.search({ field: "title" });
    const doc8: Promise<DefaultSearchResults> = document2.search({ pluck: "meta:title" });
    const doc9: Promise<DefaultDocumentSearchResults> = document.searchCache({});
    const doc10: Promise<DefaultDocumentSearchResults> = document.searchAsync({ cache: true });
    const doc11: Promise<DefaultDocumentSearchResults> = document.searchCacheAsync({});
    const doc13: Promise<DefaultDocumentSearchResults> = document.search({ resolve: true });

    const doc14: Resolver<doctype, true> = document.search({ resolve: false });
    const doc15: Promise<DefaultSearchResults> = doc14.resolve({});
    const doc16: Promise<DefaultSearchResults> = doc14.and({ resolve: true });
    const doc17: Promise<EnrichedResults> = doc14.resolve({ enrich: true });
    const doc18: Promise<EnrichedResults> = doc14.and({ resolve: true, enrich: true });
    const doc19: Resolver<doctype, true> = doc14.and({ index: document, field: "title" });
    const doc20: Resolver<doctype2, true> = doc19.or({ index: document2, pluck: "meta:title" });
    const doc21: Promise<DefaultSearchResults> = doc20.resolve();
    const doc22: Promise<EnrichedResults> = doc20.resolve({ enrich: true });
    // highlight within the last resolver stage is work in progress:
    const doc23: Promise<EnrichedResults> = doc20.and({ resolve: true, highlight: { template: "", boundary: {} } });

    const doc24: Resolver<doctype2, true> = new Resolver({ index: document2 });
    const doc25: Promise<EnrichedResults> = doc24.and({}, { index: document, resolve: true, enrich: true });
    const doc26: Promise<EnrichedResults> = doc24.and({}, { index: document2 }).resolve({ enrich: true });
    // highlight within the last resolver stage is work in progress:
    const doc27: Promise<EnrichedResults> = doc24.and({}, { index: document2, resolve: true, highlight: "" });
    const doc28: Promise<DefaultSearchResults> = document2.search({ pluck: { field: "meta:title", limit: 10 } });
    const doc30: Promise<EnrichedResults> = document2.search({ highlight: true, enrich: true, pluck: { field: "meta:title"} });
    const doc31: Promise<MergedDocumentSearchResults> = document2.search({ highlight: true, merge: true });
    const doc32: string = (await document.search({ highlight: true, merge: true }))[0].highlight.title;
    const doc33: string = (await document2.search({ highlight: true, merge: true }))[0].highlight["meta:title"];

    const doc34: Resolver<doctype, true> = document.searchCacheAsync({ resolve: false });
    const doc35: Resolver<doctype2, true> = doc24.and({ async: true, cache: true });
    const doc36: Promise<DefaultSearchResults> = doc24.and({ queue: true, cache: true }).resolve();
    const doc37: Promise<EnrichedResults> = doc24.and({ queue: true, cache: true }).resolve({ enrich: true });
    const doc38: Promise<EnrichedResults> = doc24.and({ queue: true }, { enrich: true, highlight: true, resolve: true });

    const doc39: Resolver<doctype2, true> = doc24.and({ cache: true });
    const doc40: Promise<DefaultSearchResults> = doc24.and({ cache: true }).resolve();
    const doc41: Promise<EnrichedResults> = doc24.and({ cache: true }).resolve({ enrich: true });
    const doc42: Promise<EnrichedResults> = doc24.and({}, { enrich: true, highlight: true, resolve: true });

    (function(){
        const api1: Promise<void> = document.clear();
        const api2: boolean = document.contain(1);
        const api3: Promise<Document<doctype, true>> = document.add(1, { id: 1, tags: [""], title: "", description: "" });
        const api4: Promise<Document<doctype, true>> = document.add({ id: 1, tags: [""], title: "", description: "" });
        const api5: Promise<Document<doctype, true>> = document.remove(1);
        const api6: Promise<Document<doctype, true>> = document.remove({ id: 1, tags: [""], title: "", description: "" });
        const api7: Promise<Document<doctype, true>> = document.update(1, { id: 1, tags: [""], title: "", description: "" });
        const api8: Promise<Document<doctype, true>> = document.update({ id: 1, tags: [""], title: "", description: "" });
    }());

    // highlight on .resolve() is never supported:
    // @ts-expect-error
    const err0: EnrichedResults = doc24.resolve({ highlight: "" });

    // @ts-expect-error
    const err1: DocumentData = doc1[0].result[0].doc;
    const err2: DocumentData = doc2[0].result[0].doc;
    const err3: DocumentData = doc3[0].doc;

    // @ts-expect-error
    const err4: DefaultSearchResults = document2.search({ pluck: "title" });
    // @ts-expect-error
    const err5: DefaultSearchResults = document.search("test", {});

    // @ts-expect-error
    const err6: Resolver = document.search({});
    // @ts-expect-error
    const err7: Resolver = document.search({ resolve: true });

    // @ts-expect-error
    const err8: DefaultDocumentSearchResults = document.searchAsync({});
    // @ts-expect-error
    const err9: DefaultDocumentSearchResults = await document.searchAsync({ pluck: "title" });
    // @ts-expect-error
    const err10: DefaultDocumentSearchResults = await document.searchAsync({ enrich: true });
    // @ts-expect-error
    const err11: EnrichedDocumentSearchResults = document.search({ highlight: {} });

    // @ts-expect-error
    const err12: string = (await document2.search({ highlight: true, merge: true }))[0].highlight;
    // @ts-expect-error
    const err13: string = (await document.search({ highlight: true, merge: true }))[0].highlight.title2;

    // @ts-expect-error
    const err14: EnrichedResults = doc24.resolve({ enrich: true });
}
