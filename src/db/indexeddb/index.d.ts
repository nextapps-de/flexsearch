declare module "flexsearch/db/indexeddb" {

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
        db?: IDBDatabase;
    };

    export default class StorageInterface {
        constructor(name: string, config: PersistentOptions);
        constructor(config: string | PersistentOptions);
        //mount(index: Index | Document) : Promise<void>;
        open() : Promise<void>;
        close() : Promise<void>;
        destroy() : Promise<void>;
        clear() : Promise<void>;
        db: IDBDatabase;
    }
}
