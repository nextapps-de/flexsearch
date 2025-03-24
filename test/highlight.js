global.self = global;
const env = process.argv[3] && process.argv[3].startsWith("--") ? process.argv[4] : process.argv[3];
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

    it("Should have been indexed properly (tag)", function(){

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
        const result = index.search({
            query: "karmen or clown or not found",
            suggest: true,
            // set enrich to true (required)
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
    });
});
