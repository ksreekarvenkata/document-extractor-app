// src/pages/SignUpPage.js
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://fe79-49-206-252-213.ngrok-free.app';
const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LcqOG8rAAAAAG8xz5OthOiBzoXryF2LiCWxwPsW'; // Replace with your real key

const SignUpPage = ({ switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
    setError('');
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!captchaToken) {
      setError('Please complete the CAPTCHA.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          captcha: captchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Signup failed');

      setMessage('Account created! You can now log in.');
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setCaptchaToken('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
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
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              isInvalid={email && !isValidEmail(email)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptcha} className="mb-3" />

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
