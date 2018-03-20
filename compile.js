var child_process = require('child_process');

console.log("Start build .....");

var parameter = (function(opt){

    var parameter = '';

    for(var index in opt){

        if(opt.hasOwnProperty(index)){

            parameter += ' --' + index + '=' + opt[index];
        }
    }

    console.log(parameter);

    return parameter;
})({

    compilation_level: "ADVANCED_OPTIMIZATIONS",
    use_types_for_optimization: true,
    new_type_inf: true,
    jscomp_warning: "newCheckTypes",
    generate_exports: true,
    export_local_property_definitions: true,
    language_in: "ECMASCRIPT5_STRICT",
    language_out: "ECMASCRIPT5_STRICT",
    process_closure_primitives: true,
    summary_detail_level: 3,
    warning_level: "VERBOSE",
    emit_use_strict: true,
    output_manifest: "log/manifest.log",
    output_module_dependencies: "log/module_dependencies.log",
    property_renaming_report: "log/renaming_report.log"
});

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

exec("java -jar node_modules/google-closure-compiler/compiler.jar" + parameter + " --define='SUPPORT_DEBUG=" + (options['SUPPORT_DEBUG'] || 'false') + "' --define='SUPPORT_WORKER=" + (options['SUPPORT_WORKER'] || 'false') + "' --define='SUPPORT_BUILTINS=" + (options['SUPPORT_BUILTINS'] || 'false') + "' --define='SUPPORT_CACHE=" + (options['SUPPORT_CACHE'] || 'false') + "' --define='SUPPORT_ASYNC=" + (options['SUPPORT_ASYNC'] || 'false') + "' --js='flexsearch.js' --js_output_file='flexsearch." + (options['RELEASE'] || 'custom') + ".js' && exit 0", function(){

    console.log("Build Complete: flexsearch." + (options['RELEASE'] || 'custom') + ".js");
});

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
