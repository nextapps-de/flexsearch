if(typeof module !== 'undefined'){

    // Node.js Stub

    URL = function(string){};
    URL.createObjectURL = function(val){};
    Blob = function(string){};

    var env = process.argv[3] === 'test' ? '.min' : '';
    var expect = require('chai').expect;
    var FlexSearch = require("../flexsearch" + env + ".js");
}

var flexsearch_default;
var flexsearch_sync;
var flexsearch_async;
var flexsearch_worker;
var flexsearch_cache;

var flexsearch_icase;
var flexsearch_simple;
var flexsearch_advanced;
var flexsearch_extra;
var flexsearch_custom;

var flexsearch_strict;
var flexsearch_forward;
var flexsearch_reverse;
var flexsearch_full;
var flexsearch_ngram;

// ------------------------------------------------------------------------
// Acceptance Tests
// ------------------------------------------------------------------------

describe('Initialize', function(){

    it('Should have been initialized successfully', function(){

        flexsearch_default = new FlexSearch();

        flexsearch_sync = new FlexSearch({

            encode: false,
            async: false,
            worker: false
        });

        flexsearch_async = FlexSearch.create({

            encode: false,
            async: true,
            worker: false
        });

        flexsearch_icase = new FlexSearch({

            encode: 'icase',
            async: false,
            worker: false
        });

        flexsearch_simple = FlexSearch.create({

            encode: 'simple',
            async: false,
            worker: false
        });

        flexsearch_advanced = new FlexSearch({

            encode: 'advanced',
            async: false,
            worker: false
        });

        flexsearch_extra = FlexSearch.create({

            encode: 'extra',
            async: false,
            worker: false
        });

        flexsearch_custom = new FlexSearch({

            encode: test_encoder,
            async: false,
            worker: false
        });

        flexsearch_strict = new FlexSearch({

            encode: 'icase',
            mode: 'strict',
            async: false,
            worker: false
        });

        flexsearch_forward = new FlexSearch({

            encode: 'icase',
            mode: 'forward',
            async: false,
            worker: false
        });

        flexsearch_reverse = new FlexSearch({

            encode: 'icase',
            mode: 'reverse',
            async: false,
            worker: false
        });

        flexsearch_full = new FlexSearch({

            encode: 'icase',
            mode: 'full',
            async: false,
            worker: false
        });

        flexsearch_ngram = new FlexSearch({

            encode: 'advanced',
            mode: 'ngram',
            async: false,
            worker: false
        });

        flexsearch_cache = new FlexSearch({

            encode: 'icase',
            mode: 'reverse',
            cache: true
        });

        expect(flexsearch_default).to.be.an.instanceOf(FlexSearch);
        expect(flexsearch_sync).to.be.an.instanceOf(FlexSearch);
        expect(flexsearch_async).to.be.an.instanceOf(FlexSearch);
    });

    it('Should have all provided methods', function(){

        expect(flexsearch_default).to.respondTo("search");
        expect(flexsearch_default).to.respondTo("add");
        expect(flexsearch_default).to.respondTo("update");
        expect(flexsearch_default).to.respondTo("remove");
        expect(flexsearch_default).to.respondTo("reset");
        expect(flexsearch_default).to.respondTo("init");
        expect(flexsearch_default).to.respondTo("info");
    });

    it('Should have correct uuids', function(){

        expect(flexsearch_default.id).to.equal(0);
        expect(flexsearch_sync.id).to.equal(1);
        expect(flexsearch_async.id).to.equal(2);
        expect(flexsearch_icase.id).to.equal(3);
        expect(flexsearch_simple.id).to.equal(4);
        expect(flexsearch_advanced.id).to.equal(5);
        expect(flexsearch_extra.id).to.equal(6);
    });

    it('Should have the correct options', function(){

        expect(flexsearch_default.async).to.equal(false);
        expect(flexsearch_default.mode).to.equal("forward");
        expect(flexsearch_sync.async).to.equal(false);
        expect(flexsearch_async.async).to.equal(true);
        expect(flexsearch_custom.encoder).to.equal(test_encoder);
        expect(flexsearch_strict.mode).to.equal("strict");
        expect(flexsearch_forward.mode).to.equal("forward");
        expect(flexsearch_reverse.mode).to.equal("reverse");
        expect(flexsearch_full.mode).to.equal("full");
        expect(flexsearch_ngram.mode).to.equal("ngram");
    });
});

