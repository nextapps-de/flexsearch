import Index from "../index.js";
import { IndexOptions } from "../type.js";

export default async function(data) {

    data = data["data"];

    /** @type Index */
    const index = self["_index"];
    const args = data["args"];
    const task = data["task"];

    switch(task){

        case "init":

            /** @type {IndexOptions} */
            let options = data["options"] || {};
            let filepath = options.config;
            if(filepath){
                options = options;
                // will be replaced after build with the line below because
                // there is an issue with closure compiler dynamic import
                options = (await import(filepath))["default"];
            }

            const factory = data["factory"];

            if(factory){

                // export the FlexSearch global payload to "self"
                Function("return " + factory)()(self);

                /** @type Index */
                self["_index"] = new self["FlexSearch"]["Index"](options);

                // destroy the exported payload
                delete self["FlexSearch"];
            }
            else{

                self["_index"] = new Index(options);
            }

            postMessage({ "id": data["id"] });
            break;

        default:

            const id = data["id"];
            const message = index[task].apply(index, args);
            postMessage(
                task === "search"
                    ? { "id": id, "msg": message }
                    : { "id": id }
            );
    }
};
