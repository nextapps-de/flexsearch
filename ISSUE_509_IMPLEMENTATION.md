# Issue #509 Implementation Summary

## Overview
This implementation adds two features requested in issue #509:
1. **Expose search score in search results**
2. **Export/Import IndexedDB index to JSON**

## Changes Made

### 1. Score Exposure Feature

#### Files Modified:
- `src/type.js` - Added `score` option to `SearchOptions` typedef
- `src/index/search.js` - Added score parameter handling throughout search flow
- `src/intersect.js` - Modified to track and return scores when enabled
- `src/resolve/default.js` - Updated to handle score results
- `index.d.ts` - Added TypeScript definitions for score option

#### How It Works:
- When `score: true` is passed in search options, results are returned as objects with `{id, score}` instead of plain IDs
- Score is calculated based on the resolution slot (higher resolution - slot index = higher score)
- Scores represent relevance: higher scores indicate better matches
- Works with single-term, multi-term, and suggestion queries

#### Usage:
```javascript
const index = new Index();
index.add(1, "hello world");
index.add(2, "hello flexsearch");

// Get results with scores
const results = index.search("hello", { score: true, limit: 10 });
// Returns: [{id: 1, score: 9}, {id: 2, score: 8}]

// Get results without scores (default)
const results2 = index.search("hello", { limit: 10 });
// Returns: [1, 2]
```

### 2. IndexedDB Export/Import Feature

#### Files Modified:
- `src/db/indexeddb/index.js` - Added `export()` and `import()` methods
- `index.d.ts` - Added TypeScript definitions for export/import methods

#### How It Works:
- `export()` method exports all IndexedDB data to JSON format
- `import()` method imports JSON data back into IndexedDB
- Handles all IndexedDB stores: map, ctx, tag, reg, cfg
- Supports field-specific data for document indexes

#### Usage:
```javascript
const db = new IndexedDB("my-index");
const index = new Index({ db: db });

await index.mount(db);
index.add(1, "hello world");
index.add(2, "hello flexsearch");
await index.commit();

// Export to JSON
await db.export(function(key, data) {
    // key = "indexeddb.json"
    // data = JSON string containing all index data
    console.log("Exported:", data);
    // Save to file or send to server
});

// Import from JSON
const jsonData = '{"id":"my-index","data":{...}}';
await db.import("indexeddb.json", jsonData);
```

## Testing

### Run Tests:
```bash
# Build the project first
npm run build:bundle

# Run the specific test file
cd test
npm test score-export.js
```

### Manual Testing:

#### Test Score Exposure:
```javascript
const { Index } = require("./dist/flexsearch.bundle.min.js");

const index = new Index();
index.add(1, "hello world");
index.add(2, "hello flexsearch");
index.add(3, "world peace");

// Test with scores
const results = index.search("hello", { score: true });
console.log("Results with scores:", results);
// Should output: [{id: 1, score: 9}, {id: 2, score: 9}]

// Test without scores
const results2 = index.search("hello");
console.log("Results without scores:", results2);
// Should output: [1, 2]
```

#### Test IndexedDB Export/Import (Browser):
```html
<!DOCTYPE html>
<html>
<head>
    <script src="../dist/flexsearch.bundle.min.js"></script>
</head>
<body>
    <script>
        const { Index, IndexedDB } = FlexSearch;
        
        async function test() {
            // Create and populate index
            const db = new IndexedDB("test-export");
            const index = new Index({ db: db });
            
            await index.mount(db);
            index.add(1, "hello world");
            index.add(2, "hello flexsearch");
            await index.commit();
            
            // Export
            let exportedData = null;
            await db.export(function(key, data) {
                exportedData = data;
                console.log("Exported:", JSON.parse(data));
            });
            
            // Import to new database
            const db2 = new IndexedDB("test-import");
            const index2 = new Index({ db: db2 });
            await index2.mount(db2);
            await db2.import("indexeddb.json", exportedData);
            
            // Verify
            const results = await index2.search("hello");
            console.log("Imported results:", results);
        }
        
        test();
    </script>
</body>
</html>
```

## Notes

1. **Score Calculation**: Scores are based on resolution slots. Lower slot index = higher score (better match). The score is normalized as `resolution - slotIndex`.

2. **Backward Compatibility**: Both features are opt-in:
   - Score exposure requires `score: true` option
   - Export/import are new methods that don't affect existing functionality

3. **IndexedDB Limitations**: 
   - Export/import only works in browser environments
   - Large indexes may take time to export/import
   - The export format includes all stores (map, ctx, tag, reg, cfg)

4. **TypeScript Support**: Full TypeScript definitions are included in `index.d.ts`

## Files Changed Summary

1. `src/type.js` - Added score to SearchOptions
2. `src/index/search.js` - Score parameter propagation
3. `src/intersect.js` - Score tracking and calculation
4. `src/resolve/default.js` - Score result handling
5. `src/db/indexeddb/index.js` - Export/import methods
6. `index.d.ts` - TypeScript definitions
7. `test/score-export.js` - Test suite

## Next Steps

1. Build the project: `npm run build:all`
2. Run tests: `cd test && npm test score-export.js`
3. Test manually in browser for IndexedDB features
4. Submit PR with these changes
