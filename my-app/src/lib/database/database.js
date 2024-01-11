import mysql from 'mysql2';

// Пул з'єднань до бази даних 
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: "root",
    database: "db",
    password: "root",
    port: process.env.DB_PORT || 5917,
});

// Функція на редагування бази даних
export async function send(sql) {
    try {
        const promisePool = pool.promise();
        const [rows, fields] = await promisePool.execute(sql);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function send_ecran(sql, data){
    try {
        const promisePool = pool.promise();
        const [rows, fields] = await promisePool.execute(sql, data);
        return rows;
    } catch (error) {
        throw error;
    }
}