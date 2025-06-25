// /backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// ✅ Import entire controller module
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;