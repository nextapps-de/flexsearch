import { SUPPORT_ASYNC, SUPPORT_DOCUMENT, SUPPORT_CACHE, SUPPORT_SERIALIZE } from "./config.js";
import Document from "./document.js";
import Index from "./index.js";
import { registerCharset, registerLanguage } from "./global.js";

/** @export */ Document.prototype.add;
/** @export */ Document.prototype.append;
/** @export */ Document.prototype.search;
/** @export */ Document.prototype.update;
/** @export */ Document.prototype.remove;
/** @export */ Document.prototype.contain;
/** @export */ Document.prototype.get;
/** @export */ Document.prototype.set;

/** @export */ Index.prototype.add;
/** @export */ Index.prototype.append;
/** @export */ Index.prototype.search;
/** @export */ Index.prototype.update;
/** @export */ Index.prototype.remove;
/** @export */ Index.prototype.contain;

if(SUPPORT_CACHE){

/** @export */ Index.prototype.searchCache;
/** @export */ Document.prototype.searchCache;
}

if(SUPPORT_ASYNC){

/** @export */ Document.prototype.addAsync;
/** @export */ Document.prototype.appendAsync;
/** @export */ Document.prototype.searchAsync;
/** @export */ Document.prototype.updateAsync;
/** @export */ Document.prototype.removeAsync;

/** @export */ Index.prototype.addAsync;
/** @export */ Index.prototype.appendAsync;
/** @export */ Index.prototype.searchAsync;
/** @export */ Index.prototype.updateAsync;
/** @export */ Index.prototype.removeAsync;
}

if(SUPPORT_SERIALIZE){

/** @export */ Index.prototype.export;
/** @export */ Index.prototype.import;

/** @export */ Document.prototype.export;
/** @export */ Document.prototype.import;
}

window["FlexSearch"] = {

    "Index": Index,
    "Document": SUPPORT_DOCUMENT ? Document : null,
    "registerCharset": registerCharset,
    "registerLanguage": registerLanguage
}