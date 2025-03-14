import { Encoder } from "flexsearch/esm";

export default {
    tokenize: "forward",
    encoder: new Encoder({
        normalize: function(str){
            return str.toLowerCase();
        }
    })
};