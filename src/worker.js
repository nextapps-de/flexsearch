import Index from "./index.js";
import { is_string, is_object } from "./common.js";

let index, id;

onmessage = function(event) {

    const data = event.data;
    const args = data["args"];

    switch(data["task"]){

        case "create":

            const options = data["options"] || {};
            const encode = options["encode"];

            options["cache"] = false;
            id = data["id"];

            if(is_string(encode)){

                options["encode"] = new Function("return " + encode)();
            }

            index = new Index(options);
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
