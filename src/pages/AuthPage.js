import React, { useState } from 'react';
import { Container, Card, Button, Form, Alert, Row, Col } from 'react-bootstrap';

const AuthPage = ({ onLogin }) => {
  const [activeForm, setActiveForm] = useState('login'); // 'login' or 'signup'
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // SignUp fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email === loginEmail && user.password === loginPassword) {
      onLogin(user);
    } else {
      setError('Invalid email or password.');
      setMessage('');
    }
  };

  const handleSignUp = () => {
    if (!signupName || !signupEmail || !signupPassword) {
      setError('All fields are required.');
      setMessage('');
      return;
    }
    const newUser = { name: signupName, email: signupEmail, password: signupPassword };
    localStorage.setItem('user', JSON.stringify(newUser));
    setMessage('Account created successfully! You can now login.');
    setError('');
    setActiveForm('login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #e6f0ff, #f9fafe)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container style={{ maxWidth: '450px' }}>
        <Card className="p-4 shadow rounded-4 border-0">
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-1 text-primary">Welcome to Extractor</h3>
            <p className="text-muted small mb-0">Please {activeForm === 'login' ? 'login' : 'sign up'} to continue</p>
          </div>

          {/* Toggle Buttons */}
          <Row className="mb-3">
            <Col>
              <Button
                variant={activeForm === 'login' ? 'primary' : 'outline-primary'}
                onClick={() => {
                  setActiveForm('login');
                  setMessage('');
                  setError('');
                }}
                className="w-100"
              >
                Login
              </Button>
            </Col>
            <Col>
              <Button
                variant={activeForm === 'signup' ? 'primary' : 'outline-primary'}
                onClick={() => {
                  setActiveForm('signup');
                  setMessage('');
                  setError('');
                }}
                className="w-100"
              >
                Sign Up
              </Button>
            </Col>
          </Row>

          {/* Alerts */}
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          {/* Login Form */}
          {activeForm === 'login' ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </Form.Group>
              <Button variant="primary" onClick={handleLogin} className="w-100">
                Login
              </Button>
            </Form>
          ) : (
            // Signup Form
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Enter your name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Create Password</Form.Label>
                <Form.Control
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Choose a password"
                />
              </Form.Group>
              <Button variant="success" onClick={handleSignUp} className="w-100">
                Create Account
              </Button>
            </Form>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default AuthPage;
