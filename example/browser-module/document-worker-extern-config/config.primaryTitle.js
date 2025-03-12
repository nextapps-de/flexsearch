import { Encoder, Charset } from "https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/flexsearch.bundle.module.min.js";
import EnglishPreset from "https://rawcdn.githack.com/nextapps-de/flexsearch/v0.8-preview/dist/module/lang/en.js";

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