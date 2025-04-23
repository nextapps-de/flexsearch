/**
 * http://www.ranks.nl/stopwords
 * http://snowball.tartarus.org/algorithms/french/stop.txt
 * @type {Set<string>}
 */

export const filter = new Set([
    "au",
    "aux",
    "avec",
    "ce",
    "ces",
    "dans",
    "de",
    "des",
    "du",
    "elle",
    "en",
    "et",
    "eux",
    "il",
    "je",
    "la",
    "le",
    "leur",
    "lui",
    "ma",
    "mais",
    "me",
    "meme",
    "mes",
    "moi",
    "mon",
    "ne",
    "nos",
    "notre",
    "nous",
    "on",
    "ou",
    "par",
    "pas",
    "pour",
    "qu",
    "que",
    "qui",
    "sa",
    "se",
    "ses",
    "son",
    "sur",
    "ta",
    "te",
    "tes",
    "toi",
    "ton",
    "tu",
    "un",
    "une",
    "vos",
    "votre",
    "vous",

    "c",
    "d",
    "j",
    "l",
    "m",
    "n",
    "s",
    "t",
    "a",
    "y",

    "ete",
    "etee",
    "etees",
    "etes",
    "etant",
    "suis",
    "es",
    "est",
    "sommes",
    "etes",
    "sont",
    "serai",
    "seras",
    "sera",
    "serons",
    "serez",
    "seront",
    "serais",
    "serait",
    "serions",
    "seriez",
    "seraient",
    "etais",
    "etait",
    "etions",
    "etiez",
    "etaient",
    "fus",
    "fut",
    "fumes",
    "futes",
    "furent",
    "sois",
    "soit",
    "soyons",
    "soyez",
    "soient",
    "fusse",
    "fusses",
    "fut",
    "fussions",
    "fussiez",
    "fussent",

    "ayant",
    "eu",
    "eue",
    "eues",
    "eus",
    "ai",
    "as",
    "avons",
    "avez",
    "ont",
    "aurai",
    "auras",
    "aura",
    "aurons",
    "aurez",
    "auront",
    "aurais",
    "aurait",
    "aurions",
    "auriez",
    "auraient",
    "avais",
    "avait",
    "avions",
    "aviez",
    "avaient",
    "eut",
    "eumes",
    "eutes",
    "eurent",
    "aie",
    "aies",
    "ait",
    "ayons",
    "ayez",
    "aient",
    "eusse",
    "eusses",
    "eut",
    "eussions",
    "eussiez",
    "eussent",

    "ceci",
    "cela",
    "cela",
    "cet",
    "cette",
    "ici",
    "ils",
    "les",
    "leurs",
    "quel",
    "quels",
    "quelle",
    "quelles",
    "sans",
    "soi"
]);

/**
 * @type {Map<string, string>}
 */

export const stemmer = new Map([
    ["lement", ""],
    ["ient", ""],
    ["nera", ""],
    ["ment", ""],
    ["ais", ""],
    ["ait", ""],
    ["ant", ""],
    ["ent", ""],
    ["iez", ""],
    ["ion", ""],
    ["nez", ""],
    ["ai", ""],
    ["es", ""],
    ["er", ""],
    ["ez", ""],
    ["le", ""],
    ["na", ""],
    ["ne", ""],
    ["a", ""],
    ["e", ""]
]);

/**
 * @type {import('../type.js').EncoderOptions}
 */
const options = {
    prepare: function(str){
        return str
        .replace(/´`’ʼ/g, "'")
        .replace(/_+/g, " ")
        .replace(/&/g, " et ")
        .replace(/€/g, " EUR ")
        .replace(/\bl'([^\b])/g, "la le $1")
        .replace(/\bt'([^\b])/g, "ta te $1")
        .replace(/\bc'([^\b])/g, "ca ce $1")
        .replace(/\bd'([^\b])/g, "da de $1")
        .replace(/\bj'([^\b])/g, "ja je $1")
        .replace(/\bn'([^\b])/g, "na ne $1")
        .replace(/\bm'([^\b])/g, "ma me $1")
        .replace(/\bs'([^\b])/g, "sa se $1")
        .replace(/\bau\b/g, "a le")
        .replace(/\baux\b/g, "a les")
        .replace(/\bdu\b/g, "de le")
        .replace(/\bdes\b/g, "de les")
    },
    filter: filter,
    stemmer: stemmer
};
export default options;
