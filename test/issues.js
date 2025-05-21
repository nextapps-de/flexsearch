global.self = global;
const env = process.argv[3] && process.argv[3] === "--exit" ? process.argv[4] : process.argv[3];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver, IndexedDB } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;
const EnglishPreset = await import("../src/lang/en.js");

describe("Github Issues", function(){

    if(!build_light && !build_compact) it("#48", async function(){

        const fs = await new Document({
            encoder: Charset.LatinExtra,
            resolution: 9,
            context: {
                depth: 4
            },
            worker: true,
            cache: true,
            doc: {
                id: "id",
                field: [ "intent", "text" ]
            }
        });

        const doc = [{
            id: 0,
            intent: "intent",
            text: "text"
        },{
            id: 1,
            intent: "intent",
            text: "howdy - how are you doing"
        }];

        for(let i = 0; i < doc.length; i++){
            await fs.add(doc[i]);
        }

        expect(await fs.search("howdy")).to.eql([{
            field: "text",
            result: [1]
        }]);
        expect(await fs.search("howdy -")).to.eql([{
            field: "text",
            result: [1]
        }]);

        // terminate workers
        fs.index.get("intent").worker.terminate();
        fs.index.get("text").worker.terminate();
    });

    if(!build_light) it("#54", function(){

        const index = new Document({
            doc: {
                id: "id",
                field: ["title", "content"]
            }
        });

        const docs = [{
            id: 1,
            title: "Roaming Inquiry",
            content: "Some content"
        }, {
            id: 2,
            title: "New Service",
            content: "This is not roaming-inquiry"
        }];

        for(let i = 0; i < docs.length; i++){
            index.add(docs[i]);
        }

        expect(index.search("roaming")).to.eql([{
            field: "title",
            result: [1]
        },{
            field: "content",
            result: [2]
        }]);
    });

    it("#486", function(){

        const encoder = new Encoder(Charset.LatinDefault, EnglishPreset);
        const index = new Index({
            tokenize: "full",
            encoder
        });

        index.add(1, "user is not working, but users is working");

        const userResult = index.search("user");
        const usersResult = index.search("users");

        expect(userResult).to.eql([1]);
        expect(usersResult).to.eql([1]);
    });

    if(!build_light && !build_compact) it("#499", function(){

        const DocumentIndexConfig = {
            document: {
                id: "id",
                store: true,
                // fuzzy search fields
                index: [
                    {
                        field: "className",
                        tokenize: "forward",
                    },
                ],
                // These get tagged as their specific key
                tag: [
                    {
                        field: "language",
                    },
                    {
                        field: "feedbackScore",
                        custom: (data) =>
                            Number(data.avgInstructorScore) >= 4 ? ">=4" : false,
                    },
                ],
            },
        };

        const index = new Document(DocumentIndexConfig);

        let all_docs = [{
            "id": "1234",
            "className": "My Class Name",
            "language": "German",
            "avgInstructorScore": 4.69,
        }];

        for (const doc of all_docs) {
            index.add(doc);
        }

        const resolveOptions = {
            enrich: true,
            limit: index.store.size,
        };

        //console.log(index.search({ tag: { feedbackScore: ">=4", language: "German" }, resolve: true }))
        //console.log(index.search({ tag: { feedbackScore: ">=4", language: "German" }, resolve: true, enrich: true }))
        //console.log(index.search({ tag: { feedbackScore: ">=4", language: "German" }, resolve: false }).resolve({ enrich: true }))

        let results = index.search({ tag: { feedbackScore: ">=4", language: "German" }, resolve: false })
                           .resolve(resolveOptions);

        expect(results).to.eql([{
            id: '1234',
            doc: {
                id: '1234',
                className: 'My Class Name',
                language: 'German',
                avgInstructorScore: 4.69
            }
        }]);

        results = index.search({ query: "class", field: "className", resolve: false })
                       .and({ tag: { feedbackScore: ">=4", language: "German" } })
                       .resolve(resolveOptions);

        expect(results).to.eql([{
            id: '1234',
            doc: {
                id: '1234',
                className: 'My Class Name',
                language: 'German',
                avgInstructorScore: 4.69
            }
        }]);

        results = index.search({ tag: { feedbackScore: ">=4" }, resolve: false })
                       .and({ tag: { language: "German" } })
                       .resolve(resolveOptions);

        expect(results).to.eql([{
            id: '1234',
            doc: {
                id: '1234',
                className: 'My Class Name',
                language: 'German',
                avgInstructorScore: 4.69
            }
        }]);

        results = index.search({ query: "class", field: "className", resolve: false })
                       .and({ tag: { feedbackScore: ">=4", language: "German" }, resolve: true, enrich: true });

        expect(results).to.eql([{
            id: '1234',
            doc: {
                id: '1234',
                className: 'My Class Name',
                language: 'German',
                avgInstructorScore: 4.69
            }
        }]);
    });

    if(!build_light && !build_compact) it("#500", function(){

        const indexableFields = ['field1', 'field2'];

        const searchIndex = new Document({
            document: {
                store: true,
                id: '_id',
                index: indexableFields.map(f => ({field: f, tokenize: 'full', encoder: Charset.LatinExtra})),
            },
        });

        searchIndex.add({
            _id: '123',
            field1: '1234',
            field2: '123 b',
        });

        const submitSearch = query => {

            // Since there are subfields to account for, build up the query one field at a time
            let res = searchIndex.search({
                query,
                field: "field1",
                resolve: false
            });

            // Combine the queries with "or" and "resolve" them to get the results
            res = res.or({
                query,
                field: "field2"
            });

            res = res.resolve();

            return res;
        };

        // console.log(submitSearch('123'));
        // console.log(submitSearch('1234'));
        // console.log(submitSearch('123 b'));

        expect(submitSearch('123')).to.eql(["123"]);
        expect(submitSearch('1234')).to.eql(["123"]);
        expect(submitSearch('123 b')).to.eql(["123"]);

        const submitSearch2 = query => {

            // Since there are subfields to account for, build up the query one field at a time
            return searchIndex.search({
                query,
                field: "field1",
                resolve: false
            }).or({
                query,
                field: "field2",
                resolve: true
            });
        };

        expect(submitSearch2('123')).to.eql(["123"]);
        expect(submitSearch2('1234')).to.eql(["123"]);
        expect(submitSearch2('123 b')).to.eql(["123"]);

        const submitSearch3 = query => {

            // Since there are subfields to account for, build up the query one field at a time
            let res1 = searchIndex.search({
                query,
                field: "field1",
                resolve: false
            });

            let res2 = searchIndex.search({
                query,
                field: "field2",
                resolve: false
            });

            // Combine the queries with "or" and "resolve" them to get the results
            return res1.or(res2).resolve({ enrich: true });
        };

        expect(submitSearch3('123')).to.eql([{
            "id": "123",
            "doc": {
                "_id": "123",
                "field1": "1234",
                "field2": "123 b"
            }
        }]);

        expect(submitSearch3('1234')).to.eql([{
            "id": "123",
            "doc": {
                "_id": "123",
                "field1": "1234",
                "field2": "123 b"
            }
        }]);

        expect(submitSearch3('123 b')).to.eql([{
            "id": "123",
            "doc": {
                "_id": "123",
                "field1": "1234",
                "field2": "123 b"
            }
        }]);
    });

    if(!build_light) it("#503", function(){

        const DOCS = {
            "./doc-1.txt": `
                 Floor Stream
                
                Banana
                `,
            "./doc-2.txt": `
                 Banana Listen
                
                Floor
                `
        };

        class FlexSearchService {
            constructor(){
                const encoder = new Encoder(Charset.Normalize, {
                    prepare: EnglishPreset.prepare,
                    filter: EnglishPreset.filter,
                });

                this.index = new Document({
                    // enable when frequently update existing contents
                    fastupdate: false,
                    document: {
                        id: 'id',
                        index: ['displayName', 'body', 'descriptionShort'],
                        // add tags to the index
                        tag: ['tags']
                    },
                    // favor forward tokenizer instead of full on large inputs will reduce memory
                    tokenize: 'forward',
                    encoder
                });
            }

            updateIndexWithDocuments(documents) {
                documents.forEach((document) => {
                    const { path } = document;
                    const body = DOCS[path]; //fs.readFileSync(path, 'utf-8');
                    this.index.add({ ...document, body });
                });
            }

            searchDocuments({ query, limit = 100, offset = 0 }) {
                return this.index.search(query, {
                    limit,
                    offset,
                    merge: true,
                });
            }
        }

        const flexSearchService = new FlexSearchService();

        const mockdocs = [
            {
                id: 1,
                path: './doc-1.txt',
                displayName: 'Document 1',
                descriptionShort: 'Document 1 short',
                tags: ['tag-1'],
            },
            {
                id: 2,
                path: './doc-2.txt',
                displayName: 'Document 2',
                descriptionShort: 'Document 2 short',
                tags: ['tag-2', 'tag-3'],
            },
        ];

        flexSearchService.updateIndexWithDocuments(mockdocs);
        expect(
            flexSearchService.searchDocuments({ query: 'Floor' })
        ).to.eql([
            { id: 1, field: [ 'body' ] },
            { id: 2, field: [ 'body' ] }
        ]);

        flexSearchService.updateIndexWithDocuments([mockdocs[1]]);
        expect(
            flexSearchService.searchDocuments({ query: 'Floor' })
        ).to.eql([
            { id: 1, field: [ 'body' ] },
            { id: 2, field: [ 'body' ] }
        ]);

        flexSearchService.updateIndexWithDocuments([mockdocs[0]]);
        expect(
            flexSearchService.searchDocuments({ query: 'Floor' })
        ).to.eql([
            { id: 1, field: [ 'body' ] },
            { id: 2, field: [ 'body' ] }
        ]);

        expect(
            flexSearchService.searchDocuments({ query: 'Banana' })
        ).to.eql([
            { id: 2, field: [ 'body' ] },
            { id: 1, field: [ 'body' ] }
        ]);

        flexSearchService.updateIndexWithDocuments([mockdocs[1]]);
        expect(
            flexSearchService.searchDocuments({ query: 'Floor' })
        ).to.eql([
            { id: 1, field: [ 'body' ] },
            { id: 2, field: [ 'body' ] }
        ]);

        flexSearchService.updateIndexWithDocuments([mockdocs[0]]);
        expect(
            flexSearchService.searchDocuments({ query: 'Floor' })
        ).to.eql([
            { id: 1, field: [ 'body' ] },
            { id: 2, field: [ 'body' ] }
        ]);

        flexSearchService.index.remove(mockdocs[0]);

        expect(
            flexSearchService.searchDocuments({ query: 'Floor' })
        ).to.eql([
            { id: 2, field: [ 'body' ] }
        ]);

        flexSearchService.index.remove(mockdocs[1]);

        expect(
            flexSearchService.searchDocuments({ query: 'Floor' })
        ).to.eql([]);
    });
});
