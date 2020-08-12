import Router from 'koa-router'

const router = new Router()

router.prefix('/api/account')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/infox', function (ctx, next) {
  // throw { code: 1, message: 'xxx' }
  ctx.body = { x: 'this is a users/bar response' }
})

export default router
