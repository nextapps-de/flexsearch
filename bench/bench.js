import { text_data } from "./data/gulliver.js"; // , text_queries, text_queries_multi

export let suite = {};
export const test = {};
const result = document.getElementById("result").appendChild(document.createTextNode("running..."));
export const queue = [];
let lib;

const params = (function(){

    const obj = {};
    const pairs = window.location.search.substring(1).split('&');

    for(let i = 0, split; i < pairs.length; i++){
        split = pairs[i].split('=');
        obj[split[0]] = split[1];
    }

    return obj;
}());

// const text_queries_notfound = [
//
//     "undefined1 undefined2 undefined3",
//     "undefined"
// ];

let runs;
let duration;

if(params["duration"] && (params["duration"].indexOf("run-") !== -1)){

    duration = 86400000;
    runs = parseInt(params["duration"].replace("run-", ""), 10);
}
else{

    duration = parseFloat(params["duration"] || "5") * 1000;
}

queue.push({
    name: "query-single",
    init: null,
    test: null,
    start: null,
    prepare: null,
    fn: function(){
        lib.query("gulliver");
        lib.query("great");
        lib.query("country");
        lib.query("time");
        lib.query("people");
        lib.query("little");
        lib.query("master");
        lib.query("took");
        lib.query("feet");
        lib.query("houyhnhnms");
    },
    end: null,
    complete: null
});

queue.push({
    name: "query-multi",
    init: null,
    test: null,
    start: null,
    prepare: null,
    fn: function(){
        lib.query("italians homunceletino");
        lib.query("theodorus vangrult");
        lib.query("virtuous houyhnhnms");
        lib.query("creature discovered");
        lib.query("lord high chancellor");
    },
    end: null,
    complete: null
});

queue.push({
    name: "not-found",
    init: null,
    test: null,
    start: null,
    prepare: null,
    fn: function(){
        lib.query("undefined1 undefined2 undefined3");
        lib.query("undefined");
    },
    end: null,
    complete: null
});

// #####################################################################################
// #####################################################################################

window.onload = function(){

    if(queue.length){

        lib = suite[Object.keys(suite)[0]];
        lib.init();
        lib.add(text_data);

        setTimeout(perform, 200);
    }
};

// #####################################################################################
// #####################################################################################

function check_test(test){

    if(test.init) test.init();
    if(test.start) test.start();
    if(test.prepare) test.prepare();
    test.fn();
    const results = lib.query("gulliver");
    if(test.end) test.end();
    if(test.complete) test.complete();

    //console.log(results);

    return results.length >= 6;
}

function msg(message, a){

    a ? console.error(message, a) : console.error(message);
    return false;
}

// #####################################################################################
// #####################################################################################

let str_results = "";
const perf = window.performance;
      perf.memory || (perf.memory = { usedJSHeapSize: 0 });

let current = 0;

function perform(){

    const test = queue[current];

    if(current === 0) check_test(test) || msg("Main test failed");

    let elapsed = 0, memory = 0;
    let status = true;
    let loops = 0, cycle = 1, now = 0;

    if(status){

        if(test.init) test.init();

        const end = perf.now() + duration;

        for(let start, mem_start, mem; now < end;){

            if(test.start) test.start(loops);

            mem_start = perf.memory.usedJSHeapSize;
            start = perf.now();
            for(let i = 0; i < cycle; i++) test.fn();
            now = perf.now();
            mem = perf.memory.usedJSHeapSize - mem_start;
            elapsed += (now - start);
            loops += cycle;
            if(mem > 0) memory += mem;

            if(test.end) test.end(loops);

            cycle *= duration / (elapsed || 1);
        }

        if(test.complete) test.complete();
    }

    current++;

    if(window === window.top){

        result.nodeValue = (str_results += (status ? test.name.padEnd(12) + String(Math.ceil(1000 / elapsed * loops)).padStart(8) + " op/s, Memory:\t" + (memory ? Math.ceil(memory / loops) : "-") : "- failed -") + "\n") + (current < queue.length ? "running..." : "");
    }
    else{

        window.top.postMessage(test.name + "," + (status ? Math.ceil(1000 / elapsed * loops) : 0) + "," + (status ? Math.ceil(memory / loops) : 0), location.protocol + "//" + location.hostname) //"https://nextapps-de.github.io" "https://raw.githack.com"
    }

    if(current < queue.length){

        setTimeout(perform, 200);
    }
    else{

        current = 0;
    }
}
