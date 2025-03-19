import { EncoderOptions } from "../../type.js";

/** @type EncoderOptions */
const options = {
    normalize: function (str) {
        return str.toLowerCase();
    },
    numeric: !1,
    dedupe: !1
};
export default options;