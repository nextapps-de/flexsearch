import { EncoderOptions } from "../../type.js";
const regex = /[\x00-\x7F]+/g;

/** @type EncoderOptions */
const options = {
    normalize: false,
    dedupe: true,
    split: "",
    prepare: function(str){
        return ("" + str).replace(regex, "")
    }
};
export default options;
