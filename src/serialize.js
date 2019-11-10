import FlexSearch from "./flexsearch.js";
import { is_undefined, is_object, get_keys  } from "./common.js";

if(SUPPORT_SERIALIZE){

    /**
     * TODO: also export settings?
     * @param {Object<string, boolean>=} config
     */

    FlexSearch.prototype.export = function(config){

        const serialize = !config || is_undefined(config["serialize"]) || config["serialize"];

        let payload;

        if(SUPPORT_DOCUMENT && this.doc){

            const export_doc = !config || is_undefined(config["doc"]) || config["doc"];
            const export_index = !config || is_undefined(config["index"]) || config["index"];

            payload = [];

            let i = 0;

            if(export_index){

                const keys = this.doc.keys;

                for(; i < keys.length; i++){

                    const idx = this.doc.index[keys[i]];

                    payload[i] = [

                        idx._map, idx._ctx, get_keys(idx._ids)
                    ];
                }
            }

            if(export_doc){

                payload[i] = this._doc;
            }
        }
        else{

            payload = [

                this._map,
                this._ctx,
                get_keys(this._ids)
            ];
        }

        if(serialize){

            payload = JSON.stringify(payload);
        }

        return payload;
    };

    FlexSearch.prototype.import = function(payload, config){

        const serialize = !config || is_undefined(config["serialize"]) || config["serialize"];

        if(serialize){

            payload = JSON.parse(payload);
        }

        const ids = {};

        if(SUPPORT_DOCUMENT && this.doc){

            const import_doc = !config || is_undefined(config["doc"]) || config["doc"];
            const import_index = !config || is_undefined(config["index"]) || config["index"];

            let i = 0;

            if(import_index){

                const keys = this.doc.keys;
                const length = keys.length;
                const current = payload[0][2];

                for(; i < current.length; i++){

                    ids[current[i]] = 1;
                }

                for(i = 0; i < length; i++){

                    const idx = this.doc.index[keys[i]];
                    const item = payload[i];

                    if(item){

                        idx._map = item[0];
                        idx._ctx = item[1];
                        idx._ids = ids;
                        // idx._doc = payload[length];
                    }
                }
            }

            if(import_doc){

                this._doc = is_object(import_doc) ? import_doc : payload[i];
            }
        }
        else{

            const current = payload[2];

            for(let i = 0; i < current.length; i++){

                ids[current[i]] = 1;
            }

            this._map = payload[0];
            this._ctx = payload[1];
            this._ids = ids;
        }
    };
}