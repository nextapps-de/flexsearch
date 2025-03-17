## Custom Score Function

```js
const index = new FlexSearchIndex({
    resolution: 10,
    score: function(content, term, term_index, partial, partial_index){
        // you'll need to return a number between 0 and "resolution"
        // score is starting from 0, which is the highest score
        // for a resolution of 10 you can return 0 - 9
        // ... 
        return 3;
    } 
});
```

A common situation is you have some predefined labels which are related to some kind of order, e.g. the importance or priority. A priority label could be `high`, `moderate`, `low` so you can derive the scoring from those properties. Another example is when you have something already ordered and you would like to keep this order as relevance.

Probably you won't need the parameters passed to the score function. But when needed here are the parameters from the score function explained:

1. `content` is the whole content as an array of terms (encoded)
2. `term` is the current term which is actually processed (encoded)
3. `term_index` is the index of the term in the content array
4. `partial` is the current partial of a term which is actually processed
5. `partial_index` is the index position of the partial within the term

Partials params are empty when using tokenizer `strict`. Let's take an example by using the tokenizer `full`.

The content: "This is an ex[amp]()le of partial encoding"<br>
The highlighting part marks the partial which is actually processed. Then your score function will called by passing these parameters:

```js
function score(content, term, term_index, partial, partial_index){
    content = ["this", "is", "an", "example", "of", "partial", "encoding"]
    term = "example"
    term_index = 3
    partial = "amp"
    partial_index = 2
} 
```
