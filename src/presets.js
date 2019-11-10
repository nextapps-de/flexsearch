/**
 * @enum {Object}
 * @const
 */

export default {

    "memory": {
        encode: SUPPORT_ENCODER ? "extra" : "icase",
        tokenize: "strict",
        threshold: 0,
        resolution: 1
    },

    "speed": {
        encode: "icase",
        tokenize: "strict",
        threshold: 1,
        resolution: 3,
        depth: 2
    },

    "match": {
        encode: SUPPORT_ENCODER ? "extra" : "icase",
        tokenize: "full",
        threshold: 1,
        resolution: 3
    },

    "score": {
        encode: SUPPORT_ENCODER ? "extra" : "icase",
        tokenize: "strict",
        threshold: 1,
        resolution: 9,
        depth: 4
    },

    "balance": {
        encode: SUPPORT_ENCODER ? "balance" : "icase",
        tokenize: "strict",
        threshold: 0,
        resolution: 3,
        depth: 3
    },

    "fast": {
        encode: "icase",
        tokenize: "strict",
        threshold: 8,
        resolution: 9,
        depth: 1
    }
};