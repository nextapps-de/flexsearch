import { EncoderOptions } from "../../type.js";
// non ascii control chars 0-31
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
