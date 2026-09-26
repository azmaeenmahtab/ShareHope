const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const requestRoute = require('./routes/requestRoute');
const authRoute = require('./routes/authRoute');
const transactionRoute = require('./routes/transactionRoute');
const userRoute = require('./routes/userRoute');
const cookieParser = require('cookie-parser');
const carbonTracker = require('./middlewares/carbonTracker');

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use(express.json());
app.use(carbonTracker);

// Base Route
app.get('/', (req, res) => {
  res.send('Server is running.');
});

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/request', requestRoute);
app.use('/api/transactions', transactionRoute);
app.use('/api/user', userRoute);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database startup error:', error.message);
    process.exitCode = 1;
  }
};

startServer();
