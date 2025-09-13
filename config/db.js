const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',   
  password: 'newpassword', 
  database: 'lab_auth'
});

connection.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ MySQL connected');
  }
});

module.exports = connection.promise();