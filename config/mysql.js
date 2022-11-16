require('dotenv').config(); // load database parameter
const mysql = require('mysql2/promise'); // using asynchronous version of mysql2

const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const readOptions = {
    host: process.env.READ_DB_HOST,
    user: process.env.READ_DB_USERNAME,
    password: process.env.READ_DB_PASSWORD,
    database: process.env.READ_DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// use createPool to reduce the time spent connecting to the MySQL server
// by reusing a previous connection
const db = mysql.createPool(options);
const readDb = mysql.createPool(readOptions);

module.exports = { db, readDb };
