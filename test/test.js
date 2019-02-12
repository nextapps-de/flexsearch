if(typeof module !== "undefined"){

    var env = process.argv[3] === "test" ? "min" : process.argv[3] === "test/" ? "light" : "";
    var expect = require("chai").expect;
    var FlexSearch = require("../" + (env ? "dist/": "") + "flexsearch" + (env ? "." + env : "") + ".js");
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

describe("Initialize", function(){

    it("Should have been initialized successfully", function(){

        flexsearch_default = new FlexSearch();

        flexsearch_sync = new FlexSearch({

            tokenize: "forward",
            encode: false,
            async: false,
            worker: false
        });

        flexsearch_async = FlexSearch.create({

            tokenize: "forward",
            encode: false,
            async: true,
            worker: false
        });

        flexsearch_icase = new FlexSearch({

            encode: "icase",
            async: false,
            worker: false
        });

        flexsearch_simple = FlexSearch.create({

            encode: "simple",
            async: false,
            worker: false
        });

        flexsearch_advanced = new FlexSearch({

            encode: "advanced",
            async: false,
            worker: false
        });

        flexsearch_extra = FlexSearch.create({

            encode: "extra",
            async: false,
            worker: false
        });

        flexsearch_custom = new FlexSearch({

            encode: test_encoder,
            async: false,
            worker: false
        });

        flexsearch_strict = new FlexSearch({

            encode: "icase",
            tokenize: "strict",
            async: false,
            worker: false
        });

        flexsearch_forward = new FlexSearch({

            encode: "icase",
            tokenize: "forward",
            async: false,
            worker: false
        });

        flexsearch_reverse = new FlexSearch({

            encode: "icase",
            tokenize: "reverse",
            resolution: 10,
            async: false,
            worker: false
        });

        flexsearch_full = new FlexSearch({

            encode: "icase",
            tokenize: "full",
            async: false,
            worker: false
        });

        flexsearch_ngram = new FlexSearch({

            encode: "advanced",
            tokenize: "ngram",
            async: false,
            worker: false
        });

        flexsearch_cache = new FlexSearch({

            encode: "icase",
            tokenize: "reverse",
            cache: true
        });

        expect(flexsearch_default).to.be.an.instanceOf(FlexSearch);
        expect(flexsearch_sync).to.be.an.instanceOf(FlexSearch);
        expect(flexsearch_async).to.be.an.instanceOf(FlexSearch);

        it("Should have correct uuids", function(){

            expect(flexsearch_default.id).to.equal(0);
            expect(flexsearch_sync.id).to.equal(1);
            expect(flexsearch_async.id).to.equal(2);
            expect(flexsearch_icase.id).to.equal(3);
            expect(flexsearch_simple.id).to.equal(4);
            expect(flexsearch_advanced.id).to.equal(5);
            expect(flexsearch_extra.id).to.equal(6);
        });
    });

    it("Should have all provided methods", function(){

        expect(flexsearch_default).to.respondTo("search");
        expect(flexsearch_default).to.respondTo("add");
        expect(flexsearch_default).to.respondTo("update");
        expect(flexsearch_default).to.respondTo("remove");
        expect(flexsearch_default).to.respondTo("clear");
        expect(flexsearch_default).to.respondTo("init");

        if(env !== "light" && env !== "min"){

            expect(flexsearch_default).to.respondTo("info");
        }
    });

    it("Should have the correct options", function(){

        if(env !== "light"){

            expect(flexsearch_default.async).to.equal(false);
            expect(flexsearch_sync.async).to.equal(false);
            expect(flexsearch_async.async).to.equal(true);
        }

        if((env !== "light") && (env !== "min")){

            expect(flexsearch_default.tokenize).to.equal("forward");
            expect(flexsearch_strict.tokenize).to.equal("strict");
            expect(flexsearch_forward.tokenize).to.equal("forward");
            expect(flexsearch_reverse.tokenize).to.equal("reverse");
            expect(flexsearch_full.tokenize).to.equal("full");
            expect(flexsearch_ngram.tokenize).to.equal("ngram");
        }

        // not available in compiled version:
        if(typeof flexsearch_custom.encoder !== "undefined"){

            expect(flexsearch_custom.encoder).to.equal(test_encoder);
        }
    });
});

describe("Add (Sync)", function(){

    it("Should have been added to the index", function(){

        flexsearch_sync.add(0, "foo");
        flexsearch_sync.add(2, "bar");
        flexsearch_sync.add(1, "foobar");

        expect(flexsearch_sync.index).to.have.keys(["@0", "@1", "@2"]);
        expect(flexsearch_sync.length).to.equal(3);
    });

    it("Should not have been added to the index", function(){

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

        if(env !== "light"){

            expect(flexsearch_extra.length).to.equal(0);
        }
        else{

            expect(flexsearch_extra.length).to.equal(1);
        }
    });
});

describe("Search (Sync)", function(){

    it("Should have been matched from index", function(){

        expect(flexsearch_sync.search("foo")).to.have.members([0, 1]);
        expect(flexsearch_sync.search("bar")).to.include(2);
        expect(flexsearch_sync.search("foobar")).to.include(1);

        expect(flexsearch_sync.search("foo foo")).to.have.members([0, 1]);
        expect(flexsearch_sync.search("foo  foo")).to.have.members([0, 1]);

        if(env !== "light"){

            flexsearch_extra.add(4, "Thomas");
            flexsearch_extra.add(5, "Arithmetic");
            flexsearch_extra.add(6, "Mahagoni");

            expect(flexsearch_extra.search("tomass")).to.include(4);
            expect(flexsearch_extra.search("arytmetik")).to.include(5);
            expect(flexsearch_extra.search("mahagony")).to.include(6);
        }
    });

    it("Should have been limited", function(){

        expect(flexsearch_sync.search("foo", 1)).to.include(0);
        expect(flexsearch_sync.search({query: "foo", limit: 1})).to.include(0);
        expect(flexsearch_sync.search("foo", 1)).to.not.include(1);
    });

    it("Should not have been matched from index", function(){

        expect(flexsearch_sync.search("barfoo")).to.have.lengthOf(0);
        expect(flexsearch_sync.search("")).to.have.lengthOf(0);
        expect(flexsearch_sync.search("  ")).to.have.lengthOf(0);
        expect(flexsearch_sync.search(" - ")).to.have.lengthOf(0);
        expect(flexsearch_sync.search(" o ")).to.have.lengthOf(0);
    });
});

describe("Update (Sync)", function(){

    it("Should have been updated to the index", function(){

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

    it("Should not have been updated to the index", function(){

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

describe("Remove (Sync)", function(){

    it("Should have been removed from the index", function(){

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

describe("Apply Sort by Scoring", function(){

    it("Should have been sorted properly by scoring", function(){

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

    it("Should have been sorted properly by threshold", function(){

        flexsearch_reverse.add(0, "foobarxxx foobarfoobarfoobarxxx foobarfoobarfoobaryyy foobarfoobarfoobarzzz");

        expect(flexsearch_reverse.search("xxx").length).to.equal(1);
        expect(flexsearch_reverse.search("yyy").length).to.equal(1);
        expect(flexsearch_reverse.search("zzz").length).to.equal(1);

        expect(flexsearch_reverse.search({query: "xxx", threshold: 2}).length).to.equal(1);
        expect(flexsearch_reverse.search({query: "xxx", threshold: 3}).length).to.equal(1);
        expect(flexsearch_reverse.search({query: "xxx", threshold: 5}).length).to.equal(1);
        expect(flexsearch_reverse.search({query: "xxx", threshold: 7}).length).to.equal(0); // <-- stop

        expect(flexsearch_reverse.search({query: "yyy", threshold: 0}).length).to.equal(1);
        expect(flexsearch_reverse.search({query: "yyy", threshold: 2}).length).to.equal(1);
        expect(flexsearch_reverse.search({query: "yyy", threshold: 5}).length).to.equal(0); // <-- stop

        expect(flexsearch_reverse.search({query: "zzz", threshold: 0}).length).to.equal(1);
        expect(flexsearch_reverse.search({query: "zzz", threshold: 1}).length).to.equal(1);
        expect(flexsearch_reverse.search({query: "zzz", threshold: 3}).length).to.equal(0); // <-- stop
    });
});

// ------------------------------------------------------------------------
// Async Tests
// ------------------------------------------------------------------------

if(env !== "light"){

    describe("Add (Async)", function(){

        it("Should have been added to the index", function(done){

            expect(flexsearch_async.length).to.equal(0);

            flexsearch_async.add(0, "foo");
            flexsearch_async.add(2, "bar");
            flexsearch_async.add(1, "foobar");

            expect(flexsearch_async.length).to.equal(0);

            setTimeout(function(){

                expect(flexsearch_async.length).to.equal(3);
                expect(flexsearch_async.index).to.have.keys(["@0", "@1", "@2"]);

                done();

            }, 25);
        });

        it("Should not have been added to the index", function(done){

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
                expect(flexsearch_async.index).to.have.keys(["@0", "@1", "@2"]);

                done();

            }, 25);
        });
    });

    describe("Search (Async)", function(){

        it("Should have been matched from index", function(done){

            flexsearch_async.search("foo", function(result){

                expect(result).to.have.members([0, 1]);
            });

            flexsearch_async.search("bar", function(result){

                expect(result).to.include(2);
            });

            flexsearch_async.search("foobar", function(result){

                expect(result).to.include(1);

                done();
            });
        });

        it("Should have been limited", function(done){

            flexsearch_async.search("foo", 1, function(result){

                expect(result).to.include(0);
                expect(result).to.not.include(1);

                done();
            });
        });

        it("Should not have been matched from index", function(done){

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

                done();
            });
        });
    });

    describe("Update (Async)", function(){

        it("Should have been updated to the index", function(done){

            flexsearch_async.update(0, "bar");
            flexsearch_async.update(2, "foobar");
            flexsearch_async.update(1, "foo");

            setTimeout(function(){

                expect(flexsearch_async.length).to.equal(3);

                flexsearch_async.search("foo", function(result){
                    expect(result).to.have.members([2, 1]);
                });

                flexsearch_async.search("bar", function(result){
                    expect(result).to.include(0);
                });

                flexsearch_async.search("bar", function(result){
                    expect(result).to.not.include(2);
                });

                flexsearch_async.search("foobar", function(result){
                    expect(result).to.include(2);

                    done();
                });

            }, 25);
        });

        it("Should not have been updated to the index", function(done){

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

                flexsearch_async.search("foo").then(function(result){
                    expect(result).to.have.members([2, 1]);
                });

                flexsearch_async.search("bar").then(function(result){
                    expect(result).to.include(0);
                });

                flexsearch_async.search("bar").then(function(result){
                    expect(result).to.not.include(2);
                });

                flexsearch_async.search("foobar").then(function(result){
                    expect(result).to.include(2);

                    done();
                });

            }, 25);
        });
    });

    describe("Remove (Async)", function(){

        it("Should have been removed from the index", function(done){

            flexsearch_async.remove(0);
            flexsearch_async.remove(2);
            flexsearch_async.remove(1).then(function(){
                expect(flexsearch_async.length).to.equal(0);
            });

            expect(flexsearch_async.length).to.equal(3);

            flexsearch_async.search("foo", function(result){
                expect(result).to.have.lengthOf(0);
            });

            flexsearch_async.search("bar", function(result){
                expect(result).to.have.lengthOf(0);
            });

            flexsearch_async.search("foobar", function(result){
                expect(result).to.have.lengthOf(0);

                done();
            });
        });
    });

// ------------------------------------------------------------------------
// Worker Tests
// ------------------------------------------------------------------------

    if(typeof Worker !== "undefined" && !this._phantom){

        describe("Add (Worker)", function(){

            it("Should support worker", function(){

                flexsearch_worker = new FlexSearch({

                    encode: "icase",
                    tokenize: "reverse",
                    async: false,
                    worker: 4
                });
            });

            it("Should have been added to the index", function(done){

                flexsearch_worker.add(0, "foo");
                flexsearch_worker.add(2, "bar");
                flexsearch_worker.add(1, "foobar");

                setTimeout(function(){

                    expect(flexsearch_worker.length).to.equal(3);
                    expect(flexsearch_worker.index).to.have.keys(["@0", "@1", "@2"]);

                    flexsearch_worker.search("foo", function(result){

                        expect(result).to.have.length(2);
                        expect(result).to.have.members([0, 1]);

                        done();
                    });

                }, 25);
            });

            it("Should not have been added to the index", function(done){

                flexsearch_worker.add("foo");
                flexsearch_worker.add(3);
                flexsearch_worker.add(null, "foobar");
                flexsearch_worker.add(void 0, "foobar");
                flexsearch_worker.add(4, null);
                flexsearch_worker.add(5, false);
                flexsearch_worker.add(6, []);
                flexsearch_worker.add(7, {});
                flexsearch_worker.add(8, function(){
                });

                setTimeout(function(){

                    expect(flexsearch_worker.length).to.equal(3);
                    expect(flexsearch_worker.index).to.have.keys(["@0", "@1", "@2"]);

                    done();

                }, 25);
            });
        });

        describe("Search (Worker)", function(){

            it("Should have been matched from index", function(done){

                flexsearch_worker.search("foo", function(result){

                    expect(result).to.have.lengthOf(2);

                    flexsearch_worker.search("bar", function(result){

                        expect(result).to.have.lengthOf(2);

                        flexsearch_worker.search("foobar", function(result){

                            expect(result).to.have.lengthOf(1);

                            done();
                        });
                    });
                });
            });

            it("Should have been limited", function(done){

                flexsearch_worker.search("foo", 1, function(result){

                    expect(result).to.have.lengthOf(1);

                    done();
                });
            });

            it("Should not have been matched from index", function(done){

                flexsearch_worker.search("barfoo", function(result){

                    expect(result).to.have.lengthOf(0);

                    flexsearch_worker.search("", function(result){

                        expect(result).to.have.lengthOf(0);

                        flexsearch_worker.search(" ", function(result){

                            expect(result).to.have.lengthOf(0);

                            flexsearch_worker.search(" o ", function(result){

                                expect(result).to.have.lengthOf(1);

                                flexsearch_worker.search(" fob ", function(result){

                                    expect(result).to.have.lengthOf(0);

                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });

        describe("Update (Worker)", function(){

            it("Should have been updated to the index", function(done){

                flexsearch_worker.update(0, "bar");
                flexsearch_worker.update(2, "foobar");
                flexsearch_worker.update(1, "foo", function(){

                    expect(flexsearch_worker.length).to.equal(3);

                    flexsearch_worker.search("foo", function(results){

                        expect(results).to.have.members([2, 1]);

                        flexsearch_worker.search("bar", function(results){

                            expect(results).to.have.members([0, 2]);

                            flexsearch_worker.search("foobar", function(results){

                                expect(results).to.have.members([2]);

                                done();
                            });
                        });
                    });
                });
            });
        });

        describe("Remove (Worker)", function(){

            it("Should have been removed from the index", function(done){

                expect(flexsearch_worker.length).to.equal(3);

                flexsearch_worker.remove(0);
                flexsearch_worker.remove(2);
                flexsearch_worker.remove(1);

                expect(flexsearch_worker.length).to.equal(0);

                flexsearch_worker.search("foo", function(results){

                    expect(results).to.not.include(1);
                    expect(results).to.not.include(2);

                    flexsearch_worker.search("bar", function(results){

                        expect(results).to.not.include(0);
                        expect(results).to.not.include(2);

                        flexsearch_worker.search("foobar", function(results){

                            expect(results).to.not.include(2);

                            done();
                        });
                    });
                });
            });

            if(env !== "light" && env !== "min"){

                it("Should have been debug mode activated", function(){

                    flexsearch_worker.info();
                });
            }
        });
    }

    describe("Worker Not Supported", function(){

        it("Should not support worker", function(){

            if(typeof Worker !== "undefined"){

                Worker = void 0;
            }

            flexsearch_worker = new FlexSearch({

                encode: false,
                async: false,
                worker: 4
            });

            if(env !== "min"){

                expect(flexsearch_worker.info().worker).to.equal(false);
            }
        });
    });
}

// ------------------------------------------------------------------------
// Phonetic Tests
// ------------------------------------------------------------------------

describe("Encoding", function(){

    it("Should have been encoded properly: iCase", function(){

        expect(flexsearch_icase.encode("Björn-Phillipp Mayer")).to.equal(flexsearch_icase.encode("björn-phillipp mayer"));
    });

    if(env !== "light"){

        it("Should have been encoded properly: Simple", function(){

            expect(flexsearch_simple.encode("Björn-Phillipp Mayer")).to.equal(flexsearch_simple.encode("bjorn/phillipp mayer"));
        });

        it("Should have been encoded properly: Advanced", function(){

            expect(flexsearch_advanced.encode("Björn-Phillipp Mayer")).to.equal(flexsearch_advanced.encode("bjoern filip mair"));
        });

        it("Should have been encoded properly: Extra", function(){

            expect(flexsearch_extra.encode("Björn-Phillipp Mayer")).to.equal(flexsearch_extra.encode("bjorm filib mayr"));
        });
    }

    it("Should have been encoded properly: Custom Encoder", function(){

        expect(flexsearch_custom.encode("Björn-Phillipp Mayer")).to.equal("-[BJÖRN-PHILLIPP MAYER]-");
    });

    it("Should have been encoded properly: Custom Encoder", function(){

        FlexSearch.registerEncoder("custom", test_encoder);

        expect(FlexSearch.encode("custom", "Björn-Phillipp Mayer")).to.equal(flexsearch_custom.encode("Björn-Phillipp Mayer"));
    });
});


// ------------------------------------------------------------------------
// CJK Word Break
// ------------------------------------------------------------------------

describe("CJK Word Break", function(){

    it("Should have been tokenized properly", function(){

        var index = FlexSearch.create({
            encode: false,
            tokenize: function(str){
                return str.replace(/[\x00-\x7F]/g, "").split("");
            }
        });

        index.add(0, "서울시가 잠이 든 시간에 아무 말, 미뤄, 미뤄");

        expect(index.search("든")).to.include(0);
        expect(index.search("시간에")).to.include(0);

        index.add(1, "一个单词");

        expect(index.search("单词")).to.include(1);
    });
});

// ------------------------------------------------------------------------
// Right-To-Left
// ------------------------------------------------------------------------

describe("RTL Support", function(){

    it("Should have been scored properly", function(){

        var index = new FlexSearch({

            encode: "icase",
            tokenize: "reverse",
            rtl: true
        });

        index.add(0, "54321 4 3 2 1 0");
        index.add(1, "0 1 2 3 4 54321");
        index.add(2, "0 1 2 3 4 12345");

        expect(index.search("5")[0]).to.equal(2);
        expect(index.search("5")[1]).to.equal(1);
        expect(index.search("5")[2]).to.equal(0);
    });
});

// ------------------------------------------------------------------------
// Contextual Indexing
// ------------------------------------------------------------------------

describe("Context", function(){

    it("Should have been added properly to the context", function(){

        var flexsearch_depth = new FlexSearch({

            encode: "icase",
            tokenize: "strict",
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
        expect(flexsearch_depth.search("eight six four")).to.include(0);
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
// Tokenizer Tests
// ------------------------------------------------------------------------

describe("Options", function(){

    it("Should have been added properly to the index: Strict", function(){

        flexsearch_strict.add(0, "björn phillipp mayer");

        expect(flexsearch_strict.length).to.equal(1);
        expect(flexsearch_strict.search("björn phillipp")).to.include(0);
        expect(flexsearch_strict.search("björn mayer")).to.include(0);
    });

    it("Should have been added properly to the index: Forward", function(){

        flexsearch_forward.add(0, "björn phillipp mayer");

        expect(flexsearch_forward.length).to.equal(1);
        expect(flexsearch_forward.search("bjö phil may")).to.have.lengthOf(1);
        expect(flexsearch_forward.search("bjö phil may")).to.include(0);
    });

    it("Should have been added properly to the index: Inverse", function(){

        flexsearch_reverse.add(0, "björn phillipp mayer");

        expect(flexsearch_reverse.length).to.equal(1);
        expect(flexsearch_reverse.search("jörn phil er")).to.have.lengthOf(1);
        expect(flexsearch_reverse.search("jörn lipp er")).to.have.lengthOf(1);
        expect(flexsearch_reverse.search("jörn lipp er")).to.include(0);
    });

    it("Should have been added properly to the index: Full", function(){

        flexsearch_full.add(0, "björn phillipp mayer");

        expect(flexsearch_full.length).to.equal(1);
        expect(flexsearch_full.search("jör illi may")).to.have.lengthOf(1);
        expect(flexsearch_full.search("jör illi may")).to.include(0);
    });

    if(env !== "light"){

        it("Should have been added properly to the index: Full", function(){

            flexsearch_ngram.add(0, "björn-phillipp mayer");

            expect(flexsearch_ngram.length).to.equal(1);
            expect(flexsearch_ngram.search("mayer")).to.have.lengthOf(1);

            expect(flexsearch_ngram.search("philip meier")).to.have.lengthOf(1);
            expect(flexsearch_ngram.search("philip meier")).to.include(0);
            expect(flexsearch_ngram.search("björn meier")).to.have.lengthOf(1);
            expect(flexsearch_ngram.search("björn meier")).to.include(0);
            expect(flexsearch_ngram.search("björn-peter mayer")).to.have.lengthOf(0);
        });
    }
});

// ------------------------------------------------------------------------
// Filter Tests
// ------------------------------------------------------------------------

describe("Filter", function(){

    it("Should have been filtered properly", function(){

        var index = new FlexSearch({
            encode: "icase",
            tokenize: "strict",
            filter: ["in", "the"]
        });

        index.add(0, "Today in the morning.");

        expect(index.length).to.equal(1);
        expect(index.search("today in the morning.")).to.include(0);
        expect(index.search("today morning")).to.include(0);
        expect(index.search("in the")).to.have.length(0);
    });

    it("Should have been filtered properly (custom function)", function(){

        var index = new FlexSearch({
            encode: "icase",
            tokenize: "strict",
            filter: function(word){
                return word.length > 3;
            }
        });

        index.add(0, "Today in the morning.");

        expect(index.length).to.equal(1);
        expect(index.search("today in the morning.")).to.include(0);
        expect(index.search("today morning")).to.include(0);
        expect(index.search("in the")).to.have.length(0);
    });
});

describe("Stemmer", function(){

    it("Should have been stemmed properly", function(){

        var index = new FlexSearch({
            encode: "icase",
            tokenize: "reverse",
            stemmer: {
                "ization": "ize",
                "tional": "tion"
            }
        });

        index.add(0, "Just a multinational colonization.");

        expect(index.length).to.equal(1);
        expect(index.search("Just a multinational colonization.")).to.include(0);
        expect(index.search("multinational colonization")).to.include(0);
        expect(index.search("tional tion")).to.have.length(0);
    });

    it("Should have been stemmed properly (custom function)", function(){

        var stems = {
            "ization": "ize",
            "tional": "tion"
        };

        var index = new FlexSearch({
            encode: "icase",
            tokenize: "strict",
            stemmer: function(word){
                return stems[word] || word;
            }
        });

        index.add(0, "Just a multinational colonization.");

        expect(index.length).to.equal(1);
        expect(index.search("Just a multinational colonization.")).to.include(0);
        expect(index.search("multinational colonization")).to.include(0);
        expect(index.search("tional tion")).to.have.length(0);
    });
});

// ------------------------------------------------------------------------
// Relevance Tests
// ------------------------------------------------------------------------

describe("Relevance", function(){

    it("Should have been sorted by relevance properly", function(){

        var index = new FlexSearch({
            encode: "advanced",
            tokenize: "strict"
        });

        index.add(0, "1 2 3 2 4 1 5 3");
        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "four two zero one three ten five seven eight six nine");

        expect(index.search("1")).to.have.members([0]);
        expect(index.search("one")).to.have.members([1, 2]);
        expect(index.search("one two")).to.have.members([1, 2]);
        expect(index.search("four one")).to.have.members([1, 2]);

        index = new FlexSearch({
            encode: "advanced",
            tokenize: "strict",
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

        index = new FlexSearch({
            encode: "extra",
            tokenize: "ngram",
            threshold: 5,
            depth: 3
        });

        index.add(0, "1 2 3 2 4 1 5 3");
        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "five two zero one three four ten seven eight six nine");

        expect(index.search("1 3 4")).to.have.members([0]);
        expect(index.search("1 5 3 4")).to.have.members([0]);
        expect(index.search("1 3 4 7")).to.have.lengthOf(0);
        expect(index.search("one")).to.have.members([1, 2]);
        expect(index.search("one three")).to.have.members([1, 2]);
        expect(index.search("three one")).to.have.members([1, 2]);
        expect(index.search("zero five one ten")).to.have.members([2]);
    });
});

// ------------------------------------------------------------------------
// Suggestion Tests
// ------------------------------------------------------------------------

if(env !== "light") describe("Suggestions", function(){

    it("Should have been suggested properly by relevance", function(){

        var index = new FlexSearch({
            encode: "advanced",
            tokenize: "strict",
            suggest: true
        });

        index.add(0, "1 2 3 2 4 1 5 3");
        index.add(1, "zero one two three four five six seven eight nine ten");
        index.add(2, "four two zero one three ten five seven eight six nine");

        expect(index.search("1 3 4 7")).to.have.members([0]);
        expect(index.search("1 3 9 7")).to.have.members([0]);
        expect(index.search("one foobar two")).to.have.members([1, 2]);
        expect(index.search("zero one foobar two foobar")).to.have.members([1, 2]);
        //TODO
        //expect(index.search("zero one foobar two foobar")[0]).to.equal(1);
    });
});

// ------------------------------------------------------------------------
// Where Clause
// ------------------------------------------------------------------------

if(env === "" || env === "min") describe("Where/Find", function(){

    var data = [{
        id: 0,
        title: "Title 1",
        cat: "1",
        flag: false
    },{
        id: 1,
        title: "Title 2",
        cat: "2",
        flag: false
    },{
        id: 2,
        title: "Title 3",
        cat: "1",
        flag: true
    }];

    it("Should have been found properly", function(){

        var index = new FlexSearch({
            doc: {
                id: "id",
                field: ["title"]
            }
        });

        index.add(data);

        //expect(index.length).to.equal(3);

        //expect(index.find(0)).to.equal(data[0]);
        expect(index.find("id", 0)).to.equal(data[0]);
        expect(index.where("id", 0)).to.have.members([data[0]]);
        expect(index.find(function(val){return val.id === 0;})).to.equal(data[0]);

        expect(index.find({id: 1})).to.equal(data[1]);
        expect(index.where({id: 1})).to.have.members([data[1]]);
        expect(index.where(function(val){return val.id === 1;})).to.have.members([data[1]]);

        expect(index.find({cat: "1"})).to.equal(data[0]);
        expect(index.find({cat: "2"})).to.equal(data[1]);
        expect(index.find({cat: "2", flag: true})).to.equal(null);
        expect(index.find(data[2])).to.equal(data[2]);
        expect(index.where(data[2])).to.have.members([data[2]]);

        expect(index.where({cat: "1"})).to.have.members([data[0], data[2]]);
        expect(index.search("title", {sort: "cat"})[1]).to.equal(data[2]);
        expect(index.search("title")).to.have.members(data);

        expect(index.search("title", {
            where: {
                cat: "1"
            }
        })).to.have.members([data[0], data[2]]);

        expect(index.search("title", {
            where: {
                cat: "1",
                flag: true
            }
        })).to.have.members([data[2]]);
    });
});

// ------------------------------------------------------------------------
//  Multi-Field Documents
// ------------------------------------------------------------------------

if(env !== "light") describe("Index Multi-Field Documents", function(){

    var data = [{

        id: 2,
        data:{
            title: "Title 3",
            body: "Body 3"
        }
    },{
        id: 1,
        data:{
            title: "Title 2",
            body: "Body 2"
        }
    },{
        id: 0,
        data:{
            title: "Title 1",
            body: "Body 1"
        }
    }];

    var update = [{

        id: 0,
        data:{
            title: "Foo 1",
            body: "Bar 1"
        }
    },{
        id: 1,
        data:{
            title: "Foo 2",
            body: "Bar 2"
        }
    },{
        id: 2,
        data:{
            title: "Foo 3",
            body: "Bar 3"
        }
    }];

    it("Should have been indexed properly", function(){

        var index = new FlexSearch({

            doc: {

                id: "id",
                field: [
                    "data:title",
                    "data:body"
                ]
            }
        });

        index.add(data);

        if(env === ""){

            expect(index.doc.index["data:title"].length).to.equal(3);
            expect(index.doc.index["data:body"].length).to.equal(3);
        }

        expect(index.search({field: "data:body", query: "body"})).to.have.members(data);
        expect(index.search({field: "data:title", query: "title"})).to.have.members(data);

        expect(index.search({field: "data:body", query: "title"})).to.have.lengthOf(0);
        expect(index.search({field: "data:title", query: "body"})).to.have.lengthOf(0);

        //TODO: provide logical operator "OR"
        //expect(index.search({field: ["data:title", "data:body"], query: "body"})).to.have.members(data);
        //expect(index.search({field: ["data:body", "data:title"], query: "title"})).to.have.members(data);
        expect(index.search({field: "data:body", query: "body"})).to.have.members(data);
        expect(index.search({field: ["data:title"], query: "title"})).to.have.members(data);

        //TODO: provide logical operator "OR"
        //expect(index.search({query: "body"})).to.have.members(data);
        //expect(index.search("title")).to.have.members(data);
        expect(index.search("body", {field: "data:body"})).to.have.members(data);
        expect(index.search("title", {field: ["data:title"]})).to.have.members(data);

        expect(index.search({

            field: "data:title",
            query: "title",
            boost: 2

        })).to.have.members(data);

        //TODO: provide logical operator "OR"
        // expect(index.search([{
        //
        //     field: "data:title",
        //     query: "body",
        //     boost: 2
        // },{
        //     field: "data:body",
        //     query: "body",
        //     boost: 2
        //
        // }])).to.have.members(data);

        expect(index.search("title", {

            field: "data:title",
            boost: 2

        })).to.have.members(data);

        expect(index.search("title", {

            field: "data:body",
            boost: 2

        })).to.have.lengthOf(0);

        //TODO: provide logical operator "OR"
        // expect(index.search("body", [{
        //
        //     field: "data:title",
        //     boost: 2
        // },{
        //     field: "data:body",
        //     boost: 2
        //
        // }])).to.have.members(data);

        index.update(update);

        //TODO: provide logical operator "OR"
        // expect(index.search("foo")).not.to.have.members(data);
        // expect(index.search("bar")).not.to.have.members(data);
        // expect(index.search("foo")).to.have.members(update);
        // expect(index.search("bar")).to.have.members(update);
        expect(index.search("foo", {field: "data:title"})).not.to.have.members(data);
        expect(index.search("bar", {field: "data:body"})).not.to.have.members(data);
        expect(index.search("foo", {field: "data:title"})).to.have.members(update);
        expect(index.search("bar", {field: "data:body"})).to.have.members(update);

        index.remove(update);

        if(env === ""){

            expect(index.doc.index["data:title"].length).to.equal(0);
            expect(index.doc.index["data:body"].length).to.equal(0);
        }
    });

    it("Should have been indexed properly (custom fields)", function(){

        var index = new FlexSearch({

            doc: {

                id: "id",
                field: {
                    "data:title": {
                        encode: "advanced",
                        tokenize: "reverse"
                    },
                    "data:body": {
                        encode: "icase",
                        tokenize: "strict"
                    }
                }
            }
        });

        index.add(data);

        if(env === ""){

            expect(index.doc.index["data:title"].length).to.equal(3);
            expect(index.doc.index["data:body"].length).to.equal(3);
        }

        expect(index.search({field: "data:body", query: "body"})).to.have.members(data);
        expect(index.search({field: "data:title", query: "tle"})).to.have.members(data);

        expect(index.search({field: "data:body", query: "title"})).to.have.lengthOf(0);
        expect(index.search({field: "data:title", query: "body"})).to.have.lengthOf(0);

        //TODO: provide logical operator "OR"
        //expect(index.search({field: ["data:title", "data:body"], query: "body"})).to.have.members(data);
        //expect(index.search({field: ["data:body", "data:title"], query: "tle"})).to.have.members(data);
        expect(index.search({field: ["data:body"], query: "body"})).to.have.members(data);
        expect(index.search({field: "data:title", query: "tle"})).to.have.members(data);

        //TODO: provide logical operator "OR"
        //expect(index.search({query: "body"})).to.have.members(data);
        //expect(index.search("tle")).to.have.members(data);
        expect(index.search({query: "body", field: "data:body"})).to.have.members(data);
        expect(index.search("tle", {field: "data:title"})).to.have.members(data);

        expect(index.search({

            field: "data:title",
            query: "tle"

        })).to.have.members(data);

        //TODO: provide logical operator "OR"
        // expect(index.search([{
        //
        //     field: "data:title",
        //     query: "body"
        // },{
        //     field: "data:body",
        //     query: "body"
        //
        // }])).to.have.members(data);

        expect(index.search("tle", {

            field: "data:title"

        })).to.have.members(data);

        expect(index.search("tle", {

            field: "data:body"

        })).to.have.lengthOf(0);

        //TODO: provide logical operator "OR"
        // expect(index.search("body", [{
        //
        //     field: "data:title"
        // },{
        //     field: "data:body"
        //
        // }])).to.have.members(data);

        index.update(update);

        //TODO: provide logical operator "OR"
        // expect(index.search("foo")).not.to.have.members(data);
        // expect(index.search("bar")).not.to.have.members(data);
        // expect(index.search("foo")).to.have.members(update);
        // expect(index.search("bar")).to.have.members(update);
        expect(index.search("foo", {field: "data:title"})).not.to.have.members(data);
        expect(index.search("bar", {field: "data:body"})).not.to.have.members(data);
        expect(index.search("foo", {field: "data:title"})).to.have.members(update);
        expect(index.search("bar", {field: "data:body"})).to.have.members(update);

        index.remove(update);

        if(env === ""){

            expect(index.doc.index["data:title"].length).to.equal(0);
            expect(index.doc.index["data:body"].length).to.equal(0);
        }
    });

    it("Should have been unique results", function(){

        var index = new FlexSearch({
            doc: {
                id: "id",
                field: ["field1", "field2"]
            }
        });

        var docs = [{
            id: 1,
            field1: "phrase",
            field2: "phrase"
        }];

        index.add(docs);

        expect(index.search("phrase")).to.have.lengthOf(1);
        expect(index.search("phrase")).to.have.members(docs);
    });

    /*
    it("Should have been indexed properly (tag)", function(){

        var index = new FlexSearch({

            doc: {

                id: "id",
                field: "data:body",
                tag: "data:title"
            }
        });

        index.add(data);

        expect(index.doc.index[0].length).to.equal(3);
        expect(index.doc.index[1].length).to.equal(3);

        expect(index.search({field: "data:body", query: "body"})).to.have.members(data);
        expect(index.search({field: "data:title", query: "title"})).to.have.lengthOf(0);
        expect(index.search({field: "data:title", query: "Title 1"})).to.have.members(data[0]);

        expect(index.search({field: "data:body", query: "title"})).to.have.lengthOf(0);
        expect(index.search({field: "data:title", query: "body"})).to.have.lengthOf(0);

        expect(index.search({field: ["data:title", "data:body"], query: "body"})).to.have.members(data);
        expect(index.search({field: ["data:body", "data:title"], query: "title"})).to.have.members(data);

        expect(index.search({query: "body"})).to.have.members(data);
        expect(index.search("title")).to.have.members(data);

        expect(index.search({

            field: "data:title",
            query: "title",
            boost: 2

        })).to.have.members(data);

        expect(index.search([{

            field: "data:title",
            query: "body",
            boost: 2
        },{
            field: "data:body",
            query: "body",
            boost: 2

        }])).to.have.members(data);

        expect(index.search("title", {

            field: "data:title",
            boost: 2

        })).to.have.members(data);

        expect(index.search("title", {

            field: "data:body",
            boost: 2

        })).to.have.lengthOf(0);

        expect(index.search("body", [{

            field: "data:title",
            boost: 2
        },{
            field: "data:body",
            boost: 2

        }])).to.have.members(data);

        index.update(update);

        expect(index.search("foo")).not.to.have.members(data);
        expect(index.search("bar")).not.to.have.members(data);
        expect(index.search("foo")).to.have.members(update);
        expect(index.search("bar")).to.have.members(update);

        index.remove(update);

        expect(index.doc.index[0].length).to.equal(0);
        expect(index.doc.index[1].length).to.equal(0);
    });
    */

    /*
    it("Should have been boosted properly", function(){

        var index = new FlexSearch({

            tokenize: "strict",
            depth: 3,
            doc: {
                id: "id",
                field: ["title", "body"]
            }
        });

        index.add([{

            id: 0,
            title: "1 2 3 4 5",
            body: "1 2 3 4 5"
        },{
            id: 1,
            title: "1 2 3 4 5",
            body: "1 2 5 4 3" // <-- body
        },{
            id: 2,
            title: "1 2 5 4 3", // <-- title
            body: "1 2 3 4 5"
        }]);

        expect(index.search([{

            field: "title",
            query: "5",
            boost: 0.1
        },{
            field: "body",
            query: "5",
            boost: 9

        }])[0].id).to.equal(1);

        expect(index.search([{

            field: "title",
            query: "5",
            boost: 9
        },{
            field: "body",
            query: "5",
            boost: 0.1

        }])[0].id).to.equal(2);
    });
    */

    it("Should have been sorted properly", function(){

        var index = new FlexSearch({

            doc: {
                id: "id",
                field: "data:title"
            }
        });

        index.add(data);

        var results = index.search({

            field: "data:title",
            query: "title"
        });

        expect(results[0]).to.equal(data[0]);
        expect(results[1]).to.equal(data[1]);
        expect(results[2]).to.equal(data[2]);

        results = index.search({

            query: "title",
            field: "data:title",
            sort: function(a, b){

                const diff = a.id - b.id;
                return (diff < 0 ? -1 : (diff ? 1 : 0));
            }
        });

        expect(results[0]).to.equal(data[2]);
        expect(results[1]).to.equal(data[1]);
        expect(results[2]).to.equal(data[0]);

        results = index.search({

            query: "title",
            field: "data:title",
            sort: "id"
        });

        expect(results[0]).to.equal(data[2]);
        expect(results[1]).to.equal(data[1]);
        expect(results[2]).to.equal(data[0]);

        results = index.search({

            query: "title",
            field: "data:title",
            sort: "data:title"
        });

        expect(results[0]).to.equal(data[2]);
        expect(results[1]).to.equal(data[1]);
        expect(results[2]).to.equal(data[0]);
    });

    if(env === "" && (typeof require !== "undefined") && !this._phantom){

        require("./test.es6.js");
    }
});

// ------------------------------------------------------------------------
// Export / Import
// ------------------------------------------------------------------------

if(env !== "light") describe("Export / Import", function(){

    var data;

    it("Should have been exported properly", function(){

        var index = new FlexSearch({
            tokenize: "reverse",
            doc: {
                id: "id",
                field: "title"
            }
        });

        index.add({id: 0, title: "foo"});
        index.add({id: 1, title: "bar"});
        index.add({id: 2, title: "foobar"});

        data = index.export();

        if(env === ""){

            expect(index.doc.index["title"].length).to.equal(3);
            expect(data).to.equal(JSON.stringify([
                [
                    index.doc.index["title"]._map,
                    index.doc.index["title"]._ctx,
                    index.doc.index["title"]._ids
                ],
                index._doc
            ]));
        }
    });

    it("Should have been imported properly", function(){

        var index = new FlexSearch("score", {
            doc: {
                id: "id",
                field: "title"
            }
        });

        index.import(data);

        if(env === ""){

            expect(index.doc.index["title"].length).to.equal(3);
        }

        expect(index.search("foo")).to.have.lengthOf(2);
        expect(index.search("bar")).to.have.lengthOf(2);
        expect(index.search("foobar")).to.have.lengthOf(1);
        expect(index.search("foobar")[0].id).to.equal(2);
    });
});

// ------------------------------------------------------------------------
// Feature Tests
// ------------------------------------------------------------------------

describe("Add Matchers", function(){

    it("Should have been added properly", function(){

        FlexSearch.registerMatcher({

            "1": "a",
            "2": "b",
            "3": "c",
            "[456]": "d"
        });

        flexsearch_forward.init({

            encode: false

        }).init({

            encode: "not-found",
            matcher: {

                "7": "e"
            }

        }).addMatcher({

            "8": "f"

        }).add(0, "12345678");

        expect(flexsearch_forward.search("12345678")).to.include(0);
        expect(flexsearch_forward.search("abcd")).to.include(0);
        expect(flexsearch_forward.encode("12345678")).to.equal("abcdddef");
    });
});

// ------------------------------------------------------------------------
// Caching
// ------------------------------------------------------------------------

if(env !== "light"){

    describe("Caching", function(){

        it("Should have been cached properly", function(){

            flexsearch_cache.add(0, "foo")
                            .add(1, "bar")
                            .add(2, "foobar");
            // fetch:
            expect(flexsearch_cache.search("foo")).to.have.members([0, 2]);
            expect(flexsearch_cache.search("bar")).to.have.members([1, 2]);
            expect(flexsearch_cache.search("foobar")).to.include(2);

            // cache:
            expect(flexsearch_cache.search("foo")).to.have.members([0, 2]);
            expect(flexsearch_cache.search("bar")).to.have.members([1, 2]);
            expect(flexsearch_cache.search("foobar")).to.include(2);

            // update:
            flexsearch_cache.remove(2).update(1, "foo").add(3, "foobar");

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
}

// ------------------------------------------------------------------------
// Debug Information
// ------------------------------------------------------------------------

if(env !== "light" && env !== "min"){

    describe("Debug", function(){

        it("Should have been debug mode activated", function(){

            var info = flexsearch_cache.info();

            expect(info).to.have.keys([

                "id",
                "chars",
                "cache",
                "items",
                "matcher",
                "memory",
                "sequences",
                "worker",
                "contextual",
                "depth",
                "threshold"
            ]);
        });
    });
}

// ------------------------------------------------------------------------
// Chaining
// ------------------------------------------------------------------------

describe("Chaining", function(){

    it("Should have been chained properly", function(){

        var index = FlexSearch.create({tokenize: "forward", encode: "icase"})
                              .addMatcher({"â": "a"})
                              .add(0, "foo")
                              .add(1, "bar");

        expect(index.search("foo")).to.include(0);
        expect(index.search("bar")).to.include(1);
        expect(index.encode("bâr")).to.equal("bar");

        index.remove(0).update(1, "foo").add(2, "foobâr");

        expect(index.search("foo")).to.have.members([1, 2]);
        expect(index.search("bar")).to.have.lengthOf(0);
        expect(index.search("foobar")).to.include(2);

        index.clear().add(0, "foo").add(1, "bar");

        expect(index.search("foo")).to.include(0);
        expect(index.search("bar")).to.include(1);
        expect(index.search("foobar")).to.have.lengthOf(0);

        flexsearch_cache.destroy().init().add(0, "foo").add(1, "bar");

        expect(flexsearch_cache.search("foo")).to.include(0);
        expect(flexsearch_cache.search("bar")).to.include(1);
        expect(flexsearch_cache.search("foobar")).to.have.lengthOf(0);
    });
});

/* Test Helpers */

function test_encoder(str){

    return "-[" + str.toUpperCase() + "]-";
}
