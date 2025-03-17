import { Encoder } from "https://rawcdn.githack.com/nextapps-de/flexsearch/0.8.0/dist/flexsearch.bundle.module.min.js";

export default {
    tokenize: "forward",
    encoder: new Encoder({
        normalize: function(str){
            return str.toLowerCase();
        }
    })
};