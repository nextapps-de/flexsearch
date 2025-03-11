import Sqlite from "flexsearch/db/sqlite";
// import Postgres from "flexsearch/db/postgres";
// import MongoDB from "flexsearch/db/mongodb";
// import Redis from "flexsearch/db/redis";
// import Clickhouse from "flexsearch/db/clickhouse";

export default {
    db: new Sqlite("my-store", {
        field: "startYear"
    })
};