describe('Add (Sync)', function(){

    it('Should have been added to the index', function(){

        flexsearch_sync.add(0, "foo");
        flexsearch_sync.add(2, "bar");
        flexsearch_sync.add(1, "foobar");

        expect(flexsearch_sync.index).to.have.keys([0, 1, 2]);
        expect(flexsearch_sync.length).to.equal(3);
    });

    it('Should not have been added to the index', function(){

        flexsearch_sync.add("foo");
        flexsearch_sync.add(3);
        flexsearch_sync.add(null, "foobar");
        flexsearch_sync.add(void 0, "foobar");
        flexsearch_sync.add(3, null);
        flexsearch_sync.add(3, false);
        flexsearch_sync.add(3, []);
        flexsearch_sync.add(3, {});
        flexsearch_sync.add(3, function(){});

        expect(flexsearch_sync.length).to.equal(3);

        flexsearch_extra.add(3, "");
        flexsearch_extra.add(3, " ");
        flexsearch_extra.add(3, "    ");
        flexsearch_extra.add(3, "  -  ");

        expect(flexsearch_extra.length).to.equal(0);
    });
});

describe('Search (Sync)', function(){

    it('Should have been matched from index', function(){

        expect(flexsearch_sync.search("foo")).to.have.members([0, 1]);
        expect(flexsearch_sync.search("bar")).to.include(2);
        expect(flexsearch_sync.search("foobar")).to.include(1);

        expect(flexsearch_sync.search("foo foo")).to.have.members([0, 1]);
        expect(flexsearch_sync.search("foo  foo")).to.have.members([0, 1]);

        flexsearch_extra.add(4, "Thomas");
        flexsearch_extra.add(5, "Arithmetic");
        flexsearch_extra.add(6, "Mahagoni");

        expect(flexsearch_extra.search("tomass")).to.include(4);
        expect(flexsearch_extra.search("arytmetik")).to.include(5);
        expect(flexsearch_extra.search("mahagony")).to.include(6);
    });

    it('Should have been limited', function(){

        expect(flexsearch_sync.search("foo", 1)).to.include(0);
        expect(flexsearch_sync.search({query: "foo", limit: 1})).to.include(0);
        expect(flexsearch_sync.search("foo", 1)).to.not.include(1);
    });

    it('Should not have been matched from index', function(){

        expect(flexsearch_sync.search("barfoo")).to.have.lengthOf(0);
        expect(flexsearch_sync.search("")).to.have.lengthOf(0);
        expect(flexsearch_sync.search("  ")).to.have.lengthOf(0);
        expect(flexsearch_sync.search(" - ")).to.have.lengthOf(0);
        expect(flexsearch_sync.search(" o ")).to.have.lengthOf(0);
    });
});

