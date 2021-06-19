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
  /*host: '127.0.0.1',
  user: 'root',
  database: 'app',
  password: 'mypassword',
  multipleStatements: true*/
/*export const connection = mysql.createConnection({
  host: 'ec2-18-215-111-67.compute-1.amazonaws.com',
  user: 'admin',
  password: 'Iloveorcs12!',
  port: 5432,
  database: 'd29kbdj2f832d8',
  multipleStatements: true
});*/