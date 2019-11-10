import FlexSearch from "./flexsearch.js";
import "./export.js";
//import { encode as icase } from "./lang/latin/icase.js";

if(SUPPORT_ENCODER){

    //FlexSearch.Encoder["icase"] = icase;
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