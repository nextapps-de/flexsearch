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

const fs = require('fs');
const path = require('path');

const folderName = './';

mkDirsSync(folderName + '/dist/module/worker');
fs.copyFile(folderName + '/src/worker/ark.js', folderName + '/dist/module/worker/ark.js', function (err) {

});
fs.copyFile(folderName + '/src/worker/index.js', folderName + '/dist/module/worker/index.js', function (err) {

});

function mkDirsSync(dir) {
    if (fs.existsSync(dir)) {
        return true;
    } else if (mkDirsSync(path.dirname(dir))) {
        fs.mkdirSync(dir);
        return true;
    } else {
        return false;
    }
}
