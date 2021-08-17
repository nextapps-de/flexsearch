export class Index {
  readonly id: string;
  readonly index: string;
  readonly length: number;

  constructor(options?: CreateOptions);
  info(): {
    id: any;
    items: any;
    cache: any;
    matcher: number;
    worker: any;
    threshold: any;
    depth: any;
    resolution: any;
    contextual: boolean;
  };
  add(id: number, o: string): this;

  // Result without pagination -> T[]
  search(query: string, options?: number | SearchOptions): any;
  update(id: number, o: string): this;
  remove(id: number): this;
  clear(): this;
  destroy(): this;
  addMatcher(matcher: Matcher): this;
  encode(str: string): string;
  serialize(): Record<string, any>;
  static deserialize(obj: Record<string, any>, params: Record<string, any>): Index;
}

export class Document<T> {
  constructor(options?: CreateOptions | CreateDocumentOptions);
  add(o: T): this;
  add(id: number, o: T): this;
  update(o: T): this;
  update(id: number, o: T): this;

  search(
    query: string,
    options?: SearchOptions & { query: string }
  ): any // The shape of the resulting object can vary widely,
  // so we will put off typing it for now

  // TODO add async methods
  // TODO add more methods
  serialize(): Record<string, any>;
  static deserialize(obj: Record<string, any>, params: Record<string, any>): Document<any>;
}

interface SearchOptions {
  limit?: number;
  suggest?: boolean;
  where?: { [key: string]: string };
  field?: string | string[];
  bool?: "and" | "or" | "not";
  //TODO: Sorting
}

interface SearchResults<T> {
  page?: Cursor;
  next?: Cursor;
  result: T[];
}

/**
 * These are the options necessary for initializing a Document
 * A document needs to know two things: what is the 'primary key' to index by (id)
 * and what fields should be indexed (index). The `index` parameter can also
 * contain much more complicated information, as described in the FlexSearch
 * README. Therefore, we give it the any time to allow multiple different ways
 * of creating it
 */
interface CreateDocumentOptions {
  id: string;
  index: any;
  store: string[];
}

export type CreateOptions = {
  profile?: IndexProfile;
  tokenize?: DefaultTokenizer | TokenizerFn;
  split?: RegExp;
  encode?: DefaultEncoder | EncoderFn | false;
  cache?: boolean | number;
  async?: boolean;
  worker?: false | number;
  depth?: false | number;
  threshold?: false | number;
  resolution?: number;
  stemmer?: Stemmer | string | false;
  filter?: FilterFn | string | false;
  rtl?: boolean;
  document?: CreateDocumentOptions;
};

//   limit	number	Sets the limit of results.
// suggest	true, false	Enables suggestions in results.
// where	object	Use a where-clause for non-indexed fields.
// field	string, Array<string>	Sets the document fields which should be searched. When no field is set, all fields will be searched. Custom options per field are also supported.
// bool	"and", "or"	Sets the used logical operator when searching through multiple fields.
// page	true, false, cursor	Enables paginated results.

type IndexProfile =
  | "memory"
  | "speed"
  | "match"
  | "score"
  | "balance"
  | "fast";
type DefaultTokenizer = "strict" | "forward" | "reverse" | "full";
type TokenizerFn = (str: string) => string[];
type DefaultEncoder = "icase" | "simple" | "advanced" | "extra" | "balance";
type EncoderFn = (str: string) => string;
type Stemmer = { [key: string]: string };
type Matcher = { [key: string]: string };
type FilterFn = (str: string) => boolean;
type Cursor = string;

// FlexSearch.create(<options>)
// FlexSearch.registerMatcher({KEY: VALUE})
// FlexSearch.registerEncoder(name, encoder)
// FlexSearch.registerLanguage(lang, {stemmer:{}, filter:[]})
// FlexSearch.encode(name, string)
// declare class FlexSearch {
//   static create<T>(options?: CreateOptions): FlexSearch.Index<T>;
//   static registerMatcher(matcher: Matcher): typeof FlexSearch;
//   static registerEncoder(name: string, encoder: EncoderFn): typeof FlexSearch;
//   static registerLanguage(
//     lang: string,
//     options: { stemmer?: Stemmer; filter?: string[] }
//   ): typeof FlexSearch;
//   static encode(name: string, str: string): string;
// }

