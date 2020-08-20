import Router from 'koa-router'

type IContext = {
  vailate: (checks: any) => void
}
const router = new Router<{}, IContext>()
router.prefix('/api/test')

router.get('/', async (ctx, next) => {
  ctx.body = 'root'
})

const NOT_NULL = (text: string) => text.trim().length > 0
const REQUIRED = (text: string) => text !== undefined

router.get('/string', async (ctx, next) => {
  const user = ctx.vailate([
    { name: 'xxx', type: 'number', rules: []},
    { name: 'user.ids|user[ids]', type: 'array|number', rules: [] },
    { name: 'user.name|name', type: 'string', rules: [] },
  ])

  console.log(user)
  // const paramx = ctx.vailate([
  //   { name: 'xxx', type: 'string', rules: [ ]},
  //   { bane: 'user', type: 'object', rules: [] }
  // ])
  // const params = ctx.vailate({
  //   // 'user.ids|users[ids]': { type: 'array|number', rules: [REQUIRED] },
  //   // 'user.name|name': { type: 'string', rules: [REQUIRED] },
  //   'id': { type: 'number', rules: [NOT_NULL] },
  //   'isXXX': { type: 'boolean', rules: [NOT_NULL] },
  //   'xxxx': { type: 'array', rules: []},
  //   'ids|id[]': { type: 'array|number', rules: [NOT_NULL] },
  // })
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

export default router
