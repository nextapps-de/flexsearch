import { Encoder } from "https://rawcdn.githack.com/nextapps-de/flexsearch/aff94f2b1d830e21463b237070f7e6f7eb556b82/dist/flexsearch.bundle.module.min.js";

export default {
    tokenize: "forward",
    encoder: new Encoder({
        normalize: function(str){
            return str.toLowerCase();
        }
    })
};