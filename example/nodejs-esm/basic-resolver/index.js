import { Index, Resolver } from "flexsearch";

// create a simple index which can store id-content-pairs
const index = new Index({
    tokenize: "forward"
});

// some test data
const data = [
    'cats abcd efgh ijkl dogs pigs rats cute',
    'cats abcd efgh ijkl dogs pigs cute',
    'cats abcd efgh ijkl dogs cute',
    'cats abcd efgh ijkl cute',
    'cats abcd efgh cute',
    'cats abcd cute',
    'cats cute'
];

// add data to the index
data.forEach((item, id) => {
    index.add(id, item);
});

// perform query
const result = new Resolver({
    index: index,
    query: "black"
})
.or({
    index: index,
    query: "cute"
})
.and([{
    index: index,
    query: "dog"
},{
    index: index,
    query: "cat"
}])
.not({
    index: index,
    query: "rat"
})
.resolve();

// display results
result.forEach(i => {
    console.log(data[i]);
});