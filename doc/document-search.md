# Document Search (Field-Search)

Whereas the simple `Index` can just consume id-content pairs, the `Document`-Index is able to process more complex data structures like JSON.
Technically, a `Document`-Index is a layer on top of several default indexes. You can create multiple independent Document-Indexes in parallel, any of them can use the `Worker` or `Persistent` model optionally.

FlexSearch Documents also contain these features:

- Document Store including Enrichment
- Multi-Field-Search
- Multi-Tag-Search
- Resolver (Chain Complex Queries)
- Result Highlighting
- Export/Import
- Worker
- Persistent

## The Document Descriptor

When creating a `Document`-Index you will need to define a document descriptor in the field `document`. This descriptor is including any specific information about how the document data should be indexed.

Assuming our document has a simple data structure like this:

```json
{ 
    "id": 0, 
    "content": "some text"
}
```

An appropriate Document Descriptor has always to define at least 2 things:

1. the property `id` describes the location of the document ID within a document item
2. the property `index` (or `tag`) containing one or multiple fields from the document, which should be indexed for searching

```js
// create a document index
const index = new Document({
    document: {
        id: "id",
        index: "content"
    }
});

// add documents to the index
index.add({ 
    id: 0, 
    content: "some text"
});
```

As briefly explained above, the field `id` describes where the ID or unique key lives inside your documents. When not passed it will always take the field `id` from the top level scope of your data.

The property `index` takes all fields you would like to have indexed. When just selecting one field, then you can pass a string.

The next example will add 2 fields `title` and `content` to the index:

```js
var docs = [{
    id: 0,
    title: "Title A",
    content: "Body A"
},{
    id: 1,
    title: "Title B",
    content: "Body B"
}];
```

```js
const index = new Document({
    id: "id",
    index: ["title", "content"]
});
```

Add both fields to the document descriptor and pass individual [Index-Options](options.md) for each field:

```js
const index = new Document({
    id: "id",
    index: [{
        field: "title",
        tokenize: "forward",
        encoder: Charset.LatinAdvanced,
        resolution: 9
    },{
        field:  "content",
        tokenize: "forward",
        encoder: Charset.LatinAdvanced,
        resolution: 3
    }]
});
```

Field options inherits from top level options when passed, e.g.:

```js
const index = new Document({
    tokenize: "forward",
    encoder: Charset.LatinAdvanced,
    resolution: 9,
    document: {
        id: "id",
        index:[{
            field: "title"
        },{
            field: "content",
            resolution: 3
        }]
    }
});
```

> Assigning the `Encoder` instance to the top level configuration will share the encoder to all fields. You should avoid this when contents of fields don't have the same type of content (e.g. one field contains terms, another contains numeric IDs).

### Nested Data Fields (Complex Objects)

Assume the document array looks more complex (has nested branches etc.), e.g.:

```json
{
  "record": {
    "id": 0,
    "title": "some title",
    "content": {
      "header": "some text",
      "footer": "some text"
    }
  }
}
```

Then use the colon separated notation `root:child:child` as a name for each field defining the hierarchy which corresponds to the document:

```js
const index = new Document({
    document: {
        id: "record:id",
        index: [
            "record:title",
            "record:content:header",
            "record:content:footer"
        ]
    }
});
```

> [!TIP]
> Just add fields you want to query against. Do not add fields to the index, you just need in the result. For this purpose you can store documents independently of its index (read below).

To query against one or multiple specific fields you have to pass the exact key of the field you have defined in the document descriptor as a field name (with colon syntax):

```js
index.search(query, {
    index: [
        "record:title",
        "record:content:header",
        "record:content:footer"
    ]
});
```

Same as:

```js
index.search(query, [
    "record:title",
    "record:content:header",
    "record:content:footer"
]);
```

Using field-specific options:

```js
index.search("some query", [{
    field: "record:title",
    limit: 100,
    suggest: true
},{
    field: "record:content:header",
    limit: 100,
    suggest: false
}]);
```

You can also perform a search through the same field with different queries:

```js
index.search([{
    field: "record:title",
    query: "some query",
    limit: 100,
    suggest: true
},{
    field: "record:title",
    query: "some other query",
    limit: 100,
    suggest: true
}]);
```

### Complex Documents

You need to follow 2 rules for your documents:

1. The document cannot start with an Array __at the root__. This will introduce sequential data and isn't supported yet. See below for a workaround for such data.

```js
[ // <-- not allowed as document start!
  {
    "id": 0,
    "title": "title"
  }
]
```

2. The document ID can't be nested __inside an Array__. This will introduce sequential data and isn't supported yet. See below for a workaround for such data.

```js
{
  "records": [ // <-- not allowed when ID or tag lives inside!
    {
      "id": 0,
      "title": "title"
    }
  ]
}
```

Here an example for a supported complex document:

