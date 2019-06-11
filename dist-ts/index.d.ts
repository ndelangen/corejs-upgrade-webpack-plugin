import { NormalModuleReplacementPlugin } from 'webpack';
export declare const rewriteCoreJsRequest: (originalRequest: string) => string;
export interface Options {
    resolveFrom: string | false;
}
export default function CoreJSUpgradeWebpackPlugin(options: Options): NormalModuleReplacementPlugin;
