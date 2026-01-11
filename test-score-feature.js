/**
 * Quick test for score feature
 */

import FlexSearch from './dist/module/bundle.js';
const { Index } = FlexSearch;

console.log('Testing Score Feature...\n');

const index = new Index();

// Add some test data
index.add(1, "hello world");
index.add(2, "hello flexsearch");
index.add(3, "world peace");
index.add(4, "flexsearch is fast");

console.log('Added 4 documents:');
console.log('  1: "hello world"');
console.log('  2: "hello flexsearch"');
console.log('  3: "world peace"');
console.log('  4: "flexsearch is fast"\n');

// Test 1: Search without scores (default)
console.log('Test 1: Search without scores (default)');
const results1 = index.search("hello");
console.log('Results:', results1);
console.log('Type check:', typeof results1[0] === 'number' ? '✓ Plain IDs' : '✗ Unexpected format');
console.log('');

// Test 2: Search with scores
console.log('Test 2: Search with scores (score: true)');
const results2 = index.search("hello", { score: true });
console.log('Results:', JSON.stringify(results2, null, 2));
if (results2.length > 0 && typeof results2[0] === 'object' && results2[0].id && typeof results2[0].score === 'number') {
    console.log('✓ Results have score objects with id and score properties');
    console.log('  First result:', `id=${results2[0].id}, score=${results2[0].score}`);
} else {
    console.log('✗ Results format incorrect');
}
console.log('');

// Test 3: Multi-term search with scores
console.log('Test 3: Multi-term search with scores');
const results3 = index.search("hello world", { score: true });
console.log('Results:', JSON.stringify(results3, null, 2));
if (results3.length > 0 && typeof results3[0] === 'object' && results3[0].id) {
    console.log('✓ Multi-term search with scores works');
} else {
    console.log('✗ Multi-term search failed');
}
console.log('');

// Test 4: Search with suggestions and scores
console.log('Test 4: Search with suggestions and scores');
const results4 = index.search("helo", { score: true, suggest: true });
console.log('Results:', JSON.stringify(results4, null, 2));
if (results4.length > 0) {
    console.log('✓ Suggestions with scores work');
} else {
    console.log('✗ Suggestions failed');
}
console.log('');

console.log('All tests completed!');
