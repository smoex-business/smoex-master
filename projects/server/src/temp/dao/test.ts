import mysql, { PoolConnection } from 'mysql'


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
//返回一个Promise链接
export const getConnection = () => new Promise<PoolConnection>((resolve, reject) => {
    pool.getConnection((err, connection) => {
        if(err) {
            // console.error('链接错误：' + err.stack + '\n' + '链接ID：' + connection.threadId)
            reject(err)
        } else {
            resolve(connection)
        }
    })
})
