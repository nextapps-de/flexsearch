const { Encoder, Charset } = require("flexsearch");
const EnglishPreset  = require("flexsearch/lang/en");
const fs = require("fs").promises;

(async function(){
    await fs.mkdir("./export/").catch(e => {});
}());

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
    ),
    export: async function(key, data){

        await fs.writeFile("./export/" + key, data, "utf8");
    },
    import: async function(file){

        return await fs.readFile("./export/" + file, "utf8");
    }
};