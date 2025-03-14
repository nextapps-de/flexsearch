import { EncoderOptions } from "../../type.js";
const regex = /[\x00-\x7F]+/g,
      options = {
    normalize: !1,
    dedupe: !0,
    split: "",
    prepare: function (str) {
        return ("" + str).replace(regex, "");
    }
};

/** @type EncoderOptions */

export default options;