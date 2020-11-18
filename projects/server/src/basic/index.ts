
import app from './base'
import { 
    initialize,
    requestProxy,
    normalizeData,
    normalizeError,
    vaildateParams,
} from './middewares'
import Router from 'koa-router'
import { Config } from 'http-proxy-middleware';
import baseRouter from './router'

// type IGlobalConfig = {
//     staticPath?: string,
//     ssrModulePath?: string,
//     excludeStaticPaths?: string[],
// }

export type IHttpProxyConfig = Record<string, Config>

type IServerConfigure = {
    routers?: Router[],
    middlewares?: any,
    httpProxy?: IHttpProxyConfig,
}

const defaultHttpProxy: IHttpProxyConfig = {
    // '/api/(.*)': {
    //     changeOrigin: true,
    //     target: 'http://gateway.smoex.com',
    // },
}

export const createServer = (config: IServerConfigure = {}) => {
    const {
        routers = [],
        middlewares = {},
        httpProxy,
    } = config

    app.use(initialize)

    const { 
        configure, 
        staticProxy,
    } = middlewares

    if (configure) {
        app.use(configure)
        // app.use(afterConfigure)
    }
    app.use(normalizeError)

    if (staticProxy) {
        app.use(staticProxy)
    }

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
