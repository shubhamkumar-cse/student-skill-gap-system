// config/db.js
// Creates one shared MySQL connection pool for the whole backend.
// Using a pool (instead of a single connection) lets many requests
// talk to the database at the same time without blocking each other.

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick helper so other files can do: const [rows] = await db.query(sql, params)
module.exports = pool;
