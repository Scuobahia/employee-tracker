// Connect to database
const mysql = require('mysql2');
const db = mysql.createConnection(
    {
    host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Lemon1618@',
      database: 'tech_employees'
    },
    console.log('Connected to the tech_employees database.')
  );
  db.connect(function(err)
  {
    if (err)throw err;

  });
  
  module.exports = db;