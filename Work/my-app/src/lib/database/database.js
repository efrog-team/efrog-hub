import mysql from 'mysql2/promise'

export let send = async (sql) => {


    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "my-project",
        password: "root",
    })

    const [rows, fields] = await connection.execute(sql)
    return rows
}
