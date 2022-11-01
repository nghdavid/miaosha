require('dotenv').config(); // load database parameter
const mysql = require('mysql2/promise'); // using asynchronous version of mysql2

const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// use createPool to reduce the time spent connecting to the MySQL server
// by reusing a previous connection
const db = mysql.createPool(options);

module.exports = db;
