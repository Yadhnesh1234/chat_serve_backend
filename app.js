const express = require('express');
const cors = require('cors');
const {connect_db} = require('./src/db')
const manager=require('./src/routes/manager/auth')
const login=require('./src/routes/login')
const cook = require('./src/routes/cook/order')
require('dotenv').config();

const app = express();

// Allow all origins
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allowed HTTP methods
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization', // Allowed headers
}));


app.use(express.json())
app.use("/api/v1",manager)
app.use("/api/v1",login)
app.use("/api/v1",cook)


connect_db()

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
