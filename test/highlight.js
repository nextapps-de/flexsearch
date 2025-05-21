global.self = global;
const env = process.argv[3] && process.argv[3] === "--exit" ? process.argv[4] : process.argv[3];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;

if(!build_light) describe("Result Highlighting", function(){

    it("Should have been highlighted results properly (Document)", function(){

        // some test data
        const data = [{
            "id": 1,
            "title": "Carmencita"
        },{
            "id": 2,
            "title": "Le clown et ses chiens"
        }];

        // create the document index
        const index = new Document({
            cache: true,
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
            index.add(data[i]);
        }

        // perform a query
        let result = index.searchCache({
            query: "karmen or clown or not found",
            suggest: true,
            enrich: true,
            // highlight template
            // $1 is a placeholder for the matched partial
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
        result = index.searchCache({
            query: "karmen or clown or not found",
            suggest: true,
            enrich: true,
            // highlight template
            // $1 is a placeholder for the matched partial
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

        // perform a query using pluck
        result = index.search({
            query: "karmen or clown or not found",
            suggest: true,
            enrich: true,
            pluck: "title",
            // highlight template
            // $1 is a placeholder for the matched partial
            highlight: "<b>$1</b>"
        });

        expect(result).to.eql([{
            id: 1,
            doc: data[0],
            highlight: '<b>Carmen</b>cita'
        },{
            id: 2,
            doc: data[1],
            highlight: 'Le <b>clown</b> et ses chiens'
        }]);
    });

    if(!build_compact) it("Should have been highlighted results properly (Document Worker)", async function(){

        // some test data
        const data = [{
            "id": 1,
            "title": "Carmencita"
        },{
            "id": 2,
            "title": "Le clown et ses chiens"
        }];

        // create the document index
        const index = await new Document({
            cache: true,
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
            await index.add(data[i]);
        }

        // perform a query
        let result = await index.searchCache({
            query: "karmen or clown or not found",
            suggest: true,
            enrich: true,
            // highlight template
            // $1 is a placeholder for the matched partial
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
        result = await index.searchCache({
            query: "karmen or clown or not found",
            suggest: true,
            enrich: true,
            // highlight template
            // $1 is a placeholder for the matched partial
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

        // perform a query using pluck
        result = await index.search({
            query: "karmen or clown or not found",
            suggest: true,
            enrich: true,
            pluck: "title",
            // highlight template
            // $1 is a placeholder for the matched partial
            highlight: "<b>$1</b>"
        });

        expect(result).to.eql([{
            id: 1,
            doc: data[0],
            highlight: '<b>Carmen</b>cita'
        },{
            id: 2,
            doc: data[1],
            highlight: 'Le <b>clown</b> et ses chiens'
        }]);
    });

    it("Should have been highlighted results by boundary properly", function(){

        const data = [{
            "id": 1,
            "title": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
        },{
            "id": 2,
            "title": "Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
        }];

        const index = new Document({
            document: {
                store: true,
                index: [{
                    field: "title",
                    tokenize: "full",
                    encoder: Charset.LatinBalance
                }]
            }
        });

        // add test data
        for(let i = 0; i < data.length; i++){
            index.add(data[i]);
        }


        const tmp = index.search({
            query: "sit amet",
            pluck: "title",
            highlight: {
                template: "<b>$1</b>",
                boundary: 80,
                clip: true
            }
        });

        // ------------------------------

        let result = index.search({
            query: "undefined akusam undefined",
            suggest: true,
            enrich: true,
            highlight: {
                // highlight template
                // $1 is a placeholder for the matched partial
                template: "<b>$1</b>",
                boundary: 49
            }
        });

        expect(result[0].result).to.eql([{
            id: 2,
            doc: data[1],
            highlight: "...t. At vero eos et <b>accusam</b> et justo duo dolo..."
        },{
            id: 1,
            doc: data[0],
            highlight: "...a. At vero eos et <b>accusam</b> et justo duo dolo..."
        }]);

        expect(result[0].result[0].highlight.length).to.equal(49 + (3 + 4));
        expect(result[0].result[1].highlight.length).to.equal(49 + (3 + 4));

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined",
            suggest: true,
            enrich: true,
            highlight: {
                // highlight template
                // $1 is a placeholder for the matched partial
                template: "<b>$1</b>",
                ellipsis: "",
                boundary: 49
            }
        });

        expect(result[0].result).to.eql([{
            id: 2,
            doc: data[1],
            highlight: "amet. At vero eos et <b>accusam</b> et justo duo dolores"
        },{
            id: 1,
            doc: data[0],
            highlight: "ptua. At vero eos et <b>accusam</b> et justo duo dolores"
        }]);

        expect(result[0].result[0].highlight.length).to.equal(49 + (3 + 4));
        expect(result[0].result[1].highlight.length).to.equal(49 + (3 + 4));

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined",
            suggest: true,
            enrich: true,
            highlight: {
                // highlight template
                // $1 is a placeholder for the matched partial
                template: "<b>$1</b>",
                clip: false,
                boundary: 49
            }
        });

        expect(result[0].result).to.eql([{
            id: 2,
            doc: data[1],
            highlight: "... At vero eos et <b>accusam</b> et justo duo ..."
        },{
            id: 1,
            doc: data[0],
            highlight: "... At vero eos et <b>accusam</b> et justo duo ..."
        }]);

        expect(result[0].result[0].highlight.length).to.below(49 + (3 + 4));
        expect(result[0].result[1].highlight.length).to.below(49 + (3 + 4));

        // ------------------------------

        result = index.search({
            query: "akusam",
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                boundary: 5
            }
        });

        expect(result[0].result[0].highlight).to.equal("...<b>accusam</b>...");
        expect(result[0].result[1].highlight).to.equal("...<b>accusam</b>...");

        // ------------------------------

        result = index.search({
            query: "akusam",
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "",
                boundary: 5
            }
        });

        expect(result[0].result[0].highlight).to.equal("<b>accusam</b>");
        expect(result[0].result[1].highlight).to.equal("<b>accusam</b>");

        // ------------------------------

        result = index.search({
            query: "akusam",
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "",
                boundary: {
                    before: 50,
                    after: 50,
                    total: 5
                }
            }
        });

        expect(result[0].result[0].highlight).to.equal("<b>accusam</b>");
        expect(result[0].result[1].highlight).to.equal("<b>accusam</b>");

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "",
                boundary: 5
            }
        });

        expect(result[0].result[0].highlight).to.equal("<b>accusam</b>");
        expect(result[0].result[1].highlight).to.equal("<b>accusam</b>");

        // ------------------------------

        result = index.search({
            query: "akus",
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "",
                boundary: 5
            }
        });

        expect(result[0].result[0].highlight).to.equal("<b>accus</b>am");
        expect(result[0].result[1].highlight).to.equal("<b>accus</b>am");

        // ------------------------------

        result = index.search({
            query: "cusa",
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "",
                boundary: 5
            }
        });

        expect(result[0].result[0].highlight).to.equal("a<b>ccusa</b>m");
        expect(result[0].result[1].highlight).to.equal("a<b>ccusa</b>m");

        // ------------------------------

        result = index.search({
            query: "cusa",
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                ellipsis: "...",
                clip: false,
                boundary: 5
            }
        });

        expect(result[0].result[0].highlight).to.equal("...a<b>ccusa</b>m...");
        expect(result[0].result[1].highlight).to.equal("...a<b>ccusa</b>m...");

        // ------------------------------

        result = index.search({
            query: "cusa",
            enrich: true,
            highlight: {
                template: "<b class='highlight'>$1</b>",
                ellipsis: "<i class='ellipsis'>...</i>",
                clip: true,
                boundary: 5
            }
        });

        expect(result[0].result[0].highlight).to.equal("<i class='ellipsis'>...</i>a<b class='highlight'>ccusa</b>m<i class='ellipsis'>...</i>");
        expect(result[0].result[1].highlight).to.equal("<i class='ellipsis'>...</i>a<b class='highlight'>ccusa</b>m<i class='ellipsis'>...</i>");

        // ------------------------------

        result = index.search({
            query: "akusam",
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: true,
                ellipsis: false,
                boundary: {
                    before: 5,
                    after: 5
                }
            }
        });

        expect(result[0].result[0].highlight).to.equal("s et <b>accusam</b> et j");
        expect(result[0].result[1].highlight).to.equal("s et <b>accusam</b> et j");

        // ------------------------------

        result = index.search({
            query: "akusam",
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: true,
                ellipsis: "",
                boundary: {
                    before: 0,
                    after: 0
                }
            }
        });

        expect(result[0].result[0].highlight).to.equal("<b>accusam</b>");
        expect(result[0].result[1].highlight).to.equal("<b>accusam</b>");

        // ------------------------------

        result = index.search({
            query: "akusam",
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: true,
                ellipsis: "",
                boundary: {
                    before: 5,
                    total: 50
                }
            }
        });

        expect(result[0].result[0].highlight).to.equal("s et <b>accusam</b> et justo duo dolores et ea rebum. Lor");
        expect(result[0].result[1].highlight).to.equal("s et <b>accusam</b> et justo duo dolores et ea rebum. Ste");

        // ------------------------------

        result = index.search({
            query: "akusam",
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: true,
                ellipsis: "",
                boundary: {
                    after: 5,
                    total: 50
                }
            }
        });

        expect(result[0].result[0].highlight).to.equal("et. At vero eos et <b>accusam</b> et j");
        expect(result[0].result[1].highlight).to.equal("ua. At vero eos et <b>accusam</b> et j");

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                boundary: 51
            }
        });

        expect(result[0].result[0].highlight).to.equal("... eos et <b>accusam</b> et <b>justo</b> duo <b>dolores</b> et ea re...");
        expect(result[0].result[1].highlight).to.equal("... eos et <b>accusam</b> et <b>justo</b> duo <b>dolores</b> et ea re...");
        expect(result[0].result[0].highlight.length).to.equal(51 + 3 * (3 + 4));
        expect(result[0].result[1].highlight.length).to.equal(51 + 3 * (3 + 4));

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "...",
                boundary: 51
            }
        });

        expect(result[0].result[0].highlight).to.equal("... eos et <b>accusam</b> et <b>justo</b> duo <b>dolores</b> et ea ...");
        expect(result[0].result[1].highlight).to.equal("... eos et <b>accusam</b> et <b>justo</b> duo <b>dolores</b> et ea ...");
        expect(result[0].result[0].highlight.length).to.below(51 + 3 * (3 + 4));
        expect(result[0].result[1].highlight.length).to.below(51 + 3 * (3 + 4));

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "",
                boundary: 52
            }
        });

        expect(result[0].result[0].highlight).to.equal("vero eos et <b>accusam</b> et <b>justo</b> duo <b>dolores</b> et ea ");
        expect(result[0].result[1].highlight).to.equal("vero eos et <b>accusam</b> et <b>justo</b> duo <b>dolores</b> et ea ");
        expect(result[0].result[0].highlight.length).to.below(51 + 3 * (3 + 4));
        expect(result[0].result[1].highlight.length).to.below(51 + 3 * (3 + 4));

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "",
                boundary: 7 + 1 + 5 + 1 + 7
            }
        });

        expect(result[0].result[0].highlight).to.equal("<b>accusam</b> <b>justo</b> <b>dolores</b>");
        expect(result[0].result[1].highlight).to.equal("<b>accusam</b> <b>justo</b> <b>dolores</b>");

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "",
                boundary: 20
            }
        });

        expect(result[0].result[0].highlight).to.equal("<b>accusam</b> <b>justo</b>");
        expect(result[0].result[1].highlight).to.equal("<b>accusam</b> <b>justo</b>");

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                merge: true,
                ellipsis: "",
                boundary: 21
            }
        });

        expect(result[0].result[0].highlight).to.equal("<b>accusam justo dolores</b>");
        expect(result[0].result[1].highlight).to.equal("<b>accusam justo dolores</b>");

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "...",
                boundary: 18
            }
        });

        expect(result[0].result[0].highlight).to.equal("...<b>accusam</b>...");
        expect(result[0].result[1].highlight).to.equal("...<b>accusam</b>...");

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "...",
                boundary: 7 + 5 + (3 * 3) + 1
            }
        });

        expect(result[0].result[0].highlight).to.equal("...<b>accusam</b>...<b>justo</b>...");
        expect(result[0].result[1].highlight).to.equal("...<b>accusam</b>...<b>justo</b>...");

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "...",
                boundary: 7 + 5 + (3 * 3) + 1 - 1
            }
        });

        expect(result[0].result[0].highlight).to.equal("...<b>accusam</b>...");
        expect(result[0].result[1].highlight).to.equal("...<b>accusam</b>...");

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: true,
                ellipsis: "...",
                boundary: 7 + 5 + (3 * 3) + 1 - 1
            }
        });

        expect(result[0].result[0].highlight).to.equal("...<b>accusam</b>...");
        expect(result[0].result[1].highlight).to.equal("...<b>accusam</b>...");

        // ------------------------------

        result = index.search({
            query: "undefined aku undefined usam undefined akusam undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "...",
                boundary: 7 + 5 + (3 * 3) + 1
            }
        });

        expect(result[0].result[0].highlight).to.equal("... et <b>accusam</b> et ...");
        expect(result[0].result[1].highlight).to.equal("... et <b>accusam</b> et ...");
        expect(result[0].result[0].highlight.length).to.below(7 + 5 + (3 * 3) + 1 + 7);
        expect(result[0].result[1].highlight.length).to.below(7 + 5 + (3 * 3) + 1 + 7);

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined justo undefined dolores undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                clip: false,
                ellipsis: "...",
                boundary: 50
            }
        });

        expect(result[0].result[0].highlight).to.equal("... eos et <b>accusam</b> et <b>justo</b> duo <b>dolores</b> et ea ...");
        expect(result[0].result[1].highlight).to.equal("... eos et <b>accusam</b> et <b>justo</b> duo <b>dolores</b> et ea ...");

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined labore undefined sanktus undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                boundary: 100
            }
        });

        expect(result[0].result).to.eql([{
            id: 2,
            doc: data[1],
            highlight: "...sea takimata <b>sanctus</b> est Lorem ipsu...eos et <b>accusam</b> et justo...invidunt ut <b>labore</b> et dolore..."
        },{
            id: 1,
            doc: data[0],
            highlight: "...invidunt ut <b>labore</b> et dolore magn...eos et <b>accusam</b> et justo...sea takimata <b>sanctus</b> est Lorem..."
        }]);

        // ------------------------------

        result = index.search({
            query: "undefined akusam undefined labore undefined sanktus undefined",
            suggest: true,
            enrich: true,
            highlight: {
                template: "<b>$1</b>",
                boundary: {
                    before: 15,
                    after: 15,
                    total: 100
                }
            }
        });

        expect(result[0].result).to.eql([{
            id: 2,
            doc: data[1],
            highlight: "...sea takimata <b>sanctus</b> est Lorem ipsu...eos et <b>accusam</b> et justo...invidunt ut <b>labore</b> et dolore..."
        },{
            id: 1,
            doc: data[0],
            highlight: "...invidunt ut <b>labore</b> et dolore magn...eos et <b>accusam</b> et justo...sea takimata <b>sanctus</b> est Lorem..."
        }]);

        // ------------------------------

        result = index.search({
            query: "sit amet",
            pluck: "title",
            highlight: {
                template: "<b>$1</b>",
                boundary: 80,
                clip: true
            }
        });

        expect(result[0].highlight).to.eql("...dolor <b>sit</b> <b>amet</b>, con<b>set</b>etur sadipscing...r, <b>sed</b> diam...<b>sed</b> diam...<b>sit</b> <b>amet</b>.");
        expect(result[1].highlight).to.eql("...or <b>sit</b> <b>amet</b>. At...<b>sit</b> <b>amet</b>, con<b>set</b>etur sadipscing...<b>sed</b> diam...<b>sed</b> diam...");

        expect(result[0].highlight.length).to.below(80 + (7 * 7));
        expect(result[1].highlight.length).to.below(80 + (7 * 7));

        // ------------------------------

        result = index.search({
            query: "sit amet",
            pluck: "title",
            highlight: {
                template: "<b>$1</b>",
                boundary: 32,
                clip: true
            }
        });

        expect(result[0].highlight).to.eql("...<b>sit</b> <b>amet</b>, con<b>set</b>etur...");
        expect(result[1].highlight).to.eql("...<b>sit</b> <b>amet</b>....<b>sit</b> <b>amet</b>,...");

        expect(result[0].highlight.length).to.below(80 + (7 * 7));
        expect(result[1].highlight.length).to.below(80 + (7 * 7));

        // ------------------------------

        result = index.search({
            query: "sit amet",
            pluck: "title",
            highlight: {
                template: "<b>$1</b>",
                boundary: 32,
                ellipsis: {
                    template: "<i>$1</i>",
                    pattern: "..."
                },
                clip: true
            }
        });

        expect(result[0].highlight).to.eql("<i>...</i><b>sit</b> <b>amet</b>, con<b>set</b>etur<i>...</i>");
        expect(result[1].highlight).to.eql("<i>...</i><b>sit</b> <b>amet</b>.<i>...</i><b>sit</b> <b>amet</b>,<i>...</i>");

        expect(result[0].highlight.length).to.below(80 + (7 * 7));
        expect(result[1].highlight.length).to.below(80 + (7 * 7));
    });

    it("Should have been highlighted merged results properly", function(){

// some test data
const data = [{
    "id": 1,
    "title": "Carmencita",
    "description": "Description: Carmencita"
},{
    "id": 2,
    "title": "Le clown et ses chiens",
    "description": "Description: Le clown et ses chiens"
}];

// create the document index
const index = new Document({
    encoder: Charset.LatinBalance,
    document: {
        store: true,
        index: [{
            field: "title",
            tokenize: "forward"
        },{
            field: "description",
            tokenize: "forward"
        }]
    }
});

// add test data
for(let i = 0; i < data.length; i++){
    index.add(data[i]);
}

let result = index.search({
    query: "karmen or clown or not found",
    suggest: true,
    enrich: true,
    merge: true,
    highlight: "<b>$1</b>"
});

expect(result).to.eql([{
    id: 1,
    doc: data[0],
    field: ["title", "description"],
    highlight: {
        "title": '<b>Carmen</b>cita',
        "description": 'Description: <b>Carmen</b>cita',
    }
},{
    id: 2,
    doc: data[1],
    field: ["title", "description"],
    highlight: {
        "title": 'Le <b>clown</b> et ses chiens',
        "description": 'Description: Le <b>clown</b> et ses chiens',
    }
}]);
    });

    it("Should have been highlighted results properly (#480)", function(){

        const index = new Document({
            document: {
                store: true,
                index: [{
                    field: "title",
                    tokenize: "forward",
                    encoder: Charset.LatinDefault
                },{
                    field: "text",
                    tokenize: "forward",
                    encoder: Charset.LatinDefault
                }]
            }
        });

        let all_docs = [{
            id: "469",
            title: "Polygon",
            text: "A polygon is a two dimensional figure"
        },{
            id: "888",
            title: "Spain",
            text: "Spain is a country."
        },{
            id: "473",
            text: "Madrid (pronounced: “mah-drid or /məˈdrɪd/) is the capital and largest city of Spain. Madrid is in the middle of Spain, in the Community of Madrid. The Community is a large area that includes the city as well as small towns and villages outside the city. 7 million people live in the Community. More than 3 million live in the city itself. It is the largest city of Spain and, at 655 m (2,100 ft) above sea level, the second highest capital in Europe (after the Andorran capital Andorra la Vella). It is the second largest city in the European Union. As it is the capital city, Madrid is where the monarch lives and also where the government meets. Madrid is the financial centre of Spain. Many large businesses have their main offices there. It has four important footballs teams, Real Madrid, Atlético Madrid, Getafe, and Rayo Vallecano. People who live in Madrid are called madrileños. Madrid was ruled by the Romans from the 2nd century. After AD 711 it was occupied by the Moors. In 1083 Spain was ruled again by Spaniards. Catholic kings ruled the country. By the mid-16th century it had become the capital of a very large empire. Spain was ruled by monarchs from the House of Habsburg, then the House of Bourbon. After the Spanish Civil War it was ruled by a dictator until the mid-1970s when it became a democracy. Although it is a modern city, a lot of its history can be seen and felt as one walks along the streets and in the large squares of the city. There are beautiful parks, famous buildings, art galleries and concert halls. == History == During the history of Spain many different people have lived there. Madrid's name comes from the Arabic word magerit, meaning “place of many streams\\\". The Phoenicians came in 1100 BC, followed by Carthaginians, Romans, Vandals, Visigoths and Moors. It was not until 1492, when the Catholic Monarchs got power, that Spain became a united country. establishments in Europe Category:Establishments in Spain",
            title: "Madrid"
        }];

        for(let i = 0; i < all_docs.length; i++){
            index.add(all_docs[i]);
        }

        let result = index.search({
            query: "spain",
            suggest: true,
            enrich: true,
            highlight: "<b>$1</b>"
        });

        expect(result.length).to.equal(2);
        expect(result[0]).to.eql({
            field: "title",
            result: [{
                id: all_docs[1].id,
                doc: all_docs[1],
                highlight: '<b>Spain</b>'
            }]
        });

        expect(result[1]).to.eql({
            field: "text",
            result: [{
                id: all_docs[1].id,
                doc: all_docs[1],
                highlight: all_docs[1].text.replace(/(spain)/gi, "<b>$1</b>")
            },{
                id: all_docs[2].id,
                doc: all_docs[2],
                highlight: all_docs[2].text.replace(/(spain)/gi, "<b>$1</b>")
            }]
        });
    });

    it("Should have been highlighted results properly (#489)", async function(){

        const index = new Document({
            encoder: Charset.Normalize,
            document: {
                store: true,
                index: [
                    {
                        field: "title",
                        tokenize: "forward"
                    },
                    {
                        field: "content",
                        tokenize: "forward"
                    }
                ],
            },
        });

        await index.addAsync({
            id: 1,
            title: "Tips For Decorating Easter Eggs",
            content: `Published: April 14, 2025 From bold color choices to intricate patterns, there are many ways to make your springtime holiday decorations stand out from the rest. The Onion shares tips for dyeing Easter eggs.`
        });

        const search = await index.search("h", {
            suggest: true,
            enrich: true,
            highlight: `<b>$1</b>`
        });

        expect(search.length).to.equal(1);
        expect(search[0].result.length).to.equal(1);
        expect(search[0].result[0].highlight).to.equal('Publis<b>h</b>ed: April 14, 2025 From bold color c<b>h</b>oices to intricate patterns, t<b>h</b>ere are many ways to make your springtime <b>h</b>oliday decorations stand out from t<b>h</b>e rest. T<b>h</b>e Onion s<b>h</b>ares tips for dyeing Easter eggs.');
    });
});
