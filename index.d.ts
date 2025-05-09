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
    type AsyncCallback<T> = (result?: T) => void;

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
     * Tokenizer: https://github.com/nextapps-de/flexsearch#tokenizer-prefix-search \
     * Custom Tokenizer: https://github.com/nextapps-de/flexsearch#add-custom-tokenizer
     */
    type Tokenizer =
        | "strict" | "exact" | "default"
        | "forward"
        | "reverse" | "bidirectional"
        | "full";

    /**
     * Encoders: https://github.com/nextapps-de/flexsearch#encoders
     */
    type Encoders =
        | "Exact"
        | "Default"
        | "Normalize"
        /** @deprecated */
        | "LatinExact"
        /** @deprecated */
        | "LatinDefault"
        /** @deprecated */
        | "LatinSimple"
        | "LatinBalance"
        | "LatinAdvanced"
        | "LatinExtra"
        | "LatinSoundex"
        | "CJK"
        | ((content: string) => string[]);

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
    export type SearchOptions<R extends boolean = true> = {
        query?: string;
        limit?: number;
        offset?: number;
        suggest?: boolean;
        resolution?: number;
        context?: boolean;
        cache?: R extends true ? boolean : false;
        resolve?: R;
    };

    type SerializedFunctionString = string;

    /**
     * **Document:**
     * * Language Options: https://github.com/nextapps-de/flexsearch#language-options
     * * Language: https://github.com/nextapps-de/flexsearch#languages
     */

    export type EncoderOptions = {
        rtl?: boolean;
        dedupe?: boolean;
        include?: EncoderSplitOptions;
        exclude?: EncoderSplitOptions;
        split?: string | RegExp | "" | false;
        numeric?: boolean;
        normalize?: boolean | ((str: string) => string);
        prepare?: (str: string) => string;
        finalize?: (terms: string[]) => string[];
        filter?: Set<string> | ((term: string) => boolean);
        matcher?: Map<string, string>;
        mapper?: Map<string, string>;
        stemmer?: Map<string, string>;
        replacer?: [ string | RegExp, string | "" ];
        minlength?: number;
        maxlength?: number;
        cache?: boolean | number;
    }

    export type EncoderSplitOptions = {
        letter?: boolean;
        number?: boolean;
        symbol?: boolean;
        punctuation?: boolean;
        control?: boolean;
        char?: string | string[];
    };

    export const Charset: {
        Exact: EncoderOptions,
        Default: EncoderOptions,
        Normalize: EncoderOptions,
        LatinBalance: EncoderOptions,
        LatinAdvanced: EncoderOptions,
        LatinExtra: EncoderOptions,
        LatinSoundex: EncoderOptions,
        CJK: EncoderOptions,
        /** @deprecated */
        LatinSimple: EncoderOptions,
        /** @deprecated */
        LatinExact: EncoderOptions,
        /** @deprecated */
        LatinDefault: EncoderOptions
    };

    /**
     * These options will determine how the contents will be indexed.
     *
     * **Document:**
     * * Index options: https://github.com/nextapps-de/flexsearch#index-options
     * * Tokenizer: https://github.com/nextapps-de/flexsearch#tokenizer-partial-match
     * * Encoder: https://github.com/nextapps-de/flexsearch#charset-collection
     * * Context: https://github.com/nextapps-de/flexsearch#context-search
     * * Resolver: https://github.com/nextapps-de/flexsearch/doc/resolver.md
     * * Keystore: https://github.com/nextapps-de/flexsearch/doc/keystore.md
     * * Persistent: https://github.com/nextapps-de/flexsearch/doc/persistent.md
     * * Right-To-Left: https://github.com/nextapps-de/flexsearch/doc/encoder.md#right-to-left-support
     * * Language: https://github.com/nextapps-de/flexsearch/doc/encoder.md#built-in-language-packs
     */
    export type IndexOptions<
        S extends StorageInterface | boolean = false,
        R extends boolean = true
    > = {
        preset?: Preset;
        tokenize?: Tokenizer;
        cache?: boolean | number;
        resolution?: number;
        context?: ContextOptions | boolean;
        keystore?: number;
        fastupdate?: boolean;
        priority?: number;
        score?: (
            content: string[],
            term: string,
            term_index: number,
            partial: string,
            partial_index: number,
        ) => number;
        resolve?: R;

        // Persistent-specific options
        db?: S;
        commit?: boolean;

        // Language-specific Options and Encoding
        encoder?: Encoders | EncoderOptions | Encoder;
        encode?: (text: string) => string[],
        rtl?: boolean;
    };

    /************************************/
    /* Index Search                     */
    /************************************/

    export type DefaultSearchResults = Id[];
    export type IntermediateSearchResults = Array<Id[]>;
    export type SearchResults<
        W extends WorkerType = false,
        S extends StorageInterface | boolean = false,
        R extends boolean = true,
        D extends DocumentData = undefined
    > = R extends true
        ? DefaultSearchResults
        : Resolver<D, W, S>

    /**
     * Basic usage and variants: https://github.com/nextapps-de/flexsearch#basic-usage-and-variants \
     * API overview: https://github.com/nextapps-de/flexsearch#api-overview \
     * Usage: https://github.com/nextapps-de/flexsearch#usage
     */

    export type IndexSearchResultsWrapper<
        W extends WorkerType = false,
        S extends StorageInterface | boolean = false,
        R extends boolean = true,
        D extends DocumentData = undefined
    > = W extends false
        ? S extends false
            ? SearchResults<W, S, R, D>
            : Promise<SearchResults<W, S, R, D>>
        : Promise<SearchResults<W, S, R, D>>

    export class Index<
        W extends WorkerType = false,
        S extends StorageInterface | boolean = false,
        r extends boolean = true
    > {
        constructor(options?: Preset | IndexOptions<S, r>);
        db: Promise<S>;

        add(id: Id, content: string): this | Promise<this>;

        /**
         * @deprecated The method "append" will be removed in an upcoming release, just use "add" instead
         */
        append(id: Id, content: string): this | Promise<this>;

        update(id: Id, content: string): this | Promise<this>;

        remove(id: Id): this | Promise<this>;

        search(query: string): IndexSearchResultsWrapper<W, S, r>;
        /** @deprecated Pass "limit" within options */
        search<R extends boolean = r>(query: string, limit: Limit, options?: SearchOptions<R>): IndexSearchResultsWrapper<W, S, R>;
        search<R extends boolean = r>(query: string, options?: SearchOptions<R>): IndexSearchResultsWrapper<W, S, R>;
        search<R extends boolean = r>(options: SearchOptions<R>): IndexSearchResultsWrapper<W, S, R>;

        searchCache<R extends boolean = r>(query: string): IndexSearchResultsWrapper<W, S, R>;
        /** @deprecated Pass "limit" within options */
        searchCache<R extends boolean = r>(query: string, limit: Limit): IndexSearchResultsWrapper<W, S, R>;
        /** @deprecated Pass "limit" within options */
        searchCache<R extends boolean = r>(query: string, limit: Limit, options?: SearchOptions<R>): IndexSearchResultsWrapper<W, S, R>;
        searchCache<R extends boolean = r>(query: string, options?: SearchOptions<R>): IndexSearchResultsWrapper<W, S, R>;
        searchCache<R extends boolean = r>(options: SearchOptions<R>): IndexSearchResultsWrapper<W, S, R>;

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
        addAsync(
            id: Id,
            content: string,
            callback?: AsyncCallback<void>,
        ): Promise<this>;

        /** @deprecated The method "append" will be removed in an upcoming release, just use "add" instead */
        appendAsync(
            id: Id,
            content: string,
            callback?: AsyncCallback<void>,
        ): Promise<this>;

        updateAsync(
            id: Id,
            content: string,
            callback?: AsyncCallback<void>,
        ): Promise<this>;

        removeAsync(
            id: Id,
            callback?: AsyncCallback<void>
        ): Promise<this>;

        searchAsync(
            query: string,
            callback?: AsyncCallback<SearchResults<W, S, r>>
        ): Promise<SearchResults<W, S, r>>;
        searchCacheAsync(
            query: string,
            callback?: AsyncCallback<SearchResults<W, S, r>>
        ): Promise<SearchResults<W, S, r>>;

        /** @deprecated Pass "limit" within options */
        searchAsync(
            query: string,
            limit: Limit,
            callback?: AsyncCallback<SearchResults<W, S, r>>
        ): Promise<SearchResults<W, S, r>>;
        /** @deprecated Pass "limit" within options */
        searchCacheAsync(
            query: string,
            limit: Limit,
            callback?: AsyncCallback<SearchResults<W, S, r>>
        ): Promise<SearchResults<W, S, r>>;

        /** @deprecated Pass "limit" within options */
        searchAsync<R extends boolean = r>(
            query: string,
            limit: Limit,
            options?: SearchOptions<R>,
            callback?: AsyncCallback<SearchResults<W, S, R>>
        ): Promise<SearchResults<W, S, R>>;
        /** @deprecated Pass "limit" within options */
        searchCacheAsync<R extends boolean = r>(
            query: string,
            limit: Limit,
            options?: SearchOptions<R>,
            callback?: AsyncCallback<SearchResults<W, S, R>>
        ): Promise<SearchResults<W, S, R>>;

        searchAsync<R extends boolean = r>(
            query: string,
            options?: SearchOptions<R>,
            callback?: AsyncCallback<SearchResults<W, S, R>>
        ): Promise<SearchResults<W, S, R>>;
        searchCacheAsync<R extends boolean = r>(
            query: string,
            options?: SearchOptions<R>,
            callback?: AsyncCallback<SearchResults<W, S, R>>
        ): Promise<SearchResults<W, S, R>>;

        searchAsync<R extends boolean = r>(
            options: SearchOptions<R>,
            callback?: AsyncCallback<SearchResults<W, S, R>>
        ): Promise<SearchResults<W, S, R>>;
        searchCacheAsync<R extends boolean = r>(
            options: SearchOptions<R>,
            callback?: AsyncCallback<SearchResults<W, S, R>>
        ): Promise<SearchResults<W, S, R>>;
    }

    /************************************/
    /* Worker Index                     */
    /************************************/

    type WorkerURL = string;
    type WorkerPath = string;
    type WorkerConfigURL = string;
    type WorkerConfigPath = string;
    type WorkerType = boolean | WorkerURL | WorkerPath;

    export type WorkerIndexOptions = IndexOptions & IndexWorkerConfig & {
        //config?: WorkerConfigURL | WorkerConfigPath,
        export?: () => Promise<void>;
        import?: () => Promise<void>;
        // no persistent supported
        db?: null;
        commit?: null;
    };

    export interface IndexWorkerConfig {
        config?: WorkerConfigURL | WorkerConfigPath;
    }

    export class Worker extends Index<true> {
        constructor(options?: Preset | WorkerIndexOptions);

        export(): Promise<void>;

        import(): Promise<void>;
    }

    /************************************/
    /* Document Search                  */
    /************************************/

    type CustomFN<D = DocumentData> = (doc: D) => string | boolean;

    /**
     * The template to be applied on matches (e.g. <code>"\<b>$1\</b>"</code>), where <code>\$1</code> is a placeholder for the matched partial
     */
    export type TemplateResultHighlighting = string;
    export type TagName = string;
    export type FieldName<D = DocumentData> = D extends object
        ? {
            [K in keyof D]: K extends string
                ? D[K] extends Array<infer U>
                    ? `${ K }` | `${ K }[]:${ FieldName<U> & string }`
                    : K | `${ K }:${ FieldName<D[K]> & string }`
                : never
        }[keyof D]
        : never;

    export type DefaultFieldOptions<D = DocumentData> =
        IndexOptions & {
            field: FieldName<D>;
            filter?: (doc: D) => boolean;
            db?: StorageInterface;
        };

    export type DefaultCustomFieldOptions<D = DocumentData> =
        IndexOptions & {
            custom: CustomFN<D>;
            field: FieldName;
            filter?: (doc: D) => boolean;
            db?: StorageInterface;
        };

    export type TagOptions<D = DocumentData> =
        | DefaultFieldOptions<D>
        | DefaultCustomFieldOptions<D>;

    export type StoreOptions<D = DocumentData> =
        | DefaultFieldOptions<D>
        | DefaultCustomFieldOptions<D>;

    export type FieldOptions<D extends DocumentData> =
        | (DefaultFieldOptions<D> & IndexWorkerConfig)
        | (DefaultCustomFieldOptions<D> & IndexWorkerConfig)

    /**
     *  # Document Search Result
     *
     *  To make your result return the full document:
     *  * set `store` to `true` while creating the document;
     *  * set `enrich` to `true` while searching.
     *
     *  If neither of these conditions is met, then the returned result will be a `ISimpleDocumentSearchResult`.
     */

    /*
     * **Document:**
     * * Document options: https://github.com/nextapps-de/flexsearch#document-options
     */

    export type DocumentOptions<
        D extends DocumentData = DocumentData,
        W extends WorkerType = false,
        S extends StorageInterface | boolean = false
    > = IndexOptions<S> & DocumentDescriptor<D> & {
        worker?: W;
        doc?: DocumentDescriptor<D>;
        document?: DocumentDescriptor<D>;
    };

    /**
     * **Document:**
     * * The document descriptor: https://github.com/nextapps-de/flexsearch#the-document-descriptor
     */
    export type DocumentDescriptor<D extends DocumentData = DocumentData> = {
        id?: string | "id";
        field?: FieldName<D> | FieldName<D>[] | FieldOptions<D> | Array<FieldOptions<D>>;
        index?: FieldName<D> | FieldName<D>[] | FieldOptions<D> | Array<FieldOptions<D>>;
        tag?: FieldName<D> | FieldName<D>[] | TagOptions<D> | Array<TagOptions<D>>;
        store?: FieldName<D> | FieldName<D>[] | StoreOptions<D> | Array<StoreOptions<D>> | boolean;
    };

    export type DefaultDocumentSearchResults<D extends DocumentData = DocumentData> = Array<{
        field?: FieldName<D>;
        tag?: FieldName<D>;
        result: DefaultSearchResults;
    }>;

    export type EnrichedResults<D extends DocumentData = DocumentData> = Array<{
        id: Id;
        doc: D | null;
        highlight?: string;
    }>;

    export type EnrichedDocumentSearchResults<D extends DocumentData = DocumentData> = Array<{
        field?: FieldName<D>;
        tag?: FieldName<D>;
        result: EnrichedResults<D>;
    }>;

    export type MergedDocumentSearchResults<D extends DocumentData = DocumentData> = Array<{
        id: Id;
        doc?: D | null;
        field?: FieldName<D>[];
        tag?: FieldName<D>[];
        highlight?: {[field: FieldName]: string};
    }>;

    export type PluckOptions<
        D extends DocumentData = DocumentData,
        H extends HighlightOptions | boolean = false,
        R extends boolean = true,
        E extends boolean = false
    > = FieldName<D> | DocumentSearchOptions<D, H, false, R, E>;

    export type DocumentSearchResults<
        D extends DocumentData = DocumentData,
        H extends HighlightOptions | boolean = false,
        P extends PluckOptions<D, H, R, E> | boolean = false,
        R extends boolean = true,
        E extends boolean = false,
        M extends boolean = false
    > = R extends true
        ? P extends false
            ? M extends true
                ? MergedDocumentSearchResults<D>
                : E extends true
                    ? EnrichedDocumentSearchResults<D>
                    : H extends false
                        ? DefaultDocumentSearchResults<D>
                        : EnrichedDocumentSearchResults<D>
            : E extends true
                ? EnrichedResults<D>
                : DefaultSearchResults
        : Resolver;

    /**
     * **Document:**
     * * Document search options: https://github.com/nextapps-de/flexsearch#document-search-options
     */
    export type DocumentSearchOptions<
        D extends DocumentData = DocumentData,
        H extends HighlightOptions | boolean = false,
        P extends PluckOptions<D, H, R, E> | boolean = false,
        R extends boolean = true,
        E extends boolean = false,
        M extends boolean = false,
    > = SearchOptions<R> & {
        tag?: {[field: FieldName]: TagName} | Array<{[field: FieldName]: TagName}>;
        field?: Array<DocumentSearchOptions<D, H, P, R, E, M>> | DocumentSearchOptions<D, H, P, R, E, M> | FieldName<D>[] | FieldName<D>;
        index?: Array<DocumentSearchOptions<D, H, P, R, E, M>> | DocumentSearchOptions<D, H, P, R, E, M> | FieldName<D>[] | FieldName<D>;
        pluck?: P;
        highlight?: H;
        enrich?: E;
        merge?: M;
    };

    export type DocumentValue =
        | string
        | number
        | boolean
        | null
        | DocumentData;

    export type DocumentData = {
        [key: string]: DocumentValue | DocumentValue[];
    };

    export type DocumentSearchResultsWrapper<
        D extends DocumentData = DocumentData,
        W extends WorkerType = false,
        S extends StorageInterface | boolean = false,
        H extends HighlightOptions | boolean = false,
        P extends PluckOptions<D, H, R, E> | boolean = false,
        R extends boolean = true,
        E extends boolean = false,
        M extends boolean = false
    > = W extends false
        ? S extends false
            ? DocumentSearchResults<D, H, P, R, E, M>
            : Promise<DocumentSearchResults<D, H, P, R, E, M>>
        : Promise<DocumentSearchResults<D, H, P, R, E, M>>

    /**
     * Basic usage and variants: https://github.com/nextapps-de/flexsearch#basic-usage-and-variants \
     * API overview: https://github.com/nextapps-de/flexsearch#api-overview \
     * Document store: https://github.com/nextapps-de/flexsearch#document-store
     */
    export class Document<
        D extends DocumentData = DocumentData,
        W extends WorkerType = false,
        S extends StorageInterface | boolean = false
    > {
        constructor(options: DocumentOptions<D, W, S>);

        add(id: Id, document: D): W extends WorkerType
            ? Promise<this>
            : this;
        add(document: D): W extends WorkerType
            ? Promise<this>
            : this;

        /** @deprecated The method "append" will be removed in an upcoming release, just use "add" instead */
        append(id: Id, document: D): W extends WorkerType
            ? Promise<this>
            : this;
        /** @deprecated The method "append" will be removed in an upcoming release, just use "add" instead */
        append(document: D): W extends WorkerType
            ? Promise<this>
            : this;

        update(id: Id, document: D): W extends WorkerType
            ? Promise<this>
            : this;
        update(document: D): W extends WorkerType
            ? Promise<this>
            : this;

        remove(id: Id): W extends WorkerType
            ? Promise<this>
            : this;
        remove(document: D): W extends WorkerType
            ? Promise<this>
            : this;

        // https://github.com/nextapps-de/flexsearch#field-search
        search(query: string): DocumentSearchResultsWrapper<D, W, S>;
        searchCache(query: string): DocumentSearchResultsWrapper<D, W, S>;
        /** @deprecated Pass "limit" within options */
        search(query: string, limit: Limit): DocumentSearchResultsWrapper<D, W, S>;
        /** @deprecated Pass "limit" within options */
        searchCache(query: string, limit: Limit): DocumentSearchResultsWrapper<D, W, S>;

        search<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            options: DocumentSearchOptions<D, H, P, R, E, M>,
        ): DocumentSearchResultsWrapper<D, W, S, H, P, R, E, M>;
        searchCache<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            options: DocumentSearchOptions<D, H, P, R, E, M>,
        ): DocumentSearchResultsWrapper<D, W, S, H, P, R, E, M>;

        /** @deprecated Pass "limit" within options */
        search<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            limit: Limit,
            options: DocumentSearchOptions<D, H, P, R, E, M>,
        ): DocumentSearchResultsWrapper<D, W, S, H, P, R, E, M>;
        /** @deprecated Pass "limit" within options */
        searchCache<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            limit: Limit,
            options: DocumentSearchOptions<D, H, P, R, E, M>,
        ): DocumentSearchResultsWrapper<D, W, S, H, P, R, E, M>;

        search<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            options: DocumentSearchOptions<D, H, P, R, E, M>,
        ): DocumentSearchResultsWrapper<D, W, S, H, P, R, E, M>;
        searchCache<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            options: DocumentSearchOptions<D, H, P, R, E, M>,
        ): DocumentSearchResultsWrapper<D, W, S, H, P, R, E, M>;

        // https://github.com/nextapps-de/flexsearch#check-existence-of-already-indexed-ids
        contain(id: Id): D extends StorageInterface
            ? Promise<boolean>
            : boolean;

        clear(): D extends StorageInterface
            ? Promise<void>
            : W extends WorkerType
                ? Promise<void>
                : void;

        cleanup(): void;

        get(id: Id): D extends StorageInterface
            ? Promise<D>
            : D | null;

        set(id: Id, document: D): this;
        set(document: D): this;

        // Export and Import
        export(handler: ExportHandler): void;
        export(handler: ExportHandlerAsync): Promise<void>;

        import(key: string, data: string): void;

        // Persistent Index
        mount(db: StorageInterface): Promise<void>;

        commit(replace_all_contents?: boolean): Promise<void>;

        destroy(): Promise<void>;

        // Async Methods
        addAsync(
            id: Id,
            document: D,
            callback?: AsyncCallback<void>,
        ): Promise<this>;
        addAsync(
            document: D,
            callback?: AsyncCallback<void>,
        ): Promise<this>;

        /** @deprecated The method "append" will be removed in an upcoming release, just use "add" instead */
        appendAsync(
            id: Id,
            document: D,
            callback?: AsyncCallback<void>,
        ): Promise<this>;
        /** @deprecated The method "append" will be removed in an upcoming release, just use "add" instead */
        appendAsync(
            document: D,
            callback?: AsyncCallback<void>,
        ): Promise<this>;

        updateAsync(
            id: Id,
            document: D,
            callback?: AsyncCallback<void>,
        ): Promise<this>;
        updateAsync(
            document: D,
            callback?: AsyncCallback<void>,
        ): Promise<this>;

        removeAsync(
            id: Id,
            callback?: AsyncCallback<void>,
        ): Promise<this>;
        removeAsync(
            document: D,
            callback?: AsyncCallback<void>,
        ): Promise<this>;

        searchAsync<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            callback?: AsyncCallback<DocumentSearchResults<D, H, P, R, E, M>>,
        ): Promise<DocumentSearchResults<D, H, P, R, E, M>>
        searchCacheAsync<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            callback?: AsyncCallback<DocumentSearchResults<D, H, P, R, E, M>>,
        ): Promise<DocumentSearchResults<D, H, P, R, E, M>>

        /** @deprecated Pass "limit" within options */
        searchAsync<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            limit: Limit,
            callback?: AsyncCallback<DocumentSearchResults<D, H, P, R, E, M>>,
        ): Promise<DocumentSearchResults<D, H, P, R, E, M>>
        /** @deprecated Pass "limit" within options */
        searchCacheAsync<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            limit: Limit,
            callback?: AsyncCallback<DocumentSearchResults<D, H, P, R, E, M>>,
        ): Promise<DocumentSearchResults<D, H, P, R, E, M>>

        /** @deprecated Pass "limit" within options */
        searchAsync<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            limit: Limit,
            options?: DocumentSearchOptions<D, H, P, R, E, M>,
            callback?: AsyncCallback<DocumentSearchResults<D, H, P, R, E, M>>,
        ): Promise<DocumentSearchResults<D, H, P, R, E, M>>;
        /** @deprecated Pass "limit" within options */
        searchCacheAsync<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            limit: Limit,
            options?: DocumentSearchOptions<D, H, P, R, E, M>,
            callback?: AsyncCallback<DocumentSearchResults<D, H, P, R, E, M>>,
        ): Promise<DocumentSearchResults<D, H, P, R, E, M>>;

        searchAsync<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            options?: DocumentSearchOptions<D, H, P, R, E, M>,
            callback?: AsyncCallback<DocumentSearchResults<D, H, P, R, E, M>>,
        ): Promise<DocumentSearchResults<D, H, P, R, E, M>>
        searchCacheAsync<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            query: string,
            options?: DocumentSearchOptions<D, H, P, R, E, M>,
            callback?: AsyncCallback<DocumentSearchResults<D, H, P, R, E, M>>,
        ): Promise<DocumentSearchResults<D, H, P, R, E, M>>

        searchAsync<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            options: DocumentSearchOptions<D, H, P, R, E, M>,
            callback?: AsyncCallback<DocumentSearchResults<D, H, P, R, E, M>>,
        ): Promise<DocumentSearchResults<D, H, P, R, E, M>>;
        searchCacheAsync<
            H extends HighlightOptions | boolean = false,
            P extends PluckOptions<D, H, R, E> | boolean = false,
            R extends boolean = true,
            E extends boolean = false,
            M extends boolean = false
        >(
            options: DocumentSearchOptions<D, H, P, R, E, M>,
            callback?: AsyncCallback<DocumentSearchResults<D, H, P, R, E, M>>,
        ): Promise<DocumentSearchResults<D, H, P, R, E, M>>;
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
        db?: any;
    };

    export type DefaultResolve<
        D extends DocumentData = undefined,
        H extends HighlightOptions | boolean = false,
        R extends boolean = true,
        E extends boolean = false
    > = {
        limit?: number;
        offset?: number;
        resolve?: R;
        /** only usable when "resolve" was not set to false */
        enrich?: D extends DocumentData
            ? R extends true ? E : false
            : false;
        /** only usable when "resolve" was not set to false */
        highlight?: D extends DocumentData
            ? R extends true ? H : false
            : false;
    };

    export type ResolverOptions<
        D extends DocumentData = undefined,
        W extends WorkerType = false,
        S extends StorageInterface | boolean = false,
        H extends HighlightOptions | boolean = false,
        R extends boolean = false,
        E extends boolean = false
    > = DefaultResolve<D, H, R, E> & {
        query?: string;
        index?: Index<W, S> | Document<D, W, S>;
        pluck?: FieldName<D>;
        field?: FieldName<D>;
        tag?: {[field: FieldName]: TagName} | Array<{[field: FieldName]: TagName}>;
        and?: ResolverOptions<D, W, S, H, R, E> | Array<ResolverOptions<D, W, S, H, R, E>>;
        or?:  ResolverOptions<D, W, S, H, R, E> | Array<ResolverOptions<D, W, S, H, R, E>>;
        xor?: ResolverOptions<D, W, S, H, R, E> | Array<ResolverOptions<D, W, S, H, R, E>>;
        not?: ResolverOptions<D, W, S, H, R, E> | Array<ResolverOptions<D, W, S, H, R, E>>;
        boost?: number;
        suggest?: boolean;
    };

    export type HighlightBoundaryOptions = {
        before?: number;
        after?: number;
        total?: number;
    };

    export type HighlightEllipsisOptions = {
        template?: TemplateResultHighlighting;
        pattern?: string | boolean;
    };

    export type HighlightOptions = TemplateResultHighlighting | {
        template?: TemplateResultHighlighting;
        boundary?: HighlightBoundaryOptions | number;
        ellipsis?: HighlightEllipsisOptions | string | boolean;
        clip?: boolean;
        merge?: boolean;
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

    export class Resolver<
        D extends DocumentData = undefined,
        W extends WorkerType = false,
        S extends StorageInterface | boolean = false
    > {
        result: IntermediateSearchResults;

        constructor(options?: ResolverOptions<D, W, S> | IntermediateSearchResults);

        and<R extends boolean = false>(...args: ResolverOptions<D, W, S, unknown, R>[]):
            IndexSearchResultsWrapper<W, S, R, D>;

        or<R extends boolean = false>(...args: ResolverOptions<D, W, S, unknown, R>[]):
            IndexSearchResultsWrapper<W, S, R, D>;

        xor<R extends boolean = false>(...args: ResolverOptions<D, W, S, unknown, R>[]):
            IndexSearchResultsWrapper<W, S, R, D>;

        not<R extends boolean = false>(...args: ResolverOptions<D, W, S, unknown, R>[]):
            IndexSearchResultsWrapper<W, S, R, D>;

        limit(limit: number): Resolver<D, W, S>;

        offset(offset: number): Resolver<D, W, S>;

        boost(boost: number): Resolver<D, W, S>;

        resolve(options?: DefaultResolve<D>): IndexSearchResultsWrapper<W, S, true, D>;
    }

    export class StorageInterface {
        db: any;

        constructor(name: string, config: PersistentOptions);
        constructor(config: string | PersistentOptions);

        mount(index: Index | Document): Promise<void>;

        open(): Promise<void>;

        close(): Promise<void>;

        destroy(): Promise<void>;

        clear(): Promise<void>;
    }

    export class IndexedDB extends StorageInterface {
        /*db: IDBDatabase;*/
    }

    const FlexSearch: {
        Index: typeof Index,
        Document: typeof Document,
        Worker: typeof Worker,
        Encoder: typeof Encoder,
        Charset: typeof Charset,
        Resolver: typeof Resolver,
        IndexedDB: typeof IndexedDB
    };

    export default FlexSearch;
}

// -----------------------------------

declare module "flexsearch/db/*" {
    import { StorageInterface } from "flexsearch";
    export default StorageInterface;
}

// declare module "flexsearch/db/indexeddb" {
//     import { StorageInterface } from "flexsearch";
//     export default class IndexedDB extends StorageInterface{
//         db: IDBDatabase;
//     }
// }

// -----------------------------------

declare module "flexsearch/lang/*" {
    import { EncoderOptions } from "flexsearch";
    const Options: EncoderOptions;
    export default Options;
}

// https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
// https://github.com/futurGH/ts-to-jsdoc
// https://sethmac.com/typescript-to-jsdoc/
