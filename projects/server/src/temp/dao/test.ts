import mysql, { PoolConnection } from 'mysql'
import { connect } from 'http2'


const devHost = 'rm-uf6ptrnm757lc165vao.mysql.rds.aliyuncs.com'
const prodHost = 'rm-uf6ptrnm757lc165v125010.mysql.rds.aliyuncs.com'

const pool = mysql.createPool({
    connectionLimit: 20, //连接池连接数
    host: (process.env.OSS_ENV === 'development' || process.env.NODE_ENV !== 'production') ? devHost : prodHost, //数据库地址，这里用的是本地
    database: 'smoex_learn_jp_search', //数据库名称
    user: 'smoex_root',  // username
    password: 'smoexxxxx', // password
    connectTimeout: 500,
})

const proxy = (pool: PoolConnection) => new Proxy(pool, {
    get(target, prop) {

    }
})

export type PoolConnectionProxy = {
    query: (sql: string, values?: any) => Promise<any> 
}

//返回一个Promise链接
export const getConnection = () => new Promise<PoolConnectionProxy>((resolve, reject) => {
    pool.getConnection((err, conn) => {
        conn.beginTransaction
        if(err) { reject(err) }
        const proxy = createConnectionProxy(conn)
        resolve(proxy)
    })
})

function createConnectionProxy(conn: PoolConnection) {
    return {
        query: (sql: string, values?: any) => new Promise((resolve, reject) => {
            conn.query(sql, values, (err, rows) => {
                if(err) { reject(err) }
                resolve(rows)
            })
        }),
    }
}

// export const query = async (sql: string) => new Promise((resolve, reject) => {
//     getConnection().then(conn => {
//       conn.query(sql, (error, results) => {
//         conn.release()
//         if (error) reject(error)
//         else resolve(results)
//       })
//     }).catch(reject)
// })

// export const mysqlx = {
//     query
// }
  