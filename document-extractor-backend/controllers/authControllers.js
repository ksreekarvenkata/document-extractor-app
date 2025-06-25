// /backend/controllers/authController.js
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email === 'test@example.com' && password === 'password') {
    return res.json({
      token: 'fake-jwt-token',
      name: 'Test User'
    });
  }

  res.status(401).json({ error: 'Invalid credentials' });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Dummy register logic
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  res.json({ message: 'User registered successfully!' });
};