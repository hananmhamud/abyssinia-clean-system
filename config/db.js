
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error(
            "MySQL Database Connection Failed ❌"
        );

        console.error(
            err.message
        );

        return;
    }

    console.log(
        "MySQL Database Connected Successfully ✅"
    );

    connection.release();
});

module.exports = db;

