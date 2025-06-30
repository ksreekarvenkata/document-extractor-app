// src/pages/SignUpPage.js
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const SignUpPage = ({ switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    localStorage.setItem('user', JSON.stringify({ name, email, password }));
    setMessage('Account created! You can now log in.');
    setError('');
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <Card className="p-4 shadow-sm">
        <h4 className="mb-3">Sign Up</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" className="w-100 mb-2" onClick={handleSignUp}>
            Sign Up
          </Button>
          <Button variant="link" className="w-100" onClick={switchToLogin}>
            Already have an account? Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SignUpPage;
