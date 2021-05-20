import { DEBUG } from "./config.js";
import { is_string } from "./common.js";

/**
 * @enum {Object}
 * @const
 */

const preset = {

    "memory": {
        charset: "latin:extra",
        //tokenize: "strict",
        resolution: 3,
        //threshold: 0,
        minlength: 3,
        fastupdate: false,
        optimize: "memory"
    },

    "performance": {
        //charset: "latin",
        //tokenize: "strict",
        //resolution: 9,
        threshold: 8,
        minlength: 3,
        //fastupdate: true,
        context: {
            depth: 1,
            bidirectional: true
        }
    },

    "match": {
        charset: "latin:extra",
        tokenize: "full",
        resolution: 3,
        //threshold: 0
    },

    "score": {
        charset: "latin:advanced",
        //tokenize: "strict",
        //resolution: 9,
        threshold: 1,
        context: {
            depth: 3,
            bidirectional: true
        }
    },

    "default": {
        //charset: "latin:default",
        //tokenize: "strict",
        resolution: 3,
        threshold: 0,
        depth: 3
    },

    // "fast": {
    //     //charset: "latin",
    //     //tokenize: "strict",
    //     threshold: 8,
    //     resolution: 9,
    //     depth: 1
    // }
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