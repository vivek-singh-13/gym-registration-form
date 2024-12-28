const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create and export the database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit the process if connection fails
    } else {
        console.log('Database connected!');
    }
});

module.exports = db;
