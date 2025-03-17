import { Encoder, Charset } from "https://rawcdn.githack.com/nextapps-de/flexsearch/0.8.0/dist/flexsearch.bundle.module.min.js";
import EnglishPreset from "https://rawcdn.githack.com/nextapps-de/flexsearch/0.8.0/dist/module/lang/en.js";

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