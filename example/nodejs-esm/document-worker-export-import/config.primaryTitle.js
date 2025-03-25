import { Encoder, Charset } from "flexsearch";
import EnglishPreset from "flexsearch/lang/en";
import { promises as fs } from "fs";

(async function(){
    await fs.mkdir("./export/").catch(e => {});
}());

export default {
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