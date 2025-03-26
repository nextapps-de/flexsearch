# SQLite FlexSearch

SQLite offers you a compact and resource-friendly database which stores right into a portable db file on your filesystem.

You'll need to install the npm package `sqlite3` into your project:
```bash
npm install sqlite3@5.1.7
```

Create an index and assign a SQLite storage adapter to it by using `index.mount(db)`:

```js
import { Index } from "flexsearch";
import Database from "flexsearch/db/sqlite";

// create an index
const index = new Index();
// create db instance with optional prefix
const db = new Database("my-store");
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

### Custom Filepath

```js
// set the filepath without passing a name:
const db = new Database({
    path: "./path-to-db/main.db"
});

// ...
await index.mount(db);
```

For any instance you made from type `DocumentIndex`, `WorkerIndex` or `Index` (as standalone) you'll need to create a `Database` instance having its own path.

### Custom DB Instance

Pass a valid `sqlite3` instance on creation:

```js
import sqlite3 from "sqlite3";
import Database from "flexsearch/db/sqlite";

// assume you've created a custom database instance...
const database = new sqlite3.Database("./path-to-db/main.db");

// pass database instance as option
const db = new Database("my-store", {
    db: database
});

// ...
await index.mount(db);
```

### ID Type

The SQLite driver does not properly support upgrading a key field type by ALTER TABLE. Therefore, the default type for ID is `text`.

You can save required disk space and also gain performance when defining a numeric ID type expicitely.

```js
// pass type in options
const db = new Database("my-store", {
    type: "integer"
});
```

BigInt Range:

```js
const db = new Database("my-store", {
    type: "bigint"
});
```

To change the ID type later you'll need to delete and re-create the index by calling `index.db.destroy()`.

### In-Memory Engine

You can switch to SQLite native In-Memory store by passing `:memory:` as a name:

```js
const db = new Database(":memory:");
```

## Table Structure

FlexSearch is creating different files for each index name e.g. "my-store". That is how you can use different stores for different indexes at the same time without getting collision of naming inheritance. Document Indexes will map their field names into table names respectively.

```
FILENAME
  |__ MAIN
        |__TABLES map:field (FlexSearch Data) 
        |__TABLES ctx:field (FlexSearch Data) 
        |__TABLES tag:field (FlexSearch Data) 
        |__TABLES cfg:field (FlexSearch Data) 
        |__TABLES reg       (FlexSearch Data) 
```
