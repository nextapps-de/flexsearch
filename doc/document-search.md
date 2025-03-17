
## Merge Document Results

By default, the result set of Field-Search has a structure grouped by field names:
```js
[{
    field: "fieldname-1",
    result: [{
        id: 1001,
        doc: {/* stored document */}
    }]
},{
    field: "fieldname-2",
    result: [{
        id: 1001,
        doc: {/* stored document */}
    }]
},{
    field: "fieldname-3",
    result: [{
        id: 1002,
        doc: {/* stored document */}
    }]
}]
```

By passing the search option `merge: true` the result set will be merged into (group by id):
```js
[{
    id: 1001,
    doc: {/* stored document */}
    field: ["fieldname-1", "fieldname-2"]
},{
    id: 1002,
    doc: {/* stored document */}
    field: ["fieldname-3"]
}]
```

<a name="tag-search"></a>

## Multi-Tag-Search

Assume this document schema (a dataset from IMDB):
```js
{
    "tconst": "tt0000001",
    "titleType": "short",
    "primaryTitle": "Carmencita",
    "originalTitle": "Carmencita",
    "isAdult": 0,
    "startYear": "1894",
    "endYear": "",
    "runtimeMinutes": "1",
    "genres": [
        "Documentary",
        "Short"
    ]
}
```

An appropriate document descriptor could look like:
```js
import LatinEncoder from "./charset/latin/simple.js";

const flexsearch = new Document({
    encoder: LatinEncoder,
    resolution: 3,
    document: {
        id: "tconst",
        //store: true, // document store
        index: [{
            field: "primaryTitle",
            tokenize: "forward"
        },{
            field: "originalTitle",
            tokenize: "forward"
        }],
        tag: [
            "startYear",
            "genres"
        ]
    }
});
```
The field contents of `primaryTitle` and `originalTitle` are encoded by the forward tokenizer. The field contents of `startYear` and `genres` are added as tags.

Get all entries of a specific tag:
```js
const result = flexsearch.search({
    //enrich: true, // enrich documents
    tag: { "genres": "Documentary" },
    limit: 1000,
    offset: 0
});
```

Get entries of multiple tags (intersection):
```js
const result = flexsearch.search({
    //enrich: true, // enrich documents
    tag: { 
        "genres": ["Documentary", "Short"],
        "startYear": "1894"
    }
});
```

Combine tags with queries (intersection):
```js
const result = flexsearch.search({
    query: "Carmen", // forward tokenizer
    tag: { 
        "genres": ["Documentary", "Short"],
        "startYear": "1894"
    }
});
```

Alternative declaration:
```js
const result = flexsearch.search("Carmen", {
    tag: [{
        field: "genres",
        tag: ["Documentary", "Short"]
    },{
        field: "startYear",
        tag: "1894"
    }]
});
```

## Filter Fields (Index / Tags / Datastore)

```js
const flexsearch = new Document({
    document: {
        id: "id",
        index: [{
            // custom field:
            field: "somefield",
            filter: function(data){
                // return false to filter out
                // return anything else to keep
                return true;
            }
        }],
        tag: [{
            field: "city",
            filter: function(data){
                // return false to filter out
                // return anything else to keep
                return true;
            }
        }],
        store: [{
            field: "anotherfield",
            filter: function(data){
                // return false to filter out
                // return anything else to keep
                return true;
            }
        }]
    }
});
```


## Custom Fields (Index / Tags / Datastore)

Dataset example:
```js
{
    "id": 10001,
    "firstname": "John",
    "lastname": "Doe",
    "city": "Berlin",
    "street": "Alexanderplatz",
    "number": "1a",
    "postal": "10178"
}
```

You can apply custom fields derived from data or by anything else:
```js
const flexsearch = new Document({
    document: {
        id: "id",
        index: [{
            // custom field:
            field: "fullname",
            custom: function(data){
                // return custom string
                return data.firstname + " " + 
                       data.lastname;
            }
        },{
            // custom field:
            field: "location",
            custom: function(data){
                return data.street + " " +
                       data.number + ", " +
                       data.postal + " " +
                       data.city;
            }
        }],
        tag: [{
            // existing field
            field: "city"
        },{
            // custom field:
            field: "category",
            custom: function(data){
                let tags = [];
                // push one or multiple tags
                // ....
                return tags;
            }
        }],
        store: [{
            field: "anotherfield",
            custom: function(data){
                // return a falsy value to filter out
                // return anything else as to keep in store
                return data;
            }
        }]
    }
});
```

> Filter is also available in custom functions when returning `false`.

Perform a query against the custom field as usual:
```js
const result = flexsearch.search({
    query: "10178 Berlin Alexanderplatz",
    field: "location"
});
```

```js
const result = flexsearch.search({
    query: "john doe",
    tag: { "city": "Berlin" }
});
```

