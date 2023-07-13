interface SearchOptions {
	limit?: number;
	suggest?: boolean;
	where?: { [key: string]: string };
	field?: string | string[];
	bool?: 'and' | 'or' | 'not';
}

interface SearchResults<T> {
	page?: string;
	next?: string;
	result: T[];
}

type DefaultEncoder = 'icase' | 'simple' | 'advanced' | 'extra' | 'balance';
type DefaultTokenizer = 'strict' | 'forward' | 'reverse' | 'full';
type EncoderFunction = (str: string) => string;
type FilterFunction = (str: string) => boolean;
type TokenizerFunction = (str: string) => string[];

export interface CreateOptions {
	async?: boolean;
	boost?: any; // TODO: what?
	cache?: number | boolean;
	charset?: string;
	context?: {
		bidirectional?: boolean;
		depth?: number;
		resolution?: any; // TODO: what?
	};
	depth?: number | false;
	doc?: { id: string; field: any };
	encode?: false | DefaultEncoder | ((input: string | number) => ThisType);
	fastupdate?: any; // TODO: what?
	filter?: string | false | FilterFunction;
	lang?: string; // TODO: define lang
	matcher?: any; // TODO: what?
	minlength?: number;
	optimize?: boolean;
	profile?: 'memory' | 'speed' | 'match' | 'score' | 'balance' | 'fast';
	resolution?: number;
	rtl?: boolean;
	split?: RegExp;
	stemmer?: string | false | { [key: string]: string };
	threshold?: number | false;
	tokenize?: DefaultTokenizer | TokenizerFunction;
	worker?: number | false;
}

export default class FlexSearch {
	constructor(options?: CreateOptions);

	readonly id: string;
	readonly index: string;
	readonly length: number;

	static encode(name: string, str: string): string;
	static registerLanguage(
		lang: string,
		options: {
			stemmer?: { [key: string]: string };
			filter?: string[];
		}
	): typeof FlexSearch;

	add(id: number, content: string): this;
	append(id: number, content: string): this;
	remove(id: number): this;
	search(query: string, limit: number, options: SearchOptions): this;
	update(id: number, content: string): this;
}
