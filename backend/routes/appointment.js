const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
  // Use the secret loaded by server.js

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log("🔐 Incoming token:", token);

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(403).json({ message: "Forbidden" });
    }

    console.log("✅ Token verified. User:", user);
    req.user = user;
    next();
  });
}

router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { doctorName, date, time } = req.body;
    const patientName = req.user.name;

    const appointment = new Appointment({ patientName, doctorName, date, time });
    await appointment.save();

    res.status(201).json({ message: "Appointment booked successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to book appointment." });
  }
});

module.exports = router;
