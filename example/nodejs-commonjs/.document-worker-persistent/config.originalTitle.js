const { Encoder, Charset } = require("flexsearch");
const EnglishPreset  = require("flexsearch/lang/en");

module.exports = {
    tokenize: "forward",
    encoder: new Encoder(
        Charset.LatinBalance,
        EnglishPreset,
        {
            normalize: function(str){
                return str.toLowerCase();
            },
            filter: false,
            minlength: 3
        }
    )
};