describe('Update (Sync)', function(){

    it('Should have been updated to the index', function(){

        flexsearch_sync.update(0, "bar");
        flexsearch_sync.update(2, "foobar");
        flexsearch_sync.update(1, "foo");

        expect(flexsearch_sync.length).to.equal(3);
        expect(flexsearch_sync.search("foo")).to.have.members([2, 1]);
        expect(flexsearch_sync.search("bar")).to.include(0);
        expect(flexsearch_sync.search("bar")).to.not.include(2);
        expect(flexsearch_sync.search("foobar")).to.include(2);

        // bypass update:

        flexsearch_sync.add(2, "bar");
        flexsearch_sync.add(0, "foo");
        flexsearch_sync.add(1, "foobar");

        expect(flexsearch_sync.length).to.equal(3);
        expect(flexsearch_sync.search("foo")).to.have.members([0, 1]);
        expect(flexsearch_sync.search("bar")).to.include(2);
        expect(flexsearch_sync.search("foobar")).to.include(1);
    });

    it('Should not have been updated to the index', function(){

        flexsearch_sync.update("foo");
        flexsearch_sync.update(0);
        flexsearch_sync.update(null, "foobar");
        flexsearch_sync.update(void 0, "foobar");
        flexsearch_sync.update(1, null);
        flexsearch_sync.update(2, false);
        flexsearch_sync.update(0, []);
        flexsearch_sync.update(1, {});
        flexsearch_sync.update(2, function(){});

        expect(flexsearch_sync.length).to.equal(3);
        expect(flexsearch_sync.search("foo")).to.have.members([0, 1]);
        expect(flexsearch_sync.search("bar")).to.include(2);
        expect(flexsearch_sync.search("foobar")).to.include(1);
    });
});

describe('Remove (Sync)', function(){

    it('Should have been removed from the index', function(){

        flexsearch_sync.remove(0);
        flexsearch_sync.remove(2);
        flexsearch_sync.remove(1);

        expect(flexsearch_sync.length).to.equal(0);
        expect(flexsearch_sync.search("foo")).to.have.lengthOf(0);
        expect(flexsearch_sync.search("bar")).to.have.lengthOf(0);
        expect(flexsearch_sync.search("foobar")).to.have.lengthOf(0);
    });
});

// ------------------------------------------------------------------------
// Scoring
// ------------------------------------------------------------------------

describe('Apply Sort by Scoring', function(){

    it('Should have been sorted properly by scoring', function(){

        flexsearch_sync.add(0, "foo bar foobar");
        flexsearch_sync.add(2, "bar foo foobar");
        flexsearch_sync.add(1, "foobar foo bar");

        expect(flexsearch_sync.length).to.equal(3);
        expect(flexsearch_sync.search("foo")[0]).to.equal(0);
        expect(flexsearch_sync.search("foo")[1]).to.equal(1);
        expect(flexsearch_sync.search("foo")[2]).to.equal(2);

        expect(flexsearch_sync.search("bar")[0]).to.equal(2);
        expect(flexsearch_sync.search("bar")[1]).to.equal(0); // partial scoring!
        expect(flexsearch_sync.search("bar")[2]).to.equal(1);

        expect(flexsearch_sync.search("foobar")[0]).to.equal(1);
        expect(flexsearch_sync.search("foobar")[1]).to.equal(0);
        expect(flexsearch_sync.search("foobar")[2]).to.equal(2);
    });

    it('Should have been sorted properly by threshold', function(){

        flexsearch_reverse.add(0, "foobarxxx foobarfoobarfoobarxxx foobarfoobarfoobaryyy foobarfoobarfoobarzzz");

        expect(flexsearch_reverse.search("xxx").length).to.equal(1);
        expect(flexsearch_reverse.search("yyy").length).to.equal(1);
        expect(flexsearch_reverse.search("zzz").length).to.equal(0);
        expect(flexsearch_reverse.search({query: "xxx", threshold: 2}).length).to.equal(1);
        expect(flexsearch_reverse.search({query: "xxx", threshold: 5}).length).to.equal(0);
        expect(flexsearch_reverse.search({query: "yyy", threshold: 2}).length).to.equal(0);
        expect(flexsearch_reverse.search({query: "zzz", threshold: 0}).length).to.equal(0);
    });
});

// ------------------------------------------------------------------------
// Async Tests
// ------------------------------------------------------------------------

