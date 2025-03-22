global.self = global;
const env = process.argv[3];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;

if(!build_light && !build_compact) describe("Resolver", function(){

    it("Should have been created a Resolver properly", function(){

        const index = new Index({ tokenize: "reverse" });
        index.add(1, "foo");
        index.add(2, "bar");
        index.add(3, "FooBar");

        let resolver = index.search("foo bar", { resolve: false, suggest: true });

        expect(resolver).to.be.instanceof(Resolver);
        expect(resolver).to.respondTo("and");
        expect(resolver).to.respondTo("or");
        expect(resolver).to.respondTo("xor");
        expect(resolver).to.respondTo("not");
        expect(resolver).to.respondTo("boost");
        expect(resolver).to.respondTo("limit");
        expect(resolver).to.respondTo("offset");
        expect(resolver).to.respondTo("resolve");

        expect(resolver.result).to.eql([[3, 1, 2]]);
    });

    it("Should have been created a Resolver properly (alternative)", function(){

        const index = new Index({ tokenize: "reverse" });
        index.add(1, "foo");
        index.add(2, "bar");
        index.add(3, "FooBar");

        let resolver = new Resolver({
            index: index,
            query: "foo bar",
            suggest: true
        });

        expect(resolver).to.be.instanceof(Resolver);
        expect(resolver.result).to.eql([[3, 1, 2]]);
    });

    it("Should have been resolved a Resolver properly", function(){

        const index = new Index({ tokenize: "reverse" });
        index.add(1, "foo");
        index.add(2, "bar");
        index.add(3, "FooBar");

        let result = new Resolver({
            index: index,
            query: "foo bar",
            suggest: true
        }).resolve();

        expect(result.length).to.equal(3);
        expect(result).to.eql([3, 1, 2]);

        result = new Resolver({
            index: index,
            query: "foo bar",
            suggest: true
        }).resolve({
            limit: 1,
            offset: 1
        });

        expect(result.length).to.equal(1);
        expect(result).to.eql([1]);

        result = new Resolver({
            index: index,
            query: "bar",
            suggest: true
        }).and({
            index: index,
            query: "foo",
            suggest: true,
            resolve: true
        });

        expect(result.length).to.equal(3);
        expect(result).to.eql([3, 2, 1]);
    });

    it("Should have been apply \"and\" properly", function(){

        const index = new Index({ tokenize: "forward" });
        [   'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute', // <-- dogs
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ].forEach((item, id) => {
            index.add(id, item);
        });

        let resolver = new Resolver({
            index: index,
            query: "cat"
        });

        expect(resolver.result).to.eql([[0, 1, 2, 3, 4, 5, 6]]);

        resolver = resolver.and({
            index: index,
            query: "cute"
        });

        expect(resolver.result).to.eql([
            void 0,
            [6],
            [5],
            [4],
            [3],
            [2],
            [1],
            [0]
        ]);

        resolver = resolver.and({
            index: index,
            query: "dog"
        });

        expect(resolver.result).to.eql([
            void 0,
            void 0,
            void 0,
            void 0,
            void 0,
            void 0,
            [1]
        ]);

        resolver = resolver.and({
            index: index,
            query: "fish",
            suggest: true
        });

        expect(resolver.result).to.eql([
            void 0,
            void 0,
            void 0,
            void 0,
            void 0,
            void 0,
            [1]
        ]);

        resolver = resolver.and({
            index: index,
            query: "bird"
        });

        expect(resolver.result).to.eql([]);

        resolver = resolver.and({
            index: index,
            query: "dog",
            suggest: true
        });

        expect(resolver.result).to.eql([
            void 0,
            void 0,
            void 0,
            void 0,
            void 0,
            [1]
        ]);
    });

    it("Should have been apply \"or\" properly", function(){

        const index = new Index({ tokenize: "forward" });
        [   'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute', // <-- dogs
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ].forEach((item, id) => {
            index.add(id, item);
        });

        let resolver = new Resolver({
            index: index,
            query: "cat"
        }).or({
            index: index,
            query: "cute"
        });

        expect(resolver.result).to.eql([[0, 1, 2, 3, 4, 5, 6]]);

        // todo
        // resolver = resolver.or([{
        //     index: index,
        //     query: "fish"
        // },{
        //     index: index,
        //     query: "dog"
        // },{
        //     index: index,
        //     query: "horse"
        // }]);

        resolver = resolver.or({
            index: index,
            query: "fish"
        }).or({
            index: index,
            query: "dog"
        }).or({
            index: index,
            query: "horse"
        }).or({
            index: index,
            query: "dog"
        }).or({
            index: index,
            query: "horse"
        })
        // todo
        /*.or({
            and: [{
                index: index,
                query: "dog"
            },{
                index: index,
                query: "cute"
            }]
        })*/;

        expect(resolver.result).to.eql([[0, 1, 2, 3, 4, 5, 6]]);
    });

    it("Should have been apply \"xor\" properly", function(){

        const index = new Index();
        index.add(1, "foo foo");
        index.add(2, "bar bar");
        index.add(3, "foo bar");
        index.add(4, "bar foo");

        let resolver = new Resolver({
            index: index,
            query: "foo"
        }).xor({
            index: index,
            query: "bar"
        });

        expect(resolver.result).to.eql([[1, 2]]);

    });

    it("Should have been apply \"not\" properly", function(){

        const index = new Index({ tokenize: "forward" });
        [   'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute', // <-- dogs
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ].forEach((item, id) => {
            index.add(id, item);
        });

        let resolver = new Resolver({
            index: index,
            query: "cute"
        }).not({
            index: index,
            query: "cat"
        });

        expect(resolver.result).to.eql([]);

        resolver = new Resolver({
            index: index,
            query: "cute"
        }).not({
            index: index,
            query: "dog"
        });

        expect(resolver.result).to.eql([
            void 0,
            [6],
            [5],
            [4],
            [3],
            [2],
            void 0, // dogs
            [0]
        ]);

    });

    it("Should have been apply \"limit\" and \"offset\" properly", function(){

        const index = new Index({ tokenize: "forward" });
        [   'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute', // <-- dogs
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ].forEach((item, id) => {
            index.add(id, item);
        });

        let resolver = new Resolver({
            index: index,
            query: "cute"
        }).limit(3);

        expect(resolver.result).to.eql([
            void 0,
            [6],
            [5],
            [4]
        ]);

        resolver = new Resolver({
            index: index,
            query: "cute"
        }).offset(3).limit(2);

        expect(resolver.result).to.eql([
            void 0,
            void 0, // offset +1
            void 0, // offset +2
            void 0, // offset +3
            [3],
            [2]
        ]);
    });

    it("Should have been apply \"boost\" properly", function(){

        const index = new Index({ tokenize: "forward" });
        [   'cats abcd efgh ijkl mnop qrst uvwx cute',
            'cats abcd efgh ijkl mnop dogs cute', // <-- dogs
            'cats abcd efgh ijkl mnop cute',
            'cats abcd efgh ijkl cute',
            'cats abcd efgh cute',
            'cats abcd cute',
            'cats cute'
        ].forEach((item, id) => {
            index.add(id, item);
        });

        let resolver = new Resolver({
            index: index,
            query: "dog"
        }).boost(0).or({
            index: index,
            query: "cat"
        });

        expect(resolver.result).to.eql([
            [ 0, 2, 3, 4, 5, 6 ],
            void 0,
            [ 1 ]
        ]);

        resolver = new Resolver({
            index: index,
            query: "dog"
        }).boost(1).or({
            index: index,
            query: "cat"
        });

        expect(resolver.result).to.eql([
            void 0,
            [ 0, 2, 3, 4, 5, 6 ],
            [ 1 ]
        ]);

        resolver = new Resolver({
            index: index,
            query: "dog"
        }).boost(2).or({
            index: index,
            query: "cat"
        });

        expect(resolver.result).to.eql([
            void 0,
            void 0,
            [ 1, 0, 2, 3, 4, 5, 6 ]
        ]);

        resolver = new Resolver({
            index: index,
            query: "dog"
        }).boost(3).or({
            index: index,
            query: "cat"
        });

        expect(resolver.result).to.eql([
            void 0,
            void 0,
            [ 1 ],
            [ 0, 2, 3, 4, 5, 6 ]
        ]);
    });
});
