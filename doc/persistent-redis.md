# Redis FlexSearch

Redis is a standard storage engine in almost every modern application stack. It combines the advantages of both worlds: the performance of an InMemory engine by also keeping data persistent. The downside is that all the data has to keep in RAM.

You'll need to install the npm package `redis` into your project:
```bash
npm install redis@4.7.0
```

Create an index and assign a Redis storage adapter to it by using `index.mount(db)`:

```js
import { Index } from "flexsearch";
import Database from "flexsearch/db/redis";

// Redis Connection
const config = {
    host: "localhost",
    port: "6379",
    user: null,
    pass: null
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

Pass a valid `redis` instance on creation:

```js
import { createClient } from "redis";
import Database from "flexsearch/db/redis";
// assume you've created a custom redis instance...
const redis = await createClient("redis://localhost:6379").connect();
// pass instance as option
const db = new Database("my-store", {
    db: redis
});
```

### ID Type

Since Redis stores everything as Strings, you'll need to define the type of ID. Otherwise, you'll get back stringify ID results by default.
Also when your data content includes numeric strings (eg. "15712"), defining a type will automatically cast IDs into your choice:

```js
import Database from "flexsearch/db/redis";
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

### Table Structure

FlexSearch is using a prefix style to prevent collision with other existing keys. 

Prefix Schema when no name was set:

```
flexsearch|map:field
flexsearch|ctx:field
flexsearch|tag:field
flexsearch|cfg:field
flexsearch|reg
flexsearch|doc
```

Prefix Schema when name was set e.g. "my-store":

```
my-store|map:field
my-store|ctx:field
my-store|tag:field
my-store|cfg:field
my-store|reg
my-store|doc
```

For every instance of `DocumentIndex`, `WorkerIndex` or `Index` (as standalone) you'll need to create a `Database` instance having its own name. 