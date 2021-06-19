// get the client
const mysql = require('mysql2/promise');

// create the connection to database
export const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_DB,
  multipleStatements: true
});