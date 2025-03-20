const { Encoder } = require("flexsearch");

module.exports = {
    tokenize: "forward",
    encoder: new Encoder({
        normalize: function(str){
            return str.toLowerCase();
        }
    })
};