import {
    DefaultDocumentSearchResults,
    Document,
    Index,
    Worker,
    Resolver,
    StorageInterface,
} from "flexsearch";
import "../index";

async function test() {
    const document = new Document<{
        title: string
        description: string
        tags: {
            name: string
            id: number
        }[]
    }>({
        document: {
            index: [ "tags" ],
        },
    });
    // The correct type
    const doc1 = await document.searchAsync({});
    const doc2: Resolver = await document.searchAsync({
        resolve: true,
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
    // @ts-expect-error
    const docw1: Resolver = await document.searchAsync({});
    // @ts-expect-error
    const docw2: DefaultDocumentSearchResults = await document.searchAsync({
        enrich: true,
    });
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

