import mysql from 'mysql2'

export let send = async (sql) => {


    const pool = mysql.createPool({
        host: "localhost",
        user: "root",
        database: "my-project",
        password: "root",
    })
    const promisePool = pool.promise();
    const [rows, fields] = await promisePool.execute(sql)
    return rows
}
