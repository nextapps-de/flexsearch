import { text_data as data } from "../demo/data/gulliver.js";

const headers = document.getElementsByTagName("th");
const iframe = document.getElementsByTagName("iframe")[0];
const encode = false;
const lib = encode ? [

    "flexsearch-balance", "flexsearch-default", "flexsearch-fast",
    "flexsearch-match", "flexsearch-memory", "flexsearch-score",
    "flexsearch-speed"
]:[
    /*"flexsearch-0.6.2", "flexsearch-0.6.3",*/ "flexsearch-0.7.0-match",
    "bm25", "bulksearch", "elasticlunr",
    "fuzzysearch", "js-search", "jsii",
    "fuse", "lunr", "wade"
];

let promise;

window.onmessage = function(event){

    if(event.origin === location.protocol + "//" + location.hostname){

        const results = JSON.parse(event.data);
        //console.log(results);
        promise(results);
        promise = null;
    }
};

window.data = data;

//iframe.src = "test/" + lib[0].toLowerCase() + "/?query=gulliver" + (encode ? "&encode=true" : "") + "#match";

// -----------------------------------------------------------

await do_test("test-1", "without breach of modesty", [2684]);
await do_test("test-2", "went softly stream", [2432]);
await do_test("test-3", "princes of the ambition", [2259, 396]);
await do_test("test-4", "five-thousand leagues", [7]);
await do_test("test-5", "raise up soft", [2069]);
await do_test("test-6", "disgust the bigness", [946]);
await do_test("test-7", "bignes of splaknuk", [781]);
await do_test("test-8", "matematikal musikal instruments", [1480]);
await do_test("test-9", "composition of minerals gums juices vegetables", [1676, 2337]);
await do_test("test-10", "general camberlayhn", [520]);
await do_test("test-11", "the end defeat", [2209]);
await do_test("test-12", "fast chief", [1275]);
await do_test("test-13", "zero one three ten", [2721, 2720, 2722]);

// ---------------------------------------

async function do_test(id, query, ref){

    const nodes = document.getElementById(id).getElementsByTagName("td");
    nodes[0].firstChild.nodeValue = query;

    for(let i = 0, current; i < lib.length; i++){

        current = lib[i];
        headers[i + 1].firstChild.nodeValue = current.replace("-0.7.0-match", "");

        let results = await new Promise(function(resolve){

            promise = resolve;
            iframe.src = "test/" + (id === "test-13" && current === "flexsearch-0.7.0-match" ? "flexsearch-0.7.0-context" : current) +
                         "/?query=" + decodeURI(query) + (encode ? "&encode=true" : "") + "#match";
        });

        if(results.length){

            switch(current){

                // case "flexsearch":
                //     break;
                //
                // case "bulksearch":
                //     break;
                //
                // case "fuse":
                //     break;

                case "elasticlunr":
                    results = results.map(val => val.ref);
                    break;

                case "lunr":
                    results = results.map(val => val.ref);
                    break;

                case "wade":
                    results = results.map(val => val.index);
                    break;

                case "js-search":
                    results = results.map(val => val.id);
                    break;

                case "jsii":
                    results = results.map(val => val.id);
                    break;

                case "bm25":
                    results = results.map(val => val.id);
                    break;

                case "fuzzysearch":
                    results = results.map(val => data.indexOf(val));
                    break;
            }
        }

        const node = nodes[lib.indexOf(current) + 1];
        const style = node.style;

        for(let a = 0; a < ref.length; a++){

            const current = ref[a];

            node.firstChild.nodeValue = results[0] || "-";
            style.color = "#fff";
            style.backgroundColor = "";


            if((results[a] === current) ||
               (results[a] === ("" + current))){

                if(style.backgroundColor !== "orange"){

                    style.backgroundColor = "#0a0";
                }
            }
            else if(!results.length ||
                   ((results.indexOf(current) === -1) &&
                    (results.indexOf(("" + current)) === -1))){

                style.backgroundColor = "#f00";
                break;
            }
            else{

                style.backgroundColor = "orange";
            }
        }
    }
}
