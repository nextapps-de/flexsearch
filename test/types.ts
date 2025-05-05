import { DefaultDocumentSearchResults, Document, Resolver } from "flexsearch";
import "../index";

const document = new Document<{
    title: string
    description: string
    tags: {
        name: string
        id: number
    }[]
}>({
    document: {
        index: ["tags"],
    },
});

async function test() {
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
    // ...
}

