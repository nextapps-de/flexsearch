if(POLYFILL){

    Object.assign || (Object.assign = function(){

        const args = arguments;
        const size = args.length;
        const obj = args[0];

        for(let x = 1, current, keys, length; x < size; x++){

            current = args[x];
            keys = Object.keys(current);
            length = keys.length;

            for(let i = 0, key; i < length; i++){

                key = keys[i];
                obj[key] = current[key];
            }
        }

        return obj;
    });

    // Object.values || (Object.values = function(obj){
    //
    //     const keys = Object.keys(obj);
    //     const length = keys.length;
    //     const values = new Array(length);
    //
    //     for(let x = 0; x < length; x++){
    //
    //         values[x] = obj[keys[x]];
    //     }
    //
    //     return values;
    // });

    if(SUPPORT_ASYNC){

        window["requestAnimationFrame"] || (window["requestAnimationFrame"] = window.setTimeout);
        window["cancelAnimationFrame"] || (window["cancelAnimationFrame"] = window.clearTimeout);

        window["Promise"] || (window["Promise"] = function(){

            /**
             * @param {Function} fn
             * @constructor
             */

            function Promise(fn){

                this.callback = null;

                const self = this;

                fn(function(val){

                    if(self.callback){

                        self.callback(val);
                        self.callback = null;
                    }
                });
            }

            /**
             * @param {Function} callback
             */

            Promise.prototype.then = function(callback){

                this.callback = callback;
            };

            return Promise;
        }());
    }
}
