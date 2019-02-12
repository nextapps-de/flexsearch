var env = "";

if(typeof module !== "undefined"){

    var expect = require("chai").expect;
    var FlexSearch = require("../" + (env ? "dist/": "") + "flexsearch" + (env ? "." + env : "") + ".js");
}

// ------------------------------------------------------------------------
//  Multi-Field Documents
// ------------------------------------------------------------------------

describe("Index Multi-Field Documents (ES6)", function(){

    var data = [{

        id: 2,
        data:{
            title: "Title 3",
            body: "Body 3"
        }
    },{
        id: 1,
        data:{
            title: "Title 2",
            body: "Body 2"
        }
    },{
        id: 0,
        data:{
            title: "Title 1",
            body: "Body 1"
        }
    }];

    var update = [{

        id: 0,
        data:{
            title: "Foo 1",
            body: "Bar 1"
        }
    },{
        id: 1,
        data:{
            title: "Foo 2",
            body: "Bar 2"
        }
    },{
        id: 2,
        data:{
            title: "Foo 3",
            body: "Bar 3"
        }
    }];

    it("Should have been indexed properly (Async)", async function(){

        var index = new FlexSearch({

            async: true,
            doc: {

                id: "id",
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

                id: "id",
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
