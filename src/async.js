import { is_function } from './common.js';

export default function (prototype) {
	register(prototype, 'add');
	register(prototype, 'append');
	register(prototype, 'search');
	register(prototype, 'update');
	register(prototype, 'remove');
}

function register(prototype, key) {
	/**
	 * @typedef {import('./type').DocumentInterface} Document
	 * @typedef {import('./type').IndexInterface} Index
	 */

	prototype[key + 'Async'] = function () {
		/** @type {Document | Index} */
		const self = this;
		const args = /*[].slice.call*/ arguments;
		const arg = args[args.length - 1];
		let callback;

		if (is_function(arg)) {
			callback = arg;
			delete args[args.length - 1];
		}

		const promise = new Promise(function (resolve) {
			setTimeout(function () {
				self.async = true;
				const res = self[key].apply(self, args);
				self.async = false;
				resolve(res);
			});
		});

		if (callback) {
			promise.then(callback);
			return this;
		} else {
			return promise;
		}
	};
}
