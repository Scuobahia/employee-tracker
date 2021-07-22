// Connect to database
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
    host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Lemon1618@',
      database: 'election'
    },
    console.log('Connected to the tech_employees database.')
  );
  module.exports = db;