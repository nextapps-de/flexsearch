## Result Highlighting

Demo: <a href="https://raw.githack.com/nextapps-de/flexsearch/master/demo/autocomplete.html" target="_blank">Auto-Complete</a>

> Result highlighting could be just enabled when using `Document`-Index with enabled document store by passing option `store` on creation.

Alternatively simply upgrade id-content-pairs to a flat document on-the-fly when calling `.add()`.

```js
// create the document index
const index = new Document({
  document: {
    store: true,
    index: [{
      field: "title",
      tokenize: "forward",
      encoder: Charset.LatinBalance
    }]
  }
});

// add data
index.add({
  "id": 1,
  "title": "Carmencita"
});
index.add({
  "id": 2,
  "title": "Le clown et ses chiens"
});

// perform a query
const result = index.search({
  query: "karmen or clown or not found",
  suggest: true,
  // set enrich to true (required)
  enrich: true,
  // highlight template
  // $1 is a placeholder for the matched partial
  highlight: "<b>$1</b>"
});
```

The result will look like:

```js
[{
  "field": "title",
  "result": [{
      "id": 1,
      "doc": {
        "id": 1,
        "title": "Carmencita"
      },
      "highlight": "<b>Carmen</b>cita"
    },{
      "id": 2,
      "doc": {
        "id": 2,
        "title": "Le clown et ses chiens"
      },
      "highlight": "Le <b>clown</b> et ses chiens"
    }
  ]
}]
```
