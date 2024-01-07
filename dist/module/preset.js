
import { is_string } from "./common.js";

/**
 * @enum {Object}
 * @const
 */

const preset = {

    memory: {
        charset: "latin:extra",
        //tokenize: "strict",
        resolution: 3,
        //threshold: 0,
        minlength: 4,
        fastupdate: /* normalize: */ /* collapse: */ /* normalize: */ /* collapse: */ /* normalize: */ /* collapse: */ /* normalize: */
        /* collapse: */
        /* collapse: */!1
    },

    performance: {
        //charset: "latin",
        //tokenize: "strict",
        resolution: 3,
        minlength: 3,
        //fastupdate: true,
        optimize: !1, //fastupdate: true,
        context: {
            depth: 2, resolution: 1
            //bidirectional: false
        }
    },

    match: {
        charset: "latin:extra",
        tokenize: "reverse"
        //resolution: 9,
        //threshold: 0
    },

    score: {
        charset: "latin:advanced",
        //tokenize: "strict",
        resolution: 20,
        minlength: 3,
        context: {
            depth: 3,
            resolution: 9
            //bidirectional: true
        }
    },

    default: {
        // charset: "latin:default",
        // tokenize: "strict",
        // resolution: 3,
        // threshold: 0,
        // depth: 3
    }

    // "fast": {
    //     //charset: "latin",
    //     //tokenize: "strict",
    //     threshold: 8,
    //     resolution: 9,
    //     depth: 1
    // }
};

export default function apply_preset(options) {

    if (is_string(options)) {

        options = preset[options];
    } else {

        const preset = options.preset;

        if (preset) {

            options = Object.assign({}, preset[preset], /** @type {Object} */options);
        }
    }

    return options;
}