import { text_data } from "https://rawcdn.githack.com/nextapps-de/flexsearch/master/demo/data/gulliver.js";

const iframe = document.getElementsByTagName("iframe")[0];
const encode = false;
const lib = encode ? [

    "flexsearch-balance", "flexsearch-default", "flexsearch-fast",
    "flexsearch-match", "flexsearch-memory", "flexsearch-score",
    "flexsearch-speed"
]:[
    /*"flexsearch-0.6.2", "flexsearch-0.6.3",*/
    //"flexsearch-0.7.0-match",
    "flexsearch-0.8.0-match",
    "bm25",
    "elasticlunr",
    "fuzzysearch",
    "js-search",
    "jsii",
    "fuse-match",
    "lunr-match",
    "wade",
    "minisearch-match",
    "orama", // was called "lyra"
    "ufuzzy-match"
];

let promise;

window.onmessage = function(event){

    if(event.origin === location.origin){

        const results = JSON.parse(event.data);
        //console.log(results);
        promise(results);
        promise = null;
    }
};

window.data = text_data;

const tpl_td = document.createElement("td");
      tpl_td.appendChild(document.createTextNode(""))

const root_head = document.getElementsByTagName("thead")[0].firstElementChild,
      root_body = document.getElementsByTagName("tbody")[0];

const tpl_tr = document.createElement("tr");

for(let i = 0; i < lib.length + 1; i++){ // amount of libs + 1 for first row
    tpl_tr.appendChild(tpl_td.cloneNode(true));
}

for(let i = 0; i < 13; i++){ // amount of tests + 1 for first row

    const tr = tpl_tr.cloneNode(true);
          tr.id = "test-" + (i + 1);

    root_body.appendChild(tr);
    root_head.appendChild(tpl_td.cloneNode(true));
}

const headers = root_head.getElementsByTagName("td");

// -----------------------------------------------------------

// strict search, original text: without breach of modesty
await do_test("test-1", "without breach of modesty", [2684]);
// skipped terms, original text: went down softly into the stream
await do_test("test-2", "went softly stream", [2432]);
// swapped terms, original text: is the ambition of princes
await do_test("test-3", "princes of the ambition", [2259, 396]);
// word break insensitive, original text: five thousand leagues
await do_test("test-4", "five-thousand leagues", [7]);
// forward partial match, original text: the bigness disgusted
await do_test("test-5", "disgust the bignes", [946]);
// stemmer, original text: softly raising up
await do_test("test-6", "raise up soft", [2069]);
// simple transformation, original text: bigness of a splacknuck
await do_test("test-7", "bignes of splaknuk", [781]);
// balance transformation, original text: mathematical and musical instruments
await do_test("test-8", "matematikal musikal instruments", [1480]);
// relevance on missing term, original text:
await do_test("test-9", "minerals gums juices vegetables", [2337]); // 1676 does not include "vegetables"
// advanced transformation, original text: Chamberlain
await do_test("test-10", "camperlayhn", [1903,520,535]);
// original text: Houyhnhnms
await do_test("test-11", "hoymns", [2215,2427,2440,2464,2477,2489,2500,2691,2715,2717,2353,2392,2453,2486,2513,2541,2548,23,2177,2204,2455,2680,2020,2484,2528,2640,2211,2447,2478,2514,2709,24,2549,2556,2574,2205,2498,2466,2542,2579,2607,7,2212,2363,2474,2573,2606,21,2674,2443,2551,2660,2684]);
// reverse partial match, original text: fastened my handkerchief
await do_test("test-12", "fast chief", [1275]);

// ---------------------------------------

async function do_test(id, query, ref){

    const nodes = document.getElementById(id).getElementsByTagName("td");
    nodes[0].firstChild.nodeValue = query;

    for(let i = 0, current; i < lib.length; i++){

        current = lib[i]/*.replace("-0.7.0", "")*/.replace("-match", "");
        headers[i + 1].firstChild.nodeValue = current;

        const node = nodes[i + 1];
        const style = node.style;

        node.firstChild.nodeValue = "run ...";

        let results = await new Promise(function(resolve){
            promise = resolve;
            iframe.src = "test/" + lib[i] + "/?query=" + decodeURI(query) + (encode ? "&encode=true" : "") + "#match";
        });

        if(results.length){

            switch(current){

                case "elasticlunr":
                case "lunr":
                    results = results.map(val => val.ref);
                    break;

                case "wade":
                    results = results.map(val => val.index);
                    break;

                case "js-search":
                case "minisearch":
                case "jsii":
                case "bm25":
                    results = results.map(val => val.id);
                    break;

                case "fuzzysearch":
                    results = results.map(val => text_data.indexOf(val));
                    break;
            }
        }

        for(let a = 0; a < ref.length; a++){

            const current = ref[a];

            node.firstChild.nodeValue = results[0] || "-";
            style.color = "#fff";
            style.backgroundColor = "";

            if(((ref.includes(results[a]) /*results[a] === current*/) ||
               (ref.includes(parseInt(results[a], 10)) /*results[a] === ("" + current)*/)) && results.length >= ref.length){
                //if(style.backgroundColor !== "orange"){
                    style.backgroundColor = "#0a0";
               // }
                break;
            }
            else if(!results.length ||
                   ((results.indexOf(current) === -1) &&
                    (results.indexOf(("" + current)) === -1))){

                style.backgroundColor = "#f00";
                break;
            }
            else{

                style.backgroundColor = "orange";
                break;
            }
        }
    }
}
