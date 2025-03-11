const Postgres = require("flexsearch/db/postgres");

module.exports = {
    db: new Postgres("my-store", {
        field: "startYear"
    })
};