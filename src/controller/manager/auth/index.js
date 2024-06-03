const {connect_db} = require('../../../db')
const bcrypt = require('bcrypt');

const signup=async(req,res)=>{
    
    const connection=connect_db()
    const { email, restaurantName, ownerName, mobileNo, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
  
    // Check if email is already registered
    connection.query('SELECT * FROM owner WHERE email = ?', [email], (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length > 0) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
  
      // Insert new owner into database
      connection.query('INSERT INTO owner (owner_name, mobno, email, password) VALUES (?, ?, ?, ?)', [ownerName, mobileNo, email, password], (err, result) => {
        if (err) {
          throw err;
        }
        const ownerId = result.insertId;
  
        // Insert new restaurant into database
      connection.query('INSERT INTO Restaurent (res_name, owner_id) VALUES (?, ?)', [restaurantName, ownerId], (err, result) => {
          if (err) {
            throw err;
          }
          res.status(201).json({ message: 'Signup successful' });
        });
      });
    });
}

module.exports={
  signup
}