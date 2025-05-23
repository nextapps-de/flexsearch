const child_process = require("child_process");
const fs = require("fs");

console.log("Start build .....");

fs.existsSync("tmp") && fs.rmSync("tmp/", { recursive: true });
fs.mkdirSync("tmp");
fs.existsSync("dist") || fs.mkdirSync("dist");

let supported_lang = [
    'en',
    'de',
    'fr'
];

let supported_charset = {
    'latin': ["exact", "default", "simple", "balance", "advanced", "extra", "soundex"],
    'cjk': ["default"],
    'cyrillic': ["default"],
    'arabic': ["default"],
};

let flag_str = "";
let language_out;
let use_polyfill;
let formatting;
let compilation_level;

let options = (function(argv){

    const arr = {};
    let count = 0;

    argv.forEach(function(val, index) {

        if(++count > 2){

            index = val.split("=");
            val = index[1];
            index = index[0].toUpperCase();

            if(index === "LANGUAGE_OUT"){

                language_out = val;
            }
            else if(index === "POLYFILL"){

                use_polyfill = val !== "false";
            }
            else{

                if(val === "false") val = false;
                arr[index] = val;
            }
        }
    });

    console.log('Release: ' + (arr['RELEASE'] || 'custom') + (arr['DEBUG'] ?  ":debug" : ""));

    return arr;

})(process.argv);

let release = options["RELEASE"].toLowerCase();
const light_version = (release === "light") || (process.argv[2] === "--light");
const es5_version = (release === "es5") || (process.argv[2] === "--es5");
const module_version = (release === "module") || (process.argv[2] === "--module");

let parameter = (function(opt){

    let parameter = '';

    for(let index in opt){

        if(opt.hasOwnProperty(index)){

            //if(release !== "lang"){
                parameter += ' --' + index + '=' + opt[index];
            //}
        }
    }

    return parameter;
})({

    compilation_level: release === "bundle.profiler" ? "SIMPLE" : "ADVANCED", //"WHITESPACE"
    use_types_for_optimization: true,
    generate_exports: true,
    export_local_property_definitions: true,
    //language_in: "ECMASCRIPT_2017",
    language_out: language_out || "ECMASCRIPT_2020",
    process_closure_primitives: true,
    summary_detail_level: 3,
    warning_level: "VERBOSE",
    //emit_use_strict: true, // release !== "lang",,
    strict_mode_input: true,
    //assume_function_wrapper: true,

    //transform_amd_modules: true,
    process_common_js_modules: false,
    module_resolution: "BROWSER",
    //dependency_mode: "SORT_ONLY",
    //js_module_root: "./",
    entry_point: release === "lang" ? "./tmp/lang.js" : "./tmp/bundle.js",
    //manage_closure_dependencies: true,
    dependency_mode: "PRUNE", // PRUNE_LEGACY
    rewrite_polyfills: use_polyfill || false,

    //isolation_mode: "IIFE",
    //output_wrapper: /*release === "lang" ? "%output%" :*/ "\"(function(self){%output%}(this));\""
    //formatting: "PRETTY_PRINT"
});

if(options["DEBUG"]){
    parameter += ' --formatting=PRETTY_PRINT';
}

if(!release.endsWith(".module") || release === "lang"){
    //parameter += ' --isolation_mode=IIFE';
    parameter += ' --output_wrapper=\"(function(self){%output%}(this||self));\"';
    parameter += ' --emit_use_strict=true';
}

const custom = (!release || release.startsWith("custom"))
    && hashCode(parameter + flag_str + JSON.stringify(options)).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

if(custom){
    release || (options["RELEASE"] = release = "custom");
}

if(release === "custom"){
    if(typeof options["DEBUG"] === "undefined"){
        options["DEBUG"] = false;
    }
    if(typeof options["PROFILER"] === "undefined"){
        options["PROFILER"] = false;
    }
    if(typeof options["POLYFILL"] === "undefined"){
        options["POLYFILL"] = false;
    }
}

