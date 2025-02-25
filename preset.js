// COMPILER BLOCK -->
import { DEBUG } from "./config.js";
// <-- COMPILER BLOCK
import { is_string } from "./common.js";

/**
 * @enum {Object}
 * @const
 */

const preset = {

    "memory": {
        //charset: "latin:extreme",
        // compression: 9,
        //tokenize: "strict",
        resolution: 1,
        // minlength: 4,
        // maxlength: 24,
        // fastupdate: false
    },

    "performance": {
        //charset: "latin:default",
        //tokenize: "strict",
        resolution: 6,
        // minlength: 3,
        // maxlength: 24,
        fastupdate: true,
        context: {
            depth: 1,
            resolution: 3
            //bidirectional: true
        }
    },

    "match": {
        //charset: "latin:extreme",
        tokenize: "forward",
        //resolution: 9,
    },

    "score": {
        //charset: "latin:extreme",
        //tokenize: "strict",
        resolution: 15,
        // minlength: 3,
        context: {
            depth: 2,
            resolution: 3,
            //bidirectional: true
        }
    }
};

export default function apply_preset(options){

    if(is_string(options)){

        if(DEBUG && !preset[options]){

            console.warn("Preset not found: " + options);
        }

        options = preset[options];
    }
    else{

        const preset = options["preset"];

        if(preset){

            if(DEBUG && !preset[preset]){

                console.warn("Preset not found: " + preset);
            }

            options = Object.assign({}, preset[preset], /** @type {Object} */ (options));
        }
    }

    return options;
}