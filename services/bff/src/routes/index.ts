import Router from 'koa-router'
// import { fcAccount } from '../global'

type IContext = {
  vailate: (checks: any) => void
}
const router = new Router<{}, IContext>()
router.prefix('/api/test')

router.get('/', async (ctx, next) => {
  // const res = await fcAccount.get('/api/test/xxx', {} , ctx.headers)
  // console.log(1212131321, typeof res)
  ctx.body = 'root'
})

const NOT_NULL = (text: string) => text.trim().length > 0
const REQUIRED = (text: string) => text !== undefined

const USER_MAP = [
  { name: 'xxx', type: 'number', rules: []},
  { name: 'user.ids|user[ids]', type: 'array|number', rules: [] },
  { name: 'user.name|name', type: 'string', rules: [] },
]

router.get('/xxx', async (ctx, next) => {
  const user = ctx.vailate(USER_MAP)
  const paramx = ctx.vailate([
    { name: 'xxx', type: 'string', rules: []},
    { bane: 'user', type: 'object', rules: [] }
  ])
  // const params = ctx.vailate({
  //   'user.ids|users[ids]': { type: 'array|number', rules: [REQUIRED] },
  //   'user.name|name': { type: 'string', rules: [REQUIRED] },
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
