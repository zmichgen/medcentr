const mySql = require('mysql2');

let pool = mySql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'medicinfo',
    password: 'pass'
}).promise()

module.exports = pool;
