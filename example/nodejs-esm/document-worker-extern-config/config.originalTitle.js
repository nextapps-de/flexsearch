import { Encoder, Charset } from "flexsearch/esm";
import EnglishPreset from "flexsearch/esm/lang/en";

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