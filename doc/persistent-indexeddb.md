# IndexedDB FlexSearch

IndexedDB is a persistent storage supported by all major browsers.

Create an index and assign a IndexedDB storage adapter to it by using `index.mount(db)`:

```js
import { Index, IndexedDB } from "../dist/flexsearch.bundle.module.min.js";
// create an index
const index = new Index();
// create db instance with optional namespace
const db = new IndexedDB("my-store");
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

### Table Structure

FlexSearch is creating different `DATABASE` entries for each index name e.g. "my-store". That is how you can use different stores for different indexes at the same time without getting collision of naming inheritance. Document Indexes will map their field names into table names respectively.

```
DATABASE
   |__OBJECTSTORE map:field (FlexSearch Data) 
   |__OBJECTSTORE ctx:field (FlexSearch Data) 
   |__OBJECTSTORE tag:field (FlexSearch Data) 
   |__OBJECTSTORE cfg:field (FlexSearch Data) 
   |__OBJECTSTORE reg       (FlexSearch Data) 
```
