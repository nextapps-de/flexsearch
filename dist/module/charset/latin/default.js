import { EncoderOptions } from "../../type.js";

/** @type EncoderOptions */
const options = {
    normalize: function (str) {
        return str.toLowerCase();
    },
    dedupe: !1
};
export default options;