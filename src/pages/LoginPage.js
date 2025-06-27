// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://fe79-49-206-252-213.ngrok-free.app';
const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LcqOG8rAAAAAG8xz5OthOiBzoXryF2LiCWxwPsW'; // Replace with your real key

const LoginPage = ({ onLogin }) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
    setError('');
  };

  const handleLogin = async () => {
    if (!isValidEmail(loginEmail) || !loginPassword.trim()) {
      setError('Please enter valid credentials.');
      return;
    }

    if (!captchaToken) {
      setError('Please complete the CAPTCHA.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          captcha: captchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      onLogin(data);
      setError('');
    } catch (err) {
      setError(err.message);
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
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </Form.Group>

          <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptcha} className="mb-3" />

          <Button
            onClick={handleLogin}
            variant="primary"
            className="w-100"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
