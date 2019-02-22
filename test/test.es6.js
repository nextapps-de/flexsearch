if(typeof module !== "undefined"){

    var env = "pre";
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

        if(env === ""){

            expect(index.doc.index["data:title"].length).to.equal(3);
            expect(index.doc.index["data:body"].length).to.equal(3);
        }

        expect(await index.search({field: "data:body", query: "body"})).to.have.members(data);
        expect(await index.search({field: "data:title", query: "title"})).to.have.members(data);

        expect(await index.search({field: "data:body", query: "title"})).to.have.lengthOf(0);
        expect(await index.search({field: "data:title", query: "body"})).to.have.lengthOf(0);

        expect(await index.search({field: ["data:title", "data:body"], query: "body", bool: "or"})).to.have.members(data);
        expect(await index.search({field: ["data:body", "data:title"], query: "title", bool: "or"})).to.have.members(data);

        expect(await index.search({field: ["data:body"], query: "body"})).to.have.members(data);
        expect(await index.search({field: "data:title", query: "title"})).to.have.members(data);

        expect(await index.search({query: "body", bool: "or"})).to.have.members(data);
        expect(await index.search("title", {bool: "or"})).to.have.members(data);

        expect(await index.search({field: ["data:body"], query: "body"})).to.have.members(data);
        expect(await index.search({field: "data:title", query: "title"})).to.have.members(data);

        await index.update(update);

        expect(await index.search("foo", {bool: "or"})).not.to.have.members(data);
        expect(await index.search("bar", {bool: "or"})).not.to.have.members(data);
        expect(await index.search("foo", {bool: "or"})).to.have.members(update);
        expect(await index.search("bar", {bool: "or"})).to.have.members(update);

        expect(await index.search("foo", {field: "data:title"})).not.to.have.members(data);
        expect(await index.search("bar", {field: "data:body"})).not.to.have.members(data);
        expect(await index.search("foo", {field: "data:title"})).to.have.members(update);
        expect(await index.search("bar", {field: "data:body"})).to.have.members(update);

        await index.remove(update);

        if(env === ""){

            expect(await index.doc.index["data:title"].length).to.equal(0);
            expect(await index.doc.index["data:body"].length).to.equal(0);
        }
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

        if(env === ""){

            expect(index.doc.index["data:title"].length).to.equal(3);
            expect(index.doc.index["data:body"].length).to.equal(3);
        }

        expect(await index.search({field: "data:body", query: "body"})).to.have.members(data);
        expect(await index.search({field: "data:title", query: "title"})).to.have.members(data);

        expect(await index.search({field: "data:body", query: "title"})).to.have.lengthOf(0);
        expect(await index.search({field: "data:title", query: "body"})).to.have.lengthOf(0);

        expect(await index.search({field: ["data:title", "data:body"], query: "body", bool: "or"})).to.have.members(data);
        expect(await index.search({field: ["data:body", "data:title"], query: "title", bool: "or"})).to.have.members(data);

        expect(await index.search({field: ["data:body"], query: "body"})).to.have.members(data);
        expect(await index.search({field: "data:title", query: "title"})).to.have.members(data);

        expect(await index.search({query: "body", bool: "or"})).to.have.members(data);
        expect(await index.search("title", {bool: "or"})).to.have.members(data);

        expect(await index.search({query: "body", field: "data:body"})).to.have.members(data);
        expect(await index.search("title", {field: "data:title"})).to.have.members(data);

        await index.update(update);

        expect(await index.search("foo", {bool: "or"})).not.to.have.members(data);
        expect(await index.search("bar", {bool: "or"})).not.to.have.members(data);
        expect(await index.search("foo", {bool: "or"})).to.have.members(update);
        expect(await index.search("bar", {bool: "or"})).to.have.members(update);

        expect(await index.search("foo", {field: "data:title"})).not.to.have.members(data);
        expect(await index.search("bar", {field: "data:body"})).not.to.have.members(data);
        expect(await index.search("foo", {field: "data:title"})).to.have.members(update);
        expect(await index.search("bar", {field: "data:body"})).to.have.members(update);

        await index.remove(update);

        if(env === ""){

            expect(await index.doc.index["data:title"].length).to.equal(0);
            expect(await index.doc.index["data:body"].length).to.equal(0);
        }
    });
});
