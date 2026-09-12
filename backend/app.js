require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const requestRoute = require('./routes/requestRoute');
const authRoute = require('./routes/authRoute');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().catch((error) => {
  console.error('Database startup error:', error.message);
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true,  
}));


app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB!');
});

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/request', requestRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
