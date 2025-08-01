require('dotenv').config();
console.log("✅ JWT_SECRET:", process.env.JWT_SECRET); // <- this should log something valid

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./backend/config/db'); // <-- update this if needed

const appointmentRoutes = require('./backend/routes/appointment'); // <-- full path if needed
const authRoutes = require('./backend/routes/auth');

const app = express();
connectDB();

const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ==== Serve static frontend files ====
app.use(express.static(path.join(__dirname, 'frontend')));

// ==== API routes ====
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// ==== Handle SPA fallback ====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET ? "YES" : "NO");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