if(release === "lang"){

    //const charsets = Object.keys(supported_charset);

    //fs.existsSync("tmp/lang/") || fs.mkdirSync("tmp/lang/");
    fs.cpSync("src/", "tmp/", { recursive: true });
    fs.copyFileSync("src/db/interface.js", "tmp/db/interface.js");

    // add the eval wrapper
    let content = fs.readFileSync("tmp/worker/handler.js", "utf8");
    content = content.replace('options = (await import(filepath))["default"];', '//options = (await import(filepath))["default"];');
    fs.writeFileSync("tmp/worker/handler.js", content);

    // add the eval wrapper
    content = fs.readFileSync("tmp/worker.js", "utf8");
    content = content.replace("import.meta.url", '(1,eval)("import.meta.url")');
    fs.writeFileSync("tmp/worker.js", content);

    (function next(x, y, z){

        if(x < supported_lang.length){

            (function(lang){

                //fs.copyFileSync("src/lang/" + lang + ".js", "tmp/lang/" + lang + ".js");
                //console.log(lang)

                content = fs.readFileSync("tmp/type.js", "utf8");
                content = content.replace('import Index from "./index.js";', '')
                                 .replace('import WorkerIndex from "./worker.js";', '')
                                 .replace('import Document from "./document.js";', '')
                                 .replace('import Encoder from "./encoder.js";', '')
                                 .replace('import StorageInterface from "./db/interface.js";', '');
                fs.writeFileSync("tmp/type.js", content);

                fs.writeFileSync("tmp/lang.js", `
                    import { EncoderOptions, EncoderSplitOptions } from "./type.js";
                    import lang from "./lang/${lang}.js";
                    /** @export */ EncoderOptions.rtl;
                    /** @export */ EncoderOptions.dedupe;
                    /** @export */ EncoderOptions.split;
                    /** @export */ EncoderOptions.include;
                    /** @export */ EncoderOptions.exclude;
                    /** @export */ EncoderOptions.prepare;
                    /** @export */ EncoderOptions.finalize;
                    /** @export */ EncoderOptions.filter;
                    /** @export */ EncoderOptions.matcher;
                    /** @export */ EncoderOptions.mapper;
                    /** @export */ EncoderOptions.stemmer;
                    /** @export */ EncoderOptions.replacer;
                    /** @export */ EncoderOptions.minlength;
                    /** @export */ EncoderOptions.maxlength;
                    /** @export */ EncoderOptions.cache;
                    /** @export */ EncoderSplitOptions.letter;
                    /** @export */ EncoderSplitOptions.number;
                    /** @export */ EncoderSplitOptions.symbol;
                    /** @export */ EncoderSplitOptions.punctuation;
                    /** @export */ EncoderSplitOptions.control;
                    /** @export */ EncoderSplitOptions.char;
                    if(typeof module !== "undefined" && module["exports"]) module["exports"] = lang;
                    else if(self["FlexSearch"]) self["FlexSearch"]["Language"]['${lang}'] = lang;
                `);

                const executable = process.platform === "win32" ?  "\"node_modules/google-closure-compiler-windows/compiler.exe\"" :
                                   process.platform === "darwin" ? "\"node_modules/google-closure-compiler-osx/compiler\"" :
                                                                   "java -jar node_modules/google-closure-compiler-java/compiler.jar";

                exec(executable + parameter + " --js='tmp/lang.js' --js='tmp/lang/*.js' --js='tmp/type.js'" + flag_str + " --js_output_file='dist/lang/" + lang + ".min.js' && exit 0", function(){

                    console.log("Build Complete: " + lang + ".min.js");
                    next(++x, y, z);
                });

            })(supported_lang[x]);
        }
        // else if(y < charsets.length){
        //
        //     const charset = charsets[y];
        //     const variants = supported_charset[charset];
        //
        //     if(z < variants.length){
        //
        //         (function(charset, variant){
        //
        //             fs.writeFileSync("tmp/" + charset + "_" + variant + ".js", `
        //                 import charset from "../src/lang/${charset}/${variant}.js";
        //                 /*try{if(module)self=module}catch(e){}*/
        //                 self["FlexSearch"]["registerCharset"]("${charset}:${variant}", charset);
        //             `);
        //
        //             exec("java -jar node_modules/google-closure-compiler-java/compiler.jar" + parameter + " --entry_point='tmp/" + charset + "_" + variant + ".js' --js='tmp/" + charset + "_" + variant + ".js' --js='src/**.js'" + flag_str + " --js_output_file='dist/lang/" + charset + "/" + variant + ".min.js' && exit 0", function(){
        //
        //                 console.log("Build Complete: " + charset + "/" + variant + ".min.js");
        //                 next(x, y, ++z);
        //             });
        //
        //         })(charset, variants[z]);
        //     }
        //     else{
        //
        //         next(x, ++y, 0);
        //     }
        // }

    }(0, 0, 0));
}
else (async function(){

    const files = await fs.promises.readdir("./src/");

    // const files = [
    //     "async.js",
    //     "cache.js",
    //     "common.js",
    //     "compress.js",
    //     "config.js",
    //     "document.js",
    //     "encoder.js",
    //     "engine.js",
    //     "global.js",
    //     "index.js",
    //     "intersect.js",
    //     "keystore.js",
    //     "lang.js",
    //     "polyfill.js",
    //     "preset.js",
    //     "resolver.js",
    //     "serialize.js",
    //     "type.js",
    //     "bundle.js"
    // ];

    files.forEach(function(file){

        if(file === "config.js"){

            let src = String(fs.readFileSync("src/" + file));

            if(custom){

                let defaults = src.split(/export const /);
                defaults.unshift();
                defaults = defaults.filter(str => /^(SUPPORT|RELEASE)/.test(str)).map(str => str.replace(/=[\s\S]+/, "").trim());

                for(let i = 0, opt; i < defaults.length; i++){

                    opt = defaults[i];
                    options[opt] = typeof options[opt] === "undefined" ? false : options[opt];
                }
            }

            for(let opt in options){

                src = src.replace(new RegExp('(export const ' + opt + ' = )(")?[^";]+(")?;'), "$1$2" + options[opt] + "$3;");
            }

            fs.writeFileSync("tmp/" + file, src);
        }
        else{

            if(file.endsWith(".js")){
                if(language_out === "ECMASCRIPT5_STRICT" && file === "keystore.js"){

                    let content = fs.readFileSync("src/" + file, "utf8");
                    content = content.substring(0, content.indexOf("function lcg64"));
                    content += "function lcg64(str){ throw new Error('The keystore is limited to 32 for EcmaScript5'); }";
                    fs.writeFileSync("tmp/keystore.js",
                        content
                        // "/** @constructor */ export function KeystoreMap(arg){};" +
                        // "/** @constructor */ export function KeystoreSet(arg){};" +
                        // "/** @constructor */ export function KeystoreArray(arg){}; KeystoreArray.prototype.push = function(arg){};"
                    );
                }
                else if(file === "worker.js"){

                    let content = fs.readFileSync("src/" + file, "utf8");
                    // add the eval wrapper #1
                    content = content.replace("import.meta.url", '(1,eval)("import.meta.url")');
                    // add the eval wrapper #2
                    content = content.replace(
                        /[: ]+import\("worker_threads"\)[^}]+}\)/g,
                        `: (0,eval)('import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)(\\"import.meta.dirname\\")+"/node/node.mjs")})')`
                    );
                    fs.writeFileSync("tmp/worker.js", content)
                }
                else{

                    fs.copyFileSync("src/" + file, "tmp/" + file);
                }
            }
        }
    });

    fs.existsSync("tmp/db/") || fs.mkdirSync("tmp/db/");
    fs.cpSync("src/lang/", "tmp/lang/", { recursive: true });
    fs.cpSync("src/worker/", "tmp/worker/", { recursive: true });
    fs.cpSync("src/db/indexeddb/", "tmp/db/indexeddb/", { recursive: true });
    fs.copyFileSync("src/db/interface.js", "tmp/db/interface.js");
    fs.cpSync("src/index/", "tmp/index/", { recursive: true });
    fs.cpSync("src/document/", "tmp/document/", { recursive: true });
    fs.cpSync("src/resolve/", "tmp/resolve/", { recursive: true });
    fs.cpSync("src/charset/", "tmp/charset/", { recursive: true });

    // add the eval wrapper
    let content = fs.readFileSync("tmp/worker/handler.js", "utf8");
    content = content.replace('options=(await import(filepath))["default"];', '//options=(await import(filepath))["default"];');
    fs.writeFileSync("tmp/worker/handler.js", content);

    const filename = "dist/flexsearch." + (release + (custom ? "." + custom : "")) + (options["DEBUG"] ?  ".debug" : ".min") + ".js";
    const executable = process.platform === "win32" ?  "\"node_modules/google-closure-compiler-windows/compiler.exe\"" :
                       process.platform === "darwin" ? "\"node_modules/google-closure-compiler-osx/compiler\"" :
                                                       "java -jar node_modules/google-closure-compiler-java/compiler.jar";

    exec(executable + parameter + " --js='tmp/**.js' --js='!tmp/**/node.js' --js='!tmp/**/node.mjs'" + flag_str + " --js_output_file='" + filename + "' && exit 0", function(){

        let build = fs.readFileSync(filename);
        let preserve = fs.readFileSync("src/index.js", "utf8");

        const package_json = require("../package.json");

        let name = (
            custom ? release.replace("custom.", "Custom/") :
            light_version ? "Light" + (release === "light.module" ? "/Module" : "") :
            es5_version ? "ES5" : "Bundle" + (release === "bundle.module" ? "/Module" : "")
        );

        if(custom) name += "/" + custom;
        if(options["DEBUG"]) name += "/Debug";

        preserve = preserve.replace("* FlexSearch.js", "* FlexSearch.js v" + package_json.version + " (" + name + ")" );
        build = preserve.substring(0, preserve.indexOf('*/') + 2) + "\n" + build;


        if(release === "bundle.module" ||
           release === "light.module" ||
           release === "compact.module" ||
           release === "custom.module"){

            // export default {
            //     Index: O,
            //     Encoder: H,
            //     Charset: M,
            //     Language: ma,
            //     Document: Y,
            //     Worker: W,
            //     Resolver: null,
            //     IndexedDB: null
            // };

            const pos_start = build.indexOf("window.FlexSearch");
            const pos_end = build.indexOf("};", pos_start) + 2;

            let part = build.substring(build.indexOf("{", pos_start) + 1, pos_end - 2);
            part = part.split(",");
            part = part.map(entry => "export const " + entry.replace(":", "="));
            part = part.join(";") + ";";

            // part = "export const Index=FlexSearch.Index;" +
            //        "export const Charset=FlexSearch.Charset;" +
            //        "export const Encoder=FlexSearch.Encoder;" +
            //        "export const Document=FlexSearch.Document;" +
            //        "export const Worker=FlexSearch.Worker;" +
            //        "export const Resolver=FlexSearch.Resolver;" +
            //        "export const IndexedDB=FlexSearch.IndexedDB;" +
            //        "export const Language={};";
            // part = "export default FlexSearch;" + part;

            //console.log(build.substring(pos_start - 50, pos_start) + part + build.substring(pos_end))

            //build = build.substring(0, pos_start) + part + build.substring(pos_end);
            build = build.replace(/window\.FlexSearch(\s+)?=(\s+)?/, "export default ") + part;
            //build = build.replace(/self\.FlexSearch(\s+)?=(\s+)?/, "export default ");

            // replace the eval wrapper
            build = build.replace(/\(1,eval\)\('([^']+)'\)/g, "import.meta.dirname");
            build = build.replace('(0,eval)("import.meta.url")', 'import.meta.url');
            build = build.replace('(1,eval)("import.meta.url")', 'import.meta.url');
            build = build.replace('(1,eval)("import.meta.dirname")', 'import.meta.dirname');
            build = build.replace(
                `: (0,eval)('import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)(\\"import.meta.dirname\\")+"/node/node.mjs")})')`,
                `: import("worker_threads").then(function(worker){return new worker["Worker"](import.meta.dirname+"/node/node.mjs")})`

            );
            //build = build.replace(/\(function\(self\)\{/, "const FlexSearch=(function(self){");
        }
        else{

            // add the eval wrapper #3
            build = build.replace(
                `(0,eval)('new(require("worker_threads")["Worker"])(__dirname+"/worker/node.js")')`,
                `new(require("worker_threads")["Worker"])(__dirname+"/node/node.js")`
            );
        }

        // fix closure compiler dynamic import
        build = build.replace(/\(([a-z])=([a-z]).config\)&&\(([a-z])=([a-z])\)/, "($1=$2.config)&&($3=(await import($4))[\"default\"])");

        if(options["SUPPORT_WORKER"]){
            build = build.replace("(function(self){'use strict';", "(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;");
            //build = build.replace("(function(self){", "(function _f(self){if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;");
        }

        // replace the eval wrapper
        build = build.replace(/\(0,eval\)\('([^']+)'\)/g, "$1");

        if(build.includes("console.log")) console.warn("\n!!! Console was used in build !!!\n");

        fs.writeFileSync(filename, build);
        fs.existsSync("dist/node/") || fs.mkdirSync("dist/node/");
        fs.copyFileSync("src/worker/node.js", "dist/node/node.js");
        fs.copyFileSync("src/worker/node.mjs", "dist/node/node.mjs");

        console.log("Saved to " + filename);
        console.log("Build Complete.");
    });
}());

// function hashCode(str) {
//
//     let hash = 0, i, chr;
//
//     if(str.length === 0){
//
//         return hash;
//     }
//
//     for(i = 0; i < str.length; i++){
//
//         chr = str.charCodeAt(i);
//         hash = (hash << 5) - hash + chr;
//     }
//
//     hash = Math.abs(hash) >> 0;
//
//     return hash.toString(16).substring(0, 5);
// }

function hashCode(str) {
    console.log(str)
    let range = 2 ** 16 - 1;
    let crc = 0, bit = 16 + 1;
    for(let i = 0; i < str.length; i++) {
        crc = (crc * bit ^ str.charCodeAt(i)) & range;
    }
    return crc.toString(36).substring(0, 5);
}

function exec(prompt, callback){

    const child = child_process.exec(prompt, function(err, stdout, stderr){

        if(err){

            console.error(err);
        }
        else{

            if(callback){

                callback();
            }
        }
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
}

// https://github.com/KimlikDAO/kimlikdao-js/tree/ana/kdjs