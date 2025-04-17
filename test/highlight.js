global.self = global;
const env = process.argv[4] && process.argv[4] === "--exit"
    ? process.argv[5]
    : process.argv[3] && process.argv[3] === "--exit"
        ? process.argv[4]
        : process.argv[3];
import { expect } from "chai";
let FlexSearch = await import(env ? "../dist/" + env + ".js" : "../src/bundle.js");
if(FlexSearch.default) FlexSearch = FlexSearch.default;
if(FlexSearch.FlexSearch) FlexSearch = FlexSearch.FlexSearch;
const { Index, Document, Worker, Charset: _Charset, Encoder, Resolver } = FlexSearch;
const build_light = env && env.includes(".light");
const build_compact = env && env.includes(".compact");
const build_esm = !env || env.startsWith("module");
const Charset = _Charset || (await import("../src/charset.js")).default;
import SQLite from "flexsearch/db/sqlite";

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

        // perform a query on cache
        result = index.searchCache({
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

        // perform a query using pluck
        result = index.search({
            query: "karmen or clown or not found",
            suggest: true,
            // set enrich to true (required)
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

        // perform a query on cache
        result = await index.searchCache({
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

        // perform a query using pluck
        result = await index.search({
            query: "karmen or clown or not found",
            suggest: true,
            // set enrich to true (required)
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
            encoder: Charset.LatinBalance,
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
            highlight: `<mark>$1</mark>`,
        });

        expect(search.length).to.equal(1);
        expect(search[0].result.length).to.equal(1);
        expect(search[0].result[0].highlight).to.equal('Publis<mark>h</mark>ed: April 14, 2025 From bold color c<mark>h</mark>oices to intricate patterns, t<mark>h</mark>ere are many ways to make your springtime <mark>h</mark>oliday decorations stand out from t<mark>h</mark>e rest. T<mark>h</mark>e Onion s<mark>h</mark>ares tips for dyeing Easter eggs.');
    });
});
