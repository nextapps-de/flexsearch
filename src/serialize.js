import { IndexInterface, DocumentInterface } from "./type.js";
import { create_object, is_string } from "./common.js";

async function lazyExport(callback, self, key, index_doc, index, data){
  // Run the callback on the given data
  const res = callback(key, JSON.stringify(data));
  // If the callback gives a promise, then wait on that
  if (res && res["then"]) { await res; }

  // Recurse to export the next property
  return await self.export(callback, self, key, index_doc, index + 1);
}

/**
 * @this IndexInterface
 */

export async function exportIndex(callback, self, field, index_doc, index){

    let key, data;

    switch(index || (index = 0)){

        case 0:

            key = "reg";

            // fastupdate isn't supported by export

            if(this.fastupdate){

                data = create_object();

                for(let key in this.register){

                    data[key] = 1;
                }
            }
            else{

                data = this.register;
            }

            break;

        case 1:

            key = "cfg";
            data = {
                "doc": 0,
                "opt": this.optimize ? 1 : 0
            };

            break;

        case 2:

            key = "map";
            data = this.map;
            break;

        case 3:

            key = "ctx";
            data = this.ctx;
            break;

        default:

            // If there are no properties remaining to export, then return an empty promise with
            // 'true'
            return true;
    }

    return await lazyExport(callback, self || this, field ? field + "." + key : key, index_doc, index, data);
}

/**
 * @this IndexInterface
 */

export function importIndex(key, data){

    if(!data){

        return;
    }

    if(is_string(data)){

        data = JSON.parse(data);
    }

    switch(key){

        case "cfg":

            this.optimize = !!data["opt"];
            break;

        case "reg":

            // fastupdate isn't supported by import

            this.fastupdate = false;
            this.register = data;
            break;

        case "map":

            this.map = data;
            break;

        case "ctx":

            this.ctx = data;
            break;
    }
}

/**
 * @this DocumentInterface
 */

export async function exportDocument(callback, self, field, index_doc, index){

    index || (index = 0);
    index_doc || (index_doc = 0);

    if(index_doc < this.field.length){

        const field = this.field[index_doc];
        const idx = this.index[field];

        self = this;


      if(!(await idx.export(callback, self, index ? field.replace(":", "-") : "", index_doc, index++))){

        index_doc++;
        index = 1;

        await self.export(callback, self, field, index_doc, index);
      }

      return true;
    }
    else{

        let key, data;

        switch(index){

            case 1:

                key = "tag";
                data = this.tagindex;
                break;

            case 2:

                key = "store";
                data = this.store;
                break;

            // case 3:
            //
            //     key = "reg";
            //     data = this.register;
            //     break;

            default:

                return Promise.resolve(true);
        }

        return await lazyExport(callback, this, key, index_doc, index, data);
    }
}

/**
 * @this DocumentInterface
 */

export function importDocument(key, data){

    if(!data){

        return;
    }

    if(is_string(data)){

        data = JSON.parse(data);
    }

    switch(key){

        case "tag":

            this.tagindex = data;
            break;

        case "reg":

            // fastupdate isn't supported by import

            this.fastupdate = false;
            this.register = data;

            for(let i = 0, index; i < this.field.length; i++){

                index = this.index[this.field[i]];
                index.register = data;
                index.fastupdate = false;
            }

            break;

        case "store":

            this.store = data;
            break;

        default:

            key = key.split(".");
            const field = key[0];
            key = key[1];

            if(field && key){

                this.index[field].import(key, data);
            }
    }
}
