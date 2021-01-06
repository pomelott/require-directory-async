const path = require('path');
const fs = require('fs');
const __ = path.sep;
const regDir = new RegExp(`(${__}(?:[^${__}]+${__}?)+)(?=${__}[^${__}]+)`, 'g'); // get the root path
import _ from 'lodash';
import {DirectoryDeepModule, DirectoryModule, LayerModule, RequireDirectoryOpts} from './global';
function getFilePrefix (filename: string): string {
    let matchRes = filename.match(/.*(?=\.[^\.]+)/);
    if (matchRes && matchRes.length) {
        return matchRes[0]
    }
    return '';
}

function initFilePath (baseDir: string, deepModule: DirectoryDeepModule, LayerModule: LayerModule, prefix: string, opts?: RequireDirectoryOpts) {
    /* prefix: the base string of directory  */
    let dir: string[] = fs.readdirSync(baseDir);
    let pro:Array<Promise<boolean>> = [];
    dir.forEach(async (item: string) => {
        let targetPath: string = path.resolve(baseDir, item);
        let stat = fs.statSync(targetPath)
        let pro = [], filenamePrefix = getFilePrefix(item);
        let layerPrefix = prefix;
        if (stat.isDirectory()) {
            deepModule[item] = {};
            if (layerPrefix.length) {
                layerPrefix += `${__}${item}`;
            } else {
                layerPrefix += item;
            }
            if (opts?.recurse) {
                initFilePath(targetPath, deepModule[item], LayerModule, layerPrefix);
            }
        } else {
            // filter the default file
            if (filenamePrefix !== 'index') {
                layerPrefix += `${__}${filenamePrefix}`;
                pro.push(
                    new Promise((resolve, reject) => {
                        try{
                            let module = require(targetPath);
                            deepModule[filenamePrefix] = module;
                            LayerModule[layerPrefix] = module;
                            resolve(true);
                        } catch(err) {
                            reject(err)
                        }
                    })
                )
            }
        }
    })
    return Promise.all(pro)
}
async function makeModule (rootDir: string, opts?: RequireDirectoryOpts) {
    let esModule = {deepModule: {}, layerModule: {}};
    await initFilePath(rootDir, esModule.deepModule, esModule.layerModule, rootDir, opts)
    return esModule;
}

async function requireDirectoryAsync (module: NodeModule, opts?: RequireDirectoryOpts): Promise<DirectoryModule> {
    let directory = module.filename.match(regDir);
    let resultModule: DirectoryModule, emptyModule = {
        deepModule: {},
        layerModule: {}
    };
    let defaultOpts = {
        recurse: true
    }
    opts = _.merge(defaultOpts, opts);
    if (directory && directory[0]) {
        resultModule = await makeModule(directory[0], opts);
    } else {
        resultModule = emptyModule;
    }
    if (opts) {
        if (opts.addPath && opts.addPath.length) {
            await opts.addPath.forEach(async (item: string) => {
                let addModule: DirectoryModule;
                if (directory && directory[0]) {
                    addModule =  await makeModule(path.resolve(directory[0], item), opts);
                } else {
                    addModule = emptyModule;
                }
                resultModule = _.merge(resultModule, addModule);
            })
        }
        if (opts.filter && typeof opts.filter === 'function') {
            return opts.filter(resultModule);
        }
    }
    return resultModule;
}

export default requireDirectoryAsync;