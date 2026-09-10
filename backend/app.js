require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const requestRoute = require('./routes/requestRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB!');
});

// API Routes
app.use('/api', requestRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
