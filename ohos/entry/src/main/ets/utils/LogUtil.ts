/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const DEBUG = true;

export function logDebug(msg, arg) {

  if (DEBUG) {
    if (typeof arg === 'string') {
      console.log('my log::' + msg + arg);
    } else if (typeof arg === 'number' || typeof arg == 'boolean' || typeof arg == 'function') {
      console.log('my log::' + msg + arg.toString());
    } else if (typeof arg === 'undefined') {
      console.log('my log::' + msg + ' undefined');
    } else if (typeof arg === 'object') {
      console.log('my log::' + msg + JSON.stringify(arg));
    } else {
      console.log('my log::' + msg + arg);
    }
  }
}
