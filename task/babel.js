const child_process = require("child_process");
const fs = require("fs");
const debug = process.argv[2] && process.argv[2].toLowerCase().includes("debug=true");
const minify = process.argv[2] && process.argv[2].toLowerCase().includes("release=min");

console.log("Start build .....");
console.log('Bundle: ' + ('module' /* 'custom' */) + (debug ?  ":debug" : (minify ?  ":min" : "")));

fs.existsSync("tmp") && fs.rmSync("tmp/", { recursive: true });
fs.mkdirSync("tmp");
fs.existsSync("dist") || fs.mkdirSync("dist");

(async function(){

    let files = await fs.promises.readdir("./src/");
    files.forEach(function(file){
        if(file.endsWith(".js")){
            let src = fs.readFileSync("src/" + file, "utf8");
            src = src.replace(/\/\/ COMPILER BLOCK -->(.*)<-- COMPILER BLOCK/gs, "");
            if(file === "worker.js"){
                // add the eval wrapper #1
                src = src.replace("import.meta.url", '(1,eval)("import.meta.url")');
                // add the eval wrapper #2
                src = src.replace(
                    /[: ]+import\("worker_threads"\)[^}]+}\)/g,
                    `: (0,eval)('import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)(\\"import.meta.dirname\\")+"/worker/node.mjs")})')`
                );
            }
            let tmp;
            while(tmp !== src){
                tmp = src;
                // remove comments, keep annotations
                src = src.replace(/[^:]\/\/(.*)(\r\n|\r|\n|$)/g, "$2");
                src = src.replace(/^\/\/(.*)(\r\n|\r|\n|$)/g, "$2");
                src = src.replace(/\/\*[^*](.*)\*\//g, "");
            }
            fs.writeFileSync("tmp/" + file, src);
        }
    });

    fs.existsSync("./tmp/db") || fs.mkdirSync("./tmp/db/");
    fs.existsSync("./tmp/lang") || fs.mkdirSync("./tmp/lang/");
    fs.existsSync("./tmp/charset") || fs.mkdirSync("./tmp/charset/");

    const dirs = [
        "db/",
        "db/clickhouse",
        "db/indexeddb",
        "db/mongodb",
        "db/postgres",
        "db/redis",
        "db/sqlite",
        "document",
        "index",
        "resolve",
        "worker",
        "lang",
        "charset/",
        "charset/latin"
    ];

    for(let i = 0, path; i < dirs.length; i++){
        path = dirs[i];
        fs.existsSync("./tmp/" + path + "/") || fs.mkdirSync("./tmp/" + path + "/");
        files = await fs.promises.readdir("./src/" + path + "/");
        files.forEach(function(file){
            if(file.endsWith(".old.js")) return;
            if(file.endsWith(".wip.js")) return;
            if(file.endsWith(".js")){
                let src = fs.readFileSync("src/" + path + "/" + file, "utf8");
                src = src.replace(/\/\/ COMPILER BLOCK -->(.*)<-- COMPILER BLOCK/gs, "");
                if(path.startsWith("db/")){
                    src = src.replace(/import \{[^}]+} from "\.\.\/(\.\.\/)?type\.js";/, '');
                }
                if(file === "handler.js"){
                    // add the eval wrapper
                    src = src.replace('options=(await import(filepath))["default"];', '//options=(await import(filepath))["default"];');
                }
                let tmp;
                while(tmp !== src){
                    tmp = src;
                    // remove comments, keep annotations
                    src = src.replace(/[^:]\/\/(.*)(\r\n|\r|\n|$)/g, "$2");
                    src = src.replace(/^\/\/(.*)(\r\n|\r|\n|$)/g, "$2");
                    src = src.replace(/\/\*[^*](.*)\*\//g, "");
                }
                fs.writeFileSync("tmp/" + path + "/" + file, src);
            }
        });
    }

    //fs.copyFileSync("src/db/interface.js", "tmp/db/interface.js");
    fs.copyFileSync("task/babel." + (debug ? "debug": (minify ? "min" : "bundle")) + ".json", "tmp/.babelrc");
    fs.existsSync("dist/module" + (debug ? "-debug" : (minify ? "-min" : ""))) && fs.rmSync("dist/module" + (debug ? "-debug" : (minify ? "-min" : "")), { recursive: true });
    fs.mkdirSync("dist/module" + (debug ? "-debug" : (minify ? "-min" : "")));

    exec("npx babel tmp -d dist/module" + (debug ? "-debug" : (minify ? "-min --minified --compact true" : "")) + " --config-file tmp/.babelrc && exit 0", function(){
        console.log("Build Complete.");

        // fix babel compiler dynamic import
        let content = fs.readFileSync("dist/module" + (debug ? "-debug" : (minify ? "-min" : "")) + "/worker/handler.js", "utf8");
        content = content.replace('//options=(await import(filepath))["default"];', 'options=(await import(filepath))["default"];');
        fs.writeFileSync("dist/module" + (debug ? "-debug" : (minify ? "-min" : "")) + "/worker/handler.js", content);

        // fix babel compiler dynamic import
        content = fs.readFileSync("dist/module" + (debug ? "-debug" : (minify ? "-min" : "")) + "/worker.js", "utf8");
        // replace the eval wrapper
        content = content.replace(/\(0, eval\)/g, "(0,eval)");
        content = content.replace(
            `(0,eval)('import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)(\\"import.meta.dirname\\")+"/worker/node.mjs")})')`,
            `import("worker_threads").then(function(worker){return new worker["Worker"](import.meta.dirname+"/../node/node.mjs")})`
        );
        content = content.replace(
            `(0,eval)("import(\\"worker_threads\\").then(function(worker){return new worker[\\"Worker\\"]((1,eval)(\\"import.meta.dirname\\")+\\"/worker/node.mjs\\")})")`,
            `import("worker_threads").then(function(worker){return new worker["Worker"](import.meta.dirname+"/../node/node.mjs")})`
        );
        content = content.replace(
            `(0,eval)("new(require(\\"worker_threads\\")[\\"Worker\\"])(__dirname+\\"/worker/node.js\\")")`,
            `new(require("worker_threads")["Worker"])(__dirname+"/worker/node.js")`
        );
        //content = content.replace(/\(1,eval\)\('([^']+)'\)/g, "import.meta.dirname");
        content = content.replace('(1,eval)("import.meta.url")', 'import.meta.url');
        content = content.replace('(1,eval)("import.meta.url")', 'import.meta.url');
        content = content.replace('(0,eval)("import.meta.url")', 'import.meta.url');
        content = content.replace('(0,eval)("import.meta.url")', 'import.meta.url');
        content = content.replace('(1,eval)("import.meta.dirname")', 'import.meta.dirname');
        fs.writeFileSync("dist/module" + (debug ? "-debug" : (minify ? "-min" : "")) + "/worker.js", content);
    });
}());

function exec(prompt, callback){

    const child = child_process.exec(prompt, function(err, stdout, stderr){
        if(err){
            console.error(err);
        }
        else{
            callback && callback();
        }
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
}
