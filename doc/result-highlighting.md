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

<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td><code>template</code></td>
        <td>
            String
        </td>
        <td>The template to be applied on matches (e.g. <code>"&lt;b>$1&lt;/b>"</code>), where <code>$1</code> is a placeholder for the matched partial</td>
        <td style="font-style: italic">(mandatory)</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>boundary</code></td>
        <td>
            <a href="#highlighting-boundary-options">Boundary Options</a><br>
            Number
        </td>
        <td>Limit the total length of highlighted content (add ellipsis by default). The template markup does not stack to the total length.</td>
        <td><code>false</code></td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>ellipsis</code></td>
        <td>
            <a href="#highlighting-ellipsis-options">Ellipsis Options</a><br>
            Boolean<br>
            String
        </td>
        <td>
            Define a custom ellipsis or disable
        </td>
        <td><code>"..."</code></td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>merge</code></td>
        <td>
            Boolean
        </td>
        <td>Wrap consecutive matches by just a single template</td>
        <td><code>false</code></td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>clip</code></td>
        <td>
            Boolean
        </td>
        <td>Allow to clip terms</td>
        <td><code>true</code></td>
    </tr>
    <tr>
        <td colspan="4"><a id="highlighting-boundary-options"></a>Boundary Options</td>
    </tr>
    <tr>
        <td><code>boundary.total</code></td>
        <td>
            Number
        </td>
        <td>Limit the total length of highlighted content</td>
        <td><code>false</code></td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>boundary.before</code></td>
        <td>
            Number
        </td>
        <td>Limit the length of content before highlighted parts</td>
        <td style="font-style: italic">(auto)</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>boundary.after</code></td>
        <td>
            Number
        </td>
        <td>Limit the length of content after highlighted parts</td>
        <td style="font-style: italic">(auto)</td>
    </tr>
    <tr>
        <td colspan="4"><a id="highlighting-ellipsis-options"></a>Ellipsis Options</td>
    </tr>
    <tr>
        <td><code>ellipsis.template</code></td>
        <td>
            String
        </td>
        <td>The template to be applied on ellipsis (e.g. <code>"&lt;i>$1&lt;/i>"</code>), where <code>$1</code> is a placeholder for the ellipsis</td>
        <td style="font-style: italic">(mandatory)</td>
    </tr>
    <tr></tr>
    <tr>
        <td><code>ellipsis.pattern</code></td>
        <td>
            Boolean<br>
            String
        </td>
        <td>
            Define a custom ellipsis or disable
        </td>
        <td><code>"..."</code></td>
    </tr>
</table>

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
