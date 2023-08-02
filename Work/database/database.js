import mysql from 'mysql2'

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "my-project",
    password: "root",
})

let sql = "SELECT * FROM user"
export let  get_database = () => {
    pool.execute(sql, function(err, res) {
        if (err) throw err;
        
        console.log(res)
    });   
    return 1;
}

