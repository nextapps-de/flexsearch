// COMPILER BLOCK -->
import { DEBUG } from "../config.js";
// <-- COMPILER BLOCK
import Index from "../index.js";
import { IndexOptions } from "../type.js";

/** @type Index */
let index;
/** @type {IndexOptions} */
let options;

export default async function(data) {

    data = data["data"];

    const task = data["task"];
    const id = data["id"];
    let args = data["args"];

    switch(task){

        case "init":

            options = data["options"] || {};
            let filepath = options.config;
            if(filepath){
                // compiler fix
                options = options;
                // will be replaced after build with the line below because
                // there is an issue with closure compiler dynamic import
                options = (await import(filepath))["default"];
            }

            const factory = data["factory"];

            if(factory){

                // export the FlexSearch global payload to "self"
                Function("return " + factory)()(self);
                index = new self["FlexSearch"]["Index"](options);
                // destroy the exported payload
                delete self["FlexSearch"];
            }
            else{

                index = new Index(options);
            }

            postMessage({ "id": id });
            break;

        default:

            let message;

            if(task === "export"){
                if(DEBUG){
                    if(!options.export || typeof options.export !== "function"){
                        throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"export\".");
                    }
                }
                args = [options.export];
            }
            if(task === "import"){
                if(DEBUG){
                    if(!options.import || typeof options.import !== "function"){
                        throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"import\".");
                    }
                }
                await options.import.call(index, index);
            }
            else{
                message = index[task].apply(index, args);
            }

            postMessage(
                task === "search"
                    ? { "id": id, "msg": message }
                    : { "id": id }
            );
    }
};
