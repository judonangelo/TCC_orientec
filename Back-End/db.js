const mysql = require('mysql2/promise')

const pool = mysql.createPool({

    host:"localhost",
    user:"root", 
    password:"",
    port:3306,
    database:"tcc",
    waitForConnections:true, 
    connectionLimit:10,
    queueLimit:0 
})

module.exports = pool