declare module "flexsearch" {

    // Type definitions for flexsearch 0.8
    // Project: https://github.com/nextapps-de/flexsearch/
    // Definitions by: LOSSES Don <https://github.com/Losses>
    // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

    /************************************/
    /* Utils                            */
    /************************************/
    type Id = number | string;
    type Limit = number;
    type ExportHandler = (key: string, data: string) => void;
    type ExportHandlerAsync = (key: string, data: string) => Promise<void>;
    type AsyncCallback<T> = (result?: T) => Promise<void>;

    /************************************/
    /* Common Options                   */
    /************************************/

    /**
     * **Document:**
     * * Presets: https://github.com/nextapps-de/flexsearch#presets
     */
    type Preset =
        | "memory"
        | "performance"
        | "match"
        | "score"
        | "default";

    /**
     * **Document:**
     * * Tokenizer: https://github.com/nextapps-de/flexsearch#tokenizer-prefix-search
     * * Add custom tokenizer: https://github.com/nextapps-de/flexsearch#add-custom-tokenizer
     */
    type Tokenizer =
        | "strict"
        | "forward"
        | "reverse"
        | "full";

    /**
     * **Document:**
     * * Encoders: https://github.com/nextapps-de/flexsearch#encoders
     */
    type Encoders =
        | "LatinExact"
        | "LatinDefault"
        | "LatinSimple"
        | "LatinBalance"
        | "LatinAdvanced"
        | "LatinExtra"
        | "LatinSoundex"
        | "ArabicDefault"
        | "CjkDefault"
        | "CryllicDefault"
        | ((x: string) => string[]);

    /**
     * **Document:**
     * * Context Options: https://github.com/nextapps-de/flexsearch#context-options
     * * Contextual search: https://github.com/nextapps-de/flexsearch#contextual
     */

    type ContextOptions = {
        resolution: number;
        depth: number;
        bidirectional: boolean;
    };

    /**
     * **Document:**
     * * Search options: https://github.com/nextapps-de/flexsearch#search-options
     */
    type SearchOptions = {
        query?: string;
        limit?: number;
        offset?: number;
        suggest?: boolean;
        resolution?: number;
        context?: boolean;
        resolve?: boolean;
    };

    /**
     * **Document:**
     * * The document descriptor: https://github.com/nextapps-de/flexsearch#the-document-descriptor
     */
    type DocumentDescriptor = {
        id?: string | "id";
        field?: FieldName | FieldName[] | FieldOptions | Array<FieldOptions>;
        index?: FieldName | FieldName[] | FieldOptions | Array<FieldOptions>;
        tag?: FieldName | FieldName[] | TagOptions | Array<TagOptions>;
        store?: FieldName | FieldName[] | StoreOptions | Array<StoreOptions>;
    };

    type WorkerURL = string;
    type WorkerPath = string;
    type WorkerConfigURL = string;
    type WorkerConfigPath = string;
    type SerializedFunctionString = string;
    type FieldName = string;
    type TemplateResultHighlighting = string;

    /**
     * **Document:**
     * * Language Options: https://github.com/nextapps-de/flexsearch#language-options
     * * Language: https://github.com/nextapps-de/flexsearch#languages
     */

    type EncoderOptions = {
        rtl?: boolean;
        dedupe?: boolean;
        include?: EncoderSplitOptions;
        exclude?: EncoderSplitOptions;
        split?: string|RegExp|""|false;
        numeric?: boolean;
        prepare?: (str: string) => string;
        finalize?: (terms: string[]) => string[];
        filter?: Set<string>;
        matcher?: Map<string, string>;
        mapper?: Map<string, string>;
        stemmer?: Map<string, string>;
        replacer?: [string|RegExp, string|""];
        minlength?: number;
        maxlength?: number;
        cache?: boolean|number;
    };

    type EncoderSplitOptions = {
        letter?: boolean;
        number?: boolean;
        symbol?: boolean;
        punctuation?: boolean;
        control?: boolean;
        char?: string|string[];
    };

    export type Charset = {
        LatinExact: EncoderOptions;
        LatinDefault: EncoderOptions;
        LatinSimple: EncoderOptions;
        LatinBalance: EncoderOptions;
        LatinAdvanced: EncoderOptions;
        LatinExtra: EncoderOptions;
        LatinSoundex: EncoderOptions;
        ArabicDefault: EncoderOptions;
        CjkDefault: EncoderOptions;
        CyrillicDefault: EncoderOptions;
    };

