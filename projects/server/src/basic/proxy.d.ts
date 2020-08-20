import { Context, Next } from 'koa';
export declare function requestProxy(proxies?: any): (ctx: any, next: any) => Promise<void>;
export declare function staticProxy(opts?: any): (ctx: Context, next: Next) => Promise<void>;
