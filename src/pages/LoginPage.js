// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

// Use API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://10.0.0.30:3000';

const LoginPage = ({ onLogin, switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!isValidEmail(email) || !password.trim()) {
      setError('Please enter valid credentials.');
      return;
    }

    setLoading(true);

    // Debugging logs
    console.log("Connecting to:", `${API_BASE_URL}/login`);
    console.log("Using env var:", process.env.REACT_APP_API_BASE_URL);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      onLogin(data);
      setError('');
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <Card className="p-4 shadow-sm">
        <h4 className="mb-3">Login</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={email && !isValidEmail(email)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          
          <Button
            variant="primary"
            className="w-100 mb-2"
            onClick={handleLogin}
            disabled={!email || !password || !isValidEmail(email) || loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <Button variant="link" className="w-100" onClick={switchToSignUp}>
            Don’t have an account? Sign Up
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;