```json
{
  "meta": {
    "tag": "cat",
    "id": 0
  },
  "contents": [
    {
      "body": {
        "title": "some title",
        "footer": "some text"
      },
      "keywords": ["some", "key", "words"]
    },
    {
      "body": {
        "title": "some title",
        "footer": "some text"
      },
      "keywords": ["some", "key", "words"]
    }
  ]
}
```

The corresponding document descriptor (when all fields should be indexed) looks like:

```js
const index = new Document({
    document: {
        id: "meta:id",
        index: [
            "contents:body:title",
            "contents:body:footer"
        ],
        tag: [
            "meta:tag",
            "contents:keywords"
        ]
    }
});
```

Remember when searching you have to use the same colon-separated-string as a key from your field definition.

```js
index.search(query, { 
    index: "contents:body:title"
});
```

### Not Supported Documents (Sequential Data)

This example breaks both rules described above:

```js
[ // <-- not allowed as document start!
  {
    "tag": "cat",
    "records": [ // <-- not allowed when ID or tag lives inside!
      {
        "id": 0,
        "body": {
          "title": "some title",
          "footer": "some text"
        },
        "keywords": ["some", "key", "words"]
      },
      {
        "id": 1,
        "body": {
          "title": "some title",
          "footer": "some text"
        },
        "keywords": ["some", "key", "words"]
      }
    ]
  }
]
```

You need to unroll your data within a simple loop before adding to the index.

A workaround to such a data structure from above could look like:

```js
const index = new Document({
    document: {
        id: "id",
        index: [
            "body:title",
            "body:footer"
        ],
        tag: [
            "tag",
            "keywords"
        ]
    }
});

function add(sequential_data){

    for(let x = 0, item; x < sequential_data.length; x++){

        item = sequential_data[x];

        for(let y = 0, record; y < item.records.length; y++){
            record = item.records[y];
            // append tag to each record
            record.tag = item.tag;
            // add to index
            index.add(record);
        }
    }  
}

// now just use add() helper method as usual:
add([{
    // sequential structured data
    // take the data example above
}]);
```

### Add/Update/Remove Documents

Add a document to the index:

```js
index.add({
    id: 0,
    title: "Foo",
    content: "Bar"
});
```

Update index:

```js
index.update({
    id: 0,
    title: "Foo",
    content: "Foobar"
});
```

Remove a document and all its contents from an index, by ID:

```js
index.remove(id);
```

Or by the document data:

```js
index.remove(doc);
```

<!--
### Join / Append Arrays

On the complex example above, the field `keywords` is an array but here the markup did not have brackets like `keywords[]`. That will also detect the array but instead of appending each entry to a new context, the array will be joined into on large string and added to the index.

The difference of both kinds of adding array contents is the relevance when searching. When adding each item of an array via `append()` to its own context by using the syntax `field[]`, then the relevance of the last entry concurrent with the first entry. When you left the brackets in the notation, it will join the array to one whitespace-separated string. Here the first entry has the highest relevance, whereas the last entry has the lowest relevance.

So assuming the keyword from the example above are pre-sorted by relevance to its popularity, then you want to keep this order (information of relevance). For this purpose do not add brackets to the notation. Otherwise, it would take the entries in a new scoring context (the old order is getting lost).

Also you can left bracket notation for better performance and smaller memory footprint. Use it when you did not need the granularity of relevance by the entries.
-->

## Field-Search

Search through all fields:

```js
index.search(query);
```

Search through a specific field:

```js
index.search(query, { index: "title" });
```

Search through a given set of fields:

```js
index.search(query, { index: ["title", "content"] });
```

Pass custom options and/or queries to each field:

```js
index.search([{
    field: "content",
    query: "some query",
    limit: 100,
    suggest: true
},{
    field: "content",
    query: "some other query",
    limit: 100,
    suggest: true
}]);
```

### Limit & Offset

> By default, every query is limited to 100 entries. Unbounded queries leads into issues. You need to set the limit as an option to adjust the size.

You can set the limit and the offset for each query:

```js
index.search(query, { limit: 20, offset: 100 });
```

> You cannot pre-count the size of the result-set. That's a limit by the design of FlexSearch. When you really need a count of all results you are able to page through, then just assign a high enough limit and get back all results and apply your paging offset manually (this works also on server-side). FlexSearch is fast enough that this isn't an issue.

[See all available field-search options](options.md)

## The Result Set

Schema of the result-set:

> `fields[] => { field, result[] => { document }}`

The first index is an array of fields the query was applied to. Each of this field has a record (object) with 2 properties "field" and "result". The "result" is also an array and includes the result for this specific field. The result could be an array of IDs or as enriched with stored document data.

A non-enriched result set now looks like:

```js
[{
    field: "title",
    result: [0, 1, 2]
},{
    field: "content",
    result: [3, 4, 5]
}]
```

