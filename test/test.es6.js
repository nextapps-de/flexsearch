if(typeof module !== "undefined"){

    var expect = require("chai").expect;
}

module.exports = function(FlexSearch, env){

    // ------------------------------------------------------------------------
    //  Multi-Field Documents
    // ------------------------------------------------------------------------

    if(env === "") describe("Index Multi-Field Documents", function(){

        var data = [{

            data:{
                id: 0,
                title: "Title 1",
                body: "Body 1"
            }
        },{
            data:{
                id: 1,
                title: "Title 2",
                body: "Body 2"
            }
        },{
            data:{
                id: 2,
                title: "Title 3",
                body: "Body 3"
            }
        }];

        var update = [{

            data:{
                id: 0,
                title: "Foo 1",
                body: "Bar 1"
            }
        },{
            data:{
                id: 1,
                title: "Foo 2",
                body: "Bar 2"
            }
        },{
            data:{
                id: 2,
                title: "Foo 3",
                body: "Bar 3"
            }
        }];

        it("Should have been indexed properly", function(){

            var index = new FlexSearch({

                doc: {

                    id: "data:id",
                    field: [
                        "data:title",
                        "data:body"
                    ]
                }
            });

            index.add(data);

            expect(index.doc.index[0].length).to.equal(3);
            expect(index.doc.index[1].length).to.equal(3);

            expect(index.search({field: "data:body", query: "body"})).to.have.members(data);
            expect(index.search({field: "data:title", query: "title"})).to.have.members(data);

            expect(index.search({field: "data:body", query: "title"})).to.have.lengthOf(0);
            expect(index.search({field: "data:title", query: "body"})).to.have.lengthOf(0);

            expect(index.search({field: ["data:title", "data:body"], query: "body"})).to.have.members(data);
            expect(index.search({field: ["data:body", "data:title"], query: "title"})).to.have.members(data);

            expect(index.search({query: "body"})).to.have.members(data);
            expect(index.search("title")).to.have.members(data);

            expect(index.search({

                field: "data:title",
                query: "title",
                boost: 2

            })).to.have.members(data);

            expect(index.search([{

                field: "data:title",
                query: "body",
                boost: 2
            },{
                field: "data:body",
                query: "body",
                boost: 2

            }])).to.have.members(data);

            expect(index.search("title", {

                field: "data:title",
                boost: 2

            })).to.have.members(data);

            expect(index.search("title", {

                field: "data:body",
                boost: 2

            })).to.have.lengthOf(0);

            expect(index.search("body", [{

                field: "data:title",
                boost: 2
            },{
                field: "data:body",
                boost: 2

            }])).to.have.members(data);

            index.update(update);

            expect(index.search("foo")).not.to.have.members(data);
            expect(index.search("bar")).not.to.have.members(data);
            expect(index.search("foo")).to.have.members(update);
            expect(index.search("bar")).to.have.members(update);

            index.remove(update);

            expect(index.doc.index[0].length).to.equal(0);
            expect(index.doc.index[1].length).to.equal(0);
        });

        it("Should have been boosted properly", function(){

            var index = new FlexSearch({

                tokenize: "strict",
                depth: 3,
                doc: {
                    id: "id",
                    field: ["title", "body"]
                }
            });

            index.add([{

                id: 0,
                title: "1 2 3 4 5",
                body: "1 2 3 4 5"
            },{
                id: 1,
                title: "1 2 3 4 5",
                body: "1 2 5 4 3" // <-- body
            },{
                id: 2,
                title: "1 2 5 4 3", // <-- title
                body: "1 2 3 4 5"
            }]);

            expect(index.search([{

                field: "title",
                query: "5",
                boost: 0.1
            },{
                field: "body",
                query: "5",
                boost: 9

            }])[0].id).to.equal(1);

            expect(index.search([{

                field: "title",
                query: "5",
                boost: 9
            },{
                field: "body",
                query: "5",
                boost: 0.1

            }])[0].id).to.equal(2);
        });

        it("Should have been indexed properly (Async)", async function(){

            var index = new FlexSearch({

                async: true,
                doc: {

                    id: "data:id",
                    field: [
                        "data:title",
                        "data:body"
                    ]
                }
            });

            await index.add(data);

            expect(index.doc.index[0].length).to.equal(3);
            expect(index.doc.index[1].length).to.equal(3);

            expect(await index.search({field: "data:body", query: "body"})).to.have.members(data);
            expect(await index.search({field: "data:title", query: "title"})).to.have.members(data);

            expect(await index.search({field: "data:body", query: "title"})).to.have.lengthOf(0);
            expect(await index.search({field: "data:title", query: "body"})).to.have.lengthOf(0);

            expect(await index.search({field: ["data:title", "data:body"], query: "body"})).to.have.members(data);
            expect(await index.search({field: ["data:body", "data:title"], query: "title"})).to.have.members(data);

            expect(await index.search({query: "body"})).to.have.members(data);
            expect(await index.search("title")).to.have.members(data);

            await index.update(update);

            expect(await index.search("foo")).not.to.have.members(data);
            expect(await index.search("bar")).not.to.have.members(data);
            expect(await index.search("foo")).to.have.members(update);
            expect(await index.search("bar")).to.have.members(update);

            await index.remove(update);

            expect(await index.doc.index[0].length).to.equal(0);
            expect(await index.doc.index[1].length).to.equal(0);
        });

        it("Should have been indexed properly (Worker)", async function(){

            var index = new FlexSearch({

                worker: 4,
                async: true,
                doc: {

                    id: "data:id",
                    field: [
                        "data:title",
                        "data:body"
                    ]
                }
            });

            await index.add(data);

            expect(index.doc.index[0].length).to.equal(3);
            expect(index.doc.index[1].length).to.equal(3);

            expect(await index.search({field: "data:body", query: "body"})).to.have.members(data);
            expect(await index.search({field: "data:title", query: "title"})).to.have.members(data);

            expect(await index.search({field: "data:body", query: "title"})).to.have.lengthOf(0);
            expect(await index.search({field: "data:title", query: "body"})).to.have.lengthOf(0);

            expect(await index.search({field: ["data:title", "data:body"], query: "body"})).to.have.members(data);
            expect(await index.search({field: ["data:body", "data:title"], query: "title"})).to.have.members(data);

            expect(await index.search({query: "body"})).to.have.members(data);
            expect(await index.search("title")).to.have.members(data);

            await index.update(update);

            expect(await index.search("foo")).not.to.have.members(data);
            expect(await index.search("bar")).not.to.have.members(data);
            expect(await index.search("foo")).to.have.members(update);
            expect(await index.search("bar")).to.have.members(update);

            await index.remove(update);

            expect(await index.doc.index[0].length).to.equal(0);
            expect(await index.doc.index[1].length).to.equal(0);
        });
    });

    // ------------------------------------------------------------------------
    // Export / Import
    // ------------------------------------------------------------------------

    if(env !== "light") describe("Export / Import", function(){

        var data;

        it("Should have been exported properly", function(){

            var index = new FlexSearch({
                tokenize: "reverse",
                doc: {
                    id: "id",
                    field: "title"
                }
            });

            index.add({id: 0, title: "foo"});
            index.add({id: 1, title: "bar"});
            index.add({id: 2, title: "foobar"});

            if(env === ""){

                expect(index.doc.index[0].length).to.equal(3);

                data = index.export();

                expect(data).to.equal(JSON.stringify([
                    [
                        index.doc.index[0]._map,
                        index.doc.index[0]._ctx,
                        index.doc.index[0]._ids
                    ],
                    index._doc
                ]));
            }
            else{

                data = index.export();
            }
        });

        it("Should have been imported properly", function(){

            var index = new FlexSearch("score", {
                doc: {
                    id: "id",
                    field: "title"
                }
            });

            index.import(data);

            if(env === ""){

                expect(index.doc.index[0].length).to.equal(3);
            }

            expect(index.search("foo")).to.have.lengthOf(2);
            expect(index.search("bar")).to.have.lengthOf(2);
            expect(index.search("foobar")).to.have.lengthOf(1);
            expect(index.search("foobar")[0].id).to.equal(2);
        });
    });
};