//import { promise as Promise } from "../polyfill.js";
import {create_object, is_function, is_string} from "../common.js";
import arkWorker from "@ohos.worker";

let pid = 0;

/**
 * @param {Object=} options
 * @constructor
 */

function WorkerIndex(options) {

  if (!(this instanceof WorkerIndex)) {

    return new WorkerIndex(options);
  }

  if (!options) {
    options = {};
  }

  const _self = this;

  this.worker = create(options["worker"]);
  this.resolver = create_object();

  if (!this.worker) {

    return;
  }

  this.worker.onmessage = function (e) {
    let msg = e["data"];
    _self.resolver[msg["id"]](msg["msg"]);
    delete _self.resolver[msg["id"]];
  };

  let msg = {
    "task": "init",
    "options": options
  };

  // postMessage方法接收的参数中不能带有function类型数据，否则报错
  this.worker.postMessage(msg);
}

export default WorkerIndex;

register("add");
register("append");
register("search");
register("update");
register("remove");

function register(key) {

  WorkerIndex.prototype[key] =
  WorkerIndex.prototype[key + "Async"] = function () {

    const self = this;
    const args = [].slice.call(arguments);
    const arg = args[args.length - 1];
    let callback;

    if (is_function(arg)) {
      callback = arg;
      args.splice(args.length - 1, 1);
    }

    const promise = new Promise(function (resolve) {

      setTimeout(function () {
        self.resolver[++pid] = resolve;
        const msg = {
          "task": key,
          "id": pid,
          "args": args
        };
        self.worker.postMessage(msg);
      }, 0);
    });

    if (callback) {

      promise.then(callback);
      return this;
    }
    else {

      return promise;
    }
  };
}

function create(workerPath) {

  return new arkWorker.Worker(is_string(workerPath) ? workerPath : "entry/ets/workers/worker.js");
}