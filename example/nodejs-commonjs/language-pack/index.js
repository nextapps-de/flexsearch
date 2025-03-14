const { Index, Encoder, Charset } = require("flexsearch");
const EnglishPreset = require("flexsearch/lang/en");

const encoder = new Encoder(
    Charset.LatinSimple,
    EnglishPreset
);

// create a simple index which can store id-content-pairs
const index = new Index({
    tokenize: "forward",
    encoder: encoder
});

// some test data
const data = [
    'She doesn’t get up at six o’clock.',
    'It\'s been raining for five hours now.'
];

// add data to the index
data.forEach((item, id) => {
    index.add(id, item);
});

// perform query
let result = index.search("she does not at clock");

// display results
result.forEach(i => {
    console.log(data[i]);
    console.log("-------------------------------------");
});

// perform query
result = index.search("it is raining");

// display results
result.forEach(i => {
    console.log(data[i]);
});
