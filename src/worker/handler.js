import Index from "../index.js";

export default function handler(event) {

    /** @type Index */
    const index = self["_index"];
    const data = event["data"];
    const args = data["args"];

    switch(data["task"]){

        case "init":

            const options = data["options"] || {};
            const factory = data["factory"];
            const encode = options["encode"];

            options["cache"] = false;
            //root["_id"] = data["id"];

            if(typeof encode === "string"){

                options["encode"] = new Function("return " + encode)();
            }

            if(factory){

                // export the FlexSearch global payload to "self"
                new Function("return " + factory)()(self);

                /** @type Index */
                self["_index"] = self["FlexSearch"]["Index"](options);

                // destroy the exported payload
                delete self["FlexSearch"];
            }
            else{

                self["_index"] = new Index(options);
            }

            break;

        case "add":

            index.add.apply(index, args);
            break;

        case "append":

            index.append.apply(index, args);
            break;

        case "search":

            const results = index.search.apply(index, args);
            //postMessage({ id: id, results: results });
            postMessage(results);
            break;

        case "update":

            index.update.apply(index, args);
            break;

        case "remove":

            index.remove.apply(index, args);
            break;
    }
};
