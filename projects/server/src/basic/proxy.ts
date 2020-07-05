import { Context, Next } from 'koa';

const httpProxy = require('http-proxy-middleware');
const k2c = require('koa2-connect');
const pathToRegexp = require('path-to-regexp');
const send = require('koa-send')

export function requestProxy(proxies: any = {}) {
    return async function (ctx: any, next: any) {
        const { path } = ctx;
        for (const route of Object.keys(proxies)) {
            if (pathToRegexp(route).test(path)) {
                await k2c(httpProxy(proxies[route]))(ctx, next);
                return
            }
        }
        await next();
    }
}

export function staticProxy(opts: any = {}) {
    return async function(ctx: Context, next: Next) {
        let done = false

        const { staticPath } = ctx.config
        
        if (!staticPath) {
            await next()
            return
        }

        const idx = ctx.path.indexOf('/static')

        const path = ctx.path.slice(idx)
    
        opts.root = staticPath
        if (ctx.method === 'HEAD' || ctx.method === 'GET') {
            try {
                done = await send(ctx, path, opts)
            } catch (err) {
                if (err.status !== 404) {
                    throw err
                }
            }
        }
    
        if (!done) {
            await next()
        }
    }
}