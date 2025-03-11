const Postgres = require("flexsearch/db/postgres");
const { Charset } = require("flexsearch");

module.exports = {
    tokenize: "forward",
    encoder: Charset.LatinSimple,
    db: new Postgres("my-store", {
        field: "originalTitle"
    })
};