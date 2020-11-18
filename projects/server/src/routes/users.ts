import { createRouter } from '@smoex-master/base'

const router = createRouter('/api/account')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
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
