
import { is_string } from "./common.js";
import { IndexOptions } from "./type.js";

/**
 * @type {Object<string, IndexOptions>}
 * @const
 */
const presets = {

    memory: {
        resolution: 1
    },

    performance: {
        resolution: 3,
        fastupdate: !0,
        context: {
            depth: 1,
            resolution: 1
        }
    },

    match: {
        tokenize: "forward"
    },

    score: {
        resolution: 9,
        context: {
            depth: 2,
            resolution: 3
        }
    }
};

/**
 *
 * @param {IndexOptions|string} options
 * @return {IndexOptions}
 */

export default function apply_preset(options) {

    const preset = /** @type string */is_string(options) ? options : options.preset;

    if (preset) {
        if (!presets[preset]) {
            console.warn("Preset not found: " + preset);
        }
        options = /** @type IndexOptions */Object.assign({}, presets[preset], /** @type {Object} */options);
    }

    return (/** @type IndexOptions */options
    );
}