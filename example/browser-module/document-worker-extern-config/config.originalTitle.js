import { Encoder, Charset } from "https://rawcdn.githack.com/nextapps-de/flexsearch/a006c24bbb6f77ad491fa81c1c30481efa2431de/dist/flexsearch.bundle.module.min.js";
import EnglishPreset from "https://rawcdn.githack.com/nextapps-de/flexsearch/a006c24bbb6f77ad491fa81c1c30481efa2431de/dist/module/lang/en.js";

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
    )
};