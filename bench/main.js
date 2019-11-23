(function(){

    "use strict";

    const iframe = document.getElementById("iframe");
    const options = { cache: false, store: false, pool: false };
    const mikado = Mikado(document.getElementById("result"), "row", options);
    const list = Mikado(document.getElementById("lib"), "lib", options);

    const modes = window.location.hash.indexOf("modes") !== -1;
    const encode = window.location.hash.indexOf("encode") !== -1;
    let keep;
    let repeat;
    let index = -1;

    let lib = shuffle(modes || encode ? [

        "flexsearch-balance", "flexsearch-default", "flexsearch-fast",
        "flexsearch-match", "flexsearch-memory", "flexsearch-score",
        "flexsearch-speed"
    ]:[
        "bm25", "bulksearch", "elasticlunr",
        "flexsearch", "flexsearch-0.6.3", "fuse",
        "fuzzysearch", "js-search", "jsii",
        "lunr", "wade"
    ]);

    list.render(lib);

    Mikado.route("start", function(target){

        if(target.value === "Start"){

            index = -1;
            repeat = document.getElementById("repeat").value;
            target.value = "Stop";
            setTimeout(runner, 200);
        }
        else{

            current[index][test[2]] = "";
            target.value = "Start";
            iframe.src = "";
            index = lib.length;
        }

    }).route("mode", function(target){

        init(window.location.hash = "#" + target.value);

    }).listen("click").listen("change");

    const test = encode ? [

        "size", "memory", "encode"
    ]:[
        "size", "memory",
        "add", "query-single",
        "query-multi", "not-found"
    ];

    const current = new Array(lib.length);

    let size = {

        "bm25": 1,
        "bulksearch": 1,
        "elasticlunr": 1,
        "flexsearch": 1,
        "flexsearch-0.6.3": 1,
        "fuse": 1,
        "fuzzysearch": 1,
        "js-search": 1,
        "jsii": 1,
        "lunr": 1,
        "wade": 1,

        "flexsearch-balance": 3.0,
        "flexsearch-default": 3.0,
        "flexsearch-fast": 3.0,
        "flexsearch-match": 3.0,
        "flexsearch-memory": 3.0,
        "flexsearch-score": 3.0,
        "flexsearch-speed": 3.0
    };

    for(let x = 0; x < lib.length; x++){

        current[x] = {

            "name": lib[x],
            "size": size[lib[x]],
            "memory": 0,
            "score": "",
            "index": ""
        };

        for(let y = 2; y < test.length + 1; y++){

            current[x][test[y]] = "";
            current[x]["color_" + test[y]] = "transparent";
        }
    }

    mikado.render(current);

    function runner(){

        const duration = document.getElementById("duration").value;
        keep = document.getElementById("keep").checked;

        index++;
        const tmp = Object.assign({}, current[index]);
        tmp[test[2]] = "run...";
        mikado.update(mikado.node(index), tmp);
        iframe.src = "test/" + lib[index].toLowerCase() + "/" + "?duration=" + duration + (encode ? "&encode=true" : "");
    }

    function get_score(){

        let max = new Array(test.length);
        let val = new Array(test.length);

        for(let y = 0; y < test.length; y++){

            max[y] = 0;
            val[y] = [];

            for(let x = 0; x < lib.length; x++){

                if(current[x][test[y]] && (current[x][test[y]] !== "-failed-")){

                    if(current[x][test[y]]){

                        val[y].push(current[x][test[y]]);
                    }

                    if((test[y] === "size") || (test[y] === "memory")){

                        if((current[x][test[y]] < max[y]) || !max[y]){

                            max[y] = current[x][test[y]];
                        }
                    }
                    else{

                        if(current[x][test[y]] > max[y]){

                            max[y] = current[x][test[y]];
                        }
                    }
                }
            }
        }

        let score = new Array(lib.length);
        let index = new Array(lib.length);
        let length = new Array(lib.length);
        let max_score = 0, max_index = 0;

        for(let x = 0; x < lib.length; x++){

            score[x] = 0;
            index[x] = 0;
            length[x] = 0;

            for(let y = 0; y < test.length; y++){

                if(current[x][test[y]] && (current[x][test[y]] !== "-failed-")){

                    length[x]++;

                    if((test[y] === "size") || (test[y] === "memory")){

                        score[x] += Math.sqrt(median(val[y]) / current[x][test[y]]);
                        index[x] += Math.sqrt(max[y] / current[x][test[y]]);
                        current[x]["color_" + test[y]] = color(Math.sqrt(max[y]), Math.sqrt(current[x][test[y]]));
                    }
                    else{

                        score[x] += current[x][test[y]] / median(val[y]);
                        index[x] += current[x][test[y]] / max[y];
                        current[x]["color_" + test[y]] = color(current[x][test[y]], max[y]);
                    }
                }
                else{

                    current[x]["color_" + test[y]] = "#ccc";
                }
            }

            current[x]["score"] = (score[x] / length[x] * 1000 + 0.5) | 0;
            current[x]["index"] = (index[x] / length[x] * 1000 + 0.5) | 0;
            if(max_score < current[x]["score"]) max_score = current[x]["score"];
            if(max_index < current[x]["index"]) max_index = current[x]["index"];
        }

        for(let x = 0; x < lib.length; x++){

            current[x]["color_score"] = color(current[x]["score"], max_score);
            current[x]["color_index"] = color(current[x]["index"], max_index);
        }
    }

    function color(current, max){

        const percent = current / max * 100;
        const r = percent < 50 ? 255 : (255 - (percent * 2 - 100) * 255 / 100) | 0;
        const g = percent > 50 ? 255 : ((percent * 2) * 255 / 100) | 0;

        return 'rgb(' + r + ', ' + g + ', 0)';
    }

    window.onmessage = function(event){

        if(index < lib.length){

            if(event.origin === location.protocol + "//" + location.hostname){ // "https://nextapps-de.github.io" "https://raw.githack.com"

                //console.log(event.data);

                const parts = event.data.split(",");

                let tmp = parseInt(parts[1], 10);

                if(keep){

                    if(!current[index][parts[0]] || (tmp > current[index][parts[0]])){

                        current[index][parts[0]] = tmp;
                    }
                }
                else{

                    if(current[index][parts[0]]){

                        current[index][parts[0]] += tmp;
                    }
                    else{

                        current[index][parts[0]] = tmp;
                    }
                }

                tmp = parseInt(parts[2], 10);

                if(current[index]["memory"]){

                    current[index]["memory"] += tmp;
                }
                else{

                    current[index]["memory"] = tmp;
                }

                if((repeat === 1) && (!current[index][parts[0]])){

                    current[index][parts[0]] = "-failed-";
                }

                if(parts[0] === "not-found"){

                    if(index < lib.length - 1){

                        mikado.update(index, current[index]);
                        setTimeout(runner, 50);
                    }
                    else{

                        get_score();

                        current.sort(function(a, b){

                            return b["score"] - a["score"];
                        });

                        for(let i = 0; i < lib.length; i++){

                            lib[i] = current[i]["name"];
                        }

                        mikado.render(current);

                        if(--repeat > 0){

                            index = -1;
                            setTimeout(runner, 50);
                        }
                        else{

                            Mikado.dispatch("start", document.getElementById("start"));
                        }
                    }
                }
                else{

                    const tmp = Object.assign({}, current[index]);
                    tmp[test[test.indexOf(parts[0]) + 1]] = "run...";
                    mikado.update(index, tmp);
                }
            }
        }
    };

    function shuffle(items){

        for(let i = items.length - 1, j, x; i > 0; i--) {

            j = (Math.random() * i) | 0;
            x = items[i];
            items[i] = items[j];
            items[j] = x;
        }

        return items;
    }

    function median(arr){

        arr.sort(function(a, b){

            return a - b;
        });

        const length = arr.length;
        const half = length / 2;

        return (

            length % 2 ?

                arr[half | 0]
            :
                (arr[half - 1] + arr[half]) / 2
        );
    }

}());