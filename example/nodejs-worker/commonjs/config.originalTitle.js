const { Charset } = require("flexsearch");

module.exports = {
    tokenize: "forward",
    encoder: Charset.LatinSimple
};