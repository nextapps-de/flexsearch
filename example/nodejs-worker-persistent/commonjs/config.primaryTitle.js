const Sqlite = require("flexsearch/db/sqlite");
// const Postgres = require("flexsearch/db/postgres");
// const MongoDB = require("flexsearch/db/mongodb");
// const Redis = require("flexsearch/db/redis");
// const Clickhouse = require("flexsearch/db/clickhouse");
const { Charset } = require("flexsearch");

module.exports = {
    tokenize: "forward",
    encoder: Charset.LatinSimple,
    db: new Sqlite("my-store", {
        field: "primaryTitle"
    })
};