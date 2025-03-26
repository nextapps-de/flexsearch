# MongoDB FlexSearch

MongoDB is a common NoSQL document store providing everything you might want from a solid FlexSearch storage solution.

You'll need to install the npm package `mongodb` into your project:
```bash
npm install mongodb@6.13.0
```

Create an index and assign a MongoDB storage adapter to it by using `index.mount(db)`:

```js
import { Index } from "flexsearch";
import Database from "flexsearch/db/mongodb";
// create an index
const index = new Index();
// create db instance with optional namespace
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

### Custom DB Instance

Pass a valid `mongodb` instance on creation:

```js
import { MongoClient } from "mongodb";
import Database from "flexsearch/db/mongodb";
// assume you've created a custom database instance...
const database = new MongoClient("mongodb://localhost:27017/");
// connect and await
await database.connect();
// pass database instance as option
const db = new Database("my-store", {
    db: database
});
```

For every instance of `DocumentIndex`, `WorkerIndex` or `Index` (as standalone) you'll need to create a `Database` instance having its own name.

### Table Structure

FlexSearch is creating different `DATABASE` entries for each index name e.g. "my-store". That is how you can use different stores for different indexes at the same time without getting collision of naming inheritance. Document Indexes will map their field names into table names respectively.

```
DATABASE
   |__COLLECTION map:field (FlexSearch Data) 
   |__COLLECTION ctx:field (FlexSearch Data) 
   |__COLLECTION tag:field (FlexSearch Data) 
   |__COLLECTION cfg:field (FlexSearch Data) 
   |__COLLECTION reg       (FlexSearch Data) 
```
