import mysql from 'mysql2';

// Пул з'єднань до бази даних 
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "my-project",
    password: "root",
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