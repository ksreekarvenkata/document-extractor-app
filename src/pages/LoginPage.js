import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

// Use API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://a861-49-206-252-213.ngrok-free.app';

const LoginPage = ({ onLogin }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState('login');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Email validation regex
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle Login
  const handleLogin = async () => {
    if (!isValidEmail(loginEmail) || !loginPassword.trim()) {
      setError('Please enter valid credentials.');
      setMessage('');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      onLogin(data); // This sets user state in App.js
      setError('');
      setShowModal(false);
    } catch (err) {
      setError(err.message);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async () => {
    console.log("Attempting to register user:", {
      firstName: signupFirstName,
      lastName: signupLastName,
      email: signupEmail,
      password: signupPassword,
    });

    if (!signupFirstName || !signupLastName || !signupEmail || !signupPassword) {
      setError('All fields are required.');
      setMessage('');
      return;
    }

    if (!isValidEmail(signupEmail)) {
      setError('Invalid email format.');
      setMessage('');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: signupFirstName,
          lastName: signupLastName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      console.log("Register response status:", response.status);

      const data = await response.json();
      console.log("Register response data:", data);

      if (!response.ok) throw new Error(data.error || 'Signup failed');

      setMessage('Account created successfully!');
      setError('');
      setActiveForm('login');
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (formType) => {
    setActiveForm(formType);
    setError('');
    setMessage('');
    setShowModal(true);
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <Card className="p-4 shadow-sm">
        <h4 className="mb-3">Sign Up</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={signupFirstName}
              required
              onChange={(e) => setSignupFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={signupLastName}
              required
              onChange={(e) => setSignupLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={signupEmail}
              required
              isInvalid={!isValidEmail(signupEmail)}
              onChange={(e) => setSignupEmail(e.target.value)}
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
              value={signupPassword}
              required
              onChange={(e) => setSignupPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="success"
            className="w-100 mb-2"
            onClick={handleSignUp}
            disabled={
              !signupFirstName ||
              !signupLastName ||
              !signupEmail ||
              !signupPassword ||
              !isValidEmail(signupEmail) ||
              loading
            }
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;