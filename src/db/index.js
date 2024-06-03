const mysql = require('mysql2');


const connect_db=()=>{

  const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: 21823,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    }
  });
   
  connection.getConnection((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL');
  });
  
  return connection
}


module.exports = {connect_db}

  