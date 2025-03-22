import { EncoderOptions } from "../../type.js";
// non ascii control chars 0-31
const regex = /[\x00-\x7F]+/g,
      split = /\s+/,
      options = {
    // the string is already encoded as RTL by default
    //rtl: true,
    normalize: !1,
    dedupe: !0,
    prepare: function (str) {
        return ("" + str).replace(regex, " ");
    }
};

/** @type EncoderOptions */

export default options;