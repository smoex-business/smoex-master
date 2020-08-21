import Router from 'koa-router'
import { getConnection } from '../temp/dao/test'
import { resolve } from 'path'

const router = new Router()

router.prefix('/api/account')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

const query = (sql: string) => new Promise((resolve, reject) => {
  getConnection().then(conn => {
    conn.query(sql, (error, results) => {
      conn.release()
      if (error) reject(error)
      else resolve(results)
    })
  }).catch(reject)
})

router.get('/infox', async function (ctx, next) {
  // ctx.throw({ code: 1, message: 'xxx', context: [123] })
  try {
    const result = await query("SELECT * FROM test")
    ctx.body = { x: 'this is a users/bar response', result }
  } catch(e) {
    ctx.throw(e)
  }
})

export default router
