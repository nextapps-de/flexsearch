import { Encoder } from "flexsearch";

export default {
    tokenize: "forward",
    encoder: new Encoder({
        normalize: function(str){
            return str.toLowerCase();
        }
    })
};