describe('Add (Async)', function(){

    it('Should have been added to the index', function(done){

        flexsearch_async.add(0, "foo");
        flexsearch_async.add(2, "bar");
        flexsearch_async.add(1, "foobar");

        expect(flexsearch_async.length).to.equal(0);

        setTimeout(function(){

            expect(flexsearch_async.length).to.equal(3);
            expect(flexsearch_async.index).to.have.keys([0, 1, 2]);

            done();

        }, 25);
    });

    it('Should not have been added to the index', function(done){

        flexsearch_async.add("foo");
        flexsearch_async.add(3);
        flexsearch_async.add(null, "foobar");
        flexsearch_async.add(void 0, "foobar");
        flexsearch_async.add(3, null);
        flexsearch_async.add(3, false);
        flexsearch_async.add(3, []);
        flexsearch_async.add(3, {});
        flexsearch_async.add(3, function(){});

        setTimeout(function(){

            expect(flexsearch_async.length).to.equal(3);
            expect(flexsearch_async.index).to.have.keys([0, 1, 2]);

            done();

        }, 25);
    });
});

describe('Search (Async)', function(){

    it('Should have been matched from index', function(done){

        flexsearch_async.search("foo", function(result){

            expect(result).to.have.members([0, 1]);
        });

        flexsearch_async.search("bar", function(result){

            expect(result).to.include(2);
        });

        flexsearch_async.search("foobar", function(result){

            expect(result).to.include(1);
        });

        setTimeout(function(){

            done();

        }, 25);
    });

    it('Should have been limited', function(done){

        flexsearch_async.search("foo", 1, function(result){

            expect(result).to.include(0);
            expect(result).to.not.include(1);
        });

        setTimeout(function(){

            done();

        }, 25);
    });

    it('Should not have been matched from index', function(done){

        flexsearch_async.search("barfoo", function(result){

            expect(result).to.have.lengthOf(0);
        });

        flexsearch_async.search("", function(result){

            expect(result).to.have.lengthOf(0);
        });

        flexsearch_async.search(" ", function(result){

            expect(result).to.have.lengthOf(0);
        });

        flexsearch_async.search(" o ", function(result){

            expect(result).to.have.lengthOf(0);
        });

        setTimeout(function(){

            done();

        }, 25);
    });
});

describe('Update (Async)', function(){

    it('Should have been updated to the index', function(done){

        flexsearch_async.update(0, "bar");
        flexsearch_async.update(2, "foobar");
        flexsearch_async.update(1, "foo");

        expect(flexsearch_async.length).to.equal(3);
        expect(flexsearch_async.search("foo")).to.not.have.members([2, 1]);
        expect(flexsearch_async.search("bar")).to.not.include(0);
        expect(flexsearch_async.search("bar")).to.include(2);
        expect(flexsearch_async.search("foobar")).to.not.include(2);

        setTimeout(function(){

            expect(flexsearch_async.length).to.equal(3);
            expect(flexsearch_async.search("foo")).to.have.members([2, 1]);
            expect(flexsearch_async.search("bar")).to.include(0);
            expect(flexsearch_async.search("bar")).to.not.include(2);
            expect(flexsearch_async.search("foobar")).to.include(2);

            done();

        }, 25);
    });

    it('Should not have been updated to the index', function(done){

        flexsearch_async.update("foo");
        flexsearch_async.update(0);
        flexsearch_async.update(null, "foobar");
        flexsearch_async.update(void 0, "foobar");
        flexsearch_async.update(1, null);
        flexsearch_async.update(2, false);
        flexsearch_async.update(0, []);
        flexsearch_async.update(1, {});
        flexsearch_async.update(2, function(){});

        setTimeout(function(){

            expect(flexsearch_async.length).to.equal(3);
            expect(flexsearch_async.search("foo")).to.have.members([2, 1]);
            expect(flexsearch_async.search("bar")).to.include(0);
            expect(flexsearch_async.search("bar")).to.not.include(2);
            expect(flexsearch_async.search("foobar")).to.include(2);

            done();

        }, 25);
    });
});

