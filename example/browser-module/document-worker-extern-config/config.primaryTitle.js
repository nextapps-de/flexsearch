import { Encoder, Charset } from "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.2/dist/flexsearch.bundle.module.min.js";
import EnglishPreset from "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.8.2/dist/module/lang/en.js";

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