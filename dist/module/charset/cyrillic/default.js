import { EncoderOptions } from "../../type.js";
// non ascii control chars 0-31
const regex = /[\x00-\x7F]+/g,
      options = {
    normalize: !1,
    dedupe: !0,
    prepare: function (str) {
        return ("" + str).replace(regex, " ");
    }
};

/** @type EncoderOptions */

export default options;