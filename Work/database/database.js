//import mysql from 'mysql2'
const mysql  = require('mysql2');


const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "my-project",
    password: "root",
})

let sql = "SELECT * FROM user"
pool.execute(sql, function(err, res) {
    if (err) throw err;
    
    console.log(res)
});
