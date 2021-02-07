import { fcServices } from '@smoex-nodejs/server'
import Router from 'koa-router'

const router = new Router({ prefix: '/bff/user' })
// const searchService = createFCClient(envConfig.aliyun.server?.['search']!)

// const router = createRouter('/bff/user')

router.get('/', async function (ctx, next) {
  ctx.body = await fcServices.search.get('/search/kanji?keyword=[3]')
  // ctx.body = 'this is a users response!'
})

router.get('/infox', async function (ctx, next) {
  try {
    // const result = await userService.getData()
    ctx.body = { x: 'this is a users/bar response' }
  } catch(e) {
    ctx.throw(e)
  }
})

export default router
