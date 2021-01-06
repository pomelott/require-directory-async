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
    layerModule: LayerModule;
};
export declare type RequireDirectoryOpts = {
    recurse?: boolean;
    filter?: Function,
    addPath?: Array<string>
}
declare function requireDirectoryAsync(module: NodeModule, opts?: any): Promise<DirectoryModule>;
export default requireDirectoryAsync;
