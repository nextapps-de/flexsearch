/*
 FlexSearch v0.2.68
 Copyright 2018 Thomas Wilkerling
 Released under the Apache 2.0 Licence
 https://github.com/nextapps-de/flexsearch
*/
'use strict';
(function(){
    provide("FlexSearch", function factory(){
        var defaults = {
            encode: "icase",
            mode: "forward",
            suggest: false,
            cache: false,
            async: false,
            worker: false,
            threshold: 0,
            depth: 0
        };
        var profiles = {
            "memory": {encode: "extra", mode: "strict", threshold: 7},
            "speed": {encode: "icase", mode: "strict", threshold: 7, depth: 2},
            "match": {encode: "extra", mode: "full"},
            "score": {encode: "extra", mode: "strict", threshold: 5, depth: 4},
            "balance": {encode: "balance", mode: "ngram", threshold: 6, depth: 3},
            "fastest": {encode: "icase", mode: "strict", threshold: 9, depth: 1}
        };
        var globalMatcher = [];
        var idCounter = 0;
        var regexSplit = regex("[ -/]");
        var filter = createObject();
        var stemmer = createObject();
        var indexBlacklist = function(){
            var array = Object.getOwnPropertyNames({}.__proto__);
            var map = createObject();
            for(var i = 0; i < array.length; i++){
                map[array[i]] = 1;
            }
            return map;
        }();

        function FlexSearch(options){
            if(typeof options === "string" && !indexBlacklist[options]){
                options = profiles[options];
            }
            options || (options = defaults);
            this.id = options["id"] || idCounter++;
            this.init(options);
            registerProperty(this, "index", function(){
                return this._ids;
            });
            registerProperty(this, "length", function(){
                return Object.keys(this._ids).length;
            });
        }

        FlexSearch.new = function(options){
            return new this(options);
        };
        FlexSearch.create = function(options){
            return FlexSearch.new(options);
        };
        FlexSearch.registerMatcher = function(matcher){
            for(var key in matcher){
                if(matcher.hasOwnProperty(key)){
                    globalMatcher.push(regex(key), matcher[key]);
                }
            }
            return this;
        };
        FlexSearch.registerEncoder = function(name, encoder){
            if(!indexBlacklist[name]){
                globalEncoder[name] = encoder;
            }
            return this;
        };
        FlexSearch.registerLanguage = function(lang, languagePack){
            if(!indexBlacklist[lang]){
                filter[lang] = languagePack["filter"];
                stemmer[lang] = languagePack["stemmer"];
            }
            return this;
        };
        FlexSearch.encode = function(name, value){
            if(indexBlacklist[name]){
                return value;
            }
            else{
                return globalEncoder[name].call(globalEncoder, value);
            }
        };
        FlexSearch.prototype.init = function(options){
            this._matcher = [];
            options || (options = defaults);
            var custom = options["profile"];
            var profile = custom && !indexBlacklist[custom] ? profiles[custom] : createObject();
            this.mode = options["mode"] || profile.mode || this.mode || defaults.mode;
            this.threshold = options["threshold"] || profile.threshold || this.threshold || defaults.threshold;
            this.depth = options["depth"] || profile.depth || this.depth || defaults.depth;
            this.suggest = options["suggest"] || this.suggest || defaults.suggest;
            custom = options["encode"] || profile.encode;
            this.encoder = custom && !indexBlacklist[custom] && globalEncoder[custom] || (typeof custom === "function" ? custom : this.encoder || false);
            if(custom = options["matcher"]){
                this.addMatcher(custom);
            }
            if((custom = options["filter"]) && !indexBlacklist[custom]){
                this.filter = initFilter(filter[custom] || custom, this.encoder);
            }
            if((custom = options["stemmer"]) && !indexBlacklist[custom]){
                this.stemmer = initStemmer(stemmer[custom] || custom, this.encoder);
            }
            this._map = createObject(10);
            this._ctx = createObject();
            this._ids = createObject();
            this._stack = createObject();
            this._stackKeys = [];
            this._timer = null;
            return this;
        };
        FlexSearch.prototype.encode = function(value){
            if(value && globalMatcher.length){
                value = replace(value, globalMatcher);
            }
            if(value && this._matcher.length){
                value = replace(value, this._matcher);
            }
            if(value && this.encoder){
                value = this.encoder.call(globalEncoder, value);
            }
            if(value && this.stemmer){
                value = replace(value, this.stemmer);
            }
            return value;
        };
        FlexSearch.prototype.addMatcher = function(custom){
            var matcher = this._matcher;
            for(var key in custom){
                if(custom.hasOwnProperty(key)){
                    matcher.push(regex(key), custom[key]);
                }
            }
            return this;
        };
        FlexSearch.prototype.add = function(id, content, _skipUpdate){
            if(typeof content === "string" && content && (id && !indexBlacklist[id] || id === 0)){
                if(this._ids[id] && !_skipUpdate){
                    this.update(id, content);
                }
                else{
                    content = this.encode(content);
                    if(!content.length){
                        return this;
                    }
                    var tokenizer = this.mode;
                    var words = typeof tokenizer === "function" ? tokenizer(content) : tokenizer === "ngram" ? ngram(content) : content.split(regexSplit);
                    var dupes = createObject();
                    dupes["_ctx"] = createObject();
                    var threshold = this.threshold;
                    var depth = this.depth;
                    var map = this._map;
                    var wordLength = words.length;
                    for(var i = 0; i < wordLength; i++){
                        var value = words[i];
                        if(value){
                            var length = value.length;
                            var contextScore = (wordLength - i) / wordLength;
                            switch(tokenizer){
                                case "reverse":
                                case "both":
                                    var tmp = "";
                                    for(var a = length - 1; a >= 1; a--){
                                        tmp = value[a] + tmp;
                                        addIndex(map, dupes, tmp, id, (length - a) / length, contextScore, threshold);
                                    }
                                case "forward":
                                    var tmp = "";
                                    for(var a = 0; a < length; a++){
                                        tmp += value[a];
                                        addIndex(map, dupes, tmp, id, 1, contextScore, threshold);
                                    }
                                    break;
                                case "full":
                                    var tmp = "";
                                    for(var x = 0; x < length; x++){
                                        var partialScore = (length - x) / length;
                                        for(var y = length; y > x; y--){
                                            tmp = value.substring(x, y);
                                            addIndex(map, dupes, tmp, id, partialScore, contextScore, threshold);
                                        }
                                    }
                                    break;
                                case "strict":
                                case "ngram":
                                default:
                                    var score = addIndex(map, dupes, value, id, 1, contextScore, threshold);
                                    if(depth && wordLength > 1 && score >= threshold){
                                        var ctxDupes = dupes["_ctx"][value] || (dupes["_ctx"][value] = createObject());
                                        var ctxTmp = this._ctx[value] || (this._ctx[value] = createObject(10));
                                        var x = i - depth;
                                        var y = i + depth + 1;
                                        if(x < 0){
                                            x = 0;
                                        }
                                        if(y > wordLength){
                                            y = wordLength;
                                        }
                                        for(; x < y; x++){
                                            if(x !== i){
                                                addIndex(ctxTmp, ctxDupes, words[x], id, 0, 10 - (x < i ? i - x : x - i), threshold);
                                            }
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                    this._ids[id] = "1";
                }
            }
            return this;
        };
        FlexSearch.prototype.update = function(id, content){
            if(this._ids[id] && content && typeof content === "string"){
                this.remove(id);
                this.add(id, content, true);
            }
            return this;
        };
        FlexSearch.prototype.remove = function(id){
            if(this._ids[id] && !indexBlacklist[id]){
                for(var z = 0; z < 10; z++){
                    removeIndex(this._map[z], id);
                }
                if(this.depth){
                    removeIndex(this._ctx, id);
                }
                delete this._ids[id];
            }
            return this;
        };
        FlexSearch.prototype.search = function(query, limit, callback){
            var threshold;
            var result = [];
            if(query && typeof query === "object"){
                callback = query["callback"] || limit;
                limit = query["limit"];
                threshold = query["threshold"];
                query = query["query"];
            }
            threshold = (threshold || this.threshold || 0) | 0;
            if(typeof limit === "function"){
                callback = limit;
                limit = 1000;
            }
            else{
                limit || (limit = 1000);
            }
            if(callback){
                var self = this;
                queue(function(){
                    callback(self.search(query, limit));
                    self = null;
                }, 1, "search-" + this.id);
                return null;
            }
            if(!query || typeof query !== "string"){
                return result;
            }
            var _query = query;
            _query = this.encode(_query);
            if(!_query.length){
                return result;
            }
            var tokenizer = this.mode;
            var words = typeof tokenizer === "function" ? tokenizer(_query) : tokenizer === "ngram" ? ngram(_query) : _query.split(regexSplit);
            var length = words.length;
            var found = true;
            var check = [];
            var checkWords = createObject();
            if(length > 1){
                if(this.depth){
                    var useContextual = true;
                    var ctxRoot = words[0];
                    checkWords[ctxRoot] = "1";
                }
                else{
                    words.sort(sortByLengthDown);
                }
            }
            var ctxMap;
            if(!useContextual || (ctxMap = this._ctx)[ctxRoot]){
                for(var a = useContextual ? 1 : 0; a < length; a++){
                    var value = words[a];
                    if(value && !checkWords[value]){
                        var map;
                        var mapFound = false;
                        var mapCheck = [];
                        var count = 0;
                        for(var z = 9; z >= threshold; z--){
                            map = (useContextual ? ctxMap[ctxRoot] : this._map)[z][value];
                            if(map){
                                mapCheck[count++] = map;
                                mapFound = true;
                            }
                        }
                        if(!mapFound){
                            if(!this.suggest){
                                found = false;
                                break;
                            }
                        }
                        else{
                            check[check.length] = count > 1 ? check.concat.apply([], mapCheck) : mapCheck[0];
                        }
                        checkWords[value] = "1";
                    }
                    ctxRoot = value;
                }
            }
            else{
                found = false;
            }
            if(found){
                result = intersect(check, limit, this.suggest);
            }
            return result;
        };
        FlexSearch.prototype.reset = function(){
            this.destroy();
            return this.init();
        };
        FlexSearch.prototype.destroy = function(){
            this.filter = this.stemmer = this._scores = this._map = this._ctx = this._ids = this._stack = this._stackKeys = null;
            return this;
        };
        var globalEncoderBalance = function(){
            var regexWhitespace = regex("\\s\\s+"), regexStrip = regex("[^a-z0-9 ]"), regexSpace = regex("[-/]"),
                regexVowel = regex("[aeiouy]");
            var regexPairs = [regexSpace, " ", regexStrip, "", regexWhitespace, " "];
            return function(value){
                return collapseRepeatingChars(replace(value.toLowerCase(), regexPairs));
            };
        }();
        var globalEncoderIcase = function(value){
            return value.toLowerCase();
        };
        var globalEncoder = Object.create({
            "icase": globalEncoderIcase, "simple": function(){
                var regexWhitespace = regex("\\s\\s+"), regexStrip = regex("[^a-z0-9 ]"), regexSpace = regex("[-/]"),
                    regexA = regex("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"),
                    regexE = regex("[\u00e8\u00e9\u00ea\u00eb]"), regexI = regex("[\u00ec\u00ed\u00ee\u00ef]"),
                    regexO = regex("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"),
                    regexU = regex("[\u00f9\u00fa\u00fb\u00fc\u0171]"), regexY = regex("[\u00fd\u0177\u00ff]"),
                    regexN = regex("\u00f1"), regexC = regex("\u00e7"), regexS = regex("\u00df"),
                    regexAnd = regex(" & ");
                var regexPairs = [regexA, "a", regexE, "e", regexI, "i", regexO, "o", regexU, "u", regexY, "y", regexN, "n", regexC, "c", regexS, "s", regexAnd, " and ", regexSpace, " ", regexStrip, "", regexWhitespace, " "];
                return function(str){
                    str = replace(str.toLowerCase(), regexPairs);
                    return str !== " " ? str : "";
                };
            }(), "advanced": function(){
                var regexSpace = regex(" "), regexAe = regex("ae"), regexAi = regex("ai"), regexAy = regex("ay"),
                    regexEy = regex("ey"), regexOe = regex("oe"), regexUe = regex("ue"), regexIe = regex("ie"),
                    regexSz = regex("sz"), regexZs = regex("zs"), regexCk = regex("ck"), regexCc = regex("cc"),
                    regexSh = regex("sh"), regexDt = regex("dt"), regexPh = regex("ph"), regexPf = regex("pf"),
                    regexOu = regex("ou"), regexUo = regex("uo");
                var regexPairs = [regexAe, "a", regexAi, "ei", regexAy, "ei", regexEy, "ei", regexOe, "o", regexUe, "u", regexIe, "i", regexSz, "s", regexZs, "s", regexSh, "s", regexCk, "k", regexCc, "k", regexDt, "t", regexPh, "f", regexPf, "f", regexOu, "o", regexUo, "u"];
                return function(string, _skipPostProcessing){
                    if(!string){
                        return string;
                    }
                    string = this["simple"](string);
                    if(string.length > 2){
                        string = replace(string, regexPairs);
                    }
                    if(!_skipPostProcessing){
                        if(string.length > 1){
                            string = collapseRepeatingChars(string);
                        }
                    }
                    return string;
                };
            }(), "extra": function(){
                var soundexB = regex("p"), soundexS = regex("z"), soundexK = regex("[cgq]"), soundexM = regex("n"),
                    soundexT = regex("d"), soundexF = regex("[vw]");
                var regexVowel = regex("[aeiouy]");
                var regexPairs = [soundexB, "b", soundexS, "s", soundexK, "k", soundexM, "m", soundexT, "t", soundexF, "f", regexVowel, ""];
                return function(str){
                    if(!str){
                        return str;
                    }
                    str = this["advanced"](str, true);
                    if(str.length > 1){
                        str = str.split(" ");
                        for(var i = 0; i < str.length; i++){
                            var current = str[i];
                            if(current.length > 1){
                                str[i] = current[0] + replace(current.substring(1), regexPairs);
                            }
                        }
                        str = str.join(" ");
                        str = collapseRepeatingChars(str);
                    }
                    return str;
                };
            }(), "balance": globalEncoderBalance
        });
        var queue = null;
        return FlexSearch;

        function registerProperty(obj, key, fn){
            Object.defineProperty(obj, key, {get: fn});
        }

        function regex(str){
            return new RegExp(str, "g");
        }

        function replace(str, regex, replacement){
            if(typeof replacement === "undefined"){
                for(var i = 0; i < regex.length; i += 2){
                    str = str.replace(regex[i], regex[i + 1]);
                }
                return str;
            }
            else{
                return str.replace(regex, replacement);
            }
        }

        function addIndex(map, dupes, tmp, id, partialScore, contextScore, threshold){
            if(typeof dupes[tmp] === "undefined"){
                var score = partialScore ? (9 - (threshold || 6)) * contextScore + (threshold || 6) * partialScore : contextScore;
                dupes[tmp] = score;
                if(score >= threshold){
                    var arr = map[score + 0.5 | 0];
                    arr = arr[tmp] || (arr[tmp] = []);
                    arr[arr.length] = id;
                }
            }
            return score || dupes[tmp];
        }

        function removeIndex(map, id){
            if(map){
                var keys = Object.keys(map);
                for(var i = 0, lengthKeys = keys.length; i < lengthKeys; i++){
                    var key = keys[i];
                    var tmp = map[key];
                    if(tmp){
                        for(var a = 0, lengthMap = tmp.length; a < lengthMap; a++){
                            if(tmp[a] === id){
                                if(lengthMap === 1){
                                    delete map[key];
                                }
                                else{
                                    tmp.splice(a, 1);
                                }
                                break;
                            }
                            else{
                                if(typeof tmp[a] === "object"){
                                    removeIndex(tmp[a], id);
                                }
                            }
                        }
                    }
                }
            }
        }

        function ngram(value){
            var parts = [];
            if(!value){
                return parts;
            }
            var countVowels = 0, countLiteral = 0, countParts = 0;
            var tmp = "";
            var length = value.length;
            for(var i = 0; i < length; i++){
                var char = value[i];
                var charIsVowel = char === "a" || char === "e" || char === "i" || char === "o" || char === "u" || char === "y";
                if(charIsVowel){
                    countVowels++;
                }
                else{
                    countLiteral++;
                }
                if(char !== " "){
                    tmp += char;
                }
                if(char === " " || countVowels >= (length > 8 ? 2 : 1) && countLiteral >= 2 || countVowels >= 2 && countLiteral >= (length > 8 ? 2 : 1) || i === length - 1){
                    if(tmp){
                        if(parts[countParts] && tmp.length > 2){
                            countParts++;
                        }
                        if(parts[countParts]){
                            parts[countParts] += tmp;
                        }
                        else{
                            parts[countParts] = tmp;
                        }
                        if(char === " "){
                            countParts++;
                        }
                        tmp = "";
                    }
                    countVowels = 0;
                    countLiteral = 0;
                }
            }
            return parts;
        }

        function collapseRepeatingChars(string){
            var collapsedString = "", charPrev = "", charNext = "";
            for(var i = 0; i < string.length; i++){
                var char = string[i];
                if(char !== charPrev){
                    if(i && char === "h"){
                        var charPrevIsVowel = charPrev === "a" || charPrev === "e" || charPrev === "i" || charPrev === "o" || charPrev === "u" || charPrev === "y";
                        var charNextIsVowel = charNext === "a" || charNext === "e" || charNext === "i" || charNext === "o" || charNext === "u" || charNext === "y";
                        if(charPrevIsVowel && charNextIsVowel || charPrev === " "){
                            collapsedString += char;
                        }
                    }
                    else{
                        collapsedString += char;
                    }
                }
                charNext = i === string.length - 1 ? "" : string[i + 1];
                charPrev = char;
            }
            return collapsedString;
        }

        function initFilter(words, encoder){
            var final = createObject();
            if(words){
                for(var i = 0; i < words.length; i++){
                    var word = encoder ? encoder.call(globalEncoder, words[i]) : words[i];
                    final[word] = String.fromCharCode(65000 - words.length + i);
                }
            }
            return final;
        }

        function initStemmer(stemmer, encoder){
            var final = [];
            if(stemmer){
                for(var key in stemmer){
                    if(stemmer.hasOwnProperty(key)){
                        var tmp = encoder ? encoder.call(globalEncoder, key) : key;
                        final.push(regex("(?=.{" + (tmp.length + 3) + ",})" + tmp + "$"), encoder ? encoder.call(globalEncoder, stemmer[key]) : stemmer[key]);
                    }
                }
            }
            return final;
        }

        function sortByLengthDown(a, b){
            var diff = a.length - b.length;
            return diff < 0 ? 1 : diff > 0 ? -1 : 0;
        }

        function sortByLengthUp(a, b){
            var diff = a.length - b.length;
            return diff < 0 ? -1 : diff > 0 ? 1 : 0;
        }

        function intersect(arrays, limit, suggest){
            var result = [];
            var suggestions = [];
            var lengthZ = arrays.length;
            if(lengthZ > 1){
                arrays.sort(sortByLengthUp);
                var check = createObject();
                var arr = arrays[0];
                var length = arr.length;
                var i = 0;
                while(i < length){
                    check[arr[i++]] = 1;
                }
                var tmp, count = 0;
                var z = 1;
                while(z < lengthZ){
                    var found = false;
                    var isFinalLoop = z === lengthZ - 1;
                    suggestions = [];
                    arr = arrays[z];
                    length = arr.length;
                    i = -1;
                    while(i < length){
                        var checkVal = check[tmp = arr[++i]];
                        if(checkVal === z){
                            if(isFinalLoop){
                                result[count++] = tmp;
                                if(limit && count === limit){
                                    return result;
                                }
                            }
                            found = true;
                            check[tmp] = z + 1;
                        }
                        else{
                            if(suggest){
                                var currentSuggestion = suggestions[checkVal] || (suggestions[checkVal] = []);
                                currentSuggestion[currentSuggestion.length] = tmp;
                            }
                        }
                    }
                    if(!found && !suggest){
                        break;
                    }
                    z++;
                }
                if(suggest){
                    limit || (limit = 1000);
                    count = result.length;
                    length = suggestions.length;
                    if(count < limit && length){
                        for(z = length - 1; z >= 0; z--){
                            tmp = suggestions[z];
                            if(tmp){
                                for(i = 0; i < tmp.length; i++){
                                    result[count++] = tmp[i];
                                    if(limit && count === limit){
                                        return result;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else{
                if(lengthZ){
                    result = arrays[0];
                    if(limit && result.length > limit){
                        result = result.slice(0, limit);
                    }
                }
            }
            return result;
        }

        function createObject(count){
            if(count){
                var array = new Array(count);
                for(var i = 0; i < count; i++){
                    array[i] = createObject();
                }
                return array;
            }
            else{
                return Object.create(null);
            }
        }
    }(), this);

    function provide(name, factory, root){
        var prop;
        if((prop = root["define"]) && prop["amd"]){
            prop([], function(){
                return factory;
            });
        }
        else{
            if(prop = root["modules"]){
                prop[name.toLowerCase()] = factory;
            }
            else{
                if(typeof module !== "undefined"){
                    module.exports = factory;
                }
                else{
                    root[name] = factory;
                }
            }
        }
    }
}).call(this);
