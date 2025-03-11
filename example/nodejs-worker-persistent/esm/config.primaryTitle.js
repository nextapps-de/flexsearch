import Postgres from "flexsearch/esm/db/postgres";
import { Charset } from "flexsearch/esm";

export default {
    tokenize: "forward",
    encoder: Charset.LatinSimple,
    db: new Postgres("my-store", {
        field: "primaryTitle"
    })
};