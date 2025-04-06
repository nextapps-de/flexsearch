## Big In-Memory Keystores

The default maximum keystore limit for the In-Memory index is 2^24 of distinct terms/partials being stored (cardinality).
An additional register could be enabled and is dividing the index into self-balanced partitions.
The extended keystore is supported by any type of index.

```js
const index = new Index({
    // e.g. set keystore range to 8-Bit:
    // 2^8 * 2^24 = 2^32 keys total
    keystore: 8 
});
```

You can theoretically store up to 2^88 keys (64-Bit address range).

The internal ID arrays scales automatically when limit of 2^31 has reached by using Proxy.

> Persistent storages has no keystore limit by default.
> You should not enable keystore when using persistent indexes, as long as you do not stress the buffer too hard before calling `index.commit()`.

There is no additional memory cost when using a Keystore.