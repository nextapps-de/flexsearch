/**
 * @interface
 */

export function IndexInterface(){

    this.cache = null;
}

/**
 * @param {!number|string} id
 * @param {!string} content
 */

IndexInterface.prototype.add;

/**
 * @param {!number|string} id
 * @param {!string} content
 */

IndexInterface.prototype.append;

/**
 * @param {!string|Object} query
 * @param {number|Object=} limit
 * @param {Object=} options
 * @returns {Array<number|string>}
 */

IndexInterface.prototype.search;

/**
 * @param {!number|string} id
 * @param {!string} content
 */

IndexInterface.prototype.update;

/**
 * @param {!number|string} id
 */

IndexInterface.prototype.remove;

/**
 * @interface
 */

export function DocumentInterface(){

    this.field = null;
    this.index = null;
}
