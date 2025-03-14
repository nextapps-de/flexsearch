import { Encoder } from "https://rawcdn.githack.com/nextapps-de/flexsearch/9e1b24a124c3d0065b4ddf5cea9d109aca2fb7d2/dist/flexsearch.bundle.module.min.js";

export default {
    tokenize: "forward",
    encoder: new Encoder({
        normalize: function(str){
            return str.toLowerCase();
        }
    })
};