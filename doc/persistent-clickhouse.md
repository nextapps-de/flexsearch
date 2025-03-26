# Clickhouse FlexSearch

Clickhouse is highly optimized for raw I/O and write access. When your index needs to be frequently updated, this storage engine can help to reduce blocking write access.

You'll need to install the npm package `clickhouse` into your project:
```bash
npm install clickhouse@2.6.0
```

Create an index and assign a Clickhouse storage adapter to it by using `index.mount(db)`:

```js
import { Index } from "flexsearch";
import Database from "flexsearch/db/clickhouse";

// your database configuration
const config = {
    host: "http://localhost",
    port: "8123",
    database: "default",
    basicAuth: null,
    debug: false
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

Pass a valid `clickhouse` instance on creation:

```js
import { ClickHouse } from "clickhouse";
import Database from "flexsearch/db/clickhouse";
// assume you've created a custom database instance...
const database = new ClickHouse({/* config */});
// pass database instance as option
const db = new Database("my-store", {
    db: database
});
```

For every instance of `DocumentIndex`, `WorkerIndex` or `Index` (as standalone) you'll need to create a `Database` instance having its own name.

### ID Type

The Clickhouse driver does not properly support upgrading a merge key by ALTER TABLE. Therefore, the default type for ID is `text`.

You will save required disk space and also gain performance when define a numeric ID type explicitly.

```js
import Database from "flexsearch/db/clickhouse";
// force integer type
const db = new Database("my-store", {
    type: "integer"
});
// ....
index.add("15712", "content...");
// IDs will cast to integer
let result = await index.search("content...");
// -> [15712]
```

BigInt:

```js
const db = new Database("my-store", {
    type: "bigint"
});
```

To change the type later the index needs to be deleted by `db.destroy()` and re-created by `db.mount()`.

### Table Structure

FlexSearch is creating different `DATABASE` entries for each index name e.g. "my-store". That is how you can use different stores for different indexes at the same time without getting collision of naming inheritance. Document Indexes will map their field names into table names respectively.

```
DATABASE
   |__TABLE map:field (FlexSearch Data) 
   |__TABLE ctx:field (FlexSearch Data) 
   |__TABLE tag:field (FlexSearch Data) 
   |__TABLE cfg:field (FlexSearch Data) 
   |__TABLE reg       (FlexSearch Data) 
```

The default DATABASE in Clickhouse is commonly named `default` and is required to make the first connection for creating the new databases. You can force using a specific default DATABASE by option:

```js
const db = new Database({
    database: "public"
});
```
