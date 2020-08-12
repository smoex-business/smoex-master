
import app from './base'
import fs from 'fs'
import path from 'path'
import { PassThrough } from 'stream'
import kstatic from 'koa-static'
// TODO: 暂时先用这个 middleware, 路由匹配规则之后根据业务需求自己实现 
//（主要考虑和 koa-router 规则保持一致与目前正则方案的优劣）
import { staticProxy, requestProxy } from './proxy'
import Router from 'koa-router'
import { Config } from 'http-proxy-middleware';
import { Context, Next, Middleware } from 'koa'
import baseRouter from './router'

type IGlobalConfig = {
    staticPath?: string,
    ssrModulePath?: string,
    excludeStaticPaths?: string[],
}

export type IHttpProxyConfig = Record<string, Config>

type IServerConfigure = {
    routers?: Router[],
    httpProxy?: IHttpProxyConfig,
    configure?: any,
}

const defaultHttpProxy: IHttpProxyConfig = {
    '/api/(.*)': {
        changeOrigin: true,
        target: 'http://gateway.smoex.com',
    },
}

const initialize = async (ctx: Context, next: Next) => {
   ctx.config = {}
   await next()
}

const normalizeError = async (ctx: Context, next: Next) => {
    try {
        await next()
    } catch(e) {
        const code = e.code || -1
        const data = {
            message: e.message || 'unknow error',
        }
        ctx.body = { code, data }
    }
}

const normalizeData = async (ctx: Context, next: Next) => {
    await next()
    // TODO: 寻求更好的判断方法 ing
    const isObject = typeof ctx.body === 'object' && !(ctx.body instanceof PassThrough)
    if (isObject && typeof ctx.body.code === 'undefined') {
        const data = JSON.parse(JSON.stringify(ctx.body))
        ctx.body = { code: 0, data }
    }
}


export const createServer = (config: IServerConfigure = {}) => {
    const {
        routers = [],
        configure,
        httpProxy,
    } = config

    app.use(initialize)

    if (configure) {
        app.use(configure)
    }
    app.use(normalizeError)

    app.use(staticProxy())

    app.use(normalizeData)

    routers.forEach(router => {
        app.use(router.routes())
        app.use(router.allowedMethods())
    })

    const proxies = { ...defaultHttpProxy, ...httpProxy }
    app.use(requestProxy(proxies))

    app.use(baseRouter.routes())
    app.use(baseRouter.allowedMethods())

    return app
}
