## Asynchronous Runtime Balancer

> The async processing model is automatically observed by a runtime balancer to prevent any blocking issues, even on page load.

The most methods of each index type provides an async version, e.g.:

- addAsync()
- updateAsync()
- removeAsync()
- searchAsync()

All those async versions always return a `Promise`, although a callback can be passed additionally as the <u>last parameter</u>.

When calling async methods of the index, a runtime balancer observe the current event loop and will pass to the next event loop automatically.

You can control how early the process should move over to the next event loop by passing the option property `priority`:

```js
const index = new Index({
    // a value between 1 and 9
    priority: 4
});
```

The lowest valid priority number is `1` and is typically known as `idle` (event loop cycles by native ~4ms). The default priority is `4` which is optimized for non-blocking user interfaces within a browser (event loop cycles every ~45ms).
When you have some very smooth running animation you should use a priority of `2` to keep the animation running by 60 fps without any stutter. Targeting 120 fps or higher you should use `1`.

On Node.js you can slightly increase this priority e.g. to `6`, because here there is no UI involved. 
A priority value of `9` will cycle the event loop on every ~250ms which is the maximum recommended blocking time. You should not use a value higher than this.

Do not forget to `await` on <u>every</u> async task you apply to the index:

```js
for(let i = 0; i < 99999999; i++){
    await index.addAsync(i, "test " + i);
}
```

You can perform queries to the index during any other async batch is running.