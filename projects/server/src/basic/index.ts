
import app from './base'
import fs from 'fs'
import path from 'path'
import { PassThrough } from 'stream'
import kstatic from 'koa-static'
import qs from 'qs'
// TODO: 暂时先用这个 middleware, 路由匹配规则之后根据业务需求自己实现 
//（主要考虑和 koa-router 规则保持一致与目前正则方案的优劣）
import { staticProxy, requestProxy } from './proxy'
import Router, { ParamName } from 'koa-router'
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
    } catch(error) {
        const { code = -1, message = 'unknow error', ...context } = error
        ctx.body = { code, data: { message } }
        if (Object.keys(context).length) {
            ctx.body.context = context
        }
    }
}

export function xType(value: any): string {
    return Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase()
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

function udpateParams(params: any, name: string, value: any) {
    const [curname, subname] = name.split('.')
    if (subname) {
        params[curname] = { ...params[curname], [subname]: value }
    } else {
        params[curname] = value
    }
}

const simpleParser = {
    // @ts-ignore
    number: (value: string) => [!isNaN(value), Number(value)],
    boolean: (value: string) => [value === 'true' || value === 'false', value === 'true' ? true : false],
    array: (value?: string[]) => [Array.isArray(value), value],
    string: (value?: string) => [true, value],
}

const vaildateParams = async (ctx: Context, next: Next) => {
    ctx.vailate = (checks: any) => {
        const errors = [] as any
        const params = {} as any
        for (const check of checks) {
            const { name: names, type: types, rules=[] } = check
            const [paramName, fromName] = names.split('|')
            const name = fromName || paramName
            const value = ctx.query[name] || ctx.request.body[name]
            const [type, subtype] = types.split('|')

            if (!subtype && Object.keys(simpleParser).includes(type)) {
                // @ts-ignore
                const [isPass, parsedValue] = simpleParser[type](value)
                if (isPass) {
                    udpateParams(params, paramName, parsedValue)
                } else {
                    errors.push({ value, message: `${name} filed is not ${types}` }) 
                }
            } else if (type === 'array') {
                let error = null as any
                if (!Array.isArray(value)) {
                    errors.push({ value, message: `${name} filed is not ${types}` }) 
                } else {
                    const resvalue = [] as any[]
                    for (const arrvalue of value) {
                        // @ts-ignore
                        const [isPass, parsedValue] = simpleParser[subtype](arrvalue)
                        if (!isPass) {
                            error = { value, message: `${name} filed is not ${types}` }
                            break
                        } else {
                            resvalue.push(parsedValue)
                        }
                    }
                    if (error) {
                        errors.push(error)
                    } else {
                        udpateParams(params, paramName, resvalue)
                    }
                }
            }
        }
        if (Object.keys(errors).length) {
            ctx.throw({ code: 10, message: 'vailate failed', errors })
        }
        return params
    }
    await next()
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
    app.use(vaildateParams)

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