An enriched result set now looks like:

```js
[{
    field: "title",
    result: [
        { id: 0, doc: { /* document */ }},
        { id: 1, doc: { /* document */ }},
        { id: 2, doc: { /* document */ }}
    ]
},{
    field: "content",
    result: [
        { id: 3, doc: { /* document */ }},
        { id: 4, doc: { /* document */ }},
        { id: 5, doc: { /* document */ }}
    ]
}]
```

When using `pluck` instead of "field" you can explicitly select just one field and get back a flat representation:

```js
index.search(query, { pluck: "title", enrich: true });
```

```js
[
    { id: 0, doc: { /* document */ }},
    { id: 1, doc: { /* document */ }},
    { id: 2, doc: { /* document */ }}
]
```

This result set is a replacement of "boolean search". Instead of applying your bool logic to a nested object, you can apply your logic by yourself on top of the result-set dynamically. This opens hugely capabilities on how you process the results. Therefore, the results from the fields aren't squashed into one result anymore. That keeps some important information, like the name of the field as well as the relevance of each field results which didn't get mixed anymore.

> A field search will apply a query with the boolean "or" logic by default. Each field has its own result to the given query.

There is one situation where the `bool` property is being still supported. When you like to switch the default "or" logic from the field search into "and", e.g.:

```js
index.search(query, { 
    index: ["title", "content"],
    bool: "and" 
});
```

You will just get results which contains the query in both fields. That's it.

### Tags

Like the `key` for the ID just define the path to the tag:

```js
const index = new Document({
    document: { 
        id: "id",
        tag: "tag",
        index: "content"
    }
});
```

```js
index.add({
    id: 0,
    tag: "cat",
    content: "Some content ..."
});
```

Your data also can have multiple tags as an array:

```js
index.add({
    id: 1,
    tag: ["animal", "dog"],
    content: "Some content ..."
});
```

You can perform a tag-specific search by:

```js
index.search(query, { 
    index: "content",
    tag: "animal" 
});
```

This just gives you result which was tagged with the given tag.

Use multiple tags when searching:

```js
index.search(query, { 
    index: "content",
    tag: ["cat", "dog"]
});
```

This gives you result which are tagged with one of the given tag.


You will just get results which contains both tags (in this example there is just one records which has the tag "dog" and "animal").

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
import Charset from "flexsearch";
const flexsearch = new Document({
    encoder: Charset.Normalize,
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

## Document Store

Only a document index can have a store. You can use a document index instead of a flat index to get this functionality also when only storing ID-content-pairs.

You can define independently which fields should be indexed and which fields should be stored. This way you can index fields which should not be included in the search result.

> Do not use a store when: 1. an array of IDs as the result is good enough, or 2. you already have the contents/documents stored elsewhere (outside the index).

> When the `store` attribute was set, you have to include all fields which should be stored explicitly (acts like a whitelist).

> When the `store` attribute was not set, the original document is stored as a fallback.

This will add the whole original content to the store:

```js
const index = new Document({
    document: { 
        index: "content",
        store: true
    }
});

index.add({ id: 0, content: "some text" });
```

### Access documents from internal store

You can get indexed documents from the store:

```js
var data = index.get(1);
```

You can update/change store contents directly without changing the index by:

```js
index.set(1, data);
```

To update the store and also update the index then just use `index.update`, `index.add` or `index.append`.

When you perform a query, weather it is a document index or a flat index, then you will always get back an array of IDs.

Optionally you can enrich the query results automatically with stored contents by:

```js
index.search(query, { enrich: true });
```

Your results look now like:

```js
[{
    id: 0,
    doc: { /* content from store */ }
},{
    id: 1,
    doc: { /* content from store */ }
}]
```

### Configure Storage (Recommended)

This will add just specific fields from a document to the store (the ID isn't necessary to keep in store):

```js
const index = new Document({
    document: {
        index: "content",
        store: ["author", "email"]
    }
});

index.add(id, content);
```

You can configure independently what should being indexed and what should being stored. It is highly recommended to make use of this whenever you can.

Here a useful example of configuring doc and store:

```js
const index = new Document({
    document: { 
        index: "content",
        store: ["author", "email"] 
    }
});

index.add({
    id: 0,
    author: "Jon Doe",
    email: "john@mail.com",
    content: "Some content for the index ..."
});
```

You can query through the contents and will get back the stored values instead:

```js
index.search("some content", { enrich: true });
```

Your results are now looking like:

```js
[{
    field: "content",
    result: [{
        id: 0,
        doc: {
            author: "Jon Doe",
            email: "john@mail.com",
        }
    }]
}]
```

Both field "author" and "email" are not indexed.


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

### Best Practices: Merge Documents

[Read here](encoder.md#merge-documents)
