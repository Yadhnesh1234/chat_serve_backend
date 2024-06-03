const {connect_db} = require('../../db')
const bcrypt = require('bcrypt');

const login=async(req,res)=>{
    
    const connection=connect_db()
    const { role, email, password } = req.body;

    // Check if the user is a manager
    if (role === 'Manager') {
      // Query the owner table for manager login
      connection.query('SELECT * FROM owner WHERE email = ?', [email], (err, results) => {
        if (err) {
          throw err;
        }
        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials Manager' });
        }
        
        const owner = results[0];
  
        // Verify password
          if (password=== owner.password) {
            res.json({ role: 'Manager', message: 'Login successful' });
          } else {
            res.status(401).json({ error: 'Invalid credentials Manager' });
          }
      });
    } else if (role === 'Cook') {
      // Query the cook table for cook login
      connection.query('SELECT * FROM cook WHERE cook_email = ?', [email], (err, results) => {
        if (err) {
          throw err;
        }
        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials cook' });
        }
        
        const cook = results[0];
  
        // Verify password
          if (password=== cook.cook_pass) {
            res.json({ role: 'Cook', message: 'Login successful' });
          } else {
            res.status(401).json({ error: 'Invalid credentials Cook' });
          }
      });
    } else {
      res.status(400).json({ error: 'Invalid role' });
    }
}

module.exports={
  login
}