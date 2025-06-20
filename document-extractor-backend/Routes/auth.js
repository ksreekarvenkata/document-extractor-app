// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registration
router.post('/register', async (req, res) => {
  console.log('🔹 POST /register — body:', req.body);
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    console.warn('⚠️ Registration: Missing fields');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existing = await User.findOne({ email });
    console.log('🔍 Existing user:', existing);
    if (existing) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    console.log('✅ User created:', newUser.email);
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('❌ Register error:', err);
    return res.status(500).json({ error: 'Registration failed.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('🔹 POST /login — body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.warn('⚠️ Login: Missing credentials');
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    console.log('🔍 Login found user:', user ? user.email : null);

    if (!user || user.password !== password) {
      console.warn('🚫 Invalid credentials for:', email);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log('✅ Login successful:', email);
    return res.status(200).json({ 
      message: 'Login successful.', 
      user: { id: user._id, email: user.email, firstName: user.firstName },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;