describe('Remove (Async)', function(){

    it('Should have been removed from the index', function(done){

        flexsearch_async.remove(0);
        flexsearch_async.remove(2);
        flexsearch_async.remove(1);

        expect(flexsearch_async.length).to.equal(3);

        setTimeout(function(){

            expect(flexsearch_async.length).to.equal(0);
            expect(flexsearch_async.search("foo")).to.have.lengthOf(0);
            expect(flexsearch_async.search("bar")).to.have.lengthOf(0);
            expect(flexsearch_async.search("foobar")).to.have.lengthOf(0);

            done();

        }, 25);
    });
});

// ------------------------------------------------------------------------
// Worker Tests
// ------------------------------------------------------------------------

describe('Add (Worker)', function(){

    it('Should support worker', function(done){

        if(typeof Worker === 'undefined'){

            Worker = function(string){};
            Worker.prototype.postMessage = function(val){
                this.onmessage(val);
            };
            Worker.prototype.onmessage = function(val){
                return val;
            };
        }

        flexsearch_worker = new FlexSearch({

            encode: false,
            mode: 'strict',
            async: true,
            worker: 4
        });

        done();
    });

    it('Should have been added to the index', function(done){

        flexsearch_worker.add(0, "foo");
        flexsearch_worker.add(2, "bar");
        flexsearch_worker.add(1, "foobar");

        expect(flexsearch_worker.length).to.equal(3);
        expect(flexsearch_worker.index).to.have.keys([0, 1, 2]);

        setTimeout(function(){

            expect(flexsearch_worker.length).to.equal(3);
            expect(flexsearch_worker.index).to.have.keys([0, 1, 2]);

            done();

        }, 25);
    });

    it('Should not have been added to the index', function(done){

        flexsearch_worker.add("foo");
        flexsearch_worker.add(3);
        flexsearch_worker.add(null, "foobar");
        flexsearch_worker.add(void 0, "foobar");
        flexsearch_worker.add(3, null);
        flexsearch_worker.add(3, false);
        flexsearch_worker.add(3, []);
        flexsearch_worker.add(3, {});
        flexsearch_worker.add(3, function(){});

        setTimeout(function(){

            expect(flexsearch_worker.length).to.equal(3);
            expect(flexsearch_worker.index).to.have.keys([0, 1, 2]);

            done();

        }, 25);
    });
});

describe('Search (Worker)', function(){

    it('Should have been matched from index', function(done){

        flexsearch_worker.search("foo", function(result){

            expect(result).to.have.members([0, 1]);
        });

        flexsearch_worker.search("bar", function(result){

            expect(result).to.have.members([2, 1]);
        });

        flexsearch_worker.search("foobar", function(result){

            expect(result).to.include(1);
        });

        setTimeout(function(){

            done();

        }, 25);
    });

    it('Should have been limited', function(done){

        flexsearch_worker.search("foo", 1, function(result){

            expect(result).to.include(0);
            expect(result).to.not.include(1);
        });

        setTimeout(function(){

            done();

        }, 25);
    });

    it('Should not have been matched from index', function(done){

        flexsearch_worker.search("barfoo", function(result){

            expect(result).to.have.lengthOf(0);
        });

        flexsearch_worker.search("", function(result){

            expect(result).to.have.lengthOf(0);
        });

        flexsearch_worker.search(" ", function(result){

            expect(result).to.have.lengthOf(0);
        });

        flexsearch_worker.search(" o ", function(result){

            expect(result).to.have.lengthOf(0);
        });

        setTimeout(function(){

            done();

        }, 25);
    });
});

describe('Update (Worker)', function(){

    it('Should have been updated to the index', function(done){

        flexsearch_worker.update(0, "bar");
        flexsearch_worker.update(2, "foobar");
        flexsearch_worker.update(1, "foo");

        expect(flexsearch_worker.length).to.equal(3);

        flexsearch_worker.search("foo", function(results){

            expect(results).to.have.members([2, 1]);
        });

        flexsearch_worker.search("bar", function(results){

            expect(results).to.have.members([0, 2]);
        });

        flexsearch_worker.search("foobar", function(results){

            expect(results).to.include(2);
        });

        setTimeout(function(){

            done();

        }, 25);
    });
});

