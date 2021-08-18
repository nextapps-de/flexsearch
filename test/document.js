import test from 'ava';
import { Document } from '../dist/flexsearch.es.js';

test('Create a Document without errors', t => {
  t.notThrows(() => new Document({
    document: {
      id: 'id',
      field: [
        'data:title',
        'data:body'
      ]
    }
  }));
});

test('Simple document search', t => {
  const doc = new Document({
    document: {
      id: 'id',
      field: [
        'title',
        'content'
      ]
    }
  });

  doc.add({
    id: 1, // credit to animedads on tumblr
    title: 'Dark Souls',
    content: 'Every Soul has its Dark'
  });

  doc.add({
    id: 5,
    title: 'POWER',
    content: 'And it\'s still a very Christian way to think about living'
  });

  doc.add({
    id: 58,
    title: 'Independence Day',
    content: 'Everybody knows you only live a day but it\'s brilliant anyway'
  });

  let searchResult;

  // this should only register one hit, in content
  searchResult = doc.search('has its');
  t.is(searchResult.length, 1);
  t.is(searchResult[0].field, 'content');

  // But if we search for 'Dark' which appears in both title and content, we
  // should get this result twice
  searchResult = doc.search('Dark');
  // there should be two results
  t.is(searchResult.length, 2);
  // One should have field 'title'
  t.truthy(searchResult.find(result => result.field === 'title'));
  // And one should have field 'content'
  t.truthy(searchResult.find(result => result.field === 'content'));

  // This time, we should get two matches, for POWER and Independence Day.
  // But they should both be matches on one field
  searchResult = doc.search('it\'s');
  // Therefore, we should only have one element here
  t.is(searchResult.length, 1);
  // And within that element, two results, 5 and 58
  t.is(searchResult[0].result.length, 2);
  t.assert(searchResult[0].result.includes(5));
  t.assert(searchResult[0].result.includes(58));
});

test('Remove document', t => {
  const doc = new Document({
    document: {
      id: 'id',
      field: [
        'author',
        'content'
      ]
    }
  });

  doc.add({
    id: 9,
    author: 'Q-Tip',
    content: 'before I had status and before I had a pager'
  });

  t.assert(doc.search('before').length > 0);
  doc.remove(9)
  t.is(doc.search('before').length, 0);
});