    /**
     * These options will determine how the contents will be indexed.
     *
     * **Document:**
     * * Index options: https://github.com/nextapps-de/flexsearch#index-options
     * * Tokenizer: https://github.com/nextapps-de/flexsearch#tokenizer
     * * Encoder: https://github.com/nextapps-de/flexsearch#encoder
     * * Context: https://github.com/nextapps-de/flexsearch#context
     * * Resolver: https://github.com/nextapps-de/flexsearch#resolver
     * * Keystore: https://github.com/nextapps-de/flexsearch#keystore
     * * Persistent: https://github.com/nextapps-de/flexsearch#persistent
     * * Right-To-Left: https://github.com/nextapps-de/flexsearch#rtl
     * * Language: https://github.com/nextapps-de/flexsearch#languages
     */
    type IndexOptions = {
        preset?: Preset;
        tokenize?: Tokenizer;
        cache?: boolean | number;
        resolution?: number;
        context?: ContextOptions | boolean;
        keystore?: number;
        fastupdate?: boolean;
        score?: (
            content: string[],
            term: string,
            term_index: number,
            partial: string,
            partial_index: number
        ) => number;

        // Persistent-specific options
        db?: StorageInterface;
        commit?: boolean;

        // Language-specific Options and Encoding
        encoder?: Charset | Encoders | EncoderOptions;
        encode?: ((x: string) => string[]),
        rtl?: boolean;
    };

    type WorkerIndexOptions = IndexOptions & {
        config?: WorkerConfigURL | WorkerConfigPath,
        db: null,
        commit: null
    };

    /************************************/
    /* Index Search                     */
    /************************************/

    type DefaultSearchResults = Id[];
    type IntermediateSearchResults = Array<Id[]>;
    type EnrichedSearchResults = Array<{
        id: Id;
        score: number;
    }>;
    type SearchResults =
        DefaultSearchResults |
        EnrichedSearchResults |
        Resolver |
        Promise<SearchResults>;

    /**
     * **Document:**
     * * Basic usage and variants: https://github.com/nextapps-de/flexsearch#basic-usage-and-variants
     * * API overview: https://github.com/nextapps-de/flexsearch#api-overview
     * * Usage: https://github.com/nextapps-de/flexsearch#usage
     */

    export class Index {
        constructor(options?: Preset | IndexOptions);
        add(id: Id, content: string): this | Promise<this>;
        /**
         * @deprecated The method "append" will be removed in an upcoming release, just use "add" instead
         */
        append(id: Id, content: string): this | Promise<this>;
        update(id: Id, content: string): this | Promise<this>;
        remove(id: Id): this | Promise<this>;
        search(query: string, options?: Limit | SearchOptions): SearchResults;
        search(query: string, limit: number, options: SearchOptions): SearchResults;
        search(options: SearchOptions): SearchResults;
        searchCache(query: string, options?: Limit | SearchOptions): SearchResults;
        searchCache(query: string, limit: number, options: SearchOptions): SearchResults;
        searchCache(options: SearchOptions): SearchResults;
        // https://github.com/nextapps-de/flexsearch#check-existence-of-already-indexed-ids
        contain(id: Id): boolean | Promise<boolean>;
        clear(): void | Promise<void>;
        cleanup(): void | Promise<void>;

        // Export and Import
        export(handler: ExportHandler): void;
        export(handler: ExportHandlerAsync): Promise<void>;
        import(key: string, data: string): void;
        serialize(with_function_wrapper?: boolean): SerializedFunctionString;

        // Persistent Index
        mount(db: StorageInterface): Promise<void>;
        commit(replace_all_contents?: boolean): Promise<void>;
        destroy(): Promise<void>;

