# PostgreSQL FlexSearch

Postgres is widely used as the default database engine. It can hold large amounts of data and also shines in scaling capabilities.

You'll need to install the npm package `pg-promise` into your project:
```bash
npm install pg-promise@11.10.2
```

Create an index and assign a Postgres storage adapter to it by using `index.mount(db)`:

```js
import { Index } from "flexsearch";
import Database from "flexsearch/db/postgres";

// your database configuration
const config = {
    user: "postgres",
    pass: "postgres",
    host: "localhost",
    port: "5432",
    // database name:
    name: "postgres"
};

// create an index
const index = new Index();
// create db instance with optional prefix
const db = new Database("my-store", config);
// mount and await before transfering data
await index.mount(db);

// update the index as usual
index.add(1, "content...");
index.update(2, "content...");
index.remove(3);

// changes are automatically committed by default
// when you need to wait for the task completion, then you
// can use the commit method explicitely:
await index.commit();
```

> Changes are automatically committed by default when you need to wait for the task completion, then you can use the `await index.commit()` method explicitely. You can disable the auto-commit feature optionally.

## Configuration

### Custom DB Instance

Pass a valid `pg-promise` instance on creation:

```js
import pg_promise from "pg-promise";
import Database from "flexsearch/db/postgres";
const pgp = pg_promise();
// assume you've created a custom database instance...
const database = pgp(`postgres://${user}:${pass}@${host}:${port}/${name}`);
// pass database instance as option
const db = new Database("my-store", {
    db: database
});
```

### ID Type

The Postgres driver supports type upgrading by ALTER TABLE. The index will automatically upgrade to `bigint` or to `string`, starting from `integer`.

Once the type was upgraded, you'll need to re-create the index to switch back.

When you data content is including numeric strings (eg. for ID "15712") then defining the type will automatically cast into the right type:

```js
import Database from "flexsearch/db/postgres";
// force integer type
const db = new Database("my-store", {
    type: "integer"
});
// ....
// the string will cast to integer
index.add("15712", "content...");
```

> You will save required disk space and also gain the performance when using a numeric ID over a string type.

### Table Structure

FlexSearch is creating different `SCHEMA` for each index name e.g. "my-store". That is how you can use different stores for different indexes at the same time without getting collision of naming inheritance. Document Indexes will map their field names into table names respectively.

```
DATABASE_NAME
  |__ SCHEMA
        |__TABLE map:field (FlexSearch Data) 
        |__TABLE ctx:field (FlexSearch Data) 
        |__TABLE tag:field (FlexSearch Data) 
        |__TABLE cfg:field (FlexSearch Data) 
        |__TABLE reg       (FlexSearch Data) 
```

You can force using a specific SCHEMA by option without passing a name:

```js
const db = new Database({
    schema: "public"
});
```

Every Instance you made of `DocumentIndex`, `WorkerIndex` or `Index` (as standalone) you'll need to create a `Database` instance having its own schema. 