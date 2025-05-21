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
                options=(await import(filepath))["default"];
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
                // skip non-field indexes
                if(!args[1]) args = null;
                else{
                    args[0] = options.export;
                    args[2] = 0;
                    args[3] = 1; // skip reg
                }
            }
            if(task === "import"){
                if(DEBUG){
                    if(!options.import || typeof options.import !== "function"){
                        throw new Error("Either no extern configuration provided for the Worker-Index or no method was defined on the config property \"import\".");
                    }
                }
                if(args[0]){
                    const data = await options.import.call(index, args[0]);
                    index.import(args[0], data);
                }
            }
            else{
                message = args && index[task].apply(index, args);
                if(message && message.then){
                    message = await message;
                }
                if(message && message.await){
                    message = await message.await;
                }
                if(task === "search" && message.result){
                    message = message.result;
                }
            }

            postMessage(
                task === "search"
                    ? { "id": id, "msg": message }
                    : { "id": id }
            );
    }
};
