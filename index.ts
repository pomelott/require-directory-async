const path = require('path');
const fs = require('fs');
const __ = path.sep;
const regDir = new RegExp(`(${__}(?:[^${__}]+${__}?)+)(?=${__}[^${__}]+)`); // get the root path

type ExportModuleType = {
    [key: string]: any;
    [key: number]: any;
}
export type DirectoryDeepModule = {
    [key: string]: ExportModuleType | DirectoryDeepModule
}
export type LayerModule = {
    [key: string]: ExportModuleType
}

export type DirectoryModule = {
    deepModule: DirectoryDeepModule;
    LayerModule: LayerModule;
}


function getFilePrefix (filename: string): string {
    let matchRes = filename.match(/.*(?=\.[^\.]+)/);
    if (matchRes && matchRes.length) {
        return matchRes[0]
    }
    return '';
}

function initFilePath (baseDir: string, deepModule: DirectoryDeepModule, LayerModule: LayerModule, prefix: string) {
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
            initFilePath(targetPath, deepModule[item], LayerModule, layerPrefix)
        } else {
            // filter the default file
            if (filenamePrefix !== 'index') {
                layerPrefix += `${__}${filenamePrefix}`;
                pro.push(
                    new Promise((resolve, reject) => {
                        import(targetPath).then((module) => {
                            deepModule[filenamePrefix] = module;
                            LayerModule[layerPrefix] = module;
                            resolve(true);
                        }).catch((err) => {
                            reject(err);
                        })
                    })
                )
            }
        }
    })
    return Promise.all(pro)
}
async function makeModule (rootDir: string) {
    let esModule = {deepModule: {}, LayerModule: {}};
    await initFilePath(rootDir, esModule.deepModule, esModule.LayerModule, '')
    return esModule;
}
export default async (module: NodeModule): Promise<DirectoryDeepModule> => {
    let directory = module.filename.match(regDir), output;
    if (directory && directory[0]) {
        output = await makeModule(directory[0]);
        return output.deepModule;
    }
    return {}
}

export async function requireParseDirectory (module: NodeModule, dir: any): Promise<DirectoryModule> {
    let directory = module.filename.match(regDir);
    if (directory && directory[0]) {
        return await makeModule(directory[0]);
    }
    return {
        deepModule: {},
        LayerModule: {}
    }
}