import { Encoder, Charset } from "https://rawcdn.githack.com/nextapps-de/flexsearch/9e1b24a124c3d0065b4ddf5cea9d109aca2fb7d2/dist/flexsearch.bundle.module.min.js";
import EnglishPreset from "https://rawcdn.githack.com/nextapps-de/flexsearch/9e1b24a124c3d0065b4ddf5cea9d109aca2fb7d2/dist/module/lang/en.js";

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