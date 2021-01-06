'use strict';

var _ = require('lodash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ___default = /*#__PURE__*/_interopDefaultLegacy(_);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const path = require('path');
const fs = require('fs');
const __ = path.sep;
const regDir = new RegExp(`(${__}(?:[^${__}]+${__}?)+)(?=${__}[^${__}]+)`, 'g'); // get the root path
function getFilePrefix(filename) {
    let matchRes = filename.match(/.*(?=\.[^\.]+)/);
    if (matchRes && matchRes.length) {
        return matchRes[0];
    }
    return '';
}
function initFilePath(baseDir, deepModule, LayerModule, prefix, opts) {
    /* prefix: the base string of directory  */
    let dir = fs.readdirSync(baseDir);
    let pro = [];
    dir.forEach((item) => __awaiter(this, void 0, void 0, function* () {
        let targetPath = path.resolve(baseDir, item);
        let stat = fs.statSync(targetPath);
        let pro = [], filenamePrefix = getFilePrefix(item);
        let layerPrefix = prefix;
        if (stat.isDirectory()) {
            deepModule[item] = {};
            if (layerPrefix.length) {
                layerPrefix += `${__}${item}`;
            }
            else {
                layerPrefix += item;
            }
            if (opts === null || opts === void 0 ? void 0 : opts.recurse) {
                initFilePath(targetPath, deepModule[item], LayerModule, layerPrefix);
            }
        }
        else {
            // filter the default file
            if (filenamePrefix !== 'index') {
                layerPrefix += `${__}${filenamePrefix}`;
                pro.push(new Promise((resolve, reject) => {
                    try {
                        let module = require(targetPath);
                        deepModule[filenamePrefix] = module;
                        LayerModule[layerPrefix] = module;
                        resolve(true);
                    }
                    catch (err) {
                        reject(err);
                    }
                }));
            }
        }
    }));
    return Promise.all(pro);
}
function makeModule(rootDir, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let esModule = { deepModule: {}, layerModule: {} };
        yield initFilePath(rootDir, esModule.deepModule, esModule.layerModule, rootDir, opts);
        return esModule;
    });
}
function requireDirectoryAsync(module, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let directory = module.filename.match(regDir);
        let resultModule, emptyModule = {
            deepModule: {},
            layerModule: {}
        };
        let defaultOpts = {
            recurse: true
        };
        opts = ___default['default'].merge(defaultOpts, opts);
        if (directory && directory[0]) {
            resultModule = yield makeModule(directory[0], opts);
        }
        else {
            resultModule = emptyModule;
        }
        if (opts) {
            if (opts.addPath && opts.addPath.length) {
                yield opts.addPath.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    let addModule;
                    if (directory && directory[0]) {
                        addModule = yield makeModule(path.resolve(directory[0], item), opts);
                    }
                    else {
                        addModule = emptyModule;
                    }
                    resultModule = ___default['default'].merge(resultModule, addModule);
                }));
            }
            if (opts.filter && typeof opts.filter === 'function') {
                return opts.filter(resultModule);
            }
        }
        return resultModule;
    });
}

module.exports = requireDirectoryAsync;
