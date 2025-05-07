import {
    DefaultDocumentSearchResults,
    Document,
    Index,
    Worker,
    Resolver,
    StorageInterface,
    DefaultSearchResults,
} from "flexsearch";

async function test() {

    const document = new Document<{
        id: number,
        title: string,
        description: string,
        tags: string[]
    }>({
        document: {
            id: "id",
            index: [ "title", "description" ],
            tag: [ "tags" ],
            store: [ "title", "description" ]
        },
    });

    // The correct type
    const doc1 = await document.searchAsync({});
    const doc2: Resolver = await document.searchAsync({
        resolve: false,
    });
    const doc3 = await document.searchAsync({
        enrich: true,
    });
    const doc4 = await document.searchAsync({
        enrich: true,
        merge: true,
    });
    doc4[0].doc.title;

    // The wrong type

    const t_1_1: DefaultSearchResults = document.search("test", { pluck: "title" });
    // @ts-expect-error
    const t_1_2: DefaultSearchResults = document.search("test", {});

    const t_2_1: DefaultDocumentSearchResults = document.search("test", {});
    // @ts-expect-error
    const t_2_2: DefaultSearchResults = document.search("test", {});

    const t_3_1: DefaultDocumentSearchResults = document.search({});
    const t_3_2: DefaultDocumentSearchResults = document.search({ resolve: true });

    const t_4_1: Resolver = document.search({ resolve: false });
    const t_4_2: Resolver = new Resolver();
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
    // Promise?

    const documentNoWorker = new Document({});
    const doc5 = documentNoWorker.search({}); // No Promise

    const documentWorker = new Document({
        worker: true,
    });
    const doc6 = await documentWorker.search({}) // Promise

    const documentWorker2 = new Document({
        worker: '...',
    });
    const doc7 = await documentWorker2.search({}) // Promise

    const index = new Index({})
    const idx = index.search({}) // No Promise

    const worker =  new Worker()
    const wkr = await worker.search({}) // Promise

    const documentDb = new Document({
        db: {} as unknown as StorageInterface
    })

    const doc8 = documentDb.search({}) // Promise
}

