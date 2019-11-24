/**
 * @enum {Object}
 * @const
 */

export default {

    "memory": {
        charset: "latin:extra",
        //tokenize: "strict",
        threshold: 0,
        resolution: 1
    },

    "speed": {
        //charset: "latin",
        //tokenize: "strict",
        threshold: 1,
        resolution: 3,
        depth: 2
    },

    "match": {
        charset: "latin:extra",
        tokenize: "full",
        threshold: 1,
        resolution: 3
    },

    "score": {
        charset: "latin:extra",
        //tokenize: "strict",
        threshold: 1,
        resolution: 9,
        depth: 4
    },

    "balance": {
        charset: "latin:balance",
        //tokenize: "strict",
        threshold: 0,
        resolution: 3,
        depth: 3
    },

    "fast": {
        //charset: "latin",
        //tokenize: "strict",
        threshold: 8,
        resolution: 9,
        depth: 1
    }
};