import Sqlite from "flexsearch/db/sqlite";
// import Postgres from "flexsearch/db/postgres";
// import MongoDB from "flexsearch/db/mongodb";
// import Redis from "flexsearch/db/redis";
// import Clickhouse from "flexsearch/db/clickhouse";
import { Charset } from "flexsearch/esm";

export default {
    tokenize: "forward",
    encoder: Charset.LatinSimple,
    db: new Sqlite("my-store", {
        field: "originalTitle"
    })
};