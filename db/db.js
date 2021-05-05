const mySql = require('mysql2');

// создаем подключение к базе данных
let pool = mySql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'medicinfo',
    password: 'pass'
}).promise()

module.exports = pool;
