/** @define {boolean} */ const SUPPORT_LANG_DE = true;

if(SUPPORT_LANG_DE) {

    (function(root){

        let fs;

        if((typeof exports === "object") && (typeof require !== "undefined")){

            fs = require("../dist/flexsearch.node.js");
        }
        else{

            fs = root["FlexSearch"];
        }

        fs["registerLanguage"]("de", /** @const */ {

            /**
             * http://www.ranks.nl/stopwords
             * @type {Array<string>}
             * @export
             */

            filter: [

                "aber",
                "als",
                "am",
                "an",
                "auch",
                "auf",
                "aus",
                "bei",
                "bin",
                "bis",
                "bist",
                "da",
                "dadurch",
                "daher",
                "darum",
                "das",
                "daß",
                "dass",
                "dein",
                "deine",
                "dem",
                "den",
                "der",
                "des",
                "dessen",
                "deshalb",
                "die",
                "dies",
                "dieser",
                "dieses",
                "doch",
                "dort",
                "du",
                "durch",
                "ein",
                "eine",
                "einem",
                "einen",
                "einer",
                "eines",
                "er",
                "es",
                "euer",
                "eure",
                "für",
                "hatte",
                "hatten",
                "hattest",
                "hattet",
                "hier",
                "hinter",
                "ich",
                "ihr",
                "ihre",
                "im",
                "in",
                "ist",
                "ja",
                "jede",
                "jedem",
                "jeden",
                "jeder",
                "jedes",
                "jener",
                "jenes",
                "jetzt",
                "kann",
                "kannst",
                "können",
                "könnt",
                "machen",
                "mein",
                "meine",
                "mit",
                "muß",
                "mußt",
                "musst",
                "müssen",
                "müßt",
                "nach",
                "nachdem",
                "nein",
                "nicht",
                "nun",
                "oder",
                "seid",
                "sein",
                "seine",
                "sich",
                "sie",
                "sind",
                "soll",
                "sollen",
                "sollst",
                "sollt",
                "sonst",
                "soweit",
                "sowie",
                "und",
                "unser",
                "unsere",
                "unter",
                "vom",
                "von",
                "vor",
                "wann",
                "warum",
                "was",
                "weiter",
                "weitere",
                "wenn",
                "wer",
                "werde",
                "werden",
                "werdet",
                "weshalb",
                "wie",
                "wieder",
                "wieso",
                "wir",
                "wird",
                "wirst",
                "wo",
                "woher",
                "wohin",
                "zu",
                "zum",
                "zur",
                "über"
            ],

            /**
             * @type {Object<string, string>}
             * @export
             */

            stemmer: {

                "niss": "",
                "isch": "",
                "lich": "",
                "heit": "",
                "keit": "",
                "end": "",
                "ung": "",
                "est": "",
                "ern": "",
                "em": "",
                "er": "",
                "en": "",
                "es": "",
                "st": "",
                "ig": "",
                "ik": "",
                "e": "",
                "s": ""
            }
        });

    })(this);
}