describe('Remove (Worker)', function(){

    it('Should have been removed from the index', function(done){

        flexsearch_worker.remove(0);
        flexsearch_worker.remove(2);
        flexsearch_worker.remove(1);

        expect(flexsearch_worker.length).to.equal(0);

        flexsearch_worker.search("foo", function(results){

            expect(results).to.not.include(1);
            expect(results).to.not.include(2);
        });

        flexsearch_worker.search("bar", function(results){

            expect(results).to.not.include(0);
            expect(results).to.not.include(2);
        });

        flexsearch_worker.search("foobar", function(results){

            expect(results).to.not.include(2);
        });

        setTimeout(function(){

            done();

        }, 25);
    });

    it('Should have been debug mode activated', function(){

        flexsearch_worker.info();
    });
});

describe('Worker Not Supported', function(){

    it('Should not support worker', function(){

        if(typeof Worker !== 'undefined'){

            Worker = void 0;
        }

        flexsearch_worker = new FlexSearch({

            encode: false,
            async: true,
            worker: 4
        });

        expect(flexsearch_worker.info().worker).to.equal(false);
    });
});

// ------------------------------------------------------------------------
// Phonetic Tests
// ------------------------------------------------------------------------

describe('Encoding', function(){

    it('Should have been encoded properly: iCase', function(){

        expect(flexsearch_icase.encode("Björn-Phillipp Mayer")).to.equal(flexsearch_icase.encode("björn-phillipp mayer"));
    });

    it('Should have been encoded properly: Simple', function(){

        expect(flexsearch_simple.encode("Björn-Phillipp Mayer")).to.equal(flexsearch_simple.encode("bjorn/phillipp mayer"));
    });

    it('Should have been encoded properly: Advanced', function(){

        expect(flexsearch_advanced.encode("Björn-Phillipp Mayer")).to.equal(flexsearch_advanced.encode("bjoern filip mair"));
    });

    it('Should have been encoded properly: Extra', function(){

        expect(flexsearch_extra.encode("Björn-Phillipp Mayer")).to.equal(flexsearch_extra.encode("bjorm filib mayr"));
    });

    it('Should have been encoded properly: Custom Encoder', function(){

        expect(flexsearch_custom.encode("Björn-Phillipp Mayer")).to.equal("-[BJÖRN-PHILLIPP MAYER]-");
    });

    it('Should have been encoded properly: Custom Encoder', function(){

        FlexSearch.register('custom', test_encoder);

        expect(FlexSearch.encode('custom', "Björn-Phillipp Mayer")).to.equal(flexsearch_custom.encode("Björn-Phillipp Mayer"));
    });
});

// ------------------------------------------------------------------------
// Contextual Indexing
// ------------------------------------------------------------------------

describe('Context', function(){

    it('Should have been added properly to the context', function(){

        var flexsearch_depth = new FlexSearch({

            encode: 'icase',
            mode: 'strict',
            depth: 2,
            async: false,
            worker: false
        });

        flexsearch_depth.add(0, "zero one two three four five six seven eight nine ten");

        expect(flexsearch_depth.length).to.equal(1);
        expect(flexsearch_depth.search("zero one")).to.include(0);
        expect(flexsearch_depth.search("zero two")).to.include(0);
        expect(flexsearch_depth.search("zero three").length).to.equal(0);
        expect(flexsearch_depth.search("three seven").length).to.equal(0);
        expect(flexsearch_depth.search("three five seven")).to.include(0);
        // TODO
        // expect(flexsearch_depth.search("three seven five")).to.include(0);
        expect(flexsearch_depth.search("three foobar seven").length).to.equal(0);
        expect(flexsearch_depth.search("eight ten")).to.include(0);
        expect(flexsearch_depth.search("seven ten").length).to.equal(0);

        flexsearch_depth.add(1, "1 2 3 1 4 2 5 1");

        expect(flexsearch_depth.search("1")).to.include(1);
        expect(flexsearch_depth.search("1 5")).to.include(1);
        expect(flexsearch_depth.search("2 4 1")).to.include(1);
    });
});

