import { listenServer } from '@node-kits/koa'
import { createSSRServer } from '@smoex-nodejs/server'
import userRouter  from './routes/users'
import testRouter  from './routes'

const routers = [userRouter, testRouter] as any[]
const app = createSSRServer(routers)

listenServer(app)
