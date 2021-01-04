/// <reference types="node" />
declare type ExportModuleType = {
    [key: string]: any;
    [key: number]: any;
};
export declare type DirectoryDeepModule = {
    [key: string]: ExportModuleType | DirectoryDeepModule;
};
export declare type LayerModule = {
    [key: string]: ExportModuleType;
};
export declare type DirectoryModule = {
    deepModule: DirectoryDeepModule;
    LayerModule: LayerModule;
};
declare const _default: (module: NodeModule) => Promise<DirectoryDeepModule>;
export default _default;
export declare function requireParseDirectory(module: NodeModule, dir: any): Promise<DirectoryModule>;
