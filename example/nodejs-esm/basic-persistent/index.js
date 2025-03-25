import { Index } from "flexsearch";
import Sqlite from "flexsearch/db/sqlite";
// import Postgres from "flexsearch/db/postgres";
// import MongoDB from "flexsearch/db/mongodb";
// import Redis from "flexsearch/db/redis";
// import Clickhouse from "flexsearch/db/clickhouse";

(async function(){

    // create DB instance with namespace
    const db = new Sqlite("my-store");

    // create a simple index which can store id-content-pairs
    const index = new Index({
        tokenize: "forward"
    });

    // mount database to the index
    await index.mount(db);
    // await index.destroy();
    // await index.mount(db);

    // some test data
    const data = [
        'cats abcd efgh ijkl mnop qrst uvwx cute',
        'cats abcd efgh ijkl mnop qrst cute',
        'cats abcd efgh ijkl mnop cute',
        'cats abcd efgh ijkl cute',
        'cats abcd efgh cute',
        'cats abcd cute',
        'cats cute'
    ];

    // add data to the index
    data.forEach((item, id) => {
        index.add(id, item);
    });

    // transfer changes (bulk)
    await index.commit();

    // perform query
    const result = await index.search({
        query: "cute cat",
        suggest: true
    });

    console.log(result);
}());