import { text_data } from "../demo/data/gulliver.js";

const iframe = document.getElementsByTagName("iframe")[0];
const encode = false;
const lib = encode ? [

    "flexsearch-balance", "flexsearch-default", "flexsearch-fast",
    "flexsearch-match", "flexsearch-memory", "flexsearch-score",
    "flexsearch-speed"
]:[
    /*"flexsearch-0.6.2", "flexsearch-0.6.3",*/ "flexsearch-0.7.0-match",
    "bm25", "bulksearch-match", "elasticlunr",
    "fuzzysearch", "js-search", "jsii",
    "minisearch-match", "fuse-match", "lunr", "wade", "lyra"
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

window.data = text_data;

const tpl_td = document.createElement("td");
      tpl_td.appendChild(document.createTextNode(""))

const root_head = document.getElementsByTagName("thead")[0].firstElementChild,
      root_body = document.getElementsByTagName("tbody")[0];

const tpl_tr = document.createElement("tr");

for(let i = 0; i < lib.length + 1; i++){ // amount of libs + 1 for first row

    tpl_tr.appendChild(tpl_td.cloneNode(true));
}

for(let i = 0; i < 12; i++){ // amount of tests + 1 for first row

    const tr = tpl_tr.cloneNode(true);
          tr.id = "test-" + (i + 1);

    root_body.appendChild(tr);
    root_head.appendChild(tpl_td.cloneNode(true));
}

const headers = root_head.getElementsByTagName("td");

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

// ---------------------------------------

async function do_test(id, query, ref){

    const nodes = document.getElementById(id).getElementsByTagName("td");
    nodes[0].firstChild.nodeValue = query;

    for(let i = 0, current; i < lib.length; i++){

        current = lib[i].replace("-0.7.0", "").replace("-match", "");
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
