// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const LoginPage = ({ onLogin, switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http:localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      onLogin(data.user); // or however you want to handle login
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-sm border-0 w-100" style={{ maxWidth: '450px' }}>
        <h3 className="text-center mb-4 fw-bold">Login</h3>

        {error && <Alert variant="danger" dismissible>{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={email && !isValidEmail(email)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Button
            variant="primary"
            className="w-100"
            onClick={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <Button variant="link" className="w-100 mt-2" onClick={switchToSignUp} disabled={loading}>
            Don’t have an account? Sign Up
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
