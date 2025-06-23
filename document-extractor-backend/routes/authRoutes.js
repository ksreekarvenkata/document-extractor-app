// /backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Import controller logic
const { login } = require('../controllers/authController');

// Define the /login route
router.post('/login', login);

module.exports = router;