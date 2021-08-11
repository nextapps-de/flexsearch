declare module "flexsearch" {
  export interface Index<T> {
    readonly id: string;
    readonly index: string;
    readonly length: number;

    init(options?: CreateOptions): this;
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
    add(o: T): this;
    add(id: number, o: string): this;

    // Result without pagination -> T[]
    search(
      query: string,
      options: number | SearchOptions,
      callback: (results: T[]) => void
    ): void;
    search(query: string, options?: number | SearchOptions): Promise<T[]>;
    search(
      options: SearchOptions & { query: string },
      callback: (results: T[]) => void
    ): void;
    search(options: SearchOptions & { query: string }): Promise<T[]>;

    // Result with pagination -> SearchResults<T>
    search(
      query: string,
      options: number | (SearchOptions & { page?: boolean | Cursor }),
      callback: (results: SearchResults<T>) => void
    ): void;
    search(
      query: string,
      options?: number | (SearchOptions & { page?: boolean | Cursor })
    ): Promise<SearchResults<T>>;
    search(
      options: SearchOptions & { query: string; page?: boolean | Cursor },
      callback: (results: SearchResults<T>) => void
    ): void;
    search(
      options: SearchOptions & { query: string; page?: boolean | Cursor }
    ): Promise<SearchResults<T>>;

    update(id: number, o: T): this;
    remove(id: number): this;
    clear(): this;
    destroy(): this;
    addMatcher(matcher: Matcher): this;

    where(whereObj: { [key: string]: string } | ((o: T) => boolean)): T[];
    encode(str: string): string;
    export(
      callback: (key: string, data: any) => any,
      self?: this,
      field?: string,
      index_doc?: Number,
      index?: Number
    ): Promise<boolean>;
    import(exported: string): this;
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

  interface Document {
    id: string;
    field: any;
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
    doc?: Document;
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

  export default class FlexSearch {
    static create<T>(options?: CreateOptions): Index<T>;
    static registerMatcher(matcher: Matcher): typeof FlexSearch;
    static registerEncoder(name: string, encoder: EncoderFn): typeof FlexSearch;
    static registerLanguage(
      lang: string,
      options: { stemmer?: Stemmer; filter?: string[] }
    ): typeof FlexSearch;
    static encode(name: string, str: string): string;
  }
}

// FlexSearch.create(<options>)
// FlexSearch.registerMatcher({KEY: VALUE})
// FlexSearch.registerEncoder(name, encoder)
// FlexSearch.registerLanguage(lang, {stemmer:{}, filter:[]})
// FlexSearch.encode(name, string)
