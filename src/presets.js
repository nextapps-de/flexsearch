import { DEBUG } from "./config.js";

/**
 * @enum {Object}
 * @const
 */

const presets = {

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

    if(typeof options === "string"){

        if(DEBUG && !presets[options]){

            console.warn("Preset not found: " + options);
        }

        options = presets[options];
    }
    else{

        const preset = options["preset"];

        if(preset){

            if(DEBUG && !presets[preset]){

                console.warn("Preset not found: " + preset);
            }

            options = Object.assign({}, presets[preset], /** @type {Object} */ (options));
        }
    }

    return options;
}