// ------------------------------------------------------------------------
// Encoding Tests
// ------------------------------------------------------------------------

describe('Options', function(){

    it('Should have been added properly to the index: Strict', function(){

        flexsearch_strict.add(0, "björn phillipp mayer");

        expect(flexsearch_strict.length).to.equal(1);
        expect(flexsearch_strict.search("björn phillipp")).to.include(0);
        expect(flexsearch_strict.search("björn mayer")).to.include(0);
    });

    it('Should have been added properly to the index: Forward', function(){

        flexsearch_forward.add(0, "björn phillipp mayer");

        expect(flexsearch_forward.length).to.equal(1);
        expect(flexsearch_forward.search("bjö phil may")).to.have.lengthOf(1);
        expect(flexsearch_forward.search("bjö phil may")).to.include(0);
    });

    it('Should have been added properly to the index: Inverse', function(){

        flexsearch_reverse.add(0, "björn phillipp mayer");

        expect(flexsearch_reverse.length).to.equal(1);
        expect(flexsearch_reverse.search("jörn phil yer")).to.have.lengthOf(1);
        expect(flexsearch_reverse.search("jörn phil yer")).to.include(0);
    });

    it('Should have been added properly to the index: Full', function(){

        flexsearch_full.add(0, "björn phillipp mayer");

        expect(flexsearch_full.length).to.equal(1);
        expect(flexsearch_full.search("jör illi may")).to.have.lengthOf(1);
        expect(flexsearch_full.search("jör illi may")).to.include(0);
    });

    it('Should have been added properly to the index: Full', function(){

        flexsearch_ngram.add(0, "björn-phillipp mayer");

        expect(flexsearch_ngram.length).to.equal(1);
        expect(flexsearch_ngram.search("mayer")).to.have.lengthOf(1);

        expect(flexsearch_ngram.search("philip meier")).to.have.lengthOf(1);
        expect(flexsearch_ngram.search("philip meier")).to.include(0);
        expect(flexsearch_ngram.search("björn meier")).to.have.lengthOf(1);
        expect(flexsearch_ngram.search("björn meier")).to.include(0);
        expect(flexsearch_ngram.search("björn-peter mayer")).to.have.lengthOf(0);
    });
});

// ------------------------------------------------------------------------
// Relevance Tests
// ------------------------------------------------------------------------

describe('Relevance', function(){

    it('Should have been sorted by relevance properly', function(){

        var index = new FlexSearch({
            encode: 'advanced',
            mode: 'strict'
        });

        index.add(0, "1 2 3 2 4 1 5 3");
        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "four two zero one three ten five seven eight six nine");

        expect(index.search("1")).to.have.members([0]);
        expect(index.search("one")).to.have.members([1, 2]);
        expect(index.search("one two")).to.have.members([1, 2]);
        expect(index.search("four one")).to.have.members([1, 2]);

        var index = new FlexSearch({
            encode: 'advanced',
            mode: 'strict',
            threshold: 5,
            depth: 3
        });

        index.add(0, "1 2 3 2 4 1 5 3");
        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "four two zero one three ten five seven eight six nine");

        expect(index.search("1")).to.have.members([0]);
        expect(index.search("one")).to.have.members([1, 2]);
        expect(index.search("one two")).to.have.members([1, 2]);
        expect(index.search("four one")).to.have.members([1, 2]);

        var index = new FlexSearch({
            encode: 'extra',
            mode: 'ngram',
            threshold: 5,
            depth: 3
        });

        index.add(0, "1 2 3 2 4 1 5 3");
        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "four two zero one three ten five seven eight six nine");

        expect(index.search("1 3 4")).to.have.members([0]);
        expect(index.search("1 5 3 4")).to.have.members([0]);
        expect(index.search("one")).to.have.members([1, 2]);
        expect(index.search("one two")).to.have.members([1, 2]);
        expect(index.search("four one")).to.have.members([1, 2]);
    });
});

