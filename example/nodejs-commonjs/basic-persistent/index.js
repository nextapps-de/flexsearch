const { Index } = require("flexsearch");
const Sqlite = require("flexsearch/db/sqlite");
// const Postgres = require("flexsearch/db/postgres");
// const MongoDB = require("flexsearch/db/mongodb");
// const Redis = require("flexsearch/db/redis");
// const Clickhouse = require("flexsearch/db/clickhouse");

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
        query: "cute cat"
    });

    // display results
    result.forEach(i => {
        console.log(data[i]);
    });

}());