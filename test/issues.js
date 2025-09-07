global.self = global;
const env = process.argv[process.argv.length - 1] === "--exit" ? "" : process.argv[process.argv.length - 1];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver, IndexedDB } = FlexSearch;
const build_light = env && env.includes("light");
const build_compact = env && env.includes("compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;
const EnglishPreset = (await import("../src/lang/en.js")).default;

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

    if(!build_light) it("#504", function(){

        const searchIndex = new Document({
            tokenize: "forward",
            document: {
                id: "id",
                index: ["name", "shortName"],
                store: true,
            },
        });

        searchIndex.add({
            id: 1,
            name: "a name",
            shortName: "" // Or undefined
        });

        const result = searchIndex.search({
            query: "name"
        });

        expect(result).to.eql([
            { field: 'name', result: [ 1 ] }
        ]);
    });

    if(!build_light) it("#506", async function(){

        const data = [{
            "id": "ab105.49",
            "text": "<test_name>/anytime_<command>",
            "tag": "block",
            "site": "docs"
        },{
            "id": "cfc6c.50",
            "text": "Test the cluster and health-checker setup locally:",
            "tag": "block",
            "site": "docs"
        }];

        const index = new Document({
            document: {
                id: 'id',
                index: 'text',
                store: [
                    'text',  'tag', 'site'
                ],
                tag: ['tag', 'site']
            },
            tokenize: 'reverse',
            encoder: Charset.LatinAdvanced
        });

        data.forEach(item => index.add(item));

        const result = new Resolver({
            index: index,
            query: "test",
            field: 'text',
            tag: {
                site: 'docs'
            },
            limit: 35,
            highlight: "<b>$1</b>"
        }).resolve();

        expect(result[1].highlight).to.eql("<b>Test</b> the cluster and health-checker setup locally:");
    });

    // TODO https://jsfiddle.net/u9x6L0mw/2/

    if(!build_light) it("#514", function(){

        const data = [
            { "id": 1, "title": "Carmencita" },
            { "id": 2, "title": "en-US.json" }
        ];

        const index = new Document({
            document: {
                store: true,
                index: [{
                    field: "title",
                    tokenize: "full",
                    encoder: Charset.Default
                }]
            }
        });

        data.forEach(item => index.add(item));

        const result = index.search({
            query: 'en',
            enrich: true,
            highlight: "<b>$1</b>"
        });

        expect(result[0]).to.eql({
            field: "title",
            result: [
                { id: 1, doc: data[0], highlight: "Carm<b>en</b>cita" },
                { id: 2, doc: data[1], highlight: "<b>en</b>-US.json" }
            ]
        });
    });

    if(!build_light) it("#517", function(){

        const data = [
            { "document_id": 0, "title": "Call Sammy on 9944", "content": "", "contact_id": "" },
            { "document_id": 1, "title": "Call Sammy on 9944343432", "content": "", "contact_id": "" },
            { "document_id": 2, "title": "Call Jimmy on 9941343432", "content": "", "contact_id": "" },
            { "document_id": 3, "title": "Call Jimmy on 9941", "content": "", "contact_id": "" }
        ];

        const encoder = new Encoder(Charset.LatinDefault, EnglishPreset, { numeric: false });
        const index = new Document({
            document: {
                id: "document_id",
                store: true,
                index: [{
                    field: "title",
                    tokenize: "full",
                    encoder
                }]
            }
        });

        data.forEach(item => index.add(item));

        const result = index.search({
            query: "432",
            pluck: "title",
            enrich: true
        });

        expect(result).to.eql([{
            "id": 1,
            "doc": data[1]
        },{
            "id": 2,
            "doc": data[2]
        }]);
    });

    if(!build_light) it("#521", async function(){

        const data = [{
            "id": 1,
            "title": "One",
            "score":  null,
        },{
            "id": 2,
            "title": "Two",
            "score":  null,
        }];

        const index = new Document({
            document: {
                id: "id",
                store: true,
                index: [{
                    field: "title",
                    tokenize: "forward"
                }],
                tag: [{
                    field: "scoredValue",
                    custom: (data) => Number(data.score) > 1 ? ">1" : false
                }]
            }
        });

        data.forEach(item => index.add(item));

        await index.export(function(key, data){
            if(key === "1.tag"){
                expect(data).to.eql('[["scoredValue",[]]]');
            }
        });
    });

    // TODO
    if(!build_light) it.skip("#523", function(){

        const data = [
            { "id": 1, "title": "REQ-1" },
            { "id": 2, "title": "REQ2" },
            { "id": 3, "title": "REQFOOBAR" }
        ];

        const index = new Document({
            document: {
                store: true,
                index: [{
                    field: "title",
                    tokenize: "forward",
                    encoder: { dedupe: true }
                }]
            }
        });

        data.forEach(item => index.add(item));

        const result = index.search({
            query: "req",
            pluck: "title",
            highlight: "<b>$1</b>"
        });

        expect(result[0].highlight).to.eql("<b>REQ</b>-1");
        expect(result[1].highlight).to.eql("<b>REQ</b>2");
        expect(result[2].highlight).to.eql("<b>REQ</b>FOOBAR");
    });

    if(!build_light) it("#524", function(){

        const testData = [
            // First 10 notes on page2 that match "g" (but we want page1)
            { id: '1', content: 'green apple', parentId: 'page2' },
            { id: '2', content: 'great day', parentId: 'page2' },
            { id: '3', content: 'good morning', parentId: 'page2' },
            { id: '4', content: 'big dog', parentId: 'page2' },
            { id: '5', content: 'long night', parentId: 'page2' },
            { id: '6', content: 'huge garden', parentId: 'page2' },
            { id: '7', content: 'large group', parentId: 'page2' },
            { id: '8', content: 'big game', parentId: 'page2' },
            { id: '9', content: 'great goal', parentId: 'page2' },
            { id: '10', content: 'good girl', parentId: 'page2' },

            // The note we want is at position 11 (on page1)
            { id: '11', content: 'glasgow coma scale', parentId: 'page1' },

            // More notes on page2
            { id: '12', content: 'big green', parentId: 'page2' },
            { id: '13', content: 'great god', parentId: 'page2' },
        ];

        const index = new Document({
            tokenize: 'forward',
            encoder: {
                minlength: 1
            },
            document: {
                id: 'id',
                tag: 'parentId',
                index: ['content'],
                store: true
            }
        });

        testData.forEach(item => {
            index.add(item);
        });

        expect(testData.length).to.equal(13);
        expect(testData.filter(d => d.content.includes('g')).length).to.equal(13);
        expect(testData.filter(d => d.content.includes('g') && d.parentId === 'page1').length).to.equal(1);
        expect(testData.filter(d => d.content.includes('g') && d.parentId === 'page2').length).to.equal(12);

        expect(index.search("g")[0]?.result?.length || 0).to.equal(11);
        expect(index.search('g', { tag: { parentId: 'page1' } })[0]?.result?.length || 0).to.equal(1);
        expect(index.search('g', { limit: 5 })[0]?.result?.length || 0).to.equal(5);
        expect(index.search('g', { limit: 5, tag: { parentId: 'page1' } })[0]?.result?.length || 0).to.equal(1);
        expect(index.search('g', { limit: 20, offset: 0, tag: { parentId: 'page1' } })[0]?.result?.length || 0).to.equal(1);
    });
});
