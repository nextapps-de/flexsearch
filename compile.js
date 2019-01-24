var child_process = require('child_process');
var fs = require('fs');

var supported_lang = [

    'en',
    'de'
];

console.log("Start build .....");

fs.existsSync("log") || fs.mkdirSync("log");

var options = (function(argv){

    var arr = {};
    var count = 0;

    argv.forEach(function(val, index) {

        if(++count > 2){

            index = val.split('=');
            val = index[1];
            index = index[0];

            arr[index] = val;

            if(count > 3) console.log(index + ': ' + val);
        }
    });

    console.log('RELEASE: ' + (arr['RELEASE'] || 'custom'));

    return arr;

})(process.argv);

var parameter = (function(opt){

    var parameter = '';

    for(var index in opt){

        if(opt.hasOwnProperty(index)){

            parameter += ' --' + index + '=' + opt[index];
        }
    }

    return parameter;
})({

    compilation_level: "ADVANCED_OPTIMIZATIONS", //"WHITESPACE"
    use_types_for_optimization: true,
    new_type_inf: true,
    jscomp_warning: "newCheckTypes",
    //jscomp_error: "strictCheckTypes",
    generate_exports: true,
    export_local_property_definitions: true,
    language_in: "ECMASCRIPT5_STRICT",
    language_out: "ECMASCRIPT5_STRICT",
    process_closure_primitives: true,
    summary_detail_level: 3,
    warning_level: "VERBOSE",
    emit_use_strict: options['RELEASE'] !== 'lang',
    output_manifest: "log/manifest.log",
    output_module_dependencies: "log/module_dependencies.log",
    property_renaming_report: "log/renaming_report.log"
    //formatting: "PRETTY_PRINT"
});

if(options['RELEASE'] === 'lang'){

    for(var i = 0; i < supported_lang.length; i++){

        (function(i){

            exec("java -jar node_modules/google-closure-compiler/compiler.jar" + parameter + " --define='SUPPORT_LANG_" + supported_lang[i].toUpperCase() + "=true' --js='lang/" + supported_lang[i] + ".js' --js_output_file='lang/" + supported_lang[i] + ".min.js' && exit 0", function(){

                console.log("Build Complete: " + supported_lang[i] + ".min.js");
            });

        })(i);
    }
}
else{

    exec("java -jar node_modules/google-closure-compiler/compiler.jar" + parameter + " --define='SUPPORT_DEBUG=" + (options['SUPPORT_DEBUG'] || 'false') + "' --define='SUPPORT_WORKER=" + (options['SUPPORT_WORKER'] || 'false') + "' --define='SUPPORT_BUILTINS=" + (options['SUPPORT_BUILTINS'] || 'false') + "' --define='SUPPORT_CACHE=" + (options['SUPPORT_CACHE'] || 'false') + "' --define='SUPPORT_ASYNC=" + (options['SUPPORT_ASYNC'] || 'false') + "' --define='SUPPORT_LANG_EN=" + (options['SUPPORT_LANG_EN'] || 'false') + "' --define='SUPPORT_LANG_DE=" + (options['SUPPORT_LANG_DE'] || 'false') + "' --js='flexsearch.js' --js='lang/**.js' --js='!lang/**.min.js' --js_output_file='flexsearch." + (options['RELEASE'] || 'custom') + ".js' && exit 0", function(){

        console.log("Build Complete: flexsearch." + (options['RELEASE'] || 'custom') + ".js");
    });
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
