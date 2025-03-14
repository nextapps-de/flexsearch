const { Index } = require("flexsearch");

// create a simple index which can store id-content-pairs
const index = new Index({
    tokenize: "forward"
});

// some test data
const data = [
    'cats abcd efgh ijkl mnop qrst uvwx cute',
    'cats abcd efgh ijkl mnop qrst cute',
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
const result = index.search({
    query: "black dog or cute cat",
    suggest: true
});

// display results
result.forEach(i => {
    console.log(data[i]);
});