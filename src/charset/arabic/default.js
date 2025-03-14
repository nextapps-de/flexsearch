import { EncoderOptions } from "../../type.js";
const regex = /[\x00-\x7F]+/g;
const split = /\s+/;

/** @type EncoderOptions */
const options = {
    rtl: true,
    normalize: false,
    dedupe: true,
    prepare: function(str){
        return ("" + str).replace(regex, " ")
    }
};
export default options;
