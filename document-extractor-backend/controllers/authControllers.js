// /backend/controllers/authController.js
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Dummy check – replace with real DB logic
  if (email === 'test@example.com' && password === 'password') {
    return res.json({
      token: 'fake-jwt-token',
      name: 'Test User'
    });
  }

  res.status(401).json({ error: 'Invalid credentials' });
};