        // Async Methods
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        addAsync(
            id: Id,
            content: string,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        appendAsync(
            id: Id,
            content: string,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        updateAsync(
            id: Id,
            content: string,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        removeAsync(
            id: Id,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        searchAsync(
            query: string,
            options?: Limit | SearchOptions,
            callback?: AsyncCallback<SearchResults>
        ): Promise<SearchResults>
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        searchAsync(
            query: string,
            limit: Limit,
            options?: SearchOptions,
            callback?: AsyncCallback<SearchResults>
        ): Promise<SearchResults>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        searchAsync(
            options: SearchOptions,
            callback?: AsyncCallback<SearchResults>
        ): Promise<SearchResults>;
    }

    /**
     * **Document:**
     * * Basic usage and variants: https://github.com/nextapps-de/flexsearch#basic-usage-and-variants
     * * API overview: https://github.com/nextapps-de/flexsearch#api-overview
     * * Worker index: https://github.com/nextapps-de/flexsearch#worker-index
     */

    export class Worker extends Index {
        constructor(options?: Preset | WorkerIndexOptions);
    }

    /************************************/
    /* Document Search                  */
    /************************************/

    type FieldOptions = IndexOptions & {
        field: FieldName,
        filter?: (content: string) => boolean;
        custom?: (content: string) => string;
        config?: WorkerConfigURL | WorkerConfigPath;
    };

    type TagOptions = {
        field: FieldName;
        filter?: (content: string) => boolean;
        custom?: (content: string) => string;
        db?: StorageInterface;
    };

    type StoreOptions = {
        field: FieldName;
        filter?: (content: string) => boolean;
        custom?: (content: string) => string;
        db?: StorageInterface;
    };

    /*
     * **Document:**
     * * Document options: https://github.com/nextapps-de/flexsearch#document-options
     */

    type DocumentOptions = IndexOptions & {
        worker?: boolean | WorkerURL | WorkerPath;
        doc?: DocumentDescriptor | DocumentDescriptor[];
        document?: DocumentDescriptor | DocumentDescriptor[];
    };

    type DefaultDocumentSearchResults = Array<{
        field?: FieldName;
        tag?: FieldName;
        result: DefaultSearchResults;
    }>;

    type EnrichedDocumentSearchResults = Array<{
        field?: FieldName;
        tag?: FieldName;
        highlight?: TemplateResultHighlighting;
        result: Array<{
            id: Id;
            doc: Object | null;
        }>;
    }>;

    type MergedDocumentSearchResults = Array<{
        id: Id;
        doc: Object | null;
        field?: FieldName[];
        tag?: FieldName[];
    }>;

    type DocumentSearchResults =
        DefaultDocumentSearchResults |
        EnrichedDocumentSearchResults |
        MergedDocumentSearchResults |
        Promise<DocumentSearchResults>;

    /**
     *  # Document Search Result
     *
     *  To make your result return the full document:
     *  * set `store` to `true` while creating the document;
     *  * set `enrich` to `true` while searching.
     *
     *  If neither of these conditions is met, then the returned result will be a `ISimpleDocumentSearchResult`.
     */

    /**
     * **Document:**
     * * Document search options: https://github.com/nextapps-de/flexsearch#document-search-options
     */

    type DocumentSearchOptions = SearchOptions & {
        tag?: Object | Array<Object>;
        field?: Array<DocumentSearchOptions> | DocumentSearchOptions | string[] | string;
        index?: Array<DocumentSearchOptions> | DocumentSearchOptions | string[] | string;
        pluck?: FieldName | DocumentSearchOptions;
        enrich?: boolean;
        merge?: boolean;
        highlight?: TemplateResultHighlighting;
    };

    type DocumentValue =
        | string
        | number
        | boolean
        | null
        | DocumentValue[]
        | {[key: string]: DocumentValue};

    type DocumentData = {
        [k: string]: DocumentValue;
    };

    /**
     * **Document:**
     * * Basic usage and variants: https://github.com/nextapps-de/flexsearch#basic-usage-and-variants
     * * API overview: https://github.com/nextapps-de/flexsearch#api-overview
     * * Document store: https://github.com/nextapps-de/flexsearch#document-store
     */
    export class Document {
        constructor(options: DocumentOptions);

        add(id: Id, document: DocumentData): this | Promise<this>;
        add(document: DocumentData): this | Promise<this>;
        /** @deprecated The method "append" will be removed in an upcoming release, just use "add" instead */
        append(id: Id, document: DocumentData): this | Promise<this>;
        /** @deprecated The method "append" will be removed in an upcoming release, just use "add" instead */
        append(document: DocumentData): this | Promise<this>;
        update(id: Id, document: DocumentData): this | Promise<this>;
        update(document: DocumentData): this | Promise<this>;
        remove(id: Id): this | Promise<this>;
        remove(document: DocumentData): this | Promise<this>;
        // https://github.com/nextapps-de/flexsearch#field-search
        search(query: string, options?: Limit | DocumentSearchOptions): DocumentSearchResults;
        search(query: string, limit: number, options: DocumentSearchOptions): DocumentSearchResults;
        search(options: DocumentSearchOptions): DocumentSearchResults;
        searchCache(query: string, options?: Limit | DocumentSearchOptions): DocumentSearchResults;
        searchCache(query: string, limit: number, options: DocumentSearchOptions): DocumentSearchResults;
        searchCache(options: DocumentSearchOptions): DocumentSearchResults;
        // https://github.com/nextapps-de/flexsearch#check-existence-of-already-indexed-ids
        contain(id: Id): boolean | Promise<boolean>;
        clear(): void | Promise<void>;
        cleanup(): void | Promise<void>;

        // Export and Import
        export(handler: ExportHandler): void;
        export(handler: ExportHandlerAsync): Promise<void>;
        import(key: string, data: string): void;

        // Persistent Index
        mount(db: StorageInterface): Promise<void>;
        commit(replace_all_contents?: boolean): Promise<void>;
        destroy(): Promise<void>;

        // Async Methods
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        addAsync(
            id: Id,
            document: DocumentData,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        addAsync(
            document: DocumentData,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        appendAsync(
            id: Id,
            document: DocumentData,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        appendAsync(
            document: DocumentData,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        updateAsync(
            id: Id,
            document: DocumentData,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        updateAsync(
            document: DocumentData,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        removeAsync(
            id: Id,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        removeAsync(
            document: DocumentData,
            callback?: AsyncCallback<void>
        ): Promise<this>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        searchAsync(
            query: string,
            options?: Limit | DocumentSearchOptions,
            callback?: AsyncCallback<DocumentSearchResults>
        ): Promise<DocumentSearchResults>
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        searchAsync(
            query: string,
            limit: number,
            options?: DocumentSearchOptions,
            callback?: AsyncCallback<DocumentSearchResults>
        ): Promise<DocumentSearchResults>;
        /** @deprecated The "async" variants are deprecated, instead use the default variant */
        searchAsync(
            options: DocumentSearchOptions,
            callback?: AsyncCallback<DocumentSearchResults>
        ): Promise<DocumentSearchResults>;
    }

    type IdType =
        "text" |
        "char" |
        "varchar" |
        "string" |
        "number" |
        "numeric" |
        "integer" |
        "smallint" |
        "tinyint" |
        "mediumint" |
        "int" |
        "int8" |
        "uint8" |
        "int16" |
        "uint16" |
        "int32" |
        "uint32" |
        "int64" |
        "uint64" |
        "bigint";

    type PersistentOptions = {
        name?: string;
        type?: IdType;
        db?: StorageInterface;
    };

    type DefaultResolve = {
        query?: string;
        limit?: number;
        offset?: number;
        enrich?: boolean;
    };

    type ResolverOptions = DefaultResolve & {
        index?: Index | Document;
        resolve?: boolean;
        suggest?: boolean;
        and?: ResolverOptions | Array<ResolverOptions>;
        or?: ResolverOptions | Array<ResolverOptions>;
        xor?: ResolverOptions | Array<ResolverOptions>;
        not?: ResolverOptions | Array<ResolverOptions>;
    };

    export class Encoder {
        constructor(options?: EncoderOptions);
        assign(options: EncoderOptions): this;
        encode(content: string): string[];
        addMapper(char_match: string, char_replace: string): this;
        addMatcher(match: string, replace: string): this;
        addStemmer(match: string, replace: string): this;
        addFilter(term: string): this;
        addReplacer(match: string | RegExp, replace: string): this;
    }

    export class Resolver {
        constructor(options?: ResolverOptions | IntermediateSearchResults);
        limit(limit: number): this;
        offset(offset: number): this;
        boost(boost: number): this;
        resolve(options?: DefaultResolve): SearchResults;
        result: IntermediateSearchResults
    }

    export class StorageInterface {
        constructor(name: string, config: PersistentOptions);
        constructor(config: string | PersistentOptions);
        mount(index: Index | Document) : Promise<void>;
        open() : Promise<void>;
        close() : Promise<void>;
        destroy() : Promise<void>;
        clear() : Promise<void>;
        db: any;
    }
}
