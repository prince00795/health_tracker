require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();

// Updated CORS Policy to explicitly allow your actual deployed Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://health-tracker-xi-seven.vercel.app' // Tumhara naya live link
  ],
  credentials: true
}));

app.use(express.json());

connectDB();
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));