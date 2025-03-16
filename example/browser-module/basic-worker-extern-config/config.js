import { Encoder } from "https://rawcdn.githack.com/nextapps-de/flexsearch/a006c24bbb6f77ad491fa81c1c30481efa2431de/dist/flexsearch.bundle.module.min.js";

export default {
    tokenize: "forward",
    encoder: new Encoder({
        normalize: function(str){
            return str.toLowerCase();
        }
    })
};