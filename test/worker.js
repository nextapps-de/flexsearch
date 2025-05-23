global.self = global;
const env = process.argv[process.argv.length - 1] === "--exit" ? "" : process.argv[process.argv.length - 1];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker: WorkerIndex, Charset: _Charset, Encoder, Resolver } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;

if(!build_light && !build_compact) describe("Worker", function(){

    let index;

    afterEach(function() {
        index && index.worker.terminate();
    });

    it("Should have the proper basic functionality", async function(){

        index = await new WorkerIndex({
            encoder: "LatinAdvanced",
            tokenize: "forward"
        });

        const data = [
            'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute',
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ];

        for(let i = 0; i < data.length; i++){
            await index.addAsync(i, data[i]);
        }

        expect(index.reg).to.be.undefined;
        expect(index.map).to.be.undefined;

        let result = await index.search("cat cute");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = await index.search("cute cat");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = await index.search("cute");
        expect(result).to.eql([6, 5, 4, 3, 2, 1, 0]);

        result = await index.search("cudi tok-kat");
        expect(result).to.eql([1]);
    });

    it("Should update the index contents properly", async function(){

        index = await new WorkerIndex({ tokenize: "full" });

        await index.add(1, "foo");
        await index.add(2, "bar");
        await index.add(3, "foobar");

        await index.update(1, "bar");
        await index.update(2, "foobar");
        await index.update(3, "foo");

        expect(await index.search("foo")).to.have.members([2, 3]);
        expect(await index.search("bar")).to.have.members([1, 2]);
        expect(await index.search("bar")).to.not.include(3);
        expect(await index.search("foobar")).to.have.members([2]);
        expect(await index.search("oba")).to.have.members([2]);

        await index.update(1, "bar");
        await index.update(2, "foobar");
        await index.update(3, "foo");

        expect(await index.search("foo")).to.have.members([2, 3]);
        expect(await index.search("bar")).to.have.members([1, 2]);
        expect(await index.search("bar")).to.not.include(3);
        expect(await index.search("foobar")).to.have.members([2]);
        expect(await index.search("oba")).to.have.members([2]);
    });

    it("Should have been removed from the index", async function(){

        index = await new WorkerIndex({ tokenize: "full" });
        await index.add(1, "bar");
        await index.add(2, "foobar");
        await index.add(3, "foo");

        await index.remove(2);
        await index.remove(1);
        await index.remove(3);
        await index.remove(4);

        expect(await index.search("foo")).to.have.lengthOf(0);
        expect(await index.search("bar")).to.have.lengthOf(0);
        expect(await index.search("foobar")).to.have.lengthOf(0);
    });

    it("Result Highlighting", async function(){

        // some test data
        const data = [{
            "id": 1,
            "title": "Carmencita"
        },{
            "id": 2,
            "title": "Le clown et ses chiens"
        }];

        // create the document index
        const document = await new Document({
            worker: true,
            document: {
                store: true,
                index: [{
                    field: "title",
                    tokenize: "forward",
                    encoder: Charset.LatinBalance
                }]
            }
        });

        // add test data
        for(let i = 0; i < data.length; i++){
            await document.add(data[i]);
        }

        // perform a query
        let result = await document.searchCache({
            query: "karmen or clown or not found",
            suggest: true,
            highlight: "<b>$1</b>"
        });

        expect(result[0].result).to.eql([{
            id: 1,
            doc: data[0],
            highlight: '<b>Carmen</b>cita'
        },{
            id: 2,
            doc: data[1],
            highlight: 'Le <b>clown</b> et ses chiens'
        }]);

        // perform a query on cache
        result = await document.searchCache({
            query: "karmen or clown or not found",
            suggest: true,
            highlight: "<b>$1</b>"
        });

        expect(result[0].result).to.eql([{
            id: 1,
            doc: data[0],
            highlight: '<b>Carmen</b>cita'
        }, {
            id: 2,
            doc: data[1],
            highlight: 'Le <b>clown</b> et ses chiens'
        }]);

        // perform a query using pluck
        result = await document.search({
            query: "karmen or clown or not found",
            suggest: true,
            field: "title",
            highlight: "<b>$1</b>"
        });

        expect(result[0].result).to.eql([{
            id: 1,
            doc: data[0],
            highlight: '<b>Carmen</b>cita'
        },{
            id: 2,
            doc: data[1],
            highlight: 'Le <b>clown</b> et ses chiens'
        }]);
    });

    it("Should have been resolved a Resolver properly (Document Worker)", async function(){

        const data = [{
            "tconst": "tt0000001",
            "titleType": "short",
            "primaryTitle": "Carmencita",
            "originalTitle": "Carmencita",
            "isAdult": 0,
            "startYear": "1894",
            "endYear": "",
            "runtimeMinutes": "1",
            "genres": [
                "Documentary",
                "Short"
            ]
        },{
            "tconst": "tt0000002",
            "titleType": "short",
            "primaryTitle": "Le clown et ses chiens",
            "originalTitle": "Le clown et ses chiens",
            "isAdult": 0,
            "startYear": "1892",
            "endYear": "",
            "runtimeMinutes": "5",
            "genres": [
                "Animation",
                "Short"
            ]
        }];

        // create the document index
        const document = await new Document({
            worker: true,
            encoder: Charset.LatinBalance,
            document: {
                id: "tconst",
                store: true,
                index: [{
                    field: "primaryTitle",
                    tokenize: "forward"
                },{
                    field: "originalTitle",
                    tokenize: "forward"
                }],
                tag: [{
                    field: "startYear"
                },{
                    field: "genres"
                }]
            }
        });

        // add test data
        for(let i = 0; i < data.length; i++){
            await document.addAsync(data[i]);
        }

        let resolver = new Resolver({
            index: document,
            query: "karmen or clown or nothing",
            field: "primaryTitle",
            suggest: true
        });

        expect(resolver).to.be.instanceof(Resolver);
        expect(resolver.result).to.eql([]);
        expect(resolver.await).to.be.instanceof(Promise);

        let tmp = resolver.await;
        resolver = resolver.resolve();
        expect(resolver).to.be.instanceof(Promise);
        expect(await resolver).to.have.members(["tt0000001", "tt0000002"]);
        expect((await tmp)[0]).to.have.members(["tt0000001"]);

        // -----------------------------------

        resolver = new Resolver({
            index: document,
            async: true,
            query: "karmen or clown or nothing",
            field: "primaryTitle",
            suggest: true
        });

        expect(resolver).to.be.instanceof(Resolver);
        expect(resolver.result).to.eql([]);
        expect(resolver.await).to.be.instanceof(Promise);

        tmp = resolver.await;
        resolver = resolver.resolve({ enrich: true });
        expect(resolver).to.be.instanceof(Promise);
        expect(await resolver).to.eql([{
            id: data[0].tconst,
            doc: data[0]
        }, {
            id: data[1].tconst,
            doc: data[1]
        }]);
        expect((await tmp)[0]).to.have.members(["tt0000001"]);

        // -----------------------------------

        resolver = new Resolver({
            index: document,
            async: true,
            query: "karmen or clown or nothing",
            field: "primaryTitle",
            suggest: true
        }).or({
            index: document,
            queue: true,
            query: "karmen or clown or nothing",
            pluck: "primaryTitle",
            suggest: true,
            enrich: true,
            resolve: true
        });

        expect(resolver).to.be.instanceof(Promise);
        expect(await resolver).to.eql([{
            id: data[0].tconst,
            doc: data[0]
        }, {
            id: data[1].tconst,
            doc: data[1]
        }]);

        // -----------------------------------

        resolver = new Resolver({
            index: document,
            async: true,
            query: "karmen or clown or nothing",
            pluck: "primaryTitle",
            suggest: true
        });

        expect(resolver).to.be.instanceof(Resolver);
        expect(resolver.result).to.eql([]);
        expect(resolver.await).to.be.instanceof(Promise);

        resolver = resolver.resolve({
            limit: 1,
            offset: 1
        });
        expect(resolver).to.be.instanceof(Promise);
        expect(await resolver).to.eql(["tt0000002"]);

        // -----------------------------------

        resolver = new Resolver({
            index: document,
            async: true,
            query: "karmen",
            pluck: "primaryTitle"
        }).or({
            queue: true,
            cache: true,
            query: "clown",
            field: "originalTitle"
        }).and({
            async: true,
            query: "not found",
            pluck: "originalTitle",
            suggest: true
        });

        expect(resolver).to.be.instanceof(Resolver);
        resolver = resolver.resolve();

        expect(resolver).to.be.instanceof(Promise);
        expect(await resolver).to.eql(["tt0000001", "tt0000002"]);

        // -----------------------------------

        resolver = new Resolver({
            index: document,
            async: true,
            cache: true,
            query: "karmen",
            pluck: "primaryTitle"
        }).or({
            and: [{
                async: true,
                cache: true,
                query: "not found",
                pluck: "originalTitle",
                suggest: true
            },{
                queue: true,
                cache: true,
                query: "clown",
                field: "originalTitle",
                suggest: true
            }]
        }).resolve();

        expect(resolver).to.be.instanceof(Promise);
        expect(await resolver).to.eql(["tt0000001", "tt0000002"]);
    });
});


