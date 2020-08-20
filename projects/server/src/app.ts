import { createServer } from './basic'
import app from './basic/base'
import users  from './routes/users'
import tests  from './routes'
import { Context, Next } from 'koa'

const devRemotePaths = {
    web: '../web/build',
    mobile: '../mobile/build'
}

const prodRemotePaths = {
    web: '/master-web',
    mobile: '/master-mobile'
}

const configure = async (ctx: Context, next: Next) => {
    const ua = ctx.header['user-agent']
    const isMobile = /AppleWebKit.*Mobile.*/i.test(ua)
    const remotePaths = process.env.NODE_ENV === 'production' ? prodRemotePaths : devRemotePaths
    const staticPath = isMobile ? remotePaths.mobile : remotePaths.web
    ctx.config.staticPath = staticPath
    ctx.config.ssrModulePath = staticPath + '/server'

    await next()
}

const routers = [users, tests]

export default createServer({
    routers,
    configure,
})

