import { EncoderOptions } from "../type.js";

/**
 * http://www.ranks.nl/stopwords
 * @type {Set<string>}
 */
export const filter = new Set(["a", "about", "above", "after", "again", "against", "all", "also", "am", "an", "and", "any", "are", "arent", "as", "at", "back", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "cannot", "cant", "come", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "even", "few", "for", "from", "further", "get", "go", "good", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "her", "here", "heres", "hers", "herself", "hes", "him", "himself", "his", "how", "hows", "i", "id", "if", "ill", "im", "in", "into", "is", "isnt", "it", "its", "itself", "ive", "just", "know", "lets", "like", "lot", "make", "made", "me", "more", "most", "mustnt", "my", "myself", "new", "no", "nor", "not", "now", "of", "off", "on", "once", "one", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "say", "see", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "take", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "think", "this", "those", "through", "time", "times", "to", "too", "under", "until", "up", "us", "use", "very", "want", "was", "wasnt", "way", "we", "wed", "well", "were", "werent", "weve", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whom", "whos", "why", "whys", "will", "with", "wont", "work", "would", "wouldnt", "ya", "you", "youd", "youll", "your", "youre", "yours", "yourself", "yourselves", "youve"]);

/**
 * @type {Map<string, string>}
 */

export const stemmer = new Map([["ization", ""], ["biliti", ""], ["icate", ""], ["ative", ""], ["ation", ""], ["iviti", ""], ["ement", ""], ["izer", ""], ["able", ""], ["ible", ""], ["alli", ""], ["ator", ""], ["less", ""], ["logi", ""], ["ical", ""], ["ance", ""], ["ence", ""], ["ness", ""], ["ble", ""], ["ment", ""], ["eli", ""], ["bli", ""], ["ful", ""], ["ant", ""], ["ent", ""], ["ism", ""], ["ate", ""], ["iti", ""], ["ous", ""], ["ive", ""], ["ize", ""], ["ing", ""], ["ion", ""], ["ies", "y"], ["al", ""], ["ou", ""], ["er", ""], ["ed", ""], ["ic", ""], ["ly", ""], ["li", ""], ["s", ""]]);

/*
    he’s (= he is / he has)
    she’s (= she is / she has)
    I’ll (= I will)
    I’ve (= I have)
    I’d (= I would / I had)
    don’t (= do not)
    doesn’t (= does not)
    didn’t (= did not)
    isn’t (= is not)
    hasn’t (= has not)
    can’t (= cannot)
    won’t (= will not)
*/

/**
 * @type EncoderOptions
 */
const options = {
  prepare: function (str) {
    return str.replace(/´`’ʼ/g, "'").replace(/&/g, " and ").replace(/\$/g, " USD ").replace(/£/g, " GBP ").replace(/\bi'm\b/g, "i am").replace(/\b(can't|cannot)\b/g, "can not").replace(/\bwon't\b/g, "will not").replace(/([a-z])'s\b/g, "$1 is has").replace(/([a-z])n't\b/g, "$1 not").replace(/([a-z])'ll\b/g, "$1 will").replace(/([a-z])'re\b/g, "$1 are").replace(/([a-z])'ve\b/g, "$1 have").replace(/([a-z])'d\b/g, "$1 would had");
  },
  filter: filter,
  stemmer: stemmer
};
export default options;