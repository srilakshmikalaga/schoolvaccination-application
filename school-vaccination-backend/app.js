require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const studentRoutes = require('./routes/students');
const driveRoutes = require('./routes/drives');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // ✅ handles JSON request bodies
app.use(express.urlencoded({ extended: true })); // ✅ handles form-encoded data

// ✅ Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
console.log("Connecting to:", MONGO_URI);
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ✅ API Routes
app.use('/students', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});
