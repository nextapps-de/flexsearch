
import { searchCache } from "./cache";

/**
 * @constructor
 * @abstract
 */

function Engine(index) {

    index.prototype.searchCache = searchCache;


    index.prototype.addAsync = addAsync;
    index.prototype.appendAsync = appendAsync;
    index.prototype.searchAsync = searchAsync;
    index.prototype.updateAsync = updateAsync;
    index.prototype.removeAsync = removeAsync;
}

Engine.prototype.searchCache = searchCache;


Engine.prototype.addAsync = addAsync;
Engine.prototype.appendAsync = appendAsync;
Engine.prototype.searchAsync = searchAsync;
Engine.prototype.updateAsync = updateAsync;
Engine.prototype.removeAsync = removeAsync;