import { Index } from "flexsearch";

// you will need to keep the index configuration
// they will not export, also every change to the
// configuration requires a full re-index
const config = {
    tokenize: "forward"
};

// create a simple index which can store id-content-pairs
let index = new Index(config);

// some test data
const data = [
    'cats abcd efgh ijkl mnop qrst uvwx cute',
    'cats abcd efgh ijkl mnop qrst cute',
    'cats abcd efgh ijkl mnop cute',
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
let result = index.search("cute cat");

// display results
result.forEach(i => {
    console.log(data[i]);
});

// -----------------------
// EXPORT
// -----------------------

import { promises as fs } from "fs";

await fs.mkdir("./export/").catch(e => {});
await index.export(async function(key, data){
    await fs.writeFile("./export/" + key, data, "utf8");
});

// -----------------------
// IMPORT
// -----------------------

// create the same type of index you have used by .export()
// along with the same configuration
index = new Index(config);

// load them in parallel
const files = await fs.readdir("./export/");
await Promise.all(files.map(async file => {
    const data = await fs.readFile("./export/" + file, "utf8");
    index.import(file, data);
}))

// perform query
result = index.search("cute cat");

// display results
console.log("-------------------------------------");
result.forEach(i => {
    console.log(data[i]);
});
