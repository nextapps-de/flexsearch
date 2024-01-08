const child_process = require("child_process");
const fs = require("fs");

console.log("Start build .....");

fs.rmSync("tmp/", { recursive: true });
fs.mkdirSync("tmp");
//fs.existsSync("log") || fs.mkdirSync("log");
fs.existsSync("dist") || fs.mkdirSync("dist");

var supported_lang = [

    'en',
    'de',
    'at',
    'us'
];

var supported_charset = {

    'latin': ["default", "advanced", "balance", "extra", "simple"],
    'cjk': ["default"],
    'cyrillic': ["default"],
    'arabic': ["default"],
};

let flag_str = "";
let language_out;
let use_polyfill;
var formatting;
var compilation_level;

var options = (function(argv){

    const arr = {};
    let count = 0;

    argv.forEach(function(val, index) {

        if(++count > 2){

            index = val.split('=');
            val = index[1];
            index = index[0].toUpperCase();

            if(index === "LANGUAGE_OUT"){

                language_out = val;
            }
            else if(index === "FORMATTING"){

                formatting = val;
            }
            else if(index === "COMPILATION_LEVEL"){

                compilation_level = val;
            }
            else if(index === "POLYFILL"){

                use_polyfill = val === "true";
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

// if(release){
//
//     let filename
//
//     if(!fs.existsSync(filename = "src/config/" + release + "/config.js")){
//
//         filename = "src/config/bundle/config.js";
//     }
//
//     fs.writeFileSync("tmp/config.js", fs.readFileSync(filename));
// }

let parameter = (function(opt){

    if(formatting && !opt["formatting"]){

        opt["formatting"] = formatting;
    }

    let parameter = '';

    for(let index in opt){

        if(opt.hasOwnProperty(index)){

            if((release !== "lang") /*|| (index !== "entry_point")*/){

                parameter += ' --' + index + '=' + opt[index];
            }
        }
    }

    return parameter;
})({

    compilation_level: compilation_level || "ADVANCED_OPTIMIZATIONS", //"SIMPLE"
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
    entry_point: "./tmp/webpack.js",
    //manage_closure_dependencies: true,
    dependency_mode: "PRUNE_LEGACY", // PRUNE_LEGACY
    rewrite_polyfills: use_polyfill || false,

    //isolation_mode: "IIFE",
    //output_wrapper: /*release === "lang" ? "%output%" :*/ "\"(function(self){%output%}(this));\""
    //formatting: "PRETTY_PRINT"
});

// if(options["DEBUG"]){
//     parameter += ' --formatting=PRETTY_PRINT';
// }

if(release !== "bundle.module" && release !== "light.module"){
    //parameter += ' --isolation_mode=IIFE';
    parameter += ' --emit_use_strict=true';
    parameter += ' --output_wrapper="\"(function(self){%output%}(this));\""';
}

const custom = (!release || (release === "custom"));

if(custom){

    release = "custom." + hashCode(parameter + flag_str).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

// if(release === "lang"){
//
//     const charsets = Object.keys(supported_charset);
//
//     (function next(x, y, z){
//
//         if(x < supported_lang.length){
//
//             (function(lang){
//
//                 fs.writeFileSync("tmp/" + lang + ".js", `
//                     import lang from "../src/lang/${lang}.js";
//                     self["FlexSearch"]["registerLanguage"]("${lang}", lang);
//                 `);
//
//                 exec("java -jar node_modules/google-closure-compiler-java/compiler.jar" + parameter + " --entry_point='tmp/" + lang + ".js' --js='tmp/" + lang + ".js' --js='src/**.js'" + flag_str + " --js_output_file='dist/lang/" + lang + ".min.js' && exit 0", function(){
//
//                     console.log("Build Complete: " + lang + ".min.js");
//                     next(++x, y, z);
//                 });
//
//             })(supported_lang[x]);
//         }
//         else if(y < charsets.length){
//
//             const charset = charsets[y];
//             const variants = supported_charset[charset];
//
//             if(z < variants.length){
//
//                 (function(charset, variant){
//
//                     fs.writeFileSync("tmp/" + charset + "_" + variant + ".js", `
//                         import charset from "../src/lang/${charset}/${variant}.js";
//                         /*try{if(module)self=module}catch(e){}*/
//                         self["FlexSearch"]["registerCharset"]("${charset}:${variant}", charset);
//                     `);
//
//                     exec("java -jar node_modules/google-closure-compiler-java/compiler.jar" + parameter + " --entry_point='tmp/" + charset + "_" + variant + ".js' --js='tmp/" + charset + "_" + variant + ".js' --js='src/**.js'" + flag_str + " --js_output_file='dist/lang/" + charset + "/" + variant + ".min.js' && exit 0", function(){
//
//                         console.log("Build Complete: " + charset + "/" + variant + ".min.js");
//                         next(x, y, ++z);
//                     });
//
//                 })(charset, variants[z]);
//             }
//             else{
//
//                 next(x, ++y, 0);
//             }
//         }
//
//     }(0, 0, 0));
// }
// else{

    if(release === "lang") throw new Error("disabled");


const files = [

    "async.js",
    "cache.js",
    "common.js",
    "config.js",
    "document.js",
    "engine.js",
    "global.js",
    "index.js",
    "intersect.js",
    "lang.js",
    "polyfill.js",
    "preset.js",
    "serialize.js",
    "type.js",
    "webpack.js"
];

files.forEach(function(file){

    if(file === "config.js"){

        let src = String(fs.readFileSync("src/" + file));

        for(let opt in options){

            src = src.replace(new RegExp('(export const ' + opt + ' = )(")?[^";]+(")?;'), "$1$2" + options[opt] + "$3;");
        }

        fs.writeFileSync("tmp/" + file, src);
    }
    else{

        fs.copyFileSync("src/" + file, "tmp/" + file);
    }
});

fs.cpSync("src/lang/", "tmp/lang/", { recursive: true });
fs.cpSync("src/worker/", "tmp/worker/", { recursive: true });

const filename = "dist/flexsearch." + (release || "custom") + (options["DEBUG"] ?  ".debug" : ".min") + ".js";

const executable = process.platform === "win32" ?  "\"node_modules/google-closure-compiler-windows/compiler.exe\"" :
                   process.platform === "darwin" ? "\"node_modules/google-closure-compiler-osx/compiler\"" :
                                                   "java -jar node_modules/google-closure-compiler-java/compiler.jar";

exec(executable + parameter + " --js='tmp/**.js' --js='!tmp/**/node.js'" + flag_str + " --js_output_file='" + filename + "' && exit 0", function(){

    let build = fs.readFileSync(filename);
    let preserve = fs.readFileSync("src/index.js", "utf8");

    const package_json = require("../package.json");

    preserve = preserve.replace("* FlexSearch.js", "* FlexSearch.js v" + package_json.version + (release ? " (" + (release.charAt(0).toUpperCase() + release.substring(1)) + ")" : ""));
    build = preserve.substring(0, preserve.indexOf('*/') + 2) + "\n" + build;

    if(release === "bundle"){

        build = build.replace("(function(self){'use strict';", "(function _f(self){'use strict';try{if(module)self=module}catch(e){}self._factory=_f;");
    }

    build = build.replace(/eval\('(.*)'\)/, "$1");

    if(release === "bundle.module" || release === "light.module" || release === "compact.module"){

        build = build.replace(/self\.FlexSearch(\s+)?=(\s+)?/, "export default ");
    }

    // if(release === "pre"){
    //
    //     fs.existsSync("test/dist") || fs.mkdirSync("test/dist");
    //     fs.writeFileSync("test/" + filename, build);
    // }
    // else{

        fs.writeFileSync(filename, build);
    // }

    fs.copyFileSync("src/worker/node.js", "dist/node/node.js");

    console.log("Build Complete.");
});
//}

function hashCode(str) {

    let hash = 0, i, chr;

    if(str.length === 0){

        return hash;
    }

    for(i = 0; i < str.length; i++){

        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
    }

    hash = Math.abs(hash) >> 0;

    return hash.toString(16).substring(0, 5);
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
