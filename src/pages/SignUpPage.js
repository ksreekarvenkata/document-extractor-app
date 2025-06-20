// src/pages/SignUpPage.js
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const SignUpPage = ({ switchToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 8;

  const handleSignUp = async () => {
    setError('');
    setMessage('');

    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://10.0.0.86:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => switchToLogin(), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-sm border-0 w-100" style={{ maxWidth: '450px' }}>
        <h3 className="text-center mb-4 fw-bold">Sign Up</h3>

        {error && <Alert variant="danger" dismissible>{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Button
            variant="success"
            className="w-100"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <Button
            variant="link"
            className="w-100 mt-3"
            onClick={switchToLogin}
            disabled={loading}
          >
            Already have an account? Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SignUpPage;
