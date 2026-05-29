## Result Highlighting

Demo: <a href="https://raw.githack.com/nextapps-de/flexsearch/master/demo/autocomplete.html" target="_blank">Auto-Complete</a>

> Result highlighting could be just enabled when using `Document`-Index with enabled document store by passing option `store` on creation.

Alternatively you can simply upgrade id-content-pairs to a flat document when calling `.add(...)`.

```js
// 1. create the document index
const index = new Document({
  document: {
    // using store is required
    store: true,
    index: [{
      field: "title",
      tokenize: "forward",
      encoder: Charset.LatinBalance
    }]
  }
});

// 2. add data
index.add({
  "id": 1,
  "title": "Carmencita"
});
index.add({
  "id": 2,
  "title": "Le clown et ses chiens"
});

// 3. perform a query
const result = index.search({
  query: "karmen or clown or not found",
  // also get results when query has no exact match
  suggest: true,
  // use highlighting options or pass a template, where $1 is
  // a placeholder for the matched partial
  highlight: "<b>$1</b>",
  // optionally pick and apply search to just
  // one field and get back a flat result
  pluck: "title"
});
```

The result will look like:

```json
[{
  "id": 1,
  "highlight": "<b>Carmen</b>cita"
},{
  "id": 2,
  "highlight": "Le <b>clown</b> et ses chiens"
}]
```

There are several options to customize result highlighting.

### Highlighting Options

|          |        |                                                                                                                   |             |
|----------|--------|-------------------------------------------------------------------------------------------------------------------|-------------|
| Option   | Values | Description                                                                                                       | Default     |
| template | String | The template to be applied on matches (e.g. "&lt;b>$1&lt;/b>"), where $1 is a placeholder for the matched partial | (mandatory) |
| boundary | Boundary Options
            Number | Limit the total length of highlighted content (add ellipsis by default). The template markup does not stack to the total length. | false |
| ellipsis | Ellipsis Options
            Boolean
            String | Define a custom ellipsis or disable | "..." |
| merge | Boolean | Wrap consecutive matches by just a single template | false |
| clip | Boolean | Allow to clip terms | true |
| Boundary Options |
| boundary.total | Number | Limit the total length of highlighted content | false |
| boundary.before | Number | Limit the length of content before highlighted parts | (auto) |
| boundary.after | Number | Limit the length of content after highlighted parts | (auto) |
| Ellipsis Options |
| ellipsis.template | String | The template to be applied on ellipsis (e.g. "&lt;i>$1&lt;/i>"), where $1 is a placeholder for the ellipsis | (mandatory) |
| ellipsis.pattern | Boolean
            String | Define a custom ellipsis or disable | "..." |


### Boundaries & Alignment

You can limit the length of the highlighted content and also define a custom ellipsis.
By default, all matches are automatically aligned to fit into the total size. You can customize these boundaries when also passing limits for surrounded text.

Add some content to the index:
```js
index.add({
    "id": 1,
    "title": "Lorem ipsum dolor sit amet consetetur sadipscing elitr."
});
```

Perform a highlighted search (no boundaries):
```js
const result = index.search({
  query: "sit amet",
  highlight: "<b>$1</b>"
});
```

Result:
```js
"Lorem ipsum dolor <b>sit</b> <b>amet</b> consetetur sadipscing elitr."
```
___

#### Limit total boundary
```js
const result = index.search({
  query: "sit amet",
  highlight: {
    template: "<b>$1</b>",
    boundary: 32
  }
});
```
> The highlight markup does not stack to the total length.
>
Result:
```js
"...um dolor <b>sit</b> <b>amet</b> consetet..."
```
___

#### Define custom ellipsis (text)
```js
const result = index.search({
  query: "sit amet",
  highlight: {
    template: "<b>$1</b>",
    boundary: 32,
    ellipsis: "[...]"
  }
});
```

Result:
```js
"[...] dolor <b>sit</b> <b>amet</b> conset[...]"
```

You can also apply `""` or `false` to remove ellipsis.
___

#### Do not clip terms
```js
const result = index.search({
  query: "sit amet",
  highlight: {
    template: "<b>$1</b>",
    boundary: 32,
    clip: false
  }
});
```

Result:
```js
"... dolor <b>sit</b> <b>amet</b> ..."
```
---

#### Merge consecutive matches
```js
const result = index.search({
  query: "sit amet",
  highlight: {
    template: "<b>$1</b>",
    boundary: 32,
    merge: true
  }
});
```

Result:
```js
"...um dolor <b>sit amet</b> consetet..."
```
---

#### Limit surrounded text

> Each of the boundary limits are optionally. Combine them as needed.

```js
const result = index.search({
  query: "sit amet",
  highlight: {
    template: "<b>$1</b>",
    boundary: {
      // length before match
      before: 3,
      // length after match
      after: 15,
      // overall length
      total: 32
    }
  }
});
```

Result:
```js
"...or <b>sit</b> <b>amet</b> consetetur sad..."
```

#### Use custom ellipsis (markup)

When using markup within `ellipsis`, the markup length stack up to the total boundary. You can provide a `template` also for ellipsis to apply total boundary properly by do not stack up the markup length.

```js
const result = index.search({
  query: "sit amet",
  highlight: {
    template: "<b>$1</b>",
    // limit the total length to 32 chars
    boundary: 32,
    ellipsis: {
        // pass a template, where $1 is
        // a placeholder for the ellipsis
        template: "<i>$1</i>",
        // define custom ellipsis
        pattern: "..."
    }
  }
});
```

Result:
```js
"<i>...</i> dolor <b>sit</b> <b>amet</b> conset<i>...</i>"
```

### Using Result Highlighting on Resolver

When using complex queries by `Resolver` you can pass a highlight option to any one of the resolver stages that is also including a query. The last resolver stage will then automatically inherit necessary options.

```js
const raw = new Resolver({
  index: index,
  field: "title",
  query: "some query"
})
.or({
    field: "title",
    // highlight requires a query
    query: "highlight this",
    // define on a single resolver stage
    highlight: { /* ... */ }
})
.not({
    field: "title",
    query: "undefined",
})
.resolve();
```