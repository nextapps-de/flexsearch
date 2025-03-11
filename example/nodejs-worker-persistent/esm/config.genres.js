import Postgres from "flexsearch/db/postgres";

export default {
    db: new Postgres("my-store", {
        field: "genres"
    })
};