import test from 'ava';
import { Index } from '../dist/flexsearch.bundle.js';

test('Create an Index without errors', t => {
  t.notThrows(() => new Index());
});

test('Simple search', t => {
  const idx = new Index();
  idx.add(1, 'foo');
  idx.add(2, 'bar');
  idx.add(5, 'foobar');
  idx.add(12, 'foo bar');

  let searchResult;

  // Try searching for one term
  searchResult = idx.search('foobar');
  t.is(searchResult.length, 1);
  t.is(searchResult[0], 5);

  // Now try searching for a query that will return multiple results
  searchResult = idx.search('foo');
  t.is(searchResult.length, 2);
  t.assert(searchResult.includes(1));
  t.assert(searchResult.includes(12));

  // Searching for a nonsense query should return nothing
  searchResult = idx.search('unrelated');
  t.is(searchResult.length, 0);
});

test('Index (de)serialization', t => {
  const idx = new Index();
  // Sourced from MIT:
  // http://shakespeare.mit.edu/julius_caesar/julius_caesar.3.2.html
  idx.add(1, 'Citizens:');
  idx.add(2, 'We will be satisfied; let us be satisfied.');
  idx.add(3, 'Brutus:');
  idx.add(4, 'Then follow me, and give me audience, friends.');
  idx.add(5, 'Cassius, go you into the other street,');
  idx.add(6, 'And part the numbers.');
  idx.add(7, 'Those that will hear me speak, let \'em stay here;');
  idx.add(8, 'Those that will follow Cassius, go with him;');
  idx.add(9, 'And public reasons shall be rendered');
  idx.add(10, 'Of Caesar\'s death.');

  const serialized = JSON.stringify(idx.serialize());
  const deserialized = Index.deserialize(JSON.parse(serialized));
  t.deepEqual(idx, deserialized);
});

test('Remove a document from the index', t => {
  // Create an index with one doc
  const idx = new Index();
  idx.add(1, 'Lorem ipsum dolor');

  // This search should return one result
  t.is(idx.search('ipsum').length, 1);

  // Remove the doc
  idx.remove(1);
  // Now we should have zero results
  t.is(idx.search('ipsum').length, 0);
});
