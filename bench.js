import { text_data } from "https://rawcdn.githack.com/nextapps-de/flexsearch/master/demo/data/gulliver.js";

export let suite = {};
export const test = {};
const result = document.getElementById("result").appendChild(document.createTextNode("running..."));
const match = window.location.hash.indexOf("match") !== -1;
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

let term_length = 0;
for(let i = 0; i < text_data.length; i++){
    term_length += text_data[i].toLowerCase().split(/[^a-z0-9]+/).filter(item => !!item).length;
}

let runs;
let duration;

if(params["duration"] && (params["duration"].indexOf("run-") !== -1)){

    duration = 86400000;
    runs = parseInt(params["duration"].replace("run-", ""), 10);
}
else{

    duration = parseFloat(params["duration"] || "5") * 1000;
}

// if(match){
//
//     text_data.push('zero one two three four five six seven eight nine ten');
//     text_data.push('four two zero one three ten five seven eight six nine');
//     text_data.push('zero one two three four five six seven eight nine ten');
// }

queue.push({
    name: "add",
    init: null,
    test: null,
    start: function(){
        lib.init();
    },
    prepare: null,
    fn: function(){
        lib.add(text_data);
    },
    end: null,
    complete: null,
    cycle: 1,
    count: term_length
});

queue.push({
    name: "update",
    init: function(){
        lib.init();
        lib.add(text_data);
    },
    test: null,
    start: null,
    prepare: null,
    fn: function(){
        lib.add(text_data);
    },
    end: null,
    complete: null,
    cycle: 1,
    count: term_length
});

let _index;

queue.push({
    name: "remove",
    init: null,
    test: null,
    start: function(){
        lib.init();
        lib.add(text_data);
        _index = 0;
    },
    prepare: null,
    fn: function(){
        lib.remove(_index++);
    },
    end: null,
    complete: null,
    cycle: text_data.length,
    count: term_length / text_data.length
});

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
    complete: null,
    count: 10
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
    complete: null,
    count: 11
});

queue.push({
    name: "query-long",
    init: null,
    test: null,
    start: null,
    prepare: null,
    fn: function(){
        //lib.query("there were six spanish pieces of four pistoles");
        //lib.query("glumdalclitch and i attended the king and queen in a progress");
        lib.query("only in this island of luggnagg the appetite for living was not so eager");
    },
    end: null,
    complete: null,
    count: 14
});

queue.push({
    name: "query-dupes",
    init: null,
    test: null,
    start: null,
    prepare: null,
    fn: function(){
        lib.query("gulliver gulliver gulliver");
        lib.query("italians homunceletino italians homunceletino");
    },
    end: null,
    complete: null,
    count: 7
});

queue.push({
    name: "not-found",
    init: null,
    test: null,
    start: null,
    prepare: null,
    fn: function(){
        lib.query("undefined");
        lib.query("undefineda undefinedb undefinedc");
        lib.query("lord high undefined");
    },
    end: null,
    complete: null,
    count: 7
});

// #####################################################################################
// #####################################################################################

window.onload = function(){

    if(queue.length){

        lib = suite[Object.keys(suite)[0]];
        //lib.init();
        //lib.add(text_data);

        setTimeout(match ? perform_match : perform, 200);
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

    return (results.length || results.size) >= 6;
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

async function perform(){

    const test = queue[current];

    if(current === 0) check_test(test) || msg("Main test failed!");

    let status = true;
    let cycle = 1, max_cycle = test.cycle, inner_count = test.count;
    let elapsed = 0, memory = 0;
    let loops = 0, now = 0;
    let start, mem_start, mem;

    if(status){

        if(test.init) test.init();
        const end = perf.now() + duration;
        let start, mem_start, mem;

        while(now < end){

            if(test.start) test.start(loops);

            // -- START ------------------
            mem_start = perf.memory.usedJSHeapSize;
            start = perf.now();
            for(let i = 0; i < cycle; i++) test.fn();
            now = perf.now();
            mem = perf.memory.usedJSHeapSize - mem_start;
            // -- END -------------------

            elapsed += (now - start);
            if(mem > 0) memory += mem;
            if(test.end) test.end(loops);
            loops += cycle;

            cycle = (loops / (elapsed || 1) * (duration - elapsed) * 1.2) | 0;
            if(cycle < 1){
                break;
            }
            if(max_cycle && (cycle > max_cycle)){
                cycle = max_cycle;
            }

            // mem_start = perf.memory.usedJSHeapSize;
            // start = performance.now();
            // for(let i = 0; i < cycle; i++) test.fn();
            // elapsed += (performance.now() - start);
            // mem = perf.memory.usedJSHeapSize - mem_start;
            // loops += cycle;
            // if(mem > 0) memory += mem;
            // if(test.end) test.end(loops);

            // console.log(test.name);
            // console.log("duration", duration);
            // console.log("elapsed", elapsed);
            // console.log("cycle", cycle);
            // console.log("loops", loops);

            //if(cycle ===1) cycle = cycle * (duration / (elapsed || 1)) | 0;

            // console.log("loops", loops, "elapsed", elapsed, "duration", duration, "cycle", (loops / (elapsed || 1) * (duration - elapsed)) | 0);
            //
            // //cycle = (loops / (elapsed || 1) * (duration - elapsed) * 1.2) | 0;
            // //cycle *= loops / (elapsed || 1) * (duration - elapsed) / 2 | 0;
            // cycle *= duration / (elapsed || 1);
            // if(cycle < 1){
            //     break;
            // }
            //
            // //cycle = loops / (elapsed || 1) * (duration - elapsed);
            //
            // if(max_cycle && (cycle > max_cycle)){
            //     cycle = max_cycle;
            // }
            //
            // //console.log(elapsed, duration, cycle)
            // //await new Promise(resolve => setTimeout(resolve, 50));
        }

        if(test.complete) test.complete();
    }

    loops *= inner_count || 1;
    current++;

    if(window === window.top){

        result.nodeValue = (str_results += (status ? test.name.padEnd(12) + String(Math.ceil(1000 / elapsed * loops)).padStart(8) + " op/s, Memory:\t" + (memory ? Math.ceil(memory / loops) : "-") : "- failed -") + "\n") + (current < queue.length ? "running..." : "");
    }
    else{

        window.top.postMessage(test.name + "," + (status ? Math.ceil(1000 / elapsed * loops) : 0) + "," + (status ? Math.ceil(memory / loops) : 0), location.protocol + "//" + location.hostname + ":" + location.port); //"https://nextapps-de.github.io" "https://raw.githack.com"
    }

    if(current < queue.length){

        setTimeout(perform, 200);
    }
    else{

        current = 0;
    }
}

function perform_match(){

    const test = queue[current];
    const query = decodeURI(params["query"]);

    check_test(test) || msg("Main test failed!");

    const res = lib.query(query);

    if(window === window.top){

        result.nodeValue = JSON.stringify(res);
    }
    else{

        window.top.postMessage(JSON.stringify(res), location.protocol + "//" + location.hostname + ":" + location.port);
    }


}
