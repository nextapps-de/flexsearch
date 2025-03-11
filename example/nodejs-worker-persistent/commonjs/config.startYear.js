const Sqlite = require("flexsearch/db/sqlite");
// const Postgres = require("flexsearch/db/postgres");
// const MongoDB = require("flexsearch/db/mongodb");
// const Redis = require("flexsearch/db/redis");
// const Clickhouse = require("flexsearch/db/clickhouse");

module.exports = {
    db: new Sqlite("my-store", {
        field: "startYear"
    })
};