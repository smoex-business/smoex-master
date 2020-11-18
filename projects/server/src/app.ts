import { staticProxy, requestProxy, createServer, IHttpProxyConfig } from '@smoex-master/base'
import userRouter  from './routes/users'
import testRouter  from './routes'

const devRemotePaths = {
    web: '../web/build',
    mobile: '../mobile/build',
    admin: '../admin/build',
}

const prodRemotePaths = {
    web: '/master-web',
    mobile: '/master-mobile',
    admin: '/master-admin',
}

const devHostPaths = {
    basic: 'http://localhost:9001'
}

const prodHostPaths = {
    basic: '', 
}

const isProd = process.env.NODE_ENV === 'production' 
const paths = isProd ? prodRemotePaths : devRemotePaths
const hosts = isProd ? devHostPaths : prodHostPaths

const remotePaths = [
    { route: '/', path: paths.web },
    { route: '/', path: paths.mobile, device: 'mobile' },
    { route: '/admin', path: paths.admin },
]

const httpProxy: IHttpProxyConfig = {
    '^/api/admin/word': {
        pathRewrite: {
            '^/api/admin': '/admin',
        },
        target: hosts.basic,
        changeOrigin: true,
    }
}


const routers = [userRouter, testRouter]

const proxies = {
    static: staticProxy(remotePaths),
    request: requestProxy(httpProxy),
}

export default createServer({ routers, proxies })