// ------------------------------------------------------------------------
// Feature Tests
// ------------------------------------------------------------------------

describe('Add Matchers', function(){

    it('Should have been added properly', function(){

        FlexSearch.addMatcher({

            '1': 'a',
            '2': 'b',
            '3': 'c',
            '[456]': 'd'
        });

        flexsearch_forward.init({

            encode: false

        }).init({

            encode: 'not-found',
            matcher: {

                '7': 'e'
            }

        }).addMatcher({

            '8': 'f'
        });

        flexsearch_forward.add(0, "12345678");

        expect(flexsearch_forward.search("12345678")).to.include(0);
        expect(flexsearch_forward.search("abcd")).to.include(0);
        expect(flexsearch_forward.encode("12345678")).to.equal("abcdddef");
    });
});

// ------------------------------------------------------------------------
// Caching
// ------------------------------------------------------------------------

describe('Caching', function(){

    it('Should have been cached properly', function(){

        flexsearch_cache.add(0, 'foo')
                        .add(1, 'bar')
                        .add(2, 'foobar');
        // fetch:

        expect(flexsearch_cache.search("foo")).to.have.members([0, 2]);
        expect(flexsearch_cache.search("bar")).to.have.members([1, 2]);
        expect(flexsearch_cache.search("foobar")).to.include(2);

        // cache:

        expect(flexsearch_cache.search("foo")).to.have.members([0, 2]);
        expect(flexsearch_cache.search("bar")).to.have.members([1, 2]);
        expect(flexsearch_cache.search("foobar")).to.include(2);

        // update:

        flexsearch_cache.remove(2).update(1, 'foo').add(3, 'foobar');

        // fetch:

        expect(flexsearch_cache.search("foo")).to.have.members([0, 1, 3]);
        expect(flexsearch_cache.search("bar")).to.include(3);
        expect(flexsearch_cache.search("foobar")).to.include(3);

        // cache:

        expect(flexsearch_cache.search("foo")).to.have.members([0, 1, 3]);
        expect(flexsearch_cache.search("bar")).to.include(3);
        expect(flexsearch_cache.search("foobar")).to.include(3);
    });
});

// ------------------------------------------------------------------------
// Debug Information
// ------------------------------------------------------------------------

describe('Debug', function(){

    it('Should have been debug mode activated', function(){

        var info = flexsearch_cache.info();

        expect(info).to.have.keys([

            'id',
            'chars',
            'status',
            'cache',
            'items',
            'matcher',
            'memory',
            'sequences',
            'worker'
        ]);
    });
});

// ------------------------------------------------------------------------
// Chaining
// ------------------------------------------------------------------------

describe('Chaining', function(){

    it('Should have been chained properly', function(){

        var index = FlexSearch.create({mode: 'forward', encode: 'icase'})
                              .addMatcher({'â': 'a'})
                              .add(0, 'foo')
                              .add(1, 'bar');

        expect(index.search("foo")).to.include(0);
        expect(index.search("bar")).to.include(1);
        expect(index.encode("bâr")).to.equal("bar");

        index.remove(0).update(1, 'foo').add(2, 'foobâr');

        expect(index.search("foo")).to.have.members([1, 2]);
        expect(index.search("bar")).to.have.lengthOf(0);
        expect(index.search("foobar")).to.include(2);

        index.reset().add(0, 'foo').add(1, 'bar');

        expect(index.search("foo")).to.include(0);
        expect(index.search("bar")).to.include(1);
        expect(index.search("foobar")).to.have.lengthOf(0);

        flexsearch_cache.destroy().init().add(0, 'foo').add(1, 'bar');

        expect(flexsearch_cache.search("foo")).to.include(0);
        expect(flexsearch_cache.search("bar")).to.include(1);
        expect(flexsearch_cache.search("foobar")).to.have.lengthOf(0);
    });
});

/* Test Helpers */

function test_encoder(str){

    return str = '-[' + str.toUpperCase() + ']-';
}
