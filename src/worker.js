import Index from "./index.js";

let index, id;

onmessage = function(event) {

    const data = event.data;

    switch(data["task"]){

        case "create":

            const options = data["options"] || {};

            options["cache"] = false;
            id = data["id"];

            if(typeof options["encode"] === "string"){

                options["encode"] = Function(options["encode"]);
            }

            index = new Index(options);
            break;

        case "add":

            index.add.apply(index, data["args"]);
            break;

        case "append":

            index.append.apply(index, data["args"]);
            break;

        case "search":

            const results = index.search.apply(index, data["args"]);
            //postMessage({ id: id, results: results });
            postMessage(results);
            break;

        case "update":

            index.update.apply(index, data["args"]);
            break;

        case "remove":

            index.remove.apply(index, data["args"]);
            break;
    }
};
