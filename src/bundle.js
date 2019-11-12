import { default as FlexSearch, global_charset, global_lang } from "./flexsearch.js";
import charset_latin_advanced from "./lang/latin/advanced.js";
import charset_latin_balance from "./lang/latin/balance.js";
import charset_latin_default from "./lang/latin/default.js";
import charset_latin_extra from "./lang/latin/extra.js";
import charset_latin_simple from "./lang/latin/simple.js";
import charset_latin_soundex from "./lang/latin/soundex.js";
import charset_arabic_default from "./lang/arabic/default.js";
import charset_cjk_default from "./lang/cjk/default.js";
import charset_cyrillic_default from "./lang/cyrillic/default.js";
import lang_de from "./lang/de.js";
import lang_en from "./lang/en.js";
import lang_at from "./lang/at.js";
import lang_us from "./lang/us.js";
import "./export.js";

if(SUPPORT_ENCODER === true || (SUPPORT_ENCODER && ((SUPPORT_ENCODER === "latin") || (SUPPORT_ENCODER.indexOf("latin:advanced") !== -1)))){

    global_charset["latin:advanced"] = charset_latin_advanced;
}
if(SUPPORT_ENCODER === true || (SUPPORT_ENCODER && ((SUPPORT_ENCODER === "latin") || (SUPPORT_ENCODER.indexOf("latin:balance") !== -1)))){

    global_charset["latin:balance"] = charset_latin_balance;
}
if(SUPPORT_ENCODER === true || (SUPPORT_ENCODER && ((SUPPORT_ENCODER === "latin") || (SUPPORT_ENCODER.indexOf("latin:default") !== -1)))){

    global_charset["latin:default"] = charset_latin_default;
}
if(SUPPORT_ENCODER === true || (SUPPORT_ENCODER && ((SUPPORT_ENCODER === "latin") || (SUPPORT_ENCODER.indexOf("latin:extra") !== -1)))){

    global_charset["latin:extra"] = charset_latin_extra;
}
if(SUPPORT_ENCODER === true || (SUPPORT_ENCODER && ((SUPPORT_ENCODER === "latin") || (SUPPORT_ENCODER.indexOf("latin:simple") !== -1)))){

    global_charset["latin:simple"] = charset_latin_simple;
}
if(SUPPORT_ENCODER === true || (SUPPORT_ENCODER && ((SUPPORT_ENCODER === "latin") || (SUPPORT_ENCODER.indexOf("latin:soundex") !== -1)))){

    global_charset["latin:soundex"] = charset_latin_soundex;
}
if(SUPPORT_ENCODER === true || (SUPPORT_ENCODER && ((SUPPORT_ENCODER === "arabic") || (SUPPORT_ENCODER.indexOf("arabic:default") !== -1)))){

    global_charset["arabic:default"] = charset_arabic_default;
}
if(SUPPORT_ENCODER === true || (SUPPORT_ENCODER && ((SUPPORT_ENCODER === "cjk") || (SUPPORT_ENCODER.indexOf("cjk:default") !== -1)))){

    global_charset["cjk:default"] = charset_cjk_default;
}
if(SUPPORT_ENCODER === true || (SUPPORT_ENCODER && ((SUPPORT_ENCODER === "cyrillic") || (SUPPORT_ENCODER.indexOf("cyrillic:default") !== -1)))){

    global_charset["cyrillic:default"] = charset_cyrillic_default;
}

if(SUPPORT_LANG === true || (SUPPORT_LANG && SUPPORT_LANG.indexOf("de") !== -1)){

    global_lang["de"] = lang_de;
}
if(SUPPORT_LANG === true || (SUPPORT_LANG && SUPPORT_LANG.indexOf("en") !== -1)){

    global_lang["en"] = lang_en;
}
if(SUPPORT_LANG === true || (SUPPORT_LANG && SUPPORT_LANG.indexOf("at") !== -1)){

    global_lang["at"] = lang_at;
}
if(SUPPORT_LANG === true || (SUPPORT_LANG && SUPPORT_LANG.indexOf("us") !== -1)){

    global_lang["us"] = lang_us;
}

(function(){

    const name = "FlexSearch";
    const root = this || window;
    let prop;

    // AMD (RequireJS)
    if((prop = root["define"]) && prop["amd"]){

        prop([], function(){

            return FlexSearch;
        });
    }
    // CommonJS (Node.js)
    // else if(typeof exports === "object"){
    //
    //     /** @export */
    //     module.exports = factory;
    // }
    else if(typeof root["exports"] === "object"){

        /** @export */
        root["module"].exports = FlexSearch;
    }
    // Global (window)
    else{

        root[name] = FlexSearch;
    }

}());