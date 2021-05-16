import Index from "./index.js";

let index, id;

onmessage = function(event) {

    const data = event.data;

    switch(data["task"]){

        case "register":

            const options = data["options"] || {};

            options["cache"] = false;
            // options["async"] = false;
            // options["worker"] = false;

            id = data["id"];
            index = new Index(options);
            break;

        case "search":

            const results = index.search(data["query"], data);

            postMessage({ id, results });
            break;

        case "add":

            index.add(data["id"], data["content"]);
            break;

        case "update":

            index.update(data["id"], data["content"]);
            break;

        case "remove":

            index.remove(data["id"]);
            break;

        // case "clear":
        //
        //     index.clear();
        //     break;
    }
};
