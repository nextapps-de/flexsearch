var child_process = require('child_process');
var fs = require('fs');

var supported_lang = [

    'en',
    'de'
];

console.log("Start build .....");

fs.existsSync("log") || fs.mkdirSync("log");

var flag_str = "";
var language_out;
var formatting;
var compilation_level;

var options = (function(argv){

    var arr = {};
    var count = 0;

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
            else{

                flag_str += " --define='" + index + "=" + val + "'";

                arr[index] = val;
            }

            if(count > 3) console.log(index + ': ' + val);
        }
    });

    console.log('RELEASE: ' + (arr['RELEASE'] || 'custom'));

    return arr;

})(process.argv);

var parameter = (function(opt){

    if(formatting && !opt["formatting"]){

        opt["formatting"] = formatting;
    }

    var parameter = '';

    for(var index in opt){

        if(opt.hasOwnProperty(index)){

            parameter += ' --' + index + '=' + opt[index];
        }
    }

    return parameter;
})({

    compilation_level: compilation_level || "ADVANCED_OPTIMIZATIONS", //"WHITESPACE"
    use_types_for_optimization: true,
    new_type_inf: true,
    jscomp_warning: "newCheckTypes",
    //jscomp_error: "strictCheckTypes",
    generate_exports: true,
    export_local_property_definitions: true,
    language_in: "ECMASCRIPT6_STRICT",
    language_out: language_out || "ECMASCRIPT6_STRICT",
    //rewrite_polyfills: false,
    process_closure_primitives: true,
    summary_detail_level: 3,
    warning_level: "VERBOSE",
    emit_use_strict: options["RELEASE"] !== "lang",
    output_manifest: "log/manifest.log",
    output_module_dependencies: "log/module_dependencies.log",
    property_renaming_report: "log/renaming_report.log"
    //formatting: formatting || "DEFAULT" //"PRETTY_PRINT"
});

var release = options["RELEASE"];

if(release === "demo"){

    options['RELEASE'] = "custom";
}

var custom = (!options["RELEASE"] || (options["RELEASE"] === "custom"));

if(custom){

    options["RELEASE"] = "custom." + hashCode(parameter + flag_str);
}

if(release === "lang"){

    for(var i = 0; i < supported_lang.length; i++){

        (function(i){

            exec("java -jar node_modules/google-closure-compiler-java/compiler.jar" + parameter + " --js='lang/" + supported_lang[i] + ".js'" + flag_str + " --js_output_file='lang/" + supported_lang[i] + ".min.js' && exit 0", function(){

                console.log("Build Complete: " + supported_lang[i] + ".min.js");
            });

        })(i);
    }
}
else{

    exec("java -jar node_modules/google-closure-compiler-java/compiler.jar" + parameter + " --js='flexsearch.js' --js='lang/**.js' --js='!lang/**.min.js'" + flag_str + " --js_output_file='dist/flexsearch." + (options["RELEASE"] || "custom") + ".js' && exit 0", function(){

        var filename = "flexsearch." + (options["RELEASE"] || "custom") + ".js";

        console.log("Build Complete: " + filename);

        /*
        if(release === "es5"){

            //fs.existsSync("dist/") || fs.mkdirSync("dist/");
            //fs.existsSync("dist/latest") || fs.mkdirSync("dist/latest");

            fs.copyFileSync(filename, "test/" + filename);
            //fs.copyFileSync(filename, "dist/latest/" + filename);
            fs.unlinkSync(filename);
        }
        */
    });
}

function hashCode(str) {

    var hash = 0, i, chr;

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

    var child = child_process.exec(prompt, function(err, stdout, stderr){

        if(err){

            console.log(err);
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
