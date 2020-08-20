/// <reference types="koa" />
import Router from 'koa-router';
import { Config } from 'http-proxy-middleware';
export declare type IHttpProxyConfig = Record<string, Config>;
declare type IServerConfigure = {
    routers?: Router[];
    httpProxy?: IHttpProxyConfig;
    configure?: any;
};
export declare function xType(value: any): string;
export declare const createServer: (config?: IServerConfigure) => import("koa")<import("koa").DefaultState, import("koa").DefaultContext>;
export {};
